/**
 * =============================================================================
 *  Newmark-β Time Integration Scheme — implementación canónica
 * =============================================================================
 *
 *  Método estándar de integración temporal implícito.
 *  Ecuación de movimiento:    M·ä + C·v + K·u = F(t)
 *
 *  Esquema Newmark (γ, β):
 *      u_{n+1} = u_n + Δt·v_n + Δt²·[(½−β)·a_n + β·a_{n+1}]
 *      v_{n+1} = v_n + Δt·[(1−γ)·a_n + γ·a_{n+1}]
 *
 *  Casos canónicos:
 *      γ=½, β=¼  → "Average acceleration" (incondicional. estable, sin disip.)
 *      γ=½, β=⅙  → "Linear acceleration" (cond. estable Δt < T_n/√3π ≈ T/5.5)
 *      γ=½, β=0  → "Central difference" (explícito, cond. estable)
 *
 *  Validación contra:
 *      Paz Cap. 6 — Illustrative Example 6.1, 6.2, 6.3 (Newmark-β MATLAB)
 *      Chopra "Dynamics of Structures" Tabla 5.4.2
 *
 *  Implementación: TypeScript puro con álgebra Gauss para sistemas pequeños
 *  (< 50 DOFs típico de los benchmarks Paz). Para modelos más grandes, usar
 *  el módulo C++ Eigen vía WASM (TODO).
 * =============================================================================
 */

export type Matrix = number[][];
export type Vector = number[];

export interface NewmarkConfig {
  M: Matrix;                       // Matriz de masa [nDOF × nDOF]
  K: Matrix;                       // Matriz de rigidez [nDOF × nDOF]
  C?: Matrix;                      // Matriz de amortiguamiento (Rayleigh)
  loadFunc: (t: number) => Vector; // F(t) externa
  u0: Vector;                      // desplaz. inicial
  v0: Vector;                      // velocidad inicial
  dt: number;                      // paso de tiempo Δt
  nSteps: number;                  // # de pasos
  gamma?: number;                  // default 0.5
  beta?: number;                   // default 0.25 (avg acceleration)
  /** Aceleración inicial. "equilibrio" (defecto): a₀ = M⁻¹(F(0) − C·v₀ − K·u₀), lo físico, igual al libro y a la
   *  solución exacta. "cero": a₀ = 0, lo que hace SAP2000/ETABS (Linear Direct Integration) — medido el 30-sep-2026:
   *  con a₀ = 0 este integrador da la serie de SAP2000 a 5 decimales en el Paz 8.1; con una carga que ARRANCA en
   *  F₀ ≠ 0 (pulso rectangular o triangular) CSI responde 2–5 % menos al principio. */
  a0?: "equilibrio" | "cero";
}

export interface NewmarkResult {
  t: number[];      // [nSteps+1]
  u: Vector[];      // [nSteps+1] × [nDOF]
  v: Vector[];      // [nSteps+1] × [nDOF]
  a: Vector[];      // [nSteps+1] × [nDOF]
  /** La configuración con que se integró (para repetirla en los tests, p.ej. con a₀ = 0 contra SAP2000) */
  cfg?: NewmarkConfig;
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Linear algebra utilities (Gauss elimination con pivoteo parcial)
 *  Para benchmarks Paz (2-30 DOFs) es overkill rápido. Para sistemas grandes
 *  → portar a C++ Eigen vía WASM.
 * ────────────────────────────────────────────────────────────────────────── */

/** Resuelve A·x = b vía Gauss con pivoteo parcial. Modifica A y b. */
export function gaussSolve(A: Matrix, b: Vector): Vector {
  const n = A.length;
  // Crear copias
  const M = A.map((row) => row.slice());
  const v = b.slice();

  for (let i = 0; i < n; i++) {
    // Pivoteo parcial
    let maxRow = i;
    let maxVal = Math.abs(M[i][i]);
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > maxVal) {
        maxVal = Math.abs(M[k][i]);
        maxRow = k;
      }
    }
    if (maxRow !== i) {
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      [v[i], v[maxRow]] = [v[maxRow], v[i]];
    }
    if (Math.abs(M[i][i]) < 1e-14) {
      throw new Error(`Singular matrix at row ${i}`);
    }
    // Eliminación
    for (let k = i + 1; k < n; k++) {
      const factor = M[k][i] / M[i][i];
      v[k] -= factor * v[i];
      for (let j = i; j < n; j++) M[k][j] -= factor * M[i][j];
    }
  }
  // Sustitución hacia atrás
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = v[i];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x;
}

