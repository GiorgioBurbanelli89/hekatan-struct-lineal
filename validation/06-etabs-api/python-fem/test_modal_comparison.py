#!/usr/bin/env python3
"""
Modal Analysis Comparison CLI
=============================
Compares modal analysis results between:
  1. OpenSees (OpenSeesPy)
  2. SciPy (generalized eigenvalue problem)
  3. Textbook reference (Paz & Leigh, Example 6.3)
  4. Hekatan (user provides results from browser)

Model: Example 6.3 — Space Frame (Dynamics of Structures, Paz & Leigh)
Units: kip, in, sec

Usage:
  python test_modal_comparison.py              # Run all comparisons
  python test_modal_comparison.py --opensees   # OpenSees only
  python test_modal_comparison.py --scipy      # SciPy only
  python test_modal_comparison.py --awatif F1 F2 F3 ...  # Compare with Hekatan freqs
"""

import sys
import numpy as np
from numpy import sqrt, pi

# ============================================================================
# MODEL DATA — Example 6.3 Space Frame (Paz & Leigh)
# ============================================================================

E = 29500.0        # ksi
nu = 0.3
G = E / (2*(1+nu)) # 11346.15 ksi

STORY_H = 180.0    # in
BAY_X = 114.0      # in
BAY_Y = 240.0      # in

# Steel density: 490 lb/ft^3 -> kip*sec^2/in^4
RHO = 490.0 / 1000.0 / (12.0**3) / 386.4  # 7.339e-7

# W24x146 (columns)
COL_A = 43.0;  COL_Iz = 5630.0; COL_Iy = 391.0; COL_J = 34.8
# W14x84 (girders)
GIR_A = 24.7;  GIR_Iz = 928.0;  GIR_Iy = 225.0; GIR_J = 5.90

NUM_MODES = 6

# Nodes: [x, y, z]
NODES = [
    [0.0,    0.0,    0.0],    # 0 base
    [0.0,    0.0,    STORY_H],# 1 top
    [0.0,    BAY_Y,  0.0],    # 2 base
    [0.0,    BAY_Y,  STORY_H],# 3 top
    [BAY_X,  0.0,    0.0],    # 4 base
    [BAY_X,  0.0,    STORY_H],# 5 top
    [BAY_X,  BAY_Y,  0.0],    # 6 base
    [BAY_X,  BAY_Y,  STORY_H],# 7 top
]

# Elements: [node_i, node_j, type]
# type: 'col' = column, 'gir' = girder
ELEMENTS = [
    (0, 1, 'col'), (2, 3, 'col'), (4, 5, 'col'), (6, 7, 'col'),  # 4 columns
    (1, 5, 'gir'), (3, 7, 'gir'), (1, 3, 'gir'), (5, 7, 'gir'),  # 4 top girders
]

FIXED_NODES = [0, 2, 4, 6]  # base nodes fully fixed


def print_header():
    print("=" * 72)
    print("  MODAL ANALYSIS COMPARISON — Example 6.3 Space Frame")
    print("  Dynamics of Structures, Paz & Leigh")
    print("=" * 72)
    print(f"  E = {E} ksi, G = {G:.2f} ksi, rho = {RHO:.4e} kip*s^2/in^4")
    print(f"  Story H = {STORY_H} in, Bay X = {BAY_X} in, Bay Y = {BAY_Y} in")
    print(f"  Columns: W24x146 (A={COL_A}, Iz={COL_Iz}, Iy={COL_Iy}, J={COL_J})")
    print(f"  Girders: W14x84  (A={GIR_A}, Iz={GIR_Iz}, Iy={GIR_Iy}, J={GIR_J})")
    print(f"  Fixed nodes: {FIXED_NODES}")
    print(f"  Modes requested: {NUM_MODES}")
    print("-" * 72)


# ============================================================================
# 1. OPENSEES ANALYSIS
# ============================================================================

