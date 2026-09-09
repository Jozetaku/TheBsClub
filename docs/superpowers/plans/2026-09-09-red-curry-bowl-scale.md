# Red Curry Chicken Bowl Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce an owner-approved Red Curry Chicken master with only the curry bowl and its serving reduced by approximately 20 percent, then publish the standard reusable image pack and menu record.

**Architecture:** Treat the current website photograph as an immutable edit source. Generate one non-destructive candidate, inspect it against the source, and stop for owner approval. Only after approval, promote it to the active vault, derive the four standard formats with the existing pack generator, update the Obsidian product record, and replace the website/Swinch product image.

**Tech Stack:** Built-in image generation/editing, PowerShell 7, ImageMagick, Obsidian Markdown, existing `scripts/New-MenuImagePack.ps1`, browser UI for Swinch.

## Global Constraints

- Reduce only the curry bowl and the serving contained inside it by approximately 20 percent.
- Keep the rice bowl at its current size and position.
- Preserve red coconut curry, sliced chicken, short-cut long beans, sweet basil, and red chilli.
- Preserve the camera angle, white table, café background, lighting, colour balance, and overall composition.
- Add no text, logos, watermarks, drinks, utensils, people, or additional ingredients.
- Do not publish the candidate until the owner approves it.

---

### Task 1: Create and validate the candidate

**Files:**
- Read: `images/campaign/v6/red-curry-white-ceramic.jpg`
- Create: `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/red-curry-chicken/red-curry-chicken-candidate-v1-bowl-minus-20.png`

**Interfaces:**
- Consumes: the current 1200 × 1500 website photograph.
- Produces: one visually inspected PNG candidate for owner review.

- [ ] **Step 1: Inspect the source at original detail**

Use the image viewer and confirm the curry bowl, rice bowl, board edges, ingredient set, lighting, and camera angle that must be preserved.

- [ ] **Step 2: Generate one precise-object edit**

Use the built-in image editor with the source as the edit target and this invariant-led prompt:

```text
Use case: precise-object-edit
Asset type: restaurant menu master candidate
Primary request: Reduce only the foreground white ceramic curry bowl and the Red Curry Chicken serving inside it by approximately 20 percent. Reconstruct the newly exposed wooden serving board naturally.
Subject: Thai Red Curry Chicken with red coconut curry, sliced chicken, short-cut long beans, sweet basil, and red chilli; jasmine rice in a separate white ceramic bowl.
Composition/framing: preserve the source camera angle and positions; keep the rice bowl unchanged; keep both bowls fully visible and centred safely for marketplace crops.
Lighting/mood: preserve the natural restaurant lighting and colour balance.
Constraints: change only the curry bowl and its contained serving; preserve the rice bowl, ingredients, white table, wooden board, café background, perspective, and depth of field.
Avoid: added or removed ingredients, text, logos, watermarks, drinks, utensils, people, kraft paper, cardboard, or takeaway containers.
```

- [ ] **Step 3: Save the candidate non-destructively**

Copy the generated output to:

```text
C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/red-curry-chicken/red-curry-chicken-candidate-v1-bowl-minus-20.png
```

Do not overwrite the source or an earlier candidate.

- [ ] **Step 4: Validate file properties**

Run:

```powershell
magick identify "C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/red-curry-chicken/red-curry-chicken-candidate-v1-bowl-minus-20.png"
```

Expected: a readable PNG with no unexpected rotation or corruption.

- [ ] **Step 5: Inspect the candidate at original detail**

Confirm the curry bowl is approximately 20 percent smaller, the rice bowl is unchanged, all required ingredients remain, and no inaccurate objects were introduced.

- [ ] **Step 6: Owner approval checkpoint**

Show the candidate inline and wait. Do not perform Task 2 until the owner explicitly approves it.

### Task 2: Promote the approved image and create reusable formats

**Files:**
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/red-curry-chicken/Final/red-curry-chicken-master.png`
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/red-curry-chicken/Final/red-curry-chicken-square-1200.jpg`
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/red-curry-chicken/Final/red-curry-chicken-landscape-1200x900.jpg`
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/red-curry-chicken/Final/red-curry-chicken-portrait-1080x1350.jpg`
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/red-curry-chicken.md`
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Menu Hub.md`

**Interfaces:**
- Consumes: the owner-approved candidate from Task 1.
- Produces: the canonical master, three derivatives, and a discoverable Obsidian product record.

- [ ] **Step 1: Promote the approved candidate**

Copy it as `red-curry-chicken-master.png` without recompressing it.

- [ ] **Step 2: Generate the standard pack**

Run:

```powershell
pwsh -NoProfile -File scripts/New-MenuImagePack.ps1 -SourcePath "C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/red-curry-chicken/Final/red-curry-chicken-master.png" -OutputDirectory "C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/red-curry-chicken/Final" -Slug "red-curry-chicken"
```

Expected: Master, Square 1200 × 1200, Landscape 1200 × 900, and Portrait 1080 × 1350.

- [ ] **Step 3: Verify dimensions and master integrity**

Run `magick identify` on all four files and compare the source/master SHA-256 hashes with `Get-FileHash`.

Expected: all dimensions match their filenames and the master hash matches the approved candidate.

- [ ] **Step 4: Update the Obsidian record**

Create or update `red-curry-chicken.md` with the square image under the H1 and a `Reusable image pack` table linking all four assets. Add the product and its 320px square preview to `Menu Hub.md`.

- [ ] **Step 5: Validate Obsidian links**

Resolve every embedded image and asset link from the two Markdown files.

Expected: no broken links and four final assets.

### Task 3: Publish approved image surfaces

**Files:**
- Modify: `images/campaign/v6/red-curry-white-ceramic.jpg`
- Test: `tests/asian-menu.test.mjs`
- External: Red Curry Chicken product in Swinch merchant manager.

**Interfaces:**
- Consumes: the approved master/derivatives from Task 2.
- Produces: matching website and Swinch product imagery.

- [ ] **Step 1: Replace the website asset**

Export the approved portrait derivative to `images/campaign/v6/red-curry-white-ceramic.jpg` at high JPEG quality while preserving the file's expected 4:5 presentation.

- [ ] **Step 2: Run website tests**

Run:

```powershell
node --test tests/*.test.mjs
```

Expected: all tests pass with zero failures.

- [ ] **Step 3: Update Swinch**

Open the Red Curry Chicken product, upload the approved square derivative, save, and verify the thumbnail appears in the product list/menu. Do not alter the price; the website remains the price authority.

- [ ] **Step 4: Final visual verification**

Verify the website and Swinch both show the correct dish, keep the food centred, and do not crop either bowl.

- [ ] **Step 5: Commit the website asset**

```powershell
git add images/campaign/v6/red-curry-white-ceramic.jpg tests/asian-menu.test.mjs
git commit -m "feat: refine red curry serving image"
```
