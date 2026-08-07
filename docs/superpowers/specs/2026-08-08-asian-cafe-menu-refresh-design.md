# The B’s Club Asian Café Menu Refresh — Design Specification

**Date:** 2026-08-08  
**Launch target:** 2026-08-15  
**Status:** Approved design, pending written-spec review  
**Project:** The B’s Club, Jungfraustrasse 46, Interlaken

## 1. Objective

Reposition The B’s Club permanently from a drinks-led café into **The B’s Club — Asian Café Interlaken**, while keeping bubble tea, matcha and coffee equally prominent with Asian food.

The refreshed website must:

- introduce the new Asian food menu launching on 15 August 2026;
- make food and drinks equal primary reasons to visit;
- support searches for Asian café, Asian food, Thai food and bubble tea in Interlaken;
- build a recognisable visual identity around the approved **Mini Makers** concept;
- make the store’s daily opening hours, `11:00–21:00`, consistent everywhere;
- prepare a prominent vegetarian presentation without making an unverified dietary claim.

## 2. Approved Positioning

### Brand line

**The B’s Club — Asian Café Interlaken**

### Hero message

**Eat bold. Sip happy.**

Supporting copy:

> Fresh Asian favourites and colourful café drinks — carefully made for lunch, an afternoon pause or an easy evening meal.

### Product hierarchy

Food and drinks receive equal visual weight:

1. Asian food: Thai curries, spicy basil and katsu curry.
2. Café drinks: bubble tea, matcha and coffee.

The repositioning is permanent, not a temporary food campaign. The launch date is promoted in a compact announcement bar.

## 3. Visual Direction

The approved direction is **Bold Asian Club**.

### Palette

- Deep green remains the principal brand field.
- Warm cream provides readable menu and content surfaces.
- Golden yellow adds energy and highlights primary actions.
- Coral marks launches, interactive feedback and playful details.

### Typography

- Bold, compact sans-serif display type communicates the new Asian Café positioning.
- The existing editorial serif may appear sparingly in supporting phrases.
- Body text remains highly readable and restrained.

### Character

The page should feel energetic, warm and memorable rather than resembling a generic restaurant template. Creative coding is used as a controlled signature, not across every section.

## 4. Brand Placement

The official mountain-and-wordmark logo supplied by the owner is the primary brand logo.

- Place the full official logo in the top-left of the site header.
- Repeat the full logo in the footer.
- Do not place the full official logo inside the Bubble Tea cursor; it is illegible at cursor scale.
- Use the previously designed, simplified `B` badge on the cursor cup.
- Give the header logo enough clear space to remain legible on desktop and mobile.
- Do not repeat the full logo in the hero artwork, because the Mini Makers scene is the hero’s focal device.

## 5. Mini Makers Signature

The Hero contains an oversized Asian comfort-food bowl and oversized Bubble Tea cup. A small team of Mini Makers interacts with them:

- one character climbs a ladder against the bowl;
- one character adds or carries fresh herbs;
- one character works around the Bubble Tea cup;
- a maximum of one miniature character may appear on a menu card where it adds meaning.

### Motion

- Use a subtle 8–10 second loop.
- Character actions may include climbing, sprinkling herbs, checking pearls and polishing the cup.
- The oversized food and drink remain visually stable while the characters provide motion.
- Avoid continuous high-amplitude motion, excessive particles or animation behind body copy.
- Under `prefers-reduced-motion: reduce`, render the scene as a static composition.
- On small mobile screens, reduce both the number of characters and the amount of motion.

The Mini Makers are a permanent brand device and must not be removed during later visual simplification.

## 6. Bubble Tea Cursor

The desktop cursor is a small The B’s Club Bubble Tea cup with an angled straw.

### Shape and branding

- Use a wide clear lid, tapered sides and a rounded base based on the café’s menu cup silhouette.
- Retain the simplified `B` badge previously designed for the cup.
- Add two straight, parallel Brown Sugar lines from beneath the lid to the bottom of the cup.
- Place the lines to the left and right of the central `B` badge so they never obstruct it.
- Render the pearls above the Brown Sugar lines to maintain depth.
- Use the tip of the straw as the actual cursor hotspot.

### Interaction

- The cup follows the pointer precisely; the straw tip must not visually lag behind the click coordinates.
- On interactive hover, pearls may rise slightly.
- On click, a short pearl-pop effect may play and must finish in about 0.55 seconds.
- Disable the custom cursor on touch or coarse-pointer devices.
- Preserve the native cursor for text selection, form fields and any control where precision or accessibility would suffer.
- Disable decorative motion for reduced-motion users.

## 7. Homepage Information Architecture

Use the following order:

1. **Header** — official logo at top-left; Food, Drinks, Our Story and Visit navigation.
2. **Launch bar** — `New Asian Food · From 15 August · Open daily 11:00–21:00`.
3. **Hero** — “Eat bold. Sip happy.”, Mini Makers, giant bowl, giant Bubble Tea, food/menu CTA and directions CTA.
4. **Three quick promises** — Asian Comfort, Café Favourites and Easy Evenings.
5. **Asian Café Favourites** — four menu items as semantic HTML cards.
6. **Dietary callout placeholder** — Tofu option language only until ingredients are confirmed.
7. **Drinks section** — Bubble Tea, Matcha and Coffee as the other half of the offer.
8. **Easy Evening section** — position the café as a relaxed, affordable evening meal without overstating the current hours.
9. **Our Story and Guest Notes** — retain the existing brand story and reviews as secondary trust content after the new food-and-drink offer.
10. **Wellness partner strip** — retain the existing Thai London Therapy relationship below the reviews without competing with the Asian Café message.
11. **Visit section** — address, daily hours and directions CTA.
12. **Footer** — official full logo, address, opening hours and essential links.

