import { ReactNode, useState } from "react";
import { ChevronDown, Mail, Paperclip, Reply, Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inbox-style email: starts collapsed as an unread inbox item, expands on
 * click into a full message view with CTA.
 */
export function InboxEmail({
  senderName,
  senderRole,
  senderInitials,
  subject,
  preview,
  timestamp = "Today · 11:04 AM",
  attachmentLabel,
  ctaLabel,
  onCta,
  badge,
  children,
  defaultOpen = false,
}: {
  senderName: string;
  senderRole?: string;
  senderInitials: string;
  subject: string;
  preview: string;
  timestamp?: string;
  attachmentLabel?: string;
  ctaLabel: string;
  onCta: () => void;
  badge?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [hasOpened, setHasOpened] = useState(defaultOpen);

  const toggle = () => {
    setOpen((o) => !o);
    setHasOpened(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold flex items-center gap-2">
        <Mail className="h-3.5 w-3.5" /> {hasOpened ? "Inbox" : "1 New Message · Inbox"}
      </div>
      {badge && (
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {badge}
        </h1>
      )}

      <article
        className={cn(
          "mt-6 glass rounded-2xl overflow-hidden transition-all duration-300",
          !hasOpened && "ring-1 ring-primary/40",
        )}
        style={{
          boxShadow: !hasOpened
            ? "0 0 0 1px rgba(93,196,254,0.2), 0 12px 50px -12px rgba(93,196,254,0.45)"
            : "0 8px 40px rgba(11,16,38,0.55)",
        }}
      >
        {/* Header (always visible, clickable) */}
        <button
          type="button"
          onClick={toggle}
          className="w-full text-left flex items-start gap-3 p-5 hover:bg-secondary/40 transition"
        >
          <div className="relative h-11 w-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-sm shrink-0 border border-primary/40">
            {senderInitials}
            {!hasOpened && (
              <span
                className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background"
                style={{ animation: "softPulse 2s ease-in-out infinite" }}
                aria-hidden
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "text-sm truncate",
                  hasOpened ? "font-medium text-foreground/90" : "font-semibold text-foreground",
                )}
              >
                {senderName}
              </span>
              {senderRole && (
                <span className="text-xs text-muted-foreground hidden sm:inline">· {senderRole}</span>
              )}
              {!hasOpened && (
                <span className="inline-flex items-center text-[10px] uppercase tracking-[0.14em] text-primary border border-primary/40 bg-primary/10 rounded-full px-1.5 py-0.5">
                  Unread
                </span>
              )}
            </div>
            <div
              className={cn(
                "mt-1 text-[13px] truncate",
                hasOpened ? "text-muted-foreground" : "text-foreground font-medium",
              )}
            >
              {subject}
            </div>
            {!open && (
              <div className="mt-1 text-[12px] text-muted-foreground line-clamp-1">
                {preview}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0 pl-2">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">{timestamp}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                !open && "-rotate-90",
              )}
            />
          </div>
        </button>

        {open && (
          <div className="border-t border-border animate-[slideDown_0.35s_ease-out] overflow-hidden">
            <div className="px-6 sm:px-7 py-6 text-[14.5px] text-foreground/90 leading-[1.75]">
              {children}
            </div>

            {attachmentLabel && (
              <div className="px-6 sm:px-7 pb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
                  <Paperclip className="h-3.5 w-3.5" /> {attachmentLabel}
                </span>
              </div>
            )}

            <div className="px-6 sm:px-7 pb-7 flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
              <button
                type="button"
                onClick={onCta}
                className="btn-primary-glow inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold"
              >
                {ctaLabel}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition"
              >
                <Reply className="h-3.5 w-3.5" /> Reply
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-secondary px-3.5 py-2 text-xs text-foreground/90 transition"
              >
                <Star className="h-3.5 w-3.5" /> Star
              </button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}