import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, SectionHeader } from "./shared";
import { ARCH_TASKS } from "./arch-data";

const META = ARCH_TASKS[6];
const BUDGET = 85; // INR lakhs

type Level = "Low" | "Medium" | "High";
type Intervention = {
  id: string;
  name: string;
  cost: number; // lakhs
  cost_pct: number;
  impact_pct: number;
  maint_pct: number;
  fit: string;
  prefill: { budget: Level; climate: Level; ops: Level };
};

const INTERVENTIONS: Intervention[] = [
  { id: "solar", name: "Solar PV", cost: 38, cost_pct: 90, impact_pct: 90, maint_pct: 50,
    fit: "6.2 kWh/sq.m./day — excellent PV potential",
    prefill: { budget: "High", climate: "High", ops: "Medium" } },
  { id: "rain", name: "Rainwater harvesting", cost: 18, cost_pct: 50, impact_pct: 55, maint_pct: 20,
    fit: "580mm monsoon — good collection potential",
    prefill: { budget: "Medium", climate: "Medium", ops: "Low" } },
  { id: "passive", name: "Passive cooling", cost: 9, cost_pct: 15, impact_pct: 85, maint_pct: 5,
    fit: "38–42°C summers — critical for comfort",
    prefill: { budget: "Low", climate: "High", ops: "Low" } },
  { id: "green", name: "Extensive green roof", cost: 22, cost_pct: 60, impact_pct: 60, maint_pct: 25,
    fit: "Conflicts with solar panel zone on flat roof",
    prefill: { budget: "Medium", climate: "Medium", ops: "Low" } },
  { id: "local", name: "Local materials", cost: 12, cost_pct: 35, impact_pct: 50, maint_pct: 10,
    fit: "Reduces transport cost, supports local economy",
    prefill: { budget: "Low", climate: "Medium", ops: "Low" } },
  { id: "glaze", name: "High-performance glazing", cost: 26, cost_pct: 70, impact_pct: 80, maint_pct: 20,
    fit: "East/west façades need thermal break — DP Road heat gain",
    prefill: { budget: "Medium", climate: "High", ops: "Low" } },
];

const REACTIONS: Record<string, string> = {
  solar: "Good PV call — 6.2 kWh/sq.m. makes this a near-certain ROI in Pune.",
  passive: "Smart. The Nashik project skipped this and paid for it in energy bills.",
  green: "Coordinate with solar zone early — they compete for the same flat roof area.",
  rain: "Solid — monsoon collection offsets municipal water bills within 4 years.",
  local: "Procurement will thank you. Watch quality control on stone batches.",
  glaze: "Defensible on east/west — get the U-value spec into the tender early.",
};

