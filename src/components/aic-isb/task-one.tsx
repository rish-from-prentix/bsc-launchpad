import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  ShieldCheck,
  Brain,
  Leaf,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
  CircleCheck,
  Copy,
  Check,
  Save,
  Loader2,
  AlertTriangle,
  RotateCcw,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send as SendIcon,
} from "lucide-react";
import { AicIsbLogo } from "./aic-logo";
import { cn, getFirstName } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { scoreThesis, type ThesisScores } from "@/lib/score-thesis.functions";

type Sector = "ai" | "climate" | "health";

const SECTORS: Array<{
  id: Sector;
  name: string;
  blurb: string;
  tag: string;
  icon: React.ReactNode;
}> = [
  {
    id: "ai",
    name: "AI & SaaS",
    blurb: "Foundation models, vertical SaaS, agentic workflows.",
    tag: "High momentum",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "climate",
    name: "ClimateTech & Sustainability",
    blurb: "Decarbonisation, circular economy, climate finance.",
    tag: "Policy tailwinds",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    id: "health",
    name: "HealthTech",
    blurb: "Digital health, diagnostics, care delivery models.",
    tag: "Care delivery shift",
    icon: <HeartPulse className="h-5 w-5" />,
  },
];

const SECTOR_HASHTAG: Record<Sector, string> = {
  ai: "#AISaaS",
  climate: "#ClimateTech",
  health: "#HealthTech",
};

type SectionId =
  | "overview"
  | "problems"
  | "activity"
  | "risks"
  | "recommendation";

const SECTIONS: Array<{
  id: SectionId;
  emoji: string;
  tag: string;
  question: string;
  hint: string;
  placeholder: string;
}> = [
  {
    id: "overview",
    emoji: "📌",
    tag: "The opportunity",
    question:
      "What's happening in this sector right now that makes it impossible to ignore?",
    hint: "Think about what's shifted — policy, technology, behaviour, capital. Why is this moment different?",
    placeholder:
      "e.g. Regulation X just passed, capital is flowing into Y, customer behaviour shifted after Z…",
  },
  {
    id: "problems",
    emoji: "🔍",
    tag: "Where startups should play",
    question:
      "If you were a founder entering this space today, where would you place your bet?",
    hint: "Go specific. Which problem is big enough, underserved enough, and solvable enough to build a company around?",
    placeholder: "Name the wedge. Who is the buyer? What does the first product do?",
  },
  {
    id: "activity",
    emoji: "📊",
    tag: "What the market is saying",
    question: "Who's already in the room — and what are they betting on?",
    hint: "Name startups, investors, or deals that signal where the smart money is going. What does activity in this space tell you?",
    placeholder:
      "Companies, recent rounds, active investors, and what their bets imply about the sector…",
  },
  {
    id: "risks",
    emoji: "⚡",
    tag: "Risks worth taking",
    question: "What could go wrong — and why are you backing this anyway?",
    hint: "Every thesis has a bear case. Acknowledge it honestly, then explain why the upside still wins.",
    placeholder: "Bear case + why you'd still write the check.",
  },
  {
    id: "recommendation",
    emoji: "✅",
    tag: "My recommendation",
    question:
      "If you had one shot to convince the AIC × ISB board — what would you tell them?",
    hint: "This is your conviction statement. Make it decisive, make it yours.",
    placeholder: "Your one-paragraph pitch to the board.",
  },
];

type Answers = Record<SectionId, string>;

const EMPTY_ANSWERS: Answers = {
  overview: "",
  problems: "",
  activity: "",
  risks: "",
  recommendation: "",
};

const STORAGE_KEY = "aic-isb:task1:v1";

type Persisted = {
  sector: Sector | null;
  answers: Answers;
};

