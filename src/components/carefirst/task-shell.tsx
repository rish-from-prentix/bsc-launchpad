import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CAREFIRST_TASKS } from "./tasks-data";
import { CompletionMoment, RoutineCompletion } from "./completion-moment";

export function TaskShell({
  taskId,
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
  onBackToOverview?: () => void;
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
  const shareable = !!meta.shareable;
  const nextLabel = isLastTask
    ? "All tasks complete"
    : `Continue to Task ${String(taskId + 1).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-[720px] px-5 sm:px-8 py-10 sm:py-14 cf-fade-in">
      <div className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-foreground/85">
          Task {String(meta.id).padStart(2, "0")} · {meta.title}
        </span>
        {shareable && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px]"
            style={{
              background: "rgba(198,255,61,0.08)",
              border: "1px solid rgba(198,255,61,0.3)",
              color: "#C6FF3D",
            }}
          >
            Shareable
          </span>
        )}
      </div>

      <div
        className={`p-5 sm:p-7 ${shareable ? "cf-glass-elevated" : "cf-glass"}`}
      >
        <div className="space-y-6">{children}</div>

        {!hideSubmit && !submitted && (
          <div className="mt-10 flex items-center justify-end">
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="cf-btn-primary"
            >
              {submitLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {submitted && shareable && (
        <CompletionMoment
          title="Deliverable ready to share."
          subtitle={`Task ${String(meta.id).padStart(2, "0")} complete. This one goes on your portfolio.`}
          shareable
          shareableCaption={shareableCaption}
          ctaLabel={nextLabel}
          onCta={onNext}
        />
      )}

      {submitted && !shareable && (
        <RoutineCompletion ctaLabel={nextLabel} onCta={onNext} />
      )}
    </div>
  );
}