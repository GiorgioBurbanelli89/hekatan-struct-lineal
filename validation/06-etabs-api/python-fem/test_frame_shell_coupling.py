"""
Comparacion: Acoplamiento Frame + Shell (Losa + Muros)
OpenSeesPy como referencia

Modelo simple: 1 vano, 1 piso
- 4 columnas (frame) en esquinas
- 4 vigas (frame) conectando columnas
- 1 losa (shell Q4) en el piso
- 1 muro de corte (shell Q4) en un lado
- Carga lateral en la parte superior

Verifica que los DOFs compartidos (frame-shell) se acoplan correctamente.
"""

import openseespy.opensees as ops
import numpy as np

# ===================================================================
# Model parameters
# ===================================================================
Lx = 5.0    # span X (m)
Ly = 4.0    # span Y (m)
H  = 3.0    # floor height (m)

# Steel for frames
Es = 200e6  # kN/m2
Gs = 77e6
rho_s = 7.85  # kN*s2/m4

# Concrete for shells
Ec = 25e6
nu_c = 0.20
Gc = Ec / (2 * (1 + nu_c))
rho_c = 2.45

# Sections
col_A = 0.09    # 0.30 x 0.30 m
col_Iz = 6.75e-4
col_Iy = 6.75e-4
col_J = 1.0e-3

beam_A = 0.125  # 0.25 x 0.50 m
beam_Iz = 2.6e-3
beam_Iy = 3.26e-4
beam_J = 5.0e-4

t_slab = 0.15   # slab thickness
t_wall = 0.20   # wall thickness

F_lateral = 100.0  # kN lateral force

# ===================================================================
# TEST 1: Frame only (no shells) - baseline
# ===================================================================
print("=" * 60)
print("  TEST 1: Frame Only (4 columns + 4 beams)")
print("=" * 60)

ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# 8 nodes: 4 base + 4 top
# Base: 1-4, Top: 5-8
ops.node(1, 0,  0,  0)
ops.node(2, Lx, 0,  0)
ops.node(3, Lx, Ly, 0)
ops.node(4, 0,  Ly, 0)
ops.node(5, 0,  0,  H)
ops.node(6, Lx, 0,  H)
ops.node(7, Lx, Ly, H)
ops.node(8, 0,  Ly, H)

for n in [1,2,3,4]:
    ops.fix(n, 1,1,1,1,1,1)

ops.geomTransf('Linear', 1, -1, 0, 0)  # columns
ops.geomTransf('Linear', 2, 0, 0, 1)   # beams X
ops.geomTransf('Linear', 3, 0, 0, 1)   # beams Y

# Columns
ops.element('elasticBeamColumn', 1, 1, 5, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 2, 2, 6, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 3, 3, 7, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 4, 4, 8, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)

# Beams
ops.element('elasticBeamColumn', 5, 5, 6, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 2)
ops.element('elasticBeamColumn', 6, 7, 8, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 2)
ops.element('elasticBeamColumn', 7, 5, 8, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 3)
ops.element('elasticBeamColumn', 8, 6, 7, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 3)

# Lateral force at node 5 in X
ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)
ops.load(5, F_lateral, 0, 0, 0, 0, 0)

ops.system('BandGeneral')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

d_frame = {}
for n in [5,6,7,8]:
    d = ops.nodeDisp(n)
    d_frame[n] = d
    print(f"  Node {n}: ux={d[0]:.6e}  uy={d[1]:.6e}  uz={d[2]:.6e}")

# Modal
for n in [5,6,7,8]:
    ops.mass(n, 10, 10, 10, 0, 0, 0)
eig1 = ops.eigen(3)
freq_frame = [np.sqrt(abs(e))/(2*np.pi) for e in eig1]
print(f"\n  Frequencies: {[f'{f:.4f}' for f in freq_frame]}")

