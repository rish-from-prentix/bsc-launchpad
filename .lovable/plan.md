# Task 2 — Accelerator Cohort Evaluation

Build the next step of the AIC × ISB simulation: after the student submits their Task 1 thesis, they receive a congratulatory email and evaluate 8 startups (filtered by their selected sector), shortlist 2, and get a board verdict.

## Scope

Frontend-only. Reuses existing dark/cyan theme tokens (`glass`, `btn-primary-glow`, `--primary`, `--bg-*`). No backend, no new packages.

## Files

- **New** `src/components/aic-isb/startups-data.ts` — typed dataset for all 24 startups across the 3 themes (AI & SaaS, ClimateTech, HealthTech), with `boardScore`, strengths, weaknesses, metrics, plus per-theme `bestIds` / `weakIds` for verdict logic.
- **New** `src/components/aic-isb/task-two.tsx` — the full Task 2 experience with 3 internal phases:
  1. `email` — Animesh's "Next Evaluation Task" mail (reuses `EventEmail`-style card pattern from `src/components/screens/sim/event-email.tsx`) with the exact subject/body from the brief, `{{student_name}}` and `{{selected_theme}}` interpolated. CTA: **Start Startup Evaluation**.
  2. `dashboard` — heading, subheading, instruction box, then 8 startup cards (in a single column, ~`max-w-4xl`) for the chosen sector. Each card shows: name, tagline, founders, stage, funding, MRR, growth, customers, market size, burn, runway, strengths, risks, competitor landscape, accelerator goal. Each card has a 1–10 rating slider (native `<input type="range">` styled), an "Evaluation reason" textarea, and an "Add to shortlist" toggle button (cyan glow when active). Submit is disabled until every startup has a rating + reason and exactly **2** are shortlisted.
  3. `loading` → `result` — "Board reviewing your recommendations…" with a 1.5s spinner, then the verdict screen.
- **Edit** `src/components/aic-isb/task-one.tsx` — on submit, persist `selectedSector` (already in localStorage) and call `onComplete`. No UI changes besides ensuring the sector id is exposed to the parent (pass it through `onComplete(sector)`).
- **Edit** `src/routes/simulations.aic-isb.tsx` — after Task 1 completes, capture the sector and render `<AicIsbTaskTwo candidateName sector onComplete />`. Bump progress bar to Task 2 active when Task 1 done, Task 2 done when student finishes evaluation.

## Verdict logic (in task-two.tsx)

After submit, compute per the brief:
- For each shortlisted startup: classify as **strong** (in `bestIds`), **weak** (in `weakIds`), or **neutral**. Show the matching board comment (positive validation / warning / neutral note) verbatim from the spec.
- For each non-shortlisted strong startup the student rated low (< 7): show "investment committee identified stronger long-term defensibility…".
- For each weak startup the student rated high (> 7): show "you may have overweighted short-term traction…".
- Compute **Evaluation Accuracy %**: `1 - mean(|studentRating - boardScore|) / 10`, rounded.
- Render: heading "Evaluation Approved" (or "Evaluation Noted" if any weak in shortlist), summary message, the 2 selected startup cards with their score + board comment, accuracy %, 3 analyst skill badges (Investment Judgment, Scalability Read, Risk Analysis), and a **Continue Simulation** CTA that calls `onComplete`.

## Design notes

Use the existing cyan glass aesthetic — `glass` cards, cyan accent borders on selected/shortlisted state, `btn-primary-glow` for primary CTAs, muted blue-gray for secondary text. Strengths render with a green dot, risks with a soft red dot, neutral metrics in a 2-col grid. Rating slider track uses cyan gradient fill proportional to value. Loading uses a subtle pulsing cyan orb. No layout/typography changes to existing components.

## Out of scope

- Persisting Task 2 answers across reload (Task 1 already does this; Task 2 will be session-only to keep scope tight).
- Task 3+ (CTA at the end just calls `onComplete`; Task 3 remains locked).
- Backend / database.
