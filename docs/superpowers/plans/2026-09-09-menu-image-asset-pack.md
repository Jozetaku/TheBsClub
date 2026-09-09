# Menu Image Asset Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce reusable food-only Master, Square, Landscape and Portrait files for the three approved menu dishes and expose them as featured images in the active Obsidian vault.

**Architecture:** Add one reusable PowerShell image-pack generator to the website repository and verify it with a direct contract test. Run it against each immutable approved square master, write final assets to each dish's `Final` directory in the active Obsidian vault, then update the product notes and Menu Hub with resolvable embeds.

**Tech Stack:** PowerShell 7, System.Drawing, SHA-256 validation, Markdown/Obsidian.

## Global Constraints

- Use only the three owner-approved 1254×1254 PNG sources defined in the design spec.
- Do not generate or alter food, garnish, crockery, lighting or café scene.
- Do not add visible text, logos, borders or watermarks.
- Produce `-master.png`, `-square-1200.jpg`, `-landscape-1200x900.jpg` and `-portrait-1080x1350.jpg` for each kebab-case dish slug.
- JPEG derivatives use JPEG quality 92 and must never be stretched.
- Keep all serving vessels fully visible; fail rather than silently cut a vessel.
- Write final assets only under the three active-vault `Final` directories for `katsu-curry`, `green-curry-chicken` and `spicy-basil-chicken` listed in Task 2.
- Retain all historical candidates and legacy-vault files without modification or deletion.

---

### Task 1: Build the reusable image-pack generator

**Files:**
- Create: `tests/menu-image-pack.test.ps1`
- Create: `scripts/New-MenuImagePack.ps1`

**Interfaces:**
- Consumes: `-SourcePath <absolute PNG>`, `-OutputDirectory <absolute directory>`, `-Slug <kebab-case string>`.
- Produces: four deterministic files named from `Slug` and a PowerShell object containing their paths, sizes and SHA-256 values.

- [ ] **Step 1: Write the failing contract test**

Create `tests/menu-image-pack.test.ps1` with:

