import { ArrowLeft, ArrowRight, Zap, Globe } from "lucide-react";
import { Breadcrumb, StepBar } from "./primer-shared";

export function PrimerChannel({
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
        <Breadcrumb>Primers / Channel Strategy</Breadcrumb>
        <StepBar active={2} />
      </div>

      <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight">
        Channel Strategy
      </h1>
      <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
        Quick Commerce vs D2C. Margins vs Volume.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 p-6">
          <Zap className="h-5 w-5 text-[color:var(--warning)] mb-3" />
          <div className="text-[17px] font-semibold">Quick Commerce</div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
            Zepto · Blinkit
          </div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/90 leading-relaxed">
            <li>• Higher volume (discovery + impulse)</li>
            <li>• Lower margin (15% platform commission)</li>
            <li>• Low control over pricing</li>
          </ul>
        </div>
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-6">
          <Globe className="h-5 w-5 text-blue-300 mb-3" />
          <div className="text-[17px] font-semibold">D2C</div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
            BSC Website
          </div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/90 leading-relaxed">
            <li>• Higher margin (no commission)</li>
            <li>• Lower volume (needs marketing investment)</li>
            <li>• Full pricing control</li>
          </ul>
        </div>
      </div>

      <div
        className="mt-8 rounded-xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-primary text-[11px] uppercase tracking-[0.14em]">
              <th className="text-left font-medium px-5 py-3">Factor</th>
              <th className="text-left font-medium px-5 py-3">
                Quick Commerce
              </th>
              <th className="text-left font-medium px-5 py-3">D2C</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Margin", "Lower", "Higher"],
              ["Volume", "Higher", "Lower"],
              ["Control", "Low", "High"],
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 1 ? "bg-secondary/30" : ""}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-5 py-3 text-foreground/90 font-medium"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-7 text-center">
        <p className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
          The goal is not to choose one. It's to balance both — and allocate
          each rupee where it earns the most.
        </p>
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