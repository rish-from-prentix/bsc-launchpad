import { ReactNode, useState } from "react";
import { ArrowRight, Check, Lock, Menu, Sparkles, X } from "lucide-react";
import { CAREFIRST_TASKS, TOTAL_TASKS, SHAREABLE_COUNT } from "./tasks-data";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const nextId =
    CAREFIRST_TASKS.find((t) => !submitted.has(t.id))?.id ?? currentTask;

  const isUnlocked = (id: number) => id <= Math.max(currentTask, nextId);

  const openAndClose = (id: number) => {
    onOpen(id);
    setMobileOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl w-full flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:block w-[300px] shrink-0 border-r border-border min-h-[calc(100vh-4rem)]">
        <SidebarBody
          name={name}
          submitted={submitted}
          currentTask={currentTask}
          onOpen={openAndClose}
          isUnlocked={isUnlocked}
        />
      </aside>

      {/* Mobile trigger */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold shadow-lg"
        >
          <Menu className="h-4 w-4" /> Tasks ({submitted.size}/{TOTAL_TASKS})
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[85%] max-w-[320px] h-full bg-background border-r border-border overflow-y-auto">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60"
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

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
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