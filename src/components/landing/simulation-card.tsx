import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, BarChart3 } from "lucide-react";

export type SimulationTag = { icon: ReactNode; label: string };

const DEFAULT_TAGS: SimulationTag[] = [
  { icon: <BarChart3 className="h-3.5 w-3.5" />, label: "Intermediate Level" },
  { icon: <Award className="h-3.5 w-3.5" />, label: "Certificate Included" },
];

export function SimulationCard({
  logo,
  company,
  role,
  to,
  ctaLabel = "Start Internship",
  comingSoon = false,
  tags,
}: {
  logo: ReactNode;
  company: string;
  role: string;
  to: string;
  ctaLabel?: string;
  comingSoon?: boolean;
  tags?: SimulationTag[];
}) {
  const tagList = tags ?? DEFAULT_TAGS;
  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-border bg-card p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
    >
      <div className="flex items-center justify-between">
        <div className="h-14 flex items-center">{logo}</div>
        {comingSoon && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-primary border border-primary/40 bg-primary/5 rounded-full px-2.5 py-1">
            Coming Soon
          </span>
        )}
      </div>
      <div className="mt-7">
        <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {company}
        </div>
        <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-foreground leading-tight">
          {role}
        </h3>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {tagList.map((t) => (
          <span
            key={t.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground"
          >
            {t.icon}
            {t.label}
          </span>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <Link
          to={to}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition w-full sm:w-auto justify-center"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}