# The B's Club Social & Review Hub Design

## Objective

Create a fast, mobile-first microsite for a single permanent in-store QR code. The page helps satisfied guests leave a Google review first, then reach the restaurant's other verified social, location, menu, review, and ordering destinations.

The public address will be:

`https://social.thebsclub.ch/`

The printed QR destination will be:

`https://social.thebsclub.ch/?utm_source=in_store&utm_medium=qr&utm_campaign=social_hub`

The QR destination must remain stable even when individual social or review links change.

## Experience priority

The page has one primary outcome: encourage an authentic Google review from a guest who has chosen to scan the in-store QR code.

The hierarchy is:

1. **Review us on Google** — the only primary button.
2. **Get directions**, **Instagram**, **Facebook**, and **Tripadvisor** — compact secondary actions.
3. **View menu**, **Order on Uber Eats**, and **Visit our website** — utility links below the social actions.

The page must not offer discounts, rewards, gifts, or other incentives in exchange for reviews. It must not ask only happy customers for reviews or filter guests by sentiment.

## Verified destinations

Use these existing destinations:

- Main website: `https://www.thebsclub.ch/`
- Menu: `https://www.thebsclub.ch/#food`
- Google Maps fallback: `https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken`
- Instagram: `https://www.instagram.com/thebsclub25/`
- Facebook: `https://www.facebook.com/profile.php?id=100071619350267`
- Tripadvisor: `https://www.tripadvisor.com/Restaurant_Review-g188081-d25277432-Reviews-Bublee_Tea_Interlaken-Interlaken_Bernese_Oberland_Canton_of_Bern.html`
- Uber Eats: `https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ`
- Telephone: `tel:+41762262722`

The exact Google Business Profile “Ask for reviews” URL is not yet available. Until the owner supplies it, the Google Review button must use the verified Google Maps fallback and be implemented through a single configurable link value. Replacing that value later must not change the public social-hub URL or printed QR code.

Do not link to third-party directory profiles with stale opening hours, phone numbers, or uncontrolled business data.

## Page structure

### 1. Brand header

- Official mountain logo centered at the top.
- Compact label: `THE B'S CLUB · INTERLAKEN`.
- No full navigation bar; the page is a focused action surface rather than a second homepage.

### 2. Welcome block

Headline:

`Enjoyed your visit?`

Supporting copy:

`Your review helps an independent café in Interlaken grow.`

The language is warm and direct without pressuring the guest or implying that only positive reviews are wanted.

### 3. Primary review action

Large full-width button:

`★★★★★  Review us on Google`

Supporting microcopy:

`Share your honest experience.`

The button opens a new tab. Until the direct review link is supplied, it opens the verified Google Maps listing search for the address.

### 4. Secondary social and location grid

Two-column mobile grid, expanding to four columns on wider screens:

- Google Maps — `Find us`
- Instagram — `@thebsclub25`
- Facebook — `Follow us`
- Tripadvisor — `Review or read reviews`

Use clean, recognizable monochrome SVG marks or short platform initials. Do not use emoji as platform icons.

### 5. Utility actions

Quiet text-link row:

- View menu
- Order on Uber Eats
- Visit thebsclub.ch
- Call us

### 6. Trust footer

Display only confirmed business information:

- `Jungfraustrasse 46, 3800 Interlaken`
- `Open daily · 11:00–19:00`
- `Thank you for supporting a local café.`

Include a compact official logo and copyright line.

### 7. On-page QR card

Include a downloadable QR image near the bottom for staff, partners, and customers who share the page from another screen. It must encode the permanent tracked social-hub URL, not any third-party destination.

Label:

`Share this page`

Actions:

- `Download QR`
- Native `Share` when supported; otherwise copy the permanent URL.

## Visual direction

Continue the website's professional Elegant Product Theatre system, simplified for a conversion page:

- Deep forest: `#123F35`
- Warm cream: `#FFF8E9`
- Golden yellow: `#EFCF62`
- Coral: `#EF725D`
- Soft ink: `#35564F`

Use the official mountain logo only. Do not put logos on cups. Mini Makers and ladders remain paused.

The memorable device is a large gold review button framed like a physical café receipt stamp, with disciplined negative space around it. The rest of the page remains quiet so the primary action is unmistakable.

Typography follows the existing website assets and tokens. Do not introduce remote font or icon dependencies solely for this page.

## Responsive behaviour

