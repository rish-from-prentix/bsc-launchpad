import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Breadcrumb,
  FormulaCard,
  SectionLabel,
  StepBar,
} from "./primer-shared";

export function PrimerMarketing({
  onBack,
  onQuiz,
}: {
  onBack: () => void;
  onQuiz: () => void;
}) {
  return (
    <div
      className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb>Primers / Marketing Elasticity</Breadcrumb>
        <StepBar active={0} />
      </div>

      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight">
        Marketing Elasticity
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
        Understand how your marketing spend translates to sales.
      </p>

      <div className="mt-10">
        <SectionLabel>Definition</SectionLabel>
        <FormulaCard>
          Marketing Elasticity = (% change in sales) / (% change in marketing
          spend)
        </FormulaCard>
        <p className="text-[15px] text-foreground/90 leading-[1.7]">
          When a report says marketing elasticity{" "}
          <span className="font-mono text-primary">(m) = 1.6</span>, here's
          what it means: if you increase marketing spend by 1%, your total
          sales will likely increase by 1.6%.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-7">
        <SectionLabel>An example</SectionLabel>
        <p className="text-[15px] text-foreground/90 leading-[1.7]">
          A team spends ₹10,000/month on marketing and sells products worth
          ₹1,00,000. Marketing elasticity ={" "}
          <span className="font-mono text-primary">2</span>.
        </p>
        <div className="mt-5 rounded-lg overflow-hidden border border-border bg-card/60">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-primary text-[11px] uppercase tracking-[0.14em]">
                <th className="text-left font-medium px-4 py-3">
                  Marketing Spend
                </th>
                <th className="text-left font-medium px-4 py-3">Change</th>
                <th className="text-left font-medium px-4 py-3">
                  Expected Sales
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["₹10,000", "Baseline", "₹1,00,000"],
                ["₹10,100", "+1%", "₹1,02,000 (+2%)"],
                ["₹10,200", "+2%", "₹1,04,000 (+4%)"],
              ].map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 1 ? "bg-secondary/30" : ""}
                >
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-foreground/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-8 text-sm italic text-muted-foreground leading-relaxed">
        Note: In reality, elasticity often declines as sales volume grows. For
        this internship, we assume it stays constant — with one important
        exception you'll discover later.
      </p>

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