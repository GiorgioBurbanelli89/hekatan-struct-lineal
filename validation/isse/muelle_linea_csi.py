# -*- coding: utf-8 -*-
"""
Como aplica CSI el MUELLE DE LINEA (viga de cimentacion sobre Winkler): medido.

    python validation/isse/muelle_linea_csi.py sap|etabs salida.json

La misma viga dos veces:
  (a) muelle de LINEA k (kN/m por m) asignado a los tramos (Line Spring, local 3 / vertical)
  (b) muelles NODALES k * L_tributaria (extremos L/2), lo que hace Hekatan con `spring`
Viga 6 m en 12 tramos de 0.5 m, 0.30x0.50 de hormigon, k = 5000 kN/m/m, P = -100 kN en x = 2 m
(no en el centro: que no sea simetrico). Restringido ux y ry en un extremo para que no sea
mecanismo. Si (a) == (b), el muelle de linea es CONCENTRADO por longitud tributaria.
"""
import sys, json, os
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
PROG, OUT = sys.argv[1], sys.argv[2]
L, N, E, NU, K, P, XP = 6.0, 12, 25e6, 0.2, 5000.0, -100.0, 2.0
h = L / N
if PROG == "sap":
    import comtypes.gen.SAP2000v1 as S
    hp = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.SAP2000.API.SapObject"); LP = "DEAD"
else:
    import comtypes.gen.ETABSv1 as S
    hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); LP = "Dead"
o.ApplicationStart(); sm = o.SapModel
res = {"prog": PROG, "L": L, "N": N, "k": K, "P": P, "xP": XP}

def viga(modo):
    try: sm.SetModelIsLocked(False)
    except Exception: pass
    sm.InitializeNewModel(6)
    if PROG == "sap": sm.File.NewBlank()
    else: sm.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 1.0, 1.0)
    sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("HORM", 2); sm.PropMaterial.SetMPIsotropic("HORM", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("HORM", 1, 0.0)
    sm.PropFrame.SetRectangle("V", "HORM", 0.50, 0.30)
    z = 2.0
    nom = []
    for i in range(N + 1):
        nm = "N%d" % i; sm.PointObj.AddCartesian(i * h, 0.0, z, "", nm); nom.append(nm)
    fr = []
    for i in range(N):
        nm = "F%d" % i; sm.FrameObj.AddByPoint(nom[i], nom[i + 1], "", "V", nm); fr.append(nm)
        if PROG == "etabs": sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
    sm.PointObj.SetRestraint(nom[0], [True, True, False, True, False, True])
    sm.PointObj.SetRestraint(nom[N], [False, True, False, True, False, True])
    notas = []
    if modo == "linea":
        if PROG == "sap":
            # SetSpring(Name, MyType=1, s, SimpleSpringType=1, LinkProp, SpringLocalOneType=1, Dir, Plane23Angle, Vec, Ang, Replace, CSys, ItemType)
            for f in fr:
                r = sm.FrameObj.SetSpring(f, 1, K, 1, "", 1, 2, 0.0, [0.0, 0.0, 1.0], 0.0, True, "Local", 0)
                if f == fr[0]: notas.append("SetSpring -> %s" % str(r)[:30])
        else:
            r = sm.PropLineSpring.SetLineSpringProp("KL", 0.0, K, 0.0, 0.0, 0, 0)   # U2 = local 2 = vertical de una viga horizontal (en U3 salia un mecanismo)
            notas.append("SetLineSpringProp -> %s" % str(r)[:30])
            for f in fr:
                r = sm.FrameObj.SetSpringAssignment(f, "KL")
                if f == fr[0]: notas.append("SetSpringAssignment -> %s" % str(r)[:30])
    else:
        for i, nm in enumerate(nom):
            f = 0.5 if i in (0, N) else 1.0
            sm.PointObj.SetSpring(nm, [0.0, 0.0, K * h * f, 0.0, 0.0, 0.0])
    ip = int(round(XP / h))
    sm.LoadPatterns.Add(LP, 1, 0.0, True)
    sm.PointObj.SetLoadForce(nom[ip], LP, [0.0, 0.0, P, 0.0, 0.0, 0.0])
    sm.LoadPatterns.SetSelfWTMultiplier(LP, 0.0)
    sm.File.Save(os.path.abspath(os.path.join(os.path.dirname(OUT), "linea_%s_%s.%s" % (PROG, modo, "sdb" if PROG == "sap" else "EDB"))))
    rr = sm.Analyze.RunAnalysis()
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(LP)
    w = {}
    for i, nm in enumerate(nom):
        r = sm.Results.JointDispl(nm, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0]: w[str(i)] = float(r[8][0])
    return {"run": rr, "w": w, "notas": notas}
try:
    res["linea"] = viga("linea"); print("linea:", res["linea"]["notas"], "w en P", res["linea"]["w"].get(str(int(XP / h))), flush=True)
    res["nodal"] = viga("nodal"); print("nodal:", "w en P", res["nodal"]["w"].get(str(int(XP / h))), flush=True)
    wa, wn = res["linea"]["w"], res["nodal"]["w"]; wmax = max(abs(v) for v in wn.values())
    peor = max(abs(wa[k] - wn[k]) / wmax * 100 for k in wn if k in wa); res["peor_linea_vs_nodal_pct"] = peor
    print("peor (linea vs nodal concentrado) = %.4f %% del maximo" % peor, flush=True)
    json.dump(res, open(OUT, "w"), indent=1)
finally:
    try: o.ApplicationExit(False)
    except Exception: pass
