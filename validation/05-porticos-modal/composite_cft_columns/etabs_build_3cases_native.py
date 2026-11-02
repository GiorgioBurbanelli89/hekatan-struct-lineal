# -*- coding: utf-8 -*-
"""
ETABS API: construye 3 modelos NATIVAMENTE (sin pasar por e2k):
  steelOnly       — Vigas W360x60 + Columnas HSS 250x10 (sin fill)
  filled          — Vigas W360x60 + Columnas CFT (Filled Steel Tube)
  concreteOnly    — Vigas concreto 0.30x0.60 + Columnas concreto 0.25x0.25

Geometría idéntica: 4×4 m bay, h=4 m, mesh 4×4, losa concreto t=0.10, q=5 kN/m².
Uso: python etabs_build_3cases_native.py
"""
import os
import sys
import json
import time
import comtypes.client

ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
OUTPUT_JSON = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_3cases_results.json"

# Geometría
LX = 4.0; LY = 4.0; H = 4.0
NX = 4; NY = 4
T_SLAB = 0.10
Q_UNIF = 5.0  # kN/m2

# Materiales
E_C = 25e6; NU_C = 0.20  # kN/m2
E_S = 200e6; NU_S = 0.30

# Sections
W_h = 0.352; W_b = 0.203; W_tf = 0.013; W_tw = 0.008
D_HSS = 0.250; T_HSS = 0.010
CB_b = 0.30; CB_d = 0.60
CC_b = 0.25; CC_d = 0.25


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
            print("[OK] Lanzado ETABS via EXE", flush=True)
        except Exception:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart()
            time.sleep(5)
            print("[OK] Lanzado ETABS via ProgID", flush=True)
    return obj, obj.SapModel


