"""
Comparación Modal: Edificio 2x2 vanos, 3 pisos con muros de corte
Hekatan Clone (WASM) vs OpenSeesPy

Modelo:
- 2 vanos X = 5m, 2 vanos Y = 4m, 3 pisos h = 3m
- Columnas W24x146 (acero)
- Vigas W14x84 (acero)
- 2 muros de corte: Vano X1/Eje Y=A y Vano X2/Eje Y=C
  Cada muro: 5m x 3m, t = 0.20m, hormigón E = 25 GPa, ν = 0.20
- Base empotrada

Ejecutar: python test_modal_walls.py
"""

import openseespy.opensees as ops
import numpy as np
import sys

# ===================================================════════════
# Material properties
# ===================================================════════════
E_steel = 200e6  # kN/m² (200 GPa)
G_steel = 77e6   # kN/m²
rho_steel = 7.85  # kN·s²/m⁴ (7850 kg/m³ / 9.81)

E_conc = 25e6     # kN/m² (25 GPa)
nu_conc = 0.20
G_conc = E_conc / (2 * (1 + nu_conc))
rho_conc = 2.45   # kN·s²/m⁴ (2400 kg/m³ / 9.81)
t_wall = 0.20     # m

# Steel sections (from AISC)
# W24x146: A=277.4 cm², Iz=11930 cm⁴, Iy=4500 cm⁴, J=660 cm⁴
COL_A  = 277.4e-4   # m²
COL_Iz = 119300e-8   # m⁴ (strong axis)
COL_Iy = 45000e-8    # m⁴ (weak axis)
COL_J  = 660e-8      # m⁴

# W14x84: A=159.4 cm², Iz=5680 cm⁴, Iy=2020 cm⁴, J=380 cm⁴
GIR_A  = 159.4e-4
GIR_Iz = 56800e-8
GIR_Iy = 20200e-8
GIR_J  = 380e-8

# ===================================================════════════
# Geometry
# ===================================================════════════
svx = [5.0, 5.0]   # 2 spans in X
svy = [4.0, 4.0]   # 2 spans in Y
nPisos = 3
hPiso = 3.0

xCoords = [0.0]
for s in svx:
    xCoords.append(xCoords[-1] + s)
yCoords = [0.0]
for s in svy:
    yCoords.append(yCoords[-1] + s)
zCoords = [0.0]
for _ in range(nPisos):
    zCoords.append(zCoords[-1] + hPiso)

nX = len(xCoords)
nY = len(yCoords)
nZ = len(zCoords)

print(f"Grid: X={xCoords}, Y={yCoords}, Z={zCoords}")
print(f"Steel: E={E_steel/1e6:.0f} MPa, G={G_steel/1e6:.0f} MPa")
print(f"Concrete wall: E={E_conc/1e6:.0f} MPa, t={t_wall}m")

# ===================================================════════════
# OpenSees Model
# ===================================================════════════
ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# -- Nodes --
nodeTag = 0
nid = {}  # (ix, iy, iz) -> nodeTag
for iz in range(nZ):
    for iy in range(nY):
        for ix in range(nX):
            nodeTag += 1
            nid[(ix, iy, iz)] = nodeTag
            ops.node(nodeTag, xCoords[ix], yCoords[iy], zCoords[iz])

# -- Supports: fix base (iz=0) --
for iy in range(nY):
    for ix in range(nX):
        ops.fix(nid[(ix, iy, 0)], 1, 1, 1, 1, 1, 1)

# -- Geometric transformations --
# Columns (vertical, along Z): vecxz = (-1, 0, 0)
ops.geomTransf('Linear', 1, -1.0, 0.0, 0.0)
# Beams X (along X): vecxz = (0, 0, 1)
ops.geomTransf('Linear', 2, 0.0, 0.0, 1.0)
# Beams Y (along Y): vecxz = (0, 0, 1)
ops.geomTransf('Linear', 3, 0.0, 0.0, 1.0)

# -- Frame elements --
elemTag = 0

