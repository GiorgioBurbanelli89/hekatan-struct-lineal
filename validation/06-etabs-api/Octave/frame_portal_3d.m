% Frame 3D Portal — Replica del Test 2 de HekatanLab CLI
% =======================================================
%
% Validación cruzada: HekatanLab (hekatan-fem) vs Octave 10.1.0.
% Mismo modelo exacto, ambos resuelven el sistema lineal K·u = F.
%
% Modelo: portal 5m × 3m alto, 2 columnas + 1 viga, carga lateral 10 kN.
%
% HekatanLab Test 2 reportó (de cli.ts):
%   Node 1: ux=?  uz=?  ry=?  ...  (capturar y comparar)

clear all; close all; clc;

% ── Material y secciones ─────────────────────────────────────
E  = 2.1e5;     % kN/m^2 (210 GPa)
nu = 0.297;     % calculado de G = E/(2(1+nu))
G  = 8.1e4;     % kN/m^2
A  = 0.04;      % m^2
Iy = 1.33e-4;   % m^4
Iz = 1.33e-4;   % m^4
J  = 2.66e-4;   % m^4

% ── Nodes ────────────────────────────────────────────────
nodes = [
  0, 0, 0;     % 0 - base izquierda
  0, 0, 3;     % 1 - tope izquierdo (carga aquí)
  5, 0, 3;     % 2 - tope derecho
  5, 0, 0;     % 3 - base derecha
];
N_nodes = size(nodes, 1);
N_dof = 6 * N_nodes;

% ── Elements [n1, n2] ────────────────────────────────────
elements = [
  0, 1;   % col izq
  1, 2;   % viga
  2, 3;   % col der
];
N_el = size(elements, 1);

% ── Funciones helpers ────────────────────────────────────
function ke = local_k(L, E, A, Iy, Iz, J, G)
  EA_L  = E*A/L;
  GJ_L  = G*J/L;
  EIz_L = E*Iz/L;
  EIy_L = E*Iy/L;
  ke = zeros(12,12);
  ke(1,1)= EA_L;  ke(1,7)=-EA_L;  ke(7,1)=-EA_L;  ke(7,7)= EA_L;
  ke(4,4)= GJ_L;  ke(4,10)=-GJ_L; ke(10,4)=-GJ_L; ke(10,10)= GJ_L;
  c1 = 12*EIz_L/L^2;  c2 = 6*EIz_L/L;  c3 = 4*EIz_L;  c4 = 2*EIz_L;
  ke(2,2)= c1;  ke(2,6)= c2;  ke(2,8)=-c1;  ke(2,12)= c2;
  ke(6,2)= c2;  ke(6,6)= c3;  ke(6,8)=-c2;  ke(6,12)= c4;
  ke(8,2)=-c1;  ke(8,6)=-c2;  ke(8,8)= c1;  ke(8,12)=-c2;
  ke(12,2)= c2; ke(12,6)= c4; ke(12,8)=-c2; ke(12,12)= c3;
  d1 = 12*EIy_L/L^2;  d2 = 6*EIy_L/L;  d3 = 4*EIy_L;  d4 = 2*EIy_L;
  ke(3,3)= d1;  ke(3,5)=-d2;  ke(3,9)=-d1;  ke(3,11)=-d2;
  ke(5,3)=-d2;  ke(5,5)= d3;  ke(5,9)= d2;  ke(5,11)= d4;
  ke(9,3)=-d1;  ke(9,5)= d2;  ke(9,9)= d1;  ke(9,11)= d2;
  ke(11,3)=-d2; ke(11,5)= d4; ke(11,9)= d2; ke(11,11)= d3;
endfunction

function T = trans_matrix(p1, p2)
  p1 = p1(:); p2 = p2(:);
  L = norm(p2 - p1);
  ex = (p2 - p1) / L;
  if abs(ex(3)) > 0.9
    ref = [1; 0; 0];
  else
    ref = [0; 0; 1];
  endif
  ez = cross(ex, ref); ez = ez / norm(ez);
  ey = cross(ez, ex);
  R = [ex'; ey'; ez'];
  T = zeros(12, 12);
  for k = 0:3
    T(k*3+1:k*3+3, k*3+1:k*3+3) = R;
  endfor
endfunction

% ── Ensamblaje ───────────────────────────────────────────
K = sparse(N_dof, N_dof);

for e = 1:N_el
  n1 = elements(e,1); n2 = elements(e,2);
  p1 = nodes(n1+1,:); p2 = nodes(n2+1,:);
  L = norm(p2 - p1);
  ke = local_k(L, E, A, Iy, Iz, J, G);
  T  = trans_matrix(p1, p2);
  Kg = T' * ke * T;
  dofs = [6*n1+1 : 6*n1+6, 6*n2+1 : 6*n2+6];
  K(dofs,dofs) = K(dofs,dofs) + Kg;
endfor

% ── Cargas ───────────────────────────────────────────────
F = zeros(N_dof, 1);
F(6*1 + 1) = 10;   % nodo 1, DOF Fx (índice 6*1+1 = 7)

% ── Apoyos: nodos 0 y 3 fijos ────────────────────────────
fixed = [1:6, 19:24];   % DOFs 1..6 (nodo 0) y 19..24 (nodo 3)
free  = setdiff(1:N_dof, fixed);

% ── Solver ───────────────────────────────────────────────
u = zeros(N_dof, 1);
u(free) = K(free,free) \ F(free);

% ── Print resultados ─────────────────────────────────────
printf("\n========================================================================\n");
printf("  Frame 3D Portal — Octave 10.1 vs HekatanLab CLI\n");
printf("========================================================================\n");
printf("  Modelo: portal 5m × 3m alto, carga Fx=10 kN en tope izq.\n\n");
printf("  Nodo  |    ux           uy           uz       |   rx       ry       rz\n");
printf("  ------+-----------------------------------------+-----------------------------\n");
for n = 0:N_nodes-1
  ux = u(6*n+1); uy = u(6*n+2); uz = u(6*n+3);
  rx = u(6*n+4); ry = u(6*n+5); rz = u(6*n+6);
  printf("  N%d    | %10.4e %10.4e %10.4e | %10.4e %10.4e %10.4e\n", n, ux, uy, uz, rx, ry, rz);
endfor

% Para tabla comparativa: solo el nodo 1 (donde está la carga)
printf("\n  Comparación clave (nodo 1, donde está la carga lateral 10 kN):\n");
printf("    Octave ux (m) = %.6e\n", u(7));
printf("    Octave uz (m) = %.6e\n", u(9));
printf("    Octave ry     = %.6e\n", u(11));

% Reacciones
F_full = zeros(N_dof, 1);
F_full(free) = K(free,free) * u(free);
F_react = K * u - F;
printf("\n  Reacciones en apoyos:\n");
for n = [0, 3]
  printf("    Nodo %d: Fx=%.4f Fy=%.4f Fz=%.4f Mx=%.4f My=%.4f Mz=%.4f\n", n, ...
    F_react(6*n+1), F_react(6*n+2), F_react(6*n+3), ...
    F_react(6*n+4), F_react(6*n+5), F_react(6*n+6));
endfor

% Verificación de equilibrio: Σ Fx = 0
sumFx = F_react(1) + F_react(19);
printf("\n  Equilibrio horizontal: ΣFx_reac = %.4f, debe igualar -10 kN (carga)\n", sumFx);
printf("\n");
