# ETABS: dual 4 pisos + empuje en X con la forma del 2o modo: +100 kN en pisos 1,2 y -100 en 3,4, en el nudo de esquina (18,18,z).
import comtypes.client, comtypes.gen.ETABSv1 as S, os, json
edb = os.path.abspath("validation/modelos/plantillas/etabs_fix/edb/P6.EDB")
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper)
o = h.GetObject("CSI.ETABS.API.ETABSObject")
if o is None: o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); o.ApplicationStart()
sm = o.SapModel; print("OpenFile", sm.File.OpenFile(edb)); sm.SetPresentUnits(6); sm.SetModelIsLocked(False)
pts = [(p, *sm.PointObj.GetCoordCartesian(p)[:3]) for p in sm.PointObj.GetNameList()[1]]
zs = sorted(set(round(t[3], 3) for t in pts)); print("cotas", zs)
sm.LoadPatterns.Add("LAT2", 3); cargas = {}
for k, z in enumerate(zs[1:], 1):
    esq = max([t for t in pts if abs(t[3] - z) < 1e-6], key=lambda t: (t[1], t[2])); F = 100.0 if k <= 2 else -100.0
    print("piso", k, "z", z, "esquina", esq, "F", F, sm.PointObj.SetLoadForce(esq[0], "LAT2", [F, 0, 0, 0, 0, 0])); cargas[str(z)] = [esq[1], esq[2], esq[3], F]
sm.File.Save(os.path.abspath("validation/modelos/plantillas/etabs_fix/P6_dual_lat2.EDB")); sm.Analyze.SetRunCaseFlag("", True, True); print("run", sm.Analyze.RunAnalysis())
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("LAT2")
out = []
for p, x, y, z in pts:
    if z < 1e-6: continue
    r = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    if r[0]: out.append({"p": p, "x": x, "y": y, "z": z, "ux": r[6][0], "uy": r[7][0], "uz": r[8][0], "rz": r[11][0]})
for z in zs[1:]:
    ux = [d["ux"] for d in out if abs(d["z"] - z) < 1e-6]; print("z", z, "ux min %.4e max %.4e" % (min(ux), max(ux)))
json.dump({"cargas": cargas, "nudos": out}, open("validation/modelos/plantillas/etabs_fix/P6_dual_lat2.json", "w"), indent=1)
