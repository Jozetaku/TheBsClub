# The B's Club business details and CTA design

## Goal

Make the website match the confirmed store information and prioritize in-person visits while preserving menu and delivery paths.

## Confirmed business information

- Official website: `https://thebsclub.ch/`
- Opening hours: every day, `11:00–19:00`
- Phone: `076 226 27 22` (`+41 76 226 27 22` internationally)
- Address: Jungfraustrasse 46, 3800 Interlaken, Switzerland

## CTA hierarchy

`Get Directions` is the primary CTA in the header, hero, visit section, map card, and mobile action bar. `View Menu` and `Order on Uber Eats` are secondary actions. The Uber Eats destination is the existing Bublee Interlaken listing at the same address.

## Tracking

Every directions link carries `data-cta="directions"`. The existing `script.js` attaches a click handler to each link, emits `directions_click` to `window.dataLayer`, and calls `gtag('event', ...)` when a Google Analytics function is present. Tracking must never block navigation or throw when analytics is absent.

## SEO and structured data

The meta description, canonical URL, Open Graph URL, JSON-LD URL, telephone, and opening-hours specification use the confirmed values. Visible opening hours and telephone links use the same source facts.

## Validation

Automated checks assert the confirmed hours, phone, canonical domain, CTA hierarchy, Uber Eats listing, and directions tracking hook. Mobile validation confirms that the primary directions action remains visible and usable without covering page content.

## Scope

No unrelated visual redesign, copy rewrite, pricing change, promotion change, or hosting migration is included.
