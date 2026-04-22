import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function ResultsScreen({
  name,
  score,
  total,
  onRedo,
  onProceed,
}: {
  name: string;
  score: number;
  total: number;
  onRedo: () => void;
  onProceed: () => void;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = score / total;
  const offset = circumference * (1 - progress);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setAnimatedScore(Math.round(p * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const messages: Record<number, string> = {
    0: "Could do better. Give it another shot.",
    1: `You're getting there, ${name}.`,
    2: `Not bad at all, ${name}.`,
    3: `Well done, ${name}.`,
    4: `You're a rockstar, ${name}. ⚡`,
  };

  return (
    <div
      className="mx-auto max-w-xl px-5 sm:px-8 py-16 sm:py-20 text-center"
      style={{ animation: "fadeSlide 280ms ease-out" }}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        Onboarding Complete
      </div>
      <h1 className="mt-3 text-[28px] sm:text-[32px] font-bold tracking-tight">
        Your Knowledge Score
      </h1>

      <div className="mt-10 mx-auto relative" style={{ width: 180, height: 180 }}>
        <svg width={180} height={180} className="-rotate-90">
          <circle
            cx={90}
            cy={90}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={8}
          />
          <circle
            cx={90}
            cy={90}
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1100ms ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold tracking-tight font-mono">
            {animatedScore}
            <span className="text-muted-foreground text-2xl">/{total}</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mt-1">
            Correct
          </div>
        </div>
      </div>

      <p className="mt-8 text-lg text-foreground font-medium">
        {messages[score] ?? messages[0]}
      </p>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2 opacity-70">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Your progress is tracked by
          </span>
          <BrandMark brand="prentix" height={16} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRedo}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground hover:bg-card transition w-full sm:w-auto justify-center"
          >
            <RotateCcw className="h-4 w-4" /> Redo Quiz
          </button>
          <button
            onClick={onProceed}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition w-full sm:w-auto justify-center"
            style={{ animation: "softPulse 2.4s ease-in-out infinite" }}
          >
            Proceed to Internship <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}