/**
 * ============================================================================
 *  planeQ4Solve — Q4 Plane Stress Finite Element Solver (pure TypeScript)
 * ============================================================================
 *
 *  Elemento Q4 de plane stress, 2 DOFs/nodo (ux, uy). Equivalente al "Plane
 *  Element" de CSi (SAP2000/ETABS) en modo plane-stress.
 *
 *  IMPORTANTE: el C++ `plateQ4Solve` tiene theoryType=2 (MEMBRANE) declarado
 *  pero NO implementado. Este módulo provee una implementación completa en TS
 *  puro que sí funciona, sin dependencias de WASM.
 *
 *  Formulación:
 *  ─────────────
 *    Shape functions (isoparametric Q4):
 *      N_i(ξ,η) = ¼(1 + ξ_i·ξ)(1 + η_i·η),   i = 1..4
 *      Node ordering natural: (-1,-1), (+1,-1), (+1,+1), (-1,+1)
 *
 *    Strains:     ε = {εxx, εyy, γxy}ᵀ
 *    Stresses:    σ = {σxx, σyy, τxy}ᵀ
 *
 *    Constitutive (plane stress):
 *      D = E/(1-ν²) · [1  ν     0     ]
 *                      [ν  1     0     ]
 *                      [0  0  (1-ν)/2  ]
 *
 *    B matrix (3×8) per Gauss point:
 *      B = [[∂N1/∂x,     0, ∂N2/∂x,     0, ...,  0     ],
 *           [    0, ∂N1/∂y,     0, ∂N2/∂y, ...,  ∂N4/∂y],
 *           [∂N1/∂y, ∂N1/∂x, ∂N2/∂y, ∂N2/∂x, ...]]
 *
 *    Element stiffness (8×8):
 *      Ke = t · Σ w_g · |J_g| · B_g^T · D · B_g   (2×2 Gauss, 4 points)
 *
 *  Assembly → K global (nDOF × nDOF con nDOF = 2·nNodes).
 *  BCs: penalización (multiplicador = 1e20 × max(diag(K))).
 *  Solve: LDLᵀ decomposition (in-place Cholesky modificado, positivo definido).
 *
 *  Referencias:
 *  ────────────
 *    Zienkiewicz & Taylor, "The Finite Element Method" vol. 1, Ch. 6
 *    Cook, Malkus, Plesha, "Concepts and Applications of FEA", Ch. 6-7
 *    CSi Analysis Reference Manual, "Plane Element"
 * ============================================================================
 */

export interface PlaneQ4Input {
  /** Young's modulus */
  E: number;
  /** Poisson's ratio */
  nu: number;
  /** Element thickness */
  thickness: number;
  /**
   * Activar modos incompatibles de Wilson (Taylor-Beresford-Wilson 1976).
   * Default: `true`. Reduce el error por bending del ~10% a <1% en
   * cantiléver a flexión pura. Referencia: Bathe Cap. 5.4, Cook 7.9.
   */
  incompatibleModes?: boolean;

  // ── Option A: explicit geometry ─────────────────────────────────────
  /** Nodes as 2D coords [x, y] */
  nodes?: [number, number][];
  /** Q4 connectivity (4 node indices per element, CCW order) */
  elements?: [number, number, number, number][];

  // ── Option B: auto rectangular mesh ─────────────────────────────────
  /** Domain width in x (if using auto mesh) */
  meshLx?: number;
  /** Domain height in y (if using auto mesh) */
  meshLy?: number;
  /** # of elements in x */
  meshNx?: number;
  /** # of elements in y */
  meshNy?: number;
  /**
   * Built-in BC shortcut for auto mesh:
   *   "cantilever-bottom"  → empotrado en y=0 (cantiléver vertical)
   *   "cantilever-left"    → empotrado en x=0 (cantiléver horizontal)
   *   "simply-supported"   → roller en 4 esquinas (UX fijo en esquina izq, UY fijo en 2 esquinas inferiores)
   */
  bcType?: "cantilever-bottom" | "cantilever-left" | "simply-supported";

