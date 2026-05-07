// Server-only Google OAuth + Calendar helper
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "deepakravi8789@gmail.com";
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.send",
  "openid",
  "email",
  "profile",
].join(" ");

export function getGoogleClientId() {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_CLIENT_ID not set");
  return id;
}
export function getGoogleClientSecret() {
  const s = process.env.GOOGLE_CLIENT_SECRET;
  if (!s) throw new Error("GOOGLE_CLIENT_SECRET not set");
  return s;
}

export function buildAuthUrl(redirectUri: string, state: string) {
  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
    login_hint: ADMIN_EMAIL,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCode(code: string, redirectUri: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
    id_token?: string;
  }>;
}

async function refreshAccessToken(refresh_token: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function getAdminAccessToken(): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("google_oauth_tokens")
    .select("*")
    .eq("admin_email", ADMIN_EMAIL)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Admin Google account not connected. Visit /admin/connect-google");

  const now = Date.now();
  const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : 0;
  if (data.access_token && expiresAt - 60_000 > now) return data.access_token;

  const refreshed = await refreshAccessToken(data.refresh_token);
  const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await supabaseAdmin
    .from("google_oauth_tokens")
    .update({ access_token: refreshed.access_token, expires_at: newExpiry })
    .eq("admin_email", ADMIN_EMAIL);
  return refreshed.access_token;
}

export async function saveAdminTokens(t: {
  refresh_token: string;
  access_token: string;
  expires_in: number;
  scope: string;
}) {
  const expires_at = new Date(Date.now() + t.expires_in * 1000).toISOString();
  await supabaseAdmin.from("google_oauth_tokens").upsert(
    {
      admin_email: ADMIN_EMAIL,
      refresh_token: t.refresh_token,
      access_token: t.access_token,
      expires_at,
      scope: t.scope,
    },
    { onConflict: "admin_email" },
  );
}

export interface CreateEventInput {
  summary: string;
  description: string;
  startISO: string; // UTC ISO
  endISO: string;
  timezone: string;
  attendeeEmail: string;
  attendeeName: string;
}

export async function createCalendarEventWithMeet(input: CreateEventInput) {
  const accessToken = await getAdminAccessToken();
  const requestId = crypto.randomUUID();
  const body = {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.startISO, timeZone: input.timezone },
    end: { dateTime: input.endISO, timeZone: input.timezone },
    attendees: [
      { email: input.attendeeEmail, displayName: input.attendeeName },
      { email: ADMIN_EMAIL },
    ],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
  };

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`Calendar API error: ${await res.text()}`);
  const event = (await res.json()) as {
    id: string;
    htmlLink: string;
    hangoutLink?: string;
    conferenceData?: { entryPoints?: Array<{ entryPointType: string; uri: string }> };
  };
  const meetLink =
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri ||
    null;
  return { eventId: event.id, htmlLink: event.htmlLink, meetLink };
}

export async function sendGmail(opts: {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}) {
  const accessToken = await getAdminAccessToken();
  const fromName = opts.fromName ?? "DBros Studio";
  const headers = [
    `From: ${fromName} <${ADMIN_EMAIL}>`,
    `To: ${opts.to}`,
    `Subject: ${opts.subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    opts.html,
  ].join("\r\n");
  const raw = btoa(unescape(encodeURIComponent(headers)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const txt = await res.text();
    console.error("[Gmail] send failed:", txt);
    throw new Error(`Gmail send failed: ${txt}`);
  }
  return res.json();
}

export const ADMIN = { email: ADMIN_EMAIL };
