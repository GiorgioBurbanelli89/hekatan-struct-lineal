# -*- coding: utf-8 -*-
"""La ventana que quedo a pantalla completa es la PLANTA. Aqui se pasa esa ventana a vista
3-D con el boton «3-d» de la barra (View ▸ 3-D View), sin abrir ventanas nuevas.
La tabla de masa participativa se deja abierta (grabar_etabs_toma.py la cierra con Done)."""
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
        t = (d.window_text() or "").strip()
        if t.startswith(pref):
            return d
    return None

v = hija("Plan View") or hija("3-D View")
print("ventana activa:", (v.window_text() or "").strip()[:60], v.rectangle(), flush=True)
r = v.rectangle()
v.set_focus(); time.sleep(0.5)
# clic en zona VACIA del lienzo (abajo-izquierda) para que la vista tenga el foco del teclado
pyautogui.moveTo(r.left + 70, r.bottom - 70, duration=0.5); time.sleep(0.2); pyautogui.click(); time.sleep(0.8)

# menu View ▸ 3-D View (no dependo de la barra de iconos ni de coordenadas de captura)
w.menu_select("View->3-D View")
time.sleep(2.5)
v2 = hija("3-D View")
print("ahora hay 3-D View:", v2 is not None, flush=True)
if v2:
    r2 = v2.rectangle()
    v2.set_focus(); time.sleep(0.5)
    pyautogui.moveTo(r2.left + 70, r2.bottom - 70, duration=0.4); time.sleep(0.2); pyautogui.click(); time.sleep(0.6)
    pyautogui.press("f3"); time.sleep(2.0)      # pantalla completa
print("listo", flush=True)
