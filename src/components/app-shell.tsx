import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { BrandMark } from "./brand-mark";

export type Crumb = { label: string; onClick?: () => void };

type AppShellProps = {
    children: ReactNode;
    contextLabel?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    onBack?: () => void;
    crumbs?: Crumb[];
};

export function AppShell({
    children,
    contextLabel,
    showHeader = true,
    showFooter = true,
    onBack,
    crumbs,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {showHeader && (
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {onBack && (
                                    <button
                                        onClick={onBack}
                                        aria-label="Go back"
                                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                )}
                                <BrandMark brand="bsc" height={26} />
                                {crumbs && crumbs.length > 0 ? (
                                    <span className="hidden md:inline-flex items-center text-xs uppercase tracking-[0.18em] text-muted-foreground gap-2">
                                        <span className="mr-1 h-3 w-px bg-border" />
                                        {crumbs.map((c, i) => (
                                            <span key={i} className="inline-flex items-center gap-2">
                                                {i > 0 && <span className="text-muted-foreground/40">/</span>}
                                                {c.onClick ? (
                                                    <button onClick={c.onClick} className="hover:text-foreground transition">
                                                        {c.label}
                                                    </button>
                                                ) : (
                                                    <span className="text-foreground/80">{c.label}</span>
                                                )}
                                            </span>
                                        ))}
                                    </span>
                                ) : contextLabel ? (
                                    <span className="hidden md:inline-flex items-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                        <span className="mr-3 h-3 w-px bg-border" />
                                        {contextLabel}
                                    </span>
                                ) : null}
                            </div>
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Powered by
                </span>
                <BrandMark brand="prentix" height={20} />
              </div>
            </div>
            {(contextLabel || (crumbs && crumbs.length)) && (
              <div className="md:hidden pb-2 -mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {crumbs && crumbs.length ? crumbs.map((c) => c.label).join(" / ") : contextLabel}
              </div>
            )}
          </div>
        </header>
      )}

      <main className="flex-1 w-full">{children}</main>

      {showFooter && (
        <footer className="border-t border-border mt-12">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 h-12 flex items-center justify-center gap-3 opacity-60">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              An internship experience by
            </span>
            <BrandMark brand="prentix" height={16} />
          </div>
        </footer>
      )}
    </div>
  );
}