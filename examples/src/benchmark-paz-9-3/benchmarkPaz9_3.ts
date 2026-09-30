/**
 * 🏁 Benchmark FRAME — Paz Ej. 9.3 (Four-Story Uniform Shear Building)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 9.2, Illustrative Example 9.3, p.228
 *
 *  Modelo: shear building uniforme de 4 pisos (todas las masas y rigideces iguales).
 *
 *  Matrices del libro (forma normalizada):
 *    M = m·I (matriz identidad escalada)
 *    K = k·[[2,-1, 0, 0],[-1, 2,-1, 0],[0,-1, 2,-1],[0, 0,-1, 1]]
 *    Con k=327.35 (lb/in) y m=1 (lb·s²/in) → eigenvalues directos
 *
 *  Resultados analíticos del libro (p.228):
 *    ω₁² = 39.48,  ω₁ = 6.283 rad/s  →  f₁ = 1.00 Hz
 *    ω₂² = 327.35, ω₂ = 18.09 rad/s  →  f₂ = 2.88 Hz
 *    ω₃² = 768.3,  ω₃ = 27.72 rad/s  →  f₃ = 4.41 Hz
 *    ω₄² = 1156.0, ω₄ = 34.00 rad/s  →  f₄ = 5.41 Hz
 *
 *  Matriz modal normalizada Φ:
 *      0.2280   0.5774   0.6565  -0.4285
 *      0.4285  -0.5774  -0.2280   0.6565
 *      0.5774   0       -0.5774  -0.5774
 *      0.6565   0.5774   0.4285   0.2280
 *
 *  Para hacer modelo físico, asignamos:
 *    - 4 pisos iguales: H=10 ft (3.048 m)
 *    - 2 columnas por marco con I tal que k = 12·E·(2I)/L³ = 327.35 → I=21.2 in⁴
 *    - Masa por piso: m=1 lb·s²/in → W = 386.088 lb
 */
import { modalAnalysis } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import {
  buildShearBuildingModel,
  generateShearBuildingE2k,
  downloadTextFile,
  PAZ_UTILS,
} from "../shared/pazFrameE2k";
import { getSharedChartPanel } from "../shared/chartPanel";
import {
  newmarkBeta, shearBuildingKM, rayleighDamping,
  rectPulse, pointAtDof, solveEigenGeneralized,
} from "../shared/newmarkBeta";

const PAZ_REF = {
  // Matrices canónicas del libro (asumiendo m=1 lb·s²/in, k=327.35 lb/in)
  k_lbin: 327.35,
  m_lbs2in: 1.0,
  // Resultados
  freqs_Hz: [1.00, 2.88, 4.41, 5.41],
  omega2: [39.48, 327.35, 768.3, 1156.0],
  modes: [
    [0.2280, 0.5774,  0.6565, -0.4285],
    [0.4285,-0.5774, -0.2280,  0.6565],
    [0.5774, 0.0000, -0.5774, -0.5774],
    [0.6565, 0.5774,  0.4285,  0.2280],
  ],
};