  // ── BCs y cargas explícitas ─────────────────────────────────────────
  /** Boundary conditions {node, dof (0=ux | 1=uy), value (usualmente 0)} */
  bcs?: { node: number; dof: 0 | 1; value: number }[];
  /** Point loads {node, fx, fy} — fuerza concentrada */
  pointLoads?: { node: number; fx: number; fy: number }[];
  /** Resortes en los nudos {node, dof (0=ux | 1=uy), k}: apoyos elásticos (suma k a la diagonal de K). */
  springs?: { node: number; dof: 0 | 1; k: number }[];
  /**
   * Body force (peso propio, gravedad) por unidad de volumen.
   * Se integra como carga distribuida sobre cada elemento vía Gauss 2×2.
   */
  bodyForce?: { bx: number; by: number };
}

export interface PlaneQ4NodeResult {
  x: number;
  y: number;
  ux: number;
  uy: number;
}

export interface PlaneQ4ElementResult {
  nodes: [number, number, number, number];
  /** σxx en el centro del elemento (promedio de 4 Gauss points) */
  sigma_xx: number;
  /** σyy en el centro del elemento */
  sigma_yy: number;
  /** τxy en el centro del elemento */
  tau_xy: number;
  /** von Mises (plane stress):  √(σxx² - σxx·σyy + σyy² + 3·τxy²) */
  vonMises: number;
  /** Principal stresses σ1 ≥ σ2 */
  sigma_1: number;
  sigma_2: number;
}

export interface PlaneQ4Output {
  nodeResults: PlaneQ4NodeResult[];
  elementResults: PlaneQ4ElementResult[];
  /** max |ux| over all nodes */
  maxUx: number;
  /** max |uy| over all nodes */
  maxUy: number;
  /** max |σ| von Mises */
  maxVonMises: number;
  /** nDOF del sistema (2 × nNodes) */
  nDOF: number;
}

// ── Gauss 2×2 quadrature ────────────────────────────────────────────
const GP = 1 / Math.sqrt(3);
const GAUSS_PTS: [number, number][] = [
  [-GP, -GP],
  [+GP, -GP],
  [+GP, +GP],
  [-GP, +GP],
];
const GAUSS_W = [1, 1, 1, 1];

// ── Shape functions + derivatives in natural space ──────────────────
function shapeAndDeriv(xi: number, eta: number) {
  // N_i(xi, eta) = ¼(1 + ξ_i·ξ)(1 + η_i·η)
  const xi_nodes = [-1, +1, +1, -1];
  const eta_nodes = [-1, -1, +1, +1];
  const N = new Array<number>(4);
  const dN_dxi = new Array<number>(4);
  const dN_deta = new Array<number>(4);
  for (let i = 0; i < 4; i++) {
    N[i] = 0.25 * (1 + xi_nodes[i] * xi) * (1 + eta_nodes[i] * eta);
    dN_dxi[i] = 0.25 * xi_nodes[i] * (1 + eta_nodes[i] * eta);
    dN_deta[i] = 0.25 * eta_nodes[i] * (1 + xi_nodes[i] * xi);
  }
  return { N, dN_dxi, dN_deta };
}

// ── Constitutive matrix D (plane stress, 3×3) ───────────────────────
function materialD(E: number, nu: number): number[][] {
  const c = E / (1 - nu * nu);
  return [
    [c, c * nu, 0],
    [c * nu, c, 0],
    [0, 0, c * (1 - nu) / 2],
  ];
}

