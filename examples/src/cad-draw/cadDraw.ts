/**
 * CAD Drawer — modelar dibujando con mouse + Tweakpane.
 * Sincronizado con cli-modeler vía window.__hekatanCliScript.
 *
 * Modular en 4 archivos pequeños (cada uno < 200 líneas):
 *   - cadDrawTypes.ts   (tipos)
 *   - cadDrawState.ts   (estado central + sync CLI)
 *   - cadDrawMouse.ts   (eventos pointer + raycaster)
 *   - cadDrawRender.ts  (Object3D del modelo)
 *
 * Tools (cambia con folder Tweakpane):
 *   - select  : click selecciona nodo (highlight)
 *   - node    : click crea nodo en el plano de trabajo (con snap)
 *   - line    : 2 clicks → línea entre nodos (frame)
 *   - area    : 4 clicks → área Q4 (shell)
 *
 * Plano de trabajo: XY (planta), XZ (elevación frontal), YZ (lateral).
 * Cota Z fija ajustable cuando trabajas en XY.
 */
import type { Node, Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { getState } from "./cadDrawState";

// NOTA: el mouse handler custom fue eliminado. Ahora usamos el Drawing
// nativo de hekatan-ui (drawingPoints/polylines en workspace/main.ts) que
// genera el script CLI automaticamente via van.derive.

export const cadDraw: ExampleDef = {
  id: "cad-draw",
  name: "CAD Drawer (mouse + Tweakpane)",
  category: "🧪 Utilidades",
  defaultShellResult: "none",
  availableShellResults: [],
  params: {},
  build(_p, states) {
    // El Drawing NATIVO de hekatan-ui maneja todo el mouse via
    // drawingPoints/polylines en main.ts. NO necesitamos attachMouseHandler.
    // Tampoco syncToCliScript propio: el van.derive de drawingPoints
    // genera el script CLI automaticamente.

    // ── Construir el modelo en el formato estandar Hekatan-Struct ──
    // El viewer dibuja nodos/elementos automaticamente — no necesitamos
    // objects3D custom (mismo patron que zapata-aislada, plate, etc).
    const st = getState();
    const sortedIds = Array.from(st.model.nodes.keys()).sort((a, b) => a - b);
    const idToIdx = new Map<number, number>();
    const nodes: Node[] = [];
    for (const id of sortedIds) {
      idToIdx.set(id, nodes.length);
      const n = st.model.nodes.get(id)!;
      nodes.push(n.pos as Node);
    }
    const elements: Element[] = [];
    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const densities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    // Lineas (frames) — props default razonables (concreto col 0.40×0.40)
    for (const l of st.model.lines.values()) {
      const a = idToIdx.get(l.nI), b = idToIdx.get(l.nJ);
      if (a === undefined || b === undefined) continue;
      const eIdx = elements.length;
      elements.push([a, b]);
      elasticities.set(eIdx, 25e6);
      shearModuli.set(eIdx, 25e6 / (2 * 1.2));
      areas.set(eIdx, 0.16);
      Iz.set(eIdx, 0.0021);
      Iy.set(eIdx, 0.0021);
      J.set(eIdx, 0.0014);
      densities.set(eIdx, 2.45);
      poissons.set(eIdx, 0.2);
    }
    // Areas (shells Q4) — props default
    for (const ar of st.model.areas.values()) {
      if (ar.pts.length !== 4) continue;
      const idxs = ar.pts.map(id => idToIdx.get(id));
      if (idxs.some(i => i === undefined)) continue;
      const eIdx = elements.length;
      elements.push(idxs as Element);
      elasticities.set(eIdx, 25e6);
      shearModuli.set(eIdx, 25e6 / (2 * 1.2));
      thicknesses.set(eIdx, 0.20);
      densities.set(eIdx, 2.45);
      poissons.set(eIdx, 0.2);
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };
    states.elementInputs.val = {
      elasticities, shearModuli, areas,
      momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy,
      torsionalConstants: J, densities, poissonsRatios: poissons, thicknesses,
    } as any;
    states.objects3D.val = [];

    console.log(
      `[CAD Draw] tool=${st.tool} | snap=${st.snap}m | plane=${st.workPlane}@z=${st.workZ}m | ` +
      `nodes=${st.model.nodes.size} lines=${st.model.lines.size} areas=${st.model.areas.size}`,
    );
  },
};
