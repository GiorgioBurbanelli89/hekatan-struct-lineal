/**
 * PUNTO DE INSERCION de barra (cardinal point de CSI) contra SAP2000 24.
 * Voladizo de 4 m, 0.3×0.5 (t3 = 0.5, eje 2 arriba), carga axial 1e5 y vertical −1e5 N en el extremo libre, con el nudo
 * en el centroide (10), arriba al centro (8) y abajo al centro (2). La referencia es SAP2000 por OAPI
 * (validation/insercion/sap_insercion.py): ux, uz y el giro del extremo, y los esfuerzos de la barra excéntrica
 * (validation/insercion/sap_fuerzas.json): M3 en los dos extremos, que es lo que cambia con el desfase.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cargarFem } from "../lib/bundle.mjs";

export const nombre = "insercion-punto-vs-sap2000";
export const descripcion = "Barra con punto de insercion (cardinal 10/8/2): desplazamientos y momentos contra SAP2000 24 (voladizo)";

export async function correr() {
  const AQUI = dirname(fileURLToPath(import.meta.url));
  const sap = JSON.parse(readFileSync(join(AQUI, "..", "..", "validation", "insercion", "sap_res.json"), "utf8"));
  const sapF = JSON.parse(readFileSync(join(AQUI, "..", "..", "validation", "insercion", "sap_fuerzas.json"), "utf8"));
  const fem = await cargarFem();
  const E = 2.5e10, nu = 0.2, b = 0.3, d = 0.5, G = E / (2 * (1 + nu));
  const dd = { 10: 0, 8: -d / 2, 2: +d / 2 };
  const filas = [];
  const pc = (a, s) => 100 * Math.abs(a - s) / Math.max(Math.abs(s), 1e-12);
  for (const cp of [10, 8, 2]) {
    const m = (v) => new Map([[0, v]]);
    const ei = { elasticities: m(E), poissonsRatios: m(nu), shearModuli: m(G), areas: m(b * d), momentsOfInertiaZ: m(b * d ** 3 / 12),
      momentsOfInertiaY: m(d * b ** 3 / 12), torsionalConstants: m(0.229 * d * b ** 3), densities: m(0) };
    if (dd[cp]) ei.insertionOffsets = m([dd[cp], 0]);
    const ni = { supports: new Map([[0, [true, true, true, true, true, true]]]), loads: new Map([[1, [1e5, 0, -1e5, 0, 0, 0]]]) };
    const nodes = [[0, 0, 0], [4, 0, 0]], el = [[0, 1]];
    const r = fem.deform(nodes, el, ni, ei); const u = r.deformations.get(1); const s = sap[cp];
    filas.push({ que: `CP ${cp}: ux`, medido: pc(u[0], s.u[0]), limite: 1e-4, ok: pc(u[0], s.u[0]) < 1e-4, detalle: `SAP ${s.u[0].toExponential(5)}` });
    filas.push({ que: `CP ${cp}: uz`, medido: pc(u[2], s.u[2]), limite: 1e-4, ok: pc(u[2], s.u[2]) < 1e-4, detalle: `SAP ${s.u[2].toExponential(5)}` });
    filas.push({ que: `CP ${cp}: giro ry`, medido: pc(u[4], s.r[1]), limite: 1e-4, ok: pc(u[4], s.r[1]) < 1e-4, detalle: `SAP ${s.r[1].toExponential(5)}` });
    const f = sapF[cp]; if (!f) continue;                    // esfuerzos de SAP solo para 10 y 8
    const a = fem.analyze(nodes, el, ei, r); const M3 = a.bendingsZ.get(0);
    // SAP da el diagrama (extremo i con signo opuesto al esfuerzo de extremo de Hekatan): se compara el modulo
    const eI = pc(Math.abs(M3[0]), Math.abs(f.M3[0])), eJ = Math.abs(f.M3[8]) < 1e-3 ? Math.abs(M3[1]) : pc(Math.abs(M3[1]), Math.abs(f.M3[8]));
    filas.push({ que: `CP ${cp}: M3 extremo i`, medido: eI, limite: 1e-4, ok: eI < 1e-4, detalle: `SAP ${f.M3[0].toFixed(1)}` });
    filas.push({ que: `CP ${cp}: M3 extremo j`, medido: eJ, limite: 1e-4, ok: eJ < 1e-4, detalle: `SAP ${f.M3[8].toExponential(2)}  (el del centroide es 0)` });
  }
  return filas;
}
