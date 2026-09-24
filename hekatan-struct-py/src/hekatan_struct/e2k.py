"""Exportador `.e2k` — de un `ModeloHeks` al fichero de texto de ETABS.

Por qué otro exportador si ya hay uno en TypeScript: porque **el 1-way no se
puede pedir por la OAPI**. `AreaObj.SetLoadUniformToFrame` devuelve −100 y
además deja el modelo SIN CARGA (medido en el galpón entero y en un modelo
limpio de 2 paños). El reparto en un sentido de ETABS vive en el FICHERO:

    SHELLPROP "ZINC" PROPTYPE "Slab" MATERIAL "ZINC" MODELINGTYPE "Membrane"
              ONEWAYLOADDIST "Yes"  SLABTYPE "Slab"  SLABTHICKNESS 0.8

Es un atributo del `SHELLPROP`, **no un `SlabType`** — por eso barrer los 7
SlabType no lo encontraba. Confirmado en un `.e2k` escrito por el propio ETABS.

Lo que arregla respecto al exportador de TypeScript, que se revisó a la vez:

1. **No escribía `ONEWAYLOADDIST` nunca.** El 1-way se perdía al exportar.
2. `t_slab = thicknesses.values().next().value` — el **primer** espesor del
   mapa para TODAS las losas. El galpón tiene zinc 0.0008 y deck 0.065.
3. Una sola `SHELLPROP "Losa"` / `"Muro"`, sin agrupar por espesor, material ni
   modificadores.
4. `esMembrana` era **global**: si UNA cáscara era membrana, TODAS salían de
   deck.
5. Y cuando era membrana emitía un **Deck Filled** con nervios y conectores de
   cortante — una chapa de 0.8 mm exportada como hormigón nervado. Era un apaño
   para forzar el ShellType 3; con `MODELINGTYPE "Membrane"` no hace falta.

⚠️ **TODO EL FICHERO VA EN N y MM.** ETABS **ignora el header `UNITS`**: no hay
token de unidades en el lector del e2k, lee en las unidades base (N, mm).
Medido importando el mismo fichero con cabeceras distintas. Fuerza ×1000 · longitud ×1000 · tensión
×1e-3 · área ×1e6 · inercia ×1e12 · momento ×1e6.

⚠️ Una sola línea `POINTLOAD` por nudo con las SEIS componentes: ETABS se queda
con UNA y descarta el resto. Emitiéndolas por separado el galpón entraba con
0.42 kN de 4078.

⚠️⚠️ **El e2k es un formato DE EDIFICIOS, no una lista de nudos 3D.** El
`POINT` es un punto en PLANTA y la Z sale del `STORY`; cada asignación
—`POINTASSIGN`, `LINEASSIGN`, `AREAASSIGN`, `AREALOAD`— lleva **el nombre de su
planta**. La primera versión de esto escribía coordenadas 3D y asignaciones sin
nivel: ETABS abrió el fichero, devolvió `OpenFile -> 0` y se quedó con **0
puntos, 0 líneas y 0 áreas**, dando sus propiedades de fábrica. No protesta.

Aquí se crea **una planta por cada cota Z distinta**, así todo nudo cae
exactamente en una y el descenso es 0. (El `POINT` admite un tercer número, que
es el descenso en mm bajo su planta; hace falta cuando las cotas no son
plantas — ver `galpon-bodega-electoral/e2k_a_dwg.py`.)

⚠️ Y en una `LINE`, el punto que está EN la planta del objeto es el **SEGUNDO**;
el primero es el que baja el salto de plantas (el último entero de la línea).
Al revés, el descenso cae en el extremo equivocado.
"""
from __future__ import annotations

import math

from .heks import ModeloHeks

# ETABS lee el e2k en N y mm, diga lo que diga el header.
F = 1000.0            # kN -> N
L = 1000.0            # m  -> mm
P = 1e-3              # kN/m2 -> N/mm2
A = 1e6               # m2 -> mm2
I = 1e12              # m4 -> mm4
M = 1e6               # kN·m -> N·mm
Q = 1e-3              # kN/m2 -> N/mm2 (carga de superficie)


def _n(v: float, d: int = 6) -> str:
    """Número sin notación científica rara ni ceros de más."""
    if v == 0:
        return "0"
    s = ("%.*g" % (12, v))
    return s


