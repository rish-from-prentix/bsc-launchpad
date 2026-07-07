import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ArrowRight } from "lucide-react";

type Ctx = {
  revealed: number;
  reveal: (n: number) => void;
};

const ProgressiveCtx = createContext<Ctx | null>(null);

const KEY = (taskId: number) => `carefirst.task-${taskId}.reveal`;

export function ProgressiveFlow({
  taskId,
  totalSteps,
  forceRevealAll = false,
  children,
}: {
  taskId: number;
  totalSteps: number;
  /** When the task is already submitted, skip the gating entirely. */
  forceRevealAll?: boolean;
  children: ReactNode;
}) {
  const [revealed, setRevealed] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = window.localStorage.getItem(KEY(taskId));
      const n = raw ? parseInt(raw, 10) : 0;
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY(taskId), String(revealed));
    } catch {
      /* ignore */
    }
  }, [taskId, revealed]);

  const reveal = useCallback(
    (n: number) => setRevealed((r) => Math.max(r, n)),
    [],
  );

  const effective = forceRevealAll ? totalSteps : revealed;

  const value = useMemo<Ctx>(
    () => ({ revealed: effective, reveal }),
    [effective, reveal],
  );

  return (
    <ProgressiveCtx.Provider value={value}>
      <div className="space-y-6">{children}</div>
    </ProgressiveCtx.Provider>
  );
}

/**
 * Renders `children` once revealIndex >= index. When at the reveal cursor, renders
 * a ghost chartreuse "Continue" button so the student progresses one section at a time.
 *
 * `index` starts at 0. The first step should render unconditionally, so use index=0
 * for the sender email (no gate). Subsequent steps use 1, 2, 3, …
 */
export function ProgressiveStep({
  index,
  label = "Continue reading",
  children,
}: {
  index: number;
  label?: string;
  children: ReactNode;
}) {
  const ctx = useContext(ProgressiveCtx);
  if (!ctx) return <>{children}</>;

  if (index === 0 || ctx.revealed >= index) {
    return <div className="cf-blur-in">{children}</div>;
  }

  if (ctx.revealed === index - 1) {
    return (
      <div className="flex justify-center py-2">
        <button
          type="button"
          onClick={() => ctx.reveal(index)}
          className="cf-btn-ghost"
        >
          {label}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return null;
}