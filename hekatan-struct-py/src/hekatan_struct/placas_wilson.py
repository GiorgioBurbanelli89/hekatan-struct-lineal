# -*- coding: utf-8 -*-
r"""Placas de Wilson tal como las escribe el libro: DKE (Discrete Kirchhoff Element) y DSE (Discrete Shear Element).

Fuente: E. L. Wilson, *Three-Dimensional Static and Dynamic Analysis of Structures*, ed. 2005, cap. 8 («2005 Chapter 8.pdf»,
08-bend.doc). Ecuaciones leídas en las imágenes de las páginas (registros/libros/wilson_cap8_2005/p-03…p-10.png):

  (8.1)-(8.2) p. 8-3   giros = 4 bilineales N1..N4 + 4 jerárquicas de lado N5..N8 = (1-r²)(1-s)/2, …
  (8.3)-(8.4) p. 8-4   el giro de punto medio solo es NORMAL al lado: Δθx = sin α Δθ, Δθy = -cos α Δθ
  (8.5)       p. 8-5   ux = z θy, uy = -z θx
  (8.6)-(8.7) p. 8-5   cortante de lado γij = (uzj-uzi)/L - ½(θi+θj) - ⅔ Δθij,  θi = sin α θxi - cos α θyi
  (8.8)-(8.9) p. 8-6   cortantes del nudo i desde los dos lados que llegan (ij y ki); luego bilineales al punto de Gauss
  (8.10)      p. 8-7   ψxx = θy,x   ψyy = -θx,y   ψxy = θy,y - θx,x
  (8.15)      p. 8-8   D11 = D22 = Eh³/12(1-ν²), D12 = ν·D11, D33 = (1-ν)/2·D11 (isótropo), D44 = D55 = 5Eh/12(1+ν)
  (8.17)      p. 8-8   patch test: b12 ← b12 - (1/A)∫b12 dA   (curvaturas de los Δθ)
  (8.18-8.19) p. 8-9   K de 16×16 y condensación estática de los 4 Δθ  → DSE
  (8.21)      p. 8-10  cortante de lado nulo: Δθ = 3/(2L)(wj-wi) - ¾(θi+θj) → DKE (sin condensación)
  §8.9        p. 8-10  «a four-point numerical integration formula is used for the quadrilateral element»

GDL por nudo en la salida: [w, θx, θy] (el orden de `placas.py`; mano derecha, θx = ∂w/∂y, θy = -∂w/∂x, que es lo
que dan (8.5) con γ = 0). Medido: k_dke = placas.k_dkq (Batoz-Tahar 1982) a 1e-15.
"""
from __future__ import annotations

import numpy as np

G2 = 1.0 / np.sqrt(3.0)
GAUSS4 = ((-G2, -G2), (G2, -G2), (G2, G2), (-G2, G2))


def _D(E, nu, h):
    Db = E * h**3 / (12 * (1 - nu**2)) * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1 - nu) / 2]])
    Ds = 5 * E * h / (12 * (1 + nu)) * np.eye(2)
    return Db, Ds


def _lados(P):
    """Para el lado m = (i -> j), i = 0..3: L, sin α, cos α."""
    out = []
    for i in range(4):
        d = P[(i + 1) % 4] - P[i]; L = float(np.hypot(*d))
        out.append((L, d[1] / L, d[0] / L))
    return out


def _formas(r, s, P):
    """N1..N4 y sus derivadas en x, y; derivadas de N5..N8 en x, y; det J."""
    N = 0.25 * np.array([(1 - r) * (1 - s), (1 + r) * (1 - s), (1 + r) * (1 + s), (1 - r) * (1 + s)])
    dN = 0.25 * np.array([[-(1 - s), (1 - s), (1 + s), -(1 + s)], [-(1 - r), -(1 + r), (1 + r), (1 - r)]])
    dM = np.array([[-r * (1 - s), 0.5 * (1 - s * s), -r * (1 + s), -0.5 * (1 - s * s)],
                   [-0.5 * (1 - r * r), -(1 + r) * s, 0.5 * (1 - r * r), -(1 - r) * s]])
    J = dN @ P; dj = float(np.linalg.det(J)); Ji = np.linalg.inv(J)
    return N, Ji @ dN, Ji @ dM, dj


def _curvaturas_16(r, s, P, lados):
    """b de curvaturas (3 × 16): columnas [w, θx, θy]×4 y luego Δθ5..Δθ8. (8.4) + (8.10)."""
    N, dN, dM, dj = _formas(r, s, P)
    gx = np.zeros((2, 16)); gy = np.zeros((2, 16))         # gradientes de θx y de θy
    for k in range(4):
        gx[:, 3 * k + 1] = dN[:, k]; gy[:, 3 * k + 2] = dN[:, k]
    for m, (L, sa, ca) in enumerate(lados):
        gx[:, 12 + m] = dM[:, m] * sa; gy[:, 12 + m] = -dM[:, m] * ca
    b = np.vstack([gy[0], -gx[1], gy[1] - gx[0]])
    return b, N, dj


