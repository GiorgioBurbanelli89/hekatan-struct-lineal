/**
 * calcEngine.ts — Parser/evaluador estilo MATLAB usando math.js
 *
 * Soporta:
 *   - Matrices: K = [1,2;3,4]
 *   - Vectores: F = [10;0;-5]
 *   - Indexación 1-based: K(1,2), F(3)
 *   - Backslash solve: u = K \ F
 *   - Transpuesta: K'
 *   - zeros(n,m), ones(n,m), eye(n)
 *   - inv(), det(), transpose(), norm()
 *   - for i = a:b ... end
 *   - if cond ... else ... end
 *   - Comentarios: % texto
 *   - FEM helpers: stiffness(i), transform(i)
 */

import { create, all } from "mathjs";
// @ts-ignore — nerdamer is UMD, import as default
import nerdamer from "nerdamer/all.min.js";
import {
  getLocalStiffnessMatrix,
  getTransformationMatrix,
  didacticSolveCpp,
} from "hekatan-fem";
import type { Node, ElementInputs, NodeInputs } from "hekatan-fem";
import type { ModelData } from "./calcTemplates";

// Create math.js instance with all functions
const math = create(all, {
  number: "number",
  matrix: "Matrix",
}) as any; // full math.js instance with evaluate, subset, etc.

// ═══════════════════════════════════════════════════════
// MATLAB COMPATIBILITY — register missing functions
// ═══════════════════════════════════════════════════════
math.import({
  // eye(n) → identity(n)
  eye: function(n: number, m?: number) { return math.identity(m ? [n, m] : n); },

  // linspace(a, b, n) — MATLAB linspace
  linspace: function(a: number, b: number, n?: number) {
    const N = n || 100;
    const step = (b - a) / (N - 1);
    const arr: number[] = [];
    for (let i = 0; i < N; i++) arr.push(a + i * step);
    return math.matrix(arr);
  },

  // rank(A) — matrix rank via SVD tolerance
  rank: function(A: any) {
    const m = math.matrix(A);
    const s = m.size();
    if (s.length < 2) return s[0] > 0 ? 1 : 0;
    // Use LU to estimate rank
    try {
      const lu = math.lup(m);
      const U = lu.U;
      const uArr = U.toArray();
      const tol = 1e-10 * Math.max(s[0], s[1]);
      let r = 0;
      for (let i = 0; i < Math.min(s[0], s[1]); i++) {
        if (Math.abs(uArr[i][i]) > tol) r++;
      }
      return r;
    } catch { return 0; }
  },

  // cond(A) — condition number (norm(A) * norm(inv(A)))
  cond: function(A: any) {
    try {
      const nA = math.norm(A);
      const nAi = math.norm(math.inv(A));
      return math.multiply(nA, nAi);
    } catch { return Infinity; }
  },

  // rref(A) — reduced row echelon form
  rref: function(A: any) {
    const m = math.matrix(A).toArray() as number[][];
    const rows = m.length, cols = m[0].length;
    let lead = 0;
    for (let r = 0; r < rows; r++) {
      if (lead >= cols) break;
      let i = r;
      while (Math.abs(m[i][lead]) < 1e-12) {
        i++;
        if (i === rows) { i = r; lead++; if (lead === cols) return math.matrix(m); }
      }
      [m[i], m[r]] = [m[r], m[i]]; // swap
      const lv = m[r][lead];
      m[r] = m[r].map(v => v / lv);
      for (let j = 0; j < rows; j++) {
        if (j !== r) {
          const f = m[j][lead];
          m[j] = m[j].map((v, k) => v - f * m[r][k]);
        }
      }
      lead++;
    }
    return math.matrix(m);
  },

  // null(A) — null space (simplified: returns zero vector for full rank)
  nullspace: function(A: any) {
    // Simplified: for educational purposes
    return math.zeros(math.size(A).valueOf()[1], 1);
  },

  // triu(A) — upper triangular
  triu: function(A: any) {
    const arr = math.matrix(A).toArray() as number[][];
    const rows = arr.length, cols = arr[0].length;
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < Math.min(i, cols); j++)
        arr[i][j] = 0;
    return math.matrix(arr);
  },

  // tril(A) — lower triangular
  tril: function(A: any) {
    const arr = math.matrix(A).toArray() as number[][];
    const rows = arr.length, cols = arr[0].length;
    for (let i = 0; i < rows; i++)
      for (let j = i + 1; j < cols; j++)
        arr[i][j] = 0;
    return math.matrix(arr);
  },

  // polyval(p, x) — evaluate polynomial
  polyval: function(p: any, x: number) {
    const coeffs = (p.toArray ? p.toArray() : p) as number[];
    let result = 0;
    for (let i = 0; i < coeffs.length; i++) {
      result = result * x + coeffs[i];
    }
    return result;
  },

  // length(v) — MATLAB length (max dimension)
  length: function(v: any) {
    const s = math.size(v).valueOf() as number[];
    return Math.max(...s);
  },

  // num2str / format helpers
  num2str: function(n: number) { return String(n); },

  // colon(a,b) or colon(a,step,b) — MATLAB a:b or a:step:b
  colon: function(a: number, b: number, c?: number) {
    if (c !== undefined) return math.range(a, c, b, true); // a:b:c in MATLAB = start:step:end
    return math.range(a, b, true);
  },
}, { override: true });

