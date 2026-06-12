import { ArrowLeft } from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";

export type ArchTask = {
  index: number;
  title: string;
  week: number;
};

export function ArchProgressBar({
  candidateName,
  tasks,
  currentPhase,
  completed,
  onPrevious,
  canGoPrevious,
}: {
  candidateName: string;
  tasks: ArchTask[];
  currentPhase: number;
  completed: number;
  onPrevious?: () => void;
  canGoPrevious?: boolean;
}) {
  const total = tasks.length;
  const pct = Math.round((completed / total) * 100);
  const firstName = getFirstName(candidateName);
  const active = tasks.find((t) => t.index === currentPhase) ?? tasks[0];

  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                canGoPrevious
                  ? "border-border text-foreground/90 hover:bg-secondary hover:border-primary/40 hover:-translate-x-0.5"
                  : "border-border/40 text-muted-foreground/40 cursor-not-allowed",
              )}
              aria-label="Previous task"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                Architecture Internship
              </div>
              <div className="mt-0.5 text-sm text-foreground/90">
                {firstName ? `Welcome, ${firstName}` : "Meridian Studio"} ·{" "}
                <span className="text-muted-foreground">
                  Week {active.week} · Task {active.index} of {total}
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            {completed} / {total} · {pct}%
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
          <span className="text-foreground/85 font-semibold">
            Phase {active.index}: {active.title}
          </span>
          <span className="text-muted-foreground font-mono">Week {active.week}</span>
        </div>
      </div>
    </header>
  );
}