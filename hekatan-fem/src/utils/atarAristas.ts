/**
 * AUTO EDGE CONSTRAINT de ETABS para modelos importados: un nudo que cae sobre la ARISTA de una
 * cascara con flexion (muro ShellThin/Thick), sin ser esquina de ella, queda atado a esa arista
 * (muelle gdl −2 de `springsExtra.h`: Hermite en w, lineal en el plano, por penalizacion).
 *
 * Por que: en el TACNA la rampa de escalera W8 tiene una esquina sobre el borde inferior del muro
 * de x = 5.25. ETABS la cose al muro y la escalera rigidiza el edificio un 10 %; sin la atadura la
 * rampa colgaba y Struct daba 8.021 mm contra 7.311 en el techo (empuje de 100 tonf). Con las 20
 * ataduras a muros: 7.317 (0.08 %), 16-oct-2026.
 *
 * Las cascaras MEMBRANA (losas, deck: flexion 0) NO atan: atar tambien a ellas (151 nudos de muro y
 * viga sobre bordes de losa) daba 4.67 mm, el doble de rigido que ETABS. En planta ya las ata el
 * diafragma.
 *
 * Se activa con `elementInputs.atarAristas = true` (lo pone el lector de e2k) y se calcula aqui, con
 * la geometria del momento, para no depender de la numeracion (aparaSolver renumera nudos).
 */
import type { Node, Element, ElementInputs } from "../data-model";

export function atadurasDeArista(nodes: Node[], elements: Element[], ei: ElementInputs | undefined,
                                 tol = 1e-3): Array<{ node: number; dof: number; k: number }> {
  if (!(ei as any)?.atarAristas) return [];
  const mods = (ei as any).shellModifiers as Map<number, number[]> | undefined;
  const conFlexion = (i: number) => {
    const m = mods?.get(i);
    return !m || (m[3] ?? 1) + (m[4] ?? 1) + (m[5] ?? 1) > 1e-9;
  };
  const usados = new Set<number>();
  elements.forEach((e) => (e as unknown as number[]).forEach((n) => usados.add(n)));
  const lista = [...usados];
  const out: Array<{ node: number; dof: number; k: number }> = [];
  elements.forEach((el, i) => {
    const e = el as unknown as number[];
    if (e.length < 3 || !conFlexion(i)) return;
    for (let k = 0; k < e.length; k++) {
      const a = nodes[e[k]] as unknown as number[], b = nodes[e[(k + 1) % e.length]] as unknown as number[];
      const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const L2 = d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
      if (L2 < 1e-12) continue;
      const lo = [0, 1, 2].map((j) => Math.min(a[j], b[j]) - tol), hi = [0, 1, 2].map((j) => Math.max(a[j], b[j]) + tol);
      for (const n of lista) {
        if (e.includes(n)) continue;
        const p = nodes[n] as unknown as number[];
        if (p[0] < lo[0] || p[0] > hi[0] || p[1] < lo[1] || p[1] > hi[1] || p[2] < lo[2] || p[2] > hi[2]) continue;
        const t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1] + (p[2] - a[2]) * d[2]) / L2;
        if (t < 1e-4 || t > 1 - 1e-4) continue;
        const dist = Math.hypot(a[0] + t * d[0] - p[0], a[1] + t * d[1] - p[1], a[2] + t * d[2] - p[2]);
        if (dist > tol) continue;
        out.push({ node: -(i + 1), dof: -2, k: n });
      }
    }
  });
  return out;
}
