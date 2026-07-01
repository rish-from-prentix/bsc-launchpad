import { useState, useEffect } from "react";
import { FileText, Download, Eye, X, BookOpen } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { scoreArchitectureTask, type ArchScore } from "@/lib/score-architecture-task.functions";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  SectionHeader,
  HelperText,
  SubmitBar,
  FeedbackPanel,
  MentorPrinciple,
} from "./shared";
import { ARCH_TASKS } from "./arch-data";
import briefPdf from "@/assets/PMC-client-brief.pdf.asset.json";

const META = ARCH_TASKS[0];
const BRIEF_TITLE = "PMC Client Brief";
const BRIEF_FILENAME = "PMC-client-brief.pdf";
const BRIEF_PAGES = 5;

const FIELDS = [
  { key: "musts", label: "Must-have requirements", placeholder: "What the client has stated as non-negotiable..." },
  { key: "nice", label: "Nice-to-have Features (tie each to a persona)", placeholder: "Desirable but cuttable if needed..." },
  { key: "budget", label: "Budget risks", placeholder: "Where might costs overrun? What's excluded from 8.1cr?" },
  { key: "unknowns", label: "Unknowns to clarify", placeholder: "What information is missing? What must you ask the client?" },
] as const;

export function ArchTaskOne({ onComplete }: { onComplete: () => void }) {
  const score = useServerFn(scoreArchitectureTask);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchScore | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowHint(localStorage.getItem("hasSeenMessageHint") !== "true");
    }
  }, []);

  const allFilled = FIELDS.every((f) => (values[f.key] || "").trim().length >= 8);

  async function submit() {
    setLoading(true);
    try {
      const r = await score({
        data: {
          taskTitle: META.title,
          taskBrief: META.deliverable,
          submission: FIELDS.map((f) => ({ label: f.label, value: values[f.key] || "" })),
        },
      });
      setResult(r);
    } finally {
      setLoading(false);
  }

  function dismissHint() {
    setShowHint(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenMessageHint", "true");
    }
  }
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
        Architects do not start with software. They start by understanding people, place and constraints. Every design decision in the following weeks must trace back to what is learned this week.
      </MentorPrinciple>

      <BriefDocumentCard onPreview={() => setPreviewOpen(true)} />

      <VoiceNote
        initials="PN"
        name="Priya Nair"
        role="Deputy Commissioner · PMC"
        timestamp="Mon 08:12"
      >
        Good Morning. So, just to set expectations on budget , it's firm at 8.1 crore, that's excluding fees, furniture, and IT. I do want to flag, the Corporation won't be revisiting this figure, so I'd ask that we work within it from the start. Planning submission is due in 12 weeks. A couple of things I need locked in the café has to be NGO-operated, and the entrance should face DP Road. One area where there's a bit of room , co-working seat count can flex slightly if that helps balance things on your end. If you could just confirm you've understood the constraints before we move ahead, that would be great. Thank you.
      </VoiceNote>

      <SectionHeader hint="Capture your decoding of the brief. Stay concise: 2 to 4 lines per cell.">
        Brief Decoding Matrix
      </SectionHeader>
      <HelperText>
        Read the Project Brief Document above and complete each cell based on what you find.
      </HelperText>
      <div className="space-y-3">
        {FIELDS.map((f) => (
          <div key={f.key} className="rounded-lg border border-border bg-card p-4">
            <label className="block text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
              {f.label}
            </label>
            <textarea
              rows={3}
              value={values[f.key] || ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="mt-2 w-full rounded-md bg-background/40 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <HelperText>Focus on reasoning, not summaries.</HelperText>
          </div>
        ))}
      </div>

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
          label="Submit Brief Decoding Sheet"
          onSubmit={submit}
          disabled={!allFilled}
          loading={loading}
          hint={allFilled ? "Mentor will review and score." : "Fill every cell to submit."}
        />
      )}

      {!previewOpen && (
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
        >
          <BookOpen className="h-4 w-4" /> Open Brief
        </button>
      )}

      {previewOpen && (
        <BriefPreviewModal onClose={() => setPreviewOpen(false)} />
      )}
    </TaskFrame>
  );
}

function BriefDocumentCard({ onPreview }: { onPreview: () => void }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card/60 p-5 sm:p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Project Brief Document
      </div>
      <h2 className="mt-1 text-lg font-semibold text-foreground">
        Read the brief before decoding
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The full client brief from Pune Municipal Corporation. Use it as the source for every cell in the decoding matrix below.
      </p>

      <div className="mt-5 rounded-xl border border-border bg-background/40 p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-12 shrink-0 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{BRIEF_TITLE}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              PDF · {BRIEF_PAGES} pages · {BRIEF_FILENAME}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onPreview}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-3.5 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                <Eye className="h-4 w-4" /> Preview PDF
              </button>
              <a
                href={briefPdf.url}
                download={BRIEF_FILENAME}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-sm font-medium text-foreground/90 transition"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefPreviewModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{BRIEF_TITLE}</div>
            <div className="text-[11px] text-muted-foreground">
              {BRIEF_PAGES} pages · use the viewer toolbar for page navigation and zoom
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={briefPdf.url}
              download={BRIEF_FILENAME}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground/90"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-secondary text-foreground/80"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <iframe
          src={`${briefPdf.url}#toolbar=1&navpanes=1&view=FitH`}
          title={BRIEF_TITLE}
          className="flex-1 w-full bg-white"
        />
      </div>
    </div>
  );
}