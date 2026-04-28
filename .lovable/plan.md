# Play the Shantanu onboarding video in the splash screen

## Hosting decision

Self-host. The uploaded file is **4.3 MB**, 54 seconds, H.264/AAC, already web-optimized and well below any practical limit for a static asset. No need for YouTube or Vimeo — self-hosting keeps the design clean (no third-party branding/overlays), loads fast off the same origin, and gives us full control over the controls bar.

The file will live in `public/videos/shantanu-onboarding.mp4` so it's served as a static asset (not bundled by Vite). To improve perceived load time we'll also generate a poster image from the first frame.

## UX behavior

- Initial state is **unchanged**: the existing dark gradient placeholder with the gold circular play button and "Watch Introduction" label is shown. This preserves the current splash design exactly.
- When the user clicks **anywhere on the placeholder** (same hit area as today), the placeholder is replaced in-place by an HTML5 `<video>` element that:
  - Fills the same `aspect-video` rounded box (no layout shift)
  - Uses the generated poster as its `poster` attribute so it looks identical for the split-second before playback starts
  - Has `controls` enabled (native play/pause, scrubber, volume, fullscreen)
  - Auto-plays once mounted (with sound, since this is a user-initiated click — browsers permit it)
  - Has `playsInline` so it stays inside the box on iOS instead of going fullscreen
  - Has `preload="metadata"` so nothing is fetched until click
- The "Watch Introduction" caption underneath is hidden once the video is mounted (the controls bar makes it redundant).
- All other splash elements (name input, Begin Internship button, footer) are untouched.

## Styling the controls to fit the theme

Native browser controls already look at home on a dark surface in Chrome/Safari/Firefox. We'll add small CSS polish in `src/styles.css`:

- `video::-webkit-media-controls-panel { background-color: rgba(15, 15, 15, 0.85); }` for a subtle dark bar that matches the card background.
- Keep the rest of the controls native so we get correct accessibility, keyboard support, and fullscreen for free.

No custom controls library — keeps the bundle small and avoids deviating from the design system.

## Files changed

- **`public/videos/shantanu-onboarding.mp4`** (new) — copied from the upload.
- **`public/videos/shantanu-onboarding-poster.jpg`** (new) — first-frame poster generated with ffmpeg for instant visual.
- **`src/components/screens/splash-screen.tsx`** — add `const [playing, setPlaying] = useState(false)`; render either the existing placeholder (with `onClick={() => setPlaying(true)}`) or a `<video src="/videos/shantanu-onboarding.mp4" poster="/videos/shantanu-onboarding-poster.jpg" controls autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />`. Hide the "Watch Introduction" caption when `playing` is true. No other markup changes.
- **`src/styles.css`** — add the small `video::-webkit-media-controls-panel` rule to tint the controls bar to match the theme.

## What is explicitly NOT changing

- Splash layout, colors, typography, gold accents, name input, Begin Internship button, footer, BrandMark usage — all untouched.
- No new dependencies. No router changes. No state-machine changes.
