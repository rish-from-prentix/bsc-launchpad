import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Star,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Shield,
  Sparkles,
  Loader2,
  Users,
  DollarSign,
  Flame,
  Target,
  Save,
} from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import { THEMES, type ThemeId, type Startup } from "./startups-data";
import { InboxEmail } from "./inbox-email";

type Phase = "email" | "dashboard" | "loading" | "result";

type Evaluation = {
  rating: number; // 1–10, 0 = unset
  shortlisted: boolean;
};

export function AicIsbTaskTwo({
  candidateName,
  sector,
  onComplete,
}: {
  candidateName: string;
  sector: ThemeId;
  onComplete?: (shortlistedIds: string[]) => void;
}) {
  const bundle = THEMES[sector];
  const storageKey = `aic-isb:task2:${sector}`;
  const [phase, setPhase] = useState<Phase>("email");
  const [evals, setEvals] = useState<Record<string, Evaluation>>(() => {
    const empty = Object.fromEntries(
      bundle.startups.map((s) => [s.id, { rating: 0, shortlisted: false }]),
    ) as Record<string, Evaluation>;
    if (typeof window === "undefined") return empty;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return empty;
      const parsed = JSON.parse(raw) as Record<string, Evaluation>;
      return { ...empty, ...parsed };
    } catch {
      return empty;
    }
  });
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const savedTimer = useRef<number | null>(null);
  const [limitWarning, setLimitWarning] = useState(false);
  const warningTimer = useRef<number | null>(null);

  const shortlistCount = Object.values(evals).filter((e) => e.shortlisted).length;
  const allRated = bundle.startups.every((s) => evals[s.id].rating > 0);
  const canSubmit = allRated && shortlistCount === 2;

  function updateEval(id: string, patch: Partial<Evaluation>) {
    setEvals((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function handleSaveDraft() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(evals));
      setSaveState("saved");
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setSaveState("idle"), 2200);
    } catch {
      /* noop */
    }
  }

  useEffect(() => {
    return () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
    };
  }, []);

  function toggleShortlist(id: string) {
    setEvals((prev) => {
      const cur = prev[id];
      const count = Object.values(prev).filter((e) => e.shortlisted).length;
      if (!cur.shortlisted && count >= 2) {
        // Trigger warning toast
        setLimitWarning(true);
        if (warningTimer.current) window.clearTimeout(warningTimer.current);
        warningTimer.current = window.setTimeout(() => setLimitWarning(false), 4200);
        return prev;
      }
      return { ...prev, [id]: { ...cur, shortlisted: !cur.shortlisted } };
    });
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setPhase("loading");
    window.setTimeout(() => setPhase("result"), 1800);
  }

  if (phase === "email") {
    return <EmailPhase name={getFirstName(candidateName)} themeLabel={bundle.label} onStart={() => setPhase("dashboard")} />;
  }

  if (phase === "loading") {
    return <LoadingPhase />;
  }

  if (phase === "result") {
    return (
      <ResultPhase
        bundle={bundle}
        evals={evals}
        onContinue={() =>
          onComplete?.(
            bundle.startups.filter((s) => evals[s.id].shortlisted).map((s) => s.id),
          )
        }
      />
    );
  }

  return (
    <Dashboard
      themeLabel={bundle.label}
      startups={bundle.startups}
      evals={evals}
      shortlistCount={shortlistCount}
      allRated={allRated}
      canSubmit={canSubmit}
      onUpdate={updateEval}
      onToggleShortlist={toggleShortlist}
      onSubmit={handleSubmit}
      saveState={saveState}
      onSaveDraft={handleSaveDraft}
      limitWarning={limitWarning}
      onDismissWarning={() => setLimitWarning(false)}
    />
  );
}

/* ---------------- Email Phase ---------------- */

