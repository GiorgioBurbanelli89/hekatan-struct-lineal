%% ════════════════════════════════════════════════════════════════
%  Example 1-001 — Portal Frame self-contained verification
%
%  Reproduce el problema oficial CSi Example 1-001 (portal de 3 frames)
%  con un solver propio (sin SAP2000/ETABS API), para que pueda correrse
%  en cualquier MATLAB R2017a sin licencias adicionales.
%
%  Geometría (en pies, k-ft-F coherente):
%    Frame 1: columna  (0,0,0)  -> (0,0,10)
%    Frame 2: diagonal (0,0,10) -> (8,0,16)
%    Frame 3: viga horizontal (-4,0,10) -> (0,0,10)
%
%  Sección rectangular R1: 12"×12" de hormigón f'c = 3600 ksi (E=3600 ksf)
%    Modifier(1)=1000 (área axial), Modifier(2)=0, Modifier(3)=0 (corte
%    desactivado), el resto = 1.
%
%  BCs:
%    Base de columna 1 (0,0,0): fixed U1,U2,U3,R1 (libres R2,R3)
%    Top de frame 2 (8,0,16):    fixed U1,U2          (libres U3,R1,R2,R3)
%
%  7 casos de carga (descritos en CSi Example 1-001):
%    1: peso propio (self-weight)
%    2: puntual + distribuida sobre frame 3
%    3: puntual + momento en top de frame 2
%    4: distribuida sobre frame 2
%    5: distribuidas perpendiculares (frames 1 y 2) en local
%    6: distribuidas trapezoidales en local
%    7: carga puntual interior en frame 2 en local
%
%  IndResult (hand-calculated): valores oficiales CSi
%    1: -0.02639   2: 0.06296   3: 0.06296   4: -0.2963
%    5:  0.3125    6: 0.11556   7: 0.00651
%
%  Para los 4 primeros se extrae U3 en el top del frame 2; para los 3
%  últimos se extrae U1 en la base del frame 2 (con BC top U1=fixed).
%
%  USO: matlab -batch "example_1_001_frame_verify"
%% ════════════════════════════════════════════════════════════════

clear; clc;

%% ── Geometría / Material / Sección ──────────────────────────
% Unidades: kip, in, F (el script convierte ft -> in cuando hace falta)
E_ksi  = 3600;            % E del hormigón en ksi (= kip/in^2)
nu     = 0.2;
G_ksi  = E_ksi / (2*(1+nu));

% Sección rectangular 12in x 12in
b_in   = 12;
h_in   = 12;
A      = b_in * h_in;            % in^2
Iy     = b_in * h_in^3 / 12;     % in^4
Iz     = b_in^3 * h_in / 12;     % in^4
J_     = 0.141 * b_in^4;         % torsión rectangular cuadrada (aprox)

% Modifiers: A *= 1000, Asy=Asz=0 (corte off) — afectan la rigidez
modA   = 1000;
modAs  = 0;       % 0 desactiva contribución de corte (Bernoulli)
A_eff  = A * modA;

% Coordenadas en INCHES (1 ft = 12 in)
ft = 12;
P_base    = [  0,  0,   0]*ft;   % Frame 1 base
P_knee    = [  0,  0,  10]*ft;   % Frame 1 top  = Frame 2 i-end
P_top     = [  8,  0,  16]*ft;   % Frame 2 j-end
P_beamL   = [ -4,  0,  10]*ft;   % Frame 3 i-end (extremo izq)
% Nodos: 1=base, 2=knee, 3=top, 4=beamL
nodes = [P_base; P_knee; P_top; P_beamL];

% Frames: [n_i, n_j]
elems = [1, 2;   % Frame 1: vertical
         2, 3;   % Frame 2: diagonal
         4, 2];  % Frame 3: viga horizontal

