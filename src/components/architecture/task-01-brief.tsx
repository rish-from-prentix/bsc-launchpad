import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  DataCard,
  SectionHeader,
  HelperText,
  SubmitBar,
  FeedbackPanel,
  MentorPrinciple,
} from "./shared";
import { ARCH_TASKS, PERSONAS } from "./arch-data";

const META = ARCH_TASKS[0];

const FIELDS = [
  { key: "musts", label: "Must-have requirements", placeholder: "What the client has stated as non-negotiable..." },
  { key: "nice", label: "Nice-to-have features", placeholder: "Desirable but cuttable if needed..." },
  { key: "budget", label: "Budget risks", placeholder: "Where might costs overrun? What's excluded from 8.1cr?" },
  { key: "unknowns", label: "Unknowns to clarify", placeholder: "What information is missing? What must you ask the client?" },
] as const;

export function ArchTaskOne({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);

  const allFilled = FIELDS.every((f) => (values[f.key] || "").trim().length >= 8);

  async function submit() {
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: META.title,
          taskBrief: META.deliverable,
          submission: FIELDS.map((f) => ({ label: f.label, value: values[f.key] || "" })),
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
      <MentorPrinciple>
        Architects do not start with software. They start by understanding people, place and constraints. Every design decision in the following weeks must trace back to what is learned this week.
      </MentorPrinciple>
      <VoiceNote initials="PN" name="Priya Nair" role="Deputy Commissioner · PMC" timestamp="Mon 08:12 · email">
        Good morning. Budget is <strong>firm at INR 8.1 crore</strong>, fees, furniture and IT excluded. The Corporation will not revisit this. Planning submission in 12 weeks. The café <strong>must be NGO operated</strong> and the entrance must face DP Road. Confirm you have understood all constraints before we proceed.
      </VoiceNote>

      <DataCard label="Client Brief Extract, Priya Nair, PMC">
        <p><strong>Programme:</strong> Library (8,000 volumes, 40 reading seats), Co-working (60 workstations), Hall (300 persons, theatre), Café (30 covers, NGO operated), Outdoor gathering space, Accessible toilets, Storage + plant room.</p>
        <p><strong>Budget:</strong> INR 8.1 crore firm (fees, furniture, IT excluded).</p>
        <p><strong>Timeline:</strong> Planning in 12 weeks. Construction Q1 2026. Completion Q4 2026.</p>
        <p><strong>Constraints:</strong> Max 3 storeys, min 20% soft landscaping, NBC 2016, entrance faces DP Road (east), solar panels not visible from street.</p>
      </DataCard>

      <SectionHeader>User Personas</SectionHeader>
      <div className="grid sm:grid-cols-2 gap-3">
        {PERSONAS.map((p) => (
          <div key={p.name} className="rounded-lg border border-border bg-card p-4">
            <div className="text-sm font-semibold text-foreground">{p.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{p.profile}</div>
            <div className="text-[13px] text-foreground/85 mt-2">{p.need}</div>
          </div>
        ))}
      </div>

      <SectionHeader hint="Capture your decoding of the brief. Stay concise: 2 to 4 lines per cell.">
        Brief Decoding Matrix
      </SectionHeader>
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key} className="rounded-lg border border-border bg-card p-4">
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              {f.label}
            </label>
            <textarea
              rows={3}
              value={values[f.key] || ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="mt-2 w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <HelperText>Focus on reasoning, not summaries.</HelperText>
          </div>
        ))}
      </div>

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
          label="Submit Brief Decoding Sheet"
          onSubmit={submit}
          disabled={!allFilled}
          loading={loading}
          hint={allFilled ? "Mentor will review and score." : "Fill every cell to submit."}
        />
      )}
    </TaskFrame>
  );
}