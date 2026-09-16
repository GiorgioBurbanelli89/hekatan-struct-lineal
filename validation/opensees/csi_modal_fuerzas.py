# -*- coding: utf-8 -*-
"""Cualquier modelo de Hekatan (volcado del .heks: `node tests/lib/dump_heks.mjs m.heks d.json`)
armado en SAP2000 o ETABS por OAPI con la MISMA malla y las MISMAS cargas nodales (las que
Hekatan ya repartio: peso propio + areas), sin peso propio de CSI. Compara SOLVERS, no cargas.
Barras: General (I33=Iz, I22=Iy, AS2=shearAreasZ, AS3=shearAreasY), angulo de eje local,
releases. Cascaras: Thin/Thick con los 8 modificadores (el deck = membrana). Muelles nodales.
    python csi_desde_dump.py sap|etabs dump.json salida.json [--membrana] [--wall] [--nomesh] [--noedge | --edge] [--watchdog N]
Salida: {"nudos":[{i,x,y,z,u[6]}], "sumRz", "peor": % del maximo vs Hekatan}"""
import json, os, sys, time, subprocess
# ── WATCHDOG (--watchdog [N]): SAP2000 por OAPI se queda colgado al azar (5 GB, sin volver). El padre
# relanza este mismo script sin --watchdog con un tope de 15 min, mata SAP2000/ETABS y reintenta N veces.
if "--watchdog" in sys.argv:
    i = sys.argv.index("--watchdog"); n = 3
    if i + 1 < len(sys.argv) and sys.argv[i + 1].isdigit(): n = int(sys.argv[i + 1]); del sys.argv[i + 1]
    del sys.argv[i]
    for intento in range(1, n + 1):
        try:
            r = subprocess.run([sys.executable] + sys.argv, timeout=900)
            if r.returncode == 0 and os.path.exists(sys.argv[3]): sys.exit(0)
            print("watchdog: intento %d fallo (codigo %s)" % (intento, r.returncode), flush=True)
        except subprocess.TimeoutExpired:
            print("watchdog: intento %d colgado a los 900 s" % intento, flush=True)
        for exe in ("SAP2000.exe", "ETABS.exe"): subprocess.run(["taskkill", "/F", "/IM", exe], capture_output=True)
        time.sleep(3)
    sys.exit(1)
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
PROG, DUMP, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
D = json.load(open(DUMP)); ei = D["elementInputs"]; ni = D["nodeInputs"]
# PATRONES SEPARADOS (Jorge, 4-sep): --pat Dead=pp.json --pat SCM=scm.json --pat Live=cv.json --pat Ex=ex.json
# Misma malla en todos los dumps (la geometria sale del dump base). "Dead" = peso propio que
# CALCULA CSI (materiales con peso, multiplicador 1, sin cargas nodales); los demas = cargas
# nodales del dump, sin peso. Cada patron es su propio caso y se compara con SU dump.
# --arealoads PAT=sinDirectiva.json:conDirectiva.json : CSI recibe la carga de AREA de cada shell
# (SetLoadUniform, global Z) y hace SU transferencia (ETABS: tributaria a las vigas de borde); el
# caso se compara con el dump de la derecha (Hekatan con `deck etabs`). Mide la transferencia, no
# el solver.
AREAL = []
if "--arealoads" in sys.argv:
    i = sys.argv.index("--arealoads"); spec = sys.argv[i + 1]; nm_, rest = spec.split("=", 1); f1, f2 = rest.split(":")
    AREAL.append((nm_, f1, f2)); del sys.argv[i:i + 2]
PATS = [(a.split("=")[0], a.split("=")[1]) for a in sys.argv[4:] if "=" in a and not a.startswith("--")]
TIPO_PAT = {"dead": 1, "sdead": 2, "scm": 2, "live": 3, "viva": 3, "quake": 5, "sismo": 5, "ex": 5, "ey": 5}
NOTAS = []
t0 = time.time()
if PROG == "sap":
    import comtypes.gen.SAP2000v1 as S
    h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper); o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject")
    o.ApplicationStart(); sm = o.SapModel; sm.InitializeNewModel(6); sm.File.NewBlank(); LP, MODAL = "DEAD", "MODAL"
