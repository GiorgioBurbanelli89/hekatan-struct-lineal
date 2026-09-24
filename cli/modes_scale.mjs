#!/usr/bin/env node
/**
 * ¿Cuántos modos hacen falta REALMENTE para llegar al 90% de masa (NEC-15 §6.2.2)
 * en cada tamaño de edificio? Sube nModes hasta que ΣUx y ΣUy ≥ 90% y anota el costo.
 * Objetivo: elegir un default que escale con los pisos en vez de los 12 fijos.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(join(__dirname, "sweep_case.mjs"), "utf8");
const cut = src.indexOf("// ────────── caso ──────────");
const tmp = join(__dirname, ".scale_lib.mjs");
writeFileSync(tmp, src.slice(0, cut) + "\nexport { buildEdificio, deform, modalAnalysis, mod };\n");
const lib = await import(pathToFileURL(tmp).href);

const base = { nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, ms: 1.0 };
const sys = { slab: true, walls: true };
const casos = [[2,2,4],[2,2,6],[2,2,8],[3,3,6],[3,3,8],[4,4,8],[6,6,8]];

const rows = [];
// Regla de Jorge (18-sep-2026): la masa participativa se imprime con las SEIS
// sumatorias (SUx SUy SUz SRx SRy SRz). El 90 % se juzga en X e Y, que son las
// direcciones de analisis; las otras cuatro delatan si faltan modos.
console.log("caso       GDL   nModes    T1     SumUx%  SumUy%  ¿≥90%?   t(ms)   regla 3·pisos  |  las SEIS sumatorias (%)");
console.log("-".repeat(88));
for (const [nbx, nby, nF] of casos) {
  const tag = `${nbx}x${nby}x${nF}`;
  const d = lib.buildEdificio({ ...base, nbx, nby, nFloors: nF }, sys);
  const eiMass = { ...d.ei, densities: new Map([...d.ei.densities].map(([k, v]) => [k, v / 9.80665])) };
  const dof = d.nodes.length * 6;
  const regla = 3 * nF;
  for (const nModes of [12, regla, 24, 30, 36, 48].filter((v, i, a) => a.indexOf(v) === i).sort((a,b)=>a-b)) {
    const t = performance.now();
    let out;
    try { out = lib.modalAnalysis(d.nodes, d.elements, d.ni, eiMass, nModes, 1); }
    catch (e) { console.log(`${tag.padEnd(9)} ${String(dof).padStart(6)} ${String(nModes).padStart(7)}  ERROR ${String(e?.message).slice(0,60)}`); break; }
    const dt = +(performance.now() - t).toFixed(0);
    const mp = out.massParticipation || [];
    const sx = mp.reduce((s, r) => s + (r[0] || 0), 0) * 100;
    const sy = mp.reduce((s, r) => s + (r[1] || 0), 0) * 100;
    const T1 = out.frequencies[0] > 0 ? 1 / out.frequencies[0] : 0;
    const ok = sx >= 90 && sy >= 90;
    const S = ["Ux","Uy","Uz","Rx","Ry","Rz"].map((k, d) => +(mp.reduce((s, r) => s + (r[d] || 0), 0) * 100).toFixed(2));
    rows.push({ tag, dof, nModes, T1: +T1.toFixed(4), sumUx: +sx.toFixed(1), sumUy: +sy.toFixed(1),
                sum: { Ux: S[0], Uy: S[1], Uz: S[2], Rx: S[3], Ry: S[4], Rz: S[5] }, ok, ms: dt, regla });
    console.log(`${tag.padEnd(9)} ${String(dof).padStart(6)} ${String(nModes).padStart(7)} ${T1.toFixed(4).padStart(8)} ${sx.toFixed(1).padStart(7)} ${sy.toFixed(1).padStart(7)}  ${(ok?"si":"NO").padStart(6)} ${String(dt).padStart(7)}   ${nModes === regla ? "<= 3·pisos" : ""}  |  ${["Ux","Uy","Uz","Rx","Ry","Rz"].map((k, d) => `Σ${k} ${S[d].toFixed(1)}`).join("  ")}`);
    if (ok && nModes >= regla) break;
  }
  console.log("");
}
writeFileSync(join(__dirname, "modes_scale.json"), JSON.stringify(rows, null, 1));
console.log("→ cli/modes_scale.json");
