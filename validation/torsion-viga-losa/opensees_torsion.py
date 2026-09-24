# -*- coding: utf-8 -*-
"""
El MISMO modelo de 1 vano x 1 vano en OpenSees, para que el arbitro no sea Hekatan.

  sin losa : 4 columnas + 4 vigas de borde partidas en el centro
  con losa : lo mismo + losa ShellDKGQ (Kirchhoff/DKQ, el equivalente del Shell-Thin)

Se lee la TORSION de las vigas (componente 4 de la fuerza de extremo, eje local 1).

  python validation/torsion-viga-losa/opensees_torsion.py
"""
import openseespy.opensees as ops

E, NU = 2.2e7, 0.2
G = E / (2 * (1 + NU))
COL = dict(A=0.16, J=3.6046e-3, Iy=2.1333e-3, Iz=2.1333e-3)
VIG = dict(A=0.125, J=1.8817e-3, Iy=2.6042e-3, Iz=6.5104e-4)   # Iy = fuerte (plano vertical)
T = 0.15

NUDOS = {1: (0, 0, 0), 2: (6, 0, 0), 3: (0, 5, 0), 4: (6, 5, 0),
         5: (0, 0, 3), 6: (3, 0, 3), 7: (6, 0, 3),
         8: (0, 2.5, 3), 9: (3, 2.5, 3), 10: (6, 2.5, 3),
         11: (0, 5, 3), 12: (3, 5, 3), 13: (6, 5, 3)}
COLS = [(1, 1, 5), (2, 2, 7), (3, 3, 11), (4, 4, 13)]
VIGX = [(5, 5, 6), (6, 6, 7), (7, 11, 12), (8, 12, 13)]
VIGY = [(9, 5, 8), (10, 8, 11), (11, 7, 10), (12, 10, 13)]
PANOS = [(20, 5, 6, 9, 8), (21, 6, 7, 10, 9), (22, 8, 9, 12, 11), (23, 9, 10, 13, 12)]


def correr(con_losa):
    ops.wipe()
    ops.model("basic", "-ndm", 3, "-ndf", 6)
    # sin losa, el nudo central (9) no lo toca ningun elemento: crearlo deja la
    # matriz singular. Hekatan lo saca con getZerosIndices; aqui no se crea.
    for n, (x, y, z) in NUDOS.items():
        if n == 9 and not con_losa:
            continue
        ops.node(n, x, y, z)
    for n in (1, 2, 3, 4):
        ops.fix(n, 1, 1, 1, 1, 1, 1)
    ops.geomTransf("Linear", 1, 1, 0, 0)     # columnas
    ops.geomTransf("Linear", 2, 0, 0, 1)     # vigas horizontales
    for tag, i, j in COLS:
        ops.element("elasticBeamColumn", tag, i, j, COL["A"], E, G, COL["J"], COL["Iy"], COL["Iz"], 1)
    for tag, i, j in VIGX + VIGY:
        ops.element("elasticBeamColumn", tag, i, j, VIG["A"], E, G, VIG["J"], VIG["Iy"], VIG["Iz"], 2)
    if con_losa:
        # ElasticMembranePlateSection: E, nu, espesor, densidad
        ops.section("ElasticMembranePlateSection", 1, E, NU, T, 0.0)
        for tag, a, b, c, d in PANOS:
            ops.element("ShellDKGQ", tag, a, b, c, d, 1)
    ops.timeSeries("Linear", 1)
    ops.pattern("Plain", 1, 1)
    ops.load(6, 0, 0, -100, 0, 0, 0)
    ops.system("BandGeneral"); ops.numberer("RCM"); ops.constraints("Plain")
    ops.integrator("LoadControl", 1.0); ops.algorithm("Linear"); ops.analysis("Static")
    ops.analyze(1)
    tor = {}
    for tag, i, j in VIGX + VIGY:
        # ⚠️ eleForce() devuelve las fuerzas en ejes GLOBALES: su componente 4 es Mx
        # global, no la torsion de la barra. La torsion es la componente 4 de
        # `localForce`, que es lo que hay que pedir.
        f = ops.eleResponse(tag, "localForce")
        tor[tag] = f[3]
    return tor, ops.nodeDisp(6, 3)


for con in (False, True):
    tor, w = correr(con)
    tx = max(abs(tor[t]) for t, *_ in VIGX)
    ty = max(abs(tor[t]) for t, *_ in VIGY)
    print(f"{'CON losa ShellDKGQ' if con else 'SIN losa          '}: "
          f"torsion viga X {tx:8.4f} · viga Y {ty:8.4f} kN·m · flecha nudo 6 {w*1000:8.3f} mm")
