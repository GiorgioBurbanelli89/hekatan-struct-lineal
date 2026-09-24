#Requires -Version 5.1
param([switch]$SetFolder)

$LogPath = Join-Path $env:TEMP 'HekatanSnip.log'
function Log { param($m) Add-Content -Path $LogPath -Value ("[{0}] {1}" -f (Get-Date -Format 'HH:mm:ss.fff'), $m) }
Log "=== snip.ps1 start ==="

Add-Type -Name U32 -Namespace W -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();' -ErrorAction SilentlyContinue
try { [W.U32]::SetProcessDPIAware() | Out-Null } catch {}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$ConfigPath = Join-Path $env:APPDATA 'HekatanSnip\config.json'
$ConfigDir = Split-Path $ConfigPath -Parent
if (-not (Test-Path $ConfigDir)) { New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null }

function Get-DefaultFolder {
    if (Test-Path $ConfigPath) {
        try {
            $cfg = Get-Content $ConfigPath -Raw | ConvertFrom-Json
            if ($cfg.defaultFolder -and (Test-Path $cfg.defaultFolder)) { return $cfg.defaultFolder }
        } catch {}
    }
    return $null
}

function Set-DefaultFolderInteractive {
    $dlg = New-Object System.Windows.Forms.FolderBrowserDialog
    $dlg.Description = 'Elegi la carpeta por defecto para guardar los recortes'
    $current = Get-DefaultFolder
    if ($current) { $dlg.SelectedPath = $current }
    if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $cfg = @{ defaultFolder = $dlg.SelectedPath } | ConvertTo-Json
        Set-Content -Path $ConfigPath -Value $cfg -Encoding UTF8
        return $dlg.SelectedPath
    }
    return $null
}

if ($SetFolder) {
    $f = Set-DefaultFolderInteractive
    if ($f) { [System.Windows.Forms.MessageBox]::Show("Carpeta por defecto: $f", 'HekatanSnip') | Out-Null }
    return
}

$defaultFolder = Get-DefaultFolder
if (-not $defaultFolder) {
    $defaultFolder = 'C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\ScreenShoot'
    if (-not (Test-Path $defaultFolder)) { New-Item -ItemType Directory -Path $defaultFolder -Force | Out-Null }
    $cfg = @{ defaultFolder = $defaultFolder } | ConvertTo-Json
    Set-Content -Path $ConfigPath -Value $cfg -Encoding UTF8
}

$bounds = [System.Windows.Forms.SystemInformation]::VirtualScreen

$original = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$og = [System.Drawing.Graphics]::FromImage($original)
$og.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
$og.Dispose()

$dimmed = New-Object System.Drawing.Bitmap $original
$dg = [System.Drawing.Graphics]::FromImage($dimmed)
$db = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(130, 0, 0, 0))
$dg.FillRectangle($db, 0, 0, $dimmed.Width, $dimmed.Height)
$db.Dispose()
$dg.Dispose()

$form = New-Object System.Windows.Forms.Form
$form.FormBorderStyle = 'None'
$form.StartPosition = 'Manual'
$form.Bounds = $bounds
$form.BackgroundImage = $dimmed
$form.BackgroundImageLayout = 'None'
$form.TopMost = $true
$form.Cursor = [System.Windows.Forms.Cursors]::Cross
$form.KeyPreview = $true
$form.ShowInTaskbar = $false

$prop = $form.GetType().GetProperty('DoubleBuffered', [System.Reflection.BindingFlags]::Instance -bor [System.Reflection.BindingFlags]::NonPublic)
$prop.SetValue($form, $true, $null)

$script:start = $null
$script:rect = New-Object System.Drawing.Rectangle 0, 0, 0, 0
$script:committed = $false

$form.Add_KeyDown({ if ($_.KeyCode -eq 'Escape') { $form.Close() } })
$form.Add_MouseDown({
    $script:start = [System.Drawing.Point]::new($_.X, $_.Y)
    $script:rect = New-Object System.Drawing.Rectangle $_.X, $_.Y, 0, 0
})
$form.Add_MouseMove({
    if ($script:start) {
        $x = [Math]::Min($script:start.X, $_.X)
        $y = [Math]::Min($script:start.Y, $_.Y)
        $w = [Math]::Abs($_.X - $script:start.X)
        $h = [Math]::Abs($_.Y - $script:start.Y)
        $script:rect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
        $form.Invalidate()
    }
})
$form.Add_MouseUp({
    if ($script:rect.Width -gt 2 -and $script:rect.Height -gt 2) { $script:committed = $true }
    $form.Close()
})
$form.Add_Paint({
    if ($script:rect.Width -gt 0 -and $script:rect.Height -gt 0) {
        $_.Graphics.DrawImage($original, $script:rect, $script:rect, [System.Drawing.GraphicsUnit]::Pixel)
        $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::Red), 2
        $_.Graphics.DrawRectangle($pen, $script:rect)
        $pen.Dispose()
    }
})

Log "Showing overlay form..."
[void]$form.ShowDialog()
Log ("Form closed. committed={0} rect={1}x{2}" -f $script:committed, $script:rect.Width, $script:rect.Height)
$form.Dispose()
$dimmed.Dispose()

if (-not $script:committed) { Log "Not committed, exiting"; $original.Dispose(); return }

$r = $script:rect
$cropped = New-Object System.Drawing.Bitmap $r.Width, $r.Height
$cg = [System.Drawing.Graphics]::FromImage($cropped)
$cg.DrawImage($original, (New-Object System.Drawing.Rectangle 0, 0, $r.Width, $r.Height), $r, [System.Drawing.GraphicsUnit]::Pixel)
$cg.Dispose()
$original.Dispose()

$ts = Get-Date -Format 'yyyyMMdd_HHmmss'
$filename = "capture_$ts.png"
if (-not (Test-Path $defaultFolder)) { New-Item -ItemType Directory -Path $defaultFolder -Force | Out-Null }
$saveTo = Join-Path $defaultFolder $filename
$cropped.Save($saveTo, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

[System.Windows.Forms.Clipboard]::SetText($saveTo)
Log ("Saved + path to clipboard: {0}" -f $saveTo)
