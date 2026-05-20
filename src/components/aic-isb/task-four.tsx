import { useMemo, useState } from "react";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  Shield,
  TrendingDown,
  TrendingUp,
  Minus,
  Quote,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { THEMES, type ThemeId, type Startup } from "./startups-data";
import { getRcaCase, type RcaCase } from "./rca-data";

type Phase = "email" | "dashboard" | "loading" | "result";

type Answer = {
  rootCause: string;
  supportingMetrics: string;
  priority: string;
  actionPlan: string;
  expectedOutcome: string;
};

const emptyAnswer: Answer = {
  rootCause: "",
  supportingMetrics: "",
  priority: "",
  actionPlan: "",
  expectedOutcome: "",
};

export function AicIsbTaskFour({
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
  const startups = useMemo(
    () => bundle.startups.filter((s) => shortlistedIds.includes(s.id)),
    [bundle, shortlistedIds],
  );

  const [phase, setPhase] = useState<Phase>("email");
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(startups.map((s) => [s.id, { ...emptyAnswer }])),
  );

  const complete = startups.every((s) => {
    const a = answers[s.id];
    return (
      a.rootCause.trim().length >= 40 &&
      a.supportingMetrics.trim().length >= 20 &&
      a.priority.trim().length >= 20 &&
      a.actionPlan.trim().length >= 30 &&
      a.expectedOutcome.trim().length >= 20
    );
  });

  function update(id: string, patch: Partial<Answer>) {
    setAnswers((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  }

  function submit() {
    if (!complete) return;
    setPhase("loading");
    window.setTimeout(() => setPhase("result"), 1800);
  }

  if (phase === "email") return <EmailPhase name={candidateName} onStart={() => setPhase("dashboard")} />;
  if (phase === "loading") return <Loading text="Board running structured RCA review…" />;
  if (phase === "result") {
    return <ResultPhase startups={startups} answers={answers} onContinue={() => onComplete?.()} />;
  }

  return (
    <Dashboard
      startups={startups}
      answers={answers}
      complete={complete}
      onUpdate={update}
      onSubmit={submit}
    />
  );
}

/* ---------------- Email ---------------- */
function EmailPhase({ name, onStart }: { name: string; onStart: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Mail className="h-3.5 w-3.5" /> New message · Inbox
      </div>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Task 4 · Root Cause Analysis & Operational Review
      </h1>
      <div className="mt-8 glass rounded-2xl overflow-hidden" style={{ boxShadow: "0 8px 40px rgba(11,16,38,0.55)" }}>
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <div className="h-11 w-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0 border border-primary/40">AS</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">
              Animesh Sharma <span className="text-muted-foreground font-normal">· Program Director, AIC × ISB</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">Operational Review & RCA Task</div>
          </div>
          <div className="text-[11px] text-muted-foreground">Today · 02:18 PM</div>
        </div>
        <div className="px-6 sm:px-7 py-6 text-[14.5px] text-foreground/90 leading-[1.75] whitespace-pre-wrap">
{`Hi ${name},

As the accelerator cohort progresses, several startups have started facing operational and growth challenges despite early traction.

Your next task is to conduct a Root Cause Analysis for the startups you selected and identify:
• The underlying issue
• Supporting operational indicators
• Strategic bottlenecks
• Recommended solutions

Focus on long-term sustainability rather than surface-level symptoms.

Best,
Animesh Sharma`}
        </div>
        <div className="px-6 sm:px-7 pb-7">
          <button onClick={onStart} className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold w-full sm:w-auto">
            Start Root Cause Analysis <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({
  startups,
  answers,
  complete,
  onUpdate,
  onSubmit,
}: {
  startups: Startup[];
  answers: Record<string, Answer>;
  complete: boolean;
  onUpdate: (id: string, patch: Partial<Answer>) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-14 pb-40">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Task 4 · Operational Review</div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Startup Operational Review</h1>
      <p className="mt-3 text-[15px] text-muted-foreground">Analyze the issue, identify the root cause, and recommend strategic solutions.</p>

      <div className="mt-10 space-y-12">
        {startups.map((s, i) => (
          <RcaBlock
            key={s.id}
            index={i + 1}
            startup={s}
            answer={answers[s.id]}
            onUpdate={(patch) => onUpdate(s.id, patch)}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {startups.filter((s) => {
              const a = answers[s.id];
              return (
                a.rootCause.trim().length >= 40 &&
                a.supportingMetrics.trim().length >= 20 &&
                a.priority.trim().length >= 20 &&
                a.actionPlan.trim().length >= 30 &&
                a.expectedOutcome.trim().length >= 20
              );
            }).length}/{startups.length} RCAs complete
          </div>
          <button
            onClick={onSubmit}
            disabled={!complete}
            className={cn(
              "btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
              !complete && "opacity-40 pointer-events-none",
            )}
          >
            Submit RCA <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RcaBlock({
  index,
  startup,
  answer,
  onUpdate,
}: {
  index: number;
  startup: Startup;
  answer: Answer;
  onUpdate: (patch: Partial<Answer>) => void;
}) {
  const rca = getRcaCase(startup);

  return (
    <section>
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Case {index}</div>
            <h2 className="mt-1 text-2xl font-semibold text-foreground tracking-tight">{startup.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{startup.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {rca.boardTags.map((t) => (
              <span key={t} className="text-[10px] rounded-full border border-[oklch(0.78_0.13_70)]/40 bg-[oklch(0.78_0.13_70)]/10 text-[oklch(0.85_0.13_75)] px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border bg-background/30 p-4 text-sm text-foreground/90 leading-relaxed">
          <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-2">Problem statement</div>
          {rca.problem}
        </div>

        {/* Charts */}
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          <Sparkline label="Revenue trend" points={rca.revenue} color="oklch(0.72 0.14 155)" />
          <Sparkline label="Burn trend" points={rca.burn} color="oklch(0.72 0.16 25)" />
          <Sparkline label="Retention %" points={rca.retention} color="#5dc4fe" />
        </div>

        {/* Ops metrics */}
        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          {rca.operationalMetrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-background/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{m.label}</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-base font-semibold text-foreground">{m.value}</div>
                <TrendIcon trend={m.trend} />
              </div>
            </div>
          ))}
        </div>

        {/* Voices + team */}
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <VoiceBlock icon={<MessageSquare className="h-3.5 w-3.5" />} title="Customer feedback" items={rca.customerVoices} />
          <VoiceBlock icon={<Users className="h-3.5 w-3.5" />} title="Internal team notes" items={rca.teamNotes} />
        </div>

        {/* Founder + investor */}
        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-primary mb-1 flex items-center gap-1.5">
              <Quote className="h-3 w-3" /> Founder interview
            </div>
            <p className="text-sm italic text-foreground/90">{rca.founderQuote}</p>
          </div>
          <div className="rounded-xl border border-[oklch(0.78_0.13_70)]/40 bg-[oklch(0.78_0.13_70)]/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.85_0.13_75)] mb-1">Investor pressure</div>
            <p className="text-sm text-foreground/90">{rca.investorPressure}</p>
          </div>
        </div>
      </div>

      {/* RCA form */}
      <div className="mt-5 glass rounded-2xl p-5 sm:p-6 space-y-5">
        <FormField
          label="1. What is the root cause?"
          value={answer.rootCause}
          rows={3}
          min={40}
          placeholder="State the underlying issue, not the surface symptom."
          onChange={(v) => onUpdate({ rootCause: v })}
        />
        <FormField
          label="2. Which metrics support your conclusion?"
          value={answer.supportingMetrics}
          rows={2}
          min={20}
          placeholder="Reference the operational metrics, trends, and signals above."
          onChange={(v) => onUpdate({ supportingMetrics: v })}
        />
        <FormField
          label="3. What should the startup prioritize?"
          value={answer.priority}
          rows={2}
          min={20}
          placeholder="What's the single most important focus over the next 60 days?"
          onChange={(v) => onUpdate({ priority: v })}
        />
        <FormField
          label="4. Recommended action plan"
          value={answer.actionPlan}
          rows={3}
          min={30}
          placeholder="Concrete operational moves — what, who, by when."
          onChange={(v) => onUpdate({ actionPlan: v })}
        />
        <FormField
          label="5. Expected outcome if solved"
          value={answer.expectedOutcome}
          rows={2}
          min={20}
          placeholder="What metric improves, by how much, and on what timeline?"
          onChange={(v) => onUpdate({ expectedOutcome: v })}
        />
      </div>
    </section>
  );
}

function FormField({
  label,
  value,
  rows,
  min,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  min: number;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const remaining = min - value.trim().length;
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/60 resize-y"
      />
      <div className="mt-1 text-[11px] text-muted-foreground">
        {remaining > 0 ? `${remaining} more characters required` : "Looks good."}
      </div>
    </div>
  );
}

function VoiceBlock({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-background/30 p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-2 flex items-center gap-1.5">
        {icon} {title}
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/85">
        {items.map((v) => (
          <li key={v} className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-[oklch(0.72_0.16_25)]" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-[oklch(0.72_0.14_155)]" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function Sparkline({ label, points, color }: { label: string; points: number[]; color: string }) {
  const w = 220;
  const h = 64;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / range) * (h - 10) - 4;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="text-[11px] font-mono text-foreground/80">
          {points[0]} → {points[points.length - 1]}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full h-16">
        <path d={area} fill={color} opacity={0.15} />
        <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---------------- Loading ---------------- */
function Loading({ text }: { text: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative h-20 w-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(93,196,254,0.45), transparent 70%)", animation: "blobFloat 2.4s ease-in-out infinite" }}
        />
        <Loader2 className="h-20 w-20 animate-spin text-primary/80 relative" strokeWidth={1.25} />
      </div>
      <div className="text-center">
        <div className="text-sm uppercase tracking-[0.22em] text-primary font-semibold">Accelerator Board</div>
        <div className="mt-2 text-lg text-foreground/90">{text}</div>
      </div>
    </div>
  );
}

/* ---------------- Result ---------------- */
function ResultPhase({
  startups,
  answers,
  onContinue,
}: {
  startups: Startup[];
  answers: Record<string, Answer>;
  onContinue: () => void;
}) {
  const evaluations = startups.map((s) => {
    const rca = getRcaCase(s);
    const text = answers[s.id].rootCause.toLowerCase();
    const hits = rca.keywords.filter((k) => text.includes(k)).length;
    const strong = hits >= 2 || (hits >= 1 && rca.keywords.length <= 3);
    return { startup: s, rca, hits, strong };
  });
  const accuracy = Math.round(
    (evaluations.filter((e) => e.strong).length / evaluations.length) * 70 +
      Math.min(30, evaluations.reduce((sum, e) => sum + Math.min(15, e.hits * 5), 0)),
  );
  const strategic = Math.round(
    evaluations.reduce((sum, e) => {
      const a = answers[e.startup.id];
      const depth = (a.actionPlan.trim().length + a.priority.trim().length + a.expectedOutcome.trim().length) / 10;
      return sum + Math.min(100, depth + (e.strong ? 30 : 10));
    }, 0) / evaluations.length,
  );

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Shield className="h-3.5 w-3.5" /> Operational Board Verdict
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        {accuracy >= 70 ? "RCA Approved" : "RCA Reviewed"}
      </h1>
      <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
        {accuracy >= 70
          ? "Your analysis demonstrates strong operational reasoning and structured problem-solving."
          : "You identified surface-level symptoms correctly, but the board believes the deeper operational constraint was not fully addressed in some cases."}
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat label="RCA accuracy" value={`${Math.min(100, accuracy)}%`} />
        <Stat label="Strategic thinking" value={`${Math.min(100, strategic)}/100`} />
        <Stat label="PM readiness" value={accuracy >= 80 ? "Ready" : accuracy >= 60 ? "Emerging" : "Developing"} />
      </div>

      <h2 className="mt-10 text-sm uppercase tracking-[0.22em] text-primary font-semibold">Case-by-case board feedback</h2>
      <div className="mt-4 space-y-4">
        {evaluations.map((e) => (
          <div key={e.startup.id} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-foreground">{e.startup.name}</div>
                <div className="text-xs text-muted-foreground">{e.startup.tagline}</div>
              </div>
              <span className={cn(
                "text-[10px] rounded-full px-2 py-0.5 border",
                e.strong
                  ? "border-[oklch(0.72_0.14_155)]/50 text-[oklch(0.72_0.14_155)] bg-[oklch(0.72_0.14_155)]/10"
                  : "border-[oklch(0.72_0.16_25)]/40 text-[oklch(0.72_0.16_25)] bg-[oklch(0.72_0.16_25)]/10",
              )}>
                {e.strong ? "Strong analysis" : "Needs deeper read"}
              </span>
            </div>
            <div className="mt-3 rounded-lg border border-border bg-background/40 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Board's expected root cause</div>
              <p className="mt-1 text-sm text-foreground/90">{e.rca.rootCauseLabel}</p>
            </div>
            <div className={cn(
              "mt-3 rounded-lg p-3 text-sm flex gap-2",
              e.strong
                ? "border border-[oklch(0.72_0.14_155)]/40 bg-[oklch(0.72_0.14_155)]/5"
                : "border border-[oklch(0.72_0.16_25)]/40 bg-[oklch(0.72_0.16_25)]/5",
            )}>
              {e.strong ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.72_0.14_155)]" />
              ) : (
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-[oklch(0.72_0.16_25)]" />
              )}
              <p className="text-foreground/90">
                {e.strong
                  ? "Your analysis demonstrates strong operational reasoning and structured problem-solving."
                  : "You identified surface-level symptoms correctly, but the board believes the deeper operational constraint was not fully addressed."}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm uppercase tracking-[0.22em] text-primary font-semibold">Skill badges</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Problem Solving", "Structured Thinking", "Operational Reasoning", "Strategic Prioritization", "PM Readiness"].map((b) => (
          <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs text-primary">
            <Sparkles className="h-3 w-3" /> {b}
          </span>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <button onClick={onContinue} className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
          Continue Simulation <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

// Re-export type to silence "unused" warnings in dense files
export type { RcaCase };