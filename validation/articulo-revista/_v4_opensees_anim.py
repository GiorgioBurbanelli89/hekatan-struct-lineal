# -*- coding: utf-8 -*-
"""v4 — OpenSees: ANIMACIÓN de los modos 1, 2 y 3 del mismo dual 2x2x4
(545 nudos, malla 1.0 m).

v4 (18-sep-2026, Jorge: «no se ven todos los modelos bien»): SIN ejes, SIN título y
SIN panel de matplotlib —los ejes y las etiquetas no son la estructura y además
marcaban otra escala que los otros tres programas—, lienzo VERTICAL 960x1920 y el
punto de vista puesto en el de CSI (elevación 30°, planta -45°), que es el que traen
SAP2000 y ETABS de fábrica.

    py _v4_opensees_anim.py <carpeta_salida>

Deja  <salida>/anim/opensees4_m{1,2,3}_###.png  a 960x1920 (vertical).
"""
import json, math, os, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Line3DCollection, Poly3DCollection
import openseespy.opensees as ops

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = sys.argv[1]
ANIM = os.path.join(CAP, "anim"); os.makedirs(ANIM, exist_ok=True)
D = json.load(open(os.path.join(AQUI, "dual_2x2x4_sismo.json"), encoding="utf-8"))
G = 9.80665
E = D["E"] * G
nu, rho = D["nu"], D["rho"]
Gm = E / (2 * (1 + nu))
bc, bb, hb = D["bCol"], D["bBeam"], D["hBeam"]
masa_vol = rho

ops.wipe(); ops.model("basic", "-ndm", 3, "-ndf", 6)
for i, (x, y, z) in enumerate(D["nodes"]):
    ops.node(i + 1, float(x), float(y), float(z))
for i in D["supports"]:
    ops.fix(int(i) + 1, 1, 1, 1, 1, 1, 1)

def vecxz(n1, n2):
    p1, p2 = D["nodes"][n1], D["nodes"][n2]
    dx = [p2[k] - p1[k] for k in range(3)]
    L = math.sqrt(sum(c * c for c in dx)); ex = [c / L for c in dx]
    ref = [0, 0, 1] if abs(ex[2]) < 0.999 else [1, 0, 0]
    ey = [ref[1]*ex[2] - ref[2]*ex[1], ref[2]*ex[0] - ref[0]*ex[2], ref[0]*ex[1] - ref[1]*ex[0]]
    n = math.sqrt(sum(c*c for c in ey)) or 1.0
    return [c / n for c in ey]

Ac = bc * bc; Ic = bc ** 4 / 12; Jc = 0.141 * bc ** 4
Av = bb * hb; I33 = bb * hb ** 3 / 12; I22 = hb * bb ** 3 / 12; Jv = I33 + I22
sec = {}
for k, (el, kind) in enumerate(zip(D["elements"], D["kinds"])):
    t = k + 1
    if kind in ("col", "beam"):
        A, J, Iy, Iz = (Ac, Jc, Ic, Ic) if kind == "col" else (Av, Jv, I22, I33)
        ops.geomTransf("Linear", t, *vecxz(el[0], el[1]))
        ops.element("ElasticTimoshenkoBeam", t, el[0] + 1, el[1] + 1, E, Gm, A, J, Iy, Iz,
                    5/6*A, 5/6*A, t, "-mass", masa_vol * A)
    else:
        th = D["tSlab"] if kind == "slab" else D["tWall"]
        if th not in sec:
            sec[th] = len(sec) + 1
            ops.section("ElasticMembranePlateSection", sec[th], E, nu, th, masa_vol)
        ops.element("ShellMITC4", t, *[j + 1 for j in el], sec[th])

NM = 12
lam = ops.eigen("-genBandArpack", NM)
T = [2 * math.pi / math.sqrt(l) for l in lam]
print("periodos OpenSees:", ["%.6f" % x for x in T], flush=True)

N = np.array(D["nodes"], float)
bar = [e for e, k in zip(D["elements"], D["kinds"]) if len(e) == 2]
cua = [e for e, k in zip(D["elements"], D["kinds"]) if len(e) == 4]

NF = int(os.environ.get("V3_FRAMES", "30"))
for m in (1, 2, 3):
    phi = np.array([ops.nodeEigenvector(i + 1, m)[:3] for i in range(len(N))], float)
    esc = 2.2 / max(1e-12, np.abs(phi).max())
    for f in range(NF):
        s = math.sin(2 * math.pi * f / NF)
        P = N + phi * esc * s
        fig = plt.figure(figsize=(9.6, 19.2), dpi=100)
        ax = fig.add_subplot(111, projection="3d")
        # sombra del modelo sin deformar
        ax.add_collection3d(Line3DCollection([[N[a], N[b]] for a, b in bar],
                                             colors="#cccccc", linewidths=1.0))
        ax.add_collection3d(Poly3DCollection([[N[j] for j in q] for q in cua],
                                             facecolors="#ececec", edgecolors="#dadada",
                                             linewidths=0.2, alpha=0.15))
        # forma modal en movimiento
        ax.add_collection3d(Line3DCollection([[P[a], P[b]] for a, b in bar],
                                             colors="#c00000", linewidths=2.0))
        ax.add_collection3d(Poly3DCollection([[P[j] for j in q] for q in cua],
                                             facecolors="#f4b183", edgecolors="#a0522d",
                                             linewidths=0.4, alpha=0.55))
        ax.set_xlim(-1.5, 11.5); ax.set_ylim(-1.5, 11.5); ax.set_zlim(0, 13)
        ax.set_box_aspect((11, 11, 13))
        ax.view_init(30, -45)          # el 3-D por defecto de SAP2000 y ETABS
        ax.set_axis_off()              # sin ejes, sin rejilla, sin etiquetas
        fig.subplots_adjust(left=0, right=1, bottom=0, top=1)
        fig.savefig(os.path.join(ANIM, "opensees4_m%d_%03d.png" % (m, f)), facecolor="white")
        plt.close(fig)
    print("modo %d: %d frames" % (m, NF), flush=True)

json.dump({"T": T}, open(os.path.join(AQUI, "opensees_dual_v4.json"), "w"), indent=1)
print("FIN ->", ANIM)
