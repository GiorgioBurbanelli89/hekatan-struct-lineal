/**
 * Puente atirantado (cable-stayed bridge).
 *
 * Tablero con 2 vigas paralelas (Y=±deckW/2) + transversales,
 * 2 torres a 1/3 y 2/3 del span con piernas y traviesa superior,
 * cables en abanico desde la cima de cada torre hacia el tablero.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateBridge()` en getCad3d.ts (líneas 10034-10139).
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
  span:      { value: van.state(60),  min: 20,  max: 200, step: 5,  label: "Luz total (m)" },
  towerH:    { value: van.state(20),  min: 8,   max: 60,  step: 2,  label: "Altura torre (m)" },
  deckH:     { value: van.state(8),   min: 2,   max: 20,  step: 1,  label: "Altura tablero (m)" },
  deckW:     { value: van.state(6),   min: 2,   max: 15,  step: 0.5, label: "Ancho tablero (m)" },
  nSpanDiv:  { value: van.state(16),  min: 8,   max: 40,  step: 1,  label: "Subdivisiones span" },
  loadDeck:  { value: van.state(-30), min: -150, max: 0,  step: 5,  label: "Carga por nodo (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

van.derive(() => {
  const span = parameters.span.value.val;
  const towerH = parameters.towerH.value.val;
  const deckH = parameters.deckH.value.val;
  const deckW = parameters.deckW.value.val;
  const nSpanDiv = Math.round(parameters.nSpanDiv.value.val);
  const loadDeck = parameters.loadDeck.value.val;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Tablero: 2 líneas longitudinales (Y = ±deckW/2)
  for (let i = 0; i <= nSpanDiv; i++) {
    const x = (span * i) / nSpanDiv;
    nodes.push([x, -deckW / 2, deckH]);
    nodes.push([x,  deckW / 2, deckH]);
  }
  const nDeckNodes = nodes.length;

  // Vigas longitudinales + transversales
  for (let i = 0; i < nSpanDiv; i++) {
    elements.push([i * 2, (i + 1) * 2]);
    elements.push([i * 2 + 1, (i + 1) * 2 + 1]);
    elements.push([i * 2, i * 2 + 1]);
  }
  elements.push([nSpanDiv * 2, nSpanDiv * 2 + 1]);

  // Torres a 1/3 y 2/3 del span
  const towerPositions = [Math.round(nSpanDiv / 3), Math.round((2 * nSpanDiv) / 3)];
  const towerTopNodes: number[] = [];
  for (const tp of towerPositions) {
    const x = (span * tp) / nSpanDiv;
    const baseL = nodes.length; nodes.push([x, -deckW / 2, 0]);
    const baseR = nodes.length; nodes.push([x,  deckW / 2, 0]);
    const topL  = nodes.length; nodes.push([x, -deckW / 2, towerH + deckH]);
    const topR  = nodes.length; nodes.push([x,  deckW / 2, towerH + deckH]);
    towerTopNodes.push(topL, topR);

    elements.push([baseL, tp * 2]);
    elements.push([tp * 2, topL]);
    elements.push([baseR, tp * 2 + 1]);
    elements.push([tp * 2 + 1, topR]);
    elements.push([topL, topR]);
  }

  // Cables en abanico (cada 2 nodos)
  for (const topIdx of towerTopNodes) {
    const towerX = nodes[topIdx][0];
    for (let i = 0; i <= nSpanDiv; i++) {
      const deckX = (span * i) / nSpanDiv;
      const dx = Math.abs(deckX - towerX);
      if (dx > span * 0.05 && dx < span * 0.45 && i % 2 === 0) {
        const deckNodeIdx = nodes[topIdx][1] < 0 ? i * 2 : i * 2 + 1;
        elements.push([topIdx, deckNodeIdx]);
      }
    }
  }

  const nDeckEls = nSpanDiv * 3 + 1;

  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(0, [true, true, true, false, false, false]);
  supports.set(1, [true, true, true, false, false, false]);
  supports.set(nSpanDiv * 2, [false, true, true, false, false, false]);
  supports.set(nSpanDiv * 2 + 1, [false, true, true, false, false, false]);
  for (let i = nDeckNodes; i < nDeckNodes + towerPositions.length * 4; i += 4) {
    supports.set(i, [true, true, true, true, true, true]);
    supports.set(i + 1, [true, true, true, true, true, true]);
  }

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let i = 0; i <= nSpanDiv; i++) {
    loads.set(i * 2, [0, 0, loadDeck, 0, 0, 0]);
    loads.set(i * 2 + 1, [0, 0, loadDeck, 0, 0, 0]);
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities:       new Map(elements.map((_, i) => [i, Es])),
    shearModuli:        new Map(elements.map((_, i) => [i, Gs])),
    // Tablero/torres = secciones grandes; cables = secciones pequeñas
    areas:              new Map(elements.map((_, i) => [i, i < nDeckEls ? 200e-4 : 10e-4])),
    momentsOfInertiaY:  new Map(elements.map((_, i) => [i, 5000e-8])),
    momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, 2000e-8])),
    torsionalConstants: new Map(elements.map((_, i) => [i, 1000e-8])),
    densities:          new Map(elements.map((_, i) => [i, rho_s])),
    poissonsRatios:     new Map(elements.map((_, i) => [i, nu_s])),
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
  } catch (e: any) {
    console.warn("Puente deform/analyze:", e?.message ?? e);
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/cable-stayed-bridge/main.ts",
  }),
);
