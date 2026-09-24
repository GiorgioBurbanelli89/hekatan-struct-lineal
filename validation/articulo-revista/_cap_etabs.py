# -*- coding: utf-8 -*-
"""CAPTURAS de ETABS 22 con el modelo dual del articulo (Test M - Dual).

Se abre el .EDB que ya existe del contraste con ETABS
(hekatan-etabs-bridge/Csi/modelo_comparacion/TestM_Dual.EDB) lanzando ETABS.exe
DIRECTAMENTE con el fichero: asi la ventana sale en pantalla como siempre, sin
el arranque invisible del OAPI.

    python _cap_etabs.py <carpeta_de_capturas> [segundos_de_espera]
"""
import os, sys, time, subprocess
sys.stdout.reconfigure(encoding="utf-8")
CAP = sys.argv[1]; os.makedirs(CAP, exist_ok=True)
ESPERA = int(sys.argv[2]) if len(sys.argv) > 2 else 150
RAIZ = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0"
EDB = os.path.join(RAIZ, "hekatan-etabs-bridge", "Csi", "modelo_comparacion", "TestM_Dual.EDB")
EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

if not os.path.exists(EDB): sys.exit("no existe " + EDB)
log("lanzo ETABS con " + os.path.basename(EDB))
subprocess.Popen([EXE, EDB])

import win32gui, win32con, win32api
from PIL import ImageGrab
from pywinauto import Application
from pywinauto.keyboard import send_keys

def buscar():
    r = []
    def cb(hd, _):
        t = win32gui.GetWindowText(hd)
        if win32gui.IsWindowVisible(hd) and "ETABS" in t and "-" in t: r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r

hd = None
for _ in range(ESPERA // 5):
    time.sleep(5)
    v = buscar()
    if v:
        log("ventana: %s" % (v,))
        hd = v[0][0]
        if "TestM" in v[0][1] or "Dual" in v[0][1]: break
if hd is None: sys.exit("ETABS no abrio ninguna ventana")
time.sleep(25)                      # que termine de dibujar el modelo
log("ventana final: %s" % win32gui.GetWindowText(hd))

ANCHO = win32api.GetSystemMetrics(0); ALTO = win32api.GetSystemMetrics(1)
for f in (win32con.SW_RESTORE, win32con.SW_SHOW, win32con.SW_MAXIMIZE):
    try: win32gui.ShowWindow(hd, f)
    except Exception as e: log("show %s: %r" % (f, e))
    time.sleep(1)
try: win32gui.SetWindowPos(hd, win32con.HWND_TOP, 0, 0, ANCHO, ALTO - 40, win32con.SWP_SHOWWINDOW)
except Exception as e: log("pos: %r" % e)
try: win32gui.SetForegroundWindow(hd)
except Exception as e: log("foreground: %r" % e)
time.sleep(3)

try:
    w = Application(backend="win32").connect(handle=hd).window(handle=hd)
    w.set_focus()
except Exception as e:
    log("pywinauto: %r" % e); w = None
time.sleep(2)

def png(nombre, espera=3.0):
    time.sleep(espera)
    ImageGrab.grab().save(os.path.join(CAP, nombre))
    log("PNG -> " + nombre)

png("30_etabs_modelo.png", 5)
log("hecho. ETABS queda abierto: cierralo a mano o con el taskkill de la bitacora.")
