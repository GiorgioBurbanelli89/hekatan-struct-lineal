/**
 * Shell Q4 DKMQ (Discrete Kirchhoff-Mindlin Quadrilateral) — TS port de PyNite Quad3D.py
 *
 * Referencias (del header de PyNite Quad3D.py):
 *   1. "A Comparative Formulation of DKMQ, DSQ and MITC4 Quadrilateral Plate Elements
 *       with New Numerical Results Based on s-norm Tests", Irwan Katili (1993, 2015)
 *   2. "Finite Element Procedures, 2nd Edition", Klaus-Jurgen Bathe
 *   3. "A First Course in the Finite Element Method, 4th Edition", Daryl L. Logan
 *   4. "Finite Element Analysis Fundamentals", Richard H. Gallagher
 *
 * Formulacion:
 *   - Bending DKMQ (Katili) con 4 rotaciones jerárquicas Δβ_k para correccion del shear gap
 *   - Plane stress isoparametrico Q4 superpuesto (membrana)
 *   - Drilling: weak rotational spring = 1/1000 del menor diagonal rotacional (Bathe 4.19)
 *   - Matriz local 24x24 (6 DOFs/nodo: u, v, w, θx, θy, θz)
 *
 * Match esperado vs SAP Plate-Thin: w_max ≈ -2.92 mm en plate-with-beams (vs -3.13 SAP).
 */

import { ElementInputs, Node } from "../data-model";

type Mat = number[][];
type Vec = number[];

// ── Linear algebra utilities (sin mathjs para performance) ─────────────
function zeros(rows: number, cols: number): Mat {
  const m: Mat = [];
  for (let i = 0; i < rows; i++) { const row: number[] = []; for (let j = 0; j < cols; j++) row.push(0); m.push(row); }
  return m;
}
function matMul(A: Mat, B: Mat): Mat {
  const r = A.length, c = B[0].length, k = B.length;
  const C = zeros(r, c);
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
    let s = 0; for (let p = 0; p < k; p++) s += A[i][p] * B[p][j];
    C[i][j] = s;
  }
  return C;
}
function matAdd(A: Mat, B: Mat): Mat {
  const m = A.length, n = A[0].length, C = zeros(m, n);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) C[i][j] = A[i][j] + B[i][j];
  return C;
}
function matScale(A: Mat, s: number): Mat {
  const m = A.length, n = A[0].length, C = zeros(m, n);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) C[i][j] = A[i][j] * s;
  return C;
}
function transpose(A: Mat): Mat {
  const m = A.length, n = A[0].length, C = zeros(n, m);
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) C[j][i] = A[i][j];
  return C;
}
function det2(A: Mat): number { return A[0][0] * A[1][1] - A[0][1] * A[1][0]; }
function inv2(A: Mat): Mat {
  const d = det2(A);
  return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]];
}

// ── Local coords para Q4 con n_1 origen, eje x = vector_12 ─────────────
function localCoords(nodes: Node[]): { x: Vec; y: Vec } {
  const [n1, n2, n3, n4] = nodes;
  const v12 = [n2[0] - n1[0], n2[1] - n1[1], n2[2] - n1[2]];
  const v13 = [n3[0] - n1[0], n3[1] - n1[1], n3[2] - n1[2]];
  const v14 = [n4[0] - n1[0], n4[1] - n1[1], n4[2] - n1[2]];
  // x = v12 normalizado
  const lx = Math.hypot(v12[0], v12[1], v12[2]);
  const xAxis = [v12[0] / lx, v12[1] / lx, v12[2] / lx];
  // z = x × v13
  const z = [xAxis[1] * v13[2] - xAxis[2] * v13[1],
             xAxis[2] * v13[0] - xAxis[0] * v13[2],
             xAxis[0] * v13[1] - xAxis[1] * v13[0]];
  const lz = Math.hypot(z[0], z[1], z[2]);
  const zAxis = [z[0] / lz, z[1] / lz, z[2] / lz];
  // y = z × x
  const yAxis = [zAxis[1] * xAxis[2] - zAxis[2] * xAxis[1],
                 zAxis[2] * xAxis[0] - zAxis[0] * xAxis[2],
                 zAxis[0] * xAxis[1] - zAxis[1] * xAxis[0]];
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const x = [0, dot(v12, xAxis), dot(v13, xAxis), dot(v14, xAxis)];
  const y = [0, dot(v12, yAxis), dot(v13, yAxis), dot(v14, yAxis)];
  return { x, y };
}

