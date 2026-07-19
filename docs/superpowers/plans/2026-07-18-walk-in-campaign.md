# The B's Club Walk-in Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an accurate, responsive homepage campaign for three discounted drinks, measure directions intent with the existing GA4 setup, and prevent the offer from remaining visible after 31 August 2026.

**Architecture:** Keep the website dependency-free at runtime. Store campaign and truthful menu content in `index.html`, visual presentation in `styles.css`, expiry and existing analytics behavior in `script.js`, and regression coverage in Node's built-in test runner. Use the approved generated trio image as the single source for two optimized local WebP assets.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js built-in tests, bundled `sharp` for build-time image optimization, GA4 Advanced Consent Mode v2.

## Global Constraints

- Canonical website is `https://thebsclub.ch/`.
- Opening hours remain every day, `11:00–19:00`.
- Telephone remains `076 226 27 22` / `tel:+41762262722`.
- Primary CTA remains `Get Directions`; `View Menu` and `Order on Uber Eats` remain secondary.
- Campaign code is exactly `BS12`.
- Headline is exactly `3 drinks. 1 summer offer.`
- Offer line is exactly `Pick yours and save 12% in store.`
- Campaign prices are CHF 6.95, CHF 6.95, and CHF 7.80 for Brown Sugar Milk Tea, Yummy Strawberry, and Matcha Latte respectively.
- Campaign end is `2026-08-31T21:59:59Z`, equivalent to 31 August 2026, 23:59 Europe/Zurich.
- Remove public claims for brunch, breakfast, avocado toast, and all-day comfort food.
- Existing consent defaults, Google Analytics ID `G-JS838K2PY5`, and exact-once `directions_click` behavior must not change.
- No ad spend, Google Ads activation, popup, third-party runtime image host, or new runtime dependency is in scope.
- Do not publish until the user confirms the three POS items exist, staff know `BS12`, and the production preview is approved.

---

### Task 1: Make the public menu and metadata truthful

**Files:**
- Modify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\tests\site-content.test.mjs`
- Modify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\index.html`
- Create: `C:\Users\v-bes\Documents\Ai System\TheBsClub\images\yummy-strawberry-campaign.webp`

**Interfaces:**
- Consumes: approved campaign trio source at `C:\Users\v-bes\.codex\generated_images\019f70dc-5e55-70f2-bebf-9943ff209cc3\exec-a9449763-1481-473d-b076-e36ee919cc9a.png`.
- Produces: truthful metadata and page copy; a local `images/yummy-strawberry-campaign.webp` asset used by the fourth product card and story image.

- [ ] **Step 1: Write failing content-accuracy tests**

Change the file-system import at the top of `tests/site-content.test.mjs` to:

```js
import { existsSync, readFileSync, statSync } from 'node:fs';
```

Append these tests:

```js
test('does not advertise unavailable brunch or breakfast products', () => {
  assert.doesNotMatch(html, /brunch|breakfast|avocado toast|all-day comfort food/i);
  assert.match(html, /<title>The B's Club — Coffee, Matcha &amp; Bubble Tea in Interlaken<\/title>/);
  assert.match(html, /"servesCuisine": \["Coffee", "Bubble Tea", "Matcha", "Waffles"\]/);
  assert.match(html, /Coffee, matcha, bubble tea and waffles\./);
  assert.match(html, /Drop in for coffee, a colourful afternoon pick-me-up or a sweet finish to your day\./);
});

test('features Yummy Strawberry with an optimized local image', () => {
  const imageUrl = new URL('../images/yummy-strawberry-campaign.webp', import.meta.url);
  assert.ok(existsSync(imageUrl), 'Yummy Strawberry campaign image should exist');
  assert.ok(statSync(imageUrl).size < 300_000, 'Yummy Strawberry image should stay below 300 KB');
  assert.match(html, /images\/yummy-strawberry-campaign\.webp/);
  assert.match(html, /<h3>Yummy Strawberry<\/h3>/);
  assert.match(html, /<strong>CHF 7\.90<\/strong>/);
});
```

