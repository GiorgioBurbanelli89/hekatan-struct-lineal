# -*- coding: utf-8 -*-
"""El dump de un .heks montado en OpenSees (openseespy), MISMA malla y MISMAS cargas nodales.

Barras: ElasticTimoshenkoBeam3d (A, Iy, Iz, J, Avy, Avz) = lo que resuelve Hekatan.
Cascaras: ShellMITC4 con ElasticMembranePlateSection. La chapa es de 0.8 mm: su
rigidez a flexion (D ~ t^3 = 5e-10) es despreciable, asi que equivale a la
membrana pura de Hekatan (bendingModifiers = 0), pero se anota como diferencia.
Masa: consistente en barras (-cMass) y la que OpenSees ponga en la cascara.
Salida: periodos, participacion de masa, desplazamientos, reacciones y fuerzas de barra.
"""
import json, sys, math
import openseespy.opensees as ops

DUMP, OUT, NMODOS = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 12
D = json.load(open(DUMP)); ei = D["elementInputs"]; ni = D["nodeInputs"]
g = lambda m, i, d=None: ei.get(m, {}).get(str(i), d)

ops.wipe(); ops.model("basic", "-ndm", 3, "-ndf", 6)
for i, (x, y, z) in enumerate(D["nodes"]):
    ops.node(i + 1, float(x), float(y), float(z))
for k, v in ni["supports"].items():
    ops.fix(int(k) + 1, *[1 if b else 0 for b in v])

# transformacion geometrica: el eje local 2 de Hekatan (localAngles = 0) es el
# que sale de cruzar el eje global Z con el eje de la barra; si la barra es
# vertical, se usa el X global. Es la convencion de CSI y la de Hekatan.
def vecxz(n1, n2):
    p1, p2 = D["nodes"][n1], D["nodes"][n2]
    dx = [p2[k] - p1[k] for k in range(3)]
    L = math.sqrt(sum(c * c for c in dx))
    ex = [c / L for c in dx]
    ref = [0, 0, 1] if abs(ex[2]) < 0.999 else [1, 0, 0]
    ey = [ref[1] * ex[2] - ref[2] * ex[1], ref[2] * ex[0] - ref[0] * ex[2], ref[0] * ex[1] - ref[1] * ex[0]]
    n = math.sqrt(sum(c * c for c in ey)) or 1.0
    ey = [c / n for c in ey]
    # ey = Z x x es el eje local **3** de CSI (horizontal); el eje 2 lo completa.
    # `geomTransf` quiere un vector del plano local x-z, o sea el eje 3: asi el
    # eje y de OpenSees cae sobre el eje 2 de CSI y los I y las areas de cortante
    # entran sin cruzarse.
    return ey

secs, nbar, nsh = {}, 0, 0
barras, shells = [], []
for idx, el in enumerate(D["elements"]):
    E = g("elasticities", idx); nu = g("poissonsRatios", idx, 0.3); rho = g("densities", idx, 0.0)
    if len(el) == 2:
        n1, n2 = el
        A = g("areas", idx); Iy = g("momentsOfInertiaY", idx); Iz = g("momentsOfInertiaZ", idx)
        J = g("torsionalConstants", idx); # AS2 (cortante en el eje 2) = shearAreasZ de Hekatan; AS3 = shearAreasY.
        Avy = g("shearAreasZ", idx); Avz = g("shearAreasY", idx)
        Gm = g("shearModuli", idx) or E / (2 * (1 + nu))
        ops.geomTransf("Linear", idx + 1, *vecxz(n1, n2))
        # ElasticTimoshenkoBeam3d: Avy es el area de cortante para el cortante en
        # la direccion del eje local y (= AS2 de CSI = shearAreasZ de Hekatan).
        ops.element("ElasticTimoshenkoBeam", idx + 1, n1 + 1, n2 + 1,
                    float(E), float(Gm), float(A), float(J), float(Iy), float(Iz),
                    float(Avz), float(Avy), idx + 1, "-mass", float(rho) * float(A), "-cMass")
        barras.append(idx); nbar += 1
    elif len(el) == 4:
        t = g("thicknesses", idx); fm = g("membraneModifiers", idx, 1.0)
        key = (round(E * fm, 6), round(nu, 6), round(t, 9), round(rho, 6))
        if key not in secs:
            sid = 1000 + len(secs)
            ops.section("ElasticMembranePlateSection", sid, float(E) * float(fm), float(nu), float(t), float(rho))
            secs[key] = sid
        # --asdshell: el ASDShellQ4 de Petracca y Camata (ASDEA), que lleva la
        # membrana de Allman con drilling y transformacion EICR — la familia de
        # la membrana de Hekatan. El ShellMITC4 clasico usa membrana bilineal.
        if "--asdshell" in sys.argv:
            ops.element("ASDShellQ4", idx + 1, *[n + 1 for n in el], secs[key])
        else:
            ops.element("ShellMITC4", idx + 1, *[n + 1 for n in el], secs[key])
        shells.append(idx); nsh += 1

# ── cargas: las MISMAS que Hekatan ya repartio a los nudos (peso propio incluido)
ops.timeSeries("Linear", 1); ops.pattern("Plain", 1, 1)
for k, v in ni["loads"].items():
    ops.load(int(k) + 1, *[float(c) for c in v])
ops.system("BandGeneral"); ops.numberer("RCM"); ops.constraints("Transformation")
ops.integrator("LoadControl", 1.0); ops.algorithm("Linear"); ops.analysis("Static")
ok = ops.analyze(1)

res = {"programa": "OpenSees (openseespy)", "nbarras": nbar, "nshells": nsh, "estatico_ok": ok}
res["desp"] = {int(k) + 1 - 1: ops.nodeDisp(int(k) + 1) for k in range(len(D["nodes"]))}
ops.reactions()
res["reac"] = {i: ops.nodeReaction(i + 1) for i in [int(k) for k in ni["supports"]]}
res["sumRz"] = sum(ops.nodeReaction(int(k) + 1)[2] for k in ni["supports"])
# fuerzas de extremo de cada barra, en ejes locales
res["fuerzas_barra"] = {i: ops.eleResponse(i + 1, "localForce") for i in barras}
res["esfuerzos_shell"] = {i: ops.eleResponse(i + 1, "stresses") for i in shells}

# ── modal: misma masa del modelo (la de las densidades), como el runModal de Hekatan
ops.wipeAnalysis()
try:
    lam = ops.eigen("-genBandArpack", NMODOS)
    res["periodos"] = [2 * math.pi / math.sqrt(l) for l in lam]
except Exception as e:
    res["periodos"] = []; res["eigen_error"] = str(e)[:120]
try:
    if not res["periodos"]: raise RuntimeError("sin modos")
    mp = ops.modalProperties("-return")
    res["masa_total"] = mp.get("totalMass")
    for k in ("partiMassRatiosMX", "partiMassRatiosMY", "partiMassRatiosMZ",
              "partiMassRatiosCumuMX", "partiMassRatiosCumuMY", "partiMassRatiosCumuMZ"):
        res[k] = mp.get(k)
except Exception as e:
    res["modalProperties_error"] = str(e)
json.dump(res, open(OUT, "w"), indent=1)
print("OpenSees OK -> %d barras, %d shells%s" % (nbar, nsh,
      ", T1 = %.6f s" % res["periodos"][0] if res["periodos"] else " (sin modal)"))
