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

function Save-JpegContain {
  param(
    [System.Drawing.Image]$Source,
    [int]$Width,
    [int]$Height,
    [string]$Destination
  )

  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $blurWidth = 48
  $blurHeight = [Math]::Max(1, [int][Math]::Round(48 * $Height / $Width))
  $blurred = New-Object System.Drawing.Bitmap $blurWidth, $blurHeight
  $blurGraphics = [System.Drawing.Graphics]::FromImage($blurred)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $parameters = $null
  $washBrush = $null
  try {
    $blurGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $blurGraphics.DrawImage($Source, 0, 0, $blurWidth, $blurHeight)

    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($blurred, 0, 0, $Width, $Height)
    $washBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(45, 255, 255, 255))
    $graphics.FillRectangle($washBrush, 0, 0, $Width, $Height)

    $scale = [Math]::Min($Width / $Source.Width, $Height / $Source.Height)
    $containedWidth = [int][Math]::Round($Source.Width * $scale)
    $containedHeight = [int][Math]::Round($Source.Height * $scale)
    $containedX = [int][Math]::Round(($Width - $containedWidth) / 2)
    $containedY = [int][Math]::Round(($Height - $containedHeight) / 2)
    $containedRectangle = New-Object System.Drawing.Rectangle $containedX, $containedY, $containedWidth, $containedHeight
    $fullSource = New-Object System.Drawing.Rectangle 0, 0, $Source.Width, $Source.Height
    $graphics.DrawImage($Source, $containedRectangle, $fullSource, [System.Drawing.GraphicsUnit]::Pixel)

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L
    $bitmap.Save($Destination, $codec, $parameters)
  } finally {
    if ($washBrush) { $washBrush.Dispose() }
    if ($parameters) { $parameters.Dispose() }
    $graphics.Dispose()
    $blurGraphics.Dispose()
    $blurred.Dispose()
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

  Save-JpegContain -Source $source -Width 1200 -Height 900 -Destination $landscapePath
  Save-JpegContain -Source $source -Width 1080 -Height 1350 -Destination $portraitPath
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
