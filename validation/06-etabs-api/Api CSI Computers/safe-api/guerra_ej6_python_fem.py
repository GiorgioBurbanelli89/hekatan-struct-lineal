import os
"""
Guerra Ej.6 ZAPATA UNIDA CON VIGA DE AMARRE — modelado correcto:
DOS mallas Mindlin Q4 (ShellThick) COMPLETAMENTE SEPARADAS, cada una
con su propio sistema lineal y Winkler springs. Sin bbox unificado.

Match libro Fig.180 (pag.119): dos rectangulos separados, viga amarre
no visible como pressure (solo transmite momentos entre cols, no
toca el suelo).

Datos (libro pag.113):
  Zapata 1 medianera: 2.38×3.00m, h=0.55m
    Col1 en (0.25, 1.50). P1 = 70 + 40 = 110 tonf
  Zapata 2 interna:   2.45×2.45m, h=0.55m
    Col2 en (2.20, 1.225) DE Z2 (local). P2 = 89 + 51 = 140 tonf
  Cols 50×50cm
  f'c=210, gamma_c=2.4, nu=0.20
  ks=3820 t/m^3, q_adm=19 t/m^2
"""
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyArrowPatch
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

# ============================================================================
# INPUTS DEL LIBRO
# ============================================================================
H_ZAPATA = 0.55
COL_SIZE = 0.50
FC_KGCM2 = 210
GAMMA_C = 2.4
NU = 0.20
KS_TM3 = 3820

E = 14100 * np.sqrt(FC_KGCM2) * 10   # tonf/m^2 (= 235,000 kgf/cm^2 * 10)

# Zapata 1 medianera
L1, B1 = 2.38, 3.00
COL1_X, COL1_Y = 0.25, B1/2   # local Z1 coordinates
P_COL1 = 110.0                 # D=70 + L=40

# Zapata 2 interna
L2, B2 = 2.45, 2.45
COL2_X, COL2_Y = L2 - 0.25, B2/2   # local Z2 coordinates
P_COL2 = 140.0                      # D=89 + L=51

# Viga amarre (solo visual, no transfer en modelo simple)
L_VIGA = 1.64

print(f"=== Inputs Ej.6 (Guerra MDI pag.113) ===")
print(f"  Z1: {L1}x{B1}m h={H_ZAPATA}m  Col1 P={P_COL1}t en ({COL1_X},{COL1_Y})")
print(f"  Z2: {L2}x{B2}m h={H_ZAPATA}m  Col2 P={P_COL2}t en ({COL2_X},{COL2_Y})")
print(f"  L_viga={L_VIGA}m  ks={KS_TM3} t/m³  q_adm=19 t/m²")
print()

# ============================================================================
# MINDLIN Q4 STIFFNESS
# ============================================================================
def shape_q4(xi, eta):
    N = 0.25 * np.array([(1-xi)*(1-eta), (1+xi)*(1-eta), (1+xi)*(1+eta), (1-xi)*(1+eta)])
    dN_dxi  = 0.25 * np.array([-(1-eta),  (1-eta),  (1+eta), -(1+eta)])
    dN_deta = 0.25 * np.array([-(1-xi),  -(1+xi),   (1+xi),   (1-xi)])
    return N, dN_dxi, dN_deta