/** Multiplica matriz × vector */
export function matVec(A: Matrix, x: Vector): Vector {
  const n = A.length;
  const r = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < x.length; j++) s += A[i][j] * x[j];
    r[i] = s;
  }
  return r;
}

/** A + α·B */
export function matAdd(A: Matrix, B: Matrix, alpha: number = 1): Matrix {
  return A.map((row, i) => row.map((v, j) => v + alpha * B[i][j]));
}

/** Matriz cero n×n */
export function zeros(n: number): Matrix {
  return Array.from({ length: n }, () => new Array(n).fill(0));
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Resolvedor de eigenvalores para análisis modal de sistemas pequeños
 *  (Jacobi para matrices simétricas — robusto y simple)
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Resuelve K·φ = ω²·M·φ via reducción a problema estándar.
 * Returns omega² ordenados ascendentemente y modos correspondientes.
 *
 * Estrategia: Cholesky M = L·L^T → solve L·y = φ → A=L⁻¹·K·L⁻T → eigenproblem
 * estándar resuelto con Jacobi.
 */
export function solveEigenGeneralized(K: Matrix, M: Matrix): {
  omega2: number[];    // ω² ascendente
  freqs: number[];     // f = ω/(2π) Hz
  modes: Matrix;       // modos por columnas, normalizados M-orthogonally (φ^T·M·φ = I)
} {
  const n = K.length;
  // Cholesky de M (M definida positiva)
  const L = zeros(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = M[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("M not positive definite");
        L[i][j] = Math.sqrt(s);
      } else {
        L[i][j] = s / L[j][j];
      }
    }
  }
  // Inversa de L (triangular inferior)
  const Linv = zeros(n);
  for (let i = 0; i < n; i++) {
    Linv[i][i] = 1 / L[i][i];
    for (let j = 0; j < i; j++) {
      let s = 0;
      for (let k = j; k < i; k++) s -= L[i][k] * Linv[k][j];
      Linv[i][j] = s / L[i][i];
    }
  }
  // A = Linv · K · Linv^T (estándar simétrico)
  const KLinvT = zeros(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += K[i][k] * Linv[j][k];
      KLinvT[i][j] = s;
    }
  }
  const A = zeros(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += Linv[i][k] * KLinvT[k][j];
      A[i][j] = s;
    }
  }
  // Forzar simetría
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const v = (A[i][j] + A[j][i]) / 2;
    A[i][j] = v; A[j][i] = v;
  }
  // Jacobi
  const { values, vectors } = jacobiEigen(A);
  // Ordenar ascendentemente
  const idx = values.map((_, i) => i).sort((a, b) => values[a] - values[b]);
  const omega2 = idx.map((i) => values[i]);
  const Y = idx.map((i) => vectors.map((row) => row[i]));  // Y[k] = k-th eigenvector
  // Reconstruir modos en sistema original: φ = Linv^T · y
  const modes: Matrix = zeros(n);
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      let s = 0;
      for (let j = 0; j < n; j++) s += Linv[j][i] * Y[k][j];
      modes[i][k] = s;
    }
  }
  return {
    omega2,
    freqs: omega2.map((w2) => Math.sqrt(Math.max(w2, 0)) / (2 * Math.PI)),
    modes,
  };
}

