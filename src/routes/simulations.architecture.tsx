import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArchIntroScreen } from "@/components/architecture/intro-screen";
import { ArchProgressBar } from "@/components/architecture/progress-bar";
import { ARCH_TASKS } from "@/components/architecture/arch-data";
import { ArchTaskOne } from "@/components/architecture/task-01-brief";
import { ArchTaskTwo } from "@/components/architecture/task-02-site";
import { ArchTaskThree } from "@/components/architecture/task-03-programme";
import { ArchTaskFour } from "@/components/architecture/task-04-concept";
import { ArchTaskFive } from "@/components/architecture/task-05-plan";
import { ArchTaskSix } from "@/components/architecture/task-06-cost";
import { ArchTaskSeven } from "@/components/architecture/task-07-sustainability";
import { ArchTaskEight } from "@/components/architecture/task-08-mep";
import { ArchTaskNine } from "@/components/architecture/task-09-rfi";
import { ArchTaskTen } from "@/components/architecture/task-10-audit";
import { ArchTaskEleven } from "@/components/architecture/task-11-crisis";
import { ArchRightPanel } from "@/components/architecture/right-panel";
import { ArchTaskNavigator } from "@/components/architecture/task-navigator";
import { MessageCenterProvider } from "@/components/architecture/message-center";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/simulations/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture Internship, Meridian Studio" },
      {
        name: "description",
        content:
          "Step into the role of an Architecture Intern at Meridian Studio and take a civic project from client brief to construction defence.",
      },
      { property: "og:title", content: "Architecture Internship, Meridian Studio" },
      {
        property: "og:description",
        content:
          "Eleven tasks from brief decoding to crisis memo, with mentor scored long-form submissions.",
      },
    ],
  }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const [name, setName] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(() => new Set());
  const [visited, setVisited] = useState<Set<number>>(() => new Set([1]));
  const [currentPhase, setCurrentPhase] = useState(1);

  if (!name) {
    return <ArchIntroScreen onStart={(n) => setName(n)} />;
  }

  const canGoPrevious = currentPhase > 1;
  const goToTask = (n: number) => {
    const target = Math.max(1, Math.min(ARCH_TASKS.length, n));
    setCurrentPhase(target);
    setVisited((v) => {
      if (v.has(target)) return v;
      const next = new Set(v);
      next.add(target);
      return next;
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrevious = () => {
    if (canGoPrevious) goToTask(currentPhase - 1);
  };
  const advance = (next: number) => {
    setCompleted((c) => {
      if (c.has(next)) return c;
      const n = new Set(c);
      n.add(next);
      return n;
    });
    goToTask(next + 1 > ARCH_TASKS.length ? ARCH_TASKS.length : next + 1);
  };

  return (
    <MessageCenterProvider>
      <div className="arch-surface min-h-screen bg-[#070a1c] text-[#e6ecff]">
      <ArchProgressBar
        candidateName={name}
        tasks={ARCH_TASKS}
        currentPhase={currentPhase}
        completed={completed.size}
        onPrevious={goPrevious}
        canGoPrevious={canGoPrevious}
      />
      <div className="flex">
        <ArchTaskNavigator
          currentPhase={currentPhase}
          completed={completed}
          visited={visited}
          onJump={goToTask}
        />
        <main className="flex-1 min-w-0">
          {([
            <ArchTaskOne onComplete={() => advance(1)} />,
            <ArchTaskTwo onComplete={() => advance(2)} />,
            <ArchTaskThree onComplete={() => advance(3)} />,
            <ArchTaskFour onComplete={() => advance(4)} />,
            <ArchTaskFive onComplete={() => advance(5)} />,
            <ArchTaskSix onComplete={() => advance(6)} />,
            <ArchTaskSeven onComplete={() => advance(7)} />,
            <ArchTaskEight onComplete={() => advance(8)} />,
            <ArchTaskNine onComplete={() => advance(9)} />,
            <ArchTaskTen onComplete={() => advance(10)} />,
            <ArchTaskEleven onComplete={() => setCompleted((c) => { const n = new Set(c); n.add(11); return n; })} />,
          ]).map((node, idx) => (
            <div key={idx} hidden={currentPhase !== idx + 1}>
              {node}
            </div>
          ))}
          <NavFooter
            currentPhase={currentPhase}
            total={ARCH_TASKS.length}
            onPrev={() => goToTask(currentPhase - 1)}
            onNext={() => goToTask(currentPhase + 1)}
          />
        </main>
        <ArchRightPanel />
      </div>
      </div>
    </MessageCenterProvider>
  );
}

function NavFooter({
  currentPhase,
  total,
  onPrev,
  onNext,
}: {
  currentPhase: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const canPrev = currentPhase > 1;
  const canNext = currentPhase < total;
  const nextLabel = canNext
    ? `Task ${currentPhase + 1} of ${total}`
    : "Final task";
  return (
    <div className="mx-auto max-w-[860px] px-6 sm:px-8 pb-10 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1d2a5a] pt-5 ">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="inline-flex items-center gap-2 rounded-[4px] border border-[#2a3a72] px-4 py-2 text-[11.5px] text-[#c4cfe6] hover:border-primary/50 hover:text-primary transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Previous Task
        </button>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#5a6a92]">
          Free navigation: skip, revisit, or edit any task
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex items-center gap-2 rounded-[4px] bg-primary px-5 py-2 text-[12px] font-semibold text-black hover:brightness-110 transition disabled:opacity-30 disabled:cursor-not-allowed border border-primary shadow-[0_0_20px_rgba(93,196,254,0.3)]"
        >
          Next Task: {nextLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}