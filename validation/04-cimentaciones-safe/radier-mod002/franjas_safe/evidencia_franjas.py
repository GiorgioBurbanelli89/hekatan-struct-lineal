# PNG de evidencia: franjas sobre la malla del radier con el acero de Hekatan, y Hekatan vs SAFE (264 filas)
import json, os, sys
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from matplotlib import cm, colors
D = json.load(open("tests/datos/radier_franjas_safe.json")); H = json.load(open(sys.argv[1])); OUT = sys.argv[2]
S = {s["name"]: s for s in D["strips"]}
Z = {(z["strip"], z["span"], z["location"]): z for z in H["zonas"]}
for capa, cara in (("A", "AsTop"), ("A", "AsBot"), ("B", "AsTop"), ("B", "AsBot")):
    fig, ax = plt.subplots(figsize=(13, 8.5))
    for e in D["elems"]:
        ax.add_patch(Polygon([(x/1000, y/1000) for x, y in e["xy"]], closed=True, fc="#dddddd" if e["design"] else "#9a9a9a", ec="#aaaaaa", lw=0.4))
    vals = [s[cara]/1e6*1e4/(s["width"]/1000) for n, L in H["est"].items() if S[n]["layer"] == capa for s in L if s["width"] > 0]
    norm = colors.Normalize(0, max(vals) if vals else 1); cmap = cm.jet
    for n, L in H["est"].items():
        s0 = S[n]
        if s0["layer"] != capa: continue
        import math
        ax_, ay_ = s0["start"]; bx, by = s0["end"]; Ls = math.hypot(bx-ax_, by-ay_); tx, ty = (bx-ax_)/Ls, (by-ay_)/Ls; nx, ny = -ty, tx
        for a, b in zip(L[:-1], L[1:]):
            q = max(a[cara]/(a["width"] or 1), b[cara]/(b["width"] or 1))*1e4/1e6*1000  # cm²/m
            p0 = (a["station"], -s0["wStartRight"]); p1 = (b["station"], s0["wStartLeft"])
            poly = [((ax_+s*tx+w*nx)/1000, (ay_+s*ty+w*ny)/1000) for s, w in ((p0[0], p0[1]), (p1[0], p0[1]), (p1[0], p1[1]), (p0[0], p1[1]))]
            ax.add_patch(Polygon(poly, closed=True, fc=cmap(norm(q)), ec="k", lw=0.3, alpha=0.75))
        ax.text((ax_+bx)/2000, (ay_+by)/2000, n, fontsize=6, ha="center", va="center")
    ax.set_xlim(-0.6, 15.6); ax.set_ylim(-0.3, 10.2); ax.set_aspect("equal")
    sm = cm.ScalarMappable(norm=norm, cmap=cmap); plt.colorbar(sm, ax=ax, label=f"{cara} requerido [cm²/m]")
    ax.set_title(f"Hekatan — diseño por franjas, capa {capa}, {'SUPERIOR' if cara=='AsTop' else 'INFERIOR'} (ACI 318-19, combo DISEÑO)\nfuerzas de cáscara de SAFE 20.3; huecos (sin elementos) recortan el ancho; gris oscuro = pedestal (Stiff, excluido)")
    fig.savefig(os.path.join(OUT, f"franjas_capa{capa}_{cara}.png"), dpi=110, bbox_inches="tight"); plt.close(fig)
# Hekatan vs SAFE
fig, axs = plt.subplots(1, 3, figsize=(15, 5))
for ax, (k, kh, u, f) in zip(axs, (("AsTop", "AsTop", "cm²", 1e-2), ("AsBot", "AsBot", "cm²", 1e-2), ("V", "V", "tonf", 1e-3))):
    xs = [r[k]*f for r in D["acero"]]; ys = [Z[(r["strip"], r["span"], r["loc"])][kh]*f for r in D["acero"]]
    ax.plot(xs, ys, "o", ms=4); m = max(xs+ys) or 1; ax.plot([0, m], [0, m], "k--", lw=0.8)
    err = max(abs(a-b)/abs(a) for a, b in zip(xs, ys) if abs(a) > 1e-9)
    ax.set_title(f"{k}: 264 filas Start/Middle/End\nerror rel. máx {err:.1e}"); ax.set_xlabel(f"SAFE 20.3 [{u}]"); ax.set_ylabel(f"Hekatan [{u}]"); ax.grid(alpha=.3)
fig.suptitle("acero_por_franja_SAFE.csv vs Hekatan stripDesign.ts (radier MOD_002, 30 franjas)")
fig.savefig(os.path.join(OUT, "hekatan_vs_safe_264.png"), dpi=110, bbox_inches="tight")
print("ok")
