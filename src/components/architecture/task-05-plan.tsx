import { useState, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Lock, Upload, XCircle, X as XIcon, Linkedin, Copy, Check, Download } from "lucide-react";
import html2canvas from "html2canvas";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  SectionHeader,
  SubmitBar,
  MentorPrinciple,
} from "./shared";
import { ARCH_TASKS } from "./arch-data";

const META = ARCH_TASKS[4];

const FLOORPLAN_CAPTION = `Just completed Phase 3 of my Architecture Design Internship simulation — designing a Community Learning Hub

This is my schematic floor plan: a 12,000–15,000 sq.ft. building working around three protected neem trees, a strict 8.1cr budget, and a brief that demanded the entrance face DP Road while keeping the library acoustically separated from a 300-person multipurpose hall.

Every space on this plan had to be justified against real site data, client personas, and adjacency rules before it could go anywhere near a drawing.

#ArchitectureStudent #DesignThinking #Internship #Architecture #SpacePlanning`;

type FootprintId = "compact" | "pavilion" | "lshape";

const FOOTPRINTS: {
  id: FootprintId;
  label: string;
  tagline: string;
  dims: string;
  storeys: string;
  bullets: string[];
  consequence: string;
  reaction: string;
  // SVG footprint coords inside 200x200 site box (site = 10..190)
  draw: (color: string) => ReactNode;
}[] = [
  {
    id: "compact",
    label: "Compact tower",
    tagline: "Small footprint, 3 storeys",
    dims: "~45m × 25m",
    storeys: "3 storeys",
    bullets: [
      "Keeps maximum soft landscaping",
      "Higher structural cost per floor",
      "Tight core, vertical circulation heavy",
    ],
    consequence:
      "Hall stacks vertically — needs transfer structure. Neem trees fully protected on west boundary. DP Road frontage stays generous and open.",
    reaction:
      "Tight footprint, your structural engineer will thank you, your landscaping team won't.",
    draw: (color) => (
      <rect x="70" y="80" width="70" height="50" rx="3" fill={color} fillOpacity="0.55" stroke={color} />
    ),
  },
  {
    id: "pavilion",
    label: "Spread pavilion",
    tagline: "Large single-storey footprint",
    dims: "~55m × 40m",
    storeys: "1 storey",
    bullets: [
      "Lower build cost, easier daylighting",
      "Uses more site, less landscaping",
      "Long corridors — circulation tax",
    ],
    consequence:
      "Hall sits at grade with easy load-in. Neem trees crowded — root protection zones must be respected. DP Road frontage filled by long building face.",
    reaction:
      "Good natural light strategy. Watch your circulation distances, long single-storey buildings waste GFA on corridors.",
    draw: (color) => (
      <rect x="40" y="55" width="120" height="90" rx="3" fill={color} fillOpacity="0.55" stroke={color} />
    ),
  },
  {
    id: "lshape",
    label: "L-shaped courtyard",
    tagline: "Two wings forming an L",
    dims: "~50m × 50m (L)",
    storeys: "2 storeys",
    bullets: [
      "Sheltered outdoor courtyard",
      "Separates noisy and quiet zones",
      "Medium cost, medium landscaping",
    ],
    consequence:
      "Hall lands in the long wing, library in the short wing — natural acoustic separation. Neem trees frame the courtyard edge. DP Road frontage uses the long wing.",
    reaction:
      "Strong move for acoustic separation. The courtyard needs to earn its area in the cost plan.",
    draw: (color) => (
      <path
        d="M40,55 L160,55 L160,110 L100,110 L100,150 L40,150 Z"
        fill={color}
        fillOpacity="0.55"
        stroke={color}
      />
    ),
  },
];

type ZoneId = "FE" | "FC" | "FW" | "RE" | "RC" | "RW";
const ZONES: { id: ZoneId; label: string; x: number; y: number; w: number; h: number }[] = [
  { id: "FE", label: "Front-East", x: 140, y: 30, w: 50, h: 70 },
  { id: "FC", label: "Front-Centre", x: 80, y: 30, w: 60, h: 70 },
  { id: "FW", label: "Front-West", x: 30, y: 30, w: 50, h: 70 },
  { id: "RE", label: "Rear-East", x: 140, y: 100, w: 50, h: 70 },
  { id: "RC", label: "Rear-Centre", x: 80, y: 100, w: 60, h: 70 },
  { id: "RW", label: "Rear-West", x: 30, y: 100, w: 50, h: 70 },
];

