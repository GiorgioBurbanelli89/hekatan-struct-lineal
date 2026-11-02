# -*- coding: utf-8 -*-
"""
ETABS forense:
  1) Cuenta cuantos FRAME ELEMENTS finite-element internos creo ETABS por cada frame OBJECT
  2) Extrae reacciones de columnas (Fx, Fy, Fz, Mx, My, Mz) -> confirma que DOFs estan activos
  3) Lista todos los joints internos creados por auto-mesh
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
    except Exception:
        obj = helper.CreateObject(ETABS_EXE)
        obj.ApplicationStart(); time.sleep(5)
    return obj.SapModel

def inspect(SapModel, case_id):
    edb = os.path.join(EDB_DIR, f"case_{case_id}.EDB")
    print(f"\n{'='*70}\n{case_id}\n{'='*70}", flush=True)
    SapModel.File.OpenFile(edb)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    SapModel.Analyze.RunAnalysis()

    # ===== Frame OBJECTS (lo que el usuario define) =====
    NumberNames=0; MyName=[]
    n_frame_obj = SapModel.FrameObj.GetNameList(NumberNames, MyName)
    obj_count = n_frame_obj[0]
    obj_names = list(n_frame_obj[1])

    # ===== Frame ELEMENTS (lo que ETABS crea internamente por auto-mesh) =====
    # ETABS API: SapModel.AnalysisModel.FrameObj.GetNameList ?
    # O puede ser via FrameObj.GetMeshSize etc.
    # En ETABS, los "elements" finite element se acceden via:
    #   SapModel.AnalysisModel.GetNameList... pero esto puede no estar expuesto
    # Alternativa: contar joints UNIQUE conectados a cada frame object
    print(f"  Frame OBJECTS: {obj_count} ({obj_names[:5]}...)", flush=True)

    # Para cada frame object, ver puntos intermedios (mesh):
    # SapModel.FrameObj.GetIntermediateJoint
    auto_mesh_info = {}
    for fo in obj_names:
        try:
            # GetIntermediateJoint - returns tuple (NumberJoints, MyName, ret)
            num=0; mj=[]
            r = SapModel.FrameObj.GetIntermediateJoint(fo, num, mj)
            if isinstance(r, tuple) and len(r) >= 2:
                num_intermediate = r[0]
                joint_names = list(r[1]) if num_intermediate > 0 else []
                auto_mesh_info[fo] = {"intermediate_joints": num_intermediate, "names": joint_names}
        except Exception as e:
            auto_mesh_info[fo] = {"error": str(e)}

    print(f"  Auto-mesh per frame object:")
    for fo, info in list(auto_mesh_info.items())[:8]:
        if "intermediate_joints" in info:
            n = info["intermediate_joints"]
            seg_count = n + 1  # n joints intermedios = n+1 sub-elementos
            print(f"    {fo}: {n} interm joints -> {seg_count} sub-elements", flush=True)
        else:
            print(f"    {fo}: ERR {info['error']}", flush=True)

    # ===== Joints totales =====
    NumberNames=0; MyName=[]
    nj = SapModel.PointObj.GetNameList(NumberNames, MyName)
    print(f"  Total joints in model: {nj[0]}", flush=True)

    # ===== Reacciones (en joints con restraint) =====
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    # Get reactions at all restrained joints
    print(f"  Reacciones en columnas (Dead):")
    print(f"  {'joint':>6s} | {'Fx':>10s} {'Fy':>10s} {'Fz':>10s} | {'Mx':>10s} {'My':>10s} {'Mz':>10s}")
    sumF = [0]*6
    for j in list(nj[1]):
        try:
            # GetRestraint para verificar si es soporte
            rest = [False]*6
            r = SapModel.PointObj.GetRestraint(j, rest)
            rest_arr = list(r[0]) if isinstance(r, tuple) else rest
            if not any(rest_arr):
                continue
            # Es soporte, obtener reacciones
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            F1=[]; F2=[]; F3=[]; M1=[]; M2=[]; M3=[]
            rl = SapModel.Results.JointReact(j, 0, NR, Obj, Elm, ACase, ST, SN, F1, F2, F3, M1, M2, M3)
            n = rl[0]
            if n > 0:
                fx, fy, fz = rl[6][0], rl[7][0], rl[8][0]
                mx, my, mz = rl[9][0], rl[10][0], rl[11][0]
                print(f"  {j:>6s} | {fx:>10.4f} {fy:>10.4f} {fz:>10.4f} | {mx:>10.4f} {my:>10.4f} {mz:>10.4f}", flush=True)
                sumF[0] += fx; sumF[1] += fy; sumF[2] += fz
                sumF[3] += mx; sumF[4] += my; sumF[5] += mz
        except Exception as e:
            pass
    print(f"  {'SUM':>6s} | {sumF[0]:>10.4f} {sumF[1]:>10.4f} {sumF[2]:>10.4f} | {sumF[3]:>10.4f} {sumF[4]:>10.4f} {sumF[5]:>10.4f}", flush=True)

    return {"case": case_id, "auto_mesh": auto_mesh_info, "n_joints": nj[0], "frame_objects": obj_count}

def main():
    SapModel = connect()
    res = []
    for c in CASES:
        try:
            res.append(inspect(SapModel, c))
        except Exception as e:
            import traceback
            traceback.print_exc()
            res.append({"case": c, "error": str(e)})

    # Save
    out = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_inspect_mesh.json"
    with open(out, "w") as f:
        json.dump(res, f, indent=2, default=str)
    print(f"\n[OK] {out}", flush=True)

if __name__ == "__main__":
    main()
