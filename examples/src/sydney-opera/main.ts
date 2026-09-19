/**
 * Sydney Opera House — 3 velas tipo cáscara esférica.
 *
 * Cada "vela" es una superficie Q4 con perfil:
 *   z(t_x, t_y) = H · sin(π · t_x) · (1 − 0.5 · t_y²)
 *   widthAtY  = span · (1 − 0.3 · t_y²)
 * Cada vela siguiente es un poco más chica que la previa.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateSydneyOpera()` en getCad3d.ts (líneas 10322-10389).
 * Material: shell de hormigón (E=35 GPa, t=15 cm).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const Ec = 35e6;
const nu_c = 0.2;
const Gc = Ec / (2 * (1 + nu_c));
const rho_c = 24 / 9.81;

const parameters: Parameters = {
  nShells:  { value: van.state(3),    min: 1,  max: 5,  step: 1, label: "Velas" },
  nArch:    { value: van.state(12),   min: 4,  max: 24, step: 1, label: "Subdivisiones arco" },
  H:        { value: van.state(15),   min: 5,  max: 30, step: 1, label: "Altura primera vela (m)" },
  span:     { value: van.state(20),   min: 8,  max: 40, step: 1, label: "Span primera vela (m)" },
  depth:    { value: van.state(8),    min: 3,  max: 15, step: 0.5, label: "Profundidad primera vela (m)" },
  thickness:{ value: van.state(0.15), min: 0.05, max: 0.5, step: 0.05, label: "Espesor cáscara (m)" },
  selfLoad: { value: van.state(-5),   min: -20, max: 0,  step: 1, label: "Carga self-weight (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

van.derive(() => {
  const nShells = Math.round(parameters.nShells.value.val);
  const nArch = Math.round(parameters.nArch.value.val);
  const H0 = parameters.H.value.val;
  const span0 = parameters.span.value.val;
  const depth0 = parameters.depth.value.val;
  const thickness = parameters.thickness.value.val;
  const selfLoad = parameters.selfLoad.value.val;

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

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities:   new Map(elements.map((_, i) => [i, Ec])),
    poissonsRatios: new Map(elements.map((_, i) => [i, nu_c])),
    thicknesses:    new Map(elements.map((_, i) => [i, thickness])),
    shearModuli:    new Map(elements.map((_, i) => [i, Gc])),
    densities:      new Map(elements.map((_, i) => [i, rho_c])),
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
  } catch (e: any) {
    console.warn("Sydney Opera deform/analyze:", e?.message ?? e);
  }

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
});

document.body.append(
  getParameters(parameters),
  getViewer({
    mesh: {
      nodes: nodesState,
      elements: elementsState,
      nodeInputs: nodeInputsState,
      elementInputs: elementInputsState,
      deformOutputs: deformOutputsState,
      analyzeOutputs: analyzeOutputsState,
    },
    settingsObj: { deformedShape: true },
  }),
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/sydney-opera/main.ts",
  }),
);
