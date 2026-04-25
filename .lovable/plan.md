
# Final Results Redesign — Two-Screen Split

Replace the single `final` screen with **two sequential screens** (A → B) inside the existing state machine, with a 250ms fade transition. Reuse existing certificate generation, brand mark, and design tokens. No simulation logic, formulas, or other screens change.

## State machine changes (`src/routes/index.tsx`)

- Replace the `"final"` screen value with two distinct screens:
  - `"final-moment"` → Screen A
  - `"final-proof"` → Screen B
- `nextAfterFeedback(5)` now sets `"final-moment"`.
- Update `ctx` mapping so both render the "Internship Complete" header.
- Render new components: `<FinalMoment />` and `<FinalProof />`.

## Component structure

Replace `src/components/screens/final-results.tsx` with two new files plus a shared content module:

- `src/components/screens/final-moment.tsx` — Screen A.
- `src/components/screens/final-proof.tsx` — Screen B.
- `src/components/screens/final-shared.ts` — pure helpers/data (post variants, skills list, resume line builder, performance-tier helper).

The existing `final-results.tsx` is deleted; `index.tsx` no longer imports it.

### Stable random state

To preserve "post variant fixed on Screen A mount" across navigation back/forward without losing it, **lift state into `Index`**:
- `const [postVariantSeed] = useState(() => Math.random())` declared in `Index` once on mount.
- Pass `postVariantSeed` into `<FinalProof />`. Variant is then deterministically selected from `(ebitda tier, seed)`:
  - `>= ₹50L`: variant A if `seed < 0.5` else B.
  - `₹35L–₹50L`: variant C.
  - `< ₹35L`: variant D.

This guarantees the variant never re-rolls.

## Screen A — `FinalMoment`

Props: `{ name: string; months: MonthData[]; onContinue: () => void }`.

Layout: `min-h-[calc(100vh-8rem)] flex items-center justify-center`, inner container `max-w-[600px] mx-auto px-5 sm:px-8 text-center`, `style={{ animation: "fadeSlide 250ms ease-out" }}`.

Sections (all centered):

1. **Animated EBITDA reveal**
   - Small gold small-caps label: `YOUR 5-MONTH EBITDA` (`text-[10px] uppercase tracking-[0.22em] text-primary font-semibold`).
   - Large number, white bold 48px: `fmtINRShort(shown)` using the existing count-up animation pattern from `final-results.tsx` (1400ms cubic ease-out via `requestAnimationFrame`).
   - Muted subtext: `across 3 cities, 3 products, 5 months of decisions` (`text-sm text-muted-foreground mt-2`).

2. **Personalized headline + subtext** (driven by `cumulativeEbitda`):

   | Tier | Headline | Subtext |
   |---|---|---|
   | `>= 5_000_000` | `You think like an operator, ${name}. That's rare.` | `Five months. Eighteen SKU-city combinations. Budget crunches, demand spikes, festival seasons. You navigated all of it and came out ahead.` |
   | `>= 3_500_000` and `< 5_000_000` | `Strong run, ${name}. You made the calls that mattered.` | `Not every month went perfectly — and that's the point. You adjusted, you learned, and you finished strong.` |
   | `< 3_500_000` | `You played the full game, ${name}. That's already more than most.` | `The best operators in the world made their worst mistakes early. What matters is that you made real decisions and understood why they worked or didn't.` |

   Headline: `mt-10 text-[24px] sm:text-[28px] font-semibold leading-snug`. Subtext: `mt-4 text-[15px] text-muted-foreground leading-relaxed`.

3. **Single CTA** (centered, full-width on mobile, 320px on desktop):
   - Gold button `bg-primary text-primary-foreground` styled to match existing primary buttons: `See What You've Earned →`.
   - On click: call `onContinue()` which advances to `"final-proof"`.
   - Below button, `mt-3 text-[12px] text-muted-foreground`: `Certificate · Skills · Resume line · LinkedIn post`.

The button is enabled immediately (does not wait for count-up).

## Screen B — `FinalProof`

Props: `{ name: string; months: MonthData[]; postVariantSeed: number }`.

