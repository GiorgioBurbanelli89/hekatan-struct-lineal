/**
 * shellElementK.ts — LA MATRIZ DE RIGIDEZ LOCAL DE UN PAÑO (cáscara), para enseñarla.
 *
 * Es a la placa lo que `getLocalStiffnessMatrix` es a la barra: la matriz con la que el
 * motor resuelve, no una parecida escrita aparte. Solo formulaciones PUBLICADAS:
 *
 *   · Shell-Thick (defecto del motor: MITC4 de Dvorkin-Bathe + membrana ITW tipo 13)
 *       → LEÍDA DEL MOTOR: `didactic_solve` (deform.wasm) devuelve la K_local del elemento
 *         que arma `getLocalStiffnessMatrix` del C++, la misma que ensambla `deform`.
 *         Vale también para los triángulos con la placa por defecto.
 *   · Shell-Thin Q4 (DKQ, Batoz-Tahar) → aquí, Σ Bᵀ·Db·B·|J| en Gauss 2×2 con `dkqB`
 *       + membrana ITW (`itwMembraneK`, tipo 13 por defecto).
 *   · Lo que el motor resuelve con otra placa (DKMQ = 3, DSE = 4, triángulo DKT del
 *     Shell-Thin) y no se puede leer aún del motor → `flexion = null` y un aviso: no se
 *     enseña una matriz que no es la suya.
 *
 * ⚠️ EJES. La K depende del marco en que se escriba. Aquí se usa el del ELEMENTO,
 * el mismo que arma el C++ (`shellQ4.cpp`): eje 1 = v01 + v32 reortogonalizado,
 * eje 3 = d02 × d13. NO son los ejes con los que `analyze()` REPORTA M11/M22 (esos
 * son los «Area Local Axes»: eje 1 = +X global si el paño es horizontal).
 */
import { itwMembraneK } from "./itwJoints";
import { didacticSolveCpp } from "../didacticCpp";
import { dkqB } from "./dkqJoints";

const cross = (a: number[], b: number[]) => [
  a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0],
];
const unit = (v: number[]) => { const m = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / m, v[1] / m, v[2] / m]; };

/** Los ejes locales del elemento tal como los arma el C++, y las coordenadas en ellos. */
export function ejesLocalesQ4(p: number[][]) {
  const v01 = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]];
  const v32 = [p[2][0] - p[3][0], p[2][1] - p[3][1], p[2][2] - p[3][2]];
  const d02 = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]];
  const d13 = [p[3][0] - p[1][0], p[3][1] - p[1][1], p[3][2] - p[1][2]];
  let ex = unit([v01[0] + v32[0], v01[1] + v32[1], v01[2] + v32[2]]);
  const ez = unit(cross(d02, d13));
  const ey = unit(cross(ez, ex));
  ex = unit(cross(ey, ez));
  const c = [0, 1, 2].map((k) => (p[0][k] + p[1][k] + p[2][k] + p[3][k]) / 4);
  const xl: number[] = [], yl: number[] = [];
  for (let n = 0; n < 4; n++) {
    const d = [p[n][0] - c[0], p[n][1] - c[1], p[n][2] - c[2]];
    xl.push(d[0] * ex[0] + d[1] * ex[1] + d[2] * ex[2]);
    yl.push(d[0] * ey[0] + d[1] * ey[1] + d[2] * ey[2]);
  }
  return { ex, ey, ez, xl, yl };
}

