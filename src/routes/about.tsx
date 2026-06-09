import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Prentix" },
      { name: "description", content: "Prentix builds virtual internship simulations that prepare students for real-world roles." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNav />
      <main className="flex-1 mx-auto max-w-3xl px-5 sm:px-8 py-24 sm:py-32">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">About</div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Built for the next generation of talent.
        </h1>
        <p className="mt-6 text-[15px] text-muted-foreground leading-relaxed">
          Prentix partners with leading companies to design virtual internship simulations
          that mirror the real work students will do on day one. We believe career readiness
          should be experiential — not theoretical.
        </p>
        <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
          More about our team, mission, and partners is coming soon.
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}