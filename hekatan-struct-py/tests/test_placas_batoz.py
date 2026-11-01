# -*- coding: utf-8 -*-
"""Placas de Batoz (DKT, DKQ) y triángulo grueso de CSI en Python: los números de las hojas de Hekatan LISP
(`hekatan-school/PLACAS_BATOZ/*.lisp`, ejemplos 152-154), de SAP2000 24 / ETABS 22 y del solver de Struct (WASM/C++).

E = 24850000 kN/m², ν = 0.2, t = 0.1 m; campo de comparación w = x³/6 + x·y²/2 (hojas, sección «Comparación»).
"""
import os, shutil, subprocess, sys, tempfile
import numpy as np
import pytest

from hekatan_struct.placas import (angulo_ejes_locales, campo, campo_patch, k_dkq, k_dkt, k_grueso, main, momentos, rigidez)

E, NU, T = 24850000.0, 0.2, 0.1
TRI = [(0, 0), (2, 0.5), (0.5, 1.5)]
TRAP = [(0, 0), (4, 0), (3.2, 2.5), (0.6, 2.2)]
QUAD = [(0, 0), (2, 0.2), (2.2, 1.8), (0.1, 1.6)]
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))        # hekatan-struct


def diag3(K): return [K[i, i] for i in range(3)]


def cerca(a, b, tol=1e-6): np.testing.assert_allclose(a, b, rtol=tol, atol=tol)


# ─── K ───────────────────────────────────────────────────────────────────────────────────────
def test_k_dkt_diagonal():
    cerca(diag3(k_dkt(TRI, E, NU, T)), [5751.904064, 3050.031595, 1966.133038])


def test_k_dkq_diagonal_en_ejes_locales_del_solver():
    # globales: 3158.43936 4285.115397 2166.829157; en los ejes del solver (v01 + v32): los de las hojas de Struct
    cerca(diag3(rigidez("dkq", TRAP, E, NU, T, ejes_locales=True)), [3158.439360, 4178.283998, 2273.660556])
    assert abs(angulo_ejes_locales("dkq", TRAP) - np.arctan2(0.3, 6.6)) < 1e-12


def test_k_grueso_diagonal():
    cerca(diag3(k_grueso(TRI, E, NU, T)), [3709.161900, 2695.768022, 1874.511671])


@pytest.mark.parametrize("tipo,P,nulos", [("dkt", TRI, 3), ("dkq", QUAD, 3), ("thick", TRI, 3)])
def test_tres_modos_de_energia_nula(tipo, P, nulos):
    K = rigidez(tipo, P, E, NU, T); w = np.linalg.eigvalsh((K + K.T) / 2)
    assert np.allclose(K, K.T, atol=1e-6 * abs(K).max())
    assert np.sum(np.abs(w) < 1e-9 * w.max()) == nulos


@pytest.mark.parametrize("tipo,P", [("dkt", TRI), ("dkq", QUAD), ("thick", TRI)])
def test_traslacion_y_giro_rigidos_sin_fuerza(tipo, P):
    K = rigidez(tipo, P, E, NU, T); n = len(P)
    tras = np.tile([1.0, 0, 0], n)
    giro = np.array([v for x, y in P for v in (x, 0.0, -1.0)])      # w = x : giro rígido
    assert np.abs(K @ tras).max() < 1e-7 * abs(K).max()
    assert np.abs(K @ giro).max() < 1e-7 * abs(K).max()


# ─── momentos y cortante (signo CSI) contra SAP2000 / ETABS ────────────────────────────────────────
def test_momentos_dkt_vs_sap2000():
    M = momentos("dkt", TRI, E, NU, T, campo_patch(TRI))["M"]
    cerca(M, [[-611.491059, -740.226019, 836.777239], [5144.695506, 4237.836331, 700.908084],
              [455.257503, 1573.941943, 2153.497718]], 1e-6)


def test_momentos_dkq_vs_sap2000():
    M = momentos("dkq", QUAD, E, NU, T, campo_patch(QUAD))["M"]
    cerca(M, [[-221.352005, -161.569777, 773.527219], [4990.463335, 4961.900813, 938.655492],
              [5922.245888, 5968.54638, 2329.722025], [417.801978, 379.808169, 2149.254494]], 1e-6)


