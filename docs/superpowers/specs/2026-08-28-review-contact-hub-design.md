# The B's Club Review & Contact Hub Design

## Status

Approved design direction: **A — Review-first story**.

This document supersedes `2026-08-12-social-review-hub-design.md`. The earlier document proposed a separate `social.thebsclub.ch` deployment and contains obsolete telephone and opening-hour details. The approved implementation will live inside the existing main website.

## Objective

Create a fast, mobile-first page for one permanent in-store QR code. The first and clearest action is leaving an honest Google review. Guests can then read existing reviews, follow The B's Club, order food, view the menu, get directions, or contact the cafe.

The page must feel like a focused part of The B's Club website, not a generic link-list service.

## Permanent URLs

Public page:

`https://www.thebsclub.ch/review/`

Printed QR destination:

`https://www.thebsclub.ch/review/?utm_source=in_store&utm_medium=qr&utm_campaign=review_hub`

The printed QR always points to the owned `/review/` page. Individual platform links may change without requiring a new printed QR.

## Confirmed business details

- Public telephone and WhatsApp: `+41 76 774 20 27`
- Telephone link: `tel:+41767742027`
- WhatsApp link: `https://wa.me/41767742027`
- Email: `bublee.interlaken@gmail.com`
- Address: `Jungfraustrasse 46, 3800 Interlaken, Switzerland`
- Opening hours: `Open daily · 11:00–20:00`

The implementation must replace the old public telephone `+41 76 226 27 22` and closing time `19:00` throughout the main website, localized article pages, metadata, tests, and any customer-facing structured data where they occur. The opening time remains `11:00`.

## Verified destination inventory

All destinations must be defined once in a small configuration module and rendered from that source.

- Google review: `https://g.page/r/CY7fuiiFPSvJEAE/review`
- Google listing and reviews: `https://www.google.com/maps/search/?api=1&query=The+B%27s+Club+Interlaken&query_place_id=ChIJya5KW-ylj0cRjt-6KIU9K8k`
- Directions: `https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken`
- Instagram: `https://www.instagram.com/thebsclub25/`
- Facebook: `https://www.facebook.com/profile.php?id=100071619350267`
- Tripadvisor: `https://www.tripadvisor.com/Restaurant_Review-g188081-d25277432-Reviews-Bublee_Tea_Interlaken-Interlaken_Bernese_Oberland_Canton_of_Bern.html`
- Uber Eats: `https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ`
- Menu: `https://www.thebsclub.ch/#food`
- Order/contact form: `https://www.thebsclub.ch/#order`
- Main website: `https://www.thebsclub.ch/`
- Telephone: `tel:+41767742027`
- WhatsApp: `https://wa.me/41767742027`
- Email: `mailto:bublee.interlaken@gmail.com`
- Permanent share URL: `https://www.thebsclub.ch/review/`

Do not add unverified directory profiles or platforms that The B's Club does not control.

## Experience hierarchy

The page has one primary outcome and four decreasing levels of emphasis:

1. Leave an honest Google review.
2. See authentic guest comments and read more reviews on Google or Tripadvisor.
3. Follow on Instagram or Facebook.
4. Order, view the menu, get directions, or contact The B's Club.

Google Review is the only visually primary external action. No other button may compete with it in colour, scale, or position.

## Page structure

### 1. Compact brand header

- Use the current official mountain logo without modification.
- Label: `THE B'S CLUB · INTERLAKEN`.
- Do not load the full homepage navigation.

### 2. Review-first welcome

Headline:

`How was your visit?`

Supporting copy:

`Your honest review helps our independent cafe in Interlaken grow.`

The wording invites all genuine customers. It must not imply that only positive feedback is welcome.

### 3. Primary Google Review action

Large gold action:

`★★★★★  Review us on Google`

Supporting line:

`Share your honest experience.`

The button opens the confirmed direct Google review URL in a new tab. It remains inside the first mobile viewport at common 360–430 px widths.

### 4. Authentic social proof

Use the same three owner-approved excerpts already published on the homepage:

1. Ankita S. · Google review — `The bubble tea was amazing—refreshing, perfectly sweet, and the pearls had the ideal chewy texture.`
2. Traveller · Tripadvisor — `I stayed in Interlaken for four days and tried their teas every day—authentic taste and reasonably priced.`
3. Jennylynn B. · Google review — `The best bubble tea I've ever had. Very nice and friendly service. Highly recommend!`

Present the first excerpt immediately below the primary action. The remaining two may appear as a compact continuation. Attribute every excerpt to its platform and do not edit wording in a way that changes meaning.

The testimonials demonstrate that other guests have shared experiences; they must not be labelled as templates and the page must not ask new reviewers to copy them.

### 5. Read and follow

Use a compact two-column grid on mobile and four columns when space permits:

- Google — `Read Google reviews`
- Tripadvisor — `Read or review`
- Instagram — `@thebsclub25`
- Facebook — `Follow us`

Use accessible platform labels and restrained monochrome SVG icons. Do not depend on remote icon packages.

### 6. Order and contact

Provide clear actions for:

- View menu
- Order on Uber Eats
- Pre-order/contact form
- WhatsApp
- Call
- Email
- Directions
- Visit the main website

WhatsApp, Call, and Email remain separate actions even though the public telephone and WhatsApp number are now the same.

### 7. Business trust block

Display:

- `Jungfraustrasse 46, 3800 Interlaken`
- `Open daily · 11:00–20:00`
- `Thank you for supporting an independent cafe.`

