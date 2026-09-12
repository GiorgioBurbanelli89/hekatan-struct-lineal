import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Node, Mesh } from "hekatan-fem";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Settings,
  SettingsObj,
  getDefaultSettings,
  getSettings,
} from "./settings/getSettings";
import { nodes } from "./objects/nodes";
import { elements } from "./objects/elements";
import { grid } from "./objects/grid";
import { supports } from "./objects/supports";
import { loads } from "./objects/loads";
import { nodesIndexes } from "./objects/nodesIndexes";
import { elementsIndexes } from "./objects/elementsIndexes";
import { axes } from "./objects/axes";
import { orientations } from "./objects/orientations";
import { sections } from "./objects/sections";
import { extrusion } from "./objects/extrusion";
import { frameResults } from "./objects/frameResults";
import { nodeResults } from "./objects/nodeResults";
import { drawing, Drawing } from "./drawing/drawing";
import { shellResults } from "./objects/shellResults";
import { frameColorMap } from "./objects/frameColorMap";
import { setupHover } from "./objects/hover";
import { iniciarDiagrama2D } from "./diagram2d";

import "./styles.css";
import { getLegend } from "../color-map/getLegend";
import { colorMapScope, robustRange } from "../color-map/getColorMap";
import { getTheme, onThemeChange, ThemeColors } from "../theme";

export interface ViewerContext3D {
  scene: THREE.Scene;
  perspCamera: THREE.PerspectiveCamera;
  orthoCamera: THREE.OrthographicCamera;
  camera: THREE.Camera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  rendererElm: HTMLCanvasElement;
  render: () => void;
  setActiveCamera: (cam: THREE.Camera) => void;
  settings: Settings;
}

