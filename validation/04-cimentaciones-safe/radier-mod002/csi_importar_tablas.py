"""Importa un .s2k (SAP2000 24) o .f2k (SAFE 20) POR TABLAS (DatabaseTables + ApplyEditedTables), sin
File.OpenFile: asi no salen las ventanas modales del import y se obtiene el ImportLog COMPLETO (tabla, campo,
registro, mensaje). Si el import sale limpio (0 errores), analiza y vuelca resultados.

  python csi_importar_tablas.py sap  informe/radier_mod002_corregido.s2k        res/sap_import
  python csi_importar_tablas.py safe informe/radier_mod002_corregido_SAFE20.f2k res/safe_import

Salida: <pref>.log.txt (ImportLog), <pref>.json (conteos + resultados). Arranca SU instancia (no se engancha).
Tabla a tabla (una ApplyEditedTables por tabla) para saber de que tabla sale cada error.
"""
import csv, json, os, re, sys, tempfile, time
import comtypes.client

ENG, SRC, PREF = sys.argv[1], os.path.abspath(sys.argv[2]), os.path.abspath(sys.argv[3])
t0 = time.time()
LOG = []
def log(s):
    LOG.append(s); print(s, flush=True)

def tablas(path):
    txt = open(path, encoding="utf-8", errors="replace").read().replace("\r", "")
    txt = re.sub(r" _\n\s+", "   ", txt)
    out, cur = {}, None
    for ln in txt.split("\n"):
        m = re.match(r'^TABLE:\s+"([^"]+)"', ln)
        if m: cur = m.group(1); out[cur] = []; continue
        if cur is None or not ln.strip() or ln.startswith("END TABLE"): continue
        fila = {}
        for k, v in re.findall(r'("[^"]*"|[^\s=]+)=("[^"]*"|\S+)', ln.strip()):
            fila[k.strip('"')] = v.strip('"')
        if fila: out[cur].append(fila)
    return out

if ENG == "sap":
    import comtypes.gen.SAP2000v1 as G
    h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(G.cHelper)
    # OCULTO: ApplicationStart(Units, Visible=False). Sin argumentos SAP2000 sale en la pantalla del usuario.
    # Con Visible=False el ApplyEditedTables de SAP2000 24 devuelve 1 y NO importa nada (log vacio, areas sin
    # seccion; medido 19-sep-2026). Se arranca normal y se OCULTA enseguida con Hide(): sin ventana para el usuario.
    o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
    try: o.Hide()
    except Exception as ex: print("Hide:", ex)
else:
    import comtypes.gen.SAFEv1 as G
    h = comtypes.client.CreateObject("SAFEv1.Helper").QueryInterface(G.cHelper)
    o = h.CreateObjectProgID("CSI.SAFE.API.ETABSObject"); o.ApplicationStart()
sm = o.SapModel
log("%s arrancado %.0f s" % (ENG, time.time() - t0))
sm.InitializeNewModel(6)          # kN, m, C (las del fichero)
sm.File.NewBlank()
dt = sm.DatabaseTables
r = dt.GetAllTables()
cand = [x for x in r if isinstance(x, (list, tuple)) and x and isinstance(x[0], str)]
todas = {str(t).upper(): str(t) for t in cand[0]} if cand else {}
T = tablas(SRC)
tmp = tempfile.mkdtemp(prefix="csi_imp_")
resumen = []
# Por defecto TODAS las tablas y UNA ApplyEditedTables (el programa ordena las dependencias, como OpenFile).
# `--tabla-a-tabla`: una Apply por tabla (sirve para atribuir, pero falla por orden: barras antes que nudos).
UNA_VEZ = "--tabla-a-tabla" in sys.argv
# `--despues=TABLA1;TABLA2`: esas tablas se importan en una SEGUNDA ApplyEditedTables (para aislar cual falla)
DESPUES = set(a.split("=", 1)[1].upper() for a in sys.argv if a.startswith("--despues="))
DESPUES = set(x for d in DESPUES for x in d.split(";")) if DESPUES else set()
# orden: el del fichero, salvo PROGRAM CONTROL (se salta: lo pone el programa)
for n, (nom, filas) in enumerate(T.items()):
    if nom.upper() in ("PROGRAM CONTROL", "DATABASE FORMAT TYPES") or not filas: continue
    clave = todas.get(nom.upper()) or ({"COMBINATION DEFINITIONS": todas.get("LOAD COMBINATION DEFINITIONS")}.get(nom.upper()) if ENG == "safe" else None)
    if not clave:
        resumen.append(dict(tabla=nom, filas=len(filas), estado="NO EXISTE en la API")); log("NO EXISTE: %s" % nom); continue
    campos = []
    for f in filas:
        for k in f:
            if k not in campos: campos.append(k)
    ruta = os.path.join(tmp, "t%02d.csv" % n)
    with open(ruta, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh); w.writerow(campos)
        for f in filas: w.writerow([f.get(c, "") for c in campos])
    if nom.upper() in DESPUES: continue
    try:
        dt.SetTableForEditingCSVFile(clave, 1, ruta)
    except Exception as ex:
        resumen.append(dict(tabla=nom, estado="SetTable fallo: %s" % str(ex)[:80])); continue
    if not UNA_VEZ: continue
    res = dt.ApplyEditedTables(True)
    nums = [x for x in res if isinstance(x, int)]
    texto = next((x for x in res if isinstance(x, str) and len(x) > 0), "")
    resumen.append(dict(tabla=nom, filas=len(filas), ret=nums))
    open(PREF + ".importlog_completo.txt", "a", encoding="utf-8").write("\n######## %s (%d filas) %s\n%s\n" % (nom, len(filas), nums, texto))
    log("== %-55s filas %5d  -> %s" % (nom, len(filas), nums[:5]))
    if texto:
        for ln in texto.splitlines():
            if re.search(r"(?i)error|warning|fatal|field|record|not |could|invalid", ln): log("   | " + ln.strip())