# Columns
for iz in range(nZ - 1):
    for iy in range(nY):
        for ix in range(nX):
            elemTag += 1
            ni = nid[(ix, iy, iz)]
            nj = nid[(ix, iy, iz + 1)]
            # elasticBeamColumn: tag, ni, nj, A, E, G, J, Iy, Iz, transf
            ops.element('elasticBeamColumn', elemTag, ni, nj,
                        COL_A, E_steel, G_steel, COL_J, COL_Iy, COL_Iz, 1)
            # Mass: rho * A * L = mass per unit length -> element mass
            ops.mass(ni, rho_steel * COL_A * hPiso / 2, rho_steel * COL_A * hPiso / 2,
                     rho_steel * COL_A * hPiso / 2, 0, 0, 0)
            ops.mass(nj, rho_steel * COL_A * hPiso / 2, rho_steel * COL_A * hPiso / 2,
                     rho_steel * COL_A * hPiso / 2, 0, 0, 0)

# Beams X
for iz in range(1, nZ):
    for iy in range(nY):
        for ix in range(nX - 1):
            elemTag += 1
            ni = nid[(ix, iy, iz)]
            nj = nid[(ix + 1, iy, iz)]
            Lx = xCoords[ix + 1] - xCoords[ix]
            ops.element('elasticBeamColumn', elemTag, ni, nj,
                        GIR_A, E_steel, G_steel, GIR_J, GIR_Iy, GIR_Iz, 2)
            ops.mass(ni, rho_steel * GIR_A * Lx / 2, rho_steel * GIR_A * Lx / 2,
                     rho_steel * GIR_A * Lx / 2, 0, 0, 0)
            ops.mass(nj, rho_steel * GIR_A * Lx / 2, rho_steel * GIR_A * Lx / 2,
                     rho_steel * GIR_A * Lx / 2, 0, 0, 0)

# Beams Y
for iz in range(1, nZ):
    for ix in range(nX):
        for iy in range(nY - 1):
            elemTag += 1
            ni = nid[(ix, iy, iz)]
            nj = nid[(ix, iy + 1, iz)]
            Ly = yCoords[iy + 1] - yCoords[iy]
            ops.element('elasticBeamColumn', elemTag, ni, nj,
                        GIR_A, E_steel, G_steel, GIR_J, GIR_Iy, GIR_Iz, 3)
            ops.mass(ni, rho_steel * GIR_A * Ly / 2, rho_steel * GIR_A * Ly / 2,
                     rho_steel * GIR_A * Ly / 2, 0, 0, 0)
            ops.mass(nj, rho_steel * GIR_A * Ly / 2, rho_steel * GIR_A * Ly / 2,
                     rho_steel * GIR_A * Ly / 2, 0, 0, 0)

print(f"\nFrame elements: {elemTag}")

# ===================================================════════════
# Shell walls: ShellMITC4
# Wall 1: Vano X=0 (x: 0->5), Eje Y=0 (y=0), all floors
# Wall 2: Vano X=1 (x: 5->10), Eje Y=2 (y=8), all floors
# ===================================================════════════

# Shell material: ElasticMembranePlateSection
# nDMaterial ElasticIsotropic $matTag $E $nu $rho
ops.nDMaterial('ElasticIsotropic', 1, E_conc, nu_conc, rho_conc)
# section PlateFiber $secTag $matTag $t
ops.section('PlateFiber', 1, 1, t_wall)

wallSubH = 2  # vertical subdivisions per floor
wallSubW = 2  # horizontal subdivisions per wall

wall_node_start = nodeTag + 1
wall_elem_start = elemTag + 1

walls = [
    # (bay_x_start, bay_x_end, y_axis)
    (0, 1, 0),   # Wall 1: X bay 0, Y axis 0
    (1, 2, 2),   # Wall 2: X bay 1, Y axis 2 (last)
]

