/**
 * Plate Thick — Mindlin-Reissner (FSDT)
 * Placa gruesa con deformación por cortante.
 */
import { plateQ4Solve, modalAnalysis, type Node } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const plateThick: ExampleDef = {
  id: "plate-thick",
  name: "Plate Thick (Mindlin-Reissner) — Hekatan vs SAP +0.30%",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  defaultShellResult: "bendingXX",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: true,
  params: {
    Lx: { default: 4.0, min: 1, max: 10, step: 0.5, label: "Lx (m)" },
    Ly: { default: 4.0, min: 1, max: 10, step: 0.5, label: "Ly (m)" },
    t:  { default: 0.3, min: 0.1, max: 0.8, step: 0.05, label: "espesor t (m)" },
    E:  { default: 30e6, min: 1e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.3, min: 0.1, max: 0.4, step: 0.01, label: "ν" },
    q:  { default: 10, min: 1, max: 30, step: 1, label: "q presión ↓ (kN/m²)" },
    nx: { default: 10, min: 4, max: 20, step: 1, label: "nx elementos" },
    ny: { default: 10, min: 4, max: 20, step: 1, label: "ny elementos" },
  },
  build(p, states) {
    const out = plateQ4Solve({
      E: p.E, nu: p.nu, thickness: p.t,
      theoryType: 0,              // 0 = Mindlin (thick)
      meshLx: p.Lx, meshLy: p.Ly,
      meshNx: Math.round(p.nx), meshNy: Math.round(p.ny),
      bcType: "simply-supported",
      pressure: -p.q,
    });
    const nodes: Node[] = out.nodeResults.map((n) => [n.x, n.y, 0]);
    const elems = out.elementResults.map((e) => e.nodes);
    states.nodes.val = nodes;
    states.elements.val = elems as number[][];
    const thicknesses = new Map<number, number>();
    elems.forEach((_, i) => thicknesses.set(i, p.t));

    // ── Supports/loads para visualización (plateQ4Solve los aplicó internamente) ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const A_trib_full = (p.Lx / Math.round(p.nx)) * (p.Ly / Math.round(p.ny));
    nodes.forEach((n, i) => {
      const onEdge = Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.Lx) < 1e-6 ||
                     Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.Ly) < 1e-6;
      if (onEdge) supports.set(i, [true, true, true, false, false, false]);
      const corner = (Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - p.Lx) < 1e-6) &&
                     (Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - p.Ly) < 1e-6);
      const factor = corner ? 0.25 : onEdge ? 0.5 : 1.0;
      loads.set(i, [0, 0, -p.q * A_trib_full * factor, 0, 0, 0]);
    });

    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = { thicknesses };
    const deformations = new Map<number, [number, number, number, number, number, number]>();
    out.nodeResults.forEach((n, i) => {
      deformations.set(i, [0, 0, n.w, n.bx, n.by, 0]);
    });
    states.deformOutputs.val = { deformations };
    const bendingXX = new Map<number, number[]>();
    const bendingYY = new Map<number, number[]>();
    const bendingXY = new Map<number, number[]>();
    out.elementResults.forEach((er, i) => {
      bendingXX.set(i, [er.Mxx, er.Mxx, er.Mxx, er.Mxx]);
      bendingYY.set(i, [er.Myy, er.Myy, er.Myy, er.Myy]);
      bendingXY.set(i, [er.Mxy, er.Mxy, er.Mxy, er.Mxy]);
    });
    states.analyzeOutputs.val = { bendingXX, bendingYY, bendingXY };
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    elems.forEach((_, i) => { elasticities.set(i, p.E); poissons.set(i, p.nu); densities.set(i, 24 / 9.81); });
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };
    states.objects3D.val = [];
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, 12);
      modalPanel.render(out, { title: `Plate Thick ${p.Lx}×${p.Ly}m t=${p.t}m`, properties: [`E=${(p.E/1e6).toFixed(1)} GPa  ν=${p.nu}  ρ=24 kN/m³`] });
    } catch (e: any) { console.warn("Modal plate-thick error:", e.message); }
  },
};
