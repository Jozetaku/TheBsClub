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
