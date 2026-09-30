// Tiempo-historia de Struct sobre un VOLCADO (el mismo JSON que arma csi_desde_dump.py en SAP2000).
//   node cli/_th_desde_dump.mjs dump.json spec.json salida.json
import { empaquetar, R } from "../tests/lib/bundle.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const [fd, fs_, fo] = process.argv.slice(2);
const D = JSON.parse(readFileSync(fd, "utf-8")), T = JSON.parse(readFileSync(fs_, "utf-8"));
const m = await empaquetar(`export { timeHistoryAnalysis, modalAnalysis } from "${R}/hekatan-fem/src/index";\n`, "thd" + Date.now());
const aMap = (o) => new Map(Object.entries(o).map(([k, v]) => [Number(k), v]));
const ei = {};
for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports ?? {}), diaphragms: aMap(D.nodeInputs.diaphragms ?? {}),
             masses: aMap(D.nodeInputs.masses ?? {}), springs: D.nodeInputs.springs ?? [] };
const r = m.timeHistoryAnalysis(D.nodes, D.elements, ni, ei, {
  metodo: T.metodo, dt: T.dt, nPasos: T.n, xi: T.xi ?? 0, cM: T.cM ?? 0, cK: T.cK ?? 0, numModes: T.nModos,
  cargas: [{ tipo: "aceleracion", dir: T.dir, funcion: { t: T.t, v: T.a } }], nudosSalida: T.nudos });
const mo = m.modalAnalysis(D.nodes, D.elements, ni, ei, T.nModos, 0, 0, 1, ni.diaphragms, ni.springs);
writeFileSync(fo, JSON.stringify({ t: r.t, nudos: Object.fromEntries([...r.u].map(([k, v]) => [k, v])), base: r.base, nModos: r.nModos,
  periodos: mo.frequencies.map((f) => 1 / f) }));
console.log("Struct th:", r.t.length, "pasos,", r.nModos, "modos; periodos", mo.frequencies.slice(0, 4).map((f) => (1 / f).toFixed(4)).join(" "));
