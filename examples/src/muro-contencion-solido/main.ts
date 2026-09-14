/**
 * Muro de contención en VOLADIZO con SÓLIDOS H8 — validado contra SAP2000.
 *
 * La misma malla (examples/src/muro-contencion-solido/malla.ts) se arma en
 * SAP2000 por OAPI (galpon-bodega-electoral/sap_h8_modelo.py) con los mismos
 * apoyos y las mismas cargas nodales, y se carea nudo a nudo en
 * tests/casos/muro_contencion_solido_sap2000.mjs. El H8 lleva los modos
 * incompatibles de flexión de Wilson–Taylor, que es lo que SAP2000 trae por
 * defecto en sus sólidos (2-sep-2026).
 *
 * Empuje activo de Rankine p = Ka·(γ·z + q0) sobre la cara trasera del alzado,
 * base de la zapata fija. Lo que se ve: la deformada del muro y el colormap de
 * tensiones del sólido (σxx / σzz / vonMises, con planos de corte).
 */
import van, { State } from "vanjs-core";
import { Pane } from "tweakpane";
import {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { hex8Solve } from "../solid-cube-fem/h8";
import { mallaMuroSolido, MURO_SOLIDO_DEFAULT } from "./malla";
import {
  getToolbar, getParameters, Parameters, getViewer,
  colorMapStressUnit, colorMapDispUnit, enableDraggableAllPanes,
} from "hekatan-ui";

const D = MURO_SOLIDO_DEFAULT;
const parameters: Parameters = {
  H:     { value: van.state(D.H),     min: 1,   max: 10,  step: 0.2,  label: "H alzado (m)" },
  t:     { value: van.state(D.t),     min: 0.2, max: 1.0, step: 0.1,  label: "t alzado en la base (m)" },
  tTop:  { value: van.state(D.t),     min: 0.1, max: 1.0, step: 0.05, label: "t coronación (m) — menor = pantalla inclinada" },
  toe:   { value: van.state(D.toe),   min: 0.2, max: 3,   step: 0.1,  label: "puntera (m)" },
  heel:  { value: van.state(D.heel),  min: 0.2, max: 5,   step: 0.1,  label: "talón (m)" },
  tf:    { value: van.state(D.tf),    min: 0.2, max: 1.0, step: 0.1,  label: "canto zapata (m)" },
  L:     { value: van.state(D.L),     min: 0.2, max: 5,   step: 0.2,  label: "longitud L (m)" },
  ms:    { value: van.state(D.ms),    min: 0.1, max: 0.5, step: 0.05, label: "malla (m)" },
  E:     { value: van.state(D.E),     min: 1e7, max: 4e7, step: 1e6,  label: "E hormigón (kN/m²)" },
  nu:    { value: van.state(D.nu),    min: 0.1, max: 0.3, step: 0.01, label: "ν" },
  Ka:    { value: van.state(D.Ka),    min: 0.2, max: 0.6, step: 0.01, label: "Ka (Rankine)" },
  gamma: { value: van.state(D.gamma), min: 14,  max: 22,  step: 0.5,  label: "γ relleno (kN/m³)" },
  q0:    { value: van.state(D.q0),    min: 0,   max: 50,  step: 1,    label: "sobrecarga q0 (kN/m²)" },
  gammaC: { value: van.state(24),    min: 0,   max: 26,  step: 1,    label: "peso propio γc (kN/m³, 0 = sin)" },
  relleno: { value: van.state(1),    min: 0,   max: 1,   step: 1,    label: "relleno sobre el talón (γ·H + q0)" },
  incompatible: { value: van.state(1), min: 0, max: 1, step: 1, label: "modos incompatibles (1 = SAP2000)" },
  campo: { value: van.state(0), min: 0, max: 2, step: 1, label: "color: 0 σxx · 1 σzz · 2 vonMises" },
};

const nodesState: State<Node[]> = van.state([]);
const elementsState: State<Element[]> = van.state([]);
const nodeInputsState: State<NodeInputs> = van.state({});
const elementInputsState: State<ElementInputs> = van.state({});
const deformOutputsState: State<DeformOutputs> = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});
const benchValues: State<{ N: number; nElems: number; nDOF: number; empuje: number; ux_top: number; sig_min: number; sig_max: number; elapsed: number }> =
  van.state({ N: 0, nElems: 0, nDOF: 0, empuje: 0, ux_top: 0, sig_min: 0, sig_max: 0, elapsed: 0 });

