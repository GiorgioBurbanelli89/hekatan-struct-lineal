# -*- coding: utf-8 -*-
"""Lo que comparten los tres escritores: la `Vista` normalizada de un `ModeloHeks`/`ModeloCSI`."""
from __future__ import annotations

import math
import re

from ..heks import ModeloHeks
from ..insercion import offsets_punto_cardinal
from ._comun import ModeloCSI, a_csi, f6, G

TIPOS_PATRON = {"dead", "super dead", "live", "reduce live", "quake", "wind", "snow", "other",
                "temperature", "roof live", "notional", "prestress", "braking", "rain"}
NOMBRE_CARDINAL = {1: "bottom left", 2: "bottom center", 3: "bottom right", 4: "middle left", 5: "middle center",
                   6: "middle right", 7: "top left", 8: "top center", 9: "top right", 10: "centroid",
                   11: "shear center"}


def limpio(s: str) -> str:
    """Nombre sin comillas ni saltos (cabe entre comillas en un .e2k)."""
    return re.sub(r'["\r\n]', "_", str(s)).strip() or "X"


class Vista:
    def __init__(self, modelo: ModeloHeks):
        self.m = m = a_csi(modelo)
        ei, ni = m.element_inputs, m.node_inputs
        self.ei, self.ni = ei, ni
        self.avisos: list[str] = list(m.avisos) if isinstance(modelo, ModeloCSI) else []
        n = len(m.nodes)
        self.ids = m.node_id if len(m.node_id) == n else list(range(1, n + 1))
        self.frames = [k for k, c in enumerate(m.elements) if len(c) == 2]
        self.shells = [k for k, c in enumerate(m.elements) if len(c) == 4]
        self.solidos = [k for k, c in enumerate(m.elements) if len(c) == 8]
        otros = [k for k, c in enumerate(m.elements) if len(c) not in (2, 4, 8)]
        if otros:
            self.avisos.append("%d elementos de %s nudos no se escriben" % (
                len(otros), sorted({len(m.elements[k]) for k in otros})))
        self._materiales()
        self._secciones()
        self._cascaras()
        self._cargas()

    # -- materiales ------------------------------------------------------------
    def clave_mat(self, k: int):
        ei = self.ei
        return (f6(ei.elasticities.get(k, 0.0)), f6(ei.poissons_ratios.get(k, 0.2)), f6(ei.densities.get(k, 0.0)))

    def _materiales(self):
        m = self.m
        self.materiales: dict[str, tuple] = {}
        por_clave: dict[tuple, str] = {}
        self.mat_de: dict[int, str] = {}
        for k in self.frames + self.shells + self.solidos:
            c = self.clave_mat(k)
            if c not in por_clave:
                base = limpio(m.mat_nombre.get(k) or "MAT%d" % (len(por_clave) + 1))
                nom, j = base, 2
                while nom in self.materiales:
                    nom = "%s_%d" % (base, j)
                    j += 1
                por_clave[c] = nom
                self.materiales[nom] = c
            self.mat_de[k] = por_clave[c]
        if not self.materiales:
            self.materiales["MAT1"] = (25e6, 0.2, 2.4)

    # -- secciones de barra ------------------------------------------------------
    def _secciones(self):
        m, ei = self.m, self.ei
        self.secciones: dict[str, dict] = {}
        self.sec_de: dict[int, str] = {}
        por_clave: dict[tuple, str] = {}
        for j, k in enumerate(self.frames):
            p = dict(A=ei.areas.get(k, 0.0), I22=ei.moments_of_inertia_y.get(k, 0.0),
                     I33=ei.moments_of_inertia_z.get(k, 0.0), J=ei.torsional_constants.get(k, 0.0))
            a = p["A"]
            p["As2"] = ei.shear_areas_z.get(k, 5 / 6 * a)
            p["As3"] = ei.shear_areas_y.get(k, 5 / 6 * a)
            D, B = m.dim_barra.get(k, (0.0, 0.0))
            if not D:
                lado = math.sqrt(a) if a > 0 else 0.1
                D = B = lado
            p["D"], p["B"], p["mat"] = D, B, self.mat_de[k]
            base = limpio(m.frame_sec[j]) if j < len(m.frame_sec) and m.frame_sec[j] else ""
            clave = (base, p["mat"]) + tuple(f6(p[x]) for x in ("A", "I22", "I33", "J", "As2", "As3"))
            if clave not in por_clave:
                base = base or "SEC%d" % (len(por_clave) + 1)
                nom, i = base, 2
                while nom in self.secciones:
                    nom = "%s_%d" % (base, i)
                    i += 1
                por_clave[clave] = nom
                self.secciones[nom] = p
            self.sec_de[k] = por_clave[clave]

    # -- propiedades de cascara ------------------------------------------------------
    def vertical(self, k: int) -> bool:
        c = self.m.elements[k]
        z = [self.m.nodes[n][2] for n in c]
        xy = {(round(self.m.nodes[n][0], 6), round(self.m.nodes[n][1], 6)) for n in c}
        return max(z) - min(z) > 1e-6 and len(xy) <= 2

    def mods_de(self, k: int) -> list[float]:
        ei = self.ei
        d = ei.shell_modifiers.get(k)
        if d:
            return list(d)[:8]
        mm, bb = ei.membrane_modifiers.get(k, 1.0), ei.bending_modifiers.get(k, 1.0)
        return [mm] * 3 + [bb] * 3 + [1.0, 1.0]

    def _cascaras(self):
        m, ei = self.m, self.ei
        self.props: dict[str, dict] = {}
        self.prop_de: dict[int, str] = {}
        por_clave: dict[tuple, str] = {}
        for k in self.shells:
            mods = self.mods_de(k)
            membrana = all(abs(mods[i]) < 1e-9 for i in (3, 4, 5))
            tipo = "Membrane" if membrana else ("ShellThin" if ei.plate_formulations.get(k) == 1 else "ShellThick")
            t = ei.thicknesses.get(k, 0.2)
            vert = self.vertical(k)
            ow = (k in m.oneway) if (isinstance(self.m, ModeloCSI) and m.programa != "hekatan") else True
            ow = ow and tipo == "Membrane"
            clave = (f6(t), self.mat_de[k], tipo, tuple(f6(x) for x in mods), ow, vert, m.shell_prop.get(k, ""))
            if clave not in por_clave:
                base = limpio(m.shell_prop.get(k) or ("MURO" if vert else "LOSA"))
                nom, i = base, 2
                while nom in self.props:
                    nom = "%s_%d" % (base, i)
                    i += 1
                por_clave[clave] = nom
                self.props[nom] = dict(t=t, mat=self.mat_de[k], tipo=tipo, mods=mods, oneway=ow, vertical=vert)
            self.prop_de[k] = por_clave[clave]

    # -- cargas ------------------------------------------------------------------------
    def _cargas(self):
        m, ei, ni = self.m, self.ei, self.ni
        if m.patrones:
            self.patrones = [dict(orig=p, nombre=p, tipo=v.get("tipo", "Other"), sw=v.get("sw", 0.0))
                             for p, v in m.patrones.items()]
            self.cn = {p: dict(m.cargas_patron.get(p, {})) for p in m.patrones}
            self.cb = {p: dict(m.cargas_barra_patron.get(p, {})) for p in m.patrones}
            self.ca = {p: dict(m.cargas_area_patron.get(p, {})) for p in m.patrones}
        else:
            fuente = m.cargas_explicitas if (m.cargas_explicitas or m.shell_load or m.selfweight) else ni.loads
            self.patrones = [dict(orig="Dead", nombre="Dead", tipo="Dead", sw=m.selfweight)]
            self.cn = {"Dead": {i: tuple(v) for i, v in fuente.items()}}
            self.cb = {"Dead": dict(ei.frame_loads)}
            self.ca = {"Dead": dict(m.shell_load)}
        for p in self.patrones:
            p["nombre"] = limpio(p["nombre"])
            if p["tipo"].lower() not in TIPOS_PATRON:
                p["tipo"] = "Other"
        # claves de los diccionarios siguen al nombre original; se limpia el nombre con un mapa
        self.combos = []
        casos = {p["nombre"] for p in self.patrones}
        for c in m.combinaciones:
            items = [(limpio(n), f) for n, f in c["items"] if limpio(n) in casos]
            perdidos = [n for n, f in c["items"] if limpio(n) not in casos]
            if perdidos:
                self.avisos.append("combinación «%s»: casos %s no existen como patrón estático; omitidos"
                                   % (c["nombre"], sorted(set(perdidos))))
            if items:
                self.combos.append(dict(nombre=limpio(c["nombre"]), tipo=c.get("tipo", "Linear Add"), items=items))
        if len([1 for p in self.patrones if p["sw"]]) > 1:
            self.avisos.append("varios patrones con peso propio")
        # muelles nodales agrupados por nudo
        self.muelle_nudo: dict[int, list] = {}
        for i, g, kk in ni.springs:
            self.muelle_nudo.setdefault(i, [0.0] * 6)[g] += kk
        if ni.area_springs:
            nodal = ni.area_springs_nodal
            if any(k not in nodal for k in ni.area_springs):
                self.avisos.append("muelle de área CONSISTENTE (ks·∫NᵀN): los programas de CSI lo reparten por área "
                                   "tributaria (nodal); difieren unos % en las esquinas")
        if ni.hanging_nodes:
            self.avisos.append("nudos colgados de una arista (edge etabs/lineal): el fichero no los ata")
        if not ei.etabs_wall_joint is False and any(self.vertical(k) for k in self.shells) and self.frames:
            self.avisos.append("unión viga-muro de ETABS (etabs_wall_joint): solo existe en ETABS; SAP2000/SAFE no "
                               "la aplican (el TS añade barras fantasma al .s2k)")

    # -- punto de insercion --------------------------------------------------------------
    def cardinal(self, k: int):
        """(cp, transform) o None si la barra va al centroide."""
        off = self.ei.insertion_offsets.get(k)
        if not off or (abs(off[0]) < 1e-12 and abs(off[1]) < 1e-12):
            return None
        tr = self.ei.insertion_transform.get(k, True)
        cp = self.m.cardinal.get(k)
        D, B = self.m.dim_barra.get(k, (0.0, 0.0))
        if cp:
            try:
                d = offsets_punto_cardinal(cp, D, B)
                if abs(d[0] - off[0]) < 1e-9 and abs(d[1] - off[1]) < 1e-9:
                    return cp, tr
            except ValueError:
                pass
        for c in (1, 2, 3, 4, 5, 6, 7, 8, 9):
            try:
                d = offsets_punto_cardinal(c, D, B)
            except ValueError:
                continue
            if abs(d[0] - off[0]) < 1e-9 and abs(d[1] - off[1]) < 1e-9:
                return c, tr
        c = 8 if off[0] < 0 else 2
        self.avisos.append("barra %d: desplazamiento de inserción (%.4g, %.4g) no es un punto cardinal 1-9; "
                           "se escribe solo la parte vertical (CP %d)" % (k + 1, off[0], off[1], c))
        return c, tr

    def liberaciones(self, k: int):
        r = self.ei.moment_releases.get(k)
        if not r or not any(r):
            return None
        return list(r) if len(r) >= 12 else [False, False, False, r[0], r[1], r[2], False, False, False, r[3], r[4], r[5]]

    def offsets(self, k: int):
        o = self.ei.end_offsets.get(k)
        if o and (abs(o[0]) > 1e-12 or abs(o[1]) > 1e-12):
            return o[0], o[1], (o[2] if len(o) > 2 else 0.0)
        return None
