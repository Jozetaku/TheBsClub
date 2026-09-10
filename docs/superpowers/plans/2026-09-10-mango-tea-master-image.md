# Mango Tea Master Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and approve a photorealistic Bublee Mango Tea master, then publish one verified image and copy set across the website, Swinch and Obsidian.

**Architecture:** Generate one non-destructive candidate using the approved Brown Sugar master for brand/composition and the owner-supplied Mango Tea screenshot for drink colour. Promotion, deterministic derivatives and platform changes occur only after explicit owner approval; Uber Eats remains paused.

**Tech Stack:** Built-in image generation, PowerShell 7, System.Drawing, Node.js test runner, static HTML/CSS, GitHub Pages, Swinch Merchant and Markdown/Obsidian.

## Global Constraints

- The physical logo spelling is exactly **Bublee**.
- Use one clear, shortened Bublee cup with a green heat-sealed film lid, centred on a wooden tray in The B's Club café.
- Mango Tea is bright mango-yellow above and naturally transitions to warm amber-orange below.
- The bottom contains only translucent white Lychee Popping Boba.
- The Popping Boba layer uses the same fill height and visual quantity as the approved Brown Sugar Milk Tea master.
- No black tapioca, mango jelly, fruit chunks, dark sediment, straw, dome lid, extra product, hand, loose ingredient, added text or watermark.
- Keep the full lid and cup base visible and crop-safe for 1:1, 4:5 and 4:3.
- Do not replace a live asset or create a Swinch product before explicit owner approval of the candidate.
- Keep Uber Eats unchanged.

---

### Task 1: Generate and review Mango Tea Candidate v1

**Files:**
- Reference: `campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-master.png`
- Reference: `C:/Users/v-bes/AppData/Local/Temp/codex-clipboard-5a6a3960-799b-43ce-81af-95e6a236625e.png`
- Create: `campaign-2026-08/assets/candidates/drinks/mango-tea-v1.png`

**Interfaces:**
- Consumes: approved Brown Sugar visual standard, owner colour reference and approved Mango Tea design spec.
- Produces: one review-only PNG candidate; no live consumer reads this path.

- [ ] **Step 1: Inspect both references at original detail**

Confirm the Brown Sugar reference supplies cup shape, logo, lid, tray, lighting, background and bottom-layer height. Confirm the owner screenshot supplies only the yellow-to-amber drink colour; its dark bottom contents are not a product reference.

- [ ] **Step 2: Generate one candidate**

Use the built-in image generation tool with both images and this prompt:

```text
Use case: product-mockup
Asset type: reusable restaurant menu drink photograph
Primary request: Create a photorealistic product photograph of one authentic Bublee Mango Tea that matches the approved Brown Sugar Milk Tea visual family.
Input images: Image 1 is authoritative for the shortened clear Bublee cup, optical size, green sealed film lid, correctly spelled black Bublee logo, wooden tray, white tabletop, warm café lighting, softly blurred café interior and approved bottom-layer height. Image 2 is authoritative only for the drink colour: bright mango-yellow at the top transitioning naturally to warm amber-orange at the bottom; ignore its cup shape, branding and dark bottom contents.
Scene/backdrop: The B's Club café interior, softly blurred, with the drink centred on the same style wooden serving tray and white café tabletop as Image 1.
Subject: One upright iced Mango Tea in a clear shortened Bublee cup. Add translucent white Lychee Popping Boba at the bottom, using exactly the same fill height and visual quantity as the black tapioca layer in Image 1.
Style/medium: premium natural commercial food photography with believable clear tea, ice, condensation, transparent pearls and soft shadows.
Composition/framing: square, single centred product, full lid and base visible, moderate safe area for 1:1, 4:5 and 4:3 derivatives.
Lighting/mood: warm natural café daylight; fresh tropical colour without neon saturation.
Constraints: the physical black logo must read Bublee exactly; retain the green heat-sealed lid; no black tapioca, mango jelly, fruit chunks, dark sediment, straw, dome lid, food, extra drinks, hands, loose ingredients, added text or watermark.
```

