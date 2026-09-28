/**
 * Puente atirantado (cable-stayed bridge), graduado al workspace (28-sep-2026).
 *
 * Tablero con 2 vigas paralelas (Y = ±deckW/2) + transversales, 2 torres a 1/3 y 2/3 del
 * span con piernas y traviesa superior, cables en abanico desde la cima de cada torre
 * hacia el tablero. Barras de 2 nudos, `deform` + `analyze` de hekatan-fem.
 *
 * EL MODELO NO CAMBIA: viene tal cual de la página propia (antes de graduarlo,
 * `examples/src/cable-stayed-bridge/main.ts`), portada a su vez de FEM Studio
 * `generateBridge()` (getCad3d.ts, líneas 10034-10139). Mismo orden de nudos, mismos
 * apoyos, misma carga nodal, mismas propiedades de barra — incluido el reparto de áreas
 * por índice de elemento que se explica más abajo.
 *
 * ⚠️ ENCONTRADO AL GRADUAR, NO CORREGIDO (regla: el modelo no cambia): `areas` decide
 * sección grande (200e-4, tablero) o chica (10e-4, cable) mirando si el índice del
 * elemento es menor que `nDeckEls` (el nº de barras del tablero). Pero las barras de las
 * TORRES (piernas + traviesa, 5 por torre × 2 torres = 10 elementos) se insertan en el
 * array DESPUÉS del tablero y ANTES de los cables — con índice ≥ nDeckEls — así que la
 * página vieja les daba la sección CHICA de cable (10e-4 m², no 200e-4 m²) a las piernas
 * de las torres. Se conserva tal cual porque así se comportaba la página original.
 */
import type {
  Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { deform, analyze } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";

const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

export interface CableBridgeMallaParams {
  span: number;
  towerH: number;
  deckH: number;
  deckW: number;
  nSpanDiv: number;
  loadDeck: number;
}

export interface CableBridgeMalla {
  nodes: Node[];
  elements: Element[];
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  loads: Map<number, [number, number, number, number, number, number]>;
  /** Nº de barras del tablero (longitudinales + transversales): elementos [0, nDeckEls). */
  nDeckEls: number;
  /** Nº de barras de las 2 torres (piernas + traviesa): elementos [nDeckEls, nDeckEls+nTorreEls). */
  nTorreEls: number;
  nDeckNodes: number;
}

/**
 * Malla pura: tablero de 2 vigas + torres + cables en abanico. Sin estados ni DOM — la
 * usan el ejemplo y su test.
 */
export function mallaCableStayedBridge(p: CableBridgeMallaParams): CableBridgeMalla {
  const span = p.span;
  const towerH = p.towerH;
  const deckH = p.deckH;
  const deckW = p.deckW;
  const nSpanDiv = Math.round(p.nSpanDiv);
  const loadDeck = p.loadDeck;

  const nodes: Node[] = [];
  const elements: Element[] = [];

  // Tablero: 2 líneas longitudinales (Y = ±deckW/2)
  for (let i = 0; i <= nSpanDiv; i++) {
    const x = (span * i) / nSpanDiv;
    nodes.push([x, -deckW / 2, deckH]);
    nodes.push([x, deckW / 2, deckH]);
  }
  const nDeckNodes = nodes.length;

  // Vigas longitudinales + transversales
  for (let i = 0; i < nSpanDiv; i++) {
    elements.push([i * 2, (i + 1) * 2]);
    elements.push([i * 2 + 1, (i + 1) * 2 + 1]);
    elements.push([i * 2, i * 2 + 1]);
  }
  elements.push([nSpanDiv * 2, nSpanDiv * 2 + 1]);
  const nDeckEls = nSpanDiv * 3 + 1;

  // Torres a 1/3 y 2/3 del span
  const towerPositions = [Math.round(nSpanDiv / 3), Math.round((2 * nSpanDiv) / 3)];
  const towerTopNodes: number[] = [];
  for (const tp of towerPositions) {
    const x = (span * tp) / nSpanDiv;
    const baseL = nodes.length; nodes.push([x, -deckW / 2, 0]);
    const baseR = nodes.length; nodes.push([x, deckW / 2, 0]);
    const topL = nodes.length; nodes.push([x, -deckW / 2, towerH + deckH]);
    const topR = nodes.length; nodes.push([x, deckW / 2, towerH + deckH]);
    towerTopNodes.push(topL, topR);

    elements.push([baseL, tp * 2]);
    elements.push([tp * 2, topL]);
    elements.push([baseR, tp * 2 + 1]);
    elements.push([tp * 2 + 1, topR]);
    elements.push([topL, topR]);
  }
  const nTorreEls = towerPositions.length * 5;

  // Cables en abanico (cada 2 nodos)
  for (const topIdx of towerTopNodes) {
    const towerX = nodes[topIdx][0];
    for (let i = 0; i <= nSpanDiv; i++) {
      const deckX = (span * i) / nSpanDiv;
      const dx = Math.abs(deckX - towerX);
      if (dx > span * 0.05 && dx < span * 0.45 && i % 2 === 0) {
        const deckNodeIdx = nodes[topIdx][1] < 0 ? i * 2 : i * 2 + 1;
        elements.push([topIdx, deckNodeIdx]);
      }
    }
  }

  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  supports.set(0, [true, true, true, false, false, false]);
  supports.set(1, [true, true, true, false, false, false]);
  supports.set(nSpanDiv * 2, [false, true, true, false, false, false]);
  supports.set(nSpanDiv * 2 + 1, [false, true, true, false, false, false]);
  for (let i = nDeckNodes; i < nDeckNodes + towerPositions.length * 4; i += 4) {
    supports.set(i, [true, true, true, true, true, true]);
    supports.set(i + 1, [true, true, true, true, true, true]);
  }

  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let i = 0; i <= nSpanDiv; i++) {
    loads.set(i * 2, [0, 0, loadDeck, 0, 0, 0]);
    loads.set(i * 2 + 1, [0, 0, loadDeck, 0, 0, 0]);
  }

  return { nodes, elements, supports, loads, nDeckEls, nTorreEls, nDeckNodes };
}

