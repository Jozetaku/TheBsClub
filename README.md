# The B's Club — Redesigned Landing Page

A conversion-focused, responsive landing page for The B's Club in Interlaken.

## Files

- `index.html` — semantic page content, SEO metadata and structured data
- `styles.css` — full responsive visual system
- `script.js` — navigation, scroll reveals, menu viewer and CTA tracking
- `images/` — original supplied brand, product and menu assets
- `DESIGN-REVIEW-TH.md` — Thai-language expert review and redesign rationale

## Preview locally

Run a local server in this folder and open the shown address in a browser:

```bash
python -m http.server 8000
```

The page can also be uploaded as-is to any static hosting provider such as GitHub Pages, Netlify or Cloudflare Pages.

## Content to verify before launch

- July 2026 offer eligibility and terms
- Current prices
- 4.9 Tripadvisor rating and review permissions
- Whether “No booking needed” matches store policy

## Main links

- Official website: `https://thebsclub.ch/`
- Opening hours: Every day: `11:00–19:00`
- Phone: `+41 76 226 27 22`
- Address: `Jungfraustrasse 46, 3800 Interlaken`
- Instagram: `@thebsclub25`

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

No build step or JavaScript framework is required.
