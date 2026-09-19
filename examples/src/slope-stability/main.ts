/**
 * Estabilidad de talud — Strength Reduction Method (SRM) Mohr-Coulomb.
 *
 * Geometría: talud con altura H, ángulo α°, banco superior bTop e inferior bBot.
 * Profundidad debajo del pie igual a H. Polígono cerrado en sentido CCW:
 *   [0,-D] → [W,-D] → [W,H] → [bBot+slopeRun,H] → [bBot,0] → [0,0]
 *
 * Mallado triangular con `getMesh`. Apoyos: fondo fijo, lados con rolls
 * (fix Ux). Solver C++ `slopeSRM` aplica Strength Reduction Method para
 * obtener FOS, desplazamientos y deformación plástica equivalente.
 *
 * Display: deformaciones remapeadas Y→Z para vista vertical, plastic strain
 * mostrada como colormap "membraneXX".
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateSlope()` en getCad3d.ts (líneas 4075-4197).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { slopeSRM } from "hekatan-fem";
import { getMesh } from "hekatan-mesh";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const parameters: Parameters = {
  H:        { value: van.state(6),    min: 1,    max: 25,   step: 0.5,  label: "Altura H (m)" },
  angle:    { value: van.state(45),   min: 20,   max: 80,   step: 1,    label: "Ángulo (°)" },
  bTop:     { value: van.state(3),    min: 1,    max: 15,   step: 0.5,  label: "Banco superior (m)" },
  bBot:     { value: van.state(3),    min: 1,    max: 15,   step: 0.5,  label: "Banco inferior (m)" },
  meshSize: { value: van.state(2.0),  min: 0.5,  max: 5,    step: 0.25, label: "Mesh size (m)" },
  E:        { value: van.state(50000),min: 1000, max: 500000, step: 1000, label: "E (kPa)" },
  nu:       { value: van.state(0.3),  min: 0.0,  max: 0.49, step: 0.05, label: "ν" },
  gamma:    { value: van.state(18),   min: 12,   max: 25,   step: 0.5,  label: "γ (kN/m³)" },
  c:        { value: van.state(15),   min: 0,    max: 100,  step: 1,    label: "Cohesión c (kPa)" },
  phi:      { value: van.state(30),   min: 0,    max: 45,   step: 1,    label: "Fricción φ (°)" },
  qs:       { value: van.state(0),    min: 0,    max: 100,  step: 5,    label: "Sobrecarga (kN/m²)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

van.derive(() => {
  const H = parameters.H.value.val;
  const angle = parameters.angle.value.val;
  const bTop = parameters.bTop.value.val;
  const bBot = parameters.bBot.value.val;
  const meshSize = parameters.meshSize.value.val;
  const E = parameters.E.value.val;
  const nu = parameters.nu.value.val;
  const gamma = parameters.gamma.value.val;
  const c = parameters.c.value.val;
  const phi = parameters.phi.value.val;
  const qs = parameters.qs.value.val;

  const slopeRun = H / Math.tan((angle * Math.PI) / 180);
  const totalW = bBot + slopeRun + bTop;
  const D = H; // profundidad debajo del pie

  const pts: [number, number, number][] = [
    [0, -D, 0],                  // 0: deep-left
    [totalW, -D, 0],             // 1: deep-right
    [totalW, H, 0],              // 2: top-right (cresta)
    [bBot + slopeRun, H, 0],     // 3: cresta-junction
    [bBot, 0, 0],                // 4: pie del talud
    [0, 0, 0],                   // 5: surface-left (a nivel del pie)
  ];

  let meshNodes: Node[] = [];
  let elements: Element[] = [];
  try {
    const result = getMesh({
      points: pts,
      polygon: [0, 1, 2, 3, 4, 5],
      maxMeshSize: meshSize,
    });
    meshNodes = result.nodes;
    elements = result.elements;
  } catch (e: any) {
    console.warn("getMesh failed:", e?.message ?? e);
    return;
  }

  // Apoyos: fondo fijo, lados rollers en X
  const srmSupports: { node: number; fixX: boolean; fixY: boolean }[] = [];
  const viewSupports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 0; i < meshNodes.length; i++) {
    const x = meshNodes[i][0];
    const y = meshNodes[i][1];
    if (Math.abs(y + D) < 1e-6) {
      srmSupports.push({ node: i, fixX: true, fixY: true });
      viewSupports.set(i, [true, true, true, true, true, true]);
    } else if (Math.abs(x) < 1e-6 || Math.abs(x - totalW) < 1e-6) {
      srmSupports.push({ node: i, fixX: true, fixY: false });
      viewSupports.set(i, [true, false, true, true, true, true]);
    }
  }

  const surfaceYThreshold = H - meshSize * 0.3;

  let viewDeforms = new Map<number, [number, number, number, number, number, number]>();
  let plasticMap = new Map<number, [number, number, number]>();
  try {
    const nodes2D: [number, number][] = meshNodes.map((n) => [n[0], n[1]]);
    const tris: [number, number, number][] = elements.map(
      (el: number[]) => [el[0], el[1], el[2]] as [number, number, number],
    );

    const result = slopeSRM({
      nodes: nodes2D,
      elements: tris,
      E, nu, gamma, c, phi,
      thickness: 1.0,
      supports: srmSupports,
      surcharge: qs,
      surfaceYThreshold,
    });

    // Convertir desplazamientos 2D → 6-DOF, remapeando Y→Z para visualización vertical
    for (let i = 0; i < result.displacements.length; i++) {
      const [ux, uy] = result.displacements[i];
      viewDeforms.set(i, [ux, 0, uy, 0, 0, 0]);
    }

    // Plastic strain por elemento → triplete (3 vértices con mismo valor)
    for (let e = 0; e < result.plasticStrain.length; e++) {
      const eps = result.plasticStrain[e];
      plasticMap.set(e, [eps, eps, eps]);
    }

    let maxDisp = 0;
    for (const [ux, uy] of result.displacements) {
      const mag = Math.sqrt(ux * ux + uy * uy);
      maxDisp = Math.max(maxDisp, mag);
    }
    let maxPlastic = 0;
    for (const eps of result.plasticStrain) {
      maxPlastic = Math.max(maxPlastic, eps);
    }

    console.log(
      `Talud SRM: ${meshNodes.length} nodos, ${elements.length} triángulos | ` +
      `H=${H} α=${angle}° c=${c} φ=${phi}° γ=${gamma} | ` +
      `FOS=${result.fos.toFixed(3)} max|u|=${maxDisp.toExponential(3)} ε_pl_max=${maxPlastic.toExponential(3)}`,
    );
    if (result.fos < 1.0) console.warn("⚠ TALUD INESTABLE (FOS < 1.0)");
    else if (result.fos < 1.5) console.warn("⚠ FOS < 1.5 — revisar estabilidad");
  } catch (e: any) {
    console.warn("Talud SRM failed:", e?.message ?? e);
  }

  // Remapear nodes XY→XZ (Y→Z) para vista vertical en Three.js Z-up
  const viewNodes: Node[] = meshNodes.map((n) => [n[0], 0, n[1]] as Node);

  nodesState.val = viewNodes;
  elementsState.val = elements;
  nodeInputsState.val = { supports: viewSupports };
  elementInputsState.val = {};
  deformOutputsState.val = { deformations: viewDeforms } as DeformOutputs;
  analyzeOutputsState.val = { membraneXX: plasticMap } as AnalyzeOutputs;
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
    settingsObj: { deformedShape: true, shellResults: "membraneXX" },
  }),
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/slope-stability/main.ts",
  }),
);
