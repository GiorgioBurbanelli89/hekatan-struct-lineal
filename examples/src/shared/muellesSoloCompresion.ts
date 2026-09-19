/**
 * Muelles que SOLO trabajan a compresión (el suelo no tira): la zapata se levanta por un borde.
 *
 * Es la ley del «Gap» de CSI, leída del manual, no inventada:
 *
 *   CSI Analysis Reference Manual, «Gap Property» (p. 286):
 *       f = k·(d + open)   si d + open < 0
 *       f = 0              en otro caso          (open = 0 para el suelo)
 *   SAFE Key Features §5.4.3 «Nonlinear Analysis for Uplift»: con los muelles de suelo
 *   «compression only» y un caso no lineal, «nonlinear gap elements are automatically activated
 *   in the soil support springs».
 *   SAP2000 OAPI `AreaObj.SetSpring`, SimpleSpringType 2 = «Spring resists compression only».
 *
 * El problema (placa lineal + muelles con esa ley) tiene UNA sola solución: la que minimiza la
 * energía potencial, que es convexa. CSI llega con pasos de carga y Newton-Raphson hasta su
 * tolerancia; aquí se llega por conjunto activo, que para esta ley es exacto:
 *
 *   1. todos los muelles activos, resolver (lineal);
 *   2. muelle i activo  <=>  u_i < 0  (el nudo baja y aprieta el suelo);
 *   3. volver a resolver con esos; repetir hasta que el conjunto no cambie.
 *
 * Al terminar se cumple la ley del Gap nudo a nudo: los activos bajan (fuerza de compresión) y los
 * apagados suben o quedan en 0 (fuerza 0). No hay tolerancia que ajustar.
 *
 * Solo el suelo es no lineal. La placa sigue lineal (nada de plasticidad del suelo). En Hekatan
 * esto es el módulo de interacción suelo-estructura NO lineal (de pago): la versión libre resuelve
 * el Winkler lineal.
 */

export type Muelle = { node: number; dof: number; k: number };

export interface ResultadoSoloCompresion<D> {
  deformOutputs: D;
  /** activo[i] = el muelle comp[i] toca (compresión) al final */
  activo: boolean[];
  /** muelles con que se resolvió la última vez (fijos + activos) */
  springsFinales: Muelle[];
  iteraciones: number;
  /** cuántos muelles comp estaban activos en cada iteración */
  historial: number[];
  convergio: boolean;
  mensaje?: string;
}

/**
 * @param resolver  llama a `deform` con una lista de muelles y devuelve sus salidas
 * @param fijos     muelles lineales (y registros especiales con nudo negativo), no cambian
 * @param comp      muelles solo compresión; comprimen cuando u[dof] < 0 (suelo debajo, z arriba)
 */
export function resolverSoloCompresion<D extends { deformations?: Map<number, number[]> }>(
  resolver: (springs: Muelle[]) => D,
  fijos: Muelle[],
  comp: Muelle[],
  maxIt = 60,
): ResultadoSoloCompresion<D> {
  let activo = comp.map(() => true);
  const historial: number[] = [];
  const vistos = new Set<string>();
  let out: D = undefined as any;
  let lista: Muelle[] = [];
  for (let it = 1; it <= maxIt; it++) {
    const n = activo.filter(Boolean).length;
    historial.push(n);
    if (comp.length && n === 0)
      return { deformOutputs: out, activo, springsFinales: lista, iteraciones: it, historial, convergio: false,
               mensaje: "todos los muelles en tracción: la zapata vuelca (e ≥ L/2), no hay equilibrio" };
    lista = fijos.concat(comp.filter((_, i) => activo[i]));
    out = resolver(lista);
    const U = out.deformations;
    const nuevo = comp.map((s) => (U?.get(s.node)?.[s.dof] ?? 0) < 0);
    if (nuevo.every((v, i) => v === activo[i]))
      return { deformOutputs: out, activo, springsFinales: lista, iteraciones: it, historial, convergio: true };
    const clave = nuevo.map((v) => (v ? 1 : 0)).join("");
    if (vistos.has(clave))
      return { deformOutputs: out, activo, springsFinales: lista, iteraciones: it, historial, convergio: false,
               mensaje: "el contacto oscila entre dos estados (ciclo): revisar el modelo" };
    vistos.add(clave);
    activo = nuevo;
  }
  return { deformOutputs: out, activo, springsFinales: lista, iteraciones: maxIt, historial, convergio: false,
           mensaje: `sin converger en ${maxIt} iteraciones` };
}

/**
 * Pesos ∫N_i dA de un Q4/T3 (Gauss 2x2 con jacobiano real): el reparto del muelle de área a los
 * nudos que hacen SAP2000, ETABS y SAFE (medido el 8-sep-2026, `muelle-area-y-nudo-colgado`).
 */
export function pesosAreaNudos(P: number[][]): number[] {
  if (P.length === 3) {
    const u = [P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]];
    const v = [P[2][0] - P[0][0], P[2][1] - P[0][1], P[2][2] - P[0][2]];
    const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const A = 0.5 * Math.hypot(c[0], c[1], c[2]);
    return [A / 3, A / 3, A / 3];
  }
  const g = 1 / Math.sqrt(3), w = [0, 0, 0, 0];
  for (const r of [-g, g]) for (const s of [-g, g]) {
    const N = [(1 - r) * (1 - s), (1 + r) * (1 - s), (1 + r) * (1 + s), (1 - r) * (1 + s)].map((x) => x / 4);
    const dNr = [-(1 - s), 1 - s, 1 + s, -(1 + s)].map((x) => x / 4);
    const dNs = [-(1 - r), -(1 + r), 1 + r, 1 - r].map((x) => x / 4);
    const xr = [0, 0, 0], xs = [0, 0, 0];
    for (let i = 0; i < 4; i++) for (let d = 0; d < 3; d++) { xr[d] += dNr[i] * P[i][d]; xs[d] += dNs[i] * P[i][d]; }
    const c = [xr[1] * xs[2] - xr[2] * xs[1], xr[2] * xs[0] - xr[0] * xs[2], xr[0] * xs[1] - xr[1] * xs[0]];
    const dJ = Math.hypot(c[0], c[1], c[2]);
    for (let i = 0; i < 4; i++) w[i] += N[i] * dJ;
  }
  return w;
}
