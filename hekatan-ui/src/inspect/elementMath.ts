/**
 * Element FEM math derivation — TS puro.
 * Calcula K_local 12×12, T 12×12, K_global = T^T·K·T para cualquier frame element.
 *
 * Sin dependencias externas (no mathjs, no eigen). Para sistemas pequeños
 * (1 elemento × 12 DOFs) basta JS nativo. Si en el futuro hay shells/solids,
 * esta API se extiende a más tipos.
 */

import type { Node } from "hekatan-fem";

export interface FrameElementProps {
  E: number;       // módulo elasticidad
  G: number;       // módulo cortante
  A: number;       // área
  Iy: number;      // inercia eje Y local (strong)
  Iz: number;      // inercia eje Z local (weak)
  J: number;       // constante torsión
  shearAreaY?: number;  // -1 = Bernoulli puro (sin shear deformation)
  shearAreaZ?: number;
}

export interface FrameElementGeom {
  ni: Node;        // nodo i (m)
  nj: Node;        // nodo j (m)
}

export interface FrameMatrices {
  L: number;
  /** Stiffness 12×12 in local coordinates */
  K_local: number[][];
  /** Transformation 12×12 (block-diagonal of 3×3 rotations) */
  T: number[][];
  /** Stiffness 12×12 in global coordinates: K_global = T^T·K·T */
  K_global: number[][];
  /** Direction cosines (3×3) of local axes in global frame */
  R: number[][];
}

/** Helpers internos: matrices */
function zeros(n: number, m: number = n): number[][] {
  return Array.from({ length: n }, () => new Array(m).fill(0));
}

function transpose(M: number[][]): number[][] {
  const n = M.length, m = M[0].length;
  const T = zeros(m, n);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) T[j][i] = M[i][j];
  return T;
}

function matMul(A: number[][], B: number[][]): number[][] {
  const n = A.length, p = B[0].length, k = B.length;
  const C = zeros(n, p);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < p; j++) {
      let s = 0;
      for (let kk = 0; kk < k; kk++) s += A[i][kk] * B[kk][j];
      C[i][j] = s;
    }
  return C;
}

/** Stiffness matrix of a 3D frame element in local coords (12×12).
 *  Convention: DOF order = [u1, v1, w1, θx1, θy1, θz1, u2, v2, w2, θx2, θy2, θz2]
 *  - u: axial (along local x)
 *  - v: shear in local y, w: shear in local z
 *  - θx: torsion, θy: bending around local y (strong axis if Iy > Iz)
 *  - θz: bending around local z (weak axis)
 */
export function localStiffness12(p: FrameElementProps, L: number): number[][] {
  const { E, G, A, Iy, Iz, J } = p;
  const K = zeros(12);
  // Axial (u1 ↔ u2)
  const ka = E * A / L;
  K[0][0] = ka;  K[6][6] = ka;
  K[0][6] = -ka; K[6][0] = -ka;
  // Torsion (θx1 ↔ θx2)
  const kt = G * J / L;
  K[3][3] = kt;  K[9][9] = kt;
  K[3][9] = -kt; K[9][3] = -kt;
  // Bending in xy plane (v, θz) → uses Iz
  const Lz = L, EIz = E * Iz;
  const a1 = 12 * EIz / (Lz ** 3);
  const a2 = 6 * EIz / (Lz ** 2);
  const a3 = 4 * EIz / Lz;
  const a4 = 2 * EIz / Lz;
  K[1][1] = a1;   K[1][5] = a2;   K[1][7] = -a1;  K[1][11] = a2;
  K[5][1] = a2;   K[5][5] = a3;   K[5][7] = -a2;  K[5][11] = a4;
  K[7][1] = -a1;  K[7][5] = -a2;  K[7][7] = a1;   K[7][11] = -a2;
  K[11][1] = a2;  K[11][5] = a4;  K[11][7] = -a2; K[11][11] = a3;
  // Bending in xz plane (w, θy) → uses Iy
  const EIy = E * Iy;
  const b1 = 12 * EIy / (Lz ** 3);
  const b2 = 6 * EIy / (Lz ** 2);
  const b3 = 4 * EIy / Lz;
  const b4 = 2 * EIy / Lz;
  K[2][2] = b1;   K[2][4] = -b2;  K[2][8] = -b1;  K[2][10] = -b2;
  K[4][2] = -b2;  K[4][4] = b3;   K[4][8] = b2;   K[4][10] = b4;
  K[8][2] = -b1;  K[8][4] = b2;   K[8][8] = b1;   K[8][10] = b2;
  K[10][2] = -b2; K[10][4] = b4;  K[10][8] = b2;  K[10][10] = b3;
  return K;
}

