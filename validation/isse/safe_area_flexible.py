"""
SAFE API — Zapata Aislada (construida desde cero via API).

Replica el caso Hekatan cli_zapata.mjs:
  Zapata 1.5x1.5x0.30 m, P=20 tonf (=196.13 kN) en centro,
  springs Winkler ks=19613 kN/m3, malla auto SAFE, E=24855 MPa.

Uso:
  python safe_api_zapata.py [--json=out.json] [--keep-open]
"""

import os, sys, json, time
from pathlib import Path

import clr  # type: ignore
clr.AddReference(r"C:\Program Files\Computers and Structures\SAFE 20\SAFEv1.dll")
from SAFEv1 import (  # type: ignore
    cHelper, Helper, cOAPI, cSapModel, cFile, cAnalyze, cDatabaseTables,
    cPropMaterial, cPropArea, cPropAreaSpring, cPointObj, cAreaObj, cLoadPatterns,
    eForce, eLength, eTemperature, eMatType, eSlabType, eShellType, eItemType,
    eLoadPatternType,
)
from System import Array, Double  # type: ignore

# ── Args ─────────────────────────────────────────────────────────────
args = sys.argv[1:]
json_out = next((a.split("=", 1)[1] for a in args if a.startswith("--json=")), None)
keep_open = "--keep-open" in args

HERE = Path(__file__).resolve().parent
SAVE_PATH = str(HERE / "placa_flexible_area_spring.fdb")

# Parámetros (paridad con cli_zapata.mjs)
P = {
    "Lz": 4.00, "Bz": 4.00, "tz": 0.20,
    "E_kNm2": 25e6, "nu": 0.20, "rho_kNm3": 0.0,
    "ks_kNm3": 20000.0,
    "P_kN": 1000.0,
    "nx": 8, "ny": 8,         # mesh explícito 12x12 (paridad Hekatan)
}
# CALIBRATION TEST: SAFE consistente vs Hekatan lumped → factor empírico
# observado 1.384. Si dividimos ks input por este factor, ¿matchea teoría?
KS_CALIBRATION = 1.384
ks_input_calibrated = P["ks_kNm3"] / KS_CALIBRATION
print(f"# CALIBRATION: ks_input pasado a SAFE = {ks_input_calibrated:.1f} (= {P['ks_kNm3']}/{KS_CALIBRATION})")

# ── Lanzar SAFE ──────────────────────────────────────────────────────
print("-> Lanzando SAFE 20...")
helper = cHelper(Helper())
safe_obj = cOAPI(helper.CreateObjectProgID("CSI.SAFE.API.ETABSObject"))
safe_obj.ApplicationStart()
sap = cSapModel(safe_obj.SapModel)
sap.InitializeNewModel()

file_api = cFile(sap.File)
ret = file_api.NewBlank()
print(f"   NewBlank ret={ret}")

ret = sap.SetPresentUnits_2(eForce.kN, eLength.m, eTemperature.C)
print(f"   SetUnits kN/m/C ret={ret}")

# ── 1. Material concreto ─────────────────────────────────────────────
mat = cPropMaterial(sap.PropMaterial)
mat_name = "Conc25"
# SetMaterial(Name, eMatType, Color, Notes, GUID)
ret = mat.SetMaterial(mat_name, eMatType.Concrete, -1, "", "")
print(f"-> SetMaterial({mat_name}) ret={ret}")

# SetMPIsotropic(Name, E, U, A, Temp)
ret = mat.SetMPIsotropic(mat_name, P["E_kNm2"], P["nu"], 1.0e-5, 0.0)
print(f"   SetMPIsotropic E={P['E_kNm2']/1e3} MPa ret={ret}")

# SetWeightAndMass(Name, MyOption, Value, Temp) — MyOption=1 weight per volume
ret = mat.SetWeightAndMass(mat_name, 1, P["rho_kNm3"], 0.0)
print(f"   SetWeightAndMass {P['rho_kNm3']} kN/m3 ret={ret}")

# ── 2. Slab property "Footing" ───────────────────────────────────────
parea = cPropArea(sap.PropArea)
slab_name = "Footing"
# SetSlab(Name, eSlabType, eShellType, MatProp, Thickness, color, notes, GUID)
# ShellThick = Mindlin/Reissner (CON deformación por corte transversal) =
# matchea Hekatan plateQ4Solve(theoryType:0). ShellThin = Kirchhoff (sin
# corte) — subestima asentamiento en placas gruesas (t/L > 0.1), confirmado
# en CSI Reference Manual líneas 8644-8645 y 9117-9120.
# eSlabType.Mat (= Mat foundation) vs .Footing — testing slab type effect.
# .Footing aparentemente "pierde" ~28% de la carga (no conserva equilibrio
# con Winkler). .Mat es el tipo standard para foundation slabs.
ret = parea.SetSlab(slab_name, eSlabType.Mat, eShellType.ShellThick,
                     mat_name, P["tz"], -1, "", "")
