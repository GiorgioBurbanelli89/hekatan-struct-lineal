/**
 * Barra axial — cadena de barras bajo carga axial en el extremo.
 *
 * Verifica K = EA/L · [1,-1;-1,1], es decir u = F·L/(E·A). Graduado desde la
 * página propia `examples/src/axial-bar/main.ts` (28-sep-2026): el modelo NO
 * cambia (mismo orden de nudos, mismos valores por defecto, misma llamada al
 * solver); lo que antes se pintaba en un `<div>` de resultados pasa a
 * `computedLabels` (folder «📊 Resultados» del workspace).
 */
import { deform, analyze, type Node, type Element, type NodeInputs, type ElementInputs } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

export interface ParamsBarraAxial {
  E_gpa: number;
  A_cm2: number;
  L_m: number;
  F_kN: number;
  nElem: number;
}

export interface MallaBarraAxial {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
}

/**
 * Malla pura: la usan el ejemplo (`build`) y su test
 * (`tests/casos/graduado_axial_bar.mjs`). Sin estados de van, sin DOM.
 */
export function mallaBarraAxial(p: ParamsBarraAxial): MallaBarraAxial {
  const E = p.E_gpa * 1e6;   // GPa -> kN/m²
  const A = p.A_cm2 * 1e-4;  // cm² -> m²
  const L = p.L_m;
  const F = p.F_kN;
  const nElem = Math.round(p.nElem);
  const dL = L / nElem;

  const nodes: Node[] = [];
  const elements: Element[] = [];
  for (let i = 0; i <= nElem; i++) nodes.push([dL * i, 0, 0]);
  for (let i = 0; i < nElem; i++) elements.push([i, i + 1]);

  const nodeInputs: NodeInputs = {
    supports: new Map([[0, [true, true, true, true, true, true]]]),
    loads: new Map([[nElem, [F, 0, 0, 0, 0, 0]]]), // fuerza axial en X
  };

  // Frame con Iz,Iy pequeños (solo axial importa) — igual que la página vieja.
  const Iz = A * A * 0.001;
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

  return { nodes, elements, nodeInputs, elementInputs };
}

export const axialBar: ExampleDef = {
  id: "axial-bar",
  name: "Barra axial",
  category: "1️⃣ Frames · 🎯 1 GDL Axial",
  benchmark: false,
  defaultShellResult: "none",
  availableShellResults: [],
  defaultFrameResult: "none",
  guide: [
    "F (kN) tira o comprime el nudo extremo; el nudo 0 queda empotrado",
    "El folder «📊 Resultados» compara el desplazamiento FEM contra δ = F·L/(E·A)",
    "La reacción en el nudo 0 tiene que salir igual y de signo contrario a F",
  ],
  params: {
    L_m:   { default: 6,   min: 1,  max: 20,  step: 0.5, label: "L total (m)",   folder: "Geometría" },
    nElem: { default: 3,   min: 1,  max: 10,  step: 1,   label: "Num elementos", folder: "Geometría" },
    E_gpa: { default: 200, min: 10, max: 400, step: 10,  label: "E (GPa)",       folder: "Material" },
    A_cm2: { default: 100, min: 10, max: 500, step: 10,  label: "A (cm²)",       folder: "Material" },
    F_kN:  { default: 100, min: 10, max: 1000, step: 10, label: "F (kN)",        folder: "Cargas" },
  },
  build(p: Record<string, number>, states: BuildStates) {
    const m = mallaBarraAxial(p as unknown as ParamsBarraAxial);
    states.nodes.val = m.nodes;
    states.elements.val = m.elements;
    states.nodeInputs.val = m.nodeInputs;
    states.elementInputs.val = m.elementInputs;
    const deformOut = deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(m.nodes, m.elements, m.elementInputs, deformOut);
    states.objects3D.val = [];
  },
  computedLabels(p: Record<string, number>, states: BuildStates) {
    const nodes = states.nodes.val ?? [];
    const defs = states.deformOutputs.val?.deformations;
    if (!nodes.length || !defs) return {};
    const nElem = nodes.length - 1;
    const E = p.E_gpa * 1e6, A = p.A_cm2 * 1e-4, L = p.L_m, F = p.F_kN;
    const dL = L / nElem;

    const u_teorico = (F * L) / (E * A);
    const u_fem = defs.get(nElem)?.[0] ?? 0;
    const error = Math.abs(u_fem - u_teorico);
    const errorPct = u_teorico !== 0 ? (error / u_teorico) * 100 : 0;
    const Rx = states.deformOutputs.val?.reactions?.get(0)?.[0] ?? 0;

    const out: Record<string, string> = {
      "δ analítico = F·L/(E·A)": `${u_teorico.toExponential(6)} m`,
      "δ FEM (nudo final)": `${u_fem.toExponential(6)} m`,
      "Error": `${error.toExponential(3)} m  (${errorPct.toFixed(6)} %)`,
      "Reacción nudo 0 (Rx)": `${Rx.toFixed(4)} kN  (debe ser ${(-F).toFixed(2)} kN)`,
    };

    // Tabla por nudo: uno por cada nudo si hay ≤ 12; si no, primero/medio/último.
    const idxs = nodes.length <= 12
      ? nodes.map((_, i) => i)
      : [0, Math.floor((nodes.length - 1) / 2), nodes.length - 1];
    for (const i of idxs) {
      const ux = defs.get(i)?.[0] ?? 0;
      const u_exacto_i = (F * dL * i) / (E * A);
      out[`ux nudo ${i}`] = `${ux.toExponential(4)} m  (exacto ${u_exacto_i.toExponential(4)})`;
    }
    return out;
  },
};
