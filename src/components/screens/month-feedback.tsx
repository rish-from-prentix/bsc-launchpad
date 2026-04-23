import { ArrowRight, Check, AlertTriangle, X, Eye } from "lucide-react";
import {
  evaluateFeedback,
  fmtINR,
  fmtINRShort,
  type FeedbackCard,
  type MonthData,
} from "@/lib/simulation";

export function MonthFeedback({
  monthNumber,
  current,
  prev,
  cumulativeEbitda,
  onReview,
  onNext,
  isLast,
}: {
  monthNumber: number;
  current: MonthData;
  prev: MonthData;
  cumulativeEbitda: number;
  onReview: () => void;
  onNext: () => void;
  isLast?: boolean;
}) {
  const cards: FeedbackCard[] = evaluateFeedback(monthNumber, current, prev);
  const profit = current.totalProfit ?? 0;

  return (
    <div
      className="mx-auto max-w-[680px] px-5 sm:px-8 py-12 sm:py-16"
      style={{ animation: "fadeSlide 280ms ease-out" }}
    >
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Month {monthNumber} Results
        </div>
        <div className={`mt-4 text-[40px] sm:text-[48px] font-bold tracking-tight font-mono ${profit < 0 ? "text-[color:var(--danger)]" : "text-foreground"}`}>
          {fmtINR(profit)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {profit < 0 ? "loss" : "profit"} this month
        </div>
        <div className="mt-3 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
          Cumulative EBITDA: <span className="text-foreground font-mono">{fmtINRShort(cumulativeEbitda)}</span>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {cards.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No specific notes this month — solid steady-state run.
          </div>
        )}
        {cards.map((c, i) => (
          <FeedbackCardView key={i} card={c} index={i} />
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReview}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:bg-card transition justify-center"
        >
          <Eye className="h-4 w-4" /> Review this month
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition justify-center"
          style={{ animation: "softPulse 2.4s ease-in-out infinite" }}
        >
          {isLast ? "See Final Results" : `Begin Month ${monthNumber + 1}`}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function FeedbackCardView({ card, index }: { card: FeedbackCard; index: number }) {
  const tone = card.tone;
  const Icon = tone === "good" ? Check : tone === "warn" ? AlertTriangle : X;
  const borderClass =
    tone === "good"
      ? "border-l-primary"
      : tone === "warn"
        ? "border-l-[color:var(--warning)]"
        : "border-l-[color:var(--danger)]";
  const iconColor =
    tone === "good"
      ? "text-primary"
      : tone === "warn"
        ? "text-[color:var(--warning)]"
        : "text-[color:var(--danger)]";

  return (
    <div
      className={`rounded-lg border border-border bg-card border-l-4 ${borderClass} p-4 flex gap-3`}
      style={{
        animation: "staggerIn 360ms ease-out both",
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className={`shrink-0 mt-0.5 ${iconColor}`}>
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-foreground">{card.title}</div>
        <div className="mt-1 text-[13px] text-muted-foreground leading-[1.6]">{card.body}</div>
      </div>
    </div>
  );
}