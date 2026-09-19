#!/usr/bin/env node
/**
 * ¿Alcanzan los 12 modos (default de testM.ts) cuando suben los pisos?
 * NEC-15 §6.2.2 exige ≥90% de masa participativa en cada dirección. Si no se llega,
 * el cortante dinámico sale bajo y el chequeo Vdin/Vest se dispara sin ser un problema
 * real de la estructura — es falta de modos.
 * Modelo chico (2x2 vanos) para que sea barato: acá interesa el N° de pisos, no el tamaño.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "sweep_case.mjs"), "utf8");
const cut = src.indexOf("// ────────── caso ──────────");
const tmp = join(__dirname, ".modes_lib.mjs");
writeFileSync(tmp, src.slice(0, cut) + "\nexport { buildEdificio, deform, modalAnalysis, mod };\n");
const lib = await import(pathToFileURL(tmp).href);

const base = { nbx: 2, nby: 2, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, ms: 1.0 };
const sys = { slab: true, walls: true };
const rows = [];
// Regla de Jorge (18-sep-2026): la masa participativa se imprime con las SEIS
// sumatorias (SUx SUy SUz SRx SRy SRz). El 90 % se juzga en X e Y, que son las
// direcciones de analisis; las otras cuatro delatan si faltan modos.
console.log("pisos  nModes    T1      SumUx%   SumUy%   ¿≥90% ambos?   t(ms)   |  las SEIS sumatorias (%)");
for (const nF of [2, 4, 6, 8]) {
  const d = lib.buildEdificio({ ...base, nFloors: nF }, sys);
  const eiMass = { ...d.ei, densities: new Map([...d.ei.densities].map(([k, v]) => [k, v / 9.80665])) };
  for (const nModes of [12, 18, 24, 30, 36, 48]) {
    const t = performance.now();
    const out = lib.modalAnalysis(d.nodes, d.elements, d.ni, eiMass, nModes, 1);
    const dt = (performance.now() - t).toFixed(0);
    const mp = out.massParticipation || [];
    const sx = mp.reduce((s, r) => s + (r[0] || 0), 0) * 100;
    const sy = mp.reduce((s, r) => s + (r[1] || 0), 0) * 100;
    const T1 = out.frequencies[0] > 0 ? 1 / out.frequencies[0] : 0;
    const ok = sx >= 90 && sy >= 90;
    const S = ["Ux","Uy","Uz","Rx","Ry","Rz"].map((k, d) => +(mp.reduce((s, r) => s + (r[d] || 0), 0) * 100).toFixed(2));
    rows.push({ nF, nModes, T1: +T1.toFixed(4), sumUx: +sx.toFixed(1), sumUy: +sy.toFixed(1),
                sum: { Ux: S[0], Uy: S[1], Uz: S[2], Rx: S[3], Ry: S[4], Rz: S[5] }, ok, ms: +dt });
    console.log(`${String(nF).padStart(5)} ${String(nModes).padStart(7)} ${T1.toFixed(4).padStart(8)} ${sx.toFixed(1).padStart(8)} ${sy.toFixed(1).padStart(8)}   ${(ok ? "sí" : "NO").padStart(12)} ${dt.padStart(7)}   |  ${["Ux","Uy","Uz","Rx","Ry","Rz"].map((k, d) => `Σ${k} ${S[d].toFixed(1)}`).join("  ")}`);
    if (ok) break;   // basta con el primero que cumple
  }
}
writeFileSync(join(__dirname, "modes_results.json"), JSON.stringify(rows, null, 1));
console.log("\n→ cli/modes_results.json");
