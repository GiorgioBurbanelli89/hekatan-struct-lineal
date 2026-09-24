# -*- coding: utf-8 -*-
"""Arregla el encuadre de ETABS SIN cerrar la tabla de masa participativa:
cierra el Model Explorer, da foco a la vista 3-D y la pone a pantalla completa (F3).
La tabla se deja abierta a proposito: grabar_etabs_toma.py arranca cerrandola con Done."""
import time, ctypes, warnings
warnings.filterwarnings("ignore")
import pyautogui
from pywinauto import Desktop
pyautogui.PAUSE = 0.15

def clic(x, y, d=0.6, pausa=1.0):
    pyautogui.moveTo(x, y, duration=d); time.sleep(0.2); pyautogui.click(); time.sleep(pausa)

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("ETABS")][0]
ctypes.windll.user32.ShowWindow(w.handle, 3); ctypes.windll.user32.SetForegroundWindow(w.handle)
time.sleep(1.2)

# 1) cerrar el Model Explorer (su X, medida en la captura: imagen 0.55 -> fisico)
clic(521, 180, pausa=1.2)
# 2) foco en la vista 3-D, en una zona VACIA (abajo-derecha del lienzo, lejos del modelo y de la tabla)
clic(2300, 1350, pausa=0.8)
# 3) pantalla completa de la ventana activa + reencuadre
pyautogui.press("f3"); time.sleep(1.8)
print("encuadre aplicado", flush=True)
