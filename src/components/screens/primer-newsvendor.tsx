import { ArrowLeft, ArrowRight, Quote, Box, Warehouse, Sigma } from "lucide-react";
import { Breadcrumb, FormulaCard, SectionLabel, StepBar } from "./primer-shared";

export function PrimerNewsvendor({ onBack, onQuiz }: { onBack: () => void; onQuiz: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14" style={{ animation: "fadeSlide 250ms ease-out" }}>
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb>Primers / Newsvendor Analysis</Breadcrumb>
        <StepBar active={1} />
      </div>

      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight">
        Optimal Inventory Levels (Newsvendor Analysis)
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
        Now, this one is slightly complex. But if you grasp this well, your internship will be a cakewalk.
      </p>

      <div
        className="mt-10 rounded-xl border border-border bg-card p-7 sm:p-9 text-center"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <Quote className="h-6 w-6 text-primary mx-auto mb-4" />
        <p className="text-lg sm:text-xl text-foreground/95 leading-relaxed font-medium">
          Imagine you're running a stall selling BSC's Razor Kits at a college fest. You need to decide in the morning
          how many kits to bring. You can't go back and restock mid-day.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/5 p-5">
          <Box className="h-5 w-5 text-[color:var(--danger)] mb-3" />
          <div className="text-[13px] uppercase tracking-[0.18em] text-[color:var(--danger)] font-semibold mb-2">
            Too few
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            You run out early. Customers come, you have nothing to sell. You lose money you could have made.
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 p-5">
          <Warehouse className="h-5 w-5 text-[color:var(--warning)] mb-3" />
          <div className="text-[13px] uppercase tracking-[0.18em] text-[color:var(--warning)] font-semibold mb-2">
            Too many
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            The fest ends and you're left with unsold kits. You paid for them, but made nothing back.
          </p>
        </div>
      </div>

      <p className="mt-8 text-[15px] text-foreground/90 leading-[1.7]">
        This is exactly the problem BSC's supply chain team faces every month — except at a much larger scale, across
        cities and channels.
      </p>

      <p className="mt-4 text-[15px] text-foreground/90 leading-[1.7]">There are 2 costs you're always balancing:</p>

      <FormulaCard>Cost of Understocking (CU) = Selling Price − Cost to Make the Product</FormulaCard>
      <p className="text-[14px] text-foreground/85 leading-[1.7]">
        For example, if a Razor Kit sells for ₹349 and costs ₹140 to make: CU = ₹349 − ₹140 = ₹209
        <br />
        Every time a customer wants a kit and you don't have one, you've lost ₹209.
      </p>

      <FormulaCard>Cost of Overstocking (CO) = Holding Cost per Unit (+ Discount Loss, if applicable)</FormulaCard>
      <p className="text-[14px] text-foreground/85 leading-[1.7]">
        For example, if storing one unsold kit for a month costs ₹30: CO = ₹30
      </p>

      <div className="mt-10">
        <SectionLabel>The Critical Ratio: Finding Your Sweet Spot</SectionLabel>
        <p className="text-[15px] text-foreground/90 leading-[1.7]">
          Now here's the key insight: you want to keep stocking more inventory as long as the profit from selling one
          more unit outweighs the cost of holding it unsold.
        </p>
        <p className="mt-4 text-[15px] text-foreground/90 leading-[1.7]">
          The Critical Ratio tells you how often you want to have enough inventory to meet demand:
        </p>
        <FormulaCard large>Critical Ratio = CU / (CU + CO)</FormulaCard>
        <p className="text-[14px] text-foreground/85 leading-[1.7]">
          Using our Razor Kit example: Critical Ratio = 209 / (209 + 30) = 0.874
        </p>
        <div className="mt-6 rounded-lg bg-secondary/40 border border-border p-5 italic text-sm text-foreground/85 leading-relaxed">
          How to read this: You should stock enough inventory to meet the demand in about 87.4% of scenarios. In other
          words, you're willing to risk a stockout only 12.6% of the time — because your profit margin is high enough to
          justify holding more stock. The higher your margin relative to holding cost, the more inventory you should
          hold. Intuitively, that should make sense.
        </div>
      </div>

      <div className="mt-10">
        <SectionLabel>Turning the Ratio into an Actual Number</SectionLabel>
        <p className="text-[15px] text-foreground/90 leading-[1.7]">
          The Critical Ratio tells you how confident you want to be. To turn that into an actual stock number, you need
          two more inputs:
        </p>
        <ul className="mt-4 space-y-2 text-[15px] text-foreground/90 leading-[1.7] list-disc pl-5">
          <li>
            <span className="font-semibold">Expected Demand:</span> your best estimate of how many units will sell
          </li>
          <li>
            <span className="font-semibold">Demand Uncertainty:</span> how much the actual demand might vary from that
            estimate (measured as standard deviation)
          </li>
        </ul>
        <p className="mt-4 text-[15px] text-foreground/90 leading-[1.7]">
          First, look up the Z-score value corresponding to your Critical Ratio from the Z-table.
        </p>
        <p className="mt-4 text-[15px] text-foreground/90 leading-[1.7]">
          Then, identify optimal inventory levels using the following formula:
        </p>
        <FormulaCard>Optimal Stock = Expected Demand + (Z-score × Demand Uncertainty)</FormulaCard>
      </div>

      <div className="mt-10">
        <p className="text-[15px] text-foreground/90 leading-[1.7]">
          To look up the Z-score corresponding to your computed Critical Ratio during the simulation, use the Z-table
          button pinned to the bottom-right corner.
        </p>
        <div className="mt-5 flex justify-center">
          <div
            aria-hidden="true"
            className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            <Sigma className="h-3.5 w-3.5" />
            Z-table
          </div>
        </div>
        <p className="mt-5 text-[15px] text-foreground/90 leading-[1.7]">
          Don't worry, you will be able to access the table while making decisions on the job as well.
        </p>
      </div>

      <div
        className="mt-10 rounded-xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <div className="p-6 sm:p-7">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Worked Example</div>
          <div className="text-[18px] font-bold mt-1">Razor Kit in Hyderabad</div>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Inputs</div>
              <dl className="space-y-2 text-sm font-mono">
                {[
                  ["Selling Price", "₹349"],
                  ["Unit Cost", "₹140"],
                  ["Monthly Holding Cost", "₹30"],
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
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Steps</div>
              <ol className="space-y-2 text-sm font-mono">
                {[
                  "CU = ₹349 − ₹140 = ₹209",
                  "CO = ₹30",
                  "Critical Ratio = 209 / (209 + 30) = 0.874",
                  "Z-score (from Z-table, CR = 0.874) ≈ 1.15",
                  "Optimal Stock = 800 + (1.15 × 150) = 800 + 172 = 972 units",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary">{i + 1}.</span>
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <p className="mt-6 text-[14px] text-foreground/85 leading-[1.7]">
            So BSC's team would order approximately 972 Razor Kits for Hyderabad this month: enough to confidently cover
            most demand scenarios without over-committing on inventory.
          </p>
        </div>
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
