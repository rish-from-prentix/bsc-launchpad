import { useEffect, useMemo, useRef, useState } from "react";
import {
  CELL_META,
  MONTHLY_BUDGET,
  MONTH_CONTEXT,
  MONTH_EVENTS,
  MONTH_0,
  SHANTANU_WELCOME_BODY,
  computeElasticity,
  computeMonth,
  carriedForMonth,
  additionalInventoryExpense,
  totalMarketing,
  sellingPriceFor,
  type ArrN,
  type MonthData,
  type SourcingChoice,
} from "@/lib/simulation";
import { EventEmail } from "./sim/event-email";
import { SimCell } from "./sim/sim-cell";
import { BudgetBar } from "./sim/budget-bar";

type Inputs = {
  iq: ArrN;
  id: ArrN;
  mq: ArrN;
  md: ArrN;
};

function cloneArr(a: ArrN): ArrN {
  return [...a];
}

function inputsFromMonth(m: MonthData): Inputs {
  return {
    iq: cloneArr(m.inventory.iq),
    id: cloneArr(m.inventory.id),
    mq: cloneArr(m.marketing.mq),
    md: cloneArr(m.marketing.md),
  };
}

const SKU_ROWS = [
  { sku: "razor", label: "Razor Kit", cells: [1, 2, 3] },
  { sku: "beard", label: "Beard Oil", cells: [4, 5, 6] },
  { sku: "hair", label: "Hair Removal", cells: [7, 8, 9] },
] as const;

const CITIES = [
  { city: "hyd", label: "Hyderabad" },
  { city: "blr", label: "Bangalore" },
  { city: "bom", label: "Bombay" },
] as const;

