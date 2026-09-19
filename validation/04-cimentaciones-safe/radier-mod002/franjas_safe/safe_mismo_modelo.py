# -*- coding: utf-8 -*-
"""Lado SAFE 20 del careo MISMO MODELO: importa por TABLAS el .f2k que exporta Hekatan (sin File.OpenFile,
sin ventanas), analiza, saca AreaForceShell por nudo de elemento (DISEÑO), diseña (StartSlabDesign),
guarda el FDB (para fdb_fe.py) y sale.  SAFE OCULTO: set CSI_NUEVA=1.

  python safe_mismo_modelo.py modelo_SAFE20.f2k salida_prefijo

Al .f2k se le AÑADEN (solo datos de diseño, el análisis no cambia) las preferencias del modelo original de
SAFE (MOD_002: recubrimientos 15 mm, Ø18, capa interior B), f'c 21 MPa y fy 4200 kgf/cm² (los del FDB original) en los
materiales de diseño, y DISEÑO como combinación de diseño de losa.
"""
import csv, json, os, re, sys, tempfile, time
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\safe-cli\cli")
import csi_cli

SRC, PREF = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
assert os.environ.get("CSI_NUEVA") == "1", "poner CSI_NUEVA=1 (no engancharse a un SAFE abierto)"
t0 = time.time(); LOG = []
def log(s): LOG.append(str(s)); print(s, flush=True)

def tablas(txt):
    txt = txt.replace("\r", ""); txt = re.sub(r" _\n\s+", "   ", txt)
    out, cur = {}, None
    for ln in txt.split("\n"):
        m = re.match(r'^TABLE:\s+"([^"]+)"', ln)
        if m: cur = m.group(1); out.setdefault(cur, []); continue
        if cur is None or not ln.strip() or ln.startswith("END TABLE"): continue
        fila = {k.strip('"'): v.strip('"') for k, v in re.findall(r'("[^"]*"|[^\s=]+)=("[^"]*"|\S+)', ln.strip())}
        if fila: out[cur].append(fila)
    return out

T = tablas(open(SRC, encoding="utf-8", errors="replace").read())
# ---- datos de diseño (no tocan el análisis) ----
for f in T.get("MATERIAL PROPERTIES - CONCRETE DATA", []): f["Fc"] = "21000"               # 21 MPa: el f'c del FDB original (2.1414 kgf/mm2)
for f in T.get("MATERIAL PROPERTIES - REBAR DATA", []): f["Fy"] = "411879.3"; f["Fye"] = "411879.3"   # 4200 kgf/cm2
PREF_ACI = dict(PhiTen="0.9", PhiComp="0.65", PhiShear="0.75", CoverTop="0.015", CoverBot="0.015", BarSize="18",
                InnerLayer="Layer B", SlabType="Two Way")
PREF_ACI["Ignore Pu?"] = "No"; PREF_ACI["Increase Flexural Rebar?"] = "No"     # como MOD_002 (el defecto de SAFE es Ignore Pu = Yes)
# MALLA IDÉNTICA: sin esto SAFE remalla («Default» + localized meshing parte las áreas en los nudos colgados:
# 254 -> 351 elementos, medido). «No Auto Mesh» deja los 254 elementos de Hekatan tal cual.
for f in T.get("AREA ASSIGNMENTS - FLOOR AUTO MESH OPTIONS", []): f["Mesh Option"] = "No Auto Mesh"
COMBO_DIS = os.environ.get("HK_COMBO_NOMBRE", "DISE\u00d1O")

