import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AicIsbIntroScreen } from "@/components/aic-isb/intro-screen";
import { AicIsbProgressBar, type ProgressTask } from "@/components/aic-isb/progress-bar";
import { AicIsbTaskOne } from "@/components/aic-isb/task-one";

export const Route = createFileRoute("/simulations/aic-isb")({
  head: () => ({
    meta: [
      { title: "Program Manager Simulation — AIC × ISB" },
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
  "Demo Day Prep",
  "Investor Readout",
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

  if (!name) {
    return <AicIsbIntroScreen onStart={(n) => setName(n)} />;
  }

  const tasks = buildTasks(completed);

  return (
    <div className="min-h-screen bg-background">
      <AicIsbProgressBar candidateName={name} tasks={tasks} />
      <main>
        <AicIsbTaskOne
          candidateName={name}
          onComplete={() => setCompleted((c) => Math.max(c, 1))}
        />
      </main>
    </div>
  );
}