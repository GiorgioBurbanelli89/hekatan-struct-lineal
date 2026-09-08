# -*- coding: utf-8 -*-
"""
Como aplica CSI el MUELLE DE AREA (Winkler): medido en el programa, no leido.

    python validation/isse/muelle_area_csi.py sap|etabs salida.json

La misma placa dos veces en el mismo programa:
  (a) muelle de AREA  ks (kN/m3) asignado a las cascaras (Area Spring)
  (b) muelles NODALES k = ks * A_tributaria (esquina/4, borde/2), que es lo que
      hace Hekatan Struct lineal (y SAP2000 con muelles en nudos)
Carga PUNTUAL en el centro, no uniforme: con carga uniforme y ks uniforme la placa
baja rigida w = q/ks y las dos formulaciones dan lo mismo; con flexion, el muelle
consistente ks*∫NᵀN (el de SAFE) y el concentrado se separan (~2 %, medido el
20-ago-2026 en la zapata). Si (a) == (b) en el programa, su muelle de area es
CONCENTRADO por area tributaria = Hekatan. Si no, es consistente (o otra cosa) y
se ve cuanto.

Placa 4x4 m, t = 0.40, E = 25e6 kN/m2, nu = 0.2, malla 8x8 (0.5 m), Shell-Thin,
ks = 20000 kN/m3, P = -1000 kN en el centro. En el plano se ata lo justo para que
no sea mecanismo (ux,uy en una esquina, uy en la contigua).
"""
import sys, json, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
PROG, OUT = sys.argv[1], sys.argv[2]
L, N, T, E, NU, KS, P = 4.0, 8, 0.40, 25e6, 0.2, 20000.0, -1000.0
h = L / N

if PROG == "sap":
    import comtypes.gen.SAP2000v1 as S
    hp = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.SAP2000.API.SapObject")
    LP = "DEAD"
else:
    import comtypes.gen.ETABSv1 as S
    hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
    LP = "Dead"
print("arrancando", PROG, flush=True)
o.ApplicationStart(); sm = o.SapModel
print("arrancado", flush=True)
res = {"prog": PROG, "L": L, "N": N, "t": T, "E": E, "nu": NU, "ks": KS, "P": P}

def placa(modo):
    print("  placa", modo, "arranca", flush=True)
    try: sm.SetModelIsLocked(False)
    except Exception: pass
    sm.InitializeNewModel(6)
    if PROG == "sap": sm.File.NewBlank()
    else: sm.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 1.0, 1.0)
    sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("HORM", 2); sm.PropMaterial.SetMPIsotropic("HORM", E, NU, 1e-5)
    sm.PropMaterial.SetWeightAndMass("HORM", 1, 0.0)
    if PROG == "sap": sm.PropArea.SetShell_1("PL", 1, True, "HORM", 0.0, T, T)
    else: sm.PropArea.SetSlab("PL", 0, 1, "HORM", T)
    nombres = {}
    for j in range(N + 1):
        for i in range(N + 1):
            nm = "N%d_%d" % (i, j); sm.PointObj.AddCartesian(i * h, j * h, 2.0, "", nm); nombres[(i, j)] = nm   # z=2: en ETABS a z=0 (nivel Base) sale todo cero
    areas = []
    for j in range(N):
        for i in range(N):
            nm = "A%d_%d" % (i, j)
            sm.AreaObj.AddByPoint(4, [nombres[(i, j)], nombres[(i + 1, j)], nombres[(i + 1, j + 1)], nombres[(i, j + 1)]], "", "PL", nm); areas.append(nm)
    # que no sea mecanismo en el plano
    sm.PointObj.SetRestraint(nombres[(0, 0)], [True, True, False, False, False, False])
    sm.PointObj.SetRestraint(nombres[(N, 0)], [False, True, False, False, False, False])
    notas = []
    if modo == "area":
        if PROG == "sap":
            # SetSpring(Name, MyType=1 simple, s, SimpleSpringType=1 (traccion y compresion), LinkProp,
            #           Face=-1 (inferior), SpringLocalOneType=1 (eje local), Dir=3, Outward, Vec, Ang, Replace, CSys, ItemType)
            # firma leida del modulo COM generado (comtypes.gen.SAP2000v1.cAreaObj._methods_), no adivinada
            for a in areas:
                r = sm.AreaObj.SetSpring(a, 1, KS, 1, "", -1, 1, 3, False, [0.0, 0.0, 1.0], 0.0, True, "Local", 0)
                if a == areas[0]: notas.append("SetSpring -> %s" % str(r)[:40])
        else:
            r = sm.PropAreaSpring.SetAreaSpringProp("KS", 0.0, 0.0, KS, 0)
            notas.append("SetAreaSpringProp -> %s" % str(r)[:40])
            for a in areas:
                r = sm.AreaObj.SetSpringAssignment(a, "KS")
                if a == areas[0]: notas.append("SetSpringAssignment -> %s" % str(r)[:40])
    else:
        for (i, j), nm in nombres.items():
            f = (0.5 if i in (0, N) else 1.0) * (0.5 if j in (0, N) else 1.0)
            sm.PointObj.SetSpring(nm, [0.0, 0.0, KS * h * h * f, 0.0, 0.0, 0.0])
    print("  malla y muelles puestos", flush=True)
    c = nombres[(N // 2, N // 2)]
    sm.PointObj.SetLoadForce(c, LP, [0.0, 0.0, P, 0.0, 0.0, 0.0])
    sm.LoadPatterns.SetSelfWTMultiplier(LP, 0.0)
    try: sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag(LP, True)
    except Exception: pass
    import os; sm.File.Save(os.path.abspath(os.path.join(os.path.dirname(OUT), "muelle_%s_%s.%s" % (PROG, modo, "sdb" if PROG == "sap" else "EDB"))))
    print("  corriendo", flush=True)
    rr = sm.Analyze.RunAnalysis()
    print("  run ->", rr, flush=True)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(LP)
    w = {}
    for (i, j), nm in nombres.items():
        r = sm.Results.JointDispl(nm, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0]: w["%d,%d" % (i, j)] = float(r[8][0])
    r = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
    return {"run": rr, "w": w, "sumFz": float(r[6][0]) if r[0] else None, "notas": notas}

t0 = time.time()
try:
  res["area"] = placa("area"); print("area:", res["area"]["notas"], "w centro", res["area"]["w"].get("4,4"), "esquina", res["area"]["w"].get("0,0"), "%.0f s" % (time.time() - t0), flush=True)
  res["nodal"] = placa("nodal"); print("nodal:", "w centro", res["nodal"]["w"].get("4,4"), "esquina", res["nodal"]["w"].get("0,0"), flush=True)
  wa, wn = res["area"]["w"], res["nodal"]["w"]
  wmax = max(abs(v) for v in wn.values())
  peor = max(abs(wa[k] - wn[k]) / wmax * 100 for k in wn if k in wa)
  res["peor_area_vs_nodal_pct"] = peor
  print("peor (area vs nodal concentrado) = %.4f %% del maximo · w_medio area %.6e nodal %.6e · teorico rigido P/(ks L^2) = %.6e" % (
      peor, sum(wa.values()) / len(wa), sum(wn.values()) / len(wn), P / (KS * L * L)), flush=True)
  json.dump(res, open(OUT, "w"), indent=1)
finally:
  try: o.ApplicationExit(False)
  except Exception: pass
