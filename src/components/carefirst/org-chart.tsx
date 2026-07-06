// Simple 2-level org chart visual for Task 01. Uses card tokens and a gold
// accent for connector lines. Kept intentionally small — this is a snapshot
// of the relevant reporting lines, not a full corporate chart.

export function OrgChart() {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-5">
      <div className="text-[12px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-4">
        Org chart snippet
      </div>

      {/* Top level */}
      <div className="flex justify-center gap-4 flex-wrap">
        <OrgBox label="Hospital Administrator" />
        <OrgBox label="VP Operations (Ritu)" accent />
      </div>

      {/* Connectors down from VP Operations */}
      <div className="relative h-8 mt-1">
        {/* vertical stub from VP Ops down */}
        <div className="absolute left-1/2 top-0 h-4 w-px bg-primary/60" />
        {/* horizontal spine covering Ops-reporting reports */}
        <div className="absolute left-[16%] right-[42%] top-4 h-px bg-primary/60" />
        {/* down stubs to each report */}
        <div className="absolute left-[16%] top-4 h-4 w-px bg-primary/60" />
        <div className="absolute left-1/2 -translate-x-1/2 top-4 h-4 w-px bg-primary/60" />
        <div className="absolute right-[42%] top-4 h-4 w-px bg-primary/60" />
      </div>

      {/* Reports to Ops (solid) + Doctors as separate clinical branch */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <OrgBox label="Nurses" small />
        <OrgBox label="Reception" small />
        <OrgBox label="Lab Technicians" small />
        <OrgBox label="Doctors" small subtitle="Clinical line" />
      </div>

      {/* Support + external row */}
      <div className="mt-6 pt-5 border-t border-dashed border-border">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-3">
          Adjacent (not in reporting line)
        </div>
        <div className="flex flex-wrap gap-3">
          <OrgBox label="IT / App Team (PulseTech)" small subtitle="Support · dotted line" dashed />
          <OrgBox label="Patients" small subtitle="External" muted />
        </div>
      </div>
    </div>
  );
}

function OrgBox({
  label,
  subtitle,
  accent,
  dashed,
  muted,
  small,
}: {
  label: string;
  subtitle?: string;
  accent?: boolean;
  dashed?: boolean;
  muted?: boolean;
  small?: boolean;
}) {
  const border = dashed
    ? "border border-dashed border-border"
    : accent
      ? "border border-primary/50"
      : "border border-border";
  const bg = muted ? "bg-background/20" : "bg-card";
  const pad = small ? "px-3 py-2" : "px-4 py-2.5";
  const text = small ? "text-[12.5px]" : "text-[13px]";
  return (
    <div className={`rounded-md ${border} ${bg} ${pad} min-w-[130px] text-center`}>
      <div className={`${text} font-medium text-foreground/90 leading-tight`}>{label}</div>
      {subtitle && (
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mt-0.5">
          {subtitle}
        </div>
      )}
    </div>
  );
}