# Columna vertical 1.5 m empotrada, extremo libre, solo peso propio: SAP2000 vs Struct (parser + deform + analyze). N, m.
import json, os, sys
sys.path.insert(0, "validation/modelos/privado/quispe")
from sap_conectar import sap
o, sm = sap()
sm.SetModelIsLocked(False)
sm.InitializeNewModel(10); sm.File.NewBlank()
sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", 2.5e10, 0.2, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, 24000.0)
sm.PropFrame.SetRectangle("K", "C", 0.25, 0.25)
r = sm.FrameObj.AddByCoord(0, 0, 0, 0, 0, 1.5, "", "K", "K1")
pts = sm.FrameObj.GetPoints("K1"); sm.PointObj.SetRestraint(pts[0], [True]*6)
sm.LoadPatterns.Add("D", 1, 1, True)
sm.File.Save(os.path.abspath("validation/columna_peso/col.sdb"))
sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("D", True)
print("run", sm.Analyze.RunAnalysis(), flush=True)
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("D")
j = sm.Results.JointDispl(pts[1], 0, 0, [], [], [], [], [], [], [], [], [], [], [])
f = sm.Results.FrameForce("K1", 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
out = {"uz_top": j[8][0], "sta": list(f[2]), "P": list(f[8]), "V2": list(f[9]), "M3": list(f[13])}
json.dump(out, open("validation/columna_peso/sap_col.json", "w")); print(out, flush=True)