else:
    import comtypes.gen.ETABSv1 as S
    h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
    o.ApplicationStart(); sm = o.SapModel; sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 1.0, 1.0); LP, MODAL = "Dead", "Modal"
    # ETABS reparte la masa por PISOS: con el unico Story1 a 1.00 m, todo lo que
    # esta mas arriba se queda SIN masa y el modal no encuentra ningun modo
    # ("THE STRUCTURE HAS NO (UNRESTRAINED) MASS" en el .LOG). Se crean pisos que
    # cubran el modelo antes de dibujar nada. SAP2000 no tiene este problema.
    _z = sorted({round(float(p[2]), 4) for p in D["nodes"]})
    _base = _z[0]; _alt = [v for v in _z[1:] if v - _base > 1e-6]
    if len(_alt) > 30:
        _paso = (_alt[-1] - _base) / 30.0
        _alt = [_base + _paso * (i + 1) for i in range(30)]
    if _alt:
        _n = len(_alt)
        _nom = ["S%d" % (i + 1) for i in range(_n)]
        _h = [_alt[0] - _base] + [_alt[i] - _alt[i - 1] for i in range(1, _n)]
        try:
            # ⚠️ SetStories_2 NO lleva elevaciones: (BaseElevation, NumberStories,
            # StoryNames, StoryHeights, IsMasterStory, SimilarToStory, SpliceAbove,
            # SpliceHeight, Color). Pasarle las elevaciones corre todo un hueco y
            # falla con "unicode string expected instead of bool instance".
            rr = sm.Story.SetStories_2(float(_base), _n, _nom,
                                       [float(v) for v in _h], [False] * _n, [""] * _n,
                                       [False] * _n, [0.0] * _n, [0] * _n)
            NOTAS.append("pisos: %d de %.3f a %.3f -> %s" % (_n, _base, _alt[-1], rr))
        except Exception as ex:
            NOTAS.append("SetStories_2: " + str(ex)[:100])
sm.SetPresentUnits(6)
mats = {}
def mat(Ev, nu, rho=0.0):
    k = (round(Ev, 6), round(nu, 6), round(rho, 6))
    if k not in mats:
        nm = "MAT%d" % len(mats); sm.PropMaterial.SetMaterial(nm, 1); sm.PropMaterial.SetMPIsotropic(nm, float(Ev), float(nu), 1e-5)
        sm.PropMaterial.SetWeightAndMass(nm, 1, float(rho) * 9.80665)   # peso por volumen (kN/m3); G = 9.80665 como Hekatan
        # ⚠️ peso y masa son propiedades SEPARADAS: con solo la opcion 1 la masa
        # queda en 0, el caso modal corre igual y ModalPeriod devuelve codigo 1
        # sin decir por que. La opcion 2 es masa por volumen (t/m3).
        sm.PropMaterial.SetWeightAndMass(nm, 2, float(rho))
        mats[k] = nm
    return mats[k]
g = lambda d, i, v=0.0: d.get(i, v) if isinstance(d, dict) else v
secs = {}
def sec(i):
    A, Iy, Iz, J = ei["areas"][i], ei["momentsOfInertiaY"][i], ei["momentsOfInertiaZ"][i], ei["torsionalConstants"][i]
    AsY, AsZ = g(ei.get("shearAreasY"), i), g(ei.get("shearAreasZ"), i)
    if AsY <= 0: AsY = 5.0 / 6.0 * A
    if AsZ <= 0: AsZ = 5.0 / 6.0 * A
    Ev, G = ei["elasticities"][i], ei["shearModuli"][i]; nu = Ev / (2 * G) - 1
    rho = g(ei.get("densities"), i, 0.0)
    k = (A, Iy, Iz, J, AsY, AsZ, Ev, nu, rho)
    if k not in secs:
        nm = "SEC%d" % len(secs); sm.PropFrame.SetGeneral(nm, mat(Ev, nu, rho), 0.3, 0.3, A, AsZ, AsY, J, Iy, Iz, 1, 1, 1, 1, 1, 1); secs[k] = nm
    return secs[k]
