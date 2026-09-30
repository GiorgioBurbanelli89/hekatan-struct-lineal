// Chopra 4.ª ed., Ejemplo 5.1 (p.169-170): m = 0.2533, k = 10, ξ = 0.05, p = 10 sen(πt/0.6) hasta 0.6 s, Δt = 0.1
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const m = await empaquetar(`export { timeHistoryAnalysis } from "${R}/hekatan-fem/src/index";\n`, "th51" + Date.now());
// un nudo libre en ux con muelle k y masa m; lo demás atado. Una barra corta atada entera para que haya «elemento».
const nodes = [[0, 0, 0], [1, 0, 0]];
const elements = [[0, 1]];
const mp = (v) => new Map([[0, v]]);
const ei = { elasticities: mp(1e-9), shearModuli: mp(1e-9), areas: mp(1), momentsOfInertiaZ: mp(1), momentsOfInertiaY: mp(1), torsionalConstants: mp(1), densities: mp(0) };
const ni = { supports: new Map([[0, [false, true, true, true, true, true]], [1, [true, true, true, true, true, true]]]),
             masses: new Map([[0, 0.2533]]), springs: [{ node: 0, dof: 0, k: 10 }] };
const t = [], v = [];
for (let i = 0; i <= 6; i++) { t.push(i * 0.1); v.push(10 * Math.sin(Math.PI * i * 0.1 / 0.6)); }
const libro = [0, 0.0318, 0.2274, 0.6336, 1.1339, 1.4896, 1.4480, 0.9037, 0.0579, -0.7577, -1.2432];
for (const metodo of ["modal", "directa"]) {
  const r = m.timeHistoryAnalysis(nodes, elements, ni, ei, { metodo, dt: 0.1, nPasos: 10, xi: 0.05, numModes: 1,
    cM: metodo === "directa" ? 2 * 0.05 * Math.sqrt(10 / 0.2533) : 0,
    cargas: [{ tipo: "patron", fuerzas: new Map([[0, [1, 0, 0, 0, 0, 0]]]), funcion: { t, v } }], nudosSalida: [0] });
  if (!r) { console.log(metodo, "sin resultado"); continue; }
  const u = r.u.get(0).map((x) => x[0]);
  console.log(metodo, "u:", u.map((x) => x.toFixed(4)).join(" "));
  if (metodo === "modal") console.log("libro   ", libro.map((x) => x.toFixed(4)).join(" "), "| peor", Math.max(...u.map((x, i) => Math.abs(x - libro[i]))).toExponential(2));
  console.log("  base Fx:", r.base.slice(0, 4).map((b) => b[0].toFixed(4)).join(" "), "(= −k·u)");
}
const nb = await empaquetar(`export { newmarkBeta } from "${R}/examples/src/shared/newmarkBeta";\n`, "nb" + Date.now());
const w = Math.sqrt(10 / 0.2533), c = 2 * 0.05 * w * 0.2533;
const f = (x) => (x <= 0.6 + 1e-12 ? 10 * Math.sin(Math.PI * x / 0.6) : 0);
const rr = nb.newmarkBeta({ M: [[0.2533]], K: [[10]], C: [[c]], loadFunc: (x) => [f(x)], u0: [0], v0: [0], dt: 0.1, nSteps: 10, a0: "cero" });
console.log("newmarkBeta a0=0:", rr.u.map((x) => x[0].toFixed(4)).join(" "));
