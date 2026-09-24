import van, { State } from "vanjs-core";
import {
  Node,
  Element,
  NodeInputs,
  ElementInputs,
  DeformOutputs,
  AnalyzeOutputs,
  deform,
  analyze,
  getLocalStiffnessMatrix,
  getTransformationMatrix,
} from "hekatan-fem";
import { getViewer, getToolbar } from "hekatan-ui";
import { multiply, transpose, norm, subtract } from "mathjs";
import { setupElementPicker } from "./elementPicker";
import { renderFemPanel } from "./renderSteps";
import { computeBeamSteps, computeShellSteps } from "./femSteps";

// ==========================================================================
// FEM Step-by-Step Educational Example
// Simple cantilever beam (2 elements) + plate Q4 (optional)
// ==========================================================================

const E = 200e3; // MPa (steel)
const nu = 0.3;
const G = E / (2 * (1 + nu));
const A = 100; // mm^2 (10mm x 10mm)
const Iz = 833.33; // mm^4
const Iy = 833.33;
const J = 1400;
const L_SPAN = 1000; // mm

// --- Model: L-frame (2 beams) ---
const nodes: State<Node[]> = van.state([
  [0, 0, 0],       // 0 - base fixed
  [L_SPAN, 0, 0],  // 1 - mid
  [L_SPAN, 0, L_SPAN], // 2 - top free
]);

const elements: State<Element[]> = van.state([
  [0, 1], // beam 0: horizontal
  [1, 2], // beam 1: vertical
]);

const nodeInputs: State<NodeInputs> = van.state({
  supports: new Map([
    [0, [true, true, true, true, true, true] as [boolean,boolean,boolean,boolean,boolean,boolean]],
  ]),
  loads: new Map([
    [2, [10, 0, 0, 0, 0, 0] as [number,number,number,number,number,number]], // 10 kN at tip
  ]),
});

const elementInputs: State<ElementInputs> = van.state({
  elasticities: new Map([[0, E], [1, E]]),
  shearModuli: new Map([[0, G], [1, G]]),
  areas: new Map([[0, A], [1, A]]),
  momentsOfInertiaY: new Map([[0, Iz], [1, Iz]]),
  momentsOfInertiaZ: new Map([[0, Iy], [1, Iy]]),
  torsionalConstants: new Map([[0, J], [1, J]]),
});

const deformOutputs: State<DeformOutputs> = van.state({});
const analyzeOutputs: State<AnalyzeOutputs> = van.state({});

// --- Run analysis ---
van.derive(() => {
  const n = nodes.val;
  const el = elements.val;
  const ni = nodeInputs.val;
  const ei = elementInputs.val;
  if (!n.length || !el.length) return;
  deformOutputs.val = deform(n, el, ni, ei);
  analyzeOutputs.val = analyze(n, el, ei, deformOutputs.val);
});

// --- FEM Panel (right side) ---
const femPanelDiv = document.createElement("div");
femPanelDiv.id = "fem-panel";
femPanelDiv.innerHTML = `
  <div class="fem-header">
    <h2>FEM Step-by-Step</h2>
    <p>Click on an element or select below:</p>
    <div id="element-buttons" style="margin:8px 0;display:flex;gap:6px;flex-wrap:wrap"></div>
  </div>
`;

// Selected element state
const selectedElement: State<number> = van.state(-1);

van.derive(() => {
  const idx = selectedElement.val;
  if (idx < 0) return;

  const n = nodes.val;
  const el = elements.val;
  const ei = elementInputs.val;
  const ni = nodeInputs.val;
  const dOut = deformOutputs.val;
  const aOut = analyzeOutputs.val;
  if (!n.length || !el.length || !dOut?.deformations) return;

  const elmNodes = el[idx].map((e) => n[e]);
  const isBeam = elmNodes.length === 2;

  if (isBeam) {
    const steps = computeBeamSteps(idx, n, el, ei, ni, dOut, aOut);
    renderFemPanel(femPanelDiv, steps, idx, el[idx], elmNodes);
  }
  // Shell Q4 will be added when Q4 elements are in the model
});

