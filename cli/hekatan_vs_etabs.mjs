#!/usr/bin/env node
/**
 * Corre el modal de Hekatan (método 3: Eigen C++ + masa lateral + Guyan, malla ms=1.0)
 * en los MISMOS casos que testm_sweep_etabs22.py, IGNORANDO el cap de 8000 GDL, y
 * compara periodos y masa modal contra ETABS 22.
 *
 * Uso: node hekatan_vs_etabs.mjs [ruta a etabs_testm_sweep.json]
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "sweep_case.mjs"), "utf8");
const cut = src.indexOf("// ────────── caso ──────────");
const tmp = join(__dirname, ".cmp_lib.mjs");
writeFileSync(tmp, src.slice(0, cut) + "\nexport { buildEdificio, deform, modalAnalysis, mod };\n");
const lib = await import(pathToFileURL(tmp).href);

const etabsPath = process.argv[2] ||
  (process.env.USERPROFILE ?? "") + "/Documents/Hekatan Calc 1.0.0/validacion/etabs-api/etabs_testm_sweep.json";
const etabs = existsSync(etabsPath) ? JSON.parse(readFileSync(etabsPath, "utf8")) : [];
const findE = (nbx, nby, nF) => etabs.find(e => e.nbx === nbx && e.nby === nby && e.nF === nF);

const base = { nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, ms: 1.0 };
const sys = { slab: true, walls: true };
const NMODES = 12;

const cases = etabs.length
  ? etabs.map(e => [e.nbx, e.nby, e.nF])
  : [[2,2,4],[2,2,6],[2,2,8],[3,3,8],[4,4,8],[6,6,8]];

const rows = [];
console.log("caso        GDL   T1_Hek   T1_ETABS   dif%   T2_Hek  T2_ETABS   dif%   SUy_Hek  SUy_ETABS  tHek(ms)");
console.log("-".repeat(100));
for (const [nbx, nby, nF] of cases) {
  const tag = `${nbx}x${nby}x${nF}`;
  const r = { nbx, nby, nF };
  try {
    const d = lib.buildEdificio({ ...base, nbx, nby, nFloors: nF }, sys);
    const eiMass = { ...d.ei, densities: new Map([...d.ei.densities].map(([k, v]) => [k, v / 9.80665])) };
    const t = performance.now();
    const out = lib.modalAnalysis(d.nodes, d.elements, d.ni, eiMass, NMODES, 1);
    r.tHek = +(performance.now() - t).toFixed(0);
    r.dof = d.nodes.length * 6;
    r.T = out.frequencies.map(f => f > 0 ? +(1 / f).toFixed(5) : 0);
    const mp = out.massParticipation || [];
    r.sumUx = +(mp.reduce((s, v) => s + (v[0] || 0), 0) * 100).toFixed(2);
    r.sumUy = +(mp.reduce((s, v) => s + (v[1] || 0), 0) * 100).toFixed(2);
  } catch (e) { r.FAIL = String(e?.message || e).slice(0, 120); }
  const e = findE(nbx, nby, nF);
  if (e?.periods) { r.etabs = { T: e.periods, sumUx: e.SumUx, sumUy: e.SumUy, t: e.t_total }; }
  rows.push(r);
  const pct = (a, b) => (a && b) ? (((a - b) / b) * 100).toFixed(2) : "-";
  const f = (v, n = 4) => v === undefined || v === null ? "-" : (+v).toFixed(n);
  console.log(
    `${tag.padEnd(9)} ${String(r.dof ?? "-").padStart(6)} ${f(r.T?.[0]).padStart(8)} ${f(e?.periods?.[0]).padStart(10)} ${String(pct(r.T?.[0], e?.periods?.[0])).padStart(6)} ${f(r.T?.[1]).padStart(8)} ${f(e?.periods?.[1]).padStart(9)} ${String(pct(r.T?.[1], e?.periods?.[1])).padStart(6)} ${String(r.sumUy ?? "-").padStart(9)} ${String(e?.SumUy ?? "-").padStart(10)} ${String(r.tHek ?? r.FAIL ?? "-").padStart(9)}`
  );
}
writeFileSync(join(__dirname, "hekatan_vs_etabs.json"), JSON.stringify(rows, null, 1));
console.log("\n→ cli/hekatan_vs_etabs.json");
