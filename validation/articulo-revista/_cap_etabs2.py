# -*- coding: utf-8 -*-
"""Se engancha al ETABS que YA esta abierto con TestM_Dual, fuerza el redibujo
(RefreshView con zoom), corre el modal si hace falta y saca los PNG recortados a
la ventana.

    python _cap_etabs2.py <carpeta_de_capturas>
"""
import os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
CAP = sys.argv[1]; os.makedirs(CAP, exist_ok=True)
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import comtypes.client
h = comtypes.client.CreateObject("ETABSv1.Helper")
import comtypes.gen.ETABSv1 as E
h = h.QueryInterface(E.cHelper)
o = h.GetObject("CSI.ETABS.API.ETABSObject")
sm = o.SapModel
log("enganchado: %s" % sm.GetModelFilename())

import win32gui, win32con, win32api
from PIL import ImageGrab

def rect():
    r = []
    def cb(hd, _):
        t = win32gui.GetWindowText(hd)
        if win32gui.IsWindowVisible(hd) and t.startswith("ETABS"): r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r[0] if r else (None, None)

hd, tit = rect()
log("ventana %s %s" % (hd, tit))
ANCHO = win32api.GetSystemMetrics(0); ALTO = win32api.GetSystemMetrics(1)
win32gui.ShowWindow(hd, win32con.SW_MAXIMIZE); time.sleep(2)
try: win32gui.SetForegroundWindow(hd)
except Exception as e: log("foreground: %r" % e)
time.sleep(1)

def png(nombre, espera=3.0):
    time.sleep(espera)
    x0, y0, x1, y1 = win32gui.GetWindowRect(hd)
    x0, y0 = max(0, x0), max(0, y0)
    ImageGrab.grab().crop((x0, y0, min(x1, ANCHO), min(y1, ALTO))).save(os.path.join(CAP, nombre))
    log("PNG -> %s  (%dx%d)" % (nombre, x1 - x0, y1 - y0))

# ── 3D y zoom ────────────────────────────────────────────────────────────────
for nv in (0, 1, 2):
    try:
        r = sm.View.RefreshView(nv, True)
        log("RefreshView(%d, True) -> %s" % (nv, r))
    except Exception as e:
        log("RefreshView(%d): %r" % (nv, e))
time.sleep(3)
png("30_etabs_modelo.png", 4)

# ── modal ────────────────────────────────────────────────────────────────────
try:
    log("RunAnalysis -> %s" % sm.Analyze.RunAnalysis())
    for nv in (0, 1, 2):
        try: sm.View.RefreshView(nv, True)
        except Exception: pass
    time.sleep(4)
    png("31_etabs_analizado.png", 4)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("Modal")
    r = sm.Results.ModalPeriod()
    log("periodos ETABS: %s" % [round(x, 6) for x in r[4][:12]])
    import json
    json.dump({"T": list(r[4][:12])},
              open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "etabs_dual.json"), "w"), indent=1)
except Exception as e:
    log("modal ETABS: %r" % e)

log("listo (ETABS queda abierto)")
