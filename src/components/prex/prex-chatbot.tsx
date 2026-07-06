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
      setMessages((m) => [...m, { role: "assistant", content: res.content || "(no response)" }]);
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
          className="group fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-[#8b5cf6] pl-3 pr-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_4px_rgba(139,92,246,0.18),0_0_28px_rgba(93,196,254,0.55)] hover:shadow-[0_0_0_6px_rgba(139,92,246,0.25),0_0_40px_rgba(93,196,254,0.75)] transition-shadow prex-pulse"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black/25 backdrop-blur">
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
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#8b5cf6] text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
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
              <div className="space-y-3">
                <div className="rounded-xl border border-border/60 bg-white/[0.03] px-3 py-3 text-[13px] leading-relaxed text-foreground/90">
                  Hi! I'm Prex. I can help you think through <span className="text-primary">{context.phaseLabel}</span>. Pick a starter question or ask me anything.
                </div>
                <div className="space-y-2">
                  {context.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="w-full rounded-lg border border-border/60 bg-white/[0.02] px-3 py-2 text-left text-[12.5px] text-foreground/85 transition hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
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
          0%, 100% { box-shadow: 0 0 0 4px rgba(139,92,246,0.18), 0 0 24px rgba(93,196,254,0.45); }
          50% { box-shadow: 0 0 0 6px rgba(139,92,246,0.28), 0 0 40px rgba(93,196,254,0.75); }
        }
        .prex-pulse { animation: prex-pulse-glow 2.6s ease-in-out infinite; }
      `}</style>
    </>
  );
}