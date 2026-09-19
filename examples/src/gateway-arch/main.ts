/**
 * Gateway Arch — arco catenario/parabólico (St. Louis).
 *
 * 2 arcos paralelos en Y conectados por transversales y X-bracing.
 * Curva del arco: parábola simplificada z(x) = H · (1 − (2x/span − 1)²)
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateGatewayArch()` en getCad3d.ts (líneas 9967-10031).
 */
import van, { State } from "vanjs-core";
import {
  Node,
  Element,
  NodeInputs,
  ElementInputs,
  DeformOutputs,
  AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

const parameters: Parameters = {
  H:       { value: van.state(20),    min: 5,    max: 50,    step: 1,    label: "Altura H (m)" },
  span:    { value: van.state(20),    min: 5,    max: 60,    step: 1,    label: "Luz (m)" },
  depth:   { value: van.state(2),     min: 0.5,  max: 8,     step: 0.5,  label: "Profundidad arcos (m)" },
  nDiv:    { value: van.state(20),    min: 6,    max: 50,    step: 1,    label: "Subdivisiones" },
  A:       { value: van.state(100e-4),min: 10e-4, max: 500e-4, step: 10e-4, label: "Área (m²)" },
  I:       { value: van.state(500e-8),min: 50e-8, max: 5000e-8, step: 50e-8, label: "Inercia (m⁴)" },
  load:    { value: van.state(-20),   min: -100, max: 0,     step: 5,    label: "Carga por nodo (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

van.derive(() => {
  const H = parameters.H.value.val;
  const span = parameters.span.value.val;
  const depth = parameters.depth.value.val;
  const nDiv = Math.round(parameters.nDiv.value.val);
  const A = parameters.A.value.val;
  const I = parameters.I.value.val;
  const load = parameters.load.value.val;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // 2 arcos paralelos (front + back en Y)
  for (let i = 0; i <= nDiv; i++) {
    const t = i / nDiv;
    const x = span * t;
    const z = H * (1 - Math.pow(2 * t - 1, 2));
    nodes.push([x, -depth / 2, z]);
    nodes.push([x,  depth / 2, z]);
  }

  // Elementos de cada arco + bracing
  for (let i = 0; i < nDiv; i++) {
    elements.push([i * 2, (i + 1) * 2]);          // arco frontal
    elements.push([i * 2 + 1, (i + 1) * 2 + 1]);  // arco trasero
    elements.push([i * 2, i * 2 + 1]);             // transversal
    elements.push([i * 2, (i + 1) * 2 + 1]);       // X-brace
    elements.push([i * 2 + 1, (i + 1) * 2]);       // X-brace
  }
  elements.push([nDiv * 2, nDiv * 2 + 1]);          // último transversal

  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(0, [true, true, true, true, true, true]);
  supports.set(1, [true, true, true, true, true, true]);
  supports.set(nDiv * 2, [true, true, true, true, true, true]);
  supports.set(nDiv * 2 + 1, [true, true, true, true, true, true]);

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let i = 0; i <= nDiv; i++) {
    loads.set(i * 2, [0, 0, load, 0, 0, 0]);
    loads.set(i * 2 + 1, [0, 0, load, 0, 0, 0]);
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities:       new Map(elements.map((_, i) => [i, Es])),
    shearModuli:        new Map(elements.map((_, i) => [i, Gs])),
    areas:              new Map(elements.map((_, i) => [i, A])),
    momentsOfInertiaY:  new Map(elements.map((_, i) => [i, I])),
    momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, I])),
    torsionalConstants: new Map(elements.map((_, i) => [i, 2 * I])),
    densities:          new Map(elements.map((_, i) => [i, rho_s])),
    poissonsRatios:     new Map(elements.map((_, i) => [i, nu_s])),
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
  } catch (e: any) {
    console.warn("Gateway Arch deform/analyze:", e?.message ?? e);
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/gateway-arch/main.ts",
  }),
);
