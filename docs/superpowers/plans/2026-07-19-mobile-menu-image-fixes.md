# Mobile Menu and Product Image Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove unavailable waffle claims, feature the existing Signature Latte, and correct product/campaign framing across mobile, tablet, and desktop without publishing the untested concept drink.

**Architecture:** Keep the existing static HTML/CSS architecture. Add semantic image classes only where portrait product photography needs different framing, encode all truth and responsive requirements in the existing Node content tests, then verify rendered screenshots at three agreed viewport sizes.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner, local browser screenshots, Git

## Global Constraints

- Live Signature Latte uses `images/signature-latte.jpg`, not `images/concepts/signature-latte-hot-concept-v1.png`.
- Signature Latte copy is exactly `Hot coffee`, `Signature Latte`, and `CHF 4.90`.
- No visible waffle product or waffle availability text remains in production HTML.
- At 390 px, neither outer campaign cup touches the viewport edge.
- The complete Yummy Strawberry rim and base remain visible in both placements.
- The Brown Sugar caption is never covered by the secondary hero image.
- GA4 consent, directions tracking, campaign expiry, hours, phone number, and CTA order remain unchanged.
- Work stays in Draft PR #5 until the user separately authorizes Merge and deployment.

---

### Task 1: Make Live Product Claims Truthful

**Files:**
- Modify: `tests/site-content.test.mjs:76-91`
- Modify: `index.html:24-30,114-136,185-198`

**Interfaces:**
- Consumes: existing `html` test fixture loaded from `index.html`
- Produces: production HTML with zero waffle claims and a current Signature Latte card

- [ ] **Step 1: Write the failing content test**

Replace the unavailable-product test and extend the nearby product assertions with:

```js
test('does not advertise unavailable products and features the current Signature Latte', () => {
  assert.doesNotMatch(html, /brunch|breakfast|avocado toast|all-day comfort food|waffles?|strawberry-waffle/i);
  assert.match(html, /<title>The B's Club — Coffee, Matcha &amp; Bubble Tea in Interlaken<\/title>/);
  assert.match(html, /"servesCuisine": \["Coffee", "Bubble Tea", "Matcha"\]/);
  assert.match(html, /Coffee, matcha, bubble tea and colourful drinks\./);
  assert.match(html, /SIGNATURE LATTE/);
  assert.match(html, /images\/signature-latte\.jpg/);
  assert.match(html, /<p>Hot coffee<\/p><h3>Signature Latte<\/h3>/);
  assert.match(html, /<strong>CHF 4\.90<\/strong>/);
  assert.doesNotMatch(html, /signature-latte-hot-concept-v1\.png/);
  assert.match(html, /Drop in for coffee, a colourful afternoon pick-me-up or a sweet finish to your day\./);
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.mjs
```

Expected: FAIL because `Waffles`, `strawberry-waffle.jpg`, and the old card are still present.

- [ ] **Step 3: Implement the minimal HTML content changes**

In `index.html`:

```html
"servesCuisine": ["Coffee", "Bubble Tea", "Matcha"]
```

```html
<figure class="hero-image hero-image-side">
  <img src="images/signature-latte.jpg" alt="The B's Club Signature Latte" width="784" height="1168" fetchpriority="high">
</figure>
```

Use `SIGNATURE LATTE` in the marquee and this promise copy:

```html
<p>Coffee, matcha, bubble tea and colourful drinks.</p>
```

Replace the waffle product card with:

```html
<article class="product-card reveal reveal-delay-2">
  <div class="product-image"><img src="images/signature-latte.jpg" alt="The B's Club Signature Latte" width="784" height="1168" loading="lazy" decoding="async"></div>
  <div class="product-info"><div><p>Hot coffee</p><h3>Signature Latte</h3></div><strong>CHF 4.90</strong></div>
</article>
```

- [ ] **Step 4: Run the content test and verify GREEN**

Run the Step 2 command.

Expected: all tests in `tests/site-content.test.mjs` pass.

- [ ] **Step 5: Commit the truthful product content**

```powershell
git add -- index.html tests/site-content.test.mjs
git commit -m "fix: replace unavailable waffle content"
```

### Task 2: Preserve Complete Product Images and Caption Clearance

**Files:**
- Modify: `tests/site-content.test.mjs`
- Modify: `index.html:195-196,232-233`
- Modify: `styles.css:72-78,129-132,165-170,272-275,324-331,347-359`

**Interfaces:**
- Consumes: `product-image-yummy` and `story-photo-yummy` class names added to HTML
- Produces: scoped `contain` framing that leaves all unrelated product cards on `cover`

- [ ] **Step 1: Add failing layout-contract tests**

Add these tests after the Yummy Strawberry asset test:

```js
test('keeps the hero caption clear of the overlapping side image', () => {
  const captionRule = css.match(/\.hero-image figcaption\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(captionRule, /right:\s*auto/);
  assert.match(captionRule, /width:\s*max-content/);
  assert.match(captionRule, /max-width:\s*calc\(100%\s*-\s*40px\)/);
  assert.match(captionRule, /z-index:\s*2/);
});

test('shows the complete Yummy Strawberry cup in both scoped frames', () => {
  const productRule = css.match(/\.product-image-yummy img\s*\{([^}]*)\}/)?.[1] ?? '';
  const storyRule = css.match(/\.story-visual \.story-photo-yummy\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(html, /class="product-image product-image-yummy"/);
  assert.match(html, /class="story-photo-two story-photo-yummy"/);
  assert.match(productRule, /object-fit:\s*contain/);
  assert.match(productRule, /object-position:\s*center/);
  assert.match(storyRule, /object-fit:\s*contain/);
  assert.match(storyRule, /object-position:\s*center/);
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.mjs
```

