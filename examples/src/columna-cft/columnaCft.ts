/**
 * Columna CFT (Concrete-Filled Tube) — AISC 360-22 §I2 verificación completa.
 *
 * Columna individual compuesta: tubo de acero relleno con concreto. Permite
 * elegir sección circular o rectangular, dimensiones, material, longitud, y
 * verifica capacidades (Pn, Mno, EI_eff, C1-C2-C3 factors) según AISC 360-22
 * Chapter I.
 *
 * Modelado: elemento frame vertical con propiedades equivalentes de la sección
 * compuesta (Level 1 — sección homogeneizada con factores AISC rigurosos).
 * Para análisis cíclico/pushover con fibras, ver roadmap Fase 2.
 *
 * Códigos:
 *   - AISC 360-22 Chapter I  (Composite Members)
 *   - AISC 360-22 §I2.1b      (Axial + flexural rigidity)
 *   - AISC 360-22 §I1.4       (Slenderness classification)
 *   - AISC 360-22 §H1.1       (Interaction equations)
 *   - ACI 318-22 §10          (Composite compression members)
 *   - Eurocode 4              (simplified method — analog)
 */
import {
  deform, type Node, type Element,
  discretizeCftCircular, discretizeCftRectangular,
  sectionForces, momentForAxial,
} from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cftCapacity, cftCheck, type CftSectionInput } from "../shared/cftDesign";

