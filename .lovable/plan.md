

# Certificate Generation on Final Results Screen

Add a downloadable PDF certificate to the end of the final results screen, using the blank certificate template image as the visual base and overlaying only the participant's name dynamically.

## What you'll see

After the LinkedIn share card on the final results screen, a new section appears:

- A scaled-down on-screen preview of the certificate (blank template + your name overlaid in the correct position).
- A muted caption: *"Your certificate is ready to download."*
- A gold button: **Download Certificate (PDF) →**

Clicking the button generates a 1200×850 landscape PDF using the full-resolution template image with your name baked in, named `BSC-Internship-Certificate-{YourName}.pdf`.

## How it works

1. **Template asset**: The blank certificate template image (the second uploaded image, `dc8dcbea-87d7-4a83-bdd3-e6783a447bd1.png`) is copied into `public/assets/certificate-template.png` so it can be loaded by `html2canvas` without CORS issues.
2. **Off-screen full-size canvas**: A hidden `1200×850px` div is rendered with the template as its background and the user's name absolutely positioned over the name zone (matching the position from the filled example).
3. **On-screen preview**: The same markup is rendered visibly at a scaled-down size (~600px wide) using CSS `transform: scale(...)` so the proportions are pixel-identical to the export.
4. **PDF generation**: `html2canvas` captures the hidden full-size node at `scale: 2`, then `jspdf` writes it to a 1200×850 landscape PDF and triggers download.

## Name overlay specifics

- **Font**: Inter Bold, loaded from Google Fonts via a `<link>` injected into the document `<head>` (added once on mount of the final results screen).
- **Color**: `#0A1628` (dark navy).
- **Position**: absolutely positioned to match the filled reference — left edge ~`290px`, top edge ~`520px` from the 1200×850 canvas origin (the name zone above "Virtual Internship: Growth & Business Ops").
- **Size scaling**: starts at `64px`. For names longer than 18 characters, scales down using `Math.max(36, 64 - (name.length - 18) * 2)` so it never overflows the zone.
- **Fallback**: if `name` is empty, displays "Participant".

## Out of scope (untouched)

The LinkedIn card, EBITDA count-up, headline, footer brand mark, and every other screen, color token, animation, and piece of simulation logic remain exactly as-is.

## Technical notes

**Files edited / created**:
- `public/assets/certificate-template.png` — copied from the uploaded blank template (`user-uploads://dc8dcbea-87d7-4a83-bdd3-e6783a447bd1.png`).
- `src/components/screens/final-results.tsx` — adds the certificate section (preview + hidden full-size capture node + download handler), the Google Fonts `<link>` injection inside a `useEffect`, and the verification-code memos (kept stable per session, even though the template already shows static placeholder codes — they aren't rendered as overlays, just held in state for potential future use).
- `package.json` — adds `html2canvas` and `jspdf` dependencies.

**Capture flow**:
```ts
const canvas = await html2canvas(certificateRef.current!, {
  scale: 2,
  useCORS: true,
  allowTaint: false,
  backgroundColor: null,
});
const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1200, 850] });
pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 1200, 850);
pdf.save(`BSC-Internship-Certificate-${name || "Participant"}.pdf`);
```

**Why `public/` and not `src/assets/`**: `html2canvas` fetches background images at runtime; `src/assets` files go through Vite's hashed bundler pipeline, while `public/` files are served at predictable URLs without CORS friction.

**Hidden node positioning**: rendered with `position: fixed; left: -10000px; top: 0;` (rather than `display: none`) so layout/fonts compute correctly for the capture.

