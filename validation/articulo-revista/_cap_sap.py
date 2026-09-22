# -*- coding: utf-8 -*-
"""CAPTURAS de SAP2000 24 con el dual 2x2x4 del articulo (misma malla, 545 nudos).

Reutiliza el constructor de sap_dual_sismo.py hasta la marca de resultados y luego
maneja la ventana a CLICS con coordenadas fisicas (pantalla 2560x1600):
`View.RefreshView` del OAPI no encuadra y `menu_select` no existe (menu propio).

    python _cap_sap.py <carpeta_de_capturas>
"""
import os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = sys.argv[1]; os.makedirs(CAP, exist_ok=True)

src = open(os.path.join(AQUI, "sap_dual_sismo.py"), encoding="utf-8").read().split("# ── resultados", 1)[0]
sys.argv = ["sap_dual_sismo.py", os.path.join(AQUI, "dual_2x2x4_sismo.json"),
            os.path.join(AQUI, "sap_dual_sismo.json")]
g = {"__file__": os.path.join(AQUI, "sap_dual_sismo.py"), "__name__": "__main__"}
exec(compile(src, "sap_dual_sismo.py", "exec"), g)
o, sm, log = g["o"], g["sm"], g["log"]

import win32gui, win32con, win32api
from PIL import ImageGrab
from pywinauto import Application, mouse
from pywinauto.keyboard import send_keys

hw = []
def cb(hd, _):
    if win32gui.IsWindowVisible(hd) and "SAP2000" in win32gui.GetWindowText(hd):
        hw.append(hd)
win32gui.EnumWindows(cb, None)
if not hw:
    o.ApplicationExit(False); sys.exit("sin ventana de SAP2000")
hd = hw[0]
ANCHO, ALTO = win32api.GetSystemMetrics(0), win32api.GetSystemMetrics(1)
for f in (win32con.SW_RESTORE, win32con.SW_SHOW):
    win32gui.ShowWindow(hd, f); time.sleep(1)
win32gui.SetWindowPos(hd, win32con.HWND_TOP, 0, 0, ANCHO, ALTO - 40, win32con.SWP_SHOWWINDOW)
time.sleep(2)
w = Application(backend="win32").connect(handle=hd).window(handle=hd)
def foco():
    try: w.set_focus()
    except Exception as e: log("foco: %r" % e)
foco(); time.sleep(2)
log("rect: %s" % (win32gui.GetWindowRect(hd),))

def png(n, esp=3.0):
    time.sleep(esp); ImageGrab.grab().save(os.path.join(CAP, n)); log("PNG -> " + n)

# coordenadas FISICAS medidas sobre la captura de 2560x1600 con la ventana a
# pantalla completa (x2000 -> x1.28)
X_CERRAR_IZQ = (1276, 148)   # la aspa de la ventana hija "Deformed Shape (DEAD)"
X_ENCUADRAR  = (530, 108)    # 2do magnificador de la barra = Restore Full View
X_VISTA3D    = (1600, 500)   # dentro del lienzo, para activarlo
X_COMBO      = (1030, 509)   # Case/Combo Name del dialogo Display Deformed Shape
X_OK         = (1503, 1075)

# 1) dejar solo la vista 3-D y encuadrar
mouse.click(coords=X_CERRAR_IZQ); time.sleep(3)
mouse.click(coords=X_VISTA3D); time.sleep(1)
mouse.click(coords=X_ENCUADRAR); time.sleep(3)
png("10_sap2000_modelo.png", 4)

# 2) deformada del modo 1 (caso MODAL)
try:
    foco(); send_keys("{F6}"); time.sleep(4)
    mouse.click(coords=X_COMBO); time.sleep(1)
    send_keys("MODAL"); time.sleep(1); send_keys("{ENTER}"); time.sleep(1)
    png("11_sap2000_dialogo_deformada.png", 1)
    mouse.click(coords=X_OK); time.sleep(6)
    mouse.click(coords=X_VISTA3D); time.sleep(1)
    mouse.click(coords=X_ENCUADRAR); time.sleep(3)
    png("12_sap2000_deformada_modal.png", 4)
except Exception as e:
    log("deformada: %r" % e)

log("cierro SAP2000")
time.sleep(2)
o.ApplicationExit(False)
log("cerrado")
