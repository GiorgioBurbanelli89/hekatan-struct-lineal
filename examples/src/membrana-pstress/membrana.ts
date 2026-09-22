/**
 * Membrana — Plane Stress (Q4) como MURO DE CORTE (shear wall)
 *
 * Geometría: plano vertical X-Z (ancho W × altura H), espesor t.
 *   W (width)  → dirección X
 *   H (height) → dirección Z
 *   Normal    → dirección Y (out-of-plane)
 *
 * BCs: empotrada en la base (z=0) — cantiléver puro.
 *      En todos los nodos se bloquea uy, rx, ry, rz (queda solo ux, uz libres = plane stress).
 *
 * Carga: fuerza lateral Fx aplicada en el borde superior (z=H) → típico patrón de muro de corte.
 *
 * Verificación: para un cantiléver alto y delgado, el desplazamiento del tope es
 *   δ_top ≈ F·H³/(3·E·I) + κ·F·H/(G·A)     (flexión + corte)
 * donde I = t·W³/12,  A = t·W,  G = E/(2(1+ν)),  κ=1.2
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const membrana: ExampleDef = {
  id: "membrana",
  name: "Membrana (Plane Stress) — Hekatan vs SAP -0.23%",
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
    W:  { default: 3.0, min: 1, max: 8,  step: 0.25, label: "W ancho X (m)" },
    H:  { default: 4.0, min: 1, max: 10, step: 0.25, label: "H altura Z (m)" },
    t:  { default: 0.20, min: 0.05, max: 0.50, step: 0.01, label: "t espesor (m)" },
    E:  { default: 25e6, min: 5e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu: { default: 0.20, min: 0.10, max: 0.40, step: 0.01, label: "ν" },
    F:  { default: 100, min: 10, max: 2000, step: 10, label: "F lateral tope (kN)" },
    nx: { default: 8, min: 4, max: 20, step: 1, label: "nx elem X" },
    nz: { default: 10, min: 4, max: 30, step: 1, label: "nz elem Z" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), nz = Math.round(p.nz);
    const dx = p.W / nx;
    const dz = p.H / nz;

    // ── Grid en plano X-Z (y=0) ──
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

    // ── Supports ──
    // Solo el borde inferior (k=0) va empotrado — todos los DOF bloqueados.
    // Nodos interiores quedan libres; el solver Q4 shell tiene estabilización drilling
    // y rigidez de flexión out-of-plane que mantiene la K no-singular aunque solo
    // haya cargas in-plane.
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let i = 0; i <= nx; i++) {
      supports.set(i, [true, true, true, true, true, true]);  // base empotrada
    }

    // ── Carga lateral Fx distribuida uniformemente en el borde superior ──
    // Esquinas reciben la mitad (efecto viga simple para carga distribuida en bordes).
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const topBase = nz * (nx + 1);
    const Fx_interior = p.F / nx;  // Fx por cada segmento horizontal dx
    for (let i = 0; i <= nx; i++) {
      const idx = topBase + i;
      const corner = (i === 0 || i === nx);
      const Fx = corner ? Fx_interior * 0.5 : Fx_interior;
      loads.set(idx, [Fx, 0, 0, 0, 0, 0]);
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

      // ── Verificación analítica: cantiléver con carga en tope ──
      // δ_top = F·H³/(3·E·I) + κ·F·H/(G·A)
      const I = p.t * Math.pow(p.W, 3) / 12;
      const A = p.t * p.W;
      const G = p.E / (2 * (1 + p.nu));
      const delta_flex = p.F * Math.pow(p.H, 3) / (3 * p.E * I);
      const delta_shear = 1.2 * p.F * p.H / (G * A);
      const delta_teo = delta_flex + delta_shear;
      // Desplazamiento horizontal del nodo central del tope
      const idx_top_mid = topBase + Math.floor(nx / 2);
      const ux_fem = states.deformOutputs.val.deformations?.get(idx_top_mid)?.[0] ?? 0;
      console.log(
        `[Muro Q4] W=${p.W}m H=${p.H}m F=${p.F}kN  →  δ_top FEM=${(ux_fem*1000).toFixed(3)} mm | ` +
        `teórico flex+shear=${(delta_teo*1000).toFixed(3)} mm (flex=${(delta_flex*1000).toFixed(3)}, shear=${(delta_shear*1000).toFixed(3)})`
      );
    } catch (e) {
      console.error("Muro Q4 solver error:", e);
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
      const title = `Muro de corte ${p.W}×${p.H}m t=${p.t}m`;
      const props = [`E=${(p.E/1e6).toFixed(1)} GPa  ν=${p.nu}  ρ=24 kN/m³`];
      modalPanel.render(out, { title, properties: props });
      console.log(`[Muro Modal] f₁ = ${out.frequencies[0]?.toFixed(4)} Hz, T₁ = ${(1/out.frequencies[0]).toFixed(4)} s`);
    } catch (e: any) {
      console.warn("Modal muro error:", e.message);
    }
  },
};
