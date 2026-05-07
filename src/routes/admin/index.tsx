import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { Calendar, Users, Video, Clock, ExternalLink, LogOut, Link as LinkIcon } from "lucide-react";

interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  project_type: string;
  budget: string;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  message: string | null;
  status: string;
  meet_link: string | null;
  created_at: string;
}

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | DBros" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { nav({ to: "/auth" }); return; }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
      if (!roles) { setLoading(false); return; }
      setAuthorized(true);

      const [{ data: rows }, { data: tokens }] = await Promise.all([
        supabase.from("bookings").select("*").order("scheduled_at", { ascending: true }),
        supabase.from("google_oauth_tokens").select("admin_email").maybeSingle(),
      ]);
      setBookings((rows as Booking[]) ?? []);
      setGoogleConnected(!!tokens);
      setLoading(false);
    })();
  }, [nav]);

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/auth" });
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (!error) setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  if (loading) return <main className="min-h-screen grid place-items-center text-foreground/60">Loading…</main>;
  if (!authorized)
    return (
      <main className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-foreground/60">Only the admin account can view this dashboard.</p>
          <button onClick={signOut} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Sign out</button>
        </div>
      </main>
    );

  const now = Date.now();
  const upcoming = bookings.filter((b) => new Date(b.scheduled_at).getTime() >= now && b.status !== "cancelled");
  const past = bookings.filter((b) => new Date(b.scheduled_at).getTime() < now || b.status === "cancelled");
  const totalRevenuePotential = bookings.length;
  const next7 = upcoming.filter((b) => new Date(b.scheduled_at).getTime() < now + 7 * 86400_000).length;

  return (
    <main className="min-h-screen px-6 py-12 bg-background">
      <Toaster position="bottom-center" />
      <div className="mx-auto max-w-7xl">
        <header className="flex items-center justify-between gap-4">
          <div>
            <Link to="/" className="font-display text-2xl">DBros<span className="text-accent">.</span></Link>
            <h1 className="mt-3 font-display text-3xl md:text-4xl">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/connect-google"
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {googleConnected ? "Google connected" : "Connect Google"}
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </header>

        {googleConnected === false && (
          <div className="mt-6 rounded-2xl p-5 border border-accent/30 bg-accent/5 text-sm">
            Google account is not connected yet. Bookings won't generate Meet links until you{" "}
            <Link to="/admin/connect-google" className="underline">connect Google</Link>.
          </div>
        )}

        <section className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={<Calendar />} label="Total bookings" value={totalRevenuePotential} />
          <Stat icon={<Clock />} label="Upcoming" value={upcoming.length} />
          <Stat icon={<Users />} label="Next 7 days" value={next7} />
          <Stat icon={<Video />} label="With Meet link" value={bookings.filter((b) => b.meet_link).length} />
        </section>

        <h2 className="mt-14 font-display text-2xl">Upcoming meetings</h2>
        <div className="mt-4 space-y-3">
          {upcoming.length === 0 && <p className="text-foreground/60 text-sm">No upcoming meetings.</p>}
          {upcoming.map((b) => <Row key={b.id} b={b} onStatus={setStatus} />)}
        </div>

        <h2 className="mt-14 font-display text-2xl">Past & cancelled</h2>
        <div className="mt-4 space-y-3 pb-20">
          {past.length === 0 && <p className="text-foreground/60 text-sm">No past meetings yet.</p>}
          {past.map((b) => <Row key={b.id} b={b} onStatus={setStatus} muted />)}
        </div>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-foreground/60 text-xs uppercase tracking-wider">
        <span className="[&>svg]:h-4 [&>svg]:w-4 text-accent">{icon}</span>
        {label}
      </div>
      <div className="mt-3 font-display text-4xl text-foreground">{value}</div>
    </div>
  );
}

function Row({ b, onStatus, muted }: { b: Booking; onStatus: (id: string, s: string) => void; muted?: boolean }) {
  const when = new Date(b.scheduled_at);
  const fmt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium", timeStyle: "short", timeZone: b.timezone,
  }).format(when);
  return (
    <div className={`glass rounded-2xl p-5 grid lg:grid-cols-12 gap-4 items-center ${muted ? "opacity-70" : ""}`}>
      <div className="lg:col-span-3">
        <div className="font-medium text-foreground">{b.full_name}</div>
        <div className="text-xs text-foreground/60 break-all">{b.email}</div>
        <div className="text-xs text-foreground/60">{b.phone}</div>
      </div>
      <div className="lg:col-span-3 text-sm">
        <div>{fmt}</div>
        <div className="text-xs text-foreground/60">{b.timezone} · {b.duration_minutes}m</div>
      </div>
      <div className="lg:col-span-3 text-sm">
        <div>{b.project_type} · {b.budget}</div>
        <div className="text-xs text-foreground/60">{b.country}</div>
      </div>
      <div className="lg:col-span-2 flex items-center gap-2">
        {b.meet_link ? (
          <a href={b.meet_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">
            <Video className="h-3 w-3" /> Meet <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-xs text-foreground/40">No link</span>
        )}
      </div>
      <div className="lg:col-span-1">
        <select
          value={b.status}
          onChange={(e) => onStatus(b.id, e.target.value)}
          className="w-full rounded-lg bg-card/60 px-2 py-1.5 text-xs"
        >
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {b.message && (
        <div className="lg:col-span-12 text-xs text-foreground/60 border-t border-border/50 pt-3">
          {b.message}
        </div>
      )}
    </div>
  );
}
