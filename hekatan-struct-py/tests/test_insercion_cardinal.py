# -*- coding: utf-8 -*-
"""PUNTO DE INSERCION (cardinal points de CSI) en el motor de Python.

  1. tabla 1-11 -> (d2, d3), errores claros (11 sin centro de cortante, falta D/B)
  2. CON restriccion rigida contra SAP2000 24 (validation/insercion/sap_res.json y sap_fuerzas.json:
     voladizo 4 m, CP 10/8/2): desplazamientos, giro y M3 a <= 1e-9
  3. SIN restriccion (transform=False): la K no se toca => resultado del centroide (CP 10); solo cambia la
     posicion geometrica del eje
  4. losa 4x4 con vigas de borde CP 8 (SAP2000 = ETABS = Struct a <= 1e-9 en validation/insercion/sap_losa.json)
     leida por el .heks (`e2klinea ... CARDINALPT 8`, `frame ... D B`)
  5. Python = motor TS/C++ (cliModeler) a <= 1e-6 relativo, mismo .heks (CP 8 y CP 2, con y sin TRANSFORMSTIFF)
"""
import json

import numpy as np
import pytest

from hekatan_struct import ElementInputs, NodeInputs, analyze, deform
from hekatan_struct.heks import leer_heks, resolver_heks
from hekatan_struct.insercion import asignar_punto_insercion, offsets_punto_cardinal, posicion_centroide
from tests._motor_ts import RAIZ, motor_ts

VAL = RAIZ / "validation" / "insercion"


# ───────────────────────────── 1. tabla ─────────────────────────────
def test_tabla_vertical_y_lateral():
    D, B = 0.6, 0.3
    assert offsets_punto_cardinal(10, D, B) == (0.0, 0.0)
    assert offsets_punto_cardinal(8, D, B) == (-D / 2, 0.0)          # arriba-centro: el centroide queda D/2 debajo
    assert offsets_punto_cardinal(2, D, B) == (D / 2, 0.0)
    assert offsets_punto_cardinal(5, D, B) == (0.0, 0.0)
    for cp, (e2, e3) in {1: (D / 2, B / 2), 3: (D / 2, -B / 2), 7: (-D / 2, B / 2), 9: (-D / 2, -B / 2),
                         4: (0, B / 2), 6: (0, -B / 2)}.items():
        assert offsets_punto_cardinal(cp, D, B) == pytest.approx((e2, e3))
    # signo lateral invertible
    assert offsets_punto_cardinal(4, D, B, derecha_es_eje3=False) == pytest.approx((0, -B / 2))
    # centroide fuera del centro de la caja (T, L, C): d = c - p
    assert offsets_punto_cardinal(8, D, B, centroide=(-0.1, 0.0)) == pytest.approx((-0.1 - D / 2, 0.0))


def test_errores_claros():
    with pytest.raises(ValueError, match="centro de cortante"):
        offsets_punto_cardinal(11, 0.6, 0.3)
    assert offsets_punto_cardinal(11, 0.6, 0.3, centro_cortante=(0.0, 0.05)) == pytest.approx((0.0, -0.05))
    with pytest.raises(ValueError, match="canto"):
        offsets_punto_cardinal(8, 0.0, 0.3)
    with pytest.raises(ValueError, match="ancho"):
        offsets_punto_cardinal(4, 0.6, 0.0)
    with pytest.raises(ValueError):
        offsets_punto_cardinal(12, 0.6, 0.3)


# ───────────────────── 2. voladizo contra SAP2000 24 ─────────────────────
RES = VAL / "sap_res.json"
FUE = VAL / "sap_fuerzas.json"
E, NU, BB, DD = 2.5e10, 0.2, 0.3, 0.5


def _voladizo(cp, transform=True):
    G = E / (2 * (1 + NU))
    ei = ElementInputs()
    ei.elasticities[0] = E; ei.poissons_ratios[0] = NU; ei.shear_moduli[0] = G; ei.areas[0] = BB * DD
    ei.moments_of_inertia_z[0] = BB * DD ** 3 / 12; ei.moments_of_inertia_y[0] = DD * BB ** 3 / 12
    ei.torsional_constants[0] = 0.229 * DD * BB ** 3
    asignar_punto_insercion(ei, 0, cp, D=DD, B=BB, transform=transform)
    ni = NodeInputs()
    ni.supports[0] = (True,) * 6
    ni.loads[1] = (1e5, 0, -1e5, 0, 0, 0)
    nodes, el = [(0, 0, 0), (4, 0, 0)], [[0, 1]]
    r = deform(nodes, el, ni, ei)
    return nodes, el, ei, r


