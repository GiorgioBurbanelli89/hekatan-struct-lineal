# -*- coding: utf-8 -*-
r"""Referencia de Python para test_wilson_csi.cpp (DKE/DSE de Wilson y Shell-Thick de CSI en C++).

    python test_wilson_csi_ref.py            escribe test_wilson_csi_ref.txt (lo lee el .exe)
    python test_wilson_csi_ref.py --check    lee test_wilson_csi_k22.txt (lo escribe el .exe) y compara
                                             la K de 22 GDL del C++ con el VOLCADO del kernel de ETABS 19

Fuentes (las mismas que arbitran el Python):
  hekatan-struct-py/src/hekatan_struct/placas_wilson.py           k_dke, k_dse, tablas 8.1-8.6
  hekatan-struct-py/examples/07_viga_un_elemento_wilson.py        tabla 8.1 (E 1e7, G 3.846e6, nu de flexion 0) y 8.6
  ingenieria-inversa/csi_shellthick/k_grueso_cuad.py, verificar.py  140 celdas de SAP2000/ETABS + kernel_precond_*.npz
"""
import os
import sys

import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ_STRUCT = os.path.normpath(os.path.join(AQUI, "..", "..", "..", ".."))           # hekatan-struct
RAIZ = os.path.dirname(RAIZ_STRUCT)                                                  # Hekatan Calc 1.0.0
sys.path.insert(0, os.path.join(RAIZ_STRUCT, "hekatan-struct-py", "src"))
sys.path.insert(0, os.path.join(RAIZ_STRUCT, "hekatan-struct-py", "examples"))
sys.path.insert(0, os.path.join(RAIZ, "ingenieria-inversa", "csi_shellthick"))

import hekatan_struct.placas_wilson as PW  # noqa: E402
import importlib  # noqa: E402
EX7 = importlib.import_module("07_viga_un_elemento_wilson")
import k_grueso_cuad as KG  # noqa: E402
import verificar as V  # noqa: E402

REF = os.path.join(AQUI, "test_wilson_csi_ref.txt")
K22_CPP = os.path.join(AQUI, "test_wilson_csi_k22.txt")

GEOMS = {
    "cuadrado": [(0, 0), (1, 0), (1, 1), (0, 1)],
    "rectangulo": [(0, 0), (2.0, 0), (2.0, 0.7), (0, 0.7)],
    "trapecio": [(0, 0), (1.2, 0), (0.9, 0.8), (0.1, 1.0)],
    "viga_8_1": [(0, 0), (6.0, 0), (6.0, 0.2), (0, 0.2)],
}
MATS = [(2.2e7, 0.2, 0.20), (1.0, 0.3, 0.01), (10.92, 0.3, 1.0)]
MODS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]      # f11 f22 f12 m11 m22 m12 v13 v23


def fmt(a):
    return " ".join("%.17g" % v for v in np.ravel(a))


