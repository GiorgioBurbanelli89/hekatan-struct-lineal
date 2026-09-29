// ¿El modo nulo de más del triángulo CS-DSG3 aparece en una MALLA? Losa cuadrada apoyada (w = 0 en el
// borde), carga uniforme, malla N×N partida en triángulos. Flecha central contra Navier (placa delgada),
// contra el Q4 del solver con la misma malla, y contra OpenSees ASDShellT3 (cli/_t3_malla_losa_ops.py).
import { cargarFem } from "../tests/lib/bundle.mjs";
import { writeFileSync } from "node:fs";
const fem = await cargarFem();
const a = 4, E = 2.2e7, nu = 0.3, q = 10;
const D0 = (t) => (E * t ** 3) / (12 * (1 - nu * nu));
// Navier, placa delgada apoyada, centro: w = 16q/(π^6 D) Σ Σ sin(mπ/2) sin(nπ/2)/(mn (m²/a²+n²/a²)²)
const navier = (t) => { let s = 0; for (let m = 1; m < 200; m += 2) for (let n = 1; n < 200; n += 2) s += Math.sin(m * Math.PI / 2) * Math.sin(n * Math.PI / 2) / (m * n * ((m / a) ** 2 + (n / a) ** 2) ** 2); return 16 * q / (Math.PI ** 6 * D0(t)) * s; };
const filas = [];
for (const t of [0.02, 0.4]) for (const N of [4, 8, 16]) for (const tipo of ["T3", "Q4"]) {
  const nodos = [], id = (i, j) => i * (N + 1) + j;
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) nodos.push([a * i / N, a * j / N, 0]);
  const el = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const n1 = id(i, j), n2 = id(i + 1, j), n3 = id(i + 1, j + 1), n4 = id(i, j + 1);
    if (tipo === "Q4") el.push([n1, n2, n3, n4]); else { el.push([n1, n2, n3]); el.push([n1, n3, n4]); }
  }
  const m = (v) => new Map(el.map((_, k) => [k, v]));
  const ei = { elasticities: m(E), thicknesses: m(t), poissonsRatios: m(nu), shearModuli: m(E / (2 * (1 + nu))) };
  const sup = new Map(), cargas = new Map();
  nodos.forEach((p, k) => {
    const borde = p[0] < 1e-9 || p[1] < 1e-9 || p[0] > a - 1e-9 || p[1] > a - 1e-9;
    sup.set(k, [true, true, borde, false, false, true]);      // membrana y giro en el plano fuera; w = 0 en el borde
  });
  // carga uniforme repartida por áreas (1/3 del triángulo o 1/4 del cuadrado a cada nudo)
  el.forEach((e) => {
    const P = e.map((k) => nodos[k]);
    const A = e.length === 3 ? Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])) / 2 : (a / N) ** 2;
    e.forEach((k) => { const c = cargas.get(k) ?? [0, 0, 0, 0, 0, 0]; c[2] -= q * A / e.length; cargas.set(k, c); });
  });
  const out = fem.deform(nodos, el, { supports: sup, loads: cargas }, ei);
  const w = -out.deformations.get(id(N / 2, N / 2))[2];
  let nan = 0; out.deformations.forEach((d) => d.forEach((x) => { if (!Number.isFinite(x)) nan++; }));
  filas.push({ t, N, tipo, w, navier: navier(t), nan });
}
for (const f of filas) console.log(`t=${f.t} N=${String(f.N).padStart(2)} ${f.tipo}: w centro ${f.w.toExponential(6)} · Navier (delgada) ${f.navier.toExponential(6)} · ${((f.w / f.navier - 1) * 100).toFixed(2)} % · NaN ${f.nan}`);
writeFileSync("cli/shots/estribo/t3_malla_losa.json", JSON.stringify(filas, null, 1));
