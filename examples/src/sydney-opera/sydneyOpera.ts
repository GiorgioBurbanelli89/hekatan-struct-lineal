/**
 * Sydney Opera House — velas tipo cáscara esférica en shells Q4, con peso propio.
 *
 * Cada "vela" es una superficie Q4 con perfil:
 *   z(t_x, t_y) = H · sin(π · t_x) · (1 − 0.5 · t_y²)
 *   widthAtY  = span · (1 − 0.3 · t_y²)
 * Cada vela siguiente es un poco más chica que la previa (offset 12 m en X).
 *
 * Graduado desde la página con panel propio (`sydney-opera/main.ts`, hasta el
 * 28-sep-2026): mismo modelo, mismo orden de nudos, misma llamada al solver.
 * Material: cáscara de hormigón (E=35 GPa, t=15 cm). Sin panel de benchmark
 * — la página vieja no comparaba contra ningún programa ni fórmula.
 */
import type { Node, Element, NodeInputs, ElementInputs } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

const Ec = 35e6;
const nuC = 0.2;
const Gc = Ec / (2 * (1 + nuC));
const rhoC = 24 / 9.81;

export interface SydneyOperaMalla {
  nodes: Node[];
  elements: Element[];
  supports: NonNullable<NodeInputs["supports"]>;
  loads: NonNullable<NodeInputs["loads"]>;
}

/**
 * Malla pura de las velas del Sydney Opera House, sin estados ni DOM — mismo
 * orden de nudos y elementos que el panel viejo (`sydney-opera/main.ts`
 * líneas 54-97).
 */
export function mallaSydneyOpera(p: Record<string, number>): SydneyOperaMalla {
  const nShells = Math.round(p.nShells);
  const nArch = Math.round(p.nArch);
  const H0 = p.H;
  const span0 = p.span;
  const depth0 = p.depth;
  const selfLoad = p.selfLoad;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  for (let s = 0; s < nShells; s++) {
    const offsetX = s * 12;
    const H = Math.max(2, H0 - s * 2);
    const span = Math.max(5, span0 - s * 3);
    const depth = Math.max(2, depth0 - s);
    const baseIdx = nodes.length;

    // Superficie esférica con 5 filas en Y
    for (let iy = 0; iy <= 4; iy++) {
      const tY = iy / 4;
      const yLocal = -depth / 2 + depth * tY;
      const widthAtY = span * (1 - tY * tY * 0.3);
      for (let ix = 0; ix <= nArch; ix++) {
        const tX = ix / nArch;
        const x = offsetX + widthAtY * tX;
        const z = H * Math.sin(Math.PI * tX) * (1 - tY * tY * 0.5);
        nodes.push([x, yLocal, z]);
      }
    }

    // Elementos Q4 (4 filas × nArch columnas)
    const nX = nArch + 1;
    for (let iy = 0; iy < 4; iy++) {
      for (let ix = 0; ix < nArch; ix++) {
        const n0 = baseIdx + iy * nX + ix;
        const n1 = baseIdx + iy * nX + ix + 1;
        const n2 = baseIdx + (iy + 1) * nX + ix + 1;
        const n3 = baseIdx + (iy + 1) * nX + ix;
        elements.push([n0, n1, n2, n3]);
      }
    }
  }

  // Apoyos: nodos en la base (z < 0.5)
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i][2] < 0.5) supports.set(i, [true, true, true, true, true, true]);
  }

  // Cargas self-weight: nodos por encima de z=2
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i][2] > 2) loads.set(i, [0, 0, selfLoad, 0, 0, 0]);
  }

  return { nodes, elements, supports, loads };
}

export const sydneyOpera: ExampleDef = {
  id: "sydney-opera",
  name: "Sydney Opera House",
  category: "2️⃣ Shells · 🐚 Cáscaras",
  // El panel viejo abría sin colormap: su settingsObj solo traía `deformedShape: true`,
  // sin `shellResults` (el visor lo defaultea a "none").
  defaultShellResult: "none",
  guide: [
    "«Velas» controla cuántas cáscaras esféricas se apilan (offset 12 m en X)",
    "Los nudos con z < 0.5 m quedan empotrados (la base de cada vela)",
    "«Carga self-weight» se aplica en −Z a todo nudo con z > 2 m",
  ],
  params: {
    nShells:   { default: 3,    min: 1, max: 5,  step: 1,    label: "Velas", folder: "Geometría" },
    nArch:     { default: 12,   min: 4, max: 24, step: 1,    label: "Subdivisiones arco", folder: "Malla" },
    H:         { default: 15,   min: 5, max: 30, step: 1,    label: "Altura primera vela (m)", folder: "Geometría" },
    span:      { default: 20,   min: 8, max: 40, step: 1,    label: "Span primera vela (m)", folder: "Geometría" },
    depth:     { default: 8,    min: 3, max: 15, step: 0.5,  label: "Profundidad primera vela (m)", folder: "Geometría" },
    thickness: { default: 0.15, min: 0.05, max: 0.5, step: 0.05, label: "Espesor cáscara (m)", folder: "Sección" },
    selfLoad:  { default: -5,   min: -20, max: 0, step: 1,   label: "Carga self-weight (kN)", folder: "Cargas" },
  },
  build(p: Record<string, number>, states: BuildStates) {
    const m = mallaSydneyOpera(p);

    const nodeInputs: NodeInputs = { supports: m.supports, loads: m.loads };
    const elementInputs: ElementInputs = {
      elasticities:   new Map(m.elements.map((_, i) => [i, Ec])),
      poissonsRatios: new Map(m.elements.map((_, i) => [i, nuC])),
      thicknesses:    new Map(m.elements.map((_, i) => [i, p.thickness])),
      shearModuli:    new Map(m.elements.map((_, i) => [i, Gc])),
      densities:      new Map(m.elements.map((_, i) => [i, rhoC])),
    };

    states.nodes.val = m.nodes;
    states.elements.val = m.elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;

    try {
      const dOut = deform(m.nodes, m.elements, nodeInputs, elementInputs);
      states.deformOutputs.val = dOut;
      states.analyzeOutputs.val = analyze(m.nodes, m.elements, elementInputs, dOut);
    } catch (e) {
      console.warn("sydney-opera deform/analyze:", e);
    }
    states.objects3D.val = [];
  },
};
