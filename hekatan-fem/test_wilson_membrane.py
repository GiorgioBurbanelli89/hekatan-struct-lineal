"""
Test standalone Python — Wilson 4 incompatible modes Q4 membrane
                          + Taylor 1976 J0 patch test correction.

Referencia académica:
- Wilson, Taylor, Doherty, Ghaboussi (1973), "Incompatible Displacement Models"
- Taylor, Beresford, Wilson (1976), "A non-conforming element for stress analysis"
- Cook, Malkus, Plesha, Witt (2002), §6.6 "Incompatible Elements"
- CSI Analysis Reference Manual §10.1.1 (formulación de SAP2000/ETABS)

Esta implementación es la referencia "ground truth" para validar el C++ equivalente.

Funciones de forma extendidas (4 modos α internos):
  u_x(ξ,η) = Σ N_i(ξ,η)·u_xi + α₁·(1−ξ²) + α₂·(1−η²)
  u_y(ξ,η) = Σ N_i(ξ,η)·u_yi + α₃·(1−ξ²) + α₄·(1−η²)

Taylor 1976 patch test: las derivadas de N₅=(1−ξ²) y N₆=(1−η²) se evalúan
con el Jacobiano J₀ EVALUADO EN EL CENTRO (ξ=η=0), no con J(ξ,η). Esto
fuerza ∫B_I dV = 0 → pasa patch test en mallas distorsionadas.

Condensación estática: K_uu - K_uα · K_αα⁻¹ · K_αu → 8×8 final.
"""

import numpy as np


# 2×2 Gauss points
GP = 1.0 / np.sqrt(3.0)
GP2x2 = [(-GP, -GP), (GP, -GP), (GP, GP), (-GP, GP)]


def shape_q4(xi, eta):
    """N[4], dN/dxi[4], dN/deta[4] para Q4 bilineal CCW."""
    N = np.array([
        0.25 * (1 - xi) * (1 - eta),
        0.25 * (1 + xi) * (1 - eta),
        0.25 * (1 + xi) * (1 + eta),
        0.25 * (1 - xi) * (1 + eta),
    ])
    dNdxi = np.array([
        -0.25 * (1 - eta),
         0.25 * (1 - eta),
         0.25 * (1 + eta),
        -0.25 * (1 + eta),
    ])
    dNdeta = np.array([
        -0.25 * (1 - xi),
        -0.25 * (1 + xi),
         0.25 * (1 + xi),
         0.25 * (1 - xi),
    ])
    return N, dNdxi, dNdeta


def jacobian2D(x, y, dNdxi, dNdeta):
    """Devuelve detJ, Jinv 2×2."""
    J = np.zeros((2, 2))
    for i in range(4):
        J[0, 0] += dNdxi[i] * x[i]
        J[0, 1] += dNdxi[i] * y[i]
        J[1, 0] += dNdeta[i] * x[i]
        J[1, 1] += dNdeta[i] * y[i]
    detJ = J[0, 0] * J[1, 1] - J[0, 1] * J[1, 0]
    if abs(detJ) < 1e-15:
        detJ = 1e-15
    Jinv = np.array([
        [ J[1, 1] / detJ, -J[0, 1] / detJ],
        [-J[1, 0] / detJ,  J[0, 0] / detJ],
    ])
    return detJ, Jinv


def membrane_K_plain(x, y, E, nu, t):
    """
    Q4 plane stress estándar SIN Wilson modes — la formulación actual de
    shellThin.cpp::getMembraneK_Thin. Para comparación.
    K 8×8 sobre DOFs [u0,v0, u1,v1, u2,v2, u3,v3].
    """
    factor = E / (1.0 - nu * nu)
    Dm = factor * np.array([
        [1,  nu, 0],
        [nu, 1,  0],
        [0,  0,  (1 - nu) / 2],
    ])

    K = np.zeros((8, 8))
    for xi, eta in GP2x2:
        N, dNdxi, dNdeta = shape_q4(xi, eta)
        detJ, Jinv = jacobian2D(x, y, dNdxi, dNdeta)

        B = np.zeros((3, 8))
        for i in range(4):
            dNdx = Jinv[0, 0] * dNdxi[i] + Jinv[0, 1] * dNdeta[i]
            dNdy = Jinv[1, 0] * dNdxi[i] + Jinv[1, 1] * dNdeta[i]
            B[0, 2*i]     = dNdx
            B[1, 2*i + 1] = dNdy
            B[2, 2*i]     = dNdy
            B[2, 2*i + 1] = dNdx

        w = t * abs(detJ)
        K += w * B.T @ Dm @ B
    return K


