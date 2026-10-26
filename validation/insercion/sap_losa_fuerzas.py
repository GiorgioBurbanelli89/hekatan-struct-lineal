# Losa Shell-Thin 4x4 m sobre 4 vigas (CP 8 con transformacion de rigidez, o CP 10) y 4 columnas: SAP2000 -> uz centro, P, T, M3 de las vigas. N, m.
# uso (desde hekatan-struct): python validation/insercion/sap_losa_fuerzas.py 8|10
import json, os, sys
import comtypes.client, comtypes.gen.SAP2000v1 as S
def sap():
    h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
    try: o = h.GetObject("CSI.SAP2000.API.SapObject")
    except Exception: o = None
    if o is None:                               # SAP2000 no esta abierto: se arranca (tarda ~95 s y ~4.6 GB)
        o = h.CreateObject(r"C:/Program Files/Computers and Structures/SAP2000 24/SAP2000.exe"); o.ApplicationStart()
    return o, o.SapModel
cp = int(sys.argv[1]) if len(sys.argv) > 1 else 8
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
    pts = sm.FrameObj.GetPoints(r[0]); sm.PointObj.SetRestraint(pts[0], [True] * 6)
k = 0; vigas = []
for i in range(n):
    for (x0, y0, x1, y1) in ((i * h, 0, (i + 1) * h, 0), (Lx, i * h, Lx, (i + 1) * h), (Lx - i * h, Lx, Lx - (i + 1) * h, Lx), (0, Lx - i * h, 0, Lx - (i + 1) * h)):
        r = sm.FrameObj.AddByCoord(x0, y0, H, x1, y1, H, "", "V", "V%d" % k); vigas.append(r[0]); k += 1
        sm.FrameObj.SetInsertionPoint(r[0], cp, False, True, [0.0] * 3, [0.0] * 3, "Local", 0)
for i in range(n):
    for j in range(n):
        sm.AreaObj.AddByCoord(4, [i * h, (i + 1) * h, (i + 1) * h, i * h], [j * h, j * h, (j + 1) * h, (j + 1) * h], [H] * 4, "", "S", "L%d_%d" % (i, j))
sm.LoadPatterns.Add("Q", 3, 0, True)
for i in range(n):
    for j in range(n): sm.AreaObj.SetLoadUniform("L%d_%d" % (i, j), "Q", Q, 10, True, "Global")
sm.File.Save(os.path.abspath("validation/insercion/losa_cp%d.sdb" % cp))
sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("Q", True)
print("run", sm.Analyze.RunAnalysis(), flush=True)
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Q")
uz = None
for p in sm.PointObj.GetNameList()[1]:
    c = sm.PointObj.GetCoordCartesian(p)
    if abs(c[0] - 2) < 1e-6 and abs(c[1] - 2) < 1e-6 and abs(c[2] - H) < 1e-6:
        j = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], []); uz = j[8][0]
P = T = M3 = 0.0
for v in vigas:
    f = sm.Results.FrameForce(v, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
    P = max(P, max(abs(x) for x in f[8])); T = max(T, max(abs(x) for x in f[11])); M3 = max(M3, max(abs(x) for x in f[13]))
res = {"cp": cp, "uz_centro": uz, "P_max_vigas": P, "T_max_vigas": T, "M3_max_vigas": M3}
json.dump(res, open("validation/insercion/sap_losa_fuerzas_cp%d.json" % cp, "w")); print(json.dumps(res), flush=True)