shells = {}
MEMBRANA = "--membrana" in sys.argv     # deck (m11=m22=m12=0) como tipo MEMBRANE de CSI, no thick+modificadores
def shellprop(i):
    t, Ev, nu = ei["thicknesses"][i], ei["elasticities"][i], ei["poissonsRatios"][i]; rho = g(ei.get("densities"), i, 0.0)
    tipo = 1 if g(ei.get("plateFormulations"), i, 0) == 1 else 2       # 1 thin, 2 thick
    m = g(ei.get("shellModifiers"), i, None)
    if MEMBRANA and m and all(abs(v) < 1e-12 for v in m[3:6]): tipo = 3   # 3 = membrane
    k = (t, Ev, nu, tipo, rho)
    if k not in shells:
        nm = "SH%d" % len(shells)
        # OJO enum distinto: ETABS eShellType Membrane = 3; en SAP2000 3 es PLATE THIN (sin rigidez de
        # membrana: el mini lateral salia 19 %). SAP2000: ShellThin 1, ShellThick 2, PlateThin 3,
        # PlateThick 4, Membrane 5.
        if PROG == "sap": sm.PropArea.SetShell_1(nm, 5 if tipo == 3 else tipo, True, mat(Ev, nu, rho), 0.0, t, t)
        elif "--wall" in sys.argv: sm.PropArea.SetWall(nm, 1, tipo, mat(Ev, nu, rho), t)   # objeto WALL (sin semantica de piso)
        else: sm.PropArea.SetSlab(nm, 0, tipo, mat(Ev, nu, rho), t)
        shells[k] = nm
    return shells[k]
nombres = []
for i, (x, y, z) in enumerate(D["nodes"]):
    sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "N%d" % i); nombres.append("N%d" % i)
print("nudos %d en %.0f s" % (len(nombres), time.time() - t0), flush=True)
nfr = nsh = nang = nrel = nmod = 0
for k, el in enumerate(D["elements"]):
    ks = str(k)
    if k % 200 == 0: print("  elemento %d/%d, %.0f s" % (k, len(D["elements"]), time.time() - t0), flush=True)
    if len(el) == 2:
        nm = "F%d" % k; sm.FrameObj.AddByPoint(nombres[el[0]], nombres[el[1]], "", sec(ks), nm); nfr += 1
        # ETABS pone end offsets AUTOMATICOS por las dimensiones t3/t2 de la seccion (0.3 m en las
        # General) y NO PESA esa longitud: mezanine 1x1, Dead 206.04 vs 210.37 kN (-4.33 = 16 extremos
        # x 0.15 m). RZ = 0 no rigidiza, asi que solo se nota en el peso propio. Se anulan.
        if PROG == "etabs": sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
        ang = g(ei.get("localAngles"), ks, 0.0)
        if abs(ang) > 1e-9: sm.FrameObj.SetLocalAxes(nm, float(ang)); nang += 1
        rel = g(ei.get("momentReleases"), ks, None)
        if rel and any(rel):
            sm.FrameObj.SetReleases(nm, [bool(v) for v in rel[:6]], [bool(v) for v in rel[6:12]], [0.0] * 6, [0.0] * 6); nrel += 1
    elif len(el) in (3, 4):
        nm = "A%d" % k; sm.AreaObj.AddByPoint(len(el), [nombres[j] for j in el], "", shellprop(ks), nm); nsh += 1
        if PROG == "etabs" and "--nomesh" in sys.argv:
            # ETABS remalla las areas por defecto (1.25 m y en los cruces con barras): eso
            # cambia la malla respecto a Hekatan/SAP. Se intenta apagar por OAPI.
            try:
                rr = sm.AreaObj.SetAutoMesh(nm, 0, 1, 1, 0.0, False, False, False, False, False, 0.0, False, "", 0)
                if k == 0: NOTAS.append("SetAutoMesh -> %s" % str(rr)[:60])
            except Exception as ex:
                if k == 0: NOTAS.append("SetAutoMesh no disponible: " + str(ex)[:80])
        # EDGE CONSTRAINT (la "@LC" de ETABS): ETABS lo trae ENCENDIDO por defecto en toda area y
        # SAP2000 APAGADO. Cose a los bordes del pano los nudos intermedios que caen sobre ellos
        # aunque no sean nudos del pano (correas partidas en los porticos, viguetas...). Es la
        # semantica que separa a los dos programas con la MISMA malla. --noedge lo apaga en
        # ETABS (ETABS = SAP = Hekatan); --edge lo enciende en SAP (SAP = ETABS).
        if PROG == "etabs" and "--noedge" in sys.argv:
            rr = sm.AreaObj.SetEdgeConstraint(nm, False, 0)
            if k == 0 or nsh == 1: NOTAS.append("SetEdgeConstraint(False) -> %s" % str(rr)[:40])
        if PROG == "sap" and "--edge" in sys.argv:
            rr = sm.AreaObj.SetEdgeConstraint(nm, True, 0)
            if nsh == 1: NOTAS.append("SetEdgeConstraint(True) -> %s" % str(rr)[:40])
        m = g(ei.get("shellModifiers"), ks, None)
        if m and any(abs(v - 1) > 1e-12 for v in m[:8]):
            mm = [float(v) for v in m[:8]]
            if MEMBRANA and all(abs(v) < 1e-12 for v in mm[3:6]): mm = mm[:3] + [1.0] * 5   # membrana: sin modificadores de placa
            sm.AreaObj.SetModifiers(nm, mm + [1.0, 1.0]); nmod += 1
