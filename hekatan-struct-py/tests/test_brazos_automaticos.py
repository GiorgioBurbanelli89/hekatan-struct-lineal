# -*- coding: utf-8 -*-
"""BRAZOS RIGIDOS por defecto como ETABS (brazos.py + `rigidzone auto` / `comportamiento` del lector .heks).

La LEY del brazo (l = rz*off, Lf, EA/L con L completa, K = R^T K(Lf) R) ya la miden test_end_offsets_etabs.py y
test_brazos_portico_etabs.py contra ETABS 22.6. Aqui se mide la COLOCACION automatica:

  - viga: medio lado de columna por extremo con columna; columna: el canto ENTERO de la viga arriba, 0 abajo
  - `rigidzone auto f` = los mismos `endoffset` escritos a mano; sin D B: el rectangulo equivalente de A e I
  - Python = motor TS/C++ (cliModeler) a <= 1e-6 relativo, RZ = 0, 0.5 y 1
  - la masa NO cuenta el tramo dentro del brazo en las VIGAS (ETABS), si en las columnas
  - `comportamiento etabs` = `rigidzone auto 0`; `comportamiento sap2000` = sin brazos
"""
import numpy as np
import pytest

from hekatan_struct import ElementInputs
from hekatan_struct.brazos import aplicar_brazos_automaticos
from hekatan_struct.heks import leer_heks, resolver_heks
from hekatan_struct.solver import _assemble_M_lumped
from tests._motor_ts import motor_ts

E, NU = 25e6, 0.2
COL = dict(A=0.16, I=0.4 ** 4 / 12, J=0.0036, D=0.4, B=0.4)
VIG = dict(A=0.15, I22=0.5 * 0.3 ** 3 / 12, I33=0.3 * 0.5 ** 3 / 12, J=0.0028, D=0.5, B=0.3)


def heks(directiva="", manual_rz=None, dims=True):
    dc = f" {COL['D']} {COL['B']}" if dims else ""
    dv = f" {VIG['D']} {VIG['B']}" if dims else ""
    L = ["node 1 0 0 0", "node 2 6 0 0", "node 3 0 0 3", "node 4 6 0 3",
         f"frame 1 1 3 {E} {COL['A']} {COL['I']} {COL['I']} {COL['J']} {NU} 2.45{dc}",
         f"frame 2 2 4 {E} {COL['A']} {COL['I']} {COL['I']} {COL['J']} {NU} 2.45{dc}",
         f"frame 3 3 4 {E} {VIG['A']} {VIG['I22']} {VIG['I33']} {VIG['J']} {NU} 2.45{dv}"]
    if manual_rz is not None:
        L += [f"endoffset 1 0 0.5 {manual_rz}", f"endoffset 2 0 0.5 {manual_rz}", f"endoffset 3 0.2 0.2 {manual_rz}"]
    if directiva:
        L.append(directiva)
    L += ["support 1 fixed", "support 2 fixed", "load 3 50 0 -100 0 0 0", "load 4 0 30 -100 0 20 0", "solve"]
    return "\n".join(L) + "\n"


def _res(txt, tmp_path):
    f = tmp_path / "m.heks"
    f.write_text(txt, encoding="utf-8")
    m = leer_heks(str(f))
    return m, resolver_heks(m)


def _u(res):
    return np.array([res.deformations[n][k] for n in (2, 3) for k in range(6)])


def _rel(a, b):
    return float(np.max(np.abs(a - b)) / np.max(np.abs(b)))


@pytest.mark.parametrize("rz", [0.0, 0.5, 1.0])
def test_auto_igual_endoffset_a_mano(tmp_path, rz):
    ma, ra = _res(heks(f"rigidzone auto {rz}"), tmp_path)
    mm, rm = _res(heks(manual_rz=rz), tmp_path)
    assert {k: tuple(round(x, 9) for x in v) for k, v in ma.element_inputs.end_offsets.items()} == {
        0: (0.0, 0.5, rz), 1: (0.0, 0.5, rz), 2: (0.2, 0.2, rz)}
    assert _rel(_u(ra), _u(rm)) < 1e-12


