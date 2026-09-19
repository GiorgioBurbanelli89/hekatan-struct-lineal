# -*- coding: utf-8 -*-
"""Vídeo corto «¿Qué es una cimentación NO lineal?»: fotogramas animados con matplotlib (poca RAM,
sin navegador) + pasos.json para ../hekatan-school/montar_tutorial.py (voz ES, subtítulo EN, marca).

    python cli/video_no_lineal.py VUELTAS.json frames_tut_no_lineal
    python ../hekatan-school/montar_tutorial.py frames_tut_no_lineal cli/guiones/no_lineal_es.txt \
           NO_LINEAL.mp4 cli/guiones/no_lineal_en.txt

VUELTAS.json: las vueltas REALES del solver con el ejemplo 6.10 de Das (activo + w por nudo), de
cliModeler (__hekatanCliContactoIter). Las presiones de la zapata que se corre son las de Das
(ecs. 6.51–6.53, zapata rígida): Q = 61.795 tonf, B = L = 1.5 m.
"""
import json, os, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyArrowPatch, Circle

VJ, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.endswith(".png"): os.remove(os.path.join(OUT, f))
FONDO, TX, AZ, NA, RO, VE, GR = "#15181e", "#e8e8e8", "#4da3ff", "#ffb347", "#ff5c5c", "#5cd65c", "#6b7280"
plt.rcParams.update({"font.family": "Segoe UI", "font.size": 15, "text.color": TX, "axes.labelcolor": TX,
                     "xtick.color": TX, "ytick.color": TX, "axes.edgecolor": "#8a93a3"})
k = 0
pasos = []


def lienzo(titulo):
    fig = plt.figure(figsize=(12.8, 7.2), dpi=100)
    fig.patch.set_facecolor(FONDO)
    fig.add_artist(Rectangle((0, 0), 1, 0.18, transform=fig.transFigure, color="black", zorder=0))   # franja subtítulo
    fig.text(0.5, 0.955, titulo, ha="center", va="top", fontsize=22, weight="bold", color=NA)
    return fig


def guardar(fig):
    global k
    fig.savefig(os.path.join(OUT, "f%03d.png" % k), facecolor=fig.get_facecolor())
    plt.close(fig)
    k += 1


def paso(rotulo, n, dibuja):
    d = k
    for i in range(n):
        dibuja(i / max(1, n - 1), i)
    pasos.append({"rotulo": rotulo, "desde": d, "hasta": k - 1})


def zig(ax, x, y0, y1, color, lw=2.5, n=7, w=0.09, ls="-"):
    ys = np.linspace(y0, y1, 2 * n + 3)
    xs = np.full_like(ys, x)
    xs[2:-2] = x + w * np.array([(-1) ** j for j in range(len(ys) - 4)])
    ax.plot(xs, ys, color=color, lw=lw, ls=ls, solid_joinstyle="miter")


def escena(fig):
    ax = fig.add_axes([0.04, 0.22, 0.44, 0.66]); ax.set_xlim(-1, 1); ax.set_ylim(-0.3, 2.0); ax.axis("off")
    ax.add_patch(Rectangle((-0.6, -0.3), 1.2, 0.3, color="#5a4632"))
    ax.text(0, -0.17, "suelo", ha="center", color=TX, fontsize=14)
    return ax


def grafica(fig, ylab="fuerza del resorte"):
    ax = fig.add_axes([0.56, 0.28, 0.4, 0.58]); ax.set_facecolor(FONDO)
    ax.set_xlim(-1.1, 1.1); ax.set_ylim(-1.1, 1.1)
    ax.axhline(0, color=GR, lw=1); ax.axvline(0, color=GR, lw=1)
    ax.set_xlabel("← estiras (sube)        aprietas (baja) →"); ax.set_ylabel(ylab)
    ax.text(0.55, -0.95, "tira", color=TX, fontsize=13); ax.text(0.55, 0.9, "empuja", color=TX, fontsize=13)
    return ax


