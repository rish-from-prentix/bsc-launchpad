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

const TASKS: ProgressTask[] = [
  { index: 1, title: "Thesis: The Basics", state: "active" },
  { index: 2, title: "Startup Evaluation", state: "locked" },
  { index: 3, title: "Mentor Matching", state: "locked" },
  { index: 4, title: "Demo Day Prep", state: "locked" },
  { index: 5, title: "Investor Readout", state: "locked" },
];

function AicIsbPage() {
  const [name, setName] = useState<string | null>(null);

  if (!name) {
    return <AicIsbIntroScreen onStart={(n) => setName(n)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AicIsbProgressBar candidateName={name} tasks={TASKS} />
      <main>
        <AicIsbTaskOne candidateName={name} />
      </main>
    </div>
  );
}