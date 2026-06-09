import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Prentix" },
      { name: "description", content: "Sign in to your Prentix account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNav />
      <main className="flex-1 flex items-center justify-center px-5 py-20">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your simulation.</p>
          <div className="mt-6 space-y-4">
            <input type="email" placeholder="you@school.edu" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            <input type="password" placeholder="Password" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
              Login
            </button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}