%% ── Helper: matriz de rigidez 3D Bernoulli 12x12 ────────────
% El nodo tiene 6 DOFs (u, v, w, rx, ry, rz). Cada frame contribuye
% una Ke 12x12 ensamblada en globales por rotación T (3x3 -> 12x12).
function Kg = beam3D_global(xi, xj, E, G, A, Iy, Iz, J)
    dx = xj(1)-xi(1); dy = xj(2)-xi(2); dz = xj(3)-xi(3);
    L = sqrt(dx^2 + dy^2 + dz^2);

    EA_L  = E*A/L;
    GJ_L  = G*J/L;
    EIz_L = E*Iz/L;
    EIy_L = E*Iy/L;

    % Ke en sistema local (12x12)
    Ke = zeros(12, 12);
    Ke(1,1) =  EA_L;    Ke(1,7)  = -EA_L;
    Ke(7,1) = -EA_L;    Ke(7,7)  =  EA_L;
    Ke(4,4) =  GJ_L;    Ke(4,10) = -GJ_L;
    Ke(10,4)= -GJ_L;    Ke(10,10)=  GJ_L;
    % bending sobre eje y local (DOFs v=2, ry=6; v'=8, ry'=12)
    bz = [12*EIz_L/L^2, 6*EIz_L/L, -12*EIz_L/L^2, 6*EIz_L/L;
           6*EIz_L/L,   4*EIz_L,    -6*EIz_L/L,   2*EIz_L;
         -12*EIz_L/L^2,-6*EIz_L/L,  12*EIz_L/L^2,-6*EIz_L/L;
           6*EIz_L/L,   2*EIz_L,    -6*EIz_L/L,   4*EIz_L];
    idx_bz = [2, 6, 8, 12];
    for ii=1:4; for jj=1:4
        Ke(idx_bz(ii), idx_bz(jj)) = Ke(idx_bz(ii), idx_bz(jj)) + bz(ii,jj);
    end; end
    % bending sobre eje z local (DOFs w=3, rz=5; w'=9, rz'=11)
    by = [12*EIy_L/L^2, -6*EIy_L/L, -12*EIy_L/L^2, -6*EIy_L/L;
          -6*EIy_L/L,   4*EIy_L,     6*EIy_L/L,    2*EIy_L;
         -12*EIy_L/L^2, 6*EIy_L/L,  12*EIy_L/L^2,  6*EIy_L/L;
          -6*EIy_L/L,   2*EIy_L,     6*EIy_L/L,    4*EIy_L];
    idx_by = [3, 5, 9, 11];
    for ii=1:4; for jj=1:4
        Ke(idx_by(ii), idx_by(jj)) = Ke(idx_by(ii), idx_by(jj)) + by(ii,jj);
    end; end

    % Convención CSi/SAP2000/ETABS:
    %   axis 1 (ex) = a lo largo del miembro (i → j)
    %   axis 2 (ey) = proyección de +Z global sobre plano perp a ex.
    %                 Si miembro vertical: ey = +X global.
    %   axis 3 (ez) = ex × ey
    ex = [dx, dy, dz] / L;
    if abs(ex(3)) > 0.99
        ey = [1, 0, 0];                       % vertical: ey = +X
    else
        proj = ex(3);                          % ex · [0,0,1]
        ey = [-proj*ex(1), -proj*ex(2), 1 - proj*ex(3)];
        ey = ey / norm(ey);
    end
    ez = cross(ex, ey);
    R = [ex; ey; ez];

    T = zeros(12, 12);
    T(1:3, 1:3)     = R;
    T(4:6, 4:6)     = R;
    T(7:9, 7:9)     = R;
    T(10:12, 10:12) = R;

    Kg = transpose(T) * Ke * T;
end

%% ── Ensamble K global (4 nodos * 6 DOF = 24) ────────────────
n_nodes = 4;
n_dof   = 6 * n_nodes;
K = zeros(n_dof, n_dof);

for e = 1:size(elems, 1)
    ni = elems(e, 1);  nj = elems(e, 2);
    xi = nodes(ni, :); xj = nodes(nj, :);
    Kg = beam3D_global(xi, xj, E_ksi, G_ksi, A_eff, Iy, Iz, J_);
    dofs = [6*(ni-1)+1 : 6*ni,  6*(nj-1)+1 : 6*nj];
    for ii=1:12; for jj=1:12
        K(dofs(ii), dofs(jj)) = K(dofs(ii), dofs(jj)) + Kg(ii, jj);
    end; end
