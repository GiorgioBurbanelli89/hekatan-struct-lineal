# -*- coding: utf-8 -*-
"""Tres modelos para el vídeo de comprobación (Hekatan Struct vs SAP2000 vs ETABS).
Concreto E = 25 GPa, nu = 0.2, rho = 2.4 t/m3, peso propio. Unidades kN, m."""
import os
AQUI = os.path.dirname(os.path.abspath(__file__))
E, NU, RHO = 25e6, 0.2, 2.4

def rect(b, h):   # A, I22 (débil, plano 1-3), I33 (fuerte, plano 1-2 = canto h), J (Saint-Venant)
    a, c = max(b, h), min(b, h); r = a / c
    beta = 1 / 3 - 0.21 * (c / a) * (1 - (c / a) ** 4 / 12)
    return b * h, h * b ** 3 / 12, b * h ** 3 / 12, beta * a * c ** 3

class M:
    def __init__(s, titulo): s.L = ["# " + titulo, "selfweight 1"]; s.nid = {}; s.nf = 0; s.ns = 0
    def n(s, x, y, z):
        k = (round(x, 6), round(y, 6), round(z, 6))
        if k not in s.nid:
            s.nid[k] = len(s.nid) + 1; s.L.append("node %d %g %g %g" % (s.nid[k], *k))
        return s.nid[k]
    def f(s, p, q, b, h, nombre):
        A, I22, I33, J = rect(b, h); s.nf += 1
        s.L.append("frame %d %d %d %g %.6g %.6g %.6g %.6g %g %g %g %g # %s" % (s.nf, p, q, E, A, I22, I33, J, NU, RHO, h, b, nombre))
    def s4(s, a, b, c, d, t, tipo):
        s.ns += 1; s.L.append("shell %d %d %d %d %d %g %g 0 %g" % (1000 + s.ns, a, b, c, d, t, E, RHO)); s.L.append("shelltype %d %s" % (1000 + s.ns, tipo))
    def escribir(s, nombre):
        s.L.append("solve"); open(os.path.join(AQUI, nombre), "w", encoding="utf-8").write("\n".join(s.L) + "\n")
        print("%-16s nudos %d · barras %d · cáscaras %d" % (nombre, len(s.nid), s.nf, s.ns))

# ── 1. MURO DE CORTE: 6 m × 6 m, t = 0.25, malla 0.5 m, plano XZ ──
m = M("Muro de corte 6 x 6 m, t = 0.25 m, malla 0.5 m, base empotrada, 150 kN laterales")
nx = nz = 12; dx = 0.5
for k in range(nz):
    for i in range(nx):
        m.s4(m.n(i*dx, 0, k*dx), m.n((i+1)*dx, 0, k*dx), m.n((i+1)*dx, 0, (k+1)*dx), m.n(i*dx, 0, (k+1)*dx), 0.25, "thick")
for i in range(nx + 1): m.L.append("support %d 1 1 1 1 1 1" % m.n(i*dx, 0, 0))
for z, F in ((3.0, 50.0), (6.0, 100.0)):
    for i in range(nx + 1):
        w = 0.5 if i in (0, nx) else 1.0
        m.L.append("load %d %g 0 0 0 0 0" % (m.n(i*dx, 0, z), F * w / nx))
m.escribir("muro_corte.heks")

# ── 2. EDIFICIO DE 2 PISOS: 2 × 2 vanos de 5 m, h = 3 m, losas t = 0.15 (malla 2.5 m) ──
m = M("Edificio de 2 pisos, 2 x 2 vanos de 5 m, columnas 40x40, vigas 30x50, losas 15 cm (malla 1.25 m), 20 kN laterales por columna")
# malla de losa de 1.25 m: ETABS automalla las losas a <= 1.25 m; con celdas de 2.5 m su malla
# de análisis NO era la de SAP2000 y Hekatan (medido: 0.33 % estático, 7 % en periodos)
g = [1.25 * k for k in range(9)]; ej = (0, 4, 8)
for i in ej:
    for j in ej: m.L.append("support %d 1 1 1 1 1 1" % m.n(g[i], g[j], 0))
for piso, z in ((1, 3.0), (2, 6.0)):
    for i in ej:
        for j in ej: m.f(m.n(g[i], g[j], z - 3), m.n(g[i], g[j], z), 0.4, 0.4, "C40X40")
    for j in ej:
        for i in range(8): m.f(m.n(g[i], g[j], z), m.n(g[i+1], g[j], z), 0.3, 0.5, "V30X50")
    for i in ej:
        for j in range(8): m.f(m.n(g[i], g[j], z), m.n(g[i], g[j+1], z), 0.3, 0.5, "V30X50")
    for i in range(8):
        for j in range(8): m.s4(m.n(g[i], g[j], z), m.n(g[i+1], g[j], z), m.n(g[i+1], g[j+1], z), m.n(g[i], g[j+1], z), 0.15, "thin")
    for i in ej:
        for j in ej: m.L.append("load %d 20 0 0 0 0 0" % m.n(g[i], g[j], z))
m.escribir("edificio_2p.heks")

# ── 3. PUENTE: luz 20 m, ancho 8 m, 3 vigas 40x120, tablero t = 0.20, diafragmas 30x80 ──
m = M("Puente losa-viga, luz 20 m, ancho 8 m, 3 vigas 40x120, tablero 20 cm, diafragmas 30x80, camion 3 x 100 kN al centro")
# celdas de 1.0 m (ETABS no remalla por debajo de 1.25 m: con 2 m daba 3.4 % en periodos)
xs = [1.0 * i for i in range(21)]; ys = [1.0 * j for j in range(9)]
for i in range(20):
    for j in range(8): m.s4(m.n(xs[i], ys[j], 0), m.n(xs[i+1], ys[j], 0), m.n(xs[i+1], ys[j+1], 0), m.n(xs[i], ys[j+1], 0), 0.20, "thick")
for y in (0, 4, 8):
    for i in range(20): m.f(m.n(xs[i], y, 0), m.n(xs[i+1], y, 0), 0.4, 1.2, "V40X120")
for x in (0, 10, 20):
    for j in range(8): m.f(m.n(x, ys[j], 0), m.n(x, ys[j+1], 0), 0.3, 0.8, "D30X80")
for y in (0, 4, 8):
    m.L.append("support %d 1 1 1 0 0 0" % m.n(0, y, 0))
    m.L.append("support %d 0 1 1 0 0 0" % m.n(20, y, 0))
for y in (2, 4, 6): m.L.append("load %d 0 0 -100 0 0 0" % m.n(10, y, 0))
m.escribir("puente.heks")
