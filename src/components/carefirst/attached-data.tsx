import { ReactNode } from "react";
import { FileText, Quote } from "lucide-react";

export function AttachedSection({
  title = "Attached",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold mb-3">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function CsvCard({ filename, note }: { filename: string; note?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-4 py-3">
      <FileText className="h-4 w-4 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-mono text-foreground truncate">{filename}</div>
        {note && <div className="text-xs text-muted-foreground mt-0.5">{note}</div>}
      </div>
    </div>
  );
}

export function TranscriptBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4 flex gap-3">
      <Quote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <div className="text-[13.5px] text-foreground/85 leading-[1.7] italic">
        {children}
      </div>
    </div>
  );
}

export function StatList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 divide-y divide-border">
      {items.map((it, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3">
          <span className="text-[13px] text-muted-foreground">{it.label}</span>
          <span className="text-[13px] text-foreground font-medium text-right">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

export function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-2">
        {title}
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-[13.5px] text-foreground/85 flex gap-2">
            <span className="text-primary shrink-0">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}