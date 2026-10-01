# SAP2000 Section Cut por grupo (nudos de z > 0.25 + áreas que los tocan) en sap_muro4.sdb, caso DEAD, Tonf-m.
import json, os, comtypes.client
import comtypes.gen.SAP2000v1 as S
AQ = os.path.dirname(os.path.abspath(__file__)); D = json.load(open(os.path.join(AQ, "muro4.json")))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
sm = h.GetObject("CSI.SAP2000.API.SapObject").SapModel
print("abrir", sm.File.OpenFile(os.path.join(AQ, "sap_muro4.sdb")))
sm.SetModelIsLocked(False); sm.SetPresentUnits(12)
sm.GroupDef.SetGroup("CORTE")
arriba = {i for i, p in enumerate(D["nodes"]) if p[2] > 0.25}
for i in arriba: sm.PointObj.SetGroupAssign("N%d" % i, "CORTE")
na = 0
for k, e in enumerate(D["elements"]):
    if len(e) == 4 and any(n in arriba for n in e): sm.AreaObj.SetGroupAssign("A%d" % k, "CORTE"); na += 1
print("nudos", len(arriba), "areas", na)
print("corte", sm.SectCut.SetByGroup("SC1", "CORTE", 1))
print("run", sm.Analyze.RunAnalysis())
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("DEAD")
r = sm.Results.SectionCutAnalysis(0, [], [], [], [], [], [], [], [], [], [], [])
print("SAP2000 Section Cut:", [x if not isinstance(x, tuple) else [round(v, 4) if isinstance(v, float) else v for v in x] for x in r])
sm.File.Save(os.path.join(AQ, "sap_muro4.sdb"))
