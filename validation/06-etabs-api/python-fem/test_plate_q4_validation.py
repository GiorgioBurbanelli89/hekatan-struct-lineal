"""
============================================================================
 Validacion del Elemento Q4 Mindlin-Reissner — Python/NumPy vs WASM
============================================================================

 Reimplementacion completa del solver de placa Q4 en Python puro.
 Compara con la solucion analitica de Navier y con los resultados WASM.

 Referencia: Bathe, "Finite Element Procedures", Ch. 5.4
            Timoshenko & Woinowsky-Krieger, "Theory of Plates and Shells"

 Ejecutar:   python test_plate_q4_validation.py
============================================================================
"""

import numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve
import time
import sys

# ============================================================================
#  PARAMETROS DEL PROBLEMA
# ============================================================================

Lx, Ly = 10.0, 10.0      # Dimensiones de la placa (m)
nx, ny = 16, 16            # Numero de elementos en x, y
E      = 30e6              # Modulo de Young (kN/m^2) — concreto ~30 GPa
nu     = 0.3               # Relacion de Poisson
t      = 0.20              # Espesor (m)
q      = -10.0             # Presion uniforme (kN/m^2, negativa = hacia abajo)
kappa  = 5.0 / 6.0         # Factor de correccion de cortante (Mindlin)

print("=" * 72)
print("  VALIDACION: Elemento Q4 Mindlin-Reissner")
print("  Python/NumPy vs Solucion Analitica de Navier")
print("=" * 72)
print()
print(f"  Placa:     {Lx} x {Ly} m")
print(f"  Mesh:      {nx} x {ny} = {nx*ny} elementos Q4")
print(f"  Nodos:     {(nx+1)*(ny+1)}")
print(f"  Material:  E = {E:.0f} kN/m^2, nu = {nu}, t = {t} m")
print(f"  Carga:     q = {q} kN/m^2 (uniforme)")
print(f"  BC:        Simply supported (w=0 en bordes)")
print()

# ============================================================================
#  PASO 1: GENERACION DE MALLA
# ============================================================================
print("PASO 1: Generacion de malla rectangular Q4")
print("-" * 50)

dx = Lx / nx
dy = Ly / ny

# Nodos: (nx+1) x (ny+1)
n_nodes = (nx + 1) * (ny + 1)
n_elems = nx * ny
dof_per_node = 3  # w, beta_x, beta_y
n_dof = n_nodes * dof_per_node

coords = np.zeros((n_nodes, 2))
for j in range(ny + 1):
    for i in range(nx + 1):
        nid = j * (nx + 1) + i
        coords[nid] = [i * dx, j * dy]

# Conectividad: CCW
elements = np.zeros((n_elems, 4), dtype=int)
for j in range(ny):
    for i in range(nx):
        eid = j * nx + i
        n1 = j * (nx + 1) + i
        n2 = n1 + 1
        n3 = n2 + (nx + 1)
        n4 = n1 + (nx + 1)
        elements[eid] = [n1, n2, n3, n4]

print(f"  Nodos generados:    {n_nodes}")
print(f"  Elementos generados: {n_elems}")
print(f"  DOFs totales:       {n_dof}")
print()

# ============================================================================
#  PASO 2: FUNCIONES DE FORMA (Bilinear Q4)
# ============================================================================
print("PASO 2: Funciones de forma bilineares Q4")
print("-" * 50)
print("  N_i(xi,eta) = 1/4 * (1 + xi_i*xi) * (1 + eta_i*eta)")
print()
print("  Nodo 1: (xi,eta) = (-1,-1)")
print("  Nodo 2: (xi,eta) = (+1,-1)")
print("  Nodo 3: (xi,eta) = (+1,+1)")
print("  Nodo 4: (xi,eta) = (-1,+1)")
print()

XI  = np.array([-1, 1, 1, -1], dtype=float)
ETA = np.array([-1, -1, 1, 1], dtype=float)

