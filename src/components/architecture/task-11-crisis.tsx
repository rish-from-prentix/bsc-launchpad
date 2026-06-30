import { useState } from "react";
import { Shuffle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import { TaskFrame, TaskHeader, VoiceNote, SectionHeader, HelperText, SubmitBar, FeedbackPanel, MentorPrinciple } from "./shared";
import { ARCH_TASKS, CRISIS_SCENARIOS, type CrisisScenario } from "./arch-data";
import { cn } from "@/lib/utils";

const META = ARCH_TASKS[10];

type RiskKey = "programme" | "storey" | "both";

const RISK_OPTIONS: { key: RiskKey; label: string; sub: string }[] = [
  { key: "programme", label: "Programme", sub: "some spaces must shrink or move" },
  { key: "storey", label: "Storey count", sub: "going to 4 floors changes the massing entirely" },
  { key: "both", label: "Both", sub: "partial programme cut plus a storey increase" },
];

const ISSUE_PLACEHOLDERS: Record<RiskKey, string> = {
  programme: "Name the spaces under threat and explain why losing or shrinking them hurts the brief.",
  storey: "Explain why a 4th storey is the lever you are pulling and what it changes about the scheme.",
  both: "Explain the dual move: which programme is cut, and why a storey increase is still needed on top.",
};

const CHALLENGE: Record<RiskKey, { from: string; text: string; expects: string[] }> = {
  programme: {
    from: "Kiran's pushback",
    text: "Which specific space are you cutting, and what does the user persona who needed it lose? Asha needs her quiet study space, does your cut affect her?",
    expects: ["asha"],
  },
  storey: {
    from: "Kiran's pushback",
    text: "A 4th storey changes your structural grid and your MEP risers. Does your Task 5 floor plan column grid still work at 4 storeys, or are you redesigning that too?",
    expects: ["grid", "structur", "column"],
  },
  both: {
    from: "Kiran's pushback",
    text: "You are making two changes at once under deadline pressure. Which one do you do first, and why does the order matter?",
    expects: ["first", "sequenc", "order"],
  },
};

export function ArchTaskEleven({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [scenario, setScenario] = useState<CrisisScenario | null>(null);
  const [risk, setRisk] = useState<RiskKey | "">("");
  const [issue, setIssue] = useState("");
  const [mod, setMod] = useState("");
  const [impact, setImpact] = useState("");
  const [challengeAns, setChallengeAns] = useState("");
  const [timeline, setTimeline] = useState("");
  const [timelineOk, setTimelineOk] = useState(false);
  const [fourStoreys, setFourStoreys] = useState(false);
  const [impactSubmitted, setImpactSubmitted] = useState(false);
  const [review, setReview] = useState(false);
  const [closing, setClosing] = useState<null | "strong" | "partial" | "weak">(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);
  const [done, setDone] = useState(false);

  function assign() {
    const s = CRISIS_SCENARIOS[Math.floor(Math.random() * CRISIS_SCENARIOS.length)];
    setScenario(s);
  }

  const hasNumber = /\d/.test(mod) && /(sq\.?\s*m|storey|floor|m\b|mm|metre|meter)/i.test(mod);
  const recoveredArea = Math.round((200 / 3) * 1);

  const issueOk = risk !== "" && issue.trim().length >= 20;
  const modOk = mod.trim().length >= 20 && hasNumber;
  const impactOk = impact.trim().length >= 20;
  const challengeOk = challengeAns.trim().length >= 10 && challengeAns.length <= 150;
  const timelineFilled = timeline.trim().length >= 20 && timelineOk;
  const allFilled = issueOk && modOk && impactOk && impactSubmitted && challengeOk && timelineFilled;

  function evaluateClosing(): "strong" | "partial" | "weak" {
    const expects = risk ? CHALLENGE[risk as RiskKey].expects : [];
    const challengeHit = expects.some((k) => challengeAns.toLowerCase().includes(k));
    const signals = [hasNumber, challengeHit, timelineOk].filter(Boolean).length;
    if (signals === 3) return "strong";
    if (signals === 0) return "weak";
    return "partial";
  }

  async function finalSubmit() {
    if (!scenario) return;
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: `${META.title}: ${scenario.title}`,
          taskBrief: scenario.body,
          submission: [
            { label: "Trade-off", value: risk },
            { label: "1. Issue Summary", value: issue },
            { label: "2. Proposed Modification", value: mod },
            { label: "3. Design Impact", value: impact },
            { label: "Mentor challenge response", value: challengeAns },
            { label: "4. Implementation Timeline", value: timeline },
          ],
        },
      });
      setResult(r);
      setClosing(evaluateClosing());
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <TaskFrame>
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-3xl font-semibold text-primary">Internship Complete</h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            You have worked through all 11 tasks of the Community Learning Hub project, from client brief to crisis resolution. This is the full architecture design workflow.
          </p>
          <div className="mt-6 text-xs font-mono text-muted-foreground/70">
            Community Learning Hub · Survey 147, Aundh, Pune · MERIDIAN ARCHITECTURE{"\u00a0"} · CLHA-2024
          </div>
        </div>
      </TaskFrame>
    );
  }

  return (
    <TaskFrame>
      <TaskHeader week={META.week} taskNumber={META.index} duration={META.duration} title={META.title} deliverable={META.deliverable} />
      <MentorPrinciple>
        Architects sell ideas, not drawings. The ability to communicate a design rationale clearly and hold it under challenge is as important as the design itself.
      </MentorPrinciple>
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Fri 07:00 · urgent">
        Your scenario is assigned. Memo by end of business today. Four sections: issue summary, proposed modification, design impact, implementation timeline. Be direct. <strong>Do not tell me what went wrong, tell me how you are fixing it.</strong>
      </VoiceNote>

      {!scenario ? (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Click below to receive your randomly assigned crisis scenario.
          </p>
          <button
            type="button"
            onClick={assign}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Shuffle className="h-4 w-4" />
            Assign My Scenario
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-destructive font-semibold">
              {scenario.title}
            </div>
            <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{scenario.body}</p>
          </div>

          {/* Live constraint calculator */}
          <SectionHeader>Your Numbers</SectionHeader>
          <div className="rounded-xl border border-[#2a3a72] bg-[#0f1a3e] p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <StatBox label="Buildable area lost" value="200 sq.m." />
              <StatBox label="Current storeys" value="3" />
              <StatBox label="Height limit" value="15m" />
            </div>
            <label className="flex items-center gap-2 text-xs text-[#94a3c4] cursor-pointer">
              <input
                type="checkbox"
                checked={fourStoreys}
                onChange={(e) => setFourStoreys(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span className="font-semibold text-[#e6ecff]">If you go to 4 storeys</span>
            </label>
            {fourStoreys && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <StatBox label="Recovered area" value={`~${recoveredArea} sq.m.`} accent />
                <StatBox label="Avg floor height required" value="≤ 3.75 m" accent warn />
              </div>
            )}
          </div>

          <SectionHeader>Your Redesign Memo</SectionHeader>
          <p className="text-xs text-[#94a3c4]">
            <b className="text-[#e6ecff]">To:</b> Kiran Mehta, Principal Architect, Meridian Architecture Studio
          </p>

          {/* Section 1 */}
          <FieldLabel>1. Issue Summary</FieldLabel>
          <div className="text-[11px] uppercase tracking-[0.16em] text-[#94a3c4] mb-1">What is actually at risk here?</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            {RISK_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setRisk(o.key)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left text-xs transition",
                  risk === o.key
                    ? "border-primary bg-primary/10 text-[#e6ecff]"
                    : "border-[#2a3a72] bg-[#0f1a3e] text-[#94a3c4] hover:border-primary/50",
                )}
              >
                <div className="font-semibold">{o.label}</div>
                <div className="text-[10.5px] opacity-80 mt-0.5">{o.sub}</div>
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            disabled={!risk}
            placeholder={risk ? ISSUE_PLACEHOLDERS[risk as RiskKey] : "Select a trade-off above first."}
            className="w-full rounded-md bg-background/40 border border-[#2a3a72] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
          />

          {/* Section 2 */}
          <FieldLabel>2. Proposed Modification</FieldLabel>
          <textarea
            rows={3}
            value={mod}
            onChange={(e) => setMod(e.target.value)}
            placeholder="What specifically will you change? Cite numbers, sq.m., storeys, dimensions."
            className="w-full rounded-md bg-background/40 border border-[#2a3a72] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {mod.trim().length > 0 && !hasNumber && (
            <p className="text-[11px] text-[#e05252] mt-1">
              Be specific, cite a number. Kiran does not accept vague fixes.
            </p>
          )}

          {/* Section 3 */}
          <FieldLabel>3. Design Impact</FieldLabel>
          <textarea
            rows={3}
            value={impact}
            onChange={(e) => {
              setImpact(e.target.value);
              if (impactSubmitted) setImpactSubmitted(false);
            }}
            placeholder="What is the consequence of this modification? What are you trading off?"
            className="w-full rounded-md bg-background/40 border border-[#2a3a72] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {!impactSubmitted ? (
            <button
              type="button"
              disabled={!impactOk || !risk}
              onClick={() => setImpactSubmitted(true)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-[4px] border border-[#2a3a72] px-3 py-1.5 text-[11px] text-[#94a3c4] hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit impact, see Kiran's pushback
            </button>
          ) : (
            risk && (
              <div className="mt-2 rounded-md border border-[#e0b752]/40 bg-[#2a1f08] p-3">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#e0b752] font-semibold mb-1">
                  {CHALLENGE[risk as RiskKey].from}
                </div>
                <p className="text-[12.5px] text-[#e6ecff] leading-relaxed italic">
                  {CHALLENGE[risk as RiskKey].text}
                </p>
                <input
                  type="text"
                  maxLength={150}
                  value={challengeAns}
                  onChange={(e) => setChallengeAns(e.target.value)}
                  placeholder="Your response (max 150 characters)"
                  className="mt-2 w-full rounded-md bg-background/40 border border-[#2a3a72] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <div className="text-[10px] text-[#94a3c4] mt-1">{challengeAns.length}/150</div>
              </div>
            )
          )}

          {/* Section 4 */}
          <div className={cn(!challengeOk && "opacity-50 pointer-events-none")}>
            <FieldLabel>4. Implementation Timeline</FieldLabel>
            <div className="rounded-md border border-[#2a3a72] bg-[#0f1a3e] px-3 py-2 text-[11.5px] text-[#94a3c4] mb-2">
              <span className="text-[#e6ecff] font-semibold">Fixed fact: </span>
              Planning submission is due in 12 weeks from project start. You are currently in Week 5, 7 weeks remaining.
            </div>
            <textarea
              rows={3}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="Can your fix be drawn, costed, and approved within the remaining 7 weeks? Lay out the critical path."
              className="w-full rounded-md bg-background/40 border border-[#2a3a72] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <label className="mt-2 flex items-start gap-2 text-[11.5px] text-[#94a3c4] cursor-pointer">
              <input
                type="checkbox"
                checked={timelineOk}
                onChange={(e) => setTimelineOk(e.target.checked)}
                className="h-4 w-4 mt-0.5 accent-primary"
              />
              <span>I confirm this timeline fits within the 7 weeks remaining before planning submission.</span>
            </label>
          </div>
          <HelperText>Focus on reasoning, not summaries.</HelperText>

          {result && closing ? (
            <ClosingReaction
              variant={closing}
              onContinue={() => {
                setDone(true);
                onComplete();
              }}
            />
          ) : review ? (
            <MemoPreview
              risk={risk as RiskKey}
              issue={issue}
              mod={mod}
              impact={impact}
              challenge={challengeAns}
              timeline={timeline}
              scenarioTitle={scenario.title}
              loading={loading}
              onRevise={() => setReview(false)}
              onSend={finalSubmit}
            />
          ) : (
            <SubmitBar
              label="Assemble memo for review"
              onSubmit={() => setReview(true)}
              disabled={!allFilled}
              hint={allFilled ? "Final review before it reaches Kiran." : "Complete every section, the challenge, and tick the timeline confirmation."}
            />
          )}
        </>
      )}
    </TaskFrame>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs uppercase tracking-[0.18em] text-[#94a3c4] font-semibold mt-3 mb-1.5">
      {children}
    </label>
  );
}