Layout: `mx-auto max-w-[720px] px-5 sm:px-8 py-12 sm:py-16 space-y-16`, with fade-in: `style={{ animation: "fadeSlide 250ms ease-out" }}`.

### Section 1 — Certificate

Port the existing certificate logic (Inter Bold injection, hidden 1200×850 capture node, scaled preview, html2canvas + jsPDF download) into `FinalProof`. **No changes to template URL or overlay coordinates.**

Layout:
- Scaled preview at top (same 600×425 wrapper, gold 1px border `border border-primary/40` to match "gold bordered preview").
- `mt-6 flex flex-col sm:flex-row gap-3 justify-center`:
  - **Download Certificate (PDF) →** — gold primary button (existing `downloadCertificate` handler).
  - **Share on LinkedIn →** — ghost/outline button. On click: `window.open("https://www.linkedin.com/sharing/share-offsite/?url=https://prentix.ai", "_blank", "noopener,noreferrer")`.
- Below buttons, centered muted micro-text (`mt-4 text-[12px] text-muted-foreground`): `This certificate is verifiable. Each one carries a unique engagement code.`

### Section 2 — Skills You Earned

- Section label, gold small-caps centered: `SKILLS YOU CAN ADD TO YOUR RESUME AND LINKEDIN`.
- Intro line, muted 14px: `You didn't just complete a simulation. You practiced skills that take most people years of on-the-job experience to develop. Add these.`
- Skills grid: `mt-6 flex flex-wrap justify-center gap-2.5`. Each skill rendered as a pill button:
  - Classes: `inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-3.5 py-1.5 text-[12px] text-foreground hover:bg-primary/10 transition cursor-pointer group`.
  - On click: `navigator.clipboard.writeText(skill)`, show inline `Copied!` tooltip (small absolute-positioned span fading in for 1.5s); copy icon (`lucide-react` `Copy`) `h-3 w-3 opacity-0 group-hover:opacity-60` to the right of the label.
- The 12 skills (verbatim, in order): Demand Planning, Inventory Optimisation, Newsvendor Analysis, Marketing Budget Allocation, Marketing Elasticity Analysis, Channel Strategy (D2C vs Quick Commerce), Supply Chain Decision-Making, EBITDA Optimisation, Cross-city Operations Management, Data-driven Trade-off Analysis, Working Capital Management, Scenario Planning under Uncertainty.
- Below pills, muted 13px centered: `Click any skill to copy it. Add it directly to your LinkedIn Skills section or resume.`

State: `const [copiedSkill, setCopiedSkill] = useState<string | null>(null)`; tooltip auto-clears after 1500ms.

### Section 3 — Resume Line

- Section label: `YOUR RESUME LINE` (gold small-caps).
- Intro: `Copy this directly into your resume under Experience or Projects.`
- Resume card: dark surface `bg-card`, gold left border `border-l-2 border-primary`, rounded right side, padding `p-5`, mono font `font-mono text-[13px] text-foreground/90 leading-relaxed whitespace-pre-wrap select-text`.
- Body (verbatim, with EBITDA in `Cr` substituted):

  ```
  Growth & Business Ops Intern — Bombay Shaving Company (Virtual, via Prentix)
  Managed inventory and marketing budgets across 3 SKUs and 3 cities over 5 months.
  Applied demand planning, Newsvendor analysis, and channel strategy (D2C and Quick
  Commerce) to optimise EBITDA. Navigated demand spikes, budget constraints, and
  competitive market shifts to deliver ₹{EBITDA}Cr in cumulative profit.
  ```

  `{EBITDA}` = `(totalProfit / 10_000_000).toFixed(2)`.

- Below card, ghost button `Copy Resume Line`. On click: copies the full text. Button label swaps to `Copied ✓` (green text via `text-[color:var(--success)]`) for 2000ms, then reverts.

### Section 4 — LinkedIn Post

- Section label: `YOUR LINKEDIN POST` (gold small-caps).
- Intro (verbatim): `Ready to post. Written to sound like you, not like AI. Personalised to your run.`

