import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, CsvCard } from "./attached-data";
import { TeachingBlock, WorkedExample } from "./teaching-block";
import { TaskShell } from "./task-shell";
import { DeliverableLabel, EditableTable, TableRow, TextArea } from "./inputs";

// NOTE: The rows below are placeholder / sample data — a slim illustrative
// slice (15 rows) meant to show what the CSV looks like. The real deliverable
// would ship with a statistically-designed 150–200 row dataset. Timestamps
// are hand-picked to feel realistic and to make the median-vs-average lesson
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
];

const STEP_LABELS = [
  "Arrival → Triage",
  "Triage → Doctor exam",
  "Doctor exam → X-ray / bloodwork",
  "Tests → Admission decision",
  "Admission decision → Bed allotted",
  "Bed allotted → Ward shift",
  "Ward → Discharge cleared",
  "Discharge cleared → Billing complete",
  "Billing → Discharge summary",
  "Discharge summary → Patient exit",
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
  const [rows, setRows] = useState<TableRow[]>(
    STEP_LABELS.map((s) => ({ step: s, avg: "", median: "", benchmark: "", diff: "", flag: "" })),
  );
  const [problems, setProblems] = useState("");

  const canSubmit =
    rows.some((r) => r.avg.trim() || r.median.trim() || r.flag.trim()) &&
    problems.trim().length > 20;

  return (
    <TaskShell
      taskId={3}
      onBackToOverview={onBackToOverview}
      submitted={submitted}
      onSubmit={onSubmit}
      onNext={onNext}
      canSubmit={canSubmit}
    >
      <CarefirstEmail
        senderName="Sanjay Kulkarni"
        senderRole="Ops Analyst"
        initials="SK"
        subject="Here's the timestamp data you asked for."
      >
        {`Pulling this from our system logs. Every row is one patient's actual recorded time at each step of the ER-to-discharge journey you mapped. Should help you see where things are slow.

— Sanjay`}
      </CarefirstEmail>

      <AttachedSection>
        <CsvCard
          filename="er_patient_timestamps.csv"
          note="Columns: patient_id, arrival_time, triage_time, doctor_exam_time, xray_bloodwork_time, admission_decision_time, bed_allotted_time, ward_shift_time, discharge_clear_time, billing_complete_time, discharge_summary_time, patient_exit_time"
        />
        <div className="rounded-lg border border-border bg-background/40 overflow-hidden">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold px-4 pt-3 pb-2">
            Preview — first 15 rows
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

      <TeachingBlock title="How to turn timestamps into minutes">
        <div>
          In a spreadsheet, subtracting two time cells gives you a fraction of a day. Multiply by
          24 × 60 to get minutes:
        </div>
        <div className="font-mono text-[13.5px] rounded-md bg-background/40 border border-border p-3 text-foreground/90">
          {"= (B2 - A2) * 24 * 60"}
        </div>
        <div>
          Compute this for every step, then take the <span className="text-foreground font-semibold">average</span> and the{" "}
          <span className="text-foreground font-semibold">median</span> across all patients. Compare each against the internal benchmark.
        </div>
        <WorkedExample title="Internal benchmarks (what 'good' looks like)">
          <div className="grid grid-cols-2 gap-y-1">
            <span>Admission decision → Bed allotted</span><span className="text-foreground/90">15 min</span>
            <span>Discharge cleared → Billing complete</span><span className="text-foreground/90">20 min</span>
            <span>Tests → Admission decision</span><span className="text-foreground/90">10 min</span>
          </div>
        </WorkedExample>
        <WorkedExample title="Average vs median">
          <div>
            Average is pulled around by a few very long waits. Median tells you what a typical patient
            actually experiences. If the two diverge a lot, you have outliers — and the median is
            usually the more honest number to quote to leadership.
          </div>
        </WorkedExample>
      </TeachingBlock>

      <div className="space-y-6">
        <div>
          <DeliverableLabel>Step-by-step timing analysis</DeliverableLabel>
          <EditableTable
            locked={submitted}
            rows={rows}
            onChange={setRows}
            columns={[
              { key: "step", label: "Step" },
              { key: "avg", label: "Avg (mins)", placeholder: "e.g. 42" },
              { key: "median", label: "Median (mins)", placeholder: "e.g. 38" },
              { key: "benchmark", label: "Benchmark", placeholder: "e.g. 15" },
              { key: "diff", label: "Over / Under", placeholder: "+ / − mins" },
              { key: "flag", label: "Flag?", placeholder: "Yes / No" },
            ]}
          />
        </div>

        <div>
          <DeliverableLabel>Top 2 problem areas</DeliverableLabel>
          <TextArea
            value={problems}
            onChange={setProblems}
            locked={submitted}
            rows={4}
            placeholder="Name the top 2 problem areas (2–3 sentences)."
          />
        </div>
      </div>
    </TaskShell>
  );
}