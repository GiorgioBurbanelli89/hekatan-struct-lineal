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
# Tres formas de correrlo, sin tocar nada:
#   1) terminal:  python heks_a_opensees.py dump.json salida.json 12 --anim=1 --abrir
#   2) editor (Hekatan Py, IDLE, VS Code...): lo ejecutan SIN argumentos, asi que
#      busca el dump el solito: primero el que pongas en DUMP, luego el .json que
#      haya junto al script, luego el de la carpeta de trabajo. Si no encuentra
#      ninguno, lo dice y para.
#   3) importandolo: deja DUMP escrito y llama al fichero.
# Un "dump" es lo que saca `node tests/lib/dump_heks.mjs modelo.heks dump.json`.
import os, glob

# Todo el trabajo va DENTRO de una funcion a proposito: Hekatan Py vuelca al
# panel de salida cada variable de nivel superior (InstrumentForRender), y lo
# que se quiere ver es el dibujo, no DUMP = C:\... ni res = {…}. Las que
# empiezan por guion bajo tampoco se vuelcan.
def _aviso(*a):
    """Los mensajes de marcha. Con --embebido van por stderr, para que el panel
    de Hekatan Py se quede SOLO con el dibujo."""
    import sys as _s
    print(*a, file=(_s.stderr if "--embebido" in _s.argv else _s.stdout))


