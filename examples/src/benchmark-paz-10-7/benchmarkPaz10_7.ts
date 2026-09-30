/**
 * 🏁 Benchmark FRAME — Paz Ej. 10.7 (Fixed-Fixed Beam, modal + TH)
 *
 *  Mario Paz & Young Hoon — "Structural Dynamics: Theory & Computation" 6ª ed.
 *  Cap. 10.10, Illustrative Example 10.7, p.279
 *
 *  Modelo: viga doblemente empotrada modelada con 4 elementos beam (5 nodos).
 *
 *  Datos del libro:
 *    L = 200 in (4 elementos de 50 in)
 *    I = 100 in⁴
 *    E = 6.58 × 10⁶ psi
 *    m̄ = 0.10 lb·s²/in/in
 *
 *  Carga (Paz 10.8 sigue al 10.7):
 *    F = 10,000 lb concentrada en el centro (nodo 3, DOF 5)
 *    Aplicada por 0.1 s, luego decae linealmente a 0 entre 0.1 y 0.2 s
 *    Δt = 0.01 s
 *
 *  Validación: modal + Newmark-β contra resultados del libro (Programa 13).
 */
import { modalAnalysisPaz, deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { downloadTextFile, PAZ_UTILS, emitE2kHeader, emitE2kFooter, emitSteelMaterial, emitFrameSection, fmtNum } from "../shared/pazFrameE2k";
import { getSharedChartPanel } from "../shared/chartPanel";
import { newmarkBeta, solveEigenGeneralized, rayleighDamping, type Matrix } from "../shared/newmarkBeta";

export const benchmarkPaz10_7: ExampleDef = {
  id: "benchmark-paz-10-7",
  name: "🏁 Frame · Paz 10.7 (fixed-fixed beam — 4 elementos)",
  category: "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
  benchmark: true,
  defaultShellResult: "none",
  guide: [
    "Paz Ej. 10.7-10.8 — Viga doblemente empotrada con 4 elementos (5 nodos).",
    "L=200 in (4×50), I=100 in⁴, E=6.58e6 psi, m̄=0.10 lb·s²/in/in.",
    "Carga: 10,000 lb en el centro (nodo 3), aplicada por 0.1s y bajando linealmente 0.1-0.2s.",
    "Validación contra Programa 13 del libro (MATLAB BeamElement + BeamConsMass).",
    "📈 Chart Panel: u_centro(t), F(t), modos.",
    "📤 Toggle 'Exportar a .e2k' → modelo ETABS Steel I/Wide Flange.",
  ],
  params: {
    L_in: { default: 200, min: 100, max: 500, step: 10, label: "L total viga (in)", folder: "Geometría" },
    nElem: { default: 4, min: 2, max: 20, step: 1, label: "# elementos", folder: "Mesh" },
    I_in4: { default: 100, min: 20, max: 500, step: 5, label: "I (in⁴)", folder: "Sección" },
    E_psi: { default: 6.58e6, min: 1e6, max: 35e6, step: 0.1e6, label: "E (psi)", folder: "Material" },
    mbar: { default: 0.10, min: 0.01, max: 1.0, step: 0.01, label: "m̄ (lb·s²/in/in)", folder: "Masa" },
    F_lb: { default: 10000, min: 0, max: 50000, step: 100, label: "F centro (lb)", folder: "Time History" },
    t1_s: { default: 0.1, min: 0.01, max: 1, step: 0.01, label: "t₁ fin plateau (s)", folder: "Time History" },
    t2_s: { default: 0.2, min: 0.01, max: 1, step: 0.01, label: "t₂ fin bajada (s)", folder: "Time History" },
    tEnd_s: { default: 0.5, min: 0.1, max: 5, step: 0.1, label: "t fin (s)", folder: "Time History" },
    dt_s: { default: 0.001, min: 0.0001, max: 0.05, step: 0.001, label: "Δt Newmark (s)", folder: "Time History" },
    xi: { default: 0.0, min: 0, max: 0.20, step: 0.005, label: "Damping ξ (libro=0)", folder: "Time History" },
    showTH: { default: 1, boolean: true, label: "📈 Mostrar Chart Panel", folder: "Time History" },
    plotType: {
      default: 0, label: "Tipo gráfica",
      options: { "u_centro(t)": 0, "F(t)": 1, "Modos": 2, "v_centro(t)": 3, "a_centro(t)": 4 },
      folder: "Time History",
    },
    exportE2k: { default: 0, boolean: true, label: "📤 Exportar a ETABS .e2k", folder: "Exportar" },
  },
  hasModal: true,

  onParamChange(changedKey, params) {
    if (changedKey === "exportE2k" && params.exportE2k > 0.5) {
      const { filename, content } = generatePaz10_7E2k(params);
      downloadTextFile(filename, content);
      console.log(`[Paz 10.7] e2k exportado: ${filename}`);
      params.exportE2k = 0;
    }
    if (changedKey === "showTH" && params.showTH < 0.5) getSharedChartPanel().hide();
  },

  build(p, states) {
    const nElem = Math.max(2, Math.round(p.nElem));
    if (nElem % 2 !== 0) {
      // Forzar par para que haya nodo central
      // (no muta param porque eso re-renderiza)
    }
    const L_in = p.L_in;
    const dx_in = L_in / nElem;
    const dx_m = PAZ_UTILS.in_to_m(dx_in);
    const E_kNm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi);
    const I_m4 = PAZ_UTILS.in4_to_m4(p.I_in4);
    // Sección equivalente con I correcto (rect b·h³/12 = I → fijamos b=h=√(12·I)^(1/2)? mejor h⁴/12=I → h=(12·I)^¼)
    const h_m = Math.pow(12 * I_m4, 0.25);
    const A_m2 = h_m * h_m;
    // ρ = m̄·g/A → kg/m³
    // m̄ está en lb·s²/in/in. Convertimos a kg/m: m̄_si = m̄_lbs2in_in · g_inps2 · in_to_m / lb_to_N
    // Simplificación: lb·s²/in/in × 386.088 in/s² = lb/in (peso por longitud)
    // → en N/m: × 175.13 (lb/in → N/m)
    const w_per_length_lbin = p.mbar * 386.088;  // lb/in
    const w_per_length_Nm = w_per_length_lbin * 175.13;
    const mass_per_length_kgm = w_per_length_Nm / 9.80665;  // kg/m
    // E va en kN/m²: la masa va en t (kN·s²/m), ρ en t/m³ (era kg/m³ = 1000× hasta el 6-sep-2026)
    const rho_tm3 = mass_per_length_kgm / A_m2 / 1000;

    // ── Construir modelo Hekatan ──
    const nodes: Node[] = [];
    for (let i = 0; i <= nElem; i++) nodes.push([i * dx_m, 0, 0]);
    const elements: Element[] = [];
    for (let i = 0; i < nElem; i++) elements.push([i, i + 1]);

    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    supports.set(0, [true, true, true, true, true, true]);
    supports.set(nElem, [true, true, true, true, true, true]);
    // Viga PLANA del libro (2 GDL por nudo: w y θy): los nudos interiores no se mueven en x ni salen del plano XZ
    for (let i = 1; i < nElem; i++) supports.set(i, [true, true, false, true, false, true]);

    const loads = new Map<number, [number, number, number, number, number, number]>();
    // Carga estática F en el centro (para visualizar deformada)
    const midNode = Math.floor(nElem / 2);
    const F_kN = PAZ_UTILS.lb_to_kN(p.F_lb);
    loads.set(midNode, [0, 0, -F_kN, 0, 0, 0]);

    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iy = new Map<number, number>(), Iz = new Map<number, number>(), J = new Map<number, number>();
    const sAY = new Map<number, number>(), sAZ = new Map<number, number>();
    const dens = new Map<number, number>();
    const sLab = new Map<number, string>(), sInfo = new Map<number, any>();
    const matT = new Map<number, string>();
    for (let e = 0; e < elements.length; e++) {
      elasticities.set(e, E_kNm2);
      shearModuli.set(e, E_kNm2 / 2.6);
      areas.set(e, A_m2);
      Iy.set(e, I_m4);
      Iz.set(e, I_m4);
      J.set(e, I_m4 * 2);
      sAY.set(e, -1);   // Euler-Bernoulli (As = −1): BeamElement del libro, p.281
      sAZ.set(e, -1);
      dens.set(e, rho_tm3);
      sLab.set(e, `Beam Paz 10.7  I=${p.I_in4} in⁴`);
      matT.set(e, "Acero");
      sInfo.set(e, {
        name: "BEAM_PAZ10_7", shape: "Steel I/Wide Flange",
        D: h_m, B: h_m * 0.6, TF: 0.018, TW: 0.011,
        material: "A992Fy50",
      });
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      momentsOfInertiaZ: Iy, momentsOfInertiaY: Iz,
      torsionalConstants: J,
      shearAreasY: sAY, shearAreasZ: sAZ, densities: dens,
      sectionLabels: sLab, materialTypes: matT, sectionInfo: sInfo,
    } as any;
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
    } catch (e: any) {
      console.error(`[Paz 10.7]`, e.message);
    }
    states.objects3D.val = [];

    // ── Time history del LIBRO (30-sep-2026) ──────────────────────────────────────────────────────
    // Antes era un 1 GDL inventado (k = 192EI/L³, m = ½·m̄·L). Paz lo resuelve con la viga discretizada:
    // BeamElement + BeamConsMass (masa CONSISTENTE) de la p.281, se quitan los GDL de los apoyos (debc) y se
    // integra el sistema entero. GDL por nudo interior: [w, θ].
    const Le = L_in / nElem, EI = p.E_psi * p.I_in4, mb = p.mbar;
    const ke = [[12 * EI / Le ** 3, 6 * EI / Le ** 2, -12 * EI / Le ** 3, 6 * EI / Le ** 2],
                [6 * EI / Le ** 2, 4 * EI / Le, -6 * EI / Le ** 2, 2 * EI / Le],
                [-12 * EI / Le ** 3, -6 * EI / Le ** 2, 12 * EI / Le ** 3, -6 * EI / Le ** 2],
                [6 * EI / Le ** 2, 2 * EI / Le, -6 * EI / Le ** 2, 4 * EI / Le]];
    const cm = mb * Le / 420;
    const me = [[156 * cm, 22 * Le * cm, 54 * cm, -13 * Le * cm],
                [22 * Le * cm, 4 * Le * Le * cm, 13 * Le * cm, -3 * Le * Le * cm],
                [54 * cm, 13 * Le * cm, 156 * cm, -22 * Le * cm],
                [-13 * Le * cm, -3 * Le * Le * cm, -22 * Le * cm, 4 * Le * Le * cm]];
    const nd = 2 * (nElem + 1);
    const Kg: Matrix = Array.from({ length: nd }, () => new Array(nd).fill(0));
    const Mg: Matrix = Array.from({ length: nd }, () => new Array(nd).fill(0));
    for (let e = 0; e < nElem; e++)
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
        Kg[2 * e + a][2 * e + b] += ke[a][b]; Mg[2 * e + a][2 * e + b] += me[a][b];
      }
    const libres: number[] = [];
    for (let d = 2; d < nd - 2; d++) libres.push(d);          // fuera w y θ de los dos empotramientos
    const Kf = libres.map((r) => libres.map((c) => Kg[r][c]));
    const Mf = libres.map((r) => libres.map((c) => Mg[r][c]));
    const iC = libres.indexOf(2 * midNode);                    // w del nudo central
    const eigB = solveEigenGeneralized(Kf, Mf);
    const w1 = Math.sqrt(eigB.omega2[0]), w2 = Math.sqrt(eigB.omega2[1] ?? eigB.omega2[0] * 9);
    const Cf = p.xi > 0 ? rayleighDamping(Mf, Kf, w1, w2, p.xi) : undefined;
    const f_eq = w1 / (2 * Math.PI), T_eq = 1 / f_eq;
    const k_centro_lbin = 192 * p.E_psi * p.I_in4 / Math.pow(L_in, 3);   // solo para el u estático de referencia

    // Carga (MDOFP, p.282): F hasta t1, luego baja lineal hasta 0 en t2. En t = 0 ya vale F (se aplica de golpe).
    const Fload = (t: number): number[] => {
      if (t < 0) return [0];
      if (t <= p.t1_s) return [p.F_lb];
      if (t <= p.t2_s) return [p.F_lb * (p.t2_s - t) / (p.t2_s - p.t1_s)];
      return [0];
    };
    const nSteps = Math.floor(p.tEnd_s / p.dt_s);
    const resB = newmarkBeta({
      M: Mf, K: Kf, C: Cf,
      loadFunc: (t) => { const v = new Array(libres.length).fill(0); v[iC] = Fload(t)[0]; return v; },
      u0: new Array(libres.length).fill(0), v0: new Array(libres.length).fill(0),
      dt: p.dt_s, nSteps,
    });
    // La gráfica y el informe siguen con u, v, a del nudo central
    const res = { t: resB.t, u: resB.u.map((u) => [u[iC]]), v: resB.v.map((v) => [v[iC]]), a: resB.a.map((a) => [a[iC]]) };
    (states as any)._th = res;   // para tests/casos/paz_libro_dinamica.mjs
    const u_max = Math.max(...res.u.map((u) => Math.abs(u[0])));
    const u_st = p.F_lb / k_centro_lbin;

    let report = `[Paz 10.7] Fixed-fixed beam, ${nElem} elementos\n`;
    report += `  EI = ${(p.E_psi * p.I_in4).toExponential(3)} lb·in²\n`;
    report += `  k_centro (carga puntual) = ${k_centro_lbin.toFixed(1)} lb/in\n`;
    report += `  Modo 1 (masa consistente, ${libres.length} GDL): T = ${T_eq.toFixed(4)} s, f = ${f_eq.toFixed(3)} Hz (libro 7.231)\n`;
    report += `  Newmark-β u_centro_max = ${u_max.toFixed(4)} in (DLF=${(u_max / u_st).toFixed(3)})\n`;

    if (p.showTH > 0.5) {
      const panel = getSharedChartPanel();
      const ptype = Math.round(p.plotType ?? 0);
      if (ptype === 0) {
        panel.setTitle("Paz 10.7 — u_centro(t)");
        panel.setSeries([{
          label: "u_centro(t)",
          data: res.t.map((t, i) => [t, res.u[i][0]] as [number, number]),
          color: "#1a4d8c", width: 2,
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)", grid: true });
      } else if (ptype === 1) {
        panel.setTitle("Paz 10.7 — F(t)");
        panel.setSeries([{
          label: "F(t)", data: res.t.map((t) => [t, Fload(t)[0]] as [number, number]),
          color: "#7d3c98", width: 2,
        }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "F (lb)", grid: true });
      } else if (ptype === 3) {
        panel.setSeries([{ label: "v(t)", data: res.t.map((t, i) => [t, res.v[i][0]] as [number, number]), color: "#1a4d8c" }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "v (in/s)", grid: true });
        panel.setTitle("Paz 10.7 — v(t)");
      } else if (ptype === 4) {
        panel.setSeries([{ label: "a(t)", data: res.t.map((t, i) => [t, res.a[i][0]] as [number, number]), color: "#1a4d8c" }]);
        panel.setAxes({ xLabel: "t (s)", yLabel: "a (in/s²)", grid: true });
        panel.setTitle("Paz 10.7 — a(t)");
      }
      panel.show();
    }
    console.log(report);
  },

  runModal(p, states, modalPanel) {
    if (!states.nodes.val.length) return;
    try {
      // Masa CONSISTENTE (BeamConsMass del Programa 13 del libro): `modalAnalysisPaz`. Con 4 elementos el
      // libro da f = 7.231 / 20.089 / 39.856 Hz (Programa 13 rehecho en Python el 6-sep-2026); el lumped
      // del `modalAnalysis` normal da 7.208 / 19.124 / 31.437 (sin inercia rotacional).
      const out = modalAnalysisPaz(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val, 4,
      );
      console.log(`[Paz 10.7 — Modal] frecuencias:\n` +
        out.frequencies.slice(0, 4).map((f, i) =>
          `  Modo ${i + 1}: f = ${f.toFixed(3)} Hz   T = ${(1 / f).toFixed(4)} s`
        ).join("\n"));
      if (modalPanel?.render) {
        modalPanel.render(out, {
          title: "Paz 10.7 — Fixed-fixed beam",
          properties: [
            `L=${p.L_in}in, I=${p.I_in4}in⁴, E=${p.E_psi.toExponential(2)} psi`,
            `${Math.round(p.nElem)} elementos beam`,
          ],
        });
      }
    } catch (e: any) {
      console.error("[Paz 10.7 Modal]", e.message);
    }
  },
};