def aplicar(etq):
    res = dt.ApplyEditedTables(True)
    nums = [x for x in res if isinstance(x, int)]
    texto = next((x for x in res if isinstance(x, str) and len(x) > 0), "")
    log("ApplyEditedTables (%s) -> %s" % (etq, nums))
    for ln in texto.splitlines():
        if re.search(r"(?i)error|warning|fatal|field name|record:|not found|could|invalid|table:", ln): log("   | " + ln.strip())
    return texto
if DESPUES and not UNA_VEZ:
    open(PREF + ".importlog_completo.txt", "w", encoding="utf-8").write(aplicar("sin %s" % sorted(DESPUES)))
    for nom, filas in T.items():
        if nom.upper() not in DESPUES: continue
        campos = []
        for f in filas:
            for k in f:
                if k not in campos: campos.append(k)
        ruta = os.path.join(tmp, "d_%s.csv" % abs(hash(nom)))
        with open(ruta, "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh); w.writerow(campos)
            for f in filas: w.writerow([f.get(c, "") for c in campos])
        dt.SetTableForEditingCSVFile(todas.get(nom.upper()), 1, ruta)
    open(PREF + ".importlog_completo.txt", "a", encoding="utf-8").write(aplicar("solo %s" % sorted(DESPUES)))
    try:
        log("restriccion nudo 52: %s | cargas nudo 1: %s" % (str(sm.PointObj.GetRestraint("52", [])), str(sm.PointObj.GetLoadForce("1", 0, [], [], [], [], [], [], [], [], [], [], 0))[:200]))
    except Exception as ex: log("consulta: %s" % str(ex)[:150])
elif not UNA_VEZ:
    res = dt.ApplyEditedTables(True)
    nums = [x for x in res if isinstance(x, int)]
    texto = next((x for x in res if isinstance(x, str) and len(x) > 0), "")
    open(PREF + ".importlog_completo.txt", "w", encoding="utf-8").write(texto)
    log("ApplyEditedTables (todas) -> %s" % nums)
    for ln in texto.splitlines():
        if re.search(r"(?i)error|warning|fatal|field name|record:|not found|could|invalid|table:", ln): log("   | " + ln.strip())
open(PREF + ".log.txt", "w", encoding="utf-8").write("\n".join(LOG))
out = dict(resumen=resumen, puntos=sm.PointObj.Count(), areas=sm.AreaObj.Count(),
           barras=sm.FrameObj.Count() if hasattr(sm, "FrameObj") else None)
nm = lambda r: [str(x) for x in r[1]] if r and r[0] else []
try:
    out["patrones"] = nm(sm.LoadPatterns.GetNameList(0, []))
    out["combos"] = nm(sm.RespCombo.GetNameList(0, []))
    out["selfwt"] = {p: float(sm.LoadPatterns.GetSelfWTMultiplier(p, 0)[0]) for p in out["patrones"]}
except Exception as ex:
    out["err_nombres"] = str(ex)[:100]
log("puntos %s areas %s barras %s patrones %s combos %s" % (out["puntos"], out["areas"], out["barras"], out.get("patrones"), out.get("combos")))
json.dump(out, open(PREF + ".json", "w"), indent=1)
if "--analizar" in sys.argv:
    sm.File.Save(PREF + (".sdb" if ENG == "sap" else ".fdb"))
    log("run -> %s  %.0f s" % (sm.Analyze.RunAnalysis(), time.time() - t0))
    pts = nm(sm.PointObj.GetNameList(0, []))
    if ENG == "safe":   # la malla de SAFE: nudos de analisis
        try: pts = nm(sm.PointElm.GetNameList(0, [])) or pts
        except Exception: pass
    out["casos"] = {}
    for c in ("Dead", "DNE", "Live", "SERVICIO", "DISENO"):
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        if c in out.get("combos", []): sm.Results.Setup.SetComboSelectedForOutput(c)
        else: sm.Results.Setup.SetCaseSelectedForOutput(c)
        U = {}
        for p in pts:
            try:
                r = sm.Results.JointDispl(p, 1 if ENG == "safe" else 0, 0, [], [], [], [], [], [], [], [], [], [], [])
            except Exception:
                continue
            if r[0]:
                U[p] = [float(r[q][0]) for q in (6, 7, 8, 9, 10, 11)]
                if ENG == "safe":
                    try:
                        c3 = sm.PointElm.GetCoordCartesian(p, 0, 0, 0); U[p] += [float(c3[0]), float(c3[1])]
                    except Exception: pass
        # BaseReact NO: en SAP2000 su recuperacion pide memoria aparte y, sin ella, sale un dialogo modal
        # («Error in recovering Base Shear response», medido 18-sep-2026). La reaccion se suma de los muelles.
        out["casos"][c] = {"U": U, "FZ": None}
        log("%s: %d nudos, FZ %s" % (c, len(U), out["casos"][c]["FZ"]))
    json.dump(out, open(PREF + ".json", "w"))
open(PREF + ".log.txt", "w", encoding="utf-8").write("\n".join(LOG))
o.ApplicationExit(False)
log("listo %.0f s" % (time.time() - t0))
