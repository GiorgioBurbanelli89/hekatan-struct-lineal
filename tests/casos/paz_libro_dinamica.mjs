/**
 * Ejemplos de dinámica de Paz & Kim (6.ª ed.) — lo que el ejemplo CALCULA contra el libro.
 *
 * Existe por el 30-sep-2026 (Jorge: «los benchmarks de Newmark están mal, revisa el gif y png»). Lo que estaba mal:
 *   · El modelo 3D de los shear buildings (4.1, 6.1, 7.1, 8.1, 9.3) no llevaba la MASA de los pisos: el modal de
 *     Struct daba 21.9 Hz en el 7.1 (libro 1.88). Además salía fuera del plano, con cortante y viga flexible.
 *   · 7.1 / 8.1: I2 = 118 in⁴ (errata de la p.178); el libro calcula con W10×21, I = 106.3 (p.199) → ω₂ 34.5 vs 32.89.
 *   · 10.7: el tiempo-historia era un 1 GDL inventado; el libro integra la viga de 4 elementos con masa consistente.
 *   · 13.1: K de 6×6 sin el acoplamiento 6EI/L², masa lumped con inercia inventada, ξ = 0.05 que el libro no tiene;
 *     el 3D con ρ mal convertida (3.57 Hz) y el motor `modal_paz` ignoraba el As = −1 (Euler) → −0.54 %.
 *   · 4.1: σ con la k de las DOS columnas (30 524 psi, libro 15 083).
 * Referencias: la solución EXACTA de cada problema (validation/paz-newmark/*.py) y las tablas del libro.
 * El árbitro de programa (SAP2000, Linear Direct Integration) va en paz_libro_dinamica_sap2000 (pendiente).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "paz-libro-dinamica";
export const descripcion = "Paz 4.1, 6.1, 7.1, 8.1, 9.3, 10.7, 13.1: modal 3D de Struct y tiempo-historia contra el libro / solución exacta";

const EJ = { "4-1": "benchmarkPaz4_1", "6-1": "benchmarkPaz6_1", "7-1": "benchmarkPaz7_1", "8-1": "benchmarkPaz8_1",
             "9-3": "benchmarkPaz9_3", "10-7": "benchmarkPaz10_7", "13-1": "benchmarkPaz13_1" };

// Frecuencias (Hz) de referencia.
//  4.1: √(k/m)/2π con k = 12E(2I)/L³, m = W/g (p.92).  6.1: √(k/m)/2π, m = 0.1, k = 100 (p.151).
//  7.1/8.1: shear building exacto con I = 248.6 / 106.3 (p.198-199) → ω = 11.8265 / 32.8963 (libro 11.83 / 32.89).
//  9.3: uniforme de 4 pisos, ω_j = 2√(k/m)·sin((2j−1)π/18) (f₁ = 1.00 Hz por construcción del ejemplo).
//  10.7: Programa 13 (BeamElement + BeamConsMass, p.281): 7.2307 / 20.0893 / 39.8556.
//  13.1: SpaceFrameElement + SpaceFrameConsMass (p.345-346) con T completa: 12.8293 / 12.8557 / 14.1142.
const k41 = 12 * 30e6 * 2 * 69.2 / 180 ** 3, m41 = 5000 / 386.088;
const s = (j) => Math.sin((2 * j - 1) * Math.PI / 18) / Math.sin(Math.PI / 18);
const F = {
  "4-1": [Math.sqrt(k41 / m41) / 2 / Math.PI],
  "6-1": [Math.sqrt(1000) / 2 / Math.PI],
  "7-1": [11.82654864 / 2 / Math.PI, 32.89634164 / 2 / Math.PI],
  "8-1": [11.82654864 / 2 / Math.PI, 32.89634164 / 2 / Math.PI],
  "9-3": [1, s(2), s(3), s(4)],
  "10-7": [7.23067602, 20.08933513, 39.85559126],
  "13-1": [12.8293, 12.8557, 14.1142],
};

export async function correr() {
  const src = Object.entries(EJ).map(([k, n]) => `export { ${n} } from "${R}/examples/src/benchmark-paz-${k}/${n}";`).join("\n") +
    `\nexport { modalAnalysis, modalAnalysisPaz } from "${R}/hekatan-fem/src/index";\n`;
  const m = await empaquetar(src, "paz-libro-dinamica");
  const filas = [];
  const v = (x) => ({ val: x });
  const th = {};
  for (const [k, n] of Object.entries(EJ)) {
    const ex = m[n], p = {};
    for (const [key, d] of Object.entries(ex.params)) p[key] = d.default;
    p.showTH = 1; p.exportE2k = 0;
    const st = { nodes: v([]), elements: v([]), nodeInputs: v({}), elementInputs: v({}), deformOutputs: v({}), analyzeOutputs: v({}), objects3D: v([]) };
    const log = console.log, err = console.error; console.log = () => {}; console.error = () => {};
    try { ex.build(p, st); } catch { /* la gráfica no existe en Node: el cálculo ya quedó en st._th */ }
    console.log = log; console.error = err;
    th[k] = st._th;
    const modal = (k === "10-7" || k === "13-1") ? m.modalAnalysisPaz : m.modalAnalysis;
    const f = modal(st.nodes.val, st.elements.val, st.nodeInputs.val, st.elementInputs.val, F[k].length).frequencies;
    F[k].forEach((ref, i) => {
      const d = 100 * (f[i] - ref) / ref;
      filas.push({ que: `${k} modal 3D de Struct, modo ${i + 1}`, medido: d, limite: 0.01, ok: Math.abs(d) <= 0.01,
                   detalle: `${f[i]?.toFixed(4)} Hz vs ${ref.toFixed(4)}` });
    });
  }
  const maxAbs = (r, j) => Math.max(...r.u.map((u) => Math.abs(u[j])));
  const pct = (a, b) => 100 * (a - b) / b;
  const fila = (que, med, ref, lim, unid = "in") => {
    const d = pct(med, ref);
    filas.push({ que, medido: d, limite: lim, ok: Number.isFinite(d) && Math.abs(d) <= lim, detalle: `${med.toPrecision(6)} vs ${ref.toPrecision(6)} ${unid}` });
  };
  // 4.1 — Duhamel exacto (ec. 4.11-4.12): u_st·2·sin(ω·td/2). Newmark con Δt = 0.001 y la carga lineal entre pasos
  // (el pulso termina en rampa de un paso) → 0.18 %; el mismo tratamiento que la función de tiempo de SAP2000.
  const w41 = Math.sqrt(k41 / m41);
  fila("4.1 u_max (Duhamel exacta)", maxAbs(th["4-1"], 0), 3000 / k41 * 2 * Math.sin(w41 * 0.1 / 2), 0.25);
  // 6.1 — la tabla del libro (p.153), β = 1/6, Δt = 0.005: 0.073 0.450 0.925 1.044 0.780 (3 decimales)
  const r61 = th["6-1"], dt61 = r61.t[1] - r61.t[0];
  [[0.02, 0.073], [0.04, 0.450], [0.06, 0.925], [0.08, 1.044], [0.10, 0.780]].forEach(([t, ref]) => {
    const u = r61.u[Math.round(t / dt61)][0], d = Math.abs(u - ref);
    filas.push({ que: `6.1 u(${t.toFixed(2)}) tabla del libro β=1/6 Δt=0.005`, medido: d, limite: 0.0006, ok: d <= 0.0006,
                 detalle: `${u.toFixed(4)} vs ${ref.toFixed(3)} in` });
  });
  // 8.1 — superposición modal exacta (validation/paz-newmark/paz8_1.py)
  fila("8.1 u1_max (modal exacta)", maxAbs(th["8-1"], 0), 0.67321, 0.1);
  fila("8.1 u2_max (modal exacta)", maxAbs(th["8-1"], 1), 0.86534, 0.1);
  // 10.7 — la viga del libro integrada con Δt = 1e-5 (validation/paz-newmark, ver registro)
  fila("10.7 u_centro_max (Programa 13, 6 GDL)", maxAbs(th["10-7"], 0), 1.25388, 0.1);
  // 13.1 — K y M del libro con T completa, Δt = 1e-5 (validation/paz-newmark/paz13_1.py)
  fila("13.1 uz_max nudo 1", Math.max(...th["13-1"].u.map((u) => Math.abs(u[2]))), 1.3195e-3, 0.2);
  return filas;
}
