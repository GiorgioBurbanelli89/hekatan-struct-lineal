"""Figuras del informe (PNG): planta con las cargas repetidas, y presion de suelo SERVICIO tal cual (SAFE, del
f2k del ingeniero) vs corregido (Hekatan, malla conforme). Misma escala de color en los dos mapas."""
import json, os, sys, math
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon
from matplotlib.collections import PolyCollection
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_heks_desde_f2k import cargar, KGF
from gen_heks_conforme import geometria
AQUI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(AQUI, "informe")
INK, MUTED, GRID = "#1f2328", "#6b7280", "#d0d4da"
C_OK, C_DUP = "#2563eb", "#dc2626"
plt.rcParams.update({"font.size": 9, "axes.edgecolor": MUTED, "axes.labelcolor": INK, "xtick.color": MUTED, "ytick.color": MUTED})

t = cargar(os.path.join(AQUI, "MOD_002.f2k"))
P, losas, huecos, vigas = geometria(t)
gxr = [r for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("X")]
gyr = [r for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("Y")]
gx = [float(r["Ordinate"]) for r in gxr]; gy = [float(r["Ordinate"]) for r in gyr]

def base(ax, pedestales=True):
    x0 = min(l[2][0] for l in losas); x1 = max(l[2][1] for l in losas); y0 = min(l[2][2] for l in losas); y1 = max(l[2][3] for l in losas)
    ax.add_patch(Rectangle((x0, y0), x1 - x0, y1 - y0, fill=False, ec=INK, lw=1.2))
    for h in huecos: ax.add_patch(Rectangle((h[0], h[2]), h[1] - h[0], h[3] - h[2], fc="white", ec=MUTED, lw=0.8, hatch="////", zorder=3))
    if pedestales:
        for l in losas:
            if l[1] == "PEDESTAL":
                r = l[2]; ax.add_patch(Rectangle((r[0], r[2]), r[1] - r[0], r[3] - r[2], fc="#9ca3af", ec="none", zorder=2))
    for x, r in zip(gx, gxr):
        ax.plot([x, x], [y0 - 0.5, y1 + 0.3], color=GRID, lw=0.6, zorder=0); ax.text(x, y0 - 0.75, r["ID"], ha="center", va="center", color=MUTED)
    for y, r in zip(gy, gyr):
        ax.plot([x0 - 0.5, x1 + 0.3], [y, y], color=GRID, lw=0.6, zorder=0); ax.text(x0 - 0.8, y, r["ID"], ha="center", va="center", color=MUTED)
    for (a, b, _) in vigas: ax.plot([a[0], b[0]], [a[1], b[1]], color="#6b7280", lw=3, solid_capstyle="butt", zorder=4)
    ax.set_aspect("equal"); ax.set_xlim(x0 - 1.1, x1 + 0.6); ax.set_ylim(y0 - 1.0, y1 + 0.5)
    ax.set_xlabel("X (m)"); ax.set_ylabel("Y (m)")
    for s in ("top", "right"): ax.spines[s].set_visible(False)

# ── Figura 1: cargas repetidas ──
fig, ax = plt.subplots(figsize=(9.5, 6.4), dpi=150)
base(ax)
dead = [r for r in t["JOINT LOADS ASSIGNMENTS - FORCE"] if r["Load Pattern"] == "Dead"]
en_cruce = lambda x, y: min(abs(x - v) for v in gx) < 0.01 and min(abs(y - v) for v in gy) < 0.01
orig = {}
for r in dead:
    x, y = P[r["UniqueName"]]
    if en_cruce(x, y): orig[r["FZ"]] = (x, y)
for r in dead:
    x, y = P[r["UniqueName"]]; f = -float(r["FZ"]) / 1000
    if en_cruce(x, y):
        ax.plot(x, y, "o", ms=9, mfc=C_OK, mec="white", mew=1.5, zorder=6)
        ax.annotate("%.1f" % f, (x, y), xytext=(6, 6), textcoords="offset points", fontsize=8, color=INK, zorder=7)
    else:
        ox, oy = orig[r["FZ"]]
        ax.plot([ox, x], [oy, y], color=C_DUP, lw=1, ls="--", zorder=5)
        ax.plot(x, y, "X", ms=9, mfc=C_DUP, mec="white", mew=1.0, zorder=6)