/** Jacobi eigendecomposition para matriz simétrica n×n */
function jacobiEigen(Ain: Matrix): { values: number[]; vectors: Matrix } {
  const n = Ain.length;
  const A = Ain.map((row) => row.slice());
  const V = zeros(n);
  for (let i = 0; i < n; i++) V[i][i] = 1;
  const maxIter = 200;
  const tol = 1e-12;
  for (let iter = 0; iter < maxIter; iter++) {
    // Encontrar elemento off-diagonal más grande
    let p = 0, q = 1, max = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[i][j]) > max) { max = Math.abs(A[i][j]); p = i; q = j; }
    }
    if (max < tol) break;
    // Rotación
    const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
    let t: number;
    if (Math.abs(theta) > 1e30) t = 1 / (2 * theta);
    else {
      const sgn = theta >= 0 ? 1 : -1;
      t = sgn / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    }
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    // Aplicar rotación
    const Apq = A[p][q];
    A[p][p] -= t * Apq;
    A[q][q] += t * Apq;
    A[p][q] = 0; A[q][p] = 0;
    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const Aip = A[i][p], Aiq = A[i][q];
        A[i][p] = c * Aip - s * Aiq;
        A[p][i] = A[i][p];
        A[i][q] = s * Aip + c * Aiq;
        A[q][i] = A[i][q];
      }
      const Vip = V[i][p], Viq = V[i][q];
      V[i][p] = c * Vip - s * Viq;
      V[i][q] = s * Vip + c * Viq;
    }
  }
  return { values: A.map((row, i) => row[i]), vectors: V };
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Newmark-β integrator
 * ────────────────────────────────────────────────────────────────────────── */

export function newmarkBeta(cfg: NewmarkConfig): NewmarkResult {
  const { M, K, loadFunc, u0, v0, dt, nSteps } = cfg;
  const n = M.length;
  const C = cfg.C ?? zeros(n);
  const gamma = cfg.gamma ?? 0.5;
  const beta = cfg.beta ?? 0.25;

  // Aceleración inicial: M·a0 = F(0) − C·v0 − K·u0
  const F0 = loadFunc(0);
  const Cv0 = matVec(C, v0);
  const Ku0 = matVec(K, u0);
  const rhs0 = F0.map((f, i) => f - Cv0[i] - Ku0[i]);
  const a0 = cfg.a0 === "cero" ? new Array(n).fill(0) : gaussSolve(M, rhs0);

  // Matriz efectiva K* = K + γ·dt·C/(β·dt²) + M/(β·dt²)
  // Forma estándar: K* = K + (γ/(β·dt))·C + (1/(β·dt²))·M
  const c1 = 1 / (beta * dt * dt);
  const c2 = gamma / (beta * dt);
  const Kstar = matAdd(matAdd(K, M, c1), C, c2);

  const tArr: number[] = [0];
  const uArr: Vector[] = [u0.slice()];
  const vArr: Vector[] = [v0.slice()];
  const aArr: Vector[] = [a0.slice()];

  let u = u0.slice(), v = v0.slice(), a = a0.slice();

  for (let step = 0; step < nSteps; step++) {
    const t1 = (step + 1) * dt;
    const F1 = loadFunc(t1);

    // RHS: F(t+dt) + M·(u/(β·dt²) + v/(β·dt) + (1/(2β)−1)·a)
    //               + C·(γ·u/(β·dt) + (γ/β−1)·v + dt·(γ/(2β)−1)·a)
    const cm1 = 1 / (beta * dt * dt);
    const cm2 = 1 / (beta * dt);
    const cm3 = 1 / (2 * beta) - 1;
    const cc1 = gamma / (beta * dt);
    const cc2 = gamma / beta - 1;
    const cc3 = dt * (gamma / (2 * beta) - 1);

    const rhs = new Array(n).fill(0);
    const tmpM = new Array(n).fill(0);
    const tmpC = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      tmpM[i] = cm1 * u[i] + cm2 * v[i] + cm3 * a[i];
      tmpC[i] = cc1 * u[i] + cc2 * v[i] + cc3 * a[i];
    }
    const Mtm = matVec(M, tmpM);
    const Ctc = matVec(C, tmpC);
    for (let i = 0; i < n; i++) rhs[i] = F1[i] + Mtm[i] + Ctc[i];

    const u1 = gaussSolve(Kstar, rhs);
    const a1 = new Array(n).fill(0);
    const v1 = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      a1[i] = cm1 * (u1[i] - u[i]) - cm2 * v[i] - cm3 * a[i];
      v1[i] = v[i] + dt * ((1 - gamma) * a[i] + gamma * a1[i]);
    }

    tArr.push(t1);
    uArr.push(u1.slice());
    vArr.push(v1.slice());
    aArr.push(a1.slice());

    u = u1; v = v1; a = a1;
  }

  return { t: tArr, u: uArr, v: vArr, a: aArr, cfg };
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Funciones de carga predefinidas (los pulsos clásicos de Paz)
 * ────────────────────────────────────────────────────────────────────────── */

