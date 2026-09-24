/**
 * Viga cantilever discretizada con shells Q4.
 *
 * Placa vertical en plano X-Z empotrada en x=0, carga puntual en la
 * punta a media altura (downward Z). Comparación con flexión analítica
 * Euler-Bernoulli: δ = P·L³/(3·E·I) con I = t·h³/12.
 *
 * Patron de ejemplo con panel propio: todo en main.ts.
 * Portado desde FEM Studio `generateCantileverBeamQ4()` en getCad3d.ts (líneas 10530-10594).
 */
import van, { State } from "vanjs-core";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import { getToolbar, getParameters, Parameters, getViewer } from "hekatan-ui";

const parameters: Parameters = {
  L:  { value: van.state(6),    min: 1,    max: 20,   step: 0.5,  label: "Luz L (m)" },
  h:  { value: van.state(0.5),  min: 0.1,  max: 2,    step: 0.05, label: "Altura h (m)" },
  t:  { value: van.state(0.2),  min: 0.05, max: 0.6,  step: 0.05, label: "Espesor t (m)" },
  nx: { value: van.state(12),   min: 4,    max: 30,   step: 1,    label: "Mesh nx" },
  ny: { value: van.state(4),    min: 2,    max: 12,   step: 1,    label: "Mesh ny" },
  E:  { value: van.state(25e6), min: 10e6, max: 50e6, step: 1e6,  label: "E (kN/m²)" },
  nu: { value: van.state(0.2),  min: 0.0,  max: 0.49, step: 0.05, label: "ν" },
  P:  { value: van.state(50),   min: 0,    max: 500,  step: 10,   label: "Carga punta (kN)" },
};

const nodesState: State<Node[]>                  = van.state([]);
const elementsState: State<Element[]>            = van.state([]);
const nodeInputsState: State<NodeInputs>         = van.state({});
const elementInputsState: State<ElementInputs>   = van.state({});
const deformOutputsState: State<DeformOutputs>   = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});

// ── Estado live del benchmark: valores numéricos comparados ──
const benchValues: State<{
  uz_an: number; uz_he: number; ratio: number; errPct: number;
  I_beam: number; sigma_max: number;
}> = van.state({ uz_an: 0, uz_he: 0, ratio: 0, errPct: 0, I_beam: 0, sigma_max: 0 });

van.derive(() => {
  const L = parameters.L.value.val;
  const h = parameters.h.value.val;
  const t = parameters.t.value.val;
  const nx = Math.round(parameters.nx.value.val);
  const ny = Math.round(parameters.ny.value.val);
  const E = parameters.E.value.val;
  const nu = parameters.nu.value.val;
  const P = parameters.P.value.val;
  const G = E / (2 * (1 + nu));
  const dx = L / nx;
  const dy = h / ny;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Plano X-Z (Y=0): viga horizontal con altura en Z
  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++)
      nodes.push([i * dx, 0, j * dy]);

  const nNx = nx + 1;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++)
      elements.push([j * nNx + i, j * nNx + i + 1, (j + 1) * nNx + i + 1, (j + 1) * nNx + i]);

  // Empotramiento en borde izquierdo
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let j = 0; j <= ny; j++) supports.set(j * nNx, [true, true, true, true, true, true]);

  // Carga puntual en la punta a media altura
  const tipMid = Math.floor(ny / 2) * nNx + nx;
  const loads = new Map<number, [number, number, number, number, number, number]>();
  loads.set(tipMid, [0, 0, -P, 0, 0, 0]);

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
    const tipDef = deformOutputs.deformations.get(tipMid);
    const uz = tipDef ? tipDef[2] : 0;
    const I_beam = (t * h * h * h) / 12;
    const delta_ana = (P * L * L * L) / (3 * E * I_beam);
    const ratio = Math.abs(uz) / delta_ana;
    const errPct = Math.abs(ratio - 1) * 100;
    // Tensión flexional máxima en empotramiento: σ = M·c/I = P·L·(h/2)/I
    const sigma_max = (P * L * (h / 2)) / I_beam;
    console.log(
      `Viga Q4: Uz_tip=${uz.toExponential(4)} | Analítico=${delta_ana.toExponential(4)} | ratio=${ratio.toFixed(4)}`,
    );
    benchValues.val = {
      uz_an: -delta_ana, uz_he: uz, ratio,
      errPct, I_beam, sigma_max,
    };
  } catch (e: any) {
    console.warn("Viga Q4 deform/analyze:", e?.message ?? e);
  }

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
});

