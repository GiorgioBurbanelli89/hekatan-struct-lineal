"""ETABS 22 como SEGUNDO juez (después de SAP2000) de los 6 casos de carga nuevos de Struct. -> etabs_juez.json
  1. ¿Qué tipos de caso tiene ETABS? (OAPI: cLoadCases; tablas: DatabaseTables.GetAllTables con «Load Case»)
  2. Buckling de barras  (validation/pandeo/modelos.py: columna 1 y 4, pórtico 1 y 4, edificio 4)
  3. Buckling de cáscaras (validation/pandeo_cascara/modelos.py: Q4, triángulos, modificadores; Shell-Thin)
  4. Hyperstatic (validation/casos-csi/modelo.py: viga 2 × 20 m, caso base PT = cargas equivalentes del tendón)
Misma malla nudo a nudo, sin brazos rígidos automáticos (EndLengthOffset 0), sin diafragmas, material sin masa.
    python validation/casos-csi/etabs_juez.py [frames] [cascaras] [hyp] [tablas]"""
import json, os, sys, time, subprocess, atexit
import comtypes.client
import comtypes.gen.ETABSv1 as EV
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
sys.path.insert(0, AQUI)
QUE = set(sys.argv[1:]) or {"tablas", "frames", "cascaras", "hyp"}
RUTA = os.path.join(AQUI, "etabs_juez.json")
out = json.load(open(RUTA)) if os.path.exists(RUTA) else {}


def pids():
    s = subprocess.run(["tasklist", "/FI", "IMAGENAME eq ETABS.exe", "/FO", "CSV", "/NH"], capture_output=True, text=True).stdout
    return {int(p.split('","')[1]) for p in s.splitlines() if '","' in p}


antes = pids()
atexit.register(lambda: [os.system("taskkill /PID %d /F >nul 2>&1" % p) for p in pids() - antes])
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(EV.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); o.ApplicationStart(); sm = o.SapModel
print("ETABS", sm.GetVersion(), flush=True)


def nuevo(zmax):
    sm.InitializeNewModel(6)
    n = max(1, int(round(zmax / 3.0 + 0.4999)))
    sm.File.NewGridOnly(n, 3.0, 3.0, 2, 2, 10.0, 10.0)


def guardar(nombre):
    d = os.path.join(AQUI, "etabs"); os.makedirs(d, exist_ok=True); sm.File.Save(os.path.join(d, nombre + ".EDB"))


def correr(casos):
    for c in sm.LoadCases.GetNameList()[1]:
        sm.Analyze.SetRunCaseFlag(c, c in casos)
    return sm.Analyze.RunAnalysis()


def puntos(nodos):
    """nombre de ETABS de cada nudo (se agregan por coordenadas, ETABS pone sus nombres)"""
    nom = []
    for p in nodos:
        r = sm.PointObj.AddCartesian(float(p[0]), float(p[1]), float(p[2]), "", "")
        nom.append(r[0])
    return nom


def tabla(clave, campos, filas):
    datos = [str(x) for f in filas for x in f]
    r = sm.DatabaseTables.SetTableForEditingArray(clave, 0, campos, len(filas), datos)
    a = sm.DatabaseTables.ApplyEditedTables(True, 0, 0, 0, 0, "")
    log = [x for x in a if isinstance(x, str)]
    if a[-1] != 0 or any(("Number of errors:  0" not in l) and ("DATABASE IMPORT" in l) for l in log): print("tabla", clave, r, a, flush=True)


def pandeo_caso(nmodos):
    """ETABS: cCaseBuckling NO tiene métodos en la OAPI (SetCase no existe) → tabla «Load Case Definitions - Buckling»"""
    tabla("Load Case Definitions - Buckling", ["Name", "LoadType", "LoadName", "LoadSF", "NumModes", "EigenTol"],
          [["BUCK", "Load Pattern", "P", 1, nmodos, 1e-12]])


def factores(caso):
    R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(caso)
    r = R.BucklingFactor(0, [], [], [], [])
    return list(r[4])


# ── 1. tipos de caso ─────────────────────────────────────────────────────────────────────────────────────────────
if "tablas" in QUE:
    nuevo(3)
    oapi = [n for n in dir(sm.LoadCases) if not n.startswith("_")]
    tablas = sm.DatabaseTables.GetAllTables(0, [], [], [])
    todas = list(tablas[1]) if len(tablas) > 1 else []
    claves = [t for t in todas if any(k in t.lower() for k in ("load case", "steady", "psd", "power spectral", "multi", "moving",
                                                               "vehicle", "lane", "hyperstatic", "buckling"))]
    out["tipos"] = dict(oapi_cLoadCases=oapi, tablas=claves, n_tablas=len(todas))
    print("tablas", claves, flush=True)
    json.dump(out, open(RUTA, "w"), indent=1)

