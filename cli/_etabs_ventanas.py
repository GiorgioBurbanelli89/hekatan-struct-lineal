# -*- coding: utf-8 -*-
"""Lista las ventanas HIJAS de ETABS (MDI) con su clase y rectangulo REAL, para cerrar el
Model Explorer y dejar la 3-D sola sin adivinar coordenadas sobre una captura reducida."""
import ctypes, warnings
warnings.filterwarnings("ignore")
ctypes.windll.shcore.SetProcessDpiAwareness(2)
from pywinauto import Desktop

w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("ETABS")][0]
print("principal:", w.window_text().strip(), w.rectangle(), flush=True)
for d in w.descendants():
    t = (d.window_text() or "").strip()
    c = d.friendly_class_name()
    r = d.rectangle()
    if r.width() > 120 and r.height() > 80 and (t or c in ("MDIClient",)):
        print("  [%-14s] %-58s %s" % (c[:14], t[:58], r), flush=True)
