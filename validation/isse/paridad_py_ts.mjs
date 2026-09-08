// Lado TS/WASM de la paridad: resuelve los MISMOS .heks que escribió `paridad_py_ts.py`
// (por cliModeler, como el producto) y compara nudo a nudo contra `_paridad_py.json`.
//   python validation/isse/paridad_py_ts.py  &&  node validation/isse/paridad_py_ts.mjs
import { readFileSync, existsSync } from "node:fs";
import { resolverHeks } from "../../tests/lib/heks.mjs";

const DIR = "validation/isse";
const PY = JSON.parse(readFileSync(`${DIR}/_paridad_py.json`, "utf-8"));

export async function medir() {
  const filas = [];
  for (const nom of Object.keys(PY)) {
    const ruta = `${DIR}/_paridad_${nom}.heks`;
    if (!existsSync(ruta)) continue;
    const r = await resolverHeks(ruta);
    const uPy = PY[nom].u;
    let peor = 0, wmax = 1e-30, n = 0;
    for (const [k, v] of Object.entries(uPy)) wmax = Math.max(wmax, Math.abs(v[2]));
    r.nodes.forEach((nd, i) => {
      const k = nd.map((c) => c.toFixed(3)).join(",");
      const py = uPy[k]; if (!py) return;
      const ts = r.deformOutputs.deformations.get(i) ?? [];
      n++;
      for (let q = 0; q < 6; q++) peor = Math.max(peor, Math.abs((ts[q] ?? 0) - py[q]));
    });
    filas.push({ nom, n, peor: (100 * peor) / wmax, wmax });
  }
  return filas;
}

if (process.argv[1]?.endsWith("paridad_py_ts.mjs")) {
  for (const f of await medir())
    console.log(`  ${f.nom.padEnd(12)} ${String(f.n).padStart(4)} nudos casados · peor ${f.peor.toExponential(2)} % del w máximo`);
}