print(f"-> SetSlab({slab_name}) Mat/ShellThick(Mindlin) t={P['tz']} ret={ret}")

# ── 3. Area spring "AS_Winkler" ──────────────────────────────────────
psp = cPropAreaSpring(sap.PropAreaSpring)
spring_name = "AS_Winkler"
# SetAreaSpringProp(Name, U1, U2, U3, NonlinearOption3, SpringOption,
#                   SoilProfile, EndLengthRatio, Period, color, notes, GUID)
# NonlinearOption3: 0=Linear, 1=CompOnly, 2=TensionOnly
# SpringOption: 0=Simple, 1=Link
# SetAreaSpringProp controla U1/U2/U3 stiffness, NO el campo "Subgrade
# Modulus" que SAFE realmente usa (los U1/U2/U3 quedan ignorados y SAFE
# aplica un default ks=100 lb/in³=27145 kN/m³). Hay que crear el spring
# property primero (cualquier valor) y después EDITAR via DatabaseTables
# el campo "Subgrade Modulus" directamente, igual que el ejemplo CHM.
ret = psp.SetAreaSpringProp(spring_name, 0.0, 0.0, P["ks_kNm3"],
                             0, 0, "", 1.0, 1.0, -1, "", "")
print(f"-> SetAreaSpringProp({spring_name}) U3={P['ks_kNm3']} (placeholder, será sobreescrito) ret={ret}")

# ── 4. Load Pattern "P_Test" ─────────────────────────────────────────
lpat = cLoadPatterns(sap.LoadPatterns)
ret = lpat.Add("P_Test", eLoadPatternType.Other, 0.0, True)
print(f"-> LoadPatterns.Add(P_Test, Other) ret={ret}")

# ── 5. Grid Q4 explícito: nx*ny áreas para matchear mesh Hekatan ─────
# En lugar de 1 área auto-mesheada, crear (nx)x(ny) áreas Q4 individuales
# compartiendo joints en las uniones. SAFE merges joints duplicados en
# la misma coordenada por default.
ao = cAreaObj(sap.AreaObj)
nx, ny = P["nx"], P["ny"]
dx, dy = P["Lz"] / nx, P["Bz"] / ny
area_names = []
print(f"-> Creando {nx*ny} áreas Q4 (mesh {nx}x{ny}) ...")
for j in range(ny):
    for i in range(nx):
        x0, x1 = i * dx, (i + 1) * dx
        y0, y1 = j * dy, (j + 1) * dy
        xs = Array[Double]([x0, x1, x1, x0])
        ys = Array[Double]([y0, y0, y1, y1])
        zs = Array[Double]([0.0, 0.0, 0.0, 0.0])
        ret, _xs, _ys, _zs, aname = ao.AddByCoord(
            4, xs, ys, zs, "", slab_name, f"Q_{i:02d}_{j:02d}", "Global")
        if ret != 0:
            print(f"   AddByCoord cell ({i},{j}) ret={ret}")
        area_names.append(aname)
print(f"   Created {len(area_names)} areas, first={area_names[0]}, last={area_names[-1]}")

# Asignar spring Winkler a TODAS las áreas
print(f"-> SetSpringAssignment a las {len(area_names)} áreas ...")
spring_assigned = 0
for aname in area_names:
    ret = ao.SetSpringAssignment(aname, spring_name, eItemType.Objects)
    if ret == 0: spring_assigned += 1
print(f"   {spring_assigned}/{len(area_names)} áreas con spring asignado")

# ── 6. Carga puntual P en joint central (modo zapata aislada) ────────
po = cPointObj(sap.PointObj)
xc, yc, zc = P["Lz"]/2, P["Bz"]/2, 0.0
ret_tuple = po.AddCartesian(xc, yc, zc, "", "PCenter", "Global", False, 0)
ret, center_pt = ret_tuple
print(f"-> AddCartesian ({xc},{yc},0) ret={ret} name={center_pt}")

load_vec = Array[Double]([0.0, 0.0, -P["P_kN"], 0.0, 0.0, 0.0])
ret_tuple = po.SetLoadForce(center_pt, "P_Test", load_vec, True, "Global", eItemType.Objects)
ret = ret_tuple if isinstance(ret_tuple, int) else ret_tuple[0]
print(f"   SetLoadForce P={-P['P_kN']:.2f} kN ret={ret}")

# ── 7. Save & Run ────────────────────────────────────────────────────
print(f"-> Save: {SAVE_PATH}")
os.makedirs(os.path.dirname(SAVE_PATH), exist_ok=True)
ret = file_api.Save(SAVE_PATH)
print(f"   Save ret={ret}")

