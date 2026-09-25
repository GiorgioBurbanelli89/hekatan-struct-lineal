# -*- coding: utf-8 -*-
"""SECCIÓN TRANSVERSAL del muro Demo01 de GEO5 como MEMBRANA (Q4, 1 m de espesor = 1 m de muro), plano XZ:
fuste inclinado + zapata (puntera 1.00, talón 2.50, canto 0.60) + dentellón 0.50 × 0.20 bajo el extremo del talón.
Geometría leída de GEO5 (marco Geometry) y del polígono del .guz: (0,0) (0,5) (2.5,5) (2.5,5.6) (2.5,5.8) (2,5.8)
(2,5.6) (−1.6,5.6) (−1.6,5.0) (−0.6,5.0) (−0.2,0), x desde el trasdós, profundidad hacia abajo.

Mismas coordenadas que la barra (gen_fuste2d.py): x = 0 en el centroide de la base del fuste, z = 0 en la cara de
arriba de la zapata. Cargas: las MISMAS por nivel que la barra (fuste2d_estatica.json): empuje en el nudo del trasdós,
peso en la columna central del fuste (i = 3 de 6, que cae justo en el eje de centroides) y la fuerza de 30 kN a
0.20 m sobre la coronación como Fx en el trasdós + un par vertical ±30 kN en las dos esquinas de la coronación
(0.20 m × 30 = 6 kNm = los 0.20 m de palanca). Apoyo: empotrada la cara de abajo de la zapata y del dentellón.
Shell grueso (Mindlin) con rigidez completa: solo trabaja en su plano (todas las cargas están en XZ).

    python tests/muro_demo01/gen_membrana.py  →  tests/muro_demo01/membrana.heks
"""
import json, os, sys
try: sys.stdout.reconfigure(encoding="utf-8")
except Exception: pass
AQUI = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(AQUI, "fuste2d_estatica.json")))
E, NU, T = 3.0e7, 0.2, 1.0
H, TTOP, TBASE = 5.0, 0.20, 0.60
XB = TBASE / 2                                  # trasdós en x = 0.30
XT, XH = XB - TBASE - 1.0, XB + 2.5             # extremo de la puntera (−1.30) y del talón (2.80)
HZ, XD0 = 0.60, XH - 0.5                        # canto de zapata; dentellón de x = 2.30 a 2.80
HD = 0.20
NC = 6                                          # divisiones en el canto del fuste
xf = lambda z: XB - (TBASE + (TTOP - TBASE) * z / H)   # cara vista del fuste

nodos, idx = [], {}
def nodo(x, z):
    k = (round(x, 9), round(z, 9))
    if k not in idx: idx[k] = len(nodos) + 1; nodos.append(k)
    return idx[k]
quads = []
# fuste: filas en los mismos z que la barra
zs = [n["z"] for n in S["niveles"]]
fil = [[nodo(xf(z) + (XB - xf(z)) * i / NC, z) for i in range(NC + 1)] for z in zs]
for j in range(len(zs) - 1):
    for i in range(NC):
        quads.append((fil[j][i], fil[j][i + 1], fil[j + 1][i + 1], fil[j + 1][i]))
# zapata: rejilla de 0.10 m; en z = 0 comparte los nudos de la base del fuste (x = −0.30 … 0.30 cada 0.10)
xs = [round(XT + 0.1 * k, 9) for k in range(int(round((XH - XT) / 0.1)) + 1)]
zz = [round(-HZ + 0.1 * k, 9) for k in range(int(round(HZ / 0.1)) + 1)]
for j in range(len(zz) - 1):
    for i in range(len(xs) - 1):
        quads.append((nodo(xs[i], zz[j]), nodo(xs[i + 1], zz[j]), nodo(xs[i + 1], zz[j + 1]), nodo(xs[i], zz[j + 1])))
# dentellón
xd = [x for x in xs if x >= XD0 - 1e-9]
zd = [-HZ - HD, -HZ - HD / 2, -HZ]
for j in range(2):
    for i in range(len(xd) - 1):
        quads.append((nodo(xd[i], zd[j]), nodo(xd[i + 1], zd[j]), nodo(xd[i + 1], zd[j + 1]), nodo(xd[i], zd[j + 1])))

L = ["# SECCIÓN TRANSVERSAL del muro Demo01 (GEO5) como membrana Q4, plano XZ, 1 m de espesor — gen_membrana.py"]
L += [f"node {k+1} {x:.10f} 0 {z:.10f}" for k, (x, z) in enumerate(nodos)]
apoyos = [idx[(x, round(-HZ, 9))] for x in xs if x <= XD0 + 1e-9] + [idx[(x, round(-HZ - HD, 9))] for x in xd]
L += [f"support {n} fixed" for n in apoyos]
for e, q in enumerate(quads):
    L.append(f"shell {e+1} {q[0]} {q[1]} {q[2]} {q[3]} {T} {E:g} 0 0")
    L.append(f"shelltype {e+1} thick")
cargas = {}
def suma(n, fx=0.0, fz=0.0):
    c = cargas.setdefault(n, [0.0, 0.0]); c[0] += fx; c[1] += fz
for j, nv in enumerate(S["niveles"]):
    suma(fil[j][NC], fx=nv["Fx"])                 # empuje (y los 30 kN en la coronación) en el trasdós
    suma(fil[j][NC // 2], fz=nv["Fz"])            # peso sobre el eje de centroides
    if abs(nv["My"]) > 1e-12:                     # My = 0.20·(−30) → par vertical en las esquinas de la coronación
        b = XB - xf(nv["z"]); f = nv["My"] / b     # My = −(x_f·Fz_f) − (x_b·Fz_b), Fz_b = −Fz_f  →  Fz_f = My / b
        suma(fil[j][0], fz=f); suma(fil[j][NC], fz=-f)
for n, (fx, fz) in sorted(cargas.items()):
    L.append(f"load {n} {fx:.10f} 0 {fz:.10f} 0 0 0")
L.append("solve")
open(os.path.join(AQUI, "membrana.heks"), "w", encoding="utf-8").write("\n".join(L) + "\n")
fx = sum(c[0] for c in cargas.values()); fz = sum(c[1] for c in cargas.values())
my = sum(nodos[n - 1][1] * c[0] - nodos[n - 1][0] * c[1] for n, c in cargas.items())
print(f"{len(nodos)} nudos, {len(quads)} Q4, {len(apoyos)} apoyos; ΣFx {fx:.4f}  ΣFz {fz:.4f}  ΣMy(origen) {my:.4f}")
print(f"(la barra: ΣFx {-S['V_base']:.4f}  ΣFz {-S['peso']:.4f}  ΣMy {-S['M_base']:.4f})")
