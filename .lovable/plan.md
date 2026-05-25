## 1. Task 2 — "Missed conviction" logic fix

In `src/components/aic-isb/task-two.tsx` (`ResultPhase`), `underratedStrong` currently picks from `shortlisted`, so a startup the student already chose (e.g. WindSync) can still surface under "Missed conviction". Change it to pick strong startups the student did NOT shortlist:

```ts
const underratedStrong = startups.filter(
  (s) => bestIds.includes(s.id) && !evals[s.id].shortlisted,
);
```

Keep the existing copy ("stronger long-term defensibility … than your evaluation reflected for …") — it now correctly names startups the board would have picked but the student skipped.

## 2. Replace ` — ` with `, ` in user-facing copy

Across the AIC × ISB flow, swap the spaced em-dash separator for a comma in displayed prose. Leave standalone `—` placeholders (empty-value fallbacks like `value ?? "—"` and the rating input placeholder) untouched. Files and lines (all in `src/components/aic-isb/`):

- `task-one.tsx` — lines 78, 478, 522
- `task-two.tsx` — lines 165, 173, 585, 620
- `task-three.tsx` — lines 134, 189, 620
- `task-four.tsx` — lines 119, 122, 252
- `task-five.tsx` — lines 184, 245, 895, 897, 1082, 1135, 1140, 1156
- `rca-data.ts` — lines 22, 38, 65, 84, 112, 148, 219, 255, 282
- `startups-data.ts` — lines 78, 187, 229, 270, 302

Skip JSX comments (e.g. `{/* Background — glass card */}`) and the inline code comment on line 74 of task-five.tsx — those aren't rendered.

## 3. Remove "Verifiable certificate · 1920 × 1361 px" caption

In `task-five.tsx` `EarnedPhase` (around line 1306), delete the `<p>Verifiable certificate · {CERT_W} × {CERT_H} px</p>` paragraph.

## 4. Remove "Your LinkedIn post" section on Earned screen

In `task-five.tsx` `EarnedPhase`, delete the entire `{/* LinkedIn post */}` section (lines ~1311–1354), including the post card and "Open LinkedIn" button. Remove now-unused `post`, `handleLinkedIn`, `buildLinkedInPost` references (drop the `post` `useMemo`, the `handleLinkedIn` function, the `buildLinkedInPost` helper, and the `ExternalLink` / `Linkedin` imports if no longer used — `Linkedin` is still used by the certificate "Share on LinkedIn" button, keep it; `ExternalLink` becomes unused, drop it). Leave Resume line, Skills, Certificate, and Footer sections intact.

## 5. Certificate name font size

In `CertificateNode` (`task-five.tsx` ~lines 1069–1071): the internship title uses `fontSize: 84`. Update the awarded name to match — change `<strong … fontSize: 32>{name}</strong>` to `fontSize: 84` and bump the surrounding "Awarded to" line spacing so the larger name fits cleanly (wrap name on its own line: render "Awarded to" on one line at size 22, then `{name}` on the next line at size 84, weight 800, color `#0A1628`, with `marginTop: 12`). Keep certificate dimensions at the existing `CERT_W = 1920`, `CERT_H = 1361`.

## 6. Verification

- `tsc` clean build.
- Manually walk Phase 2 with WindSync shortlisted to confirm it no longer appears in "Missed conviction".
- Open Earned screen, confirm LinkedIn post section gone, caption gone, name renders at internship-title size without clipping; download PDF to confirm layout still fits 1920×1361.
