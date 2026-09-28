"""
Test exacto: 1 piso, 1 vano, frames + 1 losa Q4
Compara desplazamientos OpenSees vs lo que debe dar Hekatan
"""
import openseespy.opensees as ops
import numpy as np

Lx, Ly, H = 5.0, 4.0, 3.0
Es = 200e6  # kN/m2
Gs = 77e6
Ec = 25e6
nu_c = 0.2
rho_s = 7.85  # kN*s2/m4
rho_c = 2.45

col_A = 0.16; col_I = 2.13e-3; col_J = 3.6e-3
beam_A = 0.12; beam_I = 1.6e-3; beam_J = 2.0e-3
t_slab = 0.15

g = 9.81
P_gravity = -50  # kN per top node (CM+CV)
F_lateral = 20   # kN lateral

ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# 8 nodes: 4 base + 4 top
ops.node(1, 0, 0, 0)
ops.node(2, Lx, 0, 0)
ops.node(3, Lx, Ly, 0)
ops.node(4, 0, Ly, 0)
ops.node(5, 0, 0, H)
ops.node(6, Lx, 0, H)
ops.node(7, Lx, Ly, H)
ops.node(8, 0, Ly, H)

for n in [1,2,3,4]:
    ops.fix(n, 1,1,1,1,1,1)

ops.geomTransf('Linear', 1, -1,0,0)
ops.geomTransf('Linear', 2, 0,0,1)
ops.geomTransf('Linear', 3, 0,0,1)

# 4 columns
ops.element('elasticBeamColumn', 1, 1, 5, col_A, Es, Gs, col_J, col_I, col_I, 1)
ops.element('elasticBeamColumn', 2, 2, 6, col_A, Es, Gs, col_J, col_I, col_I, 1)
ops.element('elasticBeamColumn', 3, 3, 7, col_A, Es, Gs, col_J, col_I, col_I, 1)
ops.element('elasticBeamColumn', 4, 4, 8, col_A, Es, Gs, col_J, col_I, col_I, 1)

# 4 beams
ops.element('elasticBeamColumn', 5, 5, 6, beam_A, Es, Gs, beam_J, beam_I, beam_I, 2)
ops.element('elasticBeamColumn', 6, 7, 8, beam_A, Es, Gs, beam_J, beam_I, beam_I, 2)
ops.element('elasticBeamColumn', 7, 5, 8, beam_A, Es, Gs, beam_J, beam_I, beam_I, 3)
ops.element('elasticBeamColumn', 8, 6, 7, beam_A, Es, Gs, beam_J, beam_I, beam_I, 3)

# 1 slab Q4 (nodes 5,6,7,8 = frame top nodes = SHARED)
ops.nDMaterial('ElasticIsotropic', 1, Ec, nu_c, rho_c)
ops.section('PlateFiber', 1, 1, t_slab)
ops.element('ShellMITC4', 9, 5, 6, 7, 8, 1)

# Loads: gravity + lateral
ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)

# Self-weight columns
for n in [5,6,7,8]:
    w_col = -rho_s * col_A * H * g / 2
    ops.load(n, 0, 0, w_col, 0, 0, 0)

# Self-weight beams
for (ni,nj,L) in [(5,6,Lx),(7,8,Lx),(5,8,Ly),(6,7,Ly)]:
    w = -rho_s * beam_A * L * g / 2
    ops.load(ni, 0, 0, w, 0, 0, 0)
    ops.load(nj, 0, 0, w, 0, 0, 0)

# Self-weight slab
w_slab = -rho_c * t_slab * Lx * Ly * g / 4
for n in [5,6,7,8]:
    ops.load(n, 0, 0, w_slab, 0, 0, 0)

# Surcharge (CM+CV)
for n in [5,6,7,8]:
    ops.load(n, 0, 0, P_gravity, 0, 0, 0)

# Lateral force
ops.load(5, F_lateral, 0, 0, 0, 0, 0)

ops.system('BandGeneral')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

print("=" * 60)
print("  OpenSeesPy: 1 piso, 1 vano, frames + losa Q4")
print("=" * 60)
print(f"  Gravity: self-weight + {P_gravity} kN/node surcharge")
print(f"  Lateral: {F_lateral} kN at node 5")
print(f"  Slab: {Lx}x{Ly}m, t={t_slab}m, E_conc={Ec/1e6} GPa")
print()

total_weight = 0
for n in [5,6,7,8]:
    d = ops.nodeDisp(n)
    print(f"  Node {n}: ux={d[0]*1000:.4f}mm  uy={d[1]*1000:.4f}mm  uz={d[2]*1000:.4f}mm")

print()
print("  --- VALORES DE REFERENCIA PARA HEKATAN ---")
for n in [5,6,7,8]:
    d = ops.nodeDisp(n)
    print(f"  node[{n-5}] = [{d[0]:.8e}, {d[1]:.8e}, {d[2]:.8e}, {d[3]:.8e}, {d[4]:.8e}, {d[5]:.8e}]")

# Reactions
print()
total_Rz = 0
for n in [1,2,3,4]:
    r = ops.nodeReaction(n)
    total_Rz += r[2]
    print(f"  React node {n}: Rz={r[2]:.2f} kN")
print(f"  Total Rz = {total_Rz:.2f} kN")

# Total applied
total_applied = 4*P_gravity + 4*w_slab
total_applied += sum([-rho_s*col_A*H*g/2 for _ in range(4)])
total_applied += sum([-rho_s*beam_A*Lx*g/2 * 2 for _ in range(2)])  # 2 beams X
total_applied += sum([-rho_s*beam_A*Ly*g/2 * 2 for _ in range(2)])  # 2 beams Y
print(f"  Total applied Fz = {total_applied:.2f} kN")
print(f"  Equilibrium check: Rz + Fz = {total_Rz + total_applied:.4f} kN (should be ~0)")
print("=" * 60)
