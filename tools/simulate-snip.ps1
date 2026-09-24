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
    public const uint MOUSEEVENTF_MOVE     = 0x0001;
    public const uint MOUSEEVENTF_ABSOLUTE = 0x8000;
    public const uint KEYEVENTF_KEYUP      = 0x0002;
}
"@

Write-Host "Esperando 4s para que sueltes el mouse/teclado..."
Start-Sleep -Seconds 4

Write-Host 'Disparando Ctrl+backtick'
[Sim]::keybd_event(0x11, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 30
[Sim]::keybd_event(0xC0, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 80
[Sim]::keybd_event(0xC0, 0, 2, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 30
[Sim]::keybd_event(0x11, 0, 2, [UIntPtr]::Zero)

Start-Sleep -Milliseconds 1200

Write-Host "Mouse: drag (300,300) -> (800,600)"
[Sim]::SetCursorPos(300, 300) | Out-Null
Start-Sleep -Milliseconds 250
[Sim]::mouse_event([Sim]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 200

# Smooth drag in steps
$steps = 20
for ($i = 1; $i -le $steps; $i++) {
    $x = [int](300 + (500 * $i / $steps))
    $y = [int](300 + (300 * $i / $steps))
    [Sim]::SetCursorPos($x, $y) | Out-Null
    Start-Sleep -Milliseconds 25
}

Start-Sleep -Milliseconds 200
[Sim]::mouse_event([Sim]::MOUSEEVENTF_LEFTUP, 0, 0, 0, [UIntPtr]::Zero)

Start-Sleep -Milliseconds 1500

Write-Host "Enter para Guardar"
[Sim]::keybd_event(0x0D, 0, 0, [UIntPtr]::Zero)
Start-Sleep -Milliseconds 50
[Sim]::keybd_event(0x0D, 0, 2, [UIntPtr]::Zero)

Start-Sleep -Milliseconds 1500
Write-Host "Listo."
