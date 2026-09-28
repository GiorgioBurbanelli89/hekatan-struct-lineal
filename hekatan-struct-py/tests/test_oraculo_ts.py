"""Python contra el TS de verdad, corriendo en Node. No "se parece": el MISMO caso.

El motor de Python dice reproducir al de `hekatan-fem`. Decirlo no vale nada.
Aqui se construyen los casos UNA vez, se resuelven con los dos motores y se
comparan numero a numero. Si el port esta mal, sale.

El oraculo es `oraculo_ts.mjs`, que empaqueta `deform.ts` y `analyze.ts` con
esbuild — el TypeScript PURO, sin pasar por el WASM, que es la formulacion que
se porto.

    pytest tests/test_oraculo_ts.py -v

Se salta solo si no hay Node o no estan los node_modules del repo.
"""
import json
import math
import subprocess
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from hekatan_struct import ElementInputs, NodeInputs, analyze, deform  # noqa: E402

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]                      # .../hekatan-struct
E, NU = 200e6, 0.3
G = E / (2 * (1 + NU))


# ═══════════════════════════════════════════════════════════════════════════
# Los casos. Cada uno ejercita algo distinto de lo que se porto.
# ═══════════════════════════════════════════════════════════════════════════
def _base(nodes, elements, **ei):
    d = dict(nodes=nodes, elements=elements,
             elasticities={i: E for i in range(len(elements))},
             shearModuli={i: G for i in range(len(elements))},
             poissonsRatios={i: NU for i in range(len(elements))},
             areas={i: 0.02 for i in range(len(elements))},
             momentsOfInertiaY={i: 1.0e-4 for i in range(len(elements))},
             momentsOfInertiaZ={i: 4.0e-4 for i in range(len(elements))},
             torsionalConstants={i: 5.0e-6 for i in range(len(elements))})
    d.update(ei)
    return d


def _portico():
    """Portico 3D con barras en las tres direcciones y una oblicua."""
    nodes = [[0, 0, 0], [0, 0, 4], [5, 0, 4], [5, 0, 0],
             [5, 3, 4], [2.5, 1.5, 6.5]]
    elements = [[0, 1], [1, 2], [2, 3], [2, 4], [1, 5], [5, 2]]
    return nodes, elements


