import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  ShieldCheck,
  Paperclip,
  Reply,
  Star,
  ChevronDown,
  Sparkles,
  Brain,
  Leaf,
  HeartPulse,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  Lock,
  CheckCircle2,
  CircleCheck,
} from "lucide-react";
import { AicIsbLogo } from "./aic-logo";
import { cn } from "@/lib/utils";

type Sector = "ai" | "climate" | "health";

const SECTORS: Array<{
  id: Sector;
  name: string;
  blurb: string;
  icon: React.ReactNode;
}> = [
  {
    id: "ai",
    name: "AI & SaaS",
    blurb: "Foundation models, vertical SaaS, agentic workflows.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "climate",
    name: "ClimateTech & Sustainability",
    blurb: "Decarbonisation, circular economy, climate finance.",
    icon: <Leaf className="h-5 w-5" />,
  },
  {
    id: "health",
    name: "HealthTech",
    blurb: "Digital health, diagnostics, care delivery models.",
    icon: <HeartPulse className="h-5 w-5" />,
  },
];

type SectionId =
  | "overview"
  | "problems"
  | "activity"
  | "risks"
  | "recommendation";

const SECTIONS: Array<{
  id: SectionId;
  title: string;
  placeholder: string;
}> = [
  {
    id: "overview",
    title: "An overview of the sector and why it is growing",
    placeholder:
      "Define the sector, the tailwinds driving its growth, and why now is the right moment for an accelerator thesis here.",
  },
  {
    id: "problems",
    title: "Key market problems and startup opportunities within the space",
    placeholder:
      "What real-world problems are unsolved? Which white-space opportunities could a startup credibly attack?",
  },
  {
    id: "activity",
    title: "Current startup and investor activity in the sector",
    placeholder:
      "Name notable startups, funding rounds, active investors, and emerging sub-segments.",
  },
  {
    id: "risks",
    title: "Risks, challenges, and future potential",
    placeholder:
      "Highlight regulatory, GTM, technical, and capital risks — plus the long-term scalability story.",
  },
  {
    id: "recommendation",
    title: "Your final recommendation with clear justification",
    placeholder:
      "Which 2–3 sub-themes should AIC × ISB prioritise in the next cohort, and why? Tie back to your earlier reasoning.",
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

export function AicIsbTaskOne({
  candidateName,
  onComplete,
}: {
  candidateName: string;
  onComplete?: () => void;
}) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [emailOpen, setEmailOpen] = useState(true);
  const [revealAssignment, setRevealAssignment] = useState(false);
  const [sector, setSector] = useState<Sector | null>(null);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const saveTimer = useRef<number | null>(null);

  // Hydrate from localStorage once
  useEffect(() => {
    const p = loadPersisted();
    setSector(p.sector);
    setAnswers(p.answers);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("ready"), 1400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    const t = window.setTimeout(() => setRevealAssignment(true), 1200);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Autosave (debounced)
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

  const greetingName = candidateName || "there";
  const todayLabel = useMemo(() => "Today · 9:30 AM", []);

  const canSubmit =
    !!sector &&
    SECTIONS.every((s) => answers[s.id].trim().length >= 40) &&
    !submitted;

  function handleAnswer(id: SectionId, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
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

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
    setShowSuccess(true);
    onComplete?.();
    window.setTimeout(() => setShowSuccess(false), 2600);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14 pb-32 relative">
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-24 h-[420px] -z-10"
        style={{
          background:
            "radial-gradient(800px 320px at 20% 0%, oklch(0.78 0.09 80 / 0.07), transparent 60%), radial-gradient(700px 280px at 80% 10%, oklch(0.72 0.14 155 / 0.05), transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-3xl">
        <div className="min-w-0">
          {/* Title block */}
          <div className="mb-8">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
              Task 1 of 5
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Task 1 — Thesis: The Basics
            </h1>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Estimated Time: 20–30 mins
            </div>
          </div>

          {/* Background — glass card */}
          <section
            className="rounded-2xl border border-border p-6 sm:p-8 mb-10"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.21 0 0 / 0.7), oklch(0.16 0 0 / 0.7))",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 oklch(1 0 0 / 0.04)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
              Background
            </div>
            <div className="space-y-4 text-[14.5px] leading-[1.75] text-foreground/90">
              <p>
                Startup accelerators and venture capital firms play a key role in
                helping early-stage startups grow into scalable businesses. From
                AI and SaaS to ClimateTech and HealthTech, accelerators support
                founders through mentorship, market access, strategic guidance,
                and investor readiness.
              </p>
              <p>
                In this simulation, you will step into the role of a{" "}
                <span className="text-primary font-medium">Program Manager Intern</span>{" "}
                working in the accelerator ecosystem of{" "}
                <span className="text-foreground font-medium">
                  Indian School of Business × Atal Incubation Centre
                </span>
                .
              </p>
            </div>
          </section>

          {/* Loading / Email */}
          {phase === "loading" ? (
            <ReceivingState />
          ) : (
            <section style={{ animation: "fadeSlide 320ms ease-out" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                  1 New Email
                </span>
              </div>

              <EmailCard
                open={emailOpen}
                onToggle={() => setEmailOpen((o) => !o)}
                candidateName={greetingName}
                timestamp={todayLabel}
              />
            </section>
          )}

          {revealAssignment && (
            <section className="mt-12" style={{ animation: "fadeSlide 500ms ease-out" }}>
              <Divider label="Begin Assignment" />

              {/* Sector selection */}
              <div className="mt-10">
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                  Step 1
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-foreground">
                  Choose your sector
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Pick the area you want to build an accelerator thesis around.
                </p>

                <div className="mt-5 grid sm:grid-cols-3 gap-4">
                  {SECTORS.map((s) => {
                    const selected = sector === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => setSector(s.id)}
                        className={cn(
                          "group text-left rounded-2xl border p-5 transition-all duration-300 disabled:cursor-not-allowed",
                          selected
                            ? "border-primary bg-primary/5 -translate-y-0.5"
                            : "border-border bg-card hover:border-primary/40 hover:-translate-y-0.5",
                        )}
                        style={{
                          boxShadow: selected
                            ? "0 0 0 1px oklch(0.78 0.09 80 / 0.55), 0 18px 40px -18px oklch(0.78 0.09 80 / 0.55)"
                            : "0 4px 16px rgba(0,0,0,0.25)",
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                              selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-primary group-hover:bg-primary/10",
                            )}
                          >
                            {s.icon}
                          </div>
                          {selected && (
                            <CircleCheck className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="mt-4 text-sm font-semibold text-foreground">
                          {s.name}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {s.blurb}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Response workspace */}
              <div className="mt-12">
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                  Step 2
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-foreground">
                  Build your thesis
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Each section needs at least a short, well-reasoned response.
                </p>

                <div className="mt-6 space-y-7">
                  {SECTIONS.map((s, i) => (
                    <ResponseField
                      key={s.id}
                      index={i + 1}
                      title={s.title}
                      placeholder={s.placeholder}
                      value={answers[s.id]}
                      onChange={(v) => handleAnswer(s.id, v)}
                      disabled={submitted}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

      </div>

      {/* Bottom action bar */}
      {revealAssignment && (
        <BottomBar
          canSubmit={canSubmit}
          submitted={submitted}
          saveState={saveState}
          onSave={handleSaveDraft}
          onSubmit={handleSubmit}
        />
      )}

      {/* Success overlay */}
      {showSuccess && <SuccessOverlay />}
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function ReceivingState() {
  return (
    <div
      className="rounded-2xl border border-border bg-card/60 px-5 py-6 flex items-center gap-3"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <div className="flex gap-1">
        <Dot delay="0s" />
        <Dot delay="0.15s" />
        <Dot delay="0.3s" />
      </div>
      <div className="text-sm text-muted-foreground">
        Receiving assignment from Animesh…
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-primary inline-block"
      style={{
        animation: "softPulse 1.2s ease-in-out infinite",
        animationDelay: delay,
      }}
    />
  );
}

function EmailCard({
  open,
  onToggle,
  candidateName,
  timestamp,
}: {
  open: boolean;
  onToggle: () => void;
  candidateName: string;
  timestamp: string;
}) {
  return (
    <article
      className="rounded-2xl border border-primary/30 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.21 0 0), oklch(0.16 0 0))",
        boxShadow:
          "0 18px 48px rgba(0,0,0,0.5), 0 0 0 1px oklch(0.78 0.09 80 / 0.08)",
      }}
    >
      <header className="flex items-start gap-4 p-5 sm:p-6 border-b border-border/70">
        <div className="h-12 w-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">
              Animesh
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">CEO, AIC × ISB</span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-primary border border-primary/40 bg-primary/5 rounded-full px-1.5 py-0.5">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
            <AicIsbLogo height={14} className="ml-1 opacity-80" />
          </div>
          <div className="mt-1 text-[13px] text-foreground/90 font-medium truncate">
            Research Assignment — Accelerator Thesis for Upcoming Cohort
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            To: {candidateName} · {timestamp}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconBtn label="Star"><Star className="h-4 w-4" /></IconBtn>
          <IconBtn label="Reply"><Reply className="h-4 w-4" /></IconBtn>
          <button
            onClick={onToggle}
            aria-label={open ? "Collapse email" : "Expand email"}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")}
            />
          </button>
        </div>
      </header>

      {open && (
        <div className="px-6 sm:px-8 py-6 text-[14.5px] leading-[1.8] text-foreground/90">
          <p className="text-foreground font-semibold mb-3">
            Welcome to Your First Assignment
          </p>
          <p>Hi {candidateName},</p>
          <p className="mt-3">Welcome to the AIC × ISB accelerator ecosystem.</p>
          <p className="mt-3">
            As part of our upcoming accelerator cohort, we are identifying sectors
            with the strongest potential for startup innovation, scalability, and
            investor interest. Your role as a Program Manager Intern is to help us
            evaluate where the next wave of high-potential startups could emerge.
          </p>
          <p className="mt-3">
            For this assignment, I’d like you to develop an{" "}
            <span className="text-primary font-medium">Accelerator Thesis</span>{" "}
            for <span className="font-medium">one</span> of the following sectors:
          </p>
          <ul className="mt-2 space-y-1.5 pl-1">
            {[
              "Artificial Intelligence (AI) & SaaS",
              "ClimateTech & Sustainability",
              "HealthTech",
            ].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Please structure your submission carefully and support your
            recommendations with strong strategic reasoning.
          </p>
          <p className="mt-6 text-foreground font-medium">Best,</p>
          <p className="text-foreground/90">Animesh</p>
          <p className="text-xs text-muted-foreground">CEO — AIC × ISB</p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground/90">
            <Paperclip className="h-3.5 w-3.5 text-primary" />
            Accelerator Thesis Guidelines.pdf
            <span className="text-muted-foreground">· 248 KB</span>
          </div>

          <div className="mt-6 flex items-center gap-2 pt-4 border-t border-border/60">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition"
            >
              <Reply className="h-3.5 w-3.5" /> Reply
            </button>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Assignment unlocked below
            </span>
          </div>
        </div>
      )}
    </article>
  );
}

function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition"
    >
      {children}
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] uppercase tracking-[0.28em] text-primary font-semibold">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ---------------- Auto-expanding response field ---------------- */

const MIN_CHARS = 40;

function ResponseField({
  index,
  title,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  index: number;
  title: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.max(120, el.scrollHeight) + "px";
  }, [value]);

  const count = value.length;
  const meetsMin = count >= MIN_CHARS;

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold font-mono">
          0{index}
        </span>
        <h3 className="text-[15px] sm:text-base font-semibold text-foreground leading-snug">
          {title}
        </h3>
      </div>
      <div
        className="rounded-xl border border-border bg-card/60 focus-within:border-primary/60 transition-colors"
        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
      >
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className="w-full bg-transparent resize-none px-4 sm:px-5 py-4 text-[14.5px] leading-[1.7] text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-60"
          style={{ minHeight: 120 }}
        />
        <div className="flex items-center justify-between px-4 sm:px-5 py-2 border-t border-border/60 text-[11px]">
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              meetsMin ? "text-success" : "text-muted-foreground",
            )}
            style={meetsMin ? { color: "oklch(0.72 0.14 155)" } : undefined}
          >
            {meetsMin ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
            )}
            {meetsMin ? "Looks good" : `Add at least ${MIN_CHARS} characters`}
          </span>
          <span className="text-muted-foreground font-mono">{count} chars</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Side panel ---------------- */

function SidePanel({
  completion,
  sector,
  saveState,
}: {
  completion: number;
  sector: (typeof SECTORS)[number] | null;
  saveState: "idle" | "saving" | "saved";
}) {
  return (
    <div className="sticky top-32 space-y-4">
      {/* Progress */}
      <Panel>
        <PanelHeader icon={<Gauge className="h-4 w-4" />} title="Task Progress" />
        <div className="px-5 pb-5">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {completion}%
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {saveState === "saving" ? "Saving…" : "Auto-saved"}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${completion}%`,
                background:
                  "linear-gradient(90deg, oklch(0.78 0.09 80), oklch(0.72 0.14 155))",
              }}
            />
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <span className="text-foreground/90 font-medium">Selected sector: </span>
            {sector ? (
              <span className="text-primary">{sector.name}</span>
            ) : (
              <span>None yet</span>
            )}
          </div>
        </div>
      </Panel>

      {/* Mentor tips */}
      <Panel>
        <PanelHeader
          icon={<Lightbulb className="h-4 w-4" />}
          title="Tips from mentors"
        />
        <ul className="px-5 pb-5 space-y-3 text-[13px] text-foreground/85 leading-relaxed">
          {[
            "Anchor each claim with a number, name, or recent deal.",
            "Prioritise sub-themes; resist the urge to cover everything.",
            "Tie risks to mitigations — show you’ve thought it through.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary mt-1 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* What good submissions include */}
      <Panel>
        <PanelHeader
          icon={<CheckCircle2 className="h-4 w-4" />}
          title="What good submissions include"
        />
        <ul className="px-5 pb-5 space-y-2.5 text-[13px] text-foreground/85">
          {[
            "A crisp thesis sentence",
            "Named founders, funds, and rounds",
            "Honest risks and mitigations",
            "2–3 prioritised sub-themes",
          ].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "oklch(0.72 0.14 155)" }}
              />
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      {/* AI hints */}
      <button
        type="button"
        className="group w-full rounded-2xl border border-primary/40 bg-primary/5 px-5 py-4 text-left hover:bg-primary/10 transition-all hover:-translate-y-0.5"
        style={{
          boxShadow: "0 10px 28px -14px oklch(0.78 0.09 80 / 0.5)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Wand2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              AI-powered hints
            </div>
            <div className="text-[11px] text-muted-foreground">
              Get nudges tailored to your sector
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-border bg-card/70 overflow-hidden"
      style={{
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        backdropFilter: "blur(18px)",
      }}
    >
      {children}
    </div>
  );
}

function PanelHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 px-5 pt-5 pb-3">
      <span className="text-primary">{icon}</span>
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        {title}
      </span>
    </div>
  );
}

/* ---------------- Bottom action bar ---------------- */

function BottomBar({
  canSubmit,
  submitted,
  saveState,
  onSave,
  onSubmit,
}: {
  canSubmit: boolean;
  submitted: boolean;
  saveState: "idle" | "saving" | "saved";
  onSave: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 border-t border-border"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.14 0 0 / 0.75), oklch(0.13 0 0 / 0.92))",
        backdropFilter: "blur(18px)",
        boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground/60 cursor-not-allowed"
            title="No previous task"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          <span className="hidden md:inline text-[11px] text-muted-foreground">
            {saveState === "saving"
              ? "Saving draft…"
              : saveState === "saved"
                ? "Draft saved"
                : "Drafts save automatically"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={submitted}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              boxShadow: canSubmit
                ? "0 10px 24px -10px oklch(0.78 0.09 80 / 0.55)"
                : undefined,
            }}
          >
            <Send className="h-3.5 w-3.5" />
            {submitted ? "Submitted" : "Submit Task"}
          </button>
          <button
            type="button"
            disabled={!submitted}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs transition",
              submitted
                ? "border border-primary/50 bg-primary/10 text-primary hover:bg-primary/15"
                : "border border-border bg-card text-muted-foreground/60 cursor-not-allowed",
            )}
            title={submitted ? "Continue to Task 2" : "Locked until submission"}
          >
            {submitted ? null : <Lock className="h-3 w-3" />}
            Next Task
            {submitted && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Success overlay ---------------- */

function SuccessOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "oklch(0.13 0 0 / 0.7)",
        backdropFilter: "blur(8px)",
        animation: "fadeSlide 240ms ease-out",
      }}
    >
      <div
        className="rounded-3xl border border-border bg-card px-10 py-9 text-center max-w-sm"
        style={{
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px oklch(0.72 0.14 155 / 0.25)",
          animation: "fadeSlide 320ms ease-out",
        }}
      >
        <div
          className="mx-auto h-16 w-16 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.72 0.14 155 / 0.15)",
            boxShadow: "0 0 0 6px oklch(0.72 0.14 155 / 0.08)",
            animation: "softPulse 1.6s ease-in-out infinite",
          }}
        >
          <CheckCircle2
            className="h-8 w-8"
            style={{ color: "oklch(0.78 0.14 155)" }}
          />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-foreground">
          Thesis submitted
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Animesh will review your work. Task 2 is now unlocked.
        </p>
      </div>
    </div>
  );
}