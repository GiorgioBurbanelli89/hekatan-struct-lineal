import os
"""
Validación FEM Python — Guerra Ej.1 Zapata Aislada Cuadrada
Plate Q4 MINDLIN (ShellThick) con Winkler springs + self-weight + P + M.

Inputs (libro Guerra MDI pag. 17-42):
  B = L = 3.45 m, h = 0.45 m, columna 0.45×0.45 m
  f'c = 280 kg/cm², gamma_c = 2.4 t/m³, nu = 0.20
  ks = 2920 tonf/m³ (Winkler subgrade)
  Dead: P=91 t, M=12 t·m
  Live: P=30 t, M=5 t·m
  Combo servicio: 1.0D + 1.0L  →  P_total=121 t, M_total=17 t·m

Genera contour map de soil pressure (estilo SAFE/libro p.36) para comparar
con Hekatan deployed y entender por qué los colormaps difieren.
"""
import numpy as np
import matplotlib.pyplot as plt
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

# ============================================================================
# CONFIG
# ============================================================================
B          = 3.45        # m (lado zapata)
h          = 0.45        # m (espesor)
ks         = 2920        # tonf/m³
fc_kgcm2   = 280
gamma_c    = 2.4         # tonf/m³
nu         = 0.20
P_dead     = 91.0        # tonf
P_live     = 30.0
M_dead     = 12.0        # tonf·m  (alrededor del eje Y → variacion en X)
M_live     = 5.0
nx, ny     = 16, 16      # mesh

# Derived
E = 14100 * np.sqrt(fc_kgcm2) * 10            # 1 kgf/cm² = 10 tonf/m²  → E en tonf/m²
P_tot = P_dead + P_live
M_tot = M_dead + M_live
W_self_per_area = gamma_c * h                  # tonf/m² uniforme

print(f"=== Inputs ===")
print(f"  B = {B} m, h = {h} m, ks = {ks} tonf/m³")
print(f"  E = {E:.0f} tonf/m² (= {E/1e3:.0f} MPa)")
print(f"  P_total = {P_tot} tonf, M_total = {M_tot} tonf·m")
print(f"  W_self/area = γ_c·h = {W_self_per_area:.3f} tonf/m²")

# ============================================================================
# MESH
# ============================================================================
nxn, nyn = nx+1, ny+1
dx_e, dy_e = B/nx, B/ny
N_nodes = nxn * nyn
N_dof = 3 * N_nodes

nodes = np.array([[i*dx_e, j*dy_e] for j in range(nyn) for i in range(nxn)])
elements = []
for j in range(ny):
    for i in range(nx):
        n0 = j*nxn + i
        elements.append([n0, n0+1, n0+nxn+1, n0+nxn])
elements = np.array(elements)
N_el = len(elements)
print(f"\n=== Mesh ===")
print(f"  {nx}x{ny} elementos = {N_el}, {N_nodes} nodos, {N_dof} dofs")

# ============================================================================
# MINDLIN Q4 ELEMENT STIFFNESS
# ============================================================================
D = E * h**3 / (12 * (1 - nu**2))
Db = D * np.array([
    [1, nu, 0],
    [nu, 1, 0],
    [0, 0, (1-nu)/2]
])
G_mod = E / (2*(1+nu))
kappa = 5/6
Ds = kappa * G_mod * h

def shape_q4(xi, eta):
    N = 0.25 * np.array([(1-xi)*(1-eta), (1+xi)*(1-eta), (1+xi)*(1+eta), (1-xi)*(1+eta)])
    dN_dxi  = 0.25 * np.array([-(1-eta),  (1-eta),  (1+eta), -(1+eta)])
    dN_deta = 0.25 * np.array([-(1-xi),  -(1+xi),  (1+xi),   (1-xi)])
    return N, dN_dxi, dN_deta

