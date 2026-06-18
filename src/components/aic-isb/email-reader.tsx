import { useEffect, useState } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CornerUpLeft,
  Forward,
  Printer,
  Reply,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import { type InboxMessage } from "./phase-meta";

const ACCENT: Record<InboxMessage["accent"], string> = {
  indigo: "bg-primary/12 text-primary border-primary/30",
  teal: "bg-[oklch(0.72_0.13_195)]/12 text-[oklch(0.6_0.13_195)] border-[oklch(0.72_0.13_195)]/30",
  amber: "bg-[oklch(0.82_0.14_75)]/15 text-[oklch(0.62_0.14_70)] border-[oklch(0.82_0.14_75)]/30",
};

export function EmailReader({
  message,
  candidateName,
  onClose,
  ctaLabel,
  onCta,
  heroTitle,
  heroSubtitle,
}: {
  message: InboxMessage;
  candidateName: string;
  onClose: () => void;
  ctaLabel?: string;
  onCta?: () => void;
  heroTitle?: string;
  heroSubtitle?: string;
}) {
  const firstName = getFirstName(candidateName) || "there";
  const body = message.body.replaceAll("{name}", firstName);
  const subject = message.subject.replaceAll("{name}", firstName);
  const hero = heroTitle?.replaceAll("{name}", firstName);
  const [showCompose, setShowCompose] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setShowCompose(false);
    setReplyText("");
    setSent(false);
  }, [message.id]);

  return (
    <div className="mx-auto max-w-[760px] px-5 sm:px-8 pt-8 pb-4">
      {(hero || heroSubtitle) && (
        <div className="mb-6 text-center">
          {hero && (
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {hero}
            </h1>
          )}
          {heroSubtitle && (
            <p className="mt-3 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      )}
      <article
        className="rounded-2xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 10px 36px -16px rgba(15, 23, 42, 0.35)" }}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border/70 bg-background/50">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to inbox
          </button>
          <div className="ml-auto flex items-center gap-0.5 text-muted-foreground">
            <IconBtn label="Archive"><Archive className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="Delete"><Trash2 className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="Star"><Star className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn label="Print"><Printer className="h-3.5 w-3.5" /></IconBtn>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded hover:bg-secondary hover:text-foreground transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Subject */}
        <div className="px-7 pt-6 pb-3">
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-foreground leading-tight tracking-tight">
            {subject}
          </h1>
          <div className="mt-1.5 inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Inbox · Phase {message.phase}
          </div>
        </div>

        {/* Sender row */}
        <div className="px-7 pb-4 flex items-start gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center text-[12.5px] font-semibold border shrink-0",
              ACCENT[message.accent],
            )}
          >
            {message.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="text-[13.5px] font-semibold text-foreground">
                {message.senderName}
              </span>
              <span className="text-[12px] text-muted-foreground">
                &lt;{message.senderEmail}&gt;
              </span>
            </div>
            <div className="text-[11.5px] text-muted-foreground">
              to me
            </div>
            <div className="text-[11px] text-muted-foreground/80 italic">
              {message.senderRole}
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground shrink-0 text-right">
            {message.timestamp}
          </div>
        </div>

        {/* Body */}
        <div className="px-7 pb-7 pt-2 border-t border-border/60">
          <div className="text-[14.5px] leading-[1.8] text-foreground/90 whitespace-pre-wrap">
            {body}
          </div>

          {/* Primary CTA — opens the phase workspace */}
          {onCta && (
            <div className="mt-7 flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
              <div className="min-w-0">
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-primary font-semibold">
                  Ready when you are
                </div>
                <div className="text-[12.5px] text-foreground/80 mt-0.5">
                  Open the Phase {message.phase} workspace to get started.
                </div>
              </div>
              <button
                type="button"
                onClick={onCta}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[12.5px] font-semibold text-primary-foreground hover:brightness-110 transition shadow-[0_6px_18px_-6px_oklch(0.55_0.18_265/_0.7)]"
              >
                {ctaLabel ?? `Start Phase ${message.phase}`}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Quick action chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCompose(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-medium text-foreground/85 hover:border-primary/50 hover:text-primary transition"
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </button>
            <button
              type="button"
              onClick={() => setShowCompose(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-medium text-foreground/85 hover:border-primary/50 hover:text-primary transition"
            >
              <CornerUpLeft className="h-3.5 w-3.5" />
              Reply all
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-[12px] font-medium text-foreground/85 hover:border-primary/50 hover:text-primary transition"
            >
              <Forward className="h-3.5 w-3.5" />
              Forward
            </button>
          </div>
        </div>

        {/* Compose */}
        {showCompose && (
          <div className="border-t border-border bg-background/60 px-7 py-5 animate-[fadeSlide_0.25s_ease-out]">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Reply to {message.senderName.split(" ")[0]}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (replyText.trim().length === 0) return;
                setSent(true);
                setReplyText("");
                setTimeout(() => {
                  setSent(false);
                  setShowCompose(false);
                }, 1400);
              }}
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder={`Hi ${message.senderName.split(" ")[0]},`}
                className="w-full resize-none rounded-lg border border-border bg-card px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition leading-[1.6]"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10.5px] text-muted-foreground">
                  {sent ? "Reply sent ✓" : "Draft saved automatically"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCompose(false);
                      setReplyText("");
                    }}
                    className="rounded-md px-3 py-1.5 text-[11.5px] text-muted-foreground hover:text-foreground transition"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={replyText.trim().length === 0 || sent}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </article>
    </div>
  );
}

function IconBtn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="p-1.5 rounded hover:bg-secondary hover:text-foreground transition"
    >
      {children}
    </button>
  );
}
