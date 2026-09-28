/**
 * SÓLIDOS H8 en el visor: la piel y las tensiones en los nudos.
 *
 * POR QUÉ (28-sep-2026): el visor solo rellenaba caras de elementos de 3 y 4 nudos. Un
 * hexaedro de 8 nudos salía como una caja de alambre, sin color, aunque el motor ya había
 * calculado `analyzeOutputs.solidStress`. Por eso cada ejemplo de sólidos era una página
 * aparte que convertía a mano sus caras en «cáscaras» falsas de 1 mm, y el desplegable
 * «Resultados de sólido» leía el canal `vonMises` de cáscara fuera cual fuera el campo.
 *
 * Orden de nudos del H8 (el de `hex ID n1..n8` del .heks y el de `hex8Stiffness.h`):
 * antihorario abajo (ζ = −1: 0 1 2 3) y antihorario arriba (ζ = +1: 4 5 6 7).
 */
import type { Element } from "hekatan-fem";

/** Signos (ξ, η, ζ) de los 8 nudos; los puntos de Gauss van en el MISMO orden, a ±1/√3. */
const SIGNOS: [number, number, number][] = [
  [-1, -1, -1], [+1, -1, -1], [+1, +1, -1], [-1, +1, -1],
  [-1, -1, +1], [+1, -1, +1], [+1, +1, +1], [-1, +1, +1],
];

/** Las 6 caras, con la normal hacia FUERA (regla de la mano derecha). */
const CARAS: [number, number, number, number][] = [
  [0, 3, 2, 1],   // ζ = −1  (abajo)
  [4, 5, 6, 7],   // ζ = +1  (arriba)
  [0, 1, 5, 4],   // η = −1
  [1, 2, 6, 5],   // ξ = +1
  [2, 3, 7, 6],   // η = +1
  [3, 0, 4, 7],   // ξ = −1
];

export interface CaraPiel {
  /** Los 4 nudos de la cara, normal hacia fuera. */
  nudos: [number, number, number, number];
  /** Índice del elemento (en `mesh.elements`) al que pertenece. */
  elem: number;
}

/**
 * La PIEL de los sólidos: las caras que pertenecen a un solo hexaedro. Una cara compartida por
 * dos elementos es interior y no se dibuja. `mostrar` deja fuera los elementos ocultos (por un
 * filtro), y entonces la cara que compartían con uno visible pasa a ser piel: el corte queda relleno.
 */
export function pielDeSolidos(elements: Element[], mostrar?: (ei: number) => boolean): CaraPiel[] {
  const vistas = new Map<string, { cara: CaraPiel; veces: number }>();
  for (let ei = 0; ei < elements.length; ei++) {
    const e = elements[ei];
    if (e.length !== 8) continue;
    if (mostrar && !mostrar(ei)) continue;
    for (const c of CARAS) {
      const nudos: [number, number, number, number] = [e[c[0]], e[c[1]], e[c[2]], e[c[3]]];
      const clave = [...nudos].sort((a, b) => a - b).join(",");
      const ya = vistas.get(clave);
      if (ya) ya.veces++;
      else vistas.set(clave, { cara: { nudos, elem: ei }, veces: 1 });
    }
  }
  const piel: CaraPiel[] = [];
  vistas.forEach((v) => { if (v.veces === 1) piel.push(v.cara); });
  return piel;
}

/** ¿Hay algún sólido en el modelo? */
export const haySolidos = (elements: Element[]): boolean => elements.some((e) => e.length === 8);

/**
 * Extrapolación de los 8 puntos de Gauss a los 8 nudos del elemento.
 *
 * Los puntos de Gauss forman un cubo de lado 2/√3 dentro del elemento. Sobre ese cubo el campo
 * se interpola con las mismas funciones trilineales; el nudo i cae en la coordenada ±√3 de ese
 * cubo. Por dirección, N = (1 + s_g·s_i·√3)/2, y el peso es el producto de las tres:
 *
 *     valor_nudo_i = Σ_g  Π_d (1 + √3·s_gd·s_id)/2  · valor_gauss_g
 *
 * Cada fila suma 1, así que un campo uniforme se queda uniforme.
 */
export const EXTRAPOLA_H8: number[][] = SIGNOS.map((si) =>
  SIGNOS.map((sg) => {
    let w = 1;
    for (let d = 0; d < 3; d++) w *= (1 + Math.sqrt(3) * sg[d] * si[d]) / 2;
    return w;
  }));

/** Von Mises de un tensor [σxx, σyy, σzz, τxy, τyz, τxz]. */
export function vonMisesDe(s: number[]): number {
  const [sx, sy, sz, txy, tyz, txz] = s;
  return Math.sqrt(0.5 * ((sx - sy) ** 2 + (sy - sz) ** 2 + (sz - sx) ** 2)
    + 3 * (txy * txy + tyz * tyz + txz * txz));
}

export type CampoSolido = "vonMises" | "sigmaXX" | "sigmaYY" | "sigmaZZ" | "tauXY" | "tauYZ" | "tauXZ";
const COMPONENTE: Record<Exclude<CampoSolido, "vonMises">, number> = {
  sigmaXX: 0, sigmaYY: 1, sigmaZZ: 2, tauXY: 3, tauYZ: 4, tauXZ: 5,
};

/**
 * Tensiones de sólido EN LOS NUDOS, como las da un programa de elementos finitos: cada
 * componente se extrapola de Gauss a los nudos de su elemento y se promedia en el nudo entre
 * los elementos que lo tocan. El von Mises se calcula DESPUÉS, con las seis componentes ya
 * promediadas (promediar el von Mises de cada elemento da otro número, siempre mayor o igual).
 *
 * Devuelve un mapa nudo → [valor], el formato que usa el colormap.
 */
export function tensionEnNudos(
  elements: Element[],
  solidStress: Map<number, number[][]> | undefined,
  campo: CampoSolido,
): Map<number, number[]> {
  const out = new Map<number, number[]>();
  if (!(solidStress instanceof Map) || solidStress.size === 0) return out;
  const suma = new Map<number, number[]>();
  const cuenta = new Map<number, number>();
  solidStress.forEach((gauss, ei) => {
    const e = elements[ei];
    if (!e || e.length !== 8 || !Array.isArray(gauss) || gauss.length !== 8) return;
    for (let i = 0; i < 8; i++) {
      const s = [0, 0, 0, 0, 0, 0];
      for (let g = 0; g < 8; g++) {
        const w = EXTRAPOLA_H8[i][g];
        for (let k = 0; k < 6; k++) s[k] += w * (gauss[g]?.[k] ?? 0);
      }
      if (!s.every(Number.isFinite)) continue;
      const a = suma.get(e[i]) ?? [0, 0, 0, 0, 0, 0];
      for (let k = 0; k < 6; k++) a[k] += s[k];
      suma.set(e[i], a);
      cuenta.set(e[i], (cuenta.get(e[i]) ?? 0) + 1);
    }
  });
  suma.forEach((a, n) => {
    const c = cuenta.get(n) as number;
    const s = a.map((v) => v / c);
    out.set(n, [campo === "vonMises" ? vonMisesDe(s) : s[COMPONENTE[campo]]]);
  });
  return out;
}
