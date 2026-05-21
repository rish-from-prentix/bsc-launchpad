import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AicIsbIntroScreen } from "@/components/aic-isb/intro-screen";
import { AicIsbProgressBar, type ProgressTask } from "@/components/aic-isb/progress-bar";
import { AicIsbTaskOne } from "@/components/aic-isb/task-one";
import { AicIsbTaskTwo } from "@/components/aic-isb/task-two";
import { AicIsbTaskThree } from "@/components/aic-isb/task-three";
import { AicIsbTaskFour } from "@/components/aic-isb/task-four";
import { AicIsbTaskFive } from "@/components/aic-isb/task-five";
import type { ThemeId } from "@/components/aic-isb/startups-data";

export const Route = createFileRoute("/simulations/aic-isb")({
  head: () => ({
    meta: [
      { title: "Program Manager Internship — AIC × ISB" },
      {
        name: "description",
        content:
          "Step into the role of a Program Manager Intern in the AIC × ISB accelerator ecosystem.",
      },
    ],
  }),
  component: AicIsbPage,
});

const TASK_TITLES = [
  "Thesis: The Basics",
  "Startup Evaluation",
  "Mentor Matching",
  "Operational Review",
  "Investment Memo",
];

function buildTasks(completed: number): ProgressTask[] {
  return TASK_TITLES.map((title, i) => {
    const index = i + 1;
    let state: ProgressTask["state"] = "locked";
    if (i < completed) state = "done";
    else if (i === completed) state = "active";
    return { index, title, state };
  });
}

function AicIsbPage() {
  const [name, setName] = useState<string | null>(null);
  // Furthest phase the student has unlocked (0 = none, 5 = all done)
  const [maxReached, setMaxReached] = useState(0);
  // Which phase is currently displayed (1-indexed). 1 means Phase 1 is on screen.
  const [currentPhase, setCurrentPhase] = useState(1);
  const [sector, setSector] = useState<ThemeId | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  if (!name) {
    return <AicIsbIntroScreen onStart={(n) => setName(n)} />;
  }

  // Progress bar shows phases as done when student has moved past them.
  // `active` = whichever phase is currently rendered.
  const tasks: ProgressTask[] = TASK_TITLES.map((title, i) => {
    const index = i + 1;
    let state: ProgressTask["state"] = "locked";
    if (index === currentPhase) state = "active";
    else if (i < maxReached) state = "done";
    return { index, title, state };
  });

  const canGoPrevious = currentPhase > 1;
  const goPrevious = () => {
    if (canGoPrevious) {
      setCurrentPhase((p) => Math.max(1, p - 1));
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const advance = (next: number) => {
    setMaxReached((m) => Math.max(m, next));
    setCurrentPhase(next + 1 > TASK_TITLES.length ? TASK_TITLES.length : next + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AicIsbProgressBar
        candidateName={name}
        tasks={tasks}
        onPrevious={goPrevious}
        canGoPrevious={canGoPrevious}
      />
      <main key={currentPhase} className="animate-[fadeSlide_0.35s_ease-out]">
        {currentPhase === 1 && (
          <AicIsbTaskOne
            candidateName={name}
            initialSector={sector}
            alreadyCompleted={maxReached >= 1}
            onComplete={(s) => {
              setSector(s);
              advance(1);
            }}
          />
        )}
        {currentPhase === 2 && sector && (
          <AicIsbTaskTwo
            candidateName={name}
            sector={sector}
            initialShortlisted={shortlistedIds}
            alreadyCompleted={maxReached >= 2}
            onComplete={(ids) => {
              setShortlistedIds(ids);
              advance(2);
            }}
          />
        )}
        {currentPhase === 3 && sector && shortlistedIds.length > 0 && (
          <AicIsbTaskThree
            candidateName={name}
            sector={sector}
            shortlistedIds={shortlistedIds}
            onComplete={() => advance(3)}
          />
        )}
        {currentPhase === 4 && sector && shortlistedIds.length > 0 && (
          <AicIsbTaskFour
            candidateName={name}
            sector={sector}
            shortlistedIds={shortlistedIds}
            onComplete={() => advance(4)}
          />
        )}
        {currentPhase === 5 && sector && shortlistedIds.length > 0 && (
          <AicIsbTaskFive
            candidateName={name}
            sector={sector}
            shortlistedIds={shortlistedIds}
            onComplete={() => setMaxReached((m) => Math.max(m, 5))}
          />
        )}
      </main>
    </div>
  );
}