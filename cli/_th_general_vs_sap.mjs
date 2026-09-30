import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
import { portico81 } from "./_portico81.mjs";
const m = await empaquetar(`export { timeHistoryAnalysis } from "${R}/hekatan-fem/src/index";\n`, "thg" + Date.now());
const S = JSON.parse(readFileSync(`validation/paz-newmark/${process.argv[2] ?? "sap"}_th_general.json`, "utf-8"));
const sis = JSON.parse(readFileSync("validation/paz-newmark/sismo_sintetico.json", "utf-8"));
const { nodes, elements, ni, ei } = portico81();
const tri = { t: [0, 0.1, 1.0], v: [1, 0, 0] };
const pulsos = [{ tipo: "patron", fuerzas: new Map([[2, [10000, 0, 0, 0, 0, 0]]]), funcion: tri },
                { tipo: "patron", fuerzas: new Map([[4, [20000, 0, 0, 0, 0, 0]]]), funcion: tri }];
const sismo = [{ tipo: "aceleracion", dir: 0, funcion: { t: sis.t, v: sis.a } }];
const casos = [
  ["TH81M", { metodo: "modal", dt: 0.002, nPasos: 500, xi: 0, cargas: pulsos }],
  ["TH81AD", { metodo: "directa", dt: 0.01, nPasos: 400, cM: S.cM, cK: S.cK, cargas: sismo }],
  ["TH81AM", { metodo: "modal", dt: 0.01, nPasos: 400, xi: 0.05, cargas: sismo }],
];
const peor = (a, b) => { let p = 0, mx = 0; b.forEach((x, i) => { mx = Math.max(mx, Math.abs(x)); p = Math.max(p, Math.abs(a[i] - x)); }); return 100 * p / mx; };
for (const [c, o] of casos) {
  const r = m.timeHistoryAnalysis(nodes, elements, ni, ei, { ...o, numModes: 12, nudosSalida: [2, 4] });
  const u1 = r.u.get(2).map((x) => x[0]), u2 = r.u.get(4).map((x) => x[0]), fx = r.base.map((b) => b[0]);
  console.log(c, `modos ${r.nModos}`, `u1 ${peor(u1, S[c].u1.u).toExponential(2)} %`, `u2 ${peor(u2, S[c].u2.u).toExponential(2)} %`,
    `baseFX ${peor(fx, S[c].baseFX).toExponential(2)} %`, `| u1max ${Math.max(...u1.map(Math.abs)).toFixed(5)} SAP ${Math.max(...S[c].u1.u.map(Math.abs)).toFixed(5)}`,
    `| FX0..2 ${fx.slice(0, 3).map((x) => x.toFixed(1))} SAP ${S[c].baseFX.slice(0, 3).map((x) => x.toFixed(1))}`);
}
