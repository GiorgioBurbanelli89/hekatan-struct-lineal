# -*- coding: utf-8 -*-
"""Cómo calculan SAP2000 y ETABS un CANAL C y un DOBLE ÁNGULO 2L PARAMÉTRICOS (cotas editables).
Dos geometrías de cada uno (con una sola no se separa la fórmula de J ni de As). Se leen GetSectProps
y se guarda el modelo para mirar cómo lo escribe en su fichero de texto.
    python cli/_csi_secciones_c2l.py sap|etabs CARPETA"""
import sys, os, json, time
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c
sys.stdout.reconfigure(encoding="utf-8")
motor, carp = sys.argv[1], os.path.abspath(sys.argv[2]); os.makedirs(carp, exist_ok=True)
_, S, _ = c.start_engine(motor, 6, True)
S.InitializeNewModel(6)
if motor == "sap": S.File.NewBlank()
else: S.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 5.0, 5.0)
S.PropMaterial.SetMaterial("ACERO", 1); S.PropMaterial.SetMPIsotropic("ACERO", 200e6, 0.3, 1.2e-5); S.PropMaterial.SetWeightAndMass("ACERO", 2, 7.85)
# canal: T3 = canto d, T2 = ancho de ala bf, Tf, Tw ; 2L: T3 = ala vertical, T2 = ala horizontal (de UN ángulo), Tf, Tw, Dis = separación
secs = {
    "C200": ("SetChannel", (0.200, 0.075, 0.0085, 0.0056)),
    "C150": ("SetChannel", (0.150, 0.060, 0.0060, 0.0040)),
    "L50D": ("SetDblAngle", (0.050, 0.050, 0.005, 0.005, 0.010)),
    "L75D": ("SetDblAngle", (0.075, 0.050, 0.008, 0.006, 0.012)),
}
out = {"motor": motor, "secs": {k: v[1] for k, v in secs.items()}}
for nm, (fn, dims) in secs.items():
    try:
        out[nm + "_set"] = getattr(S.PropFrame, fn)(nm, "ACERO", *dims)
    except Exception as e:
        out[nm + "_set"] = "ERR " + str(e)[:80]
    try:
        r = S.PropFrame.GetSectProps(nm)
        k = ["Area", "As2", "As3", "Torsion", "I22", "I33", "S22", "S33", "Z22", "Z33", "R22", "R33"]
        out[nm] = dict(zip(k, [float(v) for v in r[:12]]))
    except Exception as e:
        out[nm] = "ERR " + str(e)[:80]
    try:
        g = getattr(S.PropFrame, fn.replace("Set", "Get"))(nm)
        out[nm + "_get"] = [str(v) for v in g]
    except Exception as e:
        out[nm + "_get"] = "ERR " + str(e)[:80]
p = [S.PointObj.AddCartesian(x, 0, 0)[0] for x in (0, 3, 6, 9, 12)]
for i, nm in enumerate(secs):
    S.FrameObj.AddByPoint(p[i], p[i + 1], "", nm, "B" + nm)
S.PointObj.SetRestraint(p[0], [True] * 6)
arch = os.path.join(carp, "secciones_c2l_" + motor + (".sdb" if motor == "sap" else ".EDB"))
S.File.Save(arch); out["run"] = S.Analyze.RunAnalysis(); time.sleep(2)
json.dump(out, open(os.path.join(carp, "props_c2l_" + motor + ".json"), "w"), indent=1)
print(json.dumps(out, indent=1), flush=True)
os._exit(0)
