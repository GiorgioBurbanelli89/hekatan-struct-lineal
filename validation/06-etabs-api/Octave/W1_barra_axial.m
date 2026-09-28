% Barra Axial Empotrada - Octave 10.1 Independent Solver
% =======================================================
%
% Validación contra solución analítica EXACTA de Hooke 1D:
%   delta = P*L / (E*A)  (homogeneo, lineal, axial puro)
%   sigma = P/A         (constante a lo largo de la barra)
%
% Modelo: barra empotrada en x=0, carga axial P en x=L.
% Mismo caso que examples/src/barra-axial/barraAxial.ts

clear all; close all; clc;

% Geometria y material
L  = 5.0;      % m
A  = 0.01;     % m^2 (10 cm x 10 cm)
E  = 2.1e8;    % kN/m^2 (210 GPa = 2.1e8 kN/m^2)
P  = 100.0;    % kN axial tracción

% Solución analítica (Hooke)
delta_analytic = P*L / (E*A);   % m
sigma_analytic = P / A;          % kN/m^2

% ── FEM 1D con N elementos ────────────────────────────────
N_el = 10;
N_nodes = N_el + 1;
dx = L / N_el;

K = sparse(N_nodes, N_nodes);
F = zeros(N_nodes, 1);

for e = 1:N_el
  ke = (E*A/dx) * [1 -1; -1 1];
  i = e;  j = e+1;
  K(i:j, i:j) = K(i:j, i:j) + ke;
endfor

% Apoyos: nodo 1 fijo
F(end) = P;
free = 2:N_nodes;
u = zeros(N_nodes, 1);
u(free) = K(free, free) \ F(free);

delta_octave = u(end);
sigma_octave = E * (u(end) - u(end-1)) / dx;

% Comparación
printf("\n========================================================================\n");
printf("  Barra Axial Hooke 1D - Octave vs Analytical\n");
printf("========================================================================\n");
printf("  L=%.2f m, A=%.4f m2, E=%.2e kN/m2, P=%.2f kN\n\n", L, A, E, P);
printf("  Cantidad           Octave              Analytical          Δ %%\n");
printf("  ----------------------------------------------------------------\n");
printf("  delta (m)          %.6e        %.6e        %.4f%%\n", delta_octave, delta_analytic, ...
  100*(delta_octave - delta_analytic)/delta_analytic);
printf("  sigma (kN/m2)      %.6e        %.6e        %.4f%%\n", sigma_octave, sigma_analytic, ...
  100*(sigma_octave - sigma_analytic)/sigma_analytic);

% Comparacion vs Hekatan WASM (esperado: 0% diff porque Hekatan usa misma formulacion lineal)
% Hekatan: barra-axial example reporta delta = 2.3810e-04 m con mismos params
hekatan_delta = 2.380952e-04;
delta_hk_diff = 100*(delta_octave - hekatan_delta)/hekatan_delta;
printf("\n  Octave vs Hekatan WASM (mismos params):\n");
printf("    Octave:  delta = %.6e m\n", delta_octave);
printf("    Hekatan: delta = %.6e m\n", hekatan_delta);
printf("    Δ%% = %.4f%%\n", delta_hk_diff);
printf("\n");
