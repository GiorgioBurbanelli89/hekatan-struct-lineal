/**
 * Hekatan: los casos de la zapata excéntrica (mismo .heks que la app) -> hekatan.json
 *   node validation/zapata-levantamiento/hekatan_casos.mjs [n=60]
 */
import { writeFileSync } from "node:fs";
import { empaquetar, R } from "../../tests/lib/bundle.mjs";
const n = +(process.argv[2] ?? 60);
const mod = await empaquetar(`
export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";
export * from "${R}/examples/src/zapata-excentrica/zapataExcentrica";
`, "zapexc");
export const CASOS = [
  ["e0", 0, 0], ["e1_12", 1 / 12, 0], ["e1_6", 1 / 6, 0], ["e1_4", 0.25, 0], ["e1_3", 1 / 3, 0], ["bi_4_6", 0.25, 1 / 6],
];
const st = (v) => ({ val: v });
const out = {};
for (const [nom, exL, eyB] of CASOS) {
  const p = { ...mod.DEFECTO, exL, eyB, n };
  globalThis.window = { __hekatanCliScript: mod.heksZapataExcentrica(p) };
  const states = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  const t0 = Date.now();
  mod.cliModeler.build({}, states);
  const U = states.deformOutputs.val.deformations;
  const r = mod.resumenFem(states.nodes.val, U, p);
  const rig = mod.zapataRigidaSinTraccion(p, 400);
  const f = eyB === 0 ? mod.formulaUniaxial(p.P, p.Ly, p.Lx, exL * p.Lx, p.ks) : null;
  const w = {};
  states.nodes.val.forEach((q, i) => { w[`${(+q[0].toFixed(6))},${(+q[1].toFixed(6))}`] = U.get(i)[2]; });
  out[nom] = { exL, eyB, fem: r, rigida: rig, formula: f, contacto: globalThis.window.__hekatanCliContacto, equilibrio: globalThis.window.__hekatanCliEquilibrio, ms: Date.now() - t0, w };
  console.log(nom.padEnd(7), `FEM qmax ${r.qmax.toFixed(3)} largo ${r.largoContactoX.toFixed(4)} wmax ${(r.wmax*1000).toFixed(3)} mm giro ${r.giroX.toExponential(4)}`,
    `| rígida ${rig.qmax.toFixed(3)} ${rig.largoContactoX.toFixed(4)}`, f ? `| fórmula ${f.qmax.toFixed(3)} ${f.contacto.toFixed(4)} giro ${f.giro.toExponential(4)}` : "",
    `| it ${globalThis.window.__hekatanCliContacto?.historial.join(">")} eq ${globalThis.window.__hekatanCliEquilibrio?.pctErr}% ${Date.now() - t0} ms`);
}
writeFileSync(new URL(`./hekatan_n${n}.json`, import.meta.url), JSON.stringify(out));
