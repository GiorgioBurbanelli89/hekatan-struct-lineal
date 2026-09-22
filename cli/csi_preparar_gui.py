# -*- coding: utf-8 -*-
"""Deja SAP2000 o ETABS ABIERTO y VISIBLE con el modelo de un ejemplo, analizado y maximizado,
listo para grabar la toma con el mouse real (grabar_sap_toma.py / grabar_etabs_toma.py).
    python cli/csi_preparar_gui.py sap|etabs RUTA_MODELO(.sdb|.s2k|.EDB|.e2k)
Al terminar NO cierra el programa (la toma se graba sobre esa ventana)."""
import sys, os, time, ctypes
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c

motor, ruta = sys.argv[1], os.path.abspath(sys.argv[2])
_, S, _ = c.start_engine("sap" if motor == "sap" else "etabs", 6, True)
c.load_model_from_file(S, ruta, 6)
S.SetPresentUnits(6)
# guardar como copia de trabajo (ETABS exige guardar antes de analizar) y analizar
base = os.path.splitext(ruta)[0] + ("_gui.sdb" if motor == "sap" else "_gui.EDB")
print("Save", S.File.Save(base), flush=True)
print("Run", S.Analyze.RunAnalysis(), flush=True)
# maximizar y traer al frente
from pywinauto import Desktop
pref = "SAP2000" if motor == "sap" else "ETABS"
w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith(pref)]
if w:
    ctypes.windll.user32.ShowWindow(w[0].handle, 3); ctypes.windll.user32.SetForegroundWindow(w[0].handle)
    print("al frente:", w[0].window_text(), flush=True)
time.sleep(2)
print("listo para grabar", flush=True)
os._exit(0)          # salir sin cerrar el programa
