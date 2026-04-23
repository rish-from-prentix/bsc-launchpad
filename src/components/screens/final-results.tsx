import { useEffect, useState } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { fmtINR, fmtINRShort, LINKEDIN_POST_BODY, type MonthData } from "@/lib/simulation";

export function FinalResults({
  name,
  months,
}: {
  name: string;
  months: MonthData[]; // months[1..5]
}) {
  const submitted = months.filter((m) => m && m.month >= 1);
  const totalProfit = submitted.reduce((s, m) => s + (m.totalProfit ?? 0), 0);
  const profits = submitted.map((m) => m.totalProfit ?? 0);

  // Avg MoM growth
  const growths: number[] = [];
  for (let i = 1; i < profits.length; i++) {
    const prev = profits[i - 1];
    if (prev > 0) growths.push((profits[i] - prev) / prev);
  }
  const avgGrowth = growths.length ? (growths.reduce((a, b) => a + b, 0) / growths.length) * 100 : 0;

  // Animate count-up
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const target = totalProfit;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalProfit]);

  let headline = `Solid internship, ${name}. You made smart calls and learned from the tough ones.`;
  if (totalProfit >= 5000000) headline = `You're a natural, ${name}. Shantanu would be proud.`;
  else if (totalProfit < 2500000) headline = `Tough run, ${name}. But that's how you learn. Every decision taught you something.`;

  const [copied, setCopied] = useState(false);
  function copyPost() {
    navigator.clipboard.writeText(LINKEDIN_POST_BODY).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  }
  function shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://prentix.ai")}&summary=${encodeURIComponent(LINKEDIN_POST_BODY)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="mx-auto max-w-[680px] px-5 sm:px-8 py-12 sm:py-16"
      style={{ animation: "fadeSlide 280ms ease-out" }}
    >
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Internship Wrap
        </div>
        <div className="mt-4 text-[44px] sm:text-[56px] font-bold tracking-tight font-mono text-foreground">
          {fmtINRShort(shown)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Total EBITDA across 5 months ({fmtINR(totalProfit)})
        </div>
        <div className="mt-1 text-[12px] text-muted-foreground">
          Average month-on-month growth:{" "}
          <span className={`font-mono ${avgGrowth >= 0 ? "text-[color:var(--success)]" : "text-[color:var(--danger)]"}`}>
            {avgGrowth >= 0 ? "+" : ""}{avgGrowth.toFixed(1)}%
          </span>
        </div>

        <h1 className="mt-8 text-[22px] sm:text-[26px] font-semibold text-foreground leading-snug">
          {headline}
        </h1>
      </div>

      {/* LinkedIn preview card */}
      <div className="mt-10 rounded-xl bg-white text-neutral-900 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold text-neutral-600">
            {(name || "Y").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold truncate">{name || "Your Name"}</div>
            <div className="text-[11px] text-neutral-500 flex items-center gap-2">
              Growth & Business Ops Intern · Just now
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            LinkedIn
          </div>
        </div>
        <div className="p-4 text-[13.5px] leading-[1.6] text-neutral-800 whitespace-pre-wrap">
          {LINKEDIN_POST_BODY}
        </div>
        <div className="px-4 pb-4 pt-1 border-t border-neutral-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            <span>Featured</span>
            <div className="h-3 w-px bg-neutral-300" />
            <span className="font-semibold text-neutral-700">Bombay Shaving Co.</span>
            <span>·</span>
            <span className="font-semibold text-neutral-700">Prentix</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={copyPost}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:bg-card transition justify-center"
        >
          {copied ? <Check className="h-4 w-4 text-[color:var(--success)]" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy LinkedIn Post"}
        </button>
        <button
          onClick={shareLinkedIn}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition justify-center"
        >
          Share on LinkedIn <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2 opacity-70">
        <BrandMark brand="prentix" height={18} />
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          A Prentix virtual internship experience
        </span>
      </div>
    </div>
  );
}