for wall_idx, (bx_start, bx_end, yaxis) in enumerate(walls):
    x0 = xCoords[bx_start]
    x1 = xCoords[bx_end]
    y0 = yCoords[yaxis]

    for iz in range(nZ - 1):
        z_bot = zCoords[iz]
        z_top = zCoords[iz + 1]

        # Create wall panel nodes (grid of wallSubW+1 x wallSubH+1)
        wallNodes = {}  # (jc, jr) -> nodeTag
        for jr in range(wallSubH + 1):
            for jc in range(wallSubW + 1):
                tx = jc / wallSubW
                tz = jr / wallSubH
                x = x0 + tx * (x1 - x0)
                z = z_bot + tz * (z_top - z_bot)

                # Check if this is a corner node (existing joint node)
                if jr == 0 and jc == 0:
                    wallNodes[(jc, jr)] = nid[(bx_start, yaxis, iz)]
                elif jr == 0 and jc == wallSubW:
                    wallNodes[(jc, jr)] = nid[(bx_end, yaxis, iz)]
                elif jr == wallSubH and jc == 0:
                    wallNodes[(jc, jr)] = nid[(bx_start, yaxis, iz + 1)]
                elif jr == wallSubH and jc == wallSubW:
                    wallNodes[(jc, jr)] = nid[(bx_end, yaxis, iz + 1)]
                else:
                    nodeTag += 1
                    ops.node(nodeTag, x, y0, z)
                    wallNodes[(jc, jr)] = nodeTag
                    # Fix base nodes
                    if iz == 0 and jr == 0:
                        ops.fix(nodeTag, 1, 1, 1, 1, 1, 1)

        # Create Q4 shell elements
        for jr in range(wallSubH):
            for jc in range(wallSubW):
                n1 = wallNodes[(jc, jr)]
                n2 = wallNodes[(jc + 1, jr)]
                n3 = wallNodes[(jc + 1, jr + 1)]
                n4 = wallNodes[(jc, jr + 1)]
                elemTag += 1
                ops.element('ShellMITC4', elemTag, n1, n2, n3, n4, 1)

print(f"Total nodes: {nodeTag}")
print(f"Total elements: {elemTag} (frames + walls)")
print(f"Wall elements: {elemTag - wall_elem_start + 1}")

# ===================================================════════════
# Eigenvalue Analysis
# ===================================================════════════
nModes = 6

print(f"\nSolving eigenvalue problem for {nModes} modes...")
try:
    eigenvalues = ops.eigen('-fullGenLapack', nModes)
except Exception as e:
    print(f"fullGenLapack failed: {e}")
    try:
        eigenvalues = ops.eigen(nModes)
    except Exception as e2:
        print(f"Default eigen also failed: {e2}")
        sys.exit(1)

frequencies = [np.sqrt(abs(ev)) / (2 * np.pi) for ev in eigenvalues]

print("\n===================================================")
print("  OpenSeesPy — Modal Analysis (Building + Walls)")
print("===================================================")
print(f"{'Mode':<6} {'Freq (Hz)':<12} {'Period (s)':<12}")
print("-" * 30)
for i, f in enumerate(frequencies):
    T = 1.0 / f if f > 1e-10 else float('inf')
    print(f"  {i+1:<4} {f:<12.4f} {T:<12.4f}")

# -- Mass participation (approximate) --
print("\n-- Mass Participation Ratios --")
print(f"{'Mode':<6} {'Ux %':<8} {'Uy %':<8} {'Uz %':<8}")
print("-" * 30)

# Get node masses and mode shapes
allNodes = ops.getNodeTags()
freeNodes = [n for n in allNodes if sum(ops.nodeDisp(n)) != None]

for mode in range(1, nModes + 1):
    Lx, Ly, Lz = 0.0, 0.0, 0.0
    Mx = 0.0
    for n in allNodes:
        try:
            phi = [ops.nodeEigenvector(n, mode, d+1) for d in range(6)]
            # Assume lumped mass (diagonal mass matrix)
            m = 0
            try:
                m = ops.nodeMass(n, 1)
            except:
                continue
            if m > 1e-15:
                Lx += m * phi[0]
                Ly += m * phi[1]
                Lz += m * phi[2]
                Mx += m
        except:
            continue

    if Mx > 1e-10:
        rx = (Lx * Lx) / (Mx) * 100 if Mx > 0 else 0
        ry = (Ly * Ly) / (Mx) * 100 if Mx > 0 else 0
        rz = (Lz * Lz) / (Mx) * 100 if Mx > 0 else 0
        # Normalize to total effective mass
        total = rx + ry + rz
        if total > 1e-10:
            rx = rx / total * 100
            ry = ry / total * 100
            rz = rz / total * 100
        print(f"  {mode:<4} {rx:<8.1f} {ry:<8.1f} {rz:<8.1f}")
    else:
        print(f"  {mode:<4} {'N/A':<8} {'N/A':<8} {'N/A':<8}")

print("\n===================================================")
print("  Compare these values with Hekatan clone -> Modal")
print("===================================================")

# Also solve without walls for comparison
ops.wipe()
ops.model('basic', '-ndm', 3, '-ndf', 6)

