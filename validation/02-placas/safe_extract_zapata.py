# -*- coding: utf-8 -*-
"""SAFE extraction via Python OAPI: abre Zapata_Hekatan F2K, corre, exporta JSON."""
import comtypes.client, json, time, os, sys

f2k_path = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser("~") + r"\Downloads\Zapata_Hekatan_1777645102733.f2k"
out_path = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "zapata_safe_results.json")

print("=" * 70)
print(f" SAFE Python OAPI — abre f2k y corre")
print(f" F2K: {f2k_path}")
print("=" * 70)

helper = comtypes.client.CreateObject("SAFEv1.Helper")
helper = helper.QueryInterface(comtypes.gen.SAFEv1.cHelper)
sap = helper.CreateObjectProgID("CSI.SAFE.API.ETABSObject")
sap.ApplicationStart()
time.sleep(4)
m = sap.SapModel
m.SetPresentUnits(6)  # 6 = kN, m, C

print("\n>>> Abriendo F2K...")
ret = m.File.OpenFile(f2k_path)
print(f"    OpenFile ret={ret}")

m.SetPresentUnits(6)

# Verify model exists post-import
n_pts = m.PointObj.Count()
n_areas = m.AreaObj.Count()
print(f"    Post-OpenFile: {n_pts} joints, {n_areas} areas")

# Save first as .FDB
sdb_path = os.path.join(os.environ["TEMP"], "zapata_hek_safe.FDB")
ret = m.File.Save(sdb_path)
print(f"    Save FDB ret={ret} -> {sdb_path}")

n_pts2 = m.PointObj.Count()
n_areas2 = m.AreaObj.Count()
print(f"    Post-Save: {n_pts2} joints, {n_areas2} areas")

# Asegurar que los cases estan marcados para correr (a veces los heredados
# del .f2k tienen RunCase=No y RunAnalysis los salta).
try:
    nLC = 0; lcNames = None
    res = m.LoadCases.GetNameList()
    nLC = res[0]; lcNames = list(res[1]) if res[1] else []
    print(f"    Load cases: {lcNames}")
    for lc in lcNames:
        m.Analyze.SetRunCaseFlag(lc, True)
        print(f"      SetRunCaseFlag({lc}) = True")
except Exception as e:
    print(f"    (SetRunCaseFlag warning: {e})")

print("\n>>> Run analysis...")
t0 = time.time()
ret = m.Analyze.RunAnalysis()
print(f"    RunAnalysis ret={ret} en {time.time()-t0:.1f}s")

# Setup output
m.Results.Setup.DeselectAllCasesAndCombosForOutput()
m.Results.Setup.SetCaseSelectedForOutput("Dead")

# Joint displacements
res = m.Results.JointDispl("All", 2)
N = res[0]
joints, U1, U2, U3 = res[1], res[7], res[8], res[9]
max_uz = 0.0
max_node = ""
for k in range(N):
    if abs(U3[k]) > abs(max_uz):
        max_uz = U3[k]
        max_node = joints[k]

print(f"\n>>> Joint displacements: {N}")
print(f"   max |Uz| = {abs(max_uz)*1000:.4f} mm @ joint {max_node}")

# Joint reactions (winkler springs reactions)
res = m.Results.JointReact("All", 2)
N = res[0]
joints, F1, F2, F3 = res[1], res[7], res[8], res[9]
max_fz = 0.0
sum_fz = 0.0
for k in range(N):
    sum_fz += F3[k]
    if abs(F3[k]) > abs(max_fz):
        max_fz = F3[k]

print(f"\n>>> Joint reactions: {N}")
print(f"   max |Fz| = {abs(max_fz):.4f} kN")
print(f"   sumFz    = {sum_fz:.4f} kN  (esperado ~ +20 tonf = +196 kN)")

# Area force shell
try:
    res = m.Results.AreaForceShell("All", 2)
    N_a = res[0]
    M11 = res[14]; M22 = res[15]
    max_M11, max_M22 = 0.0, 0.0
    for k in range(N_a):
        if abs(M11[k]) > abs(max_M11): max_M11 = M11[k]
        if abs(M22[k]) > abs(max_M22): max_M22 = M22[k]
    print(f"\n>>> Area Force Shell: {N_a}")
    print(f"   max |M11| = {abs(max_M11):.4f} kN.m/m")
    print(f"   max |M22| = {abs(max_M22):.4f} kN.m/m")
except Exception as e:
    print(f"   AreaForceShell: {e}")
    max_M11 = max_M22 = 0

# Soil pressure (Winkler)
try:
    res = m.Results.AreaSoilPressure("All", 2)
    N_p = res[0]
    pressure = res[7] if N_p > 0 else []
    max_p = 0.0
    if pressure:
        for v in pressure:
            if abs(v) > abs(max_p): max_p = v
    print(f"\n>>> Soil Pressure: {N_p}")
    print(f"   max |q| = {abs(max_p):.4f} kN/m²  ({abs(max_p)/9.80665:.4f} tonf/m²)")
except Exception as e:
    print(f"   AreaSoilPressure: {e}")
    max_p = 0

out = {
    "model": f2k_path,
    "n_joints": int(N),
    "max_uz_m": max_uz,
    "max_uz_mm": abs(max_uz)*1000,
    "max_node": max_node,
    "max_fz_kN": max_fz,
    "sum_fz_kN": sum_fz,
    "max_M11_kNm_m": max_M11,
    "max_M22_kNm_m": max_M22,
    "max_pressure_kN_m2": max_p,
    "max_pressure_tonf_m2": abs(max_p)/9.80665,
}
with open(out_path, "w") as f:
    json.dump(out, f, indent=2)
print(f"\nJSON: {out_path}")
