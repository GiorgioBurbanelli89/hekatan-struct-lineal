/**
 * TIEMPO-HISTORIA LINEAL del motor (timeHistoryAnalysis → modal.cpp + utils/tiempoHistoria.h), 30-sep-2026.
 * Los dos métodos de SAP2000/ETABS (CSI Analysis Reference, cap. 21):
 *   · modal: integración cerrada por modo con carga lineal entre puntos (Chopra §5.2, Tabla 5.2.1)
 *   · directa: HHT-α / Newmark con C = cM·M + cK·K
 * Árbitros:
 *   · Chopra 4.ª ed., Ejemplo 5.1, Tabla E5.1a (p.170): 1 GDL, el modal tiene que dar la tabla.
 *   · SAP2000 24 (validation/paz-newmark/sap_th_general.py → tests/datos/th_general_sap2000.json): el pórtico
 *     del Paz 8.1 en lb-in, paso a paso, desplazamientos RELATIVOS y reacción en la base FX:
 *       TH81M  modal, pulsos triangulares      TH81AD directa, sismo, Rayleigh      TH81AM modal, sismo, ξ = 5 %
 * Convención CSI medida: en la DIRECTA la carga vale 0 en t = 0 (§21.3, a₀ = 0); en el MODAL vale f(0).
 */
import { empaquetar, R } from "../lib/bundle.mjs";
import { readFileSync } from "node:fs";

export const nombre = "tiempo-historia-sap2000";
export const descripcion = "tiempo-historia lineal (modal y directa): Chopra E5.1 y pórtico Paz 8.1 contra SAP2000 paso a paso";

function portico81() {
  const nodes = [[0, 0, 0], [360, 0, 0], [0, 0, 180], [360, 0, 180], [0, 0, 300], [360, 0, 300]];
  const elements = [[0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]];
  const I = [248.6, 248.6, 248.6e5, 106.3, 106.3, 248.6e5], E = 30e6;
  const mp = (f) => new Map(elements.map((_, i) => [i, f(i)]));
  const ei = { elasticities: mp(() => E), shearModuli: mp(() => E / 2.6), areas: mp(() => 1e4),
    momentsOfInertiaZ: mp((i) => I[i]), momentsOfInertiaY: mp((i) => I[i]), torsionalConstants: mp((i) => 2 * I[i]),
    shearAreasY: mp(() => -1), shearAreasZ: mp(() => -1), densities: mp(() => 0) };
  const plano = [false, true, false, true, false, true], emp = Array(6).fill(true);
  const ni = { supports: new Map([[0, emp], [1, emp], [2, plano], [3, plano], [4, plano], [5, plano]]),
    masses: new Map([[2, 52500 / 386.088 / 2], [3, 52500 / 386.088 / 2], [4, 25500 / 386.088 / 2], [5, 25500 / 386.088 / 2]]) };
  return { nodes, elements, ni, ei };
}

export async function correr() {
  const m = await empaquetar(`export { timeHistoryAnalysis } from "${R}/hekatan-fem/src/index";\n`, "tiempo-historia");
  const filas = [];
  // ── Chopra E5.1 ──
  {
    const nodes = [[0, 0, 0], [1, 0, 0]], elements = [[0, 1]], mp = (v) => new Map([[0, v]]);
    const ei = { elasticities: mp(1e-9), shearModuli: mp(1e-9), areas: mp(1), momentsOfInertiaZ: mp(1), momentsOfInertiaY: mp(1), torsionalConstants: mp(1), densities: mp(0) };
    const ni = { supports: new Map([[0, [false, true, true, true, true, true]], [1, Array(6).fill(true)]]), masses: new Map([[0, 0.2533]]), springs: [{ node: 0, dof: 0, k: 10 }] };
    const t = [], v = [];
    for (let i = 0; i <= 6; i++) { t.push(i * 0.1); v.push(10 * Math.sin(Math.PI * i * 0.1 / 0.6)); }
    const libro = [0, 0.0318, 0.2274, 0.6336, 1.1339, 1.4896, 1.4480, 0.9037, 0.0579, -0.7577, -1.2432];
    const r = m.timeHistoryAnalysis(nodes, elements, ni, ei, { metodo: "modal", dt: 0.1, nPasos: 10, xi: 0.05, numModes: 1,
      cargas: [{ tipo: "patron", fuerzas: new Map([[0, [1, 0, 0, 0, 0, 0]]]), funcion: { t, v } }], nudosSalida: [0] });
    const u = r.u.get(0).map((x) => x[0]);
    const d = Math.max(...u.map((x, i) => Math.abs(x - libro[i])));
    filas.push({ que: "Chopra E5.1 (Tabla E5.1a), modal, u(t) 11 pasos", medido: d, limite: 1e-4, ok: d <= 1e-4,
                 detalle: `peor ${d.toExponential(2)} in (la tabla trae 4 decimales)` });
  }
  // ── pórtico Paz 8.1 contra SAP2000 ──
  const S = JSON.parse(readFileSync(new URL("../datos/th_general_sap2000.json", import.meta.url), "utf-8"));
  const sis = JSON.parse(readFileSync(new URL("../datos/th_sismo_sintetico.json", import.meta.url), "utf-8"));
  const { nodes, elements, ni, ei } = portico81();
  const tri = { t: [0, 0.1, 1.0], v: [1, 0, 0] };
  const pulsos = [{ tipo: "patron", fuerzas: new Map([[2, [10000, 0, 0, 0, 0, 0]]]), funcion: tri },
                  { tipo: "patron", fuerzas: new Map([[4, [20000, 0, 0, 0, 0, 0]]]), funcion: tri }];
  const sismo = [{ tipo: "aceleracion", dir: 0, funcion: { t: sis.t, v: sis.a } }];
  const casos = [
    ["TH81M", "modal, pulsos", { metodo: "modal", dt: 0.002, nPasos: 500, xi: 0, cargas: pulsos }],
    ["TH81AD", "directa, sismo, Rayleigh", { metodo: "directa", dt: 0.01, nPasos: 400, cM: S.cM, cK: S.cK, cargas: sismo }],
    ["TH81AM", "modal, sismo, ξ = 5 %", { metodo: "modal", dt: 0.01, nPasos: 400, xi: 0.05, cargas: sismo }],
  ];
  const peor = (a, b) => { let p = 0, mx = 0; b.forEach((x, i) => { mx = Math.max(mx, Math.abs(x)); p = Math.max(p, Math.abs((a[i] ?? NaN) - x)); }); return 100 * p / mx; };
  for (const [c, txt, o] of casos) {
    const r = m.timeHistoryAnalysis(nodes, elements, ni, ei, { ...o, numModes: 12, nudosSalida: [2, 4] });
    const series = { u1: r.u.get(2).map((x) => x[0]), u2: r.u.get(4).map((x) => x[0]), FX: r.base.map((b) => b[0]) };
    for (const [k, ref] of [["u1", S[c].u1.u], ["u2", S[c].u2.u], ["FX", S[c].baseFX]]) {
      const d = peor(series[k], ref);
      filas.push({ que: `Paz 8.1 vs SAP2000 ${c} (${txt}): ${k === "FX" ? "reacción en la base FX" : k} paso a paso`,
                   medido: d, limite: 1e-4, ok: Number.isFinite(d) && d <= 1e-4, detalle: `${ref.length} pasos, peor ${d.toExponential(2)} % del máx` });
    }
  }
  return filas;
}
