import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileCheck2 } from "lucide-react";
import {
  TaskFrame,
  TaskHeader,
  VoiceNote,
  SectionHeader,
  SubmitBar,
  MentorPrinciple,
} from "./shared";
import { ARCH_TASKS, DESIGN_CHECKS, ANNOTATION_CHECKLIST } from "./arch-data";

const META = ARCH_TASKS[4];
const STATUSES = ["Resolved", "Risk noted", "Not addressed"] as const;

export function ArchTaskFive({ onComplete }: { onComplete: () => void }) {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [massingFile, setMassingFile] = useState<File | null>(null);
  const planRef = useRef<HTMLInputElement>(null);
  const massingRef = useRef<HTMLInputElement>(null);

  const allReviewed = DESIGN_CHECKS.every((c) => statuses[c.check]);
  const noneUnaddressed = !Object.values(statuses).some((s) => s === "Not addressed");
  const allAnnotations = ANNOTATION_CHECKLIST.every((a) => checked[a]);
  const ready = allReviewed && noneUnaddressed && allAnnotations;

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

      <SectionHeader hint="Self review before submission. Nothing left at 'Not addressed'.">
        Design Checks
      </SectionHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Check</th>
              <th className="text-left px-3 py-2">Issue to Avoid</th>
              <th className="text-left px-3 py-2">Consequence</th>
              <th className="text-left px-3 py-2 w-40">Status</th>
            </tr>
          </thead>
          <tbody>
            {DESIGN_CHECKS.map((c) => (
              <tr key={c.check} className="border-t border-border">
                <td className="px-3 py-2 font-medium text-foreground/90">{c.check}</td>
                <td className="px-3 py-2 text-muted-foreground">{c.issue}</td>
                <td className="px-3 py-2 text-muted-foreground">{c.consequence}</td>
                <td className="px-3 py-2">
                  <select
                    value={statuses[c.check] || ""}
                    onChange={(e) => setStatuses({ ...statuses, [c.check]: e.target.value })}
                    className="w-full rounded-md bg-background/40 border border-border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="">Select</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader>Annotation Checklist</SectionHeader>
      <div className="grid sm:grid-cols-2 gap-2">
        {ANNOTATION_CHECKLIST.map((a) => (
          <label
            key={a}
            className={cn(
              "flex items-start gap-2 rounded-lg border bg-card p-3 cursor-pointer text-sm",
              checked[a] ? "border-primary/50" : "border-border",
            )}
          >
            <input
              type="checkbox"
              checked={!!checked[a]}
              onChange={(e) => setChecked({ ...checked, [a]: e.target.checked })}
              className="mt-0.5 accent-primary"
            />
            <span className="text-foreground/85">{a}</span>
          </label>
        ))}
      </div>

      <SectionHeader hint="Upload your scaled floor plan and 3D massing model as separate files.">
        Deliverable Uploads
      </SectionHeader>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {
            label: "Scaled Floor Plan",
            hint: "PDF, DWG, or PNG · 1:100 or 1:200",
            file: planFile,
            ref: planRef,
            accept: ".pdf,.dwg,.png,.jpg,.jpeg",
            onChange: setPlanFile,
          },
          {
            label: "3D Massing Model",
            hint: "SKP, RVT, 3DM, OBJ, or rendered views (PNG/JPG)",
            file: massingFile,
            ref: massingRef,
            accept: ".skp,.rvt,.3dm,.obj,.blend,.png,.jpg,.jpeg,.pdf",
            onChange: setMassingFile,
          },
        ].map((u) => (
          <div
            key={u.label}
            className={cn(
              "rounded-lg border bg-card p-4 flex flex-col gap-3",
              u.file ? "border-primary/50" : "border-border",
            )}
          >
            <div>
              <div className="text-sm font-medium text-foreground/90">{u.label}</div>
              <div className="text-xs text-muted-foreground">{u.hint}</div>
            </div>
            <input
              ref={u.ref}
              type="file"
              accept={u.accept}
              className="hidden"
              onChange={(e) => u.onChange(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => u.ref.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background/40 px-3 py-2 text-sm font-medium hover:bg-background/70 transition-colors"
            >
              {u.file ? <FileCheck2 className="h-4 w-4 text-primary" /> : <Upload className="h-4 w-4" />}
              {u.file ? "Replace File" : `Upload ${u.label}`}
            </button>
            {u.file && (
              <div className="text-xs text-muted-foreground truncate">
                {u.file.name} · {(u.file.size / 1024).toFixed(0)} KB
              </div>
            )}
          </div>
        ))}
      </div>

      <SubmitBar
        label="Submit Schematic Floor Plan"
        onSubmit={onComplete}
        disabled={!ready}
        hint={ready ? "All checks resolved and annotations confirmed." : "Resolve every check and tick all annotations."}
      />
    </TaskFrame>
  );
}