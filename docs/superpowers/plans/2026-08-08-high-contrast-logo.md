# High-Contrast Official Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a separate high-resolution, transparent, high-contrast version of The B's Club official mountain logo for white and paper-white backgrounds.

**Architecture:** Treat the existing official PNG as an immutable source. Use the built-in image editor to preserve the approved geometry and lettering while changing only the colour treatment, then store the result as a new brand asset and verify it against both transparent and white-background previews.

**Tech Stack:** Built-in image generation/editing, PNG, Node.js test runner, visual inspection.

## Global Constraints

- Source only: `campaign-2026-08/assets/brand/logo-official.png`.
- Wordmark colour: `#123F35`.
- Mountain shadow colour: `#4A3428`.
- Retain restrained warm gold and cream mountain highlights.
- Output background must be fully transparent.
- Preserve exact mountain composition, wordmark spelling, apostrophe, proportions, and arrangement.
- Do not overwrite the current official logo.

---

### Task 1: Create and verify the high-contrast logo asset

**Files:**
- Create: `campaign-2026-08/assets/brand/logo-official-high-contrast.png`
- Create: `campaign-2026-08/assets/brand/logo-official-high-contrast-white-preview.png`
- Create: `campaign-2026-08/tests/high-contrast-logo.test.mjs`

**Interfaces:**
- Consumes: immutable official logo at `campaign-2026-08/assets/brand/logo-official.png`.
- Produces: transparent high-contrast PNG master and a white-background review preview.

- [ ] **Step 1: Write the failing asset-contract test**

```js
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';

const files = [
  '../assets/brand/logo-official-high-contrast.png',
  '../assets/brand/logo-official-high-contrast-white-preview.png',
];

test('high-contrast logo master and white preview exist as useful PNG assets', async () => {
  for (const file of files) {
    const url = new URL(file, import.meta.url);
    await access(url);
    const bytes = await readFile(url);
    assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
    assert.ok(bytes.readUInt32BE(16) >= 1000);
    assert.ok(bytes.readUInt32BE(20) >= 1000);
  }
});
```

- [ ] **Step 2: Run the test and verify that it fails**

Run:

```powershell
node --test campaign-2026-08/tests/high-contrast-logo.test.mjs
```

Expected: FAIL because the two new PNG files do not exist.

- [ ] **Step 3: Edit the official logo using the built-in image tool**

Reference `campaign-2026-08/assets/brand/logo-official.png` and use this exact prompt:

```text
Edit this official logo without redrawing or changing its geometry. Preserve the exact mountain silhouette, exact wordmark spelling “The B’s Club”, apostrophe, letterforms, proportions, spacing and vertical arrangement. Change the complete wordmark to solid deep brand green #123F35. Deepen the mountain shadow planes to espresso brown #4A3428 while retaining restrained warm-gold and cream highlights. Produce crisp clean edges and a fully transparent background. No white box, glow, shadow, new lettering, icon, border, tagline, cup or additional element.
```

Save the result as `campaign-2026-08/assets/brand/logo-official-high-contrast.png` without replacing the source file.

- [ ] **Step 4: Create the white-background review version**

Use the approved high-contrast master as reference and place the unchanged logo centred on a pure white square canvas with generous margins. Save as `campaign-2026-08/assets/brand/logo-official-high-contrast-white-preview.png`.

- [ ] **Step 5: Inspect both images at full size**

Confirm the wordmark reads exactly `The B’s Club`, the apostrophe is present, no geometry changed, the master background is transparent, and the logo remains legible on white at website-header and A4-header scale. Reject and regenerate if any check fails.

- [ ] **Step 6: Run tests and commit**

Run:

```powershell
node --test campaign-2026-08/tests/high-contrast-logo.test.mjs
git diff --check
```

Expected: 1 passing test and no diff errors.

```powershell
git add campaign-2026-08/assets/brand/logo-official-high-contrast.png campaign-2026-08/assets/brand/logo-official-high-contrast-white-preview.png campaign-2026-08/tests/high-contrast-logo.test.mjs
git commit -m "assets: add high contrast official logo"
```
