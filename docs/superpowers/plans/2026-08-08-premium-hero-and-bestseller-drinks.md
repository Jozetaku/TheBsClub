# Premium Hero and Bestseller Drinks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the provisional food Hero with the approved Spicy Basil Grab & Go image and add a premium four-product bestseller drinks showcase without removing any full-menu links.

**Architecture:** Keep campaign photography in a swappable product layer under the existing Mini Makers/ladder overlay. Build the drinks showcase as semantic HTML with one lead Brown Sugar card and three supporting cards; every card routes to the existing menu dialog through the current `data-menu` interface. The original menu dialog, category cards and mobile Menu action remain the single full-menu system.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, Node.js built-in test runner, Codex in-app browser for responsive QA.

## Global Constraints

- Do not commit until the owner has reviewed and explicitly approved the rendered website.
- Hero product: Spicy Basil Chicken in an open kraft paper takeaway bowl with white interior and clear lid behind.
- Featured drink order is exactly Brown Sugar Milk Tea, Yummy Strawberry, Matcha Latte, Mango Tea.
- Brown Sugar is the dominant feature; the other three are supporting cards.
- Brown Sugar, Yummy Strawberry and Mango Tea open the Bubble Tea menu; Matcha Latte opens the Matcha menu.
- Preserve Bubble Tea, Matcha and Coffee category menu buttons, dialog tabs and the mobile Menu action.
- Keep Mini Makers and ladders separate from product photography; use them only in the Hero and Brown Sugar feature.
- Overlay the approved logo at the visual centre of every drink cup at approximately 22% of cup width.
- Hours remain daily 11:00–21:00.
- Do not publish Vegetarian, Vegan, plant-based, made-fresh or cooked-to-order claims.

---

### Task 1: Intake final V2 product assets

**Files:**
- Create: `images/campaign/v2/spicy-basil-grab-go.png`
- Create: `images/campaign/v2/brown-sugar-milk-tea.png`
- Create: `images/campaign/v2/yummy-strawberry.png`
- Create: `images/campaign/v2/matcha-latte.png`
- Create: `images/campaign/v2/mango-tea.png`
- Create: `images/campaign/v2/brand-logo-source.png`
- Create: `images/campaign/v2/brand-logo-overlay.png`
- Create: `images/campaign/v2/mini-makers-crew.png`
- Modify: `tests/mini-makers.test.mjs`
- Modify: `tests/focused-launch.test.mjs`

**Interfaces:**
- Consumes: final V2 handoff commit `d4adc7f` and `campaign-2026-08/website-product-handoff.json`.
- Produces: stable project-local campaign asset names used by the Hero and drink cards.

- [ ] **Step 1: Write failing asset-reference tests**

Add assertions for the stable V2 paths:

```js
import { existsSync, readFileSync } from 'node:fs';

for (const asset of [
  'images/campaign/v2/spicy-basil-grab-go.png',
  'images/campaign/v2/brown-sugar-milk-tea.png',
  'images/campaign/v2/yummy-strawberry.png',
  'images/campaign/v2/matcha-latte.png',
  'images/campaign/v2/mango-tea.png',
    'images/campaign/v2/brand-logo-overlay.png'
    ,'images/campaign/v2/mini-makers-crew.png'
]) {
  assert.ok(existsSync(new URL(`../${asset}`, import.meta.url)), `missing ${asset}`);
}
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `node --test tests/mini-makers.test.mjs tests/focused-launch.test.mjs`

Expected: FAIL because the V2 project-local assets do not exist yet.

- [ ] **Step 3: Copy the final handoff files to stable names**

Copy these exact sources:

```text
campaign-2026-08/assets/source/spicy-basil-grab-go-v2.png
  -> images/campaign/v2/spicy-basil-grab-go.png
campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-v2.png
  -> images/campaign/v2/brown-sugar-milk-tea.png
campaign-2026-08/assets/final/drinks/yummy-strawberry-v2.png
  -> images/campaign/v2/yummy-strawberry.png
campaign-2026-08/assets/final/drinks/matcha-latte-v2.png
  -> images/campaign/v2/matcha-latte.png
campaign-2026-08/assets/final/drinks/mango-tea-v2.png
  -> images/campaign/v2/mango-tea.png
campaign-2026-08/assets/approved/logo.png
  -> images/campaign/v2/brand-logo-source.png
