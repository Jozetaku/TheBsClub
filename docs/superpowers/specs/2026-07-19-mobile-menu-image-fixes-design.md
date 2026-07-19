# Mobile Menu and Product Image Fixes — Design

Date: 2026-07-19
Status: Approved direction; awaiting written-spec review

## Objective

Correct the mobile campaign spacing, remove every live claim that waffles are available, prevent the Brown Sugar caption from colliding with the secondary hero image, and show the complete Yummy Strawberry cup in both placements.

## Confirmed Root Causes

- The hero caption is stretched from `left` to `right`, while the later absolutely positioned side image paints over the same lower-right area.
- The portrait Yummy Strawberry source is placed inside fixed landscape frames with `object-fit: cover`, which discards the top and bottom of the cup.
- Below 960 px, the campaign image switches from `contain` to `cover`, leaving the outer cups too close to the viewport edges.
- Waffle availability is asserted in two images plus structured data, the marquee, and the product promise.

## Considered Approaches

### 1. Safe framing with existing real menu assets — selected

Use the existing `signature-latte.jpg` for the two waffle placements, update live content to Signature Latte at CHF 4.90, and solve framing through scoped CSS classes. This keeps production truthful and avoids publishing an untested concept drink.

### 2. Remove the waffle card without replacement

This is accurate but leaves the product grid visually unbalanced and weakens the site's coffee emphasis.

### 3. Publish the new Salted Caramel Cloud Latte concept

This is visually distinctive but is rejected for this change because the recipe has not completed an in-store test. The concept asset remains unreferenced by production.

## Content Changes

- Replace the hero-side waffle image with `images/signature-latte.jpg` and an accurate Signature Latte alt description.
- Replace the Strawberry Waffle card with a Signature Latte card:
  - category: `Hot coffee`
  - name: `Signature Latte`
  - price: `CHF 4.90`
- Remove `Waffles` from `servesCuisine` structured data.
- Replace `WAFFLES` in the marquee with `SIGNATURE LATTE`.
- Replace `Coffee, matcha, bubble tea and waffles.` with `Coffee, matcha, bubble tea and colourful drinks.`
- Production HTML, CSS, and JavaScript must not reference `signature-latte-hot-concept-v1.png`.

## Layout Changes

### Brown Sugar Hero Caption

The caption becomes content-width rather than spanning the entire main image. It retains the current pill styling and must fit within the image on narrow screens. The secondary image can continue overlapping the main photograph, but it must not cover the caption.

### Yummy Strawberry Product Card

Add a dedicated Yummy image class. The portrait asset uses `object-fit: contain` against a matching coral background so the entire rim and base of the cup remain visible. The rule must override the generic product-card `cover` rule without affecting other menu photography.

### Yummy Strawberry Story Image

Add a dedicated class or scoped rule that uses `object-fit: contain`, a matching coral background, and restrained internal breathing room. Keep the existing framed overlap composition while showing the whole cup.

### Mobile Campaign Trio

At widths up to 960 px, retain the existing blurred full-bleed background but render the foreground image with `object-fit: contain`. At widths up to 560 px, set the foreground width to 90% and centre it, creating approximately 5% safe space on each side.

## Responsive Acceptance Criteria

- At 390 px width, neither outer campaign cup touches the viewport edge.
- At 390 px and 820 px, the complete Yummy Strawberry rim and base are visible in every placement.
- At 390 px, 820 px, and 1280 px, the Brown Sugar caption is not covered by the secondary hero image.
- At 390 px, 820 px, and 1280 px, the product grid remains aligned with no horizontal overflow.
- No visible waffle product or waffle availability text remains on the live page.

## Testing

- Add content assertions for Signature Latte, CHF 4.90, updated structured data, and the absence of waffle claims.
- Add CSS assertions for the content-width caption, scoped Yummy `contain` rules, and mobile campaign safe-space rule.
- Run the full Node test suite.
- Capture and inspect screenshots at 390 × 844, 820 × 1180, and 1280 × 900.
- Confirm directions tracking, GA4 consent, campaign expiry, opening hours, phone number, and CTA order remain unchanged.

## Publishing Boundary

The implementation may be added to Draft PR #5 for review. It must not be merged or deployed without a separate explicit user instruction.
