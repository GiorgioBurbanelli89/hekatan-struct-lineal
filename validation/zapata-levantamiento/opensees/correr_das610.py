# -*- coding: utf-8 -*-
"""Corre el modelo que exporta Hekatan Struct (das610.py: ShellMITC4 + zeroLength ENT = suelo sin
tracción) en OpenSeesPy, imprime q_max = ks·(−w_min) y dibuja la presión con SUS resultados."""
import json, subprocess, sys, time
t0 = time.time()
print("OpenSeesPy - Das ej. 6.10 exportado por Hekatan Struct (das610.py)")
print("  losa: ShellMITC4 · suelo: zeroLength + uniaxialMaterial ENT (no resiste traccion)")
subprocess.run([sys.executable, "das610.py", "ops_das610.json"], check=True)
d = json.load(open("ops_das610.json"))
w = {int(k): v for k, v in d["U3"].items()}
KS = 2000.0
wmin = min(w.values()); nc = sum(1 for v in w.values() if v < 0)
print("  analyze = %d (0 = convergio)" % d["ok"])
print("  nudos apoyados: %d de %d" % (nc, len(w)))
print("  q_max = ks * (-w_min) = %.0f * %.6f = %.3f tonf/m2" % (KS, -wmin, -wmin * KS))
print("  tiempo: %.1f s" % (time.time() - t0))
import numpy as np, matplotlib.pyplot as plt
xy = {}
for ln in open("../das_ej610.heks", encoding="utf-8"):
    t = ln.split()
    if t and t[0] == "node": xy[int(t[1])] = (float(t[2]), float(t[3]))
xs = sorted({p[0] for p in xy.values()}); ys = sorted({p[1] for p in xy.values()})
Z = np.full((len(ys), len(xs)), np.nan)
for n, v in w.items():
    if n in xy: x, y = xy[n]; Z[ys.index(y), xs.index(x)] = max(0, -v) * KS
fig, ax = plt.subplots(figsize=(6, 5))
cs = ax.contourf(xs, ys, Z, levels=np.linspace(0, 85, 18), cmap="jet"); ax.contour(xs, ys, Z, levels=[0.05], colors="k", linewidths=2)
ax.set_title("OpenSeesPy: presion de contacto\nq_max = %.3f tonf/m2 (linea negra = borde levantado)" % np.nanmax(Z)); ax.set_aspect("equal")
plt.colorbar(cs, label="q (tonf/m2)"); plt.tight_layout(); plt.show()