- **Variant selection** (driven by `postVariantSeed` + EBITDA tier in `final-shared.ts`):
  - Stored as four template strings (A, B, C, D) in `final-shared.ts`. Each contains `{EBITDA}` placeholder which is replaced with the same `(totalProfit / 10_000_000).toFixed(2)` value at render. **Post copy is rendered verbatim — no edits to wording.**

- **Mock LinkedIn card**: Dark surface `bg-[#1C1C1C] text-neutral-100 rounded-xl overflow-hidden border border-white/5`.
  - Header: `p-4 border-b border-white/5 flex items-center gap-3`:
    - Avatar: `h-11 w-11 rounded-full bg-neutral-700 text-white text-sm font-semibold` showing student initial.
    - Name (bold) + `Growth & Business Ops Intern` muted below.
    - Top-right: small LinkedIn icon (use lucide `Linkedin`).
  - Body: `p-4 text-[13.5px] leading-[1.65] whitespace-pre-wrap`.

- **Buttons** (below card, `mt-6 flex flex-col sm:flex-row gap-3 justify-center`):
  - `Copy Post` — ghost/outline. On click: copies post text → `Copied ✓` (green) for 2000ms.
  - `Post to LinkedIn →` — gold primary. On click: `window.open("https://www.linkedin.com/sharing/share-offsite/?url=https://prentix.ai", "_blank", "noopener,noreferrer")`.

- Below LinkedIn button, centered muted 13px: `LinkedIn will open with a share dialog. Paste your copied post text and attach your downloaded certificate as an image for maximum visibility.`

### Section 5 — Footer Close

Centered:
- `<BrandMark brand="prentix" height={20} />` (existing component, will use the same logo source already wired up).
- Muted 14px: `An internship experience by Prentix. Built with Bombay Shaving Company.`
- Gold link: `Explore more internships at prentix.ai →` → external link to `https://prentix.ai`, `target="_blank" rel="noopener noreferrer"`, classes `text-primary hover:underline`.

## `final-shared.ts` (pure module — no React)

Exports:
- `SKILLS: string[]` — the 12 skills above, exact order.
- `getPerformanceTier(ebitda: number): "high" | "mid" | "low"`.
- `POST_TEMPLATES: { A: string; B: string; C: string; D: string }` — all four variants verbatim, with literal `{EBITDA}` placeholder.
- `selectPostVariant(tier, seed): "A" | "B" | "C" | "D"`.
- `buildPost(template: string, ebitdaCr: string): string` — `template.replaceAll("{EBITDA}", ebitdaCr)`.
- `buildResumeLine(ebitdaCr: string): string` — same template logic for the resume copy.
- `buildHeadline(name: string, tier): string` and `buildSubtext(tier): string` for Screen A.

Centralizing here keeps both screen files thin and copy auditable in one place.

## Transition between A and B

- Both screens already animate in with `fadeSlide 250ms ease-out` via the existing `@keyframes fadeSlide` in `styles.css` (used elsewhere in `final-results.tsx`). Re-mounting on `setScreen("final-proof")` triggers the same fade naturally — no extra exit animation framework needed. This satisfies "250ms fade transition" without overengineering.

## What does NOT change

- `LINKEDIN_POST_BODY` in `simulation.ts` is no longer referenced by these screens; leave the export as-is (other code may use it; ripgrep confirms only the old `final-results.tsx` referenced it, but I'll leave the constant in place to avoid touching `simulation.ts`).
- Certificate template asset, coordinates, font, and PDF export logic are reused unchanged.
- All other screens, simulation logic, formulas, design tokens, animations, and the app shell stay exactly as-is.

## Files touched

- **Edit**: `src/routes/index.tsx` — replace `"final"` with `"final-moment"` + `"final-proof"`, update `nextAfterFeedback`, add `postVariantSeed`, render new components.
- **Delete**: `src/components/screens/final-results.tsx`.
- **Create**: `src/components/screens/final-moment.tsx`.
- **Create**: `src/components/screens/final-proof.tsx`.
- **Create**: `src/components/screens/final-shared.ts`.
