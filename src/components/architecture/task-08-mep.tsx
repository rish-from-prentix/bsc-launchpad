import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader, DataCard, SubmitBar } from "./shared";
import { ARCH_TASKS, MEP_CONFLICTS } from "./arch-data";

const META = ARCH_TASKS[7];

export function ArchTaskEight({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, "a" | "b" | "c">>({});

  const allAnswered = MEP_CONFLICTS.every((c) => answers[c.id]);

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <VoiceNote initials="SR" name="Smita Rao" role="MEP Engineer · Rao Building Services" timestamp="Mon 08:45 · voice msg">
        I have logged three conflicts that <strong>need an architect decision before I can issue drawings</strong>. If these are not resolved, the contractor will be building to conflicting information.
      </VoiceNote>

      {MEP_CONFLICTS.map((c) => {
        const sel = answers[c.id];
        return (
          <div key={c.id} className="space-y-3">
            <SectionHeader>Conflict {c.id}: {c.title}</SectionHeader>
            <DataCard label="MEP Conflict Report">{c.report}</DataCard>
            <div className="space-y-2">
              {c.options.map((o) => {
                const isSel = sel === o.id;
                const isCorrect = o.id === c.correct;
                const showResult = !!sel && isSel;
                let cls = "border-border hover:border-primary/40";
                if (showResult && isCorrect) cls = "border-[oklch(0.72_0.14_155)] ring-2 ring-[oklch(0.72_0.14_155_/_0.3)]";
                else if (showResult && !isCorrect) cls = "border-destructive ring-2 ring-destructive/30";
                else if (sel && !isSel && isCorrect) cls = "border-[oklch(0.72_0.14_155_/_0.5)]";
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setAnswers({ ...answers, [c.id]: o.id })}
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
                {sel === c.correct ? "Correct. " : "Reconsider. "}
                {c.rationale}
              </div>
            )}
          </div>
        );
      })}

      <SubmitBar
        label="Submit MEP Decisions"
        onSubmit={onComplete}
        disabled={!allAnswered}
        hint={allAnswered ? "Decisions logged." : "Answer all three conflicts."}
      />
    </TaskFrame>
  );
}