```powershell
$ErrorActionPreference = 'Stop'
$scriptPath = Join-Path $PSScriptRoot '..\scripts\New-MenuImagePack.ps1'
if (-not (Test-Path -LiteralPath $scriptPath)) { throw 'Generator script is missing' }

$source = 'C:\Users\v-bes\Documents\The B''s Club\outputs\menu-master\katsu-curry\katsu-curry-master-v1.png'
$testOutput = Join-Path ([System.IO.Path]::GetTempPath()) 'the-bs-club-menu-pack-test'
New-Item -ItemType Directory -Force -Path $testOutput | Out-Null

try {
  $result = & $scriptPath -SourcePath $source -OutputDirectory $testOutput -Slug 'katsu-curry-test'
  $expected = @{
    'katsu-curry-test-master.png' = @(1254, 1254)
    'katsu-curry-test-square-1200.jpg' = @(1200, 1200)
    'katsu-curry-test-landscape-1200x900.jpg' = @(1200, 900)
    'katsu-curry-test-portrait-1080x1350.jpg' = @(1080, 1350)
  }
  Add-Type -AssemblyName System.Drawing
  foreach ($name in $expected.Keys) {
    $path = Join-Path $testOutput $name
    if (-not (Test-Path -LiteralPath $path)) { throw "Missing output: $name" }
    $image = [System.Drawing.Image]::FromFile($path)
    try {
      if ($image.Width -ne $expected[$name][0] -or $image.Height -ne $expected[$name][1]) {
        throw "Wrong dimensions for $name"
      }
    } finally { $image.Dispose() }
  }
  $sourceHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $source).Hash
  $masterHash = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $testOutput 'katsu-curry-test-master.png')).Hash
  if ($sourceHash -ne $masterHash) { throw 'Master copy hash differs from source' }
  if ($result.Count -ne 4) { throw 'Generator did not report four outputs' }
  'PASS: menu image pack contract'
} finally {
  if (Test-Path -LiteralPath $testOutput) { Remove-Item -LiteralPath $testOutput -Recurse -Force }
}
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```powershell
pwsh -NoProfile -File tests/menu-image-pack.test.ps1
```

Expected: exit code 1 with `Generator script is missing`.

- [ ] **Step 3: Implement the minimal generator**

Create `scripts/New-MenuImagePack.ps1` with:

```powershell
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$SourcePath,
  [Parameter(Mandatory)][string]$OutputDirectory,
  [Parameter(Mandatory)][string]$Slug
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $SourcePath)) { throw "Source image not found: $SourcePath" }
if ($Slug -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') { throw "Invalid kebab-case slug: $Slug" }

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

function Save-JpegCrop {
  param(
    [System.Drawing.Image]$Source,
    [System.Drawing.Rectangle]$SourceRectangle,
    [int]$Width,
    [int]$Height,
    [string]$Destination
  )

  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $parameters = $null
  try {
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destinationRectangle = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
    $graphics.DrawImage($Source, $destinationRectangle, $SourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
    $bitmap.Save($Destination, $codec, $parameters)
  } finally {
    if ($parameters) { $parameters.Dispose() }
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

$source = [System.Drawing.Image]::FromFile($SourcePath)
try {
  if ($source.Width -ne $source.Height) { throw "Source must be square: $($source.Width)x$($source.Height)" }

  $masterPath = Join-Path $OutputDirectory "$Slug-master.png"
  $squarePath = Join-Path $OutputDirectory "$Slug-square-1200.jpg"
  $landscapePath = Join-Path $OutputDirectory "$Slug-landscape-1200x900.jpg"
  $portraitPath = Join-Path $OutputDirectory "$Slug-portrait-1080x1350.jpg"
  Copy-Item -LiteralPath $SourcePath -Destination $masterPath -Force

  $full = New-Object System.Drawing.Rectangle 0, 0, $source.Width, $source.Height
  Save-JpegCrop -Source $source -SourceRectangle $full -Width 1200 -Height 1200 -Destination $squarePath

  $landscapeHeight = [int][Math]::Round($source.Width * 0.75)
  $landscape = New-Object System.Drawing.Rectangle 0, ($source.Height - $landscapeHeight), $source.Width, $landscapeHeight
  Save-JpegCrop -Source $source -SourceRectangle $landscape -Width 1200 -Height 900 -Destination $landscapePath

  $portraitWidth = [int][Math]::Round($source.Height * 0.8)
  $portraitX = [int][Math]::Round(($source.Width - $portraitWidth) / 2)
  $portrait = New-Object System.Drawing.Rectangle $portraitX, 0, $portraitWidth, $source.Height
  Save-JpegCrop -Source $source -SourceRectangle $portrait -Width 1080 -Height 1350 -Destination $portraitPath
} finally {
  $source.Dispose()
}

$outputs = @(
  @{ Role = 'Master'; Path = $masterPath },
  @{ Role = 'Square'; Path = $squarePath },
  @{ Role = 'Landscape'; Path = $landscapePath },
  @{ Role = 'Portrait'; Path = $portraitPath }
)
foreach ($output in $outputs) {
  $image = [System.Drawing.Image]::FromFile($output.Path)
  try {
    [pscustomobject]@{
      Role = $output.Role
      Path = $output.Path
      Width = $image.Width
      Height = $image.Height
      SHA256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $output.Path).Hash
    }
  } finally { $image.Dispose() }
}
```

- [ ] **Step 4: Run the contract test and verify GREEN**

Run:

```powershell
pwsh -NoProfile -File tests/menu-image-pack.test.ps1
```

Expected: exit code 0 and `PASS: menu image pack contract`.

- [ ] **Step 5: Commit the generator and test**

Run:

```powershell
git add -- scripts/New-MenuImagePack.ps1 tests/menu-image-pack.test.ps1
git commit -m "feat: add reusable menu image pack generator"
```

### Task 2: Generate and inspect all three final packs

**Files:**
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/katsu-curry/Final/*`
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/green-curry-chicken/Final/*`
- Create: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Assets/spicy-basil-chicken/Final/*`

**Interfaces:**
- Consumes: `scripts/New-MenuImagePack.ps1` and the three approved masters.
- Produces: twelve reusable final files with validated names, sizes and hashes.

**Exact output manifest:**

- `crispy-chicken-katsu-curry-master.png`
- `crispy-chicken-katsu-curry-square-1200.jpg`
- `crispy-chicken-katsu-curry-landscape-1200x900.jpg`
- `crispy-chicken-katsu-curry-portrait-1080x1350.jpg`
- `thai-green-curry-chicken-master.png`
- `thai-green-curry-chicken-square-1200.jpg`
- `thai-green-curry-chicken-landscape-1200x900.jpg`
- `thai-green-curry-chicken-portrait-1080x1350.jpg`
- `spicy-basil-chicken-master.png`
- `spicy-basil-chicken-square-1200.jpg`
- `spicy-basil-chicken-landscape-1200x900.jpg`
- `spicy-basil-chicken-portrait-1080x1350.jpg`

- [ ] **Step 1: Run the generator for each approved source**

Run the generator with these exact slug/source pairs:

```powershell
$vaultAssets = "C:\Users\v-bes\Documents\Founder-Business-OS-Vault\02-BUSINESSES\The B's Club\Menu\Assets"
& scripts/New-MenuImagePack.ps1 -SourcePath "C:\Users\v-bes\Documents\The B's Club\outputs\menu-master\katsu-curry\katsu-curry-master-v1.png" -OutputDirectory "$vaultAssets\katsu-curry\Final" -Slug 'crispy-chicken-katsu-curry'
& scripts/New-MenuImagePack.ps1 -SourcePath "C:\Users\v-bes\Documents\The B's Club\outputs\menu-master\green-curry-chicken\green-curry-chicken-candidate-v3-bowl-minus-10.png" -OutputDirectory "$vaultAssets\green-curry-chicken\Final" -Slug 'thai-green-curry-chicken'
& scripts/New-MenuImagePack.ps1 -SourcePath "C:\Users\v-bes\Documents\The B's Club\outputs\menu-master\spicy-basil-chicken\spicy-basil-chicken-candidate-v2-less-beans-smaller-bowl.png" -OutputDirectory "$vaultAssets\spicy-basil-chicken\Final" -Slug 'spicy-basil-chicken'
```

- [ ] **Step 2: Verify the file contract**

Verify each `Final` directory contains exactly four files, all derivative dimensions match the output contract, and every master hash equals its corresponding source hash.

- [ ] **Step 3: Inspect all twelve files**

Open every file at original detail. Confirm food and serving vessels are fully visible, no derivative is stretched, and no text, logo, border or watermark was added. If any crop cuts a vessel, adjust only that dish's crop anchor and regenerate its pack.

### Task 3: Make the active Obsidian menu database visual

**Files:**
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Menu Hub.md`
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/katsu-curry.md`
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/thai-green-curry-chicken.md`
- Modify: `C:/Users/v-bes/Documents/Founder-Business-OS-Vault/02-BUSINESSES/The B's Club/Menu/Products/spicy-basil-chicken.md`

**Interfaces:**
- Consumes: the twelve validated files from Task 2.
- Produces: featured product images, reusable-file links and a visual Menu Hub.

- [ ] **Step 1: Embed each featured image**

Immediately below each product-note H1, add the matching square embed using a vault-root path, for example:

```markdown
![[02-BUSINESSES/The B's Club/Menu/Assets/spicy-basil-chicken/Final/spicy-basil-chicken-square-1200.jpg]]
```

- [ ] **Step 2: Add reusable-image tables**

Add a `## Reusable image pack` table to every product note with links to Master, Square, Landscape and Portrait files in its matching `Final` directory.

- [ ] **Step 3: Add visual cards to Menu Hub**

Under each menu row, embed the dish's square image at width 320 using these exact Obsidian paths:

```markdown
![[02-BUSINESSES/The B's Club/Menu/Assets/katsu-curry/Final/crispy-chicken-katsu-curry-square-1200.jpg|320]]
![[02-BUSINESSES/The B's Club/Menu/Assets/green-curry-chicken/Final/thai-green-curry-chicken-square-1200.jpg|320]]
![[02-BUSINESSES/The B's Club/Menu/Assets/spicy-basil-chicken/Final/spicy-basil-chicken-square-1200.jpg|320]]
```

- [ ] **Step 4: Verify every embed and link**

Parse every `![[...]]` and `[[...]]` target added in this task, resolve it against the active vault root and fail if any target is missing. Confirm all three product notes remain `status: published`.

- [ ] **Step 5: Run final verification**

Run:

```powershell
pwsh -NoProfile -File tests/menu-image-pack.test.ps1
git diff --check
```

Expected: contract test passes and Git reports no whitespace errors. Report the twelve final asset paths and the four updated Obsidian notes.
