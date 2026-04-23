

# Primer 2 + Primer 3 Content Rebuild & Month 1 Analytics Email

Three content-only changes. No design system, simulation logic, or screen-flow changes.

## 1. Primer 2 — Newsvendor Analysis (full rewrite)

Rewrite `src/components/screens/primer-newsvendor.tsx` body verbatim per spec, keeping the existing dark/gold visual system.

Sections in order:
- Headline: `Optimal Inventory Levels (Newsvendor Analysis)`
- Subheadline: `Now, this one is slightly complex. But if you grasp this well, your internship will be a cakewalk.`
- Pull-quote card (gold quote icon, larger font) — college fest stall paragraph verbatim.
- Two scenario cards (red "Too few" / amber "Too many") — new copy verbatim.
- Body: "This is exactly the problem BSC's supply chain team faces… 2 costs you're always balancing".
- FormulaCard 1: `Cost of Understocking (CU) = Selling Price − Cost to Make the Product` + ₹349/₹140/₹209 explanation block verbatim.
- FormulaCard 2: `Cost of Overstocking (CO) = Holding Cost per Unit (+ Discount Loss, if applicable)` + ₹30 example verbatim.
- SectionLabel: `THE CRITICAL RATIO: FINDING YOUR SWEET SPOT` + intro paragraph + `Critical Ratio = CU / (CU + CO)` formula card + `Using our Razor Kit example: 209 / (209 + 30) = 0.874`.
- Italic muted "How to read this" interpretation block verbatim.
- SectionLabel: `TURNING THE RATIO INTO AN ACTUAL NUMBER` + intro + 2 bullets (Expected Demand, Demand Uncertainty) + Z-table lookup intro + `Optimal Stock = Expected Demand + (Z-score × Demand Uncertainty)` formula card.
- Worked Example card titled `Razor Kit in Hyderabad` with 5-row INPUTS column (Selling Price ₹349 / Unit Cost ₹140 / Monthly Holding Cost ₹30 / Expected Demand 800 units / Std Deviation 150 units) and 5-step STEPS column (CU=₹209 → CO=₹30 → CR=0.874 → Z≈1.15 → Optimal=972 units), each verbatim.
- Closing paragraph: "So BSC's team would order approximately 972 Razor Kits…".
- Z-table access section — **remove the existing collapsible Z-table dropdown**. Replace with the verbatim block:
  > To look up the Z-score corresponding to your computed Critical Ratio during the simulation, use the Z-table button pinned to the bottom-right corner of every screen.
- Inline non-clickable replica of the floating Z-table button (gold pill, Σ icon, "Z-table" label) styled to match the live button — built in JSX, not a screenshot.
- Closing line: "Click it any time you need a Z-value. It will always be there."
- Nav buttons: `← Back` (ghost) and `Take the Quiz →` (gold).

Demand-uncertainty note removed from this primer (moves into the new Month 1 email — see §3).

## 2. Z-table floating panel — full table

Update `ROWS` in `src/components/z-table.tsx` to the complete 25-row table:

```
0.50→0.00  0.55→0.13  0.60→0.25  0.65→0.39  0.70→0.52
0.75→0.67  0.78→0.77  0.80→0.84  0.82→0.92  0.84→0.99
0.85→1.04  0.86→1.08  0.87→1.13  0.88→1.17  0.89→1.23
0.90→1.28  0.91→1.34  0.92→1.41  0.93→1.48  0.94→1.55
0.95→1.65  0.96→1.75  0.97→1.88  0.98→2.05  0.99→2.33
```

Style polish: alternating row backgrounds `#1C1C1C` / `#222222`, header in gold, JetBrains Mono throughout, no heavy borders. Panel becomes scrollable (max-height + overflow-y) so the longer table fits on screen.

## 3. Month 1 — Analytics Team email

In `src/components/screens/simulation-month.tsx`, render a **second** `EventEmail` directly under the Shantanu welcome email, only when `monthNumber === 1`. Default expanded, collapsible.

- Sender: `Analytics Team`
- Initials: `AT` (avatar uses muted teal tint — pass an optional `accent="teal"` prop to `EventEmail`, or wrap with a small style override; see Technical Notes)
- Subject: `Demand estimates for your reference`
- Body verbatim (the 6-paragraph note about 20% std-dev rule, ending with `Good luck! Analytics Team`), with `[Name]` substituted from `name`.

Body string lives in `src/lib/simulation.ts` as `ANALYTICS_TEAM_BODY` (sibling to `SHANTANU_WELCOME_BODY`) and is imported into the simulation screen.

## 4. Primer 3 — Channel Strategy (full rewrite)

Rewrite `src/components/screens/primer-channel.tsx` body verbatim per spec.

- Headline: `Channel Strategy`
- Subheadline: `Quick Commerce vs D2C. The eternal trade-off.`
- Body: `We sell through 2 key channels and it is important for you to understand the distinction:`
- Two comparison cards:
  - **Quick Commerce** (amber tint, lightning icon, subtitle `PLATFORMS LIKE ZEPTO AND BLINKIT`) with the verbatim paragraph about 20–30% commission, lower margins, higher volumes.
  - **D2C** (blue tint, globe icon, subtitle `OUR OWN BOMBAY SHAVING COMPANY WEBSITE`) with the verbatim paragraph about no intermediary, higher margins, marketing investment.
- Body line: `The core trade-off here is Margins vs Volume.`
- Comparison table (Factor / Quick Commerce / D2C — Margin / Volume / Control rows): alternating `#1C1C1C` / `#222222`, gold header, no heavy borders.
- Key insight block (full width, thin gold top line, white bold centered):
  > Key Insight: We use both channels. The goal is not to choose one, but to balance them to maximize total profit.
- Nav buttons: `← Back` and `Take the Quiz →`.

## Files edited

- `src/components/screens/primer-newsvendor.tsx` — full body rewrite, drop collapsible Z-table, add inline floating-button replica.
- `src/components/screens/primer-channel.tsx` — full body rewrite per spec.
- `src/components/z-table.tsx` — replace `ROWS` with 25-row table, add scroll, alt-row palette.
- `src/lib/simulation.ts` — add `ANALYTICS_TEAM_BODY` constant.
- `src/components/screens/simulation-month.tsx` — render second `EventEmail` for Month 1 only.
- `src/components/screens/sim/event-email.tsx` — add optional `accentClassName` prop on the avatar so the Analytics email can render in muted teal while Shantanu stays gold (default unchanged).

## Out of scope (untouched)

Simulation engine, budget bar, feedback engine, sticky headers, navigation, design tokens, animations, all other screens, Months 2–5 emails, the Z-table button position/behavior.

