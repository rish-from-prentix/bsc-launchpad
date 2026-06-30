import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  MentorPrinciple,
} from "./shared";
import { ARCH_TASKS } from "./arch-data";
import { cn } from "@/lib/utils";

const META = ARCH_TASKS[2];

type RowTag = "adj" | "sep" | "indep";
type Row = {
  key: string;
  space: string;
  benchmark: number;
  tags: RowTag[];
};

const ROWS: Row[] = [
  { key: "library", space: "Library + stacks", benchmark: 3500, tags: ["sep"] },
  { key: "children", space: "Children's reading corner", benchmark: 400, tags: ["adj"] },
  { key: "coworking_open", space: "Co-working open benching", benchmark: 2100, tags: [] },
  { key: "coworking_booths", space: "Co-working booths", benchmark: 300, tags: [] },
  { key: "meeting", space: "Bookable meeting room", benchmark: 180, tags: [] },
  { key: "hall", space: "Multipurpose hall + stage", benchmark: 2660, tags: ["adj", "sep", "indep"] },
  { key: "cafe", space: "Café kitchen + 30 covers", benchmark: 900, tags: ["adj", "indep"] },
  { key: "lobby", space: "Reception / lobby", benchmark: 300, tags: ["adj"] },
  { key: "toilets", space: "Public toilets M/F/accessible", benchmark: 450, tags: [] },
  { key: "plant", space: "Plant room + services", benchmark: 300, tags: ["sep", "indep"] },
  { key: "storage", space: "Storage", benchmark: 200, tags: [] },
];

const TAG_STYLE: Record<RowTag, { label: string; cls: string }> = {
  adj: { label: "adj", cls: "bg-[#0d2a2a] text-[#5dd6c5] border-[#1f5a55]" },
  sep: { label: "sep", cls: "bg-[#2a0d0d] text-[#e07a7a] border-[#5a1f1f]" },
  indep: { label: "indep", cls: "bg-[#1d0d2a] text-[#b48af0] border-[#3a1f5a]" },
};

// Bubble diagram nodes
type BubbleType = "public" | "support" | "service";
type Bubble = { key: string; label: string; r: number; type: BubbleType; x: number; y: number; indep?: boolean };

const CANVAS_W = 760;
const CANVAS_H = 480;

const DEFAULT_BUBBLES: Bubble[] = [
  { key: "hall", label: "Multipurpose Hall", r: 52, type: "public", x: 200, y: 130, indep: true },
  { key: "library", label: "Library + stacks", r: 46, type: "public", x: 560, y: 130 },
  { key: "coworking", label: "Co-working", r: 40, type: "public", x: 600, y: 320 },
  { key: "outdoor", label: "Outdoor plaza", r: 36, type: "public", x: 110, y: 380 },
  { key: "cafe", label: "Café", r: 34, type: "public", x: 280, y: 290, indep: true },
  { key: "lobby", label: "Lobby", r: 26, type: "support", x: 380, y: 200 },
  { key: "children", label: "Children's corner", r: 22, type: "public", x: 660, y: 220 },
  { key: "toilets", label: "Toilets", r: 22, type: "support", x: 460, y: 380 },
  { key: "plant", label: "Plant room", r: 20, type: "service", x: 60, y: 60, indep: true },
  { key: "meeting", label: "Meeting room", r: 18, type: "support", x: 510, y: 280 },
  { key: "storage", label: "Storage", r: 16, type: "support", x: 700, y: 420 },
];

const ADJ_PAIRS: [string, string][] = [
  ["cafe", "lobby"],
  ["hall", "cafe"],
  ["lobby", "hall"],
  ["children", "library"],
];

const SEP_PAIRS: [string, string][] = [
  ["library", "hall"],
  ["library", "cafe"],
  ["plant", "lobby"],
  ["plant", "library"],
  ["plant", "cafe"],
];

const BUBBLE_FILL: Record<BubbleType, { fill: string; stroke: string; text: string }> = {
  public: { fill: "#1c3a6e", stroke: "#5299e0", text: "#cde2ff" },
  support: { fill: "#143a2e", stroke: "#52c490", text: "#c7f0dd" },
  service: { fill: "#3a1f14", stroke: "#e08a5a", text: "#ffd7c0" },
};

