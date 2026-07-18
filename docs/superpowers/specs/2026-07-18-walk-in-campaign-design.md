# The B's Club Walk-in Campaign Design

**Date:** 18 July 2026  
**Status:** Approved direction; written-spec review pending  
**Campaign end:** 31 August 2026, 23:59 Europe/Zurich  
**Campaign code:** `BS12`

## Purpose

Increase walk-in purchases at The B's Club by promoting three confirmed drinks at campaign-only prices. The website must also stop claiming that the shop serves brunch, breakfast, avocado toast, or all-day comfort food because those claims are not currently accurate.

This design covers the website campaign section, accurate supporting copy, campaign-code presentation, analytics hooks, expiry behavior, and verification. Creating and activating the paid Google Ads campaign is a separate follow-on workstream. No ad spend is authorized by this website specification.

## Confirmed business details

- Canonical website: `https://thebsclub.ch/`
- Opening hours: every day, `11:00–19:00`
- Telephone: `076 226 27 22` / `tel:+41762262722`
- Primary site CTA: `Get Directions`
- Secondary site CTAs: `View Menu` and `Order on Uber Eats`
- Campaign goal: increase walk-ins, not online orders

## Offer

The campaign applies only to these three named drinks at their standard preparation:

| Drink | Regular price | Campaign price | POS item |
| --- | ---: | ---: | --- |
| Brown Sugar Milk Tea | CHF 7.90 | CHF 6.95 | `BSC-WALKIN-01-BROWN` |
| Yummy Strawberry | CHF 7.90 | CHF 6.95 | `BSC-WALKIN-01-STRAWBERRY` |
| Matcha Latte | CHF 8.90 | CHF 7.80 | `BSC-WALKIN-01-MATCHA` |

The offer is in-store only and requires the customer to show or say code `BS12` at checkout. Cream top remains part of the drink when it is normally included; the campaign does not introduce a separately priced topping.

The public wording is:

- Label: `The B's Club · Walk-in special`
- Headline: `12% off 3 favourites`
- Supporting copy: `Your next Interlaken pick-me-up is waiting. Choose one of three customer favourites at a special in-store price.`
- Code instruction: `Show code BS12 at checkout`
- Terms: `In store only · Until 31 August 2026`
- Primary CTA: `Get Directions`

No quantity limit, customer-identity requirement, or additional condition is invented. If the business later chooses a quantity limit, it requires a copy and terms update before enforcement.

## Placement and visual design

Use the approved **Professional A — Bold Summer Trio** direction as an inline section on the homepage near the existing popular-menu content. Do not use a popup or a separate landing page in this phase.

On desktop, the section is a two-column campaign card:

- approximately 55% professional product image;
- approximately 45% offer copy, price rows, campaign code, expiry, and CTA;
- warm coral-to-amber palette with black and cream for contrast;
- restrained decoration and one dominant action.

On mobile, the image appears above the offer copy. The current sticky mobile action bar remains available and must not cover the campaign CTA, code, prices, or terms.

The product image is based on the three user-provided Drive references. It presents exactly Brown Sugar Milk Tea, Yummy Strawberry, and Matcha Latte with consistent upright angles, clean commercial lighting, and no generated text, logo, watermark, people, food, extra drinks, or floating props. Offer text and prices stay as HTML so they remain sharp, accessible, and editable.

The final image is stored as an optimized local website asset rather than loaded from Google Drive at runtime. If the image fails to load, the gradient background, offer copy, prices, code, and CTA remain readable and usable.

## Accurate site content

Remove every public claim that currently promotes unavailable brunch or breakfast items, including:

- `Brunch` in title, descriptions, Open Graph copy, and structured data;
- `all-day comfort food` in the hero;
- `brunch` in the expectation section;
- the `Breakfast / Avocado Toast` product card;
- the avocado-toast story image and alt text;
- `Drop in for breakfast` in the visit section.

Replace these with truthful language centered on coffee, matcha, bubble tea, waffles, sweet drinks, and an Interlaken café stop. The replacement fourth product card is `Yummy Strawberry`; no new food or facility claim is added.

