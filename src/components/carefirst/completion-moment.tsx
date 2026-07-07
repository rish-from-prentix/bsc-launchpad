import { Check, Share2 } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function CompletionMoment({
  title,
  subtitle,
  shareable = false,
  shareableCaption,
  ctaLabel,
  onCta,
}: {
  title: string;
  subtitle?: string;
  shareable?: boolean;
  shareableCaption?: string;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <div className="mt-12 flex flex-col items-center text-center cf-fade-in">
      {/* Concentric chartreuse rings */}
      <div className="relative h-40 w-40">
        <div
          className="absolute inset-0 rounded-full cf-ring-expand"
          style={{
            border: "1px solid rgba(198,255,61,0.15)",
            animationDelay: "0ms",
          }}
        />
        <div
          className="absolute inset-3 rounded-full cf-ring-expand"
          style={{
            border: "1px solid rgba(198,255,61,0.28)",
            animationDelay: "80ms",
          }}
        />
        <div
          className="absolute inset-7 rounded-full cf-ring-expand"
          style={{
            border: "1px solid rgba(198,255,61,0.5)",
            boxShadow: "0 0 40px rgba(198,255,61,0.35)",
            animationDelay: "160ms",
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center cf-ring-expand"
          style={{ animationDelay: "260ms" }}
        >
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(198,255,61,0.14)",
              border: "1px solid rgba(198,255,61,0.55)",
              boxShadow: "0 0 32px rgba(198,255,61,0.4)",
            }}
          >
            <Check className="h-7 w-7" style={{ color: "#C6FF3D" }} />
          </div>
        </div>
      </div>

      <h2 className="cf-heading mt-6 text-2xl sm:text-[28px] text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[14px] text-muted-foreground max-w-md">
          {subtitle}
        </p>
      )}

      {shareable && shareableCaption && (
        <div className="mt-8 w-full max-w-lg cf-glass-elevated p-5 text-left">
          <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">
            Shareable deliverable
          </div>
          <div className="text-[13.5px] text-foreground/90 italic leading-relaxed">
            &ldquo;{shareableCaption}&rdquo;
          </div>
          <button
            type="button"
            className="mt-4 cf-glow-pulse inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary"
          >
            <Share2 className="h-3.5 w-3.5" /> Share to LinkedIn
          </button>
        </div>
      )}

      <button onClick={onCta} className="cf-btn-primary mt-10">
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/** Small inline confirmation for routine (non-shareable) task submits. */
export function RoutineCompletion({
  ctaLabel,
  onCta,
}: {
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <div className="mt-10 cf-glass p-5 cf-fade-in flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(198,255,61,0.12)",
            border: "1px solid rgba(198,255,61,0.4)",
          }}
        >
          <Check className="h-4 w-4" style={{ color: "#C6FF3D" }} />
        </div>
        <div className="text-[13.5px] text-foreground/90">Task submitted.</div>
      </div>
      <button onClick={onCta} className="cf-btn-primary" style={{ padding: "0.55rem 1.1rem" }}>
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}