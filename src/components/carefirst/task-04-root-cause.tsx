import { useState } from "react";
import { CarefirstEmail } from "./email-card";
import { AttachedSection, TranscriptBlock } from "./attached-data";
import { TeachingBlock, WorkedExample } from "./teaching-block";
import { TaskShell } from "./task-shell";
import { DeliverableLabel, TextArea } from "./inputs";

export function TaskFourRootCause({
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
  const [bed, setBed] = useState("");
  const [billing, setBilling] = useState("");
  const canSubmit = bed.trim().length > 20 && billing.trim().length > 20;

  return (
    <TaskShell
      taskId={4}
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
        subject="Talked to the floor teams, thought this would help."
      >
        {`I sat down with Dr. Verma and Nurse Fatima this week. Sharing the transcripts. See if you can figure out WHY bed allotment and billing are taking so long, not just that they are.

— Ritu`}
      </CarefirstEmail>

      <AttachedSection title="Floor interviews">
        <TranscriptBlock>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground not-italic font-semibold mb-1.5">
            Dr. Verma — ER Consultant
          </div>
          Housekeeping is short-staffed on the evening shift, and there is no formal system to
          notify housekeeping the moment a bed is vacated — staff currently rely on someone
          remembering to call.
        </TranscriptBlock>
        <TranscriptBlock>
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground not-italic font-semibold mb-1.5">
            Nurse Fatima — Ward In-Charge
          </div>
          Billing requires manual sign-off from three different departments — pharmacy,
          diagnostics, insurance desk — before the final bill can be generated, and these teams
          are not co-located, so requests are carried physically or by phone.
        </TranscriptBlock>
      </AttachedSection>

      <TeachingBlock title="Root cause vs symptom">
        <div>
          A <span className="text-foreground font-semibold">symptom</span> is what you see. A{" "}
          <span className="text-foreground font-semibold">root cause</span> is what is producing it.
          Treating the symptom feels productive but the problem comes back. It's the difference
          between taking paracetamol for a fever and treating the underlying infection.
        </div>
        <div>
          The <span className="text-foreground font-semibold">5 Whys</span> is a simple way to get
          from one to the other: ask "why" about the observed problem, then ask "why" of the answer,
          and keep going — usually three to five times — until you hit something you could actually
          change.
        </div>
        <WorkedExample title="Worked example — the bus was late">
          <div>1. Why was the bus late? — It left the depot late.</div>
          <div>2. Why did it leave the depot late? — The driver arrived late.</div>
          <div>3. Why did the driver arrive late? — The morning shift roster was posted only the previous night.</div>
          <div>4. Why was it posted so late? — The supervisor waits on last-minute leave requests.</div>
          <div>5. Why does the process depend on that? — There is no cut-off time for leave requests.</div>
          <div className="text-foreground/90 pt-1">
            <span className="font-semibold">Root cause:</span> no cut-off time for leave requests,
            which cascades into a late roster, a late driver, and a late bus.
          </div>
        </WorkedExample>
      </TeachingBlock>

      <div className="space-y-6">
        <div>
          <DeliverableLabel>Bed allotment delay — root cause</DeliverableLabel>
          <TextArea
            value={bed}
            onChange={setBed}
            locked={submitted}
            rows={6}
            placeholder="2–4 whys, ending in one clear root-cause sentence."
          />
        </div>

        <div>
          <DeliverableLabel>Billing delay — root cause</DeliverableLabel>
          <TextArea
            value={billing}
            onChange={setBilling}
            locked={submitted}
            rows={6}
            placeholder="2–4 whys, ending in one clear root-cause sentence."
          />
        </div>
      </div>
    </TaskShell>
  );
}