van.derive(() => {
  const p = {
    H: parameters.H.value.val, t: parameters.t.value.val, tTop: parameters.tTop.value.val, toe: parameters.toe.value.val, heel: parameters.heel.value.val,
    tf: parameters.tf.value.val, L: parameters.L.value.val, ms: parameters.ms.value.val, E: parameters.E.value.val,
    nu: parameters.nu.value.val, Ka: parameters.Ka.value.val, gamma: parameters.gamma.value.val, q0: parameters.q0.value.val,
    gammaC: parameters.gammaC.value.val, relleno: parameters.relleno.value.val,
  };
  const incompatible = Math.round(parameters.incompatible.value.val) === 1;
  const campo = Math.round(parameters.campo.value.val);
  const m = mallaMuroSolido(p);
  const N = m.nodes.length;
  let result: ReturnType<typeof hex8Solve> | null = null;
  try {
    result = hex8Solve({ nodes: m.nodes, elements: m.elements, E: p.E, nu: p.nu, supports: m.supports, loads: m.loads, incompatible });
  } catch (e: any) { console.warn("muro solido H8:", e?.message ?? e); }

  // Visualización: las 6 caras de cada hexaedro como Q4 finos (el visor pinta shells)
  const visualNodes: Node[] = m.nodes.map(q => [q[0], q[1], q[2]] as Node);
  const visualElements: Element[] = [];
  const faceElem: number[] = [];
  const ei: any = { elasticities: new Map(), poissonsRatios: new Map(), thicknesses: new Map(), shearModuli: new Map(), densities: new Map(),
                    areas: new Map(), momentsOfInertiaZ: new Map(), momentsOfInertiaY: new Map(), torsionalConstants: new Map() };
  const cara = (a: number, b: number, c: number, d: number, e: number) => {
    visualElements.push([a, b, c, d]); faceElem.push(e);
    const i = visualElements.length - 1;
    ei.elasticities.set(i, p.E); ei.poissonsRatios.set(i, p.nu); ei.thicknesses.set(i, 0.001); ei.shearModuli.set(i, p.E / (2 * (1 + p.nu)));
    ei.densities.set(i, 0); ei.areas.set(i, 0); ei.momentsOfInertiaZ.set(i, 0); ei.momentsOfInertiaY.set(i, 0); ei.torsionalConstants.set(i, 0);
  };
  m.elements.forEach((h, e) => {
    cara(h[0], h[1], h[2], h[3], e); cara(h[4], h[5], h[6], h[7], e);
    cara(h[0], h[1], h[5], h[4], e); cara(h[1], h[2], h[6], h[5], e); cara(h[2], h[3], h[7], h[6], e); cara(h[3], h[0], h[4], h[7], e);
  });

  const deformOutputs: DeformOutputs = { deformations: new Map() };
  if (result) result.displacements.forEach(([ux, uy, uz], n) => deformOutputs.deformations.set(n, [ux, uy, uz, 0, 0, 0]));

  // colormap: promedio nodal de la componente elegida (σxx, σzz o vonMises)
  const analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
  let sigMin = 0, sigMax = 0;
  if (result) {
    const acc = new Map<number, { s: number; n: number }>();
    m.elements.forEach((h, e) => {
      const st = result!.stressPerElement.get(e) || []; const vm = result!.vonMisesPerElement.get(e) || [];
      let v = 0, c = 0;
      if (campo === 2) { for (const x of vm) { v += x; c++; } }
      else { for (const sig of st) { v += sig[campo === 0 ? 0 : 2]; c++; } }
      v = c ? v / c : 0;
      for (const nid of h) { const cur = acc.get(nid) ?? { s: 0, n: 0 }; cur.s += v; cur.n++; acc.set(nid, cur); }
    });
    const porCara = new Map<number, [number, number, number, number]>();
    visualElements.forEach((f, i) => {
      const vals = f.map(nid => { const cur = acc.get(nid); return cur ? cur.s / cur.n : 0; }) as [number, number, number, number];
      porCara.set(i, vals);
      for (const v of vals) { if (v < sigMin) sigMin = v; if (v > sigMax) sigMax = v; }
    });
    (analyzeOutputs as any).vonMises = porCara;
  }
  void faceElem;

  const visualSupports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  m.supports.forEach((v, id) => visualSupports.set(id, [v[0], v[1], v[2], true, true, true]));
  const visualLoads = new Map<number, [number, number, number, number, number, number]>();
  m.loads.forEach((v, id) => visualLoads.set(id, [v[0], v[1], v[2], 0, 0, 0]));

  const uxTop = result ? (result.displacements.get(m.nudoCoronacion)?.[0] ?? 0) : 0;
  benchValues.val = { N, nElems: m.elements.length, nDOF: 3 * N, empuje: m.info.empujeTotal, ux_top: uxTop, sig_min: sigMin, sig_max: sigMax, elapsed: result?.elapsedMs ?? 0 };
  nodesState.val = visualNodes; elementsState.val = visualElements;
  nodeInputsState.val = { supports: visualSupports, loads: visualLoads }; elementInputsState.val = ei;
  deformOutputsState.val = deformOutputs; analyzeOutputsState.val = analyzeOutputs;
});