// --- Styles ---
const style = document.createElement("style");
style.textContent = `
  body { margin: 0; font-family: 'Segoe UI', sans-serif; overflow: hidden; }

  #fem-panel {
    position: fixed;
    right: 0; top: 0;
    width: 520px; height: 100vh;
    background: #1a1a2e;
    color: #e0e0e0;
    overflow-y: auto;
    z-index: 10000;
    padding: 16px 20px;
    box-sizing: border-box;
    border-left: 3px solid #0f3460;
    font-size: 13px;
    line-height: 1.5;
    box-shadow: -4px 0 20px rgba(0,0,0,0.5);
  }
  #fem-panel h2 { color: #00d4ff; margin: 0 0 8px 0; font-size: 18px; }
  #fem-panel h3 {
    color: #e94560;
    margin: 20px 0 8px 0;
    font-size: 15px;
    border-bottom: 1px solid #333;
    padding-bottom: 4px;
    cursor: pointer;
  }
  #fem-panel h3:hover { color: #ff6b81; }
  #fem-panel .step { margin-bottom: 12px; }
  #fem-panel .step-content { padding-left: 8px; }
  #fem-panel .step-content.collapsed { display: none; }

  #fem-panel .katex-display { margin: 8px 0; overflow-x: auto; }
  #fem-panel .katex { font-size: 0.95em; }

  #fem-panel .matrix-table {
    border-collapse: collapse;
    font-family: 'Consolas', monospace;
    font-size: 11px;
    margin: 6px 0;
  }
  #fem-panel .matrix-table td {
    padding: 2px 6px;
    text-align: right;
    border: 1px solid #333;
    min-width: 60px;
  }
  #fem-panel .matrix-table td.highlight { background: #0f3460; color: #00d4ff; }
  #fem-panel .matrix-table td.zero { color: #555; }

  #fem-panel .info-box {
    background: #16213e;
    border-left: 3px solid #00d4ff;
    padding: 8px 12px;
    margin: 8px 0;
    border-radius: 0 4px 4px 0;
  }
  #fem-panel .formula { color: #ffd700; margin: 4px 0; }
  #fem-panel .value { color: #7bed9f; }
  #fem-panel .label { color: #a0a0a0; }

  #fem-panel .element-badge {
    display: inline-block;
    background: #e94560;
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-weight: bold;
    margin-right: 8px;
  }

  /* Highlight selected element in viewer */
  .selected-element { stroke: #ff0; stroke-width: 3; }

  /* Scrollbar */
  #fem-panel::-webkit-scrollbar { width: 8px; }
  #fem-panel::-webkit-scrollbar-track { background: #1a1a2e; }
  #fem-panel::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 4px; }
`;
document.head.appendChild(style);

// --- Build UI ---
const viewerEl = getViewer({
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
    gridSize: 1500,
  },
});

document.body.append(viewerEl, femPanelDiv);
document.body.append(
  getToolbar({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/fem-explained/main.ts",
  })
);

// --- Create element buttons ---
setTimeout(() => {
  const btnContainer = document.getElementById("element-buttons");
  if (btnContainer) {
    const el = elements.val;
    for (let i = 0; i < el.length; i++) {
      const btn = document.createElement("button");
      btn.textContent = `Elem ${i}`;
      btn.style.cssText = "background:#0f3460;color:#00d4ff;border:1px solid #00d4ff;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px";
      btn.addEventListener("click", () => { selectedElement.val = i; });
      btnContainer.appendChild(btn);
    }
  }

  // Setup element picker (raycaster) using __ctx
  const ctx = (viewerEl as any).__ctx;
  if (ctx) {
    setupElementPicker(ctx, nodes, elements, selectedElement);
  }
}, 500);

// Expose for debugging
(window as any)._fem = { selectedElement, nodes, elements, elementInputs, deformOutputs, analyzeOutputs };
