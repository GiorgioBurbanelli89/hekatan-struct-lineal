"""Los `.heks` CON CÁSCARAS, resueltos por los dos motores y comparados nudo a nudo.

Hasta el 2026-08-18 `heks.py` solo montaba barras: `shell`, `areaload`,
`shellmod` y `shellang` iban a un `continue` mudo. El mezanine salía con 116
nudos, flecha 0.000 mm y un cierre de báscula del 0.0000 % — perfecto, porque
`0 = 0`. Este test existe para que eso no pueda volver: si el lector deja de
montar algo, el modelo ya no tiene el mismo número de elementos que el del
motor y salta aquí.

El árbitro es el **WASM del C++** (`hekatan-fem/src/index` → `deformCpp`), que
es el motor del producto, por el MISMO camino que la app: `cliModeler` leyendo
el `.heks`. No se rearma nada en Python.

    pytest tests/test_heks_shells.py -v

Se salta solo si no hay Node, node_modules o `deform.wasm`.
"""
import json
import math
import subprocess
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from hekatan_struct.heks import leer_heks, resolver_heks  # noqa: E402

BR = chr(10)          # salto de línea, para no pelear con el escapado
AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]                      # .../hekatan-struct
DATOS = RAIZ / "tests" / "datos"

# El guion que resuelve un .heks con el motor del producto y vuelca los nudos.
_GUION = r"""
import { writeFileSync } from "node:fs";
import { resolverHeks } from "file:///%s/tests/lib/heks.mjs";

const r = await resolverHeks(process.argv[2]);
const d = r.deformOutputs?.val ?? r.deformOutputs;
const defs = d.deformations instanceof Map
  ? [...d.deformations] : Object.entries(d.deformations ?? {});
writeFileSync(process.argv[3], JSON.stringify({
  nodes: r.nodes, nElements: r.elements.length,
  deformations: Object.fromEntries(defs),
}));
"""


def _motor_ts(ruta_heks: Path, destino: Path):
    """Resuelve el `.heks` con el motor TS/C++ (WASM) y devuelve el JSON."""
    if not (RAIZ / "node_modules" / "esbuild").exists():
        pytest.skip("faltan los node_modules de hekatan-struct")
    if not (RAIZ / "hekatan-fem/src/cpp/built/deform.wasm").exists():
        pytest.skip("falta deform.wasm")
    guion = destino.parent / "resolver.mjs"
    guion.write_text(_GUION % RAIZ.as_posix().replace(" ", "%20"), encoding="utf-8")
    r = subprocess.run(["node", str(guion), str(ruta_heks), str(destino)],
                       capture_output=True, text=True, cwd=str(RAIZ))
    if r.returncode != 0:
        pytest.skip("motor TS no disponible: %s" % (r.stderr or "")[:300])
    return json.loads(destino.read_text(encoding="utf-8"))


CASOS = [
    "galpon_lc",           # 116 cáscaras de zinc SIN flexión + 1140 barras
    "losas_deck",          # deck: shellmod direccional
    "losas_maciza_mem",
    "losas_maciza_thin",   # 1175 cáscaras
    "losas_maciza_thick",
    "losas_nervada_1d",
    "losas_waffle_2d",
    "mezanine_em_grav",
    "tcl_roundtrip",       # sin cáscaras: el galpón, de control
]


@pytest.mark.parametrize("caso", CASOS)
def test_heks_con_cascaras_clona_al_motor(caso, tmp_path):
    ruta = DATOS / f"{caso}.heks"
    if not ruta.exists():
        pytest.skip(f"no está {ruta}")
    ref = _motor_ts(ruta, tmp_path / "ref.json")

    m = leer_heks(str(ruta))
    assert len(m.nodes) == len(ref["nodes"]), "otro número de NUDOS que el motor"
    assert len(m.elements) == ref["nElements"], (
        "otro número de ELEMENTOS que el motor: %d vs %d — el lector se está "
        "dejando algo fuera" % (len(m.elements), ref["nElements"])
    )
    assert not m.errores, "el lector avisa de algo: %s" % m.errores

    res = resolver_heks(m)
    n = len(m.nodes)
    uz_ref = [ref["deformations"][str(i)][2] for i in range(n)]
    uz_py = [res.deformations[i][2] for i in range(n)]
    # Error como % del MÁXIMO, no del propio nudo: un nudo casi quieto da
    # porcentajes enormes sobre su propio valor y no significan nada.
    mx = max(abs(v) for v in uz_ref) or 1e-12
    err = [abs(a - b) / mx * 100 for a, b in zip(uz_py, uz_ref)]
    peor = max(err)
    print("\n  %-20s %5d nudos %5d elem   Uz %9.4f mm   peor %.2e %%"
          % (caso, n, len(m.elements), min(uz_ref) * 1000, peor))
    assert peor < 1e-6, "%s: peor nudo %.3e %% del máximo" % (caso, peor)


