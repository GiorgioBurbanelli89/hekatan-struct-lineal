"""Radier MOD_002 (SAFE 22.6) -> .heks de Hekatan con la MALLA DE ANALISIS de SAFE nodo a nodo.

Lee el f2k que escribio SAFE (con resultados) y arma:
  - nudos  = OBJECTS AND ELEMENTS - JOINTS (objeto + internos '~N' -> 2000+N)
  - cascaras = OBJECTS AND ELEMENTS - AREAS (254 Q4), seccion/muelle por su OBJETO
  - barras = OBJECTS AND ELEMENTS - FRAMES tipo Frame (64), VC 60X60, J x0.1 (`torsion safe`)
  - los '@LC-*' (Line Constraint de SAFE = AUTO EDGE CONSTRAINTS) -> `edge lineal`
  - cargas puntuales por patron (Dead / DNE / Live), TAL CUAL (duplicadas incluidas)
  - un punto cargado que cae DENTRO de un elemento (SAFE no lo mete en la malla: Uz=0 en su
    tabla) se reparte a las 4 esquinas con las funciones de forma bilineales N_i. Medido en el
    propio f2k: la carga de 605 (centro del pedestal 107-108-109-110) llega 1/4 a cada esquina.
  - muelle de area Ks=0.4 (400000 kgf/m3) -> `areaspring ID ks nodal`. Va en las cascaras de losa Y en
    las de PEDESTAL: el pedestal (Stiff) no lleva muelle asignado pero esta ENCIMA de un pano de losa
    que si lo lleva, y SAFE mete el muelle en toda la huella del pano. Medido con el propio f2k:
    k_nudo = R/(-Uz) de SAFE = ks * int N_i dA sobre las 254 cascaras, 366/366 nudos a 7e-15.
  - sin peso propio (Self Weight Multiplier = 0 en los tres patrones)

Unidades del .heks: kN, m (kgf * 0.00980665).

  python gen_heks_desde_f2k.py MOD_002.f2k            -> radier_mod002.heks
  python gen_heks_desde_f2k.py MOD_002.f2k corregido  -> radier_mod002_corregido.heks
      (una carga por columna -las 15 de los cruces de ejes- y peso propio, rho = 2549.3 kgf/m3)
"""
import sys, os, math, pickle, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from parse_f2k import parse

KGF = 0.00980665          # kgf -> kN


def nid(name):
    return 2000 + int(name[1:]) if name.startswith("~") else int(name)


def cargar(ruta):
    pk = ruta + ".pkl"
    if os.path.exists(pk) and os.path.getmtime(pk) > os.path.getmtime(ruta):
        return pickle.load(open(pk, "rb"))
    t = parse(ruta); pickle.dump(t, open(pk, "wb")); return t


def modelo(t):
    J = {r["Element Name"]: (float(r["Global X"]), float(r["Global Y"]), float(r["Global Z"]))
         for r in t["OBJECTS AND ELEMENTS - JOINTS"]}
    secc = {r["UniqueName"]: r["Section Property"] for r in t["AREA ASSIGNMENTS - SECTION PROPERTIES"]}
    muelle = {r["UniqueName"]: r["Spring Property"] for r in t["AREA ASSIGNMENTS - AREA SPRINGS"]}
    slab = {r["Name"]: r for r in t["SLAB PROPERTY DEFINITIONS"]}
    aspr = {r["Name"]: float(r["Stiffnes U3"]) for r in t["SPRING PROPERTY DEFINITIONS - AREA SPRINGS"]}
    mat = {r["Material"]: r for r in t["MATERIAL PROPERTIES - BASIC MECHANICAL PROPERTIES"]}
    areas = [r for r in t["OBJECTS AND ELEMENTS - AREAS"]]
    frames = [r for r in t["OBJECTS AND ELEMENTS - FRAMES"] if r["Object Type"] == "Frame"]
    lc = [r for r in t["OBJECTS AND ELEMENTS - FRAMES"] if r["Object Type"] != "Frame"]
    fsec = {r["UniqueName"]: r["Analysis Section"] for r in t["FRAME ASSIGNMENTS - SUMMARY"]}
    fdef = {r["Name"]: r for r in t["FRAME SECTION PROPERTY DEFINITIONS - SUMMARY"]}
    floads = collections.defaultdict(float)
    for r in t["FRAME LOADS ASSIGNMENTS - DISTRIBUTED"]:
        if r.get("Direction") == "Gravity":
            assert r["Force A"] == r["Force B"]
            floads[(r["UniqueName"], r["Load Pattern"])] += float(r["Force A"])
    jl = t["JOINT LOADS ASSIGNMENTS - FORCE"]
    rest = {r["UniqueName"]: r for r in t["JOINT ASSIGNMENTS - RESTRAINTS"]}
    return dict(J=J, secc=secc, muelle=muelle, slab=slab, aspr=aspr, mat=mat, areas=areas, frames=frames,
                lc=lc, fsec=fsec, fdef=fdef, floads=floads, jl=jl, rest=rest)


