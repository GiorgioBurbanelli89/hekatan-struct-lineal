# -*- coding: utf-8 -*-
"""Cubierta de membrana al estilo ETABS: `hekatan_struct.cubierta.membrana_deck_etabs`.

  - un paño de 4x4 m sobre dos vigas de borde con nudos cada metro: se PARTE en 4 paños 1x4 (sin inventar
    nudos) y su peso + carga (ONEWAYLOADDIST "Yes") van a las vigas de borde: suma de fuerzas = q*A
  - la API da las MISMAS cargas nodales que el lector `.heks` con `deck etabs oneway` (1e-12)
  - y la flecha que resuelve Python con ellas = motor TS/C++ (cliModeler) a <= 1e-6 relativo
  - la cubierta REAL del mercado (mercado.e2k, planta N7 COL, AREA ... FLOOR "Cubierta metalica": membrana de
    4 mm, ONEWAYLOADDIST "Yes", Dead 0.392266 kN/m2): conservacion de la carga en un subconjunto
"""
import os

import pytest

from hekatan_struct.cubierta import cubierta_de_e2k, membrana_deck_etabs, partir_barras_en_nudos
from hekatan_struct.heks import leer_heks, resolver_heks
from tests._motor_ts import motor_ts

G = 9.80665
ESP, RHO, QD = 0.004, 7.85, 0.392266            # mercado: Cubierta metalica 4 mm, A36, Dead 0.392266 kN/m2
Q_TOTAL = QD + ESP * RHO * G                     # kN/m2 hacia abajo (carga + peso propio)


def _modelo(n=4, ancho=4.0, largo=4.0):
    nodos = {}
    for i in range(n + 1):
        nodos[i + 1] = (i * ancho / n, 0.0, 10.0)
        nodos[n + 2 + i] = (i * ancho / n, largo, 10.0)
    # vigas de borde SIN partir (una sola barra por lado: la API las parte en los nudos intermedios)
    barras = [(1, 1, n + 1), (2, n + 2, 2 * n + 2)]
    # mercado: borde 0->1 a lo largo de y; el paño es P0=(0,largo) P1=(0,0) P2=(w,0) P3=(w,largo)
    pano = (1, n + 2, 1, n + 1, 2 * n + 2)
    return nodos, barras, [pano]


def test_parte_y_conserva_la_carga():
    nodos, barras, panos = _modelo()
    c = membrana_deck_etabs(nodos, barras, panos, espesor=ESP, rho=RHO, carga_gravedad=QD, un_sentido=True)
    assert c.n_panos_origen == 1 and len(c.panos) == 4          # partido en los nudos comunes a dos bordes opuestos
    assert len(c.barras) == 8                                    # 2 vigas partidas en 4 trozos cada una
    assert c.panos_a_barras == {p["id"] for p in c.panos}
    Fz = sum(v[2] for v in c.cargas.values())
    assert Fz == pytest.approx(-Q_TOTAL * 16.0, rel=1e-3)        # el muestreo 200x200 da 1e-3 del area
    # one-way sobre y: la carga va SOLO a las dos vigas (y = 0 e y = 4), mitad y mitad
    for nid, v in c.cargas.items():
        assert nodos[nid][1] in (0.0, 4.0)
    sup = sum(v[2] for n, v in c.cargas.items() if nodos[n][1] == 0.0)
    inf = sum(v[2] for n, v in c.cargas.items() if nodos[n][1] == 4.0)
    assert sup == pytest.approx(inf, rel=1e-9)


def test_dos_sentidos_manda_tambien_a_los_bordes_cortos():
    nodos, barras, panos = _modelo(n=1, ancho=4.0, largo=4.0)
    barras += [(3, 1, 3), (4, 2, 4)]
    c = membrana_deck_etabs(nodos, barras, panos, espesor=ESP, rho=RHO, carga_gravedad=QD, un_sentido=False)
    assert sum(v[2] for v in c.cargas.values()) == pytest.approx(-Q_TOTAL * 16.0, rel=1e-3)
    assert len({round(nodos[n][0], 3) for n in c.cargas}) == 2


def test_partir_barras():
    nodos = {1: (0, 0, 0), 2: (1, 0, 0), 3: (3, 0, 0), 4: (4, 0, 0)}
    b = partir_barras_en_nudos(nodos, [{"id": 1, "nI": 1, "nJ": 4}])
    assert [(x["nI"], x["nJ"]) for x in b] == [(1, 2), (2, 3), (3, 4)] and b[1]["padre"] == 1


