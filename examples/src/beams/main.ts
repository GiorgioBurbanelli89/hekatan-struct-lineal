import van, { State } from "vanjs-core";
import {
  NodeInputs,
  ElementInputs,
  DeformOutputs,
  AnalyzeOutputs,
  ModalOutputs,
  Element,
  Node,
  analyze,
  deform,
  modalAnalysis,
} from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";
import { getCad3d } from "../shared/getCad3d";
import { createModalPanel } from "../shared/renderModalTable";

// ============================================================================
// Example 6.3 - Space Frame (Dynamics of Structures, Paz & Leigh)
// Units: kip, in, sec
// ============================================================================

const E = 29500;                   // ksi
const nu = 0.3;
const G = E / (2 * (1 + nu));     // 11346.15 ksi

const STORY_H = 180;              // in
const BAY_X = 114;                // in (book: X direction = 114)
const BAY_Y = 240;                // in (book: Y direction = 240)

// Steel density: 490 lb/ft³ → kip·sec²/in⁴
// γ = 490 lb/ft³ = 0.490 kip/ft³ = 0.490/(12³) kip/in³ → ρ = γ/g
const RHO_STEEL = 490 / 1000 / (12 ** 3) / 386.4; // 7.339e-7

// W24x146 (columns) AISC
const COL_A = 43.0, COL_Iz = 5630, COL_Iy = 391, COL_J = 34.8;
// W14x84 (girders) AISC — book says W14x84, NOT W14x82
const GIR_A = 24.7, GIR_Iz = 928, GIR_Iy = 225, GIR_J = 5.90;

const NUM_MODES = 6;

// Init
const parameters: Parameters = {
  storyH: { value: van.state(STORY_H), min: 100, max: 300, step: 10, label: "Story H (in)" },
  bayX:   { value: van.state(BAY_X),   min: 50,  max: 300, step: 10, label: "Bay X (in)" },
  bayY:   { value: van.state(BAY_Y),   min: 100, max: 400, step: 10, label: "Bay Y (in)" },
};

const nodes: State<Node[]> = van.state([]);
const elements: State<Element[]> = van.state([]);
const nodeInputs: State<NodeInputs> = van.state({});
const elementInputs: State<ElementInputs> = van.state({});
const deformOutputs: State<DeformOutputs> = van.state({});
const analyzeOutputs: State<AnalyzeOutputs> = van.state({});

// Modal results display container (shared module)
const modalPanel = createModalPanel();

van.derive(() => {
  const h = parameters.storyH.value.val;
  const bx = parameters.bayX.value.val;
  const by = parameters.bayY.value.val;

  // 8 nodes: 4 base (Z=0) + 4 top (Z=h)
  nodes.val = [
    [0,  0,  0],    // 0 base
    [0,  0,  h],    // 1 top
    [0,  by, 0],    // 2 base
    [0,  by, h],    // 3 top
    [bx, 0,  0],    // 4 base
    [bx, 0,  h],    // 5 top
    [bx, by, 0],    // 6 base
    [bx, by, h],    // 7 top
  ];

  // 8 elements: 4 columns + 4 top girders (Example 6.3, no diagonals)
  // Our 0-based: base 0,2,4,6 → top 1,3,5,7
  elements.val = [
    [0, 1], [2, 3], [4, 5], [6, 7],   // columns (0-3)
    [1, 5], [3, 7], [1, 3], [5, 7],   // top girders (4-7)
  ];

  // Supports: base nodes fixed
  nodeInputs.val = {
    supports: new Map([
      [0, [true, true, true, true, true, true]],
      [2, [true, true, true, true, true, true]],
      [4, [true, true, true, true, true, true]],
      [6, [true, true, true, true, true, true]],
    ]),
    loads: new Map([[3, [10, 0, 0, 0, 0, 0]]]), // F(t) at node 3, direction 3→7 (+X)
  };

  // Element properties: columns (0-3) vs girders (4-9)
  const eMap = (colVal: number, girVal: number) =>
    new Map(elements.val.map((_, i) => [i, i < 4 ? colVal : girVal]));

  // IMPORTANT: local axes are CSI convention. For vertical columns (n≈1):
  //   local x = Z (along element), local 2 = +X global, local 3 = +Y global
  //   → I33 (momentsOfInertiaZ) governs X-sway, I22 (momentsOfInertiaY) Y-sway
  // For standard W-section orientation (strong axis resists X-sway):
  //   momentsOfInertiaZ = AISC Ix (strong axis)
  //   momentsOfInertiaY = AISC Iy (weak axis)
  elementInputs.val = {
    elasticities:      eMap(E, E),
    shearModuli:       eMap(G, G),
    areas:             eMap(COL_A, GIR_A),
    momentsOfInertiaY: eMap(COL_Iy, GIR_Iy),  // weak axis → I22
    momentsOfInertiaZ: eMap(COL_Iz, GIR_Iz),  // strong axis → I33
    torsionalConstants: eMap(COL_J, GIR_J),
    densities:         new Map(elements.val.map((_, i) => [i, RHO_STEEL])),
  };

  // Static analysis
  deformOutputs.val = deform(nodes.val, elements.val, nodeInputs.val, elementInputs.val);
  analyzeOutputs.val = analyze(nodes.val, elements.val, elementInputs.val, deformOutputs.val);

  // Modal analysis
  const modalOut: ModalOutputs = modalAnalysis(
    nodes.val, elements.val, nodeInputs.val, elementInputs.val, NUM_MODES
  );

  // Display modal results in UI
  modalPanel.render(modalOut, {
    title: "Example 6.3 Space Frame",
    properties: [
      `E=${E} ksi, G=${G.toFixed(0)} ksi, ρ=${RHO_STEEL.toExponential(3)} kip·s²/in⁴`,
      `Cols: W24x146 (A=${COL_A}, Iz=${COL_Iz}, Iy=${COL_Iy}, J=${COL_J})`,
      `Girs: W14x84  (A=${GIR_A}, Iz=${GIR_Iz}, Iy=${GIR_Iy}, J=${GIR_J})`,
    ],
  });
});

// Build UI
document.body.append(
  getCad3d({
    nodes,
    elements,
    nodeInputs,
    elementInputs,
    deformOutputs,
    analyzeOutputs,
  }),
  getParameters(parameters),
  getViewer({
    mesh: {
      nodes,
      elements,
      nodeInputs,
      elementInputs,
      deformOutputs,
      analyzeOutputs,
    },
    settingsObj: {
      deformedShape: true,
      gridSize: 300,  // model spans ~240 in, need larger grid
    },
  }),
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/beams/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/",
  })
);
document.body.appendChild(modalPanel.div);

// Auto-start with Edificio example and hide modal panel
setTimeout(() => {
  const btn = document.querySelector('[data-ex="edificio"]') as HTMLElement;
  if (btn) btn.click();
  // Hide the modal analysis panel (Example 6.3 is not the default anymore)
  if (modalPanel.div) modalPanel.div.style.display = "none";
}, 200);
