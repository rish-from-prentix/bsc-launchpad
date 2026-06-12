import { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskHeader({
  week,
  taskNumber,
  duration,
  title,
  deliverable,
  rightBadge,
}: {
  week: number;
  taskNumber: number;
  duration: string;
  title: string;
  deliverable: string;
  rightBadge?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
      <div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Week {week} · Task {taskNumber} · {duration}
        </div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          <span className="text-foreground/80 font-medium">Deliverable:</span> {deliverable}
        </p>
      </div>
      {rightBadge ?? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Active
        </span>
      )}
    </div>
  );
}

export function MentorPrinciple({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Core Principle
      </div>
      <p className="mt-1 text-[13.5px] text-foreground/85 leading-relaxed">{children}</p>
    </div>
  );
}

export function VoiceNote({
  initials,
  name,
  role,
  timestamp,
  children,
  tone = "default",
}: {
  initials: string;
  name: string;
  role: string;
  timestamp: string;
  children: ReactNode;
  tone?: "default" | "urgent";
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border bg-card p-4",
        tone === "urgent" ? "border-destructive/50" : "border-border",
      )}
    >
      <div
        className={cn(
          "h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold border",
          tone === "urgent"
            ? "bg-destructive/15 text-destructive border-destructive/40"
            : "bg-primary/10 text-primary border-primary/40",
        )}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-muted-foreground">{role}</span>
          <span className="text-muted-foreground/70 font-mono text-[10px]">{timestamp}</span>
        </div>
        <div className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

export function DataCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/60 p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-2">
        {label}
      </div>
      <div className="text-[13px] leading-relaxed text-foreground/85 space-y-1">{children}</div>
    </div>
  );
}

export function SectionHeader({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/90">
        {children}
      </h3>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function HelperText({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-[11px] text-muted-foreground/80">{children}</p>;
}

export function SubmitBar({
  label = "Submit & Continue",
  onSubmit,
  disabled = false,
  loading = false,
  hint,
}: {
  label?: string;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Evaluating..." : label}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function FeedbackPanel({
  passed,
  score,
  feedback,
  onRetry,
  onContinue,
}: {
  passed: boolean;
  score: number;
  feedback: string;
  onRetry: () => void;
  onContinue: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        passed
          ? "border-[oklch(0.72_0.14_155_/_0.4)] bg-[oklch(0.72_0.14_155_/_0.07)]"
          : "border-destructive/40 bg-destructive/5",
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        {passed ? (
          <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.14_155)]" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-destructive" />
        )}
        <span className={passed ? "text-[oklch(0.72_0.14_155)]" : "text-destructive"}>
          {passed ? "Approved" : "Needs another pass"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          Score {score}/10
        </span>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/90 whitespace-pre-line">
        {feedback}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {passed ? (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export function TaskFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 space-y-6">{children}</div>
  );
}