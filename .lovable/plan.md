## 1. Remove the duplicate "Previous" button in footers

The top progress bar already shows a "Previous" button. A second one exists in the Task 1 sticky footer (`src/components/aic-isb/task-one.tsx`, lines ~666–675 — disabled placeholder).

- Delete that disabled `Previous` button so only the top-nav Previous remains.
- Spot-check `task-two.tsx`, `task-three.tsx`, `task-four.tsx`, `task-five.tsx` footers and remove any other footer-level Previous button. (Task 4's "Previous step" inside the multi-step investigation stays — it navigates between sub-steps, not pages.)

## 2. Task 4 — merge email into the "Save your startups" page

Currently Phase 4 has two sequential screens: an Intro ("Go save your startups now…" with a CTA "Open the CEO's email") and then a separate EmailScreen.

Change `src/components/aic-isb/task-four.tsx`:

- Delete the `"intro"` phase entirely. Start directly on the email phase.
- On that page, render in this order:
  1. The phase headline "Go save your startups now, {firstName}." + subheadline "Real startup crises. Structured problem solving. Find the root cause before the company collapses."
  2. The CEO email window (existing `InboxEmail`, opened by default — pass `defaultOpen` if available, or render the email expanded inline).
  3. A separate "How to approach this" box **below** the email (currently it sits inside the email body). Same subtle dark card styling (`border-border bg-card/60`), with the lightbulb icon and the 4 bullets.
- Keep the CTA "Start your investigation" inside (or right under) the email card.

## 3. Task 5 — BSC-style results flow with CTA gate

Today `ResultPhase` in `src/components/aic-isb/task-five.tsx` shows scores + benchmark + strengths/improvements + skill badges + Trophy congrats + Download/Share buttons all on one long page.

Restructure to mirror BSC (`final-moment.tsx` → `final-proof.tsx`):

**Step A — Results moment screen** (replaces the current single-page result):
- Keep score reveal, "Memo Approved / Reviewed / Returned" headline, feedback paragraph, the 3 stats (final score / valuation accuracy / strategic), the "Your memo vs. board benchmark" card, and the strengths/improvements lists.
- At the bottom, replace the Trophy + Download/Share block with a single CTA button: **"See What You've Earned →"** and a subheading directly below: `Certificate · Skills · Resume line · LinkedIn post` (matches BSC `final-moment.tsx` lines 60–71).

**Step B — Earnings screen** (new, BSC-style):
- New internal phase (e.g. `"earned"`) that renders after the CTA is clicked.
- Build it like `final-proof.tsx`: stacked sections in this order — Certificate preview + Download/Share buttons → LinkedIn post (sector/startup-specific copy) → Resume line → Skill badges (click to copy) → Prentix footer.
- Reuse the existing `SKILLS` list pattern; copy/share/LinkedIn logic can be ported from `final-proof.tsx`.

## 4. Certificate redesign (1920 × 1361 px, new logo)

Rework the `certificateHtml(...)` template at the bottom of `task-five.tsx` to match the uploaded reference `Virtual-Internship-Program-Manager-Palak.html`:

- Frame `1920 × 1361` (set explicit `width:1920px; height:1361px`); scale interior paddings/font sizes proportionally from the reference (which is 1100 × ~785).
- Left + right diagonal stripe panels (navy / mid-blue / royal-blue) — same `repeating-linear-gradient` pattern as reference.
- White inset "sheet" with rounded corners.
- Top row: AIC × ISB logo on the left (use the new uploaded `AIC-ISB-new-logo.png`), Prentix navy badge on the right.
- Body: title **"Virtual Internship: Program Manager"**, "Certificate of Completion", today's date, "Awarded to **{Student Name}**", description paragraph mentioning the evaluated startup, verification codes.
- Footer signature: "Rishik Reddy · Founder, Prentix".

Logo handling:
- Copy `user-uploads://AIC-ISB-new-logo.png` to `src/assets/aic-isb-logo.png` (overwrite the existing import target so `aicLogoUrl` already used in `task-five.tsx` resolves to the new logo). Both the in-app header and certificate get the new logo automatically.
- Continue inlining the logo as a data URL into the downloadable HTML so it stays embedded.

## 5. Verification

- Manually walk through Phases 1 → 5 in the preview: confirm only one Previous button, Phase 4 shows the email inline with "How to approach" below it, Phase 5 results page ends with the single "See What You've Earned →" CTA, the earnings page mirrors BSC layout, certificate downloads at 1920×1361 with the new logo and correct student name.

## Technical notes

- Files changed: `src/components/aic-isb/task-one.tsx`, `task-four.tsx`, `task-five.tsx`, `src/assets/aic-isb-logo.png` (replaced).
- No new dependencies; LinkedIn/copy/share helpers can be lifted from `src/components/screens/final-proof.tsx` patterns (without pulling in `html2canvas`/`jsPDF` unless the user later asks for a PDF — current flow downloads an `.html` certificate).
- No data model or routing changes.