def _mat_de(m: ModeloHeks) -> dict[tuple[float, float], str]:
    """Un material por cada (E, nu) distinto que haya en el modelo."""
    vistos: dict[tuple[float, float], str] = {}
    ei = m.element_inputs
    for k in range(len(m.elements)):
        if k not in ei.elasticities:
            continue
        clave = (round(ei.elasticities[k], 3),
                 round(ei.poissons_ratios.get(k, 0.2), 4))
        if clave not in vistos:
            vistos[clave] = "MAT%d" % (len(vistos) + 1)
    return vistos


def _shellprop(m: ModeloHeks, k: int, mat: str, oneway: bool) -> tuple:
    """La clave y la línea `SHELLPROP` de una cáscara.

    El `MODELINGTYPE` sale del MODELO, no de una constante:

    * flexión anulada (`M11=M22=M12=0`, o el modificador escalar a 0) →
      `Membrane`, que es lo que es un deck o una chapa;
    * `shelltype thin` → `ShellThin`;
    * lo demás → `ShellThick`, el defecto de ETABS.

    ⚠️ Y `Membrane` de ETABS NO es lo mismo que dejar la flexión a cero con
    modificadores: medido en el mezanine, el paño declarado `Membrane` sale un
    **0.302 %** más flexible que el mismo paño `Thin`/`Thick` con
    `M11=M22=M12=0`. Por eso el modificador se escribe IGUAL aunque el tipo ya
    sea membrana: son dos cosas distintas y ETABS aplica las dos.
    """
    ei = m.element_inputs
    t = ei.thicknesses.get(k, 0.20)
    d = ei.shell_modifiers.get(k)
    sin_flexion = (all(abs(d[i]) < 1e-9 for i in (3, 4, 5)) if d
                   else abs(ei.bending_modifiers.get(k, 1.0)) < 1e-9)
    if sin_flexion:
        tipo = "Membrane"
    elif ei.plate_formulations.get(k) == 1:
        tipo = "ShellThin"
    else:
        tipo = "ShellThick"
    mods = tuple(d) if d else (
        ei.membrane_modifiers.get(k, 1.0),) * 3 + (
        ei.bending_modifiers.get(k, 1.0),) * 3 + (1.0, 1.0)
    ow = oneway and tipo == "Membrane"
    clave = (tipo, round(t, 8), mat, mods, ow)
    return clave, tipo, t, mods, ow


