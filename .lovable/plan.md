# Task 1 — Rebuild + Task 2 — Email & Notification Update

## Scope

- **Task 1** (`src/components/aic-isb/task-one.tsx`): full visual rebuild, single scrolling page (not separate screens). Keep autosave + Save Draft.
- **Task 2** (`src/components/aic-isb/task-two.tsx`): email copy + new "Call for Applications" CTA → notification screen → existing dashboard (evaluation logic untouched).
- **New edge function** (`supabase/functions/score-thesis/index.ts`): scores the thesis via Lovable AI Gateway.

---

## Task 1 — scroll flow on one page

A single page where sections appear as the user progresses. No multi-screen routing.

### Section A — Email (top of page)
- Inbox-style email card, same component family as today.
- New body (verbatim):
  > Hi {firstName},
  >
  > Really glad to have you on board. You're joining at an exciting time — we're shaping the next AIC × ISB cohort, and I want fresh thinking involved from day one.
  >
  > Here's what I need from you first: pick one of the three sectors below based on your research and build an Accelerator Investment Thesis around it. Think of it as your POV — where the opportunity is, why now, and what kind of startups deserve backing.
  >
  > **AI & SaaS  ·  ClimateTech  ·  HealthTech**
  >
  > Take your time, do the research, and come back with something you'd genuinely stand behind.
  >
  > Looking forward to seeing your thinking.
  >
  > Animesh — CEO, AIC × ISB
- CTA inside the email: **Begin** → smooth-scrolls to Section B and reveals it.

### Section B — Sector selection
- Heading: *"Before you back a startup, you need a point of view. Start here."*
- Three flat cards in a row (AI & SaaS, ClimateTech & Sustainability, HealthTech). Each shows icon, one-line description, small tag (e.g. "High momentum", "Policy tailwinds", "Care delivery shift").
- Selecting a card highlights it (border + check). Below the row: **Build my thesis →** button (disabled until a sector is picked). On click, reveals Section C and scrolls to it.

### Section C — Thesis builder (slide layout)
- Card styled like a presentation slide, max-width ~960px, centered.
- **Slide header**: "AIC × ISB" wordmark on the left, sector badge on the right.
- **Two panes** side by side (stacks on mobile):
  - **Left pane — guided questions**
    - 5-pip step progress bar at the top.
    - One question visible at a time (Q1–Q5), with section tag (📌 / 🔍 / 📊 / ⚡ / ✅), question text, subtle hint, and a textarea.
    - Live word count under textarea — turns **green** at ≥ 20 words.
    - **Next →** button (disabled until min-words met). On Q5 it reads **Evaluate →**.
    - Questions are exactly the 5 from the spec (Opportunity, Where startups should play, What the market is saying, Risks worth taking, My recommendation).
  - **Right pane — LinkedIn post preview**
    - Mock LinkedIn card. As each question is answered & submitted via Next, that block (emoji tag + answer) appears live in the preview.
    - Once any section is filled, hashtags populate at the bottom (e.g. `#AICxISB #AccelerationThesis #{sector}`).
    - **Copy post** button under the card (copies the rendered post).
- **Footer strip** below the slide: shows `Step X of 5` and a **Change sector** link (resets sector + answers after a confirm).
- Autosave to localStorage (existing `STORAGE_KEY` flow) + manual **Save Draft** kept in a small inline control on the footer strip. The full sticky `BottomBar` is removed in favor of this in-flow footer.

### Section D — AI Evaluation
- Triggered when user clicks **Evaluate →** on Q5.
- Posts answers + sector to a new edge function `score-thesis` which calls the Lovable AI Gateway (model `google/gemini-3-flash-preview`) and returns structured scores (tool-calling) on 3 criteria: market understanding, opportunity clarity, recommendation strength — each 0–10 — plus overall 0–10 and 2–4 lines of feedback.
- Threshold: **6/10** overall to pass.
- UI:
  - Three score tiles (same design language as sector cards & step pips: flat, bordered, mono numbers).
  - Overall score badge + pass/fail state.
  - Feedback paragraph.
  - **Fail** → "Try again" button: resets to Q1 (keeps sector and answers so user can edit, just re-shows builder).
  - **Pass** → renders the full LinkedIn post (copyable) + **Submit thesis →** button that calls `onComplete(sector)`.
- Loading state while waiting on the API (skeleton tiles + "Reviewing your thesis…").
- Errors (429/402/network) shown inline with retry.

### Design
- Flat surfaces, no gradients/shadows on the new builder slide & score tiles. Existing ambient gradient on the page can stay subtle.
- Max-width for builder slide ~960px; everything else 620px centered as spec'd.
- Reuse design tokens (`primary`, `border`, `card`, `muted-foreground`, `success` via the existing `oklch(0.72 0.14 155)` green).

---

## Task 2 — email + notification screen

`src/components/aic-isb/task-two.tsx`:

1. **Update `EmailPhase`**:
   - New body (verbatim):
     > Hi {firstName},
     >
     > Good job on the investment thesis — the board agrees with your direction and recommendations.
     >
     > We've opened the call for applications. When you're ready, go ahead and launch it. Our analytical team will surface the shortlisted pool for your review, and I'd like to hear which ones you'd back.
     >
     > No pressure — trust your instincts.
   - CTA label changes to **Call for Applications**.
2. **Add a new `NotificationPhase`** between `email` and `dashboard`:
   - Centered card on a dark page.
   - Copy: *"We received 8,000+ applications from founders across the country. Our analytical board reviewed them all and shortlisted 8 startups for your evaluation. Pick the 2 you'd bet on."*
   - Subtle "applications received" animation (count-up or progress strip is optional — keep flat).
   - As the user scrolls down, the existing dashboard (startup list) renders directly below the notification (single scroll, no extra click). Implemented by rendering both Notification + Dashboard on the same page when `phase === "notification"`, with the notification as a hero block above the dashboard.
3. **Phase enum** becomes `"email" | "notification" | "loading" | "result"`. The dashboard is part of the `notification` view (notification hero + dashboard content). Submit flow & evaluation logic untouched.

---

## Technical notes

- **AI scoring**: edge function uses `LOVABLE_API_KEY`, `https://ai.gateway.lovable.dev/v1/chat/completions`, with tool-calling for structured `{ market: number, opportunity: number, recommendation: number, overall: number, feedback: string }`. Handle 429 (rate limit) and 402 (credits) with user-facing toasts/inline messages.
- Ensure `LOVABLE_API_KEY` is provisioned (call `ai_gateway--create` if missing during build).
- Frontend calls via `supabase.functions.invoke('score-thesis', { body: { sector, answers } })`.
- Keep existing localStorage key `aic-isb:task1:v1` (still `{ sector, answers }` shape) so prior drafts hydrate.
- TypeScript strict — no new lint/type errors.

## Files touched

- `src/components/aic-isb/task-one.tsx` — rewritten.
- `src/components/aic-isb/task-two.tsx` — email copy, new notification phase.
- `supabase/functions/score-thesis/index.ts` — new edge function.
- `supabase/config.toml` — register the new function (verify_jwt = false ok for this internal call, or true with auth header — will use default true).
