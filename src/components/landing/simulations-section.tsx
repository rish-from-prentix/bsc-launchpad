import { BrandMark } from "@/components/brand-mark";
import { AicIsbLogo } from "@/components/aic-isb/aic-logo";
import { TrendingUp, Award } from "lucide-react";
import { SimulationCard } from "./simulation-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SIMS = [
  {
    key: "bsc",
    logo: <BrandMark brand="bsc" height={40} />,
    company: "Bombay Shaving Company",
    role: "Growth & Business Operations Intern",
    to: "/simulations/bsc",
  },
  {
    key: "aic",
    logo: <AicIsbLogo height={36} />,
    company: "AIC × ISB",
    role: "Program Manager Internship",
    to: "/simulations/aic-isb",
  },
  {
    key: "meridian",
    logo: (
      <div className="flex items-center gap-2.5">
        <div
          className="h-10 w-10 rounded-md border border-primary/40 flex items-center justify-center text-primary text-lg font-semibold tracking-tight"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          M
        </div>
        <div className="leading-tight">
          <div className="text-[11px] uppercase tracking-[0.18em] text-foreground/90 font-semibold">
            MERIDIAN ARCHITECTURE{"\u00a0"}
          </div>
        </div>
      </div>
    ),
    company: "MERIDIAN ARCHITECTURE\u00a0",
    role: "Architecture Internship",
    to: "/simulations/architecture",
    tags: [
      { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Advanced Level" },
      { icon: <Award className="h-3.5 w-3.5" />, label: "Certificate Included" },
    ],
  },
];

export function SimulationsSection() {
  return (
    <section id="simulations" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Programs
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Explore Virtual Internships
          </h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Choose a program, step into a real role, and ship work that mirrors the job.
          </p>
        </div>

        <div className="mt-14 px-2 sm:px-10">
          <Carousel opts={{ align: "start", loop: false }} className="w-full">
            <CarouselContent className="-ml-4">
              {SIMS.map((s) => (
                <CarouselItem
                  key={s.key}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <SimulationCard
                    logo={s.logo}
                    company={s.company}
                    role={s.role}
                    to={s.to}
                    tags={s.tags}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-2 sm:-left-8" />
            <CarouselNext className="hidden sm:flex -right-2 sm:-right-8" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}