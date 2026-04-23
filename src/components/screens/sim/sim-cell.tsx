import { Lock } from "lucide-react";
import {
  CELL_META,
  holdingCostFor,
  sellingPriceFor,
  unitCostFor,
  type ArrN,
} from "@/lib/simulation";
import { SourcingSelector } from "./sourcing-selector";

type Inputs = {
  iq: ArrN;
  id: ArrN;
  mq: ArrN;
  md: ArrN;
};

export function SimCell({
  cell,
  inputs,
  prevSales,
  elasticityQc,
  elasticityD2c,
  sourcing,
  onChangeInv,
  onChangeMkt,
  onChangeSourcing,
  locked,
}: {
  cell: number;
  inputs: Inputs;
  prevSales: { sq: number; sd: number };
  elasticityQc: number;
  elasticityD2c: number;
  sourcing: { nearbyUnits: number; farUnits: number };
  onChangeInv: (channel: "iq" | "id", value: number) => void;
  onChangeMkt: (channel: "mq" | "md", value: number) => void;
  onChangeSourcing?: (n: number, f: number) => void;
  locked?: boolean;
}) {
  const meta = CELL_META[cell]!;
  const uc = unitCostFor(cell, sourcing);
  const hc = holdingCostFor(cell);
  const isCell1 = cell === 1;
  const totalInv = (inputs.iq[cell] ?? 0) + (inputs.id[cell] ?? 0);

  const inputCls = (locked: boolean | undefined) =>
    locked
      ? "locked-field w-full rounded-md px-2 py-1.5 text-[13px] font-mono"
      : "w-full rounded-md border border-border bg-background px-2 py-1.5 text-[13px] font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60";

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 relative">
      {locked && (
        <div className="absolute top-2.5 right-2.5 text-muted-foreground/60">
          <Lock className="h-3 w-3" />
        </div>
      )}
      {/* Inventory */}
      <div className="space-y-1.5">
        <Field label="Inventory (QC)">
          <input
            type="number"
            min={0}
            disabled={locked}
            value={inputs.iq[cell] ?? 0}
            onChange={(e) => onChangeInv("iq", Math.max(0, parseInt(e.target.value || "0", 10)))}
            className={inputCls(locked)}
          />
        </Field>
        <Field label="Inventory (D2C)">
          <input
            type="number"
            min={0}
            disabled={locked}
            value={inputs.id[cell] ?? 0}
            onChange={(e) => onChangeInv("id", Math.max(0, parseInt(e.target.value || "0", 10)))}
            className={inputCls(locked)}
          />
        </Field>
      </div>

      {isCell1 && onChangeSourcing && (
        <SourcingSelector
          totalUnits={totalInv}
          nearbyUnits={sourcing.nearbyUnits}
          farUnits={sourcing.farUnits}
          onChange={onChangeSourcing}
          disabled={locked}
        />
      )}

      {/* Prev month sales (locked) */}
      <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
        <LockedRow label="Prev sales (QC)" value={prevSales.sq} />
        <LockedRow label="Prev sales (D2C)" value={prevSales.sd} />
      </div>

      {/* Marketing */}
      <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
        <Field label="Marketing (QC)">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[12px] font-mono">
              ₹
            </span>
            <input
              type="number"
              min={0}
              disabled={locked}
              value={inputs.mq[cell] ?? 0}
              onChange={(e) => onChangeMkt("mq", Math.max(0, parseInt(e.target.value || "0", 10)))}
              className={`${inputCls(locked)} pl-5`}
            />
          </div>
        </Field>
        <Field label="Marketing (D2C)">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[12px] font-mono">
              ₹
            </span>
            <input
              type="number"
              min={0}
              disabled={locked}
              value={inputs.md[cell] ?? 0}
              onChange={(e) => onChangeMkt("md", Math.max(0, parseInt(e.target.value || "0", 10)))}
              className={`${inputCls(locked)} pl-5`}
            />
          </div>
        </Field>
      </div>

      {/* Context data */}
      <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
        <Stat label="Elasticity QC" value={elasticityQc.toFixed(2)} />
        <Stat label="Elasticity D2C" value={elasticityD2c.toFixed(2)} />
        <Stat label="Unit cost" value={`₹${Math.round(uc)}`} />
        <Stat label="Holding /unit" value={`₹${hc}`} />
        <Stat label="SP /unit" value={`₹${sellingPriceFor(cell)}`} />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}

function LockedRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground uppercase tracking-[0.1em] text-[10px]">{label}</span>
      <span className="font-mono text-muted-foreground/80">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground/80">{label}</span>
      <span className="font-mono text-foreground/80">{value}</span>
    </div>
  );
}