"""Modelos mínimos de PANDEO DE CÁSCARAS (muros y losas) — los MISMOS nudos y paños en SAP2000 y en Struct.
Unidades kN, m. Shell-Thin (DKQ + membrana con giro normal), E acero.

  placa_*  : placa simplemente apoyada a×b comprimida en los bordes x = 0 y x = a (Timoshenko k = 4 para a/b = 2)
  muro_*   : muro ménsula (plano XZ) empotrado en la base, carga vertical repartida en la cabeza
  losa_*   : losa cuadrada simplemente apoyada en cortante puro en el plano (Timoshenko k_s = 9.34)
"""
import math

E, NU = 2.0e8, 0.3


def malla(nx, ny, a, b, plano="XY"):
    """Nudos (i + j·(nx+1)) y paños Q4 antihorarios. plano XY: (x, y, 0); XZ: (x, 0, y)."""
    nodos = []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x, y = a * i / nx, b * j / ny
            nodos.append([x, y, 0.0] if plano == "XY" else [x, 0.0, y])
    q = lambda i, j: i + j * (nx + 1)
    panos = [[q(i, j), q(i + 1, j), q(i + 1, j + 1), q(i, j + 1)] for j in range(ny) for i in range(nx)]
    return nodos, panos, q


def placa(nx, ny, a=2.0, b=1.0, t=0.01, qx=100.0):
    nodos, panos, q = malla(nx, ny, a, b)
    ap, car = {}, {}
    for j in range(ny + 1):
        for i in range(nx + 1):
            if i in (0, nx) or j in (0, ny): ap[q(i, j)] = [0, 0, 1, 0, 0, 0]
    ap[q(0, 0)] = [1, 1, 1, 0, 0, 0]; ap[q(nx, 0)] = [0, 1, 1, 0, 0, 0]
    h = b / ny
    for j in range(ny + 1):
        f = qx * h * (0.5 if j in (0, ny) else 1.0)
        car[q(0, j)] = [f, 0, 0, 0, 0, 0]; car[q(nx, j)] = [-f, 0, 0, 0, 0, 0]
    D = E * t ** 3 / (12 * (1 - NU ** 2))
    lam = 4 * math.pi ** 2 * D / b ** 2 / qx if abs(a / b - 2) < 1e-9 else None
    return dict(nombre="placa_%dx%d" % (nx, ny), nodos=nodos, panos=panos, t=t, apoyos=ap, cargas=car,
                analitico=lam, nota="Timoshenko k=4: λ = 4π²D/(b²·q)")


def muro(nx, ny, a=2.0, H=3.0, t=0.15, qz=1000.0):
    nodos, panos, q = malla(nx, ny, a, H, "XZ")
    ap, car = {}, {}
    for i in range(nx + 1): ap[q(i, 0)] = [1, 1, 1, 1, 1, 1]
    h = a / nx
    for i in range(nx + 1):
        car[q(i, ny)] = [0, 0, -qz * h * (0.5 if i in (0, nx) else 1.0), 0, 0, 0]
    D = E * t ** 3 / (12 * (1 - NU ** 2))
    lam = math.pi ** 2 * D / (4 * H ** 2) / qz     # franja de placa en ménsula (bordes libres: aprox.)
    return dict(nombre="muro_%dx%d" % (nx, ny), nodos=nodos, panos=panos, t=t, apoyos=ap, cargas=car,
                analitico=lam, nota="ménsula de placa π²D/(4H²) (aprox., bordes libres)")


def losa(n, a=4.0, t=0.02, s=100.0):
    nodos, panos, q = malla(n, n, a, a)
    ap, car = {}, {}
    for j in range(n + 1):
        for i in range(n + 1):
            if i in (0, n) or j in (0, n): ap[q(i, j)] = [0, 0, 1, 0, 0, 0]
    ap[q(0, 0)] = [1, 1, 1, 0, 0, 0]; ap[q(n, 0)] = [0, 1, 1, 0, 0, 0]
    h = a / n
    def suma(k, v):
        c = car.setdefault(k, [0.0] * 6)
        for z in range(6): c[z] += v[z]
    for k in range(n + 1):
        f = s * h * (0.5 if k in (0, n) else 1.0)
        suma(q(k, n), [f, 0, 0, 0, 0, 0]); suma(q(k, 0), [-f, 0, 0, 0, 0, 0])   # τ en y = a (+x) y en y = 0 (−x)
        suma(q(n, k), [0, f, 0, 0, 0, 0]); suma(q(0, k), [0, -f, 0, 0, 0, 0])   # τ en x = a (+y) y en x = 0 (−y)
    D = E * t ** 3 / (12 * (1 - NU ** 2))
    lam = 9.34 * math.pi ** 2 * D / a ** 2 / s
    return dict(nombre="losa_%dx%d" % (n, n), nodos=nodos, panos=panos, t=t, apoyos=ap, cargas=car,
                analitico=lam, nota="Timoshenko cortante k_s=9.34: λ = 9.34π²D/(a²·τt)")


MODELOS = [placa(1, 1, 1.0, 1.0), placa(2, 1), placa(4, 2), placa(16, 8), muro(2, 3), muro(8, 12),
           losa(4), losa(12)]