def shape_functions(xi, eta):
    """N_i = 1/4 * (1 + xi_i*xi) * (1 + eta_i*eta)"""
    N = np.zeros(4)
    for i in range(4):
        N[i] = 0.25 * (1 + XI[i] * xi) * (1 + ETA[i] * eta)
    return N

def shape_derivs(xi, eta):
    """dN[i,0] = dNi/dxi,  dN[i,1] = dNi/deta"""
    dN = np.zeros((4, 2))
    for i in range(4):
        dN[i, 0] = 0.25 * XI[i]  * (1 + ETA[i] * eta)
        dN[i, 1] = 0.25 * ETA[i] * (1 + XI[i]  * xi)
    return dN

# ============================================================================
#  PASO 3: MATRICES CONSTITUTIVAS
# ============================================================================
print("PASO 3: Matrices constitutivas")
print("-" * 50)

D0 = E * t**3 / (12.0 * (1 - nu**2))
Db = D0 * np.array([
    [1,  nu, 0],
    [nu, 1,  0],
    [0,  0,  0.5 * (1 - nu)]
])

G = E / (2.0 * (1 + nu))
Ds0 = kappa * G * t
Ds = Ds0 * np.eye(2)

print(f"  Rigidez flexural D0 = Et^3/[12(1-nu^2)] = {D0:.4f}")
print()
print("  Db (3x3 bending):")
print(f"    [{Db[0,0]:.4f}  {Db[0,1]:.4f}  {Db[0,2]:.4f}]")
print(f"    [{Db[1,0]:.4f}  {Db[1,1]:.4f}  {Db[1,2]:.4f}]")
print(f"    [{Db[2,0]:.4f}  {Db[2,1]:.4f}  {Db[2,2]:.4f}]")
print()
print(f"  Rigidez cortante Ds0 = kappa*G*t = {Ds0:.4f}")
print()
print("  Ds (2x2 shear):")
print(f"    [{Ds[0,0]:.4f}  {Ds[0,1]:.4f}]")
print(f"    [{Ds[1,0]:.4f}  {Ds[1,1]:.4f}]")
print()

# ============================================================================
#  PASO 4: CUADRATURA DE GAUSS
# ============================================================================
print("PASO 4: Cuadratura de Gauss (Selective Reduced Integration)")
print("-" * 50)

gp2 = 1.0 / np.sqrt(3.0)
gauss_2x2 = [(-gp2, -gp2, 1.0), (gp2, -gp2, 1.0),
             (gp2, gp2, 1.0),   (-gp2, gp2, 1.0)]
gauss_1x1 = [(0.0, 0.0, 4.0)]

print(f"  Bending: 2x2 Gauss (full integration)")
print(f"    Puntos: +/-{gp2:.6f},  Pesos: 1.0")
print(f"  Shear:   1x1 Gauss (reduced integration)")
print(f"    Punto:  (0, 0),  Peso: 4.0")
print()
print("  SRI evita shear locking para placas delgadas (t/L < 1/20)")
print()

# ============================================================================
#  PASO 5: MATRIZ DE RIGIDEZ ELEMENTAL (12x12)
# ============================================================================
print("PASO 5: Calculo de matriz de rigidez elemental Ke (12x12)")
print("-" * 50)
print("  Ke = Kb(2x2) + Ks(1x1)")
print("  Kb = sum_gp{ Bb^T * Db * Bb * |J| * w }")
print("  Ks = sum_gp{ Bs^T * Ds * Bs * |J| * w }")
print()

def jacobian(node_coords, dN):
    """Compute 2x2 Jacobian, its inverse, and determinant."""
    J = np.zeros((2, 2))
    for i in range(4):
        J[0, 0] += dN[i, 0] * node_coords[i, 0]
        J[0, 1] += dN[i, 0] * node_coords[i, 1]
        J[1, 0] += dN[i, 1] * node_coords[i, 0]
        J[1, 1] += dN[i, 1] * node_coords[i, 1]
    detJ = J[0, 0] * J[1, 1] - J[0, 1] * J[1, 0]
    Jinv = np.array([[ J[1,1], -J[0,1]],
                     [-J[1,0],  J[0,0]]]) / detJ
    return J, Jinv, detJ

