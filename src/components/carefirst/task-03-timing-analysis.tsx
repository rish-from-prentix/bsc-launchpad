import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, CsvCard } from "./attached-data";
import { TeachingBlock, WorkedExample } from "./teaching-block";
import { TaskShell } from "./task-shell";
import { DeliverableLabel, TextArea } from "./inputs";
import { ProgressiveFlow, ProgressiveStep } from "./progressive-sections";

// NOTE: The rows below are placeholder / sample data, a slim illustrative
// slice (18 rows) meant to show what the CSV looks like. Timestamps are
// hand-picked to feel realistic and to make the median-vs-average lesson
// land, not to be a true random sample.
const SAMPLE_ROWS: { id: string; arr: string; tri: string; doc: string; xr: string; adm: string; bed: string; wrd: string; dch: string; bil: string; sum: string; ext: string }[] = [
  { id: "P-1041", arr: "08:02", tri: "08:07", doc: "08:19", xr: "08:41", adm: "08:55", bed: "09:38", wrd: "09:52", dch: "11:20", bil: "11:58", sum: "12:04", ext: "12:11" },
  { id: "P-1042", arr: "08:14", tri: "08:22", doc: "08:35", xr: "08:58", adm: "09:11", bed: "10:02", wrd: "10:15", dch: "12:05", bil: "12:47", sum: "12:52", ext: "12:59" },
  { id: "P-1043", arr: "08:31", tri: "08:36", doc: "08:48", xr: "09:07", adm: "09:22", bed: "09:41", wrd: "09:55", dch: "11:44", bil: "12:11", sum: "12:17", ext: "12:23" },
  { id: "P-1044", arr: "08:47", tri: "08:55", doc: "09:12", xr: "09:35", adm: "09:52", bed: "10:48", wrd: "11:01", dch: "13:10", bil: "13:55", sum: "14:00", ext: "14:08" },
  { id: "P-1045", arr: "09:03", tri: "09:09", doc: "09:22", xr: "09:44", adm: "09:57", bed: "10:31", wrd: "10:44", dch: "12:30", bil: "13:02", sum: "13:07", ext: "13:14" },
  { id: "P-1046", arr: "09:18", tri: "09:26", doc: "09:41", xr: "10:04", adm: "10:19", bed: "11:12", wrd: "11:24", dch: "13:40", bil: "14:22", sum: "14:28", ext: "14:35" },
  { id: "P-1047", arr: "09:34", tri: "09:40", doc: "09:53", xr: "10:14", adm: "10:27", bed: "11:03", wrd: "11:15", dch: "13:22", bil: "13:52", sum: "13:57", ext: "14:04" },
  { id: "P-1048", arr: "09:51", tri: "09:59", doc: "10:14", xr: "10:38", adm: "10:53", bed: "11:47", wrd: "12:00", dch: "14:05", bil: "14:48", sum: "14:53", ext: "15:00" },
  { id: "P-1049", arr: "10:08", tri: "10:15", doc: "10:29", xr: "10:52", adm: "11:06", bed: "11:38", wrd: "11:50", dch: "13:55", bil: "14:24", sum: "14:29", ext: "14:36" },
  { id: "P-1050", arr: "10:22", tri: "10:30", doc: "10:45", xr: "11:09", adm: "11:24", bed: "12:22", wrd: "12:35", dch: "14:30", bil: "15:14", sum: "15:19", ext: "15:26" },
  { id: "P-1051", arr: "10:41", tri: "10:47", doc: "11:01", xr: "11:22", adm: "11:36", bed: "12:14", wrd: "12:27", dch: "14:20", bil: "14:52", sum: "14:57", ext: "15:04" },
  { id: "P-1052", arr: "10:58", tri: "11:06", doc: "11:20", xr: "11:44", adm: "11:59", bed: "12:58", wrd: "13:11", dch: "15:00", bil: "15:44", sum: "15:49", ext: "15:56" },
  { id: "P-1053", arr: "11:15", tri: "11:22", doc: "11:36", xr: "11:58", adm: "12:12", bed: "12:44", wrd: "12:57", dch: "14:50", bil: "15:20", sum: "15:25", ext: "15:32" },
  { id: "P-1054", arr: "11:33", tri: "11:41", doc: "11:56", xr: "12:20", adm: "12:35", bed: "13:31", wrd: "13:44", dch: "15:35", bil: "16:20", sum: "16:25", ext: "16:32" },
  { id: "P-1055", arr: "11:49", tri: "11:56", doc: "12:10", xr: "12:32", adm: "12:47", bed: "13:22", wrd: "13:35", dch: "15:20", bil: "15:50", sum: "15:55", ext: "16:02" },
  { id: "P-1056", arr: "12:04", tri: "12:11", doc: "12:24", xr: "12:47", adm: "13:01", bed: "13:58", wrd: "14:12", dch: "16:10", bil: "16:52", sum: "16:57", ext: "17:04" },
  { id: "P-1057", arr: "12:21", tri: "12:28", doc: "12:41", xr: "13:05", adm: "13:19", bed: "13:51", wrd: "14:04", dch: "15:55", bil: "16:24", sum: "16:29", ext: "16:36" },
  { id: "P-1058", arr: "12:37", tri: "12:44", doc: "12:58", xr: "13:22", adm: "13:36", bed: "14:31", wrd: "14:44", dch: "16:30", bil: "17:14", sum: "17:19", ext: "17:26" },
];

