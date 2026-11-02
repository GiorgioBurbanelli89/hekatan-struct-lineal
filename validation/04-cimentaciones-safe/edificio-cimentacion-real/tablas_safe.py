# -*- coding: utf-8 -*-
import os
import sys
from pathlib import Path
import clr  # type: ignore
clr.AddReference(r"C:\Program Files\Computers and Structures\SAFE 20\SAFEv1.dll")
from SAFEv1 import cHelper, Helper, cOAPI, cSapModel, cFile, cDatabaseTables  # type: ignore

AQUI = Path(__file__).resolve().parent
F2K = Path(os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\examples\src\edificio-aporticado\sample_output\cimentacion_edificio_9zapatas_12vigas.f2k")

helper = cHelper(Helper())
oapi = cOAPI(helper.CreateObjectProgID("CSI.SAFE.API.ETABSObject"))
oapi.ApplicationStart()
sap = cSapModel(oapi.SapModel)
print("OpenFile ret=", cFile(sap.File).OpenFile(str(F2K)))
db = cDatabaseTables(sap.DatabaseTables)
r = db.GetAvailableTables()
print("GetAvailableTables ->", type(r), len(r) if hasattr(r,'__len__') else '')
try:
    n = int(r[1]); keys = list(r[2])
    print("n tablas =", n)
    for k in keys:
        kl = k.lower()
        if any(w in kl for w in ("load pattern","joint load","beam","spring","point object","area assign")):
            print("   ", k)
except Exception as e:
    print("no pude:", e)
    print(r)
oapi.ApplicationExit(False)
