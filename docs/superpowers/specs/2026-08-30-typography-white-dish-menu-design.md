# Typography and White-Dish Menu Polish

Date: 30 August 2026

## Context

The German homepage hero currently feels crowded because its large uppercase H1 uses a `0.9` line height. The same site also uses separate H1 systems for the autumn articles and Review Hub. The public food cards are visually inconsistent: Green Curry uses the shop's white ceramic service ware, while Thai Basil, Red Curry and Katsu use kraft takeaway bowls. The Food + Boba collection has seven cards, leaving Thai Basil Tofu alone on the final row.

## Goals

- Make large multiline headings feel calmer without weakening the existing Bold Asian Club identity.
- Reduce every included H1 by exactly 2 CSS pixels at every viewport width.
- Inspect all non-radio headings and correct only genuine line-collision or cramped-wrap problems.
- Present all four main café meals in consistent white ceramic service ware with rice.
- Keep the meal photography realistic to the actual shop and its serving style.
- Reduce the Food + Boba collection from seven to six cards by removing only Thai Basil Tofu Set.

## Scope

Included:

- German homepage at `/`
- English homepage at `/en/`
- English and German autumn articles
- Review Hub source and generated artifact
- Shared food-card imagery and homepage hero food image
- Food + Boba catalog, visible cards, order controls, structured data, documentation and tests

Excluded:

- Global Music Radio typography and layout
- H1 wording, fonts, colours or letter spacing
- Regular-menu Tofu option for Thai Basil
- Thai Red Curry Tofu and Thai Green Curry Tofu Food + Boba sets
- Sandwich-set photography and Food + Boba set photography

## Typography Design

Use a targeted, context-aware adjustment rather than one global `h1` rule.

### Homepage hero

- Preserve the current fluid `clamp()` scale and subtract 2px from its rendered result at every viewport width.
- Increase `.hero-copy h1` line height from `0.9` to `0.94` on desktop, tablet and mobile.
- Increase `.hero-tagline` line height from `1` to `1.08` so two-line German and English copy has visible breathing room.
- Preserve the existing block treatment, colours, font weights and responsive wrapping.

### Autumn articles

- Subtract 2px from the rendered `.article-hero h1` size at every viewport width.
- Use `1.02` line height on desktop and `1.04` on mobile.
- Preserve the editorial width, heading copy and current responsive line groups.

### Review Hub

- Apply the 2px reduction in `review/src/review.css`; regenerate `review/dist/` through the existing build.
- Increase `.welcome h1` line height from `0.92` to `0.96`.
- Preserve the two deliberate headline lines and the non-wrapping desktop treatment.

### Other headings

Audit visible H2 and H3 elements at desktop, tablet and mobile widths. Do not globally rescale them. Change a selector only when screenshot review shows touching glyphs, clipped accents or an uncomfortably compressed multiline wrap. This keeps the requested change focused and prevents type-scale drift.

## Food Image Design

The current Green Curry Chicken photograph is the visual anchor. Create three new 1200 × 1500 JPEG menu-card photographs for:

- Thai Basil Chicken
- Thai Red Curry Chicken
- Crispy Chicken Katsu Curry

Every new photograph must show:

- one white ceramic main bowl
- one separate white ceramic bowl of jasmine rice
- the same wooden serving board and white tabletop language as the Green Curry photograph
- a believable view of the real The B's Club café in the softly focused background
- natural restaurant lighting and realistic food texture
- no Boba cup, coffee, other drink, drinking straw, text overlay, invented logo or person
- no kraft, paper or cardboard food container

Katsu-specific requirements:

- exactly seven small, round, breaded chicken bites
- pieces approximately 10% smaller than the earlier generated version
- Japanese curry that does not obscure the count or turn the bites into sliced cutlet pieces

Thai Basil must visibly contain sliced chicken, Thai holy basil, garlic, fresh red chilli and green beans or similar seasonal vegetables, without a curry broth. Red Curry must visibly contain sliced chicken, creamy red coconut curry, vegetables, sweet basil and fresh red chilli. The two dishes must remain immediately distinguishable. The existing Green Curry image remains unchanged. Store the new images under a new campaign version so the old kraft-bowl assets remain available for rollback.

The homepage hero currently uses a kraft-bowl Thai Basil asset. Replace that hero source with the new white-ceramic Thai Basil photograph so no prominent public food image contradicts the new serving standard. Do not modify combo-set images, because those intentionally communicate that a Boba drink is included.

## Food + Boba Catalog Change

Remove only the `thai-basil-tofu` set from:

- `menu-data.js`
- German and English visible set collections
- German and English direct-order controls
- German and English JSON-LD menu data
- set-count and pricing tests
- catalog documentation

The collection will contain six cards. Keep the existing responsive grid so desktop rows are complete and mobile remains one card per row. Keep Thai Basil Chicken and both curry tofu sets.

## Accessibility and SEO

- Update image alternative text to describe white ceramic service ware and separate jasmine rice accurately.
- Preserve one H1 per canonical page.
- Do not change titles, canonical URLs, hreflang, sitemap entries or heading semantics.
- Keep all menu prices and visible names synchronized with structured data.

## Testing and Visual QA

Follow test-driven development:

1. Add failing tests for the 2px H1 reduction, revised line heights, six-card set catalog and new image paths.
2. Confirm failures are caused by the current CSS, seven-card catalog and kraft-image paths.
3. Implement the smallest CSS, catalog, HTML and asset changes that satisfy the tests.
4. Run the complete Node test suite and Review Hub build/test suite.
5. Parse homepage and article JSON-LD and validate the deployment artifact includes every referenced image.
6. Capture and inspect the German and English homepage, both articles and Review Hub at representative desktop, tablet and mobile widths.
7. Confirm there is no heading collision, clipped text, orphaned set card, paper food container or drink in the three new meal photographs.

## Rollback

- Keep all previous campaign image files untouched.
- Work on a new branch based on the merged `main` branch.
- The existing `backup-before-pr8-2026-08-30` tag remains the full pre-menu/SEO recovery point.
- The typography and image changes will be isolated in a new pull request so they can be reverted independently.
