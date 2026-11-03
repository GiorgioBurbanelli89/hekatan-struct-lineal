# -*- coding: utf-8 -*-
"""Compara las K de `hekatan_struct.csi` con lo MEDIDO en SAP2000 24 / ETABS 22 (no abre ningún programa).

    python -m hekatan_struct.csi.comparar [ruta/medidas_csi.json.gz]

Datos: `csi/datos/medidas_csi.json.gz` (van dentro del paquete) (K 12x12 medidas por OAPI, flexibilidades de membrana y
desplazamientos de las mallas ITW 1990 en SAP2000). Solo números: nudos, E, ν, t, K/F/u.
"""
from __future__ import annotations

import gzip
import json
import os
import sys

import numpy as np

from .membrana import k_membrana_csi, resolver_membrana
from .shell_thick import k_shell_thick_cuad
from .inventario import INVENTARIO, PENDIENTES
from ..placas import k_dkq

DATOS = os.path.join(os.path.dirname(__file__), "datos", "medidas_csi.json.gz")   # viaja dentro del paquete
ARTEFACTOS = {"solo_m11", "solo_m22"}       # un solo modificador de flexión: pivote de redondeo de CSI
JUEZ_THICK = {"k_directa": "ETABS"}         # el resto de conjuntos son de SAP2000


def cargar(ruta=None):
    with gzip.open(ruta or DATOS, "rb") as fh:
        return json.loads(fh.read().decode("utf-8"))


# ------------------------------------------------------------------ Shell-Thick / Shell-Thin (K directa)
def _escala_giros(Km, pts):
    """Potencia de 1000 de los GDL de giro (kN·mm vs kN·m en la captura), leída del espacio nulo de la K."""
    K = (Km + Km.T) / 2
    w, V = np.linalg.eigh(K)
    nul = V[:, np.abs(w) < 1e-8 * np.abs(w).max()]
    if nul.shape[1] < 3:
        return 1.0
    P = np.asarray(pts, float); r = np.sqrt(((P - P.mean(0)) ** 2).sum(1)).mean()
    u = max((nul[:, j] for j in range(nul.shape[1])), key=lambda u: u[1::3] @ u[1::3] + u[2::3] @ u[2::3])
    raz = np.sqrt(u[0::3] @ u[0::3]) / np.sqrt(u[1::3] @ u[1::3] + u[2::3] @ u[2::3]) / r
    return 1000.0 ** round(np.log10(max(raz, 1e-300)) / 3.0)


def celdas_placa(datos):
    """[(conjunto, celda, juez, tipo 'thick'|'thin', error %)] contra la K 12x12 medida."""
    out = []
    for conj, d in datos["thick"].items():
        ref_mods = np.linalg.norm(np.array(d["entera"]["K"], float)) if conj == "celda_sap_mods" else None
        for nm, c in d.items():
            Km = np.array(c["K"], float)
            if "thin" in nm:
                K = k_dkq(np.asarray(c["pts"], float), c["E"], c["nu"], c["t"])
                out.append((conj, nm, JUEZ_THICK.get(conj, "SAP2000"), "thin",
                            100 * np.linalg.norm(K - Km) / np.linalg.norm(Km)))
                continue
            if conj == "celda_sap_t_nu":
                fa = _escala_giros(Km, c["pts"])
                sc = np.tile([1.0, 1.0 / fa, 1.0 / fa], 4); Km = np.outer(sc, sc) * Km
                Km = Km - 1e-3 * np.eye(12)          # muelles de 1e-3 del modelo de captura (medido)
            K = k_shell_thick_cuad(c["pts"], c["E"], c["nu"], c["t"], mod=c.get("mods"))
            nref = np.linalg.norm(Km)
            if ref_mods is not None and nref < 1e-9 * ref_mods:
                nref = ref_mods                      # toda la flexión a cero: CSI da K = 0 (ruido)
            out.append((conj, nm, JUEZ_THICK.get(conj, "SAP2000"), "thick", 100 * np.linalg.norm(K - Km) / nref))
    return out