/** Flexión DKQ (Shell-Thin): Σ Bᵀ·Db·B·|J| en Gauss 2×2, peso 1 — `plateDKQ.h`. */
export function dkqBendingK(xl: number[], yl: number[], E: number, nu: number, t: number): number[][] {
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  const g = 1 / Math.sqrt(3);
  const K: number[][] = Array.from({ length: 12 }, () => new Array<number>(12).fill(0));
  for (const xi of [-g, g]) for (const et of [-g, g]) {
    const B = dkqB(xl, yl, xi, et);
    // el jacobiano, con las mismas bilineales
    const dNr = [-(1 - et) / 4, (1 - et) / 4, (1 + et) / 4, -(1 + et) / 4];
    const dNs = [-(1 - xi) / 4, -(1 + xi) / 4, (1 + xi) / 4, (1 - xi) / 4];
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (let i = 0; i < 4; i++) { J00 += dNr[i] * xl[i]; J01 += dNr[i] * yl[i]; J10 += dNs[i] * xl[i]; J11 += dNs[i] * yl[i]; }
    const dJ = Math.abs(J00 * J11 - J01 * J10);
    for (let a = 0; a < 12; a++) for (let b = 0; b < 12; b++) {
      let s = 0;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += B[i][a] * Db[i][j] * B[j][b];
      K[a][b] += s * dJ;
    }
  }
  return K;
}

export interface KPano {
  /** 3n×3n, gdl [w, θ1, θ2] × n nudos, en ejes del elemento. `null` si no hay K publicada que enseñar. */
  flexion: number[][] | null;
  /** 3n×3n, gdl [u1, u2, θ3] × n nudos. `null` si no se puede enseñar la del motor. */
  membrana: number[][] | null;
  formulacion: string;
  /** por qué falta un bloque (vacío si están los dos) */
  aviso: string;
  nNudos: number;
  xl: number[];
  yl: number[];
  ex: number[]; ey: number[]; ez: number[];
  area: number;
}

/** La K_local del elemento tal como la arma el motor C++ (`didactic_solve`), con sus ejes. */
export function kLocalMotor(p: number[][], E: number, nu: number, t: number) {
  const n = p.length;
  const el = [Array.from({ length: n }, (_, i) => i)];
  const fijo = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  // Solo se quiere la K: todo fijo menos la w del nudo 1 (con 0 gdl libres el solver divide por 0).
  for (let i = 0; i < n; i++) fijo.set(i, [true, true, i !== 0, true, true, true]);
  const r = didacticSolveCpp(p as any, el as any, { supports: fijo as any, loads: new Map() } as any, {
    elasticities: new Map([[0, E]]), thicknesses: new Map([[0, t]]), poissonsRatios: new Map([[0, nu]]),
  } as any);
  const d = r.elements[0];
  if (!d || d.nDOF !== 6 * n) throw new Error("el motor no devolvió la K del elemento");
  return { K: d.K_local, lambda: d.lambda };
}

/** Bloques de la K de 6n: flexión [w, θ1, θ2] = gdl 2,3,4 y membrana [u1, u2, θ3] = 0,1,5 de cada nudo. */
function bloque(K: number[][], n: number, loc: number[]) {
  const id: number[] = [];
  for (let i = 0; i < n; i++) for (const k of loc) id.push(6 * i + k);
  return id.map((a) => id.map((b) => K[a][b]));
}

/**
 * Las dos matrices de un paño (Q4 o triángulo). `tipoPlaca` (plateFormulations):
 * 0/2/indefinido = Shell-Thick del motor (MITC4), 1 = Shell-Thin (DKQ en Q4, DKT en T3),
 * 3 = DKMQ, 4 = DSE.
 */