# ── 7b. FORZAR Subgrade Modulus via DatabaseTables ───────────────────
# SetAreaSpringProp dejó U3=27145 default. Editamos la tabla
# "SPRING PROPERTY DEFINITIONS - AREA SPRINGS" directamente con el campo
# "Subgrade Modulus" = ks_kNm3 (mismo patrón del ejemplo CHM).
db_pre = cDatabaseTables(sap.DatabaseTables)
spring_table = "Spring Property Definitions - Area Springs"
fk = []; group = ""; ver = 0; fi = []; n = 0; td = []
ret, ver, fi, n, td = db_pre.GetTableForEditingArray(spring_table, group, ver, fi, n, td)
fi = list(fi); td = list(td)
print(f"-> Editing table '{spring_table}': rows={n} cols={len(fi)} headers={fi}")
if n > 0 and td:
    sm_col = -1
    for i, h in enumerate(fi):
        if "subgrade" in h.lower() or "modulus" in h.lower():
            sm_col = i; break
    print(f"   Subgrade column index: {sm_col} ({fi[sm_col] if sm_col >= 0 else 'NOT FOUND'})")
    if sm_col >= 0:
        td[sm_col] = str(P["ks_kNm3"])    # 19613.0 kN/m³
        print(f"   Setting row[{sm_col}] = {td[sm_col]}")
        ret = db_pre.SetTableForEditingArray(spring_table, ver, fi, n, td)
        print(f"   SetTableForEditingArray ret={ret}")
        nfe = nem = nwm = nim = 0; ilog = ""
        ret, nfe, nem, nwm, nim, ilog = db_pre.ApplyEditedTables(True, nfe, nem, nwm, nim, ilog)
        print(f"   ApplyEditedTables ret={ret}  errors={nfe} warnings={nwm}")

print("-> RunAnalysis...")
analyze = cAnalyze(sap.Analyze)
t0 = time.time()
ret = analyze.RunAnalysis()
runtime_s = time.time() - t0
print(f"   RunAnalysis ret={ret} ({runtime_s:.2f}s)")

# ── 8. Extraer tablas ────────────────────────────────────────────────
db = cDatabaseTables(sap.DatabaseTables)

def get_table(name):
    fk = []; group = ""; ver = 0; fi = []; n = 0; td = []
    ret, group, ver, fi, n, td = db.GetTableForDisplayArray(name, fk, group, ver, fi, n, td)
    if n == 0 or not td: return [], []
    # .NET arrays don't support Python slicing — convert to list first
    td = list(td)
    fi = list(fi)
    cols = len(fi)
    rows = [td[i*cols:(i+1)*cols] for i in range(n)]
    return fi, rows

def col(headers, *names):
    for nm in names:
        for i, h in enumerate(headers):
            if h.lower() == nm.lower(): return i
    return -1

def maxabs(rows, c):
    if c < 0: return 0.0
    vals = []
    for r in rows:
        try: vals.append(float(r[c]))
        except: pass
    return max(vals, key=abs) if vals else 0.0

print("-> Joint Displacements...")
jh, jr = get_table("Joint Displacements")
print(f"   rows={len(jr)} headers[:6]={jh[:6]}")
uz_c = col(jh, "U3","Uz","UZ")
joint_c = col(jh, "UniqueName","Joint","Point","Label")
w_max = maxabs(jr, uz_c)
w_max_joint = None
if uz_c >= 0:
    for r in jr:
        try:
            if abs(float(r[uz_c])) == abs(w_max):
                w_max_joint = r[joint_c] if joint_c >= 0 else None
                break
        except: pass

# ── 9 puntos clave: extraer Uz por coordenadas via cPointObj.GetCoordCartesian
# Para cada joint en JD, buscar sus coords (X, Y) y matchear con los 9 targets.
print("-> Sampling 9 key points (corners, mid-edges, center)...")
sample_targets = [
    ("esquina (0,0)",         0.0,         0.0),
    ("esquina (Lz,0)",        P["Lz"],     0.0),
    ("esquina (0,Bz)",        0.0,         P["Bz"]),
    ("esquina (Lz,Bz)",       P["Lz"],     P["Bz"]),
    ("medio-borde (Lz/2,0)",  P["Lz"]/2,   0.0),
    ("medio-borde (Lz,Bz/2)", P["Lz"],     P["Bz"]/2),
    ("medio-borde (Lz/2,Bz)", P["Lz"]/2,   P["Bz"]),
    ("medio-borde (0,Bz/2)",  0.0,         P["Bz"]/2),
    ("centro (Lz/2,Bz/2)",    P["Lz"]/2,   P["Bz"]/2),
]
samples_9pts = []
po2 = cPointObj(sap.PointObj)
# Construir tabla joint → (x, y, Uz)
joint_info = {}
for r in jr:
    try:
        jname = str(r[joint_c]) if joint_c >= 0 else None
        if jname and jname not in joint_info:
            # Get coords for this joint
            ret_t = po2.GetCoordCartesian(jname, 0.0, 0.0, 0.0, "Global")
            ret, jx, jy, jz = ret_t
            if ret == 0:
                joint_info[jname] = {"x": jx, "y": jy, "Uz_list": []}
        if jname in joint_info:
            try:
                joint_info[jname]["Uz_list"].append(float(r[uz_c]))
            except: pass
    except: pass