/** Pulso rectangular F0 entre [t_start, t_end], 0 fuera */
export function rectPulse(F0: number, t_start: number, t_end: number) {
  return (t: number) => (t >= t_start && t <= t_end ? F0 : 0);
}

/** Pulso triangular: F0 en t=0, decreciendo linealmente a 0 en t=td */
export function triangularPulse(F0: number, td: number) {
  return (t: number) => (t <= 0 ? F0 : t >= td ? 0 : F0 * (1 - t / td));
}

/** Step (escalón) F0 a partir de t=0 */
export function stepLoad(F0: number) {
  return (t: number) => (t >= 0 ? F0 : 0);
}

/** Senoidal F0·sin(Ω·t) a partir de t=0 */
export function harmonicLoad(F0: number, Omega: number) {
  return (t: number) => (t >= 0 ? F0 * Math.sin(Omega * t) : 0);
}

/** Convierte un escalar 1-DOF en vector apuntando al DOF i */
export function pointAtDof(scalarFn: (t: number) => number, i: number, n: number) {
  return (t: number): Vector => {
    const v = new Array(n).fill(0);
    v[i] = scalarFn(t);
    return v;
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 *  Builders de matrices canónicas para shear buildings (Paz 7.1, 9.3)
 * ────────────────────────────────────────────────────────────────────────── */

/**
 * Construye K y M para un shear building de N pisos.
 * Cada piso: masa concentrada m[i], rigidez de columna k[i] (suma de columnas)
 *
 *   K[i][i]   = k[i] + k[i+1]    (excepto último piso → solo k[N])
 *   K[i][i+1] = K[i+1][i] = -k[i+1]
 *   M[i][i]   = m[i]
 *
 * @param m  vector de masas por piso (de abajo a arriba), length=N
 * @param k  vector de rigideces por piso (k[0]=primer piso desde base)
 */
export function shearBuildingKM(m: number[], k: number[]): { K: Matrix; M: Matrix } {
  const N = m.length;
  if (k.length !== N) throw new Error(`k.length=${k.length} != m.length=${N}`);
  const K = zeros(N);
  const M = zeros(N);
  for (let i = 0; i < N; i++) {
    M[i][i] = m[i];
    K[i][i] = k[i] + (i + 1 < N ? k[i + 1] : 0);
    if (i + 1 < N) {
      K[i][i + 1] = -k[i + 1];
      K[i + 1][i] = -k[i + 1];
    }
  }
  return { K, M };
}

/**
 * Damping de Rayleigh: C = α·M + β·K
 * Dado dos modos (i, j) con ratios ξ_i y ξ_j (default ambos = ξ):
 *   α = 2·ξ·ω_i·ω_j / (ω_i + ω_j)
 *   β = 2·ξ / (ω_i + ω_j)
 */
export function rayleighDamping(M: Matrix, K: Matrix, omega_i: number, omega_j: number, xi_i: number, xi_j: number = xi_i): Matrix {
  const denom = omega_j * omega_j - omega_i * omega_i;
  const alpha = 2 * omega_i * omega_j * (xi_i * omega_j - xi_j * omega_i) / denom;
  const beta = 2 * (xi_j * omega_j - xi_i * omega_i) / denom;
  return matAdd(M.map((row) => row.map((v) => alpha * v)), K, beta);
}
