/**
 * Estado central del CAD Drawer + sincronización con CLI Modeler.
 *
 * El CAD produce CLI commands (texto) que se almacenan en
 * window.__hekatanCliScript. Si el usuario abre cli-modeler ve los
 * mismos comandos y puede editarlos. Si cambia al CAD, ve los nodos
 * dibujados. Es UN SOLO MODELO, dos VISTAS.
 */
import { emptyState, type CadDrawState, type CadNode, type CadLine, type CadArea } from "./cadDrawTypes";

let state: CadDrawState = emptyState();

export function getState(): CadDrawState {
  return state;
}

export function resetState(): void {
  state = emptyState();
  syncToCliScript();
}

/**
 * Reconstruir el script CLI a partir del modelo CAD actual.
 * Esto se llama después de cada acción de dibujo (addNode, addLine, etc.)
 * para que cli-modeler vea los comandos en tiempo real.
 */
export function syncToCliScript(): void {
  const lines: string[] = [
    "# CAD Drawer — modelo dibujado con mouse",
    "# (estos comandos se generan automaticamente cuando dibujas con CAD)",
    "",
  ];

  // Nodos
  if (state.model.nodes.size > 0) lines.push("# Nodos");
  for (const n of state.model.nodes.values()) {
    lines.push(`node ${n.id}  ${n.pos[0]}  ${n.pos[1]}  ${n.pos[2]}`);
  }
  if (state.model.nodes.size > 0) lines.push("");

  // Frames (lineas)
  if (state.model.lines.size > 0) lines.push("# Frames");
  for (const l of state.model.lines.values()) {
    if (l.kind === "edge") continue;  // edges puramente visuales no van al FEM
    lines.push(`frame ${l.id}  ${l.nI} ${l.nJ}  25e6  0.16  0.0021`);
  }
  if (state.model.lines.size > 0) lines.push("");

  // Shells (areas)
  if (state.model.areas.size > 0) lines.push("# Shells");
  for (const a of state.model.areas.values()) {
    if (a.pts.length < 3) continue;
    if (a.pts.length === 4) {
      lines.push(`shell ${a.id}  ${a.pts.join(" ")}  0.20  25e6`);
    } else {
      // Triángulo: dejar como comentario porque shell solo soporta Q4
      lines.push(`# shell ${a.id} (3 nodos — triangle, FEM no soportado, solo visual)`);
    }
  }
  if (state.model.areas.size > 0) lines.push("");

  (window as any).__hekatanCliScript = lines.join("\n");
}

export function addNodeAt(pos: [number, number, number]): CadNode {
  const id = state.nextNodeId++;
  const node: CadNode = { id, pos };
  state.model.nodes.set(id, node);
  syncToCliScript();
  return node;
}

export function addLine(nI: number, nJ: number, kind: "frame" | "edge" = "frame"): CadLine {
  const id = state.nextLineId++;
  const line: CadLine = { id, nI, nJ, kind };
  state.model.lines.set(id, line);
  syncToCliScript();
  return line;
}

export function addArea(pts: number[], kind: "shell" | "panel" = "shell"): CadArea {
  const id = state.nextAreaId++;
  const area: CadArea = { id, pts, kind };
  state.model.areas.set(id, area);
  syncToCliScript();
  return area;
}

export function removeNode(id: number): boolean {
  const ok = state.model.nodes.delete(id);
  // Limpiar cualquier line/area que referencie ese nodo
  for (const [lid, l] of state.model.lines) {
    if (l.nI === id || l.nJ === id) state.model.lines.delete(lid);
  }
  for (const [aid, a] of state.model.areas) {
    if (a.pts.includes(id)) state.model.areas.delete(aid);
  }
  if (ok) syncToCliScript();
  return ok;
}

// ── Rellenar áreas encerradas por barras (como el "draw floor" de ETABS, pero
// sobre barras sueltas que cierran una celda de 3 o 4 lados) ──────────────────
type Vec3b = [number, number, number];

