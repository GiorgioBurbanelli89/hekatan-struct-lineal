/**
 * Muro de corte en VOLADIZO discretizado con shells Q4 — validación cruzada
 * OpenSees / SAP2000 / ETABS.
 *
 * Empotrado en la base (fila y=0), cargado lateralmente en la fila superior.
 * Material: hormigón armado (E=25 GPa, t=20 cm por defecto).
 *
 * Graduado desde la página con panel propio (`shear-wall-q4/main.ts`, hasta el
 * 28-sep-2026): mismo modelo, mismo orden de nudos, misma llamada al solver.
 * Los TRES valores de referencia (OpenSees TCL, SAP2000, ETABS) venían
 * HARD-CODEADOS en el panel viejo, para H=3m, W=5m, t=0.2m, E=25GPa, ν=0.2,
 * P=100kN (los valores por defecto) — se conservan tal cual, con su fuente.
 */
import type { Node, Element, NodeInputs, ElementInputs } from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

// Referencias del panel viejo `shear-wall-q4/main.ts` (líneas 38-40), |Ux| en el
// centro de la fila superior, en metros, para los valores por defecto de abajo.
export const REF_OPENSEES = 4.602e-5; // OpenSees TCL
export const REF_SAP2000 = 4.629e-5;  // SAP2000
export const REF_ETABS = 4.582e-5;    // ETABS

export interface MuroCorteQ4Malla {
  nodes: Node[];
  elements: Element[];
  supports: NonNullable<NodeInputs["supports"]>;
  loads: NonNullable<NodeInputs["loads"]>;
  /** Nudo del centro de la fila superior — donde se lee Ux para el benchmark. */
  topCenter: number;
}

/**
 * Malla pura del muro de corte Q4, sin estados ni DOM — mismo orden de nudos
 * y elementos que el panel viejo (`shear-wall-q4/main.ts` líneas 59-78).
 */
export function mallaMuroCorteQ4(p: Record<string, number>): MuroCorteQ4Malla {
  const W = p.W, H = p.H;
  const nx = Math.round(p.nx), ny = Math.round(p.ny);
  const P = p.P;
  const dx = W / nx, dz = H / ny;

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

  const topCenter = ny * nNx + Math.floor(nx / 2);
  return { nodes, elements, supports, loads, topCenter };
}

// Lo último construido, para computedLabels (mismo patrón que muroContencionSolido.ts).
let ultimo: { ux: number; errOS: number; errSAP: number; errETABS: number } | null = null;

export const shearWallQ4: ExampleDef = {
  id: "shear-wall-q4",
  name: "Muro de Corte Q4",
  category: "2️⃣ Shells · 🕸 Membranas",
  benchmark: true,
  // El panel viejo abría sin colormap: su settingsObj solo traía `deformedShape: true`,
  // sin `shellResults` (el visor lo defaultea a "none").
  defaultShellResult: "none",
  guide: [
    "Empotrado en la base; la carga lateral P se reparte uniforme en la fila superior",
    "Ux del centro de la fila superior se compara contra OpenSees, SAP2000 y ETABS",
    "El folder «Calculados» trae el % de diferencia con cada programa",
  ],
  params: {
    W:  { default: 5,    min: 1,    max: 15,   step: 0.5,  label: "Ancho W (m)",  folder: "Geometría" },
    H:  { default: 3,    min: 1,    max: 12,   step: 0.5,  label: "Altura H (m)", folder: "Geometría" },
    t:  { default: 0.2,  min: 0.05, max: 0.6,  step: 0.05, label: "Espesor t (m)", folder: "Sección" },
    nx: { default: 8,    min: 2,    max: 24,   step: 1,    label: "Malla nx", folder: "Malla" },
    ny: { default: 6,    min: 2,    max: 24,   step: 1,    label: "Malla ny", folder: "Malla" },
    E:  { default: 25e6, min: 10e6, max: 50e6, step: 1e6,  label: "E (kN/m²)", folder: "Material" },
    nu: { default: 0.2,  min: 0,    max: 0.49, step: 0.05, label: "ν (Poisson)", folder: "Material" },
    P:  { default: 100,  min: 0,    max: 1000, step: 10,   label: "Carga lateral total (kN)", folder: "Cargas" },
  },
  build(p: Record<string, number>, states: BuildStates) {
    const m = mallaMuroCorteQ4(p);
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
      const def = dOut.deformations.get(m.topCenter);
      const ux = def ? def[0] : 0;
      const uxAbs = Math.abs(ux);
      ultimo = {
        ux: uxAbs,
        errOS:    Math.abs(uxAbs - REF_OPENSEES) / REF_OPENSEES * 100,
        errSAP:   Math.abs(uxAbs - REF_SAP2000)  / REF_SAP2000  * 100,
        errETABS: Math.abs(uxAbs - REF_ETABS)    / REF_ETABS    * 100,
      };
    } catch (e) {
      console.warn("shear-wall-q4 deform/analyze:", e);
    }
    states.objects3D.val = [];
  },
  computedLabels: () => {
    if (!ultimo) return { "Solver": "falló" };
    return {
      "Ux Hekatan (centro fila superior)": `${ultimo.ux.toExponential(4)} m`,
      "Ux OpenSees TCL (ref.)": `${REF_OPENSEES.toExponential(3)} m — Δ ${ultimo.errOS.toFixed(2)} %`,
      "Ux SAP2000 (ref.)":      `${REF_SAP2000.toExponential(3)} m — Δ ${ultimo.errSAP.toFixed(2)} %`,
      "Ux ETABS (ref.)":        `${REF_ETABS.toExponential(3)} m — Δ ${ultimo.errETABS.toFixed(2)} %`,
    };
  },
};
