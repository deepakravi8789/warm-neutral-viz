import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createCalendarEventWithMeet, sendGmail, ADMIN } from "@/server/google.server";

const Schema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(40),
  country: z.string().trim().min(2).max(80),
  project_type: z.string().trim().min(1).max(80),
  budget: z.string().trim().min(1).max(80),
  scheduled_at: z.string().min(10), // ISO with offset
  duration_minutes: z.number().int().min(15).max(120).default(30),
  timezone: z.string().min(1).max(80),
  message: z.string().trim().max(2000).optional().default(""),
});

export const Route = createFileRoute("/api/public/bookings")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
        }
        const data = parsed.data;
        const start = new Date(data.scheduled_at);
        if (isNaN(start.getTime())) return Response.json({ error: "Invalid date" }, { status: 400 });
        if (start.getTime() < Date.now() + 30 * 60 * 1000)
          return Response.json({ error: "Pick a time at least 30 minutes from now" }, { status: 400 });

        const end = new Date(start.getTime() + data.duration_minutes * 60_000);

        // Conflict check (±duration window)
        const winStart = new Date(start.getTime() - data.duration_minutes * 60_000).toISOString();
        const winEnd = end.toISOString();
        const { data: clash } = await supabaseAdmin
          .from("bookings")
          .select("id, scheduled_at, duration_minutes")
          .gte("scheduled_at", winStart)
          .lte("scheduled_at", winEnd)
          .in("status", ["confirmed", "pending"]);
        if (clash && clash.length > 0) {
          return Response.json(
            { error: "That slot is no longer available. Please pick another time." },
            { status: 409 },
          );
        }

        // Create calendar event + Meet link
        let eventId: string | null = null;
        let meetLink: string | null = null;
        try {
          const ev = await createCalendarEventWithMeet({
            summary: `DBros Consultation — ${data.full_name}`,
            description: [
              `Client: ${data.full_name} <${data.email}>`,
              `Phone: ${data.phone}`,
              `Country: ${data.country}`,
              `Project: ${data.project_type}`,
              `Budget: ${data.budget}`,
              `Timezone: ${data.timezone}`,
              "",
              `Message:\n${data.message || "(none)"}`,
            ].join("\n"),
            startISO: start.toISOString(),
            endISO: end.toISOString(),
            timezone: data.timezone,
            attendeeEmail: data.email,
            attendeeName: data.full_name,
          });
          eventId = ev.eventId;
          meetLink = ev.meetLink;
        } catch (e) {
          const msg = e instanceof Error ? e.message : "calendar_error";
          console.error("[bookings] calendar error:", msg);
          return Response.json(
            {
              error:
                "Could not create calendar event. The admin Google account may need to be reconnected.",
              detail: msg,
            },
            { status: 502 },
          );
        }

        // Persist booking
        const { data: inserted, error: insErr } = await supabaseAdmin
          .from("bookings")
          .insert({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            project_type: data.project_type,
            budget: data.budget,
            scheduled_at: start.toISOString(),
            duration_minutes: data.duration_minutes,
            timezone: data.timezone,
            message: data.message,
            status: "confirmed",
            google_event_id: eventId,
            meet_link: meetLink,
          })
          .select()
          .single();
        if (insErr) {
          console.error("[bookings] insert error:", insErr);
          return Response.json({ error: "Could not save booking" }, { status: 500 });
        }

        // Send emails (best-effort)
        const fmt = new Intl.DateTimeFormat("en-US", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: data.timezone,
        }).format(start);

        const clientHtml = renderClientEmail({
          name: data.full_name,
          when: fmt,
          tz: data.timezone,
          meetLink,
          message: data.message,
        });
        const adminHtml = renderAdminEmail({
          ...data,
          when: fmt,
          meetLink,
        });

        try {
          await sendGmail({ to: data.email, subject: "Your DBros consultation is confirmed", html: clientHtml });
        } catch (e) {
          console.error("[bookings] client email failed", e);
        }
        try {
          await sendGmail({
            to: ADMIN.email,
            subject: `New booking: ${data.full_name} — ${data.project_type}`,
            html: adminHtml,
          });
        } catch (e) {
          console.error("[bookings] admin email failed", e);
        }

        return Response.json({
          ok: true,
          booking: { id: inserted.id, meet_link: meetLink, scheduled_at: inserted.scheduled_at },
        });
      },
    },
  },
});

function renderClientEmail(p: { name: string; when: string; tz: string; meetLink: string | null; message: string }) {
  return `<!doctype html><html><body style="margin:0;background:#F5F5F4;font-family:Inter,Arial,sans-serif;color:#2a2622">
  <div style="max-width:560px;margin:0 auto;padding:48px 32px;background:#ffffff">
    <div style="font-family:'Playfair Display',Georgia,serif;font-size:28px;letter-spacing:-0.5px">DBros Studio</div>
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:30px;line-height:1.15;margin:24px 0 8px">Your consultation is confirmed</h1>
    <p style="font-size:15px;line-height:1.6;color:#6b6359">Hi ${escape(p.name)}, thank you for booking with DBros. We're looking forward to discussing your project.</p>
    <div style="margin:28px 0;padding:20px;border:1px solid #ece7df;border-radius:14px">
      <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#8a7f70">When</div>
      <div style="font-size:17px;margin-top:6px">${escape(p.when)}</div>
      <div style="font-size:13px;color:#8a7f70;margin-top:4px">Timezone: ${escape(p.tz)}</div>
      ${p.meetLink ? `<a href="${p.meetLink}" style="display:inline-block;margin-top:18px;background:#2a2622;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-size:14px">Join Google Meet</a>` : ""}
    </div>
    ${p.message ? `<p style="font-size:14px;color:#6b6359"><strong>Your note:</strong> ${escape(p.message)}</p>` : ""}
    <p style="font-size:13px;color:#8a7f70;margin-top:32px">If you need to reschedule, just reply to this email.</p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #ece7df;font-size:12px;color:#a59c8e">DBros — 8K Interior Visualization Studio</div>
  </div></body></html>`;
}

function renderAdminEmail(p: {
  full_name: string; email: string; phone: string; country: string;
  project_type: string; budget: string; when: string; meetLink: string | null; message: string;
}) {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a7f70;width:140px">${k}</td><td style="font-size:14px;color:#2a2622">${escape(v)}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#fff;font-family:Inter,Arial,sans-serif;color:#2a2622">
  <div style="max-width:600px;margin:0 auto;padding:32px">
    <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:24px;margin:0 0 4px">New consultation booking</h1>
    <p style="color:#8a7f70;font-size:13px;margin:0 0 20px">${escape(p.when)}</p>
    <table style="width:100%;border-collapse:collapse">
      ${row("Name", p.full_name)}${row("Email", p.email)}${row("Phone", p.phone)}
      ${row("Country", p.country)}${row("Project", p.project_type)}${row("Budget", p.budget)}
    </table>
    ${p.meetLink ? `<p style="margin-top:18px"><a href="${p.meetLink}" style="color:#2a2622">${p.meetLink}</a></p>` : ""}
    ${p.message ? `<div style="margin-top:18px;padding:16px;background:#F5F5F4;border-radius:10px;font-size:14px;line-height:1.6">${escape(p.message)}</div>` : ""}
  </div></body></html>`;
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c] as string));
}
