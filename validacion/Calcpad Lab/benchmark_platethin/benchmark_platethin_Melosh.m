% =========================================================================
% Rectangular Slab FEA — formulación Melosh ACM (DKE-like) — Calcpad-Lab
% =========================================================================
% Mismo problema que demo_rectangular_slab_fea.m PERO con el elemento
% que usa SAP 2000 (DKE/DSE de Wilson, 3 GDL/nodo).
%
% Elemento Melosh non-conforming rectangular Kirchhoff plate:
%   - 4 nodos × 3 GDL = 12 GDL/elemento
%   - GDLs por nodo: w, β_x=∂w/∂x, β_y=∂w/∂y
%   - Polinomio cúbico incompleto (12 monomios) en w(x,y)
%   - C0 continuo (NO C1 — non-conforming)
%
% Ref: Wilson E.L. cap. 8 + Cook,Malkus,Plesha cap. 12.7
%
% Diferencia clave con BFS Q4:
%   BFS Q4: 16 GDL, agrega ψ=∂²w/∂x∂y → captura twist en esquinas
%   Melosh:  12 GDL, sin ψ → twist subestimado (típico SAP 2000)
%
% Resultado SAP 2000 esperado:
%   w_centro=6.529 mm, M_x=6.22, M_y=12.76, M_xy(esquina)=±7.25
% =========================================================================
t_total = tic;

%% Datos de entrada (idénticos al ejemplo Calcpad oficial)
a  = 6
b  = 4
t  = 0.1
q  = 10
E  = 35e6
nu = 0.15

%% Malla 6×4
n_a = 6
n_b = 4
n_e = n_a*n_b
n_j = (n_a+1)*(n_b+1)
n_dof = 3                          % w, β_x, β_y
n_k = n_dof*4                      % 12
a_1 = a/n_a
b_1 = b/n_b
n_g = n_dof*n_j

% Coordenadas de nodos (mismo orden Calcpad)
x_j = zeros(n_j, 1);
y_j = zeros(n_j, 1);
x = 0; y = 0;
for j = 1:n_j
    x_j(j) = x;
    y_j(j) = y;
    y = y + b_1;
    if y > b + 1e-9
        y = 0;
        x = x + a_1;
    end
end

% Conectividad
e_j = zeros(n_e, 4);
for ia = 1:n_a
    for ib = 1:n_b
        e = ib + n_b*(ia-1);
        j_corner = e + ia - 1;
        e_j(e, 1) = j_corner;
        e_j(e, 2) = j_corner + n_b + 1;
        e_j(e, 3) = j_corner + n_b + 2;
        e_j(e, 4) = j_corner + 1;
    end
end

%% Apoyos perimetrales (idéntico al BFS)
n_s = 2*(n_a + n_b)
s_j = zeros(n_s, 1);
i_s = 0;
for i = 1:n_a+1
    j = (n_b+1)*i - n_b;
    i_s = i_s + 1;
    s_j(i_s) = j;
end
for i = 1:n_a+1
    j = (n_b+1)*i;
    i_s = i_s + 1;
    s_j(i_s) = j;
end
for i = 2:n_b
    j = i;
    i_s = i_s + 1;
    s_j(i_s) = j;
end
for i = 2:n_b
    j = n_a*(n_b+1) + i;
    i_s = i_s + 1;
    s_j(i_s) = j;
end

%% Matriz constitutiva D
D11 = E*t^3/(12*(1-nu^2))
D = D11 * [1, nu, 0; nu, 1, 0; 0, 0, (1-nu)/2]

%% Cuadratura 2×2 Gauss en [-1, +1] (la que usa SAP 2000)
gp2 = [-0.5773502691896257, 0.5773502691896257];
gw2 = [1.0, 1.0];

%% Element K_e y F_e — Melosh ACM 12-DOF
% Mapping: x_local = a_h*xi, y_local = b_h*eta  (xi, eta in [-1, +1])
% Half-lengths: a_h = a_1/2, b_h = b_1/2
a_h = a_1/2;
b_h = b_1/2;
K_e = zeros(n_k, n_k);
F_e = zeros(n_k, 1);

% Local node coords (ξ_i, η_i) en el orden 1=BL, 2=BR, 3=TR, 4=TL
xi_n  = [-1,  1, 1, -1];
eta_n = [-1, -1, 1,  1];

