/**
 * 🛠 attachFemTools — agrega el folder "Herramientas FEM" al Tweakpane
 * principal del workspace.
 *
 *  Este es el orquestador entre los paneles individuales (Inspect, Modal+,
 *  Calc, CLI, Log) y el Tweakpane del ejemplo activo. Detecta capabilities
 *  del ejemplo (`hasModal`) y muestra solo los botones relevantes.
 *
 *  Uso desde el workspace:
 *
 *    import { attachFemTools } from "hekatan-ui";
 *
 *    // En `buildParamsPane()`, después de crear `pane`:
 *    attachFemTools(pane, {
 *      nodes, elements, nodeInputs, elementInputs,
 *      deformOutputs, analyzeOutputs, objects3D,
 *      currentExample, currentParams,
 *      modalPanelLegacy: modalPanel,
 *      onRebuild: () => (window as any).__hekatanRebuild?.(),
 *    });
 *
 *  Eso agrega automáticamente:
 *    🛠 Herramientas FEM ▼
 *      🔍 Inspect — derivación FEM
 *      📈 Modal+ ASCE 7-22 (solo si hasModal)
 *      📜 Registro del solver
 *      🧮 Calculadora FEM (MATLAB-style)
 *      💻 CLI cad.* (terminal)
 *      📄 Report Explained (PDF imprimible)
 *      ▶ Calcular (forzar re-build)
 */
import {
  getSharedFemToolsRegistry,
  type FemToolsContext,
} from "./femToolsRegistry";

export interface AttachFemToolsOptions {
  /** Título del folder (default: "🛠 Herramientas FEM") */
  title?: string;
  /** Folder expandido al cargar (default: false) */
  expanded?: boolean;
  /**
   * Filtro de qué botones mostrar. Si se omite, todos visibles
   * (excepto Modal+ que es condicional a `currentExample.hasModal`).
   */
  visibleButtons?: {
    inspect?: boolean;
    modal?: boolean;
    solverLog?: boolean;
    calc?: boolean;
    cli?: boolean;
    report?: boolean;
    recalc?: boolean;
  };
}

/**
 * Agrega el folder "Herramientas FEM" al Tweakpane.
 *
 * @param pane Tweakpane principal del workspace (puede ser un Pane o un FolderApi)
 * @param ctx Contexto reactivo del modelo activo
 * @param opts Configuración opcional
 * @returns El folder creado (por si el caller quiere agregarle algo más)
 */
export function attachFemTools(
  pane: any,
  ctx: FemToolsContext,
  opts: AttachFemToolsOptions = {},
): any {
  const reg = getSharedFemToolsRegistry();
  const visible = {
    inspect: true, modal: true, solverLog: true,
    calc: true, cli: true, report: true, recalc: true,
    ...(opts.visibleButtons ?? {}),
  };

  const folder = pane.addFolder({
    title: opts.title ?? "🛠 Herramientas FEM",
    expanded: opts.expanded ?? false,
  });

  if (visible.inspect) {
    folder.addButton({ title: "🔍 Inspect — derivación FEM por elemento" })
      .on("click", () => reg.toggleInspect(ctx));
  }

  // Modal+ es condicional: solo si el ejemplo lo soporta
  if (visible.modal && ctx.currentExample?.hasModal) {
    folder.addButton({ title: "📈 Modal+ ASCE 7-22 §12.9.1" })
      .on("click", () => reg.toggleModal(ctx));
  }

  if (visible.solverLog) {
    folder.addButton({ title: "📜 Registro del solver" })
      .on("click", () => reg.toggleSolverLog(ctx));
  }

  if (visible.calc) {
    folder.addButton({ title: "🧮 Calculadora FEM (MATLAB-style)" })
      .on("click", () => reg.toggleCalc(ctx));
  }

  if (visible.cli) {
    folder.addButton({ title: "💻 CLI cad.* (terminal)" })
      .on("click", () => reg.toggleCli(ctx));
  }

  if (visible.report) {
    folder.addButton({ title: "📄 Report Explained (PDF imprimible)" })
      .on("click", () => reg.openReport(ctx));
  }

  if (visible.recalc) {
    folder.addButton({ title: "▶ Calcular (forzar re-build)" })
      .on("click", () => reg.forceRecalc(ctx));
  }

  return folder;
}