@pytest.mark.skipif(not RES.exists(), reason="falta validation/insercion/sap_res.json")
@pytest.mark.parametrize("cp", [10, 8, 2])
def test_voladizo_con_restriccion_vs_sap2000(cp):
    sap = json.load(open(RES, encoding="utf-8"))[str(cp)]
    nodes, el, ei, r = _voladizo(cp)
    u = r.deformations[1]
    for a, b in ((u[0], sap["u"][0]), (u[2], sap["u"][2]), (u[4], sap["r"][1])):
        assert abs(a - b) <= 1e-9 * abs(b)
    f = json.load(open(FUE, encoding="utf-8")).get(str(cp))
    if f:
        M3 = analyze(nodes, el, ei, r).bendings_z[0]
        assert abs(abs(M3[0]) - abs(f["M3"][0])) <= 1e-9 * abs(f["M3"][0])      # SAP da el diagrama (signo opuesto en i)


# ───────────────────── 3. sin restriccion rigida ─────────────────────
def test_sin_restriccion_es_el_centroide_y_solo_geometrico():
    _, _, _, r10 = _voladizo(10)
    _, _, ei, r8 = _voladizo(8, transform=False)
    assert ei.insertion_offsets[0] == (-DD / 2, 0.0)
    for a, b in zip(r8.deformations[1], r10.deformations[1]):
        assert a == pytest.approx(b, abs=1e-15)
    r8t = _voladizo(8, transform=True)[3]
    assert abs(r8t.deformations[1][0] - r10.deformations[1][0]) > 1e-3        # con restriccion SI cambia (2.99e-3 vs 1.07e-4)
    ci, cj = posicion_centroide((0, 0, 0), (4, 0, 0), *ei.insertion_offsets[0])
    assert np.allclose(ci, (0, 0, -DD / 2)) and np.allclose(cj, (4, 0, -DD / 2))      # el eje dibujado baja D/2


# ───────────────────── 4. losa con vigas CP 8 por el .heks ─────────────────────
def _heks_losa(cp):
    Lx, H, Q, t, n = 4.0, 3.0, 5.0, 0.145, 4
    h = Lx / n
    N, idx = [], {}

    def nodo(x, y, z):
        k = (round(x, 4), round(y, 4), round(z, 4))
        if k not in idx:
            idx[k] = len(N) + 1
            N.append(k)
        return idx[k]
    cols = [(nodo(x, y, 0), nodo(x, y, H)) for x, y in ((0, 0), (Lx, 0), (Lx, Lx), (0, Lx))]
    vigas = []
    for i in range(n):
        for (x0, y0, x1, y1) in ((i * h, 0, (i + 1) * h, 0), (Lx, i * h, Lx, (i + 1) * h),
                                 (Lx - i * h, Lx, Lx - (i + 1) * h, Lx), (0, Lx - i * h, 0, Lx - (i + 1) * h)):
            vigas.append((nodo(x0, y0, H), nodo(x1, y1, H)))
    losas = [(nodo(i * h, j * h, H), nodo((i + 1) * h, j * h, H), nodo((i + 1) * h, (j + 1) * h, H),
              nodo(i * h, (j + 1) * h, H)) for i in range(n) for j in range(n)]
    E_, nu = 2.5e10 / 1e3, 0.2          # kN/m2
    L = [f"node {i + 1} {p[0]} {p[1]} {p[2]}" for i, p in enumerate(N)]
    fid = 0

    def tors(a, b):
        return a * b ** 3 * (1 / 3 - 0.21 * (b / a) * (1 - b ** 4 / (12 * a ** 4)))
    for a, b in cols:
        fid += 1
        L.append(f"frame {fid} {a} {b} {E_} {0.0625} {0.25 ** 4 / 12} {0.25 ** 4 / 12} {tors(0.25, 0.25)} {nu} 0 0.25 0.25")
    for a, b in vigas:
        fid += 1
        L.append(f"frame {fid} {a} {b} {E_} {0.08} {0.4 * 0.2 ** 3 / 12} {0.2 * 0.4 ** 3 / 12} {tors(0.4, 0.2)} {nu} 0 0.4 0.2")
        if cp:
            L.append(f"e2klinea {fid} CARDINALPT {cp}")
    for k, q in enumerate(losas):
        L.append(f"shell {k + 1} {q[0]} {q[1]} {q[2]} {q[3]} {t} {E_} {-Q} 0")
        L.append(f"shelltype {k + 1} thin")
    for a, _ in cols:
        L.append(f"support {a} fixed")
    return "\n".join(L) + "\nsolve\n"


