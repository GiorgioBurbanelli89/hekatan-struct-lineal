/**
 * Los GDL DISPONIBLES de un modelo al exportarlo a SAP2000 y ETABS («Available DOFs» /
 * «Active Degrees of Freedom»).
 *
 * POR QUÉ (28-sep-2026, muro de Manabí): una MEMBRANA plana no tiene rigidez fuera de su plano.
 * En Hekatan el solver saca solo esos GDL (`getZerosIndices`); en CSI hay que decírselo al
 * análisis, o el modelo sale inestable. La alternativa —atar uy, rx y rz nudo a nudo— resuelve
 * igual pero llena el visor de apoyos que no existen.
 *
 * Solo se recorta cuando el modelo es PLANO (todos los nudos en un plano coordenado) y TODOS sus
 * elementos son membranas (cáscaras sin flexión). Cualquier barra, sólido o cáscara con flexión
 * deja los seis.
 */
import type { Node, Element, ElementInputs } from "hekatan-fem";

/** [UX, UY, UZ, RX, RY, RZ] */
export type GdlDisponibles = [boolean, boolean, boolean, boolean, boolean, boolean];

export function gdlDisponibles(nodes: Node[], elements: Element[], elementInputs: ElementInputs): GdlDisponibles {
  const todos: GdlDisponibles = [true, true, true, true, true, true];
  if (!nodes.length || !elements.length) return todos;
  const ei = elementInputs as any;
  const esMembrana = (e: Element, i: number): boolean => {
    if (e.length !== 3 && e.length !== 4) return false;
    const m = ei.shellModifiers?.get?.(i);
    if (Array.isArray(m) && m.length >= 6) return Math.abs(m[3]) + Math.abs(m[4]) + Math.abs(m[5]) < 1e-12;
    const b = ei.bendingModifiers?.get?.(i);
    return b !== undefined && Math.abs(b) < 1e-12;
  };
  if (!elements.every(esMembrana)) return todos;
  let tam = 0;
  for (let k = 0; k < 3; k++) {
    let mn = Infinity, mx = -Infinity;
    for (const n of nodes) { mn = Math.min(mn, n[k]); mx = Math.max(mx, n[k]); }
    tam = Math.max(tam, mx - mn);
  }
  for (let k = 0; k < 3; k++) {             // k = eje NORMAL al plano
    const c = nodes[0][k];
    if (!nodes.every((n) => Math.abs(n[k] - c) <= 1e-9 * Math.max(1, tam))) continue;
    // en el plano: las dos traslaciones que no son k y el giro alrededor de k (el giro normal)
    return [k !== 0, k !== 1, k !== 2, k === 0, k === 1, k === 2];
  }
  return todos;
}