function loadPersisted(): Persisted {
  if (typeof window === "undefined") return { sector: null, answers: EMPTY_ANSWERS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sector: null, answers: EMPTY_ANSWERS };
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      sector: parsed.sector ?? null,
      answers: { ...EMPTY_ANSWERS, ...(parsed.answers ?? {}) },
    };
  } catch {
    return { sector: null, answers: EMPTY_ANSWERS };
  }
}

const wordCount = (s: string) =>
  s.trim().length === 0 ? 0 : s.trim().split(/\s+/).length;

const MIN_WORDS = 20;

export function AicIsbTaskOne({
  candidateName,
  onComplete,
}: {
  candidateName: string;
  onComplete?: (sector: Sector) => void;
}) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [revealSector, setRevealSector] = useState(false);
  const [revealBuilder, setRevealBuilder] = useState(false);
  const [sector, setSector] = useState<Sector | null>(null);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [stepIdx, setStepIdx] = useState(0);
  const [submittedSteps, setSubmittedSteps] = useState<Set<SectionId>>(
    () => new Set(),
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [evalState, setEvalState] = useState<
    "idle" | "loading" | "done"
  >("idle");
  const [scores, setScores] = useState<ThesisScores | null>(null);
  const [postCopied, setPostCopied] = useState(false);
  const saveTimer = useRef<number | null>(null);

  const sectorRef = useRef<HTMLDivElement | null>(null);
  const builderRef = useRef<HTMLDivElement | null>(null);
  const evalRef = useRef<HTMLDivElement | null>(null);

  const callScore = useServerFn(scoreThesis);

  // Hydrate
  useEffect(() => {
    const p = loadPersisted();
    setSector(p.sector);
    setAnswers(p.answers);
    // Mark steps as submitted if they already have enough content
    const done = new Set<SectionId>();
    SECTIONS.forEach((s) => {
      if (wordCount(p.answers[s.id]) >= MIN_WORDS) done.add(s.id);
    });
    setSubmittedSteps(done);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("ready"), 1100);
    return () => window.clearTimeout(t);
  }, []);

  // Autosave
  useEffect(() => {
    if (typeof window === "undefined") return;
    setSaveState("saving");
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ sector, answers }),
        );
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, 600);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [sector, answers]);

  const greetingName = getFirstName(candidateName) || "there";
  const todayLabel = useMemo(() => "Today · 9:30 AM", []);

  const currentSection = SECTIONS[stepIdx];
  const currentWords = wordCount(answers[currentSection.id]);
  const meetsMin = currentWords >= MIN_WORDS;

  function handleAnswer(id: SectionId, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleBegin() {
    setRevealSector(true);
    setTimeout(
      () => sectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  }

  function handleBuildThesis() {
    if (!sector) return;
    setRevealBuilder(true);
    setTimeout(
      () =>
        builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  }

  function handleNext() {
    if (!meetsMin) return;
    setSubmittedSteps((prev) => {
      const next = new Set(prev);
      next.add(currentSection.id);
      return next;
    });
    if (stepIdx < SECTIONS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      runEvaluation();
    }
  }

  async function runEvaluation() {
    if (!sector) return;
    setEvalState("loading");
    setTimeout(
      () => evalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
    try {
      const res = await callScore({ data: { sector, answers } });
      setScores(res);
      setEvalState("done");
    } catch (e) {
      console.error(e);
      setScores({
        market: 0,
        opportunity: 0,
        recommendation: 0,
        overall: 0,
        feedback: "Something went wrong. Please try again.",
        error: "network_error",
      });
      setEvalState("done");
    }
  }

  function handleTryAgain() {
    setEvalState("idle");
    setScores(null);
    setStepIdx(0);
    setTimeout(
      () =>
        builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  }

  function handleSubmitThesis() {
    if (!sector) return;
    onComplete?.(sector);
  }

  function handleChangeSector() {
    if (
      !window.confirm(
        "Changing sector will clear your current answers. Continue?",
      )
    )
      return;
    setSector(null);
    setAnswers(EMPTY_ANSWERS);
    setSubmittedSteps(new Set());
    setStepIdx(0);
    setRevealBuilder(false);
    setEvalState("idle");
    setScores(null);
    setTimeout(
      () => sectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  }

  function handleSaveDraft() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ sector, answers }),
      );
      setSaveState("saved");
    } catch {
      /* noop */
    }
  }

  const linkedInPost = useMemo(
    () => buildLinkedInPost(sector, answers, submittedSteps),
    [sector, answers, submittedSteps],
  );

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(linkedInPost.plain);
      setPostCopied(true);
      setTimeout(() => setPostCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  const sectorMeta = sector ? SECTORS.find((s) => s.id === sector) : null;
  const passed = scores ? scores.overall >= 6 : false;

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14 pb-24 relative">
      {/* Title block */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Phase 1 of 5
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Phase 1 · Thesis: The Basics
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Estimated Time: 20–30 mins
        </div>
      </div>

      {/* Email */}
      {phase === "loading" ? (
        <ReceivingState />
      ) : (
        <EmailCard
          candidateName={greetingName}
          timestamp={todayLabel}
          onBegin={handleBegin}
          begun={revealSector}
        />
      )}

      {/* Sector selection */}
      {revealSector && (
        <section
          ref={sectorRef}
          className="mt-16 scroll-mt-8"
          style={{ animation: "fadeSlide 500ms ease-out" }}
        >
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Step 1 · Pick your sector
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Before you back a startup, you need a point of view. Start here.
          </h2>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {SECTORS.map((s) => {
              const selected = sector === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSector(s.id)}
                  className={cn(
                    "group text-left rounded-xl border p-5 transition-all",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary",
                      )}
                    >
                      {s.icon}
                    </div>
                    {selected && <CircleCheck className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="mt-4 text-sm font-semibold text-foreground">
                    {s.name}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {s.blurb}
                  </div>
                  <div className="mt-3 inline-flex items-center text-[10px] uppercase tracking-[0.18em] text-primary border border-primary/30 bg-primary/5 rounded-full px-2 py-0.5">
                    {s.tag}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={!sector}
              onClick={handleBuildThesis}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition",
                !sector && "opacity-40 cursor-not-allowed",
              )}
            >
              Build my thesis <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {/* Thesis builder slide */}
      {revealBuilder && sector && sectorMeta && (
        <section
          ref={builderRef}
          className="mt-16 scroll-mt-8"
          style={{ animation: "fadeSlide 500ms ease-out" }}
        >
          <SlideBuilder
            sectorMeta={sectorMeta}
            stepIdx={stepIdx}
            answers={answers}
            currentWords={currentWords}
            meetsMin={meetsMin}
            onChange={handleAnswer}
            onNext={handleNext}
            onBack={() => stepIdx > 0 && setStepIdx((i) => i - 1)}
            submittedSteps={submittedSteps}
            linkedInPost={linkedInPost}
            onCopyPost={copyPost}
            postCopied={postCopied}
            saveState={saveState}
            onSaveDraft={handleSaveDraft}
            onChangeSector={handleChangeSector}
            evalLoading={evalState === "loading"}
          />
        </section>
      )}

      {/* Evaluation */}
      {(evalState === "loading" || evalState === "done") && (
        <section
          ref={evalRef}
          className="mt-16 scroll-mt-8"
          style={{ animation: "fadeSlide 500ms ease-out" }}
        >
          <EvaluationPanel
            state={evalState}
            scores={scores}
            passed={passed}
            linkedInPost={linkedInPost}
            onCopyPost={copyPost}
            postCopied={postCopied}
            onTryAgain={handleTryAgain}
            onSubmit={handleSubmitThesis}
          />
        </section>
      )}
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function ReceivingState() {
  return (
    <div className="rounded-2xl border border-border bg-card/60 px-5 py-6 flex items-center gap-3">
      <div className="flex gap-1">
        <Dot delay="0s" />
        <Dot delay="0.15s" />
        <Dot delay="0.3s" />
      </div>
      <div className="text-sm text-muted-foreground">Receiving email from Animesh…</div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-primary inline-block"
      style={{ animation: "softPulse 1.2s ease-in-out infinite", animationDelay: delay }}
    />
  );
}

function EmailCard({
  candidateName,
  timestamp,
  onBegin,
  begun,
}: {
  candidateName: string;
  timestamp: string;
  onBegin: () => void;
  begun: boolean;
}) {
  return (
    <article
      className="rounded-2xl border border-border overflow-hidden"
      style={{
        background: "linear-gradient(180deg, oklch(0.21 0 0), oklch(0.16 0 0))",
        boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
      }}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-border/70">
        <div className="relative h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">Animesh</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">CEO, AIC × ISB</span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-primary border border-primary/40 bg-primary/5 rounded-full px-1.5 py-0.5">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
            <AicIsbLogo height={14} className="ml-1 opacity-80" />
          </div>
          <div className="mt-1 text-[13px] font-medium text-foreground">
            Your first brief — pick a sector, build a thesis
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            To: {candidateName} · {timestamp}
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-6 text-[14.5px] leading-[1.8] text-foreground/90">
        <p>Hi {candidateName},</p>
        <p className="mt-3">
          Really glad to have you on board. You're joining at an exciting time — we're
          shaping the next AIC × ISB cohort, and I want fresh thinking involved from day
          one.
        </p>
        <p className="mt-3">
          Here's what I need from you first: pick one of the three sectors below based on
          your research and build an Accelerator Investment Thesis around it. Think of it
          as your POV — where the opportunity is, why now, and what kind of startups
          deserve backing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-foreground/85"
            >
              {s.icon}
              {s.name}
            </span>
          ))}
        </div>
        <p className="mt-4">
          Take your time, do the research, and come back with something you'd genuinely
          stand behind.
        </p>
        <p className="mt-3">Looking forward to seeing your thinking.</p>
        <p className="mt-5 text-foreground font-medium">Animesh</p>
        <p className="text-xs text-muted-foreground">CEO — AIC × ISB</p>

        <div className="mt-6 pt-5 border-t border-border/60">
          <button
            type="button"
            onClick={onBegin}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            {begun ? "Continue below" : "Begin"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Slide builder ---------------- */

function SlideBuilder({
  sectorMeta,
  stepIdx,
  answers,
  currentWords,
  meetsMin,
  onChange,
  onNext,
  onBack,
  submittedSteps,
  linkedInPost,
  onCopyPost,
  postCopied,
  saveState,
  onSaveDraft,
  onChangeSector,
  evalLoading,
}: {
  sectorMeta: (typeof SECTORS)[number];
  stepIdx: number;
  answers: Answers;
  currentWords: number;
  meetsMin: boolean;
  onChange: (id: SectionId, v: string) => void;
  onNext: () => void;
  onBack: () => void;
  submittedSteps: Set<SectionId>;
  linkedInPost: { sections: Array<{ emoji: string; tag: string; text: string }>; hashtags: string[]; plain: string };
  onCopyPost: () => void;
  postCopied: boolean;
  saveState: "idle" | "saving" | "saved";
  onSaveDraft: () => void;
  onChangeSector: () => void;
  evalLoading: boolean;
}) {
  const section = SECTIONS[stepIdx];
  const isLast = stepIdx === SECTIONS.length - 1;

  return (
    <div>
      <div
        className="rounded-2xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
      >
        {/* Slide header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border bg-background/30">
          <div className="flex items-center gap-2">
            <AicIsbLogo height={16} />
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Accelerator Investment Thesis
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] text-primary">
            {sectorMeta.icon}
            {sectorMeta.name}
          </span>
        </div>

        {/* Two panes */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left pane — guided questions */}
          <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-border">
            {/* Step pips */}
            <div className="flex items-center gap-1.5">
              {SECTIONS.map((s, i) => {
                const done = submittedSteps.has(s.id);
                const active = i === stepIdx;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      done
                        ? "bg-primary"
                        : active
                          ? "bg-primary/60"
                          : "bg-border",
                    )}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>Step {stepIdx + 1} of {SECTIONS.length}</span>
              <span>
                {submittedSteps.size}/{SECTIONS.length} submitted
              </span>
            </div>

            {/* Question */}
            <div className="mt-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] text-foreground/80">
                <span>{section.emoji}</span>
                <span className="uppercase tracking-[0.14em] text-[10px]">
                  {section.tag}
                </span>
              </div>
              <h3 className="mt-3 text-[17px] sm:text-lg font-semibold text-foreground leading-snug">
                {section.question}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {section.hint}
              </p>
            </div>

            <textarea
              value={answers[section.id]}
              onChange={(e) => onChange(section.id, e.target.value)}
              placeholder={section.placeholder}
              rows={7}
              className="mt-4 w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-[14px] leading-[1.7] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition resize-y"
            />

            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span
                className={cn(
                  "font-mono",
                  meetsMin ? "text-[oklch(0.78_0.14_155)]" : "text-muted-foreground",
                )}
              >
                {meetsMin ? (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {currentWords} words · ready
                  </span>
                ) : (
                  <>
                    {currentWords}/{MIN_WORDS} words
                  </>
                )}
              </span>
              {saveState === "saved" && (
                <span className="text-muted-foreground">Draft saved</span>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={stepIdx === 0}
                className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!meetsMin || evalLoading}
                onClick={onNext}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition",
                  (!meetsMin || evalLoading) && "opacity-40 cursor-not-allowed",
                )}
              >
                {evalLoading && isLast ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Evaluating…
                  </>
                ) : isLast ? (
                  <>
                    Evaluate <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right pane — LinkedIn post preview */}
          <div className="p-5 sm:p-7 bg-background/20">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
              Live LinkedIn preview
            </div>
            <LinkedInPreview post={linkedInPost} />
            <button
              type="button"
              onClick={onCopyPost}
              disabled={linkedInPost.sections.length === 0}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {postCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy post
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slim footer */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <div>
          Step {stepIdx + 1} of {SECTIONS.length} ·{" "}
          <button
            type="button"
            onClick={onChangeSector}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Change sector
          </button>
        </div>
        <button
          type="button"
          onClick={onSaveDraft}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-secondary px-2.5 py-1.5 text-foreground/80 transition"
        >
          <Save className="h-3 w-3" /> Save draft
        </button>
      </div>
    </div>
  );
}

function LinkedInPreview({
  post,
}: {
  post: { sections: Array<{ emoji: string; tag: string; text: string }>; hashtags: string[]; plain: string };
}) {
  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="h-9 w-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-xs font-semibold">
          You
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-foreground">
            Program Manager Intern
          </div>
          <div className="text-[11px] text-muted-foreground">
            AIC × ISB · Just now · 🌐
          </div>
        </div>
      </div>
      <div className="px-4 py-4 text-[13px] leading-[1.7] text-foreground/90 space-y-3 min-h-[220px]">
        {post.sections.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">
            Your thesis will appear here as you answer each question…
          </div>
        ) : (
          post.sections.map((s, i) => (
            <div key={i}>
              <div className="text-[12px] font-semibold text-foreground">
                {s.emoji} {s.tag}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-foreground/85">{s.text}</p>
            </div>
          ))
        )}
        {post.hashtags.length > 0 && (
          <p className="text-primary text-[12px] pt-1">
            {post.hashtags.join(" ")}
          </p>
        )}
      </div>
      <div className="flex items-center justify-around px-2 py-2 border-t border-border text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ThumbsUp className="h-3.5 w-3.5" /> Like
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5" /> Comment
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Repeat2 className="h-3.5 w-3.5" /> Repost
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SendIcon className="h-3.5 w-3.5" /> Send
        </span>
      </div>
    </div>
  );
}

/* ---------------- Evaluation ---------------- */

function EvaluationPanel({
  state,
  scores,
  passed,
  linkedInPost,
  onCopyPost,
  postCopied,
  onTryAgain,
  onSubmit,
}: {
  state: "loading" | "done";
  scores: ThesisScores | null;
  passed: boolean;
  linkedInPost: { sections: Array<{ emoji: string; tag: string; text: string }>; hashtags: string[]; plain: string };
  onCopyPost: () => void;
  postCopied: boolean;
  onTryAgain: () => void;
  onSubmit: () => void;
}) {
  const showLoading = state === "loading" || !scores;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        AI evaluation
      </div>
      <h3 className="mt-1 text-xl font-semibold text-foreground tracking-tight">
        {showLoading
          ? "Reviewing your thesis…"
          : passed
            ? "You're through. Strong thesis."
            : "Not quite. Tighten it up and try again."}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Scored on market understanding, opportunity clarity, and recommendation
        strength. Pass threshold is 6/10.
      </p>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        <ScoreTile
          label="Market understanding"
          value={showLoading ? null : scores!.market}
        />
        <ScoreTile
          label="Opportunity clarity"
          value={showLoading ? null : scores!.opportunity}
        />
        <ScoreTile
          label="Recommendation strength"
          value={showLoading ? null : scores!.recommendation}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
            showLoading
              ? "border-border text-muted-foreground"
              : passed
                ? "border-[oklch(0.72_0.14_155)]/50 text-[oklch(0.78_0.14_155)] bg-[oklch(0.72_0.14_155)]/10"
                : "border-[oklch(0.72_0.16_25)]/50 text-[oklch(0.78_0.16_25)] bg-[oklch(0.72_0.16_25)]/10",
          )}
        >
          {showLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating…
            </>
          ) : passed ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" /> Overall {scores!.overall}/10 · Pass
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5" /> Overall {scores!.overall}/10 · Below
              threshold
            </>
          )}
        </div>
      </div>

      {!showLoading && scores!.feedback && (
        <div className="mt-4 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
          {scores!.feedback}
        </div>
      )}

      {!showLoading && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {passed ? (
            <>
              <button
                type="button"
                onClick={onSubmit}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Submit thesis <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onCopyPost}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition"
              >
                {postCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> LinkedIn post copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy LinkedIn post
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onTryAgain}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </button>
          )}
        </div>
      )}

      {!showLoading && passed && (
        <div className="mt-6 pt-5 border-t border-border">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
            Final LinkedIn post
          </div>
          <LinkedInPreview post={linkedInPost} />
        </div>
      )}
    </div>
  );
}

function ScoreTile({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl text-foreground">
        {value === null ? "—" : (
          <>
            {value}
            <span className="text-sm text-muted-foreground">/10</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- LinkedIn post builder ---------------- */

function buildLinkedInPost(
  sector: Sector | null,
  answers: Answers,
  submittedSteps: Set<SectionId>,
) {
  const sections = SECTIONS.filter((s) => submittedSteps.has(s.id) && answers[s.id].trim())
    .map((s) => ({
      emoji: s.emoji,
      tag: s.tag,
      text: answers[s.id].trim(),
    }));

  const hashtags: string[] = [];
  if (sections.length > 0) {
    hashtags.push("#AICxISB", "#AccelerationThesis");
    if (sector) hashtags.push(SECTOR_HASHTAG[sector]);
  }

  const plain = [
    sections.length > 0
      ? `My Accelerator Investment Thesis — drafted as a Program Manager Intern at AIC × ISB.`
      : "",
    ...sections.map((s) => `${s.emoji} ${s.tag}\n${s.text}`),
    hashtags.join(" "),
  ]
    .filter(Boolean)
    .join("\n\n");

  return { sections, hashtags, plain };
}