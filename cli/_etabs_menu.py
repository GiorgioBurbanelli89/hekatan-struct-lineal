# -*- coding: utf-8 -*-
"""Imprime los nombres REALES del menu View de ETABS y prueba el 3-D, mostrando el error
si lo hay (los intentos anteriores fallaron en silencio)."""
import ctypes, time, traceback, warnings
warnings.filterwarnings("ignore")
ctypes.windll.shcore.SetProcessDpiAwareness(2)
from pywinauto import Desktop

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("ETABS")][0]
w.set_focus(); time.sleep(0.8)
m = w.menu()
print("MENUS:", [i.text() for i in m.items()], flush=True)
try:
    view = [i for i in m.items() if i.text().replace("&", "").strip().lower().startswith("view")][0]
    subs = [s.text().replace("&", "") for s in view.sub_menu().items()]
    print("VIEW tiene", len(subs), "entradas", flush=True)
    for s in subs:
        if any(k in s.lower() for k in ("3-d", "3d", "dimension", "plan", "elev")):
            print("   ->", repr(s), flush=True)
except Exception:
    traceback.print_exc()
