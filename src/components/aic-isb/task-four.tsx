import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Lightbulb,
  Mail,
  StickyNote,
  Sparkles,
} from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import type { ThemeId } from "./startups-data";
import {
  INVESTIGATIONS,
  SCORE_BY_OUTCOME,
  type InvestigationOption,
  type Outcome,
} from "./rca-investigation-data";

type Phase = "intro" | "email" | "investigate" | "results";

type StepRecord = { optionId: "A" | "B" | "C" | "D"; outcome: Outcome };

export function AicIsbTaskFour({
  candidateName,
  sector,
  onComplete,
}: {
  candidateName: string;
  sector: ThemeId;
  shortlistedIds?: string[];
  onComplete?: () => void;
}) {
  const data = INVESTIGATIONS[sector];
  const firstName = getFirstName(candidateName);

  const [phase, setPhase] = useState<Phase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [records, setRecords] = useState<(StepRecord | null)[]>(() =>
    Array(data.steps.length).fill(null),
  );
  const [reviewMode, setReviewMode] = useState(false);

  if (phase === "intro") {
    return (
      <Intro
        firstName={firstName}
        onStart={() => setPhase("email")}
      />
    );
  }

  if (phase === "email") {
    return (
      <EmailScreen
        firstName={firstName}
        data={data}
        onStart={() => setPhase("investigate")}
      />
    );
  }

  if (phase === "results") {
    return (
      <Results
        data={data}
        records={records as StepRecord[]}
        reviewMode={reviewMode}
        onReview={() => {
          setReviewMode(true);
          setStepIndex(0);
          setPhase("investigate");
        }}
        onContinue={() => onComplete?.()}
      />
    );
  }

  return (
    <Investigation
      data={data}
      stepIndex={stepIndex}
      records={records}
      reviewMode={reviewMode}
      onSelect={(opt) => {
        setRecords((r) => {
          const next = [...r];
          next[stepIndex] = { optionId: opt.id, outcome: opt.outcome };
          return next;
        });
      }}
      onContinue={() => {
        if (stepIndex < data.steps.length - 1) {
          setStepIndex((i) => i + 1);
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setReviewMode(false);
          setPhase("results");
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      onBack={() => {
        if (stepIndex > 0) {
          setStepIndex((i) => i - 1);
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      onExitReview={() => {
        setReviewMode(false);
        setPhase("results");
      }}
    />
  );
}

/* ---------- Intro ---------- */
function Intro({ firstName, onStart }: { firstName: string; onStart: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-20 sm:py-28 text-center">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Phase 4 · Root Cause Investigation
      </div>
      <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
        Go save your startups now{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="mt-5 text-[17px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        Real startup crises. Structured problem solving. Find the root cause before
        the company collapses.
      </p>
      <button
        onClick={onStart}
        className="btn-primary-glow mt-10 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
      >
        <Mail className="h-4 w-4" /> Open the CEO's email
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ---------- Email screen (realistic email client) ---------- */
function EmailScreen({
  firstName,
  data,
  onStart,
}: {
  firstName: string;
  data: (typeof INVESTIGATIONS)[ThemeId];
  onStart: () => void;
}) {
  const guidance = [
    "Start by figuring out where in the business the problem is actually happening — don't jump to conclusions.",
    "Eliminate areas one by one using evidence, not gut feeling.",
    "At each step, ask: does this data actually explain what the CEO described?",
    "Your final recommendation should directly fix the specific thing that's broken — not a general fix.",
  ];

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16 animate-[fadeSlide_0.35s_ease-out]">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Mail className="h-3.5 w-3.5" /> Inbox · Priority
      </div>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        A founder needs your help.
      </h1>

      {/* Email client */}
      <article
        className="mt-6 rounded-2xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 12px 50px -12px rgba(0,0,0,0.55)" }}
      >
        {/* Email client toolbar */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-background/40">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.16_25)]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.14_85)]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.14_155)]/70" />
          <span className="ml-3 text-[11px] text-muted-foreground font-mono">message · inbox</span>
        </div>

        {/* Header fields */}
        <header className="px-5 sm:px-7 pt-5 pb-4 border-b border-border/60">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
            {data.email.subject}
          </h2>
          <div className="mt-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
              {data.ceo.initials}
            </div>
            <div className="flex-1 min-w-0 text-[13px]">
              <FieldRow label="From">
                <span className="text-foreground font-medium">{data.ceo.name}</span>{" "}
                <span className="text-muted-foreground">&lt;{data.ceo.email}&gt;</span>
                <div className="text-[11px] text-muted-foreground">{data.ceo.role}</div>
              </FieldRow>
              <FieldRow label="To">
                <span className="text-foreground/90">
                  {firstName || "You"}{" "}
                  <span className="text-muted-foreground">&lt;intern@aic-isb.in&gt;</span>
                </span>
              </FieldRow>
              <FieldRow label="Date">
                <span className="text-muted-foreground">{data.email.timestamp}</span>
              </FieldRow>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="px-5 sm:px-7 py-6 text-[14.5px] text-foreground/90 leading-[1.75] whitespace-pre-wrap">
          {data.email.body}
        </div>
      </article>

      {/* Sticky note */}
      <div
        className="mt-7 relative rounded-xl p-5 sm:p-6"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.93 0.14 95 / 0.94), oklch(0.88 0.15 88 / 0.94))",
          color: "oklch(0.25 0.05 70)",
          boxShadow:
            "0 10px 28px -10px rgba(180,140,20,0.45), 0 2px 0 rgba(120,90,10,0.18) inset",
          transform: "rotate(-0.4deg)",
        }}
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold">
          <StickyNote className="h-4 w-4" /> How to approach this
        </div>
        <ul className="mt-3 space-y-2.5 text-[14px] leading-snug">
          {guidance.map((g) => (
            <li key={g} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.35_0.08_70)] shrink-0" />
              <span>{g}</span>
            </li>
          ))}
        </ul>
        {/* folded corner */}
        <span
          className="absolute top-0 right-0 h-5 w-5"
          style={{
            background:
              "linear-gradient(135deg, transparent 50%, oklch(0.78 0.13 80 / 0.9) 50%)",
            borderTopRightRadius: "0.75rem",
          }}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onStart}
          className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
        >
          Start your investigation <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-2 py-0.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground pt-0.5">
        {label}
      </div>
      <div className="text-foreground/90">{children}</div>
    </div>
  );
}

