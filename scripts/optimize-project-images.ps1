# Re-encode only the supplied illustrative project visuals; the profile photo is untouched.
# Original files remain in the ignored .asset-originals directory.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$taskRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskBackup = Join-Path $taskRoot '.asset-originals'
New-Item -ItemType Directory -Force -Path $taskBackup | Out-Null
$taskFiles = @('src/assets/projects/thdc/ui-placeholder.jpg', 'src/assets/projects/gesture-mouse/demo-placeholder.jpg')
$taskEncoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
foreach ($taskRelative in $taskFiles) {
    $taskTarget = [IO.Path]::GetFullPath((Join-Path $taskRoot $taskRelative))
    if (-not $taskTarget.StartsWith($taskRoot + [IO.Path]::DirectorySeparatorChar)) { throw 'Asset escaped the project directory.' }
    $taskOriginal = Join-Path $taskBackup ([IO.Path]::GetFileName($taskTarget))
    if (-not (Test-Path -LiteralPath $taskOriginal)) { Copy-Item -LiteralPath $taskTarget -Destination $taskOriginal }
    $taskImage = [Drawing.Image]::FromFile($taskOriginal)
    $taskCanvas = $null
    $taskGraphics = $null
    $taskParams = $null
    try {
        $taskWidth = [Math]::Min(1280, $taskImage.Width)
        $taskHeight = [int][Math]::Round($taskImage.Height * $taskWidth / $taskImage.Width)
        $taskCanvas = New-Object Drawing.Bitmap($taskWidth, $taskHeight)
        $taskGraphics = [Drawing.Graphics]::FromImage($taskCanvas)
        $taskGraphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $taskGraphics.Clear([Drawing.Color]::White)
        $taskGraphics.DrawImage($taskImage, 0, 0, $taskWidth, $taskHeight)
        $taskParams = New-Object Drawing.Imaging.EncoderParameters(1)
        $taskParams.Param[0] = New-Object Drawing.Imaging.EncoderParameter([Drawing.Imaging.Encoder]::Quality, [long]88)
        $taskCanvas.Save($taskTarget, $taskEncoder, $taskParams)
        Write-Output ($taskRelative + ': ' + (Get-Item -LiteralPath $taskTarget).Length + ' bytes')
    } finally {
        if ($taskParams) { $taskParams.Dispose() }
        if ($taskGraphics) { $taskGraphics.Dispose() }
        if ($taskCanvas) { $taskCanvas.Dispose() }
        $taskImage.Dispose()
    }
}
