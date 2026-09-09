# Gallery generator (deterministic mockups)

The images in `docs/screenshots/` are **deterministic vector mockups**: they are
rendered from the app's own design tokens (colors, spacing, radii, font sizes),
its exact Persian strings and its exact inlined Lucide icon paths — plus the
real Vazirmatn font. Same demo dataset as `scripts/screenshots.mjs`, so numbers
stay consistent across every screen.

Regenerate everything:

```bash
npm i --no-save @resvg/resvg-js vazirmatn   # renderer + font (not app deps)
python3 scripts/mockups/extract_assets.py   # icons: index.html → .cache/
python3 scripts/mockups/main.py             # screens → scripts/mockups/out/
python3 scripts/mockups/hero.py             # hero banner
node scripts/mockups/render.js              # SVGs → PNGs (@2x, hero @1x)
cp scripts/mockups/out/*.png docs/screenshots/
```

For pixel captures from a real browser instead, see `scripts/screenshots.mjs`
(`npm run screenshots`) — it seeds the same dataset into IndexedDB and drives
Chromium with Playwright.

## Files

| File | Role |
| --- | --- |
| `extract_assets.py` | pulls exact icon SVGs out of the `index.html` bundle |
| `theme_data.py` | theme tokens, Jalali dates, fa-IR formatting, demo dataset |
| `svgkit.py` | SVG component kit mirroring the app's components/charts |
| `screens_a.py` / `screens_b.py` | the 10 gallery screens |
| `hero.py` | the 1600×800 README hero banner |
| `render.js` | SVG → PNG via resvg with Vazirmatn |