- [ ] **Step 3: Inspect Candidate v1 at original detail**

Verify:

```text
[ ] exactly one shortened clear cup
[ ] green sealed film lid
[ ] physical logo reads Bublee
[ ] mango-yellow to amber-orange colour transition
[ ] only translucent white Lychee Popping Boba at the bottom
[ ] bottom layer height matches Brown Sugar master
[ ] realistic ice, tea transparency and condensation
[ ] full lid and cup base visible
[ ] wooden tray, white table and blurred café background
[ ] no forbidden object or added text
```

- [ ] **Step 4: Save and present the candidate**

Copy the built-in output to `campaign-2026-08/assets/candidates/drinks/mango-tea-v1.png`. Do not modify `images/campaign/v2/mango-tea.png`. Display Candidate v1 inline and stop for `PASS`, `ผ่าน` or one targeted revision request.

- [ ] **Step 5: Commit the review candidate**

```powershell
git add -- campaign-2026-08/assets/candidates/drinks/mango-tea-v1.png
git commit -m "feat: add Bublee Mango Tea candidate"
```

### Task 2: Promote the approved candidate and generate deterministic derivatives

**Files:**
- Create: `campaign-2026-08/assets/final/drinks/mango-tea-master.png`
- Create: `campaign-2026-08/assets/final/drinks/mango-tea-square-1200.jpg`
- Create: `campaign-2026-08/assets/final/drinks/mango-tea-landscape-1200x900.jpg`
- Create: `campaign-2026-08/assets/final/drinks/mango-tea-portrait-1080x1350.jpg`

**Interfaces:**
- Consumes: the exact candidate version explicitly approved by the owner.
- Produces: one immutable master plus three deterministic derivatives.

- [ ] **Step 1: Verify the image-pack generator**

Run `pwsh -NoProfile -File tests/menu-image-pack.test.ps1`. Expected: exit code 0 and `PASS: menu image pack contract`.

- [ ] **Step 2: Generate the pack**

```powershell
pwsh -NoProfile -File scripts/New-MenuImagePack.ps1 `
  -SourcePath "campaign-2026-08/assets/candidates/drinks/mango-tea-v1.png" `
  -OutputDirectory "campaign-2026-08/assets/final/drinks" `
  -Slug "mango-tea"
```

Execute this command only if the owner approves Candidate v1. If a revision is requested, amend the plan with that exact versioned filename before promotion. Expected derivatives: 1200×1200, 1200×900 and 1080×1350 at JPEG quality 92; the master is a byte-for-byte copy.

- [ ] **Step 3: Verify and commit the pack**

Record all four SHA-256 values. Require candidate/master hashes to match. Inspect each crop for the complete lid, logo, Popping Boba and cup base. Then run:

```powershell
git add -- campaign-2026-08/assets/final/drinks/mango-tea-*
git commit -m "feat: add approved Bublee Mango Tea image pack"
```

### Task 3: Publish the approved asset and copy on the website

**Files:**
- Create: `tests/mango-tea.test.mjs`
- Modify: `images/campaign/v2/mango-tea.png`
- Modify: `index.html`
- Modify: `en/index.html`
- Modify if needed: `styles.css`
- Modify if needed: `tests/responsive-design.test.mjs`

**Interfaces:**
- Consumes: approved master/portrait derivative and canonical EN/DE copy.
- Produces: tested localized website cards and a deployable GitHub Pages asset.

- [ ] **Step 1: Write the failing website test**

Create `tests/mango-tea.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const german = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const english = readFileSync(new URL('../en/index.html', import.meta.url), 'utf8');

