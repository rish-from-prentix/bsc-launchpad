import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InboxEmail } from "./inbox-email";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  Shield,
  TrendingUp,
  DollarSign,
  BookOpen,
  Download,
  Linkedin,
  Copy,
  Check,
  Save,
} from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import { THEMES, type ThemeId, type Startup } from "./startups-data";
import { getRcaCase } from "./rca-data";
import {
  getValuation,
  classifyValuation,
  classifyMultiple,
  type Valuation,
} from "./valuation-data";
import aicLogoUrl from "@/assets/aic-isb-logo-blue.png";

type Phase = "email" | "workspace" | "loading" | "result" | "earned";

type Answers = {
  multiple: string;
  valuation: string;
  rationale: string;
  strengths: string;
  risks: string;
  recommendation: "" | "Strong Invest" | "Moderate Invest" | "Observe Further" | "Do Not Invest";
  recReason: string;
};

const emptyAnswers: Answers = {
  multiple: "",
  valuation: "",
  rationale: "",
  strengths: "",
  risks: "",
  recommendation: "",
  recReason: "",
};

export function AicIsbTaskFive({
  candidateName,
  sector,
  shortlistedIds,
  onComplete,
}: {
  candidateName: string;
  sector: ThemeId;
  shortlistedIds: string[];
  onComplete?: () => void;
}) {
  const bundle = THEMES[sector];
  const cohortStartups = useMemo(
    () => bundle.startups.filter((s) => shortlistedIds.includes(s.id)),
    [bundle, shortlistedIds],
  );
  const storageKey = `aic-isb:task5:${sector}:${shortlistedIds.join(",")}`;

  const [phase, setPhase] = useState<Phase>("email");
  // One startup is assigned directly — no selection step.
  const selectedId = cohortStartups[0]?.id ?? null;
  const [answers, setAnswers] = useState<Answers>(() => {
    if (typeof window === "undefined") return emptyAnswers;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return emptyAnswers;
      const parsed = JSON.parse(raw) as { answers?: Partial<Answers> };
      return { ...emptyAnswers, ...(parsed.answers ?? {}) };
    } catch {
      return emptyAnswers;
    }
  });
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const savedTimer = useRef<number | null>(null);

  const selected = cohortStartups.find((s) => s.id === selectedId) ?? null;
  const benchmark = selected ? getValuation(selected) : null;

  const valNum = parseFloat(answers.valuation);
  const multNum = parseFloat(answers.multiple);

  const complete =
    !!selected &&
    !Number.isNaN(multNum) &&
    multNum > 0 &&
    !Number.isNaN(valNum) &&
    valNum > 0 &&
    answers.rationale.trim().length > 0 &&
    answers.strengths.trim().length > 0 &&
    answers.risks.trim().length > 0 &&
    answers.recommendation !== "" &&
    answers.recReason.trim().length > 0;

  function submit() {
    if (!complete) return;
    setPhase("loading");
    window.setTimeout(() => setPhase("result"), 1800);
  }

  function handleSaveDraft() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ selectedId, answers }),
      );
      setSaveState("saved");
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setSaveState("idle"), 2200);
    } catch {
      /* noop */
    }
  }

  useEffect(() => () => { if (savedTimer.current) window.clearTimeout(savedTimer.current); }, []);

  if (phase === "email")
    return <EmailPhase name={getFirstName(candidateName)} onStart={() => setPhase("workspace")} />;

  if (phase === "loading")
    return <Loading text="Investment committee reviewing your memo…" />;

  if (phase === "result" && selected && benchmark)
    return (
      <ResultPhase
        candidateName={candidateName}
        startup={selected}
        answers={answers}
        benchmark={benchmark}
        onContinue={() => setPhase("earned")}
      />
    );

  if (phase === "earned" && selected)
    return (
      <EarnedPhase
        candidateName={candidateName}
        startup={selected}
        sector={sector}
        onContinue={() => onComplete?.()}
      />
    );

  if (!selected || !benchmark) return null;

  return (
    <Workspace
      sector={sector}
      cohort={cohortStartups}
      startup={selected}
      benchmark={benchmark}
      answers={answers}
      complete={complete}
      onUpdate={(p) => setAnswers((prev) => ({ ...prev, ...p }))}
      onSubmit={submit}
      saveState={saveState}
      onSaveDraft={handleSaveDraft}
    />
  );
}

