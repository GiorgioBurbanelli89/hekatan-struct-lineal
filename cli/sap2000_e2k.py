"""e2k (ETABS) -> SAP2000 por OAPI -> JSON de resultados (desp., reacciones, fuerzas de barra).
Uso: python cli/sap2000_e2k.py <modelo.e2k> <salida.json> [--exe SAP2000.exe] [--carga area|frame] [--sdb ruta.sdb]
  --carga area  : carga de area UNIFF GRAV sobre la membrana (defecto)
  --carga frame : carga de area repartida a las barras en 1 sentido (ONEWAYLOADDIST), la membrana solo da rigidez
Unidades: construye en kN-m (el e2k viene en N-mm). Una sola corrida; cierra SAP2000 al terminar."""
import re, sys, os, json, time, argparse
import comtypes.client, comtypes.gen.SAP2000v1 as S

ap = argparse.ArgumentParser()
ap.add_argument("e2k"); ap.add_argument("out")
ap.add_argument("--exe", default=r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe")
ap.add_argument("--carga", default="area", choices=["area", "frame"])
ap.add_argument("--sdb", default=None)
ap.add_argument("--keep", action="store_true", help="no cierra SAP2000 al terminar (para encadenar corridas)")
ap.add_argument("--noarea", action="store_true", help="diagnostico: sin paños")
ap.add_argument("--noedge", action="store_true", help="ignora ADDRESTRAINT (sin edge constraint)")
a = ap.parse_args()
t0 = time.time()
def log(*x): print(f"[{time.time()-t0:6.1f}s]", *x, flush=True)

# ------------------------------------------------------------------ parser e2k
TOK = re.compile(r'"[^"]*"|\S+')
sec = None; D = {}
for ln in open(a.e2k, encoding="utf-8", errors="replace"):
    ln = ln.rstrip("\r\n")
    if ln.startswith("$"):
        sec = ln[1:].strip(); D.setdefault(sec, []); continue
    if sec is None or not ln.strip(): continue
    D[sec].append(TOK.findall(ln))
def uq(s): return s[1:-1] if s.startswith('"') else s
def kv(toks, start=0):
    """pares CLAVE valor desde toks[start:]; las claves son tokens sin comillas no numericos"""
    d = {}; i = start
    while i < len(toks):
        k = toks[i]
        if k.startswith('"') or re.match(r"^[-+0-9.]", k): i += 1; continue
        if i + 1 < len(toks): d[k] = uq(toks[i + 1]); i += 2
        else: d[k] = True; i += 1
    return d

mat = {}
for t in D["MATERIAL PROPERTIES"]:
    n = uq(t[1]); d = kv(t, 2); m = mat.setdefault(n, {}); m.update(d)
secs = {}; mods = {}
for t in D["FRAME SECTIONS"]:
    n = uq(t[1]); d = kv(t, 2)
    if "SHAPE" in d: secs[n] = d
    elif "A2MOD" in d or "I2MOD" in d: mods[n] = d
stories = [(uq(t[1]), kv(t, 2)) for t in D["STORIES - IN SEQUENCE FROM TOP"]]
elev = {}; z = 0.0
for nm, d in reversed(stories):
    z = float(d["ELEV"]) if "ELEV" in d else z + float(d["HEIGHT"])
    elev[nm] = z
lines = {}
for t in D["LINE CONNECTIVITIES"]:
    lines[uq(t[1])] = {"tipo": t[2], "p1": uq(t[3]), "p2": uq(t[4]), "ns": int(t[5])}
# planta de cada nudo: POINTASSIGN, o la de la primera barra/area que lo usa. z absoluta = cota de la planta - valor z del POINT
# (regla medida contra los _ref.json de ETABS: 206/206 y 32/32 nudos)
pst = {}
for t in D["POINT ASSIGNS"]: pst[uq(t[1])] = uq(t[2])
for t in D["LINE ASSIGNS"]:
    for p in (lines[uq(t[1])]["p1"], lines[uq(t[1])]["p2"]): pst.setdefault(p, uq(t[2]))
pts = {}
for t in D["POINT COORDINATES"]:
    n = uq(t[1])
    if n not in pst: continue
    zo = float(t[4]) if len(t) > 4 else 0.0
    pts[n] = [float(t[2]) / 1000, float(t[3]) / 1000, (elev[pst[n]] - zo) / 1000]
areas = {}
for t in D["AREA CONNECTIVITIES"]:
    n = int(t[3]); areas[uq(t[1])] = {"pts": [uq(x) for x in t[4:4 + n]]}
restr = {}
for t in D["POINT ASSIGNS"]:
    d = kv(t, 3)
    if "RESTRAINT" in d: restr[uq(t[1])] = d["RESTRAINT"].split()
lasg = {}
for t in D["LINE ASSIGNS"]:
    d = kv(t, 3); lasg.setdefault(uq(t[1]), {}).update(d)
    if "RELEASE" in d or "CARDINALPT" in d: pass
    s = " ".join(t)
    m = re.search(r'RELEASE\s+"([^"]*)"', s)
    if m: lasg[uq(t[1])]["RELEASE"] = m.group(1)
aasg = {}
for t in D["AREA ASSIGNS"]:
    aasg[uq(t[1])] = kv(t, 3)
shellp = {}
for t in D["SLAB PROPERTIES"] + D["DECK PROPERTIES"] + D["WALL PROPERTIES"]:
    if t[0] == "SHELLPROP": shellp[uq(t[1])] = kv(t, 2)
pat = {}
for t in D["LOAD PATTERNS"]:
    if t[0] == "LOADPATTERN": pat[uq(t[1])] = kv(t, 2)
pload = []
for t in D["POINT OBJECT LOADS"]:
    d = kv(t, 3); pload.append((uq(t[1]), d))
aload = []
for t in D["SHELL OBJECT LOADS"]:
    d = kv(t, 3); aload.append((uq(t[1]), d))
fload = D.get("FRAME OBJECT LOADS", [])
log("e2k:", len(pts), "nudos", len(lines), "barras", len(areas), "areas", "cargas pto", len(pload), "area", len(aload), "barra", len(fload))
# z por planta del e2k
# POINT "n" x y [z]: la planta no esta en POINT; los nudos de ETABS viven en una planta -> usar la lista de plantas del POINT ASSIGN?
# Aqui la coordenada z de un POINT es relativa a la planta donde se dibujo: se conserva la elevacion ya expresada en el .e2k
# (los recortes generados por OAPI pusieron todas las z como cota absoluta desde Base -> POINT z ya absoluto salvo nudos de planta).

# ------------------------------------------------------------------ SAP2000
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
try: o = h.GetObject("CSI.SAP2000.API.SapObject")
except Exception: o = None
if o is None:
    o = h.CreateObject(a.exe); r = o.ApplicationStart(); log("ApplicationStart", r)
else: log("adjunto a SAP2000 abierto")
import atexit
atexit.register(lambda: (None if a.keep else o.ApplicationExit(False)))
sm = o.SapModel; log("version", sm.GetVersion()[0])
sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
# materiales usados
usados = set()
for sn in {x.get("SECTION") for x in lasg.values()}:
    if sn in secs: usados.add(secs[sn].get("MATERIAL"))
for sn in {x.get("SECTION") for x in aasg.values()}:
    if sn in shellp: usados.add(shellp[sn].get("MATERIAL"))
for n in usados:
    if n not in mat: continue
    m = mat[n]; E = float(m["E"]) * 1000; U = float(m.get("U", 0.3)); A = float(m["A"])
    tipo = {"Steel": 1, "Concrete": 2}.get(m["TYPE"], 7)
    sm.PropMaterial.SetMaterial(n, tipo)
    sm.PropMaterial.SetMPIsotropic(n, E, U, A)
    sm.PropMaterial.SetWeightAndMass(n, 1, float(m["WEIGHTPERVOLUME"]) * 1e9 / 1000)  # N/mm3 -> kN/m3 (1e9 mm3/m3 /1000)
    log("mat", n, E, U, m["WEIGHTPERVOLUME"])
# secciones
def secprops(n):
    return None
usadas_s = {x.get("SECTION") for x in lasg.values()}
nreq = {}
for n in usadas_s:
    if n not in secs: log("FALTA seccion", n); continue
    s = secs[n]; sh = s["SHAPE"]; M = s["MATERIAL"]
    d = lambda k: float(s[k]) / 1000
    if sh == "Steel Pipe": rc = sm.PropFrame.SetPipe(n, M, d("D"), d("T"))
    elif sh == "Steel I/Wide Flange": rc = sm.PropFrame.SetISection(n, M, d("D"), d("B"), d("TF"), d("TW"), d("B"), d("TF"))
    elif sh == "Cold Formed C":
        rc = sm.PropFrame.SetColdC(n, M, d("D"), d("B"), d("T"), 0.0, d("LIP"))
    elif sh == "Concrete Circle": rc = sm.PropFrame.SetCircle(n, M, d("D"))
    elif sh == "Filled Steel Pipe":
        # SAP2000 no tiene tubo relleno nativo: tubo de acero (el relleno se omite; ver registro)
        rc = sm.PropFrame.SetPipe(n, M, d("D"), d("T"))
    else: rc = -99
    log("seccion", n, sh, "rc", rc)
    if n in mods:
        m = mods[n]; g = lambda k: float(m.get(k, 1))
        sm.PropFrame.SetModifiers(n, [g("AMOD"), g("A2MOD"), g("A3MOD"), g("JMOD"), g("I2MOD"), g("I3MOD"), g("MMOD"), g("WMOD")])
for n, s in shellp.items():
    if n not in {x.get("SECTION") for x in aasg.values()}: continue
    t = float(s["SLABTHICKNESS"]) / 1000
    tp = {"Membrane": 5, "ShellThin": 1, "ShellThick": 2}[s["MODELINGTYPE"]]
    rc = sm.PropArea.SetShell_1(n, tp, False, s["MATERIAL"], 0.0, t, t); log("area prop", n, s["MODELINGTYPE"], t, "rc", rc)
# patrones (solo los cuatro que usa la comparacion)
casos = [c for c in ("Dead", "Live", "LATX", "LATY") if c in pat]
sm.LoadPatterns.ChangeName("DEAD", "Dead"); sm.LoadCases.ChangeName("DEAD", "Dead")
sm.LoadPatterns.SetSelfWTMultiplier("Dead", float(pat["Dead"].get("SELFWEIGHT", 1)))
for c in casos:
    if c == "Dead": continue
    ty = {"Live": 3}.get(c, 8)
    sm.LoadPatterns.Add(c, ty, float(pat[c].get("SELFWEIGHT", 0)), True)
# nudos
for n, c in pts.items():
    ret = sm.PointObj.AddCartesian(c[0], c[1], c[2], "", n)
    nm = ret[0] if isinstance(ret, (list, tuple)) else n
    if nm != n: log("nombre distinto", n, nm)
for n, rs in restr.items():
    if n not in pts: continue
    f = [("UX" in rs), ("UY" in rs), ("UZ" in rs), ("RX" in rs), ("RY" in rs), ("RZ" in rs)]
    sm.PointObj.SetRestraint(n, f)
# barras
fnames = {}
for n, L in lines.items():
    A_ = lasg.get(n)
    if not A_ or "SECTION" not in A_: continue
    ret = sm.FrameObj.AddByPoint(L["p1"], L["p2"], "", A_["SECTION"], n)
    nm = ret[0] if isinstance(ret, (list, tuple)) else n
    fnames[n] = nm
    sm.FrameObj.SetAutoMesh(nm, False) if False else None
    rel = A_.get("RELEASE")
    if rel:
        w = rel.split(); I = [False] * 6; J = [False] * 6
        # orden OAPI: P V2 V3 T M2 M3
        if "TI" in w: I[3] = True
        if "TJ" in w: J[3] = True
        if "M2I" in w: I[4] = True
        if "M3I" in w: I[5] = True
        if "M2J" in w: J[4] = True
        if "M3J" in w: J[5] = True
        if "PI" in w: I[0] = True
        if "PJ" in w: J[0] = True
        sm.FrameObj.SetReleases(nm, I, J, [0] * 6, [0] * 6)
    cp = int(A_.get("CARDINALPT", 10))
    mir2 = bool(secs.get(A_["SECTION"], {}).get("MIRROR2") == "Yes")
    st = A_.get("TRANSFORMSTIFF") == "Yes"
    if cp != 10 or mir2 or st:
        sm.FrameObj.SetInsertionPoint(nm, cp, mir2, st, [0, 0, 0], [0, 0, 0])
    sm.FrameObj.SetEndLengthOffset(nm, True, 0, 0, 0)
log("barras", len(fnames), "creadas; total", sm.FrameObj.Count())
# areas
anames = {}
for n, ar in (areas.items() if not a.noarea else []):
    A_ = aasg.get(n)
    ret = sm.AreaObj.AddByPoint(len(ar["pts"]), ar["pts"], "", A_["SECTION"], n)
    nm = ret[1] if isinstance(ret, (list, tuple)) and len(ret) > 1 and isinstance(ret[1], str) else (ret[0] if isinstance(ret, (list, tuple)) else n)
    if not isinstance(nm, str): nm = n
    anames[n] = nm
    sm.AreaObj.SetAutoMesh(nm, 0)                                 # sin malla: paño = 1 elemento
    sm.AreaObj.SetEdgeConstraint(nm, (A_.get("ADDRESTRAINT") == "Yes") and not a.noedge)
log("areas", len(anames), "total", sm.AreaObj.Count())
# cargas
for p, d in pload:
    if p not in pts: continue
    lc = d.get("LC")
    if lc not in casos: continue
    f = [float(d.get(k, 0)) / 1000 for k in ("FX", "FY", "FZ")] + [float(d.get(k, 0)) / 1e6 for k in ("MX", "MY", "MZ")]
    sm.PointObj.SetLoadForce(p, lc, f, False)
nmal = 0
for ar, d in aload:
    if ar not in anames: continue
    lc = d["LC"]
    if lc not in casos: continue
    v = float(d["FVAL"]) * 1000                                    # N/mm2 -> kN/m2
    if a.carga == "area":
        rc = sm.AreaObj.SetLoadUniform(anames[ar], lc, v, 10, False)
    else:
        rc = sm.AreaObj.SetLoadUniformToFrame(anames[ar], lc, v, 10, 1, False)
    nmal += (rc == 0)
log("cargas de area asignadas", nmal, "de", len(aload), "modo", a.carga)
sdb = os.path.abspath(a.sdb or a.out.replace(".json", ".sdb"))
log("save", sm.File.Save(sdb))
sm.Analyze.SetRunCaseFlag("", False, True)
for c in casos: sm.Analyze.SetRunCaseFlag(c, True, False)
log("RunAnalysis", sm.Analyze.RunAnalysis())
# ------------------------------------------------------------------ resultados
res = {"origen": f"SAP2000 {sm.GetVersion()[0]} por OAPI desde {os.path.basename(a.e2k)} (cli/sap2000_e2k.py, carga={a.carga})",
       "unidades": "kN-m", "pts": pts, "JointDispl": {}, "JointReact": {}, "barras": {}}
sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
for c in casos:
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(c)
    jd = {}; jr = {}
    for n in pts:
        r = sm.Results.JointDispl(n, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0]: jd[n] = [r[6][0], r[7][0], r[8][0], r[9][0], r[10][0], r[11][0]]
        if n in restr:
            q = sm.Results.JointReact(n, 0, 0, [], [], [], [], [], [], [], [], [], [])
            if q[0]: jr[n] = [q[6][0], q[7][0], q[8][0], q[9][0], q[10][0], q[11][0]]
    res["JointDispl"][c] = jd; res["JointReact"][c] = jr
    for n, nm in fnames.items():
        q = sm.Results.FrameForce(nm, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if not q[0]: continue
        b = res["barras"].setdefault(n, {"sec": lasg[n]["SECTION"], "p1": pts[lines[n]["p1"]], "p2": pts[lines[n]["p2"]]})
        b[c] = {"x": list(q[2]), "P": list(q[8]), "V2": list(q[9]), "V3": list(q[10]), "T": list(q[11]), "M2": list(q[12]), "M3": list(q[13])}
    log("resultados", c, len(jd), "nudos")
json.dump(res, open(a.out, "w"), indent=0)
log("escrito", a.out)
log("fin")
