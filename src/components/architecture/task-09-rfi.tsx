import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader, DataCard, SubmitBar } from "./shared";
import { ARCH_TASKS, RFI_QUESTIONS } from "./arch-data";

const META = ARCH_TASKS[8];

export function ArchTaskNine({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, "a" | "b" | "c">>({});
  const allAnswered = RFI_QUESTIONS.every((q) => answers[q.id]);

  return (
    <TaskFrame>
      <TaskHeader
        week={META.week}
        taskNumber={META.index}
        duration={META.duration}
        title={META.title}
        deliverable={META.deliverable}
        rightBadge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/50 bg-destructive/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-destructive font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
            24hr Deadline
          </span>
        }
      />
      <VoiceNote tone="urgent" initials="DA" name="Deepak Anand" role="Site Manager · Subramanian Construction" timestamp="Wed 07:00 · URGENT">
        <b>RFI-004.</b> Two questions on the external wall detail. Brickwork gang is on site from tomorrow. <b>Response required within 24 hours to avoid delay costs.</b>
      </VoiceNote>
      <DataCard label="RFI-004, Subramanian Construction">
        Two questions to resolve. Specifications must reference NBC 2016 minimums and be enforceable on a contractor submittal.
      </DataCard>

      {RFI_QUESTIONS.map((q) => {
        const sel = answers[q.id];
        return (
          <div key={q.id} className="space-y-3">
            <SectionHeader>{q.title}</SectionHeader>
            <p className="text-sm text-muted-foreground">{q.body}</p>
            <div className="space-y-2">
              {q.options.map((o) => {
                const isSel = sel === o.id;
                const isCorrect = o.id === q.correct;
                const showResult = !!sel && isSel;
                let cls = "border-border hover:border-primary/40";
                if (showResult && isCorrect) cls = "border-[oklch(0.72_0.14_155)] ring-2 ring-[oklch(0.72_0.14_155_/_0.3)]";
                else if (showResult && !isCorrect) cls = "border-destructive ring-2 ring-destructive/30";
                else if (sel && !isSel && isCorrect) cls = "border-[oklch(0.72_0.14_155_/_0.5)]";
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                    className={cn("w-full text-left rounded-lg border bg-card p-3 flex items-start gap-3 transition", cls)}
                  >
                    <span className="mt-0.5 text-xs font-mono font-semibold text-primary uppercase">{o.id}</span>
                    <span className="flex-1 text-sm text-foreground/90">{o.text}</span>
                    {showResult && (isCorrect ? <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.14_155)]" /> : <XCircle className="h-4 w-4 text-destructive" />)}
                  </button>
                );
              })}
            </div>
            {sel && (
              <div className="text-xs text-muted-foreground italic px-1">
                {sel === q.correct ? "Correct. " : "Reconsider. "}
                {q.rationale}
              </div>
            )}
          </div>
        );
      })}

      <SubmitBar
        label="Submit RFI Response"
        onSubmit={onComplete}
        disabled={!allAnswered}
        hint={allAnswered ? "RFI responses logged." : "Answer both questions."}
      />
    </TaskFrame>
  );
}