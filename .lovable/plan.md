
# Cell Layout & Data Model Fixes

Apply 7 targeted fixes to the simulation cell, the data model, and label copy. No other parts of the app change.

## 1. Month 1 inventory pre-fill (hardcoded)

In `src/lib/simulation.ts`:
- Add a new constant `MONTH_1_DEFAULTS.inventory` matching the spec values (same as the existing `MONTH_0.inventory` arrays — these are the on-hand stock the student starts with).
- Replace the existing `MONTH_1_CARRIED` with `MONTH_1_DEFAULTS.inventory`. The student now sees the full 310/590/680… numbers (not 20/0/0…) pre-filled in Month 1 inventory inputs.
- `carriedForMonth(1, …)` returns `MONTH_1_DEFAULTS.inventory`.
- Month-1 marketing pre-fill already comes from `MONTH_0.marketing` — no change needed (matches spec exactly).

## 2. Carry-forward from Month 2 onwards

`carriedFromMonth(prev) = max(0, submittedInventory − actualSales)` is already correct in the engine. Confirmed kept as-is. The budget delta is already computed against `carried` via `additionalInventoryExpense` — also correct after Fix 1.

## 3. Remove the "Carried (QC/D2C)" display rows

In `src/components/screens/sim/sim-cell.tsx`, drop the two `LockedRow` lines that render `Carried (QC)` and `Carried (D2C)` from `ChannelBlock`. The pre-filled inventory input itself communicates carried stock.

## 4. Cell field order, exact labels, and bottom stat row

In `sim-cell.tsx`, render in this order per channel block:

```text
PREV MONTH SALES (QC)        [locked, right-aligned]
INVENTORY (QC)               [editable]

PREV MONTH SALES (D2C)       [locked, right-aligned]
INVENTORY (D2C)              [editable]
─────────────
MARKETING ELASTICITY (QC)    [locked, color-coded with dot]
MARKETING BUDGET (QC)        [editable, ₹ prefix]

MARKETING ELASTICITY (D2C)   [locked, color-coded with dot]
MARKETING BUDGET (D2C)       [editable, ₹ prefix]
─────────────
Unit cost ₹X    Holding /unit ₹Y    SP /unit ₹Z
```

Update the bottom stat row to a single 3-column line including `SP /unit` (currently only 2 columns — Unit cost and Holding /unit). Wire `sellingPriceFor(cell)` for the SP value.

## 5. Hyderabad Razor sourcing UI (Cell 1)

Rewrite `src/components/screens/sim/sourcing-selector.tsx`:
- Compute `additionalUnits = totalInventory − carried` (already a prop).
- If `additionalUnits > 0`: render the headline `You want to order N new units this month.` + `Where are you ordering the additional units from?` + two pill toggles labeled `Nearby supplier ₹160 · 1 week` and `Faraway supplier ₹140 · 3 weeks`. Submit-blocking validation already exists in `simulation-month.tsx` (kept).
- If `additionalUnits ≤ 0`: hide selector entirely (no return-recovery message — spec says nothing rendered when not ordering).
- Update the timing copy from "2 weeks / 1 month" → "1 week / 3 weeks".

## 6. Marketing Elasticity color coding

Already implemented in `ElasticityMarketing` with the correct thresholds (>1.1 green, 0.8–1.1 amber, <0.8 red) and a colored dot. Only the **label** needs to change in Fix 7. No threshold changes.

## 7. Label sweep across all months/screens

Search and replace the following label strings everywhere they appear (sim cells, budget bar, feedback cards, tooltips):
- `Prev sales (QC)` / `Prev Sales (QC)` → `Prev Month Sales (QC)`
- `Prev sales (D2C)` / `Prev Sales (D2C)` → `Prev Month Sales (D2C)`
- `Elasticity (QC)` / `Elasticity QC` → `Marketing Elasticity (QC)`
- `Elasticity (D2C)` / `Elasticity D2C` → `Marketing Elasticity (D2C)`
- `Marketing (QC)` → `Marketing Budget (QC)`
- `Marketing (D2C)` → `Marketing Budget (D2C)`

Primary surfaces touched: `sim-cell.tsx` (field labels), and a grep across `src/` to catch any lingering instances in `budget-bar.tsx`, `month-feedback.tsx`, and `simulation.ts` feedback strings (most feedback bodies already use full sku/city/channel names so should be unaffected, but the sweep guarantees consistency).

## Files edited

- `src/lib/simulation.ts` — replace `MONTH_1_CARRIED` with `MONTH_1_DEFAULTS.inventory` semantics; `carriedForMonth(1)` returns the new defaults.
- `src/components/screens/sim/sim-cell.tsx` — remove carried rows, reorder fields, update labels, add SP /unit to bottom row.
- `src/components/screens/sim/sourcing-selector.tsx` — new copy, conditional render based on `additionalUnits > 0`, updated timing strings.
- Anywhere else the old labels appear (label sweep).

## Out of scope (untouched)

Budget bar logic, feedback engine rules, email dropdowns, sticky headers, Z-table, back navigation, design system, color tokens, animations.
