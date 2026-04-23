import { Truck, Zap } from "lucide-react";
import { type SourcingChoice } from "@/lib/simulation";

/**
 * Cell-1 (Hyderabad Razor Kit) supplier picker.
 *
 * The student chooses ONE supplier per month for any *additional* units they
 * order. Carried inventory is already at hand. If they're returning units
 * (negative additional), no supplier is needed and we show the recovery
 * amount instead.
 */
export function SourcingSelector({
  carried,
  totalInventory,
  choice,
  onChange,
  disabled,
}: {
  carried: number; // qc + d2c carried units for cell 1
  totalInventory: number; // qc + d2c entered units for cell 1
  choice: SourcingChoice;
  onChange: (c: SourcingChoice) => void;
  disabled?: boolean;
}) {
  const additional = totalInventory - carried;

  // Hide entirely if not ordering new units (returning or unchanged).
  if (additional <= 0) return null;

  return (
    <div className="mt-2.5 rounded-md bg-background/50 border border-border/60 p-2.5 space-y-2">
      <div className="text-[12px] text-foreground/85">
        You want to order{" "}
        <span className="font-mono text-foreground">{additional}</span> new units this month.
      </div>
      <div className="text-[11px] text-muted-foreground">
        Where are you ordering the additional units from?
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("nearby")}
          className={`flex flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left border transition ${
            choice === "nearby"
              ? "border-primary bg-primary/15 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          } disabled:opacity-50`}
        >
          <span className="text-[11px] font-semibold flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Nearby supplier
          </span>
          <span className="text-[10px] font-mono">₹160 · 1 week</span>
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("far")}
          className={`flex flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left border transition ${
            choice === "far"
              ? "border-primary bg-primary/15 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          } disabled:opacity-50`}
        >
          <span className="text-[11px] font-semibold flex items-center gap-1.5">
            <Truck className="h-3 w-3" />
            Faraway supplier
          </span>
          <span className="text-[10px] font-mono">₹140 · 3 weeks</span>
        </button>
      </div>
      {choice == null && (
        <div className="text-[10px] text-[color:var(--danger)]">
          Pick a supplier before submitting.
        </div>
      )}
    </div>
  );
}