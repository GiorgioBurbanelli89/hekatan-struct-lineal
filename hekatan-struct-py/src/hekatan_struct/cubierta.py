# -*- coding: utf-8 -*-
"""CUBIERTA como la entiende ETABS: paños AREA FLOOR de MEMBRANA que se conectan a todo nudo que tocan
(edge constraint) y reparten su peso y sus cargas a las barras de borde por area tributaria.

API limpia sobre `deck_etabs.aplicar_deck_etabs` (la misma del `deck etabs` del .heks y de
`aplicarDeckEtabs` de cliModeler.ts, iguales a 1e-11):

    from hekatan_struct.cubierta import membrana_deck_etabs, cubierta_de_e2k
    c = membrana_deck_etabs(nodos, barras, panos, espesor=0.004, rho=7.85,
                            carga_gravedad=0.392, un_sentido=True)      # kN, m
    c.panos      # paños partidos en los nudos comunes a dos bordes opuestos (sin inventar nudos)
    c.barras     # barras partidas en los nudos que caen dentro de ellas
    c.cargas     # {nudo: [Fx, Fy, Fz, Mx, My, Mz]} vector consistente de Hermite en los nudos de las barras
    d = cubierta_de_e2k("mercado.e2k", "N7 COL")                       # la cubierta real del mercado
    c = membrana_deck_etabs(**d)

Entradas (sin clases, estilo del paquete):
    nodos  {id: (x, y, z)}      barras [(id, nI, nJ)] o [{"id","nI","nJ"}]      panos [(id, n0, n1, n2, n3)] o
    [{"id","pts":[4]}]. `espesor` m, `rho` t/m3 (peso propio = rho*g*espesor*peso_propio), `carga_gravedad` kN/m2
    (positiva hacia abajo), `un_sentido`: ONEWAYLOADDIST "Yes" (eje local 1 = borde 0->1 girado `angulo[id]` grados).

Todo lo que no es membrana (shellmod con flexion) NO pasa por aqui: el deck de ETABS solo conecta y reparte
cuando el paño es membrana.
"""
from __future__ import annotations
import re
from dataclasses import dataclass, field
from typing import Optional

import numpy as np

from .deck_etabs import aplicar_deck_etabs

G = 9.80665


@dataclass
class Cubierta:
    nodos: dict
    barras: list            # [{"id","nI","nJ","padre"}]
    panos: list             # [{"id","pts","t","rho","padre"}]
    cargas: dict            # {nudo: [6]}
    panos_a_barras: set = field(default_factory=set)   # ids de paño cuyo peso/carga ya fue a las barras
    n_panos_origen: int = 0


def _barra(b):
    if isinstance(b, dict):
        return dict(b)
    return {"id": b[0], "nI": b[1], "nJ": b[2]}


def _pano(p, t, rho):
    if isinstance(p, dict):
        d = dict(p)
        d.setdefault("t", t); d.setdefault("rho", rho)
        return d
    return {"id": p[0], "pts": list(p[1:5]), "t": t, "rho": rho}


def partir_barras_en_nudos(nodos: dict, barras: list, tol: float = 1e-4) -> list:
    """Parte cada barra en los nudos que caen DENTRO de ella (lo que hace ETABS al mallar la linea).
    Los trozos conservan el `id` del primero; el resto lleva ids nuevos y `padre`."""
    ids = list(nodos)
    P = np.array([nodos[i] for i in ids], float) if ids else np.zeros((0, 3))
    nuevo = max([b["id"] for b in barras], default=0) + 1
    out = []
    for b in barras:
        a, c = np.asarray(nodos[b["nI"]], float), np.asarray(nodos[b["nJ"]], float)
        d = c - a
        L = float(np.linalg.norm(d))
        if L < 1e-12 or not len(P):
            out.append(b); continue
        t = d / L
        v = P - a
        s = v @ t
        perp = np.linalg.norm(v - np.outer(s, t), axis=1)
        sel = np.where((s > tol) & (s < L - tol) & (perp < tol))[0]
        if not len(sel):
            out.append(b); continue
        cadena = [b["nI"]] + [ids[j] for j in sel[np.argsort(s[sel])]] + [b["nJ"]]
        for k in range(len(cadena) - 1):
            nb = dict(b, nI=cadena[k], nJ=cadena[k + 1])
            if k:
                nb["id"] = nuevo; nuevo += 1; nb["padre"] = b["id"]
            out.append(nb)
    return out


