import { useMemo, useState } from "react";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  SectionHeader,
  HelperText,
  SubmitBar,
} from "./shared";
import { ARCH_TASKS, COST_ROWS } from "./arch-data";

const META = ARCH_TASKS[5];
const BUDGET = 81_000_000; // INR 8.1 crore

type RowState = { rate: string; area: string; subtotal: string };

export function ArchTaskSix({ onComplete }: { onComplete: () => void }) {
  const [rows, setRows] = useState<Record<string, RowState>>({});
  const [reconciliation, setReconciliation] = useState("");

  const subtotals = COST_ROWS.map((r) => {
    const s = rows[r.element];
    if (!s) return 0;
    const explicit = parseFloat((s.subtotal || "").replace(/[^0-9.]/g, ""));
    if (!isNaN(explicit) && explicit > 0) return explicit;
    const rate = parseFloat((s.rate || "").replace(/[^0-9.]/g, ""));
    const area = parseFloat((s.area || "").replace(/[^0-9.]/g, ""));
    if (!isNaN(rate) && !isNaN(area)) return rate * area;
    return 0;
  });

  const base = subtotals.reduce((a, b) => a + b, 0);
  const contingency = Math.round(base * 0.1);
  const total = base + contingency;
  const variance = total - BUDGET;

  const allFilled = COST_ROWS.every((r) => {
    const s = rows[r.element];
    if (!s) return false;
    return (s.subtotal || s.rate || "").trim() !== "";
  }) && reconciliation.trim().length >= 80;

  const fmt = (n: number) => "INR " + Math.round(n).toLocaleString("en-IN");

  return (
    <TaskFrame>
      <TaskHeader
        week={META.week}
        taskNumber={META.index}
        duration={META.duration}
        title={META.title}
        deliverable={META.deliverable}
      />
      <VoiceNote initials="AJ" name="Arvind Joshi" role="QS · Bharat Cost Consultants" timestamp="Tue 09:15 · voice msg">
        Budget is <b>INR 8.1 crore, firm</b>. Use mid point of each rate range for the base estimate. Apply upper rate only where your design commits to premium spec. Substructure will likely hit the upper end, black cotton soil. <strong>If you are over budget by more than 5%, tell me what you would cut.</strong>
      </VoiceNote>

      <SectionHeader hint="Enter rate and area, or fill the subtotal directly. Contingency = 10% of elements 1 to 8.">
        Elemental Cost Plan
      </SectionHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Element</th>
              <th className="text-left px-3 py-2">Rate Range</th>
              <th className="text-left px-3 py-2 w-28">Rate</th>
              <th className="text-left px-3 py-2 w-28">Area</th>
              <th className="text-left px-3 py-2 w-36">Subtotal (INR)</th>
            </tr>
          </thead>
          <tbody>
            {COST_ROWS.map((r, i) => {
              const s = rows[r.element] || { rate: "", area: "", subtotal: "" };
              return (
                <tr key={r.element} className="border-t border-border">
                  <td className="px-3 py-2 font-medium text-foreground/90">{r.element}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.rateRange}</td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={s.rate}
                      onChange={(e) => setRows({ ...rows, [r.element]: { ...s, rate: e.target.value } })}
                      placeholder="rate"
                      className="w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={s.area}
                      onChange={(e) => setRows({ ...rows, [r.element]: { ...s, area: e.target.value } })}
                      placeholder={r.areaPlaceholder}
                      className="w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={s.subtotal || (subtotals[i] ? subtotals[i].toLocaleString("en-IN") : "")}
                      onChange={(e) => setRows({ ...rows, [r.element]: { ...s, subtotal: e.target.value } })}
                      placeholder="auto or override"
                      className="w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-border bg-card/60">
              <td className="px-3 py-2 font-semibold">9. Contingency (10% of 1 to 8)</td>
              <td className="px-3 py-2 text-muted-foreground">10%</td>
              <td colSpan={2} />
              <td className="px-3 py-2 font-mono">{fmt(contingency)}</td>
            </tr>
            <tr className="bg-primary/5">
              <td className="px-3 py-2 font-semibold">TOTAL</td>
              <td colSpan={3} />
              <td className="px-3 py-2 font-mono font-semibold">{fmt(total)}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-semibold">Client Budget</td>
              <td colSpan={3} />
              <td className="px-3 py-2 font-mono text-primary">{fmt(BUDGET)}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-semibold">Variance</td>
              <td colSpan={3} />
              <td
                className={`px-3 py-2 font-mono ${Math.abs(variance) <= BUDGET * 0.05 ? "text-[oklch(0.72_0.14_155)]" : "text-destructive"}`}
              >
                {variance >= 0 ? "Over by " : "Under by "}
                {fmt(Math.abs(variance))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Reconciliation Note (150 words)</SectionHeader>
      <textarea
        rows={5}
        value={reconciliation}
        onChange={(e) => setReconciliation(e.target.value)}
        placeholder="Identify 3 elements most sensitive to your design decisions. If over budget by more than 5%, state what you would value engineer and the consequence..."
        className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <HelperText>Focus on reasoning, not summaries.</HelperText>

      <SubmitBar
        label="Submit Cost Plan"
        onSubmit={onComplete}
        disabled={!allFilled}
        hint={allFilled ? "Cost plan ready for QS." : "Complete every element row and write the reconciliation."}
      />
    </TaskFrame>
  );
}