# The B's Club — Asian Café Landing Page

A conversion-focused, responsive Asian Café landing page for The B's Club in Interlaken.

Launch target: 15 August 2026.

## Files

- `index.html` — canonical German homepage (`de-CH`), SEO metadata and structured data
- `en/index.html` — complete canonical English homepage
- `styles.css` — full responsive visual system
- `script.js` — navigation, scroll reveals, menu viewer and CTA tracking
- `music/` — The B's Club Global Music Radio, adapted from `Jozetaku/zetaku-radio-v2-dark` and limited to HTTPS streams for secure playback
- `cursor.js` — optional Bubble Tea cursor for fine-pointer desktop devices
- `images/` — original supplied brand, product and menu assets
- `review/` — review-first QR, social, order and contact hub; see `review/README.md`
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

- Official website: `https://www.thebsclub.ch/`
- Opening hours: Every day: `11:00–20:00`
- Phone: `+41 76 774 20 27`
- Address: `Jungfraustrasse 46, 3800 Interlaken`
- Instagram: `@thebsclub25`

## Bilingual homepage maintenance

- `/` is the complete German homepage and `/en/` is its complete English mirror. Keep visible content, canonical URLs, `hreflang` links, Open Graph data and JSON-LD aligned in both files.
- Shared browser behaviour belongs in `script.js`; shared prices and image paths belong in `menu-data.js`. Do not make either language depend on JavaScript for visible product names, quantities or prices.
- When a menu fact changes, update `menu-data.js`, both homepage files and the relevant tests in the same change.

## Sandwich and Food + Boba sets

The nine stable catalog IDs and all-inclusive prices are:

- `sandwich-regular` — CHF 16.90
- `sandwich-double` — CHF 24.90
- `sandwich-sharing` — CHF 31.90
- `katsu-chicken` — CHF 23.90
- `red-curry-chicken` — CHF 24.90
- `green-curry-chicken` — CHF 24.90
- `thai-basil-chicken` — CHF 24.90
- `red-curry-tofu` — CHF 23.90
- `green-curry-tofu` — CHF 23.90

Every currently available Boba flavour is included at the displayed set price. There is no premium tier and no drink surcharge. Do not add a price adjustment in the catalog, UI, order builder or message output.

Campaign v5 images in `images/campaign/v5/` are 1200 × 1500 JPEG files. Food-set photographs must retain white ceramic containers, one standard branded Boba cup, the wooden serving board, white table and real café interior. Sandwich photographs must preserve their exact item counts: Regular 1+1, Double 2+1 with no coffee, and Sharing 2+2. Reject repeated grid-like ingredients, wrong proteins or invented branding.

The direct-order Boba choices appear in both homepage forms. To add or remove an available flavour, update the flavour options in `index.html` and `en/index.html` together, verify the full drink-menu dialog, and rerun `tests/order-contact.test.mjs`, `tests/order-builder.test.mjs` and `tests/menu-sets.test.mjs`.

## Review hub maintenance

- Public route: `https://www.thebsclub.ch/review/`
- Keep every platform destination and the permanent tracked QR URL in `review/src/links.mjs`.
- Follow the build, test, and update instructions in `review/README.md`.
- Do not print or distribute the QR until the deployed HTTPS page is verified and the code is scanned successfully on physical iOS and Android devices.

## Autumn guide maintenance

- The English guide is `/en/articles/autumn-interlaken`; its German counterpart is `/de/artikel/herbst-interlaken`. The German version is selected from the article language switch, not by an automatic redirect.
- Change autumn-pack availability and content only in `articles/autumn-interlaken/travel-packs.mjs`; the approved product catalog also lives in that single maintenance file. The allowed status values are `active`, `limited`, and `unavailable`: active shows the approved details, limited asks visitors to check with the team, and unavailable removes product suggestions. Missing or invalid data uses the safe fallback independently on the affected card, with empty product suggestions and a current-menu link.
- Verify menu names with staff before adding or changing them in the pack data.
- Recheck Harder Kulm and BLS dates annually in late July/early August before the autumn guide is refreshed.
- On publication day, check Harder Kulm live operations, BLS current operating status, and the BLS annual timetable before publishing or updating the guide.
- Update `dateModified`, reader-facing checked date, and tests together in both bilingual article pages whenever facts or dates change.

## Autumn guide link verification

- On 27 August 2026, the official Harder Kulm destination and live-operation pages, BLS Lake Brienz page, BLS timetable, BLS current operating situation, BLS annual navigation timetable PDF, and Google Maps Directions query all returned HTTP 200. The Maps query resolved after redirects to Google Maps.
- Keep reader-facing destination links on healthy first-party Interlaken Tourism, Jungfrau Railways, BLS or Google Maps pages. Recheck every external link on publication day and replace a failing destination URL with the most relevant healthy first-party page; do not substitute secondary travel blogs.

The root website remains framework-free. The isolated review hub uses its small Node build only to render verified links and generate its QR assets.
