// Comprobacion puntual del exportador e2k. Temporal, se borra despues.
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R } from "./tests/lib/bundle.mjs";

const H = (process.env.USERPROFILE ?? "") + "/Documents/Hekatan Calc 1.0.0/galpon-bodega-electoral/galpon_bodega.heks";
const { cliModeler, exportE2k } = await empaquetar(
  `export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n` +
  `export { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "e2kExp");

globalThis.window = { __hekatanCliScript: readFileSync(H, "utf-8") };
const st = (v) => ({ val: v });
const states = {
  nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
  deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]),
};
cliModeler.build({}, states);
const nodes = states.nodes.val, elements = states.elements.val;

const txt = exportE2k({
  nodes, elements,
  nodeInputs: states.nodeInputs.val, elementInputs: states.elementInputs.val,
  title: "Galpon desde Hekatan Struct", weightMode: "manual",
});
writeFileSync(
  (process.env.USERPROFILE ?? "") + "/Documents/Hekatan Calc 1.0.0/galpon-bodega-electoral/galpon_desde_struct.e2k",
  txt, "latin1");

const L = txt.split(/\r?\n/);
const con = (p) => L.filter((l) => l.includes(p)).length;
const barras = elements.filter((e) => e.length === 2);
const shells = elements.filter((e) => e.length === 4);
const conM = L.filter((l) => l.includes("POINTLOAD") && /M[XYZ]\s+-?[0-9.]*[1-9]/.test(l));

console.log(`MODELO   : ${nodes.length} nudos, ${barras.length} barras, ${shells.length} shells`);
console.log(`E2K      : ${con("  POINT ")} plan-points, ${con("  LINE ")} lineas, ${con("  AREA ")} areas`);
console.log(`CARGAS   : ${con("POINTLOAD")} POINTLOAD, de ellas ${conM.length} con momento`);

// .Que barras NO llegaron al e2k?
const enE2k = new Set();
for (const l of L) {
  const m = l.match(/^\s*LINE\s+"([^"]+)"\s+\w+\s+"([^"]+)"\s+"([^"]+)"/);
  if (m) enE2k.add(`${m[2]}|${m[3]}`);
}
let faltan = 0, verticales = 0, cero = 0;
const ejemplos = [];
barras.forEach((e) => {
  const a = nodes[e[0]], b = nodes[e[1]];
  const dz = Math.abs(a[2] - b[2]);
  const dxy = Math.hypot(a[0] - b[0], a[1] - b[1]);
  const L2 = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  if (L2 < 1e-9) cero++;
  if (dxy < 1e-6 && dz > 1e-6) verticales++;
});
console.log(`         barras verticales: ${verticales}, de longitud cero: ${cero}`);
console.log(`         diferencia barras -> lineas: ${barras.length - con("  LINE ")}`);
void faltan; void ejemplos;
