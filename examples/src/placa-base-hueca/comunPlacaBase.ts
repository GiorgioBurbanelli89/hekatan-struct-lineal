/**
 * Lo común de `placa-base-hueca` y `placa-base-cft` que NO es el modelo (el modelo va entero en
 * cada ejemplo, cada uno con su código).
 *
 * Las dos páginas de antes ponían «Rango colormap → solo losas» (`colorMapScope.val = "losas"` de
 * hekatan-ui): la barra de colores tomaba el rango de la PLACA BASE, no de la cabeza del tubo, donde
 * entran las cargas puntuales. Ese selector es un estado global del visor y un ejemplo del workspace
 * no puede tocarlo (el módulo tiene que importarse en Node, sin hekatan-ui). Se reproduce aquí la
 * MISMA cuenta que hace el visor con ese selector (getViewer.ts, «Rango por familia»):
 *
 *   1. valor por nudo = media de los valores de las cáscaras que lo tocan (media nodal de CSI);
 *   2. nudos de las Q4 «losa» (sus 4 nudos a la misma z, tolerancia 1e-6);
 *   3. rango robusto: percentiles 1 y 99 si hay ≥ 20 valores; mínimo a 0 si todo es positivo.
 *
 * y se deja como rango fijo de von Mises (`colorMapRanges.vonMises`), el campo con el que abren.
 */
import type { Node, Element } from "hekatan-fem";

/** Rango de la barra con el selector «solo losas» del visor, para un campo por elemento. */
export function rangoSoloLosas(
  nodes: Node[], elements: Element[], campo: Map<number, number[]> | undefined,
): [number, number] | null {
  if (!(campo instanceof Map)) return null;
  // 1. media en el nudo
  const suma = new Map<number, number>(), cuenta = new Map<number, number>();
  campo.forEach((vals, ei) => {
    const e = elements[ei];
    if (!e) return;
    for (let i = 0; i < e.length; i++) {
      const v = vals[i] ?? vals[0];
      if (!Number.isFinite(v)) continue;
      suma.set(e[i], (suma.get(e[i]) ?? 0) + v);
      cuenta.set(e[i], (cuenta.get(e[i]) ?? 0) + 1);
    }
  });
  // 2. nudos de las losas
  const same = (e: number[], c: number) => {
    const v = nodes[e[0]]?.[c];
    return e.every((i) => Math.abs((nodes[i]?.[c] ?? NaN) - v) < 1e-6);
  };
  const sel = new Set<number>();
  for (const e of elements) {
    if (e.length !== 4) continue;
    if (same(e as number[], 2)) for (const i of e) sel.add(i);
  }
  const sub: number[] = [];
  for (const i of sel) {
    if (!suma.has(i)) continue;
    const v = (suma.get(i) as number) / (cuenta.get(i) as number);
    if (Number.isFinite(v)) sub.push(v);
  }
  if (!sub.length) return null;
  // 3. rango robusto
  const s = [...sub].sort((a, b) => a - b);
  const q = (f: number) => s[Math.min(s.length - 1, Math.max(0, Math.round(f * (s.length - 1))))];
  const recortar = s.length >= 20;
  let vMin = recortar ? q(0.01) : s[0];
  let vMax = recortar ? q(0.99) : s[s.length - 1];
  if (vMin >= 0 && vMax > 0) vMin = 0;
  if (vMax <= 0 && vMin < 0) vMax = 0;
  return [vMin, vMax];
}

/** El corte por y = 0 con que abrían las dos páginas (deja ver el interior del tubo). */
export function cortarPorYCero() {
  const g: any = globalThis as any;
  if (g.__hekatanClip) {
    g.__hekatanClip.enableY = true;
    g.__hekatanClip.posY = 0;
    g.__hekatanClip.invertY = false;
    g.__hekatanClipApply?.();
  }
}
