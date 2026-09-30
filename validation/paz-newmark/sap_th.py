# -*- coding: utf-8 -*-
"""Árbitro SAP2000 (OAPI) de los ejemplos de dinámica de Paz — Linear Direct Integration History, Newmark.
Mismo modelo que Struct (barras, masas en los pisos, plano XZ), unidades lb-in. Sale sap_th.json con la serie
paso a paso del GDL que grafica cada ejemplo.

    python validation/paz-newmark/sap_th.py            (SAP2000 tarda ~95 s en arrancar: no es cuelgue)
"""
import os, json, math
import comtypes.client, comtypes.gen.SAP2000v1 as S

AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
sm = o.SapModel
LBIN = 1   # eUnits.lb_in_F
res = {}


def nuevo():
    sm.InitializeNewModel(LBIN); sm.File.NewBlank(); sm.SetPresentUnits(LBIN)


def material(nombre, E, nu=0.3):
    sm.PropMaterial.SetMaterial(nombre, 1)                 # 1 = acero
    sm.PropMaterial.SetMPIsotropic(nombre, E, nu, 0.0)
    sm.PropMaterial.SetWeightAndMass(nombre, 2, 0.0)       # sin masa propia: la masa va en los pisos


def seccion(nombre, mat, A, I, J=None, As=0.0):
    # SetGeneral(Name, Mat, t3, t2, Area, As2, As3, Torsion, I22, I33, S22, S33, Z22, Z33, R22, R33)
    # As = 0 → SAP2000 NO cuenta la deformación por cortante (Euler), como el libro.
    sm.PropFrame.SetGeneral(nombre, mat, 10, 10, A, As, As, J if J else 2 * I, I, I, 1, 1, 1, 1, 1, 1)


def nudo(x, y, z):
    r = sm.PointObj.AddCartesian(x, y, z, "", "", "Global", True); return r[0]


def barra(a, b, sec):
    r = sm.FrameObj.AddByPoint(a, b, "", sec, ""); return r[0]


def plano_xz(p):
    sm.PointObj.SetRestraint(p, [False, True, False, True, False, True])


def empotrar(p):
    sm.PointObj.SetRestraint(p, [True] * 6)


def funcion(nombre, tv):
    t = [a for a, _ in tv]; v = [b for _, b in tv]
    sm.Func.FuncTH.SetUser(nombre, len(t), t, v)


def caso_th(nombre, patrones, dt, n, beta=0.25, gamma=0.5, a0=0.0, a1=0.0):
    sm.LoadCases.DirHistLinear.SetCase(nombre)
    k = len(patrones)
    sm.LoadCases.DirHistLinear.SetLoads(nombre, k, ["Load"] * k, [p for p, _ in patrones], [f for _, f in patrones],
                                        [1.0] * k, [1.0] * k, [0.0] * k, ["Global"] * k, [0.0] * k)
    sm.LoadCases.DirHistLinear.SetTimeStep(nombre, n, dt)
    sm.LoadCases.DirHistLinear.SetTimeIntegration(nombre, 1, 0.0, beta, gamma, 0.0, 0.0)   # 1 = Newmark
    sm.LoadCases.DirHistLinear.SetDampProportional(nombre, 1, a0, a1, 0, 0, 0, 0)          # 1 = coeficientes a0·M + a1·K


def correr_y_leer(caso, nudos, gdl):
    sm.File.Save(os.path.join(AQUI, "sap", f"{caso}.sdb"))
    sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag(caso, True, False)
    assert sm.Analyze.RunAnalysis() == 0
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(caso)
    sm.Results.Setup.SetOptionDirectHist(2)   # paso a paso
    out = {}
    for etiqueta, p in nudos.items():
        r = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        t = list(r[5]); u = list(r[6 + gdl])
        out[etiqueta] = {"t": t, "u": u, "max": max(abs(x) for x in u)}
    return out


os.makedirs(os.path.join(AQUI, "sap"), exist_ok=True)
E = 30e6

# ── 4.1: pórtico de 1 piso, H = 180, luz 240, 2 columnas I = 69.2, W = 5000 lb, pulso 3000 lb × 0.1 s ──
nuevo(); material("ACERO", E); seccion("COL", "ACERO", 1e4, 69.2); seccion("VIGA", "ACERO", 1e4, 69.2 * 1e5)
b1, b2, t1, t2 = nudo(0, 0, 0), nudo(240, 0, 0), nudo(0, 0, 180), nudo(240, 0, 180)
for p in (b1, b2): empotrar(p)
for p in (t1, t2): plano_xz(p); sm.PointObj.SetMass(p, [5000 / 386.088 / 2] * 3 + [0, 0, 0])
barra(b1, t1, "COL"); barra(b2, t2, "COL"); barra(t1, t2, "VIGA")
sm.LoadPatterns.Add("P", 8); sm.PointObj.SetLoadForce(t1, "P", [3000, 0, 0, 0, 0, 0])
dt = 0.001; funcion("PULSO", [(0, 1), (0.1, 1), (0.1 + dt, 0), (1.0, 0)])
caso_th("TH41", [("P", "PULSO")], dt, 1000)
res["4-1"] = correr_y_leer("TH41", {"u": t1}, 0)

