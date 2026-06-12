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
  const [maxReached, setMaxReached] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(1);

  if (!name) {
    return <ArchIntroScreen onStart={(n) => setName(n)} />;
  }

  const canGoPrevious = currentPhase > 1;
  const goPrevious = () => {
    if (canGoPrevious) {
      setCurrentPhase((p) => Math.max(1, p - 1));
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const advance = (next: number) => {
    setMaxReached((m) => Math.max(m, next));
    setCurrentPhase(next + 1 > ARCH_TASKS.length ? ARCH_TASKS.length : next + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <ArchProgressBar
        candidateName={name}
        tasks={ARCH_TASKS}
        currentPhase={currentPhase}
        completed={maxReached}
        onPrevious={goPrevious}
        canGoPrevious={canGoPrevious}
      />
      <main key={currentPhase} className="animate-[fadeSlide_0.35s_ease-out]">
        {currentPhase === 1 && <ArchTaskOne onComplete={() => advance(1)} />}
        {currentPhase === 2 && <ArchTaskTwo onComplete={() => advance(2)} />}
        {currentPhase === 3 && <ArchTaskThree onComplete={() => advance(3)} />}
        {currentPhase === 4 && <ArchTaskFour onComplete={() => advance(4)} />}
        {currentPhase === 5 && <ArchTaskFive onComplete={() => advance(5)} />}
        {currentPhase === 6 && <ArchTaskSix onComplete={() => advance(6)} />}
        {currentPhase === 7 && <ArchTaskSeven onComplete={() => advance(7)} />}
        {currentPhase === 8 && <ArchTaskEight onComplete={() => advance(8)} />}
        {currentPhase === 9 && <ArchTaskNine onComplete={() => advance(9)} />}
        {currentPhase === 10 && <ArchTaskTen onComplete={() => advance(10)} />}
        {currentPhase === 11 && (
          <ArchTaskEleven onComplete={() => setMaxReached((m) => Math.max(m, 11))} />
        )}
      </main>
    </div>
  );
}