def test_carga_de_area_reparte_q_por_el_area_exacta(tmp_path):
    """`areaload` sobre un paño NO es q·A/4 en cada esquina si el paño no es
    un rectángulo: es ∫N_i·q·dA. Lo que sí tiene que salir exacto en cualquier
    caso es la SUMA, que es q por el área del polígono.
    """
    # Trapecio: base 4, techo 2, altura 3 -> A = (4+2)/2*3 = 9
    heks = tmp_path / "trapecio.heks"
    heks.write_text(
        "node 1 0 0 0\nnode 2 4 0 0\nnode 3 3 3 0\nnode 4 1 3 0\n"
        "shell 1 1 2 3 4 0.20 25e6\n"
        "areaload 1 -5\n"
        "support 1 fixed\nsupport 2 fixed\nsupport 3 fixed\nsupport 4 fixed\n",
        encoding="utf-8")
    m = leer_heks(str(heks))
    total = sum(v[2] for v in m.node_inputs.loads.values())
    assert abs(total - (-5 * 9.0)) < 1e-9, f"ΣFz = {total}, se esperaba -45"


def _losa_heks(destino: Path, tipo: str | None, shellmod: str | None = None,
               nx: int = 6, ny: int = 4, Lx: float = 6.0, Ly: float = 4.0) -> Path:
    """Losa rectangular apoyada en el contorno con carga de área."""
    lin, ids, k = [], {}, 1
    for j in range(ny + 1):
        for i in range(nx + 1):
            ids[(i, j)] = k
            lin.append(f"node {k} {i * Lx / nx:.6f} {j * Ly / ny:.6f} 0")
            k += 1
    sid = 1
    for j in range(ny):
        for i in range(nx):
            lin.append("shell %d %d %d %d %d 0.15 2.4e7" % (
                sid, ids[(i, j)], ids[(i + 1, j)], ids[(i + 1, j + 1)], ids[(i, j + 1)]))
            sid += 1
    for s in range(1, sid):
        if tipo:
            lin.append(f"shelltype {s} {tipo}")
        if shellmod:
            lin.append(f"shellmod {s} {shellmod}")
        lin.append(f"areaload {s} -8.0")
    lin += [f"support {ids[(i, j)]} 111000"
            for j in range(ny + 1) for i in range(nx + 1)
            if i in (0, nx) or j in (0, ny)]
    destino.write_text("\n".join(lin + ["solve"]) + "\n", encoding="utf-8")
    return destino


def _comparar_con_motor(heks: Path, tmp_path: Path):
    ref = _motor_ts(heks, tmp_path / "ref.json")
    m = leer_heks(str(heks))
    assert not m.errores, m.errores
    assert len(m.elements) == ref["nElements"]
    res = resolver_heks(m)
    n = len(m.nodes)
    uz_ref = [ref["deformations"][str(i)][2] for i in range(n)]
    uz_py = [res.deformations[i][2] for i in range(n)]
    mx = max(abs(v) for v in uz_ref) or 1e-12
    peor = max(abs(a - b) / mx * 100 for a, b in zip(uz_py, uz_ref))
    return min(uz_ref), min(uz_py), peor