LOSA = VAL / "sap_losa.json"


@pytest.mark.skipif(not LOSA.exists(), reason="falta sap_losa.json")
def test_losa_vigas_cp8_vs_sap2000_por_heks(tmp_path):
    f = tmp_path / "l.heks"
    f.write_text(_heks_losa(8), encoding="utf-8")
    m = leer_heks(str(f))
    assert not m.errores
    ins = m.element_inputs.insertion_offsets
    assert len(ins) == 16 and all(v == (-0.2, 0.0) for v in ins.values())
    res = resolver_heks(m)
    sap = json.load(open(LOSA, encoding="utf-8"))
    mx = max(abs(v[2]) for v in sap.values())
    dmax = 0.0
    for k, s in sap.items():
        x, y, z = map(float, k.split(","))
        i = next(j for j, p in enumerate(m.nodes) if abs(p[0] - x) < 1e-6 and abs(p[1] - y) < 1e-6 and abs(p[2] - z) < 1e-6)
        dmax = max(dmax, abs(res.deformations[i][2] - s[2]))
    assert dmax / mx < 1e-5, dmax / mx


# ───────────────────── 5. Python = motor TS/C++ ─────────────────────
def _comparar_ts(txt, tmp_path):
    f = tmp_path / "m.heks"
    f.write_text(txt, encoding="utf-8")
    res = resolver_heks(leer_heks(str(f)))
    ts = motor_ts(txt)
    mx = max(abs(v) for d in ts["deformations"].values() for v in d)
    dif = 0.0
    for i, d in ts["deformations"].items():
        dif = max(dif, max(abs(a - b) for a, b in zip(res.deformations[int(i)], d)))
    assert mx > 0
    return dif / mx


def _heks_viga(cp, extra=""):
    return f"""node 1 0 0 0
node 2 5 0 0
node 3 5 4 0
frame 1 1 2 25e6 0.18 0.0013 0.0054 0.0036 0.2 0 0.6 0.3
frame 2 2 3 25e6 0.18 0.0013 0.0054 0.0036 0.2 0 0.6 0.3
e2klinea 1 CARDINALPT {cp} {extra}
e2klinea 2 CARDINALPT {cp} {extra}
support 1 fixed
load 3 20 -30 -100 5 8 10
load 2 0 0 -50 0 0 0
solve
"""


@pytest.mark.parametrize("cp", [8, 2])
def test_python_igual_ts_con_restriccion(tmp_path, cp):
    assert _comparar_ts(_heks_viga(cp), tmp_path) <= 1e-6


def test_cardinal_cambia_la_respuesta(tmp_path):
    f = tmp_path / "a.heks"
    f.write_text(_heks_viga(8), encoding="utf-8")
    g = tmp_path / "b.heks"
    g.write_text(_heks_viga(10), encoding="utf-8")
    a = resolver_heks(leer_heks(str(f))).deformations[2]
    b = resolver_heks(leer_heks(str(g))).deformations[2]
    assert max(abs(x - y) for x, y in zip(a, b)) > 1e-4


def test_sin_restriccion_por_heks_es_cp10(tmp_path):
    f = tmp_path / "a.heks"
    f.write_text(_heks_viga(8, 'TRANSFORMSTIFF "No"'), encoding="utf-8")
    g = tmp_path / "b.heks"
    g.write_text(_heks_viga(10), encoding="utf-8")
    a = resolver_heks(leer_heks(str(f))).deformations[2]
    b = resolver_heks(leer_heks(str(g))).deformations[2]
    assert max(abs(x - y) for x, y in zip(a, b)) < 1e-14
