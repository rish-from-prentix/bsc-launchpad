import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, SectionHeader, HelperText, SubmitBar, FeedbackPanel } from "./shared";
import { ARCH_TASKS, SUSTAINABILITY_OPTIONS } from "./arch-data";

const META = ARCH_TASKS[6];

export function ArchTaskSeven({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [rationale, setRationale] = useState<Record<string, string>>({});
  const [justification, setJustification] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);

  const count = Object.values(picked).filter(Boolean).length;
  const ready = count === 3 && justification.trim().split(/\s+/).length >= 60;

  async function submit() {
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: META.title,
          taskBrief: META.deliverable,
          submission: [
            {
              label: "Selected interventions",
              value: SUSTAINABILITY_OPTIONS.filter((o) => picked[o.id]).map((o) => `${o.name}: ${rationale[o.id] || ""}`).join("\n"),
            },
            { label: "100 word justification", value: justification },
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
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <div className="rounded-xl border border-[oklch(0.78_0.14_75_/_0.4)] bg-[oklch(0.78_0.14_75_/_0.07)] px-4 py-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.78_0.14_75)] font-semibold">Budget Update</div>
        <p className="mt-1 text-sm text-foreground/90">
          Following cost plan reconciliation, sustainability budget reduced by 15%. <b>Select exactly 3 interventions.</b> Nashik removed passive cooling at this stage and energy bills ran 27% over for 5 years. Do not repeat that trade off silently.
        </p>
      </div>

      <SectionHeader hint={`${count} / 3 selected`}>Sustainability Matrix</SectionHeader>
      <div className="space-y-2">
        {SUSTAINABILITY_OPTIONS.map((o) => {
          const isPicked = !!picked[o.id];
          return (
            <div key={o.id} className={cn("rounded-lg border bg-card p-3", isPicked ? "border-primary/50" : "border-border")}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPicked}
                  onChange={(e) => setPicked({ ...picked, [o.id]: e.target.checked })}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 text-sm">
                    <span className="font-semibold text-foreground">{o.name}</span>
                    <span className="text-xs text-muted-foreground">Upfront: {o.upfront}</span>
                    <span className="text-xs text-muted-foreground">Impact: {o.impact}</span>
                    <span className="text-xs text-muted-foreground">Maintenance: {o.maintenance}</span>
                  </div>
                  <input
                    type="text"
                    value={rationale[o.id] || ""}
                    onChange={(e) => setRationale({ ...rationale, [o.id]: e.target.value })}
                    placeholder="Justify selection or rejection..."
                    className="mt-2 w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </label>
            </div>
          );
        })}
      </div>

      <SectionHeader>100 Word Justification</SectionHeader>
      <textarea
        rows={5}
        value={justification}
        onChange={(e) => setJustification(e.target.value)}
        placeholder="Explain why you selected these 3 and what trade offs you accepted in rejecting the others. Cite site data..."
        className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
          label="Submit Sustainability Matrix"
          onSubmit={submit}
          disabled={!ready}
          loading={loading}
          hint={count === 3 ? "Mentor will review and score." : "Select exactly 3 interventions and write 60+ words."}
        />
      )}
    </TaskFrame>
  );
}