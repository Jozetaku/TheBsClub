# Green Curry Bowl Scale Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a Green Curry product image whose curry bowl is approximately 10% smaller while the rice bowl and scene remain unchanged.

**Architecture:** Use the current no-cucumber square image as the immutable edit target and create a new versioned marketplace image with the built-in image editor. After visual approval, derive the website crop mechanically, update only the existing Green Curry website asset and metadata, and record every path and platform state in Obsidian.

**Tech Stack:** Built-in image generation/editing, PowerShell with System.Drawing for deterministic derivatives, static HTML, Node.js test runner, Markdown/Obsidian.

## Global Constraints

- Reduce the complete curry bowl, including its rim and curry contents, to approximately 90% of its current visual size.
- Keep the rice bowl at its current size and position.
- Preserve the camera angle, lighting, colour, wooden board, café background, chicken, green beans, basil and red chilli.
- Reconstruct the newly exposed wooden-board area naturally, without seams or duplicated objects.
- Do not add cucumber, new vegetables, text, logos, utensils, hands or extra garnishes.
- Save every output non-destructively until the user approves the new master.
- Treat website deployment and Uber Eats submission as separate external actions requiring confirmation immediately before submission.

---

### Task 1: Create and validate the revised square marketplace image

**Files:**
- Read: `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/green-curry-chicken/green-curry-chicken-candidate-v2-no-cucumber.png`
- Create: `C:/Users/v-bes/Documents/The B's Club/outputs/menu-master/green-curry-chicken/green-curry-chicken-candidate-v3-bowl-minus-10.png`
- Create: `C:/Users/v-bes/Documents/Obsidien/Founder/06-Business-OS/01-Businesses/The B's Club/Menu/Assets/green-curry-chicken/green-curry-chicken-candidate-v3-bowl-minus-10.png`

**Interfaces:**
- Consumes: the 1254×1254 no-cucumber v2 candidate.
- Produces: one square v3 candidate used by Task 2 and stored identically in both the workspace and Obsidian.

- [ ] **Step 1: Inspect the edit target**

Load the v2 candidate at original detail and verify that the curry bowl, rice bowl, wooden board and absence of cucumber-like slices match the approved design.

- [ ] **Step 2: Run one precise built-in image edit**

Use this exact edit specification:

```text
Use case: precise-object-edit
Asset type: square marketplace food photograph for Uber Eats and Swinch
Primary request: Reduce only the complete foreground Green Curry bowl and all of its contents to approximately 90% of its current visual size. Keep the bowl in the same visual area and make the serving look realistically smaller.
Input image: Image 1 is the edit target.
Scene/backdrop: Preserve the existing wooden serving board, white tabletop and softly blurred café interior.
Constraints: Keep the rice bowl exactly the same size and position. Preserve the camera angle, perspective, lighting, colour, chicken, green beans, Thai basil and red chilli. Reconstruct the newly exposed wooden-board area naturally. Change only the curry bowl scale.
Avoid: cucumber or cucumber-like round green slices, new vegetables, duplicated food, distorted ceramics, text, logos, utensils, hands, extra garnish, borders or watermarks.
```

- [ ] **Step 3: Save the result non-destructively**

Copy the selected generated output to both v3 paths. Do not overwrite v2.

- [ ] **Step 4: Verify file identity and visual constraints**

Run:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath `
  "C:\Users\v-bes\Documents\The B's Club\outputs\menu-master\green-curry-chicken\green-curry-chicken-candidate-v3-bowl-minus-10.png", `
  "C:\Users\v-bes\Documents\Obsidien\Founder\06-Business-OS\01-Businesses\The B's Club\Menu\Assets\green-curry-chicken\green-curry-chicken-candidate-v3-bowl-minus-10.png"
```

Expected: both SHA-256 values are identical. Inspect the v2 and v3 images at original detail; the curry bowl is approximately 10% smaller, while the rice bowl and scene are unchanged and no cucumber-like slices exist.

### Task 2: Build the website derivative and update website metadata

**Files:**
- Modify: `images/campaign/v5/green-curry-chicken.jpg`
- Modify: `index.html:315`
- Modify: `en/index.html:315`

**Interfaces:**
- Consumes: the approved square v3 candidate from Task 1.
- Produces: a 1200×900 JPEG shown in the 4:3 Green Curry menu card with matching intrinsic HTML dimensions.

- [ ] **Step 1: Create the deterministic 4:3 derivative**

Use System.Drawing to crop the square source around both bowls without changing their relative scale, resize to 1200×900 with high-quality bicubic interpolation, and save as JPEG quality 92 at `images/campaign/v5/green-curry-chicken.jpg`.

- [ ] **Step 2: Verify the output dimensions**

Run:

```powershell
Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile('images/campaign/v5/green-curry-chicken.jpg')
try { "$($image.Width)x$($image.Height)" } finally { $image.Dispose() }
```

Expected: `1200x900`.

- [ ] **Step 3: Keep bilingual intrinsic dimensions synchronized**

Confirm both `index.html` and `en/index.html` use:

```html
width="1200" height="900"
```

for `/images/campaign/v5/green-curry-chicken.jpg`.

- [ ] **Step 4: Run focused website tests**

Run:

```powershell
node --test tests/asian-menu.test.mjs tests/menu-sets.test.mjs
git diff --check
```

Expected: 10 tests pass, 0 fail; `git diff --check` exits successfully.

- [ ] **Step 5: Commit only the website derivative and its bilingual metadata**

Run:

```powershell
git add -- index.html en/index.html images/campaign/v5/green-curry-chicken.jpg
git commit -m "fix: reduce green curry serving scale"
```

Expected: the commit contains exactly three files and does not include unrelated untracked assets.

### Task 3: Update the product record and prepare external publication

**Files:**
- Modify: `C:/Users/v-bes/Documents/Obsidien/Founder/06-Business-OS/01-Businesses/The B's Club/Menu/Products/thai-green-curry-chicken.md`
- Create: `C:/Users/v-bes/Documents/Obsidien/Founder/06-Business-OS/01-Businesses/The B's Club/Menu/Assets/green-curry-chicken/green-curry-chicken-website-1200x900-v3.jpg`

**Interfaces:**
- Consumes: the final v3 square candidate and website derivative.
- Produces: a durable audit record plus files ready for website deployment, Uber Eats review and later Swinch use.

- [ ] **Step 1: Copy the website derivative to Obsidian**

Copy the final 1200×900 JPEG to the versioned Obsidian asset path and verify its SHA-256 hash matches the website file.

- [ ] **Step 2: Update the Obsidian product record**

Add image rows for the v3 square marketplace candidate and the v3 website derivative. Mark v2 as superseded but retain it for rollback. Record that the curry bowl was reduced approximately 10%, the rice bowl was preserved, and publication remains pending.

- [ ] **Step 3: Run the complete website test suite**

Run:

```powershell
node --test tests/*.test.mjs
git diff --check
```

Expected: 151 tests pass, 0 fail; no whitespace errors.

- [ ] **Step 4: Present the image for owner approval**

Show the v3 square candidate inline and report the saved workspace and Obsidian paths. Do not deploy or submit it yet.

- [ ] **Step 5: Request action-time confirmation for publication**

State that the next actions will publish the image on the public website and submit it to Uber Eats for review. Proceed only after the user confirms those external actions and Chrome file-upload access is enabled.