def en_quad(P, x, y):
    """(xi, eta) de (x,y) en el Q4 P (4 puntos en orden), Newton; None si cae fuera."""
    xi = eta = 0.0
    for _ in range(30):
        N = [0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta), 0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta)]
        dxi = [-0.25 * (1 - eta), 0.25 * (1 - eta), 0.25 * (1 + eta), -0.25 * (1 + eta)]
        deta = [-0.25 * (1 - xi), -0.25 * (1 + xi), 0.25 * (1 + xi), 0.25 * (1 - xi)]
        fx = sum(N[i] * P[i][0] for i in range(4)) - x; fy = sum(N[i] * P[i][1] for i in range(4)) - y
        a = sum(dxi[i] * P[i][0] for i in range(4)); b = sum(deta[i] * P[i][0] for i in range(4))
        c = sum(dxi[i] * P[i][1] for i in range(4)); d = sum(deta[i] * P[i][1] for i in range(4))
        det = a * d - b * c
        dx = (d * fx - b * fy) / det; dy = (-c * fx + a * fy) / det
        xi -= dx; eta -= dy
        if abs(dx) + abs(dy) < 1e-14: break
    if abs(xi) < 1 - 1e-9 and abs(eta) < 1 - 1e-9:
        return xi, eta
    return None


