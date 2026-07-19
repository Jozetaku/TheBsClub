# Hot Signature Latte Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and validate a photorealistic concept image of The B's Salted Caramel Cloud Latte in the shop's real 160 ml white cup without publishing it to the live website.

**Architecture:** Use the supplied cup photograph as the high-fidelity visual reference for the ceramic cup and saucer. Generate a landscape concept image, inspect it against explicit product and geometry criteria, and save only the accepted concept under a non-live project path.

**Tech Stack:** Built-in image generation, local image inspection, Git

## Global Constraints

- Reference cup capacity is exactly 160 ml.
- Drink uses one existing machine extraction yielding 50 ml espresso.
- Visible topping is 10–12 g of the existing thick cream top with approximately 1 g caramel garnish.
- The full cup, handle and saucer must remain visible with generous safe space.
- Output is a concept preview and must not replace or be referenced by the live website.
- No invented logo, text, watermark, spoon, biscuits or unavailable props.

---

### Task 1: Generate the Product Concept

**Files:**
- Reference: `C:/Users/v-bes/AppData/Local/Temp/codex-clipboard-c3b8d807-7b7a-4644-b9c1-6801ba2198c4.png`
- Create after acceptance: `images/concepts/signature-latte-hot-concept-v1.png`

**Interfaces:**
- Consumes: approved drink and image spec in `docs/superpowers/specs/2026-07-19-hot-signature-latte-design.md`
- Produces: one photorealistic 3:2 landscape concept image for visual review

- [ ] **Step 1: Generate a reference-guided image**

Use the built-in image-generation edit flow with the supplied cup photograph as a reference. Use this exact prompt:

```text
Use case: product-mockup
Asset type: website product-photo concept for The B's Club
Primary request: Create a photorealistic landscape product photograph of a hot salted caramel cream latte served in the exact style and proportions of the 160 ml white ceramic cup and matching white saucer from the reference image.
Input image: the supplied empty-cup photograph is the high-fidelity reference for the cup shape, circular handle, white glaze, saucer, proportions and scale.
Scene/backdrop: warm, softly blurred independent café interior with a clean tabletop and no added props.
Subject: warm caramel-brown hot latte with a small, realistic ivory cream-top dome in the centre and a restrained thin caramel spiral. Add only subtle natural steam.
Style/medium: premium natural food photography, realistic ceramic and edible textures, not glossy stock photography.
Composition/framing: 3:2 landscape, slightly elevated three-quarter camera angle, entire cup, handle and saucer visible, generous safe space on all sides, suitable for desktop and mobile cropping.
Lighting/mood: soft warm window light, inviting and calm.
Constraints: preserve the real cup design; topping is small and realistically scaled for a 160 ml drink; cream does not cover the whole surface; cup and saucer are not cropped.
Avoid: invented logo, text, watermark, spoon, biscuits, coffee beans, flowers, malformed ceramic, duplicate handles, whipped-cream tower, ice cream, messy caramel drips, excessive steam.
```

- [ ] **Step 2: Inspect the generated image at original resolution**

Open the generated image at original detail and verify all of the following:

```text
[ ] Full cup, round handle and saucer are visible
[ ] Cup geometry matches the supplied reference
[ ] Only one handle exists
[ ] Cream top is a small central layer, not a tall whipped-cream pile
[ ] Caramel is a thin, restrained spiral
[ ] Steam is subtle and natural
[ ] No text, logo, watermark or unapproved props appear
[ ] Safe space remains around the complete product
[ ] No visible AI artefacts are present
```

- [ ] **Step 3: Regenerate once if a criterion fails**

Make one targeted correction describing only the failed criterion while repeating the cup-geometry and no-crop invariants. Inspect the revised output with the same checklist.

- [ ] **Step 4: Present the accepted preview for user review**

Show the image inline. Do not update HTML, CSS or live assets at this stage.

### Task 2: Preserve the User-Approved Concept

**Files:**
- Create: `images/concepts/signature-latte-hot-concept-v1.png`
- Verify unchanged: `index.html`
- Verify unchanged: `styles.css`

**Interfaces:**
- Consumes: the exact image approved by the user in Task 1
- Produces: a versioned concept asset that is not referenced by production code

- [ ] **Step 1: Copy the approved generated output into the project**

Create `images/concepts/` if needed and copy the approved image without overwriting any existing website asset. Preserve PNG format.

- [ ] **Step 2: Verify that production code does not reference the concept**

Run:

```powershell
rg -n "signature-latte-hot-concept-v1" index.html styles.css script.js
```

Expected: no matches and exit code 1.

- [ ] **Step 3: Verify the saved asset**

Open `images/concepts/signature-latte-hot-concept-v1.png` at original detail and confirm it is identical to the user-approved preview.

- [ ] **Step 4: Commit the approved concept only**

```powershell
git add -- images/concepts/signature-latte-hot-concept-v1.png
git commit -m "assets: add hot signature latte concept"
```

Expected: one new concept image committed; no production HTML, CSS or JavaScript changes.