# ── 1 · resorte normal ──
def p1(t, i):
    fig = lienzo("Un resorte normal: la misma regla siempre (una recta)")
    d = np.sin(2 * np.pi * t)                       # >0 aprieta, <0 estira
    ax = escena(fig); yp = 1.1 - 0.45 * d
    zig(ax, 0, 0, yp, AZ); ax.add_patch(Rectangle((-0.35, yp), 0.7, 0.14, color="#9aa4b2"))
    ax.annotate("", (0, yp + 0.14 + (0.0 if d > 0 else 0.35)), (0, yp + 0.14 + (0.35 if d > 0 else 0.0)),
                arrowprops=dict(arrowstyle="-|>", color=NA, lw=3))
    ax.text(0.45, yp + 0.05, "aprieta" if d > 0.05 else ("estira" if d < -0.05 else ""), color=NA, fontsize=16)
    g = grafica(fig); x = np.linspace(-1, 1, 50)
    g.plot(x, x, color=AZ, lw=3); g.plot(d, d, "o", ms=14, color=NA, mec="white")
    guardar(fig)


paso("resorte normal", 80, p1)


# ── 2 · el suelo ──
def p2(t, i):
    fig = lienzo("El suelo: empuja, pero NO tira (se despega)")
    d = np.sin(2 * np.pi * t)
    ax = escena(fig); yp = 1.1 - 0.45 * d
    if d >= 0:
        zig(ax, 0, 0, yp, NA)
    else:
        zig(ax, 0, 0, 1.1, GR, ls="--")
        ax.text(0.4, 1.2, "se despega:\nfuerza 0", color=RO, fontsize=16)
    ax.add_patch(Rectangle((-0.35, yp), 0.7, 0.14, color="#9aa4b2")); ax.text(-0.3, yp + 0.3, "zapata", fontsize=13)
    g = grafica(fig); x = np.linspace(-1, 1, 101)
    g.plot(x, x, color=AZ, lw=1.5, ls=":", alpha=0.6)
    g.plot(x, np.maximum(x, 0), color=NA, lw=3.5); g.plot(d, max(d, 0), "o", ms=14, color=NA, mec="white")
    guardar(fig)


paso("suelo", 80, p2)


# ── 3 · no lineal = la regla cambia ──
def p3(t, i):
    fig = lienzo("NO LINEAL: la regla CAMBIA según lo que pasa")
    g = grafica(fig); x = np.linspace(-1, 1, 101)
    g.plot(x, x, color=AZ, lw=3, label="resorte normal: lineal")
    g.plot(x, np.maximum(x, 0), color=NA, lw=3.5, label="suelo: no lineal")
    g.add_patch(Circle((0, 0), 0.12 + 0.05 * np.sin(6 * np.pi * t), fill=False, ec=RO, lw=3))
    g.legend(loc="upper left", facecolor=FONDO, edgecolor=GR, fontsize=13)
    fig.text(0.26, 0.62, "el «codo» en cero:", ha="center", fontsize=22, color=RO)
    fig.text(0.26, 0.52, "apretando: regla 1 (recta)", ha="center", fontsize=18)
    fig.text(0.26, 0.45, "estirando: regla 2 (cero)", ha="center", fontsize=18)
    guardar(fig)


paso("no lineal", 40, p3)

# ── 4 y 5 · la zapata ──
Q, B, L, KS = 61.795, 1.5, 1.5, 2000.0
NR = 13
XR = np.linspace(0, B, NR)


def presion(e, xs):
    """(lineal, real) a una distancia d = B − x del borde cargado (derecha)."""
    d = B - xs
    qm = Q / (B * L)
    lin = qm * (1 + 6 * e / B) - qm * 12 * e / B ** 2 * d
    if e <= B / 6 + 1e-12:
        return lin, lin.copy(), qm * (1 + 6 * e / B), B
    a = 3 * (B / 2 - e); qx = 4 * Q / (3 * L * (B - 2 * e))
    return lin, qx * (1 - d / a), qx, a


