@echo off
setlocal
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "TARGET=%~dp0snip-hotkey.vbs"
set "LINK=%STARTUP%\HekatanSnip.lnk"

powershell -NoProfile -Command "$s = New-Object -ComObject WScript.Shell; $sc = $s.CreateShortcut('%LINK%'); $sc.TargetPath='%TARGET%'; $sc.WorkingDirectory='%~dp0'; $sc.Save()"

start "" "%TARGET%"
echo.
echo HekatanSnip instalado.
echo - Hotkey: Ctrl+`  (tecla bajo Esc)
echo - Tray icon: click derecho para Salir o cambiar carpeta.
echo - Arranca solo al iniciar Windows.
echo.
pause
