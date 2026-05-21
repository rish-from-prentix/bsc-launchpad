import { useEffect, useMemo, useRef, useState } from "react";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  Shield,
  TrendingUp,
  DollarSign,
  BookOpen,
  Trophy,
  Download,
  Share2,
  Building2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { THEMES, type ThemeId, type Startup } from "./startups-data";
import { getRcaCase } from "./rca-data";
import {
  getValuation,
  classifyValuation,
  classifyMultiple,
  type Valuation,
} from "./valuation-data";

type Phase = "email" | "select" | "workspace" | "loading" | "result";

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
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { selectedId?: string | null };
      return parsed.selectedId ?? null;
    } catch {
      return null;
    }
  });
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
    return <EmailPhase name={candidateName} onStart={() => setPhase("select")} />;

  if (phase === "select")
    return (
      <SelectPhase
        startups={cohortStartups}
        onSelect={(id) => {
          setSelectedId(id);
          setPhase("workspace");
        }}
      />
    );

  if (phase === "loading")
    return <Loading text="Investment committee reviewing your memo…" />;

  if (phase === "result" && selected && benchmark)
    return (
      <ResultPhase
        candidateName={candidateName}
        startup={selected}
        answers={answers}
        benchmark={benchmark}
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
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Mail className="h-3.5 w-3.5" /> New message · Inbox
      </div>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Task 5 · Final Investment Evaluation
      </h1>
      <div
        className="mt-8 glass rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 8px 40px rgba(11,16,38,0.55)" }}
      >
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <div className="h-11 w-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0 border border-primary/40">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">
              Animesh Sharma{" "}
              <span className="text-muted-foreground font-normal">
                · Program Director, AIC × ISB
              </span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              Final Investment Evaluation
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">Today · 04:42 PM</div>
        </div>
        <div className="px-6 sm:px-7 py-6 text-[14.5px] text-foreground/90 leading-[1.75] whitespace-pre-wrap">
{`Hi ${name},

You've now completed multiple stages of the accelerator process.

For the final task, you'll evaluate one startup from your selected cohort and recommend:
• A realistic valuation
• Whether the accelerator should invest
• Key strengths and investment risks

Focus on balancing growth potential with operational sustainability.

Best,
Animesh Sharma`}
        </div>
        <div className="px-6 sm:px-7 pb-7">
          <button
            onClick={onStart}
            className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold w-full sm:w-auto"
          >
            Start Investment Evaluation <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============= Select ============= */
function SelectPhase({
  startups,
  onSelect,
}: {
  startups: Startup[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Task 5 · Investment Evaluation
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        Investment Evaluation
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        Choose one startup from your accelerator cohort to evaluate.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {startups.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="text-left glass rounded-2xl p-5 hover:border-primary/60 transition border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/40 text-primary flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold text-foreground">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.tagline}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
              <Mini label="Stage" value={s.stage} />
              <Mini label="MRR" value={s.mrr ?? "—"} />
              <Mini label="Funding" value={s.funding} />
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary">
              Evaluate this startup <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="text-[12px] font-medium text-foreground truncate">{value}</div>
    </div>
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
        Task 5 · Investment Memo
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        Startup Investment Recommendation
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        Evaluating <span className="text-foreground font-medium">{startup.name}</span> —{" "}
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

  function downloadCertificate() {
    const html = certificateHtml(candidateName, finalScore, startup.name);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AIC-ISB-Accelerator-Certificate-${candidateName.replace(/\s+/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function shareLinkedIn() {
    const text = encodeURIComponent(
      `I just completed the AIC × ISB Virtual Accelerator Simulation by Prentix — scoring ${finalScore}/100 on my final investment memo for ${startup.name}.`,
    );
    const url = encodeURIComponent("https://prentix-bsc.lovable.app");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

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
          "Mentor Mapping",
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

      <div className="mt-10 glass rounded-2xl p-6 text-center">
        <Trophy className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 text-2xl font-semibold text-foreground">Congratulations, {candidateName}.</h3>
        <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
          You have successfully completed the AIC × ISB Accelerator Simulation. Throughout this
          experience, you demonstrated investment analysis, startup evaluation, mentor mapping,
          operational reasoning, root cause analysis, and strategic decision making — the type of
          analytical thinking expected in startup accelerators, venture capital, and strategic
          operations roles.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={downloadCertificate}
            className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            <Download className="h-4 w-4" /> Download Certificate
          </button>
          <button
            onClick={shareLinkedIn}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition"
          >
            <Share2 className="h-4 w-4" /> Share on LinkedIn
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground transition"
        >
          Continue Internship <ArrowRight className="h-4 w-4" />
        </button>
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
  if (a.risks.trim().length < 80) out.push("Deepen the risk analysis — bridge symptoms to root causes.");
  if (a.recommendation === "Observe Further" || a.recommendation === "")
    out.push("Lean into a clearer investment stance — committees value decisiveness.");
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

function certificateHtml(name: string, score: number, startupName: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>AIC × ISB Accelerator Certificate</title>
<style>
 body{margin:0;font-family:'Inter',system-ui,sans-serif;background:#0b1026;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px}
 .card{max-width:900px;width:100%;padding:60px;border:1px solid rgba(93,196,254,.4);border-radius:24px;background:linear-gradient(135deg,#111c5a,#1c1f7a);box-shadow:0 20px 80px rgba(0,0,0,.5);text-align:center}
 h1{font-size:14px;letter-spacing:.3em;text-transform:uppercase;color:#5dc4fe;margin:0 0 24px}
 h2{font-size:40px;margin:0 0 16px;font-weight:700;letter-spacing:-0.02em}
 .name{font-size:48px;font-weight:700;color:#5dc4fe;margin:32px 0;letter-spacing:-0.02em}
 p{font-size:16px;line-height:1.7;color:rgba(255,255,255,.85);margin:0 0 12px}
 .score{margin-top:40px;display:inline-block;padding:14px 28px;border:1px solid rgba(93,196,254,.5);border-radius:999px;font-size:14px;color:#5dc4fe;letter-spacing:.1em;text-transform:uppercase}
 .meta{margin-top:40px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.6)}
</style></head><body><div class="card">
 <h1>AIC × ISB Virtual Accelerator</h1>
 <h2>Certificate of Completion</h2>
 <p>This certifies that</p>
 <div class="name">${escapeHtml(name)}</div>
 <p>has successfully completed the AIC × ISB Virtual Accelerator Simulation by Prentix, demonstrating investment analysis, startup evaluation, mentor mapping, operational reasoning, root cause analysis, and strategic decision making.</p>
 <p>Final investment memo evaluated <strong>${escapeHtml(startupName)}</strong>.</p>
 <div class="score">Final Score · ${score}/100</div>
 <div class="meta">Issued by Prentix · Program Director, Animesh Sharma</div>
</div></body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}