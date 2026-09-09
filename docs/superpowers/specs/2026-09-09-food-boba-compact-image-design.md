# Food + Boba Compact Image Design

## Goal

Reduce the visual height of the Food + Boba section so more menu items are visible without changing its products, copy, pricing or ordering behaviour.

## Approved interim change

- Change only Food + Boba card images from portrait `4 / 5` to landscape `4 / 3`.
- Match the image aspect ratio used by the main Asian meal cards above.
- Keep `object-fit: cover` and centre each dish safely within the frame.
- Apply the change to all six Food + Boba cards in both German and English through the shared stylesheet.
- Keep Sandwich Set card images at `4 / 5`.
- Preserve card text, badges, prices, buttons, filtering, links and grid breakpoints.

## CSS boundary

The existing rule groups `.food-combo-card img` and `.sandwich-set-card img`. Split the selectors so Food + Boba receives `aspect-ratio: 4 / 3` while Sandwich Sets retain `aspect-ratio: 4 / 5`. Avoid HTML changes unless a test demonstrates that they are required.

## Responsive behaviour

- Desktop remains a three-column Food + Boba grid.
- Medium screens remain a two-column grid.
- Small screens remain a single-column grid.
- The image ratio stays `4 / 3` at every breakpoint.

## Validation

- Add a CSS contract test proving the Food + Boba and Sandwich image ratios are independent.
- Run the complete website test suite.
- Inspect desktop and mobile layouts and confirm food remains recognisable without excessive cropping.
- Verify the public website after deployment.

## Deferred work

A broader Compact Menu redesign that displays more items and more complete menu information will be scoped separately after this interim change. It may revise card density, typography, copy length, filters and responsive layout; none of those changes are part of this implementation.

## Acceptance criteria

- Food + Boba images render at `4:3` and the section is materially shorter.
- Sandwich Set images remain `4:5`.
- All six Food + Boba cards and their actions remain present.
- No copy, price, product or ordering behaviour changes.
