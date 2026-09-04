# Bilingual Sandwich and Food + Boba Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a German-first, fully bilingual The B's Club website with accurate sandwich sets, seven Food + Boba combos, consistent real-shop imagery, a corrected Green Curry photograph, and complete direct-order modifiers.

**Architecture:** Keep the framework-free GitHub Pages site and its existing design system. Serve German from `/` and a complete English mirror from `/en/`; keep visible content in semantic HTML for no-JavaScript and SEO support, while `menu-data.js` and `order-builder.js` provide small, testable shared interfaces for prices and order-message construction.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, Node's built-in test runner, GitHub Pages, built-in image generation/editing.

## Global Constraints

- Begin implementation from `origin/main` at or after commit `2ca1705`; preserve all later upstream work discovered at execution time.
- German is canonical at `https://www.thebsclub.ch/`; English is canonical at `https://www.thebsclub.ch/en/`.
- Keep the existing deep-green, cream, coral, sand, editorial-serif, rounded-card visual system.
- Every available Boba drink is included at the displayed set price; there is no premium tier or drink surcharge.
- Sandwich prices are CHF 16.90, CHF 24.90, and CHF 31.90.
- Food + Boba prices are CHF 23.90 for Katsu Chicken, CHF 24.90 for Red/Green Curry Chicken and Thai Basil Chicken, CHF 21.90 for Thai Basil Tofu, and CHF 23.90 for Red/Green Curry Tofu.
- Do not add Tofu Katsu or any unverified vegetarian/vegan claim.
- Coffee remains on the website; remove it only from the Double Sandwich Set photograph.
- All food-set imagery uses white ceramic containers, the standard branded Boba cup, the real wooden board/white table, and the real The B's Club interior.
- Preserve consent mode, GA4 tracking, music, review hub, autumn guides, existing business details, and GitHub Pages deployment.
- Use Swiss German spelling conventions already present on the site, including `geniessen`, `Grösse`, and `Poulet`.

---

## Planned file structure

- `index.html` — complete German homepage and German SEO/structured data.
- `en/index.html` — complete English homepage and English SEO/structured data.
- `menu-data.js` — immutable sandwich/Food + Boba product catalog shared by UI and order logic.
- `order-builder.js` — pure selection validation and WhatsApp/email order-line generation.
- `script.js` — DOM integration, reveals, dialogs, language-switch analytics, modifier state, and handoff actions.
- `styles.css` — bilingual navigation, set-card grids, details, modifiers, and responsive treatment.
- `images/campaign/v5/` — approved corrected Green Curry, Food + Boba, and sandwich-set assets.
- `tests/bilingual-homepage.test.mjs` — routes, full-page localisation, canonical and `hreflang` contracts.
- `tests/menu-sets.test.mjs` — product names, prices, image mappings, no-surcharge and no-invented-product contracts.
- `tests/order-builder.test.mjs` — pure order selection and message output.
- `tests/order-contact.test.mjs` — form markup and DOM integration contracts.
- `tests/responsive-design.test.mjs` — new responsive layouts and controls.
- `tests/deploy-pages.test.mjs` — Pages artifact includes new route/scripts/assets.
- `sitemap.xml` — reciprocal German/English homepage alternates.
- `.github/workflows/deploy-pages.yml` — copies new browser scripts into `_site`.
- `README.md` — bilingual/menu image maintenance notes.

---

### Task 1: Create a clean execution branch from the latest deployed source

**Files:**
- Preserve: all tracked files on `origin/main`
- Integrate: `docs/superpowers/specs/2026-08-30-bilingual-sandwich-menu-design.md`
- Integrate: `docs/superpowers/plans/2026-08-30-bilingual-sandwich-food-boba-menu.md`

**Interfaces:**
- Consumes: latest `origin/main` and the current documentation-only detached HEAD
- Produces: clean branch `feature/bilingual-sandwich-food-boba` with the approved documentation present

- [ ] **Step 1: Inspect execution context using the worktree skill**

Run the read-only environment checks required by `using-git-worktrees`, then create an isolated worktree from the latest `origin/main` if the current checkout is not already isolated and clean.

- [ ] **Step 2: Fetch and verify the current upstream tip**

```powershell
git fetch origin --prune
git log -1 --oneline origin/main
git status --short
```

Expected: the upstream tip is visible and the selected execution checkout has no uncommitted product-source changes.

