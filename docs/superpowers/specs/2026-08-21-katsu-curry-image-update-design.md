# Crispy Chicken Katsu Curry Image Update

## Goal

Update only the food contents in the existing Crispy Chicken Katsu Curry menu image so the dish better matches the supplied real-food reference while preserving the current menu-card style.

## Visual design

- Keep the existing portrait composition, warm cream background, camera angle, lighting, kraft-paper bowl with white interior, jasmine rice, clear lid, shadows, and overall color treatment.
- Keep sliced crispy chicken katsu, but make the pieces visibly coated and mixed with Japanese curry sauce instead of resting dry on top.
- Keep potato pieces mixed through the curry.
- Remove every carrot piece.
- Do not add vegetables, garnish, text, branding, cutlery, or other props.
- Use the attached `IMG_3308.HEIC` only as a real-food reference for the chicken and curry interaction; the current website image remains the edit target and composition anchor.

## Asset and code change

- Preserve `images/campaign/v3/katsu-curry.png` unchanged.
- Save the approved result as `images/campaign/v4/katsu-curry.png` at the same 1122 x 1402 portrait dimensions.
- Change only the Crispy Chicken Katsu Curry image path in `index.html` from the v3 asset to the v4 asset.
- Keep the current alt text, card copy, price, dimensions, and lazy-loading behavior unchanged.

## Safety and verification

- Work on `codex/katsu-curry-chicken-update`, not `main`.
- Verify that the original v3 asset is byte-for-byte unchanged.
- Verify the new asset dimensions and that `index.html` references it exactly once.
- Run the repository test suite and inspect the updated menu image at desktop and mobile card sizes before publishing a Draft PR.
