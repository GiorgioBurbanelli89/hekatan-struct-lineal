/**
 * 🏁 Benchmark FRAME — Paz Ej. 8.1 (2-story shear building bajo cargas triangulares)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 8.1, Illustrative Example 8.1, p.196
 *
 *  Modelo: Mismo edificio de Paz 7.1 (2-story shear), pero ahora con cargas
 *  TRIANGULARES descendientes en cada piso:
 *
 *    F₁(t) = 10,000·(1 − t/0.1)  lb,  para 0 ≤ t ≤ 0.1s, sino 0 (piso 1)
 *    F₂(t) = 20,000·(1 − t/0.1)  lb,  para 0 ≤ t ≤ 0.1s, sino 0 (piso 2)
 *
 *  Datos iguales a Paz 7.1:
 *    m1 = 136, m2 = 66 lb·s²/in
 *    k1 = 30,700, k2 = 44,300 lb/in
 *    ω1 = 11.83 rad/s, ω2 = 32.89 rad/s
 *
 *  Resultados del libro (modal superposition + tabla DLF):
 *    q1_max = 9.62, q2_max = 1.44 (coordenadas modales)
 *    u1_max ≈ 0.70 in (cota superior por suma absoluta de modos)
 *    u2_max ≈ 0.92 in (cota superior)
 *
 *  Validamos con Newmark-β directo (sin desacoplar modos).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import {
  buildShearBuildingModel,
  generateShearBuildingE2k,
  downloadTextFile,
  PAZ_UTILS,
} from "../shared/pazFrameE2k";
import { getSharedChartPanel } from "../shared/chartPanel";
import {
  newmarkBeta, shearBuildingKM, rayleighDamping, solveEigenGeneralized,
} from "../shared/newmarkBeta";

export const benchmarkPaz8_1: ExampleDef = {
  id: "benchmark-paz-8-1",
  name: "🏁 Frame · Paz 8.1 (2-DOF triangular impulse)",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 8.1 — Mismo edificio Paz 7.1 con cargas triangulares en pisos.",
    "F₁(t) = 10,000·(1-t/0.1) lb, F₂(t) = 20,000·(1-t/0.1) lb (descendiente t∈[0,0.1]).",
    "Validación: modal superposition (libro) vs Newmark-β directo (TS Hekatan).",
    "Libro: u₁_max ≈ 0.70 in, u₂_max ≈ 0.92 in (cota superior |Σ|φᵢ·qᵢ_max).",
    "📈 Chart Panel: u(t), F(t) descomposición por piso.",
    "📤 Toggle 'Exportar a .e2k' → modelo ETABS con cargas TIME HISTORY function.",
  ],
  params: {
    H1_ft: { default: 15, min: 8, max: 25, step: 0.5, label: "H1 piso 1 (ft)", folder: "Geometría" },
    H2_ft: { default: 10, min: 6, max: 20, step: 0.5, label: "H2 piso 2 (ft)", folder: "Geometría" },
    bay_ft: { default: 30, min: 10, max: 60, step: 1, label: "Ancho bay (ft)", folder: "Geometría" },
    I1_in4: { default: 248.6, min: 50, max: 600, step: 0.1, label: "I col piso 1 (in⁴)", folder: "Sección" },
    I2_in4: { default: 106.3, min: 50, max: 600, step: 0.1, label: "I col piso 2 (in⁴)", folder: "Sección" },
    W1_lb: { default: 52500, min: 10000, max: 150000, step: 500, label: "W1 (lb)", folder: "Cargas estáticas" },
    W2_lb: { default: 25500, min: 5000, max: 100000, step: 500, label: "W2 (lb)", folder: "Cargas estáticas" },
    E_psi: { default: 30e6, min: 25e6, max: 35e6, step: 0.5e6, label: "E (psi)", folder: "Material" },
    F1_lb: { default: 10000, min: 0, max: 50000, step: 100, label: "F₁ pico piso 1 (lb)", folder: "Time History" },
    F2_lb: { default: 20000, min: 0, max: 50000, step: 100, label: "F₂ pico piso 2 (lb)", folder: "Time History" },
    td_s: { default: 0.1, min: 0.01, max: 1, step: 0.01, label: "Duración td (s)", folder: "Time History" },
    tEnd_s: { default: 1.0, min: 0.5, max: 5, step: 0.1, label: "t fin (s)", folder: "Time History" },
    dt_s: { default: 0.002, min: 0.0001, max: 0.05, step: 0.0001, label: "Δt Newmark (s)", folder: "Time History" },
    xi: { default: 0.0, min: 0, max: 0.20, step: 0.005, label: "Damping ξ (libro=0)", folder: "Time History" },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 0, label: "Tipo gráfica",
      options: { "u(t) ambos pisos": 0, "F(t) ambos pisos": 1, "v(t)": 2, "a(t)": 3 },
      folder: "Time History",
    },
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const sb = paramsToSB(params);
      const { filename, content } = generateShearBuildingE2k(sb, "Paz_8_1");
      downloadTextFile(filename, content);
      console.log(`[Paz 8.1] e2k exportado: ${filename}`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) getSharedChartPanel().hide();
  },

  build(p, states) {
    const sb = paramsToSB(p);
    buildShearBuildingModel(sb, states);

    const E_psi = p.E_psi;
    const I1 = p.I1_in4, I2 = p.I2_in4;
    const H1_in = p.H1_ft * 12, H2_in = p.H2_ft * 12;
    const k1 = (12 * E_psi * I1 * 2) / Math.pow(H1_in, 3);
    const k2 = (12 * E_psi * I2 * 2) / Math.pow(H2_in, 3);
    const m1 = p.W1_lb / 386.088;
    const m2 = p.W2_lb / 386.088;
    const { K, M } = shearBuildingKM([m1, m2], [k1, k2]);

    const F1 = p.F1_lb, F2 = p.F2_lb, td = p.td_s;
    const Ftri = (t: number): number[] => {
      // Paz 8.1 (p.196): F(t) = F0(1 − t/td) para 0 ≤ t ≤ td → en t = 0 vale F0, no 0.
      if (t < 0 || t >= td) return [0, 0];
      const fac = 1 - t / td;
      return [F1 * fac, F2 * fac];
    };

    let report = `[Paz 8.1] 2-DOF triangular impulse\n`;
    try {
      const eig = solveEigenGeneralized(K, M);
      const omega1 = Math.sqrt(eig.omega2[0]), omega2 = Math.sqrt(eig.omega2[1]);
      const C = rayleighDamping(M, K, omega1, omega2, p.xi);
      const nSteps = Math.floor(p.tEnd_s / p.dt_s);
      const res = newmarkBeta({
        M, K, C, loadFunc: Ftri, u0: [0, 0], v0: [0, 0],
        dt: p.dt_s, nSteps, gamma: 0.5, beta: 0.25,
      });
      (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs (lo que se grafica)
      const u1_max = Math.max(...res.u.map((u) => Math.abs(u[0])));
      const u2_max = Math.max(...res.u.map((u) => Math.abs(u[1])));
      report += `  Modal: f1=${eig.freqs[0].toFixed(3)}, f2=${eig.freqs[1].toFixed(3)} Hz\n`;
      report += `  Newmark-β: u1_max=${u1_max.toFixed(4)} in (libro, cota |Σ| 0.70, SRSS 0.62)\n`;
      report += `             u2_max=${u2_max.toFixed(4)} in (libro, cota |Σ| 0.92, SRSS 0.79)\n`;

      if (p.showTH > 0.5) {
        const panel = getSharedChartPanel();
        const ptype = Math.round(p.plotType ?? 0);
        if (ptype === 0) {
          panel.setTitle("Paz 8.1 — u(t)");
          panel.setSeries([
            { label: "u₁(t) piso 1", data: res.t.map((t, i) => [t, res.u[i][0]] as [number, number]), color: "#1a4d8c", width: 2 },
            { label: "u₂(t) piso 2", data: res.t.map((t, i) => [t, res.u[i][1]] as [number, number]), color: "#c0392b", width: 2 },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
        } else if (ptype === 1) {
          panel.setTitle("Paz 8.1 — Cargas F(t) triangulares");
          panel.setSeries([
            { label: "F₁(t) piso 1", data: res.t.map((t) => [t, Ftri(t)[0]] as [number, number]), color: "#1a4d8c" },
            { label: "F₂(t) piso 2", data: res.t.map((t) => [t, Ftri(t)[1]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "F (lb)", grid: true });
        } else if (ptype === 2) {
          panel.setTitle("Paz 8.1 — v(t)");
          panel.setSeries([
            { label: "v₁(t)", data: res.t.map((t, i) => [t, res.v[i][0]] as [number, number]), color: "#1a4d8c" },
            { label: "v₂(t)", data: res.t.map((t, i) => [t, res.v[i][1]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "v (in/s)", grid: true });
        } else {
          panel.setTitle("Paz 8.1 — a(t)");
          panel.setSeries([
            { label: "a₁(t)", data: res.t.map((t, i) => [t, res.a[i][0]] as [number, number]), color: "#1a4d8c" },
            { label: "a₂(t)", data: res.t.map((t, i) => [t, res.a[i][1]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "a (in/s²)", grid: true });
        }
        panel.show();
      }
    } catch (e: any) {
      report += `  ⚠️ Error: ${e.message}\n`;
    }
    console.log(report);
  },

  hasModal: false,
};

function paramsToSB(p: Record<string, number>) {
  const E_kNm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi);
  return {
    nStories: 2,
    storyHeights: [PAZ_UTILS.in_to_m(p.H1_ft * 12), PAZ_UTILS.in_to_m(p.H2_ft * 12)],
    bayWidth: PAZ_UTILS.in_to_m(p.bay_ft * 12),
    storyWeights: [PAZ_UTILS.lb_to_kN(p.W1_lb), PAZ_UTILS.lb_to_kN(p.W2_lb)],
    I_per_column: [PAZ_UTILS.in4_to_m4(p.I1_in4), PAZ_UTILS.in4_to_m4(p.I2_in4)],
    nCols: 2, E: E_kNm2, gamma: 76.97,
    colSection: { D: 0.30, B: 0.30 },
    materialType: "Steel" as const,
  };
}
