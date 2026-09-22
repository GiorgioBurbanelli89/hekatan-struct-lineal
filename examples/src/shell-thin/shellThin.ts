/**
 * Shell Thin — Kirchhoff-Love
 * Cáscara delgada (membrana + flexión Kirchhoff) con apoyos en bordes.
 * Usa solver `deform` con shells Q4 (6 GDL/nodo).
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const shellThin: ExampleDef = {
  id: "shell-thin",
  name: "Shell Thin (Kirchhoff-Love) — Hekatan vs SAP δ+4.31% M+0.47%",
  category: "2️⃣ Shells · 🐚 Cáscaras",
  benchmark: true,
  defaultShellResult: "displacementZ",
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
    t:  { default: 0.05, min: 0.01, max: 0.2, step: 0.01, label: "espesor t (m)" },
    E:  { default: 30e6, min: 1e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.2, min: 0.1, max: 0.4, step: 0.01, label: "ν" },
    q:  { default: 5, min: 1, max: 20, step: 0.5, label: "q presión ↓ (kN/m²)" },
    nx: { default: 8, min: 4, max: 16, step: 1, label: "nx" },
    ny: { default: 8, min: 4, max: 16, step: 1, label: "ny" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), ny = Math.round(p.ny);
    const nodes: Node[] = [];
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([(i * p.Lx) / nx, (j * p.Ly) / ny, 0]);
    const elements: Element[] = [];
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const n0 = j * (nx + 1) + i;
        elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
      }
    // Simply supported: w=0 en todos los bordes
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let i = 0; i <= nx; i++) {
      supports.set(i, [true, true, true, false, false, false]); // bottom
      supports.set(ny * (nx + 1) + i, [true, true, true, false, false, false]); // top
    }
    for (let j = 0; j <= ny; j++) {
      supports.set(j * (nx + 1), [true, true, true, false, false, false]); // left
      supports.set(j * (nx + 1) + nx, [true, true, true, false, false, false]); // right
    }
    // Carga uniforme aplicada como cargas nodales (q × area_trib)
    const A_trib_full = (p.Lx / nx) * (p.Ly / ny);
    const loads = new Map<number, [number, number, number, number, number, number]>();
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++) {
        const idx = j * (nx + 1) + i;
        const corner = (i === 0 || i === nx) && (j === 0 || j === ny);
        const edge = (i === 0 || i === nx || j === 0 || j === ny);
        const factor = corner ? 0.25 : edge ? 0.5 : 1.0;
        const Fz = -p.q * A_trib_full * factor;  // carga descendente
        loads.set(idx, [0, 0, Fz, 0, 0, 0]);
      }
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    elements.forEach((_, i) => {
      thicknesses.set(i, p.t);
      elasticities.set(i, p.E);
      poissons.set(i, p.nu);
      densities.set(i, 24 / 9.81);   // t/m3 de MASA, no kN/m3
    });
    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = { thicknesses, elasticities, poissonsRatios: poissons, densities };
    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
    } catch (e) {
      console.error("Shell thin solver error:", e);
    }
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
      modalPanel.render(out, {
        title: `Shell Thin ${p.Lx}×${p.Ly}m t=${p.t}m`,
        properties: [`E=${(p.E/1e6).toFixed(1)} GPa  ν=${p.nu}  ρ=24 kN/m³`],
      });
      console.log(`[Shell Thin Modal] f₁=${out.frequencies[0]?.toFixed(4)} Hz`);
    } catch (e: any) { console.warn("Modal shell-thin error:", e.message); }
  },
};