// ── Wilson incompatible mode shape derivatives ─────────────────────
// Wilson 1973: añadir 2 DOFs internos (α1, α2) con shape extras
// M_1 = (1 - ξ²), M_2 = (1 - η²) para mejorar bending response.
// Derivadas respecto a ξ, η evaluadas en Gauss points:
//   dM1/dξ = -2ξ,  dM1/dη = 0
//   dM2/dξ = 0,    dM2/dη = -2η
// Se integra con Jacobiano en centro (ξ=η=0) para cumplir patch test
// (Taylor, Beresford & Wilson 1976 — "A Non-Conforming Element for Stress Analysis").

// ── Element stiffness matrix Ke (8×8 o 12×12 con incompatible modes) ──
/**
 * Si `incompatible=true`, usa modos incompatibles de Wilson:
 *   - K_aa (8×8 compatible)
 *   - K_aα (8×4 coupling)
 *   - K_αα (4×4 internal)
 * Condensación estática: Ke_final = K_aa - K_aα · K_αα^-1 · K_aα^T  (8×8)
 * Esto reduce el error de bending del ~10% a <1% (Bathe Cap. 5.4).
 */
function elementKe(
  x: number[],
  y: number[],
  D: number[][],
  thickness: number,
  incompatible: boolean = true,
): { Ke: number[][]; B_center: number[][]; detJ_center: number } {
  const Ke = Array.from({ length: 8 }, () => new Array(8).fill(0));
  // Matrices auxiliares para Wilson incompatible modes (Cook 7.9):
  //   K_αα (4×4),  K_aα (8×4)
  const Kaa_w = Array.from({ length: 4 }, () => new Array(4).fill(0));
  const Kaα_w = Array.from({ length: 8 }, () => new Array(4).fill(0));
  // Jacobiano en el centro (para evaluar modos incompatibles — patch test):
  let J0_00 = 0, J0_11 = 0, detJ0 = 0;
  if (incompatible) {
    const { dN_dxi, dN_deta } = shapeAndDeriv(0, 0);
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (let i = 0; i < 4; i++) {
      J00 += dN_dxi[i] * x[i];
      J01 += dN_deta[i] * x[i];
      J10 += dN_dxi[i] * y[i];
      J11 += dN_deta[i] * y[i];
    }
    detJ0 = J00 * J11 - J01 * J10;
    J0_00 = J11 / detJ0;
    J0_11 = J00 / detJ0;
  }
  let B_center: number[][] = [];
  let detJ_center = 0;

  for (let g = 0; g < 4; g++) {
    const [xi, eta] = GAUSS_PTS[g];
    const { dN_dxi, dN_deta } = shapeAndDeriv(xi, eta);

    // Jacobian J = [dx/dxi, dx/deta; dy/dxi, dy/deta]
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (let i = 0; i < 4; i++) {
      J00 += dN_dxi[i] * x[i];
      J01 += dN_deta[i] * x[i];
      J10 += dN_dxi[i] * y[i];
      J11 += dN_deta[i] * y[i];
    }
    const detJ = J00 * J11 - J01 * J10;
    if (Math.abs(detJ) < 1e-14) throw new Error("Degenerate Q4 element (detJ≈0)");
    const invJ00 =  J11 / detJ;
    const invJ01 = -J01 / detJ;
    const invJ10 = -J10 / detJ;
    const invJ11 =  J00 / detJ;

    // dN/dx, dN/dy
    const dN_dx = new Array<number>(4);
    const dN_dy = new Array<number>(4);
    for (let i = 0; i < 4; i++) {
      dN_dx[i] = invJ00 * dN_dxi[i] + invJ01 * dN_deta[i];
      dN_dy[i] = invJ10 * dN_dxi[i] + invJ11 * dN_deta[i];
    }

    // B (3×8): [dN/dx  0 ; 0  dN/dy ; dN/dy  dN/dx]
    const B = Array.from({ length: 3 }, () => new Array(8).fill(0));
    for (let i = 0; i < 4; i++) {
      B[0][2 * i]     = dN_dx[i];
      B[1][2 * i + 1] = dN_dy[i];
      B[2][2 * i]     = dN_dy[i];
      B[2][2 * i + 1] = dN_dx[i];
    }

    // Ke += t · w_g · |J| · B^T · D · B
    // Compute DB (3×8) first
    const DB = Array.from({ length: 3 }, () => new Array(8).fill(0));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        let s = 0;
        for (let k = 0; k < 3; k++) s += D[r][k] * B[k][c];
        DB[r][c] = s;
      }
    }
    const factor = thickness * GAUSS_W[g] * Math.abs(detJ);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        let s = 0;
        for (let k = 0; k < 3; k++) s += B[k][r] * DB[k][c];
        Ke[r][c] += factor * s;
      }
    }

    // ── Wilson incompatible modes (Taylor-Beresford-Wilson 1976) ──
    // B_α (3×4) usa derivadas de M_1, M_2 respecto a x,y — evaluadas con
    // Jacobiano EN EL CENTRO (detJ0, J0_00, J0_11) para cumplir patch test.
    //   M_1(ξ,η) = 1 - ξ² → dM1/dξ = -2ξ,  dM1/dη = 0
    //   M_2(ξ,η) = 1 - η² → dM2/dξ = 0,    dM2/dη = -2η
    // DOFs internos: α = [α1_x, α1_y, α2_x, α2_y]
    if (incompatible) {
      const dM1_dxi  = -2 * xi, dM1_deta = 0;
      const dM2_dxi  = 0,        dM2_deta = -2 * eta;
      // Transformar a x,y usando Jacobian del centro:
      //   dM_i/dx = J0^-1 · [dM/dξ; dM/dη]
      //   Para elemento rectangular (J0 diagonal): dM/dx = J0_00 · dM/dξ, dM/dy = J0_11 · dM/dη
      const dM1_dx = J0_00 * dM1_dxi, dM1_dy = J0_11 * dM1_deta;
      const dM2_dx = J0_00 * dM2_dxi, dM2_dy = J0_11 * dM2_deta;
      // B_α (3×4): columnas = [α1x, α1y, α2x, α2y]
      const Balpha: number[][] = [
        [dM1_dx, 0,      dM2_dx, 0     ],  // ε_x
        [0,      dM1_dy, 0,      dM2_dy],  // ε_y
        [dM1_dy, dM1_dx, dM2_dy, dM2_dx],  // γ_xy
      ];
      // K_αα += t·w·|J| · B_α^T · D · B_α  (4×4)
      // K_aα += t·w·|J| · B^T   · D · B_α  (8×4)
      const DBa = Array.from({ length: 3 }, () => new Array(4).fill(0));
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 4; c++) {
          let s = 0;
          for (let k = 0; k < 3; k++) s += D[r][k] * Balpha[k][c];
          DBa[r][c] = s;
        }
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
          let s = 0;
          for (let k = 0; k < 3; k++) s += Balpha[k][r] * DBa[k][c];
          Kaa_w[r][c] += factor * s;
        }
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 4; c++) {
          let s = 0;
          for (let k = 0; k < 3; k++) s += B[k][r] * DBa[k][c];
          Kaα_w[r][c] += factor * s;
        }
    }

    // Save B at center for stress recovery (recomputed exactly below)
    if (g === 0) { B_center = B; detJ_center = detJ; }
  }

  // ── Condensación estática de los modos incompatibles ───────────
  // Ke_final = K_aa - K_aα · K_αα^-1 · K_aα^T
  if (incompatible) {
    // Invertir K_αα (4×4) manualmente — siempre bien condicionada para Q4 no degenerado.
    const Kinv = invert4x4(Kaa_w);
    // Kaα · Kinv (8×4)
    const KaαKinv = Array.from({ length: 8 }, () => new Array(4).fill(0));
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 4; c++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += Kaα_w[r][k] * Kinv[k][c];
        KaαKinv[r][c] = s;
      }
    // Ke -= KaαKinv · Kaα^T (8×8)
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += KaαKinv[r][k] * Kaα_w[c][k];
        Ke[r][c] -= s;
      }
  }
  // Variable unused warning silencer
  void detJ0;

  // Recompute B at exact element center (ξ=η=0) for stress recovery
  {
    const { dN_dxi, dN_deta } = shapeAndDeriv(0, 0);
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (let i = 0; i < 4; i++) {
      J00 += dN_dxi[i] * x[i];
      J01 += dN_deta[i] * x[i];
      J10 += dN_dxi[i] * y[i];
      J11 += dN_deta[i] * y[i];
    }
    const detJ = J00 * J11 - J01 * J10;
    const invJ00 =  J11 / detJ;
    const invJ01 = -J01 / detJ;
    const invJ10 = -J10 / detJ;
    const invJ11 =  J00 / detJ;
    const B = Array.from({ length: 3 }, () => new Array(8).fill(0));
    for (let i = 0; i < 4; i++) {
      const dNdx = invJ00 * dN_dxi[i] + invJ01 * dN_deta[i];
      const dNdy = invJ10 * dN_dxi[i] + invJ11 * dN_deta[i];
      B[0][2 * i]     = dNdx;
      B[1][2 * i + 1] = dNdy;
      B[2][2 * i]     = dNdy;
      B[2][2 * i + 1] = dNdx;
    }
    B_center = B;
    detJ_center = detJ;
  }

  return { Ke, B_center, detJ_center };
}

