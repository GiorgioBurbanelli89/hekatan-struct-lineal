/**
 * Vuelca los MISMO arrays que modalCpp.ts armaría para el WASM, a un binario
 * que el main C++ nativo lee para llamar modal() sin emscripten.
 *
 *   node dump_modal_input.mjs pm.heks pm_input.bin [nModos] [lateral,lump,inclElem] [drillScale]
 *
 * El ultimo argumento es OPCIONAL: si se da, pone esa escala de drilling
 * (Hughes-Brezzi, gamma = G*t*escala) en TODAS las cascaras. Sirve para probar
 * por el camino nativo lo mismo que `modal_headless.mjs --drill <escala>`.
 */
import { pathToFileURL } from "node:url";
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const RAIZ = (process.env.USERPROFILE ?? "") + "/Documents/Hekatan Calc 1.0.0/hekatan-struct";
const { build } = await import(
  pathToFileURL(`${RAIZ}/node_modules/esbuild/lib/main.js`).href);

const [, , heksPath = "pm.heks", salida = "pm_input.bin",
   nModosArg = "6", flags = "0,0,1", drillArg] = process.argv;
// flags: lateral,lump,includeElements  (igual que modal_headless.mjs)
const [lateralArg, lumpArg, inclElemArg] = flags.split(",");
const num_modes = parseInt(nModosArg, 10);
const lateral = parseInt(lateralArg, 10);
const lump = parseInt(lumpArg, 10);
const includeElements = parseInt(inclElemArg, 10);

const dir = mkdtempSync(join(tmpdir(), "hkDump-"));
writeFileSync(join(dir, "entry.ts"), `
  export { cliModeler } from "${RAIZ}/examples/src/cli-modeler/cliModeler";
`, "utf-8");
const outFile = join(dir, "bundle.mjs");
const wasm = `${RAIZ}/hekatan-fem/src/cpp/built/deform.wasm`;
if (!existsSync(wasm)) { console.error("no esta " + wasm); process.exit(1); }
copyFileSync(wasm, join(dir, "deform.wasm"));

await build({
  entryPoints: [join(dir, "entry.ts")], bundle: true, format: "esm",
  platform: "node", outfile: outFile, logLevel: "error",
});
const { cliModeler } = await import(pathToFileURL(outFile).href);

globalThis.window = { __hekatanCliScript: readFileSync(heksPath, "utf-8") };
const st = (v) => ({ val: v });
const states = {
  nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
  deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]),
  springs: st([]),
};
cliModeler.build({}, states);

const nodes = states.nodes.val;
const elements = states.elements.val;
const nodeInputs = states.nodeInputs.val;
const elementInputs = states.elementInputs.val;

// ── empaquetado IDENTICO a modalCpp.ts ───────────────────────────────
const supportKeys = nodeInputs.supports ? Array.from(nodeInputs.supports.keys()) : [];
const supportValues = nodeInputs.supports
  ? Array.from(nodeInputs.supports.values()).flat().map((b) => (b ? 1 : 0))
  : [];
const pEI = (m) => ({
  keys: m ? Array.from(m.keys()) : [],
  values: m ? Array.from(m.values()) : [],
});
const elasticities = pEI(elementInputs.elasticities);
const areas = pEI(elementInputs.areas);
const moiZ = pEI(elementInputs.momentsOfInertiaZ);
const moiY = pEI(elementInputs.momentsOfInertiaY);
const shearMod = pEI(elementInputs.shearModuli);
const torsion = pEI(elementInputs.torsionalConstants);
const densities = pEI(elementInputs.densities);
const thicknesses = pEI(elementInputs.thicknesses);
const poissons = pEI(elementInputs.poissonsRatios);
const memMods = pEI(elementInputs.membraneModifiers);
const bendMods = pEI(elementInputs.bendingModifiers);
const plateFormMap = elementInputs.plateFormulations;
const plateFormKeys = plateFormMap ? Array.from(plateFormMap.keys()) : [];
const plateFormValues = plateFormMap ? Array.from(plateFormMap.values()) : [];
// DRILLING: tipo (int) y escala (double). Si se pasa `drillScale` por linea de
// comandos se fuerza en todas las cascaras (las que tienen espesor); si no, van
// los mapas del modelo, y si estan vacios el C++ usa el defecto (tipo 2, 1.0).
const drillTypeMap = new Map(elementInputs.drillingTypes ?? []);
const drillScaleMap = new Map(elementInputs.drillingPenaltyScales ?? []);
if (drillArg !== undefined && drillArg !== "") {
  const esc = parseFloat(drillArg);
  for (const [idx] of elementInputs.thicknesses ?? []) {
    drillTypeMap.set(idx, 2);
    drillScaleMap.set(idx, esc);
  }
  console.error(`  [drill] escala Hughes-Brezzi = ${esc} en ${drillScaleMap.size} cascaras`);
}
const drillTypeKeys = Array.from(drillTypeMap.keys());
const drillTypeValues = Array.from(drillTypeMap.values());
const drillScale = { keys: Array.from(drillScaleMap.keys()),
                     values: Array.from(drillScaleMap.values()) };