// ── Longitud lado k (k = 5,6,7,8 → lados 1-2, 2-3, 3-4, 4-1) ───────────
function Lk(x: Vec, y: Vec, k: number): number {
  if (k === 5) return Math.hypot(x[1] - x[0], y[1] - y[0]);
  if (k === 6) return Math.hypot(x[2] - x[1], y[2] - y[1]);
  if (k === 7) return Math.hypot(x[3] - x[2], y[3] - y[2]);
  if (k === 8) return Math.hypot(x[0] - x[3], y[0] - y[3]);
  throw new Error("k debe ser 5..8");
}

// ── Cosenos directores del lado k ─────────────────────────────────────
function dirCos(x: Vec, y: Vec, k: number): [number, number] {
  const L = Lk(x, y, k);
  if (k === 5) return [(x[1] - x[0]) / L, (y[1] - y[0]) / L];
  if (k === 6) return [(x[2] - x[1]) / L, (y[2] - y[1]) / L];
  if (k === 7) return [(x[3] - x[2]) / L, (y[3] - y[2]) / L];
  if (k === 8) return [(x[0] - x[3]) / L, (y[0] - y[3]) / L];
  throw new Error("k debe ser 5..8");
}

// ── Parametro adimensional φ_k para shear gap ─────────────────────────
function phiK(x: Vec, y: Vec, k: number, t: number, nu: number): number {
  const kappa = 5 / 6;
  return (2 / (kappa * (1 - nu))) * Math.pow(t / Lk(x, y, k), 2);
}

// ── Jacobiano J(xi, eta) — 2x2 ────────────────────────────────────────
function J(x: Vec, y: Vec, xi: number, eta: number): Mat {
  return [
    [0.25 * (x[0]*(eta-1) - x[1]*(eta-1) + x[2]*(eta+1) - x[3]*(eta+1)),
     0.25 * (y[0]*(eta-1) - y[1]*(eta-1) + y[2]*(eta+1) - y[3]*(eta+1))],
    [0.25 * (x[0]*(xi-1) - x[1]*(xi+1) + x[2]*(xi+1) - x[3]*(xi-1)),
     0.25 * (y[0]*(xi-1) - y[1]*(xi+1) + y[2]*(xi+1) - y[3]*(xi-1))],
  ];
}

// ── N_gamma 2x4 ────────────────────────────────────────────────────────
function N_gamma(xi: number, eta: number): Mat {
  return [
    [0.5 * (1 - eta), 0, 0.5 * (1 + eta), 0],
    [0, 0.5 * (1 + xi), 0, 0.5 * (1 - xi)],
  ];
}

// ── A_gamma 4x4 ────────────────────────────────────────────────────────
function A_gamma(x: Vec, y: Vec): Mat {
  const L5 = Lk(x, y, 5), L6 = Lk(x, y, 6), L7 = Lk(x, y, 7), L8 = Lk(x, y, 8);
  return [
    [L5 / 2, 0, 0, 0],
    [0, L6 / 2, 0, 0],
    [0, 0, -L7 / 2, 0],
    [0, 0, 0, -L8 / 2],
  ];
}

// ── A_u 4x12 ───────────────────────────────────────────────────────────
function A_u(x: Vec, y: Vec): Mat {
  const L5 = Lk(x, y, 5), L6 = Lk(x, y, 6), L7 = Lk(x, y, 7), L8 = Lk(x, y, 8);
  const [C5, S5] = dirCos(x, y, 5);
  const [C6, S6] = dirCos(x, y, 6);
  const [C7, S7] = dirCos(x, y, 7);
  const [C8, S8] = dirCos(x, y, 8);
  return matScale([
    [-2/L5, C5, S5,  2/L5, C5, S5,   0,   0,  0,   0,   0,  0],
    [ 0,    0,  0, -2/L6, C6, S6, 2/L6, C6, S6,   0,   0,  0],
    [ 0,    0,  0,   0,   0,  0, -2/L7, C7, S7, 2/L7, C7, S7],
    [ 2/L8, C8, S8,   0,   0,  0,   0,   0,  0, -2/L8, C8, S8],
  ], 0.5);
}

