# Captura la ventana de SAP2000 (tras mandarle teclas opcionales). uso: captura_sap.ps1 salida.png "{F6}" "{ENTER}"
param([string]$png, [string[]]$teclas)
Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W { [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out R r); [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h); [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c); public struct R { public int L, T, Rt, B; } }
"@
$p = Get-Process SAP2000 | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object -First 1
$hw = $p.MainWindowHandle; [W]::ShowWindow($hw, 3) | Out-Null; [W]::SetForegroundWindow($hw) | Out-Null; Start-Sleep -m 700
foreach ($t in $teclas) { if ($t) { [System.Windows.Forms.SendKeys]::SendWait($t); Start-Sleep -s 2 } }
Start-Sleep -s 2
$fg = Add-Type -MemberDefinition '[DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();' -Name F -PassThru
$h2 = $fg::GetForegroundWindow()
$r = New-Object W+R; [W]::GetWindowRect($h2, [ref]$r) | Out-Null
$bmp = New-Object System.Drawing.Bitmap(($r.Rt - $r.L), ($r.B - $r.T)); $g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($r.L, $r.T, 0, 0, $bmp.Size); $bmp.Save($png); "captura " + $bmp.Width + "x" + $bmp.Height