print("%s: %d nudos, %d barras (%d con ang, %d con releases), %d shells (%d con modificadores), %d secciones" % (PROG, len(nombres), nfr, nang, nrel, nsh, nmod, len(secs)), flush=True)
for i, s_ in ni["supports"].items(): sm.PointObj.SetRestraint(nombres[int(i)], [bool(v) for v in s_])
# Diafragma rigido por grupo (nodeInputs.diaphragms: nudo -> grupo; negativo = solo ux, uy)
dia = ni.get("diaphragms") or {}
grupos = {}
for i, gnum in dia.items():
    gi = int(round(float(gnum)))
    if gi == 0: continue
    grupos.setdefault(gi, []).append(int(i))
for gi, nds in grupos.items():
    if len(nds) < 2: continue
    nm = "D%d" % abs(gi)
    if PROG == "sap":
        sm.ConstraintDef.SetDiaphragm(nm, 3)
        for i in nds: sm.PointObj.SetConstraint(nombres[i], nm)
    else:
        # ETABS: diafragma definido (rigido) y asignado al punto (opcion 3 = definido)
        sm.Diaphragm.SetDiaphragm(nm, False)
        for i in nds: sm.PointObj.SetDiaphragm(nombres[i], 3, nm)
if grupos: print("diafragmas: %d grupos, %d nudos" % (len(grupos), sum(len(v) for v in grupos.values())), flush=True)
spr = ni.get("springs") or {}
kmu = {}   # nudo -> [6] (el dump trae LISTA de {node, dof, k}; antes solo se aceptaba dict y SAP se quedaba sin muelles)
if isinstance(spr, dict):
    for i, kk in spr.items(): kmu[int(i)] = [float(v) for v in kk[:6]]
else:
    for s_ in spr:
        n_, d_, k_ = (s_["node"], s_["dof"], s_["k"]) if isinstance(s_, dict) else (s_[0], s_[1], s_[2])
        kmu.setdefault(int(n_), [0.0] * 6)[int(d_)] += float(k_)
for i, kk in kmu.items():
    if any(abs(v) > 0 for v in kk): sm.PointObj.SetSpring(nombres[i], kk)
