import { useState } from "react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader, HelperText, SubmitBar, MentorPrinciple } from "./shared";
import { ARCH_TASKS, DEFECT_CARDS, POE_FINDINGS } from "./arch-data";

const META = ARCH_TASKS[9];
type Verdict = "clear" | "minor" | "critical";

export function ArchTaskTen({ onComplete }: { onComplete: () => void }) {
  const [findings, setFindings] = useState<Record<number, string>>({});
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({});
  const [note, setNote] = useState("");

  const reviewed = Object.keys(verdicts).length;
  const clear = Object.values(verdicts).filter((v) => v === "clear").length;
  const critical = Object.values(verdicts).filter((v) => v === "critical").length;
  const ready = reviewed === DEFECT_CARDS.length && note.trim().length >= 80;

  const tone: Record<Verdict, string> = {
    clear: "border-[oklch(0.72_0.14_155_/_0.5)] bg-[oklch(0.72_0.14_155_/_0.07)]",
    minor: "border-[oklch(0.78_0.14_75_/_0.5)] bg-[oklch(0.78_0.14_75_/_0.07)]",
    critical: "border-destructive/50 bg-destructive/5",
  };

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <MentorPrinciple>
        A post occupancy evaluation reveals failures the design team could not see in time. A pre construction audit runs the same checklist in advance, while changes cost nothing.
      </MentorPrinciple>
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Thu 08:34 · voice msg">
        Before we send <strong>anything to the contractor</strong>, I want you to run a full sweep. Pull up the Nashik POE. Go through every failure they had and <strong>check our drawings against each one</strong>. On site, <strong>every mistake costs ten times more</strong> to fix.
      </VoiceNote>

      <SectionHeader>Nashik POE Findings, Your Design Checks</SectionHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">POE Finding</th>
              <th className="text-left px-3 py-2">Root Cause</th>
              <th className="text-left px-3 py-2">Check in Your Scheme</th>
            </tr>
          </thead>
          <tbody>
            {POE_FINDINGS.map((f, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-3 py-2 text-foreground/90">{f.finding}</td>
                <td className="px-3 py-2 text-muted-foreground">{f.root}</td>
                <td className="px-3 py-2 text-foreground/85">{f.check}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader hint={`${reviewed} of ${DEFECT_CARDS.length} reviewed. ${clear} clear, ${critical} critical.`}>
        Defect Register
      </SectionHeader>
      <div className="space-y-3">
        {DEFECT_CARDS.map((d) => {
          const v = verdicts[d.id];
          return (
            <div key={d.id} className={cn("rounded-xl border bg-card p-4", v ? tone[v] : "border-border")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-primary">{d.code}</span>
                  <h4 className="text-sm font-semibold text-foreground">{d.title}</h4>
                  <div className="text-[11px] text-muted-foreground">{d.location}</div>
                </div>
                {v && (
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold">
                    {v}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[13px] text-foreground/85">{d.body}</p>
              <label className="block mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                {d.fieldLabel}
              </label>
              <textarea
                rows={2}
                value={findings[d.id] || ""}
                onChange={(e) => setFindings({ ...findings, [d.id]: e.target.value })}
                placeholder={d.placeholder}
                className="mt-1.5 w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {(["clear", "minor", "critical"] as Verdict[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVerdicts({ ...verdicts, [d.id]: opt })}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
                      v === opt ? tone[opt] + " text-foreground" : "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <SectionHeader>Summary Note to Kiran Mehta (150 words)</SectionHeader>
      <textarea
        rows={5}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What did you find? What did you fix? What remains a risk?"
        className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <HelperText>A note that finds no issues is not credible. Be specific.</HelperText>

      <SubmitBar
        label="Submit Audit to Mentor"
        onSubmit={onComplete}
        disabled={!ready}
        hint={ready ? "Audit ready to submit." : "Review every defect card and write the mentor note."}
      />
    </TaskFrame>
  );
}