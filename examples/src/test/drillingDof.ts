/**
 * Drilling DOF — 2 muros de cortante (membrana Q4) + VIGA DE ACOPLE (frame).
 *
 * Caso para validar el drilling DOF y el EXPORTADOR e2k de Hekatan Struct:
 *   - 2 machones verticales en plano X-Z (y=0), empotrados en la base.
 *   - Abertura entre ellos; una viga de acople (frame peraltado, mismo ancho que el muro)
 *     une el tope interior de un machón con el del otro.
 *   - Carga lateral Fx en el tope (sismo). El momento de la viga entra al muro por el
 *     giro en el plano (Ry = drilling).
 *
 * Objetivo doble: (1) ver el drilling en acción; (2) exportar el e2k de este modelo
 * y verificar que ETABS lo abre directo (test del exportador).
 *
 * Categoría: "test"   ·   id: "drilling-dof"
 */
import { deform, analyze, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

export const drillingDof: ExampleDef = {
  id: "drilling-dof",
  name: "Drilling DOF — 2 muros + viga de acople",
  category: "test",
  defaultShellResult: "membraneXX",
  availableShellResults: ["membraneXX", "membraneYY", "membraneXY", "vonMises", "displacementX"],
  params: {
    W:   { default: 2.0, min: 1, max: 4, step: 0.25, label: "W ancho machón X (m)" },
    H:   { default: 4.0, min: 2, max: 8, step: 0.5,  label: "H altura Z (m)" },
    gap: { default: 1.5, min: 0.5, max: 3, step: 0.25, label: "abertura (m)" },
    t:   { default: 0.25, min: 0.1, max: 0.5, step: 0.05, label: "t espesor muro (m)" },
    bH:  { default: 0.8, min: 0.3, max: 1.5, step: 0.1, label: "peralte viga acople (m)" },
    E:   { default: 24850e3, min: 5e6, max: 200e6, step: 1e6, label: "E (kN/m²)" },
    nu:  { default: 0.20, min: 0.1, max: 0.4, step: 0.01, label: "ν" },
    F:   { default: 100, min: 10, max: 1000, step: 10, label: "F lateral tope (kN, c/machón)" },
    nx:  { default: 4, min: 1, max: 10, step: 1, label: "nx elem X (c/machón)" },
    nz:  { default: 8, min: 2, max: 20, step: 1, label: "nz elem Z" },
    nb:  { default: 3, min: 1, max: 12, step: 1, label: "nb segmentos viga acople" },
  },
  build(p, states) {
    const nx = Math.round(p.nx), nz = Math.round(p.nz);
    const dxL = p.W / nx, dz = p.H / nz;
    const x0R = p.W + p.gap;            // x inicio machón derecho

    const nodes: Node[] = [];
    const idx = new Map<string, number>();
    const add = (x: number, z: number) => {
      const key = `${x.toFixed(4)},${z.toFixed(4)}`;
      let id = idx.get(key);
      if (id === undefined) { id = nodes.length; nodes.push([x, 0, z]); idx.set(key, id); }
      return id;
    };

    // ── machón: malla Q4 nx×nz a partir de x0 ──
    const elements: Element[] = [];
    const nShellPerPier = nx * nz;
    function pier(x0: number) {
      const grid: number[][] = [];
      for (let k = 0; k <= nz; k++) {
        const row: number[] = [];
        for (let i = 0; i <= nx; i++) row.push(add(x0 + i * dxL, k * dz));
        grid.push(row);
      }
      for (let k = 0; k < nz; k++)
        for (let i = 0; i < nx; i++)
          elements.push([grid[k][i], grid[k][i + 1], grid[k + 1][i + 1], grid[k + 1][i]]);
      return grid;
    }
    const gL = pier(0);
    const gR = pier(x0R);

    // ── viga de acople: frame DISCRETIZADO en nb segmentos, del tope-interior izq al der ──
    const nb = Math.round(p.nb);
    const nL = gL[nz][nx];   // tope, esquina derecha del machón izq
    const nR = gR[nz][0];    // tope, esquina izquierda del machón der
    const beamElemStart = elements.length;            // primer elemento de viga
    const beamNodeChain = [nL];
    for (let i = 1; i < nb; i++) beamNodeChain.push(add(p.W + p.gap * i / nb, p.H));  // nodos intermedios sobre la abertura
    beamNodeChain.push(nR);
    for (let i = 0; i < nb; i++) elements.push([beamNodeChain[i], beamNodeChain[i + 1]]);

    // ── supports: base empotrada (z=0) en ambos machones ──
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (let i = 0; i <= nx; i++) {
      supports.set(gL[0][i], [true, true, true, true, true, true]);
      supports.set(gR[0][i], [true, true, true, true, true, true]);
    }

    // ── carga lateral Fx en el tope de cada machón ──
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const Fx = p.F / (nx + 1);
    for (const g of [gL, gR])
      for (let i = 0; i <= nx; i++) {
        const id = g[nz][i];
        const cur = loads.get(id) || [0, 0, 0, 0, 0, 0];
        cur[0] += Fx;
        loads.set(id, cur);
      }

    // ── element inputs ──
    const thicknesses = new Map<number, number>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const densities = new Map<number, number>();
    const areas = new Map<number, number>();
    const momentsOfInertiaY = new Map<number, number>();
    const momentsOfInertiaZ = new Map<number, number>();
    const torsionalConstants = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const orientations = new Map<number, [number, number, number]>();
    const sectionShapes = new Map<number, any>();

    // shells (los primeros beamElemStart elementos = ambos machones)
    for (let e = 0; e < beamElemStart; e++) {
      thicknesses.set(e, p.t);
      elasticities.set(e, p.E);
      poissons.set(e, p.nu);
      densities.set(e, 24);
    }
    // viga de acople (frames): rectangular t (ancho) × bH (peralte), en cada segmento
    const b = p.t, h = p.bH;
    const G = p.E / (2 * (1 + p.nu));
    for (let e = beamElemStart; e < elements.length; e++) {
      areas.set(e, b * h);
      momentsOfInertiaY.set(e, b * h ** 3 / 12);   // flexión vertical (en el plano del muro)
      momentsOfInertiaZ.set(e, h * b ** 3 / 12);
      torsionalConstants.set(e, b * h ** 3 / 12 + h * b ** 3 / 12);
      elasticities.set(e, p.E);
      shearModuli.set(e, G);
      densities.set(e, 24);
      orientations.set(e, [0, 0, 1]);
      sectionShapes.set(e, { type: "rect", b, h, name: `VA-${Math.round(b*100)}x${Math.round(h*100)}` });
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      thicknesses, elasticities, poissonsRatios: poissons, densities,
      areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
      shearModuli, orientations, sectionShapes,
    };

    try {
      states.deformOutputs.val = deform(nodes, elements, { supports, loads }, states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, states.deformOutputs.val);
      const uxTopL = states.deformOutputs.val.deformations?.get(gL[nz][0])?.[0] ?? 0;
      console.log(`[Drilling DOF] 2 muros ${p.W}×${p.H}m + viga acople ${b}×${h}m  →  δ_top=${(uxTopL*1000).toFixed(3)} mm, nodos=${nodes.length}, elems=${elements.length}`);
    } catch (e) {
      console.error("drilling-dof solver error:", e);
    }
    states.objects3D.val = [];
  },
};
