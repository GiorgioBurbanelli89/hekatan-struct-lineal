# -*- coding: utf-8 -*-
"""Cómo calculan SAP2000 y ETABS un perfil I y un tubo PARAMÉTRICOS (con cotas editables), y cómo los
escriben en su fichero de texto. Una barra con cada sección, analizada, y se leen GetSectProps y el .$2k/$et.
    python cli/_csi_secciones_param.py sap|etabs CARPETA"""
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
# I: d 0.300, bf 0.150, tf 0.0107, tw 0.0071 ; tubo: h 0.300, b 0.200, tf 0.012, tw 0.008
out = {"motor": motor}
out["SetISection"] = S.PropFrame.SetISection("I300", "ACERO", 0.300, 0.150, 0.0107, 0.0071, 0.150, 0.0107)
out["SetTube"] = S.PropFrame.SetTube("T300", "ACERO", 0.300, 0.200, 0.012, 0.008)
for nm in ("I300", "T300"):
    r = S.PropFrame.GetSectProps(nm)
    k = ["Area", "As2", "As3", "Torsion", "I22", "I33", "S22", "S33", "Z22", "Z33", "R22", "R33"]
    out[nm] = dict(zip(k, [float(v) for v in r[:12]]))
    try: out[nm + "_get"] = [str(v) for v in (S.PropFrame.GetISection(nm) if nm == "I300" else S.PropFrame.GetTube(nm))]
    except Exception as e: out[nm + "_get"] = "ERR " + str(e)[:60]
p = [S.PointObj.AddCartesian(0, 0, 0)[0], S.PointObj.AddCartesian(0, 0, 3)[0], S.PointObj.AddCartesian(4, 0, 3)[0]]
S.FrameObj.AddByPoint(p[0], p[1], "", "T300", "C1"); S.FrameObj.AddByPoint(p[1], p[2], "", "I300", "V1")
S.PointObj.SetRestraint(p[0], [True] * 6)
arch = os.path.join(carp, "secciones_" + motor + (".sdb" if motor == "sap" else ".EDB"))
S.File.Save(arch); out["run"] = S.Analyze.RunAnalysis(); time.sleep(2)
json.dump(out, open(os.path.join(carp, "props_" + motor + ".json"), "w"), indent=1)
print(json.dumps(out, indent=1), flush=True)
os._exit(0)