def escribir():
    L = []
    # -- K 12x12: C++ contra Python (tipo, E, nu, t, mod?, 8 coords, 144) --
    for g, xy in GEOMS.items():
        for E, nu, t in MATS:
            for mod in (None, MODS):
                xyA = np.asarray(xy, float)
                Db, Ds = KG.matrices_D(E, nu, t, mod)          # mismas D (Wilson 8.15 = CSI) con modificadores
                PW_D = PW._D
                PW._D = lambda E_, nu_, h_: (Db, Ds)
                try:
                    kdke, kdse = PW.k_dke(xyA, E, nu, t), PW.k_dse(xyA, E, nu, t)
                finally:
                    PW._D = PW_D
                kcsi = KG.k_grueso_cuad(xyA, E, nu, t, mod)
                m = "1 " + fmt(MODS) if mod else "0"
                for tipo, K in (("dke", kdke), ("dse", kdse), ("csi", kcsi)):
                    L.append("K %s %s %.17g %.17g %.17g %s %s %s" % (tipo, g, E, nu, t, m, fmt(xyA), fmt(K)))
    # -- K 22x22 de CSI antes de condensar (geometrias del kernel) --
    for geom, d in V.KERNEL.items():
        xy = np.asarray(d["xy"], float)
        L.append("Q %s 22000 0 200 %s %s" % (geom, fmt(xy), fmt(KG.k22_grueso_cuad(xy, 22000.0, 0.0, 200.0))))
    # -- las 140+ celdas MEDIDAS de SAP2000/ETABS (K ya en unidades de la formula) --
    n = 0
    for f, nm, K, Km, nref in V.celdas():
        c_mod = None
        import json
        d = json.load(open(os.path.join(V.GAL, f + ".json"), encoding="utf-8"))[nm]
        c_mod = d.get("mods")
        m = ("1 " + fmt(c_mod[:8])) if c_mod is not None else "0"
        art = 1 if nm in ("solo_m11", "solo_m22") else 0
        L.append("M %s:%s %d %.17g %.17g %.17g %s %s %.17g %s %s" % (
            f, nm, art, d["E"], d["nu"], d["t"], m, fmt(np.asarray(d["pts"], float)), nref, fmt(Km), fmt(K)))
        n += 1
    # -- tablas del libro con el Python --
    t81 = EX7.tabla_8_1(1e7, 3.846e6)
    dke1, dse1 = EX7.un_elemento("dke", 1e7, 3.846e6), EX7.un_elemento("dse", 1e7, 3.846e6)
    L.append("T t81_w_dke %.17g" % t81["DKE"])
    L.append("T t81_w_dse %.17g" % t81["DSE"])
    L.append("T t81_M_dke %.17g" % dke1["M_base_reaccion"])
    L.append("T t81_M_dse %.17g" % dse1["M_base_reaccion"])
    for n_, hs, carga, tab in ((4, (1, .1, .01, .001, .0001), "puntual", "t82"), (16, (1, .01, .0001), "puntual", "t83"),
                               (16, (1, .01, .0001), "uniforme", "t84")):
        for h in hs:
            for tipo in ("dke", "dse"):
                w, M = PW.cuadrante_placa_cuadrada(tipo, h, n_, carga)
                L.append("T %s_%s_h%g_w %.17g" % (tab, tipo, h, w))
                L.append("T %s_%s_h%g_M %.17g" % (tab, tipo, h, M))
    for giro in ("libre", "fijo"):
        for nx, ny, mal in ((6, 1, "1x6"), (9, 9, "9x9")):
            for tipo in ("dke", "dse"):
                L.append("T t86_%s_%s_%s %.17g" % (giro, mal, tipo, EX7.torsion(tipo, nx, ny, giro == "fijo")))
    open(REF, "w", encoding="ascii").write("\n".join(L) + "\n")
    print("escrito %s: %d lineas (%d celdas medidas)" % (REF, len(L), n))


def check():
    """La K 22x22 que escribio el C++ contra el volcado del kernel de ETABS 19 (misma cuenta que verificar.py)."""
    vals = {}
    for ln in open(K22_CPP, encoding="ascii"):
        p = ln.split()
        vals[p[0]] = np.array([float(v) for v in p[1:]]).reshape(22, 22)
    for geom in V.KERNEL:
        Kc = V.k22_kernel(geom)
        a, b, cw = V.KERNEL[geom]["signos"]
        perm, sg = [], []
        for i in range(4):
            perm += [3 * i + 2, 3 * i + 1]; sg += [a, b]
        perm += [0, 3, 6, 9]; sg += [cw] * 4
        perm += list(range(12, 22)); sg += [1] * 10
        sg = np.array(sg, float)
        Kf = vals[geom][np.ix_(perm, perm)] * np.outer(sg, sg)
        nrm = np.linalg.norm
        e_nod = nrm(Kf[:12, :12] - Kc[:12, :12]) / nrm(Kc[:12, :12])
        ec, ef = np.sort(np.linalg.eigvalsh(Kc)), np.sort(np.linalg.eigvalsh(Kf))
        Sc, Sf = KG.condensar_saltando(Kc, 12), KG.condensar_saltando(Kf, 12)
        print("C++ vs kernel ETABS 19 %-5s nodal %.1e  espectro22 %.1e  condensada %.1e" % (
            geom, e_nod, np.abs(ec - ef).max() / ec.max(), nrm(Sf - Sc) / nrm(Sc)))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    check() if "--check" in sys.argv else escribir()
