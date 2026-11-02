"""
============================================================================
 diagnostic_full.py
 Diagnostico completo del setup CSI ETABS API:
   1. Lista versiones instaladas
   2. Verifica que ETABSv1.dll esté registrada COM
   3. Intenta CreateObject helper paso a paso
   4. QueryInterface
   5. Attach a instancia abierta
   6. Spawn new si falla attach
   7. ApplicationStart + esperar
   8. SapModel ready
   9. InitializeNewModel
  10. NewBlank
  11. Import .e2k de prueba
  12. Reporta entidades

 Todo se escribe a etabs-api/python/diagnostic.log Y a stdout.
============================================================================
"""
import os, sys, time, traceback, ctypes
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
LOG_PATH = os.path.join(HERE, "diagnostic.log")

# ── Logger ──────────────────────────────────────────────────────────────────
log_file = open(LOG_PATH, "w", encoding="utf-8", buffering=1)
def log(msg=""):
    line = f"[{datetime.now().strftime('%H:%M:%S.%f')[:-3]}] {msg}"
    print(line, flush=True)
    log_file.write(line + "\n")

def log_exc(label):
    log(f"  ✗ {label} → EXCEPCION:")
    for line in traceback.format_exc().splitlines():
        log("      " + line)

log("=" * 76)
log(f"  DIAGNOSTIC FULL — ETABS API setup check")
log(f"  Python: {sys.version.split()[0]}  | log → {LOG_PATH}")
log("=" * 76)

# ── 1) Versiones instaladas ─────────────────────────────────────────────────
log("\n[1] ETABS instalaciones encontradas:")
csi_root = r"C:\Program Files\Computers and Structures"
if os.path.isdir(csi_root):
    for entry in sorted(os.listdir(csi_root)):
        full = os.path.join(csi_root, entry)
        if os.path.isdir(full) and "ETABS" in entry.upper():
            dll = os.path.join(full, "ETABSv1.dll")
            exe = os.path.join(full, "ETABS.exe")
            log(f"    {entry}: DLL={'OK' if os.path.isfile(dll) else 'MISSING'}, EXE={'OK' if os.path.isfile(exe) else 'MISSING'}")
else:
    log(f"    ✗ {csi_root} no existe")

# ── 2) Procesos ETABS corriendo ─────────────────────────────────────────────
log("\n[2] Procesos ETABS corriendo:")
try:
    import subprocess
    out = subprocess.check_output("tasklist /FO CSV", shell=True, encoding="utf-8")
    for ln in out.splitlines():
        if "ETABS" in ln.upper():
            log(f"    {ln}")
except Exception:
    log_exc("tasklist")

# ── 3) Import comtypes ──────────────────────────────────────────────────────
log("\n[3] Import comtypes:")
try:
    import comtypes
    import comtypes.client as cc
    log(f"    ✓ comtypes {comtypes.__version__}")
except Exception:
    log_exc("import comtypes")
    sys.exit(2)

# ── 4) Crear helper ─────────────────────────────────────────────────────────
log("\n[4] CreateObject('ETABSv1.Helper'):")
helper = None
try:
    helper = cc.CreateObject("ETABSv1.Helper")
    log(f"    ✓ helper raw = {helper}")
except Exception:
    log_exc("CreateObject ETABSv1.Helper")
    sys.exit(3)

# ── 5) QueryInterface a cHelper ─────────────────────────────────────────────
log("\n[5] QueryInterface(cHelper):")
try:
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    log(f"    ✓ cHelper = {helper}")
except Exception:
    log_exc("QueryInterface cHelper")
    sys.exit(4)

# ── 6) Attach a instancia abierta ───────────────────────────────────────────
log("\n[6] Intentando enganchar a instancia abierta (helper.GetObject):")
ETABSObject = None
try:
    ETABSObject = helper.GetObject("CSI.ETABS.API.ETABSObject")
    log(f"    helper.GetObject() devolvió: {ETABSObject}")
except (OSError, comtypes.COMError) as e:
    log(f"    Excepcion: {e}")
except Exception:
    log_exc("GetObject")

attached = ETABSObject is not None
log(f"    Estado: {'ATTACHED' if attached else 'NULL — no hay instancia API-registrada'}")

# ── 7) Si no attach, intentar nueva ─────────────────────────────────────────
if not attached:
    log("\n[7] No attach → spawning nueva instancia API:")
    try:
        ETABSObject = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
        log(f"    CreateObjectProgID OK → {ETABSObject}")
    except Exception:
        log_exc("CreateObjectProgID")
        sys.exit(5)

    log("    ApplicationStart()...")
    try:
        ret = ETABSObject.ApplicationStart()
        log(f"    ApplicationStart devolvió: {ret}")
    except Exception:
        log_exc("ApplicationStart")
        sys.exit(6)

    log("    Esperando 8 s para que ETABS inicie GUI completo...")
    time.sleep(8)

