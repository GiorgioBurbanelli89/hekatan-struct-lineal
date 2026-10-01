// Muro simple (pantalla + zapata) con 4 apoyos FIJOS en las esquinas de la zapata (ux uy uz impedidos, giros libres),
// sin muelles — el caso que propuso Fernan (30-sep-2026). Mismas cargas nodales del muro de Manabí (caso estático).
//   node validation/muro-simple-4apoyos/armar.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { empaquetar, R, cargarFem } from "../../tests/lib/bundle.mjs";
const AQ = `${R}/validation/muro-simple-4apoyos`;
const D = JSON.parse(readFileSync(`${AQ}/base.json`, "utf-8"));
const zb = Math.min(...D.nodes.map((p) => p[2]));
const base = D.nodes.map((p, i) => [p, i]).filter(([p]) => Math.abs(p[2] - zb) < 1e-9);
const xs = base.map(([p]) => p[0]), ys = base.map(([p]) => p[1]);
const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
const esq = base.filter(([p]) => (Math.abs(p[0] - x0) < 1e-9 || Math.abs(p[0] - x1) < 1e-9) && (Math.abs(p[1] - y0) < 1e-9 || Math.abs(p[1] - y1) < 1e-9)).map(([, i]) => i);
console.log("esquinas de la zapata:", esq.map((i) => `${i} (${D.nodes[i].join(", ")})`).join(" · "));
D.nodeInputs.supports = Object.fromEntries(esq.map((i) => [i, [true, true, true, false, false, false]]));
D.nodeInputs.springs = [];
const { deform } = await cargarFem();
const m = await empaquetar(`export { analyze } from "${R}/hekatan-fem/src/analyze";\n`, "muro4" + Date.now());
const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
const ni = { supports: aMap(D.nodeInputs.supports), loads: aMap(D.nodeInputs.loads) };
const r = deform(D.nodes, D.elements, ni, ei);
let F = [0, 0, 0], Rr = [0, 0, 0];
for (const f of ni.loads.values()) for (let c = 0; c < 3; c++) F[c] += f[c];
for (const v of r.reactions.values()) for (let c = 0; c < 3; c++) Rr[c] += v[c];
console.log("cargas", F.map((v) => v.toFixed(3)), "reacciones", Rr.map((v) => v.toFixed(3)));
D.deformations = Object.fromEntries(r.deformations); D.reactions = Object.fromEntries(r.reactions);
writeFileSync(`${AQ}/muro4.json`, JSON.stringify(D));
console.log("nudos", D.nodes.length, "elementos", D.elements.length);
