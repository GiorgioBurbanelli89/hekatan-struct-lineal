// ¿Cuántas flechas dibuja loads.ts para la Cancha y en cuántas correas caen?
// Copia EXACTA del algoritmo de hekatan-ui/src/viewer/objects/loads.ts (MAX_FLECHAS=240).
import { readFileSync } from "fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const f = process.argv[2] ?? "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const text = readFileSync(f, "utf8");
const mod = await empaquetar(
  `import { parseS2k } from "${R}/examples/src/shared/s2kParser"; export { parseS2k };`);
const model = mod.parseS2k(text);
const nodes = model.nodes;
const loads = model.nodeInputs?.loads ?? new Map();
console.log(`nudos=${nodes.length} nodosCargados=${loads.size}`);

let fz = 0; loads.forEach((v) => fz += v[2] ?? 0);
console.log(`ΣFz=${fz.toFixed(2)} kN`);

const cargados = [];
loads.forEach((l, i) => {
  if (!nodes[i]) return;
  if (l.slice(0, 3).some((v) => Math.abs(v) > 1e-15)) cargados.push(i);
});
console.log(`cargados(|F|>1e-15 en xyz)=${cargados.length}`);

// ── loads.ts, copiado tal cual (post-arreglo 25-sep-2026) ──
const MAX_FLECHAS = 240;
const SUBMUESTREA_DESDE = 700;
let dibujar = cargados;
let submuestreo = false;
if (cargados.length > SUBMUESTREA_DESDE) {
  submuestreo = true;
  const xs = cargados.map((i) => nodes[i][0]), ys = cargados.map((i) => nodes[i][1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const zsRaw = cargados.map((i) => nodes[i][2]);
  const zTol = Math.max(1e-6, (Math.max(...zsRaw) - Math.min(...zsRaw)) / 40);
  const nivel = (z) => Math.round(z / zTol);
  const zs = new Set(zsRaw.map(nivel));
  const porNivel = Math.max(4, Math.floor(MAX_FLECHAS / Math.max(1, zs.size)));
  const nc = Math.max(2, Math.round(Math.sqrt(porNivel)));
  const mejor = new Map();
  for (const i of cargados) {
    const u = (x1 - x0) < 1e-9 ? 0 : (nodes[i][0] - x0) / (x1 - x0);
    const v = (y1 - y0) < 1e-9 ? 0 : (nodes[i][1] - y0) / (y1 - y0);
    const cu = Math.min(nc - 1, Math.floor(u * nc));
    const cv = Math.min(nc - 1, Math.floor(v * nc));
    const clave = `${cu},${cv},${nivel(nodes[i][2])}`;
    const d = Math.hypot(u * nc - (cu + 0.5), v * nc - (cv + 0.5));
    const y = mejor.get(clave);
    if (!y || d < y.d) mejor.set(clave, { i, d });
  }
  dibujar = [...mejor.values()].map((m) => m.i);
  console.log(`submuestreo: niveles=${zs.size} porNivel=${porNivel} nc=${nc} → ${dibujar.length} nudos dibujados`);
}
console.log(submuestreo
  ? `RESULTADO: ${cargados.length} nudos cargados → solo ${dibujar.length} con flecha (${(100 * dibujar.length / cargados.length).toFixed(0)} %)`
  : `RESULTADO: sin submuestreo (${cargados.length} ≤ ${SUBMUESTREA_DESDE}), 1 flecha por nudo cargado`);

// ── cobertura por correa (L≈6 m): ¿el nudo de alguno extremo lleva flecha? ──
const dib = new Set(dibujar);
let correas = 0, conFlecha = 0, dosFlechas = 0;
const elems = model.elements;
for (const e of elems) {
  if (e.length !== 2) continue;
  const a = nodes[e[0]], b = nodes[e[1]];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  if (Math.abs(L - 6.0) > 0.05) continue;
  correas++;
  const n = (dib.has(e[0]) ? 1 : 0) + (dib.has(e[1]) ? 1 : 0);
  if (n >= 1) conFlecha++;
  if (n >= 2) dosFlechas++;
}
console.log(`correas L≈6: ${correas} · con ≥1 flecha en extremos: ${conFlecha} · con las 2: ${dosFlechas}`);

// ¿cuántas flechas por componente saldrían realmente (cada nudo hasta 3)? 
let flechas = 0;
const maxAbs = Math.max(...dibujar.flatMap((i) => loads.get(i).map(Math.abs)));
for (const i of dibujar) {
  const l = loads.get(i);
  for (let c = 0; c < 3; c++) if (Math.abs(l[c]) > 1e-9 * (maxAbs || 1)) flechas++;
}
console.log(`flechas ArrowHelper reales≈${flechas} (componentes con |v| > 1e-9·maxAbs)`);
