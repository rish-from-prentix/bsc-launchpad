import { CarefirstEmail } from "./email-card";
import { PullQuote, TeachingBlock } from "./teaching-block";
import { TaskShell } from "./task-shell";
import { ProgressiveFlow, ProgressiveStep } from "./progressive-sections";

export function TaskZeroOnboarding({
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
  return (
    <TaskShell
      taskId={0}
      onBackToOverview={onBackToOverview}
      submitted={submitted}
      onSubmit={onSubmit}
      onNext={onNext}
      submitLabel="Continue"
    >
      <ProgressiveFlow taskId={0} totalSteps={2} forceRevealAll={submitted}>
        <ProgressiveStep index={0}>
          <CarefirstEmail senderName="Ritu Sharma" senderRole="VP Operations, CareFirst Hospitals" initials="RS">
        {`Welcome to the team. CareFirst Hospitals is a 6-hospital chain across Delhi NCR and Mumbai, roughly 2,400 beds combined, about 9,000 OPD visits a day across the network.

We have a digital patient app and back-end systems built and run by our partner, PulseTech. You'll meet them later once the project needs them.`}
          </CarefirstEmail>
        </ProgressiveStep>

        <ProgressiveStep index={1} label="Show me how to think about this">
          <TeachingBlock title="Quick glossary">
        <div>
          <span className="text-foreground font-semibold">OPD (Outpatient Department)</span>
          {": "}patients who come in for a consultation and leave the same day. Think:
          scheduled visits, walk-ins, follow-ups.
        </div>
        <div>
          <span className="text-foreground font-semibold">IPD (Inpatient Department)</span>
          {": "}patients admitted to a bed for one or more nights. Think: surgeries,
          serious illness, monitored recovery.
        </div>
        <div>
          <span className="text-foreground font-semibold">TAT (Turnaround Time)</span>
          {": "}how long a process takes end-to-end. E.g. lab TAT = time from sample
          drawn to result available. Lower TAT usually means better care.
        </div>
          </TeachingBlock>

          <PullQuote>
        A Business Analyst looks at how things currently work, uses data and
        conversations with staff and patients to find out where time or money is
        being lost, and recommends specific, practical changes leadership can
        approve. Sometimes those changes are process changes, sometimes they're
        changes to the systems and apps the hospital relies on. You'll do both in
        this internship.
          </PullQuote>
        </ProgressiveStep>
      </ProgressiveFlow>
    </TaskShell>
  );
}