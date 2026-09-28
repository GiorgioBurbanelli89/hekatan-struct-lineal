/**
 * El CORTE de un sólido, relleno.
 *
 * Los planos de corte X/Y/Z del visor recortan en la tarjeta gráfica. Con cáscaras vale; con un
 * sólido no: de un sólido solo se dibuja la piel, así que al recortarla se ve el hueco y, al
 * fondo, la piel del otro lado. Lo que se quiere ver es la SECCIÓN, con su color.
 *
 * Por eso en los sólidos el corte se hace por ELEMENTOS: se quitan los hexaedros cuyo centro
 * queda del lado cortado y se vuelve a sacar la piel de los que quedan. La cara que compartían
 * con uno quitado pasa a ser piel, y el corte sale relleno (escalonado por la malla).
 */
import van, { State } from "vanjs-core";
import type { Element, Node } from "hekatan-fem";

/** Sube cada vez que cambian los planos de corte: lo leen los objetos que dibujan sólidos. */
export const versionCorte: State<number> = van.state(0);

interface EstadoCorte {
  enableX: boolean; enableY: boolean; enableZ: boolean;
  posX: number; posY: number; posZ: number;
  invertX: boolean; invertY: boolean; invertZ: boolean;
}

/**
 * Qué hexaedros se dibujan con el corte que hay puesto. `undefined` = todos.
 * Mismo criterio que el plano de la tarjeta gráfica: sin invertir se conserva coord ≤ pos.
 */
export function mostrarSegunCorte(elements: Element[], nodes: Node[]): ((ei: number) => boolean) | undefined {
  const s = (globalThis as any).__hekatanClip as EstadoCorte | undefined;
  if (!s || !(s.enableX || s.enableY || s.enableZ)) return undefined;
  const ejes: Array<[boolean, number, boolean]> = [
    [s.enableX, s.posX, s.invertX], [s.enableY, s.posY, s.invertY], [s.enableZ, s.posZ, s.invertZ],
  ];
  return (ei: number) => {
    const e = elements[ei];
    if (!e || e.length !== 8) return true;
    const c = [0, 0, 0];
    for (const n of e) { const p = nodes[n]; if (!p) return true; c[0] += p[0] / 8; c[1] += p[1] / 8; c[2] += p[2] / 8; }
    for (let d = 0; d < 3; d++) {
      const [on, pos, inv] = ejes[d];
      if (!on) continue;
      if (inv ? c[d] < pos : c[d] > pos) return false;
    }
    return true;
  };
}
