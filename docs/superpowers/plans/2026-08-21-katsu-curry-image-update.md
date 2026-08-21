# Crispy Chicken Katsu Curry Image Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the Crispy Chicken Katsu Curry card image with a controlled edit that removes carrots and mixes the sliced chicken and potatoes into the curry while preserving the original image and card design.

**Architecture:** Treat `images/campaign/v3/katsu-curry.png` as an immutable composition anchor and create a new v4 bitmap asset. Update the semantic menu-card mapping and its focused test to allow per-dish versioned image paths, then verify the complete static site without changing copy or layout.

**Tech Stack:** Built-in image generation/editing tool, PNG assets, semantic HTML, Node.js built-in test runner, Git.

## Global Constraints

- Preserve `images/campaign/v3/katsu-curry.png` byte-for-byte.
- Keep the warm cream background, camera angle, lighting, kraft-paper bowl with white interior, jasmine rice, clear lid, shadows, and portrait composition.
- Keep sliced crispy chicken katsu, visibly coated and mixed with Japanese curry sauce.
- Keep potato pieces mixed through the curry and remove every carrot piece.
- Add no vegetables, garnish, text, branding, cutlery, or other props.
- Save the result as `images/campaign/v4/katsu-curry.png` at 1122 x 1402 pixels.
- Keep the existing alt text, menu copy, price, dimensions, and lazy-loading attributes unchanged.
- Work only on `codex/katsu-curry-chicken-update`; do not update `main` directly.

---

### Task 1: Version-Aware Katsu Image Mapping

**Files:**
- Create: `images/campaign/v4/katsu-curry.png`
- Modify: `tests/asian-menu.test.mjs:24`
- Modify: `index.html:158`

**Interfaces:**
- Consumes: existing menu-card HTML and immutable `images/campaign/v3/katsu-curry.png` composition anchor.
- Produces: `images/campaign/v4/katsu-curry.png` and a tested `images/campaign/v4/katsu-curry.png` reference in the Katsu card.

- [ ] **Step 1: Record the original asset hash**

Run:

```powershell
$originalKatsuHash = (Get-FileHash -Algorithm SHA256 images/campaign/v3/katsu-curry.png).Hash
if ($originalKatsuHash -ne 'F072A29411654FED8E894F12AA5E425498AA2AD52B935B4F24B108E211994B28') { throw 'Unexpected original v3 Katsu hash' }
```

Expected: no output and exit code 0.

- [ ] **Step 2: Write the failing version-aware mapping test**

Replace the `expectedImages` data and its path interpolation in `tests/asian-menu.test.mjs` with:

```js
  const expectedImages = [
    ['spicy-basil', 'v3/spicy-basil.png', 'Spicy Basil chicken with jasmine rice in a kraft takeaway bowl'],
    ['green-curry', 'v3/green-curry.png', 'Green Curry chicken with vegetables and jasmine rice in a kraft takeaway bowl'],
    ['red-curry', 'v3/red-curry.png', 'Red Curry chicken with jasmine rice in a kraft takeaway bowl'],
    ['katsu-curry', 'v4/katsu-curry.png', 'Crispy Chicken Katsu Curry with jasmine rice in a kraft takeaway bowl'],
  ];

  for (const [dish, assetPath, alt] of expectedImages) {
    assert.ok(existsSync(new URL(`../images/campaign/${assetPath}`, import.meta.url)));
    assert.match(
      html,
      new RegExp(`data-dish="${dish}"[\\s\\S]*?<figure class="dish-photo-stage">[\\s\\S]*?src="images/campaign/${assetPath}"[\\s\\S]*?alt="${alt}"`),
    );
  }
```

- [ ] **Step 3: Run the focused test and verify it fails**

Run:

```powershell
node --test tests/asian-menu.test.mjs
```

Expected: FAIL in `maps every approved meal photograph to its matching semantic card` because `images/campaign/v4/katsu-curry.png` does not exist and the HTML still points to v3.

- [ ] **Step 4: Generate the controlled image edit**

Use the built-in image editing tool with the current v3 Katsu image as the edit target and `IMG_3308.HEIC` as a real-food supporting reference. Use this prompt:

