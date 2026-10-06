"""SAP2000 (juez): caso Hyperstatic (estructura SIN apoyos cargada con las reacciones del caso lineal base) sobre la viga de
modelo.py; caso base PT = cargas equivalentes del tendón (autoequilibradas).  -> sap_hiperestatico.json"""
from sap_comun import *
o, sm = conectar()
props = armar_viga(sm)
sm.LoadPatterns.Add("PT", 8, 0, True)
P = PT["P"]; nodal = {}
def suma(q, c):
    v = nodal.setdefault(q, [0.0] * 6)
    for k in range(6): v[k] += c[k]
wv = []
for v in range(NV):
    e = PT["e"][v]; w = 8 * P * e / LV ** 2; wv.append(w)
    i0 = int(round(v * LV / DX)); i1 = int(round((v + 1) * LV / DX))
    for el in range(i0, i1): sm.FrameObj.SetLoadDistributed("F%d" % el, "PT", 1, 6, 0, 1, w, w, "Global", True, True)
    suma(i0, [0, 0, -w * LV / 2, 0, 0, 0]); suma(i1, [0, 0, -w * LV / 2, 0, 0, 0])
suma(0, [P, 0, 0, 0, 0, 0]); suma(N, [-P, 0, 0, 0, 0, 0])
for q, c in nodal.items(): sm.PointObj.SetLoadForce("N%d" % q, "PT", c, True)
sm.LoadCases.StaticLinear.SetCase("PT"); sm.LoadCases.StaticLinear.SetLoads("PT", 1, ["Load"], ["PT"], [1.0])
print("hyp", sm.LoadCases.HyperStatic.SetCase("HYP"), sm.LoadCases.HyperStatic.SetBaseCase("HYP", "PT"), flush=True)
ruta = os.path.join(AQUI, "sap", "hiperestatico.sdb"); os.makedirs(os.path.dirname(ruta), exist_ok=True)
sm.File.Save(ruta)
for c in ["DEAD", "MODAL"]: sm.Analyze.SetRunCaseFlag(c, False)
print("run", sm.Analyze.RunAnalysis(), flush=True)
out = dict(props=props, modelo=dict(E=E, NU=NU, nodes=NODES, frames=FRAMES, apoyos=APOYOS, pt=PT, w=wv, nodal=nodal), casos={})
R = sm.Results
for c in ["PT", "HYP"]:
    R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(c)
    o2 = dict(disp={}, reac={}, frame={})
    for q in range(len(NODES)):
        d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        o2["disp"][q] = [d[k][0] if len(d[k]) else 0.0 for k in range(6, 12)]
    for q in APOYOS:
        d = R.JointReact("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        o2["reac"][q] = [d[k][0] if len(d[k]) else 0.0 for k in range(6, 12)]
    for e in range(len(FRAMES)):
        d = R.FrameForce("F%d" % e, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
        o2["frame"][e] = dict(sta=list(d[2]), P=list(d[8]), V2=list(d[9]), M3=list(d[13]))
    out["casos"][c] = o2
    print(c, "reac", {q: [round(x, 4) for x in v] for q, v in o2["reac"].items()}, flush=True)
    print(c, "M3 F19", [round(x, 4) for x in o2["frame"][19]["M3"]], "Uz10", o2["disp"][10][2], flush=True)
json.dump(out, open(os.path.join(AQUI, "sap_hiperestatico.json"), "w"))
