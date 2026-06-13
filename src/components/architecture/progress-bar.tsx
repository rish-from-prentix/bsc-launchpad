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
      className="sticky top-0 z-30 border-b border-[#2a2a2a] bg-[#0a0a0a]"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6 py-3 font-['IBM_Plex_Mono',ui-monospace,monospace]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[3px] border px-[10px] py-[4px] text-[10px] uppercase tracking-wider transition",
                canGoPrevious
                  ? "border-[#333] text-[#7a756c] hover:border-primary/60 hover:text-primary"
                  : "border-[#2a2a2a] text-[#4a4640] cursor-not-allowed",
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
              <div className="mt-0.5 text-[11px] text-[#e8e4dc]">
                {firstName ? `${firstName}` : "Intern"} ·{" "}
                <span className="text-[#7a756c]">
                  Week {active.week} · Task {active.index} · Day {active.index}
                </span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#7a756c]">
            {completed} / {total} · {pct}%
          </div>
        </div>

        <div className="mt-3 h-[3px] w-full rounded-[2px] bg-[#2a2a2a] overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, var(--primary), #a78bfa)",
            }}
          />
        </div>
        <div className="mt-[6px] flex items-center justify-between text-[9px] uppercase tracking-[0.12em]">
          <span className="text-[#e8e4dc]">
            Phase {active.index}: {active.title}
          </span>
          <span className="text-[#4a4640]">Week {active.week}</span>
        </div>
      </div>
    </header>
  );
}