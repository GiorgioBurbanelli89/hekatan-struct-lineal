/**
 * Manejo de eventos mouse del CAD Drawer.
 * Convierte un click en pantalla a un punto del plano de trabajo,
 * con snap a la grid, y dispara la acción correspondiente al tool activo.
 */
import * as THREE from "three";
import {
  getState, addNodeAt, addLine, addArea, fillCellAt,
} from "./cadDrawState";
import { findNodeAt, snapVec3, type Vec3 } from "./cadDrawTypes";

// Raycaster reutilizable (no crear en cada move).
const raycaster = new THREE.Raycaster();
const pointerNDC = new THREE.Vector2();

/**
 * Convierte un PointerEvent a punto en mundo, proyectando al plano de
 * trabajo del estado actual ("xy", "xz" o "yz" + cota fija).
 */
export function pointerToWorld(
  ev: PointerEvent,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
): Vec3 | null {
  const rect = canvas.getBoundingClientRect();
  pointerNDC.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNDC.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointerNDC, camera);

  // Construir el plano según workPlane del estado
  const st = getState();
  let plane: THREE.Plane;
  if (st.workPlane === "xy") {
    plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -st.workZ);
  } else if (st.workPlane === "xz") {
    plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  } else {  // yz
    plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
  }
  const hit = new THREE.Vector3();
  if (!raycaster.ray.intersectPlane(plane, hit)) return null;
  return [hit.x, hit.y, hit.z];
}

/**
 * Acción de click — depende del tool activo.
 * Si snap > 0, redondea coords a múltiplos de snap.
 * Devuelve el ID del nodo creado/seleccionado (para feedback).
 */
export function handleClick(world: Vec3): { action: string; nodeId?: number; lineId?: number; areaId?: number } | null {
  const st = getState();
  const snapped = st.snap > 0 ? snapVec3(world, st.snap) : world;
  const existing = findNodeAt(st.model, snapped, 0.05);

  switch (st.tool) {
    case "node": {
      // Solo crea si no hay un nodo ya cerca
      if (existing) return { action: "node-exists", nodeId: existing.id };
      const n = addNodeAt(snapped);
      return { action: "node-created", nodeId: n.id };
    }
    case "line": {
      const nodeId = existing ? existing.id : addNodeAt(snapped).id;
      st.pendingNodes.push(nodeId);
      if (st.pendingNodes.length === 2) {
        const [a, b] = st.pendingNodes;
        if (a !== b) {
          const l = addLine(a, b, "frame");
          st.pendingNodes = [];
          return { action: "line-created", lineId: l.id };
        }
        st.pendingNodes = [];
        return { action: "line-cancel-same-node" };
      }
      return { action: "line-pending", nodeId };
    }
    case "area": {
      const nodeId = existing ? existing.id : addNodeAt(snapped).id;
      st.pendingNodes.push(nodeId);
      if (st.pendingNodes.length === 4) {
        const a = addArea([...st.pendingNodes], "shell");
        st.pendingNodes = [];
        return { action: "area-created", areaId: a.id };
      }
      return { action: "area-pending", nodeId };
    }
    case "fillarea": {
      // Click en el VACÍO encerrado por barras → crea el área de esa celda.
      // Se usa el punto CRUDO (no snapped): interesa dónde clickeó, no un nudo.
      const a = fillCellAt(world);
      return a ? { action: "area-filled", areaId: a.id } : { action: "fillarea-no-cell" };
    }
    case "select":
      return { action: "select", nodeId: existing?.id };
    default:
      return { action: "noop" };
  }
}

/** Cancelar el modo actual (presionar Escape, click derecho, etc.) */
export function cancelPending(): void {
  const st = getState();
  st.pendingNodes = [];
}

/**
 * Helper: simular un click en world coords (para test via DOM).
 * No requiere mouse real — útil para test programático.
 */
export function simulateClick(world: Vec3): ReturnType<typeof handleClick> {
  return handleClick(world);
}

// Expose to window para test/debug
(window as any).__hekatanCadMouse = {
  click: handleClick,
  simulate: simulateClick,
  cancel: cancelPending,
  pointerToWorld,
};