```

Extract the cream background from `brand-logo-source.png` with the installed imagegen chroma-removal helper and save the alpha result as `brand-logo-overlay.png`. Validate that the output uses an alpha channel and has transparent corners before website use.

- [ ] **Step 4: Run the focused tests and confirm GREEN**

Run: `node --test tests/mini-makers.test.mjs tests/focused-launch.test.mjs`

Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Inspect all six assets locally. Do not commit.

Generate `mini-makers-crew.png` from the owner-approved professional Mini Makers reference: realistic miniature café staff in coral shirts, dark green aprons and caps, using wooden ladders and stools. Keep it as a separate transparent overlay with no product, lettering or logo baked into the image. Retain the CSS Mini Makers as a no-image fallback.

---

### Task 2: Replace the provisional Hero product layer

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/mini-makers.test.mjs`

**Interfaces:**
- Consumes: `images/campaign/v2/spicy-basil-grab-go.png`.
- Produces: the launch Hero product layer under `.hero-makers-layer`.

- [ ] **Step 1: Update the Hero test first**

Require the V2 asset and exact accessible description:

```js
assert.match(html, /data-hero-asset="spicy-basil-grab-go-v2"/);
assert.match(html, /src="images\/campaign\/v2\/spicy-basil-grab-go\.png"/);
assert.match(html, /aria-label="Spicy basil chicken and jasmine rice in an open kraft paper takeaway bowl with a white interior and clear lid behind it, with Mini Makers climbing a ladder\."/);
```

- [ ] **Step 2: Run the Hero test and confirm RED**

Run: `node --test tests/mini-makers.test.mjs`

Expected: FAIL because the page still references the provisional green-bowl source.

- [ ] **Step 3: Update the Hero product layer**

Use this structure while preserving the separate maker overlay:

```html
<div class="mini-makers" data-hero-asset="spicy-basil-grab-go-v2" role="img" aria-label="Spicy basil chicken and jasmine rice in an open kraft paper takeaway bowl with a white interior and clear lid behind it, with Mini Makers climbing a ladder.">
  <div class="hero-product-layer">
    <img class="hero-product-image" src="images/campaign/v2/spicy-basil-grab-go.png" alt="" width="1122" height="1402" fetchpriority="high" decoding="async">
  </div>
  <div class="hero-makers-layer" aria-hidden="true">…existing ladder and workers…</div>
</div>
```

Tune only `object-position` and the overlay gradient so the kraft bowl, lid and food remain visible at desktop and mobile widths. Do not bake logo text or workers into the image.

- [ ] **Step 4: Run the Hero test and confirm GREEN**

Run: `node --test tests/mini-makers.test.mjs`

Expected: PASS.

- [ ] **Step 5: Review checkpoint**

Render desktop and mobile Hero views. Confirm the ladder and workers sit above the food photo and the image does not overflow. Do not commit.

---

