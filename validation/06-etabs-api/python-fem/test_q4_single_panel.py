"""
Debug: Single panel Q4 plate with 4 corner supports
If this gives wrong results, the element formulation has a fundamental issue
"""
import numpy as np
from scipy import sparse
from scipy.sparse.linalg import spsolve
import openseespy.opensees as ops

# Parameters
Lx, Ly = 4.0, 3.0
nx, ny = 8, 6
dx, dy = Lx / nx, Ly / ny
E, nu, t = 35e6, 0.2, 0.2
q = -10.0
kappa_s = 5.0 / 6.0
G = E / (2 * (1 + nu))

DOFS = 3
nNodesX = nx + 1
nNodesY = ny + 1
nNodes = nNodesX * nNodesY
nDofs = nNodes * DOFS

node_x = np.zeros(nNodes)
node_y = np.zeros(nNodes)
for j in range(nNodesY):
    for i in range(nNodesX):
        idx = j * nNodesX + i
        node_x[idx] = i * dx
        node_y[idx] = j * dy

XI  = np.array([-1, 1, 1, -1], dtype=float)
ETA = np.array([-1, -1, 1, 1], dtype=float)

def shape_funcs(xi, eta):
    return 0.25 * (1 + XI * xi) * (1 + ETA * eta)

def shape_derivs(xi, eta):
    dN_dxi  = 0.25 * XI  * (1 + ETA * eta)
    dN_deta = 0.25 * ETA * (1 + XI * xi)
    return np.column_stack([dN_dxi, dN_deta])

gp2 = 1.0 / np.sqrt(3)
GP2 = [(-gp2, -gp2, 1.0), (gp2, -gp2, 1.0), (gp2, gp2, 1.0), (-gp2, gp2, 1.0)]
GP1 = [(0.0, 0.0, 4.0)]

D0 = E * t**3 / (12 * (1 - nu**2))
Db = D0 * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, 0.5*(1-nu)]])
Ds0 = kappa_s * G * t
Ds = Ds0 * np.eye(2)

# Assemble
rows, cols, vals = [], [], []
F = np.zeros(nDofs)

for j in range(ny):
    for i in range(nx):
        n0 = j * nNodesX + i
        elem_nodes = [n0, n0+1, n0+nNodesX+1, n0+nNodesX]
        enodes_xy = np.array([[node_x[n], node_y[n]] for n in elem_nodes])

        Ke = np.zeros((12, 12))
        fe = np.zeros(12)

        for xi, eta, wt in GP2:
            dN = shape_derivs(xi, eta)
            J = dN.T @ enodes_xy
            detJ = np.linalg.det(J)
            Jinv = np.linalg.inv(J)
            dNdx = dN @ Jinv.T

            Bb = np.zeros((3, 12))
            for ii in range(4):
                Bb[0, 3*ii+1] = dNdx[ii, 0]
                Bb[1, 3*ii+2] = dNdx[ii, 1]
                Bb[2, 3*ii+1] = dNdx[ii, 1]
                Bb[2, 3*ii+2] = dNdx[ii, 0]
            Ke += wt * detJ * (Bb.T @ Db @ Bb)

            N = shape_funcs(xi, eta)
            for ii in range(4):
                fe[3*ii] += N[ii] * q * detJ * wt

        for xi, eta, wt in GP1:
            N = shape_funcs(xi, eta)
            dN = shape_derivs(xi, eta)
            J = dN.T @ enodes_xy
            detJ = np.linalg.det(J)
            Jinv = np.linalg.inv(J)
            dNdx = dN @ Jinv.T

            Bs = np.zeros((2, 12))
            for ii in range(4):
                Bs[0, 3*ii]   =  dNdx[ii, 0]
                Bs[0, 3*ii+1] = -N[ii]
                Bs[1, 3*ii]   =  dNdx[ii, 1]
                Bs[1, 3*ii+2] = -N[ii]
            Ke += wt * detJ * (Bs.T @ Ds @ Bs)

        dof_map = []
        for n in elem_nodes:
            for d in range(3):
                dof_map.append(3 * n + d)

        for ii in range(12):
            F[dof_map[ii]] += fe[ii]
            for jj in range(12):
                rows.append(dof_map[ii])
                cols.append(dof_map[jj])
                vals.append(Ke[ii, jj])

K = sparse.coo_matrix((vals, (rows, cols)), shape=(nDofs, nDofs)).tocsc()

