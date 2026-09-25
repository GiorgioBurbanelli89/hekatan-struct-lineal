# -*- coding: utf-8 -*-
"""El muro Demo01 de GEO5 en 3D con SÓLIDOS H8: la MISMA sección de la membrana (gen_membrana.py) extruida
1 m a lo largo del muro (eje y) en 2 capas. Mismas cargas: cada carga nodal de la membrana se reparte ¼ · ½ · ¼
en y = 0 · 0.5 · 1 (resultante y posición en x, z EXACTAS). Apoyo: ux, uy, uz fijos en la cara de abajo de la
zapata y del dentellón. H8 con modos incompatibles (= Solid de SAP2000 por defecto).

    python tests/muro_demo01/gen_solido3d.py  →  solido3d.heks
"""
import os, re, sys
try: sys.stdout.reconfigure(encoding="utf-8")
except Exception: pass
AQUI = os.path.dirname(os.path.abspath(__file__))
E, NU, LY, NY = 3.0e7, 0.2, 1.0, 2
nodos, quads, apoyos, cargas = {}, [], [], {}
for l in open(os.path.join(AQUI, "membrana.heks"), encoding="utf-8"):
    t = l.split()
    if not t: continue
    if t[0] == "node": nodos[int(t[1])] = (float(t[2]), float(t[4]))
    elif t[0] == "shell": quads.append([int(v) for v in t[2:6]])
    elif t[0] == "support": apoyos.append(int(t[1]))
    elif t[0] == "load": cargas[int(t[1])] = (float(t[2]), float(t[4]))
nn = len(nodos)
gid = lambda n, k: k * nn + n                          # nudo n de la membrana en la capa k (y = k·LY/NY)
L = ["# muro Demo01 (GEO5) en SÓLIDOS H8: la sección de membrana.heks extruida 1 m en y — gen_solido3d.py",
     "incompatible 1"]
for k in range(NY + 1):
    for n in range(1, nn + 1):
        x, z = nodos[n]; L.append(f"node {gid(n, k)} {x:.10f} {k * LY / NY:.10f} {z:.10f}")
for n in apoyos:
    for k in range(NY + 1): L.append(f"support {gid(n, k)} 1 1 1 0 0 0")
e = 0
for k in range(NY):
    for q in quads:
        # la cara (x, z) antihoraria mira a −y → «abajo» del H8 = capa k+1, «arriba» = capa k (jacobiano > 0)
        e += 1
        L.append("hex %d %s %g %g 0" % (e, " ".join(str(gid(n, k + 1)) for n in q) + " " + " ".join(str(gid(n, k)) for n in q), E, NU))
w = [0.25, 0.5, 0.25]
for n, (fx, fz) in cargas.items():
    for k in range(NY + 1):
        L.append(f"load {gid(n, k)} {fx * w[k]:.10f} 0 {fz * w[k]:.10f} 0 0 0")
L.append("solve")
open(os.path.join(AQUI, "solido3d.heks"), "w", encoding="utf-8").write("\n".join(L) + "\n")
print(f"{nn * (NY + 1)} nudos, {e} H8, {len(apoyos) * (NY + 1)} apoyos, {len(cargas) * (NY + 1)} cargas")