/** Resumen de ingeniería a partir de los `states` ya resueltos — folder «📊 Calculados». */
function resumenCableStayedBridge(states: BuildStates, malla: CableBridgeMalla): Record<string, string> {
  const nodes = states.nodes.val ?? [];
  const elements = states.elements.val ?? [];
  const ni = states.nodeInputs.val ?? {};
  const def = states.deformOutputs.val ?? {};
  const an = states.analyzeOutputs.val ?? {};

  const out: Record<string, string> = {
    "Nudos": String(nodes.length),
    "Barras": String(elements.length),
    "Barras de tablero/torres": String(malla.nDeckEls + malla.nTorreEls),
    "Cables": String(Math.max(0, elements.length - malla.nDeckEls - malla.nTorreEls)),
  };

  let cargaTotal = 0;
  if (ni.loads) for (const [, v] of ni.loads) cargaTotal += Math.hypot(v[0], v[1], v[2]);
  out["Carga total aplicada"] = `${cargaTotal.toFixed(2)} kN`;

  let sumRz = 0;
  if (def.reactions) for (const [, v] of def.reactions) sumRz += v[2];
  out["Suma reacciones verticales"] = `${sumRz.toFixed(2)} kN`;

  let dMax = 0, nodoDMax = -1;
  if (def.deformations) {
    for (const [n, v] of def.deformations) {
      const d = Math.hypot(v[0], v[1], v[2]);
      if (d > dMax) { dMax = d; nodoDMax = n; }
    }
  }
  out["Desplazamiento máximo"] = nodoDMax >= 0
    ? `${(dMax * 1000).toFixed(3)} mm (nudo ${nodoDMax}, x=${nodes[nodoDMax][0].toFixed(2)} m)`
    : "—";

  // Axil de tablero+torres vs axil de CABLES por separado (elementos [0, nDeckEls+nTorreEls)
  // = tablero + torres; el resto son los cables, ver la nota del encabezado sobre la sección
  // que la página vieja realmente les da a las torres).
  const finEstructura = malla.nDeckEls + malla.nTorreEls;
  let eMax = -Infinity, eMin = Infinity, cMax = -Infinity, cMin = Infinity;
  if (an.normals) {
    for (const [i, v] of an.normals) {
      for (const val of v) {
        if (i < finEstructura) { if (val > eMax) eMax = val; if (val < eMin) eMin = val; }
        else { if (val > cMax) cMax = val; if (val < cMin) cMin = val; }
      }
    }
  }
  out["Axil tablero/torres máx/mín"] = (isFinite(eMax) && isFinite(eMin))
    ? `${eMax.toFixed(2)} / ${eMin.toFixed(2)} kN` : "—";
  out["Axil cables máx/mín"] = (isFinite(cMax) && isFinite(cMin))
    ? `${cMax.toFixed(2)} / ${cMin.toFixed(2)} kN` : "—";

  return out;
}

