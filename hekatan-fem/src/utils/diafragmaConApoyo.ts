/**
 * Diafragma rigido que contiene nudos con APOYO, con la regla de ETABS.
 *
 * En ETABS un nudo restringido dentro de un diafragma FIJA el diafragma: el semisotano del
 * TACNA (8 nudos `RESTRAINT "UX UY RZ"` + 22 libres, todos `DIAPH "D00"`) no se mueve en su
 * plano. El C++ de Hekatan (`rigidDiaphragm.h`) hace al nudo esclavo de un maestro virtual
 * libre y el apoyo se pierde: la planta entera deslizaba 0.10 mm bajo un empuje de 100 tonf en
 * el piso 6, donde ETABS da 0 (16-oct-2026).
 *
 * Arreglo en la entrada, sin tocar el WASM: si el grupo queda fijo en su plano (un nudo con
 * UX, UY y RZ restringidos, o dos nudos distintos con UX y UY), se restringen UX, UY y RZ de
 * TODOS sus nudos y el grupo deja de ser diafragma (ya no hay nada que atar). Si el apoyo solo
 * fija parte del plano (un nudo con UX), el grupo se deja como esta.
 */
export function diafragmaConApoyo(
  supports: Map<number, boolean[]> | undefined,
  diaphragms: Map<number, number> | undefined,
): { supports: Map<number, boolean[]> | undefined; diaphragms: Map<number, number> | undefined } {
  if (!supports?.size || !diaphragms?.size) return { supports, diaphragms };
  const grupos = new Map<number, number[]>();
  for (const [n, g] of diaphragms) if (g) (grupos.get(g) ?? grupos.set(g, []).get(g)!).push(n);
  let sup: Map<number, boolean[]> | undefined, dia: Map<number, number> | undefined;
  for (const [g, nudos] of grupos) {
    const r = nudos.map((n) => supports.get(n)).filter(Boolean) as boolean[][];
    const fijo = r.some((s) => s[0] && s[1] && s[5]) || r.filter((s) => s[0] && s[1]).length >= 2;
    if (!fijo) continue;
    sup ??= new Map([...supports].map(([k, v]) => [k, [...v]]));
    dia ??= new Map(diaphragms);
    for (const n of nudos) {
      const s = sup.get(n) ?? [false, false, false, false, false, false];
      s[0] = s[1] = s[5] = true;
      sup.set(n, s);
      dia.delete(n);
    }
    void g;
  }
  return { supports: sup ?? supports, diaphragms: dia ?? diaphragms };
}
