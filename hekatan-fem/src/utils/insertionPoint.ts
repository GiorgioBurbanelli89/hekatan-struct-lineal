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
