# -*- coding: utf-8 -*-
"""Lector de `.e2k` (ETABS) -> `ModeloCSI`.

Fuente de verdad: `examples/src/shared/e2kParser.ts` (+ `e2kAHeks.ts`). Se lee lo que el motor
entiende; lo demas se CUENTA en `modelo.avisos`.

El `.e2k` es un formato de EDIFICIOS: un `POINT` es un punto en planta y su cota sale de la planta
donde se usa. Un nudo es el par (punto, planta); en una `LINE` el punto que esta EN la planta del
objeto es el SEGUNDO y el primero baja `salto` plantas; en un `AREA` cada punto lleva su salto.
"""
from __future__ import annotations

import math
import re

from ._comun import (G, Constructor, ModeloCSI, a_csi, sec_angulo, sec_c_conformada, sec_canal,
                     sec_circular, sec_doble_canal, sec_perfil_i, sec_rectangular, sec_te, sec_tubo,
                     sec_tubo_redondo, unidades)

_TOK = re.compile(r'"[^"]*"|\S+')
_GDL = {"UX": 0, "UY": 1, "UZ": 2, "RX": 3, "RY": 4, "RZ": 5}
_REL = ["PI", "V2I", "V3I", "TI", "M2I", "M3I", "PJ", "V2J", "V3J", "TJ", "M2J", "M3J"]
_FMOD = ["AMOD", "A2MOD", "A3MOD", "JMOD", "I2MOD", "I3MOD", "MMOD", "WMOD"]
_OMOD = ["PROPMODA", "PROPMODA2", "PROPMODA3", "PROPMODT", "PROPMODI22", "PROPMODI33", "PROPMODM", "PROPMODW"]
_SMOD = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"]
_AMOD = ["PROPMODF11", "PROPMODF22", "PROPMODF12", "PROPMODM11", "PROPMODM22", "PROPMODM12",
         "PROPMODV13", "PROPMODV23"]


def _u(s: str) -> str:
    return s[1:-1] if len(s) >= 2 and s[0] == '"' and s[-1] == '"' else s


def _g(t: list, clave: str):
    """Valor que sigue a la clave SIN comillas (las comillas son valores, no claves)."""
    for i in range(1, len(t) - 1):
        if t[i] == clave:
            return _u(t[i + 1])
    return None


def _n(t: list, clave: str, d: float | None = None):
    v = _g(t, clave)
    if v is None:
        return d
    try:
        return float(v.replace(",", "."))
    except ValueError:
        return d


def leer_e2k(ruta: str, *, comportamiento: str | None = None) -> ModeloCSI:
    with open(ruta, "rb") as fh:
        raw = fh.read()
    try:
        texto = raw.decode("utf-8")
    except UnicodeDecodeError:
        texto = raw.decode("latin-1")
    return desde_texto_e2k(texto, origen=ruta, comportamiento=comportamiento)


