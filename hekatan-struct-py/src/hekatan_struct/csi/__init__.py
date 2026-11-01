# -*- coding: utf-8 -*-
r"""Elementos de área de SAP2000 / ETABS y las placas del libro de Wilson, con firmas homogéneas.

    k_<elemento>(xy, E, nu, t, ...)  ->  K local del elemento (numpy)

| función               | GDL por nudo     | qué es                                                    |
|-----------------------|------------------|-----------------------------------------------------------|
| k_membrana_csi        | [u, v, θz]       | membrana con drilling (Allman/ITW 1990 + constantes CSI)   |
| k_shell_thin_dkq      | [w, θx, θy]      | Shell-Thin cuadrilátero = DKQ (Batoz y Tahar 1982)         |
| k_shell_thin_dkt      | [w, θx, θy]      | Shell-Thin triángulo = DKT (Batoz, Bathe y Ho 1980)        |
| k_shell_thick_cuad    | [w, θx, θy]      | Shell-Thick cuadrilátero de CSI (22 GDL condensados a 12)  |
| k_shell_thick_tri     | [w, θx, θy]      | Shell-Thick triángulo de CSI (15 GDL condensados a 9)      |
| k_dke                 | [w, θx, θy]      | DKE de Wilson 2005, ec. (8.21)  (= DKQ)                    |
| k_dse                 | [w, θx, θy]      | DSE de Wilson 2005, ec. (8.18)-(8.19)  (NO es el Thick CSI) |

θx = ∂w/∂y, θy = −∂w/∂x (mano derecha); nudos antihorarios. Estado de verificación: `INVENTARIO` y
`docs/FORMULACIONES_WILSON_CSI.md`; tabla reproducible: `python -m hekatan_struct.csi.comparar`.
"""
from __future__ import annotations

import numpy as np

from ..placas import k_dkq as _k_dkq, k_dkt as _k_dkt, k_grueso as _k_grueso
from ..placas_wilson import k_dke as _k_dke, k_dse as _k_dse
from .membrana import k_membrana_csi, resolver_membrana
from .shell_thick import k_shell_thick_cuad, k22_grueso_cuad, condensar_saltando
from .inventario import INVENTARIO


def k_shell_thin_dkq(xy, E, nu, t):
    """Shell-Thin cuadrilátero de CSI = DKQ de Batoz y Tahar (1982). K 12x12, GDL [w, θx, θy]."""
    return _k_dkq(np.asarray(xy, float), E, nu, t)


def k_shell_thin_dkt(xy, E, nu, t):
    """Shell-Thin triángulo de CSI = DKT de Batoz, Bathe y Ho (1980). K 9x9, GDL [w, θx, θy]."""
    return _k_dkt(np.asarray(xy, float), E, nu, t)


def k_shell_thick_tri(xy, E, nu, t):
    """Shell-Thick triángulo de CSI (K 15x15 condensada a 9x9). GDL [w, θx, θy]."""
    return _k_grueso(np.asarray(xy, float), E, nu, t)


def k_dke(xy, E, nu, t):
    """DKE de Wilson (2005, ec. 8.21), Gauss 2x2. K 12x12, GDL [w, θx, θy]."""
    return _k_dke(xy, E, nu, t)


def k_dse(xy, E, nu, t):
    """DSE de Wilson (2005, ec. 8.18-8.19), 4 Δθ condensados. K 12x12, GDL [w, θx, θy]."""
    return _k_dse(xy, E, nu, t)


__all__ = ["k_membrana_csi", "resolver_membrana", "k_shell_thin_dkq", "k_shell_thin_dkt",
           "k_shell_thick_cuad", "k_shell_thick_tri", "k22_grueso_cuad", "condensar_saltando",
           "k_dke", "k_dse", "INVENTARIO"]