type PlacementKey = "lobby" | "hall" | "library" | "cafe" | "plant" | "neem";
const PLACEMENT_QUESTIONS: {
  key: PlacementKey;
  prompt: string;
  correct: ZoneId[];
  type: "public" | "support" | "service" | "nature";
  label: string;
  wrongFeedback: Partial<Record<ZoneId, string>>;
  defaultWrong: string;
}[] = [
  {
    key: "lobby",
    prompt: "Where does the main lobby go?",
    correct: ["FE"],
    type: "public",
    label: "Main lobby",
    wrongFeedback: {},
    defaultWrong:
      "The client brief requires the main entrance to face DP Road (east). The lobby anchors this.",
  },
  {
    key: "hall",
    prompt: "Where does the multipurpose hall go?",
    correct: ["RE", "FC"],
    type: "public",
    label: "Multipurpose hall",
    wrongFeedback: {
      RW: "Rear-West puts the hall adjacent to the park side, evening visitors would have no direct street access.",
    },
    defaultWrong:
      "The hall needs independent evening access from the street. Front-Centre or Rear-East work, anything else cuts it off.",
  },
  {
    key: "library",
    prompt: "Where does the library quiet zone go?",
    correct: ["FW", "RW", "RC"],
    type: "support",
    label: "Library",
    wrongFeedback: {},
    defaultWrong:
      "Library adjacent to hall, acoustic separation fails. NBC 2016 requires min 2 rooms between.",
  },
  {
    key: "cafe",
    prompt: "Where does the café go?",
    correct: ["FW", "RW"],
    type: "support",
    label: "Café",
    wrongFeedback: {},
    defaultWrong:
      "Café must sit next to the hall zone with access to outdoor space, the event-catering brief requires a west-facing zone.",
  },
  {
    key: "plant",
    prompt: "Where does the plant room go?",
    correct: ["RC", "RW"],
    type: "service",
    label: "Plant room",
    wrongFeedback: {},
    defaultWrong:
      "Plant rooms need service-only access at the rear, away from any public-facing zone.",
  },
  {
    key: "neem",
    prompt: "Which zone do the three neem trees occupy?",
    correct: ["FW", "RW"],
    type: "nature",
    label: "Neem trees",
    wrongFeedback: {},
    defaultWrong:
      "The TPO order from Task 2 fixes the neem trees on the west boundary, they cannot be moved.",
  },
];

const TYPE_COLORS: Record<string, string> = {
  public: "#5299e0",
  support: "#52c47a",
  service: "#e0a352",
  nature: "#7ab87a",
  circulation: "#94a3c4",
};

const CHECKS: {
  key: string;
  title: string;
  scenario: string;
  options: { id: "A" | "B" | "C"; text: string }[];
  correct: "A" | "B" | "C";
  explain: string;
}[] = [
  {
    key: "acoustic",
    title: "Acoustic separation",
    scenario:
      "Your library is in the north wing. The hall is directly south, one room away, sharing a wall with a storage room between them. Does this satisfy the acoustic separation rule?",
    options: [
      { id: "A", text: "Yes, one room between is sufficient." },
      { id: "B", text: "No, minimum 2 rooms required, or acoustic-rated partition to STC 50." },
      { id: "C", text: "It depends on the partition material." },
    ],
    correct: "B",
    explain:
      "NBC 2016 expects either 2 rooms of buffer or a partition rated to STC 50. One storage room alone leaks noise.",
  },
  {
    key: "circulation",
    title: "Circulation efficiency",
    scenario:
      "Your total GFA is 13,500 sq.ft. You've allocated 3,100 sq.ft. to corridors, stairs, and structure. Is this within the 18–22% circulation target?",
    options: [
      { id: "A", text: "Yes, 3,100 is within range." },
      { id: "B", text: "No, 3,100 is 23%, slightly over." },
      { id: "C", text: "Yes, 22% is the floor not the ceiling." },
    ],
    correct: "B",
    explain: "3,100 / 13,500 = 22.96%. You're 1% over, trim a corridor or widen a usable room.",
  },
  {
    key: "egress",
    title: "Egress compliance",
    scenario:
      "Your hall holds 300 people. You have one 1,200mm exit door at the front and one 900mm emergency exit at the rear. Is this NBC 2016 compliant?",
    options: [
      { id: "A", text: "Yes, two exits are always sufficient." },
      {
        id: "B",
        text: "No, 300 occupants require minimum aggregate exit width of 1,500mm plus the exits must be on opposite sides.",
      },
      { id: "C", text: "Yes, as long as both doors open outward." },
    ],
    correct: "B",
    explain:
      "Aggregate width = 300 × 5mm = 1,500mm minimum, and exits must be remote from each other. 1,200 + 900 = 2,100mm passes width, but the layout must be opposite-sided.",
  },
  {
    key: "structure",
    title: "Structural logic",
    scenario:
      "You're using a 6m × 6m column grid. Your hall needs to be 30m × 18m column-free. What structural solution do you specify?",
    options: [
      { id: "A", text: "Remove interior columns and use standard beams." },
      { id: "B", text: "Specify a long-span roof truss or transfer structure and note it in the drawings." },
      { id: "C", text: "Break the hall into two 15m × 18m rooms with a column in the middle." },
    ],
    correct: "B",
    explain:
      "Standard beams won't span 18m. The hall stays column-free only with a long-span truss or transfer slab, and it must be on the drawings for the structural engineer.",
  },
  {
    key: "access",
    title: "Independent access",
    scenario:
      "It is 7pm. A community group is using the hall. The café is open for event catering. Should reception staff be present?",
    options: [
      { id: "A", text: "Yes, reception must always be staffed when the building is occupied." },
      {
        id: "B",
        text: "No, the hall and café must have independent access so they operate without reception being open.",
      },
      { id: "C", text: "Only if more than 50 people are present." },
    ],
    correct: "B",
    explain:
      "The brief calls for after-hours hall + café operation without staffing the main reception. Independent access is the whole point.",
  },
];

