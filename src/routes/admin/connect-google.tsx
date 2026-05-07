import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { CheckCircle2, AlertTriangle, Link as LinkIcon } from "lucide-react";

export const Route = createFileRoute("/admin/connect-google")({
  head: () => ({ meta: [{ title: "Connect Google | DBros Admin" }, { name: "robots", content: "noindex" }] }),
  component: ConnectGoogle,
});

function ConnectGoogle() {
  const nav = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params] = useState(() =>
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams(),
  );
  const success = params.get("success");
  const errorMsg = params.get("error");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { nav({ to: "/auth" }); return; }
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!roles);
      setAuthChecked(true);
    })();
  }, [nav]);

  async function startConnect() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/google/connect", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json?.error || "Failed");
      window.location.href = json.url;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to start connect");
      setLoading(false);
    }
  }

  if (!authChecked) return <main className="min-h-screen grid place-items-center">Loading…</main>;
  if (!isAdmin)
    return (
      <main className="min-h-screen grid place-items-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl">Not authorized</h1>
          <p className="mt-2 text-foreground/60">This area is restricted to the admin account.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Back home</Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen px-6 py-20 bg-background">
      <Toaster position="bottom-center" />
      <div className="mx-auto max-w-2xl">
        <Link to="/admin" className="text-sm text-foreground/60">← Admin dashboard</Link>
        <h1 className="mt-4 font-display text-4xl">Connect Google Calendar</h1>
        <p className="mt-3 text-foreground/70">
          One-time setup. Sign in with <strong>deepakravi8789@gmail.com</strong>. We'll store a
          secure refresh token so the backend can create Calendar events and Google Meet links for
          every booking.
        </p>

        {success && (
          <div className="mt-8 glass rounded-2xl p-6 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <div className="font-medium">Connected!</div>
              <p className="text-sm text-foreground/60">Bookings will now create Calendar events automatically.</p>
            </div>
          </div>
        )}
        {errorMsg && (
          <div className="mt-8 rounded-2xl p-6 border border-destructive/30 bg-destructive/5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <div className="font-medium text-destructive">Connect failed</div>
              <p className="text-sm text-foreground/70 break-all">{errorMsg}</p>
            </div>
          </div>
        )}

        <button
          onClick={startConnect}
          disabled={loading}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          <LinkIcon className="h-4 w-4" />
          {loading ? "Redirecting…" : success ? "Reconnect Google account" : "Connect Google account"}
        </button>
      </div>
    </main>
  );
}