def membrana_deck_etabs(nodos: dict, barras, panos, *, espesor: float = 0.004, rho: float = 7.85,
                        carga_gravedad: float = 0.0, peso_propio: float = 1.0,
                        un_sentido: bool = False, angulo: Optional[dict] = None,
                        partir_barras: bool = True, tol: float = 1e-4) -> Cubierta:
    """Cubierta de membrana al estilo ETABS. Ver el docstring del modulo. No modifica sus argumentos."""
    nodos = {k: tuple(map(float, v)) for k, v in nodos.items()}
    bs = [_barra(b) for b in barras]
    if partir_barras:
        bs = partir_barras_en_nudos(nodos, bs, tol)
    ps = [_pano(p, espesor, rho) for p in panos]
    n0 = len(ps)
    ids = [p["id"] for p in ps]
    smod_dir = {i: [1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0] for i in ids}     # MEMBRANA: sin flexion
    q_area = {i: -float(carga_gravedad) for i in ids}                          # +z hacia arriba en el motor
    sang = {i: float((angulo or {}).get(i, 0.0)) for i in ids}
    cargas: dict = {}
    tributarios = aplicar_deck_etabs(nodos, bs, ps, smod_dir, {}, q_area, sang, {}, cargas,
                                     float(peso_propio), oneway=bool(un_sentido))
    return Cubierta(nodos=nodos, barras=bs, panos=ps, cargas=cargas, panos_a_barras=set(tributarios),
                    n_panos_origen=n0)


# ───────────────────────── lector mínimo del .e2k (la cubierta real) ─────────────────────────
_LONG = {"MM": 1e-3, "CM": 1e-2, "M": 1.0}
_FUERZA = {"N": 1e-3, "KN": 1.0}


