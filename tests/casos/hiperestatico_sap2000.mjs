/**
 * HYPERSTATIC (Load Case de SAP2000) contra SAP2000 24 por OAPI (5-oct-2026).
 *   «Respuesta lineal de la estructura SIN apoyos cargada solo con las reacciones de otro caso lineal estático»
 *   (ayuda de SAP2000, Load Case Data - Hyperstatic Form): fuerzas SECUNDARIAS del pretensado.
 * Viga continua 2 × 20 m; caso base PT = cargas equivalentes de un tendón parabólico (P 2000 kN, flechas 0.4 y 0.3 m):
 *   w = 8Pe/L² hacia arriba, fuerzas de anclaje en los extremos de cada vano, axial ±P. Autoequilibradas.
 * Referencia: validation/casos-csi/sap_hiperestatico.py → sap_hiperestatico.json (juez SAP2000).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";
import { modeloViga, diagramaCSI } from "./multipaso_sap2000.mjs";

export function cargasTendon(D, m) {
  const M = D.modelo, loads = new Map(), frameLoads = new Map();
  const suma = (q, c) => { const v = loads.get(q) ?? [0, 0, 0, 0, 0, 0]; c.forEach((x, k) => (v[k] += x)); loads.set(q, v); };
  for (const [q, c] of Object.entries(M.nodal)) suma(+q, c);
  const nv = M.w.length, porVano = m.elements.length / nv;
  m.elements.forEach(([i, j], e) => {
    const w = M.w[Math.floor(e / porVano)], L = m.nodes[j][0] - m.nodes[i][0];
    frameLoads.set(e, [0, 0, w]);
    suma(i, [0, 0, w * L / 2, 0, -w * L * L / 12, 0]); suma(j, [0, 0, w * L / 2, 0, w * L * L / 12, 0]);
  });
  return { loads, frameLoads };
}

export const nombre = "hiperestatico-sap2000";
export const descripcion = "Hyperstatic (secundarios del pretensado) = SAP2000: reacciones del base, P/V2/M3 secundarios, reacciones nulas";
export async function correr() {
  const fem = await cargarFem();
  const D = JSON.parse(readFileSync(join(RAIZ, "tests/datos/sap_hiperestatico.json"), "utf8"));
  const m = modeloViga(D, D.props), { loads, frameLoads } = cargasTendon(D, m);
  const ni = { ...m.nodeInputs, loads }, ei = { ...m.elementInputs, frameLoads };
  const H = fem.hyperstaticAnalysis(m.nodes, m.elements, ni, ei);
  const filas = [];
  const cmp = (que, refs, lim = 1e-4) => {
    let max = 0, peor = 0, donde = "";
    for (const r of refs) max = Math.max(max, Math.abs(r.ref));
    for (const r of refs) { const d = Math.abs(r.h - r.ref) / (max || 1) * 100; if (d > peor || isNaN(d)) { peor = isNaN(d) ? 1e9 : d; donde = `${r.donde}: ${r.h.toFixed(6)} / ${r.ref.toFixed(6)}`; } }
    filas.push({ que, medido: peor, limite: lim, ok: peor <= lim, detalle: donde });
  };
  cmp("reacciones del caso base PT (Fz)", Object.entries(D.casos.PT.reac).map(([q, r]) => ({ h: H.reaccionesBase.get(+q)[2], ref: r[2], donde: `apoyo ${q}` })));
  for (const [c, campo] of [[1, "V2"], [5, "M3"]]) {
    const rr = [];
    for (const [e, F] of Object.entries(D.casos.HYP.frame)) F.sta.forEach((sta, k) => {
      const ext = Math.abs(sta) < 1e-9 ? 0 : Math.abs(sta - 1) < 1e-9 ? 1 : -1;
      if (ext >= 0) rr.push({ h: diagramaCSI(H, +e, ext)[c], ref: F[campo][k], donde: `barra ${e} ${ext ? "j" : "i"}` });
    });
    cmp(`HYP ${campo} secundario, 40 barras (% del máx)`, rr);
  }
  {
    let pm = 0, ps = 0;
    for (const [e, F] of Object.entries(D.casos.HYP.frame)) { ps = Math.max(ps, ...F.P.map(Math.abs)); pm = Math.max(pm, Math.abs(diagramaCSI(H, +e, 0)[0]), Math.abs(diagramaCSI(H, +e, 1)[0])); }
    filas.push({ que: "HYP P secundario (nulo: el axial ±P se equilibra solo) kN", medido: pm, limite: 1e-6, ok: pm <= 1e-6 && ps <= 1e-6, crudo: true, detalle: `Hekatan ${pm.toExponential(2)} · SAP2000 ${ps.toExponential(2)}` });
  }
  const rmax = Math.max(...[...H.reactions.values()].map((r) => Math.max(...r.map(Math.abs))));
  filas.push({ que: "HYP reacciones (nulas, como SAP2000) kN", medido: rmax, limite: 1e-6, ok: rmax <= 1e-6, crudo: true, detalle: `máx |R| = ${rmax.toExponential(2)}` });
  cmp("HYP Uz, quitado el sólido rígido (como SAP2000)", Object.entries(D.casos.HYP.disp).map(([q, u]) => ({ h: H.deformations.get(+q)[2], ref: u[2], donde: `nudo ${q}` })), 1e-2);
  return filas;
}