def exportar_e2k(m: ModeloHeks, ruta: str | None = None, *,
                 titulo: str = "Hekatan Struct", oneway: bool = True) -> str:
    """El texto `.e2k` del modelo. `oneway` pone `ONEWAYLOADDIST "Yes"` en las
    cáscaras de tipo `Membrane`, que es donde ETABS lo admite."""
    ei, ni = m.element_inputs, m.node_inputs
    ids_n = m.node_id if len(m.node_id) == len(m.nodes) else list(
        range(1, len(m.nodes) + 1))
    frames = [k for k, c in enumerate(m.elements) if len(c) == 2]
    shells = [k for k, c in enumerate(m.elements) if len(c) == 4]
    zs = sorted({round(p[2], 6) for p in m.nodes})

    out: list[str] = []
    ad = out.append
    # ⚠️ La PRIMERA linea es la cabecera de fichero, y no es decorativa: sin
    # ella (y sin GRIDS ni DIAPHRAGM NAMES) ETABS abre el .e2k, devuelve
    # `OpenFile -> 0` y se queda con CERO puntos, lineas y areas, dando sus
    # propiedades de fabrica. No da ningun error.
    ad(r'$ File %s saved 1/1/2026 00:00:00 AM' % (ruta or 'modelo.e2k'))
    ad(' ')
    ad('$ PROGRAM INFORMATION')
    ad('  PROGRAM  "ETABS"  VERSION "22.6.0"  ')
    ad('')
    ad('$ CONTROLS')
    # Tres tokens, no dos: fuerza, longitud y TEMPERATURA. Se escribe porque
    # ETABS lo espera, pero NO LO LEE: el fichero entero va en N y mm.
    ad('  UNITS  "N"  "MM"  "C"  ')
    ad('  TITLE1  "%s"  ' % titulo)
    ad('  PREFERENCE  MERGETOL 1')
    ad('')

    # ── Niveles ──────────────────────────────────────────────────────────
    # ETABS es un programa de EDIFICIOS: sin niveles que cubran el modelo, lo
    # que queda por encima se pierde.
    ad('$ STORIES - IN SEQUENCE FROM TOP')
    # Una planta por cada cota Z distinta: asi todo nudo cae EXACTAMENTE en una
    # y no hace falta descenso. Van de ARRIBA ABAJO y con su ALTURA, no su
    # elevacion: pasandole elevaciones, ETABS las acumula.
    nom_z = {}
    for i in range(len(zs) - 1, 0, -1):
        nom_z[zs[i]] = "N%d" % i
        ad('  STORY  "N%d"  HEIGHT %s  MASTERSTORY "Yes" '
           % (i, _n((zs[i] - zs[i - 1]) * L)))
    nom_z[zs[0]] = "Base"
    ad('  STORY  "Base"  ELEV %s ' % _n(zs[0] * L))
    ad('')

    def planta(iz):
        return nom_z[round(m.nodes[iz][2], 6)]

    def nivel(iz):
        return zs.index(round(m.nodes[iz][2], 6))

    # ── Rejilla y diafragmas ─────────────────────────────────────────────
    # Los dos van en cualquier .e2k que escribe ETABS. La rejilla se planta en
    # el rincon del modelo: no cambia nada del calculo, pero el fichero sin
    # ella no se lee.
    x0 = min(p[0] for p in m.nodes) * L
    y0 = min(p[1] for p in m.nodes) * L
    ad('$ GRIDS')
    ad('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1250 ')
    ad('  GRID "G1"  LABEL "A"  DIR "X"  COORD %s VISIBLE "Yes"  BUBBLELOC "End"  '
       % _n(x0))
    ad('  GRID "G1"  LABEL "1"  DIR "Y"  COORD %s VISIBLE "Yes"  BUBBLELOC "Start"  '
       % _n(y0))
    ad('')
    ad('$ DIAPHRAGM NAMES')
    ad('  DIAPHRAGM "D1"    TYPE RIGID')
    ad('')

    # ── Materiales ───────────────────────────────────────────────────────
    mats = _mat_de(m)
    ad('$ MATERIAL PROPERTIES')
    for (E, nu), nom in mats.items():
        ad('  MATERIAL  "%s"    TYPE "Steel"    GRADE "Grade 50"'
           '    WEIGHTPERVOLUME 0' % nom)
        ad('  MATERIAL  "%s"  SYMTYPE "Isotropic"  E %s  U %s  A 1.17E-05'
           % (nom, _n(E * P), _n(nu)))
    ad('')

    # ── Secciones de barra ───────────────────────────────────────────────
    # `SHAPE "General"` para que ETABS respete las OCHO propiedades. Con una
    # forma nominal las RECALCULA de t3/t2 y se comparan dos secciones.
    ad('$ FRAME SECTIONS')
    sec_de: dict[int, str] = {}
    vistas: dict[tuple, str] = {}
    for k in frames:
        nu = ei.poissons_ratios.get(k, 0.2)
        mat = mats[(round(ei.elasticities[k], 3), round(nu, 4))]
        cl = (mat, round(ei.areas.get(k, 0.0), 10),
              round(ei.moments_of_inertia_y.get(k, 0.0), 12),
              round(ei.moments_of_inertia_z.get(k, 0.0), 12),
              round(ei.torsional_constants.get(k, 0.0), 12),
              round(ei.shear_areas_z.get(k, 0.0), 10),
              round(ei.shear_areas_y.get(k, 0.0), 10))
        if cl not in vistas:
            nom = "SEC%d" % (len(vistas) + 1)
            vistas[cl] = nom
            a = ei.areas.get(k, 0.0)
            lado = math.sqrt(a) if a > 0 else 0.1
            i22, i33 = (ei.moments_of_inertia_y.get(k, 0.0),
                        ei.moments_of_inertia_z.get(k, 0.0))
            # ⚠️ As2 resiste V2, que va con I33; As3 con I22. Cruzarlas no da
            # error: da otra estructura, y siempre hacia más rígido.
            as2 = ei.shear_areas_z.get(k, 5 / 6 * a)
            as3 = ei.shear_areas_y.get(k, 5 / 6 * a)
            ad('  FRAMESECTION  "%s"  MATERIAL "%s"  SHAPE "General"  D %s B %s'
               '  AREA %s  J %s  I33 %s  I22 %s  AS2 %s  AS3 %s'
               '  S33 %s S22 %s Z33 %s Z22 %s R33 %s R22 %s'
               % (nom, mat, _n(lado * L), _n(lado * L), _n(a * A),
                  _n(ei.torsional_constants.get(k, 0.0) * I),
                  _n(i33 * I), _n(i22 * I), _n(as2 * A), _n(as3 * A),
                  # S = I/(D/2) y Z se deja igual: con SHAPE "General" ETABS
                  # usa A, J, I e As para la RIGIDEZ, y estos solo entran en
                  # diseno. En m3 son 2*I/lado; a mm3, x1e9.
                  _n(2 * i33 / lado * 1e9) if lado else "0",
                  _n(2 * i22 / lado * 1e9) if lado else "0",
                  _n(2 * i33 / lado * 1e9) if lado else "0",
                  _n(2 * i22 / lado * 1e9) if lado else "0",
                  _n(math.sqrt(i33 / a) * L) if a > 0 else "0",
                  _n(math.sqrt(i22 / a) * L) if a > 0 else "0"))
        sec_de[k] = vistas[cl]
    ad('')

    # ── Propiedades de cáscara ───────────────────────────────────────────
    prop_de: dict[int, str] = {}
    if shells:
        # ⚠️ La seccion se llama `SLAB PROPERTIES`. `SHELL PROPERTIES` me lo
        # invente yo, y ETABS con una cabecera que no conoce se come el
        # fichero ENTERO: `OpenFile -> 0` y cero puntos, sin un aviso.
        ad('$ SLAB PROPERTIES')
        vistos: dict[tuple, str] = {}
        for k in shells:
            nu = ei.poissons_ratios.get(k, 0.2)
            mat = mats[(round(ei.elasticities[k], 3), round(nu, 4))]
            clave, tipo, t, mods, ow = _shellprop(m, k, mat, oneway)
            if clave not in vistos:
                nom = "SH%d" % (len(vistos) + 1)
                vistos[clave] = nom
                linea = ('  SHELLPROP  "%s"  PROPTYPE  "Slab"  MATERIAL "%s"'
                         '  MODELINGTYPE "%s"' % (nom, mat, tipo))
                if ow:
                    # ⭐ EL 1-WAY. Es lo que la OAPI no deja poner.
                    linea += '  ONEWAYLOADDIST "Yes"'
                linea += ('  SLABTYPE "Slab"  SLABTHICKNESS %s ' % _n(t * L))
                ad(linea)
                if any(abs(v - 1.0) > 1e-12 for v in mods):
                    ad('  SHELLPROP  "%s"  F11MOD %s F22MOD %s F12MOD %s'
                       '  M11MOD %s M22MOD %s M12MOD %s V13MOD %s V23MOD %s'
                       % ((nom,) + tuple(_n(v) for v in mods[:8])))
            prop_de[k] = vistos[clave]
        ad('')

    # ── Nudos ────────────────────────────────────────────────────────────
    ad('$ POINT COORDINATES')
    # ⚠️ DOS numeros: es un punto en PLANTA. La Z la pone su planta.
    for i, p in enumerate(m.nodes):
        ad('  POINT  "%d"  %s %s ' % (ids_n[i], _n(p[0] * L), _n(p[1] * L)))
    ad('')

    ad('$ LINE CONNECTIVITIES')
    planta_de_linea = {}
    for k in frames:
        a, b = m.elements[k]
        pa, pb = m.nodes[a], m.nodes[b]
        # ⚠️ COLUMN <=> dxy EXACTAMENTE cero. En un e2k el tipo NO es
        # decorativo: ETABS asigna los ejes locales por defecto según él.
        dxy = math.hypot(pb[0] - pa[0], pb[1] - pa[1])
        tipo = "COLUMN" if dxy == 0.0 else "BEAM"
        # El objeto pertenece a la planta de su nudo ALTO, y ese nudo va el
        # SEGUNDO. El primero baja `salto` plantas.
        alto, bajo = (b, a) if pa[2] <= pb[2] else (a, b)
        planta_de_linea[k] = planta(alto)
        ad('  LINE  "L%d"  %s  "%d"  "%d"  %d'
           % (k + 1, tipo, ids_n[bajo], ids_n[alto], nivel(alto) - nivel(bajo)))
    ad('')

    if shells:
        ad('$ AREA CONNECTIVITIES')
        planta_de_area = {}
        for k in shells:
            c = m.elements[k]
            # La planta del pano es la de su esquina mas ALTA, y cada esquina
            # lleva cuantas plantas baja respecto de ella.
            top = max(c, key=lambda n_: m.nodes[n_][2])
            planta_de_area[k] = planta(top)
            ad('  AREA  "A%d"  FLOOR  4  %s  %s '
               % (k + 1, "  ".join('"%d"' % ids_n[n_] for n_ in c),
                  " ".join(str(nivel(top) - nivel(n_)) for n_ in c)))
        ad('')

    # ── Asignaciones ─────────────────────────────────────────────────────
    ad('$ LINE ASSIGNS')
    for k in frames:
        ang = ei.local_angles.get(k, 0.0)
        ad('  LINEASSIGN  "L%d"  "%s"  SECTION "%s"  ANG %s  MINNUMSTA 3'
           '  AUTOMESH "YES"  MESHATINTERSECTIONS "YES" '
           % (k + 1, planta_de_linea[k], sec_de[k], _n(ang)))
    ad('')

    if shells:
        ad('$ AREA ASSIGNS')
        for k in shells:
            ang = ei.shell_angles.get(k, 0.0)
            ad('  AREAASSIGN  "A%d"  "%s"  SECTION "%s"%s  OBJMESHTYPE "DEFAULT"'
               '  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE" '
               % (k + 1, planta_de_area[k], prop_de[k],
                  ("  ANG %s" % _n(ang)) if ang else ""))
        ad('')

    # ── Apoyos ───────────────────────────────────────────────────────────
    if ni.supports:
        ad('$ POINT ASSIGNS')
        # ⚠️ El RESTRAINT va por NOMBRES de GDL, no como mascara de bits.
        _GDL = ("UX", "UY", "UZ", "RX", "RY", "RZ")
        for i, fl in sorted(ni.supports.items()):
            ad('  POINTASSIGN  "%d"  "%s"  RESTRAINT "%s" '
               % (ids_n[i], planta(i),
                  " ".join(g for g, f in zip(_GDL, fl) if f)))
        ad('')

    # ── Cargas ───────────────────────────────────────────────────────────
    ad('$ LOAD PATTERNS')
    ad('  LOADPATTERN  "CARGA"  TYPE  "Other"  SELFWEIGHT  0')
    ad('')
    if ni.loads:
        ad('$ POINT OBJECT LOADS')
        for i, v in sorted(ni.loads.items()):
            # ⚠️ UNA SOLA LINEA con las seis componentes. ETABS se queda con
            # UNA `POINTLOAD` por nudo y descarta las demas: emitiendolas por
            # separado, el galpon entraba con 0.42 kN de 4078.
            # ⚠️ Y los momentos en N·MM (x1e6), no en N·m.
            ad('  POINTLOAD  "%d"  "%s"  TYPE "Force"  LC "CARGA"'
               '  FX %s FY %s FZ %s MX %s MY %s MZ %s '
               % (ids_n[i], planta(i), _n(v[0] * F), _n(v[1] * F),
                  _n(v[2] * F), _n(v[3] * M), _n(v[4] * M), _n(v[5] * M)))
        ad('')
    if m.shell_load:
        ad('$ SHELL OBJECT LOADS')
        for k, q in sorted(m.shell_load.items()):
            # La carga de AREA se escribe sobre el objeto, no repartida: si se
            # exporta ya en los nudos queda clavada y deja de redistribuirse.
            ad('  AREALOAD  "A%d"  "%s"  TYPE "UNIFF"  DIR "GRAV"  LC "CARGA"'
               '  FVAL %s ' % (k + 1, planta_de_area[k], _n(abs(q) * Q)))
        ad('')

    ad('$ END OF MODEL FILE')
    # ETABS escribe el e2k con finales de linea CRLF.
    texto = "\r\n".join(out) + "\r\n"
    if ruta:
        with open(ruta, "w", encoding="ascii", newline="") as fh:
            fh.write(texto)
    return texto