# ── 2. pandeo de barras ──────────────────────────────────────────────────────────────────────────────────────────
if "frames" in QUE:
    sys.path.insert(0, os.path.join(RAIZ, "validation", "pandeo"))
    import importlib; MF = importlib.import_module("modelos")
    out.setdefault("pandeo", {})
    for M in MF.MODELOS:
        nuevo(max(p[2] for p in M["nodes"]))
        sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", MF.E, MF.NU, 1e-5)
        sm.PropMaterial.SetWeightAndMass("C", 1, 0.0)
        secs, props = {}, {}
        for f in M["frames"]:
            k = "R%gx%g" % (f[2], f[3])
            if k not in secs:
                sm.PropFrame.SetRectangle(k, "C", f[3], f[2]); secs[k] = 1
                r = sm.PropFrame.GetSectProps(k); props[k] = dict(A=r[0], As2=r[1], As3=r[2], J=r[3], I22=r[4], I33=r[5])
        pn = puntos(M["nodes"])
        for e, f in enumerate(M["frames"]):
            r = sm.FrameObj.AddByPoint(pn[f[0]], pn[f[1]], "", "R%gx%g" % (f[2], f[3]), ""); nm = r[0]
            sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
            if f[4]: sm.FrameObj.SetLocalAxes(nm, f[4])
        for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint(pn[int(q)], [bool(x) for x in s])
        sm.LoadPatterns.Add("P", 8, 0, True)
        for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce(pn[int(q)], "P", [float(x) for x in c], True)
        pandeo_caso(6)
        guardar("pandeo_" + M["nombre"]); print("run", correr({"BUCK", "P"}), flush=True)
        out["pandeo"][M["nombre"]] = dict(factores=factores("BUCK"), props=props)
        print(M["nombre"], out["pandeo"][M["nombre"]]["factores"], flush=True)
        json.dump(out, open(RUTA, "w"), indent=1)