- [ ] **Step 3: Create the feature branch from the documentation HEAD and replay it on current main**

```powershell
git switch -c feature/bilingual-sandwich-food-boba
git rebase origin/main
```

Expected: only the documentation commits replay on top of the latest website source; no upstream product commit is dropped.

- [ ] **Step 4: Run the unmodified baseline suite**

```powershell
node --test tests/*.test.mjs
```

Expected: all baseline tests pass before feature changes.

- [ ] **Step 5: Commit only if the integration produced an unresolved documentation change**

Normally the cherry-picks are already commits. If conflict resolution was required:

```powershell
git add docs/superpowers/specs docs/superpowers/plans
git commit -m "docs: integrate bilingual menu specification"
```

### Task 2: Add the shared, exact menu catalog

**Files:**
- Create: `menu-data.js`
- Create: `tests/menu-sets.test.mjs`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `tests/deploy-pages.test.mjs`

**Interfaces:**
- Produces: `window.TheBsMenu` in browsers and `module.exports` in Node
- Produces: `sandwichSets`, `foodCombos`, `getMenuItem(id)`, and `getIncludedDrinkCount(id)`

- [ ] **Step 1: Write failing catalog and deployment tests**

Create `tests/menu-sets.test.mjs` with a CommonJS bridge:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const menu = require('../menu-data.js');

test('publishes the approved sandwich set prices and quantities', () => {
  assert.deepEqual(
    menu.sandwichSets.map(({ id, price, sandwiches, drinks }) => ({ id, price, sandwiches, drinks })),
    [
      { id: 'sandwich-regular', price: 16.90, sandwiches: 1, drinks: 1 },
      { id: 'sandwich-double', price: 24.90, sandwiches: 2, drinks: 1 },
      { id: 'sandwich-sharing', price: 31.90, sandwiches: 2, drinks: 2 },
    ],
  );
});

