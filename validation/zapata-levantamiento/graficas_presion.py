# -*- coding: utf-8 -*-
"""PNG de la presión de contacto q = ks·(−w) (0 donde se levanta) de Hekatan, SAP2000, SAFE y ETABS
para el ejemplo 6.10 de Das, más el caso lineal (suelo que tira) para ver la diferencia.
    python graficas_presion.py  -> ../../registros/zapata_levantamiento_png/das610_presion_*.png"""
import json, os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
AQ = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQ, "..", "..", "registros", "zapata_levantamiento_png")
KS = 2000.0
xy = {}
for ln in open(os.path.join(AQ, "das_ej610.heks"), encoding="utf-8"):
    t = ln.split()
    if t and t[0] == "node":
        xy[t[1]] = (float(t[2]), float(t[3]))
xs = sorted({v[0] for v in xy.values()}); ys = sorted({v[1] for v in xy.values()})
def malla(U3):
    Z = np.full((len(ys), len(xs)), np.nan)
    for n, w in U3.items():
        if n in xy:
            x, y = xy[n]; Z[ys.index(y), xs.index(x)] = max(0.0, -w) * KS
    return Z
paneles = [("Hekatan", "csi/hekatan_das610.json", "NL_DAS"), ("SAP2000", "csi/sap2000_das610.json", "NLT_DAS"),
           ("SAFE 20", "csi/safe_das610.json", "NLT_DAS"), ("ETABS 22", "csi/etabs_das610.json", "NLT_DAS"),
           ("SAP2000 LINEAL (el suelo tira)", "csi/sap2000_das610.json", "DAS")]
fig, ax = plt.subplots(1, 5, figsize=(22, 4.8))
for a, (tit, f, caso) in zip(ax, paneles):
    J = json.load(open(os.path.join(AQ, f), encoding="utf-8"))
    U3 = J["casos"][caso]["U3"]
    Z = malla(U3)
    if "LINEAL" in tit:
        Z = np.full((len(ys), len(xs)), np.nan)
        for n, w in U3.items():
            if n in xy:
                x, y = xy[n]; Z[ys.index(y), xs.index(x)] = -w * KS
    cs = a.contourf(xs, ys, Z, levels=np.linspace(min(0, np.nanmin(Z)), 85, 18), cmap="jet_r" if False else "jet")
    a.contour(xs, ys, Z, levels=[0.0], colors="k", linewidths=2)
    a.plot([0.75, 1.05, 1.05, 0.75, 0.75], [0.9, 0.9, 1.2, 1.2, 0.9], "w-", lw=1.5)
    a.plot(0.9, 1.05, "w*", ms=12)
    a.set_title("%s\nq_max = %.2f tonf/m²" % (tit, np.nanmax(Z)), fontsize=11)
    a.set_aspect("equal"); a.set_xlabel("x = B (m)"); a.set_ylabel("y = L (m)")
    plt.colorbar(cs, ax=a, fraction=0.046, label="q (tonf/m²)")
fig.suptitle("Das 9.ª ed., ejemplo 6.10 (p. 247): zapata 1.5×1.5, e_B = 0.15, e_L = 0.30, Q = 606 kN — "
             "presión de contacto; línea negra = borde del contacto (q = 0)", fontsize=12)
fig.tight_layout()
fig.savefig(os.path.join(OUT, "das610_presion_4_programas.png"), dpi=90)
print("ok")