end

%% ── BCs (penalización) ──────────────────────────────────────
% Base de Frame 1 (nodo 1): fixed U1,U2,U3,R1 (libres R2,R3)
kp = 1e10;
base_fix = [1,2,3,4];
for d = base_fix
    K(6*(1-1)+d, 6*(1-1)+d) = K(6*(1-1)+d, 6*(1-1)+d) + kp;
end
% Top de Frame 2 (nodo 3): fixed U1,U2 (libres U3,R1,R2,R3)
top_fix = [1,2];
for d = top_fix
    K(6*(3-1)+d, 6*(3-1)+d) = K(6*(3-1)+d, 6*(3-1)+d) + kp;
end

%% ── 7 vectores de carga ─────────────────────────────────────
F_cases = zeros(n_dof, 7);

% Helper: fuerza puntual P al nodo n en DOF local d
% (d: 1=U1, 2=U2, 3=U3, 4=R1, 5=R2, 6=R3)
function F = apply_pt(F, n, d, val)
    F(6*(n-1)+d) = F(6*(n-1)+d) + val;
end

% Helper: equivalentes nodales CONSISTENTES (con momentos) para carga
% trapezoidal q_i → q_j en frame n_i → n_j. Replica las fórmulas clásicas
% fixed-end (incluye q*L^2/12 momentos para uniforme, fórmula trapezoid
% L^2(3q_i+2q_j)/60 y -L^2(2q_i+3q_j)/60 para extremos).
% IMPORTANTE: usa convención CSi para ejes locales (igual que beam3D_global).
function F = apply_dist(F, nodes_arr, n_i, n_j, q_ix, q_iy, q_iz, q_jx, q_jy, q_jz, frame)
    xi_ = nodes_arr(n_i, :); xj_ = nodes_arr(n_j, :);
    dvec = xj_ - xi_; L = norm(dvec); ex = dvec / L;
    if abs(ex(3)) > 0.99
        ey = [1, 0, 0];
    else
        proj = ex(3);
        ey = [-proj*ex(1), -proj*ex(2), 1 - proj*ex(3)];
        ey = ey / norm(ey);
    end
    ez = cross(ex, ey);
    R = [ex; ey; ez];
    % Convertir a componentes locales
    if strcmp(frame, 'Global')
        q_i_g = [q_ix, q_iy, q_iz]; q_j_g = [q_jx, q_jy, q_jz];
        qx_i = dot(q_i_g, ex); qy_i = dot(q_i_g, ey); qz_i = dot(q_i_g, ez);
        qx_j = dot(q_j_g, ex); qy_j = dot(q_j_g, ey); qz_j = dot(q_j_g, ez);
    else
        qx_i = q_ix; qy_i = q_iy; qz_i = q_iz;
        qx_j = q_jx; qy_j = q_jy; qz_j = q_jz;
    end
    % Fixed-end forces locales (DOFs por extremo: Fx, Fy, Fz, Mx, My, Mz)
    fe_i = zeros(1,6); fe_j = zeros(1,6);
    % Axial
    fe_i(1) = L * (2*qx_i + qx_j) / 6;
    fe_j(1) = L * (qx_i + 2*qx_j) / 6;
    % Carga local Y → bending sobre Mz local (axis 6)
    fe_i(2) = L * (7*qy_i + 3*qy_j) / 20;
    fe_j(2) = L * (3*qy_i + 7*qy_j) / 20;
    fe_i(6) = +L^2 * (3*qy_i + 2*qy_j) / 60;
    fe_j(6) = -L^2 * (2*qy_i + 3*qy_j) / 60;
    % Carga local Z → bending sobre My local (axis 5, signo cambia)
    fe_i(3) = L * (7*qz_i + 3*qz_j) / 20;
    fe_j(3) = L * (3*qz_i + 7*qz_j) / 20;
    fe_i(5) = -L^2 * (3*qz_i + 2*qz_j) / 60;
    fe_j(5) = +L^2 * (2*qz_i + 3*qz_j) / 60;
    % Rotar a global: f_global = R^T * f_local (force y moment por separado)
    fg_iF = (R' * fe_i(1:3)')'; fg_iM = (R' * fe_i(4:6)')';
    fg_jF = (R' * fe_j(1:3)')'; fg_jM = (R' * fe_j(4:6)')';
    for d = 1:3
        F(6*(n_i-1)+d)   = F(6*(n_i-1)+d)   + fg_iF(d);
        F(6*(n_i-1)+3+d) = F(6*(n_i-1)+3+d) + fg_iM(d);
        F(6*(n_j-1)+d)   = F(6*(n_j-1)+d)   + fg_jF(d);
        F(6*(n_j-1)+3+d) = F(6*(n_j-1)+3+d) + fg_jM(d);
    end