def _main():

    DUMP     = ""                 # <- ponle la ruta aqui si quieres una fija
    OUT      = ""                 # <- vacio = al lado del dump, con _opensees.json
    NMODOS   = 12
    OPCIONES = ["--anim=1,2,3", "--frames=36", "--embebido"]

    def _es_dump(f):
        try:
            with open(f, "r", encoding="utf-8", errors="ignore") as h: cab = h.read(4000)
            return '"nodes"' in cab and '"elements"' in cab
        except Exception:
            return False

    # El ANCLA: la ultima ruta que se uso desde la terminal queda apuntada aqui, y
    # asi el mismo fichero corre luego dentro de Hekatan Py, que lo copia a %TEMP%
    # y lo ejecuta sin argumentos y con otra carpeta de trabajo.
    _ANCLA = os.path.join(os.environ.get("APPDATA") or os.path.expanduser("~"),
                          "hekatan_opensees_dump.txt")

    def _recordar(f):
        try:
            with open(_ANCLA, "w", encoding="utf-8") as h: h.write(f)
        except Exception: pass

    def _buscar():
        aqui = os.path.dirname(os.path.abspath(sys.argv[0])) if sys.argv and sys.argv[0] else ""
        try: aqui2 = os.path.dirname(os.path.abspath(__file__))
        except NameError: aqui2 = ""
        for carpeta in (aqui2, aqui, os.getcwd()):
            if not carpeta: continue
            for nombre in ("dump.json", "*.json"):
                for f in sorted(glob.glob(os.path.join(carpeta, nombre))):
                    if _es_dump(f): return f
        try:                                  # lo ultimo: el ancla
            with open(_ANCLA, encoding="utf-8") as h: f = h.read().strip()
            if f and os.path.exists(f) and _es_dump(f): return f
        except Exception: pass
        return ""

    if len(sys.argv) > 2:                    # terminal: dump y salida como argumentos
        DUMP, OUT = sys.argv[1], sys.argv[2]
        if len(sys.argv) > 3 and sys.argv[3].isdigit(): NMODOS = int(sys.argv[3])
        _recordar(os.path.abspath(DUMP))
    else:                                    # editor: sin argumentos
        sys.argv = (sys.argv[:1] or ["heks_a_opensees.py"]) + OPCIONES
        if not DUMP: DUMP = _buscar()
        if not DUMP:
            _aviso("No encuentro ningun dump .json (el que saca dump_heks.mjs).")
            _aviso("Pon la ruta en la linea  DUMP = '...'  de arriba, o deja el")
            _aviso("dump.json en la carpeta del script o en la de trabajo.")
            raise SystemExit(1)
        _aviso("dump: " + DUMP)
    if not OUT:
        OUT = os.path.splitext(DUMP)[0] + "_opensees.json"

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
            # si el .heks no trae `as`, Hekatan (y ETABS) suponen 5/6 A
            Avy = g("shearAreasZ", idx) or 5.0 / 6.0 * A
            Avz = g("shearAreasY", idx) or 5.0 / 6.0 * A
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
            # --elem=<nombre> elige el elemento de cascara. OpenSees no tiene solo
            # el MITC4: ShellDKGQ es la placa DELGADA (Kirchhoff discreto, la
            # familia de la DKQ), ShellMITC4 la GRUESA (Dvorkin-Bathe) y
            # ASDShellQ4 el de Petracca y Camata. --asdshell es un atajo del ultimo.
            elem = "ASDShellQ4" if "--asdshell" in sys.argv else "ShellMITC4"
            for _a in sys.argv:
                if _a.startswith("--elem="): elem = _a.split("=", 1)[1]
            ops.element(elem, idx + 1, *[n + 1 for n in el], secs[key])
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
    # ── DIBUJO Y ANIMACION DE LOS MODOS ─────────────────────────────────────
    #   --anim=1,2,3    los modos que se animan (uno, o varios separados por coma)
    #   --frames=K      fotogramas de un ciclo (24)
    #   --escala=F      amplitud, en % de la diagonal del modelo (8)
    #   --abrir         abre el GIF en el visor de Windows
    #   --embebido      escupe el GIF como data-URI, para que se vea DENTRO del
    #                   Output de Hekatan Py (WebView2). Va solo cuando no hay
    #                   argumentos de terminal, que es como lo ejecuta el editor.
    if any(a.startswith("--anim") for a in sys.argv) and res["periodos"]:
        import base64
        import matplotlib; matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from mpl_toolkits.mplot3d.art3d import Poly3DCollection, Line3DCollection
        def opt(nm, d):
            for a in sys.argv:
                if a.startswith("--%s=" % nm): return a.split("=", 1)[1]
            return d
        modos = [int(v) for v in str(opt("anim", "1")).split(",") if v.strip().isdigit()]
        K = int(float(opt("frames", 60))); pc = float(opt("escala", 8.0))
        # La camara da la vuelta ENTERA pero despacio, y la estructura oscila
        # varias veces por vuelta: si giro y oscilacion van al mismo ritmo, el
        # giro se come la vibracion y solo se ve el modelo dando vueltas.
        ciclos = float(opt("ciclos", 4))    # oscilaciones por modo
        dpi = int(float(opt("dpi", 80)))    # 80 = 1024x576; 100 = 1280x720 (mas lento)
        # El giro, LENTO: media vuelta repartida entre TODOS los modos, y
        # continua (la camara sigue donde la dejo el modo anterior). Con 360 por
        # modo daba seis vueltas en el GIF y no se veia vibrar nada.
        # --giro=<grados por modo> lo cambia (360 = una vuelta por modo).
        giro = float(opt("giro", 180.0 / max(1, len(modos))))
        P = [[float(c) for c in q] for q in D["nodes"]]
        xs = [q[0] for q in P]; ys = [q[1] for q in P]; zs = [q[2] for q in P]
        diag = math.dist([min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)])
        lineas = [el for el in D["elements"] if len(el) == 2]
        caras0 = [el for el in D["elements"] if len(el) == 4]
        res["animaciones"] = []; todos = []
        for imodo, modo in enumerate(modos):
            if modo > len(res["periodos"]): continue
            dirsal = os.path.splitext(OUT)[0] + "_modo%d" % modo
            os.makedirs(dirsal, exist_ok=True)
            phi = [ops.nodeEigenvector(i + 1, modo)[:3] for i in range(len(P))]
            amp = max(max(abs(c) for c in v) for v in phi) or 1.0
            f = (pc / 100.0) * diag / amp
            T = res["periodos"][modo - 1]
            # La figura se crea UNA vez por modo y en cada fotograma solo se
            # cambian los datos de las colecciones (set_segments / set_verts).
            # Recrearla entera costaba 0.28 s por fotograma — con 180 son 50 s
            # y el script parecia colgado dentro de Hekatan Py.
            fig = plt.figure(figsize=(12.8, 7.2), dpi=dpi)
            ax = fig.add_axes([-0.12, -0.16, 1.24, 1.30], projection="3d")
            ax.set_facecolor("#10131a"); fig.patch.set_facecolor("#10131a")
            colChapa = (Poly3DCollection([[P[n] for n in el] for el in caras0],
                                         facecolor="#2b7fd4", alpha=0.35,
                                         edgecolor="#4da3ff", linewidths=0.3) if caras0 else None)
            if colChapa is not None:
                # sin ordenar las caras por profundidad: con alpha, matplotlib
                # las reordena en CADA fotograma y ahi se va la mitad del tiempo
                try: colChapa.set_zsort(False)
                except Exception: pass
                ax.add_collection3d(colChapa)
            ax.add_collection3d(Line3DCollection([[P[el[0]], P[el[1]]] for el in lineas],
                                                 colors="#39404d", linewidths=0.5))
            colBarra = Line3DCollection([[P[el[0]], P[el[1]]] for el in lineas],
                                        colors="#ffb547", linewidths=1.2)
            ax.add_collection3d(colBarra)
            ax.set_xlim(min(xs) - 1, max(xs) + 1); ax.set_ylim(min(ys) - 1, max(ys) + 1)
            ax.set_zlim(min(zs) - 1, max(zs) + 3)
            # zoom adaptativo: el cuadro es apaisado, asi que un modelo ALTO y
            # estrecho (una torre) se sale por arriba con el zoom de una nave.
            dx, dy, dz = (max(xs)-min(xs)+2, max(ys)-min(ys)+2, max(zs)-min(zs)+4)
            zoom = 1.15 * min(1.0, 3.2 * max(dx, dy) / max(dz, 1e-9))
            ax.set_box_aspect((dx, dy, dz), zoom=zoom)
            ax.set_axis_off()
            fig.text(0.04, 0.93, "OpenSees  ·  modo %d  ·  T = %.4f s" % (modo, T),
                     color="#e8edf5", fontsize=15)
            fig.text(0.04, 0.895, "%d nudos · %d barras · %d chapas   ·   amplitud ×%.0f"
                     % (len(P), nbar, nsh, f), color="#8b95a7", fontsize=10)
            for k in range(K):
                a = math.sin(2 * math.pi * ciclos * k / K)
                Q = [[P[i][j] + a * f * phi[i][j] for j in range(3)] for i in range(len(P))]
                if colChapa is not None: colChapa.set_verts([[Q[n] for n in el] for el in caras0])
                colBarra.set_segments([[Q[el[0]], Q[el[1]]] for el in lineas])
                ax.view_init(elev=16, azim=-65 + giro * (imodo + k / K))
                fig.savefig(os.path.join(dirsal, "f%03d.png" % k),
                            facecolor=fig.get_facecolor(), pil_kwargs={"compress_level": 1})
            plt.close(fig)
            gif = dirsal + ".gif"
            try:
                import imageio.v2 as iio
                ims = [iio.imread(os.path.join(dirsal, "f%03d.png" % k)) for k in range(K)]
                iio.mimsave(dirsal + ".mp4", ims, fps=12, macro_block_size=1)
                iio.mimsave(gif, ims, fps=12, loop=0)
                todos.extend(ims)                     # para el GIF de los tres modos seguidos
            except Exception as ex:
                print("mp4/gif:", str(ex)[:80]); gif = ""
            res["animaciones"].append({"modo": modo, "T": T, "gif": gif, "frames": dirsal})
            _aviso("modo %d: T = %.4f s, %d fotogramas -> %s" % (modo, T, K, dirsal))

        # ── UN SOLO GIF con los modos en fila: 1, luego 2, luego 3 ──────────────
        gifs = [a_["gif"] for a_ in res["animaciones"] if a_["gif"]]
        unico = ""
        if todos:
            unico = os.path.splitext(OUT)[0] + "_modos%s.gif" % "".join(str(m) for m in modos)
            try:
                import imageio.v2 as iio
                iio.mimsave(unico, todos, fps=12, loop=0)
                iio.mimsave(unico[:-4] + ".mp4", todos, fps=12, macro_block_size=1)
                res["gif_modos"] = unico
                _aviso("los %d modos seguidos -> %s" % (len(modos), unico))
            except Exception as ex:
                print("gif unico:", str(ex)[:80]); unico = ""
        elif gifs:
            unico = gifs[0]
        if unico and "--abrir" in sys.argv:
            try: os.startfile(unico)
            except Exception: os.system('start "" "%s"' % unico)
        # DENTRO del Output de Hekatan Py: sus marcadores de stdout
        # (PythonPipeline.RenderStdoutLine): __CPSPY_HTML__ texto en crudo y
        # __CPSPY_GIF__ una animacion en base64. Un print normal se escapa.
        if unico and "--embebido" in sys.argv:
            # el GIF de tres modos a 1280 px pesa ~3.7 MB, y en base64 son 5 MB de
            # texto para el WebView2: si pasa de 2 MB se embebe uno a media
            # resolucion (el de disco se queda entero).
            parachat = unico
            try:
                if os.path.getsize(unico) > 2 * 1024 * 1024 and todos:
                    import imageio.v2 as iio
                    chicos = [im[::2, ::2] for im in todos]
                    parachat = unico[:-4] + "_web.gif"
                    iio.mimsave(parachat, chicos, fps=12, loop=0)
            except Exception: parachat = unico
            with open(parachat, "rb") as h: b64 = base64.b64encode(h.read()).decode("ascii")
            etiq = " &nbsp;·&nbsp; ".join("modo %d: T = %.4f s" % (a_["modo"], a_["T"])
                                          for a_ in res["animaciones"])
            print("__CPSPY_HTML__:<p style=\"color:#c9d4e3;margin:8px 0 2px\">" + etiq + "</p>")
            print("__CPSPY_GIF__:" + b64)

    json.dump(res, open(OUT, "w"), indent=1)
    _aviso("OpenSees OK -> %d barras, %d shells%s" % (nbar, nsh,
           ", T1 = %.6f s" % res["periodos"][0] if res["periodos"] else " (sin modal)"))



_main()