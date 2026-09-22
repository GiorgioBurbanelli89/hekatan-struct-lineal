# -*- coding: utf-8 -*-
"""OpenSees con el MISMO dual 2x2x4 del articulo (545 nudos, malla 1.0 m):
modelo 3D, deformada del modo 1 y tabla de periodos. Deja PNG en la carpeta dada.

    python _cap_opensees.py <carpeta_de_capturas>

Traductor: el mismo criterio que validation/opensees/heks_a_opensees.py
 - barras  -> ElasticTimoshenkoBeam, vector del plano local x-z = eje 3 de CSI
 - cascaras-> ShellMITC4 con ElasticMembranePlateSection
Secciones IDENTICAS a las que monta sap_dual_sismo.py para SAP2000.
"""
import json, math, os, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Line3DCollection, Poly3DCollection
import openseespy.opensees as ops

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = sys.argv[1]; os.makedirs(CAP, exist_ok=True)
D = json.load(open(os.path.join(AQUI, "dual_2x2x4_sismo.json"), encoding="utf-8"))
G = 9.80665
E = D["E"] * G          # kN/m2  (el json trae E en tonf/m2)
nu, rho = D["nu"], D["rho"]          # rho en tonf/m3 (peso)
Gm = E / (2 * (1 + nu))
bc, bb, hb = D["bCol"], D["bBeam"], D["hBeam"]
masa_vol = rho                       # tonf/m3 de PESO -> masa = peso/g en kN: rho*G/G = rho
# masa por volumen en unidades kN-m-s2/m: peso[kN/m3]=rho*G ; masa = peso/G = rho

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
print("periodos OpenSees:", ["%.6f" % x for x in T])

# ── dibujo ───────────────────────────────────────────────────────────────────
N = np.array(D["nodes"], float)
bar = [e for e, k in zip(D["elements"], D["kinds"]) if len(e) == 2]
cua = [e for e, k in zip(D["elements"], D["kinds"]) if len(e) == 4]

def dibuja(ax, P, cbar="#1f4e79", ccua="#9cc3e5", alfa=0.45):
    ax.add_collection3d(Line3DCollection([[P[a], P[b]] for a, b in bar], colors=cbar, linewidths=1.1))
    ax.add_collection3d(Poly3DCollection([[P[j] for j in q] for q in cua],
                                         facecolors=ccua, edgecolors="#4a6f8a", linewidths=0.25, alpha=alfa))
    ax.set_xlim(-1, 11); ax.set_ylim(-1, 11); ax.set_zlim(0, 13)
    ax.set_box_aspect((11, 11, 13)); ax.view_init(18, -58)
    ax.set_xlabel("X (m)"); ax.set_ylabel("Y (m)"); ax.set_zlabel("Z (m)")

# (a) modelo
fig = plt.figure(figsize=(11, 8), dpi=130); ax = fig.add_subplot(111, projection="3d")
dibuja(ax, N)
ax.set_title("OpenSees 3.x — Test M Dual, 545 nudos / 736 elementos (misma malla 1.0 m)",
             fontsize=11, weight="bold")
fig.tight_layout(); fig.savefig(os.path.join(CAP, "20_opensees_modelo.png")); plt.close(fig)

# (b) deformada del modo 1 y del 2
for m in (1, 2):
    phi = np.array([ops.nodeEigenvector(i + 1, m)[:3] for i in range(len(N))], float)
    esc = 2.5 / max(1e-12, np.abs(phi).max())
    P = N + phi * esc
    fig = plt.figure(figsize=(11, 8), dpi=130); ax = fig.add_subplot(111, projection="3d")
    dibuja(ax, N, "#c9c9c9", "#e8e8e8", 0.18)
    dibuja(ax, P, "#c00000", "#f4b183", 0.5)
    ax.set_title("OpenSees — modo %d,  T = %.6f s   (deformada x%.0f)" % (m, T[m - 1], esc),
                 fontsize=12, weight="bold")
    fig.tight_layout(); fig.savefig(os.path.join(CAP, "2%d_opensees_modo%d.png" % (m, m))); plt.close(fig)

# (c) tabla de periodos, los cuatro programas
sap = json.load(open(os.path.join(AQUI, "sap_dual_sismo.json"), encoding="utf-8"))["T"]
hek = json.load(open(os.path.join(AQUI, "hekatan_espectral_sap.json"), encoding="utf-8"))
Th = hek.get("T") or hek.get("periodos") or []
fig, ax = plt.subplots(figsize=(11, 6), dpi=130); ax.axis("off")
fil = [["modo", "Hekatan (s)", "SAP2000 (s)", "OpenSees (s)", "OS vs SAP"]]
for i in range(min(NM, len(sap))):
    th = "%.6f" % Th[i] if i < len(Th) else "—"
    fil.append([str(i + 1), th, "%.6f" % sap[i], "%.6f" % T[i],
                "%+.2f %%" % (100 * (T[i] - sap[i]) / sap[i])])
tb = ax.table(cellText=fil[1:], colLabels=fil[0], loc="center", cellLoc="center")
tb.auto_set_font_size(False); tb.set_fontsize(11); tb.scale(1, 1.55)
ax.set_title("Periodos del mismo modelo, misma malla (545 nudos)", weight="bold", fontsize=13)
fig.tight_layout(); fig.savefig(os.path.join(CAP, "23_opensees_tabla_periodos.png")); plt.close(fig)

json.dump({"T": T}, open(os.path.join(AQUI, "opensees_dual.json"), "w"), indent=1)
print("PNG en", CAP)
