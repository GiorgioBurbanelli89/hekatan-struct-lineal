// =============================================================================
// 1D Mesh — Pórtico plano XZ con N vanos (sin sidebar FEM Studio)
// =============================================================================
// Convención ingenieril:
//   - X horizontal (luz de los vanos)
//   - Z vertical (altura de las columnas)
//   - Y out-of-plane (depth, perpendicular al plano del pórtico)
//
// Vista cámara: XZ frontal (mirando desde -Y al origen, Z up).
// Esto requiere setear `up = (0, 0, 1)` en la cámara del viewer + reposicionar.
//
// Parámetros:
//   - nVanos      : número de vanos (= n_columnas - 1)
//   - spanTotal   : longitud total (X). Cada vano = spanTotal / nVanos.
//   - height      : altura H de las columnas (Z)
//   - load        : carga puntual horizontal en el tope-izquierdo (+X)
//   - meshDensity : subdivisiones por viga/columna (FEM refinement)
//
// Cotas (en plano XZ, Y=0):
//   - Cyan: luz L_v_i (m) bajo la base (z=-0.9, separación vertical entre L's)
//   - Orange: luz total L_tot (z=-2.0, MÁS abajo, sin overlap con L_v)
//   - Verde: altura H a la izquierda (x=-1.2)
// =============================================================================
import * as THREE from "three";
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
import { makeLabel, makeCotaLine } from "../shared/cotas3D";
import { applyDistLoadToBeam, makeDistLoadArrows } from "../shared/distributedLoad";

// Cada vano se parametriza individualmente con L_v1..L_v8.
// El slider "N vanos" controla CUÁNTOS de estos L_v se usan (1-8).
// Si nVanos=3, se usan L_v1, L_v2, L_v3 y se ignoran L_v4..L_v8.
// La luz total L_tot se calcula automáticamente como sum(L_v1..L_v_N).
const P = (def: number, min: number, max: number, step: number, label: string, folder?: string) =>
  ({ value: van.state(def), min, max, step, label, folder });

const parameters: Parameters = {
  nVanos:      P(4,  1, 8,  1,   "N vanos",                  "Geometría"),
  height:      P(3,  1, 6,  0.1, "altura H (m)",             "Geometría"),
  L_v1:        P(4,  1, 12, 0.25, "L vano 1 (m)",            "Luces de vano"),
  L_v2:        P(4,  1, 12, 0.25, "L vano 2 (m)",            "Luces de vano"),
  L_v3:        P(4,  1, 12, 0.25, "L vano 3 (m)",            "Luces de vano"),
  L_v4:        P(4,  1, 12, 0.25, "L vano 4 (m)",            "Luces de vano"),
  L_v5:        P(4,  1, 12, 0.25, "L vano 5 (m)",            "Luces de vano"),
  L_v6:        P(4,  1, 12, 0.25, "L vano 6 (m)",            "Luces de vano"),
  L_v7:        P(4,  1, 12, 0.25, "L vano 7 (m)",            "Luces de vano"),
  L_v8:        P(4,  1, 12, 0.25, "L vano 8 (m)",            "Luces de vano"),
  q_dist:      P(10, 0, 50, 0.5, "q distribuida viga (kN/m)", "Cargas"),
  meshDensity: P(4,  1, 8,  1,   "mesh density",             "Mallado"),
};

const nodesState: State<Node[]> = van.state([]);
const elementsState: State<Element[]> = van.state([]);
const nodeInputsState: State<NodeInputs> = van.state({});
const elementInputsState: State<ElementInputs> = van.state({});
const deformOutputsState: State<DeformOutputs> = van.state({});
const analyzeOutputsState: State<AnalyzeOutputs> = van.state({});
const objects3DState: State<THREE.Object3D[]> = van.state([]);

