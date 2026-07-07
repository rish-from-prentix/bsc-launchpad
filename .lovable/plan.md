# CareFirst Visual Redesign — Glassmorphism + Progressive Disclosure + Von Restorff

Scope is strictly `src/components/carefirst/**`. No edits to `src/styles.css`, no changes to BSC / AIC×ISB / Architecture. New tokens live under a scoped `.carefirst-theme` wrapper so they cannot leak.

## 1. Local design system (new file)

Create `src/components/carefirst/carefirst-theme.css` and import it once from `carefirst-shell.tsx`. All rules scoped under `.carefirst-theme` so they only apply inside this module's wrapper.

Tokens (scoped as CSS custom properties on `.carefirst-theme`):

- `--cf-bg: #080808`
- `--cf-text: #F5F5F5`, `--cf-text-muted: #8A8A8A`
- `--cf-accent: #C6FF3D` (electric chartreuse)
- `--cf-success: #7EE787`, `--cf-warning: #FFD166`, `--cf-danger: #FF6B6B`
- `--cf-glass-bg: rgba(255,255,255,0.04)`, `--cf-glass-border: rgba(255,255,255,0.08)`, `--cf-glass-blur: 20px`
- `--cf-glass-elevated-bg: rgba(255,255,255,0.07)`, `--cf-glass-elevated-border: rgba(200,255,80,0.25)`, `--cf-glass-elevated-blur: 24px`
- `--cf-radius-card: 16px`, `--cf-radius-ctrl: 10px`
- `--cf-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)`

Utility classes (all `.carefirst-theme`-scoped): `.cf-glass`, `.cf-glass-elevated`, `.cf-btn-primary` (chartreuse text CTA), `.cf-btn-ghost`, `.cf-input`, plus keyframes `cf-blur-in` (opacity 0→1, backdrop-filter blur 0→20px, 300ms ease-out) and `cf-glow-pulse` (accent glow, 2s loop, low intensity) for the Share button.

Fonts loaded via `<link>` in `src/routes/__root.tsx` head (Space Grotesk + General Sans from Fontshare, plus existing JetBrains Mono). This is the only file touched outside the module and is limited to `<link>` tags — no token edits.

Because tokens are scoped, existing Tailwind utilities (`bg-card`, `text-foreground`) still work; we override them inside `.carefirst-theme` with CSS var mappings so shadcn primitives inherit the new look without prop changes.

## 2. Progressive disclosure — reusable primitive

Create `src/components/carefirst/progressive-sections.tsx` exposing:

- `<ProgressiveFlow>` — container tracking a reveal index in local state, persisted to `localStorage` under `carefirst.task-<id>.reveal` so returning to a task keeps its progress.
- `<ProgressiveStep index revealLabel>` — renders its child once `revealIndex >= index`; renders a ghost chartreuse button (`Continue reading →`, `Show me how to think about this →`, `Begin your answer →`) at `revealIndex === index - 1`.
- Applies `cf-blur-in` animation on mount of each newly revealed step.

Rework tasks 00–05 to wrap their sender email / attached data / teaching block / deliverable inside `<ProgressiveStep>` slots in that order. No content changes — pure structural rewrap. Same pattern is the template for future 06–14.

## 3. Von Restorff — two distinct moment types

**Shareable tasks (ids 2, 6, 8, 12):** `TaskShell` reads `meta.shareable` and applies `cf-glass-elevated` to the outer task container (accent-tinted border, brighter fill). The "Share to LinkedIn" button gets the `cf-glow-pulse` animation. Non-shareable tasks use plain `cf-glass`.

**Completion moments:**
- Routine submit (non-shareable tasks): small inline confirmation strip (current understated style, restyled to glass).
- Flagged submit (shareable tasks) and module wrap-up: new `<CompletionMoment>` component — near-full-screen glass panel, animated chartreuse glow ring expanding around a large checkmark, then reveals continue CTA. Used by `TaskShell` when `meta.shareable`, and by a final wrap-up screen after task 5.

## 4. Sidebar — collapsible overlay

Rework `carefirst-shell.tsx`:

- Remove the always-visible desktop sidebar column. Main content takes full width up to `max-w-3xl` centered.
- Persistent left-edge tab: fixed-position glass pill with chartreuse list icon + task-count badge, visible on all viewports while in a task.
- Clicking the tab opens the sidebar as an overlay (slides in from left, glass-styled, dark scrim behind). Not a push layout — content underneath does not shift.
- Row click navigates and auto-closes overlay.
- Escape / scrim click closes.
- Special case: when `currentTask === 0` AND task 0 not yet submitted (Program Overview moment), render the sidebar inline expanded instead of overlay — focus isn't yet needed.
- Existing mobile drawer logic merges into this single overlay behavior (one code path for all viewports).

## 5. Component-level restyle pass

Restyle without changing structure or copy:

- `email-card.tsx` → `cf-glass`, 16px radius, glow shadow, Space Grotesk on sender name.
- `attached-data.tsx` (`AttachedSection`, `BulletCard`) → `cf-glass` nested panels.
- `teaching-block.tsx` → `cf-glass` with subtle accent left border.
- `inputs.tsx` (`DeliverableLabel` + shared inputs) + `task-05` FixCard inputs → `.cf-input`, chartreuse focus ring.
- `TaskShell` submit CTA → `.cf-btn-primary` (chartreuse text on translucent fill), next-task CTA same.
- `splash.tsx`, `task-00-onboarding.tsx` through `task-05-recommend-interventions.tsx`, `task-locked.tsx`, `org-chart.tsx`, `overview.tsx` → wrap outer root in `<div className="carefirst-theme">` (done at shell level so pages get it automatically), swap any hardcoded borders/backgrounds to the new glass utilities.

No copy changes, no logic changes, no scoring/backend touched. AIC/BSC/Architecture files not opened.

## Technical notes

- Tailwind v4: extend via `@utility` inside the new css file if needed, but keep every selector prefixed with `.carefirst-theme` so no global utility is added.
- Backdrop-filter: write the standard property only; the build handles vendor prefixes (per project rules).
- All reveal state and sidebar-open state persisted to `localStorage` so refreshes and Previous navigation preserve position.
- Typecheck with `tsgo` after the rewrite.

## Out of scope

BSC, AIC×ISB, Architecture components/routes. Shared `src/styles.css` tokens. Scoring, backend, LLM, certificates.
