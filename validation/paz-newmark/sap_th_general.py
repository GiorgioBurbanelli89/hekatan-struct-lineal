# -*- coding: utf-8 -*-
"""Árbitro SAP2000 del tiempo-historia GENERAL de Struct (timeHistoryAnalysis), pórtico del Paz 8.1 en lb-in:
  81M   modal (ModHistLinear), pulsos triangulares del 8.1, ξ = 0
  81AD  directa (DirHistLinear, Newmark), aceleración en la base U1, Rayleigh cM/cK
  81AM  modal, aceleración en la base U1, ξ = 5 % constante
Sale sap_th_general.json: u1 (piso 1) y u2 (piso 2) relativos y la reacción en la base FX, paso a paso.
    python -u validation/paz-newmark/sap_th_general.py > log 2>&1      (nunca «| tail»: SAP hereda la tubería)"""
import os, json, math
import comtypes.client, comtypes.gen.SAP2000v1 as S

AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart(); sm = o.SapModel
sm.InitializeNewModel(1); sm.File.NewBlank(); sm.SetPresentUnits(1)
E = 30e6
sm.PropMaterial.SetMaterial("ACERO", 1); sm.PropMaterial.SetMPIsotropic("ACERO", E, 0.3, 0.0); sm.PropMaterial.SetWeightAndMass("ACERO", 2, 0.0)
for nom, I in (("C1", 248.6), ("C2", 106.3), ("V", 248.6e5)):
    sm.PropFrame.SetGeneral(nom, "ACERO", 10, 10, 1e4, 0, 0, 2 * I, I, I, 1, 1, 1, 1, 1, 1)
P = lambda x, z: sm.PointObj.AddCartesian(x, 0, z, "", "", "Global", True)[0]
b1, b2, p1, p2, q1, q2 = P(0, 0), P(360, 0), P(0, 180), P(360, 180), P(0, 300), P(360, 300)
for p in (b1, b2): sm.PointObj.SetRestraint(p, [True] * 6)
for p in (p1, p2, q1, q2): sm.PointObj.SetRestraint(p, [False, True, False, True, False, True])
for p in (p1, p2): sm.PointObj.SetMass(p, [52500 / 386.088 / 2] * 3 + [0, 0, 0])
for p in (q1, q2): sm.PointObj.SetMass(p, [25500 / 386.088 / 2] * 3 + [0, 0, 0])
for a, b, s in ((b1, p1, "C1"), (b2, p2, "C1"), (p1, p2, "V"), (p1, q1, "C2"), (p2, q2, "C2"), (q1, q2, "V")):
    sm.FrameObj.AddByPoint(a, b, "", s, "")
sm.LoadPatterns.Add("P1", 8); sm.PointObj.SetLoadForce(p1, "P1", [10000, 0, 0, 0, 0, 0])
sm.LoadPatterns.Add("P2", 8); sm.PointObj.SetLoadForce(q1, "P2", [20000, 0, 0, 0, 0, 0])
sm.Func.FuncTH.SetUser("TRI", 3, [0, 0.1, 1.0], [1, 0, 0])
# aceleración en la base: suma de senos muestreada cada 0.01 s (0.3 g pico aprox.), la MISMA en el test de Struct
ts = [round(0.01 * i, 4) for i in range(401)]
ag = [115.8 * (0.6 * math.sin(2 * math.pi * 1.7 * t) + 0.4 * math.sin(2 * math.pi * 5.3 * t + 0.4)) * math.exp(-0.5 * t) for t in ts]
sm.Func.FuncTH.SetUser("SISMO", len(ts), ts, ag)
json.dump({"t": ts, "a": ag}, open(os.path.join(AQUI, "sismo_sintetico.json"), "w"))
w1, w2 = 11.82654864, 32.89634164; xi = 0.05
cM = 2 * xi * w1 * w2 / (w1 + w2); cK = 2 * xi / (w1 + w2)                       # Rayleigh con ξ = 5 % en ω1 y ω2

def modal_case(nom, cargas, dt, n, xi_):
    c = sm.LoadCases.ModHistLinear
    c.SetCase(nom); c.SetModalCase(nom, "MODAL")
    k = len(cargas)
    c.SetLoads(nom, k, [t for t, _, _ in cargas], [l for _, l, _ in cargas], [f for _, _, f in cargas], [1.0] * k, [1.0] * k, [0.0] * k, ["Global"] * k, [0.0] * k)
    c.SetTimeStep(nom, n, dt); c.SetDampConstant(nom, xi_)

def dir_case(nom, cargas, dt, n, a0, a1):
    c = sm.LoadCases.DirHistLinear
    c.SetCase(nom); k = len(cargas)
    c.SetLoads(nom, k, [t for t, _, _ in cargas], [l for _, l, _ in cargas], [f for _, _, f in cargas], [1.0] * k, [1.0] * k, [0.0] * k, ["Global"] * k, [0.0] * k)
    c.SetTimeStep(nom, n, dt); c.SetTimeIntegration(nom, 1, 0.0, 0.25, 0.5, 0.0, 0.0); c.SetDampProportional(nom, 1, a0, a1, 0, 0, 0, 0)

modal_case("TH81M", [("Load", "P1", "TRI"), ("Load", "P2", "TRI")], 0.002, 500, 0.0)
dir_case("TH81AD", [("Accel", "U1", "SISMO")], 0.01, 400, cM, cK)
modal_case("TH81AM", [("Accel", "U1", "SISMO")], 0.01, 400, xi)
os.makedirs(os.path.join(AQUI, "sap"), exist_ok=True)
sm.File.Save(os.path.join(AQUI, "sap", "TH81_general.sdb"))
sm.Analyze.SetRunCaseFlag("", True, True); assert sm.Analyze.RunAnalysis() == 0
res = {"cM": cM, "cK": cK}
for caso in ("TH81M", "TH81AD", "TH81AM"):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(caso)
    sm.Results.Setup.SetOptionDirectHist(2); sm.Results.Setup.SetOptionModalHist(2)
    d = {}
    for et, p in (("u1", p1), ("u2", q1)):
        r = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        d[et] = {"t": list(r[5]), "u": list(r[6])}
    r = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0, 0, 0)
    d["baseFX"] = list(r[4]); d["modos"] = None
    res[caso] = d
    print(caso, "u1 max", max(abs(x) for x in d["u1"]["u"]), "u2 max", max(abs(x) for x in d["u2"]["u"]), "FX max", max(abs(x) for x in d["baseFX"]))
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("MODAL")
r = sm.Results.ModalPeriod(0, [], [], [], [], [], [], [])
res["periodos"] = list(r[4]); print("periodos", res["periodos"][:6])
json.dump(res, open(os.path.join(AQUI, "sap_th_general.json"), "w"), indent=0)
o.ApplicationExit(False)
