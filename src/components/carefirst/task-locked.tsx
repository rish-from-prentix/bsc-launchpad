import { ArrowLeft, Lock } from "lucide-react";
import { CAREFIRST_TASKS } from "./tasks-data";

export function TaskLockedPlaceholder({
  taskId,
  onBackToOverview,
}: {
  taskId: number;
  onBackToOverview: () => void;
}) {
  const meta = CAREFIRST_TASKS.find((t) => t.id === taskId)!;
  return (
    <div
      className="mx-auto max-w-[680px] px-5 sm:px-6 py-16 text-center"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full border border-border bg-card mb-5">
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Task {String(meta.id).padStart(2, "0")}
      </div>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
        {meta.title}
      </h1>
      <p className="mt-4 text-[14px] text-muted-foreground max-w-[440px] mx-auto leading-relaxed">
        Tasks 06–14 will be built in the next prompt. Once ready, they will
        unlock here in sequence.
      </p>
      <button
        onClick={onBackToOverview}
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card hover:bg-secondary px-4 py-2.5 text-sm text-foreground/90 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Overview
      </button>
    </div>
  );
}