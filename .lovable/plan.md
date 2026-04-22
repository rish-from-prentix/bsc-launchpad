
# BSC Virtual Internship — Onboarding Flow (Updated with Logos)

Same premium dark/gold onboarding flow as previously approved, with the two uploaded brand marks (Bombay Shaving Company wordmark + Prentix wordmark) integrated throughout instead of text placeholders.

## Logo integration

- **Assets**: Copy both uploads into `src/assets/`:
  - `src/assets/bsc-logo.png` (Bombay Shaving Company stacked wordmark)
  - `src/assets/prentix-logo.png` (Prentix wordmark)
- Both logos are black-on-transparent — render them on dark surfaces with a CSS `invert()` filter (or `brightness(0) invert(1)`) so they appear crisp white against `#0A0A0A`. Import as ES6 modules from `@/assets/...`.

### Where each logo appears

**Bombay Shaving Company logo**
- **Splash (Screen 1)**: Large centered BSC stacked wordmark (max-width ~280px) replacing the "BSC" text placeholder, sitting above the headline. Rendered in white (inverted).
- **Persistent top-left**: Small BSC wordmark (~28px tall) in the header on every screen after the splash, replacing the text wordmark.

**Prentix logo (visible throughout the simulation)**
- **Splash**: Top of screen — a slim header bar with "Powered by" muted micro-label + the Prentix logo (~22px tall, white) as a clickable-feeling pill, replacing the gold text-only "Powered by Prentix" pill.
- **Persistent top-right**: On every screen (primers, quizzes, results), a small "Powered by Prentix" cluster in the top-right of the header — muted micro-label + Prentix logo (~18–20px tall, white). This keeps Prentix visible throughout the entire flow as requested.
- **Footer strip**: A thin, low-contrast footer on every screen with "An internship experience by" + Prentix logo (~16px), centered, muted opacity ~60%. Reinforces brand presence without competing with content.
- **Results screen**: Prentix logo (~24px) above the "Proceed to Internship" CTA with micro-text "Your progress is tracked by Prentix" — gives the moment a branded sign-off.

### Header layout (persistent across all post-splash screens)

```text
┌─────────────────────────────────────────────────────────────┐
│  [BSC logo]      Primer 2 of 3 · Newsvendor    Powered by   │
│                                                  [Prentix]  │
└─────────────────────────────────────────────────────────────┘
```

- Height ~64px, border-bottom `#2A2A2A`, background `#0A0A0A` with subtle blur on scroll.
- Mobile: BSC left, Prentix right, breadcrumb/step text moves to a second row below.

### Footer (persistent)

```text
┌─────────────────────────────────────────────────────────────┐
│            An internship experience by  [Prentix]            │
└─────────────────────────────────────────────────────────────┘
```

- 48px tall, muted text `#888`, logo at ~60% opacity, hairline top border.

## Everything else unchanged

All previously approved screens, copy, formulas, quizzes, scoring, transitions, Z-table panel, color palette, typography, and motion remain exactly as planned:

1. Splash + name capture
2. Primers Overview (3 cards, lock/complete states)
3. Primer 1 — Marketing Elasticity + 2-question quiz
4. Primer 2 — Newsvendor Analysis + 1-question quiz (with collapsible Z-table)
5. Primer 3 — Channel Strategy + 1-question quiz
6. Results screen — animated gold ring, personalized message, pulsing "Proceed to Internship" CTA

## Technical notes

- Single TanStack route (`/`) driving an in-memory screen state machine for buttery 250ms fade/slide transitions.
- Logos imported via `@/assets/bsc-logo.png` and `@/assets/prentix-logo.png`, rendered through a small `<BrandMark />` component that handles the white-invert filter and sizing variants (`sm` / `md` / `lg`).
- Persistent `<AppHeader />` and `<AppFooter />` mounted in the page shell, hidden only on the splash screen (which has its own hero treatment of both logos).
- Floating Z-table button bottom-right stays clear of the footer on all viewports.
