#!/usr/bin/env node
/** Lanza sweep_case.mjs en proceso hijo con timeout, para que un cuelgue no mate el barrido. */
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASE = join(__dirname, "sweep_case.mjs");
const TIMEOUT = +(process.env.SWEEP_TIMEOUT || 180000);

function run(args) {
  return new Promise(res => {
    const t0 = Date.now();
    const ch = spawn(process.execPath, ["--max-old-space-size=4096", CASE, ...args.map(String)], { stdio: ["ignore", "pipe", "pipe"] });
    let out = "", err = "";
    ch.stdout.on("data", d => out += d);
    ch.stderr.on("data", d => err += d);
    const to = setTimeout(() => { ch.kill("SIGKILL"); }, TIMEOUT);
    ch.on("close", code => {
      clearTimeout(to);
      const wall = Date.now() - t0;
      const line = out.trim().split("\n").filter(l => l.startsWith("{")).pop();
      if (line) { try { const o = JSON.parse(line); o.wall = wall; return res(o); } catch {} }
      res({ nbx: +args[0], nby: +args[1], nF: +args[2], msDisplay: +(args[3] ?? 0.75),
            FAIL: wall >= TIMEOUT - 500 ? "TIMEOUT/COLGADO" : `EXIT ${code}`,
            err: err.split("\n").filter(Boolean).slice(-3).join(" | ").slice(0, 300), wall });
    });
  });
}

const cases = [];
// A) crecer PISOS con grilla fija 2x2 (lo que reportó el usuario: "muchos pisos")
for (const nF of [1, 2, 4, 6, 8]) cases.push([2, 2, nF]);
// B) crecer VANOS con 4 pisos
for (const nb of [1, 2, 3, 4, 5, 6]) cases.push([nb, nb, 4]);
// C) esquinas grandes
cases.push([4, 4, 8], [5, 5, 8], [6, 6, 8], [6, 6, 6], [3, 3, 8], [6, 3, 8]);
// D) malla de display más fina (peor caso del slider ms=0.5)
cases.push([3, 3, 6, 0.5], [4, 4, 6, 0.5], [6, 6, 8, 0.5]);

const results = [];
// Regla de Jorge (18-sep-2026): las SEIS sumatorias, hasta SRz.
const H = ["nbx","nby","nF","ms","nodDisp","dofDisp","tDisp","nodMod","dofMod","cap>","tMod","T1","SUx","SUy","SUz","SRx","SRy","SRz","niv","tTot","wall","FAIL"];
console.log(H.map((h,i)=>h.padStart(i<4?4:8)).join(" "));
for (const c of cases) {
  const r = await run(c);
  results.push(r);
  const row = [r.nbx, r.nby, r.nF, r.msDisplay,
    r.nodes_display ?? "-", r.dof_display ?? "-", r.t_deform_display ?? "-",
    r.nodes_modal ?? "-", r.dof_modal ?? "-", r.dofCapExceeded ? "SI" : "no",
    r.t_modal ?? "-", r.T?.[0] ?? "-", r.sumUx ?? "-", r.sumUy ?? "-",
    r.sumUz ?? "-", r.sumRx ?? "-", r.sumRy ?? "-", r.sumRz ?? "-",
    r.nivelesOk === undefined ? "-" : (r.nivelesOk ? "ok" : `${r.nivelesDetectados}!=${r.pisosReales}`),
    r.t_total ?? "-", r.wall, r.FAIL ?? ""];
  console.log(row.map((v,i)=>String(v).padStart(i<4?4:8)).join(" "));
}
writeFileSync(join(__dirname, "sweep_results.json"), JSON.stringify(results, null, 1));
console.log("\n→ cli/sweep_results.json");
