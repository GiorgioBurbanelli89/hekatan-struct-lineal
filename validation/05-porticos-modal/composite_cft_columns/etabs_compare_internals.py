# -*- coding: utf-8 -*-
"""
================================================================================
ETABS API: Extraccion forense de parametros internos del modelo cftDeckSlab
================================================================================

Objetivo: identificar de donde viene el ~3% de gap residual entre Hekatan y ETABS
          extrayendo TODOS los parametros internos que ETABS usa para analizar
          la losa con CFT columns:

  1. Material composite handling: SHAPE "Filled Steel Tube" propiedades efectivas
     (A, I, J transformadas vs lo que Hekatan calcula)
  2. Property modifiers: A_mod, I33_mod, I22_mod, J_mod, AS2_mod, AS3_mod en frames
                        + f11_mod, f22_mod, f12_mod, m11_mod, m22_mod, m12_mod en shells
  3. Drilling stiffness: GetDrillingDOFStiffness en shells thin
  4. Shear area factor: GetShearAreaFactor o similar para Filled Steel Tube
  5. Resultado: desplazamiento centro losa Dead

Output: imprime tabla comparativa Hekatan vs ETABS y guarda JSON con todo.

Autor: Hekatan Struct
"""

import os
import sys
import json
import time
import math
import comtypes.client

EDB_PATH = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs\composite_cft_cftDeckSlab.EDB"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
OUTPUT_JSON = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_internals_forensic.json"

# Hekatan reference values (computed in run_matrix_cft.mjs)
HEKATAN = {
    "A_cft":    1.6212e-2,
    "I_cft":    1.2147e-4,
    "J_cft":    1.8464e-4,
    "AS_cft":   5.0/6.0 * 1.6212e-2,   # Hekatan Timoshenko default
    "E_steel":  2.0000e8,              # kN/m^2
    "E_conc":   2.5000e7,              # kN/m^2
    "nu_steel": 0.3,
    "nu_conc":  0.2,
    "n_modular_ratio": 0.125,          # E_conc / E_steel = 25/200
    "drilling_factor": 1e-6,           # Hekatan: 1e-6 * tr(Km) per node
    # Variant A result
    "w_centro_VA": -2.9001e-3,         # m
    "w_centro_VC": -3.0963e-3,         # m (DSE complete)
}

ETABS_REFERENCE = -3.0074e-3  # m, from previous run


def connect_etabs():
    """Connect to running ETABS or launch new instance."""
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    ETABSObject = None
    # Step 1: try GetObject (existing ETABS)
    try:
        ETABSObject = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if ETABSObject is None:
            raise RuntimeError("GetObject devolvio None")
        print("[OK] Conectado a ETABS abierto via GetObject")
    except Exception as e:
        print(f"[..] GetObject fallo ({e}). Probando CreateObject(EXE)...")
        ETABSObject = None
    # Step 2: try CreateObject(EXE)
    if ETABSObject is None:
        try:
            ETABSObject = helper.CreateObject(ETABS_EXE)
            ETABSObject.ApplicationStart()
            time.sleep(5)
            print("[OK] ETABS 22 lanzado via CreateObject(EXE)")
        except Exception as e:
            print(f"[..] CreateObject(EXE) fallo ({e}). Probando CreateObjectProgID...")
            ETABSObject = None
    # Step 3: try CreateObjectProgID
    if ETABSObject is None:
        try:
            ETABSObject = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            ETABSObject.ApplicationStart()
            time.sleep(5)
            print("[OK] ETABS lanzado via CreateObjectProgID")
        except Exception as e:
            print(f"[ERR] Todos los metodos de conexion fallaron. {e}")
            raise
    if ETABSObject is None:
        raise RuntimeError("No se pudo crear ETABSObject")
    SapModel = ETABSObject.SapModel
    SapModel.SetPresentUnits(6)  # kN, m, C
    return ETABSObject, SapModel


