#Requires -Version 5.1
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Sim {
    [DllImport("user32.dll")] public static extern void mouse_event(uint flags, int dx, int dy, uint data, UIntPtr extraInfo);
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);
    [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extraInfo);
    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP   = 0x0004;
}
"@

$snip = 'C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\tools\snip.ps1'
Write-Host 'Lanzando snip.ps1 directamente...'
Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-WindowStyle','Hidden','-File',"`"$snip`"") -WindowStyle Hidden

Start-Sleep -Milliseconds 1500

Write-Host 'Drag (300,300) -> (800,600)'
[Sim]::SetCursorPos(300, 300) | Out-Null
Start-Sleep -Milliseconds 300
[Sim]::mouse_event([Sim]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 200

$steps = 25
for ($i = 1; $i -le $steps; $i++) {
    $x = [int](300 + (500 * $i / $steps))
    $y = [int](300 + (300 * $i / $steps))
    [Sim]::SetCursorPos($x, $y) | Out-Null
    Start-Sleep -Milliseconds 30
}

Start-Sleep -Milliseconds 300
[Sim]::mouse_event([Sim]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [UIntPtr]::Zero)

Start-Sleep -Milliseconds 1800

Write-Host 'Enter -> Guardar'
[Sim]::keybd_event(0x0D, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 60
[Sim]::keybd_event(0x0D, 0, 2, [UIntPtr]::Zero)

Start-Sleep -Milliseconds 2000
Write-Host 'Listo.'
