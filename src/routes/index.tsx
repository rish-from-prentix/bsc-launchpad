import { createFileRoute } from "@tanstack/react-router";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SimulationsSection } from "@/components/landing/simulations-section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prentix — Virtual Work Internships" },
      {
        name: "description",
        content:
          "Develop employer-ready skills through immersive virtual internships from Prentix.",
      },
      { property: "og:title", content: "Prentix — Virtual Work Internships" },
      {
        property: "og:description",
        content:
          "Gain hands-on experience, build confidence, and prepare for real-world roles through Prentix.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <LandingHero />
      <SimulationsSection />
      <HowItWorks />
      <LandingFooter />
    </main>
  );
}
