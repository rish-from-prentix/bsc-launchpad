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
} from "./shared";
import { ARCH_TASKS, SITE_LAYERS } from "./arch-data";

const META = ARCH_TASKS[1];

export function ArchTaskTwo({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [layers, setLayers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);

  const allFilled =
    SITE_LAYERS.every((l) => (layers[l.layer] || "").trim().length >= 10) &&
    summary.trim().length >= 40;

  async function submit() {
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: META.title,
          taskBrief: META.deliverable,
          submission: [
            ...SITE_LAYERS.map((l) => ({ label: l.layer, value: layers[l.layer] || "" })),
            { label: "Key opportunities and constraints", value: summary },
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
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Mon 09:00 · voice msg">
        The site has <strong>black cotton soil</strong>, flag it in your analysis, it will hit substructure budget hard. The three neem trees are under a TPO order. <strong>Touch them and we lose the project.</strong> And look carefully at DP Road noise, 68 to 72 dB(A). That is relevant to where you put the library.
      </VoiceNote>

      <DataCard label="Site Data, Survey No. 147, Aundh, Pune">
        <p><strong>Area:</strong> 4,856 sq.m. Rectangular 68m x 71m, chamfered SW corner.</p>
        <p><strong>Boundaries:</strong> East, DP Road (18m, high footfall). North, Residential lane (6m). West, Public park. South, Commercial strip.</p>
        <p><strong>Ground:</strong> 0.4m fall NE to SW. Black cotton soil (raft foundation required). Water table 4.5m.</p>
        <p><strong>Existing:</strong> Shed 80 sq.m. NW (demolish). 3 protected neem trees on W boundary, 8m canopy, TPO order.</p>
        <p><strong>Planning:</strong> R2 + Institutional. FAR 2.0. Coverage 40%. Height 15m. Setbacks: E 6m, W 3m, sides 3m.</p>
        <p><strong>Climate:</strong> Summer 38 to 42°C. Monsoon 580mm. DP Road noise 68 to 72 dB(A). PV potential 6.2 kWh/sq.m./day.</p>
      </DataCard>

      <SectionHeader hint="One design implication per layer. Recommended: 2 to 4 concise lines.">
        5 Layer Analysis
      </SectionHeader>
      <div className="space-y-3">
        {SITE_LAYERS.map((l) => (
          <div key={l.layer} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-sm font-semibold text-foreground">{l.layer}</div>
              <div className="text-xs text-muted-foreground">{l.focus}</div>
            </div>
            <textarea
              rows={3}
              value={layers[l.layer] || ""}
              onChange={(e) => setLayers({ ...layers, [l.layer]: e.target.value })}
              placeholder={l.placeholder}
              className="mt-2 w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}
      </div>

      <SectionHeader>3 to 5 Key Design Opportunities and Constraints</SectionHeader>
      <textarea
        rows={5}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder={"1. Black cotton soil, raft foundation, likely upper substructure rate\n2. Three neem trees on west = design asset, outdoor space should orient toward them\n3. DP Road noise, library must be placed away from east façade..."}
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
          label="Submit Site Analysis Board"
          onSubmit={submit}
          disabled={!allFilled}
          loading={loading}
          hint={allFilled ? "Mentor will review and score." : "Fill all five layers and the summary."}
        />
      )}
    </TaskFrame>
  );
}