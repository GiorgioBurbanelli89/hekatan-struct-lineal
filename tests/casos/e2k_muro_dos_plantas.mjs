/**
 * Muro que atraviesa DOS plantas del .e2k (hay un piso intermedio, como el descanso de una escalera).
 *
 * El exportador escribía el PANEL con salto de planta `1 1 0 0` fijo: con un piso en medio, el muro de 0 a 4 m
 * salía de 2 a 4 m. En el TACNA (pisos en cada descanso) ETABS perdía la mitad baja de todos los muros y el
 * edificio daba 9 veces más flexible (78.6 mm contra 8.5), 16-oct-2026. Arreglo: salto = plantas entre pie y cabeza.
 *
 * Juez: el mismo modelo resuelto por Struct directo frente a su .e2k releído (e2kAHeks → cliModeler). El TACNA
 * contra ETABS 22.6 se midió aparte (modelo privado): registros/TACNA_e2k_struct_vs_etabs.md, parte 9.
 */
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const nombre = "e2k-muro-dos-plantas";
export const descripcion = "muro que cruza un piso intermedio: el PANEL del .e2k sube las dos plantas";

const HEKS = `# muro de 3 x 4 m y un portico con piso intermedio a 2 m (3 nudos a esa cota = planta para el exportador)
node 1 0 0 0
node 2 3 0 0
node 3 3 0 4
node 4 0 0 4
node 5 6 0 0
node 6 6 0 2
node 7 6 0 4
node 8 9 0 0
node 9 9 0 2
node 10 9 0 4
node 11 12 0 0
node 12 12 0 2
node 13 12 0 4
shell 1 1 2 3 4 0.2 25000000
frame 1 5 6 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 2 6 7 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 3 3 7 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 4 8 9 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 5 9 10 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 6 11 12 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 7 12 13 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 8 7 10 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 9 10 13 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 10 6 9 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 11 9 12 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
support 1 fixed
support 2 fixed
support 5 fixed
support 8 fixed
support 11 fixed
load 3 100 0 0 0 0 0
solve
`;

export async function correr() {
  const mod = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => ({ style:{}, appendChild(){}, setAttribute(){}, addEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>null, querySelector:()=>null, querySelectorAll:()=>[], remove(){} });
g.document = g.document ?? { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
const { cliModeler } = await import("${R}/examples/src/cli-modeler/cliModeler");
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");
export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";
export function aE2k(texto) {
  const st = (v) => ({ val: v });
  const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window.__hekatanCliScript = texto;
  cliModeler.build({}, s);
  return exportE2k({ nodes: s.nodes.val, elements: s.elements.val, nodeInputs: s.nodeInputs.val, elementInputs: s.elementInputs.val, title: "t", weightMode: "manual" });
}`, "muroDosPlantas");
  const dir = mkdtempSync(join(tmpdir(), "hkMuro2-"));
  const resolver = async (txt, nom) => { const p = join(dir, nom); writeFileSync(p, txt); delete globalThis.__hekatanFactoresPatron; return resolverHeks(p); };
  const ux = (r) => { const i = r.nodes.findIndex((p) => Math.abs(p[0] - 3) < 1e-6 && Math.abs(p[2] - 4) < 1e-6); return r.deformOutputs.deformations.get(i)[0] * 1000; };
  const filas = [];
  const directo = ux(await resolver(HEKS, "directo.heks"));
  const e2k = mod.aE2k(HEKS);
  const panel = /AREA "W\d+"\s+PANEL\s+4\s+"[^"]+"\s+"[^"]+"\s+"[^"]+"\s+"[^"]+"\s+(\d+)\s+(\d+)\s+0\s+0/.exec(e2k);
  const salto = panel ? `${panel[1]} ${panel[2]}` : "sin PANEL";
  filas.push({ que: "salto de planta del PANEL (muro de 0 a 4 m, piso a 2 m)", crudo: true, medido: salto, limite: "2 2", ok: salto === "2 2",
    detalle: "antes salía 1 1: el muro empezaba en el piso intermedio" });
  const releido = ux(await resolver(mod.e2kAHeks(e2k, "muro.e2k").heks, "releido.heks"));
  const d = Math.abs(releido / directo - 1) * 100;
  filas.push({ que: "cabeza del muro: .e2k releído vs Struct directo", medido: d, limite: 1, ok: d < 1,
    detalle: `directo ${directo.toFixed(4)} mm · releído ${releido.toFixed(4)} mm` });
  return filas;
}