export function getViewer({
  mesh,
  settingsObj,
  drawingObj,
  objects3D,
  solids,
}: {
  mesh?: Mesh;
  settingsObj?: SettingsObj;
  drawingObj?: Drawing;
  objects3D?: State<THREE.Object3D[]>;
  solids?: State<THREE.Object3D[]>;
}): HTMLDivElement {
  // init
  THREE.Object3D.DEFAULT_UP = new THREE.Vector3(0, 0, 1);

  const viewerElm = document.createElement("div");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    2 * 1e6 // supported view till 1e6
  );
  const orthoCamera = new THREE.OrthographicCamera(-10, 10, 10, -10, -1000, 2e6);
  let activeCamera: THREE.Camera = camera;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.localClippingEnabled = true;
  const controls = new OrbitControls(camera, renderer.domElement);

  // ── Configuración trackpad-friendly (laptop touchpad) ──
  // OrbitControls default: wheel = zoom. En trackpads de laptop, two-finger drag
  // emite wheel events SIN ctrlKey, lo que produce zoom en vez de pan (frustrante).
  // Solución estándar: mapear two-finger drag (wheel sin ctrl) → pan, mantener
  // ctrl+wheel y pinch (con ctrlKey true) → zoom.
  controls.enableDamping = true;          // suaviza movimiento
  controls.dampingFactor = 0.1;
  controls.screenSpacePanning = true;     // pan en plano de pantalla (más natural)
  controls.zoomSpeed = 0.8;
  controls.panSpeed = 1.2;
  controls.rotateSpeed = 0.9;
  controls.keyPanSpeed = 12;
  controls.listenToKeyEvents(window);     // arrow keys → pan (rescate sin trackpad)
  // Touch gestures (en laptops con touchscreen y tablets)
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
  // Custom wheel handler: si NO hay ctrlKey y el deltaX es significativo,
  // tratar como PAN. Si hay ctrlKey o solo deltaY, tratar como ZOOM (default).
  // Esto da soporte a "two-finger swipe" de Mac/Windows trackpads que emiten
  // deltaX != 0 cuando se arrastra horizontalmente con dos dedos.
  renderer.domElement.addEventListener("wheel", (ev: WheelEvent) => {
    // Trackpad horizontal swipe (deltaX dominante) → pan horizontal
    if (!ev.ctrlKey && Math.abs(ev.deltaX) > Math.abs(ev.deltaY) * 1.5) {
      ev.preventDefault();
      const target = controls.target;
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      const right = new THREE.Vector3();
      right.crossVectors(camera.up, offset).normalize();
      const distance = offset.length();
      const factor = distance * 0.001 * controls.panSpeed;
      target.addScaledVector(right, ev.deltaX * factor);
      camera.position.addScaledVector(right, ev.deltaX * factor);
      controls.update();
    }
  }, { passive: false });

  // ── PLANOS DE CORTE (clipping planes X / Y / Z) ──
  // Para visualizar resultados internos de sólidos H8 (bulbo de presiones,
  // distribución de tensiones internas, embedment de pernos, etc.).
  // Cada plano se controla por panel global vía window.__hekatanClip.
  const clipPlaneX = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  const clipPlaneY = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const clipPlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
  // Estado global accesible desde los ejemplos para activar/desactivar
  (window as any).__hekatanClip = (window as any).__hekatanClip ?? {
    enableX: false, enableY: false, enableZ: false,
    posX: 0, posY: 0, posZ: 0,
    invertX: false, invertY: false, invertZ: false,
  };
  function applyClipping() {
    const s = (window as any).__hekatanClip;
    const planes: THREE.Plane[] = [];
    if (s.enableX) {
      clipPlaneX.normal.set(s.invertX ? 1 : -1, 0, 0);
      clipPlaneX.constant = s.invertX ? -s.posX : s.posX;
      planes.push(clipPlaneX);
    }
    if (s.enableY) {
      clipPlaneY.normal.set(0, s.invertY ? 1 : -1, 0);
      clipPlaneY.constant = s.invertY ? -s.posY : s.posY;
      planes.push(clipPlaneY);
    }
    if (s.enableZ) {
      clipPlaneZ.normal.set(0, 0, s.invertZ ? 1 : -1);
      clipPlaneZ.constant = s.invertZ ? -s.posZ : s.posZ;
      planes.push(clipPlaneZ);
    }
    renderer.clippingPlanes = planes;
    // En Three.js renderer.clippingPlanes NO se propaga automáticamente a los
    // materiales — hay que setear material.clippingPlanes en cada material
    // de la escena para que el clipping tenga efecto visual.
    scene.traverse((obj: THREE.Object3D) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          (m as THREE.Material).clippingPlanes = planes;
          (m as THREE.Material).needsUpdate = true;
        }
      }
    });
    // ── SYNC TWEAKPANE DOM ──
    // Cuando se modifica window.__hekatanClip directamente (CLI, programáticamente,
    // desde otro Tweakpane que comparte el mismo objeto), Tweakpane NO detecta el
    // cambio: sus checkboxes/sliders quedan stale. Llamamos pane.refresh() en TODOS
    // los panes registrados para forzar re-lectura de los valores bound.
    const panes: any[] = (window as any).__hekatanPanes ?? [];
    for (const p of panes) {
      try { if (p && typeof p.refresh === "function") p.refresh(); } catch {}
    }
    // Re-render WebGL para reflejar el corte
    renderer.render(scene, activeCamera);
  }
  applyClipping();
  (window as any).__hekatanClipApply = applyClipping;

  const settings = getDefaultSettings(settingsObj);
  // Mapeo slider → escala. Antes era piecewise (s>0 ? s : -1/s) con una
  // discontinuidad en 0 y una zona muerta en el centro: s=-1, s=0 y s=+1 daban
  // TODOS 1, y entre -1 y +1 la escala rebotaba (1→2→1→0.5→1) → el slider
  // "no modificaba la escala" de forma coherente cerca del centro.
  // Ahora 10^(s/10): monótona y continua en todo el rango [-10, 10],
  // conservando los extremos del comportamiento previo (s=-10 → 0.1×,
  // s=0 → 1×, s=+10 → 10×). Cada paso del slider cambia la escala suavemente.
  const derivedDisplayScale = van.derive(() =>
    Math.pow(10, settings.displayScale.val / 10)
  );
  const derivedNodes = deriveNodes(mesh, settings);
  // Helper para construir la lista de planos activos según los toggles.
  // Si todos están OFF, retorna lista vacía → grid totalmente oculto
  // (forma natural de "esconder el grid": destildar XY/XZ/YZ en Settings).
  const activePlanes = (): ("xy" | "xz" | "yz")[] => {
    const out: ("xy" | "xz" | "yz")[] = [];
    if (settings.gridXY.rawVal) out.push("xy");
    if (settings.gridXZ.rawVal) out.push("xz");
    if (settings.gridYZ.rawVal) out.push("yz");
    return out;
  };
  // Helper: opciones del grid derivadas de los settings reactivos.
  // gridStep es el paso de las líneas menores; las mayores se dibujan cada
  // 5× ese valor para destacar cada 5 subdivisiones (convención CAD común).
  // Además, el snap del cursor en drawing.ts lee window.__hekatanSnap2D que
  // sincronizamos abajo con gridStep.
  const gridOptions = () => {
    const minor = settings.gridStep.rawVal;
    // gridMajor ahora es ABSOLUTO en metros (no multiplicador). Permite
    // configuraciones libres como minor=0.5 + major=2 (cada 4 menores hay
    // una mayor) o minor=0.1 + major=1 (cada 10 menores hay una mayor).
    const major = Math.max(minor, settings.gridMajor.rawVal);
    return { planes: activePlanes(), majorStep: major, minorStep: minor };
  };
  let gridObj = grid(settings.gridSize.rawVal, gridOptions());
  gridObj.visible = settings.gridVisible.rawVal;
  // Inicializar snap del cursor — slider INDEPENDIENTE del paso visual
  (window as any).__hekatanSnap2D = settings.cursorSnap.rawVal;
  // Helper: aplica gridOpacity como opacidad ABSOLUTA del grid.
  // Diferenciamos minor (líneas finas, máx 0.35) vs major (líneas gruesas,
  // máx 1.0) por nombre — esto preserva el contraste entre las dos.
  // Sin userData.baseOpacity (más simple y predecible). El slider controla:
  //   1.0 → minor=0.35 / major=1.00 (totalmente visible)
  //   0.5 → minor=0.18 / major=0.50 (medio)
  //   0   → invisible
  const applyGridOpacity = () => {
    const factor = Math.max(0, Math.min(1, settings.gridOpacity.rawVal));
    gridObj.traverse((o: any) => {
      const m = o.material as THREE.Material | undefined;
      if (!m || !("opacity" in m)) return;
      const name = (o.name as string) ?? "";
      // 3 niveles de opacidad — borde > major > minor
      // ⚠️ Subidos el 9-sep-2026. El color de rejilla del tema oscuro es 0x2c3647
      // sobre un fondo casi negro, y la menor iba ADEMÁS a 0.45 de ese color y 0.35
      // de opacidad: se mezclaba con el fondo y no se veía NADA. El lienzo salía
      // vacío y no había sobre qué referenciarse para poner el primer punto.
      let baseMax = 0.55;  // minor
      if (name.includes("border")) baseMax = 1.0;
      else if (name.includes("major")) baseMax = 0.95;
      (m as any).opacity = factor * baseMax;
    });
  };
  applyGridOpacity();

  // update
  viewerElm.appendChild(getSettings(settings, mesh, solids));

  viewerElm.setAttribute("id", "viewer");
  viewerElm.appendChild(renderer.domElement);

  renderer.setPixelRatio(window.devicePixelRatio);
  const theme0 = getTheme();
  renderer.setClearColor(theme0.background, 1);

  const gridSize = settings.gridSize.rawVal;
  const z2fit = gridSize * 0.5 + (gridSize * 0.5) / Math.tan(45 * 0.5);
  // ── Vista DEFAULT = PLANTA (top-down sobre XY) ──
  // Antes era iso pero confundía: el plano XY (horizontal) parecía estar
  // parado como si fuera XZ. Ahora arrancamos en planta — el usuario VE
  // el plano XY como un cuadrado plano frente a sí, y puede cambiar a
  // iso/elevación con los botones de Tweakpane (Vista isométrica, etc.).
  // Cámara directamente sobre el origen mirando hacia abajo (-Z), con +Y
  // como "arriba" de la pantalla (convención CAD planta).
  camera.position.set(0, 0, z2fit);
  camera.up.set(0, 1, 0);  // Y up en screen (CAD convention)
  controls.target.set(0, 0, 0);
  controls.minDistance = 0.1;
  // maxDistance generoso — calculado por gridSize fallaba para modelos grandes
  // (ej: tablero-puente con gridSize=1 daba max=4m, insuficiente para puente 15m).
  // 10000 m permite ver desde puentes hasta edificios completos sin limitar.
  controls.maxDistance = 10000;
  // Expose settings so the workspace Tweakpane can mutate them (e.g. auto-select
  // the default shell result each example wants to show).
  (viewerElm as any).__settings = settings;
  controls.zoomSpeed = 1.0;
  // Normaliza zoom: ignora la magnitud del deltaY del trackpad (que puede ser 100-300+
  // por gesto). Sin esto, un pinch de touchpad colapsa la cámara al 20% en un solo evento.
  (controls as any)._getZoomScale = function () {
    return Math.pow(0.95, this.zoomSpeed);
  };
  controls.update();

  let axesObj = axes(settings.gridSize.rawVal, settings.flipAxes.rawVal);
  scene.add(gridObj, axesObj);

  // ── Sincronizar flags de planos raycast con los toggles de settings ──
  // drawing.ts crea planeXZ/planeYZ invisibles para que el cursor pueda
  // engancharse al plano XZ o YZ cuando estén activos en Settings → Grid.
  // Acá los activamos/desactivamos según los toggles del usuario.
  van.derive(() => {
    (window as any).__hekatanGridPlaneXY = settings.gridXY.val;
    (window as any).__hekatanGridPlaneXZ = settings.gridXZ.val;
    (window as any).__hekatanGridPlaneYZ = settings.gridYZ.val;
  });

  // ── Reactividad de gridSize y flipAxes ──
  // GridHelper y axes hornean la geometría en buffers — no se pueden
  // redimensionar in-place. Cada vez que cambia gridSize (slider Tweakpane
  // "Tamaño grid (m)") o flipAxes, se recrean los meshes y se re-agregan a
  // la escena. Sin esto, mover el slider sólo actualiza el valor interno
  // pero el grid visual queda al tamaño inicial.
  // skipFirst: van.derive corre la función una vez al registrarla; usamos
  // un flag para saltar esa primera ejecución (los meshes ya existen).
  // ── Reactividad de gridVisible y gridOpacity ──
  // Estos no requieren reconstruir geometría — solo flip .visible y mutar
  // opacity de los materiales. Más rápido que el rebuild completo.
  let _skipFirstGridVis = true;
  van.derive(() => {
    const v = settings.gridVisible.val;
    if (_skipFirstGridVis) { _skipFirstGridVis = false; return; }
    gridObj.visible = v;
    viewerRender();
  });
  let _skipFirstGridOp = true;
  van.derive(() => {
    const op = settings.gridOpacity.val;
    void op;
    if (_skipFirstGridOp) { _skipFirstGridOp = false; return; }
    applyGridOpacity();
    viewerRender();
  });
  // ── Reactividad de cursorSnap ──
  // Solo escribe a window.__hekatanSnap2D — drawing.ts lo lee en cada
  // pointermove. No requiere render ni rebuild.
  van.derive(() => {
    const cs = settings.cursorSnap.val;
    (window as any).__hekatanSnap2D = cs;
  });

  let _skipFirstGridDerive = true;
  van.derive(() => {
    // Subscribe a los 5 toggles + tamaño (suficiente para reactividad)
    const gs = settings.gridSize.val;
    const fa = settings.flipAxes.val;
    const xy = settings.gridXY.val;
    const xz = settings.gridXZ.val;
    const yz = settings.gridYZ.val;
    const step = settings.gridStep.val;
    const major = settings.gridMajor.val;
    void xy; void xz; void yz; void step; void major;
    if (_skipFirstGridDerive) { _skipFirstGridDerive = false; return; }
    // Reemplazar grid — ahora es Group (mayor + minor lines), dispose recursivo
    scene.remove(gridObj);
    (gridObj as any).traverse?.((o: any) => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
    gridObj = grid(gs, gridOptions());
    gridObj.visible = settings.gridVisible.rawVal;
    scene.add(gridObj);
    applyGridOpacity();  // re-aplica el factor del slider sobre el nuevo gridObj
    // Reemplazar axes (tamaño = gridSize / 2 por convención awatif)
    scene.remove(axesObj);
    axesObj.traverse((o: any) => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
    axesObj = axes(gs, fa);
    scene.add(axesObj);
    // ── Re-encuadrar la cámara al nuevo grid ──
    // Sin esto, al achicar gridSize el grid queda lejísimo (la cámara se
    // quedó en la posición del gridSize inicial). Calculamos la distancia
    // ISO que enmarca el nuevo grid completo y reposicionamos la cámara
    // SOLO si todavía está cerca del default — si el usuario ya zoomó/orbitó
    // a un punto custom no le pisamos su vista.
    const z2fit2 = gs * 0.5 + (gs * 0.5) / Math.tan(45 * 0.5);
    // Distancia actual de la cámara al target — comparar contra el "default"
    // del gridSize previo para detectar si el user ya movió la vista.
    const curDist = camera.position.distanceTo(controls.target);
    // Reposicionar respetando el modo de vista actual: si la cámara está
    // mirando "directamente desde arriba" (planta), mantener planta. Si
    // está en iso/elevación, recolocar a iso. Detectamos planta cuando la
    // cámara está alineada con +Z y X≈0, Y≈0.
    const isPlan = Math.abs(camera.position.x) < 0.1 && Math.abs(camera.position.y) < 0.1
                   && camera.position.z > 0;
    // ⚠️ SOLO cuando el lienzo está vacío.
    //
    // El comentario de arriba ya decía «reposicionamos SOLO si todavía está cerca del
    // default», pero esa guarda nunca se escribió: se calculaba `curDist` y se tiraba
    // con `void curDist`. Con un modelo en pantalla el resultado era que la cámara se
    // iba al ORIGEN cada vez que la rejilla crecía.
    //
    // Y la rejilla crece sola: al subir «volado perimetral» la losa se sale de la
    // rejilla, el workspace agranda `gridSize`, y esto le robaba el encuadre al
    // `autoFitCamera()` que acababa de enmarcar el modelo. Medido (dual 3x3, 3 pisos,
    // volado 0.25): el modelo está centrado en (6, 6.5, 4.8) y la cámara acababa
    // mirando a (0,0,0) desde 8.5 m — el edificio, fuera de cuadro y gigante. Eso era
    // el «bug visual» al mover el volado con el modal animando.
    const hayModelo = ((mesh?.nodes?.rawVal ?? mesh?.nodes?.val ?? []) as unknown[]).length > 0;
    if (!hayModelo) {
      if (isPlan) {
        camera.position.set(0, 0, z2fit2);
      } else {
        camera.position.set(0.5 * gs, -z2fit2, 0.5 * gs);
      }
      controls.target.set(0, 0, 0);
    }
    // minDistance proporcional al grid (no menos de 0.1m para grids chicos)
    controls.minDistance = Math.max(0.05, gs * 0.01);
    // maxDistance ~50× el grid para que el zoom out tenga aire pero no se
    // pueda perder el modelo en el infinito. 10000m era demasiado generoso.
    controls.maxDistance = Math.max(50, gs * 50);
    controls.update();
    void curDist;  // (silenciar TS si no se usa)
    viewerRender();
  });

  // Events
  // on size change
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.target?.clientWidth;
      const height = entry.target?.clientHeight;
      if (width === 0 || height === 0) continue;

      // En split mode el aspect de la cámara activa es media-pantalla.
      const wActive = splitMode ? width / 2 : width;
      const aspect = wActive / height;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      const frustumHalf = orthoCamera.top;
      orthoCamera.left = -frustumHalf * aspect;
      orthoCamera.right = frustumHalf * aspect;
      orthoCamera.updateProjectionMatrix();

      // splitCamera (panel derecho) también usa media-pantalla aspect
      if (splitCamera && (splitCamera as any).isPerspectiveCamera) {
        (splitCamera as THREE.PerspectiveCamera).aspect = aspect;
        (splitCamera as THREE.PerspectiveCamera).updateProjectionMatrix();
      } else if (splitCamera && (splitCamera as any).isOrthographicCamera) {
        const sCam = splitCamera as THREE.OrthographicCamera;
        const sH = sCam.top;
        sCam.left = -sH * aspect;
        sCam.right = sH * aspect;
        sCam.updateProjectionMatrix();
      }

      renderer.setSize(width, height);
      viewerRender();
    }
  });
  resizeObserver.observe(viewerElm);

  // on controls change
  controls.addEventListener("change", viewerRender);

  // on mesh or settings change: render
  van.derive(() => {
    mesh?.nodes?.val;
    mesh?.elements?.val;
    mesh?.nodeInputs?.val;
    mesh?.elementInputs?.val;
    mesh?.deformOutputs?.val;
    mesh?.analyzeOutputs?.val;

    settings.displayScale.val;
    settings.nodes.val;
    settings.elements.val;
    settings.edges?.val;
    settings.elemColumns.val;
    settings.elemBeams.val;
    settings.nodesIndexes.val;
    settings.elementsIndexes.val;
    settings.orientations.val;
    settings.sections.val;
    settings.secColumns.val;
    settings.secBeams.val;
    settings.secFloor.val;
    settings.supports.val;
    settings.loads.val;
    settings.deformedShape.val;
    settings.nodeResults.val;
    settings.frameResults.val;
    settings.shellResults.val;
    settings.solidResults?.val;  // re-render al cambiar Solid results (H8 sólidos)
    // ⚠️ Sin esta línea, encender la vista EXTRUIDA construye las mallas y no
    // repinta: la escena se queda como estaba y parece que no hace nada. Este
    // `van.derive` es la lista de ajustes que disparan un render, y un ajuste
    // nuevo que no esté aquí es invisible por mucho que su objeto funcione.
    settings.extruded?.val;

    setTimeout(viewerRender); // setTimeout to ensure render is called after all updates are done in that event tick
  });

  // ── SPLIT VIEW (vista doble) ──
  // Cuando está activado, renderiza dos veces el scene: izquierda con
  // activeCamera (donde el usuario dibuja) y derecha con splitCamera
  // (preview iso/elevación, INTERACTIVO — orbit/zoom/pan independiente
  // gracias a splitControls). Usa setViewport+setScissor para limitar
  // cada render a su mitad del canvas. Cuando OFF: render único a
  // pantalla completa (comportamiento original).
  let splitMode = false;
  let splitCamera: THREE.Camera | null = null;
  // OrbitControls secundarios para rotar/zoom/pan la vista preview de
  // la derecha. Se crean lazy en la primera activación de split mode.
  // Se alternan con los primarios según el lado del mouse (handler abajo).
  let splitControls: OrbitControls | null = null;
  let splitListenersAttached = false;

  function viewerRender() {
    const w = viewerElm.clientWidth || 1;
    const h = viewerElm.clientHeight || 1;
    if (!splitMode || !splitCamera) {
      renderer.setScissorTest(false);
      renderer.setViewport(0, 0, w, h);
      renderer.render(scene, activeCamera);
      return;
    }
    const halfW = w / 2;
    renderer.setScissorTest(true);
    // LEFT: cámara activa (dibujable)
    renderer.setViewport(0, 0, halfW, h);
    renderer.setScissor(0, 0, halfW, h);
    renderer.render(scene, activeCamera);
    // RIGHT: cámara preview (read-only)
    renderer.setViewport(halfW, 0, halfW, h);
    renderer.setScissor(halfW, 0, halfW, h);
    renderer.render(scene, splitCamera);
    renderer.setScissorTest(false);
  }

  function setActiveCamera(cam: THREE.Camera) {
    activeCamera = cam;
    controls.object = cam;
    controls.update();
    viewerRender();
  }

  function setSplitMode(enabled: boolean, secondaryCam?: THREE.Camera) {
    splitMode = enabled;
    if (secondaryCam) splitCamera = secondaryCam;
    // Recalcular aspect del frustum activo (mitad de ancho cuando split)
    const w = viewerElm.clientWidth || 1;
    const h = viewerElm.clientHeight || 1;
    const wActive = enabled ? w / 2 : w;
    const aspect = wActive / h;
    if ((camera as any).isPerspectiveCamera) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
    const frustumHalf = orthoCamera.top;
    orthoCamera.left = -frustumHalf * aspect;
    orthoCamera.right = frustumHalf * aspect;
    orthoCamera.updateProjectionMatrix();

    // ── OrbitControls secundarios para el panel derecho ──
    if (enabled && splitCamera) {
      if (!splitControls) {
        splitControls = new OrbitControls(splitCamera, renderer.domElement);
        splitControls.enableDamping = true;
        splitControls.dampingFactor = 0.1;
        splitControls.screenSpacePanning = true;
        splitControls.zoomSpeed = 0.8;
        splitControls.panSpeed = 1.2;
        splitControls.rotateSpeed = 0.9;
        splitControls.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        };
        splitControls.target.copy(controls.target);
        splitControls.addEventListener("change", viewerRender);
        splitControls.enabled = false;  // OFF hasta que el mouse entre al lado derecho
      } else {
        splitControls.object = splitCamera;
        splitControls.update();
      }

      // Listeners de switching: deciden qué OrbitControls procesa el evento
      // según el lado donde está el mouse. Usan capture-phase para correr
      // ANTES de los listeners internos de cada OrbitControls.
      if (!splitListenersAttached) {
        const decideSide = (e: PointerEvent | WheelEvent) => {
          if (!splitMode || !splitControls) return;
          const rect = renderer.domElement.getBoundingClientRect();
          const localX = e.clientX - rect.left;
          const halfW = rect.width / 2;
          const mouseRight = localX >= halfW;
          controls.enabled = !mouseRight;
          splitControls.enabled = mouseRight;
        };
        renderer.domElement.addEventListener("pointerdown", decideSide, true);
        renderer.domElement.addEventListener("wheel", decideSide, { capture: true, passive: true });
        splitListenersAttached = true;
      }
    } else if (!enabled) {
      // Volver a estado normal: solo controls primarios activos
      controls.enabled = true;
      if (splitControls) splitControls.enabled = false;
    }

    // Globals para que drawing.ts dispatchee al panel correcto:
    //   __hekatanSplitMode  → flag general
    //   __hekatanSplitCamera → cámara secundaria (panel derecho)
    // Cuando split está activo, drawing.ts decide qué cámara usar según el
    // lado donde está el mouse, así el usuario puede DIBUJAR desde ambas
    // ventanas (no solo orbit/zoom).
    (viewerElm as any).__splitMode = enabled;
    (window as any).__hekatanSplitMode = enabled;
    (window as any).__hekatanSplitCamera = enabled ? splitCamera : null;
    viewerRender();
  }

  // Optional inputs
  if (mesh) {
    // 3D objects
    scene.add(
      nodes(settings, derivedNodes, derivedDisplayScale),
      elements(mesh, settings, derivedNodes),
      nodesIndexes(settings, derivedNodes, derivedDisplayScale),
      elementsIndexes(mesh, settings, derivedNodes, derivedDisplayScale),
      supports(mesh, settings, derivedNodes, derivedDisplayScale),
      loads(mesh, settings, derivedNodes, derivedDisplayScale),
      orientations(mesh, settings, derivedNodes, derivedDisplayScale),
      sections(mesh, settings, derivedNodes, derivedDisplayScale),
      // La vista EXTRUIDA: el contorno de la seccion barrido a lo largo de la
      // barra, y las cascaras con su espesor. Copiado del metodo de ETABS
      // (`CSIOpenGL.dll` usa Poly2Tri: triangula el poligono y lo barre).
      extrusion(mesh, settings, derivedNodes),
      nodeResults(mesh, settings, derivedNodes, derivedDisplayScale),
      frameResults(mesh, settings, derivedNodes, derivedDisplayScale)
    );

    // ── Vista 2D del diagrama (alzado / planta, solo ese resultado) ──
    // Una sola por página: la ventana y `window.__hekatanDiagrama2D` son globales.
    if (!(window as any).__hekatanDiagrama2D) {
      iniciarDiagrama2D(mesh as any, settings);
      // DOBLE CLIC sobre una barra con un resultado puesto → su alzado en 2D. El
      // primer clic ya la designó (hover.ts), así que el plano sale de ella.
      renderer.domElement.addEventListener("dblclick", () => {
        const r = settings.frameResults?.rawVal;
        if (!r || r === "none") return;
        const sel = ((window as any).__hekatanModelSelection as any[] | undefined) ?? [];
        if (!sel.some((x) => x.type === "frame")) return;
        setTimeout(() => (window as any).__hekatanDiagrama2D?.(), 60);
      });
    }

    // ── Hover-highlight global (nodos + elementos en cualquier ejemplo) ──
    const hoverGroup = setupHover({
      scene, rendererElm: renderer.domElement,
      getActiveCamera: () => activeCamera,
      derivedNodes, derivedDisplayScale,  // mismo scale que usan nodes.ts/loads.ts
      mesh, settings,
      render: viewerRender,
    });
    scene.add(hoverGroup);

    // Color map (shells)
    const colorMapValues = getColorMapValues(mesh, settings);
    const shellResultsObj = shellResults(
      mesh,
      settings,
      derivedNodes,
      colorMapValues
    );
    const legend = getLegend(colorMapValues);

    scene.add(shellResultsObj);
    viewerElm.appendChild(legend);

    // Frame contour colors
    const frameColorMapObj = frameColorMap(mesh, settings, derivedNodes, derivedDisplayScale);
    scene.add(frameColorMapObj);

    // Frame contour legend (reuse getLegend)
    const frameColorValues = (frameColorMapObj as any).__colorMapValues as State<number[]>;
    const frameLegend = getLegend(frameColorValues);
    frameLegend.id = "frame-legend"; // unique ID to avoid CSS collision
    viewerElm.appendChild(frameLegend);

    van.derive(() => {
      const shellActive = settings.shellResults.val != "none";
      // ── Solid results PRIMARY: si hay un solid result seleccionado (≠ "none"),
      // el colormap también se activa, aunque shellResults esté en "none". Esto
      // es crucial para ejemplos con elementos H8 (bulbo, columna+viga, cubos)
      // donde el dropdown correcto es Solid results, no Shell results.
      const solidActive = (settings.solidResults?.val ?? "none") !== "none";
      const colorMapActive = shellActive || solidActive;
      const frameContourActive = settings.frameResults.val.startsWith("contour:");
      // Sin ningún valor finito (modelo sin cáscaras, o vacío) la barra salía con nueve "0":
      // se esconde hasta que haya algo que pintar.
      const hayValores = colorMapValues.val.some((v) => Number.isFinite(v));
      legend.hidden = !colorMapActive || !hayValores;
      shellResultsObj.visible = colorMapActive;
      frameLegend.hidden = !frameContourActive;
    });
  }

  if (solids) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(30, 25, -10);
    light1.shadow.mapSize.width = 1024;
    light1.shadow.mapSize.height = 1024;
    scene.add(light1);

    const d = 10;
    light1.shadow.camera.left = -d;
    light1.shadow.camera.right = d;
    light1.shadow.camera.top = d;
    light1.shadow.camera.bottom = -d;
    light1.shadow.camera.far = 1000;

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.color.setHSL(11, 43, 96);
    light2.position.set(-10, 0, 30);
    scene.add(light2);

    // Events: on solids change add/remove objects from the scene
    van.derive(() => {
      if (!solids?.val.length) return;

      scene.remove(...solids.oldVal);

      scene.add(...solids.rawVal);

      viewerRender();
    });

    // Events: on solids settings change update visibility
    van.derive(() => {
      solids.rawVal.forEach((solid) => (solid.visible = settings.solids.val));

      viewerRender();
    });
  }

  if (objects3D) {
    // Tracking local de los objetos que AÑADIMOS a la scene. Esto es más robusto
    // que objects3D.oldVal (que puede quedar stale si múltiples derives disparan
    // en el mismo batch). Así evitamos duplicación de resortes.
    const addedObjs: THREE.Object3D[] = [];
    const shouldShow = (obj: any): boolean => {
      if (obj?.userData?.isCota) return settings.showCotas.val;
      return settings.custom3D.val;
    };
    const applyVisibility = () => {
      for (const obj of addedObjs) (obj as any).visible = shouldShow(obj);
      viewerRender();
    };

    van.derive(() => {
      const nextObjs = objects3D.val;
      // 1) Remover TODO lo que agregamos antes (sin confiar en oldVal)
      if (addedObjs.length) {
        scene.remove(...addedObjs);
        addedObjs.length = 0;
      }
      // 2) Añadir los nuevos y recordarlos
      if (nextObjs.length) {
        scene.add(...nextObjs);
        addedObjs.push(...nextObjs);
        applyVisibility();
      }
      viewerRender();
    });

    van.derive(() => { settings.custom3D.val; applyVisibility(); });
    van.derive(() => { settings.showCotas.val; applyVisibility(); });
  }

  if (drawingObj)
    drawing({
      drawingObj,
      gridObj,
      scene,
      // Getter en vez de ref fija → drawing siempre usa la cámara activa actual
      // (perspectiva o ortográfica según la vista que el usuario seleccionó)
      getActiveCamera: () => activeCamera,
      controls,
      gridSize,
      derivedDisplayScale,
      rendererElm: renderer.domElement,
      viewerRender,
    });

  // Theme change: update renderer, recreate grid, CSS vars, and re-render
  onThemeChange((_name, colors) => {
    renderer.setClearColor(colors.background, 1);
    // Recreate grid — Group con mayor+minor lines, dispose recursivo
    scene.remove(gridObj);
    (gridObj as any).traverse?.((o: any) => {
      o.geometry?.dispose?.();
      o.material?.dispose?.();
    });
    gridObj = grid(settings.gridSize.rawVal, { planes: activePlanes() });
    scene.add(gridObj);
    // Update CSS custom properties for legend etc.
    viewerElm.style.setProperty("--awatif-legend-color", colors.legendMarker);
    viewerRender();
  });

  // Expose Three.js context for external use (view switching, etc.)
  const ctx: any = {
    scene,
    perspCamera: camera,
    orthoCamera,
    get camera() { return activeCamera; },
    controls,
    renderer,
    rendererElm: renderer.domElement,
    render: viewerRender,
    setActiveCamera,
    setSplitMode,
    get splitMode() { return splitMode; },
    get splitCamera() { return splitCamera; },
    settings,
  };
  (viewerElm as any).__ctx = ctx as ViewerContext3D;

  // ── BOTONES DE NAVEGACIÓN (overlay) — para laptops sin trackpad funcional ──
  // Permiten zoom in/out, pan en 4 direcciones y reset sin necesidad de scroll
  // wheel o gestos de trackpad. Útiles también en pantallas touch.
  const navOverlay = document.createElement("div");
  navOverlay.id = "hk-nav-camara";   // la piel CAD lo sube sobre la ventana de comandos
  navOverlay.style.cssText = [
    "position:absolute","right:8px","bottom:8px","z-index:50",
    "display:grid","grid-template-columns:repeat(3, 32px)","gap:2px",
    "user-select:none","pointer-events:auto",
  ].join(";");
  const mkBtn = (label: string, title: string, onClick: () => void): HTMLButtonElement => {
    const b = document.createElement("button");
    b.textContent = label; b.title = title;
    b.style.cssText = [
      "width:32px","height:32px","background:rgba(40,40,40,0.85)","color:#fff",
      "border:1px solid rgba(255,255,255,0.15)","border-radius:4px",
      "cursor:pointer","font-size:14px","font-family:system-ui",
    ].join(";");
    b.onmouseenter = () => { b.style.background = "rgba(70,70,70,0.9)"; };
    b.onmouseleave = () => { b.style.background = "rgba(40,40,40,0.85)"; };
    b.onclick = (e) => { e.preventDefault(); onClick(); };
    return b;
  };
  const panBy = (dx: number, dy: number) => {
    const target = controls.target;
    const offset = new THREE.Vector3().subVectors(activeCamera.position, target);
    const distance = offset.length();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    right.crossVectors(activeCamera.up, offset).normalize();
    up.copy(activeCamera.up).normalize();
    const f = distance * 0.05;
    target.addScaledVector(right, -dx * f);
    target.addScaledVector(up, dy * f);
    activeCamera.position.addScaledVector(right, -dx * f);
    activeCamera.position.addScaledVector(up, dy * f);
    controls.update(); viewerRender();
  };
  const zoomBy = (factor: number) => {
    const offset = new THREE.Vector3().subVectors(activeCamera.position, controls.target);
    offset.multiplyScalar(factor);
    activeCamera.position.copy(controls.target).add(offset);
    controls.update(); viewerRender();
  };
  // Grid 3×3:    [   ][ ↑ ][   ]
  //              [ ← ][🏠][ → ]
  //              [ -- ][ ↓ ][ ++ ]
  const filler = () => { const d = document.createElement("div"); d.style.cssText = "width:32px;height:32px;"; return d; };
  navOverlay.append(filler());
  navOverlay.append(mkBtn("↑", "Pan arriba", () => panBy(0, 1)));
  navOverlay.append(mkBtn("⊕", "Zoom in", () => zoomBy(0.85)));
  navOverlay.append(mkBtn("←", "Pan izquierda", () => panBy(-1, 0)));
  navOverlay.append(mkBtn("⌂", "Reset vista", () => {
    controls.reset(); viewerRender();
  }));
  navOverlay.append(mkBtn("→", "Pan derecha", () => panBy(1, 0)));
  navOverlay.append(mkBtn("⊖", "Zoom out", () => zoomBy(1.18)));
  navOverlay.append(mkBtn("↓", "Pan abajo", () => panBy(0, -1)));
  navOverlay.append(filler());
  // Necesitamos posicionar el overlay relativo al viewerElm
  if (getComputedStyle(viewerElm).position === "static") {
    viewerElm.style.position = "relative";
  }
  // Solo en pantallas TÁCTILES (móvil/tablet): en computadora se orbita, hace
  // zoom y pan con el ratón, así que el pad estorba. `pointer: coarse` es true
  // cuando el puntero principal es un dedo, false con ratón/trackpad.
  const punteroTactil = typeof window.matchMedia === "function"
    && window.matchMedia("(pointer: coarse)").matches;
  if (punteroTactil) viewerElm.appendChild(navOverlay);

  return viewerElm;
}

