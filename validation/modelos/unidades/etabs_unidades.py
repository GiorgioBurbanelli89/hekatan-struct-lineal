# -*- coding: utf-8 -*-
"""ORÁCULO del test `unidades-e2k`: qué entiende ETABS 22 de un .e2k REAL (escrito por ETABS en
cualquier sistema de unidades), leído por la OAPI en kN-m (SetPresentUnits 6).
    python etabs_unidades.py salida_dir fichero1.e2k [fichero2.e2k ...]
Por fichero → <nombre>.json: UNITS del fichero, caja de los nudos, espesor y área de cada cáscara,
E y peso por volumen de cada material, A e I33 de cada sección, y la carga total por patrón
(puntuales + uniformes de área) en kN. Sin analizar: es lo que ETABS LEYÓ.
"""
import json, os, sys
import comtypes.client as cc
cc.CreateObject('ETABSv1.Helper'); from comtypes.gen import ETABSv1 as E
EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
OUT = os.path.abspath(sys.argv[1]); os.makedirs(os.path.join(OUT, "_edb"), exist_ok=True)
h = cc.CreateObject('ETABSv1.Helper').QueryInterface(E.cHelper)
et = h.CreateObject(EXE).QueryInterface(E.cOAPI); et.ApplicationStart()
sm = et.SapModel
def area_pol(xs, ys, zs):   # área de un polígono 3D (Newell)
    nx = ny = nz = 0.0; n = len(xs)
    for i in range(n):
        j = (i + 1) % n
        nx += (ys[i] - ys[j]) * (zs[i] + zs[j]); ny += (zs[i] - zs[j]) * (xs[i] + xs[j]); nz += (xs[i] - xs[j]) * (ys[i] + ys[j])
    return 0.5 * (nx * nx + ny * ny + nz * nz) ** 0.5
for f in sys.argv[2:]:
    f = os.path.abspath(f); nom = os.path.splitext(os.path.basename(f))[0]
    uni = [l.split() for l in open(f, encoding="latin-1") if l.strip().startswith("UNITS")][0][1:3]
    print(nom, uni, "open", sm.File.OpenFile(f))
    # un .e2k abierto SIN guardar se analiza «en vacío» (RunAnalysis 1, todo cero): se guarda como .EDB
    sm.File.Save(os.path.join(OUT, "_edb", nom + ".EDB")); sm.SetPresentUnits(6)
    pts = sm.PointObj.GetNameList()[1]; X = []
    if not pts: print("  (sin puntos: modelo vacío, se salta)"); continue
    for p in pts: r = sm.PointObj.GetCoordCartesian(p); X.append(r[:3])
    caja = [min(x[k] for x in X) for k in range(3)] + [max(x[k] for x in X) for k in range(3)]
    mats = {}
    for m in sm.PropMaterial.GetNameList()[1]:
        try: e = sm.PropMaterial.GetMPIsotropic(m); w = sm.PropMaterial.GetWeightAndMass(m); mats[m] = {"E": e[0], "gamma": w[0]}
        except Exception: pass
    secs = {}
    ln = sm.PropFrame.GetNameList()
    for s in [x for x in ln if isinstance(x, tuple)][0] if any(isinstance(x, tuple) for x in ln) else []:
        try: r = sm.PropFrame.GetSectProps(s); secs[s] = {"A": r[0], "I33": r[5]}
        except Exception as e: print("   secc", s, str(e)[:80])
    cas = {}; tot_area = {}
    for a in sm.AreaObj.GetNameList()[1]:
        prop = sm.AreaObj.GetProperty(a)[0]
        nps = sm.AreaObj.GetPoints(a)[1]; c = [sm.PointObj.GetCoordCartesian(p)[:3] for p in nps]
        A = area_pol([q[0] for q in c], [q[1] for q in c], [q[2] for q in c])
        t = None
        for g in (sm.PropArea.GetWall, sm.PropArea.GetSlab):
            try: r = g(prop); t = [v for v in r if isinstance(v, float)][0]; break
            except Exception: pass
        d = cas.setdefault(prop, {"t": t, "area": 0.0, "n": 0}); d["area"] += A; d["n"] += 1
        try:
            r = sm.AreaObj.GetLoadUniform(a, 0)
            for k in range(r[0]): tot_area[r[2][k]] = tot_area.get(r[2][k], 0.0) + r[5][k] * A * (1 if r[4][k] == 10 else -1 if r[4][k] == 6 else 0)   # hacia ABAJO positivo
        except Exception: pass
    pun = {}
    for p in pts:
        try:
            r = sm.PointObj.GetLoadForce(p, 0)
            for k in range(r[0]):   # r: n, nudo, patrón, paso, csys, F1, F2, F3, M1, M2, M3
                q = pun.setdefault(r[2][k], [0.0, 0.0, 0.0])
                for c in range(3): q[c] += r[5 + c][k]
        except Exception: pass
    # CARGA TOTAL por el camino que no se olvida de nada (puntuales, de área, de BARRA, …): peso propio a
    # cero en todos los patrones, se resuelve y se suma la reacción en la base de cada caso estático lineal.
    reac = [0.0, 0.0, 0.0]
    try:
        for lp in sm.LoadPatterns.GetNameList()[1]: sm.LoadPatterns.SetSelfWTMultiplier(lp, 0.0)
        print("   run", sm.Analyze.RunAnalysis()); R = sm.Results
        for c in sm.LoadCases.GetNameList()[1]:
            if sm.LoadCases.GetTypeOAPI(c)[0] != 1: continue      # 1 = LinearStatic
            # fuera los casos con patrones de SISMO/VIENTO automáticos: ETABS los genera, el fichero no los trae
            lds = sm.LoadCases.StaticLinear.GetLoads(c)
            if any(sm.LoadPatterns.GetLoadType(nm)[0] in (5, 6) for nm in lds[2]): continue
            R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(c)
            b = R.BaseReact()
            if b[0]: reac = [reac[0] + b[4][0], reac[1] + b[5][0], reac[2] + b[6][0]]
    except Exception as e: print("   reacciones:", str(e)[:100]); reac = None
    res = {"fichero": os.path.basename(f), "units": uni, "nPuntos": len(pts), "caja": caja, "materiales": mats,
           "secciones": secs, "cascaras": cas, "cargaPuntualFZ": pun, "cargaAreaGrav": tot_area, "reaccionSinPeso": reac}
    json.dump(res, open(os.path.join(OUT, nom + ".json"), "w"), indent=1)
    print("  pts", len(pts), "mats", len(mats), "secs", len(secs), "props area", len(cas), "F pts", {k: [round(c, 3) for c in v] for k, v in pun.items()}, "area", {k: round(v, 3) for k, v in tot_area.items()})
et.ApplicationExit(False)
