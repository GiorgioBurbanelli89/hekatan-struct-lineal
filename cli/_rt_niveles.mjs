import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync } from "node:fs";
const m = await empaquetar(`export * from "${R}/examples/src/shared/e2kParser";\n`, "p");
const r = m.parseE2k(readFileSync(process.argv[2], "utf-8"));
const q4 = r.elements.filter(e => e.length === 4).length, t3 = r.elements.filter(e => e.length === 3).length;
const zs = [...new Set(r.nodes.map(n => n[2].toFixed(3)))].length;
console.log("releido: nudos", r.nodes.length, "Q4", q4, "T3", t3, "cotas z distintas", zs);
const fl = m.piezasFlotantes ? m.piezasFlotantes(r.elements, r.nodeInputs?.supports) : null;
console.log("flotantes:", fl ? JSON.stringify(fl).slice(0, 120) : "n/a");
