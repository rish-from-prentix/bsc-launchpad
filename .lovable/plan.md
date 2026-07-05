## Goal

Add a new virtual internship module, **"Digitising Healthcare — Business Analyst"** (CareFirst × PulseTech), as a fully additive, isolated route alongside the existing BSC, AIC×ISB, and Meridian Architecture modules. UI/screens only — no scoring, no backend, no LLM, no persistence. React state only.

## Isolation rules

- Do not modify any file under `src/components/screens/**`, `src/components/aic-isb/**`, `src/components/architecture/**`, or their routes.
- All new code lives under `src/components/carefirst/**` and `src/routes/simulations.carefirst.tsx`.
- Reuse existing patterns by **re-implementing** their visual shell inside `carefirst/` (email card modelled on `inbox-email.tsx`, primer overview modelled on `primers-overview.tsx`, step-bar shell, locked/editable input styling, feedback card, results shell). Shared design tokens from `styles.css` are used as-is (no redefinition).
- Only one shared file is edited: `src/components/landing/simulations-section.tsx`, to add a fourth carousel entry linking to `/simulations/carefirst`. This is additive (one array entry) and does not restyle existing cards.

## New route

- `src/routes/simulations.carefirst.tsx` — `createFileRoute("/simulations/carefirst")`, head metadata ("CareFirst × PulseTech Virtual Internship, Powered by Prentix"), wraps content in `AppShell` (same shell BSC uses) with its own local screen state machine.

## Screen state machine (local `useState`)

```
splash → overview → task-0 → task-1 → task-2 → task-3…task-14 (locked scaffold)
```

- `name: string`
- `currentTask: number` (0–14)
- `submitted: Set<number>` — a task is "complete" once its Submit button is clicked; next task unlocks.
- Task 3–14 render a placeholder "Coming next" locked card, matching BSC's staged approach.

## Files to add

1. **`src/components/carefirst/splash.tsx`** — Screen 1. Gold "Powered by Prentix" pill, "CareFirst × PulseTech" wordmark, headline/subhead, body copy, video placeholder card ("Welcome message from Ritu Sharma, VP Operations — CareFirst Hospitals" — non-functional play button, same visual shell as BSC splash video card), name input, "Begin Internship →" CTA, "~2–3 hours across 15 tasks, self-paced" subtext.

2. **`src/components/carefirst/overview.tsx`** — Screen 2. Stat row "15 Tasks · 4 Shareable Deliverables · 1 Certificate". Numbered rows 00–14 with titles from the brief, status pill Locked / Start / Completed based on `submitted` set + `currentTask`. Bottom CTA "Start Task N →". Modelled on `primers-overview.tsx` layout but as a scrollable numbered list instead of 3 cards.

3. **`src/components/carefirst/task-shell.tsx`** — Shared layout for all task screens: breadcrumb "Tasks / [Task Name]", max-width 680px single column, back-to-overview link, Submit button + post-submit confirmation state ("Task Submitted" checkmark, "Nice work — Task N complete", "Continue to Task N+1 →"). Handles Shareable-Deliverable pill + "Share to LinkedIn" ghost button when `shareable` prop is true (tasks 2, 6, 8, 12).

4. **`src/components/carefirst/email-card.tsx`** — Sender email card component. Circular initials avatar, sender name, subject line, body. Visual shell derived from BSC/AIC email pattern, re-implemented locally (does not import `inbox-email.tsx`). Supports optional "no subject" mode for Task 0 welcome message.

5. **`src/components/carefirst/teaching-block.tsx`** — Dark card with gold left-border, gold small-caps title, body copy, optional nested worked-example card.

6. **`src/components/carefirst/attached-data.tsx`** — Renders attached data blocks: monospace filename cards for CSVs, quoted transcript blocks, bulleted reference-doc cards, plain stat lists.

7. **`src/components/carefirst/inputs.tsx`** — Deliverable input primitives, all with locked-vs-editable styling matching project tokens:
   - `Textarea` (writeup)
   - `EditableTable` (columns configurable — for Task 1 Stakeholder Map: Stakeholder / Influence / Interest)
   - `StepBuilder` (Task 2 flowchart: ordered rows, add / reorder up-down / edit / delete, connected by a downward chevron/arrow between rows)
   - `UploadPlaceholder` (Tasks 6, 12 — drag-and-drop styled card, non-functional)
   All lock (muted `#888`, no border, no focus) once the task is submitted.

8. **`src/components/carefirst/tasks-data.ts`** — Static task metadata array (id 0–14, title, `shareable` flag for 2/6/8/12).

9. **`src/components/carefirst/task-00-onboarding.tsx`** — Sender Ritu Sharma, no subject. Body per brief. Teaching block defining OPD / IPD / TAT. Pull-quote card ("A Business Analyst looks at how things currently work…"). No deliverable. CTA "Continue →" (marks task submitted).

10. **`src/components/carefirst/task-01-problem-framing.tsx`** — Sender Ritu Sharma, subject "Need your help, patient wait times are becoming a real issue." Body per brief. Attached data: current 51 min, six months ago 28 min, wait-time definition, org-chart snippet (Reception, Nurses, Doctors, Lab techs, IT/App team, Hospital Administrator, Patients). Teaching block with 4-line problem-statement formula + stakeholder-map definition + nested cafeteria-queue worked example. Deliverables: Problem Statement textarea, Success Metrics textarea, Stakeholder Map editable table.

11. **`src/components/carefirst/task-02-journey-map.tsx`** — Sender Ritu Sharma, subject "Good start, now let's actually see the journey." Attached data: Scenario A fully worked (booking → … → report sent) as reference; Scenario B raw paragraph (ambulance → triage → ER → X-ray → fracture → 40-min housekeeping wait → ward → 3 days rounds/nursing/day-2 physio → discharge cleared → 90-min billing → summary printed → leaves with follow-up). Deliverable: StepBuilder for Scenario B. Shareable pill + LinkedIn caption ("Mapped a real ER patient journey end-to-end…").

12. **`src/components/carefirst/task-locked.tsx`** — Placeholder screen for tasks 3–14 rendered when `currentTask >= n` but body not built: "This task will be built in the next prompt." + back-to-overview.

## Shared file edit (only one)

- **`src/components/landing/simulations-section.tsx`** — append a fourth entry to the `SIMS` array:
  - `key: "carefirst"`, logo: local `CarefirstLogo` mark (small "C+" mark or gold-bordered "CF"), `company: "CareFirst × PulseTech"`, `role: "Healthcare Business Analyst Intern"`, `to: "/simulations/carefirst"`. No changes to layout or existing entries.

## Explicit non-goals (this prompt)

- No scoring, rubric comparison, or AI grading.
- No backend, database, or persistence — state resets on refresh.
- No certificate / final results screen (follow-up prompt).
- No Product Manager or Digital Transformation Consultant tracks.
- Tasks 3–14 are locked list entries + placeholder screen only.
- Zero edits to BSC, AIC×ISB, or Architecture code/state.

## Technical notes

- Route follows TanStack file-based routing (`simulations.carefirst.tsx` → `/simulations/carefirst`).
- Uses `AppShell` for the outer chrome (same as BSC/AIC), passing a `contextLabel` per screen.
- All colors, fonts, radius, and transitions inherited from `src/styles.css` tokens — no new tokens introduced.
- Sequential unlock enforced in the overview + task shell (clicking a locked row is a no-op; clicking Submit adds `currentTask` to `submitted` and advances).