// ═══════════════════════════════════════════════════════
// FEM SHAPE FUNCTIONS, DERIVATIVES, JACOBIAN, B MATRIX
// ═══════════════════════════════════════════════════════
math.import({
  // ─── Shape functions: N_XX(xi, eta) → vector of shape function values ───

  // T3: Linear triangle (3 nodes)
  N_T3: function(xi: number, eta: number) {
    return math.matrix([1 - xi - eta, xi, eta]);
  },
  dN_T3: function(_xi: number, _eta: number) {
    // Returns 2×3 matrix: [dN/dxi; dN/deta]
    return math.matrix([[-1, 1, 0], [-1, 0, 1]]);
  },

  // T6: Quadratic triangle (6 nodes)
  N_T6: function(xi: number, eta: number) {
    const L1 = 1 - xi - eta, L2 = xi, L3 = eta;
    return math.matrix([
      L1*(2*L1-1), L2*(2*L2-1), L3*(2*L3-1),
      4*L1*L2, 4*L2*L3, 4*L3*L1
    ]);
  },
  dN_T6: function(xi: number, eta: number) {
    const L1 = 1 - xi - eta, L2 = xi, L3 = eta;
    return math.matrix([
      [4*xi+4*eta-3, 4*xi-1, 0, 4-8*xi-4*eta, 4*eta, -4*eta],
      [4*xi+4*eta-3, 0, 4*eta-1, -4*xi, 4*xi, 4-4*xi-8*eta]
    ]);
  },

  // Q4: Bilinear quadrilateral (4 nodes)
  N_Q4: function(xi: number, eta: number) {
    return math.matrix([
      0.25*(1-xi)*(1-eta), 0.25*(1+xi)*(1-eta),
      0.25*(1+xi)*(1+eta), 0.25*(1-xi)*(1+eta)
    ]);
  },
  dN_Q4: function(xi: number, eta: number) {
    // 2×4: [dN/dxi; dN/deta]
    return math.matrix([
      [-0.25*(1-eta), 0.25*(1-eta), 0.25*(1+eta), -0.25*(1+eta)],
      [-0.25*(1-xi), -0.25*(1+xi), 0.25*(1+xi), 0.25*(1-xi)]
    ]);
  },

  // Q8: Serendipity quadrilateral (8 nodes)
  N_Q8: function(xi: number, eta: number) {
    return math.matrix([
      0.25*(1-xi)*(1-eta)*(-xi-eta-1),
      0.25*(1+xi)*(1-eta)*(xi-eta-1),
      0.25*(1+xi)*(1+eta)*(xi+eta-1),
      0.25*(1-xi)*(1+eta)*(-xi+eta-1),
      0.5*(1-xi*xi)*(1-eta),
      0.5*(1+xi)*(1-eta*eta),
      0.5*(1-xi*xi)*(1+eta),
      0.5*(1-xi)*(1-eta*eta)
    ]);
  },
  dN_Q8: function(xi: number, eta: number) {
    return math.matrix([
      [ // dN/dxi
        0.25*(1-eta)*(2*xi+eta), 0.25*(1-eta)*(2*xi-eta),
        0.25*(1+eta)*(2*xi+eta), 0.25*(1+eta)*(2*xi-eta),
        -xi*(1-eta), 0.5*(1-eta*eta),
        -xi*(1+eta), -0.5*(1-eta*eta)
      ],
      [ // dN/deta
        0.25*(1-xi)*(xi+2*eta), -0.25*(1+xi)*(-xi+2*eta),
        0.25*(1+xi)*(xi+2*eta), 0.25*(1-xi)*(-xi+2*eta),
        -0.5*(1-xi*xi), -eta*(1+xi),
        0.5*(1-xi*xi), -eta*(1-xi)
      ]
    ]);
  },

  // Q9: Lagrangian quadrilateral (9 nodes)
  N_Q9: function(xi: number, eta: number) {
    const x = [xi*(xi-1)/2, 1-xi*xi, xi*(xi+1)/2];
    const e = [eta*(eta-1)/2, 1-eta*eta, eta*(eta+1)/2];
    return math.matrix([
      x[0]*e[0], x[2]*e[0], x[2]*e[2], x[0]*e[2],
      x[1]*e[0], x[2]*e[1], x[1]*e[2], x[0]*e[1], x[1]*e[1]
    ]);
  },

  // ─── Jacobian: J = dN * nodeCoords ───
  // nodeCoords: n×2 matrix of [x,y] for each node
  // dN: 2×n matrix from dN_XX functions
  jacobian2d: function(dN: any, nodeCoords: any) {
    // J = dN * nodeCoords → 2×2
    return math.multiply(dN, nodeCoords);
  },

  // ─── B matrix for plane stress/strain (2D) ───
  // Returns 3×(2n) strain-displacement matrix
  B_plane: function(dN: any, nodeCoords: any) {
    const J = math.multiply(dN, nodeCoords) as any;
    const Jinv = math.inv(J);
    const dNxy = math.multiply(Jinv, dN) as any; // 2×n: [dN/dx; dN/dy]
    const dNarr = (dNxy.toArray ? dNxy.toArray() : dNxy) as number[][];
    const n = dNarr[0].length;
    const B: number[][] = [[], [], []];
    for (let i = 0; i < n; i++) {
      // Row 0: dNi/dx, 0
      B[0].push(dNarr[0][i]); B[0].push(0);
      // Row 1: 0, dNi/dy
      B[1].push(0); B[1].push(dNarr[1][i]);
      // Row 2: dNi/dy, dNi/dx
      B[2].push(dNarr[1][i]); B[2].push(dNarr[0][i]);
    }
    return math.matrix(B);
  },

  // ─── B matrix for plate bending (Mindlin) ───
  // 3 DOF/node: w, theta_x, theta_y
  B_bending: function(dN: any, nodeCoords: any) {
    const J = math.multiply(dN, nodeCoords) as any;
    const Jinv = math.inv(J);
    const dNxy = math.multiply(Jinv, dN) as any;
    const dNarr = (dNxy.toArray ? dNxy.toArray() : dNxy) as number[][];
    const n = dNarr[0].length;
    const Bb: number[][] = [[], [], []];
    for (let i = 0; i < n; i++) {
      // [0, dNi/dx, 0]
      Bb[0].push(0); Bb[0].push(dNarr[0][i]); Bb[0].push(0);
      // [0, 0, dNi/dy]
      Bb[1].push(0); Bb[1].push(0); Bb[1].push(dNarr[1][i]);
      // [0, dNi/dy, dNi/dx]
      Bb[2].push(0); Bb[2].push(dNarr[1][i]); Bb[2].push(dNarr[0][i]);
    }
    return math.matrix(Bb);
  },

  // ─── B matrix shear (Mindlin plate) ───
  B_shear: function(dN: any, N: any, nodeCoords: any) {
    const J = math.multiply(dN, nodeCoords) as any;
    const Jinv = math.inv(J);
    const dNxy = math.multiply(Jinv, dN) as any;
    const dNarr = (dNxy.toArray ? dNxy.toArray() : dNxy) as number[][];
    const Narr = (N.toArray ? N.toArray() : N) as number[];
    const n = Narr.length;
    const Bs: number[][] = [[], []];
    for (let i = 0; i < n; i++) {
      // [dNi/dx, Ni, 0]
      Bs[0].push(dNarr[0][i]); Bs[0].push(Narr[i]); Bs[0].push(0);
      // [dNi/dy, 0, Ni]
      Bs[1].push(dNarr[1][i]); Bs[1].push(0); Bs[1].push(Narr[i]);
    }
    return math.matrix(Bs);
  },

  // ─── Gauss quadrature points and weights ───
  gauss1d: function(n: number) {
    const pts: Record<number, number[][]> = {
      1: [[0, 2]],
      2: [[-0.577350269189626, 1], [0.577350269189626, 1]],
      3: [[-0.774596669241483, 0.555555555555556], [0, 0.888888888888889], [0.774596669241483, 0.555555555555556]],
      4: [[-0.861136311594953, 0.347854845137454], [-0.339981043584856, 0.652145154862546], [0.339981043584856, 0.652145154862546], [0.861136311594953, 0.347854845137454]],
    };
    const p = pts[n] || pts[2];
    return math.matrix(p);
  },

  gauss2d: function(n: number) {
    // n×n Gauss points for quad elements
    // Returns matrix [xi, eta, weight] per row
    const g1 = (n === 1) ? [[0, 2]] :
               (n === 2) ? [[-0.577350269189626, 1], [0.577350269189626, 1]] :
               [[-0.774596669241483, 0.555555555555556], [0, 0.888888888888889], [0.774596669241483, 0.555555555555556]];
    const pts: number[][] = [];
    for (const [xi, wi] of g1) {
      for (const [eta, wj] of g1) {
        pts.push([xi, eta, wi * wj]);
      }
    }
    return math.matrix(pts);
  },

  gauss_tri: function(n: number) {
    // Gauss points for triangular elements
    if (n === 1) return math.matrix([[1/3, 1/3, 0.5]]);
    if (n === 3) return math.matrix([
      [1/6, 1/6, 1/6], [2/3, 1/6, 1/6], [1/6, 2/3, 1/6]
    ]);
    // 4 points
    return math.matrix([
      [1/3, 1/3, -27/96], [0.6, 0.2, 25/96],
      [0.2, 0.6, 25/96], [0.2, 0.2, 25/96]
    ]);
  },

  // ─── Constitutive matrices ───
  // Plane stress: D = E/(1-nu²) * [1 nu 0; nu 1 0; 0 0 (1-nu)/2]
  D_planestress: function(E: number, nu: number) {
    const c = E / (1 - nu * nu);
    return math.matrix([
      [c, c*nu, 0],
      [c*nu, c, 0],
      [0, 0, c*(1-nu)/2]
    ]);
  },

  // Plane strain: D = E/((1+nu)(1-2nu)) * [1-nu nu 0; nu 1-nu 0; 0 0 (1-2nu)/2]
  D_planestrain: function(E: number, nu: number) {
    const c = E / ((1+nu) * (1-2*nu));
    return math.matrix([
      [c*(1-nu), c*nu, 0],
      [c*nu, c*(1-nu), 0],
      [0, 0, c*(1-2*nu)/2]
    ]);
  },

  // Mindlin bending: Db = Eh³/12 * D_planestress / E
  D_bending: function(E: number, nu: number, h: number) {
    const c = E * h*h*h / (12 * (1 - nu*nu));
    return math.matrix([
      [c, c*nu, 0],
      [c*nu, c, 0],
      [0, 0, c*(1-nu)/2]
    ]);
  },

  // Mindlin shear: Ds = kappa * G * h * I2
  D_shear: function(E: number, nu: number, h: number, kapa?: number) {
    const k = kapa || 5/6;
    const G = E / (2 * (1 + nu));
    const c = k * G * h;
    return math.matrix([[c, 0], [0, c]]);
  },

  // ─── Numerical differentiation ───
  // diff_num(f, x, h) — central difference df/dx
  diff_num: function(f: any, x: number, h?: number) {
    const dx = h || 1e-8;
    if (typeof f === "function") {
      return (f(x + dx) - f(x - dx)) / (2 * dx);
    }
    throw new Error("diff_num: primer argumento debe ser una función");
  },

  // ─── Numerical integration (1D) ───
  // integrate(expr, a, b, n) — numerical Gauss quadrature
  // expr can be: string 'x^2' (variable x), function, or constant number
  // Also: integrate(expr, var, a, b) — symbolic string with named variable
  integrate: function(f: any, a: any, b?: any, n?: any) {
    // If string with 4 args: integrate('x^2', 'x', 0, 1) → symbolic defint
    if (typeof f === "string" && typeof a === "string" && typeof b === "number") {
      try {
        const result = nerdamer.defint(f, b, n, a);
        const num = parseFloat(result.text("decimals"));
        return isNaN(num) ? result.toString() : num;
      } catch { /* fall through to numeric */ }
    }

    // Numeric integration
    const lo = typeof a === "number" ? a : 0;
    const hi = typeof b === "number" ? b : 1;
    const npts = (typeof n === "number") ? n : 4;

    const pts: Record<number, number[][]> = {
      1: [[0, 2]], 2: [[-0.5773502691896258, 1], [0.5773502691896258, 1]],
      3: [[-0.7745966692414834, 0.5555555555555556], [0, 0.8888888888888888], [0.7745966692414834, 0.5555555555555556]],
      4: [[-0.8611363115940526, 0.3478548451374538], [-0.3399810435848563, 0.6521451548625461], [0.3399810435848563, 0.6521451548625461], [0.8611363115940526, 0.3478548451374538]],
    };
    const gp = pts[npts] || pts[4];
    const half = (hi - lo) / 2;
    const mid = (lo + hi) / 2;
    let sum = 0;

    if (typeof f === "function") {
      for (const [xi, w] of gp) sum += w * f(mid + half * xi);
    } else if (typeof f === "string") {
      // Evaluate string expression with x as variable
      for (const [xi, w] of gp) {
        try {
          const val = parseFloat(nerdamer(f, { x: String(mid + half * xi) }).text("decimals"));
          sum += w * val;
        } catch { sum += 0; }
      }
    } else if (typeof f === "number") {
      // Constant
      return f * (hi - lo);
    }
    return sum * half;
  },

}, { override: true });

