import { BrandMark } from "@/components/brand-mark";
import { AicIsbLogo } from "@/components/aic-isb/aic-logo";

const LOGOS = [
  { key: "bsc", node: <BrandMark brand="bsc" height={32} /> },
  { key: "aic", node: <AicIsbLogo height={30} /> },
  {
    key: "meridian",
    node: (
      <div className="flex items-center gap-2.5 text-foreground/90">
        <div
          className="h-9 w-9 rounded-md border border-foreground/30 flex items-center justify-center text-lg font-semibold"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          M
        </div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
          Meridian Studio
        </span>
      </div>
    ),
  },
];

export function TrustedCompanies() {
  // Duplicate the logos to create a seamless marquee loop
  const loop = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="py-16 sm:py-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            Partners
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Built with the same people who'd be hiring you.
          </h2>
        </div>

        <div
          className="relative mt-12 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
            {loop.map((logo, i) => (
              <div
                key={`${logo.key}-${i}`}
                className="shrink-0 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              >
                {logo.node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}