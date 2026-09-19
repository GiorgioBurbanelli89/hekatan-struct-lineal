"""Evidencia en imagen de SAP2000 / SAFE 20: mapa de presion SERVICIO pintado con los desplazamientos que
DEVOLVIO cada programa (res/<prog>_import.json), con el resumen de su ImportLog al pie. SAP2000 y SAFE corren
ocultos (no hay ventana que capturar): la imagen se hace con SUS numeros, no con los de Hekatan.
  python evidencia_csi.py sap|safe carpeta_salida
"""
import json, os, sys, re
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import PolyCollection
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from resultados_corregido import k_nodal
A = os.path.dirname(os.path.abspath(__file__))
prog, out = sys.argv[1], sys.argv[2]
KS = 400000 * 0.00980665; G = 9.80665
s = json.load(open(os.path.join(A, "res", "%s_import.json" % prog)))
logtxt = open(os.path.join(A, "res", "%s_import.log.txt" % prog), encoding="utf-8").read()
m_apply = re.findall(r"ApplyEditedTables \([^)]*\) -> (\[[^\]]*\])", logtxt)
for c in ("SERVICIO", "DISENO"):
    D = json.load(open(os.path.join(A, "res", "conf_%s.json" % c))); N = D["nodes"]; k = k_nodal(D)
    S = s["casos"][c]["U"]
    if prog == "sap": m = {int(j) - 1: v for j, v in S.items()}
    else:
        idx = {(round(n[0], 3), round(n[1], 3)): i for i, n in enumerate(N)}
        m = {idx[(round(v[6], 3), round(v[7], 3))]: v for v in S.values()}
    polys, vals = [], []
    for e, el in enumerate(D["elements"]):
        if len(el) != 4: continue
        polys.append([N[n][:2] for n in el]); vals.append(sum(-KS * m[n][2] / G for n in el) / 4)
    qn = {n: -KS * m[n][2] / G for n in k}; nmax = max(qn, key=qn.get)
    R = sum(k[n] * -m[n][2] for n in k) / G; uz = -min(v[2] for v in m.values()) * 1000
    fig, ax = plt.subplots(figsize=(10, 6.6), dpi=130)
    pc = PolyCollection(polys, array=vals, cmap="Blues", edgecolors="none"); ax.add_collection(pc)
    ax.set_aspect("equal"); ax.autoscale(); cb = fig.colorbar(pc, ax=ax, shrink=0.8); cb.set_label("q (t/m², media del elemento)")
    ax.plot(N[nmax][0], N[nmax][1], "o", mfc="none", mec="#b91c1c", ms=10)
    nombre = {"sap": "SAP2000 24", "safe": "SAFE 20.3"}[prog]
    ax.set_title("%s — radier MOD_002 corregido, %s (importado del archivo exportado por Hekatan)" % (nombre, c), fontsize=10, loc="left")
    ax.set_xlabel("X (m)"); ax.set_ylabel("Y (m)")
    pie = ("Resultados leidos de %s por su API: %d nudos. q max (nudo) = %.3f t/m² en (%.3f; %.3f) · Uz max = %.3f mm · "
           "reaccion = Σ k·Uz = %.2f t\nImportacion por tablas: %d puntos, %d areas, %d barras, patrones %s, combos %s · "
           "ApplyEditedTables -> %s" % (nombre, len(m), qn[nmax], N[nmax][0], N[nmax][1], uz, R, s["puntos"], s["areas"], s["barras"] or 0,
                                        s.get("patrones"), s.get("combos"), " ; ".join(m_apply)))
    fig.text(0.01, 0.01, pie, fontsize=7.5, va="bottom")
    fig.subplots_adjust(bottom=0.16)
    f = os.path.join(out, "%s_%s_presion_desde_sus_resultados.png" % (prog.upper() if prog == "sap" else "SAFE20", c))
    fig.savefig(f); plt.close(fig); print(f, "q", round(qn[nmax], 4), "uz", round(uz, 4), "R", round(R, 3))
