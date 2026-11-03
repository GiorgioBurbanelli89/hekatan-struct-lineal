# -*- coding: utf-8 -*-
"""Piezas comunes de `archivos_csi`: unidades, secciones, el Constructor y `ModeloCSI`.

IDEA CENTRAL. Los tres lectores (.e2k, .s2k, .f2k) NO montan el modelo a mano: rellenan un
`Constructor`, que escribe el texto `.heks` y lo pasa por `leer_heks`. Asi el `ModeloHeks`
que sale es EXACTAMENTE el que saldria de un `.heks` equivalente (peso propio, `areaload`
consistente, brazos, punto de insercion, muelles...): el motor Python lo resuelve igual que
resuelve el del TS. Lo que el `.heks` no guarda (nombres de patron, combinaciones, nombres de
seccion y de material) va en los campos extra de `ModeloCSI`, que ES un `ModeloHeks`.

Unidades internas: kN y m (las del `ModeloHeks`).
"""
from __future__ import annotations

import math
import os
import re
import tempfile
from dataclasses import dataclass, field, fields

from ..heks import ModeloHeks, leer_heks

G = 9.80665

# factores a metros / kN
LONGITUD = {"MM": 1e-3, "CM": 1e-2, "M": 1.0, "KM": 1e3, "IN": 0.0254, "FT": 0.3048}
FUERZA = {"N": 1e-3, "KN": 1.0, "KGF": G * 1e-3, "TONF": G, "LB": 4.4482216e-3,
          "KIP": 4.4482216, "LBF": 4.4482216e-3}


def unidades(fuerza: str, longitud: str) -> tuple[float, float]:
    """(Ff, Lf): kN por unidad de fuerza del fichero, m por unidad de longitud."""
    return (FUERZA.get(str(fuerza).strip().upper(), 1.0),
            LONGITUD.get(str(longitud).strip().upper(), 1.0))


def f6(v: float) -> float:
    """Redondea a 10 cifras significativas (claves de agrupacion estables)."""
    return float("%.10g" % v)


def fmt(v: float) -> str:
    return repr(float(v))


# ─────────────────────────────────────────────────────────────────────────────
# Secciones (m, kN). Devuelven un dict con A, I22, I33, J, As2, As3.
#   I33 = plano 1-2 (el del canto D) · I22 = plano 1-3 · As2 va con I33 · As3 con I22
# ─────────────────────────────────────────────────────────────────────────────
def _roark(a0: float, b0: float) -> float:
    a, b = min(a0, b0), max(a0, b0)
    if a <= 0 or b <= 0:
        return 0.0
    return b * a ** 3 * (1 / 3 - 0.21 * (a / b) * (1 - a ** 4 / (12 * b ** 4)))


def _p(A, I22, I33, J, As2, As3, D=0.0, B=0.0) -> dict:
    return dict(A=A, I22=I22, I33=I33, J=J, As2=As2, As3=As3, D=D, B=B)


def sec_rectangular(D, B):
    A = D * B
    return _p(A, D * B ** 3 / 12, B * D ** 3 / 12, _roark(D, B), 5 / 6 * A, 5 / 6 * A, D, B)


def sec_circular(D):
    A = math.pi * D ** 2 / 4
    I = math.pi * D ** 4 / 64
    return _p(A, I, I, math.pi * D ** 4 / 32, 0.9 * A, 0.9 * A, D, D)


def sec_perfil_i(d, bf, tf, tw, t2b=None, tfb=None):
    """I/Wide Flange de SAP2000 (cadSections.ts iSectionCsi)."""
    t2b = bf if not t2b else t2b
    tfb = tf if not tfb else tfb
    hw = d - tf - tfb
    Af, Ab, Aw = bf * tf, t2b * tfb, hw * tw
    A = Af + Ab + Aw
    yc = (Ab * tfb / 2 + Aw * (tfb + hw / 2) + Af * (d - tf / 2)) / A
    Iz = (t2b * tfb ** 3 / 12 + Ab * (tfb / 2 - yc) ** 2 + tw * hw ** 3 / 12
          + Aw * (tfb + hw / 2 - yc) ** 2 + bf * tf ** 3 / 12 + Af * (d - tf / 2 - yc) ** 2)
    Iy = (tf * bf ** 3 + tfb * t2b ** 3 + hw * tw ** 3) / 12

    def rect(b, t):
        return (b * t ** 3 / 3) * (1 - 0.63 * t / b) if b > 0 else 0.0
    J = rect(bf, tf) + rect(t2b, tfb) + rect(hw, tw)
    return _p(A, Iy, Iz, J, tw * d, 5 / 6 * (Af + Ab), d, max(bf, t2b))