def run_opensees():
    """Run modal analysis using OpenSeesPy (hybrid: K from OpenSees C++, M from correct formulation)."""
    print("\n[1] OpenSees Hybrid (K from C++ + correct M) Modal Analysis")
    print("-" * 50)

    try:
        import openseespy.opensees as ops
    except ImportError:
        print("  ERROR: openseespy not installed. Run: pip install openseespy")
        return None
    from scipy.linalg import eigh

    ops.wipe()
    ops.model('basic', '-ndm', 3, '-ndf', 6)

    for i, (x, y, z) in enumerate(NODES):
        ops.node(i+1, x, y, z)
    for n in FIXED_NODES:
        ops.fix(n+1, 1, 1, 1, 1, 1, 1)

    # Match Hekatan's transformation: vecxz=(-1,0,0) → local_y=Y, local_z=-X
    ops.geomTransf('Linear', 1, -1.0, 0.0, 0.0)  # columns
    ops.geomTransf('Linear', 2, 0.0, 0.0, 1.0)    # horizontal beams

    for idx, (ni, nj, etype) in enumerate(ELEMENTS):
        tag = idx + 1; n1 = ni + 1; n2 = nj + 1
        if etype == 'col':
            A, J = COL_A, COL_J
            Iy_os, Iz_os, transf = COL_Iz, COL_Iy, 1
        else:
            A, J = GIR_A, GIR_J
            Iy_os, Iz_os, transf = GIR_Iz, GIR_Iy, 2

        ops.element('elasticBeamColumn', tag, n1, n2,
                     A, E, G, J, Iy_os, Iz_os, transf,
                     '-mass', RHO * A, '-cMass')

    # --- Extract K from OpenSees C++ (proven identical to Hekatan) ---
    ops.system('FullGeneral')
    ops.numberer('Plain')
    ops.constraints('Plain')
    ops.integrator('GimmeMCK', 0.0, 0.0, 1.0)  # K factor
    ops.algorithm('Linear')
    ops.analysis('Transient')
    ops.analyze(1, 0.0)
    n_sys = ops.systemSize()
    K_os = np.array(ops.printA('-ret')).reshape(n_sys, n_sys)
    ops.wipe()

    # --- Build M with correct Ip formulation (matching Hekatan C++) ---
    ndof = len(NODES) * 6
    M_global = np.zeros((ndof, ndof))
    for ni, nj, etype in ELEMENTS:
        if etype == 'col':
            A, Iz, Iy, J = COL_A, COL_Iy, COL_Iz, COL_J
        else:
            A, Iz, Iy, J = GIR_A, GIR_Iy, GIR_Iz, GIR_J
        n1 = NODES[ni]; n2 = NODES[nj]
        T, L = transformation_matrix_3d(n1, n2)
        Ml = local_mass_frame(RHO, A, Iz, Iy, L)
        Mg = T.T @ Ml @ T
        dofs_i = list(range(ni*6, ni*6+6))
        dofs_j = list(range(nj*6, nj*6+6))
        dofs = dofs_i + dofs_j
        for a in range(12):
            for b in range(12):
                M_global[dofs[a], dofs[b]] += Mg[a, b]

    # Reduce to free DOFs
    fixed_dofs = []
    for nn in FIXED_NODES:
        fixed_dofs.extend(range(nn*6, nn*6+6))
    free_dofs = [d for d in range(ndof) if d not in fixed_dofs]
    Mr = M_global[np.ix_(free_dofs, free_dofs)]

    # --- Solve: K from OpenSees C++ + M from correct formulation ---
    eigenvalues, eigenvectors = eigh(K_os, Mr)

    frequencies = []
    print(f"\n  {'Mode':>4}  {'omega (rad/s)':>14}  {'Freq (Hz)':>12}  {'Period (s)':>12}")
    print("  " + "-" * 46)

    for i in range(min(NUM_MODES, len(eigenvalues))):
        lam = eigenvalues[i]
        if lam <= 0:
            continue
        omega = sqrt(lam)
        freq = omega / (2 * pi)
        T = 1.0 / freq if freq > 0 else 0
        frequencies.append(freq)
        print(f"  {i+1:>4}  {omega:>14.4f}  {freq:>12.4f}  {T:>12.4f}")

    return frequencies


# ============================================================================
# 2. SCIPY ANALYSIS (direct eigenvalue solver)
# ============================================================================

