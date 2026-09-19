/**
 * Das 6.10 a OpenSeesPy y Tcl con el exportador de la app (openseesZapata.ts), por el mismo camino
 * que la app (cliModeler). Escribe opensees/das610.py y .tcl.   node opensees_das.mjs [lineal]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "../../tests/lib/bundle.mjs";
const m = await empaquetar(`
export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";
export { opensees, datosOpenSeesDeStates } from "${R}/examples/src/shared/openseesZapata";
export * from "${R}/examples/src/zapata-excentrica/zapataExcentrica";`, "ops-das");
const lineal = process.argv[2] === "lineal";
globalThis.window = { __hekatanCliScript: m.heksZapataExcentrica({ ...m.DAS_EJ610, sinTraccion: !lineal }) };
const st = (v) => ({ val: v });
const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
m.cliModeler.build({}, s);
const d = m.datosOpenSeesDeStates(s, "Das 9.ª ed., ejemplo 6.10 (p. 247)");
const suf = lineal ? "_lineal" : "";
writeFileSync(new URL(`./opensees/das610${suf}.py`, import.meta.url), m.opensees(d, "py"));
writeFileSync(new URL(`./opensees/das610${suf}.tcl`, import.meta.url), m.opensees(d, "tcl"));
console.log(d.nodes.length, "nudos", d.shells.length, "cáscaras", d.springs.length, "resortes", d.springs.filter((q) => q.comp).length, "ENT");
