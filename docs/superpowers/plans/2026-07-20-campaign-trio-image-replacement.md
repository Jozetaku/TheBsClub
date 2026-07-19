# Campaign Trio Image Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the live summer campaign trio with the user-supplied composition and ensure the mobile crop removes empty right-side space instead of cutting the Brown Sugar cup.

**Architecture:** Keep the production filename and HTML unchanged so both the foreground and blurred background consume the new asset automatically. Add one scoped responsive CSS declaration inside the existing 960 px breakpoint, protected by a content-level regression test and verified with Playwright screenshots.

**Tech Stack:** Static HTML, CSS, Node.js built-in test runner, Pillow WebP encoding, Python Playwright, GitHub Pages

## Global Constraints

- Preserve the source dimensions of 1536 × 1024.
- Keep `images/summer-drinks-campaign.webp` below 450 KB.
- At widths up to 960 px, retain `object-fit: cover` and use `object-position: left center`.
- Keep desktop framing centred and contained.
- Do not change the BS12 code, 12% offer, product names, prices, end date, CTA, waffle content, tracking, hours, phone number, website, or CTA order.
- Do not alter the user-supplied pixels beyond WebP encoding.

---

### Task 1: Protect the Mobile Campaign Crop

**Files:**
- Modify: `tests/site-content.test.mjs:126-134`
- Modify: `styles.css:272-280`

**Interfaces:**
- Consumes: the existing `@media (max-width: 960px)` campaign image rule
- Produces: a regression-tested `object-position: left center` declaration scoped to `.summer-offer-media img`

- [ ] **Step 1: Add the failing responsive crop test**

Add after the existing desktop campaign backdrop test:

```js
test('crops mobile campaign space from the right instead of the Brown Sugar cup', () => {
  const responsiveRule = css.match(
    /@media\s*\(max-width:\s*960px\)\s*\{[\s\S]*?\.summer-offer-media img\s*\{([^}]*)\}/
  )?.[1] ?? '';

  assert.match(responsiveRule, /object-fit:\s*cover/);
  assert.match(responsiveRule, /object-position:\s*left center/);
});
```

- [ ] **Step 2: Run the test and verify the expected failure**

Run:

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/site-content.test.mjs
```

Expected: one failure because the responsive rule has no `object-position: left center` declaration.

- [ ] **Step 3: Add the minimal scoped CSS**

Change the existing responsive image rule to:

```css
.summer-offer-media img { position: relative; top: auto; left: auto; height: 100%; aspect-ratio: auto; object-fit: cover; object-position: left center; transform: none; -webkit-mask-image: none; mask-image: none; }
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run the command from Step 2.

Expected: all content tests pass with zero failures.

- [ ] **Step 5: Commit the responsive behavior**

```powershell
git add tests/site-content.test.mjs styles.css
git commit -m "fix: preserve campaign cups on mobile"
```

### Task 2: Replace and Validate the Production Asset

**Files:**
- Modify: `images/summer-drinks-campaign.webp`

**Interfaces:**
- Consumes: `C:\Users\v-bes\Downloads\จัดตำแหน่งแก้ว 3 ใบและเงา.png`
- Produces: a 1536 × 1024 WebP file used by the campaign `<img>` and `.summer-offer-media::before`

- [ ] **Step 1: Encode the supplied PNG as the existing production asset**

Set `SOURCE_IMAGE` to the resolved supplied-file path and `TARGET_IMAGE` to the resolved production-file path, then run:

```python
import os
from pathlib import Path
from PIL import Image

source = Path(os.environ['SOURCE_IMAGE'])
target = Path(os.environ['TARGET_IMAGE'])

with Image.open(source) as image:
    assert image.size == (1536, 1024)
    image.convert('RGB').save(target, 'WEBP', quality=90, method=6)
```

Expected: `images/summer-drinks-campaign.webp` is replaced without changing its dimensions.

- [ ] **Step 2: Verify dimensions and file size**

Run a Pillow inspection of the target and `Get-Item images\summer-drinks-campaign.webp`.

Expected:

```text
dimensions: 1536x1024
format: WEBP
size: less than 450000 bytes
```

- [ ] **Step 3: Run the complete Node test suite**

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
```

Expected: all tests pass with zero failures.

- [ ] **Step 4: Commit the optimized asset**

```powershell
git add images/summer-drinks-campaign.webp
git commit -m "feat: update summer campaign trio image"
```

### Task 3: Responsive Visual Verification and Release

**Files:**
- Inspect: `index.html`
- Inspect: `styles.css`
- Inspect: `images/summer-drinks-campaign.webp`
- Inspect: `tests/site-content.test.mjs`

**Interfaces:**
- Consumes: the committed campaign asset and responsive crop rule from Tasks 1 and 2
- Produces: verified screenshots, a reviewable GitHub pull request, and the deployed GitHub Pages update

- [ ] **Step 1: Capture responsive campaign screenshots**

Use Python Playwright with analytics consent set to `denied`. Open the local `index.html`, wait for `#summer-offer:not([hidden])`, and capture `#summer-offer` at:

```text
390 × 844
820 × 1180
1280 × 900
```

Expected:

- At 390 px, the full left edge of the Brown Sugar cup is visible.
- All three cups remain readable at every viewport.
- No campaign copy or CTA is obscured.
- Desktop remains centred and contained.

- [ ] **Step 2: Run final automated verification**

```powershell
& 'C:\Users\v-bes\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test
git diff --check origin/main..HEAD
git status --short
```

Expected: all tests pass, `git diff --check` returns no errors, and the working tree is clean after commits.

- [ ] **Step 3: Review the final production diff**

```powershell
git diff --stat origin/main..HEAD
git diff origin/main..HEAD -- styles.css tests/site-content.test.mjs
```

Expected: production changes are limited to the campaign asset, scoped responsive CSS, and its regression test; the remaining changes are the approved spec and this plan.

- [ ] **Step 4: Push, open, and merge a pull request**

Push `agent/update-campaign-trio-image`, create a pull request targeting `main`, and squash-merge only if the head commit matches the verified local head.

Expected: the pull request reaches the `MERGED` state and GitHub Pages starts a deployment for the resulting `main` commit.

- [ ] **Step 5: Verify deployment and live HTML**

Wait for the GitHub Pages workflow with `gh run watch --exit-status`. Read the merge commit SHA from `gh pr view --json mergeCommit`, store it in `$mergeCommit`, then request:

```powershell
Invoke-WebRequest -UseBasicParsing "https://thebsclub.ch/?verify=$mergeCommit"
```

Expected:

- Deployment conclusion is `success`.
- Live page returns HTTP 200.
- Live HTML references `images/summer-drinks-campaign.webp`.
- Live HTML still contains `BS12` and `Strawberry Waffle`.
