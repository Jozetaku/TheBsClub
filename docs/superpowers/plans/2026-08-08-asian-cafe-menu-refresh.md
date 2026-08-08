# The B’s Club Asian Café Menu Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing The B’s Club landing page as an Asian Café website for the 15 August 2026 food launch, with equal food-and-drink emphasis, Mini Makers hero art, a branded Bubble Tea cursor and accurate local SEO.

**Architecture:** Keep the existing static HTML/CSS/JavaScript site. Put indexable menu and business content directly in `index.html`, keep the existing general interactions and analytics in `script.js`, and isolate the custom pointer in a new `cursor.js` file so it can fail independently without affecting navigation, consent or menu access. Use CSS-drawn Mini Makers and menu illustrations until genuine dish photography is supplied; do not publish AI food imagery as if it depicts the served dishes.

**Tech Stack:** Semantic HTML5, modern CSS, vanilla JavaScript, JSON-LD, Node.js built-in test runner (`node:test`), no build step and no new runtime dependencies.

## Global Constraints

- Launch message: `New Asian Food · From 15 August`.
- Opening hours everywhere: `11:00–21:00`, every day.
- Primary brand: `The B’s Club — Asian Café Interlaken`.
- Hero line: `Eat bold. Sip happy.`
- Food and Bubble Tea/Matcha/Coffee receive equal visual priority.
- English remains primary; German is limited to concise labels such as `Speisekarte` and `Täglich geöffnet`.
- Tofu dishes are labelled `Tofu option` only until the supplier verifies every ingredient.
- Do not publish `Vegetarian`, `Vegan`, `Vegetarisch`, `plant-based` or equivalent dietary claims before verification.
- The full official mountain logo belongs in the header and footer, not on the cursor cup.
- The cursor cup retains the simplified `B` badge, two straight Brown Sugar lines down to the bottom and the straw-tip hotspot.
- The Mini Makers ladder scene is a permanent hero signature and must survive responsive simplification.
- Touch/coarse-pointer devices and reduced-motion users receive safe native fallbacks.
- Retain GA4 consent mode, privacy settings, directions tracking, reviews, story and Thai London Therapy partner content.
- No framework migration, online ordering system, booking system or new dependency.

---

## File Structure

- Modify: `index.html` — metadata, JSON-LD, semantic page structure, official logo, Asian food menu, Mini Makers markup and cursor element.
- Modify: `styles.css` — Bold Asian Club tokens, responsive page design, Mini Makers illustration/motion and cursor appearance.
- Modify: `script.js` — retain current navigation, reveals, menu dialog, consent and directions tracking; update only selectors or content needed by the new markup.
- Create: `cursor.js` — fine-pointer detection, straw-tip positioning, hover/click states, reduced-motion and native-control exclusions.
- Create: `images/logo-official.png` — owner-supplied official mountain-and-wordmark PNG.
- Modify: `README.md` — current positioning, launch menu and 11:00–21:00 operating hours.
- Modify: `tests/site-content.test.mjs` — business details, metadata, JSON-LD, retained analytics surfaces and removed expired campaign assertions.
- Create: `tests/asian-menu.test.mjs` — semantic menu, exact prices, English/German labels and dietary-safety contract.
- Create: `tests/mini-makers.test.mjs` — hero signature, decorative semantics, motion fallback and mobile reduction contract.
- Create: `tests/boba-cursor.test.mjs` — pointer capability, straw hotspot, hover/click, cleanup and native fallback behaviour.
- Create: `tests/responsive-design.test.mjs` — CSS contracts for the approved desktop, tablet, mobile and reduced-motion treatments.

---

### Task 1: Lock Business Details, Launch Copy and SEO Metadata

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html:4-58`
- Modify: `index.html:63-69`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing canonical URL, telephone, GA4 bootstrap and directions tracking attributes.
- Produces: one canonical business-content contract used by every later task: Asian Café positioning, 15 August launch and daily 11:00–21:00 hours.

- [ ] **Step 1: Update the business-detail test so the old site fails**

Replace the first two tests in `tests/site-content.test.mjs` and add the metadata test:

```js
test('uses the confirmed website, hours, phone and launch date everywhere', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/thebsclub\.ch\/">/);
  assert.match(html, /"url": "https:\/\/thebsclub\.ch\/"/);
  assert.doesNotMatch(html, /https:\/\/www\.thebsclub\.ch/);
  assert.doesNotMatch(html, /11:00[–-]19:00|"closes": "19:00"/);
  assert.match(html, /11:00[–-]21:00/);
  assert.match(html, /"closes": "21:00"/);
  assert.match(html, /From 15 August/);
  assert.match(html, /tel:\+41762262722/);
  assert.match(html, /\+41 76 226 27 22/);
});

test('keeps repository launch notes aligned with confirmed details', () => {
  assert.match(readme, /Asian Café/);
  assert.match(readme, /15 August 2026/);
  assert.match(readme, /Every day: `11:00[–-]21:00`/);
  assert.match(readme, /\+41 76 226 27 22/);
});

