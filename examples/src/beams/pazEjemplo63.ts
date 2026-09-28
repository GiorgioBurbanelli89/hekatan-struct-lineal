/**
 * Paz & Leigh — «Dynamics of Structures», Example 6.3 Space Frame.
 * Unidades: kip, in, sec. Columnas W24x146, vigas W14x84.
 *
 * Es el modelo CANÓNICO de validación del solver modal del proyecto, arbitrado
 * contra ETABS 22 (offsets = 0): ver «Validación del solver modal contra
 * ETABS 22» en el CLAUDE.md de la raíz y la regresión `tests/casos/paz_6_3.mjs`.
 * Los seis modos de referencia son 8.8305, 14.5459, 24.2336, 25.1132,
 * 159.6525, 159.8513 Hz.
 *
 * Graduado desde la página propia `examples/src/beams/main.ts` (28-sep-2026):
 * el modelo NO cambia (mismos nudos, mismas propiedades, misma llamada al
 * solver estático y al modal); lo que antes corría automáticamente en cada
 * `van.derive` pasa a `build` (estático) + `runModal` (modal, bajo demanda,
 * patrón de `examples/src/W1_barra_axial/barraAxial.ts`).
 */
import {
  deform, analyze, modalAnalysis,
  type Node, type Element, type NodeInputs, type ElementInputs,
} from "hekatan-fem";
import type { ExampleDef, BuildStates, ModalPanelApi } from "../workspace/exampleRegistry";

export const E = 29500;                      // ksi
const NU = 0.3;
export const G = E / (2 * (1 + NU));          // 11346.15 ksi

const STORY_H = 180;   // in
const BAY_X = 114;     // in
const BAY_Y = 240;     // in

// Steel density: 490 lb/ft³ → kip·sec²/in⁴
export const RHO_STEEL = 490 / 1000 / (12 ** 3) / 386.4; // 7.339e-7

// W24x146 (columnas) AISC
export const COL_A = 43.0, COL_Iz = 5630, COL_Iy = 391, COL_J = 34.8;
// W14x84 (vigas) AISC — el libro dice W14x84, NO W14x82
export const GIR_A = 24.7, GIR_Iz = 928, GIR_Iy = 225, GIR_J = 5.90;

export const NUM_MODES = 6;

/** ETABS 22, brazos rígidos automáticos ANULADOS (offsets = 0) — ver CLAUDE.md. */
export const ETABS_22_FREQS = [8.8305, 14.5459, 24.2336, 25.1132, 159.6525, 159.8513];

export interface ParamsPaz63 { storyH: number; bayX: number; bayY: number; }

export interface MallaPaz63 {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  /** Σ ρ·A·L de las 8 barras (kip·s²/in), para el folder «📊 Resultados». */
  masaTotal: number;
}

/**
 * Malla pura: la usan el ejemplo (`build`/`runModal`) y su test
 * (`tests/casos/graduado_beams.mjs`). Sin estados de van, sin DOM.
 */
export function mallaPaz63(p: ParamsPaz63): MallaPaz63 {
  const h = p.storyH, bx = p.bayX, by = p.bayY;

  // 8 nudos: 4 en la base (Z=0) + 4 en la cubierta (Z=h)
  const nodes: Node[] = [
    [0,  0,  0],    // 0 base
    [0,  0,  h],    // 1 top
    [0,  by, 0],    // 2 base
    [0,  by, h],    // 3 top
    [bx, 0,  0],    // 4 base
    [bx, 0,  h],    // 5 top
    [bx, by, 0],    // 6 base
    [bx, by, h],    // 7 top
  ];

  // 8 elementos: 4 columnas + 4 vigas de cubierta (Example 6.3, sin diagonales)
  const elements: Element[] = [
    [0, 1], [2, 3], [4, 5], [6, 7],   // columnas (0-3)
    [1, 5], [3, 7], [1, 3], [5, 7],   // vigas de cubierta (4-7)
  ];

  const empotrado: [boolean, boolean, boolean, boolean, boolean, boolean] =
    [true, true, true, true, true, true];
  const nodeInputs: NodeInputs = {
    supports: new Map([
      [0, empotrado], [2, empotrado], [4, empotrado], [6, empotrado],
    ]),
    loads: new Map([[3, [10, 0, 0, 0, 0, 0]]]), // F(t) en el nudo 3, dirección +X
  };

  // Propiedades por tipo: columnas (0-3) vs vigas (4-7).
  const eMap = (colVal: number, girVal: number) =>
    new Map(elements.map((_, i) => [i, i < 4 ? colVal : girVal]));

  // Ejes locales convención CSI. Para columnas verticales (n≈1):
  //   eje local x = Z (a lo largo del elemento), eje 2 = +X global, eje 3 = +Y global
  //   → I33 (momentsOfInertiaZ) gobierna el balanceo en X, I22 (momentsOfInertiaY) en Y.
  // Orientación estándar del perfil W (eje fuerte resiste el balanceo en X):
  //   momentsOfInertiaZ = Ix AISC (eje fuerte)
  //   momentsOfInertiaY = Iy AISC (eje débil)
  const elementInputs: ElementInputs = {
    elasticities:       eMap(E, E),
    shearModuli:        eMap(G, G),
    areas:              eMap(COL_A, GIR_A),
    momentsOfInertiaY:  eMap(COL_Iy, GIR_Iy),   // eje débil → I22
    momentsOfInertiaZ:  eMap(COL_Iz, GIR_Iz),   // eje fuerte → I33
    torsionalConstants: eMap(COL_J, GIR_J),
    densities:          new Map(elements.map((_, i) => [i, RHO_STEEL])),
  };

  let masaTotal = 0;
  elements.forEach((el, i) => {
    const [a, b] = el;
    const L = Math.hypot(
      nodes[b][0] - nodes[a][0], nodes[b][1] - nodes[a][1], nodes[b][2] - nodes[a][2]);
    const A = i < 4 ? COL_A : GIR_A;
    masaTotal += RHO_STEEL * A * L;
  });

  return { nodes, elements, nodeInputs, elementInputs, masaTotal };
}

