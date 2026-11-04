# -*- coding: utf-8 -*-
"""Abrir / guardar .e2k (ETABS), .s2k (SAP2000) y .f2k (SAFE): `hekatan_struct.archivos_csi`.

Tres capas, como pide el repo:
  1. lector contra un .e2k ESCRITO A MANO (numeros conocidos, en N·mm y en kN·m: mismo modelo);
  2. viaje de ida y vuelta campo por campo (tol 1e-9) entre los tres formatos;
  3. el estatico del motor Python del modelo convertido = el del original (y = el motor TS/WASM).
"""
from __future__ import annotations

import math
import os
import subprocess
import sys
from pathlib import Path

import numpy as np
import pytest

import hekatan_struct as hs
from hekatan_struct.archivos_csi import comparar_modelos
from hekatan_struct.heks import escribir_heks, leer_heks, resolver_heks

from ._motor_ts import motor_ts

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]
DATOS = RAIZ / "tests" / "datos"
SRC = AQUI.parent / "src"

CIM = DATOS / "cimentacion_9zapatas.heks"


# ──────────────────────────────────────────────────────────────────────────────
# Un portico de un piso escrito A MANO (cada numero se conoce)
# ──────────────────────────────────────────────────────────────────────────────
def e2k_a_mano(fuerza="N", longitud="MM"):
    """El mismo modelo en N·mm o en kN·m (la unidad la dice el header)."""
    mm = longitud == "MM"
    L = 1.0 if mm else 1e-3                  # factor de longitud: mm -> unidad del fichero
    E = 25000 if mm else 25e6
    w = 2.4e-5 if mm else 24.0               # peso por volumen
    fv_l = 12.0                              # N/mm == kN/m
    fv_a = 0.003 if mm else 3.0              # N/mm2 == kPa x 1e-3
    F = 1.0 if mm else 1e-3                  # N -> unidad de fuerza
    M = 1.0 if mm else 1e-6
    n = lambda v: "%.10g" % (v * L)
    return f'''$ File prueba saved 1/1/2026
$ CONTROLS
  UNITS  "{fuerza}"  "{longitud}"  "C"
  TITLE1  "portico a mano"
$ STORIES - IN SEQUENCE FROM TOP
  STORY  "P2"  HEIGHT {n(3000)}  MASTERSTORY "Yes"
  STORY  "P1"  HEIGHT {n(3000)}  MASTERSTORY "Yes"
  STORY  "Base"  ELEV 0
$ DIAPHRAGM NAMES
  DIAPHRAGM "D1"    TYPE RIGID
$ MATERIAL PROPERTIES
  MATERIAL  "CONC"    TYPE "Concrete"    WEIGHTPERVOLUME {w}
  MATERIAL  "CONC"  SYMTYPE "Isotropic"  E {E}  U 0.2  A 1E-05
$ FRAME SECTIONS
  FRAMESECTION  "V30x50"  MATERIAL "CONC"  SHAPE "Concrete Rectangular"  D {n(500)} B {n(300)}
  FRAMESECTION  "C40"  MATERIAL "CONC"  SHAPE "Concrete Rectangular"  D {n(400)} B {n(400)}
$ SLAB PROPERTIES
  SHELLPROP  "L15"  PROPTYPE  "Slab"  MATERIAL "CONC"  MODELINGTYPE "ShellThin"  SLABTYPE "Slab"  SLABTHICKNESS {n(150)}
$ POINT COORDINATES
  POINT  "1"  {n(0)} {n(0)}
  POINT  "2"  {n(5000)} {n(0)}
  POINT  "3"  {n(5000)} {n(4000)}
  POINT  "4"  {n(0)} {n(4000)}
$ LINE CONNECTIVITIES
  LINE  "C1"  COLUMN  "1"  "1"  1
  LINE  "C2"  COLUMN  "2"  "2"  1
  LINE  "C3"  COLUMN  "3"  "3"  1
  LINE  "C4"  COLUMN  "4"  "4"  1
  LINE  "B1"  BEAM  "1"  "2"  0
  LINE  "B2"  BEAM  "2"  "3"  0
  LINE  "B3"  BEAM  "3"  "4"  0
  LINE  "B4"  BEAM  "4"  "1"  0
$ AREA CONNECTIVITIES
  AREA  "F1"  FLOOR  4  "1"  "2"  "3"  "4"  0 0 0 0
$ POINT ASSIGNS
  POINTASSIGN  "1"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "2"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "3"  "Base"  RESTRAINT "UX UY UZ RX RY RZ"
  POINTASSIGN  "4"  "Base"  RESTRAINT "UX UY UZ"
  POINTASSIGN  "1"  "P1"  DIAPH "D1"
  POINTASSIGN  "2"  "P1"  DIAPH "D1"
  POINTASSIGN  "3"  "P1"  DIAPH "D1"
  POINTASSIGN  "4"  "P1"  DIAPH "D1"
$ LINE ASSIGNS
  LINEASSIGN  "C1"  "P1"  SECTION "C40"  ANG 0  MINNUMSTA 3
  LINEASSIGN  "C2"  "P1"  SECTION "C40"  ANG 90  MINNUMSTA 3
  LINEASSIGN  "C3"  "P1"  SECTION "C40"  ANG 0  MINNUMSTA 3
  LINEASSIGN  "C4"  "P1"  SECTION "C40"  ANG 0  MINNUMSTA 3
  LINEASSIGN  "B1"  "P1"  SECTION "V30x50"  ANG 0  CARDINALPT 8  TRANSFORMSTIFF "Yes"  LENGTHOFFI {n(200)} LENGTHOFFJ {n(200)} RIGIDZONE 0
  LINEASSIGN  "B2"  "P1"  SECTION "V30x50"  ANG 0  RELEASE "M3J"
  LINEASSIGN  "B3"  "P1"  SECTION "V30x50"  ANG 0
  LINEASSIGN  "B4"  "P1"  SECTION "V30x50"  ANG 0
$ AREA ASSIGNS
  AREAASSIGN  "F1"  "P1"  SECTION "L15"  OBJMESHTYPE "DEFAULT"  ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"
$ LOAD PATTERNS
  LOADPATTERN "Dead"  TYPE  "Dead"  SELFWEIGHT  1
  LOADPATTERN "Live"  TYPE  "Live"  SELFWEIGHT  0
$ POINT OBJECT LOADS
  POINTLOAD  "3"  "P1"  TYPE "Force"  LC "Live"  FX {10000*F} FY 0 FZ {-20000*F} MX 0 MY 0 MZ {5e6*M}
$ FRAME OBJECT LOADS
  LINELOAD  "B1"  "P1"  TYPE "UNIFF"  DIR "GRAV"  LC "Dead"  FVAL {fv_l}
$ SHELL OBJECT LOADS
  AREALOAD  "F1"  "P1"  TYPE "UNIFF"  DIR "GRAV"  LC "Live"  FVAL {fv_a}
$ LOAD COMBINATIONS
  COMBO "C1"  TYPE "Linear Add"
  COMBO "C1"  LOADCASE "Dead"  SF 1.2
  COMBO "C1"  LOADCASE "Live"  SF 1.6
$ END OF MODEL FILE
'''


