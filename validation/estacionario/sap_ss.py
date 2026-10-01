"""SAP2000 por OAPI: caso Steady State del pórtico 3D (validation/pandeo/modelos.py, 4 trozos) con masa del hormigón
(23.5 kN/m3), carga armónica P (20 kN en X y 2 kN en Y arriba a la izquierda) × función constante 1, frecuencias
0.5…20 Hz (39 incrementos), amortiguamiento histerético constante dK = 0.04, dM = 0 (el ejemplo de CSiRefer cap. XXV).
→ sap_ss.json: u del nudo de control (Re, Im) en cada frecuencia.   python validation/estacionario/sap_ss.py"""
import json, os, sys
import comtypes.client
import comtypes.gen.SAP2000v1 as S
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, "..", "pandeo"))
from modelos import portico, E, NU
M = portico(4); TOP = M["nodes"].index([0, 0, 3])
M["cargas"] = {TOP: [20.0, 2.0, 0.0, 0, 0, 0]}
GAMMA = 23.5
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart(); sm = o.SapModel
sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, GAMMA)
props = {}
for f in M["frames"]:
    k = "R%gx%g" % (f[2], f[3])
    if k not in props:
        sm.PropFrame.SetRectangle(k, "C", f[3], f[2]); r = sm.PropFrame.GetSectProps(k); props[k] = dict(A=r[0], As2=r[1], As3=r[2], J=r[3], I22=r[4], I33=r[5])
for q, p in enumerate(M["nodes"]): sm.PointObj.AddCartesian(p[0], p[1], p[2], "", "N%d" % q)
for e, f in enumerate(M["frames"]):
    sm.FrameObj.AddByPoint("N%d" % f[0], "N%d" % f[1], "", "R%gx%g" % (f[2], f[3]), "F%d" % e)
    if f[4]: sm.FrameObj.SetLocalAxes("F%d" % e, f[4])
for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint("N%d" % q, [bool(x) for x in s])
sm.LoadPatterns.Add("P", 8, 0, True)
for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce("N%d" % q, "P", [float(x) for x in c], True)
print("func", sm.Func.FuncSS.SetUser("UNO", 2, [0.0, 100.0], [1.0, 1.0]))
SS = sm.LoadCases.SteadyState
print("case", SS.SetCase("SS"))
print("loads", SS.SetLoads("SS", 1, ["Load"], ["P"], ["UNO"], [1.0], [0.0], ["Global"], [0.0]))
print("freq", SS.SetFreqData("SS", 0.5, 20.0, 39, False, False, False, "MODAL", 0, [], 0, []))
print("damp", SS.SetDampConstant("SS", 0.0, 0.04))
SS.SetCase("SSA"); SS.SetLoads("SSA", 1, ["Accel"], ["U1"], ["UNO"], [1.0], [0.0], ["Global"], [0.0])
SS.SetFreqData("SSA", 0.5, 20.0, 39, False, False, False, "MODAL", 0, [], 0, []); SS.SetDampConstant("SSA", 0.0, 0.04)
ruta = os.path.join(AQUI, "sap", "ss.sdb"); os.makedirs(os.path.dirname(ruta), exist_ok=True)
sm.File.Save(ruta); print("run", sm.Analyze.RunAnalysis())
R = sm.Results; out = dict(top=TOP, props=props, gamma=GAMMA, opciones={})
for caso in ("SS", "SSA"):
  for opt in ((1, 2, 3, 4) if caso == "SS" else (1,)):
    R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(caso)
    ok = R.Setup.SetOptionSteadyState(2, opt)
    d = R.JointDispl("N%d" % TOP, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    st = list(d[4]); sn = list(d[5]); vals = [list(d[k]) for k in range(6, 12)]
    out["opciones"][str(opt) if caso == "SS" else "acel"] = dict(ok=ok, steptype=st, stepnum=sn, u=[[v[i] for v in vals] for i in range(len(st))])
    print(caso, "opción", opt, ok, len(st), flush=True)
json.dump(out, open(os.path.join(AQUI, "sap_ss.json"), "w"), indent=1)
o.ApplicationExit(False)
