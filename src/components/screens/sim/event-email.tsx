import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function EventEmail({
  sender,
  initials,
  subject,
  body,
  collapsible = true,
  defaultOpen = true,
  onToggle,
  accentClassName,
}: {
  sender: string;
  initials: string;
  subject: string;
  body: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  accentClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const Header: ReactNode = (
    <div className="flex items-center gap-3 p-4 sm:p-5">
      <div
        className={
          accentClassName ??
          "h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold text-sm shrink-0"
        }
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{sender}</div>
        <div className="text-xs text-muted-foreground truncate">{subject}</div>
      </div>
      {collapsible && (
        <button
          onClick={() => {
            setOpen((o) => {
              const next = !o;
              onToggle?.(next);
              return next;
            });
          }}
          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition"
          aria-label={open ? "Collapse email" : "Expand email"}
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </div>
  );

  return (
    <div
      className="rounded-xl border border-primary/40 bg-card overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
    >
      {Header}
      {open && (
        <div className="border-t border-border/60 px-5 sm:px-6 pb-5 sm:pb-6 pt-4">
          <div className="text-[14px] text-foreground/90 leading-[1.7] whitespace-pre-wrap">
            {body}
          </div>
        </div>
      )}
    </div>
  );
}