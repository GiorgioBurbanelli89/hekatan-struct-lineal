/**
 * CARGAS POR PATRÓN y el CASO que se está mirando — como ETABS.
 *
 * Jorge (11-sep-2026): «si coloco caso tal solo debe mostrar esa carga; me muestra la
 * suma de la lateral y la vertical… se ve feo». Los ejemplos armaban UNA carga con todo
 * junto (muerta + viva + sismo), así que el selector «Case results» no cambiaba nada.
 *
 * Ahora un ejemplo reparte sus cargas por PATRÓN (Dead, Live, Ex…) y pide al workspace
 * las del caso activo:
 *
 *   const cargas = cargasDelCaso({ Dead: mD, Live: mL, Ex: mE });
 *   states.nodeInputs.val = { supports, loads: cargas };
 *
 * El workspace deja en `__hekatanFactoresPatron` el factor de cada patrón para lo que se
 * eligió: un CASO → sus patrones con su factor (Dead → {Dead: 1}); una COMBINACIÓN → la
 * suma de sus casos por su factor (1.2D+1L+1Ex → {Dead: 1.2, Live: 1, Ex: 1}).
 * Sin factores (el caso Modal, o un ejemplo cargado fuera del workspace) van TODAS las
 * cargas a 1: es lo que hacía antes, y el modal no depende de ellas.
 */
export type Carga6 = [number, number, number, number, number, number];

export function factoresDelCaso(): Record<string, number> | null {
  const f = (globalThis as any).__hekatanFactoresPatron as Record<string, number> | undefined;
  return f && Object.keys(f).length ? f : null;
}

export function cargasDelCaso(porPatron: Record<string, Map<number, Carga6>>): Map<number, Carga6> {
  const f = factoresDelCaso();
  const out = new Map<number, Carga6>();
  for (const [patron, m] of Object.entries(porPatron)) {
    const k = f ? (f[patron] ?? 0) : 1;
    if (!k) continue;
    m.forEach((v, n) => {
      const c = out.get(n) ?? [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 6; i++) c[i] += k * v[i];
      out.set(n, c);
    });
  }
  return out;
}

/** Suma una carga a un nudo de un mapa de patrón. */
export function sumar(m: Map<number, Carga6>, n: number, v: Partial<Carga6> | number[]) {
  const c = m.get(n) ?? [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 6; i++) c[i] += Number(v[i] ?? 0);
  m.set(n, c);
}
