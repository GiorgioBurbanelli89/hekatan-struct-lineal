/**
 * =============================================================================
 *  animateMode — Animación visual de modos de vibración (modal analysis)
 * =============================================================================
 *
 *  Helper reutilizable extraído de la lógica original de `getCad3d.ts` que
 *  anima sinusoidalmente el modo seleccionado. Funciona con cualquier ejemplo
 *  que expone un `ModalOutputs` (frequencies, modeShapes, massParticipation).
 *
 *  REGLA DE UI: el helper NO crea ventanas/badges/divs custom. Toda la
 *  información del modo actual (nº, frecuencia, período, dirección
 *  dominante) se expone vía `getStatus()` para que el Tweakpane del
 *  workspace la muestre como bindings readonly (consistencia: único
 *  sistema de UI = Tweakpane).
 *
 *  Uso típico desde el workspace:
 *    const anim = createModalAnimator({ mesh, viewerElm });
 *    anim.setResults(modalOut);
 *    anim.setMode(0);      // modo 1 (0-indexed)
 *    anim.play();
 *    // El caller lee anim.getStatus() y hace pane.refresh() para actualizar
 *    // las líneas readonly "f = X Hz", "Dominante: Ux (78%)", etc.
 * =============================================================================
 */
import type { State } from "vanjs-core";
import * as THREE from "three";
import type { Node, Element, ModalOutputs } from "hekatan-fem";

export interface ModalAnimatorConfig {
  /** Reactive mesh del viewer (nodes + elements + deformOutputs del workspace) */
  mesh: {
    nodes: State<Node[]>;
    elements: State<Element[]>;
    deformOutputs?: State<any>;
    analyzeOutputs?: State<any>;
  };
  /** El <div> del viewer (tiene __ctx.scene, __ctx.camera, __ctx.render) */
  viewerElm: HTMLElement;
  /** Amplitud visual como % del diagonal del modelo. Default 5%. */
  scalePercent?: number;
  /** Factor de tiempo para que la animación sea visualmente agradable (no la
   *  frecuencia REAL que a veces es muy alta o muy baja). Default: escalar
   *  frecuencia a [0.5, 3] Hz para oscilación clara. */
  visFrequencyRange?: [number, number];
  /** Callback invocado cada vez que el status cambia (modo, freq, play/stop).
   *  El workspace lo usa para llamar pane.refresh() y actualizar los bindings
   *  readonly del Tweakpane. */
  onStatusChange?: () => void;
}

/** Snapshot del estado actual — se muestra en el Tweakpane como readonly. */
export interface ModalAnimatorStatus {
  /** "Modo 3 / 12" o "Sin resultados" */
  mode: string;
  /** "0.458 Hz" */
  frequency: string;
  /** "2.184 s" */
  period: string;
  /** "Ux (78%)" — dirección dominante con % de masa participante */
  dominant: string;
  /** "▶ Reproduciendo" / "⏸ Pausado" */
  state: string;
}

export interface ModalAnimator {
  /** Carga nuevos resultados modales */
  setResults(out: ModalOutputs): void;
  /** Selecciona el modo a animar (0-indexed) */
  setMode(i: number): void;
  /** Inicia la animación del modo actual */
  play(): void;
  /** Detiene la animación y restaura nodos a posiciones originales */
  stop(): void;
  /** True si la animación está corriendo */
  isPlaying(): boolean;
  /** Número actual de modos disponibles */
  modeCount(): number;
  /** Modo actualmente seleccionado (0-indexed) */
  currentMode(): number;
  /** Frecuencia del modo actual en Hz (0 si no hay results) */
  currentFreq(): number;
  /** Snapshot string-izado del status para mostrar en Tweakpane */
  getStatus(): ModalAnimatorStatus;
  /** Limpieza de recursos (cancela RAF, restaura nodos) */
  dispose(): void;
}

/**
 * Crea un animador modal para el viewer. El viewer debe tener un `__ctx` en
 * su DOM element (getViewer de hekatan-ui lo expone).
 */