@pytest.fixture(params=[("N", "MM"), ("KN", "M")], ids=["N-mm", "kN-m"])
def portico(request, tmp_path):
    f = tmp_path / "portico.e2k"
    f.write_text(e2k_a_mano(*request.param), encoding="ascii")
    return hs.abrir(str(f))


def _frames(m):
    return [k for k, c in enumerate(m.elements) if len(c) == 2]


def _nudo(m, x, y, z):
    for i, p in enumerate(m.nodes):
        if abs(p[0] - x) + abs(p[1] - y) + abs(p[2] - z) < 1e-9:
            return i
    raise AssertionError("no hay nudo en %s" % ((x, y, z),))


def test_lector_e2k_a_mano(portico):
    m = portico
    ei, ni = m.element_inputs, m.node_inputs
    assert len(m.nodes) == 8 and len(m.elements) == 9 and len(_frames(m)) == 8
    assert m.programa == "etabs"
    # unidades: llevadas a kN y m, sea cual sea el header
    c1 = _frames(m)[0]
    assert ei.elasticities[c1] == pytest.approx(25e6, rel=1e-12)
    assert ei.densities[c1] == pytest.approx(24.0 / 9.80665, rel=1e-12)
    assert ei.areas[c1] == pytest.approx(0.16, rel=1e-12)
    assert ei.moments_of_inertia_z[c1] == pytest.approx(0.4 ** 4 / 12, rel=1e-12)
    # viga B1 (la 5.a barra): seccion 0.30 x 0.50, brazos 0.2 m, punto cardinal 8 = arriba -> d2 = -D/2
    b1 = _frames(m)[4]
    assert ei.moments_of_inertia_z[b1] == pytest.approx(0.3 * 0.5 ** 3 / 12, rel=1e-12)
    assert ei.moments_of_inertia_y[b1] == pytest.approx(0.5 * 0.3 ** 3 / 12, rel=1e-12)
    assert ei.end_offsets[b1] == pytest.approx((0.2, 0.2, 0.0))
    assert ei.insertion_offsets[b1] == pytest.approx((-0.25, 0.0))
    assert m.cardinal[b1] == 8
    # liberacion M3 en J de B2: bit 11 de los 12
    b2 = _frames(m)[5]
    assert ei.moment_releases[b2] == [False] * 11 + [True]
    assert ei.local_angles[_frames(m)[1]] == 90.0
    # cascara: Thin, 0.15 m, E y nu del material
    s = [k for k, c in enumerate(m.elements) if len(c) == 4][0]
    assert ei.thicknesses[s] == pytest.approx(0.15) and ei.plate_formulations[s] == 1
    assert ei.poissons_ratios[s] == 0.2
    # plantas: z = 0 y 3 m (STORY HEIGHT 3000 mm, la P2 sin objetos no genera nudos)
    assert sorted({round(p[2], 9) for p in m.nodes}) == [0.0, 3.0]
    assert len(ni.supports) == 4 and sum(1 for v in ni.supports.values() if all(v)) == 3
    assert len(set(ni.diaphragms.values())) == 1 and len(ni.diaphragms) == 4
    # patrones: peso propio del Dead, carga nodal del Live en kN y kN·m, area con signo de gravedad
    assert m.patrones["Dead"] == {"tipo": "Dead", "sw": 1.0} and m.selfweight == 1.0
    i3 = _nudo(m, 5.0, 4.0, 3.0)
    assert m.cargas_patron["Live"][i3] == pytest.approx((10.0, 0.0, -20.0, 0.0, 0.0, 5.0))
    assert m.cargas_barra_patron["Dead"][b1] == pytest.approx((0.0, 0.0, -12.0))
    assert m.cargas_area_patron["Live"][s] == pytest.approx(-3.0)
    assert m.shell_load[s] == pytest.approx(-3.0)
    assert m.combinaciones == [{"nombre": "C1", "tipo": "Linear Add", "items": [("Dead", 1.2), ("Live", 1.6)]}]


