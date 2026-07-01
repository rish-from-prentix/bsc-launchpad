import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  DataCard,
  SectionHeader,
  HelperText,
  SubmitBar,
  FeedbackPanel,
} from "./shared";
import { ARCH_TASKS, SITE_LAYERS } from "./arch-data";
import { Plus, X, ChevronDown } from "lucide-react";

const META = ARCH_TASKS[1];

const LAYER_CHIPS: Record<string, string[]> = {
  "Physical & Topographic": [
    "0.4m fall NE→SW",
    "Black cotton soil",
    "Raft foundation required",
    "Shed 80 sq.m. NW (demolish)",
    "3× neem trees W boundary",
    "8m canopy each",
    "TPO order",
    "Water table 4.5m",
  ],
  "Climate & Solar": [
    "Summer 38–42°C",
    "Monsoon 580mm / 75–90% humidity",
    "Winter 9–13°C",
    "SW–NE monsoon wind",
    "E–W dry season wind",
    "Solar altitude 80° summer / 50° winter",
    "Deep overhangs E+W required",
    "PV 6.2 kWh/sq.m./day",
  ],
  "Urban Context": [
    "DP Road east — 18m wide, high footfall",
    "Residential lane north — 6m",
    "Public park west",
    "Commercial strip south — 2 storeys",
    "Main entrance must face east",
    "Chamfered SW corner",
  ],
  "Noise & Services": [
    "DP Road 68–72 dB(A)",
    "Residential lane 40–48 dB(A)",
    "Park 42–55 dB(A)",
    "Library must not face DP Road",
    "Café / hall — noise tolerant",
    "Service entrance separate",
  ],
  "Regulatory Envelope": [
    "FAR 2.0 max",
    "Ground coverage 40% max",
    "Height 15m max",
    "Front setback E 6m",
    "Rear setback W 3m",
    "Side setbacks 3m",
    "Parking 1 per 50 sq.m.",
    "R2 + Institutional overlay",
    "Solar panels not visible from street",
    "Min 20% soft landscaping",
  ],
};

const LAYER_CUES: Record<string, { keywords: string[]; hint: string }> = {
  "Physical & Topographic": {
    keywords: ["soil", "raft", "fall", "drain", "tree", "neem", "water table", "demoli"],
    hint: "Have you addressed soil, drainage fall, and the protected neem trees?",
  },
  "Climate & Solar": {
    keywords: ["sun", "solar", "wind", "shade", "shading", "overhang", "monsoon", "orient", "pv", "°c"],
    hint: "Have you addressed solar orientation, shading, or monsoon winds?",
  },
  "Urban Context": {
    keywords: ["pedestrian", "approach", "view", "park", "road", "dp road", "street", "entrance"],
    hint: "Have you addressed pedestrian approach, views, or the park edge?",
  },
  "Noise & Services": {
    keywords: ["noise", "db", "buffer", "utility", "service", "access", "library"],
    hint: "Have you addressed the DP Road noise level (dB) and where the library should sit?",
  },
  "Regulatory Envelope": {
    keywords: ["far", "coverage", "setback", "height", "parking", "15m", "buildable"],
    hint: "Have you addressed FAR, setbacks, height limit, or parking?",
  },
};

type Constraint = { id: string; label: string; implication: string };
const newConstraint = (): Constraint => ({
  id: Math.random().toString(36).slice(2, 9),
  label: "",
  implication: "",
});

