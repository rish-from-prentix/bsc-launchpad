## What gets built

### 1. Home page: 3rd internship card
Add a third `SimulationCard` to `src/components/landing/simulations-section.tsx`.

- Company: Meridian Architecture Studio
- Role: Architecture Internship — Community Learning Hub
- Tags: Advanced Level, Certificate Included (replace the default Intermediate tag for this card by accepting a `tags` prop on `SimulationCard`, defaulting to current behavior so the other two cards stay unchanged)
- Links to `/simulations/architecture`
- Logo: minimal serif "M" mark in a div (no asset download needed) so we don't introduce a new brand

### 2. New route `/simulations/architecture`
`src/routes/simulations.architecture.tsx`, modeled on `simulations.aic-isb.tsx`:

- Shows an intro/name-capture screen first (reuses the AIC visual treatment so the palette stays identical, just relabeled "Architecture Internship · Community Learning Hub"). On submit it stores `name` and renders the task shell.
- After name is entered, render `ArchProgressBar` at the top plus the current task body. Task progression mirrors AIC's `currentPhase` / `maxReached` / `advance(n)` pattern, but with 11 phases instead of 5.

### 3. Top progress bar (11 tasks, week-aware)
New `src/components/architecture/progress-bar.tsx`:

- Sticky top bar reusing AIC styling tokens: `bg-background/85`, `border-border`, `text-primary` (the AIC oklch warm gold), same typography scale.
- Left: "Welcome, {firstName}", "Week X · Task Y of 11", Previous button.
- Right: percent complete, mono font.
- A single continuous progress bar fill (no 11 cramped pills), plus small caption "Phase {n}: {title}" beneath it. No per-step chip row.

### 4. Eleven task components
`src/components/architecture/` directory with shared primitives:

- `shared.tsx` — `TaskShell`, `TaskHeader` (Week / Task / Title / Deliverable), `VoiceNote` (avatar bubble + transcript card), `DataCard` (the dotted "📍 Site Data" briefs), `SectionHeader`, `Checklist`, `MentorPrinciple` callout, `SubmitBar`. All use AIC tokens (`bg-card`, `border-border`, `text-primary`, etc.). No new color palette.
- `arch-data.ts` — all static copy ported from the HTML (brief text, personas, site data, area programme rows, cost rows, sustainability options, MEP conflicts, RFI questions, defect register, crisis scenarios).
- `task-01-brief.tsx` through `task-11-crisis.tsx` — one file per task, each rendering its own UI:

  1. **Client Brief Analysis** — brief decoding matrix (4 free-text rows: must-have, nice-to-have, budget risks, unknowns) + mentor checklist. Submit goes through AI scoring.
  2. **Site Analysis** — 5-layer table with one design-implication textarea per row + 3–5 key findings textarea. AI-scored.
  3. **Space Programming** — area programme table with numeric inputs + auto-calculated total + adjacency justification textarea. Validates total falls in 12,000–15,000 sq.ft.
  4. **Concept Direction** — 4 concept option cards (A/B/C/D) with selection state + revealed risk panel + 50-word concept statement. AI-scored on the statement.
  5. **Schematic Floor Plan** — design-checks table with status selects + annotation checklist. Auto-validates that nothing is left at "Not addressed".
  6. **Elemental Cost Plan** — 9-row cost table (rate, area, subtotal inputs) with live total, variance vs ₹8.1cr, and 150-word reconciliation note.
  7. **Sustainability Coordination** — 6 intervention rows, must select exactly 3, each with rationale input, plus 100-word justification.
  8. **MEP Coordination** — 3 multiple-choice conflicts (correct answers built in: 1=C, 2=B, 3=A). Per-question feedback similar to AIC Task 4 (green border on correct, red on wrong, "Continue" gated on all-correct or at least all-answered).
  9. **Site Review RFI** — 2 multiple-choice questions under "24hr Deadline" header (correct: Q1=B, Q2=C), same feedback pattern.
  10. **Pre-Construction Audit** — Nashik POE table (read-only) + 6 defect register cards. Each card: finding textarea + Clear / Minor / Critical buttons. Live audit score. 150-word mentor note. Submit blocked until all 6 reviewed.
  11. **Crisis Management** — random scenario assignment button (4 scenarios A–D), then 4-section memo form (issue summary, proposed modification, design impact, implementation timeline). AI-scored on the memo. Completion screen.

- Long-form submissions in tasks 1, 2, 4, 7, 11 hit AI scoring via a new server fn `src/lib/score-architecture-task.functions.ts` using Lovable AI Gateway (`google/gemini-3-flash-preview`). Returns `{ overall: 0–10, feedback: string, criteria: { rigor, evidence, clarity } }`. Pass threshold 6. Fail → "Try again" with feedback. Pass → unlock next task. Same loading/error UX as the existing AIC `score-thesis` flow.
- Other tasks (3, 5, 6, 8, 9, 10) auto-advance once their structural validations pass (totals in range, all MCQs answered, all defects reviewed).

### 5. No em dashes anywhere
All ported copy from the HTML currently uses `—`. While porting into `arch-data.ts` and component JSX, replace every `—` with either `:`, `,`, or a sentence break (whichever reads best). A grep pass over the new architecture files at the end confirms zero `—` characters.

### 6. Style rules
- Reuse AIC tokens only: `bg-background`, `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `text-primary` (the oklch warm gold), `bg-primary` for buttons.
- No new fonts, no IBM Plex Mono / Playfair Display from the source HTML, no `#c8a96e` gold from the source HTML.
- Same rounded corners, shadows, and spacing rhythm as the AIC task components.

## Technical notes
- Route registration is automatic via the file-based router; no edits to `routeTree.gen.ts`.
- `SimulationCard` extended with optional `tags?: Tag[]` so the Architecture card can pass `[{icon: TrendingUp, label: "Advanced Level"}, {icon: Award, label: "Certificate Included"}]` without affecting the BSC and AIC cards.
- AI scoring server fn pattern mirrors `src/lib/score-thesis.functions.ts` (already in repo), reading `process.env.LOVABLE_API_KEY` inside `.handler()`, structured tool-call output via Zod, handles 429/402.
- `getFirstName` from `src/lib/utils.ts` reused.
- The architecture intro screen reuses the AIC `AicIsbIntroScreen` visual structure (rename and re-skin label/heading); no Meridian-specific dark gold palette.

## Files
- `src/components/landing/simulation-card.tsx` (extend with optional `tags` prop)
- `src/components/landing/simulations-section.tsx` (add 3rd card)
- `src/routes/simulations.architecture.tsx` (new)
- `src/components/architecture/intro-screen.tsx` (new)
- `src/components/architecture/progress-bar.tsx` (new)
- `src/components/architecture/shared.tsx` (new)
- `src/components/architecture/arch-data.ts` (new)
- `src/components/architecture/task-01-brief.tsx` ... `task-11-crisis.tsx` (11 new files)
- `src/lib/score-architecture-task.functions.ts` (new AI scoring server fn)