/** Celdas CERRADAS (cuadriláteros sin diagonal + triángulos) del grafo de barras. */
export function detectClosedCells(): number[][] {
  const adj = new Map<number, Set<number>>();
  for (const l of state.model.lines.values()) {
    if (!adj.has(l.nI)) adj.set(l.nI, new Set());
    if (!adj.has(l.nJ)) adj.set(l.nJ, new Set());
    adj.get(l.nI)!.add(l.nJ); adj.get(l.nJ)!.add(l.nI);
  }
  const has = (a: number, b: number) => !!adj.get(a)?.has(b);
  const ids = [...adj.keys()];
  const seen = new Set<string>(); const cells: number[][] = [];
  // Cuadriláteros a-b-c-d SIN cuerda (las 2 diagonales NO existen)
  for (const a of ids) for (const b of adj.get(a)!) { if (b < a) continue;
    for (const c of adj.get(b)!) { if (c === a) continue;
      for (const d of adj.get(c)!) { if (d === a || d === b || !has(d, a)) continue;
        if (has(a, c) || has(b, d)) continue;
        const k = [a, b, c, d].slice().sort((x, y) => x - y).join("-");
        if (!seen.has(k)) { seen.add(k); cells.push([a, b, c, d]); } } } }
  // Triángulos a-b-c
  for (const a of ids) for (const b of adj.get(a)!) { if (b < a) continue;
    for (const c of adj.get(b)!) { if (c === a || !has(c, a)) continue;
      const k = [a, b, c].slice().sort((x, y) => x - y).join("-");
      if (!seen.has(k)) { seen.add(k); cells.push([a, b, c]); } } }
  return cells;
}

const _areaKey = (pts: number[]) => pts.slice().sort((x, y) => x - y).join("-");
function _to2(p: Vec3b): [number, number] {
  return state.workPlane === "xy" ? [p[0], p[1]] : state.workPlane === "xz" ? [p[0], p[2]] : [p[1], p[2]];
}
function _pointInPoly(p: [number, number], poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > p[1]) !== (yj > p[1])) && (p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
function _polyArea(poly: [number, number][]): number {
  let a = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]);
  return Math.abs(a) / 2;
}

/** Rellena TODAS las celdas cerradas que aún no tengan área. Devuelve cuántas creó. */
export function fillClosedCells(): number {
  const existentes = new Set([...state.model.areas.values()].map((a) => _areaKey(a.pts)));
  let n = 0;
  for (const c of detectClosedCells()) { const k = _areaKey(c); if (existentes.has(k)) continue; addArea(c, "shell"); existentes.add(k); n++; }
  return n;
}

/** Click en el VACÍO entre barras: crea el área de la celda cerrada MÁS PEQUEÑA que contiene el punto. */
export function fillCellAt(pt: Vec3b): CadArea | null {
  const P = _to2(pt);
  let best: number[] | null = null, bestA = Infinity;
  for (const c of detectClosedCells()) {
    const poly = c.map((id) => _to2(state.model.nodes.get(id)!.pos)) as [number, number][];
    if (!_pointInPoly(P, poly)) continue;
    const A = _polyArea(poly);
    if (A < bestA) { bestA = A; best = c; }
  }
  if (!best) return null;
  const k = _areaKey(best);
  if ([...state.model.areas.values()].some((a) => _areaKey(a.pts) === k)) return null;   // ya existe
  return addArea(best, "shell");
}

export function setTool(t: CadDrawState["tool"]): void {
  state.tool = t;
  state.pendingNodes = [];  // Reset buffer al cambiar tool
}

export function setSnap(s: number): void {
  state.snap = Math.max(0, s);
}

export function setWorkPlane(p: CadDrawState["workPlane"]): void {
  state.workPlane = p;
  state.pendingNodes = [];
}

export function setWorkZ(z: number): void {
  state.workZ = z;
}

/** Estadísticas del modelo (para mostrar en Tweakpane). */
export function getStats() {
  return {
    nodes: state.model.nodes.size,
    lines: state.model.lines.size,
    areas: state.model.areas.size,
    solids: state.model.solids.size,
    tool: state.tool,
    snap: state.snap,
    workPlane: state.workPlane,
    workZ: state.workZ,
    pending: state.pendingNodes.length,
  };
}

// Expose to window for debug + para que CAD/CLI puedan leer/editar el estado
(window as any).__hekatanCadState = {
  get: getState,
  reset: resetState,
  addNode: addNodeAt,
  addLine,
  addArea,
  setTool,
  getStats,
  detectClosedCells,
  fillClosedCells,
  fillCellAt,
};