def desde_texto_e2k(texto: str, *, origen: str = "", comportamiento: str | None = None) -> ModeloCSI:
    b = Constructor("etabs", origen)
    av = b.aviso
    unid = ["KN", "M"]
    historias: list[tuple] = []                  # (nombre, altura, elev|None) de ARRIBA abajo
    mats: dict[str, dict] = {}
    secs: dict[str, dict] = {}
    props: dict[str, dict] = {}
    puntos: dict[str, tuple] = {}
    orden_pt: dict[str, int] = {}
    lineas: dict[str, tuple] = {}
    areas: dict[str, tuple] = {}
    p_assign, l_assign, a_assign = [], [], []
    p_loads, l_loads, a_loads = [], [], []
    juegos: dict[str, list] = {}
    combos: dict[str, dict] = {}
    difrag: dict[str, str] = {}
    pmuelle: dict[str, list] = {}
    amuelle: dict[str, float] = {}
    patrones: dict[str, tuple] = {}
    casos: list[str] = []
    extra = {"otros_casos": 0}

    # ── pasada 1: leer todas las lineas utiles ───────────────────────────
    for raw_l in texto.splitlines():
        s = raw_l.strip()
        if not s or s[0] == "$":
            continue
        t = _TOK.findall(s)
        k = t[0]
        if k == "UNITS" and len(t) >= 3:
            unid = [_u(t[1]), _u(t[2])]
        elif k == "TITLE2" or (k == "TITLE1" and not b.titulo):
            b.titulo = _u(t[1]) if len(t) > 1 else ""
        elif k == "STORY":
            historias.append((_u(t[1]), _n(t, "HEIGHT", 0.0), _n(t, "ELEV")))
        elif k == "MATERIAL":
            m = mats.setdefault(_u(t[1]), {})
            for key in ("TYPE", "SYMTYPE"):
                if _g(t, key):
                    m[key] = _g(t, key)
            for key, dst in (("WEIGHTPERVOLUME", "w"), ("E", "E"), ("U", "nu"), ("FY", "fy"), ("FC", "fc")):
                v = _n(t, key)
                if v is not None:
                    m[dst] = v
        elif k == "FRAMESECTION":
            d = secs.setdefault(_u(t[1]), {"mods": [1.0] * 8})
            if _g(t, "SHAPE"):
                d["shape"] = _g(t, "SHAPE")
            if _g(t, "MATERIAL"):
                d["mat"] = _g(t, "MATERIAL")
            if _g(t, "FILLMATERIAL"):
                d["fill"] = _g(t, "FILLMATERIAL")
            for key in ("D", "B", "TF", "TW", "T", "LIP", "AREA", "AS2", "AS3", "I33", "I22", "TORSION", "J",
                        "DIS", "B2", "TF2"):
                v = _n(t, key)
                if v is not None:
                    d[key] = v
            for j, key in enumerate(_FMOD):
                v = _n(t, key)
                if v is not None:
                    d["mods"][j] = v
        elif k == "SHELLPROP":
            d = props.setdefault(_u(t[1]), {"mods": [1.0] * 8, "wmod": 1.0})
            for key in ("PROPTYPE", "MODELINGTYPE", "MATERIAL", "CONCMATERIAL", "SLABTYPE", "ONEWAYLOADDIST",
                        "DECKTYPE"):
                if _g(t, key):
                    d[key] = _g(t, key)
            for key in ("SLABTHICKNESS", "WALLTHICKNESS", "DECKSLABDEPTH", "DECKRIBDEPTH", "DECKRIBWIDTHTOP",
                        "DECKRIBWIDTHBOTTOM", "DECKRIBSPACING", "DECKUNITWEIGHT", "OVERALLDEPTH",
                        "SLABRIBWIDTHTOP", "SLABRIBWIDTHBOTTOM", "SLABRIBSPACING", "SLABRIBSPACING1",
                        "SLABRIBSPACING2", "WMOD"):
                v = _n(t, key)
                if v is not None:
                    d[key] = v
            for j, key in enumerate(_SMOD):
                v = _n(t, key)
                if v is not None:
                    d["mods"][j] = v
        elif k == "POINT" and len(t) >= 4:
            nm = _u(t[1])
            if nm not in puntos:
                orden_pt[nm] = len(orden_pt)
            puntos[nm] = (float(t[2]), float(t[3]), float(t[4]) if len(t) > 4 else 0.0)
        elif k == "LINE" and len(t) >= 6:
            lineas[_u(t[1])] = (t[2], _u(t[3]), _u(t[4]), int(float(t[5])))
        elif k == "AREA" and len(t) >= 5:
            q = [x for x in t[2:] if x[0] != '"']
            nm = _u(t[1])
            tipo = "FLOOR"
            if q and not q[0].replace(".", "").isdigit():
                tipo = q[0]
                q = q[1:]
            pts = [_u(x) for x in t[2:] if x[0] == '"']
            dz = []
            for x in t[2:]:
                if x[0] != '"':
                    try:
                        dz.append(int(float(x)))
                    except ValueError:
                        pass
            dz = dz[1:] if dz and len(dz) == len(pts) + 1 else dz   # el primero es el contador
            areas[nm] = (tipo, pts, dz if len(dz) == len(pts) else [0] * len(pts))
        elif k == "POINTASSIGN":
            p_assign.append(t)
        elif k == "LINEASSIGN":
            l_assign.append(t)
        elif k == "AREAASSIGN":
            a_assign.append(t)
        elif k == "LOADPATTERN":
            sw = _n(t, "SELFWEIGHT")
            if _g(t, "TYPE") is not None or sw is not None:
                patrones[_u(t[1])] = (_g(t, "TYPE") or "Other", sw or 0.0)
            else:
                patrones.setdefault(_u(t[1]), ("Other", 0.0))
        elif k == "LOADCASE":
            tp = _g(t, "TYPE")
            if tp and tp != "Linear Static":
                extra["otros_casos"] += 1
            if tp:
                casos.append(_u(t[1]))
        elif k == "COMBO":
            c = combos.setdefault(_u(t[1]), {"nombre": _u(t[1]), "tipo": "Linear Add", "items": []})
            if _g(t, "TYPE"):
                c["tipo"] = _g(t, "TYPE")
            cs = _g(t, "LOADCASE") or _g(t, "LOADCOMBO") or _g(t, "LOADPAT")
            if cs is not None:
                c["items"].append((cs, _n(t, "SF", 1.0)))
        elif k == "POINTLOAD":
            p_loads.append(t)
        elif k == "LINELOAD":
            l_loads.append(t)
        elif k == "AREALOAD":
            a_loads.append(t)
        elif k == "SHELLUNIFORMLOADSET":
            juegos.setdefault(_u(t[1]), []).append((_g(t, "LOADPAT"), _n(t, "VALUE", 0.0)))
        elif k == "DIAPHRAGM" and len(t) > 1:
            difrag[_u(t[1])] = (_g(t, "TYPE") or "RIGID").upper()
        elif k == "POINTSPRING":
            kk = pmuelle.setdefault(_u(t[1]), [0.0] * 6)
            for nombre, j in _GDL.items():
                v = _n(t, nombre)
                if v is not None:
                    kk[j] = v
        elif k == "AREASPRING":
            v = _n(t, "U3")
            if v is not None:
                amuelle[_u(t[1])] = v
            if _g(t, "NONLINEAROPT3") and _g(t, "NONLINEAROPT3") != "Linear":
                av("muelle de area «%s» no lineal (%s): se toma lineal" % (_u(t[1]), _g(t, "NONLINEAROPT3")))

    Ff, Lf = unidades(unid[0], unid[1])
    tens, peso, kT, kR = Ff / Lf ** 2, Ff / Lf ** 3, Ff / Lf, Ff * Lf

    # ── plantas ───────────────────────────────────────────────────────────
    n_st = len(historias)
    elev = [0.0] * n_st
    previa = 0.0
    for i in range(n_st - 1, -1, -1):
        nom, h, e = historias[i]
        if e is not None:
            elev[i] = e * Lf
        else:
            elev[i] = previa + (h or 0.0) * Lf
        previa = elev[i]
    idx_st = {h[0]: i for i, h in enumerate(historias)}
    b.plantas = [(historias[i][0], elev[i]) for i in range(n_st - 1, -1, -1)]

    def mat(nombre: str) -> dict:
        m = mats.get(nombre or "", {})
        return dict(E=m.get("E", 0.0) * tens, nu=m.get("nu", 0.2), rho=m.get("w", 0.0) * peso / G, nombre=nombre or "")

    # ── nudos ─────────────────────────────────────────────────────────────
    cache_n: dict[tuple, int | None] = {}

    def nudo(pt: str, story_i: int):
        clave = (pt, story_i)
        if clave in cache_n:
            return cache_n[clave]
        r = None
        if pt in puntos and 0 <= story_i < n_st:
            x, y, dz = puntos[pt]
            z = elev[story_i] - dz * Lf
            r = b.nodo(x * Lf, y * Lf, z, (orden_pt.get(pt, 0), round(z, 6)), nombre=pt)
        cache_n[clave] = r
        return r

    def buscar(pt: str, story: str):
        i = idx_st.get(story)
        if i is None or pt not in puntos:
            return None
        x, y, dz = puntos[pt]
        k = (round(x * Lf * 1e6), round(y * Lf * 1e6), round((elev[i] - dz * Lf) * 1e6))
        return b._clave.get(k)

    # ── secciones de barra ───────────────────────────────────────────────
    cache_s: dict[str, dict | None] = {}
    sin_sec: set = set()

    def seccion(nombre: str):
        if nombre in cache_s:
            return cache_s[nombre]
        s = secs.get(nombre)
        r = None
        if s and s.get("shape"):
            sh = s["shape"]
            D, B, TF, TW = (s.get(k, 0.0) * Lf for k in ("D", "B", "TF", "TW"))
            T = s.get("T", 0.0) * Lf
            m = mat(s.get("mat", ""))
            rho_ef = m["rho"]
            try:
                if sh == "General" or (s.get("AREA") and sh not in ("Steel I/Wide Flange",)):
                    r = dict(A=s.get("AREA", 0.0) * Lf ** 2, I33=s.get("I33", 0.0) * Lf ** 4,
                             I22=s.get("I22", 0.0) * Lf ** 4, J=s.get("TORSION", s.get("J", 0.0)) * Lf ** 4,
                             As2=s.get("AS2", 0.0) * Lf ** 2, As3=s.get("AS3", 0.0) * Lf ** 2, D=D, B=B)
                elif sh == "Concrete Rectangular":
                    r = sec_rectangular(D, B)
                elif sh == "Concrete Circle":
                    r = sec_circular(D)
                elif sh == "Steel I/Wide Flange":
                    r = sec_perfil_i(D, B, TF, TW, s.get("B2", 0.0) * Lf or None, s.get("TF2", 0.0) * Lf or None)
                elif sh == "Steel Tube":
                    r = sec_tubo(B, D, TF or TW, TW or TF)
                elif sh == "Steel Pipe":
                    r = sec_tubo_redondo(D, T or TW or TF)
                elif sh == "Steel Channel":
                    r = sec_canal(D, B, TF, TW)
                elif sh == "Concrete Tee":
                    r = sec_te(D, B, TF, TW)
                elif sh == "Steel Angle":
                    r = sec_angulo(D, B, TF, TW)
                elif sh == "Steel Double Channel":
                    r = sec_doble_canal(D, B, TF, TW)
                elif sh == "Cold Formed C":
                    r = sec_c_conformada(D, B, T or TF or TW, s.get("LIP", 0.0) * Lf)
                    r["As2"], r["As3"] = r["As2"], r["As3"]
                elif sh in ("Filled Steel Pipe", "Filled Steel Tube"):
                    from ..cft import cft_props, cftc_props
                    f = mat(s.get("fill", ""))
                    Ec = f["E"] or m["E"] * 0.125
                    if sh == "Filled Steel Pipe":
                        t_ = T or TW or TF
                        c = cftc_props(D, t_, m["E"], m["nu"], Ec, f["nu"])
                        di = D - 2 * t_
                        Ac = math.pi * di * di / 4
                        As_ = math.pi * D * D / 4 - Ac
                        Dd = Bb = D
                    else:
                        c = cft_props(B, D, TF or TW, m["E"], m["nu"], Ec, f["nu"], TW or TF)
                        Ac = (B - 2 * (TW or TF)) * (D - 2 * (TF or TW))
                        As_ = B * D - Ac
                        Dd, Bb = D, B
                    rho_ef = (m["rho"] * As_ + f["rho"] * Ac) / c["A"]
                    r = _pp(c["A"], c["I22"], c["I33"], c["J"], c["As2"], c["As3"], Dd, Bb)
                else:
                    av("sección «%s» de forma «%s» no soportada: se toma el rectángulo D x B" % (nombre, sh))
                    r = sec_rectangular(D or 0.3, B or D or 0.3)
            except (ZeroDivisionError, ValueError) as e:
                av("sección «%s» (%s): no se pudo calcular (%s)" % (nombre, sh, e))
                r = None
            if r is not None and not r.get("A"):
                av("sección «%s» (%s) sin área: barras sin rigidez" % (nombre, sh))
            if r is not None:
                r.update(E=m["E"], nu=m["nu"], rho=rho_ef, mat=m["nombre"], mods=list(s["mods"]))
        cache_s[nombre] = r
        return r

    # ── barras ────────────────────────────────────────────────────────────
    fid_de: dict[tuple, int] = {}
    n_auto = n_off = n_mir = n_springl = n_sinlinea = n_deg = n_nul = 0
    for t in l_assign:
        nm, st = _u(t[1]), _u(t[2])
        sec = _g(t, "SECTION")
        if sec is None:
            if _g(t, "OFFSETXI") is not None or any(x.startswith("OFFSET") for x in t):
                n_off += 1
            continue
        if nm not in lineas or st not in idx_st:
            n_sinlinea += 1
            continue
        _, p1, p2, ns = lineas[nm]
        i = idx_st[st]
        a, c = nudo(p1, i + ns), nudo(p2, i)
        if a is None or c is None:
            n_sinlinea += 1
            continue
        if a == c:
            n_deg += 1
            continue
        sp = seccion(sec)
        if sp is None:
            n_nul += 1
            continue
        f = [x * y for x, y in zip(sp["mods"], [(_n(t, k) if _n(t, k) is not None else 1.0) for k in _OMOD])]
        rel = None
        rr = _g(t, "RELEASE")
        if rr:
            rel = [False] * 12
            for tok in rr.split():
                if tok.upper() == "PINNED":
                    for q in ("M2I", "M3I", "M2J", "M3J"):
                        rel[_REL.index(q)] = True
                elif tok.upper() in _REL:
                    rel[_REL.index(tok.upper())] = True
        li, lj, rz = _n(t, "LENGTHOFFI"), _n(t, "LENGTHOFFJ"), _n(t, "RIGIDZONE")
        eo = None
        if li or lj:
            eo = (float(li or 0.0) * Lf, float(lj or 0.0) * Lf, float(rz or 0.0))
        elif rz:
            n_auto += 1
        cp = _n(t, "CARDINALPT")
        tr = (_g(t, "TRANSFORMSTIFF") or "Yes").lower() in ("yes", "si", "true")
        if _g(t, "MIRROR2") == "Yes" or _g(t, "MIRROR3") == "Yes":
            n_mir += 1
        if _g(t, "SPRINGPROP"):
            n_springl += 1
        if any(x.startswith("OFFSET") for x in t):
            n_off += 1
        fid = b.barra(nm, a, c, E=sp["E"], nu=sp["nu"], rho=sp["rho"] * f[7], A=sp["A"] * f[0],
                      I22=sp["I22"] * f[4], I33=sp["I33"] * f[5], J=sp["J"] * f[3],
                      As2=sp["As2"] * f[1], As3=sp["As3"] * f[2], D=sp.get("D", 0.0), B=sp.get("B", 0.0),
                      sec=sec, mat=sp["mat"], ang=_n(t, "ANG", 0.0) or 0.0, rel=rel, eo=eo,
                      cp=int(cp) if cp else None, tr=tr)
        fid_de[(nm, st)] = fid
    if n_nul:
        av("%d barras con sección sin propiedades calculables: omitidas" % n_nul)
    if n_deg:
        av("%d barras de longitud cero omitidas" % n_deg)
    if n_sinlinea:
        av("%d LINEASSIGN sin línea/planta/puntos resolubles: omitidas" % n_sinlinea)
    if n_auto:
        av("%d barras con RIGIDZONE sin LENGTHOFF (brazos automáticos de ETABS): no se calculan; "
           "usa comportamiento='etabs' para que el motor los ponga" % n_auto)
    if n_off:
        av("%d barras con desplazamiento OFFSET[XYZ][IJ] de los nudos: no viaja" % n_off)
    if n_mir:
        av("%d barras con MIRROR2/MIRROR3: no viaja" % n_mir)
    if n_springl:
        av("%d barras con muelle de línea (SPRINGPROP): no viaja" % n_springl)
    if any(sec.get("mods") != [1.0] * 8 for sec in secs.values()) or any(
            any(_n(t, k) not in (None, 1.0) for k in _OMOD) for t in l_assign):
        av("modificadores de barra horneados en A, As, J, I y peso (la sección de salida ya va modificada)")

    # ── cascaras ──────────────────────────────────────────────────────────
    sid_de: dict[tuple, int] = {}
    n_tri = n_op = n_prop = 0
    n_cp = 0
    for t in a_assign:
        nm, st = _u(t[1]), _u(t[2])
        if _g(t, "OPENING") == "Yes":
            n_op += 1
            continue
        sec = _g(t, "SECTION")
        if sec is None or nm not in areas or st not in idx_st:
            continue
        tipo, pts, dz = areas[nm]
        if len(pts) != 4:
            n_tri += 1
            continue
        pr = props.get(sec)
        if pr is None:
            n_prop += 1
            continue
        i = idx_st[st]
        ids = [nudo(p, i + d) for p, d in zip(pts, dz)]
        if None in ids or len(set(ids)) < 4:
            n_deg += 1
            continue
        sh = _shell(pr, mat, Lf, tens, peso, av, t)
        if sh is None:
            n_prop += 1
            continue
        mods = [x * (_n(t, k) if _n(t, k) is not None else 1.0) for x, k in zip(sh["mods"], _AMOD)]
        ks = 0.0
        sp = _g(t, "SPRINGPROP")
        if sp and sp in amuelle:
            ks = amuelle[sp] * Ff / Lf ** 3
        if _g(t, "CARDINALPOINT") not in (None, "MIDDLE"):
            n_cp += 1
        sid = b.cascara(nm, ids, t=sh["t"], E=sh["E"], nu=sh["nu"], rho=sh["rho"], mods=mods,
                        thin=sh["thin"], ang=_n(t, "ANG", 0.0) or 0.0, prop=sec, mat=sh["mat"], ks=ks,
                        oneway=sh["oneway"])
        sid_de[(nm, st)] = sid
    if n_tri:
        av("%d áreas que no son cuadriláteros (triángulos / polígonos) omitidas: el motor Python solo monta Q4" % n_tri)
    if n_op:
        av("%d orificios (OPENING) no se recortan de las losas" % n_op)
    if n_prop:
        av("%d áreas con propiedad no resoluble: omitidas" % n_prop)
    if n_cp:
        av("%d áreas con CARDINALPOINT distinto de MIDDLE: se ignora" % n_cp)
    for pr in props.values():
        if pr.get("SLABTYPE") in ("Ribbed", "Waffle"):
            av("losas nervadas/reticulares: solo cambia el peso (factor sobre la loseta), no la rigidez")
            break
    if any(p.get("PROPTYPE") == "Deck" for p in props.values()):
        av("propiedades Deck: membrana de espesor de la loseta con el peso del deck (decksec); sin nervios")

    # ── apoyos, diafragmas, muelles ───────────────────────────────────────
    grupos: dict[tuple, int] = {}
    n_huerfano = 0
    for t in p_assign:
        pt, st = _u(t[1]), _u(t[2])
        rs, dp, sp = _g(t, "RESTRAINT"), _g(t, "DIAPH") or _g(t, "DIAPHRAGM"), _g(t, "SPRINGPROP")
        if not (rs or dp or sp):
            continue
        nid = buscar(pt, st)
        if nid is None:
            n_huerfano += 1
            continue
        if rs:
            fl = [False] * 6
            for tok in rs.split():
                if tok.upper() in _GDL:
                    fl[_GDL[tok.upper()]] = True
            b.apoyo(nid, fl)
        if dp and dp.upper() != "DISCONNECTED":
            if difrag.get(dp, "RIGID") == "RIGID":
                b.diaf[nid] = grupos.setdefault((dp, st), len(grupos) + 1)
            else:
                av("diafragma «%s» %s: no se ata (solo se ata el RIGID)" % (dp, difrag.get(dp)), una_vez=True)
        if sp and sp in pmuelle:
            for j, kk in enumerate(pmuelle[sp]):
                b.muelle(nid, j, kk * (kT if j < 3 else kR))
    if n_huerfano:
        av("%d POINTASSIGN sobre puntos que ningún objeto toca: omitidos" % n_huerfano)

    # ── cargas ────────────────────────────────────────────────────────────
    for pat, (tp, sw) in patrones.items():
        b.patron(pat, tp, sw)
    n_l = n_loc = n_pl = 0
    for t in p_loads:
        pt, st, lc = _u(t[1]), _u(t[2]), _g(t, "LC")
        if lc is None:
            lc = _u(t[3]) if len(t) > 3 and t[3][0] == '"' else None
        nid = buscar(pt, st)
        if nid is None or lc is None:
            n_pl += 1
            continue
        v = [(_n(t, k, 0.0) or 0.0) for k in ("FX", "FY", "FZ")] + [(_n(t, k, 0.0) or 0.0) for k in ("MX", "MY", "MZ")]
        b.carga_nodo(lc, nid, [v[0] * Ff, v[1] * Ff, v[2] * Ff, v[3] * kR, v[4] * kR, v[5] * kR])
    for t in l_loads:
        nm, st, lc = _u(t[1]), _u(t[2]), _g(t, "LC")
        fid = fid_de.get((nm, st))
        tp, d = _g(t, "TYPE"), (_g(t, "DIR") or "").upper()
        if fid is None or lc is None:
            n_l += 1
            continue
        if tp != "UNIFF":
            n_loc += 1
            continue
        fv = (_n(t, "FVAL", 0.0) or 0.0) * kT
        if d == "GRAV":
            b.carga_barra(lc, fid, (0.0, 0.0, -fv))
        elif d in ("X", "Y", "Z"):
            w = [0.0, 0.0, 0.0]
            w["XYZ".index(d)] = fv
            b.carga_barra(lc, fid, w)
        else:
            n_loc += 1
    n_a = n_au = 0
    for t in a_loads:
        nm, st = _u(t[1]), _u(t[2])
        sid = sid_de.get((nm, st))
        if sid is None:
            n_a += 1
            continue
        tp, d = _g(t, "TYPE"), (_g(t, "DIR") or "GRAV").upper()
        if tp == "UNIFF":
            fv = (_n(t, "FVAL", 0.0) or 0.0) * Ff / Lf ** 2
            if d == "GRAV":
                b.carga_area(_g(t, "LC"), sid, -fv)
            elif d == "Z":
                b.carga_area(_g(t, "LC"), sid, fv)
            else:
                n_au += 1
        elif tp == "UNIFLOADSET":
            nom = _u(t[t.index("UNIFLOADSET") + 1]) if "UNIFLOADSET" in t else (_u(t[t.index('"UNIFLOADSET"') + 1]) if '"UNIFLOADSET"' in t else "")
            for lc, val in juegos.get(_g(t, "UNIFLOADSET") or nom, []):
                b.carga_area(lc, sid, -val * Ff / Lf ** 2)
        else:
            n_au += 1
    if n_pl:
        av("%d POINTLOAD sin nudo resoluble: omitidas" % n_pl)
    if n_l:
        av("%d LINELOAD sin barra resoluble: omitidas" % n_l)
    if n_loc:
        av("%d LINELOAD que no son uniformes en GRAV/X/Y/Z (locales, trapeciales, puntuales): no viajan" % n_loc)
    if n_a:
        av("%d AREALOAD sin cáscara resoluble (áreas omitidas o con orificio): no viajan" % n_a)
    if n_au:
        av("%d AREALOAD que no son UNIFF en GRAV/Z: no viajan" % n_au)
    if extra["otros_casos"]:
        av("%d casos no estáticos (modal, espectro, historia…) no viajan" % extra["otros_casos"])
    for nm, c in combos.items():
        b.combos.append(c)
    return b.construir(comportamiento)