def test_unidades_nmm_igual_a_knm(tmp_path):
    ms = []
    for u in (("N", "MM"), ("KN", "M")):
        f = tmp_path / ("p_%s.e2k" % u[0])
        f.write_text(e2k_a_mano(*u), encoding="ascii")
        ms.append(hs.abrir(str(f)))
    assert comparar_modelos(ms[0], ms[1], 1e-9) == []


# ──────────────────────────────────────────────────────────────────────────────
# Ida y vuelta, campo por campo
# ──────────────────────────────────────────────────────────────────────────────
def _viaje(m, ruta):
    r = hs.guardar(m, str(ruta))
    return hs.abrir(str(ruta)), r


@pytest.mark.parametrize("ext", ["e2k", "s2k"])
def test_portico_ida_y_vuelta_exacta(portico, tmp_path, ext):
    """Todo lo que el motor entiende sobrevive e2k -> {e2k, s2k} -> modelo, a 1e-9."""
    m2, r = _viaje(portico, tmp_path / ("a." + ext))
    assert comparar_modelos(portico, m2, 1e-9) == []
    # tambien lo que NO esta en el ModeloHeks: patrones, combinaciones, cargas por patron
    assert m2.patrones == portico.patrones
    assert m2.combinaciones == portico.combinaciones
    for pat in portico.patrones:
        for i, v in portico.cargas_patron.get(pat, {}).items():
            assert m2.cargas_patron[pat][i] == pytest.approx(v, abs=1e-9)
        assert m2.cargas_barra_patron.get(pat, {}) == pytest.approx(portico.cargas_barra_patron.get(pat, {}))
        assert m2.cargas_area_patron.get(pat, {}) == pytest.approx(portico.cargas_area_patron.get(pat, {}))


