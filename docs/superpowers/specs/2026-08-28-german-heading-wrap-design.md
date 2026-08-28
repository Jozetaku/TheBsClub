# German Article Heading Wrap Design

## Objective

Remove three single-word second-line orphans from the German Autumn Interlaken article while preserving the approved wording, English article, visual identity, responsive layout, logo, cursor, and article behaviour.

## Selected Direction

Use semantic German-only line-group spans inside the three affected headings. Display each group as a block above `820px`, and return the spans to normal inline flow at `820px` and below so narrow screens can wrap naturally.

The approved desktop groups are:

- `Sechs Stationen` / `ab The B`
- `Höhematte: Platz lassen` / `auf der Wiese`
- `Harder Kulm: zuerst` / `die Rückfahrt klären`

## Implementation Contract

- Add the class `de-heading-line` to exactly two spans inside each affected German `h2`.
- Preserve each heading's complete visible text and existing `id` attribute.
- Add `.de-heading-line { display: block; }` to the shared article stylesheet.
- Inside the existing `@media (max-width: 820px)` block, set `.de-heading-line { display: inline; }`.
- Add a normal inter-span space in the HTML so the complete text remains correct when the spans are inline.
- Do not add these spans to the English article.
- Do not change heading font size, container width, grid proportions, article copy, or SEO metadata.

## Verification

- A focused content test must fail before implementation and then assert the exact two line groups for all three German headings.
- The test must assert that the English article contains no `de-heading-line` class.
- The CSS test must assert block display by default and inline display at `max-width: 820px`.
- Browser verification must cover the German article at 1440×900, 1920×900, and 390×844.
- Desktop verification must show two balanced lines for each affected heading with no single-word second line.
- Mobile verification must show natural wrapping, no horizontal overflow, and no clipped heading text.

## Out of Scope

- Rewriting or translating the headings.
- Changing any other German or English heading.
- Changing the article map, destination numbering, spacing system, logo, cursor, or navigation.
