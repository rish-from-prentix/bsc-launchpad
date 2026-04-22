import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Quote, Box, Warehouse } from "lucide-react";
import {
  Breadcrumb,
  FormulaCard,
  SectionLabel,
  StepBar,
} from "./primer-shared";

export function PrimerNewsvendor({
  onBack,
  onQuiz,
}: {
  onBack: () => void;
  onQuiz: () => void;
}) {
  const [zOpen, setZOpen] = useState(false);

  return (
    <div
      className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb>Primers / Newsvendor Analysis</Breadcrumb>
        <StepBar active={1} />
      </div>

      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight">
        Optimal Inventory Levels
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
        The Newsvendor Problem
      </p>

      <div
        className="mt-10 rounded-xl border border-border bg-card p-7 sm:p-9 text-center"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <Quote className="h-6 w-6 text-primary mx-auto mb-4" />
        <p className="text-lg sm:text-xl text-foreground/95 leading-relaxed font-medium">
          You're running a stall at a college fest. You decide in the morning
          how many Razor Kits to bring. You can't restock mid-day.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/5 p-5">
          <Box className="h-5 w-5 text-[color:var(--danger)] mb-3" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-semibold">Too few</span> → You run out.
            Customers leave. You lose the profit you could have made.
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 p-5">
          <Warehouse className="h-5 w-5 text-[color:var(--warning)] mb-3" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-semibold">Too many</span> → The fest ends.
            You're stuck with unsold stock you paid for.
          </p>
        </div>
      </div>

      <p className="mt-8 text-[15px] text-foreground/90 leading-[1.7]">
        This is exactly what BSC's supply chain team navigates every month —
        across SKUs, cities, and channels.
      </p>

      <div className="mt-10">
        <SectionLabel>The two costs</SectionLabel>
        <FormulaCard>
          Cost of Understocking (CU) = Selling Price − Cost to Produce
          <div className="mt-2 text-xs text-muted-foreground">
            Razor Kit: ₹349 − ₹140 = ₹209 lost per stockout
          </div>
        </FormulaCard>
        <FormulaCard>
          Cost of Overstocking (CO) = Holding Cost per Unsold Unit
          <div className="mt-2 text-xs text-muted-foreground">
            Razor Kit: ₹30 per unit sitting unsold
          </div>
        </FormulaCard>
      </div>

      <div className="mt-10">
        <SectionLabel>Critical Ratio</SectionLabel>
        <FormulaCard large>
          Critical Ratio = CU / (CU + CO) = 209 / (209 + 30) = 0.874
        </FormulaCard>
        <div className="rounded-lg bg-secondary/40 border border-border p-5 italic text-sm text-foreground/85 leading-relaxed">
          This means: stock enough to meet demand in 87.4% of scenarios.
          You're willing to accept a stockout only 12.6% of the time.
        </div>
      </div>

      <div
        className="mt-10 rounded-xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <div className="p-6 sm:p-7">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Worked Example
          </div>
          <div className="text-lg font-semibold mt-1">
            Razor Kit, Hyderabad
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Inputs
              </div>
              <dl className="space-y-2 text-sm font-mono">
                {[
                  ["Selling Price", "₹349"],
                  ["Unit Cost", "₹140"],
                  ["Holding Cost", "₹30"],
                  ["Expected Demand", "800 units"],
                  ["Std Deviation", "150 units"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Steps
              </div>
              <ol className="space-y-2 text-sm font-mono">
                {[
                  "CU = ₹209",
                  "CO = ₹30",
                  "Critical Ratio = 0.874",
                  "Z-score = 1.15",
                  "Optimal = 800 + (1.15 × 150) = 972",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary">{i + 1}.</span>
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
        <button
          onClick={() => setZOpen((o) => !o)}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/30 transition"
        >
          <span className="text-sm font-medium">Z-table reference</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              zOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {zOpen && (
          <div className="px-5 pb-5">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="text-primary text-[11px] uppercase tracking-[0.14em]">
                  <th className="text-left font-medium py-2">Critical Ratio</th>
                  <th className="text-right font-medium py-2">Z-Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0.75", "0.67"],
                  ["0.80", "0.84"],
                  ["0.85", "1.04"],
                  ["0.87", "1.13"],
                  ["0.90", "1.28"],
                  ["0.95", "1.65"],
                ].map(([cr, z], i) => (
                  <tr key={cr} className={i % 2 === 1 ? "bg-secondary/30" : ""}>
                    <td className="py-1.5 px-2">{cr}</td>
                    <td className="py-1.5 px-2 text-right">{z}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={onQuiz}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          Take the Quiz <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}