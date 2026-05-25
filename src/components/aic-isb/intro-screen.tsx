import { useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import { AicIsbLogo } from "./aic-logo";

export function AicIsbIntroScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const canStart = name.trim().length > 0;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -10%, oklch(0.78 0.09 80 / 0.18), transparent 60%), radial-gradient(700px 400px at 50% 110%, oklch(0.78 0.09 80 / 0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8 pt-16 pb-24 flex flex-col items-center text-center">
        <AicIsbLogo height={56} className="mb-10" />

        <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-semibold mb-5">
          Virtual Internship Program
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
          AIC × ISB
          <br />
          <span className="text-foreground/90">Virtual Internship Program</span>
        </h1>
        <p className="mt-6 text-[15px] sm:text-base text-muted-foreground max-w-xl leading-relaxed">
          Step into the role of a Program Manager Intern.
          <br />
          Make real decisions. See real consequences.
        </p>

        {/* Video placeholder */}
        <div className="mt-12 w-full max-w-xl">
          <div
            className="group relative rounded-2xl overflow-hidden border border-border bg-card aspect-[16/9]"
            style={{
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.45), 0 0 0 1px oklch(0.78 0.09 80 / 0.08)",
              animation: "softPulse 3.2s ease-in-out infinite",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% 50%, oklch(0.78 0.09 80 / 0.15), transparent 70%), linear-gradient(135deg, oklch(0.18 0 0), oklch(0.13 0 0))",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                type="button"
                className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl transition-transform group-hover:scale-110"
                aria-label="Play welcome video"
              >
                <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        {/* Name input */}
        <div className="mt-12 w-full max-w-md">
          <label className="block text-left">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
              Enter your name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && canStart) onStart(name.trim());
              }}
              className="mt-2 w-full rounded-xl border border-border bg-card px-5 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            />
          </label>

          <button
            type="button"
            disabled={!canStart}
            onClick={() => onStart(name.trim())}
            className="mt-5 group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{ boxShadow: "0 10px 30px -10px oklch(0.78 0.09 80 / 0.5)" }}
          >
            Start Internship
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}