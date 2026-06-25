"""
============================================================================
 attach_and_validate_hekatan_e2k.py
 ----------------------------------------------------------------------------
 Adjunta a una instancia de ETABS YA ABIERTA (no inicia una nueva), importa
 un archivo .e2k generado por hekatan-struct y verifica que se haya cargado
 correctamente. Reporta:
   - número de joints / frames / areas importados
   - existencia de los load patterns
   - opcionalmente corre un análisis lineal y extrae el desplazamiento máximo

 Uso:
   python attach_and_validate_hekatan_e2k.py <ruta\\al\\archivo.e2k>

 Si no se pasa argumento, usa por default:
   hekatan-struct/validacion/Etabs/barra_axial/barra_axial.e2k
============================================================================
"""
import os
import sys
import time
import comtypes
import comtypes.client as cc

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DEFAULT_E2K = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Etabs\barra_axial\barra_axial.e2k"

# ── 1) Adjuntar a instancia ETABS abierta ──────────────────────────────────
print("=" * 72)
print("  HEKATAN e2k → ETABS API validation (attach to running instance)")
print("=" * 72)

pos_args = [a for a in sys.argv[1:] if not a.startswith("--")]
e2k_path = pos_args[0] if pos_args else DEFAULT_E2K
if not os.path.isfile(e2k_path):
    print(f"  ERROR: no existe el archivo {e2k_path}")
    sys.exit(2)
print(f"  Archivo e2k: {e2k_path}")
print(f"  Tamaño: {os.path.getsize(e2k_path)} bytes")

helper = cc.CreateObject("ETABSv1.Helper")
helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)

ETABSObject = None

# Intento 1: enganchar a una instancia API-registrada (sólo funciona si ETABS
# fue lanzada desde la API, NO desde el GUI).
print("\n  Intentando enganchar a instancia ETABS API-registrada...")
try:
    ETABSObject = helper.GetObject("CSI.ETABS.API.ETABSObject")
    if ETABSObject is not None:
        print("  ✓ Adjuntado a instancia API existente")
except (OSError, comtypes.COMError) as exc:
    print(f"  (no se encontró: {exc})")

# Fallback: spawn nueva instancia API-gestionada
spawned_new = False
if ETABSObject is None:
    print("  → No hay instancia ETABS expuesta vía API (ROT vacío).")
    print("  → Spawneando una segunda instancia ETABS API-managed (tu GUI queda intacta).")
    try:
        ETABSObject = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
        ETABSObject.ApplicationStart()
        spawned_new = True
        print("  ✓ Nueva instancia ETABS arrancada vía API")
    except (OSError, comtypes.COMError) as exc:
        print(f"  ERROR — no se pudo arrancar ETABS por API: {exc}")
        sys.exit(3)

# Esperar a que SapModel esté disponible (ETABS toma 5-15 s en arrancar)
SapModel = None
for attempt in range(30):
    try:
        sm = ETABSObject.SapModel
        if sm is not None:
            SapModel = sm
            break
    except Exception:
        pass
    time.sleep(0.5)
if SapModel is None:
    print("  ERROR — ETABSObject.SapModel no inicializó tras 15 s")
    sys.exit(4)
print(f"  ✓ SapModel listo (intento {attempt+1})")

if spawned_new:
    SapModel.InitializeNewModel()
    SapModel.File.NewBlank()

# Reporte de versión
try:
    [ver, lic, _] = SapModel.GetVersion("", "", 0)
    print(f"  ETABS version reportada por API: {ver}")
except Exception as e:
    print(f"  (no se pudo obtener version: {e})")

# ── 2) Importar el .e2k ────────────────────────────────────────────────────
print(f"\n  Importando: {os.path.basename(e2k_path)}")
t0 = time.perf_counter()
try:
    # File.OpenFile maneja .edb y .e2k indistintamente (CSI docs)
    ret = SapModel.File.OpenFile(e2k_path)
    dt = time.perf_counter() - t0
    if ret == 0:
        print(f"  ✓ OpenFile() devolvió 0  (importación OK en {dt:.2f} s)")
    else:
        print(f"  ⚠ OpenFile() devolvió código {ret}  (en {dt:.2f} s)")
except Exception as e:
    print(f"  ERROR durante OpenFile: {e}")
    sys.exit(4)

# ── 3) Contar entidades importadas ─────────────────────────────────────────
print("\n  ────── Inventario post-import ──────")

try:
    [nPts, ptNames, _] = SapModel.PointObj.GetNameList(0, [])
    print(f"  Joints (Points)    : {nPts}")
except Exception as e:
    nPts, ptNames = 0, []
    print(f"  ERROR contando joints: {e}")

try:
    [nFrm, frmNames, _] = SapModel.FrameObj.GetNameList(0, [])
    print(f"  Frames             : {nFrm}")
except Exception as e:
    nFrm = 0
    print(f"  ERROR contando frames: {e}")

try:
    [nAr, arNames, _] = SapModel.AreaObj.GetNameList(0, [])
    print(f"  Areas              : {nAr}")
except Exception as e:
    nAr = 0
    print(f"  ERROR contando areas: {e}")

try:
    [nLp, lpNames, _] = SapModel.LoadPatterns.GetNameList(0, [])
    print(f"  Load Patterns      : {nLp}  → {list(lpNames) if nLp else '(ninguno)'}")
