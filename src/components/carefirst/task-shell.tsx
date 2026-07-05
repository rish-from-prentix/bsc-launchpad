import { ReactNode } from "react";
import { ArrowRight, Check, Share2, Sparkles } from "lucide-react";
import { CAREFIRST_TASKS } from "./tasks-data";

export function TaskShell({
  taskId,
  onBackToOverview,
  submitted,
  onSubmit,
  onNext,
  canSubmit = true,
  submitLabel = "Submit Task",
  hideSubmit = false,
  children,
  shareableCaption,
}: {
  taskId: number;
  onBackToOverview: () => void;
  submitted: boolean;
  onSubmit: () => void;
  onNext: () => void;
  canSubmit?: boolean;
  submitLabel?: string;
  hideSubmit?: boolean;
  children: ReactNode;
  shareableCaption?: string;
}) {
  const meta = CAREFIRST_TASKS.find((t) => t.id === taskId)!;
  const nextMeta = CAREFIRST_TASKS.find((t) => t.id === taskId + 1);
  const isLastTask = !nextMeta;

  return (
    <div
      className="mx-auto max-w-[680px] px-5 sm:px-6 py-10 sm:py-14"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="mb-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <button onClick={onBackToOverview} className="hover:text-foreground transition">
          Tasks
        </button>
        <span className="mx-2 text-muted-foreground/40">/</span>
        <span className="text-foreground/80">
          Task {String(meta.id).padStart(2, "0")} · {meta.title}
        </span>
      </div>

      <div className="space-y-6">{children}</div>

      {!hideSubmit && !submitted && (
        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            onClick={onBackToOverview}
            className="text-[12px] text-muted-foreground hover:text-foreground transition"
          >
            Save & exit
          </button>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {submitted && (
        <div
          className="mt-10 rounded-xl border border-primary/40 bg-primary/5 p-6"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Task Submitted</div>
              <div className="text-xs text-muted-foreground">
                Nice work — Task {String(meta.id).padStart(2, "0")} complete.
              </div>
            </div>
          </div>

          {meta.shareable && shareableCaption && (
            <div className="mt-5 rounded-lg border border-primary/30 bg-background/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-[10px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5">
                  <Sparkles className="h-3 w-3" /> Shareable Deliverable
                </span>
              </div>
              <div className="text-[13px] text-foreground/85 italic mb-3">
                “{shareableCaption}”
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition"
              >
                <Share2 className="h-3.5 w-3.5" /> Share to LinkedIn
              </button>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              {isLastTask ? "Back to Overview" : `Continue to Task ${String(taskId + 1).padStart(2, "0")}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}