import { ArrowRight } from "lucide-react";
import heroHand from "@/assets/hero-hand.png.asset.json";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(93, 196, 254, 0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28 pb-20 sm:pb-28">
        {/* Hero illustration — right side, ~35% width, blends with background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden md:block w-[55%] lg:w-[45%]"
          style={{
            backgroundImage: `url(${heroHand.url})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
            maskImage:
              "radial-gradient(ellipse 75% 70% at 70% 50%, #000 45%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 70% at 70% 50%, #000 45%, transparent 80%)",
            opacity: 0.85,
          }}
        />
        {/* Mobile: faint background image */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${heroHand.url})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center right -20%",
            backgroundSize: "120% auto",
            maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
            opacity: 0.35,
          }}
        />

        <div className="relative grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] gap-10 items-center">
          <div className="text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Virtual Internships · 2026
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              From classroom to career.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary font-medium leading-snug">
              Develop skills employers actually look for through virtual internships.
            </p>
            <p className="mt-6 text-[15px] sm:text-base text-muted-foreground max-w-xl mx-auto md:mx-0 leading-relaxed">
              Gain hands-on experience, build confidence, and prepare for real-world roles
              through immersive virtual internships created with top companies.
            </p>
            <div className="mt-10 flex items-center justify-center md:justify-start">
              <a
                href="#simulations"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          {/* Spacer column to reserve space for illustration on desktop */}
          <div className="hidden md:block" />
        </div>
      </div>
    </section>
  );
}