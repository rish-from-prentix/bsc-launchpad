import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader, SubmitBar, MentorPrinciple } from "./shared";
import { ARCH_TASKS, DEFECT_CARDS, POE_FINDINGS } from "./arch-data";

const META = ARCH_TASKS[9];
type Verdict = "clear" | "minor" | "critical";

const KEYWORDS: Record<number, { needles: string[]; warn: string }> = {
  1: { needles: ["2", "50", "stc"], warn: "Cite the rooms gap or STC rating before marking Clear." },
  2: { needles: ["38", "42", "overhang"], warn: "Reference the temperature range or overhang spec." },
  3: { needles: ["1:12", "1500", "900"], warn: "Cite the required ramp gradient or door clearance." },
  4: { needles: ["lockable", "separate", "independent"], warn: "Confirm each space's own access route by name." },
  5: { needles: ["neem", "8m", "68", "72"], warn: "Reference tree canopy or the DP Road dB range." },
  6: { needles: ["71", "east", "dp road"], warn: "Cite the Nashik failure rate or the entrance orientation requirement." },
};

const SUSTAIN_LABELS: Record<string, string> = {
  pv: "Solar PV",
  rain: "Rainwater harvesting",
  passive: "Passive cooling",
  green: "Green roof",
  local: "Local materials",
  glaze: "High performance glazing",
};

function matchesKeyword(text: string, id: number): boolean {
  const t = text.toLowerCase();
  return KEYWORDS[id].needles.some((n) => t.includes(n.toLowerCase()));
}

