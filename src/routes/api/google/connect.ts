import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildAuthUrl } from "@/server/google.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/google/connect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Authenticate caller via Supabase JWT bearer; require admin role
        const auth = request.headers.get("authorization") || "";
        const token = auth.replace(/^Bearer\s+/i, "");
        if (!token) return new Response("Unauthorized", { status: 401 });
        const { data: userRes } = await supabaseAdmin.auth.getUser(token);
        const user = userRes?.user;
        if (!user) return new Response("Unauthorized", { status: 401 });
        const { data: role } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (!role) return new Response("Forbidden", { status: 403 });

        const url = new URL(request.url);
        const redirectUri = `${url.origin}/api/google/callback`;
        const state = crypto.randomUUID();
        return Response.json({ url: buildAuthUrl(redirectUri, state) });
      },
    },
  },
});
