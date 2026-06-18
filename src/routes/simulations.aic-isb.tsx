import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AicIsbIntroScreen } from "@/components/aic-isb/intro-screen";
import { AicIsbProgressBar, type ProgressTask } from "@/components/aic-isb/progress-bar";
import { AicIsbTaskOne } from "@/components/aic-isb/task-one";
import { AicIsbTaskTwo } from "@/components/aic-isb/task-two";
import { AicIsbTaskThree } from "@/components/aic-isb/task-three";
import { AicIsbTaskFour } from "@/components/aic-isb/task-four";
import { AicIsbTaskFive } from "@/components/aic-isb/task-five";
import { AicIsbTaskNavigator } from "@/components/aic-isb/task-navigator";
import { AicIsbInboxPanel } from "@/components/aic-isb/inbox-panel";
import { EmailReader } from "@/components/aic-isb/email-reader";
import { AIC_INBOX } from "@/components/aic-isb/phase-meta";
import { THEMES, type ThemeId } from "@/components/aic-isb/startups-data";

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

function AicIsbPage() {
  const [name, setName] = useState<string | null>(null);
  // Furthest phase the student has unlocked (0 = none, 5 = all done)
  const [maxReached, setMaxReached] = useState(0);
  // Which phase is currently displayed (1-indexed). 1 means Phase 1 is on screen.
  const [currentPhase, setCurrentPhase] = useState(1);
  const [sector, setSector] = useState<ThemeId | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  // Free-navigation fallbacks so any phase is reachable even before earlier
  // phases have been completed.
  const effectiveSector: ThemeId = sector ?? "ai";
  const effectiveShortlist =
    shortlistedIds.length > 0
      ? shortlistedIds
      : THEMES[effectiveSector].bestIds;
  const [openEmailId, setOpenEmailId] = useState<string | null>(null);
  const [readEmailIds, setReadEmailIds] = useState<Set<string>>(() => new Set());

  // Auto-open the brief for the current phase as it becomes active.
  useEffect(() => {
    if (!name) return;
    const m = AIC_INBOX.find((e) => e.phase === currentPhase);
    if (m) {
      setOpenEmailId(m.id);
      setReadEmailIds((s) => {
        if (s.has(m.id)) return s;
        const n = new Set(s);
        n.add(m.id);
        return n;
      });
    }
  }, [currentPhase, name]);

  if (!name) {
    return <AicIsbIntroScreen onStart={(n) => setName(n)} />;
  }

  const openEmail = openEmailId
    ? AIC_INBOX.find((m) => m.id === openEmailId) ?? null
    : null;

  const handleOpenEmail = (id: string) => {
    setOpenEmailId(id);
    setReadEmailIds((s) => {
      if (s.has(id)) return s;
      const n = new Set(s);
      n.add(id);
      return n;
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Free navigation: nothing is locked. Completed phases show as done,
  // the current one is active, everything else is selectable.
  const tasks: ProgressTask[] = TASK_TITLES.map((title, i) => {
    const index = i + 1;
    let state: ProgressTask["state"] = "done";
    if (index === currentPhase) state = "active";
    else if (i >= maxReached) state = "locked"; // visual only — still clickable below
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
        onPhaseSelect={(p) => setCurrentPhase(p)}
        canGoPrevious={canGoPrevious}
      />
      <div className="flex">
        <AicIsbTaskNavigator
          currentPhase={currentPhase}
          maxReached={maxReached}
          onJump={(p) => setCurrentPhase(p)}
        />
        <main
          key={currentPhase}
          className="flex-1 min-w-0 animate-[fadeSlide_0.35s_ease-out]"
        >
        {openEmail ? (
          <EmailReader
            message={openEmail}
            candidateName={name}
            onClose={() => setOpenEmailId(null)}
          />
        ) : (
          <>
        {currentPhase === 1 && (
          <AicIsbTaskOne
            candidateName={name}
            onComplete={(s) => {
              setSector(s);
              advance(1);
            }}
          />
        )}
        {currentPhase === 2 && (
          <AicIsbTaskTwo
            candidateName={name}
            sector={effectiveSector}
            onComplete={(ids) => {
              setShortlistedIds(ids);
              advance(2);
            }}
          />
        )}
        {currentPhase === 3 && (
          <AicIsbTaskThree
            candidateName={name}
            sector={effectiveSector}
            shortlistedIds={effectiveShortlist}
            onComplete={() => advance(3)}
          />
        )}
        {currentPhase === 4 && (
          <AicIsbTaskFour
            candidateName={name}
            sector={effectiveSector}
            shortlistedIds={effectiveShortlist}
            onComplete={() => advance(4)}
          />
        )}
        {currentPhase === 5 && (
          <AicIsbTaskFive
            candidateName={name}
            sector={effectiveSector}
            shortlistedIds={effectiveShortlist}
            onComplete={() => setMaxReached((m) => Math.max(m, 5))}
          />
        )}
          </>
        )}
        </main>
        <AicIsbInboxPanel
          currentPhase={currentPhase}
          maxReached={maxReached}
          openId={openEmailId}
          readIds={readEmailIds}
          onOpen={handleOpenEmail}
        />
      </div>
    </div>
  );
}