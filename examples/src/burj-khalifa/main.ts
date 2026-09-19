/**
 * Burj Khalifa style — torre escalonada con planta en Y (3 alas).
 *
 * Reducción de radio con la altura + dos setbacks (40% y 70% de altura)
 * que reducen el radio adicional. 3 alas a 120° conectan núcleo y
 * extremos con punto medio (buttress) y diagonales en cada ala.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateBurjKhalifa()` en getCad3d.ts (líneas 10244-10319).
 * Material: hormigón armado (E=35 GPa).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const Ec = 35e6;       // hormigón kN/m²
const nu_c = 0.2;
const Gc = Ec / (2 * (1 + nu_c));
const rho_c = 24 / 9.81; // ton/m³

const parameters: Parameters = {
  nFloors:    { value: van.state(20),  min: 8,  max: 50,  step: 1, label: "Pisos" },
  H_floor:    { value: van.state(3),   min: 2.5, max: 6, step: 0.5, label: "Altura piso (m)" },
  baseR:      { value: van.state(8),   min: 4,  max: 20,  step: 1, label: "Radio base (m)" },
  windFactor: { value: van.state(5),   min: 0,  max: 30,  step: 1, label: "Carga viento top (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

const nWings = 3;

van.derive(() => {
  const nFloors = Math.round(parameters.nFloors.value.val);
  const H_floor = parameters.H_floor.value.val;
  const baseR = parameters.baseR.value.val;
  const windFactor = parameters.windFactor.value.val;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  for (let iz = 0; iz <= nFloors; iz++) {
    const t = iz / nFloors;
    const z = iz * H_floor;
    // Setbacks: reducción de radio
    let R = baseR * (1 - t * 0.7);
    if (t > 0.4) R *= 0.85; // primer setback
    if (t > 0.7) R *= 0.7;  // segundo setback

    const coreIdx = nodes.length;
    nodes.push([0, 0, z]);

    // 3 alas (puntas + midpoints)
    for (let w = 0; w < nWings; w++) {
      const angle = (w * 2 * Math.PI) / nWings - Math.PI / 2;
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      const tipIdx = nodes.length;
      nodes.push([x, y, z]);
      elements.push([coreIdx, tipIdx]);
      const midIdx = nodes.length;
      nodes.push([x * 0.5, y * 0.5, z]);
      elements.push([coreIdx, midIdx]);
      elements.push([midIdx, tipIdx]);
    }

    // Perímetro: conectar puntas
    for (let w = 0; w < nWings; w++) {
      const tip1 = coreIdx + 1 + w * 2;
      const tip2 = coreIdx + 1 + ((w + 1) % nWings) * 2;
      elements.push([tip1, tip2]);
    }

    // Columnas al siguiente piso
    if (iz < nFloors) {
      const nodesPerFloor = 1 + nWings * 2;
      const nextCore = coreIdx + nodesPerFloor;
      elements.push([coreIdx, nextCore]); // núcleo
      for (let w = 0; w < nWings; w++) {
        elements.push([coreIdx + 1 + w * 2, nextCore + 1 + w * 2]); // tip
        elements.push([coreIdx + 2 + w * 2, nextCore + 2 + w * 2]); // mid
        elements.push([coreIdx + 1 + w * 2, nextCore + 2 + w * 2]); // diagonal
      }
    }
  }

  const nodesPerFloor = 1 + nWings * 2;
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 0; i < nodesPerFloor; i++) {
    supports.set(i, [true, true, true, true, true, true]);
  }

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let iz = 1; iz <= nFloors; iz++) {
    const base = iz * nodesPerFloor;
    const Fw = (windFactor * iz) / nFloors;
    loads.set(base, [Fw, 0, -10, 0, 0, 0]);
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const A = 200e-4, I = 5000e-8;
  const elementInputs: ElementInputs = {
    elasticities:       new Map(elements.map((_, i) => [i, Ec])),
    shearModuli:        new Map(elements.map((_, i) => [i, Gc])),
    areas:              new Map(elements.map((_, i) => [i, A])),
    momentsOfInertiaY:  new Map(elements.map((_, i) => [i, I])),
    momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, I])),
    torsionalConstants: new Map(elements.map((_, i) => [i, 2 * I])),
    densities:          new Map(elements.map((_, i) => [i, rho_c])),
    poissonsRatios:     new Map(elements.map((_, i) => [i, nu_c])),
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
  } catch (e: any) {
    console.warn("Burj Khalifa deform/analyze:", e?.message ?? e);
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/burj-khalifa/main.ts",
  }),
);
