/**
 * Brazos rígidos AUTOMÁTICOS de ETABS («End Length Offsets: Automatic from Connectivity»).
 *
 * Regla medida en ETABS (binario + OAPI, 8-sep-2026, `validation/isse/ETABS_DEFECTOS_QUE_ANADE.md`):
 *   - viga:    en cada extremo que toca columna, MEDIO LADO de la columna en la dirección de la viga;
 *   - columna: arriba (J), el CANTO de la viga más alta que llega al nudo (la viga cuelga del nivel);
 *              abajo, 0;
 *   - factor de zona rígida RZ = 0 por defecto (la rigidez no cambia; solo se descuenta peso y masa).
 *
 * Devuelve `endOffsets` = Map<barra, [offI, offJ, rz]>, lo que leen `deform`, `modal`, `analyze` y los
 * exportadores e2k/s2k. Con RZ > 0 el solver rigidiza `rz·off` en cada extremo (tests `brazos-rigidos`,
 * `brazos-portico`: 0.000 % contra ETABS).
 */
export type ClaseBarra = "col" | "viga" | null;

export function brazosAutomaticosETABS(
  nodes: number[][],
  elements: number[][],
  clase: (e: number) => ClaseBarra,
  /** lado COMPLETO de la columna que llega al nudo, medido en X (enX) o en Y; 0 si no hay columna */
  ladoColumna: (e: number, nudo: number, enX: boolean) => number,
  /** canto de una viga (m) */
  cantoViga: (e: number) => number,
  rz: number,
): Map<number, [number, number, number]> {
  const out = new Map<number, [number, number, number]>();
  // columnas y vigas por nudo
  const colsEn = new Map<number, number[]>(), vigasEn = new Map<number, number[]>();
  elements.forEach((el, e) => {
    if (el.length !== 2) return;
    const c = clase(e);
    const m = c === "col" ? colsEn : c === "viga" ? vigasEn : null;
    if (m) for (const n of el) (m.get(n) ?? m.set(n, []).get(n)!).push(e);
  });
  const L = (a: number, b: number) =>
    Math.hypot(nodes[b][0] - nodes[a][0], nodes[b][1] - nodes[a][1], nodes[b][2] - nodes[a][2]);

  elements.forEach((el, e) => {
    if (el.length !== 2) return;
    const c = clase(e);
    const [a, b] = el;
    let offI = 0, offJ = 0;
    if (c === "viga") {
      const enX = Math.abs(nodes[b][0] - nodes[a][0]) >= Math.abs(nodes[b][1] - nodes[a][1]);
      const medio = (n: number) => Math.max(0, ...(colsEn.get(n) ?? []).map((k) => ladoColumna(k, n, enX))) / 2;
      offI = medio(a); offJ = medio(b);
    } else if (c === "col") {
      const arriba = nodes[a][2] > nodes[b][2] ? a : b;
      const canto = Math.max(0, ...(vigasEn.get(arriba) ?? []).map((k) => cantoViga(k)));
      if (arriba === a) offI = canto; else offJ = canto;
    } else return;
    if (!(offI > 0 || offJ > 0)) return;
    // brazos que se comen la barra (tramo de malla más corto que el brazo): no se ponen
    if (offI + offJ >= 0.95 * L(a, b)) return;
    out.set(e, [offI, offJ, rz]);
  });
  return out;
}
