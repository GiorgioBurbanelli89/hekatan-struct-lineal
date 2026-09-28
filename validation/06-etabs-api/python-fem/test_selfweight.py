"""
Comparacion Self-Weight: Hekatan Clone vs OpenSeesPy
Modelo: 1 piso, 2x2 vanos, frames + losa + muros
Verifica que el peso propio se calcula correctamente
"""
import openseespy.opensees as ops
import numpy as np

Lx, Ly, H = 5.0, 4.0, 3.0
Es, Gs = 200e6, 77e6  # kN/m2
rho_s = 7850 / 1000    # kg/m3 -> ton/m3 (for mass)
Ec = 25e6
nu_c = 0.2
Gc = Ec / (2*(1+nu_c))
rho_c = 2400 / 1000    # ton/m3

col_A = 0.16   # 0.40x0.40
col_I = 2.13e-3
col_J = 3.6e-3
beam_A = 0.12  # 0.30x0.40
beam_I = 1.6e-3
beam_J = 2.0e-3
t_slab = 0.15

# ===================================================
# OpenSees: Frame + Slab with self-weight
# ===================================================
ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

nx, ny = 3, 3  # 2x2 bays = 3x3 grid

# Nodes: 2 levels (base + floor)
nid = {}
tag = 0
for iz in range(2):
    for iy in range(ny):
        for ix in range(nx):
            tag += 1
            nid[(ix,iy,iz)] = tag
            ops.node(tag, ix*Lx, iy*Ly, iz*H)

# Fix base
for iy in range(ny):
    for ix in range(nx):
        ops.fix(nid[(ix,iy,0)], 1,1,1,1,1,1)

# Transforms
ops.geomTransf('Linear', 1, -1,0,0)  # columns
ops.geomTransf('Linear', 2, 0,0,1)   # beams

# Elements
etag = 0

# Columns
for iy in range(ny):
    for ix in range(nx):
        etag += 1
        ops.element('elasticBeamColumn', etag,
                     nid[(ix,iy,0)], nid[(ix,iy,1)],
                     col_A, Es, Gs, col_J, col_I, col_I, 1,
                     '-mass', rho_s * col_A)  # mass per unit length

# Beams X
for iy in range(ny):
    for ix in range(nx-1):
        etag += 1
        ops.element('elasticBeamColumn', etag,
                     nid[(ix,iy,1)], nid[(ix+1,iy,1)],
                     beam_A, Es, Gs, beam_J, beam_I, beam_I, 2,
                     '-mass', rho_s * beam_A)

# Beams Y
for ix in range(nx):
    for iy in range(ny-1):
        etag += 1
        ops.element('elasticBeamColumn', etag,
                     nid[(ix,iy,1)], nid[(ix,iy+1,1)],
                     beam_A, Es, Gs, beam_J, beam_I, beam_I, 2,
                     '-mass', rho_s * beam_A)

# Slab shells (2x2 mesh = 4 Q4 per bay)
ops.nDMaterial('ElasticIsotropic', 1, Ec, nu_c, rho_c)
ops.section('PlateFiber', 1, 1, t_slab)

for by in range(ny-1):
    for bx in range(nx-1):
        n1 = nid[(bx, by, 1)]
        n2 = nid[(bx+1, by, 1)]
        n3 = nid[(bx+1, by+1, 1)]
        n4 = nid[(bx, by+1, 1)]
        etag += 1
        ops.element('ShellMITC4', etag, n1, n2, n3, n4, 1)

print(f"OpenSees: {tag} nodes, {etag} elements")

# Self-weight: gravity load
ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)

# Apply self-weight via eleLoad (gravity body force)
for i in range(1, etag+1):
    try:
        ops.eleLoad('-ele', i, '-type', '-selfWeight', 0, 0, -1)
    except:
        pass  # ShellMITC4 may not support eleLoad selfWeight

# Also add nodal mass and gravity as inertial
g = 9.81
for n in range(1, tag+1):
    try:
        m = ops.nodeMass(n, 1)
        if m > 0:
            ops.load(n, 0, 0, -m*g, 0, 0, 0)
    except:
        pass

# Add slab dead load manually (rho * t * g * area_trib)
slab_w = rho_c * t_slab * g  # kN/m2
for by in range(ny-1):
    for bx in range(nx-1):
        area = Lx * Ly
        w_node = -slab_w * area / 4  # 4 corner nodes per bay
        for (dix,diy) in [(0,0),(1,0),(1,1),(0,1)]:
            n = nid[(bx+dix, by+diy, 1)]
            ops.load(n, 0, 0, w_node, 0, 0, 0)

# Beam self-weight as distributed load
for iy in range(ny):
    for ix in range(nx-1):
        w_beam = -rho_s * beam_A * g  # kN/m
        ops.load(nid[(ix,iy,1)], 0, 0, w_beam*Lx/2, 0, 0, 0)
        ops.load(nid[(ix+1,iy,1)], 0, 0, w_beam*Lx/2, 0, 0, 0)

for ix in range(nx):
    for iy in range(ny-1):
        w_beam = -rho_s * beam_A * g
        ops.load(nid[(ix,iy,1)], 0, 0, w_beam*Ly/2, 0, 0, 0)
        ops.load(nid[(ix,iy+1,1)], 0, 0, w_beam*Ly/2, 0, 0, 0)

# Column self-weight
for iy in range(ny):
    for ix in range(nx):
        w_col = -rho_s * col_A * g * H / 2
        ops.load(nid[(ix,iy,1)], 0, 0, w_col, 0, 0, 0)

ops.system('BandGeneral')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

print("\n" + "="*55)
print("  Self-Weight Results (OpenSeesPy)")
print("="*55)
print(f"  Slab dead load: {slab_w:.2f} kN/m2")
print(f"  Column weight:  {rho_s*col_A*g*H:.2f} kN each")
print(f"  Beam X weight:  {rho_s*beam_A*g*Lx:.2f} kN each")
print(f"  Beam Y weight:  {rho_s*beam_A*g*Ly:.2f} kN each")
print()

max_uz = 0
for iy in range(ny):
    for ix in range(nx):
        n = nid[(ix,iy,1)]
        d = ops.nodeDisp(n)
        uz = d[2]
        max_uz = max(max_uz, abs(uz))
        if ix == 1 and iy == 1:  # center node
            print(f"  Center node ({ix},{iy}): uz = {uz*1000:.4f} mm")

print(f"\n  Max vertical displacement: {max_uz*1000:.4f} mm")
print(f"  (negative = downward = correct)")

# Total reactions
total_Rz = 0
for iy in range(ny):
    for ix in range(nx):
        n = nid[(ix,iy,0)]
        r = ops.nodeReaction(n)
        total_Rz += r[2]

total_weight = (rho_s * col_A * H * nx * ny +
                rho_s * beam_A * Lx * (nx-1) * ny +
                rho_s * beam_A * Ly * nx * (ny-1) +
                rho_c * t_slab * Lx * Ly * (nx-1) * (ny-1)) * g

print(f"\n  Total Rz (reactions):  {total_Rz:.2f} kN")
print(f"  Total weight (calc):  {total_weight:.2f} kN")
print(f"  Ratio Rz/W: {total_Rz/total_weight:.4f} (should be ~1.0)")

print("\n  Use these values to compare with Hekatan clone")
print("="*55)