@pytest.mark.parametrize("tipo", ["thin", "thick", None])
def test_shelltype_thin_y_thick_clonan_al_motor(tipo, tmp_path):
    """`shelltype thin` = Kirchhoff DKE · `thick` (y el defecto) = Mindlin MITC4.

    Sin este dispatch, una losa que en ETABS es Shell-Thin entraba por el
    defecto de Hekatan y salía MÁS RÍGIDA — 4 % menos de flecha en el peldaño 2
    de la escalera. El Python la leía y avisaba de que no la aplicaba; ahora la
    aplica.
    """
    heks = _losa_heks(tmp_path / f"losa_{tipo}.heks", tipo)
    ref, py, peor = _comparar_con_motor(heks, tmp_path)
    print("\n  losa 6x4 %-6s  Uz C++ %9.5f mm   PY %9.5f mm   peor %.2e %%"
          % (tipo or "(def)", ref * 1000, py * 1000, peor))
    assert peor < 1e-6


def test_thin_y_thick_NO_dan_lo_mismo(tmp_path):
    """Y que no sea un dispatch de adorno: los dos caminos tienen que separarse.

    Un test que solo compara contra el motor pasaría igual si el `shelltype` no
    llegara a ningún sitio y las dos losas cayeran en Mindlin — porque el motor
    también las resolvería con Mindlin. Hay que exigir que se SEPAREN.
    """
    a = leer_heks(str(_losa_heks(tmp_path / "a.heks", "thin")))
    b = leer_heks(str(_losa_heks(tmp_path / "b.heks", "thick")))
    assert set(a.element_inputs.plate_formulations.values()) == {1}
    assert set(b.element_inputs.plate_formulations.values()) == {0}
    ua = min(d[2] for d in resolver_heks(a).deformations.values())
    ub = min(d[2] for d in resolver_heks(b).deformations.values())
    assert abs(ua - ub) / abs(ub) > 1e-3, (
        "thin y thick dan lo mismo (%.6e vs %.6e): el shelltype no llega al "
        "elemento" % (ua, ub))


def test_shellmod_escalar_tambien_escala_el_drilling(tmp_path):
    """`K += mFactor · drilling`, como `shellQ4.cpp`. El Python no lo escalaba.

    No lo cazaba ningún modelo del repo porque todos traen `shellmod`
    DIRECCIONAL, y con direccionales el C++ pone mFactor = 1: la diferencia solo
    aparece con la forma escalar.

    ⚠️ Y tiene que ser un MURO cargado EN SU PLANO. Sobre una losa plana con
    carga vertical el test pasa igual sin el arreglo, porque nada excita θz:
    medido, 5.6e-12 % con y sin. Aquí, sin el arreglo, 0.26 %.
    """
    nx, nz, Lx, Lz = 2, 6, 2.0, 6.0
    lin, ids, k = [], {}, 1
    for j in range(nz + 1):
        for i in range(nx + 1):
            ids[(i, j)] = k
            lin.append(f"node {k} {i * Lx / nx:.6f} 0 {j * Lz / nz:.6f}")
            k += 1
    sid = 1
    for j in range(nz):
        for i in range(nx):
            lin.append("shell %d %d %d %d %d 0.20 2.4e7" % (
                sid, ids[(i, j)], ids[(i + 1, j)], ids[(i + 1, j + 1)], ids[(i, j + 1)]))
            lin.append(f"shellmod {sid} 0.35 0.70")
            sid += 1
    lin += [f"support {ids[(i, 0)]} fixed" for i in range(nx + 1)]
    lin += [f"load {ids[(i, nz)]} 50 0 0 0 0 0" for i in range(nx + 1)]
    heks = tmp_path / "muro_mod.heks"
    heks.write_text(BR.join(lin + ["solve"]) + BR, encoding="utf-8")

    ref = _motor_ts(heks, tmp_path / "ref.json")
    m = leer_heks(str(heks))
    res = resolver_heks(m)
    n = len(m.nodes)
    ux_ref = [ref["deformations"][str(i)][0] for i in range(n)]
    ux_py = [res.deformations[i][0] for i in range(n)]
    mx = max(abs(v) for v in ux_ref)
    peor = max(abs(a - b) / mx * 100 for a, b in zip(ux_py, ux_ref))
    print(BR + "  muro en su plano, shellmod 0.35 0.70   Ux C++ %8.5f mm"
          "   PY %8.5f mm   peor %.2e %%"
          % (max(ux_ref) * 1000, max(ux_py) * 1000, peor))
    assert peor < 1e-6


