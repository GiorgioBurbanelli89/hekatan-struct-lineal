/**
 * Pórtico 2D — marco plano con columnas + viga, carga lateral (Ex) y vertical (CM+CV).
 * Portado desde FEM Studio `generateBeams()`.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const Ec = 25e6, nu_c = 0.2, Gc = Ec / (2 * (1 + nu_c)), rho_c = 24;
const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s)), rho_s = 78;

// Helper para crear params con folder
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });
const PE = (folder: string, label: string, def: number, options: Record<string, number>) =>
  ({ default: def, label, folder, options });

export const portico2D: ExampleDef = {
  id: "portico-2d",
  name: "Pórtico 2D (un piso)",
  category: "Frames 1D",
  defaultShellResult: "none",
  availableShellResults: [],
  hasModal: true,
  params: {
    width:  P("Geometría", "Ancho vano (m)", 5.0, 2, 12, 0.5),
    height: P("Geometría", "Altura (m)", 3.0, 2, 6, 0.1),
    nSub:   P("Geometría", "Div. viga", 4, 1, 10, 1),
    mat:    PE("Secciones", "Material", 0, { "Hormigón": 0, "Acero": 1 }),
    colB:   P("Secciones", "b columna (m)", 0.40, 0.2, 0.8, 0.05),
    colH:   P("Secciones", "h columna (m)", 0.40, 0.2, 0.8, 0.05),
    vigaB:  P("Secciones", "b viga (m)", 0.30, 0.2, 0.6, 0.05),
    vigaH:  P("Secciones", "h viga (m)", 0.50, 0.3, 0.9, 0.05),
    CM:     P("Cargas", "CM por nodo (kN)", -10, -50, 0, 1),
    CV:     P("Cargas", "CV por nodo (kN)", -5,  -30, 0, 1),
    Ex:     P("Cargas", "Ex lateral tope (kN)", 30, -200, 200, 5),
  },
  build(p, states) {
    const w = p.width, h = p.height;
    const nSub = Math.max(1, Math.round(p.nSub));
    const fz = p.CM + p.CV;
    const fx = p.Ex;

    // Nodos: 0=base-izq, 1=top-izq, 2=top-der, 3=base-der
    const nodes: Node[] = [[0,0,0],[0,0,h],[w,0,h],[w,0,0]];
    const elements: Element[] = [];
    const colIdx = new Set<number>();
    const beamIdx = new Set<number>();

    // Columnas
    colIdx.add(elements.length); elements.push([0, 1]);
    colIdx.add(elements.length); elements.push([2, 3]);

    // Viga con subdivisión
    let prev = 1;
    for (let k = 1; k < nSub; k++) {
      const t = k / nSub;
      const midIdx = nodes.length;
      nodes.push([t * w, 0, h]);
      beamIdx.add(elements.length); elements.push([prev, midIdx]);
      prev = midIdx;
    }
    beamIdx.add(elements.length); elements.push([prev, 2]);

    // Supports en bases empotradas
    const supports = new Map<number,[boolean,boolean,boolean,boolean,boolean,boolean]>([
      [0, [true, true, true, true, true, true]],
      [3, [true, true, true, true, true, true]],
    ]);

    // Cargas
    const loads = new Map<number,[number,number,number,number,number,number]>();
    if (fz !== 0) {
      for (let i = 1; i < nodes.length; i++) {
        if (i === 3) continue;
        loads.set(i, [0, 0, fz, 0, 0, 0]);
      }
    }
    if (fx !== 0) {
      const prev = loads.get(2) ?? [0, 0, 0, 0, 0, 0];
      loads.set(2, [fx, 0, prev[2], 0, 0, 0]);
    }

    // Propiedades según material
    const E = p.mat < 0.5 ? Ec : Es;
    const G = p.mat < 0.5 ? Gc : Gs;
    const nu = p.mat < 0.5 ? nu_c : nu_s;
    const rho = p.mat < 0.5 ? rho_c : rho_s;
    const cA = p.colB * p.colH;
    const cIz = (p.colB * p.colH ** 3) / 12;
    const cIy = (p.colH * p.colB ** 3) / 12;
    const cJ = 0.14 * Math.pow(Math.min(p.colB, p.colH), 4);
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
      elasticities.set(i, E); shearModuli.set(i, G); poissons.set(i, nu);
      densities.set(i, rho);
      if (colIdx.has(i)) { areas.set(i, cA); Iz.set(i, cIz); Iy.set(i, cIy); J.set(i, cJ); }
      else { areas.set(i, vA); Iz.set(i, vIz); Iy.set(i, vIy); J.set(i, vJ); }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports, loads };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      // Convención awatif Z-up: momentsOfInertiaY = eje FUERTE (Iz AISC = b·h³/12),
      // momentsOfInertiaZ = eje débil. Antes estaba al revés → flexión con eje débil.
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
      const out = modalAnalysis(nodes, elements, ni, ei, 8);
      modalPanel.render(out, {
        title: `Pórtico 2D W=${p.width}m H=${p.height}m`,
        properties: [`${p.mat<0.5?'Hormigón':'Acero'}  col ${p.colB}×${p.colH}  viga ${p.vigaB}×${p.vigaH}`],
      });
    } catch (e: any) { console.warn("Modal pórtico 2D error:", e.message); }
  },
};
