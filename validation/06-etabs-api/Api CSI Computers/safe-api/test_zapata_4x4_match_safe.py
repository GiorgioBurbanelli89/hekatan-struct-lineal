import os
"""
Replicar Test.f2k de SAFE en Python:
- Footing 4x4m, h=0.6m, Shell-Thin, HORMIGON 210
- Stiff slab 0.6x0.6m centrada, m11/m22/m12 modifier=100
- Joint 9 (centro): Dead FZ=-101.97t, Live FZ=-50.99t (Joint Load 0.6x0.6m)
- DConS1 = 1.4 × Dead (combo del screenshot)
- ks = 2039.43 t/m³ (Subgrade Modulus de ASpr2)
- Self Weight Multiplier = 1 (Dead incluye peso propio)

Resultado esperado libro SAFE Fig: σ ∈ [-10.0, -11.37] t/m² (DConS1)
Patrón: concentric circles (max compresion al centro)
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve

# ============================================================================
# INPUTS desde Test.f2k
# ============================================================================
L = 4.0           # footing side (m)
H = 0.6           # footing thickness (m)
STIFF_SIZE = 0.6  # Stiff slab footprint (m)
STIFF_MULT = 100  # m11=m22=m12 modifier de Stiff slab
COL_DIM = 0.6     # Joint Load X/Y Dimension (= Stiff slab size)
E = 2043284.12    # HORMIGON 210 E (t/m²)
NU = 0.2
GAMMA_C = 2.4     # densidad concreto (t/m³)
KS = 2039.43      # Subgrade Modulus ASpr2 (t/m³)

P_DEAD = 101.97   # FZ Dead (t)
P_LIVE = 50.99    # FZ Live (t) (no usado en DConS1)
SF_DEAD = 1.4     # Scale factor para DConS1
SWM = 1.0         # Self Weight Multiplier (Dead)

# DConS1 = 1.4 × Dead → load total + self-weight × 1.4
P_TOTAL_COMBO = SF_DEAD * P_DEAD          # = 142.76 t
SW_PRESSURE   = SF_DEAD * SWM * GAMMA_C * H  # = 1.4 × 2.4 × 0.6 = 2.016 t/m² uniforme

print(f"=== Inputs Test.f2k (DConS1 = 1.4 × Dead) ===")
print(f"  Footing {L}×{L}×{H}m, ks={KS} t/m³, E={E:.0f} t/m²")
print(f"  Stiff slab {STIFF_SIZE}×{STIFF_SIZE}m (×{STIFF_MULT} bending modifier)")
print(f"  P_total = 1.4×{P_DEAD} = {P_TOTAL_COMBO} t (joint 9 centro)")
print(f"  Self-weight × 1.4 = {SW_PRESSURE} t/m² uniforme")
print(f"  σ_avg esperado = {(P_TOTAL_COMBO + SW_PRESSURE*L*L)/(L*L):.2f} t/m²")

# ============================================================================
# Mindlin Q4 ShellThin (selective reduced integration shear)
# ============================================================================
def shape_q4(xi, eta):
    N = 0.25 * np.array([(1-xi)*(1-eta), (1+xi)*(1-eta), (1+xi)*(1+eta), (1-xi)*(1+eta)])
    dN_dxi  = 0.25 * np.array([-(1-eta),  (1-eta),  (1+eta), -(1+eta)])
    dN_deta = 0.25 * np.array([-(1-xi),  -(1+xi),   (1+xi),   (1-xi)])
    return N, dN_dxi, dN_deta

def shell_thin_q4(xy, h, E_val, nu_val, D_mult=1.0):
    """Shell-Thin Mindlin Q4 (reduced shear integration 1×1)."""
    D = E_val * h**3 / (12 * (1 - nu_val**2)) * D_mult
    Db = D * np.array([[1, nu_val, 0], [nu_val, 1, 0], [0, 0, (1-nu_val)/2]])
    G_  = E_val / (2*(1+nu_val))
    Ds = 5/6 * G_ * h
    Ke = np.zeros((12, 12))
    # Bending — full 2×2 Gauss
    gp_bend = [(-1/np.sqrt(3), 1.0), (1/np.sqrt(3), 1.0)]
    for xi_g, w_xi in gp_bend:
        for eta_g, w_eta in gp_bend:
            N, dN_dxi, dN_deta = shape_q4(xi_g, eta_g)
            J = np.array([[dN_dxi @ xy[:,0], dN_dxi @ xy[:,1]],
                          [dN_deta @ xy[:,0], dN_deta @ xy[:,1]]])
            detJ = np.linalg.det(J); Jinv = np.linalg.inv(J)
            dN_dx = Jinv[0,0]*dN_dxi + Jinv[0,1]*dN_deta
            dN_dy = Jinv[1,0]*dN_dxi + Jinv[1,1]*dN_deta
            Bb = np.zeros((3, 12))
            for k in range(4):
                Bb[0, 3*k+1] = dN_dx[k]
                Bb[1, 3*k+2] = dN_dy[k]
                Bb[2, 3*k+1] = dN_dy[k]
                Bb[2, 3*k+2] = dN_dx[k]
            Ke += Bb.T @ Db @ Bb * detJ * w_xi * w_eta
    # Shear — reduced 1×1
    N, dN_dxi, dN_deta = shape_q4(0.0, 0.0)
    J = np.array([[dN_dxi @ xy[:,0], dN_dxi @ xy[:,1]],
                  [dN_deta @ xy[:,0], dN_deta @ xy[:,1]]])
    detJ = np.linalg.det(J); Jinv = np.linalg.inv(J)
    dN_dx = Jinv[0,0]*dN_dxi + Jinv[0,1]*dN_deta
    dN_dy = Jinv[1,0]*dN_dxi + Jinv[1,1]*dN_deta
    Bs = np.zeros((2, 12))
    for k in range(4):
        Bs[0, 3*k+0] = dN_dx[k]; Bs[0, 3*k+1] = -N[k]
        Bs[1, 3*k+0] = dN_dy[k]; Bs[1, 3*k+2] = -N[k]
    Ke += Bs.T @ (Ds * np.eye(2)) @ Bs * detJ * 2.0 * 2.0   # 1×1 Gauss weight = 2×2 = 4
    return Ke

# ============================================================================
# Build mesh
# ============================================================================
NX = NY = 13   # match SAFE mesh ~0.3m (4/13 ≈ 0.308m per max mesh size config)
dx = L / NX; dy = L / NY
nxn = NX + 1; nyn = NY + 1
nodes = np.array([[i*dx - L/2, j*dy - L/2] for j in range(nyn) for i in range(nxn)])
N_nodes = len(nodes)
N_dof = 3 * N_nodes
print(f"\n=== Mesh ===")
print(f"  {NX}×{NY} elements, {N_nodes} nodes, dx={dx:.3f}m")

elements = []
for j in range(NY):
    for i in range(NX):
        n0 = j*nxn + i
        elements.append([n0, n0+1, n0+nxn+1, n0+nxn])

# ============================================================================
# Assembly: shell stiffness con Stiff slab modifier en footprint central
# ============================================================================
K = lil_matrix((N_dof, N_dof))
F = np.zeros(N_dof)

def is_in_stiff(xy_mean):
    return abs(xy_mean[0]) <= STIFF_SIZE/2 + 1e-6 and abs(xy_mean[1]) <= STIFF_SIZE/2 + 1e-6

n_stiff = 0
for el in elements:
    xy = nodes[el]
    xy_mean = xy.mean(axis=0)
    # Stiff slab: D × (1 + 100) ≈ Footing + Stiff (m11=m22=m12=100 modifier en Stiff)
    D_mult = (1 + STIFF_MULT) if is_in_stiff(xy_mean) else 1.0
    if is_in_stiff(xy_mean): n_stiff += 1
    Ke = shell_thin_q4(xy, H, E, NU, D_mult=D_mult)
    glb = np.array([3*el[k]+d for k in range(4) for d in range(3)])
    for i_lcl in range(12):
        for j_lcl in range(12):
            K[glb[i_lcl], glb[j_lcl]] += Ke[i_lcl, j_lcl]
print(f"  {len(elements)} shell elements ({n_stiff} dentro Stiff slab D×{1+STIFF_MULT})")

# ============================================================================
# Winkler springs (vertical kvz en cada nodo, area tributaria)
# ============================================================================
for j in range(nyn):
    for i in range(nxn):
        eI = (i == 0 or i == NX); eJ = (j == 0 or j == NY)
        factor = 0.25 if eI and eJ else (0.5 if eI or eJ else 1.0)
        A_trib = dx * dy * factor
        n = j*nxn + i
        K[3*n, 3*n] += KS * A_trib

# ============================================================================
# Loads
# ============================================================================
# Self-weight × SF_DEAD (DConS1 = 1.4 × Dead)
for j in range(nyn):
    for i in range(nxn):
        eI = (i == 0 or i == NX); eJ = (j == 0 or j == NY)
        factor = 0.25 if eI and eJ else (0.5 if eI or eJ else 1.0)
        A_trib = dx * dy * factor
        n = j*nxn + i
        F[3*n] -= SW_PRESSURE * A_trib

# Joint load distribuido sobre Stiff footprint (Joint Load X/Y Dim = 0.6m).
# SAFE: "Size of Load for Punching Shear" sirve también como huella de distribución
# para que load NO se concentre en single point.
col_nodes = []
for n in range(N_nodes):
    x, y = nodes[n]
    if abs(x) <= COL_DIM/2 + 1e-6 and abs(y) <= COL_DIM/2 + 1e-6:
        col_nodes.append(n)
print(f"  Load distribuido sobre {len(col_nodes)} nodos en footprint {COL_DIM}×{COL_DIM}")
for n in col_nodes:
    F[3*n] -= P_TOTAL_COMBO / len(col_nodes)

# ============================================================================
# Solve
# ============================================================================
print(f"\n=== Solver ===")
K_csr = K.tocsr()
u = spsolve(K_csr, F)
w = u[0::3]
sigma = -KS * w   # t/m² (compresion positiva)
print(f"  σ range: [{sigma.min():.3f}, {sigma.max():.3f}]   libro SAFE: [10.0, 11.37]")
print(f"  σ_avg: {sigma.mean():.3f} t/m²")

# ============================================================================
# Plot estilo SAFE Fig
# ============================================================================
fig, ax = plt.subplots(figsize=(12, 10))
X = nodes[:, 0].reshape(nyn, nxn)
Y = nodes[:, 1].reshape(nyn, nxn)
S = sigma.reshape(nyn, nxn)

# Convención SAFE: σ negativo = compresion
S_safe = -S
sigma_min_safe = S_safe.min(); sigma_max_safe = S_safe.max()
print(f"  Plot range (SAFE convention σ negativo): [{sigma_min_safe:.3f}, {sigma_max_safe:.3f}]")

# Colormap SAFE: BLUE en max (menos compresion, -10), MAGENTA en min (max compresion, -11.4)
# Construir colormap rainbow inverso similar a SAFE
from matplotlib.colors import LinearSegmentedColormap
safe_colors = ['#FF00FF',  # magenta (max compresion)
               '#C71585',  # rojo púrpura
               '#FF0000',  # rojo
               '#FF4500',  # naranja rojo
               '#FFA500',  # naranja
               '#FFD700',  # amarillo dorado
               '#FFFF00',  # amarillo
               '#9AFF00',  # verde amarillo
               '#00FF00',  # verde
               '#00CED1',  # cyan
               '#00BFFF',  # cyan claro
               '#0000FF']  # azul (min compresion)
cmap = LinearSegmentedColormap.from_list('safe', safe_colors, N=256)

# Interpolar a grid más fino para contornos suaves circulares
from scipy.interpolate import griddata
fine_x = np.linspace(-L/2, L/2, 200)
fine_y = np.linspace(-L/2, L/2, 200)
FX, FY = np.meshgrid(fine_x, fine_y)
pts = np.column_stack([X.ravel(), Y.ravel()])
S_fine = griddata(pts, S_safe.ravel(), (FX, FY), method='cubic')
levels = np.linspace(sigma_min_safe, sigma_max_safe, 20)
cf = ax.contourf(FX, FY, S_fine, levels=levels, cmap=cmap)
ax.contour(FX, FY, S_fine, levels=levels, colors='black', linewidths=0.3, alpha=0.5)
cbar = plt.colorbar(cf, ax=ax, label='σ (tonf/m²)', orientation='horizontal',
                    pad=0.08, shrink=0.8)

# Outlines
ax.add_patch(Rectangle((-L/2, -L/2), L, L, fill=False, edgecolor='black', linewidth=2))
ax.add_patch(Rectangle((-STIFF_SIZE/2, -STIFF_SIZE/2), STIFF_SIZE, STIFF_SIZE,
                       fill=False, edgecolor='cyan', linewidth=2, linestyle='--',
                       label=f'Stiff slab {STIFF_SIZE}m'))

# Col marker + valor central
ax.plot(0, 0, 'g+', markersize=18, markeredgewidth=3)
ax.annotate(f'{S_safe[nyn//2, nxn//2]:.2f}', xy=(0.05, -0.05), color='white',
            fontsize=10, weight='bold')

# Grid SAFE-like
ax.set_xticks(np.arange(-L/2, L/2+0.3, 0.5))
ax.set_yticks(np.arange(-L/2, L/2+0.3, 0.5))
ax.grid(True, alpha=0.3, linewidth=0.5)
ax.set_aspect('equal')
ax.set_xlim(-L/2-0.3, L/2+0.3)
ax.set_ylim(-L/2-0.3, L/2+0.3)
ax.set_title(f'Python FEM Test.f2k DConS1 (= 1.4 × Dead)\n'
             f'σ ∈ [{sigma_min_safe:.2f}, {sigma_max_safe:.2f}] tonf/m²   '
             f'(libro SAFE: [-11.37, -10.0])')
ax.set_xlabel('X (m)'); ax.set_ylabel('Y (m)')
ax.legend(loc='upper right', fontsize=9)

plt.tight_layout()
out = os.path.expanduser("~") + r'\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Api CSI Computers\safe-api\test_zapata_4x4_match_safe.png'
plt.savefig(out, dpi=120, bbox_inches='tight')
plt.close()
print(f"\nPNG: {out}")
