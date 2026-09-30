/**
 * 🏁 Benchmark FRAME — Paz Ej. 7.1 (Two-Story Shear Building)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 7.2, Illustrative Example 7.1, p.177
 *
 *  Modelo:
 *    Edificio de acero rígido de 2 pisos, separación entre marcos 15 ft,
 *    dimensión planta 30×15 ft, 2 columnas por marco interior.
 *
 *  Pisos (vigas asumidas rígidas — shear building idealization):
 *    Piso 1: H1=15 ft (4.572 m), 2 cols W10×45 I=248.6 in⁴ → k1=30,700 lb/in (p.198)
 *    Piso 2: H2=10 ft (3.048 m), 2 cols W10×21 I=106.3 in⁴ → k2=44,300 lb/in (el «118» del texto
 *            de la p.178 es errata: con 118 sale k2=49,167; el libro calcula con 106.3, p.199)
 *  Pesos:
 *    W1 = 100·30·15 + 20·12.5·15·2 = 52,500 lb (m1=136 lb·s²/in)
 *    W2 = 50·30·15  + 20·5·15·2    = 25,500 lb (m2=66  lb·s²/in)
 *  Material: Steel A992 (E = 30 × 10⁶ psi)
 *
 *  Resultados analíticos del libro (p.179):
 *    ω₁ = 11.83 rad/s  →  f₁ = 1.88 Hz, T₁ = 0.532 s
 *    ω₂ = 32.89 rad/s  →  f₂ = 5.24 Hz, T₂ = 0.191 s
 *    Mode 1: φ = {1.000, 1.263}^T   (uniforme)
 *    Mode 2: φ = {1.000, -1.629}^T  (anti-uniforme)
 *
 *  Validación cruzada:
 *    1) Hekatan modal vs Paz analítico → bit-exact esperado < 1%
 *    2) Newmark-β TH (rectangular pulse) → ploteable en Chart Panel
 *    3) e2k → ETABS modal: misma f₁, f₂
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
  type Matrix,
} from "../shared/newmarkBeta";

// ── Constantes de Paz Ej. 7.1 (sistema imperial original) ───────────
const PAZ_REF = {
  // Geometría
  H1_ft: 15,  H2_ft: 10,
  bayWidth_ft: 30,        // dimensión planta donde van las cols (=L)
  // Pesos en lb
  W1_lb: 52500, W2_lb: 25500,
  // Masas equivalentes (W/g) en lb·s²/in
  m1_lbs2in: 136, m2_lbs2in: 66,
  // Rigideces calculadas en lb/in
  k1_lbin: 30700, k2_lbin: 44300,
  // Momento de inercia por columna en in⁴
  I1_in4: 248, I2_in4: 118,
  // E acero
  E_psi: 30e6,
  // Resultados analíticos del libro
  f1_Hz: 1.88, f2_Hz: 5.24,
  T1_s: 0.532, T2_s: 0.191,
  omega1_rads: 11.83, omega2_rads: 32.89,
  mode1: [1.000, 1.263],
  mode2: [1.000, -1.629],
};

export const benchmarkPaz7_1: ExampleDef = {
  id: "benchmark-paz-7-1",
  name: "🏁 Frame · Paz 7.1 (2-story shear building)",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 7.1 — Two-story steel shear building, validación modal canónica.",
    "Pisos: H1=15ft, H2=10ft. 2 columnas por marco: W10×45 (I=248.6) y W10×21 (I=106.3 in⁴), Fig. 7.4 y p.198–199 (el 118 de p.178 es errata).",
    "Pesos: W1=52,500 lb (m1=136 lb·s²/in), W2=25,500 lb (m2=66 lb·s²/in).",
    "Vigas idealmente rígidas → shear building puro (DIAPHRAGM RIGID en e2k).",
    "Resultados analíticos (libro p.179): f1=1.88 Hz, f2=5.24 Hz; modos {1, 1.263} y {1, -1.629}.",
    "📈 Chart Panel: modos del libro. El pulso del time history (F0 en el piso 2) es una carga de DEMOSTRACIÓN, no está en el Ej. 7.1 (el libro solo pide modos); la respuesta a cargas del libro es el Ej. 8.1.",
    "📤 Toggle 'Exportar a .e2k' → modelo ETABS canónico para validación cruzada.",
  ],
  params: {
    // ─── Sistema unidades ───
    useImperial: { default: 1, boolean: true, label: "Usar unidades del libro (lb-in)", folder: "Geometría" },
    // ─── Geometría (editables, default = libro) ───
    H1_ft: { default: 15, min: 8, max: 25, step: 0.5, label: "H1 piso 1 (ft)", folder: "Geometría" },
    H2_ft: { default: 10, min: 6, max: 20, step: 0.5, label: "H2 piso 2 (ft)", folder: "Geometría" },
    bay_ft: { default: 30, min: 10, max: 60, step: 1, label: "Ancho bay (ft)", folder: "Geometría" },
    // ─── Sección ───
    I1_in4: { default: 248.6, min: 50, max: 600, step: 0.1, label: "I1 col piso 1 (in⁴)", folder: "Sección" },
    I2_in4: { default: 106.3, min: 50, max: 600, step: 0.1, label: "I2 col piso 2 (in⁴)", folder: "Sección" },
    // ─── Pesos ───
    W1_lb: { default: 52500, min: 10000, max: 150000, step: 500, label: "W1 piso 1 (lb)", folder: "Cargas" },
    W2_lb: { default: 25500, min: 5000,  max: 100000, step: 500, label: "W2 piso 2 (lb)", folder: "Cargas" },
    // ─── Material ───
    E_psi: { default: 30e6, min: 25e6, max: 35e6, step: 0.5e6, label: "E acero (psi)", folder: "Material" },
    // ─── Time history ───
    F0_lb: { default: 5000, min: 0, max: 20000, step: 100, label: "Pulso F0 piso 2 (lb) — demostración, no del libro", folder: "Time History" },
    pulseDur_s: { default: 0.1, min: 0.01, max: 1, step: 0.01, label: "Duración pulso (s)", folder: "Time History" },
    tEnd_s: { default: 2.0, min: 0.5, max: 10, step: 0.1, label: "t fin análisis (s)", folder: "Time History" },
    dt_s: { default: 0.005, min: 0.0005, max: 0.05, step: 0.0005, label: "Δt Newmark (s)", folder: "Time History" },
    xi: { default: 0.05, min: 0, max: 0.20, step: 0.005, label: "Damping ξ (Rayleigh)", folder: "Time History" },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 0, label: "Tipo gráfica",
      options: { "u(t) — desplaz.": 0, "v(t) — vel.": 1, "a(t) — acel.": 2, "F(t) — carga": 3, "Modos": 4 },
      folder: "Time History",
    },
    // ─── Export ───
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },

  hasModal: true,

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const sb = paramsToShearBuilding(params);
      const { filename, content } = generateShearBuildingE2k(sb, "Paz_7_1");
      downloadTextFile(filename, content);
      console.log(`[Paz 7.1] e2k exportado: ${filename} (${content.length} bytes)`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) {
      getSharedChartPanel().hide();
    }
  },

  computedLabels(p) {
    // Calcular k1, k2 desde sección actual (escalado vs libro)
    const E_psi = p.E_psi;
    const I1 = p.I1_in4, I2 = p.I2_in4;
    const H1_in = p.H1_ft * 12, H2_in = p.H2_ft * 12;
    const k1 = (12 * E_psi * I1 * 2) / Math.pow(H1_in, 3);  // 2 cols
    const k2 = (12 * E_psi * I2 * 2) / Math.pow(H2_in, 3);
    const m1 = p.W1_lb / 386.088;
    const m2 = p.W2_lb / 386.088;

    // Solver matricial directo (Newmark module)
    const { K, M } = shearBuildingKM([m1, m2], [k1, k2]);
    let f1 = NaN, f2 = NaN;
    try {
      const eig = solveEigenGeneralized(K, M);
      f1 = eig.freqs[0];
      f2 = eig.freqs[1];
    } catch {}

    return {
      "k1 (lb/in)": k1.toFixed(0),
      "k2 (lb/in)": k2.toFixed(0),
      "m1 (lb·s²/in)": m1.toFixed(2),
      "m2 (lb·s²/in)": m2.toFixed(2),
      "f1 calculado": `${f1.toFixed(3)} Hz  (libro 1.880 Hz)`,
      "f2 calculado": `${f2.toFixed(3)} Hz  (libro 5.240 Hz)`,
      "T1 calculado": `${(1 / f1).toFixed(3)} s  (libro 0.532 s)`,
      "T2 calculado": `${(1 / f2).toFixed(3)} s  (libro 0.191 s)`,
    };
  },

  build(p, states) {
    const sb = paramsToShearBuilding(p);
    buildShearBuildingModel(sb, states);

    // Matrices reducidas para validación analítica + Newmark
    const E_psi = p.E_psi;
    const I1 = p.I1_in4, I2 = p.I2_in4;
    const H1_in = p.H1_ft * 12, H2_in = p.H2_ft * 12;
    const k1 = (12 * E_psi * I1 * 2) / Math.pow(H1_in, 3);
    const k2 = (12 * E_psi * I2 * 2) / Math.pow(H2_in, 3);
    const m1 = p.W1_lb / 386.088;
    const m2 = p.W2_lb / 386.088;
    const { K, M } = shearBuildingKM([m1, m2], [k1, k2]);

    let report = `[Paz 7.1] 2-story shear building\n`;
    try {
      const eig = solveEigenGeneralized(K, M);
      const f1 = eig.freqs[0], f2 = eig.freqs[1];
      const df1 = (f1 - PAZ_REF.f1_Hz) / PAZ_REF.f1_Hz * 100;
      const df2 = (f2 - PAZ_REF.f2_Hz) / PAZ_REF.f2_Hz * 100;
      report += `  Solver matricial directo:\n`;
      report += `    f1 = ${f1.toFixed(4)} Hz  (libro ${PAZ_REF.f1_Hz}, Δ ${df1.toFixed(3)}%)\n`;
      report += `    f2 = ${f2.toFixed(4)} Hz  (libro ${PAZ_REF.f2_Hz}, Δ ${df2.toFixed(3)}%)\n`;

      // Normalizar mode 1 a φ[0]=1
      const m1_norm = eig.modes.map((row) => row[0] / eig.modes[0][0]);
      const m2_norm = eig.modes.map((row) => row[1] / eig.modes[0][1]);
      report += `    Mode 1: {${m1_norm.map((v) => v.toFixed(3)).join(", ")}}  (libro {1.000, 1.263})\n`;
      report += `    Mode 2: {${m2_norm.map((v) => v.toFixed(3)).join(", ")}}  (libro {1.000, -1.629})\n`;

      // ─── Time history Newmark ───
      const omega1 = Math.sqrt(eig.omega2[0]);
      const omega2 = Math.sqrt(eig.omega2[1]);
      const C = rayleighDamping(M, K, omega1, omega2, p.xi);
      const F = pointAtDof(rectPulse(p.F0_lb, 0, p.pulseDur_s), 1, 2);  // pulso en piso 2
      const nSteps = Math.floor(p.tEnd_s / p.dt_s);
      const res = newmarkBeta({
        M, K, C,
        loadFunc: F,
        u0: [0, 0], v0: [0, 0],
        dt: p.dt_s, nSteps,
        gamma: 0.5, beta: 0.25,
      });
      (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs (lo que se grafica)
      const u_max1 = Math.max(...res.u.map((u) => Math.abs(u[0])));
      const u_max2 = Math.max(...res.u.map((u) => Math.abs(u[1])));
      report += `  Newmark-β TH (pulso F0=${p.F0_lb} lb, td=${p.pulseDur_s}s, ξ=${p.xi}):\n`;
      report += `    u1_max = ${u_max1.toExponential(4)} in,  u2_max = ${u_max2.toExponential(4)} in\n`;

      // ─── Plotear en chart panel ───
      if (p.showTH > 0.5) {
        const panel = getSharedChartPanel();
        const ptype = Math.round(p.plotType ?? 0);
        if (ptype === 0) {
          panel.setTitle("Paz 7.1 — Time History u(t)");
          panel.setSeries([
            { label: "u₁(t) piso 1", data: res.t.map((t, i) => [t, res.u[i][0]] as [number, number]), color: "#1a4d8c" },
            { label: "u₂(t) piso 2", data: res.t.map((t, i) => [t, res.u[i][1]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
        } else if (ptype === 1) {
          panel.setTitle("Paz 7.1 — Velocidad v(t)");
          panel.setSeries([
            { label: "v₁(t)", data: res.t.map((t, i) => [t, res.v[i][0]] as [number, number]), color: "#1a4d8c" },
            { label: "v₂(t)", data: res.t.map((t, i) => [t, res.v[i][1]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "v (in/s)", grid: true });
        } else if (ptype === 2) {
          panel.setTitle("Paz 7.1 — Aceleración a(t)");
          panel.setSeries([
            { label: "a₁(t)", data: res.t.map((t, i) => [t, res.a[i][0]] as [number, number]), color: "#1a4d8c" },
            { label: "a₂(t)", data: res.t.map((t, i) => [t, res.a[i][1]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "a (in/s²)", grid: true });
        } else if (ptype === 3) {
          panel.setTitle("Paz 7.1 — Carga F(t) en piso 2");
          const Fseries = res.t.map((t) => [t, rectPulse(p.F0_lb, 0, p.pulseDur_s)(t)] as [number, number]);
          panel.setSeries([
            { label: "F₂(t) piso 2", data: Fseries, color: "#7d3c98" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "F (lb)", grid: true });
        } else if (ptype === 4) {
          panel.setTitle("Paz 7.1 — Modos {φ}");
          const m1_data: [number, number][] = [[0, 0], [m1_norm[0], 1], [m1_norm[1], 2]];
          const m2_data: [number, number][] = [[0, 0], [m2_norm[0], 1], [m2_norm[1], 2]];
          panel.setSeries([
            { label: `Modo 1 (f=${f1.toFixed(2)} Hz)`, data: m1_data, color: "#1a4d8c", width: 3 },
            { label: `Modo 2 (f=${f2.toFixed(2)} Hz)`, data: m2_data, color: "#c0392b", width: 3 },
          ]);
          panel.setAxes({ xLabel: "φ", yLabel: "piso (0=base)", grid: true });
        }
        panel.show();
      }
    } catch (e: any) {
      report += `  ⚠️ Error en cálculo: ${e.message}\n`;
    }
    console.log(report);
  },

  runModal(p, states, modalPanel) {
    if (!states.nodes.val.length) return;
    try {
      const out = modalAnalysis(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, 4,
      );
      console.log(`[Paz 7.1 — Modal Hekatan FEM 3D] frecuencias:\n` +
        out.frequencies.slice(0, 4).map((f, i) =>
          `  Modo ${i + 1}: f = ${f.toFixed(3)} Hz   T = ${(1 / f).toFixed(4)} s`
        ).join("\n"));
      if (modalPanel?.render) {
        modalPanel.render(out, {
          title: `Paz 7.1 — 2-story shear building`,
          properties: [
            `Libro: f₁=${PAZ_REF.f1_Hz} Hz, f₂=${PAZ_REF.f2_Hz} Hz`,
            `H1=${p.H1_ft}ft  H2=${p.H2_ft}ft  bay=${p.bay_ft}ft`,
          ],
        });
      }
    } catch (e: any) {
      console.error("[Paz 7.1 Modal FEM] error:", e.message);
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// Adaptador: params del Tweakpane → ShearBuildingParams (SI metric)
// ════════════════════════════════════════════════════════════════════
function paramsToShearBuilding(p: Record<string, number>) {
  // Convertir lb-in → kN-m
  const E_kNm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi);
  const H1_m = PAZ_UTILS.in_to_m(p.H1_ft * 12);
  const H2_m = PAZ_UTILS.in_to_m(p.H2_ft * 12);
  const bay_m = PAZ_UTILS.in_to_m(p.bay_ft * 12);
  const I1_m4 = PAZ_UTILS.in4_to_m4(p.I1_in4);
  const I2_m4 = PAZ_UTILS.in4_to_m4(p.I2_in4);
  const W1_kN = PAZ_UTILS.lb_to_kN(p.W1_lb);
  const W2_kN = PAZ_UTILS.lb_to_kN(p.W2_lb);

  return {
    nStories: 2,
    storyHeights: [H1_m, H2_m],
    bayWidth: bay_m,
    storyWeights: [W1_kN, W2_kN],
    I_per_column: [I1_m4, I2_m4],
    nCols: 2,
    E: E_kNm2,
    gamma: 76.97,  // acero kN/m³ (Paz no lo necesita explícito, masa va en piso)
    colSection: { D: 0.30, B: 0.30 },  // visualización
    materialType: "Steel" as const,
  };
}
