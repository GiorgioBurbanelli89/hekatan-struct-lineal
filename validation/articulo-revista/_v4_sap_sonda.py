# -*- coding: utf-8 -*-
"""SONDA — se engancha al SAP2000 YA ABIERTO (fase A), abre el dialogo de la
deformada con F6 y VUELCA sus controles, para no clicar a ciegas por coordenadas.

    py -3.12 _v4_sap_sonda.py
"""
import os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
import win32gui, win32con, win32api
from PIL import ImageGrab
from pywinauto import Application
from pywinauto.keyboard import send_keys

AQUI = os.path.dirname(os.path.abspath(__file__))

hw = []
def cb(hd, _):
    if win32gui.IsWindowVisible(hd) and "SAP2000" in win32gui.GetWindowText(hd):
        hw.append((hd, win32gui.GetWindowText(hd), win32gui.GetWindowRect(hd)))
win32gui.EnumWindows(cb, None)
for x in hw: print("VENTANA", x)
if not hw: sys.exit("no hay SAP2000 abierto")
hd = hw[0][0]

app = Application(backend="win32").connect(handle=hd)
w = app.window(handle=hd)
w.set_focus(); time.sleep(2)

print("\n=== HIJAS DE LA PRINCIPAL ===")
for c in w.children():
    try: print(" ", c.class_name(), repr(c.window_text())[:70], c.rectangle())
    except Exception as e: print("  ?", e)

print("\n=== descendientes con texto ===")
for c in w.descendants():
    try:
        t = c.window_text()
        if t and len(t) < 60: print(" ", c.class_name(), repr(t), c.rectangle())
    except Exception: pass

ImageGrab.grab().save(os.path.join(AQUI, "_v4_sap_s0_antes.png"))
send_keys("{F6}"); time.sleep(4)
ImageGrab.grab().save(os.path.join(AQUI, "_v4_sap_s1_f6.png"))

print("\n=== ventanas de nivel superior tras F6 ===")
tops = []
def cb2(h2, _):
    if win32gui.IsWindowVisible(h2):
        t = win32gui.GetWindowText(h2)
        if t: tops.append((h2, t, win32gui.GetWindowRect(h2)))
win32gui.EnumWindows(cb2, None)
for x in tops[:25]: print(" ", x)

# el dialogo modal: ventana propiedad de SAP con texto tipo "Deformed Shape"
dlg = None
for h2, t, r in tops:
    if "Deform" in t or "Display" in t:
        dlg = h2; print("\nDIALOGO ->", t, r); break
if dlg:
    d = Application(backend="win32").connect(handle=dlg).window(handle=dlg)
    for c in d.descendants():
        try: print("  ", c.class_name(), repr(c.window_text())[:60], c.rectangle())
        except Exception: pass
else:
    print("\nNO se encontro dialogo de nivel superior; ¿es una ventana hija?")
print("\nOJO: el dialogo queda ABIERTO.")
