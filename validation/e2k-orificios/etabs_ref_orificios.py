# -*- coding: utf-8 -*-
"""JUEZ ETABS 22 para el lector de .e2k: un modelo SINTÉTICO (nada de cliente) armado DENTRO de ETABS
por la OAPI y exportado con SU exportador, para que el lector se enfrente al dialecto de ETABS.

Lo que lleva (lo que un e2k real de ETABS traía y Hekatan no leía o no calculaba):
  * losa (Slab ShellThin 100 mm) en las 3 plantas, con diafragma rígido D1
  * ORIFICIOS: A1 dentro de la losa en las 3 plantas y A2 tocando el borde solo en la planta 2
  * columnas perfil I 300×300 (SetTube de la OAPI de ETABS 22 falla: devuelve 1)
  * vigas secundarias que nacen en el medio de las principales, articuladas (M2 y M3 en los dos extremos)
  * brazos rígidos AUTOMÁTICOS con zona rígida 0.5
  * fuente de masa desde las CARGAS (Dead 1 + Live 0.25)
  * sismo estático «User Coefficient» en X (+ecc) y en Y (−ecc)

Instancia PROPIA y oculta de ETABS (no toca la del usuario). Uso:
    python etabs_ref_orificios.py [tam_malla_m]  -> sintetico_etabs.e2k + ref_orificios_etabs.json
"""
import os, sys, json, comtypes.client as cc
cc.CreateObject('ETABSv1.Helper'); from comtypes.gen import ETABSv1 as E
AQUI = os.path.dirname(os.path.abspath(__file__))
TAM = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
h = cc.CreateObject('ETABSv1.Helper').QueryInterface(E.cHelper)
et = h.CreateObject(r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe").QueryInterface(E.cOAPI)
et.ApplicationStart()
try: et.Hide()
except Exception: pass
sm = et.SapModel
R = {"tam_malla": TAM}
X = [0.0, 6.0, 12.0]; Y = [0.0, 5.0, 10.0]; Z = [0.0, 3.0, 6.0, 9.0]
try:
    sm.InitializeNewModel(6)                                   # kN, m, C
    sm.File.NewGridOnly(3, 3.0, 3.0, 3, 3, 6.0, 5.0)
    plantas = list(sm.Story.GetNameList()[1]); R["plantas"] = plantas
    # materiales y secciones
    sm.PropMaterial.SetMaterial("A36", 1); sm.PropMaterial.SetMPIsotropic("A36", 199947980.0, 0.3, 1.17e-5)
    sm.PropMaterial.SetWeightAndMass("A36", 1, 76.972865)
    sm.PropMaterial.SetMaterial("C24", 2); sm.PropMaterial.SetMPIsotropic("C24", 23025000.0, 0.2, 9.9e-6)
    sm.PropMaterial.SetWeightAndMass("C24", 1, 23.563121)
    R["col"] = sm.PropFrame.SetISection("COL", "A36", 0.30, 0.30, 0.012, 0.010, 0.30, 0.012)   # SetTube devuelve 1 en ETABS 22
    sm.PropFrame.SetISection("VIGA", "A36", 0.40, 0.18, 0.012, 0.008, 0.18, 0.012)
    sm.PropFrame.SetISection("VSEC", "A36", 0.25, 0.12, 0.008, 0.006, 0.12, 0.008)
    sm.PropArea.SetSlab("Losa10", 0, 1, "C24", 0.10)       # Slab, ShellThin
    sm.Diaphragm.SetDiaphragm("D1", False)
    marcos = []
    def barra(a, b, sec):
        r = sm.FrameObj.AddByCoord(a[0], a[1], a[2], b[0], b[1], b[2], "", sec)
        marcos.append(r[0]); return r[0]
    for k in range(1, 4):
        z0, z1 = Z[k - 1], Z[k]
        for x in X:
            for y in Y: barra((x, y, z0), (x, y, z1), "COL")
        for y in Y:
            for i in range(2): barra((X[i], y, z1), (X[i + 1], y, z1), "VIGA")
        for x in X:
            for j in range(2): barra((x, Y[j], z1), (x, Y[j + 1], z1), "VIGA")
        for xs in (3.0, 9.0):
            for j in range(2):
                nm = barra((xs, Y[j], z1), (xs, Y[j + 1], z1), "VSEC")
                sm.FrameObj.SetReleases(nm, [False, False, False, False, True, True], [False, False, False, False, True, True],
                                        [0.0] * 6, [0.0] * 6)
    for nm in marcos: sm.FrameObj.SetEndLengthOffset(nm, True, 0.0, 0.0, 0.5)
    # losas y orificios
    losas = []
    for k in range(1, 4):
        z = Z[k]
        r = sm.AreaObj.AddByCoord(4, [0, 12, 12, 0], [0, 0, 10, 10], [z, z, z, z], "", "Losa10")
        losas.append(r[3]); sm.AreaObj.SetDiaphragm(r[3], "D1")
        o = sm.AreaObj.AddByCoord(4, [7.0, 8.5, 8.5, 7.0], [1.5, 1.5, 3.5, 3.5], [z] * 4, "", "Losa10")
        sm.AreaObj.SetOpening(o[3], True)
        if k == 2:
            o2 = sm.AreaObj.AddByCoord(4, [1.0, 2.5, 2.5, 1.0], [8.5, 8.5, 10.0, 10.0], [z] * 4, "", "Losa10")
            sm.AreaObj.SetOpening(o2[3], True)
    R["losas"] = losas
    # apoyos
    for x in X:
        for y in Y:
            r = sm.PointObj.AddCartesian(x, y, 0.0, "", "")
            sm.PointObj.SetRestraint(r[0], [True] * 6)
    # cargas
    if "Live" not in list(sm.LoadPatterns.GetNameList()[1]): sm.LoadPatterns.Add("Live", 3, 0.0, True)
    for nm in losas:
        sm.AreaObj.SetLoadUniform(nm, "Dead", 3.0, 10, True, "Global")   # 10 = gravedad
        sm.AreaObj.SetLoadUniform(nm, "Live", 2.0, 10, True, "Global")
    sm.LoadPatterns.Add("SEx", 5, 0.0, True); sm.LoadPatterns.Add("SEy", 5, 0.0, True)
    R["masssource"] = sm.PropMaterial.SetMassSource_1(False, False, True, 2, ["Dead", "Live"], [1.0, 0.25])
    sm.File.Save(os.path.join(AQUI, "_sintetico.EDB"))
    base = os.path.join(AQUI, "_sintetico_base.e2k")
    R["export"] = sm.File.ExportFile(base, 1)
    # El sismo «User Coefficient» no tiene función en la OAPI de ETABS: se escribe en el e2k DE ETABS
    # (su misma sintaxis) y ETABS lo vuelve a leer. Así el caso lo calcula ETABS, no nosotros.
    t = open(base, encoding="latin-1").read().splitlines()
    t = [l for l in t if not l.strip().startswith('SEISMIC "SEx"') and not l.strip().startswith('SEISMIC "SEy"')]
    # malla de la losa como la del modelo real (OBJMESHTYPE "AUTOMESH", en las vigas, tamaño TAM): la
    # escribe ETABS así en el e2k del cliente, y aquí se pone con esa misma sintaxis
    mm = int(round(TAM * 1000))
    t = [l.replace('OBJMESHTYPE "DEFAULT"', f'OBJMESHTYPE "AUTOMESH"  MESHAT "BEAMS"  MESHAT "WALLS"  MAXMESHSIZE {mm}')
         if l.strip().startswith('AREAASSIGN') and 'SECTION "Losa10"' in l else l for l in t]
    i = max(k for k, l in enumerate(t) if l.strip().startswith("LOADPATTERN"))
    top, bot = plantas[0], "Base"
    t[i + 1:i + 1] = [f'  SEISMIC "SEx"  "User Coefficient"    DIR "X+ECC"  ECC 0.05  TOPSTORY "{top}"    BOTTOMSTORY "{bot}"    SHEARCOEFF 0.12  HEIGHTEXPONENT 1.2',
                      f'  SEISMIC "SEy"  "User Coefficient"    DIR "Y-ECC"  ECC 0.05  TOPSTORY "{top}"    BOTTOMSTORY "{bot}"    SHEARCOEFF 0.12  HEIGHTEXPONENT 1.2']
    final = os.path.join(AQUI, "sintetico_etabs.e2k")
    open(final, "w", encoding="latin-1", newline="\r\n").write("\n".join(t) + "\n")
    sm.InitializeNewModel(6)
    R["reabrir"] = sm.File.OpenFile(final); sm.SetPresentUnits(6)
    R["n_puntos"] = sm.PointObj.Count()
    if R["n_puntos"] < 10: raise SystemExit("ETABS no releyó su propio e2k")
    sm.File.Save(os.path.join(AQUI, "_sintetico2.EDB"))
    R["analyze"] = sm.Analyze.RunAnalysis()
    rs = sm.Results
    casos = list(sm.LoadCases.GetNameList()[1]); R["casos"] = casos
    rs.Setup.DeselectAllCasesAndCombosForOutput(); rs.Setup.SetCaseSelectedForOutput("Modal")
    o = rs.ModalParticipatingMassRatios()
    R["modos"] = [dict(T=o[4][i], Ux=o[5][i], Uy=o[6][i], Rz=o[13][i]) for i in range(o[0])]
    R["base"] = {}
    for c in casos:
        if c.startswith("~") or c == "Modal": continue
        rs.Setup.DeselectAllCasesAndCombosForOutput(); rs.Setup.SetCaseSelectedForOutput(c)
        b = rs.BaseReact()
        if b[0]: R["base"][c] = [b[4][0], b[5][0], b[6][0], b[7][0], b[8][0], b[9][0]]
    m = rs.AssembledJointMass("All", 2, 0, [], [], [], [], [], [], [])
    R["masa_U1"] = sum(m[2]); R["masa_nudos"] = m[0]
    R["coords"] = {}
    for nm in list(sm.PointObj.GetNameList()[1]):
        c = sm.PointObj.GetCoordCartesian(nm); R["coords"][nm] = [c[0], c[1], c[2]]
    R["disp"] = {}
    for c in ("Dead", "Live", "SEx", "SEy"):
        rs.Setup.DeselectAllCasesAndCombosForOutput(); rs.Setup.SetCaseSelectedForOutput(c)
        d = rs.JointDispl("All", 2)
        R["disp"][c] = {d[1][i]: [d[6][i], d[7][i], d[8][i], d[9][i], d[10][i], d[11][i]] for i in range(d[0]) if d[3][i] == c}
finally:
    json.dump(R, open(os.path.join(AQUI, "ref_orificios_etabs.json"), "w"), indent=1)
    try: et.ApplicationExit(False)
    except Exception: pass
print({k: R.get(k) for k in ("export", "analyze", "masssource", "masa_U1", "automesh", "automesh_err")},
      "modos", [round(q["T"], 4) for q in R.get("modos", [])[:3]], "base", {k: [round(x, 2) for x in v[:3]] for k, v in R.get("base", {}).items()})
