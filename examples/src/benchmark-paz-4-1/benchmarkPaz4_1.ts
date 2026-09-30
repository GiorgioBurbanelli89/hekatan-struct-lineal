/**
 * 🏁 Benchmark FRAME — Paz Ej. 4.1 (1-DOF Rectangular Impulse)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 4.1, Illustrative Example 4.1, p.91
 *
 *  Modelo: pórtico 1-piso H=15ft, 2 columnas I=69.2 in⁴, viga rígida.
 *  Masa concentrada en el tope: W=5000 lb (m=12.9534 lb·s²/in)
 *  Material: E=30·10⁶ psi (steel)
 *
 *  Sistema reducido a 1-DOF (lateral en el tope):
 *    k = 12·E·(2I)/L³ = 12·30e6·138.4 / (180)³ = 8544 lb/in
 *    m = W/g = 5000/386 = 12.95 lb·s²/in
 *    T = 2π·√(m/k) = 0.2446 s
 *    ω = 25.69 rad/s, f = 4.09 Hz
 *
 *  Carga: pulso rectangular F0 = 3000 lb, duración td = 0.1 s
 *
 *  Resultados del libro:
 *    DLF_max = 1.9 (de tabla 4.4)
 *    u_max = 1.9 · u_st = 1.9 · (3000/8544) = 0.667 in
 *    σ_max columna = 15,083 psi
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import {
  buildShearBuildingModel,
  generateShearBuildingE2k,
  downloadTextFile,
  PAZ_UTILS,
} from "../shared/pazFrameE2k";
import { getSharedChartPanel } from "../shared/chartPanel";
import { newmarkBeta, rectPulse, pointAtDof } from "../shared/newmarkBeta";

const PAZ_REF = {
  H_ft: 15, I_in4: 69.2, S_in3: 17, E_psi: 30e6, W_lb: 5000,
  F0_lb: 3000, td_s: 0.1,
  // Resultados
  k_lbin: 8544, m_lbs2in: 12.9534,
  T_s: 0.2446, omega_rads: 25.69, f_Hz: 4.09,
  DLF_max: 1.9, u_max_in: 0.667, sigma_max_psi: 15083,
};

export const benchmarkPaz4_1: ExampleDef = {
  id: "benchmark-paz-4-1",
  name: "🏁 Frame · Paz 4.1 (1-DOF rectangular impulse)",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 4.1 — Pórtico 1-DOF bajo pulso rectangular (Duhamel + Newmark).",
    "Geometría: H=15ft, 2 cols I=69.2 in⁴, viga rígida. m=W/g=12.95 lb·s²/in.",
    "Material steel E=30e6 psi. T=0.2446 s, f=4.09 Hz.",
    "Carga: pulso rect F0=3000 lb, td=0.1s → td/T=0.408 → DLF=1.9 (libro).",
    "Resultado libro: u_max=0.667 in, σ_max=15,083 psi en columnas.",
    "📈 Chart Panel: u(t), v(t), a(t), F(t).",
    "📤 Toggle 'Exportar a .e2k' → modelo ETABS 1-piso para validación.",
  ],
  params: {
    H_ft: { default: 15, min: 8, max: 25, step: 0.5, label: "H piso (ft)", folder: "Geometría" },
    bay_ft: { default: 20, min: 10, max: 40, step: 1, label: "Ancho bay (ft)", folder: "Geometría" },
    I_in4: { default: 69.2, min: 20, max: 300, step: 1, label: "I por columna (in⁴)", folder: "Sección" },
    S_in3: { default: 17, min: 5, max: 100, step: 0.5, label: "S módulo sección (in³)", folder: "Sección" },
    E_psi: { default: 30e6, min: 25e6, max: 35e6, step: 0.5e6, label: "E acero (psi)", folder: "Material" },
    W_lb: { default: 5000, min: 1000, max: 50000, step: 100, label: "W tope (lb)", folder: "Cargas" },
    F0_lb: { default: 3000, min: 0, max: 20000, step: 100, label: "Pulso F0 (lb)", folder: "Time History" },
    td_s: { default: 0.1, min: 0.01, max: 1, step: 0.01, label: "Duración pulso td (s)", folder: "Time History" },
    tEnd_s: { default: 1.0, min: 0.2, max: 5, step: 0.1, label: "t fin (s)", folder: "Time History" },
    dt_s: { default: 0.001, min: 0.0001, max: 0.01, step: 0.0001, label: "Δt Newmark (s)", folder: "Time History" },
    xi: { default: 0.0, min: 0, max: 0.20, step: 0.005, label: "Damping ξ (libro=0)", folder: "Time History" },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 0, label: "Tipo gráfica",
      options: { "u(t)": 0, "v(t)": 1, "a(t)": 2, "F(t)": 3 },
      folder: "Time History",
    },
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const sb = paramsToSB(params);
      const { filename, content } = generateShearBuildingE2k(sb, "Paz_4_1");
      downloadTextFile(filename, content);
      console.log(`[Paz 4.1] e2k exportado: ${filename}`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) getSharedChartPanel().hide();
  },

  computedLabels(p) {
    const L_in = p.H_ft * 12;
    const k = 12 * p.E_psi * 2 * p.I_in4 / Math.pow(L_in, 3);
    const m = p.W_lb / 386.088;
    const omega = Math.sqrt(k / m);
    const T = 2 * Math.PI / omega;
    const f = 1 / T;
    const u_st = p.F0_lb / k;
    return {
      "k (lb/in)": k.toFixed(2),
      "m (lb·s²/in)": m.toFixed(4),
      "T calculado": `${T.toFixed(4)} s  (libro 0.2446)`,
      "ω calculado": `${omega.toFixed(2)} rad/s  (libro 25.69)`,
      "f calculado": `${f.toFixed(3)} Hz  (libro 4.09)`,
      "u_st = F0/k": `${u_st.toFixed(4)} in`,
      "td/T": (p.td_s / T).toFixed(3),
      "u_max esperado libro": `${PAZ_REF.u_max_in} in (DLF=${PAZ_REF.DLF_max})`,
    };
  },

  build(p, states) {
    const sb = paramsToSB(p);
    buildShearBuildingModel(sb, states);

    const L_in = p.H_ft * 12;
    const k = 12 * p.E_psi * 2 * p.I_in4 / Math.pow(L_in, 3);
    const m = p.W_lb / 386.088;
    const omega = Math.sqrt(k / m);
    const T = 2 * Math.PI / omega;

    let report = `[Paz 4.1] 1-DOF rectangular impulse\n`;
    report += `  k=${k.toFixed(2)} lb/in, m=${m.toFixed(4)} lb·s²/in\n`;
    report += `  T=${T.toFixed(4)} s  (libro 0.2446)\n`;
    report += `  td/T=${(p.td_s / T).toFixed(3)}\n`;

    // Newmark-β para 1-DOF
    const M = [[m]], K = [[k]], C = [[2 * p.xi * Math.sqrt(m * k)]];
    const F = pointAtDof(rectPulse(p.F0_lb, 0, p.td_s), 0, 1);
    const nSteps = Math.floor(p.tEnd_s / p.dt_s);
    const res = newmarkBeta({ M, K, C, loadFunc: F, u0: [0], v0: [0], dt: p.dt_s, nSteps });
    (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs (lo que se grafica)
    const u_max = Math.max(...res.u.map((u) => Math.abs(u[0])));
    const u_st = p.F0_lb / k;
    const DLF = u_max / u_st;
    // Exacta (Duhamel, Paz ec. 4.11–4.12): tras el pulso la amplitud es u_st·2·sin(ω·td/2) si td < T/2.
    const wn = Math.sqrt(k / m), uEx = u_st * (p.td_s * wn < Math.PI ? 2 * Math.sin(wn * p.td_s / 2) : 2);
    const dEx = (u_max - uEx) / uEx * 100;
    report += `  Newmark-β: u_max = ${u_max.toFixed(4)} in  (exacta Duhamel ${uEx.toFixed(4)}, Δ ${dEx.toFixed(2)}%;`
      + ` libro: ${PAZ_REF.u_max_in} leyendo la Fig. 4.4, 0.673 con su MATLAB, p.92–93)\n`;
    report += `  DLF calculado = ${DLF.toFixed(3)} (libro ${PAZ_REF.DLF_max})\n`;
    // σ = (6·E·I / L²) · u / (S·c) ... simplificado: M=k·u_max·L/2; σ = M/S
    // Paz p.92: M = V·L/2 con V el cortante de UNA columna → M = 6·E·I/L²·u_max; σ = M/S.
    // (Antes k·u·L/2 con la k de las DOS columnas: salía el doble, 30 524 psi.)
    const M_lbin = 6 * p.E_psi * p.I_in4 / (L_in * L_in) * u_max;
    const sigma = M_lbin / p.S_in3;
    report += `  σ_max columnas = ${sigma.toFixed(0)} psi  (libro ${PAZ_REF.sigma_max_psi})\n`;

    if (p.showTH > 0.5) {
      const panel = getSharedChartPanel();
      const ptype = Math.round(p.plotType ?? 0);
      if (ptype === 0) {
        panel.setTitle("Paz 4.1 — u(t)");
        panel.setSeries([{
          label: "u(t)",
          data: res.t.map((t, i) => [t, res.u[i][0]] as [number, number]),
          color: "#1a4d8c", width: 2,
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
      } else if (ptype === 1) {
        panel.setTitle("Paz 4.1 — v(t)");
        panel.setSeries([{
          label: "v(t)",
          data: res.t.map((t, i) => [t, res.v[i][0]] as [number, number]),
          color: "#1a4d8c",
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "v (in/s)", grid: true });
      } else if (ptype === 2) {
        panel.setTitle("Paz 4.1 — a(t)");
        panel.setSeries([{
          label: "a(t)",
          data: res.t.map((t, i) => [t, res.a[i][0]] as [number, number]),
          color: "#1a4d8c",
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "a (in/s²)", grid: true });
      } else {
        panel.setTitle("Paz 4.1 — F(t)");
        panel.setSeries([{
          label: "F(t)",
          data: res.t.map((t) => [t, rectPulse(p.F0_lb, 0, p.td_s)(t)] as [number, number]),
          color: "#7d3c98",
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "F (lb)", grid: true });
      }
      panel.show();
    }
    console.log(report);
  },

  hasModal: false,
};

function paramsToSB(p: Record<string, number>) {
  const E_kNm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi);
  const H_m = PAZ_UTILS.in_to_m(p.H_ft * 12);
  const bay_m = PAZ_UTILS.in_to_m(p.bay_ft * 12);
  const I_m4 = PAZ_UTILS.in4_to_m4(p.I_in4);
  const W_kN = PAZ_UTILS.lb_to_kN(p.W_lb);
  return {
    nStories: 1,
    storyHeights: [H_m],
    bayWidth: bay_m,
    storyWeights: [W_kN],
    I_per_column: [I_m4],
    nCols: 2,
    E: E_kNm2,
    gamma: 76.97,
    colSection: { D: 0.20, B: 0.20 },
    materialType: "Steel" as const,
  };
}