end

% NOTA UNIDADES: CSi Example 1-001 verbatim define cargas en kip/ft y momentos
% en kip-ft. Como el modelo usa INCHES, convertimos: dist /12, momentos *12.

% ── Load Pattern 1: self-weight (gravity, multiplier=1, unit weight=150 pcf)
gamma = 150 / 12^3 / 1000;        % pcf -> kip/in^3
A_geom = b_in * h_in;
for e = 1:size(elems, 1)
    n_i = elems(e, 1); n_j = elems(e, 2);
    w_load = gamma * A_geom;       % kip/in (en -Z global)
    F_cases(:, 1) = apply_dist(F_cases(:, 1), nodes, n_i, n_j, ...
                               0, 0, -w_load, 0, 0, -w_load, 'Global');
end

% ── Load Pattern 2: -10 kip puntual U3 al i-end de Frame 3 (= nodo 4),
%    + 1.8 kip/ft GRAVITY (Dir=10 = global -Z, NOT +Z) sobre Frame 3
F_cases(6*(4-1)+3, 2) = F_cases(6*(4-1)+3, 2) - 10;
F_cases(:, 2) = apply_dist(F_cases(:, 2), nodes, 4, 2, ...
                            0, 0, -1.8/12, 0, 0, -1.8/12, 'Global');

% ── Load Pattern 3: PointName2 of Frame 3 = NODO 2 (knee, NO nodo 3).
%    -17.2 kip U3 y -54.4 kip-ft R2 (×12 → kip-in)
F_cases(6*(2-1)+3, 3) = F_cases(6*(2-1)+3, 3) - 17.2;
F_cases(6*(2-1)+5, 3) = F_cases(6*(2-1)+5, 3) - 54.4*12;

% ── Load Pattern 4: PROJECTED GRAVITY (Dir=11) sobre Frame 2.
%    2 kip/ft por unidad de proyección horizontal. Frame 2: L_proj=8ft, L=10ft.
%    → q_actual = 2 × (L_proj/L) = 1.6 kip/ft en -Z global uniforme.
xi_p4 = nodes(2,:); xj_p4 = nodes(3,:);
dvec_p4 = xj_p4 - xi_p4;
L_p4 = norm(dvec_p4);
L_proj_xy_p4 = sqrt(dvec_p4(1)^2 + dvec_p4(2)^2);
q_pg = 2/12 * (L_proj_xy_p4 / L_p4);     % kip/in actual
F_cases(:, 4) = apply_dist(F_cases(:, 4), nodes, 2, 3, ...
                            0, 0, -q_pg, 0, 0, -q_pg, 'Global');

% ── Load Pattern 5: 2 kip/ft local axis 2 sobre Frame 1, -2 sobre Frame 2
F_cases(:, 5) = apply_dist(F_cases(:, 5), nodes, 1, 2, 0,  2/12, 0, 0,  2/12, 0, 'Local');
F_cases(:, 5) = apply_dist(F_cases(:, 5), nodes, 2, 3, 0, -2/12, 0, 0, -2/12, 0, 'Local');

% ── Load Pattern 6: trapezoidales locales kip/ft (/12)
F_cases(:, 6) = apply_dist(F_cases(:, 6), nodes, 1, 2, 0,  0.9984/12, 0, 0,  0.3744/12, 0, 'Local');
F_cases(:, 6) = apply_dist(F_cases(:, 6), nodes, 2, 3, 0, -0.3744/12, 0, 0,  0,         0, 'Local');

