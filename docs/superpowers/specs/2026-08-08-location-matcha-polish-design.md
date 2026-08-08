# Location and Matcha Polish Design

## Goal

Polish the launch homepage by strengthening the Interlaken location message and bringing the Matcha Latte card and custom cursor into the same premium visual system as the other drinks.

## Approved design

- Replace the awkward three-line hero phrase `Asian Café in Interlaken` with the two-line visual lockup `Asian Cafe` and `Interlaken`. The Hero uses an unaccented `E` and no slash. The SEO title, metadata, and natural-language copy retain `Asian Café Interlaken` where appropriate.
- State that The B's Club is next to Interlaken's main public car park in the quick-promise location card and the Visit section. Keep the wording factual and concise.
- Keep the approved Matcha Latte product photograph unchanged. Add a warm cream spotlight, subtle radial illumination, and a grounded shadow through the card stage so it visually belongs with the other three drink photographs.
- Restyle the existing straw-tip cursor as Matcha Latte: green matcha over milk with black pearls. Remove Brown Sugar stripes and the B mark. The straw tip remains the pointer hotspot, and native/coarse-pointer/reduced-motion fallbacks remain unchanged.
- Update the story collage so the large portrait is a tall clear-glass Iced Coffee in the existing warm alpine café scene. Reuse the existing Cappuccino photograph as the smaller overlapping image. Neither image adds generated cup branding.

## Responsive and accessibility requirements

- The hero must not overflow at desktop, tablet, or mobile widths.
- The location copy must remain readable without expanding the promise card beyond its grid.
- The custom cursor remains decorative and `aria-hidden`.
- Native cursor behavior remains available for form controls and devices without a fine hover pointer.

## Verification

- Automated content tests verify the unaccented, slash-free Hero and parking copy, reject the old `in Interlaken` Hero lockup, and retain the established SEO metadata.
- Cursor tests verify the Matcha-specific markup and retain movement, hover, click, and native fallback behavior.
- Responsive tests verify the Matcha spotlight and cursor styles exist.
- Desktop and mobile previews are inspected for overflow, hierarchy, and console warnings.