def armar(t, corregido=False, caso=None):
    """caso=None: patrones Dead/DNE/Live por separado. caso="Dead" | "SERVICIO": UNA linea `Dead` por
    nudo con la suma (Dead = solo Dead; SERVICIO = D + DNE + L, sus factores son 1). Para exportar a
    SAP2000: el s2k de Hekatan solo escribe el patron DEAD."""
    M = modelo(t)
    J = M["J"]
    usados = set()
    for r in M["areas"]:
        usados.update(r[k] for k in ("Elm Jt1", "Elm Jt2", "Elm Jt3", "Elm Jt4"))
    for r in M["frames"]:
        usados.update([r["Elm JtI"], r["Elm JtJ"]])
    for r in M["lc"]:
        usados.update([r["Elm JtI"], r["Elm JtJ"]])
    sueltos = sorted(j for j in J if j not in usados)          # dentro de un elemento, fuera de la malla

    L = []
    fc = M["mat"]["f'c=210 kg/cm2"]
    E = float(fc["E1"]) * KGF; nu = float(fc["U12"]); gam = float(fc["UnitWeight"])   # kgf/m3
    rho = gam / 1000.0                                                                   # t/m3 (x g = kN/m3)
    L += ["# Radier MOD_002 (SAFE 22.6, kgf-m) -> Hekatan, MALLA DE ANALISIS de SAFE nodo a nodo",
          "# generado por gen_heks_desde_f2k.py%s — unidades kN, m" % (" (CORREGIDO)" if corregido else ""),
          "# E = %.6f kN/m2 (1.789704e9 kgf/m2)  nu = %.2f  (hormigon f'c=210)" % (E, nu),
          "# nudos: objeto = su nombre SAFE; interno '~N' = 2000+N"]
    for j, (x, y, z) in J.items():
        if j in usados:
            L.append("node %d %.10g %.10g %.10g" % (nid(j), x, y, z))
    # --- cascaras
    L.append("# shell ID n1 n2 n3 n4 t E q rho   (# elemento SAFE / objeto / seccion)")
    sh_id = {}
    for k, r in enumerate(M["areas"], 1):
        obj = r["Object Name"]; sec = M["secc"][obj]; sp = M["slab"][sec]
        tt = float(sp["Slab Thickness"])
        wmod = float(sp["Weight Modifier"])
        pts = [nid(r[c]) for c in ("Elm Jt1", "Elm Jt2", "Elm Jt3", "Elm Jt4")]
        if corregido:
            L.append("shell %d %d %d %d %d %.4g %.6f 0 %.6g   # %s obj %s %s" % (k, *pts, tt, E, rho * wmod, r["Element Name"], obj, sec))
        else:
            L.append("shell %d %d %d %d %d %.4g %.6f   # %s obj %s %s" % (k, *pts, tt, E, r["Element Name"], obj, sec))
        L.append("shelltype %d thick" % k)
        mods = [float(sp[m + " Modifier"]) for m in ("f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23")]
        if any(abs(v - 1) > 1e-12 for v in mods):
            L.append("shellmod %d %s" % (k, " ".join("%g" % v for v in mods)))
        spr = M["muelle"].get(obj) or muelle_debajo(M, t, [J[r[c]] for c in ("Elm Jt1", "Elm Jt2", "Elm Jt3", "Elm Jt4")])
        if spr:
            ks = M["aspr"][spr] * KGF
            L.append("areaspring %d %.10g nodal" % (k, ks))
        sh_id[r["Element Name"]] = (k, pts)
    # --- barras
    L.append("# frame ID nI nJ E A I22 I33 J nu rho ; as ID As2 As3  (VC 60X60)")
    for k, r in enumerate(M["frames"], 1):
        s = M["fdef"][M["fsec"][r["Object Name"]]]
        L.append("frame %d %d %d %.6f %.10g %.10g %.10g %.10g %.2f %.6g   # %s VC60X60" % (
            k, nid(r["Elm JtI"]), nid(r["Elm JtJ"]), E, float(s["Area"]), float(s["I22"]), float(s["I33"]),
            float(s["J"]), nu, rho if corregido else 2.45, r["Element Name"]))
        L.append("as %d %.10g %.10g" % (k, float(s["As2"]), float(s["As3"])))
        w = M["floads"].get((r["Object Name"], "Dead"), 0.0)
        if w:
            L.append("frameload %d 0 0 %.10g Dead" % (k, -w * KGF))
    L.append("torsion safe      # SAFE analiza las vigas con 0.1*J")
    L.append("edge lineal       # AUTO EDGE CONSTRAINTS = Line Constraint (@LC) de SAFE: nudo colgado lineal")
    for j, r in M["rest"].items():
        f = ["1" if r[c] == "Yes" else "0" for c in ("UX", "UY", "UZ", "RX", "RY", "RZ")]
        L.append("support %d %s" % (nid(j), " ".join(f)))
    # --- cargas
    cargas = M["jl"]
    if corregido:
        # una por columna: las que caen en un cruce de ejes (GRID). Las demas son copias exactas.
        gx = sorted(float(r["Ordinate"]) for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("X"))
        gy = sorted(float(r["Ordinate"]) for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("Y"))
        def en_cruce(j):
            x, y, _ = J[j]
            return min(abs(x - v) for v in gx) < 0.01 and min(abs(y - v) for v in gy) < 0.01
        cargas = [r for r in cargas if en_cruce(r["UniqueName"])]
    L.append("# load nudo FX FY FZ MX MY MZ patron   (kN, kN*m); una linea por nudo y patron (el lector TS")
    L.append("# hace `set`, no suma: dos lineas al mismo nudo y patron se pisarian)")
    acum = collections.OrderedDict(); origen = collections.defaultdict(list)
    def sumar(n, pat, v, de):
        a = acum.setdefault((n, pat), [0.0] * 6)
        for i in range(6): a[i] += v[i]
        origen[(n, pat)].append(de)
    reparto = []
    for r in cargas:
        j = r["UniqueName"]; pat = r["Load Pattern"]
        v = [float(r[c]) * KGF for c in ("FX", "FY", "FZ", "MX", "MY", "MZ")]
        if j in sueltos:
            x, y, _ = J[j]
            for en, (k, pts) in sh_id.items():
                P = [J[q] for q in M_areas_row(M, en)]
                xe = en_quad(P, x, y)
                if xe is None: continue
                xi, eta = xe
                N = [0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta), 0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta)]
                for n_i, p_i in zip(N, pts):
                    sumar(p_i, pat, [n_i * c for c in v], "%.4f*%s(%s)" % (n_i, j, en))
                reparto.append((j, en, pat))
                break
            else:
                raise RuntimeError("punto %s no cae en ningun elemento" % j)
        else:
            sumar(nid(j), pat, v, j)
    if caso:
        pats = {"Dead": ("Dead",), "SERVICIO": ("Dead", "DNE", "Live")}[caso]
        suma = collections.OrderedDict()
        for (n, pat), v in acum.items():
            if pat not in pats: continue
            a = suma.setdefault(n, [0.0] * 6)
            for i in range(6): a[i] += v[i]
        for n, v in suma.items():
            L.append("load %d %s Dead   # caso %s" % (n, " ".join("%.10g" % c for c in v), caso))
    else:
        for (n, pat), v in acum.items():
            L.append("load %d %s %s   # %s" % (n, " ".join("%.10g" % c for c in v), pat, "+".join(origen[(n, pat)])))
    if corregido:
        L.append("selfweight 1      # peso propio: losa (2549.3 kgf/m3) y vigas; pedestal Weight Modifier 0")
    L.append("solve")
    return "\n".join(L) + "\n", dict(sueltos=sueltos, reparto=reparto, n=len(usados), nsh=len(M["areas"]), nfr=len(M["frames"]),
                                     ncargas=len(cargas))


