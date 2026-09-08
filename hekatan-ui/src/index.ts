// ── Existing exports ────────────────────────────────────────────────
export type { Parameters } from "./parameters/getParameters";
export type { Drawing } from "./viewer/drawing/drawing";

export { getViewer, colorMapUnit, colorMapForceUnit, colorMapDispUnit, colorMapStressUnit, fixedColorMapRange } from "./viewer/getViewer";
export type { StressUnit } from "./viewer/getViewer";
export { makeDraggablePane, enableDraggableAllPanes } from "./viewer/settings/makeDraggable";
export { getParameters } from "./parameters/getParameters";
export { getTables } from "./tables/getTables";
export { getTable } from "./table/getTable";
export { getLegend } from "./color-map/getLegend";
export { getColorMap } from "./color-map/getColorMap";
export { getToolbar } from "./toolbar/getToolbar";
export { getDialog } from "./dialog/getDialog";
export { getReport } from "./report/getReport";
export { addCadPanel } from "./cad/getCadPanel";
export { addCadRibbon } from "./cad/getCadRibbon";
export { addCadStatusBar } from "./cad/getCadStatusBar";
export type { RibbonHooks } from "./cad/getCadRibbon";
export type { CadPanelOptions, GridTargetVal } from "./cad/getCadPanel";
export {
  buildAxisGridMesh, buildLevelMesh,
  nextAxisLabel, nextLevelLabel,
} from "./cad/axisLevels";
export type { AxisGrid, Level } from "./cad/axisLevels";
export {
  PROVIDERS as AI_PROVIDERS, getProvider, aiStorage,
  blobToBase64, listOllamaModels, isOllamaRunning, HEKATAN_SYSTEM_PROMPT,
} from "./cad/aiAssistant";
export type { AIProvider, AIMessage, AIImage } from "./cad/aiAssistant";
export { getTheme, getThemeName, setTheme, toggleTheme, onThemeChange } from "./theme";
export type { ThemeName, ThemeColors } from "./theme";

// ── 🆕 New modules — FEM Studio porting ─────────────────────────────

// 🔍 Inspect Panel — didactic FEM derivation per element (KaTeX)
export { createInspectPanel } from "./inspect";
export type { InspectPanelApi, InspectElementData } from "./inspect";
export {
  computeFrameMatrices, localStiffness12, directionCosines, buildT12, matrixToText,
} from "./inspect";
export type { FrameElementProps, FrameElementGeom, FrameMatrices } from "./inspect";

// 📈 Modal Panel — ASCE 7-22 §12.9.1 mass participation + animation
export { createModalPanel } from "./modalPanel";
export type { ModalPanelApi, ModalPanelOptions, ModalPanelMeta } from "./modalPanel";

// 📜 Solver Log — step-by-step solver derivation with timings
export { createSolverLog } from "./solverLog";
export type { SolverLogApi, SolverStats } from "./solverLog";

// 🧮 Calc Panel — symbolic calculator with KaTeX output
export { createCalcPanel } from "./calcPanel";
export type { CalcPanelApi, CalcPanelOptions } from "./calcPanel";
export { evaluateBlock as evaluateCalcBlock, buildModelVars, getDefaultTemplate } from "./calcPanel";

// 💻 CLI Panel — programmable cad.* terminal
export { createCliPanel, buildCadApi, evalCliLine, getCliHelp } from "./cli";
export type { CliPanelApi, CliPanelOptions, CadApi, CliBindings } from "./cli";

// 🎯 View modes — 3D / Plan / EX / EY + Ejes A-Z, 1-N + Plantas P1, P2, ...
export {
  // Vistas globales
  setView3D, setViewPlan, setViewElevationX, setViewElevationY, applyViewMode,
  // Vistas por eje y planta (estilo ETABS)
  setViewAxisX, setViewAxisY, setViewPlanta,
  // Detección automática
  detectGridAxes, detectStories, measureModelBounds,
  // Etiquetas (A, B, C / 1, 2, 3 / Base, P1, P2)
  axisLabelX, axisLabelY, plantaLabel,
  // Clipping
  setStoryClip, setAxisClipX, setAxisClipY, clearStoryClip, clearClipping,
} from "./viewer/viewModes";
export type { ViewMode, ViewerCtxLike, BoundingInfo } from "./viewer/viewModes";

// 📄 Report Explained — full HTML/PDF derivation report
export {
  generateReportHtml, openReportExplained, renderReportInline,
} from "./report/reportExplained";
export type { ReportInput } from "./report/reportExplained";

// 🛠 FEM Tools orchestrator — folder Tweakpane unificado con todos los paneles
export {
  attachFemTools,
  FemToolsRegistry, getSharedFemToolsRegistry,
} from "./femTools";
export type {
  AttachFemToolsOptions, FemToolsContext,
} from "./femTools";
