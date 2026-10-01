"""SAP2000 por OAPI: caso Buckling de cada modelo de modelos.py -> sap_pandeo.json (factores + propiedades de sección).
    python validation/pandeo/sap_pandeo.py"""
import json, os, sys, time
import comtypes.client
sys.path.insert(0, os.path.dirname(__file__))
from modelos import MODELOS, E, NU
import comtypes.gen.SAP2000v1 as S
AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart(); sm = o.SapModel
SOLO = sys.argv[1:]
RUTA = os.path.join(AQUI, "sap_pandeo.json")
out = json.load(open(RUTA)) if os.path.exists(RUTA) else {}
for M in MODELOS:
    if SOLO and M["nombre"] not in SOLO: continue
    sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, 0.0)
    secs, props = {}, {}
    for f in M["frames"]:
        k = "R%gx%g" % (f[2], f[3])
        if k not in secs:
            sm.PropFrame.SetRectangle(k, "C", f[3], f[2]); secs[k] = 1   # t3 = canto (plano 1-2), t2 = ancho
            r = sm.PropFrame.GetSectProps(k); props[k] = dict(A=r[0], As2=r[1], As3=r[2], J=r[3], I22=r[4], I33=r[5])
    for q, p in enumerate(M["nodes"]): sm.PointObj.AddCartesian(p[0], p[1], p[2], "", "N%d" % q)
    for e, f in enumerate(M["frames"]):
        sm.FrameObj.AddByPoint("N%d" % f[0], "N%d" % f[1], "", "R%gx%g" % (f[2], f[3]), "F%d" % e)
        if f[4]: sm.FrameObj.SetLocalAxes("F%d" % e, f[4])
    for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint("N%d" % q, [bool(x) for x in s])
    sm.LoadPatterns.Add("P", 8, 0, True)
    for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce("N%d" % q, "P", [float(x) for x in c], True)
    sm.LoadCases.Buckling.SetCase("BUCK"); sm.LoadCases.Buckling.SetLoads("BUCK", 1, ["Load"], ["P"], [1.0])
    sm.LoadCases.Buckling.SetParameters("BUCK", 6, 1e-12)
    ruta = os.path.join(AQUI, "sap", M["nombre"] + ".sdb"); os.makedirs(os.path.dirname(ruta), exist_ok=True)
    sm.File.Save(ruta); sm.Analyze.RunAnalysis()
    R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("BUCK")
    r = R.BucklingFactor(0, [], [], [], [])
    fac = list(r[4])
    # modo 1: desplazamientos de los nudos
    R.Setup.SetOptionModeShape(1, 1, True) if hasattr(R.Setup, "SetOptionModeShape") else None
    disp = {}
    for q in (range(len(M["nodes"])) if len(M["nodes"]) < 60 else []):
        d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        st = list(d[4]); vals = [list(d[k]) for k in range(6, 12)]
        if st: disp[q] = [[v[s] for v in vals] for s in range(len(st))]
    out[M["nombre"]] = dict(factores=fac, props=props, modos=disp)
    print(M["nombre"], fac, flush=True)
json.dump(out, open(RUTA, "w"), indent=1)
o.ApplicationExit(False)