# ===================================================================
# TEST 2: Frame + Slab (Q4 shell on floor)
# ===================================================================
print("\n" + "=" * 60)
print("  TEST 2: Frame + Slab (shell Q4 on floor)")
print("=" * 60)

ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# Same 8 frame nodes
ops.node(1, 0,  0,  0)
ops.node(2, Lx, 0,  0)
ops.node(3, Lx, Ly, 0)
ops.node(4, 0,  Ly, 0)
ops.node(5, 0,  0,  H)
ops.node(6, Lx, 0,  H)
ops.node(7, Lx, Ly, H)
ops.node(8, 0,  Ly, H)

for n in [1,2,3,4]:
    ops.fix(n, 1,1,1,1,1,1)

ops.geomTransf('Linear', 1, -1, 0, 0)
ops.geomTransf('Linear', 2, 0, 0, 1)
ops.geomTransf('Linear', 3, 0, 0, 1)

# Same frame elements
ops.element('elasticBeamColumn', 1, 1, 5, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 2, 2, 6, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 3, 3, 7, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 4, 4, 8, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 5, 5, 6, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 2)
ops.element('elasticBeamColumn', 6, 7, 8, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 2)
ops.element('elasticBeamColumn', 7, 5, 8, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 3)
ops.element('elasticBeamColumn', 8, 6, 7, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 3)

# Slab shell: 2x2 Q4 mesh on floor (Z=H)
# nodes 5,6,7,8 are corners. Add 5 more: center + midpoints
nSx, nSy = 2, 2
slab_nid = {}
nodeTag = 8
for jr in range(nSy + 1):
    for jc in range(nSx + 1):
        x = jc / nSx * Lx
        y = jr / nSy * Ly
        # Reuse corner nodes
        if jr == 0 and jc == 0: slab_nid[(jc,jr)] = 5
        elif jr == 0 and jc == nSx: slab_nid[(jc,jr)] = 6
        elif jr == nSy and jc == nSx: slab_nid[(jc,jr)] = 7
        elif jr == nSy and jc == 0: slab_nid[(jc,jr)] = 8
        else:
            nodeTag += 1
            ops.node(nodeTag, x, y, H)
            slab_nid[(jc,jr)] = nodeTag

# Shell material
ops.nDMaterial('ElasticIsotropic', 1, Ec, nu_c, rho_c)
ops.section('PlateFiber', 1, 1, t_slab)

elemTag = 8
for jr in range(nSy):
    for jc in range(nSx):
        n1 = slab_nid[(jc, jr)]
        n2 = slab_nid[(jc+1, jr)]
        n3 = slab_nid[(jc+1, jr+1)]
        n4 = slab_nid[(jc, jr+1)]
        elemTag += 1
        ops.element('ShellMITC4', elemTag, n1, n2, n3, n4, 1)

print(f"  Slab: {nSx*nSy} Q4 elements, {nodeTag-8} extra nodes")
print(f"  Coupling: slab corners share nodes 5,6,7,8 with frames")

ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)
ops.load(5, F_lateral, 0, 0, 0, 0, 0)

ops.system('BandGeneral')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

d_slab = {}
for n in [5,6,7,8]:
    d = ops.nodeDisp(n)
    d_slab[n] = d
    print(f"  Node {n}: ux={d[0]:.6e}  uy={d[1]:.6e}  uz={d[2]:.6e}")

# Modal
for n in range(1, nodeTag+1):
    try: ops.mass(n, 10, 10, 10, 0, 0, 0)
    except: pass
eig2 = ops.eigen(3)
freq_slab = [np.sqrt(abs(e))/(2*np.pi) for e in eig2]
print(f"\n  Frequencies: {[f'{f:.4f}' for f in freq_slab]}")

# ===================================================================
# TEST 3: Frame + Slab + Wall (shell Q4 vertical)
# ===================================================================
print("\n" + "=" * 60)
print("  TEST 3: Frame + Slab + Wall (complete)")
print("=" * 60)

ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# Same 8 frame nodes
ops.node(1, 0,  0,  0)
ops.node(2, Lx, 0,  0)
ops.node(3, Lx, Ly, 0)
ops.node(4, 0,  Ly, 0)
ops.node(5, 0,  0,  H)
ops.node(6, Lx, 0,  H)
ops.node(7, Lx, Ly, H)
ops.node(8, 0,  Ly, H)

