function ke = q4_shell_thin(E, nu, t, ce)
% q4_shell_thin  Matriz de rigidez Q4 SHELL Kirchhoff (membrana + flexión)
%   ke = q4_shell_thin(E, nu, t, ce)
%
% Uso típico: muros y losas DELGADAS donde t/L < 1/20 que trabajan tanto en su
% plano (membrana) como fuera del plano (flexión). Equivale a ETABS "ShellThin".
%
% Parámetros:
%   E, nu : material
%   t     : espesor (m)
%   ce    : 4x2 coords en plano local (x, y) o (x, z) en CCW
%
% Salida:
%   ke    : 24x24 matriz de rigidez local
%           DOFs por nodo: [u, v, w, theta_x, theta_y, theta_z]
%
% Construcción: superposición de Q4 plane stress (membrana) + Q4 placa Kirchhoff
% (out-of-plane). Los 6 DOFs por nodo se ordenan estilo Hekatan.
% theta_z (drilling DOF) se le asigna una rigidez pequeña (alphaDrill * Ke_max)
% para evitar singularidad — convención común en shells lineales.
%
% Compatible: MATLAB R2017a y Hekatan Lab modo MATLAB.

% --- Membrana (plane stress 2D) — DOFs (u, v) por nodo, 8x8 ---
ke_m = q4_membrane(E, nu, t, ce);

% --- Flexión Kirchhoff Q4 — DOFs (w, thx, thy) por nodo, 12x12 ---
ke_b = q4_plate_thin(E, nu, t, ce);

% --- Drilling stiffness mínima (theta_z) ---
% alpha es un coeficiente pequeño relativo a la rigidez de membrana,
% evita singularidad sin afectar resultados razonablemente.
alphaDrill = 1e-3;
k_drill_diag = alphaDrill * max(abs(diag(ke_m)));

% --- Ensamblar 24x24 con DOFs [u, v, w, thx, thy, thz] por nodo ---
ke = zeros(24, 24);
for k = 1:4
  for j = 1:4
    % Membrana: indices locales (k-1)*2+1, (k-1)*2+2 → globales (k-1)*6+1, +2
    rowM = (k-1)*2;  rowG = (k-1)*6;
    colM = (j-1)*2;  colG = (j-1)*6;
    ke(rowG+1, colG+1) = ke(rowG+1, colG+1) + ke_m(rowM+1, colM+1);
    ke(rowG+1, colG+2) = ke(rowG+1, colG+2) + ke_m(rowM+1, colM+2);
    ke(rowG+2, colG+1) = ke(rowG+2, colG+1) + ke_m(rowM+2, colM+1);
    ke(rowG+2, colG+2) = ke(rowG+2, colG+2) + ke_m(rowM+2, colM+2);
    % Flexión: indices locales (k-1)*3+1..3 → globales (k-1)*6+3..5
    rowB = (k-1)*3;  rowG2 = (k-1)*6 + 2;
    colB = (j-1)*3;  colG2 = (j-1)*6 + 2;
    for ii = 1:3
      for jj = 1:3
        ke(rowG2+ii, colG2+jj) = ke(rowG2+ii, colG2+jj) + ke_b(rowB+ii, colB+jj);
      end
    end
  end
  % Drilling: theta_z = DOF (k-1)*6+6 (sin acoplamiento)
  ke((k-1)*6+6, (k-1)*6+6) = k_drill_diag;
end
end
