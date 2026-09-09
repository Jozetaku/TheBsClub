# Katsu Approved Master Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public website's Katsu Curry photograph with the owner-approved reusable Katsu portrait.

**Architecture:** Keep both existing website references unchanged and replace their shared JPEG asset at the current path. Export the approved Obsidian portrait to the website's required 1200 × 1500 dimensions, verify visually and through the complete test suite, then push and confirm the deployed bytes by SHA-256.

**Tech Stack:** PowerShell 7, System.Drawing, Node.js test runner, GitHub Pages, Obsidian Markdown.

## Global Constraints

- Use the approved `crispy-chicken-katsu-curry-portrait-1080x1350.jpg` source.
- Preserve the complete curry bowl, rice plate, coriander garnish, lighting, white table and café setting.
- Do not generate or alter food, crockery, garnish, text, logos, watermarks or background elements.
- Keep all website names, descriptions, prices, links and ordering behaviour unchanged.

---

### Task 1: Replace and publish the shared Katsu website asset

**Files:**
- Read: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/katsu-curry/Final/crispy-chicken-katsu-curry-portrait-1080x1350.jpg`
- Modify: `images/campaign/v7/katsu-curry-natural-six.jpg`
- Test: `tests/asian-menu.test.mjs`
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/katsu-curry.md`

**Interfaces:**
- Consumes: the owner-approved 1080 × 1350 JPEG portrait.
- Produces: a 1200 × 1500 website JPEG used by both the Katsu menu card and Food + Boba card.

- [ ] **Step 1: Export the approved image at the website dimensions**

Run this from the repository worktree:

```powershell
Add-Type -AssemblyName System.Drawing
$sourcePath = "C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/katsu-curry/Final/crispy-chicken-katsu-curry-portrait-1080x1350.jpg"
$destinationPath = "images/campaign/v7/katsu-curry-natural-six.jpg"
$source = [System.Drawing.Image]::FromFile($sourcePath)
$bitmap = New-Object System.Drawing.Bitmap 1200, 1500
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$parameters = $null
try {
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($source, 0, 0, 1200, 1500)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq "image/jpeg"
  $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
  $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
  $bitmap.Save($destinationPath, $codec, $parameters)
} finally {
  if ($parameters) { $parameters.Dispose() }
  $graphics.Dispose()
  $bitmap.Dispose()
  $source.Dispose()
}
```

- [ ] **Step 2: Verify dimensions and inspect the exported image**

Load the destination with `System.Drawing.Image::FromFile` and verify `Width = 1200`, `Height = 1500`. Inspect it at original detail and confirm that the complete curry bowl and rice plate remain visible.

- [ ] **Step 3: Confirm both website surfaces still use the shared path**

Run:

```powershell
rg -n "images/campaign/v7/katsu-curry-natural-six.jpg|/images/campaign/v7/katsu-curry-natural-six.jpg" index.html en/index.html
```

Expected: two references in the German homepage and two references in the English homepage; no HTML edits required.

- [ ] **Step 4: Run complete verification**

Run:

```powershell
pwsh -NoProfile -File tests/menu-image-pack.test.ps1
node --test tests/*.test.mjs
git diff --check
```

Expected: the image-pack contract passes, all website tests pass with zero failures, and `git diff --check` exits successfully.

- [ ] **Step 5: Commit the website asset**

```powershell
git add images/campaign/v7/katsu-curry-natural-six.jpg
git commit -m "feat: publish approved katsu menu image"
```

- [ ] **Step 6: Merge, push and verify deployment**

After the standard branch-finishing checkpoint, merge to `main`, push `main`, and compare the local file SHA-256 with:

```text
https://www.thebsclub.ch/images/campaign/v7/katsu-curry-natural-six.jpg
```

Expected: local and public SHA-256 hashes match.

- [ ] **Step 7: Update the Obsidian product history**

Record the website publication date, commit, and live hash verification in `katsu-curry.md`. Do not change the canonical master or reusable pack.
