# ============================================================================
#  safe_debug_zapata.ps1
# ============================================================================
#  Debug SAFE F2K import + RunAnalysis via OAPI PowerShell.
#  Verifica step-by-step donde se rompe el workflow:
#    1. OpenFile         (parser de SAFE)
#    2. Count joints/areas (chequear que SAFE armo el modelo)
#    3. SetRunCaseFlag    (cases listos)
#    4. RunAnalysis       (solver)
#    5. Read results
# ============================================================================

param(
    [string] $F2KPath = "C:\Users\USUARIO\Downloads\Zapata_Hekatan_1777645102733.f2k",
    [string] $OutPath = "$PSScriptRoot\zapata_safe_debug.json",
    [switch] $Visible = $true
)

$ErrorActionPreference = "Continue"
Write-Output "================================================================"
Write-Output " SAFE F2K DEBUG via PowerShell OAPI"
Write-Output " F2K: $F2KPath"
Write-Output "================================================================"

if (-not (Test-Path $F2KPath)) {
    Write-Error "No existe: $F2KPath"
    exit 1
}

# Kill SAFE if running, fresh start
Get-Process SAFE -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# === Conectar SAFE OAPI ===
Write-Output "`n[1] Conectando a SAFE..."
$helper = New-Object -ComObject "SAFEv1.Helper"
$Sap = $helper.CreateObjectProgID("CSI.SAFE.API.ETABSObject")
$Sap.ApplicationStart() | Out-Null
Start-Sleep -Seconds 4
$M = $Sap.SapModel

# === Open F2K (usar ImportFile, NO OpenFile, para text format) ===
# OpenFile solo soporta .FDB binario; para .f2k/.e2k es ImportFile.
# ImportFile(FileName, FileType, Type)  -- FileType=0 (.f2k), Type=0 (replace)
Write-Output "`n[2] Abriendo F2K via ImportFile..."
$M.InitializeNewModel(6) | Out-Null
$M.File.NewBlank() | Out-Null
try {
    $ret = $M.File.ImportFile($F2KPath, 0, 0)
    Write-Output "    ImportFile(.f2k, type=0, replace=0) ret=$ret"
} catch {
    Write-Warning "ImportFile fallo: $($_.Exception.Message). Probando OpenFile..."
    $ret = $M.File.OpenFile($F2KPath)
    Write-Output "    OpenFile fallback ret=$ret"
}

# === Count post-import ===
$nPts = 0; $ptNames = $null
try { $r = $M.PointObj.GetNameList([ref] $nPts, [ref] $ptNames) } catch {}
$nAr = 0; $arNames = $null
try { $r = $M.AreaObj.GetNameList([ref] $nAr, [ref] $arNames) } catch {}
Write-Output "    Post-OpenFile:  $nPts joints,  $nAr areas"

# === Materials, sections ===
$nMat = 0; $matNames = $null
try { $r = $M.PropMaterial.GetNameList([ref] $nMat, [ref] $matNames) } catch {}
$nAS = 0; $asNames = $null
try { $r = $M.PropArea.GetNameList([ref] $nAS, [ref] $asNames) } catch {}
Write-Output "    Materials: $nMat ($($matNames -join ',')))"
Write-Output "    Area Sections: $nAS ($($asNames -join ','))"

# === Load patterns + cases ===
$nLP = 0; $lpNames = $null
try { $r = $M.LoadPatterns.GetNameList([ref] $nLP, [ref] $lpNames) } catch {}
$nLC = 0; $lcNames = $null
try { $r = $M.LoadCases.GetNameList([ref] $nLC, [ref] $lcNames) } catch {}
Write-Output "    Load Patterns: $nLP ($($lpNames -join ','))"
Write-Output "    Load Cases:    $nLC ($($lcNames -join ','))"

# === Set run case flag ===
Write-Output "`n[3] Activando cases para correr..."
foreach ($lc in $lcNames) {
    try {
        $r = $M.Analyze.SetRunCaseFlag($lc, $true)
        Write-Output "    SetRunCaseFlag($lc) ret=$r"
    } catch { Write-Warning "$($_.Exception.Message)" }
}

# === Save SDB (probar tambien sin Save) ===
$sdbPath = "$env:TEMP\zapata_safe_debug.FDB"
if (Test-Path $sdbPath) { Remove-Item $sdbPath -Force }
Write-Output "`n[4] Save SDB -> $sdbPath"
$r = $M.File.Save($sdbPath)
Write-Output "    Save ret=$r"

# Re-count post-Save
$nPts2 = 0; $tmp = $null
try { $M.PointObj.GetNameList([ref] $nPts2, [ref] $tmp) } catch {}
$nAr2 = 0
try { $M.AreaObj.GetNameList([ref] $nAr2, [ref] $tmp) } catch {}
Write-Output "    Post-Save:  $nPts2 joints,  $nAr2 areas"

# === Run analysis ===
Write-Output "`n[5] Run analysis..."
$t0 = Get-Date
$r = $M.Analyze.RunAnalysis()
$dt = ((Get-Date) - $t0).TotalSeconds
Write-Output "    RunAnalysis ret=$r en $($dt.ToString('N1')) s"

# === Try get last analysis log if exists ===
$logPath = $sdbPath -replace "\.FDB$", ".LOG"
if (Test-Path $logPath) {
    Write-Output "    LOG path: $logPath"
    Write-Output "    --- ULTIMAS 30 LINEAS DEL LOG ---"
    Get-Content $logPath -Tail 30 | ForEach-Object { Write-Output "    $_" }
} else {
    Write-Output "    No LOG file at $logPath"
}

# === Try extract results regardless of ret value ===
Write-Output "`n[6] Tratando de extraer resultados..."
try {
    $M.Results.Setup.DeselectAllCasesAndCombosForOutput() | Out-Null
    $M.Results.Setup.SetCaseSelectedForOutput("Dead", $true) | Out-Null

    $Num = 0
    $Obj = $Elm = $LC = $StepType = $StepNum = $null
    $U1 = $U2 = $U3 = $R1 = $R2 = $R3 = $null
    $rr = $M.Results.JointDispl("All", 2,
        [ref] $Num, [ref] $Obj, [ref] $Elm, [ref] $LC,
        [ref] $StepType, [ref] $StepNum,
        [ref] $U1, [ref] $U2, [ref] $U3,
        [ref] $R1, [ref] $R2, [ref] $R3)
    Write-Output "    JointDispl ret=$rr  Num=$Num"
    if ($Num -gt 0) {
        $maxUz = 0
        for ($i = 0; $i -lt $Num; $i++) {
            if ([Math]::Abs($U3[$i]) -gt [Math]::Abs($maxUz)) { $maxUz = $U3[$i] }
        }
        Write-Output "    max |Uz| = $([Math]::Abs($maxUz)*1000) mm"
    }
} catch { Write-Warning "Results: $($_.Exception.Message)" }

Write-Output "`n[DONE]"
