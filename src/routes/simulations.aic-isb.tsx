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
  const [completed, setCompleted] = useState(0);
  const [sector, setSector] = useState<ThemeId | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  if (!name) {
    return <AicIsbIntroScreen onStart={(n) => setName(n)} />;
  }

  const tasks = buildTasks(completed);

  return (
    <div className="min-h-screen bg-background">
      <AicIsbProgressBar candidateName={name} tasks={tasks} />
      <main>
        {completed < 1 && (
          <AicIsbTaskOne
            candidateName={name}
            onComplete={(s) => {
              setSector(s);
              setCompleted((c) => Math.max(c, 1));
            }}
          />
        )}
        {completed >= 1 && sector && (
          completed < 2 ? (
          <AicIsbTaskTwo
            candidateName={name}
            sector={sector}
            onComplete={(ids) => {
              setShortlistedIds(ids);
              setCompleted((c) => Math.max(c, 2));
            }}
          />
          ) : null
        )}
        {completed >= 2 && completed < 3 && sector && shortlistedIds.length > 0 && (
          <AicIsbTaskThree
            candidateName={name}
            sector={sector}
            shortlistedIds={shortlistedIds}
            onComplete={() => setCompleted((c) => Math.max(c, 3))}
          />
        )}
        {completed >= 3 && completed < 4 && sector && shortlistedIds.length > 0 && (
          <AicIsbTaskFour
            candidateName={name}
            sector={sector}
            shortlistedIds={shortlistedIds}
            onComplete={() => setCompleted((c) => Math.max(c, 4))}
          />
        )}
        {completed >= 4 && sector && shortlistedIds.length > 0 && (
          <AicIsbTaskFive
            candidateName={name}
            sector={sector}
            shortlistedIds={shortlistedIds}
            onComplete={() => setCompleted((c) => Math.max(c, 5))}
          />
        )}
      </main>
    </div>
  );
}