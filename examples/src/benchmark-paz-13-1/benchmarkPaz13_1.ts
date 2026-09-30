/**
 * 🏁 Benchmark FRAME — Paz Ej. 13.1 (Space Frame 3D — 5 nodos, 4 vigas radiando)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 13.7, Illustrative Example 13.1, p.342
 *
 *  Modelo (ver Tabla 13.1):
 *    Nodos (in):
 *      1: (0,    0, 0)        ← LIBRE (6 DOF)
 *      2: (0,    0, -200)     ← empotrado (vertical hacia abajo)
 *      3: (0,  200, 0)        ← empotrado (Y+)
 *      4: (-200, 0, 0)        ← empotrado (X-)
 *      5: (0, -200, 0)        ← empotrado (Y-)
 *
 *    Elementos (4 vigas, todas conectan al nodo 1):
 *      Member 1 (1-2): A=50, Iy=Iz=200, J=40, m_bar=0.2
 *      Member 2 (1-3): A=28, Iy=Iz=64,  J=12.8, m_bar=0.1
 *      Member 3 (1-4): A=50, Iy=Iz=200, J=40,   m_bar=0.2
 *      Member 4 (1-5): A=28, Iy=Iz=64,  J=12.8, m_bar=0.1
 *
 *    Material:
 *      E = 30 × 10⁶ psi (steel)
 *      G = 12 × 10⁶ psi
 *
 *  Carga: F = 5000 lb step en dirección Z aplicada por 0.1 s en nodo 1
 *
 *  Resultados esperados (libro p.342, parte b):
 *    El libro reporta frecuencias modales y respuesta time-history mediante
 *    integración numérica MATLAB. Validamos:
 *      - Frecuencias modales (eigenproblem K·φ = ω²·M·φ)
 *      - Time history en u_z(t) del nodo 1 con Newmark-β
 */
