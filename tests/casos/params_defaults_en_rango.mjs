/**
 * Ningún parámetro de un ejemplo puede tener el DEFAULT fuera de su [min, max].
 *
 * Si lo tiene, el primer cálculo usa el default y el panel (Tweakpane) lo recorta al construirse: el SIGUIENTE
 * recálculo —mover cualquier control, cambiar de unidades— resuelve otro modelo. Lo destapó el test de unidades con
 * puppeteer (2-oct-2026): edificio-dual pedía 10 pisos con máximo 8 y al cambiar de preset perdía dos pisos (55 %).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "params-defaults-en-rango";
export const descripcion = "el default de cada parámetro numérico está dentro de su [min, max]";

export async function correr() {
  if (!globalThis.localStorage) globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  if (!globalThis.window) globalThis.window = globalThis;
  const m = await empaquetar(`export { examplesRegistry } from "${R}/examples/src/workspace/exampleRegistry";\n`, "params-defaults");
  const fuera = [];
  let n = 0;
  for (const ex of m.examplesRegistry) for (const [k, p] of Object.entries(ex.params ?? {})) {
    if (typeof p.default !== "number" || p.options || p.boolean) continue;
    n++;
    if ((p.min !== undefined && p.default < p.min) || (p.max !== undefined && p.default > p.max)) fuera.push(`${ex.id}.${k} = ${p.default} ∉ [${p.min}, ${p.max}]`);
  }
  return [{ que: `${n} parámetros de ${m.examplesRegistry.length} ejemplos`, medido: fuera.length, limite: 0, ok: fuera.length === 0,
            detalle: fuera.slice(0, 5).join("; ") || "todos dentro" }];
}
