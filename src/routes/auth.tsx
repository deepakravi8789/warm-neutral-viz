import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Login | DBros" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <Toaster position="bottom-center" />
      <form onSubmit={submit} className="w-full max-w-md glass rounded-3xl p-8 space-y-5">
        <div>
          <Link to="/" className="font-display text-2xl">DBros<span className="text-accent">.</span></Link>
          <h1 className="mt-6 font-display text-3xl">Admin {mode === "signup" ? "sign up" : "sign in"}</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Use <code>deepakravi8789@gmail.com</code> for admin access.
          </p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-foreground/60">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl bg-card/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40" />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider text-foreground/60">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl bg-card/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40" />
        </div>
        <button disabled={loading} className="w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="text-xs text-foreground/60 hover:text-foreground">
          {mode === "signup" ? "Already have an account? Sign in" : "Need to create the admin account? Sign up"}
        </button>
      </form>
    </main>
  );
}