test('publishes the approved Bublee Mango Tea asset and canonical copy', () => {
  const asset = '/images/campaign/v2/mango-tea.png';
  assert.ok(existsSync(new URL(`..${asset}`, import.meta.url)));
  assert.match(english, new RegExp(`src="${asset}"[^>]*width="1080"[^>]*height="1350"`));
  assert.match(german, new RegExp(`src="${asset}"[^>]*width="1080"[^>]*height="1350"`));
  assert.match(english, /Golden mango tea with a bright tropical finish and juicy lychee popping boba\./);
  assert.match(german, /Goldener Mango-Tee mit tropisch-frischem Geschmack und saftigen Lychee-Popping-Boba\./);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run `node --test tests/mango-tea.test.mjs`. Expected: FAIL because the current dimensions and descriptions still describe the legacy asset.

- [ ] **Step 3: Replace asset and localized copy**

Create `images/campaign/v2/mango-tea.png` from the approved 1080×1350 portrait derivative. Update dimensions to `1080` × `1350` and use:

```text
EN alt: Bublee Mango Tea with translucent white lychee popping boba in a sealed cup.
EN description: Golden mango tea with a bright tropical finish and juicy lychee popping boba.
DE alt: Bublee Mango Tea mit transparent-weißen Lychee-Popping-Boba im versiegelten Becher.
DE description: Goldener Mango-Tee mit tropisch-frischem Geschmack und saftigen Lychee-Popping-Boba.
```

- [ ] **Step 4: Verify responsive presentation**

Run `node --test tests/mango-tea.test.mjs tests/mini-makers.test.mjs tests/responsive-design.test.mjs`, then preview at 1440×900 and 390×844. If optical correction is needed, change only Mango Tea's `--cup-scale`/`--cup-y` values and matching test expectation.

- [ ] **Step 5: Run full tests and commit**

```powershell
node --test tests/*.test.mjs
pwsh -NoProfile -File tests/menu-image-pack.test.ps1
git diff --check
git add -- tests/mango-tea.test.mjs images/campaign/v2/mango-tea.png index.html en/index.html
git commit -m "feat: publish approved Bublee Mango Tea image"
```

Add `styles.css` and `tests/responsive-design.test.mjs` only if they changed.

### Task 4: Update Obsidian, website Live and Swinch

**Files:**
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/mango-tea.md`
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/mango-tea/Final/*`

**Interfaces:**
- Consumes: approved pack, hashes, canonical copy and established website price.
- Produces: durable Obsidian record, verified Live website and one Active/Displayed Swinch product.

- [ ] **Step 1: Create the Obsidian record**

Copy the four approved assets into the Mango Tea `Final` folder. Embed `mango-tea-square-1200.jpg`, record all dimensions/hashes and canonical EN/DE copy, and mark ingredients/allergens `requires-owner-verification`.

- [ ] **Step 2: Deploy and verify the website**

Push `main` only after the chosen branch-integration workflow. Require the exact GitHub Pages run to conclude `success`. Fetch Live HTML and PNG with cache-busting parameters; require HTTP 200, canonical copy and an asset SHA-256 equal to the local PNG.

- [ ] **Step 3: Prepare Swinch**

Search exact name `Mango Tea`; edit an exact match or prepare a new product without submitting. Use the established website price, quantity 10, Active on, Displayed on, Recommended off, English canonical description, keywords `mango tea, lychee popping boba, Bublee, bubble tea, Interlaken`, and `mango-tea-square-1200.jpg`.

- [ ] **Step 4: Confirm and submit Swinch**

Immediately before Save/Create, state the exact product, price and public status and obtain action-time confirmation. Submit once, then verify name, price, quantity, Active · Displayed, description and image in the detail view.

- [ ] **Step 5: Final verification**

Set Obsidian status from verified evidence: Website `Published & verified`, Swinch `Published & verified; Active · Displayed`, Uber Eats `Paused`, Social/print `Ready for reuse`. Run full tests, require local `main` equals `origin/main`, confirm all Obsidian hashes and preserve unrelated user files.
