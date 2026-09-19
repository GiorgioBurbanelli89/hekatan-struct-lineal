# -*- coding: utf-8 -*-
u"""SAFE 20: la zapata con levantamiento. Importa el .f2k de Hekatan por tablas (csi-cli/safe-cli),
añade un caso «Nonlinear (Allow Uplift)» por patrón y lee U3 de todos los nudos.

    python csi_levantamiento_safe.py csi/das610_SAFE20.f2k csi/safe_das610.json DAS

La OAPI de SAFE no tiene LoadCases.StaticNonlinear: el caso va por DatabaseTables. La tabla y sus
campos se LEEN de SAFE (GetAllTables / GetAllFieldsInTable) y se imprimen, no se suponen.
"""
import json
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "csi-cli", "safe-cli", "cli")))
os.environ["CSI_NUEVA"] = "1"
import csi_cli  # noqa: E402

SRC, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
PATS = sys.argv[3].split(",") if len(sys.argv) > 3 else ["DAS"]
t0 = time.time()


def log(m):
    print("[%6.1fs] %s" % (time.time() - t0, m), flush=True)


res = {"prog": "safe", "src": os.path.basename(SRC), "casos": {}}
obj, sm, _ = csi_cli.start_engine("safe", 6, True)
try:
    csi_cli.load_model_from_file(sm, SRC, 6, "safe")
    sm.SetPresentUnits(6)
    dt = sm.DatabaseTables
    r = dt.GetAllTables()
    cand = [x for x in r if isinstance(x, (list, tuple)) and x and isinstance(x[0], str)]
    tablas = [str(t) for t in cand[0]] if cand else []
    lc = [t for t in tablas if "Load Case" in t]
    log("tablas de casos: %s" % lc)
    res["tablas_casos"] = lc
    campos = {}
    for t in lc:
        try:
            f = dt.GetAllFieldsInTable(t)
            arr = [x for x in f if isinstance(x, (list, tuple))]
            campos[t] = [list(a) for a in arr[:4]]
            log("%s -> %s" % (t, [list(a)[:12] for a in arr[1:3]]))
        except Exception as e:
            campos[t] = str(e)
    res["campos"] = campos
    # el caso no lineal: tabla «Load Case Definitions - Nonlinear Static» (nombre leído arriba)
    tnl = next((t for t in lc if "Nonlinear Static" in t), None)
    if not tnl:
        raise SystemExit("SAFE no tiene tabla de caso no lineal estático: %s" % lc)
    import csv, tempfile
    ruta = os.path.join(tempfile.mkdtemp(prefix="safe_nl_"), "nl.csv")
    nombres = [str(x) for x in campos[tnl][1]] if isinstance(campos[tnl], list) and len(campos[tnl]) > 1 else []
    log("campos (nombre) de %s: %s" % (tnl, nombres))
    fila = {}
    # NL_ con la tolerancia de SAFE; NLT_ igual con «Iteration Tolerance» 1e-6
    for p in PATS:
        for pref, tol in (("NL_", None), ("NLT_", "1E-06")):
            filas = []
            for n in nombres:
                nl = n.lower()
                v = ""
                if nl == "name": v = pref + p
                elif nl == "initial condition": v = "Unstressed"
                elif nl == "load type": v = "Load"
                elif nl == "load name": v = p
                elif nl == "load sf": v = "1"
                elif nl == "iteration tolerance" and tol: v = tol
                filas.append(v)
            fila[pref + p] = filas
    with open(ruta, "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(nombres)
        for k in fila:
            w.writerow(fila[k])
    log("CSV del caso NL: %s" % fila)
    dt.SetTableForEditingCSVFile(tnl, 1, ruta)
    rr = dt.ApplyEditedTables(True)
    res["apply_nl"] = str(rr)[:2000]
    log("ApplyEditedTables -> %s" % str(rr)[:600])
    # lo que SAFE entendió: la fila del caso y su tipo en el resumen
    for t in (tnl, "Load Case Definitions - Summary"):
        try:
            g = dt.GetTableForDisplayArray(t, [], "", 0, [], 0, [])
            res["leido_" + t] = [str(x)[:1500] for x in g]
            log("%s -> %s" % (t, str(g)[:900]))
        except Exception as e:
            log("GetTableForDisplayArray %s: %s" % (t, e))
    csi_cli.analyze(sm, "safe")
    for caso in PATS + ["NL_" + p for p in PATS] + ["NLT_" + p for p in PATS]:
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        sm.Results.Setup.SetCaseSelectedForOutput(caso)
        try:
            sm.Results.Setup.SetOptionNLStatic(3)
        except Exception:
            pass
        names = list(sm.PointElm.GetNameList()[1])
        wd = {}
        for nm in names:
            q = sm.Results.JointDispl(nm, 1, 0, [], [], [], [], [], [], [], [], [], [], [])
            if q[0]:
                wd[str(q[1][0])] = float(q[8][-1])
        res["casos"][caso] = {"n": len(wd), "U3": wd}
        log("%-8s %d nudos  U3 min %s" % (caso, len(wd), min(wd.values()) if wd else None))
    res["seg"] = time.time() - t0
    json.dump(res, open(OUT, "w", encoding="utf-8"))
    log("-> %s" % OUT)
finally:
    try:
        obj.ApplicationExit(False)
        log("SAFE cerrado")
    except Exception:
        pass