// Utils
function deriveNodes(
  mesh: Mesh | undefined,
  settings: Settings
): Mesh["nodes"] {
  return van.derive(() => {
    if (!settings.deformedShape.val) return mesh?.nodes?.val ?? [];
    const nodes = mesh?.nodes?.val ?? [];
    const deforms = mesh?.deformOutputs?.val?.deformations;
    if (!deforms || nodes.length === 0) return nodes;
    // Escalas SEPARADAS: XY (en el plano horizontal) y Z (vertical).
    // Razón física: concreto y acero son axialmente RÍGIDOS (EA grande) mientras
    // que lateralmente SÍ se desplazan notablemente bajo sísmico/viento. El
    // usuario típicamente quiere ver sway lateral exagerado sin ver columnas
    // 'de alfeñique' aplastándose en Z.
    //
    //   Ux visible = Ux * deformScale                  (el plano)
    //   Uy visible = Uy * deformScale
    //   Uz visible = Uz * deformScale * deformScaleZ   (Z con multiplicador extra)
    //
    // Para placas/zapatas (modelos donde Uz ES la deformación principal, como
    // flexión out-of-plane), el workspace setea deformScaleZ=1.0. Para edificios,
    // ~0.15-0.30 para respetar la rigidez axial real.
    const scaleXY = settings.deformScale.val;
    const scaleZ = settings.deformScale.val * settings.deformScaleZ.val;
    const safeXY = Number.isFinite(scaleXY) ? scaleXY : 1;
    const safeZ  = Number.isFinite(scaleZ)  ? scaleZ  : 1;
    return nodes.map((node, index) => {
      const d = deforms.get(index)?.slice(0, 3) ?? [0, 0, 0];
      const dx = Number.isFinite(d[0]) ? d[0] : 0;
      const dy = Number.isFinite(d[1]) ? d[1] : 0;
      const dz = Number.isFinite(d[2]) ? d[2] : 0;
      return [
        node[0] + dx * safeXY,
        node[1] + dy * safeXY,
        node[2] + dz * safeZ,
      ] as Node;
    });
  });
}