/* ============= Email ============= */
function EmailPhase({ name, onStart }: { name: string; onStart: () => void }) {
  return (
    <InboxEmail
      badge="Phase 5 · Independent Investment Assessment"
      senderName="Vikram Sethi"
      senderRole="Board Member, AIC Ventures"
      senderInitials="VS"
      subject="Independent Assessment Required, Investment Review"
      preview={`Hi ${name}, we're reviewing a potential investment opportunity and need an independent assessment before our board discussion.`}
      timestamp="Today · 04:42 PM"
      ctaLabel="Begin Evaluation"
      onCta={onStart}
    >
      <div className="whitespace-pre-wrap">{`Hi ${name},

We're currently reviewing a potential investment opportunity that has generated significant internal discussion among the board.

Before moving forward, I'd like an independent assessment of the company's business fundamentals, operational strength, and long-term scalability.

Your evaluation will be included in our upcoming investment review discussion, so I'd encourage you to approach this with both strategic and analytical rigor.

Please review the startup and share your recommendation.

Vikram Sethi
Board Member
AIC Ventures`}</div>
    </InboxEmail>
  );
}

/* ============= Workspace ============= */
function Workspace({
  sector,
  cohort,
  startup,
  benchmark,
  answers,
  complete,
  onUpdate,
  onSubmit,
  saveState,
  onSaveDraft,
}: {
  sector: ThemeId;
  cohort: Startup[];
  startup: Startup;
  benchmark: Valuation;
  answers: Answers;
  complete: boolean;
  onUpdate: (p: Partial<Answers>) => void;
  onSubmit: () => void;
  saveState: "idle" | "saved";
  onSaveDraft: () => void;
}) {
  const rca = getRcaCase(startup);
  const examples = THEMES[sector].startups
    .filter((s) => s.id !== startup.id && !cohort.some((c) => c.id === s.id))
    .slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14 pb-40">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Phase 5 · Investment Memo
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        Startup Investment Recommendation
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        Evaluating <span className="text-foreground font-medium">{startup.name}</span>,{" "}
        {startup.tagline}
      </p>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* LEFT — startup data panel */}
        <div className="lg:col-span-2 space-y-6">
          <StartupDataPanel startup={startup} rcaSummary={rca.rootCauseLabel} />

          <LearningPanel />

          <ExamplesPanel sector={sector} examples={examples} />
        </div>

        {/* RIGHT — recommendation form */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-5 sticky top-24">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5" /> Your recommendation
            </div>
            <div className="mt-4 space-y-4">
              <NumericField
                label="Recommended ARR multiple (x)"
                value={answers.multiple}
                placeholder="e.g. 8"
                suffix="x"
                onChange={(v) => onUpdate({ multiple: v })}
              />
              <NumericField
                label="Estimated valuation ($M)"
                value={answers.valuation}
                placeholder="e.g. 18"
                suffix="$M"
                onChange={(v) => onUpdate({ valuation: v })}
              />
              <TextArea
                label="Why does this valuation make sense?"
                value={answers.rationale}
                rows={3}

                placeholder="Reference ARR, growth, retention, and risk."
                onChange={(v) => onUpdate({ rationale: v })}
              />
              <TextArea
                label="Strengths of the startup"
                value={answers.strengths}
                rows={2}

                placeholder="Moat, retention, market, founder quality…"
                onChange={(v) => onUpdate({ strengths: v })}
              />
              <TextArea
                label="Biggest investment risks"
                value={answers.risks}
                rows={2}

                placeholder="Burn, churn, regulation, competition…"
                onChange={(v) => onUpdate({ risks: v })}
              />
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">
                  Investment recommendation
                </label>
                <select
                  value={answers.recommendation}
                  onChange={(e) =>
                    onUpdate({ recommendation: e.target.value as Answers["recommendation"] })
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/60"
                >
                  <option value="">Select recommendation…</option>
                  <option value="Strong Invest">Strong Invest</option>
                  <option value="Moderate Invest">Moderate Invest</option>
                  <option value="Observe Further">Observe Further</option>
                  <option value="Do Not Invest">Do Not Invest</option>
                </select>
              </div>
              <TextArea
                label="Why this recommendation?"
                value={answers.recReason}
                rows={2}

                placeholder="Brief rationale tied to fundamentals."
                onChange={(v) => onUpdate({ recReason: v })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Complete every field to submit your investment memo.
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
              disabled={!complete}
              className={cn(
                "btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
                !complete && "opacity-40 pointer-events-none",
              )}
            >
              Submit to Investment Committee <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartupDataPanel({ startup, rcaSummary }: { startup: Startup; rcaSummary: string }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Startup data room
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-foreground tracking-tight">
            {startup.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{startup.tagline}</p>
        </div>
        <span className="text-[10px] rounded-full border border-primary/40 bg-primary/5 text-primary px-2 py-0.5">
          {startup.stage}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Metric label="MRR" value={startup.mrr ?? "—"} />
        <Metric label="Growth" value={startup.growth ?? "—"} />
        <Metric label="Retention" value={startup.retention ?? "—"} />
        <Metric label="Burn" value={startup.burn ?? "—"} />
        <Metric label="Runway" value={startup.runway ?? "—"} />
        <Metric label="Customers" value={startup.customers ?? "—"} />
      </div>

      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <Block label="Founders">
          <ul className="text-sm text-foreground/85 space-y-1">
            {startup.founders.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </Block>
        <Block label="Funding history">
          <p className="text-sm text-foreground/85">{startup.funding}</p>
          {startup.marketSize && (
            <p className="mt-2 text-sm text-foreground/85">
              <span className="text-muted-foreground">Market: </span>
              {startup.marketSize}
            </p>
          )}
        </Block>
      </div>

      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <Block label="Strengths" tone="good">
          <ul className="text-sm text-foreground/85 space-y-1.5">
            {startup.strengths.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-[oklch(0.72_0.14_155)] shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Block>
        <Block label="Operational risks" tone="warn">
          <ul className="text-sm text-foreground/85 space-y-1.5">
            {startup.risks.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-[oklch(0.78_0.13_70)] shrink-0" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {startup.competitors && (
        <div className="mt-5">
          <Block label="Competitive landscape">
            <p className="text-sm text-foreground/85">{startup.competitors}</p>
          </Block>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
          RCA insight from previous task
        </div>
        <p className="mt-1 text-sm text-foreground/90">{rcaSummary}</p>
      </div>
    </div>
  );
}

function LearningPanel() {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <BookOpen className="h-3.5 w-3.5" /> How early-stage valuation works
      </div>
      <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
        Early-stage valuation is not based only on revenue. Investors weigh growth, retention,
        market size, founder quality, differentiation, scalability, operational risk, and
        long-term defensibility.
      </p>

      <div className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-center font-mono text-sm text-foreground">
        Valuation = ARR × SaaS Multiple
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <MultBand label="Weak growth / retention" range="4x – 6x" tone="warn" />
        <MultBand label="Average startup" range="6x – 8x" tone="mid" />
        <MultBand label="Strong AI SaaS startup" range="8x – 12x" tone="good" />
      </div>

      <div className="mt-4 rounded-xl border border-[oklch(0.78_0.13_70)]/40 bg-[oklch(0.78_0.13_70)]/5 p-3 text-xs text-foreground/85">
        High growth alone does not justify a high valuation. Investors also evaluate burn,
        retention, scalability, moat, and sustainability of growth.
      </div>
    </div>
  );
}

function MultBand({ label, range, tone }: { label: string; range: string; tone: "good" | "mid" | "warn" }) {
  const color =
    tone === "good"
      ? "border-[oklch(0.72_0.14_155)]/40 bg-[oklch(0.72_0.14_155)]/10 text-[oklch(0.85_0.14_155)]"
      : tone === "warn"
        ? "border-[oklch(0.78_0.13_70)]/40 bg-[oklch(0.78_0.13_70)]/10 text-[oklch(0.85_0.13_75)]"
        : "border-primary/40 bg-primary/10 text-primary";
  return (
    <div className={cn("rounded-xl border p-3", color)}>
      <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">{label}</div>
      <div className="mt-1 text-base font-semibold">{range} ARR</div>
    </div>
  );
}

function ExamplesPanel({ sector, examples }: { sector: ThemeId; examples: Startup[] }) {
  if (examples.length === 0) return null;
  const label =
    sector === "ai"
      ? "AI & SaaS valuation comparables"
      : sector === "climate"
        ? "ClimateTech valuation comparables"
        : "HealthTech valuation comparables";
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <TrendingUp className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-4 space-y-4">
        {examples.map((s) => {
          const v = getValuation(s);
          return (
            <div key={s.id} className="rounded-xl border border-border bg-background/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.tagline}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    ARR
                  </div>
                  <div className="text-sm font-mono text-foreground">${v.arrUsdM}M</div>
                </div>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-[oklch(0.72_0.14_155)]/30 bg-[oklch(0.72_0.14_155)]/5 p-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.85_0.14_155)] mb-1">
                    Why investors like it
                  </div>
                  <ul className="space-y-0.5 text-foreground/85">
                    {v.likes.slice(0, 3).map((l) => (
                      <li key={l}>• {l}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-[oklch(0.78_0.13_70)]/30 bg-[oklch(0.78_0.13_70)]/5 p-2.5">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.85_0.13_75)] mb-1">
                    Why investors are cautious
                  </div>
                  <ul className="space-y-0.5 text-foreground/85">
                    {v.cautions.slice(0, 2).map((c) => (
                      <li key={c}>• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">
                  Suggested multiple{" "}
                  <span className="text-foreground font-medium">
                    {v.multipleLow}x–{v.multipleHigh}x
                  </span>
                </span>
                <span className="text-primary font-semibold">
                  ${v.valuationLowM}M – ${v.valuationHighM}M
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Block({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: "good" | "warn";
  children: React.ReactNode;
}) {
  const border =
    tone === "good"
      ? "border-[oklch(0.72_0.14_155)]/30"
      : tone === "warn"
        ? "border-[oklch(0.78_0.13_70)]/30"
        : "border-border";
  return (
    <div className={cn("rounded-xl border bg-background/30 p-4", border)}>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function NumericField({
  label,
  value,
  placeholder,
  suffix,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  suffix?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/60 pr-10"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function TextArea({
  label,
  value,
  rows,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/60 resize-y"
      />
    </div>
  );
}

/* ============= Loading ============= */
function Loading({ text }: { text: string }) {
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
        <div className="mt-2 text-lg text-foreground/90">{text}</div>
      </div>
    </div>
  );
}

/* ============= Result ============= */
function ResultPhase({
  candidateName,
  startup,
  answers,
  benchmark,
  onContinue,
}: {
  candidateName: string;
  startup: Startup;
  answers: Answers;
  benchmark: Valuation;
  onContinue: () => void;
}) {
  const studentVal = parseFloat(answers.valuation) || 0;
  const studentMult = parseFloat(answers.multiple) || 0;

  const valClass = classifyValuation(studentVal, benchmark);
  const multClass = classifyMultiple(studentMult, benchmark);

  // accuracy: distance from midpoint
  const mid = (benchmark.valuationLowM + benchmark.valuationHighM) / 2;
  const span = Math.max(1, benchmark.valuationHighM - benchmark.valuationLowM);
  const distance = Math.abs(studentVal - mid) / (mid + span);
  const valAccuracy = Math.max(20, Math.round((1 - Math.min(1, distance)) * 100));

  const strategic = Math.min(
    100,
    Math.round(
      40 +
        Math.min(20, answers.rationale.trim().length / 8) +
        Math.min(20, answers.strengths.trim().length / 8) +
        Math.min(20, answers.risks.trim().length / 8),
    ),
  );

  const finalScore = Math.round(valAccuracy * 0.6 + strategic * 0.4);

  const feedback =
    valClass === "fair"
      ? "Your valuation demonstrates strong investment judgment and understanding of startup fundamentals."
      : valClass === "high"
        ? "The board believes your valuation may overweight market excitement while underestimating operational and scalability risks."
        : "The board identified stronger long-term growth potential and defensibility than reflected in your recommendation.";

  const headline =
    finalScore >= 75
      ? "Investment Memo Approved"
      : finalScore >= 55
        ? "Memo Reviewed with Notes"
        : "Memo Returned for Revision";

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Shield className="h-3.5 w-3.5" /> Investment Committee Review
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        {headline}
      </h1>
      <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">{feedback}</p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat label="Final score" value={`${finalScore}/100`} />
        <Stat label="Valuation accuracy" value={`${valAccuracy}%`} />
        <Stat label="Strategic thinking" value={`${strategic}/100`} />
      </div>

      <div className="mt-8 glass rounded-2xl p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Your memo vs. board benchmark
        </div>
        <div className="mt-3 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Your recommendation
            </div>
            <div className="mt-1 text-foreground">
              <div className="text-2xl font-semibold">${studentVal}M</div>
              <div className="text-xs text-muted-foreground">
                {studentMult}x ARR · {answers.recommendation || "—"}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-primary">
              Board benchmark
            </div>
            <div className="mt-1 text-foreground">
              <div className="text-2xl font-semibold">
                ${benchmark.valuationLowM}M – ${benchmark.valuationHighM}M
              </div>
              <div className="text-xs text-muted-foreground">
                {benchmark.multipleLow}x – {benchmark.multipleHigh}x ARR on ${benchmark.arrUsdM}M ARR
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "mt-4 rounded-lg p-3 text-sm flex gap-2",
            valClass === "fair"
              ? "border border-[oklch(0.72_0.14_155)]/40 bg-[oklch(0.72_0.14_155)]/5"
              : "border border-[oklch(0.78_0.13_70)]/40 bg-[oklch(0.78_0.13_70)]/5",
          )}
        >
          {valClass === "fair" ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.72_0.14_155)]" />
          ) : (
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.78_0.13_70)]" />
          )}
          <p className="text-foreground/90">
            {benchmark.why} {valClass !== "fair" && `Your multiple (${studentMult}x) read as ${multClass === "high" ? "above" : "below"} the board's range.`}
          </p>
        </div>
      </div>

      <div className="mt-8 glass rounded-2xl p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Key strengths of your evaluation
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-foreground/90">
          {evaluationStrengths(answers).map((s) => (
            <li key={s} className="flex gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.72_0.14_155)]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Areas for improvement
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-foreground/90">
          {evaluationImprovements(answers, valClass, multClass).map((s) => (
            <li key={s} className="flex gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.78_0.13_70)]" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="mt-10 text-sm uppercase tracking-[0.22em] text-primary font-semibold">
        Skill badges earned
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "Investment Analysis",
          "Startup Evaluation",
          "Operational Reasoning",
          "Root Cause Analysis",
          "Strategic Decision Making",
        ].map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs text-primary"
          >
            <Sparkles className="h-3 w-3" /> {b}
          </span>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center">
        <button
          onClick={onContinue}
          className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold w-full sm:w-[320px]"
        >
          Time to save the startup <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Certificate · Skills
        </p>
      </div>
    </div>
  );
}

function evaluationStrengths(a: Answers): string[] {
  const out: string[] = [];
  if (a.rationale.trim().length >= 80) out.push("Clear, structured rationale tied to fundamentals.");
  if (a.strengths.trim().length >= 60) out.push("Well-articulated view of moat and competitive position.");
  if (a.risks.trim().length >= 60) out.push("Honest assessment of operational and scalability risks.");
  if (a.recommendation === "Strong Invest" || a.recommendation === "Moderate Invest")
    out.push("Decisive investment stance with clear conviction.");
  if (out.length === 0) out.push("Submitted a complete investment memo.");
  return out;
}

function evaluationImprovements(
  a: Answers,
  valClass: "low" | "fair" | "high",
  multClass: "low" | "fair" | "high",
): string[] {
  const out: string[] = [];
  if (valClass === "high") out.push("Re-weight burn and retention before justifying a premium valuation.");
  if (valClass === "low") out.push("Account for long-term defensibility and market potential.");
  if (multClass !== "fair") out.push("Calibrate the ARR multiple against comparable startups in the sector.");
  if (a.risks.trim().length < 80) out.push("Deepen the risk analysis, bridge symptoms to root causes.");
  if (a.recommendation === "Observe Further" || a.recommendation === "")
    out.push("Lean into a clearer investment stance, committees value decisiveness.");
  if (out.length === 0) out.push("Tighten the link between metrics and the chosen multiple.");
  return out;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

/* ============= Earned (BSC-style certificate + skills + resume + post) ============= */

const SKILL_BADGES = [
  "Investment Analysis",
  "Startup Evaluation",
  "Operational Reasoning",
  "Root Cause Analysis",
  "Strategic Decision Making",
  "Valuation Modelling",
  "Investment Memo Writing",
];

const CERT_W = 1920;
const CERT_H = 1361;

function CertificateNode({
  name,
  startupName,
  scale = 1,
}: {
  name: string;
  startupName: string;
  scale?: number;
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div
      style={{
        width: CERT_W,
        height: CERT_H,
        position: "relative",
        background: "#0A1628",
        overflow: "hidden",
        fontFamily: "'Inter','Helvetica Neue',system-ui,sans-serif",
        color: "#0A1628",
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top left",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 210,
          background:
            "repeating-linear-gradient(135deg,#0A1628 0 32px,#13315c 32px 64px,#1d4ed8 64px 96px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 210,
          background:
            "repeating-linear-gradient(45deg,#0A1628 0 32px,#13315c 32px 64px,#1d4ed8 64px 96px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "42px 245px",
          background: "#ffffff",
          borderRadius: 14,
          padding: "100px 112px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 40,
            }}
          >
            <img
              src={aicLogoUrl}
              alt="AIC × ISB"
              style={{ height: 150, width: "auto", display: "block" }}
              crossOrigin="anonymous"
            />
            <div
              style={{
                background: "#0A1628",
                color: "#fff",
                padding: "32px 46px",
                textAlign: "center",
                minWidth: 320,
                clipPath:
                  "polygon(0 0,100% 0,100% 100%,50% 88%,0 100%)",
              }}
            >
              <div
                style={{ fontWeight: 700, fontSize: 36, letterSpacing: "0.01em" }}
              >
                prent<span style={{ color: "#5dc4fe" }}>i</span>x
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  letterSpacing: "0.04em",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Shaping Early Careers
                <br />
                Across The Globe.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 60 }}>
            <div
              style={{
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#0A1628",
              }}
            >
              Virtual Internship: Program Manager
            </div>
            <div style={{ marginTop: 44, fontSize: 48, fontWeight: 700 }}>
              Certificate of Completion
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 36,
                fontWeight: 600,
                color: "#0A1628",
              }}
            >
              {today}
            </div>
            <div
              style={{
                marginTop: 44,
                fontSize: 22,
                color: "#374151",
              }}
            >
              Awarded to
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#0A1628",
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: 36,
                fontSize: 22,
                lineHeight: 1.55,
                color: "#374151",
                maxWidth: 1280,
              }}
            >
              This certifies that {name} completed the AIC × ISB Virtual
              Internship, Program Manager experience by Prentix, demonstrating
              investment analysis, startup evaluation, mentor mapping,
              operational reasoning, root cause analysis, and strategic
              decision making across a real accelerator workflow. The final
              investment memo evaluated <strong>{startupName}</strong>.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 32,
          }}
        >
          <div style={{ fontSize: 18, color: "#4b5563" }}>
            Verification Code: {staticCode(name + startupName, 18)}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#0A1628" }}>
              Rishik Reddy
            </div>
            <div style={{ fontSize: 20, color: "#4b5563", marginTop: 4 }}>
              Founder, Prentix
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function staticCode(seed: string, len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  let out = "";
  for (let i = 0; i < len; i++) {
    h = (h * 1103515245 + 12345) | 0;
    out += chars[Math.abs(h) % chars.length];
  }
  return out;
}

function EarnedPhase({
  candidateName,
  startup,
  sector,
  onContinue,
}: {
  candidateName: string;
  startup: Startup;
  sector: ThemeId;
  onContinue: () => void;
}) {
  const certName = candidateName?.trim() || "Participant";

  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const id = "inter-bold-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  async function downloadCertificate() {
    if (!certificateRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#0A1628",
        width: CERT_W,
        height: CERT_H,
        windowWidth: CERT_W,
        windowHeight: CERT_H,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_W, CERT_H],
      });
      pdf.addImage(imgData, "PNG", 0, 0, CERT_W, CERT_H);
      pdf.save(`AIC-ISB-Virtual-Internship-${certName}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  function shareCertOnLinkedIn() {
    window.open(
      "https://www.linkedin.com/sharing/share-offsite/?url=https://prentix.ai",
      "_blank",
      "noopener,noreferrer",
    );
  }

  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);
  function copySkill(skill: string) {
    navigator.clipboard.writeText(skill).then(() => {
      setCopiedSkill(skill);
      window.setTimeout(() => {
        setCopiedSkill((c) => (c === skill ? null : c));
      }, 1500);
    });
  }

  const previewScale = 0.3;

  return (
    <div
      className="mx-auto max-w-[760px] px-5 sm:px-8 py-12 sm:py-16 space-y-16"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      {/* Certificate */}
      <section>
        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Your certificate
        </div>
        <h2 className="mt-3 text-center text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Congratulations, {getFirstName(candidateName)}.
        </h2>

        <div className="mt-8 flex justify-center">
          <div
            style={{
              width: CERT_W * previewScale,
              height: CERT_H * previewScale,
              maxWidth: "100%",
              overflow: "hidden",
              borderRadius: 10,
              boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
            }}
            className="border border-primary/40"
          >
            <CertificateNode
              name={certName}
              startupName={startup.name}
              scale={previewScale}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={downloadCertificate}
            disabled={downloading}
            className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {downloading ? "Generating PDF…" : "Download Certificate (PDF)"}
          </button>
          <button
            onClick={shareCertOnLinkedIn}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition"
          >
            <Linkedin className="h-4 w-4" /> Share on LinkedIn
          </button>
        </div>
      </section>

      {/* Resume line */}
      {/* Skills */}
      <section>
        <div className="text-center text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Skills you can add to your resume and LinkedIn
        </div>
        <p className="mt-4 text-center text-[14px] text-muted-foreground leading-relaxed">
          You didn't just complete a simulation. You practiced skills that take most people years
          of on-the-job experience to develop.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {SKILL_BADGES.map((skill) => {
            const isCopied = copiedSkill === skill;
            return (
              <button
                key={skill}
                onClick={() => copySkill(skill)}
                className="group relative inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-3.5 py-1.5 text-[12px] text-foreground hover:bg-primary/10 transition cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                <span>{skill}</span>
                {isCopied ? (
                  <Check className="h-3 w-3 text-[oklch(0.72_0.14_155)]" />
                ) : (
                  <Copy className="h-3 w-3 opacity-0 group-hover:opacity-60 transition" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          Click any skill to copy it.
        </p>
      </section>

      {/* Footer */}
      <section className="flex flex-col items-center gap-3 pt-4">
        <p className="text-center text-[14px] text-muted-foreground">
          An internship experience by Prentix. Built with AIC × ISB.
        </p>
        <a
          href="https://prentix.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-primary hover:underline"
        >
          Explore more internships at prentix.ai →
        </a>
      </section>

      {/* Hidden full-size certificate node for PDF capture */}
      <div
        style={{
          position: "fixed",
          left: -100000,
          top: 0,
          pointerEvents: "none",
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <div ref={certificateRef}>
          <CertificateNode name={certName} startupName={startup.name} />
        </div>
      </div>
    </div>
  );
}