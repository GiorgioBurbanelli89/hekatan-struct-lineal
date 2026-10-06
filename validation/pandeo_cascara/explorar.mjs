// Exploración: λ de Struct (WASM) contra SAP2000 en los modelos de modelos.json: cadena entera y Kg sola (estático de SAP).
//   node validation/pandeo_cascara/explorar.mjs [pfThick] [nombre ...]
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem } from "../../tests/lib/bundle.mjs";
import { RAIZ } from "../../tests/lib/wasm.mjs";
import { modeloStruct } from "../../tests/casos/pandeo_cascara_sap2000.mjs";
const pf = +(process.argv[2] ?? 0), solo = process.argv.slice(3);
const fem = await cargarFem();
const D = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo_cascara/modelos.json"), "utf8"));
const S = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo_cascara/sap_pandeo_cascara.json"), "utf8"));
const par = (hs, ref) => hs.reduce((b, h) => (Math.abs(h / ref - 1) < Math.abs(b / ref - 1) ? h : b), Infinity);
for (const M of D.modelos) {
  if (solo.length && !solo.includes(M.nombre)) continue;
  const s = S[M.nombre]; if (!s) continue;
  const m = modeloStruct(M, D.E, D.nu, pf);
  const d = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
  const r = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, s.factores.length + 4, d.deformations);
  const us = new Map(Object.entries(s.estatico).map(([q, v]) => [+q, v]));
  const r1 = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, s.factores.length + 4, us);
  const fila = (rr) => s.factores.filter((f) => Math.abs(f) > 0.5).map((f) => (100 * (par(rr.factors, f) / f - 1)).toFixed(5)).join(" ");
  console.log(M.nombre.padEnd(13), "entero:", fila(r));
  console.log("".padEnd(13), "Kg sola:", fila(r1));
}