// State global expuesto al legend/colormap para override de rango [min,max]
// Si es null → auto-escala. Si [a,b] → fijo.
export const fixedColorMapRange: State<[number, number] | null> = van.state(null as any);
/** Unidad del colormap actual (mm, kN/m², etc.) — se muestra arriba del legend */
export const colorMapUnit: State<string> = van.state("");

/**
 * Unidad de fuerza seleccionada globalmente por el usuario (Tweakpane "Unidades").
 * Valores soportados: "kN" | "tonf" | "kip". Afecta TODOS los colormaps que
 * muestran fuerzas/momentos/tensiones (membrane*, bending*, vonMises, pressure, etc.)
 * y el scaling de sus valores al unit preferido.
 */
export const colorMapForceUnit: State<"kN" | "tonf" | "kip"> = van.state("kN");
/**
 * Unidad de desplazamiento seleccionada globalmente. Afecta displacementX/Y/Z del colormap.
 * Valores soportados: "mm" | "cm" | "m" | "in" | "ft" — los mismos que
 * `units.ts` del workspace. El PIE tiene que estar: el sistema imperial de CSI
 * es `Kip, ft, F`, y sin `ft` en la tabla la conversion da NaN.
 */
export const colorMapDispUnit: State<"mm" | "cm" | "m" | "in" | "ft"> = van.state("mm");

