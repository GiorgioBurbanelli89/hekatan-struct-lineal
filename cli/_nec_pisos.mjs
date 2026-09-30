// Capa NEC 1: pisos, masa y CM de un volcado (dump_ejemplo). node cli/_nec_pisos.mjs dump.json
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8"));
const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";\n`, "necp" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms) };
const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
let tot = 0;
for (const q of P) { tot += q.masa; console.log(`piso ${q.k}  z ${q.z.toFixed(3)}  masa ${q.masa.toFixed(4)} t  peso ${q.peso.toFixed(2)} kN  CM (${q.cm[0].toFixed(4)}, ${q.cm[1].toFixed(4)})  nudos ${q.nudos.length}`); }
console.log("masa total", tot.toFixed(4));
