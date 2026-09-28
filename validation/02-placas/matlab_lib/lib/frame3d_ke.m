function [ke_g, Tmat, L_e] = frame3d_ke(E, G, A, J, Iy, Iz, p1, p2)
% frame3d_ke  Matriz de rigidez 12x12 de elemento viga 3D en coords globales
%   [ke_g, Tmat, L_e] = frame3d_ke(E, G, A, J, Iy, Iz, p1, p2)
%
% Convención (Hekatan Struct / OpenSees-like):
%   - DOFs por nodo: [u, v, w, theta_x, theta_y, theta_z]
%   - local_x = direccion del elemento (de p1 a p2)
%   - Si el elemento NO es vertical: local_z = +Z global (eje vertical),
%     local_y = local_z x local_x (regla de la mano derecha)
%   - Si el elemento es vertical: local_y = +Y global, local_z = local_x x local_y
%
% Iy = inercia respecto al eje local y (eje débil normalmente)
% Iz = inercia respecto al eje local z (eje fuerte normalmente)
%
% Salida:
%   ke_g : 12x12 stiffness en coords globales
%   Tmat : 12x12 matriz de transformacion (T' * ke_loc * T = ke_g)
%   L_e  : longitud del elemento

dx = p2(1) - p1(1);
dy = p2(2) - p1(2);
dz = p2(3) - p1(3);
L_e = sqrt(dx*dx + dy*dy + dz*dz);

ex = [dx / L_e, dy / L_e, dz / L_e];

% Definir ejes locales y, z
if abs(ex(3)) > 0.999
  % Elemento vertical: usar +Y global como local_y
  ey = [0, 1, 0];
  ez_x = ex(2)*ey(3) - ex(3)*ey(2);
  ez_y = ex(3)*ey(1) - ex(1)*ey(3);
  ez_z = ex(1)*ey(2) - ex(2)*ey(1);
  ez = [ez_x, ez_y, ez_z];
  nz = sqrt(ez(1)^2 + ez(2)^2 + ez(3)^2);
  ez = [ez(1)/nz, ez(2)/nz, ez(3)/nz];
else
  % No vertical: local_z = +Z global proyectado, local_y = local_z x local_x
  vz = [0, 0, 1];
  ey_x = vz(2)*ex(3) - vz(3)*ex(2);
  ey_y = vz(3)*ex(1) - vz(1)*ex(3);
  ey_z = vz(1)*ex(2) - vz(2)*ex(1);
  ny = sqrt(ey_x^2 + ey_y^2 + ey_z^2);
  ey = [ey_x/ny, ey_y/ny, ey_z/ny];
  ez_x = ex(2)*ey(3) - ex(3)*ey(2);
  ez_y = ex(3)*ey(1) - ex(1)*ey(3);
  ez_z = ex(1)*ey(2) - ex(2)*ey(1);
  ez = [ez_x, ez_y, ez_z];
end

% Stiffness local 12x12
EAL  = E * A / L_e;
GJL  = G * J / L_e;
EIyL = E * Iy / L_e;
EIzL = E * Iz / L_e;
L1   = L_e;
L2   = L1 * L1;

ke_loc = zeros(12, 12);
% Axial (DOFs 1, 7)
ke_loc(1, 1)  =  EAL;
ke_loc(1, 7)  = -EAL;
ke_loc(7, 1)  = -EAL;
ke_loc(7, 7)  =  EAL;
% Torsion (DOFs 4, 10)
ke_loc(4, 4)   =  GJL;
ke_loc(4, 10)  = -GJL;
ke_loc(10, 4)  = -GJL;
ke_loc(10, 10) =  GJL;
% Flexion respecto a eje z local (plano local xy: DOFs v=2, thz=6, v=8, thz=12) — Iz
ke_loc(2, 2)   =  12*EIzL/L2;
ke_loc(2, 6)   =   6*EIzL/L1;
ke_loc(2, 8)   = -12*EIzL/L2;
ke_loc(2, 12)  =   6*EIzL/L1;
ke_loc(6, 2)   =   6*EIzL/L1;
ke_loc(6, 6)   =   4*EIzL;
ke_loc(6, 8)   =  -6*EIzL/L1;
ke_loc(6, 12)  =   2*EIzL;
ke_loc(8, 2)   = -12*EIzL/L2;
ke_loc(8, 6)   =  -6*EIzL/L1;
ke_loc(8, 8)   =  12*EIzL/L2;
ke_loc(8, 12)  =  -6*EIzL/L1;
ke_loc(12, 2)  =   6*EIzL/L1;
ke_loc(12, 6)  =   2*EIzL;
ke_loc(12, 8)  =  -6*EIzL/L1;
ke_loc(12, 12) =   4*EIzL;
% Flexion respecto a eje y local (plano local xz: DOFs w=3, thy=5, w=9, thy=11) — Iy
ke_loc(3, 3)   =  12*EIyL/L2;
ke_loc(3, 5)   =  -6*EIyL/L1;
ke_loc(3, 9)   = -12*EIyL/L2;
ke_loc(3, 11)  =  -6*EIyL/L1;
ke_loc(5, 3)   =  -6*EIyL/L1;
ke_loc(5, 5)   =   4*EIyL;
ke_loc(5, 9)   =   6*EIyL/L1;
ke_loc(5, 11)  =   2*EIyL;
ke_loc(9, 3)   = -12*EIyL/L2;
ke_loc(9, 5)   =   6*EIyL/L1;
ke_loc(9, 9)   =  12*EIyL/L2;
ke_loc(9, 11)  =   6*EIyL/L1;
ke_loc(11, 3)  =  -6*EIyL/L1;
ke_loc(11, 5)  =   2*EIyL;
ke_loc(11, 9)  =   6*EIyL/L1;
ke_loc(11, 11) =   4*EIyL;

% Matriz de transformacion 12x12 (block diagonal de rotaciones 3x3)
R = [ex(1), ex(2), ex(3);
     ey(1), ey(2), ey(3);
     ez(1), ez(2), ez(3)];

Tmat = zeros(12, 12);
for k = 1:4
  base = (k - 1) * 3;
  Tmat(base+1, base+1) = R(1,1);
  Tmat(base+1, base+2) = R(1,2);
  Tmat(base+1, base+3) = R(1,3);
  Tmat(base+2, base+1) = R(2,1);
  Tmat(base+2, base+2) = R(2,2);
  Tmat(base+2, base+3) = R(2,3);
  Tmat(base+3, base+1) = R(3,1);
  Tmat(base+3, base+2) = R(3,2);
  Tmat(base+3, base+3) = R(3,3);
end

ke_g = transpose(Tmat) * ke_loc * Tmat;
end