def open_and_run(SapModel):
    """Open model, run analysis."""
    print(f"[..] Abriendo modelo: {os.path.basename(EDB_PATH)}")
    ret = SapModel.File.OpenFile(EDB_PATH)
    if ret != 0:
        raise RuntimeError(f"OpenFile failed: ret={ret}")
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    print("[..] Ejecutando analisis...")
    ret = SapModel.Analyze.RunAnalysis()
    if ret != 0:
        print(f"     Warning: RunAnalysis returned {ret}")
    print("[OK] Analisis completado")


def extract_frame_section_properties(SapModel, name):
    """
    Get effective section properties of a frame section.
    For SHAPE 'Filled Steel Tube', ETABS computes the internal transformed section.
    """
    # GetSectProps returns: Area, As2, As3, Torsion, I22, I33, S22, S33, Z22, Z33,
    #                       R22, R33 + ret
    # PropFrame.GetSectProps signature: (Name, Area, As2, As3, Torsion, I22, I33, S22, S33, Z22, Z33, R22, R33)
    try:
        props = SapModel.PropFrame.GetSectProps(name)
        # Returns tuple: (Area, As2, As3, Torsion, I22, I33, S22, S33, Z22, Z33, R22, R33, ret)
        Area, As2, As3, J, I22, I33, S22, S33, Z22, Z33, R22, R33, ret = props
        return {
            "name": name,
            "Area": Area,
            "As2": As2,
            "As3": As3,
            "J": J,
            "I22": I22,
            "I33": I33,
            "S22": S22, "S33": S33, "Z22": Z22, "Z33": Z33,
            "R22": R22, "R33": R33,
        }
    except Exception as e:
        return {"name": name, "error": str(e)}


def extract_frame_modifiers(SapModel, name):
    """
    Get frame property modifiers (A, As2, As3, J, I22, I33, M, W).
    Sintaxis ETABS oficial: SapModel.PropFrame.GetModifiers(Name, Value)
    Donde Value es un array de 8 doubles que se PASA y se RETORNA modificado.
    """
    try:
        Value = [0.0] * 8
        result = SapModel.PropFrame.GetModifiers(name, Value)
        # ETABS retorna [Value, ret] como tupla
        if isinstance(result, tuple):
            Value_out = result[0]
            ret = result[1] if len(result) > 1 else None
        else:
            Value_out = Value
            ret = None
        mods = list(Value_out)
        return {
            "name": name,
            "ret": ret,
            "A_mod":      mods[0],
            "As2_mod":    mods[1],
            "As3_mod":    mods[2],
            "J_mod":      mods[3],
            "I22_mod":    mods[4],
            "I33_mod":    mods[5],
            "Mass_mod":   mods[6],
            "Weight_mod": mods[7],
        }
    except Exception as e:
        return {"name": name, "error": str(e)}


def extract_shell_modifiers(SapModel, name):
    """
    Get shell property modifiers (f11, f22, f12, m11, m22, m12, V13, V23, M, W).
    Sintaxis ETABS oficial: SapModel.PropArea.GetModifiers(Name, Value)
    """
    try:
        Value = [0.0] * 10
        result = SapModel.PropArea.GetModifiers(name, Value)
        if isinstance(result, tuple):
            Value_out = result[0]
            ret = result[1] if len(result) > 1 else None
        else:
            Value_out = Value
            ret = None
        mods = list(Value_out)
        return {
            "name": name,
            "ret": ret,
            "f11_mod":    mods[0],   # membrane (1-1)
            "f22_mod":    mods[1],   # membrane (2-2)
            "f12_mod":    mods[2],   # membrane shear (1-2)
            "m11_mod":    mods[3],   # bending (1-1)
            "m22_mod":    mods[4],   # bending (2-2)
            "m12_mod":    mods[5],   # bending twist (1-2)
            "V13_mod":    mods[6],   # transverse shear (1-3)
            "V23_mod":    mods[7],   # transverse shear (2-3)
            "Mass_mod":   mods[8],
            "Weight_mod": mods[9],
        }
    except Exception as e:
        return {"name": name, "error": str(e)}


