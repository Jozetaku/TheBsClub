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

  $syntheticSource = Join-Path $testOutput 'composition-source.png'
  $synthetic = New-Object System.Drawing.Bitmap 100, 100
  $syntheticGraphics = [System.Drawing.Graphics]::FromImage($synthetic)
  try {
    $syntheticGraphics.Clear([System.Drawing.Color]::Blue)
    $borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Red), 6
    try { $syntheticGraphics.DrawRectangle($borderPen, 0, 0, 99, 99) } finally { $borderPen.Dispose() }
    $synthetic.Save($syntheticSource, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $syntheticGraphics.Dispose()
    $synthetic.Dispose()
  }

  $compositionOutput = Join-Path $testOutput 'composition'
  & $scriptPath -SourcePath $syntheticSource -OutputDirectory $compositionOutput -Slug 'composition-test' | Out-Null
  $edgeChecks = @(
    @{ Path = Join-Path $compositionOutput 'composition-test-landscape-1200x900.jpg'; Points = @(@(600, 4), @(600, 895)) },
    @{ Path = Join-Path $compositionOutput 'composition-test-portrait-1080x1350.jpg'; Points = @(@(4, 675), @(1075, 675)) }
  )
  foreach ($check in $edgeChecks) {
    $rendered = [System.Drawing.Bitmap]::FromFile($check.Path)
    try {
      foreach ($point in $check.Points) {
        $pixel = $rendered.GetPixel($point[0], $point[1])
        if ($pixel.R -lt 150 -or $pixel.G -gt 120 -or $pixel.B -gt 120) {
          throw "Full source boundary was cropped from $($check.Path) at $($point[0]),$($point[1])"
        }
      }
    } finally { $rendered.Dispose() }
  }

  $portraitSource = Join-Path $testOutput 'portrait-source.png'
  $portrait = New-Object System.Drawing.Bitmap 80, 100
  $portraitGraphics = [System.Drawing.Graphics]::FromImage($portrait)
  try {
    $portraitGraphics.Clear([System.Drawing.Color]::Blue)
    $portraitBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::Red), 6
    try { $portraitGraphics.DrawRectangle($portraitBorder, 0, 0, 79, 99) } finally { $portraitBorder.Dispose() }
    $portrait.Save($portraitSource, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $portraitGraphics.Dispose()
    $portrait.Dispose()
  }

  $portraitOutput = Join-Path $testOutput 'portrait-source-pack'
  & $scriptPath -SourcePath $portraitSource -OutputDirectory $portraitOutput -Slug 'portrait-source-test' | Out-Null
  $portraitMaster = Join-Path $portraitOutput 'portrait-source-test-master.png'
  $portraitSquare = Join-Path $portraitOutput 'portrait-source-test-square-1200.jpg'
  $portraitMasterImage = [System.Drawing.Image]::FromFile($portraitMaster)
  $portraitSquareImage = [System.Drawing.Bitmap]::FromFile($portraitSquare)
  try {
    if ($portraitMasterImage.Width -ne 80 -or $portraitMasterImage.Height -ne 100) {
      throw 'Portrait master dimensions were changed'
    }
    if ($portraitSquareImage.Width -ne 1200 -or $portraitSquareImage.Height -ne 1200) {
      throw 'Portrait source did not produce a square derivative'
    }
    $leftBoundary = $portraitSquareImage.GetPixel(130, 600)
    $rightBoundary = $portraitSquareImage.GetPixel(1069, 600)
    foreach ($pixel in @($leftBoundary, $rightBoundary)) {
      if ($pixel.R -lt 150 -or $pixel.G -gt 120 -or $pixel.B -gt 120) {
        throw 'Portrait source boundary was cropped from square derivative'
      }
    }
  } finally {
    $portraitSquareImage.Dispose()
    $portraitMasterImage.Dispose()
  }
  if ((Get-FileHash -Algorithm SHA256 -LiteralPath $portraitSource).Hash -ne
      (Get-FileHash -Algorithm SHA256 -LiteralPath $portraitMaster).Hash) {
    throw 'Portrait master copy hash differs from source'
  }
  'PASS: menu image pack contract'
} finally {
  if (Test-Path -LiteralPath $testOutput) { Remove-Item -LiteralPath $testOutput -Recurse -Force }
}
