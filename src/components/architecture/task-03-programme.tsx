import { useMemo, useState } from "react";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  DataCard,
  SectionHeader,
  HelperText,
  SubmitBar,
  MentorPrinciple,
} from "./shared";
import { ARCH_TASKS, PROGRAMME_ROWS } from "./arch-data";

const META = ARCH_TASKS[2];

export function ArchTaskThree({ onComplete }: { onComplete: () => void }) {
  const [areas, setAreas] = useState<Record<string, string>>({});
  const [just, setJust] = useState<Record<string, string>>({});
  const [statement, setStatement] = useState("");
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () =>
      PROGRAMME_ROWS.reduce((sum, r) => {
        const v = parseInt((areas[r.space] || "").replace(/[^0-9]/g, ""), 10);
        return sum + (isNaN(v) ? 0 : v);
      }, 0),
    [areas],
  );

  const allFilled =
    PROGRAMME_ROWS.every((r) => (areas[r.space] || "").trim() !== "") &&
    statement.trim().length >= 60;

  function submit() {
    if (total < 12000 || total > 15000) {
      setError(`Total must fall between 12,000 and 15,000 sq.ft. You have ${total.toLocaleString()}.`);
      return;
    }
    onComplete();
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
      <DataCard label="Adjacency Rules">
        <p><strong>Must be adjacent:</strong> Café + outdoor space. Hall + café (event catering). Lobby + main entrance.</p>
        <p><strong>Must be separated:</strong> Library quiet zone from hall (acoustic, min 2 rooms + STC 50). Library from café. Plant room from public.</p>
        <p><strong>Must have independent access:</strong> Multipurpose hall (evening). Café (early morning setup). Plant room (service only).</p>
      </DataCard>

      <SectionHeader hint="Allocate and justify each space. Total must land between 12,000 and 15,000 sq.ft.">
        Area Programme
      </SectionHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Space</th>
              <th className="text-left px-3 py-2">Benchmark</th>
              <th className="text-left px-3 py-2 w-32">Allocation (sq.ft.)</th>
              <th className="text-left px-3 py-2">Justification</th>
            </tr>
          </thead>
          <tbody>
            {PROGRAMME_ROWS.map((r) => (
              <tr key={r.space} className={r.emphasis ? "bg-primary/5" : ""}>
                <td className="px-3 py-2 font-medium text-foreground/90">{r.space}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.benchmark}</td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={areas[r.space] || ""}
                    onChange={(e) => setAreas({ ...areas, [r.space]: e.target.value })}
                    placeholder="sq.ft."
                    className="w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={just[r.space] || ""}
                    onChange={(e) => setJust({ ...just, [r.space]: e.target.value })}
                    placeholder="Why?"
                    className="w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-card border-t border-border">
              <td className="px-3 py-2 font-semibold">TOTAL</td>
              <td className="px-3 py-2 text-muted-foreground">12,000 to 15,000</td>
              <td
                className={`px-3 py-2 font-mono font-semibold ${total >= 12000 && total <= 15000 ? "text-[oklch(0.72_0.14_155)]" : "text-destructive"}`}
              >
                {total.toLocaleString()}
              </td>
              <td className="px-3 py-2 text-xs text-muted-foreground">Must fall within range</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader>Adjacency Justification (100 words)</SectionHeader>
      <textarea
        rows={5}
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="Justify your 3 most consequential adjacency decisions with evidence from brief and site analysis..."
        className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <HelperText>Recommended: 2 to 4 concise lines.</HelperText>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <SubmitBar
        label="Submit Area Programme"
        onSubmit={submit}
        disabled={!allFilled}
        hint={allFilled ? `Total ${total.toLocaleString()} sq.ft.` : "Allocate every row and write the justification."}
      />
    </TaskFrame>
  );
}