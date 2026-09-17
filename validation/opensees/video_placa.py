# -*- coding: utf-8 -*-
"""VIDEO: la placa DELGADA contra la GRUESA en Hekatan, SAP2000 y OpenSees.

Izquierda: la placa deformándose, con el espesor creciendo de t/L = 0.001 a 0.2.
Derecha: la diferencia de cada programa contra SAP2000, que es el juez.

    python video_placa.py [carpeta] [frames_por_paso]

Espera en la carpeta los dumps `pl_<t/L>_dump.json`, `pl_<t/L>_sap.json` y
`os_<elemento>_<t/L>.json` que dejan el driver de CSI y el traductor a OpenSees.
"""
import json
import math
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
C = sys.argv[1] if len(sys.argv) > 1 else AQUI
K = int(sys.argv[2]) if len(sys.argv) > 2 else 45
TL = ("0.001", "0.01", "0.05", "0.1", "0.2")

def _wh(f):
    d = json.load(open(os.path.join(C, f))); return min(v[2] for v in d["deformations"].values())
def _wo(f):
    d = json.load(open(os.path.join(C, f))); return min(v[2] for v in d["desp"].values())
def _ws(f):
    d = json.load(open(os.path.join(C, f))); c = list(d["casos"])[0]
    return min(n["u"][2] for n in d["casos"][c]["nudos"])

SAP = [_ws("pl_%s_sap.json" % t) for t in TL]
SERIES = [
    ("Hekatan Struct  (MITC4 + Wilson)", "#ffb547",
     [_wh("pl_%s_dump.json" % t) for t in TL]),
    ("OpenSees  ShellMITC4", "#4da3ff",
     [_wo("os_ShellMITC4_%s.json" % t) for t in TL]),
    ("OpenSees  ShellDKGQ  (Kirchhoff)", "#ff6b6b",
     [_wo("os_ShellDKGQ_%s.json" % t) for t in TL]),
]
DIF = [(n, c, [100 * (v / s - 1) for v, s in zip(vs, SAP)]) for n, c, vs in SERIES]

import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

FONDO, TINTA, SUAVE, ORO = "#0d1017", "#e8edf5", "#8b95a7", "#ffb547"
salida = os.path.join(C, "video_placa"); os.makedirs(salida, exist_ok=True)

# la malla de la placa (la misma de todos los casos)
D0 = json.load(open(os.path.join(C, "pl_0.05_dump.json")))
P = [[float(c) for c in q] for q in D0["nodes"]]
caras = [el for el in D0["elements"] if len(el) == 4]
xs = [q[0] for q in P]; ys = [q[1] for q in P]

n = 0
for paso in range(5):                     # un paso por espesor
    t = TL[paso]
    D = json.load(open(os.path.join(C, "pl_%s_dump.json" % t)))
    w = [D["deformations"][str(i)][2] for i in range(len(P))]
    esc = 2.5 / max(abs(v) for v in w)
    fig = plt.figure(figsize=(12.8, 7.2), dpi=100); fig.patch.set_facecolor(FONDO)
    ax = fig.add_axes([0.01, 0.22, 0.46, 0.62], projection="3d"); ax.set_facecolor(FONDO)
    col = Poly3DCollection([], facecolor="#2b7fd4", alpha=0.75,
                           edgecolor="#79b8ff", linewidths=0.4)
    ax.add_collection3d(col)
    ax.set_xlim(0, 10); ax.set_ylim(0, 10); ax.set_zlim(-3.2, 1.2)
    ax.set_box_aspect((10, 10, 5), zoom=1.35); ax.set_axis_off()

    ax2 = fig.add_axes([0.56, 0.30, 0.40, 0.52]); ax2.set_facecolor(FONDO)
    for s in ax2.spines.values(): s.set_color("#39404d")
    ax2.tick_params(colors=SUAVE, labelsize=9)
    ax2.axhline(0, color="#5a6474", lw=1.2)
    ax2.set_xscale("log")
    ax2.set_xlabel("espesor relativo  t/L", color=SUAVE, fontsize=11)
    ax2.set_ylabel("diferencia contra SAP2000  (%)", color=SUAVE, fontsize=11)
    ax2.set_xlim(0.0008, 0.26); ax2.set_ylim(-26, 6)
    xv = [float(v) for v in TL]
    for nom, cl, dif in DIF:
        ax2.plot(xv[:paso + 1], dif[:paso + 1], "-o", color=cl, lw=2, ms=5, label=nom)
    ax2.legend(loc="lower left", fontsize=9, facecolor=FONDO, edgecolor="#39404d",
               labelcolor=TINTA)

    fig.text(0.03, 0.945, "Placa delgada y placa gruesa: quién da qué",
             color=TINTA, fontsize=26, weight="bold")
    fig.text(0.03, 0.912, "placa cuadrada apoyada, malla 8×8, carga uniforme · el juez es SAP2000",
             color=SUAVE, fontsize=13)
    fig.text(0.05, 0.19, "t/L = %s" % t, color=ORO, fontsize=20, weight="bold")
    fig.text(0.05, 0.155, "flecha SAP2000  %.4e m" % SAP[paso], color=SUAVE, fontsize=12,
             family="monospace")
    for j, (nom, cl, dif) in enumerate(DIF):
        fig.text(0.56, 0.20 - j * 0.035, "%-34s %+7.3f %%" % (nom, dif[paso]),
                 color=cl, fontsize=11, family="monospace")

    for k in range(K):
        a = math.sin(2 * math.pi * 2 * k / K)
        Q = [[P[i][0], P[i][1], a * esc * w[i]] for i in range(len(P))]
        col.set_verts([[Q[q] for q in el] for el in caras])
        ax.view_init(elev=26, azim=-60 + 24.0 * (paso + k / K))
        fig.savefig(os.path.join(salida, "f%03d.png" % n), facecolor=FONDO,
                    pil_kwargs={"compress_level": 1})
        n += 1
    plt.close(fig)

json.dump({"pasos": [{"desde": i * K, "hasta": (i + 1) * K - 1, "rotulo": "t/L = %s" % TL[i]}
                     for i in range(5)]},
          open(os.path.join(salida, "pasos.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("%d fotogramas -> %s" % (n, salida))
