# -*- coding: utf-8 -*-
r"""Wilson (2005), *Three-Dimensional Static and Dynamic Analysis of Structures*, cap. 8 §8.9: TODOS los ejemplos numéricos
con las placas DKE y DSE del libro (`hekatan_struct.placas_wilson`).

    python examples/07_viga_un_elemento_wilson.py          imprime las tablas 8.1 a 8.6 contra el libro

Tabla 8.1 (Fig. 8.5): voladizo de 6.0 × 0.2 in en planta, 2.0 in de espesor, modelado con UN SOLO elemento de placa,
empotrado en x = 0 (w = θx = θy = 0 en los nudos 1 y 4) y 1.0 k en la punta (0.5 k en cada nudo 2 y 3).

Dos observaciones medidas (no supuestas):
1. UNIDADES. Con E = 10 000 ksi, PL³/(3EI) = 1·6³/(3·10 000·0.1333) = 0.054 in, no 0.000054. La columna impresa
   corresponde a E = 10 000 000 y G = 3 846 000 (los datos de la Fig. 8.7). La tabla tiene un factor 1000; las
   RELACIONES no dependen de eso: Timoshenko/Euler = 1.0867, PK2/Euler = 0.837.
2. POISSON. El libro da E y G sueltos. La tabla sale EXACTA con la flexión con ν = 0 (D = E·h³/12) y el cortante con
   5/6·G·h y G = 3 846. Con ν = 0.3 en la flexión el elemento sale 6.8 % más rígido (efecto placa de D/(1−ν²)).
"""
from __future__ import annotations

import os
import sys

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src"))
import hekatan_struct.placas_wilson as PW  # noqa: E402

# ------------------------------------------------------------------ datos de la Fig. 8.5
L, B, H = 6.0, 0.2, 2.0          # in: largo, ancho en planta, espesor
P = 1.0                          # kip en la punta
E_LIBRO, G_LIBRO = 10_000.0, 3_846.0       # ksi, como están impresos
KAPPA = 5.0 / 6.0
GEOM = np.array([(0, 0), (L, 0), (L, B), (0, B)], float)
TABLA_8_1 = {"Euler-Bernoulli": (0.0000540, 6.00), "Timoshenko": (0.0000587, 6.00), "DSE": (0.0000587, 6.00),
             "DKE": (0.0000540, 6.00), "PK2 (ref. [1])": (0.0000452, 3.00)}


def viga_euler(E=E_LIBRO, L=L, b=B, h=H, P=P):
    """Flecha en la punta de Euler-Bernoulli: δ = P·L³/(3·E·I), I = b·h³/12."""
    return P * L**3 / (3 * E * b * h**3 / 12)


def viga_timoshenko(E=E_LIBRO, G=G_LIBRO, L=L, b=B, h=H, P=P, kappa=KAPPA):
    """Euler más el cortante: δ = P·L³/(3EI) + P·L/(κ·G·A)."""
    return viga_euler(E, L, b, h, P) + P * L / (kappa * G * b * h)


def relacion_timoshenko(L_h, E_G=E_LIBRO / G_LIBRO, kappa=KAPPA):
    """δ_Timoshenko / δ_Euler = 1 + E·h²/(4·κ·G·L²), solo depende de L/h (y de E/G)."""
    return 1 + E_G / (4 * kappa * L_h**2)


def _D_libro(G, nu_flexion):
    def D(E, nu, h):
        Db = E * h**3 / (12 * (1 - nu_flexion**2)) * np.array([[1, nu_flexion, 0], [nu_flexion, 1, 0], [0, 0, (1 - nu_flexion) / 2]])
        return Db, KAPPA * G * h * np.eye(2)
    return D


def un_elemento(tipo, E=E_LIBRO, G=G_LIBRO, nu_flexion=0.0, P=P):
    """El voladizo con UN elemento DKE o DSE. Devuelve dict con w de la punta, giro, momento en la base (de las
    reacciones y de Mxx·b en los nudos) y en el centro del elemento (lo que da un elemento de momento constante)."""
    D0 = PW._D
    PW._D = _D_libro(G, nu_flexion)                      # E y G sueltos, como los da el libro
    try:
        K = PW.rigidez(tipo, GEOM, E, 0.3, H)
        F = np.zeros(12); F[3] = F[6] = P / 2              # nudos 2 y 3, GDL w
        lib = [3, 4, 5, 6, 7, 8]; u = np.zeros(12)
        u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
        R = K @ u
        Mn = PW.momentos(tipo, GEOM, E, 0.3, H, u)[:, 0] * B
        Mc = PW.momentos(tipo, GEOM, E, 0.3, H, u, "centro")[0] * B
    finally:
        PW._D = D0
    return {"w": float(u[3]), "theta_y": float(u[5]), "M_base_reaccion": float(R[2] + R[11]),
            "M_base_nudos": float(-Mn[0]), "M_centro": float(-Mc), "K": K}


