/**
 * Torre 3D con diagonales — pórtico 3D simple con 4 columnas + vigas + diagonales por piso.
 * Portado desde FEM Studio `generate3d()`.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const Ec = 25e6, nu_c = 0.2, Gc = Ec / (2 * (1 + nu_c)), rho_c = 24;

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const tower3D: ExampleDef = {
  id: "tower-3d",
  name: "Torre 3D (con diagonales)",
  category: "Frames 1D",
  defaultShellResult: "none",
  availableShellResults: [],
  hasModal: true,
  params: {
    dx:      P("Geometría", "Ancho X (m)", 4, 2, 10, 0.25),
    dy:      P("Geometría", "Ancho Y (m)", 4, 2, 10, 0.25),
    dz:      P("Geometría", "Altura piso (m)", 3, 2, 5, 0.1),
    stories: P("Geometría", "N° pisos", 3, 1, 10, 1),
    nSub:    P("Geometría", "Div. vigas", 3, 1, 8, 1),
    colSize: P("Secciones", "b×h columna (m)", 0.35, 0.2, 0.6, 0.05),
    vigaB:   P("Secciones", "b viga (m)", 0.25, 0.15, 0.5, 0.05),
    vigaH:   P("Secciones", "h viga (m)", 0.40, 0.2, 0.8, 0.05),
    CM:      P("Cargas", "CM por nodo (kN)", -5,  -30, 0, 1),
    CV:      P("Cargas", "CV por nodo (kN)", -2,  -20, 0, 1),
    Ex:      P("Cargas", "Ex lateral tope (kN)", 30, 0, 300, 5),
  },
  build(p, states) {
    const stories = Math.round(p.stories);
    const nSub = Math.max(1, Math.round(p.nSub));
    const fz = p.CM + p.CV;
    const fx = p.Ex;

    // 4 columnas × (stories+1) pisos = nodos de unión
    const jointNodes: Node[] = [];
    for (let i = 0; i <= stories; i++) {
      jointNodes.push([0, 0, p.dz * i], [p.dx, 0, p.dz * i], [p.dx, p.dy, p.dz * i], [0, p.dy, p.dz * i]);
    }
    const nJoint = jointNodes.length;
    const nodes: Node[] = [...jointNodes];
    const elements: Element[] = [];
    const colIdx = new Set<number>();
    const beamIdx = new Set<number>();

    // Columnas
    for (let i = 0; i < stories; i++)
      for (let c = 0; c < 4; c++) {
        colIdx.add(elements.length);
        elements.push([i * 4 + c, (i + 1) * 4 + c]);
      }

    // Diagonales (4 por piso, X-brace en cada cara)
    for (let i = 0; i < stories; i++) {
      const o = i * 4;
      colIdx.add(elements.length); elements.push([o, o + 5]);
      colIdx.add(elements.length); elements.push([o + 3, o + 6]);
      colIdx.add(elements.length); elements.push([o, o + 7]);
      colIdx.add(elements.length); elements.push([o + 1, o + 6]);
    }

    // Vigas de piso con subdivisión
    const floorBeams: Element[] = [];
    for (let i = 1; i <= stories; i++) {
      const o = i * 4;
      floorBeams.push([o, o + 1], [o + 1, o + 2], [o + 2, o + 3], [o + 3, o], [o, o + 2]);
    }
    for (const [ni, nj] of floorBeams) {
      const p0 = jointNodes[ni], p1 = jointNodes[nj];
      let prev = ni;
      for (let k = 1; k < nSub; k++) {
        const t = k / nSub;
        const midIdx = nodes.length;
        nodes.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t]);
        beamIdx.add(elements.length); elements.push([prev, midIdx]);
        prev = midIdx;
      }
      beamIdx.add(elements.length); elements.push([prev, nj]);
    }

    // Supports
    const supports = new Map<number,[boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let c = 0; c < 4; c++) supports.set(c, [true, true, true, true, true, true]);

    // Loads
    const loads = new Map<number,[number,number,number,number,number,number]>();
    const topNode = nJoint - 2;  // esquina superior (x=dx, y=dy, z=stories*dz)
    if (fz !== 0) {
      for (let i = 0; i < nodes.length; i++) {
        if (!supports.has(i)) loads.set(i, [0, 0, fz, 0, 0, 0]);
      }
    }
    if (fx !== 0) {
      const prev = loads.get(topNode) ?? [0, 0, 0, 0, 0, 0];
      loads.set(topNode, [prev[0] + fx, prev[1], prev[2], 0, 0, 0]);
    }

    // Propiedades
    const cA = p.colSize * p.colSize;
    const cIz = (p.colSize * p.colSize ** 3) / 12;
    const cIy = cIz;
    const cJ = 0.14 * Math.pow(p.colSize, 4);
    const vA = p.vigaB * p.vigaH;
    const vIz = (p.vigaB * p.vigaH ** 3) / 12;
    const vIy = (p.vigaH * p.vigaB ** 3) / 12;
    const vJ = 0.21 * Math.pow(Math.min(p.vigaB, p.vigaH), 3) * Math.max(p.vigaB, p.vigaH);

    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const densities = new Map<number, number>();
    const poissons = new Map<number, number>();
    for (let i = 0; i < elements.length; i++) {
      elasticities.set(i, Ec); shearModuli.set(i, Gc); poissons.set(i, nu_c);
      densities.set(i, rho_c);
      if (colIdx.has(i)) { areas.set(i, cA); Iz.set(i, cIz); Iy.set(i, cIy); J.set(i, cJ); }
      else { areas.set(i, vA); Iz.set(i, vIz); Iy.set(i, vIy); J.set(i, vJ); }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      // Convención awatif Z-up: momentsOfInertiaY = eje FUERTE (b·h³/12) para que la
      // viga flexione vertical con el eje fuerte. Antes estaba al revés (eje débil).
      momentsOfInertiaZ: Iy, momentsOfInertiaY: Iz, torsionalConstants: J,
      densities, poissonsRatios: poissons,
    };
    const deformOut = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, deformOut);
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
        title: `Torre 3D ${p.dx}×${p.dy}×${Math.round(p.stories)*p.dz}m`,
        properties: [`${Math.round(p.stories)} pisos con diagonales  cols ${p.colSize}m  vigas ${p.vigaB}×${p.vigaH}m`],
      });
    } catch (e: any) { console.warn("Modal torre 3D error:", e.message); }
  },
};
