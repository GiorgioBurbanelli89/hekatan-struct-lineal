# -*- coding: utf-8 -*-
"""
ETABS forense: Solo extrae REACCIONES de columnas en los 3 casos.
Confirma que DOFs estan activos (axial vs flexion vs torsion).
"""
import os, time, json
import comtypes.client

EDB_DIR = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_3cases"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
CASES = ["steelOnly", "filled", "concreteOnly"]

def connect():
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = None
    try:
        obj = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if obj is None: raise RuntimeError("None")
        print("[OK] Conectado a ETABS abierto", flush=True)
    except Exception as e1:
        print(f"  [..] GetObject fallo ({e1}). Intentando CreateObjectProgID...", flush=True)
        try:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart(); time.sleep(8)
            print("[OK] Lanzado via ProgID", flush=True)
        except Exception as e2:
            print(f"  [..] ProgID fallo ({e2}). Intentando CreateObject EXE...", flush=True)
            obj = helper.CreateObject(ETABS_EXE)
            obj.ApplicationStart(); time.sleep(8)
            print("[OK] Lanzado via EXE", flush=True)
    return obj.SapModel

def inspect(SapModel, case_id):
    edb = os.path.join(EDB_DIR, f"case_{case_id}.EDB")
    print(f"\n{'='*70}\n{case_id}\n{'='*70}", flush=True)
    SapModel.File.OpenFile(edb)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    print(f"  [..] RunAnalysis", flush=True)
    SapModel.Analyze.RunAnalysis()
    print(f"  [OK] done", flush=True)

    # Total joints (skip FrameObj.GetNameList - access violation)
    NumberNames=0; MyName=[]
    nj = SapModel.PointObj.GetNameList(NumberNames, MyName)
    print(f"  Total joints: {nj[0]}", flush=True)
    all_joints = list(nj[1])

    # Reactions at restrained joints
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    print(f"  Reacciones (Dead):", flush=True)
    print(f"  {'joint':>6s} | {'Fx':>10s} {'Fy':>10s} {'Fz':>10s} | {'Mx':>10s} {'My':>10s} {'Mz':>10s}", flush=True)

    sumF = [0]*6
    reactions = {}
    for j in all_joints:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            F1=[]; F2=[]; F3=[]; M1=[]; M2=[]; M3=[]
            rl = SapModel.Results.JointReact(j, 0, NR, Obj, Elm, ACase, ST, SN, F1, F2, F3, M1, M2, M3)
            n = rl[0]
            if n > 0:
                fx, fy, fz = rl[6][0], rl[7][0], rl[8][0]
                mx, my, mz = rl[9][0], rl[10][0], rl[11][0]
                magnitude = abs(fx) + abs(fy) + abs(fz) + abs(mx) + abs(my) + abs(mz)
                if magnitude > 1e-6:  # solo joints con reacciones no-cero
                    print(f"  {j:>6s} | {fx:>10.4f} {fy:>10.4f} {fz:>10.4f} | {mx:>10.4f} {my:>10.4f} {mz:>10.4f}", flush=True)
                    reactions[j] = dict(Fx=fx, Fy=fy, Fz=fz, Mx=mx, My=my, Mz=mz)
                    sumF[0] += fx; sumF[1] += fy; sumF[2] += fz
                    sumF[3] += mx; sumF[4] += my; sumF[5] += mz
        except Exception as e:
            pass
    print(f"  {'SUM':>6s} | {sumF[0]:>10.4f} {sumF[1]:>10.4f} {sumF[2]:>10.4f} | {sumF[3]:>10.4f} {sumF[4]:>10.4f} {sumF[5]:>10.4f}", flush=True)

    return {"case": case_id, "n_joints": nj[0], "reactions": reactions, "sumF": sumF}

def main():
    SapModel = connect()
    res = []
    for c in CASES:
        try:
            res.append(inspect(SapModel, c))
        except Exception as e:
            import traceback; traceback.print_exc()
            res.append({"case": c, "error": str(e)})

    # Resumen
    print(f"\n{'='*70}\nRESUMEN: DOFs ACTIVOS EN COLUMNAS\n{'='*70}", flush=True)
    print(f"{'Case':<14s} | {'Fx_max':>10s} | {'Fy_max':>10s} | {'Fz_max':>10s} | {'Mx_max':>10s} | {'My_max':>10s} | {'Mz_max':>10s}", flush=True)
    for r in res:
        if "error" in r:
            print(f"{r['case']}: ERROR", flush=True)
            continue
        # Max abs reaction by component across 4 columns
        maxes = [0]*6
        for j, react in r["reactions"].items():
            vals = [react['Fx'], react['Fy'], react['Fz'], react['Mx'], react['My'], react['Mz']]
            for i, v in enumerate(vals):
                if abs(v) > abs(maxes[i]):
                    maxes[i] = v
        print(f"{r['case']:<14s} | {maxes[0]:>10.4f} | {maxes[1]:>10.4f} | {maxes[2]:>10.4f} | {maxes[3]:>10.4f} | {maxes[4]:>10.4f} | {maxes[5]:>10.4f}", flush=True)

    out = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_reactions_3cases.json"
    with open(out, "w") as f:
        json.dump(res, f, indent=2, default=str)
    print(f"\n[OK] {out}", flush=True)

if __name__ == "__main__":
    main()
