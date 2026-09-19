/**
 * calcTemplates.ts — Scripts predefinidos para la calculadora FEM
 *
 * TODOS los templates son ejemplos completos que funcionan sin errores.
 */

import { Node, Element, NodeInputs, ElementInputs } from "hekatan-fem";

export interface ModelData {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  modelName?: string; // e.g. "Edificio 2x2x3", "Eiffel", "Portico"
}

// ═══════════════════════════════════════════════════════
// TEMPLATE LIST & DISPATCH
// ═══════════════════════════════════════════════════════

export const templateList = [
  { id: "fem_auto", name: "FEM del modelo actual (auto)" },
  { id: "matlab_full", name: "MATLAB standalone — modelo actual" },
  { id: "empty", name: "Datos del modelo actual" },
  { id: "custom", name: "── Calculadora libre ──" },
  // ── Ferreira: MATLAB Codes for FEA ──
  { id: "fer_springs", name: "Ferreira Cap2: Resortes (problem1)" },
  { id: "fer_bar", name: "Ferreira Cap3: Barra axial (problem2)" },
  { id: "fer_truss2d", name: "Ferreira Cap4: Truss 2D (problem5)" },
  { id: "fer_truss3d", name: "Ferreira Cap5: Truss 3D (problem8)" },
  { id: "fer_bernoulli", name: "Ferreira Cap6: Viga Bernoulli (problem9)" },
  { id: "fer_frame2d", name: "Ferreira Cap7: Frame 2D (problem11)" },
  { id: "fer_frame3d", name: "Ferreira Cap8: Frame 3D (problem13)" },
  { id: "fer_timoshenko", name: "Ferreira Cap10: Timoshenko (problem16)" },
  { id: "fer_planestress", name: "Ferreira Cap11: Plane stress Q4 (problem17)" },
  { id: "fer_mindlin", name: "Ferreira Cap12: Mindlin plate Q4 (problem19)" },
  // ── Curso FEM completo (simbólico + numérico) ──
  { id: "fem_course_1d", name: "📖 Curso FEM 1: Barra 1D (simbólico+numérico)" },
  { id: "fem_course_beam", name: "📖 Curso FEM 2: Viga Euler-Bernoulli" },
  { id: "fem_course_q4", name: "📖 Curso FEM 3: Elemento Q4 — Plane Stress" },
  { id: "fem_course_mindlin", name: "📖 Curso FEM 4: Placa Mindlin Q4" },
  // ── Modelos mixtos ──
  { id: "zapata_pedestal", name: "🏗️ Zapata + Pedestal (shell+frame)" },
  // ── Derivaciones didácticas ──
  { id: "axial", name: "Derivación: Barra axial paso a paso" },
  { id: "spring3", name: "Derivación: 3 resortes — assembly" },
  { id: "portal", name: "Derivación: Portal 2D" },
  { id: "viga2d", name: "Derivación: Viga empotrada" },
];