export function ArchTaskTwo({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [layers, setLayers] = useState<Record<string, string>>({});
  const [constraints, setConstraints] = useState<Constraint[]>(() => [
    newConstraint(),
    newConstraint(),
    newConstraint(),
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);
  const layerRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [openLayer, setOpenLayer] = useState<string>(SITE_LAYERS[0].layer);

  const validConstraints = constraints.filter(
    (c) => c.label.trim().length >= 3 && c.implication.trim().length >= 8,
  );

  function layerComplete(layer: string): boolean {
    const val = (layers[layer] || "").trim();
    if (val.length < 20) return false;
    const chips = LAYER_CHIPS[layer] || [];
    return chips.some((c) => val.toLowerCase().includes(c.toLowerCase()));
  }
  function layerStarted(layer: string): boolean {
    return (layers[layer] || "").trim().length > 0;
  }
  const completedLayers = SITE_LAYERS.filter((l) => layerComplete(l.layer)).length;
  const allFilled =
    completedLayers === SITE_LAYERS.length && validConstraints.length >= 3;

  function insertChip(layer: string, text: string) {
    const el = layerRefs.current[layer];
    const current = layers[layer] || "";
    if (el && document.activeElement === el) {
      const start = el.selectionStart ?? current.length;
      const end = el.selectionEnd ?? current.length;
      const before = current.slice(0, start);
      const after = current.slice(end);
      const needsLeadSpace = before.length > 0 && !/\s$/.test(before);
      const insert = (needsLeadSpace ? " " : "") + text;
      const next = before + insert + after;
      setLayers({ ...layers, [layer]: next });
      const caret = before.length + insert.length;
      setTimeout(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = caret;
      }, 0);
      return;
    }
    const sep = current && !/\s$/.test(current) ? " " : "";
    const next = current + sep + text;
    setLayers({ ...layers, [layer]: next });
    setTimeout(() => {
      const t = layerRefs.current[layer];
      if (t) {
        t.focus();
        t.selectionStart = t.selectionEnd = next.length;
        t.scrollTop = t.scrollHeight;
      }
    }, 0);
  }

  function constraintSuggestions() {
    const used = new Set(constraints.map((c) => c.label.toLowerCase().trim()).filter(Boolean));
    const fromLayers = Object.values(layers).join(" ").toLowerCase();
    if (!fromLayers.trim()) return [];
    const all = Object.values(LAYER_CHIPS).flat();
    return all
      .filter((label) => {
        const token = label.toLowerCase().split(/\s+/).find((t) => t.length > 3) || "";
        return token && fromLayers.includes(token);
      })
      .filter((l) => !used.has(l.toLowerCase()))
      .slice(0, 6);
  }

  async function submit() {
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: META.title,
          taskBrief: META.deliverable,
          submission: [
            ...SITE_LAYERS.map((l) => ({ label: l.layer, value: layers[l.layer] || "" })),
            {
              label: "Key opportunities and constraints",
              value: validConstraints
                .map((c, i) => `${i + 1}. ${c.label}, ${c.implication}`)
                .join("\n"),
            },
          ],
        },
      });
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = constraintSuggestions();

  return (
    <TaskFrame>
      <TaskHeader
        week={META.week}
        taskNumber={META.index}
        duration={META.duration}
        title={META.title}
        deliverable={META.deliverable}
      />
      <VoiceNote initials="KM" name="Kiran Mehta" role="Principal Architect" timestamp="Mon 09:00 · voice msg">
        The site has <strong>black cotton soil</strong>, flag it in your analysis, it will hit substructure budget hard. The three neem trees are under a TPO order. <strong>Touch them and we lose the project.</strong> And look carefully at DP Road noise, 68 to 72 dB(A). That is relevant to where you put the library.
      </VoiceNote>

      <DataCard label="Site Data, Survey No. 147, Aundh, Pune">
        <p><strong>Area:</strong> 4,856 sq.m. Rectangular 68m x 71m, chamfered SW corner.</p>
        <p><strong>Boundaries:</strong> East, DP Road (18m, high footfall). North, Residential lane (6m). West, Public park. South, Commercial strip.</p>
        <p><strong>Ground:</strong> 0.4m fall NE to SW. Black cotton soil (raft foundation required). Water table 4.5m.</p>
        <p><strong>Existing:</strong> Shed 80 sq.m. NW (demolish). 3 protected neem trees on W boundary, 8m canopy, TPO order.</p>
        <p><strong>Planning:</strong> R2 + Institutional. FAR 2.0. Coverage 40%. Height 15m. Setbacks: E 6m, W 3m, sides 3m.</p>
        <p><strong>Climate:</strong> Summer 38 to 42°C. Monsoon 580mm. DP Road noise 68 to 72 dB(A). PV potential 6.2 kWh/sq.m./day.</p>
      </DataCard>

      <SectionHeader hint="One design implication per layer. Recommended: 2 to 4 concise lines.">
        5 Layer Analysis
      </SectionHeader>

      <div className="rounded-lg border border-[#1d2a5a] bg-[#0b1336] p-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-[#c4cfe6]">
            <span className="font-semibold text-primary">{completedLayers} of {SITE_LAYERS.length}</span> layers complete
          </div>
          <div className="flex items-center gap-1.5">
            {SITE_LAYERS.map((l) => {
              const done = layerComplete(l.layer);
              const started = layerStarted(l.layer);
              return (
                <span
                  key={l.layer}
                  className={`h-2.5 w-2.5 rounded-full ${
                    done ? "bg-[#37c26b]" : started ? "bg-[#e0b752]" : "bg-[#2a3a72]"
                  }`}
                  title={l.layer}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {SITE_LAYERS.map((l) => {
          const val = layers[l.layer] || "";
          const cue = LAYER_CUES[l.layer];
          const lower = val.toLowerCase();
          const isOpen = openLayer === l.layer;
          const done = layerComplete(l.layer);
          const started = layerStarted(l.layer);
          const showNudge =
            val.trim().length >= 10 &&
            cue &&
            !cue.keywords.some((k) => lower.includes(k));
          const chips = LAYER_CHIPS[l.layer] || [];
          const hasChip = chips.some((c) => lower.includes(c.toLowerCase()));
          const showGroundPrompt = val.trim().length >= 20 && !hasChip;
          return (
            <div
              key={l.layer}
              className={`rounded-lg border ${isOpen ? "border-primary/50" : "border-border"} bg-card`}
            >
              <button
                type="button"
                onClick={() => setOpenLayer(isOpen ? "" : l.layer)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      done ? "bg-[#37c26b]" : started ? "bg-[#e0b752]" : "bg-[#2a3a72]"
                    }`}
                  />
                  <span className="text-sm font-semibold text-foreground truncate">{l.layer}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:inline">{l.focus}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#94a3c4] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#1d2a5a]/60 pt-3">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#5a6a92]">
                    Site facts for this layer, click to insert
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((c) => {
                      const inserted = lower.includes(c.toLowerCase());
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => insertChip(l.layer, c)}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition ${
                            inserted
                              ? "border-[#2a3a72]/60 bg-[#152149]/40 text-[#94a3c4] opacity-60 hover:opacity-100"
                              : "border-[#2a3a72] bg-[#152149] text-[#c4cfe6] hover:border-primary/60 hover:text-primary"
                          }`}
                        >
                          <Plus className="h-3 w-3" />
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    rows={4}
                    ref={(el) => {
                      layerRefs.current[l.layer] = el;
                    }}
                    value={val}
                    onChange={(e) => setLayers({ ...layers, [l.layer]: e.target.value })}
                    placeholder={l.placeholder}
                    className="w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {showGroundPrompt && (
                    <div className="text-[11px] text-[#e0b752]">
                      Ground your implication in a site fact, use a chip above.
                    </div>
                  )}
                  {showNudge && (
                    <div className="text-[11px] text-[#e0b752]">
                      Nudge: {cue.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SectionHeader hint="This is where research turns into design judgment. Min 3, max 5.">
        Key Design Opportunities & Constraints
      </SectionHeader>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#94a3c4]">
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#5a6a92]">
            Suggested labels:
          </span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                const emptyIdx = constraints.findIndex((c) => !c.label.trim());
                if (emptyIdx >= 0) {
                  const next = [...constraints];
                  next[emptyIdx] = { ...next[emptyIdx], label: s };
                  setConstraints(next);
                } else if (constraints.length < 5) {
                  setConstraints([...constraints, { ...newConstraint(), label: s }]);
                }
              }}
              className="rounded-full border border-[#2a3a72] bg-[#152149] px-2 py-0.5 hover:border-primary/60 hover:text-primary transition"
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {constraints.map((c, i) => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[10px] font-semibold text-primary shrink-0">
                {i + 1}
              </span>
              <input
                value={c.label}
                onChange={(e) => {
                  const next = [...constraints];
                  next[i] = { ...c, label: e.target.value };
                  setConstraints(next);
                }}
                placeholder="Label, e.g. Black cotton soil"
                className="flex-1 rounded-md bg-background/40 border border-border px-2.5 py-1.5 text-[12.5px] font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {constraints.length > 3 && (
                <button
                  type="button"
                  onClick={() => setConstraints(constraints.filter((x) => x.id !== c.id))}
                  className="text-[#94a3c4] hover:text-[#e05252] transition"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={c.implication}
              onChange={(e) => {
                const next = [...constraints];
                next[i] = { ...c, implication: e.target.value };
                setConstraints(next);
              }}
              placeholder="Design implication, one line. e.g. push library west, shield east façade with buffer programme."
              className="w-full rounded-md bg-background/40 border border-border px-2.5 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}
      </div>
      <HelperText>
        Each entry: a short label and a one-line design implication. Support with evidence from the layers above.
      </HelperText>

      {result ? (
        <FeedbackPanel
          passed={result.overall >= 6}
          score={result.overall}
          feedback={result.feedback}
          onRetry={() => setResult(null)}
          onContinue={onComplete}
        />
      ) : (
        <SubmitBar
          label="Submit Site Analysis Board"
          onSubmit={submit}
          disabled={!allFilled}
          loading={loading}
          hint={
            allFilled
              ? "Mentor will review and score."
              : "Fill all five layers and at least 3 opportunities/constraints (label + implication)."
          }
        />
      )}
    </TaskFrame>
  );
}