# Rebuild without walls
nodeTag2 = 0
nid2 = {}
for iz in range(nZ):
    for iy in range(nY):
        for ix in range(nX):
            nodeTag2 += 1
            nid2[(ix, iy, iz)] = nodeTag2
            ops.node(nodeTag2, xCoords[ix], yCoords[iy], zCoords[iz])

for iy in range(nY):
    for ix in range(nX):
        ops.fix(nid2[(ix, iy, 0)], 1, 1, 1, 1, 1, 1)

ops.geomTransf('Linear', 1, -1.0, 0.0, 0.0)
ops.geomTransf('Linear', 2, 0.0, 0.0, 1.0)
ops.geomTransf('Linear', 3, 0.0, 0.0, 1.0)

elemTag2 = 0
for iz in range(nZ - 1):
    for iy in range(nY):
        for ix in range(nX):
            elemTag2 += 1
            ni = nid2[(ix, iy, iz)]
            nj = nid2[(ix, iy, iz + 1)]
            ops.element('elasticBeamColumn', elemTag2, ni, nj,
                        COL_A, E_steel, G_steel, COL_J, COL_Iy, COL_Iz, 1)
            ops.mass(ni, rho_steel * COL_A * hPiso / 2, rho_steel * COL_A * hPiso / 2,
                     rho_steel * COL_A * hPiso / 2, 0, 0, 0)
            ops.mass(nj, rho_steel * COL_A * hPiso / 2, rho_steel * COL_A * hPiso / 2,
                     rho_steel * COL_A * hPiso / 2, 0, 0, 0)

for iz in range(1, nZ):
    for iy in range(nY):
        for ix in range(nX - 1):
            elemTag2 += 1
            ni = nid2[(ix, iy, iz)]
            nj = nid2[(ix + 1, iy, iz)]
            Lx_b = xCoords[ix + 1] - xCoords[ix]
            ops.element('elasticBeamColumn', elemTag2, ni, nj,
                        GIR_A, E_steel, G_steel, GIR_J, GIR_Iy, GIR_Iz, 2)
            ops.mass(ni, rho_steel * GIR_A * Lx_b / 2, rho_steel * GIR_A * Lx_b / 2,
                     rho_steel * GIR_A * Lx_b / 2, 0, 0, 0)
            ops.mass(nj, rho_steel * GIR_A * Lx_b / 2, rho_steel * GIR_A * Lx_b / 2,
                     rho_steel * GIR_A * Lx_b / 2, 0, 0, 0)

for iz in range(1, nZ):
    for ix in range(nX):
        for iy in range(nY - 1):
            elemTag2 += 1
            ni = nid2[(ix, iy, iz)]
            nj = nid2[(ix, iy + 1, iz)]
            Ly_b = yCoords[iy + 1] - yCoords[iy]
            ops.element('elasticBeamColumn', elemTag2, ni, nj,
                        GIR_A, E_steel, G_steel, GIR_J, GIR_Iy, GIR_Iz, 3)
            ops.mass(ni, rho_steel * GIR_A * Ly_b / 2, rho_steel * GIR_A * Ly_b / 2,
                     rho_steel * GIR_A * Ly_b / 2, 0, 0, 0)
            ops.mass(nj, rho_steel * GIR_A * Ly_b / 2, rho_steel * GIR_A * Ly_b / 2,
                     rho_steel * GIR_A * Ly_b / 2, 0, 0, 0)

eigenvalues2 = ops.eigen('-fullGenLapack', nModes)
frequencies2 = [np.sqrt(abs(ev)) / (2 * np.pi) for ev in eigenvalues2]

print("\n===================================================")
print("  Comparison: With vs Without Walls")
print("===================================================")
print(f"{'Mode':<6} {'Sin muros Hz':<14} {'Con muros Hz':<14} {'Aumento %':<12}")
print("-" * 46)
for i in range(nModes):
    f_sin = frequencies2[i]
    f_con = frequencies[i]
    pct = (f_con / f_sin - 1) * 100 if f_sin > 1e-10 else 0
    print(f"  {i+1:<4} {f_sin:<14.4f} {f_con:<14.4f} {pct:<12.1f}")

print("\nLos muros de corte aumentan significativamente las frecuencias")
print("(más rigidez lateral -> períodos más cortos)")
