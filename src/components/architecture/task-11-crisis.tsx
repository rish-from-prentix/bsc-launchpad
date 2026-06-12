import { useState } from "react";
import { Shuffle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader, HelperText, SubmitBar, FeedbackPanel, MentorPrinciple } from "./shared";
import { ARCH_TASKS, CRISIS_SCENARIOS, type CrisisScenario } from "./arch-data";

const META = ARCH_TASKS[10];

const SECTIONS = [
  { key: "issue", label: "1. Issue Summary", placeholder: "What has changed and what is the specific impact on the current design?" },
  { key: "mod", label: "2. Proposed Modification", placeholder: "What specifically will you change in the drawings, specifications or schedule? Be precise." },
  { key: "impact", label: "3. Design Impact", placeholder: "What is the consequence of this modification? What are you trading off?" },
  { key: "timeline", label: "4. Implementation Timeline", placeholder: "When will revised drawings be ready? What is the critical path impact on the 12 week planning submission?" },
] as const;

export function ArchTaskEleven({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [scenario, setScenario] = useState<CrisisScenario | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);
  const [done, setDone] = useState(false);

  function assign() {
    const s = CRISIS_SCENARIOS[Math.floor(Math.random() * CRISIS_SCENARIOS.length)];
    setScenario(s);
  }

  const allFilled = SECTIONS.every((s) => (values[s.key] || "").trim().length >= 15);

  async function submit() {
    if (!scenario) return;
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: `${META.title}: ${scenario.title}`,
          taskBrief: scenario.body,
          submission: SECTIONS.map((s) => ({ label: s.label, value: values[s.key] || "" })),
        },
      });
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <TaskFrame>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-3xl font-semibold text-primary">Internship Complete</h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            You have worked through all 11 tasks of the Community Learning Hub project, from client brief to crisis resolution. This is the full architecture design workflow.
          </p>
          <div className="mt-6 text-xs font-mono text-muted-foreground/70">
            Community Learning Hub · Survey 147, Aundh, Pune · Meridian Architecture Studio · CLHA-2024
          </div>
        </div>
      </TaskFrame>
    );
  }

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <MentorPrinciple>
        Architects sell ideas, not drawings. The ability to communicate a design rationale clearly and hold it under challenge is as important as the design itself.
      </MentorPrinciple>
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Fri 07:00 · urgent">
        Your scenario is assigned. Memo by end of business today. Four sections: issue summary, proposed modification, design impact, implementation timeline. Be direct. <strong>Do not tell me what went wrong, tell me how you are fixing it.</strong>
      </VoiceNote>

      {!scenario ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Click below to receive your randomly assigned crisis scenario.
          </p>
          <button
            type="button"
            onClick={assign}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Shuffle className="h-4 w-4" />
            Assign My Scenario
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-destructive font-semibold">
              {scenario.title}
            </div>
            <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{scenario.body}</p>
          </div>

          <SectionHeader>Your Redesign Memo</SectionHeader>
          <p className="text-xs text-muted-foreground">
            <b className="text-foreground">To:</b> Kiran Mehta, Principal Architect, Meridian Architecture Studio
          </p>
          {SECTIONS.map((s) => (
            <div key={s.key}>
              <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                {s.label}
              </label>
              <textarea
                rows={3}
                value={values[s.key] || ""}
                onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                placeholder={s.placeholder}
                className="mt-1.5 w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          ))}
          <HelperText>Focus on reasoning, not summaries.</HelperText>

          {result ? (
            <FeedbackPanel
              passed={result.overall >= 6}
              score={result.overall}
              feedback={result.feedback}
              onRetry={() => setResult(null)}
              onContinue={() => {
                setDone(true);
                onComplete();
              }}
            />
          ) : (
            <SubmitBar
              label="Submit Final Memo, Complete Internship"
              onSubmit={submit}
              disabled={!allFilled}
              loading={loading}
              hint={allFilled ? "Mentor will review and score." : "Complete all four sections."}
            />
          )}
        </>
      )}
    </TaskFrame>
  );
}