The page title becomes `The B's Club — Coffee, Matcha & Bubble Tea in Interlaken`. The meta and Open Graph descriptions mention the confirmed product categories, address context, hours, and no brunch claim. Structured data removes `Brunch` from `servesCuisine`.

Do not claim dedicated family facilities, childcare amenities, ethnicity-specific appeal, or unavailable menu categories. The tone can remain welcoming to families, teenagers, young adults, tourists, and people working or travelling in Interlaken.

## Campaign expiry

The campaign begins when the approved website version is published after the three POS items exist and staff have been briefed on `BS12`.

The campaign section carries an explicit end timestamp equivalent to `31 August 2026, 23:59 Europe/Zurich`. JavaScript hides the complete campaign section after that moment so visitors are not shown an expired offer. The implementation must avoid a visible flash of expired content. A follow-up site cleanup on or after 1 September removes the expired markup and campaign asset permanently.

If JavaScript is unavailable before the end date, the offer remains visible and usable. If JavaScript is unavailable after the end date, the static fallback cannot determine the date; the scheduled operational cleanup is therefore still required.

## Measurement

The campaign uses aggregate, privacy-conscious measurement and collects no name, phone number, email address, or other customer identity.

1. The campaign CTA is an existing tracked directions link with `data-cta="directions"` and `data-cta-location="campaign"`.
2. A click emits the existing exact-once GA4 event `directions_click` with `cta_location: "campaign"`.
3. Existing Advanced Consent Mode behavior remains unchanged: analytics is denied by default, granted only after analytics acceptance, and all advertising consent signals remain denied on this site.
4. The three POS campaign items count real campaign sales and revenue. Code `BS12` is the customer-facing proof that the campaign was seen.
5. When Google Ads is configured later, Google Ads auto-tagging and campaign UTMs distinguish paid traffic from organic search and direct visits in GA4. The single code `BS12` intentionally measures total campaign redemption; it does not attempt unreliable person-level source attribution.

The operating funnel is:

`traffic source → campaign view → directions_click → BS12 redemption → campaign revenue`

Primary reporting metrics are paid and organic campaign visits, campaign-section directions clicks, `BS12` redemptions by POS item, campaign revenue, and—after ads launch—cost per redemption. Three-day data is diagnostic only; budget decisions wait for seven days or approximately 20 paid clicks unless tracking is broken.

## Accessibility and performance

- All offer information exists as selectable HTML text, not baked into the image.
- Regular prices use semantic text plus visual strikethrough; campaign prices are not communicated by color alone.
- Text and buttons meet readable contrast against the warm background.
- The campaign image has descriptive alt text naming the three drinks.
- The image is resized and compressed for the rendered dimensions to avoid an unnecessary mobile download.
- The section respects the existing reduced-motion behavior and keyboard focus styles.
- No new runtime dependency, font service, tracker, or third-party image host is introduced.

## Verification

Automated tests must verify:

- the exact three drink names, regular prices, campaign prices, code `BS12`, and end date;
- no case-insensitive `brunch`, `breakfast`, `avocado toast`, or `all-day comfort food` remains in public page markup or metadata;
- the campaign directions link has `data-cta="directions"` and `data-cta-location="campaign"`;
- the existing `directions_click` exact-once regression tests still pass;
- the campaign section is shown before expiry and hidden after expiry;
- confirmed hours, phone, domain, consent behavior, menu CTA, and Uber Eats CTA remain unchanged.

Manual production verification uses a mobile viewport near `390×844` and a desktop viewport. It confirms readable copy and prices, a visible `BS12` instruction, correct image crop, no sticky-bar overlap, working Directions/Menu/Uber actions, correct consent behavior, no console errors, and one campaign `directions_click` visible in GA4 Realtime after analytics acceptance.

## Launch gates

Website publication requires all of the following:

1. The three POS campaign items exist with the exact prices in this specification.
2. Staff know that customers may show or say `BS12` and know which POS items to select.
3. Automated and mobile verification pass.
4. The user approves the production preview.

Paid Google Ads activation is a later, separate irreversible-spend gate. Before activation, the user receives the exact Google Ads account, campaign name, daily budget of CHF 5, location, dates, keywords, exclusions, ad copy, landing URL, and measurement settings for final confirmation.