- [ ] **Step 2: Run the focused test and verify the expected failure**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs
```

Expected: FAIL because the current HTML still advertises brunch/breakfast/avocado toast and the Yummy Strawberry asset does not exist.

- [ ] **Step 3: Create the optimized Yummy Strawberry image**

From the repository root, run this deterministic crop of the approved trio image:

```powershell
$env:NODE_PATH='C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$node='C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$source='C:\Users\v-bes\.codex\generated_images\019f70dc-5e55-70f2-bebf-9943ff209cc3\exec-a9449763-1481-473d-b076-e36ee919cc9a.png'
$target='images\yummy-strawberry-campaign.webp'
& $node -e "const sharp=require('sharp'); sharp(process.argv[1]).extract({left:370,top:250,width:500,height:720}).resize({width:900}).webp({quality:84}).toFile(process.argv[2]);" $source $target
```

Expected: `images/yummy-strawberry-campaign.webp` is created at 900×1296 and remains below 300 KB.

- [ ] **Step 4: Replace inaccurate metadata and homepage copy**

Use these exact metadata values in `index.html`:

```html
<title>The B's Club — Coffee, Matcha &amp; Bubble Tea in Interlaken</title>
<meta name="description" content="Specialty coffee, bubble tea, matcha and colourful drinks at The B's Club in central Interlaken. Open daily, 11:00–19:00.">
<meta property="og:title" content="The B's Club — Coffee, matcha and bubble tea in Interlaken">
<meta property="og:description" content="Coffee, bubble tea, matcha and colourful drinks in the heart of Interlaken.">
```

Set structured data to:

```json
"servesCuisine": ["Coffee", "Bubble Tea", "Matcha", "Waffles"],
```

Replace the hero lead, second promise, and visit lead with:

```html
<p class="hero-lead">Bright bubble tea, thoughtfully made coffee and matcha—served with a warm welcome in the heart of town.</p>
```

```html
<div><span>02</span><h2>Something for every mood</h2><p>Coffee, matcha, bubble tea and waffles.</p></div>
```

```html
<p class="visit-lead">Drop in for coffee, a colourful afternoon pick-me-up or a sweet finish to your day.</p>
```

Replace the Avocado Toast product article with:

```html
<article class="product-card product-card-wide reveal reveal-delay-1">
  <div class="product-image"><img src="images/yummy-strawberry-campaign.webp" alt="Yummy Strawberry iced drink" width="900" height="1296" loading="lazy" decoding="async"></div>
  <div class="product-info"><div><p>Summer special</p><h3>Yummy Strawberry</h3></div><strong>CHF 7.90</strong></div>
</article>
```

Replace the avocado-toast story image with:

```html
<img class="story-photo-two" src="images/yummy-strawberry-campaign.webp" alt="Yummy Strawberry iced drink" width="900" height="1296" loading="lazy" decoding="async">
```

- [ ] **Step 5: Run the focused and full test suites**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: all existing tests plus the two new tests PASS with no warnings or skipped tests.

- [ ] **Step 6: Commit truthful content**

```powershell
git add index.html images/yummy-strawberry-campaign.webp tests/site-content.test.mjs
git commit -m "Remove unavailable brunch claims"
```

---

### Task 2: Add the Professional A campaign section and expiry behavior

**Files:**
- Modify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\tests\site-content.test.mjs`
- Create: `C:\Users\v-bes\Documents\Ai System\TheBsClub\tests\campaign-visibility.test.mjs`
- Create: `C:\Users\v-bes\Documents\Ai System\TheBsClub\images\summer-drinks-campaign.webp`
- Modify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\index.html`
- Modify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\styles.css`
- Modify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\script.js`

**Interfaces:**
- Consumes: the existing directions-link contract `[data-cta="directions"]`, `data-cta-location`, and approved trio source image.
- Produces: `#summer-offer` with `data-campaign-end="2026-08-31T21:59:59Z"`; a campaign CTA with `data-cta-location="campaign"`; optimized local hero asset; date-driven visibility that leaves the section hidden when expired or malformed.

- [ ] **Step 1: Write failing campaign-content tests**

Append to `tests/site-content.test.mjs`:

