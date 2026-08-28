# Review & Contact Hub

## Local setup

Run these commands inside `review/`:

```bash
npm ci
npm run build
npm test
npm run preview
```

The preview is available at `http://localhost:53901/`.

## Permanent QR URL

`https://www.thebsclub.ch/review/?utm_source=in_store&utm_medium=qr&utm_campaign=review_hub`

Never point printed material directly at a third-party review URL. Update platform destinations only in `src/links.mjs`, rebuild, test, and deploy; the printed QR remains valid.

The build creates both production assets from this one URL:

- `dist/assets/the-bs-club-review-qr.svg` for scalable print artwork.
- `dist/assets/the-bs-club-review-qr.png` for convenient digital use.

Do not print or distribute the production QR until the HTTPS page has been deployed, verified, and scanned successfully on physical iOS and Android devices.

## Confirmed business details

- Telephone and WhatsApp: `+41 76 774 20 27`
- Open daily: `11:00–20:00`

## Content maintenance

All platform links, business details, the permanent URL, and the three approved testimonial excerpts live in `src/links.mjs`. Make changes there, then rebuild and run the complete test suite. Keep the Google Review button as the only primary external action and continue asking for an honest review without incentives or suggested wording.
