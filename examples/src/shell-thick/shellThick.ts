/**
 * Shell Thick (MITC4) — Muro de corte con carga vertical + lateral
 *
 * Geometría: plano X-Z vertical (W × H), espesor t.
 *   W (ancho)  → dirección X
 *   H (altura) → dirección Z
 *   Normal     → dirección Y
 *
 * BCs: empotrada en la base (k=0) — cantiléver puro.
 *
 * Cargas simultáneas:
 *   Fz (negativa) = carga gravitacional distribuida en el borde superior (kN totales).
 *   Fx            = carga lateral distribuida en el borde superior (sismo/viento).
 *
 * MITC4 captura flexión + corte transversal + membrana + drilling — ideal para
 * muros de corte donde la rigidez por flexión y corte son ambas relevantes.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const shellThick: ExampleDef = {
  id: "shell-thick",
  name: "Shell Thick (MITC4) — Hekatan vs SAP +0.30%",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  defaultShellResult: "vonMises",
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
    W:  { default: 4.0, min: 1, max: 10, step: 0.25, label: "W ancho X (m)" },
    H:  { default: 5.0, min: 2, max: 15, step: 0.25, label: "H altura Z (m)" },
    t:  { default: 0.25, min: 0.10, max: 0.60, step: 0.01, label: "t espesor (m)" },
    E:  { default: 25e6, min: 5e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.20, min: 0.10, max: 0.40, step: 0.01, label: "ν" },
    Fx: { default: 300, min: 0, max: 3000, step: 10, label: "Fx lateral tope (kN)" },
    Fz: { default: -500, min: -5000, max: 0, step: 50, label: "Fz gravitacional tope (kN)" },
    nx: { default: 8, min: 4, max: 20, step: 1, label: "nx elem X" },
    nz: { default: 12, min: 4, max: 30, step: 1, label: "nz elem Z" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), nz = Math.round(p.nz);
    const dx = p.W / nx;
    const dz = p.H / nz;

    // ── Grid plano X-Z ──
    const nodes: Node[] = [];
    for (let k = 0; k <= nz; k++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i * dx, 0, k * dz]);

    // ── Elementos Q4 ──
    const elements: Element[] = [];
    for (let k = 0; k < nz; k++)
      for (let i = 0; i < nx; i++) {
        const n0 = k * (nx + 1) + i;
        elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
      }

    // ── Supports: solo base (k=0) totalmente empotrada ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let i = 0; i <= nx; i++) {
      supports.set(i, [true, true, true, true, true, true]);
    }

    // ── Cargas en el borde superior (k = nz) ──
    // Fx lateral + Fz vertical. Esquinas reciben la mitad (carga distribuida).
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const topBase = nz * (nx + 1);
    const Fx_int = p.Fx / nx;
    const Fz_int = p.Fz / nx;
    for (let i = 0; i <= nx; i++) {
      const idx = topBase + i;
      const corner = (i === 0 || i === nx);
      const Fx = corner ? Fx_int * 0.5 : Fx_int;
      const Fz = corner ? Fz_int * 0.5 : Fz_int;
      loads.set(idx, [Fx, 0, Fz, 0, 0, 0]);
    }

    // ── Element properties ──
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

      // Verificación: cantiléver con carga lateral en tope (flexión + corte)
      const I = p.t * Math.pow(p.W, 3) / 12;
      const A = p.t * p.W;
      const G = p.E / (2 * (1 + p.nu));
      const δ_flex = p.Fx * Math.pow(p.H, 3) / (3 * p.E * I);
      const δ_shear = 1.2 * p.Fx * p.H / (G * A);
      const idx_top_mid = topBase + Math.floor(nx / 2);
      const ux_fem = states.deformOutputs.val.deformations?.get(idx_top_mid)?.[0] ?? 0;
      console.log(
        `[Muro MITC4] W=${p.W}m H=${p.H}m Fx=${p.Fx}kN Fz=${p.Fz}kN  →  δ_top FEM=${(ux_fem*1000).toFixed(3)} mm | ` +
        `cant. ideal flex+shear=${((δ_flex+δ_shear)*1000).toFixed(3)} mm`
      );
    } catch (e) {
      console.error("Shell thick solver error:", e);
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
        title: `Muro MITC4 ${p.W}×${p.H}m t=${p.t}m`,
        properties: [`E=${(p.E/1e6).toFixed(1)} GPa  ν=${p.nu}  ρ=24 kN/m³`],
      });
      console.log(`[Muro MITC4 Modal] f₁=${out.frequencies[0]?.toFixed(4)} Hz, T₁=${(1/out.frequencies[0]).toFixed(4)} s`);
    } catch (e: any) {
      console.warn("Modal muro MITC4 error:", e.message);
    }
  },
};
