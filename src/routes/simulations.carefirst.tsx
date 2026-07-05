import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CarefirstSplash } from "@/components/carefirst/splash";
import { CarefirstOverview } from "@/components/carefirst/overview";
import { TaskZeroOnboarding } from "@/components/carefirst/task-00-onboarding";
import { TaskOneProblemFraming } from "@/components/carefirst/task-01-problem-framing";
import { TaskTwoJourneyMap } from "@/components/carefirst/task-02-journey-map";
import { TaskLockedPlaceholder } from "@/components/carefirst/task-locked";
import { CAREFIRST_TASKS, TOTAL_TASKS } from "@/components/carefirst/tasks-data";

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

type Screen = "splash" | "overview" | "task";

function CarefirstPage() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [name, setName] = useState("");
  const [currentTask, setCurrentTask] = useState(0);
  const [submitted, setSubmitted] = useState<Set<number>>(() => new Set());

  function begin(n: string) {
    setName(n);
    setScreen("overview");
  }

  function openTask(id: number) {
    setCurrentTask(id);
    setScreen("task");
  }

  function submit(id: number) {
    setSubmitted((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function goNext(id: number) {
    if (id + 1 >= TOTAL_TASKS) {
      setScreen("overview");
    } else {
      setCurrentTask(id + 1);
      setScreen("task");
    }
  }

  const backToOverview = () => setScreen("overview");

  if (screen === "splash") {
    return <CarefirstSplash onBegin={begin} />;
  }

  const meta = CAREFIRST_TASKS.find((t) => t.id === currentTask);
  const contextLabel =
    screen === "overview"
      ? "Program Overview"
      : meta
        ? `Task ${String(meta.id).padStart(2, "0")} · ${meta.title}`
        : undefined;
  const crumbs =
    screen === "task"
      ? [
          { label: "Tasks", onClick: backToOverview },
          { label: meta ? meta.title : "" },
        ]
      : undefined;

  return (
    <AppShell
      contextLabel={contextLabel}
      onBack={screen === "task" ? backToOverview : () => setScreen("splash")}
      crumbs={crumbs}
    >
      {screen === "overview" && (
        <CarefirstOverview
          name={name}
          currentTask={currentTask}
          submitted={submitted}
          onOpen={openTask}
        />
      )}
      {screen === "task" && (
        <TaskScreen
          taskId={currentTask}
          submitted={submitted.has(currentTask)}
          onSubmit={() => submit(currentTask)}
          onNext={() => goNext(currentTask)}
          onBackToOverview={backToOverview}
        />
      )}
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
  return <TaskLockedPlaceholder taskId={taskId} onBackToOverview={onBackToOverview} />;
}