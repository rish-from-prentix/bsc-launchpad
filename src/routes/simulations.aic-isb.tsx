import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/simulations/aic-isb")({
  head: () => ({
    meta: [
      { title: "Program Manager Simulation — AIC × ISB" },
      { name: "description", content: "AIC × ISB Program Manager virtual internship simulation. Coming soon." },
    ],
  }),
  component: AicIsbPage,
});

function AicIsbPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNav />
      <main className="flex-1 flex items-center justify-center px-5 py-24 text-center">
        <div className="max-w-lg">
          <span className="text-[10px] uppercase tracking-[0.22em] text-primary border border-primary/40 bg-primary/5 rounded-full px-2.5 py-1">
            Coming Soon
          </span>
          <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Program Manager Simulation
          </h1>
          <p className="mt-4 text-muted-foreground">
            We’re putting the finishing touches on this AIC × ISB experience. Check back soon.
          </p>
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}