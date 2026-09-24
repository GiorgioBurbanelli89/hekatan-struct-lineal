# -*- coding: utf-8 -*-
"""Sonda del cuadro «Set 3D View» de SAP2000 / ETABS, para poner los CUATRO
programas en el MISMO punto de vista (planta −45°, elevación 30°), que es lo que
pidió Jorge al rechazar la v4.

    py -3.12 _v4_csi_vista.py sap|etabs [--aplicar plan elev abertura]

Sin `--aplicar` solo abre el cuadro y vuelca sus controles + un PNG.
"""
import sys, time, os
sys.stdout.reconfigure(encoding="utf-8")
import win32gui
from PIL import ImageGrab
from pywinauto import Application, mouse
from pywinauto.keyboard import send_keys

QUIEN = sys.argv[1]
TMP = r"C:\Users\j-b-j\AppData\Local\Temp\claude"
PREF = "SAP2000" if QUIEN == "sap" else "ETABS"

r = []
def cb(h, _):
    t = win32gui.GetWindowText(h)
    if win32gui.IsWindowVisible(h) and t.startswith(PREF) and "-" in t: r.append((h, t))
win32gui.EnumWindows(cb, None)
if not r: sys.exit("no hay ventana de " + PREF)
hd, tit = r[0]
print("ventana", hd, repr(tit))
app = Application(backend="win32").connect(handle=hd)
w = app.window(handle=hd)
w.set_focus(); time.sleep(1)

# el botón «3-d» de la barra de herramientas (coordenadas FÍSICAS 2560×1600)
BOTON = (764, 108) if QUIEN == "sap" else (1522, 108)
mouse.click(coords=BOTON); time.sleep(3)
ImageGrab.grab().save(os.path.join(TMP, "%s_vista.png" % QUIEN))

def tops():
    out = []
    def cb2(h2, _):
        if win32gui.IsWindowVisible(h2) and h2 != hd:
            t = win32gui.GetWindowText(h2)
            if t: out.append((h2, t, win32gui.GetClassName(h2), win32gui.GetWindowRect(h2)))
    win32gui.EnumWindows(cb2, None)
    return out

dlg = None
for h2, t, cl, rc in tops():
    if "3" in t and "View" in t: dlg = h2; print("DIALOGO:", t, rc)
if dlg is None:
    print("ventanas visibles:")
    for x in tops()[:20]: print("  ", x)
    # puede ser una ventana HIJA del marco
    for c in w.descendants():
        try:
            t = c.window_text() or ""
            if "3" in t and "View" in t:
                print("  HIJA:", t, c.rectangle())
        except Exception: pass
else:
    d = Application(backend="win32").connect(handle=dlg).window(handle=dlg)
    for c in d.descendants():
        try:
            print("  %-34s %-26r %s" % (c.class_name().split(".app")[0], (c.window_text() or "")[:24],
                                        c.rectangle()))
        except Exception: pass
print("el cuadro queda ABIERTO")
