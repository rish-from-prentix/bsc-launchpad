## Prentix Landing Page

Build a new marketing landing page for Prentix using the existing dark + gold design system (`oklch(0.13 0 0)` background, gold `oklch(0.78 0.09 80)` primary, Inter typography). Inspiration: Forage — clean, professional, card-based, lots of breathing room.

### Routing changes
The current `/` route hosts the entire BSC simulation flow. To make room for the landing page without breaking the simulation:

- Move the current simulation flow (everything inside `src/routes/index.tsx`'s `Index` component) into a new route `src/routes/simulations.bsc.tsx`. No logic changes — just relocate.
- Rewrite `src/routes/index.tsx` to render the new landing page.
- Add a thin placeholder route `src/routes/simulations.aic-isb.tsx` whose "Start Simulation" goes to a "Coming soon" state (the AIC × ISB simulation isn't built yet).
- Add `src/routes/about.tsx`, `src/routes/login.tsx`, `src/routes/signup.tsx` as minimal placeholder pages so navbar links resolve (TanStack requires real route files for type-safe `<Link>`s).

### Components (new)

Create under `src/components/landing/`:

- `landing-nav.tsx` — sticky top nav.
  - Left: "Powered by" pill + `<BrandMark brand="prentix" />` (reuse existing).
  - Right: `<Link>`s to Home, Simulations (anchors to `#simulations`), About, Login, and a gold "Sign Up" CTA button.
- `landing-hero.tsx` — centered hero.
  - H1 (display, ~56px): "From classroom to career."
  - Sub-headline (gold accent line): "Develop skills employers actually look for through virtual work simulations."
  - Supporting paragraph (muted): "Gain hands-on experience, build confidence, and prepare for real-world roles through immersive internship simulations created with top companies."
  - Primary CTA: "Get Started" → scrolls to `#simulations`.
  - Subtle radial gradient backdrop matching splash screen.
- `simulation-card.tsx` — reusable card.
  - Props: `logo` (ReactNode), `company`, `role`, `tags` (icon+label list), `ctaLabel`, `to` route, `comingSoon?`.
  - Rounded `rounded-2xl`, `bg-card`, `border-border`, soft shadow `0 4px 24px rgba(0,0,0,0.4)`.
  - Hover: `-translate-y-1`, border becomes `border-primary/40`, shadow deepens (Tailwind transition).
  - Tags rendered as pills with Lucide icons: `BarChart3` (Intermediate), `Clock` (4–5 Hours), `Award` (Certificate Included).
- `simulations-section.tsx` — anchor `#simulations`.
  - Heading "Explore Our Internship Simulations" + short intro line.
  - Two `SimulationCard`s side-by-side (stack on mobile):
    1. BSC — `BrandMark brand="bsc"`, role "Growth & Business Operations Intern", CTA → `/simulations/bsc`.
    2. AIC × ISB — text logo placeholder ("AIC × ISB"), role "Program Manager Simulation", CTA → `/simulations/aic-isb` (Coming Soon badge).
- `how-it-works.tsx`
  - Heading "How Prentix Works", sub-heading, description paragraph.
  - 4 step cards in a responsive grid connected by a horizontal dotted line on `md+` (decorative SVG line behind the cards; vertical line on mobile).
  - Each card: numbered gold circle, title, body. Icons: `UserPlus`, `Briefcase`, `GraduationCap`, `Rocket`.
- `landing-footer.tsx`
  - Three columns: Prentix brand + tagline, Company links (About, Contact, Privacy Policy), Social (LinkedIn, Instagram with Lucide icons).
  - Bottom row: © Prentix 2026.

### Landing page composition

`src/routes/index.tsx` becomes:

```tsx
<div className="min-h-screen flex flex-col bg-background">
  <LandingNav />
  <main>
    <LandingHero />
    <SimulationsSection />
    <HowItWorks />
  </main>
  <LandingFooter />
</div>
```

Update `head()` to:
- title: "Prentix — From classroom to career"
- description: hero supporting paragraph
- og:title / og:description matching.

### Design tokens / styling
- Reuse existing tokens from `src/styles.css` — no new colors. Use `bg-card`, `border-border`, `text-primary` (gold), `text-muted-foreground`.
- Section spacing: `py-24 sm:py-32`, max width `max-w-6xl mx-auto px-5 sm:px-8`.
- Buttons: gold primary (`bg-primary text-primary-foreground`), ghost secondary (`border border-border hover:border-primary/40`).
- Animations: subtle fade-in on scroll using existing `fadeSlide` keyframe in `styles.css` (already defined).

### Files

New:
- `src/routes/simulations.bsc.tsx` (relocated current Index)
- `src/routes/simulations.aic-isb.tsx` (Coming Soon)
- `src/routes/about.tsx`, `src/routes/login.tsx`, `src/routes/signup.tsx` (placeholders)
- `src/components/landing/landing-nav.tsx`
- `src/components/landing/landing-hero.tsx`
- `src/components/landing/simulation-card.tsx`
- `src/components/landing/simulations-section.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/landing-footer.tsx`

Modified:
- `src/routes/index.tsx` — replaced with landing page composition.

### Out of scope
- No real auth — Login/Sign Up are placeholder pages.
- No CMS or backend changes.
- BSC simulation flow is moved verbatim, no functional changes.

Please confirm and I'll implement.