```text
Use case: precise-object-edit
Asset type: website menu-card food photograph
Input images: Image 1 is the edit target and composition anchor; Image 2 is a real-food supporting reference for the chicken and curry interaction
Primary request: change only the food contents in Image 1 so the sliced crispy chicken katsu is visibly coated and mixed with Japanese curry sauce and the existing potato pieces; remove every carrot piece
Constraints: preserve the exact portrait framing, warm cream background, camera angle, lighting, kraft-paper bowl with white interior, jasmine rice, clear lid, shadows, and overall color treatment; keep sliced chicken and potatoes; no carrots; no other vegetables; no garnish; no text; no branding; no cutlery; no extra props
```

Inspect the output and repeat only a targeted correction if carrots remain or the bowl/composition changes. Save the accepted bitmap as `images/campaign/v4/katsu-curry.png`.

- [ ] **Step 5: Verify and normalize the image dimensions**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile((Resolve-Path 'images/campaign/v4/katsu-curry.png'))
try { "$($image.Width)x$($image.Height)" } finally { $image.Dispose() }
```

Expected: `1122x1402`. If the generated image differs, resize it once to exactly 1122 x 1402 without changing the crop or aspect ratio before continuing.

- [ ] **Step 6: Point only the Katsu card to v4**

In `index.html`, replace only the Katsu image source:

```html
<figure class="dish-photo-stage"><img class="dish-photo" src="images/campaign/v4/katsu-curry.png" alt="Crispy Chicken Katsu Curry with jasmine rice in a kraft takeaway bowl" width="1122" height="1402" loading="lazy" decoding="async"></figure>
```

- [ ] **Step 7: Run focused and full tests**

Run:

```powershell
node --test tests/asian-menu.test.mjs
node --test tests/*.test.mjs
```

Expected: both commands PASS with zero failed tests.

- [ ] **Step 8: Verify the backup and inspect the change**

Run:

```powershell
$currentKatsuHash = (Get-FileHash -Algorithm SHA256 images/campaign/v3/katsu-curry.png).Hash
if ($currentKatsuHash -ne 'F072A29411654FED8E894F12AA5E425498AA2AD52B935B4F24B108E211994B28') { throw 'Original v3 Katsu image changed' }
git diff --check
git status --short
```

Expected: the v3 hash matches Step 1; `git diff --check` reports nothing; status lists only the v4 image, `index.html`, and `tests/asian-menu.test.mjs` for this implementation.

- [ ] **Step 9: Commit the implementation**

```powershell
git add -- images/campaign/v4/katsu-curry.png index.html tests/asian-menu.test.mjs
git commit -m "feat: update katsu curry menu image"
```

Expected: one commit containing only the new bitmap, mapping test, and HTML reference.

### Task 2: Browser-Sized Visual Verification and Draft PR

**Files:**
- Verify: `index.html`
- Verify: `styles.css`

**Interfaces:**
- Consumes: the tested v4 Katsu asset and updated menu-card source from Task 1.
- Produces: visual verification evidence and a Draft PR while leaving `main` unchanged.

- [ ] **Step 1: Serve the static site**

Run:

```powershell
npx --yes serve . --listen 8000
```

Expected: the site is available at `http://localhost:8000`.

- [ ] **Step 2: Inspect the Food section at desktop and mobile widths**

Verify at 1440 x 900 and 390 x 844 that the Katsu card loads the v4 image, retains its crop and card height, contains no carrot, and matches the other kraft-bowl menu photographs. Confirm the other three menu cards remain unchanged.

- [ ] **Step 3: Re-run the full suite after visual inspection**

Run:

```powershell
node --test tests/*.test.mjs
git status --short --branch
```

Expected: all tests PASS; the working tree is clean on `codex/katsu-curry-chicken-update`.

- [ ] **Step 4: Publish the protected change as a Draft PR**

Push `codex/katsu-curry-chicken-update` and open a Draft PR targeting `main` with title `Update Crispy Chicken Katsu Curry menu image`. The PR body must state that the v3 asset remains unchanged, the v4 image removes carrots and mixes chicken with curry and potatoes, and the full Node test suite passes.
