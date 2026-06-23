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
      className="sticky top-0 z-30 border-b border-[#1d2a5a] bg-[#070a1c]"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 py-3 ">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[3px] border px-[10px] py-[4px] text-[10px] uppercase tracking-wider transition",
                canGoPrevious
                  ? "border-[#2a3a72] text-[#94a3c4] hover:border-primary/60 hover:text-primary"
                  : "border-[#1d2a5a] text-[#3a4670] cursor-not-allowed",
              )}
              aria-label="Previous task"
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </button>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-primary font-medium">
                Meridian Architecture Studio
              </div>
              <div className="mt-0.5 text-[11px] text-[#e6ecff]">
                {firstName ? `${firstName}` : "Intern"} ·{" "}
                <span className="text-[#94a3c4]">
                  Week {active.week} · Task {active.index} · Day {active.index}
                </span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#94a3c4]">
            {completed} / {total} · {pct}%
          </div>
        </div>

        <div className="mt-3 h-[3px] w-full rounded-[2px] bg-[#1d2a5a] overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, var(--primary), #a78bfa)",
            }}
          />
        </div>
        <div className="mt-[6px] flex items-center justify-between text-[9px] uppercase tracking-[0.12em]">
          <span className="text-[#e6ecff]">
            Phase {active.index}: {active.title}
          </span>
          <span className="text-[#3a4670]">Week {active.week}</span>
        </div>
      </div>
    </header>
  );
}