import { ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import { CAREFIRST_TASKS, TOTAL_TASKS, SHAREABLE_COUNT } from "./tasks-data";

export function CarefirstOverview({
  name,
  currentTask,
  submitted,
  onOpen,
}: {
  name: string;
  currentTask: number;
  submitted: Set<number>;
  onOpen: (id: number) => void;
}) {
  const nextId = CAREFIRST_TASKS.find((t) => !submitted.has(t.id))?.id ?? currentTask;
  const activeId = Math.max(nextId, currentTask);

  return (
    <div
      className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary font-semibold">
        Program Overview
      </div>
      <h1 className="mt-3 text-3xl sm:text-[34px] font-bold tracking-tight leading-tight">
        Welcome, {name}.
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground max-w-[560px] leading-relaxed">
        You’ll work through 15 tasks — from framing the problem to recommending a
        digital fix. Complete each one to unlock the next.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 text-[13px]">
        <div>
          <span className="text-foreground font-semibold">{TOTAL_TASKS} Tasks</span>
        </div>
        <span className="text-border">·</span>
        <div className="text-muted-foreground">
          <span className="text-foreground font-semibold">{SHAREABLE_COUNT} Shareable</span> Deliverables
        </div>
        <span className="text-border">·</span>
        <div className="text-muted-foreground">
          <span className="text-foreground font-semibold">1</span> Certificate
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card overflow-hidden">
        {CAREFIRST_TASKS.map((t, idx) => {
          const isDone = submitted.has(t.id);
          const isActive = t.id === activeId && !isDone;
          const isLocked = false;
          return (
            <button
              key={t.id}
              onClick={() => !isLocked && onOpen(t.id)}
              disabled={isLocked}
              className={`w-full flex items-center gap-4 px-5 py-3.5 text-left border-b border-border last:border-b-0 transition ${
                isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary/40"
              } ${isActive ? "bg-primary/5" : ""}`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold font-mono shrink-0 ${
                  isDone
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "border border-primary/40 text-primary bg-primary/5"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {String(t.id).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-foreground font-medium truncate">
                  {t.title}
                </div>
              </div>
              {t.shareable && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-primary/80">
                  <Sparkles className="h-3 w-3" /> Shareable
                </span>
              )}
              <div className="shrink-0">
                {isDone ? (
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                    <Check className="h-3 w-3" /> Completed
                  </span>
                ) : isActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                    Start <ArrowRight className="h-3 w-3" />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
              </div>
              {/* keep idx referenced for lint */}
              <span className="hidden" aria-hidden>{idx}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          onClick={() => onOpen(activeId)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {submitted.size === TOTAL_TASKS
            ? "Review tasks"
            : `Start Task ${String(activeId).padStart(2, "0")}`}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}