# ------------------------------------------------------------------ membrana
def reconstruir_k12(v):
    """K 12x12 desde la flexibilidad F (9x9) medida con 3 GDL sujetos (los rígidos)."""
    pts = v["pts"]
    libres = [tuple(x) for x in v["libres"]]
    sujetos = [tuple(x) for x in v["sujetos"]]
    Kff = np.linalg.inv(np.array(v["F"]))
    R = np.zeros((12, 3))
    for n, (x, y) in enumerate(pts):
        R[3 * n, 0] = 1; R[3 * n + 1, 1] = 1
        R[3 * n, 2] = -y; R[3 * n + 1, 2] = x; R[3 * n + 2, 2] = 1
    fi = [3 * n + k for n, k in libres]
    ri = [3 * n + k for n, k in sujetos]
    Kfr = -Kff @ R[fi] @ np.linalg.inv(R[ri])
    Krr = -Kfr.T @ R[fi] @ np.linalg.inv(R[ri])
    K = np.zeros((12, 12))
    K[np.ix_(fi, fi)] = Kff; K[np.ix_(fi, ri)] = Kfr
    K[np.ix_(ri, fi)] = Kfr.T; K[np.ix_(ri, ri)] = Krr
    return (K + K.T) / 2


def celdas_membrana_etabs(datos):
    """[(celda, error relativo ||dK||/||K||)] contra la 12x12 de ETABS 22."""
    out = []
    for fn, d in datos["membrana_etabs"].items():
        for k, v in d.items():
            Km = reconstruir_k12(v)
            Kc = k_membrana_csi(v["pts"], v["E"], v["nu"], v["t"])
            out.append((("wall:" if "wall" in fn else "") + k, np.linalg.norm(Kc - Km) / np.linalg.norm(Km)))
    return out


def mallas_itw():
    """Las 12 mallas de las Tablas I-III de ITW 1990 (nombre, nudos, elementos, apoyos, cargas, E, ν, t)."""
    casos = []
    for dist in (0, 1):
        xb = np.array([0, 10 / 6, 20 / 6, 5, 40 / 6, 50 / 6, 10]); xt = xb.copy()
        if dist:
            xt = np.array([0, 10 / 6 - 1, 20 / 6 - 1, 5, 40 / 6 + 1, 50 / 6 + 1, 10])
        nod = [(x, 0.0) for x in xb] + [(x, 1.0) for x in xt]
        el = [[i, i + 1, 7 + i + 1, 7 + i] for i in range(6)]
        for caso in (1, 2):
            c = ({(7, 0): -1.0, (0, 0): 1.0, (13, 0): 1.0, (6, 0): -1.0} if caso == 1 else
                 {(0, 2): 0.5, (7, 2): 0.5, (6, 2): -0.5, (13, 2): -0.5})
            casos.append(("I_dist%d_caso%d" % (dist, caso), nod, el, {0: [0, 1], 6: [1]}, c, 100.0, 0.0, 1.0))
    for nx, ny, ir in ((4, 1, 0), (8, 2, 0), (16, 4, 0), (4, 1, 1)):
        if ir:
            xb = [0, 16, 20, 28, 48]; xt = [0, 12, 24, 36, 48]
        else:
            xb = list(np.linspace(0, 48, nx + 1)); xt = xb
        nj = ny + 1
        nod = [(xb[i] + (xt[i] - xb[i]) * j / ny, 12.0 * j / ny) for i in range(nx + 1) for j in range(nj)]
        idx = lambda i, j, nj=nj: i * nj + j  # noqa: E731
        el = [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)] for i in range(nx) for j in range(ny)]
        ap = {idx(0, j): [0, 1] for j in range(nj)}
        c = {(idx(nx, j), 1): 40.0 * (0.5 if j in (0, ny) else 1.0) / ny for j in range(nj)}
        casos.append(("II_%dx%d%s" % (nx, ny, "*" if ir else ""), nod, el, ap, c, 30000.0, 0.25, 1.0))
    for n in (1, 2, 4, 8):
        idx = lambda i, j, n=n: i * (n + 1) + j  # noqa: E731
        nod = []
        for i in range(n + 1):
            xi = i / n
            for j in range(n + 1):
                yb = 44 * xi; yt = 44 + 16 * xi
                nod.append((48 * xi, yb + (yt - yb) * j / n))
        el = [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)] for i in range(n) for j in range(n)]
        ap = {idx(0, j): [0, 1] for j in range(n + 1)}
        c = {(idx(n, j), 1): 1.0 * (0.5 if j in (0, n) else 1.0) / n for j in range(n + 1)}
        casos.append(("III_%dx%d" % (n, n), nod, el, ap, c, 1.0, 1 / 3, 1.0))
    return casos