# ───────── la misma cubierta como .heks: API = lector, Python = TS ─────────
def _heks():
    """Paño de 4x4 de membrana (un solo `shell`) sobre vigas de borde con nudos cada metro, `deck etabs oneway`."""
    L = []
    for i in range(5):
        L.append(f"node {i + 1} {i} 0 10")
        L.append(f"node {i + 6} {i} 4 10")
    L.append("node 11 0 0 0")
    L.append("node 12 4 0 0")
    L.append("node 13 0 4 0")
    L.append("node 14 4 4 0")
    fr = "frame %d %d %d 2e8 0.0016 1.1e-6 1.1e-6 2e-6 0.3 0"
    k = 0
    for i in range(4):
        k += 1; L.append(fr % (k, i + 1, i + 2))
        k += 1; L.append(fr % (k, i + 6, i + 7))
    for a, b in ((11, 1), (12, 5), (13, 6), (14, 10)):
        k += 1; L.append(fr % (k, a, b))
    for n in (11, 12, 13, 14):
        L.append(f"support {n} fixed")
    # P0=(0,4) P1=(0,0) P2=(4,0) P3=(4,4): borde 0->1 a lo largo de y (vano en y)
    L.append(f"shell 1 6 1 5 10 {ESP} 2.1e8 {-QD} {RHO}")
    L.append("shellmod 1 1 1 1 0 0 0 1 1")
    L.append("selfweight 1")
    L.append("deck etabs oneway")
    L.append("solve")
    return "\n".join(L) + "\n"


def test_api_igual_lector_heks(tmp_path):
    f = tmp_path / "c.heks"
    f.write_text(_heks(), encoding="utf-8")
    m = leer_heks(str(f))
    assert not m.errores
    assert sum(1 for e in m.elements if len(e) == 4) == 4
    nodos = {m.node_id[i]: p for i, p in enumerate(m.nodes)}
    # la API con las mismas barras y el mismo paño
    barras = [(m.frame_id[k], m.node_id[e[0]], m.node_id[e[1]]) for k, e in enumerate(m.elements) if len(e) == 2]
    c = membrana_deck_etabs(nodos, barras, [(1, 6, 1, 5, 10)], espesor=ESP, rho=RHO, carga_gravedad=QD,
                            un_sentido=True, partir_barras=False)
    assert len(c.panos) == 4
    dif = 0.0
    for idx, nid in enumerate(m.node_id):
        a = m.node_inputs.loads.get(idx, (0.0,) * 6)
        b = c.cargas.get(nid, [0.0] * 6)
        dif = max(dif, max(abs(x - y) for x, y in zip(a, b)))
    assert dif < 1e-12


def test_python_igual_ts(tmp_path):
    txt = _heks()
    f = tmp_path / "c.heks"
    f.write_text(txt, encoding="utf-8")
    res = resolver_heks(leer_heks(str(f)))
    ts = motor_ts(txt)
    mx = max(abs(v) for d in ts["deformations"].values() for v in d)
    dif = max(abs(a - b) for i, d in ts["deformations"].items() for a, b in zip(res.deformations[int(i)], d))
    assert mx > 1e-6 and dif / mx <= 1e-6


# ───────── la cubierta real ─────────
E2K = r"C:\ETABS\mercado\mercado.e2k"


@pytest.mark.skipif(not os.path.exists(E2K), reason="falta C:/ETABS/mercado/mercado.e2k")
def test_cubierta_real_mercado_conserva_la_carga():
    d = cubierta_de_e2k(E2K, "N7 COL", seccion="Cubierta metalica SOBRE CUBIERTA", areas_sel={f"F{k}" for k in range(145, 153)})
    live, meta = d.pop("cargas_live"), d.pop("meta")
    assert d["espesor"] == pytest.approx(0.004) and d["carga_gravedad"] == pytest.approx(0.392266, rel=1e-6)
    assert d["un_sentido"] and meta["cota"] == pytest.approx(14.14) and len(d["panos"]) == 8
    c = membrana_deck_etabs(**d)
    area = 0.0                                # area real de los 8 paños (cuadrilateros planos)
    for p in d["panos"]:
        P = [d["nodos"][i] for i in p[1:]]
        area += 0.5 * abs((P[0][0] - P[2][0]) * (P[1][1] - P[3][1]) - (P[1][0] - P[3][0]) * (P[0][1] - P[2][1]))
    Fz = sum(v[2] for v in c.cargas.values())
    assert Fz == pytest.approx(-Q_TOTAL * area, rel=2e-3)