% ── Load Pattern 7: -15 kip punto interior mid-span Frame 2 (local axis 2).
% Fixed-end equivalente: F_i = F_j = P/2; M_i = +P*L/8, M_j = -P*L/8 (Mz local).
xi_p7 = nodes(2,:); xj_p7 = nodes(3,:);
ex_p7 = (xj_p7 - xi_p7) / norm(xj_p7 - xi_p7);
if abs(ex_p7(3)) > 0.99
    ey_p7 = [1, 0, 0];
else
    proj7 = ex_p7(3);
    ey_p7 = [-proj7*ex_p7(1), -proj7*ex_p7(2), 1 - proj7*ex_p7(3)];
    ey_p7 = ey_p7 / norm(ey_p7);
end
ez_p7 = cross(ex_p7, ey_p7);
R_p7 = [ex_p7; ey_p7; ez_p7];
P_y = -15;
L_p7 = norm(xj_p7 - xi_p7);
fe_i_p7 = zeros(1,6); fe_j_p7 = zeros(1,6);
fe_i_p7(2) = P_y / 2;
fe_j_p7(2) = P_y / 2;
fe_i_p7(6) = +P_y * L_p7 / 8;
fe_j_p7(6) = -P_y * L_p7 / 8;
fg_i_F = (R_p7' * fe_i_p7(1:3)')'; fg_i_M = (R_p7' * fe_i_p7(4:6)')';
fg_j_F = (R_p7' * fe_j_p7(1:3)')'; fg_j_M = (R_p7' * fe_j_p7(4:6)')';
for d = 1:3
    F_cases(6*(2-1)+d, 7)   = F_cases(6*(2-1)+d, 7)   + fg_i_F(d);
    F_cases(6*(2-1)+3+d, 7) = F_cases(6*(2-1)+3+d, 7) + fg_i_M(d);
    F_cases(6*(3-1)+d, 7)   = F_cases(6*(3-1)+d, 7)   + fg_j_F(d);
    F_cases(6*(3-1)+3+d, 7) = F_cases(6*(3-1)+3+d, 7) + fg_j_M(d);
end

%% ── Resolver ────────────────────────────────────────────────
U_all = inv(K) * F_cases;

%% ── Extraer respuesta como Example 1-001 ────────────────────
% Para casos 1..4 -> U3 (DOF 3) del top de frame 2 (= nodo 3)
% Para casos 5..7 -> U1 (DOF 1) del knee de frame 2 (= nodo 2)
SapResult_mat = zeros(7, 1);
for i = 1:7
    if i <= 4
        SapResult_mat(i) = U_all(6*(3-1)+3, i);   % U3 nodo 3
    else
        SapResult_mat(i) = U_all(6*(2-1)+1, i);   % U1 nodo 2
    end
end

%% ── IndResult (oficial CSi) ─────────────────────────────────
IndResult = zeros(7, 1);
IndResult(1) = -0.02639;
IndResult(2) =  0.06296;
IndResult(3) =  0.06296;
IndResult(4) = -0.2963;
IndResult(5) =  0.3125;
IndResult(6) =  0.11556;
IndResult(7) =  0.00651;

%% ── PercentDiff ─────────────────────────────────────────────
PercentDiff = (SapResult_mat ./ IndResult) - 1;

%% ── Display ─────────────────────────────────────────────────
fprintf('Example 1-001 Portal Frame — MATLAB self-contained solver\n');
fprintf('═══════════════════════════════════════════════════════════\n');
fprintf('  Case   MATLAB result      IndResult (CSi)     PercentDiff\n');
fprintf('  ───────────────────────────────────────────────────────────\n');
for i = 1:7
    fprintf('   %d   %14.6f    %14.6f    %+10.4f%%\n', ...
            i, SapResult_mat(i), IndResult(i), PercentDiff(i)*100);
end
fprintf('\n');
fprintf('  Max |PercentDiff| = %.3f%%\n', max(abs(PercentDiff))*100);

SapResult   = SapResult_mat;  %#ok<NASGU>
SapResult     %#ok<NOPTS>
IndResult     %#ok<NOPTS>
PercentDiff   %#ok<NOPTS>
