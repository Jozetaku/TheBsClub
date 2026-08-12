# Real Café Photo Update

## Goal

Replace the large generated iced-coffee image in the existing Our Story collage with one authentic photograph of The B's Club interior. Keep the smaller Cappuccino image unchanged.

## Approved layout

- Use `Photo 1.jpg` as the large `.story-photo-one` image.
- Keep `images/signature-latte.jpg` as the smaller overlapping `.story-photo-two` image.
- Preserve the existing collage structure, roundel, story copy, section order, and responsive behaviour.
- Crop the interior photograph with CSS `object-fit: cover`, favouring the seating area, counter, and window view rather than the foreground table edge.
- Do not add a new gallery or a second interior photograph in this revision.

## Image delivery

- Copy the supplied 278 KB JPEG into `images/` without recompressing it; it is already suitably optimized for this lazy-loaded story image.
- Keep the source photograph outside the production website assets.
- Use explicit image dimensions, lazy loading, asynchronous decoding, and truthful local-business alt text.

## Quality checks

- Automated test confirms that Our Story uses the new interior JPEG as `.story-photo-one` and retains the Cappuccino as `.story-photo-two`.
- Existing full test suite remains green.
- Inspect desktop and mobile crops before requesting approval to commit or deploy.

## Change control

- Do not commit or deploy until the owner reviews the website preview.
- Do not modify existing unrelated or untracked files.