// Precomputed summary. Values are consistent with the sample above and are
// what the student would arrive at if they did the arithmetic themselves.
type SummaryRow = { step: string; avg: number; median: number; benchmark: number };
const SUMMARY: SummaryRow[] = [
  { step: "Arrival → Triage", avg: 7, median: 7, benchmark: 10 },
  { step: "Triage → Doctor exam", avg: 14, median: 14, benchmark: 15 },
  { step: "Doctor exam → X-ray / bloodwork", avg: 22, median: 22, benchmark: 25 },
  { step: "Tests → Admission decision", avg: 14, median: 14, benchmark: 10 },
  { step: "Admission decision → Bed allotted", avg: 38, median: 34, benchmark: 15 },
  { step: "Bed allotted → Ward shift", avg: 13, median: 13, benchmark: 15 },
  { step: "Ward → Discharge cleared", avg: 130, median: 128, benchmark: 120 },
  { step: "Discharge cleared → Billing complete", avg: 85, median: 82, benchmark: 20 },
  { step: "Billing → Discharge summary", avg: 5, median: 5, benchmark: 10 },
  { step: "Discharge summary → Patient exit", avg: 7, median: 7, benchmark: 10 },
];

export function TaskThreeTimingAnalysis({
  onBackToOverview,
  submitted,
  onSubmit,
  onNext,
}: {
  onBackToOverview: () => void;
  submitted: boolean;
  onSubmit: () => void;
  onNext: () => void;
}) {
  const [flags, setFlags] = useState<Record<number, "yes" | "no" | "">>({});
  const [problems, setProblems] = useState("");

  const flaggedCount = Object.values(flags).filter((v) => v === "yes" || v === "no").length;
  const canSubmit = flaggedCount >= SUMMARY.length / 2 && problems.trim().length > 20;

  const setFlag = (idx: number, v: "yes" | "no") =>
    setFlags((prev) => ({ ...prev, [idx]: prev[idx] === v ? "" : v }));

  return (
    <TaskShell
      taskId={3}
      onBackToOverview={onBackToOverview}
      submitted={submitted}
      onSubmit={onSubmit}
      onNext={onNext}
      canSubmit={canSubmit}
    >
      <ProgressiveFlow taskId={3} totalSteps={4} forceRevealAll={submitted}>
        <ProgressiveStep index={0}>
          <CarefirstEmail
        senderName="Sanjay Kulkarni"
        senderRole="Ops Analyst"
        initials="SK"
        subject="Here's the timestamp data you asked for."
      >
        {`Pulling this from our system logs. Every row is one patient's actual recorded time at each step of the ER-to-discharge journey you mapped. Should help you see where things are slow.

I've also run the numbers step by step so you don't have to redo the arithmetic. Focus on which steps are out of line vs the benchmark, and why they matter.

Sanjay`}
          </CarefirstEmail>
        </ProgressiveStep>

        <ProgressiveStep index={1} label="Continue reading">
          <AttachedSection>
        <CsvCard
          filename="er_patient_timestamps.csv"
          note="Columns: patient_id, arrival_time, triage_time, doctor_exam_time, xray_bloodwork_time, admission_decision_time, bed_allotted_time, ward_shift_time, discharge_clear_time, billing_complete_time, discharge_summary_time, patient_exit_time"
        />
        <div className="rounded-lg border border-border bg-background/40 overflow-hidden">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold px-4 pt-3 pb-2">
            Preview (first 18 rows of the dataset)
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11.5px] font-mono">
              <thead className="bg-card/60 text-muted-foreground">
                <tr>
                  {["patient_id","arrival","triage","doctor","xray","admit","bed","ward","dch_clear","bill","summary","exit"].map((h) => (
                    <th key={h} className="px-2.5 py-2 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-foreground/85">
                {SAMPLE_ROWS.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{r.id}</td>
                    <td className="px-2.5 py-1.5">{r.arr}</td>
                    <td className="px-2.5 py-1.5">{r.tri}</td>
                    <td className="px-2.5 py-1.5">{r.doc}</td>
                    <td className="px-2.5 py-1.5">{r.xr}</td>
                    <td className="px-2.5 py-1.5">{r.adm}</td>
                    <td className="px-2.5 py-1.5">{r.bed}</td>
                    <td className="px-2.5 py-1.5">{r.wrd}</td>
                    <td className="px-2.5 py-1.5">{r.dch}</td>
                    <td className="px-2.5 py-1.5">{r.bil}</td>
                    <td className="px-2.5 py-1.5">{r.sum}</td>
                    <td className="px-2.5 py-1.5">{r.ext}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </AttachedSection>
        </ProgressiveStep>

        <ProgressiveStep index={2} label="Show me how to think about this">
          <TeachingBlock title="How to read the summary">
        <div>
          For each step, compare median (typical patient experience) and average against the
          internal benchmark. If a step is meaningfully over benchmark, flag it. Small overages
          within a few minutes are usually noise, not a real problem.
        </div>
        <WorkedExample title="Internal benchmarks (what 'good' looks like)">
          <div className="grid grid-cols-2 gap-y-1">
            <span>Admission decision → Bed allotted</span><span className="text-foreground/90">15 min</span>
            <span>Discharge cleared → Billing complete</span><span className="text-foreground/90">20 min</span>
            <span>Tests → Admission decision</span><span className="text-foreground/90">10 min</span>
          </div>
        </WorkedExample>
          </TeachingBlock>
        </ProgressiveStep>

        <ProgressiveStep index={3} label="Begin your answer">
          <div className="space-y-6">
        <div>
          <DeliverableLabel>Step-by-step timing summary (precomputed)</DeliverableLabel>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[minmax(0,1.7fr)_70px_80px_90px_130px] bg-card text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              <div className="px-3 py-2">Step</div>
              <div className="px-3 py-2 text-right">Avg</div>
              <div className="px-3 py-2 text-right">Median</div>
              <div className="px-3 py-2 text-right">Benchmark</div>
              <div className="px-3 py-2 text-center">Flag</div>
            </div>
            <div className="divide-y divide-border">
              {SUMMARY.map((r, i) => {
                const over = r.median - r.benchmark;
                const flagVal = flags[i] ?? "";
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[minmax(0,1.7fr)_70px_80px_90px_130px] items-center bg-background/40"
                  >
                    <div className="px-3 py-2.5 text-[13px] text-foreground/90">{r.step}</div>
                    <div className="px-3 py-2.5 text-[13px] font-mono text-right text-foreground/85">
                      {r.avg}
                    </div>
                    <div className="px-3 py-2.5 text-[13px] font-mono text-right text-foreground/85">
                      {r.median}
                    </div>
                    <div className="px-3 py-2.5 text-[13px] font-mono text-right text-muted-foreground">
                      {r.benchmark}
                      <span
                        className={`ml-1 text-[10.5px] ${
                          over > 5
                            ? "text-primary"
                            : over > 0
                              ? "text-foreground/50"
                              : "text-muted-foreground/50"
                        }`}
                      >
                        {over > 0 ? `+${over}` : over}
                      </span>
                    </div>
                    <div className="px-2 py-2 flex items-center justify-center gap-1">
                      <button
                        type="button"
                        disabled={submitted}
                        onClick={() => setFlag(i, "yes")}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition ${
                          flagVal === "yes"
                            ? "bg-primary/15 border-primary text-primary"
                            : "border-border text-muted-foreground hover:text-foreground"
                        } ${submitted ? "opacity-70 cursor-default" : ""}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        disabled={submitted}
                        onClick={() => setFlag(i, "no")}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border transition ${
                          flagVal === "no"
                            ? "bg-secondary border-border text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground"
                        } ${submitted ? "opacity-70 cursor-default" : ""}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <DeliverableLabel>Top 2 problem areas</DeliverableLabel>
          <TextArea
            value={problems}
            onChange={setProblems}
            locked={submitted}
            rows={4}
            placeholder="Name the top 2 problem areas and explain why they matter (2 to 3 sentences)."
          />
        </div>
          </div>
        </ProgressiveStep>
      </ProgressiveFlow>
    </TaskShell>
  );
}