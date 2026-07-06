import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, StatList } from "./attached-data";
import { TeachingBlock, WorkedExample } from "./teaching-block";
import { OrgChart } from "./org-chart";
import { TaskShell } from "./task-shell";
import { DeliverableLabel, EditableTable, TableRow, TextArea } from "./inputs";

export function TaskOneProblemFraming({
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
  const [problem, setProblem] = useState("");
  const [metrics, setMetrics] = useState("");
  const [rows, setRows] = useState<TableRow[]>([
    { stakeholder: "", influence: "", interest: "" },
    { stakeholder: "", influence: "", interest: "" },
    { stakeholder: "", influence: "", interest: "" },
  ]);

  const canSubmit =
    problem.trim().length > 10 &&
    metrics.trim().length > 5 &&
    rows.some((r) => r.stakeholder.trim().length > 0);

  return (
    <TaskShell
      taskId={1}
      onBackToOverview={onBackToOverview}
      submitted={submitted}
      onSubmit={onSubmit}
      onNext={onNext}
      canSubmit={canSubmit}
    >
      <CarefirstEmail
        senderName="Ritu Sharma"
        senderRole="VP Operations"
        initials="RS"
        subject="Need your help, patient wait times are becoming a real issue."
      >
        {`Hi, welcome to the team. I'll be direct: our average patient waiting time has gone from 28 minutes to 51 minutes over the last six months across our OPD network.

Leadership has asked me to bring it down by 30% by next quarter. Before we jump to fixing anything, I need three things from you by end of day: a clear problem statement, the metrics we should track to know if we're succeeding, and a map of everyone whose work will be affected by whatever we change.

Keep it to one page. I'll review it before we go further.

Ritu`}
      </CarefirstEmail>

      <AttachedSection>
        <StatList
          items={[
            { label: "Current avg OPD wait time", value: "51 min" },
            { label: "Six months ago", value: "28 min" },
            { label: "Leadership target", value: "−30% by next quarter" },
            {
              label: "Definition",
              value: "Waiting time = check-in → called by doctor",
            },
          ]}
        />
        <OrgChart />
      </AttachedSection>

      <TeachingBlock title="How to frame a problem">
        <div>Use this 4-line formula:</div>
        <div className="font-mono text-[13.5px] rounded-md bg-background/40 border border-border p-3 text-foreground/90">
          {"1. Who is affected\n2. What is happening\n3. Why it matters\n4. By when it must change"}
        </div>
        <div>
          A <span className="text-foreground font-semibold">stakeholder map</span> lists everyone
          whose work will be touched by the change, plus how much influence they have and how
          interested they are in the outcome. High-influence + high-interest people need the most
          attention.
        </div>
        <WorkedExample title="Worked example (cafeteria queue)">
          <div>
            <span className="text-foreground/90 font-semibold">Problem:</span>{" "}
            Office cafeteria lunch queue (Who) has grown from 6 min to 14 min over 3 months (What),
            causing employees to skip lunch or return late from breaks (Why), and we need it back
            under 8 min within 4 weeks (When).
          </div>
          <div>
            <span className="text-foreground/90 font-semibold">Metrics:</span>{" "}
            Median wait time, peak-hour wait, % of employees served within 8 min.
          </div>
          <div>
            <span className="text-foreground/90 font-semibold">Stakeholders:</span>{" "}
            Kitchen staff (high influence, high interest), Facilities (high, medium), Employees
            (low, high), Vendor supplying trays (low, low).
          </div>
        </WorkedExample>
      </TeachingBlock>

      <TeachingBlock title="Why median can matter more than average">
        <div>
          When you pick a metric, watch out for a few very long waits pulling the{" "}
          <span className="text-foreground font-semibold">average</span> upward.
          The <span className="text-foreground font-semibold">median</span> tells you what a typical
          patient actually experiences. If the two diverge a lot, you have outliers,
          and median is usually the more honest number to quote to leadership.
        </div>
        <WorkedExample title="Tiny worked example">
          <div>
            Five patients wait: 20, 22, 25, 28, and 120 minutes.
          </div>
          <div>
            Average = 43 min. Median = 25 min. Four of the five patients waited under 30 minutes,
            but the average makes it sound like everyone waits closer to 45.
          </div>
        </WorkedExample>
      </TeachingBlock>

      <div className="space-y-6">
        <div>
          <DeliverableLabel>Problem statement</DeliverableLabel>
          <TextArea
            value={problem}
            onChange={setProblem}
            locked={submitted}
            rows={5}
            placeholder="Who is affected · what is happening · why it matters · by when it must change"
          />
        </div>

        <div>
          <DeliverableLabel>Success metrics</DeliverableLabel>
          <TextArea
            value={metrics}
            onChange={setMetrics}
            locked={submitted}
            rows={4}
            placeholder="How will we know it's working? List 2–4 metrics."
          />
        </div>

        <div>
          <DeliverableLabel>Stakeholder map</DeliverableLabel>
          <EditableTable
            locked={submitted}
            rows={rows}
            onChange={setRows}
            columns={[
              { key: "stakeholder", label: "Stakeholder", placeholder: "e.g. Reception" },
              { key: "influence", label: "Influence", placeholder: "High / Med / Low" },
              { key: "interest", label: "Interest", placeholder: "High / Med / Low" },
            ]}
          />
        </div>
      </div>
    </TaskShell>
  );
}