van.derive(() => {
  const nVanos = Math.max(1, Math.round(parameters.nVanos.value.val));
  const H = parameters.height.value.val;
  const q_dist = parameters.q_dist.value.val;
  const meshDensity = Math.max(1, Math.round(parameters.meshDensity.value.val));

  // Luces individuales por vano: L_v1..L_v8.
  // Solo se usan las primeras nVanos. El resto queda ignorado.
  const L_v_all = [
    parameters.L_v1.value.val,
    parameters.L_v2.value.val,
    parameters.L_v3.value.val,
    parameters.L_v4.value.val,
    parameters.L_v5.value.val,
    parameters.L_v6.value.val,
    parameters.L_v7.value.val,
    parameters.L_v8.value.val,
  ];
  const L_v = L_v_all.slice(0, nVanos);
  const spanTotal = L_v.reduce((s, x) => s + x, 0);

  const nCol = nVanos + 1;

  // Posiciones X acumuladas de las columnas: [0, L_v1, L_v1+L_v2, ...]
  const xCol: number[] = [0];
  for (let v = 0; v < nVanos; v++) {
    xCol.push(xCol[xCol.length - 1] + L_v[v]);
  }

  const nodes: Node[] = [];
  const baseIdx: number[] = [];
  const topIdx: number[] = [];

  // Convención ingenieril: [x, 0, z] — Y=0 (out-of-plane), Z vertical
  for (let i = 0; i < nCol; i++) {
    baseIdx.push(nodes.length); nodes.push([xCol[i], 0, 0]);
    topIdx.push(nodes.length);  nodes.push([xCol[i], 0, H]);
  }

  const elements: Element[] = [];
  const beamIdx = new Set<number>();   // índices de elementos viga (para carga distribuida)

  // Columnas (base → tope, Z), subdivididas
  for (let i = 0; i < nCol; i++) {
    let prev = baseIdx[i];
    for (let k = 1; k < meshDensity; k++) {
      const t = k / meshDensity;
      nodes.push([xCol[i], 0, t * H]);
      elements.push([prev, nodes.length - 1]);
      prev = nodes.length - 1;
    }
    elements.push([prev, topIdx[i]]);
  }

  // Vigas (entre topes adyacentes, X), subdivididas
  for (let v = 0; v < nVanos; v++) {
    const xA = xCol[v];
    const xB = xCol[v + 1];
    let prev = topIdx[v];
    for (let k = 1; k < meshDensity; k++) {
      const t = k / meshDensity;
      nodes.push([xA + t * (xB - xA), 0, H]);
      beamIdx.add(elements.length);
      elements.push([prev, nodes.length - 1]);
      prev = nodes.length - 1;
    }
    beamIdx.add(elements.length);
    elements.push([prev, topIdx[v + 1]]);
  }

  // Empotramientos en bases
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (const idx of baseIdx) supports.set(idx, [true, true, true, true, true, true]);

  // Cargas: SOLO carga distribuida q sobre TODAS las vigas
  // (kN/m, dirección -Z = gravedad). Se convierte a Fixed-End Moments
  // (cargas nodales equivalentes) en cada sub-elemento viga.
  const loads = new Map<number, [number, number, number, number, number, number]>();
  if (q_dist > 0) {
    for (const elemIdx of beamIdx) {
      const [iN, jN] = elements[elemIdx];
      applyDistLoadToBeam(loads, nodes as any, [iN, jN], q_dist, "Z-");
    }
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities: new Map(elements.map((_, i) => [i, 10])),
    shearModuli: new Map(elements.map((_, i) => [i, 10])),
    areas: new Map(elements.map((_, i) => [i, 10])),
    torsionalConstants: new Map(elements.map((_, i) => [i, 10])),
    momentsOfInertiaY: new Map(elements.map((_, i) => [i, 10])),
    momentsOfInertiaZ: new Map(elements.map((_, i) => [i, 10])),
  };

  const deformOutputs = deform(nodes, elements, nodeInputs, elementInputs);
  const analyzeOutputs = analyze(nodes, elements, elementInputs, deformOutputs);

  // ── COTAS XZ (Y=0, Z negativo para "abajo") ──────────────────────────────
  // Separación vertical entre niveles de cotas para evitar overlap:
  //   L_v (vano)  → z = -0.9
  //   L_tot       → z = -2.0   (1.1m de separación)
  //   H (altura)  → x = -1.2 (izquierda)
  const cotas: THREE.Object3D[] = [];
  const Z_COTA_VANO = -0.9;
  const Z_COTA_TOT  = -2.0;
  const X_COTA_H    = -1.2;
  const TICK = 0.18;

  // Cyan — cota por vano
  for (let v = 0; v < nVanos; v++) {
    const xA = xCol[v], xB = xCol[v + 1];
    const L = xB - xA;
    cotas.push(makeCotaLine([xA, 0, Z_COTA_VANO], [xB, 0, Z_COTA_VANO], 0x00e5ff));
    cotas.push(makeCotaLine([xA, 0, Z_COTA_VANO - TICK], [xA, 0, Z_COTA_VANO + TICK], 0x00e5ff));
    cotas.push(makeCotaLine([xB, 0, Z_COTA_VANO - TICK], [xB, 0, Z_COTA_VANO + TICK], 0x00e5ff));
    // Label DEBAJO de la línea (z más negativo)
    cotas.push(makeLabel(`L${v + 1} = ${L.toFixed(2)} m`, (xA + xB) / 2, 0, Z_COTA_VANO - 0.3, "#00e5ff"));
  }

  // Orange — L_tot
  const xStart = xCol[0];
  const xEnd = xCol[xCol.length - 1];
  const L_tot = xEnd - xStart;
  cotas.push(makeCotaLine([xStart, 0, Z_COTA_TOT], [xEnd, 0, Z_COTA_TOT], 0xffaa00));
  cotas.push(makeCotaLine([xStart, 0, Z_COTA_TOT - TICK], [xStart, 0, Z_COTA_TOT + TICK], 0xffaa00));
  cotas.push(makeCotaLine([xEnd,   0, Z_COTA_TOT - TICK], [xEnd,   0, Z_COTA_TOT + TICK], 0xffaa00));
  cotas.push(makeLabel(`L_tot = ${L_tot.toFixed(2)} m (${nVanos} vanos)`, (xStart + xEnd) / 2, 0, Z_COTA_TOT - 0.3, "#ffaa00"));

  // Verde — altura H (vertical, a la izquierda)
  cotas.push(makeCotaLine([X_COTA_H, 0, 0], [X_COTA_H, 0, H], 0x80ff80));
  cotas.push(makeCotaLine([X_COTA_H - TICK, 0, 0], [X_COTA_H + TICK, 0, 0], 0x80ff80));
  cotas.push(makeCotaLine([X_COTA_H - TICK, 0, H], [X_COTA_H + TICK, 0, H], 0x80ff80));
  cotas.push(makeLabel(`H = ${H.toFixed(2)} m`, X_COTA_H - 0.7, 0, H / 2, "#80ff80"));

  // ── VISUALIZACIÓN DE CARGA DISTRIBUIDA ──────────────────────────────────
  // Una flecha-array por VANO (sobre toda la viga completa, no por subelemento).
  // Color naranja brillante. Las flechas apuntan hacia abajo (-Z) sobre la viga.
  // Toggleable vía Settings → "Loads" (no via "Cotas").
  if (q_dist > 0) {
    for (let v = 0; v < nVanos; v++) {
      const xA = xCol[v], xB = xCol[v + 1];
      const Lv_v = xB - xA;
      // Escala visual proporcional al q: q=0 → 0, q=50 → arrowLen=0.8
      const arrowLen = Math.min(0.3 + q_dist / 50 * 0.4, 0.8);
      const nArrows = Math.max(4, Math.round(Lv_v * 1.5));
      const arrows = makeDistLoadArrows(
        [xA, 0, H], [xB, 0, H],
        q_dist, "Z-",
        nArrows, arrowLen,
        0xff6600
      );
      cotas.push(arrows);
      // Label con el valor de q. Re-clasificar como isDistLoad (no isCota)
      // para que toggle con "Loads", no con "Cotas".
      const qLabel = makeLabel(
        `q = ${q_dist.toFixed(1)} kN/m`,
        (xA + xB) / 2, 0, H + arrowLen + 0.25,
        "#ff6600",
      );
      (qLabel.userData as any).isCota = false;
      (qLabel.userData as any).isDistLoad = true;
      cotas.push(qLabel);
    }
  }

  nodesState.val = nodes;
  elementsState.val = elements;
  nodeInputsState.val = nodeInputs;
  elementInputsState.val = elementInputs;
  deformOutputsState.val = deformOutputs;
  analyzeOutputsState.val = analyzeOutputs;
  objects3DState.val = cotas;
});

