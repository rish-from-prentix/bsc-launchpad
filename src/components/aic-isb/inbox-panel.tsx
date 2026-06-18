import { Inbox } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { AIC_INBOX, type InboxMessage } from "./phase-meta";

const ACCENT: Record<InboxMessage["accent"], string> = {
  indigo: "bg-primary/12 text-primary border-primary/30",
  teal: "bg-[oklch(0.72_0.13_195)]/12 text-[oklch(0.6_0.13_195)] border-[oklch(0.72_0.13_195)]/30",
  amber: "bg-[oklch(0.82_0.14_75)]/15 text-[oklch(0.62_0.14_70)] border-[oklch(0.82_0.14_75)]/30",
};

export function AicIsbInboxPanel({
  currentPhase,
  maxReached,
  openId,
  readIds,
  onOpen,
  embedded = false,
}: {
  currentPhase: number;
  maxReached: number;
  openId: string | null;
  readIds: Set<string>;
  onOpen: (id: string) => void;
  embedded?: boolean;
}) {
  const visible = useMemo(
    () => AIC_INBOX.filter((m) => m.phase <= Math.max(currentPhase, maxReached + 1)),
    [currentPhase, maxReached],
  );
  const unread = visible.filter((m) => !readIds.has(m.id)).length;

  const body = (
    <>
      <div className="px-3.5 pt-4 pb-3 border-b border-border flex items-center gap-2 shrink-0">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
          <Inbox className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-foreground leading-tight">
            Inbox
          </div>
          <div className="text-[10px] text-muted-foreground">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </div>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center text-[11px] text-muted-foreground">
            Your inbox is empty.
          </li>
        )}
        {visible
          .slice()
          .reverse()
          .map((m) => {
            const isUnread = !readIds.has(m.id);
            const isActive = openId === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => onOpen(m.id)}
                  className={cn(
                    "w-full text-left flex gap-2.5 px-3 py-2.5 border-b border-border/60 transition-colors",
                    isActive
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : isUnread
                        ? "bg-card hover:bg-secondary/60"
                        : "bg-transparent hover:bg-secondary/60",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-[10.5px] font-semibold border shrink-0",
                      ACCENT[m.accent],
                    )}
                  >
                    {m.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-[11.5px] truncate",
                          isUnread
                            ? "font-semibold text-foreground"
                            : "text-foreground/75",
                        )}
                      >
                        {m.senderName}
                      </span>
                      <span className="text-[9.5px] text-muted-foreground shrink-0">
                        {m.timestamp.split("·").pop()?.trim()}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 text-[11.5px] truncate leading-snug",
                        isUnread
                          ? "font-semibold text-foreground"
                          : "text-foreground/70",
                      )}
                    >
                      {m.subject}
                    </div>
                    <div className="mt-0.5 text-[10.5px] text-muted-foreground truncate leading-snug">
                      {m.preview}
                    </div>
                  </div>
                  {isUnread && (
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
      </ul>
    </>
  );

  if (embedded) {
    return <div className="flex-1 min-h-0 flex flex-col bg-card/40">{body}</div>;
  }

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-l border-border bg-card/40 sticky top-[105px] self-start max-h-[calc(100vh-105px)]">
      {body}
    </aside>
  );
}
