"""
Test end-to-end Python: Mini-mesa-torsion (shell + viga horizontal cantilever).
Compara 3 formulaciones de membrana shell:
  A) Plain Q4         (lo que hace hoy shellThin.cpp::getMembraneK_Thin)
  B) Wilson 1971 + Taylor 1976 (lo que SAP2000/ETABS usan)
  C) Reduced J modifier (camino alternativo: J_viga × 0.957)

Para cada caso reporta Rz nodo extremo viga bajo Mz=1 N·m → ratio dice cuánta
diferencia hace cada cambio.

Si Wilson (B) ya da resultado más cercano al "esperado por ETABS" SIN tocar J,
es la solución correcta.
"""
import numpy as np
from test_wilson_membrane import (
    membrane_K_plain, membrane_K_wilson,
)


# ─── Material y secciones (igual mesa-torsion) ─────────────────────
E = 24.85e6     # kN/m²
nu = 0.15
G = E / (2 * (1 + nu))
t_shell = 0.10  # losa 10cm

bV, hV = 0.30, 0.50    # viga 30×50
Av  = bV * hV
Izv = bV * hV**3 / 12
Iyv = hV * bV**3 / 12
# Saint-Venant J Roark
def stVenantJ(b, h):
    a = max(b, h); s = min(b, h); r = s / a
    beta = (1/3) * (1 - 0.21 * r * (1 - r**4 / 12))
    return beta * a * s**3
Jv  = stVenantJ(bV, hV)


# ─── Geometría: 4 nodos shell + 1 nodo extremo viga ───────────────
# Shell: (0,0), (1,0), (1,1), (0,1) horizontal en Z=0
# Viga: nodo 1 → nodo 4 = (2,0,0) — cantilever desde borde derecho del shell
nodes = np.array([
    [0, 0, 0],   # 0
    [1, 0, 0],   # 1
    [1, 1, 0],   # 2
    [0, 1, 0],   # 3
    [2, 0, 0],   # 4 extremo viga
])
n_nodes = 5
n_dof = 6 * n_nodes


def assemble_shell_K(membrane_func):
    """Construye K shell local 24×24 con la membrana especificada."""
    x = nodes[:4, 0]
    y = nodes[:4, 1]
    Km = membrane_func(x, y, E, nu, t_shell)   # 8×8

    # Drilling penalty (legacy 1e-6 estilo Hekatan actual)
    drill = np.sum(np.abs(np.diag(Km))) * 1e-6 / 8
    if drill < 1e-15:
        drill = E * t_shell * 1e-6

    # Bending Kirchhoff MZC simplificado (usamos solo trivial para este test)
    # En realidad no afecta este test porque la carga es Mz (in-plane).
    Kb = np.zeros((12, 12))
    # Diagonal pequeña para no singularidad en bending
    for i in range(12):
        Kb[i, i] = 1e-3 * E * t_shell

    # Assemble 24×24
    K = np.zeros((24, 24))
    # Membrane: indices [u,v] = [6i+0, 6i+1] ← Km [2i, 2i+1]
    for ni in range(4):
        for nj in range(4):
            for di in range(2):
                for dj in range(2):
                    K[6*ni + di, 6*nj + dj] = Km[2*ni + di, 2*nj + dj]
    # Bending: indices [w, θx, θy] = [6i+2..4] ← Kb [3i..3i+2]
    for ni in range(4):
        for nj in range(4):
            for di in range(3):
                for dj in range(3):
                    K[6*ni + 2 + di, 6*nj + 2 + dj] = Kb[3*ni + di, 3*nj + dj]
    # Drilling
    for i in range(4):
        K[6*i + 5, 6*i + 5] = drill
    return K


