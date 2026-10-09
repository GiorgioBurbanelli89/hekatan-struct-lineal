# Voladizo de 4 m con punto de insercion 8 (arriba al centro): SAP2000 vs Hekatan Struct. N, m.
import comtypes.client, comtypes.gen.SAP2000v1 as S, json, os, sys
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart(Visible=True); sm = o.SapModel
sm.InitializeNewModel(10)
sm.File.NewBlank()
E_, nu = 2.5e10, 0.2
sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E_, nu, 1e-5)
sm.PropFrame.SetRectangle("R", "C", 0.5, 0.3)            # t3 = 0.5 (canto), t2 = 0.3
res = {}
for cp in (10, 8, 2):
    for f in sm.FrameObj.GetNameList()[1]: sm.FrameObj.Delete(f)
    sm.PointObj.DeleteSpecialPoint if False else None
    r = sm.FrameObj.AddByCoord(0, 0, 0, 4, 0, 0, "", "R", "B%d" % cp); nm = r[0]
    pts = sm.FrameObj.GetPoints(nm); p1, p2 = pts[0], pts[1]
    sm.PointObj.SetRestraint(p1, [True]*6)
    sm.FrameObj.SetInsertionPoint(nm, cp, False, True, [0.0]*3, [0.0]*3, "Local", 0)
    sm.LoadPatterns.Add("P%d" % cp, 8, 0, True)
    sm.PointObj.SetLoadForce(p2, "P%d" % cp, [1e5, 0, -1e5, 0, 0, 0])
    sm.File.Save(os.path.abspath("ins_%d.sdb" % cp))
    sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("P%d" % cp, True)
    print("run", cp, sm.Analyze.RunAnalysis(), flush=True)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("P%d" % cp)
    j = sm.Results.JointDispl(p2, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    res[cp] = {"u": [j[6][0], j[7][0], j[8][0]], "r": [j[9][0], j[10][0], j[11][0]]}
    print(cp, res[cp], flush=True)
    sm.SetModelIsLocked(False)
json.dump(res, open("validation/insercion/sap_res.json", "w"))
o.ApplicationExit(False)