def extract_shell_modeling_type(SapModel, name):
    """Get whether shell is ShellThin (Kirchhoff) or ShellThick (Mindlin)."""
    info = {"name": name}
    # GetSlab signature (ETABS v22):
    # ret = PropArea.GetSlab(Name, SlabType, ShellType, MatProp, Thickness, Color, Notes, GUID)
    # All output args passed by reference; in Python comtypes returns tuple.
    try:
        SlabType = 0; ShellType = 0; MatProp = ""; Thickness = 0.0
        Color = 0; Notes = ""; GUID = ""
        result = SapModel.PropArea.GetSlab(name, SlabType, ShellType, MatProp,
                                             Thickness, Color, Notes, GUID)
        if isinstance(result, tuple):
            info["GetSlab_tuple_len"] = len(result)
            info["GetSlab_tuple"] = list(result)
            if len(result) >= 4:
                info["SlabType"] = result[0]
                info["ShellType"] = result[1]
                info["MatProp"] = result[2]
                info["Thickness"] = result[3]
                shell_type_map = {
                    1: "ShellThin (Kirchhoff)",
                    2: "ShellThick (Mindlin)",
                    3: "Membrane",
                    4: "Plate-thin",
                    5: "Plate-thick",
                    6: "Layered",
                }
                info["ShellType_str"] = shell_type_map.get(result[1], f"unknown({result[1]})")
    except Exception as e:
        info["GetSlab_error"] = str(e)

    # Also try GetShell (older API)
    try:
        result = SapModel.PropArea.GetShell(name, 0, False, "", 0.0, 0, "", "")
        if isinstance(result, tuple):
            info["GetShell_tuple"] = list(result)
    except Exception as e:
        info["GetShell_error"] = str(e)

    # Try GetTypeOAPI
    try:
        type_id = SapModel.PropArea.GetTypeOAPI(name)
        info["TypeOAPI"] = type_id
    except Exception as e:
        info["TypeOAPI_error"] = str(e)

    return info


def extract_filled_tube_native(SapModel, name):
    """For SHAPE 'Filled Steel Tube': try to get composite section info."""
    info = {}
    try:
        # GetTube: D, T, t, fill_material, etc.
        # For Filled Steel Tube, signature varies by version. Try GetTube first.
        result = SapModel.PropFrame.GetTube(name, "", 0.0, 0.0, 0.0, 0.0, -1, "", "")
        info["GetTube_result"] = list(result) if isinstance(result, tuple) else str(result)
    except Exception as e:
        info["GetTube_error"] = str(e)

    try:
        # Test Composite-specific property
        result = SapModel.PropFrame.GetCompositeColumnRectangle(name, "", 0.0, 0.0, 0.0, 0.0, "", "")
        info["GetCompositeColumnRectangle_result"] = list(result) if isinstance(result, tuple) else str(result)
    except Exception as e:
        info["GetCompositeColumnRectangle_error"] = str(e)

    try:
        result = SapModel.PropFrame.GetTypeOAPI(name)
        info["TypeOAPI"] = result
    except Exception as e:
        info["TypeOAPI_error"] = str(e)

    return info


def extract_joint_displacements(SapModel, joint_names, load_case="Dead"):
    """Extract Uz at given joints for given load case using EXACT ETABS API syntax."""
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput(load_case)

    out = {}
    for joint in joint_names:
        try:
            NumberResults = 0
            Obj = []; Elm = []
            ACase = []; StepType = []; StepNum = []
            U1 = []; U2 = []; U3 = []
            R1 = []; R2 = []; R3 = []
            ObjectElm = 0
            # Sintaxis ETABS oficial: parametros se pasan y RETORNAN como lista
            ret_list = SapModel.Results.JointDispl(joint, ObjectElm,
                                                    NumberResults, Obj, Elm,
                                                    ACase, StepType, StepNum,
                                                    U1, U2, U3, R1, R2, R3)
            # ret_list = [NumberResults, Obj, Elm, ACase, StepType, StepNum, U1, U2, U3, R1, R2, R3, ret]
            NumberResults = ret_list[0]
            U1_arr = ret_list[6]
            U2_arr = ret_list[7]
            U3_arr = ret_list[8]
            R1_arr = ret_list[9]
            R2_arr = ret_list[10]
            R3_arr = ret_list[11]
            ret = ret_list[12]
            if NumberResults > 0:
                out[joint] = {
                    "U1": U1_arr[0],
                    "U2": U2_arr[0],
                    "Uz": U3_arr[0],
                    "R1": R1_arr[0],
                    "R2": R2_arr[0],
                    "R3": R3_arr[0],
                    "load_case": load_case,
                    "n_results": NumberResults,
                    "ret": ret,
                }
            else:
                out[joint] = {"error": f"no results (NumberResults=0, ret={ret})"}
        except Exception as e:
            out[joint] = {"error": str(e)}
    return out