// ── Mount UI ─────────────────────────────────────────────────────────────
const viewerEl = getViewer({
  mesh: {
    nodes: nodesState,
    elements: elementsState,
    nodeInputs: nodeInputsState,
    elementInputs: elementInputsState,
    deformOutputs: deformOutputsState,
    analyzeOutputs: analyzeOutputsState,
  },
  objects3D: objects3DState,
  settingsObj: {
    deformedShape: true,
    showCotas: true,
    displayScale: -2.5,   // setting solicitado por el usuario (markers aún más finos)
  },
});

const paramsEl = getParameters(parameters);
document.body.append(
  paramsEl,
  viewerEl,
  getToolbar({
    sourceCode:
      "https://github.com/GiorgioBurbanelli89/hekatan-struct/blob/main/examples/src/1d-mesh-clean/main.ts",
    author: "Hekatan Struct — pórtico plano XZ (Z vertical, convención ingenieril)",
  })
);

// ── Hide/show dinámico de los sliders L_v_i según el valor de N vanos ──
// Si nVanos=3, solo L_v1, L_v2, L_v3 se muestran. L_v4..L_v8 se ocultan
// para que el panel sea coherente con la estructura visible.
van.derive(() => {
  const nVanos = Math.max(1, Math.round(parameters.nVanos.value.val));
  const bindings = (paramsEl as any).__bindings;
  if (!bindings) return;
  for (let i = 1; i <= 8; i++) {
    const b = bindings.get(`L_v${i}`);
    if (b) b.hidden = i > nVanos;
  }
});