def mallas_membrana_sap(datos):
    """[(malla, error % del desplazamiento máximo)] contra SAP2000 24 (área Membrane)."""
    sap = datos["sap_membrana_tablas_itw"]
    out = []
    for nm, nod, el, ap, c, E, nu, t in mallas_itw():
        u = resolver_membrana(nod, el, ap, c, E, nu, t)
        ref = sap[nm]
        a = np.array([ref[k] for k in ref]); b = np.array([u[int(k)] for k in ref])
        out.append((nm, 100 * np.abs(a - b).max() / np.abs(a).max()))
    return out


# ------------------------------------------------------------------ tabla
SIMB = {"ok": "✔", "ok_reg": "✔*", "pend": "⏳", "no": "✘", "-": "—"}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass
    datos = cargar(argv[0] if argv else None)
    print("== Medido ahora (datos del paquete: csi/datos) ==")
    pl = celdas_placa(datos)
    for tipo, juez in (("thick", "SAP2000"), ("thick", "ETABS"), ("thin", "ETABS")):
        f = [r for r in pl if r[3] == tipo and r[2] == juez and r[1] not in ARTEFACTOS]
        if f:
            p = max(f, key=lambda r: r[4])
            print("  %-22s vs %-8s %3d celdas  peor %.2e %%  (%s:%s)" % (
                "k_shell_thick_cuad" if tipo == "thick" else "k_shell_thin_dkq", juez, len(f), p[4], p[0], p[1]))
    for r in pl:
        if r[1] in ARTEFACTOS:
            print("  artefacto %-12s %.3e %%  (un solo modificador de flexión; ver PENDIENTES)" % (r[1], r[4]))
    me = celdas_membrana_etabs(datos)
    print("  %-22s vs %-8s %3d celdas  peor %.2e (relativo)" % ("k_membrana_csi", "ETABS", len(me), max(e for _, e in me)))
    ms = mallas_membrana_sap(datos)
    print("  %-22s vs %-8s %3d mallas  peor %.2e %% de |u|max (Tablas ITW 1990)" % (
        "k_membrana_csi", "SAP2000", len(ms), max(e for _, e in ms)))

    print("\n== Elemento x juez (✔ verificado con test · ✔* en bitácora · ⏳ falta · ✘ no coincide · — no aplica) ==")
    print("%-22s %-5s %-5s %-5s" % ("elemento", "SAP", "ETABS", "libro"))
    for f in INVENTARIO:
        print("%-22s %-5s %-5s %-5s" % (f["elemento"], SIMB[f["SAP2000"][0]], SIMB[f["ETABS"][0]], SIMB[f["libro"][0]]))
    print("\nDetalle:")
    for f in INVENTARIO:
        print("- %s  [%s]" % (f["elemento"], f["fuente"]))
        for j in ("SAP2000", "ETABS", "libro"):
            print("    %-7s %s %s" % (j, SIMB[f[j][0]], f[j][1]))
    print("\n⏳ Falta:")
    for p in PENDIENTES:
        print("  -", p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
