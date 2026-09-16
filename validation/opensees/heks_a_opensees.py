# -*- coding: utf-8 -*-
"""El dump de un .heks montado en OpenSees (openseespy), MISMA malla y MISMAS cargas nodales.

Barras: ElasticTimoshenkoBeam3d (A, Iy, Iz, J, Avy, Avz) = lo que resuelve Hekatan.
Cascaras: ShellMITC4 con ElasticMembranePlateSection. La chapa es de 0.8 mm: su
rigidez a flexion (D ~ t^3 = 5e-10) es despreciable, asi que equivale a la
membrana pura de Hekatan (bendingModifiers = 0), pero se anota como diferencia.
Masa: CONCENTRADA en los nudos (el defecto de OpenSees), que es lo que usan
Hekatan y SAP2000. Con `-cMass` (consistente) los periodos bajan un 4 % y parece
que discrepan los solvers cuando lo que discrepa es la matriz de masa: --cmass
lo activa para verlo.
Salida: periodos, participacion de masa, desplazamientos, reacciones y fuerzas de barra.
"""
import json, sys, math
import openseespy.opensees as ops

# -- ENTRADA ------------------------------------------------------------
# Por linea de ordenes:  python heks_a_opensees.py dump.json salida.json 12 [--anim=1 --abrir]
# Desde Hekatan Py (o cualquier editor que ejecute el fichero SIN argumentos)
# no hay sys.argv que leer y saltaba IndexError. Ahora usa estos valores:
# cambia las tres lineas y dale a correr. OPCIONES admite las mismas banderas.
DUMP     = r"C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct/validation/opensees/dump.json"
OUT      = r"C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/hekatan-struct/validation/opensees/opensees.json"
NMODOS   = 12
OPCIONES = ["--anim=1", "--frames=24", "--abrir"]

if len(sys.argv) > 2:                    # llamado desde la terminal
    DUMP, OUT = sys.argv[1], sys.argv[2]
    if len(sys.argv) > 3 and sys.argv[3].isdigit(): NMODOS = int(sys.argv[3])
else:                                    # ejecutado sin argumentos
    sys.argv = (sys.argv[:1] or ["heks_a_opensees.py"]) + OPCIONES
    print("sin argumentos: " + DUMP)
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
                    float(Avz), float(Avy), idx + 1, "-mass", float(rho) * float(A), *(["-cMass"] if "--cmass" in sys.argv else []))
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
# ── DIBUJO Y ANIMACION DEL MODO ─────────────────────────────────────────
#   --anim=N        anima el modo N (por defecto el 1)
#   --frames=K      fotogramas de un ciclo completo (por defecto 24)
#   --escala=F      amplitud del modo, en % de la diagonal del modelo (por defecto 8)
# Deja los PNG (uno por fotograma) y un .mp4 junto al JSON de salida.
if any(a.startswith("--anim") for a in sys.argv) and res["periodos"]:
    import os
    import matplotlib; matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection, Line3DCollection
    def opt(nm, d):
        for a in sys.argv:
            if a.startswith("--%s=" % nm): return float(a.split("=")[1])
        return d
    modo = int(opt("anim", 1)); K = int(opt("frames", 24)); pc = opt("escala", 8.0)
    dirsal = os.path.splitext(OUT)[0] + "_modo%d" % modo
    os.makedirs(dirsal, exist_ok=True)
    P = [[float(c) for c in p] for p in D["nodes"]]
    phi = [ops.nodeEigenvector(i + 1, modo)[:3] for i in range(len(P))]
    xs = [p[0] for p in P]; ys = [p[1] for p in P]; zs = [p[2] for p in P]
    diag = math.dist([min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)])
    amp = max(max(abs(c) for c in v) for v in phi) or 1.0
    f = (pc / 100.0) * diag / amp
    T = res["periodos"][modo - 1]
    for k in range(K):
        a = math.sin(2 * math.pi * k / K)
        Q = [[P[i][j] + a * f * phi[i][j] for j in range(3)] for i in range(len(P))]
        fig = plt.figure(figsize=(12.8, 7.2), dpi=100)
        ax = fig.add_axes([-0.12, -0.16, 1.24, 1.30], projection="3d")   # sin margenes: el modelo llena el cuadro
        ax.set_facecolor("#10131a"); fig.patch.set_facecolor("#10131a")
        # chapas primero (van detras)
        caras = [[Q[n] for n in el] for el in D["elements"] if len(el) == 4]
        if caras:
            ax.add_collection3d(Poly3DCollection(caras, facecolor="#2b7fd4", alpha=0.35,
                                                 edgecolor="#4da3ff", linewidths=0.3))
        # barras: en gris la posicion original, en color la deformada
        ax.add_collection3d(Line3DCollection([[P[el[0]], P[el[1]]] for el in D["elements"] if len(el) == 2],
                                             colors="#39404d", linewidths=0.5))
        ax.add_collection3d(Line3DCollection([[Q[el[0]], Q[el[1]]] for el in D["elements"] if len(el) == 2],
                                             colors="#ffb547", linewidths=1.2))
        ax.set_xlim(min(xs) - 1, max(xs) + 1); ax.set_ylim(min(ys) - 1, max(ys) + 1)
        ax.set_zlim(min(zs) - 1, max(zs) + 3)
        ax.set_box_aspect((max(xs) - min(xs) + 2, max(ys) - min(ys) + 2, max(zs) - min(zs) + 4), zoom=1.15)
        ax.view_init(elev=16, azim=-65 + 30.0 * k / K)
        ax.set_axis_off()
        fig.text(0.04, 0.93, "OpenSees  ·  modo %d  ·  T = %.4f s" % (modo, T),
                 color="#e8edf5", fontsize=15)
        fig.text(0.04, 0.895, "%d nudos · %d barras · %d chapas   ·   amplitud ×%.0f" % (len(P), nbar, nsh, f),
                 color="#8b95a7", fontsize=10)
        fig.savefig(os.path.join(dirsal, "f%03d.png" % k), facecolor=fig.get_facecolor())
        plt.close(fig)
    try:
        import imageio.v2 as iio
        ims = [iio.imread(os.path.join(dirsal, "f%03d.png" % k)) for k in range(K)]
        iio.mimsave(dirsal + ".mp4", ims, fps=12, macro_block_size=1)
        # el GIF se ve en cualquier visor y se abre solo con --abrir
        iio.mimsave(dirsal + ".gif", ims, fps=12, loop=0)
        print("gif:", dirsal + ".gif")
        if "--abrir" in sys.argv:
            try: os.startfile(dirsal + ".gif")
            except Exception: os.system('start "" "%s"' % (dirsal + ".gif"))
    except Exception as ex:
        print("mp4/gif:", str(ex)[:80])
    print("modo %d (T = %.4f s): %d fotogramas en %s" % (modo, T, K, dirsal))

json.dump(res, open(OUT, "w"), indent=1)
print("OpenSees OK -> %d barras, %d shells%s" % (nbar, nsh,
      ", T1 = %.6f s" % res["periodos"][0] if res["periodos"] else " (sin modal)"))