ax.plot([], [], "o", ms=8, mfc=C_OK, mec="white", label="Carga de columna (15, en el cruce de ejes) — Dead, t")
ax.plot([], [], "X", ms=8, mfc=C_DUP, mec="white", label="Copia exacta de la misma carga (22) — línea: a qué columna copia")
ax.add_patch(Rectangle((0, 0), 0, 0, fc="#9ca3af", label="Pedestal (Stiff)"))
ax.add_patch(Rectangle((0, 0), 0, 0, fc="white", ec=MUTED, hatch="////", label="Hueco"))
ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.1), ncol=2, frameon=False, fontsize=8)
fig.tight_layout(); fig.savefig(os.path.join(OUT, "fig1_cargas_repetidas.png"), bbox_inches="tight"); plt.close(fig)

# ── Figura 2: presion SERVICIO, tal cual (SAFE) vs corregido (Hekatan) ──
J = {r["Element Name"]: (float(r["Global X"]), float(r["Global Y"])) for r in t["OBJECTS AND ELEMENTS - JOINTS"]}
psafe = {}
for r in t["SOIL PRESSURES"]:
    if r["Output Case"] == "SERVICIO": psafe.setdefault(r["Shell Element"], []).append(-float(r["Soil Pressure"]) / 1000)
polys_s, vals_s = [], []
for r in t["OBJECTS AND ELEMENTS - AREAS"]:
    pts = [J[r[c]] for c in ("Elm Jt1", "Elm Jt2", "Elm Jt3", "Elm Jt4")]
    v = psafe.get(r["Element Name"])
    if v: polys_s.append(pts); vals_s.append(sum(v) / len(v))
D = json.load(open(os.path.join(AQUI, "res", "conf_SERVICIO.json")))
U = {int(k): v for k, v in D["deformations"].items()}
KS = 400000.0
polys_c, vals_c = [], []
for e, el in enumerate(D["elements"]):
    if len(el) != 4: continue
    polys_c.append([D["nodes"][n][:2] for n in el]); vals_c.append(sum(-KS * U[n][2] / 1000 for n in el) / 4)
vmax = max(max(vals_s), max(vals_c))
res = json.load(open(os.path.join(AQUI, "res", "resultados_corregido.json")))
fig, axs = plt.subplots(1, 2, figsize=(12.5, 4.6), dpi=150)
for ax, polys, vals, tit in ((axs[0], polys_s, vals_s, "TAL CUAL (SAFE, cargas repetidas, sin peso propio)"),
                             (axs[1], polys_c, vals_c, "CORREGIDO (Hekatan: 1 carga por columna + peso propio)")):
    pc = PolyCollection(polys, array=vals, cmap="Blues", clim=(0, vmax), edgecolors="none")
    ax.add_collection(pc); base(ax, pedestales=False)
    ax.set_title(tit, fontsize=9, color=INK, loc="left")
    i = max(range(len(vals)), key=lambda k: vals[k])
cb = fig.colorbar(pc, ax=axs, shrink=0.85, pad=0.02); cb.set_label("q SERVICIO (t/m², media del elemento)")
axs[0].annotate("máx 30.53 t/m² (nudo)", (15.075, 9.675), xytext=(-95, -30), textcoords="offset points", fontsize=8, color=INK, bbox=dict(fc="white", ec="none", pad=1), arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
axs[1].annotate("máx %.2f t/m² (nudo)" % res["SERVICIO"]["pmax_tm2"], (15.075, 9.675), xytext=(-95, -30), textcoords="offset points", fontsize=8, color=INK, bbox=dict(fc="white", ec="none", pad=1), arrowprops=dict(arrowstyle="-", color=INK, lw=0.6))
fig.savefig(os.path.join(OUT, "fig2_presion_servicio.png"), bbox_inches="tight"); plt.close(fig)
print("ok", vmax)
