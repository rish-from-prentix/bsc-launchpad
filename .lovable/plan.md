## Phase 4 rebuild — "Go save your startups now"

Phase 4 is being completely re-scoped. Today it shows 9 startups with free-text RCA forms. The new version is a single guided **5-step root-cause investigation** for one CEO case, picked from the student's selected sector. All current Phase 4 UI (free-text fields, draft saving, multi-startup blocks, sparklines, voices, founder quotes) is removed.

The 3 CEO cases map to the existing sector IDs:
- `ai` → NeuroPilot AI (Aarav Mehta)
- `climate` → GreenLoop Energy (Rhea Kapoor)
- `health` → MediSync Health (Dr. Kavya Sharma)

`shortlistedIds` is no longer used inside Phase 4 (kept in the route signature so Phase 5 still works).

---

### Screens

**Screen 1 — Intro**
- Large heading: "Go save your startups now"
- Subheadline: "Real startup crises. Structured problem solving. Find the root cause before the company collapses."
- Single CTA: "Open the CEO's email →"

**Screen 2 — Email client view (sector-specific)**
- Realistic email-client chrome (not the existing `InboxEmail` inbox row):
  - Header row with **From / To / Subject** fields and a timestamp ("Today · 09:42 AM")
  - From: the CEO's name + role + company; To: "You · Program Manager Intern, AIC × ISB"
  - Subject line per case (exact strings from spec)
  - Email body rendered as a real message (paragraphs, signed by the CEO)
- Below the email card: a **yellow sticky-note panel** titled "How to approach this" with 4 plain-English bullets (per spec).
- CTA button: "Start your investigation →"

**Screen 3 — Investigation (5 steps)**
- Sticky top: thin progress bar + "Step N of 5" indicator.
- Two-column layout (60/40 on desktop, stacked on mobile):
  - **Left (main):** step heading, 1–2 sentence context, then 4 option cards in a 2×2 grid. Each card shows option title + short description. Click selects.
  - **Right (sticky sidebar):**
    - "Your investigation so far" — running log of prior steps with a check/X/tilde icon and the chosen option (greyed).
    - "At this step, think about…" tip box, content changes per step.
- After selection, feedback appears inline below the grid (no navigation):
  - Correct → green left border + checkmark
  - Wrong → red left border + X + redirect hint
  - Partial → amber left border + tilde
  - Feedback text is 2–3 sentences from the data.
- "Continue →" button appears after feedback. On step 5 it becomes "See results →".

**Screen 4 — Results & debrief**
- Score: `X / 5` (1 / 0.5 / 0 per step) + percentage, color-coded (green ≥80%, amber 50–79%, red <50%).
- Heading: "Here's what you found" if ≥60%, else "Here's where you went off track".
- 5 step icons in a row (✓ / ~ / ✗).
- "What actually happened" — short 3–4 sentence narrative per case (hardcoded per startup).
- "Your path vs the right path" — 2-column table for all 5 steps.
- "Key takeaway" callout — 1 case-specific business lesson (hardcoded per startup).
- Buttons: "Review this case →" (scrolls back through steps with correct answer highlighted) and a primary "Continue to Phase 5 →" that calls `onComplete()`.
  - Note: spec says "Try a different startup" — but the sector is fixed by Phase 1, so I'm replacing it with the review action + continue. Flag if you'd prefer to let students replay other sector cases here.

---

### Data model (new file `src/components/aic-isb/rca-investigation-data.ts`)

```ts
type Outcome = "correct" | "wrong" | "partial";
type Option = { id: "A"|"B"|"C"|"D"; title: string; description: string;
                outcome: Outcome; feedback: string; hint?: string };
type Step = { title: string; context: string; tip: string; options: Option[] };
type InvestigationCase = {
  ceo: { name: string; role: string; initials: string; company: string };
  email: { subject: string; body: string; timestamp: string };
  steps: [Step, Step, Step, Step, Step];
  narrative: string;     // "what actually happened"
  takeaway: string;
};
export const INVESTIGATIONS: Record<ThemeId, InvestigationCase> = { ai: …, climate: …, health: … };
```

All option text, feedback, hints, emails, narratives, and takeaways come verbatim from the user's spec.

Scoring: `correct = 1`, `partial = 0.5`, `wrong = 0`.

---

### Files touched

- **New:** `src/components/aic-isb/rca-investigation-data.ts` — the three full cases hardcoded.
- **Rewrite:** `src/components/aic-isb/task-four.tsx` — replace with screens above (intro → email → investigation → results). Drop dependencies on `getRcaCase`, `rca-data.ts`, draft persistence, and the old `Answer` shape.
- **No changes** to `rca-data.ts` (still used by Phase 5 / memo? — verify; if unused project-wide after this change I'll leave it untouched to keep blast radius small).
- **No changes** to the route file `src/routes/simulations.aic-isb.tsx` — `AicIsbTaskFour` keeps the same props (`candidateName`, `sector`, `shortlistedIds`, `onComplete`).

---

### Design notes

- Reuse existing `glass`, `btn-primary-glow`, `softPulse`, `fadeSlide` tokens.
- Sticky-note: warm yellow (`oklch(0.92 0.13 95)` background tint, `oklch(0.78 0.13 70)` border) with a small folded-corner accent.
- Option cards: bordered, hover lift, selected state uses primary ring; after submission all 4 cards lock and the chosen one gets the outcome color.
- Mobile: sidebar collapses below the question; sticky progress bar stays at top.

Ready to implement on approval.