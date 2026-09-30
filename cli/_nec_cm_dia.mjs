// CM solo con la masa de los nudos del DIAFRAGMA (lo que lista ETABS en «Centers Of Mass And Rigidity» cuando D1 va solo en los puntos)
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(process.argv[2], "utf-8"));
const m = await empaquetar(`export { jointMass } from "${R}/hekatan-fem/src/modalCpp";\n`, "neccmd" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const M = m.jointMass(D.nodes, D.elements, ei, { incluyeElementos: 1 });
const porZ = new Map();
for (const k of Object.keys(D.nodeInputs.diaphragms)) { const n = +k, z = D.nodes[n][2].toFixed(2); const a = porZ.get(z) ?? [0, 0, 0]; a[0] += M[n][0]; a[1] += M[n][0] * D.nodes[n][0]; a[2] += M[n][0] * D.nodes[n][1]; porZ.set(z, a); }
for (const [z, a] of [...porZ].sort((p, q) => +q[0] - +p[0])) console.log(`z ${z}  masa diafragma ${a[0].toFixed(4)}  CM (${(a[1] / a[0]).toFixed(4)}, ${(a[2] / a[0]).toFixed(4)})`);