if kmu: print("muelles nodales en %d nudos" % len(kmu), flush=True)
sm.LoadPatterns.SetSelfWTMultiplier(LP, 0.0)
CASOS = []   # (nombre del caso en CSI, dump con el que se compara)
if not PATS:
    nc = 0; sz = 0.0
    for i, f in ni["loads"].items():
        if any(abs(v) > 0 for v in f): sm.PointObj.SetLoadForce(nombres[int(i)], LP, [float(v) for v in f]); nc += 1; sz += f[2]
    print("cargas nodales %d, sum Fz %.3f, %.0f s" % (nc, sz, time.time() - t0), flush=True)
    CASOS.append((LP, D))
for nombre, f_cargas, f_cmp in AREAL:
    Dq = json.load(open(f_cargas)); Dc = json.load(open(f_cmp))
    sm.LoadPatterns.Add(nombre, 3, 0.0, True); nq = 0; sq = 0.0
    for ks, q in (Dq["elementInputs"].get("shellSurfaceLoads") or {}).items():
        if abs(q) < 1e-15: continue
        sm.AreaObj.SetLoadUniform("A%d" % int(ks), nombre, float(q), 6, True, "Global", 0); nq += 1; sq += q
    print("patron %s: carga de AREA en %d shells (sum q %.3f kN/m2), transferencia de CSI" % (nombre, nq, sq), flush=True)
    CASOS.append((nombre, Dc))
for nombre, fn in PATS:
    Dp = json.load(open(fn)) if fn != DUMP else D
    if len(Dp["nodes"]) != len(D["nodes"]): raise SystemExit("el dump %s no tiene la misma malla" % fn)
    tipo = TIPO_PAT.get(nombre.lower(), 8)   # 8 = Other
    if tipo == 1:
        nm = LP; sm.LoadPatterns.SetSelfWTMultiplier(LP, 1.0)     # el peso lo calcula CSI
        print("patron %s: peso propio de CSI (x1), sin cargas nodales" % nm, flush=True)
    else:
        nm = nombre; sm.LoadPatterns.Add(nm, tipo, 0.0, True)
        nc = 0; sz = 0.0
        for i, f in Dp["nodeInputs"]["loads"].items():
            if any(abs(v) > 0 for v in f): sm.PointObj.SetLoadForce(nombres[int(i)], nm, [float(v) for v in f]); nc += 1; sz += f[2]
        print("patron %s: %d cargas nodales, sum Fz %.3f" % (nm, nc, sz), flush=True)
    CASOS.append((nm, Dp))
NMOD = 12
for a in sys.argv:
    if a.startswith("--modos="): NMOD = int(a.split("=")[1])
# modal: N modos por autovalores, la misma masa del modelo (la de las densidades)
try:
    sm.LoadCases.ModalEigen.SetNumberModes(MODAL, NMOD, NMOD)
    NOTAS.append("modal %s: %d modos" % (MODAL, NMOD))
except Exception as ex:
    NOTAS.append("SetNumberModes: " + str(ex)[:80])
# ── MASA VERTICAL EN ETABS ──────────────────────────────────────────────
# SAP2000 trae la masa en las TRES direcciones por defecto. ETABS trae solo la
# LATERAL, asi que sus modos verticales no existen (SumUZ = 0 y los modos se
# corren de sitio). En ETABS.dll y CSI.SAPModel.dll estan las claves
# `IncludeLateralMass` e `IncludeVerticalMass` (y `LateralMassOnly` /
# `VerticalMassOnly`), pero la OAPI no expone SourceMass: se toca por la tabla
# "Mass Source Definitions" de DatabaseTables.
if PROG == "etabs" and "--sinmasavertical" not in sys.argv:
    try:
        # el TableKey real se busca en la lista, que cambia entre versiones
        ra = sm.DatabaseTables.GetAllTables(0, [], [], [], [])
        claves = [str(v) for v in ra[1]]; nombres = [str(v) for v in ra[2]]
        tb = None
        for k, n in zip(claves, nombres):
            if "mass source" in (k + " " + n).lower(): tb = k; break
        NOTAS.append("tabla de masa: %s" % tb)
        if tb:
            # GetTableForEditingArray(TableKey, GroupName) -> (TableVersion,
            # FieldsKeysIncluded, NumberRecords, TableData, ret)
            r = sm.DatabaseTables.GetTableForEditingArray(tb, "All", 0, [], 0, [])
            campos = [str(v) for v in r[1]]; nreg = int(r[2]); datos = [str(v) for v in r[3]]
            NOTAS.append("campos: " + ",".join(campos))
            icol = [i for i, c in enumerate(campos) if "vert" in c.lower()]
            if icol and nreg:
                nc = len(campos)
                for f in range(nreg):
                    for i in icol: datos[f * nc + i] = "Yes"
                sm.DatabaseTables.SetTableForEditingArray(tb, r[0], campos, nreg, datos)
                rr = sm.DatabaseTables.ApplyEditedTables(True)
                NOTAS.append("masa vertical ON -> fatales %s, errores %s" % (rr[0], rr[1]))
            else:
                NOTAS.append("sin columna vertical (campos arriba), %d registros" % nreg)
    except Exception as ex:
        NOTAS.append("mass source: " + str(ex)[:150])
