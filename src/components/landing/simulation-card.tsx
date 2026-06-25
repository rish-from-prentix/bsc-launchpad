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
      className="group relative flex h-[480px] w-full flex-col rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.35)" }}
    >
      <div className="flex h-20 items-center justify-between shrink-0">
        <div className="flex h-20 items-center overflow-hidden">{logo}</div>
        {comingSoon && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-primary border border-primary/40 bg-primary/5 rounded-full px-2.5 py-1">
            Coming Soon
          </span>
        )}
      </div>
      <div className="mt-6 h-10 shrink-0 overflow-hidden">
        <div
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground line-clamp-2"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
        >
          {company}
        </div>
      </div>
      <div className="mt-2 h-[84px] shrink-0 overflow-hidden">
        <h3
          className="text-xl sm:text-2xl font-semibold text-foreground leading-tight"
          style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {role}
        </h3>
      </div>
      <div className="mt-6 flex h-9 shrink-0 flex-wrap items-center gap-2 overflow-hidden">
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
      <div className="mt-auto pt-6 border-t border-border">
        <Link
          to={to}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}