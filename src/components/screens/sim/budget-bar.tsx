import { ArrowRight, RotateCcw } from "lucide-react";
import { fmtINR } from "@/lib/simulation";

export function BudgetBar({
  monthBudget,
  additionalInventory,
  marketing,
  remaining,
  canSubmit,
  onReset,
  onSubmit,
  monthNumber,
  invalid,
}: {
  monthBudget: number;
  additionalInventory: number;
  marketing: number;
  remaining: number;
  canSubmit: boolean;
  onReset: () => void;
  onSubmit: () => void;
  monthNumber: number;
  invalid?: string | null;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 budget-bar">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-[72px] flex items-center gap-4 sm:gap-7">
        <Cluster label="Monthly Budget" value={fmtINR(monthBudget)} />
        <Cluster
          label="Additional Inventory"
          value={fmtINR(additionalInventory)}
          tone={additionalInventory > 0 ? "danger" : additionalInventory < 0 ? "success" : undefined}
        />
        <Cluster label="Marketing" value={fmtINR(marketing)} />
        <div className="flex-1" />
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Budget Remaining
          </span>
          <span
            className={`text-[20px] font-bold font-mono leading-tight ${
              remaining < 0 ? "text-[color:var(--danger)]" : "text-[color:var(--success)]"
            }`}
          >
            {fmtINR(remaining)}
          </span>
          {(remaining < 0 || invalid) && (
            <span className="text-[10px] text-[color:var(--danger)] mt-0.5">
              {invalid ?? "Over budget. Adjust before submitting."}
            </span>
          )}
        </div>
        <button
          onClick={onReset}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-transparent px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          Submit Month {monthNumber} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Cluster({ label, value, tone }: { label: string; value: string; tone?: "danger" | "success" }) {
  const color =
    tone === "danger"
      ? "text-[color:var(--danger)]"
      : tone === "success"
        ? "text-[color:var(--success)]"
        : "text-foreground";
  return (
    <div className="hidden md:flex flex-col shrink-0">
      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <span className={`text-[14px] font-mono ${color}`}>{value}</span>
    </div>
  );
}