const shearY = pEI(elementInputs.shearAreasY);
const shearZ = pEI(elementInputs.shearAreasZ);
const locang = pEI(elementInputs.localAngles);

function releasesA12(v) {
  const out = new Array(12).fill(0);
  if (!v) return out;
  if (v.length >= 12) { for (let i = 0; i < 12; i++) out[i] = v[i] ? 1 : 0; return out; }
  const pos = [3, 4, 5, 9, 10, 11];
  for (let i = 0; i < 6 && i < v.length; i++) if (v[i]) out[pos[i]] = 1;
  return out;
}
const relMap = elementInputs.momentReleases;
const relKeys = relMap ? Array.from(relMap.keys()) : [];
const relValues = relMap ? Array.from(relMap.values()).flatMap(releasesA12) : [];

const nodemass = pEI(nodeInputs.masses);
const diaph = pEI(nodeInputs.diaphragms);
const springsFlat = (states.springs?.val || nodeInputs.springs || [])
  .flatMap((s) => [s.node, s.dof, s.k]);

// ── escritura binaria (secuencia exacta, como en modalCpp.ts) ────────
const w = [];
w.push({ t: "u32", n: nodes.length });
for (let i = 0; i < nodes.length; i++) for (let k = 0; k < 3; k++) w.push({ t: "f64", v: nodes[i][k] });
const flatEI = elements.flat(); w.push({ t: "u32", n: flatEI.length }); flatEI.forEach((v) => w.push({ t: "u32", v }));
const sizes = elements.map((e) => e.length); w.push({ t: "u32", n: sizes.length }); sizes.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: supportKeys.length }); supportKeys.forEach((v) => w.push({ t: "u32", v })); supportValues.forEach((v) => w.push({ t: "u8", v }));
for (const m of [elasticities, areas, moiZ, moiY, shearMod, torsion, densities, thicknesses, poissons, memMods, bendMods, shearY, shearZ, locang]) {
  w.push({ t: "u32", n: m.values.length }); m.values.forEach((v) => w.push({ t: "f64", v }));
  w.push({ t: "u32", n: m.keys.length }); m.keys.forEach((v) => w.push({ t: "u32", v }));
}
w.push({ t: "u32", n: plateFormValues.length }); plateFormValues.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: plateFormKeys.length }); plateFormKeys.forEach((v) => w.push({ t: "u32", v }));
// drilling: tipo (u32) y escala (f64), en el mismo orden que la firma de modal()
w.push({ t: "u32", n: drillTypeValues.length }); drillTypeValues.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: drillTypeKeys.length }); drillTypeKeys.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: drillScale.values.length }); drillScale.values.forEach((v) => w.push({ t: "f64", v }));
w.push({ t: "u32", n: drillScale.keys.length }); drillScale.keys.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: relKeys.length }); relKeys.forEach((v) => w.push({ t: "u32", v })); relValues.forEach((v) => w.push({ t: "u8", v }));
w.push({ t: "u32", n: nodemass.values.length }); nodemass.values.forEach((v) => w.push({ t: "f64", v }));
w.push({ t: "u32", n: nodemass.keys.length }); nodemass.keys.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: diaph.values.length }); diaph.values.forEach((v) => w.push({ t: "f64", v }));
w.push({ t: "u32", n: diaph.keys.length }); diaph.keys.forEach((v) => w.push({ t: "u32", v }));
w.push({ t: "u32", n: springsFlat.length / 3 }); springsFlat.forEach((v) => w.push({ t: "f64", v }));
w.push({ t: "u32", v: num_modes }); w.push({ t: "u32", v: lateral }); w.push({ t: "u32", v: lump }); w.push({ t: "u32", v: includeElements });

const out2 = Buffer.alloc(w.length * 8);
let o = 0;
for (const x of w) {
  if (x.t === "u32") { out2.writeUInt32LE(x.n ?? x.v, o); o += 4; }
  else if (x.t === "f64") { out2.writeDoubleLE(x.v, o); o += 8; }
  else { out2.writeUInt8(x.v, o); o += 1; }
}
writeFileSync(salida, out2.subarray(0, o));
console.log(`${salida}: ${nodes.length} nodos · ${elements.length} elems · ` +
  `${w.length} items (${o} bytes) · flags lateral=${lateral} lump=${lump} inclElem=${includeElements} nModos=${num_modes}`);