export function kPano(
  p: number[][], E: number, nu: number, t: number,
  opts: { tipoPlaca?: number; tipoDrill?: number; gammaFac?: number } = {}
): KPano {
  const n = p.length;
  if (n !== 4 && n !== 3) throw new Error("La K de paño es la de un Q4 o un triángulo.");
  const tipoPlaca = opts.tipoPlaca ?? 0, tipoDrill = opts.tipoDrill ?? 13;
  const gammaFac = opts.gammaFac ?? 0.4;
  let flexion: number[][] | null = null, membrana: number[][] | null = null, formulacion = "", aviso = "";
  let { ex, ey, ez, xl, yl } = n === 4 ? ejesLocalesQ4(p) : ejesT3(p);
  const drillDefecto = tipoDrill === 13 && Math.abs(gammaFac - 0.4) < 1e-12;
  if (tipoPlaca === 0 || tipoPlaca === 2) {
    // el defecto del motor: la K se LEE del C++ (no se reescribe)
    const m = kLocalMotor(p, E, nu, t);
    ex = m.lambda[0]; ey = m.lambda[1]; ez = m.lambda[2];
    flexion = bloque(m.K, n, [2, 3, 4]);
    formulacion = n === 4 ? "Shell-Thick del motor: MITC4 (Dvorkin-Bathe 1985)" : "Shell-Thick del motor (triángulo)";
    if (n === 3) { membrana = bloque(m.K, n, [0, 1, 5]); formulacion += " · placa y membrana leídas del motor (didactic_solve)"; }
    else if (drillDefecto) { membrana = bloque(m.K, n, [0, 1, 5]); formulacion += " + membrana ITW tipo 13 · leída del motor (didactic_solve)"; }
    else if (n === 4) {
      membrana = itwMembraneK(xl, yl, E, nu, t, { tipo: tipoDrill, gammaFac });
      formulacion += " · leída del motor (didactic_solve) + membrana ITW tipo " + tipoDrill;
      if (!membrana) aviso = "La membrana de este paño (drilling " + tipoDrill + ") no se puede enseñar todavía.";
    }
  } else if (tipoPlaca === 1 && n === 4) {
    flexion = dkqBendingK(xl, yl, E, nu, t);
    membrana = itwMembraneK(xl, yl, E, nu, t, { tipo: tipoDrill, gammaFac });
    formulacion = "Shell-Thin (DKQ, Batoz-Tahar) + membrana ITW tipo " + tipoDrill;
    if (!membrana) aviso = "La membrana de este paño (drilling " + tipoDrill + ") no se puede enseñar todavía.";
  } else {
    const nom = tipoPlaca === 1 ? "Shell-Thin (DKT) en triángulo" : tipoPlaca === 3 ? "DKMQ (Katili)" : tipoPlaca === 4 ? "DSE (Wilson)" : "placa tipo " + tipoPlaca;
    formulacion = nom;
    aviso = "K no disponible para " + nom + " todavía: el motor la resuelve, pero aún no se puede leer de él.";
  }
  let a2 = 0;
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; a2 += xl[i] * yl[j] - xl[j] * yl[i]; }
  return { flexion, membrana, formulacion, aviso, nNudos: n, xl, yl, ex, ey, ez, area: Math.abs(a2) / 2 };
}

/** Compatibilidad: el Q4. */
export function kPanoQ4(p: number[][], E: number, nu: number, t: number,
  opts: { tipoPlaca?: number; tipoDrill?: number; gammaFac?: number; mod?: number[] | null } = {}): KPano {
  if (p.length !== 4) throw new Error("La K de paño de esta función es la del Q4: hacen falta 4 nudos.");
  return kPano(p, E, nu, t, opts);
}

/** Ejes de un triángulo (eje 1 = lado 0→1, eje 3 = normal) y coordenadas en ellos. */
function ejesT3(p: number[][]) {
  const v01 = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]];
  const v02 = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]];
  const ex = unit(v01), ez = unit(cross(v01, v02)), ey = unit(cross(ez, ex));
  const c = [0, 1, 2].map((k) => (p[0][k] + p[1][k] + p[2][k]) / 3);
  const xl: number[] = [], yl: number[] = [];
  for (let i = 0; i < 3; i++) {
    const d = [p[i][0] - c[0], p[i][1] - c[1], p[i][2] - c[2]];
    xl.push(d[0] * ex[0] + d[1] * ex[1] + d[2] * ex[2]);
    yl.push(d[0] * ey[0] + d[1] * ey[1] + d[2] * ey[2]);
  }
  return { ex, ey, ez, xl, yl };
}