test('publishes all seven Food + Boba combos at one all-inclusive price each', () => {
  assert.deepEqual(
    Object.fromEntries(menu.foodCombos.map(({ id, price }) => [id, price])),
    {
      'katsu-chicken': 23.90,
      'red-curry-chicken': 24.90,
      'green-curry-chicken': 24.90,
      'thai-basil-chicken': 24.90,
      'thai-basil-tofu': 21.90,
      'red-curry-tofu': 23.90,
      'green-curry-tofu': 23.90,
    },
  );
  assert.ok(menu.foodCombos.every((item) => item.drinks === 1));
  assert.ok(menu.foodCombos.every((item) => item.surcharge === 0));
  assert.equal(menu.getMenuItem('tofu-katsu'), null);
});
```

Extend `tests/deploy-pages.test.mjs`:

```js
test('publishes shared menu and order scripts', () => {
  assert.match(workflow, /cp index\.html styles\.css menu-data\.js order-builder\.js script\.js cursor\.js \.nojekyll _site\//);
});
```

- [ ] **Step 2: Run the focused tests and confirm failure**

```powershell
node --test tests/menu-sets.test.mjs tests/deploy-pages.test.mjs
```

Expected: FAIL because `menu-data.js` and the workflow copy entries do not exist.

- [ ] **Step 3: Implement the immutable catalog**

Create `menu-data.js` as a browser/CommonJS UMD file. Every entry must include `id`, `kind`, `price`, `sandwiches`, `drinks`, `protein`, `image`, and exact `name.de`/`name.en` values. Use these image paths:

```js
const sandwichSets = [
  { id: 'sandwich-regular', kind: 'sandwich', price: 16.90, sandwiches: 1, drinks: 1, protein: 'pork', image: '/images/campaign/v5/sandwich-regular.jpg' },
  { id: 'sandwich-double', kind: 'sandwich', price: 24.90, sandwiches: 2, drinks: 1, protein: 'pork', image: '/images/campaign/v5/sandwich-double.jpg' },
  { id: 'sandwich-sharing', kind: 'sandwich', price: 31.90, sandwiches: 2, drinks: 2, protein: 'pork', image: '/images/campaign/v5/sandwich-sharing.jpg' },
];

const foodCombos = [
  { id: 'katsu-chicken', price: 23.90, protein: 'chicken' },
  { id: 'red-curry-chicken', price: 24.90, protein: 'chicken' },
  { id: 'green-curry-chicken', price: 24.90, protein: 'chicken' },
  { id: 'thai-basil-chicken', price: 24.90, protein: 'chicken' },
  { id: 'thai-basil-tofu', price: 21.90, protein: 'tofu' },
  { id: 'red-curry-tofu', price: 23.90, protein: 'tofu' },
  { id: 'green-curry-tofu', price: 23.90, protein: 'tofu' },
].map((item) => ({
  ...item,
  kind: 'food-boba',
  sandwiches: 0,
  drinks: 1,
  surcharge: 0,
  image: `/images/campaign/v5/food-boba-${item.id}.jpg`,
}));
```

Add these exact bilingual names before freezing the records:

```js
const names = {
  'sandwich-regular': { de: 'Regular Sandwich-Set', en: 'Regular Sandwich Set' },
  'sandwich-double': { de: 'Double Sandwich-Set', en: 'Double Sandwich Set' },
  'sandwich-sharing': { de: 'Sharing Sandwich-Set', en: 'Sharing Sandwich Set' },
  'katsu-chicken': { de: 'Crispy Chicken Katsu Curry + Boba-Getränk nach Wahl', en: 'Crispy Chicken Katsu Curry + Any Boba Drink' },
  'red-curry-chicken': { de: 'Thai Red Curry Chicken + Boba-Getränk nach Wahl', en: 'Thai Red Curry Chicken + Any Boba Drink' },
  'green-curry-chicken': { de: 'Thai Green Curry Chicken + Boba-Getränk nach Wahl', en: 'Thai Green Curry Chicken + Any Boba Drink' },
  'thai-basil-chicken': { de: 'Thai Basil Chicken + Boba-Getränk nach Wahl', en: 'Thai Basil Chicken + Any Boba Drink' },
  'thai-basil-tofu': { de: 'Thai Basil Tofu + Boba-Getränk nach Wahl', en: 'Thai Basil Tofu + Any Boba Drink' },
  'red-curry-tofu': { de: 'Thai Red Curry Tofu + Boba-Getränk nach Wahl', en: 'Thai Red Curry Tofu + Any Boba Drink' },
  'green-curry-tofu': { de: 'Thai Green Curry Tofu + Boba-Getränk nach Wahl', en: 'Thai Green Curry Tofu + Any Boba Drink' },
};
```

Assign `name: names[item.id]` to every record. Expose:

```js
const allItems = [...sandwichSets, ...foodCombos];
const getMenuItem = (id) => allItems.find((item) => item.id === id) || null;
const getIncludedDrinkCount = (id) => getMenuItem(id)?.drinks || 0;
```

Update the Pages workflow copy line exactly as asserted.

- [ ] **Step 4: Run focused tests**

```powershell
node --test tests/menu-sets.test.mjs tests/deploy-pages.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add menu-data.js tests/menu-sets.test.mjs tests/deploy-pages.test.mjs .github/workflows/deploy-pages.yml
git commit -m "feat: define sandwich and food boba catalog"
```

### Task 3: Produce and validate the approved image set

**Files:**
- Create: `images/campaign/v5/green-curry-chicken.jpg`
- Create: `images/campaign/v5/food-boba-katsu-chicken.jpg`
- Create: `images/campaign/v5/food-boba-red-curry-chicken.jpg`
- Create: `images/campaign/v5/food-boba-green-curry-chicken.jpg`
- Create: `images/campaign/v5/food-boba-thai-basil-chicken.jpg`
- Create: `images/campaign/v5/food-boba-thai-basil-tofu.jpg`
- Create: `images/campaign/v5/food-boba-red-curry-tofu.jpg`
- Create: `images/campaign/v5/food-boba-green-curry-tofu.jpg`
- Create: `images/campaign/v5/sandwich-regular.jpg`
- Create: `images/campaign/v5/sandwich-double.jpg`
- Create: `images/campaign/v5/sandwich-sharing.jpg`
- Modify: `tests/menu-sets.test.mjs`

**Interfaces:**
- Consumes: all twelve supplied source photographs, the current approved dish assets, and `menu-data.js` image paths
- Produces: eleven website-ready 4:5 assets, each at least 1200 × 1500 pixels

- [ ] **Step 1: Add failing asset-contract tests**

Extend `tests/menu-sets.test.mjs`:

```js
import { existsSync } from 'node:fs';

test('ships every catalog image plus the corrected Green Curry card', () => {
  for (const item of [...menu.sandwichSets, ...menu.foodCombos]) {
    assert.ok(existsSync(new URL(`..${item.image}`, import.meta.url)), item.image);
  }
  assert.ok(existsSync(new URL('../images/campaign/v5/green-curry-chicken.jpg', import.meta.url)));
});
```

- [ ] **Step 2: Run the asset test and confirm failure**

```powershell
node --test tests/menu-sets.test.mjs
```

Expected: FAIL listing the missing v5 assets.

- [ ] **Step 3: Inspect every supplied source before editing**

Use `view_image` on all six sandwich photographs and all six Green Curry Tofu/interior photographs. Record each source's role as edit target, subject reference, cup reference, container reference, or interior reference.

- [ ] **Step 4: Create the corrected Green Curry Chicken image**

Use built-in image editing with the existing Green Curry card plus the new white-bowl/interior references. Prompt requirements:

```text
Use case: precise-object-edit
Asset type: website food card, 4:5 portrait
Primary request: replace the unnatural Green Curry food rendering with realistic Thai green curry chicken and jasmine rice
Scene/backdrop: actual The B's Club white tabletop, wooden board, softly blurred real café interior
Subject: one white handled ceramic bowl of creamy green curry with natural irregular chicken pieces and vegetables, one white rice bowl
Lighting/mood: natural café window light, warm and appetising
Constraints: preserve actual bowl, portion size, board and restaurant atmosphere; no geometric grid, repeated chunks, tofu, text, watermark or invented logo
```

- [ ] **Step 5: Create seven Food + Boba images in separate calls**

Make one built-in image-generation/edit call per catalog item. Keep the exact same composition, camera height, white containers, board, table, light, and real interior. Each image shows one food serving, one rice serving, and one standard sealed branded Boba cup. Change only the named dish/protein between calls; Green Curry Tofu must use the supplied tofu photographs directly as subject references.

- [ ] **Step 6: Create the three sandwich-set assets**

- Copy Photo 2 non-destructively as the Regular source, then crop/colour-match to 4:5.
- Edit Photo 3 for Double: remove only the coffee cup and naturally reconstruct the tabletop; keep exactly two sandwiches and one Boba cup.
- Composite Sharing from the approved sandwich/cup sources: exactly two sandwiches and two standard Boba cups in the real café.

- [ ] **Step 7: Inspect and reject visual defects**

Use `view_image` on all eleven finals. Reject and regenerate any asset with a wrong count, wrong protein, fake interior, deformed white container, unreadable/invented cup branding, repeated grid-like food, floating ingredients, text, or watermark.

- [ ] **Step 8: Run the asset test**

```powershell
node --test tests/menu-sets.test.mjs
```

Expected: PASS.

- [ ] **Step 9: Commit**

```powershell
git add images/campaign/v5 tests/menu-sets.test.mjs
git commit -m "feat: add consistent sandwich and food boba photography"
```

### Task 4: Establish German and English homepage routes

**Files:**
- Modify: `index.html`
- Create: `en/index.html`
- Create: `tests/bilingual-homepage.test.mjs`

**Interfaces:**
- Produces: German `/`, English `/en/`, reciprocal canonical/alternate links, and `data-page-language`

- [ ] **Step 1: Write failing bilingual route tests**

Create `tests/bilingual-homepage.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const de = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const en = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');

test('serves complete canonical German and English homepages', () => {
  assert.match(de, /<html lang="de-CH">/);
  assert.match(de, /<body[^>]*data-page-language="de"/);
  assert.match(de, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/">/);
  assert.match(en, /<html lang="en">/);
  assert.match(en, /<body[^>]*data-page-language="en"/);
  assert.match(en, /<link rel="canonical" href="https:\/\/www\.thebsclub\.ch\/en\/">/);
});

test('declares reciprocal language alternatives', () => {
  for (const html of [de, en]) {
    assert.match(html, /hreflang="de-CH" href="https:\/\/www\.thebsclub\.ch\/"/);
    assert.match(html, /hreflang="en" href="https:\/\/www\.thebsclub\.ch\/en\/"/);
    assert.match(html, /hreflang="x-default" href="https:\/\/www\.thebsclub\.ch\/"/);
  }
});

test('provides a visible page-level language switch', () => {
  assert.match(de, /class="language-switch"[\s\S]*href="\/"[^>]*aria-current="page"[\s\S]*href="\/en\/"/);
  assert.match(en, /class="language-switch"[\s\S]*href="\/"[\s\S]*href="\/en\/"[^>]*aria-current="page"/);
});
```

- [ ] **Step 2: Run and confirm the route test fails**

```powershell
node --test tests/bilingual-homepage.test.mjs
```

Expected: FAIL because `en/index.html` does not exist and root is English.

- [ ] **Step 3: Preserve the current complete English page at `/en/`**

Copy the latest `index.html` to `en/index.html`, then change all shared asset references to root-relative URLs (`/styles.css`, `/menu-data.js`, `/order-builder.js`, `/script.js`, `/cursor.js`, and `/images/...`). Set English canonical/OG URL and reciprocal alternates exactly as tested.

- [ ] **Step 4: Convert the root document shell to German**

Set `lang="de-CH"`, `data-page-language="de"`, German title/description/Open Graph copy, German `CafeOrCoffeeShop` descriptions, and the language switch. Add scripts in this order before `script.js`:

```html
<script src="/menu-data.js" defer></script>
<script src="/order-builder.js" defer></script>
<script src="/script.js?v=20260830-1" defer></script>
```

- [ ] **Step 5: Translate every visible root-page surface**

Translate header, promo, hero, trust row, quick promises, music teaser, Asian menu, preparation note, drinks, meal completion, order/contact, story, reviews, partner, visit, footer, consent banner, mobile actions, menu dialog, form labels, validation copy, and image alternative text. Preserve names, prices, addresses, phone, opening hours, review quotations, URLs, element IDs, `data-*` hooks, and form field names.

Use `Speisen`, `Getränke`, `Musik`, `Bestellen / Kontakt`, `Unsere Geschichte`, `Besuch`, and `Herbst-Guide` for primary navigation. The English mirror retains `Food`, `Drinks`, `Music`, `Order / Contact`, `Our Story`, `Visit`, and `Autumn guide`.

- [ ] **Step 6: Run the bilingual test**

```powershell
node --test tests/bilingual-homepage.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add index.html en/index.html tests/bilingual-homepage.test.mjs
git commit -m "feat: add complete German and English homepages"
```

### Task 5: Add the Food + Boba and sandwich product sections

**Files:**
- Modify: `index.html`
- Modify: `en/index.html`
- Modify: `styles.css`
- Modify: `tests/menu-sets.test.mjs`
- Modify: `tests/responsive-design.test.mjs`

**Interfaces:**
- Consumes: `window.TheBsMenu` IDs and v5 images
- Produces: semantic sections `#food-boba-combos` and `#sandwich-sets`, `data-set-id` hooks, and accessible sandwich disclosures

- [ ] **Step 1: Add failing semantic and responsive tests**

Extend `tests/menu-sets.test.mjs` to read both homepages and assert:

```js
for (const html of [de, en]) {
  assert.match(html, /id="food-boba-combos"/);
  assert.match(html, /id="sandwich-sets"/);
  for (const item of [...menu.foodCombos, ...menu.sandwichSets]) {
    assert.match(html, new RegExp(`data-set-id="${item.id}"[\\s\\S]*?CHF ${item.price.toFixed(2)}`));
  }
  assert.doesNotMatch(html, /Premium Boba|Premium-Getränk|\+\s*CHF\s*1\.00/i);
  assert.doesNotMatch(html, /Tofu Katsu/i);
}
```

Extend `tests/responsive-design.test.mjs`:

```js
test('lays out both set collections responsively', () => {
  assert.match(css, /\.food-combo-grid\s*\{[^}]*display:\s*grid/);
  assert.match(css, /\.sandwich-set-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*\.sandwich-set-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
});
```

- [ ] **Step 2: Run focused tests and confirm failure**

```powershell
node --test tests/menu-sets.test.mjs tests/responsive-design.test.mjs
```

Expected: FAIL because the sections and styles are absent.

- [ ] **Step 3: Add the Food + Boba section to both pages**

Place it immediately after `#food`. Use seven `<article class="food-combo-card" data-set-id="...">` elements grouped under accessible `Poulet`/`Tofu` filters or headings. Every card includes the catalog image, exact localised name, quantity `1 Essen + 1 Boba-Getränk` / `1 meal + 1 Boba drink`, price, no-surcharge message, and an order anchor to `#order`.

Mark Green Curry Chicken with one `Best Value` / `Bestes Angebot` badge. Do not hide product facts behind JavaScript.

- [ ] **Step 4: Replace the existing Green Curry food-card image**

In both pages set the Green Curry card source to `/images/campaign/v5/green-curry-chicken.jpg`; update German and English alt text to describe real green curry chicken, vegetables, white bowl, and jasmine rice.

- [ ] **Step 5: Add the sandwich section to both pages**

Render Regular, Double, and Sharing cards with exact quantities/prices and the approved images. Include the full product name, `Enthält Schweinefleisch` / `Contains pork`, any-Boba copy, and Uber Eats CTA.

Below the cards use native `<details>` elements for Description, Ingredients, Allergens, and Serving Recommendation. Insert the approved German and English wording verbatim from the design spec.

- [ ] **Step 6: Add scoped responsive styles**

Add `.food-combo-grid`, `.food-combo-card`, `.combo-filter`, `.sandwich-set-grid`, `.sandwich-set-card`, `.set-quantity`, `.set-price`, and `.sandwich-details` rules using existing tokens. Use three columns above 1080 px, two columns from 821–1080 px, and one column at 820 px and below. Keep image aspect ratio 4/5 and all quantities/prices visible.

- [ ] **Step 7: Run focused tests**

```powershell
node --test tests/menu-sets.test.mjs tests/responsive-design.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add index.html en/index.html styles.css tests/menu-sets.test.mjs tests/responsive-design.test.mjs
git commit -m "feat: publish sandwich and food boba menus"
```

### Task 6: Build pure order selection and message logic

**Files:**
- Create: `order-builder.js`
- Create: `tests/order-builder.test.mjs`

**Interfaces:**
- Consumes: catalog object and selection `{ setId, quantity, drinks: [{ flavour, sweetness, ice }] }`
- Produces: `validateSetSelection(catalog, selection, language)` and `formatSetOrderLines(catalog, selection, language)`

- [ ] **Step 1: Write failing pure-logic tests**

Create `tests/order-builder.test.mjs` using `createRequire`. Cover one-drink and two-drink sets, unknown IDs, missing flavours, German/English labels, exact set price, and absence of a surcharge line:

```js
test('formats a German Sharing Set with two drinks and no surcharge', () => {
  const lines = order.formatSetOrderLines(menu, {
    setId: 'sandwich-sharing',
    quantity: 1,
    drinks: [
      { flavour: 'Matcha Latte', sweetness: '50%', ice: 'Normal' },
      { flavour: 'Mango Tea', sweetness: '25%', ice: 'Wenig' },
    ],
  }, 'de');
  assert.match(lines.join('\n'), /Sandwich-Sharing-Set/);
  assert.match(lines.join('\n'), /CHF 31\.90/);
  assert.match(lines.join('\n'), /Matcha Latte/);
  assert.match(lines.join('\n'), /Mango Tea/);
  assert.doesNotMatch(lines.join('\n'), /Premium|Aufpreis|Surcharge|\+ CHF/);
});
```

- [ ] **Step 2: Run and confirm failure**

```powershell
node --test tests/order-builder.test.mjs
```

Expected: FAIL because `order-builder.js` is missing.

- [ ] **Step 3: Implement the pure API**

Use a UMD wrapper. `validateSetSelection` returns `{ valid: boolean, errors: string[] }`; it requires 1–20 quantity, a known set ID, and exactly `getIncludedDrinkCount(setId)` non-empty drink objects. `formatSetOrderLines` throws `TypeError` when validation fails and otherwise returns an array containing localised set name, `Menge`/`Quantity`, `Set-Preis`/`Set price`, and numbered drink details. Never calculate or append a drink surcharge.

- [ ] **Step 4: Run pure tests**

```powershell
node --test tests/order-builder.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add order-builder.js tests/order-builder.test.mjs
git commit -m "feat: build set order messages"
```

### Task 7: Integrate set modifiers into the direct-order form

**Files:**
- Modify: `index.html`
- Modify: `en/index.html`
- Modify: `script.js`
- Modify: `styles.css`
- Modify: `tests/order-contact.test.mjs`

**Interfaces:**
- Consumes: `window.TheBsMenu.getMenuItem`, `window.TheBsMenu.getIncludedDrinkCount`, and `window.TheBsOrder`
- Produces: `#set-product`, `#set-quantity`, `[data-drink-modifier]`, `syncSetModifiers()`, and set lines in WhatsApp/email output

- [ ] **Step 1: Add failing form integration tests**

Extend `tests/order-contact.test.mjs`:

```js
test('collects one priced set and the exact number of included Boba choices', () => {
  assert.match(html, /id="set-product" name="setProduct"/);
  assert.match(html, /id="set-quantity" name="setQuantity" type="number" min="1" max="20"/);
  assert.equal((html.match(/data-drink-modifier/g) ?? []).length, 2);
  for (const field of ['bobaFlavour', 'sweetness', 'ice']) {
    assert.match(html, new RegExp(`name="${field}1"`));
    assert.match(html, new RegExp(`name="${field}2"`));
  }
  assert.doesNotMatch(html, /premium|surcharge|Aufpreis/i);
  assert.match(script, /syncSetModifiers/);
  assert.match(script, /formatSetOrderLines/);
});
```

- [ ] **Step 2: Run and confirm failure**

```powershell
node --test tests/order-contact.test.mjs
```

Expected: FAIL because set controls are absent.

- [ ] **Step 3: Add localised set controls to both pages**

Add a set `<select>` with a blank option plus all ten catalog items, a quantity field, and two identical drink modifier groups. Each group has flavour, sweetness, and ice selects. The second group starts hidden/disabled and becomes enabled only when `getIncludedDrinkCount(setId) === 2`.

Flavour options must contain currently available website menu names only; keep a final `Anderes verfügbares Boba-Getränk` / `Other available Boba drink` option for flavours shown in the full menu dialog. Sweetness options: 0%, 25%, 50%, 75%, 100%. Ice options: none, little, normal.

- [ ] **Step 4: Wire modifier state and validation**

In `script.js`, use `document.body.dataset.pageLanguage` as the initial order language, while preserving the existing English/German/Thai communication selector. Implement `syncSetModifiers()` to set the selected set price, enable exactly the required drink groups, clear disabled values, and attach localised validity messages.

On submit, call `formatSetOrderLines` when a set is selected and insert its result beneath `messageItems`. Existing checkbox food/drink orders remain supported. Require at least one normal item or one set.

- [ ] **Step 5: Add analytics hooks**

Emit `language_switch`, `sandwich_details_open`, `set_selection`, and `set_uber_eats_click` using stable `set_id`, `language`, and `cta_location` properties. Continue to respect the existing consent implementation.

- [ ] **Step 6: Style modifiers and error/focus states**

Use existing field borders, radii, and focus outlines. On small screens stack all selects and keep touch targets at least 44 px high. Hidden modifier groups must use `[hidden]` and disabled controls so keyboard users cannot reach irrelevant fields.

- [ ] **Step 7: Run focused tests**

```powershell
node --test tests/order-builder.test.mjs tests/order-contact.test.mjs tests/consent-mode.test.mjs
```

Expected: PASS.

- [ ] **Step 8: Commit**

```powershell
git add index.html en/index.html script.js styles.css tests/order-contact.test.mjs
git commit -m "feat: add set ordering modifiers"
```

### Task 8: Finish bilingual SEO, sitemap, deployment, and maintenance docs

**Files:**
- Modify: `index.html`
- Modify: `en/index.html`
- Modify: `sitemap.xml`
- Modify: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`
- Modify: `tests/bilingual-homepage.test.mjs`
- Modify: `tests/site-content.test.mjs`
- Modify: `tests/deploy-pages.test.mjs`

**Interfaces:**
- Produces: reciprocal homepage alternates, localised JSON-LD, sitemap entries, and reproducible Pages artifact

- [ ] **Step 1: Add failing SEO and deployment assertions**

Add tests that require:

```js
assert.match(sitemap, /<loc>https:\/\/www\.thebsclub\.ch\/en\/<\/loc>/);
assert.match(sitemap, /hreflang="de-CH" href="https:\/\/www\.thebsclub\.ch\/"/);
assert.match(sitemap, /hreflang="en" href="https:\/\/www\.thebsclub\.ch\/en\/"/);
assert.match(workflow, /cp -R en de articles _site\//);
assert.match(de, /"inLanguage": "de-CH"/);
assert.match(en, /"inLanguage": "en"/);
```

Update former English-root expectations in `tests/site-content.test.mjs` to check German root and English `/en/` separately rather than weakening business-detail assertions.

- [ ] **Step 2: Run and confirm failure**

```powershell
node --test tests/bilingual-homepage.test.mjs tests/site-content.test.mjs tests/deploy-pages.test.mjs
```

Expected: FAIL on missing sitemap/JSON-LD localisation or outdated root English expectations.

- [ ] **Step 3: Complete metadata and structured data**

Root title: `The B's Club | Asiatisches Café in Interlaken`.

English title: `The B's Club | Asian Café Interlaken`.

Each page gets its own canonical, OG URL, localised title/description, reciprocal alternates, `inLanguage`, and menu/product references for the approved set offers. Keep official business URL, address, phone, hours, price range, and images exact.

- [ ] **Step 4: Update sitemap and Pages artifact**

Add both homepage URLs with reciprocal `de-CH`, `en`, and `x-default` links. Preserve article and review entries. Ensure the Pages workflow copies `menu-data.js`, `order-builder.js`, `en/`, all v5 images through the existing images copy, and `sitemap.xml`.

- [ ] **Step 5: Document maintenance**

Add README sections describing German/English homepage ownership, the ten set IDs/prices, no-surcharge policy, v5 image invariants, how to add/remove an available Boba flavour, and the requirement to update catalog/tests/pages together.

- [ ] **Step 6: Run focused tests**

```powershell
node --test tests/bilingual-homepage.test.mjs tests/site-content.test.mjs tests/deploy-pages.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add index.html en/index.html sitemap.xml .github/workflows/deploy-pages.yml README.md tests/bilingual-homepage.test.mjs tests/site-content.test.mjs tests/deploy-pages.test.mjs
git commit -m "feat: complete bilingual menu SEO and deployment"
```

### Task 9: Full verification, visual QA, and publication

**Files:**
- Verify: all modified files and eleven v5 images
- Modify only if verification exposes a specific defect

**Interfaces:**
- Consumes: completed feature branch
- Produces: verified GitHub Pages deployment at `/` and `/en/`

- [ ] **Step 1: Run the complete automated suite**

```powershell
node --test tests/*.test.mjs
```

Expected: zero failures.

- [ ] **Step 2: Run whitespace and repository checks**

```powershell
git diff --check origin/main...HEAD
git status --short
```

Expected: no whitespace errors and no untracked deliverables.

- [ ] **Step 3: Start a local server and verify routes**

```powershell
python -m http.server 8000
```

In a second shell:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/ -UseBasicParsing
Invoke-WebRequest http://127.0.0.1:8000/en/ -UseBasicParsing
```

Expected: HTTP 200 for both pages.

- [ ] **Step 4: Perform requested browser visual QA**

Open the meaningful local preview and inspect desktop, tablet, and mobile widths. Check German/English switches, all food/sandwich cards, image counts, corrected Green Curry, filters, native details, set modifiers, keyboard focus, reduced motion, consent bar, mobile actions, and no horizontal overflow.

- [ ] **Step 5: Verify content line by line against the approved spec**

Confirm all ten set prices, every available Boba at the same set price, seven Food + Boba images, three sandwich images, no coffee in Double, two drinks in Sharing, allergens, pork disclosure, and both complete languages.

- [ ] **Step 6: Commit any verification-only fixes and rerun the full suite**

```powershell
git add index.html en/index.html menu-data.js order-builder.js script.js styles.css sitemap.xml README.md .github/workflows/deploy-pages.yml tests images/campaign/v5
git commit -m "fix: resolve bilingual menu verification findings"
node --test tests/*.test.mjs
```

Expected: zero failures after the final code state.

- [ ] **Step 7: Use the branch-finishing workflow**

Invoke `finishing-a-development-branch`, present the verified integration options, and merge/push only through the user's approved repository workflow. The GitHub Pages workflow publishes on `main`.

- [ ] **Step 8: Verify the public deployment**

After the Pages workflow succeeds, check:

```text
https://www.thebsclub.ch/
https://www.thebsclub.ch/en/
```

Confirm both return the new content, shared assets load, and canonical/alternate URLs match the live location.
