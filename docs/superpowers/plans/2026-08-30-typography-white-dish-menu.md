# Typography and White-Dish Menu Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relax non-radio H1 spacing, replace kraft-bowl main-meal photography with consistent white ceramic service ware, and reduce Food + Boba to six evenly arranged sets.

**Architecture:** Keep the existing static-site structure and context-specific typography selectors. Treat the shared menu catalog as the source of truth for set availability, keep localized visible HTML and JSON-LD synchronized with it, and add new versioned raster assets rather than overwriting rollback sources. Build Review Hub output from its source after changing its H1 CSS.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js built-in test runner, Review Hub Node build script, OpenAI image generation, GitHub Pages.

## Global Constraints

- Do not change typography in `music/`.
- Reduce each included H1 by exactly 2 CSS pixels at every viewport width.
- Homepage H1 line height is `0.94`; homepage tagline line height is `1.08`.
- Article H1 line height is `1.02` on desktop and `1.04` on mobile.
- Review Hub H1 line height is `0.96`.
- Preserve all H1 wording, fonts, colours, letter spacing and semantic levels.
- Use a white ceramic main bowl plus a separate white ceramic jasmine-rice bowl on a wooden board.
- New meal photographs contain no drink, straw, text overlay, invented logo, person, kraft paper, cardboard or paper food container.
- Katsu shows exactly seven small round breaded chicken bites, not sliced cutlet pieces.
- Remove only `thai-basil-tofu` from the Food + Boba set catalog; retain the regular Thai Basil Tofu option and both curry tofu sets.
- Do not modify sandwich-set or Food + Boba combo-set photography.
- Keep all previous campaign image files for rollback.

---

## File Structure

- `menu-data.js` — canonical sandwich and Food + Boba set catalog.
- `index.html` — German visible set cards, order controls, JSON-LD, main meal images and hero.
- `en/index.html` — English mirror of the same structures.
- `styles.css` — homepage and shared-page typography.
- `articles/autumn-interlaken/article.css` — English and German autumn article typography.
- `review/src/review.css` — source typography for Review Hub.
- `review/dist/review.css` — generated Review Hub CSS published by Pages.
- `images/campaign/v6/` — new white-ceramic main-meal photography only.
- `tests/menu-sets.test.mjs` — catalog count, prices and localized publication contract.
- `tests/typography-polish.test.mjs` — exact non-radio H1 and tagline CSS contract.
- `tests/asian-menu.test.mjs` — main meal card image mapping and alt text.
- `tests/mini-makers.test.mjs` — homepage hero image contract.
- `review/tests/style.test.mjs` — generated Review Hub typography contract.
- `README.md` — maintained set catalog documentation.

---

### Task 1: Remove Thai Basil Tofu from the Set Catalog

