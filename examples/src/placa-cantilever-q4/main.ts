/**
 * Placa cantilever horizontal Q4 — plano X-Y, carga vertical en Y.
 *
 * Placa horizontal (plano XY, elev=0), empotrada en el borde x=0,
 * carga distribuida vertical en el borde libre x=Lx (downward Y).
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generatePlacaCantileverQ4()` en getCad3d.ts (líneas 10597-10664).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const parameters: Parameters = {
  Lx: { value: van.state(4),    min: 1,    max: 12,   step: 0.5,  label: "Lx (m)" },
  Ly: { value: van.state(2),    min: 0.5,  max: 8,    step: 0.5,  label: "Ly (m)" },
  t:  { value: van.state(0.15), min: 0.05, max: 0.5,  step: 0.05, label: "Espesor (m)" },
  nx: { value: van.state(8),    min: 4,    max: 20,   step: 1,    label: "Mesh nx" },
  ny: { value: van.state(4),    min: 2,    max: 12,   step: 1,    label: "Mesh ny" },
  E:  { value: van.state(25e6), min: 10e6, max: 50e6, step: 1e6,  label: "E (kN/m²)" },
  nu: { value: van.state(0.2),  min: 0.0,  max: 0.49, step: 0.05, label: "ν" },
  P:  { value: van.state(20),   min: 0,    max: 200,  step: 5,    label: "Carga total borde (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

van.derive(() => {
  const Lx = parameters.Lx.value.val;
  const Ly = parameters.Ly.value.val;
  const t = parameters.t.value.val;
  const nx = Math.round(parameters.nx.value.val);
  const ny = Math.round(parameters.ny.value.val);
  const E = parameters.E.value.val;
  const nu = parameters.nu.value.val;
  const P = parameters.P.value.val;
  const G = E / (2 * (1 + nu));
  const dx = Lx / nx;
  const dy = Ly / ny;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Plano horizontal X-Y (elev = z = 0)
  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++)
      nodes.push([i * dx, 0, j * dy]);

  const nNx = nx + 1;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++)
      elements.push([j * nNx + i, j * nNx + i + 1, (j + 1) * nNx + i + 1, (j + 1) * nNx + i]);

  // Empotramiento en borde izquierdo
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let j = 0; j <= ny; j++) supports.set(j * nNx, [true, true, true, true, true, true]);

  // Carga distribuida en el borde libre (x=Lx) downward Y
  const freeEdge: number[] = [];
  for (let j = 0; j <= ny; j++) freeEdge.push(j * nNx + nx);
  const pn = P / freeEdge.length;
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (const n of freeEdge) loads.set(n, [0, -pn, 0, 0, 0, 0]);

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities:   new Map(elements.map((_, i) => [i, E])),
    poissonsRatios: new Map(elements.map((_, i) => [i, nu])),
    thicknesses:    new Map(elements.map((_, i) => [i, t])),
    shearModuli:    new Map(elements.map((_, i) => [i, G])),
    densities:      new Map(elements.map((_, i) => [i, 24 / 9.80665])),
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    const tipMid = ((ny / 2) | 0) * nNx + nx;
    const def = deformOutputs.deformations.get(tipMid);
    const uy = def ? def[1] : 0;
    console.log(`Placa XY Q4: Uy_tip=${uy.toExponential(4)} m`);
  } catch (e: any) {
    console.warn("Placa XY Q4 deform/analyze:", e?.message ?? e);
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-cantilever-q4/main.ts",
  }),
);
