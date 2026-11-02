# ============================================================================
# build_and_extract_slab_thin.ps1
# Construye via ETABS OAPI el benchmark losa thin 4x4 m + 16 vigas perimetrales,
# corre analisis y extrae w_centro, M, V, R para comparar contra MATLAB / Hekatan.
# ============================================================================

param(
    [string]$OutPath = "C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\etabs\composite_slab_thin_frame_oapi.json",
    [ValidateSet("ShellThin","ShellThick","Membrane")]
    [string]$ShellType = "ShellThin"
)

$ErrorActionPreference = "Continue"

Write-Output "[INFO] Conectando a ETABS via OAPI..."
$helper = New-Object -ComObject "ETABSv1.Helper"
$ETABSObject = $helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
$ret = $ETABSObject.ApplicationStart()
$SapModel = $ETABSObject.SapModel

Write-Output "[INFO] Inicializando modelo (kN, m, C)..."
# eUnits_kN_m_C = 6
$SapModel.InitializeNewModel(6) | Out-Null
$SapModel.File.NewBlank() | Out-Null

# === 1. Story ===
Write-Output "[INFO] Creando 1 story (Story1, height=4 m)..."
$nStories = 1
$storyNames    = @("Story1")
$storyElevs    = @([double]4.0)
$storyHeights  = @([double]4.0)
$isMaster      = @([int]1)
$similarTo     = @("None")
$spliceAbove   = @([int]0)
$spliceHeight  = @([double]0.0)
$colorArr      = @([int]0)

# OAPI: SetStories_2
try {
  $ret = $SapModel.Story.SetStories_2(0, $nStories, [ref]$storyNames, [ref]$storyHeights, [ref]$isMaster, [ref]$similarTo, [ref]$spliceAbove, [ref]$spliceHeight, [ref]$colorArr)
  Write-Output "[INFO] Story creado, ret=$ret"
} catch {
  Write-Warning "SetStories_2 fallo: $($_.Exception.Message)"
}

# === 2. Materiales ===
Write-Output "[INFO] Definiendo materiales..."
# Concreto C25
$ret = $SapModel.PropMaterial.SetMaterial("C25", 2)  # 2 = Concrete
$ret = $SapModel.PropMaterial.SetMPIsotropic("C25", 25000000, 0.20, 1e-5)

# Acero
$ret = $SapModel.PropMaterial.SetMaterial("STEEL", 1)  # 1 = Steel
$ret = $SapModel.PropMaterial.SetMPIsotropic("STEEL", 200000000, 0.30, 1.17e-5)

# === 3. Seccion frame W360x60 ===
Write-Output "[INFO] Definiendo seccion frame W360x60..."
# SetISection: name, mat, t3, t2, tf, tw, t2b, tfb
# (D=0.352, B=0.203, TF=0.013, TW=0.008)
$ret = $SapModel.PropFrame.SetISection("W360X60", "STEEL", 0.352, 0.203, 0.013, 0.008, 0.203, 0.013)

# === 4. Seccion shell ===
Write-Output "[INFO] Definiendo seccion shell tipo $ShellType (t=0.10 m)..."
# eShellType: 1=ShellThin, 2=ShellThick, 3=Membrane, 4=Plate-Thin, 5=Plate-Thick
switch ($ShellType) {
    "ShellThin"  { $sType = 1 }
    "ShellThick" { $sType = 2 }
    "Membrane"   { $sType = 3 }
}
# SetSlab: name, slabtype, shelltype, mat_prop, thickness, color
$ret = $SapModel.PropArea.SetSlab("S100", 0, $sType, "C25", 0.10)

# === 5. Puntos (25 nodos en Story1, plano horizontal 5x5) ===
Write-Output "[INFO] Creando 25 puntos..."
$pointNames = @{}
for ($j = 0; $j -le 4; $j++) {
    for ($i = 0; $i -le 4; $i++) {
        $idx = $j * 5 + $i + 1
        $x = [double]$i
        $y = [double]$j
        $z = 4.0  # elev Story1
        $name = ""
        $ret = $SapModel.PointObj.AddCartesian($x, $y, $z, [ref]$name)
        $pointNames["$i,$j"] = $name
    }
}
Write-Output "[INFO] $($pointNames.Count) puntos creados"