def test_portico_cadena_e2k_s2k_e2k(portico, tmp_path):
    m1, _ = _viaje(portico, tmp_path / "a.s2k")
    m2, _ = _viaje(m1, tmp_path / "b.e2k")
    m3, _ = _viaje(m2, tmp_path / "c.s2k")
    assert comparar_modelos(portico, m3, 1e-9) == []
    # lo que SAP2000 no trae de serie lo escribe explicito: sin LENGTHOFF automatico en el e2k de vuelta
    assert "LENGTHOFFI 0 LENGTHOFFJ 0" in (tmp_path / "b.e2k").read_text()


def test_portico_a_f2k_avisa_lo_que_no_viaja(portico, tmp_path):
    m2, r = _viaje(portico, tmp_path / "a.f2k")
    txt = " | ".join(r.avisos)
    for frase in ("liberaciones", "ángulo de eje local", "punto de inserción", "diafragmas", "cargas de área"):
        assert frase in txt, (frase, r.avisos)
    # lo que si viaja, exacto (barras, nudos, apoyos, propiedades, cargas nodales y de barra)
    ign = ("moment_releases", "local_angles", "insertion_offsets", "diafragmas", "areaload", "carga nudo")
    assert comparar_modelos(portico, m2, 1e-9, ignorar=ign) == []
    # el area se convirtio en fuerzas nodales consistentes: la resultante Fz es la misma
    fz = lambda m: sum(v[2] for v in m.node_inputs.loads.values())
    assert fz(m2) == pytest.approx(fz(portico), rel=1e-9)
    # SAFE no tiene COLUMN OBJECT CONNECTIVITY en nuestro fichero (ley 1): todas BEAM
    f2k = (tmp_path / "a.f2k").read_text()
    assert "COLUMN OBJECT CONNECTIVITY" not in f2k and "BEAM OBJECT CONNECTIVITY" in f2k
    # ley 4: J x 10 en el fichero y x 0.1 al leer
    j_modelo = portico.element_inputs.torsional_constants[_frames(portico)[0]]
    assert m2.element_inputs.torsional_constants[_frames(m2)[0]] == pytest.approx(j_modelo, rel=1e-9)


