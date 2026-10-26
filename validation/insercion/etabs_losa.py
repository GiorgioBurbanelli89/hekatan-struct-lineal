# Losa Shell-Thin 4x4 m sobre 4 vigas y 4 columnas en ETABS 22 (e2k de Struct, malla NOAUTOMESH), tres casos:
#   A  Top Center (8) + casilla DESMARCADA (transforma la rigidez = barra rigida)
#   B  Centroid (10)
#   C  Top Center (8) + casilla MARCADA (no transforma): debe dar lo mismo que B
# uso (desde hekatan-struct): python validation/insercion/etabs_losa.py   -> validation/insercion/etabs_losa.json (N, m)
import json, os, sys
import comtypes.client
comtypes.client.CreateObject("ETABSv1.Helper")
import comtypes.gen.ETABSv1 as E
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart()
sm = o.SapModel
sm.InitializeNewModel(6)                                    # kN, m
src = os.path.abspath("validation/insercion/etabs/losa.e2k")
print("abrir", sm.File.OpenFile(src), flush=True)
sm.SetPresentUnits(6)
print("guardar", sm.File.Save(os.path.abspath("validation/insercion/etabs/losa.EDB")), flush=True)   # ETABS no analiza sin guardar
frames = list(sm.FrameObj.GetNameList(0, [])[1])
for nm in frames: sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)      # sin brazos automaticos (regla de la casa)
for nm in sm.AreaObj.GetNameList(0, [])[1]: sm.AreaObj.SetEdgeConstraint(nm, False, 0)   # sin edge constraint (como SAP2000/Struct)
# vigas = las horizontales (z de los dos extremos = 3 m)
def z(f):
    pts = sm.FrameObj.GetPoints(f); return [sm.PointObj.GetCoordCartesian(p)[2] for p in pts[:2]]
vigas = [f for f in frames if all(abs(c - 3.0) < 1e-6 for c in z(f))]
print("vigas", len(vigas), "de", len(frames), flush=True)
casos = {"A_top_desmarcada": (8, True), "B_centroid": (10, False), "C_top_marcada": (8, False)}
res = {}
for nombre, (card, transf) in casos.items():
    sm.SetModelIsLocked(False)
    for f in vigas:
        r = sm.FrameObj.GetInsertionPoint_1(f)
        sm.FrameObj.SetInsertionPoint_1(f, card, r[1], r[2], bool(transf), list(r[4]), list(r[5]), r[6])
    sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("Dead", True)
    print(nombre, "run", sm.Analyze.RunAnalysis(), flush=True)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Dead")
    uz = None
    for p in sm.PointObj.GetNameList(0, [])[1]:
        c = sm.PointObj.GetCoordCartesian(p)
        if abs(c[0] - 2) < 1e-6 and abs(c[1] - 2) < 1e-6 and abs(c[2] - 3.0) < 1e-6:
            uz = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], [])[8][0] / 1.0
    P = T = M3 = 0.0
    for v in vigas:
        f = sm.Results.FrameForce(v, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
        P = max(P, max(abs(x) for x in f[8])); T = max(T, max(abs(x) for x in f[11])); M3 = max(M3, max(abs(x) for x in f[13]))
    res[nombre] = {"uz_centro": uz, "P_max_vigas": P * 1000, "T_max_vigas": T * 1000, "M3_max_vigas": M3 * 1000}    # kN -> N
    print(nombre, json.dumps(res[nombre]), flush=True)
json.dump(res, open("validation/insercion/etabs_losa.json", "w"), indent=1)
try: o.ApplicationExit(False)
except Exception: pass