function StatBox({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2",
        accent
          ? warn
            ? "border-[#e0b752]/50 bg-[#e0b752]/5"
            : "border-primary/50 bg-primary/5"
          : "border-[#2a3a72] bg-[#152149]",
      )}
    >
      <div className="text-[10px] uppercase tracking-[0.14em] text-[#94a3c4]">{label}</div>
      <div className={cn("text-lg font-semibold", warn ? "text-[#e0b752]" : "text-[#e6ecff]")}>{value}</div>
    </div>
  );
}

function MemoPreview({
  risk,
  issue,
  mod,
  impact,
  challenge,
  timeline,
  scenarioTitle,
  loading,
  onRevise,
  onSend,
}: {
  risk: RiskKey;
  issue: string;
  mod: string;
  impact: string;
  challenge: string;
  timeline: string;
  scenarioTitle: string;
  loading: boolean;
  onRevise: () => void;
  onSend: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#2a3a72] bg-[#0a1330] p-5 mt-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
        Memo preview
      </div>
      <div className="space-y-3 text-[13px] leading-relaxed text-[#e6ecff]">
        <div className="border-b border-[#2a3a72] pb-2 text-[12px] text-[#94a3c4]">
          <div><b className="text-[#e6ecff]">To:</b> Kiran Mehta, Principal Architect</div>
          <div><b className="text-[#e6ecff]">From:</b> Intern, Meridian Architecture Studio</div>
          <div><b className="text-[#e6ecff]">Re:</b> {scenarioTitle}</div>
        </div>
        <MemoBlock title="Trade-off identified">
          {RISK_OPTIONS.find((r) => r.key === risk)?.label} — {RISK_OPTIONS.find((r) => r.key === risk)?.sub}
        </MemoBlock>
        <MemoBlock title="1. Issue Summary">{issue}</MemoBlock>
        <MemoBlock title="2. Proposed Modification">{mod}</MemoBlock>
        <MemoBlock title="3. Design Impact">{impact}</MemoBlock>
        <MemoBlock title="Response to mentor challenge">{challenge}</MemoBlock>
        <MemoBlock title="4. Implementation Timeline">{timeline}</MemoBlock>
      </div>
      <p className="mt-4 text-[12px] text-[#94a3c4] italic">
        This is what Kiran reads first. Does it hold up?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRevise}
          disabled={loading}
          className="rounded-[4px] border border-[#2a3a72] px-4 py-2 text-[12px] text-[#94a3c4] hover:border-primary/50 hover:text-primary disabled:opacity-40"
        >
          Revise
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={loading}
          className="rounded-[4px] bg-primary px-4 py-2 text-[12px] font-semibold text-black hover:brightness-110 disabled:opacity-40"
        >
          {loading ? "Sending..." : "Send to Kiran"}
        </button>
      </div>
    </div>
  );
}

function MemoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-[#94a3c4] font-semibold mb-0.5">{title}</div>
      <p className="whitespace-pre-wrap">{children}</p>
    </div>
  );
}

function ClosingReaction({ variant, onContinue }: { variant: "strong" | "partial" | "weak"; onContinue: () => void }) {
  const map = {
    strong: {
      tone: "border-[#52c47a] bg-[#0d1a0d] text-[#7ab87a]",
      icon: <CheckCircle2 className="h-4 w-4 text-[#52c47a]" />,
      label: "Kiran Mehta",
      text: "This is a memo I can take to Priya Nair without editing it first. Good work, that is the whole internship in one document.",
    },
    partial: {
      tone: "border-[#e0b752] bg-[#2a1f08] text-[#e0b752]",
      icon: <AlertTriangle className="h-4 w-4 text-[#e0b752]" />,
      label: "Kiran Mehta",
      text: "This works, but you did not fully answer my follow-up. Principals notice when a memo dodges the hard part, keep that in mind.",
    },
    weak: {
      tone: "border-[#e05252] bg-[#1a0808] text-[#e05252]",
      icon: <AlertTriangle className="h-4 w-4 text-[#e05252]" />,
      label: "Kiran Mehta",
      text: "I need more than a direction here, I need the number, the trade-off, and who it affects. Revise this before it goes anywhere near the client.",
    },
  } as const;
  const m = map[variant];
  return (
    <div className={cn("rounded-md border px-4 py-4 mt-3", m.tone)}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold">
        {m.icon}
        <span>Final reaction · {m.label}</span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed italic text-[#e6ecff]">{m.text}</p>
      <div className="mt-4">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-[4px] bg-primary px-4 py-2 text-[12px] font-semibold text-black hover:brightness-110"
        >
          Complete Internship
        </button>
      </div>
    </div>
  );
}