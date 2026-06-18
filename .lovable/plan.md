## Goal

Make the right inbox a slim list-only rail (Gmail-style). Open the full email in the main center pane as a realistic email view (header strip, avatar, sender + address, "to me", date, subject, formatted body, reply box at bottom). Keep all existing phase content working.

## Changes

### 1. Right panel (`src/components/aic-isb/inbox-panel.tsx`) — list only
- Narrow from `w-[340px]` to `w-[260px]`.
- Remove `EmailDetail` and `ReplyBox` from this file.
- Keep only the inbox header (Inbox icon, unread count) + scrollable message list.
- Each row: small avatar, sender name, timestamp, subject, 1-line preview, unread dot + bold styling. Active/selected row gets a subtle highlight.
- Clicking a row calls a new `onOpen(messageId)` prop passed in from the route — no internal "open" state.

### 2. Route (`src/routes/simulations.aic-isb.tsx`) — center email overlay
- Track `openEmailId` state at the route level.
- Default `openEmailId` to the current phase's email when `currentPhase` changes (so the brief shows up automatically), but the user can close it to reveal the phase workspace beneath.
- Pass `openEmailId` + setter into both the inbox panel and a new `<EmailReader />` rendered in the center column.
- When an email is open: render `<EmailReader />` at the top of the main column, above the phase task component. When closed (X button): show the phase content alone.

### 3. New `src/components/aic-isb/email-reader.tsx` — realistic email UI
Centered card, max-width ~760px, looks like a Gmail/Outlook message:
- Top toolbar: back/close button, star, archive, reply icons (visual only).
- Subject as large header.
- Sender row: round avatar (accent-tinted), bold sender name + grey `<email@domain>`, "to me" line, full date/time, role line beneath in muted small text.
- Body: serif-or-clean body font, generous line height, paragraph spacing, preserves greeting / paragraphs / sign-off (already in data).
- Footer: real reply composer — "Reply" button that expands a textarea + Send button (visual only, clears on submit). Inline "Reply" / "Reply all" / "Forward" chips above the composer like Gmail.

### 4. Visual polish
- Use existing semantic tokens (`bg-card`, `border-border`, `text-foreground`, `primary`) so it fits the indigo-on-light theme.
- Subtle shadow + rounded-2xl on the email card; clean spacing, no dark gradient backgrounds.

## Files

- edit `src/components/aic-isb/inbox-panel.tsx` (strip detail view, slim down, controlled selection)
- add `src/components/aic-isb/email-reader.tsx` (center email + reply composer)
- edit `src/routes/simulations.aic-isb.tsx` (lift open-email state, render reader above phase content)

No changes to phase 1–5 task components or `phase-meta.ts` data.