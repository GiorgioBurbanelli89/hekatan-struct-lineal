// Corte de sección de un volcado. node cli/_corte_seccion.mjs dump.json eje(0|1|2) pos
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const [fn, eje, pos] = process.argv.slice(2);
const D = JSON.parse(readFileSync(fn, "utf-8"));
const m = await empaquetar(`export { corteDeSeccion } from "${R}/examples/src/shared/corteSeccion";\n`, "corte" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const c = m.corteDeSeccion(D.nodes, D.elements, aMap(D.nodeInputs.loads), aMap(D.reactions), aMap(D.nodeInputs.supports), D.nodeInputs.springs, aMap(D.deformations), +eje, +pos);
const G = 9.80665;
console.log(JSON.stringify({ ...c, F: c.F.map((v) => +(v / G).toFixed(4)), M: c.M.map((v) => +(v / G).toFixed(4)) }));
console.log("por metro (tonf/m, tonf·m/m):", c.F.map((v) => (v / G / c.L).toFixed(4)), c.M.map((v) => (v / G / c.L).toFixed(4)));