### Task 3: Build the four-product bestseller showcase

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/focused-launch.test.mjs`
- Modify: `tests/responsive-design.test.mjs`

**Interfaces:**
- Consumes: four V2 drink images plus `brand-logo-overlay.png`.
- Produces: `.bestseller-showcase`, `.bestseller-lead` and `.bestseller-card` components.

- [ ] **Step 1: Write failing semantic and order tests**

Require exactly four cards in rank order and correct menu routing:

```js
const bestseller = html.match(/<div class="bestseller-showcase"[\s\S]*?<\/div>\s*<div class="drink-category-grid">/)?.[0] ?? '';
assert.ok(bestseller.indexOf('Brown Sugar Milk Tea') < bestseller.indexOf('Yummy Strawberry'));
assert.ok(bestseller.indexOf('Yummy Strawberry') < bestseller.indexOf('Matcha Latte'));
assert.ok(bestseller.indexOf('Matcha Latte') < bestseller.indexOf('Mango Tea'));
assert.equal((bestseller.match(/class="bestseller-card/g) ?? []).length, 4);
assert.match(bestseller, /data-drink="Brown Sugar Milk Tea"[\s\S]*data-menu="bubble"/);
assert.match(bestseller, /data-drink="Matcha Latte"[\s\S]*data-menu="matcha"/);
```

- [ ] **Step 2: Run focused launch tests and confirm RED**

Run: `node --test tests/focused-launch.test.mjs tests/responsive-design.test.mjs`

Expected: FAIL because the current section is a five-line ranking rather than the approved visual showcase.

- [ ] **Step 3: Replace the ranking with four semantic cards**

Each card contains rank, product image, an overlaid logo image with empty alt, product name, exact handoff copy and a menu button. Use these exact data and routes:

```text
01 Brown Sugar Milk Tea -> bubble
Our bestselling milk tea with deep brown-sugar ribbons and chewy pearls.

02 Yummy Strawberry -> bubble
Bright strawberry fruit tea with a juicy ruby finish.

03 Matcha Latte -> matcha
Creamy milk, earthy matcha and chewy pearls in clean layers.

04 Mango Tea -> bubble
Golden mango tea with a refreshing tropical finish.
```

Use the exact handoff alt text for each product `<img>`. Place `brand-logo-overlay.png` in a separate `.drink-cup-logo` element centred over the visual cup at approximately 22% of the cup width.

- [ ] **Step 4: Implement the responsive hierarchy**

Desktop: Brown Sugar spans the lead column and the three supporting cards occupy a compact grid. Tablet: Brown Sugar spans full width above three cards. Mobile: four cards stack in rank order. Keep Mini Makers and one ladder only inside `.bestseller-lead`; hide the extra maker on narrow screens and respect `prefers-reduced-motion`.

- [ ] **Step 5: Run focused launch tests and confirm GREEN**

Run: `node --test tests/focused-launch.test.mjs tests/responsive-design.test.mjs`

Expected: PASS.

- [ ] **Step 6: Review checkpoint**

Inspect the four-card section at desktop, tablet and mobile widths. Confirm logo placement looks centred on every cup and supporting cards are not visually crowded. Do not commit.

---

### Task 4: Preserve every existing full-menu path

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify only if a regression is found: `index.html`, `script.js`

**Interfaces:**
- Consumes: the existing `.menu-open[data-menu]` delegated dialog handler.
- Produces: unchanged full-menu access from bestseller cards, category cards, dialog tabs and mobile action.

- [ ] **Step 1: Expand the menu-regression test**

Assert all required routes:

```js
for (const menu of ['bubble', 'matcha', 'coffee']) {
  assert.match(html, new RegExp(`data-dialog-menu="${menu}"`));
}
assert.match(html, /class="mobile-actions"[\s\S]*data-menu="bubble"/);
assert.ok((html.match(/class="[^"]*menu-open[^"]*"[^>]*data-menu="bubble"/g) ?? []).length >= 5);
assert.ok((html.match(/class="[^"]*menu-open[^"]*"[^>]*data-menu="matcha"/g) ?? []).length >= 2);
assert.match(html, /data-menu="coffee"/);
```

- [ ] **Step 2: Run the menu-regression test**

Run: `node --test tests/site-content.test.mjs`

Expected: PASS after the bestseller cards are connected to the existing menu interface. If it fails, restore the missing existing button or `data-menu` attribute; do not create a second dialog system.

- [ ] **Step 3: Exercise the dialog in the browser**

Click Brown Sugar, Matcha Latte, the Coffee category button and the mobile Menu action. Confirm the same dialog opens with the correct tab selected, focus enters the dialog, Escape closes it and focus returns to the trigger.

- [ ] **Step 4: Review checkpoint**

Record the verified routes in the handoff summary. Do not commit.

---

### Task 5: Full verification and owner review

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `cursor.js`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: completed Hero, bestseller showcase and unchanged menu system.
- Produces: an uncommitted working website ready for owner approval.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Perform responsive browser QA**

Check 1440×1100, 820×1180 and 390×844 viewports. Confirm no horizontal overflow, product crops remain readable, Mini Makers do not cover product names or buttons, the bottom quick actions do not obscure content and reduced-motion disables maker animation.

- [ ] **Step 3: Check browser diagnostics**

Expected: no console errors, all five V2 product images load with non-zero natural dimensions and every menu trigger remains keyboard accessible.

- [ ] **Step 4: Present the local page to the owner**

Leave `http://127.0.0.1:53897/#top` open for inspection and summarize the Hero, four bestseller cards and preserved menu routes.

- [ ] **Step 5: Hold the commit gate**

Do not stage or commit. Commit only after the owner explicitly approves the rendered result.