# ===== TEST A: SS on all edges (like Hekatan bcType="simply-supported") =====
print("=" * 60)
print("TEST A: Simply Supported on all edges (w=0)")
edge_dofs = []
for j in range(nNodesY):
    for i in range(nNodesX):
        idx = j * nNodesX + i
        if i == 0 or i == nx or j == 0 or j == ny:
            edge_dofs.append(3 * idx)  # w DOF

free_A = sorted(set(range(nDofs)) - set(edge_dofs))
u_A = np.zeros(nDofs)
u_A[free_A] = spsolve(K[np.ix_(free_A, free_A)], F[free_A])
w_A = u_A[0::3]
center = (ny//2) * nNodesX + nx//2
print(f"  w_center = {w_A[center]:.6e}")
print(f"  min_w = {np.min(w_A):.6e}, max_w = {np.max(w_A):.6e}")
print(f"  Positive w: {np.sum(w_A > 1e-10)}")

# Navier analytical
D = E * t**3 / (12 * (1 - nu**2))
w_nav = 0
for m in range(1, 20, 2):
    for n in range(1, 20, 2):
        mn = (m**2 / Lx**2 + n**2 / Ly**2)
        w_nav += 1 / (m * n * mn**2)
w_nav *= 16 * abs(q) / (np.pi**6 * D)
print(f"  Navier: w_center = {w_nav:.6e}")
err = abs((abs(w_A[center]) - w_nav) / w_nav * 100)
print(f"  Error: {err:.2f}%")

# ===== TEST B: 4 corner supports only =====
print("\n" + "=" * 60)
print("TEST B: 4 corner supports only (w=0 at corners)")
corners = [0, nx, ny*nNodesX, ny*nNodesX+nx]
corner_dofs = [3*c for c in corners]

free_B = sorted(set(range(nDofs)) - set(corner_dofs))
u_B = np.zeros(nDofs)
u_B[free_B] = spsolve(K[np.ix_(free_B, free_B)], F[free_B])
w_B = u_B[0::3]
print(f"  w_center = {w_B[center]:.6e}")
print(f"  min_w = {np.min(w_B):.6e}, max_w = {np.max(w_B):.6e}")
print(f"  Positive w: {np.sum(w_B > 1e-10)}")

# ===== OpenSees comparison: 4 corner supports =====
print("\n" + "=" * 60)
print("TEST B-OS: OpenSees 4 corner supports")
ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

nid = 1
nm = {}
for j in range(nNodesY):
    for i in range(nNodesX):
        ops.node(nid, i*dx, j*dy, 0.0)
        nm[(i,j)] = nid
        nid += 1

ops.nDMaterial('ElasticIsotropic', 1, E, nu)
ops.section('PlateFiber', 1, 1, t)

eid = 1
for j in range(ny):
    for i in range(nx):
        ops.element('ShellMITC4', eid, nm[(i,j)], nm[(i+1,j)], nm[(i+1,j+1)], nm[(i,j+1)], 1)
        eid += 1

# Fix corners
for (ci,cj) in [(0,0), (nx,0), (0,ny), (nx,ny)]:
    ops.fix(nm[(ci,cj)], 0, 0, 1, 0, 0, 0)  # Fix Uz only

# Fix in-plane rigid body
ops.fix(nm[(0,0)], 1, 1, 0, 0, 0, 0)
ops.fix(nm[(nx,0)], 0, 1, 0, 0, 0, 0)
ops.fix(nm[(0,ny)], 1, 0, 0, 0, 0, 0)

ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)
for j in range(nNodesY):
    for i in range(nNodesX):
        fx = dx; fy = dy
        if i == 0 or i == nx: fx = dx/2
        if j == 0 or j == ny: fy = dy/2
        ops.load(nm[(i,j)], 0, 0, q*fx*fy, 0, 0, 0)

ops.system('BandSPD')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

w_os_center = ops.nodeDisp(nm[(nx//2, ny//2)], 3)
w_os = [ops.nodeDisp(nm[(i,j)], 3) for j in range(nNodesY) for i in range(nNodesX)]
w_os = np.array(w_os)
print(f"  w_center = {w_os_center:.6e}")
print(f"  min_w = {np.min(w_os):.6e}, max_w = {np.max(w_os):.6e}")
print(f"  Positive w: {np.sum(w_os > 1e-10)}")
ops.wipe()

# Compare
print("\n" + "=" * 60)
print("COMPARISON: Python Q4 vs OpenSees (4 corner supports)")
print(f"  Python:   w_center = {w_B[center]:.6e}, positive = {np.sum(w_B > 1e-10)}")
print(f"  OpenSees: w_center = {w_os_center:.6e}, positive = {np.sum(w_os > 1e-10)}")