@pytest.mark.skipif(not CIM.exists(), reason="falta tests/datos/cimentacion_9zapatas.heks")
@pytest.mark.parametrize("ext", ["e2k", "s2k", "f2k"])
def test_cimentacion_heks_a_cada_formato_y_vuelta(tmp_path, ext):
    """9 zapatas Thick + pedestales + vigas + 225 muelles + peso propio: los TRES formatos sin perder un campo."""
    m0 = leer_heks(str(CIM))
    m1, r = _viaje(m0, tmp_path / ("c." + ext))
    assert comparar_modelos(m0, m1, 1e-9) == []
    assert not [a for a in r.avisos if "no viaj" in a or "omitid" in a]
    assert len(m1.node_inputs.springs) == len(m0.node_inputs.springs) == 225


@pytest.mark.skipif(not CIM.exists(), reason="falta tests/datos/cimentacion_9zapatas.heks")
def test_cimentacion_cadena_entre_los_tres(tmp_path):
    m0 = leer_heks(str(CIM))
    ma, _ = _viaje(m0, tmp_path / "1.e2k")
    mb, _ = _viaje(ma, tmp_path / "2.s2k")
    mc, _ = _viaje(mb, tmp_path / "3.f2k")
    md, _ = _viaje(mc, tmp_path / "4.e2k")
    assert comparar_modelos(m0, md, 1e-9) == []


@pytest.mark.parametrize("ext", ["e2k", "s2k"])
def test_modelo_real_e2k_secciones_R1(tmp_path, ext):
    """Un e2k de ETABS (372 nudos, 207 barras, 300 losas, Dead/Live): dos viajes y vuelta exactos."""
    f = DATOS / "e2k_secciones_R1.e2k"
    if not f.exists():
        pytest.skip("falta %s" % f)
    m0 = hs.abrir(str(f))
    assert len(m0.nodes) == 372 and len(_frames(m0)) == 207
    m1, _ = _viaje(m0, tmp_path / ("r." + ext))
    assert comparar_modelos(m0, m1, 1e-9) == []


def test_modelo_real_estructura_mixta_todo(tmp_path):
    """estructura-mixta: releases, ANG, cardinal, muelles de area, 5 patrones. e2k y s2k exactos; f2k avisa."""
    f = RAIZ / "examples" / "src" / "estructura-mixta" / "modelo.e2k"
    if not f.exists():
        pytest.skip("falta %s" % f)
    m0 = hs.abrir(str(f))
    for ext in ("e2k", "s2k"):
        m1, _ = _viaje(m0, tmp_path / ("m." + ext))
        assert comparar_modelos(m0, m1, 1e-9) == []
    m2, r = _viaje(m0, tmp_path / "m.f2k")
    perdidos = comparar_modelos(m0, m2, 1e-9)
    assert perdidos, "SAFE no trae releases/angulos: tiene que haber diferencias"
    campos = {d.split("[")[0].split(":")[0] for d in perdidos}
    assert campos <= {"local_angles", "insertion_offsets", "moment_releases", "plate_formulations", "areaload"}, campos
    txt = " | ".join(r.avisos)
    assert "liberaciones" in txt and "ángulo" in txt and "inserción" in txt


@pytest.mark.skipif(not os.path.exists(r"C:\ETABS\mercado\mercado.e2k"), reason="falta mercado.e2k")
def test_humo_mercado_grande(tmp_path):
    """6.9 MB, 14745 barras, 1844 areas: abre, cuenta y avisa lo que no entiende (1 prueba de humo)."""
    m = hs.abrir(r"C:\ETABS\mercado\mercado.e2k")
    assert sum(1 for c in m.elements if len(c) == 2) == 14745
    assert len(m.node_inputs.supports) > 100
    assert any("CARDINALPOINT" in a or "nervadas" in a or "Deck" in a for a in m.avisos)
    assert set(m.patrones) >= {"Dead", "Live"}


# ──────────────────────────────────────────────────────────────────────────────
# El estatico
# ──────────────────────────────────────────────────────────────────────────────
def _u(m):
    r = resolver_heks(m)
    return np.array([r.deformations[i] for i in range(len(m.nodes))], float)