for n in [1,2,3,4]:
    ops.fix(n, 1,1,1,1,1,1)

ops.geomTransf('Linear', 1, -1, 0, 0)
ops.geomTransf('Linear', 2, 0, 0, 1)
ops.geomTransf('Linear', 3, 0, 0, 1)

# Frame elements
ops.element('elasticBeamColumn', 1, 1, 5, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 2, 2, 6, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 3, 3, 7, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 4, 4, 8, col_A, Es, Gs, col_J, col_Iy, col_Iz, 1)
ops.element('elasticBeamColumn', 5, 5, 6, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 2)
ops.element('elasticBeamColumn', 6, 7, 8, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 2)
ops.element('elasticBeamColumn', 7, 5, 8, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 3)
ops.element('elasticBeamColumn', 8, 6, 7, beam_A, Es, Gs, beam_J, beam_Iy, beam_Iz, 3)

# Shell material
ops.nDMaterial('ElasticIsotropic', 1, Ec, nu_c, rho_c)
ops.section('PlateFiber', 1, 1, t_slab)   # slab
ops.section('PlateFiber', 2, 1, t_wall)   # wall (thicker)

# Slab (same as TEST 2)
nodeTag = 8
slab_nid = {}
for jr in range(nSy + 1):
    for jc in range(nSx + 1):
        x = jc / nSx * Lx
        y = jr / nSy * Ly
        if jr == 0 and jc == 0: slab_nid[(jc,jr)] = 5
        elif jr == 0 and jc == nSx: slab_nid[(jc,jr)] = 6
        elif jr == nSy and jc == nSx: slab_nid[(jc,jr)] = 7
        elif jr == nSy and jc == 0: slab_nid[(jc,jr)] = 8
        else:
            nodeTag += 1
            ops.node(nodeTag, x, y, H)
            slab_nid[(jc,jr)] = nodeTag

elemTag = 8
for jr in range(nSy):
    for jc in range(nSx):
        n1 = slab_nid[(jc, jr)]
        n2 = slab_nid[(jc+1, jr)]
        n3 = slab_nid[(jc+1, jr+1)]
        n4 = slab_nid[(jc, jr+1)]
        elemTag += 1
        ops.element('ShellMITC4', elemTag, n1, n2, n3, n4, 1)

# Wall on Y=0 face (from node 1→2 at base to node 5→6 at top)
# 2x2 subdivision
nWx, nWz = 2, 2
wall_nid = {}
for jr in range(nWz + 1):
    for jc in range(nWx + 1):
        x = jc / nWx * Lx
        z = jr / nWz * H
        # Reuse frame nodes at corners
        if jr == 0 and jc == 0: wall_nid[(jc,jr)] = 1
        elif jr == 0 and jc == nWx: wall_nid[(jc,jr)] = 2
        elif jr == nWz and jc == 0: wall_nid[(jc,jr)] = 5
        elif jr == nWz and jc == nWx: wall_nid[(jc,jr)] = 6
        else:
            nodeTag += 1
            ops.node(nodeTag, x, 0, z)
            wall_nid[(jc,jr)] = nodeTag
            # Fix base nodes
            if jr == 0:
                ops.fix(nodeTag, 1,1,1,1,1,1)

for jr in range(nWz):
    for jc in range(nWx):
        n1 = wall_nid[(jc, jr)]
        n2 = wall_nid[(jc+1, jr)]
        n3 = wall_nid[(jc+1, jr+1)]
        n4 = wall_nid[(jc, jr+1)]
        elemTag += 1
        ops.element('ShellMITC4', elemTag, n1, n2, n3, n4, 2)

print(f"  Total nodes: {nodeTag}")
print(f"  Total elements: {elemTag} (8 frames + 4 slab + 4 wall)")
print(f"  Coupling points:")
print(f"    Slab corners = frame top nodes (5,6,7,8)")
print(f"    Wall corners = frame nodes (1,2 base; 5,6 top)")
print(f"    -> DOFs are SHARED at these nodes")

