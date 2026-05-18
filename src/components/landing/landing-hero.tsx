import { ArrowRight } from "lucide-react";

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
      <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-24 sm:pt-32 pb-20 sm:pb-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Virtual Internships · 2026
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
          From classroom to career.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-primary font-medium max-w-2xl mx-auto leading-snug">
          Develop skills employers actually look for through virtual work simulations.
        </p>
        <p className="mt-6 text-[15px] sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Gain hands-on experience, build confidence, and prepare for real-world roles through
          immersive internship simulations created with top companies.
        </p>
        <div className="mt-10 flex items-center justify-center">
          <a
            href="#simulations"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}