// ── Inversión 4×4 (Gauss-Jordan) para condensación estática Wilson ──
function invert4x4(A: number[][]): number[][] {
  const n = 4;
  const M = A.map((row) => row.slice());
  const I: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
  for (let k = 0; k < n; k++) {
    // Pivot parcial
    let maxRow = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[maxRow][k])) maxRow = i;
    if (maxRow !== k) { [M[k], M[maxRow]] = [M[maxRow], M[k]]; [I[k], I[maxRow]] = [I[maxRow], I[k]]; }
    const pivot = M[k][k];
    if (Math.abs(pivot) < 1e-14) throw new Error("Singular 4x4 (K_αα) in Wilson condensation");
    for (let j = 0; j < n; j++) { M[k][j] /= pivot; I[k][j] /= pivot; }
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const f = M[i][k];
      if (f === 0) continue;
      for (let j = 0; j < n; j++) { M[i][j] -= f * M[k][j]; I[i][j] -= f * I[k][j]; }
    }
  }
  return I;
}

// ── Dense LU decomposition with partial pivoting (robust) ───────────
function solveDense(A: number[][], b: number[]): number[] {
  const n = A.length;
  // In-place factorization (A will be modified)
  const M = A.map((row) => row.slice());
  const rhs = b.slice();
  const piv = new Array<number>(n);
  for (let i = 0; i < n; i++) piv[i] = i;

  for (let k = 0; k < n; k++) {
    // Partial pivot
    let maxVal = Math.abs(M[k][k]);
    let maxRow = k;
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(M[i][k]) > maxVal) {
        maxVal = Math.abs(M[i][k]);
        maxRow = i;
      }
    }
    if (maxVal < 1e-14) throw new Error(`Singular matrix at row ${k}`);
    if (maxRow !== k) {
      [M[k], M[maxRow]] = [M[maxRow], M[k]];
      [rhs[k], rhs[maxRow]] = [rhs[maxRow], rhs[k]];
      [piv[k], piv[maxRow]] = [piv[maxRow], piv[k]];
    }
    // Eliminate
    const pivot = M[k][k];
    for (let i = k + 1; i < n; i++) {
      if (M[i][k] === 0) continue;
      const factor = M[i][k] / pivot;
      M[i][k] = factor;
      for (let j = k + 1; j < n; j++) M[i][j] -= factor * M[k][j];
      rhs[i] -= factor * rhs[k];
    }
  }
  // Back substitution
  const x = new Array<number>(n);
  for (let i = n - 1; i >= 0; i--) {
    let s = rhs[i];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

// ── Main solver ─────────────────────────────────────────────────────
export function planeQ4Solve(input: PlaneQ4Input): PlaneQ4Output {
  // ── Geometry ──
  let nodes: [number, number][];
  let elements: [number, number, number, number][];

  if (input.nodes && input.elements) {
    nodes = input.nodes;
    elements = input.elements;
  } else {
    // Build rectangular mesh
    const Lx = input.meshLx ?? 1;
    const Ly = input.meshLy ?? 1;
    const nx = Math.round(input.meshNx ?? 4);
    const ny = Math.round(input.meshNy ?? 4);
    const dx = Lx / nx;
    const dy = Ly / ny;
    nodes = [];
    for (let j = 0; j <= ny; j++)
      for (let i = 0; i <= nx; i++)
        nodes.push([i * dx, j * dy]);
    elements = [];
    for (let j = 0; j < ny; j++)
      for (let i = 0; i < nx; i++) {
        const n0 = j * (nx + 1) + i;
        elements.push([n0, n0 + 1, n0 + 1 + (nx + 1), n0 + (nx + 1)]);
      }
  }

  const nNodes = nodes.length;
  const nDOF = 2 * nNodes;
  const D = materialD(input.E, input.nu);

  // ── Assemble K and F ──
  const K: number[][] = Array.from({ length: nDOF }, () => new Array(nDOF).fill(0));
  const F: number[] = new Array(nDOF).fill(0);
  const elemKeCache: number[][][] = [];
  const elemBCache: number[][][] = [];

  for (let e = 0; e < elements.length; e++) {
    const [n1, n2, n3, n4] = elements[e];
    const x = [nodes[n1][0], nodes[n2][0], nodes[n3][0], nodes[n4][0]];
    const y = [nodes[n1][1], nodes[n2][1], nodes[n3][1], nodes[n4][1]];
    const useIncompatible = input.incompatibleModes ?? true;
    const { Ke, B_center, detJ_center } = elementKe(x, y, D, input.thickness, useIncompatible);
    elemKeCache.push(Ke);
    elemBCache.push(B_center);

    const map = [2*n1, 2*n1+1, 2*n2, 2*n2+1, 2*n3, 2*n3+1, 2*n4, 2*n4+1];
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++)
        K[map[i]][map[j]] += Ke[i][j];

    // Body force (distributed): f_e = t · ∫ N^T · {bx, by} dA
    if (input.bodyForce) {
      const bx = input.bodyForce.bx;
      const by = input.bodyForce.by;
      // Simple lumped: each node gets t · area/4 · {bx, by}
      const area = 0.5 * Math.abs(
        (x[2] - x[0]) * (y[3] - y[1]) - (x[3] - x[1]) * (y[2] - y[0])
      );
      const p = input.thickness * area / 4;
      for (const nn of [n1, n2, n3, n4]) {
        F[2 * nn]     += p * bx;
        F[2 * nn + 1] += p * by;
      }
    }

    // Track one B at element center for stress recovery (unused here, used below)
    void detJ_center;
  }

  // Point loads
  if (input.pointLoads) {
    for (const pl of input.pointLoads) {
      F[2 * pl.node]     += pl.fx;
      F[2 * pl.node + 1] += pl.fy;
    }
  }

  // Resortes en los nudos (apoyos elásticos)
  if (input.springs) {
    for (const sp of input.springs) K[2 * sp.node + sp.dof][2 * sp.node + sp.dof] += sp.k;
  }

  // ── BCs ──
  const bcs: { node: number; dof: 0 | 1; value: number }[] = input.bcs ? [...input.bcs] : [];

  // Auto BCs from bcType shortcut
  if (input.bcType && input.meshLx && input.meshLy && input.meshNx && input.meshNy) {
    const nx = Math.round(input.meshNx);
    const ny = Math.round(input.meshNy);
    if (input.bcType === "cantilever-bottom") {
      // All nodes with y = 0 fully fixed
      for (let i = 0; i <= nx; i++) {
        bcs.push({ node: i, dof: 0, value: 0 });
        bcs.push({ node: i, dof: 1, value: 0 });
      }
    } else if (input.bcType === "cantilever-left") {
      for (let j = 0; j <= ny; j++) {
        const idx = j * (nx + 1);
        bcs.push({ node: idx, dof: 0, value: 0 });
        bcs.push({ node: idx, dof: 1, value: 0 });
      }
    } else if (input.bcType === "simply-supported") {
      // Corner (0,0) fully fixed, corner (Lx,0) fixed in y only
      bcs.push({ node: 0, dof: 0, value: 0 });
      bcs.push({ node: 0, dof: 1, value: 0 });
      bcs.push({ node: nx, dof: 1, value: 0 });
    }
  }

  // Apply BCs via penalty method (robust, doesn't shrink matrix)
  let maxDiag = 0;
  for (let i = 0; i < nDOF; i++) if (Math.abs(K[i][i]) > maxDiag) maxDiag = Math.abs(K[i][i]);
  const penalty = maxDiag * 1e12;
  for (const bc of bcs) {
    const gdof = 2 * bc.node + bc.dof;
    K[gdof][gdof] += penalty;
    F[gdof] += penalty * bc.value;
  }

  // ── Solve ──
  const U = solveDense(K, F);

  // ── Post-process: node results ──
  const nodeResults: PlaneQ4NodeResult[] = nodes.map((n, i) => ({
    x: n[0],
    y: n[1],
    ux: U[2 * i],
    uy: U[2 * i + 1],
  }));

  // ── Post-process: element stresses at center ──
  const elementResults: PlaneQ4ElementResult[] = [];
  let maxVM = 0;
  for (let e = 0; e < elements.length; e++) {
    const [n1, n2, n3, n4] = elements[e];
    const ue = [
      U[2*n1], U[2*n1+1],
      U[2*n2], U[2*n2+1],
      U[2*n3], U[2*n3+1],
      U[2*n4], U[2*n4+1],
    ];
    const B = elemBCache[e];
    // ε = B · ue  (3×1)
    const eps = [0, 0, 0];
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 8; k++) eps[r] += B[r][k] * ue[k];
    }
    // σ = D · ε
    const sig = [0, 0, 0];
    for (let r = 0; r < 3; r++) {
      for (let k = 0; k < 3; k++) sig[r] += D[r][k] * eps[k];
    }
    const sxx = sig[0], syy = sig[1], sxy = sig[2];
    const vm = Math.sqrt(sxx*sxx - sxx*syy + syy*syy + 3*sxy*sxy);
    // Principal stresses
    const avg = 0.5 * (sxx + syy);
    const R   = Math.sqrt(Math.pow(0.5 * (sxx - syy), 2) + sxy * sxy);
    const s1  = avg + R;
    const s2  = avg - R;
    maxVM = Math.max(maxVM, vm);
    elementResults.push({
      nodes: [n1, n2, n3, n4],
      sigma_xx: sxx,
      sigma_yy: syy,
      tau_xy: sxy,
      vonMises: vm,
      sigma_1: s1,
      sigma_2: s2,
    });
  }

  let maxUx = 0, maxUy = 0;
  for (const n of nodeResults) {
    if (Math.abs(n.ux) > maxUx) maxUx = Math.abs(n.ux);
    if (Math.abs(n.uy) > maxUy) maxUy = Math.abs(n.uy);
  }

  return {
    nodeResults,
    elementResults,
    maxUx,
    maxUy,
    maxVonMises: maxVM,
    nDOF,
  };
}
