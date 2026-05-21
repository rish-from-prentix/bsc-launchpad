import { Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";

const linkClass =
  "text-sm text-muted-foreground hover:text-foreground transition-colors";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/5 px-3.5 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Powered by
          </span>
          <BrandMark brand="prentix" height={18} />
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          <Link to="/" className={linkClass} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>
            Home
          </Link>
          <a href="/#simulations" className={linkClass}>
            Internships
          </a>
          <Link to="/about" className={linkClass} activeProps={{ className: "text-foreground" }}>
            About
          </Link>
          <Link to="/login" className={linkClass} activeProps={{ className: "text-foreground" }}>
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}