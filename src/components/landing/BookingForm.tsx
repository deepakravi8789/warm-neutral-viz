import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Globe2, Loader2, CheckCircle2, Video } from "lucide-react";
import { toast } from "sonner";

const PROJECT_TYPES = [
  "Residential",
  "Multifamily",
  "Hospitality",
  "Commercial",
  "Retail",
  "Other",
];
const BUDGETS = [
  "< $5K",
  "$5K – $15K",
  "$15K – $50K",
  "$50K – $150K",
  "$150K+",
];
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Australia",
  "Canada",
  "United Arab Emirates",
  "Singapore",
  "Germany",
  "France",
  "India",
  "Other",
];

function todayISODate(offsetDays = 1) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const TIME_SLOTS = [
  "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export function BookingForm() {
  const detectedTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "United States",
    project_type: "Residential",
    budget: "$15K – $50K",
    date: todayISODate(1),
    time: "10:00",
    message: "",
    timezone: detectedTz,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ meet_link?: string | null } | null>(null);

  const update = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!form.full_name || !form.email || !form.phone) {
      toast.error("Please fill in your name, email and phone.");
      return;
    }
    // Build local-time ISO with offset
    const localStr = `${form.date}T${form.time}:00`;
    const localDate = new Date(localStr);
    if (isNaN(localDate.getTime())) {
      toast.error("Invalid date/time");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          project_type: form.project_type,
          budget: form.budget,
          scheduled_at: localDate.toISOString(),
          duration_minutes: 30,
          timezone: form.timezone,
          message: form.message,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || "Could not create booking");
        return;
      }
      toast.success("Booking confirmed!");
      setSuccess({ meet_link: json.booking?.meet_link });
    } catch (err) {
      toast.error("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section id="contact" className="relative py-28 md:py-40">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-12"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
            <h2 className="mt-6 font-display text-4xl text-foreground">
              Your consultation is confirmed
            </h2>
            <p className="mt-4 text-foreground/70">
              A confirmation email is on its way. We'll meet you on Google Meet at the scheduled
              time.
            </p>
            {success.meet_link && (
              <a
                href={success.meet_link}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                <Video className="h-4 w-4" />
                Open Google Meet link
              </a>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-5 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2"
        >
          <div className="text-xs uppercase tracking-[0.22em] text-accent font-medium mb-4">
            Book a Consultation
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05]">
            A 30-minute strategy call <span className="italic">on us</span>.
          </h2>
          <p className="mt-6 text-foreground/70 leading-relaxed">
            Share a few details and pick a time. We'll send a Google Meet invite to your inbox the
            moment you confirm — no back-and-forth.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-foreground/70">
            <li className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-accent" /> Auto-added to Google Calendar
            </li>
            <li className="flex items-center gap-3">
              <Video className="h-4 w-4 text-accent" /> Google Meet link generated instantly
            </li>
            <li className="flex items-center gap-3">
              <Globe2 className="h-4 w-4 text-accent" /> Detected timezone: {detectedTz}
            </li>
          </ul>
        </motion.div>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-3 glass rounded-3xl p-6 md:p-10 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full name" value={form.full_name} onChange={(v) => update("full_name", v)} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            <Input label="Phone" value={form.phone} onChange={(v) => update("phone", v)} required />
            <Select label="Country" value={form.country} options={COUNTRIES} onChange={(v) => update("country", v)} />
            <Select label="Project type" value={form.project_type} options={PROJECT_TYPES} onChange={(v) => update("project_type", v)} />
            <Select label="Budget" value={form.budget} options={BUDGETS} onChange={(v) => update("budget", v)} />
            <Input label="Preferred date" type="date" value={form.date} min={todayISODate(0)} onChange={(v) => update("date", v)} required />
            <Select label="Preferred time" value={form.time} options={TIME_SLOTS} onChange={(v) => update("time", v)} />
          </div>

          <Field label="Timezone">
            <div className="flex items-center gap-2 rounded-xl bg-card/60 px-4 py-3 text-sm text-foreground/80">
              <Globe2 className="h-4 w-4 text-accent" />
              {form.timezone}
            </div>
          </Field>

          <Field label="Project details (optional)">
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Tell us about your project, goals, timelines…"
              className="w-full rounded-xl bg-card/60 px-4 py-3 text-sm text-foreground/90 placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-accent/40"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60 w-full sm:w-auto"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
            {loading ? "Confirming…" : "Confirm consultation"}
          </button>
          <p className="text-[11px] text-foreground/50">
            By submitting you agree to receive a calendar invitation by email. We never share your
            details.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-foreground/60 mb-2">{label}</div>
      {children}
    </div>
  );
}
function Input(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <Field label={props.label}>
      <input
        type={props.type ?? "text"}
        value={props.value}
        min={props.min}
        required={props.required}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl bg-card/60 px-4 py-3 text-sm text-foreground/90 placeholder:text-foreground/40 outline-none focus:ring-2 focus:ring-accent/40"
      />
    </Field>
  );
}
function Select(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={props.label}>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl bg-card/60 px-4 py-3 text-sm text-foreground/90 outline-none focus:ring-2 focus:ring-accent/40"
      >
        {props.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}
