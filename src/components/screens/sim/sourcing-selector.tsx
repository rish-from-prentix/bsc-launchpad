import { Truck, Zap } from "lucide-react";

export function SourcingSelector({
  totalUnits,
  nearbyUnits,
  farUnits,
  onChange,
  disabled,
}: {
  totalUnits: number;
  nearbyUnits: number;
  farUnits: number;
  onChange: (n: number, f: number) => void;
  disabled?: boolean;
}) {
  const sum = nearbyUnits + farUnits;
  const error = sum !== totalUnits;

  return (
    <div className="mt-2.5 rounded-md bg-background/50 border border-border/60 p-2.5">
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
        Sourcing Split
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(totalUnits, 0)}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium border transition ${
            nearbyUnits >= farUnits
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="h-3 w-3" />
          Nearby ₹160
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(0, totalUnits)}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium border transition ${
            farUnits > nearbyUnits
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <Truck className="h-3 w-3" />
          Far ₹140
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <label className="block">
          <span className="text-[10px] text-muted-foreground">Nearby units</span>
          <input
            type="number"
            min={0}
            value={nearbyUnits}
            disabled={disabled}
            onChange={(e) => onChange(Math.max(0, parseInt(e.target.value || "0", 10)), farUnits)}
            className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-[12px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
        <label className="block">
          <span className="text-[10px] text-muted-foreground">Far units</span>
          <input
            type="number"
            min={0}
            value={farUnits}
            disabled={disabled}
            onChange={(e) => onChange(nearbyUnits, Math.max(0, parseInt(e.target.value || "0", 10)))}
            className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-[12px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
      </div>
      {error && (
        <div className="mt-2 text-[10px] text-[color:var(--danger)]">
          Sum ({sum}) must equal total inventory ({totalUnits}).
        </div>
      )}
    </div>
  );
}