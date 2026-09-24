#Requires -Version 5.1
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Windows.Forms;
public class Hk : NativeWindow, IDisposable {
    [DllImport("user32.dll")] static extern bool RegisterHotKey(IntPtr hWnd, int id, uint mod, uint vk);
    [DllImport("user32.dll")] static extern bool UnregisterHotKey(IntPtr hWnd, int id);
    const int WM_HOTKEY = 0x0312;
    public bool Registered;
    public event EventHandler Pressed;
    public Hk(uint mod, uint vk) {
        this.CreateHandle(new CreateParams());
        Registered = RegisterHotKey(this.Handle, 1, mod, vk);
    }
    protected override void WndProc(ref Message m) {
        if (m.Msg == WM_HOTKEY) { var e = Pressed; if (e != null) e(this, EventArgs.Empty); }
        base.WndProc(ref m);
    }
    public void Dispose() {
        if (Registered) UnregisterHotKey(this.Handle, 1);
        this.DestroyHandle();
    }
}
"@ -ReferencedAssemblies System.Windows.Forms

$scriptDir = Split-Path $MyInvocation.MyCommand.Path -Parent
$snipPath = Join-Path $scriptDir 'snip.ps1'

function Launch-Snip {
    Start-Process -FilePath 'powershell.exe' -ArgumentList @(
        '-NoProfile','-ExecutionPolicy','Bypass','-WindowStyle','Hidden','-File',"`"$snipPath`""
    ) -WindowStyle Hidden
}

# MOD_CONTROL = 0x0002 ; VK_OEM_3 (tecla `) = 0xC0
$hk = New-Object Hk 2, 0xC0
$hk.add_Pressed({ Launch-Snip })

if (-not $hk.Registered) {
    [System.Windows.Forms.MessageBox]::Show(
        'No se pudo registrar Ctrl+` (puede estar en uso por otro programa).',
        'HekatanSnip'
    ) | Out-Null
}

$ni = New-Object System.Windows.Forms.NotifyIcon
$ni.Icon = [System.Drawing.SystemIcons]::Application
$ni.Text = 'HekatanSnip - Ctrl+` para recortar'
$ni.Visible = $true

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$miSnip = $menu.Items.Add('Recortar ahora')
$miSnip.add_Click({ Launch-Snip })
$miCfg = $menu.Items.Add('Cambiar carpeta por defecto...')
$miCfg.add_Click({
    Start-Process -FilePath 'powershell.exe' -ArgumentList @(
        '-NoProfile','-ExecutionPolicy','Bypass','-File',"`"$snipPath`"",'-SetFolder'
    )
})
[void]$menu.Items.Add('-')
$miExit = $menu.Items.Add('Salir')
$miExit.add_Click({
    $hk.Dispose()
    $ni.Visible = $false
    $ni.Dispose()
    [System.Windows.Forms.Application]::Exit()
})
$ni.ContextMenuStrip = $menu
$ni.add_MouseDoubleClick({ Launch-Snip })

[System.Windows.Forms.Application]::Run()
