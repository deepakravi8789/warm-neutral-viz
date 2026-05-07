import { createFileRoute } from "@tanstack/react-router";
import { exchangeCode, saveAdminTokens } from "@/server/google.server";

export const Route = createFileRoute("/api/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        if (error) return redirectHtml(`/admin/connect-google?error=${encodeURIComponent(error)}`);
        if (!code) return redirectHtml("/admin/connect-google?error=missing_code");
        try {
          const redirectUri = `${url.origin}/api/google/callback`;
          const tokens = await exchangeCode(code, redirectUri);
          if (!tokens.refresh_token) {
            return redirectHtml(
              "/admin/connect-google?error=no_refresh_token_revoke_app_and_retry",
            );
          }
          await saveAdminTokens({
            refresh_token: tokens.refresh_token,
            access_token: tokens.access_token,
            expires_in: tokens.expires_in,
            scope: tokens.scope,
          });
          return redirectHtml("/admin/connect-google?success=1");
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown";
          console.error("[google/callback]", msg);
          return redirectHtml(`/admin/connect-google?error=${encodeURIComponent(msg)}`);
        }
      },
    },
  },
});

function redirectHtml(to: string) {
  return new Response(null, { status: 302, headers: { Location: to } });
}
