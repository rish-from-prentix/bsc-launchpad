import { useState } from "react";
import { CheckCircle2, Circle, Lock, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIC_PHASES } from "./phase-meta";

export function AicIsbTaskNavigator({
  currentPhase,
  maxReached,
  onJump,
}: {
  currentPhase: number;
  maxReached: number;
  onJump: (n: number) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(currentPhase);
  const completed = AIC_PHASES.filter((p) => p.index <= maxReached).length;
  const pct = Math.round((completed / AIC_PHASES.length) * 100);

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-border bg-card/40 sticky top-[105px] self-start max-h-[calc(100vh-105px)]">
      <div className="px-5 pt-5 pb-4 border-b border-border">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Internship Tracker
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-sm text-foreground/90 font-semibold">
            {completed} of {AIC_PHASES.length} complete
          </span>
          <span className="text-xs font-mono text-muted-foreground">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--primary), oklch(0.72 0.13 195))",
            }}
          />
        </div>
      </div>

      <ol className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5">
        {AIC_PHASES.map((p) => {
          const isCurrent = p.index === currentPhase;
          const isDone = p.index <= maxReached;
          const isLocked = false;
          const isOpen = expanded === p.index;
          return (
            <li key={p.index}>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  setExpanded(isOpen ? null : p.index);
                  if (!isLocked) onJump(p.index);
                }}
                className={cn(
                  "group w-full text-left rounded-xl border px-3.5 py-3 transition-all",
                  isCurrent
                    ? "border-primary/50 bg-primary/5 shadow-[0_4px_18px_-8px_oklch(0.55_0.18_265/_0.6)]"
                    : isDone
                      ? "border-border bg-card hover:border-primary/30"
                      : isLocked
                        ? "border-border/50 bg-transparent cursor-not-allowed opacity-60"
                        : "border-border bg-card hover:border-primary/30",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="shrink-0">
                    {isDone && !isCurrent ? (
                      <CheckCircle2 className="h-4 w-4 text-[oklch(0.7_0.14_160)]" />
                    ) : isCurrent ? (
                      <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-primary/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                    ) : isLocked ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      Phase {p.index}
                    </span>
                    <span
                      className={cn(
                        "block text-[13px] font-medium truncate",
                        isCurrent
                          ? "text-foreground"
                          : isDone
                            ? "text-foreground/85"
                            : "text-foreground/70",
                      )}
                    >
                      {p.title}
                    </span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground/60 transition-transform shrink-0",
                      isOpen && "rotate-90",
                    )}
                  />
                </div>
                {isOpen && (
                  <div className="mt-3 pl-6.5 space-y-2 animate-[fadeSlide_0.25s_ease-out]">
                    <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                      {p.summary}
                    </p>
                    {p.estimate && (
                      <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/80">
                        <Clock className="h-3 w-3" />
                        {p.estimate}
                      </div>
                    )}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