export function SimulationMonth({
  monthNumber,
  prev,
  name,
  onSubmit,
  initialLocked,
  initialData,
  onExitReview,
}: {
  monthNumber: number;
  prev: MonthData;
  name: string;
  onSubmit: (data: MonthData) => void;
  initialLocked?: boolean;
  initialData?: MonthData;
  onExitReview?: () => void;
}) {
  const elasticity = useMemo(() => computeElasticity(monthNumber, prev), [monthNumber, prev]);
  const carried = useMemo(() => carriedForMonth(monthNumber, prev), [monthNumber, prev]);
  // The pre-filled values shown to the student are: inventory = carried,
  // marketing = previous month's marketing.
  const seedInputs: Inputs = useMemo(() => {
    if (initialData) return inputsFromMonth(initialData);
    return {
      iq: cloneArr(carried.iq),
      id: cloneArr(carried.id),
      mq: cloneArr(prev.marketing.mq),
      md: cloneArr(prev.marketing.md),
    };
  }, [carried, prev, initialData]);

  const [inputs, setInputs] = useState<Inputs>(seedInputs);
  const [sourcing, setSourcing] = useState<SourcingChoice>(
    () => initialData?.sourcing ?? null
  );
  const [reasoning, setReasoning] = useState(initialData?.reasoning ?? "");
  const [showReasoningHint, setShowReasoningHint] = useState(false);
  const [locked, setLocked] = useState<boolean>(!!initialLocked);
  const [welcomeOpen, setWelcomeOpen] = useState(true);

  // If switching months, reseed
  const lastSeedKey = useRef(monthNumber + ":" + (initialData ? "review" : "fresh"));
  useEffect(() => {
    const key = monthNumber + ":" + (initialData ? "review" : "fresh");
    if (lastSeedKey.current !== key) {
      setInputs(seedInputs);
      setSourcing(initialData?.sourcing ?? null);
      setReasoning(initialData?.reasoning ?? "");
      setLocked(!!initialLocked);
      lastSeedKey.current = key;
    }
  }, [monthNumber, initialData, initialLocked, seedInputs]);

  const monthBudget = MONTHLY_BUDGET[monthNumber];
  const additional = additionalInventoryExpense(
    { iq: inputs.iq, id: inputs.id },
    carried,
    sourcing
  );
  const mktTotal = totalMarketing({ mq: inputs.mq, md: inputs.md });
  const remaining = monthBudget - additional - mktTotal;

  const cell1Carried = (carried.iq[1] ?? 0) + (carried.id[1] ?? 0);
  const cell1Total = (inputs.iq[1] ?? 0) + (inputs.id[1] ?? 0);
  const cell1Additional = cell1Total - cell1Carried;
  const sourcingValid = cell1Additional <= 0 || sourcing != null;
  const canSubmit = !locked && remaining >= 0 && sourcingValid;

  const event = MONTH_EVENTS[monthNumber];
  const showWelcomeEmail = monthNumber === 1;

  function setInv(cell: number, ch: "iq" | "id", value: number) {
    setInputs((s) => {
      const next = { ...s, [ch]: cloneArr(s[ch]) };
      next[ch][cell] = value;
      return next;
    });
  }

  function setMkt(cell: number, ch: "mq" | "md", value: number) {
    setInputs((s) => {
      const next = { ...s, [ch]: cloneArr(s[ch]) };
      next[ch][cell] = value;
      return next;
    });
  }

  function reset() {
    setInputs(seedInputs);
    setSourcing(initialData?.sourcing ?? null);
    setReasoning(initialData?.reasoning ?? "");
  }

  function submit() {
    if (!canSubmit) return;
    if (!reasoning.trim()) {
      setShowReasoningHint(true);
      window.setTimeout(() => setShowReasoningHint(false), 3000);
    }
    setLocked(true);
    const result = computeMonth(
      monthNumber,
      {
        inventory: { iq: inputs.iq, id: inputs.id },
        marketing: { mq: inputs.mq, md: inputs.md },
        sourcing,
        reasoning,
        carried,
      },
      prev,
      elasticity
    );
    onSubmit(result);
  }

  return (
    <div
      className="w-full px-4 sm:px-6 lg:px-10 py-8"
      style={{ animation: "fadeSlide 250ms ease-out", paddingBottom: 120 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Month {monthNumber} of 5
          </div>
          <div className="mt-1 text-[15px] text-muted-foreground">
            {MONTH_CONTEXT[monthNumber]}
          </div>
        </div>
        {initialLocked && onExitReview && (
          <button
            onClick={onExitReview}
            className="text-xs text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-md border border-border"
          >
            ← Back to feedback
          </button>
        )}
      </div>

      {/* Event email */}
      {event && (
        <div className="mb-6 max-w-3xl">
          <EventEmail
            sender={event.sender}
            initials={event.initials}
            subject={event.subject}
            body={event.body.replace("[Name]", name || "there")}
          />
        </div>
      )}

      {/* Grid */}
      <div className="rounded-xl border border-border bg-background/40 overflow-hidden">
        <div className="grid grid-cols-[140px_repeat(3,minmax(260px,1fr))] gap-px bg-border">
          {/* Header row */}
          <div className="bg-background p-3" />
          {CITIES.map((c) => (
            <div
              key={c.city}
              className="bg-background p-3 text-[11px] uppercase tracking-[0.22em] text-primary font-semibold"
            >
              {c.label}
            </div>
          ))}
          {/* SKU rows */}
          {SKU_ROWS.map((row) => (
            <Row
              key={row.sku}
              row={row}
              inputs={inputs}
              prev={prev}
              elasticity={elasticity}
              sourcing={sourcing}
              setSourcing={setSourcing}
              setInv={setInv}
              setMkt={setMkt}
              locked={locked}
            />
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="mt-6 max-w-3xl">
        <label className="block">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Your reasoning
          </span>
          <textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            disabled={locked}
            placeholder="Explain the reasoning behind your decisions."
            rows={3}
            className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:opacity-60"
          />
        </label>
        {showReasoningHint && (
          <div className="mt-2 text-[11px] text-muted-foreground" style={{ animation: "fadeSlide 200ms ease-out" }}>
            Adding reasoning helps you reflect on your decisions.
          </div>
        )}
      </div>

      {!locked && (
        <BudgetBar
          monthBudget={monthBudget}
          additionalInventory={additional}
          marketing={mktTotal}
          remaining={remaining}
          canSubmit={canSubmit}
          onReset={reset}
          onSubmit={submit}
          monthNumber={monthNumber}
          invalid={!sourcingValid ? "Cell 1 sourcing split mismatch." : null}
        />
      )}
    </div>
  );
}

function Row({
  row,
  inputs,
  prev,
  elasticity,
  sourcing,
  setSourcing,
  setInv,
  setMkt,
  locked,
}: {
  row: { sku: string; label: string; cells: readonly number[] };
  inputs: Inputs;
  prev: MonthData;
  elasticity: { qc: ArrN; d2c: ArrN };
  sourcing: { nearbyUnits: number; farUnits: number };
  setSourcing: React.Dispatch<React.SetStateAction<{ nearbyUnits: number; farUnits: number }>>;
  setInv: (cell: number, ch: "iq" | "id", v: number) => void;
  setMkt: (cell: number, ch: "mq" | "md", v: number) => void;
  locked: boolean;
}) {
  const sp = sellingPriceFor(row.cells[0]);
  return (
    <>
      <div className="bg-background p-3 flex flex-col justify-center">
        <div className="text-[13px] font-semibold text-foreground">{row.label}</div>
        <div className="text-[11px] text-muted-foreground font-mono">₹{sp}</div>
      </div>
      {row.cells.map((cell) => {
        const meta = CELL_META[cell]!;
        return (
          <div key={cell} className="bg-background p-2.5">
            <SimCell
              cell={cell}
              inputs={inputs}
              prevSales={{
                sq: prev.sales.sq[cell] ?? MONTH_0.sales.sq[cell] ?? 0,
                sd: prev.sales.sd[cell] ?? MONTH_0.sales.sd[cell] ?? 0,
              }}
              elasticityQc={elasticity.qc[cell] ?? 0}
              elasticityD2c={elasticity.d2c[cell] ?? 0}
              sourcing={sourcing}
              onChangeInv={(ch, v) => setInv(cell, ch, v)}
              onChangeMkt={(ch, v) => setMkt(cell, ch, v)}
              onChangeSourcing={
                cell === 1 ? (n, f) => setSourcing({ nearbyUnits: n, farUnits: f }) : undefined
              }
              locked={locked}
            />
            <div className="mt-1 text-[10px] text-muted-foreground/70 px-1">{meta.cityLabel}</div>
          </div>
        );
      })}
    </>
  );
}