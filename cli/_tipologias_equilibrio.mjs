// Equilibrio GENÉRICO de cualquier .heks: la carga se suma a mano leyendo el propio fichero
// (peso ρ·g de áreas t·A, barras A·L, sólidos V; areaload·A; load) y se compara con
// ΣR de los apoyos + fuerza de los muelles (−k·u).  node cli/_tipologias_equilibrio.mjs a.heks b.heks …
import { readFileSync } from "node:fs";
import { resolverHeks } from "../tests/lib/heks.mjs";
const G = 9.80665;
const sub = (a, b) => a.map((v, k) => v - b[k]);
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norma = (a) => Math.hypot(...a);
const vol6 = (a, b, c, d) => { const u = sub(b, a), v = sub(c, a), w = sub(d, a); return Math.abs(u[0] * (v[1] * w[2] - v[2] * w[1]) - u[1] * (v[0] * w[2] - v[2] * w[0]) + u[2] * (v[0] * w[1] - v[1] * w[0])) / 6; };
for (const f of process.argv.slice(2)) {
  const txt = readFileSync(f, "utf-8");
  const N = new Map(), filas = [];
  let sw = 0; const cargaA = new Map(), shells = new Map();
  const F = [0, 0, 0]; const springs = [];
  for (const l of txt.split("\n")) {
    const t = l.trim().split(/\s+/);
    if (t[0] === "node") N.set(+t[1], [+t[2], +t[3], +t[4]]);
    else if (t[0] === "selfweight") sw = +t[1];
    else if (t[0] === "load") for (let k = 0; k < 3; k++) F[k] += +t[2 + k];
    else if (t[0] === "areaload") cargaA.set(+t[1], +t[2]);
    else if (t[0] === "spring") springs.push([+t[1], { ux: 0, uy: 1, uz: 2 }[t[2]], +t[3]]);
    filas.push(t);
  }
  let W = 0, Wq = 0;
  for (const t of filas) {
    if (t[0] === "frame") W += +t[5] * norma(sub(N.get(+t[3]), N.get(+t[2]))) * +(t[10] ?? 2.45);
    if (t[0] === "shell") {
      const P = t.slice(2, 6).map((i) => N.get(+i));
      const A = norma(cruz(sub(P[2], P[0]), sub(P[3], P[1]))) / 2;
      W += A * +t[6] * +(t[9] ?? 2.45);
      shells.set(+t[1], A);
    }
    if (t[0] === "hex") {
      const P = t.slice(2, 10).map((i) => N.get(+i));
      const V = vol6(P[0], P[1], P[2], P[6]) + vol6(P[0], P[2], P[3], P[6]) + vol6(P[0], P[3], P[7], P[6]) + vol6(P[0], P[7], P[4], P[6]) + vol6(P[0], P[4], P[5], P[6]) + vol6(P[0], P[5], P[1], P[6]);
      W += V * +(t[12] ?? 2.45);
    }
  }
  for (const [id, q] of cargaA) Wq += q * (shells.get(id) ?? 0);
  const Fz = F[2] - sw * W * G + Wq;
  const r = await resolverHeks(f);
  const d = r.deformOutputs, R = [0, 0, 0];
  for (const [, v] of d.reactions ?? []) for (let k = 0; k < 3; k++) R[k] += v[k] || 0;
  const ids = [...N.keys()].sort((a, b) => a - b), idx = new Map(ids.map((id, i) => [id, i]));
  for (const [n, k, kk] of springs) R[k] -= kk * ((d.deformations?.get(idx.get(n))?.[k]) ?? 0);
  const pct = (a, b) => Math.abs(b) > 1e-6 ? (100 * (a - b) / Math.abs(b)).toFixed(4) + " %" : (a - b).toFixed(3) + " kN";
  console.log(`${f.split(/[\/]/).pop()}: carga Fx ${F[0].toFixed(2)} Fy ${F[1].toFixed(2)} Fz ${Fz.toFixed(2)} kN (peso ${(sw * W * G).toFixed(2)}) · ` +
    `reacción ${R.map((x) => x.toFixed(2)).join(", ")} → ΣFz+ΣRz ${pct(-R[2], Fz)} · ΣFx+ΣRx ${pct(-R[0], F[0])} · ΣFy+ΣRy ${pct(-R[1], F[1])}`);
}
