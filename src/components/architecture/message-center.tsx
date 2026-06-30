import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type ArchMessage = {
  id: string;
  initials: string;
  name: string;
  role: string;
  timestamp: string;
  tone?: "default" | "urgent";
  audioUrl?: string;
  body: ReactNode;
  preview: string;
};

type Ctx = {
  register: (m: ArchMessage) => void;
  fire: (m: ArchMessage) => void;
  archive: ArchMessage[];
  unread: Set<string>;
  open: (id: string) => void;
  markRead: (id: string) => void;
};

const MessageCenterCtx = createContext<Ctx | null>(null);

export function useMessageCenter() {
  const c = useContext(MessageCenterCtx);
  if (!c) {
    // Fallback no-op so VoiceNote can render outside a provider without crashing.
    return {
      register: () => {},
      fire: () => {},
      archive: [] as ArchMessage[],
      unread: new Set<string>(),
      open: () => {},
      markRead: () => {},
    } satisfies Ctx;
  }
  return c;
}

const AVATAR_CLS: Record<string, string> = {
  km: "bg-[#1a2a1a] text-[#52c47a] border-[#52c47a]",
  pn: "bg-[#1a1a2a] text-[#5299e0] border-[#5299e0]",
  aj: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
  sm: "bg-[#1a1a2a] text-[#e0b752] border-[#e0b752]",
  sr: "bg-[#1a1a2a] text-[#e0b752] border-[#e0b752]",
  da: "bg-[#2a1a1a] text-[#e05252] border-[#e05252]",
};

function avatarClassFor(initials: string, tone?: "default" | "urgent") {
  if (tone === "urgent") return "bg-[#2a1a1a] text-[#e05252] border-[#e05252]";
  return AVATAR_CLS[initials.toLowerCase()] || "bg-[#1a2a1a] text-[#52c47a] border-[#52c47a]";
}

export function MessageCenterProvider({ children }: { children: ReactNode }) {
  const [archive, setArchive] = useState<ArchMessage[]>([]);
  const [unread, setUnread] = useState<Set<string>>(() => new Set());
  const [queue, setQueue] = useState<ArchMessage[]>([]);
  const [current, setCurrent] = useState<ArchMessage | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [openMsg, setOpenMsg] = useState<ArchMessage | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  const enqueue = useCallback((m: ArchMessage) => {
    if (seenIds.current.has(m.id)) return;
    seenIds.current.add(m.id);
    setArchive((a) => [...a, m]);
    setUnread((u) => {
      const n = new Set(u);
      n.add(m.id);
      return n;
    });
    setQueue((q) => {
      const next = [...q, m];
      // Kiran first
      next.sort(
        (a, b) =>
          (a.initials.toLowerCase() === "km" ? 0 : 1) -
          (b.initials.toLowerCase() === "km" ? 0 : 1),
      );
      return next;
    });
  }, []);

  // Promote next message from queue when slot is free
  useEffect(() => {
    if (current || cooldown || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((q) => q.slice(1));
  }, [current, cooldown, queue]);

  // Auto-dismiss after 6s (does NOT mark as read)
  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => {
      setCurrent(null);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 1500);
    }, 6000);
    return () => clearTimeout(t);
  }, [current]);

  const open = useCallback(
    (id: string) => {
      const m = archive.find((x) => x.id === id);
      if (!m) return;
      setOpenMsg(m);
      setUnread((u) => {
        const n = new Set(u);
        n.delete(id);
        return n;
      });
      if (current?.id === id) {
        setCurrent(null);
        setCooldown(true);
        setTimeout(() => setCooldown(false), 1500);
      }
    },
    [archive, current],
  );

  const markRead = useCallback((id: string) => {
    setUnread((u) => {
      if (!u.has(id)) return u;
      const n = new Set(u);
      n.delete(id);
      return n;
    });
  }, []);

  // Escape closes modal first, then dismisses current toast
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openMsg) {
        setOpenMsg(null);
      } else if (current) {
        setCurrent(null);
        setCooldown(true);
        setTimeout(() => setCooldown(false), 1500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMsg, current]);

  const value = useMemo<Ctx>(
    () => ({ register: enqueue, fire: enqueue, archive, unread, open, markRead }),
    [enqueue, archive, unread, open, markRead],
  );

  return (
    <MessageCenterCtx.Provider value={value}>
      {children}
      <ToastLayer
        current={current}
        onExpand={(m) => open(m.id)}
        onDismiss={() => {
          setCurrent(null);
          setCooldown(true);
          setTimeout(() => setCooldown(false), 1500);
        }}
      />
      {openMsg && <MessageModal msg={openMsg} onClose={() => setOpenMsg(null)} />}
    </MessageCenterCtx.Provider>
  );
}

