// Las SEIS sumatorias de masa participativa del dual 2x2x4 del articulo, en Hekatan.
// Regla de Jorge (18-sep-2026): modos 1-3 como minimo y SUx SUy SUz SRx SRy SRz.
// Misma variante H (defecto del motor) y misma malla 1.0 m (545 nudos) que come SAP2000.
//   node hekatan_masa_6dir.mjs
// Sale -> hekatan_masa_6dir.json
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HS = join(AQUI, "..", "..");
const S = process.env.HK_TMP || "C:/Users/j-b-j/AppData/Local/Temp/claude/C--Users-j-b-j-Documents-Hekatan-Calc-1-0-0/ec728c25-30db-4d6e-8bb8-a562b1b16aed/scratchpad/dual6";
mkdirSync(S, { recursive: true });

// 1) buildEdificio: la copia fiel de testM.ts que usa cli/sweep_case.mjs
const src = readFileSync(join(HS, "cli", "sweep_case.mjs"), "utf8").replace(/\r\n/g, "\n");
const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
if (a < 0 || b < 0) throw new Error("no encuentro buildEdificio en sweep_case.mjs");
writeFileSync(S + "/_build.mjs", src.slice(a, b) + "\nexport { buildEdificio, GRAV };\n");
const { buildEdificio, GRAV } = await import(pathToFileURL(S + "/_build.mjs").href);

// 2) el modal del motor, parcheado para devolver TAMBIEN la matriz de participacion
let w = readFileSync(join(HS, "tests", "lib", "wasm.mjs"), "utf8").replace(/\r\n/g, "\n");
const r1 = 'export const RAIZ = join(AQUI, "..", "..");';
const r2 = "  gc.forEach(p => mod._free(p));\n  return f;";
if (!w.includes(r1) || !w.includes(r2)) throw new Error("tests/lib/wasm.mjs cambio: revisar parche");
w = w.replace(r1, `export const RAIZ = ${JSON.stringify(HS.replace(/\\/g, "/"))};`).replace(r2,
`  const mpP = mod.HEAPU32[mao / 4], mR = mod.HEAPU32[maro / 4], mC = mod.HEAPU32[maco / 4]; const mp = [];
  if (mpP && mR && mC) { const q = new Float64Array(mod.HEAPF64.buffer, mpP, mR * mC); for (let i = 0; i < mR; i++) mp.push(Array.from(q.slice(i * mC, (i + 1) * mC))); }
  gc.forEach(p => mod._free(p));
  return { f, mp, mR, mC };`);
writeFileSync(S + "/_wasm_mp.mjs", w);
const { modal } = await import(pathToFileURL(S + "/_wasm_mp.mjs").href);

// 3) el modelo del articulo
const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0 };
const d = buildEdificio(p, { slab: true, walls: true });
// sweep_case es anterior al 8-ago: el eje FUERTE de la viga iba en momentsOfInertiaY.
let nb = 0;
d.kinds.forEach((k, e) => {
  if (k !== "beam") return;
  const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
  d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z)); nb++;
});
const eiMasa = { ...d.ei, densities: new Map([...d.ei.densities].map(([k, v]) => [k, v / GRAV])) };
console.log(`nudos ${d.nodes.length}, vigas corregidas ${nb}`);

// 4) variante H = DEFECTO del motor: los dos mapas VACIOS (nada de plateFormulations/drillingTypes)
const DIR = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];
// lateral = 0 -> masa COMPLETA en las tres direcciones (lo que se comparo con SAP2000)
// lateral = 1 -> masa SOLO lateral, que es lo que ETABS hace por defecto
const LAT = Number(process.env.HK_LATERAL ?? 0);
const out = { modelo: p, nudos: d.nodes.length, variante: "H DEFECTO DE HOY (sin-binario)", lateral: LAT, casos: {} };
for (const N of [12, 20, 24]) {
  const ei = { ...eiMasa, plateFormulations: new Map(), drillingTypes: new Map() };
  const t0 = performance.now();
  const { f, mp, mR, mC } = await modal(d.nodes, d.elements, { supports: d.ni.supports }, ei, N, LAT);
  const T = f.map((x) => (x > 0 ? 1 / x : 0));
  if (mC !== 6) throw new Error(`la matriz de participacion trae ${mC} columnas, no 6`);
  const sum = {};
  DIR.forEach((nom, c) => { sum[nom] = mp.reduce((s, r) => s + (r[c] || 0), 0) * 100; });
  out.casos[N] = { T, mp, mR, mC, sum, ms: +(performance.now() - t0).toFixed(0) };
  console.log(`\n${N} modos  T1-3 ${T.slice(0, 3).map((x) => x.toFixed(4)).join("  ")}   (${out.casos[N].ms} ms)`);
  console.log("  " + DIR.map((k) => `S${k} ${sum[k].toFixed(4)}`).join("  "));
}

// 5) los modos 1-3 con su participacion, direccion a direccion
console.log("\nmodos 1-3 (12 modos), participacion en % :");
console.log("modo   T(s)   " + DIR.map((k) => k.padStart(8)).join(""));
for (let i = 0; i < 3; i++) {
  const r = out.casos[12].mp[i];
  console.log(`  ${i + 1}  ${out.casos[12].T[i].toFixed(4)}  ` + r.map((v) => (100 * v).toFixed(2).padStart(8)).join(""));
}

const SAL = LAT ? "hekatan_masa_6dir_lateral.json" : "hekatan_masa_6dir.json";
writeFileSync(join(AQUI, SAL), JSON.stringify(out, null, 1));
console.log("\nok (lateral=" + LAT + ") -> " + SAL);