function Stepper({ step, completed }: { step: number; completed: Set<number> }) {
  const steps = [
    "Floor Plate",
    "Space Placement",
    "Design Checks",
    "AI Visualisation",
  ];
  return (
    <div className="flex items-center gap-2 rounded-[7px] border border-[#1d2a5a] bg-[#0f1a3e] px-3 py-3">
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = completed.has(idx);
        const active = step === idx;
        return (
          <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={cn(
                "h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold border",
                done
                  ? "bg-primary/20 border-primary text-primary"
                  : active
                    ? "bg-primary text-[#000] border-primary"
                    : "bg-transparent border-[#2a3a72] text-[#3a4670]",
              )}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx}
            </div>
            <div className="min-w-0">
              <div className={cn("text-[9px] uppercase tracking-[0.1em]", active || done ? "text-primary" : "text-[#3a4670]")}>
                Step {idx}
              </div>
              <div className={cn("text-[11px] font-medium truncate", active || done ? "text-[#e6ecff]" : "text-[#94a3c4]")}>{s}</div>
            </div>
            {idx < 4 && <div className={cn("flex-1 h-px", done ? "bg-primary/60" : "bg-[#1d2a5a]")} />}
          </div>
        );
      })}
    </div>
  );
}

function FootprintCard({
  fp,
  selected,
  onSelect,
}: {
  fp: (typeof FOOTPRINTS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const color = "#5dc4fe";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "text-left rounded-[7px] border bg-[#0f1a3e] p-3 transition flex flex-col gap-2",
        selected
          ? "border-primary shadow-[0_0_0_1px_var(--primary)]"
          : "border-[#1d2a5a] hover:border-[#2a3a72]",
      )}
    >
      <svg viewBox="0 0 200 200" className="w-full h-32 bg-[#070a1c] rounded">
        <rect x="10" y="10" width="180" height="180" fill="none" stroke="#2a3a72" strokeDasharray="4 3" />
        <text x="100" y="9" fontSize="7" textAnchor="middle" fill="#3a4670">Site 68m × 71m</text>
        {fp.draw(color)}
        <text x="100" y="198" fontSize="7" textAnchor="middle" fill="#94a3c4">{fp.dims}</text>
      </svg>
      <div>
        <div className="text-[12px] font-semibold text-[#e6ecff]">{fp.label}</div>
        <div className="text-[10px] text-[#94a3c4]">{fp.tagline} · {fp.storeys}</div>
      </div>
      <ul className="text-[11px] text-[#94a3c4] space-y-0.5">
        {fp.bullets.map((b) => (
          <li key={b}>· {b}</li>
        ))}
      </ul>
      {selected && (
        <div className="mt-1 rounded border border-primary/40 bg-primary/10 px-2.5 py-2 text-[11px] text-[#e6ecff] leading-[1.5]">
          {fp.consequence}
        </div>
      )}
    </button>
  );
}

