# -*- coding: utf-8 -*-
"""JUEZ SAP2000 de la matriz de rigidez en coordenadas de piso (Aguiar) por condensación (1-oct-2026).

Mismo modelo nudo a nudo que Hekatan (sap_aguiar_<caso>.json, de torsion_aguiar.mjs), las MISMAS 3n cargas unitarias
(Fx = 1, Fy = 1, Mz = 1 en el CM de cada piso, repartidas por la masa de cada nudo). SAP2000 resuelve; aquí se leen sus
desplazamientos y se arma SU flexibilidad F con los mismos promedios pesados → K_E = F⁻¹ → se compara con la de Hekatan.
Shell-Thick en losas y muros (la del contraste modal del artículo).

    python validation/articulo-revista/sap_aguiar.py articulo molinete   → sap_aguiar_resultado.json
Unidades: el modelo de Hekatan va en tonf-m; SAP en kN-m (E y cargas × g); los desplazamientos vuelven por 1 tonf.
"""
import json, os, sys, time
import numpy as np
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
AQUI = os.path.dirname(os.path.abspath(__file__))
G = 9.80665
SAP_EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObject(SAP_EXE)
o.ApplicationStart(); log("SAP2000 arrancado")
sm = o.SapModel
OUT = {}
try:
    for caso in sys.argv[1:]:
        D = json.load(open(os.path.join(AQUI, "sap_aguiar_%s.json" % caso), encoding="utf-8"))
        sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
        E, nu = D["E"] * G, D["nu"]
        sm.PropMaterial.SetMaterial("CONC", 2); sm.PropMaterial.SetMPIsotropic("CONC", E, nu, 1e-5)
        sm.PropMaterial.SetWeightAndMass("CONC", 1, D["rho"] * G)
        bc, bb, hb = D["bCol"], D["bBeam"], D["hBeam"]
        Ac = bc * bc; Ic = bc ** 4 / 12; Jc = 0.141 * bc ** 4
        Av = bb * hb; I33v = bb * hb ** 3 / 12; I22v = hb * bb ** 3 / 12; Jv = I33v + I22v
        sm.PropFrame.SetGeneral("COL", "CONC", bc, bc, Ac, 5/6*Ac, 5/6*Ac, Jc, Ic, Ic, 1, 1, 1, 1, 1, 1)
        sm.PropFrame.SetGeneral("COL4", "CONC", bc, bc, Ac, 5/6*Ac, 5/6*Ac, Jc, 4*Ic, 4*Ic, 1, 1, 1, 1, 1, 1)
        I4 = set(D.get("colI4", []))
        sm.PropFrame.SetGeneral("VIGA", "CONC", hb, bb, Av, 5/6*Av, 5/6*Av, Jv, I22v, I33v, 1, 1, 1, 1, 1, 1)
        sm.PropArea.SetShell_1("LOSA", 2, True, "CONC", 0.0, D["tSlab"], D["tSlab"])
        sm.PropArea.SetShell_1("MURO", 2, True, "CONC", 0.0, D["tWall"], D["tWall"])
        nom = []
        for i, (x, y, z) in enumerate(D["nodes"]):
            sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "N%d" % i); nom.append("N%d" % i)
        for k, (el, kind) in enumerate(zip(D["elements"], D["kinds"])):
            if kind in ("col", "beam"): sm.FrameObj.AddByPoint(nom[el[0]], nom[el[1]], "", ("COL4" if k in I4 else "COL") if kind == "col" else "VIGA", "F%d" % k)
            else: sm.AreaObj.AddByPoint(4, [nom[j] for j in el], "", "LOSA" if kind == "slab" else "MURO", "A%d" % k)
        for i in D["supports"]: sm.PointObj.SetRestraint(nom[int(i)], [True] * 6)
        log("%s: %d nudos, %d elementos" % (caso, len(nom), len(D["elements"])))
        nc = len(D["casos"])
        for c, cargas in enumerate(D["casos"]):
            pat = "U%02d" % c
            sm.LoadPatterns.Add(pat, 8, 0, True)          # crea también el caso estático lineal del mismo nombre
            for i, fx, fy in cargas:
                sm.PointObj.SetLoadForce(nom[int(i)], pat, [fx * G, fy * G, 0, 0, 0, 0], True, "Global", 0)
        sm.File.Save(os.path.join(os.environ.get("TEMP", AQUI), "sap_aguiar_%s.sdb" % caso))
        for cs in list(sm.LoadCases.GetNameList()[1]): sm.Analyze.SetRunCaseFlag(cs, cs.startswith("U"))
        log("run -> %s" % sm.Analyze.RunAnalysis())
        n = len(D["pisos"]); F = np.zeros((3 * n, 3 * n))
        for c in range(nc):
            sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("U%02d" % c)
            r = sm.Results.JointDispl("All", 2)
            U = {name: (u1, u2) for name, u1, u2 in zip(r[1], r[6], r[7])}
            for k, p in enumerate(D["pisos"]):
                ux = uy = th = 0.0
                for i, m, (rx, ry) in zip(p["ns"], p["m"], p["rel"]):
                    u = U["N%d" % i]
                    ux += m * u[0] / p["M"]; uy += m * u[1] / p["M"]; th += m * (rx * u[1] - ry * u[0]) / p["J"]
                F[3 * k:3 * k + 3, c] = (ux, uy, th)
        F = 0.5 * (F + F.T); KE = np.linalg.inv(F)
        Fh = np.array(D["F_hekatan"]); Fh = 0.5 * (Fh + Fh.T); KEh = np.linalg.inv(Fh)
        pisos = []
        for k in range(n):
            B, Bh = KE[3*k:3*k+3, 3*k:3*k+3], KEh[3*k:3*k+3, 3*k:3*k+3]
            f = lambda B: dict(Kxx=B[0,0], Kyy=B[1,1], Ktt=B[2,2], Kxt=B[0,2], Kyt=B[1,2], ey=B[1,2]/B[1,1], ex=-B[0,2]/B[0,0],
                               rho_y=abs(B[1,2])/np.sqrt(B[1,1]*B[2,2]), rho_x=abs(B[0,2])/np.sqrt(B[0,0]*B[2,2]))
            pisos.append(dict(sap=f(B), hekatan=f(Bh)))
            s, hh = pisos[-1]["sap"], pisos[-1]["hekatan"]
            log("  piso %d  Kyy %.4g/%.4g  Kθθ %.4g/%.4g  Kyθ %.4g/%.4g  e_y %.3f/%.3f  ρy %.3f/%.3f  (SAP/Hekatan)"
                % (k + 1, s["Kyy"], hh["Kyy"], s["Ktt"], hh["Ktt"], s["Kyt"], hh["Kyt"], s["ey"], hh["ey"], s["rho_y"], hh["rho_y"]))
        dif = np.abs(KE - KEh).max() / np.abs(KEh).max() * 100
        log("  K_E: diferencia máx %.3f %% del mayor término" % dif)
        OUT[caso] = dict(KE_sap=KE.tolist(), KE_hekatan=KEh.tolist(), dif_pct_max=dif, pisos=pisos)
finally:
    ruta = os.path.join(AQUI, "sap_aguiar_resultado.json")
    previo = json.load(open(ruta, encoding="utf-8")) if os.path.exists(ruta) else {}
    previo.update(OUT)
    json.dump(previo, open(ruta, "w", encoding="utf-8"), indent=1, default=float)
    o.ApplicationExit(False)
    log("fin")
