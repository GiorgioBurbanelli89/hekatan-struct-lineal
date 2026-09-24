# -*- coding: utf-8 -*-
"""Deja ETABS como en la toma del curvo: 3D a pantalla completa con el modo 1 y la tabla de
masa participativa ABIERTA (grabar_etabs_toma.py arranca cerrandola con Done).
Coordenadas FISICAS 2560x1600 (bitacora 13-sep-2026)."""
import time, ctypes, warnings
warnings.filterwarnings("ignore")
import pyautogui
from pywinauto import Desktop
pyautogui.PAUSE = 0.15

def clic(x, y, d=0.6, pausa=1.0):
    pyautogui.moveTo(x, y, duration=d); time.sleep(0.2); pyautogui.click(); time.sleep(pausa)

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("ETABS")][0]
ctypes.windll.user32.ShowWindow(w.handle, 3); ctypes.windll.user32.SetForegroundWindow(w.handle)
time.sleep(1.5)
print("al frente:", w.window_text().strip(), flush=True)

clic(1530, 180, pausa=1.2)          # cerrar la ventana interna de PLANTA
clic(2048, 1400, pausa=0.8)         # foco en la vista 3-D
pyautogui.press("f3"); time.sleep(1.5)          # 3-D a pantalla completa
pyautogui.press("f6"); time.sleep(1.8)          # Display Deformed Shape
clic(1400, 314); time.sleep(0.5)                # Case -> Mode (modo 1)
clic(1120, 1264, pausa=2.5)                     # OK
pyautogui.hotkey("ctrl", "t"); time.sleep(2.5)  # Tables
clic(704, 768, pausa=0.8)                       # + Analysis Results
clic(730, 816, pausa=0.8)                       # + Modal Information
clic(778, 864, pausa=0.8)                       # marcar Mass Ratios
clic(1690, 1186, pausa=3.5)                     # OK -> se abre la tabla
print("vista preparada (tabla abierta, lista para grabar)", flush=True)
