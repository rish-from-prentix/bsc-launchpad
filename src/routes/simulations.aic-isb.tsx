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
import { INVESTIGATIONS } from "@/components/aic-isb/rca-investigation-data";
import { PrexChatbot, type PrexContext } from "@/components/prex/prex-chatbot";
import animeshAvatar from "@/assets/animesh.png.asset.json";
import { invokePhasePrev } from "@/components/aic-isb/phase-prev-handler";

export const Route = createFileRoute("/simulations/aic-isb")({
  head: () => ({
    meta: [
      { title: "Program Manager Internship, AIC × ISB" },
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

const AIC_PREX: Record<number, PrexContext> = {
  1: {
    phaseLabel: "Phase 1 · Thesis: The Basics",
    phaseDescription:
      "The intern is building an early investment thesis and choosing a sector (AI, Climate, or Health) for the AIC × ISB accelerator cohort.",
    suggestions: [
      "What makes a strong Investment Thesis?",
      "How do I pick the right sector?",
      "Can you show me an example thesis structure?",
      "What red flags weaken a thesis?",
    ],
  },
  2: {
    phaseLabel: "Phase 2 · Startup Evaluation",
    phaseDescription:
      "The intern is screening startups from the sector shortlist and choosing which ones to advance to the cohort.",
    suggestions: [
      "What criteria should I evaluate startups on?",
      "How do I compare two competing startups?",
      "How much weight should traction get vs team?",
      "What signals suggest a startup is not ready?",
    ],
  },
  3: {
    phaseLabel: "Phase 3 · Mentor Matching",
    phaseDescription:
      "The intern is matching shortlisted founders with mentors based on stage, domain, and gaps.",
    suggestions: [
      "How do I match a founder to the right mentor?",
      "What makes a mentor pairing succeed or fail?",
      "How do I write a good matching rationale?",
      "How many mentors should one startup have?",
    ],
  },
  4: {
    phaseLabel: "Phase 4 · Operational Review",
    phaseDescription:
      "The intern is running a root-cause investigation for a struggling cohort startup and proposing a fix.",
    suggestions: [
      "How do I run a root-cause analysis?",
      "What are the 5 Whys and when do I use them?",
      "How do I separate symptoms from causes?",
      "How do I write a crisp recommendation?",
    ],
  },
  5: {
    phaseLabel: "Phase 5 · Investment Memo",
    phaseDescription:
      "The intern is writing the final investment memo — valuation, terms, risks, and recommendation.",
    suggestions: [
      "What sections belong in an investment memo?",
      "How do I justify a valuation for an early-stage startup?",
      "How do I frame risk without killing the deal?",
      "What does a great recommendation look like?",
    ],
  },
};

const AIC_MENTOR = {
  name: "Animesh from AIC",
  avatarUrl: animeshAvatar.url,
  tagline: "AIC × ISB",
};

function AicIsbPage() {
  const [name, setName] = useState<string | null>(null);
  // Furthest phase the student has unlocked (0 = none, 5 = all done)
  const [maxReached, setMaxReached] = useState(0);
  // Which phase is currently displayed (1-indexed). 1 means Phase 1 is on screen.
  const [currentPhase, setCurrentPhase] = useState(1);
  const [sector, setSector] = useState<ThemeId | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  // Bumped when the student clicks Redo — combined into <main> key to remount.
  const [redoTick, setRedoTick] = useState(0);
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

  const baseEmail = openEmailId
    ? AIC_INBOX.find((m) => m.id === openEmailId) ?? null
    : null;
  // For Phase 4 the brief comes from the struggling cohort founder, not Animesh.
  const openEmail = baseEmail
    ? baseEmail.phase === 4
      ? (() => {
          const inv = INVESTIGATIONS[effectiveSector];
          return {
            ...baseEmail,
            senderName: inv.ceo.name,
            senderEmail: inv.ceo.email,
            senderRole: inv.ceo.role,
            initials: inv.ceo.initials,
            subject: inv.email.subject,
            body: inv.email.body,
            timestamp: inv.email.timestamp,
          };
        })()
      : baseEmail
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
    else if (i >= maxReached) state = "locked"; // visual only, still clickable below
    return { index, title, state };
  });

  const canGoPrevious = currentPhase > 1;
  const goPrevious = () => {
    // Let the current task consume the Previous action for internal
    // page navigation (e.g. thesis builder step -1) before falling
    // back to the previous phase.
    if (invokePhasePrev()) {
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (canGoPrevious) {
      setCurrentPhase((p) => Math.max(1, p - 1));
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRedo = () => {
    if (typeof window === "undefined") return;
    const ok = window.confirm(
      "Redo this task? Your saved answers for this phase will be cleared.",
    );
    if (!ok) return;
    const s = sector ?? effectiveSector;
    const ids = (shortlistedIds.length > 0 ? shortlistedIds : effectiveShortlist).join(",");
    const keysByPhase: Record<number, string[]> = {
      1: ["aic-isb:task1:v1"],
      2: [`aic-isb:task2:${s}`],
      3: [`aic-isb:task3:${s}:${ids}`],
      4: [],
      5: [`aic-isb:task5:${s}:${ids}`],
    };
    (keysByPhase[currentPhase] ?? []).forEach((k) => {
      try {
        window.localStorage.removeItem(k);
      } catch {}
    });
    if (currentPhase === 1) {
      setSector(null);
      setShortlistedIds([]);
    }
    setRedoTick((t) => t + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        onRedo={handleRedo}
      />
      <div className="flex">
        <AicIsbTaskNavigator
          currentPhase={currentPhase}
          maxReached={maxReached}
          onJump={(p) => setCurrentPhase(p)}
        />
        <main
          key={`${currentPhase}:${redoTick}`}
          className="flex-1 min-w-0 animate-[fadeSlide_0.35s_ease-out]"
        >
        {openEmail ? (
          <EmailReader
            message={openEmail}
            candidateName={name}
            onClose={() => setOpenEmailId(null)}
            ctaLabel={openEmail.phase === 2 ? "Review Shortlisted Startups" : openEmail.phase === 3 ? "Start Mentor Mapping" : openEmail.phase === 4 ? "Start your investigation" : openEmail.phase === 5 ? "Begin Evaluation" : `Start Phase ${openEmail.phase}`}
            onCta={() => setOpenEmailId(null)}
            heroTitle={openEmail.phase === 4 ? "Go save your startups now, {name}." : undefined}
            heroSubtitle={openEmail.phase === 4 ? "This Is the Moment Founders Wish They Had Someone Like You" : undefined}
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
        <aside className="hidden lg:flex w-[220px] shrink-0 flex-col border-l border-border sticky top-[105px] self-start max-h-[calc(100vh-105px)]">
          <div id="aic-isb-side-rail" className="shrink-0 max-h-[55vh] overflow-y-auto" />
          <AicIsbInboxPanel
            currentPhase={currentPhase}
            maxReached={maxReached}
            openId={openEmailId}
            readIds={readEmailIds}
            onOpen={handleOpenEmail}
            embedded
          />
        </aside>
      </div>
      <PrexChatbot
        context={{ ...(AIC_PREX[currentPhase] ?? AIC_PREX[1]), mentor: AIC_MENTOR }}
      />
    </div>
  );
}