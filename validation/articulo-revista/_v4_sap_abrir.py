# -*- coding: utf-8 -*-
"""FASE A — abre SAP2000 24 con el .sdb que YA esta en disco, lee por OAPI los
periodos, las SEIS participaciones de masa y el cortante, coloca la ventana y
deja SAP2000 ABIERTO para que la fase B (GUI) grabe la deformada modal animada.

    py -3.12 _v4_sap_abrir.py <carpeta_capturas>

⚠️ NO se usa `Helper.CreateObject(exe) + ApplicationStart()`: con la RAM justa el
canal IPC se corta («No se pudo leer desde un puerto IPC») y deja un SAP2000.exe
huerfano SIN VENTANA. Se lanza el .exe con el fichero, como un usuario, y se
engancha con `GetObject`: ademas asi la ventana esta en pantalla, que es lo que
hace falta para grabar la animacion.

Un solo arranque: NO llama a ApplicationExit.
"""
import json, os, subprocess, sys, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
SDB = os.path.join(AQUI, "sap_dual_sismo.sdb")
OUT = os.path.join(AQUI, "_v4_sap_modal.json")
EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"
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
        if win32gui.IsWindowVisible(hd) and "SAP2000" in t: r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r

log("lanzo SAP2000 con " + os.path.basename(SDB))
subprocess.Popen([EXE, SDB])
hd = None
for i in range(60):                      # hasta 10 min: el splash tarda 95-190 s
    time.sleep(10)
    v = ventana()
    if v:
        hd, tit = v[0]
        log("ventana %d %r a los %.0f s" % (hd, tit, time.time() - t0))
        break
    if i % 3 == 0: log("… esperando la ventana (%.0f s)" % (time.time() - t0))
if hd is None:
    sys.exit("SAP2000 no abrio ventana")
time.sleep(25)                           # que termine de cargar el modelo

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.GetObject("CSI.SAP2000.API.SapObject")
sm = o.SapModel
log("enganchado: %s" % sm.GetModelFilename())
sm.SetPresentUnits(6)                    # tonf, m, C

sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
ret = None
try:
    sm.Results.Setup.SetCaseSelectedForOutput("MODAL")
    ret = sm.Results.ModalParticipatingMassRatios()
except Exception as e:
    log("sin resultados: %r" % (e,))
if not ret or ret[0] == 0:
    log("corriendo el analisis…")
    sm.Analyze.RunAnalysis()
    log("analisis hecho (%.0f s)" % (time.time() - t0))
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("MODAL")
    ret = sm.Results.ModalParticipatingMassRatios()

n = ret[0]
per = list(ret[4])
ux, uy, uz = list(ret[5]), list(ret[6]), list(ret[7])
sux, suy, suz = list(ret[8]), list(ret[9]), list(ret[10])
rx, ry, rz = list(ret[11]), list(ret[12]), list(ret[13])
srx, sry, srz = list(ret[14]), list(ret[15]), list(ret[16])
log("MODAL: %d modos, T1 = %.6f s" % (n, per[0]))

d = {"programa": "SAP2000 24", "sdb": SDB, "nudos": 545, "unidades": "tonf, m",
     "n": n, "T": per, "Ux": ux, "Uy": uy, "Uz": uz, "Rx": rx, "Ry": ry, "Rz": rz,
     "sum": {"Ux": sux[-1]*100, "Uy": suy[-1]*100, "Uz": suz[-1]*100,
             "Rx": srx[-1]*100, "Ry": sry[-1]*100, "Rz": srz[-1]*100}}
for caso in ("DEAD", "LX", "SPECX", "SPECY"):
    try:
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        sm.Results.Setup.SetCaseSelectedForOutput(caso)
        r = sm.Results.BaseReact()
        d.setdefault("base", {})[caso] = {"Fx": r[2][0], "Fy": r[3][0], "Fz": r[4][0]}
        log("%s  Fx=%.4f Fy=%.4f Fz=%.4f" % (caso, r[2][0], r[3][0], r[4][0]))
    except Exception as e:
        log("%s: %r" % (caso, e))
json.dump(d, open(OUT, "w", encoding="utf-8"), indent=1)
log("-> " + OUT)

A, L = win32api.GetSystemMetrics(0), win32api.GetSystemMetrics(1)
win32gui.ShowWindow(hd, win32con.SW_RESTORE); time.sleep(1)
win32gui.SetWindowPos(hd, win32con.HWND_TOP, 0, 0, A, L - 40, win32con.SWP_SHOWWINDOW)
time.sleep(3)
open(os.path.join(AQUI, "_v4_sap_hwnd.txt"), "w").write(str(hd))
ImageGrab.grab().save(os.path.join(CAP, "_v4_sap_00_abierto.png"))
log("hwnd=%d rect=%s — PNG _v4_sap_00_abierto.png — SAP2000 QUEDA ABIERTO"
    % (hd, win32gui.GetWindowRect(hd)))