sm.File.Save(os.path.abspath(os.path.splitext(OUT)[0] + (".sdb" if PROG == "sap" else ".EDB")))
sm.Analyze.SetRunCaseFlag(MODAL, True)
print("run ->", sm.Analyze.RunAnalysis(), flush=True)
out = {"prog": PROG, "nudos": [], "notas": NOTAS, "casos": {}}
def resultados(caso, Dc):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(caso)
    res = {"nudos": []}
    for i, (x, y, z) in enumerate(Dc["nodes"]):
        r = sm.Results.JointDispl(nombres[i], 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0]: res["nudos"].append({"i": i, "x": x, "y": y, "z": z, "u": [float(r[q][0]) for q in (6, 7, 8, 9, 10, 11)]})
    r = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
    res["sumRz"] = float(r[6][0]) if r[0] else None
    H = Dc.get("deformations") or {}
    if H:
        umax = max(abs(v) for u in H.values() for v in u[:3]); peor = 0.0; peorN = -1
        for n in res["nudos"]:
            hu = H.get(str(n["i"]))
            if not hu: continue
            for c in range(3):
                d = abs(n["u"][c] - hu[c]) / umax * 100
                if d > peor: peor, peorN = d, n["i"]
        res["peor"] = peor; res["peorNudo"] = peorN; res["umax"] = umax
        print("%s [%s] vs Hekatan: peor nudo %.3e %% del maximo (nudo %d, u_max %.4e), %d nudos, sumRz %s" % (PROG, caso, peor, peorN, umax, len(res["nudos"]), res["sumRz"]), flush=True)
    return res
# ── Inspeccion del MODELO DE ANALISIS que genero CSI (malla real) ──
try:
    out["joints_analisis"] = int(sm.PointElm.Count())
    out["frames_analisis"] = int(sm.FrameElm.Count()) if hasattr(sm, "FrameElm") else None
    out["areas_analisis"] = int(sm.AreaElm.Count()) if hasattr(sm, "AreaElm") else None
    insp = []
    for k, el in enumerate(D["elements"]):
        if len(el) in (3, 4) and len(insp) < 6:
            r = sm.AreaObj.GetElm("A%d" % k, 0, [])
            insp.append({"area": k, "elementos": int(r[0]) if r and r[0] is not None else None})
    out["areas_muestra"] = insp
    inspf = []
    for k, el in enumerate(D["elements"]):
        if len(el) == 2 and len(inspf) < 400:
            r = sm.FrameObj.GetElm("F%d" % k, 0, [], [], [])
            n = int(r[0]) if r and r[0] is not None else None
            if n and n > 1: inspf.append({"barra": k, "elementos": n})
    out["barras_partidas"] = inspf
    out["n_barras_partidas"] = len(inspf)
except Exception as ex:
    out["inspeccion_error"] = str(ex)[:120]
