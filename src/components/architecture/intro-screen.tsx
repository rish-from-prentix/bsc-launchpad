import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function ArchIntroScreen({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("");
  const canStart = name.trim().length > 0;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -10%, oklch(0.78 0.09 80 / 0.18), transparent 60%), radial-gradient(700px 400px at 50% 110%, oklch(0.78 0.09 80 / 0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8 pt-16 pb-24 flex flex-col items-center text-center">
        <div className="mb-10 flex items-center gap-3">
          <div
            className="h-14 w-14 rounded-md border border-primary/50 flex items-center justify-center text-primary text-2xl font-semibold"
            style={{ fontFamily: "ui-serif, Georgia, serif" }}
          >
            M
          </div>
          <div className="text-left leading-tight">
            <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/90 font-semibold">
              Meridian
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Architecture Studio
            </div>
          </div>
        </div>

        <div className="text-[10px] uppercase tracking-[0.28em] text-primary font-semibold mb-5">
          Virtual Internship Program
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">
          Architecture Internship
          <br />
          <span className="text-foreground/90">Community Learning Hub</span>
        </h1>
        <p className="mt-6 text-[15px] sm:text-base text-muted-foreground max-w-xl leading-relaxed">
          Step into the role of an Architecture Intern at Meridian Studio.
          <br />
          Take a real civic project from brief to construction defence.
        </p>

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