**Files:**
- Modify: `tests/menu-sets.test.mjs`
- Modify: `menu-data.js`
- Modify: `index.html`
- Modify: `en/index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: `TheBsMenu.foodCombos`, `TheBsMenu.getMenuItem(id)` and localized static set markup.
- Produces: six Food + Boba records, no `thai-basil-tofu` set lookup, six localized cards and six localized set-order options.

- [ ] **Step 1: Write the failing six-set catalog test**

Replace the seven-set assertion in `tests/menu-sets.test.mjs` with this contract and add the localized absence checks:

```js
test('publishes all six Food + Boba combos at one all-inclusive price each', () => {
  assert.deepEqual(
    Object.fromEntries(menu.foodCombos.map(({ id, price }) => [id, price])),
    {
      'katsu-chicken': 23.90,
      'red-curry-chicken': 24.90,
      'green-curry-chicken': 24.90,
      'thai-basil-chicken': 24.90,
      'red-curry-tofu': 23.90,
      'green-curry-tofu': 23.90,
    },
  );
  assert.equal(menu.getMenuItem('thai-basil-tofu'), null);
  assert.ok(menu.foodCombos.every((item) => item.drinks === 1));
  assert.ok(menu.foodCombos.every((item) => item.surcharge === 0));
  assert.equal(menu.getMenuItem('tofu-katsu'), null);
});
```

Inside `publishes every approved set on both language homepages`, add:

```js
assert.equal((de.match(/class="food-combo-card/g) ?? []).length, 6);
assert.equal((en.match(/class="food-combo-card/g) ?? []).length, 6);
for (const html of [de, en]) {
  assert.doesNotMatch(html, /thai-basil-tofu|Thai Basil Tofu/);
}
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
node --test tests/menu-sets.test.mjs
```

Expected: FAIL because the catalog and both homepages still publish `thai-basil-tofu` and seven cards.

- [ ] **Step 3: Remove the catalog record**

Delete the `names['thai-basil-tofu']` entry and use this exact `foodCombos` list in `menu-data.js`:

```js
const foodCombos = Object.freeze([
  { id: 'katsu-chicken', price: 23.90, protein: 'chicken' },
  { id: 'red-curry-chicken', price: 24.90, protein: 'chicken' },
  { id: 'green-curry-chicken', price: 24.90, protein: 'chicken' },
  { id: 'thai-basil-chicken', price: 24.90, protein: 'chicken' },
  { id: 'red-curry-tofu', price: 23.90, protein: 'tofu' },
  { id: 'green-curry-tofu', price: 23.90, protein: 'tofu' }
].map((item) => freezeItem({
  ...item,
  kind: 'food-boba',
  sandwiches: 0,
  drinks: 1,
  surcharge: 0,
  image: `/images/campaign/v5/food-boba-${item.id}.jpg`
})));
```

- [ ] **Step 4: Remove every localized set surface**

In both `index.html` and `en/index.html`, delete only these three `thai-basil-tofu` surfaces:

1. Its `MenuItem` object inside the JSON-LD Food + Boba `hasMenuItem` array.
2. Its `<article class="food-combo-card ..." data-set-id="thai-basil-tofu">...</article>` block.
3. Its `<option value="thai-basil-tofu">...</option>` inside the direct set-order select.

Do not remove the regular-menu checkbox whose value is `Spicy Basil — Tofu` or `Spicy Basil · Tofu`.

- [ ] **Step 5: Synchronize catalog documentation**

In `README.md`, change `The ten stable catalog IDs` to `The nine stable catalog IDs` and remove only:

```md
- `thai-basil-tofu` — CHF 21.90
```

- [ ] **Step 6: Run focused tests and verify GREEN**

Run:

```powershell
node --test tests/menu-sets.test.mjs tests/order-builder.test.mjs tests/order-contact.test.mjs tests/bilingual-homepage.test.mjs
```

Expected: all tests PASS; the catalog has six Food + Boba records and localized pages contain no removed set.

- [ ] **Step 7: Commit the set removal**

```powershell
git add menu-data.js index.html en/index.html README.md tests/menu-sets.test.mjs
git commit -m "feat: reduce food boba catalog to six sets"
```

---

### Task 2: Relax H1 and Homepage Tagline Spacing

**Files:**
- Create: `tests/typography-polish.test.mjs`
- Modify: `styles.css`
- Modify: `articles/autumn-interlaken/article.css`
- Modify: `review/src/review.css`
- Modify: `review/tests/style.test.mjs`
- Regenerate: `review/dist/review.css`

**Interfaces:**
- Consumes: the existing context-specific `.hero-copy h1`, `.article-hero h1` and `.welcome h1` selectors.
- Produces: exact CSS contracts for a 2px reduction and relaxed line boxes without changing Music Radio.

- [ ] **Step 1: Create the failing root typography test**

Create `tests/typography-polish.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const home = read('../styles.css');
const article = read('../articles/autumn-interlaken/article.css');
const review = read('../review/src/review.css');
const music = read('../music/station-theme.css');

test('reduces every non-radio H1 by exactly two pixels', () => {
  for (const value of [
    'calc(clamp(54px, 6vw, 88px) - 2px)',
    'calc(clamp(52px, 11.5vw, 78px) - 2px)',
    'calc(clamp(45px, 14vw, 62px) - 2px)',
  ]) assert.match(home, new RegExp(value.replace(/[()]/g, '\\$&')));

  assert.match(article, /font-size:\s*calc\(clamp\(52px, 7\.1vw, 96px\) - 2px\)/);
  assert.match(article, /font-size:\s*calc\(clamp\(42px, 13vw, 57px\) - 2px\)/);
  assert.match(article, /@media \(max-width: 380px\)[\s\S]*?\.article-hero h1\s*\{[^}]*font-size:\s*37px/);
  assert.match(review, /font-size:\s*calc\(clamp\(48px, 14vw, 76px\) - 2px\)/);
  assert.match(review, /font-size:\s*calc\(clamp\(68px, 9vw, 76px\) - 2px\)/);
});

test('uses relaxed context-specific heading line boxes', () => {
  assert.match(home, /\.hero-copy h1\s*\{[^}]*line-height:\s*\.94/s);
  assert.match(home, /\.hero-tagline\s*\{[^}]*line-height:\s*1\.08/s);
  assert.match(article, /\.article-hero h1\s*\{[^}]*line-height:\s*1\.02/s);
  assert.match(article, /@media \(max-width: 560px\)[\s\S]*?\.article-hero h1\s*\{[^}]*line-height:\s*1\.04/s);
  assert.match(review, /\.welcome h1\s*\{[^}]*line-height:\s*0\.96/s);
});

test('leaves Global Music Radio typography unchanged', () => {
  assert.match(music, /h1 \{ font-size: clamp\(3\.2rem, 8vw, 6\.5rem\);\s+line-height: \.94/);
  assert.doesNotMatch(music, /calc\(clamp\(3\.2rem, 8vw, 6\.5rem\) - 2px\)/);
});
```

- [ ] **Step 2: Extend the Review Hub generated-style contract**

Add to `review/tests/style.test.mjs`:

```js
test('publishes the approved calmer H1 scale and spacing', () => {
  assert.match(css, /\.welcome h1\s*\{[^}]*font-size:\s*calc\(clamp\(48px, 14vw, 76px\) - 2px\)[^}]*line-height:\s*0\.96/s);
  assert.match(css, /@media\s*\(min-width:\s*760px\)[\s\S]*?\.welcome h1\s*\{[^}]*font-size:\s*calc\(clamp\(68px, 9vw, 76px\) - 2px\)/s);
});
```

- [ ] **Step 3: Run both tests and verify RED**

Run:

```powershell
node --test tests/typography-polish.test.mjs
Push-Location review
npm test
Pop-Location
```

Expected: root typography assertions FAIL on current sizes/line heights; Review Hub style test FAIL on current generated CSS.

- [ ] **Step 4: Implement the homepage typography values**

In the later Bold Asian Club `.hero-copy h1` block and responsive overrides in `styles.css`, set:

```css
.hero-copy h1 {
  max-width: 720px;
  font-size: calc(clamp(54px, 6vw, 88px) - 2px);
  font-weight: 900;
  line-height: .94;
  letter-spacing: -.065em;
  text-transform: uppercase;
}

.hero-tagline {
  margin-top: 24px;
  font-family: var(--font-accent);
  font-size: clamp(25px, 2.5vw, 38px);
  line-height: 1.08;
}

@media (max-width: 820px) {
  .hero-copy h1 { font-size: calc(clamp(52px, 11.5vw, 78px) - 2px); }
}

@media (max-width: 560px) {
  .hero-copy h1 { font-size: calc(clamp(45px, 14vw, 62px) - 2px); }
}
```

- [ ] **Step 5: Implement the article typography values**

In `articles/autumn-interlaken/article.css`, use:

```css
.article-hero h1 {
  max-width: 940px;
  margin-top: 24px;
  font-size: calc(clamp(52px, 7.1vw, 96px) - 2px);
  line-height: 1.02;
}

@media (max-width: 560px) {
  .article-hero h1 {
    margin-top: 19px;
    font-size: calc(clamp(42px, 13vw, 57px) - 2px);
    line-height: 1.04;
  }
}

@media (max-width: 380px) {
  .article-hero h1 { font-size: 37px; }
}
```

- [ ] **Step 6: Implement and build Review Hub typography**

In `review/src/review.css`, use:

```css
.welcome h1 {
  margin: 0;
  font-family: var(--display);
  font-size: calc(clamp(48px, 14vw, 76px) - 2px);
  font-weight: 500;
  line-height: 0.96;
  letter-spacing: -0.055em;
}

@media (min-width: 760px) {
  .welcome h1 {
    font-size: calc(clamp(68px, 9vw, 76px) - 2px);
    white-space: nowrap;
  }
}
```

Regenerate the published output:

```powershell
Push-Location review
npm run build
Pop-Location
```

- [ ] **Step 7: Run focused typography tests and verify GREEN**

```powershell
node --test tests/typography-polish.test.mjs tests/responsive-design.test.mjs tests/autumn-article-content.test.mjs
Push-Location review
npm test
Pop-Location
```

Expected: all tests PASS; Music Radio remains unchanged.

- [ ] **Step 8: Commit typography changes**

```powershell
git add styles.css articles/autumn-interlaken/article.css tests/typography-polish.test.mjs review/src/review.css review/dist/review.css review/tests/style.test.mjs
git commit -m "fix: relax non-radio heading typography"
```

---

### Task 3: Replace Kraft Main-Meal Photography

**Files:**
- Create: `images/campaign/v6/spicy-basil-white-ceramic.jpg`
- Create: `images/campaign/v6/red-curry-white-ceramic.jpg`
- Create: `images/campaign/v6/katsu-curry-white-ceramic.jpg`
- Modify: `tests/asian-menu.test.mjs`
- Modify: `tests/mini-makers.test.mjs`
- Modify: `index.html`
- Modify: `en/index.html`

**Interfaces:**
- Consumes: current Green Curry image `images/campaign/v5/green-curry-chicken.jpg`, current dish references and corrected seven-bite Katsu set image.
- Produces: three 1200 × 1500 JPEG meal-card assets, localized alt text and a white-ceramic homepage hero.

- [ ] **Step 1: Write failing card-image mapping tests**

In `tests/asian-menu.test.mjs`, replace the expected image array with:

```js
const expectedImages = [
  ['spicy-basil', 'v6/spicy-basil-white-ceramic.jpg', 'Spicy Basil chicken in a white ceramic bowl with jasmine rice in a separate white bowl'],
  ['green-curry', 'v5/green-curry-chicken.jpg', 'Green Curry chicken with vegetables and jasmine rice in white ceramic bowls'],
  ['red-curry', 'v6/red-curry-white-ceramic.jpg', 'Red Curry chicken in a white ceramic bowl with jasmine rice in a separate white bowl'],
  ['katsu-curry', 'v6/katsu-curry-white-ceramic.jpg', 'Crispy Chicken Katsu Curry with seven round chicken bites and jasmine rice in white ceramic bowls'],
];
```

After the existing card assertions, add:

```js
const foodSection = html.match(/<section class="section asian-menu"[\s\S]*?<\/section>/)?.[0] ?? '';
assert.doesNotMatch(foodSection, /kraft|paper|cardboard|Boba drink|coffee/i);
```

- [ ] **Step 2: Write the failing hero-image contract**

In `tests/mini-makers.test.mjs`, expect:

```js
assert.match(html, /class="mini-makers"[^>]*data-hero-asset="spicy-basil-white-ceramic-v6"[^>]*role="img"[^>]*aria-label="Spicy Basil chicken in a white ceramic bowl with jasmine rice in a separate white bowl\."/);
assert.match(html, /class="hero-product-image"[^>]*src="\/images\/campaign\/v6\/spicy-basil-white-ceramic\.jpg"[^>]*alt=""/);
assert.doesNotMatch(html, /spicy-basil-grab-go|kraft paper takeaway bowl/i);
```

- [ ] **Step 3: Run image contract tests and verify RED**

```powershell
node --test tests/asian-menu.test.mjs tests/mini-makers.test.mjs
```

Expected: FAIL because v6 files and mappings do not exist and current copy describes kraft takeaway bowls.

- [ ] **Step 4: Generate Thai Basil photography with the imagegen skill**

Use `imagegen` with these references:

```text
images/campaign/v5/green-curry-chicken.jpg
images/campaign/v3/spicy-basil.png
```

Prompt:

```text
Create a photorealistic 4:5 restaurant menu photograph for The B's Club. Match the exact white ceramic main bowl, separate small white ceramic jasmine-rice bowl, wooden serving board, white table and softly blurred real café atmosphere of the Green Curry reference. The main dish is Thai Basil Chicken: sliced chicken, Thai holy basil, garlic, fresh red chilli and green beans or similar seasonal vegetables, glossy stir-fried finish, no curry broth. No drink, cup, straw, text, logo, person, kraft paper, cardboard or takeaway container. Natural restaurant lighting, realistic portions and food texture. Keep both bowls fully visible and centered so the portrait image remains useful when cropped to the website's 4:3 card stage. Output 1200 × 1500 JPEG.
```

Save the accepted result as `images/campaign/v6/spicy-basil-white-ceramic.jpg` and inspect it with `view_image` at original detail.

- [ ] **Step 5: Generate Red Curry photography with the imagegen skill**

Use these references:

```text
images/campaign/v5/green-curry-chicken.jpg
images/campaign/v3/red-curry.png
```

Prompt:

```text
Create a photorealistic 4:5 restaurant menu photograph for The B's Club. Match the exact white ceramic main bowl, separate small white ceramic jasmine-rice bowl, wooden serving board, white table and softly blurred real café atmosphere of the Green Curry reference. The main dish is Thai Red Curry Chicken: sliced chicken in creamy red coconut curry with vegetables, sweet basil and fresh red chilli. It must look clearly different from Green Curry and Thai Basil. No drink, cup, straw, text, logo, person, kraft paper, cardboard or takeaway container. Natural restaurant lighting, realistic portions and food texture. Keep both bowls fully visible and centered for a 4:3 website crop. Output 1200 × 1500 JPEG.
```

Save the accepted result as `images/campaign/v6/red-curry-white-ceramic.jpg` and inspect it with `view_image` at original detail.

- [ ] **Step 6: Generate seven-bite Katsu photography with the imagegen skill**

Use these references:

```text
images/campaign/v5/green-curry-chicken.jpg
images/campaign/v5/food-boba-katsu-chicken.jpg
```

Prompt:

```text
Create a photorealistic 4:5 restaurant menu photograph for The B's Club. Match the exact white ceramic main bowl, separate small white ceramic jasmine-rice bowl, wooden serving board, white table and softly blurred real café atmosphere of the Green Curry reference. The main bowl contains Japanese curry and exactly seven separate small round breaded chicken bites. Each bite is compact and about 10% smaller than the bites in the Katsu reference. They are round chicken bites, never one large cutlet and never sliced pieces. Keep all seven countable above the sauce. No drink, cup, straw, text, logo, person, kraft paper, cardboard or takeaway container. Natural restaurant lighting and realistic crisp breading. Keep both bowls fully visible and centered for a 4:3 website crop. Output 1200 × 1500 JPEG.
```

Save the accepted result as `images/campaign/v6/katsu-curry-white-ceramic.jpg`. Inspect at original detail and count exactly seven visible bites before continuing.

- [ ] **Step 7: Update both localized homepages**

Use the new v6 paths for the three standard meal cards in `index.html` and `en/index.html`, keeping width `1200`, height `1500`, lazy loading and async decoding. Use the exact English alt text from Step 1. Use these German equivalents:

```text
Spicy Basil Poulet in einer weissen Keramikschale mit Jasminreis in einer separaten weissen Schale
Red Curry Poulet in einer weissen Keramikschale mit Jasminreis in einer separaten weissen Schale
Crispy Chicken Katsu Curry mit sieben runden Pouletstücken und Jasminreis in weissen Keramikschalen
```

Update the hero on both pages to:

```html
<div class="mini-makers" data-hero-asset="spicy-basil-white-ceramic-v6" role="img" aria-label="Spicy Basil chicken in a white ceramic bowl with jasmine rice in a separate white bowl.">
  <div class="hero-product-layer" aria-hidden="true">
    <img class="hero-product-image" src="/images/campaign/v6/spicy-basil-white-ceramic.jpg" alt="" width="1200" height="1500" fetchpriority="high" decoding="async">
  </div>
</div>
```

On the German page, localize the hero `aria-label` with the German Thai Basil alt text and a final period.

- [ ] **Step 8: Run focused image tests and verify GREEN**

```powershell
node --test tests/asian-menu.test.mjs tests/mini-makers.test.mjs tests/site-content.test.mjs
```

Expected: all tests PASS and every v6 path exists.

- [ ] **Step 9: Commit versioned meal photography**

```powershell
git add images/campaign/v6 index.html en/index.html tests/asian-menu.test.mjs tests/mini-makers.test.mjs
git commit -m "feat: standardize main meal photography"
```

---

### Task 4: Visual Audit Across Non-Radio Pages

**Files:**
- Inspect: `index.html`
- Inspect: `en/index.html`
- Inspect: `en/articles/autumn-interlaken/index.html`
- Inspect: `de/artikel/herbst-interlaken/index.html`
- Inspect: `review/dist/index.html`
- Inspect: `styles.css`
- Inspect: `articles/autumn-interlaken/article.css`
- Inspect: `review/dist/review.css`

**Interfaces:**
- Consumes: completed Tasks 1–3.
- Produces: visual evidence that headings, set rows and food crops work at representative viewports.

- [ ] **Step 1: Load the webapp-testing skill and start a local server**

Run the repository with a local static server at `http://127.0.0.1:4173/`. Use the browser-testing workflow to inspect real rendered CSS rather than file text alone.

- [ ] **Step 2: Inspect representative viewports**

Capture and inspect these routes at `1440 × 1200`, `820 × 1180` and `390 × 844`:

```text
/
/en/
/en/articles/autumn-interlaken/
/de/artikel/herbst-interlaken/
/review/
```

For each screenshot verify:

- no H1 glyph collision, clipping or cramped line box
- German and English hero title hierarchy remains strong after the 2px reduction
- German and English tagline lines have visible breathing room
- no article heading loses its designed line grouping
- Review Hub retains its intended two-line/mobile and inline/desktop composition
- six Food + Boba cards form complete rows at desktop/tablet and one readable column on mobile
- all four main meal crops show white ceramic service ware and rice
- no v6 image contains a drink or paper container

- [ ] **Step 3: Audit all visible H2/H3 headings**

Scroll each route and inspect every multiline H2/H3. The approved design makes no global H2/H3 change. If any specific heading shows touching glyphs, clipped accents or an uncomfortably compressed wrap, stop implementation and add an exact selector/value amendment plus a failing regression test to this plan before editing production CSS.

- [ ] **Step 4: Confirm Music Radio remains byte-for-byte untouched**

```powershell
git diff origin/main -- music/
```

Expected: no output.

---

### Task 5: Full Verification and Delivery

**Files:**
- Verify: all modified files
- Verify: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: all earlier task outputs.
- Produces: a clean, tested branch ready for a focused pull request.

- [ ] **Step 1: Run the complete website test suite**

```powershell
node --test tests/*.test.mjs
```

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Rebuild and test Review Hub exactly as deployment does**

```powershell
Push-Location review
npm ci
npm run build
npm test
Pop-Location
```

Expected: dependency audit reports no vulnerabilities, build exits zero and all Review Hub tests PASS.

- [ ] **Step 3: Validate JSON-LD and referenced assets**

```powershell
@('index.html','en/index.html','en/articles/autumn-interlaken/index.html','de/artikel/herbst-interlaken/index.html') | ForEach-Object {
  $content = Get-Content $_ -Raw
  [regex]::Matches($content, '<script\b[^>]*type="application/ld\+json"[^>]*>([\s\S]*?)</script>') | ForEach-Object {
    $_.Groups[1].Value | ConvertFrom-Json | Out-Null
  }
  Write-Output "JSON-LD OK: $_"
}
```

Expected: all four files report `JSON-LD OK` without parse errors.

- [ ] **Step 4: Check repository cleanliness and diff scope**

```powershell
git diff --check
git status --short
git diff --stat origin/main...HEAD
git diff origin/main...HEAD -- music/
```

Expected: no whitespace errors, no unintended files, three new v6 images, no Music Radio diff.

- [ ] **Step 5: Create the delivery pull request**

Push `codex/typography-white-dish-menu` and open a pull request into `main` with:

```text
Title: Polish typography and standardize meal photography

Summary:
- reduce non-radio H1 sizes by 2px and relax multiline spacing
- replace kraft main-meal cards with consistent white ceramic service ware
- remove Thai Basil Tofu Set so Food + Boba displays six complete cards
- preserve Music Radio and all previous campaign assets

Verification:
- complete root Node test suite
- Review Hub build and test suite
- JSON-LD parsing
- desktop, tablet and mobile visual audit
```

Do not merge until the user approves the final screenshots and pull request.