def element_stiffness(xy, h, E_val, nu_val):
    """Mindlin Q4 ShellThick, 12x12 (dof por nodo: w, theta_x, theta_y).
    Full 2x2 Gauss para bending y shear."""
    D = E_val * h**3 / (12 * (1 - nu_val**2))
    Db = D * np.array([[1, nu_val, 0], [nu_val, 1, 0], [0, 0, (1-nu_val)/2]])
    G = E_val / (2*(1+nu_val))
    Ds = 5/6 * G * h
    Ke = np.zeros((12, 12))
    gauss = [(-1/np.sqrt(3), 1.0), (1/np.sqrt(3), 1.0)]
    for xi_g, w_xi in gauss:
        for eta_g, w_eta in gauss:
            N, dN_dxi, dN_deta = shape_q4(xi_g, eta_g)
            J = np.array([[dN_dxi @ xy[:,0], dN_dxi @ xy[:,1]],
                          [dN_deta @ xy[:,0], dN_deta @ xy[:,1]]])
            detJ = np.linalg.det(J)
            Jinv = np.linalg.inv(J)
            dN_dx = Jinv[0,0]*dN_dxi + Jinv[0,1]*dN_deta
            dN_dy = Jinv[1,0]*dN_dxi + Jinv[1,1]*dN_deta
            Bb = np.zeros((3, 12))
            Bs = np.zeros((2, 12))
            for k in range(4):
                Bb[0, 3*k+1] = dN_dx[k]
                Bb[1, 3*k+2] = dN_dy[k]
                Bb[2, 3*k+1] = dN_dy[k]
                Bb[2, 3*k+2] = dN_dx[k]
                Bs[0, 3*k+0] = dN_dx[k]
                Bs[0, 3*k+1] = -N[k]
                Bs[1, 3*k+0] = dN_dy[k]
                Bs[1, 3*k+2] = -N[k]
            Ke += Bb.T @ Db @ Bb * detJ * w_xi * w_eta
            Ke += Bs.T @ (Ds * np.eye(2)) @ Bs * detJ * w_xi * w_eta
    return Ke

# ============================================================================
# SOLVER por zapata (independiente)
# ============================================================================
def solve_zapata(L, B, h, nx, ny, ks, col_x, col_y, col_size, P_col, label):
    """Mindlin Q4 + Winkler, retorna malla y sigma nodal."""
    nxn, nyn = nx + 1, ny + 1
    dx_e, dy_e = L/nx, B/ny
    N_nodes = nxn * nyn
    N_dof = 3 * N_nodes

    nodes = np.array([[i*dx_e, j*dy_e] for j in range(nyn) for i in range(nxn)])
    elements = []
    for j in range(ny):
        for i in range(nx):
            n0 = j*nxn + i
            elements.append([n0, n0+1, n0+nxn+1, n0+nxn])
    elements = np.array(elements)

    K = lil_matrix((N_dof, N_dof))
    F = np.zeros(N_dof)

    A_trib = np.zeros(N_nodes)
    for j in range(nyn):
        for i in range(nxn):
            eI = (i == 0 or i == nxn-1)
            eJ = (j == 0 or j == nyn-1)
            factor = 0.25 if eI and eJ else (0.5 if eI or eJ else 1.0)
            A_trib[j*nxn + i] = dx_e * dy_e * factor

    for el in elements:
        Ke = element_stiffness(nodes[el], h, E, NU)
        glb = np.array([3*el[k]+d for k in range(4) for d in range(3)])
        for i_lcl in range(12):
            for j_lcl in range(12):
                K[glb[i_lcl], glb[j_lcl]] += Ke[i_lcl, j_lcl]

    # Winkler en TODOS los nodos (zapata apoya entera en el suelo)
    for n in range(N_nodes):
        K[3*n, 3*n] += ks * A_trib[n]

    # Self-weight uniforme
    sw_pressure = GAMMA_C * h
    for n in range(N_nodes):
        F[3*n] -= sw_pressure * A_trib[n]

    # Carga columna distribuida sobre huella
    col_nodes = []
    for n in range(N_nodes):
        x, y = nodes[n]
        if abs(x-col_x) <= col_size/2 + 1e-6 and abs(y-col_y) <= col_size/2 + 1e-6:
            col_nodes.append(n)
    P_per_node = P_col / len(col_nodes)
    for n in col_nodes:
        F[3*n] -= P_per_node

    print(f"{label}: {N_nodes} nodos, {len(elements)} elements, {len(col_nodes)} cols nodos")
    u = spsolve(K.tocsr(), F)
    w = u[0::3]
    sigma = -ks * w   # tonf/m^2 (positivo = compresion)
    print(f"  σ range: [{sigma.min():.3f}, {sigma.max():.3f}]  w_max: {abs(w).max()*1000:.2f} mm")
    return nodes, sigma, nxn, nyn

# ============================================================================
# RESOLVER cada zapata
# ============================================================================
print("=== Resolviendo Zapata 1 (medianera) ===")
nodes1, sigma1, nxn1, nyn1 = solve_zapata(
    L1, B1, H_ZAPATA, nx=12, ny=15, ks=KS_TM3,
    col_x=COL1_X, col_y=COL1_Y, col_size=COL_SIZE, P_col=P_COL1, label="Z1"
)