def tabla_8_1(E=E_LIBRO, G=G_LIBRO):
    dke, dse = un_elemento("dke", E, G), un_elemento("dse", E, G)
    return {"Euler-Bernoulli": viga_euler(E), "Timoshenko": viga_timoshenko(E, G), "DSE": dse["w"], "DKE": dke["w"],
            "M_DKE": dke["M_base_nudos"], "M_DSE": dse["M_base_nudos"], "Mc_DKE": dke["M_centro"]}


# ------------------------------------------------------------------ tablas 8.2 a 8.4 (cuarto de placa cuadrada)
TABLA_8_2 = {1: (1.195, 1.383, 0.3545, 0.4273), 0.1: (1.195, 1.219, 0.3545, 0.4269), 0.01: (1.195, 1.218, 0.3545, 0.4269),
             0.001: (1.195, 1.218, 0.3545, 0.4269), 0.0001: (1.195, 1.218, 0.3545, 0.4269)}
TABLA_8_3 = {1: (1.163, 1.393, 0.5187, 0.5704), 0.01: (1.163, 1.164, 0.5187, 0.5295), 0.0001: (1.163, 1.164, 0.5187, 0.5295)}
TABLA_8_4 = {1: (9.807, 10.32, 1.142, 1.144), 0.01: (9.807, 9.815, 1.142, 1.144), 0.0001: (9.807, 9.815, 1.142, 1.144)}
TABLA_8_5 = {1: (9.807, 10.308, 1.145, 1.145), 0.01: (9.807, 9.807, 1.145, 1.145), 0.0001: (9.807, 9.807, 1.145, 1.145)}


def tabla_placa(n, carga, espesores):
    out = {}
    for h in espesores:
        (wk, mk), (ws, ms) = (PW.cuadrante_placa_cuadrada(t, h, n, carga) for t in ("dke", "dse"))
        out[h] = (wk, ws, mk, ms)
    return out


# ------------------------------------------------------------------ tabla 8.6 (torsión, Fig. 8.7)
TABLA_8_6 = {("libre", "1x6"): (0.0284, 0.2368), ("libre", "9x9"): (0.0233, 0.1249),
             ("fijo", "1x6"): (0.0227, 0.0849), ("fijo", "9x9"): (0.0218, 0.0756)}


def torsion(tipo, nx, ny, giro_y_fijo, L=6.0, b=0.2, h=0.1, E=1e7, nu=0.3, T=1.0):
    """Voladizo 6 × 0.2 (planta) × 0.1 (espesor) con torsor T en la punta, repartido a partes iguales en sus nudos.
    giro_y_fijo: θy = 0 en todos los nudos («Y-rotation fixed»)."""
    xs = np.linspace(0, L, nx + 1); ys = np.linspace(0, b, ny + 1)
    nod = np.array([(x, y) for y in ys for x in xs]); idx = lambda i, j: j * (nx + 1) + i
    els = [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)] for j in range(ny) for i in range(nx)]
    N = 3 * len(nod); K = np.zeros((N, N)); F = np.zeros(N)
    for e in els:
        d = np.array([3 * k + c for k in e for c in range(3)]); K[np.ix_(d, d)] += PW.rigidez(tipo, nod[e], E, nu, h)
    punta = [idx(nx, j) for j in range(ny + 1)]
    for k in punta: F[3 * k + 1] += T / len(punta)
    fij = set()
    for k, (x, _) in enumerate(nod):
        if x < 1e-9: fij |= {3 * k, 3 * k + 1, 3 * k + 2}
        if giro_y_fijo: fij.add(3 * k + 2)
    lib = np.array([i for i in range(N) if i not in fij]); u = np.zeros(N)
    u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
    return float(np.mean([u[3 * k + 1] for k in punta]))