export function ArchTaskTen({ onComplete }: { onComplete: () => void }) {
  const [findings, setFindings] = useState<Record<number, string>>({});
  const [verdicts, setVerdicts] = useState<Record<number, Verdict>>({});
  const [locked, setLocked] = useState<Record<number, boolean>>({});
  const [warnings, setWarnings] = useState<Record<number, string>>({});
  const [note, setNote] = useState("");
  const [noteEdited, setNoteEdited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [task3Score, setTask3Score] = useState<number | null>(null);
  const [task7Selected, setTask7Selected] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = window.localStorage.getItem("arch.task3.adjScore");
      if (s) setTask3Score(Number(s));
      const raw = window.localStorage.getItem("arch.task7.selected");
      if (raw) setTask7Selected(JSON.parse(raw));
    } catch {}
  }, []);

  const reviewed = Object.keys(locked).length;
  const clear = Object.values(verdicts).filter((v) => v === "clear").length;
  const minor = Object.values(verdicts).filter((v) => v === "minor").length;
  const critical = Object.values(verdicts).filter((v) => v === "critical").length;
  const allResolved = reviewed === DEFECT_CARDS.length;
  const allClear = allResolved && clear === DEFECT_CARDS.length;
  const ready = allResolved && note.trim().length >= 60;

  // Auto-draft note once all resolved
  const autoDraft = useMemo(() => {
    if (!allResolved) return "";
    return DEFECT_CARDS.map((d) => {
      const v = verdicts[d.id];
      const f = (findings[d.id] || "").trim();
      const firstSentence = f.split(/(?<=[.!?])\s/)[0] || f;
      const label = v ? v.charAt(0).toUpperCase() + v.slice(1) : "";
      return `${d.code} — ${label}: ${firstSentence}`;
    }).join("\n");
  }, [allResolved, verdicts, findings]);

  useEffect(() => {
    if (allResolved && !noteEdited) setNote(autoDraft);
  }, [allResolved, autoDraft, noteEdited]);

  const tone: Record<Verdict, string> = {
    clear: "border-[oklch(0.72_0.14_155_/_0.5)] bg-[oklch(0.72_0.14_155_/_0.07)]",
    minor: "border-[oklch(0.78_0.14_75_/_0.5)] bg-[oklch(0.78_0.14_75_/_0.07)]",
    critical: "border-destructive/50 bg-destructive/5",
  };
  const accentBorder: Record<Verdict, string> = {
    clear: "border-l-4 border-l-[#52c47a]",
    minor: "border-l-4 border-l-[#e0b752]",
    critical: "border-l-4 border-l-[#e05252]",
  };
  const badge: Record<Verdict, string> = {
    clear: "bg-[#0d1a0d] text-[#52c47a] border-[#52c47a]",
    minor: "bg-[#2a1f08] text-[#e0b752] border-[#e0b752]",
    critical: "bg-[#1a0808] text-[#e05252] border-[#e05252]",
  };

  function selectVerdict(id: number, opt: Verdict) {
    const text = findings[id] || "";
    if (opt !== "critical" && !matchesKeyword(text, id)) {
      setWarnings({ ...warnings, [id]: KEYWORDS[id].warn });
      return;
    }
    setWarnings({ ...warnings, [id]: "" });
    setVerdicts({ ...verdicts, [id]: opt });
    setLocked({ ...locked, [id]: true });
  }

  function editCard(id: number) {
    const newLocked = { ...locked };
    delete newLocked[id];
    setLocked(newLocked);
  }

  // Kiran final reaction
  if (submitted) {
    let reaction = "";
    if (critical === 0) reaction = "Zero critical flags on a first audit is unusual. I want you to re-check DR-002 and DR-005 personally before this goes to site.";
    else if (critical <= 2) reaction = "This is what a real audit looks like. Good catch rate.";
    else reaction = "Significant gaps. Good that we caught these now and not on site, but this needs a design review before we proceed to Task 11.";
    const toneCls = critical === 0
      ? "border-[#e0b752] bg-[#2a1f08] text-[#e0b752]"
      : critical <= 2
        ? "border-[#52c47a] bg-[#0d1a0d] text-[#7ab87a]"
        : "border-[#e05252] bg-[#1a0808] text-[#e05252]";
    return (
      <TaskFrame>
        <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
        <div className={cn("rounded-md border px-4 py-5 mt-4", toneCls)}>
          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold">Kiran Mehta · audit reaction</div>
          <p className="mt-3 text-[14px] leading-relaxed italic text-[#e6ecff]">{reaction}</p>
          <div className="mt-3 text-[11px] text-[#94a3c4]">
            Final profile: {clear} Clear · {minor} Minor · {critical} Critical
          </div>
        </div>
        <SubmitBar label="Continue to Task 11" onSubmit={onComplete} />
      </TaskFrame>
    );
  }

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <MentorPrinciple>
        A post occupancy evaluation reveals failures the design team could not see in time. A pre construction audit runs the same checklist in advance, while changes cost nothing.
      </MentorPrinciple>
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Thu 08:34 · voice msg">
        Before we send <strong>anything to the contractor</strong>, I want you to run a full sweep. Pull up the Nashik POE. Go through every failure they had and <strong>check our drawings against each one</strong>. On site, <strong>every mistake costs ten times more</strong> to fix.
      </VoiceNote>

      <SectionHeader>Nashik POE Findings, Your Design Checks</SectionHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">POE Finding</th>
              <th className="text-left px-3 py-2">Root Cause</th>
              <th className="text-left px-3 py-2">Check in Your Scheme</th>
            </tr>
          </thead>
          <tbody>
            {POE_FINDINGS.map((f, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-3 py-2 text-foreground/90">{f.finding}</td>
                <td className="px-3 py-2 text-muted-foreground">{f.root}</td>
                <td className="px-3 py-2 text-foreground/85">{f.check}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader>Live Risk Profile</SectionHeader>
      <RiskMeter clear={clear} minor={minor} critical={critical} total={DEFECT_CARDS.length} />

      <SectionHeader hint={`${reviewed} of ${DEFECT_CARDS.length} resolved.`}>Defect Register</SectionHeader>
      <div className="space-y-3">
        {DEFECT_CARDS.map((d) => {
          const v = verdicts[d.id];
          const isLocked = !!locked[d.id];
          const cross = crossRefFor(d.id, task3Score, task7Selected);
          const warning = warnings[d.id];

          if (isLocked && v) {
            const f = (findings[d.id] || "").trim();
            const snippet = f.length > 60 ? f.slice(0, 60) + "..." : f;
            return (
              <div key={d.id} className={cn("rounded-xl border bg-card p-3 flex items-center gap-3", tone[v], accentBorder[v])}>
                <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border", badge[v])}>{v}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-foreground truncate">{d.code} · {d.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{snippet || <span className="italic">no finding text</span>}</div>
                </div>
                <button type="button" onClick={() => editCard(d.id)} className="text-[11px] text-primary hover:underline shrink-0">Edit</button>
              </div>
            );
          }

          return (
            <div key={d.id} className={cn("rounded-xl border bg-card p-4", "border-border")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-primary">{d.code}</span>
                  <h4 className="text-sm font-semibold text-foreground">{d.title}</h4>
                  <div className="text-[11px] text-muted-foreground">{d.location}</div>
                </div>
              </div>
              <p className="mt-2 text-[13px] text-foreground/85">{d.body}</p>
              {cross && (
                <div className="mt-2 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] text-[#c4cfe6]">
                  <span className="text-primary font-semibold">System note: </span>{cross}
                </div>
              )}
              <label className="block mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                {d.fieldLabel}
              </label>
              <textarea
                rows={2}
                value={findings[d.id] || ""}
                onChange={(e) => {
                  setFindings({ ...findings, [d.id]: e.target.value });
                  if (warnings[d.id]) setWarnings({ ...warnings, [d.id]: "" });
                }}
                placeholder={d.placeholder}
                className="mt-1.5 w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {warning && (
                <p className="mt-1 text-[11px] text-[#e05252]">{warning}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {(["clear", "minor", "critical"] as Verdict[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => selectVerdict(d.id, opt)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
                      "border-border text-muted-foreground hover:border-primary/40",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <SectionHeader>Summary Note to Kiran Mehta</SectionHeader>
      {!allResolved ? (
        <p className="text-[11.5px] text-[#94a3c4] italic">Resolve all six defects to auto-assemble your summary draft.</p>
      ) : (
        <>
          <textarea
            rows={8}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteEdited(true);
            }}
            placeholder="What did you find? What did you fix? What remains a risk?"
            className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
          />
          {allClear ? (
            <p className="mt-2 text-[12px] text-[#e05252] font-semibold rounded-md border border-[#e05252]/50 bg-[#1a0808] px-3 py-2">
              ⚠ A note that finds no issues is not credible. An audit reporting zero issues across six defects should itself read as suspicious. Re-examine before submitting.
            </p>
          ) : (
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#94a3c4]">
              A note that finds no issues is not credible. Be specific.
            </p>
          )}
        </>
      )}

      <SubmitBar
        label="Submit Audit to Mentor"
        onSubmit={() => setSubmitted(true)}
        disabled={!ready}
        hint={ready ? "Audit ready to submit." : "Resolve every defect card and confirm the mentor note."}
      />
    </TaskFrame>
  );
}

function RiskMeter({ clear, minor, critical, total }: { clear: number; minor: number; critical: number; total: number }) {
  const filled = clear + minor + critical;
  const pct = (n: number) => (total ? (n / total) * 100 : 0);
  return (
    <div className="rounded-md border border-[#2a3a72] bg-[#0f1a3e] p-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#152149]">
        <div className="h-full bg-[#52c47a] transition-all" style={{ width: `${pct(clear)}%` }} />
        <div className="h-full bg-[#e0b752] transition-all" style={{ width: `${pct(minor)}%` }} />
        <div className="h-full bg-[#e05252] transition-all" style={{ width: `${pct(critical)}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#c4cfe6]">
        <span><span className="inline-block h-2 w-2 rounded-full bg-[#52c47a] mr-1.5" />{clear} Clear</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-[#e0b752] mr-1.5" />{minor} Minor</span>
        <span><span className="inline-block h-2 w-2 rounded-full bg-[#e05252] mr-1.5" />{critical} Critical</span>
        <span className="ml-auto text-[#94a3c4]">{filled} / {total} resolved</span>
      </div>
    </div>
  );
}

function crossRefFor(id: number, task3: number | null, task7: string[]): string | null {
  if (id === 4) {
    if (task3 === null) return "Complete Task 3 for a personalised cross-check here.";
    return `Your Task 3 bubble diagram scored ${task3}/10 on adjacency rules, does your current floor plan still reflect that?`;
  }
  if (id === 5) {
    if (!task7.length) return "Complete Task 7 for a personalised cross-check here.";
    const names = task7.map((k) => SUSTAIN_LABELS[k] || k).join(", ");
    return `Your Task 7 selection included ${names}, confirm shade strategy is still in the design.`;
  }
  return null;
}