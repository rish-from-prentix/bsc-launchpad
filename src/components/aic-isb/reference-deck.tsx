import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import slide1 from "@/assets/example-deck/slide-1.jpg.asset.json";
import slide2 from "@/assets/example-deck/slide-2.jpg.asset.json";
import slide3 from "@/assets/example-deck/slide-3.jpg.asset.json";
import slide4 from "@/assets/example-deck/slide-4.jpg.asset.json";
import slide5 from "@/assets/example-deck/slide-5.jpg.asset.json";
import slide6 from "@/assets/example-deck/slide-6.jpg.asset.json";
import slide7 from "@/assets/example-deck/slide-7.jpg.asset.json";
import slide8 from "@/assets/example-deck/slide-8.jpg.asset.json";

const SLIDES = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8].map(
  (s) => s.url,
);

const TIPS = [
  "Before you write anything, find three real things: a recent regulation or shift in the sector, a startup or deal from the last year, and one number that surprised you.",
  "Open with why now is different, point to something specific that changed recently, not \u201Cthe market is growing.\u201D",
  "Get your bet down to one sentence. If it takes a paragraph, you haven't decided yet, name the customer, the problem, and why it couldn't have been built three years ago.",
  "Show you've looked at who else is already in this space, real companies, real investors, real recent deals. Then point to the gap nobody's claimed yet.",
  "Pick the risk that genuinely worries you, not the easy one. If your counter feels too convenient, you picked the wrong risk.",
  "Close with one line you could say out loud with no slides behind you, it should sound like a decision, not a summary.",
  "It's fine to admit what you don't know. That usually lands better than sounding certain about everything.",
];

export function ReferenceDeck() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIdx(null);
      else if (e.key === "ArrowRight")
        setOpenIdx((i) => (i === null ? 0 : (i + 1) % SLIDES.length));
      else if (e.key === "ArrowLeft")
        setOpenIdx((i) =>
          i === null ? 0 : (i - 1 + SLIDES.length) % SLIDES.length,
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx]);

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Reference Deck · Example Investment Thesis
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground/85 leading-relaxed max-w-2xl">
        Review this example deck to understand the expected depth, structure, and
        quality of analysis. Your submission does not need to match the content,
        but should demonstrate similar strategic thinking.
      </p>

      {/* Thumbnails, horizontal scroll */}
      <div className="mt-5 -mx-1 overflow-x-auto pb-2">
        <div className="flex gap-3 px-1">
          {SLIDES.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="group shrink-0 w-44 sm:w-52 rounded-lg overflow-hidden border border-border bg-background hover:border-primary/60 transition shadow-sm"
            >
              <div className="relative aspect-[16/9] bg-muted">
                <img
                  src={src}
                  alt={`Example deck slide ${i + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] text-muted-foreground border-t border-border bg-card">
                <span>Slide {i + 1}</span>
                <span className="opacity-0 group-hover:opacity-100 transition text-primary">
                  Open
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <details className="mt-5 group rounded-lg border border-border bg-background/40">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-xs uppercase tracking-[0.18em] text-primary font-semibold flex items-center justify-between">
          How to think about it
          <ChevronRight className="h-3.5 w-3.5 transition group-open:rotate-90" />
        </summary>
        <ul className="px-5 pb-4 space-y-2 text-[13px] text-foreground/85 leading-relaxed list-disc">
          {TIPS.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </details>

      {/* Lightbox */}
      {openIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setOpenIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx(null);
            }}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx((i) =>
                i === null ? 0 : (i - 1 + SLIDES.length) % SLIDES.length,
              );
            }}
            className={cn(
              "absolute left-4 sm:left-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center",
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIdx((i) => (i === null ? 0 : (i + 1) % SLIDES.length));
            }}
            className="absolute right-4 sm:right-8 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <figure
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={SLIDES[openIdx]}
              alt={`Example deck slide ${openIdx + 1}`}
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <figcaption className="mt-3 text-center text-xs text-white/70 tracking-[0.18em] uppercase">
              Slide {openIdx + 1} of {SLIDES.length}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}