def phys_derivs(dN, Jinv):
    """Convert dN/dxi,deta -> dN/dx,dy"""
    dNdx = np.zeros((4, 2))
    for i in range(4):
        dNdx[i, 0] = Jinv[0, 0] * dN[i, 0] + Jinv[0, 1] * dN[i, 1]
        dNdx[i, 1] = Jinv[1, 0] * dN[i, 0] + Jinv[1, 1] * dN[i, 1]
    return dNdx

def bending_B(dNdx):
    """3x12 bending strain-displacement matrix.
    kappa = {d(bx)/dx, d(by)/dy, d(bx)/dy + d(by)/dx}
    DOF order: [w_i, bx_i, by_i]
    """
    Bb = np.zeros((3, 12))
    for i in range(4):
        col_bx = 3 * i + 1
        col_by = 3 * i + 2
        Bb[0, col_bx] = dNdx[i, 0]   # kxx = d(bx)/dx
        Bb[1, col_by] = dNdx[i, 1]   # kyy = d(by)/dy
        Bb[2, col_bx] = dNdx[i, 1]   # kxy = d(bx)/dy
        Bb[2, col_by] = dNdx[i, 0]   #     + d(by)/dx
    return Bb

def shear_B(N, dNdx):
    """2x12 shear strain-displacement matrix.
    gamma = {dw/dx - bx, dw/dy - by}
    """
    Bs = np.zeros((2, 12))
    for i in range(4):
        Bs[0, 3*i]     =  dNdx[i, 0]   # dw/dx
        Bs[0, 3*i + 1] = -N[i]          # -bx
        Bs[1, 3*i]     =  dNdx[i, 1]   # dw/dy
        Bs[1, 3*i + 2] = -N[i]          # -by
    return Bs

def element_stiffness(node_coords):
    """12x12 element stiffness with SRI."""
    Ke = np.zeros((12, 12))

    # Bending: 2x2 Gauss
    for xi, eta, w in gauss_2x2:
        dN = shape_derivs(xi, eta)
        _, Jinv, detJ = jacobian(node_coords, dN)
        dNdx = phys_derivs(dN, Jinv)
        Bb = bending_B(dNdx)
        Ke += w * detJ * (Bb.T @ Db @ Bb)

    # Shear: 1x1 Gauss (reduced)
    for xi, eta, w in gauss_1x1:
        N = shape_functions(xi, eta)
        dN = shape_derivs(xi, eta)
        _, Jinv, detJ = jacobian(node_coords, dN)
        dNdx = phys_derivs(dN, Jinv)
        Bs = shear_B(N, dNdx)
        Ke += w * detJ * (Bs.T @ Ds @ Bs)

    return Ke

def element_load(node_coords, pressure):
    """12x1 consistent load vector for uniform pressure."""
    fe = np.zeros(12)
    for xi, eta, w in gauss_2x2:
        N = shape_functions(xi, eta)
        dN = shape_derivs(xi, eta)
        _, _, detJ = jacobian(node_coords, dN)
        for i in range(4):
            fe[3 * i] += N[i] * pressure * detJ * w
    return fe

# Verificar un elemento
test_nodes = coords[elements[0]]
Ke_test = element_stiffness(test_nodes)
print(f"  Ke[0] simetrica: {np.allclose(Ke_test, Ke_test.T)}")
print(f"  Ke[0] eigenvalores (primeros 5):")
eigs = np.sort(np.linalg.eigvalsh(Ke_test))
for i, ev in enumerate(eigs[:7]):
    print(f"    lambda_{i+1} = {ev:.6e}  {'(~0 RBM/spurious)' if abs(ev) < 1e-6 else ''}")