def _cortantes_16(N, lados):
    """b de cortantes (2 × 16) en el punto: (8.7) por lado, (8.9) por nudo, bilineales al punto."""
    G = np.zeros((4, 16))                                  # γ de cada lado sobre los 16 GDL
    for m, (L, sa, ca) in enumerate(lados):
        i, j = m, (m + 1) % 4
        G[m, 3 * j] += 1 / L; G[m, 3 * i] -= 1 / L
        for n in (i, j):
            G[m, 3 * n + 1] -= sa / 2; G[m, 3 * n + 2] += ca / 2
        G[m, 12 + m] -= 2.0 / 3.0
    b = np.zeros((2, 16))
    for i in range(4):
        ij, ki = i, (i - 1) % 4                            # lado que sale de i y lado que llega a i
        _, sij, cij = lados[ij]; _, ski, cki = lados[ki]
        det = cij * ski - cki * sij
        Tinv = np.array([[ski, -cki], [-sij, cij]]) / det   # (8.9)
        gn = Tinv @ np.vstack([G[ij], G[ki]])                # (γxz, γyz) del nudo i
        b += N[i] * gn
    return b


def _restriccion_dke(lados):
    """(8.21): Δθm = T[m] · u  (12 GDL)."""
    T = np.zeros((4, 12))
    for m, (L, sa, ca) in enumerate(lados):
        i, j = m, (m + 1) % 4
        T[m, 3 * j] += 1.5 / L; T[m, 3 * i] -= 1.5 / L
        for n in (i, j):                                   # θn = sin α θx - cos α θy
            T[m, 3 * n + 1] -= 0.75 * sa; T[m, 3 * n + 2] += 0.75 * ca
    return T


def b_dke(P, r, s):
    """Curvaturas del DKE (3 × 12) en (r, s)."""
    P = np.asarray(P, float); lados = _lados(P)
    b16, _, _ = _curvaturas_16(r, s, P, lados)
    return b16[:, :12] + b16[:, 12:] @ _restriccion_dke(lados)


def k_dke(P, E, nu, h):
    """K 12 × 12 del DKE de Wilson (8.21), integración 2 × 2. GDL [w, θx, θy] por nudo."""
    P = np.asarray(P, float); Db, _ = _D(E, nu, h); K = np.zeros((12, 12))
    for r, s in GAUSS4:
        _, _, _, dj = _formas(r, s, P); B = b_dke(P, r, s); K += B.T @ Db @ B * dj
    return K


def _dse_partes(P, E, nu, h):
    """K 16 × 16 del DSE con la corrección (8.17), y las b de cada punto de Gauss."""
    P = np.asarray(P, float); lados = _lados(P); Db, Ds = _D(E, nu, h)
    pts = [(_curvaturas_16(r, s, P, lados)) for r, s in GAUSS4]
    A = sum(dj for _, _, dj in pts)
    b12m = sum(b[:, 12:] * dj for b, _, dj in pts) / A      # (1/A)∫ b12 dA
    K = np.zeros((16, 16)); Bs = []
    for b, N, dj in pts:
        bk = b.copy(); bk[:, 12:] -= b12m                    # (8.17)
        bg = _cortantes_16(N, lados)
        K += (bk.T @ Db @ bk + bg.T @ Ds @ bg) * dj
        Bs.append((bk, bg, dj))
    return K, Bs


def k_dse_16(P, E, nu, h):
    return _dse_partes(P, E, nu, h)[0]


def k_dse(P, E, nu, h):
    """K 12 × 12 del DSE de Wilson: (8.18)-(8.19), condensación de los 4 Δθ. GDL [w, θx, θy] por nudo."""
    K = k_dse_16(P, E, nu, h)
    return K[:12, :12] - K[:12, 12:] @ np.linalg.solve(K[12:, 12:], K[12:, :12])