export function ArchTaskSeven({ onComplete }: { onComplete: () => void }) {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [reasons, setReasons] = useState<Record<string, { works: string; tradeoff: string }>>({});
  const [rejections, setRejections] = useState<Record<string, string>>({});
  const [matrix, setMatrix] = useState<Record<string, { budget: Level; climate: Level; ops: Level }>>({});
  const [challenge, setChallenge] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedIds = INTERVENTIONS.filter((i) => picked[i.id]).map((i) => i.id);
  const selected = INTERVENTIONS.filter((i) => picked[i.id]);
  const spent = selected.reduce((s, i) => s + i.cost, 0);
  const remaining = BUDGET - spent;
  const count = selected.length;

  function toggle(i: Intervention) {
    if (picked[i.id]) {
      const next = { ...picked }; delete next[i.id];
      setPicked(next);
      return;
    }
    if (count >= 3) return;
    if (spent + i.cost > BUDGET) return;
    setPicked({ ...picked, [i.id]: true });
    if (!matrix[i.id]) setMatrix((m) => ({ ...m, [i.id]: { ...i.prefill } }));
  }

  const rejected = INTERVENTIONS.filter((i) => !picked[i.id]);
  const allReasonsFilled = selected.every((i) => (reasons[i.id]?.works?.trim()?.length ?? 0) > 0 && (reasons[i.id]?.tradeoff?.trim()?.length ?? 0) > 0);
  const allRejectionsFilled = count === 3 && rejected.every((i) => (rejections[i.id]?.trim()?.length ?? 0) > 0);

  const sentence = useMemo(() => {
    if (count !== 3) return "";
    const m = selected.map((i) => matrix[i.id] || i.prefill);
    const climateHigh = m.filter((x) => x.climate === "High").length;
    const budgetHigh = m.filter((x) => x.budget === "High").length;
    const opsLow = m.filter((x) => x.ops === "Low").length;
    const priority = climateHigh >= budgetHigh ? "climate response" : "budget discipline";
    const traded = climateHigh >= budgetHigh ? "budget" : "climate response";
    const accepted = budgetHigh > 0 ? "high upfront cost" : "moderate upfront cost";
    const ret = opsLow >= 2 ? "very low long-term maintenance" : "manageable long-term maintenance";
    return `You have prioritised ${priority} over ${traded} by selecting ${selected.map((s) => s.name).join(" + ")}, accepting ${accepted} in exchange for ${ret}.`;
  }, [selected, matrix, count]);

  const canSubmit = count === 3 && allReasonsFilled && allRejectionsFilled && challenge.trim().length > 0;

  if (submitted) {
    return (
      <TaskFrame>
        <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
        <ConfirmationPanel
          selected={selected}
          spent={spent}
          remaining={remaining}
          sentence={sentence}
          challenge={challenge}
          onContinue={onComplete}
        />
      </TaskFrame>
    );
  }

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <div className="rounded-xl border border-[oklch(0.78_0.14_75_/_0.4)] bg-[oklch(0.78_0.14_75_/_0.07)] px-4 py-3">
        <div className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.78_0.14_75)] font-semibold">Budget Update</div>
        <p className="mt-1 text-sm text-foreground/90">
          Following cost plan reconciliation, sustainability budget reduced by 15%. <b>Select exactly 3 interventions within ₹85L.</b> Nashik removed passive cooling at this stage and energy bills ran 27% over for 5 years. Do not repeat that trade off silently.
        </p>
      </div>

      {/* Sticky budget tracker */}
      <div className="sticky top-0 z-10 -mx-2 px-2 py-3 bg-[#070a1c]/95 backdrop-blur border-b border-[#1d2a5a]">
        <div className="flex items-center justify-between text-[11px] text-[#94a3c4] mb-1.5">
          <span>Sustainability budget: <b className="text-[#e6ecff]">₹{BUDGET}L</b></span>
          <span>Remaining: <b className={cn(remaining < 0 ? "text-[#e05252]" : "text-primary")}>₹{remaining}L</b></span>
          <span className={cn("font-semibold", count === 3 ? "text-[#52c47a]" : "text-[#94a3c4]")}>{count} / 3 selected</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#152149] overflow-hidden">
          <div
            className={cn("h-full transition-all", spent > BUDGET ? "bg-[#e05252]" : "bg-primary")}
            style={{ width: `${Math.min(100, (spent / BUDGET) * 100)}%` }}
          />
        </div>
      </div>

      <SectionHeader>Intervention Options</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INTERVENTIONS.map((i) => {
          const isPicked = !!picked[i.id];
          const wouldExceed = !isPicked && spent + i.cost > BUDGET;
          const atMax = !isPicked && count >= 3;
          const disabled = (wouldExceed || atMax) && !isPicked;
          return (
            <div
              key={i.id}
              className={cn(
                "rounded-lg border bg-[#0f1a3e] p-3.5 transition-all",
                isPicked ? "border-primary shadow-[0_0_18px_rgba(93,196,254,0.18)] -translate-y-0.5" : "border-[#1d2a5a]",
                disabled && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-[13px] font-semibold text-[#e6ecff] leading-tight">{i.name}</h4>
                <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/40 px-1.5 py-0.5 rounded">₹{i.cost}L</span>
              </div>
              <div className="space-y-1.5 mb-2.5">
                <MetricBar label="Upfront cost" pct={i.cost_pct} color="#e05252" />
                <MetricBar label="Long-term impact" pct={i.impact_pct} color="#52c47a" />
                <MetricBar label="Maintenance" pct={i.maint_pct} color="#e0b752" />
              </div>
              <div className="text-[10.5px] text-[#94a3c4] italic mb-2.5 border-l-2 border-[#2a3a72] pl-2">
                <span className="not-italic font-medium text-[#5dc4fe]">Pune site fit:</span> {i.fit}
              </div>
              <label className={cn("flex items-center gap-2 text-[11px] cursor-pointer select-none", disabled && "cursor-not-allowed")}>
                <input
                  type="checkbox"
                  checked={isPicked}
                  disabled={disabled}
                  onChange={() => toggle(i)}
                  className="accent-primary"
                />
                <span className={isPicked ? "text-primary font-medium" : "text-[#94a3c4]"}>
                  {isPicked ? "Selected" : "Select intervention"}
                </span>
                {wouldExceed && (
                  <span className="ml-auto text-[10px] text-[#e05252] flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Over budget
                  </span>
                )}
              </label>
              {isPicked && (
                <div className="mt-3 space-y-2 border-t border-[#1d2a5a] pt-2.5">
                  <SmallInput
                    label="This works for Aundh because…"
                    value={reasons[i.id]?.works || ""}
                    onChange={(v) => setReasons((r) => ({ ...r, [i.id]: { ...(r[i.id] || { works: "", tradeoff: "" }), works: v } }))}
                    placeholder={i.fit.slice(0, 60)}
                    max={80}
                  />
                  <SmallInput
                    label="The trade-off I accept is…"
                    value={reasons[i.id]?.tradeoff || ""}
                    onChange={(v) => setReasons((r) => ({ ...r, [i.id]: { ...(r[i.id] || { works: "", tradeoff: "" }), tradeoff: v } }))}
                    placeholder="Budget, maintenance, or design freedom?"
                    max={80}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count === 3 && (
        <>
          <SectionHeader hint="Your QS will ask why each was cut. One sentence each.">
            Rejection Log
          </SectionHeader>
          <div className="space-y-2">
            {rejected.map((i) => (
              <div key={i.id} className="flex items-center gap-2 rounded-md border border-[#1d2a5a] bg-[#0f1a3e] px-3 py-2">
                <span className="text-[11px] font-medium text-[#e6ecff] w-40 shrink-0">{i.name}</span>
                <input
                  type="text"
                  value={rejections[i.id] || ""}
                  onChange={(e) => setRejections((r) => ({ ...r, [i.id]: e.target.value.slice(0, 60) }))}
                  placeholder="Why rejected?"
                  maxLength={60}
                  className="flex-1 bg-transparent text-[11.5px] text-[#e6ecff] placeholder:text-[#3a4670] focus:outline-none"
                />
                <span className="text-[9px] text-[#3a4670] font-mono">{(rejections[i.id] || "").length}/60</span>
              </div>
            ))}
          </div>

          <SectionHeader>Your sustainability trade-offs</SectionHeader>
          <div className="rounded-lg border border-[#1d2a5a] bg-[#0f1a3e] p-3 overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.1em] text-[#3a4670]">
                  <th className="text-left font-normal py-1.5 pr-2">Intervention</th>
                  <th className="font-normal py-1.5 px-2">Budget impact</th>
                  <th className="font-normal py-1.5 px-2">Climate response</th>
                  <th className="font-normal py-1.5 px-2">Operational burden</th>
                </tr>
              </thead>
              <tbody>
                {selected.map((i) => {
                  const m = matrix[i.id] || i.prefill;
                  return (
                    <tr key={i.id} className="border-t border-[#1d2a5a]">
                      <td className="py-2 pr-2 text-[#e6ecff] font-medium">{i.name}</td>
                      {(["budget", "climate", "ops"] as const).map((k) => (
                        <td key={k} className="py-2 px-2 text-center">
                          <LevelPill
                            value={m[k]}
                            onChange={(v) => setMatrix((mx) => ({ ...mx, [i.id]: { ...m, [k]: v } }))}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-[12px] leading-[1.7] text-[#94a3c4] italic border-t border-[#1d2a5a] pt-2.5">
              {sentence}
            </p>
          </div>

          {/* QS Challenge */}
          <div className="rounded-lg border border-[#5a3a1a] bg-[#1a1408] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e0b752] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.12em] text-[#e0b752] font-semibold">QS Challenge — Arvind Joshi</span>
            </div>
            <p className="text-[12px] leading-[1.6] text-[#e6ecff]/90 mb-2.5">
              Passive cooling and high-performance glazing are sometimes specified together as a package.
              <b> If you selected both</b>, explain in one sentence why both are necessary rather than either alone.
              <b> If you did not select both</b>, explain in one sentence what you chose instead of glazing and why it better suits Aundh.
            </p>
            <input
              type="text"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value.slice(0, 120))}
              maxLength={120}
              placeholder="One sentence, max 120 characters."
              className="w-full rounded-md bg-[#0f1a3e] border border-[#2a3a72] px-2.5 py-1.5 text-[12px] text-[#e6ecff] placeholder:text-[#3a4670] focus:outline-none focus:border-primary"
            />
            <div className="text-right text-[9px] text-[#3a4670] font-mono mt-1">{challenge.length}/120</div>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1d2a5a] pt-[14px] mt-[16px]">
        <p className="text-[11px] text-[#94a3c4]">
          {!canSubmit
            ? count < 3
              ? "Select exactly 3 interventions within ₹85L to continue."
              : !allReasonsFilled
                ? "Fill in the two short fields under each selected card."
                : !allRejectionsFilled
                  ? "Log why each rejected intervention was cut."
                  : "Answer the QS challenge to unlock submit."
            : "Ready for QS sign-off."}
        </p>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="inline-flex items-center gap-[5px] rounded-[4px] bg-primary px-[18px] py-[8px] text-[12px] font-semibold text-[#000] hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed border border-primary shadow-[0_0_18px_rgba(93,196,254,0.25)]"
        >
          Submit Sustainability Plan <ArrowRight className="h-[14px] w-[14px]" />
        </button>
      </div>
    </TaskFrame>
  );
}

function MetricBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.08em] text-[#3a4670] mb-0.5">
        <span>{label}</span>
        <span className="font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#152149] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SmallInput({
  label, value, onChange, placeholder, max,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string; max: number }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.08em] text-[#94a3c4]">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        placeholder={placeholder}
        maxLength={max}
        className="mt-1 w-full rounded-md bg-[#152149] border border-[#2a3a72] px-2 py-1.5 text-[11.5px] text-[#e6ecff] placeholder:text-[#3a4670] focus:outline-none focus:border-primary"
      />
      <div className="text-right text-[9px] text-[#3a4670] font-mono mt-0.5">{value.length}/{max}</div>
    </div>
  );
}

const LEVELS: Level[] = ["Low", "Medium", "High"];
const LEVEL_COLORS: Record<Level, string> = {
  Low: "bg-[#0d1a0d] text-[#52c47a] border-[#1a3a1a]",
  Medium: "bg-[#1a1408] text-[#e0b752] border-[#5a3a1a]",
  High: "bg-[#1a0808] text-[#e05252] border-[#5a1a1a]",
};

function LevelPill({ value, onChange }: { value: Level; onChange: (v: Level) => void }) {
  const idx = LEVELS.indexOf(value);
  const next = LEVELS[(idx + 1) % LEVELS.length];
  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      className={cn(
        "inline-flex items-center justify-center min-w-[68px] px-2.5 py-1 rounded-full border text-[10.5px] font-medium hover:brightness-110 transition",
        LEVEL_COLORS[value],
      )}
    >
      {value}
    </button>
  );
}

function ConfirmationPanel({
  selected, spent, remaining, sentence, challenge, onContinue,
}: {
  selected: Intervention[]; spent: number; remaining: number; sentence: string; challenge: string; onContinue: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[#1a3a1a] bg-[#0d1a0d] px-4 py-3">
        <div className="flex items-center gap-2 text-[11px] text-[#52c47a] font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          PLAN LOCKED — Submitted to Arvind Joshi
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#3a4670] mb-2">Selected interventions</div>
        <div className="space-y-1.5">
          {selected.map((i) => (
            <div key={i.id} className="flex items-center justify-between rounded-md border border-[#1d2a5a] bg-[#0f1a3e] px-3 py-2 text-[12px]">
              <span className="text-[#e6ecff] font-medium">{i.name}</span>
              <span className="font-mono text-primary">₹{i.cost}L</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2 text-[11px] text-[#94a3c4]">
            <span>Total spent</span>
            <span className="font-mono">₹{spent}L · ₹{remaining}L remaining</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#3a4670] mb-2">Trade-off summary</div>
        <p className="text-[12px] leading-[1.7] text-[#e6ecff]/90 italic rounded-md border border-[#1d2a5a] bg-[#0f1a3e] px-3 py-2.5">
          {sentence}
        </p>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#3a4670] mb-2">QS challenge response</div>
        <p className="text-[12px] leading-[1.7] text-[#e6ecff]/90 rounded-md border border-[#1d2a5a] bg-[#0f1a3e] px-3 py-2.5">
          {challenge}
        </p>
      </div>

      <div className="rounded-lg border border-[#5a1a1a] bg-[#1a0808] px-4 py-3.5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#e05252] font-semibold mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e05252]" />
          Arvind Joshi reacts
        </div>
        <div className="space-y-2">
          {selected.map((i) => (
            <div key={i.id} className="flex gap-2 text-[12px] leading-[1.6]">
              <span className="text-[#e05252] font-mono text-[10px] mt-1">›</span>
              <p className="text-[#e6ecff]/90"><b className="text-[#e6ecff]">{i.name}:</b> <span className="italic text-[#94a3c4]">{REACTIONS[i.id]}</span></p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-[#1d2a5a] pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-[5px] rounded-[4px] bg-primary px-[18px] py-[8px] text-[12px] font-semibold text-[#000] hover:brightness-110 border border-primary shadow-[0_0_18px_rgba(93,196,254,0.25)]"
        >
          Continue to next task <ArrowRight className="h-[14px] w-[14px]" />
        </button>
      </div>
    </div>
  );
}