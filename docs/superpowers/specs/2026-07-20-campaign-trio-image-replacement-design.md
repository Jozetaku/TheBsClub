# Campaign Trio Image Replacement Design

Date: 2026-07-20
Status: Approved

## Objective

Replace the existing summer campaign trio with the user-supplied composition in which the three cups and their shadows sit farther to the right, while preserving the live BS12 promotion and every existing campaign detail.

## Asset

- Source: `C:\Users\v-bes\Downloads\จัดตำแหน่งแก้ว 3 ใบและเงา.png`
- Production target: `images/summer-drinks-campaign.webp`
- Preserve the source dimensions of 1536 × 1024.
- Convert to WebP at high visual quality and keep the production asset below the existing 450 KB test limit.
- Keep the existing filename so the foreground image and blurred background update together without HTML changes.

## Responsive Framing

- Desktop keeps the existing contained presentation and centred composition.
- At widths up to 960 px, keep `object-fit: cover` so the campaign media area remains full bleed.
- At widths up to 960 px, set the foreground image to `object-position: left center`.
- Anchoring the image left means the narrow mobile frame discards the intentional empty area on the right instead of cutting the Brown Sugar Milk Tea cup on the left.
- Do not apply this object-position rule to unrelated site images.

## Preserved Content and Behaviour

- Keep the BS12 campaign code, 12% offer, three product names, campaign prices, end date, and Get Directions CTA unchanged.
- Keep the original waffle imagery and menu content elsewhere on the page unchanged.
- Keep GA4 consent, `directions_click` tracking, opening hours, phone number, website, and CTA order unchanged.
- Do not alter the user-supplied pixels beyond WebP encoding.

## Acceptance Criteria

- The new asset loads at its natural dimensions of 1536 × 1024.
- At 390 × 844, the Brown Sugar cup is fully visible at the left and all three drinks remain clear.
- At 820 × 1180 and 1280 × 900, the trio remains balanced and no campaign copy is obscured.
- No horizontal overflow is introduced.
- The production image remains below 450 KB.
- The complete Node test suite passes.

## Verification

- Run `node --test`.
- Confirm the changed production scope is limited to the campaign image, the scoped responsive CSS rule, tests if required, and this documentation.
- Capture and inspect the campaign section at 390 × 844, 820 × 1180, and 1280 × 900.
- After deployment, verify the live page returns HTTP 200 and references the updated asset.