// ── A_Delta_inv_DKMQ 4x4 (Equacion 46-ish, Katili) ─────────────────────
function A_Delta_inv_DKMQ(x: Vec, y: Vec, t: number, nu: number): Mat {
  const p5 = phiK(x, y, 5, t, nu);
  const p6 = phiK(x, y, 6, t, nu);
  const p7 = phiK(x, y, 7, t, nu);
  const p8 = phiK(x, y, 8, t, nu);
  return matScale([
    [1/(1+p5), 0, 0, 0],
    [0, 1/(1+p6), 0, 0],
    [0, 0, 1/(1+p7), 0],
    [0, 0, 0, 1/(1+p8)],
  ], -1.5);
}

// ── A_phi_Delta 4x4 ────────────────────────────────────────────────────
function A_phi_Delta(x: Vec, y: Vec, t: number, nu: number): Mat {
  const p5 = phiK(x, y, 5, t, nu);
  const p6 = phiK(x, y, 6, t, nu);
  const p7 = phiK(x, y, 7, t, nu);
  const p8 = phiK(x, y, 8, t, nu);
  return [
    [p5/(1+p5), 0, 0, 0],
    [0, p6/(1+p6), 0, 0],
    [0, 0, p7/(1+p7), 0],
    [0, 0, 0, p8/(1+p8)],
  ];
}

// ── B_b_beta 3x12 (bending, parte standard) ───────────────────────────
function B_b_beta(x: Vec, y: Vec, xi: number, eta: number): Mat {
  const Jinv = inv2(J(x, y, xi, eta));
  const [j11, j12] = Jinv[0]; const [j21, j22] = Jinv[1];
  const N1_xi = 0.25*(eta - 1), N2_xi = -0.25*(eta - 1), N3_xi = 0.25*(eta + 1), N4_xi = -0.25*(eta + 1);
  const N1_eta = 0.25*(xi - 1), N2_eta = -0.25*(xi + 1), N3_eta = 0.25*(xi + 1), N4_eta = -0.25*(xi - 1);
  const Nx = [j11*N1_xi+j12*N1_eta, j11*N2_xi+j12*N2_eta, j11*N3_xi+j12*N3_eta, j11*N4_xi+j12*N4_eta];
  const Ny = [j21*N1_xi+j22*N1_eta, j21*N2_xi+j22*N2_eta, j21*N3_xi+j22*N3_eta, j21*N4_xi+j22*N4_eta];
  return [
    [0, Nx[0], 0,  0, Nx[1], 0,  0, Nx[2], 0,  0, Nx[3], 0],
    [0, 0,  Ny[0], 0, 0,  Ny[1], 0, 0,  Ny[2], 0, 0,  Ny[3]],
    [0, Ny[0], Nx[0], 0, Ny[1], Nx[1], 0, Ny[2], Nx[2], 0, Ny[3], Nx[3]],
  ];
}

// ── B_b_Delta_beta 3x4 (correccion Katili usando rotaciones jerarquicas) ─
function B_b_Delta_beta(x: Vec, y: Vec, xi: number, eta: number): Mat {
  const Jinv = inv2(J(x, y, xi, eta));
  const [j11, j12] = Jinv[0]; const [j21, j22] = Jinv[1];
  const P5_xi = xi*(eta - 1),  P6_xi = -0.5*(eta-1)*(eta+1), P7_xi = -xi*(eta+1), P8_xi = 0.5*(eta-1)*(eta+1);
  const P5_eta = 0.5*(xi-1)*(xi+1), P6_eta = -eta*(xi+1), P7_eta = -0.5*(xi-1)*(xi+1), P8_eta = eta*(xi-1);
  const Px = [j11*P5_xi+j12*P5_eta, j11*P6_xi+j12*P6_eta, j11*P7_xi+j12*P7_eta, j11*P8_xi+j12*P8_eta];
  const Py = [j21*P5_xi+j22*P5_eta, j21*P6_xi+j22*P6_eta, j21*P7_xi+j22*P7_eta, j21*P8_xi+j22*P8_eta];
  const [C5, S5] = dirCos(x, y, 5);
  const [C6, S6] = dirCos(x, y, 6);
  const [C7, S7] = dirCos(x, y, 7);
  const [C8, S8] = dirCos(x, y, 8);
  return [
    [Px[0]*C5, Px[1]*C6, Px[2]*C7, Px[3]*C8],
    [Py[0]*S5, Py[1]*S6, Py[2]*S7, Py[3]*S8],
    [Py[0]*C5+Px[0]*S5, Py[1]*C6+Px[1]*S6, Py[2]*C7+Px[2]*S7, Py[3]*C8+Px[3]*S8],
  ];
}

