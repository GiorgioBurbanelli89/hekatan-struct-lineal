// El pórtico del Paz 8.1 tal cual está en validation/paz-newmark/sap_th.py (lb-in), por timeHistoryAnalysis.
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export { timeHistoryAnalysis } from "${R}/hekatan-fem/src/index";\n`, "th81" + Date.now());
export function portico81() {
  const nodes = [[0, 0, 0], [360, 0, 0], [0, 0, 180], [360, 0, 180], [0, 0, 300], [360, 0, 300]];
  const elements = [[0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]];
  const I = [248.6, 248.6, 248.6e5, 106.3, 106.3, 248.6e5], E = 30e6;
  const mp = (f) => new Map(elements.map((_, i) => [i, f(i)]));
  const ei = { elasticities: mp(() => E), shearModuli: mp(() => E / 2.6), areas: mp(() => 1e4),
    momentsOfInertiaZ: mp((i) => I[i]), momentsOfInertiaY: mp((i) => I[i]), torsionalConstants: mp((i) => 2 * I[i]),
    shearAreasY: mp(() => -1), shearAreasZ: mp(() => -1), densities: mp(() => 0) };
  const plano = [false, true, false, true, false, true], emp = [true, true, true, true, true, true];
  const ni = { supports: new Map([[0, emp], [1, emp], [2, plano], [3, plano], [4, plano], [5, plano]]),
    masses: new Map([[2, 52500 / 386.088 / 2], [3, 52500 / 386.088 / 2], [4, 25500 / 386.088 / 2], [5, 25500 / 386.088 / 2]]) };
  return { nodes, elements, ni, ei };
}
const { nodes, elements, ni, ei } = portico81();
const tri = { t: [0, 0.1, 1.0], v: [1, 0, 0] };
const cargas = [{ tipo: "patron", fuerzas: new Map([[2, [10000, 0, 0, 0, 0, 0]]]), funcion: tri },
                { tipo: "patron", fuerzas: new Map([[4, [20000, 0, 0, 0, 0, 0]]]), funcion: tri }];
const SAP = JSON.parse(readFileSync("validation/paz-newmark/sap_th.json", "utf-8"))["8-1"];
for (const metodo of ["directa", "modal"]) {
  const r = m.timeHistoryAnalysis(nodes, elements, ni, ei, { metodo, dt: 0.002, nPasos: 500, numModes: 12, cargas, nudosSalida: [2, 4] });
  const u1 = r.u.get(2).map((x) => x[0]), u2 = r.u.get(4).map((x) => x[0]);
  const d = (a, b) => Math.max(...b.u.map((x, i) => Math.abs(a[i] - x))) / b.max * 100;
  console.log(metodo, `modos ${r.nModos}`, `u1 max ${Math.max(...u1.map(Math.abs)).toFixed(6)} vs SAP(directa) ${SAP.u1.max.toFixed(6)} → peor paso ${d(u1, SAP.u1).toExponential(2)} %`,
              `| u2 ${d(u2, SAP.u2).toExponential(2)} %`, `| base Fx max ${Math.max(...r.base.map((b) => Math.abs(b[0]))).toFixed(1)} lb`);
}
