/**
 * 🏁 Benchmark FRAME — Paz Ej. 6.1 (Newmark-β canonical 1-DOF — MATLAB code)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 6.5, Illustrative Example 6.1, p.151
 *
 *  Sistema 1-DOF (m, k, c) con carga TRAPEZOIDAL:
 *    F(t) = 120·t/0.02          si t ≤ 0.02   (subida lineal 0→120)
 *    F(t) = 120                 si 0.02 < t ≤ 0.04 (plateau)
 *    F(t) = max(0, 120·(0.06-t)/0.02)  si t > 0.04 (bajada lineal 120→0)
 *
 *  Datos del libro:
 *    m = 38.6/386 = 0.1 kip·s²/in
 *    k = 100 kip/in
 *    ξ = 0.2  (damping ratio)
 *    T = 2π·√(m/k) = 0.20 s
 *    Δt = T/10 = 0.02 s
 *    γ = 1/2, β = 1/6 (linear acceleration method)
 *
 *  Validamos contra Newmark-β puro de hekatan:
 *    - u_max, v_max, a_max
 *    - Comparación con γ=1/2, β=1/4 (average accel) — ambos esquemas
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import {
  buildShearBuildingModel,
  generateShearBuildingE2k,
  downloadTextFile,
  PAZ_UTILS,
} from "../shared/pazFrameE2k";
import { getSharedChartPanel } from "../shared/chartPanel";
import { newmarkBeta } from "../shared/newmarkBeta";

export const benchmarkPaz6_1: ExampleDef = {
  id: "benchmark-paz-6-1",
  name: "🏁 Frame · Paz 6.1 (Newmark-β canónico 1-DOF)",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 6.1 — 1-DOF con carga TRAPEZOIDAL: subida 0→120 (0-0.02s), plateau (0.02-0.04s), bajada 120→0 (0.04-0.06s).",
    "Sistema: m=0.1 kip·s²/in, k=100 kip/in, ξ=0.2.",
    "T=0.20 s, Δt=0.02 s = T/10.",
    "Newmark γ=1/2, β=1/6 (linear acceleration) y γ=1/2, β=1/4 (average) — ambos comparables.",
    "Validación: solver Newmark-β del libro vs implementación TS Hekatan.",
    "📈 Chart Panel: u(t), v(t), a(t), F(t) — trapezoidal vs respuesta.",
    "📤 Toggle 'Exportar a .e2k' → 1-DOF equivalente como columna 1-piso.",
  ],
  params: {
    m_kips2in: { default: 0.1, min: 0.01, max: 5, step: 0.01, label: "m (kip·s²/in)", folder: "Sistema" },
    k_kipin: { default: 100, min: 10, max: 1000, step: 1, label: "k (kip/in)", folder: "Sistema" },
    xi: { default: 0.2, min: 0, max: 0.5, step: 0.005, label: "Damping ξ", folder: "Sistema" },
    Fmax_kip: { default: 120, min: 0, max: 500, step: 1, label: "F_max trapezoide (kip)", folder: "Carga" },
    t1_s: { default: 0.02, min: 0.005, max: 0.2, step: 0.005, label: "t₁ rampa subida (s)", folder: "Carga" },
    t2_s: { default: 0.04, min: 0.01, max: 0.3, step: 0.005, label: "t₂ fin plateau (s)", folder: "Carga" },
    t3_s: { default: 0.06, min: 0.02, max: 0.4, step: 0.005, label: "t₃ fin bajada (s)", folder: "Carga" },
    tEnd_s: { default: 0.5, min: 0.1, max: 5, step: 0.1, label: "t fin (s)", folder: "Time History" },
    dt_s: { default: 0.005, min: 0.0001, max: 0.05, step: 0.0001, label: "Δt Newmark (s) — libro 0.02 · 0.01 · 0.005", folder: "Time History" },
    schemeBeta: {
      default: 1, label: "Esquema Newmark",   // el del libro (Ej. 6.1: β = 1/6)
      options: { "γ=1/2, β=1/4 (avg accel — incond.)": 0, "γ=1/2, β=1/6 (linear accel — Paz)": 1 },
      folder: "Time History",
    },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 0, label: "Tipo gráfica",
      options: { "u(t)": 0, "v(t)": 1, "a(t)": 2, "F(t)": 3, "Comparación esquemas": 4 },
      folder: "Time History",
    },
    H_in: { default: 120, min: 60, max: 360, step: 6, label: "H equivalente (in, e2k)", folder: "Exportar" },
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const sb = paramsToSB(params);
      const { filename, content } = generateShearBuildingE2k(sb, "Paz_6_1");
      downloadTextFile(filename, content);
      console.log(`[Paz 6.1] e2k exportado: ${filename}`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) getSharedChartPanel().hide();
  },

  computedLabels(p) {
    const omega = Math.sqrt(p.k_kipin / p.m_kips2in);
    const T = 2 * Math.PI / omega;
    return {
      "ω": `${omega.toFixed(3)} rad/s`,
      "T": `${T.toFixed(4)} s  (libro 0.2000)`,
      "f": `${(1 / T).toFixed(3)} Hz`,
      "Δt/T": (p.dt_s / T).toFixed(4),
      "c (kip·s/in)": (2 * p.xi * Math.sqrt(p.m_kips2in * p.k_kipin)).toFixed(4),
    };
  },

  build(p, states) {
    // Modelo Hekatan (1 piso para visualización + e2k)
    const sb = paramsToSB(p);
    buildShearBuildingModel(sb, states);

    const M = [[p.m_kips2in]];
    const K = [[p.k_kipin]];
    const C = [[2 * p.xi * Math.sqrt(p.m_kips2in * p.k_kipin)]];

    const Fmax = p.Fmax_kip, t1 = p.t1_s, t2 = p.t2_s, t3 = p.t3_s;
    const Ftrap = (t: number): number[] => {
      if (t <= 0) return [0];
      if (t <= t1) return [Fmax * t / t1];
      if (t <= t2) return [Fmax];
      if (t <= t3) return [Math.max(0, Fmax * (t3 - t) / (t3 - t2))];
      return [0];
    };

    const nSteps = Math.floor(p.tEnd_s / p.dt_s);
    const scheme = Math.round(p.schemeBeta ?? 0);
    const beta = scheme === 0 ? 0.25 : 1 / 6;
    const gamma = 0.5;

    const res = newmarkBeta({
      M, K, C, loadFunc: Ftrap, u0: [0], v0: [0],
      dt: p.dt_s, nSteps, gamma, beta,
    });
    (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs (lo que se grafica)
    const u_max = Math.max(...res.u.map((u) => Math.abs(u[0])));
    const v_max = Math.max(...res.v.map((v) => Math.abs(v[0])));
    const a_max = Math.max(...res.a.map((a) => Math.abs(a[0])));

    let report = `[Paz 6.1] Newmark-β canonical 1-DOF\n`;
    report += `  Esquema: γ=1/2, β=${scheme === 0 ? "1/4" : "1/6"} (${scheme === 0 ? "avg accel" : "linear accel — Paz"})\n`;
    report += `  Δt=${p.dt_s} s, nSteps=${nSteps}\n`;
    report += `  u_max = ${u_max.toFixed(5)} in\n`;
    report += `  v_max = ${v_max.toFixed(4)} in/s\n`;
    report += `  a_max = ${a_max.toFixed(2)} in/s²\n`;

    if (p.showTH > 0.5) {
      const panel = getSharedChartPanel();
      const ptype = Math.round(p.plotType ?? 0);
      if (ptype === 0) {
        panel.setTitle("Paz 6.1 — u(t)");
        panel.setSeries([{
          label: `u(t) β=${scheme === 0 ? "1/4" : "1/6"}`,
          data: res.t.map((t, i) => [t, res.u[i][0]] as [number, number]),
          color: "#1a4d8c", width: 2,
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
      } else if (ptype === 1) {
        panel.setTitle("Paz 6.1 — v(t)");
        panel.setSeries([{
          label: `v(t)`,
          data: res.t.map((t, i) => [t, res.v[i][0]] as [number, number]),
          color: "#1a4d8c",
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "v (in/s)", grid: true });
      } else if (ptype === 2) {
        panel.setTitle("Paz 6.1 — a(t)");
        panel.setSeries([{
          label: `a(t)`,
          data: res.t.map((t, i) => [t, res.a[i][0]] as [number, number]),
          color: "#1a4d8c",
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "a (in/s²)", grid: true });
      } else if (ptype === 3) {
        panel.setTitle("Paz 6.1 — Carga F(t) trapezoidal");
        panel.setSeries([{
          label: "F(t)",
          data: res.t.map((t) => [t, Ftrap(t)[0]] as [number, number]),
          color: "#7d3c98", width: 2,
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "F (kip)", grid: true });
      } else if (ptype === 4) {
        // Comparar ambos esquemas
        const r1 = newmarkBeta({ M, K, C, loadFunc: Ftrap, u0: [0], v0: [0], dt: p.dt_s, nSteps, gamma: 0.5, beta: 0.25 });
        const r2 = newmarkBeta({ M, K, C, loadFunc: Ftrap, u0: [0], v0: [0], dt: p.dt_s, nSteps, gamma: 0.5, beta: 1 / 6 });
        panel.setTitle("Paz 6.1 — Comparación β=1/4 vs β=1/6");
        panel.setSeries([
          { label: "u(t) β=1/4 avg accel", data: r1.t.map((t, i) => [t, r1.u[i][0]] as [number, number]), color: "#1a4d8c" },
          { label: "u(t) β=1/6 linear accel", data: r2.t.map((t, i) => [t, r2.u[i][0]] as [number, number]), color: "#c0392b" },
        ]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
      }
      panel.show();
    }
    console.log(report);
  },

  hasModal: false,
};

function paramsToSB(p: Record<string, number>) {
  // Convertimos 1-DOF (m, k) → equivalente columna 2-cols con I tal que k = 24·E·I/L³
  const E_psi = 30e6;
  const L_in = p.H_in;
  // k_kipin = 100 → k_lbin = 100,000 lb/in
  const k_lbin = p.k_kipin * 1000;
  const I_in4 = k_lbin * Math.pow(L_in, 3) / (24 * E_psi);
  const W_lb = p.m_kips2in * 1000 * 386.088;  // m·g, en lb

  const E_kNm2 = PAZ_UTILS.psi_to_kNm2(E_psi);
  const H_m = PAZ_UTILS.in_to_m(L_in);
  const I_m4 = PAZ_UTILS.in4_to_m4(I_in4);
  const W_kN = PAZ_UTILS.lb_to_kN(W_lb);
  return {
    nStories: 1,
    storyHeights: [H_m],
    bayWidth: PAZ_UTILS.in_to_m(120),
    storyWeights: [W_kN],
    I_per_column: [I_m4],
    nCols: 2,
    E: E_kNm2,
    gamma: 76.97,
    colSection: { D: 0.20, B: 0.20 },
    materialType: "Steel" as const,
  };
}