// ── Panel BENCHMARK con valores numéricos LIVE (Hekatan vs Euler-Bernoulli) ──
const benchmarkPanel = document.createElement("div");
benchmarkPanel.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:320px;max-width:400px;";
van.derive(() => {
  const v = benchValues.val;
  // "ERROR ACEPTABLE" = Δ entre 1-5% (típico Q4 con shear locking moderado)
  const status = v.errPct < 1 ? '<span style="color:#7eff7e">✓ PASA (Δ&lt;1%)</span>'
               : v.errPct < 5 ? '<span style="color:#ffcc00">⚠ ERROR ACEPTABLE (1-5%, shear locking)</span>'
               : '<span style="color:#ff5555">✗ FALLA (Δ&gt;5%)</span>';
  benchmarkPanel.innerHTML = `
    <div style="font-weight:bold;color:#ffaa00;margin-bottom:6px;">🧪 BENCHMARK — cantilever-beam-q4</div>
    <table style="border-collapse:collapse;width:100%;">
      <tr style="color:#999;border-bottom:1px solid #444;">
        <td style="padding:2px 6px 2px 0;">Magnitud</td>
        <td style="padding:2px 6px;text-align:right;">Euler-Bern.</td>
        <td style="padding:2px 0;text-align:right;">Hekatan Q4</td>
      </tr>
      <tr><td style="padding:1px 6px 1px 0;">u_z punta (m)</td>
          <td style="text-align:right;padding:1px 6px;">${v.uz_an.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${v.uz_he.toExponential(3)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">I = t·h³/12 (m⁴)</td>
          <td colspan="2" style="text-align:right;padding:1px 0;">${v.I_beam.toExponential(3)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">σ_max = M·c/I (kN/m²)</td>
          <td colspan="2" style="text-align:right;padding:1px 0;">${v.sigma_max.toExponential(3)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">ratio Hek/Anal</td>
          <td colspan="2" style="text-align:right;padding:1px 0;">${v.ratio.toFixed(4)}</td></tr>
    </table>
    <div style="margin-top:6px;padding-top:4px;border-top:1px solid #444;">
      <div>Δ error = <b>${v.errPct.toFixed(2)}%</b> ${status}</div>
      <div style="color:#888;font-size:10px;">δ = P·L³/(3·E·I) (flexión pura)</div>
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
      "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/cantilever-beam-q4/main.ts",
  }),
);

// La pieza vive en el plano XZ y el visor arranca en planta (XY): se veia como una RAYA
// (revision por fotogramas, 23-sep-2026). Se encuadra de frente, desde -Y, al centro del modelo.
setTimeout(() => {
  const v: any = [...document.body.querySelectorAll("*")].find((e: any) => e.__ctx);
  const ctx = v?.__ctx; const ns = nodesState.val;
  if (!ctx?.camera || !ns?.length) return;
  const xs = ns.map((n) => n[0]), zs = ns.map((n) => n[2]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cz = (Math.min(...zs) + Math.max(...zs)) / 2;
  const L = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs), 1);
  ctx.camera.up?.set(0, 0, 1);
  ctx.camera.position.set(cx + 0.35 * L, -1.4 * L, cz + 0.45 * L);
  ctx.controls?.target?.set(cx, 0, cz); ctx.controls?.update?.(); ctx.render?.();
}, 400);
