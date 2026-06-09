import { useEffect, useState } from "react";
import { fmtINRShort, type MonthData } from "@/lib/simulation";
import { buildHeadline, buildSubtext, getPerformanceTier } from "./final-shared";

export function FinalMoment({
  name,
  months,
  onContinue,
}: {
  name: string;
  months: MonthData[];
  onContinue: () => void;
}) {
  const totalProfit = months
    .filter((m) => m && m.month >= 1)
    .reduce((s, m) => s + (m.totalProfit ?? 0), 0);
  const tier = getPerformanceTier(totalProfit);

  // Animated count-up — same easing as original final results.
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(totalProfit * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalProfit]);

  return (
    <div
      className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-5 sm:px-8 py-12"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="mx-auto max-w-[600px] w-full text-center">
        {/* EBITDA reveal */}
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Your 5-Month EBITDA
        </div>
        <div className="mt-4 text-[48px] sm:text-[56px] font-bold tracking-tight font-mono text-foreground leading-none">
          {fmtINRShort(shown)}
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          across 3 cities, 3 products, 5 months of decisions
        </div>

        {/* Headline + subtext */}
        <h1 className="mt-10 text-[24px] sm:text-[28px] font-semibold text-foreground leading-snug">
          {buildHeadline(name, tier)}
        </h1>
        <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
          {buildSubtext(tier)}
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition w-full sm:w-[320px]"
          >
            See What You've Earned →
          </button>
          <p className="mt-3 text-[12px] text-muted-foreground">
            Certificate · Skills · Resume line · LinkedIn post
          </p>
        </div>
      </div>
    </div>
  );
}