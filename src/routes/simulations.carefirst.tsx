import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CarefirstSplash } from "@/components/carefirst/splash";
import { CarefirstShell } from "@/components/carefirst/carefirst-shell";
import { TaskZeroOnboarding } from "@/components/carefirst/task-00-onboarding";
import { TaskOneProblemFraming } from "@/components/carefirst/task-01-problem-framing";
import { TaskTwoJourneyMap } from "@/components/carefirst/task-02-journey-map";
import { TaskThreeTimingAnalysis } from "@/components/carefirst/task-03-timing-analysis";
import { TaskFourRootCause } from "@/components/carefirst/task-04-root-cause";
import { TaskFiveRecommendInterventions } from "@/components/carefirst/task-05-recommend-interventions";
import { TaskLockedPlaceholder } from "@/components/carefirst/task-locked";
import { CAREFIRST_TASKS, TOTAL_TASKS } from "@/components/carefirst/tasks-data";
import { PrexChatbot, type PrexContext } from "@/components/prex/prex-chatbot";

export const Route = createFileRoute("/simulations/carefirst")({
  head: () => ({
    meta: [
      { title: "Digitising Healthcare — CareFirst × PulseTech Virtual Internship" },
      {
        name: "description",
        content:
          "Step into the role of a Healthcare Business Analyst Intern at CareFirst Hospitals. Diagnose a real operational problem. Recommend a real fix. Powered by Prentix.",
      },
      {
        property: "og:title",
        content: "Digitising Healthcare — CareFirst × PulseTech Virtual Internship",
      },
      {
        property: "og:description",
        content:
          "A virtual internship for healthcare business analysts, powered by Prentix.",
      },
    ],
  }),
  component: CarefirstPage,
});

type Screen = "splash" | "workspace";

function CarefirstPage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [name, setName] = useState("");
  const [currentTask, setCurrentTask] = useState(0);
  const [submitted, setSubmitted] = useState<Set<number>>(() => new Set());

  function begin(n: string) {
    setName(n);
    setScreen("workspace");
  }

  function openTask(id: number) {
    setCurrentTask(id);
    setScreen("workspace");
  }

  function submit(id: number) {
    setSubmitted((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function goNext(id: number) {
    if (id + 1 < TOTAL_TASKS) {
      setCurrentTask(id + 1);
    }
  }

  if (screen === "splash") {
    return <CarefirstSplash onBegin={begin} />;
  }

  const meta = CAREFIRST_TASKS.find((t) => t.id === currentTask);
  const contextLabel =
    meta
      ? `Task ${String(meta.id).padStart(2, "0")} · ${meta.title}`
      : "Program";

  const prexCtx: PrexContext = meta
    ? {
        phaseLabel: `Task ${String(meta.id).padStart(2, "0")} · ${meta.title}`,
        phaseDescription: `CareFirst × PulseTech healthcare business analyst internship. Current task: ${meta.title}.`,
        suggestions: [
          `How do I approach "${meta.title}"?`,
          "What frameworks apply here?",
          "What does a strong submission look like?",
          "What common mistakes should I avoid?",
        ],
      }
    : {
        phaseLabel: "CareFirst · Program",
        phaseDescription:
          "CareFirst × PulseTech Digitising Healthcare virtual internship, Business Analyst track.",
        suggestions: [
          "What will I learn in this internship?",
          "How are the tasks structured?",
          "What does a Business Analyst actually do here?",
          "Any tips before I start Task 01?",
        ],
      };

  return (
    <AppShell
      contextLabel={contextLabel}
      onBack={() => setScreen("splash")}
    >
      <CarefirstShell
        name={name}
        currentTask={currentTask}
        submitted={submitted}
        onOpen={openTask}
      >
        <TaskScreen
          taskId={currentTask}
          submitted={submitted.has(currentTask)}
          onSubmit={() => submit(currentTask)}
          onNext={() => goNext(currentTask)}
          onBackToOverview={() => setScreen("splash")}
        />
      </CarefirstShell>
      <PrexChatbot context={prexCtx} />
    </AppShell>
  );
}

function TaskScreen({
  taskId,
  submitted,
  onSubmit,
  onNext,
  onBackToOverview,
}: {
  taskId: number;
  submitted: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onBackToOverview: () => void;
}) {
  if (taskId === 0)
    return (
      <TaskZeroOnboarding
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        onBackToOverview={onBackToOverview}
      />
    );
  if (taskId === 1)
    return (
      <TaskOneProblemFraming
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        onBackToOverview={onBackToOverview}
      />
    );
  if (taskId === 2)
    return (
      <TaskTwoJourneyMap
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        onBackToOverview={onBackToOverview}
      />
    );
  if (taskId === 3)
    return (
      <TaskThreeTimingAnalysis
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        onBackToOverview={onBackToOverview}
      />
    );
  if (taskId === 4)
    return (
      <TaskFourRootCause
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        onBackToOverview={onBackToOverview}
      />
    );
  if (taskId === 5)
    return (
      <TaskFiveRecommendInterventions
        submitted={submitted}
        onSubmit={onSubmit}
        onNext={onNext}
        onBackToOverview={onBackToOverview}
      />
    );
  return <TaskLockedPlaceholder taskId={taskId} onBackToOverview={onBackToOverview} />;
}