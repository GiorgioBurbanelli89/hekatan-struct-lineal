# -*- coding: utf-8 -*-
"""
Conecta a ETABS abierto y ABRE los .e2k del usuario uno por uno (Rigid + Semi-Rigid).
Extrae modos modales y MPF.
"""
import os, sys, json, time
import comtypes.client

sys.stdout.reconfigure(encoding='utf-8')
OUT = os.path.dirname(os.path.abspath(__file__))

E2K_RIGID = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\Validaciones con python\perimeter_walls.e2k"
E2K_SEMI = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\Validaciones con python\perimeter_walls_semi_rigid.e2k"

print("Conectando…")
obj = comtypes.client.GetActiveObject("CSI.ETABS.API.ETABSObject")
SapModel = obj.SapModel
print("[OK] conectado")


def run_for_e2k(e2k_path, label):
    print(f"\n=== {label} ===")
    print(f"  Abriendo {os.path.basename(e2k_path)}…")
    # OpenFile en ETABS 22 acepta .EDB y .E2K directamente
    ret = SapModel.File.OpenFile(e2k_path)
    print(f"  OpenFile ret={ret}")
    time.sleep(2)

    SapModel.SetModelIsLocked(False)
    SapModel.Analyze.SetRunCaseFlag("", False, True)
    # Buscar caso modal
    status = SapModel.Analyze.GetCaseStatus()
    cases = list(status[1]) if status[0] > 0 else []
    print(f"  Casos: {cases}")
    modal_case = None
    for c in cases:
        cn = str(c)
        if "odal" in cn:
            modal_case = c
            break
    if modal_case:
        SapModel.Analyze.SetRunCaseFlag(modal_case, True)
        print(f"  Activado: {modal_case}")
    print("  Corriendo análisis…")
    SapModel.Analyze.RunAnalysis()
    print("  ✓ OK")

    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    if modal_case:
        SapModel.Results.Setup.SetCaseSelectedForOutput(modal_case)
    ret = SapModel.Results.ModalPeriod(0,[],[],[],[],[],[],[])
    n = ret[0]
    T = list(ret[4]) if n > 0 else []
    ret2 = SapModel.Results.ModalParticipatingMassRatios(
        0,[],[],[],[],[],[],[],[],[],[],[],[],[],[],[])
    UX = list(ret2[5]) if ret2[0]>0 else []
    UY = list(ret2[6]) if ret2[0]>0 else []
    RZ = list(ret2[13]) if ret2[0]>0 else []

    print(f"\n  {n} modos:")
    for i in range(min(8, len(T))):
        ux = UX[i]*100 if i<len(UX) else 0
        uy = UY[i]*100 if i<len(UY) else 0
        rz = RZ[i]*100 if i<len(RZ) else 0
        print(f"  Modo {i+1}: T={T[i]:.4f}s Ux={ux:.1f}% Uy={uy:.1f}% Rz={rz:.1f}%")

    return {"label": label, "T": T, "UX": UX, "UY": UY, "RZ": RZ}


# Rigid Diaphragm
results = {}
try:
    results["rigid"] = run_for_e2k(E2K_RIGID, "RIGID DIAPHRAGM")
except Exception as e:
    import traceback; traceback.print_exc()
    results["rigid"] = None

# Limpiar modelo y abrir el siguiente
print("\nLimpiando modelo…")
SapModel.InitializeNewModel(6)

# Semi-Rigid (= Membrane equivalente)
try:
    results["semi"] = run_for_e2k(E2K_SEMI, "SEMI-RIGID DIAPHRAGM (≈ Membrane)")
except Exception as e:
    import traceback; traceback.print_exc()
    results["semi"] = None

# Tabla
print("\n" + "="*72)
print("  COMPARATIVA — perimeter_walls (10×8m × 3 pisos)")
print("="*72)
Tr = results["rigid"]["T"] if results.get("rigid") else []
Ts = results["semi"]["T"] if results.get("semi") else []
print(f"  {'Modo':<5} {'T_Rigid':<12} {'T_SemiR':<12} {'Δ%':<10}")
print("  "+"-"*45)
for i in range(min(6, max(len(Tr), len(Ts)))):
    tr = Tr[i] if i < len(Tr) else 0
    ts = Ts[i] if i < len(Ts) else 0
    d = (ts-tr)/tr*100 if tr > 0 else 0
    print(f"  {i+1:<5} {tr:<12.4f} {ts:<12.4f} {d:<+10.2f}")

with open(os.path.join(OUT, "etabs_e2k_results.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)
print("\nDone.")