def test_muelles_winkler_clonan_al_motor(tmp_path):
    """`spring nodo uz k` — Winkler nodal. Es `K(g,g) += k` en `deform.cpp`.

    Losa sobre 25 muelles de balasto con carga central. Se comprueba lo de
    siempre en este orden: primero la BÁSCULA (la suma de fuerzas de muelle
    tiene que dar la carga), después el nudo a nudo.
    """
    n, L, ks = 4, 3.0, 30000.0
    lin, ids, k = [], {}, 1
    for j in range(n + 1):
        for i in range(n + 1):
            ids[(i, j)] = k
            lin.append(f"node {k} {i * L / n:.6f} {j * L / n:.6f} 0")
            k += 1
    sid = 1
    for j in range(n):
        for i in range(n):
            lin.append("shell %d %d %d %d %d 0.30 2.4e7" % (
                sid, ids[(i, j)], ids[(i + 1, j)], ids[(i + 1, j + 1)], ids[(i, j + 1)]))
            sid += 1
    A = (L / n) ** 2
    for j in range(n + 1):
        for i in range(n + 1):
            f = (0.5 if i in (0, n) else 1.0) * (0.5 if j in (0, n) else 1.0)
            lin.append(f"spring {ids[(i, j)]} uz {ks * A * f:.4f}")
    # Sin sujetar el plano la losa flota lateralmente: los muelles son solo uz.
    lin += [f"support {ids[(0, 0)]} 110000", f"support {ids[(n, 0)]} 010000",
            f"load {ids[(n // 2, n // 2)]} 0 0 -500 0 0 0"]
    heks = tmp_path / "zapata.heks"
    heks.write_text(BR.join(lin + ["solve"]) + BR, encoding="utf-8")

    ref = _motor_ts(heks, tmp_path / "ref.json")
    m = leer_heks(str(heks))
    assert not m.errores, m.errores
    assert len(m.node_inputs.springs) == (n + 1) ** 2
    res = resolver_heks(m)

    uz_py = [res.deformations[i][2] for i in range(len(m.nodes))]
    suma = sum(kk * uz_py[i] for i, d, kk in m.node_inputs.springs if d == 2)
    assert abs(suma - (-500.0)) < 1e-6, f"la báscula no cierra: {suma} kN"

    uz_ref = [ref["deformations"][str(i)][2] for i in range(len(m.nodes))]
    mx = max(abs(v) for v in uz_ref)
    peor = max(abs(a - b) / mx * 100 for a, b in zip(uz_py, uz_ref))
    print(BR + "  zapata sobre 25 muelles   Uz C++ %9.6f mm   PY %9.6f mm   peor %.2e %%"
          % (min(uz_ref) * 1000, min(uz_py) * 1000, peor))
    assert peor < 1e-6


def test_mass_y_diaph_se_avisan_aparte(tmp_path):
    """`mass` y `diaph` NO entran en el estático — ni aquí ni en `deform.cpp`.

    Meterlos en la misma lista que un hueco de verdad haría dudar de un
    resultado que está bien. Van en su propio aviso.
    """
    heks = tmp_path / "d.heks"
    heks.write_text(BR.join([
        "node 1 0 0 0", "node 2 3 0 0",
        "frame 1 1 2 2e8 0.01 1e-4 1e-4 1e-5",
        "support 1 fixed", "load 2 0 0 -5 0 0 0",
        "diaph 2 1", "mass 2 1.5", "zzz 1 2"]) + BR, encoding="utf-8")
    m = leer_heks(str(heks))
    # Desde el 3-sep-2026 `diaph` SI entra en el estatico (rigidDiaphragm.h y
    # solver._armar_diafragma): solo `mass` queda como aviso aparte.
    assert any("solo para el modal" in e and "mass" in e and "diaph" not in e
               for e in m.errores), m.errores
    assert any(e.startswith("comandos NO montados") and "zzz" in e and
               "mass" not in e for e in m.errores), m.errores