def sec_tubo(b, h, tf, tw):
    """Box/Tube de SAP2000 (tubeSectionCsi): b ancho, h canto, tf paredes ∥ b, tw ∥ h."""
    tf, tw = (tf or tw), (tw or tf)
    bi, hi = b - 2 * tw, h - 2 * tf
    A = b * h - bi * hi
    Iz = (b * h ** 3 - bi * hi ** 3) / 12
    Iy = (h * b ** 3 - hi * bi ** 3) / 12
    Am = (b - tw) * (h - tf)
    J = 4 * Am * Am / (2 * (b - tw) / tf + 2 * (h - tf) / tw)
    return _p(A, Iy, Iz, J, 2 * tw * h, 2 * tf * b, h, b)


def sec_tubo_redondo(D, t):
    d = max(D - 2 * t, 0.0)
    A = math.pi / 4 * (D * D - d * d)
    I = math.pi / 64 * (D ** 4 - d ** 4)
    return _p(A, I, I, 2 * I, A / 2, A / 2, D, D)


def sec_canal(d, bf, tf, tw):
    hw = d - 2 * tf
    Af, Aw = bf * tf, hw * tw
    A = 2 * Af + Aw
    xc = (2 * Af * bf / 2 + Aw * tw / 2) / A
    Iz = (bf * d ** 3 - (bf - tw) * hw ** 3) / 12
    Iy = 2 * (tf * bf ** 3 / 12 + Af * (bf / 2 - xc) ** 2) + hw * tw ** 3 / 12 + Aw * (tw / 2 - xc) ** 2

    def rect(b, t):
        return (b * t ** 3 / 3) * (1 - 0.63 * t / b) if b > 0 else 0.0
    return _p(A, Iy, Iz, 2 * rect(bf, tf) + rect(hw, tw), tw * d, 2 * bf * tf, d, bf)


def sec_te(D, B, TF, TW):
    hw = max(D - TF, 0.0)
    Af, Aw = B * TF, TW * hw
    A = Af + Aw
    yc = (Af * TF / 2 + Aw * (TF + hw / 2)) / A if A > 0 else 0.0
    Iz = B * TF ** 3 / 12 + Af * (yc - TF / 2) ** 2 + TW * hw ** 3 / 12 + Aw * (TF + hw / 2 - yc) ** 2
    Iy = TF * B ** 3 / 12 + hw * TW ** 3 / 12
    J = _roark(B, TF) + (_roark(hw, TW) if hw > 0 else 0.0)
    return _p(A, Iy, Iz, J, TW * D * 5 / 6, 5 / 6 * Af, D, B)


def sec_angulo(D, B, TF, TW):
    t = TF or TW
    A = t * (D + B - t)
    Iz = t * (D ** 3 + B * t ** 2 + t ** 2 * (D - t)) / 12
    Iy = t * (B ** 3 + D * t ** 2 + t ** 2 * (B - t)) / 12
    return _p(A, Iy, Iz, (D + B - t) * t ** 3 / 3, B * t, D * t, D, B)


def sec_doble_canal(D, B, TF, TW):
    A = 2 * (2 * B * TF + (D - 2 * TF) * TW)
    Iz = 2 * (TW * D ** 3 + 2 * B * TF * (D - TF) ** 2) / 12
    Iy = 2 * (2 * TF * B ** 3 + (D - 2 * TF) * TW ** 3) / 12
    J = 2 * (2 * B * TF ** 3 + (D - 2 * TF) * TW ** 3) / 3
    return _p(A, Iy, Iz, J, 4 * B * TF * 5 / 6, 2 * (D - 2 * TF) * TW, D, B)