def casos():
    """Devuelve {nombre: caso}. Cada caso es lo que come el oraculo."""
    c = {}

    # 1. voladizo pelado — la referencia mas simple
    c["voladizo"] = _base([[0, 0, 0], [4, 0, 0]], [[0, 1]],
                          supports={0: [True] * 6},
                          loads={1: [0, 0, -10, 0, 0, 0]},
                          analyze=True)

    # 2. con areas de cortante explicitas (Timoshenko de verdad)
    c["cortante_as"] = _base([[0, 0, 0], [4, 0, 0]], [[0, 1]],
                             supports={0: [True] * 6},
                             loads={1: [0, 0, -10, 0, 5, 0]},
                             shearAreasY={0: 0.006}, shearAreasZ={0: 0.006},
                             analyze=True)

    # 3. angulo de eje local — el dato que once veces cambia la inercia
    for ang in (30.0, 90.0, 217.0):
        c["ang_%g" % ang] = _base([[0, 0, 0], [4, 0, 0]], [[0, 1]],
                                  supports={0: [True] * 6},
                                  loads={1: [0, 2, -10, 1, 0, 0]},
                                  localAngles={0: ang},
                                  shearAreasY={0: 0.006}, shearAreasZ={0: 0.006},
                                  analyze=True)

    # 4. portico 3D completo, con ang y as en todas las barras
    nodes, elements = _portico()
    n = len(elements)
    c["portico"] = _base(nodes, elements,
                         supports={0: [True] * 6, 3: [True] * 6},
                         loads={2: [3, -2, -25, 0, 0, 0], 4: [0, 0, -12, 0, 0, 0],
                                5: [1.5, 0, -8, 0, 2, 0]},
                         localAngles={i: 17.0 * (i + 1) for i in range(n)},
                         shearAreasY={i: 0.005 for i in range(n)},
                         shearAreasZ={i: 0.007 for i in range(n)},
                         analyze=True)

    # 5. releases — forma larga de 12 banderas y forma corta de 6
    c["release12"] = _base(nodes, elements,
                           supports={0: [True] * 6, 3: [True] * 6},
                           loads={2: [3, -2, -25, 0, 0, 0], 4: [0, 0, -12, 0, 0, 0],
                                  5: [1.5, 0, -8, 0, 2, 0]},
                           momentReleases={1: [False] * 4 + [True, True] + [False] * 6},
                           shearAreasY={i: 0.005 for i in range(n)},
                           shearAreasZ={i: 0.007 for i in range(n)},
                           analyze=True)
    # forma corta de 6 = [TI, M2I, M3I, TJ, M2J, M3J] -> GDL 3,4,5,9,10,11.
    # Se libera el extremo que da a un nudo CON MAS BARRAS: soltar el extremo
    # libre (nudo 4, que solo toca una barra) deja ese nudo sin nada que le
    # sujete los giros y el sistema sale singular — ver
    # `test_mecanismo_python_avisa_el_ts_no`.
    c["release6"] = _base(nodes, elements,
                          supports={0: [True] * 6, 3: [True] * 6},
                          loads={2: [0, 0, -25, 0, 0, 0], 4: [0, 0, -12, 0, 0, 0]},
                          momentReleases={1: [False, True, True, False, False, False],
                                          2: [False, False, False, False, True, True]},
                          analyze=True)

    # 6. muelles de fijacion parcial
    c["muelles"] = _base(nodes, elements,
                         supports={0: [True] * 6, 3: [True] * 6},
                         loads={2: [0, 0, -25, 0, 0, 0], 4: [0, 0, -12, 0, 0, 0]},
                         partialFixitySprings={0: [0] * 5 + [1.5e5] + [0] * 6,
                                               2: [0] * 11 + [8.0e4]},
                         analyze=True)

    # 7. brazos rigidos, SOLO en barras alineadas con los ejes globales
    #    (en oblicuas los dos motores no tienen por que coincidir: ver el test
    #     `test_offsets_barra_oblicua_discrepa`)
    c["offsets_alineada"] = _base([[0, 0, 0], [6, 0, 0]], [[0, 1]],
                                  supports={0: [True] * 6},
                                  loads={1: [0, 0, -10, 0, 0, 0]},
                                  rigidOffsets={0: [0.10, 0.15]},
                                  analyze=True)
    # 8. END LENGTH OFFSETS de CSI (`endOffsets`), que NO son los del fork original: el
    #    brazo va DENTRO de la luz. Aqui los dos motores tienen que coincidir
    #    tambien en barra OBLICUA, porque el TS ya lo aplica sobre la K LOCAL.
    c["endoffset_voladizo_rz1"] = _base([[0, 0, 0], [6, 0, 0]], [[0, 1]],
                                        supports={0: [True] * 6},
                                        loads={1: [0, 0, -10, 0, 0, 0]},
                                        endOffsets={0: [1.0, 0.0, 1.0]},
                                        analyze=True)
    c["endoffset_rz0_no_toca"] = _base([[0, 0, 0], [6, 0, 0]], [[0, 1]],
                                       supports={0: [True] * 6},
                                       loads={1: [0, 0, -10, 0, 0, 0]},
                                       endOffsets={0: [1.0, 1.0, 0.0]},
                                       analyze=True)
    c["endoffset_oblicua"] = _base([[0, 0, 0], [4, 3, 2]], [[0, 1]],
                                   supports={0: [True] * 6},
                                   loads={1: [3, -5, -10, 0, 0, 0]},
                                   endOffsets={0: [0.4, 0.25, 0.6]},
                                   analyze=True)
    return c