except Exception as e:
    nLp = 0
    print(f"  ERROR contando load patterns: {e}")

try:
    [nMat, matNames, _] = SapModel.PropMaterial.GetNameList(0, [])
    print(f"  Materials          : {nMat}")
except Exception as e:
    nMat = 0
    print(f"  ERROR contando materials: {e}")

try:
    [nSec, secNames, _] = SapModel.PropFrame.GetNameList(0, [])
    print(f"  Frame sections     : {nSec}")
except Exception as e:
    nSec = 0
    print(f"  ERROR contando frame sections: {e}")

# ── 4) Listar primeros 5 puntos con coordenadas y soportes ─────────────────
print("\n  ────── Primeros 5 joints (X, Y, Z + restraints) ──────")
for p in list(ptNames)[:5]:
    try:
        [X, Y, Z, _] = SapModel.PointObj.GetCoordCartesian(p, 0, 0, 0)
        [val, _] = SapModel.PointObj.GetRestraint(p, [False]*6)
        restraints = "".join("1" if v else "0" for v in val)
        print(f"    {p:>5}: ({X:7.3f}, {Y:7.3f}, {Z:7.3f})  restraints={restraints}")
    except Exception as e:
        print(f"    {p}: error -> {e}")

# ── 5) Listar primeros 5 frames con sus joints ─────────────────────────────
print("\n  ────── Primeros 5 frames (i, j, sección) ──────")
for f in list(frmNames)[:5]:
    try:
        [pI, pJ, _] = SapModel.FrameObj.GetPoints(f, "", "")
        [secName, _, _] = SapModel.FrameObj.GetSection(f, "", "")
        print(f"    {f:>5}: i={pI}  j={pJ}  section={secName}")
    except Exception as e:
        print(f"    {f}: error -> {e}")

# ── 6) Análisis lineal opcional ────────────────────────────────────────────
RUN_ANALYSIS = "--no-analysis" not in sys.argv
if RUN_ANALYSIS and nPts > 0:
    print("\n  ────── Análisis lineal estático ──────")
    try:
        SapModel.SetPresentUnits(6)  # N, m, C (no afecta el modelo, sólo output)
        # CRÍTICO: ETABS NO crea los archivos de análisis si el modelo no está
        # guardado en disco → RunAnalysis devuelve 1 (error) y los desplazamientos
        # salen 0. Guardamos a un .edb temporal antes de analizar.
        import tempfile
        save_path = os.path.join(tempfile.gettempdir(),
                                 "hekatan_e2k_" + os.path.splitext(os.path.basename(e2k_path))[0] + ".edb")
        sret = SapModel.File.Save(save_path)
        print(f"  File.Save('{save_path}') -> {sret}")
        SapModel.Analyze.SetRunCaseFlag("", True, True)
        print("  Ejecutando RunAnalysis()...")
        t0 = time.perf_counter()
        ret = SapModel.Analyze.RunAnalysis()
        dt = time.perf_counter() - t0
        print(f"    RunAnalysis devolvió {ret} en {dt:.2f} s")

        # buscar el load pattern principal (DEAD o el primero)
        case_to_use = None
        try:
            [n_cases, case_names, _] = SapModel.LoadCases.GetNameList(0, [])
            print(f"    Load cases disponibles: {list(case_names)}")
            if "DEAD" in case_names:
                case_to_use = "DEAD"
            elif case_names:
                case_to_use = case_names[0]
        except Exception as e:
            print(f"    error listando cases: {e}")

        if case_to_use:
            SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
            SapModel.Results.Setup.SetCaseSelectedForOutput(case_to_use)

            ux_max = uz_max = 0.0
            for p in ptNames:
                try:
                    NumRes = 0
                    args = [NumRes] + [[] for _ in range(11)]
                    res = SapModel.Results.JointDispl(p, 0, *args)
                    if res and res[0] > 0:
                        U1 = res[6][0]; U3 = res[8][0]
                        if abs(U1) > abs(ux_max): ux_max = U1
                        if abs(U3) > abs(uz_max): uz_max = U3
                except Exception:
                    pass
            print(f"    Caso '{case_to_use}':  |U1|_max = {ux_max:.6e} m,  |U3|_max = {uz_max:.6e} m")
    except Exception as e:
        print(f"  ERROR en análisis: {e}")
else:
    print("\n  (análisis omitido)")

# ── 7) Veredicto ───────────────────────────────────────────────────────────
print("\n  ────── Veredicto ──────")
ok = True
if nPts == 0:
    print("  ✗ Sin joints — el .e2k NO se importó como modelo válido.")
    ok = False
else:
    print(f"  ✓ Importación produjo modelo con {nPts} joints, {nFrm} frames, {nAr} areas.")
if nLp == 0:
    print("  ⚠ No hay Load Patterns — no se podrá correr análisis.")
elif "DEAD" not in (lpNames or []):
    print("  ⚠ Load Pattern DEAD no presente.")
else:
    print("  ✓ Load Pattern DEAD presente.")

print("\n  NOTA: no se cerró ETABS — la instancia queda abierta para inspección manual.")
print("=" * 72)
sys.exit(0 if ok else 1)
