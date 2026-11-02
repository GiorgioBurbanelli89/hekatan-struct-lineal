# -*- coding: utf-8 -*-
"""
Abre el archivo .e2k del usuario en ETABS, corre modal, y compara con
OpenSeesPy (ya ejecutado en 03_run_opensees_4cases.py) y Hekatan.

USO:
  - Cierra ETABS
  - python 06_open_e2k_and_compare.py
"""
import os, sys, time, json
import comtypes.client

sys.stdout.reconfigure(encoding='utf-8')

E2K_RIGID = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\Validaciones con python\perimeter_walls.e2k"
E2K_SEMI = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\Validaciones con python\perimeter_walls_semi_rigid.e2k"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))


def run_etabs_on_e2k(e2k_path, label):
    print("\n" + "="*72)
    print(f"  ETABS — {label}")
    print(f"  Archivo: {os.path.basename(e2k_path)}")
    print("="*72)

    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
    obj.ApplicationStart()
    time.sleep(8)
    SapModel = obj.SapModel
    if SapModel is None:
        print("  [ERROR] SapModel None")
        return None

    # Importar el .e2k
    print("  Importando .e2k…")
    ret = SapModel.File.Import_E2KText(e2k_path)
    print(f"  Import_E2KText ret={ret}")
    time.sleep(2)

    # Lock & analyze
    SapModel.SetModelIsLocked(False)
    SapModel.Analyze.SetRunCaseFlag("", False, True)
    # Buscar caso modal
    case_status = SapModel.Analyze.GetCaseStatus()
    cases = list(case_status[1]) if case_status[0] > 0 else []
    print(f"  Casos encontrados: {cases}")
    modal_case = None
    for c in cases:
        if "Modal" in str(c) or "modal" in str(c):
            modal_case = c
            break
    if modal_case:
        SapModel.Analyze.SetRunCaseFlag(modal_case, True)
        print(f"  Activado caso modal: {modal_case}")
    SapModel.Analyze.RunAnalysis()
    print("  Análisis ejecutado")

    # Resultados
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    if modal_case:
        SapModel.Results.Setup.SetCaseSelectedForOutput(modal_case)
    ret = SapModel.Results.ModalPeriod(0,[],[],[],[],[],[],[])
    T = list(ret[4]) if ret[0] > 0 else []
    ret2 = SapModel.Results.ModalParticipatingMassRatios(
        0,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[])
    UX = list(ret2[5]) if ret2[0]>0 else []
    UY = list(ret2[6]) if ret2[0]>0 else []
    RZ = list(ret2[13]) if ret2[0]>0 else []

    print(f"\n  Modos: {len(T)}")
    for i, t in enumerate(T[:6]):
        ux = UX[i]*100 if i<len(UX) else 0
        uy = UY[i]*100 if i<len(UY) else 0
        rz = RZ[i]*100 if i<len(RZ) else 0
        print(f"  Modo {i+1}: T={t:.4f}s  Ux={ux:.1f}%  Uy={uy:.1f}%  Rz={rz:.1f}%")

    # Cerrar ETABS
    try:
        obj.ApplicationExit(False)
    except Exception:
        pass
    return {"T": T, "UX": UX, "UY": UY, "RZ": RZ}


def main():
    results = {}
    print("Probando con .e2k del usuario (perimeter_walls)…\n")

    # Caso 1: Rigid
    try:
        results["etabs_rigid"] = run_etabs_on_e2k(E2K_RIGID, "Rigid Diaphragm")
    except Exception as e:
        print(f"  [ERROR Rigid] {e}")
        results["etabs_rigid"] = None
    time.sleep(5)

    # Caso 2: Semi-Rigid (= Membrane equivalente)
    try:
        results["etabs_semi"] = run_etabs_on_e2k(E2K_SEMI, "Semi-Rigid Diaphragm (≈ Membrane)")
    except Exception as e:
        print(f"  [ERROR Semi] {e}")
        results["etabs_semi"] = None

    # OpenSeesPy results (ya ejecutados antes)
    opensees_results = {
        "rigid_elm": {"T1": 0.1082, "T2": 0.0740, "T3": 0.0572},
        "rigid_nod": {"T1": 0.1046, "T2": 0.0714, "T3": 0.0546},
        "semi_elm":  {"T1": 0.1105, "T2": 0.0781, "T3": 0.0576},
        "semi_nod":  {"T1": 0.0884, "T2": 0.0624, "T3": 0.0483},
    }

    # Tabla final 3-way
    print("\n" + "="*86)
    print("  COMPARATIVA FINAL — perimeter_walls (10×8m × 3 pisos)")
    print("="*86)
    print(f"  {'Modo':<5} {'ETABS Rigid':<14} {'ETABS Semi':<14} {'OS Rigid+Elm':<14} {'OS Semi+Elm':<14}")
    print("  " + "-"*70)
    for i in range(3):
        Te_r = results["etabs_rigid"]["T"][i] if results["etabs_rigid"] and i<len(results["etabs_rigid"]["T"]) else None
        Te_s = results["etabs_semi"]["T"][i] if results["etabs_semi"] and i<len(results["etabs_semi"]["T"]) else None
        To_r = opensees_results["rigid_elm"][f"T{i+1}"]
        To_s = opensees_results["semi_elm"][f"T{i+1}"]
        s_er = f"{Te_r:.4f}" if Te_r is not None else "—"
        s_es = f"{Te_s:.4f}" if Te_s is not None else "—"
        print(f"  {i+1:<5} {s_er:<14} {s_es:<14} {To_r:<14.4f} {To_s:<14.4f}")

    out = {"etabs_rigid": results.get("etabs_rigid"),
           "etabs_semi": results.get("etabs_semi"),
           "opensees": opensees_results}
    with open(os.path.join(OUT_DIR, "comparacion_3way_e2k.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print(f"\n  JSON: comparacion_3way_e2k.json")


if __name__ == "__main__":
    main()