# === 6. Frames perimetrales (16) ===
Write-Output "[INFO] Creando 16 frames perimetrales..."
$frameDefs = @()
# bottom (y=0): along x
for ($i = 0; $i -lt 4; $i++) { $frameDefs += @{ p1 = "$i,0"; p2 = ($i+1).ToString() + ",0" } }
# top (y=4)
for ($i = 0; $i -lt 4; $i++) { $frameDefs += @{ p1 = "$i,4"; p2 = ($i+1).ToString() + ",4" } }
# left (x=0)
for ($j = 0; $j -lt 4; $j++) { $frameDefs += @{ p1 = "0,$j"; p2 = "0," + ($j+1).ToString() } }
# right (x=4)
for ($j = 0; $j -lt 4; $j++) { $frameDefs += @{ p1 = "4,$j"; p2 = "4," + ($j+1).ToString() } }

$frameNames = @()
foreach ($f in $frameDefs) {
    $p1n = $pointNames[$f.p1]
    $p2n = $pointNames[$f.p2]
    $fname = ""
    $ret = $SapModel.FrameObj.AddByPoint($p1n, $p2n, [ref]$fname, "W360X60")
    $frameNames += $fname
}
Write-Output "[INFO] $($frameNames.Count) frames creados"

# === 7. Areas Q4 (16 shells) ===
Write-Output "[INFO] Creando 16 areas Q4..."
$areaNames = @()
for ($j = 0; $j -lt 4; $j++) {
    for ($i = 0; $i -lt 4; $i++) {
        $p_bl = $pointNames["$i,$j"]
        $p_br = $pointNames[($i+1).ToString() + ",$j"]
        $p_tr = $pointNames[($i+1).ToString() + "," + ($j+1).ToString()]
        $p_tl = $pointNames["$i," + ($j+1).ToString()]
        $names = @($p_bl, $p_br, $p_tr, $p_tl)
        $aname = ""
        $ret = $SapModel.AreaObj.AddByPoint(4, [ref]$names, [ref]$aname, "S100")
        $areaNames += $aname
    }
}
Write-Output "[INFO] $($areaNames.Count) areas creadas"

# === 8. Restraints en 4 esquinas (UX UY UZ pin) ===
Write-Output "[INFO] Aplicando pin supports a 4 esquinas..."
$cornerKeys = @("0,0", "4,0", "0,4", "4,4")
$rest = @([bool]$true, [bool]$true, [bool]$true, [bool]$false, [bool]$false, [bool]$false)
foreach ($key in $cornerKeys) {
    $pn = $pointNames[$key]
    $ret = $SapModel.PointObj.SetRestraint($pn, [ref]$rest)
}

# === 9. Load pattern + carga uniforme ===
Write-Output "[INFO] Definiendo DEAD + carga uniforme 5 kN/m^2..."
# AddLoadPattern: name, type (1=Dead), self_weight, addLC=true
$ret = $SapModel.LoadPatterns.Add("DEAD", 1, 0.0, $true)

# Aplicar carga uniforme a cada area: 5 kN/m^2 hacia abajo (DIR=Gravity, value positive)
foreach ($an in $areaNames) {
    # SetLoadUniform: name, lp, value, dir=10(gravity), replace=true, csys="Global", item=0(object)
    $ret = $SapModel.AreaObj.SetLoadUniform($an, "DEAD", 5.0, 10, $true, "Global", 0)
}

# === 10. Run Analysis ===
Write-Output "[INFO] Guardando modelo y corriendo analisis..."
$edbPath = $OutPath -replace "\.json$", ".EDB"
$ret = $SapModel.File.Save($edbPath)
Write-Output "[INFO] Saved: $edbPath (ret=$ret)"

$t0 = Get-Date
$ret = $SapModel.Analyze.RunAnalysis()
$dt = ((Get-Date) - $t0).TotalSeconds
Write-Output ("[INFO] RunAnalysis ret={0} en {1:N1}s" -f $ret, $dt)

# === 11. Extraer resultados ===
Write-Output "[INFO] Extrayendo resultados..."
$out = [ordered]@{
    shell_type    = $ShellType
    extracted_at  = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    units         = "kN, m, C"
}

# Setup output: solo DEAD case
$SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput() | Out-Null
$SapModel.Results.Setup.SetCaseSelectedForOutput("DEAD", $true) | Out-Null

# 11a. Joint displacements (solo nodo central nombre depende de orden)
$nPts = 0; $ptNames = $null
$ret = $SapModel.PointObj.GetNameList([ref]$nPts, [ref]$ptNames)
Write-Output "[INFO] Modelo tiene $nPts nodos"