print("\n=== Resolviendo Zapata 2 (interna) ===")
nodes2, sigma2, nxn2, nyn2 = solve_zapata(
    L2, B2, H_ZAPATA, nx=12, ny=12, ks=KS_TM3,
    col_x=COL2_X, col_y=COL2_Y, col_size=COL_SIZE, P_col=P_COL2, label="Z2"
)

# ============================================================================
# PLOT estilo SAFE Fig.180
# ============================================================================
print(f"\n=== Comparacion vs libro ===")
print(f"  Z1 σ_max = {sigma1.max():.3f} t/m²   (libro Fig.180: 26.179)")
print(f"  Z2 σ_max = {sigma2.max():.3f} t/m²   (libro Fig.180: ~16.7)")

fig, ax = plt.subplots(figsize=(14, 5))

# Origen Z2 desplazado a derecha: x = L1 + L_VIGA
Z2_OFFSET_X = L1 + L_VIGA
Z2_OFFSET_Y = (B1 - B2) / 2   # centrar Z2 verticalmente con Z1

X1 = nodes1[:,0].reshape(nyn1, nxn1)
Y1 = nodes1[:,1].reshape(nyn1, nxn1)
S1 = sigma1.reshape(nyn1, nxn1)

X2 = (nodes2[:,0] + Z2_OFFSET_X).reshape(nyn2, nxn2)
Y2 = (nodes2[:,1] + Z2_OFFSET_Y).reshape(nyn2, nxn2)
S2 = sigma2.reshape(nyn2, nxn2)

# Range comun para que el colormap sea consistente
sigma_min = min(sigma1.min(), sigma2.min())
sigma_max = max(sigma1.max(), sigma2.max())
levels = np.linspace(sigma_min, sigma_max, 14)
cmap = plt.cm.jet

cf1 = ax.contourf(X1, Y1, S1, levels=levels, cmap=cmap)
ax.contour(X1, Y1, S1, levels=levels, colors='black', linewidths=0.3, alpha=0.4)
cf2 = ax.contourf(X2, Y2, S2, levels=levels, cmap=cmap)
ax.contour(X2, Y2, S2, levels=levels, colors='black', linewidths=0.3, alpha=0.4)
plt.colorbar(cf1, ax=ax, label='σ (tonf/m²)')

# Outlines zapatas
ax.add_patch(Rectangle((0, 0), L1, B1, fill=False, edgecolor='yellow', linewidth=2))
ax.add_patch(Rectangle((Z2_OFFSET_X, Z2_OFFSET_Y), L2, B2, fill=False, edgecolor='yellow', linewidth=2))

# Viga amarre (linea negra entre cols)
ax.plot([COL1_X, Z2_OFFSET_X + COL2_X], [COL1_Y, Z2_OFFSET_Y + COL2_Y],
        'k-', linewidth=3, label=f'Viga amarre L={L_VIGA}m')

# Columnas
ax.plot(COL1_X, COL1_Y, 'wo', markersize=12, markeredgecolor='black', label=f'Col1 P={P_COL1}t')
ax.plot(Z2_OFFSET_X + COL2_X, Z2_OFFSET_Y + COL2_Y, 'wo', markersize=12, markeredgecolor='black',
        label=f'Col2 P={P_COL2}t')

ax.set_title(f'Hekatan Python FEM Ej.6 — 2 mallas ShellThick separadas\n'
             f'Z1 σ_max={sigma1.max():.2f} | Z2 σ_max={sigma2.max():.2f} t/m²  '
             f'(libro Fig.180: Z1=26.18, Z2≈16.7)')
ax.set_xlabel('X (m)'); ax.set_ylabel('Y (m)')
ax.set_aspect('equal')
ax.set_xlim(-0.5, Z2_OFFSET_X + L2 + 0.5)
ax.set_ylim(-0.5, B1 + 0.5)
ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.10), ncol=3, fontsize=9)
ax.grid(True, alpha=0.2)

plt.tight_layout()
out = os.path.expanduser("~") + r'\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Api CSI Computers\safe-api\guerra_ej6_python_fem.png'
plt.savefig(out, dpi=120, bbox_inches='tight')
print(f"\nPNG: {out}")
plt.close()
