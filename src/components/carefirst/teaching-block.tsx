import { ReactNode } from "react";

export function TeachingBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
    >
      <div className="flex">
        <div className="w-1 bg-primary" />
        <div className="flex-1 p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
            {title}
          </div>
          <div className="text-[14.5px] text-foreground/90 leading-[1.75] space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkedExample({
  title = "Worked example",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4 rounded-lg border border-border/70 bg-background/40 p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-2">
        {title}
      </div>
      <div className="text-[13.5px] text-foreground/85 leading-[1.7] space-y-2">
        {children}
      </div>
    </div>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-xl border border-primary/30 bg-primary/5 p-6"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <div className="text-[15px] text-foreground/90 leading-[1.75] italic">
        {children}
      </div>
    </div>
  );
}