// ═══════════════════════════════════════════════════════
// SYMBOLIC MATH (nerdamer) — diff, integrate, expand, factor, solve, simplify
// ═══════════════════════════════════════════════════════
math.import({
  // syms('x y z') — declare symbolic variables (returns string confirmation)
  syms: function(...names: string[]) {
    // nerdamer auto-creates symbols, just return confirmation
    return `Variables simbólicas: ${names.join(", ")}`;
  },

  // sym(expr) — create symbolic expression, returns LaTeX string
  sym: function(expr: string) {
    try {
      const result = nerdamer(expr);
      return result.toTeX();
    } catch (e: any) {
      return `Error simbólico: ${e.message}`;
    }
  },

  // sdiff(expr, var) — symbolic differentiation
  // sdiff('x^3 + 3*x*y', 'x') → '3*x^2 + 3*y'
  sdiff: function(expr: string, variable: string) {
    try {
      const result = nerdamer.diff(expr, variable);
      return result.toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // sdiff2(expr, var) — second derivative
  sdiff2: function(expr: string, variable: string) {
    try {
      const r1 = nerdamer.diff(expr, variable);
      const r2 = nerdamer.diff(r1.toString(), variable);
      return r2.toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // sint(expr, var) — symbolic integration
  // sint('x^2', 'x') → '(1/3)*x^3'
  sint: function(expr: string, variable: string) {
    try {
      const result = nerdamer.integrate(expr, variable);
      return result.toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // sdefint(expr, var, a, b) — definite integral
  sdefint: function(expr: string, variable: string, a: number, b: number) {
    try {
      const result = nerdamer.defint(expr, a, b, variable);
      return result.toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // sexpand(expr) — expand expression
  sexpand: function(expr: string) {
    try {
      return nerdamer.expand(expr).toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // sfactor(expr) — factor expression
  sfactor: function(expr: string) {
    try {
      return nerdamer.factor(expr).toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // ssolve(expr, var) — solve equation for variable
  // ssolve('x^2 - 4', 'x') → '[2, -2]'
  ssolve: function(expr: string, variable: string) {
    try {
      const result = nerdamer.solveEquations(expr, variable);
      return result.toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // ssimplify(expr) — simplify expression
  ssimplify: function(expr: string) {
    try {
      return nerdamer(expr).toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // ssubs(expr, var, val) — substitute value into expression
  // ssubs('x^2 + y', 'x', '3') → '9 + y'
  ssubs: function(expr: string, variable: string, value: string | number) {
    try {
      const result = nerdamer(expr, { [variable]: String(value) });
      return result.toString();
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // seval(expr) — evaluate symbolic expression to number
  seval: function(expr: string) {
    try {
      return nerdamer(expr).evaluate().text("decimals");
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  },

  // stex(expr) — convert expression to LaTeX
  stex: function(expr: string) {
    try {
      return nerdamer(expr).toTeX();
    } catch (e: any) {
      return expr;
    }
  },

}, { override: true });

// ═══════════════════════════════════════════════════════
// FEM HELPER FUNCTIONS (injected into math scope)
// ═══════════════════════════════════════════════════════

// Store model data for solve_model() to use
let _currentModelData: ModelData | null = null;

// Store solve results for unode/rnode access
let _solveResult: any = null;

/** Build FEM helper functions that use the current model data from scope */
function buildFemHelpers(scope: Record<string, any>) {
  // stiffness(i) — returns K_local 12x12 for element i (1-based)
  scope.stiffness = (i: number) => {
    const idx = i - 1; // 1-based → 0-based
    const nodes = getNodesFromScope(scope);
    const elements = getElementsFromScope(scope);
    const ei = getElementInputsFromScope(scope);
    if (!nodes || !elements || idx < 0 || idx >= elements.length) {
      throw new Error(`stiffness(${i}): elemento no existe`);
    }
    const el = elements[idx];
    const elNodes: Node[] = el.map((n: number) => nodes[n]);
    const K = getLocalStiffnessMatrix(elNodes, ei, idx);
    return math.matrix(K);
  };

  // transform(i) — returns T 12x12 for element i (1-based)
  scope.transform = (i: number) => {
    const idx = i - 1;
    const nodes = getNodesFromScope(scope);
    const elements = getElementsFromScope(scope);
    if (!nodes || !elements || idx < 0 || idx >= elements.length) {
      throw new Error(`transform(${i}): elemento no existe`);
    }
    const el = elements[idx];
    const elNodes: Node[] = el.map((n: number) => nodes[n]);
    const T = getTransformationMatrix(elNodes);
    return math.matrix(T);
  };

  // kglobal(i) — returns T' * K_local * T for element i
  scope.kglobal = (i: number) => {
    const K = scope.stiffness(i);
    const T = scope.transform(i);
    return math.multiply(math.transpose(T), math.multiply(K, T));
  };

  // assemble_dofs(i) — returns global DOF indices for element i
  scope.assemble_dofs = (i: number) => {
    const idx = i - 1;
    const elements = getElementsFromScope(scope);
    if (!elements || idx < 0 || idx >= elements.length) {
      throw new Error(`assemble_dofs(${i}): elemento no existe`);
    }
    const el = elements[idx];
    const dofs: number[] = [];
    for (const n of el) {
      for (let d = 0; d < 6; d++) dofs.push(n * 6 + d + 1); // 1-based
    }
    return math.matrix(dofs);
  };

  // elem_length(i) — returns length of element i
  scope.elem_length = (i: number) => {
    const idx = i - 1;
    const nodes = getNodesFromScope(scope);
    const elements = getElementsFromScope(scope);
    if (!nodes || !elements || idx < 0 || idx >= elements.length) {
      throw new Error(`elem_length(${i}): elemento no existe`);
    }
    const el = elements[idx];
    const n0 = nodes[el[0]], n1 = nodes[el[1]];
    return Math.sqrt((n1[0]-n0[0])**2 + (n1[1]-n0[1])**2 + (n1[2]-n0[2])**2);
  };

  // ═══════════════════════════════════════════════
  // solve_model() — WASM solver, returns all results to scope
  // ═══════════════════════════════════════════════
  scope.solve_model = () => {
    if (!_currentModelData) throw new Error("solve_model: no hay modelo cargado");
    const md = _currentModelData;
    try {
      // Ensure all Maps exist (WASM crashes on undefined)
      const ei = md.elementInputs;
      if (!ei.elasticities) ei.elasticities = new Map();
      if (!ei.areas) ei.areas = new Map();
      if (!ei.momentsOfInertiaY) ei.momentsOfInertiaY = new Map();
      if (!ei.momentsOfInertiaZ) ei.momentsOfInertiaZ = new Map();
      if (!ei.shearModuli) ei.shearModuli = new Map();
      if (!ei.torsionalConstants) ei.torsionalConstants = new Map();
      if (!ei.thicknesses) ei.thicknesses = new Map();
      if (!ei.poissonsRatios) ei.poissonsRatios = new Map();
      if (!ei.shearAreasY) ei.shearAreasY = new Map();
      if (!ei.shearAreasZ) ei.shearAreasZ = new Map();
      const ni = md.nodeInputs;
      if (!ni.supports) ni.supports = new Map();
      if (!ni.loads) ni.loads = new Map();
      // Copy forces → loads if needed (compat)
      if ((ni as any).forces && (!ni.loads || ni.loads.size === 0)) {
        ni.loads = (ni as any).forces;
      }
      const result = didacticSolveCpp(
        md.nodes, md.elements, ni, ei
      );
      // Inject results into scope
      scope._solve_result = result;
      scope.U = math.matrix(result.U_full);
      scope.F = math.matrix(result.F_applied);
      scope.R = math.matrix(result.R_full);
      scope.nDOF_total = result.nDOF;
      scope.nDOF_free = result.freeDOFs.length;
      scope.nDOF_fixed = result.fixedDOFs.length;

      // Update global _solveResult so pre-registered unode/rnode can access it
      _solveResult = result;

      // Return summary string
      return `Resuelto: ${result.nDOF} DOFs (${result.freeDOFs.length} libres, ${result.fixedDOFs.length} fijos), max|U| = ${Math.max(...result.U_full.map(Math.abs)).toExponential(4)}`;
    } catch (err: any) {
      throw new Error(`solve_model: ${err.message}`);
    }
  };

  // K_element(i) — returns K_global from WASM result (after solve_model)
  scope.K_element = (i: number) => {
    const r = scope._solve_result;
    if (!r) throw new Error("K_element: primero ejecuta solve_model()");
    const idx = i - 1;
    if (idx < 0 || idx >= r.elements.length) throw new Error(`K_element(${i}): no existe`);
    return math.matrix(r.elements[idx].K_global);
  };

  // unode(n) — desplazamientos del nodo n (1-based) → vector 6×1
  scope.unode = (n: number) => {
    if (!_solveResult) throw new Error("unode: primero ejecuta solve_model()");
    const idx = (n - 1) * 6;
    return math.matrix(_solveResult.U_full.slice(idx, idx + 6));
  };

  // rnode(n) — reacciones del nodo n (1-based) → vector 6×1
  scope.rnode = (n: number) => {
    if (!_solveResult) throw new Error("rnode: primero ejecuta solve_model()");
    const idx = (n - 1) * 6;
    return math.matrix(_solveResult.R_full.slice(idx, idx + 6));
  };
}

/** Extract nodes array from scope (handles math.js Matrix or plain array) */
function getNodesFromScope(scope: Record<string, any>): number[][] | null {
  const n = scope.nodes;
  if (!n) return null;
  const arr = typeof n.toArray === "function" ? n.toArray() : n;
  if (!Array.isArray(arr)) return null;
  return arr;
}

/** Extract elements connectivity from scope */
function getElementsFromScope(scope: Record<string, any>): number[][] | null {
  const e = scope.elem || scope.elements;
  if (!e) return null;
  const arr = typeof e.toArray === "function" ? e.toArray() : e;
  if (!Array.isArray(arr)) return null;
  return arr;
}

/** Build ElementInputs from scope variables */
function getElementInputsFromScope(scope: Record<string, any>): ElementInputs {
  const nelem = scope.nelem || 0;
  const ei: ElementInputs = {};

  // Get elements to know which are frames (2-node) vs shells
  const elements = getElementsFromScope(scope);
  const frameIndices: number[] = [];
  if (elements) {
    elements.forEach((el, i) => { if (el.length === 2) frameIndices.push(i); });
  }

  const mapProp = (name: string, isFrameProp: boolean): Map<number, number> | undefined => {
    const val = scope[name];
    if (val === undefined || val === null) return undefined;
    const m = new Map<number, number>();
    if (typeof val === "number") {
      // Scalar → broadcast to all elements (or only frames if frame prop)
      const indices = isFrameProp ? frameIndices : Array.from({length: nelem}, (_, i) => i);
      for (const i of indices) m.set(i, val);
    } else {
      const arr = typeof val.toArray === "function" ? val.toArray() : val;
      if (Array.isArray(arr)) {
        const flat = arr.flat();
        // Array values map to frame indices (for frame props) or all elements
        const indices = isFrameProp ? frameIndices : Array.from({length: nelem}, (_, i) => i);
        for (let j = 0; j < flat.length && j < indices.length; j++) {
          m.set(indices[j], flat[j]);
        }
      }
    }
    return m.size > 0 ? m : undefined;
  };

  ei.elasticities = mapProp("E", true);  // E applies to frames; shells use E_shell
  ei.areas = mapProp("A", true);
  ei.momentsOfInertiaY = mapProp("Iz", true);
  ei.momentsOfInertiaZ = mapProp("Iy", true);
  ei.shearModuli = mapProp("G", true);
  ei.torsionalConstants = mapProp("J", true);
  ei.thicknesses = mapProp("t", false);   // shell property
  ei.poissonsRatios = mapProp("nu", false); // shell property

  // Also check shell-specific E
  const eShell = mapProp("E_shell", false);
  if (eShell) {
    if (!ei.elasticities) ei.elasticities = new Map();
    eShell.forEach((v, k) => ei.elasticities!.set(k, v));
  }

  return ei;
}

export interface CalcLine {
  lineNum: number;
  input: string;       // raw input line
  varName?: string;     // variable name if assignment
  expression?: string;  // expression text (without var = )
  result?: any;    // evaluated result
  resultType?: "scalar" | "vector" | "matrix" | "string" | "boolean" | "other";
  error?: string;       // error message if failed
  isComment?: boolean;
  isBlank?: boolean;
  isControl?: boolean;  // for/if/while/end
}

export interface CalcResult {
  lines: CalcLine[];
  scope: Record<string, any>;
  errors: string[];
}

/**
 * Evaluate a multi-line MATLAB-style script.
 * Returns per-line results for rendering.
 */
export function evaluate(code: string, initialScope?: Record<string, any>, modelData?: ModelData): CalcResult {
  _currentModelData = modelData || null;
  const scope: Record<string, any> = { ...initialScope };
  // Inject FEM helper functions into scope
  buildFemHelpers(scope);
  // Load saved library functions (persistent across sessions)
  loadLibraryFunctions(scope);
  const rawLines = code.split("\n");
  const lines: CalcLine[] = [];
  const errors: string[] = [];

  // Pre-process: collect for/if/while blocks
  const processed = preprocessBlocks(rawLines);

  let i = 0;
  while (i < processed.length) {
    const { line, originalLineNum, blockLines } = processed[i];
    const trimmed = line.trim();

    // Blank line
    if (trimmed === "") {
      lines.push({ lineNum: originalLineNum, input: line, isBlank: true });
      i++;
      continue;
    }

    // Comment
    if (trimmed.startsWith("%")) {
      lines.push({ lineNum: originalLineNum, input: line, isComment: true });
      i++;
      continue;
    }

    // Inline comment — strip after %
    const commentIdx = findCommentIndex(trimmed);
    const cleanLine = commentIdx >= 0 ? trimmed.substring(0, commentIdx).trim() : trimmed;

    if (cleanLine === "") {
      lines.push({ lineNum: originalLineNum, input: line, isBlank: true });
      i++;
      continue;
    }

    // for block
    if (blockLines && trimmed.match(/^for\s+/i)) {
      const result = evaluateForBlock(cleanLine, blockLines, scope);
      lines.push({
        lineNum: originalLineNum,
        input: line,
        isControl: true,
        result: result.lastValue,
        resultType: getResultType(result.lastValue),
        error: result.error,
      });
      // Add sub-lines for the last iteration (for display)
      if (result.iterationLines) {
        for (const sl of result.iterationLines) {
          lines.push(sl);
        }
      }
      i++;
      continue;
    }

    // if block
    if (blockLines && trimmed.match(/^if\s+/i)) {
      const result = evaluateIfBlock(cleanLine, blockLines, scope);
      lines.push({
        lineNum: originalLineNum,
        input: line,
        isControl: true,
        result: result.value,
        resultType: getResultType(result.value),
        error: result.error,
      });
      i++;
      continue;
    }

    // function block: function [out] = name(args) ... end
    // or: function name(args) ... end
    if (blockLines && trimmed.match(/^function\s+/i)) {
      try {
        const fnResult = registerMatlabFunction(cleanLine, blockLines, scope);
        lines.push({
          lineNum: originalLineNum,
          input: line,
          isControl: true,
          result: `function ${fnResult.name}(${fnResult.args.join(", ")}) definida`,
          resultType: "string",
        });
      } catch (err: any) {
        lines.push({
          lineNum: originalLineNum,
          input: line,
          isControl: true,
          error: err.message,
        });
      }
      i++;
      continue;
    }

    // Regular expression line
    const cl = evaluateLine(cleanLine, scope, originalLineNum);
    lines.push(cl);
    if (cl.error) errors.push(`Line ${originalLineNum}: ${cl.error}`);
    i++;
  }

  return { lines, scope, errors };
}

// ═══════════════════════════════════════════════════════
// LINE EVALUATION
// ═══════════════════════════════════════════════════════

function evaluateLine(line: string, scope: Record<string, any>, lineNum: number): CalcLine {
  try {
    // Pre-process MATLAB syntax → math.js syntax
    const converted = matlabToMathjs(line);

    // Check if it's an assignment: varName = expression
    const assignMatch = converted.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);

    let result: any;
    let varName: string | undefined;
    let expression: string | undefined;

    if (assignMatch && !converted.match(/^(if|for|while|end)\b/)) {
      varName = assignMatch[1];
      expression = assignMatch[2];
      result = math.evaluate(converted, scope);
      // math.evaluate with scope auto-assigns the variable
    } else {
      expression = converted;
      result = math.evaluate(converted, scope);
    }

    return {
      lineNum,
      input: line,
      varName,
      expression,
      result,
      resultType: getResultType(result),
    };
  } catch (err: any) {
    return {
      lineNum,
      input: line,
      error: err.message || String(err),
    };
  }
}

// ═══════════════════════════════════════════════════════
// MATLAB → MATH.JS SYNTAX CONVERSION
// ═══════════════════════════════════════════════════════

function matlabToMathjs(line: string): string {
  let s = line.trim();

  // Strip trailing semicolon (MATLAB suppress output — we always show)
  if (s.endsWith(";")) s = s.slice(0, -1).trim();

  // Convert MATLAB single-quoted strings to double quotes for math.js
  // 'x^2 + y' → "x^2 + y"
  s = s.replace(/'([^']*?)'/g, '"$1"');

  // Backslash solve: A \ b → lusolve(A, b)
  // Must handle: u = K \ F
  const backslashMatch = s.match(/^(\w+)\s*=\s*(\w+)\s*\\\s*(.+)$/);
  if (backslashMatch) {
    s = `${backslashMatch[1]} = lusolve(${backslashMatch[2]}, ${backslashMatch[3]})`;
  } else {
    // Expression-only backslash: K \ F
    const exprBackslash = s.match(/^(\w+)\s*\\\s*(.+)$/);
    if (exprBackslash && !s.includes("=")) {
      s = `lusolve(${exprBackslash[1]}, ${exprBackslash[2]})`;
    }
  }

  // Transpose: A' → transpose(A) (but not inside strings)
  // Handle: K' and K_local'
  s = s.replace(/(\w+)'/g, "transpose($1)");

  // MATLAB 1-based indexing: A(i,j) → subset(A, index(i, j))
  // But NOT function calls — build set dynamically from all math.js registered functions
  const knownFunctions = new Set([
    // Core math.js
    "inv", "det", "transpose", "norm", "zeros", "ones", "eye",
    "lusolve", "lup", "sqrt", "abs", "sin", "cos", "tan", "asin", "acos", "atan", "atan2",
    "exp", "log", "log2", "log10", "ceil", "floor", "round", "mod", "sign", "pow",
    "max", "min", "sum", "prod", "size", "length", "mean", "median", "std", "variance",
    "diag", "trace", "cross", "dot", "kron", "reshape", "flatten", "squeeze",
    "eigs", "svd", "rank", "subset", "index", "range",
    "matrix", "number", "print", "format", "string", "boolean", "complex",
    "real", "im", "conj", "arg",
    "sinh", "cosh", "tanh", "sec", "csc", "cot",
    "factorial", "gamma", "combinations", "permutations",
    "gcd", "lcm", "nthRoot", "cbrt",
    "random", "randomInt", "pickRandom",
    "sort", "map", "filter", "forEach", "concat", "column", "row",
    "sparse", "identity", "typeOf", "isInteger", "isPositive", "isNegative",
    // FEM helpers
    "stiffness", "transform", "kglobal", "assemble_dofs", "elem_length",
    "solve_model", "unode", "rnode",
    // Symbolic (nerdamer)
    "syms", "sym", "sdiff", "sdiff2", "sint", "sdefint",
    "sexpand", "sfactor", "ssolve", "ssimplify", "ssubs", "seval", "stex",
    // FEM shape functions
    "N_bar2", "dN_bar2", "N_T3", "dN_T3", "N_Q4", "dN_Q4",
    "N_Q8", "dN_Q8", "N_T6", "dN_T6",
    "jacobian2d", "B_plane", "D_planestress", "D_planestrain", "D_plate",
    "gauss1d", "gauss2d",
    "beam_stiffness_2d", "beam_stiffness_3d",
    // Numerical calculus
    "integrate", "diff_num",
    // Linspace, colon
    "linspace", "colon",
  ]);

  // Match: varName(args) where varName is NOT a known function
  s = s.replace(/\b([a-zA-Z_]\w*)\(([^)]+)\)/g, (match, name, args) => {
    if (knownFunctions.has(name)) return match;
    // Check if variable exists in scope context — assume it's indexing
    // Convert 1-based to 0-based: A(1,2) → subset(A, index(0,1))
    const indices = args.split(",").map((a: string) => {
      const trimmed = a.trim();
      // If it's a number, subtract 1 for 0-based
      const num = Number(trimmed);
      if (!isNaN(num) && trimmed !== "") return String(num - 1);
      // If it's a variable, subtract 1 at runtime
      return `${trimmed} - 1`;
    });
    return `subset(${name}, index(${indices.join(", ")}))`;
  });

  return s;
}

// ═══════════════════════════════════════════════════════
// CONTROL FLOW: for/if/while blocks
// ═══════════════════════════════════════════════════════

interface ProcessedLine {
  line: string;
  originalLineNum: number;
  blockLines?: string[]; // inner lines for control blocks
}

function preprocessBlocks(rawLines: string[]): ProcessedLine[] {
  // Phase 1: Join multi-line brackets [ ... ] into single lines
  const joinedLines: { line: string; startLine: number }[] = [];
  let i = 0;
  while (i < rawLines.length) {
    const trimmed = rawLines[i].trim();
    // Count unmatched brackets
    const opens = (trimmed.match(/\[/g) || []).length;
    const closes = (trimmed.match(/\]/g) || []).length;
    if (opens > closes) {
      // Multi-line matrix/vector — join until brackets balance
      let combined = trimmed;
      const startLine = i;
      let depth = opens - closes;
      i++;
      while (i < rawLines.length && depth > 0) {
        const next = rawLines[i].trim();
        combined += " " + next;
        depth += (next.match(/\[/g) || []).length;
        depth -= (next.match(/\]/g) || []).length;
        i++;
      }
      joinedLines.push({ line: combined, startLine: startLine });
    } else {
      joinedLines.push({ line: rawLines[i], startLine: i });
      i++;
    }
  }

  // Phase 2: Process for/if/while blocks
  const result: ProcessedLine[] = [];
  i = 0;

  while (i < joinedLines.length) {
    const trimmed = joinedLines[i].line.trim();
    const origLine = joinedLines[i].startLine + 1;

    // Detect block start: for, if, while
    if (trimmed.match(/^(for|if|while)\s+/i)) {
      const blockStart = i;
      const blockLines: string[] = [];
      let depth = 1;
      i++;

      while (i < joinedLines.length && depth > 0) {
        const inner = joinedLines[i].line.trim();
        if (inner.match(/^(for|if|while)\s+/i)) depth++;
        if (inner === "end") depth--;
        if (depth > 0) blockLines.push(joinedLines[i].line);
        i++;
      }

      result.push({
        line: joinedLines[blockStart].line,
        originalLineNum: origLine,
        blockLines,
      });
    } else {
      result.push({
        line: joinedLines[i].line,
        originalLineNum: origLine,
      });
      i++;
    }
  }

  return result;
}

function evaluateForBlock(
  header: string, bodyLines: string[], scope: Record<string, any>
): { lastValue?: any; error?: string; iterationLines?: CalcLine[] } {
  // Parse: for i = start:end  or  for i = start:step:end
  const match = header.match(/^for\s+(\w+)\s*=\s*(\d+):(\d+)(?::(\d+))?$/i)
    || header.match(/^for\s+(\w+)\s*=\s*(.+):(.+)$/i);

  if (!match) return { error: "Invalid for syntax. Use: for i = 1:n" };

  const varName = match[1];
  const start = Number(math.evaluate(match[2], scope));
  const end_ = Number(math.evaluate(match[3], scope));
  const step = match[4] ? Number(math.evaluate(match[4], scope)) : 1;

  let lastValue: any | undefined;
  let iterationLines: CalcLine[] = [];
  const maxIter = 10000;
  let count = 0;

  for (let val = start; val <= end_ && count < maxIter; val += step, count++) {
    scope[varName] = val;
    iterationLines = []; // keep last iteration only

    for (const bodyLine of bodyLines) {
      const trimmed = bodyLine.trim();
      if (trimmed === "" || trimmed.startsWith("%")) continue;

      const commentIdx = findCommentIndex(trimmed);
      const clean = commentIdx >= 0 ? trimmed.substring(0, commentIdx).trim() : trimmed;
      if (clean === "") continue;

      const cl = evaluateLine(clean, scope, 0);
      if (cl.error) return { error: `In for loop: ${cl.error}` };
      lastValue = cl.result;
      iterationLines.push(cl);
    }
  }

  return { lastValue, iterationLines };
}

function evaluateIfBlock(
  header: string, bodyLines: string[], scope: Record<string, any>
): { value?: any; error?: string } {
  // Parse: if condition
  const match = header.match(/^if\s+(.+)$/i);
  if (!match) return { error: "Invalid if syntax" };

  try {
    const condition = math.evaluate(matlabToMathjs(match[1]), scope);
    const isTrue = Boolean(condition);

    // Split bodyLines at "else"
    const elseIdx = bodyLines.findIndex(l => l.trim() === "else");
    const trueBranch = elseIdx >= 0 ? bodyLines.slice(0, elseIdx) : bodyLines;
    const falseBranch = elseIdx >= 0 ? bodyLines.slice(elseIdx + 1) : [];

    const branch = isTrue ? trueBranch : falseBranch;
    let lastValue: any | undefined;

    for (const bodyLine of branch) {
      const trimmed = bodyLine.trim();
      if (trimmed === "" || trimmed.startsWith("%")) continue;
      const cl = evaluateLine(matlabToMathjs(trimmed), scope, 0);
      if (cl.error) return { error: cl.error };
      lastValue = cl.result;
    }

    return { value: lastValue };
  } catch (err: any) {
    return { error: err.message };
  }
}

// ═══════════════════════════════════════════════════════
// MATLAB function DEFINITION: function [out] = name(a, b, ...)
// ═══════════════════════════════════════════════════════

function registerMatlabFunction(
  header: string, bodyLines: string[], parentScope: Record<string, any>
): { name: string; args: string[] } {
  // Parse: function y = name(a, b) or function name(a, b)
  const match = header.match(
    /^function\s+(?:(\w+)\s*=\s*)?(\w+)\s*\(([^)]*)\)/i
  );
  if (!match) throw new Error("Sintaxis: function [out] = nombre(args)");

  const outVar = match[1] || null; // output variable name (optional)
  const fnName = match[2];
  const argNames = match[3].split(",").map(s => s.trim()).filter(Boolean);

  // Create a closure that evaluates the body with the arguments
  const fnBody = bodyLines
    .filter(l => !l.trim().match(/^end$/i))
    .map(l => l.trim())
    .filter(l => l !== "" && !l.startsWith("%"));

  // Register as a math.js function
  const fn = (...args: any[]) => {
    // Create local scope with parent scope + arguments
    const localScope: Record<string, any> = { ...parentScope };
    argNames.forEach((name, i) => { localScope[name] = args[i]; });

    // Evaluate body lines
    let lastResult: any = undefined;
    for (const line of fnBody) {
      try {
        const converted = matlabToMathjs(line);
        lastResult = math.evaluate(converted, localScope);
        // Check for assignment to detect output
        const assignMatch = line.match(/^(\w+)\s*=/);
        if (assignMatch) {
          localScope[assignMatch[1]] = lastResult;
        }
      } catch { /* skip errors in function body */ }
    }

    // Return the output variable if specified, otherwise last result
    if (outVar && localScope[outVar] !== undefined) return localScope[outVar];
    return lastResult;
  };

  // Register in math.js so parser recognizes it as a function
  try {
    math.import({ [fnName]: fn }, { override: true });
  } catch {
    // Fallback: add to parent scope
    parentScope[fnName] = fn;
  }

  // Save to library (localStorage) for persistence across sessions
  saveFunctionToLibrary(fnName, argNames, outVar, fnBody);

  return { name: fnName, args: argNames };
}

// ═══════════════════════════════════════════════════════
// FUNCTION LIBRARY — persistent storage (localStorage)
// ═══════════════════════════════════════════════════════

const LIBRARY_KEY = "hekatan_calc_functions";
/** La clave de antes. Se lee UNA vez para no perder las funciones que el
 *  usuario ya tenia guardadas: renombrar la clave a secas se las borraba. */
const LIBRARY_KEY_VIEJA = "awatif_calc_functions";
(function migrarLibreria() {
  try {
    if (localStorage.getItem(LIBRARY_KEY) !== null) return;   // ya migrada
    const viejo = localStorage.getItem(LIBRARY_KEY_VIEJA);
    if (viejo === null) return;
    localStorage.setItem(LIBRARY_KEY, viejo);
    localStorage.removeItem(LIBRARY_KEY_VIEJA);
    console.log("[calc] libreria de funciones migrada a la clave nueva");
  } catch { /* localStorage no disponible */ }
})();

interface StoredFunction {
  name: string;
  args: string[];
  outVar: string | null;
  body: string[];
}

function saveFunctionToLibrary(name: string, args: string[], outVar: string | null, body: string[]) {
  try {
    const lib = getLibrary();
    lib[name] = { name, args, outVar, body };
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
  } catch { /* localStorage not available */ }
}

export function getLibrary(): Record<string, StoredFunction> {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function deleteFromLibrary(name: string) {
  try {
    const lib = getLibrary();
    delete lib[name];
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
    // Also unregister from math.js
    // (can't truly unregister, but next session won't load it)
  } catch { /* ignore */ }
}

export function getLibraryFunctionCode(name: string): string {
  const lib = getLibrary();
  const fn = lib[name];
  if (!fn) return "";
  const header = fn.outVar
    ? `function ${fn.outVar} = ${fn.name}(${fn.args.join(", ")})`
    : `function ${fn.name}(${fn.args.join(", ")})`;
  return [header, ...fn.body.map(l => "  " + l), "end"].join("\n");
}

function loadLibraryFunctions(scope: Record<string, any>) {
  const lib = getLibrary();
  for (const [name, stored] of Object.entries(lib)) {
    try {
      const fnBody = stored.body;
      const argNames = stored.args;
      const outVar = stored.outVar;

      const fn = (...args: any[]) => {
        const localScope: Record<string, any> = { ...scope };
        argNames.forEach((n, i) => { localScope[n] = args[i]; });
        let lastResult: any = undefined;
        for (const line of fnBody) {
          try {
            const converted = matlabToMathjs(line);
            lastResult = math.evaluate(converted, localScope);
            const assignMatch = line.match(/^(\w+)\s*=/);
            if (assignMatch) localScope[assignMatch[1]] = lastResult;
          } catch { /* skip */ }
        }
        if (outVar && localScope[outVar] !== undefined) return localScope[outVar];
        return lastResult;
      };

      math.import({ [name]: fn }, { override: true });
    } catch { /* skip broken functions */ }
  }
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function getResultType(val: any): CalcLine["resultType"] {
  if (val === undefined || val === null) return "other";
  if (typeof val === "number") return "scalar";
  if (typeof val === "boolean") return "boolean";
  if (typeof val === "string") return "string";

  // math.js Matrix
  if (val && typeof val === "object" && typeof val.size === "function") {
    const sz = val.size();
    if (sz.length === 1 || (sz.length === 2 && (sz[0] === 1 || sz[1] === 1))) {
      return "vector";
    }
    return "matrix";
  }

  // Plain array
  if (Array.isArray(val)) {
    if (val.length > 0 && Array.isArray(val[0])) return "matrix";
    return "vector";
  }

  return "other";
}

/** Find index of comment % (not inside brackets/strings) */
function findCommentIndex(line: string): number {
  let inBracket = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "[") inBracket++;
    if (line[i] === "]") inBracket--;
    if (line[i] === "%" && inBracket === 0) return i;
  }
  return -1;
}

/**
 * Get scope as formatted object (for debugging/display)
 */
export function getScopeVars(scope: Record<string, any>): { name: string; value: any; type: string }[] {
  return Object.entries(scope)
    .filter(([k]) => !k.startsWith("_"))
    .map(([name, value]) => ({
      name,
      value,
      type: getResultType(value) || "other",
    }));
}