@pytest.mark.skipif(not CIM.exists(), reason="falta tests/datos/cimentacion_9zapatas.heks")
@pytest.mark.parametrize("ext", ["e2k", "s2k", "f2k"])
def test_estatico_cimentacion_convertida_igual_al_original(tmp_path, ext):
    m0 = leer_heks(str(CIM))
    u0 = _u(m0)
    m1, _ = _viaje(m0, tmp_path / ("c." + ext))
    u1 = _u(m1)
    rel = np.abs(u1 - u0).max() / np.abs(u0).max()
    assert rel < 1e-9, rel


@pytest.mark.skipif(not CIM.exists(), reason="falta tests/datos/cimentacion_9zapatas.heks")
@pytest.mark.parametrize("ext,ref", [("e2k", "etabs_e2k"), ("s2k", "sap_s2k"), ("f2k", "safe_f2k")])
def test_estatico_cimentacion_contra_lo_medido(tmp_path, ext, ref):
    """Contra el JSON medido en ETABS / SAP2000 / SAFE: la distancia es la MISMA que la del .heks original
    (la conversion no anade ni 1e-9). Uz del peor nudo, relativo al maximo."""
    import json
    R = json.loads((DATOS / ("cimentacion_9zapatas_%s.json" % ref)).read_text())
    m0 = leer_heks(str(CIM))
    m1, _ = _viaje(m0, tmp_path / ("c." + ext))
    u0, u1 = _u(m0), _u(m1)
    d0 = max(abs(u0[n["i"]][2] - n["u"][2]) for n in R["nudos"])
    d1 = max(abs(u1[n["i"]][2] - n["u"][2]) for n in R["nudos"])
    mx = np.abs(u0[:, 2]).max()
    assert abs(d1 - d0) / mx < 1e-9
    assert d1 / mx < 2e-3          # y esa distancia es la del motor Python vs el programa (medida: 4.6e-4)


@pytest.mark.parametrize("ext", ["e2k", "s2k"])
def test_estatico_portico_convertido_igual(portico, tmp_path, ext):
    """Portico con brazos, liberacion, cardinal 8, area y peso propio: el motor da lo mismo antes y despues."""
    u0 = _u(portico)
    m1, _ = _viaje(portico, tmp_path / ("p." + ext))
    u1 = _u(m1)
    assert np.abs(u1 - u0).max() / np.abs(u0).max() < 1e-9


@pytest.mark.skipif(not CIM.exists(), reason="falta tests/datos/cimentacion_9zapatas.heks")
@pytest.mark.parametrize("ext", ["e2k", "s2k", "f2k"])
def test_estatico_contra_el_motor_ts(tmp_path, ext):
    """El modelo LEIDO del fichero, escrito a .heks y resuelto por el motor TS/WASM = el motor Python: 1e-6."""
    m0 = leer_heks(str(CIM))
    m1, _ = _viaje(m0, tmp_path / ("c." + ext))
    ts = motor_ts(escribir_heks(m1))
    n = len(m1.nodes)
    ut = np.array([ts["deformations"][str(i)] for i in range(n)], float)
    up = _u(m1)
    assert np.abs(ut - up).max() / np.abs(ut).max() < 1e-6


