// Referencia para replicar la zapata del ej. 6.10 de Das en Hekatan LISP.
// Escribe el .heks con malla n x n (misma formulacion que el ejemplo del workspace)
// y lo resuelve, sacando Uz nudo a nudo y la presion del suelo.
//   node cli/_zapata_ref_lisp.mjs 4 salida.heks
import fs from "fs";
import { resolverHeks } from "../tests/lib/heks.mjs";

const KGF_CM2 = 98.0665, TONF = 9.80665;
const P = { Lx: 1.5, Ly: 1.5, t: 0.4, fc: 240, ks: 2000, c: 0.3, P: 606 / 9.80665, exL: 0.1, eyB: 0.2 };
const n = +(process.argv[2] ?? 4), sal = process.argv[3];

const uniq = (v) => [...new Set(v.map((x) => +x.toFixed(9)))].sort((a, b) => a - b);
const lineas = (L, n, centro, c) => uniq([...Array.from({ length: n + 1 }, (_, i) => (L * i) / n),
                                          centro - c / 2, centro + c / 2].filter((x) => x >= -1e-12 && x <= L + 1e-12));

const xc = P.Lx / 2 + P.exL * P.Lx, yc = P.Ly / 2 + P.eyB * P.Ly;
const X = lineas(P.Lx, n, xc, P.c), Y = lineas(P.Ly, n, yc, P.c);
const E = 15100 * Math.sqrt(P.fc) * KGF_CM2, ks = P.ks * TONF, q = -(P.P * TONF) / (P.c * P.c);
const id = (i, j) => j * X.length + i + 1;
const L = [`# Zapata Das 6.10 · malla ${n}x${n} · Mindlin (thick) + Winkler solo compresion`];
for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length; i++)
  L.push(`node ${id(i, j)} ${+X[i].toFixed(9)} ${+Y[j].toFixed(9)} 0`);
let s = 0; const cargas = [];
for (let j = 0; j < Y.length - 1; j++) for (let i = 0; i < X.length - 1; i++) {
  s++;
  L.push(`shell ${s} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${P.t} ${+E.toFixed(3)} 0 0`);
  L.push(`shelltype ${s} thick`);
  L.push(`areaspring ${s} ${+ks.toFixed(6)} nodal compresion`);
  const mx = (X[i] + X[i + 1]) / 2, my = (Y[j] + Y[j + 1]) / 2;
  if (Math.abs(mx - xc) < P.c / 2 && Math.abs(my - yc) < P.c / 2) cargas.push(`areaload ${s} ${+q.toFixed(6)}`);
}
for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length; i++) L.push(`support ${id(i, j)} 1 1 0 0 0 1`);
L.push(...cargas, `fc ${+(P.fc * KGF_CM2).toFixed(3)}`, `vista pressure`, `solve`);
const heks = L.join("\n") + "\n";
if (sal) fs.writeFileSync(sal, heks);

globalThis.__hekatanFactoresPatron = { Dead: 1 };
const ol = console.log; console.log = () => {};
const H = await resolverHeks(sal);
console.log = ol;
const D = H.deformOutputs?.deformations;
console.log(`# nudos ${X.length * Y.length}  shells ${s}  E ${E.toFixed(0)} kN/m2  ks ${ks.toFixed(3)} kN/m3  q ${q.toFixed(2)} kN/m2`);
console.log(`# X: ${X.map((v) => v.toFixed(3)).join(" ")}`);
console.log(`# Y: ${Y.map((v) => v.toFixed(3)).join(" ")}`);
console.log("# nudo  x      y       Uz[mm]     p=ks*Uz[kPa]");
let uzmin = 0, pmax = 0, sumP = 0;
for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length; i++) {
  // OJO: deformations es un Map 0-BASED (el nudo 1 es la clave 0).
  // Leerlo con el id del .heks corre todo un nudo y el ultimo sale NaN.
  const k = id(i, j), d = D?.get?.(k - 1);
  const uz = d ? d[2] : NaN;
  const p = uz < 0 ? -uz * ks : 0;
  uzmin = Math.min(uzmin, uz); pmax = Math.max(pmax, p);
  console.log(`${String(k).padStart(4)} ${X[i].toFixed(3)} ${Y[j].toFixed(3)} ${(uz * 1000).toFixed(4).padStart(10)} ${p.toFixed(3).padStart(10)}`);
}
const R = H.deformOutputs?.reactions; let Rz = 0; if (R) for (const [, r] of R) Rz += r[2];
// Equilibrio vertical: los apoyos son 1 1 0 0 0 1 (Uz LIBRE), asi que SumRz = 0 y no
// significa que falte carga: quien la aguanta es el SUELO. Se suma el muelle de cada
// nudo por su area tributaria.
let Q = 0;
for (let j = 0; j < Y.length; j++) for (let i = 0; i < X.length; i++) {
  const d = D?.get?.(id(i, j) - 1); if (!d) continue;
  const uz = d[2]; if (uz >= 0) continue;                 // levantado: el suelo no tira
  const ax = (X[Math.min(i + 1, X.length - 1)] - X[Math.max(i - 1, 0)]) / 2;
  const ay = (Y[Math.min(j + 1, Y.length - 1)] - Y[Math.max(j - 1, 0)]) / 2;
  Q += -uz * ks * ax * ay;
}
console.log(`# Suma de los muelles (suelo) ${Q.toFixed(2)} kN  vs  P ${(P.P * TONF).toFixed(2)} kN`);
console.log(`# Uz_min ${(uzmin * 1000).toFixed(4)} mm   p_max ${pmax.toFixed(3)} kPa   SumRz ${Rz.toFixed(3)} kN   P ${(P.P * TONF).toFixed(2)} kN`);