def element_stiffness(el_nodes):
    """Mindlin Q4 12x12 stiffness. dof order per node: (w, θx, θy)
    Convencion: θx rotacion alrededor de Y, θy rotacion alrededor de X
    → momento aplicado a θx genera variacion de σ en X (matchea libro)."""
    xy = nodes[el_nodes]
    Ke = np.zeros((12, 12))

    # Bending: 2x2 Gauss (full integration)
    gauss2 = [(-1/np.sqrt(3), 1.0), (1/np.sqrt(3), 1.0)]
    for xi_g, w_xi in gauss2:
        for eta_g, w_eta in gauss2:
            N, dN_dxi, dN_deta = shape_q4(xi_g, eta_g)
            J = np.array([[dN_dxi @ xy[:,0], dN_dxi @ xy[:,1]],
                          [dN_deta @ xy[:,0], dN_deta @ xy[:,1]]])
            detJ = np.linalg.det(J)
            Jinv = np.linalg.inv(J)
            dN_dx = Jinv[0,0]*dN_dxi + Jinv[0,1]*dN_deta
            dN_dy = Jinv[1,0]*dN_dxi + Jinv[1,1]*dN_deta

            # Bb: curvaturas {κx, κy, κxy} desde dofs {w, θx, θy}
            # κx = ∂θx/∂x (rotacion sobre Y → curvatura en X)
            # κy = ∂θy/∂y
            # κxy = ∂θx/∂y + ∂θy/∂x
            Bb = np.zeros((3, 12))
            for k in range(4):
                Bb[0, 3*k+1] = dN_dx[k]    # κx ← ∂θx/∂x
                Bb[1, 3*k+2] = dN_dy[k]    # κy ← ∂θy/∂y
                Bb[2, 3*k+1] = dN_dy[k]    # κxy ← ∂θx/∂y
                Bb[2, 3*k+2] = dN_dx[k]    # κxy ← ∂θy/∂x
            Ke += Bb.T @ Db @ Bb * detJ * w_xi * w_eta

    # Shear: 2x2 Gauss (FULL integration; para h/B=0.13 placa GRUESA no hay
    # locking. 1x1 reduced introducia hourglass modes con patron checkerboard).
    for xi_g, w_xi in gauss2:
        for eta_g, w_eta in gauss2:
            N, dN_dxi, dN_deta = shape_q4(xi_g, eta_g)
            J = np.array([[dN_dxi @ xy[:,0], dN_dxi @ xy[:,1]],
                          [dN_deta @ xy[:,0], dN_deta @ xy[:,1]]])
            detJ = np.linalg.det(J)
            Jinv = np.linalg.inv(J)
            dN_dx = Jinv[0,0]*dN_dxi + Jinv[0,1]*dN_deta
            dN_dy = Jinv[1,0]*dN_dxi + Jinv[1,1]*dN_deta

            # Bs: cortantes {γxz, γyz} desde dofs {w, θx, θy}
            # γxz = ∂w/∂x - θx,  γyz = ∂w/∂y - θy
            Bs = np.zeros((2, 12))
            for k in range(4):
                Bs[0, 3*k+0] = dN_dx[k]
                Bs[0, 3*k+1] = -N[k]
                Bs[1, 3*k+0] = dN_dy[k]
                Bs[1, 3*k+2] = -N[k]
            Ds_mat = Ds * np.eye(2)
            Ke += Bs.T @ Ds_mat @ Bs * detJ * w_xi * w_eta

    return Ke

# ============================================================================
# ASSEMBLY
# ============================================================================
print("\n=== Assembly ===")
K = lil_matrix((N_dof, N_dof))
F = np.zeros(N_dof)

# Tributary area per node
A_trib = np.zeros(N_nodes)
for j in range(nyn):
    for i in range(nxn):
        eI = (i == 0 or i == nxn-1)
        eJ = (j == 0 or j == nyn-1)
        factor = 0.25 if eI and eJ else (0.5 if eI or eJ else 1.0)
        A_trib[j*nxn + i] = dx_e * dy_e * factor

# Element stiffness
for el in elements:
    Ke = element_stiffness(el)
    glb = np.array([3*el[k]+d for k in range(4) for d in range(3)])
    for i_lcl in range(12):
        for j_lcl in range(12):
            K[glb[i_lcl], glb[j_lcl]] += Ke[i_lcl, j_lcl]

# Winkler springs (w-dof solo)
for n in range(N_nodes):
    K[3*n, 3*n] += ks * A_trib[n]

# Loads: self-weight at every node (downward = negativo)
for n in range(N_nodes):
    F[3*n] -= W_self_per_area * A_trib[n]

# P y M sobre el AREA de columna 0.45x0.45 (no puntual!) — matchea SAFE smoothing.
# Distribuir P uniformemente sobre los nodos dentro de col_size centrada.
cx, cy = B/2, B/2
col_size = 0.45
in_col = []
for n in range(N_nodes):
    x, y = nodes[n]
    if abs(x - cx) <= col_size/2 + 1e-6 and abs(y - cy) <= col_size/2 + 1e-6:
        in_col.append(n)
print(f"  Nodos en huella columna: {len(in_col)}")

# P distribuida igual a cada nodo en huella
P_per_node = P_tot / len(in_col)
# M distribuida proporcional a (x - cx) para crear momento puro
sum_x_dist = sum((nodes[n][0] - cx)**2 for n in in_col)
# Momento total = sum( Fx_node_eq * (x-cx) ) but for plate, M aplica via theta dof
# Distribuyo M proporcional a 1/N en cada nodo (concentrate at center, or share evenly)
M_per_node = M_tot / len(in_col)
for n in in_col:
    F[3*n]     -= P_per_node       # downward
    F[3*n + 1] += M_per_node       # M sobre θx → curvatura en X
