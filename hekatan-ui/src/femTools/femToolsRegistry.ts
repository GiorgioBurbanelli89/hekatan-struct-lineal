/**
 * 🛠 FEM Tools Registry — singletons lazy de los paneles flotantes.
 *
 *  Centraliza la instanciación de:
 *    • InspectPanel (panel didáctico K_local + KaTeX)
 *    • ModalPanel (ASCE 7-22 + animación)
 *    • SolverLog (tiempos + derivación)
 *    • CalcPanel (calculadora MATLAB-style con KaTeX)
 *    • CliPanel (terminal cad.* programable)
 *
 *  Cada panel se crea la PRIMERA VEZ que el usuario hace click en su botón
 *  del Tweakpane. Esto evita el costo de inicialización (KaTeX CDN, dragOff,
 *  etc.) hasta que realmente se necesita.
 *
 *  Uso desde `attachFemTools.ts`:
 *    const reg = new FemToolsRegistry();
 *    reg.toggleInspect(ctx);
 *    reg.toggleCalc(ctx);
 *    ...
 */
import type { State } from "vanjs-core";
import type {
  Node, Element, NodeInputs, ElementInputs,
  DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";

import {
  createInspectPanel, type InspectPanelApi, computeFrameMatrices,
} from "../inspect";
import { createModalPanel, type ModalPanelApi } from "../modalPanel";
import { createSolverLog, type SolverLogApi } from "../solverLog";
import { createCalcPanel, type CalcPanelApi, buildModelVars } from "../calcPanel";
import {
  createCliPanel, type CliPanelApi, buildCadApi,
} from "../cli";
import { openReportExplained } from "../report/reportExplained";

/**
 * Contexto del modelo activo que el orquestador necesita para conectar
 * los paneles con los datos reactivos del workspace.
 */
export interface FemToolsContext {
  nodes: State<Node[]>;
  elements: State<Element[]>;
  nodeInputs: State<NodeInputs>;
  elementInputs: State<ElementInputs>;
  deformOutputs: State<DeformOutputs>;
  analyzeOutputs: State<AnalyzeOutputs>;
  /** Ejemplo activo (con `hasModal`, `runModal`, `name`, etc.) */
  currentExample?: {
    name?: string;
    hasModal?: boolean;
    runModal?: (params: any, states: any, modalPanel: any) => void;
  };
  /** Params actuales del ejemplo (van.state values) */
  currentParams?: Record<string, number>;
  /** Panel modal LEGACY (renderModalTable.ts) — el orquestador llama a su `.render()` */
  modalPanelLegacy?: any;
  /** Trigger re-build del ejemplo activo */
  onRebuild?: () => void;
  /** States adicionales para `cad.*` (CLI) */
  objects3D?: any;
}

export class FemToolsRegistry {
  private _inspect: InspectPanelApi | null = null;
  private _modal: ModalPanelApi | null = null;
  private _solverLog: SolverLogApi | null = null;
  private _calc: CalcPanelApi | null = null;
  private _cli: CliPanelApi | null = null;

  /** 🔍 Inspect — abre panel del primer frame del modelo activo */
  toggleInspect(ctx: FemToolsContext): void {
    if (!this._inspect) this._inspect = createInspectPanel();
    if (this._inspect.el.style.display === "flex" || this._inspect.el.style.display === "block") {
      this._inspect.hide();
      return;
    }
    const ns = ctx.nodes.rawVal;
    const els = ctx.elements.rawVal;
    const ei = ctx.elementInputs.rawVal as any;
    const firstFrameIdx = els.findIndex((e: any) => e?.length === 2);
    if (firstFrameIdx < 0) {
      alert("No hay elementos frame en el modelo. Carga un ejemplo con frames primero.");
      return;
    }
    const e = els[firstFrameIdx];
    const E = ei.elasticities?.get(firstFrameIdx) ?? 2e8;
    const G = ei.shearModuli?.get(firstFrameIdx) ?? E / 2.6;
    const A = ei.areas?.get(firstFrameIdx) ?? 0.01;
    const Iy = ei.momentsOfInertiaY?.get(firstFrameIdx) ?? 1e-4;
    const Iz = ei.momentsOfInertiaZ?.get(firstFrameIdx) ?? 1e-4;
    const J = ei.torsionalConstants?.get(firstFrameIdx) ?? 1e-4;
    this._inspect.show({
      index: firstFrameIdx,
      type: "frame",
      nodes: [ns[e[0]], ns[e[1]]],
      nodeIndices: [e[0], e[1]],
      frameProps: { E, G, A, Iy, Iz, J },
      sectionLabel: ei.sectionLabels?.get(firstFrameIdx) ?? "—",
    });
  }

  /** 📈 Modal+ ASCE 7-22 — solo si currentExample.hasModal === true */
  toggleModal(ctx: FemToolsContext): void {
    if (!this._modal) this._modal = createModalPanel({ initiallyVisible: false });
    if (this._modal.el.style.display !== "none") {
      this._modal.hide();
      return;
    }
    if (ctx.currentExample?.hasModal && ctx.currentExample.runModal) {
      const states = {
        nodes: ctx.nodes, elements: ctx.elements,
        nodeInputs: ctx.nodeInputs, elementInputs: ctx.elementInputs,
        deformOutputs: ctx.deformOutputs, analyzeOutputs: ctx.analyzeOutputs,
        objects3D: ctx.objects3D,
      };
      try {
        ctx.currentExample.runModal(ctx.currentParams ?? {}, states, ctx.modalPanelLegacy);
      } catch (e: any) {
        alert("Error en runModal: " + e.message);
      }
    }
    this._modal.show();
  }

  /** 📜 Solver Log — refresca stats del último deform */
  toggleSolverLog(ctx: FemToolsContext): void {
    if (!this._solverLog) this._solverLog = createSolverLog();
    if (this._solverLog.el.style.display === "block") {
      this._solverLog.hide();
      return;
    }
    const ns = ctx.nodes.rawVal;
    const els = ctx.elements.rawVal;
    const ni = ctx.nodeInputs.rawVal as any;
    const def = ctx.deformOutputs.rawVal as any;
    const supports = ni.supports?.size ?? 0;
    const loads = ni.loads?.size ?? 0;
    const totalDOFs = ns.length * 6;
    let maxU = 0, maxUIdx = -1;
    let maxUComp: "ux" | "uy" | "uz" = "uz";
    if (def?.deformations) {
      for (const [i, u] of def.deformations) {
        for (let c = 0; c < 3; c++) {
          if (Math.abs(u[c]) > maxU) {
            maxU = Math.abs(u[c]);
            maxUIdx = i;
            maxUComp = (["ux", "uy", "uz"] as const)[c];
          }
        }
      }
    }
    const nFrames = els.filter((e: any) => e.length === 2).length;
    const nShells = els.filter((e: any) => e.length === 3 || e.length === 4).length;
    const nSolids = els.filter((e: any) => e.length === 8).length;
    this._solverLog.update({
      nNodes: ns.length, nElements: els.length,
      nFrames, nShells, nSolids,
      nSupports: supports, nLoads: loads,
      totalDOFs, freeDOFs: totalDOFs - supports * 6,
      // ⚠️ Estos numeros estaban CLAVADOS (1/2/1/6 ms) y el panel «Solver Log»
      // imprimia «SparseLU → 2.0 ms … ✓ Completado: 6.0 ms» igual con 3 nudos que
      // con 6600. Un tiempo inventado es peor que ningun tiempo: se lee como
      // medida. Mientras no se instrumente el solver de verdad (el WASM no
      // devuelve los parciales), no se enseña ninguno.
      timings: undefined,
      maxDisplacement: maxUIdx >= 0
        ? { value: maxU, nodeIdx: maxUIdx, component: maxUComp }
        : undefined,
      solverName: "SparseLU (deformCpp)",
    });
    this._solverLog.show();
  }

  /** 🧮 Calculadora FEM — abre panel grande estilo MATLAB */
  toggleCalc(ctx: FemToolsContext): void {
    if (!this._calc) {
      this._calc = createCalcPanel({
        getModelVars: () => buildModelVars({
          nodes: ctx.nodes.rawVal,
          elements: ctx.elements.rawVal,
        }),
      });
    }
    this._calc.toggle();
  }

  /** 💻 CLI cad.* — abre terminal flotante */
  toggleCli(ctx: FemToolsContext): void {
    if (!this._cli) {
      const cad = buildCadApi({
        nodes: ctx.nodes,
        elements: ctx.elements,
        nodeInputs: ctx.nodeInputs,
        elementInputs: ctx.elementInputs,
        deformOutputs: ctx.deformOutputs,
        onModelChange: () => ctx.onRebuild?.(),
      });
      this._cli = createCliPanel({ cad });
    }
    this._cli.toggle();
  }

  /** 📄 Report Explained — abre nueva ventana con HTML imprimible (PDF native) */
  openReport(ctx: FemToolsContext): void {
    openReportExplained({
      nodes: ctx.nodes.rawVal,
      elements: ctx.elements.rawVal,
      nodeInputs: ctx.nodeInputs.rawVal,
      elementInputs: ctx.elementInputs.rawVal,
      deformOutputs: ctx.deformOutputs.rawVal,
      analyzeOutputs: ctx.analyzeOutputs.rawVal,
      title: ctx.currentExample?.name ?? "Hekatan FEM Report",
      subtitle: `Generado desde workspace · ${new Date().toLocaleString()}`,
    });
  }

  /** ▶ Calcular — fuerza re-build del ejemplo activo + runModal si aplica */
  forceRecalc(ctx: FemToolsContext): void {
    try {
      ctx.onRebuild?.();
      if (ctx.currentExample?.hasModal && ctx.currentExample.runModal) {
        const states = {
          nodes: ctx.nodes, elements: ctx.elements,
          nodeInputs: ctx.nodeInputs, elementInputs: ctx.elementInputs,
          deformOutputs: ctx.deformOutputs, analyzeOutputs: ctx.analyzeOutputs,
          objects3D: ctx.objects3D,
        };
        try {
          ctx.currentExample.runModal(ctx.currentParams ?? {}, states, ctx.modalPanelLegacy);
        } catch {
          // silencioso si falla — el rebuild ya disparó el solver estático
        }
      }
    } catch (e: any) {
      alert("Error al recalcular: " + e.message);
    }
  }

  /** Limpia todos los paneles (al destruir el workspace). */
  destroy(): void {
    this._inspect?.destroy();
    this._modal?.destroy();
    this._solverLog?.destroy();
    this._calc?.destroy();
    this._cli?.destroy();
    this._inspect = null;
    this._modal = null;
    this._solverLog = null;
    this._calc = null;
    this._cli = null;
  }

  // Acceso público (para tests o debug)
  get inspectPanel() { return this._inspect; }
  get modalPanel() { return this._modal; }
  get solverLog() { return this._solverLog; }
  get calcPanel() { return this._calc; }
  get cliPanel() { return this._cli; }
}

// Singleton compartido en window — un solo registry para todo el workspace
let _shared: FemToolsRegistry | null = null;
export function getSharedFemToolsRegistry(): FemToolsRegistry {
  if (!_shared) _shared = new FemToolsRegistry();
  return _shared;
}
