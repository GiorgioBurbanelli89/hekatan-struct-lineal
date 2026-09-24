# -*- coding: utf-8 -*-
"""La tabla de los CUATRO programas sobre el mismo modelo dual, y la del cortante
basal. Todos los numeros salen de ficheros medidos en disco, con su procedencia
escrita en el pie de la figura.

    python _tabla_4.py <carpeta_de_capturas>
"""
import json, os, sys
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = sys.argv[1]
L = lambda f: json.load(open(os.path.join(AQUI, f), encoding="utf-8"))

hek = L("hekatan_espectral_sap.json")
sap = L("sap_dual_sismo.json")
osj = L("opensees_dual.json")
eta = L("etabs_dual.json")

NEGRO, ORO, CLARO = "#111111", "#e8a33d", "#f2f2f2"

def figura(titulo, cabecera, filas, pie, salida, anchos=None):
    fig = plt.figure(figsize=(12.8, 7.2), dpi=100, facecolor=NEGRO)
    ax = fig.add_axes([0, 0, 1, 1]); ax.axis("off"); ax.set_facecolor(NEGRO)
    fig.text(0.5, 0.945, "HEKATAN ENGINEERS", ha="center", color="#b9a7e8",
             fontsize=12, fontfamily="serif", weight="bold")
    fig.text(0.5, 0.868, titulo, ha="center", color=CLARO, fontsize=23, fontfamily="serif")
    fig.add_artist(plt.Line2D([0.435, 0.565], [0.845, 0.845], color=ORO, lw=3.5))
    t = ax.table(cellText=filas, colLabels=cabecera, loc="center",
                 cellLoc="center", bbox=[0.055, 0.25, 0.89, 0.55],
                 colWidths=anchos)
    t.auto_set_font_size(False); t.set_fontsize(13)
    for (r, c), cel in t.get_celld().items():
        cel.set_edgecolor("#3a3a3a"); cel.set_facecolor(NEGRO if r else "#1d1d1d")
        cel.get_text().set_color(ORO if r == 0 else CLARO)
        cel.get_text().set_fontfamily("serif")
        cel.set_height(0.085)
    fig.text(0.5, 0.135, pie, ha="center", va="top", color="#8d8d8d",
             fontsize=10.5, fontfamily="monospace", linespacing=1.7)
    fig.savefig(os.path.join(CAP, salida), facecolor=NEGRO); plt.close(fig)
    print("->", salida)

# ── 1) periodos de los cuatro ────────────────────────────────────────────────
fil = []
for i in range(5):
    h, s, o_, e = hek["T"][i], sap["T"][i], osj["T"][i], eta["T"][i]
    fil.append(["%d" % (i + 1), "%.4f" % h, "%.4f" % s, "%+.2f %%" % (100 * (h - s) / s),
                "%.4f" % o_, "%+.2f %%" % (100 * (o_ - s) / s), "%.4f" % e])
figura("Periodos del mismo modelo, mismo día",
       ["modo", "Hekatan\n(s)", "SAP2000\n(s)", "Hek vs SAP",
        "OpenSees\n(s)", "OS vs SAP", "ETABS\n(s)"],
       fil,
       "Hekatan y SAP2000 y OpenSees: malla 1,0 m, 545 nudos, Shell-Thick, misma malla nudo a nudo.\n"
       "ETABS: el mismo Test M — Dual con su automallado (TestM_Dual.EDB), o sea OTRA malla: por eso no se resta.\n"
       "hekatan_espectral_sap.json:2 · sap_dual_sismo.json:T · opensees_dual.json · etabs_dual.json",
       "40_tabla_periodos_4.png")

# ── 2) cortante basal ────────────────────────────────────────────────────────
d = hek["difPorCiento"]
fil2 = [
    ["W (peso sísmico)", "%.4f tonf" % hek["W"], "%.4f tonf" % sap["W_sap_tonf"],
     "%+.3f %%" % (100 * (hek["W"] - sap["W_sap_tonf"]) / sap["W_sap_tonf"])],
    ["V estático (FLE)", "%.4f tonf" % hek["Vest"], "%.4f tonf" % sap["Vx_LX_tonf"],
     "%+.3f %%" % (100 * (hek["Vest"] - sap["Vx_LX_tonf"]) / sap["Vx_LX_tonf"])],
    ["V dinámico X (CQC)", "%.4f tonf" % hek["nuevo"]["X"], "%.4f tonf" % sap["V_SPECX_tonf"],
     "%+.3f %%" % d["nuevoX"]],
    ["V dinámico Y (CQC)", "%.4f tonf" % hek["nuevo"]["Y"], "%.4f tonf" % sap["V_SPECY_tonf"],
     "%+.3f %%" % d["nuevoY"]],
]
figura("Cortante basal, Hekatan Struct contra SAP2000",
       ["", "Hekatan Struct", "SAP2000 24", "diferencia"], fil2,
       "Mismo modelo, misma malla (545 nudos), mismas fuerzas laterales y el mismo espectro NEC-15.\n"
       "Antes de arreglar la masa de los apoyos y el signo de Γ: X %+.3f %% y Y %+.3f %%.\n"
       "hekatan_espectral_sap.json · sap_dual_sismo.json · responseSpectrum.ts:171-173"
       % (d["viejoX"], d["viejoY"]),
       "41_tabla_cortante.png", anchos=[0.30, 0.24, 0.24, 0.22])