def muelle_debajo(M, t, P):
    """Muelle de area del pano de LOSA (con muelle) que contiene el centroide de la cascara P."""
    pts = {r["UniqueName"]: (float(r["X"]), float(r["Y"])) for r in t["POINT OBJECT CONNECTIVITY"]}
    cx = sum(p[0] for p in P) / 4; cy = sum(p[1] for p in P) / 4
    for r in t["FLOOR OBJECT CONNECTIVITY"]:
        obj = r["Unique Name"]
        if obj not in M["muelle"]: continue
        poly = [pts[r["UniquePt%d" % i]] for i in range(1, 5)]
        dentro = False
        for i in range(4):
            (x1, y1), (x2, y2) = poly[i], poly[(i + 1) % 4]
            if (y1 > cy) != (y2 > cy) and cx < x1 + (cy - y1) * (x2 - x1) / (y2 - y1):
                dentro = not dentro
        if dentro:
            return M["muelle"][obj]
    return None


def M_areas_row(M, en):
    for r in M["areas"]:
        if r["Element Name"] == en:
            return [r[c] for c in ("Elm Jt1", "Elm Jt2", "Elm Jt3", "Elm Jt4")]


if __name__ == "__main__":
    ruta = sys.argv[1]
    corr = any(a.startswith("corr") for a in sys.argv[2:])
    kv = dict(a.split("=", 1) for a in sys.argv[2:] if "=" in a)
    t = cargar(ruta)
    txt, info = armar(t, corr, kv.get("caso"))
    out = kv.get("salida") or os.path.join(os.path.dirname(os.path.abspath(__file__)), "radier_mod002%s.heks" % ("_corregido" if corr else ""))
    open(out, "w", encoding="utf-8").write(txt)
    print(out, info)
