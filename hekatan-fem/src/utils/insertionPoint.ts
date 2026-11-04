/**
 * PUNTO DE INSERCION de barra (cardinal point de CSI).
 *
 * El nudo no cae en el centroide de la seccion sino en un punto de ella (p. ej. 8 = arriba al centro:
 * una viga de cimentacion colgada del plano de la losa). El centroide queda a r = (0, d2, d3) del nudo,
 * en ejes LOCALES de la barra, y se mueve con el nudo como cuerpo rigido:
 *
 *     u_centroide = u_nudo + theta x r        (r1 = 0)
 *     u1 += d3*th2 - d2*th3 ;  u2 += -d3*th1 ;  u3 += d2*th1
 *
 * La K de la barra es R^T K R (hecha en C++: getGlobalStiffnessMatrix.cpp) y los esfuerzos se recuperan
 * con k·(R u): son los del CENTROIDE, como los da CSI. El desfase viaja al WASM por la lista de muelles
 * con nudo negativo = -(elemento+1) y gdl -5 (d2) / -6 (d3), igual que los muelles de area
 * (utils/springsExtra.h): asi no cambia la firma de deform() ni de modal().
 */
import type { ElementInputs } from "../data-model";

/** Entradas de la lista de muelles que llevan el desfase de cada barra al WASM. */
export function insertionSprings(ei: ElementInputs | undefined): Array<{ node: number; dof: number; k: number }> {
  const out: Array<{ node: number; dof: number; k: number }> = [];
  ei?.insertionOffsets?.forEach(([d2, d3], e) => {
    if (d2) out.push({ node: -(e + 1), dof: -5, k: d2 });
    if (d3) out.push({ node: -(e + 1), dof: -6, k: d3 });
  });
  return out;
}

/** Aplica R a un vector local de 12 (desplazamientos de los dos extremos): u_centroide = R u_nudo. */
export function aCentroide(u: number[], d2: number, d3: number): number[] {
  const v = u.slice();
  for (const o of [0, 6]) {
    v[o + 0] = u[o + 0] + d3 * u[o + 4] - d2 * u[o + 5];
    v[o + 1] = u[o + 1] - d3 * u[o + 3];
    v[o + 2] = u[o + 2] + d2 * u[o + 3];
  }
  return v;
}

/**
 * Desfase [d2, d3] (ejes locales) que el e2k pide con `CARDINALPT n TRANSFORMSTIFF "Yes"`. Vertical: 1-3 abajo, 4-6 medio,
 * 7-9 arriba; el centroide queda D/2 por debajo del nudo (d2 = -D/2). Sin `TRANSFORMSTIFF "Yes"` ETABS no transforma la rigidez
 * (el CARDINALPT es solo geometria). Lateral y 11 aun no. Mismo criterio para el modelador y para el reparto de cargas.
 */
export function desfaseDeInsercionE2k(txt: string | undefined, D: number): [number, number] | undefined {
  if (!txt) return undefined;
  const cp = parseInt(txt.match(/CARDINALPT\s+(\d+)/)?.[1] ?? "0", 10);
  if (!cp || cp === 10) return undefined;
  if (!/TRANSFORMSTIFF\s+"Yes"/i.test(txt)) return undefined;
  const fila = cp <= 3 ? -1 : cp >= 7 && cp <= 9 ? 1 : 0;
  const d2 = fila === 0 ? 0 : -fila * D / 2;
  return d2 ? [d2, 0] : undefined;
}

/**
 * Una carga que actua sobre el CENTROIDE de la barra (peso propio, cargas de losa) llega al nudo como la misma fuerza mas el
 * momento r x F, con r = d2*e2 + d3*e3 en globales: el mismo cuerpo rigido que la rigidez (u_c = u_nudo + theta x r).
 * Solo importa cuando r no es paralelo a la fuerza: en una correa INCLINADA (3 %) el eje local 2 se inclina 1.7 grados y el
 * brazo horizontal d2*sen(1.7) = 2.4 mm por 49 kN da el momento 0.12 kN·m que en ETABS desplaza todo el techo +0.11 mm en Y.
 * `eq` = [Fi(3) Mi(3) Fj(3) Mj(3)] en globales; `e2`/`e3` = ejes locales de la barra en globales. Devuelve uno nuevo.
 */
export function trasladarCargaAlNudo(eq: number[], e2: number[], e3: number[], d2: number, d3: number): number[] {
  const r = [0, 1, 2].map((k) => d2 * e2[k] + d3 * e3[k]);
  const out = eq.slice();
  for (const o of [0, 6]) {
    const F = eq.slice(o, o + 3);
    out[o + 3] += r[1] * F[2] - r[2] * F[1];
    out[o + 4] += r[2] * F[0] - r[0] * F[2];
    out[o + 5] += r[0] * F[1] - r[1] * F[0];
  }
  return out;
}
