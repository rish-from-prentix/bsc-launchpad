import { ReactNode, useEffect, useId, useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessageCenter, extractText } from "./message-center";

// Architecture internship surface tokens, tuned to mirror the HTML reference
// (Meridian Studio intern portal) but with AIC cyan as the accent.
const SURFACE = "bg-[#0f1a3e]";
const BORDER = "border-[#1d2a5a]";
const BORDER_LIGHT = "border-[#2a3a72]";
const MUTED = "text-[#94a3c4]";
const DIM = "text-[#3a4670]";
const TEXT = "text-[#e6ecff]";
// Match AIC internship typography (Inter throughout, no serif/mono accents).
const MONO = "";
const SERIF = "";

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
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b pb-[18px] mb-1", BORDER)}>
      <div>
        <div
          className={cn(
            "inline-flex items-center text-[10px] text-primary bg-primary/10 px-[9px] py-[3px] rounded-[2px] border border-primary/40 mb-[7px]",
            MONO,
          )}
        >
          Week {week} · Task {taskNumber} · Day {taskNumber}
        </div>
        <h2 className={cn("text-[22px] font-bold leading-[1.2]", SERIF, TEXT)}>
          {title}
        </h2>
        <p className={cn("mt-[5px] text-[12px] leading-[1.5]", MUTED)}>
          <span className={cn(TEXT, "font-medium")}>Deliverable:</span> {deliverable}
        </p>
      </div>
      {rightBadge ?? (
        <span
          className={cn(
            "inline-flex items-center gap-[6px] px-[13px] py-[5px] rounded-full text-[11px] whitespace-nowrap shrink-0",
            MONO,
            "border",
            BORDER_LIGHT,
            MUTED,
          )}
        >
          <span className="h-[6px] w-[6px] rounded-full bg-[#52c47a] animate-pulse" />
          Active
        </span>
      )}
    </div>
  );
}

export function MentorPrinciple({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-[#1a3a1a] bg-[#0d1a0d] px-[13px] py-[11px] text-[12px] leading-[1.6] text-[#7ab87a]">
      <div className={cn("text-[9px] uppercase tracking-[0.12em] mb-[6px] opacity-70", MONO)}>
        Core Principle
      </div>
      {children}
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
  audioUrl,
  preview,
}: {
  initials: string;
  name: string;
  role: string;
  timestamp: string;
  children: ReactNode;
  tone?: "default" | "urgent";
  audioUrl?: string;
  preview?: string;
}) {
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const { register } = useMessageCenter();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fire = () => {
      const raw = preview ?? extractText(children);
      const trimmed = raw.trim().replace(/\s+/g, " ");
      register({
        id,
        initials,
        name,
        role,
        timestamp,
        tone,
        audioUrl,
        body: children,
        preview: trimmed.length > 80 ? trimmed.slice(0, 80).trimEnd() + "..." : trimmed,
      });
    };
    if (typeof IntersectionObserver === "undefined") {
      fire();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fire();
          io.disconnect();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return <span ref={ref} aria-hidden="true" className="block w-px h-px -m-px" />;
}

export function DataCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cn("relative rounded-md border px-[15px] py-[13px] mb-[6px]", SURFACE, BORDER_LIGHT)}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-md"
        style={{ background: "linear-gradient(90deg, var(--primary), transparent)" }}
      />
      <div className={cn("text-[9px] uppercase tracking-[0.1em] mb-[7px] text-primary", MONO)}>
        {label}
      </div>
      <div className={cn("text-[12px] leading-[1.7] space-y-1", MUTED, "[&_strong]:text-[#e6ecff] [&_b]:text-[#e6ecff]")}>
        {children}
      </div>
    </div>
  );
}

export function SectionHeader({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mt-[14px] mb-[5px]">
      <div className={cn("flex items-center gap-[7px] text-[10px] uppercase tracking-[0.1em]", MONO, DIM)}>
        <span>{children}</span>
        <span className={cn("flex-1 h-px", "bg-[#1d2a5a]")} />
      </div>
      {hint && <p className={cn("mt-[6px] text-[11px]", MUTED)}>{hint}</p>}
    </div>
  );
}

export function HelperText({ children }: { children: ReactNode }) {
  return <p className={cn("mt-1 text-[10px]", MONO, DIM)}>{children}</p>;
}

export function SubmitBar({
  label = "Next Task",
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
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t pt-[14px] mt-[16px]", BORDER)}>
      {hint ? (
        <p className={cn("text-[11px]", MUTED)}>{hint}</p>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-[5px] rounded-[4px] bg-primary px-[18px] py-[8px] text-[12px] font-semibold text-[#000] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed border border-primary shadow-[0_0_18px_rgba(93,196,254,0.25)]",
          MONO,
        )}
      >
        {loading ? "Evaluating..." : label}
        {!loading && <ArrowRight className="h-[14px] w-[14px]" />}
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
        "rounded-md border px-[14px] py-[13px] mt-3",
        passed
          ? "border-[#1a3a1a] bg-[#0d1a0d]"
          : "border-[#5a1a1a] bg-[#1a0808]",
      )}
    >
      <div className={cn("flex items-center gap-2 text-[11px]", MONO)}>
        {passed ? (
          <CheckCircle2 className="h-[14px] w-[14px] text-[#52c47a]" />
        ) : (
          <span className="h-2 w-2 rounded-full bg-[#e05252]" />
        )}
        <span className={passed ? "text-[#52c47a]" : "text-[#e05252]"}>
          {passed ? "APPROVED" : "NEEDS ANOTHER PASS"}
        </span>
        <span className={cn("ml-auto text-[10px]", DIM)}>
          Score {score}/10
        </span>
      </div>
      <p className={cn("mt-[10px] text-[12px] leading-[1.7] whitespace-pre-line", MUTED, "[&_strong]:text-[#e6ecff]")}>
        {feedback}
      </p>
      <div className="mt-[13px] flex flex-wrap gap-[7px]">
        {passed ? (
          <button
            type="button"
            onClick={onContinue}
            className={cn(
              "inline-flex items-center gap-[5px] rounded-[4px] bg-primary px-[15px] py-[7px] text-[11.5px] font-medium text-[#000] border border-primary hover:brightness-110",
              MONO,
            )}
          >
            Continue <ArrowRight className="h-[14px] w-[14px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "inline-flex items-center gap-2 rounded-[4px] border px-[15px] py-[7px] text-[11.5px] font-medium hover:border-primary/40 hover:text-primary",
              MONO,
              BORDER_LIGHT,
              MUTED,
            )}
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
    <div className="mx-auto max-w-[860px] px-6 sm:px-8 py-6 space-y-[13px] bg-[#070a1c] min-h-[calc(100vh-130px)]">
      {children}
    </div>
  );
}