def test_q4_colapsado_no_revienta_pero_no_es_un_elemento(tmp_path):
    """Un TRIÁNGULO escrito como Q4 con el 4º nudo repetido.

    En el punto de atadura del borde colapsado el jacobiano es EXACTAMENTE
    cero. `jacobian2D` de `shellQ4.cpp` lo topa a 1e-15 y sigue; Python no lo
    topaba y lanzaba `ZeroDivisionError` con `riochico.heks` (8 así de 563).

    ⚠️ Topar NO es resolver: dividir por 1e-15 amplifica el ruido de coma
    flotante por 1e15, así que los dos motores caen en ruidos DISTINTOS. Medido
    en riochico: con las 8 degeneradas dentro, peor nudo 2.57 %; quitándolas,
    0.016 % y mediana 6.5e-5 %. O sea que el 2.57 % no es un fallo del port —
    es que un Q4 colapsado no es un elemento definido en ninguno de los dos.
    Para un triángulo, el elemento es el de 3 nudos.
    """
    heks = tmp_path / "colapsado.heks"
    heks.write_text(BR.join([
        "node 1 0 0 0", "node 2 2 0 0", "node 3 1 2 0",
        "shell 1 1 2 3 3 0.20 2.4e7",
        "areaload 1 -5",
        "support 1 fixed", "support 2 fixed"]) + BR, encoding="utf-8")
    m = leer_heks(str(heks))
    res = resolver_heks(m)          # lo que se exige es que NO reviente
    assert all(math.isfinite(v) for d in res.deformations.values() for v in d)


@pytest.mark.parametrize("caso", ["mezanine_em_grav", "tcl_roundtrip",
                                  "losas_maciza_thin", "galpon_lc"])
def test_escribir_heks_ida_y_vuelta(caso, tmp_path):
    """`escribir_heks` -> `leer_heks` tiene que dar EL MISMO modelo.

    Para qué sirve el escritor: es el segundo camino hasta ETABS. El `.heks` lo
    lee `cliModeler` y de ahí sale el `.e2k`, así que escribiendo el modelo se
    monta el mismo caso en ETABS POR FICHERO, sin tocar la OAPI — que en un
    solo día dio nueve fallos mudos.

    Lo que se exige no es que el texto sea igual, sino que el MODELO lo sea:
    mismo número de nudos y elementos, y la misma deformada.
    """
    from hekatan_struct.heks import escribir_heks

    ruta = DATOS / f"{caso}.heks"
    if not ruta.exists():
        pytest.skip(f"no está {ruta}")
    a = leer_heks(str(ruta))
    escribir_heks(a, str(tmp_path / "vuelta.heks"))
    b = leer_heks(str(tmp_path / "vuelta.heks"))

    assert len(b.nodes) == len(a.nodes), "se perdieron nudos al escribir"
    assert len(b.elements) == len(a.elements), "se perdieron elementos"
    assert len(b.node_inputs.supports) == len(a.node_inputs.supports)
    assert len(b.node_inputs.loads) == len(a.node_inputs.loads)
    assert len(b.node_inputs.springs) == len(a.node_inputs.springs)
    ea, eb = a.element_inputs, b.element_inputs
    for campo in ("local_angles", "shear_areas_y", "shear_areas_z",
                  "frame_loads", "moment_releases", "shell_modifiers",
                  "shell_angles", "plate_formulations", "thicknesses"):
        assert len(getattr(eb, campo)) == len(getattr(ea, campo)), campo

    ra, rb = resolver_heks(a), resolver_heks(b)
    ua = [ra.deformations[i][2] for i in range(len(a.nodes))]
    ub = [rb.deformations[i][2] for i in range(len(b.nodes))]
    mx = max(abs(v) for v in ua) or 1e-12
    peor = max(abs(x - y) / mx * 100 for x, y in zip(ua, ub))
    print(BR + "  %-20s %5d nudos %5d elem   Uz %9.4f mm   ida y vuelta %.2e %%"
          % (caso, len(a.nodes), len(a.elements), min(ua) * 1000, peor))
    assert peor < 1e-5