function EmailPhase({
  name,
  themeLabel,
  onStart,
}: {
  name: string;
  themeLabel: string;
  onStart: () => void;
}) {
  return (
    <InboxEmail
      badge="Phase 2 · Accelerator Cohort Selection"
      senderName="Animesh Sharma"
      senderRole="Program Director, AIC × ISB"
      senderInitials="AS"
      subject="Next Evaluation Phase – Accelerator Cohort Selection"
      preview={`Hi ${name}, good job on the thesis, next, evaluate 8 shortlisted startups and pick 2 for the cohort…`}
      timestamp="Today · 11:04 AM"
      attachmentLabel="Cohort Evaluation Brief.pdf"
      ctaLabel="Continue Evaluation"
      onCta={onStart}
    >
      <div className="whitespace-pre-wrap">{`Hi ${name},

Good job on the investment thesis, the board agrees with your direction and recommendations.

We received over 8,000 startup applications for this cohort. Based on internal analytics and initial screening, 8 startups have now been shortlisted.

Your next task is to evaluate these startups and select the 2 companies you believe should move forward into the AIC × ISB accelerator cohort.

Focus on long-term potential, scalability, and founder-market fit.

Regards,
Animesh Sharma
Program Director
AIC × ISB`}</div>
    </InboxEmail>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard({
  themeLabel,
  startups,
  evals,
  shortlistCount,
  allRated,
  canSubmit,
  onUpdate,
  onToggleShortlist,
  onSubmit,
  saveState,
  onSaveDraft,
  limitWarning,
  onDismissWarning,
}: {
  themeLabel: string;
  startups: Startup[];
  evals: Record<string, Evaluation>;
  shortlistCount: number;
  allRated: boolean;
  canSubmit: boolean;
  onUpdate: (id: string, patch: Partial<Evaluation>) => void;
  onToggleShortlist: (id: string) => void;
  onSubmit: () => void;
  saveState: "idle" | "saved";
  onSaveDraft: () => void;
  limitWarning: boolean;
  onDismissWarning: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 sm:py-14 pb-40 relative">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Phase 2 · {themeLabel}
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        Accelerator Cohort Evaluation
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        Evaluate all 8 startups and select the top 2 for the cohort.
      </p>

      <div className="mt-6 glass rounded-xl p-4 sm:p-5 text-sm text-foreground/85 flex gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p>
          Rate each startup out of 10 based on{" "}
          <span className="text-primary">scalability, traction, innovation, founder strength,</span>{" "}
          and long-term market potential. Not every hyped startup is fundamentally strong.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {startups.map((s, i) => (
          <StartupCard
            key={s.id}
            index={i + 1}
            startup={s}
            evaluation={evals[s.id]}
            shortlistFull={shortlistCount >= 2}
            onUpdate={(patch) => onUpdate(s.id, patch)}
            onToggleShortlist={() => onToggleShortlist(s.id)}
          />
        ))}
      </div>

      {/* Shortlist limit warning toast */}
      {limitWarning && (
        <div
          role="alert"
          className="fixed left-1/2 -translate-x-1/2 bottom-24 z-40 max-w-md w-[92%] rounded-xl border border-[oklch(0.78_0.13_70)]/50 bg-[oklch(0.18_0.02_70)]/95 backdrop-blur-xl px-4 py-3 shadow-[0_18px_48px_-10px_rgba(0,0,0,0.6)]"
          style={{ animation: "fadeSlide 280ms ease-out" }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-[oklch(0.78_0.13_70)] mt-0.5 shrink-0" />
            <div className="text-sm text-foreground/90 leading-relaxed">
              You've already locked in your final 2 picks. Want to back a different startup? Simply remove one from your shortlist first.
            </div>
            <button
              type="button"
              onClick={onDismissWarning}
              className="text-xs text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Sticky submit bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            <span className={cn(allRated ? "text-primary" : "")}>
              {Object.values(evals).filter((e) => e.rating > 0).length}/8 evaluated
            </span>
            <span className="mx-2 text-border">·</span>
            <span className={cn(shortlistCount === 2 ? "text-primary" : "")}>
              {shortlistCount}/2 shortlisted
            </span>
            {saveState === "saved" && (
              <span className="ml-3 text-primary">Draft saved</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card hover:bg-secondary px-3.5 py-2.5 text-xs font-medium text-foreground/90 transition"
            >
              <Save className="h-3.5 w-3.5" /> Save Draft
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className={cn(
                "btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
                !canSubmit && "opacity-40 pointer-events-none",
              )}
            >
              Submit Recommendations <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Startup Card ---------------- */

function StartupCard({
  index,
  startup,
  evaluation,
  shortlistFull,
  onUpdate,
  onToggleShortlist,
}: {
  index: number;
  startup: Startup;
  evaluation: Evaluation;
  shortlistFull: boolean;
  onUpdate: (patch: Partial<Evaluation>) => void;
  onToggleShortlist: () => void;
}) {
  const isShortlisted = evaluation.shortlisted;
  const rating = evaluation.rating;
  const isGraded = rating > 0;

  return (
    <article
      className={cn(
        "glass rounded-2xl p-5 sm:p-6 transition-all",
        isShortlisted && "ring-1 ring-primary/60",
        !isGraded &&
          !isShortlisted &&
          "ring-1 ring-[oklch(0.78_0.13_70)]/30 border-[oklch(0.78_0.13_70)]/30",
      )}
      style={
        isShortlisted
          ? { boxShadow: "0 0 0 1px rgba(93,196,254,0.35), 0 12px 40px rgba(93,196,254,0.18)" }
          : !isGraded
            ? {
                background:
                  "linear-gradient(180deg, oklch(0.21 0.02 70 / 0.55), oklch(0.16 0.01 70 / 0.55))",
                boxShadow: "0 0 0 1px oklch(0.78 0.13 70 / 0.18), 0 8px 28px rgba(0,0,0,0.35)",
              }
            : undefined
      }
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Startup {index}
          </div>
          <h3 className="mt-1 text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            {startup.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{startup.tagline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-primary">
              <Users className="h-3 w-3" /> {startup.founders.join(", ")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-2 py-0.5 text-foreground/80">
              Stage · {startup.stage}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] rounded-full px-2.5 py-1 border",
            isGraded
              ? "border-[oklch(0.72_0.14_155)]/50 text-[oklch(0.72_0.14_155)] bg-[oklch(0.72_0.14_155)]/10"
              : "border-[oklch(0.78_0.13_70)]/50 text-[oklch(0.78_0.13_70)] bg-[oklch(0.78_0.13_70)]/10",
          )}
        >
          {isGraded ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Graded
            </>
          ) : (
            <>
              <AlertTriangle className="h-3 w-3" /> Not Graded Yet
            </>
          )}
        </span>
      </header>

      <div className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <MetricRow icon={<DollarSign className="h-3.5 w-3.5" />} label="Funding" value={startup.funding} />
        {startup.mrr && <MetricRow label="MRR" value={startup.mrr} />}
        {startup.growth && <MetricRow label="Growth" value={startup.growth} />}
        {startup.customers && <MetricRow label="Customers" value={startup.customers} />}
        {startup.retention && <MetricRow label="Retention" value={startup.retention} />}
        {startup.burn && <MetricRow icon={<Flame className="h-3.5 w-3.5" />} label="Burn" value={startup.burn} />}
        {startup.runway && <MetricRow label="Runway" value={startup.runway} />}
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-background/30 p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-2">
            Strengths
          </div>
          <ul className="space-y-1.5 text-sm text-foreground/85">
            {startup.strengths.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.14_155)] shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-background/30 p-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.72_0.16_25)] font-semibold mb-2">
            Risks
          </div>
          <ul className="space-y-1.5 text-sm text-foreground/85">
            {startup.risks.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_25)] shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(startup.competitors || startup.accelGoal) && (
        <div className="mt-4 grid sm:grid-cols-2 gap-4 text-sm">
          {startup.competitors && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
                Competitor landscape
              </div>
              <p className="text-foreground/80">{startup.competitors}</p>
            </div>
          )}
          {startup.accelGoal && (
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1 flex items-center gap-1.5">
                <Target className="h-3 w-3" /> Why they applied
              </div>
              <p className="text-foreground/80">{startup.accelGoal}</p>
            </div>
          )}
        </div>
      )}

      {/* Rating + reason + shortlist */}
      <div className="mt-6 pt-5 border-t border-border space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">
              Your rating
            </label>
            <span className="text-sm font-mono text-muted-foreground">
              {rating > 0 ? `${rating.toFixed(1)} / 10` : "—"}
            </span>
          </div>
          <RatingControl value={rating} onChange={(v) => onUpdate({ rating: v })} />
        </div>

        <button
          onClick={onToggleShortlist}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition w-full sm:w-auto",
            isShortlisted
              ? "btn-primary-glow"
              : "border border-primary/40 text-primary hover:bg-primary/10",
            !isShortlisted && shortlistFull && "opacity-60 hover:bg-transparent",
          )}
        >
          {isShortlisted ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Added to Accelerator Shortlist
            </>
          ) : (
            <>
              <Star className="h-4 w-4" /> Add to Accelerator Shortlist
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function MetricRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground flex items-center gap-1.5 min-w-[110px]">
        {icon} {label}
      </span>
      <span className="text-foreground/90">{value}</span>
    </div>
  );
}

