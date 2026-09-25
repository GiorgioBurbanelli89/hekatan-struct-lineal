// Normal al zinc por correa de viento — MÉTODO CADENA: las posiciones (x,z) de los
// extremos de las correas cargadas, por plano Y, ordenadas por x, dan la polilínea
// del arco; tangente por diferencia central → normal en el plano. Signo: hacia el
// interior (centroide del modelo).
import { readFileSync } from "fs";
const f = process.argv[2] ?? "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const lineas = readFileSync(f, "utf8").split(/\r?\n/);
const parse = (l) => Object.fromEntries([...l.matchAll(/(\w+)=("[^"]*"|\S+)/g)]
  .map((m) => [m[1], m[2].replace(/^"|"$/g, "")]));
let tabla = "", filas = {};
for (const l of lineas) {
  const m = l.match(/^TABLE:\s*"([^"]+)"/);
  if (m) { tabla = m[1]; continue; }
  if (tabla && /^\s*\w+=/.test(l)) (filas[tabla] ??= []).push(l);
}
const nodos = new Map();
for (const l of filas["JOINT COORDINATES"] ?? []) {
  const r = parse(l);
  nodos.set(r.Joint, [+r.XorR, +r.Y, +r.Z]);
}
const conn = (filas["CONNECTIVITY - FRAME"] ?? []).map(parse);
const elemDe = new Map(conn.map((c) => [c.Frame, [c.JointI, c.JointJ]]));
const viento = (filas["FRAME LOADS - DISTRIBUTED"] ?? []).map(parse)
  .filter((r) => r.LoadPat === "VIENTO");
// centroide (interior)
let C = [0, 0, 0];
for (const [, p] of nodos) { C[0] += p[0]; C[1] += p[1]; C[2] += p[2]; }
C = C.map((x) => x / nodos.size);
// cadena por plano de y
const planos = new Map();   // yKey → [{x,z,fr}]
const extremos = [];        // {row, yKey, xz:[x,z], y}
for (const v of viento) {
  const e = elemDe.get(v.Frame); if (!e) continue;
  for (const jn of e) {
    const p = nodos.get(jn); if (!p) continue;
    const yKey = p[1].toFixed(3);
    const xz = [p[0], p[2]];
    if (!planos.has(yKey)) planos.set(yKey, []);
    planos.get(yKey).push({ x: xz[0], z: xz[1], fr: v.Frame });
    extremos.push({ v, yKey, xz, y: p[1] });
  }
}
for (const [, arr] of planos) arr.sort((a, b) => a.x - b.x);
const unit = (v) => { const n = Math.hypot(...v); return n ? v.map((x) => x / n) : v; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const normales = new Map();  // row → n (promedio de sus extremos)
const debug = [];
for (const ex of extremos) {
  const arr = planos.get(ex.yKey);
  // índice del extremo: coincidencia x,z (y fr por si duplicados exactos)
  let i = arr.findIndex((q) => Math.abs(q.x - ex.xz[0]) < 1e-6 && Math.abs(q.z - ex.xz[1]) < 1e-6 && q.fr === ex.v.Frame);
  if (i < 0) i = arr.findIndex((q) => Math.abs(q.x - ex.xz[0]) < 1e-6 && Math.abs(q.z - ex.xz[1]) < 1e-6);
  if (i < 0) continue;
  const a = arr[Math.max(0, i - 1)], b = arr[Math.min(arr.length - 1, i + 1)];
  const t = unit([b.x - a.x, 0, b.z - a.z]);
  if (Math.hypot(t[0], t[2]) < 1e-9) continue;
  let n = unit([t[2], 0, -t[0]]);
  const p = [ex.xz[0], ex.y, ex.xz[1]];
  const hacia = [C[0] - p[0], C[1] - p[1], C[2] - p[2]];
  if (dot(n, hacia) < 0) n = n.map((x) => -x);
  const prev = normales.get(ex.v.Frame);
  normales.set(ex.v.Frame, prev ? unit([prev[0] + n[0], prev[1] + n[1], prev[2] + n[2]]) : n);
  if (ex.v.Frame === "890") debug.push({ yKey: ex.yKey, i, a: [a.x, a.z], b: [b.x, b.z], n });
}
// resultados
const res = [];
for (const v of viento) {
  const n = normales.get(v.Frame);
  if (!n) { res.push({ f: v.Frame, fail: "sin normal" }); continue; }
  const q = +v.FOverLA;
  const L = +(elemDe.get(v.Frame) ? Math.abs(nodos.get(elemDe.get(v.Frame)[1])[1] - nodos.get(elemDe.get(v.Frame)[0])[1]) || 6 : 6);
  res.push({ f: v.Frame, q, n, ang: +(Math.acos(Math.min(1, Math.abs(n[2]))) * 180 / Math.PI).toFixed(1), L });
}
const ok = res.filter((r) => !r.fail);
console.log(`normales: ${ok.length}/${viento.length}`);
const angs = ok.map((r) => r.ang);
console.log(`ángulo con vertical: min=${Math.min(...angs)} max=${Math.max(...angs)} media=${(angs.reduce((a, b) => a + b, 0) / angs.length).toFixed(1)}`);
let Fx = 0, Fy = 0, Fz = 0;
for (const r of ok) { Fx += r.q * r.n[0] * r.L; Fy += r.q * r.n[1] * r.L; Fz += r.q * r.n[2] * r.L; }
console.log(`Σ viento (kN): Fx=${Fx.toFixed(3)} Fy=${Fy.toFixed(3)} Fz=${Fz.toFixed(3)}`);
console.log("debug frame 890:", JSON.stringify(debug, null, 1));
console.log("muestras:");
for (const r of ok.filter((_, i) => i % 31 === 0).slice(0, 12))
  console.log(`  f=${r.f} q=${r.q} n=(${r.n.map((x) => x.toFixed(3))}) ang=${r.ang}`);

