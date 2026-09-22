// Dual del articulo (Test M 2x2x4, malla modal 1.0 m) con 7 combinaciones placa/membrana,
// para ver QUE PASA si no se usa lo extraido del binario. Vuelca tambien el modelo para SAP2000.
//   node hekatan_variantes.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const HS = "C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct";
const S = "C:/Users/j-b-j/AppData/Local/Temp/claude/C--Users-j-b-j-Documents-Hekatan-Calc-1-0-0/ec728c25-30db-4d6e-8bb8-a562b1b16aed/scratchpad/dual";

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

// 4) variantes: [nombre, plateFormulation, drillingType, origen]
//    pf: 1 = DKQ (Batoz-Tahar)  3 = DKMQ (Katili)  0/2 = getBendingK_CSI (del binario)
//    dt: 2 = Q4 + Hughes-Brezzi  3 = ITW 1990 (3x3)  8 = ITW + proyeccion, gamma 0.4 medido por fuera  12 = membrana del binario
const V = [
  ["A hoy Test M: CSIthick + HB", 2, 2, "BINARIO placa"],
  ["B defecto app: CSIthick + t12", 0, 12, "BINARIO placa+membrana"],
  ["C DKQ + t12", 1, 12, "BINARIO membrana"],
  ["D DKQ + ITW 1990", 1, 3, "publicado"],
  ["E DKQ + HB", 1, 2, "publicado"],
  ["F DKQ + ITW t8", 1, 8, "publicado + gamma medido"],
  ["G DKMQ + HB", 3, 2, "publicado"],
  ["H DEFECTO DE HOY (sin-binario)", null, null, "defecto del motor"],
];
const out = { modelo: p, nudos: d.nodes.length, variantes: [] };
for (const [nom, pf, dt, origen] of V) {
  for (const lateral of [0]) {
    const ei = { ...eiMasa, plateFormulations: new Map(), drillingTypes: new Map() };
    if (pf !== null) d.kinds.forEach((k, e) => { if (k === "slab" || k === "wall") { ei.plateFormulations.set(e, pf); ei.drillingTypes.set(e, dt); } });
    const t0 = performance.now();
    const r = modal(d.nodes, d.elements, { supports: d.ni.supports }, ei, 12, lateral);
    const { f, mp, mR, mC } = await r;
    const T = f.map((x) => (x > 0 ? 1 / x : 0));
    const sum = (c) => mp.reduce((s, row) => s + (row[c] || 0), 0) * 100;
    const fila = { nom, pf, dt, origen, lateral, T, mp, mR, mC, sumUx: sum(0), sumUy: sum(1), ms: +(performance.now() - t0).toFixed(0) };
    out.variantes.push(fila);
    console.log(`${nom.padEnd(32)} lat=${lateral}  T1-5 ${T.slice(0, 5).map((x) => x.toFixed(4)).join(" ")}  SUx ${fila.sumUx.toFixed(1)} SUy ${fila.sumUy.toFixed(1)}  [${mR}x${mC}] ${fila.ms} ms`);
  }
}
writeFileSync(S + "/hekatan_variantes.json", JSON.stringify(out, null, 1));

// 5) volcado para SAP2000 (misma malla nudo a nudo)
const sup = [...d.ni.supports.keys()];
writeFileSync(S + "/dual_2x2x4.json", JSON.stringify({
  nodes: d.nodes, elements: d.elements, kinds: d.kinds, supports: sup,
  E: 2534564, nu: 0.20, rho: 2.40277, bCol: p.bCol, bBeam: p.bBeam, hBeam: p.hBeam, tSlab: p.tSlab, tWall: p.tWall,
}));
console.log("ok -> hekatan_variantes.json, dual_2x2x4.json");
