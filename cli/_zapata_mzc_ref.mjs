// Referencia EXACTA para la hoja de LISP: malla uniforme n x n, Shell-THIN (MZC),
// carga nodal repartida bilineal en (xc,yc) — igual que hace la hoja.
//   node cli/_zapata_mzc_ref.mjs 4 salida.heks
import fs from "fs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const B = 1.5, Lz = 1.5, t = 0.4, E = 22940519, ks = 19613.3, P = 606, ex = 0.15, ey = 0.30;
const n = +(process.argv[2] ?? 4), sal = process.argv[3];
const dx = B / n, dy = Lz / n, nd = (i, j) => j * (n + 1) + i + 1;
const L = [`# Zapata Das 6.10 · malla uniforme ${n}x${n} · Shell-THIN (MZC) · Winkler solo compresion`];
for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++)
  L.push(`node ${nd(i, j)} ${+(i * dx).toFixed(9)} ${+(j * dy).toFixed(9)} 0`);
let s = 0;
for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
  s++;
  L.push(`shell ${s} ${nd(i, j)} ${nd(i + 1, j)} ${nd(i + 1, j + 1)} ${nd(i, j + 1)} ${t} ${E} 0 0`);
  L.push(`shelltype ${s} thin`);
  L.push(`areaspring ${s} ${ks} nodal compresion`);
}
for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) L.push(`support ${nd(i, j)} 1 1 0 0 0 1`);
// la carga, repartida bilineal al elemento que contiene (xc, yc)
const xc = B / 2 + ex, yc = Lz / 2 + ey;
const ic = Math.min(n - 1, Math.floor(xc / dx)), jc = Math.min(n - 1, Math.floor(yc / dy));
const xl = (xc - ic * dx) / dx, yl = (yc - jc * dy) / dy;
const ns = [nd(ic, jc), nd(ic + 1, jc), nd(ic + 1, jc + 1), nd(ic, jc + 1)];
const nf = [(1 - xl) * (1 - yl), xl * (1 - yl), xl * yl, (1 - xl) * yl];
ns.forEach((k, v) => L.push(`load ${k} 0 0 ${-(P * nf[v]).toFixed(6)} 0 0 0`));
L.push("solve");
fs.writeFileSync(sal, L.join("\n") + "\n");
globalThis.__hekatanFactoresPatron = { Dead: 1 };
const ol = console.log; console.log = () => {};
const H = await resolverHeks(sal);
console.log = ol;
const D = H.deformOutputs.deformations;               // Map 0-BASED
const A = (i, j) => (dx * (i === 0 || i === n ? 0.5 : 1)) * (dy * (j === 0 || j === n ? 0.5 : 1));
console.log("nudo    x      y      w [mm]     p [kPa]");
let wmin = 0, pmax = 0, Q = 0, lev = 0;
for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
  const k = nd(i, j), w = D.get(k - 1)?.[2] ?? NaN;
  const p = w < 0 ? -w * ks : 0;
  if (w >= 0) lev++;
  wmin = Math.min(wmin, w); pmax = Math.max(pmax, p); Q += p * A(i, j);
  console.log(`${String(k).padStart(4)} ${(i * dx).toFixed(3)} ${(j * dy).toFixed(3)} ${(w * 1000).toFixed(4).padStart(10)} ${p.toFixed(3).padStart(10)}`);
}
console.log(`\nw_min = ${(wmin * 1000).toFixed(4)} mm   p_max = ${pmax.toFixed(3)} kPa`);
console.log(`suma de los muelles = ${Q.toFixed(2)} kN   (P = ${P} kN)`);
console.log(`nudos levantados = ${lev} de ${(n + 1) ** 2}`);
