# -*- coding: utf-8 -*-
"""`hekatan-csi`: validar Hekatan Struct contra SAP2000 / ETABS en un segundo, sin abrirlos.

Por qué no hace falta el programa: lo que CSI contestó (K 12x12, desplazamientos de las mallas
ITW 1990) ya está medido y guardado dentro del paquete (csi/datos). El comando recalcula con
Hekatan y compara número a número; si algo se mueve más que la tolerancia, sale con código 1
(sirve para CI y para «¿rompí algo?» después de cada cambio).

    hekatan-csi validar            # PASA / FALLA por familia, código de salida 0 o 1
    hekatan-csi validar --tol 1e-8 # más estricto
    hekatan-csi tabla              # elemento x juez (SAP2000 / ETABS / libro)
    hekatan-csi pendientes         # lo que falta validar
"""
from __future__ import annotations

import argparse
import sys

from . import comparar as C
from .inventario import INVENTARIO, PENDIENTES


def _familias(datos):
    """[(nombre, juez, nº de casos, peor error, unidad)] — error en % salvo la membrana-ETABS (relativo)."""
    out = []
    pl = C.celdas_placa(datos)
    for tipo, juez, nom in (("thick", "SAP2000", "k_shell_thick_cuad"), ("thick", "ETABS", "k_shell_thick_cuad"),
                            ("thin", "ETABS", "k_shell_thin_dkq")):
        f = [r for r in pl if r[3] == tipo and r[2] == juez and r[1] not in C.ARTEFACTOS]
        if f:
            out.append((nom, juez, len(f), max(r[4] for r in f), "%"))
    me = C.celdas_membrana_etabs(datos)
    out.append(("k_membrana_csi", "ETABS", len(me), max(e for _, e in me), "rel"))
    ms = C.mallas_membrana_sap(datos)
    out.append(("k_membrana_csi", "SAP2000", len(ms), max(e for _, e in ms), "% |u|max"))
    return out


def cmd_validar(a):
    datos = C.cargar(a.datos)
    # tolerancia: % para placas/mallas; la relativa de la membrana-ETABS = tol/100
    malas = 0
    print("%-20s %-8s %6s  %-12s %s" % ("elemento", "juez", "casos", "peor error", ""))
    for nom, juez, n, e, u in _familias(datos):
        lim = a.tol / 100.0 if u == "rel" else a.tol
        ok = e <= lim
        malas += 0 if ok else 1
        print("%-20s %-8s %6d  %-12.2e %s  (%s)" % (nom, juez, n, e, "PASA " if ok else "FALLA", u))
    print("\n%s  (tolerancia %.0e %%)" % ("TODO PASA" if not malas else "%d familia(s) FALLAN" % malas, a.tol))
    return 1 if malas else 0


def cmd_tabla(_a):
    print("%-22s %-5s %-5s %-5s" % ("elemento", "SAP", "ETABS", "libro"))
    for f in INVENTARIO:
        print("%-22s %-5s %-5s %-5s" % (f["elemento"], C.SIMB[f["SAP2000"][0]], C.SIMB[f["ETABS"][0]], C.SIMB[f["libro"][0]]))
    print("\n✔ verificado con test · ✔* en bitácora · ⏳ falta · ✘ no coincide · — no aplica")
    return 0


def cmd_pendientes(_a):
    for p in PENDIENTES:
        print("-", p)
    return 0


def main(argv=None):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass
    ap = argparse.ArgumentParser(prog="hekatan-csi", description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)
    q = sub.add_parser("validar", help="recalcula y compara con lo medido en SAP2000/ETABS")
    q.add_argument("--tol", type=float, default=1e-6, help="tolerancia en %% (def. 1e-6)")
    q.add_argument("--datos", default=None, help="otro medidas_csi.json.gz")
    q.set_defaults(f=cmd_validar)
    sub.add_parser("tabla", help="elemento x juez").set_defaults(f=cmd_tabla)
    sub.add_parser("pendientes", help="lo que falta").set_defaults(f=cmd_pendientes)
    a = ap.parse_args(argv)
    return a.f(a)


if __name__ == "__main__":
    sys.exit(main())