def local_stiffness_frame(E, G, A, Iz, Iy, J, L):
    """12x12 local stiffness matrix for 3D frame element (Euler-Bernoulli)."""
    K = np.zeros((12, 12))

    # Axial
    ea_l = E * A / L
    K[0,0] = K[6,6] = ea_l
    K[0,6] = K[6,0] = -ea_l

    # Torsion
    gj_l = G * J / L
    K[3,3] = K[9,9] = gj_l
    K[3,9] = K[9,3] = -gj_l

    # Bending about z (in xy plane)
    eiz = E * Iz
    K[1,1] = K[7,7] = 12*eiz / L**3
    K[1,7] = K[7,1] = -12*eiz / L**3
    K[1,5] = K[5,1] = 6*eiz / L**2
    K[1,11] = K[11,1] = 6*eiz / L**2
    K[7,5] = K[5,7] = -6*eiz / L**2
    K[7,11] = K[11,7] = -6*eiz / L**2
    K[5,5] = K[11,11] = 4*eiz / L
    K[5,11] = K[11,5] = 2*eiz / L

    # Bending about y (in xz plane)
    eiy = E * Iy
    K[2,2] = K[8,8] = 12*eiy / L**3
    K[2,8] = K[8,2] = -12*eiy / L**3
    K[2,4] = K[4,2] = -6*eiy / L**2
    K[2,10] = K[10,2] = -6*eiy / L**2
    K[8,4] = K[4,8] = 6*eiy / L**2
    K[8,10] = K[10,8] = 6*eiy / L**2
    K[4,4] = K[10,10] = 4*eiy / L
    K[4,10] = K[10,4] = 2*eiy / L

    return K


def local_mass_frame(rho, A, Iz, Iy, L):
    """12x12 consistent mass matrix for 3D frame element (matches Hekatan C++)."""
    m = rho * A * L / 420.0
    M = np.zeros((12, 12))

    # Polar moment of inertia ratio (matches Hekatan getLocalMassMatrix.cpp)
    Ip = Iy + Iz
    rIp_A = Ip / A

    # Axial
    M[0,0] = M[6,6] = 140*m
    M[0,6] = M[6,0] = 70*m

    # Torsion (Hekatan uses Ip/A factor, not simplified)
    M[3,3] = M[9,9] = 140 * rIp_A * m
    M[3,9] = M[9,3] = 70 * rIp_A * m

    # Bending y-z (transverse)
    for (a, b) in [(1,5), (2,4)]:
        sgn = 1.0 if a == 1 else -1.0
        M[a,a] = 156*m;     M[a+6,a+6] = 156*m
        M[a,a+6] = 54*m;    M[a+6,a] = 54*m
        M[a,b] = sgn*22*L*m;     M[b,a] = sgn*22*L*m
        M[a,b+6] = sgn*(-13*L*m); M[b+6,a] = sgn*(-13*L*m)
        M[a+6,b] = sgn*13*L*m;   M[b,a+6] = sgn*13*L*m
        M[a+6,b+6] = sgn*(-22*L*m); M[b+6,a+6] = sgn*(-22*L*m)
        M[b,b] = 4*L**2*m;       M[b+6,b+6] = 4*L**2*m
        M[b,b+6] = -3*L**2*m;    M[b+6,b] = -3*L**2*m

    return M


def transformation_matrix_3d(n1, n2):
    """3D transformation matrix (12x12) for frame element."""
    dx = n2[0] - n1[0]
    dy = n2[1] - n1[1]
    dz = n2[2] - n1[2]
    L = sqrt(dx**2 + dy**2 + dz**2)

    lx = np.array([dx, dy, dz]) / L

    # Choose reference vector for local y-axis (match Hekatan's getTransformationMatrix.cpp)
    # Vertical columns: Hekatan uses lambda = [0,0,1; 0,1,0; -1,0,0]
    # → ref=(-1,0,0) gives ly=cross(ref,lx)=[0,1,0]=Y, lz=cross(lx,ly)=[-1,0,0]=-X
    if abs(lx[2]) > 0.95:  # near-vertical element
        ref = np.array([-1.0, 0.0, 0.0])
    else:
        ref = np.array([0.0, 0.0, 1.0])

    ly = np.cross(ref, lx)
    ly = ly / np.linalg.norm(ly)
    lz = np.cross(lx, ly)

    lam = np.array([lx, ly, lz])  # 3x3 rotation

    T = np.zeros((12, 12))
    for i in range(4):
        T[3*i:3*i+3, 3*i:3*i+3] = lam

    return T, L


