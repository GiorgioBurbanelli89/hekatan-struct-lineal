# -*- coding: utf-8 -*-
"""ETABS (el que ya está ABIERTO): abre EDIF.e2k, quita los brazos rígidos automáticos, corre el modal y vuelca
«Mass Summary by Story», «Centers of Mass and Rigidity» y «Modal Participating Mass Ratios» a etabs_pisos.json."""
import json, os, sys
import comtypes.client
import comtypes.gen.ETABSv1 as E
AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
sm = h.GetObject("CSI.ETABS.API.ETABSObject").SapModel
sm.SetModelIsLocked(False)
print("abrir", sm.File.OpenFile(os.path.join(AQUI, "EDIF.e2k")), flush=True)
sm.SetPresentUnits(6)                                            # kN, m
n = sm.FrameObj.GetNameList(0, [])
for nm in n[1]: sm.FrameObj.SetEndLengthOffset(nm, False, 0, 0, 0)
print("barras sin brazos:", n[0], flush=True)
sm.File.Save(os.path.join(AQUI, "EDIF_etabs.EDB"))
sm.Analyze.RunAnalysis()
def tabla(t):
    r = sm.DatabaseTables.GetTableForDisplayArray(t, [], "All", 0, [], 0, [])
    campos, nfil, datos = list(r[2]), r[3], list(r[4])
    return [dict(zip(campos, datos[i * len(campos):(i + 1) * len(campos)])) for i in range(nfil)]
out = {k: tabla(k) for k in ("Mass Summary by Story", "Centers of Mass and Rigidity", "Modal Participating Mass Ratios")}
json.dump(out, open(os.path.join(AQUI, "etabs_pisos.json"), "w"), indent=1)
for f in out["Mass Summary by Story"]: print(f)
for f in out["Centers of Mass and Rigidity"]: print({k: f[k] for k in f if k in ("Story", "MassX", "XCM", "YCM", "XCCM", "YCCM", "XCR", "YCR")})
for f in out["Modal Participating Mass Ratios"][:3]: print({k: f[k] for k in f if k in ("Mode", "Period", "UX", "UY", "RZ")})