def cubierta_de_e2k(ruta: str, historia: str, *, seccion: Optional[str] = None,
                    solo_membrana: bool = True, areas_sel: Optional[set] = None) -> dict:
    """Saca de un .e2k los paños AREA FLOOR de UNA planta y sus vigas (BEAM) en m y kN, listos para
    `membrana_deck_etabs(**d)`. `seccion` filtra por SECTION del AREAASSIGN (None = todas las de membrana); `areas_sel` por nombre de AREA.

    Lee: UNITS, STORIES (cotas), POINT, LINE ... BEAM, AREA ... FLOOR 4 pts, SHELLPROP (MODELINGTYPE "Membrane",
    SLABTHICKNESS, ONEWAYLOADDIST), AREAASSIGN (SECTION, ANG), LINEASSIGN y AREALOAD UNIFF GRAV Dead/Live.
    Devuelve claves de `membrana_deck_etabs` + `cargas_live`, `meta`. BRACE y columnas no entran (viven en
    otras plantas).
    """
    t = open(ruta, encoding="utf-8", errors="replace").read()
    mu = re.search(r'UNITS\s+"(\w+)"\s+"(\w+)"', t)
    f_n = _FUERZA[mu.group(1).upper()] if mu else 1e-3
    f_l = _LONG[mu.group(2).upper()] if mu else 1e-3

    # cotas de cada planta (STORIES de arriba hacia abajo; Base ELEV)
    hs = [(m.group(1), float(m.group(2))) for m in re.finditer(r'^\s*STORY\s+"([^"]+)"\s+HEIGHT\s+([-\d.eE+]+)', t, re.M)]
    base = re.search(r'^\s*STORY\s+"[^"]+"\s+ELEV\s+([-\d.eE+]+)', t, re.M)
    z = float(base.group(1)) if base else 0.0
    cota = {}
    for nombre, h in reversed(hs):
        z += h
        cota[nombre] = z * f_l
    if historia not in cota:
        raise ValueError(f"planta {historia!r} no esta en $ STORIES: {sorted(cota)}")
    Z = cota[historia]

    # POINT "n" x y [caida]: el 3.er numero (si lo hay) es la CAIDA del punto: z = cota de la planta - caida
    # (misma regla que e2kParser.ts; cubierta con pendiente)
    pts = {m.group(1): (float(m.group(2)) * f_l, float(m.group(3)) * f_l, float(m.group(4) or 0.0) * f_l)
           for m in re.finditer(r'^\s*POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?\s*$', t, re.M)}
    props = {}
    for m in re.finditer(r'^\s*SHELLPROP\s+"([^"]+)".*$', t, re.M):
        ln = m.group(0)
        mt = re.search(r'SLABTHICKNESS\s+([-\d.eE+]+)', ln)
        props[m.group(1)] = dict(membrana='MODELINGTYPE "Membrane"' in ln,
                                 t=float(mt.group(1)) * f_l if mt else 0.0,
                                 uno='ONEWAYLOADDIST "Yes"' in ln)
    areas = {m.group(1): m.groups()[1:5] for m in re.finditer(
        r'^\s*AREA\s+"([^"]+)"\s+FLOOR\s+4\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"', t, re.M)}
    areas_dz = {m.group(1): [int(float(x)) for x in m.groups()[1:5]] for m in re.finditer(
        r'^\s*AREA\s+"([^"]+)"\s+FLOOR\s+4\s+"[^"]+"\s+"[^"]+"\s+"[^"]+"\s+"[^"]+"\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)', t, re.M)}
    orden = [n for n, _ in hs]
    i_h = orden.index(historia)
    lineas = {m.group(1): (m.group(2), m.group(3)) for m in re.finditer(
        r'^\s*LINE\s+"([^"]+)"\s+BEAM\s+"([^"]+)"\s+"([^"]+)"', t, re.M)}

    nodos: dict = {}

    def pid(nombre, planta=None):
        planta = planta or historia
        k = (nombre, planta)
        if k not in nodos:
            nodos[k] = (pts[nombre][0], pts[nombre][1], cota[planta] - pts[nombre][2])
        return k

    panos, ang, dead, live, uno = [], {}, {}, {}, set()
    espesores = set()
    for m in re.finditer(r'^\s*AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"(.*)$', t, re.M):
        nm, st, sec, resto = m.groups()
        if st != historia or nm not in areas or (areas_sel is not None and nm not in areas_sel):
            continue
        pr = props.get(sec)
        if seccion is not None and sec != seccion:
            continue
        if solo_membrana and not (pr and pr["membrana"]):
            continue
        claves = []
        for p, dz in zip(areas[nm], areas_dz.get(nm, [0, 0, 0, 0])):
            j = i_h + dz                       # offset de planta del nudo (0 casi siempre)
            if not 0 <= j < len(orden):
                raise ValueError(f"AREA {nm}: el nudo {p} cae fuera del edificio (offset {dz})")
            claves.append(pid(p, orden[j]))
        panos.append((nm, *claves))
        ma = re.search(r'\bANG\s+([-\d.eE+]+)', resto)
        ang[nm] = float(ma.group(1)) if ma else 0.0
        if pr:
            espesores.add(pr["t"])
            if pr["uno"]:
                uno.add(nm)
    sel = {p[0] for p in panos}
    for m in re.finditer(r'^\s*AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFF"\s+DIR\s+"GRAV"\s+LC\s+"(\w+)"\s+FVAL\s+([-\d.eE+]+)', t, re.M):
        nm, st, lc, v = m.groups()
        if st == historia and nm in sel:
            (dead if lc == "Dead" else live if lc == "Live" else {})[nm] = float(v) * f_n / (f_l * f_l)
    barras = []
    for m in re.finditer(r'^\s*LINEASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION', t, re.M):
        nm, st = m.groups()
        if st == historia and nm in lineas:
            a, b = lineas[nm]
            if a in pts and b in pts:
                barras.append((nm, pid(a), pid(b)))
    ids_n = {nombre: k + 1 for k, nombre in enumerate(nodos)}
    out_nodos = {ids_n[n]: v for n, v in nodos.items()}
    out_barras = [(i + 1, ids_n[a], ids_n[b]) for i, (_, a, b) in enumerate(barras)]
    out_panos = [(k + 1, *(ids_n[p] for p in pp[1:])) for k, pp in enumerate(panos)]
    nombre_a_id = {pp[0]: k + 1 for k, pp in enumerate(panos)}
    qd = sorted(set(round(v, 9) for v in dead.values()))
    return dict(nodos=out_nodos, barras=out_barras, panos=out_panos,
                espesor=(sorted(espesores)[0] if espesores else 0.004),
                carga_gravedad=(qd[0] if len(qd) == 1 else 0.0),
                un_sentido=bool(uno) and len(uno) == len(panos),
                angulo={nombre_a_id[n]: a for n, a in ang.items()},
                cargas_live={nombre_a_id[n]: v for n, v in live.items()},
                meta=dict(planta=historia, cota=Z, areas=[p[0] for p in panos], n_cargas_dead_distintas=len(qd)))


__all__ = ["Cubierta", "membrana_deck_etabs", "partir_barras_en_nudos", "cubierta_de_e2k"]
