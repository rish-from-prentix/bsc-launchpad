import { ReactNode } from "react";
import { Mail } from "lucide-react";

export function CarefirstEmail({
  senderName,
  senderRole,
  initials,
  subject,
  children,
}: {
  senderName: string;
  senderRole?: string;
  initials: string;
  subject?: string;
  children: ReactNode;
}) {
  return (
    <article
      className="rounded-xl border border-border bg-card overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-start gap-3 p-5 border-b border-border/60">
        <div className="h-11 w-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0 border border-primary/40">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">
              {senderName}
            </span>
            {senderRole && (
              <span className="text-xs text-muted-foreground">· {senderRole}</span>
            )}
          </div>
          {subject ? (
            <div className="mt-1 text-[13px] text-foreground/85 font-medium">
              {subject}
            </div>
          ) : (
            <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-primary flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> Welcome message
            </div>
          )}
        </div>
      </div>
      <div className="px-6 py-5 text-[14.5px] text-foreground/90 leading-[1.75] whitespace-pre-wrap">
        {children}
      </div>
    </article>
  );
}