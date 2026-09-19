# -*- coding: utf-8 -*-
"""PNG del careo MISMO MODELO: Hekatan (x) vs SAFE 20 (y) nudo de elemento a nudo de elemento.
  python fig_mismo_modelo.py <pref>.pares.json salida.png "título" """
import json, sys
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
P = json.load(open(sys.argv[1])); tit = sys.argv[3] if len(sys.argv) > 3 else ""
fig, ax = plt.subplots(1, 4, figsize=(17, 4.4))
for a, (k, n, u) in zip(ax, [(0, "M11", "kN·m/m"), (1, "M22", "kN·m/m"), (2, "M12", "kN·m/m")]):
    x = [p["hk"][k] for p in P]; y = [p["sf"][k] for p in P]; m = max(map(abs, y))
    e = max(abs(i - j) for i, j in zip(x, y)) / m * 100
    a.plot([-m, m], [-m, m], "-", color="#999", lw=0.8); a.plot(x, y, ".", ms=2.5, color="#1f5fbf")
    a.set_title(f"{n} [{u}]  peor |Δ| = {e:.3f} % del máx"); a.set_xlabel("Hekatan"); a.set_ylabel("SAFE 20"); a.set_aspect("equal")
Q = [(v[0] * 1e4, v[1] * 1e4) for p in P for v in (p.get("as") or {}).values()]
m = max(q[1] for q in Q); a = ax[3]
a.plot([0, m], [0, m], "-", color="#999", lw=0.8); a.plot([q[0] for q in Q], [q[1] for q in Q], ".", ms=2.5, color="#c0392b")
a.set_title("As FE (4 dir/cara) [cm²/m]"); a.set_xlabel("Hekatan (feNode)"); a.set_ylabel("SAFE 20 (FDB)"); a.set_aspect("equal")
fig.suptitle(tit); fig.tight_layout(); fig.savefig(sys.argv[2], dpi=110); print(sys.argv[2])