```js
test('publishes the approved BS12 walk-in offer', () => {
  const imageUrl = new URL('../images/summer-drinks-campaign.webp', import.meta.url);
  assert.ok(existsSync(imageUrl), 'campaign trio image should exist');
  assert.ok(statSync(imageUrl).size < 450_000, 'campaign trio image should stay below 450 KB');
  assert.match(html, /<noscript><style>#summer-offer\[hidden\] \{ display: block !important; \}<\/style><\/noscript>/);
  assert.match(html, /id="summer-offer"[^>]*hidden[^>]*data-campaign-end="2026-08-31T21:59:59Z"/);
  assert.match(html, /3 drinks\. 1 summer offer\./);
  assert.match(html, /Pick yours and save 12% in store\./);
  assert.match(html, /Show code <strong>BS12<\/strong> at checkout/);
  assert.match(html, /Brown Sugar Milk Tea[\s\S]*?<del>CHF 7\.90<\/del>[\s\S]*?<strong>CHF 6\.95<\/strong>/);
  assert.match(html, /Yummy Strawberry[\s\S]*?<del>CHF 7\.90<\/del>[\s\S]*?<strong>CHF 6\.95<\/strong>/);
  assert.match(html, /Matcha Latte[\s\S]*?<del>CHF 8\.90<\/del>[\s\S]*?<strong>CHF 7\.80<\/strong>/);
  assert.match(html, /data-cta="directions" data-cta-location="campaign"/);
  assert.match(html, /<script src="script\.js\?v=20260718-3" defer><\/script>/);
});
```

- [ ] **Step 2: Write failing campaign-visibility tests**

Create `tests/campaign-visibility.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

const loadCampaign = ({ now, end = '2026-08-31T21:59:59Z' }) => {
  const campaign = { hidden: true, dataset: { campaignEnd: end } };
  class FakeDate extends Date {
    static now() { return now; }
  }
  const window = {
    addEventListener() {},
    matchMedia: () => ({ matches: true }),
    scrollY: 0
  };
  const document = {
    addEventListener() {},
    querySelector(selector) {
      return selector === '#summer-offer' ? campaign : null;
    },
    querySelectorAll() { return []; },
    body: { classList: { toggle() {}, add() {}, remove() {} } }
  };
  vm.runInNewContext(script, { window, document, Date: FakeDate });
  return campaign;
};

test('shows the campaign before its Interlaken end time', () => {
  const campaign = loadCampaign({ now: Date.parse('2026-08-31T21:59:58Z') });
  assert.equal(campaign.hidden, false);
});

test('keeps the campaign hidden after its end time', () => {
  const campaign = loadCampaign({ now: Date.parse('2026-08-31T22:00:00Z') });
  assert.equal(campaign.hidden, true);
});

test('keeps the campaign hidden when its end date is malformed', () => {
  const campaign = loadCampaign({ now: Date.parse('2026-07-18T12:00:00Z'), end: 'not-a-date' });
  assert.equal(campaign.hidden, true);
});
```

- [ ] **Step 3: Run both focused tests and verify expected failures**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/campaign-visibility.test.mjs
```

Expected: FAIL because the campaign asset, markup, cache version, and visibility controller do not exist.

- [ ] **Step 4: Create the optimized campaign image**

Run:

```powershell
$env:NODE_PATH='C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$node='C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$source='C:\Users\v-bes\.codex\generated_images\019f70dc-5e55-70f2-bebf-9943ff209cc3\exec-a9449763-1481-473d-b076-e36ee919cc9a.png'
$target='images\summer-drinks-campaign.webp'
& $node -e "const sharp=require('sharp'); sharp(process.argv[1]).resize({width:1536,withoutEnlargement:true}).webp({quality:84}).toFile(process.argv[2]);" $source $target
```

Expected: `images/summer-drinks-campaign.webp` exists at 1536×1024 and remains below 450 KB.

- [ ] **Step 5: Add no-script fallback and campaign markup**

Add this inside `<head>` after the main stylesheet:

```html
<noscript><style>#summer-offer[hidden] { display: block !important; }</style></noscript>
```

Insert this section after `.quick-promise` and before `#favourites`:

