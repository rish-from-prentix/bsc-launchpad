import { ReactNode, useEffect, useState } from "react";
import { ArrowRight, Check, List, Lock, Sparkles, X } from "lucide-react";
import { CAREFIRST_TASKS, TOTAL_TASKS, SHAREABLE_COUNT } from "./tasks-data";
import "./carefirst-theme.css";

export function CarefirstShell({
  name,
  currentTask,
  submitted,
  onOpen,
  children,
}: {
  name: string;
  currentTask: number;
  submitted: Set<number>;
  onOpen: (id: number) => void;
  children: ReactNode;
}) {
  const [overlayOpen, setOverlayOpen] = useState(false);

  const nextId =
    CAREFIRST_TASKS.find((t) => !submitted.has(t.id))?.id ?? currentTask;

  const isUnlocked = (id: number) => id <= Math.max(currentTask, nextId);

  const openAndClose = (id: number) => {
    onOpen(id);
    setOverlayOpen(false);
  };

  // Program Overview moment: currentTask is 0 and task 0 is not yet submitted.
  // Render sidebar inline (two-column) instead of an overlay — focus isn't yet needed.
  const inlineSidebar = currentTask === 0 && !submitted.has(0);

  // Escape closes the overlay.
  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlayOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen]);

  return (
    <div className="carefirst-theme min-h-[calc(100vh-4rem)] w-full">
      {inlineSidebar ? (
        <div className="mx-auto max-w-7xl w-full flex">
          <aside className="hidden lg:block w-[320px] shrink-0 border-r border-white/5 min-h-[calc(100vh-4rem)]">
            <SidebarBody
              name={name}
              submitted={submitted}
              currentTask={currentTask}
              onOpen={openAndClose}
              isUnlocked={isUnlocked}
            />
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      ) : (
        <main className="w-full min-w-0">{children}</main>
      )}

      {/* Persistent edge tab — visible whenever the sidebar is not inline */}
      {!inlineSidebar && (
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          className="cf-edge-tab"
          aria-label="Open task list"
        >
          <List className="h-3.5 w-3.5" />
          <span>
            {submitted.size}/{TOTAL_TASKS}
          </span>
        </button>
      )}

      {/* Overlay sidebar */}
      {overlayOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 cf-fade-in"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
            onClick={() => setOverlayOpen(false)}
          />
          <div
            className="relative w-[86%] max-w-[340px] h-full overflow-y-auto cf-slide-in-left"
            style={{
              background: "rgba(12,12,12,0.85)",
              backdropFilter: "blur(24px)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              onClick={() => setOverlayOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarBody
              name={name}
              submitted={submitted}
              currentTask={currentTask}
              onOpen={openAndClose}
              isUnlocked={isUnlocked}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarBody({
  name,
  submitted,
  currentTask,
  onOpen,
  isUnlocked,
}: {
  name: string;
  submitted: Set<number>;
  currentTask: number;
  onOpen: (id: number) => void;
  isUnlocked: (id: number) => boolean;
}) {
  return (
    <div className="p-5">
      <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
        Program Overview
      </div>
      <div className="mt-2 text-[15px] font-semibold text-foreground truncate">
        Welcome, {name || "Analyst"}.
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span>
          <span className="text-foreground font-semibold">{TOTAL_TASKS}</span> Tasks
        </span>
        <span>·</span>
        <span>
          <span className="text-foreground font-semibold">{SHAREABLE_COUNT}</span> Shareable
        </span>
        <span>·</span>
        <span>
          <span className="text-foreground font-semibold">{submitted.size}</span> Done
        </span>
      </div>

      <div className="mt-5 space-y-1">
        {CAREFIRST_TASKS.map((t) => {
          const done = submitted.has(t.id);
          const unlocked = isUnlocked(t.id);
          const active = t.id === currentTask;
          const locked = !unlocked;
          return (
            <button
              key={t.id}
              onClick={() => !locked && onOpen(t.id)}
              disabled={locked}
              className={`w-full text-left rounded-md px-3 py-2.5 flex items-center gap-3 transition border-l-2 ${
                active
                  ? "bg-primary/10 border-primary"
                  : "border-transparent hover:bg-secondary/40"
              } ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold shrink-0 ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                      ? "border border-primary/50 text-primary bg-primary/5"
                      : "border border-border text-muted-foreground"
                }`}
              >
                {String(t.id).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-foreground font-medium truncate">
                  {t.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em]">
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Check className="h-3 w-3" /> Completed
                    </span>
                  ) : active ? (
                    <span className="inline-flex items-center gap-1 text-primary">
                      In Progress
                    </span>
                  ) : locked ? (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <ArrowRight className="h-3 w-3" /> Start
                    </span>
                  )}
                  {t.shareable && (
                    <span className="inline-flex items-center gap-1 text-primary/70 ml-1">
                      <Sparkles className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}