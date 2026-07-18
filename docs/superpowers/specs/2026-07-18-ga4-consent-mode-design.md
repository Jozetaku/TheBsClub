# GA4 and Consent Mode Design

Date: 2026-07-18
Status: Approved for planning

## Goal

Connect the live The B's Club website to the Google Analytics 4 property owned by `thailondontherapych@gmail.com`, measure every `directions_click`, and preserve useful roadmap data without placing analytics or advertising cookies before consent.

## Analytics configuration

- GA4 Measurement ID: `G-JS838K2PY5`
- Web stream: `The B's Club Website`
- Stream URL: `https://thebsclub.ch`
- Tracking method: direct `gtag.js` with Google Consent Mode v2
- Default consent: `denied` for `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization`
- Advertising personalisation remains disabled unless a future, separately approved advertising use case requires it.

## Visitor experience

The first visit displays a compact English consent bar at the bottom of the page. It must not cover the mobile Directions, Menu, or Uber Eats actions. The bar explains that analytics helps improve the website and offers two equally clear actions:

- **Accept Analytics** grants `analytics_storage` only.
- **Reject** keeps all consent categories denied.

The choice is stored locally so the bar does not reappear on every page load. A **Privacy settings** control in the footer lets the visitor reopen the bar and change the choice at any time.

## Data flow

1. Consent defaults are set before the Google tag loads.
2. The Google tag loads in advanced consent mode. While consent is denied, it may send Google-defined cookieless pings but must not write analytics or advertising cookies.
3. Accepting analytics updates only `analytics_storage` to `granted` and records the visitor's preference locally.
4. Rejecting analytics keeps every consent category denied and records the preference locally.
5. Every link with `data-cta="directions"` emits one `directions_click` event with only its `cta_location` value.
6. No name, telephone number, email address, order details, or other personally identifiable information is sent in the custom event.

## Components

- An inline bootstrap in `index.html` initializes `dataLayer`, defines `gtag`, sets default Consent Mode v2 values, and loads `gtag.js` for `G-JS838K2PY5`.
- Consent markup in `index.html` provides the explanation, Accept, Reject, and footer settings control.
- Consent behavior in `script.js` reads and stores the preference, updates Google consent on the same page, and controls banner visibility.
- Consent styling in `styles.css` follows the existing dark green and cream design and respects the mobile bottom action bar.
- Existing directions tracking remains the single source of the `directions_click` event and must not double-send events.

## Accessibility and resilience

- Consent actions are native buttons with clear accessible names and visible keyboard focus.
- The bar is usable at a 390 x 844 mobile viewport and does not block primary CTAs.
- If local storage is unavailable, the site remains usable and the visitor can still make a choice for the current page.
- Tracking failures never block navigation to Google Maps.

## Verification

- Automated tests verify the Measurement ID, default denied consent values, consent updates, stored preference behavior, and one `directions_click` per CTA click.
- Local browser testing covers first visit, Accept, Reject, reopening Privacy settings, and all five CTA locations.
- Mobile testing confirms the consent bar and bottom CTA bar do not overlap.
- Production verification confirms the Google tag loads, consent signals change correctly, the event reaches `dataLayer`, and the live site has no new console errors.

## Rollout

Changes are developed on `agent/add-ga4-consent`, committed intentionally, pushed to GitHub, and opened as a pull request to `main`. After checks pass, the pull request is merged and the GitHub Pages deployment is verified on `https://thebsclub.ch`.