function ToastLayer({
  current,
  onExpand,
  onDismiss,
}: {
  current: ArchMessage | null;
  onExpand: (m: ArchMessage) => void;
  onDismiss: () => void;
}) {
  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[1500] pointer-events-none flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]"
    >
      {current && (
        <div
          key={current.id}
          className={cn(
            "pointer-events-auto bg-[#0f1a3e] border rounded-[8px] shadow-[0_18px_50px_rgba(0,0,0,0.55)] overflow-hidden",
            "animate-in slide-in-from-right-4 fade-in duration-200",
            current.tone === "urgent" ? "border-[#5a1a1a]" : "border-[#2a3a72]",
          )}
        >
          <div
            className="h-[2px] w-full"
            style={{
              background:
                current.tone === "urgent"
                  ? "linear-gradient(90deg, #e05252, transparent)"
                  : "linear-gradient(90deg, var(--primary), transparent)",
            }}
          />
          <button
            type="button"
            onClick={() => onExpand(current)}
            className="w-full text-left px-3 py-[10px] flex gap-[10px] hover:bg-[#152149] transition"
          >
            <div
              className={cn(
                "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[10.5px] font-semibold border",
                avatarClassFor(current.initials, current.tone),
              )}
            >
              {current.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11.5px] font-semibold text-[#e6ecff] truncate">
                  {current.name}
                </span>
                {current.tone === "urgent" && (
                  <span className="text-[8.5px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-sm bg-[#e05252]/15 text-[#e05252] border border-[#e05252]/40">
                    Urgent
                  </span>
                )}
                <span className="text-[9.5px] text-[#5a6a92] ml-auto shrink-0">
                  {current.timestamp.split("·")[0].trim()}
                </span>
              </div>
              <div className="text-[10.5px] text-[#94a3c4] truncate mb-1">
                {current.role}
              </div>
              <div className="text-[11.5px] text-[#c4cfe6] leading-[1.5] line-clamp-2">
                {current.preview}
              </div>
              <div className="text-[9.5px] text-primary mt-1">
                Tap to open · Esc to dismiss
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="self-start text-[#5a6a92] hover:text-[#e6ecff] transition text-[12px] leading-none -mr-1"
            >
              ✕
            </button>
          </button>
        </div>
      )}
    </div>
  );
}

function MessageModal({ msg, onClose }: { msg: ArchMessage; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/65 flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Message from ${msg.name}`}
    >
      <div className="bg-[#0f1a3e] border border-[#2a3a72] rounded-[10px] w-[480px] max-w-[95vw] max-h-[85vh] overflow-auto shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        <div className="flex items-center px-3 py-[10px] bg-[#0b1336] border-b border-[#1d2a5a] gap-[7px] sticky top-0">
          <span className="text-[14px]">💬</span>
          <span className="text-[11.5px] text-[#e6ecff] font-medium">
            Message, {msg.name}
          </span>
          {msg.tone === "urgent" && (
            <span className="text-[8.5px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-sm bg-[#e05252]/15 text-[#e05252] border border-[#e05252]/40">
              Urgent
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close message"
            className="ml-auto w-[20px] h-[20px] rounded-full bg-[#1c2b5e] text-[#94a3c4] hover:bg-[#e05252] hover:text-white flex items-center justify-center text-[10px] transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 pb-[10px] border-b border-[#1d2a5a]">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-[11.5px] font-semibold border",
                avatarClassFor(msg.initials, msg.tone),
              )}
            >
              {msg.initials}
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold text-[#e6ecff]">{msg.name}</div>
              <div className="text-[10.5px] text-[#94a3c4]">{msg.role}</div>
            </div>
            <div className="ml-auto text-[10px] text-[#5a6a92]">{msg.timestamp}</div>
          </div>
          {msg.audioUrl ? (
            <audio
              controls
              src={msg.audioUrl}
              className="w-full h-8 mb-3 [&::-webkit-media-controls-panel]:bg-[#1d2a5a]"
            >
              Your browser does not support audio playback.
            </audio>
          ) : null}
          <div className="text-[12.5px] leading-[1.7] text-[#c4cfe6] [&_strong]:text-[#e6ecff] [&_b]:text-[#e6ecff]">
            {msg.body}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-[4px] bg-primary px-[15px] py-[7px] text-[11.5px] font-medium text-black border border-primary hover:brightness-110"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extract plain-text preview from a React node tree
export function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && node !== null && "props" in (node as object)) {
    // @ts-expect-error - react element children access
    return extractText(node.props.children);
  }
  return "";
}