def torsion_exacta(L=6.0, b=0.2, h=0.1, E=1e7, nu=0.3, T=1.0):
    """Saint-Venant de un rectángulo b/h = 2: J = β·b·h³ con β = 0.229."""
    G = E / (2 * (1 + nu)); return T * L / (G * 0.229 * b * h**3)


def _pct(a, b): return 100 * (a - b) / b


def main():
    print("=" * 78)
    print("Tabla 8.1 · voladizo con UN elemento (L 6.0, b 0.2, h 2.0 in, P 1.0 k)")
    print("  a mano: I = b·h³/12 = %.5f in⁴   A = %.2f in²" % (B * H**3 / 12, B * H))
    print("  PL³/3EI con E = 10 000 ksi = %.6f in   <- el libro imprime 0.0000540" % viga_euler())
    print("  P·L/(κGA), κ = 5/6           = %.6f in   (κ = 1: %.6f)" % (P * L / (KAPPA * G_LIBRO * B * H), P * L / (G_LIBRO * B * H)))
    print("  relación Timoshenko/Euler = %.4f   (libro 0.0000587/0.0000540 = %.4f)" % (viga_timoshenko() / viga_euler(), 587 / 540))
    print("  relación PK2/Euler (libro) = %.4f" % (452 / 540))
    for nombre, E, G in (("E, G como están impresos (ksi)", E_LIBRO, G_LIBRO), ("E = 1e7, G = 3.846e6 (escala de la tabla)", 1e7, 3.846e6)):
        r = tabla_8_1(E, G)
        print("  --", nombre)
        for k in ("Euler-Bernoulli", "Timoshenko", "DSE", "DKE"):
            print("     %-16s δ = %.7e in   libro %.7f" % (k, r[k], TABLA_8_1[k][0]))
        print("     momento en la base DKE %.4f  DSE %.4f  (libro 6.00) · en el centro %.4f (lo de PK2: 3.00)" % (r["M_DKE"], r["M_DSE"], r["Mc_DKE"]))
    for nu in (0.0, 0.3):
        d = un_elemento("dke", 1e7, 3.846e6, nu); s = un_elemento("dse", 1e7, 3.846e6, nu)
        print("  flexión con ν = %.1f: DKE %.4e  DSE %.4e" % (nu, d["w"], s["w"]))

    for titulo, n, carga, ref, hs in (("Tabla 8.2 · cuarto de placa 4×4, carga puntual", 4, "puntual", TABLA_8_2, (1, .1, .01, .001, .0001)),
                                      ("Tabla 8.3 · 16×16, carga puntual", 16, "puntual", TABLA_8_3, (1, .01, .0001)),
                                      ("Tabla 8.4 · 16×16, carga uniforme", 16, "uniforme", TABLA_8_4, (1, .01, .0001))):
        print("=" * 78); print(titulo); print("  h        w·h³ DKE  libro   w·h³ DSE  libro   DSE/DKE  libro    M DKE  libro   M DSE  libro")
        for h, (wk, ws, mk, ms) in tabla_placa(n, carga, hs).items():
            rk, rs, rmk, rms = ref[h]
            print("  %-7g  %8.4f %7.3f   %8.4f %7.3f   %7.4f %7.4f   %6.4f %6.4f  %6.4f %6.4f" % (h, wk, rk, ws, rs, ws / wk, rs / rk, mk, rmk, ms, rms))
    print("  Navier, placa delgada apoyada q = 1, a = 10: w·D = 0.00406·a⁴ = %.2f (D = h³ con E = 10.92, ν = 0.3)" % (0.00406 * 1e4))
    print("=" * 78); print("Tabla 8.5 · triángulos: NO reproducida (placas_wilson.py no trae el triángulo DKE/DSE)")
    print("=" * 78); print("Tabla 8.6 · torsión (6 × 0.2 × 0.1, E 1e7, ν 0.3, T = 1). Exacta Saint-Venant %.4f rad (libro 0.034)" % torsion_exacta())
    for (giro, malla), (rk, rs) in TABLA_8_6.items():
        nx, ny = (6, 1) if malla == "1x6" else (9, 9)
        k = torsion("dke", nx, ny, giro == "fijo"); s = torsion("dse", nx, ny, giro == "fijo")
        print("  θy %-5s %s   DKE %.4f (libro %.4f)   DSE %.4f (libro %.4f)" % (giro, malla, k, rk, s, rs))


if __name__ == "__main__":
    main()