Do not display ratings or review counts unless they are fetched from a maintainable first-party source or manually re-verified at publication time. The three attributed excerpts are sufficient social proof for version one.

### 8. Share this page

Near the bottom, include:

- A QR preview encoding the permanent tracked URL.
- `Download QR` for an SVG and high-resolution PNG.
- Native Share when available.
- Copy-link fallback.
- The permanent URL as selectable text if copying fails.

The QR must never encode the Google review URL directly.

## Visual direction

Continue the approved The B's Club brand identity:

- Deep forest: `#123F35`
- Warm cream: `#FFF8E9`
- Golden yellow: `#EFCF62`
- Coral: `#EF725D`
- Soft ink: `#35564F`
- Existing display and body typography
- Current official logo only

The signature element is the gold Google Review action, treated like a tactile cafe receipt stamp with a restrained double edge or offset shadow. Surround it with disciplined negative space. Testimonials and secondary actions remain quiet so the hierarchy is unmistakable.

Do not introduce new mascots, alternate logos, unrelated gradients, or decorative assets. Respect the approved website identity.

## Responsive and accessibility requirements

- Design first for 360–430 px phones used at the table or counter.
- No horizontal scrolling at 320 px.
- Minimum interactive target: 48 px.
- Primary review action visible in the first viewport on common phones.
- One logical heading hierarchy.
- Visible keyboard focus.
- Sufficient text and control contrast.
- Platform icon meaning duplicated in accessible text.
- Respect `prefers-reduced-motion`.
- Standard anchors remain functional without JavaScript.

## Architecture

Create a self-contained route inside the existing static website:

- `/review/index.html`
- `/review/review.css`
- `/review/review.mjs`
- `/review/links.mjs`
- `/review/assets/qr-review-hub.svg`
- `/review/assets/qr-review-hub.png`

The page may reuse existing local brand assets and global tokens, but must not load the homepage DOM or its full interaction bundle.

The `links.mjs` module is the single source of truth for external destinations and business contact details. Updating a platform URL must not require editing multiple markup locations.

## Measurement and privacy

With analytics consent, record aggregate actions only:

- QR landing/page view
- Google review click
- Google reviews click
- Tripadvisor click
- Instagram click
- Facebook click
- Menu click
- Uber Eats click
- Order/contact click
- WhatsApp click
- Telephone click
- Email click
- Directions click
- QR download
- Native share or copy-link action

Use the existing consent-mode approach. Keep advertising storage denied. Do not install Meta Pixel, TikTok Pixel, fingerprinting, review widgets that leak visitor data, or scripts that collect review content.

## Review-policy safeguards

- Ask for an honest review from any genuine customer.
- Do not offer discounts, gifts, rewards, or entry into a draw for reviews.
- Do not ask for a particular star rating.
- Do not request specific phrases, staff names, products, or keywords.
- Do not show a satisfaction question that sends only happy customers to Google.
- Do not discourage or hide negative feedback.
- Do not describe existing testimonials as examples to copy.

The owner-approved positive excerpts may be shown as social proof, provided they remain accurately attributed and separate from the review-writing instruction.

## SEO and metadata

- Title: `Review & Contact The B's Club | Interlaken`
- Meta description: `Review The B's Club on Google, read guest reviews, follow us, view the menu, order food, get directions or contact our Interlaken cafe.`
- Canonical: `https://www.thebsclub.ch/review/`
- Include `CafeOrCoffeeShop` structured data using the confirmed address, public telephone, opening hours, website, and social profiles.
- Do not target the homepage's main local-search keywords or duplicate long homepage sections.

## Failure behaviour

- Without JavaScript, all external links remain standard anchors.
- If native share is unavailable, copy the permanent URL.
- If clipboard access fails, reveal the URL for manual selection.
- If QR artwork fails, show the permanent URL.
- External web links use `target="_blank"` and `rel="noopener noreferrer"`.
- Telephone and email links use their native schemes without forcing a new tab.
- No external action occurs automatically.

## Testing and acceptance criteria

Automated checks must prove:

- The direct Google review URL is configured exactly once.
- Every approved destination and business detail comes from the central configuration.
- Google Review is the only primary external CTA.
- The QR SVG and PNG encode the same permanent tracked URL.
- The public telephone is `+41 76 774 20 27` throughout the site.
- Public opening hours are `11:00–20:00` throughout the site.
- Every external web link has safe new-tab attributes.
- The page contains no incentive, sentiment gate, requested star rating, or requested review wording.
- Title, description, canonical, structured data, accessible labels, focus styles, and reduced-motion rules exist.
- The main homepage, articles, cursor, logo, ordering form, and other existing functionality remain intact.

Manual checks must cover:

- 320 px, 390 px, tablet, laptop, and desktop layouts.
- The primary CTA position in the first mobile viewport.
- Keyboard and screen-reader navigation.
- Google review, Google listing, social, order, and contact destinations.
- QR scanning on iOS and Android after the production page is live over HTTPS.
- Analytics events only after consent.

## Deployment and QR release

- Build and inspect locally first.
- Deploy through the existing main-site GitHub Pages workflow after owner approval.
- Verify `https://www.thebsclub.ch/review/` and every destination on production.
- Only then generate the final print files and test the QR on both iOS and Android.
- Keep the previous successful site deployment available for rollback.

## Out of scope for version one

- Live review API or embedded third-party review widget.
- Review incentives or automated follow-up campaigns.
- Separate `social.thebsclub.ch` hosting or DNS changes.
- Customer accounts, forms that store feedback, or a review moderation dashboard.
- Unverified directory profiles.
