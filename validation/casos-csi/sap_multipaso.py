"""SAP2000 (juez): caso Multi-step Static con un patrón Vehicle Live (camión de 3 ejes por el carril L1) + SC en todos los pasos.
   python validation/casos-csi/sap_multipaso.py > log 2>&1   -> sap_multipaso.json"""
from sap_comun import *
o, sm = conectar()
props = armar_viga(sm)
carril(sm)
vehiculo(sm, CAMION["nombre"], CAMION["ejes"], CAMION["sep"])
tabla(sm, "Load Pattern Definitions", ["LoadPat", "DesignType", "SelfWtMult"], [["DEAD", "Dead", 1], ["SC", "Other", 0], ["VL", "Vehicle Live", 0]])
M = MULTI
tabla(sm, "Multi-Step Moving Load 1 - General", ["LoadPat", "LoadDur", "LoadDisc"], [["VL", M["dur"], M["dt"]]])
tabla(sm, "Multi-Step Moving Load 2 - Vehicle Data", ["LoadPat", "Vehicle", "Lane", "Station", "StartTime", "Direction", "Speed"],
      [["VL", CAMION["nombre"], "L1", M["estacion"], M["t0"], "Forward", M["v"]]])
aplicar(sm)
sm.LoadCases.StaticLinearMultistep.SetCase("MS")
r = sm.LoadCases.StaticLinearMultistep.SetLoads("MS", 2, ["Load", "Load"], ["VL", "SC"], [M["sf_vl"], M["sf_sc"]])
print("SetLoads", r, flush=True)
ruta = os.path.join(AQUI, "sap", "multipaso.sdb"); os.makedirs(os.path.dirname(ruta), exist_ok=True)
sm.File.Save(ruta)
for c in ["DEAD", "MODAL"]: sm.Analyze.SetRunCaseFlag(c, False)
print("run", sm.Analyze.RunAnalysis(), flush=True)
R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("MS")
R.Setup.SetOptionMultiStepStatic(2)   # 2 = step-by-step
out = dict(props=props, modelo=dict(E=E, NU=NU, nodes=NODES, frames=FRAMES, apoyos=APOYOS, SC=SC, camion=CAMION, multi=MULTI), disp={}, reac={}, frame={})
for q in range(len(NODES)):
    d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    out["disp"][q] = dict(step=list(d[5]), v=[list(d[k]) for k in range(6, 12)])
for q in APOYOS:
    d = R.JointReact("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    out["reac"][q] = dict(step=list(d[5]), v=[list(d[k]) for k in range(6, 12)])
for e in range(len(FRAMES)):
    d = R.FrameForce("F%d" % e, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
    out["frame"][e] = dict(sta=list(d[2]), step=list(d[7]), P=list(d[8]), V2=list(d[9]), V3=list(d[10]), T=list(d[11]), M2=list(d[12]), M3=list(d[13]))
json.dump(out, open(os.path.join(AQUI, "sap_multipaso.json"), "w"))
print("pasos:", len(out["disp"][0]["step"]), out["disp"][0]["step"][:5], out["disp"][0]["step"][-3:], flush=True)
print("Uz nudo 10:", [round(x, 6) for x in out["disp"][10]["v"][2][:12]], flush=True)