print()

# ============================================================================
#  PASO 6: ENSAMBLAJE GLOBAL
# ============================================================================
print("PASO 6: Ensamblaje global K y F")
print("-" * 50)

t0 = time.perf_counter()

K = lil_matrix((n_dof, n_dof))
F = np.zeros(n_dof)

for e in range(n_elems):
    elem = elements[e]
    node_coords = coords[elem]

    Ke = element_stiffness(node_coords)
    fe = element_load(node_coords, q)

    # DOF mapping
    dof_map = []
    for ni in elem:
        for d in range(3):
            dof_map.append(3 * ni + d)

    for ii in range(12):
        F[dof_map[ii]] += fe[ii]
        for jj in range(12):
            K[dof_map[ii], dof_map[jj]] += Ke[ii, jj]

K = K.tocsr()
t_assembly = time.perf_counter() - t0

print(f"  K: {n_dof}x{n_dof} sparse, nnz = {K.nnz}")
print(f"  Tiempo de ensamblaje: {t_assembly*1000:.1f} ms")
print()

# ============================================================================
#  PASO 7: CONDICIONES DE BORDE (Penalty Method)
# ============================================================================
print("PASO 7: Condiciones de borde — Simply Supported (w=0 en bordes)")
print("-" * 50)

penalty = 1e20
n_bc = 0
tol = 1e-10

K_pen = K.tolil()
for i in range(n_nodes):
    x, y = coords[i]
    on_boundary = (x < tol or x > Lx - tol or y < tol or y > Ly - tol)
    if on_boundary:
        gdof = 3 * i  # w DOF
        K_pen[gdof, gdof] += penalty
        F[gdof] += penalty * 0.0
        n_bc += 1

K_pen = K_pen.tocsr()
print(f"  Nodos restringidos: {n_bc} (w=0 en bordes)")
print(f"  Metodo: penalidad ({penalty:.0e})")
print()

# ============================================================================
#  PASO 8: SOLUCION K*u = F
# ============================================================================
print("PASO 8: Solucion del sistema K*u = F")
print("-" * 50)

t0 = time.perf_counter()
u = spsolve(K_pen, F)
t_solve = time.perf_counter() - t0

print(f"  Solver: scipy.sparse.linalg.spsolve (SuperLU)")
print(f"  Tiempo de solucion: {t_solve*1000:.1f} ms")
print()

# ============================================================================
#  PASO 9: POST-PROCESAMIENTO
# ============================================================================
print("PASO 9: Resultados")
print("-" * 50)

# Desplazamiento maximo
w_all = u[0::3]  # w DOF
w_max = np.min(w_all)  # most negative
w_center_idx = None
min_dist = 1e10
cx, cy = Lx / 2, Ly / 2
for i in range(n_nodes):
    d = np.sqrt((coords[i, 0] - cx)**2 + (coords[i, 1] - cy)**2)
    if d < min_dist:
        min_dist = d
        w_center_idx = i

w_center = u[3 * w_center_idx]

print(f"  w_max     = {w_max:.10e}")
print(f"  w_center  = {w_center:.10e}")
print()

# Momentos en el centro (elemento mas cercano al centro)
def element_stress_resultants(node_coords, d_e):
    """Recover Mxx, Myy, Mxy, Qx, Qy at element center."""
    N = shape_functions(0, 0)
    dN = shape_derivs(0, 0)
    _, Jinv, _ = jacobian(node_coords, dN)
    dNdx = phys_derivs(dN, Jinv)

    Bb = bending_B(dNdx)
    Bs = shear_B(N, dNdx)

    kappa_vec = Bb @ d_e
    gamma_vec = Bs @ d_e

    M = Db @ kappa_vec
    Q = Ds @ gamma_vec

    return M[0], M[1], M[2], Q[0], Q[1]