def membrane_K_wilson(x, y, E, nu, t):
    """
    Wilson 1971 + Taylor 1976 — Q4 plane stress con 4 incompatible modes
    (α₁, α₂, α₃, α₄) condensados estáticamente. K 8×8.

    Implementación exacta de hekatan-fem/src/cpp/utils/shellQ4.cpp::getMembraneK.
    """
    factor = E / (1.0 - nu * nu)
    Dm = factor * np.array([
        [1,  nu, 0],
        [nu, 1,  0],
        [0,  0,  (1 - nu) / 2],
    ])

    # J0 en el centro (ξ=η=0) — Taylor 1976 patch test correction
    _, _, _ = shape_q4(0.0, 0.0)
    _, _, dN0deta = shape_q4(0.0, 0.0)
    _, dN0dxi, _ = shape_q4(0.0, 0.0)
    # (en realidad shape_q4(0,0) ya da dN0dxi y dN0deta del centro)
    _, dN0dxi, dN0deta = shape_q4(0.0, 0.0)
    _, Jinv0 = jacobian2D(x, y, dN0dxi, dN0deta)

    Kuu = np.zeros((8, 8))
    Kua = np.zeros((8, 4))
    Kaa = np.zeros((4, 4))

    for xi, eta in GP2x2:
        N, dNdxi, dNdeta = shape_q4(xi, eta)
        detJ, Jinv = jacobian2D(x, y, dNdxi, dNdeta)

        # Bc 3×8 compatible (standard Q4)
        Bc = np.zeros((3, 8))
        for i in range(4):
            dNdx = Jinv[0, 0] * dNdxi[i] + Jinv[0, 1] * dNdeta[i]
            dNdy = Jinv[1, 0] * dNdxi[i] + Jinv[1, 1] * dNdeta[i]
            Bc[0, 2*i]     = dNdx
            Bc[1, 2*i + 1] = dNdy
            Bc[2, 2*i]     = dNdy
            Bc[2, 2*i + 1] = dNdx

        # Bi 3×4 incompatible modes (N5=1-ξ², N6=1-η², derivadas con J0)
        # N5 natural: dN5/dxi = -2ξ, dN5/deta = 0
        # N6 natural: dN6/dxi = 0, dN6/deta = -2η
        dN5dxi  = -2.0 * xi
        dN5deta =  0.0
        dN6dxi  =  0.0
        dN6deta = -2.0 * eta
        dN5dx = Jinv0[0, 0] * dN5dxi + Jinv0[0, 1] * dN5deta
        dN5dy = Jinv0[1, 0] * dN5dxi + Jinv0[1, 1] * dN5deta
        dN6dx = Jinv0[0, 0] * dN6dxi + Jinv0[0, 1] * dN6deta
        dN6dy = Jinv0[1, 0] * dN6dxi + Jinv0[1, 1] * dN6deta

        # α-ordering: [α1=u·N5, α2=u·N6, α3=v·N5, α4=v·N6]
        Bi = np.zeros((3, 4))
        Bi[0, 0] = dN5dx
        Bi[0, 1] = dN6dx
        Bi[1, 2] = dN5dy
        Bi[1, 3] = dN6dy
        Bi[2, 0] = dN5dy
        Bi[2, 1] = dN6dy
        Bi[2, 2] = dN5dx
        Bi[2, 3] = dN6dx

        w = t * abs(detJ)
        Kuu += w * Bc.T @ Dm @ Bc
        Kua += w * Bc.T @ Dm @ Bi
        Kaa += w * Bi.T @ Dm @ Bi

    # Condensación estática: K_cond = K_uu - K_uα · K_αα⁻¹ · K_αu
    try:
        Kaa_inv = np.linalg.inv(Kaa)
    except np.linalg.LinAlgError:
        print("Warning: Kaa singular, devolviendo Kuu sin condensación")
        return Kuu
    K = Kuu - Kua @ Kaa_inv @ Kua.T
    return K


