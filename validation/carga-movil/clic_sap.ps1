# Clic en coordenadas RELATIVAS a la ventana principal de SAP2000 (las de la captura), luego teclas y captura.
param([int]$x = -1, [int]$y = -1, [string]$png = "", [string[]]$teclas)
Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing
Add-Type @"
using System; using System.Runtime.InteropServices;
public class W2 { [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out R r); [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
 [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y); [DllImport("user32.dll")] public static extern void mouse_event(int f, int dx, int dy, int d, int e);
 [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow(); [DllImport("user32.dll")] public static extern bool SetProcessDPIAware(); public struct R { public int L, T, Rt, B; } }
"@
[W2]::SetProcessDPIAware() | Out-Null
$p = Get-Process SAP2000 | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object -First 1
$hw = $p.MainWindowHandle; [W2]::SetForegroundWindow($hw) | Out-Null; Start-Sleep -m 500
$r = New-Object W2+R; [W2]::GetWindowRect($hw, [ref]$r) | Out-Null
if ($x -ge 0) { [W2]::SetCursorPos($r.L + $x, $r.T + $y) | Out-Null; Start-Sleep -m 200; [W2]::mouse_event(2,0,0,0,0); [W2]::mouse_event(4,0,0,0,0); Start-Sleep -s 2 }
foreach ($t in $teclas) { if ($t) { [System.Windows.Forms.SendKeys]::SendWait($t); Start-Sleep -s 2 } }
if ($png) {
  $h2 = [W2]::GetForegroundWindow(); $q = New-Object W2+R; [W2]::GetWindowRect($h2, [ref]$q) | Out-Null
  $bmp = New-Object System.Drawing.Bitmap(($q.Rt - $q.L), ($q.B - $q.T)); $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.CopyFromScreen($q.L, $q.T, 0, 0, $bmp.Size); $bmp.Save($png); "captura " + $bmp.Width + "x" + $bmp.Height + " en " + $q.L + "," + $q.T
}
