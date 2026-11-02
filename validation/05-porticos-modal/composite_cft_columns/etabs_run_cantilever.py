# -*- coding: utf-8 -*-
"""Importa Columna CFT Cantilivier.e2k a ETABS, corre y extrae deflexion."""
import os, time, json
import comtypes.client

E2K = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_cantilever\Columna CFT Cantilivier.e2k"
EDB = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_cantilever\cantilever.EDB"
OUT = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_cantilever_results.json"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"

def connect():
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = None
    try:
        obj = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if obj is None: raise RuntimeError("None")
    except Exception:
        try:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart(); time.sleep(8)
        except Exception:
            obj = helper.CreateObject(ETABS_EXE)
            obj.ApplicationStart(); time.sleep(8)
    print("[OK] ETABS connected", flush=True)
    return obj.SapModel

def main():
    SapModel = connect()
    SapModel.SetPresentUnits(6)  # kN, m, C
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

    # Section properties
    sect = SapModel.PropFrame.GetSectProps("CR300X300X121mm")
    Area, As2, As3, J, I22, I33 = sect[0:6]
    print(f"  Section CR300X300X121mm: A={Area:.4e} As2={As2:.4e} J={J:.4e} I22={I22:.4e} I33={I33:.4e}", flush=True)

    # Joint displacements (Dead = self weight)
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    NumberNames=0; MyName=[]
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
                u1, u2, u3 = rl[6][0], rl[7][0], rl[8][0]
                r1, r2, r3 = rl[9][0], rl[10][0], rl[11][0]
                out[j] = {"Ux": u1, "Uy": u2, "Uz": u3, "Rx": r1, "Ry": r2, "Rz": r3}
                print(f"  joint {j}: Ux={u1*1000:.4f} Uy={u2*1000:.4f} Uz={u3*1000:.4f} mm", flush=True)
        except Exception as e:
            pass

    # Reactions at base
    print(f"\n  Reacciones (Dead):", flush=True)
    react = {}
    for j in joints:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            F1=[]; F2=[]; F3=[]; M1=[]; M2=[]; M3=[]
            rl = SapModel.Results.JointReact(j, 0, NR, Obj, Elm, ACase, ST, SN, F1, F2, F3, M1, M2, M3)
            if rl[0] > 0:
                fx,fy,fz = rl[6][0], rl[7][0], rl[8][0]
                mx,my,mz = rl[9][0], rl[10][0], rl[11][0]
                if abs(fx)+abs(fy)+abs(fz)+abs(mx)+abs(my)+abs(mz) > 1e-6:
                    react[j] = dict(Fx=fx, Fy=fy, Fz=fz, Mx=mx, My=my, Mz=mz)
                    print(f"    {j}: Fz={fz:.4f} kN  Mx={mx:.4f}  My={my:.4f}", flush=True)
        except: pass

    result = {
        "Section": dict(Area=Area, As2=As2, As3=As3, J=J, I22=I22, I33=I33),
        "displacements": out,
        "reactions": react,
    }
    with open(OUT, "w") as f:
        json.dump(result, f, indent=2, default=str)
    print(f"\n[OK] {OUT}", flush=True)

if __name__ == "__main__":
    main()