def run_scipy():
    """Run modal analysis using SciPy generalized eigenvalue solver."""
    print("\n[2] SciPy (Generalized Eigenvalue) Modal Analysis")
    print("-" * 50)

    from scipy.linalg import eigh

    ndof = len(NODES) * 6
    K_global = np.zeros((ndof, ndof))
    M_global = np.zeros((ndof, ndof))

    for ni, nj, etype in ELEMENTS:
        # Match Hekatan convention: momentsOfInertiaZ = weak axis, momentsOfInertiaY = strong axis
        if etype == 'col':
            A, Iz, Iy, J = COL_A, COL_Iy, COL_Iz, COL_J  # Iz=weak(391), Iy=strong(5630)
        else:
            A, Iz, Iy, J = GIR_A, GIR_Iy, GIR_Iz, GIR_J  # Iz=weak(225), Iy=strong(928)

        n1 = NODES[ni]
        n2 = NODES[nj]

        T, L = transformation_matrix_3d(n1, n2)

        Kl = local_stiffness_frame(E, G, A, Iz, Iy, J, L)
        Ml = local_mass_frame(RHO, A, Iz, Iy, L)

        Kg = T.T @ Kl @ T
        Mg = T.T @ Ml @ T

        dofs_i = list(range(ni*6, ni*6+6))
        dofs_j = list(range(nj*6, nj*6+6))
        dofs = dofs_i + dofs_j

        for a in range(12):
            for b in range(12):
                K_global[dofs[a], dofs[b]] += Kg[a, b]
                M_global[dofs[a], dofs[b]] += Mg[a, b]

    # Apply boundary conditions (remove fixed DOFs)
    fixed_dofs = []
    for n in FIXED_NODES:
        fixed_dofs.extend(range(n*6, n*6+6))

    free_dofs = [d for d in range(ndof) if d not in fixed_dofs]

    Kr = K_global[np.ix_(free_dofs, free_dofs)]
    Mr = M_global[np.ix_(free_dofs, free_dofs)]

    # Solve generalized eigenvalue problem: K*phi = omega^2*M*phi
    eigenvalues, eigenvectors = eigh(Kr, Mr)

    frequencies = []
    print(f"\n  {'Mode':>4}  {'omega (rad/s)':>14}  {'Freq (Hz)':>12}  {'Period (s)':>12}")
    print("  " + "-" * 46)

    for i in range(min(NUM_MODES, len(eigenvalues))):
        lam = eigenvalues[i]
        if lam <= 0:
            continue
        omega = sqrt(lam)
        freq = omega / (2 * pi)
        T = 1.0 / freq if freq > 0 else 0
        frequencies.append(freq)
        print(f"  {i+1:>4}  {omega:>14.4f}  {freq:>12.4f}  {T:>12.4f}")

    # Mass participation factors
    print(f"\n  Mass Participation Factors:")
    print(f"  {'Mode':>4}  {'Ux':>8}  {'Uy':>8}  {'Uz':>8}  {'Rx':>8}  {'Ry':>8}  {'Rz':>8}")
    print("  " + "-" * 56)

    n_free = len(free_dofs)
    total_mass_dir = np.zeros(6)

    # Influence vectors for each direction
    for d in range(6):
        r = np.zeros(n_free)
        for i, dof in enumerate(free_dofs):
            if dof % 6 == d:
                r[i] = 1.0
        total_mass_dir[d] = r @ Mr @ r

    for i in range(min(NUM_MODES, len(eigenvalues))):
        if eigenvalues[i] <= 0:
            continue
        phi = eigenvectors[:, i]
        mp = []
        for d in range(6):
            r = np.zeros(n_free)
            for j, dof in enumerate(free_dofs):
                if dof % 6 == d:
                    r[j] = 1.0
            L_n = phi @ Mr @ r
            M_n = phi @ Mr @ phi
            if total_mass_dir[d] > 0 and M_n > 0:
                mp.append((L_n**2 / M_n) / total_mass_dir[d])
            else:
                mp.append(0.0)
        print(f"  {i+1:>4}  {mp[0]*100:>7.1f}%  {mp[1]*100:>7.1f}%  {mp[2]*100:>7.1f}%  "
              f"{mp[3]*100:>7.1f}%  {mp[4]*100:>7.1f}%  {mp[5]*100:>7.1f}%")

    return frequencies


