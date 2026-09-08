/**
 * `automesh <tam>`: el AUTOMALLADO de ETABS (`AUTOMESHOPTIONS ... FLOORMESHMAXSIZE 1250`, 1.25 m
 * de fábrica) reproducido en Hekatan, contra el modelo de ANÁLISIS de ETABS 22.
 *
 * Por qué existe: Hekatan resuelve LA MALLA QUE SE LE DA. Una losa de 5×5 que llega como UN paño
 * (lo normal en un `.e2k` de ETABS) él la parte en 16 celdas de 1.25 m y Hekatan no: no son el
 * mismo modelo, y la diferencia es de convergencia de malla, no del elemento.
 *
 * Referencia: `validation/isse/automesh/pointelm_noadd.json`, los 25 nudos del modelo de análisis
 * de ETABS (`PointElm`, no `PointObj`: los que crea al mallar no son objetos) del mismo paño.
 *
 * ⚠️ Ese fichero se leyó con el `.e2k` corregido a `ADDRESTRAINT "No"`. Con `"Yes"` —lo que
 * escribía el exportador hasta el 8-sep-2026— ETABS EMPOTRA todos los nudos nuevos del borde que
 * tocan un nudo restringido, y la misma losa sale 7 veces más rígida (4.99e-4 contra 3.58e-3).
 * Es lo que se cazó con este caso, y `"No"` es lo que escribe ETABS en su propio `.$et`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "automesh-vs-etabs";
export const descripcion = "automesh 1.25 m = el automallado de ETABS (paño 5×5 -> 16 celdas, 25 nudos)";

const REF = "validation/isse/automesh/pointelm_noadd.json";
const HEKS = "validation/isse/automesh/losa_sola.heks";

export async function correr() {
  if (!existsSync(REF) || !existsSync(HEKS)) {
    return [{ que: "referencia de ETABS", medido: 0, limite: 0, ok: false,
              detalle: `falta ${REF} — ver validation/isse/automesh/` }];
  }
  const E = JSON.parse(readFileSync(REF, "utf-8"));
  const eu = new Map();
  for (const v of Object.values(E)) if (v.u) eu.set([v.x, v.y, v.z].map((c) => c.toFixed(3)).join(","), v.u);
  let wmax = 0;
  for (const u of eu.values()) wmax = Math.max(wmax, Math.abs(u[2]));

  const base = readFileSync(HEKS, "utf-8").replace(/\r?\nsolve\s*$/, "\n");
  const tmp = "validation/isse/automesh/_caso.heks";
  const filas = [];
  for (const [etiqueta, dir] of [["sin automesh", ""], ["automesh 1.25", "automesh 1.25\n"]]) {
    writeFileSync(tmp, base + dir + "solve\n", "utf-8");
    const r = await resolverHeks(tmp);
    const nQ4 = r.elements.filter((e) => e.length === 4).length;
    let peor = 0, n = 0;
    r.nodes.forEach((nd, i) => {
      const k = nd.map((c) => c.toFixed(3)).join(",");
      const e = eu.get(k); if (!e) return;
      n++;
      const h = r.deformOutputs.deformations.get(i) ?? [];
      for (let q = 0; q < 6; q++) peor = Math.max(peor, Math.abs((h[q] ?? 0) - e[q]));
    });
    if (dir) {
      filas.push({ que: "automesh: la MALLA es la de ETABS (25 nudos, 16 cáscaras)",
                   medido: r.nodes.length, limite: 25,
                   ok: r.nodes.length === eu.size && nQ4 === 16,
                   detalle: `${r.nodes.length} nudos y ${nQ4} cáscaras (ETABS: ${eu.size} y 16)` });
      const d = (100 * peor) / wmax;
      filas.push({ que: "automesh: los 25 nudos contra ETABS", medido: d, limite: 1e-3,
                   ok: n === eu.size && d <= 1e-3,
                   detalle: `${n} nudos casados, peor ${d.toExponential(2)} % del w máximo` });
    } else {
      filas.push({ que: "sin automesh: la malla NO es la de ETABS (por eso hace falta)",
                   medido: r.nodes.length, limite: 25,
                   ok: r.nodes.length === 4 && nQ4 === 1,
                   detalle: `${r.nodes.length} nudos y ${nQ4} cáscara contra los ${eu.size} y 16 de ETABS` });
    }
  }
  return filas;
}
