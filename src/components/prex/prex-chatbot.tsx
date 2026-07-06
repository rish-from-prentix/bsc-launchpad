import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { askPrex } from "@/lib/prex-chat.functions";
import { cn } from "@/lib/utils";

export type PrexContext = {
  /** Human-readable label of the current phase/screen. */
  phaseLabel: string;
  /** 1-3 sentence description of what the user is doing here. */
  phaseDescription: string;
  /** 3-4 suggested prompt questions tailored to this phase. */
  suggestions: string[];
};

type Msg = { role: "user" | "assistant"; content: string };

export function PrexChatbot({ context }: { context: PrexContext }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ask = useServerFn(askPrex);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const nextMsgs: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);
    try {
      const phaseContext = `Phase: ${context.phaseLabel}\n${context.phaseDescription}`;
      const res = await ask({
        data: { phaseContext, messages: nextMsgs },
      });
      const clean = (res.content || "(no response)")
        .replace(/\*\*/g, "")
        .replace(/^#{1,6}\s+/gm, "");
      setMessages((m) => [...m, { role: "assistant", content: clean }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ask Prex"
          className="btn-primary-glow group fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-1.5 text-sm font-semibold text-white shadow-[0_0_0_3px_rgba(93,196,254,0.2),0_0_20px_rgba(93,196,254,0.4)] hover:shadow-[0_0_0_5px_rgba(93,196,254,0.3),0_0_32px_rgba(93,196,254,0.6)] transition-shadow prex-pulse"
        >
          <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-black/25 backdrop-blur">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="tracking-wide">Prex</span>
          <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-md border border-border bg-background/95 px-2 py-1 text-[11px] font-medium text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Ask Prex
          </span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[60] flex h-[560px] max-h-[85vh] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-primary/25 bg-[#0a1024]/95 shadow-[0_20px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(93,196,254,0.25)] backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/15 to-[#8b5cf6]/15 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="leading-tight">
                <div className="text-sm font-semibold text-foreground">Prex — Your AI Mentor</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {context.phaseLabel}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
              aria-label="Close Prex"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-border/60 bg-white/[0.03] px-3 py-3 text-[13px] leading-relaxed text-foreground/90">
                Hi! I'm Prex. I can help you think through <span className="text-primary">{context.phaseLabel}</span>. Pick a starter question below or ask me anything.
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start items-start gap-2",
                )}
              >
                {m.role === "assistant" && (
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#8b5cf6] text-primary-foreground">
                    <Sparkles className="h-3 w-3" />
                  </span>
                )}
                <div
                  className={cn(
                    "max-w-[82%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                    m.role === "user"
                      ? "bg-gradient-to-br from-primary to-[#8b5cf6] text-primary-foreground rounded-br-sm"
                      : "bg-white/[0.04] text-foreground/90 border border-border/50 rounded-bl-sm",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#8b5cf6] text-primary-foreground">
                  <Sparkles className="h-3 w-3" />
                </span>
                <div className="rounded-2xl rounded-bl-sm border border-border/50 bg-white/[0.04] px-3 py-2 text-[13px] text-muted-foreground inline-flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-[12px] text-destructive">
                {error}
              </div>
            )}
          </div>

          {/* Persistent suggestion chips (shown above composer, on every phase) */}
          <div className="border-t border-border/60 bg-black/20 px-3 py-2.5">
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Ask Prex about
            </div>
            <div className="flex flex-wrap gap-1.5">
              {context.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  disabled={loading}
                  className="rounded-full border border-primary/40 bg-gradient-to-r from-primary/20 to-[#5dc4fe]/20 px-2.5 py-1 text-left text-[11.5px] font-medium text-foreground/90 shadow-[0_0_0_1px_rgba(93,196,254,0.12),0_0_10px_rgba(93,196,254,0.15)] transition hover:from-primary/35 hover:to-[#5dc4fe]/35 hover:border-primary/70 hover:text-white disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border/60 bg-black/30 p-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-white/[0.03] px-3 py-2 focus-within:border-primary/60">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Prex anything about this phase..."
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8b5cf6] text-primary-foreground disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes prex-pulse-glow {
          0%, 100% { box-shadow: 0 0 0 3px rgba(93,196,254,0.2), 0 0 20px rgba(93,196,254,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(93,196,254,0.3), 0 0 32px rgba(93,196,254,0.6); }
        }
        .prex-pulse { animation: prex-pulse-glow 2.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}