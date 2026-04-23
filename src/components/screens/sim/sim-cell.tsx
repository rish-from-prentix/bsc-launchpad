import { Lock } from "lucide-react";
import {
  CELL_META,
  holdingCostFor,
  sellingPriceFor,
  unitCostFor,
  type ArrN,
  type SourcingChoice,
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
  carried,
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
  carried: { iq: number; id: number };
  prevSales: { sq: number; sd: number };
  elasticityQc: number;
  elasticityD2c: number;
  sourcing: SourcingChoice;
  onChangeInv: (channel: "iq" | "id", value: number) => void;
  onChangeMkt: (channel: "mq" | "md", value: number) => void;
  onChangeSourcing?: (c: SourcingChoice) => void;
  locked?: boolean;
}) {
  CELL_META[cell]!;
  const uc = unitCostFor(cell, sourcing);
  const hc = holdingCostFor(cell);
  const sp = sellingPriceFor(cell);
  const isCell1 = cell === 1;
  const totalInv = (inputs.iq[cell] ?? 0) + (inputs.id[cell] ?? 0);

  const inputCls = locked
    ? "locked-field w-full rounded-md px-2 py-1.5 text-[13px] font-mono"
    : "w-full rounded-md border border-border bg-background px-2 py-1.5 text-[13px] font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/60";

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 relative">
      {locked && (
        <div className="absolute top-2.5 right-2.5 text-muted-foreground/60">
          <Lock className="h-3 w-3" />
        </div>
      )}

      {/* QC channel block */}
      <ChannelBlock
        chLabel="QC"
        prevSales={prevSales.sq}
        invValue={inputs.iq[cell] ?? 0}
        onChangeInv={(v) => onChangeInv("iq", v)}
        locked={!!locked}
        inputCls={inputCls}
      />

      {/* D2C channel block */}
      <div className="mt-2.5">
        <ChannelBlock
          chLabel="D2C"
          prevSales={prevSales.sd}
          invValue={inputs.id[cell] ?? 0}
          onChangeInv={(v) => onChangeInv("id", v)}
          locked={!!locked}
          inputCls={inputCls}
        />
      </div>

      {isCell1 && onChangeSourcing && (
        <SourcingSelector
          carried={carried.iq + carried.id}
          totalInventory={totalInv}
          choice={sourcing}
          onChange={onChangeSourcing}
          disabled={locked}
        />
      )}

      {/* Divider */}
      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
        <ElasticityMarketing
          chLabel="QC"
          elasticity={elasticityQc}
          mktValue={inputs.mq[cell] ?? 0}
          onChangeMkt={(v) => onChangeMkt("mq", v)}
          locked={!!locked}
          inputCls={inputCls}
        />
        <ElasticityMarketing
          chLabel="D2C"
          elasticity={elasticityD2c}
          mktValue={inputs.md[cell] ?? 0}
          onChangeMkt={(v) => onChangeMkt("md", v)}
          locked={!!locked}
          inputCls={inputCls}
        />
      </div>

      {/* Context */}
      <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-3 gap-x-2 gap-y-1 text-[10px]">
        <Stat label="Unit cost" value={`₹${Math.round(uc)}`} />
        <Stat label="Holding /unit" value={`₹${hc}`} />
        <Stat label="SP /unit" value={`₹${sp}`} />
      </div>
    </div>
  );
}

function ChannelBlock({
  chLabel,
  prevSales,
  invValue,
  onChangeInv,
  locked,
  inputCls,
}: {
  chLabel: string;
  prevSales: number;
  invValue: number;
  onChangeInv: (v: number) => void;
  locked: boolean;
  inputCls: string;
}) {
  return (
    <div className="space-y-1">
      <LockedRow label={`Prev Month Sales (${chLabel})`} value={prevSales} />
      <Field label={`Inventory (${chLabel})`}>
        <input
          type="number"
          min={0}
          disabled={locked}
          value={invValue}
          onChange={(e) => onChangeInv(Math.max(0, parseInt(e.target.value || "0", 10)))}
          className={inputCls}
        />
      </Field>
    </div>
  );
}

function ElasticityMarketing({
  chLabel,
  elasticity,
  mktValue,
  onChangeMkt,
  locked,
  inputCls,
}: {
  chLabel: string;
  elasticity: number;
  mktValue: number;
  onChangeMkt: (v: number) => void;
  locked: boolean;
  inputCls: string;
}) {
  const tone =
    elasticity > 1.1 ? "good" : elasticity >= 0.8 ? "warn" : "bad";
  const dotColor =
    tone === "good"
      ? "bg-[color:var(--success)]"
      : tone === "warn"
        ? "bg-[color:var(--warning)]"
        : "bg-[color:var(--danger)]";
  const textColor =
    tone === "good"
      ? "text-[color:var(--success)]"
      : tone === "warn"
        ? "text-[color:var(--warning)]"
        : "text-[color:var(--danger)]";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground uppercase tracking-[0.1em] text-[10px]">
          Elasticity ({chLabel})
        </span>
        <span className={`flex items-center gap-1.5 font-mono ${textColor}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          {elasticity.toFixed(2)}
        </span>
      </div>
      <Field label={`Marketing (${chLabel})`}>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[12px] font-mono">
            ₹
          </span>
          <input
            type="number"
            min={0}
            disabled={locked}
            value={mktValue}
            onChange={(e) => onChangeMkt(Math.max(0, parseInt(e.target.value || "0", 10)))}
            className={`${inputCls} pl-5`}
          />
        </div>
      </Field>
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