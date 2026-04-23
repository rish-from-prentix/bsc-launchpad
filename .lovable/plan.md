

# Make Prentix Logo Fully Visible Everywhere

The new Prentix logo URL is a wide wordmark (~2.5:1 aspect ratio) on a solid black background. Two problems are making it invisible/illegible right now:

1. **`brand-invert` filter breaks it.** The global `.brand-invert` class applies `filter: brightness(0) invert(1)`, which turns the entire image (including its black background) into a solid white rectangle. The wordmark disappears.
2. **Height-based sizing is too small.** Current usages set `height={14–26}`, which on a 2.5:1 logo yields only ~35–65px of width — unreadable at glance.

## Fix

### 1. `src/components/brand-mark.tsx` — brand-aware rendering

- Drop the `brand-invert` filter for `brand="prentix"`. The wordmark is already white, which reads correctly on the dark UI.
- Use `mix-blend-mode: screen` on the prentix `<img>` so the logo's black background drops out against the dark app background, leaving only the white "prentix" wordmark visible cleanly (no harsh black box around it).
- Switch prentix sizing from `height` to a `width`-driven model so the full wordmark is always visible. Interpret the existing `height` prop as a minimum target height and compute width from the known 2.5:1 aspect ratio, with a sensible floor.
- Keep BSC behavior unchanged (still uses `brand-invert`, still height-driven).

Concretely, for prentix:
```tsx
// width = max(height * 2.5, 80px) — guarantees the wordmark is legible
const width = Math.max(height * 2.5, 80);
<img
  src={prentixSrc}
  alt="Prentix"
  style={{ width: `${width}px`, height: "auto", mixBlendMode: "screen" }}
  className="select-none"
/>
```

### 2. Bump the `height` prop at every Prentix usage so the logo is clearly visible

Update each call site so the resulting wordmark is comfortably readable (target ~100–140px wide):

| File | Current | New |
|---|---|---|
| `src/components/app-shell.tsx` (header "Powered by") | `height={18}` | `height={20}` |
| `src/components/app-shell.tsx` (footer) | `height={14}` | `height={16}` |
| `src/components/screens/splash-screen.tsx` (top pill) | `height={16}` | `height={20}` |
| `src/components/screens/results-screen.tsx` ("tracked by") | `height={16}` | `height={18}` |
| `src/components/screens/final-results.tsx` (footer) | `height={18}` | `height={20}` |

With the new width formula (`max(height * 2.5, 80)`), every spot renders at ≥80px wide minimum, with the larger placements (header, splash, footer) hitting ~100px wide. The "Powered by" / "tracked by" labels and surrounding flex containers already wrap and have enough room — no parent layout changes needed.

### 3. Update the new image URL

Replace the current Prentix URL in `brand-mark.tsx` with `https://i.postimg.cc/c13v03x8/b7da5e58-f3dc-4a2b-8ea0-3796b5f42f4c.png`.

## Out of scope

BSC logo, all other screens, layout, colors, animations, and any unrelated styling.

## Files edited

- `src/components/brand-mark.tsx` — split rendering by brand, drop invert + add `mix-blend-mode: screen` for prentix, switch to width-based sizing.
- `src/components/app-shell.tsx` — bump two prentix `height` props.
- `src/components/screens/splash-screen.tsx` — bump prentix `height`.
- `src/components/screens/results-screen.tsx` — bump prentix `height`.
- `src/components/screens/final-results.tsx` — bump prentix `height`.

