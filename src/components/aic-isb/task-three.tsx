import { useEffect, useMemo, useRef, useState } from "react";
import { InboxEmail } from "./inbox-email";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Loader2,
  Users,
  Shield,
  ChevronDown,
  ChevronUp,
  Star,
  Quote,
  Save,
  Lightbulb,
  Compass,
} from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import { THEMES, type ThemeId, type Startup } from "./startups-data";
import { mentorsForSector, mentorFit, getMentor, type Mentor } from "./mentors-data";

type Phase = "email" | "dashboard" | "loading" | "result";

type Assignment = {
  primaryId: string | null;
  secondaryId: string | null;
  reason: string;
};

export function AicIsbTaskThree({
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
  const selectedStartups = useMemo(
    () => bundle.startups.filter((s) => shortlistedIds.includes(s.id)),
    [bundle, shortlistedIds],
  );
  const mentors = mentorsForSector(sector);
  const storageKey = `aic-isb:task3:${sector}:${shortlistedIds.join(",")}`;

  const [phase, setPhase] = useState<Phase>("email");
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(() => {
    const empty = Object.fromEntries(
      selectedStartups.map((s) => [s.id, { primaryId: null, secondaryId: null, reason: "" }]),
    ) as Record<string, Assignment>;
    if (typeof window === "undefined") return empty;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return empty;
      const parsed = JSON.parse(raw) as Record<string, Assignment>;
      return { ...empty, ...parsed };
    } catch {
      return empty;
    }
  });
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");
  const savedTimer = useRef<number | null>(null);

  const allComplete = selectedStartups.every((s) => {
    const a = assignments[s.id];
    return a.primaryId && a.secondaryId && a.primaryId !== a.secondaryId;
  });

  function update(id: string, patch: Partial<Assignment>) {
    setAssignments((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  }

  function handleSaveDraft() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(assignments));
      setSaveState("saved");
      if (savedTimer.current) window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setSaveState("idle"), 2200);
    } catch {
      /* noop */
    }
  }

  useEffect(() => () => { if (savedTimer.current) window.clearTimeout(savedTimer.current); }, []);

  function submit() {
    if (!allComplete) return;
    setPhase("loading");
    window.setTimeout(() => setPhase("result"), 1700);
  }

  if (phase === "email") {
    return <EmailPhase name={getFirstName(candidateName)} onStart={() => setPhase("dashboard")} />;
  }
  if (phase === "loading") return <Loading text="Accelerator board reviewing mentor assignments…" />;
  if (phase === "result") {
    return (
      <ResultPhase
        sector={sector}
        selectedStartups={selectedStartups}
        assignments={assignments}
        onContinue={() => onComplete?.()}
      />
    );
  }

  return (
    <Dashboard
      mentors={mentors}
      selectedStartups={selectedStartups}
      assignments={assignments}
      allComplete={allComplete}
      onUpdate={update}
      onSubmit={submit}
      saveState={saveState}
      onSaveDraft={handleSaveDraft}
    />
  );
}

