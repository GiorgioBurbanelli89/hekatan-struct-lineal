# -*- coding: utf-8 -*-
"""PUNTO DE INSERCION de una barra (cardinal points 1-11 de CSI).

El nudo no cae en el centroide de la seccion sino en un punto de ella. Con (D, B) = canto (t3, a lo
largo del eje local 2) y ancho (t2, eje local 3) de la seccion:

        7  8  9          1-9: puntos de la caja (D x B) de la seccion
        4  5  6          10 : centroide  (d2 = d3 = 0)
        1  2  3          11 : centro de cortante (hay que darlo)

El resultado es (d2, d3) = posicion del CENTROIDE respecto al NUDO, en ejes locales de la barra
(arriba-centro, CP 8 de una viga: d2 = -D/2). Es el mismo par que `insertionOffsets` del motor TS/C++.

DOS variantes, las dos de ETABS (casilla «Transform frame stiffness for offsets from centroid»;
en el .e2k `TRANSFORMSTIFF "Yes"`; si el e2k no dice nada, ETABS NO transforma):

  con restriccion rigida   transform=True   u_centroide = u_nudo + theta x r ;  K = R^T K R ;
                                            esfuerzos del centroide = k·(R u)
  sin restriccion rigida   transform=False  la barra solo se desplaza geometricamente: la K no se
                                            toca y el resultado es el del centroide (medido en
                                            ETABS 22: casilla marcada = CP 10)

    from hekatan_struct.insercion import asignar_punto_insercion
    asignar_punto_insercion(ei, k, 8, D=0.60, B=0.30)                     # con restriccion rigida
    asignar_punto_insercion(ei, k, 8, D=0.60, B=0.30, transform=False)    # sin restriccion (solo geometrica)

Verticales 1-9 medidos contra SAP2000 24 y ETABS 22 (voladizo y losa con vigas de borde a <=1e-9).
LATERALES (1,3,4,6,7,9): signo SUPUESTO (derecha = +eje local 3, mirando desde el extremo I hacia J,
el dibujo de CSI) y NO medido contra ETABS: `derecha_es_eje3=False` lo invierte si la medida lo pide.
"""
from __future__ import annotations
import numpy as np

from .data_model import ElementInputs
from .elements.frame import frame_insertion_matrix, frame_local_axes_csi

# punto cardinal -> (fila, columna): fila +1 arriba / 0 medio / -1 abajo ; columna -1 izq / 0 centro / +1 der
_REJILLA = {
    1: (-1, -1), 2: (-1, 0), 3: (-1, 1),
    4: (0, -1),  5: (0, 0),  6: (0, 1),
    7: (1, -1),  8: (1, 0),  9: (1, 1),
}
LATERALES = (1, 3, 4, 6, 7, 9)


def offsets_punto_cardinal(cardinal: int, D: float = 0.0, B: float = 0.0, *,
                           centroide: tuple[float, float] = (0.0, 0.0),
                           centro_cortante: tuple[float, float] | None = None,
                           derecha_es_eje3: bool = True) -> tuple[float, float]:
    """(d2, d3): centroide respecto al nudo, ejes locales de la barra (m).

    D, B            canto (eje 2) y ancho (eje 3) de la caja de la seccion.
    centroide       (c2, c3) del centroide respecto al CENTRO de la caja; (0, 0) en secciones
                    simetricas (rectangulo, I, tubo). Para T, L, C hay que darlo.
    centro_cortante (e2, e3) del centro de cortante respecto al centro de la caja; solo el CP 11.
    """
    cp = int(cardinal)
    c2, c3 = centroide
    if cp == 10:
        return (0.0, 0.0)
    if cp == 11:
        if centro_cortante is None:
            raise ValueError("punto cardinal 11 (centro de cortante): hay que dar centro_cortante=(e2, e3) "
                             "respecto al centro de la caja; la seccion no lo trae")
        return (c2 - centro_cortante[0], c3 - centro_cortante[1])
    if cp not in _REJILLA:
        raise ValueError(f"punto cardinal {cardinal!r}: se esperaba 1..11")
    fila, col = _REJILLA[cp]
    if fila != 0 and not D > 0:
        raise ValueError(f"punto cardinal {cp}: falta el canto D de la seccion (fila arriba/abajo)")
    if col != 0 and not B > 0:
        raise ValueError(f"punto cardinal {cp}: falta el ancho B de la seccion (columna izquierda/derecha)")
    p2 = fila * D / 2.0
    p3 = col * B / 2.0 * (1.0 if derecha_es_eje3 else -1.0)
    return (c2 - p2, c3 - p3)


def asignar_punto_insercion(ei: ElementInputs, idx: int, cardinal: int, D: float = 0.0, B: float = 0.0, *,
                            transform: bool = True,
                            centroide: tuple[float, float] = (0.0, 0.0),
                            centro_cortante: tuple[float, float] | None = None,
                            derecha_es_eje3: bool = True) -> tuple[float, float]:
    """Pone el punto de insercion de la barra `idx` en `ei`. → (d2, d3).

    transform=True : con restriccion rigida (K = R^T K R, esfuerzos del centroide).
    transform=False: sin ella (solo geometrico; el solver no la ve).
    """
    d = offsets_punto_cardinal(cardinal, D, B, centroide=centroide, centro_cortante=centro_cortante,
                               derecha_es_eje3=derecha_es_eje3)
    ei.insertion_offsets[idx] = d
    ei.insertion_transform[idx] = bool(transform)
    return d


def posicion_centroide(p_i, p_j, d2: float, d3: float, angulo_deg: float = 0.0):
    """Extremos del eje del CENTROIDE en globales (la barra «dibujada»): lo unico que cambia en la
    variante sin restriccion rigida. → (c_i, c_j)."""
    e1, e2, e3, _ = frame_local_axes_csi(p_i, p_j, angulo_deg)
    r = d2 * e2 + d3 * e3
    return np.asarray(p_i, float) + r, np.asarray(p_j, float) + r


__all__ = ["offsets_punto_cardinal", "asignar_punto_insercion", "posicion_centroide",
           "frame_insertion_matrix", "LATERALES"]