Expected: FAIL because the classes and scoped CSS rules do not exist and the caption still has `right: 20px`.

- [ ] **Step 3: Add the minimal HTML classes**

Change the Yummy card frame to:

```html
<div class="product-image product-image-yummy"><img src="images/yummy-strawberry-campaign.webp" alt="Yummy Strawberry iced drink" width="900" height="1296" loading="lazy" decoding="async"></div>
```

Change the story image class to:

```html
<img class="story-photo-two story-photo-yummy" src="images/yummy-strawberry-campaign.webp" alt="Yummy Strawberry iced drink" width="900" height="1296" loading="lazy" decoding="async">
```

- [ ] **Step 4: Add the minimal scoped CSS**

Update the caption declaration to include:

```css
right: auto;
z-index: 2;
width: max-content;
max-width: calc(100% - 40px);
```

Add after the generic product image rule:

```css
.product-image-yummy { background: #f08a5f; }
.product-image-yummy img { padding: 14px; object-fit: contain; object-position: center; }
```

Add after `.story-photo-two`:

```css
.story-visual .story-photo-yummy { padding: 10px; background: #f08a5f; object-fit: contain; object-position: center; }
```

At the 560 px caption override, use:

```css
.hero-image figcaption { left: 12px; right: auto; bottom: 12px; max-width: calc(100% - 24px); }
```

- [ ] **Step 5: Run the content test and verify GREEN**

Run the Step 2 command.

Expected: all tests in `tests/site-content.test.mjs` pass.

- [ ] **Step 6: Commit the product framing fixes**

```powershell
git add -- index.html styles.css tests/site-content.test.mjs
git commit -m "fix: preserve complete product framing"
```

### Task 3: Add Mobile Campaign Safe Space

**Files:**
- Modify: `tests/site-content.test.mjs:138-148`
- Modify: `styles.css:272-280,324-332`

**Interfaces:**
- Consumes: existing `.summer-offer-media::before` blurred background
- Produces: contained foreground image and exact 90% mobile width

- [ ] **Step 1: Replace the old crop test with failing safe-space assertions**

Use:

```js
test('adds safe space around the campaign trio below the desktop breakpoint', () => {
  const responsiveImageRule = css.match(/@media\s*\(max-width:\s*960px\)\s*\{[\s\S]*?\.summer-offer-media img\s*\{([^}]*)\}/)?.[1] ?? '';
  const mobileImageRule = css.match(/@media\s*\(max-width:\s*560px\)\s*\{[\s\S]*?\.summer-offer-media img\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(responsiveImageRule, /position:\s*relative/);
  assert.match(responsiveImageRule, /height:\s*100%/);
  assert.match(responsiveImageRule, /object-fit:\s*contain/);
  assert.match(responsiveImageRule, /transform:\s*none/);
  assert.match(mobileImageRule, /width:\s*90%/);
  assert.match(mobileImageRule, /margin-inline:\s*auto/);
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests\site-content.test.mjs
```

Expected: FAIL because the responsive rule still uses `cover` and no 90% mobile-width rule exists.

- [ ] **Step 3: Implement contained responsive framing**

In the 960 px media query, change the image rule to use `display: block`, `width: 100%`, and `object-fit: contain` while retaining the existing position, height, transform, and mask resets.

In the 560 px media query, add:

```css
.summer-offer-media img { width: 90%; margin-inline: auto; }
```

- [ ] **Step 4: Run the content test and verify GREEN**

Run the Step 2 command.

Expected: all tests in `tests/site-content.test.mjs` pass.

- [ ] **Step 5: Commit the campaign safe-space fix**

```powershell
git add -- styles.css tests/site-content.test.mjs
git commit -m "fix: add mobile campaign image spacing"
```

### Task 4: Full Verification and Draft PR Update

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `tests/*.test.mjs`
- Update remotely: Draft PR #5

**Interfaces:**
- Consumes: completed Tasks 1–3
- Produces: evidence that content, tracking, expiry, and responsive layouts remain correct

- [ ] **Step 1: Run the full automated test suite**

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: every test passes with zero failures.

- [ ] **Step 2: Verify content and production boundary**

```powershell
rg -n -i "waffle|signature-latte-hot-concept-v1" index.html styles.css script.js
```

Expected: no matches and exit code 1.

- [ ] **Step 3: Render and inspect responsive screenshots**

Serve the static site locally and capture full-page screenshots at:

```text
390 × 844
820 × 1180
1280 × 900
```

Inspect the campaign trio, hero caption, Signature Latte replacements, both Yummy Strawberry frames, product-grid alignment, and absence of horizontal overflow.

- [ ] **Step 4: Review the final diff**

```powershell
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
git status --short --branch
```

Expected: no whitespace errors, only approved spec/plan/concept plus HTML/CSS/tests changes, and a clean worktree.

- [ ] **Step 5: Push the branch and update Draft PR #5**

```powershell
git push origin agent/hot-signature-latte-concept
```

Update the PR title and description to cover the website fixes, test evidence, and explicit no-deployment boundary. Do not mark the PR ready and do not merge it.