# ──────────────────────────────────────────────────────────────────────────────
# Estructura de los ficheros escritos (lo que ETABS / SAP2000 / SAFE exigen)
# ──────────────────────────────────────────────────────────────────────────────
def test_e2k_escrito_tiene_las_secciones_de_ETABS(portico, tmp_path):
    hs.guardar(portico, str(tmp_path / "a.e2k"))
    t = (tmp_path / "a.e2k").read_bytes().decode("ascii")
    assert t.startswith("$ File ") and "\r\n" in t
    for sec in ("$ PROGRAM INFORMATION", "$ CONTROLS", "$ STORIES - IN SEQUENCE FROM TOP", "$ GRIDS",
                "$ DIAPHRAGM NAMES", "$ MATERIAL PROPERTIES", "$ FRAME SECTIONS", "$ SLAB PROPERTIES",
                "$ POINT COORDINATES", "$ LINE CONNECTIVITIES", "$ AREA CONNECTIVITIES", "$ POINT ASSIGNS",
                "$ LINE ASSIGNS", "$ AREA ASSIGNS", "$ LOAD PATTERNS", "$ LOAD CASES", "$ POINT OBJECT LOADS",
                "$ FRAME OBJECT LOADS", "$ SHELL OBJECT LOADS", "$ LOAD COMBINATIONS", "$ END OF MODEL FILE"):
        assert sec in t, sec
    assert 'UNITS  "N"  "MM"  "C"' in t                      # el fichero va en N y mm
    assert 'SELFWEIGHT  1' in t and 'ONEWAYLOADDIST' not in t  # Thin, no membrana
    assert " TORSION " in t and 'SHAPE "General"' in t        # General con TORSION (no J)
    assert t.count("  POINTLOAD ") == 1                       # UNA linea por nudo y patron
    assert 'RELEASE "M3J"' in t and "CARDINALPT 8" in t and 'TRANSFORMSTIFF "Yes"' in t
    # AREALOAD con signo: 3 kN/m2 hacia abajo = FVAL +0.003 N/mm2 GRAV, y NO tambien como POINTLOAD repartido
    assert t.count("  AREALOAD ") == 1 and 'DIR "GRAV"  LC "Live"' in t
    assert "FVAL 0.003" in t