/* ---------------- Email ---------------- */
function EmailPhase({ name, onStart }: { name: string; onStart: () => void }) {
  return (
    <InboxEmail
      badge="Phase 3 · Mentor Mapping & Accelerator Planning"
      senderName="Animesh Sharma"
      senderRole="Program Director, AIC × ISB"
      senderInitials="AS"
      subject="Mentor Assignment for Accelerator Cohort"
      preview={`Hi ${name}, your selected startups are now entering the accelerator phase, time to assign the right mentors…`}
      timestamp="Today · 09:30 AM"
      ctaLabel="Start Mentor Mapping"
      onCta={onStart}
    >
      <div className="whitespace-pre-wrap">{`Hi ${name},

Great work on completing the startup evaluation process.

Your selected startups are now entering the accelerator phase, where founder support and strategic guidance become critical.

Your next phase is to assign mentors to the startups based on their operational gaps, growth stage, and scaling challenges.

You'll be evaluated on:
• Mentor-founder fit
• Strategic thinking
• Understanding startup bottlenecks
• Accelerator operations judgment

Best,
Animesh Sharma`}</div>
    </InboxEmail>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({
  mentors,
  selectedStartups,
  assignments,
  allComplete,
  onUpdate,
  onSubmit,
  saveState,
  onSaveDraft,
}: {
  mentors: Mentor[];
  selectedStartups: Startup[];
  assignments: Record<string, Assignment>;
  allComplete: boolean;
  onUpdate: (id: string, patch: Partial<Assignment>) => void;
  onSubmit: () => void;
  saveState: "idle" | "saved";
  onSaveDraft: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-14 pb-40">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Phase 3 · Accelerator Operations</div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">Accelerator Mentor Assignment</h1>
      <p className="mt-3 text-[15px] text-muted-foreground">Assign the most suitable mentors to support each startup's growth.</p>

      <div className="mt-6 glass rounded-xl p-4 sm:p-5 text-sm text-foreground/85 flex gap-3">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p>
          Match mentors based on the startup's <span className="text-primary">operational gaps, growth stage, and scaling
          bottlenecks</span>, not just industry overlap. Strong assignments solve the right bottleneck at the right time.
        </p>
      </div>

      {/* The core insight — sticky-note style */}
      <div
        className="mt-4 rounded-xl p-5 sm:p-6 border border-[oklch(0.78_0.14_85)]/40 bg-[oklch(0.78_0.14_85)]/[0.07] shadow-[0_8px_30px_rgba(255,200,80,0.08)] relative"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-[oklch(0.82_0.15_85)] shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.15_85)] font-semibold mb-1.5">
              The principle to carry through this task
            </div>
            <p className="text-[14.5px] leading-relaxed text-foreground/90">
              A mentor who scaled a 5,000-person organisation has learnt very different lessons from a founder who built something from nothing. The most valuable mentors for early-stage startups are people who have personally lived the zero-to-one experience — the ambiguity, the resource constraints, the pivots. Impressive titles don't always translate to useful advice at this stage.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {selectedStartups.map((s, i) => (
          <StartupAssignmentBlock
            key={s.id}
            index={i + 1}
            startup={s}
            mentors={mentors}
            assignment={assignments[s.id]}
            onUpdate={(patch) => onUpdate(s.id, patch)}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            <span className={cn(allComplete && "text-primary")}>
              {selectedStartups.filter((s) => {
                const a = assignments[s.id];
                return a.primaryId && a.secondaryId && a.primaryId !== a.secondaryId;
              }).length}/{selectedStartups.length} startups assigned
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
              disabled={!allComplete}
              className={cn(
                "btn-primary-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold",
                !allComplete && "opacity-40 pointer-events-none",
              )}
            >
              Submit Mentor Map <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartupAssignmentBlock({
  index,
  startup,
  mentors,
  assignment,
  onUpdate,
}: {
  index: number;
  startup: Startup;
  mentors: Mentor[];
  assignment: Assignment;
  onUpdate: (patch: Partial<Assignment>) => void;
}) {
  return (
    <section>
      {/* Startup overview */}
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Cohort startup {index}
            </div>
            <h2 className="mt-1 text-2xl font-semibold text-foreground tracking-tight">{startup.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{startup.tagline}</p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-primary border border-primary/30 bg-primary/5 rounded-full px-2.5 py-1">
            {startup.stage}
          </span>
        </div>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <Block title="Bottlenecks & growth risks">
            <ul className="space-y-1.5 text-sm text-foreground/85">
              {startup.risks.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.16_25)] shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Founder strengths to leverage">
            <ul className="space-y-1.5 text-sm text-foreground/85">
              {startup.strengths.slice(0, 3).map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.14_155)] shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </Block>
        </div>
        {startup.accelGoal && (
          <div className="mt-4 text-sm text-foreground/80">
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mr-2">Accelerator goal</span>
            {startup.accelGoal}
          </div>
        )}
      </div>

      {/* Mentor pool */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        {mentors.map((m) => {
          const isPrimary = assignment.primaryId === m.id;
          const isSecondary = assignment.secondaryId === m.id;
          return (
            <MentorCard
              key={m.id}
              mentor={m}
              isPrimary={isPrimary}
              isSecondary={isSecondary}
              onAssignPrimary={() =>
                onUpdate({
                  primaryId: isPrimary ? null : m.id,
                  secondaryId: assignment.secondaryId === m.id ? null : assignment.secondaryId,
                })
              }
              onAssignSecondary={() =>
                onUpdate({
                  secondaryId: isSecondary ? null : m.id,
                  primaryId: assignment.primaryId === m.id ? null : assignment.primaryId,
                })
              }
            />
          );
        })}
      </div>

      {/* Reason */}
      <div className="mt-5 glass rounded-xl p-5">
        <label className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold flex items-center gap-2">
          Why this mentor pairing for {startup.name}?
          <span className="text-[10px] normal-case tracking-normal text-muted-foreground font-normal">(optional)</span>
        </label>
        <textarea
          value={assignment.reason}
          onChange={(e) => onUpdate({ reason: e.target.value })}
          placeholder="Explain how each mentor's expertise addresses this startup's specific bottlenecks and growth stage."
          rows={3}
          className="mt-2 w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/60 resize-y"
        />
      </div>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background/30 p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-2">{title}</div>
      {children}
    </div>
  );
}

/* ---------------- Mentor Card ---------------- */
function MentorCard({
  mentor,
  isPrimary,
  isSecondary,
  onAssignPrimary,
  onAssignSecondary,
}: {
  mentor: Mentor;
  isPrimary: boolean;
  isSecondary: boolean;
  onAssignPrimary: () => void;
  onAssignSecondary: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = isPrimary || isSecondary;
  return (
    <article
      className={cn(
        "glass rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(93,196,254,0.18)]",
        active && "ring-1 ring-primary/60",
      )}
      style={active ? { boxShadow: "0 0 0 1px rgba(93,196,254,0.4), 0 14px 40px rgba(93,196,254,0.22)" } : undefined}
    >
      <header className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/15 text-primary border border-primary/40 flex items-center justify-center text-sm font-semibold shrink-0">
          {mentor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-semibold text-foreground">{mentor.name}</div>
          <div className="text-xs text-muted-foreground">{mentor.role}</div>
          <div className="mt-1 text-[10px] text-primary">
            <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5">
              {mentor.years} yrs experience
            </span>
          </div>
        </div>
      </header>

      {/* Their journey — distinct background strip */}
      <div className="mt-4 rounded-xl border border-border/70 bg-foreground/[0.04] p-3.5">
        <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-1.5 flex items-center gap-1.5">
          <Compass className="h-3 w-3" /> Their journey
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/85">{mentor.journey}</p>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-[11px] text-primary inline-flex items-center gap-1 hover:underline"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {open ? "Hide full profile" : "View full profile"}
      </button>

      {open && (
        <div className="mt-3 space-y-3 text-sm">
          {/* Two-column value vs struggle */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-[oklch(0.72_0.14_155)]/35 bg-[oklch(0.72_0.14_155)]/[0.06] p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.78_0.14_155)] font-semibold mb-1.5">
                Where they add most value
              </div>
              <ul className="space-y-1.5 text-[12.5px] text-foreground/85">
                {mentor.addsValue.map((v) => (
                  <li key={v} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[oklch(0.78_0.14_155)] shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-[oklch(0.72_0.16_25)]/35 bg-[oklch(0.72_0.16_25)]/[0.05] p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.78_0.16_25)] font-semibold mb-1.5">
                Where they may struggle
              </div>
              <ul className="space-y-1.5 text-[12.5px] text-foreground/85">
                {mentor.mayStruggle.map((v) => (
                  <li key={v} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-[oklch(0.78_0.16_25)] shrink-0" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Honest caveat — amber */}
          <div className="rounded-lg border border-[oklch(0.78_0.14_85)]/45 bg-[oklch(0.78_0.14_85)]/[0.07] p-3 flex gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-[oklch(0.82_0.15_85)] mt-0.5 shrink-0" />
            <p className="text-[12.5px] leading-relaxed text-[oklch(0.88_0.08_85)]">{mentor.honestCaveat}</p>
          </div>

          {/* Fit tags */}
          <div className="space-y-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                Strong fit when a startup needs
              </div>
              <div className="flex flex-wrap gap-1.5">
                {mentor.strongFitTags.map((t) => (
                  <span key={t} className="rounded-full border border-[oklch(0.72_0.14_155)]/40 bg-[oklch(0.72_0.14_155)]/10 px-2 py-0.5 text-[11px] text-[oklch(0.82_0.14_155)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                Less useful when a startup needs
              </div>
              <div className="flex flex-wrap gap-1.5">
                {mentor.lessUsefulTags.map((t) => (
                  <span key={t} className="rounded-full border border-[oklch(0.72_0.16_25)]/35 bg-[oklch(0.72_0.16_25)]/[0.08] px-2 py-0.5 text-[11px] text-[oklch(0.82_0.16_25)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Founder quote + context */}
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-primary mb-1 flex items-center gap-1.5">
              <Quote className="h-3 w-3" /> Founder feedback
            </div>
            <p className="text-sm italic text-foreground/85">"{mentor.founderQuote}"</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">{mentor.quoteContext}</p>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={onAssignPrimary}
          className={cn(
            "rounded-lg px-3 py-2 text-xs font-semibold transition",
            isPrimary
              ? "btn-primary-glow"
              : "border border-primary/40 text-primary hover:bg-primary/10",
          )}
        >
          {isPrimary ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Primary
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" /> Assign Primary
            </span>
          )}
        </button>
        <button
          onClick={onAssignSecondary}
          className={cn(
            "rounded-lg px-3 py-2 text-xs font-semibold transition border",
            isSecondary
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border text-foreground/80 hover:border-primary/30 hover:text-primary",
          )}
        >
          {isSecondary ? (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Secondary
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Assign Secondary
            </span>
          )}
        </button>
      </div>
    </article>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">{label}</div>
      {children}
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
          style={{
            background: "radial-gradient(circle, rgba(93,196,254,0.45), transparent 70%)",
            animation: "blobFloat 2.4s ease-in-out infinite",
          }}
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
  sector,
  selectedStartups,
  assignments,
  onContinue,
}: {
  sector: ThemeId;
  selectedStartups: Startup[];
  assignments: Record<string, Assignment>;
  onContinue: () => void;
}) {
  const evaluations = selectedStartups.map((s) => {
    const a = assignments[s.id];
    const primary = (a.primaryId ? getMentor(sector, a.primaryId) : null) ?? null;
    const secondary = (a.secondaryId ? getMentor(sector, a.secondaryId) : null) ?? null;
    const pFit = primary ? mentorFit(primary, s.id) : "weak";
    const sFit = secondary ? mentorFit(secondary, s.id) : "weak";
    const score = (pFit === "strong" ? 60 : 20) + (sFit === "strong" ? 40 : 10);
    return { startup: s, primary, secondary, pFit, sFit, score };
  });
  const accuracy = Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length);
  const strategicScore = Math.min(
    100,
    Math.round(
      evaluations.reduce(
        (sum, e) => sum + (e.pFit === "strong" ? 50 : 25) + (e.sFit === "strong" ? 35 : 15),
        0,
      ) / evaluations.length,
    ),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Shield className="h-3.5 w-3.5" /> Accelerator Board Verdict
      </div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
        {accuracy >= 70 ? "Mentor Map Approved" : "Mentor Map Noted"}
      </h1>
      <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
        {accuracy >= 70
          ? "The accelerator board found strong alignment between your mentor selections and each startup's operational reality. Founders will benefit from focused, expertise-matched guidance."
          : "The accelerator board reviewed your mentor assignments. Some pairings were strong, but others may not directly address the startup's primary operational challenge."}
      </p>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <Stat label="Mentor matching accuracy" value={`${accuracy}%`} />
        <Stat label="Strategic thinking" value={`${strategicScore}/100`} />
        <Stat label="Accelerator ops badge" value={accuracy >= 80 ? "Gold" : accuracy >= 60 ? "Silver" : "Bronze"} />
      </div>

      <h2 className="mt-10 text-sm uppercase tracking-[0.22em] text-primary font-semibold">
        Here's how the AIC × ISB board reviewed your mentor assignments
      </h2>
      <div className="mt-4 space-y-4">
        {evaluations.map((e) => {
          const bothStrong = e.pFit === "strong" && e.sFit === "strong";
          return (
            <div key={e.startup.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-foreground">{e.startup.name}</div>
                  <div className="text-xs text-muted-foreground">{e.startup.tagline}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Fit score</div>
                  <div className="text-base font-mono text-foreground">{e.score}/100</div>
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <FitRow label="Primary" mentor={e.primary} fit={e.pFit} />
                <FitRow label="Secondary" mentor={e.secondary} fit={e.sFit} />
              </div>

              {/* Fit assessment per mentor */}
              <div className="mt-4 space-y-3">
                {e.primary && (
                  <MentorAssessment role="Primary" mentor={e.primary} fit={e.pFit} startupName={e.startup.name} />
                )}
                {e.secondary && (
                  <MentorAssessment role="Secondary" mentor={e.secondary} fit={e.sFit} startupName={e.startup.name} />
                )}
              </div>

              {/* What you got right */}
              <div className="mt-4 rounded-lg p-3 border border-[oklch(0.72_0.14_155)]/35 bg-[oklch(0.72_0.14_155)]/[0.06]">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.78_0.14_155)] font-semibold mb-1.5">
                  What you got right
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/90">
                  {gotRightCopy(e, bothStrong)}
                </p>
              </div>

              {/* What to watch out for */}
              <div className="mt-3 rounded-lg p-3 border border-[oklch(0.78_0.14_85)]/40 bg-[oklch(0.78_0.14_85)]/[0.06]">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.15_85)] font-semibold mb-1.5">
                  What to watch out for
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/90">
                  {watchOutCopy(e)}
                </p>
              </div>

              {/* The gap in this pairing */}
              <div className="mt-3 rounded-lg p-3 border border-border bg-background/40">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1.5">
                  The gap in this pairing
                </div>
                <p className="text-[13px] leading-relaxed text-foreground/85">
                  {gapCopy(e)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* The lesson from this task */}
      <div className="mt-8 rounded-xl p-5 sm:p-6 border border-primary/40 bg-primary/[0.06] shadow-[0_8px_30px_rgba(93,196,254,0.12)]">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-1.5">
              The lesson from this task
            </div>
            <p className="text-[14.5px] leading-relaxed text-foreground/90">
              The best mentor for a startup is rarely the most impressive person in the room. It's the person whose specific lived experience maps most closely to where the founder is right now — not where the startup will be in five years. A mentor who has scaled a 10,000-person organisation has learnt very different lessons from someone who once sat in a garage not knowing if anyone would buy their product. Both are valuable — at different stages.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button onClick={onContinue} className="btn-primary-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
          Continue Internship <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Debrief helpers ---------------- */
type Evaluation = {
  startup: Startup;
  primary: Mentor | null;
  secondary: Mentor | null;
  pFit: "strong" | "weak";
  sFit: "strong" | "weak";
  score: number;
};

function MentorAssessment({
  role,
  mentor,
  fit,
  startupName,
}: {
  role: string;
  mentor: Mentor;
  fit: "strong" | "weak";
  startupName: string;
}) {
  const strong = fit === "strong";
  return (
    <div
      className={cn(
        "rounded-lg p-3 border",
        strong
          ? "border-[oklch(0.72_0.14_155)]/35 bg-[oklch(0.72_0.14_155)]/[0.05]"
          : "border-[oklch(0.72_0.16_25)]/35 bg-[oklch(0.72_0.16_25)]/[0.05]",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={cn(
            "text-[10px] uppercase tracking-[0.18em] font-semibold",
            strong ? "text-[oklch(0.78_0.14_155)]" : "text-[oklch(0.78_0.16_25)]",
          )}
        >
          {role} — {mentor.name}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-foreground/90">
        {strong ? (
          <>
            {mentor.name.split(" ").slice(-1)[0]} brings exactly what {startupName} needs right now —{" "}
            {mentor.strongFitTags.slice(0, 2).join(" and ").toLowerCase()}. The remaining gap:{" "}
            {mentor.lessUsefulTags[0].toLowerCase()} will still need to come from elsewhere.
          </>
        ) : (
          <>
            {mentor.name.split(" ").slice(-1)[0]}'s strengths are real —{" "}
            {mentor.strongFitTags.slice(0, 2).join(" and ").toLowerCase()} — but those aren't the bottlenecks{" "}
            {startupName} is facing right now. {mentor.honestCaveat}
          </>
        )}
      </p>
    </div>
  );
}

function gotRightCopy(e: Evaluation, bothStrong: boolean): string {
  if (bothStrong && e.primary && e.secondary) {
    return `You paired two mentors whose lived experience maps directly to ${e.startup.name}'s current stage. The reasoning held — you matched expertise to bottleneck, not just to sector.`;
  }
  if (e.pFit === "strong" && e.primary) {
    return `Your primary pick was sound. ${e.primary.name.split(" ").slice(-1)[0]}'s background in ${e.primary.strongFitTags[0].toLowerCase()} directly addresses one of ${e.startup.name}'s most pressing constraints.`;
  }
  if (e.sFit === "strong" && e.secondary) {
    return `The secondary pick was the stronger of the two — ${e.secondary.name.split(" ").slice(-1)[0]} brings credible support for ${e.secondary.strongFitTags[0].toLowerCase()}, which ${e.startup.name} will need soon.`;
  }
  return `Both picks were thoughtful in intent. You were thinking about ${e.startup.name}'s long-term trajectory — that instinct is valuable, even if the lived experience didn't fully match this stage.`;
}

function watchOutCopy(e: Evaluation): string {
  if (e.primary && e.pFit === "strong") {
    return `${e.primary.name.split(" ").slice(-1)[0]} is the right choice for ${e.primary.strongFitTags[0].toLowerCase()} — but ${e.startup.name} is still working through ${(e.startup.risks[0] || "early-stage uncertainty").toLowerCase()}. Make sure the founder doesn't start optimising the next stage before the current one is resolved.`;
  }
  if (e.primary) {
    return `${e.primary.name.split(" ").slice(-1)[0]}'s instincts are tuned for ${e.primary.strongFitTags[0].toLowerCase()}, which is ahead of where ${e.startup.name} is today. The founder may end up working on the wrong problem in the wrong order.`;
  }
  return `Without a primary mentor assigned, ${e.startup.name} risks pulling guidance from whichever advisor speaks loudest — not whichever advisor's experience matches the current bottleneck.`;
}

function gapCopy(e: Evaluation): string {
  const missingFromPrimary = e.primary?.lessUsefulTags[0]?.toLowerCase() ?? "early-stage operational support";
  const missingFromSecondary = e.secondary?.lessUsefulTags[0]?.toLowerCase() ?? "hands-on execution help";
  return `This pairing under-indexes on ${missingFromPrimary} and ${missingFromSecondary}. Programme directors should keep an eye out for moments when ${e.startup.name} needs a third voice — someone who has personally lived the part of the journey neither mentor has navigated themselves.`;
}

function FitRow({ label, mentor, fit }: { label: string; mentor: Mentor | null; fit: "strong" | "weak" }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="text-sm text-foreground">{mentor?.name ?? "—"}</div>
        <span
          className={cn(
            "text-[10px] rounded-full px-2 py-0.5 border",
            fit === "strong"
              ? "border-[oklch(0.72_0.14_155)]/50 text-[oklch(0.72_0.14_155)] bg-[oklch(0.72_0.14_155)]/10"
              : "border-[oklch(0.72_0.16_25)]/40 text-[oklch(0.72_0.16_25)] bg-[oklch(0.72_0.16_25)]/10",
          )}
        >
          {fit === "strong" ? "Strong fit" : "Weak fit"}
        </span>
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