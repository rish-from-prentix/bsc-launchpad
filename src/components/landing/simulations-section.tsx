import { BrandMark } from "@/components/brand-mark";
import { AicIsbLogo } from "@/components/aic-isb/aic-logo";
import { SimulationCard } from "./simulation-card";

export function SimulationsSection() {
  return (
    <section id="simulations" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Programs
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Explore Our Virtual Internships
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Choose a program, step into a real role, and ship work that mirrors the job.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <SimulationCard
            logo={<BrandMark brand="bsc" height={40} />}
            company="Bombay Shaving Company"
            role="Growth & Business Operations Intern"
            to="/simulations/bsc"
          />
          <SimulationCard
            logo={<AicIsbLogo height={36} />}
            company="AIC × ISB"
            role="Program Manager Internship"
            to="/simulations/aic-isb"
          />
        </div>
      </div>
    </section>
  );
}