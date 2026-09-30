"""
Verification: Flat Slab Q4 with point column supports
Compare OpenSees ShellMITC4 vs Hekatan WASM result

Mesh: 26x16 Q4 elements on 15.6×9.6m plate
Columns at grid intersections: x=[0, 3.6, 7.8, 12, 15.6], y=[0, 3, 6.6, 9.6]
Uniform pressure q=-10 kN/m² (downward)
E=35e6 kPa, nu=0.2, t=0.2m
"""

import openseespy.opensees as ops
import numpy as np

ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# Parameters
La, Lb = 15.6, 9.6
nx, ny = 26, 16
dx, dy = La / nx, Lb / ny
E, nu, t = 35e6, 0.2, 0.2
q = -10.0  # kN/m² downward

# Column positions
colX = [0, 3.6, 7.8, 12.0, 15.6]
colY = [0, 3.0, 6.6, 9.6]

# Generate nodes
nid = 1
node_map = {}  # (i,j) -> nodeTag
for j in range(ny + 1):
    for i in range(nx + 1):
        x = i * dx
        y = j * dy
        ops.node(nid, x, y, 0.0)
        node_map[(i, j)] = nid
        nid += 1

print(f"Nodes: {nid - 1}")

# Material: ElasticIsotropic
matTag = 1
ops.nDMaterial('ElasticIsotropic', matTag, E, nu)

# Section: PlateFiber (single layer for Mindlin plate)
secTag = 1
ops.section('PlateFiber', secTag, matTag, t)

# Elements: ShellMITC4
eid = 1
for j in range(ny):
    for i in range(nx):
        n1 = node_map[(i, j)]
        n2 = node_map[(i + 1, j)]
        n3 = node_map[(i + 1, j + 1)]
        n4 = node_map[(i, j + 1)]
        ops.element('ShellMITC4', eid, n1, n2, n3, n4, secTag)
        eid += 1

print(f"Elements: {eid - 1}")

# Column supports: fix w (DOF 3 = Uz) at column nodes
col_nodes = set()
for cx in colX:
    for cy in colY:
        # Find nearest node
        best_d, best_n = 1e10, None
        for (i, j), nTag in node_map.items():
            x, y = i * dx, j * dy
            d = np.hypot(x - cx, y - cy)
            if d < best_d:
                best_d = d
                best_n = nTag
        col_nodes.add(best_n)
        # Fix Uz (DOF 3) only — pin support
        ops.fix(best_n, 0, 0, 1, 0, 0, 0)

# Need at least 3 non-collinear nodes fixed in-plane to prevent rigid body motion
# Fix node 1 (corner) in all DOFs except Uz (already fixed)
corner1 = node_map[(0, 0)]
corner2 = node_map[(nx, 0)]
corner3 = node_map[(0, ny)]
ops.fix(corner1, 1, 1, 0, 0, 0, 0)  # Fix Ux, Uy (Uz already fixed)
ops.fix(corner2, 0, 1, 0, 0, 0, 0)  # Fix Uy
ops.fix(corner3, 1, 0, 0, 0, 0, 0)  # Fix Ux

print(f"Column nodes: {len(col_nodes)}")

# Uniform pressure as consistent nodal loads
# Each node gets tributary area * q
# Interior: dx*dy, edge: dx*dy/2, corner: dx*dy/4
ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)

for j in range(ny + 1):
    for i in range(nx + 1):
        nTag = node_map[(i, j)]
        # Tributary area
        fx = dx
        if i == 0 or i == nx:
            fx = dx / 2
        fy = dy
        if j == 0 or j == ny:
            fy = dy / 2
        area = fx * fy
        fz = q * area  # Force = pressure * area
        ops.load(nTag, 0, 0, fz, 0, 0, 0)

# Analysis
ops.system('BandSPD')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

# Extract results
print("\n=== RESULTS ===")
all_w = []
for j in range(ny + 1):
    for i in range(nx + 1):
        nTag = node_map[(i, j)]
        w = ops.nodeDisp(nTag, 3)  # Uz
        all_w.append(w)

all_w = np.array(all_w)
pos_count = np.sum(all_w > 1e-10)
neg_count = np.sum(all_w < -1e-10)
zero_count = np.sum(np.abs(all_w) <= 1e-10)

print(f"Total nodes: {len(all_w)}")
print(f"Positive w (UP): {pos_count}")
print(f"Negative w (DOWN): {neg_count}")
print(f"~Zero w: {zero_count}")
print(f"min_w = {np.min(all_w):.6e} (max downward)")
print(f"max_w = {np.max(all_w):.6e} (max upward)")

# Check specific nodes
# Node at (7.80, 4.80) — should be index (13, 8) in 0-based
i_check, j_check = 13, 8
nTag_check = node_map[(i_check, j_check)]
x_check, y_check = i_check * dx, j_check * dy
w_check = ops.nodeDisp(nTag_check, 3)
print(f"\nNode ({x_check:.2f}, {y_check:.2f}): w = {w_check:.6e}")

# Compare with Hekatan
hekatan_w229 = 1.1744e-3
print(f"Hekatan node 229 (7.80, 4.80): w = {hekatan_w229:.6e}")
print(f"Difference: {abs(w_check - hekatan_w229):.6e}")

# Check a few more interior nodes
print("\n--- Interior node comparison ---")
check_points = [(3, 3), (13, 5), (10, 8), (20, 12)]
for (ci, cj) in check_points:
    nTag = node_map[(ci, cj)]
    x, y = ci * dx, cj * dy
    w = ops.nodeDisp(nTag, 3)
    hekatan_idx = cj * (nx + 1) + ci
    print(f"  Node ({x:.2f}, {y:.2f}) [idx={hekatan_idx}]: w = {w:.6e}")

# Check column nodes
print("\n--- Column nodes ---")
for cn in sorted(col_nodes):
    w = ops.nodeDisp(cn, 3)
    print(f"  Column node {cn}: w = {w:.6e}")

ops.wipe()
