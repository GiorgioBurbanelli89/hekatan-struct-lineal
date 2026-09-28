/**
 * Viga cantiléver discretizada con shells Q4, en el plano X-Z.
 *
 * Placa vertical empotrada en x=0, carga puntual en la punta a media altura
 * (hacia abajo, −Z). Comparación con flexión analítica Euler-Bernoulli:
 * δ = P·L³/(3·E·I) con I = t·h³/12, y σ_max = M·c/I en el empotramiento.
 *
 * Graduado desde la página con panel propio (`cantilever-beam-q4/main.ts`,
 * hasta el 28-sep-2026): mismo modelo, mismo orden de nudos, misma llamada
 * al solver.
 */
import type { Node, Element, NodeInputs, ElementInputs } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

export interface VigaCantileverQ4Malla {
  nodes: Node[];
  elements: Element[];
  supports: NonNullable<NodeInputs["supports"]>;
  loads: NonNullable<NodeInputs["loads"]>;
  /** Nudo de la punta a media altura — donde se aplica P y se lee Uz. */
  tipMid: number;
}

/**
 * Malla pura de la viga cantiléver Q4, sin estados ni DOM — mismo orden de
 * nudos y elementos que el panel viejo (`cantilever-beam-q4/main.ts` líneas 58-75).
 */
export function mallaVigaCantileverQ4(p: Record<string, number>): VigaCantileverQ4Malla {
  const L = p.L, h = p.h;
  const nx = Math.round(p.nx), ny = Math.round(p.ny);
  const P = p.P;
  const dx = L / nx, dy = h / ny;

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

  // Empotramiento en el borde izquierdo
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (let j = 0; j <= ny; j++) supports.set(j * nNx, [true, true, true, true, true, true]);

  // Carga puntual en la punta a media altura
  const tipMid = Math.floor(ny / 2) * nNx + nx;
  const loads = new Map<number, [number, number, number, number, number, number]>();
  loads.set(tipMid, [0, 0, -P, 0, 0, 0]);

  return { nodes, elements, supports, loads, tipMid };
}

// Lo último construido, para computedLabels.
let ultimo: {
  uzAn: number; uzHe: number; ratio: number; errPct: number;
  iBeam: number; sigmaMax: number;
} | null = null;

export const cantileverBeamQ4: ExampleDef = {
  id: "cantilever-beam-q4",
  name: "Viga Cantilever Q4",
  category: "2️⃣ Shells · 🧱 Placas",
  benchmark: true,
  // El panel viejo abría sin colormap: su settingsObj solo traía `deformedShape: true`,
  // sin `shellResults` (el visor lo defaultea a "none").
  defaultShellResult: "none",
  guide: [
    "Placa vertical (plano X-Z) empotrada en x=0, carga P en la punta a media altura",
    "Uz de la punta se compara contra Euler-Bernoulli δ = P·L³/(3·E·I)",
    "σ_max = M·c/I en el empotramiento sale en «Calculados»",
  ],
  params: {
    L:  { default: 6,    min: 1,    max: 20,   step: 0.5,  label: "Luz L (m)",     folder: "Geometría" },
    h:  { default: 0.5,  min: 0.1,  max: 2,    step: 0.05, label: "Altura h (m)",  folder: "Geometría" },
    t:  { default: 0.2,  min: 0.05, max: 0.6,  step: 0.05, label: "Espesor t (m)", folder: "Sección" },
    nx: { default: 12,   min: 4,    max: 30,   step: 1,    label: "Malla nx", folder: "Malla" },
    ny: { default: 4,    min: 2,    max: 12,   step: 1,    label: "Malla ny", folder: "Malla" },
    E:  { default: 25e6, min: 10e6, max: 50e6, step: 1e6,  label: "E (kN/m²)", folder: "Material" },
    nu: { default: 0.2,  min: 0,    max: 0.49, step: 0.05, label: "ν", folder: "Material" },
    P:  { default: 50,   min: 0,    max: 500,  step: 10,   label: "Carga punta (kN)", folder: "Cargas" },
  },
  build(p: Record<string, number>, states: BuildStates) {
    const m = mallaVigaCantileverQ4(p);
    const G = p.E / (2 * (1 + p.nu));

    const nodeInputs: NodeInputs = { supports: m.supports, loads: m.loads };
    const elementInputs: ElementInputs = {
      elasticities:   new Map(m.elements.map((_, i) => [i, p.E])),
      poissonsRatios: new Map(m.elements.map((_, i) => [i, p.nu])),
      thicknesses:    new Map(m.elements.map((_, i) => [i, p.t])),
      shearModuli:    new Map(m.elements.map((_, i) => [i, G])),
      densities:      new Map(m.elements.map((_, i) => [i, 24 / 9.80665])),
    };

    states.nodes.val = m.nodes;
    states.elements.val = m.elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;

    ultimo = null;
    try {
      const dOut = deform(m.nodes, m.elements, nodeInputs, elementInputs);
      states.deformOutputs.val = dOut;
      states.analyzeOutputs.val = analyze(m.nodes, m.elements, elementInputs, dOut);
      const tipDef = dOut.deformations.get(m.tipMid);
      const uz = tipDef ? tipDef[2] : 0;
      const iBeam = (p.t * p.h * p.h * p.h) / 12;
      const deltaAna = (p.P * p.L * p.L * p.L) / (3 * p.E * iBeam);
      const ratio = Math.abs(uz) / deltaAna;
      const errPct = Math.abs(ratio - 1) * 100;
      const sigmaMax = (p.P * p.L * (p.h / 2)) / iBeam;
      ultimo = { uzAn: -deltaAna, uzHe: uz, ratio, errPct, iBeam, sigmaMax };
    } catch (e) {
      console.warn("cantilever-beam-q4 deform/analyze:", e);
    }
    states.objects3D.val = [];
  },
  computedLabels: () => {
    if (!ultimo) return { "Solver": "falló" };
    return {
      "Uz punta Hekatan Q4": `${ultimo.uzHe.toExponential(4)} m`,
      "Uz punta Euler-Bernoulli (ref.)": `${ultimo.uzAn.toExponential(4)} m`,
      "I = t·h³/12": `${ultimo.iBeam.toExponential(4)} m⁴`,
      "σ_max = M·c/I": `${ultimo.sigmaMax.toExponential(4)} kN/m²`,
      "ratio Hekatan/Analítico": ultimo.ratio.toFixed(4),
      "Δ error vs Euler-Bernoulli": `${ultimo.errPct.toFixed(2)} %`,
    };
  },
};
