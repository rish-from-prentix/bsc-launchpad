import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  CircleDashed,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import type { ThemeId } from "./startups-data";
import {
  INVESTIGATIONS,
  type InvestigationOption,
  type Outcome,
} from "./rca-investigation-data";
import { InboxEmail } from "./inbox-email";

type Phase = "email" | "investigate" | "results";

type OptionId = "A" | "B" | "C" | "D";
/** Committed step record (after the student lands on the correct answer). */
type StepRecord = {
  firstOptionId: OptionId;
  firstOutcome: Outcome;
  correctOptionId: OptionId;
  tries: number;
};

/** Rebuild local attempts from a committed record (when navigating back). */
function rebuildAttempts(rec: StepRecord, options: InvestigationOption[]): Attempt[] {
  const out: Attempt[] = [];
  if (rec.firstOptionId !== rec.correctOptionId) {
    out.push({ id: rec.firstOptionId, outcome: rec.firstOutcome });
  }
  const correct = options.find((o) => o.outcome === "correct")!;
  // Add the final correct attempt last.
  out.push({ id: correct.id, outcome: "correct" });
  return out;
}

/** Sector-specific 7-days-later success card copy. */
const SUCCESS_MOMENT: Record<ThemeId, string> = {
  ai: "Aarav rebuilt the onboarding flow with guided setup and prebuilt templates. Within a week, drop-off went from 72% to single digits. The product team is calling it the biggest unlock since launch. Great job. You just saved NeuroPilot.",
  climate:
    "Rhea's team built an EV density scoring model and paused expansion into unvalidated zones. Utilization at existing high-demand stations climbed 34% in the first week as resources were redirected. Great job. You just saved GreenLoop.",
  health:
    "Dr. Sharma's team shipped AI-based alert prioritization. Doctor login rates recovered within the first week. Three hospitals that were about to churn signed renewals. Great job. You just saved MediSync.",
};
const FAILURE_MOMENT =
  "The founder tried a few things, but the real problem stayed hidden a little longer. With the right diagnosis, this could have been a different story. Review the case and try again — the founder is counting on you.";

