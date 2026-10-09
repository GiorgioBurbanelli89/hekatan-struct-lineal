# Losa Shell-Thin 4x4 m sobre 4 vigas CP8 (top center) y 4 columnas empotradas: SAP2000 vs Struct. N, m.
import json, os, sys
sys.path.insert(0, "validation/modelos/privado/quispe")
from sap_conectar import sap
o, sm = sap()
sm.SetModelIsLocked(False)
sm.InitializeNewModel(10); sm.File.NewBlank()
E_, nu = 2.5e10, 0.2
sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E_, nu, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, 0.0)
sm.PropFrame.SetRectangle("V", "C", 0.4, 0.2); sm.PropFrame.SetRectangle("K", "C", 0.25, 0.25)
sm.PropArea.SetShell_1("S", 1, True, "C", 0, 0.145, 0.145)
Lx = 4.0; H = 3.0; Q = 5000.0; n = 4; h = Lx / n
for nm, (x, y) in {"A": (0, 0), "B": (Lx, 0), "C": (Lx, Lx), "D": (0, Lx)}.items():
    r = sm.FrameObj.AddByCoord(x, y, 0, x, y, H, "", "K", "K" + nm)
    pts = sm.FrameObj.GetPoints(r[0]); sm.PointObj.SetRestraint(pts[0], [True]*6)
k = 0
for i in range(n):
    for (x0, y0, x1, y1) in ((i*h, 0, (i+1)*h, 0), (Lx, i*h, Lx, (i+1)*h), (Lx-i*h, Lx, Lx-(i+1)*h, Lx), (0, Lx-i*h, 0, Lx-(i+1)*h)):
        r = sm.FrameObj.AddByCoord(x0, y0, H, x1, y1, H, "", "V", "V%d" % k); k += 1
        sm.FrameObj.SetInsertionPoint(r[0], 8, False, True, [0.0]*3, [0.0]*3, "Local", 0)
for i in range(n):
    for j in range(n):
        nm = "L%d_%d" % (i, j)
        sm.AreaObj.AddByCoord(4, [i*h, (i+1)*h, (i+1)*h, i*h], [j*h, j*h, (j+1)*h, (j+1)*h], [H]*4, "", "S", nm)
sm.LoadPatterns.Add("Q", 3, 0, True)
for i in range(n):
    for j in range(n): sm.AreaObj.SetLoadUniform("L%d_%d" % (i, j), "Q", Q, 10, True, "Global")
sm.File.Save(os.path.abspath("validation/insercion/losa.sdb"))
sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("Q", True)
print("run", sm.Analyze.RunAnalysis(), flush=True)
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Q")
u = {}
for p in sm.PointObj.GetNameList()[1]:
    j = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    c = sm.PointObj.GetCoordCartesian(p)
    if j[0]: u["%.3f,%.3f,%.3f" % (c[0], c[1], c[2])] = [j[6][0], j[7][0], j[8][0], j[9][0], j[10][0], j[11][0]]
json.dump(u, open("validation/insercion/sap_losa.json", "w")); print(len(u), "nudos", flush=True)
