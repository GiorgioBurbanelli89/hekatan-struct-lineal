// Capa NEC 3b: CM y CR por piso. node cli/_nec_cr.mjs dump.json
import { empaquetar, R, cargarFem } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8"));
const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { centrosDeRigidez } from "${R}/examples/src/shared/nec/derivas";\n`, "neccr" + Date.now());
const { deform } = await cargarFem();
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms) };
const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
const CR = m.centrosDeRigidez(D.nodes, P, ni.diaphragms, (loads) => deform(D.nodes, D.elements, { ...ni, loads }, ei).deformations);
P.forEach((p, i) => console.log(`piso ${p.k}  CM (${p.cm[0].toFixed(4)}, ${p.cm[1].toFixed(4)})  CR (${CR[i][0].toFixed(4)}, ${CR[i][1].toFixed(4)})  e (${(CR[i][0] - p.cm[0]).toFixed(3)}, ${(CR[i][1] - p.cm[1]).toFixed(3)})`));
