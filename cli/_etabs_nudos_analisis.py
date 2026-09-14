# -*- coding: utf-8 -*-
"""¿Dónde mete ETABS los nudos de ANÁLISIS que el modelo no tiene? Abre un .EDB, analiza y vuelca la tabla
«Objects and Elements - Joints» a CSV, y cuenta los nudos que NO están en el .heks (por cota z).
    python cli/_etabs_nudos_analisis.py RUTA.EDB RUTA_heks_dead.json SALIDA.csv"""
import sys, os, json, math, csv
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c
edb, refj, salida = [os.path.abspath(a) for a in sys.argv[1:4]]
_, S, _ = c.start_engine("etabs", 6, True)
c.load_model_from_file(S, edb, 6)
S.SetPresentUnits(6)
print("Run", S.Analyze.RunAnalysis(), flush=True)
r = S.DatabaseTables.GetTableForDisplayArray("Objects and Elements - Joints", [], "", 0, [], 0, [])
campos, n, datos = list(r[2]), r[3], list(r[4])
filas = [datos[i * len(campos): (i + 1) * len(campos)] for i in range(n)]
with open(salida, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(campos); w.writerows(filas)
print("campos", campos, flush=True)
ref = json.load(open(refj))["puntos"]
ix = {k: campos.index(k) for k in campos if k in ("GlobalX", "GlobalY", "GlobalZ", "ObjType", "ObjName", "Story")}
nuevos = {}
for fl in filas:
    try:
        x, y, z = (float(fl[ix[k]]) for k in ("GlobalX", "GlobalY", "GlobalZ"))
    except Exception:
        continue
    if min(math.dist((x, y, z), (q["x"], q["y"], q["z"])) for q in ref) > 5e-3:
        clave = (round(z, 2), fl[ix["ObjType"]] if "ObjType" in ix else "?")
        nuevos[clave] = nuevos.get(clave, 0) + 1
print("nudos de analisis", n, "· nuevos (no estan en el .heks):", sum(nuevos.values()), flush=True)
for (z, t), k in sorted(nuevos.items()):
    print("  z %6.2f  %-10s %d" % (z, t, k), flush=True)
os._exit(0)
