// V13/V23 (y M) de analyze() con los desplazamientos de SAP2000 contra su AreaForceShell, joint a joint.
//   node cli/_cortante_vs_sap.mjs validation/cortante-v13/sonda_thin.json [1=thin|0=thick]
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8")), pf = +(process.argv[3] ?? 1);
const m = await empaquetar(`export { analyze } from "${R}/hekatan-fem/src/analyze";\n`, "cortv" + Date.now());
const todos = (v) => new Map(D.els.map((_, i) => [i, v]));
const ei = { elasticities: todos(D.E), poissonsRatios: todos(D.nu), shearModuli: todos(D.E / (2 * (1 + D.nu))), thicknesses: todos(D.t), plateFormulations: todos(pf) };
const U = new Map(Object.entries(D.U).map(([k, v]) => [+k, v]));
const ao = m.analyze(D.nodes, D.els, ei, { deformations: U, reactions: new Map() });
const campos = [["M11", "bendingXXjoint"], ["M22", "bendingYYjoint"], ["M12", "bendingXYjoint"], ["V13", "tranverseShearXjoint"], ["V23", "tranverseShearYjoint"]];
for (const [csi, h] of campos) {
  let err = 0, mx = 0;
  for (const f of D.shell) { const e = D.els[f.area], k = e.indexOf(f.pt), v = ao[h]?.get(f.area)?.[k]; mx = Math.max(mx, Math.abs(f[csi])); err = Math.max(err, Math.abs((v ?? NaN) - f[csi])); }
  console.log(`${csi}: peor ${err.toExponential(3)} de ${mx.toFixed(3)} (${(err / mx * 100).toExponential(2)} %)`);
}