export function createModalAnimator(cfg: ModalAnimatorConfig): ModalAnimator {
  const { mesh, viewerElm, onStatusChange } = cfg;
  const scalePct = cfg.scalePercent ?? 5;
  const [visMin, visMax] = cfg.visFrequencyRange ?? [0.5, 3];

  // ── State ──────────────────────────────────────────────────────────
  let results: ModalOutputs | null = null;
  let mode = 0;
  let rafId = 0;
  // trueOriginalNodes: snapshot de los nodos tomada ANTES de CUALQUIER animación.
  // Se captura una sola vez por cada llamada a setResults() para que consecutivos
  // play → stop → play → stop siempre restauren a los verdaderos originales, no
  // al último frame corrompido por una animación anterior.
  let trueOriginalNodes: Node[] = [];
  let originalNodes: Node[] = [];

  function fireStatus() { onStatusChange?.(); }

  function computeStatus(): ModalAnimatorStatus {
    if (!results || !results.frequencies || results.frequencies.length === 0) {
      return {
        mode: "Sin resultados",
        frequency: "—",
        period: "—",
        dominant: "—",
        state: "⏸ Detenido",
      };
    }
    const freq = results.frequencies[mode] ?? 0;
    const T = freq > 0 ? 1 / freq : 0;
    const dirs = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];
    const mp = results.massParticipation?.[mode];
    let domDir = "—";
    if (mp) {
      let maxV = 0, maxI = 0;
      for (let i = 0; i < 6; i++) if (Math.abs(mp[i]) > maxV) { maxV = Math.abs(mp[i]); maxI = i; }
      domDir = `${dirs[maxI]} (${(maxV * 100).toFixed(0)}%)`;
    }
    return {
      mode: `Modo ${mode + 1} / ${results.frequencies.length}`,
      frequency: `${freq.toFixed(4)} Hz`,
      period: `${T.toFixed(4)} s`,
      dominant: domDir,
      state: rafId !== 0 ? "▶ Reproduciendo" : "⏸ Pausado",
    };
  }

  // ── Core animation loop ────────────────────────────────────────────
  function getCtx() {
    return (viewerElm as any).__ctx as undefined | {
      scene: THREE.Scene;
      camera: THREE.Camera;
      render: () => void;
    };
  }

  function stopInternal(restore: boolean) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (restore) {
      // Siempre restaurar a los TRUE originals (no al último snapshot del start,
      // que podría estar corrompido si el usuario encadenó play→stop→play).
      // Forzamos render inmediato para que el canvas Three.js refleje los nodos
      // al momento, sin esperar un evento reactivo.
      const src = trueOriginalNodes.length > 0 ? trueOriginalNodes : originalNodes;
      if (src.length > 0) {
        mesh.nodes.val = src.map((n) => [...n] as Node);
        getCtx()?.render();
      }
    }
  }

  function startInternal() {
    if (!results || !results.modeShapes || results.modeShapes.length === 0) return;
    if (!results.modeShapes[mode]) return;
    stopInternal(false);

    const shape = results.modeShapes[mode];
    const freq = results.frequencies?.[mode] || 1;
    // Mapear frecuencia REAL → frecuencia VISIBLE para que modos altos no oscilen
    // tan rápido que el ojo no los detecte.
    const baseFreq = results.frequencies?.[0] || 1;
    const visFreq = Math.max(visMin, Math.min(visMax, freq / baseFreq));

    originalNodes = mesh.nodes.rawVal.map((n) => [...n] as Node);
    const nNodes = originalNodes.length;

    // Amplitud = scalePct% del diagonal del modelo / maxDisp del modo
    let xMin = Infinity, yMin = Infinity, zMin = Infinity;
    let xMax = -Infinity, yMax = -Infinity, zMax = -Infinity;
    for (const n of originalNodes) {
      if (n[0] < xMin) xMin = n[0]; if (n[0] > xMax) xMax = n[0];
      if (n[1] < yMin) yMin = n[1]; if (n[1] > yMax) yMax = n[1];
      if (n[2] < zMin) zMin = n[2]; if (n[2] > zMax) zMax = n[2];
    }
    const extent = Math.sqrt((xMax - xMin) ** 2 + (yMax - yMin) ** 2 + (zMax - zMin) ** 2) || 1;
    let maxDisp = 0;
    for (let i = 0; i < nNodes; i++) {
      const dx = shape[i * 6] || 0, dy = shape[i * 6 + 1] || 0, dz = shape[i * 6 + 2] || 0;
      const m = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (m > maxDisp) maxDisp = m;
    }
    const mScale = maxDisp > 1e-12 ? (extent * scalePct / 100) / maxDisp : 1;

    const t0 = performance.now();
    // THROTTLE ADAPTATIVO: cada cambio de mesh.nodes.val reconstruye TODA la
    // geometría del viewer (van.derive recrea el BufferGeometry). A 60fps eso
    // satura/CONGELA el navegador, sobre todo con shells (malla densa). Escalamos
    // el intervalo con el tamaño del modelo: ~25fps para frames (poco nodos) y
    // hasta ~8fps para modelos pesados. El render lo dispara el viewer al cambiar
    // derivedNodes (NO llamamos render() acá: sería síncrono ANTES del rebuild).
    const frameInterval = Math.min(200, Math.max(40, nNodes * 0.7));
    let lastFrame = 0;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const now = performance.now();
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      const t = (now - t0) / 1000;
      const amp = Math.sin(2 * Math.PI * visFreq * t) * mScale;
      const newNodes: Node[] = new Array(nNodes);
      for (let i = 0; i < nNodes; i++) {
        const o = originalNodes[i];
        newNodes[i] = [
          o[0] + (shape[i * 6] || 0) * amp,
          o[1] + (shape[i * 6 + 1] || 0) * amp,
          o[2] + (shape[i * 6 + 2] || 0) * amp,
        ];
      }
      mesh.nodes.val = newNodes;
    };
    rafId = requestAnimationFrame(tick);
    fireStatus();
  }

  return {
    setResults(out) {
      results = out;
      if (mode >= (out?.frequencies?.length ?? 0)) mode = 0;
      // Captura los nodos TRUE ORIGINALS justo cuando llegan nuevos resultados
      // modales (asume que en este momento el modelo está en su estado NO
      // animado). Subsecuentes play→stop→play siempre restauran a estos.
      trueOriginalNodes = mesh.nodes.rawVal.map((n) => [...n] as Node);
      fireStatus();
    },
    setMode(i) {
      if (!results) return;
      const n = results.frequencies?.length ?? 0;
      mode = Math.max(0, Math.min(n - 1, i));
      if (rafId !== 0) startInternal();
      else fireStatus();
    },
    play() {
      if (!results) return;
      if (rafId === 0) startInternal();
    },
    stop() {
      stopInternal(true);
      fireStatus();
    },
    isPlaying() { return rafId !== 0; },
    modeCount() { return results?.frequencies?.length ?? 0; },
    currentMode() { return mode; },
    currentFreq() { return results?.frequencies?.[mode] ?? 0; },
    getStatus() { return computeStatus(); },
    dispose() {
      stopInternal(true);
      results = null;
    },
  };
}
