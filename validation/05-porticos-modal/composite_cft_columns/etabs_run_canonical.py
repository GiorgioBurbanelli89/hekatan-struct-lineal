# -*- coding: utf-8 -*-
"""ETABS API: corre los 3 casos canonicos."""
import os, time, json
import comtypes.client

E2K_DIR = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_canonical"
OUTPUT_JSON = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_canonical_results.json"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
CASES = ["cantileverColumn", "clampedClampedBeam", "cantileverBeam"]

def connect():
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = None
    try:
        obj = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if obj is None: raise RuntimeError("None")
        print("[OK] Conectado", flush=True)
    except Exception:
        try:
            obj = helper.CreateObject(ETABS_EXE)
            obj.ApplicationStart(); time.sleep(5)
        except Exception:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart(); time.sleep(5)
        print("[OK] Lanzado ETABS", flush=True)
    return obj.SapModel

def process(SapModel, case_id):
    e2k = os.path.join(E2K_DIR, f"case_{case_id}.e2k")
    edb = os.path.join(E2K_DIR, f"case_{case_id}.EDB")
    print(f"\n=== {case_id} ===", flush=True)
    SapModel.SetPresentUnits(6)
    SapModel.File.OpenFile(e2k); SapModel.SetPresentUnits(6); SapModel.SetModelIsLocked(False)
    SapModel.File.Save(edb)
    SapModel.File.OpenFile(edb); SapModel.SetPresentUnits(6); SapModel.SetModelIsLocked(False)
    SapModel.Analyze.RunAnalysis()
    print(f"  [..] Analysis done", flush=True)

    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Live")

    NumberNames = 0; MyName = []
    nl = SapModel.PointObj.GetNameList(NumberNames, MyName)
    joints = list(nl[1])
    print(f"  Joints: {joints}", flush=True)

    out = {}
    for j in joints:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            U1=[]; U2=[]; U3=[]; R1=[]; R2=[]; R3=[]
            rl = SapModel.Results.JointDispl(j, 0, NR, Obj, Elm, ACase, ST, SN, U1, U2, U3, R1, R2, R3)
            if rl[0] > 0:
                out[j] = {"U1": rl[6][0], "U2": rl[7][0], "U3": rl[8][0],
                          "R1": rl[9][0], "R2": rl[10][0], "R3": rl[11][0]}
        except Exception:
            pass
    for j, v in out.items():
        print(f"  joint {j}: Ux={v['U1']*1000:.4f} mm  Uy={v['U2']*1000:.4f} mm  Uz={v['U3']*1000:.4f} mm", flush=True)

    # Determinar el desplazamiento KPI segun caso
    if case_id == "cantileverColumn":
        # δ horizontal en tope = U1 del joint 2
        kpi = "Ux"
        kpi_val = out.get("2", {}).get("U1", 0) * 1000
    elif case_id == "clampedClampedBeam":
        # δ vertical en centro = U3 del joint 3
        kpi = "Uz"
        kpi_val = out.get("3", {}).get("U3", 0) * 1000
    else:
        # cantileverBeam: δ vertical en libre = U3 del joint 2
        kpi = "Uz"
        kpi_val = out.get("2", {}).get("U3", 0) * 1000

    print(f"  [OK] KPI {kpi} = {kpi_val:.4f} mm", flush=True)
    return {"case": case_id, "kpi": kpi, "kpi_mm": kpi_val, "all_joints": out}

def main():
    SapModel = connect()
    results = []
    for c in CASES:
        try:
            results.append(process(SapModel, c))
        except Exception as e:
            import traceback; traceback.print_exc()
            results.append({"case": c, "error": str(e)})

    print("\n=== RESUMEN ===")
    print(f"{'Case':<22s} | {'KPI':<5s} | {'mm':>10s}")
    for r in results:
        if "error" in r:
            print(f"{r['case']:<22s} | ERROR: {r['error']}")
            continue
        print(f"{r['case']:<22s} | {r['kpi']:<5s} | {r['kpi_mm']:>10.4f}")

    with open(OUTPUT_JSON, "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n[OK] {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