# ═══════════════════════════════════════════════════════════════════════════
# Puente: el mismo caso, a la API de Python
# ═══════════════════════════════════════════════════════════════════════════
_CAMPO = {
    "elasticities": "elasticities", "shearModuli": "shear_moduli",
    "areas": "areas", "momentsOfInertiaZ": "moments_of_inertia_z",
    "momentsOfInertiaY": "moments_of_inertia_y",
    "torsionalConstants": "torsional_constants",
    "poissonsRatios": "poissons_ratios", "densities": "densities",
    "shearAreasY": "shear_areas_y", "shearAreasZ": "shear_areas_z",
    "localAngles": "local_angles", "thicknesses": "thicknesses",
    "momentReleases": "moment_releases",
    "partialFixitySprings": "partial_fixity_springs",
    "rigidOffsets": "rigid_offsets",
    "endOffsets": "end_offsets",
}


def a_python(c):
    ni = NodeInputs(
        supports={int(k): tuple(v) for k, v in c.get("supports", {}).items()},
        loads={int(k): tuple(v) for k, v in c.get("loads", {}).items()},
    )
    ei = ElementInputs()
    for js, py in _CAMPO.items():
        if js in c:
            getattr(ei, py).update({int(k): v for k, v in c[js].items()})
    return [tuple(p) for p in c["nodes"]], [list(e) for e in c["elements"]], ni, ei


@pytest.fixture(scope="module")
def ts(tmp_path_factory):
    """Corre el oraculo TS una sola vez para todos los casos."""
    if not (RAIZ / "node_modules" / "esbuild").exists():
        pytest.skip("faltan los node_modules de hekatan-struct")
    d = tmp_path_factory.mktemp("oraculo")
    ent, sal = d / "casos.json", d / "salida.json"
    ent.write_text(json.dumps(casos()), encoding="utf-8")
    r = subprocess.run(["node", str(AQUI / "oraculo_ts.mjs"), str(ent), str(sal)],
                       capture_output=True, text=True, cwd=str(RAIZ))
    if r.returncode != 0:
        pytest.skip("no se pudo correr el oraculo TS: %s" % (r.stderr or r.stdout)[:400])
    return json.loads(sal.read_text(encoding="utf-8"))


@pytest.mark.parametrize("nombre", sorted(casos()))
def test_desplazamientos_iguales_al_ts(ts, nombre):
    c = casos()[nombre]
    nodes, elements, ni, ei = a_python(c)
    res = deform(nodes, elements, ni, ei)
    esperado = ts[nombre]["deformations"]

    # La escala la manda el propio caso: comparar en absoluto contra un giro de
    # 1e-7 rad no dice nada, y contra un desplazamiento de 30 mm tampoco.
    esc = max(abs(v) for fila in esperado.values() for v in fila) or 1.0
    peor, donde = 0.0, ""
    for i, fila in esperado.items():
        mio = res.deformations[int(i)]
        for gdl in range(6):
            d = abs(mio[gdl] - fila[gdl]) / esc
            if d > peor:
                peor, donde = d, "nodo %s gdl %d: py=%.6e ts=%.6e" % (i, gdl, mio[gdl], fila[gdl])
    assert peor < 1e-9, "%s -> dif relativa %.3e  (%s)" % (nombre, peor, donde)


@pytest.mark.parametrize("nombre", sorted(casos()))
def test_reacciones_iguales_al_ts(ts, nombre):
    c = casos()[nombre]
    nodes, elements, ni, ei = a_python(c)
    res = deform(nodes, elements, ni, ei)
    esperado = ts[nombre]["reactions"]
    esc = max(abs(v) for fila in esperado.values() for v in fila) or 1.0
    for i, fila in esperado.items():
        mio = res.reactions[int(i)]
        for gdl in range(6):
            assert abs(mio[gdl] - fila[gdl]) / esc < 1e-9, \
                "%s nodo %s gdl %d: py=%.6e ts=%.6e" % (nombre, i, gdl, mio[gdl], fila[gdl])


