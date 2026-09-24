# -*- coding: utf-8 -*-
"""Las SEIS sumatorias de masa participativa del dual 2x2x4 del articulo, juez SAP2000 24.

Regla de Jorge (18-sep-2026): toda comparacion modal muestra modos 1-3 como minimo y la
participacion de masa con las seis sumatorias SUx, SUy, SUz, SRx, SRy, SRz.

sap_dual_modal.py solo guardaba Ux, Uy, Uz, Rz y las sumas de X e Y. Aqui se ABRE el
.sdb ya corrido (sap_dual_sismo.sdb, Shell-Thick, misma malla de 545 nudos) y se leen
las seis direcciones y las seis sumatorias, primero con 12 modos (lo ya analizado) y
despues con 24 modos (para ver si en Y se pasa el 90 % de la NEC y si cambia el
cortante dinamico). UN solo arranque de SAP2000.

    python sap_masa_6dir.py sap_masa_6dir.json

ModalParticipatingMassRatios devuelve, por indice:
  0 n, 1 caso, 2 stepType, 3 stepNum, 4 Period,
  5 Ux, 6 Uy, 7 Uz, 8 SumUx, 9 SumUy, 10 SumUz,
  11 Rx, 12 Ry, 13 Rz, 14 SumRx, 15 SumRy, 16 SumRz, 17 ret
"""
import json, os, sys, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AQUI, "sap_masa_6dir.json")
SDB = os.path.join(AQUI, "sap_dual_sismo.sdb")
SAP_EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"
G = 9.80665
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObject(SAP_EXE)
o.ApplicationStart(); log("SAP2000 arrancado (el splash tarda 95-190 s, no es cuelgue)")
sm = o.SapModel
log("File.OpenFile -> %s" % sm.File.OpenFile(SDB))
sm.SetPresentUnits(6)          # 6 = kN, m, C
log("casos: %s" % list(sm.LoadCases.GetNameList()[1]))

def sel(*casos):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    for c in casos: sm.Results.Setup.SetCaseSelectedForOutput(c)

def masa6():
    """las seis direcciones y las seis sumatorias, en % """
    sel("MODAL")
    rm = sm.Results.ModalParticipatingMassRatios(0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    c = {"n": int(rm[0]), "T": [float(v) for v in rm[4]],
         "Ux": [float(v) for v in rm[5]], "Uy": [float(v) for v in rm[6]], "Uz": [float(v) for v in rm[7]],
         "Rx": [float(v) for v in rm[11]], "Ry": [float(v) for v in rm[12]], "Rz": [float(v) for v in rm[13]],
         "ret": rm[-1]}
    # las sumatorias acumuladas que da SAP en la ultima fila (mas fiables que sumar a mano)
    c["sum"] = {"Ux": 100 * float(rm[8][-1]), "Uy": 100 * float(rm[9][-1]), "Uz": 100 * float(rm[10][-1]),
                "Rx": 100 * float(rm[14][-1]), "Ry": 100 * float(rm[15][-1]), "Rz": 100 * float(rm[16][-1])}
    return c

def basal():
    def b(caso, col):
        sel(caso); br = sm.Results.BaseReact()
        return abs(float(br[col][0])) / G
    return {"V_SPECX_tonf": b("SPECX", 4), "V_SPECY_tonf": b("SPECY", 5)}

out = {"sdb": SDB, "unidades": "tonf, m", "malla_m": 1.0, "nudos": 545, "shell": "Shell-Thick", "casos": {}}

# ── 1) los 12 modos que ya estan analizados en el .sdb ───────────────────────
c12 = masa6()
log("12 modos leidos: n=%d  ret=%s" % (c12["n"], c12["ret"]))
if c12["n"] != 12:
    log("OJO: el .sdb no traia 12 modos sino %d; se re-analiza" % c12["n"])
    sm.SetModelIsLocked(False); sm.LoadCases.ModalEigen.SetNumberModes("MODAL", 12, 1)
    sm.Analyze.SetRunCaseFlag("", True, True); sm.Analyze.RunAnalysis(); c12 = masa6()
c12.update(basal())
out["casos"]["12"] = c12
log("12 modos  SUx %.4f  SUy %.4f  SUz %.4f  SRx %.4f  SRy %.4f  SRz %.4f"
    % tuple(c12["sum"][k] for k in ("Ux", "Uy", "Uz", "Rx", "Ry", "Rz")))
log("12 modos  VdinX %.4f  VdinY %.4f tonf" % (c12["V_SPECX_tonf"], c12["V_SPECY_tonf"]))
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1)

# ── 2) 24 modos: se llega al 90 % en Y? cambia el cortante dinamico? ─────────
SDB2 = os.path.join(AQUI, "sap_dual_nmodos.sdb")   # copia, para no pisar los 12 modos del original
for N in (20, 24):
    try:
        sm.SetModelIsLocked(False)
        sm.File.Save(SDB2)
        log("SetNumberModes(%d) -> %s" % (N, sm.LoadCases.ModalEigen.SetNumberModes("MODAL", N, 1)))
        sm.Analyze.SetRunCaseFlag("", True, True)
        log("run %d modos -> %s" % (N, sm.Analyze.RunAnalysis()))
        c = masa6(); c.update(basal())
        out["casos"][str(N)] = c
        log("%d modos  SUx %.4f  SUy %.4f  SUz %.4f  SRx %.4f  SRy %.4f  SRz %.4f"
            % ((N,) + tuple(c["sum"][k] for k in ("Ux", "Uy", "Uz", "Rx", "Ry", "Rz"))))
        log("%d modos  VdinX %.4f  VdinY %.4f tonf" % (N, c["V_SPECX_tonf"], c["V_SPECY_tonf"]))
        json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1)
    except Exception as e:
        log("%d modos FALLO: %r" % (N, e))

o.ApplicationExit(False)
log("fin -> " + OUT)
