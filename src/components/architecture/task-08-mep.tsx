import { useEffect, useState } from "react";
import { Check, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, VoiceNote, SubmitBar } from "./shared";
import { ARCH_TASKS, MEP_CONFLICTS } from "./arch-data";

const META = ARCH_TASKS[7];

type Letter = "a" | "b" | "c";

const STATS: Record<number, { left: { value: string; label: string }; right: { value: string; label: string } }> = {
  1: {
    left: { value: "2,500mm", label: "Finished ceiling if no action taken" },
    right: { value: "2,700mm", label: "NBC minimum for public reading room" },
  },
  2: {
    left: { value: "900mm", label: "Current cupboard depth" },
    right: { value: "1,000mm", label: "Required clear working zone" },
  },
  3: {
    left: { value: "12 sq.m.", label: "Solar inverter room required" },
    right: { value: "0 sq.m.", label: "Currently in programme" },
  },
};

const CONSEQUENCES: Record<number, Record<Letter, string>> = {
  1: {
    a: "Floor-to-floor increases 400mm. Structural cost rises. Floor plate area per storey affected. But ceiling height meets NBC.",
    b: "Distributed system costs 15-20% more on MEP budget. No structural change needed.",
    c: "Displacement ventilation avoids overhead duct zone entirely. Lowest cost option. Best for library acoustic comfort.",
  },
  2: {
    a: "100mm shortfall noted on drawing. If flagged in RFI it may be accepted, but creates liability if fault occurs near public.",
    b: "Plant room relocation meets 20m cable run limit from DP Road meter. Removes fault alarm from reception entirely.",
    c: "Staircase cupboard lacks natural ventilation and 1,000mm clear zone. Fails working regulations.",
  },
  3: {
    a: "Adds 12 sq.m. to roof programme. Requires update to area schedule and cost plan. Correct technical solution.",
    b: "Cable run from ground floor to roof PV array would exceed 15m limit. Creates voltage drop and fire risk.",
    c: "Removes PV panels entirely. Conflicts with sustainability selection from Task 7 if solar was chosen. Budget and carbon impact significant.",
  },
};

const VERDICTS: Record<number, Record<Letter, string>> = {
  1: {
    a: "Noted. Structural engineer to confirm revised slab depth.",
    b: "Approved. Higher cost but avoids structural redesign.",
    c: "Preferred solution. Update specification to include displacement units at skirting level.",
  },
  2: {
    a: "Not acceptable. 100mm shortfall creates ongoing liability.",
    b: "Correct. Relocate DB, update drawing.",
    c: "Rejected. No compliant ventilation or working clearance.",
  },
  3: {
    a: "Correct. Add to programme and cost plan immediately.",
    b: "Rejected. Voltage drop risk and fire regulation failure.",
    c: "Only acceptable if solar was never selected. Check against Task 7.",
  },
};

