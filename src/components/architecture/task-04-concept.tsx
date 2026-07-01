import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader } from "./shared";
import { ARCH_TASKS, CONCEPT_OPTIONS } from "./arch-data";

const META = ARCH_TASKS[3];

type OptionId = "A" | "B" | "C" | "D";
type RiskLevel = "red" | "amber" | "green";

type OptionExtras = {
  commitments: string[];
  risk: { budget: RiskLevel; civic: RiskLevel; operational: RiskLevel };
  siteFit: { fact: string; pass: boolean }[];
  challenge: string;
  mentorReact: string;
};

const SITE_FACTS = [
  "3 protected neem trees (TPO)",
  "DP Road civic frontage required",
  "Black cotton soil, engineered foundation",
] as const;

const EXTRAS: Record<OptionId, OptionExtras> = {
  A: {
    commitments: [
      "Your floor plan must wrap the three neem trees.",
      "Your cost plan must include a green roof line item.",
      "Your structural grid cannot be orthogonal.",
    ],
    risk: { budget: "red", civic: "green", operational: "amber" },
    siteFit: [
      { fact: SITE_FACTS[0], pass: true },
      { fact: SITE_FACTS[1], pass: false },
      { fact: SITE_FACTS[2], pass: true },
    ],
    challenge:
      "Which specific neem tree position most constrains your floor plate, north, centre, or south? Why?",
    mentorReact:
      "Good, but the neem trees will test your structural engineer. Flag it early.",
  },
  B: {
    commitments: [
      "Moveable partitions must carry STC 50 acoustic spec.",
      "Only toilets and plant room can be permanently assigned.",
      "Fit-out cost must absorb the hall-to-library conversion hardware.",
    ],
    risk: { budget: "amber", civic: "amber", operational: "red" },
    siteFit: [
      { fact: SITE_FACTS[0], pass: true },
      { fact: SITE_FACTS[1], pass: true },
      { fact: SITE_FACTS[2], pass: false },
    ],
    challenge:
      "Name one NBC 2016 requirement that conflicts with fully moveable partitions.",
    mentorReact:
      "Ambitious. The acoustic specification for moveable walls will drive your cost plan.",
  },
  C: {
    commitments: [
      "Double-height entrance must address DP Road on the east elevation.",
      "Façade must use basalt stone and terracotta as primary materials.",
      "Structural frame must be expressed, not concealed.",
    ],
    risk: { budget: "red", civic: "amber", operational: "amber" },
    siteFit: [
      { fact: SITE_FACTS[0], pass: false },
      { fact: SITE_FACTS[1], pass: true },
      { fact: SITE_FACTS[2], pass: false },
    ],
    challenge:
      "The client said 'not institutional'. Name one material choice that avoids that risk.",
    mentorReact:
      "Strong civic intent. Watch the budget, basalt stone is not cheap.",
  },
  D: {
    commitments: [
      "Floor plan must resolve on a strict 6x6m structural grid.",
      "All services must route through the central spine.",
      "Façade must be standard precast with colour variation only.",
    ],
    risk: { budget: "green", civic: "red", operational: "green" },
    siteFit: [
      { fact: SITE_FACTS[0], pass: false },
      { fact: SITE_FACTS[1], pass: false },
      { fact: SITE_FACTS[2], pass: true },
    ],
    challenge:
      "How does a 6x6m grid accommodate the multipurpose hall's 2,660 sq.ft. minimum? Show the bay count.",
    mentorReact:
      "Disciplined. Make sure the grid doesn't make the hall feel like a warehouse.",
  },
};

const RISK_COLOR: Record<RiskLevel, string> = {
  red: "bg-[#e05252]",
  amber: "bg-[#e0b752]",
  green: "bg-[#52c47a]",
};

const RISK_LABEL: Record<RiskLevel, string> = {
  red: "High",
  amber: "Medium",
  green: "Low",
};