def zapata(fig, e, carga=1.0, titulo_q=True):
    ax = fig.add_axes([0.05, 0.47, 0.9, 0.42]); ax.set_xlim(-0.35, B + 0.35); ax.set_ylim(-0.25, 1.35); ax.axis("off")
    ax.add_patch(Rectangle((-0.3, -0.25), B + 0.6, 0.25, color="#5a4632"))
    lin, real, qx, a = presion(e, XR)
    esc = 0.0045 * carga
    yplaca = 0.75 - esc * real                      # la placa rígida (recta), sube donde real < 0
    for x, qr, yp in zip(XR, real, yplaca):
        if qr > 1e-9:
            zig(ax, x, 0, yp, NA, lw=2, w=0.035)
        else:
            zig(ax, x, 0, 0.75, GR, lw=1.5, w=0.035, ls="--")
    ax.plot(XR, yplaca, color="#c8ced8", lw=10, solid_capstyle="butt")
    xc = B / 2 + e
    yc = np.interp(xc, XR, yplaca)
    ax.add_patch(Rectangle((xc - 0.08, yc + 0.06), 0.16, 0.35, color="#9aa4b2"))
    ax.annotate("", (xc, yc + 0.06), (xc, yc + 0.55), arrowprops=dict(arrowstyle="-|>", color=RO, lw=4))
    ax.text(xc + 0.1, yc + 0.45, "Q", color=RO, fontsize=18, weight="bold")
    if e > 0.005:
        ax.annotate("", (B / 2, -0.12), (xc, -0.12), arrowprops=dict(arrowstyle="<->", color=TX, lw=1.5))
        ax.text((B / 2 + xc) / 2, -0.21, "e", ha="center", fontsize=15)
    return lin, real, qx, a


def p4(t, i):
    fig = lienzo("Columna al centro: todos los resortes aprietan igual")
    zapata(fig, 0.0, carga=min(1.0, 1.5 * t))
    fig.text(0.5, 0.33, "q = Q / (B·L) = %.1f tonf/m²  en toda la base" % (Q / (B * L) * min(1.0, 1.5 * t)),
             ha="center", fontsize=22, color=NA)
    guardar(fig)


paso("columna al centro", 40, p4)


def p5(t, i):
    e = (B / 3) * min(1.0, t * 1.15)
    fig = lienzo("La columna se corre: el borde se LEVANTA")
    lin, real, qx, a = zapata(fig, e)
    g = fig.add_axes([0.08, 0.215, 0.5, 0.22]); g.set_facecolor(FONDO)
    xs = np.linspace(0, B, 200); ln, rl, _, _ = presion(e, xs)
    g.plot(xs, ln, color=AZ, lw=1.5, ls="--", label="si el suelo tirara (lineal)")
    g.fill_between(xs, ln, 0, where=ln < 0, color=RO, alpha=0.35)
    g.plot(xs, np.maximum(rl, 0), color=NA, lw=3, label="real: sin tracción")
    g.axhline(0, color=GR, lw=1); g.set_xlim(0, B); g.set_ylim(-35, 115); g.set_yticks([0, 50, 100])
    g.set_ylabel("q"); g.set_xticks([]); g.legend(loc="upper left", fontsize=11, facecolor=FONDO, edgecolor=GR)
    estado = "e ≤ B/6: toda la base aprieta" if e <= B / 6 + 1e-9 else "e > B/6: el borde se suelta"
    fig.text(0.64, 0.40, "e/B = %.3f" % (e / B), fontsize=20)
    fig.text(0.64, 0.33, estado, fontsize=17, color=VE if e <= B / 6 + 1e-9 else RO)
    fig.text(0.64, 0.25, "q_max = %.1f tonf/m²" % qx, fontsize=26, color=NA, weight="bold")
    guardar(fig)


paso("columna corrida", 120, p5)

# ── 6 · las vueltas reales ──
V = json.load(open(VJ, encoding="utf-8"))
XY = np.array(V["xy"])
TOT = len(XY)
vv = V["vueltas"]


