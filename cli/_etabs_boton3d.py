# -*- coding: utf-8 -*-
"""Localiza el boton «3-d» de la barra de ETABS por su posicion REAL (pywinauto, DPI-aware)
y lista los botones de la toolbar con su rectangulo, para pulsar el correcto sin adivinar."""
import ctypes, time, warnings
warnings.filterwarnings("ignore")
ctypes.windll.shcore.SetProcessDpiAwareness(2)
from pywinauto import Desktop

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("ETABS")][0]
print("principal:", w.rectangle(), flush=True)
n = 0
for d in w.descendants():
    c = d.friendly_class_name()
    t = (d.window_text() or "").strip()
    r = d.rectangle()
    # barras de herramientas y sus botones viven arriba (y < 250) y son anchos/bajos
    if r.top < 260 and r.height() < 120 and r.width() > 200:
        print("  [%-16s] %-40s %s" % (c[:16], t[:40], r), flush=True)
        n += 1
        if n > 14: break