def extract_drilling_dof_stiffness(SapModel):
    """Try to get drilling DOF stiffness setting."""
    info = {}
    try:
        # SetDrillingDOFStiffness has params: (Name, Mode, Stiffness)
        # GetDrillingDOFStiffness — sometimes not exposed in all versions
        # Try as global setting
        # ETABS has: SapModel.AnalysisModel.SetDrillingDOFStiffness or similar
        # Default is typically 1e-7 of in-plane stiffness, scaled
        info["note"] = "ETABS default drilling stiffness = 1e-7 to 1e-3 of in-plane (auto-scaled per element)"
    except Exception as e:
        info["error"] = str(e)
    return info


def main():
    print("=" * 80)
    print("ETABS API FORENSIC: extraccion de parametros internos cftDeckSlab")
    print("=" * 80)

    ETABSObject, SapModel = connect_etabs()
    open_and_run(SapModel)

    print()
    print(">>> 1) FRAME SECTION PROPERTIES")
    print()
    sect_cft = extract_frame_section_properties(SapModel, "CFT_HSS250x10")
    sect_w360 = extract_frame_section_properties(SapModel, "W360X60")
    print(f"  CFT_HSS250x10 (ETABS Filled Steel Tube nativo):")
    for k, v in sect_cft.items():
        if isinstance(v, float):
            print(f"    {k:>10s} = {v:.6e}")
        else:
            print(f"    {k:>10s} = {v}")
    print(f"\n  W360X60:")
    for k, v in sect_w360.items():
        if isinstance(v, float):
            print(f"    {k:>10s} = {v:.6e}")

    print()
    print(">>> 2) FRAME MODIFIERS (Stiffness Modifiers AISC §I1.5 / cracking)")
    print()
    mods_cft = extract_frame_modifiers(SapModel, "CFT_HSS250x10")
    mods_w360 = extract_frame_modifiers(SapModel, "W360X60")
    print(f"  CFT_HSS250x10:")
    for k, v in mods_cft.items():
        if isinstance(v, float):
            print(f"    {k:>12s} = {v:.4f}")
    print(f"\n  W360X60:")
    for k, v in mods_w360.items():
        if isinstance(v, float):
            print(f"    {k:>12s} = {v:.4f}")

    print()
    print(">>> 3) SHELL MODELING TYPE & MODIFIERS")
    print()
    shell_info = extract_shell_modeling_type(SapModel, "Losa")
    print(f"  Losa: {shell_info}")
    shell_mods = extract_shell_modifiers(SapModel, "Losa")
    print(f"  Modifiers Losa:")
    for k, v in shell_mods.items():
        if isinstance(v, float):
            print(f"    {k:>12s} = {v:.4f}")

    print()
    print(">>> 4) FILLED STEEL TUBE COMPOSITE INFO")
    print()
    ft_info = extract_filled_tube_native(SapModel, "CFT_HSS250x10")
    print(json.dumps(ft_info, indent=2, default=str))

    print()
    print(">>> 5) JOINT DISPLACEMENTS (centro losa, dead)")
    print()
    # Joint at center of slab — joint with x=2, y=2 (or similar). From the JSON we see joints labeled 1..30.
    # For 4×4 mesh on 4×4m slab, joint at (2,2) is center. Let's try joints 13 (which was kpi_node).
    # We extract for several joints to identify center.
    joint_results = extract_joint_displacements(SapModel, [str(i) for i in range(1, 31)])
    # Find joint with maximum |Uz|
    max_joint = None
    max_uz = 0
    for j, res in joint_results.items():
        if "Uz" in res:
            if abs(res["Uz"]) > abs(max_uz):
                max_uz = res["Uz"]
                max_joint = j
    print(f"  Joint con maxima |Uz|: joint {max_joint}, Uz = {max_uz*1000:.4f} mm")
    print(f"  Hekatan Variant A: w_centro = {HEKATAN['w_centro_VA']*1000:.4f} mm")
    print(f"  Hekatan Variant C: w_centro = {HEKATAN['w_centro_VC']*1000:.4f} mm")
    print(f"  Reference (anterior): {ETABS_REFERENCE*1000:.4f} mm")
    if abs(max_uz) > 1e-12:
        print(f"  Diff Hekatan A vs ETABS:   {(HEKATAN['w_centro_VA']-max_uz)/max_uz*100:+.2f} %")
        print(f"  Diff Hekatan C vs ETABS:   {(HEKATAN['w_centro_VC']-max_uz)/max_uz*100:+.2f} %")
    else:
        print(f"  [WARN] max_uz cero — no se pudo extraer joint displacements")

    # Compute manually the transformed properties Hekatan uses
    print()
    print(">>> 6) COMPARATIVA HEKATAN vs ETABS — PROPIEDADES SECCION CFT")
    print()
    print(f"  {'Property':<10s} | {'Hekatan':>14s} | {'ETABS':>14s} | {'Diff %':>8s}")
    print("  " + "-" * 60)
    A_etabs = sect_cft.get("Area", 0)
    I_etabs = sect_cft.get("I33", 0)
    J_etabs = sect_cft.get("J", 0)
    As_etabs = sect_cft.get("As2", 0)

    def compare(label, hek, etabs):
        if etabs == 0:
            print(f"  {label:<10s} | {hek:>14.4e} | {etabs:>14.4e} | {'N/A':>8s}")
        else:
            diff = (hek - etabs) / etabs * 100
            print(f"  {label:<10s} | {hek:>14.4e} | {etabs:>14.4e} | {diff:>+7.2f} %")

    compare("A", HEKATAN["A_cft"], A_etabs)
    compare("I", HEKATAN["I_cft"], I_etabs)
    compare("J", HEKATAN["J_cft"], J_etabs)
    compare("As2", HEKATAN["AS_cft"], As_etabs)

    output = {
        "extracted_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "etabs_version": "22",
        "edb_path": EDB_PATH,
        "frame_sections": {
            "CFT_HSS250x10": sect_cft,
            "W360X60": sect_w360,
        },
        "frame_modifiers": {
            "CFT_HSS250x10": mods_cft,
            "W360X60": mods_w360,
        },
        "shell_info": {
            "Losa": {
                "modeling": shell_info,
                "modifiers": shell_mods,
            }
        },
        "filled_tube_info": ft_info,
        "joint_displacements_dead": joint_results,
        "max_disp": {"joint": max_joint, "Uz_mm": max_uz * 1000.0 if max_uz else None},
        "hekatan_reference": HEKATAN,
        "comparison_summary": {
            "etabs_w_centro_mm":   (max_uz * 1000.0) if max_uz else None,
            "hekatan_VA_w_centro_mm": HEKATAN["w_centro_VA"] * 1000.0,
            "hekatan_VC_w_centro_mm": HEKATAN["w_centro_VC"] * 1000.0,
            "diff_VA_pct": ((HEKATAN["w_centro_VA"] - max_uz) / max_uz * 100) if abs(max_uz) > 1e-12 else None,
            "diff_VC_pct": ((HEKATAN["w_centro_VC"] - max_uz) / max_uz * 100) if abs(max_uz) > 1e-12 else None,
        }
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, default=str)
    print()
    print(f"[OK] JSON guardado en: {OUTPUT_JSON}")

    return output


if __name__ == "__main__":
    main()
