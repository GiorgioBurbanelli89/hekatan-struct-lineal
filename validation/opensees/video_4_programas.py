# -*- coding: utf-8 -*-
"""VIDEO: el mismo modelo en Hekatan Struct, SAP2000, ETABS y OpenSees.

A la izquierda la estructura vibrando en el modo que toca; a la derecha la tabla
de periodos de los cuatro programas, con el modo en curso resaltado.

    python video_4_programas.py [carpeta] [frames_por_modo]

Espera en la carpeta: dump.json, hekatan_modal12.json, sap2000.json, etabs.json
y opensees.json. Deja los PNG en <carpeta>/video_4/ y el .mp4 + .gif al lado.
"""
import json, math, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
C = sys.argv[1] if len(sys.argv) > 1 else AQUI
K = int(sys.argv[2]) if len(sys.argv) > 2 else 36
_L = lambda f: json.load(open(os.path.join(C, f), encoding="utf-8"))

D = _L("dump.json")
PER = {"Hekatan Struct": _L("hekatan_modal12.json")["periods"]}
for nom, fich in (("SAP2000", "sap2000.json"), ("ETABS", "etabs.json")):
    try: PER[nom] = _L(fich)["modal"]["periodos"]
    except Exception: pass
try: PER["OpenSees"] = _L("opensees.json")["periodos"]
except Exception: pass

# ── las formas modales salen de OpenSees, montando el modelo como el traductor ─
import openseespy.opensees as ops
ei, ni = D["elementInputs"], D["nodeInputs"]
g = lambda m, i, d=None: ei.get(m, {}).get(str(i), d)
ops.wipe(); ops.model("basic", "-ndm", 3, "-ndf", 6)
for i, (x, y, z) in enumerate(D["nodes"]):
    ops.node(i + 1, float(x), float(y), float(z))
for k, v in ni["supports"].items():
    ops.fix(int(k) + 1, *[1 if b else 0 for b in v])

def vecxz(n1, n2):
    p1, p2 = D["nodes"][n1], D["nodes"][n2]
    dx = [p2[k] - p1[k] for k in range(3)]
    Lg = math.sqrt(sum(c * c for c in dx)); ex = [c / Lg for c in dx]
    ref = [0, 0, 1] if abs(ex[2]) < 0.999 else [1, 0, 0]
    ey = [ref[1]*ex[2] - ref[2]*ex[1], ref[2]*ex[0] - ref[0]*ex[2], ref[0]*ex[1] - ref[1]*ex[0]]
    n = math.sqrt(sum(c*c for c in ey)) or 1.0
    return [c / n for c in ey]

secs = {}
for idx, el in enumerate(D["elements"]):
    E = g("elasticities", idx); nu = g("poissonsRatios", idx, 0.3); rho = g("densities", idx, 0.0)
    if len(el) == 2:
        A = g("areas", idx); Gm = g("shearModuli", idx) or E / (2 * (1 + nu))
        ops.geomTransf("Linear", idx + 1, *vecxz(el[0], el[1]))
        ops.element("ElasticTimoshenkoBeam", idx + 1, el[0] + 1, el[1] + 1,
                    float(E), float(Gm), float(A), float(g("torsionalConstants", idx)),
                    float(g("momentsOfInertiaY", idx)), float(g("momentsOfInertiaZ", idx)),
                    float(g("shearAreasZ", idx) or 5.0/6.0*A), float(g("shearAreasY", idx) or 5.0/6.0*A),
                    idx + 1, "-mass", float(rho) * float(A))
    elif len(el) == 4:
        t = g("thicknesses", idx); fm = g("membraneModifiers", idx, 1.0)
        key = (round(E * fm, 6), round(nu, 6), round(t, 9), round(rho, 6))
        if key not in secs:
            secs[key] = 1000 + len(secs)
            ops.section("ElasticMembranePlateSection", secs[key],
                        float(E) * float(fm), float(nu), float(t), float(rho))
        ops.element(os.environ.get("HK_SHELL", "ShellMITC4"), idx + 1, *[q + 1 for q in el], secs[key])
ops.eigen("-genBandArpack", 5)

import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection, Line3DCollection