# Encontrar elemento mas cercano al centro
center_elem = None
min_dist = 1e10
for e in range(n_elems):
    elem_center = np.mean(coords[elements[e]], axis=0)
    d = np.linalg.norm(elem_center - np.array([cx, cy]))
    if d < min_dist:
        min_dist = d
        center_elem = e

elem = elements[center_elem]
node_c = coords[elem]
d_e = np.zeros(12)
for i in range(4):
    for d in range(3):
        d_e[3*i + d] = u[3*elem[i] + d]

Mxx, Myy, Mxy, Qx, Qy = element_stress_resultants(node_c, d_e)
print(f"  Momentos en elemento central ({center_elem}):")
print(f"    Mxx = {Mxx:.6f} kN*m/m")
print(f"    Myy = {Myy:.6f} kN*m/m")
print(f"    Mxy = {Mxy:.6f} kN*m/m")
print(f"    Qx  = {Qx:.6f} kN/m")
print(f"    Qy  = {Qy:.6f} kN/m")
print()

# Max moments over all elements
all_Mxx = []
all_Myy = []
all_Mxy = []
all_Qx  = []
all_Qy  = []
for e in range(n_elems):
    elem = elements[e]
    nc = coords[elem]
    de = np.zeros(12)
    for i in range(4):
        for d in range(3):
            de[3*i+d] = u[3*elem[i]+d]
    mxx, myy, mxy, qx, qy = element_stress_resultants(nc, de)
    all_Mxx.append(mxx)
    all_Myy.append(myy)
    all_Mxy.append(mxy)
    all_Qx.append(qx)
    all_Qy.append(qy)

print(f"  Maximos globales:")
print(f"    |Mxx|_max = {max(abs(np.array(all_Mxx))):.6f}")
print(f"    |Myy|_max = {max(abs(np.array(all_Myy))):.6f}")
print(f"    |Mxy|_max = {max(abs(np.array(all_Mxy))):.6f}")
print(f"    |Qx|_max  = {max(abs(np.array(all_Qx))):.6f}")
print(f"    |Qy|_max  = {max(abs(np.array(all_Qy))):.6f}")
print()

# ============================================================================
#  PASO 10: COMPARACION CON SOLUCION ANALITICA (Navier)
# ============================================================================
print("PASO 10: Comparacion con solucion analitica de Navier")
print("-" * 50)

def navier_w(a, b, q_load, D_flex, x, y, n_terms=50):
    """Navier series for SS rectangular plate under uniform load."""
    w = 0.0
    for m in range(1, n_terms + 1, 2):
        for n in range(1, n_terms + 1, 2):
            amn = (m * np.pi / a)**2 + (n * np.pi / b)**2
            qmn = 16 * q_load / (np.pi**2 * m * n)
            w += qmn / (D_flex * amn**2) * np.sin(m*np.pi*x/a) * np.sin(n*np.pi*y/b)
    return w

def navier_Mxx(a, b, q_load, D_flex, nu_val, x, y, n_terms=50):
    """Navier series for Mxx at (x,y)."""
    Mxx = 0.0
    for m in range(1, n_terms + 1, 2):
        for n in range(1, n_terms + 1, 2):
            alpha_m = m * np.pi / a
            alpha_n = n * np.pi / b
            amn = alpha_m**2 + alpha_n**2
            qmn = 16 * q_load / (np.pi**2 * m * n)
            w_mn = qmn / (D_flex * amn**2)
            Mxx += D_flex * (alpha_m**2 + nu_val * alpha_n**2) * w_mn * np.sin(m*np.pi*x/a) * np.sin(n*np.pi*y/b)
    return Mxx

D_flex = E * t**3 / (12 * (1 - nu**2))
w_navier = navier_w(Lx, Ly, abs(q), D_flex, cx, cy)
Mxx_navier = navier_Mxx(Lx, Ly, abs(q), D_flex, nu, cx, cy)

err_w = abs((abs(w_center) - w_navier) / w_navier * 100)
err_M = abs((abs(Mxx) - Mxx_navier) / Mxx_navier * 100) if Mxx_navier != 0 else 0

