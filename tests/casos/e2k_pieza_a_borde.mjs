/**
 * Pieza A (union panel-arista, 5-nov-2026): panel de membrana A36 4 mm de 4x1 m (UN Q4) con 2 barras de borde Tubo 50x3; la de y=1 en 4 tramos
 * (3 nudos colgados). Prueba sensible: 1 kN en X sobre el nudo colgado medio. Referencia: SAP2000 24 por OAPI (cli/sap2000_pieza_a.py),
 * edge constraint SI = el panel se lleva casi todo, axil liso 0.054/0.051/0.057/0.054 kN; NO = 0.446/0.446/0.554/0.554 (= paño suelto).
 * `bordeinterpolado` (nudo colgado = interpolacion lineal en el plano de las 2 esquinas) debe dar lo del edge constraint SI.
 */
import { writeFileSync, mkdtempSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
import { resolverHeks } from "../lib/heks.mjs";
export const nombre = "e2k-pieza-a-borde";
export const descripcion = "pieza A: union panel-arista por interpolacion (bordeinterpolado) vs SAP2000 con edge constraint (axil liso 0.054 kN)";

async function correrPieza(directiva) {
  const E = 199947980, nu = 0.3, rho = 7.849048;
  const N = [[0, 0], [4, 0], [4, 1], [0, 1], [1, 1], [2, 1], [3, 1]];
  const h = N.map(([x, y], i) => `node ${i + 1} ${x} ${y} 0`);
  const fr = (id, i, j) => `frame ${id} ${i} ${j} ${E} 0.0004429646 1.228119e-7 1.228119e-7 2.456239e-7 ${nu} ${rho} 0.05 0.05`;
  h.push(fr(1, 1, 2), fr(2, 4, 5), fr(3, 5, 6), fr(4, 6, 7), fr(5, 7, 3));
  if (directiva) h.push(directiva);
  h.push(`shell 6 1 2 3 4 0.004 ${E} ${nu} ${rho}`, "shelltype 6-6 thick", "shellmod 6 1 1 1 0 0 0 0 0");
  const ap = { 1: [1, 1, 0], 2: [0, 1, 0], 3: [0, 0, 0], 4: [0, 1, 0] };   // ux uy rz; uz, rx, ry fijos (problema plano)
  for (let n = 1; n <= 7; n++) { const r = ap[n] ?? [0, 0, 1]; h.push(`support ${n} ${r[0]} ${r[1]} 1 1 1 ${r[2]}`); }
  h.push("load 6 1 0 0 0 0 0 Dead", "solve");
  const f = join(mkdtempSync(join(tmpdir(), "pa-")), "a.heks"); writeFileSync(f, h.join("\n") + "\n");
  const l = console.log, w = console.warn, i = console.info; console.log = console.warn = console.info = () => {};
  globalThis.__hekatanFactoresPatron = { Dead: 1 };
  let s; try { s = await resolverHeks(f); } finally { console.log = l; console.warn = w; console.info = i; }
  const Nn = s.analyzeOutputs.normals, top = [], bot = [];
  s.elements.forEach((e, k) => { if (e.length === 2) { const v = Nn.get(k); (s.nodes[e[0]][1] > 0.5 ? top : bot).push(Math.abs(v[0])); } });
  return { top, bot };
}

export async function correr() {
  const filas = [], f3 = (x) => x.toFixed(3);
  const sap = [0.054, 0.051, 0.057, 0.054];
  const a = await correrPieza("bordeinterpolado");
  filas.push({ que: "bordeinterpolado: axil de los 4 tramos de la barra y=1 (kN) vs SAP2000 con edge constraint", crudo: true, medido: a.top.map(f3).join(" / "), limite: "0.054/0.051/0.057/0.054 ±0.01",
    ok: a.top.length === 4 && a.top.every((v, i) => Math.abs(v - sap[i]) <= 0.01), detalle: "liso: el panel (1 Q4) se lleva casi todo" });
  filas.push({ que: "bordeinterpolado: axil de la barra y=0 (kN) vs SAP2000", crudo: true, medido: a.bot.map(f3).join(" / "), limite: "0.145 ±0.01", ok: a.bot.length === 1 && Math.abs(a.bot[0] - 0.145) <= 0.01 });
  const b = await correrPieza("");
  filas.push({ que: "sin directiva (paño suelto): axil de los 4 tramos = SAP2000 sin edge constraint", crudo: true, medido: b.top.map(f3).join(" / "), limite: "0.446/0.446/0.554/0.554 ±0.01",
    ok: b.top.length === 4 && [0.446, 0.446, 0.554, 0.554].every((v, i) => Math.abs(b.top[i] - v) <= 0.01), detalle: "el control: sin atar los colgados la barra retiene casi todo" });
  return filas;
}