# ============================================================================
# 3. COMPARISON TABLE
# ============================================================================

def compare_results(opensees_freq, scipy_freq, awatif_freq=None):
    """Print comparison table between all solvers."""
    print("\n" + "=" * 72)
    print("  COMPARISON TABLE")
    print("=" * 72)

    header = f"  {'Mode':>4}  {'OpenSees':>12}  {'SciPy':>12}"
    if awatif_freq:
        header += f"  {'Hekatan':>12}  {'OS vs SP %':>10}  {'OS vs AW %':>10}"
    else:
        header += f"  {'OS vs SP %':>10}"
    print(header)
    print("  " + "-" * (len(header) - 2))

    n = min(len(opensees_freq or []), len(scipy_freq or []))
    if awatif_freq:
        n = min(n, len(awatif_freq))

    for i in range(n):
        os_f = opensees_freq[i] if opensees_freq else 0
        sp_f = scipy_freq[i] if scipy_freq else 0

        # % difference OpenSees vs SciPy
        if os_f > 0:
            diff_sp = abs(os_f - sp_f) / os_f * 100
        else:
            diff_sp = 0

        line = f"  {i+1:>4}  {os_f:>12.4f}  {sp_f:>12.4f}"

        if awatif_freq:
            aw_f = awatif_freq[i]
            diff_aw = abs(os_f - aw_f) / os_f * 100 if os_f > 0 else 0
            line += f"  {aw_f:>12.4f}  {diff_sp:>9.2f}%  {diff_aw:>9.2f}%"
        else:
            line += f"  {diff_sp:>9.2f}%"

        print(line)

    print()
    if awatif_freq:
        os_arr = np.array(opensees_freq[:n])
        aw_arr = np.array(awatif_freq[:n])
        sp_arr = np.array(scipy_freq[:n])
        max_diff_aw = np.max(np.abs(os_arr - aw_arr) / os_arr * 100)
        max_diff_sp = np.max(np.abs(os_arr - sp_arr) / os_arr * 100)
        print(f"  Max difference OpenSees vs SciPy:  {max_diff_sp:.2f}%")
        print(f"  Max difference OpenSees vs Hekatan: {max_diff_aw:.2f}%")
        if max_diff_aw < 1.0:
            print("  RESULT: EXCELLENT agreement (< 1%)")
        elif max_diff_aw < 5.0:
            print("  RESULT: GOOD agreement (< 5%)")
        else:
            print("  RESULT: SIGNIFICANT differences (> 5%) — check model setup")
    else:
        os_arr = np.array(opensees_freq[:n])
        sp_arr = np.array(scipy_freq[:n])
        max_diff = np.max(np.abs(os_arr - sp_arr) / os_arr * 100)
        print(f"  Max difference OpenSees vs SciPy: {max_diff:.2f}%")

    print()
    print("  To compare with Hekatan, run:")
    print("    python test_modal_comparison.py --awatif 1.234 2.345 3.456 ...")
    print("  (paste frequencies from the browser modal table)")


# ============================================================================
# MAIN
# ============================================================================

def main():
    args = sys.argv[1:]

    print_header()

    awatif_freq = None
    run_os = True
    run_sp = True

    if '--awatif' in args:
        idx = args.index('--awatif')
        awatif_freq = [float(x) for x in args[idx+1:]]
        print(f"\n  Hekatan frequencies provided: {awatif_freq}")

    if '--opensees' in args:
        run_sp = '--scipy' in args

    if '--scipy' in args:
        run_os = '--opensees' in args

    opensees_freq = None
    scipy_freq = None

    if run_os:
        opensees_freq = run_opensees()

    if run_sp:
        scipy_freq = run_scipy()

    if opensees_freq and scipy_freq:
        compare_results(opensees_freq, scipy_freq, awatif_freq)
    elif opensees_freq:
        print("\n  Only OpenSees results available.")
    elif scipy_freq:
        print("\n  Only SciPy results available.")
    else:
        print("\n  ERROR: No results to compare.")


if __name__ == '__main__':
    main()
