import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export function LandingFooter() {
  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14 grid gap-10 sm:grid-cols-3">
        <div>
          <BrandMark brand="prentix" height={24} />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Virtual virtual internships that bridge the gap between classroom and career.
          </p>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
            Company
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/about" className="text-foreground/80 hover:text-foreground transition">
                About
              </Link>
            </li>
            <li>
              <a href="mailto:hello@prentix.ai" className="text-foreground/80 hover:text-foreground transition">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground/80 hover:text-foreground transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
            Follow
          </div>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 h-14 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>© 2026 Prentix</span>
          <span>Made for the next generation of talent</span>
        </div>
      </div>
    </footer>
  );
}