def frame_K(L, E, G, A, Iy, Iz, J):
    """Euler-Bernoulli 3D beam 12×12."""
    K = np.zeros((12, 12))
    K[0, 0] = E*A/L; K[0, 6] = -E*A/L; K[6, 0] = K[0, 6]; K[6, 6] = E*A/L
    K[3, 3] = G*J/L; K[3, 9] = -G*J/L; K[9, 3] = K[3, 9]; K[9, 9] = G*J/L
    L2 = L*L; L3 = L*L*L
    # bending Iz (around z, in xy plane)
    K[1, 1] = 12*E*Iz/L3; K[1, 5] = 6*E*Iz/L2; K[1, 7] = -12*E*Iz/L3; K[1, 11] = 6*E*Iz/L2
    K[5, 1] = K[1, 5]; K[5, 5] = 4*E*Iz/L; K[5, 7] = -6*E*Iz/L2; K[5, 11] = 2*E*Iz/L
    K[7, 1] = K[1, 7]; K[7, 5] = K[5, 7]; K[7, 7] = 12*E*Iz/L3; K[7, 11] = -6*E*Iz/L2
    K[11, 1] = K[1, 11]; K[11, 5] = K[5, 11]; K[11, 7] = K[7, 11]; K[11, 11] = 4*E*Iz/L
    # bending Iy (around y)
    K[2, 2] = 12*E*Iy/L3; K[2, 4] = -6*E*Iy/L2; K[2, 8] = -12*E*Iy/L3; K[2, 10] = -6*E*Iy/L2
    K[4, 2] = K[2, 4]; K[4, 4] = 4*E*Iy/L; K[4, 8] = 6*E*Iy/L2; K[4, 10] = 2*E*Iy/L
    K[8, 2] = K[2, 8]; K[8, 4] = K[4, 8]; K[8, 8] = 12*E*Iy/L3; K[8, 10] = 6*E*Iy/L2
    K[10, 2] = K[2, 10]; K[10, 4] = K[4, 10]; K[10, 8] = K[8, 10]; K[10, 10] = 4*E*Iy/L
    return K


def run_case(membrane_func, J_modifier, label):
    """Ensambla, resuelve y reporta Rz nodo 4."""
    K_shell = assemble_shell_K(membrane_func)
    K_frame = frame_K(L=1.0, E=E, G=G, A=Av, Iy=Iyv, Iz=Izv, J=Jv * J_modifier)

    K = np.zeros((n_dof, n_dof))
    # Shell nodos 0,1,2,3 → DOFs globales 0..23
    for i in range(24):
        for j in range(24):
            K[i, j] += K_shell[i, j]
    # Frame nodos 1, 4 → DOFs globales [6..11, 24..29]
    fmap = list(range(6, 12)) + list(range(24, 30))
    for i in range(12):
        for j in range(12):
            K[fmap[i], fmap[j]] += K_frame[i, j]

    # BCs: empotrar nodos 0, 2, 3 (los 3 nodos del shell que NO tocan la viga)
    fixed = []
    for n in [0, 2, 3]:
        for d in range(6):
            fixed.append(n * 6 + d)
    free = [i for i in range(n_dof) if i not in fixed]
    nf = len(free)

    # Carga Mz = 1.0 en nodo 4 (DOF 29)
    F = np.zeros(n_dof)
    F[4 * 6 + 5] = 1.0

    Kr = K[np.ix_(free, free)]
    Fr = F[free]
    ur = np.linalg.solve(Kr, Fr)
    u = np.zeros(n_dof)
    u[free] = ur

    Rz_node4 = u[4 * 6 + 5]
    print(f"  [{label:30s}] Rz(node4) = {Rz_node4:.4e} rad")
    return Rz_node4


print("=" * 75)
print("Mini test shell+frame cantilever (Mz=1 en extremo viga)")
print(f"  Shell 1m x 1m + viga horizontal 1m cantilever")
print(f"  J_viga Saint-Venant = {Jv:.4e}")
print("=" * 75)

Rz_A = run_case(membrane_K_plain,  1.0,  "A) Plain Q4 + J=1.0")
Rz_B = run_case(membrane_K_wilson, 1.0,  "B) Wilson Q4 + J=1.0")
Rz_C = run_case(membrane_K_plain,  0.957, "C) Plain Q4 + J=0.957")
Rz_D = run_case(membrane_K_wilson, 0.957, "D) Wilson Q4 + J=0.957")

print("\n" + "=" * 75)
print("COMPARACION (referencia = caso A baseline actual):")
print(f"  B/A (solo Wilson):           {Rz_B/Rz_A:.4f}  -> efecto Wilson")
print(f"  C/A (solo J*0.957):          {Rz_C/Rz_A:.4f}  -> efecto J modifier")
print(f"  D/A (Wilson + J*0.957):      {Rz_D/Rz_A:.4f}  -> efecto combinado")
print("=" * 75)
print("\nINTERPRETACION:")
print("  - Si Wilson AUMENTA Rz (>1.0) -> shell mas blando -> viga mas libre")
print("  - Si J modifier AUMENTA Rz (>1.0) -> viga mas blanda en torsion")
print("  - Lo que necesitas: Hekatan da +4.5% T vs ETABS = viga muy rigida")
print("    -> necesitas REDUCIR rigidez torsional Hekatan -> AUMENTAR Rz")