import { modalAnalysisPaz } from "hekatan-fem";
import type { Element, Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import {
  buildSpaceFrameModel,
  generateSpaceFrameE2k,
  downloadTextFile,
  PAZ_UTILS,
} from "../shared/pazFrameE2k";
import { getSharedChartPanel } from "../shared/chartPanel";
import {
  newmarkBeta, rectPulse, pointAtDof, solveEigenGeneralized,
  zeros, type Matrix,
} from "../shared/newmarkBeta";

export const benchmarkPaz13_1: ExampleDef = {
  id: "benchmark-paz-13-1",
  name: "🏁 Frame · Paz 13.1 (Space Frame 3D — 4 vigas radiando)",
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 13.1 — Space frame 3D, 5 nodos (1 libre + 4 empotrados radiando).",
    "Members 1,3 (verticales/X): A=50 in², Iy=Iz=200 in⁴, J=40, m=0.2 lb·s²/in².",
    "Members 2,4 (Y±): A=28, Iy=Iz=64, J=12.8, m=0.1.",
    "Material: E=30e6 psi, G=12e6 psi (acero).",
    "Carga: F=5000 lb step en Z por 0.1s aplicada en nodo 1.",
    "📈 Chart Panel: time history u_z(t), v_z(t), a_z(t) del nodo 1.",
    "📤 Toggle 'Exportar a .e2k' → modelo ETABS multi-story para validación.",
  ],
  params: {
    L_in: { default: 200, min: 50, max: 500, step: 10, label: "Longitud miembro (in)", folder: "Geometría" },
    A1_in2: { default: 50, min: 10, max: 200, step: 1, label: "A miembros 1,3 (in²)", folder: "Sección" },
    I1_in4: { default: 200, min: 50, max: 1000, step: 5, label: "Iy=Iz miembros 1,3 (in⁴)", folder: "Sección" },
    J1_in4: { default: 40, min: 10, max: 200, step: 1, label: "J miembros 1,3 (in⁴)", folder: "Sección" },
    A2_in2: { default: 28, min: 10, max: 200, step: 1, label: "A miembros 2,4 (in²)", folder: "Sección" },
    I2_in4: { default: 64, min: 20, max: 500, step: 1, label: "Iy=Iz miembros 2,4 (in⁴)", folder: "Sección" },
    J2_in4: { default: 12.8, min: 5, max: 100, step: 0.5, label: "J miembros 2,4 (in⁴)", folder: "Sección" },
    E_psi: { default: 30e6, min: 25e6, max: 35e6, step: 0.5e6, label: "E acero (psi)", folder: "Material" },
    G_psi: { default: 12e6, min: 10e6, max: 14e6, step: 0.5e6, label: "G acero (psi)", folder: "Material" },
    mbar1: { default: 0.2, min: 0.05, max: 1, step: 0.05, label: "m̄ miembros 1,3 (lb·s²/in²)", folder: "Masa" },
    mbar2: { default: 0.1, min: 0.05, max: 1, step: 0.05, label: "m̄ miembros 2,4 (lb·s²/in²)", folder: "Masa" },
    F0_lb: { default: 5000, min: 0, max: 20000, step: 100, label: "Step F0 nodo 1 Z (lb)", folder: "Time History" },
    pulseDur_s: { default: 0.1, min: 0.01, max: 1, step: 0.01, label: "Duración step (s)", folder: "Time History" },
    tEnd_s: { default: 0.5, min: 0.1, max: 5, step: 0.1, label: "t fin análisis (s)", folder: "Time History" },
    dt_s: { default: 0.0001, min: 0.00005, max: 0.01, step: 0.00005, label: "Δt Newmark (s) — con 0.001 el pico de uz sale −0.86 %", folder: "Time History" },
    xi: { default: 0, min: 0, max: 0.20, step: 0.005, label: "Damping ξ (libro = 0)", folder: "Time History" },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 0,
      label: "Tipo gráfica",
      options: { "u_z(t)": 0, "v_z(t)": 1, "a_z(t)": 2, "F(t)": 3, "u_x,y,z(t)": 4 },
      folder: "Time History",
    },
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },
  hasModal: true,

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const sf = paramsToSpaceFrame(params);
      const { filename, content } = generateSpaceFrameE2k(sf, "Paz_13_1");
      downloadTextFile(filename, content);
      console.log(`[Paz 13.1] e2k exportado: ${filename} (${content.length} bytes)`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) {
      getSharedChartPanel().hide();
    }
  },

  build(p, states) {
    const sf = paramsToSpaceFrame(p);
    buildSpaceFrameModel(sf, states);

    // ── Construir K, M reducidas para los 6 DOFs del nodo 1 (resto fijo) ──
    // Para validación analítica + Newmark TH, usamos directamente
    // las matrices ensambladas de Paz (frame element 12-DOF).
    // Aquí simplificamos: usamos modal del solver Hekatan FEM 3D.
    let report = `[Paz 13.1] Space Frame 3D — 5 nodos\n`;

    if (p.showTH > 0.5) {
      // Build manual de K_red 6×6 + M_red 6×6 a partir de elementos prismáticos
      // Notación: DOF nodo 1 = [Ux, Uy, Uz, Rx, Ry, Rz]
      // Cada elemento aporta su matriz local rotada al sistema global,
      // y luego sumamos los 6×6 del nodo 1 (los otros 24 están fijos).
      const { K6, M6 } = buildLocalKM_Paz13_1(p);
      try {
        const eig = solveEigenGeneralized(K6, M6);
        report += `  Modal (solver matricial directo, 6 DOF nodo 1):\n`;
        eig.freqs.forEach((f, i) => {
          report += `    Modo ${i + 1}: f = ${f.toFixed(3)} Hz, ω² = ${eig.omega2[i].toFixed(2)}\n`;
        });
        // ── Newmark-β TH ───
        const omega1 = Math.sqrt(eig.omega2[0]);
        const omegaN = Math.sqrt(eig.omega2[Math.min(5, eig.omega2.length - 1)]);
        // Rayleigh damping
        const C: Matrix = zeros(6);
        const a0 = 2 * p.xi * omega1 * omegaN / (omega1 + omegaN);
        const a1 = 2 * p.xi / (omega1 + omegaN);
        for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
          C[i][j] = a0 * M6[i][j] + a1 * K6[i][j];
        }
        // Carga: F = F0 lb en z (DOF 2 = Uz del nodo 1)
        const F = pointAtDof(rectPulse(p.F0_lb, 0, p.pulseDur_s), 2, 6);
        const nSteps = Math.floor(p.tEnd_s / p.dt_s);
        const u0 = [0, 0, 0, 0, 0, 0], v0 = [0, 0, 0, 0, 0, 0];
        const res = newmarkBeta({
          M: M6, K: K6, C,
          loadFunc: F,
          u0, v0,
          dt: p.dt_s, nSteps,
        });
        (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs (lo que se grafica)
        const uz_max = Math.max(...res.u.map((u) => Math.abs(u[2])));
        report += `  Newmark-β TH (F=${p.F0_lb} lb step ${p.pulseDur_s}s, ξ=${p.xi}):\n`;
        report += `    u_z_max nodo 1 = ${uz_max.toExponential(4)} in\n`;

        const panel = getSharedChartPanel();
        const ptype = Math.round(p.plotType ?? 0);
        if (ptype === 0) {
          panel.setTitle("Paz 13.1 — u_z(t) nodo 1");
          panel.setSeries([{
            label: "u_z(t)",
            data: res.t.map((t, i) => [t, res.u[i][2]] as [number, number]),
            color: "#1a4d8c", width: 2,
          }]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "u_z (in)", grid: true });
        } else if (ptype === 1) {
          panel.setTitle("Paz 13.1 — v_z(t) nodo 1");
          panel.setSeries([{
            label: "v_z(t)",
            data: res.t.map((t, i) => [t, res.v[i][2]] as [number, number]),
            color: "#1a4d8c", width: 2,
          }]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "v_z (in/s)", grid: true });
        } else if (ptype === 2) {
          panel.setTitle("Paz 13.1 — a_z(t) nodo 1");
          panel.setSeries([{
            label: "a_z(t)",
            data: res.t.map((t, i) => [t, res.a[i][2]] as [number, number]),
            color: "#1a4d8c", width: 2,
          }]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "a_z (in/s²)", grid: true });
        } else if (ptype === 3) {
          panel.setTitle("Paz 13.1 — Carga F(t) nodo 1");
          panel.setSeries([{
            label: "F_z(t)",
            data: res.t.map((t) => [t, rectPulse(p.F0_lb, 0, p.pulseDur_s)(t)] as [number, number]),
            color: "#7d3c98",
          }]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "F (lb)", grid: true });
        } else if (ptype === 4) {
          panel.setTitle("Paz 13.1 — Translaciones nodo 1");
          panel.setSeries([
            { label: "u_x(t)", data: res.t.map((t, i) => [t, res.u[i][0]] as [number, number]), color: "#1a4d8c" },
            { label: "u_y(t)", data: res.t.map((t, i) => [t, res.u[i][1]] as [number, number]), color: "#2d8659" },
            { label: "u_z(t)", data: res.t.map((t, i) => [t, res.u[i][2]] as [number, number]), color: "#c0392b" },
          ]);
          panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
        }
        panel.show();
      } catch (e: any) {
        report += `  ⚠️ Error TH: ${e.message}\n`;
      }
    }
    console.log(report);
  },

  runModal(p, states, modalPanel) {
    if (!states.nodes.val.length) return;
    try {
      // Masa CONSISTENTE como el libro (SpaceFrameConsMass, p.346), igual que el 10.7.
      const out = modalAnalysisPaz(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, 6,
      );
      console.log(`[Paz 13.1 — Modal Hekatan FEM 3D] frecuencias:\n` +
        out.frequencies.slice(0, 6).map((f, i) =>
          `  Modo ${i + 1}: f = ${f.toFixed(3)} Hz   T = ${(1 / f).toFixed(4)} s`
        ).join("\n"));
      if (modalPanel?.render) {
        modalPanel.render(out, {
          title: "Paz 13.1 — Space frame 3D",
          properties: [
            `5 nodos: 1 libre + 4 empotrados radiando, L=${p.L_in}in`,
            `M1,3: A=${p.A1_in2} I=${p.I1_in4}; M2,4: A=${p.A2_in2} I=${p.I2_in4}`,
          ],
        });
      }
    } catch (e: any) {
      console.error("[Paz 13.1 Modal FEM] error:", e.message);
    }
  },
};

