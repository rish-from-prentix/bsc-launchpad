import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  ShieldCheck,
  Paperclip,
  Reply,
  Star,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Brain,
  Leaf,
  HeartPulse,
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

export function AicIsbTaskOne({ candidateName }: { candidateName: string }) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading");
  const [emailOpen, setEmailOpen] = useState(true);
  const [revealAssignment, setRevealAssignment] = useState(false);
  const [sector, setSector] = useState<Sector | null>(null);
  const [opportunities, setOpportunities] = useState("");
  const [challenges, setChallenges] = useState("");
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("ready"), 1400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    const t = window.setTimeout(() => setRevealAssignment(true), 1200);
    return () => window.clearTimeout(t);
  }, [phase]);

  const greetingName = candidateName || "there";

  const todayLabel = useMemo(() => {
    return "Today · 9:30 AM";
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 sm:py-14">
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
            Startup accelerators and venture capital firms play a key role in helping
            early-stage startups grow into scalable businesses. From AI and SaaS to
            ClimateTech and HealthTech, accelerators support founders through
            mentorship, market access, strategic guidance, and investor readiness.
          </p>
          <p>
            However, identifying and supporting high-potential startups is a complex
            process that requires strong research, operational execution, and
            ecosystem management.
          </p>
          <p>
            In this simulation, you will step into the role of a{" "}
            <span className="text-primary font-medium">Program Manager Intern</span>{" "}
            / Venture Capital Intern working in the accelerator ecosystem of{" "}
            <span className="text-foreground font-medium">
              Indian School of Business × Atal Incubation Centre
            </span>
            .
          </p>
          <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
            {[
              "Research emerging sectors",
              "Evaluate startups",
              "Coordinate mentors",
              "Manage accelerator operations",
              "Prepare founders for Demo Day",
              "Drive investor interactions",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-2 text-sm text-foreground/85"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
          <p className="pt-2 text-sm text-muted-foreground">
            Your work throughout the simulation will directly impact startup growth,
            mentor engagement, funding readiness, and the success of the accelerator
            cohort.
          </p>
        </div>
      </section>

      {/* Loading / Email */}
      {phase === "loading" ? (
        <ReceivingState />
      ) : (
        <section style={{ animation: "fadeSlide 320ms ease-out" }}>
          {/* Unread indicator */}
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

      {/* Assignment section */}
      {revealAssignment && (
        <section
          className="mt-12"
          style={{ animation: "fadeSlide 500ms ease-out" }}
        >
          <Divider label="Begin Assignment" />

          <div className="mt-8">
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
                    onClick={() => setSector(s.id)}
                    className={cn(
                      "text-left rounded-xl border p-5 transition-all hover:-translate-y-0.5",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                    style={{
                      boxShadow: selected
                        ? "0 10px 28px -12px oklch(0.78 0.09 80 / 0.45)"
                        : "0 4px 16px rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center mb-3",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary",
                      )}
                    >
                      {s.icon}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
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

          <div className="mt-10">
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
              Step 2
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-semibold text-foreground">
              Build your thesis
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Support your reasoning with specific trends, players, and signals.
            </p>

            <div className="mt-5 space-y-5">
              <Field
                label="Market opportunities & emerging trends"
                value={opportunities}
                onChange={setOpportunities}
                placeholder="Where is the next wave of high-potential startups likely to emerge?"
              />
              <Field
                label="Key operational challenges"
                value={challenges}
                onChange={setChallenges}
                placeholder="What execution, regulatory or GTM challenges should founders prepare for?"
              />
              <Field
                label="Your accelerator recommendation"
                value={recommendation}
                onChange={setRecommendation}
                placeholder="Which sub-themes should AIC × ISB prioritise in the next cohort, and why?"
                rows={5}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={
                  !sector ||
                  !opportunities.trim() ||
                  !challenges.trim() ||
                  !recommendation.trim()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  boxShadow:
                    "0 10px 30px -10px oklch(0.78 0.09 80 / 0.5)",
                }}
              >
                Submit Thesis
                <ArrowRight className="h-4 w-4" />
              </button>
              <span className="text-xs text-muted-foreground">
                You can revisit and refine your answers before submitting.
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

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
      {/* Header */}
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
            <span
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-primary border border-primary/40 bg-primary/5 rounded-full px-1.5 py-0.5"
              title="Verified sender"
            >
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
          <IconBtn label="Star">
            <Star className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Reply">
            <Reply className="h-4 w-4" />
          </IconBtn>
          <button
            onClick={onToggle}
            aria-label={open ? "Collapse email" : "Expand email"}
            className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                !open && "-rotate-90",
              )}
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
          <p className="mt-3">
            Welcome to the AIC × ISB accelerator ecosystem.
          </p>
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
          <p className="mt-4">Your objective is to assess:</p>
          <ul className="mt-2 space-y-1.5 pl-1">
            {[
              "Market opportunities",
              "Emerging startup trends",
              "Investor activity",
              "Key operational challenges",
              "Long-term scalability potential",
            ].map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Please structure your submission carefully and support your
            recommendations with strong strategic reasoning. Your analysis will help
            shape the direction of our next accelerator cohort.
          </p>
          <p className="mt-4">Looking forward to reviewing your work.</p>
          <p className="mt-6 text-foreground font-medium">Best,</p>
          <p className="text-foreground/90">Animesh</p>
          <p className="text-xs text-muted-foreground">CEO — AIC × ISB</p>

          {/* Attachment */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground/90">
            <Paperclip className="h-3.5 w-3.5 text-primary" />
            Accelerator Thesis Guidelines.pdf
            <span className="text-muted-foreground">· 248 KB</span>
          </div>

          {/* Footer actions */}
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 transition resize-y"
      />
    </label>
  );
}