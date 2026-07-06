import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, BulletCard } from "./attached-data";
import { TaskShell } from "./task-shell";
import { DeliverableLabel } from "./inputs";

type Fix = { intervention: string; rootCause: string; minutesSaved: string };
const blank: Fix = { intervention: "", rootCause: "", minutesSaved: "" };

function FixCard({
  title,
  hint,
  value,
  onChange,
  locked,
  interventionLabel = "Intervention",
  rootCauseLabel = "Root cause addressed",
  outcomeLabel = "Estimated outcome (minutes saved)",
}: {
  title: string;
  hint?: string;
  value: Fix;
  onChange: (v: Fix) => void;
  locked?: boolean;
  interventionLabel?: string;
  rootCauseLabel?: string;
  outcomeLabel?: string;
}) {
  const inputCls = locked
    ? "w-full rounded-md border-0 bg-transparent px-3 py-2 text-[13.5px] text-[#888]"
    : "w-full rounded-md border border-[#2A2A2A] bg-background/60 px-3 py-2 text-[13.5px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition";

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div>
        <div className="text-[13px] font-semibold text-foreground">{title}</div>
        {hint && <div className="text-[11.5px] text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1.5">
          {interventionLabel}
        </div>
        <input
          type="text"
          className={inputCls}
          disabled={locked}
          value={value.intervention}
          onChange={(e) => onChange({ ...value, intervention: e.target.value })}
          placeholder="What would you actually change?"
        />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1.5">
          {rootCauseLabel}
        </div>
        <input
          type="text"
          className={inputCls}
          disabled={locked}
          value={value.rootCause}
          onChange={(e) => onChange({ ...value, rootCause: e.target.value })}
          placeholder="Which root cause from Task 04 does this address?"
        />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-1.5">
          {outcomeLabel}
        </div>
        <input
          type="text"
          className={inputCls}
          disabled={locked}
          value={value.minutesSaved}
          onChange={(e) => onChange({ ...value, minutesSaved: e.target.value })}
          placeholder="e.g. 25 minutes saved per patient"
        />
      </div>
    </div>
  );
}

export function TaskFiveRecommendInterventions({
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
  const [bed, setBed] = useState<Fix>(blank);
  const [billing, setBilling] = useState<Fix>(blank);
  const [stretch, setStretch] = useState<Fix>(blank);

  const filled = (f: Fix) =>
    f.intervention.trim().length > 0 &&
    f.rootCause.trim().length > 0 &&
    f.minutesSaved.trim().length > 0;
  const canSubmit = filled(bed) && filled(billing) && filled(stretch);

  return (
    <TaskShell
      taskId={5}
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
        subject="What would you actually change?"
      >
        {`This is the part leadership cares about most. I've attached a short reference doc on how different types of operational changes tend to play out at hospitals like ours. Use it to ground your recommendations in something realistic, not just guesses.

Ritu`}
      </CarefirstEmail>

      <AttachedSection title="Reference (how ops changes usually play out)">
        <BulletCard
          title="Rules of thumb (illustrative, not guarantees)"
          items={[
            "Adding a second queue / counter for a bottlenecked step: typically cuts wait at that step by 30 to 45%, adds staffing cost.",
            "Digitising a manual notification (e.g. bed-status system): typically cuts related delay by 50 to 70%, low ongoing cost after setup.",
            "Adding staff during peak hours only: typically cuts delay by 20 to 30% at that step, moderate cost, fast to implement.",
            "Centralising or co-locating a multi-department approval process: typically cuts delay by 40 to 60%, higher effort and cost, slower to implement.",
          ]}
        />
      </AttachedSection>

      <div>
        <DeliverableLabel>Recommended interventions</DeliverableLabel>
        <div className="space-y-4">
          <FixCard
            title="Bed allotment fix"
            hint="Targets the housekeeping / bed-vacated notification delay."
            value={bed}
            onChange={setBed}
            locked={submitted}
          />
          <FixCard
            title="Billing fix"
            hint="Targets the multi-department manual sign-off delay."
            value={billing}
            onChange={setBilling}
            locked={submitted}
          />
          <FixCard
            title="Your stretch idea"
            hint="Pick any other bottleneck from your analysis. Name the fix yourself."
            value={stretch}
            onChange={setStretch}
            locked={submitted}
            interventionLabel="Your intervention"
            rootCauseLabel="What you're solving"
            outcomeLabel="Estimated outcome"
          />
        </div>
      </div>
    </TaskShell>
  );
}