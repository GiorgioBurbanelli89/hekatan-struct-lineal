// Dual del articulo (Test M 2x2x4, malla modal 1.0 m) con 7 combinaciones placa/membrana,
// para ver QUE PASA si no se usa lo extraido del binario. Vuelca tambien el modelo para SAP2000.
//   node hekatan_variantes.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const HS = "C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct-limpio";
const S = (process.env.HK_TMP || (process.env.TEMP || "/tmp") + "/hk_art_dual").replace(/\\/g, "/");
(await import("node:fs")).mkdirSync(S, { recursive: true });

// 1) buildEdificio: la copia fiel de testM.ts que usa cli/sweep_case.mjs
const src = readFileSync(HS + "/cli/sweep_case.mjs", "utf8").replace(/\r\n/g, "\n");
const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
if (a < 0 || b < 0) throw new Error("no encuentro buildEdificio en sweep_case.mjs");
writeFileSync(S + "/_build.mjs", src.slice(a, b) + "\nexport { buildEdificio, GRAV };\n");
const { buildEdificio, GRAV } = await import(pathToFileURL(S + "/_build.mjs").href);

// 2) modal: tests/lib/wasm.mjs (el motor), devolviendo ademas la masa participativa
let w = readFileSync(HS + "/tests/lib/wasm.mjs", "utf8").replace(/\r\n/g, "\n");
const r1 = 'export const RAIZ = join(AQUI, "..", "..");';
const r2 = "  gc.forEach(p => mod._free(p));\n  return f;";
if (!w.includes(r1) || !w.includes(r2)) throw new Error("tests/lib/wasm.mjs cambio: revisar parche");
w = w.replace(r1, `export const RAIZ = ${JSON.stringify(HS)};`).replace(r2,
`  const mpP = mod.HEAPU32[mao / 4], mR = mod.HEAPU32[maro / 4], mC = mod.HEAPU32[maco / 4]; const mp = [];
  if (mpP && mR && mC) { const q = new Float64Array(mod.HEAPF64.buffer, mpP, mR * mC); for (let i = 0; i < mR; i++) mp.push(Array.from(q.slice(i * mC, (i + 1) * mC))); }
  gc.forEach(p => mod._free(p));
  return { f, mp, mR, mC };`);
writeFileSync(S + "/_wasm_mp.mjs", w);
const { modal } = await import(pathToFileURL(S + "/_wasm_mp.mjs").href);

// 3) modelo
const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0 };
const d = buildEdificio(p, { slab: true, walls: true });
// sweep_case es anterior al 8-ago: pone el eje FUERTE de la viga en momentsOfInertiaY.
// testM.ts (y el motor) hoy: momentsOfInertiaZ = I33 = fuerte. Se cambia para la viga.
let nb = 0;
d.kinds.forEach((k, e) => {
  if (k !== "beam") return;
  const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
  d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z)); nb++;
});
const eiMasa = { ...d.ei, densities: new Map([...d.ei.densities].map(([k, v]) => [k, v / GRAV])) };
const cuenta = (t) => d.kinds.filter((k) => k === t).length;
console.log(`nudos ${d.nodes.length}, col ${cuenta("col")}, viga ${nb}, losa ${cuenta("slab")}, muro ${cuenta("wall")}`);

// 4) MEMBRANA publicada o calibrada (29-sep-2026): la placa se deja en el defecto del motor (MITC4 + Wilson)
//    y solo cambia el drilling. dt 13 = defecto (ITW + proyección, 2x2 + reloj de arena khg calibrado, γ 0.4μ);
//    3 = ITW 1990 tal cual el paper (3x3); 8 = ITW + proyección de Taylor (3x3); 2 = Q4 + Hughes-Brezzi.
//    gam = γ/μ (drillingPenaltyScales): 0.4 = ajustado a ETABS; 1.0 = el del paper.
const SAP = JSON.parse(readFileSync(new URL("./sap_masa_6dir.json", import.meta.url), "utf8")).casos["12"];
const V = [
  ["13 defecto (γ 0.4, reloj calibrado)", 13, null],
  ["13 con γ = μ", 13, 1.0],
  ["3 ITW 1990 (γ 0.4)", 3, 0.4],
  ["3 ITW 1990 tal cual el paper (γ = μ)", 3, 1.0],
  ["8 ITW + proyección Taylor (γ = μ)", 8, 1.0],
  ["2 Q4 + Hughes-Brezzi", 2, null],
];
const out = { modelo: p, nudos: d.nodes.length, sap: SAP.T.slice(0, 5), variantes: [] };
console.log(`SAP2000 (juez)                         T1-5 ${SAP.T.slice(0, 5).map((x) => x.toFixed(4)).join(" ")}  SUx ${SAP.sum.Ux.toFixed(2)} SUy ${SAP.sum.Uy.toFixed(2)}`);
for (const [nom, dt, gam] of V) {
  const ei = { ...eiMasa, drillingTypes: new Map(), drillingPenaltyScales: new Map() };
  d.kinds.forEach((k, e) => { if (k === "slab" || k === "wall") { ei.drillingTypes.set(e, dt); if (gam !== null) ei.drillingPenaltyScales.set(e, gam); } });
  const { f, mp } = await modal(d.nodes, d.elements, { supports: d.ni.supports }, ei, 12, 0);
  const T = f.map((x) => (x > 0 ? 1 / x : 0));
  const dif = T.slice(0, 5).map((t, k) => (100 * (t / SAP.T[k] - 1)));
  const sum = (c) => mp.reduce((s, row) => s + (row[c] || 0), 0) * 100;
  out.variantes.push({ nom, dt, gam, T, dif, sumUx: sum(0), sumUy: sum(1) });
  console.log(`${nom.padEnd(38)} T1-5 ${T.slice(0, 5).map((x) => x.toFixed(4)).join(" ")}  dif % ${dif.map((x) => x.toFixed(2)).join(" ")}  peor ${Math.max(...dif.map(Math.abs)).toFixed(2)}`);
}
writeFileSync(new URL("./hekatan_membrana_publicada.json", import.meta.url), JSON.stringify(out, null, 1));
process.exit(0);
// 5) volcado para SAP2000 (misma malla nudo a nudo)
const sup = [...d.ni.supports.keys()];
writeFileSync(S + "/dual_2x2x4.json", JSON.stringify({
  nodes: d.nodes, elements: d.elements, kinds: d.kinds, supports: sup,
  E: 2534564, nu: 0.20, rho: 2.40277, bCol: p.bCol, bBeam: p.bBeam, hBeam: p.hBeam, tSlab: p.tSlab, tWall: p.tWall,
}));
console.log("ok -> hekatan_variantes.json, dual_2x2x4.json");