export function ArchTaskEight({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0); // 0..2 conflicts, 3 = summary
  const [picked, setPicked] = useState<Record<number, Letter | undefined>>({});
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
  const [solarPicked, setSolarPicked] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("arch.task7.selected");
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setSolarPicked(Array.isArray(arr) && arr.includes("solar"));
      }
    } catch {}
  }, []);

  const allDone = step >= MEP_CONFLICTS.length;

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <VoiceNote initials="SR" name="Smita Rao" role="MEP Engineer · Rao Building Services" timestamp="Mon 08:45 · voice msg">
        I have logged three conflicts that <strong>need an architect decision before I can issue drawings</strong>. If these are not resolved, the contractor will be building to conflicting information.
      </VoiceNote>

      <Stepper step={step} confirmed={confirmed} />

      {!allDone && (
        <ConflictCard
          key={step}
          conflict={MEP_CONFLICTS[step]}
          picked={picked[MEP_CONFLICTS[step].id]}
          onPick={(l) => setPicked({ ...picked, [MEP_CONFLICTS[step].id]: l })}
          onConfirm={() => {
            setConfirmed({ ...confirmed, [MEP_CONFLICTS[step].id]: true });
            setStep((s) => s + 1);
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {allDone && (
        <SummaryPanel
          picked={picked as Record<number, Letter>}
          solarPicked={solarPicked}
          onContinue={onComplete}
        />
      )}
    </TaskFrame>
  );
}

function Stepper({ step, confirmed }: { step: number; confirmed: Record<number, boolean> }) {
  return (
    <div className="flex items-center gap-2 my-2">
      {MEP_CONFLICTS.map((c, i) => {
        const done = !!confirmed[c.id];
        const active = i === step;
        return (
          <div key={c.id} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "flex items-center gap-2 rounded-[4px] border px-3 py-2 text-[11px] flex-1 transition",
                done
                  ? "border-[#1a3a1a] bg-[#0d1a0d] text-[#7ab87a]"
                  : active
                  ? "border-primary bg-primary/10 text-primary shadow-[0_0_18px_rgba(93,196,254,0.18)]"
                  : "border-[#1d2a5a] bg-[#0f1a3e] text-[#3a4670]",
              )}
            >
              <span className={cn(
                "h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-semibold",
                done ? "border-[#52c47a] bg-[#1a2a1a]" : active ? "border-primary bg-primary/10" : "border-[#2a3a72]",
              )}>
                {done ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="truncate">Conflict {i + 1}</span>
            </div>
            {i < MEP_CONFLICTS.length - 1 && <span className="h-px w-3 bg-[#1d2a5a]" />}
          </div>
        );
      })}
    </div>
  );
}

function ConflictCard({
  conflict,
  picked,
  onPick,
  onConfirm,
}: {
  conflict: typeof MEP_CONFLICTS[number];
  picked: Letter | undefined;
  onPick: (l: Letter) => void;
  onConfirm: () => void;
}) {
  const stats = STATS[conflict.id];
  return (
    <div className="rounded-[7px] border border-[#1d2a5a] bg-[#0f1a3e] p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Section 1 — Situation */}
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.12em] text-primary mb-2">The situation</div>
        <h3 className="text-[16px] font-semibold text-[#e6ecff] mb-4">{conflict.title}</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatBox value={stats.left.value} label={stats.left.label} tone="warn" />
          <StatBox value={stats.right.value} label={stats.right.label} tone="target" />
        </div>
        <p className="text-[12.5px] leading-[1.65] text-[#94a3c4]">{conflict.report}</p>
      </div>

      {/* Section 2 — Decision */}
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.12em] text-primary mb-2">Your decision</div>
        <div className="space-y-2">
          {conflict.options.map((o) => {
            const isSel = picked === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => onPick(o.id)}
                className={cn(
                  "w-full text-left rounded-[6px] border bg-[#152149] p-3 transition flex gap-3 items-start group",
                  isSel
                    ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                    : "border-[#2a3a72] hover:border-primary/50",
                )}
              >
                <span className={cn(
                  "h-8 w-8 shrink-0 rounded-[4px] border flex items-center justify-center text-[12px] font-bold uppercase",
                  isSel ? "border-primary bg-primary/15 text-primary" : "border-[#2a3a72] text-[#94a3c4] group-hover:text-primary group-hover:border-primary/50",
                )}>{o.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-[#e6ecff] leading-[1.55]">{o.text}</div>
                  {picked && (
                    <div className="mt-2 text-[11px] leading-[1.55] text-[#94a3c4] italic">
                      {CONSEQUENCES[conflict.id][o.id]}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 3 — Confirm */}
      <div className="flex items-center justify-end pt-2 border-t border-[#1d2a5a]">
        <button
          type="button"
          disabled={!picked}
          onClick={onConfirm}
          className="inline-flex items-center gap-2 rounded-[4px] bg-primary px-5 py-2 text-[12px] font-semibold text-black hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed border border-primary shadow-[0_0_18px_rgba(93,196,254,0.25)]"
        >
          Confirm decision <ArrowRight className="h-[14px] w-[14px]" />
        </button>
      </div>
    </div>
  );
}

function StatBox({ value, label, tone }: { value: string; label: string; tone: "warn" | "target" }) {
  return (
    <div className={cn(
      "rounded-[6px] border px-4 py-3",
      tone === "warn" ? "border-[#5a3a1a] bg-[#1a1408]" : "border-[#1a3a3a] bg-[#081a1a]",
    )}>
      <div className={cn(
        "text-[26px] font-bold leading-tight",
        tone === "warn" ? "text-[#e0b752]" : "text-[#5dc4fe]",
      )}>{value}</div>
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-[#94a3c4] mt-1">{label}</div>
    </div>
  );
}

function SummaryPanel({
  picked,
  solarPicked,
  onContinue,
}: {
  picked: Record<number, Letter>;
  solarPicked: boolean;
  onContinue: () => void;
}) {
  const removedInverter = picked[3] === "c";
  const contradicts = solarPicked && removedInverter;

  return (
    <div className="rounded-[7px] border border-[#1d2a5a] bg-[#0f1a3e] p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-[10px] uppercase tracking-[0.12em] text-primary mb-3">MEP coordination summary</div>
      <div className="space-y-3">
        {MEP_CONFLICTS.map((c) => {
          const choice = picked[c.id];
          const optText = c.options.find((o) => o.id === choice)?.text ?? "";
          return (
            <div key={c.id} className="rounded-[6px] border border-[#2a3a72] bg-[#152149] p-3">
              <div className="flex items-start gap-3">
                <span className="h-7 w-7 shrink-0 rounded-[4px] border border-primary/50 bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold uppercase">
                  {choice}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-[#e6ecff]">{c.title}</div>
                  <div className="text-[11.5px] text-[#94a3c4] mt-1 leading-[1.5]">{optText}</div>
                  <div className="mt-2 text-[11.5px] text-[#7ab87a] leading-[1.5] italic">
                    Smita Rao: {VERDICTS[c.id][choice]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn(
        "mt-4 rounded-[6px] border px-3 py-3 flex items-start gap-2 text-[12px] leading-[1.5]",
        contradicts
          ? "border-[#5a1a1a] bg-[#1a0808] text-[#e05252]"
          : "border-[#1a3a1a] bg-[#0d1a0d] text-[#7ab87a]",
      )}>
        {contradicts ? <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> : <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />}
        <span>
          {contradicts
            ? "Contradiction flagged: You selected Solar PV in Task 7 but removed the inverter room here. This needs resolution before drawings are issued."
            : "No contradictions with your Task 7 sustainability selections."}
        </span>
      </div>

      <SubmitBar label="Submit MEP Decisions" onSubmit={onContinue} hint="All three conflicts resolved." />
    </div>
  );
}