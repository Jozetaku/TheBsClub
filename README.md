# The B's Club — Asian Café Landing Page

A conversion-focused, responsive Asian Café landing page for The B's Club in Interlaken.

Launch target: 15 August 2026.

## Files

- `index.html` — semantic page content, SEO metadata and structured data
- `styles.css` — full responsive visual system
- `script.js` — navigation, scroll reveals, menu viewer and CTA tracking
- `music/` — The B's Club Global Music Radio, adapted from `Jozetaku/zetaku-radio-v2-dark` and limited to HTTPS streams for secure playback
- `cursor.js` — optional Bubble Tea cursor for fine-pointer desktop devices
- `images/` — original supplied brand, product and menu assets
- `DESIGN-REVIEW-TH.md` — Thai-language expert review and redesign rationale

## Preview locally

Run a local server in this folder and open the shown address in a browser:

```bash
python -m http.server 8000
```

The page can also be uploaded as-is to any static hosting provider such as GitHub Pages, Netlify or Cloudflare Pages.

## Content to verify before launch

- New Asian food availability from 15 August 2026
- Current prices
- 4.9 Tripadvisor rating and review permissions
- Whether “No booking needed” matches store policy
- Supplier ingredients and preparation details before adding any formal dietary claim; the launch page currently says only `Tofu option`

## Verification

Run the complete automated suite with:

```bash
node --test tests/*.test.mjs
```

The launch refresh is also checked at desktop, tablet and mobile widths for horizontal overflow, menu dialogs, navigation, consent controls, Mini Makers, the music station and the custom cursor fallback.

## Rollback checkpoints

The refresh is isolated on `feature/asian-cafe-refresh`. These commits keep the major visual features independently reversible:

- `20dab73` — Bold Asian Club visual system
- `bf5464e` — Mini Makers ladder-climbing hero
- `4a264b6` — Bubble Tea straw-tip cursor

## Main links

- Official website: `https://thebsclub.ch/`
- Opening hours: Every day: `11:00–19:00`
- Phone: `+41 76 226 27 22`
- Address: `Jungfraustrasse 46, 3800 Interlaken`
- Instagram: `@thebsclub25`

No build step or JavaScript framework is required.