// Lo último construido, para computedLabels (patrón de muroContencionSolido.ts).
let ultimaMasa: number | null = null;

export const pazEjemplo63: ExampleDef = {
  id: "beams",
  name: "Paz 6.3 Space Frame (validación 4 solvers)",
  category: "1️⃣ Frames · 🎯 n GDL Sistemas",
  benchmark: true,
  defaultShellResult: "none",
  availableShellResults: [],
  defaultFrameResult: "none",
  hasModal: true,
  guide: [
    "8 nudos: 4 en la base (empotrados) y 4 en la cubierta; columnas W24x146, vigas W14x84",
    "«▶ Correr modal» calcula los 6 primeros modos y los enseña en el panel modal",
    "«📊 Resultados» trae los 6 modos de ETABS 22 (offsets = 0) para comparar a mano",
    "Unidades del modelo: kip, in, sec — las de Paz & Leigh, Example 6.3",
  ],
  params: {
    storyH: { default: STORY_H, min: 100, max: 300, step: 10, label: "Story H (in)", folder: "Geometría" },
    bayX:   { default: BAY_X,   min: 50,  max: 300, step: 10, label: "Bay X (in)",   folder: "Geometría" },
    bayY:   { default: BAY_Y,   min: 100, max: 400, step: 10, label: "Bay Y (in)",   folder: "Geometría" },
  },
  build(p: Record<string, number>, states: BuildStates) {
    const m = mallaPaz63(p as unknown as ParamsPaz63);
    states.nodes.val = m.nodes;
    states.elements.val = m.elements;
    states.nodeInputs.val = m.nodeInputs;
    states.elementInputs.val = m.elementInputs;
    const deformOut = deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(m.nodes, m.elements, m.elementInputs, deformOut);
    states.objects3D.val = [];
    ultimaMasa = m.masaTotal;
  },
  computedLabels(_p: Record<string, number>, states: BuildStates) {
    const nodes = states.nodes.val ?? [];
    const elements = states.elements.val ?? [];
    if (!nodes.length) return {};
    const out: Record<string, string> = {
      "Nudos": String(nodes.length),
      "Elementos": `${elements.length} (4 columnas + 4 vigas)`,
      "GDL": String(6 * nodes.length),
      "Masa total (Σ ρ·A·L)": `${(ultimaMasa ?? 0).toExponential(6)} kip·s²/in`,
    };
    ETABS_22_FREQS.forEach((f, i) => {
      out[`Modo ${i + 1} — ETABS 22 (brazos rígidos anulados)`] = `${f.toFixed(4)} Hz`;
    });
    return out;
  },
  runModal(_p: Record<string, number>, states: BuildStates, modalPanel: ModalPanelApi) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, NUM_MODES);
      modalPanel.render(out, {
        title: "Paz & Leigh — Example 6.3 Space Frame",
        properties: [
          `E=${E} ksi, G=${G.toFixed(0)} ksi, ρ=${RHO_STEEL.toExponential(3)} kip·s²/in⁴`,
          `Cols: W24x146 (A=${COL_A}, Iz=${COL_Iz}, Iy=${COL_Iy}, J=${COL_J})`,
          `Girs: W14x84  (A=${GIR_A}, Iz=${GIR_Iz}, Iy=${GIR_Iy}, J=${GIR_J})`,
        ],
      });
    } catch (e: any) { console.warn("Modal Paz 6.3 error:", e.message); }
  },
};
