/**
 * Tipos compartidos del CAD Drawer.
 * Modelo: nodos numerados + lineas (frames) + areas (shells) + solidos.
 */

export type Vec3 = [number, number, number];

export interface CadNode {
  id: number;
  pos: Vec3;
}

export interface CadLine {
  id: number;
  nI: number;  // node id
  nJ: number;
  /** Tipo: "frame" para Bernoulli FEM, "edge" para borde puro visual */
  kind?: "frame" | "edge";
}

export interface CadArea {
  id: number;
  pts: number[];  // node ids (3 o 4)
  /** "shell" = Q4 FEM, "panel" = polígono visual */
  kind?: "shell" | "panel";
}

export interface CadSolid {
  id: number;
  pts: number[];  // node ids (8 para hexaedro)
}

// Las herramientas del motor de dibujo (drawing.ts) son más que estas cinco:
// polyline, rect, circle, arc, col, wall, move, copy, delete… Se admite
// cualquier nombre para no tener dos listas que mantener.
export type CadTool = "select" | "node" | "line" | "area" | "solid" | (string & {});

export interface CadModel {
  nodes: Map<number, CadNode>;
  lines: Map<number, CadLine>;
  areas: Map<number, CadArea>;
  solids: Map<number, CadSolid>;
}

export function emptyModel(): CadModel {
  return {
    nodes: new Map(),
    lines: new Map(),
    areas: new Map(),
    solids: new Map(),
  };
}

export interface CadDrawState {
  model: CadModel;
  /** Tool activo (cambia con clicks en folder Tweakpane) */
  tool: CadTool;
  /** Snap del cursor a grid (cuando el mouse pasa) */
  snap: number;
  /** Plano de trabajo: "xy" (planta), "xz" (elevación), "yz" */
  workPlane: "xy" | "xz" | "yz";
  /** Cota Z fija cuando trabajamos en plano XY (planta de un piso) */
  workZ: number;
  /** Buffer de puntos pendientes (line: 1 click acumulado, area: 1-3 clicks) */
  pendingNodes: number[];
  /** Próximo ID auto-incremental para nodos/lineas/etc. */
  nextNodeId: number;
  nextLineId: number;
  nextAreaId: number;
  nextSolidId: number;
}

export function emptyState(): CadDrawState {
  return {
    model: emptyModel(),
    // Default = "select" → click solo orbita la cámara, no crea geometría.
    // El usuario debe activar EXPLÍCITAMENTE un tool de dibujo desde Tweakpane.
    tool: "select",
    snap: 0.5,
    workPlane: "xy",
    workZ: 0,
    pendingNodes: [],
    nextNodeId: 1,
    nextLineId: 1,
    nextAreaId: 1,
    nextSolidId: 1,
  };
}

/** Snap un valor al múltiplo más cercano de step. */
export function snapTo(v: number, step: number): number {
  if (step <= 0) return v;
  return Math.round(v / step) * step;
}

/** Snap un Vec3 a la grid del estado. */
export function snapVec3(v: Vec3, step: number): Vec3 {
  return [snapTo(v[0], step), snapTo(v[1], step), snapTo(v[2], step)];
}

/** Encontrar nodo existente (dentro de tolerancia) — si no existe retorna null. */
export function findNodeAt(model: CadModel, pos: Vec3, tol = 0.05): CadNode | null {
  for (const n of model.nodes.values()) {
    const dx = n.pos[0] - pos[0];
    const dy = n.pos[1] - pos[1];
    const dz = n.pos[2] - pos[2];
    if (Math.sqrt(dx*dx + dy*dy + dz*dz) < tol) return n;
  }
  return null;
}