const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const cableStayedBridge: ExampleDef = {
  id: "cable-stayed-bridge",
  name: "Puente Atirantado",
  // solo barras (87): la categoría la manda el tipo de elemento MEDIDO, no el tema
  category: "1️⃣ Frames · 🎯 6 GDL Espacial",
  defaultFrameResult: "contour:normals",
  params: {
    span:     P("Geometría", "Luz total (m)", 60, 20, 200, 5),
    towerH:   P("Geometría", "Altura torre (m)", 20, 8, 60, 2),
    deckH:    P("Geometría", "Altura tablero (m)", 8, 2, 20, 1),
    deckW:    P("Geometría", "Ancho tablero (m)", 6, 2, 15, 0.5),
    nSpanDiv: P("Malla", "Subdivisiones span", 16, 8, 40, 1),
    loadDeck: P("Cargas", "Carga por nodo (kN)", -30, -150, 0, 5),
  },
  guide: [
    "Tablero de 2 vigas paralelas con torres a 1/3 y 2/3 de la luz",
    "Los cables salen en abanico desde la cima de cada torre hacia el tablero",
    "Apoyos del tablero: rodillo longitudinal en un extremo, fijo en el otro; torres empotradas",
    "En 📊 Calculados: el axil de cables se separa del de tablero/torres",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaCableStayedBridge({
      span: p.span, towerH: p.towerH, deckH: p.deckH, deckW: p.deckW,
      nSpanDiv: p.nSpanDiv, loadDeck: p.loadDeck,
    });
    const { nodes, elements, supports, loads, nDeckEls } = malla;

    const nodeInputs: NodeInputs = { supports, loads };
    const elementInputs: ElementInputs = {
      elasticities:       new Map(elements.map((_, i) => [i, Es])),
      shearModuli:        new Map(elements.map((_, i) => [i, Gs])),
      // Tablero/torres = secciones grandes; cables = secciones pequeñas (ver la nota del
      // encabezado: por el índice usado, las torres reciben en realidad la sección chica).
      areas:              new Map(elements.map((_, i) => [i, i < nDeckEls ? 200e-4 : 10e-4])),
      momentsOfInertiaY:  new Map(elements.map((_, i) => [i, 5000e-8])),
      momentsOfInertiaZ:  new Map(elements.map((_, i) => [i, 2000e-8])),
      torsionalConstants: new Map(elements.map((_, i) => [i, 1000e-8])),
      densities:          new Map(elements.map((_, i) => [i, rho_s])),
      poissonsRatios:     new Map(elements.map((_, i) => [i, nu_s])),
    };

    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
      analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Puente deform/analyze:", e?.message ?? e);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = nodeInputs;
    states.elementInputs.val = elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = [];
  },
  computedLabels: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaCableStayedBridge({
      span: p.span, towerH: p.towerH, deckH: p.deckH, deckW: p.deckW,
      nSpanDiv: p.nSpanDiv, loadDeck: p.loadDeck,
    });
    return resumenCableStayedBridge(states, malla);
  },
};