# ── 3. pandeo de cáscaras ────────────────────────────────────────────────────────────────────────────────────────
if "cascaras" in QUE:
    sys.path.insert(0, os.path.join(RAIZ, "validation", "pandeo_cascara"))
    import importlib; MC = importlib.import_module("modelos")
    sap = json.load(open(os.path.join(RAIZ, "validation", "pandeo_cascara", "sap_pandeo_cascara.json")))
    out.setdefault("pandeo_cascara", {})
    for M in MC.MODELOS:
        if M.get("tipo") == 2 or M["nombre"] not in sap or M["nombre"].startswith(("muro_th", "muro_tf", "muro_h")): continue
        if os.environ.get("SOLO") and M["nombre"] not in os.environ["SOLO"].split(","): continue
        vertical = abs(max(p[1] for p in M["nodos"])) < 1e-12 and max(p[2] for p in M["nodos"]) > 1e-9
        # las losas en el nivel 3 m (en la cota de la base ETABS no daba los modos de pandeo fuera del plano)
        dz = 0.0 if vertical else 3.0
        nuevo(max(3.0, max(p[2] for p in M["nodos"]) + dz))
        sm.PropMaterial.SetMaterial("AC", 1); sm.PropMaterial.SetMPIsotropic("AC", MC.E, MC.NU, 1.2e-5)
        sm.PropMaterial.SetWeightAndMass("AC", 1, 0.0)
        if vertical: sm.PropArea.SetWall("SH", 1, 1, "AC", M["t"])          # eWallPropType Specified, ShellThin
        else: sm.PropArea.SetSlab("SH", 0, 1, "AC", M["t"])                  # eSlabType Slab, ShellThin
        pn = puntos([[p[0], p[1], p[2] + dz] for p in M["nodos"]])
        for p in pn:
            try: sm.PointObj.SetDiaphragm(p, 1, "")      # 1 = desconectado de todo diafragma
            except Exception: pass
        for e, c in enumerate(M["panos"]):
            r = sm.AreaObj.AddByPoint(len(c), [pn[k] for k in c], "", "SH", ""); nm = [x for x in r if isinstance(x, str)][-1]
            if M.get("mods"): sm.AreaObj.SetModifiers(nm, [float(x) for x in M["mods"]])
            try: sm.AreaObj.SetDiaphragm(nm, "None")
            except Exception: pass
        for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint(pn[int(q)], [bool(x) for x in s])
        sm.LoadPatterns.Add("P", 8, 0, True)
        for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce(pn[int(q)], "P", [float(x) for x in c], True)
        pandeo_caso(8)
        guardar("pandeo_cascara_" + M["nombre"]); print("run", correr({"BUCK", "P"}), flush=True)
        # malla de análisis de ETABS: nº de nudos de análisis (si partió los paños, no es el mismo modelo)
        try:
            R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("P")
            d = R.JointDispl("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
            nj = len(set(d[2])) if d[0] else -1
        except Exception as ex:
            nj = -1; print("nudos de análisis: no se pudo", ex, flush=True)
        fac = factores("BUCK")
        out["pandeo_cascara"][M["nombre"]] = dict(factores=fac, nudos_analisis=nj, nudos_modelo=len(M["nodos"]))
        print(M["nombre"], nj, len(M["nodos"]), ["%.6f" % x for x in fac], flush=True)
        json.dump(out, open(RUTA, "w"), indent=1)

# ── 4. Hyperstatic ───────────────────────────────────────────────────────────────────────────────────────────────
if "hyp" in QUE:
    from modelo import *
    nuevo(6)
    sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, 0.0)
    sm.PropFrame.SetRectangle("R", "C", H, B)
    pn = puntos([[p[0], p[1], p[2] + 3.0] for p in NODES]); fr = []   # en el nivel 3 m (en la base ETABS no la carga bien)
    for e, f in enumerate(FRAMES):
        r = sm.FrameObj.AddByPoint(pn[f[0]], pn[f[1]], "", "R", ""); fr.append(r[0])
        sm.FrameObj.SetEndLengthOffset(r[0], False, 0.0, 0.0, 0.0)
    for q, s in APOYOS.items(): sm.PointObj.SetRestraint(pn[q], [bool(x) for x in s])
    sm.LoadPatterns.Add("PT", 8, 0, True)
    P = PT["P"]; nodal = {}
    def suma(q, c):
        v = nodal.setdefault(q, [0.0] * 6)
        for k in range(6): v[k] += c[k]
    for v in range(NV):
        e = PT["e"][v]; w = 8 * P * e / LV ** 2
        i0 = int(round(v * LV / DX)); i1 = int(round((v + 1) * LV / DX))
        for el in range(i0, i1): sm.FrameObj.SetLoadDistributed(fr[el], "PT", 1, 6, 0, 1, w, w, "Global", True, True)
        suma(i0, [0, 0, -w * LV / 2, 0, 0, 0]); suma(i1, [0, 0, -w * LV / 2, 0, 0, 0])
    suma(0, [P, 0, 0, 0, 0, 0]); suma(N, [-P, 0, 0, 0, 0, 0])
    for q, c in nodal.items(): sm.PointObj.SetLoadForce(pn[q], "PT", c, True)
    sm.LoadCases.StaticLinear.SetCase("PT"); sm.LoadCases.StaticLinear.SetLoads("PT", 1, ["Load"], ["PT"], [1.0])
    print("hyp", sm.LoadCases.HyperStatic.SetCase("HYP"), sm.LoadCases.HyperStatic.SetBaseCase("HYP", "PT"), flush=True)
    try:   # cómo quedó definido el caso en ETABS (tipo de apoyo, puntos de restricción)
        r = sm.DatabaseTables.GetTableForDisplayArray("Load Case Definitions - Hyperstatic", [], "", 0, [], 0, [])
        print("tabla HYP", list(r[2]), list(r[4]), flush=True); out["hyp_definicion"] = dict(campos=list(r[2]), datos=list(r[4]))
    except Exception as ex: print("tabla HYP no", ex, flush=True)
    guardar("hiperestatico"); print("run", correr({"PT", "HYP"}), flush=True)
    try:
        st = sm.Analyze.GetCaseStatus(); print("estado de casos", list(st[1]), list(st[2]), flush=True)
    except Exception as ex: print("estado no", ex, flush=True)
    R = sm.Results; res = {}
    for c in ["PT", "HYP"]:
        R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(c)
        o2 = dict(disp={}, reac={}, frame={})
        for q in range(len(NODES)):
            d = R.JointDispl(pn[q], 0, 0, [], [], [], [], [], [], [], [], [], [], [])
            o2["disp"][q] = [d[k][0] if len(d[k]) else 0.0 for k in range(6, 12)]
        for q in APOYOS:
            d = R.JointReact(pn[q], 0, 0, [], [], [], [], [], [], [], [], [], [], [])
            o2["reac"][q] = [d[k][0] if len(d[k]) else 0.0 for k in range(6, 12)]
        for e in range(len(FRAMES)):
            d = R.FrameForce(fr[e], 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
            o2["frame"][e] = dict(sta=list(d[2]), P=list(d[8]), V2=list(d[9]), M3=list(d[13]))
        res[c] = o2
        print(c, "reac", {q: [round(x, 4) for x in v] for q, v in o2["reac"].items()}, flush=True)
    out["hiperestatico"] = res
    json.dump(out, open(RUTA, "w"), indent=1)
o.ApplicationExit(False)