/* ---------- Investigation ---------- */
function Investigation({
  data,
  stepIndex,
  records,
  reviewMode,
  onSelect,
  onContinue,
  onBack,
  onExitReview,
}: {
  data: (typeof INVESTIGATIONS)[ThemeId];
  stepIndex: number;
  records: (StepRecord | null)[];
  reviewMode: boolean;
  onSelect: (opt: InvestigationOption) => void;
  onContinue: () => void;
  onBack: () => void;
  onExitReview: () => void;
}) {
  const step = data.steps[stepIndex];
  const total = data.steps.length;
  const pct = Math.round(((stepIndex + (records[stepIndex] ? 1 : 0)) / total) * 100);
  const current = records[stepIndex];
  const selectedOption =
    current && step.options.find((o) => o.id === current.optionId);
  const correctOption = step.options.find((o) => o.outcome === "correct")!;

  return (
    <div className="min-h-screen">
      {/* Sticky progress */}
      <div
        className="sticky top-[88px] sm:top-[96px] z-20 border-b border-border bg-background/85 backdrop-blur-xl"
        style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-3">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <div className="text-muted-foreground">
              <span className="text-primary font-semibold uppercase tracking-[0.18em]">
                Investigation
              </span>{" "}
              · Step {stepIndex + 1} of {total}
            </div>
            {reviewMode ? (
              <button
                onClick={onExitReview}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-foreground/80 hover:bg-secondary transition"
              >
                Back to results
              </button>
            ) : (
              <div className="text-muted-foreground font-mono">{pct}%</div>
            )}
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10 grid lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Main */}
        <div className="lg:col-span-3 animate-[fadeSlide_0.35s_ease-out]">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Step {stepIndex + 1}
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {step.title}
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
            {step.context}
          </p>

          {reviewMode && (
            <div className="mt-5 rounded-lg border border-primary/40 bg-primary/5 px-3.5 py-2.5 text-xs text-primary">
              Review mode — the correct answer is highlighted.
            </div>
          )}

          {/* Options 2x2 */}
          <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
            {step.options.map((opt) => {
              const isSelected = current?.optionId === opt.id;
              const isCorrect = opt.outcome === "correct";
              const showOutcome = !!current || reviewMode;

              const outcomeStyle =
                isSelected && current
                  ? outcomeRing(current.outcome)
                  : reviewMode && isCorrect
                    ? outcomeRing("correct")
                    : "border-border hover:border-primary/40 hover:bg-secondary/40";

              return (
                <button
                  key={opt.id}
                  onClick={() => !current && !reviewMode && onSelect(opt)}
                  disabled={!!current || reviewMode}
                  className={cn(
                    "text-left rounded-xl border bg-card p-4 transition relative",
                    outcomeStyle,
                    !current && !reviewMode && "hover:-translate-y-0.5 cursor-pointer",
                    (current || reviewMode) && "cursor-default",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "h-6 w-6 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : reviewMode && isCorrect
                            ? "bg-[oklch(0.72_0.14_155)] text-background"
                            : "bg-secondary text-foreground/80",
                      )}
                    >
                      {opt.id}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">
                        {opt.title}
                      </div>
                      <div className="mt-1 text-[13px] text-muted-foreground leading-snug">
                        {opt.description}
                      </div>
                    </div>
                  </div>
                  {showOutcome && isSelected && (
                    <div className="absolute top-2.5 right-2.5">
                      <OutcomeIcon outcome={current!.outcome} small />
                    </div>
                  )}
                  {reviewMode && isCorrect && !isSelected && (
                    <div className="absolute top-2.5 right-2.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[oklch(0.72_0.14_155)]">
                      Correct
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selectedOption && (
            <FeedbackBlock option={selectedOption} />
          )}

          {/* Controls */}
          <div className="mt-7 flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              disabled={stepIndex === 0}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition",
                stepIndex === 0
                  ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                  : "border-border text-foreground/90 hover:bg-secondary",
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Previous step
            </button>
            {reviewMode ? (
              <button
                onClick={() => {
                  if (stepIndex < total - 1) onContinue();
                  else onExitReview();
                }}
                className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                {stepIndex < total - 1 ? "Next step" : "Back to results"}
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onContinue}
                disabled={!current}
                className={cn(
                  "btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
                  !current && "opacity-40 pointer-events-none",
                )}
              >
                {stepIndex === total - 1 ? "See results" : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2 order-first lg:order-none">
          <div className="lg:sticky lg:top-[170px] space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                Your investigation so far
              </div>
              <ol className="mt-3 space-y-2.5">
                {data.steps.map((s, i) => {
                  const r = records[i];
                  const isCurrent = i === stepIndex;
                  return (
                    <li
                      key={i}
                      className={cn(
                        "flex items-start gap-2.5 text-[12.5px] leading-snug",
                        isCurrent ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span className="mt-0.5">
                        {r ? (
                          <OutcomeIcon outcome={r.outcome} small />
                        ) : (
                          <span
                            className={cn(
                              "h-4 w-4 rounded-full border flex items-center justify-center text-[9px]",
                              isCurrent
                                ? "border-primary text-primary"
                                : "border-border text-muted-foreground/60",
                            )}
                          >
                            {i + 1}
                          </span>
                        )}
                      </span>
                      <span className={cn(r && "opacity-70")}>
                        <span className="font-medium">{s.title}</span>
                        {r && (
                          <span className="block text-[11.5px] text-muted-foreground">
                            You chose: {r.optionId} ·{" "}
                            {s.options.find((o) => o.id === r.optionId)?.title}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.93 0.14 95 / 0.92), oklch(0.88 0.15 88 / 0.92))",
                color: "oklch(0.25 0.05 70)",
                boxShadow: "0 8px 20px -12px rgba(180,140,20,0.45)",
              }}
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold">
                <Lightbulb className="h-3.5 w-3.5" /> At this step, think about…
              </div>
              <p className="mt-2 text-[13.5px] leading-snug">{step.tip}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function outcomeRing(outcome: Outcome) {
  if (outcome === "correct")
    return "border-[oklch(0.72_0.14_155)]/60 bg-[oklch(0.72_0.14_155)]/8 ring-1 ring-[oklch(0.72_0.14_155)]/40";
  if (outcome === "wrong")
    return "border-[oklch(0.72_0.16_25)]/60 bg-[oklch(0.72_0.16_25)]/8 ring-1 ring-[oklch(0.72_0.16_25)]/40";
  return "border-[oklch(0.85_0.14_85)]/60 bg-[oklch(0.85_0.14_85)]/8 ring-1 ring-[oklch(0.85_0.14_85)]/40";
}

function OutcomeIcon({ outcome, small }: { outcome: Outcome; small?: boolean }) {
  const cls = small ? "h-4 w-4" : "h-5 w-5";
  if (outcome === "correct")
    return <CheckCircle2 className={cn(cls, "text-[oklch(0.72_0.14_155)]")} />;
  if (outcome === "wrong")
    return <XCircle className={cn(cls, "text-[oklch(0.72_0.16_25)]")} />;
  return <CircleDashed className={cn(cls, "text-[oklch(0.85_0.14_85)]")} />;
}

function FeedbackBlock({ option }: { option: InvestigationOption }) {
  const { outcome } = option;
  const styles =
    outcome === "correct"
      ? {
          border: "border-l-[oklch(0.72_0.14_155)]",
          bg: "bg-[oklch(0.72_0.14_155)]/8",
          label: "Correct",
          labelColor: "text-[oklch(0.78_0.14_155)]",
        }
      : outcome === "wrong"
        ? {
            border: "border-l-[oklch(0.72_0.16_25)]",
            bg: "bg-[oklch(0.72_0.16_25)]/8",
            label: "Off track",
            labelColor: "text-[oklch(0.78_0.16_25)]",
          }
        : {
            border: "border-l-[oklch(0.85_0.14_85)]",
            bg: "bg-[oklch(0.85_0.14_85)]/8",
            label: "Partial",
            labelColor: "text-[oklch(0.88_0.14_85)]",
          };

  return (
    <div
      className={cn(
        "mt-5 rounded-xl border border-border border-l-4 p-4 animate-[fadeSlide_0.3s_ease-out]",
        styles.border,
        styles.bg,
      )}
    >
      <div className="flex items-center gap-2">
        <OutcomeIcon outcome={outcome} />
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.22em] font-bold",
            styles.labelColor,
          )}
        >
          {styles.label}
        </span>
      </div>
      <p className="mt-2 text-[14px] text-foreground/90 leading-relaxed">
        {option.feedback}
      </p>
      {option.hint && outcome !== "correct" && (
        <p className="mt-2 text-[13px] text-muted-foreground italic">
          Hint: {option.hint}
        </p>
      )}
    </div>
  );
}

/* ---------- Results ---------- */
function Results({
  data,
  records,
  reviewMode: _reviewMode,
  onReview,
  onContinue,
}: {
  data: (typeof INVESTIGATIONS)[ThemeId];
  records: StepRecord[];
  reviewMode: boolean;
  onReview: () => void;
  onContinue: () => void;
}) {
  const score = useMemo(
    () => records.reduce((sum, r) => sum + (r ? SCORE_BY_OUTCOME[r.outcome] : 0), 0),
    [records],
  );
  const total = data.steps.length;
  const pct = Math.round((score / total) * 100);
  const tone: "green" | "amber" | "red" =
    pct >= 80 ? "green" : pct >= 50 ? "amber" : "red";
  const toneColor =
    tone === "green"
      ? "oklch(0.72 0.14 155)"
      : tone === "amber"
        ? "oklch(0.85 0.14 85)"
        : "oklch(0.72 0.16 25)";

  const heading =
    pct >= 60 ? "Here's what you found" : "Here's where you went off track";

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16 animate-[fadeSlide_0.35s_ease-out]">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5" /> Case debrief · {data.ceo.company}
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {heading}
      </h1>

      {/* Score */}
      <div className="mt-7 rounded-2xl border border-border bg-card p-6 flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Investigation score
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="text-5xl font-bold tracking-tight"
              style={{ color: toneColor }}
            >
              {score.toString().replace(/\.0$/, "")}
            </span>
            <span className="text-2xl text-muted-foreground font-mono">/ {total}</span>
            <span
              className="ml-2 text-sm font-mono"
              style={{ color: toneColor }}
            >
              {pct}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {records.map((r, i) => (
            <div
              key={i}
              className="h-9 w-9 rounded-lg border border-border bg-background/40 flex items-center justify-center"
              title={`Step ${i + 1}`}
            >
              <OutcomeIcon outcome={r.outcome} />
            </div>
          ))}
        </div>
      </div>

      {/* What actually happened */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">What actually happened</h2>
        <p className="mt-2 text-[14.5px] text-foreground/85 leading-relaxed">
          {data.narrative}
        </p>
      </section>

      {/* Path vs path */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">
          Your path vs. the right path
        </h2>
        <div className="mt-3 rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_1fr] bg-background/40 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            <div>Step</div>
            <div>Your choice</div>
            <div>Correct choice</div>
          </div>
          {data.steps.map((s, i) => {
            const r = records[i];
            const chosen = s.options.find((o) => o.id === r.optionId);
            const correct = s.options.find((o) => o.outcome === "correct")!;
            return (
              <div
                key={i}
                className="grid grid-cols-[40px_1fr_1fr] gap-3 px-4 py-3 border-t border-border text-[13px] items-start"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                  {i + 1}
                  <OutcomeIcon outcome={r.outcome} small />
                </div>
                <div className="text-foreground/90">
                  <span className="text-muted-foreground font-mono mr-1">{r.optionId}.</span>
                  {chosen?.title}
                </div>
                <div className="text-[oklch(0.78_0.14_155)]">
                  <span className="font-mono mr-1">{correct.id}.</span>
                  {correct.title}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Takeaway */}
      <section
        className="mt-8 rounded-xl p-5"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.93 0.14 95 / 0.92), oklch(0.88 0.15 88 / 0.92))",
          color: "oklch(0.25 0.05 70)",
          boxShadow: "0 10px 24px -12px rgba(180,140,20,0.4)",
        }}
      >
        <div className="text-[11px] uppercase tracking-[0.22em] font-bold flex items-center gap-2">
          <Lightbulb className="h-4 w-4" /> Key takeaway
        </div>
        <p className="mt-2 text-[15px] leading-snug font-medium">{data.takeaway}</p>
      </section>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onReview}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-4 py-2.5 text-sm font-medium text-foreground/90 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Review this case
        </button>
        <button
          onClick={onContinue}
          className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Continue to Phase 5 <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
