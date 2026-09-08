/**
 * PARIDAD Python <-> TS/WASM en las directivas del 8-sep-2026: `areaspring` (muelle de área
 * consistente y nodal) y `edge etabs` (nudo colgado atado a su arista por Hermite).
 *
 * Por qué existe: los dos motores tenían el MISMO muelle de área implementado con NOMBRES
 * distintos (`areaspring` en TS, `springarea` en Python), así que el mismo `.heks` no se leía
 * igual en los dos y nadie lo veía. Y al portar el nudo colgado, Python usaba `m = n × s` donde
 * el C++ usa `m = s × n`: ataba la pendiente con el giro CAMBIADO DE SIGNO (5.1 % de diferencia,
 * y contra ETABS 3.9 % en vez de 0.11 %). Las dos cosas las cazó esta comparación.
 *
 * El lado Python se corre aparte (`python validation/isse/paridad_py_ts.py`), que deja
 * `_paridad_py.json` y los `.heks`. Si ese JSON no está, el caso se salta con aviso.
 */
import { existsSync } from "node:fs";
import { medir } from "../../validation/isse/paridad_py_ts.mjs";

export const nombre = "paridad-py-areaspring-edge";
export const descripcion = "areaspring (consistente y nodal) y edge etabs: Python = TS/WASM nudo a nudo";

export async function correr() {
  if (!existsSync("validation/isse/_paridad_py.json")) {
    return [{
      que: "referencia de Python",
      medido: 0, limite: 0, ok: false,
      detalle: "falta _paridad_py.json — correr antes: python validation/isse/paridad_py_ts.py",
    }];
  }
  const filas = await medir();
  const esperados = { consistente: 1e-6, nodal: 1e-6, colgado: 1e-3 };
  return filas.map((f) => ({
    que: `${f.nom}: Python vs TS/WASM, ${f.n} nudos`,
    medido: f.peor,
    limite: esperados[f.nom] ?? 1e-6,
    ok: f.n > 0 && f.peor <= (esperados[f.nom] ?? 1e-6),
    detalle: `peor ${f.peor.toExponential(2)} % del w máximo ${f.wmax.toExponential(3)}`,
  }));
}
