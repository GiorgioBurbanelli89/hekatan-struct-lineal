# Cierra SAP2000/SAFE/ETABS si la RAM libre baja de 800 MB (vigilante de la sesion zapata).
while ($true) {
  $mb = [int]((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1024)
  if ($mb -lt 800) { Get-Process | ? { $_.Name -match 'SAP2000|SAFE|ETABS' } | Stop-Process -Force; "CERRADO por RAM $mb MB $(Get-Date)" | Out-File -Append vigia_ram.log; }
  Start-Sleep 5
}