@pytest.mark.parametrize("nombre", sorted(casos()))
def test_esfuerzos_de_barra_iguales_al_ts(ts, nombre):
    """Los esfuerzos son mas duros que la deformada: los delata el signo."""
    c = casos()[nombre]
    if not c.get("analyze"):
        pytest.skip("caso sin analyze")
    if "rigidOffsets" in c:
        pytest.skip("el TS recupera esfuerzos sin el brazo rigido: "
                    "ver test_esfuerzos_con_brazo_rigido_el_ts_rompe_equilibrio")
    nodes, elements, ni, ei = a_python(c)
    res = deform(nodes, elements, ni, ei)
    ana = analyze(nodes, elements, ei, res)
    pares = [("normals", ana.normals), ("shearsY", ana.shears_y),
             ("shearsZ", ana.shears_z), ("torsions", ana.torsions),
             ("bendingsY", ana.bendings_y), ("bendingsZ", ana.bendings_z)]
    # Escala del CASO: el mayor esfuerzo de cualquier campo. Un campo que es
    # todo ceros numéricos (la torsión de una barra que no torsiona) no se puede
    # comparar consigo mismo: 1e-15 contra 1e-15 da el 100 % y no dice nada.
    esc_caso = max(
        (abs(v) for campo, _ in pares
         for fila in (ts[nombre].get(campo) or {}).values() for v in fila),
        default=1.0) or 1.0
    for campo, mio in pares:
        esperado = ts[nombre].get(campo)
        if not esperado:
            continue
        esc = max(abs(v) for fila in esperado.values() for v in fila) or 1.0
        if esc < 1e-9 * esc_caso:
            continue
        for i, fila in esperado.items():
            for k in range(2):
                assert abs(mio[int(i)][k] - fila[k]) / esc < 1e-9, \
                    "%s %s barra %s extremo %d: py=%.6e ts=%.6e" % (
                        nombre, campo, i, k, mio[int(i)][k], fila[k])


def test_esfuerzos_con_brazo_rigido_el_ts_rompe_equilibrio(ts):
    """Con brazo rígido, el cortante del TS no cierra con la carga. El de Python sí.

    Voladizo de 6 m con P = 10 kN en la punta y brazos rígidos del 10 % y 15 %.
    Sea cual sea el brazo, **V2 = 10 kN en toda la barra**: es equilibrio, no
    formulación. No hace falta ningún programa para saberlo.

    `analyze.ts` recupera con `getLocalStiffnessMatrix`, que NO lleva el brazo
    rígido — el brazo lo mete `getGlobalStiffnessMatrix`, o sea sólo el
    ensamble. Así que multiplica una K sin brazo por unos desplazamientos que
    salieron de una K con brazo: los desplazamientos y las reacciones salen
    bien (casan al 1e-9, lo comprueba el test parametrizado) y los ESFUERZOS
    no.
    """
    c = casos()["offsets_alineada"]
    nodes, elements, ni, ei = a_python(c)
    res = deform(nodes, elements, ni, ei)
    v2_py = analyze(nodes, elements, ei, res).shears_y[0][0]
    v2_ts = ts["offsets_alineada"]["shearsY"]["0"][0]

    assert abs(v2_py - 10.0) < 1e-9, "Python tampoco cierra: V2=%.6f" % v2_py
    assert abs(v2_ts - 10.0) > 1.0, (
        "el TS ya cierra el equilibrio (V2=%.6f): parece arreglado -> "
        "quitar el skip del test parametrizado" % v2_ts)
    print("\n  brazo rigido, V2 en el empotramiento: Python %.4f (=P, correcto) "
          "vs TS %.4f" % (v2_py, v2_ts))


def test_gdl_sin_rigidez_se_queda_en_cero_como_el_cpp():
    """La barra del nudo 4 se articula EN ESE extremo: sus giros quedan sueltos.

    El nudo 4 no tiene otra barra, así que θx y θz no aparecen en ninguna K de
    elemento (medido: diagonal y columna exactamente a cero) y su ecuación es
    `0 = 0`. θy SÍ tiene rigidez y no se toca. `deform.cpp` los SACA del sistema
    (`getZerosIndices`) y los deja en 0 — no es un mecanismo peligroso, es un
    GDL desconectado, y con él dentro la matriz entera sale singular y se
    pierden los otros nudos.

    Antes Python lo dejaba dentro y reventaba con `LinAlgError`, que parecía
    prudente pero era otra cosa: no avisaba de un mecanismo, es que no sabía
    quitar un GDL huérfano. Con 3 nudos así, `galpon_lc.heks` devolvía NaN en
    los 609.
    """
    nodes, elements = _portico()
    caso = _base(nodes, elements,
                 supports={0: [True] * 6, 3: [True] * 6},
                 loads={2: [0, 0, -25, 0, 0, 0], 4: [0, 0, -12, 0, 0, 0]},
                 momentReleases={3: [False, False, False, False, True, True]})
    nds, els, ni, ei = a_python(caso)
    out = deform(nds, els, ni, ei)
    d4 = out.deformations[4]
    assert math.isfinite(d4[2]) and d4[2] < 0, "el nudo 4 tiene que bajar"
    assert d4[3] == 0.0 and d4[5] == 0.0, "los giros sueltos (θx, θz) se quedan en 0"
    assert d4[4] != 0.0, "θy sí tiene rigidez: no se puede haber quitado"


