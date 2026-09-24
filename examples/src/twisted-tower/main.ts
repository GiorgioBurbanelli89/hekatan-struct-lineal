/**
 * Torre retorcida (Turning Torso style).
 *
 * Anillos hexagonales que rotan progresivamente con la altura (twist),
 * conectados con columnas + diagonales que cruzan al siguiente nivel.
 * Núcleo central conectado a cada anillo + viga vertical de núcleo.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateTwistedTower()` en getCad3d.ts (líneas 10142-10241).
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
  nFloors:        { value: van.state(12),  min: 4,  max: 30,  step: 1, label: "Pisos" },
  H_floor:        { value: van.state(3.5), min: 2,  max: 6,   step: 0.5, label: "Altura piso (m)" },
  R:              { value: van.state(5),   min: 2,  max: 15,  step: 0.5, label: "Radio anillo (m)" },
  nCols:          { value: van.state(6),   min: 4,  max: 12,  step: 1, label: "Columnas / piso" },
  twistPerFloor:  { value: van.state(5),   min: 0,  max: 20,  step: 1, label: "Twist por piso (°)" },
  windFactor:     { value: van.state(10),  min: 0,  max: 50,  step: 2, label: "Carga viento top (kN)" },
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
  const R = parameters.R.value.val;
  const nCols = Math.round(parameters.nCols.value.val);
  const twistPerFloor = parameters.twistPerFloor.value.val;
  const windFactor = parameters.windFactor.value.val;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Anillos rotantes con twist
  for (let iz = 0; iz <= nFloors; iz++) {
    const z = iz * H_floor;
    const angle0 = (iz * twistPerFloor * Math.PI) / 180;
    for (let ic = 0; ic < nCols; ic++) {
      const angle = angle0 + (2 * Math.PI * ic) / nCols;
      nodes.push([R * Math.cos(angle), R * Math.sin(angle), z]);
    }
  }

  // Vigas de anillo + columnas + diagonales
  for (let iz = 0; iz <= nFloors; iz++) {
    const base = iz * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      elements.push([base + ic, base + ((ic + 1) % nCols)]); // anillo
    }
    if (iz < nFloors) {
      const next = (iz + 1) * nCols;
      for (let ic = 0; ic < nCols; ic++) {
        elements.push([base + ic, next + ic]);                 // columna
        elements.push([base + ic, next + ((ic + 1) % nCols)]); // diagonal
      }
    }
  }

  // Núcleo central
  const coreStart = (nFloors + 1) * nCols;
  for (let iz = 0; iz <= nFloors; iz++) {
    nodes.push([0, 0, iz * H_floor]);
    const base = iz * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      elements.push([coreStart + iz, base + ic]);
    }
  }
  for (let iz = 0; iz < nFloors; iz++) {
    elements.push([coreStart + iz, coreStart + iz + 1]);
  }

  // Apoyos en la base (iz=0)
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let ic = 0; ic < nCols; ic++) supports.set(ic, [true, true, true, true, true, true]);
  supports.set(coreStart, [true, true, true, true, true, true]);

  // Cargas: viento creciente con altura + gravedad
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let iz = 1; iz <= nFloors; iz++) {
    const Fw = (windFactor * iz) / nFloors;
    const base = iz * nCols;
    for (let ic = 0; ic < nCols; ic++) {
      loads.set(base + ic, [Fw, 0, -5, 0, 0, 0]);
    }
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const A = 80e-4, I = 1000e-8;
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
    console.warn("Twisted Tower deform/analyze:", e?.message ?? e);
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/twisted-tower/main.ts",
  }),
);
