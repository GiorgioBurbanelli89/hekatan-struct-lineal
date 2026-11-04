/**
 * E2K: LINELOAD uniforme sobre una barra con punto de insercion (CARDINALPT 8 + TRANSFORMSTIFF "Yes") lleva al nudo el momento r x F,
 * igual que el peso propio y la losa (e2kAHeks.conInsercion). Sin referencia ETABS propia (no hay LINELOAD en los galpones ni en el
 * mercado): el oraculo es la mecanica. La correa B25 del galpon sencillo (y 0..6 m, z 740..560 mm, pendiente 3 %) con w = 1 N/mm GRAV:
 *   F = wL/2 en cada extremo; el centroide queda D/2 bajo el nudo en el eje local 2 = (0, sen t, cos t) -> r = -(D/2)·e2,
 *   r x F = (D/2)·sen t·F en X (Mx), y nada mas. Se compara contra el mismo e2k SIN TRANSFORMSTIFF (sin insercion): el delta es solo eso.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-lineload-insercion";
export const descripcion = "e2k: LINELOAD uniforme con punto de insercion lleva el momento r x F al nudo (mecanica, correa inclinada)";

export async function correr() {
  const mod = await empaquetar(`export { parseE2k } from "${R}/examples/src/shared/e2kParser";\n`, "e2k-lineload-insercion");
  const base = readFileSync(join(AQUI, "..", "datos", "e2k_galpon_simple_card8.e2k"), "latin1");
  const conCarga = (t) => t.replace(/^(\$ FRAME OBJECT LOADS\r?\n)/m, `$1  LINELOAD  "B25"  "N2 COL"  TYPE "UNIFF"  DIR "GRAV"  LC "Dead"  FVAL 1\n`);
  const silencio = (f) => { const l = console.log, w = console.warn, i = console.info; console.log = console.warn = console.info = () => {}; try { return f(); } finally { console.log = l; console.warn = w; console.info = i; } };
  const med = (t) => silencio(() => mod.parseE2k(conCarga(t)));
  const A = med(base);                                              // con insercion
  const B = med(base.replace(/TRANSFORMSTIFF\s+"Yes"/g, 'TRANSFORMSTIFF "No"'));   // sin insercion
  const e = A.elementNames.indexOf("B25");
  const [n1, n2] = A.elements[e], p1 = A.nodes[n1], p2 = A.nodes[n2];
  const L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
  const sen = Math.abs(p2[2] - p1[2]) / L, D = A.sectionShapes.get(e).h;
  const cp = (M, n) => M.cargasPatron.get("Dead").get(n);
  const filas = [];
  const F = 1 * L / 2;     // N (w = 1 N/mm, L en mm)
  const esperado = (D / 2) * sen * F;
  for (const n of [n1, n2]) {
    const a = cp(A, n), b = cp(B, n), d = a.map((v, k) => v - b[k]);
    filas.push({ que: `nudo ${n}: delta Mx = (D/2)·sen·F`, crudo: true, medido: `${d[3].toFixed(3)} (esperado ${esperado.toFixed(3)})`, limite: "<= 0.1 %", ok: Math.abs(Math.abs(d[3]) - esperado) <= 1e-3 * esperado,
      detalle: `D=${D} mm, sen=${sen.toFixed(5)}, F=${F.toFixed(1)} N` });
    filas.push({ que: `nudo ${n}: fuerzas y My, Mz sin cambio`, crudo: true, medido: `${[d[0], d[1], d[2], d[4], d[5]].map((v) => Math.abs(v).toFixed(6)).join(" ")}`, limite: "= 0", ok: [d[0], d[1], d[2], d[4], d[5]].every((v) => Math.abs(v) < 1e-6 * F) });
  }
  return filas;
}