/** Direction cosines 3×3: rows are local x, y, z axes in global coords.
 *  Convención Three.js Z-up: cuando el elemento es vertical,
 *  local_y = global_y (default), local_z = -global_x.
 */
export function directionCosines(ni: Node, nj: Node): { L: number; R: number[][] } {
  const dx = nj[0] - ni[0], dy = nj[1] - ni[1], dz = nj[2] - ni[2];
  const L = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (L < 1e-12) throw new Error("Element length is zero");
  // local x = unit vector along element
  const lx = [dx / L, dy / L, dz / L];
  // Detect vertical
  const isVertical = Math.abs(lx[0]) < 1e-6 && Math.abs(lx[1]) < 1e-6;
  let ly: number[];
  if (isVertical) {
    ly = [0, 1, 0];  // for vertical columns: local y = global y
  } else {
    // Reference vertical for non-vertical elements
    const ref = [0, 0, 1];
    // local z = lx × ref / |lx × ref|
    const cx = lx[1] * ref[2] - lx[2] * ref[1];
    const cy = lx[2] * ref[0] - lx[0] * ref[2];
    const cz = lx[0] * ref[1] - lx[1] * ref[0];
    const cn = Math.sqrt(cx * cx + cy * cy + cz * cz);
    const lz = [cx / cn, cy / cn, cz / cn];
    // local y = lz × lx
    ly = [
      lz[1] * lx[2] - lz[2] * lx[1],
      lz[2] * lx[0] - lz[0] * lx[2],
      lz[0] * lx[1] - lz[1] * lx[0],
    ];
  }
  // local z = lx × ly
  const lz = [
    lx[1] * ly[2] - lx[2] * ly[1],
    lx[2] * ly[0] - lx[0] * ly[2],
    lx[0] * ly[1] - lx[1] * ly[0],
  ];
  return { L, R: [lx, ly, lz] };
}

/** Build 12×12 transformation T from 3×3 R via block-diagonal repetition (4 blocks). */
export function buildT12(R: number[][]): number[][] {
  const T = zeros(12);
  for (let blk = 0; blk < 4; blk++) {
    const o = blk * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) T[o + i][o + j] = R[i][j];
  }
  return T;
}

/** Compute all matrices: K_local, T, K_global = T^T · K_local · T */
export function computeFrameMatrices(
  geom: FrameElementGeom,
  props: FrameElementProps,
): FrameMatrices {
  const { L, R } = directionCosines(geom.ni, geom.nj);
  const K_local = localStiffness12(props, L);
  const T = buildT12(R);
  const K_global = matMul(matMul(transpose(T), K_local), T);
  return { L, K_local, T, K_global, R };
}

/** Format a matrix as plain text (rows · cols), for easy clipboard / log dump */
export function matrixToText(M: number[][], precision: number = 4): string {
  const n = M.length;
  return M.map((row) =>
    row.map((v) => {
      if (Math.abs(v) < 1e-12) return "0".padStart(12);
      const abs = Math.abs(v);
      if (abs >= 1e5 || abs < 1e-3) return v.toExponential(precision).padStart(12);
      return v.toFixed(precision).padStart(12);
    }).join(" ")
  ).join("\n");
}