// ── CONFIGURAR CÁMARA A VISTA XZ FRONTAL ──
// El viewer default usa plan XY (Y vertical, Z into screen). Necesitamos
// vista XZ: X horizontal, Z vertical, mirando desde -Y al origen.
// Cambiar `up = (0, 0, 1)` hace que Z sea up en pantalla. Reposicionar
// camera en el eje -Y a distancia ~1.5×spanTotal para enmarcar todo.
setTimeout(() => {
  const ctx = (viewerEl as any).__ctx;
  if (!ctx) return;
  // Recalcular span como suma de luces actuales (puede haber cambiado)
  const nVanos = Math.max(1, Math.round(parameters.nVanos.value.val));
  const L_v_all = [parameters.L_v1, parameters.L_v2, parameters.L_v3, parameters.L_v4,
                   parameters.L_v5, parameters.L_v6, parameters.L_v7, parameters.L_v8];
  const span = L_v_all.slice(0, nVanos).reduce((s, p) => s + p.value.val, 0);
  const H = parameters.height.value.val;
  const cx = span / 2;
  const cz = H / 2;
  const dist = Math.max(span * 1.4, 10);

  // Camera principal: Z up + mirando desde -Y al centro del pórtico
  ctx.perspCamera.up.set(0, 0, 1);
  ctx.perspCamera.position.set(cx, -dist, cz);
  ctx.perspCamera.lookAt(cx, 0, cz);
  ctx.perspCamera.updateProjectionMatrix();

  // OrthoCamera (en caso de toggle)
  ctx.orthoCamera.up.set(0, 0, 1);
  ctx.orthoCamera.position.set(cx, -dist, cz);
  ctx.orthoCamera.lookAt(cx, 0, cz);

  // OrbitControls target al centro
  ctx.controls.target.set(cx, 0, cz);
  ctx.controls.update();
  ctx.render();
}, 100);
