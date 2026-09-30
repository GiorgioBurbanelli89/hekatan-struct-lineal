# -*- coding: utf-8 -*-
"""ETABS abierto: abre EDIF_etabs.EDB, marca «Calculate Diaphragm Centers of Rigidity» (no está en la OAPI: por la
interfaz, con el cursor), corre y vuelca «Centers of Mass and Rigidity» a etabs_cr.json."""
import json, os, sys, time
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-school\serie_curso_csi")
import comtypes.client, comtypes.gen.ETABSv1 as E
import csi_ui as U
AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.GetObject("CSI.ETABS.API.ETABSObject")
if o is None:
    import subprocess; pid = int([l.split()[1] for l in subprocess.run(["tasklist"], capture_output=True, text=True).stdout.splitlines() if l.startswith("ETABS.exe")][0])
    o = h.GetObjectProcess("CSI.ETABS.API.ETABSObject", pid)
sm = o.SapModel
if "--nogui" not in sys.argv:
    print("abrir", sm.File.OpenFile(os.path.join(AQUI, sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "EDIF_etabs.EDB")), flush=True)
    sm.SetModelIsLocked(False)
    w = U.principal("etabs"); w.restore() if w.is_minimized() else None; w.set_focus(); time.sleep(1.5)
    U.menu("etabs", "Analyze", "Set Load Cases to Run...")
    d = U.dialogo("etabs", "Set Load Cases to Run")
    cb = U.buscar(d, "Calculate Diaphragm Centers of Rigidity", "CheckBox")
    est = cb.get_toggle_state()
    print("checkbox antes:", est, flush=True)
    if est != 1: U.pulsa(cb)
    print("checkbox despues:", cb.get_toggle_state(), flush=True)
    U.pulsa(U.buscar(d, "OK", "Button"))
    time.sleep(1.0)
    sm.File.Save(os.path.join(AQUI, sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "EDIF_etabs.EDB"))
    print("run", sm.Analyze.RunAnalysis(), flush=True)
sm.SetPresentUnits(6)
r = sm.DatabaseTables.GetTableForDisplayArray("Centers Of Mass And Rigidity", [], "All", 0, [], 0, [])
campos, nfil, datos = list(r[2]), r[3], list(r[4])
filas = [dict(zip(campos, datos[i * len(campos):(i + 1) * len(campos)])) for i in range(nfil)]
json.dump(filas, open(os.path.join(AQUI, (sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "EDIF_etabs.EDB").replace(".EDB", "_cr.json")), "w"), indent=1)
for f in filas: print({k: f[k] for k in f if k in ("Story", "XCM", "YCM", "XCCM", "YCCM", "XCR", "YCR")}, flush=True)