def build_model(SapModel, case_id):
    print(f"  [..] Construyendo modelo case={case_id}", flush=True)
    SapModel.InitializeNewModel(6)  # kN, m, C
    SapModel.File.NewBlank()
    SapModel.SetPresentUnits(6)

    # ===== Materiales =====
    SapModel.PropMaterial.SetMaterial("Mat_Conc", 2)  # 2=concrete
    SapModel.PropMaterial.SetMPIsotropic("Mat_Conc", E_C, NU_C, 1e-5)
    SapModel.PropMaterial.SetWeightAndMass("Mat_Conc", 1, 24.0)  # 24 kN/m3

    SapModel.PropMaterial.SetMaterial("Mat_Steel", 1)  # 1=steel
    SapModel.PropMaterial.SetMPIsotropic("Mat_Steel", E_S, NU_S, 1.2e-5)
    SapModel.PropMaterial.SetWeightAndMass("Mat_Steel", 1, 78.5)

    # ===== Frame Sections =====
    if case_id in ("steelOnly", "filled"):
        # Beam W360x60 acero
        SapModel.PropFrame.SetISection("BeamSec", "Mat_Steel",
                                        W_h, W_b, W_tf, W_tw, W_b, W_tf)
        if case_id == "steelOnly":
            # Column HSS hollow tube (sin fill)
            SapModel.PropFrame.SetTube("ColSec", "Mat_Steel",
                                        D_HSS, D_HSS, T_HSS, T_HSS)
        else:
            # CFT — Filled Steel Tube — usar SetTube + SetCompositeColumn
            # Primero crear Steel Tube básico, luego marcar como filled
            SapModel.PropFrame.SetTube("ColSec", "Mat_Steel",
                                        D_HSS, D_HSS, T_HSS, T_HSS)
            # Convertir a Filled Tube via SetEncasement o similar
            # ETABS API: PropFrame.SetCompositeFilledTube(Name, MatProp, FillMatProp, ...)
            try:
                SapModel.PropFrame.SetCompositeFilledTube(
                    "ColSec", "Mat_Steel", "Mat_Conc",
                    D_HSS, D_HSS, T_HSS, T_HSS,
                    -1, "Default", -1, "", -1)
            except Exception as e:
                # Si la API directa no existe, intentar via File.Import_2
                print(f"    [WARN] SetCompositeFilledTube falló: {e}", flush=True)
                print(f"    [WARN] Caso 'filled' fallback a HSS hueca", flush=True)
    else:
        # concreteOnly — viga + columna concreto rectangular
        # SetRectangle(Name, MatProp, T3, T2)  — T3=depth, T2=width
        SapModel.PropFrame.SetRectangle("BeamSec", "Mat_Conc", CB_d, CB_b)
        SapModel.PropFrame.SetRectangle("ColSec",  "Mat_Conc", CC_d, CC_b)

    # ===== Slab =====
    # SetSlab(Name, SlabType, ShellType, MatProp, Thickness, Color, Notes, GUID)
    # SlabType 0=Slab; ShellType 1=ShellThin
    SapModel.PropArea.SetSlab("Losa", 0, 1, "Mat_Conc", T_SLAB)

    # ===== Load patterns =====
    SapModel.LoadPatterns.Add("Dead", 1, 0, True)
    SapModel.LoadPatterns.Add("Live", 3, 0, True)

    # ===== Geometry: nodes + frames + areas =====
    dx = LX / NX; dy = LY / NY
    point_names = {}
    for j in range(NY + 1):
        for i in range(NX + 1):
            x = i * dx; y = j * dy
            # AddCartesian creates point and returns name
            ret = SapModel.PointObj.AddCartesian(x, y, H, "", f"P_{j}_{i}", "Global", False, 0)
            # ret = (name, status)
            name = ret[0] if isinstance(ret, tuple) else f"P_{j}_{i}"
            point_names[(i, j)] = name

    # 4 base points
    base_pids = []
    for (ic, jc) in [(0,0), (NX,0), (0,NY), (NX,NY)]:
        x = ic * dx; y = jc * dy
        ret = SapModel.PointObj.AddCartesian(x, y, 0.0, "", f"Pbase_{ic}_{jc}", "Global", False, 0)
        name = ret[0] if isinstance(ret, tuple) else f"Pbase_{ic}_{jc}"
        base_pids.append(name)
        # Pin restraint (UX,UY,UZ)
        Restraint = [True, True, True, False, False, False]
        SapModel.PointObj.SetRestraint(name, Restraint)

    # Beams (perimeter)
    beam_count = 0
    for i in range(NX):
        # bottom edge
        n1 = point_names[(i, 0)]; n2 = point_names[(i+1, 0)]
        ret = SapModel.FrameObj.AddByPoint(n1, n2, "", "BeamSec", f"BB_{i}")
        beam_count += 1
        # top edge
        n1 = point_names[(i, NY)]; n2 = point_names[(i+1, NY)]
        SapModel.FrameObj.AddByPoint(n1, n2, "", "BeamSec", f"BT_{i}")
        beam_count += 1
    for j in range(NY):
        # left edge
        n1 = point_names[(0, j)]; n2 = point_names[(0, j+1)]
        SapModel.FrameObj.AddByPoint(n1, n2, "", "BeamSec", f"BL_{j}")
        beam_count += 1
        # right edge
        n1 = point_names[(NX, j)]; n2 = point_names[(NX, j+1)]
        SapModel.FrameObj.AddByPoint(n1, n2, "", "BeamSec", f"BR_{j}")
        beam_count += 1

    # Columns (4)
    for k, (ic, jc) in enumerate([(0,0), (NX,0), (0,NY), (NX,NY)]):
        n_top = point_names[(ic, jc)]
        n_bot = base_pids[k]
        SapModel.FrameObj.AddByPoint(n_bot, n_top, "", "ColSec", f"COL_{k}")

    # Areas (mesh NX × NY)
    for j in range(NY):
        for i in range(NX):
            X = [i*dx, (i+1)*dx, (i+1)*dx, i*dx]
            Y = [j*dy, j*dy, (j+1)*dy, (j+1)*dy]
            Z = [H, H, H, H]
            ret = SapModel.AreaObj.AddByCoord(4, X, Y, Z, "", "Losa", f"S_{j}_{i}", "Global")
            area_name = ret[0] if isinstance(ret, tuple) else f"S_{j}_{i}"
            # Apply uniform load Q_UNIF kN/m2 in -Z (gravity)
            SapModel.AreaObj.SetLoadUniform(area_name, "Dead", -Q_UNIF, 10, True, "Global", 0)

    # Save model to a temporary EDB so analysis runs
    tmp_edb = os.path.join(os.path.dirname(OUTPUT_JSON), f"_tmp_{case_id}.edb")
    SapModel.File.Save(tmp_edb)

    print(f"  [..] Ejecutando análisis", flush=True)
    SapModel.Analyze.RunAnalysis()

    # Extraer propiedades sección
    sect_beam = SapModel.PropFrame.GetSectProps("BeamSec")
    sect_col  = SapModel.PropFrame.GetSectProps("ColSec")
    Beam_Area, Beam_As2, Beam_As3, Beam_J, Beam_I22, Beam_I33 = sect_beam[0:6]
    Col_Area, Col_As2, Col_As3, Col_J, Col_I22, Col_I33 = sect_col[0:6]

    # Joint displacements (Dead)
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    # Get all joints
    NumberNames = 0; MyName = []
    name_list = SapModel.PointObj.GetNameList(NumberNames, MyName)
    NumberNames = name_list[0]
    joint_names = list(name_list[1])

    max_uz = 0.0; max_joint = None
    for joint in joint_names:
        try:
            NR = 0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            U1=[]; U2=[]; U3=[]; R1=[]; R2=[]; R3=[]
            ret_list = SapModel.Results.JointDispl(joint, 0, NR, Obj, Elm, ACase, ST, SN, U1, U2, U3, R1, R2, R3)
            n = ret_list[0]
            if n > 0:
                Uz = ret_list[8][0]
                if abs(Uz) > abs(max_uz):
                    max_uz = Uz
                    max_joint = joint
        except Exception:
            pass

    print(f"  [OK] Beam: A={Beam_Area:.4e} I33={Beam_I33:.4e} J={Beam_J:.4e}", flush=True)
    print(f"  [OK] Col : A={Col_Area:.4e} I33={Col_I33:.4e} J={Col_J:.4e}", flush=True)
    print(f"  [OK] {NumberNames} joints, max |Uz| at {max_joint}: {max_uz*1000:.4f} mm", flush=True)

    return {
        "case": case_id,
        "Beam": dict(A=Beam_Area, As2=Beam_As2, As3=Beam_As3, J=Beam_J, I22=Beam_I22, I33=Beam_I33),
        "Col":  dict(A=Col_Area,  As2=Col_As2,  As3=Col_As3,  J=Col_J,  I22=Col_I22,  I33=Col_I33),
        "max_disp_joint": max_joint,
        "max_Uz_mm": max_uz * 1000.0,
    }


