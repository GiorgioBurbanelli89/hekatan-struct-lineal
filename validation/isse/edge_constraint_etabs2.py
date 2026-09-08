# -*- coding: utf-8 -*-
"""
Edge constraint de ETABS, segunda sonda: el nudo colgado FUERA de las lineas del
automallado, y se lee el modelo de ANALISIS entero (PointElm), no solo los objetos.

    python validation/isse/edge_constraint_etabs2.py salida.json

Lo aprendido con la primera sonda: ETABS automalla un paño de 2 m en 4 (max 1.25 m)
y un nudo colgado en y = 1 pasa a ser nudo del paño, asi que ON y OFF daban lo
mismo. La API de ETABS no permite apagar el automallado por objeto. Solucion: el
nudo colgado va en y = 0.7, donde el automallado NO pone linea; queda sobre el
tramo de arista (2,0)-(2,1) de la malla interna de A.

  ON : edge constraint activo (default) -> el nudo se ata a ese tramo, ¿como?
  OFF: apagado -> desconectado
Se compara u(2,0.7) con la interpolacion LINEAL entre (2,0) y (2,1) (t = 0.7) y
con la CUBICA de Hermite de la arista (w y giro rx a los extremos). Placa 3x2 m
empotrada en x = 0, P en (3, 0.7).
"""
import sys, json, os
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
OUT = sys.argv[1]
E, NU, T, P, YH = 25e6, 0.2, 0.20, -10.0, 0.7
import comtypes.gen.ETABSv1 as S
hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart(); sm = o.SapModel
LP = "Dead"

def modelo(nombre, edge):
    try: sm.SetModelIsLocked(False)
    except Exception: pass
    sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 1.0, 1.0); sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("HORM", 2); sm.PropMaterial.SetMPIsotropic("HORM", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("HORM", 1, 0.0)
    sm.PropArea.SetSlab("PL", 0, 1, "HORM", T)
    pts = {}
    def pt(x, y):
        k = (x, y)
        if k not in pts:
            nm = "N%g_%g" % (x, y); sm.PointObj.AddCartesian(float(x), float(y), 2.0, "", nm); pts[k] = nm
        return pts[k]
    def area(nm, cs):
        sm.AreaObj.AddByPoint(4, [pt(*c) for c in cs], "", "PL", nm)
        sm.AreaObj.SetEdgeConstraint(nm, bool(edge), 0)
    area("A", [(0, 0), (2, 0), (2, 2), (0, 2)])
    area("B1", [(2, 0), (3, 0), (3, YH), (2, YH)]); area("B2", [(2, YH), (3, YH), (3, 2), (2, 2)])
    for (x, y) in ((0, 0), (0, 2)): sm.PointObj.SetRestraint(pt(x, y), [True] * 6)
    sm.LoadPatterns.Add(LP, 1, 0.0, True)
    sm.PointObj.SetLoadForce(pt(3, YH), LP, [0.0, 0.0, P, 0.0, 0.0, 0.0])
    sm.File.Save(os.path.abspath(os.path.join(os.path.dirname(OUT), "edge2_%s.EDB" % nombre)))
    rr = sm.Analyze.RunAnalysis()
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(LP)
    # el modelo de ANALISIS: todos los nudos que ETABS creo, con sus coordenadas y desplazamientos
    nel = sm.PointElm.GetNameList(0, [])
    u = {}
    for nm in nel[1]:
        c = sm.PointElm.GetCoordCartesian(nm, 0.0, 0.0, 0.0)
        r = sm.Results.JointDispl(nm, 1, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0] and c[3] == 0:
            u["%g,%g" % (round(c[0], 4), round(c[1], 4))] = [float(r[q][0]) for q in (6, 7, 8, 9, 10, 11)]
    print(nombre, "run", rr, "nudos de analisis:", nel[0], "areas de analisis:", sm.AreaElm.Count(), flush=True)
    for k in sorted(u, key=lambda s: (float(s.split(",")[0]), float(s.split(",")[1]))):
        x, y = map(float, k.split(","))
        if abs(x - 2) < 1e-9 or (abs(x - 3) < 1e-9 and abs(y - YH) < 1e-9):
            print("   ", k.ljust(8), ["%.4e" % v for v in u[k]], flush=True)
    a, b, h = u.get("2,0"), u.get("2,1"), u.get("2,%g" % YH)
    if a and b and h:
        t = YH / 1.0
        lin = [(1 - t) * p + t * q for p, q in zip(a, b)]
        # Hermite en w con el giro alrededor de x (dw/dy = -rx o +rx: se prueban los dos signos)
        H1, H2, H3, H4 = 1 - 3 * t**2 + 2 * t**3, t - 2 * t**2 + t**3, 3 * t**2 - 2 * t**3, -t**2 + t**3
        her_p = H1 * a[2] + H2 * 1.0 * a[3] + H3 * b[2] + H4 * 1.0 * b[3]
        her_m = H1 * a[2] - H2 * 1.0 * a[3] + H3 * b[2] - H4 * 1.0 * b[3]
        print("    w(2,%g) ETABS %.6e · lineal %.6e (%.2f %%) · Hermite(+rx) %.6e (%.2f %%) · Hermite(-rx) %.6e (%.2f %%)" % (
            YH, h[2], lin[2], (lin[2] / h[2] - 1) * 100, her_p, (her_p / h[2] - 1) * 100, her_m, (her_m / h[2] - 1) * 100), flush=True)
        print("    rx: ETABS %.4e lineal %.4e · ry: ETABS %.4e lineal %.4e" % (h[3], lin[3], h[4], lin[4]), flush=True)
    return {"run": rr, "u": u, "n_analisis": nel[0]}

R = {"E": E, "nu": NU, "t": T, "P": P, "y_colgado": YH}
try:
    for nombre, edge in (("ON", True), ("OFF", False)):
        try: R[nombre] = modelo(nombre, edge)
        except Exception as ex: print(nombre, "ERROR", ex, flush=True); R[nombre] = {"error": str(ex)}
    json.dump(R, open(OUT, "w"), indent=1)
finally:
    try: o.ApplicationExit(False)
    except Exception: pass