ops.timeSeries('Constant', 1)
ops.pattern('Plain', 1, 1)
ops.load(5, F_lateral, 0, 0, 0, 0, 0)

ops.system('BandGeneral')
ops.numberer('RCM')
ops.constraints('Plain')
ops.integrator('LoadControl', 1.0)
ops.algorithm('Linear')
ops.analysis('Static')
ops.analyze(1)

d_full = {}
for n in [5,6,7,8]:
    d = ops.nodeDisp(n)
    d_full[n] = d
    print(f"  Node {n}: ux={d[0]:.6e}  uy={d[1]:.6e}  uz={d[2]:.6e}")

# Modal
for n in range(1, nodeTag+1):
    try: ops.mass(n, 10, 10, 10, 0, 0, 0)
    except: pass
eig3 = ops.eigen(3)
freq_full = [np.sqrt(abs(e))/(2*np.pi) for e in eig3]
print(f"\n  Frequencies: {[f'{f:.4f}' for f in freq_full]}")

# ===================================================================
# COMPARISON TABLE
# ===================================================================
print("\n" + "=" * 60)
print("  COMPARISON: Frame-Shell Coupling Effect")
print("=" * 60)
print(f"\n  Lateral Force F = {F_lateral} kN at node 5 (X direction)")
print(f"\n  {'Config':<25} {'ux node5 (m)':<16} {'ux node6 (m)':<16}")
print("  " + "-" * 57)
print(f"  {'Frame only':<25} {d_frame[5][0]:<16.6e} {d_frame[6][0]:<16.6e}")
print(f"  {'Frame + Slab':<25} {d_slab[5][0]:<16.6e} {d_slab[6][0]:<16.6e}")
print(f"  {'Frame + Slab + Wall':<25} {d_full[5][0]:<16.6e} {d_full[6][0]:<16.6e}")

# Slab effect: diaphragm action makes all top nodes move together
print(f"\n  Diaphragm effect (slab):")
print(f"    Frame only:  ux5/ux6 = {d_frame[5][0]/d_frame[6][0]:.4f}" if abs(d_frame[6][0]) > 1e-15 else "    Frame only: ux6 ~ 0")
print(f"    Frame+Slab:  ux5/ux6 = {d_slab[5][0]/d_slab[6][0]:.4f}" if abs(d_slab[6][0]) > 1e-15 else "    Frame+Slab: ux6 ~ 0")

# Wall effect: reduces lateral displacement
if abs(d_frame[5][0]) > 1e-15:
    red_slab = (1 - d_slab[5][0]/d_frame[5][0]) * 100
    red_full = (1 - d_full[5][0]/d_frame[5][0]) * 100
    print(f"\n  Lateral displacement reduction:")
    print(f"    Slab only:     {red_slab:.1f}%")
    print(f"    Slab + Wall:   {red_full:.1f}%")

print(f"\n  {'Config':<25} {'f1 (Hz)':<10} {'f2 (Hz)':<10} {'f3 (Hz)':<10}")
print("  " + "-" * 55)
print(f"  {'Frame only':<25} {freq_frame[0]:<10.4f} {freq_frame[1]:<10.4f} {freq_frame[2]:<10.4f}")
print(f"  {'Frame + Slab':<25} {freq_slab[0]:<10.4f} {freq_slab[1]:<10.4f} {freq_slab[2]:<10.4f}")
print(f"  {'Frame + Slab + Wall':<25} {freq_full[0]:<10.4f} {freq_full[1]:<10.4f} {freq_full[2]:<10.4f}")

print(f"\n  KEY OBSERVATIONS:")
print(f"  1. Slab acts as DIAPHRAGM: ux5 ~ ux6 (all top nodes move together)")
print(f"  2. Wall REDUCES lateral displacement significantly")
print(f"  3. Frequencies INCREASE with wall (more stiffness)")
print(f"  4. Coupling is through SHARED NODES (same DOFs)")
print(f"\n  In Hekatan clone: same mechanism - Q4 shell corners")
print(f"  share node indices with frame element ends.")