# ── 8) Acceder a SapModel ───────────────────────────────────────────────────
log("\n[8] Accediendo a ETABSObject.SapModel:")
SapModel = None
for attempt in range(20):
    try:
        sm = ETABSObject.SapModel
        if sm is not None:
            # validación leve: GetModelIsLocked es read-only y devuelve bool/int
            try:
                locked = sm.GetModelIsLocked()
                SapModel = sm
                log(f"    ✓ SapModel listo en intento {attempt+1}, GetModelIsLocked={locked}")
                break
            except Exception as e2:
                log(f"    intento {attempt+1}: SapModel existe pero {type(e2).__name__}: {e2}")
        else:
            log(f"    intento {attempt+1}: SapModel = None")
    except Exception as e:
        log(f"    intento {attempt+1}: error {e}")
    time.sleep(1)

if SapModel is None:
    log("    ✗ SapModel NUNCA quedó utilizable. Abortando.")
    sys.exit(7)

# ── 9) Inicializar modelo en blanco ─────────────────────────────────────────
if not attached:
    log("\n[9] InitializeNewModel + NewBlank:")
    try:
        ret = SapModel.InitializeNewModel()
        log(f"    InitializeNewModel = {ret}")
    except Exception:
        log_exc("InitializeNewModel")
    try:
        ret = SapModel.File.NewBlank()
        log(f"    File.NewBlank      = {ret}")
    except Exception:
        log_exc("File.NewBlank")
else:
    log("\n[9] (saltado: ya hay modelo abierto en la instancia adjuntada)")

# ── 10) Importar .e2k de prueba ─────────────────────────────────────────────
DEFAULT_E2K = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Etabs\barra_axial\barra_axial.e2k"
pos_args = [a for a in sys.argv[1:] if not a.startswith("--")]
e2k_path = pos_args[0] if pos_args else DEFAULT_E2K

log(f"\n[10] Importando .e2k:")
log(f"    Archivo: {e2k_path}")
log(f"    Tamaño:  {os.path.getsize(e2k_path) if os.path.isfile(e2k_path) else 'NO EXISTE'}")
if os.path.isfile(e2k_path):
    try:
        t0 = time.perf_counter()
        ret = SapModel.File.OpenFile(e2k_path)
        dt = time.perf_counter() - t0
        log(f"    File.OpenFile() = {ret}  (en {dt:.2f} s)")
    except Exception:
        log_exc("File.OpenFile")

# ── 11) Inventario ──────────────────────────────────────────────────────────
log("\n[11] Inventario post-import:")
def safe_count(label, getter):
    try:
        res = getter()
        n = res[0]
        names = list(res[1]) if len(res) > 1 and res[1] else []
        log(f"    {label:20s}: {n}  → {names[:8]}{' …' if len(names) > 8 else ''}")
        return n
    except Exception as e:
        log(f"    {label:20s}: ERROR — {e}")
        return 0

nPts  = safe_count("Joints",         lambda: SapModel.PointObj.GetNameList(0, []))
nFrm  = safe_count("Frames",         lambda: SapModel.FrameObj.GetNameList(0, []))
nAr   = safe_count("Areas",          lambda: SapModel.AreaObj.GetNameList(0, []))
nMat  = safe_count("Materials",      lambda: SapModel.PropMaterial.GetNameList(0, []))
nSec  = safe_count("Frame sections", lambda: SapModel.PropFrame.GetNameList(0, []))
nLp   = safe_count("Load patterns",  lambda: SapModel.LoadPatterns.GetNameList(0, []))

# ── 12) Si hay joints, muestra primeros 3 ───────────────────────────────────
if nPts > 0:
    log("\n[12] Primeros 3 joints (X, Y, Z):")
    try:
        [_, names, _] = SapModel.PointObj.GetNameList(0, [])
        for p in list(names)[:3]:
            [X, Y, Z, _] = SapModel.PointObj.GetCoordCartesian(p, 0, 0, 0)
            log(f"    {p}: ({X:.3f}, {Y:.3f}, {Z:.3f})")
    except Exception:
        log_exc("Listing joints")

log("\n" + "=" * 76)
log(f"  RESUMEN: joints={nPts} frames={nFrm} areas={nAr} loadpat={nLp}")
log(f"  Log completo: {LOG_PATH}")
log("=" * 76)
log_file.close()

# ETABS queda abierta para inspección manual
sys.exit(0 if nPts > 0 else 99)
