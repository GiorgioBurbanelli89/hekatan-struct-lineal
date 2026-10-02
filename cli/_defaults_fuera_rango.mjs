// Ejemplos con un default FUERA de [min, max]: el panel lo recorta y el primer cálculo no es el del siguiente.
import { empaquetar, R } from "../tests/lib/bundle.mjs";
globalThis.window = globalThis; globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const m = await empaquetar(`export { examplesRegistry } from "${R}/examples/src/workspace/exampleRegistry";\n`, "reg" + Date.now());
let n = 0;
for (const ex of m.examplesRegistry) for (const [k, p] of Object.entries(ex.params ?? {})) {
  if (typeof p.default !== "number" || p.options || p.boolean) continue;
  if ((p.min !== undefined && p.default < p.min) || (p.max !== undefined && p.default > p.max)) { n++; console.log(`${ex.id}.${k}: default ${p.default} fuera de [${p.min}, ${p.max}]${p.unitType ? " (" + p.unitType + ")" : ""}`); }
}
console.log("total", n);
