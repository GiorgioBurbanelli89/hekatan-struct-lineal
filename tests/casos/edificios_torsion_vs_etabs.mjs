/**
 * Tu (torsión de diseño, envolvente de las combinaciones ACI con sismo) de 20 edificios, regulares e irregulares, con el Insertion Point.
 * Ejemplo del workspace `edificios-torsion` (examples/src/edificios-torsion/). Referencia: ETABS 22 por OAPI
 * (validation/insercion/etabs_edificios.py, tests/datos/edificios_torsion_etabs.json): las tres situaciones de cada edificio.
 *   1 Centroid (10) · 2 Top Center (8) + casilla marcada (= 1: el desfase solo se dibuja) · 3 Top Center + casilla desmarcada (barra rígida).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "edificios-torsion-vs-etabs";
export const descripcion = "Tu de 20 edificios (10 regulares, 10 irregulares), Centroid frente a Top Center desmarcada, contra ETABS 22";

export async function correr() {
  const AQUI = dirname(fileURLToPath(import.meta.url));
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", "edificios_torsion_etabs.json"), "utf8"));
  const mod = await empaquetar(`
    import { EDIFICIOS, construirEdificio } from "${R}/examples/src/edificios-torsion/edificios";
    import { calcularTu } from "${R}/examples/src/edificios-torsion/edificiosTorsion";
    export function tu(id, punto) { const S = EDIFICIOS.find(s => s.id === id); return calcularTu(S, construirEdificio(S), punto); }
  `);
  const filas = [];
  const pc = (a, b) => 100 * Math.abs(a - b) / Math.max(Math.abs(b), 1e-12);
  let peor = 0;
  for (const id of Object.keys(ref)) {
    const a = mod.tu(id, 0), b = mod.tu(id, 2);
    const e = ref[id];
    const e1 = pc(a.Tu, e["1_centroid"].Tu), e3 = pc(b.Tu, e["3_top_desmarcada"].Tu);
    const e2 = pc(e["2_top_marcada"].Tu, e["1_centroid"].Tu);                // ETABS: marcada = centroide
    peor = Math.max(peor, e1, e3);
    const baja = b.Tu < a.Tu;
    filas.push({ que: `${id}: Tu centroide`, medido: e1, limite: 0.01, ok: e1 < 0.01, detalle: `ETABS ${e["1_centroid"].Tu.toFixed(3)} · Struct ${a.Tu.toFixed(3)} kN·m` });
    filas.push({ que: `${id}: Tu Top Center desmarcada`, medido: e3, limite: 0.01, ok: e3 < 0.01, detalle: `ETABS ${e["3_top_desmarcada"].Tu.toFixed(3)} · Struct ${b.Tu.toFixed(3)} (${(100 * (b.Tu / a.Tu - 1)).toFixed(1)} %)` });
    filas.push({ que: `${id}: marcada = centroide en ETABS`, medido: e2, limite: 1e-6, ok: e2 < 1e-6, detalle: "el desfase solo se dibuja" });
    filas.push({ que: `${id}: la barra rígida baja el Tu`, medido: baja ? 0 : 1, limite: 0.5, ok: baja, detalle: `${(100 * (b.Tu / a.Tu - 1)).toFixed(1)} %` });
  }
  return filas;
}
