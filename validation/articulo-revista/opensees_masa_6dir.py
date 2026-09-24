# -*- coding: utf-8 -*-
"""Las SEIS sumatorias de masa participativa del dual 2x2x4 del articulo, en OpenSees.

Mismo modelo y mismo traductor que `_cap_opensees.py` (545 nudos, malla 1.0 m,
ShellMITC4 + ElasticTimoshenkoBeam). Aqui se anade `ops.modalProperties`, que da
las razones de masa participativa en las seis direcciones (MPM ratios).

    python opensees_masa_6dir.py            # -> opensees_masa_6dir.json
"""
import json, math, os, sys
import openseespy.opensees as ops
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(AQUI, "dual_2x2x4_sismo.json"), encoding="utf-8"))
G = 9.80665
E = D["E"] * G; nu, rho = D["nu"], D["rho"]; Gm = E / (2 * (1 + nu))
bc, bb, hb = D["bCol"], D["bBeam"], D["hBeam"]
masa_vol = rho

def vecxz(n1, n2):
    p1, p2 = D["nodes"][n1], D["nodes"][n2]
    dx = [p2[k] - p1[k] for k in range(3)]
    L = math.sqrt(sum(c * c for c in dx)); ex = [c / L for c in dx]
    ref = [0, 0, 1] if abs(ex[2]) < 0.999 else [1, 0, 0]
    ey = [ref[1]*ex[2] - ref[2]*ex[1], ref[2]*ex[0] - ref[0]*ex[2], ref[0]*ex[1] - ref[1]*ex[0]]
    n = math.sqrt(sum(c*c for c in ey)) or 1.0
    return [c / n for c in ey]

DIR = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"]
out = {"nudos": len(D["nodes"]), "casos": {}}
for NM in (12, 20, 24):
    ops.wipe(); ops.model("basic", "-ndm", 3, "-ndf", 6)
    for i, (x, y, z) in enumerate(D["nodes"]): ops.node(i + 1, float(x), float(y), float(z))
    for i in D["supports"]: ops.fix(int(i) + 1, 1, 1, 1, 1, 1, 1)
    Ac = bc * bc; Ic = bc ** 4 / 12; Jc = 0.141 * bc ** 4
    Av = bb * hb; I33 = bb * hb ** 3 / 12; I22 = hb * bb ** 3 / 12; Jv = I33 + I22
    sec = {}
    for k, (el, kind) in enumerate(zip(D["elements"], D["kinds"])):
        t = k + 1
        if kind in ("col", "beam"):
            A, J, Iy, Iz = (Ac, Jc, Ic, Ic) if kind == "col" else (Av, Jv, I22, I33)
            ops.geomTransf("Linear", t, *vecxz(el[0], el[1]))
            ops.element("ElasticTimoshenkoBeam", t, el[0] + 1, el[1] + 1, E, Gm, A, J, Iy, Iz,
                        5/6*A, 5/6*A, t, "-mass", masa_vol * A)
        else:
            th = D["tSlab"] if kind == "slab" else D["tWall"]
            if th not in sec:
                sec[th] = len(sec) + 1
                ops.section("ElasticMembranePlateSection", sec[th], E, nu, th, masa_vol)
            ops.element("ShellMITC4", t, *[j + 1 for j in el], sec[th])

    lam = ops.eigen("-genBandArpack", NM)
    T = [2 * math.pi / math.sqrt(l) for l in lam]
    ops.modalProperties("-unorm")                 # calcula las propiedades modales
    # `getModalProperties` no existe en todas las builds: se lee del fichero de informe
    rep = os.path.join(AQUI, "_opensees_modal_%d.txt" % NM)
    ops.modalProperties("-print", "-file", rep, "-unorm")
    mp, sum6 = [], {}
    txt = open(rep, encoding="utf-8", errors="replace").read().splitlines()
    ini = None
    for i, l in enumerate(txt):
        if "MODAL PARTICIPATION MASS RATIOS" in l.upper(): ini = i
        if ini is not None and "CUMULATIVE" in l.upper() and i > ini:
            ini = i; break
    # bloque de razones acumuladas: filas "modo  MX MY MZ RMX RMY RMZ"
    fil = []
    if ini is not None:
        for l in txt[ini:]:
            p = l.split()
            if len(p) == 7:
                try: fil.append([float(x) for x in p])
                except ValueError: pass
    if fil:
        sum6 = {k: fil[-1][j + 1] for j, k in enumerate(DIR)}
    out["casos"][str(NM)] = {"T": T, "sum": sum6, "informe": rep}
    print("%2d modos  T1-3 %s" % (NM, "  ".join("%.4f" % t for t in T[:3])))
    if sum6: print("          " + "  ".join("S%s %.4f" % (k, sum6[k]) for k in DIR))
    else: print("          OJO: no se pudo leer el bloque acumulado de %s" % rep)

json.dump(out, open(os.path.join(AQUI, "opensees_masa_6dir.json"), "w", encoding="utf-8"), indent=1)
print("ok -> opensees_masa_6dir.json")
