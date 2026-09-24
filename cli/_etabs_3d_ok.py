# -*- coding: utf-8 -*-
"""Vista 3-D en ETABS pulsando el boton «3-d» LOCALIZADO A OJO en el recorte de la barra
(centro x=1512, y=100 fisico). El intento anterior en x=1498 caia en el icono de la mano.
Luego Ctrl+D (sin rejilla, si no la 3-D sale diminuta) y F3 a pantalla completa.
La tabla de masa participativa se deja ABIERTA: grabar_etabs_toma.py la cierra con Done."""
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
pyautogui.moveTo(r.left + 70, r.bottom - 70, duration=0.4); time.sleep(0.2); pyautogui.click(); time.sleep(0.6)

pyautogui.moveTo(1512, 100, duration=0.6); time.sleep(0.4); pyautogui.click(); time.sleep(3.0)
v2 = hija("3-D View")
print("hay 3-D View:", v2 is not None, flush=True)
if v2:
    r2 = v2.rectangle()
    pyautogui.moveTo(r2.left + 70, r2.bottom - 70, duration=0.4); time.sleep(0.2); pyautogui.click(); time.sleep(0.5)
    pyautogui.hotkey("ctrl", "d"); time.sleep(1.5)
    pyautogui.press("f3"); time.sleep(2.0)
    print("3-D en:", v2.rectangle(), flush=True)
print("listo", flush=True)
