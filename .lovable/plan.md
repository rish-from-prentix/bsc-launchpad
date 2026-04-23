
# Prompt 2 — Internship Simulation, Feedback & Final Results

Builds the entire post-quiz experience: task intro → 5 monthly simulation rounds (table + budget bar + reasoning + event emails) → per-month feedback screens → final EBITDA + LinkedIn share. Same dark/gold design system, persistent BSC + Prentix header, Inter / JetBrains Mono, 250ms ease-out transitions.

## New screens

1. **Task Introduction (`task-intro.tsx`)** — Headline + body, gold-bordered email card from Shantanu (avatar "SD" in gold, sender, subject, verbatim body with `[Name]` interpolated), gold small-caps "What you can do each month" bullet list, centered "Begin Month 1 →" CTA.

2. **Simulation Month (`simulation-month.tsx`)** — Reused for Months 1–5. Renders:
   - Top: gold small-caps month label (`Month n of 5`) + muted context label.
   - Optional event email panel (collapsible, expanded by default) — same card style as Shantanu email.
   - 4×4 sticky-header grid (cities across the top in gold; SKUs down the side with price under in muted text). 9 cells, each a `#1C1C1C` card with: editable QC/D2C inventory inputs, locked prev-month sales, editable ₹ marketing inputs, locked elasticity (2 dp) + unit cost + holding cost. Cell 1 (Hyd Razor) gets an extra Nearby/Far sourcing pill selector with `Units from nearby` / `Units from far` inputs and inline red error if they don't sum to `iq[1]+id[1]`.
   - Full-width "Your reasoning" textarea below the table.
   - Fixed bottom budget bar (72px, `#141414`, top border): Monthly Budget · Additional Inventory (live, red+/green−) · Marketing (live sum) · Budget Remaining (large, green/red, with "Over budget" warning) · Reset (ghost) · Submit Month n (gold, disabled when remaining<0 or sourcing invalid).
   - On submit: lock all fields with grayed wash + small lock icon, run sales/profit engine, route to feedback.

3. **Month Feedback (`month-feedback.tsx`)** — Centered, max-w-680. Header "Month n Results" gold small-caps, large profit number, cumulative EBITDA in muted. Stack of feedback cards (dark with colored left border: gold/amber/red, icon + headline + one-line body), animating in with 100ms stagger via `fadeSlide`. Buttons: "Review this month" (returns to locked simulation view) and "Begin Month n+1 →" (gold).

4. **Final Results (`final-results.tsx`)** — Animated count-up of cumulative EBITDA, total profit + average MoM growth in muted, personalized headline by tercile, LinkedIn-style preview card (white card, avatar placeholder, name, BSC + Prentix logos, verbatim post body), "Copy LinkedIn Post" (clipboard) and "Share on LinkedIn →" (opens `linkedin.com/sharing/share-offsite/?url=…&summary=…`) buttons, Prentix logo + micro caption.

## Engine (`src/lib/simulation.ts`)

Pure-function module exporting all constants from the spec (`QC_COMMISSION_RATE`, `RETURN_PENALTY`, `UNIT_COST`, `SELLING_PRICE`, `HOLDING_COST`, `CITY_GROWTH`, `SEASONAL_FACTOR`, `MONTHLY_BUDGET`, `BASE_ELASTICITY`, `MONTH_0`, `CELL_META`) and computation helpers:
- `unitCostFor(cell, sourcingSplit)` — handles cell 1 weighted average ₹160/₹140; falls back to flat `UNIT_COST` for others.
- `computeElasticity(prevMonth, baseMonth0)` — applies the up/down/equal rules; Month 1 returns `BASE_ELASTICITY`.
- `computeMonth(monthNumber, submission, prevMonth, elasticity)` — projected demand, actual sales (= min of demand & inventory), per-cell profit (revenue − QC commission − COGS − holding − marketing), total profit, cumulative EBITDA.
- `additionalInventoryExpense(currentInputs, prevInventory, sourcing)` — live recompute incl. return penalty (₹30/unit when reducing).
- `evaluateFeedback(monthNumber, currentMonthResult, prevMonth)` — returns ordered list of `{tone, icon, title, body}` cards. Implements all 9 rules (low-elasticity overspend, stockout ≥95%, excess >3×, missed/smart high-elasticity, Month-3 Hyd Beard sub-rules A/B/C, Month-3/-1/-2/-5 Hyd Razor sourcing, Month-4 Bombay Razor levers, Blr Beard D2C high-elasticity).

All engine functions are pure; React state holds an array `months[1..5]` of `{ inventory, marketing, elasticity, sales, projectedDemand, sourcing, reasoning, totalProfit, locked }`.

## State + routing changes

`src/routes/index.tsx` extends the `Screen` union with `task-intro`, `sim-1..sim-5`, `feedback-1..feedback-5`, `final`. Adds top-level state:

```ts
const [sim, setSim] = useState<SimState>({ months: [/* index 0 = MONTH_0 */] });
const [reviewing, setReviewing] = useState<number | null>(null);
```

Wires `ResultsScreen` `onProceed` → `task-intro`. Each simulation submit advances to its feedback screen; "Begin next" advances to next sim screen with inputs pre-filled from the previous submission. Month 1 inputs pre-fill from `MONTH_0`. Reset restores current-month inputs to previous month values.

## Styling additions (`src/styles.css`)

- Add `staggerIn` keyframe (slide-up + fade) used by feedback cards with inline `animation-delay`.
- Add `.locked-field` utility (background tint, no border, cursor:default, lock icon overlay via `::after` is handled in the cell component using a small `Lock` lucide icon).
- Add `.budget-bar` shadow + border-top utility for the fixed bottom strip.
- No new color tokens needed — `success`, `warning`, `danger`, `gold` already defined.

## New files

```
src/lib/simulation.ts
src/components/screens/task-intro.tsx
src/components/screens/simulation-month.tsx
src/components/screens/sim/sim-cell.tsx          (single cell with all inputs)
src/components/screens/sim/sourcing-selector.tsx (cell 1 only)
src/components/screens/sim/budget-bar.tsx
src/components/screens/sim/event-email.tsx       (reused by task intro + monthly events)
src/components/screens/month-feedback.tsx
src/components/screens/final-results.tsx
```

## Edited files

- `src/routes/index.tsx` — extend screen state machine, mount new screens, pass simulation state.
- `src/components/screens/results-screen.tsx` — `onProceed` now navigates forward (no other visual change).
- `src/styles.css` — add `staggerIn` keyframe and small utilities.

## Behavior details locked in by the spec

- Live budget bar updates on every keystroke (no debounce).
- Submit disabled when `budgetRemaining < 0` OR cell-1 sourcing split is invalid.
- Inputs accept positive integers only; reductions are typed as a smaller number than prev (no negatives).
- Empty reasoning on submit shows a 3-second muted toast "Adding reasoning helps you reflect on your decisions." but does not block.
- All email bodies, feedback copy, and LinkedIn post text are rendered verbatim from the spec.
- Z-table floating button stays visible on simulation screens (helpful for inventory decisions); hidden on feedback/final.

## Out of scope (will follow in next prompt)

Mobile polish for the simulation grid, edge-case validation passes, certificate generation.
