# Platform Update Plan

A coordinated pass across the AIC × ISB internship experience covering copy, navigation, email UX, and the rating control.

## 1. Global terminology + copy

- Replace "Virtual Simulations" → "Virtual Internships" everywhere (landing nav, hero, section headings, footer, meta titles/descriptions).
- Remove the word "simulation/simulations" from user-facing UI (headings, buttons, labels, descriptions, route head meta). Internal route paths (`/simulations/aic-isb`) stay unchanged to avoid breaking links; only visible text changes.
- Rename "Program Manager Simulation" → "Program Manager Internship" (simulation card, intro screen, page titles).
- Remove the "4–5 hours" duration pill from the internship card and any other surface that shows it.
- Update certification block copy to:
  - "Learn & Get Certified"
  - "Gain Insights and earn a verified completion certificate"
- Replace "Task" → "Phase" across the whole platform: progress bar ("Task 1" → "Phase 1", `TASK_TITLES`), email subjects/bodies, CTA buttons ("Start Task" → "Start Phase"), results screens ("Task Completed" → "Phase Completed"), Continue Simulation → Continue Internship.

## 2. First-name only personalization

- Add a small helper (`getFirstName(fullName)`) that splits on whitespace and returns the first token.
- Apply it everywhere the candidate name is rendered: progress bar greeting, email salutations, dashboards, results, certificate HTML, mentor interaction copy, completion messages.
- Keep the full name captured at intro (for certificate metadata if needed) but render only the first name in greetings.

## 3. Inbox-style email experience

Today each phase opens directly into a full mail body. New flow:

- Introduce a reusable `<EmailInbox />` component used by every phase (Tasks 1–5).
- Initial state: collapsed unread card with sender avatar/initials, sender name, subject, preview text, timestamp, unread dot, soft glow.
- Click → smooth expand animation (height + fade) into full email: sender details, subject, timestamp, body, signature, CTA button (Start Phase / Continue Evaluation / Start Mentor Mapping / Start Root Cause Analysis / Start Investment Evaluation).
- After opening, unread dot disappears and card shows "Read" state.
- A side **Inbox history panel** lists all phase emails received so far; current phase email is pinned at top; previous ones collapse to "Read".
- Subtle notification ping animation when a new email appears on phase transition.
- Styling: dark premium glassmorphism consistent with current theme; Gmail/Linear-like transitions using Framer Motion (already in deps if available; otherwise CSS transitions).

## 4. Functional Previous button

- Lift phase navigation state into the page route (`simulations.aic-isb.tsx`) so we can move both forward and backward without losing data.
- Replace single `completed` counter with `{ currentPhase, maxReached, payloads }`:
  - `currentPhase` controls what renders.
  - `maxReached` tracks furthest phase unlocked.
  - `payloads` keeps each phase's submitted data (sector, ratings, shortlist, mentor assignments, RCA, memo) in state + localStorage so revisiting restores everything.
- Each task component accepts optional `initialValue` and emits incremental changes via an `onChange` (or we keep drafts via existing localStorage keys and just re-mount with restored state).
- Add a persistent top-nav "Previous" button (in `AicIsbProgressBar` or a thin sub-header):
  - Disabled on Phase 1 / intro.
  - On click: `currentPhase -= 1`, restores stored payload, smooth fade/slide transition.
- "Next/Continue" remains gated by completion of the active phase but, if `currentPhase < maxReached`, it just advances without re-submitting.
- Wrap phase content in a Framer Motion `AnimatePresence` for slide/fade transitions; no hard reloads.

## 5. Rating control: slider + numeric input

In `task-two.tsx` the per-startup rating row gets a synced dual control:

- Slider (range 1–10, step 0.1) on the left.
- Compact glassmorphism numeric input on the right showing `X.X / 10`.
- Bi-directional sync: slider change → input value; input typing → slider position.
- Validation: clamp to [1, 10]; reject non-numeric; show subtle red ring + helper text when out of range; allow one decimal.
- Visual: gold/yellow active track, soft glow pulse on change, smooth transitions.
- Ratings persist through Previous/Next via the lifted state (see §4) and existing draft storage.

## 6. Files to touch (technical)

- `src/routes/index.tsx`, `src/components/landing/*` — terminology, duration pill removal, certification copy.
- `src/routes/simulations.aic-isb.tsx` — phase state machine, Previous wiring, payload persistence, AnimatePresence wrapper, Task→Phase titles.
- `src/components/aic-isb/progress-bar.tsx` — "Phase N" labels, first-name greeting, Previous button slot.
- New `src/components/aic-isb/email-inbox.tsx` — collapsed/expanded email card + history panel.
- `src/components/aic-isb/task-one.tsx` … `task-five.tsx` — replace inline mail blocks with `<EmailInbox />`, accept `initialValue`, emit state for parent persistence, rename Task→Phase strings, first-name salutations.
- `src/components/aic-isb/task-two.tsx` — new dual slider+input rating component.
- `src/lib/utils.ts` (or new `src/lib/name.ts`) — `getFirstName` helper.
- Meta tags in route `head()` blocks — update titles/descriptions.

## 7. Out of scope

- No backend, schema, or auth changes.
- No route path renames (only visible copy).
- No redesign of phase-internal workspaces beyond the rating control and email entry point.
