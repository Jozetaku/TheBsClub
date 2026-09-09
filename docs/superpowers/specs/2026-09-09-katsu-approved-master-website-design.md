# Katsu Approved Master Website Design

## Goal

Replace the current website Katsu Curry photograph with the owner-approved reusable Katsu image.

## Approved source

Use the approved portrait derivative:

`C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/katsu-curry/Final/crispy-chicken-katsu-curry-portrait-1080x1350.jpg`

The immutable source remains `crispy-chicken-katsu-curry-master.png` in the same Final directory.

## Website change

- Export the approved portrait derivative as a 1200 × 1500 high-quality JPEG.
- Replace `images/campaign/v7/katsu-curry-natural-six.jpg` so the existing menu-card and Food + Boba references update together.
- Preserve the complete curry bowl, rice plate, coriander garnish, lighting, white table and café setting.
- Do not generate or alter food, crockery, garnish, text, logos, watermarks or background elements.
- Keep all website names, descriptions, prices, links and ordering behaviour unchanged.

## Validation and publishing

- Verify the exported file is 1200 × 1500 JPEG.
- Inspect the final website asset and confirm neither serving vessel is cropped.
- Run the full website and menu-image test suites.
- Commit and push the replacement to `main`.
- Confirm the deployed image SHA-256 matches the local website asset.

## Acceptance criteria

- The Katsu menu card and Food + Boba card both display the approved image.
- The complete curry bowl and rice plate remain visible.
- No website content or pricing changes.
- The public website serves the newly committed image bytes.
