# -*- coding: utf-8 -*-
"""¿Cómo reparte SAP2000 la masa de UNA cáscara trapezoidal a sus 4 nudos? (Hekatan: área/4, HRZ)
Trapecio (0,0) (4,0) (3,2) (1,2), t = 0.2 m, ρ = 2.4 t/m³, sin apoyos que quiten masa.
Lee la tabla «Assembled Joint Masses» después de analizar.
    python cli/_sap_masa_trapecio.py"""
import sys, os, json
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c
sys.stdout.reconfigure(encoding="utf-8")
_, S, _ = c.start_engine("sap", 6, True)
S.InitializeNewModel(6); S.File.NewBlank()
S.PropMaterial.SetMaterial("C", 2); S.PropMaterial.SetMPIsotropic("C", 25e6, 0.2, 1e-5)
S.PropMaterial.SetWeightAndMass("C", 2, 2.4)
S.PropArea.SetShell_1("P", 2, True, "C", 0.0, 0.2, 0.2)
XY = [(0, 0), (4, 0), (3, 2), (1, 2)]
nom = [S.PointObj.AddCartesian(x, y, 0, "", "N%d" % i)[0] for i, (x, y) in enumerate(XY)]
S.AreaObj.AddByPoint(4, nom, "", "P", "A1")
S.PointObj.SetRestraint(nom[0], [True, True, True, False, False, False])     # que no sea mecanismo
S.PointObj.SetRestraint(nom[1], [False, True, True, False, False, False])
S.PointObj.SetRestraint(nom[3], [False, False, True, False, False, False])
S.File.Save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots", "_sap_masa_trapecio.sdb"))
print("run", S.Analyze.RunAnalysis(), flush=True)
r = S.DatabaseTables.GetTableForDisplayArray("Assembled Joint Masses", [], "", 0, [], 0, [])
campos, n, datos = list(r[2]), r[3], list(r[4])
filas = [dict(zip(campos, datos[i * len(campos): (i + 1) * len(campos)])) for i in range(n)]
for f in filas: print({k: f[k] for k in campos if k in ("Joint", "U1", "U2", "U3")}, flush=True)
json.dump(filas, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots", "_sap_masa_trapecio.json"), "w"), indent=1)
os._exit(0)
