/**
 * =============================================================================
 *  Workspace — patrón awatif puro con Tweakpane
 *  Cada ejemplo se carga como módulo autónomo via ?t=<example> o selector
 * =============================================================================
 *
 *  Stack:
 *    - getViewer()        — 3D Three.js renderer (shells, frames, deformada)
 *    - getToolbar()       — top bar
 *    - Tweakpane panel    — selector de ejemplo + parámetros (reactivo)
 *    - createModalPanel() — tabla de frecuencias/modos (opcional)
 *
 *  Cada ejemplo exporta:
 *    { id, name, category, params, build(states, modal?) }
 * =============================================================================
 */
import van, { State } from "vanjs-core";
import * as THREE from "three";
import { Pane } from "tweakpane";
import {
  Node, Element, NodeInputs, ElementInputs,
  DeformOutputs, AnalyzeOutputs,
  deform, analyze,
} from "hekatan-fem";
import { autoMeshShells } from "../shared/e2kAutoMesh";

// ── Auto-mesh shells toggle (global, persistido localStorage) ──
// ?heks=<url> — se captura AQUI, al cargar el modulo, y no donde se usa: el
// workspace reescribe la URL al arrancar (fija «t» y borra parametros), asi
// que si se lee mas tarde ya no esta y el modelo nunca se abre.
// ?m=<codigo> — ENLACE DE COMPARTIR, igual que el /id/<codigo> del visor DWG.
// El modelo vive en `m/<codigo>/modelo.heks` dentro del propio deploy, con el
// codigo generado al azar (crear_share_struct.py). Se resuelve contra
// BASE_URL porque en el deploy la app cuelga de /hekatan-struct-lineal/, no de
// la raiz: con una ruta absoluta el fetch daria 404.
// OJO, no es control de acceso: el codigo es impredecible y robots.txt tapa
// /m/, pero cualquiera que TENGA el enlace ve el modelo. Para privacidad de
// verdad haria falta autenticacion en el hosting.
const _qs = new URLSearchParams(window.location.search);

// Velo de carga. Se crea AQUI, al cargar el modulo, porque creandolo mas
// tarde (dentro del panel CLI) llegaba despues de que el CAD ya hubiera
// dibujado sus planos de trabajo, sus ejes y la rejilla — y eso es lo que se
// veia «antes del modelo».
let _velo: HTMLDivElement | null = null;
function quitarVelo() {
  try { _velo?.remove(); } catch { /* no-op */ }
  _velo = null;
}
if (_qs.get("heks") || _qs.get("m")) {
  _velo = document.createElement("div");
  _velo.textContent = "Cargando modelo…";
  _velo.style.cssText = [
    "position:fixed", "inset:0", "z-index:9000",
    "display:flex", "align-items:center", "justify-content:center",
    "background:#1b1e24", "color:#7f8a9a",
    "font:13px ui-monospace,Consolas,monospace", "pointer-events:none",
  ].join(";");
  const poner = () => document.body && document.body.appendChild(_velo!);
  if (document.body) poner();
  else document.addEventListener("DOMContentLoaded", poner);
  // red de seguridad: si el modelo no llega, no dejarlo tapado para siempre
  setTimeout(quitarVelo, 15000);
}
const _codigo = _qs.get("m");
const URL_HEKS = _codigo
  ? `${import.meta.env.BASE_URL}m/${encodeURIComponent(_codigo)}/modelo.heks`
      .replace(/([^:])\/\//g, "$1/")
  : _qs.get("heks");

const AUTO_MESH_KEY = "hekatan.workspace.autoMeshShells";
const autoMeshShellsEnabled = van.state<boolean>(
  localStorage.getItem(AUTO_MESH_KEY) === "true"
);
van.derive(() => {
  localStorage.setItem(AUTO_MESH_KEY, String(autoMeshShellsEnabled.val));
});
import {
  getToolbar, getViewer, colorMapForceUnit, colorMapDispUnit, addCadPanel, addCadRibbon, addCadStatusBar,
  // 🛠 Orquestador unificado de Herramientas FEM (folder Tweakpane completo)
  attachFemTools,
  // el tema del VISOR: el fondo lo pinta WebGL, no el CSS, asi que la piel
  // tiene que avisarle aparte
  setTheme as uiSetTheme,
} from "hekatan-ui";
// import { attachInspect } from "../shared/attachInspect";  // DEPRECATED: ahora en hekatan-ui/femTools
import { exportarPng, exportarOrbitaGif, pngBlob } from "../shared/gifExport";
import { createModalPanel } from "../shared/renderModalTable";
import { createModalAnimator, type ModalAnimator } from "../shared/animateMode";
// createModalAnimator también se llama en buildParamsPane() para re-wirear el
// callback onStatusChange al folder "⚡ Modal + Animación" recién creado.
import {
  examplesRegistry, activeExampleVersion, type ExampleDef,
  DEFAULT_LOAD_PATTERNS, DEFAULT_LOAD_CASES, DEFAULT_LOAD_COMBINATIONS,
} from "./exampleRegistry";
import { attachLoadPatternsPanel, loadPersistedLoadPatterns } from "./loadPatternsPanel";
import { downloadZapataF2k } from "../zapata-aislada/f2kExporter";
import { parseZapataF2k } from "../zapata-aislada/f2kImporter";
import { exportF2k as exportF2kModelo } from "../shared/f2kExporter";
import { exportEdificioCimentacionF2k, downloadEdificioCimentacionF2k } from "../shared/f2kCimentacionCompleta";
// Expose F2K builder a window para test/debug via DOM
(window as any).__hekatanExportF2kCim = exportEdificioCimentacionF2k;
(window as any).__hekatanDownloadF2kCim = downloadEdificioCimentacionF2k;
// Helper completo: lee estado actual (reacciones, params) y genera el F2K
// Devuelve el texto del F2K — accesible via window.__hekatanGenF2k() en el DOM.
(window as any).__hekatanGenF2k = async function() {
  const reactions = (deformOutputs.rawVal as any)?.reactions as
    Map<number, [number, number, number, number, number, number]> | undefined;
  const ns = nodes.rawVal as number[][];
  if (!reactions || !ns?.length) {
    return { error: "Sin reacciones — corre 'Edificio completo' primero" };
  }
  const p: any = (window as any).__hekatanPanes?.params ?? {};
  // Tomar de la pane raíz si __hekatanPanes no está
  const sels = Array.from(document.querySelectorAll<HTMLSelectElement>('select'));
  const get = (lbl: string) => {
    const s = sels.find(s => s.closest('.tp-lblv')?.querySelector('.tp-lblv_l')?.textContent?.includes(lbl));
    return s?.value;
  };
  // Recolectar reacciones de apoyos
  const rows: any[] = [];
  let xMax = 0, yMax = 0;
  reactions.forEach((r, idx) => {
    const n = ns[idx];
    if (!n || Math.abs(n[2]) > 1e-6) return;
    rows.push({ idx, x: n[0], y: n[1], P_kN: Math.abs(r[2]), Mx_kN: r[3], My_kN: r[4] });
    if (n[0] > xMax) xMax = n[0];
    if (n[1] > yMax) yMax = n[1];
  });
  if (!rows.length) return { error: "No hay apoyos en z=0" };
  // Diseño + offsets
  const { designAllFootings } = await import("../shared/footingDesign");
  const q_adm = 10, ks = 1030, tz = 0.30, colSize = 0.40, Df = 0.5, vol = 0.30;
  const zd = designAllFootings(rows, xMax, yMax, q_adm, ks);
  for (const z of zd) z.t = tz;
  const zapatas = zd.map(z => {
    let oX = 0, oY = 0;
    if (z.tipo === "esquinera") {
      oX = (z.x < xMax/2) ? -(z.Lz/2 - vol) : (z.Lz/2 - vol);
      oY = (z.y < yMax/2) ? -(z.Bz/2 - vol) : (z.Bz/2 - vol);
    } else if (z.tipo === "lindero") {
      if (Math.abs(z.x)<1e-3 || Math.abs(z.x-xMax)<1e-3) oX = (z.x < xMax/2) ? -(z.Lz/2-vol) : (z.Lz/2-vol);
      else if (Math.abs(z.y)<1e-3 || Math.abs(z.y-yMax)<1e-3) oY = (z.y < yMax/2) ? -(z.Bz/2-vol) : (z.Bz/2-vol);
    }
    const baseR = rows.find(b => b.idx === z.idx)!;
    return {
      xC: z.x - oX, yC: z.y - oY,
      xCol: z.x, yCol: z.y,
      Lz: z.Lz, Bz: z.Bz, tz: z.t, bc: colSize,
      P_dead_kN: baseR.P_kN,
      Mx_dead_kNm: baseR.Mx_kN,
      My_dead_kNm: baseR.My_kN,
      label: z.idx,
    };
  });
  // Vigas de amarre (siempre incluir si sistema=1)
  const vigasAmarre: any[] = [];
  const va_h = 0.40, va_b = 0.25, zVA = -Df;
  const byY = new Map<string, any[]>();
  const byX = new Map<string, any[]>();
  for (const b of rows) {
    const ky = b.y.toFixed(4), kx = b.x.toFixed(4);
    if (!byY.has(ky)) byY.set(ky, []);
    if (!byX.has(kx)) byX.set(kx, []);
    byY.get(ky)!.push(b);
    byX.get(kx)!.push(b);
  }
  for (const row of byY.values()) {
    row.sort((a,b)=>a.x-b.x);
    for (let i=0;i<row.length-1;i++) vigasAmarre.push({ x1:row[i].x, y1:row[i].y, x2:row[i+1].x, y2:row[i+1].y, h:va_h, b:va_b, z:zVA });
  }
  for (const col of byX.values()) {
    col.sort((a,b)=>a.y-b.y);
    for (let i=0;i<col.length-1;i++) vigasAmarre.push({ x1:col[i].x, y1:col[i].y, x2:col[i+1].x, y2:col[i+1].y, h:va_h, b:va_b, z:zVA });
  }
  const f2k = exportEdificioCimentacionF2k({
    zapatas, vigasAmarre, ks_kNm3: ks, Z: -Df,
  });
  return { f2k, n_zapatas: zapatas.length, n_vigas: vigasAmarre.length };
};
import { exportE2k } from "../shared/e2kExporter";
import { exportTclFromCli, importTclToCli } from "../shared/tclIO";
import { parseE2k } from "../shared/e2kParser";
import { exportS2k } from "../shared/s2kExporter";
import { parseS2k } from "../shared/s2kParser";
import { aplicarPielCad, ponerCoordenadas } from "../shared/hekatanCadSkin";
import {
  forceUnit, dispUnit, fromKn, toKn, fromKnm, toKnm,
  // `mToDisp` lo usa el tooltip del visor (kind === "displacement") y NO estaba
  // importado: al pasar el mouse por encima del modelo saltaba
  // "mToDisp is not defined" y el tooltip moria. No se veia probando a mano
  // porque el error va a la consola, no a la pantalla; lo destapo el cursor de
  // `cli/gif_modal_demo.mjs`, que recorre el canvas de verdad.
  mToDisp,
  forceUnitSuffix, momentUnitSuffix, dispUnitSuffix, stripUnitSuffix,
  // SAFE-style granular units + presets
  stressUnit, subgradeUnit, stiffTransUnit, lengthSectionUnit,
  applyConsistentUnits, detectCurrentPreset,
} from "./units";

// Propagación de unidades al viewer de hekatan-ui: cualquier cambio en
// forceUnit/dispUnit del workspace se refleja en el colormap legend y en
// el scaling de sus valores (kN/m² → tonf/m², mm → cm, etc.).
van.derive(() => { colorMapForceUnit.val = forceUnit.val; });
van.derive(() => { colorMapDispUnit.val = dispUnit.val; });

// ── Estado global compartido ──
const nodes: State<Node[]> = van.state([]);
const elements: State<Element[]> = van.state([]);
const nodeInputs: State<NodeInputs> = van.state({});
const elementInputs: State<ElementInputs> = van.state({});
const deformOutputs: State<DeformOutputs> = van.state({});
const analyzeOutputs: State<AnalyzeOutputs> = van.state({});
const objects3D: State<THREE.Object3D[]> = van.state([]);
// Drawing states (awatif-style) — mouse interactivo + raycaster nativo de
// hekatan-ui. Solo se usa en el ejemplo cad-draw (otros los ignoran).
// ── Drawing state — persistido en localStorage ──
// Antes era memoria pura: cada reload perdía los nodos dibujados con CAD.
// Ahora lo persistimos en hk_drawingPoints + hk_drawingPolylines para que
// el usuario pueda cerrar/reabrir el browser y mantener su modelo.
const DRAW_PTS_KEY = "hk_drawingPoints";
const DRAW_POLYS_KEY = "hk_drawingPolylines";
const DRAW_AREAS_KEY = "hk_drawingAreas";
/**
 * Recupera el dibujo en curso — de `sessionStorage`, NO de `localStorage`.
 *
 * Antes se guardaba en localStorage y se restauraba en CADA carga, sin avisar.
 * Consecuencia: «Archivo nuevo (lienzo CAD)» se abria con un dibujo dentro —el
 * de la ultima vez, de otro dia y de otra prueba— y encima a medio hacer.
 * Un archivo nuevo es nuevo.
 *
 * Con sessionStorage se conserva lo importante y desaparece lo que estorbaba:
 *   · recargar la pestana (F5, o un cambio de parametro) NO pierde el trabajo;
 *   · abrir una pestana nueva, o volver otro dia, da el lienzo VACIO.
 *
 * El respaldo en localStorage se sigue escribiendo, para poder ofrecer
 * «recuperar el ultimo dibujo» sin imponerlo (ver el aviso mas abajo).
 */
const loadDrawState = (): { pts: [number,number,number][]; polys: number[][]; areas: number[] } => {
  try {
    const ptsRaw = sessionStorage.getItem(DRAW_PTS_KEY);
    const polysRaw = sessionStorage.getItem(DRAW_POLYS_KEY);
    const areasRaw = sessionStorage.getItem(DRAW_AREAS_KEY);
    if (ptsRaw && polysRaw) {
      const pts = JSON.parse(ptsRaw) as [number,number,number][];
      const polys = JSON.parse(polysRaw) as number[][];
      const areas = areasRaw ? (JSON.parse(areasRaw) as number[]) : [];
      return { pts, polys, areas };
    }
  } catch {}
  return { pts: [], polys: [[]], areas: [] };
};
const _initialDraw = loadDrawState();
const drawingPoints: State<[number, number, number][]> = van.state(_initialDraw.pts);
const drawingPolylines: State<number[][]> = van.state(_initialDraw.polys);
// drawingAreas: array de ÍNDICES de polylines que el usuario eligió como
// "área" (shell Q4). Una polilínea cerrada NO es automáticamente un área —
// puede ser una cercha (frames cerrados) o un shell. La intención se
// distingue por la elección del tool ("line"/"polyline" → frames; "area" →
// shell explícito de 4 vértices).
const drawingAreas: State<number[]> = van.state(_initialDraw.areas);
// drawingAuxLines: líneas auxiliares (construction lines) — NO generan
// FEM frames pero SÍ son objeto de OSNAP (endpoint/midpoint/intersection).
// Sirven como guía visual para construir geometría en 3D iso, alinear
// puntos con ejes auxiliares, prolongar líneas existentes, etc.
// Cada entry es un par [x0,y0,z0, x1,y1,z1].
const drawingAuxLines: State<number[][]> = van.state([]);
// drawingAuxPoints: puntos auxiliares — NO generan nodos FEM pero SÍ son
// objeto de OSNAP (endpoint). Útiles para marcar referencias en 3D iso.
// Cada entry es [x,y,z].
const drawingAuxPoints: State<number[][]> = van.state([]);
// Persist on every change
van.derive(() => {
  try {
    const pts = JSON.stringify(drawingPoints.val);
    const polys = JSON.stringify(drawingPolylines.val);
    const areas = JSON.stringify(drawingAreas.val);
    // La sesion es la que se restaura sola: sobrevive a un F5, no a cerrar.
    sessionStorage.setItem(DRAW_PTS_KEY, pts);
    sessionStorage.setItem(DRAW_POLYS_KEY, polys);
    sessionStorage.setItem(DRAW_AREAS_KEY, areas);
    // Y un respaldo que dura, para poder OFRECER recuperarlo. Solo si hay algo:
    // guardar el lienzo vacio borraria el trabajo del dia anterior.
    if (drawingPoints.val.length > 0) {
      localStorage.setItem(DRAW_PTS_KEY, pts);
      localStorage.setItem(DRAW_POLYS_KEY, polys);
      localStorage.setItem(DRAW_AREAS_KEY, areas);
    }
  } catch {}
});
/**
 * Si el lienzo arranca vacio pero hay un dibujo guardado de otra sesion, se
 * OFRECE recuperarlo. No se impone: imponerlo es justo lo que hacia que
 * «Archivo nuevo» abriera con el modelo de la ultima vez.
 */
function ofrecerRecuperar(): void {
  if (drawingPoints.rawVal.length > 0) return;            // ya hay algo dibujado
  let pts: [number, number, number][] = [], polys: number[][] = [], areas: number[] = [];
  try {
    const p = localStorage.getItem(DRAW_PTS_KEY), q = localStorage.getItem(DRAW_POLYS_KEY);
    if (!p || !q) return;
    pts = JSON.parse(p); polys = JSON.parse(q);
    areas = JSON.parse(localStorage.getItem(DRAW_AREAS_KEY) || "[]");
  } catch { return; }
  if (!pts.length) return;

  const av = document.createElement("div");
  av.style.cssText = [
    "position:fixed", "bottom:96px", "left:50%", "transform:translateX(-50%)",
    "z-index:99990", "display:flex", "align-items:center", "gap:10px",
    "padding:8px 14px", "background:rgba(15,23,42,.96)",
    "border:1px solid #f59e0b", "border-radius:9px", "color:#fcd34d",
    "font:12px Consolas,monospace", "box-shadow:0 6px 20px rgba(0,0,0,.5)",
  ].join(";") + ";";
  const cerrar = () => av.remove();
  av.innerHTML = `<span>Hay un dibujo guardado de antes (${pts.length} nudos).</span>`;
  const bSi = document.createElement("button");
  bSi.textContent = "Recuperarlo";
  bSi.style.cssText = "cursor:pointer;padding:3px 10px;border-radius:5px;border:1px solid #f59e0b;" +
    "background:#78350f;color:#fde68a;font:600 11px inherit";
  bSi.onclick = () => {
    drawingPoints.val = pts; drawingPolylines.val = polys; drawingAreas.val = areas;
    (window as any).__hekatanRebuild?.();
    (window as any).__hekatanAutoFit?.();
    cerrar();
  };
  const bNo = document.createElement("button");
  bNo.textContent = "Empezar en blanco";
  bNo.style.cssText = "cursor:pointer;padding:3px 10px;border-radius:5px;border:1px solid #334155;" +
    "background:transparent;color:#94a3b8;font:11px inherit";
  bNo.onclick = () => {
    try { localStorage.removeItem(DRAW_PTS_KEY); localStorage.removeItem(DRAW_POLYS_KEY);
          localStorage.removeItem(DRAW_AREAS_KEY); } catch {}
    cerrar();
  };
  av.append(bSi, bNo);
  document.body.appendChild(av);
  setTimeout(() => { if (av.isConnected) cerrar(); }, 15000);
}

// Grid centrado en el origen mundial (convención CAD).
const drawingGridTarget: State<{ position: [number,number,number]; rotation: [number,number,number] }> =
  van.state({ position: [0, 0, 0], rotation: [0, 0, 0] });
// Expongo los van states a globals para que ejemplos (newBlank, etc.)
// puedan LEER los puntos/polylines dibujados con mouse y construir
// nodes/elements del FEM directamente.
(window as any).__hekatanDrawingPoints = drawingPoints;
(window as any).__hekatanDrawingPolylines = drawingPolylines;
(window as any).__hekatanDrawingAreas = drawingAreas;
(window as any).__hekatanDrawingAuxLines = drawingAuxLines;
(window as any).__hekatanDrawingAuxPoints = drawingAuxPoints;
(window as any).__hekatanDrawingGridTarget = drawingGridTarget;

export interface BuildStates {
  nodes: State<Node[]>;
  elements: State<Element[]>;
  nodeInputs: State<NodeInputs>;
  elementInputs: State<ElementInputs>;
  deformOutputs: State<DeformOutputs>;
  analyzeOutputs: State<AnalyzeOutputs>;
  objects3D: State<THREE.Object3D[]>;
  // Load Patterns/Cases (definidos vía panel "📋 Load Patterns" del workspace).
  // Ver exampleRegistry.ts para tipos completos.
  loadPatterns?: State<import("hekatan-fem").LoadPattern[]>;
  loadCases?: State<import("hekatan-fem").LoadCase[]>;
  loadCombinations?: State<import("hekatan-fem").LoadCombination[]>;
  activeLoadCase?: State<string>;
}
// Load patterns/cases/combinations — defaults ETABS-like (Dead/Live/Modal)
// Se cargan desde localStorage en loadExample() según el example actual.
const loadPatterns = van.state<import("hekatan-fem").LoadPattern[]>([]);
const loadCases = van.state<import("hekatan-fem").LoadCase[]>([]);
const loadCombinations = van.state<import("hekatan-fem").LoadCombination[]>([]);
const activeLoadCase = van.state<string>("Dead");

const states: BuildStates = {
  nodes, elements, nodeInputs, elementInputs,
  deformOutputs, analyzeOutputs, objects3D,
  loadPatterns, loadCases, loadCombinations, activeLoadCase,
};
// Los states del modelo, expuestos para poder COMPROBARLOS desde fuera (los
// arneses `cli/ctl_*.mjs`). Sin esto no hay forma de mirar cuantas cargas o
// apoyos quedaron aplicados: solo se ve el dibujo, y el dibujo no dice si el
// modelo se puede calcular.
(window as any).__hekatanStates = states;

// ── Example runner ──
let currentExample: ExampleDef | null = null;
let currentParams: Record<string, number> = {};
let currentPane: Pane | null = null;
// ── Modal animation state (compartido para todos los ejemplos con hasModal=true) ──
// modeIdx es 1-INDEXADO para que la UI muestre "Modo 1, 2, 3..." en vez de "0, 1, 2...".
// animCtrl se refresca dinámicamente tras correr el modal para reflejar modeCount real.
const animCtrl = { modeIdx: 1 };
let modalAnimator: ModalAnimator;
// Objeto mutable que backea el folder "📊 Calculados" del Tweakpane.
// Después de cada rebuild(), se re-llena con computedLabels() y el pane.refresh()
// lo refleja en la UI como bindings readonly.
let computedObj: Record<string, string> | null = null;
// Objeto mutable para los valores INLINE calculados (ks después de q_adm, etc.).
// Misma lógica que computedObj: mutamos in-place y el pane.refresh() los actualiza.
let inlineComputedObj: Record<string, string> | null = null;
// Registro de bindings con visibilidad dinámica (hiddenIf). En cada rebuild
// evaluamos la función y aplicamos .hidden al binding del Tweakpane.
interface HiddenBinding { binding: any; hiddenIf: (p: Record<string, number>) => boolean; }
let hiddenBindings: HiddenBinding[] = [];
const modalPanel = createModalPanel();
modalPanel.div.style.display = "none";

// Limpia todos los estados antes de cargar/rebuild un ejemplo.
// Evita que objetos 3D (ej. resortes Winkler de zapata) persistan al cambiar de ejemplo.
function resetStates() {
  states.objects3D.val = [];
  states.nodes.val = [];
  states.elements.val = [];
  states.nodeInputs.val = {};
  states.elementInputs.val = {};
  states.deformOutputs.val = {};
  states.analyzeOutputs.val = {};
}

/**
 * Flag de interacción manual con la cámara (OrbitControls).
 * Se setea a `true` la primera vez que el usuario hace pan/zoom/orbit;
 * mientras esté en `true`, los `rebuild()` causados por sliders NO ejecutan
 * `autoFitCamera()` — así la vista del usuario no se "resetea" en cada cambio
 * de parámetro. Se resetea a `false` en cada `loadExample()`.
 */
let userCameraInteracted = false;

/**
 * Estado expanded/collapsed de los folders del Tweakpane.
 * Persistido a nivel de módulo (sobrevive a `buildParamsPane()` que dispose
 * + recrea el pane entero por `regenOnChange`). Se resetea al cambiar de
 * ejemplo. Llave: título del folder, valor: expanded.
 */
const folderExpandedState = new Map<string, boolean>();

/**
 * Referencia a la última `folderMap` creada por buildParamsPane.
 * Antes de cada dispose() leemos `.expanded` de cada folder y lo persistimos
 * en folderExpandedState. Más fiable que un MutationObserver de clases.
 */
let lastFolderMap: Map<string, any> | null = null;

function captureFolderExpandedState() {
  if (!lastFolderMap) return;
  for (const [title, folder] of lastFolderMap.entries()) {
    try {
      const exp = (folder as any).expanded;
      if (typeof exp === "boolean") folderExpandedState.set(title, exp);
    } catch {}
  }
}

function loadExample(ex: ExampleDef) {
  currentExample = ex;
  // La barra de dibujo se pliega o se abre segun QUE se acaba de cargar. Va
  // aqui y no en el montaje porque el selector cambia de ejemplo sin tocar la
  // URL: decidirlo una sola vez al arrancar dejaba la barra abierta para
  // siempre en cuanto se entraba por `/workspace/` a secas.
  try { (window as any).__hekatanRibbonDefecto?.(ribbonPlegadaPara(ex.id)); } catch {}
  // Un ARCHIVO NUEVO abre la ventana «Cómo usar», igual que un ejemplo trae
  // su explicación: quien entra a un lienzo vacío no sabe ni por dónde
  // empezar. Se puede apagar desde la propia ventana («no volver a mostrar»).
  if (ex.id === "new-blank") {
    let mostrar = true;
    try { mostrar = localStorage.getItem("hk_guia_nuevo") !== "0"; } catch {}
    if (mostrar) setTimeout(() => { try { (window as any).__hekatanRibbon?.guia?.(true); } catch {} }, 700);
  }
  // Nuevo ejemplo cargado: permitir auto-fit inicial.
  userCameraInteracted = false;
  // Reset estado de folders (cada ejemplo tiene su propio layout).
  folderExpandedState.clear();
  // ── Hidratar Load Patterns / Cases / Combinations desde localStorage ──
  // Cada ejemplo tiene su propia configuración persistida por `ex.id`. Si
  // no hay nada guardado, se usan los defaults ETABS-like (Dead + Live).
  const persisted = loadPersistedLoadPatterns(ex.id);
  if (persisted) {
    loadPatterns.val = persisted.patterns;
    loadCases.val = persisted.cases;
    // ARCHIVO YA HECHO vs ARCHIVO NUEVO. La plantilla (Dead, Live, Modal y los
    // combos tipicos) es correcta para un archivo NUEVO — ETABS tambien arranca
    // con Dead y Live definidos. Pero cuando se ABRE un modelo tienen que
    // mandar LOS SUYOS, igual que en ETABS: abris un archivo y el desplegable
    // muestra sus casos, no unos de fabrica.
    // Antes habia un merge que reinyectaba la plantilla SIEMPRE, asi que un
    // archivo hecho no podia ganarle: se veian «Servicio D+L», «1.4D»,
    // «1.2D+1.6L» y «1.4D+1.7L» aunque el modelo no tuviera ninguna combinacion
    // — y de hecho el e2k del galpon no trae ni un solo $ LOAD COMBINATIONS.
    const traeCombos = Array.isArray(persisted.combinations) &&
                       persisted.combinations.length > 0;
    if (traeCombos || URL_HEKS) {
      // el modelo manda: se respeta lo que trae, aunque sea una lista vacia
      loadCombinations.val = (persisted.combinations ?? []).map((cm: any) => ({
        ...cm, cases: (cm.cases ?? []).map((c: any) => ({ ...c })),
      }));
    } else {
      loadCombinations.val = DEFAULT_LOAD_COMBINATIONS
        .map(cm => ({ ...cm, cases: cm.cases.map(c => ({ ...c })) }));
    }
  } else {
    // Clonar defaults — si no, todos los ejemplos compartirían la misma ref
    loadPatterns.val = DEFAULT_LOAD_PATTERNS.map(p => ({ ...p }));
    loadCases.val = DEFAULT_LOAD_CASES.map(c => ({
      ...c, patterns: c.patterns ? c.patterns.map(pp => ({ ...pp })) : undefined,
    }));
    loadCombinations.val = DEFAULT_LOAD_COMBINATIONS.map(cm => ({
      ...cm, cases: cm.cases.map(c => ({ ...c })),
    }));
  }
  // Default activeLoadCase = primer case (Dead) si no hay seleccionado
  if (!loadCases.val.find(c => c.name === activeLoadCase.val)) {
    activeLoadCase.val = loadCases.val[0]?.name ?? "Dead";
  }
  // ── Ejemplos legacy del upstream awatif (1d-mesh, beams, plate-q4, etc.):
  // tienen su propia UI VanJS toolbar y no encajan en el flujo Tweakpane del
  // workspace. El pane solo muestra un botón "Abrir ejemplo →" que navega
  // al index.html standalone. ──
  if (ex.standaloneUrl) {
    // Limpiar animaciones y estado del ejemplo previo
    const animKeys = ["__rbsK3Anim", "__bfpK3Anim", "__endPlateK3Anim"];
    for (const k of animKeys) {
      const id = (window as any)[k];
      if (id) { clearInterval(id); (window as any)[k] = null; }
    }
    try { modalAnimator?.stop?.(); } catch {}
    activeExampleVersion.v++;
    resetStates();
    currentParams = {};
    buildParamsPane();
    return;
  }
  // currentParams se almacena en la UNIDAD UI seleccionada. Los p.default
  // están escritos en SI (kN, kN·m) por convención; aquí los convertimos a
  // la unidad UI del usuario para que los sliders muestren valores coherentes.
  currentParams = Object.fromEntries(
    Object.entries(ex.params ?? {}).map(([k, p]) => {
      const valSI = p.default;
      if (p.unitType === "force")  return [k, fromKn(valSI)];
      if (p.unitType === "moment") return [k, fromKnm(valSI)];
      return [k, valSI];
    }),
  );
  // ── BUGFIX: limpiar animaciones del ejemplo previo antes de cambiar.
  // Sin esto, los setInterval siguen corriendo en background y al cambiar
  // de ejemplo modifican el deformScale del nuevo (causa lag y jank). ──
  const animKeys = ["__rbsK3Anim", "__bfpK3Anim", "__endPlateK3Anim"];
  for (const k of animKeys) {
    const id = (window as any)[k];
    if (id) {
      clearInterval(id);
      (window as any)[k] = null;
    }
  }
  // Detener animación modal si existe
  try { modalAnimator?.stop?.(); } catch {}
  // Invalidar derives de ejemplos previos (e.g. springs reactivos de zapatas)
  activeExampleVersion.v++;
  resetStates();
  // ── Reset settings de visibilidad del viewer ──
  // El botón "Ver TODAS las zapatas FEM" + algunos ejemplos apagan
  // elements/elemColumns/elemBeams/sections/etc. para mostrar solo la
  // cimentación. Esos toggles persisten en el van.state singleton del
  // viewer, así que al cambiar de ejemplo (o salir del modo FEM) las
  // columnas/vigas seguían invisibles. Forzamos defaults ON aquí para
  // que cada ejemplo arranque con la superestructura visible.
  ex.build?.(toSIParams(), states, modalPanel);

  // ── Auto-mesh shells ETABS-style (toggle global) ──
  // Si el usuario activó "Auto-mesh shells" en el Tweakpane, detectamos Q4
  // grandes (>2m lado) y los subdividimos en 5×5, también partiendo los
  // beams sobre sus edges. Reemplaza states.nodes/elements + re-corre solve.
  if (autoMeshShellsEnabled.val) {
    try {
      const nArr = states.nodes.rawVal ?? [];
      const eArr = states.elements.rawVal ?? [];
      if (nArr.length > 0 && eArr.length > 0) {
        const fakeModel = {
          nodes: [...nArr],
          elements: [...eArr],
          elementNames: new Array(eArr.length).fill(""),
          elementTypes: new Array(eArr.length).fill(""),
          elementStories: new Array(eArr.length).fill(""),
          elementSections: new Map(),
          elementInputs: states.elementInputs.rawVal,
        } as any;
        const stats = autoMeshShells(fakeModel, 2.0, 5);
        if (stats.newSlabElements > 0) {
          console.log(`[workspace] Auto-mesh: +${stats.newSlabElements} slab elems, +${stats.splitFrameSegments} frame segs, +${stats.newNodes} nodes`);
          // Re-distribuir loads (tributary por nodo de slab)
          const loadsOld = states.nodeInputs.rawVal?.loads ?? new Map();
          // Heurística: si los loads originales eran solo a 4 corners, re-distribuir tributary
          // Solo si hay 4 o menos loads gravity únicos
          const tribArea = new Map<number, number>();
          for (const e of fakeModel.elements) {
            if (e.length !== 4) continue;
            const p = e.map((n: number) => fakeModel.nodes[n]);
            const v1 = [p[1][0]-p[0][0], p[1][1]-p[0][1]];
            const v2 = [p[3][0]-p[0][0], p[3][1]-p[0][1]];
            const A = Math.abs(v1[0]*v2[1] - v1[1]*v2[0]);
            for (const ni of e) tribArea.set(ni, (tribArea.get(ni) ?? 0) + A/4);
          }
          // Si loads orig eran solo a 4 corners, asumimos UNIFF y redistribuimos
          // (TODO: leer q real del ExampleDef; por ahora preservamos load total)
          let totalFz = 0;
          for (const [, l] of loadsOld) totalFz += (l[2] ?? 0);
          if (loadsOld.size <= 4 && tribArea.size > 4) {
            const totalA = [...tribArea.values()].reduce((a, b) => a + b, 0);
            const qEq = totalA > 0 ? totalFz / totalA : 0;
            const newLoads = new Map();
            for (const [ni, A] of tribArea) newLoads.set(ni, [0, 0, qEq * A, 0, 0, 0]);
            states.nodeInputs.val = { ...states.nodeInputs.rawVal, loads: newLoads };
          }
          // Update states
          states.nodes.val = fakeModel.nodes;
          states.elements.val = fakeModel.elements;
          states.elementInputs.val = { ...fakeModel.elementInputs };
          // Re-solve
          states.deformOutputs.val = deform(fakeModel.nodes, fakeModel.elements,
            states.nodeInputs.rawVal, fakeModel.elementInputs);
          states.analyzeOutputs.val = analyze(fakeModel.nodes, fakeModel.elements,
            fakeModel.elementInputs, states.deformOutputs.rawVal);
        }
      }
    } catch (err) {
      console.warn("[workspace] Auto-mesh failed:", err);
    }
  }
  // ── Reset settings de visibilidad del viewer (DESPUÉS de build) ──
  // El botón "Ver TODAS las zapatas FEM" + ex.build() pueden apagar
  // elements/elemColumns/elemBeams/sections/etc. Esos toggles persisten
  // en el van.state singleton del viewer. Forzamos defaults ON aquí, Y
  // también con setTimeout multi-retry para sobrevivir cualquier código
  // que dispare async después de build.
  const resetViewerVis = () => {
    const sR = (viewerElm as any).__settings;
    if (!sR) return;
    if (sR.elements?.val !== undefined)    sR.elements.val = true;
    if (sR.nodes?.val !== undefined)       sR.nodes.val = true;
    if (sR.elemColumns?.val !== undefined) sR.elemColumns.val = true;
    if (sR.elemBeams?.val !== undefined)   sR.elemBeams.val = true;
    if (sR.sections?.val !== undefined)    sR.sections.val = true;
    if (sR.secColumns?.val !== undefined)  sR.secColumns.val = true;
    if (sR.secBeams?.val !== undefined)    sR.secBeams.val = true;
    if (sR.faces?.val !== undefined)       sR.faces.val = true;
    if (sR.edges?.val !== undefined)       sR.edges.val = true;
    if (sR.solids?.val !== undefined)      sR.solids.val = true;
  };
  resetViewerVis();
  [50, 200, 500, 1000].forEach((ms) => setTimeout(resetViewerVis, ms));
  // Aplica el colormap por defecto que cada ejemplo declara.
  // Si el anterior tenía seleccionado "pressure" y el nuevo no lo populó,
  // quedaría 0 everywhere — así evitamos ese caso.
  // ── Display scale automático para conexiones (modelo pequeño escala -6) ──
  // Las conexiones (RBS, BFP, End Plate, Placa Base) tienen modelos del orden
  // de 0.5–4m, mientras flechas/markers default son grandes. Reducir
  // displayScale al cargar evita que cargas/apoyos tapen la geometría.
  const isConexion = ex.id?.startsWith("conexion-") || ex.id === "placa-base";
  if (isConexion) {
    const s = (viewerElm as any).__settings;
    if (s?.displayScale) s.displayScale.val = -6;
  }
  if (ex.defaultShellResult || ex.defaultFrameResult) {
    const s = (viewerElm as any).__settings;
    if (s?.shellResults) s.shellResults.val = ex.defaultShellResult ?? "none";
    // Un ejemplo SIN cascaras tiene que poder abrir con un campo de BARRA: si
    // no, la barra de color sale a cero y parece un resultado nulo.
    if (s?.frameResults && ex.defaultFrameResult) s.frameResults.val = ex.defaultFrameResult;
    // Encender Loads y Supports por default para que el usuario vea la condición del modelo.
    if (s?.loads) s.loads.val = true;
    if (s?.supports) s.supports.val = true;
  }
  // Filtra el dropdown Shell results según lo que el ejemplo declara soportar.
  // "pressure" solo se ofrece en zapatas (con resortes Winkler); "bending*" solo
  // en elementos que flexan; "membrane*" solo en plane-stress; etc.
  filterShellResultOptions(ex.availableShellResults);
  autoScaleDeformedShape();
  autoFitCamera();
  buildParamsPane();
  mountCaseResultsInSettings();   // "Case results" (Dead/Live/Modal) junto a Frame/Shell results
  // Si el lienzo esta vacio pero hay un dibujo guardado de otra sesion, se
  // ofrece recuperarlo (no se impone: ver `ofrecerRecuperar`).
  try { setTimeout(ofrecerRecuperar, 1200); } catch {}
}

/**
 * Inyecta el selector "Case results" (Dead/Live/Modal) DENTRO del folder
 * "Analysis Outputs" del panel Settings, junto a Node/Frame/Shell results.
 * Reusa `activeLoadCase` + `rebuild()` (la misma lógica del panel Load Cases),
 * para que los tres selectores de resultado queden juntos. Se re-monta en cada
 * loadExample (las opciones de caso cambian por ejemplo).
 */
let __caseResultsBinding: any = null;
let __modalSettingsFolder: any = null;   // folder "⚡ Modal + Animación" dentro de Settings (Analysis Outputs)
let __lastModalResults: any = null;      // resultados modales (para listar los modos en "Case results")
let __modalTableShown = false;           // el panel/tabla modal solo se muestra si el usuario lo activa
// ── Estado EXPLÍCITO del modo modal ──────────────────────────────────────────
// Antes "¿el modal está activo?" se deducía de modalAnimator.isPlaying(), que es
// `rafId !== 0`. Eso lo apagaba solo en dos casos muy comunes:
//   (a) el modal no devolvió modos (tope de GDL) → el animador nunca arranca → rafId=0;
//   (b) el usuario pausó la animación.
// En ambos, el siguiente movimiento de slider dejaba de re-correr el modal Y ocultaba la
// tabla, sin forma de volver salvo apretar el botón otra vez. Con un flag explícito, una
// vez que se corre el modal queda activo: al cambiar pisos/vanos se recalcula con las
// dimensiones nuevas y la tabla solo se actualiza. Se apaga únicamente al elegir un caso
// no-modal (estático/combo), que es cuando el usuario realmente pidió otra cosa.
let __modalActivo = false;
/** true mientras el usuario ARRASTRA un slider (ev.last === false): rebuild() salta el modal. */
let __liveDrag = false;
let __spectrumShown = false;             // el espectro de diseño solo se muestra si el usuario lo activa
let __lastSpectrumHtml = "";             // último SVG del espectro NEC (para el panel separado)
let __spectrumPanel: HTMLDivElement | null = null;
function renderSpectrumPanel() {
  if (!__spectrumPanel) {
    __spectrumPanel = document.createElement("div");
    __spectrumPanel.style.cssText = "position:fixed; bottom:10px; left:10px; z-index:9998; background:rgba(0,0,0,0.92); border:1px solid #ff06; border-radius:6px; padding:8px 10px; box-shadow:0 4px 20px rgba(0,0,0,0.5);";
    document.body.appendChild(__spectrumPanel);
  }
  __spectrumPanel.innerHTML = `<div class="hk-sp-hdr" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;cursor:move;user-select:none"><b style="color:#ff0;font:12px monospace">📈 Espectro de diseño NEC-15</b><button id="__spclose" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:3px;cursor:pointer;font-size:10px;padding:2px 8px">✕</button></div>${__lastSpectrumHtml || "<div style='color:#888;font:11px monospace'>Corré el modal primero.</div>"}`;
  __spectrumPanel.style.display = __spectrumShown ? "block" : "none";
  __spectrumPanel.querySelector("#__spclose")?.addEventListener("click", () => { __spectrumShown = false; if (__spectrumPanel) __spectrumPanel.style.display = "none"; });
  // VENTANA ARRASTRABLE por el header.
  const hdr = __spectrumPanel.querySelector(".hk-sp-hdr") as HTMLElement | null;
  if (hdr) hdr.onmousedown = (ev: MouseEvent) => {
    if ((ev.target as HTMLElement)?.id === "__spclose") return;
    ev.preventDefault();
    const p = __spectrumPanel!; const r = p.getBoundingClientRect();
    p.style.bottom = "auto"; p.style.left = r.left + "px"; p.style.top = r.top + "px";
    const ox = ev.clientX - r.left, oy = ev.clientY - r.top;
    const mv = (e: MouseEvent) => { p.style.left = (e.clientX - ox) + "px"; p.style.top = (e.clientY - oy) + "px"; };
    const up = () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
  };
  // HOVER en la gráfica: crosshair + lectura (T, Sa).
  const svg = __spectrumPanel.querySelector(".hk-spectrum-svg") as SVGSVGElement | null;
  if (svg) attachSpectrumHover(svg);
}

function attachSpectrumHover(svg: SVGSVGElement) {
  const d = (k: string) => parseFloat(svg.getAttribute("data-" + k) || "0");
  const mL = d("ml"), mR = d("mr"), mT = d("mt"), mB = d("mb"), W = d("w"), H = d("h"), Tmax = d("tmax"), saMax = d("samax"), n = d("n");
  const saArr = (svg.getAttribute("data-sa") || "").split(",").map(Number);
  const X = (T: number) => mL + (T / Tmax) * (W - mL - mR);
  const Y = (sa: number) => H - mB - (sa / saMax) * (H - mB - mT);
  const ns = "http://www.w3.org/2000/svg";
  let g = svg.querySelector(".hk-hover") as SVGGElement | null;
  if (!g) { g = document.createElementNS(ns, "g"); g.setAttribute("class", "hk-hover"); (g.style as any).pointerEvents = "none"; svg.appendChild(g); }
  svg.style.cursor = "crosshair";
  svg.onmousemove = (e: MouseEvent) => {
    const r = svg.getBoundingClientRect();
    const sx = (e.clientX - r.left) * (W / (r.width || W));   // px pantalla → coord SVG
    let T = (sx - mL) / (W - mL - mR) * Tmax;
    T = Math.max(0, Math.min(Tmax, T));
    const fi = T / Tmax * n, i0 = Math.floor(fi), i1 = Math.min(i0 + 1, saArr.length - 1), f = fi - i0;
    const sa = (saArr[i0] ?? 0) * (1 - f) + (saArr[i1] ?? 0) * f;
    const xx = X(T), yy = Y(sa), bx = Math.min(xx + 5, W - 64);
    g!.innerHTML =
      `<line x1="${xx.toFixed(1)}" y1="${mT}" x2="${xx.toFixed(1)}" y2="${H - mB}" stroke="#f0f" stroke-width="0.8"/>` +
      `<circle cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" r="3" fill="#f0f"/>` +
      `<rect x="${bx.toFixed(1)}" y="${mT}" width="60" height="22" rx="3" fill="#000d" stroke="#f0f8"/>` +
      `<text x="${(bx + 4).toFixed(1)}" y="${mT + 9}" fill="#f8f" font-size="8">T=${T.toFixed(2)} s</text>` +
      `<text x="${(bx + 4).toFixed(1)}" y="${mT + 18}" fill="#f8f" font-size="8">Sa=${sa.toFixed(3)} g</text>`;
  };
  svg.onmouseleave = () => { if (g) g.innerHTML = ""; };
}
let __loadPanel: any = null;             // panel de Load Patterns/Cases (pane derecho) para sincronizar "Caso activo"

// ── Panel flotante de tablas de resultados (estilo ETABS → Analysis Results) ──
let __tablesPanel: HTMLDivElement | null = null;
function showResultsTable(title: string, html: string) {
  if (!__tablesPanel) {
    __tablesPanel = document.createElement("div");
    __tablesPanel.style.cssText = "position:fixed; bottom:10px; right:10px; z-index:9999; background:rgba(0,0,0,0.92); color:#0f0; font:12px monospace; border:1px solid #0f06; border-radius:6px; padding:8px 12px; max-width:46vw; max-height:60vh; overflow:auto; box-shadow:0 4px 20px rgba(0,0,0,0.5);";
    document.body.appendChild(__tablesPanel);
  }
  __tablesPanel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:#ff0">📋 ${title}</b><button id="__tclose" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:3px;cursor:pointer;font-size:10px;padding:2px 8px">✕</button></div>${html}`;
  __tablesPanel.style.display = "block";
  __tablesPanel.querySelector("#__tclose")?.addEventListener("click", () => { if (__tablesPanel) __tablesPanel.style.display = "none"; });
}
function __sd(): any { return (window as any).__hekatanSeismic; }
function __tbl(headers: string[], rows: (string | number)[][]): string {
  const th = headers.map((h) => `<th style="padding:2px 8px;border-bottom:1px solid #ff03;color:#ff0;text-align:right">${h}</th>`).join("");
  const tr = rows.map((r) => `<tr>${r.map((c) => `<td style="padding:1px 8px;text-align:right">${c}</td>`).join("")}</tr>`).join("");
  return `<table style="border-collapse:collapse"><tr>${th}</tr>${tr}</table>`;
}
const __needModal = "Poné <b>Case results = Modal</b> primero para correr el sísmico.";
const RESULT_TABLES: Record<string, () => void> = {
  "Base Reactions": () => { const d = __sd(); if (!d) return showResultsTable("Base Reactions", __needModal); showResultsTable(`Base Reactions — ${d.tag}`, __tbl(["Caso", "Fx (kN)", "Fy (kN)", "V (kN)"], [["Estático", d.base.Vest.toFixed(1), "—", d.base.Vest.toFixed(1)], ["Dinámico", d.base.Vx.toFixed(1), d.base.Vy.toFixed(1), d.base.Vdin.toFixed(1)]]) + `<div style="margin-top:5px;color:#888">Vdin/Vest = ${(d.base.ratio * 100).toFixed(0)} %  ·  E diseño = ${d.base.Edis.toFixed(1)} kN  ·  Ev = ${d.base.Ev.toFixed(1)} kN</div>`); },
  "Modal Periods & Mass": () => { const d = __sd(); if (!d) return showResultsTable("Modal", __needModal); const rows = d.modal.freqs.map((f: number, i: number) => [i + 1, f.toFixed(3), (f > 0 ? 1 / f : 0).toFixed(3), ((d.modal.massPart[i]?.[0] ?? 0) * 100).toFixed(1), ((d.modal.massPart[i]?.[1] ?? 0) * 100).toFixed(1), ((d.modal.massPart[i]?.[5] ?? 0) * 100).toFixed(1)]); showResultsTable("Modal Periods & Participating Mass", __tbl(["Modo", "f (Hz)", "T (s)", "Ux %", "Uy %", "Rz %"], rows)); },
  "Story Forces": () => { const d = __sd(); if (!d?.story?.length) return showResultsTable("Story Forces", __needModal); showResultsTable("Story Forces", __tbl(["Piso", "z (m)", "Fx (kN)", "Vx (kN)"], d.story.map((s: any) => [s.piso, s.z.toFixed(2), s.Fx.toFixed(1), s.Vx.toFixed(1)]))); },
  "Story Drifts": () => { const d = __sd(); if (!d?.story?.length) return showResultsTable("Story Drifts", __needModal); showResultsTable("Story Drifts (ΔM=0.75·R·ΔE ≤ 2%)", __tbl(["Piso", "z (m)", "δ (mm)", "ΔM (mm)", "deriva %", ""], d.story.map((s: any) => [s.piso, s.z.toFixed(2), s.delta.toFixed(1), s.dM.toFixed(1), s.drift.toFixed(2), s.ok ? "✓" : "✗"]))); },
  "Centers of Mass & Rigidity": () => { const d = __sd(); if (!d?.cmcr?.length) return showResultsTable("Centers of Mass & Rigidity", __needModal); showResultsTable("Centers of Mass & Rigidity (aprox.)", __tbl(["Piso", "z (m)", "CM x", "CM y", "CR x", "CR y", "e x", "e y"], d.cmcr.map((c: any) => [c.piso, c.z.toFixed(2), c.CMx.toFixed(2), c.CMy.toFixed(2), c.CRx.toFixed(2), c.CRy.toFixed(2), c.ex.toFixed(2), c.ey.toFixed(2)])) + `<div style="margin-top:5px;color:#888">e = CR − CM (excentricidad). e ≈ 0 → edificio regular, torsión mínima.</div>`); },
};

function mountCaseResultsInSettings() {
  try {
    const folder = (window as any).__hekatanOutputsFolder;
    if (!folder) return;
    if (__caseResultsBinding) { try { __caseResultsBinding.dispose(); } catch {} __caseResultsBinding = null; }
    const caseOptions: Record<string, string> = {};
    loadCases.val.forEach((c) => { caseOptions[c.name] = c.name; });
    if (!Object.keys(caseOptions).length) return;
    if (!loadCases.val.find((c) => c.name === activeLoadCase.val)) activeLoadCase.val = loadCases.val[0].name;
    // Combinaciones (como ETABS Case/COMBO/Mode): Σ factores × cargas de caso (1.4D, 1.2D+1.6L…).
    loadCombinations.val.forEach((cm: any) => { caseOptions[`Σ ${cm.name}`] = `__combo_${cm.name}`; });
    // Modos de vibración (como ETABS Case/Combo/MODE): al elegir un modo se ve su deformada.
    const freqs: number[] = __lastModalResults?.frequencies ?? [];
    freqs.forEach((f: number, i: number) => {
      const T = f > 0 ? 1 / f : 0;
      caseOptions[`◈ Modo ${i + 1} (T=${T.toFixed(3)}s)`] = `__mode_${i}`;
    });
    const obj = { case: activeLoadCase.val };
    __caseResultsBinding = folder.addBinding(obj, "case", { label: "Case results", options: caseOptions, index: 0 });
    __caseResultsBinding.on("change", (e: any) => {
      const v = String(e.value);
      if (v.startsWith("__mode_")) {
        // MODE: mostrar la deformada estática de ese modo (sin rebuild) — como ETABS.
        const idx = parseInt(v.slice(7), 10) || 0;
        try { modalAnimator?.showStatic(idx); } catch (err) { console.warn("showStatic", err); }
      } else if (v.startsWith("__combo_")) {
        // COMBO: rebuild() detecta el combo desde activeLoadCase y aplica Σ factores.
        // Es un caso estático → detener la animación modal si estaba corriendo.
        try { if (modalAnimator?.isPlaying?.()) modalAnimator.stop(); } catch {}
        __modalActivo = false;   // el usuario pidió un combo estático → salir del modo modal
        activeLoadCase.val = v.slice(8); rebuild();
      } else {
        // Si el caso elegido NO es modal, detener la animación para ver el resultado
        // estático (sin esto, rebuild() la re-animaría por el disparador isPlaying()).
        const selCase = loadCases.val.find((c) => c.name === e.value);
        if (!selCase?.type?.startsWith("Modal")) {
          try { if (modalAnimator?.isPlaying?.()) modalAnimator.stop(); } catch {}
          __modalActivo = false;   // caso estático elegido → salir del modo modal
        } else __modalActivo = true;
        activeLoadCase.val = e.value; rebuild();
        // Sincronizar el "Caso activo" del pane derecho (Load Cases) con esta selección.
        try { __loadPanel?.rebuildCases(); } catch {}
      }
    });
    // 📋 Tablas de resultados (estilo ETABS Analysis Results) — agregar una sola vez por folder.
    const hasTables = (folder.children || []).some((c: any) => { try { return c.title === "📋 Tablas"; } catch { return false; } });
    if (!hasTables) {
      const tf = folder.addFolder({ title: "📋 Tablas", expanded: false, index: 1 });
      for (const name of Object.keys(RESULT_TABLES)) {
        tf.addButton({ title: name }).on("click", () => RESULT_TABLES[name]());
      }
    }
    // (El modal + animación viven en su único folder "⚡ Modal + Animación" — sin duplicar acá.)
  } catch (e: any) { console.warn("[Case results en Settings]", e?.message ?? e); }
}

/**
 * Deja displayScale en 1 para que las flechas de carga/soportes no se inflen
 * y tapen el viewport. Al cambiar la carga, la deformada crece proporcionalmente
 * en valor absoluto; si el usuario necesita exagerarla visualmente, tiene el
 * slider "Display scale" en el panel Settings.
 */
/**
 * Calcula deformScale para que la deformada máxima sea ~5% del diagonal del modelo.
 * deformScale es independiente de displayScale (que afecta flechas de cargas/soportes).
 * Se auto-computa en cada build, dando visibilidad inicial. Cuando el usuario cambia
 * la carga (rebuild con mismos parámetros geométricos), deformScale se re-ajusta,
 * pero el usuario puede fijar un valor manual desde el slider "Deform scale".
 */
// Objetivo de la escala AUTOMATICA de la deformada, como fraccion de la
// diagonal del modelo. ETABS tiene su propio «Automatic» y NO esta en las
// cadenas del binario — el criterio vive en el codigo compilado. Se estimo
// comparando dos capturas del MISMO modelo y la MISMA vista, una con
// «User Defined = 20» y otra con «Automatic»: la automatica da del orden de 5
// a 6 para un Uz de 187 mm sobre 14.2 m de diagonal, o sea ~7 %.
// Struct venia con 15 % y por eso se veia el doble de exagerado que ETABS.
// OJO: 0.07 es una ESTIMACION de imagenes, no una medida. Para fijarlo bien
// hay que capturar las dos vistas al mismo zoom y medir en pixeles.
// Se puede mover a mano desde Settings -> deformScale, que es lo que
// finalmente manda.
const OBJETIVO_DEFORMADA = 0.07;

function autoScaleDeformedShape() {
  const s = (viewerElm as any).__settings;
  if (!s?.deformScale) return;
  const nodesArr = states.nodes.rawVal;
  const defMap = states.deformOutputs.rawVal?.deformations;
  if (!nodesArr?.length || !defMap) { s.deformScale.val = 1; return; }
  let xMin=Infinity,yMin=Infinity,zMin=Infinity,xMax=-Infinity,yMax=-Infinity,zMax=-Infinity;
  for (const n of nodesArr) {
    if (n[0]<xMin) xMin=n[0]; if (n[0]>xMax) xMax=n[0];
    if (n[1]<yMin) yMin=n[1]; if (n[1]>yMax) yMax=n[1];
    if (n[2]<zMin) zMin=n[2]; if (n[2]>zMax) zMax=n[2];
  }
  const diag = Math.sqrt((xMax-xMin)**2 + (yMax-yMin)**2 + (zMax-zMin)**2) || 1;

  // Compute MAX HORIZONTAL (Ux,Uy) and MAX VERTICAL (Uz) separately.
  let maxUh = 0, maxUz = 0;
  defMap.forEach((d) => {
    const h = Math.sqrt((d[0]||0)**2 + (d[1]||0)**2);
    const v = Math.abs(d[2]||0);
    if (h > maxUh) maxUh = h;
    if (v > maxUz) maxUz = v;
  });

  const dx = xMax - xMin, dy = yMax - yMin, dz = zMax - zMin;
  const isBuilding = dz > 1.1 * Math.max(dx, dy);

  let scale: number;
  let scaleZfactor: number;   // multiplicador extra para Z (deformScaleZ)

  if (isBuilding) {
    // EDIFICIO: el scale XY se calibra al sway horizontal (target 10% del diagonal).
    // El scaleZ se pone BAJO (~0.15) porque las columnas de concreto/acero son
    // axialmente RÍGIDAS: EA de una col 40×40 hormigón ≈ 4 MN/m, carga típica
    // 400 kN → acortamiento elástico ~0.1 mm/m, totalmente imperceptible en la
    // realidad. Amplificar Uz con el mismo factor XY las hace ver como 'alfeñique'.
    if (maxUh > 1e-9) {
      scale = Math.min(5000, Math.max(1, (OBJETIVO_DEFORMADA * diag) / maxUh));
    } else {
      scale = 10;  // caso gravitacional puro, scale fijo conservador
    }
    scaleZfactor = 0.15;  // Uz visible = 15% del Ux/Uy visible — refleja rigidez axial real
  } else {
    // PLACA / ZAPATA / SHELL / MURO A CORTE (Δz pequeña): la deformación
    // principal ES Uz (bending out-of-plane de una placa plana, o sag de zapata
    // sobre resortes Winkler). Amplificamos Uz NORMALMENTE (scaleZ=1) para que
    // el usuario VEA claramente la deformada, que es el objetivo didáctico.
    const refDef = Math.max(maxUh, maxUz);
    if (refDef < 1e-30) { s.deformScale.val = 1; return; }
    scale = Math.min(50000, Math.max(1, (OBJETIVO_DEFORMADA * diag) / refDef));
    scaleZfactor = 1.0;   // Uz = XY: zapatas/placas muestran la deformada completa
  }
  s.deformScale.val = Math.max(1, scale);
  if (s.deformScaleZ) s.deformScaleZ.val = scaleZfactor;
  // Display scale: −1.5 default (flechas pequeñas) pero −6 para conexiones
  // (modelo de orden 0.5–4 m, evitar que markers tapen geometría).
  const isConexion = currentExample?.id?.startsWith("conexion-") ||
                     currentExample?.id === "placa-base";
  if (s.displayScale) s.displayScale.val = isConexion ? -6 : -3;
}

/**
 * Auto-fit de cámara al modelo actual. Reencuadra el viewer para que el edificio
 * /placa/etc. entre en pantalla con un margen razonable, sin que ocupe toda la
 * plataforma. Se llama después de cada build/rebuild.
 */
function autoFitCamera() {
  const ctx = (viewerElm as any).__ctx;
  if (!ctx) return;
  const { camera, controls, render, perspCamera, orthoCamera } = ctx;
  const s = (viewerElm as any).__settings;
  const gridSz = s?.gridSize?.rawVal ?? 10;
  const nodesArr = states.nodes.rawVal || [];
  // Bounding box del modelo (si hay nodos)
  let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
  for (const n of nodesArr) {
    if (!isFinite(n[0]) || !isFinite(n[1]) || !isFinite(n[2])) continue;
    if (n[0]<minX) minX=n[0]; if (n[0]>maxX) maxX=n[0];
    if (n[1]<minY) minY=n[1]; if (n[1]>maxY) maxY=n[1];
    if (n[2]<minZ) minZ=n[2]; if (n[2]>maxZ) maxZ=n[2];
  }
  let cx = nodesArr.length ? (minX+maxX)/2 : 0;
  let cy = nodesArr.length ? (minY+maxY)/2 : 0;
  let cz = nodesArr.length ? (minZ+maxZ)/2 : 0;
  const dx = nodesArr.length ? maxX-minX : 0;
  const dy = nodesArr.length ? maxY-minY : 0;
  const dz = nodesArr.length ? maxZ-minZ : 0;
  const modelExtent = Math.sqrt(dx*dx+dy*dy+dz*dz);
  // ── Lienzo vacío o modelo más chico que la grilla → encuadrar la GRILLA ──
  // (sin esto la cámara colapsaba sobre el origen y la grilla quedaba invisible
  //  + se encogía a tamaño 2; el usuario veía todo negro). Encuadramos la
  //  grilla centrada en el origen y NO la encogemos.
  //
  // ⚠️ El umbral era `modelExtent < gridSz * 0.5`. Con la grilla a 10 m se
  // notaba poco, pero al subirla a 30 —para que cubriera una planta corriente—
  // CUALQUIER estructura de menos de 15 m se encuadraba sobre la grilla y
  // quedaba diminuta en el centro: un portico de 5x3 m salia del tamano de una
  // moneda (cli/shots/modelado/f_0173.png). Si hay modelo se encuadra el
  // MODELO; la grilla solo manda cuando no hay nada que mirar.
  const frameGrid = nodesArr.length === 0 || modelExtent < 1e-6;
  if (frameGrid) { cx = 0; cy = 0; cz = 0; }
  const extent = Math.max(frameGrid ? gridSz : modelExtent, 2);
  controls.target.set(cx, cy, cz);

  // Si la cámara activa es ortográfica, sólo recalcular frustum (preservar
  // orientación de planta/elevación que el usuario eligió). NO reposicionar
  // a iso porque sino destruimos la vista CAD que el usuario seleccionó.
  if (orthoCamera && camera === orthoCamera) {
    const w = (viewerElm as HTMLElement).clientWidth || window.innerWidth;
    const h = (viewerElm as HTMLElement).clientHeight || window.innerHeight;
    const aspect = w / h;
    const halfH = Math.max(extent * 0.6, 5);
    orthoCamera.left = -halfH * aspect; orthoCamera.right = halfH * aspect;
    orthoCamera.top = halfH; orthoCamera.bottom = -halfH;
    orthoCamera.updateProjectionMatrix();
    controls.update();
    render?.();
    // Solo ajustar el tamaño de grilla cuando el modelo es MÁS GRANDE que ella.
    if (!frameGrid && s?.gridSize) s.gridSize.val = Math.max(Math.ceil(Math.max(dx, dy) * 1.2), 2);
    return;
  }

  // Cámara perspectiva → reposicionar isométrica (comportamiento original)
  const dist = 2.2 * extent;
  const k = dist / Math.sqrt(3);
  const vf = currentExample?.viewFrom ?? [1, -1, 1];   // octante de la iso (ver ExampleDef.viewFrom)
  camera.position.set(cx + Math.sign(vf[0] || 1) * k, cy + Math.sign(vf[1] || -1) * k, cz + Math.sign(vf[2] || 1) * k);
  camera.up.set(0, 0, 1);
  if ((camera as any).isPerspectiveCamera) {
    (camera as THREE.PerspectiveCamera).near = extent * 0.001;
    (camera as THREE.PerspectiveCamera).far = extent * 50;
  }
  camera.updateProjectionMatrix();
  camera.lookAt(cx, cy, cz);
  controls.update();
  render?.();
  if (!frameGrid && s?.gridSize) s.gridSize.val = Math.max(Math.ceil(Math.max(dx, dy) * 1.2), 2);
}

/** Oculta opciones no aplicables del <select> "Shell results" del Settings HTML
 *  y sincroniza su display con el estado actual de shellResults. */
function filterShellResultOptions(allowed?: string[]) {
  const selects = viewerElm.querySelectorAll<HTMLSelectElement>("select");
  // OJO: el `value` del <option> del DOM es el LABEL de Tweakpane (estilo ETABS:
  // "M11 (bendingXX)", "Von Mises", "pressure"); el ESTADO usa el nombre interno
  // (bendingXX, vonMises, pressure). El shell select es el único que tiene "pressure".
  // El value del <option> del DOM es el LABEL de Tweakpane (formato ETABS: "M11", "F11",
  // "FVM", "Pressure (suelo)"…). Mapeamos label → nombre interno del estado.
  const LABEL2INTERNAL: Record<string, string> = {
    none: "none",
    F11: "membraneXX", F22: "membraneYY", F12: "membraneXY",
    FMax: "membranePrincipalMax", FMin: "membranePrincipalMin", FVM: "vonMises",
    V13: "tranverseShearX", V23: "tranverseShearY", VMax: "transverseShearMax",
    M11: "bendingXX", M22: "bendingYY", M12: "bendingXY",
    MMax: "bendingPrincipalMax", MMin: "bendingPrincipalMin",
    "Pressure (suelo)": "pressure", Ux: "displacementX", Uy: "displacementY", Uz: "displacementZ",
  };
  const internalOf = (label: string): string => LABEL2INTERNAL[label] ?? label;
  // El shell select es el único con la opción "M11" (flexión de placa).
  const shellSelect = Array.from(selects).find((s) =>
    Array.from(s.options).some((o) => o.value === "M11")
  );
  if (!shellSelect) return;
  for (const opt of Array.from(shellSelect.options)) {
    const internal = internalOf(opt.value);
    // "none" siempre. "pressure" es de FUNDACIÓN (presión del suelo Winkler) → solo si el
    // ejemplo lo declara (NO en losas/muros). El resto: si está en la lista, o si el
    // ejemplo no declaró lista (tabla completa estilo ETABS).
    const show = internal === "none"
      ? true
      : internal === "pressure"
        ? !!allowed?.includes("pressure")
        : (!allowed || allowed.includes(internal));
    opt.hidden = !show;
    opt.disabled = !show;
  }
  const s = (viewerElm as any).__settings;
  if (s?.shellResults) {
    // Si el estado quedó en una opción OCULTA (p.ej. 'pressure' heredado en losas/muros)
    // → caer al default del ejemplo (o vonMises). El estado usa el NOMBRE INTERNO.
    const visibles = Array.from(shellSelect.options).filter((o) => !o.hidden).map((o) => internalOf(o.value));
    if (!visibles.includes(s.shellResults.val)) {
      s.shellResults.val = currentExample?.defaultShellResult || "vonMises";
    }
    // Forzar el <select> del DOM a la opción correcta (su value es el LABEL, no el interno).
    const idx = Array.from(shellSelect.options).findIndex((o) => internalOf(o.value) === s.shellResults.val && !o.hidden);
    if (idx >= 0 && shellSelect.selectedIndex !== idx) {
      shellSelect.selectedIndex = idx;
      try { shellSelect.dispatchEvent(new Event("change", { bubbles: true })); } catch {}
    }
  }
}

/**
 * Convierte currentParams (que se almacena en la unidad UI seleccionada por
 * el usuario) a unidades SI (kN, kN·m, m) ANTES de pasar al build() del
 * ejemplo. Así los ejemplos siempre trabajan en SI, independientemente de
 * lo que el usuario haya seleccionado en "Unidades".
 */
function toSIParams(): Record<string, number> {
  if (!currentExample) return {};
  const si: Record<string, number> = { ...currentParams };
  for (const [k, p] of Object.entries(currentExample.params)) {
    if (p.unitType === "force")  si[k] = toKn(currentParams[k]);
    if (p.unitType === "moment") si[k] = toKnm(currentParams[k]);
    // disp: convertir UI → m (aún no implementado — agregar dispToM si necesario)
  }
  return si;
}

function rebuild() {
  if (!currentExample) return;
  resetStates();
  // Caso activo accesible al build del ejemplo (para aplicar cargas por caso: Dead/Live/…).
  (window as any).__hekatanActiveCase = activeLoadCase.val;
  // Si el caso activo es una COMBINACIÓN, exponer sus factores (Σ deadF·Dead + liveF·Live).
  const __cm = loadCombinations.val.find((c: any) => c.name === activeLoadCase.val);
  if (__cm) {
    let deadF = 0, liveF = 0;
    __cm.cases.forEach((cc: any) => { if (cc.case === "Dead") deadF += cc.scaleFactor; else if (cc.case === "Live") liveF += cc.scaleFactor; });
    (window as any).__hekatanActiveCombo = { deadF, liveF };
  } else {
    (window as any).__hekatanActiveCombo = null;
  }
  currentExample.build(toSIParams(), states, modalPanel);

  // ── Active Case dispatcher ──
  // Tras el build() estático, si el case activo es Modal-* y el ejemplo
  // implementa runModal, lo invocamos automáticamente para que el viewer
  // muestre los modos del case activo (no requiere botón "Run Modal"
  // manual — el cambio en el dropdown "▶ Run case" lo dispara solo).
  // Para cases Linear Static / Pushover etc se mantiene el build static.
  try {
    const activeName = activeLoadCase.val;
    const active = loadCases.val.find(c => c.name === activeName);
    const isModalCase = !!active?.type.startsWith("Modal");
    // ¿La animación modal está corriendo? Si el usuario corrió el modal y mueve
    // un slider, queremos recomputar Y re-animar con el modelo nuevo — AUNQUE el
    // selector de resultados activo no se llame literalmente "Modal-…" (el nombre
    // del caso es frágil). isPlaying() es el disparador robusto.
    let modalPlaying = false;
    try { modalPlaying = !!modalAnimator?.isPlaying?.(); } catch {}
    // Durante el ARRASTRE de un slider (ev.last === false) NO se recalcula el modal: con un dual de
    // 8 pisos son segundos de WASM síncrono por cada tick del ratón → la página se "cuelga"
    // (6-sep-2026, deploy público). El modal se recalcula al soltar (ev.last === true).
    if (__liveDrag) {
      modalPlaying = false;
      // Y si estaba animando, se PAUSA sin restaurar: sus nodos originales son del modelo de antes
      // del arrastre (otro número de nudos) y restaurarlos encima del nuevo corrompe la geometría.
      try { if (modalAnimator?.isPlaying?.()) modalAnimator.pause(); } catch {}
    }
    // __modalActivo se mantiene aunque el modal no haya devuelto modos o la animación
    // esté pausada → el modal sigue "puesto" y acompaña a los sliders.
    if (!__liveDrag && (isModalCase || modalPlaying || __modalActivo) && currentExample.runModal) {
      // Re-correr el modal Y re-animar con el MODELO NUEVO. Antes esto llamaba al
      // `modalPanel` pelado, que actualiza la tabla pero NO el animador → al mover
      // un slider la animación se quedaba con el modo viejo. Ruteamos por
      // `__hekatanRunModalAnimate` (= captureModalPanel → setResults+play), que
      // re-snapshotea los nodos rehechos y re-anima el modo 1. Fallback al pelado.
      // Diferido a la siguiente vuelta del event loop: así el modelo estático nuevo se PINTA antes
      // de que el modal bloquee el hilo, y el usuario ve que algo pasó en vez de una pantalla congelada.
      const animate = (window as any).__hekatanRunModalAnimate;
      const ex = currentExample;
      window.setTimeout(() => {
        if (ex !== currentExample) return;   // cambió de ejemplo mientras tanto
        if (typeof animate === "function") animate();
        else ex.runModal!(toSIParams(), states, modalPanel);
      }, 0);
      // Solo mostrar el panel/tabla si el usuario activó "Mostrar tabla" (Settings).
      modalPanel.div.style.display = __modalTableShown ? "block" : "none";
    } else if (!__modalTableShown) {
      // Ocultar SOLO si el usuario no dejó la tabla abierta. Antes esto la cerraba de
      // golpe en cuanto el modal dejaba de estar activo (p.ej. al pasarse del tope de
      // GDL): la tabla debe quedarse y limitarse a actualizarse.
      modalPanel.div.style.display = "none";
    }
  } catch (e: any) {
    console.warn(`[active case dispatcher] ${e?.message ?? e}`);
  }

  // NO auto-escalar en rebuild — así cuando el usuario sube la carga,
  // la deformada crece visualmente (scale fijo × w creciente).
  // El auto-scale solo se llama en loadExample (primer build) para dar
  // una escala inicial razonable; después el usuario puede ajustarla
  // manualmente desde el slider "Deform scale".
  // autoScaleDeformedShape();   ← REMOVIDO
  // Sólo recentrar cámara si el usuario NO ha tocado los OrbitControls.
  // Esto permite mover sliders (nVanos, q, secciones, etc.) en modo "live
  // calc" sin que la vista se resetee a iso en cada drag.
  if (!userCameraInteracted) autoFitCamera();
  // Refrescar el folder "📊 Calculados" con los nuevos valores derivados
  if (currentExample.computedLabels && computedObj) {
    const latest = currentExample.computedLabels(currentParams, states);
    for (const key of Object.keys(computedObj)) {
      if (key in latest) computedObj[key] = latest[key];
    }
  }
  // Refrescar los valores INLINE (ks debajo de ks_factor, etc.)
  if (currentExample.inlineComputed && inlineComputedObj) {
    for (const ic of currentExample.inlineComputed) {
      const uniqKey = `__inline_${ic.after}_${ic.label}`;
      inlineComputedObj[uniqKey] = ic.compute(currentParams, states);
    }
  }
  currentPane?.refresh();
}

/**
 * ¿La barra de dibujo arranca PLEGADA con este ejemplo?
 *
 * Plegada en todo lo que sea un modelo ya resuelto —que es casi el catálogo
 * entero— y abierta solo en los lienzos donde se viene a DIBUJAR, porque ahí la
 * barra es lo único de la pantalla que dice qué hacer.
 *
 * ⚠️ Se llama en CADA carga de ejemplo, no una vez al arrancar. El selector
 * cambia de ejemplo **sin tocar la URL**, así que decidirlo mirando `?t=` deja
 * la barra abierta para siempre en cuanto se entra por `/workspace/` a secas y
 * luego se elige del desplegable — que es justo como se entra normalmente.
 */
function ribbonPlegadaPara(id?: string | null): boolean {
  const dibujar = ["new-blank", "cad-draw", "cad-editor", "inicio", "drawing"];
  return !!id && !dibujar.includes(id);
}

// Expose rebuild + autoFitCamera al window para test/debug via DOM
// (también usado por el csi-importer para forceRebuildAndFit).
(window as any).__hekatanRebuild = rebuild;
(window as any).__hekatanAutoFit = autoFitCamera;

// Y los PARÁMETROS vivos, para poder barrer un ejemplo desde fuera:
//     window.__hekatanParams().na = 16;  window.__hekatanRebuild();
// Hace falta para capturar series (la convergencia de un banco, un barrido de
// espesor) sin tocar el solver por dentro: así lo que se mide es lo mismo que
// vería el usuario moviendo el slider. Lo usa `cli/gif_itw_convergencia.mjs`.
// Se devuelve el objeto vivo, no una copia — mutarlo y llamar a `rebuild()` es
// justo el camino que sigue Tweakpane.
(window as any).__hekatanParams = () => currentParams;
(window as any).__hekatanExample = () => currentExample?.id ?? null;

// Y los SETTINGS vivos del viewer (los de su panel "Settings"): es por donde se
// enciende la deformada o se elige el campo del colormap desde fuera.
//     window.__hekatanSettings().shellResults = "bendingXX";
// Sin esto habia que ir a buscar `__settings` trepando por los padres del
// canvas — que funciona hasta que cambia el arbol del DOM y entonces el script
// devuelve `undefined` sin decir por que. Lo usa
// `cli/shot_plantillas_colormap.mjs`.
(window as any).__hekatanSettings = () => (viewerElm as any).__settings;
// La lista de ejemplos, para que los barridos de la CLI no lleven una copia
// que se queda vieja en cuanto se anade uno.
/**
 * Poner un parametro y reconstruir, DESDE FUERA.
 *
 * Es para que los barridos de la CLI midan lo que ve el usuario y no lo que
 * monta el propio script: sin esto un CLI se arma su modelo a mano, sale un
 * numero, y no hay forma de saber si la APP da el mismo. Paso justo eso con el
 * modelo real —el CLI decia -10.75 mm y la app CERO—, y no se vio hasta que se
 * midio la app de verdad.
 */
(window as any).__hekatanSetParam = (clave: string, valor: number) => {
  currentParams[clave] = valor;
  rebuild();
  return currentParams[clave];
};
(window as any).__hekatanGetParams = () => ({ ...currentParams });

(window as any).__hekatanExamples = examplesRegistry.map(
  (e) => ({ id: e.id, name: e.name, category: e.category }));

// ── Auto re-fit camera al cambiar de tamaño (mobile rotation) ──
// El #viewer cambia de tamaño con CSS media queries (ej. en mobile
// portrait el canvas pasa a 50vh) — el ResizeObserver del viewer
// ya actualiza el aspect ratio de la cámara, pero NO refittea el
// frustum sobre el modelo. Sin esto, al rotar el dispositivo o al
// abrir la app en mobile, el modelo queda parcialmente clippeado.
// Debouncing 200ms para no spammear cuando el browser dispara
// múltiples resize events durante la rotación.
let _refitTimer: ReturnType<typeof setTimeout> | null = null;
const scheduleRefit = (delay = 200) => {
  if (_refitTimer) clearTimeout(_refitTimer);
  _refitTimer = setTimeout(() => {
    try { autoFitCamera(); } catch {}
    _refitTimer = null;
  }, delay);
};
window.addEventListener("resize", () => scheduleRefit(200));
window.addEventListener("orientationchange", () => scheduleRefit(350));

// ── Wire de Properties Pane (hekatan-ui drawing.ts) → states FEM ──
// El Properties Pane fires "hk:property-applied" cuando el usuario
// configura DOFs/cargas/masa y aprieta "Aplicar". Aquí mantenemos
// __hekatanManualSupports / __hekatanManualLoads / __hekatanManualMass
// indexados por drawingPtIdx. Los ejemplos (newBlank.ts) los mergean
// con apoyos automáticos en su build() matchando por coords.
(window as any).__hekatanManualSupports = (window as any).__hekatanManualSupports
  ?? new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
(window as any).__hekatanManualLoads = (window as any).__hekatanManualLoads
  ?? new Map<number, [number, number, number, number, number, number]>();
(window as any).__hekatanManualMass = (window as any).__hekatanManualMass
  ?? new Map<number, number>();
// Manual sections asignadas a frames (segs). Key = "polylineIdx:segIdx", value =
// propiedades de sección. newBlank.ts las mergea sobre las sec rectangular default.
type SectionProps = { A: number; Iz: number; Iy: number; J: number; name?: string };
(window as any).__hekatanManualSections = (window as any).__hekatanManualSections
  ?? new Map<string, SectionProps>();
// Manual joint springs (Kx, Ky, Kz, Krx, Kry, Krz). Key = drawingPtIdx.
// Se convierte a deform() springsList = Array<{node, dof, k}> en newBlank.
(window as any).__hekatanManualSprings = (window as any).__hekatanManualSprings
  ?? new Map<number, [number, number, number, number, number, number]>();
// Property modifiers (multipliers de A, Iz, Iy, J) por segmento.
type FrameMods = { A: number; Iz: number; Iy: number; J: number };
(window as any).__hekatanManualModifiers = (window as any).__hekatanManualModifiers
  ?? new Map<string, FrameMods>();
// Material override por segmento (afecta E, G, nu, ρ).
(window as any).__hekatanManualMaterial = (window as any).__hekatanManualMaterial
  ?? new Map<string, string>();
// Releases I/J por segmento (booleans Mx/My/Mz × 2 ends).
type FrameReleases = { i: [boolean, boolean, boolean]; j: [boolean, boolean, boolean] };
(window as any).__hekatanManualReleases = (window as any).__hekatanManualReleases
  ?? new Map<string, FrameReleases>();
// Mass per length por segmento (kg/m).
(window as any).__hekatanManualMassPerM = (window as any).__hekatanManualMassPerM
  ?? new Map<string, number>();
// Diaphragm assignment por nodo (string label, "Ninguno"|"D1 (rigid)"|...).
(window as any).__hekatanManualDiaphragm = (window as any).__hekatanManualDiaphragm
  ?? new Map<number, string>();
// Hinges plastic por segmento (string identifier).
(window as any).__hekatanManualHinges = (window as any).__hekatanManualHinges
  ?? new Map<string, string>();
// Insertion point + Local axes β por segmento.
(window as any).__hekatanManualInsertionPoint = (window as any).__hekatanManualInsertionPoint
  ?? new Map<string, string>();
(window as any).__hekatanManualBeta = (window as any).__hekatanManualBeta
  ?? new Map<string, number>();
// Line springs (kN/m por m) Winkler distribuido por segmento.
(window as any).__hekatanManualLineSprings = (window as any).__hekatanManualLineSprings
  ?? new Map<string, [number, number, number]>();
// ── Material database completo — estilo ETABS Material Property Data ──
// Cada material tiene todos los campos del ETABS dialog: General, Weight/Mass,
// Mechanical (E, ν, α, G), Design (Fy/Fu/fc según tipo), región/standard/grado.
type MaterialType = "Steel" | "Concrete" | "Aluminum" | "ColdFormed" | "Rebar" | "Tendon" | "Masonry" | "Other";
type Material = {
  name: string;
  type: MaterialType;
  symmetry: "Isotropic" | "Orthotropic" | "Anisotropic";
  color?: string;
  weightDensity: number;   // kN/m³ (peso por unidad de volumen)
  massDensity: number;     // kg/m³
  E: number;               // Pa (módulo elasticidad)
  nu: number;              // Poisson
  alpha: number;           // 1/°C (expansión térmica)
  G?: number;              // Pa (auto = E/(2(1+ν)) para isotrópico)
  // Design properties (según tipo)
  Fy?: number;             // Pa — yield stress (Steel/Rebar)
  Fu?: number;             // Pa — ultimate stress (Steel/Rebar)
  fc?: number;             // Pa — f'c (Concrete)
  region?: string;
  standard?: string;
  grade?: string;
};
// Catálogo inicial estilo ETABS (US units convertidos a SI)
const MATERIALS_INITIAL: Record<string, Material> = {
  // ── Steel — USA ASTM ──
  "A992Fy50": {
    name: "A992Fy50", type: "Steel", symmetry: "Isotropic", color: "#3b82f6",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 344.74e6, Fu: 448.16e6,
    region: "United States", standard: "ASTM A992", grade: "Grade 50",
  },
  "A36": {
    name: "A36", type: "Steel", symmetry: "Isotropic", color: "#3b82f6",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 248.21e6, Fu: 399.90e6,
    region: "United States", standard: "ASTM A36", grade: "—",
  },
  "A572Gr50": {
    name: "A572Gr50", type: "Steel", symmetry: "Isotropic", color: "#3b82f6",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 344.74e6, Fu: 448.16e6,
    region: "United States", standard: "ASTM A572", grade: "Grade 50",
  },
  "A53Gr.B": {
    name: "A53Gr.B", type: "Steel", symmetry: "Isotropic", color: "#3b82f6",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 241.32e6, Fu: 413.69e6,
    region: "United States", standard: "ASTM A53", grade: "Grade B",
  },
  "A500Gr.B-46": {
    name: "A500Gr.B-46", type: "Steel", symmetry: "Isotropic", color: "#3b82f6",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 317.16e6, Fu: 399.90e6,
    region: "United States", standard: "ASTM A500", grade: "Grade B Fy=46",
  },
  "A913Gr65": {
    name: "A913Gr65", type: "Steel", symmetry: "Isotropic", color: "#3b82f6",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 448.16e6, Fu: 551.58e6,
    region: "United States", standard: "ASTM A913", grade: "Grade 65",
  },
  // ── Concrete — USA ──
  "4000Psi": {
    name: "4000Psi", type: "Concrete", symmetry: "Isotropic", color: "#a3a3a3",
    weightDensity: 23.563, massDensity: 2402.76, E: 24855.58e6, nu: 0.20, alpha: 9.9e-6,
    fc: 27.58e6,  // 4000 psi
    region: "United States", standard: "—", grade: "f'c=4000 psi",
  },
  "5000Psi": {
    name: "5000Psi", type: "Concrete", symmetry: "Isotropic", color: "#a3a3a3",
    weightDensity: 23.563, massDensity: 2402.76, E: 27801.39e6, nu: 0.20, alpha: 9.9e-6,
    fc: 34.47e6,  // 5000 psi
    region: "United States", standard: "—", grade: "f'c=5000 psi",
  },
  "concrete": {
    name: "concrete", type: "Concrete", symmetry: "Isotropic", color: "#a3a3a3",
    weightDensity: 23.563, massDensity: 2402.76, E: 24855.58e6, nu: 0.20, alpha: 9.9e-6,
    fc: 27.58e6,
    region: "User", standard: "—", grade: "Default",
  },
  // ── Concrete — EU ──
  "C25/30": {
    name: "C25/30", type: "Concrete", symmetry: "Isotropic", color: "#a3a3a3",
    weightDensity: 24, massDensity: 2400, E: 31e9, nu: 0.20, alpha: 1.0e-5,
    fc: 25e6,
    region: "Europe", standard: "EN 1992", grade: "C25/30",
  },
  "C30/37": {
    name: "C30/37", type: "Concrete", symmetry: "Isotropic", color: "#a3a3a3",
    weightDensity: 24, massDensity: 2400, E: 33e9, nu: 0.20, alpha: 1.0e-5,
    fc: 30e6,
    region: "Europe", standard: "EN 1992", grade: "C30/37",
  },
  // ── Rebar — USA ──
  "A615Gr60": {
    name: "A615Gr60", type: "Rebar", symmetry: "Isotropic", color: "#dc2626",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 413.69e6, Fu: 620.53e6,
    region: "United States", standard: "ASTM A615", grade: "Grade 60",
  },
  "A615Gr40": {
    name: "A615Gr40", type: "Rebar", symmetry: "Isotropic", color: "#dc2626",
    weightDensity: 76.97, massDensity: 7849, E: 199948e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 275.79e6, Fu: 482.63e6,
    region: "United States", standard: "ASTM A615", grade: "Grade 40",
  },
  // ── Tendon — USA ──
  "A416Gr270": {
    name: "A416Gr270", type: "Tendon", symmetry: "Isotropic", color: "#7c3aed",
    weightDensity: 76.97, massDensity: 7849, E: 196500e6, nu: 0.30, alpha: 1.17e-5,
    Fy: 1689.5e6, Fu: 1861.6e6,
    region: "United States", standard: "ASTM A416", grade: "Grade 270 (low-relaxation)",
  },
};
// Clonar a un Map mutable que el usuario puede modificar/expandir vía UI
const _matMap: Map<string, Material> = new Map();
for (const [k, v] of Object.entries(MATERIALS_INITIAL)) _matMap.set(k, { ...v });
(window as any).__hekatanMaterials = _matMap;
// Mantener __hekatanMaterialDB legacy (usado por newBlank.ts) — re-derived
// como vista simplificada {E, nu, rho} desde __hekatanMaterials en cada acceso.
const refreshMaterialDB = () => {
  const db: Record<string, { E: number; nu: number; rho: number; G?: number; Fy?: number; Fu?: number; fc?: number }> = {};
  for (const [name, m] of _matMap.entries()) {
    db[name] = {
      E: m.E, nu: m.nu, rho: m.massDensity,
      G: m.G ?? m.E / (2 * (1 + m.nu)),
      Fy: m.Fy, Fu: m.Fu, fc: m.fc,
    };
  }
  (window as any).__hekatanMaterialDB = db;
};
refreshMaterialDB();
(window as any).__hekatanRefreshMaterialDB = refreshMaterialDB;

// ── Material Property Data editor (modal Tweakpane estilo ETABS) ──
// Abre un overlay con TODOS los campos: nombre, tipo, simetría, color, densidades,
// E, ν, α, G (auto), Fy/Fu/fc según tipo, región/standard/grado.
// El nuevo material se guarda en __hekatanMaterials, refreshMaterialDB() para
// que newBlank lo vea, y dispara rebuild.
const openMaterialEditor = (existingName: string | null) => {
  // Material a editar (clone) o nuevo con defaults
  const isNew = !existingName;
  const m: Material = isNew
    ? {
        name: "MAT", type: "Other", symmetry: "Isotropic", color: "#ec4899",
        weightDensity: 0, massDensity: 0, E: 24855.58e6, nu: 0.20, alpha: 9.9e-6,
        region: "User", standard: "—", grade: "—",
      }
    : { ...(_matMap.get(existingName!) as Material) };

  // Backdrop
  const backdrop = document.createElement("div");
  backdrop.id = "hk-mat-editor-backdrop";
  backdrop.style.cssText = [
    "position:fixed", "inset:0", "background:rgba(0,0,0,0.5)",
    "z-index:9999", "display:flex", "align-items:center", "justify-content:center",
  ].join(";") + ";";
  // Container
  const cont = document.createElement("div");
  cont.style.cssText = [
    "width:min(420px, 95vw)", "max-height:90vh", "overflow-y:auto",
    "background:rgba(20,20,20,0.96)", "border:1px solid rgba(255,255,255,0.15)",
    "border-radius:8px", "box-shadow:0 12px 36px rgba(0,0,0,0.6)",
    "color:#ddd",
  ].join(";") + ";";
  backdrop.appendChild(cont);

  const editorPane = new Pane({ container: cont, title: isNew ? "🧱 Add New Material" : `🧱 Modify Material — ${existingName}` });

  // ── General Data ──
  const fGen = editorPane.addFolder({ title: "General Data" });
  fGen.addBinding(m, "name", { label: "Name" });
  fGen.addBinding(m, "type", {
    label: "Type",
    options: {
      "Steel": "Steel", "Concrete": "Concrete", "Aluminum": "Aluminum",
      "ColdFormed": "ColdFormed", "Rebar": "Rebar", "Tendon": "Tendon",
      "Masonry": "Masonry", "Other": "Other",
    },
  });
  fGen.addBinding(m, "symmetry", {
    label: "Symmetry",
    options: { "Isotropic": "Isotropic", "Orthotropic": "Orthotropic", "Anisotropic": "Anisotropic" },
  });
  fGen.addBinding(m, "color", { label: "Display Color", view: "color" });

  // ── Weight and Mass ──
  const fWM = fGen.addBlade ? fGen : editorPane.addFolder({ title: "Material Weight and Mass" });
  if (fWM === fGen) {
    // (no addBlade; skip)
  }
  const fWeight = editorPane.addFolder({ title: "Weight and Mass" });
  fWeight.addBinding(m, "weightDensity", { label: "Weight (kN/m³)", min: 0, step: 0.1 });
  fWeight.addBinding(m, "massDensity", { label: "Mass (kg/m³)", min: 0, step: 1 });

  // ── Mechanical Property Data ──
  const fMech = editorPane.addFolder({ title: "Mechanical Property Data" });
  // Display E in MPa (divide by 1e6 internally)
  const _eMPa = { E_MPa: m.E / 1e6 };
  fMech.addBinding(_eMPa, "E_MPa", { label: "E (MPa)", min: 0, step: 100 }).on("change", (ev) => {
    m.E = ev.value * 1e6;
  });
  fMech.addBinding(m, "nu", { label: "ν (Poisson)", min: 0, max: 0.5, step: 0.01 });
  fMech.addBinding(m, "alpha", { label: "α (1/°C)", step: 1e-6 });
  // Auto-calc G display
  const _gMPa = { G_MPa: (m.E / (2 * (1 + m.nu))) / 1e6 };
  fMech.addBinding(_gMPa, "G_MPa", { label: "G (MPa) auto", readonly: true });

  // ── Design Property Data (depende del tipo) ──
  const fDesign = editorPane.addFolder({ title: "Design Property Data" });
  if (m.type === "Steel" || m.type === "Rebar" || m.type === "Tendon" || m.type === "ColdFormed") {
    const _fyMPa = { Fy_MPa: (m.Fy ?? 0) / 1e6 };
    const _fuMPa = { Fu_MPa: (m.Fu ?? 0) / 1e6 };
    fDesign.addBinding(_fyMPa, "Fy_MPa", { label: "Fy (MPa)", min: 0, step: 5 }).on("change", (ev) => {
      m.Fy = ev.value * 1e6;
    });
    fDesign.addBinding(_fuMPa, "Fu_MPa", { label: "Fu (MPa)", min: 0, step: 5 }).on("change", (ev) => {
      m.Fu = ev.value * 1e6;
    });
  } else if (m.type === "Concrete" || m.type === "Masonry") {
    const _fcMPa = { fc_MPa: (m.fc ?? 0) / 1e6 };
    fDesign.addBinding(_fcMPa, "fc_MPa", { label: "f'c (MPa)", min: 0, step: 1 }).on("change", (ev) => {
      m.fc = ev.value * 1e6;
    });
  } else {
    const ph = { msg: "(sin propiedades de diseño)" };
    fDesign.addBinding(ph, "msg", { readonly: true, label: "" });
  }

  // ── Standards reference ──
  const fStd = editorPane.addFolder({ title: "Standards Reference", expanded: false });
  fStd.addBinding(m, "region", { label: "Region" });
  fStd.addBinding(m, "standard", { label: "Standard" });
  fStd.addBinding(m, "grade", { label: "Grade" });

  // ── Buttons ──
  editorPane.addButton({ title: "✓ OK" }).on("click", () => {
    // Si renombró, eliminar el viejo
    if (existingName && existingName !== m.name) _matMap.delete(existingName);
    _matMap.set(m.name, { ...m });
    refreshMaterialDB();
    document.body.removeChild(backdrop);
    try { (window as any).__hekatanRebuild?.(); } catch {}
  });
  editorPane.addButton({ title: "✕ Cancel" }).on("click", () => {
    document.body.removeChild(backdrop);
  });

  document.body.appendChild(backdrop);
  // Click fuera del modal cierra
  backdrop.addEventListener("click", (ev) => {
    if (ev.target === backdrop) document.body.removeChild(backdrop);
  });
};
(window as any).__hekatanOpenMaterialEditor = openMaterialEditor;

// ── Define Materials list — TWEAKPANE puro ──
let _mlPaneInstance: Pane | null = null;
const openMaterialsList = () => {
  const backdrop = document.createElement("div");
  backdrop.id = "hk-mat-list-backdrop";
  backdrop.style.cssText = [
    "position:fixed", "inset:0", "background:rgba(0,0,0,0.5)",
    "z-index:9998", "display:flex", "align-items:flex-start", "justify-content:center",
    "padding-top:50px",
  ].join(";") + ";";
  const cont = document.createElement("div");
  cont.style.cssText = [
    "width:min(360px, 95vw)", "max-height:80vh", "overflow-y:auto",
    "box-shadow:0 12px 36px rgba(0,0,0,0.6)",
  ].join(";") + ";";
  backdrop.appendChild(cont);

  // Estado de selección
  const sel = { selected: [..._matMap.keys()][0] ?? "" };

  const buildPane = () => {
    if (_mlPaneInstance) {
      _mlPaneInstance.dispose();
      _mlPaneInstance = null;
    }
    _mlPaneInstance = new Pane({
      container: cont,
      title: "🧱 Define Materials",
    });
    // Dropdown selector de material activo
    const matNames = [..._matMap.keys()];
    const matOptions: Record<string, string> = {};
    for (const n of matNames) matOptions[n] = n;
    _mlPaneInstance.addBinding(sel, "selected", {
      label: "Material",
      options: matOptions,
    }).on("change", () => {
      // Rebuild todo el pane para que las props readonly reflejen el nuevo material
      buildPane();
    });

    // Resumen del material seleccionado
    const fInfo = _mlPaneInstance.addFolder({ title: "ℹ Properties (read-only)" });
    const m = _matMap.get(sel.selected);
    const info = m ? {
      type: m.type,
      standard: m.standard ?? "—",
      grade: m.grade ?? "—",
      E_MPa: (m.E / 1e6).toFixed(0),
      nu: m.nu.toFixed(2),
      Fy_MPa: m.Fy ? (m.Fy / 1e6).toFixed(0) : "—",
      Fu_MPa: m.Fu ? (m.Fu / 1e6).toFixed(0) : "—",
      fc_MPa: m.fc ? (m.fc / 1e6).toFixed(1) : "—",
    } : { type: "—", standard: "—", grade: "—", E_MPa: "—", nu: "—", Fy_MPa: "—", Fu_MPa: "—", fc_MPa: "—" };
    fInfo.addBinding(info, "type", { readonly: true, label: "Type" });
    fInfo.addBinding(info, "standard", { readonly: true, label: "Standard" });
    fInfo.addBinding(info, "grade", { readonly: true, label: "Grade" });
    fInfo.addBinding(info, "E_MPa", { readonly: true, label: "E (MPa)" });
    fInfo.addBinding(info, "nu", { readonly: true, label: "ν" });
    if (m?.type === "Steel" || m?.type === "Rebar" || m?.type === "Tendon") {
      fInfo.addBinding(info, "Fy_MPa", { readonly: true, label: "Fy (MPa)" });
      fInfo.addBinding(info, "Fu_MPa", { readonly: true, label: "Fu (MPa)" });
    } else if (m?.type === "Concrete" || m?.type === "Masonry") {
      fInfo.addBinding(info, "fc_MPa", { readonly: true, label: "f'c (MPa)" });
    }

    // Acciones
    _mlPaneInstance.addButton({ title: "➕ Add New Material..." }).on("click", () => {
      _mlPaneInstance?.dispose();
      _mlPaneInstance = null;
      document.body.removeChild(backdrop);
      openMaterialEditor(null);
    });
    _mlPaneInstance.addButton({ title: "📋 Add Copy of Material..." }).on("click", () => {
      if (!sel.selected) return;
      const orig = _matMap.get(sel.selected);
      if (!orig) return;
      const copy = { ...orig, name: `${orig.name} (copy)` };
      _matMap.set(copy.name, copy);
      refreshMaterialDB();
      sel.selected = copy.name;
      buildPane();  // rebuild pane con la nueva lista
    });
    _mlPaneInstance.addButton({ title: "✏ Modify/Show Material..." }).on("click", () => {
      if (!sel.selected) return;
      _mlPaneInstance?.dispose();
      _mlPaneInstance = null;
      document.body.removeChild(backdrop);
      openMaterialEditor(sel.selected);
    });
    _mlPaneInstance.addButton({ title: "🗑 Delete Material" }).on("click", () => {
      if (!sel.selected) return;
      if (_matMap.size <= 1) {
        updateStatusGlobal("⚠ No podés borrar el último material");
        return;
      }
      _matMap.delete(sel.selected);
      refreshMaterialDB();
      sel.selected = [..._matMap.keys()][0] ?? "";
      buildPane();
    });
    _mlPaneInstance.addButton({ title: "✓ OK (cerrar)" }).on("click", () => {
      _mlPaneInstance?.dispose();
      _mlPaneInstance = null;
      document.body.removeChild(backdrop);
    });
  };

  buildPane();
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (ev) => {
    if (ev.target === backdrop) {
      _mlPaneInstance?.dispose();
      _mlPaneInstance = null;
      document.body.removeChild(backdrop);
    }
  });
};
// Helper para mostrar status (busca el cad-status bar globalmente)
const updateStatusGlobal = (msg: string) => {
  const sb = document.getElementById("hk-cad-status");
  if (sb) sb.textContent = msg;
};
(window as any).__hekatanOpenMaterialsList = openMaterialsList;

// ── Display Units dialog estilo ETABS ──
// Tabla con todas las categorías y cantidades, cada fila configurable con
// Length Unit, Force Unit, Temperature Unit, Decimal Places, Min Sig Figures,
// Zero Tolerance. El Units Label se computa automáticamente desde los 3
// dropdowns. Persistencia por item en localStorage.
type DisplayUnitItem = {
  id: string;                  // "absDist", "force", etc
  name: string;                // label en la UI
  category: string;            // "Structure Dimensions", "Section Dimensions", ...
  length?: "m" | "cm" | "mm" | "in" | "ft" | null;
  force?: "tonf" | "kN" | "kgf" | "N" | "kip" | "lb" | null;
  temp?: "C" | "F" | "K" | null;
  decimals: number;
  minSigFigs: number;
  zeroTol: number;
  // Cómo construir el label dinámico desde length/force/temp
  formula: (l: string | null | undefined, f: string | null | undefined, t: string | null | undefined) => string;
};
const DEFAULT_DISPLAY_UNITS: DisplayUnitItem[] = [
  // Structure Dimensions
  { id: "absDist", name: "Absolute Distance", category: "Structure Dimensions",
    length: "m", force: null, temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l) => l! },
  { id: "relDist", name: "Relative Distance", category: "Structure Dimensions",
    length: null, force: null, temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: () => "—" },
  { id: "structArea", name: "Structure Area", category: "Structure Dimensions",
    length: "m", force: null, temp: null, decimals: 1, minSigFigs: 1, zeroTol: 5e-4,
    formula: (l) => `${l}2` },
  { id: "angles", name: "Angles", category: "Structure Dimensions",
    length: null, force: null, temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: () => "deg" },
  // Section Dimensions
  { id: "secLength", name: "Length", category: "Section Dimensions",
    length: "m", force: null, temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l) => l! },
  { id: "secArea", name: "Area", category: "Section Dimensions",
    length: "cm", force: null, temp: null, decimals: 1, minSigFigs: 1, zeroTol: 5e-4,
    formula: (l) => `${l}2` },
  { id: "rebarArea", name: "Rebar Area", category: "Section Dimensions",
    length: "cm", force: null, temp: null, decimals: 2, minSigFigs: 1, zeroTol: 5e-5,
    formula: (l) => `${l}2` },
  // Displacements
  { id: "transDispl", name: "Translational Displ", category: "Displacements",
    length: "mm", force: null, temp: null, decimals: 4, minSigFigs: 1, zeroTol: 1e-12,
    formula: (l) => l! },
  { id: "rotDispl", name: "Rotational Displ", category: "Displacements",
    length: null, force: null, temp: null, decimals: 6, minSigFigs: 1, zeroTol: 1e-12,
    formula: () => "rad" },
  { id: "drift", name: "Drift", category: "Displacements",
    length: null, force: null, temp: null, decimals: 6, minSigFigs: 1, zeroTol: 5e-9,
    formula: () => "—" },
  // Forces
  { id: "force", name: "Force", category: "Forces",
    length: null, force: "tonf", temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: (_l, f) => f! },
  { id: "forcePerL", name: "Force/Length", category: "Forces",
    length: "m", force: "tonf", temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: (l, f) => `${f}/${l}` },
  { id: "forcePerA", name: "Force/Area", category: "Forces",
    length: "m", force: "tonf", temp: null, decimals: 5, minSigFigs: 1, zeroTol: 5e-8,
    formula: (l, f) => `${f}/${l}2` },
  { id: "moment", name: "Moment", category: "Forces",
    length: "m", force: "tonf", temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l, f) => `${f}-${l}` },
  { id: "momentPerL", name: "Moment/Length", category: "Forces",
    length: "m", force: "tonf", temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: (l, f) => `${f}-${l}/${l}` },
  { id: "temp", name: "Temperature", category: "Forces",
    length: null, force: null, temp: "C", decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (_l, _f, t) => t! },
  // Stresses
  { id: "stressIn", name: "Stress Input", category: "Stresses",
    length: "cm", force: "kgf", temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l, f) => `${f}/${l}2` },
  { id: "stressOut", name: "Stress Output", category: "Stresses",
    length: "cm", force: "kgf", temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l, f) => `${f}/${l}2` },
  { id: "strain", name: "Strain", category: "Stresses",
    length: "cm", force: null, temp: null, decimals: 6, minSigFigs: 1, zeroTol: 5e-9,
    formula: (l) => `${l}/${l}` },
  { id: "modulus", name: "Modulus", category: "Stresses",
    length: "cm", force: "kgf", temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l, f) => `${f}/${l}2` },
  // Stiffness
  { id: "transStiff", name: "Translational Stiffness", category: "Stiffness",
    length: "m", force: "tonf", temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: (l, f) => `${f}/${l}` },
  { id: "rotStiff", name: "Rotational Stiffness", category: "Stiffness",
    length: "m", force: "tonf", temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l, f) => `${f}-${l}/rad` },
  // Time Related
  { id: "period", name: "Period", category: "Time Related",
    length: null, force: null, temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: () => "sec" },
  { id: "freq", name: "Frequency", category: "Time Related",
    length: null, force: null, temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: () => "cyc/sec" },
  { id: "accelTrans", name: "Acceleration-Trans", category: "Time Related",
    length: "cm", force: null, temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l) => `${l}/sec2` },
  // Mass and Weight
  { id: "mass", name: "Mass", category: "Mass and Weight",
    length: "m", force: "tonf", temp: null, decimals: 6, minSigFigs: 1, zeroTol: 5e-9,
    formula: (l, f) => `${f}-s2/${l}` },
  { id: "weight", name: "Weight", category: "Mass and Weight",
    length: null, force: "tonf", temp: null, decimals: 5, minSigFigs: 1, zeroTol: 5e-8,
    formula: (_l, f) => f! },
  { id: "weightPerL", name: "Weight/Length", category: "Mass and Weight",
    length: "m", force: "tonf", temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: (l, f) => `${f}/${l}` },
  // Modal Factors
  { id: "modalParticT", name: "Modal Participation - Trans", category: "Modal Factors",
    length: "m", force: "tonf", temp: null, decimals: 6, minSigFigs: 1, zeroTol: 5e-9,
    formula: (l, f) => `${f}-${l}` },
  { id: "modalMass", name: "Modal Mass", category: "Modal Factors",
    length: "m", force: "tonf", temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: (l, f) => `${f}-${l}-s2` },
  // Damping Items
  { id: "dampRatio", name: "Damping Ratio", category: "Damping Items",
    length: null, force: null, temp: null, decimals: 4, minSigFigs: 1, zeroTol: 5e-7,
    formula: () => "—" },
  // Miscellaneous
  { id: "energy", name: "Energy", category: "Miscellaneous",
    length: "cm", force: "tonf", temp: null, decimals: 3, minSigFigs: 1, zeroTol: 5e-6,
    formula: (l, f) => `${f}-${l}` },
];

// Map de overrides persistidos en localStorage por id
const _displayUnitsMap = new Map<string, Partial<DisplayUnitItem>>();
try {
  const raw = localStorage.getItem("hk_displayUnits");
  if (raw) {
    const parsed = JSON.parse(raw);
    for (const [id, ovr] of Object.entries(parsed)) _displayUnitsMap.set(id, ovr as any);
  }
} catch {}
const getDisplayUnit = (id: string): DisplayUnitItem => {
  const def = DEFAULT_DISPLAY_UNITS.find(d => d.id === id);
  if (!def) throw new Error(`Unknown unit id: ${id}`);
  return { ...def, ...(_displayUnitsMap.get(id) ?? {}) };
};
(window as any).__hekatanGetDisplayUnit = getDisplayUnit;
(window as any).__hekatanDisplayUnitsAll = DEFAULT_DISPLAY_UNITS;
const persistDisplayUnits = () => {
  const obj: Record<string, any> = {};
  for (const [k, v] of _displayUnitsMap.entries()) obj[k] = v;
  localStorage.setItem("hk_displayUnits", JSON.stringify(obj));
};

// Display Units dialog — TWEAKPANE puro (Pane + folders + bindings + buttons)
let _duPaneInstance: Pane | null = null;
const openDisplayUnitsDialog = () => {
  // Backdrop overlay (sólo HTML para click-outside-to-close, no es contenido UI)
  const backdrop = document.createElement("div");
  backdrop.id = "hk-units-backdrop";
  backdrop.style.cssText = [
    "position:fixed", "inset:0", "background:rgba(0,0,0,0.55)",
    "z-index:9997", "display:flex", "align-items:flex-start", "justify-content:center",
    "padding-top:30px",
  ].join(";") + ";";
  const cont = document.createElement("div");
  cont.style.cssText = [
    "width:min(420px, 96vw)", "max-height:90vh", "overflow-y:auto",
    "box-shadow:0 12px 40px rgba(0,0,0,0.6)",
  ].join(";") + ";";
  backdrop.appendChild(cont);

  // Estado mutable que Tweakpane bindea (cada item flat con id como key)
  type DUState = Record<string, {
    length: string;
    force: string;
    temp: string;
    decimals: number;
    minSigFigs: number;
    zeroTol: number;
    label: string;
  }>;
  const duState: DUState = {};
  for (const def of DEFAULT_DISPLAY_UNITS) {
    const cur = getDisplayUnit(def.id);
    duState[def.id] = {
      length: cur.length ?? "—",
      force: cur.force ?? "—",
      temp: cur.temp ?? "—",
      decimals: cur.decimals,
      minSigFigs: cur.minSigFigs,
      zeroTol: cur.zeroTol,
      label: cur.formula(cur.length, cur.force, cur.temp),
    };
  }

  // Estado de filtro: qué categoría mostrar
  const filter = { category: "All" };

  const buildPane = () => {
    if (_duPaneInstance) {
      _duPaneInstance.dispose();
      _duPaneInstance = null;
    }
    _duPaneInstance = new Pane({
      container: cont,
      title: "📐 Display Units",
    });

    // ── Presets rápidos (1 click cambia todo) ──
    const fPresets = _duPaneInstance.addFolder({ title: "🌐 Presets (1 click)", expanded: true });
    fPresets.addButton({ title: "Metric MKS (cm + tonf)" }).on("click", () => applyPreset("cm", "tonf"));
    fPresets.addButton({ title: "Metric SI (m + kN)" }).on("click", () => applyPreset("m", "kN"));
    fPresets.addButton({ title: "U.S. Imperial (in + kip)" }).on("click", () => applyPreset("in", "kip"));

    // ── Filtro de categoría ──
    const allCats = ["All", ...new Set(DEFAULT_DISPLAY_UNITS.map(d => d.category))];
    const catOpts: Record<string, string> = {};
    for (const c of allCats) catOpts[c] = c;
    _duPaneInstance.addBinding(filter, "category", {
      label: "Categoría",
      options: catOpts,
    }).on("change", () => buildPane());

    // ── Items planos (sin sub-folder por item) ──
    // Agrupados por categoría con un mini-separador.
    const lengthOpts = { "m": "m", "cm": "cm", "mm": "mm", "in": "in", "ft": "ft", "—": "—" };
    const forceOpts = { "tonf": "tonf", "kN": "kN", "kgf": "kgf", "N": "N", "kip": "kip", "lb": "lb", "—": "—" };
    const tempOpts = { "C": "C", "F": "F", "K": "K", "—": "—" };

    const refreshLabel = (id: string) => {
      const def = DEFAULT_DISPLAY_UNITS.find(d => d.id === id)!;
      const s = duState[id];
      const l = s.length === "—" ? null : s.length;
      const f = s.force === "—" ? null : s.force;
      const t = s.temp === "—" ? null : s.temp;
      s.label = def.formula(l as any, f as any, t as any);
      _duPaneInstance?.refresh();
    };

    // Filtrar items según categoría seleccionada
    const visibleItems = filter.category === "All"
      ? DEFAULT_DISPLAY_UNITS
      : DEFAULT_DISPLAY_UNITS.filter(d => d.category === filter.category);

    let lastCat = "";
    for (const def of visibleItems) {
      // Header de categoría sólo si "All" (al filtrar es redundante)
      if (filter.category === "All" && def.category !== lastCat) {
        _duPaneInstance.addBlade({ view: "separator" });
        const catLabel = { name: `── ${def.category} ──` };
        _duPaneInstance.addBinding(catLabel, "name", { readonly: true, label: "" });
        lastCat = def.category;
      }
      // Item: 1 binding compacto que muestra el label dinámico, click expande controles
      // Para minimizar profundidad: usamos un folder colapsado por defecto SOLO al filtrar
      // todos. Cuando hay filtro, mostramos los controles directamente.
      const s = duState[def.id];
      if (filter.category === "All") {
        // Modo "All" — sólo nombre + Units Label readonly, no controles inline
        _duPaneInstance.addBinding(s, "label", { label: def.name, readonly: true });
      } else {
        // Modo filtrado — controles inline directos para cada item
        const fItem = _duPaneInstance.addFolder({ title: def.name, expanded: true });
        if (def.length !== null) {
          fItem.addBinding(s, "length", { label: "Length", options: lengthOpts })
            .on("change", () => { _displayUnitsMap.set(def.id, { ..._displayUnitsMap.get(def.id), length: s.length === "—" ? null : s.length as any }); refreshLabel(def.id); });
        }
        if (def.force !== null) {
          fItem.addBinding(s, "force", { label: "Force", options: forceOpts })
            .on("change", () => { _displayUnitsMap.set(def.id, { ..._displayUnitsMap.get(def.id), force: s.force === "—" ? null : s.force as any }); refreshLabel(def.id); });
        }
        if (def.temp !== null) {
          fItem.addBinding(s, "temp", { label: "Temp", options: tempOpts })
            .on("change", () => { _displayUnitsMap.set(def.id, { ..._displayUnitsMap.get(def.id), temp: s.temp === "—" ? null : s.temp as any }); refreshLabel(def.id); });
        }
        fItem.addBinding(s, "decimals", { label: "Decimales", min: 0, max: 10, step: 1 })
          .on("change", () => { _displayUnitsMap.set(def.id, { ..._displayUnitsMap.get(def.id), decimals: s.decimals }); });
        fItem.addBinding(s, "label", { label: "Label", readonly: true });
      }
    }

    // Footer
    _duPaneInstance.addBlade({ view: "separator" });
    _duPaneInstance.addButton({ title: "↻ Reset Defaults" }).on("click", () => {
      _displayUnitsMap.clear();
      persistDisplayUnits();
      for (const def of DEFAULT_DISPLAY_UNITS) {
        duState[def.id] = {
          length: def.length ?? "—", force: def.force ?? "—", temp: def.temp ?? "—",
          decimals: def.decimals, minSigFigs: def.minSigFigs, zeroTol: def.zeroTol,
          label: def.formula(def.length, def.force, def.temp),
        };
      }
      buildPane();
    });
    _duPaneInstance.addButton({ title: "✓ OK" }).on("click", () => {
      persistDisplayUnits();
      _duPaneInstance?.dispose();
      _duPaneInstance = null;
      document.body.removeChild(backdrop);
    });
    _duPaneInstance.addButton({ title: "✕ Cancel" }).on("click", () => {
      _duPaneInstance?.dispose();
      _duPaneInstance = null;
      document.body.removeChild(backdrop);
    });
  };

  const applyPreset = (length: string, force: string) => {
    for (const def of DEFAULT_DISPLAY_UNITS) {
      const ovr = _displayUnitsMap.get(def.id) ?? {};
      const s = duState[def.id];
      if (def.length !== null) { ovr.length = length as any; s.length = length; }
      if (def.force !== null) { ovr.force = force as any; s.force = force; }
      _displayUnitsMap.set(def.id, ovr);
      // Recompute label en el state
      const newDef = getDisplayUnit(def.id);
      s.label = newDef.formula(newDef.length, newDef.force, newDef.temp);
    }
    persistDisplayUnits();
    _duPaneInstance?.refresh();
  };

  buildPane();
  document.body.appendChild(backdrop);
  backdrop.addEventListener("click", (ev) => {
    if (ev.target === backdrop) {
      _duPaneInstance?.dispose();
      _duPaneInstance = null;
      document.body.removeChild(backdrop);
    }
  });
};
(window as any).__hekatanOpenDisplayUnits = openDisplayUnitsDialog;
// Base de datos básica de secciones (AISC + IPN/IPE/HEB típicas).
// Valores en SI: A [m²], I [m⁴], J [m⁴]. Fuente: AISC Steel Manual + Eurocódigo.
const SECTION_DB: Record<string, SectionProps> = {
  "W14x84":   { A: 0.01613, Iz: 5.535e-4, Iy: 1.787e-4, J: 1.244e-6, name: "W14x84"   },
  "W18x86":   { A: 0.01632, Iz: 1.158e-3, Iy: 7.534e-5, J: 1.119e-6, name: "W18x86"   },
  "W24x146":  { A: 0.02781, Iz: 3.413e-3, Iy: 2.847e-4, J: 4.078e-6, name: "W24x146"  },
  "HEB300":   { A: 0.01491, Iz: 2.517e-4, Iy: 8.563e-5, J: 1.852e-6, name: "HEB300"   },
  "IPN300":   { A: 0.00692, Iz: 9.800e-5, Iy: 4.510e-6, J: 6.700e-7, name: "IPN300"   },
  "IPE400":   { A: 0.00845, Iz: 2.313e-4, Iy: 1.318e-5, J: 5.180e-7, name: "IPE400"   },
};
(window as any).__hekatanSectionDB = SECTION_DB;
window.addEventListener("hk:property-applied", (ev: any) => {
  const { kind, ids, prop, value } = ev.detail || {};
  if (kind === "nodes") {
    const ptIdxs = (ids as string[]).filter(id => id.startsWith("pt:")).map(id => parseInt(id.slice(3)));
    if (prop === "supports") {
      const m = (window as any).__hekatanManualSupports as Map<number, any>;
      for (const i of ptIdxs) m.set(i, [...(value as boolean[])]);
      // Asegurar que el display de apoyos esté ON para que el símbolo se vea.
      try { const s = (viewerElm as any).__settings; if (s?.supports) s.supports.val = true; } catch {}
    } else if (prop === "loads") {
      const m = (window as any).__hekatanManualLoads as Map<number, any>;
      for (const i of ptIdxs) m.set(i, [...(value as number[])]);
      try { const s = (viewerElm as any).__settings; if (s?.loads) s.loads.val = true; } catch {}
    } else if (prop === "mass") {
      const m = (window as any).__hekatanManualMass as Map<number, number>;
      for (const i of ptIdxs) m.set(i, value as number);
    } else if (prop === "springs") {
      const m = (window as any).__hekatanManualSprings as Map<number, any>;
      for (const i of ptIdxs) m.set(i, [...(value as number[])]);
    } else if (prop === "diaphragm") {
      const m = (window as any).__hekatanManualDiaphragm as Map<number, string>;
      for (const i of ptIdxs) m.set(i, value as string);
    }
  } else if (kind === "segs") {
    // ids viene como ["seg:P:S", ...]. Extraemos "P:S" como key.
    const segKeys = (ids as string[]).filter(id => id.startsWith("seg:")).map(id => id.slice(4));
    if (prop === "section") {
      const m = (window as any).__hekatanManualSections as Map<string, SectionProps>;
      const secProps = SECTION_DB[value as string];
      if (secProps) {
        for (const k of segKeys) m.set(k, { ...secProps });
      }
    } else if (prop === "material") {
      const m = (window as any).__hekatanManualMaterial as Map<string, string>;
      for (const k of segKeys) m.set(k, value as string);
    } else if (prop === "modifiers") {
      const m = (window as any).__hekatanManualModifiers as Map<string, FrameMods>;
      for (const k of segKeys) m.set(k, { ...(value as FrameMods) });
    } else if (prop === "releases") {
      const m = (window as any).__hekatanManualReleases as Map<string, FrameReleases>;
      const v = value as FrameReleases;
      for (const k of segKeys) m.set(k, { i: [...v.i] as any, j: [...v.j] as any });
    } else if (prop === "massPerM") {
      const m = (window as any).__hekatanManualMassPerM as Map<string, number>;
      for (const k of segKeys) m.set(k, value as number);
    } else if (prop === "hinges") {
      const m = (window as any).__hekatanManualHinges as Map<string, string>;
      for (const k of segKeys) m.set(k, value as string);
    } else if (prop === "insertionPoint") {
      const m = (window as any).__hekatanManualInsertionPoint as Map<string, string>;
      for (const k of segKeys) m.set(k, value as string);
    } else if (prop === "beta") {
      const m = (window as any).__hekatanManualBeta as Map<string, number>;
      for (const k of segKeys) m.set(k, value as number);
    } else if (prop === "lineSprings") {
      const m = (window as any).__hekatanManualLineSprings as Map<string, any>;
      for (const k of segKeys) m.set(k, [...(value as number[])]);
    } else if (prop === "distLoad") {
      // TODO: distLoad necesita lift al solver — por ahora sólo log
      console.log(`[Props] distLoad ${segKeys.length} seg(s):`, value);
    }
  }
  // ── Cartel de confirmación visible (muchas props NO cambian el dibujo:
  // sección/material/modifiers solo afectan el ANÁLISIS, el frame sigue siendo
  // una línea → sin feedback el usuario cree que "no se aplicó"). ──
  try {
    const nItems = Array.isArray(ids) ? ids.length : 0;
    const LABELS: Record<string, string> = {
      supports: "Apoyo", loads: "Carga", springs: "Resorte", mass: "Masa",
      diaphragm: "Diafragma", section: "Sección", material: "Material",
      modifiers: "Modifiers", releases: "Releases", hinges: "Hinge",
      insertionPoint: "Punto inserción", beta: "Ángulo β", lineSprings: "Line spring",
      massPerM: "Masa/m", shellType: "Tipo shell", thickness: "Espesor",
      surfLoad: "Carga sup.", distLoad: "Carga distrib.",
    };
    const what = LABELS[prop] ?? prop;
    const tipo = kind === "nodes" ? "nodo(s)" : kind === "segs" ? "frame(s)" : "área(s)";
    const valStr = (typeof value === "string" || typeof value === "number") ? ` "${value}"` : "";
    const noVisual = ["section","material","modifiers","releases","hinges","insertionPoint","beta","lineSprings","massPerM","springs","mass","diaphragm","shellType","surfLoad","distLoad"].includes(prop);
    const msg = `✓ ${what}${valStr} aplicado a ${nItems} ${tipo}` + (noVisual ? " · (afecta el análisis, no el dibujo)" : "");
    let toast = document.getElementById("hk-prop-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "hk-prop-toast";
      toast.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;background:rgba(16,185,129,0.96);pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = "rgba(16,185,129,0.96)";
    toast.style.opacity = "1";
    const w = window as any;
    clearTimeout(w.__hekatanPropToastT);
    w.__hekatanPropToastT = setTimeout(() => { if (toast) toast.style.opacity = "0"; }, 2400);
  } catch {}
  // Disparar rebuild para que el ejemplo procese los cambios manuales
  try { (window as any).__hekatanRebuild?.(); } catch {}
});
// Primera carga: el CSS media query puede no haber aplicado aún
// cuando autoFitCamera corre por primera vez en loadExample. Forzamos
// un re-fit 300ms después del DOMContentLoaded para que el modelo
// quede correctamente encuadrado en el área visible final.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => scheduleRefit(300));
} else {
  scheduleRefit(300);
}

// ── Tweakpane panel (encima del viewer, ARRASTRABLE) ──
const paneHost = document.createElement("div");
// top: 96px para que el Tweakpane quede claramente debajo de la toolbar superior.
// El usuario puede arrastrarlo a cualquier posición (ver makePaneDraggable más abajo).
// Posición persistida en localStorage para mantenerla entre sesiones.
const PANE_POS_KEY = "hk_paneHostPos";
const savedPos = (() => {
  try {
    const raw = localStorage.getItem(PANE_POS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { left: number; top: number };
      // CLAMP a la ventana visible: una posición guardada en un monitor ANCHO
      // (ej. left:1917 al arrastrar el panel) quedaba FUERA de pantalla en
      // ventanas más chicas y el panel "desaparecía". Lo traemos siempre a la
      // vista (mínimo 60px del borde).
      const pw = Math.min(320, window.innerWidth - 32);
      p.left = Math.max(0, Math.min(p.left, window.innerWidth - pw));
      p.top = Math.max(0, Math.min(p.top, window.innerHeight - 60));
      return p;
    }
  } catch {}
  return null;
})();
// ── la piel CAD: barra de titulo arriba, barra de estado abajo y las
// paletas acopladas a los lados. Va ANTES de crear el pane para que las
// variables de Tweakpane ya esten puestas cuando se pinte la primera fila.
// El puente al tema del VISOR va ANTES de aplicar la piel: `aplicarPielCad`
// termina llamando a `ponerModo`, y si el puente no existe todavia el 3D se
// queda con su tema de fabrica. Se veia como un lienzo negro con los paneles
// claros, y no daba ningun error.
(window as any).__hkSetViewerTheme = (t: "dark" | "light") => {
  try { (uiSetTheme as any)?.(t); } catch {}
};
aplicarPielCad("sin titulo");

paneHost.id = "hk-pane-host";
paneHost.style.cssText =
  "position:fixed;" +
  (savedPos ? `left:${savedPos.left}px;top:${savedPos.top}px;right:auto;` : "top:96px;right:16px;") +
  "width:min(320px,calc(100vw - 32px));max-width:90vw;z-index:100;" +
  "max-height:calc(100vh - 112px);overflow-y:auto;font-size:12px;" +
  // Pequeña sombra y borde para indicar que es una ventana flotante
  "box-shadow:0 6px 24px rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);";
document.body.appendChild(paneHost);

// ── Mobile UX: bottom-drawer pattern + 2 FAB toggles ─────────────────
// En viewports <= 600px (móvil), tanto #settings como #hk-pane-host
// se ocultan por default (translateY(100%)) y se muestran cuando el
// usuario toca su FAB correspondiente. Esto libera el canvas central
// para dibujar con touch sin paneles tapando. Solo un panel abierto a
// la vez (abrir uno cierra el otro).
(function setupMobileDrawer() {
  const styleEl = document.createElement("style");
  // Mobile breakpoint cubre PORTRAIT (max-width 600) y LANDSCAPE
  // (max-height 500) para que un móvil rotado a horizontal también
  // use el drawer pattern (sino el panel fixed-position de 320px se
  // sale o tapa media pantalla en 812×375).
  // Mobile SPLIT LAYOUT — panes permanentemente visibles en una
  // mitad de la pantalla, canvas en la otra. NO hay drawer ni FABs.
  //
  //   Portrait 375×812:
  //     Settings  → top 0    – 25vh   (pane horizontal arriba)
  //     Tools     → top 25vh – 50vh   (pane horizontal abajo)
  //     Canvas    → 50vh    – 100vh   (modelo en mitad inferior)
  //
  //   Landscape 812×375:
  //     Settings  → top 0    – 50vh   (pane vertical arriba derecha)
  //     Tools     → top 50vh – 100vh  (pane vertical abajo derecha)
  //     Canvas    → 0        – 55vw   (modelo en mitad izquierda)
  //
  // Esto da una experiencia tipo tablero CAD donde siempre se ve a la
  // vez la herramienta + el modelo.
  styleEl.textContent = `
    /* ── FIX: orbit vertical (pitch) en mobile ───────────────────────
     * Sin estos overrides, Chrome Android / Safari interceptan el
     * swipe vertical en el canvas como pull-to-refresh u overscroll
     * bounce ANTES de que llegue a OrbitControls — aunque el canvas
     * tenga touch-action:none, el body con overscroll-behavior:auto
     * deja que el browser robe el gesto. Forzamos:
     *   - overscroll-behavior:none  → cancela pull-to-refresh
     *   - touch-action:none en html/body → cancela scroll/zoom default
     *   - height:100% + overflow:hidden → evita que el body crezca
     *     fuera del viewport (causa de "scroll the body" disfrazado de
     *     pinch). En desktop estos no afectan porque ya layout-fixed.
     * Aplicamos siempre (no sólo mobile) porque el workspace es 100%
     * canvas-driven, no hay scroll de página legítimo en ningún modo.
     */
    html, body {
      overscroll-behavior: none !important;
      touch-action: none !important;
      height: 100% !important;
      overflow: hidden !important;
      margin: 0 !important;
    }
    /* Pero los panes Tweakpane SÍ necesitan touch-action:auto para
     * que su scroll interno funcione (especialmente en mobile donde
     * tienen overflow-y:auto). Sin esto el usuario no podría
     * scrollear la lista de herramientas/settings con el dedo. */
    #settings, #hk-pane-host, #hk-pane-host * {
      touch-action: pan-y pinch-zoom !important;
    }
    /* El canvas mantiene touch-action:none — OrbitControls maneja todo.
     * cursor:crosshair en lugar de none — estilo AutoCAD: el puntero del
     * SO se mantiene visible (crosshair) y el snap marker (axis cross)
     * actúa como hint adicional cuando estás cerca de un grid/node.
     * Esto es más natural para usuarios CAD: ves DÓNDE apuntás (cursor)
     * Y DÓNDE va a caer el click (snap marker). */
    canvas {
      touch-action: none !important;
      cursor: crosshair !important;
    }

    /* Portrait: Settings 0-25vh, Tools 25-50vh, Canvas 50-100vh.
     * 3D abajo donde el pulgar lo manipula con touch+orbit, controles
     * arriba accesibles desde la zona alta del pulgar. */
    @media (max-width: 600px) and (orientation: portrait) {
      #hk-pane-host {
        position: fixed !important;
        top: 25vh !important;
        bottom: auto !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        max-height: 25vh !important;
        height: 25vh !important;
        font-size: 11px !important;
        z-index: 199 !important;
        background: rgba(20, 20, 20, 0.96);
        backdrop-filter: blur(8px);
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        transform: none !important;
      }
      /* Toolbar (☀+logo) en BOTTOM-LEFT — sobre el canvas inferior,
       * lejos del status bar (bottom right). */
      #toolbar {
        right: auto !important;
        left: 4px !important;
        top: auto !important;
        bottom: 36px !important;
      }
    }

    /* Landscape: pane Tools en mitad inferior derecha */
    @media (max-height: 500px) and (orientation: landscape) {
      #hk-pane-host {
        position: fixed !important;
        top: 50vh !important;
        bottom: 0 !important;
        left: auto !important;
        right: 0 !important;
        width: 45vw !important;
        max-width: 380px !important;
        min-width: 280px !important;
        max-height: 50vh !important;
        height: 50vh !important;
        transform: none !important;
        border: none;
        border-left: 1px solid rgba(255, 255, 255, 0.12);
        border-top: 1px solid rgba(255, 255, 255, 0.10);
        border-radius: 0;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.4);
        background: rgba(20, 20, 20, 0.96);
        backdrop-filter: blur(8px);
      }
      /* Toolbar a top-LEFT en landscape (sobre el canvas) */
      #toolbar {
        right: auto !important;
        left: 8px !important;
        top: 4px !important;
      }
    }

    /* En cualquier modo móvil: FABs y backdrop NO son necesarios.
     * Los panes están permanentemente visibles. */
    @media (max-width: 600px), (max-height: 500px) {
      .hk-mobile-fab-row, .hk-mobile-backdrop {
        display: none !important;
      }
      #hk-mobile-help {
        /* Toast más compacto en mobile */
        font-size: 11px !important;
      }
    }

    /* Status bar: en mobile NO truncar el mensaje — permitir wrap a
     * 2-3 líneas. El default desktop tiene white-space:nowrap +
     * overflow:hidden + text-overflow:ellipsis (ver drawing.ts L2458)
     * pero en pantalla angosta corta info importante (sintaxis CLI).
     * IMPORTANTE: limitar max-width a calc(100vw - 180px) para dejar
     * espacio al gizmo de cámara (↑⊕←⌂→↓) que está en bottom-right
     * y mide ~150px. Sin esto, el status bar tapa los botones. */
    @media (max-width: 600px) and (orientation: portrait) {
      #hk-cad-status {
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: clip !important;
        max-width: calc(100vw - 180px) !important;
        left: 4px !important;
        right: auto !important;
        transform: none !important;
        line-height: 1.35 !important;
        font-size: 10px !important;
        padding: 4px 10px !important;
        bottom: 4px !important;
        text-align: left !important;
      }
    }
    /* Landscape: status bar restringido a la mitad izquierda (canvas),
     * sino el pane Tools a la derecha lo tapa. Wrap a múltiples líneas. */
    @media (max-height: 500px) and (orientation: landscape) {
      #hk-cad-status {
        white-space: normal !important;
        overflow: visible !important;
        text-overflow: clip !important;
        max-width: 53vw !important;
        left: 8px !important;
        transform: none !important;
        bottom: 4px !important;
        line-height: 1.35 !important;
        font-size: 10px !important;
        padding: 4px 10px !important;
        text-align: left !important;
      }
    }

    /* Desktop: todo intacto */
    @media (min-width: 601px) and (min-height: 501px) {
      .hk-mobile-fab-row, .hk-mobile-backdrop { display: none !important; }
    }
  `;
  document.head.appendChild(styleEl);

  // Backdrop
  const backdrop = document.createElement("div");
  backdrop.className = "hk-mobile-backdrop";
  document.body.appendChild(backdrop);

  // FAB row con 2 botones: ⚙ Settings y 🛠 Tools
  const fabRow = document.createElement("div");
  fabRow.className = "hk-mobile-fab-row";
  const fabSettings = document.createElement("button");
  fabSettings.className = "hk-mobile-fab";
  fabSettings.textContent = "⚙";
  fabSettings.title = "Settings";
  fabSettings.setAttribute("aria-label", "Toggle Settings");
  const fabTools = document.createElement("button");
  fabTools.className = "hk-mobile-fab";
  fabTools.textContent = "🛠";
  fabTools.title = "Herramientas CAD";
  fabTools.setAttribute("aria-label", "Toggle CAD Tools");
  fabRow.appendChild(fabSettings);
  fabRow.appendChild(fabTools);
  document.body.appendChild(fabRow);

  const closeAll = () => {
    document.getElementById("settings")?.classList.remove("hk-mobile-open");
    document.getElementById("hk-pane-host")?.classList.remove("hk-mobile-open");
    fabSettings.classList.remove("hk-active");
    fabTools.classList.remove("hk-active");
    backdrop.classList.remove("hk-active");
  };
  const toggle = (which: "settings" | "tools") => {
    const settingsEl = document.getElementById("settings");
    const toolsEl = document.getElementById("hk-pane-host");
    const target = which === "settings" ? settingsEl : toolsEl;
    if (!target) return;
    const wasOpen = target.classList.contains("hk-mobile-open");
    closeAll();
    if (!wasOpen) {
      target.classList.add("hk-mobile-open");
      backdrop.classList.add("hk-active");
      (which === "settings" ? fabSettings : fabTools).classList.add("hk-active");
    }
  };
  fabSettings.addEventListener("click", () => toggle("settings"));
  fabTools.addEventListener("click", () => toggle("tools"));
  backdrop.addEventListener("click", () => closeAll());

  // ── Onboarding: toast de ayuda la primera vez en móvil ──
  // Muestra un mensaje breve apuntando a los 2 FABs explicando qué
  // hacer. Se descarta al primer click en cualquier FAB o tras 8s,
  // y se persiste con localStorage para no molestar en cargas
  // siguientes. Solo aparece si la media query móvil aplica.
  const HELP_KEY = "hk_mobile_help_seen_v1";
  const isMobileNow = () =>
    matchMedia("(max-width: 600px)").matches ||
    matchMedia("(max-height: 500px)").matches;
  const seen = (() => { try { return localStorage.getItem(HELP_KEY) === "1"; } catch { return false; } })();
  if (isMobileNow() && !seen) {
    const toast = document.createElement("div");
    toast.id = "hk-mobile-help";
    toast.style.cssText = [
      "position:fixed",
      "top:62px",
      "left:8px",
      "max-width:calc(100vw - 16px)",
      "padding:10px 14px",
      "background:rgba(34, 211, 238, 0.96)",
      "color:#0a0a0a",
      "border-radius:8px",
      "font-family:system-ui,-apple-system,sans-serif",
      "font-size:13px",
      "line-height:1.4",
      "z-index:260",
      "box-shadow:0 6px 18px rgba(0,0,0,0.4)",
      "transition:opacity 0.3s ease-out",
    ].join(";") + ";";
    toast.innerHTML = [
      "<div style='font-weight:600;margin-bottom:4px'>👋 Bienvenido a Hekatan</div>",
      "<div>Tocá <b>⚙</b> para ver/ocultar <b>Settings</b> (grid, vista, resultados).</div>",
      "<div>Tocá <b>🛠</b> para abrir <b>Herramientas CAD</b> y empezar a dibujar.</div>",
      "<div style='margin-top:6px;font-size:11px;opacity:0.85'>Tip: arrastrá con un dedo para orbitar la cámara, dos dedos para zoom/pan.</div>",
      "<div style='margin-top:8px;text-align:right'><button id='hk-help-close' style='border:1px solid #0a0a0a;background:transparent;color:#0a0a0a;padding:4px 10px;border-radius:4px;cursor:pointer;font-weight:600'>Entendido</button></div>",
    ].join("");
    document.body.appendChild(toast);
    const dismiss = () => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 320);
      try { localStorage.setItem(HELP_KEY, "1"); } catch {}
    };
    toast.querySelector<HTMLButtonElement>("#hk-help-close")?.addEventListener("click", dismiss);
    fabSettings.addEventListener("click", dismiss, { once: true });
    fabTools.addEventListener("click", dismiss, { once: true });
    setTimeout(dismiss, 12000);  // auto-dismiss tras 12s
  }
})();

/**
 * Convierte un elemento en arrastrable desde su "handle" (cualquier elemento
 * con la clase `tp-fldv_b` o el primer `.tp-rotv_b` del Tweakpane — sus
 * headers/title-bars). Persiste la posición en localStorage.
 */
function makePaneDraggable(host: HTMLElement) {
  const findHandle = (): HTMLElement | null =>
    host.querySelector(".tp-rotv_b, .tp-fldv_b") as HTMLElement | null;
  let handle = findHandle();
  // Reintentar si Tweakpane aún no renderizó
  if (!handle) {
    setTimeout(() => makePaneDraggable(host), 200);
    return;
  }
  handle.style.cursor = "move";
  handle.style.userSelect = "none";

  let dragging = false;
  let startX = 0, startY = 0, origLeft = 0, origTop = 0;
  handle.addEventListener("mousedown", (e) => {
    // Dejar pasar el click normal (colapsar/expandir); solo arrastrar con shift o
    // con arrastre >5px. Detectamos arrastre real en mousemove.
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const r = host.getBoundingClientRect();
    origLeft = r.left;
    origTop = r.top;
    host.style.right = "auto";
    host.style.left = `${origLeft}px`;
    host.style.top = `${origTop}px`;
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = Math.max(0, Math.min(window.innerWidth - 40, origLeft + dx));
    const newTop = Math.max(0, Math.min(window.innerHeight - 40, origTop + dy));
    host.style.left = `${newLeft}px`;
    host.style.top = `${newTop}px`;
  });
  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    try {
      localStorage.setItem(PANE_POS_KEY, JSON.stringify({
        left: parseFloat(host.style.left),
        top: parseFloat(host.style.top),
      }));
    } catch {}
  });
}

// ── MENÚ DE ENTRADA ─────────────────────────────────────────────
// Sin ?t= en la URL ni modelo por enlace (?heks= / ?m=) el workspace arranca
// con el Tweakpane mostrando un MENÚ limpio en vez de cargar un ejemplo por
// defecto con todas las carpetas desplegadas: 📐 Nuevo archivo / 📂 Archivo
// existente / 🧪 Ejemplos. Recién al elegir se cargan las herramientas del
// pane (loadExample → buildParamsPane).
function showMenu() {
  currentExample = null;
  activeExampleVersion.v++;
  resetStates();
  if (currentPane) { currentPane.dispose(); currentPane = null; }
  lastFolderMap = null;
  paneHost.innerHTML = "";
  const pane = new Pane({ container: paneHost, title: "Hekatan Struct" });
  paneActual = pane;
  const fMenu = pane.addFolder({ title: "¿Con qué vas a trabajar?", expanded: true });
  // ── NUEVO MODELO → PLANTILLAS ────────────────────────────────────────────
  //
  // Antes esto abria el lienzo en blanco. Pero empezar un modelo desde cero en
  // un lienzo 3D vacio es lo mas caro que hay: hay que dibujar la rejilla, subir
  // los pisos, poner columnas, vigas, apoyos y cargas antes de ver un solo
  // numero. ETABS no hace eso — abre `New Model Quick Templates` y te da la
  // tipologia ya montada.
  //
  // Asi que aqui igual: las plantillas primero, como SUB-CATEGORIAS, y el
  // lienzo en blanco como una mas de ellas para quien de verdad quiera dibujar.
  // ⚠️ La lista NO se escribe aquí. Se saca de las opciones de la propia
  // plantilla (`params.tipo.options`), porque tenerla dos veces es tenerla mal:
  // se añadieron «dual» y «arriostrado» al desplegable del ejemplo y el menú
  // siguió enseñando seis. Lo cazó una captura, no el compilador — dos listas
  // paralelas no dan error, solo dejan de coincidir.
  const exPlantilla = examplesRegistry.find((e) => e.id === "plantillas");
  const opciones: Record<string, number> =
    ((exPlantilla?.params as any)?.tipo?.options) ?? {};
  const fNuevo = pane.addFolder({ title: "📐 Nuevo modelo · Plantillas", expanded: true });
  for (const [titulo, tipo] of Object.entries(opciones)) {
    fNuevo.addButton({ title: titulo }).on("click", () => {
      if (!exPlantilla) return;
      // El tipo elegido viaja como defecto para que la plantilla arranque ya en
      // esa tipología; el usuario la sigue pudiendo cambiar desde el panel.
      (exPlantilla.params as any).tipo.default = tipo;
      loadExample(exPlantilla);
    });
  }
  fNuevo.addButton({ title: "📄 Lienzo en blanco (dibujar a mano)" }).on("click", () => {
    const ex = examplesRegistry.find((e) => e.id === "new-blank");
    if (ex) loadExample(ex);
  });
  fMenu.addButton({ title: "📂 Archivo existente" }).on("click", () => {
    const ex = examplesRegistry.find((e) => e.id === "csi-importer");
    if (ex) loadExample(ex);
  });
  fMenu.addButton({ title: "🧪 Ejemplos" }).on("click", () => {
    const ex = examplesRegistry.find((e) => e.id === "test-m-dual");
    if (ex) loadExample(ex);
  });
  setTimeout(() => makePaneDraggable(paneHost), 0);
}

// Helper de vistas — usa contexto Three.js del viewer (camera + controls)
// ════════════════════════════════════════════════════════════════════════
// Simulador de mouse — Demo CAD interactivo
// ════════════════════════════════════════════════════════════════════════
/**
 * Crea un cursor virtual visible (overlay HTML) que se anima sobre la
 * pantalla, hace click en los botones del CAD panel y dibuja un pórtico
 * paso por paso. El usuario VE el cursor moviéndose en su propio browser.
 *
 * Workflow del demo:
 *   1. Crear cursor visible (div rojo con halo amarillo)
 *   2. Mover cursor al botón "⬇ Planta (X-Y)" → click → vista cambia
 *   3. Mover cursor al botón "Plano XY (planta)" en CAD tools → click
 *   4. Mover cursor al botón "／ Línea (frame)" → click → tool seleccionado
 *   5. Mover cursor a 4 posiciones en el canvas → click cada una
 *   6. Pórtico 2D dibujado completamente
 */
function runCadDemo(): void {
  // 1) Crear/reusar cursor visible
  let cursor = document.getElementById("hk-fake-cursor") as HTMLDivElement | null;
  if (!cursor) {
    cursor = document.createElement("div");
    cursor.id = "hk-fake-cursor";
    cursor.style.cssText = [
      "position:fixed",
      "width:14px",
      "height:14px",
      "pointer-events:none",
      "z-index:99999",
      "background:radial-gradient(circle,#ef4444 30%,transparent 60%)",
      "border:2px solid #fbbf24",
      "border-radius:50%",
      "box-shadow:0 0 6px #ef4444,0 0 12px #fbbf24",
      "transition:left 0.7s ease-in-out, top 0.7s ease-in-out, transform 0.2s",
      "transform:translate(-50%,-50%)",
      "left:50px",
      "top:50px",
    ].join(";");
    document.body.appendChild(cursor);
  }
  // Tag de status para que el usuario vea qué paso se está ejecutando
  let statusEl = document.getElementById("hk-demo-status") as HTMLDivElement | null;
  if (!statusEl) {
    statusEl = document.createElement("div");
    statusEl.id = "hk-demo-status";
    statusEl.style.cssText = [
      "position:fixed",
      "top:10px",
      "left:50%",
      "transform:translateX(-50%)",
      "padding:8px 16px",
      "background:rgba(15, 23, 42, 0.95)",
      "color:#22d3ee",
      "border:1px solid #22d3ee",
      "border-radius:8px",
      "font-family:Consolas,monospace",
      "font-size:14px",
      "z-index:99998",
      "box-shadow:0 0 12px rgba(34, 211, 238, 0.4)",
    ].join(";");
    document.body.appendChild(statusEl);
  }
  const status = (txt: string) => {
    if (statusEl) statusEl.textContent = "🎬 Demo: " + txt;
  };
  // Buscar botón del Tweakpane por texto
  const findBtn = (txt: string): HTMLButtonElement | null => {
    const btns = document.querySelectorAll<HTMLButtonElement>("button.tp-btnv_b");
    for (const b of Array.from(btns)) if (b.textContent?.includes(txt)) return b;
    return null;
  };
  // Mover cursor a un botón + click
  const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
  const moveCursorTo = async (x: number, y: number) => {
    if (!cursor) return;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
    await sleep(800);
  };
  const clickAnimation = async () => {
    if (!cursor) return;
    cursor.style.transform = "translate(-50%,-50%) scale(1.6)";
    cursor.style.background = "radial-gradient(circle,#ffffff 30%,#ef4444 60%)";
    await sleep(250);
    cursor.style.transform = "translate(-50%,-50%) scale(1)";
    cursor.style.background = "radial-gradient(circle,#ef4444 30%,transparent 60%)";
    await sleep(150);
  };
  const clickButton = async (label: string): Promise<boolean> => {
    const b = findBtn(label);
    if (!b) return false;
    const r = b.getBoundingClientRect();
    if (r.width === 0) return false;
    await moveCursorTo(r.left + r.width / 2, r.top + r.height / 2);
    await clickAnimation();
    b.click();
    await sleep(400);
    return true;
  };
  // Convertir coords mundo → pantalla
  const worldToScreen = (wx: number, wy: number, wz: number): { x: number; y: number } | null => {
    const v = document.querySelector("#viewer") as HTMLElement | null;
    const ctx: any = v ? (v as any).__ctx : null;
    if (!ctx) return null;
    const camera = ctx.camera as THREE.Camera;
    const canvas = v?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const vec = new THREE.Vector3(wx, wy, wz);
    vec.project(camera);
    return {
      x: rect.left + (vec.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-vec.y * 0.5 + 0.5) * rect.height,
    };
  };
  // ── Demo principal — secuencia paso por paso ──
  (async () => {
    status("Limpiando lienzo...");
    drawingPoints.val = [];
    drawingPolylines.val = [[]];
    drawingAreas.val = [];
    await sleep(500);
    status("Click en ⬇ Planta (X-Y)");
    await clickButton("⬇ Planta (X-Y)");
    status("Click en ／ Línea (frame)");
    await clickButton("／ Línea (frame)");
    // Setear vista para que las coords mundiales se proyecten visiblemente
    setView("plan");
    await sleep(700);
    // Dibujar 4 nodos en planta — un cuadrado 5×4 m a Z=0
    const seq: Array<[number, number, number]> = [
      [0, 0, 0], [5, 0, 0], [5, 4, 0], [0, 4, 0],
    ];
    for (let i = 0; i < seq.length; i++) {
      const [x, y, z] = seq[i];
      status(`Click nodo ${i + 1} en (${x}, ${y}, ${z})`);
      const sp = worldToScreen(x, y, z);
      if (sp) await moveCursorTo(sp.x, sp.y);
      await clickAnimation();
      // Dibujar punto + extender polyline
      const dpFn = (window as any).__hekatanDrawAt as ((x: number, y: number, z: number) => void) | undefined;
      if (dpFn) dpFn(x, y, z);
      await sleep(500);
    }
    status("Demo completo ✓ — pórtico de 4 puntos en planta dibujado");
    await sleep(3000);
    // ── Cleanup: eliminar cursor fake + status + listener Escape ──
    if (statusEl) {
      statusEl.style.transition = "opacity 1.5s";
      statusEl.style.opacity = "0";
      setTimeout(() => statusEl?.remove(), 1500);
    }
    if (cursor) {
      cursor.style.transition = "opacity 1s";
      cursor.style.opacity = "0";
      setTimeout(() => cursor?.remove(), 1000);
    }
    cleanup();
  })().catch((e) => {
    status("Error: " + e.message);
    console.error("[Demo CAD]", e);
    cursor?.remove();
    statusEl?.remove();
    cleanup();
  });

  // Escape cancela la demo en cualquier momento
  function escHandler(ev: KeyboardEvent) {
    if (ev.key !== "Escape") return;
    cursor?.remove();
    statusEl?.remove();
    cleanup();
  }
  function cleanup() {
    window.removeEventListener("keydown", escHandler);
  }
  window.addEventListener("keydown", escHandler);
}
// API global para limpiar manualmente cursor/status si quedan colgados
(window as any).__hekatanCleanupDemoCursor = () => {
  document.getElementById("hk-fake-cursor")?.remove();
  document.getElementById("hk-demo-status")?.remove();
};

function setView(preset: "iso" | "plan" | "elevX" | "elevY") {
  // Sincroniza plano CAD + drawing plane con la vista
  const cadSt = (window as any).__hekatanCadState?.get?.();
  if (cadSt) {
    if (preset === "plan") cadSt.workPlane = "xy";
    else if (preset === "elevX") cadSt.workPlane = "xz";
    else if (preset === "elevY") cadSt.workPlane = "yz";
  }
  // ── El plano de trabajo se ancla al PUNTO DE REFERENCIA ──────────────────
  //
  // Iba siempre a [0,0,0]. Cambiar a un alzado te dejaba dibujando en un plano
  // que corta por el origen: si la planta va de y = 0 a y = 15, el alzado
  // cortaba por y = 0 y no habia forma de saber por donde. Ahora pasa por el
  // ultimo punto dibujado, que es "sigo desde donde estaba".
  //
  // ⚠️ Esto tiene que estar AQUI ademas de en `setPlane` del panel: `setPlane`
  // fija el grid y despues llama a `setView`, que lo volvia a poner en el
  // origen. El marcador y la barra ya decian Y = 15 y el plano seguia en 0.
  const pRef = ((window as any).__hekatanPuntoRef as number[] | undefined)
            ?? (() => { const p = drawingPoints.rawVal ?? [];
                        return p.length ? p[p.length - 1] : [0, 0, 0]; })();
  if (preset === "plan") {
    const wz = (window as any).__hekatanCadState?.get?.()?.workZ ?? 0;
    drawingGridTarget.val = { position: [0, 0, wz], rotation: [Math.PI/2, 0, 0] };
  } else if (preset === "elevX") {
    drawingGridTarget.val = { position: [0, pRef[1] ?? 0, 0], rotation: [0, 0, 0] };
  } else if (preset === "elevY") {
    // YZ: rotZ(π/2) — combinada con la pre-rot rotX(π/2) de la geometría
    // del plano da normal +X (vertical YZ). rotY no servía porque rotY
    // sobre +Y deja +Y → plano queda horizontal y el raycaster falla.
    drawingGridTarget.val = { position: [pRef[0] ?? 0, 0, 0], rotation: [0, 0, Math.PI/2] };
  }
  if (preset !== "iso") {
    const k = preset === "plan" ? "xy" : preset === "elevX" ? "xz" : "yz";
    try { (window as any).__hekatanMarcarRef?.(k, pRef); } catch {}
  }
  console.log(`[Vista ↔ CAD] preset=${preset}, workPlane=${cadSt?.workPlane ?? "n/a"}`);

  const ctx: any = (viewerElm as any).__ctx;
  if (!ctx) { console.warn("[setView] viewer __ctx no disponible"); return; }
  const { perspCamera, orthoCamera, controls, render, setActiveCamera } = ctx;
  if (!setActiveCamera || !perspCamera || !orthoCamera) {
    console.warn("[setView] viewer no expone perspCamera/orthoCamera/setActiveCamera");
    return;
  }

  // BBox con fallback robusto (lienzo vacío → centrado en origen, diag=10)
  const nodesArr = states.nodes.rawVal ?? [];
  let cx = 0, cy = 0, cz = 0, diag = 10;
  if (nodesArr.length > 0) {
    let xMin=Infinity,yMin=Infinity,zMin=Infinity,xMax=-Infinity,yMax=-Infinity,zMax=-Infinity;
    for (const n of nodesArr) {
      if (n[0]<xMin) xMin=n[0]; if (n[0]>xMax) xMax=n[0];
      if (n[1]<yMin) yMin=n[1]; if (n[1]>yMax) yMax=n[1];
      if (n[2]<zMin) zMin=n[2]; if (n[2]>zMax) zMax=n[2];
    }
    cx = (xMin+xMax)/2; cy = (yMin+yMax)/2; cz = (zMin+zMax)/2;
    const dx = (xMax-xMin) || 1, dy = (yMax-yMin) || 1, dz = (zMax-zMin) || 1;
    diag = Math.sqrt(dx*dx + dy*dy + dz*dz) || 5;
  }
  controls.target.set(cx, cy, cz);

  if (preset === "iso") {
    // Isométrica → perspectiva nativa del viewer
    perspCamera.fov = 45;
    const d = diag * 1.2;
    perspCamera.position.set(cx + d * 0.6, cy - d * 0.6, cz + d * 0.6);
    perspCamera.up.set(0, 0, 1);
    perspCamera.updateProjectionMatrix();
    perspCamera.lookAt(cx, cy, cz);
    setActiveCamera(perspCamera);
  } else {
    // Planta / elevación REAL → OrthographicCamera del viewer
    const w = (viewerElm as HTMLElement).clientWidth || window.innerWidth;
    const h = (viewerElm as HTMLElement).clientHeight || window.innerHeight;
    const aspect = w / h;
    const halfH = Math.max(diag * 0.6, 5);
    const halfW = halfH * aspect;
    orthoCamera.left = -halfW; orthoCamera.right = halfW;
    orthoCamera.top = halfH;   orthoCamera.bottom = -halfH;

    const D = 1000; // distancia (no afecta tamaño en orto, solo orientación)
    if (preset === "plan") {
      // Planta XY: cámara mira -Z, "arriba" en pantalla = +Y (Norte)
      orthoCamera.position.set(cx, cy, cz + D);
      orthoCamera.up.set(0, 1, 0);
    } else if (preset === "elevX") {
      // Elevación frontal: cámara desde -Y → vemos XZ (X horizontal, Z vertical)
      orthoCamera.position.set(cx, cy - D, cz);
      orthoCamera.up.set(0, 0, 1);
    } else if (preset === "elevY") {
      // Elevación lateral: cámara desde +X → vemos YZ
      orthoCamera.position.set(cx + D, cy, cz);
      orthoCamera.up.set(0, 0, 1);
    }
    orthoCamera.updateProjectionMatrix();
    orthoCamera.lookAt(cx, cy, cz);
    setActiveCamera(orthoCamera);
  }

  controls.update();
  render?.();
}

/**
 * Aplica visibilidad dinamica a los bindings registrados con hiddenIf.
 * Un ejemplo lo usa para mostrar/ocultar params segun el valor de otro
 * (ej: layered-shell oculta params de Sandwich cuando el preset es Bimetal).
 */
function applyHiddenBindings() {
  for (const hb of hiddenBindings) {
    try {
      hb.binding.hidden = hb.hiddenIf(currentParams);
    } catch {}
  }
}



// ─────────────────────────────────────────────────────────────────────────
//  Menu contextual estilo ETABS (clic derecho sobre el modelo)
//
//  El Tweakpane tenia TODO desplegado siempre — Vista, Split, Ejes, CAD,
//  OSNAP, plano de trabajo, CLI, cimentacion, patrones, casos, combinaciones,
//  ETABS, SAP, unidades... Para quien no armo el programa es ilegible: no hay
//  forma de saber que mirar.
//  Ahora el panel arranca plegado y el clic derecho abre SOLO lo que aplica a
//  lo que se selecciono, igual que el menu Assign de ETABS.
// ─────────────────────────────────────────────────────────────────────────
let paneActual: any = null;

function carpetas(p: any, out: any[] = []): any[] {
  for (const c of (p?.children ?? [])) {
    if (typeof c.title === "string" && c.children) { out.push(c); carpetas(c, out); }
  }
  return out;
}

function plegarTodo(p: any) {
  for (const f of carpetas(p)) { try { f.expanded = false; } catch { /* no-op */ } }
}

/** Abre la carpeta cuyo titulo contenga `txt` y pliega las demas de su nivel. */
function abrirCarpeta(txt: string) {
  if (!paneActual) return false;
  const todas = carpetas(paneActual);
  const buscada = todas.find((f) =>
    String(f.title).toLowerCase().includes(txt.toLowerCase()));
  if (!buscada) return false;
  plegarTodo(paneActual);
  // abrir la buscada y toda su cadena de padres
  let f: any = buscada;
  const vistos = new Set<any>();
  while (f && !vistos.has(f)) {
    vistos.add(f);
    try { f.expanded = true; } catch { /* no-op */ }
    f = todas.find((c) => (c.children ?? []).includes(f));
  }
  try {
    (buscada as any).element?.scrollIntoView?.({ block: "nearest" });
  } catch { /* no-op */ }
  return true;
}

/** Que se puede hacer segun lo que se selecciono. Los nombres son los de
 *  ETABS a proposito: quien lo usa ahi lo encuentra sin buscar. */
const MENU: Record<string, Array<[string, string]>> = {
  frame: [
    ["Assign ▸ Frame ▸ Section Property", "Secciones"],
    ["Assign ▸ Frame ▸ Local Axes", "Ejes"],
    ["Display ▸ Frame Forces", "Tablas"],
  ],
  area: [
    ["Assign ▸ Area ▸ Deck Section", "Deck"],
    ["Assign ▸ Area ▸ Local Axes", "Ejes"],
    ["Assign ▸ Area ▸ Uniform Load", "Load Patterns"],
    ["Assign ▸ Area ▸ Stiffness Modifiers", "Deck"],
  ],
  joint: [
    ["Assign ▸ Joint ▸ Restraints", "Herramientas FEM"],
    ["Assign ▸ Joint ▸ Loads", "Load Patterns"],
  ],
  nada: [
    ["Vista", "Vista"],
    ["Imagen y GIF", "Imagen"],
    ["Herramientas CAD", "CAD"],
    ["CLI Comandos", "CLI"],
    ["Load Patterns", "Load Patterns"],
    ["Exportar a ETABS", "ETABS"],
    ["Unidades", "Unidades"],
    ["— desplegar todo —", ""],
  ],
};

function montarMenuContextual(pane: any) {
  const v = viewerElm as HTMLElement;
  if (!v || (v as any).__menuPuesto) return;
  (v as any).__menuPuesto = true;

  const menu = document.createElement("div");
  menu.style.cssText = [
    "position:fixed", "z-index:99999", "display:none",
    "background:#22252a", "color:#e6e6e6",
    "border:1px solid #3a3f47", "border-radius:6px",
    "box-shadow:0 6px 24px rgba(0,0,0,.5)",
    "font:12px ui-monospace,Consolas,monospace", "padding:4px 0",
    "min-width:230px",
  ].join(";");
  document.body.appendChild(menu);

  const cerrar = () => { menu.style.display = "none"; };
  window.addEventListener("click", cerrar);
  window.addEventListener("blur", cerrar);

  // capture:true + stopPropagation: el modo CAD usa el boton derecho para
  // cerrar polilinea y se comia el menu antes de que llegara aca.
  // El menu sale con un clic derecho CORTO y sin arrastrar. Si se mantiene
  // apretado para orbitar, no debe aparecer: se estorbarian.
  let dxDer = 0, dyDer = 0, tDer = 0;
  v.addEventListener("pointerdown", (e: PointerEvent) => {
    if (e.button === 2) { dxDer = e.clientX; dyDer = e.clientY; tDer = Date.now(); }
  }, true);

  v.addEventListener("contextmenu", (ev: MouseEvent) => {
    ev.preventDefault();
    const arrastro = Math.hypot(ev.clientX - dxDer, ev.clientY - dyDer) > 5;
    const largo = Date.now() - tDer > 400;
    if (arrastro || largo) return;      // estaba orbitando: no molestar
    ev.stopPropagation();
    // Que hay bajo el cursor. Sin picking fino todavia: si el modelo tiene
    // areas se ofrecen las de area, y siempre las generales.
    const tieneAreas = (states.elements.rawVal ?? []).some((e: any) => e.length >= 3);
    const tipo = tieneAreas ? "area" : "frame";
    const items = [...MENU[tipo], ["", ""] as [string, string], ...MENU.nada];

    menu.innerHTML = "";
    const cab = document.createElement("div");
    cab.textContent = tieneAreas ? "AREA / SHELL" : "FRAME";
    cab.style.cssText = "padding:5px 12px;color:#8a94a6;font-size:11px;" +
                        "border-bottom:1px solid #3a3f47;margin-bottom:3px";
    menu.appendChild(cab);

    for (const [texto, destino] of items) {
      if (!texto) {
        const hr = document.createElement("div");
        hr.style.cssText = "height:1px;background:#3a3f47;margin:4px 0";
        menu.appendChild(hr);
        continue;
      }
      const it = document.createElement("div");
      it.textContent = texto;
      it.style.cssText = "padding:5px 12px;cursor:pointer;white-space:nowrap";
      it.onmouseenter = () => { it.style.background = "#2f3742"; };
      it.onmouseleave = () => { it.style.background = "transparent"; };
      it.onclick = (e) => {
        e.stopPropagation();
        cerrar();
        if (!destino) {
          for (const f of carpetas(paneActual)) {
            try { f.expanded = true; } catch { /* no-op */ }
          }
          return;
        }
        if (!abrirCarpeta(destino)) {
          console.warn("[menu] no encontre la carpeta:", destino);
        }
      };
      menu.appendChild(it);
    }
    menu.style.left = Math.min(ev.clientX, window.innerWidth - 250) + "px";
    menu.style.top = Math.min(ev.clientY, window.innerHeight - 340) + "px";
    menu.style.display = "block";
  }, true);
  console.log("[menu] clic derecho sobre el modelo -> Assign estilo ETABS");
}

function buildParamsPane() {
  // ANTES de dispose: capturar el estado expanded de cada folder del pane
  // anterior, para restaurarlo en el pane nuevo (preserva la UX del usuario
  // cuando un slider con regenOnChange como `nVanos` recrea el pane).
  captureFolderExpandedState();
  // Capturar también el scroll vertical para no resetear al tope tras rebuild.
  // El paneHost o su scrollContainer interno guardan la posición del usuario.
  const prevScrollTop = paneHost.scrollTop;
  // Algunos navegadores ponen el scroll en un wrapper interno
  const innerScroller = paneHost.querySelector(".tp-dfwv") as HTMLElement | null;
  const prevInnerScrollTop = innerScroller?.scrollTop ?? 0;
  if (currentPane) {
    currentPane.dispose();
    currentPane = null;
  }
  lastFolderMap = null;
  paneHost.innerHTML = "";
  // Reset registro de bindings con hiddenIf (cada ejemplo declara los suyos)
  hiddenBindings = [];
  // Reset singletons del Calc/CLI (los folders se recrean en cada rebuild)
  // (singletons calc/cli viven ahora en hekatan-ui/femTools — nada que limpiar aquí)
  if (!currentExample) return;
  // Detector de "ejemplo cimentación pura" (el modelo ES la zapata, no hay
  // superestructura encima). Incluye zapata-aislada, zapata-viga-amarre y
  // las series guerra-ej* (Libro Marcelo Guerra) y safe-bench-* (benchmarks
  // contra SAFE). Sin este check, esos ejemplos se clasifican como
  // edificio y muestran botones inválidos (Volver a vista superestructura,
  // F2K cimentación COMPLETA, ETABS, SAP) que esperan reacciones de columnas.
  const isFoundation = /^(zapata|guerra-ej|safe-bench-)/.test(currentExample.id);
  const pane = new Pane({ container: paneHost, title: currentExample.name });
  paneActual = pane;
  // El panel arranca PLEGADO: con veinte carpetas abiertas a la vez nadie
  // entiende que mirar. Se abre lo que haga falta desde el menu del clic
  // derecho, como el Assign de ETABS.
  plegarTodo(pane);
  montarMenuContextual(pane);
  // Hacer el pane arrastrable desde su title-bar. El DOM del Tweakpane se
  // crea de forma síncrona, así que el handle ya está disponible al llamar.
  setTimeout(() => makePaneDraggable(paneHost), 0);

  // ── Selector con SUBLISTAS por categoría ──
  // Dos dropdowns: Categoría → Ejemplo. Filtra los ejemplos visibles según la
  // categoría elegida. Mucho más manejable cuando hay 30+ ejemplos.
  // Categorías derivadas dinámicamente del registry (cada ExampleDef.category).
  const allCategories = Array.from(new Set(examplesRegistry.map((e) => e.category)));
  // Orden preferido de categorías (las primeras arriba, después alfabético)
  // Los Benchmarks van PRIMEROS, divididos en 5 sub-categorías ordenadas
  // (Frames → Áreas → Sólidos → Combinados → Layered).
  // El árbol lo manda el TIPO DE ELEMENTO, y dentro de Frames los GRADOS DE
  // LIBERTAD, que es el orden en que se estudia: 1 GDL axial → 2 GDL flexión →
  // 3 GDL pórtico plano → 6 GDL espacial → n GDL sistemas.
  //
  // Antes el primer nivel era la PROCEDENCIA del ejemplo (Benchmarks, Libros,
  // Icónicos, Edificios…), o sea de dónde salió y no qué es: el mismo voladizo
  // de acero vivía en tres cajones según quién lo hubiera metido, y para buscar
  // "una placa" había que mirar en cinco sitios. Los benchmarks NO se pierden:
  // llevan el flag `benchmark` (el selector les pone 🏁 delante) y siguen
  // teniendo su filtro propio que los junta a todos.
  //
  // Quién es frame, shell o sólido se midió construyendo cada ExampleDef y
  // contando sus elementos por número de nodos (2 / 3-4 / 8), no a ojo. Se
  // mantiene con `ordenar_categorias.py`.
  const categoryOrder = [
    "1️⃣ Frames · 🎯 1 GDL Axial",
    "1️⃣ Frames · 🎯 2 GDL Flexión",
    "1️⃣ Frames · 🎯 3 GDL Pórtico plano",
    "1️⃣ Frames · 🎯 6 GDL Espacial",
    "1️⃣ Frames · 🎯 n GDL Sistemas",
    "2️⃣ Shells · 🧱 Placas",
    "2️⃣ Shells · 🕸 Membranas",
    "2️⃣ Shells · 🌀 Drilling ITW",
    "2️⃣ Shells · 🐚 Cáscaras",
    "2️⃣ Shells · 🥞 Layered",
    "2️⃣ Shells · 🧰 Cimentaciones",
    "2️⃣ Shells · 🔩 Conexiones",
    "3️⃣ Sólidos",
    "4️⃣ Mixtos · 🏢 Edificios",
    "4️⃣ Mixtos · 🧰 Cimentaciones",
    "4️⃣ Mixtos · 🔩 Conexiones",
    "4️⃣ Mixtos · 🔀 Losas con vigas",
    "4️⃣ Mixtos · 🌉 Puentes e icónicos",
    "4️⃣ Mixtos · 🌀 Drilling ITW",
    "🧪 Utilidades",
    "🗄 Legacy",
  ];
  const sortedCats = [
    ...categoryOrder.filter((c) => allCategories.includes(c)),
    ...allCategories.filter((c) => !categoryOrder.includes(c)).sort(),
  ];
  const ALL = "Todas";
  const ALL_BENCHMARKS = "🏁 Benchmarks · TODOS";   // pseudo-categoría que muestra los 12 benchmarks juntos
  // Lo mismo para la familia ITW. Los seis casos del elemento con drilling son
  // UNA cosa para quien los estudia, pero el árbol los parte en dos porque lo
  // manda el TIPO DE ELEMENTO: los cuatro tests son membrana pura (Shells) y
  // los dos muros llevan viga (Mixtos). Las dos hojas se llaman igual y el
  // desplegable trunca el texto, así que entrando por una parecía que faltaban
  // cuatro ejemplos. Esta pseudo-categoría los junta sin romper el árbol.
  const ALL_ITW = "🌀 Drilling ITW · TODOS";
  // Mostrar las sub-categorías de Benchmarks con INDENTACIÓN visual (sub-folders):
  //   🏁 Benchmarks (TODOS)         ← header del grupo (todos los benchmarks juntos)
  //     ▸ 1️⃣ Frames                 ← sub-folder
  //     ▸ 2️⃣ Áreas
  //     ▸ 3️⃣ Sólidos
  //     ▸ 4️⃣ Combinados
  //     ▸ 5️⃣ Layered
  // En Tweakpane: options = { "display label": "actual value" }
  //   KEY = lo que el usuario VE en el dropdown
  //   VALUE = lo que se almacena en selectorObj.category (usado para filtrar)
  //
  // La jerarquía es GENÉRICA: la marca el separador " · " de la propia
  // categoría, valga para la familia que valga. Antes solo la entendían las que
  // empezaban por "🏁 Benchmarks · " y el resto salía en plano — por eso el
  // árbol nuevo no se veía por ningún lado aunque las categorías ya lo
  // dijeran. Cada raíz ("1️⃣ Frames") aparece como cabecera que muestra TODO lo
  // suyo, y debajo van sus hojas indentadas.
  const catOptions: Record<string, string> = { [ALL]: ALL };
  const raicesPuestas = new Set<string>();
  for (const c of sortedCats) {
    const segments = c.split(" · ");
    if (segments.length === 1) { catOptions[c] = c; continue; }
    const raiz = segments[0];
    if (!raicesPuestas.has(raiz)) {
      const nEnRaiz = examplesRegistry.filter((e) => e.category?.startsWith(raiz + " · ")).length;
      catOptions[`${raiz}  (todos: ${nEnRaiz})`] = raiz;   // cabecera del grupo
      raicesPuestas.add(raiz);
    }
    const last = segments[segments.length - 1];
    // La KEY es lo que se VE y tiene que ser única: "🧰 Cimentaciones" está en
    // Shells (zapatas de solo placa) y en Mixtos (con pedestal y vigas), y si
    // las dos hojas se llamaran igual una pisaría a la otra en el objeto de
    // opciones y una rama entera desaparecería del desplegable.
    let indent = segments.length === 2
      ? `       ▸ ${last}`
      : `          ▸▸ ${segments[segments.length - 2]} · ${last}`;
    if (indent in catOptions) indent = `${indent}  (${raiz.split(" ")[0]})`;
    catOptions[indent] = c;
  }
  // Los benchmarks ya no son un cajón del árbol (están repartidos por tipo de
  // elemento), pero siguen siendo un filtro útil: se listan por su FLAG.
  catOptions[`🏁 Benchmarks (todos: ${examplesRegistry.filter((e) => e.benchmark).length})`] = ALL_BENCHMARKS;
  const nITW = examplesRegistry.filter((e) => e.category?.includes("🌀 Drilling ITW")).length;
  if (nITW) catOptions[`🌀 Drilling ITW (todos: ${nITW})`] = ALL_ITW;

  const selectorObj = { category: currentExample.category, id: currentExample.id };

  // Con un modelo cargado por URL, el selector Categoria/Ejemplo cambiaria el
  // modelo por otro: es lo ultimo que se quiere tener a mano. Va dentro de un
  // folder cerrado en vez de ocupar las dos primeras filas del panel.
  const selHost = URL_HEKS
    ? pane.addFolder({ title: "📂 Cambiar de ejemplo", expanded: false })
    : pane;

  const catBinding = selHost.addBinding(selectorObj, "category", {
    label: "Categoría", options: catOptions,
  });

  // Helper: opciones del dropdown "Ejemplo" filtradas por la categoría seleccionada.
  // Tweakpane normaliza las KEYS de options (strip whitespace al inicio), entonces
  // las sub-categorías de Benchmarks se almacenan como "▸ 1️⃣ Frames" en lugar de
  // "🏁 Benchmarks · 1️⃣ Frames". Necesitamos matchear ambos formatos.
  const matchesCategory = (exampleCat: string | undefined, selectedCat: string): boolean => {
    if (!exampleCat) return false;
    if (exampleCat === selectedCat) return true;
    // Cabecera de grupo ("1️⃣ Frames"): entra todo lo que cuelgue de ella.
    if (exampleCat.startsWith(selectedCat + " · ")) return true;
    // Hoja indentada: Tweakpane recorta los espacios del principio de la KEY,
    // así que llega como "▸ 🎯 1 GDL Axial". Vale con que la categoría del
    // ejemplo termine en ese sufijo — el 2º nivel lleva su padre delante para
    // que "🧰 Cimentaciones" de Shells no se cruce con el de Mixtos.
    if (selectedCat.startsWith("▸")) {
      const trimmed = selectedCat.replace(/^▸+\s*/, "");
      return exampleCat.endsWith(trimmed);
    }
    return false;
  };
  const buildExOptions = (cat: string) =>
    Object.fromEntries(
      examplesRegistry
        .filter((e) => {
          if (cat === ALL) return true;
          if (cat === ALL_BENCHMARKS || cat === "🏁 Benchmarks (TODOS los 12)") {
            return e.category?.startsWith("🏁 Benchmarks");
          }
          if (cat === ALL_ITW) return !!e.category?.includes("🌀 Drilling ITW");
          return matchesCategory(e.category, cat);
        })
        .map((e) => [`${e.benchmark ? "🏁 " : ""}${e.name}`, e.id])
    );

  let exBinding = selHost.addBinding(selectorObj, "id", {
    label: "Ejemplo", options: buildExOptions(selectorObj.category),
  });
  exBinding.on("change", (e) => {
    const nextEx = examplesRegistry.find((x) => x.id === e.value);
    // ── BUGFIX: defer loadExample a next tick (ver comentario abajo) ──
    if (nextEx) setTimeout(() => loadExample(nextEx), 0);
  });

  catBinding.on("change", (e) => {
    // Reconstruir el dropdown "Ejemplo" cuando cambia la categoría.
    const newOptions = buildExOptions(e.value);
    const newIds = Object.values(newOptions);
    if (newIds.length === 0) return;
    // Si el id actual no está en la nueva categoría, switch al primero
    if (!newIds.includes(selectorObj.id)) selectorObj.id = newIds[0] as string;
    // Tweakpane no permite mutar `options` de un binding existente — hay que
    // disponer y recrear. Usamos el orden actual (después de category, antes de
    // que termine el constructor del pane).
    try { exBinding.dispose(); } catch {}
    exBinding = selHost.addBinding(selectorObj, "id", {
      label: "Ejemplo", options: newOptions, index: 2,  // colocar justo después de Categoría
    });
    exBinding.on("change", (ev) => {
      const nextEx = examplesRegistry.find((x) => x.id === ev.value);
      if (nextEx) setTimeout(() => loadExample(nextEx), 0);
    });
    // Cargar el ejemplo seleccionado en la nueva categoría
    const newEx = examplesRegistry.find((x) => x.id === selectorObj.id);
    if (newEx && newEx.id !== currentExample?.id) setTimeout(() => loadExample(newEx), 0);
  });

  // ── Ejemplos legacy del upstream awatif: solo botón al standalone ──
  if (currentExample.standaloneUrl) {
    const url = currentExample.standaloneUrl;
    const note = pane.addFolder({ title: "ℹ Ejemplo legacy", expanded: true });
    // Tweakpane no tiene texto multilínea fácil; uso botones consecutivos como labels.
    note.addButton({ title: "🔗 Abrir ejemplo →" }).on("click", () => {
      window.location.href = url;
    });
    note.addButton({ title: "(usa toolbar VanJS propio)" }).on("click", () => {});
    currentPane = pane;
    return;
  }

  // ── Reporte matemático FEM (estilo Calcpad) — pendiente módulo mathReport ──

  // ── 🛠 Herramientas FEM (orquestador unificado en hekatan-ui) ──
  // Una sola llamada agrega el folder completo:
  //   🔍 Inspect / 📈 Modal+ (si hasModal) / 📜 Log / 🧮 Calc / 💻 CLI /
  //   📄 Report / ▶ Calcular
  // Todo el código de los paneles vive en `hekatan-ui/src/femTools/`
  // (registry singletons + attach helper). El workspace solo conecta el
  // contexto reactivo (states + ejemplo activo + onRebuild).
  attachFemTools(pane, {
    nodes, elements, nodeInputs, elementInputs,
    deformOutputs, analyzeOutputs, objects3D,
    currentExample: currentExample ?? undefined,
    currentParams,
    modalPanelLegacy: modalPanel,
    onRebuild: () => { try { (window as any).__hekatanRebuild?.(); } catch {} },
  });

  // ── Vista (planta / elevación / isométrica + ejes A,B,C / 1,2,3) ──
  const fView = pane.addFolder({ title: "Vista", expanded: false });
  fView.addButton({ title: "🏗 Isométrica" }).on("click", () => setView("iso"));
  fView.addButton({ title: "⬇ Planta (X-Y)" }).on("click", () => setView("plan"));
  fView.addButton({ title: "→ Elevación X (frente)" }).on("click", () => setView("elevX"));
  fView.addButton({ title: "↑ Elevación Y (lado)" }).on("click", () => setView("elevY"));

  // ── 📷 PNG y 🎞 GIF, como el visor web de DWG ──
  // Hasta ahora el workspace no tenía forma de sacar una imagen: para meter el
  // modelo en un informe había que recortar una captura de pantalla, que trae
  // los paneles y sale a la resolución de la ventana. El PNG sale del lienzo
  // (sin paneles) y el GIF orbita el modelo, que es lo que se manda por chat.
  const fImg = fView.addFolder({ title: "📷 Imagen y GIF", expanded: true });
  const bPng = fImg.addButton({ title: "📷 PNG de la vista" });
  bPng.on("click", async () => {
    bPng.title = "📷 guardando…";
    const b = await exportarPng(viewerElm as HTMLElement, "hekatan_struct.png");
    bPng.title = b ? "📷 PNG de la vista" : "📷 PNG — falló";
  });
  const gifCfg = { frames: 36, vueltas: 1, ms: 80 };
  fImg.addBinding(gifCfg, "frames", { min: 8, max: 72, step: 4, label: "frames" });
  fImg.addBinding(gifCfg, "ms", { min: 40, max: 200, step: 10, label: "ms/frame" });
  const bGif = fImg.addButton({ title: "🎞 GIF orbitando" });
  bGif.on("click", async () => {
    const b = await exportarOrbitaGif(viewerElm as HTMLElement, {
      frames: gifCfg.frames, vueltas: gifCfg.vueltas, delayMs: gifCfg.ms,
      filename: "hekatan_struct_orbita.gif",
      onProgress: (d, t) => { bGif.title = `🎞 GIF ${d}/${t}`; },
    });
    bGif.title = b ? "🎞 GIF orbitando" : "🎞 GIF — falló";
  });

  // Para verificar de fuera (headless) sin depender de un diálogo de descarga:
  // devuelve el PNG/GIF como data URL y se comprueba el TAMAÑO y la cabecera,
  // no una captura de pantalla.
  (window as any).hekatanStruct = {
    ...((window as any).hekatanStruct || {}),
    // Desplazamientos NODO POR NODO, para comparar contra ETABS de fuera.
    // Se devuelven con la COORDENADA, no con el indice: los dos programas
    // numeran distinto, y lo unico que comparten es el punto del espacio.
    desplazamientos: () => {
      const nodes = states.nodes.rawVal as number[][];
      const def = (states.deformOutputs.rawVal as any)?.deformations;
      if (!nodes || !def) return null;
      const out: any[] = [];
      for (let i = 0; i < nodes.length; i++) {
        const d = def.get ? def.get(i) : def[i];
        if (!d) continue;
        out.push({ x: nodes[i][0], y: nodes[i][1], z: nodes[i][2],
                   ux: d[0], uy: d[1], uz: d[2] });
      }
      return out;
    },
    // Modal: periodos y forma de cada modo, tambien por coordenada.
    modal: () => {
      const m = (states as any).modalOutputs?.rawVal
             || (states as any).analyzeOutputs?.rawVal?.modal;
      if (!m) return null;
      const nodes = states.nodes.rawVal as number[][];
      return { periodos: m.periods ?? m.T ?? null,
               nNodos: nodes ? nodes.length : 0,
               modos: m.modeShapes ? m.modeShapes.length : 0 };
    },
    pngDataUrl: async () => {
      const b = await pngBlob(viewerElm as HTMLElement);
      if (!b) return null;
      return await new Promise<string>((res) => {
        const r = new FileReader(); r.onload = () => res(String(r.result));
        r.readAsDataURL(b);
      });
    },
    gifDataUrl: async (frames = 12) => {
      const b = await exportarOrbitaGif(viewerElm as HTMLElement,
        { frames, filename: "" });
      if (!b) return null;
      return await new Promise<string>((res) => {
        const r = new FileReader(); r.onload = () => res(String(r.result));
        r.readAsDataURL(b);
      });
    },
  };

  // ── 🔀 Vista doble (split): izq dibujable + der preview ──
  // Renderiza el scene dos veces lado a lado. El usuario dibuja en el
  // panel izquierdo (vista activa); el panel derecho muestra el modelo
  // desde otra cámara (iso/planta/elevX/elevY) sincronizada en tiempo
  // real — útil para ver cómo queda en alzado mientras dibujás en planta.
  const fSplit = fView.addFolder({ title: "🔀 Vista doble (split)", expanded: false });
  const splitState = { enabled: false, secondary: 0 };  // 0=iso 1=plan 2=elevX 3=elevY
  const buildSecondaryCamera = (kind: number): THREE.Camera => {
    const ctx: any = (viewerElm as any).__ctx;
    const w = (viewerElm as HTMLElement).clientWidth || window.innerWidth;
    const h = (viewerElm as HTMLElement).clientHeight || window.innerHeight;
    const aspect = (w / 2) / h;  // panel derecho = media-pantalla
    const nodesArr = states.nodes.rawVal ?? [];
    let cx=0,cy=0,cz=0,diag=10;
    if (nodesArr.length) {
      let xMin=Infinity,yMin=Infinity,zMin=Infinity,xMax=-Infinity,yMax=-Infinity,zMax=-Infinity;
      for (const n of nodesArr) {
        if (n[0]<xMin) xMin=n[0]; if (n[0]>xMax) xMax=n[0];
        if (n[1]<yMin) yMin=n[1]; if (n[1]>yMax) yMax=n[1];
        if (n[2]<zMin) zMin=n[2]; if (n[2]>zMax) zMax=n[2];
      }
      cx=(xMin+xMax)/2; cy=(yMin+yMax)/2; cz=(zMin+zMax)/2;
      const dx=(xMax-xMin)||1,dy=(yMax-yMin)||1,dz=(zMax-zMin)||1;
      diag = Math.sqrt(dx*dx+dy*dy+dz*dz)||5;
    }
    if (kind === 0) {
      // Iso → PerspectiveCamera nueva
      const pc = new THREE.PerspectiveCamera(45, aspect, 0.1, 100000);
      const d = diag * 1.2;
      pc.position.set(cx + d*0.6, cy - d*0.6, cz + d*0.6);
      pc.up.set(0,0,1); pc.lookAt(cx,cy,cz); pc.updateProjectionMatrix();
      return pc;
    }
    // Planta/elevX/elevY → OrthographicCamera nueva
    const halfH = Math.max(diag * 0.6, 5);
    const oc = new THREE.OrthographicCamera(-halfH*aspect, halfH*aspect, halfH, -halfH, -100000, 100000);
    const D = 1000;
    if (kind === 1) { oc.position.set(cx, cy, cz + D); oc.up.set(0,1,0); }
    else if (kind === 2) { oc.position.set(cx, cy - D, cz); oc.up.set(0,0,1); }
    else { oc.position.set(cx + D, cy, cz); oc.up.set(0,0,1); }
    oc.lookAt(cx, cy, cz); oc.updateProjectionMatrix();
    return oc;
  };
  const refreshSplit = () => {
    const ctx: any = (viewerElm as any).__ctx;
    if (!ctx?.setSplitMode) return;
    if (splitState.enabled) {
      ctx.setSplitMode(true, buildSecondaryCamera(splitState.secondary));
    } else {
      ctx.setSplitMode(false);
    }
  };
  fSplit.addBinding(splitState, "enabled", { label: "Activar" }).on("change", refreshSplit);
  fSplit.addBinding(splitState, "secondary", {
    label: "Panel derecho",
    options: { "Isométrica": 0, "Planta (XY)": 1, "Elev. X": 2, "Elev. Y": 3 },
  }).on("change", refreshSplit);
  fSplit.addButton({ title: "🔄 Re-encuadrar derecha" }).on("click", refreshSplit);
  // Exponer para que el hook reactivo de drawingPoints (más abajo) pueda
  // re-encuadrar el panel derecho automáticamente cada vez que se dibuja.
  (window as any).__hekatanRefreshSplit = refreshSplit;
  (window as any).__hekatanSplitState = splitState;
  // ── 🎬 Simulador de mouse — demo visible en el browser ──
  // Crea un cursor virtual (rojo + halo) que se anima sobre la pantalla,
  // hace click en los botones del CAD panel y dibuja un pórtico paso a
  // paso. El usuario VE el cursor moviéndose en su propio browser.
  fView.addButton({ title: "🎬 Demo simulador CAD" }).on("click", () => runCadDemo());
  // ── Vistas por ejes (A,B,C en X | 1,2,3 en Y) — al estilo FEM Studio ──
  // Cada eje es una elevación PARALELA a un plano X=cte o Y=cte que
  // contiene una columna del modelo. Útil para inspeccionar un frame
  // específico de un edificio multi-vano.
  const fAxes = fView.addFolder({ title: "📍 Ejes (frames individuales)", expanded: false });
  const xLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const buildAxisButtons = () => {
    // Limpiar buttons previos del folder
    try {
      const ch = (fAxes as any).children;
      while (ch && ch.length) {
        const c = ch[ch.length - 1];
        if (c.dispose) c.dispose();
        else (fAxes as any).remove?.(c);
      }
    } catch {}
    const ns = states.nodes.rawVal ?? [];
    if (!ns.length) {
      fAxes.addButton({ title: "(modelo vacío — dibujá nodos)" }).on("click", () => {});
      return;
    }
    // Recolectar X únicos + Y únicos (ordenados)
    const xs = Array.from(new Set(ns.map(n => +n[0].toFixed(3)))).sort((a, b) => a - b);
    const ys = Array.from(new Set(ns.map(n => +n[1].toFixed(3)))).sort((a, b) => a - b);
    xs.forEach((x, i) => {
      const lbl = i < xLabels.length ? xLabels[i] : `X${i}`;
      fAxes.addButton({ title: `Eje ${lbl} (X=${x.toFixed(2)} m)` }).on("click", () => {
        setView("elevX");
        const ctx: any = (viewerElm as any).__ctx;
        if (ctx?.controls?.target) {
          ctx.controls.target.x = x;
          ctx.camera.position.x = x + 25;
          ctx.controls.update?.();
          ctx.render?.();
        }
      });
    });
    ys.forEach((y, i) => {
      fAxes.addButton({ title: `Eje ${i + 1} (Y=${y.toFixed(2)} m)` }).on("click", () => {
        setView("elevY");
        const ctx: any = (viewerElm as any).__ctx;
        if (ctx?.controls?.target) {
          ctx.controls.target.y = y;
          ctx.camera.position.y = y - 25;
          ctx.controls.update?.();
          ctx.render?.();
        }
      });
    });
  };
  buildAxisButtons();
  // NOTA: removido van.derive sobre states.nodes — causaba loop infinito
  // (cada rebuild de los buttons disparaba derive del Tweakpane que volvía
  // a cambiar nodes). El usuario debe re-cargar el ejemplo o cambiar de
  // ejemplo para que se reconstruyan los botones de ejes.
  // Toggle dibujar ejes visibles A/B/C + 1/2/3 sobre el modelo
  const proxyAxes = { visible: false };
  fAxes.addBinding(proxyAxes, "visible", { label: "👁 Mostrar ejes en escena" }).on("change", (ev: any) => {
    if (!ev.value) {
      (window as any).__hekatanHideAxes?.();
      return;
    }
    const ns = states.nodes.rawVal ?? [];
    if (!ns.length) return;
    const xs = Array.from(new Set(ns.map(n => +n[0].toFixed(3)))).sort((a, b) => a - b);
    const ys = Array.from(new Set(ns.map(n => +n[1].toFixed(3)))).sort((a, b) => a - b);
    const zMax = Math.max(...ns.map(n => n[2]), 3);
    (window as any).__hekatanShowAxes?.(xs, ys, zMax);
  });

  // ── ✏ CAD Drawer / 💻 CLI Editor — DISPONIBLES EN TODOS LOS EJEMPLOS ──
  // Permiten agregar/editar/eliminar elementos del modelo en cualquier ejemplo.
  // Si estás en cad-draw o cli-modeler, las acciones MUTAN el modelo y se
  // re-renderizan. En otros ejemplos, las acciones agregan al script CLI
  // global (window.__hekatanCliScript) — el usuario puede revisar el script
  // equivalente del modelo actual y exportarlo.
  // (folder colapsado por default cuando NO es cad-draw/cli-modeler para
  // no estorbar el workflow del ejemplo).
  const isModelerCtx = currentExample && (
    currentExample.id === "cad-draw" ||
    currentExample.id === "cli-modeler" ||
    currentExample.id === "new-blank"
  );

  // ── ✏ CAD Drawer — UI vive ahora en hekatan-ui (addCadPanel) ──
  // Antes esto era ~300 líneas de Tweakpane inline acá. Movido a
  // hekatan-ui/src/cad/getCadPanel.ts para que CUALQUIER consumidor del
  // viewer (no solo el workspace) reciba la misma UI sin duplicar código.
  // El workspace solo inyecta los van.states del modelo de dibujo + hooks
  // a setView/splitState que son específicos del workspace.
  if (currentExample) {
    addCadPanel({
      parentPane: pane,
      expanded: !!isModelerCtx,
      viewerElm,
      drawing: {
        points: drawingPoints,
        polylines: drawingPolylines,
        areas: drawingAreas,
        auxLines: drawingAuxLines,
        gridTarget: drawingGridTarget,
      },
      hooks: {
        setView,
        splitState,
        refreshSplit,
        onRebuild: () => { try { (window as any).__hekatanRebuild?.(); } catch {} },
      },
    });

    // ── Ribbon CAD, empezado de cero — `?ribbon=1` ──────────────────────────
    // Conviven a propósito: el Tweakpane es una COLUMNA que no cabe en la
    // pantalla y obliga a viajar con el ratón hasta el borde; el ribbon es una
    // FILA pegada al lienzo con la letra del atajo a la vista, para trabajar
    // como en AutoCAD (mano izquierda en el teclado). Los dos encendidos se
    // pueden comparar con el mismo modelo antes de tirar ninguno.
    // Encendido POR DEFECTO. Nació detrás de `?ribbon=1` para poder comparar,
    // pero es lo único de la pantalla que dice qué hacer: lleva la guía (? y
    // F1) y la barra que anuncia contra qué plano y a qué cota se está
    // dibujando. Sin él se entra a un lienzo 3D vacío sin una sola indicación.
    // `?ribbon=0` lo apaga y queda el Tweakpane solo.
    if (new URLSearchParams(location.search).get("ribbon") !== "0"
        && !document.getElementById("hk-ribbon")) {
      const host = (viewerElm.parentElement ?? viewerElm) as HTMLElement;
      addCadRibbon(host, {
        plegadoPorDefecto: ribbonPlegadaPara(currentExample?.id),
        setTool: (t) => {
          try { (window as any).__hekatanCadState?.setTool?.(t); } catch {}
          try { (window as any).__hekatanCadResetPending?.(); } catch {}
          (window as any).__hekatanRectSelectExplicit = (t === "select");
        },
        getTool: () => (window as any).__hekatanCadState?.get?.()?.tool ?? null,
        setView,
        setPlane: (k) => {
          const st = (window as any).__hekatanCadState?.get?.();
          if (st) st.workPlane = k;
          const wz = st?.workZ ?? 0;
          drawingGridTarget.val = k === "xy"
            ? { position: [0, 0, wz], rotation: [Math.PI / 2, 0, 0] }
            : k === "xz"
              ? { position: [0, 0, 0], rotation: [0, 0, 0] }
              : { position: [0, 0, 0], rotation: [0, 0, Math.PI / 2] };
        },
        grid: (vx, vy, vz, col) => (window as any).__hekatanGenerarRejilla?.(vx, vy, vz, col),
        finish: () => { try { (window as any).__hekatanCadResetPending?.(); } catch {} },
        clear: () => {
          drawingPoints.val = []; drawingPolylines.val = []; drawingAreas.val = [];
          (window as any).__hekatanRebuild?.();
        },
      });
      // La barra de estado de abajo (SNAP · ORTO · POLAR · OSNAP, coordenadas,
      // plano y mensaje), como la de AutoCAD. Una sola vez.
      if (!document.getElementById("hk-statusbar")) addCadStatusBar();
    }
  }
  // ── BLOQUE INLINE LEGACY (será removido al confirmarse el move) ──
  if (false && currentExample) {
    const fCad = pane.addFolder({ title: "✏ Herramientas CAD", expanded: !!isModelerCtx });
    const proxyTool = { v: "node" };
    const toolBtns: Record<string, any> = {};
    // Instrucciones por tool — el usuario las ve en el status bar al activar
    const toolInstructions: Record<string, string> = {
      select:   "🖱 Seleccionar — click sobre un nodo/elemento para seleccionarlo",
      node:     "● Nodo — cada click crea un nodo en la posición del plano de trabajo",
      line:     "／ Línea — click 2 puntos para crear un frame. Continúa clickeando para extender la polilínea, right-click para terminar.",
      polyline: "⌒ Polilínea — click sucesivos crean segmentos conectados; right-click para terminar.",
      area:     "▭ Área — 4 clicks crean un Q4 shell (en orden CCW)",
      col:      "▌ Columna 3D — tipeá altura + Enter, después 1 click en la base. Default = 3m. Ideal para iso.",
      wall:     "▥ Pared Q4 3D — tipeá altura + Enter, después 2 clicks en las esquinas inferiores. Default = 3m. Crea shell Q4 vertical.",
      circle:   "○ Círculo — click 2 puntos: 1=centro, 2=radio. Se discretiza en N segmentos (slider 'Segmentos arc/circ').",
      arc:      "⌒ Arco (3 ptos) — click 3 puntos: 1=inicio, 2=medio, 3=fin. Se discretiza en N segmentos.",
      rect:     "▭ Rectángulo — click 2 esquinas opuestas. Genera 4 nodos + 4 frames cerrados.",
      aux:      "┊ Línea auxiliar — referencia visual (no genera FEM)",
      extend:   "↗ Prolongar — click una línea existente, click en la dirección a extender",
      chaflan:  "▱ Losa con chaflanes — click 2 esquinas opuestas. Radio del chaflán se ajusta en 'Chaflán r (m)'. Genera 4 lados rectos + 4 cuartos de círculo automáticamente.",
      "delete": "🗑 Borrar — pasá el mouse sobre una línea/área. Se resalta en rojo. Click para eliminarla. Los nodos huérfanos se limpian automáticamente.",
    };
    const setActiveTool = (tool: string) => {
      proxyTool.v = tool;
      try { (window as any).__hekatanCadState?.setTool?.(tool); } catch {}
      // Limpiar clicks pendientes del tool anterior (round-trip)
      try { (window as any).__hekatanCadResetPending?.(); } catch {}
      // Mostrar instrucción del tool nuevo
      const instr = toolInstructions[tool] ?? `Tool ${tool} activo`;
      const statusEl = document.getElementById("hk-cad-status");
      if (statusEl) {
        // Setear texto base; updateStatus interno va a aplicar el sufijo
        // de modos activos (ORTO, Cota Z, planos) — pero el setText directo
        // lo hace simple. Usamos refresh helper si está disponible para que
        // el sufijo se aplique automáticamente.
        statusEl.textContent = instr;
        (window as any).__hekatanCadStatusText = instr;
        (window as any).__hekatanRefreshStatus?.();
      }
      console.log(`[CAD] Tool activo: ${tool} — ${instr}`);
    };
    fCad.addButton({ title: "🖱 Seleccionar" }).on("click", () => setActiveTool("select"));
    fCad.addButton({ title: "● Nodo" }).on("click", () => setActiveTool("node"));
    fCad.addButton({ title: "／ Línea (frame)" }).on("click", () => setActiveTool("line"));
    fCad.addButton({ title: "▦ Área 4-clics (shell Q4)" }).on("click", () => setActiveTool("area"));
    fCad.addButton({ title: "▭ Área rectangular (2 clics)" }).on("click", () => setActiveTool("rectarea"));
    fCad.addButton({ title: "⬡ Área libre (polígono → malla)" }).on("click", () => setActiveTool("polyarea"));
    fCad.addButton({ title: "◣ Plano inclinado (3 puntos)" }).on("click", () => setActiveTool("plane3"));
    fCad.addButton({ title: "⬛ Plano XY (reset horizontal)" }).on("click", () => (window as any).__hekatanResetPlaneXY?.());
    // Tools 3D dedicados — para dibujar SOLO desde vista isométrica sin
    // tener que cambiar Cota Z entre clicks. Internamente:
    //   col  → 1 click + altura → frame vertical (columna)
    //   wall → 2 clicks base + altura → shell Q4 vertical (pared)
    fCad.addButton({ title: "▌ Columna 3D (1 click + altura)" }).on("click", () => setActiveTool("col"));
    fCad.addButton({ title: "▥ Pared Q4 3D (2 clicks + altura)" }).on("click", () => setActiveTool("wall"));
    // Tools CAD adicionales (estilo AutoCAD): polilínea, rectángulo, círculo,
    // arco, líneas auxiliares/de prolongación. Los elementos no lineales
    // (arco, círculo) se discretizan en N segmentos al exportarse al FEM.
    fCad.addButton({ title: "⌒ Polilínea" }).on("click", () => setActiveTool("polyline"));
    fCad.addButton({ title: "▭ Rectángulo" }).on("click", () => setActiveTool("rect"));
    fCad.addButton({ title: "○ Círculo" }).on("click", () => setActiveTool("circle"));
    fCad.addButton({ title: "⌒ Arco (3 ptos)" }).on("click", () => setActiveTool("arc"));
    fCad.addButton({ title: "┊ Línea auxiliar" }).on("click", () => setActiveTool("aux"));
    fCad.addButton({ title: "↗ Prolongar línea" }).on("click", () => setActiveTool("extend"));
    // ── Tools arquitectónicos (formas irregulares) ──
    fCad.addButton({ title: "▱ Losa con chaflanes (rect + arcos)" }).on("click", () => setActiveTool("chaflan"));
    // ── 🗑 Borrar — hover-highlight + click para eliminar líneas/áreas ──
    fCad.addButton({ title: "🗑 Borrar (hover + click)" }).on("click", () => setActiveTool("delete"));
    // Modos de drawing
    const fModes = fCad.addFolder({ title: "🎯 Modos de dibujo", expanded: true });
    const proxyModes = { ortho: false, polar: false, segs: 12 };
    fModes.addBinding(proxyModes, "ortho", { label: "ORTO (90°)" }).on("change", (ev: any) => {
      (window as any).__hekatanOrtho = ev.value;
      console.log(`[CAD] ORTO ${ev.value ? "ON" : "OFF"}`);
    });
    fModes.addBinding(proxyModes, "polar", { label: "POLAR (45°)" }).on("change", (ev: any) => {
      (window as any).__hekatanPolar = ev.value;
      console.log(`[CAD] POLAR ${ev.value ? "ON" : "OFF"}`);
    });
    fModes.addBinding(proxyModes, "segs", { min: 4, max: 64, step: 1, label: "Segmentos arc/círc" }).on("change", (ev: any) => {
      (window as any).__hekatanArcSegs = ev.value;
    });
    // Radio del chaflán para losas arquitectónicas
    const proxyChaflan = { r: 1.0 };
    fModes.addBinding(proxyChaflan, "r", { min: 0.1, max: 5, step: 0.1, label: "Chaflán r (m)" }).on("change", (ev: any) => {
      (window as any).__hekatanChaflanR = ev.value;
    });
    (window as any).__hekatanChaflanR = 1.0;  // default

    // ── 🎯 Object Snap (OSNAP) — estilo AutoCAD ──
    // Endpoint, Midpoint, Center, Node, Perpendicular, Nearest, Intersection.
    // Cada uno toggle independiente. Marcador con color por tipo aparece
    // cuando el cursor está cerca de un snap activo.
    const fOsnap = fCad.addFolder({ title: "🎯 Object Snap (OSNAP)", expanded: false });
    const osnapState = (window as any).__hekatanOsnap ?? {
      end: true, mid: true, node: true, cen: true,
      per: false, nea: false, int: false,
    };
    (window as any).__hekatanOsnap = osnapState;
    fOsnap.addBinding(osnapState, "end",  { label: "🔴 Endpoint" });
    fOsnap.addBinding(osnapState, "mid",  { label: "🟡 Midpoint" });
    fOsnap.addBinding(osnapState, "node", { label: "🔵 Node" });
    fOsnap.addBinding(osnapState, "cen",  { label: "🟢 Center" });
    fOsnap.addBinding(osnapState, "per",  { label: "🟣 Perpendicular" });
    fOsnap.addBinding(osnapState, "nea",  { label: "🌸 Nearest" });
    fOsnap.addBinding(osnapState, "int",  { label: "🟠 Intersection" });
    // Plano de trabajo — actualiza drawingGridTarget para que el raycaster
    // del Hekatan Drawing intersecte contra el plano correcto. Sin esto los
    // botones solo cambiaban una variable lógica sin efecto visual.
    const fPlane = fCad.addFolder({ title: "📐 Plano de trabajo", expanded: true });
    const proxyPlane = { workZ: 0 };
    const setPlane = (kind: "xy" | "xz" | "yz", z?: number, syncCam = true) => {
      const st = (window as any).__hekatanCadState?.get?.();
      if (st) st.workPlane = kind;
      // Rotación del plano según orientación:
      //   xy (planta)   → plano horizontal a Z = workZ → rotX=PI/2
      //   xz (elevación) → plano vertical X-Z          → rotX=0
      //   yz (lateral)   → plano vertical Y-Z          → rotZ=PI/2 (sobre Y)
      const wz = z ?? proxyPlane.workZ;
      // Grid centrado en el origen mundial (convención CAD).
      if (kind === "xy") {
        drawingGridTarget.val = { position: [0, 0, wz], rotation: [Math.PI/2, 0, 0] };
      } else if (kind === "xz") {
        drawingGridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] };
      } else {
        // YZ: rotZ(π/2) — ver setView elevY para detalle. rotY(π/2) NO sirve
        // porque deja el plano del raycaster horizontal en y=10 y el rayo
        // de la cámara nunca lo cruza.
        drawingGridTarget.val = { position: [0, 0, 0], rotation: [0, 0, Math.PI/2] };
      }
      console.log(`[CAD] Plano: ${kind.toUpperCase()} @ Z=${wz}m`);
      // Sincronizar cámara → vista ortográfica real para CAD-feel
      if (syncCam) {
        if (kind === "xy") setView("plan");
        else if (kind === "xz") setView("elevX");
        else if (kind === "yz") setView("elevY");
      }
    };
    fPlane.addButton({ title: "Plano XY (planta)" }).on("click", () => setPlane("xy"));
    fPlane.addButton({ title: "Plano XZ (elevación frontal)" }).on("click", () => setPlane("xz"));
    fPlane.addButton({ title: "Plano YZ (elevación lateral)" }).on("click", () => setPlane("yz"));
    // Vista 3D — útil para orientarse mientras se dibuja en planta/elevación.
    fPlane.addButton({ title: "🧊 Vista isométrica (3D)" }).on("click", () => {
      setView("iso");
      console.log("[CAD] Vista: ISOMÉTRICA");
    });
    // Vista doble: planta dibujable a la izquierda + iso preview a la derecha.
    // Toggle: 1er click activa, 2do click desactiva. El folder "🔀 Vista doble
    // (split)" en Vista expone configuración avanzada (otra cámara secundaria).
    fPlane.addButton({ title: "🔀 Vista doble (planta + iso)" }).on("click", () => {
      splitState.enabled = !splitState.enabled;
      if (splitState.enabled) {
        splitState.secondary = 0;  // 0 = iso a la derecha
        setPlane("xy");            // planta a la izquierda (vista activa, dibujable)
        console.log("[CAD] Vista doble ACTIVADA — planta (izq, dibujable) + iso (der, preview)");
      } else {
        console.log("[CAD] Vista doble DESACTIVADA");
      }
      refreshSplit();
    });
    // Planos de referencia visibles — guías horizontales a Z=0,3,6,9,12 m
    // (niveles típicos de pisos). Útil para orientarse en iso 3D.
    let refPlanesVisible = false;
    // Atenúa los bordes de los planos de referencia (creados con opacidad 0.55
    // por hekatan-ui) para que queden MÁS TRANSPARENTES que la grilla de
    // plataforma. Los identificamos por su opacidad inicial 0.55 (única en la
    // escena). Local a workspace3 — no toca hekatan-ui.
    const REF_PLANE_OPACITY = 0.14; // < grilla mayor (0.40) → más transparente
    const REF_LEVELS = [0, 3, 6, 9, 12];
    const REF_SIZE = 20;
    const dimRefPlanes = () => {
      const cx: any = (viewerElm as any).__ctx;
      if (!cx?.scene) return;
      cx.scene.traverse((o: any) => {
        if ((o.isLine || o.isLineSegments) && o.material &&
            Math.abs((o.material.opacity ?? 0) - 0.55) < 0.02) {
          o.material.opacity = REF_PLANE_OPACITY;
          o.material.needsUpdate = true;
        }
      });
      cx.render?.();
    };
    // Re-centra los planos de referencia con su CENTRO GEOMÉTRICO en (cx, cy).
    // Se llama al activar (centro = origen) y en cada CLICK de dibujo (centro =
    // punto clickeado) → los planos "siguen" donde dibujás.
    const recenterRefPlanes = (cx: number, cy: number) => {
      (window as any).__hekatanShowRefPlanes?.(REF_LEVELS, REF_SIZE, cx, cy);
      dimRefPlanes();
    };
    (window as any).__hekatanRecenterRefPlanes = recenterRefPlanes;
    fPlane.addButton({ title: "📐 Mostrar/ocultar planos de ref. (siguen tu click)" }).on("click", () => {
      refPlanesVisible = !refPlanesVisible;
      (window as any).__hekatanRefPlanesOn = refPlanesVisible;
      if (refPlanesVisible) {
        recenterRefPlanes(0, 0); // centro inicial en el origen
        console.log("[CAD] Planos de referencia VISIBLES (atenuados, siguen click)");
      } else {
        (window as any).__hekatanHideRefPlanes?.();
        console.log("[CAD] Planos de referencia OCULTOS");
      }
    });
    // Toggle de planos ORTOGONALES del último punto (XY/XZ/YZ que aparecen
    // durante el rubber band para guía visual + snap).
    //
    // Default OFF. Venían encendidos, y en un lienzo vacío aparecen dos planos
    // de color atravesando la pantalla sin que nadie los haya pedido: lo
    // primero que se ve al entrar es un adorno que no se sabe qué es ni cómo
    // se quita. Son una guía para afinar un punto, así que se encienden cuando
    // hagan falta, desde este mismo botón.
    (window as any).__hekatanShowOrthoPlanes = false;
    let orthoPlanesVisible = false;
    fPlane.addButton({ title: "▦ Planos ref. ortogonales (XY/XZ/YZ del último pto)" }).on("click", () => {
      orthoPlanesVisible = !orthoPlanesVisible;
      // Llamar al setter expuesto para que el cambio se aplique YA, sin
      // esperar a que el usuario mueva el mouse. Si no existe el setter
      // (versión vieja), fallback al flag pelado.
      const fn = (window as any).__hekatanSetOrthoPlanes;
      if (typeof fn === "function") fn(orthoPlanesVisible);
      else (window as any).__hekatanShowOrthoPlanes = orthoPlanesVisible;
      // Refrescar status (sufijo refleja los modos activos)
      (window as any).__hekatanRefreshStatus?.();
      console.log(`[CAD] Planos ortogonales ${orthoPlanesVisible ? "ACTIVADOS" : "DESACTIVADOS"}`);
    });
    // ── Sliders de dimensión visual ──
    // 1) Tamaño del área de los planos ortogonales (cuadrado XY/XZ/YZ).
    //    `ext` es el semi-lado, así que el cuadrado total es 2·ext × 2·ext.
    //    Default 8m → cuadrado 16×16. Range generoso (1m a 50m) cubre desde
    //    detalle (zapata) hasta edificio entero.
    // 2) Tamaño del grid mallado (la "plataforma" que se ve en el viewer).
    //    Tira de settings.gridSize del viewer interno (default 10).
    const proxySizes = { orthoExt: 3.2, gridSize: 30 };
    const orthoExtBinding = fPlane.addBinding(proxySizes, "orthoExt", {
      min: 1, max: 50, step: 0.5, label: "Tamaño área planos ref. (m)",
    }).on("change", (ev: any) => {
      const fn = (window as any).__hekatanSetOrthoExt;
      if (typeof fn === "function") fn(ev.value);
      else (window as any).__hekatanOrthoExt = ev.value;
    });
    fPlane.addBinding(proxySizes, "gridSize", {
      min: 1, max: 100, step: 1, label: "Tamaño grid (m)",
    }).on("change", (ev: any) => {
      const s = (viewerElm as any).__settings;
      if (s?.gridSize) s.gridSize.val = ev.value;
      // Mantener el plano de referencia del mismo tamaño que la grilla.
      proxySizes.orthoExt = ev.value / 2;
      try { orthoExtBinding.refresh(); } catch {}
      (window as any).__hekatanSetOrthoExt?.(ev.value / 2);
    });
    // ── Toggle global de grid snap ──
    // Cuando OFF, el cursor ignora el grid (Snap 2D / Snap 3D) y queda en
    // la coordenada raw del raycaster. OSnap (endpoint/midpoint/etc.) sigue
    // funcionando — esto solo controla el snap a la malla cuadriculada.
    // El toggle de grid snap + atajo F9 vive ahora en getCadPanel.ts (el panel
    // CAD real). Acá solo dejamos el binding legacy por compatibilidad.
    (window as any).__hekatanSnapEnabled = true;
    const proxySnapToggle = { snapEnabled: true };
    fCad.addBinding(proxySnapToggle, "snapEnabled", { label: "🧲 Grid snap (F9)" }).on("change", (ev: any) => {
      (window as any).__hekatanSnapEnabled = !!ev.value;
    });
    // ── Selector de paso de snap (cuánto salta el cursor) ──
    // Dropdown con valores discretos comunes en CAD: 0.01 / 0.05 / 0.1 / 0.2 /
    // 0.25 / 0.5 / 1 / 2 / 5 metros. Bindea a __hekatanSnap2D igual que el
    // slider continuo, pero más usable porque clava valores "limpios" sin
    // tener que arrastrar el slider con precisión.
    const proxySnapStep = { step: 0.5 };
    fCad.addBinding(proxySnapStep, "step", {
      label: "Paso snap (m)",
      options: {
        "0.01 m (mm)":  0.01,
        "0.05 m (5cm)": 0.05,
        "0.10 m":       0.1,
        "0.20 m":       0.2,
        "0.25 m":       0.25,
        "0.50 m":       0.5,
        "1.00 m":       1.0,
        "2.00 m":       2.0,
        "5.00 m":       5.0,
      },
    }).on("change", (ev: any) => {
      const v = Number(ev.value);
      (window as any).__hekatanSnap2D = v;
      const st = (window as any).__hekatanCadState?.get?.();
      if (st) st.snap = v;  // legacy
    });
    // Snap 2D y 3D separados (más flexibilidad para distintos workflows)
    const proxyCAD = { snap2D: 0.5, snap3D: 0.25, workZ: 0 };
    fCad.addBinding(proxyCAD, "snap2D", { min: 0, max: 5, step: 0.05, label: "Snap 2D fino (m)" }).on("change", (ev: any) => {
      const st = (window as any).__hekatanCadState?.get?.();
      if (st) st.snap = ev.value;  // legacy
      (window as any).__hekatanSnap2D = ev.value;
    });
    fCad.addBinding(proxyCAD, "snap3D", { min: 0, max: 5, step: 0.05, label: "Snap 3D (m)" }).on("change", (ev: any) => {
      (window as any).__hekatanSnap3D = ev.value;
    });
    fCad.addBinding(proxyPlane, "workZ", { min: -10, max: 50, step: 0.1, label: "Cota Z (m)" }).on("change", (ev: any) => {
      const st = (window as any).__hekatanCadState?.get?.();
      if (st) st.workZ = ev.value;
      // Re-posicionar el plano XY (si está activo) a esa Z
      const curPlane = ((window as any).__hekatanCadState?.get?.())?.workPlane ?? "xz";
      if (curPlane === "xy") setPlane("xy", ev.value, false); // no re-sync cámara en cada tick
      try { (window as any).__hekatanRebuild?.(); } catch {}
    });
    // Acciones
    const fAcc = fCad.addFolder({ title: "🛠 Acciones", expanded: true });
    // ⏹ Finalizar dibujo: termina la polilínea actual (próximo click = nuevo
    // trazo independiente), libera axis lock, oculta rubber band/polar lines.
    // Equivalente a Esc o click derecho.
    fAcc.addButton({ title: "⏹ Finalizar dibujo (Esc)" }).on("click", () => {
      (window as any).__hekatanFinalizeDraw?.();
      (window as any).__hekatanCadMouse?.cancel?.();
    });
    fAcc.addButton({ title: "🗑 Limpiar todo" }).on("click", () => {
      (window as any).__hekatanCadState?.reset?.();
      // También limpiar el Drawing nativo (puntos + polylines + áreas + aux)
      drawingPoints.val = [];
      drawingPolylines.val = [[]];
      drawingAreas.val = [];
      drawingAuxLines.val = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
    });
    // Botones para cambiar la cota Z del plano de trabajo (planta de cada piso)
    const fFloors = fCad.addFolder({ title: "🏢 Plantas de pisos", expanded: false });
    [0, 3, 6, 9, 12].forEach(z => {
      fFloors.addButton({ title: `Piso a Z=${z}m` }).on("click", () => {
        drawingGridTarget.val = {
          position: [0, 0, z],
          rotation: [Math.PI/2, 0, 0],
        };
        const cs = (window as any).__hekatanCadState?.get?.();
        if (cs) cs.workZ = z;
        console.log(`[CAD] Plano XY @ Z=${z}m`);
      });
    });
    fAcc.addButton({ title: "📋 Copiar comandos a CLI" }).on("click", () => {
      const script = (window as any).__hekatanCliScript ?? "";
      console.log("[CAD] Comandos generados:\n" + script);
      navigator.clipboard?.writeText(script);
      alert("Comandos copiados al portapapeles. Pega en cli-modeler para editar/correr el FEM.");
    });
  }

  // ── 💻 CLI Modeler (siempre disponible — folder colapsado por default
  //     en ejemplos que no son cli-modeler para no estorbar) ──
  if (currentExample) {
    const fCli = pane.addFolder({ title: "💻 CLI Comandos", expanded: !!isModelerCtx });
    // Crear textarea para escribir comandos
    const taContainer = document.createElement("div");
    taContainer.style.cssText = "padding:4px;pointer-events:auto;user-select:text;";
    const ta = document.createElement("textarea");
    ta.style.cssText = [
      "width:100%",
      "min-height:240px",
      "font-family:Consolas,monospace",
      "font-size:11px",
      "background:#0f172a",
      "color:#22d3ee",
      "border:1px solid #334155",
      "border-radius:4px",
      "padding:6px",
      "resize:vertical",
      // CRITICAL: dejar que la textarea reciba foco/eventos sin que Tweakpane los intercepte
      "pointer-events:auto",
      "user-select:text",
      "-webkit-user-select:text",
      "outline:none",
      "white-space:pre",
      "overflow:auto",
    ].join(";") + ";";
    ta.spellcheck = false;
    ta.autocomplete = "off";
    ta.setAttribute("autocorrect", "off");
    ta.setAttribute("autocapitalize", "off");
    ta.placeholder = "node 1 0 0 0\nnode 2 5 0 0\nsupport 1 fixed\nframe 1 1 2 25e6 0.04 0.001\nload 2 0 0 -100\nsolve";
    ta.value = (window as any).__hekatanCliScript ?? "";
    // Tweakpane intercepta pointer/keyboard events sobre sus folders → la textarea
    // queda "muerta" (no se puede editar/seleccionar/copiar). Solución: cortar la
    // propagación de TODOS los eventos relevantes a nivel de la textarea.
    const swallow = (e: Event) => e.stopPropagation();
    [
      "pointerdown", "pointerup", "pointermove",
      "mousedown", "mouseup", "mousemove", "click", "dblclick",
      "keydown", "keyup", "keypress", "input", "change",
      "focus", "blur", "select", "selectstart",
      "copy", "cut", "paste", "contextmenu", "wheel",
    ].forEach(ev => ta.addEventListener(ev, swallow));
    taContainer.appendChild(ta);
    fCli.element.appendChild(taContainer);

    // Status line debajo de la textarea — feedback inmediato (nodos/frames/errs)
    const statusLine = document.createElement("div");
    statusLine.style.cssText = "padding:2px 6px;font-family:Consolas,monospace;font-size:10px;color:#94a3b8;min-height:14px;";
    statusLine.textContent = "Listo. El modelo se actualiza al escribir.";
    taContainer.appendChild(statusLine);

    /**
     * Aplica el script CLI: lo escribe en window y dispara rebuild.
     * Si el ejemplo actual NO es cli-modeler, cambia a cli-modeler para
     * que el script tome efecto (sino el rebuild reconstruye el ejemplo
     * activo y descarta el script).
     */
    const applyCliScript = () => {
      (window as any).__hekatanCliScript = ta.value;
      const cli = examplesRegistry.find((x) => x.id === "cli-modeler");
      if (cli && currentExample?.id !== "cli-modeler") {
        // Cambiar a cli-modeler para que el script se interprete
        loadExample(cli);
      } else {
        try { (window as any).__hekatanRebuild?.(); } catch (e) { console.error(e); }
      }
      // Actualizar status line con stats del parser
      const stats = (window as any).__hekatanCliStats;
      const errs = (window as any).__hekatanCliErrors as string[] | undefined;
      if (stats) {
        statusLine.textContent =
          `${stats.nodes} nodos · ${stats.frames} frames · ${stats.shells} shells · ` +
          `${stats.solved ? "solve OK" : "(sin solve)"}` +
          // El resultado a la vista: si ΣRz no da la carga aplicada, o la
          // flecha sale en metros, el modelo está mal apoyado o suelto.
          (stats.solved && stats.maxUzMm !== undefined
            ? ` · Uz max ${stats.maxUzMm} mm · ΣRz ${stats.sumRz} kN` : "") +
          (errs?.length ? ` · ⚠ ${errs.length} err` : "");
        statusLine.style.color = errs?.length ? "#f87171" : "#94a3b8";
      }
    };

    // ── Live update con debounce ──
    // Cada cambio en la textarea se aplica tras 250ms de inactividad para
    // no recalcular el FEM en cada tecla. Si el usuario quiere forzar
    // actualizacion inmediata puede usar el boton ▶ o Ctrl+Enter.
    let liveTimer: any = null;
    const liveApply = () => {
      if (liveTimer) clearTimeout(liveTimer);
      liveTimer = setTimeout(() => { applyCliScript(); }, 250);
    };
    ta.addEventListener("input", liveApply);
    // Ctrl+Enter ejecuta inmediatamente (sin esperar debounce)
    ta.addEventListener("keydown", (ev) => {
      if (ev.ctrlKey && ev.key === "Enter") {
        ev.preventDefault();
        if (liveTimer) clearTimeout(liveTimer);
        applyCliScript();
      }
    });

    fCli.addButton({ title: "▶ Ejecutar ahora (Ctrl+Enter)" }).on("click", () => {
      if (liveTimer) clearTimeout(liveTimer);
      applyCliScript();
      const errs = (window as any).__hekatanCliErrors as string[] | undefined;
      if (errs?.length) alert("⚠ Errores:\n" + errs.slice(0, 5).join("\n"));
    });
    // ── Con quien se compara: SAP2000 o ETABS (regla de Jorge, 4-sep-2026: primero SAP2000,
    //    que solo conecta lo que se malla; luego ETABS anadiendo SU semantica con nombre).
    //    ETABS = `deck etabs` (panos membrana cosidos a todo nudo de borde y su peso a las
    //    vigas por area tributaria) + `etabsjoint 1` (union viga-muro) + `meshcross 1` (las
    //    barras que se cruzan se parten). SAP2000 = nada de eso.
    const DIRECTIVAS = /^(deck|deckmode|etabsjoint|etabswalljoint|meshcross|meshatintersections)\b/i;
    const semObj = { modo: /^\s*deck\s+etabs/m.test(ta.value) ? 1 : 0 };
    fCli.addBinding(semObj, "modo", {
      label: "Comparar con",
      options: { "SAP2000 (sin directivas)": 0, "ETABS (deck etabs · etabsjoint · meshcross)": 1 },
    }).on("change", (ev) => {
      const cuerpo = ta.value.split("\n").filter((l) => !DIRECTIVAS.test(l.trim()));
      const cab = ev.value === 1 ? ["deck etabs", "etabsjoint 1", "meshcross 1"] : ["etabsjoint 0", "meshcross 0"];
      ta.value = [...cab, ...cuerpo].join("\n");
      if (liveTimer) clearTimeout(liveTimer);
      applyCliScript();
    });
    fCli.addButton({ title: "🗑 Limpiar comandos" }).on("click", () => {
      ta.value = "";
      (window as any).__hekatanCliScript = "";
      applyCliScript();
    });
    // ── Formato nativo de texto .heks (Hekatan Struct): abrir / guardar ──
    const heksInput = document.createElement("input");
    heksInput.type = "file";
    heksInput.accept = ".heks,.txt";
    heksInput.style.display = "none";
    heksInput.addEventListener("change", () => {
      const file = heksInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { ta.value = String(reader.result ?? ""); applyCliScript(); };
      reader.readAsText(file);
      heksInput.value = "";
    });
    taContainer.appendChild(heksInput);
    fCli.addButton({ title: "📂 Abrir .heks" }).on("click", () => heksInput.click());

    // ── ?heks=<url> — abrir un modelo por ENLACE ──
    // El botón de arriba abre un diálogo del sistema: sirve para trabajar, pero
    // no para mandarle a alguien "mirá este modelo", ni para las pruebas
    // headless (ahí no hay diálogo que pulsar). Con el parámetro, el workspace
    // se trae el .heks y lo aplica solo.
    const urlHeks = URL_HEKS;
    if (urlHeks) {
      fetch(urlHeks)
        .then((r) => {
          if (!r.ok) throw new Error(r.status + " " + r.statusText);
          return r.text();
        })
        .then((txt) => {
          // Se aplica CUANTO ANTES. El retraso de 1500 ms era para que el
          // ejemplo por defecto no pisara el modelo; ya no hace falta porque
          // `new-blank` no dibuja nada cuando el modelo viene por enlace. Con
          // el retraso se veian primero los planos de trabajo del CAD y el
          // modelo aparecia despues, como si cargara dos veces.
          ta.value = txt;
          setTimeout(() => {
            applyCliScript();
            // recien ahora se destapa: hasta aca solo se veian las ayudas de
            // dibujo del CAD (planos de trabajo, triada de ejes, rejilla) y
            // parecia que la pagina cargaba algo antes del modelo.
            quitarVelo();
          }, 0);
          // y se apagan los planos de trabajo del CAD, que son ayuda para
          // dibujar y aqui solo estorban al mirar un modelo ya hecho
          try {
            const st = (window as any).__hekatanCadState?.get?.();
            if (st) { st.showPlanes = false; }
            const sv = (viewerElm as any).__settings;
            if (sv && "custom3D" in sv) sv.custom3D = true;
          } catch { /* no-op */ }
        })
        .catch((e) => {
          quitarVelo();
          alert("No se pudo abrir «" + urlHeks + "»: " + e.message);
        });
    }
    fCli.addButton({ title: "💾 Guardar .heks" }).on("click", () => {
      const blob = new Blob([ta.value], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "modelo.heks";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    // ── OpenSees Tcl: importar / exportar ──
    const tclInput = document.createElement("input");
    tclInput.type = "file";
    tclInput.accept = ".tcl,.txt";
    tclInput.style.display = "none";
    tclInput.addEventListener("change", () => {
      const file = tclInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try { ta.value = importTclToCli(String(reader.result ?? "")); applyCliScript(); }
        catch (e: any) { alert("Error importando .tcl: " + e?.message); }
      };
      reader.readAsText(file);
      tclInput.value = "";
    });
    taContainer.appendChild(tclInput);
    fCli.addButton({ title: "📂 Importar .tcl (OpenSees)" }).on("click", () => tclInput.click());
    fCli.addButton({ title: "💾 Exportar .tcl (OpenSees)" }).on("click", () => {
      try {
        const blob = new Blob([exportTclFromCli(ta.value)], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "modelo.tcl";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      } catch (e: any) { alert("Error exportando .tcl: " + e?.message); }
    });
    // Ejemplos: el usuario elige inline o bloque.
    // - Inline = una linea por entidad ("node 1 0 0 0"). Comodo para
    //   modelos pequeños o cuando se mezclan tipos.
    // - Bloque = encabezado una sola vez ("nodes" / "elements" / ...) y
    //   despues solo coordenadas/indices. Preferible cuando hay muchas
    //   lineas seguidas de la misma llamada.
    fCli.addButton({ title: "📋 Pórtico 2D (inline)" }).on("click", () => {
      ta.value = `# Portico 2D — sintaxis inline (cada linea con su comando)
node 1 0 0 0
node 2 0 0 3
node 3 5 0 3
node 4 5 0 0

support 1 fixed
support 4 fixed

# frame ID nI nJ E A I  (col 0.40x0.40)
frame 1 1 2 25e6 0.16 0.0021
frame 2 2 3 25e6 0.15 0.0028
frame 3 3 4 25e6 0.16 0.0021

load 2 10 0 -50 0 0 0
load 3 10 0 -50 0 0 0

solve`;
      applyCliScript();
    });
    fCli.addButton({ title: "📋 Cantilever (inline)" }).on("click", () => {
      ta.value = `# Cantilever 5m con carga en extremo — sintaxis inline
node 1 0 0 0
node 2 5 0 0
support 1 fixed
frame 1 1 2 25e6 0.04 0.001
load 2 0 0 -100
solve`;
      applyCliScript();
    });
    fCli.addButton({ title: "📋 Pórtico 2D (bloques)" }).on("click", () => {
      // Sintaxis compacta tipo awatif: encabezado una vez y luego solo numeros.
      //
      // IMPORTANTE — convención de IDs en bloques:
      //   • `nodes` block — auto-ID 1,2,3,4 (1-based, parseador hace ++ ANTES de set)
      //   • `elements` block — los pares `0 1`, `1 2`, ... son 0-based en la
      //     LECTURA pero el parser los convierte a 1-based (nI = nums[0]+1)
      //     antes de almacenar — así son consistentes con los IDs 1-based de nodes.
      //   • `supports` y `loads` — usan IDs 1-based directamente (igual que inline).
      ta.value = `# Portico 2D — sintaxis bloque (estilo awatif)
nodes
0 0 0      # se almacena como nodo ID=1
0 0 3      # nodo ID=2
5 0 3      # nodo ID=3
5 0 0      # nodo ID=4

elements    # pares 0-based → parser convierte a 1-based
0 1         # frame ID=1: nodos 1→2 (columna izq)
1 2         # frame ID=2: nodos 2→3 (viga sup)
2 3         # frame ID=3: nodos 3→4 (columna der)

supports    # IDs 1-based
1 fixed
4 fixed

loads       # IDs 1-based
2 10 0 -50 0 0 0
3 10 0 -50 0 0 0

solve`;
      applyCliScript();
    });
  }

  // ── 📥 Importar CSI (solo para el ejemplo csi-importer) ──
  if (currentExample && currentExample.id === "csi-importer") {
    const fImp = pane.addFolder({ title: "📥 Importar archivo", expanded: true });
    // Helper: forzar rebuild + autoFitCamera tras setear los datos.
    // El bug previo era que scheduleRebuild() debounce 120ms a veces
    // perdía el set, o el viewer no reencuadraba al cargar geometría
    // de un modelo recién importado. Forzamos rebuild síncrono +
    // autoFitCamera explícito.
    const forceRebuildAndFit = () => {
      try { rebuild(); } catch (e) { console.error("[CSI Importer] rebuild error:", e); }
      try { autoFitCamera(); } catch {}
    };
    const triggerImport = (kind: "f2k" | "e2k" | "s2k") => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = `.${kind},.txt`;
      input.onchange = async (ev: any) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          if (kind === "f2k") {
            const { parseEdificioCimentacionF2k } = await import("../shared/f2kCimentacionImporter");
            const data = parseEdificioCimentacionF2k(text);
            (window as any).__hekatanImportedCim = data;
            console.log("[CSI Importer] F2K parseado:", data);
            const wMsg = data._warnings && data._warnings.length
              ? `\n\n⚠ Warnings:\n${data._warnings.map((w: string) => "• " + w).join("\n")}`
              : "";
            alert(`✅ F2K cargado:\n• ${data.zapatas.length} zapatas\n• ${data.vigasAmarre?.length ?? 0} vigas\n• ks = ${Math.round(data.ks_kNm3)} kN/m³${wMsg}`);
            forceRebuildAndFit();
          } else {
            alert(`Importador ${kind.toUpperCase()} aún no implementado. Por ahora solo F2K (SAFE).`);
          }
        } catch (e: any) {
          alert(`❌ Error al importar ${kind.toUpperCase()}: ${e.message}`);
          console.error(e);
        }
      };
      input.click();
    };
    fImp.addButton({ title: "📥 F2K (SAFE) — Cimentación" }).on("click", () => triggerImport("f2k"));
    fImp.addButton({ title: "📥 E2K (ETABS) — Edificio (próximo)" }).on("click", () => triggerImport("e2k"));
    fImp.addButton({ title: "📥 S2K (SAP2000) — Modelo (próximo)" }).on("click", () => triggerImport("s2k"));
    fImp.addButton({ title: "🗑 Limpiar y vaciar escena" }).on("click", () => {
      delete (window as any).__hekatanImportedCim;
      forceRebuildAndFit();
    });
  }

  // ── SAFE F2K Export/Import (solo para ejemplos de cimentación pura) ──
  // Permite roundtrip Hekatan ↔ SAFE para validación cruzada.
  // Cubre zapata-aislada, zapata-viga-amarre, Guerra Ej.1-8 y safe-bench-*.
  if (isFoundation) {
    const fF2K = pane.addFolder({ title: "SAFE", expanded: false });
    fF2K.addButton({ title: "📤 Exportar F2K" }).on("click", () => {
      try {
        const p = currentParams;
        // 1) Si el ejemplo provee su propio exportador (zapata + viga de amarre,
        //    losa de cimentación, zapata combinada, etc.), lo invocamos.
        if (typeof currentExample?.exportF2k === "function") {
          currentExample.exportF2k(p);
          console.log(`✅ F2K exportado vía exportF2k custom del ejemplo`);
          return;
        }
        // 2) El ejemplo dejo sus muelles en nodeInputs.springs (Guerra ej1-8, safe-bench-*,
        //    viga-cim-*): se exporta el MODELO (nudos, cascaras, barras, muelles, cargas del
        //    solver) con el mismo exportador que usa `heks_a_csi.mjs`. Hasta el 6-sep-2026
        //    caian en el fallback de abajo, que lee `Lz`/`P_simple` (nombres de zapata-aislada),
        //    y salian como zapata 1.5x1.5x0.30 SIN carga (medido en el deploy con puppeteer).
        const niAny = states.nodeInputs.val as any;
        if (currentExample?.id !== "zapata-aislada" && Array.isArray(niAny?.springs) && niAny.springs.length) {
          const text = exportF2kModelo({
            nodes: states.nodes.val, elements: states.elements.val,
            nodeInputs: states.nodeInputs.val, elementInputs: states.elementInputs.val,
            title: currentExample!.id,
          });
          const fname = `${currentExample!.id}_${Date.now()}.f2k`;
          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = fname;
          document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
          const nMuelles = new Set(niAny.springs.map((sp: any) => sp.node)).size;
          const cargas: Map<number, number[]> = niAny.loadsSolver ?? states.nodeInputs.val.loads ?? new Map();
          const nCargas = [...cargas.values()].filter((f) => f.some((v) => Math.abs(v) > 1e-12)).length;
          console.log(`✅ F2K exportado desde el modelo: ${states.nodes.val.length} nudos, ${states.elements.val.length} elementos, ${nMuelles} nudos con muelle, ${nCargas} nudos cargados → ${fname}`);
          alert(`F2K descargado (modelo completo).

${states.nodes.val.length} nudos · ${states.elements.val.length} elementos
${nMuelles} nudos con muelle Winkler · ${nCargas} nudos cargados

Impórtalo en SAFE 20.x: File → Import → SAFE .f2k Text File`);
          return;
        }
        // 3) Fallback: zapata simple (zapata-aislada, params Lz/Bz/tz/bc, useSimple/P_simple).
        // Calcular ks en kN/m³ desde params actuales
        const ks_factor = p.ks_factor ?? 10.5;
        const q_adm_tonf = p.q_adm ?? 20;
        const ks_kNm3 = ks_factor * q_adm_tonf * 9.80665;  // tonf/m² × 9.80665 = kN/m²
        // Cargas: usar Carga Simple si está activa, sino patrón D
        const useSimple = (p.useSimple ?? 1) >= 0.5;
        const P_dead_kN = useSimple ? (p.P_simple ?? 0) * 9.80665 : (p.P_D ?? 10) * 9.80665;
        const P_live_kN = useSimple ? 0 : (p.P_L ?? 5) * 9.80665;
        const Mx_dead = useSimple ? (p.Mx_simple ?? 0) * 9.80665 : (p.Mx_D ?? 0) * 9.80665;
        const My_dead = useSimple ? (p.My_simple ?? 0) * 9.80665 : (p.My_D ?? 0) * 9.80665;
        const bytes = downloadZapataF2k({
          Lz: p.Lz ?? 1.5,
          Bz: p.Bz ?? 1.5,
          tz: p.tz ?? 0.30,
          bc: p.bc ?? 0.4,
          ks_kNm3,
          P_dead_kN, P_live_kN,
          Mx_dead_kNm: Mx_dead, My_dead_kNm: My_dead,
        }, `Zapata_Hekatan_${Date.now()}.f2k`);
        console.log(`✅ F2K exportado: ${bytes} bytes con ks=${ks_kNm3.toFixed(0)} kN/m³, P_D=${P_dead_kN.toFixed(1)} kN`);
        alert(`F2K descargado correctamente.\n\nks=${ks_kNm3.toFixed(0)} kN/m³\nP_dead=${P_dead_kN.toFixed(1)} kN\n\nAbrilo en SAFE 20.x: File → Import → SAFE Text File (.f2k)`);
      } catch (e: any) {
        alert(`Error exportando F2K: ${e?.message ?? e}`);
        console.error(e);
      }
    });
    fF2K.addButton({ title: "📥 Importar F2K…" }).on("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".f2k,.txt";
      input.onchange = async (ev: any) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const params = parseZapataF2k(text);
          // Aplicar al modelo actual
          if (params.Lz != null) currentParams.Lz = params.Lz;
          if (params.Bz != null) currentParams.Bz = params.Bz;
          if (params.tz != null) currentParams.tz = params.tz;
          if (params.bc != null) currentParams.bc = params.bc;
          if (params.q_adm != null) currentParams.q_adm = params.q_adm;
          if (params.ks_factor != null) currentParams.ks_factor = params.ks_factor;
          // CRÍTICO: ks (kN/m³) es el valor que usa el solver. Sin escribirlo aquí
          // el slider queda en default (2059 kN/m³) aunque el F2K traía
          // 19,999 kN/m³ (= 2,039 tonf/m³ que SAFE muestra como Subgrade Modulus).
          if (params.ks_kNm3 != null) currentParams.ks = params.ks_kNm3;
          if (params.P_dead_tonf != null) {
            currentParams.useSimple = 1;
            currentParams.P_simple = params.P_dead_tonf;
            // Si hay carga simple, desactivar patrones D/L/S para evitar superposición
            currentParams.useD = 0;
            currentParams.useL = 0;
            currentParams.useS = 0;
          }
          if (params.Mx_dead_tonfm != null) currentParams.Mx_simple = params.Mx_dead_tonfm;
          if (params.My_dead_tonfm != null) currentParams.My_simple = params.My_dead_tonfm;
          // Si Custom soil type es necesario para reflejar ks importado
          if (params.q_adm != null && params.ks_factor != null) {
            // Forzar Custom (índice 0 en SOIL_TYPES) para que los valores no se sobreescriban
            currentParams.soilType = 0;
          }
          // Reconstruir TODO el pane (lee los nuevos values en buildParamsPane).
          buildParamsPane();
          // Disparar re-cálculo del modelo con los nuevos params.
          rebuild();
          alert(`F2K importado: ${file.name}\nLz=${params.Lz}, Bz=${params.Bz}, tz=${params.tz}\nks=${params.ks_kNm3?.toFixed(0)} kN/m³\nP_dead=${params.P_dead_tonf?.toFixed(2)} tonf\n\nLos sliders del Tweakpane se actualizaron a estos valores.`);
        } catch (e: any) {
          alert(`Error importando F2K: ${e?.message ?? e}`);
          console.error(e);
        }
      };
      input.click();
    });
  }

  // ── Navegación cruzada Edificio ↔ Cimentación ──
  // Si el ejemplo activo es un edificio: botón "→ Diseñar zapata" que toma
  // la reacción máxima de base y la pasa via URL al ejemplo zapata-aislada-validacion.
  // Si es zapata y URL trae ?from=...: botón "← Volver" que regresa.
  if (currentExample) {
    const isBuilding = !isFoundation;
    const isFooting  = isFoundation;
    const urlFrom    = new URLSearchParams(window.location.search).get("from");

    if (isBuilding) {
      // ── BOTÓN VISIBLE: toggle FEM cimentación in-place ──
      // En edificios con varias columnas, este botón muestra TODAS las
      // zapatas FEM (Q4 shellthick + Winkler) con sus respectivas P, Mx,
      // My en la misma página. Es un toggle entre:
      //   🏢 Edificio completo (con superestructura)
      //   🪨 Solo cimentación (sin superestructura, P,Mx,My de reacciones
      //                         aplicados a los pedestales de cada zapata)
      try {
        // Detectar si el ejemplo soporta el toggle: presence de la opción
        // modoCimentacion en su definición de params (si tiene PE
        // "modoCimentacion", el dropdown estará en el DOM tras buildPane).
        const exParams = (currentExample as any)?.params;
        const hasModoCim = exParams && exParams.modoCimentacion !== undefined;
        if (hasModoCim) {
          const fCim = pane.addFolder({ title: "🪨 Cimentación FEM (toggle)", expanded: true });
          const cimBtn = fCim.addButton({ title: "🪨 Ver TODAS las zapatas FEM" });
          cimBtn.on("click", () => {
            const selects = Array.from(document.querySelectorAll('select')) as HTMLSelectElement[];
            const target = selects.find(s => {
              const lbl = s.closest('.tp-lblv')?.querySelector('.tp-lblv_l')?.textContent ?? '';
              return lbl.includes('Vista (toggle)');
            });
            if (!target) {
              alert("No se encontró el dropdown 'Vista (toggle)'.");
              return;
            }
            const isInCim = target.value.includes('Solo cimentación');
            const opts = Array.from(target.options);
            const newVal = isInCim
              ? opts.find(o => o.value.includes('Edificio'))?.value
              : opts.find(o => o.value.includes('Solo cimentación'))?.value;
            if (!newVal) return;
            target.value = newVal;
            target.dispatchEvent(new Event('change', { bubbles: true }));
            // Actualizar título del botón
            (cimBtn as any).title = isInCim
              ? "🪨 Ver TODAS las zapatas FEM"
              : "🏢 Volver al edificio completo";
            try { pane.refresh(); } catch {}
            console.log(`[FEM Cim] cambiado a: ${newVal}`);
          });

        }
        // Folder "📤 SAFE F2K (cimentación)" — disponible para CUALQUIER
        // edificio/galpón/pórtico (no solo edificio-aporticado). Diseña
        // zapatas automáticamente desde las reacciones de base y exporta
        // el F2K. Si el ejemplo NO tiene params específicos de cimentación
        // (q_adm_zapata, ks_zapata, etc.), se usan defaults sensatos.
        {
          const fCim = pane.addFolder({ title: "🪨 Cimentación (diseño + SAFE F2K)", expanded: false });

          // ── Cardinal Point del insertion point (convención SAFE/ETABS) ──
          // Determina dónde queda la sección de la columna respecto al
          // insertion point (z.x, z.y) reportado por el FEM.
          //   1=BotL  2=BotC  3=BotR
          //   4=MidL  5=MidC  6=MidR
          //   7=TopL  8=TopC  9=TopR
          //  10=Centroid (default, simétrico = MidC para sección cuadrada)
          //  11=Shear Center (= Centroid para sección simétrica)
          const cimUiState: any = (window as any).__hekatanCimUI ?? { cardinal: 10 };
          (window as any).__hekatanCimUI = cimUiState;
          const cardBinding = fCim.addBinding(cimUiState, "cardinal", {
            label: "Cardinal Point col.",
            options: {
              "1 — Bottom Left":   1, "2 — Bottom Center": 2, "3 — Bottom Right": 3,
              "4 — Middle Left":   4, "5 — Middle Center": 5, "6 — Middle Right": 6,
              "7 — Top Left":      7, "8 — Top Center":    8, "9 — Top Right":    9,
              "10 — Centroid":    10, "11 — Shear Center":11,
            },
          });
          // Live reactive: cuando cambia el cardinal, re-renderiza la
          // cimentación visual (silenciosamente, sin alert).
          cardBinding.on("change", () => {
            const btn = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent?.includes('Calcular y ver cimentación'));
            if (btn && (window as any).__hekatanCimentacionDesigned) {
              (window as any).__cimSilent = true;
              btn.click();
            }
          });
          // ── Auto-fire REMOVIDO ──
          // Antes había un van.derive que auto-disparaba "Calcular y ver
          // cimentación" cuando aparecían reacciones — eso hacía que las
          // zapatas Q4 + pedestales + vigas de amarre aparecieran SIN que
          // el usuario las pidiera. La cimentación es opcional; solo se
          // muestra cuando el user hace click explícitamente en el botón.

          // ── Botón: Calcular y mostrar cimentación en pantalla ──
          // Diseña las zapatas desde las reacciones de base y las dibuja como
          // bloques 3D semi-transparentes sobre los apoyos. Esto da feedback
          // VISUAL antes de exportar a SAFE — el usuario ve qué se está
          // dimensionando.
          fCim.addButton({ title: "👁 Calcular y ver cimentación" }).on("click", async () => {
            // Modo silencioso (auto-fire reactivo): suprimir alert
            const silent = (window as any).__cimSilent === true;
            delete (window as any).__cimSilent;
            const reactions = (deformOutputs.rawVal as any)?.reactions as
              Map<number, [number, number, number, number, number, number]> | undefined;
            const ns = nodes.rawVal as number[][];
            if (!reactions || !ns?.length) {
              if (!silent) alert("Sin reacciones aún — corre primero el análisis del edificio.");
              return;
            }
            const p = currentParams as any;
            const q_adm = (p.q_adm_zapata as number) ?? 10;
            const ks = (p.ks_zapata as number) ?? 1030;
            const tz = (p.t_zapata as number) ?? 0.30;
            const colSize = p.colSize ?? 0.40;
            const Hf = (p.Hf_pedestal as number) ?? 0.5;
            const baseRows: Array<{idx:number;x:number;y:number;P_kN:number;Mx_kN:number;My_kN:number}> = [];
            let xMax = 0, yMax = 0;
            reactions.forEach((r, idx) => {
              const n = ns[idx];
              if (!n || Math.abs(n[2]) > 1e-6) return;
              baseRows.push({ idx, x: n[0], y: n[1], P_kN: Math.abs(r[2]), Mx_kN: r[3], My_kN: r[4] });
              if (n[0] > xMax) xMax = n[0];
              if (n[1] > yMax) yMax = n[1];
            });
            if (!baseRows.length) { alert("No hay apoyos en z=0."); return; }
            const { designAllFootings } = await import("../shared/footingDesign");
            const zapatasD = designAllFootings(baseRows, xMax, yMax, q_adm, ks);
            for (const z of zapatasD) z.t = tz;

            // Dibujar zapatas como placa Q4 ShellThick — plano translúcido top
            // y bottom + grilla de subdivisiones + edges (mismo estilo que
            // edificio-aporticado modo Shellthick).
            const THREE = await import("three");
            const nSubZ = Math.max(2, Math.round((p.nSubZapata as number) ?? 4));
            const matPlane = new THREE.MeshStandardMaterial({
              color: 0x4488cc, transparent: true, opacity: 0.45,
              roughness: 0.6, side: THREE.DoubleSide,
            });
            const matGrid = new THREE.LineBasicMaterial({ color: 0x1f3a5f, transparent: true, opacity: 0.85 });
            const matEdge = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
            const matPed = new THREE.MeshStandardMaterial({
              color: 0x808080, transparent: true, opacity: 0.5,
              roughness: 0.6, side: THREE.DoubleSide,
            });
            const meshes: any[] = [];
            for (const z of zapatasD as any[]) {
              const Lz = z.Lz, Bz = z.Bz, t = z.t;
              // Offset columna ↔ centro zapata (esquinera/lindero/central).
              // Convención CSI/ETABS: en lindero/esquinera la CARA de la
              // columna queda FLUSH con el borde de la zapata. El insertion
              // point (centro de columna) está a colSize/2 del borde.
              let offX = 0, offY = 0;
              const halfCol = colSize / 2;
              // Cardinal Point: offset del CENTROIDE de la sección respecto
              // al insertion point.
              //   K=1,4,7 (Left)   → centroide a la derecha de insertion: +halfCol
              //   K=3,6,9 (Right)  → centroide a la izquierda: -halfCol
              //   K=1,2,3 (Bottom) → centroide arriba: +halfCol
              //   K=7,8,9 (Top)    → centroide abajo: -halfCol
              //   K=5,10,11        → centroide en insertion (no offset)
              const K = (cimUiState.cardinal as number) ?? 10;
              let cdx = 0, cdy = 0;
              if (K === 1 || K === 4 || K === 7) cdx = +halfCol;
              else if (K === 3 || K === 6 || K === 9) cdx = -halfCol;
              if (K === 1 || K === 2 || K === 3) cdy = +halfCol;
              else if (K === 7 || K === 8 || K === 9) cdy = -halfCol;
              // Cara IZQUIERDA y DERECHA del col en X relativo a insertion:
              //   leftFace = z.x + cdx - halfCol; rightFace = z.x + cdx + halfCol
              if (z.tipo === "esquinera") {
                // En esquinera: la cara CONSTRAINED de cada lado coincide con
                // borde de zapata. Para el lado izquierdo (z.x < xMax/2),
                // queremos rightFace = z.x + cdx - halfCol al borde, NO —
                // queremos LEFT face del col al borde IZQUIERDO de la zapata.
                if (z.x < xMax/2) offX = -(Lz/2 + (cdx - halfCol));   // leftFace al borde izq
                else              offX =  (Lz/2 - (cdx + halfCol));   // rightFace al borde der
                if (z.y < yMax/2) offY = -(Bz/2 + (cdy - halfCol));
                else              offY =  (Bz/2 - (cdy + halfCol));
              } else if (z.tipo === "lindero") {
                if (Math.abs(z.x) < 1e-3 || Math.abs(z.x - xMax) < 1e-3) {
                  if (z.x < xMax/2) offX = -(Lz/2 + (cdx - halfCol));
                  else              offX =  (Lz/2 - (cdx + halfCol));
                } else if (Math.abs(z.y) < 1e-3 || Math.abs(z.y - yMax) < 1e-3) {
                  if (z.y < yMax/2) offY = -(Bz/2 + (cdy - halfCol));
                  else              offY =  (Bz/2 - (cdy + halfCol));
                }
              }
              const xCz = z.x - offX, yCz = z.y - offY;
              // Centro real del eje de la columna (puede no ser z.x,z.y)
              const xColAxis = z.x + cdx, yColAxis = z.y + cdy;
              // ShellThick = superficie 2D en el TOP de la zapata (convención
              // FEM, igual que edificio-aporticado). El espesor t es propiedad
              // del elemento, no afecta posición de la superficie.
              const zMid = -Hf;
              // UN plano translúcido en el plano del shell
              const planeMid = new THREE.Mesh(new THREE.PlaneGeometry(Lz, Bz), matPlane.clone());
              planeMid.position.set(xCz, yCz, zMid);
              meshes.push(planeMid);
              // Grilla Q4 (nSubZ × nSubZ subdivisiones) en el plano medio
              const dx = Lz / nSubZ, dy = Bz / nSubZ;
              const gridPts: any[] = [];
              for (let i = 0; i <= nSubZ; i++) {
                const xi = -Lz/2 + i * dx;
                gridPts.push(
                  new THREE.Vector3(xCz + xi, yCz - Bz/2, zMid),
                  new THREE.Vector3(xCz + xi, yCz + Bz/2, zMid),
                );
              }
              for (let j = 0; j <= nSubZ; j++) {
                const yj = -Bz/2 + j * dy;
                gridPts.push(
                  new THREE.Vector3(xCz - Lz/2, yCz + yj, zMid),
                  new THREE.Vector3(xCz + Lz/2, yCz + yj, zMid),
                );
              }
              meshes.push(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), matGrid));
              // Edges del perímetro (rectángulo único)
              const corners = [[-Lz/2, -Bz/2], [Lz/2, -Bz/2], [Lz/2, Bz/2], [-Lz/2, Bz/2]];
              const edgePts: any[] = [];
              for (let k = 0; k < 4; k++) {
                const [ax, ay] = corners[k]; const [bx, by] = corners[(k + 1) % 4];
                edgePts.push(
                  new THREE.Vector3(xCz + ax, yCz + ay, zMid),
                  new THREE.Vector3(xCz + bx, yCz + by, zMid),
                );
              }
              meshes.push(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(edgePts), matEdge));
              // Columna EXTRUIDA centrada en el centroide del col (xColAxis,
              // yColAxis) — NO necesariamente en (z.x, z.y) que es el insertion.
              // Box de tamaño colSize×colSize×Hf. Esto muestra correctamente
              // como el insertion point puede estar en cualquier cardinal de
              // la sección (1=BotL, ..., 10=Centroid).
              const pedGeo = new THREE.BoxGeometry(colSize, colSize, Hf);
              const pedMesh = new THREE.Mesh(pedGeo, matPed.clone());
              pedMesh.position.set(xColAxis, yColAxis, -Hf / 2);
              meshes.push(pedMesh);
              // Edges de la columna para resaltar su outline
              const pedEdges = new THREE.LineSegments(new THREE.EdgesGeometry(pedGeo), matEdge.clone());
              pedEdges.position.copy(pedMesh.position);
              meshes.push(pedEdges);
              // ── LÍNEA DEL PEDESTAL — eje vertical del insertion point ──
              // Línea gruesa amarilla que va desde z=0 (base de columna de la
              // superestructura) hasta z=-Hf (top de la zapata Q4 ShellThick).
              // Esta es la LÍNEA DE EJE del pedestal: visualmente clara,
              // independiente de la BoxGeometry del pedestal extruido.
              // Termina exactamente en el insertion point (z.x, z.y, -Hf)
              // donde se conecta la cadena/viga de amarre.
              const axisPts = [
                new THREE.Vector3(z.x, z.y, 0),
                new THREE.Vector3(z.x, z.y, -Hf),
              ];
              const axisGeo = new THREE.BufferGeometry().setFromPoints(axisPts);
              const axisMat = new THREE.LineBasicMaterial({ color: 0xffcc00, linewidth: 3 });
              const axisLine = new THREE.Line(axisGeo, axisMat);
              meshes.push(axisLine);
              // Marker pequeño verde en el INSERTION POINT (z.x, z.y, -Hf)
              // para que el usuario vea claramente DÓNDE conecta la viga.
              const insMarkerGeo = new THREE.SphereGeometry(0.05, 8, 8);
              const insMarkerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
              const insMarker = new THREE.Mesh(insMarkerGeo, insMarkerMat);
              insMarker.position.set(z.x, z.y, -Hf);
              meshes.push(insMarker);
              // Marker amarillo en el TOP del pedestal (z.x, z.y, 0) — base
              // de la columna de la superestructura.
              const topMarkerGeo = new THREE.SphereGeometry(0.04, 8, 8);
              const topMarkerMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
              const topMarker = new THREE.Mesh(topMarkerGeo, topMarkerMat);
              topMarker.position.set(z.x, z.y, 0);
              meshes.push(topMarker);
            }

            // ── Vigas de amarre (sistema=1) — entre zapatas adyacentes ──
            const sistemaCim = Math.round((p.sistemaCimentacion as number) ?? 0);
            if (sistemaCim === 1) {
              const va_h = (p.vigaAmarre_h as number) ?? 0.40;
              const va_b = (p.vigaAmarre_b as number) ?? 0.25;
              const va_pos = Math.round((p.vigaAmarre_pos as number) ?? 0);
              const zVA = va_pos === 0 ? -Hf : -Hf / 2;
              const matViga = new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.65 });
              const byY = new Map<string, typeof baseRows>();
              const byX = new Map<string, typeof baseRows>();
              for (const b of baseRows) {
                const ky = b.y.toFixed(4), kx = b.x.toFixed(4);
                if (!byY.has(ky)) byY.set(ky, []);
                if (!byX.has(kx)) byX.set(kx, []);
                byY.get(ky)!.push(b); byX.get(kx)!.push(b);
              }
              const drawViga = (a: any, b: any) => {
                const dx = b.x - a.x, dy = b.y - a.y;
                const len = Math.hypot(dx, dy); if (len < 1e-6) return;
                const geo = new THREE.BoxGeometry(va_b, len, va_h);
                const m = new THREE.Mesh(geo, matViga.clone());
                m.position.set((a.x + b.x) / 2, (a.y + b.y) / 2, zVA);
                m.rotateZ(Math.atan2(dy, dx) - Math.PI / 2);
                meshes.push(m);
              };
              for (const row of byY.values()) { row.sort((a,b)=>a.x-b.x); for (let i=0;i<row.length-1;i++) drawViga(row[i], row[i+1]); }
              for (const col of byX.values()) { col.sort((a,b)=>a.y-b.y); for (let i=0;i<col.length-1;i++) drawViga(col[i], col[i+1]); }
            }

            // ── Losa raft (sistema=2,3,4) — UN único plano Q4 cubriendo
            // toda la huella del edificio ──
            if (sistemaCim >= 2) {
              const margen = (p.voladoExtra as number) ?? 0.30;
              const xMin = 0 - margen, xMx = xMax + margen;
              const yMin = 0 - margen, yMx = yMax + margen;
              const Lx = xMx - xMin, Ly = yMx - yMin;
              const xC = (xMin + xMx) / 2, yC = (yMin + yMx) / 2;
              const t_raft = (p.t_zapata as number) ?? 0.30;
              const zMidR = -Hf - t_raft / 2;  // plano medio del shell raft
              const matRaft = new THREE.MeshStandardMaterial({ color: 0xea580c, transparent: true, opacity: 0.40, roughness: 0.6, side: THREE.DoubleSide });
              const matRaftGrid = new THREE.LineBasicMaterial({ color: 0x9a3412 });
              // UN solo plano shell raft en el plano medio
              const planeR = new THREE.Mesh(new THREE.PlaneGeometry(Lx, Ly), matRaft.clone());
              planeR.position.set(xC, yC, zMidR); meshes.push(planeR);
              // Grilla densa: subdiv automática según tamaño (~1m por celda)
              const nx = Math.max(2, Math.round(Lx)), ny = Math.max(2, Math.round(Ly));
              const dxR = Lx / nx, dyR = Ly / ny;
              const ptsR: any[] = [];
              for (let i = 0; i <= nx; i++) {
                const xi = xMin + i * dxR;
                ptsR.push(new THREE.Vector3(xi, yMin, zMidR), new THREE.Vector3(xi, yMx, zMidR));
              }
              for (let j = 0; j <= ny; j++) {
                const yj = yMin + j * dyR;
                ptsR.push(new THREE.Vector3(xMin, yj, zMidR), new THREE.Vector3(xMx, yj, zMidR));
              }
              meshes.push(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ptsR), matRaftGrid));
              // Edges raft (perímetro único en plano medio)
              const c4 = [[xMin,yMin],[xMx,yMin],[xMx,yMx],[xMin,yMx]];
              const eR: any[] = [];
              for (let k = 0; k < 4; k++) {
                const [ax, ay] = c4[k]; const [bx, by] = c4[(k+1)%4];
                eR.push(new THREE.Vector3(ax, ay, zMidR), new THREE.Vector3(bx, by, zMidR));
              }
              meshes.push(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(eR), matEdge.clone()));
            }
            states.objects3D.val = [...(states.objects3D.val ?? []), ...meshes];
            // ── ISOLAR vista: ocultar superestructura para mostrar SOLO la
            // cimentación (zapatas + cadenas + pedestales). El usuario pidió
            // explícitamente que al calcular cimentación no se vea todo el
            // edificio mezclado — sólo la parte de cimentación.
            // Guardamos el estado anterior de cada toggle para poder restaurarlo.
            // NOTA: NO tocamos shellResults / frameResults / nodeResults aquí
            // porque las meshes visuales de cimentación viven en objects3D
            // (no son shells FEM con campos analíticos). El botón "🧮 Análisis
            // FEM solo cimentación" sí setea shellResults = pressure.
            const sCim = (viewerElm as any).__settings;
            if (sCim) {
              const saved = (window as any).__hekatanSavedSettings = (window as any).__hekatanSavedSettings ?? {};
              const offKeys = ["elements", "nodes", "elemColumns", "elemBeams",
                               "supports", "loads", "deformedShape",
                               "orientations", "nodesIndexes", "elementsIndexes",
                               "sections", "secColumns", "secBeams", "secFloor",
                               "solids"];
              for (const k of offKeys) {
                if (sCim[k] && typeof sCim[k] === "object" && "val" in sCim[k]) {
                  if (saved[k] === undefined) saved[k] = sCim[k].val;
                  sCim[k].val = false;
                }
              }
              // custom3D ON para que se vean las meshes de cimentación en objects3D
              if (sCim.custom3D && typeof sCim.custom3D === "object" && "val" in sCim.custom3D) {
                if (saved.custom3D === undefined) saved.custom3D = sCim.custom3D.val;
                sCim.custom3D.val = true;
              }
              (window as any).__hekatanCimViewIsolated = true;
            }
            // Guardar diseño para uso del exportador
            (window as any).__hekatanCimentacionDesigned = { zapatasD, baseRows, xMax, yMax, q_adm, ks, tz, colSize, Hf };
            const totalZ = zapatasD.length;
            const tipos = zapatasD.reduce((acc: any, z: any) => { acc[z.tipo] = (acc[z.tipo] ?? 0) + 1; return acc; }, {});
            const tiposStr = Object.entries(tipos).map(([k, v]) => `${v} ${k}`).join(", ");
            const sysName = sistemaCim === 1 ? "Zapatas + vigas de amarre" :
                            sistemaCim === 2 ? "Losa raft" :
                            sistemaCim === 3 ? "Vigas + zapata corrida" :
                            sistemaCim === 4 ? "Losa raft" :
                            "Zapatas aisladas";
            if (!silent) {
              alert(`✅ Cimentación calculada (sistema = ${sysName}):\n• ${totalZ} zapatas Q4 ShellThick (${tiposStr})\n• Cada zapata: 1 placa shell en plano medio + grilla ${nSubZ}×${nSubZ}\n• ks = ${ks} kN/m³, q_adm = ${q_adm} tonf/m²\n• Espesor (propiedad del shell) = ${tz} m\n• Pedestal Hf = ${Hf} m\n\nVista AISLADA: superestructura oculta, solo cimentación.\nUsá el botón "🏢 Volver a vista superestructura" para restaurar.`);
            }
            console.log(`[Cimentación] sistema=${sysName}, ${totalZ} zapatas (${tiposStr}) — vista isolada`);
          });

          // ── Botón: Volver a vista superestructura ──
          // Restaura los toggles que "Calcular y ver cimentación" apagó para
          // aislar la cimentación. El usuario vuelve a ver el edificio completo
          // con sus elementos/nodos/cargas/apoyos/deformada.
          fCim.addButton({ title: "🏢 Volver a vista superestructura" }).on("click", () => {
            const sR = (viewerElm as any).__settings;
            const saved = (window as any).__hekatanSavedSettings;
            if (!sR || !saved) {
              alert("No hay vista isolada activa.");
              return;
            }
            for (const k of Object.keys(saved)) {
              if (sR[k] && typeof sR[k] === "object" && "val" in sR[k]) {
                sR[k].val = saved[k];
              }
            }
            // Limpiar meshes de cimentación de objects3D (mantener resortes y
            // otros custom3D del ejemplo activo). Los meshes de cimentación se
            // re-generan al pulsar de nuevo "Calcular y ver cimentación".
            // Conservamos lo que había ANTES (referencia guardada antes de
            // pushearlas — si no se guardó, simplemente vaciamos foundation).
            // Heurística: re-correr el build del ejemplo activo restablece
            // objects3D del ejemplo (resortes Winkler de zapata-aislada, etc.)
            (window as any).__hekatanCimViewIsolated = false;
            delete (window as any).__hekatanSavedSettings;
            alert("✅ Vista superestructura restaurada.");
            console.log("[Cimentación] vista superestructura restaurada");
          });

          // ── Botón: Análisis FEM solo cimentación ──
          // Reemplaza el modelo actual con la cimentación FEM (zapatas Q4
          // ShellThick + Winkler springs + cargas P,Mx,My de las reacciones).
          // Corre deform+analyze. Permite ver Deformed shape + Shell results
          // (pressure, displacementZ, bending) sobre la cimentación.
          fCim.addButton({ title: "🧮 Análisis FEM solo cimentación" }).on("click", async () => {
            const reactions = (deformOutputs.rawVal as any)?.reactions as
              Map<number, [number, number, number, number, number, number]> | undefined;
            const ns = nodes.rawVal as number[][];
            if (!reactions || !ns?.length) {
              alert("Sin reacciones aún — corre primero el análisis del edificio.");
              return;
            }
            const p = currentParams as any;
            const q_adm = (p.q_adm_zapata as number) ?? 10;
            const ks = (p.ks_zapata as number) ?? 1030;
            const tz = (p.t_zapata as number) ?? 0.30;
            const Hf = (p.Hf_pedestal as number) ?? 0.5;
            const volExt = (p.voladoExtra as number) ?? 0.30;
            const colSize = (p.colSize as number) ?? 0.40;
            const nSubZ = Math.max(2, Math.round((p.nSubZapata as number) ?? 4));
            const Ec = 25e6, nu_c = 0.20, Gc = Ec / (2 * (1 + nu_c)), rho_c = 24;
            const baseRows: Array<{idx:number;x:number;y:number;P_kN:number;Mx_kN:number;My_kN:number}> = [];
            let xMaxC = 0, yMaxC = 0;
            reactions.forEach((r, idx) => {
              const n = ns[idx];
              if (!n || Math.abs(n[2]) > 1e-6) return;
              baseRows.push({ idx, x: n[0], y: n[1], P_kN: Math.abs(r[2]), Mx_kN: r[3], My_kN: r[4] });
              if (n[0] > xMaxC) xMaxC = n[0];
              if (n[1] > yMaxC) yMaxC = n[1];
            });
            if (!baseRows.length) { alert("No hay apoyos en z=0."); return; }
            const { designAllFootings } = await import("../shared/footingDesign");
            const zapatasD = designAllFootings(baseRows, xMaxC, yMaxC, q_adm, ks);
            for (const z of zapatasD) z.t = tz;

            // Construir FEM model — solo zapatas
            const N2: Node[] = [];
            const E2: Element[] = [];
            const elasticities2 = new Map<number, number>();
            const shearModuli2 = new Map<number, number>();
            const areas2 = new Map<number, number>();
            const Iz2 = new Map<number, number>();
            const Iy2 = new Map<number, number>();
            const J2 = new Map<number, number>();
            const densities2 = new Map<number, number>();
            const poissons2 = new Map<number, number>();
            const thicknesses2 = new Map<number, number>();
            const supports2 = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
            const loads2 = new Map<number, [number,number,number,number,number,number]>();
            const springsList2: Array<{ node: number; dof: number; k: number }> = [];

            const nodeIdx = new Map<string, number>();
            const addNode = (x: number, y: number, z: number): number => {
              const key = `${Math.round(x*10000)},${Math.round(y*10000)},${Math.round(z*10000)}`;
              const found = nodeIdx.get(key); if (found !== undefined) return found;
              const i = N2.length; N2.push([x, y, z]); nodeIdx.set(key, i); return i;
            };

            for (const z of zapatasD as any[]) {
              const Lz = z.Lz, Bz = z.Bz, t = z.t;
              // Insertion point CSI/ETABS: la cara de la columna FLUSH con el
              // borde de la zapata en lados constrained (lindero/esquinera).
              // El insertion point (centro columna) está a colSize/2 del borde.
              let offX = 0, offY = 0;
              const halfColC = colSize / 2;
              if (z.tipo === "esquinera") {
                offX = (z.x < xMaxC/2) ? -(Lz/2 - halfColC) : (Lz/2 - halfColC);
                offY = (z.y < yMaxC/2) ? -(Bz/2 - halfColC) : (Bz/2 - halfColC);
              } else if (z.tipo === "lindero") {
                if (Math.abs(z.x) < 1e-3 || Math.abs(z.x - xMaxC) < 1e-3) offX = (z.x < xMaxC/2) ? -(Lz/2 - halfColC) : (Lz/2 - halfColC);
                else if (Math.abs(z.y) < 1e-3 || Math.abs(z.y - yMaxC) < 1e-3) offY = (z.y < yMaxC/2) ? -(Bz/2 - halfColC) : (Bz/2 - halfColC);
              }
              const xCz = z.x - offX, yCz = z.y - offY;
              // Convención (igual que edificio-aporticado): shell sits at TOP
              // de la zapata. Espesor t es propiedad del elemento, no se duplica.
              const zMid = -Hf;
              const dx = Lz / nSubZ, dy = Bz / nSubZ;
              const grid: number[][] = [];
              for (let jr = 0; jr <= nSubZ; jr++) {
                const row: number[] = [];
                for (let jc = 0; jc <= nSubZ; jc++) {
                  row.push(addNode(xCz - Lz/2 + jc * dx, yCz - Bz/2 + jr * dy, zMid));
                }
                grid.push(row);
              }
              for (let jr = 0; jr < nSubZ; jr++) {
                for (let jc = 0; jc < nSubZ; jc++) {
                  const eIdx = E2.length;
                  E2.push([grid[jr][jc], grid[jr][jc+1], grid[jr+1][jc+1], grid[jr+1][jc]] as Element);
                  thicknesses2.set(eIdx, t);
                  elasticities2.set(eIdx, Ec);
                  poissons2.set(eIdx, nu_c);
                  shearModuli2.set(eIdx, Gc);
                  densities2.set(eIdx, rho_c);
                }
              }
              // Winkler springs en cada nodo del grid
              for (let jr = 0; jr <= nSubZ; jr++) {
                for (let jc = 0; jc <= nSubZ; jc++) {
                  const A_trib = dx * dy *
                    ((jc === 0 || jc === nSubZ) ? 0.5 : 1) *
                    ((jr === 0 || jr === nSubZ) ? 0.5 : 1);
                  const kvz = ks * A_trib;
                  const khxy = kvz * 0.5;
                  const ni = grid[jr][jc];
                  springsList2.push({ node: ni, dof: 0, k: khxy });
                  springsList2.push({ node: ni, dof: 1, k: khxy });
                  springsList2.push({ node: ni, dof: 2, k: kvz });
                  springsList2.push({ node: ni, dof: 5, k: kvz * 0.1 });
                }
              }
              // Anclaje rotacional en una esquina (evita modos rígidos)
              supports2.set(grid[0][0], [false, false, false, true, true, true]);
              // Aplicar carga en el nodo más cercano a la columna
              let bI = 0, bJ = 0, bD = Infinity;
              for (let jr = 0; jr <= nSubZ; jr++) {
                for (let jc = 0; jc <= nSubZ; jc++) {
                  const ni = grid[jr][jc];
                  const d = Math.hypot(N2[ni][0] - z.x, N2[ni][1] - z.y);
                  if (d < bD) { bD = d; bI = jr; bJ = jc; }
                }
              }
              const baseR = baseRows.find(b => b.idx === z.idx)!;
              loads2.set(grid[bI][bJ], [0, 0, -baseR.P_kN, baseR.Mx_kN, baseR.My_kN, 0]);
              // Guardar el nodo central de cada zapata para conectar vigas
              (z as any)._nFootCol = grid[bI][bJ];
              (z as any)._zMid = zMid;
            }

            // ── Cadenas / vigas de amarre (sistema=1) — frames entre zapatas
            // adyacentes. Se conectan al nodo central FEM de cada zapata
            // (mismo nodo donde se aplicó la carga), al nivel del plano medio
            // del shell. Son frames concreto rectangulares b×h.
            const sistemaCimFem = Math.round((p.sistemaCimentacion as number) ?? 0);
            if (sistemaCimFem === 1) {
              const va_h = (p.vigaAmarre_h as number) ?? 0.40;
              const va_b = (p.vigaAmarre_b as number) ?? 0.25;
              const va_A = va_b * va_h;
              const va_Iy = (va_b * va_h ** 3) / 12;
              const va_Iz = (va_h * va_b ** 3) / 12;
              const va_J = 0.21 * Math.pow(Math.min(va_b, va_h), 3) * Math.max(va_b, va_h);

              const byY = new Map<string, any[]>();
              const byX = new Map<string, any[]>();
              for (const z of zapatasD as any[]) {
                const ky = z.y.toFixed(4), kx = z.x.toFixed(4);
                if (!byY.has(ky)) byY.set(ky, []);
                if (!byX.has(kx)) byX.set(kx, []);
                byY.get(ky)!.push(z); byX.get(kx)!.push(z);
              }
              const addViga = (a: any, b: any) => {
                if (a._nFootCol === undefined || b._nFootCol === undefined) return;
                if (a._nFootCol === b._nFootCol) return;  // frame degenerado
                const eIdx = E2.length;
                E2.push([a._nFootCol, b._nFootCol] as Element);
                elasticities2.set(eIdx, Ec);
                shearModuli2.set(eIdx, Gc);
                poissons2.set(eIdx, nu_c);
                densities2.set(eIdx, rho_c);
                areas2.set(eIdx, va_A);
                Iy2.set(eIdx, va_Iy);
                Iz2.set(eIdx, va_Iz);
                J2.set(eIdx, va_J);
              };
              for (const row of byY.values()) {
                row.sort((a: any, b: any) => a.x - b.x);
                for (let i = 0; i < row.length - 1; i++) addViga(row[i], row[i+1]);
              }
              for (const col of byX.values()) {
                col.sort((a: any, b: any) => a.y - b.y);
                for (let i = 0; i < col.length - 1; i++) addViga(col[i], col[i+1]);
              }
            }

            // ── Visualización: pedestal como LÍNEA (no caja extruida) ──
            // El usuario pidió no mostrar la extrusión sólida oscura sobre
            // fondo negro. Reemplazado por línea cyan tipo frame (igual que
            // las columnas en el resto del modelo).
            const THREE = await import("three");
            const matPedLine = new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 4 });
            const colObjs: any[] = [];
            for (const z of zapatasD as any[]) {
              const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(z.x, z.y, 0),
                new THREE.Vector3(z.x, z.y, -Hf),
              ]);
              colObjs.push(new THREE.Line(lineGeo, matPedLine));
            }
            // ── Vigas de amarre VISUALIZACIÓN — líneas cyan entre zapatas
            // adyacentes en X y en Y. Solo si sistemaCimentacion=1 (default
            // del usuario en este flujo). Renderiza al nivel de plano medio
            // del shell, conectando los nodos donde se aplican las cargas. ──
            if (sistemaCimFem === 1) {
              const vaMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 3 });
              const vaPts: any[] = [];
              const byYv = new Map<string, any[]>();
              const byXv = new Map<string, any[]>();
              for (const z of zapatasD as any[]) {
                const ky = z.y.toFixed(4), kx = z.x.toFixed(4);
                if (!byYv.has(ky)) byYv.set(ky, []);
                if (!byXv.has(kx)) byXv.set(kx, []);
                byYv.get(ky)!.push(z); byXv.get(kx)!.push(z);
              }
              const zMidLevel = -Hf;
              for (const row of byYv.values()) {
                row.sort((a: any, b: any) => a.x - b.x);
                for (let i = 0; i < row.length - 1; i++) {
                  vaPts.push(new THREE.Vector3(row[i].x, row[i].y, zMidLevel));
                  vaPts.push(new THREE.Vector3(row[i+1].x, row[i+1].y, zMidLevel));
                }
              }
              for (const col of byXv.values()) {
                col.sort((a: any, b: any) => a.y - b.y);
                for (let i = 0; i < col.length - 1; i++) {
                  vaPts.push(new THREE.Vector3(col[i].x, col[i].y, zMidLevel));
                  vaPts.push(new THREE.Vector3(col[i+1].x, col[i+1].y, zMidLevel));
                }
              }
              if (vaPts.length > 0) {
                colObjs.push(new THREE.LineSegments(
                  new THREE.BufferGeometry().setFromPoints(vaPts),
                  vaMat,
                ));
              }
            }

            // Reemplazar states + correr análisis
            states.nodes.val = N2;
            states.elements.val = E2;
            states.nodeInputs.val = { supports: supports2, loads: loads2 };
            states.elementInputs.val = {
              elasticities: elasticities2, shearModuli: shearModuli2,
              poissonsRatios: poissons2, densities: densities2,
              areas: areas2, momentsOfInertiaZ: Iy2, momentsOfInertiaY: Iz2,
              torsionalConstants: J2, thicknesses: thicknesses2,
            };
            states.objects3D.val = colObjs;
            try {
              const dout = deform(N2, E2, states.nodeInputs.val, states.elementInputs.val, springsList2);
              states.deformOutputs.val = dout;
              const aout = analyze(N2, E2, states.elementInputs.val, dout);
              // Override colormap range para pressure (hasta -q_adm)
              const q_adm_kPa = q_adm * 9.80665;  // tonf/m² → kN/m² ≈ kPa
              if (aout.colorMapRanges == null) aout.colorMapRanges = {};
              aout.colorMapRanges.pressure = [-q_adm_kPa, 0];  // máx compresión = magenta (como SAFE)
              states.analyzeOutputs.val = aout;
              // ── Activar visualización: shell results = pressure + deformed
              // shape + elementos visibles. CRÍTICO: settings son van states,
              // hay que mutar `.val` (no overwrite la propiedad como string).
              const sFEM = (viewerElm as any).__settings;
              if (sFEM) {
                // Re-encender elementos/nodos (los apagó el botón visual)
                if (sFEM.elements?.val !== undefined) sFEM.elements.val = true;
                if (sFEM.nodes?.val !== undefined) sFEM.nodes.val = true;
                // Apagar columnas/vigas de superestructura (no aplica al FEM cim)
                if (sFEM.elemColumns?.val !== undefined) sFEM.elemColumns.val = false;
                if (sFEM.elemBeams?.val !== undefined) sFEM.elemBeams.val = false;
                if (sFEM.sections?.val !== undefined) sFEM.sections.val = false;
                if (sFEM.secColumns?.val !== undefined) sFEM.secColumns.val = false;
                if (sFEM.secBeams?.val !== undefined) sFEM.secBeams.val = false;
                if (sFEM.secFloor?.val !== undefined) sFEM.secFloor.val = false;
                // Encender supports/loads para ver Winkler + cargas P,Mx,My
                if (sFEM.supports?.val !== undefined) sFEM.supports.val = true;
                if (sFEM.loads?.val !== undefined) sFEM.loads.val = true;
                // Shell results = pressure (con override colorMapRanges)
                if (sFEM.shellResults?.val !== undefined) sFEM.shellResults.val = "pressure";
                if (sFEM.deformedShape?.val !== undefined) sFEM.deformedShape.val = true;
                if (sFEM.custom3D?.val !== undefined) sFEM.custom3D.val = true;
              } else {
                console.warn("[FEM Cim] viewerElm.__settings no disponible — shell results no auto-activado");
              }
              // ── Desfiltrar el dropdown shell results: el ejemplo activo
              // (edificio-muros, edificio-hormigón, etc.) puede excluir
              // "pressure" via availableShellResults. Re-aplicar el filtro
              // INCLUYENDO los campos relevantes para FEM cimentación.
              const cimAllowed = ["pressure", "displacementZ", "displacementX", "displacementY",
                                  "bendingXX", "bendingYY", "bendingXY", "vonMises",
                                  "shearX", "shearY"];
              try { filterShellResultOptions(cimAllowed); } catch (e) { console.warn(e); }
              // Auto-escalar deformada para que sea visible
              try { autoScaleDeformedShape(); } catch {}
              alert(`✅ Análisis FEM cimentación completo:\n• ${zapatasD.length} zapatas Q4 ShellThick\n• ${E2.length} elementos shell, ${N2.length} nodos\n• Winkler ks=${ks} kN/m³ + anclaje rot esquina\n• Cargas P,Mx,My aplicadas\n\nViewer: shell results = pressure (rango 0 a -${q_adm_kPa.toFixed(0)} kPa)\nActivá Deformed shape para ver la deformación.`);
              console.log(`[FEM Cim] ${zapatasD.length} zapatas, ${E2.length} Q4, ${N2.length} nodos, ${springsList2.length} springs`);
            } catch (e: any) {
              alert(`❌ Error en análisis FEM: ${e.message}`);
              console.error(e);
            }
          });

          // ── Botón: Exportar F2K cimentación COMPLETA ──
          // Genera UN solo .f2k con TODAS las zapatas + vigas de amarre del
          // edificio en un mismo modelo SAFE. Cada zapata mantiene su P, Mx,
          // My propios (de la reacción del apoyo correspondiente).
          fCim.addButton({ title: "📤 Exportar F2K cimentación COMPLETA" }).on("click", async () => {
            const reactions = (deformOutputs.rawVal as any)?.reactions as
              Map<number, [number, number, number, number, number, number]> | undefined;
            const ns = nodes.rawVal as number[][];
            if (!reactions || !ns?.length) {
              alert("Sin reacciones aún — corre primero el análisis del edificio (modo 'Edificio completo').");
              return;
            }
            const p = currentParams as any;
            const q_adm = (p.q_adm_zapata as number) ?? 10;
            const ks = (p.ks_zapata as number) ?? 1030;
            const tz = (p.t_zapata as number) ?? 0.30;
            const colSize = p.colSize ?? 0.40;
            const Hf = (p.Hf_pedestal as number) ?? 0.5;
            const volExt = (p.voladoExtra as number) ?? 0.30;
            const sistema = Math.round((p.sistemaCimentacion as number) ?? 0);
            const va_pos = Math.round((p.vigaAmarre_pos as number) ?? 0);
            const va_h = (p.vigaAmarre_h as number) ?? 0.40;
            const va_b = (p.vigaAmarre_b as number) ?? 0.25;
            const baseRows: Array<{idx:number;x:number;y:number;P_kN:number;Mx_kN:number;My_kN:number}> = [];
            let xMax = 0, yMax = 0;
            reactions.forEach((r, idx) => {
              const n = ns[idx];
              if (!n || Math.abs(n[2]) > 1e-6) return;
              baseRows.push({
                idx, x: n[0], y: n[1],
                P_kN: Math.abs(r[2]), Mx_kN: r[3], My_kN: r[4],
              });
              if (n[0] > xMax) xMax = n[0];
              if (n[1] > yMax) yMax = n[1];
            });
            if (!baseRows.length) { alert("No hay apoyos en z=0."); return; }
            const { designAllFootings } = await import("../shared/footingDesign");
            const { downloadEdificioCimentacionF2k } = await import("../shared/f2kCimentacionCompleta");
            const zapatasD = designAllFootings(baseRows, xMax, yMax, q_adm, ks);
            for (const z of zapatasD) z.t = tz;
            // Construir items con offsets correctos para esquinera/lindero.
            // Insertion point CSI/ETABS: cara de columna FLUSH con borde
            // de zapata en lados constrained (col.face = zapata.edge).
            const halfColE = colSize / 2;
            const zapatas = zapatasD.map(z => {
              let offX = 0, offY = 0;
              if (z.tipo === "esquinera") {
                offX = (z.x < xMax/2) ? -(z.Lz/2 - halfColE) : (z.Lz/2 - halfColE);
                offY = (z.y < yMax/2) ? -(z.Bz/2 - halfColE) : (z.Bz/2 - halfColE);
              } else if (z.tipo === "lindero") {
                if (Math.abs(z.x) < 1e-3 || Math.abs(z.x - xMax) < 1e-3) {
                  offX = (z.x < xMax/2) ? -(z.Lz/2 - halfColE) : (z.Lz/2 - halfColE);
                } else if (Math.abs(z.y) < 1e-3 || Math.abs(z.y - yMax) < 1e-3) {
                  offY = (z.y < yMax/2) ? -(z.Bz/2 - halfColE) : (z.Bz/2 - halfColE);
                }
              }
              const baseR = baseRows.find(b => b.idx === z.idx)!;
              return {
                xC: z.x - offX, yC: z.y - offY,
                xCol: z.x, yCol: z.y,
                Lz: z.Lz, Bz: z.Bz, tz: z.t, bc: colSize,
                P_dead_kN: baseR.P_kN,
                Mx_dead_kNm: baseR.Mx_kN,
                My_dead_kNm: baseR.My_kN,
                label: z.idx,
              };
            });
            // Vigas de amarre (sistema=1) — entre zapatas adyacentes
            const vigasAmarre = [] as any[];
            if (sistema === 1) {
              const zVA = va_pos === 0 ? -Hf : -Hf / 2;
              const byY = new Map<string, typeof baseRows>();
              const byX = new Map<string, typeof baseRows>();
              for (const b of baseRows) {
                const ky = b.y.toFixed(4), kx = b.x.toFixed(4);
                if (!byY.has(ky)) byY.set(ky, []);
                if (!byX.has(kx)) byX.set(kx, []);
                byY.get(ky)!.push(b);
                byX.get(kx)!.push(b);
              }
              for (const row of byY.values()) {
                row.sort((a,b)=>a.x-b.x);
                for (let i = 0; i < row.length-1; i++) {
                  vigasAmarre.push({ x1:row[i].x, y1:row[i].y, x2:row[i+1].x, y2:row[i+1].y, h:va_h, b:va_b, z:zVA });
                }
              }
              for (const col of byX.values()) {
                col.sort((a,b)=>a.y-b.y);
                for (let i = 0; i < col.length-1; i++) {
                  vigasAmarre.push({ x1:col[i].x, y1:col[i].y, x2:col[i+1].x, y2:col[i+1].y, h:va_h, b:va_b, z:zVA });
                }
              }
            }
            try {
              downloadEdificioCimentacionF2k({
                zapatas,
                vigasAmarre: vigasAmarre.length ? vigasAmarre : undefined,
                ks_kNm3: ks,
                Z: -Hf,
              }, `cimentacion_edificio_${zapatas.length}_zapatas.f2k`);
              const msgVigas = vigasAmarre.length ? `\n+ ${vigasAmarre.length} vigas de amarre` : "";
              alert(`✅ Exportado UN F2K con TODA la cimentación:\n• ${zapatas.length} zapatas (P, Mx, My individuales)${msgVigas}\n• ks compartido = ${ks} kN/m³\n\nÁbrelo en SAFE 20.x — verás todas las zapatas + vigas en un solo modelo.`);
              console.log(`[F2K Cim Completa] ${zapatas.length} zapatas + ${vigasAmarre.length} vigas exportadas en 1 archivo`);
            } catch (e: any) {
              alert(`❌ Error al exportar: ${e.message}`);
              console.error(e);
            }
          });

          // ── Botón: Importar F2K cimentación COMPLETA ──
          fCim.addButton({ title: "📥 Importar F2K cimentación COMPLETA" }).on("click", async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".f2k,.txt";
            input.onchange = async (ev: any) => {
              const file = ev.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const { parseEdificioCimentacionF2k } = await import("../shared/f2kCimentacionImporter");
                const data = parseEdificioCimentacionF2k(text);
                const w = data._warnings ?? [];
                const wMsg = w.length ? `\n⚠ ${w.join("\n⚠ ")}` : "";
                (window as any).__hekatanImportedCim = data;
                console.log("[F2K Cim Importada]", data);
                alert(`✅ F2K importado:\n• ${data.zapatas.length} zapatas\n• ${data.vigasAmarre?.length ?? 0} vigas de amarre\n• ks = ${Math.round(data.ks_kNm3)} kN/m³\n• Z = ${data.Z?.toFixed(2)} m\n\nDatos en window.__hekatanImportedCim. Para re-exportar el mismo modelo: window.__hekatanDownloadF2kCim(window.__hekatanImportedCim).${wMsg}`);
              } catch (e: any) {
                alert(`❌ Error al importar: ${e.message}`);
                console.error(e);
              }
            };
            input.click();
          });
        }
      } catch (e) {
        console.warn("[Workspace] Toggle FEM Cim setup falló:", e);
      }
      // REGLA: F2K (SAFE) solo se exporta cuando el edificio tiene cálculo de
      // cimentación (modoCimentacion). En superestructuras sin modo cimentación
      // solo se ofrece E2K (ETABS) y S2K (SAP) — más abajo.
    }
    if (isFooting && urlFrom) {
      const fNav = pane.addFolder({ title: "🔗 Origen", expanded: true });
      fNav.addButton({ title: `← Volver a ${urlFrom}` }).on("click", () => {
        const url = new URL(window.location.href);
        url.searchParams.set("t", urlFrom);
        url.searchParams.delete("P");
        url.searchParams.delete("Mx");
        url.searchParams.delete("My");
        url.searchParams.delete("from");
        window.location.href = url.toString();
      });
    }
  }

  // ── Load Patterns / Cases / Combinations (estilo ETABS) ──
  // Folders editables que reflejan los conceptos clásicos de ETABS:
  //   • Pattern = origen físico de la carga (Dead, Live, Wind, EQX, ...)
  //   • Case    = operación de análisis (Linear Static, Modal, THA, ...)
  //   • Combo   = suma lineal de cases (1.2D+1.6L, etc.) para diseño LRFD.
  // Persisten en localStorage por exampleId. Los ejemplos pueden leer
  // states.loadPatterns para aplicar peso propio según SW multiplier.
  if (currentExample) {
    __loadPanel = attachLoadPatternsPanel({
      pane,
      exampleId: currentExample.id,
      loadPatterns,
      loadCases,
      loadCombinations,
      activeLoadCase,
      onChange: () => {
        // Re-build cuando cambia el case activo o el SW multiplier.
        try { scheduleRebuild?.(); } catch {}
        // Sincronizar el selector "Case results" (pane Settings) con el "Caso activo" (pane derecho).
        try { mountCaseResultsInSettings(); } catch {}
      },
    });
    // Re-montar "Case results" ahora que loadCombinations ya está poblado → los combos
    // (Σ 1.4D, Σ 1.2D+1.6L) aparecen en el selector (en el primer mount estaban vacíos).
    try { mountCaseResultsInSettings(); } catch {}
  }

  // ── ETABS .e2k / SAP2000 .s2k Export/Import ──
  // F2K (SAFE) ya cubre las zapatas; ETABS/SAP cubren TODO LO DEMÁS:
  // edificios, pórticos, placas, cáscaras, mezzanines, galpones, etc.
  // Permite roundtrip Hekatan ↔ ETABS/SAP para validación cruzada de
  // edificios duales, modal y participación de masa.
  // Se excluyen cimentaciones puras (zapata*, guerra-ej*, safe-bench-*).
  if (currentExample && !isFoundation) {
    const fEtabs = pane.addFolder({ title: "ETABS", expanded: false });
    const fSap   = pane.addFolder({ title: "SAP",   expanded: false });
    // Columnas CFT al .s2k: SAP2000 no tiene "Filled Steel Tube" (ETABS si). Por defecto
    // van como Section Designer (lo mas parecido a ETABS: SAP recalcula A, I, As, J de las
    // formas); "General" escribe las propiedades que calcula Hekatan tal cual.
    const sapOpts = { cftAs: "sd" as "sd" | "general" };
    fSap.addBinding(sapOpts, "cftAs", { label: "CFT en SAP", options: { "Section Designer": "sd", "Sección General": "general" } });
    const downloadText = (text: string, filename: string) => {
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    };
    // Modo de peso propio: "auto" → ETABS lo computa (SELFWEIGHT=1, sin cargas
    // nodales FZ). "manual" → SELFWEIGHT=0 + cargas nodales FZ emitidas
    // explícitamente (control fino del lumping). Default "auto".
    const etabsExportCfg = { weightMode: "auto" as "auto" | "manual",
                             patronCargas: "Dead" };
    fEtabs.addBinding(etabsExportCfg, "weightMode", {
      label: "Peso propio",
      options: { "Auto (SELFWEIGHT=1)": "auto", "Manual (POINTLOAD nodal)": "manual" },
    });
    // ── A QUE PATRON van las cargas del usuario ─────────────────────────────
    // Iban SIEMPRE a Dead, y Dead lleva `SELFWEIGHT 1`: o sea que el caso Dead
    // quedaba con peso propio MAS sobrecarga sumados, y el caso Live salia con
    // los desplazamientos en 0.000 en todos los nudos. Comprobado abriendo el
    // e2k en ETABS: «3-D View - Displacements (Live)» con Ux = Uy = Uz = 0.
    //
    // Dead es el peso de la estructura; lo que uno aplica encima es otra cosa.
    // Se deja "Dead" por defecto para no cambiar lo ya exportado y validado,
    // pero con un clic se manda a Live.
    fEtabs.addBinding(etabsExportCfg, "patronCargas", {
      label: "Cargas aplicadas a",
      options: { "Dead (con el peso propio)": "Dead", "Live (separadas)": "Live" },
    });
    fEtabs.addButton({ title: "📤 Exportar E2K" }).on("click", () => {
      // Delegación: si el ejemplo tiene un exporter custom (p.ej. cantileverE2k.ts
      // para HSS hueco, CFT, etc.), usamos ese. Si no, fallback al generic.
      if (currentExample?.customE2kExport) {
        try {
          currentExample.customE2kExport(toSIParams(), states);
          console.log(`✅ E2K exportado via customE2kExport del ejemplo`);
        } catch (e: any) {
          console.error(`Error en customE2kExport:`, e);
        }
        return;
      }
      try {
        const text = exportE2k({
          nodes: states.nodes.val,
          elements: states.elements.val,
          nodeInputs: states.nodeInputs.val,
          elementInputs: states.elementInputs.val,
          title: `${currentExample!.name} — Hekatan export`,
          units: { force: "Tonf", length: "m" },
          weightMode: etabsExportCfg.weightMode,
          loadPatternDestino: etabsExportCfg.patronCargas,
          // Las combinaciones del MODELO, no las que traia escritas el exportador.
          loadCombinations: loadCombinations.val,
          loadPatterns: loadPatterns.val,
          loadCases: loadCases.val,
          // El CLI Modeler modela EXACTAMENTE lo escrito: si el script no pide
          // diafragma, el e2k no debe inventarlo (rigidiza lateralmente). Los
          // ejemplos de edificio si lo llevan — asi se validaron contra ETABS.
          diaphragm: currentExample?.id === "cli-modeler" ? "none" : "auto",
          // Sismo NEC (espectro USER + caso Modal Eigen/Ritz + RS) si el ejemplo lo provee.
          seismicNEC: currentExample!.e2kSeismic?.(toSIParams(), states),
        });
        const fname = `${currentExample!.id}_${Date.now()}.e2k`;
        downloadText(text, fname);
        console.log(`✅ E2K exportado generic (peso ${etabsExportCfg.weightMode}): ${text.length} bytes → ${fname}`);
        console.log(`Abrilo en ETABS: File → Import → ETABS .e2k Text File`);
      } catch (e: any) {
        console.error(`Error exportando E2K:`, e);
      }
    });
    fEtabs.addButton({ title: "📥 Importar E2K" }).on("click", () => {
      const input = document.createElement("input");
      input.type = "file"; input.accept = ".e2k,.$et,.txt";
      input.onchange = async (ev: any) => {
        const file = ev.target.files?.[0]; if (!file) return;
        try {
          const text = await file.text();
          const model = parseE2k(text);
          // ── El modelo va ENTERO al importador, no a `new-blank` ──────────
          // Antes se guardaban SOLO los puntos y las lineas y se navegaba a
          // `new-blank`, o sea al ARCHIVO NUEVO: se tiraban las secciones, los
          // materiales, los apoyos y las cargas que el parser ya habia leido,
          // y el modelo importado acababa mostrando las secciones y cargas por
          // defecto del archivo nuevo (bCol, hCol, bViga, hViga, tShell, Fz,
          // Fx). Un archivo EXISTENTE tiene que mostrar SUS datos.
          const ei: Record<string, [number, number][]> = {};
          for (const [k, v] of Object.entries(model.elementInputs ?? {})) {
            if (v instanceof Map) ei[k] = [...v.entries()] as [number, number][];
          }
          (window as any).__hekatanImportedModel = {
            fuente: "E2K",
            archivo: file.name,
            nodes: model.nodes,
            elements: model.elements,
            tipos: model.elements.map((e: number[], i: number) =>
              e.length === 4 ? "AREA" : (model.elementTypes?.[i] ?? "BEAM")),
            secciones: model.elements.map((_e: number[], i: number) =>
              model.elementSections?.get(i) ?? "—"),
            plantas: model.elementStories ?? [],
            supports: [...((model.nodeInputs?.supports as Map<number, boolean[]>) ?? new Map()).entries()],
            loads: [...((model.nodeInputs?.loads as Map<number, number[]>) ?? new Map()).entries()],
            elementInputs: ei,
            info: model.info,
          };
          const nSec = new Set(model.elements.map((_e: number[], i: number) =>
            model.elementSections?.get(i))).size;
          console.log(`✅ E2K importado: ${file.name} — ${model.nodes.length} nudos, `
            + `${model.elements.length} elementos, ${nSec} secciones, `
            + `${(model.nodeInputs?.supports as Map<number, boolean[]>)?.size ?? 0} apoyos. `
            + `Se muestra en «Importar CSI» con SUS datos.`);
          const u = new URL(window.location.href);
          u.searchParams.set("t", "csi-importer");
          window.location.href = u.toString();
        } catch (e: any) {
          alert(`Error importando E2K: ${e?.message ?? e}`); console.error(e);
        }
      };
      input.click();
    });
    fSap.addButton({ title: "📤 Exportar S2K" }).on("click", () => {
      try {
        const text = exportS2k({
          nodes: states.nodes.val,
          elements: states.elements.val,
          nodeInputs: states.nodeInputs.val,
          elementInputs: states.elementInputs.val,
          title: `${currentExample!.name} — Hekatan export`,
          cftAs: sapOpts.cftAs,
        });
        const fname = `${currentExample!.id}_${Date.now()}.s2k`;
        downloadText(text, fname);
        console.log(`✅ S2K exportado: ${text.length} bytes → ${fname}`);
        console.log(`SAP2000 .s2k descargado: ${fname}`);
      } catch (e: any) {
        console.error(`Error exportando S2K:`, e);
      }
    });
    fSap.addButton({ title: "📥 Importar S2K" }).on("click", () => {
      const input = document.createElement("input");
      input.type = "file"; input.accept = ".s2k,.$2k,.txt";
      input.onchange = async (ev: any) => {
        const file = ev.target.files?.[0]; if (!file) return;
        try {
          const text = await file.text();
          const model = parseS2k(text);
          // Carga en new-blank igual que E2K
          const points = (model.nodes ?? []).map((n: number[]) => [n[0], n[1], n[2]]);
          const polylines: number[][] = [];
          const areas: number[] = [];
          for (let i = 0; i < (model.elements?.length ?? 0); i++) {
            const elem = model.elements![i] as number[];
            if (elem.length === 4) {
              polylines.push([...elem, elem[0]]);
              areas.push(polylines.length - 1);
            } else {
              polylines.push([elem[0], elem[1]]);
            }
          }
          localStorage.setItem("__hekatan_pending_import__", JSON.stringify({
            source: "S2K",
            filename: file.name,
            nodes: points,
            polylines,
            areas,
            timestamp: Date.now(),
          }));
          console.log(`✅ S2K importado: ${file.name} (${model.nodes?.length ?? 0} nodos, ${model.elements?.length ?? 0} elementos) → cargando en new-blank...`);
          const u = new URL(window.location.href);
          u.searchParams.set("t", "new-blank");
          window.location.href = u.toString();
        } catch (e: any) {
          alert(`Error importando S2K: ${e?.message ?? e}`); console.error(e);
        }
      };
      input.click();
    });
  }

  // ── Unidades (global, persistido en localStorage) ──
  const fUnits = pane.addFolder({ title: "Unidades", expanded: false });
  const unitsProxy = { force: forceUnit.val, disp: dispUnit.val };
  fUnits.addBinding(unitsProxy, "force", {
    label: "Fuerza",
    options: { kN: "kN", tonf: "tonf", kip: "kip" },
  }).on("change", (e) => {
    const oldUnit = forceUnit.val;
    const newUnit = e.value as any;
    // Re-escala los values actuales de params con unitType="force"/"moment"
    // para que representen la MISMA fuerza física pero expresada en la nueva
    // unidad. Ej: F=200 kN con oldUnit=kN, newUnit=tonf → F=200/9.80665=20.4 tonf.
    if (currentExample && oldUnit !== newUnit) {
      const fOld = oldUnit === "kN" ? 1 : oldUnit === "tonf" ? 9.80665 : 4.4482216;
      const fNew = newUnit === "kN" ? 1 : newUnit === "tonf" ? 9.80665 : 4.4482216;
      for (const [k, p] of Object.entries(currentExample.params)) {
        if (p.unitType === "force" || p.unitType === "moment") {
          // value_physical_kN = value_ui × factor_old ⇒ value_ui_new = value_ui × (factor_old/factor_new)
          currentParams[k] = (currentParams[k] * fOld) / fNew;
        }
      }
    }
    forceUnit.val = newUnit;
    // Rebuild UI del pane con nuevos labels y valores escalados
    buildParamsPane();
    // Rebuild modelo (no es necesario si internamente trabajamos en SI, pero el
    // log de verificación usa p.F que ahora está en tonf; fine, se auto-corrige)
    rebuild();
  });
  fUnits.addBinding(unitsProxy, "disp", {
    label: "Desplazamiento",
    options: { mm: "mm", cm: "cm", m: "m", in: "in" },
  }).on("change", (e) => {
    dispUnit.val = e.value as any;
    buildParamsPane();
    rebuild();
  });

  // ── Auto-mesh shells toggle (ETABS-style MESHATINTERSECTIONS YES) ──
  const meshProxy = { autoMesh: autoMeshShellsEnabled.val };
  fUnits.addBinding(meshProxy, "autoMesh", {
    label: "🔲 Auto-mesh shells (ETABS-like)",
  }).on("change", (e) => {
    autoMeshShellsEnabled.val = e.value as boolean;
    console.log(`[workspace] Auto-mesh shells: ${e.value ? "ON" : "OFF"}`);
    rebuild();
  });

  // ── Sub-folder "🌐 Sistema (preset)" — un click setea todo coherente ──
  const fPreset = fUnits.addFolder({ title: "🌐 Sistema (preset)", expanded: true });
  const presetProxy = { sistema: detectCurrentPreset() };
  fPreset.addBinding(presetProxy, "sistema", {
    label: "Preset",
    options: {
      "Metric MKS (tonf, m, mm, kgf/cm²)": "Metric MKS",
      "Metric SI (kN, m, mm, MPa)": "Metric SI",
      "U.S. Imperial (kip, ft, in, ksi)": "U.S. Imperial",
      "Custom (granular)": "Custom",
    },
  }).on("change", (e: any) => {
    const name = e.value;
    if (name === "Custom") return;  // no aplica nada, el user usa Display Units
    applyConsistentUnits(name);
    // Sync proxy con los nuevos valores
    unitsProxy.force = forceUnit.val;
    unitsProxy.disp = dispUnit.val;
    customProxy.stress = stressUnit.val;
    customProxy.subgrade = subgradeUnit.val;
    customProxy.stiffTrans = stiffTransUnit.val;
    customProxy.lengthSection = lengthSectionUnit.val;
    pane.refresh();
    buildParamsPane();
    rebuild();
  });

  // ── Sub-folder "📐 Display Units (custom)" — granular per-quantity ──
  const fCustom = fUnits.addFolder({ title: "📐 Display Units (granular)", expanded: false });
  const customProxy = {
    stress: stressUnit.val,
    subgrade: subgradeUnit.val,
    stiffTrans: stiffTransUnit.val,
    lengthSection: lengthSectionUnit.val,
  };
  fCustom.addBinding(customProxy, "stress", {
    label: "Stress (σ, vM, pressure)",
    options: { "kN/m²": "kN/m²", "kPa": "kPa", "MPa": "MPa", "GPa": "GPa",
               "kgf/cm²": "kgf/cm²", "tonf/m²": "tonf/m²", "psi": "psi",
               "ksi": "ksi", "kip/ft²": "kip/ft²" },
  }).on("change", (e: any) => {
    stressUnit.val = e.value;
    presetProxy.sistema = detectCurrentPreset();
    pane.refresh();
    rebuild();
  });
  fCustom.addBinding(customProxy, "subgrade", {
    label: "Subgrade modulus (ks)",
    options: { "kN/m³": "kN/m³", "tonf/m³": "tonf/m³", "kgf/cm³": "kgf/cm³",
               "kip/ft³": "kip/ft³", "pci": "pci" },
  }).on("change", (e: any) => {
    subgradeUnit.val = e.value;
    presetProxy.sistema = detectCurrentPreset();
    pane.refresh();
    rebuild();
  });
  fCustom.addBinding(customProxy, "stiffTrans", {
    label: "Stiffness trans (K spring)",
    options: { "kN/m": "kN/m", "tonf/m": "tonf/m", "kip/in": "kip/in",
               "kip/ft": "kip/ft", "N/mm": "N/mm" },
  }).on("change", (e: any) => {
    stiffTransUnit.val = e.value;
    presetProxy.sistema = detectCurrentPreset();
    pane.refresh();
    rebuild();
  });
  fCustom.addBinding(customProxy, "lengthSection", {
    label: "Length section (espesor, h, b)",
    options: { "mm": "mm", "cm": "cm", "m": "m", "in": "in", "ft": "ft" },
  }).on("change", (e: any) => {
    lengthSectionUnit.val = e.value;
    presetProxy.sistema = detectCurrentPreset();
    pane.refresh();
    rebuild();
  });

  // ── Parámetros del ejemplo — agrupados en folders (si ParamDef.folder se define) ──
  const defaultFolderTitle = "Parámetros";
  const folderMap = new Map<string, any>();  // folder title → Tweakpane folder instance
  // Folders que aparecen expandidos por default (el usuario los usa todo el tiempo):
  //  - "Parámetros" (raíz)
  //  - Cualquier folder con "Modo" en el título (el selector Simple/D/L/S/Combinación)
  //  - Folder "Combinación" dentro de cargas (para ver factores fD/fL/fS al vuelo)
  // MODELO EXISTENTE (?heks= o ?m=): el panel de parametros NO aplica.
  // Jorge, 2026-08-12: *"para modelos ya existentes no debe ir tanta cosa, sino
  // lo que uno necesita para cambiar rapido; el workspace de un modelo
  // existente debe ser algo diferente"*. Un .heks ya trae su geometria hecha:
  // los sliders de un ejemplo parametrico no la tocan, solo estorban. Se dejan
  // accesibles pero CERRADOS, y quien manda es 🔬 Analyze.
  const isExpandedByDefault = (title: string) =>
    !URL_HEKS && (
      title === defaultFolderTitle ||
      /\bmodo\b/i.test(title) ||
      /activar/i.test(title) ||     // "Cargas — Activar" (toggles D/L/S)
      /combinaci/i.test(title));
  const getFolder = (title: string) => {
    if (!folderMap.has(title)) {
      // Respetar la elección del usuario si ya tocó este folder en un rebuild
      // previo (capturada antes del último dispose). Sino, default del ejemplo.
      const savedExpanded = folderExpandedState.get(title);
      const expanded = savedExpanded !== undefined ? savedExpanded : isExpandedByDefault(title);
      const f = pane.addFolder({ title, expanded });
      folderMap.set(title, f);
    }
    return folderMap.get(title);
  };
  // Exponer la folderMap del rebuild actual para que el SIGUIENTE rebuild
  // pueda capturar el estado expanded justo antes del dispose.
  lastFolderMap = folderMap;
  let timer: number | null = null;
  const scheduleRebuild = () => {
    if (timer !== null) clearTimeout(timer);
    timer = window.setTimeout(() => { timer = null; rebuild(); }, 120);
  };
  // Proxy de booleanos: Tweakpane requiere true/false nativo para renderizar
  // un checkbox, pero `currentParams` usa 0/1 (Record<string, number>).
  // Guardamos un proxy {key: boolean} y sincronizamos en cada cambio.
  const boolProxy: Record<string, boolean> = {};

  // Rangos configurables dinámicamente (folder "📏 Rangos"). Para cada slider
  // con `rangeAdjustable: true` (o unitType=force/moment), se registra su
  // min/max actual en rangeProxy; el folder "Rangos" provee dos sliders
  // auxiliares "key min" y "key max" que cuando cambian, se aplican vía
  // pane.refresh() (Tweakpane no soporta cambiar min/max en vivo sin
  // reconstruir; usamos sliderBindings[key] = { binding, rebuildBinding }
  // para removerlo y recrearlo con nuevos límites).
  const rangeProxy: Record<string, { min: number; max: number }> = {};
  const sliderBindings: Record<string, {
    rebuild: (newMin: number, newMax: number) => void,
  }> = {};
  // Detecta si un param DEBE tener rango editable (cargas = sí por default).
  const shouldHaveAdjustableRange = (p: any) =>
    p.rangeAdjustable === true ||
    (p.rangeAdjustable !== false && (p.unitType === "force" || p.unitType === "moment"));
  // Prepara los valores inline calculados (ks, D, etc.) ANCLADOS a cada param.
  // Mapa: key del param → lista de inlines a insertar después.
  const inlineByAfter = new Map<string, Array<{ label: string; key: string; compute: any; hiddenIf?: any }>>();
  inlineComputedObj = {};
  if (currentExample.inlineComputed) {
    for (const ic of currentExample.inlineComputed) {
      const uniqKey = `__inline_${ic.after}_${ic.label}`;
      inlineComputedObj[uniqKey] = ic.compute(currentParams, states);
      if (!inlineByAfter.has(ic.after)) inlineByAfter.set(ic.after, []);
      inlineByAfter.get(ic.after)!.push({
        label: ic.label, key: uniqKey, compute: ic.compute,
        hiddenIf: ic.hiddenIf,
      });
    }
  }

  // ── Dynamic params (secciones por piso, vigas por vano, etc.) ────────
  // El ejemplo expone dynamicParams(currentParams) que retorna keys adicionales
  // basadas en el estado actual (ej: nPisos=3 → bCol_p1, hCol_p1, bCol_p2, ...).
  // Se fusionan con los params estáticos; los valores actuales se preservan.
  const dyn = currentExample.dynamicParams
    ? currentExample.dynamicParams(currentParams)
    : {};
  for (const [dkey, dp] of Object.entries(dyn)) {
    if (!(dkey in currentParams)) {
      // Nueva key: inicializar con default (en unidad UI si tiene unitType)
      const valSI = dp.default;
      currentParams[dkey] =
        dp.unitType === "force"  ? fromKn(valSI) :
        dp.unitType === "moment" ? fromKnm(valSI) :
        valSI;
    }
  }
  // Merged params = estáticos + dinámicos. El loop de render itera sobre todos.
  const allParams: Record<string, ParamDef> = { ...currentExample.params, ...dyn };

  for (const [key, p] of Object.entries(allParams)) {
    // Params marcados inModal (N° de modos, Método modal) NO van en el panel de
    // parámetros — se rinden dentro del folder "⚡ Modal + Animación" en Settings.
    if ((p as any).inModal) continue;
    const folderTitle = p.folder ?? defaultFolderTitle;
    const fTarget = getFolder(folderTitle);
    if (p.boolean) {
      // Checkbox on/off. Valor almacenado como 0|1 en currentParams.
      boolProxy[key] = currentParams[key] >= 0.5;
      const bb = fTarget.addBinding(boolProxy, key, { label: p.label ?? key });
      bb.on("change", (e: any) => {
        currentParams[key] = e.value ? 1 : 0;
        if (currentExample?.onParamChange) {
          currentExample.onParamChange(key, currentParams);
          pane.refresh();
        }
        applyHiddenBindings();
        scheduleRebuild();
      });
      if (p.hiddenIf) hiddenBindings.push({ binding: bb, hiddenIf: p.hiddenIf });
      continue;
    }
    // Label dinámico: si el param tiene unitType, anexar el sufijo actual
    // ("(kN)" / "(tonf)" / "(kip)" / "(kN·m)" / "(mm)", etc.). El label base se
    // limpia primero de cualquier sufijo previo, así un `label: "F lateral (kN)"`
    // funciona igual que `label: "F lateral"`.
    const baseLabel = stripUnitSuffix(p.label ?? key);
    const unitSuffix = p.unitType === "force"  ? ` ${forceUnitSuffix()}` :
                       p.unitType === "moment" ? ` ${momentUnitSuffix()}` :
                       p.unitType === "disp"   ? ` ${dispUnitSuffix()}` :
                       "";
    const finalLabel = baseLabel + unitSuffix;

    const opts: any = { label: finalLabel };
    if (p.options !== undefined) {
      opts.options = p.options;
    } else {
      // Cuando hay unitType, min/max/step vienen en unidad UI (para que
      // el rango del slider sea razonable en la unidad elegida). Internamente
      // currentParams[key] se almacena en la misma unidad UI que el slider;
      // la conversión a SI la hace el ejemplo en build() vía toKn/toKnm/dispToM,
      // O mejor: el workspace la hace automáticamente ANTES de llamar a build().
      if (p.min !== undefined) opts.min = p.min;
      if (p.max !== undefined) opts.max = p.max;
      if (p.step !== undefined) opts.step = p.step;
    }
    // Construir (o reconstruir) el binding con los min/max indicados.
    // Guardamos la API de rebuild en sliderBindings[key] para que el folder
    // "📏 Rangos" pueda recrear el slider cuando el usuario cambie sus límites.
    let currentBinding: any = null;
    const rebuildSlider = (newMin: number | undefined, newMax: number | undefined) => {
      if (currentBinding) { try { currentBinding.dispose?.(); } catch {} }
      const rebuiltOpts: any = { ...opts };
      if (newMin !== undefined) rebuiltOpts.min = newMin;
      if (newMax !== undefined) rebuiltOpts.max = newMax;
      // Clampar el valor actual al nuevo rango (evita que el slider se rompa)
      if (rebuiltOpts.min !== undefined && currentParams[key] < rebuiltOpts.min) currentParams[key] = rebuiltOpts.min;
      if (rebuiltOpts.max !== undefined && currentParams[key] > rebuiltOpts.max) currentParams[key] = rebuiltOpts.max;
      currentBinding = fTarget.addBinding(currentParams, key, rebuiltOpts);
      // Registrar visibilidad dinamica si el param tiene hiddenIf
      if (p.hiddenIf) hiddenBindings.push({ binding: currentBinding, hiddenIf: p.hiddenIf });
      // Tooltip nativo browser via title attribute — aparece al hover sin
      // librerías extra. Texto declarado en ParamDef.description.
      if (p.description && currentBinding?.element) {
        try { (currentBinding.element as HTMLElement).title = p.description; } catch {}
      }
      currentBinding.on("change", (ev: any) => {
        if (currentExample?.onParamChange) {
          currentExample.onParamChange(key, currentParams);
          pane.refresh();
        }
        // Re-evaluar visibilidad de hiddenIf bindings (preset cambio puede ocultar/mostrar otros)
        applyHiddenBindings();
        // Si este param regenera dynamicParams (nPisos, nVanos, etc.),
        // reconstruir el pane ENTERO para que aparezcan los nuevos sliders
        // Piso 1, Piso 2, Piso 3... automáticamente — PERO sólo cuando el
        // usuario suelta el slider (ev.last === true), no durante el drag.
        // Durante el drag mantenemos el pane intacto y solo recomputamos el
        // modelo en live (scheduleRebuild). Esto evita que el slider se cierre
        // / pierda foco a mitad del arrastre.
        if (p.regenOnChange) {
          if (ev?.last === false) {
            __liveDrag = true;
            scheduleRebuild();   // live calc sin tocar el pane
          } else {
            __liveDrag = false;
            // Si el modal estaba animando, recordarlo: buildParamsPane() recrea el
            // animador (lo dispone) → la animación se perdería al cambiar N° de
            // muros/pisos/vanos. Tras regenerar + rebuild, la re-lanzamos.
            // rebuild() ya re-corre y re-anima el modal por su dispatcher (__modalActivo): aquí NO se
            // vuelve a lanzar — hasta el 6-sep-2026 se lanzaba dos veces por cada suelta del slider.
            window.setTimeout(() => { buildParamsPane(); rebuild(); }, 80);
          }
        } else {
          __liveDrag = ev?.last === false;
          scheduleRebuild();
        }
      });
    };
    rebuildSlider(p.min, p.max);
    if (shouldHaveAdjustableRange(p) && p.min !== undefined && p.max !== undefined) {
      rangeProxy[key] = { min: p.min, max: p.max };
      sliderBindings[key] = {
        rebuild: (newMin, newMax) => rebuildSlider(newMin, newMax),
      };
    }
    // Si este param tiene inlines anclados (ej. ks después de ks_factor),
    // insertar los readonly bindings en el MISMO folder, justo debajo.
    const inlines = inlineByAfter.get(key);
    if (inlines && inlineComputedObj) {
      for (const il of inlines) {
        const ilBinding = fTarget.addBinding(inlineComputedObj, il.key, {
          readonly: true,
          label: il.label,
          view: "text",
        } as any);
        // Si el inline tiene hiddenIf, registrarlo para que se oculte/muestre
        // dinámicamente cuando cambie el modo (springMode, etc.)
        if (il.hiddenIf) {
          hiddenBindings.push({ binding: ilBinding, hiddenIf: il.hiddenIf });
        }
      }
    }
  }

  // ── Folder "📏 Rangos" — min/max configurables de los sliders de cargas ──
  // Inspirado en el panel "Rangos" de FEM-Studio (beams/edificio). Para cada
  // param con rangeAdjustable=true (o unitType=force/moment), se muestra su
  // "<label> min" y "<label> max" como sliders con valores actuales. Al mover
  // el min o max, el slider principal se reconstruye con los nuevos límites.
  const rangeKeys = Object.keys(rangeProxy);
  if (rangeKeys.length > 0) {
    const fRanges = pane.addFolder({ title: "📏 Rangos", expanded: false });
    for (const k of rangeKeys) {
      const p = currentExample.params[k];
      const baseLabel = stripUnitSuffix(p.label ?? k);
      const step = p.step ?? 1;
      // Rango de los sliders min/max: extendemos ±5× el default para dar margen
      // pero evitamos crashes con rangos demasiado extremos.
      const span = Math.abs(p.max! - p.min!);
      const metaMin = p.min! - span * 5;
      const metaMax = p.max! + span * 5;
      fRanges.addBinding(rangeProxy[k], "min", {
        label: `${baseLabel} min`, min: metaMin, max: p.max!, step,
      }).on("change", (e) => {
        const nmin = Math.min(e.value as number, rangeProxy[k].max - step);
        rangeProxy[k].min = nmin;
        sliderBindings[k].rebuild(nmin, rangeProxy[k].max);
      });
      fRanges.addBinding(rangeProxy[k], "max", {
        label: `${baseLabel} max`, min: p.min!, max: metaMax, step,
      }).on("change", (e) => {
        const nmax = Math.max(e.value as number, rangeProxy[k].min + step);
        rangeProxy[k].max = nmax;
        sliderBindings[k].rebuild(rangeProxy[k].min, nmax);
      });
    }
  }

  // ── Folder "📖 Guía de pasos" — instrucciones del ejemplo para el usuario ──
  // Si el ejemplo define `guide`, mostramos los pasos numerados como labels
  // read-only en un folder. Expandido por default si es la primera visita
  // (flag en localStorage por example.id).
  if (currentExample.guide && currentExample.guide.length > 0) {
    const guideKey = `hk_guide_seen_${currentExample.id}`;
    const seen = localStorage.getItem(guideKey) === "1";
    const fGuide = pane.addFolder({ title: "📖 Guía de pasos", expanded: !seen });
    // Marcar como visto la primera vez que se renderiza
    if (!seen) localStorage.setItem(guideKey, "1");
    // Renderizar pasos como divs estilizados (Tweakpane no tiene texto multilinea
    // built-in, usamos elementos DOM directos).
    const guideContainer = document.createElement("div");
    guideContainer.style.cssText = "padding:6px 8px;font-size:11px;color:#cbd5e1;line-height:1.5;font-family:system-ui,sans-serif;";
    currentExample.guide.forEach((step, i) => {
      const stepDiv = document.createElement("div");
      stepDiv.style.cssText = "padding:3px 0;border-bottom:1px solid #334155;";
      const num = document.createElement("span");
      num.style.cssText = "display:inline-block;min-width:18px;height:18px;line-height:18px;text-align:center;background:#0ea5e9;color:white;border-radius:9px;font-size:10px;font-weight:bold;margin-right:6px;";
      num.textContent = String(i + 1);
      const text = document.createElement("span");
      text.textContent = step;
      stepDiv.appendChild(num);
      stepDiv.appendChild(text);
      guideContainer.appendChild(stepDiv);
    });
    fGuide.element.appendChild(guideContainer);
  }

  // ── Folder "📊 Calculados" (read-only) — valores derivados del build actual ──
  // Solo se muestra si el ejemplo exporta computedLabels(). Se actualiza en cada rebuild.
  if (currentExample.computedLabels) {
    const fCalc = pane.addFolder({ title: "📊 Calculados", expanded: true });
    // Objeto mutable que tweakpane monitorea. Claves = labels, valores = strings.
    const initial = currentExample.computedLabels(currentParams, states);
    computedObj = { ...initial };
    console.log("[Calculados]", computedObj);
    for (const key of Object.keys(initial)) {
      // view:'text' fuerza a Tweakpane v4 a usar TextInputView para strings readonly
      // (sin esto, strings readonly a veces se pintan vacíos).
      fCalc.addBinding(computedObj, key, {
        readonly: true,
        view: "text",
        interval: 0,
      } as any);
    }
  } else {
    computedObj = null;
  }

  // Modal trigger + animación visual del modo (todo dentro del Tweakpane — sin
  // ventanas flotantes custom). El status (modo, frecuencia, período, dirección
  // dominante) se muestra como bindings readonly que se refrescan en vivo.
  // Limpiar SIEMPRE el folder modal-en-Settings de la corrida/ejemplo anterior — aunque el
  // ejemplo nuevo NO tenga modal — si no, queda huérfano en Settings al cambiar de ejemplo.
  if (__modalSettingsFolder) { try { __modalSettingsFolder.dispose(); } catch {} __modalSettingsFolder = null; }
  if (currentExample.hasModal) {
    // El modal (EJECUCIÓN + RESULTADOS) vive en Settings ▸ Analysis Outputs (panel izquierdo),
    // NO en el panel de parámetros (derecho). Settings persiste entre rebuilds → dispose-then-add
    // para no duplicar. Fallback al params pane si Settings aún no existe.
    const outputsFolder = (window as any).__hekatanOutputsFolder;
    const fModal = outputsFolder
      ? outputsFolder.addFolder({ title: "⚡ Modal + Animación", expanded: true, index: 2 })
      : pane.addFolder({ title: "⚡ Modal + Animación", expanded: true });
    if (outputsFolder) __modalSettingsFolder = fModal;

    // Status object: el animador dispara `onStatusChange` → pane.refresh() lo actualiza.
    const status = { mode: "—", frequency: "—", period: "—", dominant: "—", state: "⏸ Detenido" };
    modalAnimator.dispose?.();
    modalAnimator = createModalAnimator({
      mesh: { nodes, elements, deformOutputs, analyzeOutputs },
      viewerElm,
      scalePercent: 5,
      onStatusChange: () => {
        const s = modalAnimator.getStatus();
        status.mode = s.mode;
        status.frequency = s.frequency;
        status.period = s.period;
        status.dominant = s.dominant;
        status.state = s.state;
        try { fModal.refresh(); } catch {}
      },
    });
    let lastModalResults: any = null;
    const captureModalPanel = {
      div: modalPanel.div,
      render: (out: any, meta: any) => {
        lastModalResults = out;
        __lastModalResults = out;
        // Espectro de diseño → su propio panel on-demand; se quita de la tabla (no duplicar).
        if (meta?.spectrumHtml) { __lastSpectrumHtml = meta.spectrumHtml; try { renderSpectrumPanel(); } catch {} }
        modalPanel.render(out, { ...meta, spectrumHtml: undefined });
        if (out?.frequencies?.length) {
          modalAnimator.setResults(out);
          modalAnimator.setMode(0);
          modalAnimator.play();
          animCtrl.modeIdx = 1;
          try { fModal.refresh(); } catch {}
          // Re-montar "Case results" para que liste los modos (como Case/Mode de ETABS).
          try { mountCaseResultsInSettings(); } catch {}
        }
      },
    };

    const runModalAnimate = () => {
      // Detener y restaurar CUALQUIER animación en curso antes de correr el
      // nuevo análisis — si el usuario click-click-click este botón, queremos
      // que cada corrida parta limpia del modelo sin deformar (evita que se
      // capturen "originals" corruptos con el último frame animado anterior).
      modalAnimator.stop();
      // A partir de acá el modo modal queda ACTIVO: los cambios de pisos/vanos lo
      // recalculan solo (ver __modalActivo en el dispatcher de rebuild()).
      __modalActivo = true;
      // El panel/tabla modal solo se muestra si el usuario activó "Mostrar tabla" (Settings).
      modalPanel.div.style.display = __modalTableShown ? "block" : "none";
      if (currentExample!.runModal) currentExample!.runModal(toSIParams(), states, captureModalPanel);
    };
    fModal.addButton({ title: "▶ Correr modal + animar" }).on("click", runModalAnimate);
    // Toggle "Mostrar tabla": el panel/tabla modal solo aparece si el usuario lo activa.
    const __tblProxy = { show: __modalTableShown };
    const __tblBind = fModal.addBinding(__tblProxy, "show",
      { label: "📋 Tabla de modos" }).on("change", (e: any) => {
      __modalTableShown = !!e.value;
      try { modalPanel.div.style.display = __modalTableShown ? "block" : "none"; } catch {}
    });
    // El panel tiene su propio "✕": cuando se cierra desde ahí hay que
    // destildar ESTA casilla, o queda marcada con la tabla cerrada y el
    // usuario tiene que apagarla y encenderla para que vuelva.
    (window as any).__hekatanModalTablaCerrada = () => {
      __modalTableShown = false;
      __tblProxy.show = false;
      try { __tblBind.refresh(); } catch {}
    };
    // Toggle "Mostrar espectro": el espectro de diseño NEC solo aparece si el usuario lo activa.
    const __espProxy = { show: __spectrumShown };
    fModal.addBinding(__espProxy, "show", { label: "📈 Mostrar espectro" }).on("change", (e: any) => {
      __spectrumShown = !!e.value;
      try { renderSpectrumPanel(); } catch {}
    });
    (window as any).__hekatanRunModalAnimate = runModalAnimate;
    (window as any).__hekatanModalStop = () => { try { modalAnimator.stop(); } catch {} };

    // Params del modal (N° de modos, Método modal) — marcados inModal → se rinden ACÁ,
    // en Settings junto a la ejecución, NO en el panel de parámetros. Al cambiarlos se
    // re-corre el modal con el nuevo valor.
    for (const [mkey, mp] of Object.entries(currentExample.params)) {
      if (!(mp as any).inModal) continue;
      if ((mp as any).boolean) {
        // Checkbox (Diafragma rígido) — re-corre el modal al cambiar.
        const bx: Record<string, boolean> = { [mkey]: currentParams[mkey] >= 0.5 };
        fModal.addBinding(bx, mkey, { label: mp.label ?? mkey }).on("change", (e: any) => {
          currentParams[mkey] = e.value ? 1 : 0;
          runModalAnimate();
        });
      } else if (mp.options) {
        // Dropdown (Método modal)
        fModal.addBinding(currentParams, mkey, { label: mp.label ?? mkey, options: mp.options })
          .on("change", () => runModalAnimate());
      } else {
        // Numérico (N° de modos) con TOPE editable: sub-folder con "cantidad" + "tope (máx)".
        // Al cambiar el tope se recrea el slider con el nuevo límite (estilo "📏 Rangos").
        const fN = fModal.addFolder({ title: "🔢 " + (mp.label ?? mkey), expanded: true });
        const lim = { max: mp.max ?? 60 };
        let nb: any = null;
        const rebuildN = () => {
          if (nb) { try { nb.dispose(); } catch {} }
          if (currentParams[mkey] > lim.max) currentParams[mkey] = lim.max;
          nb = fN.addBinding(currentParams, mkey, { label: "cantidad", min: mp.min ?? 1, max: lim.max, step: mp.step ?? 1, index: 0 });
          nb.on("change", () => runModalAnimate());
        };
        rebuildN();
        fN.addBinding(lim, "max", { label: "tope (máx)", min: mp.max ?? 60, max: 600, step: 10 })
          .on("change", () => rebuildN());
      }
    }

    // Selector dinámico de modo — el usuario gira el slider y la animación
    // cambia al nuevo modo en tiempo real.
    fModal.addBinding(animCtrl, "modeIdx", {
      label: "Modo #", min: 1, max: 60, step: 1,
    }).on("change", (e) => {
      if (!lastModalResults) return;
      modalAnimator.setMode(Math.round(e.value) - 1);
    });

    // Status LIVE (readonly) — single source of truth = Tweakpane
    fModal.addBinding(status, "mode", { readonly: true, view: "text", interval: 0, label: "Modo" } as any);
    fModal.addBinding(status, "frequency", { readonly: true, view: "text", interval: 0, label: "Frecuencia" } as any);
    fModal.addBinding(status, "period", { readonly: true, view: "text", interval: 0, label: "Período" } as any);
    fModal.addBinding(status, "dominant", { readonly: true, view: "text", interval: 0, label: "Dominante" } as any);
    fModal.addBinding(status, "state", { readonly: true, view: "text", interval: 0, label: "Estado" } as any);

    fModal.addButton({ title: "⏹ Detener y restaurar" }).on("click", () => {
      // stop() cancela el RAF + restaura los nodos originales + fuerza un render
      // inmediato del viewer (el canvas se actualiza al momento, sin esperar el
      // siguiente evento reactivo que congelaba la deformada).
      modalAnimator.stop();
    });
    fModal.addButton({ title: "▶ Reanudar" }).on("click", () => {
      if (lastModalResults) modalAnimator.play();
    });
  }
  currentPane = pane;
  // Aplicar visibilidad dinamica de bindings (hiddenIf) en el render inicial.
  // Sin esto, todos los params hiddenIf se muestran al cargar (solo se ocultan
  // tras el primer cambio de slider).
  applyHiddenBindings();

  // Restaurar el scroll vertical capturado antes del dispose. El layout del
  // pane Tweakpane se completa a lo largo de varios frames (folders se
  // expanden/colapsan, contenido async). Estrategia: múltiples intentos a
  // distintos tiempos + ResizeObserver para captar el momento en que el
  // contenido alcanza su altura final.
  const restoreScroll = () => {
    if (prevScrollTop > 0) paneHost.scrollTop = prevScrollTop;
    if (prevInnerScrollTop > 0) {
      const scroller = paneHost.querySelector(".tp-dfwv") as HTMLElement | null;
      if (scroller) scroller.scrollTop = prevInnerScrollTop;
    }
  };
  restoreScroll();
  requestAnimationFrame(restoreScroll);
  requestAnimationFrame(() => requestAnimationFrame(restoreScroll));
  setTimeout(restoreScroll, 0);
  setTimeout(restoreScroll, 50);
  setTimeout(restoreScroll, 150);
  // ResizeObserver: cuando paneHost cambia de tamaño (Tweakpane termina de
  // renderizar sus folders) restaurar el scroll. Cleanup a los 500 ms.
  try {
    const ro = new ResizeObserver(restoreScroll);
    ro.observe(paneHost);
    setTimeout(() => ro.disconnect(), 500);
  } catch {}
}

// ── Settings del viewer ──
// Default shellResults = "pressure" — presión de contacto Winkler, patrón similar
// a displacementZ (centro = max compresión = azul; bordes = mínima = rojo) con auto-escala.
const settingsObj: Record<string, any> = {
  deformedShape: true,
  displayScale: -3,         // default -3 (markers/arrows pequeños — no dominan modelo)
  shellResults: "pressure",
  // 30 m de lado, no 10: una planta corriente (la rejilla de ejemplo mide
  // 24x15) se salia de la plataforma del grid y se dibujaba en el vacio.
  gridSize: 30,
  showCotas: true,
};

// ── Build UI ──
// SIN WebGL el workspace se quedaba EN NEGRO, entero. `getViewer` crea el
// renderer de three.js y, si el navegador no puede dar un contexto WebGL,
// tira "Error creating WebGL context" — una excepción que subía hasta acá y
// mataba TODO lo que se arma después: el Tweakpane, el panel de comandos, la
// tabla modal. Y nada de eso necesita WebGL para funcionar.
//
// Visto en una máquina con el proceso de GPU roto (`GL_VENDOR = Disabled`,
// `Sandboxed = yes`, `BindToCurrentSequence failed`): la página cargaba, el
// fondo se pintaba, y no aparecía un solo control. Sin mensaje: había que
// abrir la consola para enterarse.
//
// Ahora el visor se arma aparte: si falla, se avisa EN PANTALLA y el resto de
// la interfaz se construye igual — se puede correr el modal, ver la tabla de
// participación de masa y copiarla, aunque no se vea el modelo en 3D.
let viewerElm: HTMLElement;
try {
  viewerElm = getViewer({
    mesh: { nodes, elements, nodeInputs, elementInputs, deformOutputs, analyzeOutputs },
    objects3D,
    settingsObj,
    // Drawing nativo de hekatan-ui (awatif). Mouse handler + raycaster + snap
    // a grid + plane indicator funcionan automáticamente. Solo activo en cad-draw.
    drawingObj: {
      points: drawingPoints,
      polylines: drawingPolylines,
      areas: drawingAreas,
      gridTarget: drawingGridTarget,
    },
  }) as HTMLElement;
} catch (err: any) {
  console.error("getViewer falló (¿WebGL no disponible?):", err);
  const aviso = document.createElement("div");
  aviso.id = "hk-sin-webgl";
  aviso.style.cssText = `position:absolute; inset:0; display:flex; align-items:center;
    justify-content:center; padding:32px; color:#e8c07a; background:#15161a;
    font:14px/1.7 ui-monospace,Consolas,monospace; text-align:center;`;
  aviso.innerHTML = `<div style="max-width:640px">
    <div style="font-size:17px; color:#ef4444; margin-bottom:10px">⚠ Tu navegador no pudo crear un contexto WebGL</div>
    <div>El <b>visor 3D queda deshabilitado</b>, pero el resto sí funciona: podés correr
    el análisis, abrir la tabla de modos y copiarla.</div>
    <div style="margin-top:12px; color:#9aa1ad">Suele ser la aceleración por hardware del
    navegador. Mirá <code>edge://gpu</code> o <code>chrome://gpu</code> → «Problems Detected».</div>
    <div style="margin-top:10px; color:#6b7280; font-size:12px">${String(err?.message || err).slice(0, 160)}</div>
  </div>`;
  viewerElm = aviso;
}

// ── Hook OrbitControls "start": detectar primera interacción manual ──
// Una vez que el usuario hace pan/zoom/orbit, `userCameraInteracted` queda
// en `true` hasta que cambie el ejemplo (loadExample lo resetea). Esto evita
// que el rebuild() de cada slider recentre la cámara.
{
  const _ctx: any = (viewerElm as any).__ctx;
  if (_ctx?.controls) {
    _ctx.controls.addEventListener("start", () => { userCameraInteracted = true; });
  }
}

// ═══════════════════════════════════════════════════════════════
// ── ✦ PLANOS DE REFERENCIA: transparencia + SIGUEN tu click ─────
// El panel CAD (addCadPanel de hekatan-ui) usa el global
// __hekatanShowRefPlanes para mostrar los planos de ref. (Z=0,3,6,9,12).
// Lo interceptamos para: (1) atenuarlos a opacidad < grilla, y (2) recordar
// su tamaño/niveles para poder RE-CENTRARLOS en cada click de dibujo.
// Local a workspace3 — no toca hekatan-ui ni el workspace original.
// ═══════════════════════════════════════════════════════════════
(() => {
  const w = window as any;
  const origShow = w.__hekatanShowRefPlanes;
  const origHide = w.__hekatanHideRefPlanes;
  if (typeof origShow !== "function") { console.warn("[refPlanes] __hekatanShowRefPlanes no disponible"); return; }
  const REF_OPACITY = 0.14; // < grilla mayor (0.40) → más transparente
  let lastLevels: number[] = [0, 3, 6, 9, 12];
  let lastSize = 20;
  const dim = () => {
    const cx: any = (viewerElm as any).__ctx;
    if (!cx?.scene) return;
    cx.scene.traverse((o: any) => {
      if ((o.isLine || o.isLineSegments) && o.material &&
          Math.abs((o.material.opacity ?? 0) - 0.55) < 0.02) {
        o.material.opacity = REF_OPACITY;
        o.material.needsUpdate = true;
      }
    });
    cx.render?.();
  };
  // Interceptar SHOW: muestra (original) + atenúa + recuerda estado.
  w.__hekatanShowRefPlanes = (levels: number[], size: number, cx: number, cy: number) => {
    if (Array.isArray(levels)) lastLevels = levels;
    if (typeof size === "number") lastSize = size;
    origShow(lastLevels, lastSize, cx ?? 0, cy ?? 0);
    w.__hekatanRefPlanesOn = true;
    dim();
  };
  if (typeof origHide === "function") {
    w.__hekatanHideRefPlanes = () => { origHide(); w.__hekatanRefPlanesOn = false; };
  }
  // Re-centra los planos en (cx, cy) — lo llama el click handler del resaltador.
  w.__hekatanRecenterRefPlanes = (cx: number, cy: number) => {
    if (!w.__hekatanRefPlanesOn) return;
    w.__hekatanShowRefPlanes(lastLevels, lastSize, cx, cy);
  };
})();

// ═══════════════════════════════════════════════════════════════
// ── ✦ RESALTADOR DE NODOS DEL GRID (workspace3) — primer paso ───
// Al pasar el cursor por una intersección de la grilla (planta XY),
// dibuja un marcador brillante (anillo ámbar + punto) EXACTO sobre
// ese nodo: así sabés que el click caería justo ahí. Independiente
// de la herramienta CAD activa. Local a workspace3 — NO toca el
// workspace original ni hekatan-ui.
// ═══════════════════════════════════════════════════════════════
(() => {
  const ctx: any = (viewerElm as any).__ctx;
  if (!ctx?.scene || !ctx?.camera) { console.warn("[gridHL] __ctx no disponible"); return; }
  const scene: THREE.Scene = ctx.scene;
  const render = () => ctx.render?.();

  // Marcador: anillo + punto central, ámbar brillante, siempre encima.
  const hl = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.05, 0.062, 32),
    new THREE.MeshBasicMaterial({ color: 0xffc400, transparent: true, opacity: 0.95, side: THREE.DoubleSide, depthTest: false }),
  );
  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffc400, depthTest: false }),
  );
  hl.add(ring, dot);
  hl.renderOrder = 9999;
  hl.frustumCulled = false;
  hl.visible = false;
  scene.add(hl);

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hitPt = new THREE.Vector3();
  const getCanvas = () => viewerElm.querySelector("canvas") as HTMLCanvasElement | null;

  // Tamaño aparente CONSTANTE en pantalla (no crece/encoge al zoom) y
  // anillo orientado de frente a la cámara (billboard).
  // Tamaño en PÍXELES (CSS) constante — no depende de zoom, distancia ni DPI.
  // En vez de fórmulas ortográfica/perspectiva (frágiles con HiDPI), MEDIMOS
  // empíricamente cuántos px de pantalla ocupa 1 metro proyectando el punto del
  // marcador y el mismo punto desplazado 1 m hacia la derecha de la cámara.
  // Eso captura zoom, fov, distancia y devicePixelRatio de una sola vez.
  const RING_OUTER_AT_SCALE1 = 0.062; // radio exterior del anillo con scale=1
  const TARGET_RING_PX = 3;           // radio exterior deseado en pantalla (px CSS)
  const _pa = new THREE.Vector3();
  const _pb = new THREE.Vector3();
  const _right = new THREE.Vector3();
  const fitScale = () => {
    const cam = ctx.camera;
    const cv = getCanvas();
    const w = cv?.clientWidth || 800;
    const h = cv?.clientHeight || 600;
    _right.set(1, 0, 0).applyQuaternion(cam.quaternion); // derecha de la cámara
    _pa.copy(hl.position).project(cam);
    _pb.copy(hl.position).add(_right).project(cam); // +1 m a la derecha
    const ax = (_pa.x * 0.5 + 0.5) * w, ay = (-_pa.y * 0.5 + 0.5) * h;
    const bx = (_pb.x * 0.5 + 0.5) * w, by = (-_pb.y * 0.5 + 0.5) * h;
    const pxPerMeter = Math.hypot(bx - ax, by - ay) || 1;
    const worldPerPixel = 1 / pxPerMeter;
    const s = (worldPerPixel * TARGET_RING_PX) / RING_OUTER_AT_SCALE1;
    hl.scale.setScalar(Math.max(0.0005, s));
    hl.quaternion.copy(cam.quaternion); // anillo de frente a la cámara
  };

  // Paso de la grilla VISIBLE (líneas menores). Es exactamente donde
  // están las intersecciones que el usuario ve.
  const gridStep = (): number => {
    const s = ctx.settings;
    return s?.gridStep?.rawVal ?? s?.cursorSnap?.rawVal ?? 0.5;
  };

  // Planos de grilla candidatos (pasan por el origen, donde está la grilla del
  // viewer). Se consideran SOLO los que están activos en Settings
  // (Plano XY/XZ/YZ → settings.gridXY/gridXZ/gridYZ).
  const workPlane = new THREE.Plane();
  const tmp = new THREE.Vector3();
  const _PN_X = new THREE.Vector3(1, 0, 0);
  const _PN_Y = new THREE.Vector3(0, 1, 0);
  const _PN_Z = new THREE.Vector3(0, 0, 1);
  const planeDefs: { axis: "x" | "y" | "z"; n: THREE.Vector3 }[] = [
    { axis: "z", n: new THREE.Vector3(0, 0, 1) }, // XY (planta)
    { axis: "y", n: new THREE.Vector3(0, 1, 0) }, // XZ (frontal)
    { axis: "x", n: new THREE.Vector3(1, 0, 0) }, // YZ (lateral)
  ];
  const enabledAxes = (): Set<string> => {
    const s = ctx.settings;
    const out = new Set<string>();
    if (s?.gridXY?.rawVal) out.add("z");
    if (s?.gridXZ?.rawVal) out.add("y");
    if (s?.gridYZ?.rawVal) out.add("x");
    if (out.size === 0) out.add("z"); // fallback: planta
    return out;
  };

  // En 3D/iso hay varios planos de grilla a la vista. Raycast a TODOS los
  // activos y elegimos el que el cursor realmente señala = el hit más cercano
  // a la cámara, DENTRO de la extensión visible de la grilla. Después buscamos
  // la INTERSECCIÓN de grilla más próxima y SOLO resaltamos si el cursor está
  // dentro de la "zona imán" del nodo (snap real estilo CAD): el marcador
  // aparece al acercarte a una intersección y se oculta en el medio de la
  // celda. Así "resalta" claramente cuando estás sobre un nodo del grid.
  const onMove = (e: PointerEvent) => {
    const c = getCanvas(); if (!c) return;
    const r = c.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, ctx.camera);
    // PLANO DE TRABAJO activo = el MISMO plano sobre el que la app dibuja
    // (intersectWorkPlane). Así RESALTE = DIBUJO, sin discrepancia en iso.
    //   xy (planta)   → normal Z, Z = workZ
    //   xz (frontal)  → normal Y, Y = 0
    //   yz (lateral)  → normal X, X = 0
    const wpName = (window as any).__hekatanCadState?.get?.()?.workPlane || "xy";
    const tgt = (window as any).__hekatanDrawingGridTarget?.val?.position || [0, 0, 0];
    let coord = 0;
    if (wpName === "xz") { workPlane.set(_PN_Y, 0); coord = tgt[1] || 0; }
    else if (wpName === "yz") { workPlane.set(_PN_X, 0); coord = tgt[0] || 0; }
    else { workPlane.set(_PN_Z, 0); coord = tgt[2] || 0; }
    workPlane.constant = -coord;
    if (!raycaster.ray.intersectPlane(workPlane, hitPt)) {
      if (hl.visible) { hl.visible = false; render(); } return;
    }
    // snap al MISMO paso que usa la app al hacer click (__hekatanSnap2D)
    const snap = (window as any).__hekatanSnap2D ?? gridStep();
    const sn = (v: number) => (snap > 0 ? Math.round(v / snap) * snap : v);
    let sx = sn(hitPt.x), sy = sn(hitPt.y), sz = sn(hitPt.z);
    if (wpName === "xz") sy = coord; else if (wpName === "yz") sx = coord; else sz = coord;
    hl.position.set(sx, sy, sz);
    hl.visible = true;
    fitScale();
    render();
  };
  const onLeave = () => { if (hl.visible) { hl.visible = false; render(); } };

  viewerElm.addEventListener("pointermove", onMove);
  viewerElm.addEventListener("pointerleave", onLeave);
  // Mantener tamaño/orientación al orbitar o hacer zoom (recalcula px → world).
  ctx.controls?.addEventListener?.("change", () => { if (hl.visible) { fitScale(); render(); } });

  // ── CLICK → los planos de referencia SIGUEN tu click ──────────────────
  // Si los planos de referencia están activos, al hacer click (no arrastrar)
  // los re-centramos en el nodo resaltado: su centro geométrico se mueve a
  // donde clickeás, para dibujar relativo a ese punto.
  let _downX = 0, _downY = 0;
  viewerElm.addEventListener("pointerdown", (e: PointerEvent) => { _downX = e.clientX; _downY = e.clientY; });
  viewerElm.addEventListener("pointerup", (e: PointerEvent) => {
    if (Math.hypot(e.clientX - _downX, e.clientY - _downY) > 5) return; // fue orbit/drag
    if (!(window as any).__hekatanRefPlanesOn) return;                  // planos no activos
    if (!hl.visible) return;                                            // sin nodo bajo el cursor
    (window as any).__hekatanRecenterRefPlanes?.(hl.position.x, hl.position.y);
  });

  // ── OCULTAR el RELLENO de los PLANOS ORTOGONALES (refFill XY/XZ/YZ) ──
  // hekatan-ui rellena estos planos (verde/rojo/azul). Son ENORMES (extent
  // 8 m) y dimensionados en MUNDO → al hacer zoom in su relleno CUBRE TODA LA
  // VENTANA con un tinte de color (aunque sea tenue). El plano sigue indicado
  // por su BORDE/contorno, así que ocultamos solo el RELLENO (opacity 0). Mi
  // listener corre DESPUÉS del de hekatan-ui → nuestro cap gana.
  const ORTHO_FILL_COLORS = new Set([0x34d399, 0xff3344, 0x60a5fa]); // XY, XZ, YZ
  let _orthoFills: any[] = [];
  const findOrthoFills = () => {
    _orthoFills = [];
    ctx.scene.traverse((o: any) => {
      if (o.isMesh && o.material && o.material.transparent &&
          ORTHO_FILL_COLORS.has(o.material.color?.getHex?.())) {
        _orthoFills.push(o);
      }
    });
  };
  const capOrthoFills = () => {
    if (_orthoFills.length < 3) findOrthoFills();
    let changed = false;
    for (const m of _orthoFills) {
      if (m.material && m.material.opacity > 0) {
        m.material.opacity = 0; m.material.needsUpdate = true; changed = true;
      }
    }
    if (changed) render();
  };

  // ── ACHICAR los MARCADORES DE CURSOR de hekatan-ui ──
  // hekatan-ui dibuja varios marcadores de cursor dimensionados en MUNDO que
  // CRECEN al hacer zoom in / con Display scale alto:
  //   • hover de nodo  (#ffaa00, esfera r=1, + cruz de ejes RGB)
  //   • snapMarker     (esfera + halo #fbbf24/#ff3344 + cruz de ejes RGB)
  // Un "marcador de cursor" = Grupo con ≥1 esfera + ≥3 líneas (cruz de ejes).
  // Los mantenemos a tamaño CONSTANTE en pantalla escalando su grupo. Se
  // re-aplica en los eventos que cambian la proyección: mousemove, zoom/orbit
  // (controls) y resize/MAXIMIZAR. NO los ocultamos — son parte del cursor.
  // (Mi anillo de snap #ffc400 NO tiene cruz de ejes → no se toca; ya es
  // constante por su propio fitScale.)
  const CURSOR_TARGET_PX = 7; // radio en pantalla del marcador de referencia
  const _hwp = new THREE.Vector3();
  const _hrt = new THREE.Vector3();
  const clampCursorMarkers = () => {
    const c2: any = (viewerElm as any).__ctx;
    const scene = c2?.scene, cam = c2?.camera;
    if (!scene || !cam) return;
    const cv = getCanvas();
    const w = cv?.clientWidth || 800, h = cv?.clientHeight || 600;
    let changed = false;
    scene.traverse((grp: any) => {
      if (grp.type !== "Group" || !grp.children) return;
      const spheres = grp.children.filter((c: any) => c.geometry?.type === "SphereGeometry");
      const lines = grp.children.filter((c: any) => c.isLine || c.isLineSegments);
      if (spheres.length < 1 || lines.length < 3) return; // no es marcador de cursor
      const R = Math.max(...spheres.map((s: any) => s.geometry.parameters?.radius || 0.01));
      if (!(R > 0) || R > 2) return; // marcadores de cursor son chicos (r≤2)
      grp.updateWorldMatrix(true, false);
      _hwp.setFromMatrixPosition(grp.matrixWorld);
      _hrt.set(1, 0, 0).applyQuaternion(cam.quaternion);
      const a = _hwp.clone().project(cam);
      const b = _hwp.clone().add(_hrt).project(cam);
      const pxPerM = Math.hypot((b.x - a.x) * 0.5 * w, (b.y - a.y) * 0.5 * h) || 1;
      const s = (CURSOR_TARGET_PX / pxPerM) / R; // escala del grupo → R≈CURSOR_TARGET_PX px
      if (s > 0 && isFinite(s) && Math.abs(grp.scale.x - s) > 1e-6) {
        grp.scale.setScalar(s); changed = true;
      }
    });
    if (changed) render();
  };
  // Un solo listener de pointermove para clamp del cursor.
  // (capOrthoFills se removió: ahora QUEREMOS ver los planos de referencia
  //  tenues como guía de dibujo — antes les forzaba opacidad 0.)
  viewerElm.addEventListener("pointermove", () => { clampCursorMarkers(); });

  // ── DIBUJO DETERMINISTA EN ISO: click solo sobre el PLANO DE TRABAJO ──
  // La app (drawing.ts/intersectWorkPlane) raycastea, además del plano de
  // trabajo `plane`, los planos XZ/YZ extra (flags = settings.gridXZ/YZ). En
  // iso el rayo engancha el XZ aunque el plano de trabajo sea XY → el click
  // cae en coords equivocadas. Forzamos esos raycast-planes APAGADOS, así el
  // click cae SOLO en el plano de trabajo activo (el mesh `plane`, que ya
  // sigue al workPlane). NO afecta la grilla VISIBLE (eso es settings.gridXZ;
  // estos flags solo controlan los planos invisibles de raycast). Para dibujar
  // en otra orientación se cambia el Plano de trabajo (XY/XZ/YZ).
  const forceSinglePlaneRaycast = () => {
    // Planos de raycast PRIORITY 2 (grids XZ/YZ).
    (window as any).__hekatanGridPlaneXZ = false;
    (window as any).__hekatanGridPlaneYZ = false;
    // Planos ortogonales del último punto (refFillXY/XZ/YZ): que NO intercepten
    // el rayo, así el click cae SOLO en el plano de trabajo y no en el plano
    // equivocado en iso. Desacople hecho en drawing.ts/intersectWorkPlane.
    (window as any).__hekatanOrthoRaycast = false;
    // ⚠️ Aquí NO se toca la VISIBILIDAD de esos planos, que es harina de otro
    // costal. Esta función se dispara en cada `pointermove` y `pointerdown` en
    // fase de CAPTURA, así que ponía `__hekatanShowOrthoPlanes = true` unas
    // cien veces por segundo: ganaba siempre, y el default del panel y el
    // propio botón "▦ Planos ref. ortogonales" no servían de nada. Se apagaba
    // el flag, se reconstruía, y los tres planos de color seguían saliendo
    // sobre el lienzo vacío. Lo que arregla el clic es el `orthoRaycast` de
    // arriba; enseñarlos no hacía falta para eso.
  };
  forceSinglePlaneRaycast();
  // Re-asegurar en cada interacción (la app los re-setea desde settings al
  // togglear grids). Capture-phase para ganar antes del handler de la app.
  viewerElm.addEventListener("pointermove", forceSinglePlaneRaycast, true);
  viewerElm.addEventListener("pointerdown", forceSinglePlaneRaycast, true);
  // Zoom / orbit (cambia px↔mundo) y maximizar/resize de ventana.
  ctx.controls?.addEventListener?.("change", clampCursorMarkers);
  window.addEventListener("resize", clampCursorMarkers);
})();

// ═══════════════════════════════════════════════════════════════
// ── ⌨ LÍNEA DE COMANDOS estilo AutoCAD (workspace3) ─────────────
// Tipeás un comando (line, l, node, n, circle, c, rec, area, col…) + Enter y
// se activa la herramienta — igual que AutoCAD. Empezás a tipear letras en
// cualquier lado y se enfoca sola. Usa __hekatanCadState.setTool (lo mismo que
// los botones del panel CAD). Local a workspace3.
// ═══════════════════════════════════════════════════════════════
(() => {
  // ═══════════════════════════════════════════════════════════════════════
  // LA VENTANA DE COMANDOS, como la de AutoCAD (8-sep-2026)
  //
  // Antes era una casilla sola: se tecleaba y no se sabía ni qué comando iba
  // ni qué punto pedía, y el mensaje de estado quedaba TAPADO por la propia
  // casilla (las dos iban centradas abajo). Ahora:
  //   · HISTORIAL: las últimas líneas (F2 o el triángulo lo despliegan).
  //   · PROMPT: «LÍNEA Precise punto siguiente o [Cerrar/desHacer]:», que lo
  //     dicta drawing.ts desde su estado (__hekatanCadPrompt); las opciones
  //     entre corchetes se pueden CLICAR.
  //   · Enter o Espacio ejecutan; vacíos, terminan el comando en curso o
  //     REPITEN el último (como AutoCAD). ↑/↓ recorren lo tecleado.
  //   · Las letras se acumulan y manda el Enter (L, PL, REC, COL…): ya no hay
  //     teclas que actúen solas, que era lo que se comía las coordenadas.
  //   · Los dígitos 1-4 cambian la vista solo sin herramienta y caja vacía.
  // ═══════════════════════════════════════════════════════════════════════
  // ── Comandos de AutoCAD que aquí todavía NO están ────────────────────────
  // Sacados de su `acad.pgp` (C:\Users\…\AutoCAD 2027\R26.0\enu\Support), no de
  // memoria: 221 alias de 1-3 letras, de los que Hekatan entiende 20. Quien viene
  // de AutoCAD teclea los suyos, y responder «desconocido» no ayuda a nadie: se
  // dice QUÉ es y con qué se hace hoy lo mismo.
  const ACAD_FALTA: Record<string, [string, string]> = {
    mi: ["MIRROR (simetría)", "todavía no; copie y mueva, o dibuje el otro lado"],
    ro: ["ROTATE (girar)", "todavía no; vuelva a dibujar con las coordenadas giradas"],

    sc: ["SCALE (escalar)", "todavía no; vuelva a dibujar con las medidas nuevas"],
    f: ["FILLET (empalme)", "todavía no; use RECORTAR (TR) y ALARGAR (EX)"],
    cha: ["CHAMFER (chaflán)", "todavía no; use RECORTAR (TR) y ALARGAR (EX)"],
    x: ["EXPLODE (descomponer)", "aquí cada tramo ya es independiente: no hace falta"],
    j: ["JOIN (unir)", "todavía no; dibuje la polilínea de una vez (PL)"],
    br: ["BREAK (partir)", "todavía no; use RECORTAR (TR)"],
    len: ["LENGTHEN (alargar por longitud)", "use ALARGAR (EX) hasta un contorno"],
    la: ["LAYER (capas)", "aquí no hay capas: cada elemento sabe qué es (columna, viga, losa)"],
    h: ["HATCH (sombreado)", "aquí el color lo pone el resultado del cálculo (colormap)"],
    b: ["BLOCK (bloque)", "todavía no"],
    i: ["INSERT (insertar bloque)", "todavía no"],
    di: ["DIST (medir)", "todavía no; la barra de abajo canta las coordenadas y la longitud al dibujar"],
    aa: ["AREA (medir área)", "todavía no"],
    me: ["MEASURE (dividir por distancia)", "todavía no; use «Div. vigas» en el panel"],
    div: ["DIVIDE (dividir en n)", "todavía no; use «Div. vigas» en el panel"],
    el: ["ELLIPSE (elipse)", "todavía no; hay CÍRCULO (C) y ARCO (A)"],
    spl: ["SPLINE", "todavía no; use POLILÍNEA (PL)"],
    pol: ["POLYGON (polígono regular)", "todavía no; use POLILÍNEA (PL)"],
    ml: ["MLINE (línea múltiple)", "todavía no; use DESFASE (O)"],
    mt: ["MTEXT (texto)", "aquí no se rotula: el modelo se acota solo"],
    t: ["MTEXT (texto)", "aquí no se rotula: el modelo se acota solo"],
    dt: ["TEXT (texto)", "aquí no se rotula: el modelo se acota solo"],
    d: ["DIMSTYLE (acotación)", "las cotas las pone el visor: Ajustes → Cotas"],
    dli: ["DIMLINEAR (cota)", "las cotas las pone el visor: Ajustes → Cotas"],
    pe: ["PEDIT (editar polilínea)", "todavía no"],
    ch: ["PROPERTIES (propiedades)", "seleccione el elemento: sus datos salen en el panel"],
    pr: ["PROPERTIES (propiedades)", "seleccione el elemento: sus datos salen en el panel"],
    mo: ["PROPERTIES (propiedades)", "seleccione el elemento: sus datos salen en el panel"],
    ma: ["MATCHPROP (igualar propiedades)", "todavía no"],
    g: ["GROUP (agrupar)", "todavía no"],
    un: ["UNITS (unidades)", "las unidades van en el panel: Unidades"],
    op: ["OPTIONS (opciones)", "los ajustes están en el panel de la izquierda"],
    re: ["REGEN (regenerar)", "no hace falta: la vista se refresca sola"],
    p: ["PAN (encuadrar)", "arrastre con el botón derecho o la rueda; Z encuadra todo"],
    xl: ["XLINE (línea auxiliar infinita)", "hay LÍNEA AUXILIAR en el panel (aux)"],
  };
  const ALIASES: Record<string, string> = {
    line: "line", l: "line", linea: "line", "línea": "line",
    node: "node", n: "node", point: "node", po: "node", punto: "node", nodo: "node", nudo: "node",
    area: "area", shell: "area", "área": "area", losa: "area", lo: "area",
    rectarea: "rectarea", ra: "rectarea", "rectárea": "rectarea", arearect: "rectarea", losarect: "rectarea",
    polyarea: "polyarea", pa: "polyarea", "polígono": "polyarea", poligono: "polyarea",
    arealibre: "polyarea", "área-libre": "polyarea", freearea: "polyarea",
    plane3: "plane3", ucs: "plane3", plano3: "plane3", inclinar: "plane3", incline: "plane3",
    polyline: "polyline", pline: "polyline", pl: "polyline", polilinea: "polyline", "polilínea": "polyline",
    rectangle: "rect", rec: "rect", rectang: "rect", rectangulo: "rect", "rectángulo": "rect", rect: "rect",
    circle: "circle", c: "circle", circ: "circle", circulo: "circle", "círculo": "circle",
    arc: "arc", a: "arc", arco: "arc",
    column: "col", col: "col", columna: "col", k: "col",
    wall: "wall", w: "wall", muro: "wall", pared: "wall", mu: "wall",
    move: "move", m: "move", mover: "move", desplazar: "move",
    copy: "copy", co: "copy", cp: "copy", copiar: "copy",
    erase: "delete", e: "delete", del: "delete", delete: "delete", borrar: "delete",
    select: "select", sel: "select", s: "select", seleccionar: "select",
    aux: "aux", xline: "aux", auxline: "aux", auxiliar: "aux", auxp: "auxp", auxpoint: "auxp",
    extend: "extend", ex: "extend", alargar: "extend", al: "extend", prolongar: "extend",
    trim: "trim", tr: "trim", recortar: "trim", recorta: "trim",
    offset: "offset", o: "offset", desfase: "offset", df: "offset", desfasar: "offset", equidistancia: "offset",
    axis: "axis", eje: "axis", ax: "axis",
    chamfer: "chaflan", chaflan: "chaflan", chaf: "chaflan", slab: "chaflan",
  };
  const TOOL_LABEL: Record<string, string> = {
    line: "／ Línea", node: "● Nudo", area: "▦ Losa 4 clics", polyline: "⌒ Polilínea",
    rectarea: "▭ Losa rectangular", polyarea: "⬡ Área libre", plane3: "◣ Plano inclinado",
    rect: "▭ Rectángulo", circle: "○ Círculo", arc: "⌒ Arco", col: "▌ Columna",
    wall: "▥ Muro", delete: "🗑 Borrar", select: "🖱 Seleccionar",
    move: "✥ Mover", copy: "⧉ Copiar",
    aux: "┊ Línea auxiliar", auxp: "✦ Punto auxiliar", extend: "↦ Alargar", trim: "✂ Recortar", offset: "⇉ Desfase",
    axis: "📐 Eje", chaflan: "▱ Losa con chaflanes",
  };
  const TOOL_CANON: Record<string, string> = {
    line: "line", node: "node", area: "losa", polyline: "polyline", rect: "rectangle",
    rectarea: "rectarea", polyarea: "polyarea", plane3: "plane3",
    circle: "circle", arc: "arc", col: "column", wall: "wall", delete: "delete",
    select: "select", move: "move", copy: "copy", aux: "auxline", auxp: "auxpoint", extend: "extend", trim: "trim", offset: "offset",
    axis: "axis", chaflan: "chamfer",
  };
  // Comandos que no son herramientas del motor: rejilla, apoyo, carga, deshacer…
  const ESPECIALES: Record<string, { canon: string; run: () => void; eco: string }> = {};
  const especial = (canon: string, alias: string[], eco: string, run: () => void) => {
    for (const a of [canon, ...alias]) ESPECIALES[a] = { canon, run, eco };
  };
  especial("rejilla", ["rej", "grid", "g"], "REJILLA — ejes, niveles y columnas en los cruces",
    () => (window as any).__hekatanRibbon?.grid?.());
  especial("apoyo", ["ap", "support", "empotrar"], "APOYO — clic sobre los nudos",
    () => (window as any).__hekatanRibbon?.usar?.("apoyo"));
  especial("carga", ["cg", "load", "fuerza"], "CARGA — clic sobre los nudos",
    () => (window as any).__hekatanRibbon?.usar?.("carga"));
  especial("deshacer", ["u", "undo"], "DESHACER", () => {
    if (!(window as any).__hekatanCadOption?.("u")) (window as any).__hekatanUndo?.();
  });
  especial("rehacer", ["redo", "y"], "REHACER", () => (window as any).__hekatanRedo?.());
  especial("cerrar", ["close"], "CERRAR la polilínea", () => (window as any).__hekatanCadOption?.("c"));
  // DESIGNAR TODO: la opción «all» de la designación de AutoCAD, el Select All de ETABS.
  // Encerrar el modelo con una ventana deja fuera lo que no quepa en pantalla, y para
  // replicar un piso hay que cogerlo entero.
  especial("ultimo", ["last", "ult"], "DESIGNAR el último objeto dibujado", () => {
    const n = (window as any).__hekatanSelectLast?.() ?? 0;
    flash(n ? "✓ Designado el último objeto dibujado" : "✕ Todavía no hay nada dibujado", !!n);
  });
  especial("todo", ["all", "designartodo", "seltodo"], "DESIGNAR TODO el modelo", () => {
    const n = (window as any).__hekatanSelectAll?.() ?? 0;
    flash(n ? `✓ Designados ${n} objetos (todo el modelo)` : "✕ No hay nada que designar", !!n);
  });
  especial("zoom", ["encuadre", "ze", "fit", "z", "e-zoom"], "ZOOM Extensión", () => (window as any).__hekatanAutoFit?.());
  especial("planta", ["top"], "VISTA planta", () => (window as any).__hekatanRibbon?.vista?.(0));
  especial("frente", ["front"], "VISTA frente", () => (window as any).__hekatanRibbon?.vista?.(1));
  especial("lado", ["side"], "VISTA lado", () => (window as any).__hekatanRibbon?.vista?.(2));
  especial("3d", ["iso"], "VISTA 3D", () => (window as any).__hekatanRibbon?.vista?.(3));
  especial("orto", ["ortho"], "ORTO", () => (window as any).__hekatanToggleOrtho?.());
  especial("polar", [], "POLAR", () => (window as any).__hekatanTogglePolar?.());
  especial("osnap", ["refent", "os", "ds", "se"], "OSNAP", () => (window as any).__hekatanToggleOsnap?.());
  especial("snap", ["forzcursor", "sn"], "SNAP a la rejilla", () => (window as any).__hekatanToggleSnap?.());
  especial("ayuda", ["help", "?"], "AYUDA — cómo usar", () => (window as any).__hekatanRibbon?.guia?.(true));
  especial("fin", ["end", "terminar"], "FIN del trazo", () => (window as any).__hekatanFinalizeDraw?.());
  const ALL_CANON = [...new Set([...Object.values(TOOL_CANON), ...Object.values(ESPECIALES).map((e) => e.canon)])];

  // ── DOM: la ventana (historial + prompt + casilla), fija abajo-centro ────
  const bar = document.createElement("div");
  bar.id = "hk3-cmdline";
  bar.style.cssText = [
    "position:fixed", "left:50%", "bottom:30px", "transform:translateX(-50%)",
    "z-index:99999", "width:min(760px, 92vw)",
    "display:flex", "flex-direction:column",
    "background:rgba(15,23,42,0.96)", "border:1px solid #22d3ee",
    "border-radius:7px", "padding:0",
    "font-family:Consolas,monospace", "font-size:12px",
    "box-shadow:0 4px 14px rgba(0,0,0,0.5)",
    "pointer-events:auto",
  ].join(";") + ";";
  const hist = document.createElement("div");
  hist.id = "hk3-cmd-hist";
  hist.style.cssText = [
    "max-height:54px", "overflow-y:auto", "padding:4px 8px 2px",
    "color:#7f9cae", "line-height:17px", "white-space:pre-wrap",
    "border-bottom:1px solid #1e3a4a", "scrollbar-width:thin",
  ].join(";") + ";";
  const fila = document.createElement("div");
  fila.style.cssText = "display:flex;align-items:center;gap:6px;padding:3px 6px 4px;";
  const bHist = document.createElement("button");
  bHist.type = "button";
  bHist.title = "Historial de comandos (F2)";
  bHist.textContent = "▲";
  bHist.style.cssText = "width:18px;height:20px;padding:0;border:none;background:transparent;color:#4a6a7a;cursor:pointer;font-size:10px;";
  const label = document.createElement("span");
  label.id = "hk3-cmd-prompt";
  label.textContent = "Comando:";
  label.style.cssText = "color:#22d3ee;font-weight:bold;white-space:nowrap;";
  const ops = document.createElement("span");
  ops.id = "hk3-cmd-ops";
  ops.style.cssText = "color:#94a3b8;white-space:nowrap;";
  const input = document.createElement("input");
  input.type = "text";
  input.id = "hk3-cmd-input";
  input.placeholder = "L línea · PL · REC · C · COL · MU · LO · M mover · CO copiar · O desfase · TR recortar · EX alargar · E borrar · ? ayuda";
  input.autocomplete = "off";
  input.spellcheck = false;
  const cmdWrap = document.createElement("div");
  cmdWrap.id = "hk3-cmd-wrap";
  cmdWrap.style.cssText = [
    "position:relative", "display:inline-block", "flex:1",
    "background:#0a1622", "border:1px solid #1e3a4a", "border-radius:5px",
    "height:26px", "min-width:120px",
  ].join(";") + ";";
  const baseTxt = "padding:4px 8px;font-family:Consolas,monospace;font-size:13px;line-height:18px;white-space:pre;box-sizing:border-box;";
  input.style.cssText = baseTxt + "background:transparent;border:none;color:#cdeefb;width:100%;height:100%;outline:none;position:relative;z-index:2;";
  const ghost = document.createElement("div");
  ghost.id = "hk3-cmd-ghost";
  ghost.style.cssText = baseTxt + "position:absolute;left:0;top:0;width:100%;height:100%;color:#4a6a7a;pointer-events:none;z-index:1;overflow:hidden;";
  cmdWrap.appendChild(ghost);
  cmdWrap.appendChild(input);
  fila.append(bHist, label, ops, cmdWrap);
  bar.append(hist, fila);
  document.body.appendChild(bar);

  // ── Historial ────────────────────────────────────────────────────────────
  let histAbierto = false;
  const abrirHist = (v?: boolean) => {
    histAbierto = v ?? !histAbierto;
    hist.style.maxHeight = histAbierto ? "240px" : "54px";
    bHist.textContent = histAbierto ? "▼" : "▲";
    hist.scrollTop = hist.scrollHeight;
  };
  bHist.addEventListener("click", () => abrirHist());
  const echo = (txt: string, clase = "") => {
    const t = String(txt ?? "").split("   |   ")[0].trim();
    if (!t) return;
    const ultimo = hist.lastElementChild as HTMLElement | null;
    if (ultimo && ultimo.dataset.t === t) return;        // el mismo mensaje seguido, una vez
    const d = document.createElement("div");
    d.dataset.t = t;
    d.textContent = t;
    if (clase === "cmd") d.style.color = "#cdeefb";
    else if (clase === "err") d.style.color = "#fb7185";
    else if (clase === "ok") d.style.color = "#34d399";
    hist.appendChild(d);
    while (hist.children.length > 300) hist.removeChild(hist.firstChild!);
    hist.scrollTop = hist.scrollHeight;
  };
  (window as any).__hekatanCadEcho = (txt: string) => echo(txt);
  echo("Hekatan Struct — ventana de comandos. Teclee un comando y Enter; ? o F1 para la ayuda.");

  // ── Prompt (lo dicta drawing.ts) y opciones clicables ────────────────────
  let opcionesActuales: string[] = [];
  // al aparecer opciones hay que colocar el panel una vez junto al cursor y dejarlo quieto
  let anclarPendiente = false;
  const setPrompt = (txt: string, opciones: string[] = []) => {
    label.textContent = txt || "Comando:";
    opcionesActuales = opciones;
    ops.innerHTML = "";
    if (opciones.length) {
      ops.appendChild(document.createTextNode("["));
      opciones.forEach((o, i) => {
        const b = document.createElement("span");
        // la letra del comando en mayúscula, como AutoCAD: Cerrar → C, desHacer → H
        const letra = o.match(/[A-ZÁÉÍÓÚ]/)?.[0]?.toLowerCase() ?? o[0].toLowerCase();
        b.textContent = o;
        b.title = `teclee ${letra.toUpperCase()} + Enter`;
        b.style.cssText = "color:#22d3ee;cursor:pointer;text-decoration:underline dotted;";
        b.addEventListener("click", () => { run(letra === "h" ? "u" : letra); setCmdText(""); });
        ops.appendChild(b);
        if (i < opciones.length - 1) ops.appendChild(document.createTextNode("/"));
      });
      ops.appendChild(document.createTextNode("]:"));
    }
    // el Dynamic Input pegado al cursor repite el prompt sin el nombre del comando
    const corto = txt.replace(/^[A-ZÁÉÍÓÚÑ0-9 ]+ /, "").replace(/:$/, "");
    dynPrompt.textContent = corto.length > 44 ? corto.slice(0, 42) + "…" : corto;
    // …y las MISMAS opciones, aquí sí clicables
    if (opciones.length && !dynOps.childElementCount) anclarPendiente = true;
    dynOps.innerHTML = "";
    dynOps.style.display = opciones.length ? "flex" : "none";
    for (const o of opciones) {
      const letra = o.match(/[A-ZÁÉÍÓÚ]/)?.[0]?.toLowerCase() ?? o[0].toLowerCase();
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o;
      b.title = `${o} — o teclee ${letra.toUpperCase()} + Enter`;
      b.style.cssText = "background:#0e2a38;border:1px solid #22d3ee;border-radius:4px;color:#22d3ee;" +
        "font:11px Consolas,monospace;padding:1px 7px;cursor:pointer;line-height:15px;";
      b.addEventListener("mouseenter", () => { b.style.background = "#164e63"; });
      b.addEventListener("mouseleave", () => { b.style.background = "#0e2a38"; });
      // `mousedown` y no `click`: el lienzo escucha el clic para poner un punto,
      // y con `click` el punto se colocaba igualmente detrás del botón.
      b.addEventListener("mousedown", (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        run(letra === "h" ? "u" : letra);
        setCmdText("");
      });
      dynOps.appendChild(b);
    }
  };
  (window as any).__hekatanCadPrompt = setPrompt;

  const flash = (msg: string, ok: boolean) => {
    echo(msg, ok ? "ok" : "err");
    label.style.color = ok ? "#34d399" : "#fb7185";
    setTimeout(() => { label.style.color = "#22d3ee"; }, 900);
  };

  // ── Ejecutar ─────────────────────────────────────────────────────────────
  const tecleados: string[] = [];
  let iHist = -1;
  let ultimoComando = "";
  const toolActual = () => (window as any).__hekatanCadState?.get?.()?.tool ?? "select";
  const activarTool = (tool: string) => {
    (window as any).__hekatanCadState?.setTool?.(tool);
    (window as any).__hekatanCadResetPending?.();
    (window as any).__hekatanRectSelectExplicit = (tool === "select");
    const st = document.getElementById("hk-cad-status");
    const lbl = TOOL_LABEL[tool] ?? tool;
    if (st) { st.textContent = `${lbl} activo (por comando)`; (window as any).__hekatanRefreshStatus?.(); }
    (window as any).__hekatanRibbon?.marcar?.(tool);
    (window as any).__hekatanCadRefreshPrompt?.();
  };
  // ── REPLICAR — el «Replicate» de ETABS y el ARRAY de AutoCAD ─────────────
  // El motor ya estaba (`__hekatanReplicateSelection`), pero solo se llegaba a él
  // por los campos del panel. Aquí va como COMANDO, que es como se usa en ETABS,
  // SAP2000 y AutoCAD, y en una sola línea si se quiere:
  //   REP 0,0,3.2         una copia 3.20 m más arriba
  //   REP 0,0,3.2 2       dos copias (el 2.º y el 3.er piso)
  //   REP piso 3.2 2      lo mismo, diciendo «piso» (sube en Z)
  //   REP                 pregunta el desplazamiento y las copias, paso a paso
  // Y con dos puntos (desde–hasta) sigue estando COPIAR (CO), como el COPY de AutoCAD.
  const REP_NOMBRES = new Set(["replicar", "rep", "ar", "array", "matriz"]);
  let repEsperando: null | "delta" | "copias" | "p1" | "p2" = null;
  let repDelta: [number, number, number] = [0, 0, 0];
  let repP1: [number, number, number] = [0, 0, 0];
  const repSeleccion = () => (window as any).__hekatanSelectionSize?.() ?? -1;
  const repHacer = (d: [number, number, number], n: number) => {
    const hechas = (window as any).__hekatanReplicateSelection?.(d[0], d[1], d[2], n);
    if (!hechas) {
      flash("✕ REPLICAR: no hay nada designado. Designe objetos (S o ventana) y repita.", false);
      return;
    }
    flash(`✓ Replicado ×${n} — Δ (${d[0]}, ${d[1]}, ${d[2]}) m`, true);
  };
  /** Lee «0,0,3.2», «piso 3.2» o «3.2» (que se entiende como subir en Z). */
  const repLeerDelta = (txt: string): [number, number, number] | null => {
    const t = txt.trim().toLowerCase().replace(/^(piso|planta|story|arriba)\s*/, "");
    const v = t.split(/[,;\s]+/).filter(Boolean).map(Number);
    if (v.some((q) => !isFinite(q))) return null;
    if (v.length === 1) return [0, 0, v[0]];        // una cifra = subir esa altura
    if (v.length === 2) return [v[0], v[1], 0];
    if (v.length >= 3) return [v[0], v[1], v[2]];
    return null;
  };

  // Escape cancela la pregunta de REPLICAR. El gancho `__hekatanEscapeCancel` ya se
  // llamaba desde el cuadro de comandos, pero NADIE lo definía: al pulsar Esc la
  // pregunta seguía viva y el comando siguiente se leía como su respuesta («zzz»
  // contestaba al desplazamiento en vez de salir «desconocido»).
  // ¿Hay un comando esperando respuesta? Lo consulta el ribbon para no robarle las
  // teclas 1-4 (sus vistas) al cuadro de comandos mientras se contesta.
  (window as any).__hekatanCadEsperaRespuesta = () => !!repEsperando;

  (window as any).__hekatanEscapeCancel = () => {
    if (!repEsperando) return false;
    repEsperando = null;
    flash("REPLICAR cancelado", false);
    (window as any).__hekatanCadRefreshPrompt?.();
    return true;
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    echo(`${label.textContent} ${raw.trim()}`, "cmd");
    const tool = toolActual();
    // 1. Opción del prompt en curso: C cierra, U quita el último punto
    if ((tool === "line" || tool === "polyline") && (cmd === "c" || cmd === "u" || cmd === "cerrar" || cmd === "deshacer")) {
      if ((window as any).__hekatanCadOption?.(cmd)) {
        // Cerrar acaba el comando, como en AutoCAD; desHacer sigue en él
        if (cmd === "c" || cmd === "cerrar") activarTool("select");
        return;
      }
    }
    // 1 bis. REPLICAR: o bien en una línea, o preguntando paso a paso
    if (repEsperando) {
      if (cmd === "esc" || cmd === "cancelar") { repEsperando = null; flash("REPLICAR cancelado", false); return; }
      // «P» = dar el desplazamiento con DOS PUNTOS (punto base → segundo punto), que es
      // el «offset a cierto punto» de ETABS y el punto base del COPY de AutoCAD.
      if (repEsperando === "p1") {
        const q = repLeerDelta(raw);
        if (!q) { flash("✕ Punto no válido. Escriba «x,y,z».", false); return; }
        repP1 = q; repEsperando = "p2";
        setPrompt(`REPLICAR — segundo punto (desde ${q[0]}, ${q[1]}, ${q[2]}):`);
        return;
      }
      if (repEsperando === "p2") {
        const q = repLeerDelta(raw);
        if (!q) { flash("✕ Punto no válido. Escriba «x,y,z».", false); return; }
        repDelta = [q[0] - repP1[0], q[1] - repP1[1], q[2] - repP1[2]];
        repEsperando = "copias";
        setPrompt(`REPLICAR Δ (${+repDelta[0].toFixed(4)}, ${+repDelta[1].toFixed(4)}, ${+repDelta[2].toFixed(4)}) m — número de copias <1>:`);
        return;
      }
      if (repEsperando === "delta") {
        const lc0 = raw.trim().toLowerCase();
        if (lc0 === "p" || lc0 === "punto" || lc0 === "2p" || lc0 === "dospuntos") {
          repEsperando = "p1";
          setPrompt("REPLICAR — punto base x,y,z:");
          return;
        }
        const d = repLeerDelta(raw);
        if (!d) { flash("✕ Δ no válido. Escriba «0,0,3.2», o «P» para darlo con dos puntos.", false); return; }
        repDelta = d; repEsperando = "copias";
        setPrompt(`REPLICAR Δ (${d[0]}, ${d[1]}, ${d[2]}) m — número de copias <1>:`);
        return;
      }
      const n = Math.max(1, Math.round(Number(raw.trim()) || 1));
      repEsperando = null;
      repHacer(repDelta, n);
      (window as any).__hekatanCadRefreshPrompt?.();
      return;
    }
    {
      const partes = raw.trim().split(/\s+/);
      const c0 = partes[0].toLowerCase();
      if (REP_NOMBRES.has(c0)) {
        if (repSeleccion() === 0) {
          flash("✕ REPLICAR: primero designe objetos (S, o ventana clic-clic).", false);
          activarTool("select");
          return;
        }
        const resto = partes.slice(1).join(" ");
        if (!resto) {
          repEsperando = "delta";
          setPrompt("REPLICAR — desplazamiento Δx,Δy,Δz (o solo la altura, p. ej. 3.2) [P=dos puntos]:");
          return;
        }
        // «REP P x1,y1,z1 x2,y2,z2 [copias]» — de un punto a otro, en una sola línea
        const mP = resto.match(/^(?:p|punto|2p)\s+(\S+)\s+(\S+)(?:\s+(\d+))?\s*$/i);
        if (mP) {
          const a = repLeerDelta(mP[1]), b = repLeerDelta(mP[2]);
          if (!a || !b) { flash("✕ REPLICAR: puntos no válidos. Uso «REP P 0,0,0 3,0,4 [copias]».", false); return; }
          repHacer([b[0] - a[0], b[1] - a[1], b[2] - a[2]], Math.max(1, parseInt(mP[3] || "1", 10)));
          return;
        }
        const d = repLeerDelta(resto.replace(/\s+\d+$/, ""));
        const mN = resto.match(/(\d+)\s*$/);
        // «rep 0,0,3.2 2» → el último número es el nº de copias, salvo que sea parte del Δ
        const trozos = resto.split(/\s+/);
        const nCopias = trozos.length > 1 && /^\d+$/.test(trozos[trozos.length - 1])
          ? Math.max(1, parseInt(trozos[trozos.length - 1], 10)) : 1;
        const d2 = repLeerDelta(trozos.slice(0, nCopias > 1 ? -1 : undefined).join(" ")) || d;
        if (!d2) { flash("✕ REPLICAR: uso «REP 0,0,3.2 [copias]» o «REP» a secas.", false); return; }
        repHacer(d2, nCopias);
        return;
      }
    }
    // 2. Coordenada o cifra: 1,1,1 · @5,3 · 5<45 · 5 (distancia / altura / radio)
    if (/^@?-?[\d.]/.test(cmd)) {
      const ok = (window as any).__hekatanTypeCoord?.(raw.trim());
      if (ok) { flash("✓ punto colocado", true); (window as any).__hekatanCadRefreshPrompt?.(); return; }
      flash(`✕ «${raw.trim()}» no es una coordenada válida (1,1,1 · @5,3 · 5<45 · 5)`, false);
      return;
    }
    // 3. Comandos que no son herramientas
    const esp = ESPECIALES[cmd];
    if (esp) { ultimoComando = cmd; echo(esp.eco); try { esp.run(); } catch { flash("✕ error", false); } return; }
    // 4. Herramientas
    const t = ALIASES[cmd];
    if (!t) {
      const ac = ACAD_FALTA[cmd];
      if (ac) flash(`ℹ «${cmd.toUpperCase()}» es ${ac[0]} en AutoCAD — ${ac[1]}`, false);
      else flash(`✕ «${cmd}» desconocido. Teclee ? para la ayuda.`, false);
      return;
    }
    ultimoComando = cmd;
    try { activarTool(t); } catch { flash("✕ error", false); }
  };
  (window as any).__hekatanCadRun = run;

  // ── Autocompletar fantasma ───────────────────────────────────────────────
  const suggestFor = (t: string): string => {
    const lc = t.trim().toLowerCase();
    if (!lc || /^@?-?[\d.]/.test(lc)) return "";
    if (ALL_CANON.includes(lc)) return "";
    let cand = ALL_CANON.find((c) => c.startsWith(lc) && c.length > lc.length);
    if (!cand) {
      cand = [...Object.keys(ALIASES), ...Object.keys(ESPECIALES)]
        .filter((k) => k.startsWith(lc) && k.length > lc.length)
        .sort((a, b) => a.length - b.length)[0];
    }
    return cand || "";
  };
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const updateGhostFor = (inp: HTMLInputElement, gh: HTMLElement) => {
    const v = inp.value; const sug = suggestFor(v);
    gh.innerHTML = (sug && v.length)
      ? `<span style="color:transparent">${esc(v)}</span>${esc(sug.slice(v.length))}` : "";
  };

  // ── 2ª consola: Dynamic Input pegada al cursor ───────────────────────────
  const dyn = document.createElement("div");
  dyn.id = "hk-dyn";
  // El panel NO intercepta el ratón (se dibuja debajo de él); solo la fila de
  // opciones lo hace, y solo cuando las hay — ver `dynOps` y `anclado`.
  dyn.style.cssText = [
    "position:fixed", "left:0", "top:0", "z-index:99997", "display:none",
    "flex-direction:column", "align-items:flex-start", "gap:2px",
    "background:rgba(15,23,42,0.92)",
    "border:1px solid #22d3ee", "border-radius:6px", "padding:2px 6px",
    "box-shadow:0 3px 10px rgba(0,0,0,0.5)", "pointer-events:none",
  ].join(";") + ";";
  const dynFila = document.createElement("div");
  dynFila.style.cssText = "display:flex;align-items:center;gap:6px;";
  const dynPrompt = document.createElement("span");
  dynPrompt.id = "hk-dyn-prompt";
  dynPrompt.style.cssText = "color:#22d3ee;font:11px Consolas,monospace;white-space:nowrap;";
  const dynBase = "padding:0 4px;font-family:Consolas,monospace;font-size:12px;line-height:18px;white-space:pre;box-sizing:border-box;";
  const dynWrap = document.createElement("div");
  dynWrap.style.cssText = "position:relative;display:inline-block;width:165px;height:18px;";
  const dynInput = document.createElement("input");
  dynInput.type = "text"; dynInput.id = "hk-dyn-input"; dynInput.autocomplete = "off"; dynInput.spellcheck = false;
  dynInput.style.cssText = dynBase + "background:transparent;border:none;color:#cdeefb;width:100%;height:100%;outline:none;position:relative;z-index:2;pointer-events:none;";
  const dynGhost = document.createElement("div");
  dynGhost.style.cssText = dynBase + "position:absolute;left:0;top:0;width:100%;height:100%;color:#4a6a7a;pointer-events:none;z-index:1;overflow:hidden;";
  dynWrap.append(dynGhost, dynInput);
  dynFila.append(dynPrompt, dynWrap);
  // ── Opciones CLICABLES pegadas al cursor ────────────────────────────────
  // Antes las opciones ([Cerrar/desHacer]) solo se podían pulsar en la barra de
  // abajo: la entrada dinámica las repetía como texto muerto porque el panel
  // entero lleva `pointer-events:none` (si no, taparía el clic de dibujo).
  // Ahora la fila de opciones sí recibe el ratón, y mientras haya opciones el
  // panel se ANCLA (deja de seguir al cursor): si huyera no habría forma de
  // pulsarlas. Es lo que hace AutoCAD con su menú de opciones.
  const dynOps = document.createElement("div");
  dynOps.id = "hk-dyn-ops";
  dynOps.style.cssText = "display:none;gap:6px;pointer-events:auto;font:11px Consolas,monospace;padding-top:1px;";
  dyn.append(dynFila, dynOps);
  document.body.appendChild(dyn);

  let _sync = false;
  const setCmdText = (v: string) => {
    _sync = true;
    input.value = v; dynInput.value = v;
    updateGhostFor(input, ghost); updateGhostFor(dynInput, dynGhost);
    _sync = false;
  };

  // ── Teclado de las dos consolas ──────────────────────────────────────────
  const wireKeys = (inp: HTMLInputElement) => {
    inp.addEventListener("input", () => { if (!_sync) setCmdText(inp.value); });
    inp.addEventListener("keydown", (ev) => {
      const passDel = (ev.key === "Delete" || ev.key === "Backspace") && inp.value.length === 0;
      // F2 (historial), F3/F8/F9/F10 (conmutadores) y Escape suben al resto de la app
      const sube = passDel || /^F(2|3|8|9|10)$/.test(ev.key);
      if (!sube) ev.stopPropagation();
      if (ev.key === "F2") { ev.preventDefault(); abrirHist(); return; }
      const sug = suggestFor(inp.value);
      if ((ev.key === "Tab" || (ev.key === "ArrowRight" && inp.selectionStart === inp.value.length)) && sug) {
        setCmdText(sug); ev.preventDefault(); return;
      }
      if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
        if (!tecleados.length) return;
        ev.preventDefault();
        if (ev.key === "ArrowUp") iHist = iHist < 0 ? tecleados.length - 1 : Math.max(0, iHist - 1);
        else iHist = iHist < 0 ? -1 : Math.min(tecleados.length, iHist + 1);
        setCmdText(iHist >= 0 && iHist < tecleados.length ? tecleados[iHist] : "");
        if (iHist >= tecleados.length) iHist = -1;
        return;
      }
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        const v = inp.value.trim();
        iHist = -1;
        if (!v) {
          // Enter vacío: termina el comando en curso; sin comando, repite el último
          const tool = toolActual();
          if (tool === "polyarea") { (window as any).__hekatanFinalizePolyArea?.(); return; }
          if (tool !== "select" && tool !== "none") { (window as any).__hekatanFinalizeDraw?.(); activarTool("select"); return; }
          if (ultimoComando) { run(ultimoComando); }
          return;
        }
        tecleados.push(v);
        if (tecleados.length > 60) tecleados.shift();
        // Un alias de AutoCAD que aquí no existe (AR, MI, SC…) gana al autocompletado:
        // si no, «ar» se completaba a «área» y el usuario recibía otra herramienta en vez
        // de la explicación. Lo tecleado a propósito manda.
        const lc = v.toLowerCase();
        // Con ESPACIOS la línea lleva argumentos («rep 0,0,3.1»): el autocompletado
        // la recortaba a «rep» y el comando preguntaba el desplazamiento que ya
        // se le había dado. Lo tecleado con argumentos se respeta tal cual.
        const cmd = (v.includes(" ") || ALIASES[lc] || ESPECIALES[lc] || ACAD_FALTA[lc] || REP_NOMBRES.has(lc))
          ? v : (sug || v);
        run(cmd); setCmdText("");
      } else if (ev.key === "Escape") {
        setCmdText(""); inp.blur();
        (window as any).__hekatanEscapeCancel?.();
        ev.preventDefault();
      }
    });
  };
  wireKeys(input);
  wireKeys(dynInput);
  window.addEventListener("keydown", (ev) => {
    if (ev.key === "F2") { ev.preventDefault(); abrirHist(); }
  });

  // ── El prompt sigue a la herramienta: se envuelve setTool ───────────────
  const engancharSetTool = () => {
    const st = (window as any).__hekatanCadState;
    if (!st || st.__conPrompt) return;
    const orig = st.setTool;
    st.setTool = (t: any) => { orig(t); (window as any).__hekatanCadRefreshPrompt?.(); };
    st.__conPrompt = true;
  };
  engancharSetTool();
  setTimeout(engancharSetTool, 800);
  setTimeout(() => (window as any).__hekatanCadRefreshPrompt?.(), 900);

  // ── Foco: la casilla está lista para teclear, salvo que otro mando lo use ─
  // (lo de antes, sin cambios de conducta: no robar el foco a un <select> ni a
  // Tweakpane, ni mientras se escribe una coordenada en #hk-rubber-label)
  let tpInteractUntil = 0, selectFocusUntil = 0;
  const isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
  const inTweakpane = (el: HTMLElement | null): boolean => {
    for (let n: HTMLElement | null = el; n; n = n.parentElement) {
      if (n.tagName === "SELECT") return true;
      const c = n.className;
      if (typeof c === "string" && /(^|\s)tp-/.test(c)) return true;
    }
    return false;
  };
  document.addEventListener("pointerdown", (e) => {
    if (inTweakpane(e.target as HTMLElement | null)) tpInteractUntil = Date.now() + 5000;
  }, true);
  document.addEventListener("focusin", (e) => {
    if ((e.target as HTMLElement | null)?.tagName === "SELECT") selectFocusUntil = Date.now() + 4000;
  }, true);
  const stealBlocked = (): boolean => {
    if (Date.now() < tpInteractUntil || Date.now() < selectFocusUntil) return true;
    const a = document.activeElement as HTMLElement | null;
    return !!(a && a.tagName === "SELECT");
  };
  const keepCmdFocus = () => {
    if (stealBlocked()) return;
    const ae = document.activeElement as HTMLElement | null;
    if (ae && ae !== document.body && ae !== input) return;
    const rl = document.getElementById("hk-rubber-label") as HTMLElement | null;
    if (rl && rl.style.display === "block") return;
    try { input.focus({ preventScroll: true }); } catch {}
  };
  if (!isTouch) {
    input.addEventListener("blur", () => setTimeout(keepCmdFocus, 60));
    setTimeout(keepCmdFocus, 500);
    setInterval(() => {
      const ae = document.activeElement;
      if (!ae || ae === document.body) keepCmdFocus();
    }, 900);
  }
  const isDrawingCoords = () => {
    const rl = document.getElementById("hk-rubber-label") as HTMLElement | null;
    return !!(rl && rl.style.display === "block");
  };
  const esTactil = (e: PointerEvent) => e.pointerType === "touch" || e.pointerType === "pen";
  viewerElm?.addEventListener("pointermove", (e: PointerEvent) => {
    if (esTactil(e)) { dyn.style.display = "none"; return; }
    // Mientras se estira la goma, las coordenadas ya las canta `hk-rubber-label`:
    // el panel sobra… SALVO que haya opciones que pulsar, que es justo cuando las
    // hay ([Cerrar/desHacer] aparecen con la polilínea empezada). Antes se ocultaba
    // siempre y las opciones no se veían nunca junto al cursor. Ahora, dibujando,
    // se enseña SOLO la fila de botones.
    const dibujando = isDrawingCoords();
    if (dibujando && !opcionesActuales.length) { dyn.style.display = "none"; return; }
    dynFila.style.display = dibujando ? "none" : "flex";
    // con opciones a la vista el panel se queda quieto: si siguiera al ratón,
    // el botón se apartaría justo cuando se va a pulsar
    if (anclarPendiente || (dynInput.value.length === 0 && !opcionesActuales.length)) {
      anclarPendiente = false;
      let x = e.clientX + 16, y = e.clientY + 14;
      const w = dyn.offsetWidth || 175, h = dyn.offsetHeight || 24;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 8;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - 8;
      dyn.style.left = Math.max(4, x) + "px";
      dyn.style.top = Math.max(4, y) + "px";
    }
    dyn.style.display = "flex";
    if (stealBlocked()) return;
    const ae = document.activeElement as HTMLElement | null;
    if (ae && ae.tagName === "BUTTON") return;
    if (ae !== dynInput && !(ae && ae.tagName === "INPUT" && ae !== input)) {
      try { dynInput.focus({ preventScroll: true }); } catch {}
    }
  });
  viewerElm?.addEventListener("pointerleave", (e: PointerEvent) => {
    // ⚠️ El panel es hijo de `body`, no del lienzo: ir con el ratón a pulsar una
    // opción SALE del lienzo y dispara esto. Escondiéndolo aquí, el botón se
    // desvanecía justo antes del clic y no llegaba ni un `mousedown` (medido:
    // 0 de 1). Si el ratón va hacia el propio panel, o si hay opciones que
    // pulsar, el panel se queda.
    const hacia = e.relatedTarget as Node | null;
    if (!(hacia && dyn.contains(hacia)) && !opcionesActuales.length) dyn.style.display = "none";
    if (esTactil(e)) return;
    if (stealBlocked()) return;
    try { input.focus({ preventScroll: true }); } catch {}
  });

  // ── Auto-foco al teclear letras, estilo AutoCAD ──────────────────────────
  window.addEventListener("keydown", (ev) => {
    const ae = document.activeElement as HTMLElement | null;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.tagName === "SELECT")) return;
    if (stealBlocked()) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (/^[a-zA-Z@]$/.test(ev.key)) {
      const target = (dyn.style.display !== "none") ? dynInput : input;
      target.focus();
      setCmdText(ev.key);
      ev.preventDefault();
    }
  }, { capture: true });
})();

// ═══════════════════════════════════════════════════════════════
// ── ⎋ ESC = CANCELAR COMANDO (estilo AutoCAD) — workspace3 ──────
// AutoCAD: Esc cancela el comando activo → volvés a "sin comando". La app SOLO
// finalizaba el trazo y te dejaba ATRAPADO en la herramienta (line/circle/…).
// Ahora Esc finaliza el trazo (lo hace el handler bubble de la app) Y sale a
// "Seleccionar" — consistente con el click derecho. Corremos en CAPTURE (antes
// del handler de la app) y dejamos que la app finalice el trazo después.
// ═══════════════════════════════════════════════════════════════
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  // una pregunta de comando abierta (REPLICAR) se cancela aunque el foco esté en el cuadro
  if ((window as any).__hekatanEscapeCancel?.()) return;
  const ae = document.activeElement as HTMLElement | null;
  // El cuadro de comandos NO es «texto que se está editando»: es la línea de órdenes
  // del CAD, y ahí Esc cancela el comando igual que en AutoCAD. Con el foco puesto en
  // él (que es donde queda al teclear un comando) la herramienta seguía activa: tras
  // «PL» + Esc, la «C» siguiente se leía como CERRAR la polilínea en vez de CÍRCULO.
  const esLineaOrdenes = !!ae && (ae.id === "hk3-cmd-input" || ae.id === "hk3-dyn-input");
  if (ae && !esLineaOrdenes && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) return; // editando texto
  const tool = (window as any).__hekatanCadState?.get?.()?.tool;
  if (!tool || tool === "select" || tool === "none") return; // ya en Seleccionar → nada que cancelar
  // Cancelar el comando: volver a Seleccionar (el handler de la app finaliza el
  // trazo en bubble, después de este; los puntos ya dibujados se conservan).
  (window as any).__hekatanCadState?.setTool?.("select");
  (window as any).__hekatanCadResetPending?.();
  const st = document.getElementById("hk-cad-status");
  if (st) { st.textContent = "⎋ Comando cancelado — Seleccionar"; (window as any).__hekatanRefreshStatus?.(); }
}, true);

// ── Inspect: ahora vive dentro de "🛠 Herramientas FEM" (Tweakpane) ──
// El botón Inspect suelto top-center quedó eliminado — usar el folder
// Tweakpane "Herramientas FEM" → "🔍 Inspect" para abrir el panel didáctico.

// ── Sincronizar drawingPoints/polylines a window.__hekatanCliScript ──
// Cada vez que el usuario dibuja un punto o polyline (con mouse en el
// viewer), se regenera el script CLI con sintaxis awatif (bloques
// nodes/elements). Eso hace que el cad-draw y cli-modeler queden
// sincronizados sin código mouse handler custom de mi parte.
van.derive(() => {
  const pts = drawingPoints.val;
  const lines = drawingPolylines.val;
  if (pts.length === 0 && lines.every(l => l.length === 0)) return;
  const out: string[] = [
    "# Modelo dibujado con mouse (Hekatan Drawing)",
    "",
    "nodes",
  ];
  for (const p of pts) out.push(`${p[0]}  ${p[1]}  ${p[2]}`);
  // Polylines → frames consecutivos (cada 2 puntos consecutivos = 1 frame)
  const frames: [number, number][] = [];
  for (const ply of lines) {
    for (let i = 0; i < ply.length - 1; i++) frames.push([ply[i], ply[i+1]]);
  }
  if (frames.length > 0) {
    out.push("", "elements");
    for (const [i, j] of frames) out.push(`${i} ${j}`);
  }
  (window as any).__hekatanCliScript = out.join("\n");
  // Re-corre build() del ejemplo activo si es uno que reacciona a drawing
  // (newBlank, cad-draw, cli-modeler). Lo invocamos via __hekatanRebuild
  // que está expuesto por buildParamsPane (rebuilds el modelo manteniendo
  // los params actuales).
  if (currentExample && (
    currentExample.id === "new-blank" ||
    currentExample.id === "cad-draw" ||
    currentExample.id === "cli-modeler"
  )) {
    try { (window as any).__hekatanRebuild?.(); } catch {}
  }
});
document.body.append(
  viewerElm,
  getToolbar({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal",
    author: "https://www.linkedin.com/in/jorge-burbano-213741138/",
  })
);
document.body.appendChild(modalPanel.div);

// ═══════════════════════════════════════════════════════════════
// ── 🛠 HEKATAN FEM TOOLS — orquestador unificado en hekatan-ui
// Los singletons lazy (Inspect, Modal+, Calc, CLI, Log, Report) viven en
// `hekatan-ui/src/femTools/`. El folder Tweakpane se agrega via
// `attachFemTools(pane, ctx)` en buildParamsPane().
// ═══════════════════════════════════════════════════════════════
// (IIFE legacy removida — ahora se usa attachFemTools(pane, ctx) desde hekatan-ui/femTools)
// ═══════════════════════════════════════════════════════════════
// ── HOVER TOOLTIP GLOBAL para shell results en cualquier ejemplo ──
// Al pasar el cursor sobre un shell Q4, busca por raycast el elemento
// y muestra el valor del campo activo (pressure / bendingXX / vonMises /
// displacementZ etc.) interpolado en el nodo más cercano.
// Funciona para zapata-aislada, edificio-aporticado solo cimentación,
// shell-thick, plate-q4, losas, etc. — cualquier mesh con shells.
// ═══════════════════════════════════════════════════════════════
(function setupShellHoverTooltip() {
  const tooltip = document.createElement("div");
  tooltip.id = "shell-hover-tooltip";
  Object.assign(tooltip.style, {
    position: "fixed",
    pointerEvents: "none",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "6px 10px",
    fontSize: "12px",
    fontFamily: "system-ui, monospace",
    border: "1px solid #22d3ee",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    zIndex: "9999",
    display: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
  });
  document.body.appendChild(tooltip);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Etiquetas legibles para cada campo de shellResults
  const FIELD_LABELS: Record<string, string> = {
    pressure: "σ (presión)",
    bendingXX: "Mxx (flexión)",
    bendingYY: "Myy (flexión)",
    bendingXY: "Mxy (torsión)",
    membraneXX: "Nxx (membrana)",
    membraneYY: "Nyy (membrana)",
    membraneXY: "Nxy (corte)",
    shearX: "Vx (corte)",
    shearY: "Vy (corte)",
    vonMises: "von Mises",
    displacementX: "ux",
    displacementY: "uy",
    displacementZ: "uz",
  };
  // Tipo de cada campo según unidades:
  //   force/m² → pressure, vonMises (1/m²)
  //   moment/m → bending* (kN·m/m → tonf·m/m)
  //   force/m → membrane*, shear* (kN/m → tonf/m)
  //   disp → displacement* (m → mm/cm/m/in)
  const FIELD_KIND: Record<string, "force_per_area"|"moment_per_length"|"force_per_length"|"displacement"> = {
    pressure: "force_per_area",
    bendingXX: "moment_per_length",
    bendingYY: "moment_per_length",
    bendingXY: "moment_per_length",
    membraneXX: "force_per_length",
    membraneYY: "force_per_length",
    membraneXY: "force_per_length",
    shearX: "force_per_length",
    shearY: "force_per_length",
    vonMises: "force_per_area",
    displacementX: "displacement",
    displacementY: "displacement",
    displacementZ: "displacement",
  };
  // Convierte el valor SI base (kN, kN·m, m) a la unidad UI activa
  // y devuelve [valor_convertido, sufijo_unidad].
  const formatValue = (kind: string, valSI: number): [number, string] => {
    const u = forceUnit.val;
    const du = dispUnit.val;
    if (kind === "force_per_area") {
      return [fromKn(valSI), `${u}/m²`];
    }
    if (kind === "moment_per_length") {
      const lbl = u === "kip" ? "kip·ft/m" : `${u}·m/m`;
      return [fromKnm(valSI), lbl];
    }
    if (kind === "force_per_length") {
      return [fromKn(valSI), `${u}/m`];
    }
    if (kind === "displacement") {
      return [mToDisp(valSI), du];
    }
    return [valSI, ""];
  };

  const onPointerMove = (event: PointerEvent) => {
    const ctx = (viewerElm as any).__ctx;
    const settings = (viewerElm as any).__settings;
    if (!ctx?.scene || !ctx?.camera) { tooltip.style.display = "none"; return; }
    const field = settings?.shellResults?.val ?? "none";
    // NOTA: ya NO retornamos cuando field === "none" — el tooltip se muestra
    // SIEMPRE que el cursor esté sobre un shell, con o sin colormap activo.
    // Cuando no hay field activo, mostramos solo info estructural (sección, nodo, Δ).
    // Convert mouse to NDC respecto al canvas del viewer
    const canvas = viewerElm.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) { tooltip.style.display = "none"; return; }
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, ctx.camera);
    // Buscar shell meshes EXACTOS en la escena.
    // Filtro estricto: solo meshes marcados con userData.isShellArea = true
    // (shellMesh y colorMap). Esto EXCLUYE:
    //   - Cilindros 3D de frames (Sec.Columnas/Vigas)
    //   - Markers de supports/loads
    //   - Solids H8
    // Sin este filtro, el cursor sobre un cilindro de frame se reportaba como Shell.
    const targets: THREE.Mesh[] = [];
    ctx.scene.traverse((o: any) => {
      if (!o.isMesh || !o.geometry?.attributes?.position) return;
      if (!o.userData?.isShellArea) return;   // SOLO áreas shell marcadas
      if (!o.visible) return;                  // mesh oculta no debe contar
      const count = o.geometry.attributes.position.count;
      if (count < 3) return;
      targets.push(o);
    });
    if (!targets.length) { tooltip.style.display = "none"; (window as any).__hekatanShellTooltipVisible = false; return; }
    const hits = raycaster.intersectObjects(targets, false);
    if (!hits.length) { tooltip.style.display = "none"; (window as any).__hekatanShellTooltipVisible = false; return; }
    const hit = hits[0];
    // Obtener el ÍNDICE del elemento Q4 a partir del face index
    const faceIdx = hit.faceIndex ?? 0;
    // `faceIdx / 2` solo vale si TODOS los elementos son Q4 y estan todos en la malla. Las barras
    // no ponen triangulos y un T3 pone uno: en el dual (barras + losas + muros intercalados) el
    // tooltip atribuia la cara a otro elemento (Jorge, 6-sep-2026: cursor en la azotea, «Nodo 420»
    // del piso 2). Las mallas guardan el mapa cara -> elemento en userData.faceToElem.
    const faceMap = (hit.object as any)?.userData?.faceToElem as number[] | undefined;
    const elemIdx = faceMap && faceIdx < faceMap.length ? faceMap[faceIdx] : Math.floor(faceIdx / 2);
    // VALIDACIÓN: el elemIdx debe corresponder a un shell REAL del modelo.
    // Si está fuera del rango o el elemento no es shell (length 3 o 4 nodos),
    // ocultar el tooltip — evita "Shell #206 nodos: [?]" cuando el raycaster
    // cae sobre triangulación auxiliar, plano del CAD, o áreas extendidas.
    const elsCheck = elements.rawVal;
    if (elemIdx < 0 || elemIdx >= elsCheck.length) {
      tooltip.style.display = "none";
      (window as any).__hekatanShellTooltipVisible = false;
      return;
    }
    const elemCheck = elsCheck[elemIdx];
    // Solo shells: 3 nodos (CST tri) o 4 nodos (Q4). Frames (2) y solids (8) no.
    if (!elemCheck || (elemCheck.length !== 3 && elemCheck.length !== 4)) {
      tooltip.style.display = "none";
      (window as any).__hekatanShellTooltipVisible = false;
      return;
    }
    // Leer el valor del campo activo del analyzeOutputs (puede ser undefined)
    const ao = analyzeOutputs.rawVal as any;
    const fieldMap = (field !== "none") ? (ao?.[field] as Map<number, number[]> | undefined) : undefined;
    const values = fieldMap?.get(elemIdx);
    // Si no hay field activo o no hay valor, los valores son [0,0,0,0] para no romper interp
    const safeValues = values ?? [0, 0, 0, 0];
    const els = elements.rawVal as Element[];
    const nds = nodes.rawVal as Node[];
    const elNodes = els[elemIdx];
    // ── INTERPOLACIÓN BILINEAL Q4 (estilo ETABS/SAP) ──
    // Inferir las coordenadas naturales (ξ, η) ∈ [-1, 1] del punto del hit
    // dentro del Q4. Usamos solver de Newton-Raphson 2D simple sobre la
    // mapa isoparamétrica x(ξ,η) = Σ N_i(ξ,η)·x_i.
    let valInterp = safeValues[0], xi = 0, eta = 0;
    let closestCorner = 0;
    // ── Punto EXACTO por baricentricas sobre el triangulo pintado (6-sep-2026) ──
    // hit.face.{a,b,c} son los vertices del triangulo que toco el raycaster en la geometria que se
    // DIBUJA (deformada y escalada). Con las baricentricas del punto en ese triangulo salen: el punto
    // SIN deformar (sum w_i X_i), la esquina mas cercana (max w_i) y el valor del campo tal como lo
    // pinta el shader (lineal en el triangulo). Vale igual en muros: el Newton de abajo en (x, y)
    // tiene jacobiano nulo en un plano vertical y daba xi, eta basura; y comparaba el punto
    // deformado con nudos sin deformar (el tooltip decia z=12.06 en una azotea a 12.5).
    let bary: { w: number[]; corners: number[]; punto: [number, number, number] } | null = null;
    const faceLocal = (hit.object as any)?.userData?.faceLocal as number[] | undefined;
    if (hit.face && faceMap && faceLocal && elNodes && hit.point) {
      const posAttr = (hit.object as THREE.Mesh).geometry.attributes.position as THREE.BufferAttribute;
      const V = [hit.face.a, hit.face.b, hit.face.c].map((k) => new THREE.Vector3().fromBufferAttribute(posAttr, k).applyMatrix4(hit.object.matrixWorld));
      const areaOf = (p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3) => q.clone().sub(p).cross(r.clone().sub(p)).length();
      const A = areaOf(V[0], V[1], V[2]);
      if (A > 1e-18) {
        const w = [areaOf(hit.point, V[1], V[2]) / A, areaOf(V[0], hit.point, V[2]) / A, areaOf(V[0], V[1], hit.point) / A];
        const sw = w[0] + w[1] + w[2]; w[0] /= sw; w[1] /= sw; w[2] /= sw;
        const local = faceLocal[faceIdx] ?? 0;
        const corners = elNodes.length === 4 ? (local === 0 ? [0, 1, 2] : [0, 2, 3]) : [0, 1, 2];
        const X = corners.map((c) => nds[elNodes[c]]);
        if (X.every(Boolean)) {
          const punto = [0, 1, 2].map((k) => w[0] * X[0][k] + w[1] * X[1][k] + w[2] * X[2][k]) as [number, number, number];
          bary = { w, corners, punto };
        }
      }
    }
    if (bary) {
      const NAT = elNodes!.length === 4 ? [[-1, -1], [1, -1], [1, 1], [-1, 1]] : [[0, 0], [1, 0], [0, 1]];
      const b = bary;
      xi = b.corners.reduce((s, c, i) => s + b.w[i] * NAT[c][0], 0);
      eta = b.corners.reduce((s, c, i) => s + b.w[i] * NAT[c][1], 0);
      valInterp = b.corners.reduce((s, c, i) => s + b.w[i] * (safeValues[c] ?? 0), 0);
      closestCorner = b.corners[b.w.indexOf(Math.max(...b.w))];
    } else if (elNodes?.length === 4 && hit.point) {
      const corners = elNodes.map(ni => nds[ni]) as [number,number,number][];
      // Funciones de forma N_i(ξ, η) para Q4
      const N = (xi: number, eta: number) => [
        0.25 * (1 - xi) * (1 - eta),
        0.25 * (1 + xi) * (1 - eta),
        0.25 * (1 + xi) * (1 + eta),
        0.25 * (1 - xi) * (1 + eta),
      ];
      // Newton-Raphson para encontrar (ξ, η) tal que x(ξ,η) = hit.point
      // (proyectamos al plano XY del Q4 — válido para shells horizontales)
      const tx = hit.point.x, ty = hit.point.y;
      for (let iter = 0; iter < 8; iter++) {
        const Nv = N(xi, eta);
        const fx = corners.reduce((s, c, i) => s + Nv[i] * c[0], 0) - tx;
        const fy = corners.reduce((s, c, i) => s + Nv[i] * c[1], 0) - ty;
        // Derivadas dN/dξ, dN/dη
        const dNdxi = [-(1-eta), (1-eta), (1+eta), -(1+eta)].map(v => 0.25*v);
        const dNdeta = [-(1-xi), -(1+xi), (1+xi), (1-xi)].map(v => 0.25*v);
        const J11 = corners.reduce((s, c, i) => s + dNdxi[i] * c[0], 0);
        const J12 = corners.reduce((s, c, i) => s + dNdeta[i] * c[0], 0);
        const J21 = corners.reduce((s, c, i) => s + dNdxi[i] * c[1], 0);
        const J22 = corners.reduce((s, c, i) => s + dNdeta[i] * c[1], 0);
        const det = J11*J22 - J12*J21;
        if (Math.abs(det) < 1e-12) break;
        const dxi = (J22*fx - J12*fy) / det;
        const deta = (-J21*fx + J11*fy) / det;
        xi -= dxi; eta -= deta;
        if (Math.abs(dxi) + Math.abs(deta) < 1e-6) break;
      }
      // Clamp ξ, η a [-1, 1] (por si el hit cae en borde)
      xi = Math.max(-1, Math.min(1, xi));
      eta = Math.max(-1, Math.min(1, eta));
      // Interpolación bilineal del valor
      const Nv = N(xi, eta);
      valInterp = safeValues.reduce((s, v, i) => s + Nv[i] * v, 0);
      // El "corner más cercano" en (ξ, η)-space para info
      closestCorner = (xi >= 0 ? (eta >= 0 ? 2 : 1) : (eta >= 0 ? 3 : 0));
    }
    // Render tooltip — convierte SI base → unidad UI activa (forceUnit/dispUnit)
    const hasField = field !== "none" && values != null;
    const lbl = FIELD_LABELS[field] ?? field;
    const kind = FIELD_KIND[field] ?? "force_per_area";
    const [valConv, unit] = formatValue(kind, valInterp);
    // Punto sin deformar si hay baricentricas; si no, el del raycaster (deformado).
    const P = bary?.punto ?? (hit.point ? [hit.point.x, hit.point.y, hit.point.z] : null);
    const xPos = P ? P[0].toFixed(2) : '?';
    const yPos = P ? P[1].toFixed(2) : '?';
    const zPos = P ? P[2].toFixed(2) : '?';

    // ── INFO DE SECCIÓN del shell (lee elementInputs.sectionInfo) ──
    const ei = (window as any).__hekatanElementInputs ?? (ctx as any)?.mesh?.elementInputs?.rawVal;
    const sInfo = (ei as any)?.sectionInfo?.get?.(elemIdx);
    let sectionHTML = "";
    if (sInfo) {
      if (sInfo.name)  sectionHTML += `<br><span style="color:#888;font-size:10px">📋 ${sInfo.name}</span>`;
      if (sInfo.shape) sectionHTML += ` <span style="color:#888;font-size:10px">[${sInfo.shape}]</span>`;
      const isConcrete = /concrete|hormig|rect.*sólida/i.test(sInfo.shape || "");
      const lenF = isConcrete ? 100 : 1000;
      const lenU = isConcrete ? "cm" : "mm";
      const fmtD = (v: number) => Math.abs(v*lenF - Math.round(v*lenF)) < 0.05 ? `${Math.round(v*lenF)}` : `${(v*lenF).toFixed(1)}`;
      const dimParts: string[] = [];
      if (sInfo.t  != null) dimParts.push(`t=${fmtD(sInfo.t)}`);
      if (sInfo.D  != null) dimParts.push(`D=${fmtD(sInfo.D)}`);
      if (sInfo.B  != null) dimParts.push(`B=${fmtD(sInfo.B)}`);
      if (sInfo.TF != null) dimParts.push(`TF=${fmtD(sInfo.TF)}`);
      if (sInfo.TW != null) dimParts.push(`TW=${fmtD(sInfo.TW)}`);
      if (dimParts.length) sectionHTML += `<br><span style="color:#888;font-size:10px">Dim: ${dimParts.join(" ")} ${lenU}</span>`;
      if (sInfo.material) sectionHTML += `<br><span style="color:#888;font-size:10px">Mat: ${sInfo.material}${sInfo.fillMaterial ? ` + FILL "${sInfo.fillMaterial}"` : ""}</span>`;
    }

    // ── EXTENSIÓN: agregar info del nodo más cercano (Δ desplaz + R reacciones) ──
    const elem = elements.val[elemIdx];
    let extraHTML = "";
    if (elem) {
      // Encontrar el nodo más cercano al punto cursor (en world coords)
      let bestNode = -1;
      let bestDist = Infinity;
      // Con baricentricas, la esquina de mayor peso ES el nudo mas cercano (sin mezclar deformado y sin deformar).
      if (bary && elem[closestCorner] !== undefined) bestNode = elem[closestCorner];
      for (const ni of (bestNode >= 0 ? [] : elem)) {
        const n = nodes.val[ni];
        if (!n || !hit.point) continue;
        const dx = n[0] - hit.point.x;
        const dy = n[1] - hit.point.y;
        const dz = n[2] - hit.point.z;
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < bestDist) { bestDist = d2; bestNode = ni; }
      }
      if (bestNode >= 0) {
        const def = deformOutputs.val;
        const dispU  = (window as any).__hekatanDispUnit ?? "mm";
        const forceU = (window as any).__hekatanForceUnit ?? "tonf";
        const dF = { mm: 1000, cm: 100, m: 1, in: 39.3700787402 }[dispU as string] ?? 1000;
        const fF = { kN: 1, tonf: 1/9.80665, kip: 1/4.4482216 }[forceU as string] ?? 1/9.80665;
        const u = def?.deformations?.get(bestNode);
        if (u) {
          const dParts: string[] = [];
          if (Math.abs(u[0]) > 1e-12) dParts.push(`Ux=${(u[0]*dF).toFixed(3)} ${dispU}`);
          if (Math.abs(u[1]) > 1e-12) dParts.push(`Uy=${(u[1]*dF).toFixed(3)} ${dispU}`);
          if (Math.abs(u[2]) > 1e-12) dParts.push(`Uz=${(u[2]*dF).toFixed(3)} ${dispU}`);
          if (dParts.length === 0) dParts.push(`Ux=Uy=Uz=0`);
          extraHTML += `<br><span style="color:#888;font-size:10px">Nodo ${bestNode}:</span> <span style="color:#ffd166;font-size:11px;">${dParts.join(" · ")}</span>`;
          if (Math.abs(u[3]) > 1e-9 || Math.abs(u[4]) > 1e-9 || Math.abs(u[5]) > 1e-9) {
            extraHTML += `<br><span style="color:#ffd166;font-size:11px;">Rx=${(u[3]*1000).toFixed(3)} Ry=${(u[4]*1000).toFixed(3)} Rz=${(u[5]*1000).toFixed(3)} mrad</span>`;
          }
        }
        const r = def?.reactions?.get(bestNode);
        if (r && (Math.abs(r[0]) > 1e-9 || Math.abs(r[1]) > 1e-9 || Math.abs(r[2]) > 1e-9
                  || Math.abs(r[3]) > 1e-6 || Math.abs(r[4]) > 1e-6 || Math.abs(r[5]) > 1e-6)) {
          const rParts: string[] = [];
          if (Math.abs(r[0]) > 1e-6) rParts.push(`Fx=${(r[0]*fF).toFixed(3)}`);
          if (Math.abs(r[1]) > 1e-6) rParts.push(`Fy=${(r[1]*fF).toFixed(3)}`);
          if (Math.abs(r[2]) > 1e-6) rParts.push(`Fz=${(r[2]*fF).toFixed(3)}`);
          extraHTML += `<br><span style="color:#888;font-size:10px">Reacción:</span> <span style="color:#ff8888;font-size:11px;">${rParts.join(" ")} ${forceU}</span>`;
        }
      }
    }

    let mainHTML: string;
    if (hasField) {
      // Con shell result activo: mostrar campo + valor + interpolación
      mainHTML =
        `<b>${lbl}</b> <span style="color:#888;font-size:10px">(interpolado)</span><br>` +
        `Valor: <span style="color:#22d3ee;font-size:14px;">${valConv.toFixed(3)} ${unit}</span><br>` +
        `Punto cursor: (${xPos}, ${yPos}, ${zPos}) m<br>` +
        `Elem #${elemIdx} · ξ=${xi.toFixed(2)}, η=${eta.toFixed(2)}<br>` +
        `Esquina ${closestCorner}: ${formatValue(kind, (values?.[closestCorner] ?? 0))[0].toFixed(3)} ${unit}`;
    } else {
      // Sin shell result activo: solo info estructural del shell
      mainHTML =
        `<b>Shell #${elemIdx}</b><br>` +
        `Punto cursor: (${xPos}, ${yPos}, ${zPos}) m<br>` +
        `nodos: [${elem?.join(", ") ?? "?"}]`;
    }
    tooltip.innerHTML = mainHTML + sectionHTML + extraHTML;
    tooltip.style.left = `${event.clientX + 12}px`;
    tooltip.style.top = `${event.clientY + 12}px`;
    tooltip.style.display = "block";
    // Suprimir el tooltip pequeño de hover.ts cuando el grande está visible
    (window as any).__hekatanShellTooltipVisible = true;
  };

  const onPointerLeave = () => {
    tooltip.style.display = "none";
    (window as any).__hekatanShellTooltipVisible = false;
  };

  viewerElm.addEventListener("pointermove", onPointerMove);
  viewerElm.addEventListener("pointerleave", onPointerLeave);
  // Exponer al window para test/debug via DOM
  (window as any).__hekatan_hover_tooltip = tooltip;
})();

// Inicializar modal animator AHORA que el viewer ya existe (tiene __ctx.scene/render).
modalAnimator = createModalAnimator({
  mesh: { nodes, elements, deformOutputs, analyzeOutputs },
  viewerElm,
  scalePercent: 5,
});

// ── Hidratar drawing arrays globales desde localStorage si hay import pendiente ──
// El handler de Importar E2K/S2K/F2K guarda el modelo parseado en
// `__hekatan_pending_import__` y navega a ?t=new-blank. Acá lo leemos
// ANTES de que cargue new-blank y populamos los globals que su `build()`
// consume.
try {
  const pending = localStorage.getItem("__hekatan_pending_import__");
  if (pending) {
    const data = JSON.parse(pending);
    (window as any).__hekatanDrawingPoints  = { val: data.nodes ?? [], rawVal: data.nodes ?? [] };
    (window as any).__hekatanDrawingPolylines = { val: data.polylines ?? [], rawVal: data.polylines ?? [] };
    (window as any).__hekatanDrawingAreas   = { val: data.areas ?? [], rawVal: data.areas ?? [] };
    console.log(`[Import] Modelo restaurado desde ${data.source} "${data.filename}": ` +
      `${(data.nodes ?? []).length} nodos, ${(data.polylines ?? []).length} polylines, ${(data.areas ?? []).length} áreas`);
    // Limpiar para que un refresh no re-importe
    localStorage.removeItem("__hekatan_pending_import__");
  }
} catch (e: any) {
  console.warn("[Import] Error restaurando modelo pendiente:", e?.message ?? e);
}

// ── Cargar ejemplo inicial via ?t= o default ──
// Default (sin ?t en URL): "new-blank" — lienzo CAD vacío en categoría
// "Archivo nuevo". El usuario al abrir el workspace ya está parado en
// el lienzo vacío listo para dibujar, sin tener que navegar al ejemplo.
// Backward-compat: ?t=zapata-aislada (legacy) → zapata-aislada-validacion.
let urlT = new URLSearchParams(window.location.search).get("t");
// ?heks= MANDA sobre cualquier ?t=. El workspace se reescribe la URL al
// arrancar y le pega «&t=test-m-dual»; en cuanto se recarga esa pestaña, el
// ?t= ya viene puesto y un guardia sobre «si no hay ?t=» no se entera. Por eso
// aqui se pisa: si llega un modelo por enlace, se arranca con el lienzo VACIO
// y el ejemplo por defecto no compite con el .heks (ganaba el ejemplo).
if (URL_HEKS) {
  urlT = "new-blank";
  try {
    const u = new URL(window.location.href);
    u.searchParams.set("t", urlT);
    window.history.replaceState(null, "", u.toString());
  } catch { /* no-op */ }
}
if (urlT === "zapata-aislada") {
  urlT = "zapata-aislada-validacion";
  try {
    const u = new URL(window.location.href);
    u.searchParams.set("t", urlT);
    window.history.replaceState(null, "", u.toString());
  } catch { /* no-op */ }
}
// Sin ?t= ni modelo por enlace: MENÚ DE ENTRADA. Nada de cargar un ejemplo
// por defecto: el usuario elige entre Nuevo archivo / Archivo existente /
// Ejemplos y recién ahí se abren las herramientas del pane. Con ?heks= el
// modelo llega por enlace y hay que arrancar con el lienzo VACÍO (urlT ya se
// pisó a "new-blank" arriba), así que el menú solo aplica cuando no hay nada.
if (!urlT) {
  showMenu();
} else {
  const initialEx =
    examplesRegistry.find((e) => e.id === urlT) ||
    examplesRegistry.find((e) => e.id === "new-blank") ||
    examplesRegistry[0];
if (initialEx) {
  loadExample(initialEx);
  // `new-blank` NO esta vacio: dibuja un modelo de demostracion (4 nodos, 2
  // columnas, 1 viga). Con modelo por enlace se veia aparecer ese primero y
  // despues el de verdad — parecia que la pagina cargaba tres veces. Se
  // limpia, pero SIN saltarse loadExample: es el que arma el panel, y con el
  // el handler de ?heks= que trae el modelo.
  if (URL_HEKS) {
    states.nodes.val = [];
    states.elements.val = [];
    states.objects3D.val = [];
    states.deformOutputs.val = {};
  }
  // Zapata: vista isométrica por default — se ven los resortes Winkler en elevación
  // comprimidos/extendidos según la deformada (como en croquis clásicos de ingeniería).
  if (initialEx.id === "zapata-aislada" || initialEx.id === "zapata-aislada-validacion" || initialEx.id === "zapata-viga-amarre") {
    setTimeout(() => setView("iso"), 200);
  } else if (initialEx.id === "new-blank") {
    // Por defecto: vista ISOMÉTRICA con plano de trabajo PLANTA (XY). En iso el
    // rayo del cursor cruza bien el plano XY horizontal (no degenera como con
    // XZ visto de canto), así se puede DIBUJAR en 3D desde el arranque y el
    // resalte/click caen en el mismo punto del piso.
    setTimeout(() => {
      const st = (window as any).__hekatanCadState?.get?.();
      if (st) st.workPlane = "xy";
      drawingGridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] };
      setView("iso");
      // Tamaño por defecto de los planos de referencia ortogonales = 2.6 m.
      (window as any).__hekatanSetOrthoExt?.(3.2);
    }, 200);
  }
  // ── Pre-fill desde URL params ──
  // Si vienes de un edificio (?t=zapata-aislada-validacion&P=23.5&Mx=1.2&My=-0.8&from=edificio-aporticado)
  // pre-cargo P_simple/Mx_simple/My_simple y muestro botón "← Volver al edificio".
  const urlParams = new URLSearchParams(window.location.search);
  const urlP = parseFloat(urlParams.get("P") || "");
  const urlMx = parseFloat(urlParams.get("Mx") || "");
  const urlMy = parseFloat(urlParams.get("My") || "");
  const urlFrom = urlParams.get("from");
  if (initialEx.id.startsWith("zapata") && (!isNaN(urlP) || !isNaN(urlMx) || !isNaN(urlMy))) {
    setTimeout(() => {
      if (!isNaN(urlP))  currentParams.P_simple  = urlP;
      if (!isNaN(urlMx)) currentParams.Mx_simple = urlMx;
      if (!isNaN(urlMy)) currentParams.My_simple = urlMy;
      buildParamsPane();
      rebuild();
      console.log(`✅ Zapata pre-cargada desde ${urlFrom || "URL"}: P=${urlP}, Mx=${urlMx}, My=${urlMy}`);
    }, 300);
  }
  }
}