/**
 * Unidad de TENSIÓN/STRESS para resultados sólidos (σxx, τxy, vonMises, ...).
 * Independiente de forceUnit porque las tensiones son força/área y los
 * ingenieros prefieren unidades compuestas estándar (MPa, ksi, kgf/cm²)
 * en lugar de combinar manualmente force + length.
 */
export type StressUnit = "kN/m²" | "kPa" | "MPa" | "GPa" | "kgf/cm²" | "tonf/m²" | "ksi" | "psi";
export const colorMapStressUnit: State<StressUnit> = van.state("kN/m²");

// Factores de conversión (mismos que units.ts del workspace, duplicados acá
// porque hekatan-ui es un paquete independiente y no debe importar de examples/).
const FORCE_FACTORS = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
const DISP_FACTORS = { mm: 1000, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 };

// Stress conversion: 1 kN/m² × STRESS_FACTORS[unit] = valor en `unit`
//   1 kN/m² = 1 kPa
//   1 MPa  = 1000 kPa = 1000 kN/m² = 1 N/mm²
//   1 GPa  = 1e6 kN/m²
//   1 kgf/cm² = 98.0665 kN/m²    (1 kgf = 9.80665 N)
//   1 tonf/m² = 9.80665 kN/m²
//   1 psi  = 6.89476 kN/m²
//   1 ksi  = 6894.76 kN/m²
const STRESS_FACTORS: Record<StressUnit, number> = {
  "kN/m²":   1,
  "kPa":     1,
  "MPa":     1 / 1000,
  "GPa":     1 / 1e6,
  "kgf/cm²": 1 / 98.0665,
  "tonf/m²": 1 / 9.80665,
  "psi":     1 / 6.89476,
  "ksi":     1 / 6894.76,
};