def momentos(tipo, P, E, nu, h, u, donde="nudos"):
    """Momentos [Mxx, Myy, Mxy] = Db·ψ (signo del libro: ψ de (8.10)). donde = «nudos» (Gauss 2 × 2 extrapolado),
    «gauss» (los 4 puntos) o «centro»."""
    P = np.asarray(P, float); u = np.asarray(u, float); Db, _ = _D(E, nu, h)
    if tipo == "dke":
        Bfun = lambda r, s: b_dke(P, r, s)
    else:
        K, _ = _dse_partes(P, E, nu, h); lados = _lados(P)
        dth = -np.linalg.solve(K[12:, 12:], K[12:, :12] @ u)
        pts = [_curvaturas_16(r, s, P, lados) for r, s in GAUSS4]
        A = sum(dj for _, _, dj in pts); b12m = sum(b[:, 12:] * dj for b, _, dj in pts) / A
        def Bfun(r, s):
            b, _, _ = _curvaturas_16(r, s, P, lados)
            return np.hstack([b[:, :12], b[:, 12:] - b12m])
        u = np.concatenate([u, dth])
    if donde == "centro":
        return Db @ Bfun(0.0, 0.0) @ u
    Mg = np.array([Db @ Bfun(r, s) @ u for r, s in GAUSS4])
    if donde == "gauss":
        return Mg
    s3 = np.sqrt(3.0); out = []
    for rc, sc in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        w = [0.25 * (1 + s3 * rc * np.sign(r)) * (1 + s3 * sc * np.sign(s)) for r, s in GAUSS4]
        out.append(sum(wi * m for wi, m in zip(w, Mg)))
    return np.array(out)


def rigidez(tipo, P, E, nu, h):
    return {"dke": k_dke, "dse": k_dse}[tipo](P, E, nu, h)


# ---------------------------------------------------------------- ejemplos del libro (§8.9)
def cuadrante_placa_cuadrada(tipo, h, n=4, carga="puntual", lado=10.0, E=10.92, nu=0.3, donde="nudos"):
    """§8.9.2-8.9.3 (p. 8-11 a 8-13, fig. 8.6): cuarto de placa cuadrada de 10 × 10 apoyada, malla n × n, borde
    «duro» (w = 0 y giro normal = 0 en los apoyos), simetría en x = 5 (θy = 0) e y = 5 (θx = 0).
    carga «puntual»: P = 1 en el centro (¼ al cuadrante); «uniforme»: q = 1.
    Devuelve (w·h³ en el centro, Mxx en el centro)."""
    a = lado / 2; xs = np.linspace(0, a, n + 1)
    nod = np.array([(x, y) for y in xs for x in xs]); idx = lambda i, j: j * (n + 1) + i
    els = [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)] for j in range(n) for i in range(n)]
    N = 3 * len(nod); K = np.zeros((N, N)); F = np.zeros(N); fij = set()
    for e in els:
        d = np.array([3 * k + c for k in e for c in range(3)])
        K[np.ix_(d, d)] += rigidez(tipo, nod[e], E, nu, h)
        if carga == "uniforme":
            A = (a / n) ** 2
            for k in e: F[3 * k] += A / 4
    c = idx(n, n)
    if carga == "puntual": F[3 * c] = 0.25
    for k, (x, y) in enumerate(nod):
        if x < 1e-9: fij |= {3 * k, 3 * k + 1}             # borde x = 0: w = 0 y θx (giro a lo largo del borde) = 0
        if y < 1e-9: fij |= {3 * k, 3 * k + 2}             # borde y = 0: w = 0 y θy = 0
        if abs(x - a) < 1e-9: fij.add(3 * k + 2)           # simetría: ∂w/∂x = 0
        if abs(y - a) < 1e-9: fij.add(3 * k + 1)           # simetría: ∂w/∂y = 0
    lib = np.array([i for i in range(N) if i not in fij]); u = np.zeros(N)
    u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
    ec = [k for k, e in enumerate(els) if c in e][0]; e = els[ec]
    ue = u[np.array([3 * k + cc for k in e for cc in range(3)])]
    M = momentos(tipo, nod[e], E, nu, h, ue, donde)
    Mc = M[e.index(c)][0] if donde == "nudos" else (M[2][0] if donde == "gauss" else M[0])
    return u[3 * c] * h**3, Mc


def viga_un_elemento(tipo, E=1.0e7, nu=0.3, h=2.0, L=6.0, b=0.2, P=1.0):
    """§8.9.1, fig. 8.5 y tabla 8.1 (p. 8-10, 8-11): voladizo de UN elemento de 6 × 0.2 en planta y 2 de espesor,
    carga P en la punta. Empotramiento «blando»: w = 0 y θy = 0 en x = 0 (θx libre: la sección se curva sola con ν).
    Devuelve (flecha de la punta, momento en la raíz).  Libro: DKE 0.0000540 · DSE 0.0000587 · 6.00."""
    nod = np.array([(0, 0), (L, 0), (L, b), (0, b)], float)
    K = rigidez(tipo, nod, E, nu, h); F = np.zeros(12); F[3] = F[6] = P / 2
    fij = [0, 2, 9, 11]; lib = [i for i in range(12) if i not in fij]
    u = np.zeros(12); u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
    R = K @ u - F
    return 0.5 * (u[3] + u[6]), R[2] + R[11]
