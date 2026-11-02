# -*- coding: utf-8 -*-
"""
Para cada e2k del directorio etabs_3cases:
  1) Lo carga en ETABS via File.OpenFile
  2) Lo guarda como .EDB
  3) Cierra y vuelve a abrir el .EDB (ETABS procesa cargas correctamente desde EDB)
  4) Corre análisis y extrae resultados

Esto evita el bug de cargas no aplicadas al usar OpenFile sobre .e2k directo.
"""
import os, sys, json, time
import comtypes.client

E2K_DIR = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_3cases"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
OUTPUT_JSON = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_3cases_results.json"
CASES = ["steelOnly", "filled", "concreteOnly"]

def connect():
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = None
    try:
        obj = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if obj is None: raise RuntimeError("None")
        print("[OK] Conectado a ETABS abierto", flush=True)
    except Exception:
        try:
            obj = helper.CreateObject(ETABS_EXE)
            obj.ApplicationStart()
            time.sleep(5)
        except Exception:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart()
            time.sleep(5)
        print("[OK] Lanzado ETABS", flush=True)
    return obj, obj.SapModel

def process(SapModel, case_id):
    e2k = os.path.join(E2K_DIR, f"case_{case_id}.e2k")
    edb = os.path.join(E2K_DIR, f"case_{case_id}.EDB")
    print(f"\n{'='*70}\nCASE: {case_id}\n{'='*70}", flush=True)
    print(f"  e2k: {e2k}", flush=True)
    print(f"  edb: {edb}", flush=True)

    # Step 1: open e2k
    SapModel.SetPresentUnits(6)
    ret = SapModel.File.OpenFile(e2k)
    print(f"  [..] OpenFile e2k ->ret={ret}", flush=True)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)

    # Step 2: save as EDB
    ret = SapModel.File.Save(edb)
    print(f"  [..] Save .EDB ->ret={ret}", flush=True)

    # Step 3: re-open the EDB (forces ETABS to re-process geometry+loads)
    ret = SapModel.File.OpenFile(edb)
    print(f"  [..] Re-open .EDB ->ret={ret}", flush=True)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)

    # Step 4: run analysis
    print(f"  [..] RunAnalysis", flush=True)
    SapModel.Analyze.RunAnalysis()

    # Step 5: extract section properties
    sect_beam = SapModel.PropFrame.GetSectProps("BeamSec")
    sect_col  = SapModel.PropFrame.GetSectProps("ColSec")
    Beam = dict(zip(["A","As2","As3","J","I22","I33"], sect_beam[0:6]))
    Col  = dict(zip(["A","As2","As3","J","I22","I33"], sect_col[0:6]))
    print(f"  Beam: {Beam}", flush=True)
    print(f"  Col : {Col}", flush=True)

    # Step 6: results
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    NumberNames = 0; MyName = []
    nl = SapModel.PointObj.GetNameList(NumberNames, MyName)
    joint_names = list(nl[1])
    print(f"  [..] {nl[0]} joints", flush=True)

    max_uz = 0.0; max_joint = None; all_disp = {}
    for joint in joint_names:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            U1=[]; U2=[]; U3=[]; R1=[]; R2=[]; R3=[]
            ret_list = SapModel.Results.JointDispl(joint, 0, NR, Obj, Elm, ACase, ST, SN, U1, U2, U3, R1, R2, R3)
            n = ret_list[0]
            if n > 0:
                Uz = ret_list[8][0]
                all_disp[joint] = Uz
                if abs(Uz) > abs(max_uz):
                    max_uz = Uz; max_joint = joint
        except Exception:
            pass
    print(f"  [OK] max |Uz| @ joint {max_joint} = {max_uz*1000:.4f} mm", flush=True)

    return {
        "case": case_id, "Beam": Beam, "Col": Col,
        "max_disp_joint": max_joint,
        "max_Uz_mm": max_uz * 1000.0,
        "all_disp_m": all_disp,
    }

def main():
    obj, SapModel = connect()
    results = []
    for c in CASES:
        try:
            r = process(SapModel, c)
            results.append(r)
        except Exception as e:
            import traceback
            print(f"[ERR] {c}: {e}", flush=True)
            traceback.print_exc()
            results.append({"case": c, "error": str(e)})

    print(f"\n{'='*70}\nRESUMEN\n{'='*70}")
    print(f"{'Case':<14s} | {'Joint':>10s} | {'centro [mm]':>14s} | {'A_col':>11s} | {'I_col':>11s}")
    print(f"{'-'*14} | {'-'*10} | {'-'*14} | {'-'*11} | {'-'*11}")
    for r in results:
        if "error" in r:
            print(f"{r['case']:<14s} | ERROR: {r['error']}")
            continue
        joint_str = str(r['max_disp_joint']) if r['max_disp_joint'] else "?"
        print(f"{r['case']:<14s} | {joint_str:>10s} | {r['max_Uz_mm']:>14.4f} | {r['Col']['A']:>11.4e} | {r['Col']['I33']:>11.4e}")

    with open(OUTPUT_JSON, "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n[OK] {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
