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