P = [[float(c) for c in q] for q in D["nodes"]]
xs = [q[0] for q in P]; ys = [q[1] for q in P]; zs = [q[2] for q in P]
diag = math.dist([min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)])
lineas = [el for el in D["elements"] if len(el) == 2]
caras0 = [el for el in D["elements"] if len(el) == 4]
salida = os.path.join(C, "video_4"); os.makedirs(salida, exist_ok=True)
FONDO, TINTA, SUAVE, ORO = "#0d1017", "#e8edf5", "#8b95a7", "#ffb547"
PROGS = list(PER)
TITULO = os.environ.get("HK_TITULO", "El mismo modelo en los cuatro programas")
PIE1 = os.environ.get("HK_PIE1", "")
PIE2 = os.environ.get("HK_PIE2", "")
n = 0
for modo in (1, 2, 3):
    phi = [ops.nodeEigenvector(i + 1, modo)[:3] for i in range(len(P))]
    amp = max(max(abs(c) for c in v) for v in phi) or 1.0
    f = 0.08 * diag / amp
    fig = plt.figure(figsize=(19.2, 10.8), dpi=60); fig.patch.set_facecolor(FONDO)
    ax = fig.add_axes([-0.06, -0.12, 0.82, 1.08], projection="3d"); ax.set_facecolor(FONDO)
    chapa = None
    if caras0:
        chapa = Poly3DCollection([[P[q] for q in el] for el in caras0], facecolor="#2b7fd4",
                                 alpha=0.35, edgecolor="#4da3ff", linewidths=0.3)
        try: chapa.set_zsort(False)
        except Exception: pass
        ax.add_collection3d(chapa)
    ax.add_collection3d(Line3DCollection([[P[el[0]], P[el[1]]] for el in lineas],
                                         colors="#333a45", linewidths=0.5))
    barra = Line3DCollection([[P[el[0]], P[el[1]]] for el in lineas], colors=ORO, linewidths=1.3)
    ax.add_collection3d(barra)
    ax.set_xlim(min(xs) - 1, max(xs) + 1); ax.set_ylim(min(ys) - 1, max(ys) + 1)
    ax.set_zlim(min(zs) - 1, max(zs) + 3)
    dx, dy, dz = (max(xs)-min(xs)+2, max(ys)-min(ys)+2, max(zs)-min(zs)+4)
    ax.set_box_aspect((dx, dy, dz), zoom=1.25 * min(1.0, 2.5 * max(dx, dy) / max(dz, 1e-9)))
    ax.set_axis_off()
    fig.text(0.03, 0.945, TITULO, color=TINTA, fontsize=30, weight="bold")
    fig.text(0.03, 0.912, "%d nudos · %d barras · %d cáscaras · misma malla, mismas cargas"
             % (len(P), len(lineas), len(caras0)), color=SUAVE, fontsize=15)
    x0 = 0.755
    fig.text(x0, 0.86, "PERIODOS  (s)", color=TINTA, fontsize=18, weight="bold")
    for m in (1, 2, 3, 4, 5):
        y = 0.78 - (m - 1) * 0.135
        base = PER["Hekatan Struct"][m - 1]
        activo = (m == modo)
        fig.text(x0, y, "modo %d" % m, color=(ORO if activo else "#5a6474"),
                 fontsize=16, weight=("bold" if activo else "normal"))
        for j, prog in enumerate(PROGS):
            v = PER[prog][m - 1]
            txt = ("%-15s %.6f" % (prog, v) if j == 0
                   else "%-15s %.6f  %+.2f %%" % (prog, v, 100 * (v / base - 1)))
            fig.text(x0, y - 0.025 - j * 0.021, txt, family="monospace", fontsize=11,
                     color=(TINTA if activo else "#454e5c"))
    if PIE1: fig.text(x0, 0.075, PIE1, color=SUAVE, fontsize=12)
    if PIE2: fig.text(x0, 0.045, PIE2, color=SUAVE, fontsize=12)
    for k in range(K):
        a = math.sin(2 * math.pi * 4 * k / K)
        Q = [[P[i][j] + a * f * phi[i][j] for j in range(3)] for i in range(len(P))]
        if chapa is not None: chapa.set_verts([[Q[q] for q in el] for el in caras0])
        barra.set_segments([[Q[el[0]], Q[el[1]]] for el in lineas])
        ax.view_init(elev=16, azim=-65 + 60.0 * ((modo - 1) + k / K))
        fig.savefig(os.path.join(salida, "v%04d.png" % n), facecolor=FONDO,
                    pil_kwargs={"compress_level": 1})
        n += 1
    plt.close(fig)

try:
    import imageio.v2 as iio
    ims = [iio.imread(os.path.join(salida, "v%04d.png" % i)) for i in range(n)]
    iio.mimsave(os.path.join(C, "video_4_programas.mp4"), ims, fps=12, macro_block_size=1)
    iio.mimsave(os.path.join(C, "video_4_programas.gif"), [im[::2, ::2] for im in ims], fps=12, loop=0)
except Exception as ex:
    print("mp4/gif:", str(ex)[:90])
print("%d fotogramas -> %s" % (n, salida))