const viewerEl = getViewer({
  mesh: { nodes: nodesState, elements: elementsState, nodeInputs: nodeInputsState, elementInputs: elementInputsState, deformOutputs: deformOutputsState, analyzeOutputs: analyzeOutputsState },
  settingsObj: { deformedShape: true, solidResults: "vonMises", shellResults: "none", gridSize: 6, deformScale: 200, custom3D: false, loads: true, supports: true, nodes: false, showCotas: false, displayScale: 0.3 },
});

const benchContainer = document.createElement("div");
benchContainer.style.cssText = "position:fixed;top:8px;right:8px;width:330px;max-height:90vh;overflow-y:auto;z-index:999;";
const benchPane = new Pane({ title: "🧱 Muro de contención en sólidos H8 (vs SAP2000)", container: benchContainer, expanded: true });
(window as any).__hekatanPanes = (window as any).__hekatanPanes ?? []; (window as any).__hekatanPanes.push(benchPane);
const benchObj = { N: 0, nElems: 0, nDOF: 0, empuje: 0, ux_top: 0, sig_min: 0, sig_max: 0, elapsed: 0 };
const fStats = benchPane.addFolder({ title: "Malla H8" });
fStats.addBinding(benchObj, "N", { readonly: true, label: "Nudos", format: (v: number) => v.toFixed(0) });
fStats.addBinding(benchObj, "nElems", { readonly: true, label: "Hexaedros", format: (v: number) => v.toFixed(0) });
fStats.addBinding(benchObj, "nDOF", { readonly: true, label: "GDL", format: (v: number) => v.toFixed(0) });
fStats.addBinding(benchObj, "elapsed", { readonly: true, label: "solve (ms)", format: (v: number) => v.toFixed(0) });
const fRes = benchPane.addFolder({ title: "Resultados" });
fRes.addBinding(benchObj, "empuje", { readonly: true, label: "Empuje total (kN)", format: (v: number) => v.toFixed(2) });
fRes.addBinding(benchObj, "ux_top", { readonly: true, label: "u_x coronación (m)", format: (v: number) => v.toExponential(4) });
fRes.addBinding(benchObj, "sig_min", { readonly: true, label: "σ min (kN/m²)", format: (v: number) => v.toFixed(1) });
fRes.addBinding(benchObj, "sig_max", { readonly: true, label: "σ max (kN/m²)", format: (v: number) => v.toFixed(1) });
const fU = benchPane.addFolder({ title: "Unidades", expanded: false });
const unitsObj = { stress: colorMapStressUnit.val, disp: colorMapDispUnit.val };
fU.addBinding(unitsObj, "stress", { options: { "kN/m²": "kN/m²", "kPa": "kPa", "MPa": "MPa", "kgf/cm²": "kgf/cm²", "tonf/m²": "tonf/m²" }, label: "Tensión" }).on("change", (e: any) => { colorMapStressUnit.val = e.value; });
fU.addBinding(unitsObj, "disp", { options: { m: "m", cm: "cm", mm: "mm" }, label: "Desplaz." }).on("change", (e: any) => { colorMapDispUnit.val = e.value; });
document.body.append(benchContainer);
van.derive(() => { Object.assign(benchObj, benchValues.val); benchPane.refresh(); });

document.body.append(getParameters(parameters), viewerEl,
  getToolbar({ sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/muro-contencion-solido/main.ts" }));
setTimeout(() => enableDraggableAllPanes(), 200);
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (ctx?.camera && ctx?.controls) { ctx.camera.up.set(0, 0, 1); ctx.camera.position.set(7, -8, 5); ctx.controls.target.set(1.3, 0.5, 2.2); ctx.controls.update(); ctx.render?.(); }
}, 800);
