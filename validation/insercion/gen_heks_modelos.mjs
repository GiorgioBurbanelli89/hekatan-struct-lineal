// Escribe un .heks por cada modelo A-J del estudio (kN, m), con la MISMA geometría que struct_estudio.mjs.
import { writeFileSync, mkdirSync } from "node:fs";
import { MODELOS } from "./struct_estudio.mjs";
mkdirSync("validation/insercion/etabs/modelos", { recursive: true });
const E = 2.5e7, nu = 0.2, Qk = 5;
for (const id of Object.keys(MODELOS)) {
  const M = MODELOS[id];
  const Lx = M.nx * M.Lp, Ly = M.ny * M.Lp;
  const N = [], idx = new Map();
  const nodo = (x, y, z) => { const k = [x, y, z].map(w => w.toFixed(4)).join(","); if (!idx.has(k)) { idx.set(k, N.length + 1); N.push([x, y, z]); } return idx.get(k); };
  const fr = [], sh = [];
  for (let i = 0; i <= M.nx; i++) for (let j = 0; j <= M.ny; j++) fr.push(["col", nodo(i * M.Lp, j * M.Lp, 0), nodo(i * M.Lp, j * M.Lp, M.H)]);
  for (let j = 0; j <= M.ny; j++) for (let x = 0; x < Lx; x++) fr.push(["viga", nodo(x, j * M.Lp, M.H), nodo(x + 1, j * M.Lp, M.H)]);
  for (let i = 0; i <= M.nx; i++) for (let y = 0; y < Ly; y++) fr.push(["viga", nodo(i * M.Lp, y, M.H), nodo(i * M.Lp, y + 1, M.H)]);
  for (let x = -M.v; x < Lx + M.v; x++) for (let y = -M.v; y < Ly + M.v; y++) { if (M.anillo && x >= 0 && x < Lx && y >= 0 && y < Ly) continue; sh.push([nodo(x, y, M.H), nodo(x + 1, y, M.H), nodo(x + 1, y + 1, M.H), nodo(x, y + 1, M.H)]); }
  const L = [];
  N.forEach((p, i) => L.push(`node ${i + 1} ${p[0]} ${p[1]} ${p[2]}`));
  const J = (a, b) => a * b ** 3 * (1 / 3 - 0.21 * (b / a) * (1 - b ** 4 / (12 * a ** 4)));
  let nid = 1;
  fr.forEach(([tp, a, b]) => { const [t2, t3] = tp === "col" ? [M.col, M.col] : [M.bb, M.bh];
    L.push(`frame ${nid++} ${a} ${b} ${E} ${t2 * t3} ${t3 * t2 ** 3 / 12} ${t2 * t3 ** 3 / 12} ${J(Math.max(t2, t3), Math.min(t2, t3))} ${nu} 0`); });
  const s0 = nid; sh.forEach(q => L.push(`shell ${nid++} ${q.join(" ")} ${M.t} ${E} 0 0`));
  L.push(`shelltype ${s0}-${nid - 1} thin`, `shellnu ${s0}-${nid - 1} ${nu}`);
  fr.filter(f => f[0] === "col").forEach(f => L.push(`support ${f[1]} fixed`));
  const cargas = new Map(); sh.forEach(q => q.forEach(nd => cargas.set(nd, (cargas.get(nd) ?? 0) - Qk / 4)));
  for (const [nd, f] of cargas) L.push(`load ${nd} 0 0 ${f} 0 0 0`);
  L.push("selfweight 0", "solve");
  writeFileSync(`validation/insercion/etabs/modelos/m_${id}.heks`, L.join("\n") + "\n");
  console.log(id, N.length, "nudos", fr.length, "barras", sh.length, "losas");
}