```html
<section class="summer-offer" id="summer-offer" aria-labelledby="summer-offer-title" hidden data-campaign-end="2026-08-31T21:59:59Z">
  <div class="container">
    <div class="summer-offer-shell">
      <div class="summer-offer-media">
        <img src="images/summer-drinks-campaign.webp" alt="Brown Sugar Milk Tea, Yummy Strawberry and Matcha Latte" width="1536" height="1024" loading="lazy" decoding="async">
      </div>
      <div class="summer-offer-copy">
        <div class="summer-offer-topline">
          <p>The B's Club · Walk-in special</p>
          <span>Limited time</span>
        </div>
        <h2 id="summer-offer-title">3 drinks.<br><em>1 summer offer.</em></h2>
        <p class="summer-offer-lead">Pick yours and save 12% in store.</p>
        <div class="summer-price-list" aria-label="Campaign prices">
          <div class="summer-price-row"><span>Brown Sugar Milk Tea</span><span><del>CHF 7.90</del><strong>CHF 6.95</strong></span></div>
          <div class="summer-price-row"><span>Yummy Strawberry</span><span><del>CHF 7.90</del><strong>CHF 6.95</strong></span></div>
          <div class="summer-price-row"><span>Matcha Latte</span><span><del>CHF 8.90</del><strong>CHF 7.80</strong></span></div>
        </div>
        <p class="summer-code">Show code <strong>BS12</strong> at checkout</p>
        <div class="summer-offer-actions">
          <a class="button summer-offer-button" href="https://maps.google.com/?q=Jungfraustrasse+46,+3800+Interlaken" target="_blank" rel="noopener" data-cta="directions" data-cta-location="campaign">Get Directions <span aria-hidden="true">↗</span></a>
          <p>In store only<br>Until 31 August 2026</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

Bump the existing cache-versioned script tag to:

```html
<script src="script.js?v=20260718-3" defer></script>
```

- [ ] **Step 6: Add the approved responsive visual system**

Add this base block before the existing favourites styles in `styles.css`:

```css
.summer-offer { padding: 96px 0 110px; background: var(--paper); }
.summer-offer-shell { display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(380px, .92fr); min-height: 590px; overflow: hidden; border-radius: 30px; background: linear-gradient(145deg, #ef725d, #f5ae51); color: #171310; box-shadow: 0 28px 80px rgba(69, 29, 18, .2); }
.summer-offer-media { position: relative; min-height: 590px; overflow: hidden; background: #f08a5f; }
.summer-offer-media::after { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 68%, rgba(239,114,93,.8)); content: ""; pointer-events: none; }
.summer-offer-media img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.summer-offer-copy { position: relative; display: flex; flex-direction: column; padding: 50px 46px 40px 26px; }
.summer-offer-copy::after { position: absolute; top: -8px; right: -18px; color: rgba(255,255,255,.11); font-size: 110px; font-weight: 700; line-height: 1; content: "12%"; transform: rotate(7deg); pointer-events: none; }
.summer-offer-topline { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 14px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.summer-offer-topline span { padding: 7px 11px; border: 1px solid rgba(23,19,16,.5); border-radius: 999px; }
.summer-offer-copy h2 { position: relative; z-index: 1; margin-top: 60px; font-family: var(--font-display); font-size: clamp(48px, 5.2vw, 68px); font-weight: 600; line-height: .92; letter-spacing: -.045em; }
.summer-offer-copy h2 em { color: #fff8e9; }
.summer-offer-lead { position: relative; z-index: 1; margin-top: 15px; font-size: 17px; font-weight: 600; }
.summer-price-list { position: relative; z-index: 1; display: grid; gap: 1px; margin-top: auto; overflow: hidden; border-radius: 16px; background: rgba(23,19,16,.17); }
.summer-price-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 13px 15px; background: rgba(255,255,255,.68); backdrop-filter: blur(8px); }
.summer-price-row > span:first-child { font-size: 13px; font-weight: 700; }
.summer-price-row > span:last-child { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
.summer-price-row del { opacity: .52; font-size: 11px; }
.summer-price-row strong { font-size: 20px; font-weight: 700; }
.summer-code { position: relative; z-index: 1; margin-top: 16px; font-size: 14px; }
.summer-code strong { display: inline-block; margin-inline: 4px; padding: 3px 8px; border: 1px dashed currentColor; border-radius: 6px; font-size: 17px; letter-spacing: .08em; }
.summer-offer-actions { position: relative; z-index: 1; display: flex; align-items: center; gap: 16px; margin-top: 16px; }
.summer-offer-button { background: #171310; color: #fff; }
.summer-offer-actions > p { opacity: .72; font-size: 11px; line-height: 1.4; }
```

Add to the existing `@media (max-width: 960px)` block:

```css
.summer-offer-shell { grid-template-columns: 1fr; }
.summer-offer-media { min-height: 390px; }
.summer-offer-media::after { background: linear-gradient(0deg, rgba(239,114,93,.82), transparent 42%); }
.summer-offer-copy { margin-top: -30px; padding: 34px 34px 38px; }
.summer-offer-copy h2 { margin-top: 34px; }
.summer-price-list { margin-top: 30px; }
```

Add to the existing `@media (max-width: 560px)` block:

```css
.summer-offer { padding: 50px 0 74px; }
.summer-offer .container { width: 100%; }
.summer-offer-shell { border-radius: 0; }
.summer-offer-media { min-height: 300px; }
.summer-offer-copy { padding: 30px 20px 32px; }
.summer-offer-copy h2 { font-size: 47px; }
.summer-offer-topline { align-items: flex-start; }
.summer-price-row { padding: 12px; }
.summer-price-row > span:first-child { max-width: 155px; }
.summer-offer-actions { align-items: flex-start; flex-direction: column; }
```

- [ ] **Step 7: Implement fail-closed expiry visibility**

Add this near the top of the `script.js` IIFE, after `reducedMotion` is defined:

```js
const campaignOffer = document.querySelector('#summer-offer');
const campaignEnd = campaignOffer?.dataset.campaignEnd;
if (campaignOffer && campaignEnd) {
  const endTimestamp = Date.parse(campaignEnd);
  if (Number.isFinite(endTimestamp) && Date.now() <= endTimestamp) {
    campaignOffer.hidden = false;
  }
}
```

Do not change consent code or the directions handler. The existing handler discovers the new campaign anchor automatically and sends exactly one event with `cta_location: 'campaign'`.

- [ ] **Step 8: Run focused and full tests**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs tests/campaign-visibility.test.mjs tests/directions-tracking.test.mjs tests/consent-mode.test.mjs
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: every test PASS; there are no failures, skips, todos, warnings, or duplicate `directions_click` events.

- [ ] **Step 9: Commit campaign UI and behavior**

```powershell
git add index.html styles.css script.js images/summer-drinks-campaign.webp tests/site-content.test.mjs tests/campaign-visibility.test.mjs
git commit -m "Add BS12 summer walk-in campaign"
```

---

### Task 3: Verify the production candidate on desktop and mobile

**Files:**
- Verify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\index.html`
- Verify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\styles.css`
- Verify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\script.js`
- Verify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\images\summer-drinks-campaign.webp`
- Verify: `C:\Users\v-bes\Documents\Ai System\TheBsClub\images\yummy-strawberry-campaign.webp`

**Interfaces:**
- Consumes: completed static-site branch and its automated tests.
- Produces: an evidence-backed preview ready for user approval; no merge, publication, POS change, or paid-ad activation.

- [ ] **Step 1: Verify the branch is clean and run the complete suite from scratch**

Run:

```powershell
git status --short --branch
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
git diff --check origin/main...HEAD
```

Expected: clean feature branch; all tests PASS; `git diff --check` returns no whitespace errors.

- [ ] **Step 2: Start a local static preview**

Run from the repository root:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m http.server 4173
```

Expected: `http://localhost:4173/` serves the production candidate with no 404 responses for either new WebP asset.

- [ ] **Step 3: Verify desktop behavior**

At a desktop viewport near 1440×900, confirm:

- metadata-visible content contains no brunch, breakfast, avocado toast, or all-day comfort food claim;
- the Professional A section shows exactly three drinks, the approved headline and offer line, all three price pairs, code `BS12`, end date, and one dominant `Get Directions` button;
- the image is sharp and cropped without cutting off the cups;
- Menu and Uber Eats remain secondary and functional;
- Accept Analytics and Reject still work, Privacy settings reopens the banner, and there are no console errors.

- [ ] **Step 4: Verify mobile behavior**

At 390×844, confirm:

- campaign image stacks above copy;
- headline, all prices, `BS12`, terms, and CTA fit without horizontal overflow;
- the sticky mobile actions do not cover the campaign CTA or footer controls;
- Directions, Menu, and Uber Eats remain visible and usable;
- the consent banner sits above the mobile action bar;
- reduced-motion mode leaves the content visible;
- there are no console errors or warnings.

- [ ] **Step 5: Verify analytics and expiry manually**

Before accepting analytics, click the campaign Directions button and confirm navigation is not blocked. Then accept analytics, record the current number of queued `directions_click` events, click the campaign button once, and confirm the count increases by exactly one with `cta_location: 'campaign'`.

In the browser console, temporarily set the campaign element back to hidden and evaluate the visibility controller with a timestamp after `2026-08-31T21:59:59Z`; confirm the section stays hidden. Restore the real page without committing any debug code.

- [ ] **Step 6: Prepare the approval handoff**

Provide the user with:

- the local or branch preview;
- before/after content summary;
- final test count and mobile viewport tested;
- both optimized asset sizes;
- explicit launch gates still outstanding: POS items created, staff briefed on `BS12`, and production preview approved.

Do not merge, publish, or activate CHF 5/day Google Ads during this task. Those actions require the user's confirmation after the preview.
