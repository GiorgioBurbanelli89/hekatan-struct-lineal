/**
 * shellElementK.ts — LA MATRIZ DE RIGIDEZ LOCAL DE UN PAÑO (cáscara Q4), para enseñarla.
 *
 * Es a la placa lo que `getLocalStiffnessMatrix` es a la barra: la matriz con la que el
 * motor resuelve, no una parecida escrita aparte. Las tres piezas salen de los mirrors
 * TS que ya estaban validados contra el C++ celda a celda:
 *
 *   · flexión Shell-Thick (CSI)  → `csiThickBendingK`  (22 gdl condensados a 12)
 *   · flexión Shell-Thin (DKQ)   → aquí, Σ Bᵀ·Db·B·|J| en Gauss 2×2 con `dkqB`
 *   · membrana (ITW tipo 12)     → `itwMembraneK`      (14 gdl, burbuja condensada)
 *
 * ⚠️ EJES. La K depende del marco en que se escriba. Aquí se usa el del ELEMENTO,
 * el mismo que arma el C++ (`shellQ4.cpp`): eje 1 = v01 + v32 reortogonalizado,
 * eje 3 = d02 × d13. NO son los ejes con los que `analyze()` REPORTA M11/M22 (esos
 * son los «Area Local Axes» de CSI: eje 1 = +X global si el paño es horizontal).
 * En un cuadrado coinciden; en un trapecio no, y comparar entrada a entrada las dos
 * da diferencias de varios % siendo la MISMA matriz en otra base.
 *
 * Verificado contra `cli/native/kelem_native.exe` (los mismos .cpp que el WASM):
 * `node cli/_k_placa_vs_cpp.mjs` — cuadrado, rectángulo y trapecio a 1e-11 %.
 */
import { csiThickBendingK } from "./csiThickJoints";
import { itwMembraneK } from "./itwJoints";
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
  /** 12×12, gdl [w, θ1, θ2] × 4 nudos, en ejes del elemento. */
  flexion: number[][];
  /** 12×12, gdl [u1, u2, θ3] × 4 nudos. `null` si el tipo de drilling no es 12 ni 3. */
  membrana: number[][] | null;
  formulacion: string;
  xl: number[];
  yl: number[];
  ex: number[]; ey: number[]; ez: number[];
  area: number;
}

/**
 * Las dos matrices de un paño Q4. `tipoPlaca` 0 = Shell-Thick de CSI (defecto del motor),
 * 1 = Shell-Thin (DKQ).
 */
export function kPanoQ4(
  p: number[][], E: number, nu: number, t: number,
  opts: { tipoPlaca?: number; tipoDrill?: number; gammaFac?: number; mod?: number[] | null } = {}
): KPano {
  if (p.length !== 4) throw new Error("La K de paño de esta pantalla es la del Q4: hacen falta 4 nudos.");
  const tipoPlaca = opts.tipoPlaca ?? 0, tipoDrill = opts.tipoDrill ?? 12;
  const { ex, ey, ez, xl, yl } = ejesLocalesQ4(p);
  const flexion = tipoPlaca === 1 ? dkqBendingK(xl, yl, E, nu, t) : csiThickBendingK(xl, yl, E, nu, t);
  const membrana = itwMembraneK(xl, yl, E, nu, t, { tipo: tipoDrill, gammaFac: opts.gammaFac, mod: opts.mod });
  let a2 = 0;
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; a2 += xl[i] * yl[j] - xl[j] * yl[i]; }
  return {
    flexion, membrana, xl, yl, ex, ey, ez, area: Math.abs(a2) / 2,
    formulacion: (tipoPlaca === 1 ? "Shell-Thin (DKQ, Batoz-Tahar)" : "Shell-Thick de CSI") +
      " + membrana " + (tipoDrill === 12 ? "ITW tipo 12 (la de CSI)" : "ITW tipo " + tipoDrill),
  };
}