function dist(a: Bubble, b: Bubble) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function fmt(n: number) {
  return n.toLocaleString();
}

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function ArchTaskThree({ onComplete }: { onComplete: () => void }) {
  // Part A state
  const [areas, setAreas] = useState<Record<string, string>>({});
  const [just, setJust] = useState<Record<string, string>>({});

  const sumExclCirc = useMemo(
    () =>
      ROWS.reduce((s, r) => {
        const v = parseInt((areas[r.key] || "").replace(/[^0-9]/g, ""), 10);
        return s + (isNaN(v) ? 0 : v);
      }, 0),
    [areas],
  );
  const circulation = Math.round(sumExclCirc * 0.2);
  const grandTotal = sumExclCirc + circulation;

  const totalState: "low" | "ok" | "high" =
    grandTotal < 12000 ? "low" : grandTotal > 15000 ? "high" : "ok";
  const totalDelta =
    totalState === "low"
      ? `${fmt(12000 - grandTotal)} sq.ft. short of the lower band`
      : totalState === "high"
        ? `${fmt(grandTotal - 15000)} sq.ft. over the upper cap`
        : "Within the 12,000–15,000 sq.ft. band";
  const totalColor =
    totalState === "low"
      ? "text-[#e0b752] border-[#5a4a1a] bg-[#1a1408]"
      : totalState === "ok"
        ? "text-[#52c47a] border-[#1a3a1a] bg-[#0d1a0d]"
        : "text-[#e05252] border-[#5a1a1a] bg-[#1a0808]";

  const partAComplete =
    totalState === "ok" &&
    ROWS.every((r) => (just[r.key] || "").trim().length >= 5) &&
    ROWS.every((r) => (areas[r.key] || "").trim() !== "");

  // Part B state
  const [bubbles, setBubbles] = useState<Bubble[]>(DEFAULT_BUBBLES);
  const dragRef = useRef<{ key: string; dx: number; dy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  function onPointerDown(e: React.PointerEvent, key: string) {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.getBoundingClientRect();
    const sx = ((e.clientX - pt.left) * CANVAS_W) / pt.width;
    const sy = ((e.clientY - pt.top) * CANVAS_H) / pt.height;
    const b = bubbles.find((x) => x.key === key);
    if (!b) return;
    dragRef.current = { key, dx: sx - b.x, dy: sy - b.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.getBoundingClientRect();
    const sx = ((e.clientX - pt.left) * CANVAS_W) / pt.width;
    const sy = ((e.clientY - pt.top) * CANVAS_H) / pt.height;
    const { key, dx, dy } = dragRef.current;
    setBubbles((bs) =>
      bs.map((b) => {
        if (b.key !== key) return b;
        const nx = Math.max(b.r, Math.min(CANVAS_W - b.r, sx - dx));
        const ny = Math.max(b.r, Math.min(CANVAS_H - b.r, sy - dy));
        return { ...b, x: nx, y: ny };
      }),
    );
  }
  function onPointerUp() {
    dragRef.current = null;
  }

  const byKey = useMemo(() => Object.fromEntries(bubbles.map((b) => [b.key, b])), [bubbles]);

  type PairStatus = { pair: [string, string]; kind: "adj" | "sep"; satisfied: boolean };
  const pairStatuses: PairStatus[] = useMemo(() => {
    const out: PairStatus[] = [];
    for (const [a, b] of ADJ_PAIRS) {
      const A = byKey[a], B = byKey[b];
      if (!A || !B) continue;
      const d = dist(A, B);
      const touch = A.r + B.r + 12;
      out.push({ pair: [a, b], kind: "adj", satisfied: d <= touch });
    }
    for (const [a, b] of SEP_PAIRS) {
      const A = byKey[a], B = byKey[b];
      if (!A || !B) continue;
      const d = dist(A, B);
      const far = A.r + B.r + 90;
      out.push({ pair: [a, b], kind: "sep", satisfied: d >= far });
    }
    return out;
  }, [byKey]);

  const adjScore = useMemo(() => {
    if (pairStatuses.length === 0) return 0;
    const ok = pairStatuses.filter((p) => p.satisfied).length;
    return Math.round((ok / pairStatuses.length) * 10);
  }, [pairStatuses]);

  const violations = pairStatuses.filter((p) => !p.satisfied).slice(0, 3);
  const satisfied = pairStatuses.filter((p) => p.satisfied).slice(0, 2);

  const partBComplete = adjScore >= 7;

  // Part C state
  const [statement, setStatement] = useState("");
  const wc = wordCount(statement);
  const wcColor =
    wc >= 90 && wc <= 120
      ? "text-[#52c47a]"
      : wc > 130
        ? "text-[#e05252]"
        : "text-[#94a3c4]";
  const partCComplete = wc >= 90 && wc <= 120;

  // Tabs
  const [tab, setTab] = useState<"a" | "b" | "c">("a");
  const [confirm, setConfirm] = useState(false);

  const allDone = partAComplete && partBComplete && partCComplete;

  function labelFor(k: string) {
    return DEFAULT_BUBBLES.find((b) => b.key === k)?.label ?? k;
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
      <MentorPrinciple>
        Every spatial decision must trace back to evidence from Week 1. The hall drives the floor plate. Resolve it first.
      </MentorPrinciple>
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Tue 08:30 · voice msg">
        Resolve the <strong>multipurpose hall first</strong>, it drives the floor plate. 300 people at 0.7 sq.m. minimum = 2,260 sq.ft. It needs independent evening access. Everything else fits around it. And do not under programme circulation, <strong>18 to 22% is not optional.</strong>
      </VoiceNote>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mt-2 border-b border-[#1d2a5a]">
        {([
          { id: "a", label: "Part A · Area", done: partAComplete },
          { id: "b", label: "Part B · Bubbles", done: partBComplete },
          { id: "c", label: "Part C · Justify", done: partCComplete },
        ] as const).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-2 text-[11.5px] border-b-2 -mb-px transition",
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-[#94a3c4] hover:text-[#e6ecff]",
            )}
          >
            {t.done && <Check className="h-3.5 w-3.5 text-[#52c47a]" />}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "a" && (
        <div className="space-y-3">
          <div className={cn("flex flex-wrap items-center justify-between gap-3 rounded-md border px-4 py-3", totalColor)}>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] opacity-70">Live grand total (incl. circulation)</div>
              <div className="text-[22px] font-bold leading-tight">{fmt(grandTotal)} sq.ft.</div>
            </div>
            <div className="text-[11.5px] opacity-90 text-right max-w-[260px]">{totalDelta}</div>
          </div>

          <div className="overflow-x-auto rounded-md border border-[#1d2a5a]">
            <table className="w-full text-[12px]">
              <thead className="bg-[#0f1a3e] text-[10px] uppercase tracking-[0.1em] text-[#94a3c4]">
                <tr>
                  <th className="text-left px-3 py-2">Space</th>
                  <th className="text-left px-3 py-2">Benchmark</th>
                  <th className="text-left px-3 py-2 w-28">Allocation</th>
                  <th className="text-left px-3 py-2">Justification (min 5 chars)</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.key} className="border-t border-[#152149]">
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-[#e6ecff]">{r.space}</div>
                      {r.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {r.tags.map((t) => (
                            <span
                              key={t}
                              className={cn(
                                "inline-block px-1.5 py-[1px] text-[9px] rounded border uppercase tracking-wider",
                                TAG_STYLE[t].cls,
                              )}
                            >
                              {TAG_STYLE[t].label}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top text-[#94a3c4]">{fmt(r.benchmark)} sq.ft.</td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={areas[r.key] || ""}
                        onChange={(e) => setAreas({ ...areas, [r.key]: e.target.value })}
                        placeholder="sq.ft."
                        className="w-full rounded bg-[#0a112c] border border-[#1d2a5a] px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        value={just[r.key] || ""}
                        onChange={(e) => setJust({ ...just, [r.key]: e.target.value })}
                        placeholder="Why this allocation?"
                        className="w-full rounded bg-[#0a112c] border border-[#1d2a5a] px-2 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[#1d2a5a] bg-[#0c1535]">
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium text-[#e6ecff]">Circulation 18–22%</div>
                    <div className="text-[10px] text-[#94a3c4] mt-0.5">Auto-calculated at 20%</div>
                  </td>
                  <td className="px-3 py-2 align-top text-[#94a3c4]">20% of programme</td>
                  <td className="px-3 py-2 align-top">
                    <div className="w-full rounded bg-[#0a112c] border border-[#1d2a5a] px-2 py-1.5 text-[12px] text-[#94a3c4] select-none">
                      {fmt(circulation)}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top text-[11px] text-[#94a3c4]">
                    Locked. Non-optional per brief.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "b" && (
        <PartB
          bubbles={bubbles}
          setBubbles={setBubbles}
          svgRef={svgRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          pairStatuses={pairStatuses}
          adjScore={adjScore}
          violations={violations}
          satisfied={satisfied}
          labelFor={labelFor}
        />
      )}

      {tab === "c" && (
        <div className="space-y-3 pt-1">
          <textarea
            rows={8}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="Justify your 3 most consequential adjacency decisions with evidence from the brief and site analysis…"
            className="w-full rounded-md bg-[#0a112c] border border-[#1d2a5a] px-3 py-2 text-[12.5px] leading-[1.7] text-[#e6ecff] placeholder:text-[#5a6a92] focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className={cn("text-[11px]", wcColor)}>
            {wc} words · target 90–120
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1d2a5a] pt-4 mt-4">
            <p className="text-[11px] text-[#94a3c4]">
              {allDone
                ? "All three parts ready. Submit to advance."
                : "Complete all three parts to enable submission."}
            </p>
            <button
              type="button"
              onClick={() => setConfirm(true)}
              disabled={!allDone}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-primary px-[18px] py-[8px] text-[12px] font-semibold text-black hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed border border-primary shadow-[0_0_18px_rgba(93,196,254,0.25)]"
            >
              Submit Programme & Adjacency
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-lg border border-[#2a3a72] bg-[#0f1a3e] p-5">
            <h3 className="text-[15px] font-semibold text-[#e6ecff]">Confirm submission</h3>
            <div className="mt-4 space-y-2 text-[12px] text-[#c4cfe6]">
              <div className="flex justify-between border-b border-[#1d2a5a] pb-1.5">
                <span className="text-[#94a3c4]">Total area</span>
                <span className="font-semibold">{fmt(grandTotal)} sq.ft.</span>
              </div>
              <div className="flex justify-between border-b border-[#1d2a5a] pb-1.5">
                <span className="text-[#94a3c4]">Adjacency score</span>
                <span className="font-semibold">{adjScore} / 10</span>
              </div>
              <div className="flex justify-between border-b border-[#1d2a5a] pb-1.5">
                <span className="text-[#94a3c4]">Justification word count</span>
                <span className="font-semibold">{wc} words</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="rounded px-3 py-1.5 text-[11.5px] border border-[#2a3a72] text-[#c4cfe6] hover:border-primary/50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirm(false);
                  try {
                    window.localStorage.setItem("arch.task3.adjScore", String(adjScore));
                  } catch {}
                  onComplete();
                }}
                className="rounded px-4 py-1.5 text-[11.5px] font-semibold bg-primary text-black border border-primary"
              >
                Confirm & advance
              </button>
            </div>
          </div>
        </div>
      )}
    </TaskFrame>
  );
}

function PartB({
  bubbles,
  setBubbles,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  pairStatuses,
  adjScore,
  violations,
  satisfied,
  labelFor,
}: {
  bubbles: Bubble[];
  setBubbles: (b: Bubble[]) => void;
  svgRef: React.MutableRefObject<SVGSVGElement | null>;
  onPointerDown: (e: React.PointerEvent, key: string) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  pairStatuses: { pair: [string, string]; kind: "adj" | "sep"; satisfied: boolean }[];
  adjScore: number;
  violations: { pair: [string, string]; kind: "adj" | "sep"; satisfied: boolean }[];
  satisfied: { pair: [string, string]; kind: "adj" | "sep"; satisfied: boolean }[];
  labelFor: (k: string) => string;
}) {
  const byKey = Object.fromEntries(bubbles.map((b) => [b.key, b])) as Record<string, Bubble>;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <RuleCard
          tone="adj"
          title="Must be adjacent"
          items={ADJ_PAIRS.map(([a, b]) => `${labelFor(a)} ↔ ${labelFor(b)}`)}
        />
        <RuleCard
          tone="sep"
          title="Must be separated"
          items={SEP_PAIRS.map(([a, b]) => `${labelFor(a)} ↔ ${labelFor(b)}`)}
        />
        <RuleCard
          tone="indep"
          title="Independent access required"
          items={["Multipurpose Hall", "Café", "Plant room"]}
        />
      </div>

      <div className="rounded-md border border-[#1d2a5a] bg-[#0a112c] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="w-full h-auto block touch-none select-none"
          style={{ minHeight: 480 }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#152149" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={CANVAS_W} height={CANVAS_H} fill="url(#grid)" />

          {/* connector lines */}
          {pairStatuses.map((ps, i) => {
            const A = byKey[ps.pair[0]];
            const B = byKey[ps.pair[1]];
            if (!A || !B) return null;
            const color = ps.satisfied
              ? ps.kind === "adj"
                ? "#52c47a"
                : "#52c47a"
              : "#e05252";
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={color}
                strokeWidth={ps.satisfied ? 2 : 1.5}
                strokeDasharray={ps.kind === "sep" && ps.satisfied ? "6 5" : undefined}
                opacity={0.85}
              />
            );
          })}

          {/* bubbles */}
          {bubbles.map((b) => {
            const s = BUBBLE_FILL[b.type];
            return (
              <g
                key={b.key}
                onPointerDown={(e) => onPointerDown(e, b.key)}
                style={{ cursor: "grab" }}
              >
                {b.indep && (
                  <circle
                    cx={b.x}
                    cy={b.y}
                    r={b.r + 6}
                    fill="none"
                    stroke="#b48af0"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    opacity={0.85}
                  />
                )}
                <circle
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={2}
                />
                <text
                  x={b.x}
                  y={b.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={Math.max(9, Math.min(12, b.r / 4))}
                  fill={s.text}
                  style={{ pointerEvents: "none", fontWeight: 600 }}
                >
                  {b.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-[12px] text-[#c4cfe6]">
          Adjacency score:{" "}
          <span className={cn("font-semibold", adjScore >= 7 ? "text-[#52c47a]" : "text-[#e0b752]")}>
            {adjScore} / 10
          </span>
        </div>
        <button
          type="button"
          onClick={() => setBubbles(DEFAULT_BUBBLES.map((b) => ({ ...b })))}
          className="rounded border border-[#2a3a72] px-3 py-1.5 text-[11px] text-[#c4cfe6] hover:border-primary/50 hover:text-primary"
        >
          Reset positions
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {violations.map((v, i) => (
          <span
            key={`v${i}`}
            className="inline-flex items-center px-2 py-1 rounded text-[10.5px] bg-[#2a0d0d] text-[#e07a7a] border border-[#5a1f1f]"
          >
            {v.kind === "adj" ? "Too far apart" : "Too close"}: {labelFor(v.pair[0])} ↔ {labelFor(v.pair[1])}
          </span>
        ))}
        {satisfied.map((s, i) => (
          <span
            key={`s${i}`}
            className="inline-flex items-center px-2 py-1 rounded text-[10.5px] bg-[#0d2a14] text-[#7ad88f] border border-[#1f5a2e]"
          >
            ✓ {labelFor(s.pair[0])} ↔ {labelFor(s.pair[1])} ({s.kind === "adj" ? "adjacent" : "separated"})
          </span>
        ))}
      </div>
    </div>
  );
}

function RuleCard({
  tone,
  title,
  items,
}: {
  tone: "adj" | "sep" | "indep";
  title: string;
  items: string[];
}) {
  const styles =
    tone === "adj"
      ? "border-[#1f5a55] bg-[#0a1f1c] text-[#5dd6c5]"
      : tone === "sep"
        ? "border-[#5a1f1f] bg-[#1a0808] text-[#e07a7a]"
        : "border-[#3a1f5a] bg-[#140a22] text-[#b48af0]";
  return (
    <div className={cn("rounded-md border px-3 py-2.5", styles)}>
      <div className="text-[10px] uppercase tracking-[0.12em] font-semibold opacity-90">{title}</div>
      <ul className="mt-1.5 space-y-0.5 text-[11px] leading-[1.55] text-[#c4cfe6]">
        {items.map((s, i) => (
          <li key={i}>· {s}</li>
        ))}
      </ul>
    </div>
  );
}