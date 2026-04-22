import { ReactNode } from "react";

export function StepBar({ active }: { active: 0 | 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-1 w-12 rounded-full"
          style={{
            backgroundColor:
              i <= active ? "var(--primary)" : "var(--border)",
          }}
        />
      ))}
    </div>
  );
}

export function FormulaCard({
  children,
  large,
}: {
  children: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className="my-6 rounded-xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <div className="flex">
        <div className="w-1 bg-primary" />
        <div
          className={`flex-1 p-6 text-center font-mono ${
            large ? "text-base sm:text-lg" : "text-sm sm:text-[15px]"
          } text-foreground tracking-tight`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold mb-3">
      {children}
    </div>
  );
}

export function Breadcrumb({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs text-muted-foreground tracking-wide">
      {children}
    </div>
  );
}