import { Truck, Zap, Undo2 } from "lucide-react";
import { fmtINR, type SourcingChoice } from "@/lib/simulation";

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
  const isReturn = additional < 0;

  if (isReturn) {
    const returned = Math.abs(additional);
    // Far cost is the cheaper baseline; assume far for returns (or whichever
    // chosen; mathematically the refund applies regardless). Use 140 as reference.
    const refund = returned * (140 - 30);
    return (
      <div className="mt-2.5 rounded-md bg-background/50 border border-border/60 p-2.5">
        <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <Undo2 className="h-3 w-3" />
          Returning Stock
        </div>
        <div className="text-[12px] text-foreground/80">
          Returning <span className="font-mono text-foreground">{returned}</span> units. You recover{" "}
          <span className="font-mono text-[color:var(--success)]">{fmtINR(refund)}</span>.
        </div>
      </div>
    );
  }

  const unitCost = choice === "nearby" ? 160 : choice === "far" ? 140 : null;
  const totalCost = unitCost != null ? additional * unitCost : null;

  return (
    <div className="mt-2.5 rounded-md bg-background/50 border border-border/60 p-2.5 space-y-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        You have <span className="font-mono text-foreground/80">{carried}</span> units carried over.
      </div>
      {additional > 0 && (
        <div className="text-[11px] text-muted-foreground">
          Where are you ordering the additional {additional} units from?
        </div>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          disabled={disabled || additional <= 0}
          onClick={() => onChange("nearby")}
          className={`flex flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left border transition ${
            choice === "nearby"
              ? "border-primary bg-primary/15 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          } disabled:opacity-50`}
        >
          <span className="text-[11px] font-semibold flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Nearby
          </span>
          <span className="text-[10px] font-mono">₹160 · 2 weeks</span>
        </button>
        <button
          type="button"
          disabled={disabled || additional <= 0}
          onClick={() => onChange("far")}
          className={`flex flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left border transition ${
            choice === "far"
              ? "border-primary bg-primary/15 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          } disabled:opacity-50`}
        >
          <span className="text-[11px] font-semibold flex items-center gap-1.5">
            <Truck className="h-3 w-3" />
            Faraway
          </span>
          <span className="text-[10px] font-mono">₹140 · 1 month</span>
        </button>
      </div>
      {additional > 0 && (
        <div className="text-[10px] text-muted-foreground space-y-0.5 pt-1">
          <Row label="Additional units" value={String(additional)} />
          <Row label="Cost per unit" value={unitCost != null ? `₹${unitCost}` : "—"} />
          <Row
            label="Sourcing cost"
            value={totalCost != null ? fmtINR(totalCost) : "—"}
            mono
          />
        </div>
      )}
      {additional > 0 && choice == null && (
        <div className="text-[10px] text-[color:var(--danger)]">
          Pick a supplier before submitting.
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className={mono ? "font-mono text-foreground/90" : "font-mono text-foreground/80"}>
        {value}
      </span>
    </div>
  );
}