// ════════════════════════════════════════════════════════════════════
// Build SpaceFrameParams desde params del Tweakpane (in → m)
// ════════════════════════════════════════════════════════════════════
function paramsToSpaceFrame(p: Record<string, number>) {
  const L_m = PAZ_UTILS.in_to_m(p.L_in);
  const E_kNm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi);
  const G_kNm2 = PAZ_UTILS.psi_to_kNm2(p.G_psi);
  const A1_m2 = PAZ_UTILS.in2_to_m2(p.A1_in2);
  const A2_m2 = PAZ_UTILS.in2_to_m2(p.A2_in2);
  const I1_m4 = PAZ_UTILS.in4_to_m4(p.I1_in4);
  const I2_m4 = PAZ_UTILS.in4_to_m4(p.I2_in4);
  const J1_m4 = PAZ_UTILS.in4_to_m4(p.J1_in4);
  const J2_m4 = PAZ_UTILS.in4_to_m4(p.J2_in4);
  // ρ desde m̄ (lb·s²/in²) → kg/m³ via /A
  // m̄ [lb·s²/in²] = mass per length per area? Paz lo usa como masa
  // distribuida por unidad de longitud / área. Simplemente: ρ = m̄/A ya da
  // densidad lineal, pero queremos densidad volumétrica → ρ = m̄·g_inps2/A
  const g_inps2 = 386.088;
  void g_inps2;
  // m̄ es masa por LONGITUD (lb·s²/in por in): 1 lb·s²/in = 175.127 kg → kg/m = m̄·175.127/0.0254.
  // ρ en t/m³ (E en kN/m²) = (kg/m)/A/1000. Antes (m̄·g/A_in²)·175.13/0.0254 «approx»: el modal 3D daba 3.57 Hz.
  const rho1_kgm3 = p.mbar1 * 175.127 / 0.0254 / A1_m2 / 1000;   // (t/m³, se deja el nombre)
  const rho2_kgm3 = p.mbar2 * 175.127 / 0.0254 / A2_m2 / 1000;

  // Nodos en metros
  const nodes: Node[] = [
    [0, 0, 0],          // 1 libre
    [0, 0, -L_m],       // 2 abajo
    [0, L_m, 0],        // 3 Y+
    [-L_m, 0, 0],       // 4 X-
    [0, -L_m, 0],       // 5 Y-
  ];
  const elements: Element[] = [
    [0, 1],  // 1-2 Member 1
    [0, 2],  // 1-3 Member 2
    [0, 3],  // 1-4 Member 3
    [0, 4],  // 1-5 Member 4
  ];
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 1; i <= 4; i++) supports.set(i, [true, true, true, true, true, true]);

  // Carga visual: F = F0 lb (default 5000) en Z aplicada al nodo 1.
  // Conversión lb -> kN para el viewer (1 lb = 0.00444822 kN).
  const F0_lb = p.F0_lb ?? 5000;
  const F0_kN = F0_lb * 0.00444822;
  const loads = new Map<number, [number, number, number, number, number, number]>();
  loads.set(0, [0, 0, F0_kN, 0, 0, 0]);  // [Fx, Fy, Fz, Mx, My, Mz]

  const sectionByElement = [0, 1, 2, 3].map((eIdx) => {
    const isType1 = eIdx === 0 || eIdx === 2;  // Members 1, 3
    return {
      A: isType1 ? A1_m2 : A2_m2,
      Iy: isType1 ? I1_m4 : I2_m4,
      Iz: isType1 ? I1_m4 : I2_m4,
      J: isType1 ? J1_m4 : J2_m4,
      E: E_kNm2, G: G_kNm2,
      rho: isType1 ? rho1_kgm3 : rho2_kgm3,
      I0: PAZ_UTILS.in4_to_m4(isType1 ? 205 : 68),   // Tabla 13.1 (p.343)
      label: isType1 ? `Member ${eIdx + 1} (type 1)` : `Member ${eIdx + 1} (type 2)`,
      e2kName: isType1 ? "MEM_TYPE1" : "MEM_TYPE2",
      e2kShape: "Steel I/Wide Flange",
      e2kD: isType1 ? 0.30 : 0.20,
      e2kB: isType1 ? 0.20 : 0.15,
      e2kTF: 0.018, e2kTW: 0.011,
    };
  });

  return {
    nodes, elements, supports, loads,
    sectionByElement,
    materialName: "A992Fy50",
    materialType: "Steel" as const,
    euler: true,
  };
}