export const columnaCft: ExampleDef = {
  id: "columna-cft",
  name: "Columna CFT (AISC 360-22 §I2)",
  category: "1️⃣ Frames · 🎯 1 GDL Axial",
  hasModal: false,
  params: {
    // ── Sección ──
    shape:   { default: 0, label: "Forma", options: { "Circular HSS": 0, "Rectangular HSS": 1 } },
    Dout:    { default: 0.30, min: 0.10, max: 0.80, step: 0.01, label: "D exterior (m)" },
    Hrect:   { default: 0.30, min: 0.10, max: 0.80, step: 0.01, label: "H alto rect (m)", folder: "Solo rectangular" },
    t_tube:  { default: 0.010, min: 0.004, max: 0.025, step: 0.001, label: "t tubo (m)" },
    L_col:   { default: 3.00, min: 1.5, max: 8.0, step: 0.1, label: "L columna (m)" },
    K_eff:   { default: 1.0, min: 0.5, max: 2.0, step: 0.1, label: "K efectivo (AISC Table C-A-7.1)" },

    // ── Materiales ──
    fc:      { default: 28_000, min: 14_000, max: 70_000, step: 1_000, label: "f'c (kN/m²)", folder: "Materiales" },
    Fy:      { default: 345_000, min: 250_000, max: 450_000, step: 5_000, label: "Fy acero (kN/m²)", folder: "Materiales" },

    // ── Cargas de demanda (LRFD) ──
    Pu:      { default: 2000, min: 0, max: 20_000, step: 50, label: "Pu compresión (kN)", folder: "Demanda LRFD", unitType: "force" },
    Mu:      { default: 150, min: 0, max: 2_000, step: 10, label: "Mu flector (kN·m)", folder: "Demanda LRFD", unitType: "moment" },
  },
  defaultShellResult: "none",
  availableShellResults: [],
  build(p, states) {
    // ── 1. Geometría 3D simple: columna vertical empotrada en base ──
    const nNodes = 10;
    const L = p.L_col;
    const nodes: Node[] = [];
    for (let i = 0; i <= nNodes; i++) nodes.push([0, 0, (i / nNodes) * L]);

    const elements: Element[] = [];
    for (let i = 0; i < nNodes; i++) elements.push([i, i + 1]);

    // ── 2. Propiedades CFT equivalentes (AISC §I2.1b) ──
    const shape = p.shape < 0.5 ? "circular" : "rectangular";
    const input: CftSectionInput = {
      shape: shape as any,
      D: p.Dout,
      H: p.Hrect,
      t: p.t_tube,
      L: p.L_col,
      fc: p.fc,
      Fy: p.Fy,
      K: p.K_eff,
    };
    const cap = cftCapacity(input);

    // ── 3. Nodal supports (empotrado base) + load en top ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    supports.set(0, [true, true, true, true, true, true]);

    const loads = new Map<number, [number, number, number, number, number, number]>();
    // Compresión + momento flector simultaneo en el tope
    loads.set(nNodes, [0, 0, -p.Pu, p.Mu, 0, 0]);

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };

    // ── 4. Element inputs con Ees equivalente + Igs ──
    //   Usamos EA_eff y EI_eff directamente para que la rigidez del frame
    //   equivalga a la del conjunto acero + concreto (AISC factores).
    //   EI_eff = E·I → si dejamos E fija como Es, entonces I_eff = EI_eff/Es.
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const densities = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    const poissons = new Map<number, number>();

    const E_effective = 200_000_000;   // usamos Es, compensamos área con EA_eff/E
    const A_effective = cap.EA_eff / E_effective;
    const I_effective = cap.EI_eff / E_effective;
    const J_effective = 2 * I_effective;   // aprox para circular
    const G_effective = E_effective / (2 * (1 + 0.30));

    for (let i = 0; i < elements.length; i++) {
      areas.set(i, A_effective);
      Iz.set(i, I_effective);
      Iy.set(i, I_effective);
      J.set(i, J_effective);
      elasticities.set(i, E_effective);
      shearModuli.set(i, G_effective);
      densities.set(i, 24 / 9.80665);   // peso promedio concreto + acero
      thicknesses.set(i, p.t_tube);
      poissons.set(i, 0.20);
    }
    states.elementInputs.val = {
      areas, momentsOfInertiaZ: Iy, momentsOfInertiaY: Iz, torsionalConstants: J,
      elasticities, shearModuli, densities, thicknesses, poissonsRatios: poissons,
    };

    // ── 5. Resolver estático ──
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
    } catch (e) {
      console.error("CFT deform error:", e);
    }

    states.objects3D.val = [];

    // ── 6. Log de verificación ──
    const check = cftCheck(input, p.Pu, p.Mu);
    console.log(
      `[CFT ${shape}] D=${(p.Dout * 1000).toFixed(0)}mm t=${(p.t_tube * 1000).toFixed(1)}mm f'c=${(p.fc / 1000).toFixed(0)}MPa Fy=${(p.Fy / 1000).toFixed(0)}MPa\n` +
      `  Pno=${cap.Pno.toFixed(0)} kN · Pn=${cap.Pn.toFixed(0)} kN · Pnt=${cap.Pnt.toFixed(0)} kN\n` +
      `  EI_eff=${(cap.EI_eff / 1e6).toFixed(1)} MN·m² · EA_eff=${(cap.EA_eff / 1e6).toFixed(1)} MN\n` +
      `  C1=${cap.C1.toFixed(3)} · C2=${cap.C2} · C3=${cap.C3} · slenderness=${cap.slenderness} (ratio ${cap.slendernessRatio.toFixed(1)})\n` +
      `  Demand/Capacity ratio = ${check.ratio.toFixed(3)} ${check.passes ? "✓ OK" : "✗ FAIL"} (${check.governing})`,
    );
  },
  computedLabels(p, _states) {
    const shape = p.shape < 0.5 ? "circular" : "rectangular";
    const input: CftSectionInput = {
      shape: shape as any,
      D: p.Dout, H: p.Hrect, t: p.t_tube, L: p.L_col,
      fc: p.fc, Fy: p.Fy, K: p.K_eff,
    };
    const cap = cftCapacity(input);
    const check = cftCheck(input, p.Pu, p.Mu);

    const result: Record<string, string> = {
      "── Geometría CFT ──": "",
      "Forma": shape,
      "As acero": `${(cap.As * 10000).toFixed(1)} cm²`,
      "Ac concreto": `${(cap.Ac * 10000).toFixed(0)} cm²`,
      "As/Ag": `${(cap.As / cap.Ag * 100).toFixed(1)} %`,

      "── AISC 360-22 §I2.1b ──": "",
      "Pno (compresión nominal)": `${cap.Pno.toFixed(0)} kN`,
      "Pn (con pandeo global)": `${cap.Pn.toFixed(0)} kN`,
      "Pnt (tracción)": `${cap.Pnt.toFixed(0)} kN`,
      "Mno (flexión)": `${cap.Mno.toFixed(1)} kN·m`,
      "EI_eff": `${(cap.EI_eff / 1e6).toFixed(1)} MN·m²`,
      "EA_eff": `${(cap.EA_eff / 1e6).toFixed(1)} MN`,
      "Factor C1 (concreto)": cap.C1.toFixed(3),
      "Factor C2 (confinamiento)": cap.C2.toFixed(2),

      "── Esbeltez (§I1.4) ──": "",
      [`${shape === "circular" ? "D/t" : "b/t"}`]: cap.slendernessRatio.toFixed(1),
      "λp (compact limit)": cap.lambda_p.toFixed(1),
      "Clasificación": cap.slenderness.toUpperCase(),

      "── Verificación §H1.1 ──": "",
      "Pu / Pc (Pc = φPn)": `${(p.Pu / check.Pc).toFixed(3)}`,
      "Mu / Mc (Mc = φMno)": `${(p.Mu / check.Mc).toFixed(3)}`,
      "Ratio D/C": `${check.ratio.toFixed(3)} ${check.passes ? "✓" : "✗ FAIL"}`,
      "Ecuación gobernante": check.governing,
    };

    // ── Level 2 — Fiber section con Mander concreto confinado ──
    try {
      const sec = shape === "circular"
        ? discretizeCftCircular(p.Dout, p.t_tube, p.fc, p.Fy, 32, 8)
        : discretizeCftRectangular(p.Dout, p.Hrect, p.t_tube, p.fc, p.Fy, 16, 16);

      // Pno fiber = fuerza axial con curvatura 0 y strain = εcc (pico concreto)
      const { P: P_fiber_peak } = sectionForces(sec, sec.mander.ecc, 0);
      // M fiber para la carga axial aplicada Pu (strain con curvatura que maximiza M)
      const { M: M_fiber } = momentForAxial(sec, p.Pu, 0.02);

      // Level 1 vs Level 2 comparison
      const Pno_L1 = cap.Pno;
      const Pno_L2 = Math.abs(P_fiber_peak);
      const deltaP = ((Pno_L2 - Pno_L1) / Pno_L1 * 100);

      result["── Level 2 (Fiber section Mander) ──"] = "";
      result["f'cc concreto confinado"] = `${(sec.mander.fcc / 1000).toFixed(1)} MPa (f'c × ${sec.mander.K_conf.toFixed(2)})`;
      result["εcc confinado"] = `${(sec.mander.ecc * 1000).toFixed(2)} ‰ (vs εco=2‰ no confinado)`;
      result["Pno L2 (fiber)"] = `${Pno_L2.toFixed(0)} kN`;
      result["L2 vs L1 diff"] = `${deltaP >= 0 ? "+" : ""}${deltaP.toFixed(1)} %`;
      result["M @ Pu (fiber)"] = `${Math.abs(M_fiber).toFixed(1)} kN·m`;
      result["Fibras acero × concreto"] = `${sec.fibers.filter(f => f.kind === "steel").length} × ${sec.fibers.filter(f => f.kind === "concrete").length}`;
    } catch (e) {
      result["Level 2 fiber error"] = `${(e as Error).message}`;
    }

    return result;
  },
};