function ZoneGrid({
  highlight,
  selectable,
  onSelect,
  placements = {},
}: {
  highlight?: ZoneId | null;
  selectable?: boolean;
  onSelect?: (z: ZoneId) => void;
  placements?: Partial<Record<PlacementKey, ZoneId>>;
}) {
  const placedBy: Partial<Record<ZoneId, PlacementKey[]>> = {};
  (Object.entries(placements) as [PlacementKey, ZoneId][]).forEach(([k, z]) => {
    if (!z) return;
    placedBy[z] = [...(placedBy[z] || []), k];
  });
  return (
    <svg viewBox="0 0 220 200" className="w-full h-64 bg-[#070a1c] rounded border border-[#1d2a5a]">
      <text x="205" y="105" fontSize="8" textAnchor="middle" fill="#5dc4fe">E</text>
      <text x="15" y="105" fontSize="8" textAnchor="middle" fill="#3a4670">W</text>
      <text x="110" y="20" fontSize="8" textAnchor="middle" fill="#3a4670">N</text>
      <text x="110" y="195" fontSize="8" textAnchor="middle" fill="#3a4670">S</text>
      <text x="210" y="170" fontSize="7" textAnchor="end" fill="#5dc4fe">DP Road →</text>
      {ZONES.map((z) => {
        const placements = placedBy[z.id] || [];
        const isHighlight = highlight === z.id;
        return (
          <g key={z.id} onClick={() => selectable && onSelect?.(z.id)} style={{ cursor: selectable ? "pointer" : "default" }}>
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              fill={isHighlight ? "rgba(93,196,254,0.25)" : "#0f1a3e"}
              stroke={isHighlight ? "#5dc4fe" : "#1d2a5a"}
              className={selectable ? "hover:stroke-primary" : ""}
            />
            <text x={z.x + z.w / 2} y={z.y + 11} fontSize="7" textAnchor="middle" fill="#94a3c4">
              {z.label}
            </text>
            {placements.map((k, i) => {
              const q = PLACEMENT_QUESTIONS.find((p) => p.key === k)!;
              return (
                <text
                  key={k}
                  x={z.x + z.w / 2}
                  y={z.y + 26 + i * 11}
                  fontSize="8"
                  textAnchor="middle"
                  fill={TYPE_COLORS[q.type]}
                  fontWeight="600"
                >
                  {q.label}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function StepLock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[7px] border border-dashed border-[#1d2a5a] bg-[#0a1230] px-4 py-6 flex items-center gap-2 text-[#3a4670] text-[12px]">
      <Lock className="h-4 w-4" />
      {children}
    </div>
  );
}

function PlacementQuiz({
  onComplete,
}: {
  onComplete: (placements: Record<PlacementKey, ZoneId>, correctCount: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [placements, setPlacements] = useState<Partial<Record<PlacementKey, ZoneId>>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [picked, setPicked] = useState<ZoneId | null>(null);

  const q = PLACEMENT_QUESTIONS[idx];

  const handlePick = (z: ZoneId) => {
    if (feedback?.kind === "ok") return;
    setPicked(z);
    if (q.correct.includes(z)) {
      setFeedback({ kind: "ok", msg: "Correct, placed." });
    } else {
      const msg = q.wrongFeedback[z] || q.defaultWrong;
      setFeedback({ kind: "err", msg });
    }
  };

  const handleNext = () => {
    if (!picked || !feedback) return;
    const accepted = feedback.kind === "ok" ? picked : q.correct[0];
    const newPlacements = { ...placements, [q.key]: accepted };
    const newCorrect = correctCount + (feedback.kind === "ok" ? 1 : 0);
    setPlacements(newPlacements);
    setCorrectCount(newCorrect);
    setPicked(null);
    setFeedback(null);
    if (idx + 1 >= PLACEMENT_QUESTIONS.length) {
      onComplete(newPlacements as Record<PlacementKey, ZoneId>, newCorrect);
    } else {
      setIdx(idx + 1);
    }
  };

  const handleRetry = () => {
    setPicked(null);
    setFeedback(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] text-[#94a3c4]">
        <span>Question {idx + 1} of {PLACEMENT_QUESTIONS.length}</span>
        <span>{correctCount} correct so far</span>
      </div>
      <div className="text-[13px] font-medium text-[#e6ecff]">{q.prompt}</div>
      <ZoneGrid highlight={picked} selectable onSelect={handlePick} placements={placements} />
      {feedback && (
        <div
          className={cn(
            "rounded border px-3 py-2 text-[11.5px] leading-[1.6]",
            feedback.kind === "ok"
              ? "border-[#1a3a1a] bg-[#0d1a0d] text-[#7ab87a]"
              : "border-[#5a1a1a] bg-[#1a0808] text-[#e98787]",
          )}
        >
          {feedback.msg}
        </div>
      )}
      <div className="flex justify-end gap-2">
        {feedback?.kind === "err" && (
          <button
            type="button"
            onClick={handleRetry}
            className="rounded border border-[#2a3a72] px-3 py-1.5 text-[11.5px] text-[#94a3c4] hover:text-primary hover:border-primary/40"
          >
            Try again
          </button>
        )}
        {feedback && (
          <button
            type="button"
            onClick={handleNext}
            className="rounded bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-[#000]"
          >
            {idx + 1 >= PLACEMENT_QUESTIONS.length ? "Finish placement" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}

function DesignChecks({ onComplete }: { onComplete: () => void }) {
  const [picks, setPicks] = useState<Record<string, "A" | "B" | "C">>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const allSolved = CHECKS.every((c) => solved[c.key] || revealed[c.key]);

  const handlePick = (key: string, opt: "A" | "B" | "C") => {
    const check = CHECKS.find((c) => c.key === key)!;
    setPicks((p) => ({ ...p, [key]: opt }));
    const correct = opt === check.correct;
    const n = (attempts[key] || 0) + 1;
    setAttempts((a) => ({ ...a, [key]: n }));
    if (correct) {
      setSolved((s) => ({ ...s, [key]: true }));
    } else if (n >= 2) {
      setRevealed((r) => ({ ...r, [key]: true }));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[11px] text-[#94a3c4]">
        <span>Progress:</span>
        {CHECKS.map((c) => (
          <span
            key={c.key}
            className={cn(
              "h-2 w-6 rounded",
              solved[c.key]
                ? "bg-[#52c47a]"
                : revealed[c.key]
                  ? "bg-[#e0a352]"
                  : "bg-[#1d2a5a]",
            )}
          />
        ))}
      </div>
      {CHECKS.map((c) => {
        const pick = picks[c.key];
        const isSolved = solved[c.key];
        const isRevealed = revealed[c.key];
        return (
          <div key={c.key} className="rounded-[7px] border border-[#1d2a5a] bg-[#0f1a3e] p-3">
            <div className="flex items-center gap-2 mb-1">
              {isSolved ? (
                <CheckCircle2 className="h-4 w-4 text-[#52c47a]" />
              ) : isRevealed ? (
                <XCircle className="h-4 w-4 text-[#e0a352]" />
              ) : (
                <Circle className="h-4 w-4 text-[#3a4670]" />
              )}
              <div className="text-[12px] font-semibold text-[#e6ecff]">{c.title}</div>
            </div>
            <div className="text-[11.5px] text-[#94a3c4] leading-[1.6] mb-2">{c.scenario}</div>
            <div className="grid gap-1.5">
              {c.options.map((o) => {
                const isPick = pick === o.id;
                const showCorrect = (isSolved || isRevealed) && o.id === c.correct;
                const showWrong = isPick && !isSolved && pick !== c.correct;
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={isSolved || isRevealed}
                    onClick={() => handlePick(c.key, o.id)}
                    className={cn(
                      "text-left rounded border px-3 py-2 text-[11.5px] transition",
                      showCorrect
                        ? "border-[#52c47a] bg-[#0d1a0d] text-[#7ab87a]"
                        : showWrong
                          ? "border-[#5a1a1a] bg-[#1a0808] text-[#e98787]"
                          : "border-[#1d2a5a] bg-[#070a1c] text-[#e6ecff] hover:border-[#2a3a72]",
                    )}
                  >
                    <span className="font-semibold mr-2">{o.id}.</span>
                    {o.text}
                  </button>
                );
              })}
            </div>
            {(isSolved || isRevealed) && (
              <div className="mt-2 text-[11px] text-[#94a3c4] leading-[1.6]">
                <span className={isSolved ? "text-[#7ab87a]" : "text-[#e0a352]"}>
                  {isSolved ? "Correct. " : `Answer: ${c.correct}. `}
                </span>
                {c.explain}
              </div>
            )}
          </div>
        );
      })}
      <div className="flex justify-end">
        <button
          type="button"
          disabled={!allSolved}
          onClick={onComplete}
          className="rounded bg-primary px-4 py-1.5 text-[11.5px] font-semibold text-[#000] disabled:opacity-40"
        >
          Continue to visualisation
        </button>
      </div>
    </div>
  );
}

function GeneratedFloorPlan({
  footprint,
  placements,
}: {
  footprint: FootprintId;
  placements: Record<PlacementKey, ZoneId>;
}) {
  return (
    <div>
      <ZoneGrid placements={placements} />
      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[#94a3c4]">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#5299e0]" /> Public</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#52c47a]" /> Support</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#e0a352]" /> Service</span>
        <span className="ml-auto">Scale ≈ 1:300 · {footprint === "compact" ? "3 storeys stacked" : footprint === "pavilion" ? "single storey" : "2 storeys, L"}</span>
      </div>
    </div>
  );
}

function MassingView({ footprint }: { footprint: FootprintId }) {
  // simple isometric block diagram
  const blocks = footprint === "compact" ? 3 : footprint === "pavilion" ? 1 : 2;
  return (
    <svg viewBox="0 0 240 180" className="w-full h-56 bg-[#070a1c] rounded border border-[#1d2a5a]">
      {/* ground */}
      <polygon points="20,150 220,150 200,170 40,170" fill="#0f1a3e" stroke="#1d2a5a" />
      {/* DP road */}
      <text x="225" y="160" fontSize="7" textAnchor="end" fill="#5dc4fe">DP Road (E)</text>
      {/* neem trees on west boundary */}
      {[30, 60, 90].map((y) => (
        <circle key={y} cx={45} cy={150 - 0} r={6} fill="#52c47a" fillOpacity="0.7" />
      ))}
      <text x="45" y="173" fontSize="6" textAnchor="middle" fill="#7ab87a">neem ×3</text>
      {/* stacked massing blocks */}
      {Array.from({ length: blocks }).map((_, i) => {
        const baseY = 140 - i * 24;
        const w = footprint === "pavilion" ? 140 : footprint === "lshape" ? 110 : 80;
        const x = 70;
        return (
          <g key={i}>
            <polygon
              points={`${x},${baseY} ${x + w},${baseY} ${x + w - 18},${baseY + 18} ${x - 18},${baseY + 18}`}
              fill="#152149"
              stroke="#5dc4fe"
            />
            <polygon
              points={`${x + w},${baseY} ${x + w},${baseY - 22} ${x + w - 18},${baseY - 4} ${x + w - 18},${baseY + 18}`}
              fill="#0f1a3e"
              stroke="#5dc4fe"
            />
            <polygon
              points={`${x},${baseY} ${x + w},${baseY} ${x + w},${baseY - 22} ${x},${baseY - 22}`}
              fill="#1a2a5a"
              stroke="#5dc4fe"
            />
          </g>
        );
      })}
      {footprint === "lshape" && (
        <polygon
          points="180,140 220,140 220,118 180,118"
          fill="#1a2a5a"
          stroke="#5dc4fe"
        />
      )}
      {/* entrance canopy */}
      <rect x="195" y="135" width="14" height="6" fill="#5dc4fe" />
      <text x="202" y="132" fontSize="6" textAnchor="middle" fill="#5dc4fe">entry</text>
    </svg>
  );
}

function Step4({
  footprint,
  placements,
  onSubmit,
}: {
  footprint: FootprintId;
  placements: Record<PlacementKey, ZoneId>;
  onSubmit: () => void;
}) {
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [planPreview, setPlanPreview] = useState<string | null>(null);
  const [massFile, setMassFile] = useState<File | null>(null);
  const [massPreview, setMassPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ready = !!planFile && !!massFile;

  const handleFile = (
    file: File | undefined,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void,
  ) => {
    setError(null);
    if (!file) return;
    const okTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!okTypes.includes(file.type)) {
      setError("Unsupported file. Use PNG, JPG, or PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB.");
      return;
    }
    setFile(file);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const uploads: {
    id: string;
    label: string;
    helper: string;
    reference: React.ReactNode;
    referenceCaption: string;
    file: File | null;
    preview: string | null;
    onChange: (f: File | undefined) => void;
    onClear: () => void;
  }[] = [
    {
      id: "plan",
      label: "Upload your schematic floor plan",
      helper:
        "No SketchUp or Revit? That's fine. You can generate this in ChatGPT, describe your zone layout from Step 2 and ask it to produce a labelled top-view floor plan. Screenshot or export it as PNG or PDF.",
      reference: <GeneratedFloorPlan footprint={footprint} placements={placements} />,
      referenceCaption: "Your target layout, does your uploaded plan match these placements?",
      file: planFile,
      preview: planPreview,
      onChange: (f) => handleFile(f, setPlanFile, setPlanPreview),
      onClear: () => {
        if (planPreview) URL.revokeObjectURL(planPreview);
        setPlanFile(null);
        setPlanPreview(null);
      },
    },
    {
      id: "mass",
      label: "Upload your 3D massing view",
      helper:
        "Ask ChatGPT or any AI image tool to generate a simple isometric massing diagram of your chosen footprint, label DP Road on the east, show the correct number of storeys, and mark the neem trees on the west boundary. Screenshot and upload.",
      reference: <MassingView footprint={footprint} />,
      referenceCaption: "Your target massing, 3 storeys, neem trees west, entry east.",
      file: massFile,
      preview: massPreview,
      onChange: (f) => handleFile(f, setMassFile, setMassPreview),
      onClear: () => {
        if (massPreview) URL.revokeObjectURL(massPreview);
        setMassFile(null);
        setMassPreview(null);
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-[7px] border border-primary/40 bg-primary/10 px-3 py-3 text-[12px] leading-[1.6] text-[#e6ecff]">
        Professional drawings take years to master. What matters here is that your spatial thinking is correct. Upload your own drawings against the reference visualisations generated from your decisions in Steps 1–3.
      </div>
      <div className="space-y-4">
        {uploads.map((u) => (
          <div key={u.id} className="rounded-[7px] border border-[#1d2a5a] bg-[#0f1a3e] p-3 space-y-3">
            <div>
              <div className="text-[12px] font-semibold text-[#e6ecff]">{u.label}</div>
              <p className="mt-1 text-[10.5px] leading-[1.55] text-[#94a3c4]">{u.helper}</p>
              <p className="mt-1 text-[10px] text-[#3a4670]">Accepted: PNG, JPG, PDF. Max 10MB.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                {u.reference}
                <p className="text-[10px] text-[#94a3c4] italic">{u.referenceCaption}</p>
              </div>
              <div className="space-y-1">
                {u.file ? (
                  <div className="relative rounded border border-[#1d2a5a] bg-[#070a1c] p-2 flex items-center justify-center min-h-[160px]">
                    <button
                      type="button"
                      onClick={u.onClear}
                      className="absolute top-1 right-1 rounded bg-[#0f1a3e] border border-[#1d2a5a] p-1 text-[#94a3c4] hover:text-[#e6ecff]"
                      aria-label="Remove file"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                    {u.preview ? (
                      <img src={u.preview} alt="Uploaded preview" className="max-h-[180px] w-auto object-contain" />
                    ) : (
                      <div className="text-[11px] text-[#94a3c4] text-center px-2">
                        <div className="font-semibold text-[#e6ecff] mb-1">PDF uploaded</div>
                        <div className="truncate max-w-[200px]">{u.file.name}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 cursor-pointer min-h-[160px] px-3 py-4 text-center transition">
                    <Upload className="h-5 w-5 text-primary" />
                    <div className="text-[11.5px] font-semibold text-primary">Click to upload</div>
                    <div className="text-[10px] text-[#94a3c4]">PNG, JPG, or PDF up to 10MB</div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      className="hidden"
                      onChange={(e) => u.onChange(e.target.files?.[0])}
                    />
                  </label>
                )}
                <p className="text-[10px] text-[#3a4670] italic">
                  {u.file ? `Uploaded: ${u.file.name}` : "Your upload appears here."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="rounded border border-[#5a1a1a] bg-[#1a0808] px-3 py-2 text-[11px] text-[#e05252]">{error}</div>
      )}
      <p className="text-[11px] text-[#94a3c4] italic">
        The goal here is not a perfect drawing, it is proof that you understand where every space goes and why. Your placement decisions from Steps 1–3 are the real deliverable. The drawing makes them visible.
      </p>
      <SubmitBar
        label="Submit Schematic Floor Plan"
        onSubmit={onSubmit}
        disabled={!ready}
        hint={ready ? "Both drawings uploaded." : "Upload both your floor plan and massing view to submit."}
      />
    </div>
  );
}

export function ArchTaskFive({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [footprint, setFootprint] = useState<FootprintId | null>(null);
  const [placements, setPlacements] = useState<Record<PlacementKey, ZoneId> | null>(null);
  const [placementScore, setPlacementScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const markStep = (n: number) => setCompleted((s) => new Set(s).add(n));

  return (
    <TaskFrame>
      <TaskHeader
        week={META.week}
        taskNumber={META.index}
        duration={META.duration}
        title={META.title}
        deliverable={META.deliverable}
      />
      <MentorPrinciple>
        A design is not real until tested spatially, structurally and financially. Concepts become geometry, and geometry is tested against budget, structure and sustainability.
      </MentorPrinciple>
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Mon 08:00 · voice msg">
        Create a massing model first. SketchUp, Rhino, Revit, or Blender. No detailed interiors yet. I need 3 perspective views + 1 bird's-eye. Run the design checks below before submitting. <strong>I will review against every one of them.</strong>
      </VoiceNote>

      <Stepper step={step} completed={completed} />

      {/* Step 1 */}
      <SectionHeader hint="Before placing rooms, define your building footprint. Site is 68m × 71m. Setbacks leave 59m × 62m buildable. GFA target 12,000–15,000 sq.ft. across max 3 storeys.">
        Step 1 · Floor Plate Decision
      </SectionHeader>
      <div className="grid sm:grid-cols-3 gap-3">
        {FOOTPRINTS.map((fp) => (
          <FootprintCard
            key={fp.id}
            fp={fp}
            selected={footprint === fp.id}
            onSelect={() => {
              setFootprint(fp.id);
              markStep(1);
              if (step === 1) setStep(2);
            }}
          />
        ))}
      </div>

      {/* Step 2 */}
      <SectionHeader hint="Place each programme element in the correct zone. Compass: east faces DP Road.">
        Step 2 · Space Placement Quiz
      </SectionHeader>
      {footprint ? (
        placements ? (
          <div className="space-y-2">
            <ZoneGrid placements={placements} />
            <div className="text-[11.5px] text-[#94a3c4]">
              Your layout satisfies <span className="text-[#e6ecff] font-semibold">{placementScore} of {PLACEMENT_QUESTIONS.length}</span> placement rules.
            </div>
          </div>
        ) : (
          <PlacementQuiz
            onComplete={(p, score) => {
              setPlacements(p);
              setPlacementScore(score);
              markStep(2);
              setStep(3);
            }}
          />
        )
      ) : (
        <StepLock>Select a footprint in Step 1 to unlock the placement quiz.</StepLock>
      )}

      {/* Step 3 */}
      <SectionHeader hint="Each check is a real scenario. Pick the answer that holds up on site.">
        Step 3 · Design Checks
      </SectionHeader>
      {placements ? (
        completed.has(3) ? (
          <div className="rounded border border-[#1a3a1a] bg-[#0d1a0d] px-3 py-2 text-[11.5px] text-[#7ab87a]">
            All 5 design checks resolved.
          </div>
        ) : (
          <DesignChecks
            onComplete={() => {
              markStep(3);
              setStep(4);
            }}
          />
        )
      ) : (
        <StepLock>Complete the placement quiz to unlock design checks.</StepLock>
      )}

      {/* Step 4 */}
      <SectionHeader hint="Procedurally assembled from your Step 1 and Step 2 answers.">
        Step 4 · AI Visualisation
      </SectionHeader>
      {completed.has(3) && footprint && placements ? (
        submitted ? (
          <div className="rounded-[7px] border border-primary/40 bg-primary/10 px-3 py-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-primary mb-1">Kiran Mehta's reaction</div>
            <p className="text-[12px] italic text-[#e6ecff] leading-[1.6]">
              "{FOOTPRINTS.find((f) => f.id === footprint)!.reaction}"
            </p>
          </div>
        ) : (
          <Step4
            footprint={footprint}
            placements={placements}
            onSubmit={() => {
              setSubmitted(true);
              markStep(4);
              onComplete();
            }}
          />
        )
      ) : (
        <StepLock>Clear all 5 design checks to unlock AI visualisation.</StepLock>
      )}
    </TaskFrame>
  );
}