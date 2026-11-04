/**
 * UN cuadrilatero de membrana contra ETABS 22: el Q4 de Hekatan ES el de CSI.
 *
 * Metodo (el de `celda_membrana12.py`, caja negra): un solo area, fuera del plano
 * todo sujeto, 3 solidos rigidos del plano sujetos, 9 grados libres (u, v, giro
 * normal de 4 nudos). Una carga unidad por grado libre -> la FLEXIBILIDAD 9x9
 * de ETABS, nudo a nudo. Se compara contra el mismo elemento de Hekatan con el
 * drilling por defecto (tipo 13).
 *
 * Referencia: `datos/membrana_q4_etabs.json`.
 *   thick_*   Shell-Thick, 10 geometrias (cuadrado con nu 0..0.45, 1:2, 1:4, paralelogramo, trapecio)
 *   mem_*     Membrane: 1x1, 1:2, 1:4 y 1:6 (ETABS NO la malla; el Shell-Thick de 1:6 si, en 5)
 *   incl_*    Membrane inclinada en 3D (3 cm/m, doble pendiente, 30 grados), apoyos en ejes globales
 * Para Membrane, Hekatan pone la flexion a 0 (`bendingModifiers`), como el galpon.
 *
 * Medido el 3-nov-2026: error maximo ~1e-10 % en las 17 (el Q4 coincide a todos los digitos),
 * asi que la diferencia del galpon con ETABS NO viene de este elemento.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "membrana-q4-etabs";
export const descripcion = "Q4 de membrana de un solo elemento: flexibilidad 9x9 contra ETABS (1:1 a 1:6, inclinada)";

const SUJ = [[0, 0], [0, 1], [1, 1]];

export async function correr() {
  const { deform } = await empaquetar(`export { deform } from "${R}/hekatan-fem/src/index";\n`, "membrana-q4");
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", "membrana_q4_etabs.json"), "utf-8"));
  const m = (v) => new Map([[0, v]]);
  const filas = [];
  for (const [nom, c] of Object.entries(ref)) {
    const nodes = c.pts.map((p) => [p[0], p[1], p[2] ?? 0]);
    const sup = new Map();
    c.pts.forEach((_, i) => {
      const r = [false, false, true, true, true, false];
      SUJ.forEach(([n, k]) => { if (n === i) r[k] = true; });
      sup.set(i, r);
    });
    const n = c.libres.length;
    let peor = 0;
    c.libres.forEach(([nn, kk], col) => {
      const f = [0, 0, 0, 0, 0, 0]; f[kk < 2 ? kk : 5] = 1;
      const d = deform(nodes, [[0, 1, 2, 3]], { supports: sup, loads: new Map([[nn, f]]) }, {
        thicknesses: m(c.t), elasticities: m(c.E), poissonsRatios: m(c.nu), densities: m(0),
        ...(c.membrana ? { bendingModifiers: m(0) } : {}),
      });
      c.libres.forEach(([n2, k2], fila) => {
        const h = d.deformations.get(n2)[k2 < 2 ? k2 : 5];
        peor = Math.max(peor, Math.abs(h - c.F[fila][col]) / Math.sqrt(c.F[fila][fila] * c.F[col][col]));
      });
    });
    filas.push({
      que: `${nom}: flexibilidad ${n}x${n} vs ETABS`,
      medido: peor * 100, limite: 0.01, ok: peor * 100 <= 0.01,
      detalle: `error max / sqrt(Fii Fjj) = ${(peor * 100).toExponential(2)} %`,
    });
  }
  return filas;
}