- Design first for 360–430 px mobile widths because most visitors arrive by scanning at the table or counter.
- Keep the primary CTA visible within the first viewport on common phones.
- Minimum interactive target height: 48 px.
- Provide visible keyboard focus and sufficient colour contrast.
- Respect `prefers-reduced-motion`.
- No horizontal scrolling at 320 px.

## Architecture and hosting

The social hub is a standalone static microsite with its own HTML, CSS, JavaScript, images, QR asset, tests, and deployment boundary. It must not reuse the main homepage DOM or load the full homepage bundle.

Recommended source location during development:

`social-site/`

Recommended production architecture:

1. Publish `social-site/` as a separate static hosting project or separate GitHub Pages repository.
2. Configure the custom domain `social.thebsclub.ch` on that deployment.
3. Add a DNS CNAME for `social` pointing to the hosting provider's assigned hostname.
4. Verify HTTPS before printing or distributing the QR code.

Do not point `social.thebsclub.ch` at the existing main GitHub Pages deployment without a verified routing layer. The current homepage deployment and `thebsclub.ch` custom domain must remain unchanged.

DNS and hosting changes require explicit owner approval at deployment time.

## Link configuration

All external destinations live in one small configuration object. UI components read from that object instead of duplicating URLs in the markup.

Required keys:

- `googleReview`
- `googleMaps`
- `instagram`
- `facebook`
- `tripadvisor`
- `menu`
- `uberEats`
- `website`
- `phone`
- `permanentShareUrl`

The initial `googleReview` value equals the verified Google Maps fallback. When the owner provides the Google “Ask for reviews” URL, only this value changes.

## Measurement and privacy

Track only aggregate actions needed to evaluate the QR page:

- Page view / QR landing
- Google review click
- Google Maps click
- Instagram click
- Facebook click
- Tripadvisor click
- Menu click
- Uber Eats click
- Website click
- QR download
- Share/copy action

Use the existing privacy-conscious analytics approach and keep advertising storage disabled. Do not use fingerprinting, cross-site pixels, or collect review content.

Campaign query parameters may be recorded as aggregate source labels. Do not display them or forward unnecessary parameters to social platforms.

## Failure and fallback behaviour

- If JavaScript is unavailable, all destination links still work as standard anchors.
- If native sharing is unsupported, copy the permanent URL and show a short confirmation.
- If copying fails, display the permanent URL for manual selection.
- If the QR image fails to load, the permanent URL remains visible as text.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- No platform action occurs automatically; the visitor always chooses a button.

## SEO and indexing

The microsite is useful primarily as a QR landing page, not as a replacement for the main local-search page.

- Title: `Review & Follow The B's Club | Interlaken`
- Meta description: `Review The B's Club on Google, follow us on Instagram and Facebook, find us in Interlaken, view the menu or order online.`
- Canonical: `https://social.thebsclub.ch/`
- Include `Organization`/`CafeOrCoffeeShop` structured data using the same confirmed name, address, telephone, website, and social profiles as the main site.
- Avoid copying long homepage sections or competing with the main website for “Asian café Interlaken” search intent.
- Include a clear link back to `https://www.thebsclub.ch/`.

## QR production requirements

- Encode the HTTPS permanent tracked URL exactly.
- Use high error correction suitable for a printed counter sign.
- Maintain a proper quiet zone.
- Produce SVG for print and PNG for convenient digital use.
- Test the final QR with both iOS and Android after the production subdomain and HTTPS are live.
- Do not print the production QR before the deployed URL has been verified.

## Testing and acceptance criteria

Automated checks must verify:

- Every required destination exists once in the configuration.
- Google Review is the only visually primary external CTA.
- The Google Review destination can be swapped without changing the permanent social-hub URL.
- Every external link uses safe new-tab attributes.
- Confirmed address, phone, and current hours are displayed.
- QR SVG and PNG encode the same permanent URL.
- The page has a title, description, canonical URL, structured data, accessible headings, labels, focus styles, and reduced-motion rules.
- No unverified platform, stale directory, review incentive, sentiment filtering, or invented business claim appears.

Manual checks must cover:

- 320 px, 390 px, tablet, and desktop layouts.
- iOS and Android QR scanning after production HTTPS is active.
- Keyboard navigation and screen-reader names.
- Direct Google review flow once the owner supplies the official link.
- Analytics events without advertising cookies.

## Change control and rollback

- Build and review locally before any deployment.
- Keep the social hub deployment independent from the main website.
- Do not change DNS, custom domains, or GitHub Pages settings without explicit approval.
- Keep the previous successful deployment available for rollback.
- Updating a platform destination must not require regenerating the printed QR code.
