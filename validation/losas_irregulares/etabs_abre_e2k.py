# -*- coding: utf-8 -*-
"""IDA Y VUELTA con ETABS: abre el .e2k que EXPORTA Hekatan (modelos/<caso>/<caso>.e2k) con csi-cli
(OAPI headless; asi ETABS no se queda en un dialogo como con OpenFile a pelo), corre y compara el
caso Dead nudo a nudo (emparejado por COORDENADA) con lo que dio ETABS mallando solo.

    python etabs_abre_e2k.py            # los 7 casos
    python etabs_abre_e2k.py losa_T

Sale modelos/<caso>/<caso>_idavuelta_etabs.json y el listado de csi-cli <caso>_idavuelta_etabs.txt
"""
import json, os, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")
AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.normpath(os.path.join(AQUI, "..", "isse", "automesh", "etabs_poligono"))
CLI = os.path.normpath(os.path.join(AQUI, "..", "..", "..", "csi-cli", "hekatan-csi-cli", "csi_cli.py"))
TODOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"]

def leer(txt):
    X, U, sec = {}, {}, None
    for ln in open(txt, encoding="utf-8", errors="replace"):
        if ln.startswith("==="): sec = ln; continue
        p = ln.split()
        if sec and "JOINT COORDINATES" in sec and len(p) == 4 and p[0] != "Joint":
            X[p[0]] = tuple(float(v) for v in p[1:])
        if sec and "JOINT DISPLACEMENTS" in sec and len(p) == 8 and p[1] == "Dead":
            U[p[0]] = [float(v) for v in p[2:5]]
    return X, U

BASE = sys.argv[sys.argv.index("--dir") + 1] if "--dir" in sys.argv else os.path.join(AQUI, "modelos")   # otra carpeta de modelos
args = [a for i, a in enumerate(sys.argv[1:], 1) if not a.startswith("--") and sys.argv[i - 1] != "--dir"]
for caso in args or TODOS:
    d = os.path.join(BASE, caso); txt = os.path.join(d, caso + "_idavuelta_etabs.txt")
    subprocess.run([sys.executable, CLI, "--engine", "etabs", "--open", os.path.join(d, caso + ".e2k"), "--out", txt],
                   check=True, capture_output=True, timeout=900)
    ref = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))["etabs"]
    X, U = leer(txt)
    wmax = max(abs(v[2]) for v in ref["desplaz"] if v)
    peor, n, out = 0.0, 0, []
    for p, v in zip(ref["nudos"], ref["desplaz"]):
        j = min(X, key=lambda k: sum((X[k][c] - p[c]) ** 2 for c in range(3)))
        if v is None or j not in U or sum((X[j][c] - p[c]) ** 2 for c in range(3)) > 1e-8: out.append(None); continue
        out.append(U[j]); n += 1
        peor = max(peor, max(abs(U[j][c] - v[c]) for c in range(3)) / wmax * 100)
    json.dump({"prog": "etabs", "caso": caso, "fichero": caso + ".e2k", "desplaz": out, "peor_pct": peor, "nudos": n},
              open(os.path.join(d, caso + "_idavuelta_etabs.json"), "w"), indent=1)
    print("%-22s ETABS abre %s.e2k · %d/%d nudos casados · peor nudo vs ETABS original %.2e %% del max"
          % (caso, caso, n, len(ref["nudos"]), peor), flush=True)
