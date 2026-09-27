"""BRAZOS RÍGIDOS en un pórtico: el motor de Python contra ETABS 22.6 (OAPI).

Misma referencia que el test del WASM (`tests/casos/brazos_portico_csi.mjs`):
`tests/datos/brazos_portico_etabs.json`, sacada con `validation/brazos-rigidos/ref_portico_csi.py`.
Pórtico de un vano, brazos en viga y columnas, RZ = 0, 0.5 y 1; cargas nodales y de vano.
"""
import json
import os

import pytest

from hekatan_struct.heks import leer_heks, resolver_heks

RUTA = os.path.join(os.path.dirname(__file__), "..", "..", "tests", "datos", "brazos_portico_etabs.json")
REF = json.load(open(RUTA, encoding="utf-8")) if os.path.exists(RUTA) else None
pytestmark = pytest.mark.skipif(REF is None, reason="falta la referencia de ETABS")


def _heks(rz, pat):
    c, v = REF["secciones"]["COL"], REF["secciones"]["VIG"]
    L = ["node %s %g %g %g" % ((k,) + tuple(p)) for k, p in REF["nudos"].items()]
    fr = "frame %d %d %d %r %r %r %r %r %r 0"
    L.append(fr % (1, 1, 3, REF["E"], c["Area"], c["I22"], c["I33"], c["Torsion"], REF["nu"]))
    L.append(fr % (2, 2, 4, REF["E"], c["Area"], c["I22"], c["I33"], c["Torsion"], REF["nu"]))
    L.append(fr % (3, 3, 4, REF["E"], v["Area"], v["I22"], v["I33"], v["Torsion"], REF["nu"]))
    L += ["as 1 %r %r" % (c["As2"], c["As3"]), "as 2 %r %r" % (c["As2"], c["As3"]),
          "as 3 %r %r" % (v["As2"], v["As3"])]
    L += ["endoffset 1 0 %r %r" % (REF["off_col"], rz), "endoffset 2 0 %r %r" % (REF["off_col"], rz),
          "endoffset 3 %r %r %r" % (REF["off_viga"], REF["off_viga"], rz)]
    L += ["support 1 fixed", "support 2 fixed"]
    if pat == "W":
        L.append("frameload 3 0 0 %r" % (-REF["W"]))
    else:
        for k, f in REF["cargas"][pat].items():
            L.append("load %s %s" % (k, " ".join(repr(x) for x in f)))
    return "\n".join(L) + "\n"


CASOS = [(c["rz"], pat) for c in (REF["casos"] if REF else []) for pat in c["despl"]]


@pytest.mark.parametrize("rz,pat", CASOS, ids=["rz%s_%s" % c for c in CASOS])
def test_desplazamientos_contra_etabs(tmp_path, rz, pat):
    ruta = tmp_path / "portico.heks"
    ruta.write_text(_heks(rz, pat), encoding="utf-8")
    m = leer_heks(str(ruta))
    res = resolver_heks(m)
    caso = next(c for c in REF["casos"] if c["rz"] == rz)
    ids = sorted(int(k) for k in REF["nudos"])
    mx = max(abs(x) for k in ("3", "4") for x in caso["despl"][pat][k])
    for k in ("3", "4"):
        h = res.deformations[ids.index(int(k))]
        for a, b in zip(h, caso["despl"][pat][k]):
            assert abs(a - b) / mx < 1e-4, (rz, pat, k, a, b)


@pytest.mark.parametrize("orden,rz_etabs", [("rigidzone 0", 0.0), ("rigidzone 0.5", 0.5), ("rigidzone off", 0.0)])
def test_rigidzone_manda_sobre_cada_barra(tmp_path, orden, rz_etabs):
    """Los `endoffset` van escritos con rz = 1; `rigidzone` pone el factor de todo el modelo."""
    ruta = tmp_path / "portico.heks"
    ruta.write_text(_heks(1.0, "LAT") + orden + "\n", encoding="utf-8")
    res = resolver_heks(leer_heks(str(ruta)))
    caso = next(c for c in REF["casos"] if c["rz"] == rz_etabs)
    ux = res.deformations[2][0]
    assert ux == pytest.approx(caso["despl"]["LAT"]["3"][0], rel=1e-4)
