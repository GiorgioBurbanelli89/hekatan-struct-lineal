/**
 * Diagrid Tower (estilo Gherkin / 30 St Mary Axe).
 *
 * Cilindro tapered (más ancho en la mitad como pepino) con NO columnas
 * verticales — solo diagonales en patrón diagrid (cada nodo conecta a
 * +1 y −1 en el siguiente piso, alternando shift). Anillos horizontales
 * en cada nivel.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateDiagrid()` en getCad3d.ts (líneas 10392-10463).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

const parameters: Parameters = {
  nFloors:    { value: van.state(15),  min: 5,  max: 30, step: 1, label: "Pisos" },
  H_floor:    { value: van.state(3.5), min: 2,  max: 6,  step: 0.5, label: "Altura piso (m)" },
  nCols:      { value: van.state(12),  min: 6,  max: 20, step: 1, label: "Columnas perímetro" },
  baseR:      { value: van.state(5),   min: 2,  max: 15, step: 0.5, label: "Radio base (m)" },
  windFactor: { value: van.state(3),   min: 0,  max: 20, step: 1, label: "Carga viento top (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

van.derive(() => {
  const nFloors = Math.round(parameters.nFloors.value.val);
  const H_floor = parameters.H_floor.value.val;
  const nCols = Math.round(parameters.nCols.value.val);
  const baseR = parameters.baseR.value.val;
  const windFactor = parameters.windFactor.value.val;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Perfil Gherkin: más ancho en la mitad
  for (let iz = 0; iz <= nFloors; iz++) {
    const t = iz / nFloors;
    const z = iz * H_floor;
    let R = baseR * (0.6 + 0.4 * Math.sin(Math.PI * t));
    if (t > 0.9) {
      // Taper en el top
      const Rmid = baseR * (0.6 + 0.4 * Math.sin(Math.PI * 0.9));
      R = Rmid * (1 - (t - 0.9) * 8);
      R = Math.max(R, 1);
    }
    for (let ic = 0; ic < nCols; ic++) {
      const angle = (2 * Math.PI * ic) / nCols;
      nodes.push([R * Math.cos(angle), R * Math.sin(angle), z]);
    }
  }

  // Anillos + diagrid
  for (let iz = 0; iz < nFloors; iz++) {
    const base = iz * nCols;
    const next = (iz + 1) * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      elements.push([base + ic, base + ((ic + 1) % nCols)]); // anillo
    }
    const shift = iz % 2 === 0 ? 1 : -1;
    for (let ic = 0; ic < nCols; ic++) {
      const nextCol = (ic + shift + nCols) % nCols;
      elements.push([base + ic, next + nextCol]); // diagonal primaria
      elements.push([base + ic, next + ic]);       // secundaria
    }
  }
  // Anillo top
  const topBase = nFloors * nCols;
  for (let ic = 0; ic < nCols; ic++) {
    elements.push([topBase + ic, topBase + ((ic + 1) % nCols)]);
  }

  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let ic = 0; ic < nCols; ic++) supports.set(ic, [true, true, true, true, true, true]);

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let iz = 1; iz <= nFloors; iz++) {
    const base = iz * nCols;
    const Fw = (windFactor * iz) / nFloors;
    for (let ic = 0; ic < nCols; ic += 3) {
      loads.set(base + ic, [Fw, 0, -8, 0, 0, 0]);
    }
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const A = 60e-4, I = 800e-8;
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
    console.warn("Diagrid deform/analyze:", e?.message ?? e);
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/diagrid/main.ts",
  }),
);
