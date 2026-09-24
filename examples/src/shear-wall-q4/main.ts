/**
 * Muro de corte cantilever discretizado con shells Q4.
 * Validación cruzada vs OpenSees / SAP2000 / ETABS.
 *
 * Empotrado en la base, cargado lateralmente en la fila superior.
 * Material: hormigón armado (E=25 GPa, t=20 cm).
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateShearWallQ4()` en getCad3d.ts (líneas 10466-10527).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const parameters: Parameters = {
  W:  { value: van.state(5),    min: 1,    max: 15,   step: 0.5,  label: "Ancho W (m)" },
  H:  { value: van.state(3),    min: 1,    max: 12,   step: 0.5,  label: "Altura H (m)" },
  t:  { value: van.state(0.2),  min: 0.05, max: 0.6,  step: 0.05, label: "Espesor t (m)" },
  nx: { value: van.state(8),    min: 2,    max: 24,   step: 1,    label: "Mesh nx" },
  ny: { value: van.state(6),    min: 2,    max: 24,   step: 1,    label: "Mesh ny" },
  E:  { value: van.state(25e6), min: 10e6, max: 50e6, step: 1e6,  label: "E (kN/m²)" },
  nu: { value: van.state(0.2),  min: 0.0,  max: 0.49, step: 0.05, label: "ν (Poisson)" },
  P:  { value: van.state(100),  min: 0,    max: 1000, step: 10,   label: "Carga lateral total (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

// ── Live benchmark: Hekatan vs OpenSees / SAP2000 / ETABS ──
// Valores de referencia para H=3m, W=5m, t=0.2m, E=25GPa, ν=0.2, P=100kN
const REF_OPENSEES = 4.602e-5;
const REF_SAP2000  = 4.629e-5;
const REF_ETABS    = 4.582e-5;
const benchValues: State<{
  ux_he: number;
  errOS: number; errSAP: number; errETABS: number;
}> = van.state({ ux_he: 0, errOS: 0, errSAP: 0, errETABS: 0 });

van.derive(() => {
  const W = parameters.W.value.val;
  const H = parameters.H.value.val;
  const t = parameters.t.value.val;
  const nx = Math.round(parameters.nx.value.val);
  const ny = Math.round(parameters.ny.value.val);
  const E = parameters.E.value.val;
  const nu = parameters.nu.value.val;
  const P = parameters.P.value.val;
  const G = E / (2 * (1 + nu));
  const dx = W / nx;
  const dz = H / ny;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++)
      nodes.push([i * dx, 0, j * dz]);

  const nNx = nx + 1;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++)
      elements.push([j * nNx + i, j * nNx + i + 1, (j + 1) * nNx + i + 1, (j + 1) * nNx + i]);

  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let i = 0; i <= nx; i++) supports.set(i, [true, true, true, true, true, true]);

  const topNodes: number[] = [];
  for (let i = 0; i <= nx; i++) topNodes.push(ny * nNx + i);
  const pn = P / topNodes.length;
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (const n of topNodes) loads.set(n, [pn, 0, 0, 0, 0, 0]);

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities:   new Map(elements.map((_, i) => [i, E])),
    poissonsRatios: new Map(elements.map((_, i) => [i, nu])),
    thicknesses:    new Map(elements.map((_, i) => [i, t])),
    shearModuli:    new Map(elements.map((_, i) => [i, G])),
    densities:      new Map(elements.map((_, i) => [i, 24 / 9.80665])),
  };

  let deformOutputs: DeformOutputs = {} as DeformOutputs;
  let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  try {
    deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
    analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    const topCenter = ny * nNx + Math.floor(nx / 2);
    const def = deformOutputs.deformations.get(topCenter);
    const ux = def ? def[0] : 0;
    const uxAbs = Math.abs(ux);
    const errOS    = Math.abs(uxAbs - REF_OPENSEES) / REF_OPENSEES * 100;
    const errSAP   = Math.abs(uxAbs - REF_SAP2000)  / REF_SAP2000  * 100;
    const errETABS = Math.abs(uxAbs - REF_ETABS)    / REF_ETABS    * 100;
    console.log(`Muro Q4: Ux=${ux.toExponential(4)} m | OS:${REF_OPENSEES.toExponential(3)} | SAP:${REF_SAP2000.toExponential(3)} | ETABS:${REF_ETABS.toExponential(3)}`);
    benchValues.val = { ux_he: uxAbs, errOS, errSAP, errETABS };
  } catch (e: any) {
    console.warn("Muro Q4 deform/analyze:", e?.message ?? e);
  }

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
});

// ── Panel BENCHMARK con valores numéricos LIVE (Hekatan vs OpenSees/SAP/ETABS) ──
const benchmarkPanel = document.createElement("div");
benchmarkPanel.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:340px;max-width:420px;";
const fmt = (e: number) => {
  if (e < 0.5) return `<span style="color:#7eff7e">✓ ${e.toFixed(2)}%</span>`;
  if (e < 5)   return `<span style="color:#ffcc00">⚠ ${e.toFixed(2)}%</span>`;
  return `<span style="color:#ff5555">✗ ${e.toFixed(2)}%</span>`;
};
van.derive(() => {
  const v = benchValues.val;
  const maxErr = Math.max(v.errOS, v.errSAP, v.errETABS);
  // "ERROR ACEPTABLE" = label de tolerancia 0.5-5% (no es un software).
  const overallStatus = maxErr < 0.5 ? '<span style="color:#7eff7e">✓ TODOS PASAN</span>'
                       : maxErr < 5  ? '<span style="color:#ffcc00">⚠ ERROR ACEPTABLE (0.5-5%)</span>'
                       : '<span style="color:#ff5555">✗ ALGUNO FALLA</span>';
  benchmarkPanel.innerHTML = `
    <div style="font-weight:bold;color:#ffaa00;margin-bottom:6px;">🧪 BENCHMARK — shear-wall-q4</div>
    <div style="font-size:10px;color:#aaa;margin-bottom:4px;">Hekatan Q4 |Ux| top center = <b>${v.ux_he.toExponential(4)} m</b></div>
    <table style="border-collapse:collapse;width:100%;">
      <tr style="color:#999;border-bottom:1px solid #444;">
        <td style="padding:2px 6px 2px 0;">Ref. solver</td>
        <td style="padding:2px 6px;text-align:right;">Ux ref (m)</td>
        <td style="padding:2px 0;text-align:right;">Δ%</td>
      </tr>
      <tr><td style="padding:1px 6px 1px 0;">OpenSees TCL</td>
          <td style="text-align:right;padding:1px 6px;">${REF_OPENSEES.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${fmt(v.errOS)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">SAP2000</td>
          <td style="text-align:right;padding:1px 6px;">${REF_SAP2000.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${fmt(v.errSAP)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">ETABS</td>
          <td style="text-align:right;padding:1px 6px;">${REF_ETABS.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${fmt(v.errETABS)}</td></tr>
    </table>
    <div style="margin-top:6px;padding-top:4px;border-top:1px solid #444;">
      ${overallStatus}
      <div style="color:#888;font-size:10px;">Refs: H=3m, W=5m, t=20cm, E=25GPa, ν=0.2, P=100kN</div>
    </div>
  `;
});
document.body.append(benchmarkPanel);

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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/shear-wall-q4/main.ts",
  }),
);
