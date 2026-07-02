import { CheckCircle2, Circle, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARCH_TASKS, type ArchTaskMeta, getPhaseName } from "./arch-data";

const MONO = "";

export function ArchTaskNavigator({
  currentPhase,
  completed,
  visited,
  onJump,
}: {
  currentPhase: number;
  completed: Set<number>;
  visited: Set<number>;
  onJump: (n: number) => void;
}) {
  const byWeek = new Map<number, ArchTaskMeta[]>();
  for (const t of ARCH_TASKS) {
    const arr = byWeek.get(t.week) ?? [];
    arr.push(t);
    byWeek.set(t.week, arr);
  }
  const weeks = Array.from(byWeek.keys()).sort((a, b) => a - b);

  return (
    <aside className="hidden md:block w-[230px] shrink-0 border-r border-[#1d2a5a] bg-[#0a1024] sticky top-[78px] self-start max-h-[calc(100vh-78px)] overflow-y-auto">
      <div className={cn("px-4 py-4 text-[9px] uppercase tracking-[0.18em] text-primary border-b border-[#1f1f1f]", MONO)}>
        Task Navigator
      </div>
      <div className="px-2 py-3 space-y-4">
        {weeks.map((w) => (
          <div key={w}>
            <div className={cn("px-3 mb-1 text-[9px] uppercase tracking-[0.16em] text-[#5a6a92]", MONO)}>
              Phase {w} · {getPhaseName(w)}
            </div>
            <ul className="space-y-0.5">
              {byWeek.get(w)!.map((t) => {
                const isCurrent = t.index === currentPhase;
                const isDone = completed.has(t.index);
                const isInProgress = !isDone && (visited.has(t.index) || isCurrent);
                return (
                  <li key={t.index}>
                    <button
                      type="button"
                      onClick={() => onJump(t.index)}
                      className={cn(
                        "group w-full text-left flex items-start gap-2 rounded-[4px] px-3 py-2 transition",
                        isCurrent
                          ? "bg-primary/10 border border-primary/40"
                          : "border border-transparent hover:bg-[#0f1a3e] hover:border-[#1d2a5a]",
                      )}
                    >
                      <span className="mt-[2px] shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#52c47a]" />
                        ) : isInProgress ? (
                          <Dot className="h-3.5 w-3.5 text-primary" strokeWidth={6} />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-[#3a3631]" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-[10px] tracking-wider", MONO, isCurrent ? "text-primary" : "text-[#6a655d]")}>
                          Task {t.index}
                        </span>
                        <span className={cn("block text-[11.5px] leading-snug", isCurrent ? "text-[#ffffff]" : "text-[#c4cfe6] group-hover:text-[#e6ecff]")}>
                          {t.title}
                        </span>
                        <span className={cn("block mt-0.5 text-[9px] uppercase tracking-wider", MONO,
                          isDone ? "text-[#52c47a]" : isInProgress ? "text-primary/80" : "text-[#48433c]")}>
                          {isDone ? "Completed" : isInProgress ? "In progress" : "Not started"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}