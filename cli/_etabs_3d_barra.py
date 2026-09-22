# -*- coding: utf-8 -*-
"""Devuelve ETABS a vista 3-D usando el boton «3-d» de la barra superior (coordenada FISICA
de la bitacora) + Ctrl+D para ocultar la rejilla (si no, la 3-D sale diminuta) + F2 zoom por
rectangulo para encuadrar el galpon. Deja la tabla de masa participativa abierta."""
import ctypes, time, warnings
warnings.filterwarnings("ignore")
ctypes.windll.shcore.SetProcessDpiAwareness(2)
import pyautogui
from pywinauto import Desktop
pyautogui.PAUSE = 0.15

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("ETABS")][0]
w.set_focus(); time.sleep(1.0)

def hija(pref):
    for d in w.descendants():
        if (d.window_text() or "").strip().startswith(pref):
            return d
    return None

v = hija("Plan View") or hija("3-D View")
r = v.rectangle()
print("antes:", (v.window_text() or "").strip()[:55], flush=True)
# foco en el lienzo, zona vacia
pyautogui.moveTo(r.left + 70, r.bottom - 70, duration=0.4); time.sleep(0.2); pyautogui.click(); time.sleep(0.6)
# boton «3-d» de la barra superior (bitacora: barra en y≈100 fisico; el icono 3-d a la derecha del zoom)
pyautogui.moveTo(1498, 100, duration=0.6); time.sleep(0.3); pyautogui.click(); time.sleep(2.5)
v2 = hija("3-D View")
print("hay 3-D View:", v2 is not None, flush=True)
if v2:
    r2 = v2.rectangle()
    pyautogui.moveTo(r2.left + 70, r2.bottom - 70, duration=0.4); time.sleep(0.2); pyautogui.click(); time.sleep(0.5)
    pyautogui.hotkey("ctrl", "d"); time.sleep(1.5)     # ocultar rejilla (si no, sale diminuta)
    pyautogui.press("f3"); time.sleep(2.0)             # pantalla completa
print("listo", flush=True)
