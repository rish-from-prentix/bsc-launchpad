import { ArrowLeft, Lock, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { cn, getFirstName } from "@/lib/utils";
import { getPhaseName } from "./arch-data";

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
  completedSet,
  onPrevious,
  canGoPrevious,
}: {
  candidateName: string;
  tasks: ArchTask[];
  currentPhase: number;
  completed: number;
  completedSet?: Set<number>;
  onPrevious?: () => void;
  canGoPrevious?: boolean;
}) {
  const total = tasks.length;
  const pct = Math.round((completed / total) * 100);
  const firstName = getFirstName(candidateName);
  const active = tasks.find((t) => t.index === currentPhase) ?? tasks[0];
  const activePhaseName = getPhaseName(active.week);

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
                MERIDIAN ARCHITECTURE{"\u00a0"}
              </div>
              <div className="mt-0.5 text-[11px] text-[#e6ecff]">
                {firstName ? `${firstName}` : "Intern"} ·{" "}
                <span className="text-[#94a3c4]">
                  Phase {active.week}: {activePhaseName} · Task {active.index}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-[#94a3c4]">
              {completed} / {total} · {pct}%
            </div>
            <Link to="/" aria-label="Prentix home" className="inline-flex items-center">
              <BrandMark brand="prentix" height={16} />
            </Link>
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
            Task {active.index}: {active.title}
          </span>
        </div>

        <PhaseStepper tasks={tasks} currentWeek={active.week} completedSet={completedSet} />
      </div>
    </header>
  );
}

function PhaseStepper({
  tasks,
  currentWeek,
  completedSet,
}: {
  tasks: ArchTask[];
  currentWeek: number;
  completedSet?: Set<number>;
}) {
  const phases = [1, 2, 3, 4, 5];
  const maxReached = currentWeek;
  return (
    <div className="mt-3 grid grid-cols-5 gap-1.5">
      {phases.map((p) => {
        const tasksInPhase = tasks.filter((t) => t.week === p);
        const allDone =
          completedSet && tasksInPhase.length > 0 &&
          tasksInPhase.every((t) => completedSet.has(t.index));
        const isActive = p === currentWeek;
        const isReached = p <= maxReached;
        const name = getPhaseName(p);
        return (
          <div
            key={p}
            className={cn(
              "flex items-center gap-1.5 rounded-[3px] border px-2 py-1.5 text-[9.5px] uppercase tracking-[0.14em] transition",
              isActive
                ? "border-primary/60 bg-primary/10 text-primary"
                : allDone
                  ? "border-[#2a4a3a] bg-[#0d1a12] text-[#52c47a]"
                  : isReached
                    ? "border-[#2a3a72] bg-[#0f1a3e] text-[#c4cfe6]"
                    : "border-[#1d2a5a] bg-transparent text-[#3a4670]",
            )}
          >
            <span className="shrink-0">
              {allDone ? (
                <Check className="h-3 w-3" />
              ) : !isReached ? (
                <Lock className="h-3 w-3" />
              ) : (
                <span
                  className={cn(
                    "grid h-3 w-3 place-items-center rounded-full border",
                    isActive ? "border-primary" : "border-[#3a4670]",
                  )}
                >
                  {isActive && <span className="h-1 w-1 rounded-full bg-primary" />}
                </span>
              )}
            </span>
            <span className="truncate">
              {isActive ? `Phase ${p}: ${name}` : `Phase ${p}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}