$displ = @()
$reacs = @()
foreach ($pn in $ptNames) {
    # Coords
    $x=[double]0; $y=[double]0; $z=[double]0
    $SapModel.PointObj.GetCoordCartesian($pn, [ref]$x, [ref]$y, [ref]$z, "Global") | Out-Null

    # Displacement
    $nObj=0; $obj=$null; $elm=$null; $lc=$null; $sCase=$null; $sStep=0
    $u1=$null; $u2=$null; $u3=$null; $r1=$null; $r2=$null; $r3=$null
    try {
        $ret = $SapModel.Results.JointDispl($pn, 0, [ref]$nObj, [ref]$obj, [ref]$elm, [ref]$lc, [ref]$sCase, [ref]$sStep, [ref]$u1, [ref]$u2, [ref]$u3, [ref]$r1, [ref]$r2, [ref]$r3)
        if ($nObj -gt 0) {
            $displ += [ordered]@{ name=$pn; x=$x; y=$y; z=$z; u1=$u1[0]; u2=$u2[0]; u3=$u3[0]; r1=$r1[0]; r2=$r2[0]; r3=$r3[0] }
        }
    } catch {}

    # Reaction
    try {
        $nObj=0; $f1=$null; $f2=$null; $f3=$null; $m1=$null; $m2=$null; $m3=$null
        $ret = $SapModel.Results.JointReact($pn, 0, [ref]$nObj, [ref]$obj, [ref]$elm, [ref]$lc, [ref]$sCase, [ref]$sStep, [ref]$f1, [ref]$f2, [ref]$f3, [ref]$m1, [ref]$m2, [ref]$m3)
        if ($nObj -gt 0) {
            $reacs += [ordered]@{ name=$pn; x=$x; y=$y; z=$z; F1=$f1[0]; F2=$f2[0]; F3=$f3[0]; M1=$m1[0]; M2=$m2[0]; M3=$m3[0] }
        }
    } catch {}
}
$out.joint_displacements = $displ
$out.joint_reactions     = $reacs
Write-Output "[INFO] $($displ.Count) displacements, $($reacs.Count) reactions"

# 11b. Frame forces
$nFr=0; $frNames=$null
$ret = $SapModel.FrameObj.GetNameList([ref]$nFr, [ref]$frNames)
$frameForces = @()
foreach ($fn in $frNames) {
    $nObj=0; $obj=$null; $elm=$null; $stat=$null; $lc=$null; $sCase=$null; $sStep=0
    $P=$null; $V2=$null; $V3=$null; $T=$null; $M2=$null; $M3=$null
    try {
        $ret = $SapModel.Results.FrameForce($fn, 0, [ref]$nObj, [ref]$obj, [ref]$stat, [ref]$elm, [ref]$lc, [ref]$sCase, [ref]$sStep, [ref]$P, [ref]$V2, [ref]$V3, [ref]$T, [ref]$M2, [ref]$M3)
        if ($nObj -gt 0) {
            for ($k = 0; $k -lt $nObj; $k++) {
                $frameForces += [ordered]@{
                    frame=$fn; station=$stat[$k]; lc=$lc[$k]; P=$P[$k]; V2=$V2[$k]; V3=$V3[$k]; T=$T[$k]; M2=$M2[$k]; M3=$M3[$k]
                }
            }
        }
    } catch {}
}
$out.frame_forces = $frameForces
Write-Output "[INFO] $($frameForces.Count) frame force stations"

# === 12. Resumen ===
Write-Output ""
Write-Output "=== RESUMEN ETABS ($ShellType) ==="
$wMin = ($displ | Measure-Object -Property u3 -Minimum).Minimum
$wMinNode = ($displ | Where-Object { $_.u3 -eq $wMin }).name
$wMinCoord = ($displ | Where-Object { $_.u3 -eq $wMin })
Write-Output ("w_min = {0:N6} m = {1:N4} mm en nodo {2} ({3:N1},{4:N1})" -f $wMin, ($wMin*1000), $wMinNode, $wMinCoord.x, $wMinCoord.y)
$sumF3 = ($reacs | Measure-Object -Property F3 -Sum).Sum
Write-Output ("Sum Rz = {0:N3} kN" -f $sumF3)
$M3Max = ($frameForces | Measure-Object -Property M3 -Maximum).Maximum
$M3Min = ($frameForces | Measure-Object -Property M3 -Minimum).Minimum
Write-Output ("M3 max = {0:N3} kN*m, M3 min = {1:N3} kN*m" -f $M3Max, $M3Min)
$V2Max = ($frameForces | Measure-Object -Property V2 -Maximum).Maximum
Write-Output ("V2 max = {0:N3} kN" -f $V2Max)

# === 13. Guardar JSON ===
$json = $out | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($OutPath, $json, [System.Text.UTF8Encoding]::new($false))
Write-Output "[OK] JSON guardado: $OutPath"

# === 14. Cerrar ETABS ===
$ETABSObject.ApplicationExit($false) | Out-Null
Write-Output "[DONE]"
