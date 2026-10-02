// Memoria técnica sin navegador: .e2k → .heks → modelo → capa NEC → HTML de la memoria (la MISMA función del botón).
// Uso: node cli/_memoria_e2k.mjs modelo.e2k salida.html [sistema 0-3] [R]
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { empaquetar, R } from "../tests/lib/bundle.mjs";
const { cliModeler, e2kAHeks, calcularNEC, htmlMemoria, PORTOVIEJO_D } = await empaquetar(
  `export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";
export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";
export { calcularNEC } from "${R}/examples/src/shared/nec/calculo";
export { htmlMemoria } from "${R}/examples/src/shared/nec/memoria";
export { PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";\n`, "memoria-e2k");
const [fE2k, fOut, sis = "3", Rr = "8"] = process.argv.slice(2);
globalThis.window = globalThis;
const r0 = e2kAHeks(readFileSync(fE2k, "latin1"), basename(fE2k));
globalThis.__hekatanInventario = r0.inventario;
const st = (v) => ({ val: v });
globalThis.__hekatanCliScript = r0.heks;
const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
const lg = console.log; console.log = () => {}; try { cliModeler.build({}, s); } finally { console.log = lg; }
const sistema = Number(sis);
const CT = [[0.055, 0.9], [0.055, 0.75], [0.072, 0.8], [0.073, 0.75]][sistema];
const sitio = { ...PORTOVIEJO_D["NEC-15"], R: Number(Rr), Ct: CT[0], alfa: CT[1] };
const t0 = performance.now();
const r = calcularNEC(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val,
  { sitio, irregular: null, nModos: 12, ecc: 0.05, agrietadas: false, dual: sistema === 1, modal: "CQC", direccional: "independiente" });
console.log(`NEC en ${((performance.now() - t0) / 1000).toFixed(1)} s · ${s.nodes.val.length} nudos · T1..3 ${r.modos.slice(0, 3).map((m) => m.T.toFixed(4)).join(" ")} s`);
console.log(`V est ${r.estatico.V.toFixed(1)} ${r.unidad} · W ${r.estatico.W.toFixed(1)} · ΣUx ${(r.sumaMasa.ux * 100).toFixed(1)} % ΣUy ${(r.sumaMasa.uy * 100).toFixed(1)} %`);
console.log(`secciones: ${r0.inventario.secciones.length} · materiales: ${r0.inventario.materiales.length} · combos: ${r0.inventario.combos?.length ?? 0}`);
writeFileSync(fOut, htmlMemoria({ r, nodes: s.nodes.val, elements: s.elements.val, params: { sistema } }));
console.log("→", fOut);
