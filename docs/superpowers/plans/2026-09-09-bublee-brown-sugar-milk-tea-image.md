# Bublee Brown Sugar Milk Tea Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and approve an authentic Bublee Brown Sugar Milk Tea master image, then derive a reusable platform-ready image pack and product record.

**Architecture:** Use the two owner-supplied café photographs as visual references for the actual Bublee cup, green seal, black logo, drink appearance, and café setting. Generate one non-destructive candidate first; only an owner-approved candidate becomes the immutable master and source for deterministic platform crops.

**Tech Stack:** Built-in image generation, System.Drawing image inspection/resizing, Markdown/Obsidian, existing static website assets and tests.

## Global Constraints

- Brand spelling is exactly **Bublee**.
- The cup is clear and straight-sided with a green sealed film lid and centered black Bublee branding.
- Brown Sugar Milk Tea is creamy beige with natural brown-sugar streaks, ice, and black tapioca pearls at the bottom.
- Use one upright drink on the café's white tabletop or wooden tray with warm natural light and a softly blurred café background.
- Do not add a straw, dome lid, foam cap, food, extra drinks, hands, decorative ingredients, promotional text, or watermarks.
- Keep the full cup visible and crop-safe for square, 4:5 portrait, and 4:3 landscape derivatives.
- Do not publish or replace live assets before explicit owner approval of the candidate.

---

### Task 1: Create the Brown Sugar Milk Tea candidate

**Files:**
- Reference: `C:/Users/v-bes/.codex/codex-remote-attachments/01a085d5-4f84-7193-918a-ce9ae067e00d/F8C011E4-2DD0-4E3D-8AB0-465E2056E057/1-Pasted-Image-1.jpg`
- Reference: `C:/Users/v-bes/.codex/codex-remote-attachments/01a085d5-4f84-7193-918a-ce9ae067e00d/F8C011E4-2DD0-4E3D-8AB0-465E2056E057/2-Pasted-Image-2.jpg`
- Create after generation: `campaign-2026-08/assets/candidates/drinks/brown-sugar-milk-tea-v1.png`

**Interfaces:**
- Consumes: Two owner reference photographs and the approved design spec.
- Produces: One candidate PNG for owner review; it is not yet a master or a live website asset.

- [ ] **Step 1: Generate one candidate with both photographs as references**

Use the built-in image generation tool with this prompt:

```text
Use case: product-mockup
Asset type: reusable restaurant menu drink photograph
Primary request: Create a photorealistic product photograph of one authentic Bublee Brown Sugar Milk Tea, matching the real drink and café shown in the two reference photographs.
Input images: Image 1 and Image 2 are authoritative visual references for the clear straight-sided cup, green sealed film lid, centered black Bublee logo, creamy beige drink, brown-sugar marbling, black tapioca pearls, white tabletop, wooden tray, and café background.
Scene/backdrop: The B's Club café interior, softly blurred, with the drink resting on the white café tabletop or wooden serving tray.
Subject: One upright Bublee Brown Sugar Milk Tea cup. Preserve the real cup proportions, green printed seal, correctly spelled black Bublee branding, ice, natural brown-sugar streaks, and pearls settled at the bottom.
Style/medium: premium but natural commercial food photography, believable textures, no synthetic studio look.
Composition/framing: centered single product, full cup visible from lid through base, moderate negative space on all sides, crop-safe for 1:1, 4:5, and 4:3.
Lighting/mood: warm natural café daylight, soft realistic shadows, appetizing but truthful colour.
Constraints: exact brand spelling Bublee; no other lettering invented; no food, extra drinks, hands, straw, dome lid, foam cap, loose topping, ingredients, promotional text, or watermark.
```

- [ ] **Step 2: Inspect the candidate at original detail**

Verify all of the following visually:

```text
[ ] exactly one cup
[ ] clear straight-sided cup
[ ] green sealed film lid
[ ] black logo reads Bublee
[ ] creamy beige milk tea
[ ] natural brown-sugar marbling
[ ] black pearls at the bottom
[ ] full lid and cup base visible
[ ] authentic café table/background
[ ] no forbidden props or toppings
```

- [ ] **Step 3: Save the candidate non-destructively**

Copy the generated file to:

```text
campaign-2026-08/assets/candidates/drinks/brown-sugar-milk-tea-v1.png
```

Do not overwrite `images/campaign/v2/brown-sugar-milk-tea.png`.

- [ ] **Step 4: Show the candidate for owner approval**

Report the saved path, display the image inline, and wait for explicit approval or one targeted revision request.

- [ ] **Step 5: Commit the review candidate**

```powershell
git add -- campaign-2026-08/assets/candidates/drinks/brown-sugar-milk-tea-v1.png
git commit -m "feat: add Bublee brown sugar drink candidate"
```

### Task 2: Promote an approved candidate into the reusable image pack

**Files:**
- Create: `campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-master.png`
- Create: `campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-square-1200.jpg`
- Create: `campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-portrait-1080x1350.jpg`
- Create: `campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-landscape-1200x900.jpg`

**Interfaces:**
- Consumes: The exact candidate version explicitly approved by the owner.
- Produces: Immutable master plus deterministic marketplace, social, and website derivatives.

- [ ] **Step 1: Copy the approved candidate byte-for-byte as the master**

Record the SHA-256 of both files and require them to match.

- [ ] **Step 2: Create the three derivatives**

Use centered high-quality crops that preserve the entire green lid, Bublee logo, pearls, and cup base. Export JPEG derivatives at quality 92.

- [ ] **Step 3: Verify dimensions and crop safety**

Expected dimensions:

```text
square:    1200 x 1200
portrait:  1080 x 1350
landscape: 1200 x 900
```

- [ ] **Step 4: Commit the approved pack**

```powershell
git add -- campaign-2026-08/assets/final/drinks/brown-sugar-milk-tea-*
git commit -m "feat: add approved Bublee brown sugar image pack"
```

### Task 3: Create the Brown Sugar Milk Tea product record

**Files:**
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/brown-sugar-milk-tea.md`

**Interfaces:**
- Consumes: Approved master and derivative filenames, hashes, confirmed platform prices when available.
- Produces: A reusable Obsidian product record for future website, Swinch, Uber Eats, and social use.

- [ ] **Step 1: Create the product note with the approved image embedded**

Use these canonical copy fields:

```text
English name: Brown Sugar Milk Tea
English description: Creamy milk tea swirled with rich brown sugar and finished with chewy tapioca pearls.
German name: Brown Sugar Milk Tea
German description: Cremiger Milchtee mit kräftigem Braunzucker und bissfesten Tapiokaperlen.
```

Mark ingredient and allergen details as requiring owner verification rather than inventing claims.

- [ ] **Step 2: Record every reusable image and SHA-256**

Include the master, square, portrait, and landscape paths, their pixel dimensions, and current publication status.

- [ ] **Step 3: Verify the note renders its embedded image**

Confirm the Obsidian embed points to the existing approved square or portrait derivative and the file exists.
