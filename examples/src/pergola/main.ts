/**
 * Pérgola de acero — 3 pórticos con vigas inclinadas + correas + panel shell Q4.
 *
 * - 3 líneas de vigas en X (k=0, Lx/2, Lx)
 * - Columnas verticales del piso (Z=0) al techo (Z=H1→H2 inclinado)
 * - Vigas inclinadas siguiendo H(y) = H1 + (H2-H1)·y/Ly
 * - Correas perpendiculares (a lo largo de X) en cada Y
 * - Paneles shell Q4 entre vigas como cubierta
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generatePergola()` en getCad3d.ts (líneas 10667-10912).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const Es = 200e6;       // acero kN/m²
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;       // kN/m³ ≈ 7850 kg/m³

const parameters: Parameters = {
  Lx:    { value: van.state(5.5),    min: 2,    max: 15,   step: 0.5,  label: "Lx (m)" },
  Ly:    { value: van.state(8),      min: 3,    max: 20,   step: 0.5,  label: "Ly (m)" },
  H1:    { value: van.state(3.0),    min: 2,    max: 6,    step: 0.25, label: "H1 — bajo (m)" },
  H2:    { value: van.state(4.0),    min: 2,    max: 8,    step: 0.25, label: "H2 — alto (m)" },
  nCol:  { value: van.state(4),      min: 2,    max: 10,   step: 1,    label: "Columnas (Y)" },
  nCorr: { value: van.state(8),      min: 4,    max: 20,   step: 1,    label: "Correas" },
  tPanel:{ value: van.state(0.0005), min: 0.0001, max: 0.005, step: 0.0001, label: "Espesor panel (m)" },
  q:     { value: van.state(1.0),    min: 0,    max: 5,    step: 0.25, label: "Carga distribuida (kN/m²)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

// Sección I: A, Iz, Iy, J
function Isec(d: number, bf: number, tf: number, tw: number) {
  const hw = d - 2 * tf;
  const A = 2 * bf * tf + hw * tw;
  const Iz = (bf * d * d * d - (bf - tw) * hw * hw * hw) / 12;
  const Iy = (2 * tf * bf * bf * bf + hw * tw * tw * tw) / 12;
  const J = (2 * bf * tf * tf * tf + hw * tw * tw * tw) / 3;
  return { A, Iz, Iy, J };
}
const colSec = Isec(0.16, 0.16, 0.013, 0.008);
const vigSec = Isec(0.20, 0.10, 0.0085, 0.0056);
// Correa rectangular tube
const corrB = 0.06, corrT = 0.004;
const corrA = corrB * corrB - (corrB - 2 * corrT) ** 2;
const corrI = (corrB ** 4 - (corrB - 2 * corrT) ** 4) / 12;
const corrJ_val = (2 * corrT * (corrB - corrT) ** 3) / 2;

van.derive(() => {
  const Lx = parameters.Lx.value.val;
  const Ly = parameters.Ly.value.val;
  const H1 = parameters.H1.value.val;
  const H2 = parameters.H2.value.val;
  const nCol = Math.round(parameters.nCol.value.val);
  const nCorr = Math.round(parameters.nCorr.value.val);
  const tPanel = parameters.tPanel.value.val;
  const q = parameters.q.value.val;

  const nVig = 3;
  const vigX = [0, Lx / 2, Lx];

  // Posiciones Y de columnas y correas (unión de ambos sets)
  const colY: number[] = [];
  for (let i = 0; i < nCol; i++) colY.push((i * Ly) / (nCol - 1));
  const corrYSet = new Set<number>();
  for (const cy of colY) corrYSet.add(cy);
  for (let i = 0; i < nCorr; i++) corrYSet.add((i * Ly) / (nCorr - 1));
  const corrY = Array.from(corrYSet).sort((a, b) => a - b);
  const nRoof = corrY.length;

  const roofH = (y: number) => H1 + ((H2 - H1) * y) / Ly;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Grids de nodos (base + roof por línea de viga)
  const baseGrid: number[][] = [];
  const roofGrid: number[][] = [];
  for (let k = 0; k < nVig; k++) {
    const bRow: number[] = [];
    for (let i = 0; i < nCol; i++) {
      bRow.push(nodes.length);
      nodes.push([vigX[k], colY[i], 0]);
    }
    baseGrid.push(bRow);
    const rRow: number[] = [];
    for (let j = 0; j < nRoof; j++) {
      rRow.push(nodes.length);
      nodes.push([vigX[k], corrY[j], roofH(corrY[j])]);
    }
    roofGrid.push(rRow);
  }

  const elasticities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const moiZ = new Map<number, number>();
  const moiY = new Map<number, number>();
  const torsion = new Map<number, number>();
  const densities = new Map<number, number>();

  // Columnas (Z=0 → Z=H)
  for (let k = 0; k < nVig; k++) {
    for (let i = 0; i < nCol; i++) {
      const cyi = corrY.indexOf(colY[i]);
      if (cyi < 0) continue;
      const ei = elements.length;
      elements.push([baseGrid[k][i], roofGrid[k][cyi]]);
      elasticities.set(ei, Es); shearModuli.set(ei, Gs);
      areas.set(ei, colSec.A); moiZ.set(ei, colSec.Iy); moiY.set(ei, colSec.Iz);
      torsion.set(ei, colSec.J); densities.set(ei, rho_s);
    }
  }

  // Vigas inclinadas
  for (let k = 0; k < nVig; k++) {
    for (let j = 0; j < nRoof - 1; j++) {
      const ei = elements.length;
      elements.push([roofGrid[k][j], roofGrid[k][j + 1]]);
      elasticities.set(ei, Es); shearModuli.set(ei, Gs);
      areas.set(ei, vigSec.A); moiZ.set(ei, vigSec.Iy); moiY.set(ei, vigSec.Iz);
      torsion.set(ei, vigSec.J); densities.set(ei, rho_s);
    }
  }

  // Correas
  for (let j = 0; j < nRoof; j++) {
    for (let k = 0; k < nVig - 1; k++) {
      const ei = elements.length;
      elements.push([roofGrid[k][j], roofGrid[k + 1][j]]);
      elasticities.set(ei, Es); shearModuli.set(ei, Gs);
      areas.set(ei, corrA); moiZ.set(ei, corrI); moiY.set(ei, corrI);
      torsion.set(ei, corrJ_val); densities.set(ei, rho_s);
    }
  }

  // Paneles shell Q4 entre vigas
  for (let k = 0; k < nVig - 1; k++) {
    for (let j = 0; j < nRoof - 1; j++) {
      const ei = elements.length;
      elements.push([roofGrid[k][j], roofGrid[k + 1][j], roofGrid[k + 1][j + 1], roofGrid[k][j + 1]]);
      elasticities.set(ei, Es); shearModuli.set(ei, Gs); densities.set(ei, rho_s);
    }
  }

  // Apoyos en bases de columnas
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  const supDofs: [boolean, boolean, boolean, boolean, boolean, boolean] = [true, true, true, true, true, true];
  for (let k = 0; k < nVig; k++) {
    for (let i = 0; i < nCol; i++) supports.set(baseGrid[k][i], supDofs);
  }

  // Cargas: gravedad distribuida sobre nodos del techo (área tributaria)
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let k = 0; k < nVig; k++) {
    for (let j = 0; j < nRoof; j++) {
      let tribDx = 0;
      if (k === 0) tribDx = (vigX[1] - vigX[0]) / 2;
      else if (k === nVig - 1) tribDx = (vigX[nVig - 1] - vigX[nVig - 2]) / 2;
      else tribDx = (vigX[k + 1] - vigX[k - 1]) / 2;
      let tribDy = 0;
      if (j === 0) tribDy = (corrY[1] - corrY[0]) / 2;
      else if (j === nRoof - 1) tribDy = (corrY[nRoof - 1] - corrY[nRoof - 2]) / 2;
      else tribDy = (corrY[j + 1] - corrY[j - 1]) / 2;
      const Fz = -q * tribDx * tribDy;
      loads.set(roofGrid[k][j], [0, 0, Fz, 0, 0, 0]);
    }
  }

  const nodeInputs: NodeInputs = { supports, loads };
  // Espesores y poissons solo para Q4 shells
  const thicknesses = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].length === 4) {
      thicknesses.set(i, tPanel);
      poissonsRatios.set(i, nu_s);
    }
  }
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: moiZ, momentsOfInertiaZ: moiY,
    torsionalConstants: torsion, densities,
    thicknesses, poissonsRatios,
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    let maxUz = 0;
    deformOutputs.deformations.forEach((d: number[]) => {
      if (Math.abs(d[2]) > Math.abs(maxUz)) maxUz = d[2];
    });
    console.log(`Pérgola: Uz_max=${maxUz.toExponential(4)} m`);
  } catch (e: any) {
    console.warn("Pérgola deform/analyze:", e?.message ?? e);
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
    settingsObj: { deformedShape: true, shellResults: "displacementZ" },
  }),
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/pergola/main.ts",
  }),
);
