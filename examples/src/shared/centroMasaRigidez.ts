/**
 * Centro de Masa (CM) y Centro de Rigidez (CR) por piso — cuando hay diafragma rígido.
 * Método de ETABS (validado vs edificio_muro Python <0.1%):
 *   CM = centroide de masa:  CM = Σ(mᵢ·posᵢ) / Σmᵢ
 *   CR = punto de rotación nula: se aplican cargas unitarias Fx, Fy, Mz al master del
 *        diafragma rígido y se leen las rotaciones rz; entonces
 *          X_CR = x_master − rz(Fy)/rz(Mz)
 *          Y_CR = y_master + rz(Fx)/rz(Mz)
 *   Excentricidad e = CM − CR (genera la torsión: M_t = V·e). La accidental ±5% se suma aparte.
 *
 * Usar junto a addRigidDiaphragms() (rigidDiaphragm.ts) que crea el master por piso.
 */
import type { Node } from "hekatan-fem";

export interface CMCRStory {
  story: number; z: number;
  cm: { x: number; y: number };
  cr: { x: number; y: number };
  /** Excentricidad natural e = CM − CR */
  ecc: { ex: number; ey: number };
}

/** Centro de masa de un conjunto de nudos con masas. */
export function centerOfMass(
  nodes: Node[], masses: Map<number, number>, storyNodes?: number[]
): { x: number; y: number } {
  let mt = 0, mx = 0, my = 0;
  const it = storyNodes ?? [...masses.keys()];
  for (const i of it) {
    const m = masses.get(i) ?? 0;
    mt += m; mx += m * nodes[i][0]; my += m * nodes[i][1];
  }
  return mt > 1e-30 ? { x: mx / mt, y: my / mt } : { x: 0, y: 0 };
}

/** CR a partir de las rotaciones rz del master bajo cargas unitarias Fx, Fy, Mz. */
export function centerOfRigidity(
  masterX: number, masterY: number, rzFx: number, rzFy: number, rzMz: number
): { x: number; y: number } {
  if (Math.abs(rzMz) < 1e-30) return { x: masterX, y: masterY };
  return { x: masterX - rzFy / rzMz, y: masterY + rzFx / rzMz };
}

/**
 * Calcula CM, CR y excentricidad de un piso/diafragma.
 * @param solveMasterRz  callback que aplica un vector de carga [Fx,Fy,Fz,Mx,My,Mz] en el
 *   master del diafragma, resuelve el FEM y devuelve la rotación rz del master. El ejemplo
 *   lo conecta a `deform(...)` (motor C++/WASM o Python).
 */
export function computeCMCR(
  nodes: Node[],
  masses: Map<number, number>,
  storyNodes: number[],
  master: { idx: number; x: number; y: number; z: number },
  solveMasterRz: (load: [number, number, number, number, number, number]) => number,
): CMCRStory {
  const cm = centerOfMass(nodes, masses, storyNodes);
  const rzFx = solveMasterRz([1, 0, 0, 0, 0, 0]);
  const rzFy = solveMasterRz([0, 1, 0, 0, 0, 0]);
  const rzMz = solveMasterRz([0, 0, 0, 0, 0, 1]);
  const cr = centerOfRigidity(master.x, master.y, rzFx, rzFy, rzMz);
  return { story: 0, z: master.z, cm, cr, ecc: { ex: cm.x - cr.x, ey: cm.y - cr.y } };
}

/** Excentricidad accidental NEC-SE-DS / ASCE 7 = ±5% de la dimensión en planta. */
export function accidentalEccentricity(planDimX: number, planDimY: number, ratio = 0.05) {
  return { ex: ratio * planDimX, ey: ratio * planDimY };
}
