## Changes

### 1. Replace poster image
Copy the uploaded screenshot over `public/videos/shantanu-onboarding-poster.jpg` so the splash video shows Shantanu's frame as the poster.

- `code--copy user-uploads://Screenshot_2026-04-28_at_1.48.12_PM.png public/videos/shantanu-onboarding-poster.jpg --overwrite`

### 2. Remove white line on left edge of video player
In `src/components/screens/splash-screen.tsx`, the wrapper `<div>` around the video has `border border-border` which renders a 1px light border on all sides. When the dark video sits flush, that border (especially the left side against the dark gradient) reads as a thin white line.

Fix:
- Remove `border border-border` from the video wrapper div (or change to `border-0`).
- Add `outline-none` and `ring-0` for safety.
- On the `<video>` element itself, add `block outline-none focus:outline-none border-0` so neither the element nor its focus ring contributes an edge line.
- Keep `rounded-xl overflow-hidden` so corners stay clean.

No other styles, layout, or functionality change.

### Files
- `public/videos/shantanu-onboarding-poster.jpg` (replaced)
- `src/components/screens/splash-screen.tsx` (border/outline cleanup on video container + element)
