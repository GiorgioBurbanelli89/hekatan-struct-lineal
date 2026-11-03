"""Punto de inserción (con/sin restricción rígida), brazos automáticos de ETABS y cubierta de membrana."""
import os
from hekatan_struct import (ElementInputs, NodeInputs, deform, asignar_punto_insercion,
                            aplicar_brazos_automaticos, membrana_deck_etabs, cubierta_de_e2k)

# A) voladizo 4 m, 0.3 x 0.5, CP 8 (arriba-centro): ux del extremo con / sin restricción rígida
E, nu, b, d = 2.5e10, 0.2, 0.3, 0.5
for transform in (True, False):
    ei = ElementInputs()
    ei.elasticities[0], ei.poissons_ratios[0], ei.shear_moduli[0] = E, nu, E / (2 * (1 + nu))
    ei.areas[0], ei.moments_of_inertia_z[0], ei.moments_of_inertia_y[0] = b * d, b * d**3 / 12, d * b**3 / 12
    ei.torsional_constants[0] = 0.229 * d * b**3
    asignar_punto_insercion(ei, 0, 8, D=d, B=b, transform=transform)
    ni = NodeInputs(); ni.supports[0] = (True,) * 6; ni.loads[1] = (1e5, 0, -1e5, 0, 0, 0)
    r = deform([(0, 0, 0), (4, 0, 0)], [[0, 1]], ni, ei)
    print("con" if transform else "sin", "restricción rígida: ux =", r.deformations[1][0])      # 2.987e-3 (SAP2000) / 1.067e-4

# B) pórtico de un vano: brazos automáticos de ETABS (RZ = 0)
nodes, el = [(0, 0, 0), (6, 0, 0), (0, 0, 3), (6, 0, 3)], [[0, 2], [1, 3], [2, 3]]
ei = ElementInputs()
for k, (A, I33, I22) in enumerate([(0.16, 0.4**4 / 12, 0.4**4 / 12)] * 2 + [(0.15, 0.3 * 0.5**3 / 12, 0.5 * 0.3**3 / 12)]):
    ei.areas[k], ei.moments_of_inertia_z[k], ei.moments_of_inertia_y[k] = A, I33, I22
aplicar_brazos_automaticos(nodes, el, ei, rz=0.0, cantos={2: 0.5}, anchos={2: 0.3})
print("end_offsets:", ei.end_offsets)

# C) la cubierta real del mercado (si el e2k está)
E2K = r"C:\ETABS\mercado\mercado.e2k"
if os.path.exists(E2K):
    dd = cubierta_de_e2k(E2K, "N7 COL", seccion="Cubierta metalica"); dd.pop("cargas_live"); dd.pop("meta")
    c = membrana_deck_etabs(**dd)
    print(len(c.panos), "paños,", len(c.barras), "barras, ΣFz =", sum(v[2] for v in c.cargas.values()), "kN")
