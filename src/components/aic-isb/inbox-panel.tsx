import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Inbox, Mail, Send, Star } from "lucide-react";
import { cn, getFirstName } from "@/lib/utils";
import { AIC_INBOX, type InboxMessage } from "./phase-meta";

const ACCENT: Record<InboxMessage["accent"], string> = {
  indigo: "bg-primary/12 text-primary border-primary/30",
  teal: "bg-[oklch(0.72_0.13_195)]/12 text-[oklch(0.6_0.13_195)] border-[oklch(0.72_0.13_195)]/30",
  amber: "bg-[oklch(0.82_0.14_75)]/15 text-[oklch(0.62_0.14_70)] border-[oklch(0.82_0.14_75)]/30",
};

export function AicIsbInboxPanel({
  candidateName,
  currentPhase,
  maxReached,
}: {
  candidateName: string;
  currentPhase: number;
  maxReached: number;
}) {
  const firstName = getFirstName(candidateName) || "there";
  const visible = useMemo(
    () => AIC_INBOX.filter((m) => m.phase <= Math.max(currentPhase, maxReached + 1)),
    [currentPhase, maxReached],
  );
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  // Auto-surface the email for the current phase, but don't auto-mark read.
  useEffect(() => {
    const current = AIC_INBOX.find((m) => m.phase === currentPhase);
    if (current) setOpenId(current.id);
  }, [currentPhase]);

  const open = visible.find((m) => m.id === openId) ?? null;
  const unread = visible.filter((m) => !readIds.has(m.id)).length;

  function handleOpen(id: string) {
    setOpenId(id);
    setReadIds((s) => {
      if (s.has(id)) return s;
      const n = new Set(s);
      n.add(id);
      return n;
    });
  }

  return (
    <aside className="hidden lg:flex w-[340px] shrink-0 flex-col border-l border-border bg-card/40 sticky top-[105px] self-start max-h-[calc(100vh-105px)]">
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Inbox className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-foreground leading-tight">
              Inbox
            </div>
            <div className="text-[10.5px] text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <EmailDetail
          message={open}
          candidateName={firstName}
          onBack={() => setOpenId(null)}
        />
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {visible.length === 0 && (
            <li className="px-5 py-10 text-center text-xs text-muted-foreground">
              Your inbox is empty for now.
            </li>
          )}
          {visible
            .slice()
            .reverse()
            .map((m) => {
              const isUnread = !readIds.has(m.id);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => handleOpen(m.id)}
                    className={cn(
                      "w-full text-left flex gap-3 px-4 py-3 border-b border-border/60 transition-colors",
                      isUnread ? "bg-card" : "bg-transparent",
                      "hover:bg-secondary/60",
                    )}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-semibold border shrink-0",
                        ACCENT[m.accent],
                      )}
                    >
                      {m.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-[12.5px] truncate",
                            isUnread
                              ? "font-semibold text-foreground"
                              : "text-foreground/75",
                          )}
                        >
                          {m.senderName}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {m.timestamp.split("·").pop()?.trim()}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 text-[12px] truncate",
                          isUnread
                            ? "font-semibold text-foreground"
                            : "text-foreground/70",
                        )}
                      >
                        {m.subject}
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-muted-foreground line-clamp-2 leading-snug">
                        {m.preview}
                      </div>
                    </div>
                    {isUnread && (
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </aside>
  );
}

function EmailDetail({
  message,
  candidateName,
  onBack,
}: {
  message: InboxMessage;
  candidateName: string;
  onBack: () => void;
}) {
  const body = message.body.replaceAll("{name}", candidateName);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Inbox
        </button>
        <div className="ml-auto flex items-center gap-1 text-muted-foreground">
          <button className="p-1.5 rounded hover:bg-secondary transition" aria-label="Star">
            <Star className="h-3.5 w-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-secondary transition" aria-label="Reply">
            <Mail className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <h3 className="text-[15px] font-semibold text-foreground leading-tight">
          {message.subject}
        </h3>

        <div className="mt-3 flex items-start gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center text-[12px] font-semibold border shrink-0",
              ACCENT[message.accent],
            )}
          >
            {message.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold text-foreground truncate">
              {message.senderName}{" "}
              <span className="font-normal text-muted-foreground">
                &lt;{message.senderEmail}&gt;
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground truncate">
              to me · {message.timestamp}
            </div>
            <div className="text-[10.5px] text-muted-foreground/80 italic">
              {message.senderRole}
            </div>
          </div>
        </div>

        <div className="mt-5 text-[12.5px] leading-[1.75] text-foreground/85 whitespace-pre-wrap">
          {body}
        </div>
      </div>

      <ReplyBox sender={message.senderName} />
    </div>
  );
}

function ReplyBox({ sender }: { sender: string }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setText("");
      }}
      className="border-t border-border bg-background/60 p-3"
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
        Reply to {sender.split(" ")[0]}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Write a reply…"
        className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition"
      />
      <div className="mt-2 flex items-center justify-end">
        <button
          type="submit"
          disabled={text.trim().length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11.5px] font-semibold text-primary-foreground hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-3 w-3" />
          Send
        </button>
      </div>
    </form>
  );
}
