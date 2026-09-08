// `edge etabs` en Hekatan contra ETABS 22 con OBJMESHTYPE "NONE" (validation/isse/edge_none):
// el nudo colgado (2,0.7) sobre la arista (2,0)-(2,2) del pano A, atado por Hermite.
//   node validation/isse/edge_none_hekatan.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { resolverHeks } from "../../tests/lib/heks.mjs";
const J = JSON.parse(readFileSync("validation/isse/edge_none/etabs/edge_none.json", "utf-8").replace(/\bNaN\b/g, "null"));
const P = new Map(J.puntos.map((p) => [`${+p.x.toFixed(3)},${+p.y.toFixed(3)}`, p.n]));
const uE = (k) => J.disp_nudos[P.get(k)];
const base = readFileSync(process.env.HEKS || "validation/isse/edge_none.heks", "utf-8").replace(/\r?\nsolve\s*$/, "\n");
export async function medir() {
  const out = {};
  for (const modo of ["suelto", "edge etabs"]) {
    const txt = base + (modo === "edge etabs" ? "edge etabs\n" : "") + "solve\n";
    const ruta = "validation/isse/edge_none/_tmp_" + (modo === "suelto" ? "suelto" : "etabs") + ".heks";
    writeFileSync(ruta, txt, "utf-8");
    const r = await resolverHeks(ruta);
    const nodo = (x, y) => r.nodes.findIndex((n) => Math.abs(n[0] - x) < 1e-9 && Math.abs(n[1] - y) < 1e-9);
    const u = (x, y) => r.deformOutputs.deformations.get(nodo(x, y)) ?? [];
    let peor = 0, wmax = 0; const filas = [];
    for (const [x, y] of [[2, 0], [2, 0.7], [2, 2], [3, 0], [3, 0.7], [3, 2]]) {
      const h = u(x, y), e = uE(`${x},${y}`); if (!h.length || !e) continue;
      wmax = Math.max(wmax, Math.abs(e[2]));
      filas.push({ x, y, h, e });
      for (let k = 0; k < 6; k++) peor = Math.max(peor, Math.abs(h[k] - e[k]));
    }
    out[modo] = { filas, peor: (100 * peor) / wmax, wmax };
  }
  return out;
}
if (import.meta.url === new URL(process.argv[1], "file:").href || process.argv[1].endsWith("edge_none_hekatan.mjs")) {
  const out = await medir();
  for (const [modo, r] of Object.entries(out)) {
    console.log(`== Hekatan ${modo}`);
    for (const f of r.filas) console.log(`   (${f.x},${f.y}) w Hek ${f.h[2].toExponential(5)}  ETABS ${f.e[2].toExponential(5)}  (${((f.h[2] / f.e[2] - 1) * 100).toFixed(3)} %)  rx ${f.h[3].toExponential(3)}/${f.e[3].toExponential(3)}  ry ${f.h[4].toExponential(3)}/${f.e[4].toExponential(3)}`);
    console.log(`   peor componente ${r.peor.toFixed(4)} % del w maximo`);
  }
}