def main():
    # Q4 unit cuadrado 1×1 (caso simple)
    x = np.array([0.0, 1.0, 1.0, 0.0])
    y = np.array([0.0, 0.0, 1.0, 1.0])
    E = 24.85e6    # kN/m² (concreto 4000 psi)
    nu = 0.15
    t = 0.10       # m

    print("=" * 70)
    print("Test Wilson Q4 Membrane — Python standalone")
    print(f"  Q4 unit 1m×1m, E={E:.3e}, nu={nu}, t={t}")
    print("=" * 70)

    K_plain = membrane_K_plain(x, y, E, nu, t)
    K_wilson = membrane_K_wilson(x, y, E, nu, t)

    print("\n[K_plain]   norma Frobenius =", np.linalg.norm(K_plain))
    print("[K_wilson]  norma Frobenius =", np.linalg.norm(K_wilson))
    print(f"\nK_plain[0,0]   = {K_plain[0, 0]:.6e}")
    print(f"K_wilson[0,0]  = {K_wilson[0, 0]:.6e}")
    print(f"Ratio (Wilson/Plain) [0,0] = {K_wilson[0, 0] / K_plain[0, 0]:.6f}")
    print(f"\nK_plain[0,2]   = {K_plain[0, 2]:.6e}  (acoplamiento u0-u1)")
    print(f"K_wilson[0,2]  = {K_wilson[0, 2]:.6e}")

    # ── Test cantilever pure bending: caso clásico Wilson ──
    # Aplica fuerza horizontal F en nodos 2,3 (top), restringe nodos 0,1 (bottom)
    # Para Q4 plain → underestima deflexión (locking)
    # Para Wilson → resultado mejor (más cerca del analítico Bernoulli)
    print("\n" + "=" * 70)
    print("Test cantilever puro (bending in-plane):")
    print("  Empotrar nodos 0,1 (y=0). Aplicar F=1 kN horizontal en nodos 2,3 (y=1).")
    print("=" * 70)

    def solve_cantilever(K, label):
        # Free DOFs: u2(idx 4), v2(idx 5), u3(idx 6), v3(idx 7)
        free = [4, 5, 6, 7]
        F = np.zeros(4)
        F[0] = 0.5  # u2
        F[2] = 0.5  # u3 (total F=1.0 horizontal arriba)
        Kr = K[np.ix_(free, free)]
        ur = np.linalg.solve(Kr, F)
        u2 = ur[0]  # u2 desplazamiento horizontal
        print(f"  [{label}]  u_top (u2 ~= u3) = {u2:.6e} m")
        return u2

    u_plain  = solve_cantilever(K_plain,  "Plain Q4")
    u_wilson = solve_cantilever(K_wilson, "Wilson Q4")
    print(f"\n  Ratio Wilson/Plain = {u_wilson / u_plain:.4f}")
    print(f"  -> si > 1, Wilson da MAS deflexion = MENOS locking (correcto)")

    # ── Save K matrices to JSON for C++ comparison ──
    import json
    out = {
        "input": {"x": x.tolist(), "y": y.tolist(), "E": E, "nu": nu, "t": t},
        "K_plain":  K_plain.tolist(),
        "K_wilson": K_wilson.tolist(),
        "u_plain_top":  float(u_plain),
        "u_wilson_top": float(u_wilson),
    }
    with open("test_wilson_python_result.json", "w") as f:
        json.dump(out, f, indent=2)
    print("\nResultados guardados en test_wilson_python_result.json")


if __name__ == "__main__":
    main()
