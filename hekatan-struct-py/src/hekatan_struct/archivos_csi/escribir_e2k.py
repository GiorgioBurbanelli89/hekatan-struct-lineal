# -*- coding: utf-8 -*-
"""Escritor de `.e2k` (ETABS) desde un `ModeloHeks`/`ModeloCSI`.

Parte de `hekatan_struct.e2k.exportar_e2k` (que ya escribe nudos, barras, cascaras, apoyos y una carga) y
anade lo que le faltaba para que el viaje de ida y vuelta no pierda nada: patrones con su tipo y peso
propio, cargas POR PATRON (nodales, de barra y de area), combinaciones, releases, brazos, punto de
insercion, muelles (de nudo y de area), diafragmas, materiales con su peso por volumen y nombres de
planta, seccion y propiedad.

⚠️ Como `exportar_e2k`: TODO va en N y mm (ETABS ignora el header UNITS al importar), una planta por cada
cota Z distinta, `POINT` en planta + planta del objeto, una sola linea `POINTLOAD` por nudo y patron.
⚠️ A diferencia de `exportar_e2k`, la carga de AREA se escribe SOLO como `AREALOAD` (aquel escribia
tambien la repartida en `POINTLOAD` y la contaba dos veces) y con su signo (DIR "GRAV", FVAL = -q).
"""
from __future__ import annotations

import math

from ._escribir import Vista, limpio
from ._comun import ModeloCSI

F, L, P, A_, I_, M_, Q = 1000.0, 1000.0, 1e-3, 1e6, 1e12, 1e6, 1e-3
W_ = 1e-6                      # kN/m3 -> N/mm3
_REL = ["PI", "V2I", "V3I", "TI", "M2I", "M3I", "PJ", "V2J", "V3J", "TJ", "M2J", "M3J"]
_GDL = ("UX", "UY", "UZ", "RX", "RY", "RZ")


def _n(v: float) -> str:
    return "0" if v == 0 else "%.12g" % v


