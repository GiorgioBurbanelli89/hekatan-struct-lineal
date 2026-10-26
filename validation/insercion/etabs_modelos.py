# Los 10 modelos del estudio de la torsion en ETABS 22: tres situaciones por modelo.
#   1  Centroid (10)                       -> sin desfase
#   2  Top Center (8) + casilla MARCADA    -> valor por defecto: solo se dibuja
#   3  Top Center (8) + casilla DESMARCADA -> barra rigida (K' = R^T K R)
# uso (desde hekatan-struct):  python validation/insercion/etabs_modelos.py   -> validation/insercion/etabs_modelos.json (kN, m)
import json, os, sys
import comtypes.client
comtypes.client.CreateObject("ETABSv1.Helper")
import comtypes.gen.ETABSv1 as E
LP = {"G": 8.0}
HH = {"F": 6.0}
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart()
sm = o.SapModel
res = json.load(open("validation/insercion/etabs_modelos.json")) if os.path.exists("validation/insercion/etabs_modelos.json") else {}
ids = sys.argv[1:] or list("ABCDEFGHIJ")
for mid in ids:
    lp = LP.get(mid, 4.0); H = HH.get(mid, 3.0)
    sm.InitializeNewModel(6)
    src = os.path.abspath("validation/insercion/etabs/modelos/m_%s.e2k" % mid)
    print(mid, "abrir", sm.File.OpenFile(src), flush=True)
    sm.SetPresentUnits(6)
    sm.File.Save(os.path.abspath("validation/insercion/etabs/modelos/m_%s.EDB" % mid))
    frames = list(sm.FrameObj.GetNameList(0, [])[1])
    for nm in frames: sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
    for nm in sm.AreaObj.GetNameList(0, [])[1]: sm.AreaObj.SetEdgeConstraint(nm, False, 0)
    def z(f):
        pts = sm.FrameObj.GetPoints(f); return [sm.PointObj.GetCoordCartesian(p)[2] for p in pts[:2]]
    vigas = [f for f in frames if all(abs(c - H) < 1e-6 for c in z(f))]
    mid_pt = None
    for p in sm.PointObj.GetNameList(0, [])[1]:
        c = sm.PointObj.GetCoordCartesian(p)
        if abs(c[0] - lp / 2) < 1e-6 and abs(c[1]) < 1e-6 and abs(c[2] - H) < 1e-6: mid_pt = p
    casos = {"1_centroid": (10, False), "2_top_marcada": (8, False), "3_top_desmarcada": (8, True)}
    res[mid] = {}
    for nombre, (card, transf) in casos.items():
        sm.SetModelIsLocked(False)
        for f in vigas:
            r = sm.FrameObj.GetInsertionPoint_1(f)
            sm.FrameObj.SetInsertionPoint_1(f, card, r[1], r[2], bool(transf), list(r[4]), list(r[5]), r[6])
        sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("Dead", True)
        ok = sm.Analyze.RunAnalysis()
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Dead")
        rmid = sm.Results.JointDispl(mid_pt, 0, 0, [], [], [], [], [], [], [], [], [], [], [])[9][0] if mid_pt else None
        P = T = M3 = 0.0
        for v in vigas:
            f = sm.Results.FrameForce(v, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
            P = max(P, max(abs(x) for x in f[8])); T = max(T, max(abs(x) for x in f[11])); M3 = max(M3, max(abs(x) for x in f[13]))
        res[mid][nombre] = {"run": ok, "T": T, "N": P, "M3": M3, "rx_mitad": rmid}
        print(mid, nombre, json.dumps(res[mid][nombre]), flush=True)
    json.dump(res, open("validation/insercion/etabs_modelos.json", "w"), indent=1)
try: o.ApplicationExit(False)
except Exception: pass
