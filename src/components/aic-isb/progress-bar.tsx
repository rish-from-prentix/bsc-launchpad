import { ArrowLeft, Check, Lock } from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";

export type TaskState = "active" | "locked" | "done";

export type ProgressTask = {
  index: number;
  title: string;
  state: TaskState;
};

export function AicIsbProgressBar({
  candidateName,
  tasks,
  onPrevious,
  canGoPrevious = false,
}: {
  candidateName: string;
  tasks: ProgressTask[];
  onPrevious?: () => void;
  canGoPrevious?: boolean;
}) {
  const completed = tasks.filter((t) => t.state === "done").length;
  const pct = Math.round((completed / tasks.length) * 100);
  const firstName = getFirstName(candidateName);

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
              aria-label="Previous phase"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                Internship Progress
              </div>
              <div className="mt-0.5 text-sm text-foreground/90">
                {firstName ? `Welcome, ${firstName}` : "AIC × ISB Accelerator"} ·{" "}
                <span className="text-muted-foreground">
                  {completed} of {tasks.length} phases complete
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-mono">{pct}%</div>
        </div>

        {/* Steps */}
        <ol className="mt-4 grid grid-cols-5 gap-2">
          {tasks.map((t) => {
            const isActive = t.state === "active";
            const isDone = t.state === "done";
            const isLocked = t.state === "locked";
            return (
              <li key={t.index} className="flex flex-col gap-1.5">
                <div
                  className={cn(
                    "h-1.5 w-full rounded-full transition-colors",
                    isDone && "bg-primary",
                    isActive && "bg-primary/80",
                    isLocked && "bg-border",
                  )}
                />
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
                      isDone && "bg-primary text-primary-foreground",
                      isActive && "border border-primary/70 text-primary bg-primary/10",
                      isLocked && "border border-border text-muted-foreground/70",
                    )}
                  >
                    {isDone ? (
                      <Check className="h-2.5 w-2.5" />
                    ) : isLocked ? (
                      <Lock className="h-2 w-2" />
                    ) : (
                      t.index
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.14em] truncate",
                      isActive ? "text-foreground font-semibold" : "text-muted-foreground",
                    )}
                  >
                    Phase {t.index}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}