// ── B_b 3x12 ──────────────────────────────────────────────────────────
function B_b(x: Vec, y: Vec, xi: number, eta: number, t: number, nu: number): Mat {
  return matAdd(
    B_b_beta(x, y, xi, eta),
    matMul(matMul(B_b_Delta_beta(x, y, xi, eta), A_Delta_inv_DKMQ(x, y, t, nu)), A_u(x, y))
  );
}

// ── B_s 2x12 ──────────────────────────────────────────────────────────
function B_s(x: Vec, y: Vec, xi: number, eta: number, t: number, nu: number): Mat {
  return matMul(
    matMul(matMul(matMul(inv2(J(x, y, xi, eta)), N_gamma(xi, eta)), A_gamma(x, y)),
           A_phi_Delta(x, y, t, nu)),
    A_u(x, y)
  );
}

// ── B_m 3x8 (membrana plane stress) ───────────────────────────────────
function B_m(x: Vec, y: Vec, xi: number, eta: number): Mat {
  const Jinv = inv2(J(x, y, xi, eta));
  const dHnat = [
    [0.25*(eta - 1), 0.25*(-eta + 1), 0.25*(eta + 1), 0.25*(-eta - 1)],
    [0.25*(xi - 1),  0.25*(-xi - 1),  0.25*(xi + 1),  0.25*(-xi + 1)],
  ];
  const dH = matMul(Jinv, dHnat);
  return [
    [dH[0][0], 0,        dH[0][1], 0,        dH[0][2], 0,        dH[0][3], 0],
    [0,        dH[1][0], 0,        dH[1][1], 0,        dH[1][2], 0,        dH[1][3]],
    [dH[1][0], dH[0][0], dH[1][1], dH[0][1], dH[1][2], dH[0][2], dH[1][3], dH[0][3]],
  ];
}

// ── Constitutivas ─────────────────────────────────────────────────────
function Hb_mat(E: number, nu: number, t: number): Mat {
  const c = E * t**3 / (12 * (1 - nu**2));
  return [[c, c*nu, 0], [c*nu, c, 0], [0, 0, c*(1-nu)/2]];
}
function Hs_mat(E: number, nu: number, t: number): Mat {
  const kappa = 5/6;
  const c = E * t * kappa / (2*(1+nu));
  return [[c, 0], [0, c]];
}
function Cm_mat(E: number, nu: number): Mat {
  const G = E / (2*(1+nu));
  const c = 1/(1 - nu*nu);
  return [[c*E, c*nu*E, 0], [c*nu*E, c*E, 0], [0, 0, (1 - nu*nu)*G]];
}

// ── k_b 12x12 → expand a 24x24 con drilling weak spring ───────────────
function k_bending(x: Vec, y: Vec, t: number, E: number, nu: number): Mat {
  const Hb = Hb_mat(E, nu, t), Hs = Hs_mat(E, nu, t);
  const gp = 1 / Math.sqrt(3);
  const xis = [-gp, gp, gp, -gp];
  const etas = [-gp, -gp, gp, gp];
  let k12: Mat = zeros(12, 12);
  for (let i = 0; i < 4; i++) {
    const dJ = det2(J(x, y, xis[i], etas[i]));
    const Bb = B_b(x, y, xis[i], etas[i], t, nu);
    const Bs = B_s(x, y, xis[i], etas[i], t, nu);
    k12 = matAdd(k12, matScale(matMul(matMul(transpose(Bb), Hb), Bb), dJ));
    k12 = matAdd(k12, matScale(matMul(matMul(transpose(Bs), Hs), Bs), dJ));
  }
  return k12;
}
function k_membrane(x: Vec, y: Vec, t: number, E: number, nu: number): Mat {
  const Cm = Cm_mat(E, nu);
  const gp = 1 / Math.sqrt(3);
  const xis = [-gp, gp, gp, -gp];
  const etas = [-gp, -gp, gp, gp];
  let k8: Mat = zeros(8, 8);
  for (let i = 0; i < 4; i++) {
    const dJ = det2(J(x, y, xis[i], etas[i]));
    const Bm = B_m(x, y, xis[i], etas[i]);
    k8 = matAdd(k8, matScale(matMul(matMul(transpose(Bm), Cm), Bm), dJ * t));
  }
  return k8;
}

