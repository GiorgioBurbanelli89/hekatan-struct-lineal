# -*- coding: utf-8 -*-
"""Abre SAP2000 (una vez), carga sap_dual_sismo.sdb YA CORRIDO y extrae las
FORMAS MODALES nodo a nodo (N0..N544) del caso MODAL, para el MAC contra Hekatan.
Cierra SAP2000 al terminar.

    py -3.12 sap_modos.py <salida.json>
"""
import json, os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
import comtypes.client

AQUI = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\validation\articulo-revista"
SDB = os.path.join(AQUI, "sap_dual_sismo.sdb")
OUT = sys.argv[1]
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import subprocess
import win32gui
EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"

def ventana():
    r = []
    def cb(hd, _):
        t = win32gui.GetWindowText(hd)
        if win32gui.IsWindowVisible(hd) and "SAP2000" in t: r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r

# ⚠️ CreateObject(exe)+ApplicationStart() rompe el canal IPC con la RAM justa.
# Se lanza el .exe con el .sdb como un usuario y se engancha con GetObject.
log("lanzo SAP2000 con " + os.path.basename(SDB))
subprocess.Popen([EXE, SDB])
hd = None
for i in range(60):
    time.sleep(10)
    v = ventana()
    if v:
        hd, tit = v[0]; log("ventana %d %r" % (hd, tit)); break
    if i % 3 == 0: log("... esperando la ventana")
if hd is None: sys.exit("SAP2000 no abrio ventana")
time.sleep(30)

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.GetObject("CSI.SAP2000.API.SapObject")
sm = o.SapModel
log("enganchado: %s" % sm.GetModelFilename())
sm.SetPresentUnits(6)   # 6 = kN_m_C  (la forma modal es adimensional en la practica; solo importa la forma)
log("unidades %s" % sm.GetPresentUnits())

# ¿hay resultados? si no, correr
sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
r = sm.Results.Setup.SetCaseSelectedForOutput("MODAL")
log("SetCaseSelectedForOutput(MODAL) -> %s" % r)
rp = sm.Results.ModalPeriod()
log("ModalPeriod ret=%s n=%s" % (rp[-1], rp[0]))
if rp[-1] != 0 or rp[0] == 0:
    log("sin resultados -> RunAnalysis")
    sm.Analyze.SetRunCaseFlag("", True, True)
    sm.Analyze.SetRunCaseFlag("MODAL", True, False)
    log("run -> %s" % sm.Analyze.RunAnalysis())
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("MODAL")
    rp = sm.Results.ModalPeriod()

T = [float(v) for v in rp[4]]
log("T1..T5 %s" % " ".join("%.4f" % t for t in T[:5]))

dump = json.load(open(os.path.join(AQUI, "dual_2x2x4_sismo.json"), encoding="utf-8"))
n = len(dump["nodes"])
log("nudos del modelo compartido: %d" % n)

NM = 6
shapes = [[0.0] * (6 * n) for _ in range(NM)]
faltan = []
for i in range(n):
    d = sm.Results.JointDispl("N%d" % i, 0)
    nres = d[0]
    if nres == 0:
        faltan.append(i); continue
    steps = [int(round(float(s))) for s in d[5]]
    U = [d[6], d[7], d[8], d[9], d[10], d[11]]
    for k, st in enumerate(steps):
        m = st - 1
        if 0 <= m < NM:
            for c in range(6):
                shapes[m][6 * i + c] = float(U[c][k])
    if i % 100 == 0: log("  nudo %d/%d nres=%d steps=%s" % (i, n, nres, steps[:3]))
log("nudos sin resultado: %d" % len(faltan))

json.dump({"programa": "SAP2000", "sdb": SDB, "nudos": n, "T": T,
           "modeShapes": shapes, "faltan": faltan,
           "orden": "N0..N%d, 6 gdl por nudo (U1,U2,U3,R1,R2,R3)" % (n - 1)},
          open(OUT, "w", encoding="utf-8"))
log("ok -> %s" % OUT)
try:
    o.ApplicationExit(False)
    log("SAP2000 cerrado")
except Exception as e:
    log("cierre: %r" % e)
