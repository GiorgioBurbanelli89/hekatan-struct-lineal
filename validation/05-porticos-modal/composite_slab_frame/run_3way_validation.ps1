# ============================================================================
# run_3way_validation.ps1 — Corre el benchmark composite_slab_frame en 3 vias
# (MATLAB CLI + Hekatan Struct WASM + ETABS) y produce una tabla comparativa.
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File run_3way_validation.ps1
#
# Requiere:
#   - Node.js + tsx en hekatanlab-web/node_modules
#   - ETABS instalado (cualquier version 17+)
#   - matlab_lib y composite_slab_frame en ../matlab_lib y ./
# ============================================================================

$ErrorActionPreference = "Continue"

$root         = "C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0"
$hklWeb       = Join-Path $root "hekatanlab-web"
$struct       = Join-Path $root "hekatan-struct-lineal"
$benchPlaca   = Join-Path $struct "Benchmark_Placa"
$composite    = Join-Path $benchPlaca "composite_slab_frame"
$matlabLib    = Join-Path $benchPlaca "matlab_lib"
$libDir       = Join-Path $matlabLib "lib"
$etabsExtract = Join-Path $struct "Etabs Powershell\etabs_extract.ps1"
$exportE2k    = Join-Path $composite "export_e2k_thin_frame.mjs"

$variants = @("ShellThin", "ShellThick", "Membrane")

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " 3-WAY VALIDATION: composite_slab_frame (slab + frame)"      -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$results = @{}

foreach ($v in $variants) {
    Write-Host ""
    Write-Host "--- Variante: $v ---" -ForegroundColor Yellow
    $isWall = ($v -eq "Membrane")

    # 1. MATLAB CLI
    $matlabFile = if ($isWall) { "composite_wall_membrane_frame.m" }
                  elseif ($v -eq "ShellThick") { "composite_slab_thick_frame.m" }
                  else { "composite_slab_thin_frame.m" }
    Write-Host "[1/3] MATLAB CLI -> $matlabFile" -ForegroundColor Green
    Push-Location $hklWeb
    $matOut = & node --import "./hkl-bootstrap.mjs" "hkl.mjs" --load $libDir (Join-Path $matlabLib $matlabFile) 2>&1
    Pop-Location
    $wMat = ($matOut | Select-String -Pattern "w_centro\s*=\s*([\-\d.]+)\s*mm").Matches[0].Groups[1].Value
    $rxMat = ($matOut | Select-String -Pattern "Sum R[xz]\s*(?:base)?\s*=\s*([\-\d.]+)").Matches[0].Groups[1].Value
    if ($isWall) {
        $uxMat = ($matOut | Select-String -Pattern "ux\s*top.*?=\s*([\-\d.]+)\s*mm").Matches[0].Groups[1].Value
    }

    # 2. Hekatan Struct CLI
    $mjsFile = if ($isWall) { "run_composite_wall_membrane_frame.mjs" }
               elseif ($v -eq "ShellThick") { "run_composite_slab_thick_frame.mjs" }
               else { "run_composite_slab_thin_frame.mjs" }
    Write-Host "[2/3] Hekatan Struct CLI -> $mjsFile" -ForegroundColor Green
    Push-Location $struct
    $hkOut = & node (Join-Path "Benchmark_Placa\composite_slab_frame" $mjsFile) 2>&1
    Pop-Location
    $wHk = ($hkOut | Select-String -Pattern "w_centro\s*=\s*([\-\d.]+)\s*mm").Matches
    if ($wHk.Count -gt 0) { $wHk = $wHk[0].Groups[1].Value } else { $wHk = "?" }
    $rxHk = ($hkOut | Select-String -Pattern "Sum R[xz]\s*(?:base)?\s*=\s*([\-\d.]+)").Matches
    if ($rxHk.Count -gt 0) { $rxHk = $rxHk[0].Groups[1].Value } else { $rxHk = "?" }

    # 3. ETABS via .e2k
    Write-Host "[3/3] ETABS via OAPI -> $v" -ForegroundColor Green
    Push-Location $hklWeb
    & node --import "tsx/esm" $exportE2k $v 2>&1 | Out-Null
    Pop-Location

    $e2kName = if ($isWall) { "composite_wall_membrane_frame.e2k" }
               else { "composite_slab_$($v.ToLower())_frame.e2k" }
    $e2kPath = Join-Path $composite $e2kName
    $jsonPath = $e2kPath -replace "\.e2k$", ".json"
    $edbPath  = $e2kPath -replace "\.e2k$", ".EDB"
    Get-Process -Name "ETABS*" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
    Remove-Item $edbPath -Force -ErrorAction SilentlyContinue
    & powershell -ExecutionPolicy Bypass -File $etabsExtract -ModelPath $e2kPath -OutPath $jsonPath 2>&1 | Out-Null

    $wEt = "?"
    $rxEt = "?"
    if (Test-Path $jsonPath) {
        $json = Get-Content $jsonPath -Raw | ConvertFrom-Json
        if (-not $isWall) {
            $wMin = ($json.joint_displacements | Where-Object { $_.load_case -eq "Dead" } | Measure-Object -Property Uz -Minimum).Minimum
            $wEt = ("{0:N4}" -f ($wMin * 1000))
            $sumRz = ($json.joint_reactions | Where-Object { $_.load_case -eq "Dead" -and $_.Fz -ne 0 } | Measure-Object -Property Fz -Sum).Sum
            $rxEt = ("{0:N3}" -f $sumRz)
        } else {
            $uxMax = ($json.joint_displacements | Where-Object { $_.load_case -eq "Dead" } | Measure-Object -Property Ux -Maximum).Maximum
            $wEt = ("{0:N4}" -f ($uxMax * 1000))
            $sumRx = ($json.joint_reactions | Where-Object { $_.load_case -eq "Dead" -and $_.Fx -ne 0 } | Measure-Object -Property Fx -Sum).Sum
            $rxEt = ("{0:N3}" -f $sumRx)
        }
    }

    $results[$v] = @{
        wMat = $wMat; wHk = $wHk; wEt = $wEt
        rxMat = $rxMat; rxHk = $rxHk; rxEt = $rxEt
    }
}

# Tabla resumen
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " RESUMEN 3-WAY"                                                 -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

Write-Host ""
Write-Host ("{0,-12} | {1,12} | {2,16} | {3,12}" -f "Variante", "MATLAB", "Hekatan Struct", "ETABS") -ForegroundColor White
Write-Host ("{0,-12} | {1,12} | {2,16} | {3,12}" -f "--------", "------", "--------------", "-----") -ForegroundColor White

foreach ($v in $variants) {
    $r = $results[$v]
    $units = if ($v -eq "Membrane") { "mm (ux)" } else { "mm (w)" }
    Write-Host ("{0,-12} | {1,12} | {2,16} | {3,12}" -f "$v ($units)", $r.wMat, $r.wHk, $r.wEt)
    Write-Host ("{0,-12} | {1,12} | {2,16} | {3,12}" -f "  Sum R [kN]", $r.rxMat, $r.rxHk, $r.rxEt) -ForegroundColor Gray
}

Write-Host ""
Write-Host "[OK] 3-way validation completada"