center_node = in_col[len(in_col)//2]   # for reference output

# ============================================================================
# SOLVE
# ============================================================================
print("Solving...")
u = spsolve(K.tocsr(), F)
w_nodal       = u[0::3]
theta_x_nodal = u[1::3]
theta_y_nodal = u[2::3]

print(f"\n=== Resultados ===")
print(f"w range:       [{w_nodal.min()*1000:.3f}, {w_nodal.max()*1000:.3f}] mm")
print(f"  w_centro = {w_nodal[center_node]*1000:.3f} mm")

# Pressure (compression POSITIVA en convencion ingenieril)
# Si w < 0 (placa baja), reaccion soil va hacia arriba (positiva) → presion compresion
sigma = -ks * w_nodal     # tonf/m² (positivo = compresion)
print(f"\nsigma range:   [{sigma.min():.3f}, {sigma.max():.3f}] tonf/m²")
print(f"  σ_max = {sigma.max():.3f} tonf/m²  (libro p.36 SAFE: 13.163)")
print(f"  σ_min = {sigma.min():.3f} tonf/m²  (libro p.19 manual: 8.28)")
print(f"  σ_centro = {sigma[center_node]:.3f} tonf/m²")

# Esquinas
corners = [0, nxn-1, N_nodes-nxn, N_nodes-1]
print(f"\n  σ esquinas: {[f'{sigma[c]:.3f}' for c in corners]}  (esperado uniforme si fuera placa rigida)")

# Bordes medios
mid_x_bot = nxn // 2
mid_x_top = N_nodes - nxn + nxn//2
mid_y_left = (nyn // 2) * nxn
mid_y_right = (nyn // 2) * nxn + nxn - 1
print(f"  σ borde -X mid: {sigma[mid_y_left]:.3f}")
print(f"  σ borde +X mid: {sigma[mid_y_right]:.3f}")
print(f"  σ borde -Y mid: {sigma[mid_x_bot]:.3f}")
print(f"  σ borde +Y mid: {sigma[mid_x_top]:.3f}")

# ============================================================================
# PLOT estilo libro SAFE pag.36
# ============================================================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7))

# Reshape para contour
X = nodes[:,0].reshape(nyn, nxn)
Y = nodes[:,1].reshape(nyn, nxn)
P_grid = sigma.reshape(nyn, nxn)

# Plot 1: como SAFE (sigma negativa, magenta=max compression)
levels = np.linspace(-sigma.max(), -sigma.min(), 14)
cf1 = ax1.contourf(X, Y, -P_grid, levels=levels, cmap='jet_r')
ax1.contour(X, Y, -P_grid, levels=levels, colors='black', linewidths=0.3, alpha=0.4)
plt.colorbar(cf1, ax=ax1, label='σ (tonf/m²) — convención SAFE')
ax1.plot(cx, cy, 'wo', markersize=8, markeredgecolor='black')
ax1.text(cx, cy + 0.1, 'col', ha='center', color='white', fontsize=9,
         bbox=dict(boxstyle='round,pad=0.2', facecolor='black', alpha=0.6))
ax1.set_title(f'Hekatan FEM Mindlin Q4 (estilo SAFE)\n'
              f'σ_max={sigma.max():.3f} σ_min={sigma.min():.3f} t/m²')
ax1.set_xlabel('X (m)'); ax1.set_ylabel('Y (m)')
ax1.set_aspect('equal')

# Plot 2: positivo (magnitudes)
cf2 = ax2.contourf(X, Y, P_grid, levels=14, cmap='jet')
ax2.contour(X, Y, P_grid, levels=14, colors='black', linewidths=0.3, alpha=0.4)
plt.colorbar(cf2, ax=ax2, label='σ (tonf/m²) — magnitud compresion')
ax2.plot(cx, cy, 'wo', markersize=8, markeredgecolor='black')
ax2.set_title(f'Mismo data en convención positiva\n'
              f'(σ_max derecha={sigma.max():.3f} → rojo, σ_min izquierda={sigma.min():.3f} → azul)')
ax2.set_xlabel('X (m)'); ax2.set_ylabel('Y (m)')
ax2.set_aspect('equal')

plt.tight_layout()
out_path = os.path.expanduser("~") + r'\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Api CSI Computers\safe-api\guerra_ej1_python_fem.png'
plt.savefig(out_path, dpi=120, bbox_inches='tight')
print(f"\nPNG guardada: {out_path}")
plt.close()