def escribir_e2k(modelo, ruta: str | None = None, *, titulo: str | None = None):
    """→ (texto, avisos). Si `ruta`, tambien lo escribe (ASCII, CRLF, como ETABS)."""
    V = Vista(modelo)
    m, ei, ni = V.m, V.ei, V.ni
    avisos = [a for a in V.avisos if not a.startswith("unión viga-muro")]
    titulo = titulo or m.titulo or "Hekatan Struct"
    sap_like = m.programa in ("sap2000", "safe")
    out: list[str] = []
    ad = out.append
    ad(r'$ File %s saved 1/1/2026 00:00:00 AM' % (ruta or "modelo.e2k"))
    ad(" ")
    ad("$ PROGRAM INFORMATION")
    ad('  PROGRAM  "ETABS"  VERSION "22.6.0"  ')
    ad("")
    ad("$ CONTROLS")
    ad('  UNITS  "N"  "MM"  "C"  ')
    ad('  TITLE1  "%s"  ' % limpio(titulo))
    ad("  PREFERENCE  MERGETOL 1")
    ad("")

    # ── plantas ──────────────────────────────────────────────────────────
    zs = sorted({round(p[2], 9) for p in m.nodes}) or [0.0]
    conocidas = [(limpio(n), e) for n, e in m.plantas]
    nom_z: dict[float, str] = {}
    usados: set = set()
    for z in zs:
        nom = next((n for n, e in conocidas if abs(e - z) < 1e-6 and n not in usados), None)
        if nom is None:
            nom = "Z%d" % (len(usados) + 1)
            while nom in usados:
                nom += "_"
        usados.add(nom)
        nom_z[z] = nom
    ad("$ STORIES - IN SEQUENCE FROM TOP")
    for i in range(len(zs) - 1, 0, -1):
        ad('  STORY  "%s"  HEIGHT %s  MASTERSTORY "Yes" ' % (nom_z[zs[i]], _n((zs[i] - zs[i - 1]) * L)))
    ad('  STORY  "%s"  ELEV %s ' % (nom_z[zs[0]], _n(zs[0] * L)))
    ad("")

    def zk(i):
        return round(m.nodes[i][2], 9)

    def planta(i):
        return nom_z[zk(i)]

    def nivel(i):
        return zs.index(zk(i))

    x0 = min((p[0] for p in m.nodes), default=0.0) * L
    y0 = min((p[1] for p in m.nodes), default=0.0) * L
    ad("$ GRIDS")
    ad('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1250 ')
    ad('  GRID "G1"  LABEL "A"  DIR "X"  COORD %s VISIBLE "Yes"  BUBBLELOC "End"  ' % _n(x0))
    ad('  GRID "G1"  LABEL "1"  DIR "Y"  COORD %s VISIBLE "Yes"  BUBBLELOC "Start"  ' % _n(y0))
    ad("")
    ad("$ DIAPHRAGM NAMES")
    grupos = sorted(set(ni.diaphragms.values())) if ni.diaphragms else []
    for g in ([1] if not grupos else grupos):
        ad('  DIAPHRAGM "D%d"    TYPE RIGID' % g)
    ad("")
    for g in grupos:
        zz = {zk(i) for i, v in ni.diaphragms.items() if v == g}
        if len(zz) > 1:
            avisos.append("diafragma %d abarca %d cotas: ETABS ata cada planta por separado" % (g, len(zz)))

    # ── materiales ───────────────────────────────────────────────────────
    ad("$ MATERIAL PROPERTIES")
    for nom, (E, nu, rho) in V.materiales.items():
        ad('  MATERIAL  "%s"    TYPE "Steel"    GRADE "Grade 50"    WEIGHTPERVOLUME %s' % (nom, _n(rho * 9.80665 * W_)))
        ad('  MATERIAL  "%s"  SYMTYPE "Isotropic"  E %s  U %s  A 1.17E-05' % (nom, _n(E * P), _n(nu)))
    ad("")

    # ── secciones de barra (General: ETABS respeta las ocho propiedades) ───────
    ad("$ FRAME SECTIONS")
    for nom, s in V.secciones.items():
        a = s["A"]
        D, B = s["D"], s["B"]
        S33 = 2 * s["I33"] / D if D else 0.0
        S22 = 2 * s["I22"] / B if B else 0.0
        ad('  FRAMESECTION  "%s"  MATERIAL "%s"  SHAPE "General"  D %s B %s  AREA %s  AS2 %s AS3 %s'
           '  I33 %s I22 %s TORSION %s  S33POS %s S33NEG %s S22POS %s S22NEG %s  Z33 %s Z22 %s  R33 %s R22 %s '
           % (nom, s["mat"], _n(D * L), _n(B * L), _n(a * A_), _n(s["As2"] * A_), _n(s["As3"] * A_),
              _n(s["I33"] * I_), _n(s["I22"] * I_), _n(s["J"] * I_),
              _n(S33 * 1e9), _n(S33 * 1e9), _n(S22 * 1e9), _n(S22 * 1e9), _n(S33 * 1e9), _n(S22 * 1e9),
              _n(math.sqrt(s["I33"] / a) * L) if a > 0 else "0", _n(math.sqrt(s["I22"] / a) * L) if a > 0 else "0"))
    ad("")

    # ── propiedades de area ───────────────────────────────────────────────
    losas = {n: p for n, p in V.props.items() if not p["vertical"]}
    muros = {n: p for n, p in V.props.items() if p["vertical"]}

    def shellprop(nom, p):
        if p["vertical"]:
            lin = '  SHELLPROP  "%s"  PROPTYPE  "Wall"  MATERIAL "%s"  MODELINGTYPE "%s"  WALLTHICKNESS %s ' % (
                nom, p["mat"], p["tipo"], _n(p["t"] * L))
        else:
            lin = '  SHELLPROP  "%s"  PROPTYPE  "Slab"  MATERIAL "%s"  MODELINGTYPE "%s"' % (nom, p["mat"], p["tipo"])
            if p["oneway"]:
                lin += '  ONEWAYLOADDIST "Yes"'
            lin += '  SLABTYPE "Slab"  SLABTHICKNESS %s ' % _n(p["t"] * L)
        ad(lin)
        md = p["mods"]
        if any(abs(v - 1.0) > 1e-12 for v in md):
            ad('  SHELLPROP  "%s"  F11MOD %s F22MOD %s F12MOD %s  M11MOD %s M22MOD %s M12MOD %s V13MOD %s V23MOD %s'
               % ((nom,) + tuple(_n(v) for v in md)))
    if losas:
        ad("$ SLAB PROPERTIES")
        for n, p in losas.items():
            shellprop(n, p)
        ad("")
    if muros:
        ad("$ WALL PROPERTIES")
        for n, p in muros.items():
            shellprop(n, p)
        ad("")

    # ── muelles ───────────────────────────────────────────────────────────
    nom_spr: dict[int, str] = {}
    sprops: dict[tuple, str] = {}
    lineas_spr = []
    for i, v in sorted(V.muelle_nudo.items()):
        fich = tuple(+float("%.12g" % (x * (1.0 if g < 3 else M_))) for g, x in enumerate(v))
        if fich not in sprops:
            sprops[fich] = "SPR%d" % (len(sprops) + 1)
            lineas_spr.append('  POINTSPRING  "%s"  NONLINEARSPECOPTION  "LINKS"  %s ' % (
                sprops[fich], " ".join("%s %s" % (gn, _n(x)) for gn, x in zip(_GDL, fich))))
        nom_spr[i] = sprops[fich]
    aspr: dict[int, str] = {}
    aprops: dict[float, str] = {}
    lineas_aspr = []
    for k, ks in sorted(ni.area_springs.items()):
        fich = float("%.12g" % (ks * W_))
        if fich not in aprops:
            aprops[fich] = "ASPR%d" % (len(aprops) + 1)
            lineas_aspr.append('  AREASPRING  "%s"  U3  %s ' % (aprops[fich], _n(fich)))
        aspr[k] = aprops[fich]
    if lineas_spr:
        ad("$ POINT SPRING PROPERTIES")
        out.extend(lineas_spr)
        ad("")
    if lineas_aspr:
        ad("$ AREA SPRING PROPERTIES")
        out.extend(lineas_aspr)
        ad("")

    # ── geometria ─────────────────────────────────────────────────────────
    ad("$ POINT COORDINATES")
    for i, p in enumerate(m.nodes):
        ad('  POINT  "%d"  %s %s ' % (V.ids[i], _n(p[0] * L), _n(p[1] * L)))
    ad("")
    ad("$ LINE CONNECTIVITIES")
    pl_linea = {}
    for k in V.frames:
        a, b = m.elements[k]
        pa, pb = m.nodes[a], m.nodes[b]
        dxy = math.hypot(pb[0] - pa[0], pb[1] - pa[1])
        tipo = "COLUMN" if dxy == 0.0 else "BEAM"
        alto, bajo = (b, a) if pa[2] <= pb[2] else (a, b)
        pl_linea[k] = planta(alto)
        ad('  LINE  "L%d"  %s  "%d"  "%d"  %d' % (k + 1, tipo, V.ids[bajo], V.ids[alto], nivel(alto) - nivel(bajo)))
    ad("")
    pl_area = {}
    if V.shells:
        ad("$ AREA CONNECTIVITIES")
        for k in V.shells:
            c = m.elements[k]
            top = max(c, key=lambda q: m.nodes[q][2])
            pl_area[k] = planta(top)
            ad('  AREA  "A%d"  %s  4  %s  %s ' % (k + 1, "PANEL" if V.vertical(k) else "FLOOR",
                                                 "  ".join('"%d"' % V.ids[q] for q in c),
                                                 " ".join(str(nivel(top) - nivel(q)) for q in c)))
        ad("")

    # ── asignaciones ───────────────────────────────────────────────────────
    ad("$ LINE ASSIGNS")
    for k in V.frames:
        ex = ""
        ang = ei.local_angles.get(k, 0.0)
        r = V.liberaciones(k)
        if r:
            ex += '  RELEASE "%s"' % " ".join(n for n, b in zip(_REL, r) if b)
        o = V.offsets(k)
        if o:
            ex += "  LENGTHOFFI %s LENGTHOFFJ %s RIGIDZONE %s" % (_n(o[0] * L), _n(o[1] * L), _n(o[2]))
        elif sap_like:
            ex += "  LENGTHOFFI 0 LENGTHOFFJ 0"
        c = V.cardinal(k)
        if c:
            ex += '  CARDINALPT %d  TRANSFORMSTIFF "%s"' % (c[0], "Yes" if c[1] else "No")
        ad('  LINEASSIGN  "L%d"  "%s"  SECTION "%s"  ANG %s%s  MINNUMSTA 3  AUTOMESH "YES"  MESHATINTERSECTIONS "YES" '
           % (k + 1, pl_linea[k], V.sec_de[k], _n(ang), ex))
    ad("")
    if V.shells:
        ad("$ AREA ASSIGNS")
        for k in V.shells:
            ang = ei.shell_angles.get(k, 0.0)
            sp = ('  SPRINGPROP "%s"' % aspr[k]) if k in aspr else ""
            ad('  AREAASSIGN  "A%d"  "%s"  SECTION "%s"%s%s  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"'
               '  CARDINALPOINT "MIDDLE" ' % (k + 1, pl_area[k], V.prop_de[k], ("  ANG %s" % _n(ang)) if ang else "", sp))
        ad("")
    asig = {}
    for i, fl in ni.supports.items():
        if any(fl):
            asig.setdefault(i, []).append('RESTRAINT "%s"' % " ".join(g for g, f in zip(_GDL, fl) if f))
    for i, g in ni.diaphragms.items():
        if g > 0:
            asig.setdefault(i, []).append('DIAPH "D%d"' % g)
    for i, s in nom_spr.items():
        asig.setdefault(i, []).append('SPRINGPROP "%s"' % s)
    if asig:
        ad("$ POINT ASSIGNS")
        for i in sorted(asig):
            ad('  POINTASSIGN  "%d"  "%s"  %s ' % (V.ids[i], planta(i), " ".join(asig[i])))
        ad("")

    # ── cargas ─────────────────────────────────────────────────────────────
    ad("$ LOAD PATTERNS")
    for p in V.patrones:
        ad('  LOADPATTERN  "%s"  TYPE  "%s"  SELFWEIGHT  %s' % (p["nombre"], p["tipo"], _n(p["sw"])))
    ad("")
    ad("$ LOAD CASES")
    for p in V.patrones:
        ad('  LOADCASE "%s"  TYPE  "Linear Static"  INITCOND  "PRESET"  ' % p["nombre"])
        ad('  LOADCASE "%s"  LOADPAT  "%s"  SF  1 ' % (p["nombre"], p["nombre"]))
    ad("")
    fil = []
    for p in V.patrones:
        for i, v in sorted(V.cn[p["orig"]].items()):
            if any(abs(x) > 1e-12 for x in v):
                fil.append('  POINTLOAD  "%d"  "%s"  TYPE "Force"  LC "%s"  FX %s FY %s FZ %s MX %s MY %s MZ %s '
                           % (V.ids[i], planta(i), p["nombre"], _n(v[0] * F), _n(v[1] * F), _n(v[2] * F),
                              _n(v[3] * M_), _n(v[4] * M_), _n(v[5] * M_)))
    if fil:
        ad("$ POINT OBJECT LOADS")
        out.extend(fil)
        ad("")
    fil = []
    for p in V.patrones:
        for k, w in sorted(V.cb[p["orig"]].items()):
            if k not in pl_linea:
                continue
            if abs(w[2]) > 1e-12:
                fil.append('  LINELOAD  "L%d"  "%s"  TYPE "UNIFF"  DIR "GRAV"  LC "%s"  FVAL %s '
                           % (k + 1, pl_linea[k], p["nombre"], _n(-w[2])))
            for d, x in (("X", w[0]), ("Y", w[1])):
                if abs(x) > 1e-12:
                    fil.append('  LINELOAD  "L%d"  "%s"  TYPE "UNIFF"  DIR "%s"  LC "%s"  FVAL %s '
                               % (k + 1, pl_linea[k], d, p["nombre"], _n(x)))
    if fil:
        ad("$ FRAME OBJECT LOADS")
        out.extend(fil)
        ad("")
    fil = []
    for p in V.patrones:
        for k, q in sorted(V.ca[p["orig"]].items()):
            if k in pl_area and abs(q) > 1e-15:
                fil.append('  AREALOAD  "A%d"  "%s"  TYPE "UNIFF"  DIR "GRAV"  LC "%s"  FVAL %s '
                           % (k + 1, pl_area[k], p["nombre"], _n(-q * Q)))
    if fil:
        ad("$ SHELL OBJECT LOADS")
        out.extend(fil)
        ad("")
    if V.combos:
        ad("$ LOAD COMBINATIONS")
        for c in V.combos:
            ad('  COMBO "%s"  TYPE "%s"  ' % (c["nombre"], c["tipo"]))
            for caso, sf in c["items"]:
                ad('  COMBO "%s"  LOADCASE "%s"  SF %s ' % (c["nombre"], caso, _n(sf)))
        ad("")
    ad("$ END OF MODEL FILE")
    if V.solidos:
        avisos.append("%d sólidos H8 no tienen equivalente en .e2k: omitidos" % len(V.solidos))
    if ni.hanging_nodes:
        pass
    texto = "\r\n".join(out) + "\r\n"
    if ruta:
        with open(ruta, "w", encoding="ascii", errors="replace", newline="") as fh:
            fh.write(texto)
    return texto, avisos
