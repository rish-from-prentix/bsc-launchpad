import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function SplashScreen({ onBegin }: { onBegin: (name: string) => void }) {
  const [name, setName] = useState("");
  const [playing, setPlaying] = useState(false);
  const canStart = name.trim().length >= 2;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, oklch(0.16 0 0) 0%, oklch(0.13 0 0) 60%)",
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 pt-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/5 px-3.5 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Powered by</span>
          <BrandMark brand="prentix" height={20} />
        </div>
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Virtual Internship · 2026</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-2xl text-center">
          <div className="flex justify-center mb-8">
            <BrandMark brand="bsc" height={72} />
          </div>

          <h1 className="text-3xl sm:text-[42px] font-bold tracking-tight leading-tight text-foreground">
            Bombay Shaving Company
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Virtual Internship Program</p>
          <p className="mt-6 text-[15px] text-muted-foreground max-w-[480px] mx-auto leading-relaxed">
            Step into the role of a Growth & Business Operations Intern.
            <br />
            Make real decisions. See real consequences.
          </p>

          <div className="mt-10 mx-auto max-w-xl">
            <div
              className={`relative aspect-video rounded-xl bg-card overflow-hidden outline-none ring-0 ${!playing ? "group" : ""}`}
              onClick={() => !playing && setPlaying(true)}
              role={!playing ? "button" : undefined}
              tabIndex={!playing ? 0 : undefined}
              onKeyDown={(e) => {
                if (!playing && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setPlaying(true);
                }
              }}
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
            >
              {playing ? (
                <video
                  src="/videos/shantanu-onboarding.mp4"
                  poster="/videos/shantanu-onboarding-poster.jpg"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover bg-black"
                />
              ) : (
                <div className="absolute inset-0 cursor-pointer">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(ellipse at center, oklch(0.22 0 0) 0%, oklch(0.14 0 0) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                      <Play className="h-6 w-6 text-primary-foreground fill-current ml-0.5" />
                    </div>
                    <span className="text-sm text-foreground/90 font-medium">Watch Introduction</span>
                  </div>
                </div>
              )}
            </div>
            {
              <p className="mt-3 text-xs text-muted-foreground">
                Welcome message from Shantanu Deshpande, Founder — Bombay Shaving Company
              </p>
            }
          </div>

          <div className="mt-10 mx-auto max-w-sm">
            <label className="block text-left text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              Your full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canStart) onBegin(name.trim());
              }}
              placeholder="e.g. Aarav Mehta"
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />

            <button
              onClick={() => canStart && onBegin(name.trim())}
              disabled={!canStart}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Begin Internship
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">~20 min to complete onboarding</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-12 flex items-center justify-center gap-3 opacity-60">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            An internship experience by
          </span>
          <BrandMark brand="prentix" height={16} />
        </div>
      </footer>
    </div>
  );
}