print(f"  D = Et^3/[12(1-nu^2)] = {D_flex:.4f}")
print()
print(f"  {'Metrica':<20} {'Python Q4':>15} {'Navier':>15} {'Error':>10}")
print(f"  {'-'*20} {'-'*15} {'-'*15} {'-'*10}")
print(f"  {'w_center':<20} {abs(w_center):>15.8e} {w_navier:>15.8e} {err_w:>9.2f}%")
print(f"  {'Mxx_center':<20} {abs(Mxx):>15.8e} {Mxx_navier:>15.8e} {err_M:>9.2f}%")
print()

# ============================================================================
#  PASO 11: COMPARACION CON RESULTADOS WASM
# ============================================================================
print("PASO 11: Comparacion con resultados WASM (Hekatan)")
print("-" * 50)

# Valores del WASM (obtenidos del browser)
wasm_w_center = -1.881942e-2
wasm_Mxx_max = 4.8068e+1
wasm_Myy_max = 4.8068e+1
wasm_Mxy_max = 3.4913e+1
wasm_Qx_max  = -7.8600e+1
wasm_Qy_max  = -7.8600e+1

# Accept from command line
if len(sys.argv) > 1:
    wasm_w_center = float(sys.argv[1])
if len(sys.argv) > 2:
    wasm_Mxx_max = float(sys.argv[2])

diff_w = abs((w_center - wasm_w_center) / wasm_w_center * 100) if wasm_w_center != 0 else 0
diff_Mxx = abs((max(abs(np.array(all_Mxx))) - abs(wasm_Mxx_max)) / abs(wasm_Mxx_max) * 100)

print(f"  {'Metrica':<20} {'Python':>15} {'WASM':>15} {'Diff':>10}")
print(f"  {'-'*20} {'-'*15} {'-'*15} {'-'*10}")
print(f"  {'w_center':<20} {w_center:>15.8e} {wasm_w_center:>15.8e} {diff_w:>9.4f}%")
print(f"  {'|Mxx|_max':<20} {max(abs(np.array(all_Mxx))):>15.8e} {abs(wasm_Mxx_max):>15.8e} {diff_Mxx:>9.4f}%")
print(f"  {'|Myy|_max':<20} {max(abs(np.array(all_Myy))):>15.8e} {abs(wasm_Myy_max):>15.8e}")
print(f"  {'|Mxy|_max':<20} {max(abs(np.array(all_Mxy))):>15.8e} {abs(wasm_Mxy_max):>15.8e}")
print(f"  {'|Qx|_max':<20} {max(abs(np.array(all_Qx))):>15.8e} {abs(wasm_Qx_max):>15.8e}")
print(f"  {'|Qy|_max':<20} {max(abs(np.array(all_Qy))):>15.8e} {abs(wasm_Qy_max):>15.8e}")
print()

# ============================================================================
#  RESUMEN
# ============================================================================
print("=" * 72)
print("  RESUMEN")
print("=" * 72)

all_pass = True
checks = [
    ("Python vs Navier (w)",   err_w,   5.0),
    ("Python vs Navier (Mxx)", err_M,   5.0),
    ("Python vs WASM (w)",     diff_w,  0.01),
    ("Python vs WASM (Mxx)",   diff_Mxx, 0.01),
]

for name, err, tol_val in checks:
    status = "PASS" if err < tol_val else "FAIL"
    if err >= tol_val:
        all_pass = False
    print(f"  {status}  {name:<30}  error = {err:.4f}%  (tol = {tol_val}%)")

print()
if all_pass:
    print("  TODOS LOS TESTS PASAN")
else:
    print("  ALGUNOS TESTS FALLARON")

print()
print(f"  Tiempo total: ensamblaje {t_assembly*1000:.1f} ms + solve {t_solve*1000:.1f} ms")
print("=" * 72)