for ig = 1:2
    for jg = 1:2
        xi = gp2(ig);
        eta = gp2(jg);
        wgt = gw2(ig)*gw2(jg);

        % N vector (1×12) y filas de B (cada una 1×12)
        N_row = zeros(1, n_k);
        Bxx = zeros(1, n_k);
        Byy = zeros(1, n_k);
        Bxy = zeros(1, n_k);
        for k = 1:4
            si = xi_n(k);
            ti = eta_n(k);
            c = 1 + si*xi;
            d = 1 + ti*eta;
            en = 2 + si*xi + ti*eta - xi^2 - eta^2;
            % Shape functions
            Nw_k = c*d*en / 8;
            Nx_k = (a_h/8) * si * c^2 * (si*xi - 1) * d;
            Ny_k = (b_h/8) * ti * c * d^2 * (ti*eta - 1);
            % 2nd partials in (ξ,η)
            d2Nw_dxi2   = -3*si*xi*d / 4;
            d2Nw_deta2  = -3*ti*eta*c / 4;
            d2Nw_dxieta = (si*ti*en + ti*c*(si - 2*xi) + d*si*(ti - 2*eta)) / 8;
            d2Nx_dxi2   = (a_h/4) * d * si * (3*si*xi + 1);
            d2Nx_deta2  = 0;
            d2Nx_dxieta = (a_h/8) * ti * c * (3*si*xi - 1);
            d2Ny_dxi2   = 0;
            d2Ny_deta2  = (b_h/4) * c * ti * (3*ti*eta + 1);
            d2Ny_dxieta = (b_h/8) * si * d * (3*ti*eta - 1);
            % Físicas: ∂²/∂x² = (1/a_h²) ∂²/∂ξ²; ∂²/∂y² = (1/b_h²) ∂²/∂η²
            %         ∂²/∂x∂y = (1/(a_h·b_h)) ∂²/∂ξ∂η
            idx = 3*(k-1);
            N_row(idx+1) = Nw_k;
            N_row(idx+2) = Nx_k;
            N_row(idx+3) = Ny_k;
            Bxx(idx+1) = d2Nw_dxi2 / (a_h*a_h);
            Bxx(idx+2) = d2Nx_dxi2 / (a_h*a_h);
            Bxx(idx+3) = d2Ny_dxi2 / (a_h*a_h);
            Byy(idx+1) = d2Nw_deta2 / (b_h*b_h);
            Byy(idx+2) = d2Nx_deta2 / (b_h*b_h);
            Byy(idx+3) = d2Ny_deta2 / (b_h*b_h);
            Bxy(idx+1) = d2Nw_dxieta / (a_h*b_h);
            Bxy(idx+2) = d2Nx_dxieta / (a_h*b_h);
            Bxy(idx+3) = d2Ny_dxieta / (a_h*b_h);
        end
        % B(3×12): filas = [κ_x; κ_y; κ_xy] (sin signo; M = -D·B·Z después)
        B = [Bxx; Byy; 2*Bxy];
        % Jacobiano dx dy = a_h*b_h dξ dη
        K_e = K_e + (B')*D*B * (a_h*b_h*wgt);
        F_e = F_e + (N_row')*q * (a_h*b_h*wgt);
    end
end

%% Ensamblaje global
K = zeros(n_g, n_g);
F = zeros(n_g, 1);
for e = 1:n_e
    gdl_e = zeros(n_k, 1);
    for i = 1:4
        gi = e_j(e, i);
        for ii = 1:n_dof
            gdl_e(n_dof*(i-1)+ii) = n_dof*(gi-1) + ii;
        end
    end
    K(gdl_e, gdl_e) = K(gdl_e, gdl_e) + K_e;
    F(gdl_e) = F(gdl_e) + F_e;
end

%% Boundary conditions — exactamente como SAP 2000 s2k
% DOFs por nodo: 1=w, 2=β_x=∂w/∂x, 3=β_y=∂w/∂y
%   Corner (x=0/a AND y=0/b): w=0, β_x=0, β_y=0  (todos los 3 = 0)
%   Edge x=0/a (interior): w=0, β_y=0 (tangente Y → ∂w/∂y=0)
%   Edge y=0/b (interior): w=0, β_x=0 (tangente X → ∂w/∂x=0)
k_s = 1e20;
for i = 1:n_s
    j_n = s_j(i);
    g = n_dof*(j_n - 1);
    K(g+1, g+1) = K(g+1, g+1) + k_s;            % w siempre restringida
    is_edge_x = (x_j(j_n) <= 1e-9) || (x_j(j_n) >= a - 1e-9);
    is_edge_y = (y_j(j_n) <= 1e-9) || (y_j(j_n) >= b - 1e-9);
    if is_edge_x && is_edge_y
        K(g+2, g+2) = K(g+2, g+2) + k_s;        % β_x = 0
        K(g+3, g+3) = K(g+3, g+3) + k_s;        % β_y = 0
    elseif is_edge_x
        K(g+3, g+3) = K(g+3, g+3) + k_s;        % β_y = 0 (∂w/∂y nulo a lo largo del edge x=const)
    elseif is_edge_y
        K(g+2, g+2) = K(g+2, g+2) + k_s;        % β_x = 0
    end
end

%% Solve
Z = K \ F;

%% Postproceso: w por nodo
w_nodo = zeros(n_j, 1);
for j = 1:n_j
    w_nodo(j) = Z(n_dof*(j-1)+1);
end
w_nodo_mm = w_nodo * 1000;
j_centro = round(n_a/2)*(n_b+1) + round(n_b/2) + 1;
w_centro_mm = w_nodo_mm(j_centro)

%% Postproceso momentos: evaluar B en las 4 esquinas de cada elemento, promediar
M_j = zeros(3, n_j);
c_j = zeros(n_j, 1);
xi_n2  = [-1,  1, 1, -1];
eta_n2 = [-1, -1, 1,  1];
for e = 1:n_e
    % Extraer DOFs del elemento
    Z_e = zeros(n_k, 1);
    for i = 1:4
        gi = e_j(e, i);
        for ii = 1:n_dof
            Z_e(n_dof*(i-1)+ii) = Z(n_dof*(gi-1)+ii);
        end
    end
    % En cada esquina del elemento
    for i = 1:4
        xi = xi_n2(i);
        eta = eta_n2(i);
        Bxx = zeros(1, n_k);
        Byy = zeros(1, n_k);
        Bxy = zeros(1, n_k);
        for k = 1:4
            si = xi_n2(k);
            ti = eta_n2(k);
            c = 1 + si*xi;
            d = 1 + ti*eta;
            en = 2 + si*xi + ti*eta - xi^2 - eta^2;
            d2Nw_dxi2   = -3*si*xi*d / 4;
            d2Nw_deta2  = -3*ti*eta*c / 4;
            d2Nw_dxieta = (si*ti*en + ti*c*(si - 2*xi) + d*si*(ti - 2*eta)) / 8;
            d2Nx_dxi2   = (a_h/4) * d * si * (3*si*xi + 1);
            d2Nx_deta2  = 0;
            d2Nx_dxieta = (a_h/8) * ti * c * (3*si*xi - 1);
            d2Ny_dxi2   = 0;
            d2Ny_deta2  = (b_h/4) * c * ti * (3*ti*eta + 1);
            d2Ny_dxieta = (b_h/8) * si * d * (3*ti*eta - 1);
            idx = 3*(k-1);
            Bxx(idx+1) = d2Nw_dxi2 / (a_h*a_h);
            Bxx(idx+2) = d2Nx_dxi2 / (a_h*a_h);
            Bxx(idx+3) = d2Ny_dxi2 / (a_h*a_h);
            Byy(idx+1) = d2Nw_deta2 / (b_h*b_h);
            Byy(idx+2) = d2Nx_deta2 / (b_h*b_h);
            Byy(idx+3) = d2Ny_deta2 / (b_h*b_h);
            Bxy(idx+1) = d2Nw_dxieta / (a_h*b_h);
            Bxy(idx+2) = d2Nx_dxieta / (a_h*b_h);
            Bxy(idx+3) = d2Ny_dxieta / (a_h*b_h);
        end
        B_corner = [Bxx; Byy; 2*Bxy];
        M_local = -D * B_corner * Z_e;
        j_nod = e_j(e, i);
        M_j(1, j_nod) = M_j(1, j_nod) + M_local(1);
        M_j(2, j_nod) = M_j(2, j_nod) + M_local(2);
        M_j(3, j_nod) = M_j(3, j_nod) + M_local(3);
        c_j(j_nod) = c_j(j_nod) + 1;
    end
end
for j = 1:n_j
    if c_j(j) > 0
        M_j(1, j) = M_j(1, j) / c_j(j);
        M_j(2, j) = M_j(2, j) / c_j(j);
        M_j(3, j) = M_j(3, j) / c_j(j);
    end
end

% Grilla regular para reorganizar
Mx_grid = zeros(n_a+1, n_b+1);
My_grid = zeros(n_a+1, n_b+1);
Mxy_grid = zeros(n_a+1, n_b+1);
for i = 1:n_a+1
    for k = 1:n_b+1
        j = (i-1)*(n_b+1) + k;
        Mx_grid(i, k) = M_j(1, j);
        My_grid(i, k) = M_j(2, j);
        Mxy_grid(i, k) = M_j(3, j);
    end
end
Mx_centro = Mx_grid(round(n_a/2)+1, round(n_b/2)+1)
My_centro = My_grid(round(n_a/2)+1, round(n_b/2)+1)
Mxy_esquina = Mxy_grid(1, 1)

%% Reporte comparativo con SAP 2000
fprintf('══════════════════════════════════════════════════════════\n')
fprintf('  Rectangular Slab FEA — Melosh ACM (DKE-like, igual SAP 2000)\n')
fprintf('══════════════════════════════════════════════════════════\n')
fprintf('  Elemento     : Melosh non-conforming Q4 — 12 GDL (3/nodo)\n')
fprintf('  Equivalencia : SAP 2000 Plate-Thin (DKE/DSE de Wilson)\n')
fprintf('  Malla        : %d × %d (%d nodos, %d GDL totales)\n', n_a, n_b, n_j, n_g)
fprintf('  ──────────────────────────────────────────────────────────\n')
fprintf('                Calcpad-Lab(Melosh)   SAP 2000     Δ %%\n')
fprintf('  w_centro    :   %+8.4f mm        -6.529      %+.2f%%\n', w_centro_mm, 100*(abs(w_centro_mm)-6.529)/6.529)
fprintf('  M_x centro  :   %+8.4f kNm/m       6.22       %+.2f%%\n', Mx_centro, 100*(Mx_centro-6.22)/6.22)
fprintf('  M_y centro  :   %+8.4f kNm/m      12.76       %+.2f%%\n', My_centro, 100*(My_centro-12.76)/12.76)
fprintf('  M_xy esq.   :   %+8.4f kNm/m      -7.25       %+.2f%%\n', Mxy_esquina, 100*(abs(Mxy_esquina)-7.25)/7.25)
fprintf('  ──────────────────────────────────────────────────────────\n')
fprintf('  Tiempo total : %.3f s\n', toc(t_total))
fprintf('══════════════════════════════════════════════════════════\n')

%% Visualización — 5 figuras (igual que el BFS)
T = zeros(2*n_e, 3);
for e = 1:n_e
    T(2*e-1, 1) = e_j(e, 1); T(2*e-1, 2) = e_j(e, 2); T(2*e-1, 3) = e_j(e, 3);
    T(2*e, 1)   = e_j(e, 1); T(2*e, 2)   = e_j(e, 3); T(2*e, 3)   = e_j(e, 4);
end
V = [x_j, y_j];

figure
patch('Faces', T, 'Vertices', V, 'FaceVertexCData', w_nodo_mm, ...
      'FaceColor', 'interp', 'EdgeColor', 'none')
title(sprintf('Melosh: Deflexión w [mm] — w_{centro}=%.3f mm', w_centro_mm))
xlabel('x [m]'); ylabel('y [m]'); colorbar

figure
patch('Faces', T, 'Vertices', V, 'FaceVertexCData', M_j(1,:)', ...
      'FaceColor', 'interp', 'EdgeColor', 'none')
title(sprintf('Melosh: M_x [kNm/m] — centro=%.3f', Mx_centro))
xlabel('x [m]'); ylabel('y [m]'); colorbar

figure
patch('Faces', T, 'Vertices', V, 'FaceVertexCData', M_j(2,:)', ...
      'FaceColor', 'interp', 'EdgeColor', 'none')
title(sprintf('Melosh: M_y [kNm/m] — centro=%.3f', My_centro))
xlabel('x [m]'); ylabel('y [m]'); colorbar

figure
patch('Faces', T, 'Vertices', V, 'FaceVertexCData', M_j(3,:)', ...
      'FaceColor', 'interp', 'EdgeColor', 'none')
title(sprintf('Melosh: M_{xy} [kNm/m] — esquina=%.3f (SAP: 7.25)', Mxy_esquina))
xlabel('x [m]'); ylabel('y [m]'); colorbar

figure
trisurf(T, x_j, y_j, -w_nodo_mm, -w_nodo_mm);
title(sprintf('Melosh: Deflexión 3D — w_{centro}=%.3f mm', w_centro_mm))
xlabel('x [m]'); ylabel('y [m]'); zlabel('w [mm]')

fprintf('Done — Melosh ACM (DKE-like) con 5 figuras.\n')