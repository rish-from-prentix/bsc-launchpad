import { ChangeEvent } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";

const editableCls =
  "w-full rounded-lg border border-[#2A2A2A] bg-background/60 px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition";
const lockedCls =
  "w-full rounded-lg border-0 bg-transparent px-3.5 py-2.5 text-[14px] text-[#888] cursor-default";

export function DeliverableLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-2">
      {children}
    </div>
  );
}

export function TextArea({
  value,
  onChange,
  locked,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  locked?: boolean;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={locked}
      placeholder={placeholder}
      rows={rows}
      className={locked ? lockedCls + " resize-none" : editableCls + " resize-y"}
    />
  );
}

export type TableRow = Record<string, string>;

export function EditableTable({
  columns,
  rows,
  onChange,
  locked,
}: {
  columns: { key: string; label: string; placeholder?: string }[];
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
  locked?: boolean;
}) {
  const addRow = () => {
    const blank: TableRow = {};
    columns.forEach((c) => (blank[c.key] = ""));
    onChange([...rows, blank]);
  };
  const update = (idx: number, key: string, v: string) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, [key]: v } : r));
    onChange(next);
  };
  const remove = (idx: number) => onChange(rows.filter((_, i) => i !== idx));

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div
        className="grid gap-px bg-border text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr)) 40px` }}
      >
        {columns.map((c) => (
          <div key={c.key} className="bg-card px-3 py-2 font-semibold">
            {c.label}
          </div>
        ))}
        <div className="bg-card" />
      </div>
      <div className="divide-y divide-border">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="grid gap-px bg-border"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr)) 40px` }}
          >
            {columns.map((c) => (
              <div key={c.key} className="bg-background/40 p-1">
                <input
                  type="text"
                  value={r[c.key] ?? ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    update(idx, c.key, e.target.value)
                  }
                  disabled={locked}
                  placeholder={c.placeholder}
                  className={
                    locked
                      ? "w-full bg-transparent border-0 px-2 py-1.5 text-[13.5px] text-[#888]"
                      : "w-full bg-transparent border-0 px-2 py-1.5 text-[13.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 rounded"
                  }
                />
              </div>
            ))}
            <div className="bg-background/40 flex items-center justify-center">
              {!locked && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Remove row"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {!locked && (
        <button
          type="button"
          onClick={addRow}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 text-[12px] text-primary hover:bg-primary/5 border-t border-border transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      )}
    </div>
  );
}

export function StepBuilder({
  steps,
  onChange,
  locked,
}: {
  steps: string[];
  onChange: (s: string[]) => void;
  locked?: boolean;
}) {
  const add = () => onChange([...steps, ""]);
  const update = (i: number, v: string) => onChange(steps.map((s, idx) => (idx === i ? v : s)));
  const remove = (i: number) => onChange(steps.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {steps.map((s, i) => (
        <div key={i}>
          <div className="flex items-start gap-2 rounded-lg border border-[#2A2A2A] bg-background/60 p-3">
            <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </div>
            <input
              type="text"
              value={s}
              onChange={(e) => update(i, e.target.value)}
              disabled={locked}
              placeholder={`Step ${i + 1}`}
              className={
                locked
                  ? "flex-1 bg-transparent border-0 text-[14px] text-[#888] focus:outline-none"
                  : "flex-1 bg-transparent border-0 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              }
            />
            {!locked && (
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === steps.length - 1}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className="h-4 w-4 text-primary/60" />
            </div>
          )}
        </div>
      ))}
      {!locked && (
        <button
          type="button"
          onClick={add}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-[12px] text-primary hover:bg-primary/5 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Add step
        </button>
      )}
    </div>
  );
}

export function UploadPlaceholder({
  label,
  locked,
}: {
  label: string;
  locked?: boolean;
}) {
  return (
    <div
      className={
        (locked
          ? "border-border bg-background/30 text-[#888] "
          : "border-[#2A2A2A] bg-background/40 text-muted-foreground hover:border-primary hover:text-foreground cursor-pointer ") +
        "rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-2 text-center transition"
      }
    >
      <Upload className="h-6 w-6" />
      <div className="text-[13.5px]">{label}</div>
      {!locked && (
        <div className="text-[11px] text-muted-foreground/70">
          Drop file here or click to upload (placeholder)
        </div>
      )}
    </div>
  );
}