def test_colocacion_regla_etabs(tmp_path):
    m, _ = _res(heks("rigidzone auto 0"), tmp_path)
    eo = m.element_inputs.end_offsets
    # columnas: arriba (J) el canto entero de la viga (0.5), abajo 0; viga: medio lado de columna (0.4/2) por extremo
    assert eo[0] == pytest.approx((0.0, 0.5, 0.0)) and eo[1] == pytest.approx((0.0, 0.5, 0.0))
    assert eo[2] == pytest.approx((0.2, 0.2, 0.0))


def test_sin_dims_usa_rectangulo_equivalente(tmp_path):
    ma, ra = _res(heks("rigidzone auto 1", dims=False), tmp_path)
    mm, rm = _res(heks(manual_rz=1.0), tmp_path)
    assert _rel(_u(ra), _u(rm)) < 1e-9          # h = sqrt(12 I33/A): col 0.4, viga 0.5


def test_rigidzone_off_manda_sobre_auto(tmp_path):
    m, _ = _res(heks("rigidzone auto 1\nrigidzone off"), tmp_path)
    assert m.element_inputs.end_offsets == {}


@pytest.mark.parametrize("rz", [0.0, 0.5, 1.0])
def test_python_igual_ts(tmp_path, rz):
    txt = heks(f"rigidzone auto {rz}")
    _, res = _res(txt, tmp_path)
    ts = motor_ts(txt)
    u_ts = np.array([ts["deformations"][str(n - 1)][k] for n in (2, 3) for k in range(6)])
    # el nudo de Python (id 2,3) es el indice 1,2; el TS ordena igual
    u_py = np.array([res.deformations[n - 1][k] for n in (2, 3) for k in range(6)])
    assert _rel(u_py, u_ts) <= 1e-6


def test_masa_no_cuenta_el_brazo_en_vigas(tmp_path):
    m0, _ = _res(heks(), tmp_path)
    m1, _ = _res(heks("rigidzone auto 0"), tmp_path)
    M0 = _assemble_M_lumped(m0.nodes, m0.elements, m0.element_inputs)
    M1 = _assemble_M_lumped(m1.nodes, m1.elements, m1.element_inputs)
    esperado = VIG["A"] * 0.4 * 2.45                         # la viga pierde 0.2 + 0.2 m de luz
    assert (M0.sum() - M1.sum()) / 3 == pytest.approx(esperado, rel=1e-12)
    # las columnas pesan por la L completa (el canto de la viga NO se descuenta)
    assert M1[6 * 0 + 2] == pytest.approx(M0[6 * 0 + 2], rel=1e-12)      # nudo 1: base de la columna, sin viga
    assert M1[6 * 2 + 2] == pytest.approx(M0[6 * 2 + 2] - VIG["A"] * 0.4 * 2.45 / 2, rel=1e-12)


def test_comportamiento(tmp_path):
    me, re_ = _res(heks("comportamiento etabs"), tmp_path)
    ma, ra = _res(heks("rigidzone auto 0"), tmp_path)
    assert me.element_inputs.end_offsets == ma.element_inputs.end_offsets and me.element_inputs.etabs_wall_joint
    ms, _ = _res(heks("comportamiento sap2000\nrigidzone auto 1"), tmp_path)
    assert ms.element_inputs.end_offsets == {} and not ms.element_inputs.etabs_wall_joint


def test_api_directa():
    nodes = [(0, 0, 0), (6, 0, 0), (0, 0, 3), (6, 0, 3)]
    el = [[0, 2], [1, 3], [2, 3]]
    ei = ElementInputs()
    for k, (A, I33, I22) in enumerate([(0.16, 0.4 ** 4 / 12, 0.4 ** 4 / 12)] * 2 + [(0.15, VIG["I33"], VIG["I22"])]):
        ei.areas[k], ei.moments_of_inertia_z[k], ei.moments_of_inertia_y[k] = A, I33, I22
    n = aplicar_brazos_automaticos(nodes, el, ei, rz=0.5, cantos={2: 0.5}, anchos={2: 0.3})
    assert n == 3 and ei.end_offsets[2] == pytest.approx((0.2, 0.2, 0.5))
