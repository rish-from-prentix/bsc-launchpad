import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, BulletCard } from "./attached-data";
import { TaskShell } from "./task-shell";
import { DeliverableLabel, StepBuilder } from "./inputs";

const SCENARIO_A: string[] = [
  "Patient books appointment via app",
  "Booking confirmation SMS sent",
  "Reminder sent 24h before",
  "Check-in at reception on arrival",
  "Vitals recorded by nurse",
  "Doctor consultation",
  "Lab sample drawn",
  "Overnight test processed",
  "Results uploaded to system",
  "Doctor reviews results next day",
  "Report sent to patient via app",
];

export function TaskTwoJourneyMap({
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
  const [steps, setSteps] = useState<string[]>([""]);
  const canSubmit = steps.filter((s) => s.trim().length > 0).length >= 5;

  return (
    <TaskShell
      taskId={2}
      onBackToOverview={onBackToOverview}
      submitted={submitted}
      onSubmit={onSubmit}
      onNext={onNext}
      canSubmit={canSubmit}
      shareableCaption="Mapped a real ER patient journey end-to-end, from ambulance call to discharge, as part of a healthcare ops case simulation."
    >
      <CarefirstEmail
        senderName="Ritu Sharma"
        senderRole="VP Operations"
        initials="RS"
        subject="Good start, now let's actually see the journey."
      >
        {`That one-pager was solid, thank you.

Before we can find where time is being lost, we need to actually lay out, step by step, what a patient goes through. I've asked Sanjay to send you two real patient scenarios pulled from our records.

Map each one out as a clear sequence. We'll use this as the backbone for everything else.

Ritu`}
      </CarefirstEmail>

      <CarefirstEmail
        senderName="Sanjay Iyer"
        senderRole="Ops Analyst"
        initials="SI"
        subject="Two patient scenarios (A worked, B raw)"
      >
        {`Passing along the two cases Ritu mentioned. Scenario A is already laid out clean so you can see the shape we're after. Scenario B is a raw shift handover note from the ward nurse. It's not in order, and it's written the way people actually write these things. Pull the events out of it and sequence them yourself, like Scenario A.`}
      </CarefirstEmail>

      <AttachedSection title="Scenario A (reference, already mapped)">
        <BulletCard title="OPD consultation with overnight lab" items={SCENARIO_A} />
      </AttachedSection>

      <AttachedSection title="Scenario B (your task, raw handover note)">
        <HandoverNote />
      </AttachedSection>

      <div>
        <DeliverableLabel>Scenario B, patient journey (step by step)</DeliverableLabel>
        <StepBuilder steps={steps} onChange={setSteps} locked={submitted} />
      </div>
    </TaskShell>
  );
}

function HandoverNote() {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Ward 3B · Night shift handover · Nurse Anjali → Nurse Meera
        </div>
        <div className="text-[10px] text-muted-foreground font-mono">21:47</div>
      </div>
      <div className="text-[13.5px] text-foreground/85 leading-[1.7] font-mono whitespace-pre-wrap">
{`Bed 12 is the fall-at-home patient from this morning. Long day for him honestly.

Discharge summary printed around 5-ish, family took it. He actually left maybe 5:45? Give or take.
Billing was the usual mess. Almost 90 mins after they cleared him. Insurance desk was the holdup again.

Day 3, morning rounds cleared discharge. Physio was fine. (BTW his son called twice asking about the follow-up script, I gave it to them at pickup.)

Rewinding a bit for context in case cardio asks:
- ambulance brought him in mid-morning day 1, fall at home
- triage grabbed him within like 5 mins, priority-wise not critical
- ER doc examined, sent for X-ray + bloods
- fracture confirmed on X-ray, doc said admit
- bed took FOREVER to allot, housekeeping was slammed, ~40 min wait before we could move him up
- shifted to ward once bed was ready
- days 1-3 standard: 4-hourly obs, daily rounds, meds on schedule

Follow-up prescription went out with him at exit. All meds reconciled.

That's it. GL with tonight.`}
      </div>
    </div>
  );
}