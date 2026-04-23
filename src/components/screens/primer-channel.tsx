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
        Quick Commerce vs D2C. The eternal trade-off.
      </p>

      <p className="mt-8 text-[15px] text-foreground/90 leading-[1.7]">
        We sell through 2 key channels and it is important for you to understand the distinction:
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--warning)]/30 bg-[color:var(--warning)]/5 p-6">
          <Zap className="h-5 w-5 text-[color:var(--warning)] mb-3" />
          <div className="text-[17px] font-semibold">Quick Commerce</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
            Platforms like Zepto and Blinkit
          </div>
          <p className="mt-4 text-sm text-foreground/90 leading-relaxed">
            On Quick Commerce, we are expected to pay a commission (typically 20–30% of the selling price) to the
            platform, which means lower margins per unit. However, these platforms drive significantly higher volumes
            due to strong discovery and impulse purchases.
          </p>
        </div>
        <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-6">
          <Globe className="h-5 w-5 text-blue-300 mb-3" />
          <div className="text-[17px] font-semibold">D2C</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
            Our own Bombay Shaving Company website
          </div>
          <p className="mt-4 text-sm text-foreground/90 leading-relaxed">
            On D2C, we don't pay any intermediary, so margins are higher and we have full control over pricing and
            discounts. However, we will have to work harder and invest in marketing to bring customers to our website,
            which limits volume.
          </p>
        </div>
      </div>

      <p className="mt-8 text-[15px] text-foreground/90 leading-[1.7]">
        The core trade-off here is Margins vs Volume.
      </p>

      <div className="mt-6 rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-primary text-[11px] uppercase tracking-[0.14em]">
              <th className="text-left font-medium px-5 py-3">Factor</th>
              <th className="text-left font-medium px-5 py-3">Quick Commerce</th>
              <th className="text-left font-medium px-5 py-3">D2C</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Margin", "Lower", "Higher"],
              ["Volume", "Higher", "Lower"],
              ["Control", "Low", "High"],
            ].map((row, i) => (
              <tr
                key={i}
                style={{ backgroundColor: i % 2 === 0 ? "#1C1C1C" : "#222222" }}
              >
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

      <div className="mt-10 pt-6 border-t border-primary text-center">
        <p className="text-lg sm:text-xl font-bold text-foreground leading-snug">
          Key Insight: We use both channels. The goal is not to choose one, but to balance them to maximize total
          profit.
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