def p6(t, i):
    nv = len(vv); per = 26
    kv = min(nv - 1, i // per); f = (i % per) / per
    v = vv[kv]; act = np.array(v["activo"]); w = np.array(v["w"])
    tira = act & (w > 0)
    q = np.where(act, -w * KS, 0)
    fig = lienzo("La computadora itera: suelta los que tiran y recalcula")
    ax = fig.add_axes([0.06, 0.21, 0.42, 0.68]); ax.set_aspect("equal"); ax.axis("off")
    ax.scatter(XY[~act, 0], XY[~act, 1], s=14, color="#3a3f48")
    sc = ax.scatter(XY[act & ~tira, 0], XY[act & ~tira, 1], s=16, c=q[act & ~tira], cmap="YlOrRd", vmin=0, vmax=85)
    if f > 0.45 and tira.any():
        ax.scatter(XY[tira, 0], XY[tira, 1], s=40, color=RO, edgecolors="white", linewidths=0.6)
    ax.text(0.75, -0.12, "vista en planta (961 resortes)", ha="center", fontsize=13)
    x0 = 0.54
    fig.text(x0, 0.83, "Vuelta %d" % (kv + 1), fontsize=30, weight="bold", color=NA)
    fig.text(x0, 0.73, "resortes apoyados: %d de %d" % (act.sum(), TOT), fontsize=20)
    fig.text(x0, 0.66, "tirando (se sueltan): %d" % tira.sum(), fontsize=20, color=RO if tira.any() else VE)
    fig.text(x0, 0.59, "q_max = %.2f tonf/m²" % (-(w[act]).min() * KS), fontsize=20, color=NA)
    hist = ["%d" % np.array(vv[j]["activo"]).sum() for j in range(kv + 1)]
    fig.text(x0, 0.46, " → ".join(hist), fontsize=24, color=TX)
    if kv == nv - 1 and not tira.any():
        fig.text(x0, 0.35, "ya no cambia: terminó", fontsize=24, color=VE, weight="bold")
    fig.text(x0, 0.24, "Braja Das, ejemplo 6.10: 1.5 × 1.5 m, 606 kN", fontsize=13, color=GR)
    guardar(fig)


paso("vueltas", 26 * len(vv), p6)


# ── 7 · por qué importa ──
def p7(t, i):
    fig = lienzo("Si no lo haces: 6.4 % MENOS presión, del lado inseguro")
    ax = fig.add_axes([0.1, 0.26, 0.45, 0.6]); ax.set_facecolor(FONDO)
    s = min(1.0, t * 1.6)
    ax.bar([0, 1], [76.67 * s, 81.91 * s], color=[RO, VE], width=0.6)
    ax.set_xticks([0, 1], ["lineal\n(el suelo tira)", "no lineal\n(sin tracción)"]); ax.set_ylim(0, 95); ax.set_ylabel("q_max  tonf/m²")
    if s >= 1:
        ax.text(0, 78.5, "76.67", ha="center", fontsize=20, color=RO); ax.text(1, 83.8, "81.91", ha="center", fontsize=20, color=VE)
    if t > 0.55:
        fig.text(0.62, 0.72, "−6.4 %", fontsize=46, color=RO, weight="bold")
        fig.text(0.62, 0.63, "el lineal subestima la presión", fontsize=18)
    if t > 0.75:
        fig.text(0.62, 0.50, "misma malla, mismo resultado:", fontsize=15, color=GR)
        for j, (n, qv) in enumerate([("SAP2000", "81.914"), ("SAFE", "81.915"), ("ETABS", "81.915"), ("OpenSees", "81.915"), ("Hekatan", "81.915")]):
            fig.text(0.62 + 0.07 * (j % 5) * 0 , 0.44 - 0.045 * j, "%-9s %s" % (n, qv), fontsize=15, family="Consolas")
    guardar(fig)


paso("por qué importa", 50, p7)

json.dump({"pasos": pasos}, open(os.path.join(OUT, "pasos.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(k, "fotogramas,", len(pasos), "pasos")