def test_gdl_sin_rigidez_CON_carga_si_revienta():
    """Y si el GDL huérfano lleva CARGA, esa carga no la equilibra nada.

    Quitarlo la borraría del modelo sin decirlo y el resto saldría con números
    de aspecto normal — la misma familia de fallo que un lector que se come
    comandos en silencio. Aquí sí hay que parar.
    """
    import numpy as np
    nodes, elements = _portico()
    caso = _base(nodes, elements,
                 supports={0: [True] * 6, 3: [True] * 6},
                 # MZ en el nudo 4, justo el giro que quedó suelto
                 loads={2: [0, 0, -25, 0, 0, 0], 4: [0, 0, -12, 0, 0, 7.5]},
                 momentReleases={3: [False, False, False, False, True, True]})
    nds, els, ni, ei = a_python(caso)
    with pytest.raises(np.linalg.LinAlgError, match="sin rigidez"):
        deform(nds, els, ni, ei)


def test_offsets_barra_oblicua_discrepa(ts):
    """El brazo rigido del TS se aplica en el marco EQUIVOCADO. Medido.

    `getGlobalStiffnessMatrix.ts` construye la R del brazo con lógica de ejes
    LOCALES (el brazo va a lo largo del eje 1, acoplando u2 con r3) y luego la
    aplica sobre la K **global**: `Rᵀ · K_global · R`. Para una barra alineada
    con los ejes globales los dos marcos coinciden y no se nota — por eso el
    caso `offsets_alineada` casa exacto. Para una barra oblicua, no.

    Este test NO exige que coincidan: exige que la barra alineada SI coincida y
    deja constancia medida de cuanto se separan en la oblicua. Si algun dia se
    arregla el TS, este test avisa (y entonces se cambia a igualdad).
    """
    L = 6.0
    d = L / math.sqrt(3)
    caso = _base([[0, 0, 0], [d, d, d]], [[0, 1]],
                 supports={0: [True] * 6},
                 loads={1: [0, 0, -10, 0, 0, 0]},
                 rigidOffsets={0: [0.10, 0.15]})
    import subprocess as sp
    import tempfile
    with tempfile.TemporaryDirectory() as td:
        ent, sal = Path(td) / "c.json", Path(td) / "s.json"
        ent.write_text(json.dumps({"obl": caso}), encoding="utf-8")
        r = sp.run(["node", str(AQUI / "oraculo_ts.mjs"), str(ent), str(sal)],
                   capture_output=True, text=True, cwd=str(RAIZ))
        if r.returncode != 0:
            pytest.skip("oraculo TS no disponible")
        out = json.loads(sal.read_text(encoding="utf-8"))["obl"]["deformations"]

    nodes, elements, ni, ei = a_python(caso)
    mio = deform(nodes, elements, ni, ei).deformations[1]
    ts_v = out["1"]
    esc = max(abs(v) for v in ts_v)
    dif = max(abs(mio[k] - ts_v[k]) for k in range(6)) / esc
    # La alineada tiene que casar (lo comprueba el test parametrizado); la
    # oblicua se separa, y eso es el sintoma del marco cruzado.
    assert dif > 1e-6, (
        "la barra oblicua ya coincide: el TS parece arreglado -> "
        "cambiar este test a igualdad. dif=%.3e" % dif)
    print("\n  brazo rigido en barra oblicua: Python vs TS difieren %.2f %% "
          "(el TS aplica la R local sobre la K global)" % (100 * dif))