def _pp(A, I22, I33, J, As2, As3, D, B):
    return dict(A=A, I22=I22, I33=I33, J=J, As2=As2, As3=As3, D=D, B=B)


def _shell(pr: dict, mat, Lf: float, tens: float, peso: float, av, t: list):
    """Propiedad de cascara -> espesor, material, tipo, modificadores. None si no se puede."""
    pt = pr.get("PROPTYPE", "Slab")
    mm = pr.get("MODELINGTYPE", "ShellThick")
    mods = list(pr["mods"])
    if pt == "Deck":
        tc = pr.get("DECKSLABDEPTH", 0.0) * Lf
        m = mat(pr.get("CONCMATERIAL", ""))
        hr, sr = pr.get("DECKRIBDEPTH", 0.0) * Lf, pr.get("DECKRIBSPACING", 0.0) * Lf
        wt, wb = pr.get("DECKRIBWIDTHTOP", 0.0) * Lf, pr.get("DECKRIBWIDTHBOTTOM", 0.0) * Lf
        horm = tc + (hr * (wt + wb) / 2 / sr if sr > 0 else 0.0)
        w = pr.get("DECKUNITWEIGHT", 0.0) * peso * Lf   # fuerza/volumen * m = fuerza/area ... ver abajo
        # DECKUNITWEIGHT es fuerza/area en las unidades del fichero: peso = (Ff/Lf^2)
        w = pr.get("DECKUNITWEIGHT", 0.0) * tens
        rho = (m["rho"] * horm + w / G) / tc if tc > 0 else 0.0
        mods[3:6] = [0.0, 0.0, 0.0]
        return dict(t=tc, E=m["E"], nu=m["nu"], rho=rho * pr.get("WMOD", 1.0), mods=mods, thin=False, mat=m["nombre"],
                    oneway=True)
    t_ = pr.get("SLABTHICKNESS") if pt != "Wall" else pr.get("WALLTHICKNESS")
    if t_ is None:
        t_ = pr.get("SLABTHICKNESS") or pr.get("WALLTHICKNESS")
    if not t_:
        return None
    tf_ = t_ * Lf
    m = mat(pr.get("MATERIAL", ""))
    rho = m["rho"]
    st = pr.get("SLABTYPE")
    if st in ("Ribbed", "Waffle"):
        h = pr.get("OVERALLDEPTH", 0.0) * Lf
        bw = (pr.get("SLABRIBWIDTHTOP", 0.0) + pr.get("SLABRIBWIDTHBOTTOM", 0.0)) / 2 * Lf
        s1 = (pr.get("SLABRIBSPACING1") or pr.get("SLABRIBSPACING") or 0.0) * Lf
        s2 = (pr.get("SLABRIBSPACING2") or 0.0) * Lf or s1
        if s1 > 0:
            f = (bw / s1) if st == "Ribbed" else (bw / s1 + bw / s2 - bw * bw / (s1 * s2))
            rho *= (tf_ + (h - tf_) * f) / tf_
    if mm == "Membrane":
        mods[3:6] = [0.0, 0.0, 0.0]
    elif mm.startswith("Plate"):
        av("cascara tipo «%s»: el motor la monta como Shell" % mm, una_vez=True)
    ow = (pr.get("ONEWAYLOADDIST") or "").lower() == "yes"
    return dict(t=tf_, E=m["E"], nu=m["nu"], rho=rho * pr.get("WMOD", 1.0), mods=mods, thin=(mm == "ShellThin"),
                mat=m["nombre"], oneway=ow)