// ── ENSAMBLE FINAL 24x24 (mapping PyNite) ─────────────────────────────
// DOFs por nodo: [u, v, w, θx, θy, θz] (6 DOF/nodo × 4 = 24)
// k_b (12x12) tiene DOFs [w_i, θx_i, θy_i] por nodo (la convencion DKMQ usa θy_i = rotation about y)
// Por nodo en k_exp: w=2, θx=3, θy=4, drilling θz=5  (offset 6*i)
export function getLocalStiffnessMatrixShellQ4_DKMQ(
  nodes: Node[], elementInputs: ElementInputs, index: number
): number[][] {
  const E = elementInputs.elasticities?.get(index) ?? 0;
  const nu = elementInputs.poissonsRatios?.get(index) ?? 0;
  const t = elementInputs.thicknesses?.get(index) ?? 0;

  const { x, y } = localCoords(nodes);

  // (1) k_b 12x12 (DOFs: w_i, θx_i, θy_i por nodo)
  const k12_bs = k_bending(x, y, t, E, nu);
  // (2) k_m 8x8 (DOFs: u_i, v_i por nodo)
  const k8_mem = k_membrane(x, y, t, E, nu);

  // Expandir a 24x24 con mapping PyNite
  const k24 = zeros(24, 24);

  // Mapping bending 12→24:
  //   index 0,3,6,9   → w_i (DOF local 2 + 6*i)
  //   index 1,4,7,10  → θx_i (DOF local 3 + 6*i)
  //   index 2,5,8,11  → θy_i (DOF local 4 + 6*i)
  // Convencion PyNite tiene swap entre θx/θy y signo, replicamos.
  const mapBend = (i: number) => {
    if ([0, 3, 6, 9].includes(i)) return 2 * i + 2;
    if ([1, 4, 7, 10].includes(i)) return 2 * i + 1;
    return 2 * i;  // 2,5,8,11
  };
  for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) {
    k24[mapBend(i)][mapBend(j)] = k12_bs[i][j];
  }

  // Drilling: weak spring 1/1000 del menor diagonal rotacional
  // Rotacionales bending son indices [1,2,4,5,7,8,10,11] en k12 → indices expandidos
  const rotDiags = [1, 2, 4, 5, 7, 8, 10, 11].map(i => Math.abs(k12_bs[i][i]));
  const kRz = Math.min(...rotDiags) / 1000;
  k24[5][5] = kRz;
  k24[11][11] = kRz;
  k24[17][17] = kRz;
  k24[23][23] = kRz;

  // PyNite invierte signo de +y bending para matchear su convencion
  for (const i of [4, 10, 16, 22]) {
    for (let j = 0; j < 24; j++) { k24[i][j] *= -1; k24[j][i] *= -1; }
  }
  // Swap x/y en indices [3,4],[9,10],[15,16],[21,22]
  const swap = (arr: number[][], i: number, j: number) => {
    const ri = arr[i]; arr[i] = arr[j]; arr[j] = ri;
    for (let r = 0; r < arr.length; r++) { const t = arr[r][i]; arr[r][i] = arr[r][j]; arr[r][j] = t; }
  };
  swap(k24, 3, 4); swap(k24, 9, 10); swap(k24, 15, 16); swap(k24, 21, 22);

  // Mapping membrana 8→24:
  //   par (u_i, v_i) → indices 0,1 + 6*i
  const mapMem = (i: number) => {
    // i 0..7 → nodo = i//2, dof_local = i%2 (0=u, 1=v)
    return Math.floor(i / 2) * 6 + (i % 2);
  };
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    k24[mapMem(i)][mapMem(j)] += k8_mem[i][j];
  }

  return k24;
}