// ════════════════════════════════════════════════════════════════════
// K y M 6×6 del nudo 1 con los elementos del LIBRO (30-sep-2026): SpaceFrameElement (p.345) y
// SpaceFrameConsMass (p.346), masa CONSISTENTE, orientación por el tercer nudo de `conn` (p.344).
// Antes: rigideces sueltas sin el acoplamiento 6EI/L² desplazamiento-giro y masa lumped con una inercia
// rotacional inventada (×1e-3). Nota: en SpaceFrameConsMass del libro T no rellena el bloque de las
// traslaciones del nudo i y el nudo 1 se queda sin masa traslacional; aquí T va completa (validation/paz-newmark).
// ════════════════════════════════════════════════════════════════════
function buildLocalKM_Paz13_1(p: Record<string, number>): { K6: Matrix; M6: Matrix } {
  const E = p.E_psi, G = p.G_psi, L0 = p.L_in;
  const nd: number[][] = [[0, 0, 0], [0, 0, -L0], [0, L0, 0], [-L0, 0, 0], [0, -L0, 0]];
  const P1 = { A: p.A1_in2, I: p.I1_in4, J: p.J1_in4, m: p.mbar1, I0: 205 };   // I0 polar (Tabla 13.1, p.343)
  const P2 = { A: p.A2_in2, I: p.I2_in4, J: p.J2_in4, m: p.mbar2, I0: 68 };
  const conn: [number, number, number, typeof P1][] = [[0, 1, 2, P1], [0, 2, 1, P2], [0, 3, 1, P1], [0, 4, 1, P2]];
  const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a: number[]) => Math.hypot(a[0], a[1], a[2]);
  const K6: Matrix = zeros(6), M6: Matrix = zeros(6);
  for (const [a, b, c, q] of conn) {
    const d = sub(nd[b], nd[a]), L = norm(d), ex = d.map((x) => x / L);
    let ey = cross(sub(nd[c], nd[a]), d); const ny = norm(ey); ey = ey.map((x) => x / ny);
    const H = [ex, ey, cross(ex, ey)];
    const k: Matrix = zeros(12), m: Matrix = zeros(12);
    const EA = E * q.A, EI = E * q.I, GJ = G * q.J, r = q.I0 / q.A, cm = q.m * L / 420;
    k[0][0] = k[6][6] = EA / L; k[0][6] = k[6][0] = -EA / L; k[3][3] = k[9][9] = GJ / L; k[3][9] = k[9][3] = -GJ / L;
    m[0][0] = m[6][6] = 140 * cm; m[0][6] = m[6][0] = 70 * cm; m[3][3] = m[9][9] = 140 * r * cm; m[3][9] = m[9][3] = 70 * r * cm;
    for (const [idx, s] of [[[1, 5, 7, 11], 1], [[2, 4, 8, 10], -1]] as [number[], number][]) {
      const kk = [[12, 6 * L * s, -12, 6 * L * s], [6 * L * s, 4 * L * L, -6 * L * s, 2 * L * L],
                  [-12, -6 * L * s, 12, -6 * L * s], [6 * L * s, 2 * L * L, -6 * L * s, 4 * L * L]];
      const mm = [[156, 22 * L * s, 54, -13 * L * s], [22 * L * s, 4 * L * L, 13 * L * s, -3 * L * L],
                  [54, 13 * L * s, 156, -22 * L * s], [-13 * L * s, -3 * L * L, -22 * L * s, 4 * L * L]];
      for (let u = 0; u < 4; u++) for (let v = 0; v < 4; v++) {
        k[idx[u]][idx[v]] += EI / L ** 3 * kk[u][v]; m[idx[u]][idx[v]] += cm * mm[u][v];
      }
    }
    // global = Tᵀ·local·T; solo interesa el bloque 6×6 del nudo i (el nudo 1, los demás empotrados)
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
      let sk = 0, sm = 0;
      const bi = i < 3 ? 0 : 3, bj = j < 3 ? 0 : 3;
      for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
        const t = H[x][i - bi] * H[y][j - bj];
        sk += t * k[bi + x][bj + y]; sm += t * m[bi + x][bj + y];
      }
      K6[i][j] += sk; M6[i][j] += sm;
    }
  }
  return { K6, M6 };
}