test('positions the site as an Asian Café in Interlaken', () => {
  assert.match(html, /<title>The B's Club \| Asian Café &amp; Bubble Tea Interlaken<\/title>/);
  assert.match(html, /<h1>\s*Asian Food &amp; Bubble Tea\s*<span>in Interlaken<\/span>\s*<\/h1>/);
  assert.match(html, /Eat bold\./);
  assert.match(html, /Sip happy\./);
});

test('puts the Asian food menu first while retaining directions and ordering paths', () => {
  const heroActions = html.match(/<div class="hero-actions">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const mobileActions = html.match(/<div class="mobile-actions"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? '';
  assert.match(heroActions, /^\s*<a[^>]*href="#food"[^>]*>Explore food \+ drinks/);
  assert.match(heroActions, /data-cta="directions"/);
  assert.match(heroActions, /https:\/\/www\.ubereats\.com\/ch\/store\/bublee-interlaken\/Ik4zv95aWhWzt0lYSbjaMQ/);
  assert.match(mobileActions, /^\s*<a[^>]*data-cta="directions"[^>]*>Directions/);
  assert.match(mobileActions, /data-menu="bubble"/);
  assert.match(mobileActions, />Uber Eats/);
});
```

Remove the superseded test named `puts directions first and retains menu and Uber Eats paths`; the replacement above reflects the approved launch hierarchy.

- [ ] **Step 2: Run the focused test and confirm the existing page fails**

Run:

```powershell
node --test tests/site-content.test.mjs
```

Expected: FAIL on the 19:00 hours, old coffee/brunch title, missing Asian Café README text and missing 15 August launch message.

- [ ] **Step 3: Update metadata, JSON-LD, global launch copy and README**

Use these exact metadata values in `index.html`:

```html
<title>The B's Club | Asian Café &amp; Bubble Tea Interlaken</title>
<meta name="description" content="Asian food, Thai curry, bubble tea, matcha and coffee at The B's Club in central Interlaken. Open daily, 11:00–21:00.">
<meta name="theme-color" content="#173f34">
<meta property="og:type" content="restaurant">
<meta property="og:title" content="The B's Club — Asian Café Interlaken">
<meta property="og:description" content="Eat bold. Sip happy. Asian café favourites and colourful drinks in central Interlaken.">
```

Replace the JSON-LD business fields with:

```json
"@type": ["CafeOrCoffeeShop", "Restaurant"],
"name": "The B's Club",
"url": "https://thebsclub.ch/",
"telephone": "+41762262722",
"image": "https://thebsclub.ch/images/brown-sugar-milk-tea.jpg",
"priceRange": "CHF",
"servesCuisine": ["Asian", "Thai", "Bubble Tea", "Coffee"],
"hasMenu": "https://thebsclub.ch/#food",
"address": {
  "@type": "PostalAddress",
  "streetAddress": "Jungfraustrasse 46",
  "postalCode": "3800",
  "addressLocality": "Interlaken",
  "addressCountry": "CH"
},
"openingHoursSpecification": [{
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  "opens": "11:00",
  "closes": "21:00"
}]
```

Replace the expired July promo bar with:

```html
<div class="promo-bar">
  <p><strong>New Asian Food</strong> · From 15 August · Open daily 11:00–21:00</p>
  <a href="#food">View Speisekarte <span aria-hidden="true">↓</span></a>
</div>
```

Replace the hero text column with this content contract; Task 4 will add the approved decorative scene beside it:

```html
<div class="hero-copy reveal">
  <p class="eyebrow eyebrow-light"><span></span> Asian Café · Central Interlaken</p>
  <h1>Asian Food &amp; Bubble Tea <span>in Interlaken</span></h1>
  <p class="hero-tagline"><strong>Eat bold.</strong> <em>Sip happy.</em></p>
  <p class="hero-lead">Fresh Asian favourites and colourful café drinks — carefully made for lunch, an afternoon pause or an easy evening meal.</p>
  <div class="hero-actions">
    <a class="button" href="#food">Explore food + drinks <span aria-hidden="true">↓</span></a>
    <a class="text-link" href="https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken" target="_blank" rel="noopener" data-cta="directions" data-cta-location="hero">Get Directions <span aria-hidden="true">↗</span></a>
    <a class="text-link" href="https://www.ubereats.com/ch/store/bublee-interlaken/Ik4zv95aWhWzt0lYSbjaMQ" target="_blank" rel="noopener">Order on Uber Eats <span aria-hidden="true">↗</span></a>
  </div>
</div>
```

Update `README.md` to describe an Asian Café landing page, add `Launch target: 15 August 2026`, and change the confirmed hours line to `Every day: 11:00–21:00`.

In the visible page, replace both the hero trust-row hours and Visit-section hours with `11:00–21:00`. Search `index.html` and `README.md` for `19:00` after editing; no occurrence may remain.

- [ ] **Step 4: Run the focused test**

Run:

```powershell
node --test tests/site-content.test.mjs
```

Expected: PASS, including the unchanged consent, tracking and canonical assertions.

- [ ] **Step 5: Commit the business-content contract**

```powershell
git add index.html README.md tests/site-content.test.mjs
git commit -m "feat: reposition site as Asian cafe"
```

---

### Task 2: Build the Semantic Food-and-Drink Homepage

**Files:**
- Create: `images/logo-official.png`
- Create: `tests/asian-menu.test.mjs`
- Modify: `index.html:71-324`
- Modify: `script.js:49-124`

**Interfaces:**
- Consumes: the title, structured data, launch bar and business-hour contract from Task 1.
- Produces: stable anchors `#food`, `#drinks`, `#our-story`, `#reviews` and `#visit`; `.asian-menu-card`, `.tofu-option`, `.drink-category`, `.evening-panel` and `.official-logo` hooks used by Task 3.

- [ ] **Step 1: Copy the approved official logo into the site assets**

Run:

```powershell
$logoSources = @(
  'C:\Users\v-bes\AppData\Local\Temp\codex-clipboard-866fbbb9-e8a8-4020-9e26-30335bb35e0a.png',
  '.superpowers\brainstorm\menu-refresh-20260808\content\the-bs-club-official-logo.png'
)
$logoSource = $logoSources | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $logoSource) { throw 'Approved The B’s Club official logo asset is missing.' }
Copy-Item -LiteralPath $logoSource -Destination 'images\logo-official.png'
```

Expected: `images/logo-official.png` exists and remains an RGBA PNG.

- [ ] **Step 2: Write the failing semantic-menu test**

Create `tests/asian-menu.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const logoUrl = new URL('../images/logo-official.png', import.meta.url);

test('uses the official logo in header and footer', () => {
  assert.ok(existsSync(logoUrl));
  assert.equal((html.match(/images\/logo-official\.png/g) ?? []).length, 2);
  assert.match(html, /class="official-logo"/);
});

test('publishes all four Asian food dishes as semantic cards', () => {
  for (const dish of ['Spicy Basil', 'Green Curry', 'Red Curry', 'Crispy Chicken Katsu Curry']) {
    assert.match(html, new RegExp(`<h3>${dish}<\\/h3>`));
  }
  assert.equal((html.match(/CHF 18\.50/g) ?? []).length, 3);
  assert.equal((html.match(/CHF 17\.50/g) ?? []).length, 3);
  assert.equal((html.match(/CHF 15\.50/g) ?? []).length, 1);
  assert.equal((html.match(/class="tofu-option"/g) ?? []).length, 3);
});

test('keeps dietary language factual until ingredients are verified', () => {
  assert.match(html, /Tofu option/);
  assert.doesNotMatch(html, /Vegetarian|Vegan|Vegetarisch|plant-based/i);
});

test('keeps food, drinks, story, reviews and visit directly addressable', () => {
  for (const id of ['food', 'drinks', 'our-story', 'reviews', 'visit']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /Bubble Tea/);
  assert.match(html, /Matcha/);
  assert.match(html, /Coffee/);
});
```

- [ ] **Step 3: Run the menu test and verify it fails**

Run:

```powershell
node --test tests/asian-menu.test.mjs
```

Expected: FAIL because the official logo asset, food section, anchors and exact menu prices do not yet exist.

- [ ] **Step 4: Replace the header and primary navigation**

Use this header structure in `index.html`:

```html
<header class="site-header" id="site-header">
  <div class="container header-inner">
    <a class="official-logo" href="#top" aria-label="The B's Club, home">
      <img src="images/logo-official.png" alt="The B's Club" width="1181" height="1181">
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
      <span class="menu-toggle-lines" aria-hidden="true"></span>
      <span class="sr-only">Open menu</span>
    </button>
    <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
      <a href="#food">Food</a>
      <a href="#drinks">Drinks</a>
      <a href="#our-story">Our Story</a>
      <a href="#visit">Visit</a>
    </nav>
    <a class="button button-small header-cta" href="https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken" target="_blank" rel="noopener" data-cta="directions" data-cta-location="header">Get Directions <span aria-hidden="true">↗</span></a>
  </div>
</header>
```

Replace the existing footer brand link with this second and final use of the official lockup:

```html
<a class="footer-logo" href="#top" aria-label="The B's Club, back to top">
  <img src="images/logo-official.png" alt="The B's Club" width="1181" height="1181" loading="lazy" decoding="async">
</a>
```

- [ ] **Step 5: Replace the old favourites and expired local-offer sections with semantic food and drinks sections**

Use this complete food, drinks and evening structure:

```html
<section class="section asian-menu" id="food">
  <div class="container">
    <div class="section-heading reveal">
      <div><p class="eyebrow"><span></span> New from 15 August · Speisekarte</p><h2>Asian café<br><em>favourites.</em></h2></div>
      <p>Fresh comfort dishes with jasmine rice, ready for an easy lunch or evening meal.</p>
    </div>
    <div class="asian-menu-grid">
      <article class="asian-menu-card" data-dish="spicy-basil">
        <div class="dish-illustration dish-illustration-basil" aria-hidden="true"><span>🌶</span></div>
        <div class="dish-copy"><p class="dish-origin">Thai favourite</p><h3>Spicy Basil</h3><p>Thai holy basil, garlic, fresh chilli, seasonal vegetables &amp; jasmine rice.</p><div class="dish-options" aria-label="Spicy Basil choices"><span>Chicken <strong>CHF 18.50</strong></span><span class="tofu-option">Tofu option <strong>CHF 15.50</strong></span></div></div>
      </article>
      <article class="asian-menu-card" data-dish="green-curry">
        <div class="dish-illustration dish-illustration-green" aria-hidden="true"><span>🍃</span></div>
        <div class="dish-copy"><p class="dish-origin">Thai curry</p><h3>Green Curry</h3><p>Creamy coconut milk, Thai green curry, fresh vegetables &amp; jasmine rice.</p><div class="dish-options" aria-label="Green Curry choices"><span>Chicken <strong>CHF 18.50</strong></span><span class="tofu-option">Tofu option <strong>CHF 17.50</strong></span></div></div>
      </article>
      <article class="asian-menu-card" data-dish="red-curry">
        <div class="dish-illustration dish-illustration-red" aria-hidden="true"><span>🔥</span></div>
        <div class="dish-copy"><p class="dish-origin">Thai curry</p><h3>Red Curry</h3><p>Red curry paste, coconut milk, vegetables, sweet basil &amp; jasmine rice.</p><div class="dish-options" aria-label="Red Curry choices"><span>Chicken <strong>CHF 18.50</strong></span><span class="tofu-option">Tofu option <strong>CHF 17.50</strong></span></div></div>
      </article>
      <article class="asian-menu-card" data-dish="katsu-curry">
        <div class="dish-illustration dish-illustration-katsu" aria-hidden="true"><span>🍛</span></div>
        <div class="dish-copy"><p class="dish-origin">Japanese comfort</p><h3>Crispy Chicken Katsu Curry</h3><p>Crispy panko chicken, Japanese curry sauce &amp; jasmine rice.</p><div class="dish-options" aria-label="Crispy Chicken Katsu Curry price"><span><strong>CHF 17.50</strong></span></div></div>
      </article>
    </div>
  </div>
</section>

<section class="section drinks" id="drinks">
  <div class="container">
    <div class="section-heading section-heading-compact reveal"><div><p class="eyebrow"><span></span> Café favourites</p><h2>Your drink.<br><em>Your little reward.</em></h2></div><p>Colourful drinks made to order — before lunch, after a hike or alongside dinner.</p></div>
    <div class="drink-category-grid">
      <article class="drink-category"><span aria-hidden="true">🧋</span><h3>Bubble Tea</h3><p>Milk tea, fruit tea and chewy tapioca.</p><button class="outline-button menu-open" type="button" data-menu="bubble">View menu <span aria-hidden="true">↗</span></button></article>
      <article class="drink-category"><span aria-hidden="true">🍵</span><h3>Matcha</h3><p>Creamy, balanced and served hot or iced.</p><button class="outline-button menu-open" type="button" data-menu="matcha">View menu <span aria-hidden="true">↗</span></button></article>
      <article class="drink-category"><span aria-hidden="true">☕</span><h3>Coffee</h3><p>Thoughtfully made café classics.</p><button class="outline-button menu-open" type="button" data-menu="coffee">View menu <span aria-hidden="true">↗</span></button></article>
    </div>
    <div class="evening-panel"><div><p class="eyebrow eyebrow-light"><span></span> Easy evenings</p><h3>Stay for something warm.</h3><p>Asian comfort food and café drinks in the centre of Interlaken.</p></div><div class="evening-hours"><small>Open daily · Täglich geöffnet</small><strong>11:00–21:00</strong></div></div>
  </div>
</section>
```

Retain the existing story, reviews, partner, visit, consent and dialog sections. Rename the story section anchor to `id="our-story"`, preserve `id="reviews"`, and update every visible 19:00 value to 21:00.

- [ ] **Step 6: Update menu-dialog triggers without changing its public behaviour**

Keep `menuData`, `selectMenu`, `.menu-open`, `data-menu`, `.dialog-tabs` and `.dialog-close` unchanged in `script.js`. Only update visible labels in `index.html`; the existing dialog must continue to open the Bubble Tea, Matcha and Coffee menu images.

- [ ] **Step 7: Run semantic and regression tests**

Run:

```powershell
node --test tests/asian-menu.test.mjs tests/site-content.test.mjs tests/consent-mode.test.mjs tests/directions-tracking.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 8: Commit the semantic homepage**

```powershell
git add images/logo-official.png index.html script.js tests/asian-menu.test.mjs
git commit -m "feat: add Asian food and drinks homepage"
```

---

### Task 3: Apply the Bold Asian Club Visual System

**Files:**
- Create: `tests/responsive-design.test.mjs`
- Modify: `styles.css:1-378`

**Interfaces:**
- Consumes: `.official-logo`, `.asian-menu-card`, `.dish-options`, `.tofu-option`, `.drink-category` and `.evening-panel` from Task 2.
- Produces: responsive layout and shared tokens consumed by Mini Makers and cursor styling in Tasks 4 and 5.

- [ ] **Step 1: Write the failing responsive-design contract**

Create `tests/responsive-design.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('defines the approved Bold Asian Club palette', () => {
  assert.match(css, /--ink:\s*#173f34/);
  assert.match(css, /--sun:\s*#f5c84b/);
  assert.match(css, /--coral:\s*#ec6b58/);
  assert.match(css, /--cream:\s*#fff8e9/);
});

test('lays out food and drinks responsively', () => {
  assert.match(css, /\.asian-menu-grid\s*\{[^}]*display:\s*grid/);
  assert.match(css, /\.drink-category-grid\s*\{[^}]*display:\s*grid/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
});

test('keeps the official logo readable in header and footer', () => {
  assert.match(css, /\.official-logo\s*\{[^}]*overflow:\s*hidden/);
  assert.match(css, /\.footer-logo/);
});
```

- [ ] **Step 2: Run the CSS contract and verify it fails**

Run:

```powershell
node --test tests/responsive-design.test.mjs
```

Expected: FAIL on the new palette, Asian menu layout and official-logo styles.

- [ ] **Step 3: Replace the global tokens and header/hero shell**

Start `styles.css` with these approved tokens:

```css
:root {
  --ink: #173f34;
  --ink-deep: #0d3028;
  --ink-soft: #41665b;
  --cream: #fff8e9;
  --paper: #fffdf8;
  --sun: #f5c84b;
  --coral: #ec6b58;
  --sand: #e6d2b4;
  --line: rgba(23, 63, 52, .17);
  --shadow: 0 24px 70px rgba(13, 48, 40, .16);
  --radius: 26px;
  --font-display: "DM Sans", Arial, sans-serif;
  --font-accent: "Fraunces", Georgia, serif;
  --font-body: "DM Sans", Arial, sans-serif;
}
```

Make the sticky header deep green, crop the supplied square logo inside `.official-logo`, and keep the logo about 145×72 CSS pixels on desktop and 105×56 on mobile. Use `object-fit: contain`; do not distort the source aspect ratio.

Use this header/logo block:

```css
.site-header { position: sticky; top: 0; z-index: 50; min-height: 92px; background: rgba(23,63,52,.96); border-bottom: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(18px); }
.header-inner { min-height: inherit; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
.official-logo { position: relative; display: block; width: 145px; height: 72px; overflow: hidden; flex: none; }
.official-logo img { display: block; width: 100%; height: 100%; object-fit: contain; }
.primary-nav { display: flex; align-items: center; gap: 30px; }
.primary-nav a { color: rgba(255,255,255,.82); text-decoration: none; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
@media (max-width: 560px) {
  .site-header { min-height: 74px; }
  .official-logo { width: 105px; height: 56px; }
}
```

- [ ] **Step 4: Style the food, drink and evening sections**

Implement these stable layout contracts:

```css
.asian-menu-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.asian-menu-card { display: grid; grid-template-columns: 150px 1fr; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--paper); }
.dish-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.dish-options > span { padding: 8px 10px; border-radius: 999px; background: var(--ink); color: white; font-size: 11px; font-weight: 700; }
.dish-options .tofu-option { border: 1px dashed #7ba16d; background: #edf5e5; color: #285532; }
.drink-category-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.evening-panel { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 32px; border-radius: var(--radius); background: var(--ink-deep); color: white; }
```

At `max-width: 820px`, stack `.asian-menu-card` content where needed and reduce the hero to one column. At `max-width: 560px`, use one-column food and drink grids, keep every price visible, and retain the existing fixed mobile action bar and consent-banner clearance.

Add these exact responsive rules:

```css
@media (max-width: 820px) {
  .hero-grid { grid-template-columns: 1fr; gap: 36px; }
  .asian-menu-grid { grid-template-columns: 1fr; }
  .evening-panel { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .asian-menu-card { grid-template-columns: 1fr; }
  .dish-illustration { min-height: 150px; }
  .drink-category-grid { grid-template-columns: 1fr; }
  .dish-options { align-items: stretch; flex-direction: column; }
  .dish-options > span { display: flex; justify-content: space-between; gap: 16px; }
  .mobile-actions { display: grid; }
}
@media (max-width: 760px) {
  .consent-banner { bottom: calc(78px + env(safe-area-inset-bottom)); }
}
```

- [ ] **Step 5: Restyle retained story, reviews, partner, visit, footer, consent and dialog components**

Keep their existing classes and behaviour, and add these explicit theme overrides after their base layout rules:

```css
.story { background: var(--cream); }
.reviews, .footer { background: var(--ink-deep); color: white; }
.partner-strip { background: var(--sand); }
.visit, .menu-dialog { background: var(--paper); color: var(--ink); }
.review-card, .map-card { border-radius: var(--radius); }
.consent-banner { border: 1px solid rgba(255,255,255,.16); background: var(--ink-deep); color: white; }
.footer-logo { position: relative; display: block; width: 150px; height: 78px; overflow: hidden; }
.footer-logo img { width: 100%; height: 100%; object-fit: contain; }
```

Do not remove review copy, partner URL, phone number, map links, consent controls or dialog accessibility attributes.

- [ ] **Step 6: Run the responsive and existing tests**

Run:

```powershell
node --test tests/responsive-design.test.mjs tests/site-content.test.mjs tests/consent-mode.test.mjs tests/directions-tracking.test.mjs tests/asian-menu.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 7: Commit the visual system**

```powershell
git add styles.css tests/responsive-design.test.mjs
git commit -m "feat: apply Bold Asian Club visual system"
```

---

### Task 4: Add the Mini Makers Hero Signature

**Files:**
- Create: `tests/mini-makers.test.mjs`
- Modify: `index.html` inside `#top`
- Modify: `styles.css` hero and motion blocks

**Interfaces:**
- Consumes: hero grid and visual tokens from Task 3.
- Produces: `.mini-makers`, `.giant-bowl`, `.giant-boba`, `.maker-ladder`, `.mini-worker`, `makerClimb`, `makerSprinkle` and `makerPolish` hooks.

- [ ] **Step 1: Write the failing Mini Makers contract**

Create `tests/mini-makers.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

test('keeps the ladder-climbing Mini Makers hero signature', () => {
  assert.match(html, /class="mini-makers"[^>]*aria-hidden="true"/);
  assert.match(html, /class="giant-bowl"/);
  assert.match(html, /class="giant-boba"/);
  assert.match(html, /class="maker-ladder"/);
  assert.ok((html.match(/class="mini-worker/g) ?? []).length >= 3);
});

test('uses subtle motion with safe fallbacks', () => {
  assert.match(css, /@keyframes\s+makerClimb/);
  assert.match(css, /@keyframes\s+makerSprinkle/);
  assert.match(css, /@keyframes\s+makerPolish/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)[\s\S]*\.mini-worker-mobile-hide/);
});
```

- [ ] **Step 2: Run the Mini Makers test and verify it fails**

Run:

```powershell
node --test tests/mini-makers.test.mjs
```

Expected: FAIL because the scene, workers, ladder and animations do not exist.

- [ ] **Step 3: Add the decorative hero scene**

Inside the hero visual column, add:

```html
<div class="mini-makers" aria-hidden="true">
  <span class="maker-sun"></span>
  <div class="giant-bowl"><span>Asian Comfort</span></div>
  <div class="giant-boba"><span class="giant-boba-straw"></span><b>B</b></div>
  <span class="maker-ladder"></span>
  <span class="mini-worker worker-climber"><i class="worker-head"></i><i class="worker-body"></i><i class="worker-limbs"></i></span>
  <span class="mini-worker worker-herbs"><i class="worker-head"></i><i class="worker-body"></i><i class="worker-limbs"></i><i class="maker-herb">◆</i></span>
  <span class="mini-worker mini-worker-mobile-hide worker-boba"><i class="worker-head"></i><i class="worker-body"></i><i class="worker-limbs"></i></span>
  <span class="maker-hours">Open daily<br>11:00–21:00</span>
</div>
```

Keep the scene after hero copy in DOM order because it is decorative and `aria-hidden`; the visible H1, supporting copy and CTAs remain first.

- [ ] **Step 4: Add the 8–10 second motion loop**

Use transform/opacity-only keyframes:

```css
@keyframes makerClimb {
  0%, 12%, 100% { transform: translate3d(0, 0, 0) rotate(7deg); }
  48%, 62% { transform: translate3d(8px, -24px, 0) rotate(7deg); }
}
@keyframes makerSprinkle {
  0%, 20%, 100% { transform: translate3d(0, 0, 0) rotate(0); }
  45%, 55% { transform: translate3d(0, -5px, 0) rotate(-8deg); }
}
@keyframes makerPolish {
  0%, 20%, 100% { transform: translate3d(0, 0, 0); }
  45%, 60% { transform: translate3d(8px, -4px, 0); }
}
.worker-climber { animation: makerClimb 9s ease-in-out infinite; }
.worker-herbs { animation: makerSprinkle 8.5s ease-in-out infinite; }
.worker-boba { animation: makerPolish 9.5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .mini-worker, .maker-herb { animation: none !important; }
}
@media (max-width: 560px) {
  .mini-worker-mobile-hide { display: none; }
}
```

Complete the scene styles with CSS-drawn bowl, cup, straw, ladder and workers using the approved green, yellow, coral, cream and blue-workwear palette. Keep all motion away from body text and CTAs.

Add these concrete scene primitives before the keyframes:

```css
.mini-makers { position: relative; min-height: 540px; overflow: hidden; border-radius: 34px; background: radial-gradient(circle at 65% 42%, #2a5a4c 0 34%, transparent 65%); }
.maker-sun { position: absolute; width: 260px; height: 260px; top: 48px; right: -58px; border-radius: 50%; background: var(--sun); }
.giant-bowl { position: absolute; left: 13%; right: 23%; bottom: 58px; height: 180px; border-radius: 24px 24px 48% 48%; background: linear-gradient(165deg, white 0 48%, #e8e1d5 49%); box-shadow: 0 28px 35px rgba(0,0,0,.26); }
.giant-bowl::before { content: ""; position: absolute; left: 5%; right: 5%; top: -42px; height: 102px; border-radius: 50%; background: radial-gradient(circle at 30% 35%, #ef5440 0 4%, transparent 5%), radial-gradient(circle at 58% 40%, #77a43d 0 5%, transparent 6%), radial-gradient(ellipse at center, #cf4d31 0 56%, #a93625 57% 68%, #f2eee4 69% 75%, transparent 76%); }
.giant-bowl > span { position: absolute; left: 50%; top: 82px; transform: translateX(-50%); color: var(--ink); font-size: 17px; font-weight: 900; text-transform: uppercase; white-space: nowrap; }
.giant-boba { position: absolute; right: 6%; bottom: 78px; width: 108px; height: 220px; border: 7px solid white; border-top-width: 12px; border-radius: 14px 14px 36px 36px; background: linear-gradient(#e3c39d 0 64%, #633c2c 65%); box-shadow: 0 24px 30px rgba(0,0,0,.24); }
.giant-boba::after { content: ""; position: absolute; left: 8px; right: 8px; bottom: 7px; height: 55px; background: radial-gradient(circle, #241712 0 7px, transparent 8px); background-size: 24px 22px; }
.giant-boba > b { position: absolute; left: 50%; top: 76px; z-index: 2; display: grid; place-items: center; width: 30px; height: 30px; border: 2px solid var(--ink); border-radius: 50%; transform: translateX(-50%); color: var(--ink); }
.giant-boba-straw { position: absolute; width: 13px; height: 146px; right: 22px; top: -112px; border-radius: 8px; background: var(--coral); transform: rotate(10deg); }
.maker-ladder { position: absolute; z-index: 4; left: 9%; bottom: 74px; width: 54px; height: 215px; border-inline: 5px solid #d9dedb; background: repeating-linear-gradient(to bottom, transparent 0 26px, #d9dedb 27px 32px, transparent 33px 38px); transform: rotate(8deg); }
.mini-worker { position: absolute; z-index: 8; width: 38px; height: 68px; filter: drop-shadow(0 7px 5px rgba(0,0,0,.22)); }
.worker-head { position: absolute; left: 11px; top: 0; width: 17px; height: 17px; border-radius: 50%; border-top: 7px solid #65b4d7; background: #f3b88f; }
.worker-body { position: absolute; left: 9px; top: 16px; width: 22px; height: 29px; border-radius: 8px 8px 4px 4px; background: #58a8cd; }
.worker-limbs::before, .worker-limbs::after { content: ""; position: absolute; top: 42px; width: 7px; height: 24px; border-radius: 4px; background: #e9e4d7; }
.worker-limbs::before { left: 10px; transform: rotate(8deg); }
.worker-limbs::after { left: 23px; transform: rotate(-9deg); }
.worker-climber { left: 10%; bottom: 255px; transform: rotate(7deg); }
.worker-herbs { left: 47%; bottom: 252px; }
.worker-boba { right: 13%; bottom: 304px; transform: scale(.86) rotate(5deg); }
.maker-herb { position: absolute; right: -18px; top: -4px; color: #a5d45e; font-style: normal; }
.maker-hours { position: absolute; z-index: 5; top: 18px; right: 18px; display: grid; place-items: center; width: 88px; height: 88px; border-radius: 50%; background: var(--coral); color: white; font-size: 10px; font-weight: 900; text-align: center; transform: rotate(7deg); }
```

- [ ] **Step 5: Run Mini Makers and responsive tests**

Run:

```powershell
node --test tests/mini-makers.test.mjs tests/responsive-design.test.mjs tests/asian-menu.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 6: Commit the brand signature**

```powershell
git add index.html styles.css tests/mini-makers.test.mjs
git commit -m "feat: add Mini Makers hero scene"
```

---

### Task 5: Implement the Bubble Tea Straw-Tip Cursor

**Files:**
- Create: `cursor.js`
- Create: `tests/boba-cursor.test.mjs`
- Modify: `index.html` before `</body>` and script tags in `<head>`
- Modify: `styles.css` cursor block
- Modify: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: `#boba-cursor`, `[data-cursor-part]`, fine-pointer media query and approved visual tokens.
- Produces: `window.TheBsClubCursor.initBubbleTeaCursor({ documentRef, windowRef })`, returning `{ enabled: boolean, destroy(): void }`.

- [ ] **Step 1: Write the failing cursor controller test**

Create `tests/boba-cursor.test.mjs` using a VM sandbox. The minimum assertions are:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../cursor.js', import.meta.url), 'utf8');

const loadCursor = ({ finePointer = true, reducedMotion = false } = {}) => {
  const listeners = new Map();
  const classes = new Set();
  const cursor = {
    style: { setProperty(name, value) { this[name] = value; } },
    classList: {
      add: (...names) => names.forEach((name) => classes.add(name)),
      remove: (...names) => names.forEach((name) => classes.delete(name)),
      toggle: (name, force) => force ? classes.add(name) : classes.delete(name)
    }
  };
  const documentRef = {
    querySelector: (selector) => selector === '#boba-cursor' ? cursor : null,
    addEventListener(type, handler) { listeners.set(type, handler); },
    removeEventListener(type) { listeners.delete(type); }
  };
  const windowRef = {
    matchMedia(query) {
      return { matches: query.includes('prefers-reduced-motion') ? reducedMotion : finePointer };
    },
    requestAnimationFrame(callback) { callback(); return 1; },
    cancelAnimationFrame() {}
  };
  const window = { document: documentRef, ...windowRef };
  vm.runInNewContext(source, { window, document: documentRef });
  return { api: window.TheBsClubCursor, cursor, classes, listeners, documentRef, windowRef };
};

test('enables only for a fine hover pointer', () => {
  const enabled = loadCursor({ finePointer: true });
  assert.equal(enabled.api.initBubbleTeaCursor({ documentRef: enabled.documentRef, windowRef: enabled.windowRef }).enabled, true);
  const disabled = loadCursor({ finePointer: false });
  assert.equal(disabled.api.initBubbleTeaCursor({ documentRef: disabled.documentRef, windowRef: disabled.windowRef }).enabled, false);
});

test('uses the pointer coordinates as the straw-tip hotspot', () => {
  const fixture = loadCursor();
  fixture.api.initBubbleTeaCursor({ documentRef: fixture.documentRef, windowRef: fixture.windowRef });
  fixture.listeners.get('pointermove')({ clientX: 120, clientY: 80, target: { closest: () => null } });
  assert.equal(fixture.cursor.style['--cursor-x'], '120px');
  assert.equal(fixture.cursor.style['--cursor-y'], '80px');
  assert.ok(fixture.classes.has('is-visible'));
});

test('toggles interactive and click states and removes listeners on destroy', () => {
  const fixture = loadCursor();
  const controller = fixture.api.initBubbleTeaCursor({ documentRef: fixture.documentRef, windowRef: fixture.windowRef });
  fixture.listeners.get('pointermove')({ clientX: 8, clientY: 12, target: { closest: (selector) => selector.includes('a, button') } });
  assert.ok(fixture.classes.has('is-hovering'));
  fixture.listeners.get('pointerdown')();
  assert.ok(fixture.classes.has('is-clicking'));
  fixture.listeners.get('pointerup')();
  assert.ok(!fixture.classes.has('is-clicking'));
  controller.destroy();
  assert.equal(fixture.listeners.has('pointermove'), false);
  assert.equal(fixture.listeners.has('pointerdown'), false);
  assert.equal(fixture.listeners.has('pointerup'), false);
});
```

- [ ] **Step 2: Run the cursor test and verify it fails**

Run:

```powershell
node --test tests/boba-cursor.test.mjs
```

Expected: FAIL because `cursor.js` does not exist.

- [ ] **Step 3: Add the cursor markup and script reference**

Before `</body>` in `index.html`, add:

```html
<div class="boba-cursor" id="boba-cursor" aria-hidden="true">
  <span class="boba-cursor-straw" data-cursor-part="straw"></span>
  <span class="boba-cursor-lid" data-cursor-part="lid"></span>
  <span class="boba-cursor-cup" data-cursor-part="cup">
    <i class="brown-sugar-line brown-sugar-line-left"></i>
    <i class="brown-sugar-line brown-sugar-line-right"></i>
    <b>B</b>
    <i class="cursor-pearls"></i>
  </span>
</div>
```

Load `cursor.js?v=20260815-1` with `defer` after the existing `script.js` tag.

- [ ] **Step 4: Implement the isolated cursor controller**

Create `cursor.js` with this public contract:

```js
(() => {
  const nativeSelector = 'input, textarea, select, [contenteditable="true"], .native-cursor';

  const initBubbleTeaCursor = ({ documentRef = document, windowRef = window } = {}) => {
    const cursor = documentRef.querySelector('#boba-cursor');
    const finePointer = windowRef.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!cursor || !finePointer) return { enabled: false, destroy() {} };

    const reducedMotion = windowRef.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      cursor.style.setProperty('--cursor-x', `${x}px`);
      cursor.style.setProperty('--cursor-y', `${y}px`);
      cursor.classList.add('is-visible');
      frame = 0;
    };
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.toggle('is-native', Boolean(event.target?.closest?.(nativeSelector)));
      cursor.classList.toggle('is-hovering', Boolean(event.target?.closest?.('a, button, [role="button"]')));
      if (!frame) frame = windowRef.requestAnimationFrame(render);
    };
    const onDown = () => { if (!reducedMotion) cursor.classList.add('is-clicking'); };
    const onUp = () => cursor.classList.remove('is-clicking');

    documentRef.addEventListener('pointermove', onMove, { passive: true });
    documentRef.addEventListener('pointerdown', onDown, { passive: true });
    documentRef.addEventListener('pointerup', onUp, { passive: true });

    return {
      enabled: true,
      destroy() {
        documentRef.removeEventListener('pointermove', onMove);
        documentRef.removeEventListener('pointerdown', onDown);
        documentRef.removeEventListener('pointerup', onUp);
        if (frame) windowRef.cancelAnimationFrame(frame);
      }
    };
  };

  window.TheBsClubCursor = Object.freeze({ initBubbleTeaCursor });
  initBubbleTeaCursor();
})();
```

- [ ] **Step 5: Style the approved cup and hotspot**

Use `position: fixed; left: 0; top: 0; transform: translate3d(var(--cursor-x), var(--cursor-y), 0);` on `.boba-cursor`. Offset only the cup and straw artwork inside it; keep the transform origin at the straw tip so `clientX/clientY` is the real hotspot.

The CSS must include:

- a 7 px angled straw with a visible tip;
- a wide clear lid;
- a tapered, rounded milk-tea cup;
- a centred simplified `B` badge;
- two straight Brown Sugar lines from lid to cup bottom, left and right of the badge;
- pearls layered above the Brown Sugar lines;
- `.is-hovering` pearl motion;
- `.is-clicking` cup compression/pearl-pop no longer than 0.55 seconds;
- `.is-native { display: none; }`;
- no custom cursor below the fine-pointer media query;
- no click animation under `prefers-reduced-motion: reduce`.

Implement those requirements with this exact base block, then tune only visual dimensions during browser QA:

```css
@media (hover: hover) and (pointer: fine) {
  body { cursor: none; }
  a, button { cursor: none; }
  .boba-cursor { position: fixed; z-index: 999; left: 0; top: 0; width: 55px; height: 85px; pointer-events: none; opacity: 0; transform: translate3d(var(--cursor-x, -100px), var(--cursor-y, -100px), 0); will-change: transform; filter: drop-shadow(0 9px 6px rgba(0,0,0,.28)); }
  .boba-cursor.is-visible { opacity: 1; }
  .boba-cursor.is-native { display: none; }
  .boba-cursor-straw { position: absolute; left: 0; top: 0; width: 7px; height: 44px; border-radius: 5px; background: repeating-linear-gradient(to bottom, var(--coral) 0 7px, white 7px 12px); transform: rotate(-19deg); transform-origin: 3px 3px; }
  .boba-cursor-lid { position: absolute; left: -4px; top: 31px; width: 51px; height: 13px; border: 3px solid white; border-radius: 50%; background: rgba(235,241,237,.75); }
  .boba-cursor-cup { position: absolute; left: -1px; top: 38px; width: 45px; height: 45px; overflow: hidden; clip-path: polygon(3% 0,97% 0,86% 89%,72% 100%,28% 100%,14% 89%); border-radius: 0 0 14px 14px; background: #e6bd94; box-shadow: inset 0 0 0 2px rgba(255,255,255,.76); }
  .brown-sugar-line { position: absolute; z-index: 1; top: 0; bottom: 0; width: 4px; background: linear-gradient(#67321f,#a95730 45%,#71351f); }
  .brown-sugar-line-left { left: 9px; }
  .brown-sugar-line-right { right: 9px; }
  .boba-cursor-cup > b { position: absolute; z-index: 5; left: 50%; top: 10px; display: grid; place-items: center; width: 16px; height: 16px; border: 1.7px solid var(--ink); border-radius: 50%; transform: translateX(-50%); background: #e6bd94; color: var(--ink); font: 900 8px Georgia, serif; }
  .cursor-pearls { position: absolute; z-index: 3; left: 4px; right: 4px; bottom: 3px; height: 12px; background: radial-gradient(circle,#241711 0 3px,transparent 3.6px); background-size: 12px 10px; }
  .boba-cursor.is-hovering .cursor-pearls { animation: cursorPearls .7s ease-in-out infinite alternate; }
  .boba-cursor.is-clicking .boba-cursor-cup { animation: cursorClick .3s ease; }
}
@keyframes cursorPearls { to { background-position: 2px -4px; } }
@keyframes cursorClick { 50% { transform: scale(.88) rotate(5deg); } }
@media (prefers-reduced-motion: reduce) {
  .boba-cursor, .boba-cursor * { animation: none !important; transition: none !important; }
}
@media (hover: none), (pointer: coarse) {
  .boba-cursor { display: none !important; }
}
```

- [ ] **Step 6: Update the script-cache assertion and run cursor tests**

Update `tests/site-content.test.mjs` to assert both versioned script tags:

```js
assert.match(html, /<script src="script\.js\?v=20260815-1" defer><\/script>/);
assert.match(html, /<script src="cursor\.js\?v=20260815-1" defer><\/script>/);
```

Run:

```powershell
node --test tests/boba-cursor.test.mjs tests/site-content.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 7: Commit the cursor**

```powershell
git add cursor.js index.html styles.css tests/boba-cursor.test.mjs tests/site-content.test.mjs
git commit -m "feat: add Bubble Tea straw cursor"
```

---

### Task 6: Full Regression, Browser QA and Launch Handoff

**Files:**
- Modify: `README.md`
- Modify only if tests expose a defect: `index.html`, `styles.css`, `script.js`, `cursor.js`
- Test: all files under `tests/`

**Interfaces:**
- Consumes: the complete static site from Tasks 1–5.
- Produces: launch-ready local build with documented verification and no uncommitted implementation changes.

- [ ] **Step 1: Run the complete automated suite**

Run:

```powershell
node --test tests/*.test.mjs
```

Expected: every test PASS; zero skipped or cancelled tests.

- [ ] **Step 2: Search for stale or unsafe content**

Run:

```powershell
rg -n "11:00.–.19:00|closes.*19:00|July local offer|Opening month|Vegetarian|Vegan|Vegetarisch|plant-based" index.html README.md script.js styles.css
```

Expected: no matches. `Tofu option` remains visible in exactly the three tofu-capable dishes.

- [ ] **Step 3: Start the static server for visual QA**

Run from the repository root:

```powershell
python -m http.server 8000
```

Expected: `http://localhost:8000/` returns the refreshed homepage without console errors.

- [ ] **Step 4: Verify desktop behaviour at approximately 1440×900**

Check all of the following in the browser:

- official logo is clear at top-left and repeated in the footer;
- launch bar says 15 August and 11:00–21:00;
- food and drinks have equal hero prominence;
- at least three Mini Makers, the ladder, giant bowl and giant Bubble Tea are visible;
- Mini Makers move subtly without covering text;
- cursor straw tip lands exactly on links and buttons;
- the two Brown Sugar lines reach the bottom and do not cover the `B` badge;
- Bubble Tea, Matcha and Coffee dialogs still open and close;
- every directions CTA navigates to Google Maps;
- consent controls and Privacy settings still work.

- [ ] **Step 5: Verify responsive and accessibility fallbacks**

At approximately 768 px and 360 px widths, verify:

- no horizontal overflow;
- menu name, description, choice and price remain visible;
- mobile navigation and fixed actions remain reachable;
- the consent banner remains above fixed mobile actions;
- one nonessential Mini Maker is hidden on the smallest view;
- touch/mobile uses the native pointer.

Enable reduced motion in browser or operating-system settings and verify that Mini Makers become static and the cursor click animation stops.

- [ ] **Step 6: Confirm the working tree contains only intentional changes**

Run:

```powershell
git status --short
git diff --check
```

Expected: no whitespace errors. Preserve the owner’s pre-existing modification to `docs/superpowers/specs/2026-07-18-ga4-consent-mode-design.md`; do not stage or alter it.

- [ ] **Step 7: Commit final QA fixes and documentation**

If QA required changes, stage only the implementation files listed in this plan:

```powershell
git add README.md index.html styles.css script.js cursor.js images/logo-official.png tests
git commit -m "chore: finalize Asian cafe launch"
```

If QA required no changes, do not create an empty commit.

---

## Completion Criteria

- All Node tests pass.
- The site presents The B’s Club as an Asian Café in Interlaken.
- All four food items and seven prices match the approved source.
- The website consistently displays daily 11:00–21:00 hours.
- The official logo is top-left and in the footer.
- Mini Makers and the ladder remain the hero signature.
- The custom desktop cursor uses the straw tip, simplified `B`, two full-height Brown Sugar lines and safe fallbacks.
- Food and drink content remains accessible with JavaScript disabled.
- No unverified dietary wording is published.
- Existing consent, directions tracking, menu viewer, story, reviews and partner content still work.