for label, xt, yt in sample_targets:
    best = None
    best_d = float("inf")
    for jname, info in joint_info.items():
        d2 = (info["x"]-xt)**2 + (info["y"]-yt)**2
        if d2 < best_d:
            best_d, best = d2, (jname, info)
    if best:
        jname, info = best
        uz = max(info["Uz_list"], key=abs) if info["Uz_list"] else 0.0
        samples_9pts.append({
            "label": label,
            "joint": jname,
            "x": info["x"],
            "y": info["y"],
            "w_mm": round(uz * 1000, 4),
            "q_kNm2": round(P["ks_kNm3"] * abs(uz), 2),
        })

print("-> Element Forces - Areas...")
for tname in ["Element Forces - Areas", "Area Forces", "Slab Forces - Slabs"]:
    af_h, af_r = get_table(tname)
    if af_r:
        print(f"   table={tname} rows={len(af_r)}")
        break
else:
    af_h, af_r = [], []

Mxx = maxabs(af_r, col(af_h, "M11","MXX","Mxx"))
Myy = maxabs(af_r, col(af_h, "M22","MYY","Myy"))
Mxy = maxabs(af_r, col(af_h, "M12","MXY","Mxy"))
Qx  = maxabs(af_r, col(af_h, "V13","VX","Vx","Qx"))
Qy  = maxabs(af_r, col(af_h, "V23","VY","Vy","Qy"))

sp_h, sp_r = get_table("Soil Pressures")
print(f"   Soil Pressures table: {len(sp_r)} rows, headers={sp_h}")
if sp_r:
    print(f"   First 3 rows: {sp_r[:3]}")
q_max_safe = maxabs(sp_r, col(sp_h, "Pressure","P","SoilPress","q"))
q_max_calc = P["ks_kNm3"] * abs(w_max)

out = {
    "solver": "SAFE 20 via API (construido desde cero)",
    "saved_at": SAVE_PATH,
    "params": P,
    "results": {
        "w_max_m": w_max,
        "w_max_joint": str(w_max_joint) if w_max_joint else None,
        "Mxx_max_kNm_per_m": Mxx,
        "Myy_max_kNm_per_m": Myy,
        "Mxy_max_kNm_per_m": Mxy,
        "Qx_max_kN_per_m": Qx,
        "Qy_max_kN_per_m": Qy,
        "q_max_from_safe_table": q_max_safe if q_max_safe else None,
        "q_max_calc_ks_w": q_max_calc,
        "runtime_s": round(runtime_s, 2),
        "samples_9pts": samples_9pts,
    },
    "tables_found": {
        "joint_displacements_rows": len(jr),
        "area_forces_rows": len(af_r),
        "soil_pressures_rows": len(sp_r),
    },
}
if json_out:
    Path(json_out).write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"-> JSON: {json_out}")

print("\n" + "="*50)
print(f"  SAFE API - Zapata 1.5x1.5x0.30m, P={P['P_kN']:.1f} kN")
print("="*50)
print(f"  w_max:     {w_max*1000:.4f} mm  (joint {w_max_joint})")
print(f"  q_max:     {q_max_calc:.2f} kN/m2 (ks*|w|) | SAFE table: {q_max_safe or 'n/a'}")
print(f"  Mxx_max:   {Mxx:.3f} kN.m/m")
print(f"  Myy_max:   {Myy:.3f} kN.m/m")
print(f"  Mxy_max:   {Mxy:.3f} kN.m/m")
print(f"  Qx_max:    {Qx:.3f} kN/m")
print(f"  Qy_max:    {Qy:.3f} kN/m")
print(f"  Runtime:   {runtime_s:.2f}s")
print("-"*50)
print("  9 puntos clave (w mm, q = ks*|w| kN/m2):")
print("  " + "label".ljust(28) + "w_mm".rjust(10) + "q_kNm2".rjust(12))
for s in samples_9pts:
    print(f"  {s['label']:<28}{s['w_mm']:>10.4f}{s['q_kNm2']:>12.2f}")
print("="*50)

if not keep_open:
    print("-> Cerrando SAFE...")
    safe_obj.ApplicationExit(False)
