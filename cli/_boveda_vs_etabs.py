# -*- coding: utf-8 -*-
"""Careo nudo a nudo de la boveda dibujada sobre el IFC: Hekatan (boveda_dump.json) vs ETABS (boveda_etabs.txt).
Casa por COORDENADAS (ETABS renumera los joints al importar el e2k). Tolerancia = % del maximo (reference_tolerancia_nodal_vs_maximo)."""
import json, sys, statistics
dump = sys.argv[1] if len(sys.argv) > 1 else "cli/shots/boveda_dump.json"
txt = sys.argv[2] if len(sys.argv) > 2 else "cli/shots/boveda_etabs.txt"
L = open(txt, encoding="utf-8", errors="replace").read().splitlines()
sec = None; xyz = {}; disp = {}; reac = {}
for l in L:
    if l.startswith("=== JOINT COORDINATES"): sec = "c"; continue
    if l.startswith("=== JOINT DISPLACEMENTS"): sec = "d"; continue
    if l.startswith("=== JOINT REACTIONS"): sec = "r"; continue
    if l.startswith("==="): sec = None; continue
    t = l.split()
    if sec == "c" and len(t) == 4 and t[0].isdigit(): xyz[t[0]] = tuple(float(v) for v in t[1:4])
    elif sec in ("d", "r") and len(t) >= 8 and t[1] == "Dead": (disp if sec == "d" else reac)[t[0]] = [float(v) for v in t[2:8]]
d = json.load(open(dump)); N = d["nodes"]; hk = d["deformations"]; rk = d["reactions"]
def et_de(p):
    for j, q in xyz.items():
        if abs(q[0]-p[0]) < 2e-3 and abs(q[1]-p[1]) < 2e-3 and abs(q[2]-p[2]) < 2e-3: return j
    return None
mxH = max(abs(v[2]) for v in hk.values()); mxE = max(abs(v[2]) for v in disp.values())
filas = []; sinPar = 0
for k, v in hk.items():
    j = et_de(N[int(k)])
    if j is None or j not in disp: sinPar += 1; continue
    e = disp[j]
    filas.append((abs(v[2]-e[2])/mxH*100, int(k)+1, j, v[2]*1000, e[2]*1000, N[int(k)]))
filas.sort(reverse=True)
print("nudos Hekatan %d | ETABS %d | casados %d | sin pareja %d" % (len(hk), len(disp), len(filas), sinPar))
print("uz max  Hekatan %.3f mm | ETABS %.3f mm | dif %.2f %%" % (mxH*1000, mxE*1000, (mxH-mxE)/mxE*100))
print("sum Fz  Hekatan %.1f kN | ETABS %.1f kN" % (sum(v[2] for v in rk.values()), sum(v[2] for v in reac.values())))
print("uz nudo a nudo (%% del maximo): media %.3f | p95 %.3f | peor %.3f | dentro del 1%%: %d/%d" % (
    statistics.mean(f[0] for f in filas), sorted(f[0] for f in filas)[int(0.95*len(filas))-1], filas[0][0],
    sum(1 for f in filas if f[0] < 1), len(filas)))
print("peores 5:")
for p, n, j, a, b, c in filas[:5]: print("  Hekatan %3d / ETABS %3s  (%.2f, %.2f, %.2f)  uz %8.3f vs %8.3f mm  %.2f %%" % (n, j, *c, a, b, p))