obj, sm, started = csi_cli.start_engine("safe", 6, False)
assert started, "no es instancia nueva"
try:
    sm.InitializeNewModel(6); sm.File.NewBlank()
    dt = sm.DatabaseTables
    r = dt.GetAllTables()
    cand = [x for x in r if isinstance(x, (list, tuple)) and x and isinstance(x[0], str)]
    todas = {str(t).upper(): str(t) for t in cand[0]} if cand else {}
    open(PREF + ".tablas_api.txt", "w", encoding="utf-8").write("\n".join(sorted(todas.values())))
    tmp = tempfile.mkdtemp(prefix="safe_mm_")
    def cargar(nom, filas, i):
        clave = todas.get(nom.upper())
        if not clave: log("NO EXISTE en la API: %s" % nom); return
        campos = []
        for f in filas:
            for k in f:
                if k not in campos: campos.append(k)
        ruta = os.path.join(tmp, "t%03d.csv" % i)
        with open(ruta, "w", newline="", encoding="utf-8") as fh:
            w = csv.writer(fh); w.writerow(campos)
            for f in filas: w.writerow([f.get(c, "") for c in campos])
        dt.SetTableForEditingCSVFile(clave, 1, ruta)
    def aplicar(etq):
        res = dt.ApplyEditedTables(True)
        nums = [x for x in res if isinstance(x, int)]
        texto = next((x for x in res if isinstance(x, str) and len(x) > 0), "")
        log("ApplyEditedTables (%s) -> %s" % (etq, nums))
        open(PREF + ".importlog.txt", "a", encoding="utf-8").write("\n##### %s %s\n%s\n" % (etq, nums, texto))
        for ln in texto.splitlines():
            if re.search(r"(?i)error|warning|fatal|not found|invalid", ln): log("   | " + ln.strip())
    for i, (nom, filas) in enumerate(T.items()):
        if nom.upper() in ("PROGRAM CONTROL", "DATABASE FORMAT TYPES") or not filas: continue
        cargar(nom, filas, i)
    aplicar("modelo")
    # preferencias y combinación de diseño (segunda pasada: dependen del modelo)
    pref_t = [k for k in todas.values() if re.match(r"(?i)concrete (slab )?design preferences - ACI 318-19", k)] or \
             [k for k in todas.values() if re.match(r"(?i)concrete (slab )?design preferences - ACI 318", k)]
    log("tablas de preferencias: %s" % pref_t)
    try:
        log("código antes: %s" % str(sm.DesignConcreteSlab.GetCode()))
    except Exception as ex: log("GetCode: %s" % ex)
    for c in ("ACI 318-19", "ACI 318-14"):
        try:
            rr = sm.DesignConcreteSlab.SetCode(c); log("SetCode %s -> %s" % (c, rr))
            if rr == 0 or (isinstance(rr, (list, tuple)) and rr[-1] == 0): break
        except Exception as ex: log("SetCode %s: %s" % (c, ex))
    try: log("código: %s" % str(sm.DesignConcreteSlab.GetCode()))
    except Exception: pass
    pref_t = [k for k in todas.values() if k.upper().startswith("CONCRETE DESIGN PREFERENCES - ACI 318-19")] or pref_t
    if pref_t:
        cargar(pref_t[0], [PREF_ACI], 900)
    ct = todas.get("CONCRETE SLAB DESIGN LOAD COMBINATION DATA")
    if ct: cargar(ct, [{"Combo Type": "Strength", "Combo Name": COMBO_DIS}], 901)
    aplicar("diseño")
    for t in [x for x in todas.values() if re.search(r"(?i)design preferences - ACI|slab design load combination", x)]:
        try:
            fn = PREF + ".T_" + re.sub(r"\W+", "_", t)[:60] + ".csv"
            dt.GetTableForDisplayCSVFile(t, [], "All", 0, fn, ";")
        except Exception as ex: log("tabla %s: %s" % (t, ex))
    fdb = PREF + ".fdb"
    log("Save -> %s" % sm.File.Save(fdb))
    log("RunAnalysis -> %s  %.0f s" % (sm.Analyze.RunAnalysis(), time.time() - t0))
    # malla de análisis
    ne, elms = sm.AreaElm.GetNameList()[:2]
    E = {}
    for e in elms:
        n, pts = sm.AreaElm.GetPoints(e)[:2]
        E[e] = dict(pts=list(pts), obj=sm.AreaElm.GetObj(e)[0], prop=sm.AreaElm.GetProperty(e)[0])
    npn, pnames = sm.PointElm.GetNameList()[:2]
    P = {p: list(sm.PointElm.GetCoordCartesian(p)[:3]) for p in pnames}
    json.dump(dict(elements=E, points=P), open(PREF + ".malla.json", "w"))
    log("malla SAFE: %d elementos, %d nudos" % (len(E), len(P)))
    R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput()
    for c in ("Dead", "DNE", "Live"): R.Setup.SetCaseSelectedForOutput(c)
    R.Setup.SetComboSelectedForOutput(COMBO_DIS)
    rr = R.AreaForceShell("All", 2)
    cols = ["Obj", "Elm", "PointElm", "LoadCase", "StepType", "StepNum", "F11", "F22", "F12", "FMax", "FMin", "FAngle", "FVM",
            "M11", "M22", "M12", "MMax", "MMin", "MAngle", "V13", "V23", "VMax", "VAngle"]
    with open(PREF + ".shell_forces.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";"); w.writerow(cols)
        for i in range(rr[0]):
            w.writerow([rr[1 + j][i] if j < 6 else repr(float(rr[1 + j][i])) for j in range(len(cols))])
    log("AreaForceShell: %d filas (kN, m)" % rr[0])
    log("StartSlabDesign -> %s  %.0f s" % (sm.DesignConcreteSlab.StartSlabDesign(), time.time() - t0))
    log("Save -> %s" % sm.File.Save(fdb))
finally:
    open(PREF + ".log.txt", "w", encoding="utf-8").write("\n".join(LOG))
    try: obj.ApplicationExit(False)
    except Exception as ex: print("exit", ex)
log("listo %.0f s" % (time.time() - t0))
open(PREF + ".log.txt", "w", encoding="utf-8").write("\n".join(LOG))