def test_s2k_escrito_tiene_las_tablas_de_SAP2000(portico, tmp_path):
    hs.guardar(portico, str(tmp_path / "a.s2k"))
    t = (tmp_path / "a.s2k").read_text()
    for tabla in ("CONNECTIVITY - FRAME", "CONNECTIVITY - AREA", "JOINT COORDINATES", "FRAME SECTION ASSIGNMENTS",
                  "FRAME SECTION PROPERTIES 01 - GENERAL", "AREA SECTION ASSIGNMENTS", "AREA SECTION PROPERTIES",
                  "JOINT RESTRAINT ASSIGNMENTS", "LOAD PATTERN DEFINITIONS", "LOAD CASE DEFINITIONS",
                  "CASE - STATIC 1 - LOAD ASSIGNMENTS", "JOINT LOADS - FORCE", "FRAME LOADS - DISTRIBUTED",
                  "AREA LOADS - UNIFORM", "COMBINATION DEFINITIONS", "FRAME RELEASE ASSIGNMENTS 1 - GENERAL",
                  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS", "FRAME INSERTION POINT ASSIGNMENTS",
                  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL", "CONSTRAINT DEFINITIONS - DIAPHRAGM",
                  "JOINT CONSTRAINT ASSIGNMENTS", "MATERIAL PROPERTIES 01 - GENERAL",
                  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES", "PROGRAM CONTROL"):
        assert 'TABLE:  "%s"' % tabla in t, tabla
    assert t.rstrip().endswith("END TABLE DATA") and 'CurrUnits="KN, m, C"' in t
    assert "Shape=General" in t and "Type=Shell-Thin" in t       # General (no recalcula) y guion en Shell-Thin
    assert 'CardinalPt="8 (top center)"' in t


def test_f2k_escrito_cumple_las_cuatro_leyes_de_SAFE(tmp_path):
    if not CIM.exists():
        pytest.skip("falta la cimentacion")
    m0 = leer_heks(str(CIM))
    hs.guardar(m0, str(tmp_path / "a.f2k"))
    t = (tmp_path / "a.f2k").read_text()
    assert 'TABLE:  "COLUMN OBJECT CONNECTIVITY"' not in t and 'TABLE:  "BEAM OBJECT CONNECTIVITY"' in t   # 1
    assert '"Stiffness UZ"=' in t and '"Rigid Factor"=' in t and "StiffUZ" not in t                       # 2
    assert '"Longitudinal Rebar Material"=A615Gr60' in t and "Material=A615Gr60   Type=Rebar" in t        # 3
    j = m0.element_inputs.torsional_constants[_frames(m0)[0]]
    assert "J=%.10g" % (10 * j) in t or ("J=%s" % ("%.13g" % (10 * j))) in t                              # 4
    assert t.rstrip().endswith("END TABLE DATA")


# ──────────────────────────────────────────────────────────────────────────────
# API y CLI
# ──────────────────────────────────────────────────────────────────────────────
def test_api_por_extension_y_errores(portico, tmp_path):
    r = hs.guardar(portico, str(tmp_path / "x.S2K"))        # extension en mayusculas
    assert r.formato == "sap2000" and isinstance(r.avisos, list)
    assert isinstance(hs.abrir(str(tmp_path / "x.S2K")), hs.archivos_csi.ModeloCSI)
    with pytest.raises(ValueError):
        hs.abrir(str(tmp_path / "x.txt"))
    with pytest.raises(ValueError):
        hs.guardar(portico, str(tmp_path / "x.dxf"))
    # el formato antiguo de SAP (bloques SYSTEM/JOINT) se rechaza con un mensaje, no en silencio
    (tmp_path / "viejo.s2k").write_text("SYSTEM\n  DOF=UX,UY,UZ\nJOINT\n  1 X=0 Y=0 Z=0\nEND\n")
    with pytest.raises(ValueError, match="antiguo"):
        hs.abrir(str(tmp_path / "viejo.s2k"))


def test_modelo_heks_plano_se_guarda_sin_patrones(tmp_path):
    """Un ModeloHeks que no viene de un fichero CSI (sin patrones) sale con el patron Dead y su peso propio."""
    if not CIM.exists():
        pytest.skip("falta la cimentacion")
    m0 = leer_heks(str(CIM))
    r = hs.guardar(m0, str(tmp_path / "a.e2k"))
    assert 'LOADPATTERN  "Dead"  TYPE  "Dead"  SELFWEIGHT  1' in r.texto
    m1 = hs.abrir(str(tmp_path / "a.e2k"))
    assert list(m1.patrones) == ["Dead"] and m1.selfweight == 1.0


def test_cli_convertir(portico, tmp_path):
    hs.guardar(portico, str(tmp_path / "in.e2k"))
    env = dict(os.environ, PYTHONPATH=str(SRC))
    r = subprocess.run([sys.executable, "-m", "hekatan_struct", "convertir", str(tmp_path / "in.e2k"),
                        str(tmp_path / "out.s2k")], capture_output=True, text=True, env=env, cwd=str(tmp_path))
    assert r.returncode == 0, r.stderr
    assert "sap2000" in r.stdout
    m = hs.abrir(str(tmp_path / "out.s2k"))
    assert comparar_modelos(portico, m, 1e-9) == []
    # el CLI de siempre sigue vivo
    r2 = subprocess.run([sys.executable, "-m", "hekatan_struct", "modos", "0", "0", "1", "0", "1", "1", "0", "1"],
                        capture_output=True, text=True, env=env, cwd=str(tmp_path))
    assert r2.returncode == 0 and r2.stdout.strip() == "3"


def test_exportar_e2k_basico_escribe_TORSION_y_no_duplica_area(portico, tmp_path):
    """`e2k.exportar_e2k` escribia `J` (ETABS lo ignora -> J=0) en vez de `TORSION`."""
    from hekatan_struct.e2k import exportar_e2k
    t = exportar_e2k(portico)
    t = t if isinstance(t, str) else str(t)
    secs = [l for l in t.splitlines() if "FRAMESECTION" in l and 'SHAPE "General"' in l]
    assert secs and all(" TORSION " in l and " J " not in l for l in secs)
