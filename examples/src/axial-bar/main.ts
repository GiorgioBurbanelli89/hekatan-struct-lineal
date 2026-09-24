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

// ============================================================================
// Verificacion: Barra Axial Simple
// Comprobamos que K = EA/L · [1,-1;-1,1] produce u = FL/(EA)
//
// Barra de 6 m (3 elementos de 2 m), fuerza axial en extremo libre
// E = 200 GPa = 200e6 kN/m², A = 0.01 m², F = 100 kN
// u_analitico = FL/(EA) = 100 × 6 / (200e6 × 0.01) = 0.0003 m
// ============================================================================

const parameters: Parameters = {
  E_gpa: {
    value: van.state(200),
    min: 10,
    max: 400,
    step: 10,
    label: "E (GPa)",
  },
  A_cm2: {
    value: van.state(100),
    min: 10,
    max: 500,
    step: 10,
    label: "A (cm²)",
  },
  L_m: {
    value: van.state(6),
    min: 1,
    max: 20,
    step: 0.5,
    label: "L total (m)",
  },
  F_kN: {
    value: van.state(100),
    min: 10,
    max: 1000,
    step: 10,
    label: "F (kN)",
  },
  nElem: {
    value: van.state(3),
    min: 1,
    max: 10,
    step: 1,
    label: "Num elementos",
  },
};

const nodesState: State<Node[]> = van.state([]);
const elementsState: State<Element[]> = van.state([]);
const nodeInputsState: State<NodeInputs> = van.state({});
const elementInputsState: State<ElementInputs> = van.state({});
const deformOutputsState: State<DeformOutputs> = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

// Resultados panel
const resultsDiv = document.createElement("div");
resultsDiv.style.cssText =
  "position:fixed;bottom:10px;left:10px;background:#1a1a2e;color:#eee;" +
  "padding:16px 24px;border-radius:8px;font-family:monospace;font-size:14px;" +
  "z-index:999;max-width:600px;line-height:1.6;box-shadow:0 4px 20px rgba(0,0,0,0.5);";

van.derive(() => {
  const E = parameters.E_gpa.value.val * 1e6; // GPa -> kN/m²
  const A = parameters.A_cm2.value.val * 1e-4; // cm² -> m²
  const L = parameters.L_m.value.val;
  const F = parameters.F_kN.value.val;
  const nElem = parameters.nElem.value.val;

  // Crear nodos y elementos
  const nodes: Node[] = [];
  const elements: Element[] = [];
  const dL = L / nElem;

  for (let i = 0; i <= nElem; i++) {
    nodes.push([dL * i, 0, 0]);
  }
  for (let i = 0; i < nElem; i++) {
    elements.push([i, i + 1]);
  }

  // Apoyos y cargas
  const nodeInputs: NodeInputs = {
    supports: new Map([[0, [true, true, true, true, true, true]]]),
    loads: new Map([[nElem, [F, 0, 0, 0, 0, 0]]]), // fuerza axial en X
  };

  // Propiedades: frame con Iz,Iy pequeños (solo axial importa)
  const Iz = A * A * 0.001; // muy pequeno
  const Iy = A * A * 0.001;
  const G = E / 2.6;
  const J = Iz + Iy;
  const elementInputs: ElementInputs = {
    elasticities: new Map(elements.map((_, i) => [i, E])),
    areas: new Map(elements.map((_, i) => [i, A])),
    momentsOfInertiaY: new Map(elements.map((_, i) => [i, Iz])),
    momentsOfInertiaZ: new Map(elements.map((_, i) => [i, Iy])),
    shearModuli: new Map(elements.map((_, i) => [i, G])),
    torsionalConstants: new Map(elements.map((_, i) => [i, J])),
  };

  // Resolver
  const deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
  const analyzeOutputs = analyze(
    nodes,
    elements,
    elementInputs,
    deformOutputs
  );

  // Actualizar estados
  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;

  // ─── Mostrar resultados numéricos ───
  const u_analitico = (F * L) / (E * A);
  const k_elem = (E * A) / (L / nElem);

  // Desplazamiento del nodo final (DOF 0 = X)
  const defMap = deformOutputs.deformations;
  let u_fem = 0;
  if (defMap) {
    const lastNodeDef = defMap.get(nElem);
    if (lastNodeDef) u_fem = lastNodeDef[0]; // DOF X
  }

  const error = Math.abs(u_fem - u_analitico);
  const errorPct = u_analitico !== 0 ? (error / u_analitico) * 100 : 0;

  // Reacciones en nodo 0
  const reactions = deformOutputs.reactions;
  let R_x = 0;
  if (reactions) {
    const r0 = reactions.get(0);
    if (r0) R_x = r0[0];
  }

  resultsDiv.innerHTML = `
    <div style="color:#64b5f6;font-size:16px;font-weight:bold;margin-bottom:8px;">
      ═══ VERIFICACION BARRA AXIAL ═══
    </div>
    <div style="color:#aaa;">Datos:</div>
    <div>  E = ${(E).toExponential(2)} kN/m²  (${parameters.E_gpa.value.val} GPa)</div>
    <div>  A = ${A.toFixed(6)} m²  (${parameters.A_cm2.value.val} cm²)</div>
    <div>  L = ${L} m  (${nElem} elem × ${dL.toFixed(2)} m)</div>
    <div>  F = ${F} kN</div>
    <br/>
    <div style="color:#aaa;">Rigidez por elemento:</div>
    <div>  k = EA/L = ${k_elem.toFixed(2)} kN/m</div>
    <br/>
    <div style="color:#81c784;">Resultado analitico:</div>
    <div>  u = FL/(EA) = <b>${u_analitico.toExponential(6)}</b> m</div>
    <br/>
    <div style="color:#ffb74d;">Resultado FEM:</div>
    <div>  u = <b>${u_fem.toExponential(6)}</b> m</div>
    <br/>
    <div style="color:${errorPct < 0.01 ? '#4caf50' : '#f44336'};">
      Error: ${error.toExponential(3)} m  (${errorPct.toFixed(6)}%)
      ${errorPct < 0.01 ? ' ✓ EXACTO' : ''}
    </div>
    <div style="color:#aaa;margin-top:4px;">
      Reaccion nodo 0: R_x = ${R_x.toFixed(4)} kN  (debe ser -${F} kN)
    </div>
    <br/>
    <div style="color:#aaa;font-size:11px;">
      Desplazamientos todos los nodos:
    </div>
    ${Array.from({ length: nElem + 1 }, (_, i) => {
      const d = defMap?.get(i);
      const ux = d ? d[0] : 0;
      const u_exact_i = (F * dL * i) / (E * A); // desplazamiento exacto en nodo i
      return `<div style="font-size:11px;">  nodo ${i}: u_x = ${ux.toExponential(4)} m  (exacto: ${u_exact_i.toExponential(4)})</div>`;
    }).join("")}
  `;
});

document.body.append(resultsDiv);

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
    settingsObj: {
      deformedShape: true,
      nodesIndexes: true,
    },
  }),
  getToolbar({
    sourceCode: "#",
    author: "Verificacion K = EA/L [1,-1;-1,1]",
  })
);