function generatePaz10_7E2k(p: Record<string, number>): { filename: string; content: string } {
  const L_m = PAZ_UTILS.in_to_m(p.L_in);
  const E_tonfm2 = PAZ_UTILS.psi_to_kNm2(p.E_psi) / 9.80665;
  const I_m4 = PAZ_UTILS.in4_to_m4(p.I_in4);
  const h = Math.pow(12 * I_m4, 0.25);

  const lines: string[] = [];
  lines.push(...emitE2kHeader({ units: "TONF M", title1: "Paz 10.7 Fixed-Fixed Beam", title2: "Validation" }));
  lines.push(`$ STORIES - IN SEQUENCE FROM TOP`);
  lines.push(`  STORY "Story1"  HEIGHT 0.001 MASTERSTORY "Yes"  `);
  lines.push(`  STORY "Base"  ELEV -0.001 `);
  lines.push(``);
  lines.push(`$ GRIDS`);
  lines.push(`  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 `);
  lines.push(``);
  lines.push(`$ DIAPHRAGM NAMES`);
  lines.push(`  DIAPHRAGM "D1"    TYPE RIGID`);
  lines.push(``);
  lines.push(`$ MATERIAL PROPERTIES`);
  lines.push(...emitSteelMaterial("A992Fy50", E_tonfm2, 7.849));
  lines.push(``);
  lines.push(`$ FRAME SECTIONS`);
  lines.push(...emitFrameSection({
    name: "BEAM_PAZ10_7",
    material: "A992Fy50",
    shape: "Steel I/Wide Flange",
    D: h, B: h * 0.6, TF: 0.018, TW: 0.011,
  }));
  lines.push(``);
  lines.push(`$ POINT COORDINATES`);
  lines.push(`  POINT "1"  0 0 `);
  lines.push(`  POINT "2"  ${fmtNum(L_m)} 0 `);
  lines.push(``);
  lines.push(`$ LINE CONNECTIVITIES`);
  lines.push(`  LINE  "B1"  BEAM  "1"  "2"  0`);
  lines.push(``);
  lines.push(`$ POINT ASSIGNS`);
  lines.push(`  POINTASSIGN  "1"  "Story1"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  `);
  lines.push(`  POINTASSIGN  "2"  "Story1"  RESTRAINT "UX UY UZ RX RY RZ"  DIAPH "DISCONNECTED"  `);
  lines.push(``);
  lines.push(`$ LINE ASSIGNS`);
  lines.push(`  LINEASSIGN  "B1"  "Story1"  SECTION "BEAM_PAZ10_7"  RIGIDZONE 0.5 MINNUMSTA ${Math.max(2, Math.round(p.nElem))} AUTOMESH "YES"  MESHATINTERSECTIONS "YES"  `);
  lines.push(``);
  lines.push(`$ LOAD PATTERNS`);
  lines.push(`  LOADPATTERN "DEAD"  TYPE  "Dead"  SELFWEIGHT  1`);
  lines.push(`  LOADPATTERN "PUNTUAL"  TYPE  "Other"  SELFWEIGHT  0`);
  lines.push(``);
  // En ETABS no hay LINELOAD puntual fácilmente; usaremos POINTLOAD asignado en mid-point
  // (aproximación: dividimos viga en 2 con punto medio adicional)
  lines.push(`$ FRAME OBJECT LOADS`);
  const F_tonf = PAZ_UTILS.lb_to_kN(p.F_lb) / 9.80665;
  lines.push(`  LINELOAD  "B1"  "Story1"  TYPE "POINT"  DIR "GRAVITY"  LC "PUNTUAL"  RD 0.5  FVAL ${fmtNum(F_tonf)}`);
  lines.push(``);
  lines.push(`$ ANALYSIS OPTIONS`);
  lines.push(`  ACTIVEDOF  "UX UY UZ RX RY RZ"  `);
  lines.push(``);
  lines.push(`$ MASS SOURCE`);
  lines.push(`  MASSSOURCE  "MsSrc1"  INCLUDEELEMENTS "Yes"  INCLUDEADDEDMASS "No"  INCLUDELOADS "No"  LUMPATSTORIES "Yes"  ISDEFAULT "Yes"  `);
  lines.push(``);
  lines.push(`$ LOAD CASES`);
  lines.push(`  LOADCASE "Modal"  TYPE  "Modal - Eigen"  MAXMODES  4 MINMODES  1 EIGENSHIFTFREQ  0 EIGENCUTOFF  0 EIGENTOL  1E-09 `);
  lines.push(`  LOADCASE "Puntual"  TYPE  "Linear Static"  LOADPAT  "PUNTUAL"  SF  1 `);
  lines.push(``);
  lines.push(...emitE2kFooter());
  return { filename: `Paz_10_7_FixedBeam.e2k`, content: lines.join("\r\n") };
}
