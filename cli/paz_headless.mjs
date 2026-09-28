/**
 * Paz & Leigh 6.3 Space Frame por la MISMA via que la pagina.
 *
 * `cli_modal.mjs` marshalla el WASM a mano y se quedo atras cada vez que
 * modal() cambio de firma. Esto llama a modalAnalysis() de hekatan-fem, que es
 * lo que usa el navegador, asi que si aqui sale otra cosa que la referencia
 * documentada es del motor y no del arnes.
 *
 * Referencia (CLAUDE.md, 4 solvers de acuerdo):
 *   1  9.6780   2 16.9874   3 26.6149   4 29.9497   5 33.9929   6 44.9332
 *
 *   node cli/paz_headless.mjs
 */
import { pathToFileURL } from "node:url";
import { mkdtempSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const { build } = await import(
  pathToFileURL(join(RAIZ, "node_modules", "esbuild", "lib", "main.js")).href);

const dir = mkdtempSync(join(tmpdir(), "paz-"));
writeFileSync(join(dir, "entry.ts"),
  `export { modalAnalysis } from "${RAIZ.replace(/\\/g, "/")}/hekatan-fem/src/index";\n`, "utf-8");
const wasm = join(RAIZ, "hekatan-fem", "src", "cpp", "built", "deform.wasm");
if (!existsSync(wasm)) { console.error("no esta " + wasm); process.exit(1); }
copyFileSync(wasm, join(dir, "deform.wasm"));

const outFile = join(dir, "bundle.mjs");
await build({
  entryPoints: [join(dir, "entry.ts")], bundle: true, format: "esm",
  platform: "node", outfile: outFile, logLevel: "error",
});
const { modalAnalysis } = await import(pathToFileURL(outFile).href);

// ── Modelo: identico al de examples/src/beams/pazEjemplo63.ts ──────────────────────
const E = 29500, nu = 0.3, G = E / (2 * (1 + nu));
const H = 180, BX = 114, BY = 240;
const RHO = 490 / 1000 / 12 ** 3 / 386.4;
const COL_A = 43.0, COL_Iz = 5630, COL_Iy = 391, COL_J = 34.8;
const GIR_A = 24.7, GIR_Iz = 928, GIR_Iy = 225, GIR_J = 5.90;

const nodes = [
  [0, 0, 0], [0, 0, H], [0, BY, 0], [0, BY, H],
  [BX, 0, 0], [BX, 0, H], [BX, BY, 0], [BX, BY, H],
];
const elements = [
  [0, 1], [2, 3], [4, 5], [6, 7],
  [1, 5], [3, 7], [1, 3], [5, 7],
];
const fijo = [true, true, true, true, true, true];
const nodeInputs = { supports: new Map([[0, fijo], [2, fijo], [4, fijo], [6, fijo]]) };
const eMap = (c, g) => new Map(elements.map((_, i) => [i, i < 4 ? c : g]));

// Ejes locales CSI: I33 (momentsOfInertiaZ) es el fuerte.
const elementInputs = {
  elasticities: eMap(E, E),
  shearModuli: eMap(G, G),
  areas: eMap(COL_A, GIR_A),
  momentsOfInertiaY: eMap(COL_Iy, GIR_Iy),   // debil  -> I22
  momentsOfInertiaZ: eMap(COL_Iz, GIR_Iz),   // fuerte -> I33
  torsionalConstants: eMap(COL_J, GIR_J),
  densities: new Map(elements.map((_, i) => [i, RHO])),
};

const REF = [9.6780, 16.9874, 26.6149, 29.9497, 33.9929, 44.9332];
const out = modalAnalysis(nodes, elements, nodeInputs, elementInputs, 6);
const f = out.frequencies ?? [];

console.log("modo   f (Hz)      referencia     dif %");
for (let i = 0; i < REF.length; i++) {
  const v = f[i];
  if (v === undefined) { console.log(`${String(i + 1).padStart(3)}   (no hay modo)`); continue; }
  const d = (100 * (v - REF[i])) / REF[i];
  console.log(`${String(i + 1).padStart(3)} ${v.toFixed(4).padStart(10)} ${REF[i].toFixed(4).padStart(14)} ${d.toFixed(3).padStart(9)} %`);
}