/* ---------------- Loading Phase ---------------- */

function LoadingPhase() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative h-20 w-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(93,196,254,0.45), transparent 70%)",
            animation: "blobFloat 2.4s ease-in-out infinite",
          }}
        />
        <Loader2 className="h-20 w-20 animate-spin text-primary/80 relative" strokeWidth={1.25} />
      </div>
      <div className="text-center">
        <div className="text-sm uppercase tracking-[0.22em] text-primary font-semibold">
          Investment Committee
        </div>
        <div className="mt-2 text-lg text-foreground/90">
          Board reviewing your recommendations…
        </div>
      </div>
    </div>
  );
}

/* ---------------- Result Phase ---------------- */

function ResultPhase({
  bundle,
  evals,
  onContinue,
}: {
  bundle: (typeof THEMES)[ThemeId];
  evals: Record<string, Evaluation>;
  onContinue: () => void;
}) {
  const { startups, bestIds, weakIds } = bundle;

  const shortlisted = startups.filter((s) => evals[s.id].shortlisted);
  const hasWeakInShortlist = shortlisted.some((s) => weakIds.includes(s.id));

  // Board feedback should only reference the startups the student actually selected.
  const overratedWeak = shortlisted.filter(
    (s) => weakIds.includes(s.id) && evals[s.id].rating >= 7,
  );
  // Missed conviction = strong startups the student did NOT shortlist.
  const underratedStrong = startups.filter(
    (s) => bestIds.includes(s.id) && !evals[s.id].shortlisted,
  );

  const accuracy = useMemo(() => {
    const diffs = startups.map((s) => Math.abs(evals[s.id].rating - s.boardScore));
    const meanDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    return Math.max(0, Math.round((1 - meanDiff / 10) * 100));
  }, [startups, evals]);

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Shield className="h-3.5 w-3.5" /> Investment Committee Verdict
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        {hasWeakInShortlist ? "Evaluation Noted" : "Evaluation Approved"}
      </h1>
      <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
        {hasWeakInShortlist
          ? "The accelerator board has reviewed your recommendations. Some selections raised concerns, but your reasoning showed real investment thinking. Read the board's feedback below."
          : "The accelerator board agreed with your recommendations. Your selected startups demonstrated strong market potential, scalable business models, and long-term founder alignment. Your evaluations reflected thoughtful investment analysis and strategic decision-making expected from accelerator associates."}
      </p>

      {/* Accuracy stat */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <StatCard label="Evaluation accuracy" value={`${accuracy}%`} />
        <StatCard
          label="Shortlist quality"
          value={
            shortlisted.every((s) => bestIds.includes(s.id))
              ? "Strong"
              : shortlisted.every((s) => weakIds.includes(s.id))
                ? "Concerning"
                : "Mixed"
          }
        />
        <StatCard
          label="Risk-read"
          value={overratedWeak.length === 0 ? "Sharp" : `${overratedWeak.length} flag${overratedWeak.length > 1 ? "s" : ""}`}
        />
      </div>

      {/* Selected startups + comments */}
      <h2 className="mt-10 text-sm uppercase tracking-[0.22em] text-primary font-semibold">
        Your final cohort selection
      </h2>
      <div className="mt-4 space-y-4">
        {shortlisted.map((s) => {
          const isStrong = bestIds.includes(s.id);
          const isWeak = weakIds.includes(s.id);
          const comment = isStrong
            ? "Strong selection. This startup aligns well with the accelerator's investment thesis due to its scalable model, market timing, and sustainable traction."
            : isWeak
              ? "The accelerator board has concerns regarding this startup's scalability and operational sustainability. You may proceed with your selection, but be prepared to justify your decision."
              : "This startup is a defensible pick, though not the board's top conviction, the fundamentals support the case.";
          return (
            <div key={s.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.tagline}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Your rating
                  </div>
                  <div className="text-base font-mono text-foreground">
                    {evals[s.id].rating.toFixed(1)} / 10
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "mt-4 rounded-lg p-3 text-sm flex gap-2",
                  isWeak
                    ? "border border-[oklch(0.72_0.16_25)]/40 bg-[oklch(0.72_0.16_25)]/5 text-foreground/90"
                    : isStrong
                      ? "border border-[oklch(0.72_0.14_155)]/40 bg-[oklch(0.72_0.14_155)]/5 text-foreground/90"
                      : "border border-border bg-background/40 text-foreground/85",
                )}
              >
                {isWeak ? (
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.72_0.16_25)]" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.72_0.14_155)]" />
                )}
                <p>{comment}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional board notes */}
      {(overratedWeak.length > 0 || underratedStrong.length > 0) && (
        <div className="mt-8 space-y-3">
          {overratedWeak.length > 0 && (
            <div className="glass rounded-xl p-4 text-sm flex gap-3">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-[oklch(0.78_0.13_70)] shrink-0" />
              <div>
                <div className="font-semibold text-foreground">Board feedback</div>
                <p className="text-muted-foreground mt-0.5">
                  You may have overweighted short-term traction while underestimating sustainability and retention risks on{" "}
                  <span className="text-foreground">{overratedWeak.map((s) => s.name).join(", ")}</span>.
                </p>
              </div>
            </div>
          )}
          {underratedStrong.length > 0 && (
            <div className="glass rounded-xl p-4 text-sm flex gap-3">
              <TrendingUp className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <div className="font-semibold text-foreground">Missed conviction</div>
                <p className="text-muted-foreground mt-0.5">
                  The investment committee identified stronger long-term defensibility and scalability than your evaluation reflected for{" "}
                  <span className="text-foreground">{underratedStrong.map((s) => s.name).join(", ")}</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <button
          onClick={onContinue}
          className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Continue Internship <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}
function RatingControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [text, setText] = useState<string>(value > 0 ? value.toFixed(1) : "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setText(value > 0 ? value.toFixed(1) : "");
  }, [value]);

  const commit = (raw: string) => {
    setText(raw);
    if (raw.trim() === "") {
      setError(false);
      onChange(0);
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) {
      setError(true);
      return;
    }
    const clamped = Math.max(1, Math.min(10, n));
    const rounded = Math.round(clamped * 10) / 10;
    setError(n < 1 || n > 10);
    onChange(rounded);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={1}
        max={10}
        step={0.1}
        value={value > 0 ? value : 1}
        onChange={(e) => {
          const v = Math.round(Number(e.target.value) * 10) / 10;
          onChange(v);
          setError(false);
        }}
        className="flex-1 accent-[#5dc4fe] cursor-pointer"
        style={{ filter: value > 0 ? "drop-shadow(0 0 6px rgba(93,196,254,0.5))" : "none" }}
      />
      <div
        className={cn(
          "flex items-center gap-1 rounded-xl border bg-background/40 backdrop-blur px-3 py-1.5 transition",
          error ? "border-destructive/60 ring-1 ring-destructive/40" : "border-border focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/40",
        )}
      >
        <input
          type="number"
          min={1}
          max={10}
          step={0.1}
          inputMode="decimal"
          value={text}
          placeholder="—"
          onChange={(e) => commit(e.target.value)}
          onBlur={(e) => {
            if (e.target.value.trim() === "") return;
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) {
              const clamped = Math.max(1, Math.min(10, n));
              const rounded = Math.round(clamped * 10) / 10;
              setText(rounded.toFixed(1));
              setError(false);
              onChange(rounded);
            }
          }}
          className="w-12 bg-transparent text-right text-sm font-mono text-foreground outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-muted-foreground font-mono">/ 10</span>
      </div>
    </div>
  );
}
