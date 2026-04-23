import { ArrowRight, Check, Lock } from "lucide-react";

type Primer = {
  id: number;
  title: string;
  desc: string;
  completed: boolean;
};

export function PrimersOverview({
  name,
  primers,
  onStart,
}: {
  name: string;
  primers: Primer[];
  onStart: (idx: number) => void;
}) {
  const nextIdx = primers.findIndex((p) => !p.completed);
  const activeIdx = nextIdx === -1 ? 2 : nextIdx;
  const allDone = primers.every((p) => p.completed);

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-12 sm:py-16" style={{ animation: "fadeSlide 250ms ease-out" }}>
      <div className="flex items-center gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 max-w-[40px] rounded-full transition-colors"
            style={{
              backgroundColor: i <= activeIdx ? "var(--primary)" : "var(--border)",
            }}
          />
        ))}
        <span className="ml-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Primer {Math.min(activeIdx + 1, 3)} of 3
        </span>
      </div>

      <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight leading-tight">Welcome, {name}.</h1>
      <p className="mt-3 text-[15px] text-muted-foreground max-w-[560px] leading-relaxed">
        To excel in this role, you’ll need a strong grasp of three core concepts. <br />
        These primers will help you internalize the fundamentals required to succeed as a Growth & Business Ops Intern.
        Each one ends with a short quiz to test your understanding.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {primers.map((p, idx) => {
          const isLocked = !p.completed && idx > nextIdx && nextIdx !== -1;
          const isNext = idx === nextIdx;
          return (
            <button
              key={p.id}
              onClick={() => !isLocked && onStart(idx)}
              disabled={isLocked}
              className={`group text-left rounded-xl border bg-card p-6 transition-all ${
                isLocked
                  ? "border-border opacity-50 cursor-not-allowed"
                  : "border-border hover:border-primary hover:-translate-y-0.5"
              } ${isNext ? "ring-1 ring-primary/30" : ""}`}
              style={{
                boxShadow: isLocked ? "none" : "0 4px 24px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold font-mono ${
                    p.completed
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary/40 text-primary bg-primary/5"
                  }`}
                >
                  {String(p.id).padStart(2, "0")}
                </div>
                {p.completed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-primary">
                    <Check className="h-3 w-3" /> Completed
                  </span>
                ) : isLocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                ) : (
                  <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Not started</span>
                )}
              </div>
              <h3 className="text-[17px] font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-10">
        <button
          onClick={() => onStart(allDone ? 0 : nextIdx)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {allDone ? "Review primers" : `Start Primer ${Math.min(activeIdx + 1, 3)}`}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