def test_momentos_y_cortante_grueso_vs_sap2000():
    r = momentos("thick", TRI, E, NU, T, campo_patch(TRI))
    cerca(r["M"], [[-73.268026, -923.355267, 494.199195], [5627.313614, 3070.332005, 166.099293],
                   [946.723825, 1412.268053, 1751.751702]], 1e-6)
    cerca(r["V"], [-2350.930823, -351.895018], 1e-6)               # V13, V23 (SAP2000)


def test_reacciones_grueso_vs_sap2000():
    f = k_grueso(TRI, E, NU, T) @ campo_patch(TRI)
    ref = [1439.386675, -528.210803, 852.730577, -1675.224363, -57.306496, -2838.572066, 235.837688, 1069.372950, -1246.688392]
    assert 100 * np.linalg.norm(f - ref) / np.linalg.norm(ref) < 1e-5            # %


def test_reacciones_dkt_dkq_vs_sap2000():
    f = k_dkt(TRI, E, NU, T) @ campo_patch(TRI)
    ref = [3644.278276, -82.364302, -555.595142, -2513.109557, 642.343285, -3290.592954, -1131.168719, 2393.328875, -1745.615377]
    assert 100 * np.linalg.norm(f - ref) / np.linalg.norm(ref) < 1e-5
    f = k_dkq(QUAD, E, NU, T) @ campo_patch(QUAD)
    ref = [5503.829765, -751.808244, -316.323307, -4502.797955, -3135.217694, -4287.655588, 398.404973, 4136.870944,
           -3873.509261, -1399.436783, 2172.684486, 208.439509]
    assert 100 * np.linalg.norm(f - ref) / np.linalg.norm(ref) < 1e-5


def test_campo_en_los_nudos_igual_a_los_momentos_nodales():
    for tipo, P in (("dkt", TRI), ("thick", TRI)):
        u = campo_patch(P); x, y, M = campo(tipo, P, E, NU, T, u, n=4)
        Mn = momentos(tipo, P, E, NU, T, u)["M"]
        for k, p in enumerate(P):
            i = int(np.argmin((x - p[0]) ** 2 + (y - p[1]) ** 2)); cerca(M[i], Mn[k], 1e-9)


def test_cli_json_y_png(capsys, tmp_path):
    png = tmp_path / "m.png"
    assert main(["--tipo", "thick", "--nodos", "0", "0", "2", "0.5", "0.5", "1.5", "--png", str(png), "--json"]) == 0
    import json
    d = json.loads(capsys.readouterr().out)
    cerca(d["V"], [-2350.930823, -351.895018], 1e-6)
    assert png.exists() and png.stat().st_size > 5000


# ─── el solver de Struct (WASM/C++) como árbitro: misma K, otra implementación ───────────────────────
@pytest.mark.skipif(shutil.which("node") is None or not os.path.exists(os.path.join(RAIZ, "cli", "_hojas_placa_verif.mjs")),
                    reason="hace falta node y hekatan-struct/cli")
def test_k_igual_a_la_del_wasm_de_struct():
    hp = tempfile.mkdtemp(prefix="hk_placas_")
    r = subprocess.run(["node", os.path.join("cli", "_hojas_placa_verif.mjs")], cwd=RAIZ, env=dict(os.environ, HP=hp),
                       capture_output=True, text=True, timeout=300)
    if r.returncode != 0:
        pytest.skip("el verificador de Struct no corrió: " + r.stderr[-200:])
    d = {l.split()[0]: [float(v) for v in l.split(":")[1].split()] for l in r.stdout.splitlines() if "diag K solver" in l}
    cerca(diag3(k_dkt(TRI, E, NU, T)), d["dkt"], 1e-8)
    cerca(diag3(rigidez("dkq", TRAP, E, NU, T, ejes_locales=True)), d["dkq"], 1e-8)
    cerca(diag3(k_grueso(TRI, E, NU, T)), d["thick"], 1e-8)