# ── MODAL: periodos y participacion de masa ──
try:
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(MODAL)
    r = sm.Results.ModalPeriod(0, [], [], [], [], [], [])
    if r[0]:
        out["modal"] = {"periodos": [float(v) for v in r[4]], "frecuencias": [float(v) for v in r[5]]}
    r = sm.Results.ModalParticipatingMassRatios(0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    if r[0]:
        out["modal"]["UX"] = [float(v) for v in r[5]]; out["modal"]["UY"] = [float(v) for v in r[6]]
        out["modal"]["UZ"] = [float(v) for v in r[7]]
        out["modal"]["SumUX"] = [float(v) for v in r[8]]; out["modal"]["SumUY"] = [float(v) for v in r[9]]
        out["modal"]["SumUZ"] = [float(v) for v in r[10]]
    print("modal: %d modos, T1 = %.6f s" % (len(out["modal"]["periodos"]), out["modal"]["periodos"][0]), flush=True)
except Exception as ex:
    out["modal_error"] = str(ex)[:200]; print("modal ERROR:", out["modal_error"], flush=True)

for caso, Dc in CASOS:
    res = resultados(caso, Dc); out["casos"][caso] = res
    # ── FUERZAS DE BARRA (locales de CSI: P V2 V3 T M2 M3) en los dos extremos ──
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(caso)
    fb = {}
    for k, el in enumerate(D["elements"]):
        if len(el) != 2: continue
        try:
            r = sm.Results.FrameForce("F%d" % k, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [])
            if not r[0]: continue
            n = int(r[0]); est = [float(v) for v in r[2]]
            i0, i1 = est.index(min(est)), est.index(max(est))
            # ⚠️ ETABS puede guardar la barra con los extremos AL REVES que Hekatan
            # (ordena de abajo arriba). Sin anotar sus puntos I/J, el M3 del extremo i
            # se compara con el del j y salta un 73 % que no existe.
            try:
                pj = sm.FrameObj.GetPoints("F%d" % k, "", "")
                inv = (str(pj[0]) != "N%d" % el[0])
            except Exception:
                inv = False
            if inv: i0, i1 = i1, i0
            fb[k] = {"invertida": bool(inv),
                     "P": [float(r[8][i0]), float(r[8][i1])], "V2": [float(r[9][i0]), float(r[9][i1])],
                     "V3": [float(r[10][i0]), float(r[10][i1])], "T": [float(r[11][i0]), float(r[11][i1])],
                     "M2": [float(r[12][i0]), float(r[12][i1])], "M3": [float(r[13][i0]), float(r[13][i1])]}
        except Exception: pass
    res["fuerzas_barra"] = fb
    # ── ESFUERZOS DE AREA en los JOINTS (F11 F22 F12 M11 M22 M12) ──
    fs = {}
    for k, el in enumerate(D["elements"]):
        if len(el) not in (3, 4): continue
        try:
            r = sm.Results.AreaForceShell("A%d" % k, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
            if not r[0]: continue
            # OJO con los indices: AreaForceShell devuelve
            # [0]NumberResults [1]Obj [2]Elm [3]PointElm [4]LoadCase [5]StepType
            # [6]StepNum [7]F11 [8]F22 [9]F12 [10]FMax [11]FMin [12]FAngle [13]FVM
            # [14]M11 [15]M22 [16]M12. Leer F11 en r[8] devuelve F22 callando.
            fs[k] = {"pts": [str(v) for v in r[3]],
                     "F11": [float(v) for v in r[7]], "F22": [float(v) for v in r[8]], "F12": [float(v) for v in r[9]],
                     "M11": [float(v) for v in r[14]], "M22": [float(v) for v in r[15]], "M12": [float(v) for v in r[16]]}
        except Exception: pass
    res["fuerzas_shell"] = fs
    print("  %s: fuerzas en %d barras y %d areas" % (caso, len(fb), len(fs)), flush=True)
primero = out["casos"][CASOS[0][0]]
for k in ("nudos", "sumRz", "peor", "peorNudo", "umax"):
    if k in primero: out[k] = primero[k]
json.dump(out, open(OUT, "w"))
o.ApplicationExit(False)
