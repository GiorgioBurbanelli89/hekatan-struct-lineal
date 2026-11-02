# -*- coding: utf-8 -*-
"""Re-correr cftDeckSlab con base empotrada + extraer reacciones."""
import os, time, json
import comtypes.client

E2K = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs\composite_cft_cftDeckSlab.e2k"
EDB = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs\composite_cft_cftDeckSlab.EDB"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
OUT = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_cftDeckSlab_FIXED.json"

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
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart(); time.sleep(8)
        except Exception:
            obj = helper.CreateObject(ETABS_EXE)
            obj.ApplicationStart(); time.sleep(8)
        print("[OK] Lanzado", flush=True)
    return obj.SapModel

def main():
    SapModel = connect()
    SapModel.SetPresentUnits(6)
    print(f"[..] OpenFile e2k: {os.path.basename(E2K)}", flush=True)
    SapModel.File.OpenFile(E2K)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    SapModel.File.Save(EDB)
    SapModel.File.OpenFile(EDB)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    print(f"[..] RunAnalysis", flush=True)
    SapModel.Analyze.RunAnalysis()
    print(f"[OK] Analysis done", flush=True)

    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    NumberNames=0; MyName=[]
    nl = SapModel.PointObj.GetNameList(NumberNames, MyName)
    joints = list(nl[1])
    print(f"  {nl[0]} joints", flush=True)

    # Max |Uz|
    max_uz = 0.0; max_joint = None
    for j in joints:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            U1=[]; U2=[]; U3=[]; R1=[]; R2=[]; R3=[]
            rl = SapModel.Results.JointDispl(j, 0, NR, Obj, Elm, ACase, ST, SN, U1, U2, U3, R1, R2, R3)
            if rl[0] > 0:
                Uz = rl[8][0]
                if abs(Uz) > abs(max_uz):
                    max_uz = Uz; max_joint = j
        except: pass
    print(f"  max |Uz| @ joint {max_joint} = {max_uz*1000:.4f} mm", flush=True)

    # Reacciones en bases
    print(f"\n  Reacciones (Dead) en bases empotradas:", flush=True)
    print(f"  {'joint':>6s} | {'Fx':>10s} {'Fy':>10s} {'Fz':>10s} | {'Mx':>10s} {'My':>10s} {'Mz':>10s}", flush=True)
    sumF = [0]*6
    reactions = {}
    for j in joints:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            F1=[]; F2=[]; F3=[]; M1=[]; M2=[]; M3=[]
            rl = SapModel.Results.JointReact(j, 0, NR, Obj, Elm, ACase, ST, SN, F1, F2, F3, M1, M2, M3)
            if rl[0] > 0:
                fx,fy,fz = rl[6][0], rl[7][0], rl[8][0]
                mx,my,mz = rl[9][0], rl[10][0], rl[11][0]
                mag = abs(fx)+abs(fy)+abs(fz)+abs(mx)+abs(my)+abs(mz)
                if mag > 1e-6:
                    print(f"  {j:>6s} | {fx:>10.4f} {fy:>10.4f} {fz:>10.4f} | {mx:>10.4f} {my:>10.4f} {mz:>10.4f}", flush=True)
                    reactions[j] = dict(Fx=fx, Fy=fy, Fz=fz, Mx=mx, My=my, Mz=mz)
                    sumF[0]+=fx; sumF[1]+=fy; sumF[2]+=fz; sumF[3]+=mx; sumF[4]+=my; sumF[5]+=mz
        except: pass
    print(f"  {'SUM':>6s} | {sumF[0]:>10.4f} {sumF[1]:>10.4f} {sumF[2]:>10.4f} | {sumF[3]:>10.4f} {sumF[4]:>10.4f} {sumF[5]:>10.4f}", flush=True)

    out = {"max_Uz_mm": max_uz*1000, "max_joint": max_joint, "reactions": reactions, "sumF": sumF}
    with open(OUT, "w") as f:
        json.dump(out, f, indent=2, default=str)
    print(f"\n[OK] {OUT}", flush=True)

if __name__ == "__main__":
    main()
