import json, os, sys
sys.path.insert(0, "validation/modelos/privado/quispe")
from sap_conectar import sap
o, sm = sap()
sm.SetModelIsLocked(False)
res = {}
for cp in (8, 10):
    print("abre", sm.File.OpenFile(os.path.abspath("ins_%d.sdb" % cp)), flush=True)
    sm.File.Save(os.path.abspath("validation/insercion/ins_w.sdb"))
    sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("P%d" % cp, True)
    print("run", sm.Analyze.RunAnalysis(), flush=True)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("P%d" % cp)
    f = sm.FrameObj.GetNameList()[1][0]
    r = sm.Results.FrameForce(f, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
    res[cp] = {k: list(r[i]) for k, i in (("sta", 2), ("P", 8), ("V2", 9), ("V3", 10), ("T", 11), ("M2", 12), ("M3", 13))}
    print(cp, res[cp], flush=True)
json.dump(res, open("validation/insercion/sap_fuerzas.json", "w"))
