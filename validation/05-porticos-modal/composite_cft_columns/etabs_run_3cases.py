# -*- coding: utf-8 -*-
"""
ETABS API: importa los 3 e2k (steelOnly, filled, concreteOnly), corre análisis,
extrae propiedades de sección + joint displacement máximo.

Uso: python etabs_run_3cases.py
Output: etabs_3cases_results.json + log en stdout
"""
import os
import sys
import json
import time
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
            print("[OK] Lanzado ETABS via CreateObject(EXE)", flush=True)
        except Exception:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart()
            time.sleep(5)
            print("[OK] Lanzado ETABS via ProgID", flush=True)
    return obj, obj.SapModel


def import_e2k(SapModel, e2k_path):
    """Import e2k via NewBlankModel + ImportE2K."""
    SapModel.SetPresentUnits(6)  # kN, m, C
    # Hay que usar File.OpenFile con .e2k path — ETABS detecta el formato
    ret = SapModel.File.OpenFile(e2k_path)
    if ret != 0:
        raise RuntimeError(f"OpenFile e2k failed: {ret}")
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)


def run_case(SapModel, case_id, e2k_path):
    print(f"\n{'='*70}")
    print(f"CASE: {case_id}")
    print(f"{'='*70}", flush=True)
    import_e2k(SapModel, e2k_path)

    print(f"  [..] Ejecutando análisis...", flush=True)
    SapModel.Analyze.RunAnalysis()
    print(f"  [OK] Análisis completado", flush=True)

    # Sections
    print(f"  [..] Extrayendo propiedades de sección...", flush=True)
    sect_beam = SapModel.PropFrame.GetSectProps("BeamSec")
    sect_col  = SapModel.PropFrame.GetSectProps("ColSec")
    Beam_Area, Beam_As2, Beam_As3, Beam_J, Beam_I22, Beam_I33 = sect_beam[0:6]
    Col_Area, Col_As2, Col_As3, Col_J, Col_I22, Col_I33 = sect_col[0:6]

    print(f"  Beam: A={Beam_Area:.4e} As2={Beam_As2:.4e} J={Beam_J:.4e} I22={Beam_I22:.4e} I33={Beam_I33:.4e}")
    print(f"  Col : A={Col_Area:.4e} As2={Col_As2:.4e} J={Col_J:.4e} I22={Col_I22:.4e} I33={Col_I33:.4e}", flush=True)

    # Joint displacements (Dead)
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    # Obtener nombres reales de joints de ETABS (puede cambiar al importar e2k)
    NumberNames = 0
    MyName = []
    name_list = SapModel.PointObj.GetNameList(NumberNames, MyName)
    NumberNames = name_list[0]
    joint_names = list(name_list[1])
    print(f"  [..] {NumberNames} joints encontrados", flush=True)

    max_uz = 0.0
    max_joint = None
    all_disp = {}
    for joint in joint_names:
        try:
            NumberResults = 0
            Obj = []; Elm = []; ACase = []; StepType = []; StepNum = []
            U1 = []; U2 = []; U3 = []; R1 = []; R2 = []; R3 = []
            ret_list = SapModel.Results.JointDispl(joint, 0, NumberResults, Obj, Elm,
                                                    ACase, StepType, StepNum,
                                                    U1, U2, U3, R1, R2, R3)
            n = ret_list[0]
            if n > 0:
                Uz = ret_list[8][0]
                all_disp[joint] = Uz
                if abs(Uz) > abs(max_uz):
                    max_uz = Uz
                    max_joint = joint
        except Exception:
            pass

    print(f"  [OK] Joint con max |Uz|: joint {max_joint}, Uz = {max_uz*1000:.4f} mm", flush=True)

    return {
        "case": case_id,
        "Beam": {
            "A": Beam_Area, "As2": Beam_As2, "As3": Beam_As3,
            "J": Beam_J, "I22": Beam_I22, "I33": Beam_I33,
        },
        "Col": {
            "A": Col_Area, "As2": Col_As2, "As3": Col_As3,
            "J": Col_J, "I22": Col_I22, "I33": Col_I33,
        },
        "max_disp_joint": max_joint,
        "max_Uz_mm": max_uz * 1000.0,
        "all_disp_m": all_disp,
    }


def main():
    obj, SapModel = connect()
    results = []
    for case in CASES:
        e2k = os.path.join(E2K_DIR, f"case_{case}.e2k")
        try:
            r = run_case(SapModel, case, e2k)
            results.append(r)
        except Exception as e:
            print(f"[ERR] case {case}: {e}", flush=True)
            results.append({"case": case, "error": str(e)})

    print(f"\n{'='*70}")
    print(f"RESUMEN")
    print(f"{'='*70}")
    print(f"{'Case':<14s} | {'Joint':>5s} | {'centro [mm]':>14s} | {'A_col [m2]':>12s} | {'I_col [m4]':>12s}")
    print(f"{'-'*14} | {'-'*5} | {'-'*14} | {'-'*12} | {'-'*12}")
    for r in results:
        if "error" in r:
            print(f"{r['case']:<14s} | ERROR: {r['error']}")
            continue
        joint_str = str(r['max_disp_joint']) if r['max_disp_joint'] else "?"
        print(f"{r['case']:<14s} | {joint_str:>5s} | {r['max_Uz_mm']:>14.4f} | {r['Col']['A']:>12.4e} | {r['Col']['I33']:>12.4e}")

    with open(OUTPUT_JSON, "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n[OK] JSON: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
