# -*- coding: utf-8 -*-
"""
Que hace el EDGE CONSTRAINT de ETABS, medido en ETABS (OAPI), no leido.

    python validation/isse/edge_constraint_etabs.py salida.json

Placa horizontal empotrada en x = 0 con un NUDO COLGADO: el paño A (0..2 x 0..2)
es UN solo elemento y a su derecha van dos paños B1 (2..3 x 0..1) y B2
(2..3 x 1..2), asi que el nudo (2,1) esta sobre la arista derecha de A sin ser
vertice suyo. Carga P en (3,1). Se corren tres modelos:

  colgado_ON  : malla no conforme, edge constraint ENCENDIDO (default de ETABS)
  colgado_OFF : la misma, apagado  -> B solo cuelga de las esquinas (2,0) y (2,2)
  partido     : A partido en A1/A2 por y = 1 (lo que hace `deck etabs` en Hekatan)

Se leen los 6 desplazamientos de (2,0), (2,1), (2,2) y (3,1). Si con ON el nudo
(2,1) cumple u = ½·(u(2,0) + u(2,2)) en cada grado de libertad, el edge
constraint es una restriccion multipunto INTERPOLADA linealmente sobre la
arista; y comparando con `partido` se ve si partir el paño (un nudo libre mas)
da lo mismo o no. Hormigon E = 25e6, nu = 0.2, t = 0.20, Shell-Thin.
"""
import sys, json
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
OUT = sys.argv[1]
E, NU, T, P = 25e6, 0.2, 0.20, -10.0
import comtypes.gen.ETABSv1 as S
hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart(); sm = o.SapModel
LP = "Dead"

def modelo(nombre, partido, edge):
    try: sm.SetModelIsLocked(False)
    except Exception: pass
    sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 1.0, 1.0); sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("HORM", 2); sm.PropMaterial.SetMPIsotropic("HORM", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("HORM", 1, 0.0)
    sm.PropArea.SetSlab("PL", 0, 1, "HORM", T)
    pts = {}
    def pt(x, y):
        k = (x, y)
        if k not in pts:
            nm = "N%g_%g" % (x, y); sm.PointObj.AddCartesian(float(x), float(y), 2.0, "", nm); pts[k] = nm   # z=2: a z=0 (nivel Base) ETABS lo dejaba todo a cero
        return pts[k]
    def area(nm, cs):
        sm.AreaObj.AddByPoint(4, [pt(*c) for c in cs], "", "PL", nm)
        # SIN automallado: ETABS mallaba A (2x2 > 1.25 m) en 4 y el nudo (2,1) pasaba a
        # ser nudo de A de todas formas; asi el edge constraint no llegaba a actuar.
        try: sm.AreaObj.SetAutoMesh(nm, 0, 1, 1, 0.0, False, False, False, False, False, 0.0, False, "", 0)
        except Exception as ex: print("   SetAutoMesh:", ex)
        r = sm.AreaObj.SetEdgeConstraint(nm, bool(edge), 0)
        return r
    if partido == "conforme":
        # A en 4 cuadrados de 1 m: malla conforme de verdad (la referencia)
        for (x0, y0) in ((0, 0), (1, 0), (0, 1), (1, 1)):
            area("A%d%d" % (x0, y0), [(x0, y0), (x0 + 1, y0), (x0 + 1, y0 + 1), (x0, y0 + 1)])
    elif partido:
        area("A1", [(0, 0), (2, 0), (2, 1), (0, 1)]); area("A2", [(0, 1), (2, 1), (2, 2), (0, 2)])
    else:
        area("A", [(0, 0), (2, 0), (2, 2), (0, 2)])
    area("B1", [(2, 0), (3, 0), (3, 1), (2, 1)]); area("B2", [(2, 1), (3, 1), (3, 2), (2, 2)])
    # empotrado SOLO en las dos esquinas (0,0) y (0,2): asi todos los modelos tienen
    # las mismas condiciones de contorno aunque (0,1) exista o no como nudo
    for (x, y) in ((0, 0), (0, 2)):
        sm.PointObj.SetRestraint(pt(x, y), [True] * 6)
    r0 = sm.LoadPatterns.Add(LP, 1, 0.0, True)
    r1 = sm.PointObj.SetLoadForce(pt(3, 1), LP, [0.0, 0.0, P, 0.0, 0.0, 0.0])
    print("   patron ->", r0, " carga ->", r1, flush=True)
    # sin guardar, RunAnalysis devuelve 1 y no hay resultados (anotado en plantillas_etabs.py)
    import os; sm.File.Save(os.path.abspath(os.path.join(os.path.dirname(OUT), "edge_%s.EDB" % nombre)))
    rr = sm.Analyze.RunAnalysis()
    try: print("   estado casos:", sm.Analyze.GetCaseStatus(0, [], []), flush=True)
    except Exception as ex: print("   GetCaseStatus:", ex)
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(LP)
    u = {}
    for (x, y), nm in pts.items():
        r = sm.Results.JointDispl(nm, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0]: u["%g,%g" % (x, y)] = [float(r[q][0]) for q in (6, 7, 8, 9, 10, 11)]
    # joints que ETABS creo de mas (sus propios nudos de malla / constraints)
    todos = sm.PointObj.GetNameList(0, [])[1]
    try:
        nae = sm.AreaElm.Count(); npe = sm.PointElm.Count()
        print("    modelo de analisis: %d elementos de area, %d nudos (objetos: %d areas, %d puntos)" % (nae, npe, len([a for a in sm.AreaObj.GetNameList(0, [])[1]]), len(todos)), flush=True)
    except Exception as ex: print("    AreaElm/PointElm:", ex)
    ec = {}
    for nm in ("A", "A1", "B1"):
        try: ec[nm] = sm.AreaObj.GetEdgeConstraint(nm, False)[0]
        except Exception: pass
    res = {"run": rr, "u": u, "joints_etabs": len(todos), "joints_mios": len(pts), "edge_leido": ec}
    print(nombre, "run", rr, "joints", len(todos), "/", len(pts), "edge:", ec)
    for k in ("2,0", "2,1", "2,2", "3,1"):
        print("   ", k, ["%.4e" % v for v in u.get(k, [])])
    if "2,1" in u and "2,0" in u and "2,2" in u:
        med = [(a + b) / 2 for a, b in zip(u["2,0"], u["2,2"])]
        print("    media(2,0 ; 2,2):", ["%.4e" % v for v in med])
    return res

R = {"E": E, "nu": NU, "t": T, "P": P}
try:
    for nombre, partido, edge in (("colgado_ON", False, True), ("colgado_OFF", False, False), ("partido", True, True), ("conforme", "conforme", True)):
        try: R[nombre] = modelo(nombre, partido, edge)
        except Exception as ex: print(nombre, "ERROR", ex, flush=True); R[nombre] = {"error": str(ex)}
    json.dump(R, open(OUT, "w"), indent=1)
finally:
    try: o.ApplicationExit(False)
    except Exception: pass