def sec_c_conformada(D, B, t, lip):
    """C de chapa plegada (linea media, esquinas de radio t/2); port de coldCProps."""
    r = t / 2
    hw, bw, ll, n = D / 2 - t / 2, B - t / 2, max(lip - t, 0.0), 48
    P: list[tuple[float, float]] = []

    def linea(p, q):
        for i in range(n):
            P.append((p[0] + (q[0] - p[0]) * i / n, p[1] + (q[1] - p[1]) * i / n))

    def arco(cx, cy, a0, a1):
        for i in range(n):
            a = a0 + (a1 - a0) * i / n
            P.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    H = math.pi / 2
    if ll > r:
        linea((bw, hw - ll), (bw, hw - r))
    arco(bw - r, hw - r, 0, H)
    linea((bw - r, hw), (r, hw))
    arco(r, hw - r, H, 2 * H)
    linea((0, hw - r), (0, -hw + r))
    arco(r, -hw + r, 2 * H, 3 * H)
    linea((r, -hw), (bw - r, -hw))
    arco(bw - r, -hw + r, 3 * H, 4 * H)
    if ll > r:
        linea((bw, -hw + r), (bw, -hw + ll))
    P.append((bw, -hw + max(ll, r)))
    L = sx = 0.0
    seg = []
    for i in range(len(P) - 1):
        dx, dy = P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]
        l = math.hypot(dx, dy)
        seg.append((l, (P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2, dx, dy))
        L += l
        sx += l * (P[i][0] + P[i + 1][0]) / 2
    cx = sx / L
    Ix = Iy = 0.0
    for l, x, y, dx, dy in seg:
        Ix += t * l * (y * y + dy * dy / 12)
        Iy += t * l * ((x - cx) ** 2 + dx * dx / 12)
    return _p(L * t, Iy, Ix, t ** 3 * L / 3, 2 * (B - 2 * t) * t, (D - 2 * t) * t, D, B)


# ─────────────────────────────────────────────────────────────────────────────
# ModeloCSI: un ModeloHeks con lo que los ficheros de CSI traen de mas
# ─────────────────────────────────────────────────────────────────────────────
@dataclass
class ModeloCSI(ModeloHeks):
    """`ModeloHeks` + metadatos de CSI. Todo lo del `ModeloHeks` sigue valiendo (el motor Python
    lo come tal cual). Indices = los internos (nudo, barra/cascara dentro de `elements`)."""
    programa: str = ""                 # "etabs" | "sap2000" | "safe" | "hekatan"
    origen: str = ""                   # ruta del fichero leido
    titulo: str = ""
    avisos: list = field(default_factory=list)
    # patrones: nombre -> {"tipo": "Dead", "sw": 1.0}; las cargas van POR PATRON
    patrones: dict = field(default_factory=dict)
    cargas_patron: dict = field(default_factory=dict)         # pat -> {nudo: (6)}
    cargas_barra_patron: dict = field(default_factory=dict)   # pat -> {barra: (wx, wy, wz)} kN/m globales
    cargas_area_patron: dict = field(default_factory=dict)    # pat -> {cascara: q} kN/m2, + hacia +z
    combinaciones: list = field(default_factory=list)         # [{"nombre", "tipo", "items": [(caso, sf)]}]
    mat_nombre: dict = field(default_factory=dict)            # elemento -> nombre de material
    shell_prop: dict = field(default_factory=dict)            # cascara -> nombre de la propiedad
    cardinal: dict = field(default_factory=dict)              # barra -> punto cardinal 1..11
    dim_barra: dict = field(default_factory=dict)             # barra -> (D, B) m
    plantas: list = field(default_factory=list)               # [(nombre, cota m)] de abajo arriba
    oneway: set = field(default_factory=set)                  # cascaras con reparto en un sentido
    nombre_nudo: dict = field(default_factory=dict)           # nudo -> nombre original en el fichero
    nombre_barra: dict = field(default_factory=dict)
    nombre_cascara: dict = field(default_factory=dict)


def a_csi(m: ModeloHeks) -> ModeloCSI:
    """Un ModeloHeks cualquiera -> ModeloCSI (sin metadatos). Si ya lo es, lo devuelve."""
    if isinstance(m, ModeloCSI):
        return m
    return ModeloCSI(**{f.name: getattr(m, f.name) for f in fields(ModeloHeks)}, programa="hekatan")


# ─────────────────────────────────────────────────────────────────────────────
# Constructor
# ─────────────────────────────────────────────────────────────────────────────
class Constructor:
    """Acumula nudos, barras, cascaras, apoyos, cargas... y los convierte en un ModeloCSI."""

    def __init__(self, programa: str, origen: str = "", titulo: str = ""):
        self.programa, self.origen, self.titulo = programa, origen, titulo
        self.avisos: list[str] = []
        self._avisados: set[str] = set()
        self._nodos: dict[int, tuple] = {}
        self._orden: dict[int, tuple] = {}
        self._nombre_nudo: dict[int, str] = {}
        self._clave: dict[tuple, int] = {}
        self.frames: list[dict] = []
        self.shells: list[dict] = []
        self.apoyos: dict[int, tuple] = {}
        self.muelles: list[tuple] = []          # (nudo, gdl, k)
        self.diaf: dict[int, int] = {}
        self.patrones: dict[str, dict] = {}
        self.cargas: dict[str, dict] = {}
        self.cargas_barra: dict[str, dict] = {}
        self.cargas_area: dict[str, dict] = {}
        self.combos: list[dict] = []
        self.plantas: list[tuple] = []
        self.flags: list[str] = []
        self.torsion_safe = False

    # -- avisos (sin repetir) ----------------------------------------------
    def aviso(self, texto: str, *, una_vez: bool = True) -> None:
        if una_vez:
            if texto in self._avisados:
                return
            self._avisados.add(texto)
        self.avisos.append(texto)

    def contar_aviso(self, clave: str, plantilla: str, n: int) -> None:
        if n:
            self.avisos.append(plantilla % n)

    # -- geometria -----------------------------------------------------------
    def nodo(self, x: float, y: float, z: float, orden: tuple = (0,), nombre: str = "",
             fundir: bool = True) -> int:
        k = (round(x * 1e6), round(y * 1e6), round(z * 1e6))
        if fundir and k in self._clave:
            i = self._clave[k]
            if orden < self._orden[i]:
                self._orden[i] = orden
            return i
        i = len(self._nodos) + 1
        self._nodos[i] = (x, y, z)
        self._orden[i] = orden
        self._nombre_nudo[i] = nombre
        if fundir:
            self._clave[k] = i
        return i

    def barra(self, nombre: str, ni: int, nj: int, *, E: float, nu: float, rho: float, A: float,
              I22: float, I33: float, J: float, As2: float, As3: float, D: float = 0.0, B: float = 0.0,
              sec: str = "", mat: str = "", ang: float = 0.0, rel=None, eo=None, cp: int | None = None,
              tr: bool = True) -> int:
        fid = len(self.frames) + 1
        self.frames.append(dict(id=fid, nombre=nombre, nI=ni, nJ=nj, E=E, nu=nu, rho=rho, A=A,
                                I22=I22, I33=I33, J=J, As2=As2, As3=As3, D=D, B=B, sec=sec, mat=mat,
                                ang=ang, rel=rel, eo=eo, cp=cp, tr=tr))
        return fid

    def cascara(self, nombre: str, pts: list[int], *, t: float, E: float, nu: float, rho: float,
                mods=None, thin: bool = False, ang: float = 0.0, prop: str = "", mat: str = "",
                ks: float = 0.0, oneway: bool = False) -> int:
        sid = len(self.shells) + 1
        self.shells.append(dict(id=sid, nombre=nombre, pts=pts, t=t, E=E, nu=nu, rho=rho, mods=mods,
                                thin=thin, ang=ang, prop=prop, mat=mat, ks=ks, oneway=oneway))
        return sid

    def apoyo(self, nid: int, flags) -> None:
        old = self.apoyos.get(nid, (False,) * 6)
        self.apoyos[nid] = tuple(bool(a or b) for a, b in zip(old, flags))

    def muelle(self, nid: int, gdl: int, k: float) -> None:
        if k:
            self.muelles.append((nid, gdl, k))

    # -- cargas --------------------------------------------------------------
    def patron(self, nombre: str, tipo: str = "Other", sw: float = 0.0) -> None:
        self.patrones.setdefault(nombre, {"tipo": tipo, "sw": sw})
        self.patrones[nombre].update(tipo=tipo, sw=sw)

    def _pat(self, nombre: str) -> None:
        if nombre not in self.patrones:
            self.patrones[nombre] = {"tipo": "Other", "sw": 0.0}

    def carga_nodo(self, pat: str, nid: int, v) -> None:
        self._pat(pat)
        a = self.cargas.setdefault(pat, {}).setdefault(nid, [0.0] * 6)
        for k in range(6):
            a[k] += v[k]

    def carga_barra(self, pat: str, fid: int, w) -> None:
        self._pat(pat)
        a = self.cargas_barra.setdefault(pat, {}).setdefault(fid, [0.0] * 3)
        for k in range(3):
            a[k] += w[k]

    def carga_area(self, pat: str, sid: int, q: float) -> None:
        self._pat(pat)
        d = self.cargas_area.setdefault(pat, {})
        d[sid] = d.get(sid, 0.0) + q

    # -- salida --------------------------------------------------------------
    def construir(self, comportamiento: str | None = None) -> ModeloCSI:
        orden = sorted(self._nodos, key=lambda i: (self._orden[i], i))
        rank = {tmp: r + 1 for r, tmp in enumerate(orden)}      # id final = posicion + 1
        L: list[str] = ["# generado por hekatan_struct.archivos_csi (%s)" % self.programa]
        if comportamiento:
            L.append("comportamiento %s" % comportamiento)
        if self.torsion_safe:
            L.append("torsion safe")
        L += self.flags
        for tmp in orden:
            x, y, z = self._nodos[tmp]
            L.append("node %d %s %s %s" % (rank[tmp], fmt(x), fmt(y), fmt(z)))
        for f in self.frames:
            D = f["D"] or 0.0
            B = f["B"] or D
            L.append("frame %d %d %d %s %s %s %s %s %s %s%s" % (
                f["id"], rank[f["nI"]], rank[f["nJ"]], fmt(f["E"]), fmt(f["A"]), fmt(f["I22"]),
                fmt(f["I33"]), fmt(f["J"]), fmt(f["nu"]), fmt(f["rho"]),
                (" %s %s" % (fmt(D), fmt(B))) if D > 0 else ""))
        for f in self.frames:
            L.append("as %d %s %s" % (f["id"], fmt(f["As2"]), fmt(f["As3"])))
            if f["ang"]:
                L.append("ang %d %s" % (f["id"], fmt(f["ang"])))
            if f["rel"] and any(f["rel"]):
                L.append("release %d %s" % (f["id"], " ".join("1" if b else "0" for b in f["rel"])))
            if f["eo"] and (f["eo"][0] or f["eo"][1]):
                L.append("endoffset %d %s %s %s" % (f["id"], fmt(f["eo"][0]), fmt(f["eo"][1]),
                                                    fmt(f["eo"][2] if len(f["eo"]) > 2 else 0.0)))
            if f["cp"] and f["cp"] != 10:
                L.append("insercion %d %d %d" % (f["id"], f["cp"], 1 if f["tr"] else 0))
        for s in self.shells:
            L.append("shell %d %s %s %s 0 %s" % (
                s["id"], " ".join(str(rank[p]) for p in s["pts"]), fmt(s["t"]), fmt(s["E"]), fmt(s["rho"])))
            md = s["mods"]
            if md and any(abs(v - 1.0) > 1e-12 for v in md):
                L.append("shellmod %d %s" % (s["id"], " ".join(fmt(v) for v in md)))
            if s["thin"]:
                L.append("shelltype %d thin" % s["id"])
            if s["ang"]:
                L.append("shellang %d %s" % (s["id"], fmt(s["ang"])))
            if s["ks"]:
                L.append("springarea %d %s nodal" % (s["id"], fmt(s["ks"])))
        for nid, fl in self.apoyos.items():
            if any(fl):
                L.append("support %d %s" % (rank[nid], "".join("1" if b else "0" for b in fl)))
        for nid, g, k in self.muelles:
            L.append("spring %d %d %s" % (rank[nid], g, fmt(k)))
        for nid, g in self.diaf.items():
            L.append("diaph %d %d" % (rank[nid], g))
        tot: dict[int, list] = {}
        for pat, d in self.cargas.items():
            for nid, v in d.items():
                a = tot.setdefault(nid, [0.0] * 6)
                for k in range(6):
                    a[k] += v[k]
        for nid, v in sorted(tot.items(), key=lambda kv: rank[kv[0]]):
            if any(abs(x) > 0 for x in v):
                L.append("load %d %s" % (rank[nid], " ".join(fmt(x) for x in v)))
        totf: dict[int, list] = {}
        for d in self.cargas_barra.values():
            for fid, w in d.items():
                a = totf.setdefault(fid, [0.0] * 3)
                for k in range(3):
                    a[k] += w[k]
        for fid, w in sorted(totf.items()):
            if any(abs(x) > 0 for x in w):
                L.append("frameload %d %s" % (fid, " ".join(fmt(x) for x in w)))
        tota: dict[int, float] = {}
        for d in self.cargas_area.values():
            for sid, q in d.items():
                tota[sid] = tota.get(sid, 0.0) + q
        for sid, q in sorted(tota.items()):
            if q:
                L.append("areaload %d %s" % (sid, fmt(q)))
        sws = [p["sw"] for p in self.patrones.values() if p["sw"]]
        if sws:
            L.append("selfweight %s" % fmt(max(sws)))
            if len({round(s, 9) for s in sws}) > 1:
                self.aviso("varios patrones con peso propio distinto (%s): el motor aplica el mayor, una vez"
                           % ", ".join(fmt(s) for s in sorted(set(sws))))
            elif len(sws) > 1:
                self.aviso("varios patrones llevan peso propio: el motor lo aplica una sola vez")
        L.append("solve")
        texto = "\n".join(L) + "\n"
        fd, tmp = tempfile.mkstemp(suffix=".heks", text=True)
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as fh:
                fh.write(texto)
            base = leer_heks(tmp)
        finally:
            try:
                os.remove(tmp)
            except OSError:
                pass
        m = ModeloCSI(**{f.name: getattr(base, f.name) for f in fields(ModeloHeks)})
        m.programa, m.origen, m.titulo = self.programa, self.origen, self.titulo
        m.avisos = list(self.avisos)
        # el `.heks` fija nu = 0.2 en cascaras: se restituye el del material
        nfr = len(self.frames)
        ei = m.element_inputs
        for j, s in enumerate(self.shells):
            k = m.shell_idx.get(s["id"])
            if k is None:
                continue
            ei.poissons_ratios[k] = s["nu"]
            ei.shear_moduli[k] = s["E"] / (2 * (1 + s["nu"]))
        # nombres, cardinales y dimensiones
        for j, f in enumerate(self.frames):
            m.frame_sec[j:j + 1] = [f["sec"]] if j < len(m.frame_sec) else m.frame_sec[j:j + 1]
            if f["mat"]:
                m.mat_nombre[j] = f["mat"]
            if f["cp"]:
                m.cardinal[j] = f["cp"]
            if f["D"]:
                m.dim_barra[j] = (f["D"], f["B"] or f["D"])
            if f["nombre"]:
                m.nombre_barra[j] = f["nombre"]
        for s in self.shells:
            k = m.shell_idx.get(s["id"])
            if k is None:
                continue
            if s["mat"]:
                m.mat_nombre[k] = s["mat"]
            if s["prop"]:
                m.shell_prop[k] = s["prop"]
            if s["oneway"]:
                m.oneway.add(k)
            if s["nombre"]:
                m.nombre_cascara[k] = s["nombre"]
        for tmp, nom in self._nombre_nudo.items():
            if nom:
                m.nombre_nudo[rank[tmp] - 1] = nom
        # patrones
        m.patrones = {p: dict(v) for p, v in self.patrones.items()}
        for pat, d in self.cargas.items():
            m.cargas_patron[pat] = {rank[n] - 1: tuple(v) for n, v in d.items()}
        for pat, d in self.cargas_barra.items():
            m.cargas_barra_patron[pat] = {f - 1: tuple(w) for f, w in d.items()}
        for pat, d in self.cargas_area.items():
            m.cargas_area_patron[pat] = {m.shell_idx[s]: q for s, q in d.items() if s in m.shell_idx}
        m.combinaciones = [dict(c) for c in self.combos]
        m.plantas = list(self.plantas)
        for e in m.errores:
            if "SIN carga" in e:
                continue
            m.avisos.append("lector del motor: " + e)
        return m


# ─────────────────────────────────────────────────────────────────────────────
# Tablas `Clave=valor` (SAP2000 / SAFE)
# ─────────────────────────────────────────────────────────────────────────────
_KV = re.compile(r'("[^"]*"|[^\s=]+)\s*=\s*("[^"]*"|\S+)')


def parse_kv(linea: str) -> dict[str, str]:
    d = {}
    for k, v in _KV.findall(linea):
        d[k.strip('"')] = v.strip('"')
    return d


def tablas(texto: str):
    """Recorre un .s2k/.f2k: genera (NOMBRE_TABLA, {clave: valor}) por fila. Une las lineas con `_`."""
    buf = ""
    tabla = ""
    for raw in texto.splitlines():
        s = raw.rstrip()
        if s.endswith(" _") or s.endswith("\t_"):
            buf += s[:-1] + " "
            continue
        s = (buf + s).strip()
        buf = ""
        if not s or s.startswith(";"):
            continue
        if s.startswith("TABLE:"):
            m = re.match(r'TABLE:\s+"(.+?)"', s)
            tabla = m.group(1).upper() if m else ""
            continue
        if s.upper().startswith("END TABLE DATA"):
            break
        if tabla and "=" in s:
            yield tabla, parse_kv(s)


def si(v) -> bool:
    return str(v).strip().lower() in ("yes", "y", "true", "1", "si")


def flt(d: dict, k: str, default: float = 0.0) -> float:
    try:
        return float(d[k])
    except (KeyError, ValueError):
        return default


# ─────────────────────────────────────────────────────────────────────────────
# Comparacion campo por campo (para pruebas y para `convertir --verificar`)
# ─────────────────────────────────────────────────────────────────────────────
def comparar_modelos(a: ModeloHeks, b: ModeloHeks, tol: float = 1e-9, ignorar: tuple = ()) -> list[str]:
    """Lista de diferencias entre dos modelos (vacia = iguales a `tol` relativo). Compara nudos,
    conectividad, propiedades de barra y cascara, apoyos, cargas, muelles y diafragmas."""
    d: list[str] = []

    def cerca(x, y):
        return abs(x - y) <= tol * max(1.0, abs(x), abs(y))

    def vec(x, y, nombre):
        if len(x) != len(y) or any(not cerca(p, q) for p, q in zip(x, y)):
            d.append("%s: %s != %s" % (nombre, x, y))

    if len(a.nodes) != len(b.nodes):
        return ["nudos: %d != %d" % (len(a.nodes), len(b.nodes))]
    if len(a.elements) != len(b.elements):
        return ["elementos: %d != %d" % (len(a.elements), len(b.elements))]
    for i, (p, q) in enumerate(zip(a.nodes, b.nodes)):
        if any(not cerca(u, v) for u, v in zip(p, q)):
            d.append("nudo %d: %s != %s" % (i, p, q))
    for k, (p, q) in enumerate(zip(a.elements, b.elements)):
        if list(p) != list(q):
            d.append("conectividad %d: %s != %s" % (k, p, q))
    ea, eb = a.element_inputs, b.element_inputs
    campos = ("elasticities", "areas", "moments_of_inertia_y", "moments_of_inertia_z", "torsional_constants",
              "thicknesses", "poissons_ratios", "densities", "shear_areas_y", "shear_areas_z", "local_angles")
    for c in campos:
        da, db = getattr(ea, c), getattr(eb, c)
        for k in range(len(a.elements)):
            va, vb = da.get(k, 0.0), db.get(k, 0.0)
            if c.startswith("shear_areas") and len(a.elements[k]) == 2:
                va = da.get(k, 5 / 6 * ea.areas.get(k, 0.0))
                vb = db.get(k, 5 / 6 * eb.areas.get(k, 0.0))
            # los campos de barra solo se miran en barras, los de cascara solo en cascaras
            if not cerca(va, vb):
                d.append("%s[%d]: %r != %r" % (c, k, va, vb))
    def vacio(c, v):
        if v is None:
            return True
        if c == "moment_releases":
            return not any(v)
        if c == "plate_formulations":
            return not v
        if c == "shell_modifiers":
            return all(abs(x - 1.0) < 1e-12 for x in v)
        x = v if isinstance(v, (tuple, list)) else (v,)
        return all(abs(t) < 1e-12 for t in x)

    for c in ("end_offsets", "insertion_offsets", "moment_releases", "frame_loads", "shell_modifiers",
              "shell_angles", "plate_formulations"):
        da, db = getattr(ea, c), getattr(eb, c)
        for k in range(len(a.elements)):
            va, vb = da.get(k), db.get(k)
            na, nb = vacio(c, va), vacio(c, vb)
            if na and nb:
                continue
            if na != nb:
                d.append("%s[%d]: %r != %r" % (c, k, va, vb))
            elif c == "moment_releases":
                if list(va) != list(vb):
                    d.append("%s[%d]: %r != %r" % (c, k, va, vb))
            elif isinstance(va, (tuple, list)):
                vec(list(va), list(vb), "%s[%d]" % (c, k))
            elif not cerca(float(va), float(vb)):
                d.append("%s[%d]: %r != %r" % (c, k, va, vb))
    sa = {i: tuple(bool(x) for x in v) for i, v in a.node_inputs.supports.items() if any(v)}
    sb = {i: tuple(bool(x) for x in v) for i, v in b.node_inputs.supports.items() if any(v)}
    if sa != sb:
        d.append("apoyos distintos (%d vs %d)" % (len(sa), len(sb)))
    la, lb = _cargas_ef(a), _cargas_ef(b)
    for i in sorted(set(la) | set(lb)):
        vec(list(la.get(i, (0.0,) * 6)), list(lb.get(i, (0.0,) * 6)), "carga nudo %d" % i)
    mk = lambda m: {}
    ma, mb = _muelles(a), _muelles(b)
    for key in sorted(set(ma) | set(mb)):
        if not cerca(ma.get(key, 0.0), mb.get(key, 0.0)):
            d.append("muelle %s: %r != %r" % (key, ma.get(key), mb.get(key)))
    if dict(a.node_inputs.diaphragms) != dict(b.node_inputs.diaphragms):
        # los numeros de grupo pueden cambiar; se compara la particion
        pa, pb = _particion(a.node_inputs.diaphragms), _particion(b.node_inputs.diaphragms)
        if pa != pb:
            d.append("diafragmas distintos")
    if not cerca(a.selfweight, b.selfweight):
        d.append("selfweight: %r != %r" % (a.selfweight, b.selfweight))
    for k in set(a.shell_load) | set(b.shell_load):
        if not cerca(a.shell_load.get(k, 0.0), b.shell_load.get(k, 0.0)):
            d.append("areaload[%d]: %r != %r" % (k, a.shell_load.get(k), b.shell_load.get(k)))
    return [x for x in d if not x.startswith(tuple(ignorar))]
def _cargas_ef(m: ModeloHeks) -> dict:
    """Cargas nodales efectivas (las que ve el motor)."""
    return {i: tuple(v) for i, v in m.node_inputs.loads.items() if any(abs(x) > 1e-12 for x in v)}


def _muelles(m: ModeloHeks) -> dict:
    d: dict = {}
    for i, g, k in m.node_inputs.springs:
        d[(i, g)] = d.get((i, g), 0.0) + k
    for k, ks in m.node_inputs.area_springs.items():
        d[("area", k)] = ks
    return d


def _particion(dia: dict) -> set:
    g: dict = {}
    for n, v in dia.items():
        g.setdefault(v, set()).add(n)
    return {frozenset(s) for s in g.values() if len(s) >= 2}