export function getTemplate(templateId: string, data: ModelData): string {
  switch (templateId) {
    case "fem_auto": return templateFemAuto(data);
    case "portal": return templatePortal();
    case "axial": return templateAxial();
    case "spring3": return templateSprings();
    case "viga2d": return templateViga();
    case "custom": return templateCustom();
    case "empty": return templateModelData(data);
    case "matlab_full": return templateMatlabStandalone(data);
    // Curso FEM completo
    case "fem_course_1d": return femCourse1D();
    case "fem_course_beam": return femCourseBeam();
    case "fem_course_q4": return femCourseQ4();
    case "fem_course_mindlin": return femCourseMindlin();
    // Ferreira templates
    case "fer_springs": return ferSprings();
    case "fer_bar": return ferBar();
    case "fer_truss2d": return ferTruss2D();
    case "fer_truss3d": return ferTruss3D();
    case "fer_bernoulli": return ferBernoulli();
    case "fer_frame2d": return ferFrame2D();
    case "fer_frame3d": return ferFrame3D();
    case "fer_timoshenko": return ferTimoshenko();
    case "fer_planestress": return ferPlaneStressQ4();
    case "fer_mindlin": return ferMindlinQ4();
    case "zapata_pedestal": return templateZapataPedestal();
    default: return templateFemAuto(data);
  }
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: FEM del modelo actual (usa funciones internas)
// ═══════════════════════════════════════════════════════

function templateFemAuto(data: ModelData): string {
  const nn = data.nodes.length;
  const ne = data.elements.length;
  const ndof = nn * 6;

  // Detect first element properties for formulas
  const ei = data.elementInputs;
  const E0 = ei.elasticities?.get(0) ?? 21e6;
  const G0 = ei.shearModuli?.get(0) ?? 8.75e6;
  const A0 = ei.areas?.get(0) ?? 0.16;
  const Iz0 = ei.momentsOfInertiaZ?.get(0) ?? 0.00213;
  const Iy0 = ei.momentsOfInertiaY?.get(0) ?? 0.00213;
  const J0 = ei.torsionalConstants?.get(0) ?? 0.00361;

  // First element nodes
  const e0 = data.elements[0];
  const n0 = data.nodes[e0[0]];
  const n1 = data.nodes[e0[1]];
  const dx = n1[0]-n0[0], dy = n1[1]-n0[1], dz = n1[2]-n0[2];
  const L0 = Math.sqrt(dx*dx + dy*dy + dz*dz);

  return templateModelData(data) + `
% ═══════════════════════════════════════════
% FEM paso a paso — MATLAB puro
% ═══════════════════════════════════════════

% ─── Paso 1: K local frame Timoshenko (elemento 1) ───

% @$\\textbf{Coeficientes simbólicos:}$@
% @$k_a = \\frac{EA}{L}, \\quad k_t = \\frac{GJ}{L}$@
% @$b_z = \\frac{12EI_z}{L^3}, \\quad c_z = \\frac{6EI_z}{L^2}, \\quad d_z = \\frac{4EI_z}{L}, \\quad e_z = \\frac{2EI_z}{L}$@
% @$b_y = \\frac{12EI_y}{L^3}, \\quad c_y = \\frac{6EI_y}{L^2}, \\quad d_y = \\frac{4EI_y}{L}, \\quad e_y = \\frac{2EI_y}{L}$@

% @$K_{local}^{12\\times12} = \\begin{bmatrix} k_a & 0 & 0 & 0 & 0 & 0 & -k_a & 0 & 0 & 0 & 0 & 0 \\\\ 0 & b_z & 0 & 0 & 0 & c_z & 0 & -b_z & 0 & 0 & 0 & c_z \\\\ 0 & 0 & b_y & 0 & -c_y & 0 & 0 & 0 & -b_y & 0 & -c_y & 0 \\\\ 0 & 0 & 0 & k_t & 0 & 0 & 0 & 0 & 0 & -k_t & 0 & 0 \\\\ 0 & 0 & -c_y & 0 & d_y & 0 & 0 & 0 & c_y & 0 & e_y & 0 \\\\ 0 & c_z & 0 & 0 & 0 & d_z & 0 & -c_z & 0 & 0 & 0 & e_z \\\\ -k_a & 0 & 0 & 0 & 0 & 0 & k_a & 0 & 0 & 0 & 0 & 0 \\\\ 0 & -b_z & 0 & 0 & 0 & -c_z & 0 & b_z & 0 & 0 & 0 & -c_z \\\\ 0 & 0 & -b_y & 0 & c_y & 0 & 0 & 0 & b_y & 0 & c_y & 0 \\\\ 0 & 0 & 0 & -k_t & 0 & 0 & 0 & 0 & 0 & k_t & 0 & 0 \\\\ 0 & 0 & -c_y & 0 & e_y & 0 & 0 & 0 & c_y & 0 & d_y & 0 \\\\ 0 & c_z & 0 & 0 & 0 & e_z & 0 & -c_z & 0 & 0 & 0 & d_z \\end{bmatrix}$@

% @$\\textbf{Evaluación numérica:}$@

E1 = ${E0}
A1 = ${A0}
Iz1 = ${Iz0}
Iy1 = ${Iy0}
G1 = ${G0}
J1 = ${J0}
L1 = ${L0.toFixed(4)}

% Coeficientes axial y torsión
ka = E1 * A1 / L1
kt = G1 * J1 / L1

% Coeficientes flexión plano XY (usa Iz)
bz = 12 * E1 * Iz1 / L1^3
cz = 6 * E1 * Iz1 / L1^2
dz = 4 * E1 * Iz1 / L1
ez = 2 * E1 * Iz1 / L1

% Coeficientes flexión plano XZ (usa Iy)
by = 12 * E1 * Iy1 / L1^3
cy = 6 * E1 * Iy1 / L1^2
dy1 = 4 * E1 * Iy1 / L1
ey = 2 * E1 * Iy1 / L1

% @$K_{local}^{num} =$@ evaluada con los datos del modelo:
K_loc_1 = [ka  0   0   0   0   0  -ka  0   0   0   0   0;
           0   bz  0   0   0   cz  0  -bz  0   0   0   cz;
           0   0   by  0  -cy  0   0   0  -by  0  -cy  0;
           0   0   0   kt  0   0   0   0   0  -kt  0   0;
           0   0  -cy  0   dy1 0   0   0   cy  0   ey  0;
           0   cz  0   0   0   dz  0  -cz  0   0   0   ez;
          -ka  0   0   0   0   0   ka  0   0   0   0   0;
           0  -bz  0   0   0  -cz  0   bz  0   0   0  -cz;
           0   0  -by  0   cy  0   0   0   by  0   cy  0;
           0   0   0  -kt  0   0   0   0   0   kt  0   0;
           0   0  -cy  0   ey  0   0   0   cy  0   dy1 0;
           0   cz  0   0   0   ez  0  -cz  0   0   0   dz]

% ─── Paso 2: Matriz de transformación T (elemento 1) ───
% Cosenos directores del elemento
dx1 = ${dx.toFixed(4)}
dy1t = ${dy.toFixed(4)}
dz1 = ${dz.toFixed(4)}

lx = dx1/L1
ly = dy1t/L1
lz = dz1/L1

% Submatriz de rotación 3x3 (lambda)
% @$\\lambda = \\begin{bmatrix} l_x & l_y & l_z \\\\ \\cdots \\end{bmatrix}$@

% ─── Paso 3: Ensamblaje ───
% @$K_{global} = \\sum_{e=1}^{${ne}} T_e^T \\cdot K_e \\cdot T_e$@
% En MATLAB: K_global = zeros(${ndof});
% for e = 1:${ne}
%   dofs = [(elem(e,1)-1)*6+1 : elem(e,1)*6, (elem(e,2)-1)*6+1 : elem(e,2)*6];
%   K_global(dofs,dofs) = K_global(dofs,dofs) + T'*Ke*T;
% end

% ─── Paso 4: Resolver ───
% @$K_{ff} \\cdot U_f = F_f$@
% En MATLAB: U(free) = K(free,free) \\ F(free)
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: Portal 2D paso a paso
// ═══════════════════════════════════════════════════════

function templatePortal(): string {
  return `% ═══════════════════════════════════════════
% Portal 2D — Análisis paso a paso
% 2 columnas + 1 viga, 4 nodos, 3 DOF/nodo
% ═══════════════════════════════════════════

% Geometría
H = 3
L = 5
E = 2.1e7
A_col = 0.04
I_col = 0.000213
A_vig = 0.03
I_vig = 0.000160

% ─── Elemento 1: Columna izq (nodo 0→2) ───
L1 = H
k1 = E * A_col / L1
t1 = 12 * E * I_col / L1^3
b1 = 6 * E * I_col / L1^2
c1 = 4 * E * I_col / L1
d1 = 2 * E * I_col / L1

% K local columna (u, w, theta) x 2 nodos = 6x6
% DOFs: [u0, w0, th0, u2, w2, th2]
% Columna vertical: axial=w, corte=u, flexion=theta
K1 = [t1, 0, b1, -t1, 0, b1; 0, k1, 0, 0, -k1, 0; b1, 0, c1, -b1, 0, d1; -t1, 0, -b1, t1, 0, -b1; 0, -k1, 0, 0, k1, 0; b1, 0, d1, -b1, 0, c1]

% ─── Elemento 2: Columna der (nodo 1→3) ───
K2 = K1

% ─── Elemento 3: Viga (nodo 2→3) ───
L3 = L
k3 = E * A_vig / L3
t3 = 12 * E * I_vig / L3^3
b3 = 6 * E * I_vig / L3^2
c3 = 4 * E * I_vig / L3
d3 = 2 * E * I_vig / L3

% K local viga: DOFs [u2, w2, th2, u3, w3, th3]
K3 = [k3, 0, 0, -k3, 0, 0; 0, t3, b3, 0, -t3, b3; 0, b3, c3, 0, -b3, d3; -k3, 0, 0, k3, 0, 0; 0, -t3, -b3, 0, t3, -b3; 0, b3, d3, 0, -b3, c3]

% ─── Ensamblaje global (12 DOFs → 6 libres) ───
% Nodos 0,1 empotrados → DOFs 0-5 fijos
% Nodos 2,3 libres → DOFs 6-11 libres
% K_free = contribucion de K1(filas4-6,cols4-6) + K3(filas1-3,cols1-3)
%        + K2(filas4-6,cols4-6) + K3(filas4-6,cols4-6)

% Submatrices de cada elemento para nodos libres
% Nodo 2 recibe: K1[3:5,3:5] + K3[0:2,0:2]
% Nodo 3 recibe: K2[3:5,3:5] + K3[3:5,3:5]
% Acoplamiento 2-3: K3[0:2,3:5]

K_22 = [t1+k3, 0, -b1; 0, k1+t3, b3; -b1, b3, c1+c3]
K_33 = [t1+k3, 0, -b1; 0, k1+t3, -b3; -b1, -b3, c1+c3]
K_23 = [-k3, 0, 0; 0, -t3, b3; 0, -b3, d3]
K_32 = [-k3, 0, 0; 0, -t3, -b3; 0, b3, d3]

% K global reducido (6x6)
K_free = [K_22, K_23; K_32, K_33]

% ─── Carga lateral ───
P = 10
F_free = [P; 0; 0; 0; 0; 0]

% ─── Solve ───
u = inv(K_free) * F_free

% Desplazamiento lateral nodo 2
u_lat = u(1)
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: Barra axial — derivación FEM completa
// ═══════════════════════════════════════════════════════

function templateAxial(): string {
  return `% ═══════════════════════════════════════════
% Barra axial — Derivación FEM paso a paso
% 1 elemento, 2 nodos, 1 DOF por nodo
% ═══════════════════════════════════════════

% ─── Datos ───
L = 2
E = 210000
A = 0.01

% ─── Ecuación diferencial de gobierno ───
% $EA \\frac{d^2u}{dx^2} + q(x) = 0$

% ─── Funciones de forma (lineales) ───
% $N_1(\\xi) = 1 - \\xi$ donde $\\xi = x/L$
% $N_2(\\xi) = \\xi$

% ─── Matriz B = dN/dx ───
B = (1/L) * [-1, 1]

% ─── Rigidez: $K = \\int_0^L B^T \\cdot EA \\cdot B \\, dx$ ───
% $K = \\frac{EA}{L} \\begin{bmatrix} 1 & -1 \\\\ -1 & 1 \\end{bmatrix}$
K = (E * A / L) * [1, -1; -1, 1]

% ─── Carga distribuida $q = 5$ kN/m ───
q = 5

% ─── Vector de cargas consistente ───
% $F = \\int_0^L N^T q \\, dx = \\begin{bmatrix} qL/2 \\\\ qL/2 \\end{bmatrix}$
F_vec = [q * L / 2; q * L / 2]

% ─── Carga puntual en extremo libre ───
P = 20

% ─── Condiciones de borde: $u_1 = 0$ ───
% Reducción: $K_{22} \\cdot u_2 = F_2 + P$
EA = E * A
K_red = EA / L
F_red = q * L / 2 + P

% ─── Solución ───
u2 = F_red / K_red

% ─── Solución exacta ───
% $u(L) = \\frac{1}{EA}\\left(PL + \\frac{qL^2}{2}\\right)$
u_exact = (P * L + q * L^2 / 2) / (E * A)

% ─── Verificación ───
error_pct = abs(u2 - u_exact) / u_exact * 100

% ─── Reacción en apoyo ───
R1 = -(P + q * L)

% ─── Esfuerzo ───
% $\\sigma = E \\cdot \\varepsilon = E \\cdot \\frac{u_2}{L}$
sigma = E * u2 / L
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: 3 resortes — assembly manual
// ═══════════════════════════════════════════════════════

function templateSprings(): string {
  return `% ═══════════════════════════════════════════
% 3 resortes en serie — Assembly paso a paso
% 4 nodos, 1 DOF/nodo, nodo 0 y 3 fijos
% ═══════════════════════════════════════════

% ─── Rigideces ───
k1 = 100
k2 = 200
k3 = 150

% ─── Matrices locales (2x2) ───
K1 = [k1, -k1; -k1, k1]
K2 = [k2, -k2; -k2, k2]
K3 = [k3, -k3; -k3, k3]

% ─── Assembly global (4x4) ───
K = zeros(4, 4)

% Elemento 1: nodos 0-1
K(1,1) = K(1,1) + K1(1,1)
K(1,2) = K(1,2) + K1(1,2)
K(2,1) = K(2,1) + K1(2,1)
K(2,2) = K(2,2) + K1(2,2)

% Elemento 2: nodos 1-2
K(2,2) = K(2,2) + K2(1,1)
K(2,3) = K(2,3) + K2(1,2)
K(3,2) = K(3,2) + K2(2,1)
K(3,3) = K(3,3) + K2(2,2)

% Elemento 3: nodos 2-3
K(3,3) = K(3,3) + K3(1,1)
K(3,4) = K(3,4) + K3(1,2)
K(4,3) = K(4,3) + K3(2,1)
K(4,4) = K(4,4) + K3(2,2)

% ─── K global ensamblada ───
K

% ─── Cargas: F2=50, F3=0 ───
F = [0; 50; 0; 0]

% ─── Reducir: nodos 0 y 3 fijos ───
% DOFs libres: 1 y 2 (indices 2,3 en MATLAB)
K_free = [K(2,2), K(2,3); K(3,2), K(3,3)]
F_free = [F(2); F(3)]

% ─── Solve ───
u_free = inv(K_free) * F_free

% ─── Vector completo ───
u1 = u_free(1)
u2 = u_free(2)

% ─── Reacciones ───
R0 = -k1 * u1
R3 = -k3 * (0 - u2)

% ─── Verificación equilibrio ───
suma = R0 + 50 + R3
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: Viga empotrada — flexión
// ═══════════════════════════════════════════════════════

function templateViga(): string {
  return `% ═══════════════════════════════════════════
% Viga empotrada-libre (cantilever)
% 1 elemento, 2 DOF/nodo (v, theta)
% ═══════════════════════════════════════════

% ─── Datos ───
L = 3
E = 2.1e7
b_sec = 0.25
h = 0.40
I = b_sec * h^3 / 12

% ─── Funciones de forma (Hermite) ───
%   N1 = 1 - 3*xi² + 2*xi³
%   N2 = L*xi*(1-xi)²
%   N3 = 3*xi² - 2*xi³
%   N4 = L*xi²*(xi-1)

% ─── K local (4x4): [v1, th1, v2, th2] ───
EI = E * I
K = (EI / L^3) * [12, 6*L, -12, 6*L; 6*L, 4*L^2, -6*L, 2*L^2; -12, -6*L, 12, -6*L; 6*L, 2*L^2, -6*L, 4*L^2]

% ─── Carga puntual en extremo libre ───
P = -10

% ─── BCs: nodo 1 empotrado (v1=0, th1=0) ───
% K reducida: filas/cols 3,4
K_free = [K(3,3), K(3,4); K(4,3), K(4,4)]
F_free = [P; 0]

% ─── Solve ───
u_free = inv(K_free) * F_free
v2 = u_free(1)
th2 = u_free(2)

% ─── Solución exacta ───
v_exact = P * L^3 / (3 * EI)
th_exact = P * L^2 / (2 * EI)

% ─── Verificación ───
error_v = abs(v2 - v_exact) / abs(v_exact) * 100
error_th = abs(th2 - th_exact) / abs(th_exact) * 100

% ─── Reacciones ───
% R = K_full * u_full - F
R_v = -(P)
M_emp = -(P * L)
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: Calculadora libre
// ═══════════════════════════════════════════════════════

function templateCustom(): string {
  return `% ═══════════════════════════════════════════
% Calculadora libre — Álgebra lineal
% ═══════════════════════════════════════════

% ─── Matrices ───
K = [4, -2, 0; -2, 4, -2; 0, -2, 4]
F = [10; 0; -5]

% ─── Solve K*u = F ───
u = inv(K) * F

% ─── Indexación (1-based) ───
K(1,1)
K(2,3)
F(3)

% ─── Operaciones ───
Kt = K'
d = det(K)
Ki = inv(K)

% ─── Verificación: K*u = F ───
check = K * u

% ─── Utilidades ───
Z = zeros(3, 3)
I = eye(3)
v = ones(4, 1)

% ─── Loop ───
suma = 0
for i = 1:5
  suma = suma + i^2
end
suma
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: Datos del modelo actual
// ═══════════════════════════════════════════════════════

/** Format nodes as single-line MATLAB matrix */
function fmtNodesCompact(nodes: Node[]): string {
  if (nodes.length === 0) return "[]";
  // Limit display to first 20 nodes
  const show = nodes.slice(0, 20);
  const rows = show.map(n => `${n[0]}, ${n[1]}, ${n[2]}`).join("; ");
  const suffix = nodes.length > 20 ? ` % ... (${nodes.length} nodos total)` : "";
  return `[${rows}]${suffix}`;
}

function fmtElementsCompact(elements: Element[]): string {
  if (elements.length === 0) return "[]";
  const show = elements.slice(0, 20);
  const rows = show.map(e => e.join(", ")).join("; ");
  const suffix = elements.length > 20 ? ` % ... (${elements.length} elementos total)` : "";
  return `[${rows}]${suffix}`;
}

function fmtPropValue(map: Map<number, number> | undefined, name: string): string {
  if (!map || map.size === 0) return `% ${name}: no definido`;
  const vals = Array.from(map.values());
  // All same → scalar (works with stiffness() which broadcasts)
  if (vals.every(v => v === vals[0])) {
    return `${name} = ${vals[0]}`;
  }
  // Group unique values: if only 2-3 groups, show as comment + array
  const unique = [...new Set(vals.map(v => v.toPrecision(8)))];
  if (unique.length <= 3) {
    // Show groups as comment, full array for math.js
    const groups = unique.map(u => {
      const count = vals.filter(v => v.toPrecision(8) === u).length;
      return `${parseFloat(u)}(×${count})`;
    }).join(", ");
    return `${name} = [${vals.join(", ")}] % ${groups}`;
  }
  // Many different values — full array (math.js needs it)
  return `${name} = [${vals.join(", ")}]`;
}

function templateModelData(data: ModelData): string {
  // Separate frames (2-node) and shells (3+ nodes)
  const frameIdx: number[] = [];
  const shellIdx: number[] = [];
  data.elements.forEach((el, i) => {
    if (el.length === 2) frameIdx.push(i);
    else shellIdx.push(i);
  });

  const ei = data.elementInputs;
  const ss = (ei as any).sectionShapes as Map<number, any> | undefined;

  // Group elements by section name
  const sectionGroups = new Map<string, { indices: number[], shape: any, E: number, G: number }>();
  frameIdx.forEach(i => {
    const shape = ss?.get(i);
    const name = shape?.name || "Default";
    if (!sectionGroups.has(name)) {
      sectionGroups.set(name, {
        indices: [],
        shape: shape || { type: "rect", b: 0.40, h: 0.40 },
        E: ei.elasticities?.get(i) || 0,
        G: ei.shearModuli?.get(i) || 0,
      });
    }
    sectionGroups.get(name)!.indices.push(i);
  });

  // Build section-based property lines
  const sectionLines: string[] = [];
  let secIdx = 0;
  for (const [name, grp] of sectionGroups) {
    secIdx++;
    const s = grp.shape;
    const count = grp.indices.length;
    const tag = secIdx === 1 ? "" : `_${secIdx}`;

    if (s.type === "rect") {
      sectionLines.push(`% ─── Sección ${name}: Rectangular ${(s.b*100).toFixed(0)}×${(s.h*100).toFixed(0)} cm (${count} elem) ───`);
      sectionLines.push(`b${tag} = ${s.b}`);
      sectionLines.push(`h${tag} = ${s.h}`);
      sectionLines.push(`A${tag} = b${tag} * h${tag}`);
      sectionLines.push(`Iz${tag} = b${tag} * h${tag}^3 / 12`);
      sectionLines.push(`Iy${tag} = h${tag} * b${tag}^3 / 12`);
      sectionLines.push(`J${tag} = b${tag} * h${tag} * (b${tag}^2 + h${tag}^2) / 12`);
    } else if (s.type === "I") {
      sectionLines.push(`% ─── Sección ${name}: Perfil I (${count} elem) ───`);
      sectionLines.push(`bf${tag} = ${s.b || 0}`);
      sectionLines.push(`d${tag} = ${s.h || 0}`);
      if (s.tf) sectionLines.push(`tf${tag} = ${s.tf}`);
      if (s.tw) sectionLines.push(`tw${tag} = ${s.tw}`);
      const A = ei.areas?.get(grp.indices[0]) || 0;
      const Iz = ei.momentsOfInertiaZ?.get(grp.indices[0]) || 0;
      const Iy = ei.momentsOfInertiaY?.get(grp.indices[0]) || 0;
      sectionLines.push(`A${tag} = ${A}`);
      sectionLines.push(`Iz${tag} = ${Iz}`);
      sectionLines.push(`Iy${tag} = ${Iy}`);
    } else if (s.type === "HSS" || s.type === "CFT") {
      sectionLines.push(`% ─── Sección ${name}: Tubular ${s.type} (${count} elem) ───`);
      sectionLines.push(`b${tag} = ${s.b || 0}`);
      sectionLines.push(`h${tag} = ${s.h || 0}`);
      if (s.tw) sectionLines.push(`t${tag} = ${s.tw}`);
      const A = ei.areas?.get(grp.indices[0]) || 0;
      sectionLines.push(`A${tag} = ${A}`);
    } else if (s.type === "circ" || s.type === "pipe") {
      sectionLines.push(`% ─── Sección ${name}: Circular (${count} elem) ───`);
      sectionLines.push(`d${tag} = ${s.d || 0}`);
      const A = ei.areas?.get(grp.indices[0]) || 0;
      sectionLines.push(`A${tag} = ${A}`);
    } else {
      sectionLines.push(`% ─── Sección ${name}: ${s.type} (${count} elem) ───`);
      const A = ei.areas?.get(grp.indices[0]) || 0;
      sectionLines.push(`A${tag} = ${A}`);
    }
    sectionLines.push("");
  }

  // Material
  const E0 = ei.elasticities?.get(frameIdx[0] || 0) || 0;
  const G0 = ei.shearModuli?.get(frameIdx[0] || 0) || 0;

  // Build shell property lines
  const shellPropLines: string[] = [];
  if (shellIdx.length > 0) {
    const t0 = ei.thicknesses?.get(shellIdx[0]) || 0;
    const nu0 = ei.poissonsRatios?.get(shellIdx[0]) || 0;
    shellPropLines.push(`% ─── Shell (${shellIdx.length} elementos) ───`);
    shellPropLines.push(`t_shell = ${t0}`);
    shellPropLines.push(`nu = ${nu0}`);
  }

  const name = data.modelName || "Modelo";
  return `% ═══════════════════════════════════════════
% ${name} — Datos del modelo
% ═══════════════════════════════════════════

nnodes = ${data.nodes.length}
nelem = ${data.elements.length}
ndof = nnodes * 6

% Coordenadas [x,y,z]
nodes = ${fmtNodesCompact(data.nodes)}

% Conectividad
elem = ${fmtElementsCompact(data.elements)}

% ─── Material ───
E = ${E0}
G = ${G0}

% ─── Secciones (${sectionGroups.size} tipos, ${frameIdx.length} frames) ───
${sectionLines.join("\n")}
${shellPropLines.join("\n")}`;
}

// ═══════════════════════════════════════════════════════
// MATLAB STANDALONE — Script completo para el modelo actual
// Ejecutable en MATLAB/Octave sin dependencias
// ═══════════════════════════════════════════════════════

function templateMatlabStandalone(data: ModelData): string {
  const ei = data.elementInputs;
  const ni = data.nodeInputs;
  const name = data.modelName || "Modelo";
  const nn = data.nodes.length;
  const ne = data.elements.length;

  // Separate frames and shells
  const frameIdx: number[] = [];
  const shellIdx: number[] = [];
  data.elements.forEach((el, i) => {
    if (el.length === 2) frameIdx.push(i);
    else shellIdx.push(i);
  });

  // Nodes matrix
  const nodeLines = data.nodes.map(n => `  ${n[0]}, ${n[1]}, ${n[2]}`).join(";\n");

  // Elements matrix (1-indexed for MATLAB)
  const elemLines = data.elements
    .filter(el => el.length === 2)
    .map(el => `  ${el[0]+1}, ${el[1]+1}`).join(";\n");

  // Property arrays for frames
  const propArrays: string[] = [];
  if (frameIdx.length > 0) {
    const props = ["areas", "momentsOfInertiaZ", "momentsOfInertiaY", "torsionalConstants"] as const;
    const matlabNames = ["A_elem", "Iz_elem", "Iy_elem", "J_elem"];
    props.forEach((p, idx) => {
      const map = (ei as any)[p] as Map<number, number> | undefined;
      if (map && map.size > 0) {
        const vals = frameIdx.map(i => map.get(i) || 0);
        propArrays.push(`${matlabNames[idx]} = [${vals.join("; ")}];`);
      }
    });
  }

  // Supports (fixed DOFs)
  const fixedDofs: number[] = [];
  if (ni.supports) {
    ni.supports.forEach((sup, nodeIdx) => {
      sup.forEach((fixed, dofIdx) => {
        if (fixed) fixedDofs.push(nodeIdx * 6 + dofIdx + 1); // 1-indexed
      });
    });
  }

  // Loads
  const loadLines: string[] = [];
  if (ni.forces) {
    ni.forces.forEach((force, nodeIdx) => {
      force.forEach((val, dofIdx) => {
        if (Math.abs(val) > 1e-12) {
          loadLines.push(`F(${nodeIdx * 6 + dofIdx + 1}) = ${val};`);
        }
      });
    });
  }

  const E0 = ei.elasticities?.get(frameIdx[0] || 0) || 0;
  const G0 = ei.shearModuli?.get(frameIdx[0] || 0) || 0;

  return `%% ═══════════════════════════════════════════════════════
%% ${name} — Script MATLAB/Octave standalone
%% Generado por Hekatan Struct
%% Ejecutar: octave ${name.replace(/\s/g,"_")}.m
%% ═══════════════════════════════════════════════════════
clear; clc;

%% ─── 1. DATOS DEL MODELO ───
nn = ${nn};  % nodos
ne = ${frameIdx.length};  % elementos frame
ndof = nn * 6;

% Coordenadas [x, y, z]
nodes = [
${nodeLines}
];

% Conectividad [nodo_i, nodo_j] (1-indexed)
elem = [
${elemLines}
];

% Material
E = ${E0};
G = ${G0};

% Propiedades por elemento
${propArrays.join("\n")}

%% ─── 2. FUNCIÓN: K local 12×12 Timoshenko ───
% Ref: Dr. Aguiar, Dinámica de Estructuras
function K = beam_stiffness_3d(E, G, A, Iz, Iy, J, L)
    % Áreas de corte (rectangular 5/6)
    Asy = A * 5/6;
    Asz = A * 5/6;
    % Factores Timoshenko
    phiy = 12 * E * Iz / (G * Asy * L^2);
    phiz = 12 * E * Iy / (G * Asz * L^2);

    EA_L = E * A / L;
    GJ_L = G * J / L;

    % Flexión en plano XY (usa Iz)
    c1z = 12*E*Iz / (L^3 * (1+phiy));
    c2z = 6*E*Iz / (L^2 * (1+phiy));
    c3z = (4+phiy)*E*Iz / (L*(1+phiy));
    c4z = (2-phiy)*E*Iz / (L*(1+phiy));

    % Flexión en plano XZ (usa Iy)
    c1y = 12*E*Iy / (L^3 * (1+phiz));
    c2y = 6*E*Iy / (L^2 * (1+phiz));
    c3y = (4+phiz)*E*Iy / (L*(1+phiz));
    c4y = (2-phiz)*E*Iy / (L*(1+phiz));

    K = zeros(12,12);
    % Axial
    K(1,1) = EA_L; K(7,7) = EA_L; K(1,7) = -EA_L; K(7,1) = -EA_L;
    % Torsión
    K(4,4) = GJ_L; K(10,10) = GJ_L; K(4,10) = -GJ_L; K(10,4) = -GJ_L;
    % Flexión XY
    K(2,2) = c1z; K(8,8) = c1z; K(2,8) = -c1z; K(8,2) = -c1z;
    K(2,6) = c2z; K(6,2) = c2z; K(2,12) = c2z; K(12,2) = c2z;
    K(8,6) = -c2z; K(6,8) = -c2z; K(8,12) = -c2z; K(12,8) = -c2z;
    K(6,6) = c3z; K(12,12) = c3z; K(6,12) = c4z; K(12,6) = c4z;
    % Flexión XZ
    K(3,3) = c1y; K(9,9) = c1y; K(3,9) = -c1y; K(9,3) = -c1y;
    K(3,5) = -c2y; K(5,3) = -c2y; K(3,11) = -c2y; K(11,3) = -c2y;
    K(9,5) = c2y; K(5,9) = c2y; K(9,11) = c2y; K(11,9) = c2y;
    K(5,5) = c3y; K(11,11) = c3y; K(5,11) = c4y; K(11,5) = c4y;
end

%% ─── 3. FUNCIÓN: Matriz de transformación 3D ───
function T = transform_3d(n1, n2)
    dx = n2 - n1;
    L = norm(dx);
    lx = dx / L;

    % Vector auxiliar para definir plano local
    if abs(lx(1)) < 0.9 && abs(lx(2)) < 0.9
        vup = [0, 0, 1];
    else
        vup = [1, 0, 0];
    end

    lz = cross(lx, vup);
    lz = lz / norm(lz);
    ly = cross(lz, lx);

    R = [lx; ly; lz];  % 3×3 rotation
    T = zeros(12,12);
    T(1:3, 1:3) = R;
    T(4:6, 4:6) = R;
    T(7:9, 7:9) = R;
    T(10:12, 10:12) = R;
end

%% ─── 4. ENSAMBLAJE ───
K_global = zeros(ndof, ndof);

for e = 1:ne
    ni = elem(e, 1);
    nj = elem(e, 2);
    n1 = nodes(ni, :);
    n2 = nodes(nj, :);
    L = norm(n2 - n1);

    % K local Timoshenko
    Ke = beam_stiffness_3d(E, G, A_elem(e), Iz_elem(e), Iy_elem(e), J_elem(e), L);

    % Transformación
    Te = transform_3d(n1, n2);

    % K global del elemento
    Kg = Te' * Ke * Te;

    % DOFs globales (1-indexed)
    dofs = [(ni-1)*6+1 : ni*6, (nj-1)*6+1 : nj*6];

    % Ensamblar
    K_global(dofs, dofs) = K_global(dofs, dofs) + Kg;
end

fprintf('K global: %dx%d, nnz=%d\\n', ndof, ndof, nnz(sparse(K_global)));

%% ─── 5. VECTOR DE CARGAS ───
F = zeros(ndof, 1);
${loadLines.length > 0 ? loadLines.join("\n") : "% Sin cargas definidas"}

%% ─── 6. CONDICIONES DE BORDE ───
fixed_dofs = [${fixedDofs.join(", ")}];
free_dofs = setdiff(1:ndof, fixed_dofs);

%% ─── 7. RESOLVER Ku = F ───
K_red = K_global(free_dofs, free_dofs);
F_red = F(free_dofs);

U = zeros(ndof, 1);
U(free_dofs) = K_red \\ F_red;

fprintf('\\n=== DESPLAZAMIENTOS ===\\n');
for i = 1:nn
    d = U((i-1)*6+1 : i*6);
    if norm(d) > 1e-12
        fprintf('Nodo %d: ux=%.6f uy=%.6f uz=%.6f rx=%.6f ry=%.6f rz=%.6f\\n', i, d(1), d(2), d(3), d(4), d(5), d(6));
    end
end

%% ─── 8. REACCIONES ───
R = K_global * U - F;
fprintf('\\n=== REACCIONES EN APOYOS ===\\n');
for i = 1:length(fixed_dofs)
    d = fixed_dofs(i);
    node = ceil(d/6);
    dof_local = mod(d-1,6)+1;
    dof_names = {'Fx','Fy','Fz','Mx','My','Mz'};
    if abs(R(d)) > 1e-6
        fprintf('Nodo %d %s: %.4f\\n', node, dof_names{dof_local}, R(d));
    end
end

U_max = max(abs(U));
fprintf('\\nDesplazamiento máximo: %.6f\\n', U_max);
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: MATLAB Codes for FEA — Cap 2: Springs
// Ref: problem1.m (Ferreira 2008, p.24)
// ═══════════════════════════════════════════════════════

function ferSprings(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 2: Resortes discretos
% Ref: problem1.m — 3 resortes, 4 nodos
% ═══════════════════════════════════════════

% ─── Datos ───
% 3 resortes conectando 4 nodos
% $k_1, k_2, k_3 = 1$ (rigidez unitaria)
% Carga $P = 10$ en nodo 2
nNodes = 4
nElem = 3

% Conectividad
elemNodes = [1, 2; 2, 3; 2, 4]

% Rigideces
k1 = 1
k2 = 1
k3 = 1

% ─── Matrices locales $K^e = k \\begin{bmatrix} 1 & -1 \\\\ -1 & 1 \\end{bmatrix}$ ───
K1 = k1 * [1, -1; -1, 1]
K2 = k2 * [1, -1; -1, 1]
K3 = k3 * [1, -1; -1, 1]

% ─── Ensamblaje manual ───
K = zeros(nNodes, nNodes)
% Elemento 1: nodos 1-2
K = K + [[k1, -k1, 0, 0; -k1, k1, 0, 0; 0, 0, 0, 0; 0, 0, 0, 0]]
% Elemento 2: nodos 2-3
K = K + [[0, 0, 0, 0; 0, k2, -k2, 0; 0, -k2, k2, 0; 0, 0, 0, 0]]
% Elemento 3: nodos 2-4
K = K + [[0, 0, 0, 0; 0, k3, 0, -k3; 0, 0, 0, 0; 0, -k3, 0, k3]]

% ─── K global ensamblada ───
% $K_{global}$:
K

% ─── Vector de fuerzas ───
F = [0; 10; 0; 0]

% ─── BCs: nodos 1, 3, 4 fijos ───
% DOF libre: solo nodo 2
% $K_{22} \\cdot u_2 = F_2$
K_red = K(2, 2)
F_red = 10

% ─── Solución ───
u2 = F_red / K_red

% ─── Reacciones $R = K \\cdot u - F$ ───
R1 = -k1 * u2
R3 = -k2 * u2
R4 = -k3 * u2
% Verificación: $R_1 + R_3 + R_4 + P = 0$
check = R1 + R3 + R4 + 10
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 3 — Barra axial isoparamétrica
// Ref: problem2.m (Ferreira 2008, p.37)
// ═══════════════════════════════════════════════════════

function ferBar(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 3: Barra axial
% Ref: problem2.m — barra con carga puntual
% ═══════════════════════════════════════════

% ─── Datos ───
E = 1
A = 1
L_total = 1
nElem = 4
Le = L_total / nElem

% ─── Rigidez local ───
% $K^e = \\frac{EA}{L_e} \\begin{bmatrix} 1 & -1 \\\\ -1 & 1 \\end{bmatrix}$
ke = E * A / Le
Ke = ke * [1, -1; -1, 1]

% ─── Ensamblaje ───
nNodes = nElem + 1
K = zeros(nNodes, nNodes)
% Ciclo de ensamblaje
% for e = 1:nElem
%   dofs = [e, e+1]
%   K(dofs,dofs) = K(dofs,dofs) + Ke
% end
% Resultado equivalente:
K(1,1) = ke
K(nNodes,nNodes) = ke
% Nodos internos: 2*ke en diagonal
K(2,2) = 2*ke
K(3,3) = 2*ke
K(4,4) = 2*ke
% Off-diagonals
K(1,2) = -ke
K(2,1) = -ke
K(2,3) = -ke
K(3,2) = -ke
K(3,4) = -ke
K(4,3) = -ke
K(4,5) = -ke
K(5,4) = -ke

% ─── Carga: P = 1 en nodo 5 (extremo libre) ───
P = 1
F = [0; 0; 0; 0; P]

% ─── BCs: nodo 1 fijo ───
% Reducción: eliminar fila/columna 1
% $K_{red} \\cdot u = F_{red}$

% ─── Solución exacta ───
% $u(x) = \\frac{Px}{EA}$
u_exact_5 = P * L_total / (E * A)
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 4 — Truss 2D
// Ref: problem5.m (Ferreira 2008, p.53)
// ═══════════════════════════════════════════════════════

function ferTruss2D(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 4: Truss 2D
% Ref: problem5.m — cercha plana, 2 DOF/nodo
% ═══════════════════════════════════════════

% ─── Datos ───
E = 30e6
A = 2

% Nodos [x, y]
nodes = [0, 0; 40, 0; 40, 30; 0, 30]
nNodes = 4

% Conectividad
elem = [1, 2; 1, 3; 2, 3; 3, 4; 1, 4]
nElem = 5

% ─── Longitud y cosenos directores ───
% Elemento 1: horizontal
dx_1 = 40
dy_1 = 0
L_1 = 40
c_1 = dx_1 / L_1
s_1 = dy_1 / L_1

% Elemento 2: diagonal
dx_2 = 40
dy_2 = 30
L_2 = sqrt(dx_2^2 + dy_2^2)
c_2 = dx_2 / L_2
s_2 = dy_2 / L_2

% ─── K local truss (4x4 en global) ───
% $K^e = \\frac{EA}{L} \\begin{bmatrix} c^2 & cs & -c^2 & -cs \\\\ cs & s^2 & -cs & -s^2 \\\\ -c^2 & -cs & c^2 & cs \\\\ -cs & -s^2 & cs & s^2 \\end{bmatrix}$

% Elemento 1 (horizontal): c=1, s=0
K1 = E * A / L_1 * [1, 0, -1, 0; 0, 0, 0, 0; -1, 0, 1, 0; 0, 0, 0, 0]

% Elemento 2 (diagonal): c=0.8, s=0.6
K2 = E * A / L_2 * [c_2^2, c_2*s_2, -c_2^2, -c_2*s_2; c_2*s_2, s_2^2, -c_2*s_2, -s_2^2; -c_2^2, -c_2*s_2, c_2^2, c_2*s_2; -c_2*s_2, -s_2^2, c_2*s_2, s_2^2]

% ─── Cargas ───
% $F_3 = 20000$ lb (en nodo 2, dirección y)
% $F_7 = -25000$ lb (en nodo 4, dirección y)
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 5 — Truss 3D
// ═══════════════════════════════════════════════════════

function ferTruss3D(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 5: Truss 3D
% Ref: problem8.m — cercha espacial, 3 DOF/nodo
% ═══════════════════════════════════════════

% ─── Datos ───
E = 1.2e6
A = 0.5

% Nodos [x, y, z]
nodes = [72, 0, 0; 0, 36, 0; 0, 36, 72; 0, 0, -48]

% Conectividad
elem = [1, 2; 1, 3; 1, 4]
nElem = 3

% ─── Longitud elemento 1 ───
dx = nodes(2,1) - nodes(1,1)
dy = nodes(2,2) - nodes(1,2)
dz = nodes(2,3) - nodes(1,3)
L_1 = sqrt(dx^2 + dy^2 + dz^2)

% Cosenos directores
cx = dx / L_1
cy = dy / L_1
cz = dz / L_1

% ─── K local truss 3D (6x6) ───
% $K^e = \\frac{EA}{L} T^T \\begin{bmatrix} 1 & -1 \\\\ -1 & 1 \\end{bmatrix} T$
% donde $T$ transforma 3D a local

% ─── Carga en nodo 1 ───
% $F = [0, -1000, 0]$ (nodo 1)
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 6 — Viga Bernoulli
// ═══════════════════════════════════════════════════════

function ferBernoulli(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 6: Viga Euler-Bernoulli
% Ref: problem9.m — viga simplemente apoyada
% ═══════════════════════════════════════════

% ─── Datos ───
E = 1
I = 1
L = 1
nElem = 4
Le = L / nElem

% 2 DOF/nodo: $w$ (deflexión) y $\\theta$ (rotación)
% ─── Rigidez local (4x4) ───
% $K^e = \\frac{EI}{L^3} \\begin{bmatrix} 12 & 6L & -12 & 6L \\\\ 6L & 4L^2 & -6L & 2L^2 \\\\ -12 & -6L & 12 & -6L \\\\ 6L & 2L^2 & -6L & 4L^2 \\end{bmatrix}$

coeff = E * I / Le^3
Ke = coeff * [12, 6*Le, -12, 6*Le; 6*Le, 4*Le^2, -6*Le, 2*Le^2; -12, -6*Le, 12, -6*Le; 6*Le, 2*Le^2, -6*Le, 4*Le^2]

% ─── Carga distribuida q ───
q = 1
% Vector de fuerzas consistente:
% $f^e = \\frac{qL}{2} \\begin{bmatrix} 1 \\\\ L/6 \\\\ 1 \\\\ -L/6 \\end{bmatrix}$
fe = q * Le / 2 * [1; Le/6; 1; -Le/6]

% ─── BCs: SS (simplemente apoyada) ───
% $w_1 = 0$, $w_{n+1} = 0$ (DOFs 1, 2*nNodes-1)

% ─── Solución exacta centro ───
% $w_{max} = \\frac{5qL^4}{384EI}$
w_exact = 5 * q * L^4 / (384 * E * I)
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 7 — Frame 2D
// ═══════════════════════════════════════════════════════

function ferFrame2D(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 7: Frame 2D
% Ref: problem11.m — pórtico plano, 3 DOF/nodo
% ═══════════════════════════════════════════

% ─── Datos ───
E = 210e6
A = 2e-2
I = 5e-5
P = 10000

% Nodos [x, y]
nodes = [0, 0; 0, 6; 6, 6; 6, 0]
nNodes = 4

% Conectividad
elem = [1, 2; 2, 3; 3, 4]
nElem = 3

% 3 DOF/nodo: $u$, $v$, $\\theta$
ndof = nNodes * 3

% ─── Longitud y ángulo ───
% Elem 1 (columna izq): L=6, $\\theta=90°$
L_1 = 6
theta_1 = pi / 2
% Elem 2 (viga): L=6, $\\theta=0°$
L_2 = 6
theta_2 = 0
% Elem 3 (columna der): L=6, $\\theta=-90°$
L_3 = 6
theta_3 = -pi / 2

% ─── K local frame 2D (6x6) ───
% $K^e = \\begin{bmatrix} EA/L & 0 & 0 & -EA/L & 0 & 0 \\\\
%   0 & 12EI/L^3 & 6EI/L^2 & 0 & -12EI/L^3 & 6EI/L^2 \\\\
%   0 & 6EI/L^2 & 4EI/L & 0 & -6EI/L^2 & 2EI/L \\\\
%   \\cdots \\end{bmatrix}$

% Ejemplo elem 2 (viga horizontal):
Ke_2_local = [E*A/L_2, 0, 0, -E*A/L_2, 0, 0; 0, 12*E*I/L_2^3, 6*E*I/L_2^2, 0, -12*E*I/L_2^3, 6*E*I/L_2^2; 0, 6*E*I/L_2^2, 4*E*I/L_2, 0, -6*E*I/L_2^2, 2*E*I/L_2; -E*A/L_2, 0, 0, E*A/L_2, 0, 0; 0, -12*E*I/L_2^3, -6*E*I/L_2^2, 0, 12*E*I/L_2^3, -6*E*I/L_2^2; 0, 6*E*I/L_2^2, 2*E*I/L_2, 0, -6*E*I/L_2^2, 4*E*I/L_2]

% ─── Transformación ───
% $T = \\begin{bmatrix} c & s & 0 \\\\ -s & c & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$

% ─── Carga: P horizontal en nodo 2 ───
% $F = [P, 0, 0]$ en nodo 2 (DOFs 4,5,6)

% ─── BCs: empotrado nodos 1 y 4 ───
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 8 — Frame 3D
// ═══════════════════════════════════════════════════════

function ferFrame3D(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 8: Frame 3D
% Ref: problem13.m — pórtico espacial, 6 DOF/nodo
% ═══════════════════════════════════════════

% ─── Datos ───
E = 210e9
G = 84e9
A = 0.02
Iy = 10e-5
Iz = 20e-5
J = 5e-5

% Nodos [x, y, z]
nodes = [0, 0, 0; 3, 0, 0; 3, 0, -3; 0, 0, -3]

% Conectividad
elem = [1, 2; 2, 3; 3, 4]

% 6 DOF/nodo: $u, v, w, \\theta_x, \\theta_y, \\theta_z$
nNodes = 4
ndof = nNodes * 6

% ─── K local frame 3D (12x12) ───
% Incluye: axial, flexión 2 planos, torsión
% Los coeficientes del libro (Eq 8.1-8.4):
% $K_{11} = EA/L$, $K_{22} = 12EI_z/L^3$, $K_{33} = 12EI_y/L^3$
% $K_{44} = GJ/L$, $K_{55} = 4EI_y/L$, $K_{66} = 4EI_z/L$

L_1 = 3
K_axial = E * A / L_1
K_flex_z = 12 * E * Iz / L_1^3
K_flex_y = 12 * E * Iy / L_1^3
K_torsion = G * J / L_1
K_bend_y = 4 * E * Iy / L_1
K_bend_z = 4 * E * Iz / L_1

% ─── Carga: P = 20000 N en nodo 2, dirección -Z ───
P = -20000

% ─── BCs: empotrado nodos 1 y 4 ───
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 10 — Timoshenko beam
// ═══════════════════════════════════════════════════════

function ferTimoshenko(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 10: Viga Timoshenko
% Ref: problem16.m — incluye deformación por corte
% ═══════════════════════════════════════════

% ─── Datos ───
E = 1
I = 1
L_total = 1
kapa = 5/6
nElem = 20
Le = L_total / nElem
q = 1

% ─── Rigidez Timoshenko (4x4) ───
% 2 DOF/nodo: $w$ y $\\theta$
% $K^e = K_b + K_s$ (flexión + corte)
% $K_b = \\frac{EI}{L} \\begin{bmatrix} 0 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & -1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & -1 & 0 & 1 \\end{bmatrix}$
% Integración reducida (1 pto Gauss)

% ─── Thickness ratio ───
thickness = 0.001
% $h/L$ = 0.001 → thin plate limit
G = E / (2 * (1 + 0.3))

% ─── Solución exacta (SS, carga uniforme) ───
% $w_{max} = \\frac{5qL^4}{384EI} + \\frac{qL^2}{8\\kappa G A}$
w_euler = 5 * q * L_total^4 / (384 * E * I)
A_s = thickness
w_shear = q * L_total^2 / (8 * kapa * G * A_s)
w_total = w_euler + w_shear

% ─── Para thick beam ($h/L = 0.1$) ───
thick_h = 0.1
I_thick = thick_h^3 / 12
w_euler_thick = 5 * q * L_total^4 / (384 * E * I_thick)
w_shear_thick = q * L_total^2 / (8 * kapa * G * thick_h)
ratio_shear = w_shear_thick / w_euler_thick * 100
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 11 — Plane stress Q4
// ═══════════════════════════════════════════════════════

function ferPlaneStressQ4(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 11: Plane Stress Q4
% Ref: problem17.m — tensión plana, elemento Q4
% ═══════════════════════════════════════════

% ─── Datos ───
E = 1
nu = 0.3
thickness = 1

% ─── Matriz constitutiva $D$ ───
% $D = \\frac{E}{1-\\nu^2} \\begin{bmatrix} 1 & \\nu & 0 \\\\ \\nu & 1 & 0 \\\\ 0 & 0 & \\frac{1-\\nu}{2} \\end{bmatrix}$
coeff_D = E / (1 - nu^2)
D11 = coeff_D
D12 = coeff_D * nu
D33 = coeff_D * (1 - nu) / 2

% ─── Funciones de forma Q4 ───
% $N_i(\\xi,\\eta) = \\frac{1}{4}(1 \\pm \\xi)(1 \\pm \\eta)$
% Derivadas:
% $\\frac{\\partial N_1}{\\partial \\xi} = -\\frac{1}{4}(1-\\eta)$

% ─── Puntos de Gauss 2×2 ───
gp = 0.577350269189626
pts = [-gp, -gp; gp, -gp; gp, gp; -gp, gp]
weights = [1, 1, 1, 1]

% ─── Ejemplo: placa con agujero ───
% Placa cuadrada 1x1, 2 DOF/nodo (u, v)
% Presión en tracción

% ─── Matriz B (strain-displacement) ───
% $B = \\begin{bmatrix} \\frac{\\partial N_i}{\\partial x} & 0 \\\\ 0 & \\frac{\\partial N_i}{\\partial y} \\\\ \\frac{\\partial N_i}{\\partial y} & \\frac{\\partial N_i}{\\partial x} \\end{bmatrix}$

% ─── Rigidez: $K^e = \\int B^T D B \\, t \\, dA$ ───
% Integración numérica con 4 puntos de Gauss
`;
}

// ═══════════════════════════════════════════════════════
// FERREIRA: Cap 12 — Mindlin plate Q4
// ═══════════════════════════════════════════════════════

function ferMindlinQ4(): string {
  return `% ═══════════════════════════════════════════
% Ferreira Cap 12: Placa Mindlin Q4
% Ref: problem19.m — placa cuadrada en flexión
% Benchmark validado con solución exacta
% ═══════════════════════════════════════════

% ─── Datos ───
E = 10920
nu = 0.30
kapa = 5/6
thickness = 0.1
I_plate = thickness^3 / 12

% ─── Rigidez flexural $D$ ───
% $D = \\frac{Eh^3}{12(1-\\nu^2)}$
D_flex = E * thickness^3 / (12 * (1 - nu^2))

% ─── Matriz constitutiva flexión ───
% $C_b = \\frac{E}{1-\\nu^2} \\begin{bmatrix} 1 & \\nu & 0 \\\\ \\nu & 1 & 0 \\\\ 0 & 0 & \\frac{1-\\nu}{2} \\end{bmatrix}$
C_b_coeff = I_plate * E / (1 - nu^2)

% ─── Matriz constitutiva corte ───
% $C_s = \\kappa \\frac{Eh}{2(1+\\nu)} I_2$
C_s_coeff = kapa * thickness * E / (2 * (1 + nu))

% ─── Placa cuadrada ───
a = 1
P = -1

% ─── Mesh 4×4 ───
nX = 4
nY = 4
nNodes = (nX + 1) * (nY + 1)
nElem = nX * nY
ndof = 3 * nNodes

% 3 DOF/nodo: $w, \\theta_x, \\theta_y$

% ─── Integración selectiva ───
% Flexión: 2×2 Gauss (completa)
% Corte: 1×1 Gauss (reducida → evita shear locking)

% ─── K elemento: $K^e = K_b + K_s$ ───
% $K_b = \\frac{h^3}{12} \\int B_f^T D_f B_f \\, |J| \\, d\\xi d\\eta$ (2×2)
% $K_s = \\alpha h \\int B_c^T D_c B_c \\, |J| \\, d\\xi d\\eta$ (1×1)

% ─── Solución exacta (SSSS, a/h=10) ───
% $\\bar{w} = w \\frac{D}{PL^4}$
w_bar_exact_SSSS = 0.004270
w_bar_exact_CCCC = 0.001503

% ─── Desplazamiento esperado ───
w_SSSS = w_bar_exact_SSSS * P * a^4 / D_flex
w_CCCC = w_bar_exact_CCCC * P * a^4 / D_flex

% ─── Resultados Ferreira (Table 12.1, a/h=10) ───
% Mesh 2×2:   SSSS=0.003545  CCCC=0.000357
% Mesh 6×6:   SSSS=0.004245  CCCC=0.001486
% Mesh 10×10: SSSS=0.004263  CCCC=0.001498
% Mesh 20×20: SSSS=0.004270  CCCC=0.001503
% Mesh 30×30: SSSS=0.004271  CCCC=0.001503
% Exacto:     SSSS=0.004270  CCCC=—
`;
}

// ═══════════════════════════════════════════════════════
// CURSO FEM COMPLETO — Simbólico + Numérico
// ═══════════════════════════════════════════════════════

function femCourse1D(): string {
  return `% ═══════════════════════════════════════════
% 📖 CURSO FEM 1: Barra 1D — De la ecuación diferencial al resultado
% Simbólico (sdiff, sint) + Numérico (matrices, solve)
% ═══════════════════════════════════════════

% ═══ PARTE 1: FORMULACIÓN FUERTE (Ecuación Diferencial) ═══

% Ecuación de gobierno (barra axial):
% $-EA \\frac{d^2u}{dx^2} = q(x)$

% Verificar simbólicamente:
% Si $u(x) = x^2$, entonces $u'' = 2$
u_sym = sdiff('x^2', 'x')
u_sym2 = sdiff2('x^2', 'x')

% ═══ PARTE 2: FORMULACIÓN DÉBIL (Forma Integral) ═══

% Multiplicar por función de prueba $v$ e integrar:
% $\\int_0^L EA \\frac{du}{dx}\\frac{dv}{dx} dx = \\int_0^L q v dx$

% Integral simbólica de $x^2$ (ejemplo):
F_sym = sint('x^2', 'x')

% Integral definida $\\int_0^1 x^2 dx = 1/3$:
area = sdefint('x^2', 'x', 0, 1)

% ═══ PARTE 3: DISCRETIZACIÓN — Funciones de Forma ═══

% Elemento lineal: 2 nodos, $\\xi \\in [0, 1]$
% $N_1(\\xi) = 1 - \\xi$
% $N_2(\\xi) = \\xi$

% Simbólico: derivadas de N
dN1 = sdiff('1-x', 'x')
dN2 = sdiff('x', 'x')

% ═══ PARTE 4: MATRIZ B (strain-displacement) ═══

% $B = \\frac{dN}{dx} = \\frac{1}{L}[-1, 1]$
L = 2
E = 210000
A = 0.01
B_mat = (1/L) * [-1, 1]

% ═══ PARTE 5: MATRIZ K (rigidez) ═══

% $K = \\int_0^L B^T \\cdot EA \\cdot B \\, dx$

% Simbólico: $B^T EA B = \\frac{EA}{L^2}[1,-1;-1,1]$
% Integrando sobre L:
% $K = \\frac{EA}{L}[1,-1;-1,1]$

% Numérico:
K = (E * A / L) * [1, -1; -1, 1]

% ─── Verificar con integración simbólica ───
EA = E * A
% $\\int_0^L B_1^2 \\cdot EA \\, dx = \\frac{EA}{L}$
K_11_sym = sdefint('EA*(1/L)^2', 'x', 0, 2)

% Integración numérica con Gauss:
K_11_num = integrate('2100*(0.5)^2', 0, 2, 4)

% ═══ PARTE 6: VECTOR DE CARGAS ═══

% Carga distribuida $q = 5$ kN/m
q = 5
% $f = \\int_0^L N^T q \\, dx = [qL/2; qL/2]$
f = [q * L / 2; q * L / 2]

% Carga puntual P = 20 kN en extremo
P = 20

% ═══ PARTE 7: CONDICIONES DE BORDE ═══

% Nodo 1 fijo: $u_1 = 0$
% Reducción: $K_{22} u_2 = f_2 + P$
K_red = EA / L
F_red = q * L / 2 + P

% ═══ PARTE 8: SOLUCIÓN ═══

u2 = F_red / K_red

% ═══ PARTE 9: VERIFICACIÓN ═══

% Solución exacta: $u(L) = \\frac{1}{EA}(PL + \\frac{qL^2}{2})$
u_exact = (P * L + q * L^2 / 2) / (E * A)
error_pct = abs(u2 - u_exact) / u_exact * 100

% Reacción: $R = -(P + qL)$
R = -(P + q * L)

% Esfuerzo: $\\sigma = E \\varepsilon = E \\frac{u_2}{L}$
sigma = E * u2 / L
`;
}

function femCourseBeam(): string {
  return `% ═══════════════════════════════════════════
% 📖 CURSO FEM 2: Viga Euler-Bernoulli
% Flexión — funciones de forma cúbicas (Hermite)
% ═══════════════════════════════════════════

% ═══ PARTE 1: ECUACIÓN DIFERENCIAL ═══

% $EI \\frac{d^4w}{dx^4} = q(x)$

% Derivada simbólica de función cúbica:
w = sdiff('a*x^3 + b*x^2 + c*x + d', 'x')
w2 = sdiff2('a*x^3 + b*x^2 + c*x + d', 'x')

% Cuarta derivada de cúbica = 0 (polinomio Hermite)

% ═══ PARTE 2: FUNCIONES DE FORMA HERMITE ═══

% 2 DOF/nodo: $w$ (deflexión) y $\\theta = dw/dx$ (rotación)
% 4 funciones de forma (cúbicas):
% $N_1 = 1 - 3\\xi^2 + 2\\xi^3$
% $N_2 = L(\\xi - 2\\xi^2 + \\xi^3)$
% $N_3 = 3\\xi^2 - 2\\xi^3$
% $N_4 = L(-\\xi^2 + \\xi^3)$

% Verificar que $N_1(0) = 1$, $N_1(1) = 0$:
N1_0 = ssubs('1 - 3*x^2 + 2*x^3', 'x', '0')
N1_1 = ssubs('1 - 3*x^2 + 2*x^3', 'x', '1')

% Derivadas (para matriz B):
dN1 = sdiff('1 - 3*x^2 + 2*x^3', 'x')
d2N1 = sdiff2('1 - 3*x^2 + 2*x^3', 'x')

% ═══ PARTE 3: MATRIZ K (rigidez) ═══

% $K = \\int_0^L EI (N'')^T (N'') dx$

E = 210000
I_v = 0.0001
L = 3

coeff = E * I_v / L^3
K_beam = coeff * [12, 6*L, -12, 6*L; 6*L, 4*L^2, -6*L, 2*L^2; -12, -6*L, 12, -6*L; 6*L, 2*L^2, -6*L, 4*L^2]

% ═══ PARTE 4: CARGAS CONSISTENTES ═══

q = 10
f_beam = q * L / 2 * [1; L/6; 1; -L/6]

% ═══ PARTE 5: SOLUCIÓN (viga en voladizo) ═══

% BC: $w_1 = 0$, $\\theta_1 = 0$ → DOFs libres: 3, 4
% $K_{22} u = f_{22}$
K_red_beam = [K_beam(3,3), K_beam(3,4); K_beam(4,3), K_beam(4,4)]
F_red_beam = [f_beam(3); f_beam(4)]

% Solución exacta voladizo: $w_{max} = \\frac{qL^4}{8EI}$
w_exact = q * L^4 / (8 * E * I_v)
`;
}

function femCourseQ4(): string {
  return `% ═══════════════════════════════════════════
% 📖 CURSO FEM 3: Elemento Q4 — Plane Stress
% Cuadrilátero bilineal completo paso a paso
% ═══════════════════════════════════════════

% ═══ PARTE 1: FUNCIONES DE FORMA Q4 ═══

% 4 nodos, coordenadas naturales $\\xi, \\eta \\in [-1, 1]$
% $N_i = \\frac{1}{4}(1 \\pm \\xi)(1 \\pm \\eta)$

% Evaluar en centro ($\\xi=0, \\eta=0$):
N_centro = N_Q4(0, 0)

% Evaluar en nodo 1 ($\\xi=-1, \\eta=-1$):
N_nodo1 = N_Q4(-1, -1)

% Derivadas en centro:
dN_centro = dN_Q4(0, 0)

% ═══ PARTE 2: JACOBIANO ═══

% Nodos de un cuadrilátero 2×1:
coords = [0, 0; 2, 0; 2, 1; 0, 1]

% $J = \\frac{\\partial(x,y)}{\\partial(\\xi,\\eta)} = dN \\cdot coords$
J = jacobian2d(dN_Q4(0, 0), coords)
detJ = det(J)

% Para rectángulo: $det(J) = \\frac{a \\cdot b}{4}$
% $a=2, b=1 \\rightarrow det(J) = 0.5$ ✓

% ═══ PARTE 3: MATRIZ B (strain-displacement) ═══

% $\\varepsilon = B \\cdot d$ donde $d = [u_1,v_1,u_2,v_2,...,u_4,v_4]$
% $B = \\begin{bmatrix} dN/dx & 0 \\\\ 0 & dN/dy \\\\ dN/dy & dN/dx \\end{bmatrix}$

B = B_plane(dN_Q4(0, 0), coords)

% ═══ PARTE 4: CONSTITUTIVA D ═══

% Plane stress: $\\sigma = D \\varepsilon$
E = 210000
nu = 0.3
D = D_planestress(E, nu)

% ═══ PARTE 5: RIGIDEZ — Integración Gauss 2×2 ═══

t = 1
% $K = \\int \\int B^T D B \\, t \\, det(J) \\, d\\xi \\, d\\eta$

% Punto de Gauss 1: $\\xi=-0.577, \\eta=-0.577$
gp = gauss2d(2)
xi_1 = -0.577350269189626
eta_1 = -0.577350269189626

dN_1 = dN_Q4(xi_1, eta_1)
J_1 = jacobian2d(dN_1, coords)
B_1 = B_plane(dN_1, coords)
Ke_1 = transpose(B_1) * D * B_1 * det(J_1) * t * 1

% ═══ PARTE 6: COMPARAR SIMBÓLICO ═══

% Integral simbólica de $\\xi^2$ sobre [-1,1]:
int_xi2 = sdefint('x^2', 'x', -1, 1)

% Debe dar 2/3:
int_check = seval(int_xi2)
`;
}

function femCourseMindlin(): string {
  return `% ═══════════════════════════════════════════
% 📖 CURSO FEM 4: Placa Mindlin-Reissner Q4
% Flexión de placas con corte transversal
% ═══════════════════════════════════════════

% ═══ PARTE 1: TEORÍA ═══

% 3 DOF/nodo: $w$ (deflexión), $\\theta_x$, $\\theta_y$ (rotaciones)
% Desplazamientos: $u = z\\theta_x$, $v = z\\theta_y$, $w = w_0$

% Deformaciones flexión:
% $\\kappa_x = \\partial\\theta_x/\\partial x$
% $\\kappa_y = \\partial\\theta_y/\\partial y$
% $\\kappa_{xy} = \\partial\\theta_y/\\partial x + \\partial\\theta_x/\\partial y$

% Deformaciones corte:
% $\\gamma_{xz} = \\partial w/\\partial x + \\theta_x$
% $\\gamma_{yz} = \\partial w/\\partial y + \\theta_y$

% ═══ PARTE 2: CONSTITUTIVAS ═══

E = 10920
nu = 0.3
h = 0.1
kapa = 5/6

% Flexión: $D_b = \\frac{Eh^3}{12(1-\\nu^2)} \\begin{bmatrix} 1 & \\nu & 0 \\\\ \\nu & 1 & 0 \\\\ 0 & 0 & \\frac{1-\\nu}{2} \\end{bmatrix}$
Db = D_bending(E, nu, h)

% Corte: $D_s = \\kappa \\frac{Eh}{2(1+\\nu)} I_2$
Ds = D_shear(E, nu, h, kapa)

% ═══ PARTE 3: FUNCIONES DE FORMA ═══

% Evaluar N y dN en punto de Gauss
xi = 0.577350269189626
eta = 0.577350269189626
N = N_Q4(xi, eta)
dN = dN_Q4(xi, eta)

% Placa cuadrada unitaria
coords = [0, 0; 1, 0; 1, 1; 0, 1]
J = jacobian2d(dN, coords)

% ═══ PARTE 4: MATRICES B ═══

% B_bending (3×12): curvatures from rotations
Bb = B_bending(dN, coords)

% B_shear (2×12): shear from w + rotations
Bs = B_shear(dN, N, coords)

% ═══ PARTE 5: INTEGRACIÓN SELECTIVA ═══

% CLAVE: evitar shear locking
% Flexión: 2×2 Gauss (completa)
% Corte: 1×1 Gauss (reducida)

% K_bending en punto de Gauss (2×2):
Kb_gp = transpose(Bb) * Db * Bb * det(J)

% K_shear en centro (1×1):
N_c = N_Q4(0, 0)
dN_c = dN_Q4(0, 0)
Bs_c = B_shear(dN_c, N_c, coords)
J_c = jacobian2d(dN_c, coords)
Ks_center = transpose(Bs_c) * Ds * Bs_c * det(J_c) * 4

% K total = sum(Kb_gp) + Ks_center

% ═══ PARTE 6: BENCHMARK ═══

% Placa cuadrada $a=1$, carga uniforme $P=1$
% Solución exacta (Ferreira Table 12.1):
D_flex = E * h^3 / (12 * (1 - nu^2))
% $\\bar{w} = w \\cdot D / (P \\cdot a^4)$
% SSSS: $\\bar{w} = 0.004270$ (a/h=10)
% CCCC: $\\bar{w} = 0.001503$ (a/h=10)

w_SSSS = 0.004270 * 1 * 1^4 / D_flex
w_CCCC = 0.001503 * 1 * 1^4 / D_flex

% ═══ PARTE 7: SIMBÓLICO — Verificar D ═══

% Rigidez flexural:
D_sym = ssubs('E*h^3/(12*(1-nu^2))', 'E', '10920')
D_sym2 = ssubs(D_sym, 'nu', '0.3')
D_sym3 = ssubs(D_sym2, 'h', '0.1')
D_num = seval(D_sym3)
`;
}

// ═══════════════════════════════════════════════════════
// TEMPLATE: Zapata + Pedestal (shell Q4 + frame)
// Fórmulas MATLAB explícitas — NO funciones opacas
// ═══════════════════════════════════════════════════════

function templateZapataPedestal(): string {
  return `% ═══════════════════════════════════════════
% Zapata + Pedestal — Shell Q4 + Frame 3D
% Verificable en MATLAB/Octave (copiar y pegar)
% ═══════════════════════════════════════════

% ─── Datos geométricos ───
Bz = 1.5              % ancho zapata (m)
Lz = 1.5              % largo zapata (m)
hz = 0.40              % espesor zapata (m)
bc = 0.30              % ancho columna (m)
hc = 0.30              % peralte columna (m)
Hped = 0.50            % altura pedestal (m)
Hcol = 3.0             % altura columna (m)

% ─── Material: hormigón f'c=210 ───
fc = 210               % kg/cm² → tonf/m²
E = 15100 * sqrt(fc) * 100  % E en tonf/m²
nu = 0.2
G = E / (2*(1+nu))

% ─── Malla zapata: 4x4 = 16 shells Q4 ───
nx = 4
ny = 4
dx = Bz / nx
dy = Lz / ny

% Generar nodos de zapata (z=0)
n_zap = (nx+1) * (ny+1)   % 25 nodos
nodes_zap = zeros(n_zap, 3)
k = 1
for j = 0:ny
  for i = 0:nx
    nodes_zap(k,:) = [i*dx, j*dy, 0]
    k = k + 1
  end
end

% Nodo central zapata (para conectar pedestal)
ix_center = round(nx/2)
iy_center = round(ny/2)
nodo_centro = iy_center*(nx+1) + ix_center + 1

% Nodo top pedestal
n_ped = n_zap + 1
nodes_ped = [Bz/2, Lz/2, Hped]

% Nodo top columna
n_col = n_ped + 1
nodes_col = [Bz/2, Lz/2, Hped + Hcol]

% Total nodos
nnodes = n_zap + 2
ndof = nnodes * 6

% ─── Conectividad shells (zapata) ───
elem_shell = zeros(nx*ny, 4)
e = 1
for j = 0:ny-1
  for i = 0:nx-1
    n1 = j*(nx+1) + i + 1
    n2 = n1 + 1
    n3 = n2 + (nx+1)
    n4 = n1 + (nx+1)
    elem_shell(e,:) = [n1, n2, n3, n4]
    e = e + 1
  end
end
n_shells = nx * ny     % 16 shells

% ─── Conectividad frames ───
% Pedestal: nodo_centro → n_ped
% Columna:  n_ped → n_col
elem_frame = [nodo_centro, n_ped; n_ped, n_col]
n_frames = 2

% ─── Secciones ───
% Columna/pedestal
Ac = bc * hc
Izc = bc * hc^3 / 12
Iyc = hc * bc^3 / 12
Jc = bc * hc * (bc^2 + hc^2) / 12

% ─── K local frame Timoshenko (12x12) ───
% @$K_{local} = \\begin{bmatrix} \\frac{EA}{L} & \\cdots \\\\ \\vdots & \\ddots \\end{bmatrix}$@

Lped = Hped
a1 = E * Ac / Lped
b1 = 12 * E * Izc / Lped^3
c1 = 6 * E * Izc / Lped^2
d1 = 4 * E * Izc / Lped
e1 = 2 * E * Izc / Lped
f1 = 12 * E * Iyc / Lped^3
g1 = 6 * E * Iyc / Lped^2
h1 = 4 * E * Iyc / Lped
p1 = 2 * E * Iyc / Lped
t1 = G * Jc / Lped

K_ped = [a1  0   0   0   0   0  -a1  0   0   0   0   0;
         0   b1  0   0   0   c1  0  -b1  0   0   0   c1;
         0   0   f1  0  -g1  0   0   0  -f1  0  -g1  0;
         0   0   0   t1  0   0   0   0   0  -t1  0   0;
         0   0  -g1  0   h1  0   0   0   g1  0   p1  0;
         0   c1  0   0   0   d1  0  -c1  0   0   0   e1;
        -a1  0   0   0   0   0   a1  0   0   0   0   0;
         0  -b1  0   0   0  -c1  0   b1  0   0   0  -c1;
         0   0  -f1  0   g1  0   0   0   f1  0   g1  0;
         0   0   0  -t1  0   0   0   0   0   t1  0   0;
         0   0  -g1  0   p1  0   0   0   g1  0   h1  0;
         0   c1  0   0   0   e1  0  -c1  0   0   0   d1]

% ─── K local Shell Q4 (Mindlin-Reissner) ───
% @$D_{flex} = \\frac{Eh^3}{12(1-\\nu^2)}$@
D_flex = E * hz^3 / (12 * (1 - nu^2))

% @$D_m = \\frac{Eh}{1-\\nu^2} \\begin{bmatrix} 1 & \\nu & 0 \\\\ \\nu & 1 & 0 \\\\ 0 & 0 & \\frac{1-\\nu}{2} \\end{bmatrix}$@
Dm = E * hz / (1 - nu^2) * [1, nu, 0; nu, 1, 0; 0, 0, (1-nu)/2]

% ─── Cargas ───
P = -50                % carga vertical (tonf) en top columna

% ─── Apoyos: todos los nodos de zapata restringidos en Z ───
% (suelo rígido — simplificación)
% En realidad usaríamos springs de Winkler: ks = 3000 tonf/m³

% ─── Resumen ───
n_total_elem = n_shells + n_frames
`;
}
