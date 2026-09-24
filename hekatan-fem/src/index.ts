export * from "./data-model";

export { analyze } from "./analyze";
// export { deform } from "./deform";
export { deformCpp as deform } from "./deformCpp";

export { modalCpp as modalAnalysis } from "./modalCpp";
export { modalPazCpp as modalAnalysisPaz } from "./modalPazCpp";

export { slopeSRM } from "./slopeCpp";
export type { SlopeInput, SlopeOutput } from "./slopeCpp";

export { plateQ4Solve } from "./plateQ4Cpp";
export { didacticSolveCpp } from "./didacticCpp";
export type { DidacticSolverResult, DidacticElementData } from "./didacticCpp";
export type {
  PlateQ4Input,
  PlateQ4Output,
  PlateQ4NodeResult,
  PlateQ4ElementResult,
} from "./plateQ4Cpp";

// Plane Q4 (plane stress, pure TS — independent of C++ plateQ4)
export { planeQ4Solve } from "./planeQ4";
export type {
  PlaneQ4Input,
  PlaneQ4Output,
  PlaneQ4NodeResult,
  PlaneQ4ElementResult,
} from "./planeQ4";

// Layered Shell Q4 — Classical Laminate Theory (TS puro)
// Soporta: capas con diferentes E, nu, espesor, angulo, densidad.
// Computa matrices ABBD, resuelve Q4 Mindlin-Reissner con coupling
// membrane-bending para laminados asimetricos.
export { computeABBD, printABBD, layeredShellSolveABBD } from "./layeredShell";
export type { LayerDef, LayeredQ4Input, ABBD, StressMode } from "./layeredShell";
export { layeredQ4Solve } from "./layeredQ4";
export type { LayeredQ4SolveInput, LayeredQ4Output } from "./layeredQ4";

// MITC3 triangular plate bending (Bathe 2013 MITC3+, pure TS)
export { mitc3Solve } from "./mitc3";
export type {
  Mitc3Input,
  Mitc3Output,
  Mitc3NodeResult,
  Mitc3ElementResult,
} from "./mitc3";

// CFT Fiber Section — Mander confined concrete + Menegotto-Pinto steel (Level 2)
export {
  manderConfinedConcrete, manderStress, steelStress,
  discretizeCftCircular, discretizeCftRectangular,
  sectionForces, momentForAxial, pmInteractionFiber,
} from "./fiberSectionCft";
export type {
  ManderParams, ManderResult, SteelParams, Fiber, CftFiberSection,
} from "./fiberSectionCft";

// Menegotto-Pinto uniaxial cyclic steel material (Steel02 OpenSees-style)
export {
  initMpState, mpStep, mpHistory,
  aiscK3LoadingProtocol, aiscK3StrainHistory,
} from "./menegottoPinto";
export type {
  MenegottoPintoParams, MenegottoPintoState,
} from "./menegottoPinto";

// Internal utils exposed for FEM inspection/debugging
export { getLocalStiffnessMatrix } from "./utils/getLocalStiffnessMatrix";
export { getTransformationMatrix } from "./utils/getTransformationMatrix";

export { kPano, kPanoQ4, kLocalMotor, dkqBendingK, ejesLocalesQ4 } from "./utils/shellElementK";
export type { KPano } from "./utils/shellElementK";