The existing drinks-menu viewer may remain available, but it must not be the only way to access food information.

## 8. Menu Content

All food names, descriptions, options and prices must be visible as real HTML text.

### Spicy Basil

Thai holy basil, garlic, fresh chilli, seasonal vegetables and jasmine rice.

- Chicken — CHF 18.50
- Tofu — CHF 15.50

### Green Curry

Creamy coconut milk, Thai green curry, fresh vegetables and jasmine rice.

- Chicken — CHF 18.50
- Tofu — CHF 17.50

### Red Curry

Red curry paste, coconut milk, vegetables, sweet basil and jasmine rice.

- Chicken — CHF 18.50
- Tofu — CHF 17.50

### Crispy Chicken Breast on Rice (Katsu Curry)

Crispy panko chicken, Japanese curry sauce and jasmine rice.

- CHF 17.50

## 9. Dietary-Labelling Rule

The tofu versions must initially be labelled **Tofu option**, not Vegetarian, Vegan, `Vegetarisch` or plant-based.

The vegetarian callout design and layout may be prepared but must remain unpublished until the supplier confirms that the complete tofu dishes contain no fish sauce, oyster sauce, shrimp paste or other animal-derived ingredients. Any cross-contamination or shared-utensil wording also requires operational confirmation.

After confirmation, the approved callout position will become:

**Vegetarian choices · Vegetarische Optionen**

Vegan language requires a separate explicit confirmation.

## 10. Language Strategy

English is the primary site language. Add concise German labels where they help local customers without creating a second full translation:

- `Speisekarte`
- `Täglich geöffnet`
- `Vegetarische Optionen` only after dietary verification

German labels must supplement, not duplicate, long blocks of English copy.

## 11. SEO Design

### Primary metadata

- Title: `The B’s Club | Asian Café & Bubble Tea Interlaken`
- H1: `Asian Food & Bubble Tea in Interlaken`
- Opening hours: `Open daily · Täglich geöffnet · 11:00–21:00`

### On-page content

- Keep dish names, descriptions, prices and options in indexable HTML.
- Use descriptive headings for Asian food, Bubble Tea, Matcha, Coffee and the Interlaken location.
- Give menu sections stable anchors so individual categories can be linked directly.
- Use descriptive alt text for genuine food and drink photographs.

### Structured data

Update the local business structured data to reflect the combined café and restaurant offer, including:

- The B’s Club name and official URL;
- Jungfraustrasse 46, Interlaken;
- daily hours of 11:00–21:00;
- Asian/Thai food, Bubble Tea, Matcha and Coffee;
- menu relationship or URL;
- current phone and social links already verified in the site.

No keyword, cuisine or dietary claim may be included solely for SEO if it is not supported by the actual offer.

## 12. Implementation Architecture

Retain the current static HTML/CSS/JavaScript architecture.

- Semantic menu content lives directly in HTML for indexing and no-JavaScript access.
- CSS owns layout, responsive behaviour and most Mini Maker motion.
- JavaScript owns navigation, existing menu-viewer behaviour, progressive interaction effects and the desktop cursor.
- Avoid a framework migration for this release.
- Reuse the existing analytics consent and directions tracking behaviour.

The food section must remain fully readable if JavaScript fails.

## 13. Responsive Behaviour

### Desktop

- Full official logo lockup in the top-left header.
- Split hero copy and Mini Makers composition.
- Bubble Tea custom cursor enabled for fine pointers.

### Tablet

- Preserve the split composition where space permits; otherwise stack the hero.
- Keep dish cards in a readable two-column or one-column layout.

### Mobile

- Use a reduced-size full logo in the header.
- Stack hero copy above the Mini Makers scene.
- Reduce the number of miniature workers.
- Use the native touch interaction and no custom cursor.
- Ensure food names, choices and prices remain visible without opening a dialog.

## 14. Failure and Fallback Behaviour

- If JavaScript fails, navigation links, menu content, prices, hours and directions remain usable.
- If motion is unsupported or disabled, Mini Makers display as a static scene.
- If custom cursor support is unsuitable, the browser’s native cursor is used.
- If a product image fails, maintain the card’s readable text and avoid layout collapse.
- Do not hide dietary uncertainty behind an icon; withhold the claim until verified.

## 15. Verification

Before launch, verify:

- the four food items and all seven listed prices against the supplied source;
- `11:00–21:00` in visible copy, footer, metadata and structured data;
- the 15 August launch message;
- official logo clarity in the header and footer;
- Mini Makers on desktop and reduced composition on mobile;
- straw-tip hotspot alignment and click accuracy;
- no custom cursor on touch devices or text inputs;
- reduced-motion fallback;
- navigation, menu viewer and directions tracking;
- semantic headings, metadata and structured data;
- layout at approximately 360 px, 768 px, 1024 px and wide desktop sizes;
- no use of Vegetarian, Vegan or equivalent German claims before supplier confirmation;
- acceptable page weight and smooth motion on an ordinary mobile connection.

## 16. Out of Scope for This Release

- Ramen station, instant-noodle service and toppings inventory.
- Online ordering, table booking or payments.
- A full German-language site.
- Automatic day/night themes.
- Extending hours beyond 21:00.
- Publishing Vegetarian or Vegan claims before supplier verification.

These may be designed as later phases without changing the approved Asian Café positioning.
