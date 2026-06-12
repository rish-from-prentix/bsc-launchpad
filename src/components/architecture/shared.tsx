import { ReactNode } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Architecture internship surface tokens — tuned to mirror the HTML reference
// (Meridian Studio intern portal) but with AIC cyan as the accent.
const SURFACE = "bg-[#161616]";
const SURFACE_2 = "bg-[#1e1e1e]";
const BORDER = "border-[#2a2a2a]";
const BORDER_LIGHT = "border-[#333]";
const MUTED = "text-[#7a756c]";
const DIM = "text-[#4a4640]";
const TEXT = "text-[#e8e4dc]";
const MONO = "font-['IBM_Plex_Mono',ui-monospace,monospace]";
const SERIF = "font-['Playfair_Display',serif]";

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
          Week {week} · Task {taskNumber} · {duration}
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

const AVATAR_PALETTE: Record<string, string> = {
  km: "bg-[#1a2a1a] text-[#52c47a] border-[#52c47a]",
  pn: "bg-[#1a1a2a] text-[#5299e0] border-[#5299e0]",
  aj: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
  sm: "bg-[#1a1a2a] text-[#e0b752] border-[#e0b752]",
  da: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
  sr: "bg-[#1a1a2a] text-[#e0b752] border-[#e0b752]",
};

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
  const key = initials.toLowerCase();
  const avatarCls =
    tone === "urgent"
      ? "bg-[#2a1a1a] text-[#e05252] border-[#e05252]"
      : AVATAR_PALETTE[key] || "bg-[#1a2a1a] text-[#52c47a] border-[#52c47a]";
  return (
    <div
      className={cn(
        "relative flex gap-[10px] rounded-[7px] border px-[14px] py-[12px] mb-1 overflow-hidden",
        SURFACE_2,
        tone === "urgent" ? "border-[#5a1a1a]" : BORDER_LIGHT,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            tone === "urgent"
              ? "linear-gradient(90deg, #e05252, transparent)"
              : "linear-gradient(90deg, var(--primary), transparent)",
        }}
      />
      <div
        className={cn(
          "h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold border",
          MONO,
          avatarCls,
        )}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-[7px] gap-y-0.5 mb-[5px]">
          <span className={cn("text-[11px] font-semibold", TEXT)}>{name}</span>
          <span className={cn("text-[10px]", MONO, MUTED)}>{role}</span>
          <span className={cn("text-[10px] ml-auto", MONO, DIM)}>{timestamp}</span>
        </div>
        <div className={cn("flex items-center gap-[2px] h-5 mb-[6px]")}>
          {[6, 14, 10, 18, 8, 20, 12, 16, 9, 14, 19, 11].map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-[2px] bg-primary/50"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <div className={cn("text-[12px] leading-[1.6] italic", MUTED, "[&_strong]:text-[#e8e4dc] [&_strong]:not-italic [&_b]:text-[#e8e4dc] [&_b]:not-italic")}>{children}</div>
      </div>
    </div>
  );
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
      <div className={cn("text-[12px] leading-[1.7] space-y-1", MUTED, "[&_strong]:text-[#e8e4dc] [&_b]:text-[#e8e4dc]")}>
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
        <span className={cn("flex-1 h-px", "bg-[#2a2a2a]")} />
      </div>
      {hint && <p className={cn("mt-[6px] text-[11px]", MUTED)}>{hint}</p>}
    </div>
  );
}

export function HelperText({ children }: { children: ReactNode }) {
  return <p className={cn("mt-1 text-[10px]", MONO, DIM)}>{children}</p>;
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
    <div className={cn("flex flex-wrap items-center justify-between gap-3 border-t pt-[14px] mt-[16px]", BORDER)}>
      {hint ? (
        <p className={cn("text-[11px]", MUTED)}>{hint}</p>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center gap-[5px] rounded-[4px] bg-primary px-[15px] py-[7px] text-[11.5px] font-medium text-[#000] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed border border-primary",
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
      <p className={cn("mt-[10px] text-[12px] leading-[1.7] whitespace-pre-line", MUTED, "[&_strong]:text-[#e8e4dc]")}>
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
    <div className="mx-auto max-w-[860px] px-6 sm:px-8 py-6 space-y-[13px] bg-[#0f0f0f] min-h-[calc(100vh-130px)]">
      {children}
    </div>
  );
}