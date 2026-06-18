## Goal

Show each phase's briefing email **only once** — in the new `EmailReader` at the route level, with the "Ready when you are / Start Phase N" CTA block we just added. Remove the duplicate `InboxEmail`/`EmailPhase` mail that currently appears again inside each task component.

## Changes

1. **Tasks 1–5 — drop the in-task email screen, jump straight to workspace**
   - `src/components/aic-isb/task-one.tsx` — remove the `EmailCard` render and the `phase === "loading" | "email"` gating; start in the sector-selection workspace state. Delete the now-unused `EmailCard`/`ReceivingState` helpers and the `handleBegin` flow.
   - `src/components/aic-isb/task-two.tsx` — remove `EmailPhase` and the initial `"email"` phase; render the evaluation workspace immediately.
   - `src/components/aic-isb/task-three.tsx` — same: drop `EmailPhase`, start at `"dashboard"`.
   - `src/components/aic-isb/task-four.tsx` — drop the `EmailScreen` step, start in the investigation workspace.
   - `src/components/aic-isb/task-five.tsx` — drop `EmailPhase`, start at workspace.
   - In each file: remove the `import { InboxEmail } from "./inbox-email"` line that becomes unused.

2. **Route — keep EmailReader as the single source of the brief**
   - `src/routes/simulations.aic-isb.tsx` stays as-is: auto-opens the current phase's email in `EmailReader`, "Start Phase N" CTA closes the reader and reveals the (now email-free) task workspace.
   - No layout/state changes here.

3. **Cleanup**
   - Leave `src/components/aic-isb/inbox-email.tsx` in place for now (small, unused after these edits) — safe to delete in a follow-up if nothing else imports it.

## Out of scope

- No changes to `EmailReader`, the inbox panel, the task navigator, the progress bar, or phase metadata.
- No changes to scoring, sector selection logic, or downstream task flows other than removing the email gating step.
