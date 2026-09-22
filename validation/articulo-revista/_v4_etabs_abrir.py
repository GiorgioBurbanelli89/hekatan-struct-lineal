# -*- coding: utf-8 -*-
"""FASE A de ETABS 22 — abre TestM_Dual.EDB, corre el modal si hace falta y lee
por OAPI los periodos y las SEIS participaciones de masa, ademas del numero de
nudos de SU PROPIO automallado. Deja ETABS abierto para grabar la deformada.

    py -3.12 _v4_etabs_abrir.py <carpeta_capturas>

Se lanza ETABS.exe con el fichero (no `ApplicationStart`) para que la ventana
salga en pantalla: sin ventana no hay animacion que grabar. Y ETABS puede abrir
la ventana FUERA de pantalla, asi que se recoloca con SetWindowPos.
"""
import json, os, subprocess, sys, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0"
EDB = os.path.join(RAIZ, "hekatan-etabs-bridge", "Csi", "modelo_comparacion", "TestM_Dual.EDB")
EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
OUT = os.path.join(AQUI, "_v4_etabs_modal.json")
CAP = sys.argv[1] if len(sys.argv) > 1 else AQUI
os.makedirs(CAP, exist_ok=True)
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import win32gui, win32con, win32api
from PIL import ImageGrab

def ventana():
    r = []
    def cb(hd, _):
        t = win32gui.GetWindowText(hd)
        if win32gui.IsWindowVisible(hd) and t.startswith("ETABS"): r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r

if not os.path.exists(EDB): sys.exit("no existe " + EDB)
log("lanzo ETABS con " + os.path.basename(EDB))
subprocess.Popen([EXE, EDB])
hd = None
for i in range(60):
    time.sleep(10)
    v = ventana()
    if v:
        hd, tit = v[0]; log("ventana %d %r a los %.0f s" % (hd, tit, time.time() - t0)); break
    if i % 3 == 0: log("… esperando la ventana (%.0f s)" % (time.time() - t0))
if hd is None: sys.exit("ETABS no abrio ventana")
time.sleep(25)

import comtypes.gen.ETABSv1 as E
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.GetObject("CSI.ETABS.API.ETABSObject")
sm = o.SapModel
log("enganchado: %s" % sm.GetModelFilename())
sm.SetPresentUnits(6)

# ── la ventana, colocada (ETABS la abre a veces FUERA de pantalla) ───────────
A, L = win32api.GetSystemMetrics(0), win32api.GetSystemMetrics(1)
win32gui.ShowWindow(hd, win32con.SW_RESTORE); time.sleep(1)
win32gui.SetWindowPos(hd, win32con.HWND_TOP, 0, 0, A, L - 40, win32con.SWP_SHOWWINDOW)
time.sleep(2)
log("rect = %s (logico %dx%d)" % (win32gui.GetWindowRect(hd), A, L))

ret = None
try:
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("Modal")
    ret = sm.Results.ModalParticipatingMassRatios()
except Exception as e:
    log("sin resultados: %r" % (e,))
if not ret or ret[0] == 0:
    log("corriendo el analisis…")
    sm.Analyze.RunAnalysis()
    log("analisis hecho (%.0f s)" % (time.time() - t0))
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("Modal")
    ret = sm.Results.ModalParticipatingMassRatios()

n = ret[0]; per = list(ret[4])
ux, uy, uz = list(ret[5]), list(ret[6]), list(ret[7])
sux, suy, suz = list(ret[8]), list(ret[9]), list(ret[10])
rx, ry, rz = list(ret[11]), list(ret[12]), list(ret[13])
srx, sry, srz = list(ret[14]), list(ret[15]), list(ret[16])
log("Modal: %d modos, T1 = %.6f s" % (n, per[0]))

# el numero de nudos del MODELO DE ANALISIS de ETABS (su automallado), que NO es
# el de Hekatan/SAP/OpenSees (545): es una de las dos diferencias que hay que rotular.
try:
    np_ = sm.PointObj.Count()
except Exception:
    np_ = -1
try:
    ne = sm.PointElm.Count()
except Exception:
    ne = -1
log("PointObj = %s   PointElm (analisis) = %s" % (np_, ne))

d = {"programa": "ETABS 22", "edb": EDB, "n": n, "T": per,
     "PointObj": np_, "PointElm": ne,
     "Ux": ux, "Uy": uy, "Uz": uz, "Rx": rx, "Ry": ry, "Rz": rz,
     "sum": {"Ux": sux[-1]*100, "Uy": suy[-1]*100, "Uz": suz[-1]*100,
             "Rx": srx[-1]*100, "Ry": sry[-1]*100, "Rz": srz[-1]*100}}
log("sumatorias: %s" % {k: round(v, 3) for k, v in d["sum"].items()})
json.dump(d, open(OUT, "w", encoding="utf-8"), indent=1)
log("-> " + OUT)

open(os.path.join(AQUI, "_v4_etabs_hwnd.txt"), "w").write(str(hd))
time.sleep(3)
ImageGrab.grab().save(os.path.join(CAP, "_v4_etabs_00_abierto.png"))
log("PNG _v4_etabs_00_abierto.png — ETABS QUEDA ABIERTO")
