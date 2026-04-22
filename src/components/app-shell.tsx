import { ReactNode } from "react";
import { BrandMark } from "./brand-mark";

type AppShellProps = {
  children: ReactNode;
  contextLabel?: string;
  showHeader?: boolean;
  showFooter?: boolean;
};

export function AppShell({
  children,
  contextLabel,
  showHeader = true,
  showFooter = true,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {showHeader && (
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <BrandMark brand="bsc" height={26} />
                {contextLabel && (
                  <span className="hidden md:inline-flex items-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="mr-3 h-3 w-px bg-border" />
                    {contextLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Powered by
                </span>
                <BrandMark brand="prentix" height={18} />
              </div>
            </div>
            {contextLabel && (
              <div className="md:hidden pb-2 -mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {contextLabel}
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
            <BrandMark brand="prentix" height={14} />
          </div>
        </footer>
      )}
    </div>
  );
}