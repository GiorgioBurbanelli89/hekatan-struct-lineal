# -*- coding: utf-8 -*-
"""BRAZOS RIGIDOS (end length offsets) POR DEFECTO como ETABS ("Automatic from Connectivity").

La LEY del brazo ya vive en el solver (`elements/frame.py`: `frame_stiffness_end_offsets`,
`frame_end_offset_matrix`, `frame_fixed_end_loads`, `frame_self_weight_length`), medida contra ETABS 22.6:

    l  = rz * off                 tramo realmente rigido de cada extremo
    Lf = L - lI - lJ              flexion y cortante (tambien el phi de Timoshenko)
    EA/L y GJ/L con la L COMPLETA
    K  = R^T K(Lf) R              en ejes locales y despues de los releases
    masa/peso: la VIGA pesa por su luz libre L - offI - offJ (el offset ENTERO); columna y diagonal, L

Aqui falta solo la REGLA AUTOMATICA (espejo de `examples/src/shared/brazosAutomaticos.ts`, regla medida en
ETABS el 8-sep-2026): viga = medio lado de la columna (en su direccion) por cada extremo con columna;
columna = el canto ENTERO de la viga mas alta que llega arriba, 0 abajo. RZ = 0 por defecto (ETABS): no
rigidiza, solo descuenta peso/masa de las vigas y mueve la estacion de esfuerzos.

    from hekatan_struct.brazos import aplicar_brazos_automaticos
    aplicar_brazos_automaticos(nodes, elements, ei, rz=0.0)          # ETABS por defecto
    aplicar_brazos_automaticos(nodes, elements, ei, rz=0.5, cantos={k: 0.5}, anchos={k: 0.3})
"""
from __future__ import annotations
import math
from typing import Callable, Optional, Sequence

import numpy as np

from .data_model import ElementInputs


def brazos_automaticos_etabs(nodes, elements, clase: Callable[[int], Optional[str]],
                             lado_columna: Callable[[int, int, bool], float],
                             canto_viga: Callable[[int], float], rz: float
                             ) -> dict[int, tuple[float, float, float]]:
    """Espejo 1:1 de `brazosAutomaticosETABS`. → {barra: (offI, offJ, rz)}.

    clase(e)                   "col" | "viga" | None
    lado_columna(e, nudo, enX) lado COMPLETO de la columna e medido en X (enX) o en Y
    canto_viga(e)              canto de la viga e
    """
    cols_en: dict[int, list[int]] = {}
    vigas_en: dict[int, list[int]] = {}
    for e, el in enumerate(elements):
        if len(el) != 2:
            continue
        c = clase(e)
        m = cols_en if c == "col" else vigas_en if c == "viga" else None
        if m is not None:
            for n in el:
                m.setdefault(n, []).append(e)
    out: dict[int, tuple[float, float, float]] = {}
    for e, el in enumerate(elements):
        if len(el) != 2:
            continue
        c = clase(e)
        a, b = el
        off_i = off_j = 0.0
        if c == "viga":
            en_x = abs(nodes[b][0] - nodes[a][0]) >= abs(nodes[b][1] - nodes[a][1])

            def medio(n):
                return max([0.0] + [lado_columna(k, n, en_x) for k in cols_en.get(n, [])]) / 2.0
            off_i, off_j = medio(a), medio(b)
        elif c == "col":
            arriba = a if nodes[a][2] > nodes[b][2] else b
            canto = max([0.0] + [canto_viga(k) for k in vigas_en.get(arriba, [])])
            if arriba == a:
                off_i = canto
            else:
                off_j = canto
        else:
            continue
        if not (off_i > 0 or off_j > 0):
            continue
        L = math.dist(nodes[a], nodes[b])
        if off_i + off_j >= 0.95 * L:      # el brazo se come la barra: no se pone
            continue
        out[e] = (off_i, off_j, rz)
    return out


def aplicar_brazos_automaticos(nodes: Sequence, elements: Sequence, ei: ElementInputs, rz: float = 0.0, *,
                               cantos: Optional[dict[int, float]] = None,
                               anchos: Optional[dict[int, float]] = None,
                               sobrescribir: bool = False) -> int:
    """Pone en `ei.end_offsets` los brazos automaticos de ETABS. → numero de barras con brazo.

    Columna = barra a mas de 70 grados de inclinacion, viga = a menos de 20 grados de la
    horizontal. Canto/ancho: los de `cantos`/`anchos` (por indice de barra) o, si faltan, el rectangulo
    equivalente de A e I (h = sqrt(12 I33/A), b = sqrt(12 I22/A)). Las barras que ya traen `end_offsets`
    no se tocan salvo `sobrescribir=True` (igual que `rigidzone auto` en el .heks).
    """
    cantos = cantos or {}
    anchos = anchos or {}

    def incl(e):
        a, b = elements[e]
        d = np.asarray(nodes[b], float) - np.asarray(nodes[a], float)
        return math.degrees(math.atan2(abs(d[2]), math.hypot(d[0], d[1])))

    def canto(e):
        if e in cantos:
            return cantos[e]
        return math.sqrt(12.0 * ei.moments_of_inertia_z.get(e, 0.0) / (ei.areas.get(e) or 1.0))

    def ancho(e):
        if e in anchos:
            return anchos[e]
        return math.sqrt(12.0 * ei.moments_of_inertia_y.get(e, 0.0) / (ei.areas.get(e) or 1.0))

    def clase(e):
        if len(elements[e]) != 2:
            return None
        i = incl(e)
        return "col" if i > 70 else "viga" if i < 20 else None

    def lado(e, _n, en_x):
        g = (ei.local_angles.get(e, 0.0) % 180 + 180) % 180
        girada = abs(g - 90) < 45
        return canto(e) if (en_x != girada) else ancho(e)

    auto = brazos_automaticos_etabs(nodes, elements, clase, lado, canto, rz)
    n = 0
    for e, v in auto.items():
        if sobrescribir or e not in ei.end_offsets:
            ei.end_offsets[e] = v
            n += 1
    return n


__all__ = ["brazos_automaticos_etabs", "aplicar_brazos_automaticos"]
