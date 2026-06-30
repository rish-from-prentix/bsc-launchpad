import { useEffect, useRef } from "react";

const COLORS = ["#5dc4fe", "#7ab87a", "#e0b752", "#f0c75e", "#ffffff", "#c7a24a"];

export function Confetti({ duration = 2800 }: { duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const particles = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * W(),
      y: -20 - Math.random() * H() * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      size: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.5 ? "rect" : "circ",
    }));

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W(), H());
      const fade = Math.max(0, 1 - Math.max(0, elapsed - duration * 0.6) / (duration * 0.5));
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      if (elapsed < duration) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W(), H());
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-hidden="true"
    />
  );
}