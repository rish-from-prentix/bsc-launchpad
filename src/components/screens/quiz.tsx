import { ReactNode, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { Breadcrumb, StepBar } from "./primer-shared";

export type QuizQuestion = {
  prompt: ReactNode;
  note?: ReactNode;
  options: string[];
  correctIndex: number;
  explanation: ReactNode;
};

export function Quiz({
  title,
  step,
  questions,
  onComplete,
  primerNumber,
  totalPrimers = 3,
  nextLabel = "Continue",
}: {
  title: string;
  step: 0 | 1 | 2;
  questions: QuizQuestion[];
  onComplete: (correctCount: number) => void;
  primerNumber: number;
  totalPrimers?: number;
  nextLabel?: string;
}) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[qIdx];

  function submit() {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === q.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (qIdx + 1 < questions.length) {
      setQIdx((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div
        className="mx-auto max-w-xl px-5 sm:px-8 py-20 text-center"
        style={{ animation: "fadeSlide 250ms ease-out" }}
      >
        <div className="mx-auto h-20 w-20 rounded-full border-2 border-primary flex items-center justify-center mb-6">
          <Check className="h-9 w-9 text-primary" strokeWidth={2.5} />
        </div>
        <h2 className="text-[22px] font-semibold">
          Primer {primerNumber} Complete
        </h2>
        <p className="mt-2 text-muted-foreground">
          You've got the concept.{" "}
          {primerNumber < totalPrimers
            ? "On to the next one."
            : "Let's see how you did."}
        </p>
        <button
          onClick={() => onComplete(correctCount)}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          {nextLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14"
      style={{ animation: "fadeSlide 250ms ease-out" }}
    >
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb>Knowledge Check — {title}</Breadcrumb>
        <StepBar active={step} />
      </div>

      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Question {qIdx + 1} of {questions.length}
      </div>
      <h2 className="mt-3 text-[20px] sm:text-[22px] font-semibold leading-snug text-foreground">
        {q.prompt}
      </h2>

      {q.note && (
        <div className="mt-4 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground leading-relaxed">
          {q.note}
        </div>
      )}

      <div className="mt-7 grid gap-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === q.correctIndex;
          let cls =
            "border-border hover:border-primary/60 hover:bg-primary/5";
          if (submitted) {
            if (isCorrect)
              cls =
                "border-[color:var(--success)] bg-[color:var(--success)]/10";
            else if (isSelected)
              cls =
                "border-[color:var(--danger)] bg-[color:var(--danger)]/10";
            else cls = "border-border opacity-60";
          } else if (isSelected) {
            cls = "border-primary bg-primary/10";
          }
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={`w-full text-left rounded-lg border bg-card px-5 py-4 text-[15px] font-medium text-foreground transition-all flex items-center justify-between gap-3 ${cls}`}
            >
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span>{opt}</span>
              </span>
              {submitted && isCorrect && (
                <Check className="h-4 w-4 text-[color:var(--success)]" />
              )}
              {submitted && isSelected && !isCorrect && (
                <X className="h-4 w-4 text-[color:var(--danger)]" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={submit}
          disabled={selected === null}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Confirm Answer <ArrowRight className="h-4 w-4" />
        </button>
      )}

      {submitted && (
        <>
          <div
            className="mt-8 rounded-xl border border-border bg-card overflow-hidden"
            style={{
              animation: "slideDown 280ms ease-out",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div className="flex">
              <div className="w-1 bg-primary" />
              <div className="flex-1 p-6">
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
                  Here's how to work this out
                </div>
                <div className="text-sm text-foreground/90 leading-[1.7] space-y-2 font-mono">
                  {q.explanation}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={next}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            {qIdx + 1 < questions.length ? "Next Question" : "Continue"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}