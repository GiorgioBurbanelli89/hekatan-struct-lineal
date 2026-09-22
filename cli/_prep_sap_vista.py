# -*- coding: utf-8 -*-
"""Deja SAP2000 como en la toma del curvo: sin ventana de planta, 3D al frente y encuadrada,
y el diálogo de tablas con Mass Ratios listo. Coordenadas FÍSICAS 2560x1600 (bitácora 13-sep)."""
import time, ctypes, warnings
warnings.filterwarnings("ignore")
import pyautogui
from pywinauto import Desktop
pyautogui.PAUSE = 0.15

def clic(x, y, d=0.6, pausa=0.9):
    pyautogui.moveTo(x, y, duration=d); time.sleep(0.2); pyautogui.click(); time.sleep(pausa)

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("SAP2000")][0]
ctypes.windll.user32.ShowWindow(w.handle, 3); ctypes.windll.user32.SetForegroundWindow(w.handle)
time.sleep(1.2)
print("al frente:", w.window_text().strip(), flush=True)
clic(1276, 137, pausa=1.2)        # cerrar la ventana interna de planta
clic(1900, 1300, pausa=1.0)       # foco en la vista 3-D
clic(520, 96, pausa=1.5)          # Restore Full View (encuadra el modelo)
print("vista preparada", flush=True)
