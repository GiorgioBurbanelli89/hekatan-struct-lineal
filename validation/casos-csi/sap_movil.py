"""SAP2000 (juez): Load Case «Moving Load» (líneas de influencia) sobre la viga de modelo.py.
   Casos: MLC = solo ejes fijos (CAM0), MLF = ejes fijos + carril (HL93F), MLV = separación trasera variable (HL93V).
   python validation/casos-csi/sap_movil.py > log 2>&1  -> sap_movil.json"""
from sap_comun import *
o, sm = conectar()
props = armar_viga(sm)
carril(sm)
vehiculos(sm, [CAM0, HL93F, HL93V, UNI])
aplicar(sm)
casos = {"MLC": CAM0, "MLF": HL93F, "MLV": HL93V, "MLU": UNI}
for c in casos: sm.LoadCases.Moving.SetCase(c)
# cada vehículo crea su clase con su mismo nombre
tabla(sm, "Case - Moving Load 1 - Lane Assignments", ["Case", "AssignNum", "VehClass", "ScaleFactor", "MinLoaded", "MaxLoaded"],
      [[c, 1, V["nombre"], 1, 1, 1] for c, V in casos.items()])
tabla(sm, "Case - Moving Load 2 - Lanes Loaded", ["Case", "AssignNum", "Lane"], [[c, 1, "L1"] for c in casos])
aplicar(sm)
ruta = os.path.join(AQUI, "sap", "movil.sdb"); os.makedirs(os.path.dirname(ruta), exist_ok=True)
sm.File.Save(ruta)
for c in ["DEAD", "MODAL"]: sm.Analyze.SetRunCaseFlag(c, False)
print("run", sm.Analyze.RunAnalysis(), flush=True)
out = dict(props=props, modelo=dict(E=E, NU=NU, nodes=NODES, frames=FRAMES, apoyos=APOYOS, vehiculos=casos), casos={})
R = sm.Results
for c in casos:
    R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(c)
    o2 = dict(disp={}, reac={}, frame={})
    for q in range(len(NODES)):
        d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        o2["disp"][q] = dict(tipo=list(d[4]), v=[list(d[k]) for k in range(6, 12)])
    for q in APOYOS:
        d = R.JointReact("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        o2["reac"][q] = dict(tipo=list(d[4]), v=[list(d[k]) for k in range(6, 12)])
    for e in range(len(FRAMES)):
        d = R.FrameForce("F%d" % e, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
        o2["frame"][e] = dict(sta=list(d[2]), tipo=list(d[6]), P=list(d[8]), V2=list(d[9]), M3=list(d[13]))
    out["casos"][c] = o2
    print(c, "Uz nudo 10", o2["disp"][10]["tipo"], [round(x, 6) for x in o2["disp"][10]["v"][2]], "M3 F9", o2["frame"][9]["sta"], [round(x, 3) for x in o2["frame"][9]["M3"]], flush=True)
json.dump(out, open(os.path.join(AQUI, "sap_movil.json"), "w"))
