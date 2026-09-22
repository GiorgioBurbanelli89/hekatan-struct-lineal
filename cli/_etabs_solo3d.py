# -*- coding: utf-8 -*-
"""Cierra el Model Explorer de ETABS y deja la vista 3-D SOLA a pantalla completa.
Usa las coordenadas REALES de las ventanas hijas (pywinauto, proceso DPI-aware), no una
captura reducida: ahi estaba el error de los intentos anteriores.
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
        if (d.window_text() or "").strip().startswith(pref):
            return d
    return None

exp = hija("Model Explorer")
if exp:
    r = exp.rectangle()
    print("Model Explorer en", r, flush=True)
    # WM_CLOSE a la ventana hija: cierra el panel sin tocar el modelo
    ctypes.windll.user32.PostMessageW(exp.handle, 0x0010, 0, 0)
    time.sleep(1.5)
print("explorer cerrado:", hija("Model Explorer") is None, flush=True)

v3d = hija("3-D View")
if v3d:
    r = v3d.rectangle()
    print("3-D View en", r, flush=True)
    v3d.set_focus(); time.sleep(0.6)
    # clic en una zona VACIA de la 3-D (esquina inferior izquierda del lienzo)
    pyautogui.moveTo(r.left + 60, r.bottom - 60, duration=0.5); time.sleep(0.2); pyautogui.click()
    time.sleep(0.6)
    pyautogui.press("f3"); time.sleep(2.0)     # pantalla completa de la ventana activa
print("listo", flush=True)