function SevenDaysLaterCard({ sector, success }: { sector: ThemeId; success: boolean }) {
  const message = success ? SUCCESS_MOMENT[sector] : FAILURE_MOMENT;
  return (
    <section
      className="mt-10 rounded-2xl p-6 sm:p-7 text-white relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #060914 0%, #0a1426 100%)",
        boxShadow: "0 12px 50px rgba(0,0,0,0.55)",
      }}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/70 font-semibold">
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.78_0.18_155)] opacity-70"
            style={{ animation: "softPulse 1.6s ease-in-out infinite" }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.78_0.18_155)]" />
        </span>
        — 7 days later —
      </div>
      <p className="mt-3 text-[15.5px] leading-relaxed text-white/90">{message}</p>
    </section>
  );
}

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

  const [phase, setPhase] = useState<Phase>("email");
  const [stepIndex, setStepIndex] = useState(0);
  const [records, setRecords] = useState<(StepRecord | null)[]>(() =>
    Array(data.steps.length).fill(null),
  );
  const [reviewMode, setReviewMode] = useState(false);

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
        sector={sector}
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
      onCommit={(rec) => {
        setRecords((r) => {
          const next = [...r];
          next[stepIndex] = rec;
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
    "Start by figuring out where in the business the problem is actually happening, don't jump to conclusions.",
    "Eliminate areas one by one using evidence, not gut feeling.",
    "At each step, ask: does this data actually explain what the CEO described?",
    "Your final recommendation should directly fix the specific thing that's broken, not a general fix.",
  ];

  return (
    <div className="animate-[fadeSlide_0.35s_ease-out]">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-14 sm:pt-20 text-center">
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
      </div>

      <InboxEmail
        senderName={data.ceo.name}
        senderRole={data.ceo.role}
        senderInitials={data.ceo.initials}
        subject={data.email.subject}
        preview={data.email.body.split("\n").find((l) => l.trim().length > 0) ?? ""}
        timestamp={data.email.timestamp}
        ctaLabel="Start your investigation"
        onCta={onStart}
        defaultOpen
      >
        <div className="whitespace-pre-wrap">{data.email.body}</div>
      </InboxEmail>

      {/* Approach guidance — separate box below the email */}
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-16">
        <div className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            <Lightbulb className="h-3.5 w-3.5" /> How to approach this
          </div>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-foreground/80">
            {guidance.map((g) => (
              <li key={g} className="flex gap-2.5">
                <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------- Investigation ---------- */
type Attempt = { id: OptionId; outcome: Outcome };

function Investigation({
  data,
  stepIndex,
  records,
  reviewMode,
  onCommit,
  onContinue,
  onBack,
  onExitReview,
}: {
  data: (typeof INVESTIGATIONS)[ThemeId];
  stepIndex: number;
  records: (StepRecord | null)[];
  reviewMode: boolean;
  onCommit: (rec: StepRecord) => void;
  onContinue: () => void;
  onBack: () => void;
  onExitReview: () => void;
}) {
  const step = data.steps[stepIndex];
  const total = data.steps.length;
  const committed = records[stepIndex];
  const correctOption = step.options.find((o) => o.outcome === "correct")!;

  // Local attempts for the active step. Re-seeded whenever the step or committed record changes.
  const [attempts, setAttempts] = useState<Attempt[]>(() =>
    committed
      ? rebuildAttempts(committed, step.options)
      : [],
  );
  // Reset on step change.
  useMemo(() => {
    setAttempts(
      committed ? rebuildAttempts(committed, step.options) : [],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const lastAttempt = attempts[attempts.length - 1];
  const landedCorrect =
    !!lastAttempt && lastAttempt.outcome === "correct";
  const pct = Math.round(((stepIndex + (landedCorrect || committed ? 1 : 0)) / total) * 100);
  const lastOption = lastAttempt
    ? step.options.find((o) => o.id === lastAttempt.id)
    : null;

  const handleSelect = (opt: InvestigationOption) => {
    if (reviewMode || landedCorrect) return;
    // Ignore re-clicks on the same wrong option.
    if (attempts.some((a) => a.id === opt.id)) return;
    const next = [...attempts, { id: opt.id, outcome: opt.outcome }];
    setAttempts(next);
    if (opt.outcome === "correct") {
      onCommit({
        firstOptionId: next[0].id,
        firstOutcome: next[0].outcome,
        correctOptionId: correctOption.id,
        tries: next.length,
      });
    }
  };

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
              Review mode, the correct answer is highlighted.
            </div>
          )}

          {/* Retry hint shown after a wrong/partial pick, before landing correct */}
          {!reviewMode && attempts.length > 0 && !landedCorrect && (
            <div className="mt-5 text-[12px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              Have another look — pick again
            </div>
          )}

          {/* Options 2x2 */}
          <div className="mt-3 grid sm:grid-cols-2 gap-3.5">
            {step.options.map((opt) => {
              const attempt = attempts.find((a) => a.id === opt.id);
              const isCorrectOpt = opt.outcome === "correct";
              const isFirstWrong =
                !!attempt &&
                attempts.length > 1 &&
                attempts[0].id === opt.id &&
                attempts[0].outcome !== "correct";
              const disabled =
                reviewMode ||
                landedCorrect ||
                !!attempt; // can't re-pick same option

              const outcomeStyle = attempt
                ? isFirstWrong && landedCorrect
                  ? // faded original wrong pick once they got it right
                    "border-[oklch(0.72_0.16_25)]/40 bg-[oklch(0.72_0.16_25)]/5 opacity-70"
                  : outcomeRing(attempt.outcome)
                : reviewMode && isCorrectOpt
                  ? outcomeRing("correct")
                  : "border-border hover:border-primary/40 hover:bg-secondary/40";

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  disabled={disabled}
                  className={cn(
                    "text-left rounded-xl border bg-card p-4 transition relative",
                    outcomeStyle,
                    !disabled && "hover:-translate-y-0.5 cursor-pointer",
                    disabled && "cursor-default",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "h-6 w-6 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0",
                        attempt && attempt.outcome === "correct"
                          ? "bg-[oklch(0.72_0.14_155)] text-background"
                          : attempt
                            ? "bg-primary text-primary-foreground"
                            : reviewMode && isCorrectOpt
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
                  {attempt && (
                    <div className="absolute top-2.5 right-2.5">
                      <OutcomeIcon outcome={attempt.outcome} small />
                    </div>
                  )}
                  {reviewMode && isCorrectOpt && !attempt && (
                    <div className="absolute top-2.5 right-2.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[oklch(0.72_0.14_155)]">
                      Correct
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback for last attempt */}
          {lastOption && <FeedbackBlock option={lastOption} />}

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
                disabled={!landedCorrect}
                className={cn(
                  "btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
                  !landedCorrect && "opacity-40 pointer-events-none",
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
                  const correctOpt = s.options.find((o) => o.outcome === "correct")!;
                  const firstChoice = r
                    ? s.options.find((o) => o.id === r.firstOptionId)
                    : null;
                  const gotFirstTry = r && r.tries === 1;
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
                          <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.14_155)]" />
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
                      <span className={cn(r && "opacity-90")}>
                        <span className="font-medium">
                          Step {i + 1}: {correctOpt.title}
                        </span>
                        {r && (
                          <span className="block text-[11.5px] text-muted-foreground">
                            {gotFirstTry
                              ? "(your answer)"
                              : `(correct answer — you chose ${firstChoice?.title ?? r.firstOptionId})`}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                <Lightbulb className="h-3.5 w-3.5" /> At this step, think about
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground/75">{step.tip}</p>
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
  sector,
  records,
  reviewMode: _reviewMode,
  onReview,
  onContinue,
}: {
  data: (typeof INVESTIGATIONS)[ThemeId];
  sector: ThemeId;
  records: StepRecord[];
  reviewMode: boolean;
  onReview: () => void;
  onContinue: () => void;
}) {
  const score = useMemo(
    () =>
      records.reduce(
        (sum, r) => sum + (r ? (r.tries === 1 ? 1 : 0.5) : 0),
        0,
      ),
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
              <OutcomeIcon outcome={r.tries === 1 ? "correct" : "partial"} />
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
          <div className="grid grid-cols-[40px_1fr_1fr_72px] bg-background/40 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            <div>Step</div>
            <div>Your choice</div>
            <div>Correct choice</div>
            <div>Tries</div>
          </div>
          {data.steps.map((s, i) => {
            const r = records[i];
            const chosen = s.options.find((o) => o.id === r.firstOptionId);
            const correct = s.options.find((o) => o.outcome === "correct")!;
            return (
              <div
                key={i}
                className="grid grid-cols-[40px_1fr_1fr_72px] gap-3 px-4 py-3 border-t border-border text-[13px] items-start"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono">
                  {i + 1}
                  <OutcomeIcon outcome={r.tries === 1 ? "correct" : "partial"} small />
                </div>
                <div className="text-foreground/90">
                  <span className="text-muted-foreground font-mono mr-1">{r.firstOptionId}.</span>
                  {chosen?.title}
                </div>
                <div className="text-[oklch(0.78_0.14_155)]">
                  <span className="font-mono mr-1">{correct.id}.</span>
                  {correct.title}
                </div>
                <div className="text-muted-foreground font-mono">
                  {r.tries === 1 ? "1st try" : r.tries === 2 ? "2nd try" : `${r.tries}rd try`}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Takeaway */}
      <section className="mt-8 rounded-xl border border-border bg-card/60 p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5" /> Key takeaway
        </div>
        <p className="mt-2 text-[14.5px] leading-relaxed text-foreground/85">{data.takeaway}</p>
      </section>

      {/* 7 days later moment */}
      <SevenDaysLaterCard sector={sector} success={score >= 3} />

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
