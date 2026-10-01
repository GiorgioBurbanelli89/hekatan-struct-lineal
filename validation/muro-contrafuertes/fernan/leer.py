import os, comtypes.client
import comtypes.gen.SAP2000v1 as S
AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart(); sm = o.SapModel
sm.File.OpenFile(os.path.join(AQUI, "sap.sdb")); sm.SetPresentUnits(6)   # kN, m
if not sm.GetModelIsLocked(): sm.Analyze.RunAnalysis()
R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput()
cs = sm.LoadCases.GetNameList(0, [])[1]; R.Setup.SetCaseSelectedForOutput("DEAD")
for area in ("A459", "A460"):
    r = R.AreaForceShell(area, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    for a in range(r[0]):
        print(area, "punto", r[3][a], "M22 %.4f tonf·m/m" % (r[15][a] / 9.80665), "V23 %.4f tonf/m" % (r[21][a] / 9.80665))
o.ApplicationExit(False)