function getColorMapValues(mesh: Mesh, settings: Settings): State<number[]> {
  // Init
  const colorMapValues = van.state([]);

  enum ResultType {
    bendingXX = "bendingXX",
    bendingYY = "bendingYY",
    bendingXY = "bendingXY",
    membraneXX = "membraneXX",
    membraneYY = "membraneYY",
    membraneXY = "membraneXY",
    tranverseShearX = "tranverseShearX",
    tranverseShearY = "tranverseShearY",
    // Los principales y el cortante maximo: derivados (circulo de Mohr) de los
    // tres de arriba. Estaban en el desplegable y no en este enum, o sea que
    // `resultMapper[field]` salia undefined y el campo se pintaba todo igual.
    membranePrincipalMax = "membranePrincipalMax",
    membranePrincipalMin = "membranePrincipalMin",
    bendingPrincipalMax = "bendingPrincipalMax",
    bendingPrincipalMin = "bendingPrincipalMin",
    transverseShearMax = "transverseShearMax",
    vonMises = "vonMises",
    pressure = "pressure",
    displacementX = "displacementX",
    displacementY = "displacementY",
    displacementZ = "displacementZ",
  }

  // Events
  // On resultMapper, nodes, settings.shellResults change: get new values
  van.derive(() => {
    const nodeBendingXX = new Map<number, number[]>();
    const nodeBendingYY = new Map<number, number[]>();
    const nodeBendingXY = new Map<number, number[]>();
    const nodeMembraneXX = new Map<number, number[]>();
    const nodeMembraneYY = new Map<number, number[]>();
    const nodeMembraneXY = new Map<number, number[]>();
    const nodeShearX = new Map<number, number[]>();
    const nodeShearY = new Map<number, number[]>();
    const nodeVonMises = new Map<number, number[]>();
    const nodePressure = new Map<number, number[]>();

    // Map element results to node values.
    // Supports 3-node (triangle) and 4-node (quad) elements.
    const mapResultToNodes = (
      resultMap: Map<number, number[]> | undefined,
      nodeMap: Map<number, number[]>
    ) => {
      resultMap?.forEach((vals, elementIndex) => {
        const elem = mesh.elements.val[elementIndex];
        if (!elem) return;
        for (let i = 0; i < elem.length; i++) {
          nodeMap.set(elem[i], [vals[i] ?? vals[0]]);
        }
      });
    };

    mapResultToNodes(mesh.analyzeOutputs?.val?.bendingXX, nodeBendingXX);
    mapResultToNodes(mesh.analyzeOutputs?.val?.bendingYY, nodeBendingYY);
    mapResultToNodes(mesh.analyzeOutputs?.val?.bendingXY, nodeBendingXY);
    mapResultToNodes(mesh.analyzeOutputs?.val?.membraneXX, nodeMembraneXX);
    mapResultToNodes(mesh.analyzeOutputs?.val?.membraneYY, nodeMembraneYY);
    mapResultToNodes(mesh.analyzeOutputs?.val?.membraneXY, nodeMembraneXY);
    mapResultToNodes(mesh.analyzeOutputs?.val?.tranverseShearX, nodeShearX);
    mapResultToNodes(mesh.analyzeOutputs?.val?.tranverseShearY, nodeShearY);
    mapResultToNodes(mesh.analyzeOutputs?.val?.vonMises, nodeVonMises);
    mapResultToNodes((mesh.analyzeOutputs?.val as any)?.pressure, nodePressure);

    // ── Los PRINCIPALES y el cortante máximo ────────────────────────────
    //
    // FMax/FMin, MMax/MMin y VMax estaban en el desplegable **y en ningún
    // sitio más**: no los calculaba nadie y no estaban en `resultMapper`, así
    // que el viewer leía `undefined`, pintaba todo de un color y la barra
    // decía `0 .. 0`. Cinco opciones muertas, sin aviso. Encontrado el
    // 2026-08-27 barriendo los 17 campos de las plantillas
    // (`cli/shot_plantillas_colormap.mjs`).
    //
    // No hace falta tocar el solver: son el círculo de Mohr de campos que YA
    // vienen calculados, la misma definición que usa CSI.
    //
    //   F_max,min = (F11+F22)/2 ± √( ((F11−F22)/2)² + F12² )
    //   M_max,min = igual, con M11 M22 M12
    //   V_max     = √( V13² + V23² )
    //
    // Se derivan aquí, sobre los valores YA repartidos a nudos, y no en
    // `analyze()`, porque son función puntual de los otros tres: hacerlo en el
    // motor obligaría a recalcular y a mantener tres mapas más en el WASM para
    // no añadir ni un dato nuevo.
    const nodeMembranePMax = new Map<number, number[]>();
    const nodeMembranePMin = new Map<number, number[]>();
    const nodeBendingPMax = new Map<number, number[]>();
    const nodeBendingPMin = new Map<number, number[]>();
    const nodeShearMax = new Map<number, number[]>();
    const mohr = (xx: Map<number, number[]>, yy: Map<number, number[]>,
                  xy: Map<number, number[]>,
                  aMax: Map<number, number[]>, aMin: Map<number, number[]>) => {
      xx.forEach((v, n) => {
        const a = v[0] ?? 0, b = yy.get(n)?.[0] ?? 0, c = xy.get(n)?.[0] ?? 0;
        const med = (a + b) / 2;
        const rad = Math.hypot((a - b) / 2, c);
        aMax.set(n, [med + rad]);
        aMin.set(n, [med - rad]);
      });
    };
    mohr(nodeMembraneXX, nodeMembraneYY, nodeMembraneXY, nodeMembranePMax, nodeMembranePMin);
    mohr(nodeBendingXX, nodeBendingYY, nodeBendingXY, nodeBendingPMax, nodeBendingPMin);
    nodeShearX.forEach((v, n) => {
      nodeShearMax.set(n, [Math.hypot(v[0] ?? 0, nodeShearY.get(n)?.[0] ?? 0)]);
    });

    // Override POR CAMPO: colorMapRanges[field] define rango fijo sólo para ese shell result.
    // Campos no listados → auto-escala (bendingXX, vonMises, etc. conservan su gradiente natural).
    // Si solidResults está activo, lookup va por el solidField (vonMises, σxx, etc.).
    // NOTA: el rango se ESCALA junto con los valores al unit elegido en "Unidades".
    // Esto se hace después abajo, una vez que scale está definido.
    const ranges = (mesh.analyzeOutputs?.val as any)?.colorMapRanges;
    const solidFieldEarly = settings.solidResults?.val;
    const useSolidEarly = solidFieldEarly && solidFieldEarly !== "none";
    const currentField = useSolidEarly ? solidFieldEarly : settings.shellResults.val;
    const r = ranges?.[currentField];

    const resultMapper = {
      [ResultType.bendingXX]: [nodeBendingXX, 0],
      [ResultType.bendingYY]: [nodeBendingYY, 0],
      [ResultType.bendingXY]: [nodeBendingXY, 0],
      [ResultType.membraneXX]: [nodeMembraneXX, 0],
      [ResultType.membraneYY]: [nodeMembraneYY, 0],
      [ResultType.membraneXY]: [nodeMembraneXY, 0],
      [ResultType.tranverseShearX]: [nodeShearX, 0],
      [ResultType.tranverseShearY]: [nodeShearY, 0],
      [ResultType.membranePrincipalMax]: [nodeMembranePMax, 0],
      [ResultType.membranePrincipalMin]: [nodeMembranePMin, 0],
      [ResultType.bendingPrincipalMax]: [nodeBendingPMax, 0],
      [ResultType.bendingPrincipalMin]: [nodeBendingPMin, 0],
      [ResultType.transverseShearMax]: [nodeShearMax, 0],
      [ResultType.vonMises]: [nodeVonMises, 0],
      [ResultType.pressure]: [nodePressure, 0],
      [ResultType.displacementX]: [mesh.deformOutputs?.val?.deformations, 0],
      [ResultType.displacementY]: [mesh.deformOutputs?.val?.deformations, 1],
      [ResultType.displacementZ]: [mesh.deformOutputs?.val?.deformations, 2],
    };

    // Escalas + unidades por tipo de resultado, reactivas a colorMapForceUnit
    // y colorMapDispUnit (el usuario los mueve desde el folder "Unidades").
    //
    //   Internamente, TODO viene en kN (force), kN·m/m (bending moment/width),
    //   kN/m (membrane force/length, transverse shear), kN/m² (stress: vonMises, pressure)
    //   y m (displacement). El colormap los re-escala al unit seleccionado.
    const field = settings.shellResults.val;
    const fUnit = colorMapForceUnit.val;
    const dUnit = colorMapDispUnit.val;
    const isDisp = field === "displacementX" || field === "displacementY" || field === "displacementZ";
    // Los principales llevan la unidad de SU familia: MMax/MMin son momentos y
    // FMax/FMin fuerzas de membrana. Dejarlos fuera de estas listas los pintaba
    // sin unidad y sin convertir al sistema elegido en "Unidades".
    const isBending = field === "bendingXX" || field === "bendingYY" || field === "bendingXY" ||
                      field === "bendingPrincipalMax" || field === "bendingPrincipalMin";
    const isMembrane = field === "membraneXX" || field === "membraneYY" || field === "membraneXY" ||
                       field === "membranePrincipalMax" || field === "membranePrincipalMin";
    const isStress = field === "vonMises" || field === "pressure";
    const isShear = field === "tranverseShearX" || field === "tranverseShearY" ||
                    field === "transverseShearMax";

    // ── Solid Results override ──
    // Cuando un ejemplo usa elementos H8 sólidos, el dropdown "Solid results"
    // se monta en paralelo a "Shell results" y reusa internamente el canal
    // "vonMises" para el rendering. Pero las UNIDADES dependen del campo real:
    //   - σ_xx/yy/zz, τ_xy/yz/xz, vonMises  → kN/m² (stress)
    //   - ux, uy, uz                         → m (desplazamiento)
    const solidField = settings.solidResults?.val;
    const isSolidStress = solidField === "vonMises" ||
                          solidField === "sigmaXX" || solidField === "sigmaYY" || solidField === "sigmaZZ" ||
                          solidField === "tauXY"   || solidField === "tauYZ"   || solidField === "tauXZ";
    const isSolidDisp = solidField === "ux" || solidField === "uy" || solidField === "uz";

    // Unidad de tensión sólido (independiente de forceUnit: el usuario elige
    // MPa, kgf/cm², ksi, etc. directamente — más práctico para ingeniería).
    const sUnit = colorMapStressUnit.val;

    // Factor de escala UI: convierte valor SI → valor UI (para mostrar en el legend).
    // - Disp: multiplica por DISP_FACTORS[dUnit] (mm=1000, cm=100, µm=1e6)
    // - Fuerza/tensión/momento (shells): divide por FORCE_FACTORS[fUnit]
    // - Solid stress: multiplica por STRESS_FACTORS[sUnit] directamente
    const scale =
      isSolidStress ? STRESS_FACTORS[sUnit] :
      isSolidDisp   ? DISP_FACTORS[dUnit] :
      isDisp        ? DISP_FACTORS[dUnit] :
      (isBending || isMembrane || isStress || isShear) ? 1 / FORCE_FACTORS[fUnit] :
      1;

    // Sufijo de unidad en el legend.
    const unit =
      isSolidStress ? sUnit :                 // MPa, kPa, kgf/cm², etc.
      isSolidDisp   ? dUnit :                 // ux, uy, uz (m / mm / etc.)
      isDisp        ? dUnit :
      isBending     ? `${fUnit}·m/m` :
      isMembrane    ? `${fUnit}/m²` :         // stress de plane Q4 (legacy)
      isStress      ? `${fUnit}/m²` :         // shell vonMises legacy
      isShear       ? `${fUnit}/m` :
      "";
    colorMapUnit.val = unit;

    // ── Aplicar scale al rango fijo ──
    // El rango fijo viene de analyzeOutputs.colorMapRanges en unidades INTERNAS
    // (kN/m² para tensiones). Las values también se escalan vía `raw * scale`.
    // Para que el rango y los valores estén en la MISMA unidad, multiplicamos el
    // rango por scale también. Sin esto, cambiar unit en Unidades (kN/m² → MPa)
    // hace que vMin/vMax queden 1000× más grandes que las values → bulbo todo magenta.
    fixedColorMapRange.val = (Array.isArray(r) && r.length === 2)
      ? [r[0] * scale, r[1] * scale]
      : null;
    const scopeSel = colorMapScope.val;   // dependencia: cambiar el selector recalcula

    // ── Solid Results PRIMARY: cuando solidField está activo (no "none"),
    // usar la data sólida en lugar de la shell. Los campos sólidos se
    // mapean al mismo canal nodeVonMises porque el ejemplo populates el
    // map con S33 / σ / etc. via analyzeOutputs.vonMises.
    const useSolid = solidField && solidField !== "none";
    const effectiveResultMap = useSolid ? [nodeVonMises, 0] : resultMapper[field];

    const values: number[] = [];
    mesh.nodes.val.forEach((_, i) => {
      const resultMap = effectiveResultMap;
      if (!resultMap || !resultMap[0] || typeof resultMap[0].has !== 'function') return;
      if (!resultMap[0].has(i)) {
        values.push(Number.NaN);
        return;
      }
      const entry = resultMap[0].get(i);
      const raw = entry ? entry[resultMap[1] as number] ?? 0 : 0;
      values.push(raw * scale);
    });

    // ── Rango por familia (Settings → "Rango colormap") ──
    // Solo si el ejemplo no fija su propio rango. Clasifica cada Q4 por su plano (los 4 nudos con la
    // misma z = losa; la misma x o y = muro) y saca el rango robusto de los nudos de esa familia.
    if (!fixedColorMapRange.val && scopeSel !== "auto") {
      const N = mesh.nodes.val, sel = new Set<number>();
      const same = (e: number[], c: number) => { const v = N[e[0]]?.[c]; return e.every((i) => Math.abs((N[i]?.[c] ?? NaN) - v) < 1e-6); };
      for (const e of mesh.elements.val) {
        if (e.length !== 4) continue;
        const losa = same(e, 2), muroX = !losa && same(e, 0), muroY = !losa && same(e, 1), muro = muroX || muroY;
        const entra = scopeSel === "losas" ? losa : scopeSel === "muros" ? muro : scopeSel === "murosX" ? muroX : scopeSel === "murosY" ? muroY : false;
        if (entra) for (const i of e) sel.add(i);
      }
      const sub: number[] = []; for (const i of sel) { const v = values[i]; if (Number.isFinite(v)) sub.push(v); }
      if (sub.length) fixedColorMapRange.val = robustRange(sub);
    }
    colorMapValues.val = values;
  });

  return colorMapValues;
}

