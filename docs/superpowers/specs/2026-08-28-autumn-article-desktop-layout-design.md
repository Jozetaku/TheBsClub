# Autumn Interlaken Desktop Layout Design

## Objective

Refine the bilingual Autumn Interlaken article so its desktop composition remains balanced on common laptop and monitor viewports. Preserve the approved The B brand identity, artwork, copy, logo, navigation, custom cursor, interactions, tracking, and mobile presentation.

## Root Cause

The two-column journey layout currently begins at `1200px` viewport width, but its map rail becomes sticky only when the viewport is also at least `980px` tall. On common laptop screens such as 1366×768 and 1440×900, the map remains static while the six-destination column continues for about 5,100px. This leaves more than 4,000px of empty space in the left column.

The desktop destination grid also reserves `62px` for odd numbers and `96px` for even numbers. Although this prevents clipping, it gives alternating destinations different copy widths and produces inconsistent heading wrapping.

## Selected Direction: Adaptive Editorial Rail

### Journey layout

- Use the two-column map-and-destinations composition only when the viewport is at least `1200px` wide and `700px` tall.
- Within that range, keep the map rail sticky and size its map artwork from viewport height rather than width alone.
- Use a compact desktop rail with `28px` top padding, `24px` bottom padding, an `18px` heading-to-map gap, and a map height of `clamp(340px, 52vh, 500px)`.
- Set the sticky offset to `clamp(76px, 8vh, 94px)` so the rail clears the fixed site header without wasting laptop-height space.
- The complete sticky rail must fit inside the viewport below the fixed site header at the tested 1366×768, 1440×900, 1440×1000, and 1920×1080 sizes.
- For wide but unusually short viewports below `700px`, fall back to the existing single-column flow. This avoids a sticky element taller than the usable viewport and removes the possibility of an empty left column.
- Keep the map artwork, hotspots, labels, links, active states, and keyboard behavior unchanged.

### Destination rhythm

- Reserve the same `96px` number track for odd and even destinations on the two-column desktop layout and use an `80px` desktop number size. Browser glyph measurement showed that the widest Fraunces pair needs about `94.4px`; this combination prevents painted text from overflowing its track.
- Keep the approved alternating number placement, but give the copy track equal width in both directions.
- Retain the gold Fraunces numbering and all existing content.
- Reduce desktop destination vertical padding from `104px` to `86px` so the sequence remains editorial but does not feel stretched.

### Page spacing

- Set desktop hero padding to `clamp(68px, 7vw, 104px)` on top and `clamp(74px, 7.5vw, 112px)` on the bottom while preserving its typographic scale and decorative circle.
- Set shared desktop article-section padding to `clamp(76px, 7vw, 104px)` instead of the current `clamp(86px, 8vw, 122px)`.
- Reduce the Travel Packs heading gap from `52px` to `44px` and FAQ row padding from `31px` to `26px`; do not remove content or collapse the FAQ.
- Do not alter the established mobile rules at `820px` and below.

## Brand and Content Guardrails

The following must remain unchanged:

- The official `/images/logo-official.png` header and footer logo.
- The current dark green, cream, coral, and gold palette.
- Fraunces display typography and DM Sans body typography.
- The illustrated Interlaken map and all product photography.
- English and German article copy, destinations, travel packs, factual sources, and SEO metadata.
- The custom boba cursor, site navigation, analytics attributes, CTAs, and language switch.

## Responsive Behaviour

- **1200px wide and at least 700px tall:** adaptive two-column rail with sticky map.
- **821–1199px wide:** existing single-column editorial flow.
- **1200px or wider but below 700px tall:** single-column fallback.
- **820px and below:** existing tablet/mobile composition and number alignment.

## Verification

Automated regression tests must first fail against the current CSS and then pass after implementation. They will assert:

- The two-column desktop journey layout and sticky rail share the same width-and-height media condition.
- The old `min-height: 980px` sticky threshold is removed.
- Odd and even desktop destination grids use equal `96px` number tracks with `80px` number type.
- Desktop spacing values are reduced without changing mobile rules.

Browser verification will cover both English and German pages at:

- 1366×768
- 1440×900
- 1440×1000
- 1920×1080
- 820×900
- 390×844

At every size, the page must have no horizontal overflow, clipped numbers, map overlap, header collision, or large empty journey column. The logo and custom cursor must remain visible and functional.

## Out of Scope

- Rewriting or shortening article content.
- Replacing imagery, typography, colours, logo, or cursor.
- Changing product availability or travel-pack data.
- Redesigning the global header, footer, or mobile navigation.
