import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import { cn } from "@/lib/utils";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  SectionHeader,
  HelperText,
  SubmitBar,
  FeedbackPanel,
} from "./shared";
import { ARCH_TASKS, CONCEPT_OPTIONS } from "./arch-data";

const META = ARCH_TASKS[3];

export function ArchTaskFour({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [selected, setSelected] = useState<string | null>(null);
  const [statement, setStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);

  const sel = CONCEPT_OPTIONS.find((c) => c.id === selected);
  const ready = !!selected && statement.trim().split(/\s+/).length >= 25;

  async function submit() {
    if (!sel) return;
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: META.title,
          taskBrief: META.deliverable,
          submission: [
            { label: "Selected concept", value: `${sel.id}: ${sel.title}` },
            { label: "Concept statement (50 words)", value: statement },
          ],
        },
      });
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TaskFrame>
      <TaskHeader
        week={META.week}
        taskNumber={META.index}
        duration={META.duration}
        title={META.title}
        deliverable={META.deliverable}
      />
      <VoiceNote initials="PN" name="Priya Nair" role="Client · PMC" timestamp="Wed 11:00 · voice msg">
        The Corporation wants something that <strong>feels welcoming, not institutional</strong>. This is a community building, not a government office. The ward councillors have asked that it <strong>does not look like a box.</strong> Budget is firm, but we are not asking for cheap.
      </VoiceNote>

      <SectionHeader hint="Each option commits to a design strategy. You will be assessed on how consistently subsequent drawings follow this direction.">
        Select One Concept Direction
      </SectionHeader>
      <div className="grid sm:grid-cols-2 gap-3">
        {CONCEPT_OPTIONS.map((c) => {
          const isSel = selected === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelected(c.id)}
              className={cn(
                "text-left rounded-xl border bg-card p-4 transition-all",
                isSel
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
                  Option {c.id}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {c.tagline}
                </span>
              </div>
              <h4 className="mt-2 text-lg font-semibold text-foreground">{c.title}</h4>
              <p className="mt-2 text-[13px] text-foreground/85 leading-relaxed">{c.description}</p>
              <p className="mt-3 text-xs text-destructive/90">Risks: {c.risks}</p>
            </button>
          );
        })}
      </div>

      {sel && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
          <div className="text-[10px] uppercase tracking-[0.22em] text-destructive font-semibold">
            Risks You Must Manage
          </div>
          <p className="mt-1 text-sm text-foreground/85">{sel.risks}</p>
        </div>
      )}

      <SectionHeader>Concept Statement (50 words)</SectionHeader>
      <textarea
        rows={4}
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="Cite specific data from Week 1 analysis. 'Feels right' is not a justification. Explain why this direction is most appropriate for brief, site and personas..."
        className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <HelperText>Support your recommendation with evidence.</HelperText>

      {result ? (
        <FeedbackPanel
          passed={result.overall >= 6}
          score={result.overall}
          feedback={result.feedback}
          onRetry={() => setResult(null)}
          onContinue={onComplete}
        />
      ) : (
        <SubmitBar
          label="Submit Concept Direction"
          onSubmit={submit}
          disabled={!ready}
          loading={loading}
          hint={ready ? "Mentor will review and score." : "Pick an option and write at least 25 words."}
        />
      )}
    </TaskFrame>
  );
}