# ── 6.1: 1 GDL (el del libro y del ejemplo): nudo con muelle k = 100 000 lb/in y masa 100 lb·s²/in en UX,
#    ξ = 0.2, trapecio 120 kip, β = 1/6, Δt = 0.005. Como pórtico 3D, sus modos rígidos (axial, viga) hacen
#    diverger la aceleración lineal (condicionalmente estable): SAP daba 1e19.
nuevo()
p61 = nudo(0, 0, 0); sm.PointObj.SetRestraint(p61, [False, True, True, True, True, True])
sm.PointObj.SetSpring(p61, [100000.0, 0, 0, 0, 0, 0]); sm.PointObj.SetMass(p61, [100.0, 0, 0, 0, 0, 0])
sm.LoadPatterns.Add("P", 8); sm.PointObj.SetLoadForce(p61, "P", [120000, 0, 0, 0, 0, 0])
funcion("TRAP", [(0, 0), (0.02, 1), (0.04, 1), (0.06, 0), (0.5, 0)])
w61 = math.sqrt(100000 / 100)
caso_th("TH61", [("P", "TRAP")], 0.005, 100, beta=1 / 6, a0=2 * 0.2 * w61)   # C = 2ξω·M = c exacto en 1 GDL
res["6-1"] = correr_y_leer("TH61", {"u": p61}, 0)

# ── 8.1: 2 pisos, W10x45 I = 248.6 (H 180), W10x21 I = 106.3 (H 120), pulsos triangulares 10 / 20 kip ──
nuevo(); material("ACERO", E)
seccion("C1", "ACERO", 1e4, 248.6); seccion("C2", "ACERO", 1e4, 106.3); seccion("V", "ACERO", 1e4, 248.6 * 1e5)
b1, b2 = nudo(0, 0, 0), nudo(360, 0, 0); p1, p2 = nudo(0, 0, 180), nudo(360, 0, 180); q1, q2 = nudo(0, 0, 300), nudo(360, 0, 300)
for p in (b1, b2): empotrar(p)
for p in (p1, p2): plano_xz(p); sm.PointObj.SetMass(p, [52500 / 386.088 / 2] * 3 + [0, 0, 0])
for p in (q1, q2): plano_xz(p); sm.PointObj.SetMass(p, [25500 / 386.088 / 2] * 3 + [0, 0, 0])
barra(b1, p1, "C1"); barra(b2, p2, "C1"); barra(p1, p2, "V"); barra(p1, q1, "C2"); barra(p2, q2, "C2"); barra(q1, q2, "V")
sm.LoadPatterns.Add("P1", 8); sm.PointObj.SetLoadForce(p1, "P1", [10000, 0, 0, 0, 0, 0])
sm.LoadPatterns.Add("P2", 8); sm.PointObj.SetLoadForce(q1, "P2", [20000, 0, 0, 0, 0, 0])
funcion("TRI", [(0, 1), (0.1, 0), (1.0, 0)])
caso_th("TH81", [("P1", "TRI"), ("P2", "TRI")], 0.002, 500)
res["8-1"] = correr_y_leer("TH81", {"u1": p1, "u2": q1}, 0)

# ── 10.7: viga biempotrada L = 200, E = 6.58e6, I = 100, m̄ = 0.1 → SAP concentra la masa (no hay consistente):
#    4 elementos (la malla del libro) y 40 (convergida) ──
for ne in (4, 40):
    nuevo(); material("M107", 6.58e6); sm.PropMaterial.SetWeightAndMass("M107", 2, 0.1 / 10.0)   # m̄ = ρ·A, A = 10
    seccion("VIGA", "M107", 10.0, 100.0)
    ps = [nudo(200 * i / ne, 0, 0) for i in range(ne + 1)]
    empotrar(ps[0]); empotrar(ps[-1])
    for p in ps[1:-1]: sm.PointObj.SetRestraint(p, [True, True, False, True, False, True])
    for i in range(ne): barra(ps[i], ps[i + 1], "VIGA")
    sm.LoadPatterns.Add("P", 8); sm.PointObj.SetLoadForce(ps[ne // 2], "P", [0, 0, 10000, 0, 0, 0])
    funcion("F107", [(0, 1), (0.1, 1), (0.2, 0), (0.5, 0)])
    caso_th(f"TH107_{ne}", [("P", "F107")], 0.001, 500)
    res[f"10-7_{ne}"] = correr_y_leer(f"TH107_{ne}", {"u": ps[ne // 2]}, 2)

json.dump(res, open(os.path.join(AQUI, "sap_th.json"), "w"), indent=0)
for k, v in res.items():
    print(k, {e: round(d["max"], 6) for e, d in v.items()})
o.ApplicationExit(False)