export function ArchTaskFour({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [f1, setF1] = useState("");
  const [f2, setF2] = useState("");
  const [f3, setF3] = useState("");
  const [challengeAns, setChallengeAns] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const sel = selected ? CONCEPT_OPTIONS.find((c) => c.id === selected)! : null;
  const selExtras = selected ? EXTRAS[selected] : null;

  const allFieldsFilled = f1.trim() && f2.trim() && f3.trim();
  const challengeFilled = challengeAns.trim().length > 0 && challengeAns.length <= 60;
  const canSubmit = !!sel && !!allFieldsFilled && challengeFilled;

  function pickOption(id: OptionId) {
    if (id === selected) return;
    setSelected(id);
    setF1("");
    setF2("");
    setF3("");
    setChallengeAns("");
  }

  const assembled = useMemo(() => {
    if (!f1 && !f2 && !f3) return "";
    const a = f1.trim();
    const b = f2.trim();
    const c = f3.trim();
    const parts: string[] = [];
    if (a) parts.push(`This direction responds to the site because ${a}.`);
    if (b) parts.push(`It serves the client and users because ${b}.`);
    if (c) parts.push(`The main trade-off I am accepting is ${c}.`);
    return parts.join(" ");
  }, [f1, f2, f3]);

  if (submitted && sel && selExtras) {
    return (
      <TaskFrame>
        <TaskHeader
          week={META.week}
          taskNumber={META.index}
          duration={META.duration}
          title={META.title}
          deliverable={META.deliverable}
        />
        <div className="rounded-md border border-[#1a3a1a] bg-[#0d1a0d] px-4 py-4">
          <div className="flex items-center gap-2 text-[11px] text-[#52c47a]">
            <CheckCircle2 className="h-4 w-4" />
            <span>CONCEPT DIRECTION LOCKED</span>
          </div>
          <h3 className="mt-2 text-[20px] font-bold text-[#e6ecff]">
            Option {sel.id}, {sel.title}
          </h3>
        </div>

        <SectionHeader>Your design commitments for Tasks 5–7</SectionHeader>
        <ul className="space-y-2">
          {selExtras.commitments.map((c, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-md border border-[#2a3a72] bg-[#0f1a3e] px-3 py-2 text-[12.5px] text-[#e6ecff]"
            >
              <span className="text-primary font-semibold">{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <SectionHeader>Concept statement</SectionHeader>
        <p className="rounded-md border border-[#2a3a72] bg-[#152149] px-3 py-3 text-[13px] leading-[1.7] text-[#e6ecff]">
          {assembled}
        </p>

        <SectionHeader>Architect's question, your answer</SectionHeader>
        <div className="rounded-md border border-[#2a3a72] bg-[#0f1a3e] px-3 py-3">
          <p className="text-[11.5px] text-[#94a3c4] italic">{selExtras.challenge}</p>
          <p className="mt-2 text-[13px] text-[#e6ecff]">{challengeAns}</p>
        </div>

        <div className="rounded-md border border-primary/40 bg-primary/5 px-4 py-3 mt-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold mb-1">
            Kiran Mehta, Principal Architect
          </div>
          <p className="text-[13px] italic text-[#e6ecff]">"{selExtras.mentorReact}"</p>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={onComplete}
            className="inline-flex items-center gap-2 rounded-[4px] bg-primary px-5 py-2 text-[12px] font-semibold text-black border border-primary hover:brightness-110"
          >
            Continue to Task 5 <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </TaskFrame>
    );
  }

  return (
    <TaskFrame>
      <TaskHeader
        week={META.week}
        taskNumber={META.index}
        duration={META.duration}
        title={META.title}
        deliverable={META.deliverable}
      />
      <VoiceNote initials="PN" name="Priya Nair" role="Client · PMC" timestamp="Wed 11:00 · voice msg">
        The Corporation wants something that <strong>feels welcoming, not institutional</strong>. This is a community building, not a government office. The ward councillors have asked that it <strong>does not look like a box.</strong> Budget is firm, but we are not asking for cheap.
      </VoiceNote>

      <SectionHeader hint="Click an option to expand it. Selecting commits you to downstream design constraints in Tasks 5, 6 and 7.">
        Select One Concept Direction
      </SectionHeader>

      {selected === null ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {CONCEPT_OPTIONS.map((c) => (
            <OptionCard key={c.id} option={c} onClick={() => pickOption(c.id)} />
          ))}
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex flex-col gap-2 w-[88px] shrink-0">
            {CONCEPT_OPTIONS.filter((c) => c.id !== selected).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pickOption(c.id as OptionId)}
                className="text-left rounded-md border border-[#2a3a72] bg-[#0f1a3e] px-2 py-2 hover:border-primary/50 transition"
              >
                <div className="text-[9px] uppercase tracking-[0.18em] text-primary font-semibold">
                  Opt {c.id}
                </div>
                <div className="mt-1 text-[10.5px] text-[#c4cfe6] leading-tight line-clamp-3">
                  {c.title}
                </div>
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <ExpandedOption option={sel!} extras={selExtras!} />
          </div>
        </div>
      )}

      {sel && selExtras && (
        <>
          <SectionHeader hint="Each field has a strict character limit. Build the statement piece by piece.">
            Structured Concept Statement
          </SectionHeader>

          <MiniField
            label="This direction responds to the site because…"
            value={f1}
            onChange={setF1}
            max={80}
            placeholder="Reference a specific site constraint from Task 2"
          />
          <MiniField
            label="It serves the client and users because…"
            value={f2}
            onChange={setF2}
            max={100}
            placeholder="Name at least one persona from the brief"
          />
          <MiniField
            label="The main trade-off I am accepting is…"
            value={f3}
            onChange={setF3}
            max={80}
            placeholder="Reference a risk shown on the card you selected"
          />


          {allFieldsFilled && (
            <>
              <SectionHeader>Architect's Question, Evidence Check</SectionHeader>
              <div className="rounded-md border border-[#e0b752]/40 bg-[#e0b752]/5 px-3 py-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#e0b752] font-semibold mb-1">
                  Kiran Mehta asks
                </div>
                <p className="text-[13px] text-[#e6ecff] mb-3">{selExtras.challenge}</p>
                <input
                  type="text"
                  value={challengeAns}
                  maxLength={60}
                  onChange={(e) => setChallengeAns(e.target.value)}
                  placeholder="Answer in under 60 characters"
                  className="w-full rounded-[3px] bg-[#0a1024] border border-[#2a3a72] px-3 py-2 text-[13px] text-[#e6ecff] placeholder:text-[#5a6a92] focus:outline-none focus:border-primary/60"
                />
                <div className="mt-1 text-[10px] text-right text-[#5a6a92]">
                  {challengeAns.length}/60
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1d2a5a] pt-4 mt-3">
            <p className="text-[11px] text-[#94a3c4]">
              {!allFieldsFilled
                ? "Fill all three statement fields to unlock the architect's question."
                : !challengeFilled
                ? "Answer the architect's question first."
                : "Ready to lock your concept direction."}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!canSubmit}
              title={!canSubmit ? "Answer the architect's question first." : undefined}
              className="inline-flex items-center gap-2 rounded-[4px] bg-primary px-5 py-2 text-[12px] font-semibold text-black border border-primary hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_18px_rgba(93,196,254,0.25)]"
            >
              Submit Concept Direction <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </TaskFrame>
  );
}

function OptionCard({
  option,
  onClick,
}: {
  option: (typeof CONCEPT_OPTIONS)[number];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-[#2a3a72] bg-[#0f1a3e] p-4 hover:border-primary/60 hover:bg-[#152149] transition"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Option {option.id}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#94a3c4]">
          {option.tagline}
        </span>
      </div>
      <h4 className="mt-2 text-[17px] font-semibold text-[#e6ecff]">{option.title}</h4>
      <p className="mt-2 text-[12.5px] text-[#c4cfe6] leading-relaxed">{option.description}</p>
    </button>
  );
}

function ExpandedOption({
  option,
  extras,
}: {
  option: (typeof CONCEPT_OPTIONS)[number];
  extras: OptionExtras;
}) {
  return (
    <div className="rounded-xl border-2 border-primary/60 bg-[#152149] p-4 ring-2 ring-primary/20">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
          Option {option.id} · Selected
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#94a3c4]">
          {option.tagline}
        </span>
      </div>
      <h4 className="mt-2 text-[20px] font-bold text-[#e6ecff]">{option.title}</h4>
      <p className="mt-2 text-[13px] text-[#c4cfe6] leading-relaxed">{option.description}</p>

      <div className="mt-4">
        <div className="text-[9px] uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          What this commits you to
        </div>
        <ul className="space-y-1.5">
          {extras.commitments.map((c, i) => (
            <li key={i} className="flex gap-2 text-[12.5px] text-[#e6ecff]">
              <span className="text-primary mt-[2px]">▸</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="text-[9px] uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          Risk Meter
        </div>
        <div className="grid grid-cols-3 gap-2">
          <RiskSegment label="Budget pressure" level={extras.risk.budget} />
          <RiskSegment label="Civic approval" level={extras.risk.civic} />
          <RiskSegment label="Operational complexity" level={extras.risk.operational} />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[9px] uppercase tracking-[0.18em] text-primary font-semibold mb-2">
          Site Fit Check
        </div>
        <ul className="space-y-1">
          {extras.siteFit.map((s, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-[12px] text-[#e6ecff] py-1 border-b border-[#1d2a5a] last:border-0"
            >
              {s.pass ? (
                <CheckCircle2 className="h-4 w-4 text-[#52c47a] shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-[#e05252] shrink-0" />
              )}
              <span>{s.fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RiskSegment({ label, level }: { label: string; level: RiskLevel }) {
  return (
    <div className="rounded-md border border-[#2a3a72] bg-[#0f1a3e] px-2 py-2">
      <div className="text-[9.5px] uppercase tracking-[0.1em] text-[#94a3c4] mb-1.5 leading-tight">
        {label}
      </div>
      <div className="h-1.5 rounded-full bg-[#0a1024] overflow-hidden">
        <div
          className={cn(
            "h-full",
            RISK_COLOR[level],
            level === "green" ? "w-1/3" : level === "amber" ? "w-2/3" : "w-full",
          )}
        />
      </div>
      <div className="mt-1 text-[10px] font-semibold" style={{
        color: level === "red" ? "#e05252" : level === "amber" ? "#e0b752" : "#52c47a",
      }}>
        {RISK_LABEL[level]}
      </div>
    </div>
  );
}

function MiniField({
  label,
  value,
  onChange,
  max,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  placeholder: string;
}) {
  const over = value.length > max;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-medium text-[#e6ecff]">{label}</label>
        <span className={cn("text-[10px]", over ? "text-[#e05252]" : "text-[#5a6a92]")}>
          {value.length}/{max}
        </span>
      </div>
      <input
        type="text"
        value={value}
        maxLength={max}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[3px] bg-[#0a1024] border border-[#2a3a72] px-3 py-2 text-[13px] text-[#e6ecff] placeholder:text-[#5a6a92] focus:outline-none focus:border-primary/60"
      />
    </div>
  );
}