export const benchmarkPaz9_3: ExampleDef = {
  id: "benchmark-paz-9-3",
  name: "🏁 Frame · Paz 9.3 (4-story uniform shear bldg)",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 9.3 — Four-story uniform shear building (modal analysis canónico).",
    "Pisos uniformes: H=10ft, k=327.35 lb/in cada uno, m=1.0 lb·s²/in cada piso.",
    "Resultados del libro: f₁=1.00, f₂=2.88, f₃=4.41, f₄=5.41 Hz.",
    "Matriz modal Φ del libro (p.228) coincide con autovectores del solver.",
    "📈 Chart Panel: muestra los 4 modos como gráficas piso-vs-φ.",
    "📤 Toggle 'Exportar a .e2k' → modelo ETABS canónico para validación.",
  ],
  params: {
    H_ft: { default: 10, min: 6, max: 20, step: 0.5, label: "H piso (ft)", folder: "Geometría" },
    bay_ft: { default: 30, min: 10, max: 60, step: 1, label: "Ancho bay (ft)", folder: "Geometría" },
    k_lbin: { default: 327.35, min: 100, max: 1000, step: 1, label: "k por piso (lb/in)", folder: "Rigidez" },
    m_lbs2in: { default: 1.0, min: 0.1, max: 10, step: 0.1, label: "m por piso (lb·s²/in)", folder: "Masa" },
    E_psi: { default: 30e6, min: 25e6, max: 35e6, step: 0.5e6, label: "E acero (psi)", folder: "Material" },
    F0_lb: { default: 50, min: 0, max: 500, step: 1, label: "Pulso F0 piso 4 (lb) — demostración, no del libro (el Ej. 9.3 pide modos y condensación)", folder: "Time History" },
    pulseDur_s: { default: 0.1, min: 0.01, max: 1, step: 0.01, label: "Duración pulso (s)", folder: "Time History" },
    tEnd_s: { default: 5.0, min: 1, max: 20, step: 0.5, label: "t fin análisis (s)", folder: "Time History" },
    dt_s: { default: 0.01, min: 0.001, max: 0.05, step: 0.001, label: "Δt Newmark (s)", folder: "Time History" },
    xi: { default: 0.05, min: 0, max: 0.20, step: 0.005, label: "Damping ξ", folder: "Time History" },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 4,
      label: "Tipo gráfica",
      options: { "u(t)": 0, "v(t)": 1, "a(t)": 2, "F(t)": 3, "Modos": 4 },
      folder: "Time History",
    },
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },
  hasModal: true,

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const sb = paramsToShearBuilding(params);
      const { filename, content } = generateShearBuildingE2k(sb, "Paz_9_3");
      downloadTextFile(filename, content);
      console.log(`[Paz 9.3] e2k exportado: ${filename} (${content.length} bytes)`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) {
      getSharedChartPanel().hide();
    }
  },

  computedLabels(p) {
    const m = new Array(4).fill(p.m_lbs2in);
    const k = new Array(4).fill(p.k_lbin);
    const { K, M } = shearBuildingKM(m, k);
    let freqs: number[] = [];
    try {
      freqs = solveEigenGeneralized(K, M).freqs;
    } catch {}
    return {
      "f₁ calculado": `${freqs[0]?.toFixed(3) ?? "?"} Hz  (libro 1.00 Hz)`,
      "f₂ calculado": `${freqs[1]?.toFixed(3) ?? "?"} Hz  (libro 2.88 Hz)`,
      "f₃ calculado": `${freqs[2]?.toFixed(3) ?? "?"} Hz  (libro 4.41 Hz)`,
      "f₄ calculado": `${freqs[3]?.toFixed(3) ?? "?"} Hz  (libro 5.41 Hz)`,
    };
  },

  build(p, states) {
    const sb = paramsToShearBuilding(p);
    buildShearBuildingModel(sb, states);

    // Solver matricial directo (validación analítica)
    const m = new Array(4).fill(p.m_lbs2in);
    const k = new Array(4).fill(p.k_lbin);
    const { K, M } = shearBuildingKM(m, k);

    let report = `[Paz 9.3] 4-story uniform shear building\n`;
    try {
      const eig = solveEigenGeneralized(K, M);
      report += `  Solver matricial directo:\n`;
      eig.freqs.forEach((f, i) => {
        const fRef = PAZ_REF.freqs_Hz[i];
        const df = (f - fRef) / fRef * 100;
        report += `    f${i + 1} = ${f.toFixed(4)} Hz  (libro ${fRef.toFixed(2)}, Δ ${df.toFixed(3)}%)\n`;
      });
      // Time history
      const omega1 = Math.sqrt(eig.omega2[0]);
      const omegaN = Math.sqrt(eig.omega2[eig.omega2.length - 1]);
      const C = rayleighDamping(M, K, omega1, omegaN, p.xi);
      const F = pointAtDof(rectPulse(p.F0_lb, 0, p.pulseDur_s), 3, 4);  // pulso piso 4
      const nSteps = Math.floor(p.tEnd_s / p.dt_s);
      const u0 = [0, 0, 0, 0], v0 = [0, 0, 0, 0];
      const res = newmarkBeta({
        M, K, C,
        loadFunc: F,
        u0, v0,
        dt: p.dt_s, nSteps,
        gamma: 0.5, beta: 0.25,
      });
      (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs (lo que se grafica)
      const u_max = [0, 0, 0, 0];
      for (const u of res.u) for (let i = 0; i < 4; i++) u_max[i] = Math.max(u_max[i], Math.abs(u[i]));
      report += `  Newmark-β TH (pulso F0=${p.F0_lb} lb por ${p.pulseDur_s}s, ξ=${p.xi}):\n`;
      report += `    u_max = ${u_max.map((v) => v.toExponential(3)).join(", ")} in\n`;

      // Plot
      if (p.showTH > 0.5) {
        const panel = getSharedChartPanel();
        const ptype = Math.round(p.plotType ?? 4);
        if (ptype === 0) {
          panel.setTitle("Paz 9.3 — Time History u(t)");
          panel.setSeries([0, 1, 2, 3].map((i) => ({
            label: `u${i + 1}(t)`,
            data: res.t.map((t, k) => [t, res.u[k][i]] as [number, number]),
            color: ["#1a4d8c", "#2d8659", "#d4a017", "#c0392b"][i],
          })));
          panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
        } else if (ptype === 1) {
          panel.setTitle("Paz 9.3 — Velocidad v(t)");
          panel.setSeries([0, 1, 2, 3].map((i) => ({
            label: `v${i + 1}(t)`,
            data: res.t.map((t, k) => [t, res.v[k][i]] as [number, number]),
            color: ["#1a4d8c", "#2d8659", "#d4a017", "#c0392b"][i],
          })));
          panel.setAxes({ xLabel: "t (s)", yLabel: "v (in/s)", grid: true });
        } else if (ptype === 2) {
          panel.setTitle("Paz 9.3 — Aceleración a(t)");
          panel.setSeries([0, 1, 2, 3].map((i) => ({
            label: `a${i + 1}(t)`,
            data: res.t.map((t, k) => [t, res.a[k][i]] as [number, number]),
            color: ["#1a4d8c", "#2d8659", "#d4a017", "#c0392b"][i],
          })));
          panel.setAxes({ xLabel: "t (s)", yLabel: "a (in/s²)", grid: true });
        } else if (ptype === 3) {
          panel.setTitle("Paz 9.3 — Carga F(t) en piso 4");
          panel.setSeries([{
            label: "F(t)",
            data: res.t.map((t) => [t, rectPulse(p.F0_lb, 0, p.pulseDur_s)(t)] as [number, number]),
            color: "#7d3c98",
          }]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "F (lb)", grid: true });
        } else if (ptype === 4) {
          panel.setTitle("Paz 9.3 — Modos {φ₁..φ₄}");
          // eig.modes: matriz columnas son modos
          const modes = [0, 1, 2, 3].map((modeIdx) => {
            const data: [number, number][] = [[0, 0]];
            for (let s = 0; s < 4; s++) data.push([eig.modes[s][modeIdx], s + 1]);
            return {
              label: `Modo ${modeIdx + 1} (f=${eig.freqs[modeIdx].toFixed(2)} Hz)`,
              data,
              color: ["#1a4d8c", "#2d8659", "#d4a017", "#c0392b"][modeIdx],
              width: 2.5,
            };
          });
          panel.setSeries(modes);
          panel.setAxes({ xLabel: "φ", yLabel: "piso (0=base)", grid: true });
        }
        panel.show();
      }
    } catch (e: any) {
      report += `  ⚠️ Error: ${e.message}\n`;
    }
    console.log(report);
  },

  runModal(p, states, modalPanel) {
    if (!states.nodes.val.length) return;
    try {
      const out = modalAnalysis(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, 6,
      );
      console.log(`[Paz 9.3 — Modal Hekatan FEM 3D] frecuencias:\n` +
        out.frequencies.slice(0, 6).map((f, i) =>
          `  Modo ${i + 1}: f = ${f.toFixed(3)} Hz   T = ${(1 / f).toFixed(4)} s`
        ).join("\n"));
      if (modalPanel?.render) {
        modalPanel.render(out, {
          title: "Paz 9.3 — 4-story uniform shear building",
          properties: [
            `Libro: f₁=1.00, f₂=2.88, f₃=4.41, f₄=5.41 Hz`,
            `H=${p.H_ft}ft, k=${p.k_lbin} lb/in, m=${p.m_lbs2in} lb·s²/in`,
          ],
        });
      }
    } catch (e: any) {
      console.error("[Paz 9.3 Modal FEM] error:", e.message);
    }
  },
};

function paramsToShearBuilding(p: Record<string, number>) {
  const E_kNm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi);
  const H_m = PAZ_UTILS.in_to_m(p.H_ft * 12);
  const bay_m = PAZ_UTILS.in_to_m(p.bay_ft * 12);
  // Calcular I per col tal que k = 12·E·(2I)/L³ = p.k_lbin
  // I = k·L³ / (24·E)
  const L_in = p.H_ft * 12;
  const I_in4 = p.k_lbin * Math.pow(L_in, 3) / (24 * p.E_psi);
  const I_m4 = PAZ_UTILS.in4_to_m4(I_in4);
  // W = m·g
  const W_lb = p.m_lbs2in * 386.088;
  const W_kN = PAZ_UTILS.lb_to_kN(W_lb);

  return {
    nStories: 4,
    storyHeights: [H_m, H_m, H_m, H_m],
    bayWidth: bay_m,
    storyWeights: [W_kN, W_kN, W_kN, W_kN],
    I_per_column: [I_m4, I_m4, I_m4, I_m4],
    nCols: 2,
    E: E_kNm2,
    gamma: 76.97,
    colSection: { D: 0.20, B: 0.20 },
    materialType: "Steel" as const,
  };
}