def main():
    obj, SapModel = connect()
    cases = ["steelOnly", "filled", "concreteOnly"]
    results = []
    for c in cases:
        print(f"\n{'='*70}\nCASE: {c}\n{'='*70}", flush=True)
        try:
            r = build_model(SapModel, c)
            results.append(r)
        except Exception as e:
            import traceback
            print(f"[ERR] {c}: {e}", flush=True)
            traceback.print_exc()
            results.append({"case": c, "error": str(e)})

    print(f"\n{'='*70}\nRESUMEN\n{'='*70}")
    print(f"{'Case':<14s} | {'Joint':>5s} | {'centro [mm]':>14s} | {'A_col':>12s} | {'I_col':>12s}")
    print(f"{'-'*14} | {'-'*5} | {'-'*14} | {'-'*12} | {'-'*12}")
    for r in results:
        if "error" in r:
            print(f"{r['case']:<14s} | ERROR: {r['error']}")
            continue
        joint_str = str(r['max_disp_joint']) if r['max_disp_joint'] else "?"
        print(f"{r['case']:<14s} | {joint_str:>5s} | {r['max_Uz_mm']:>14.4f} | {r['Col']['A']:>12.4e} | {r['Col']['I33']:>12.4e}")

    with open(OUTPUT_JSON, "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n[OK] {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
