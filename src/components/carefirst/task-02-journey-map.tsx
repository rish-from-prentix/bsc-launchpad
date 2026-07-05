import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, BulletCard, TranscriptBlock } from "./attached-data";
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
      shareableCaption="Mapped a real ER patient journey end-to-end — from ambulance call to discharge — as part of a healthcare ops case simulation."
    >
      <CarefirstEmail
        senderName="Ritu Sharma"
        senderRole="VP Operations"
        initials="RS"
        subject="Good start, now let's actually see the journey."
      >
        {`That one-pager was solid, thank you — especially catching that median matters more than average here.

Before we can find where time is being lost, we need to actually lay out, step by step, what a patient goes through. I've asked Sanjay to send you two real patient scenarios pulled from our records.

Map each one out as a clear sequence — we'll use this as the backbone for everything else.

— Ritu`}
      </CarefirstEmail>

      <CarefirstEmail
        senderName="Sanjay Iyer"
        senderRole="Ops Analyst"
        initials="SI"
        subject="Two patient scenarios — Scenario A worked, Scenario B raw"
      >
        {`Passing along the two cases Ritu mentioned. Scenario A is already laid out clean so you can see the shape we're after. Scenario B is straight from the record — write it up like Scenario A.`}
      </CarefirstEmail>

      <AttachedSection title="Scenario A — reference (already mapped)">
        <BulletCard title="OPD consultation with overnight lab" items={SCENARIO_A} />
      </AttachedSection>

      <AttachedSection title="Scenario B — your task (raw notes)">
        <TranscriptBlock>
          Ambulance called after a fall at home. Triage assessed severity within 5
          min. ER doctor examined the patient, ordered X-ray and bloodwork.
          Fracture confirmed. Admission recommended. Bed allotted after a 40-min
          housekeeping wait. Shifted to ward. Three days of daily rounds,
          4-hourly nursing checks, day-2 physio, scheduled medication. Day 3
          discharge cleared. Billing took 90 min. Discharge summary printed.
          Patient leaves with follow-up prescription.
        </TranscriptBlock>
      </AttachedSection>

      <div>
        <DeliverableLabel>Scenario B — patient journey (step by step)</DeliverableLabel>
        <StepBuilder steps={steps} onChange={setSteps} locked={submitted} />
      </div>
    </TaskShell>
  );
}