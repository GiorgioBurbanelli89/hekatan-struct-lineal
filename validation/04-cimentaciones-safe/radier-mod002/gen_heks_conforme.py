"""Radier MOD_002 CORREGIDO con malla CONFORME de Hekatan (sin nudos colgados), para abrir en la app publicada.

Geometria leida del f2k de SAFE (nada a mano): 36 panos rectangulares (losa 0.40 / 0.60 y 17 pedestales
Stiff 0.20 con m11/m22/m12 x100 y peso 0), 7 huecos (NULL/Opening), 3 vigas VC 60X60 con 1440 kgf/m (Dead),
4 apoyos UX UY. La malla es una rejilla por TODAS las lineas de los objetos + los ejes de columna,
subdividida a <= TAM m: cada celda es de UN solo objeto, asi que no hay nudos colgados.

Cargas corregidas: UNA por columna = las 15 cargas del f2k que caen en un cruce de ejes (las otras 22 son
copias exactas de estas, desplazadas <= 0.75 m). Peso propio: `selfweight 1` (losa y vigas 2549.3 kgf/m3,
pedestal Weight Modifier 0). Muelle Ks = 0.4 kgf/cm3 en TODAS las celdas (tambien bajo el pedestal, como SAFE).

  python gen_heks_conforme.py MOD_002.f2k                    -> radier_mod002_corregido_conforme.heks (patrones + combos)
  python gen_heks_conforme.py MOD_002.f2k combo=SERVICIO     -> ..._SERVICIO_app.heks (cargas ya combinadas, patron Dead)
  python gen_heks_conforme.py MOD_002.f2k combo=DISENO
  opcion tam=0.6 (tamano maximo de celda, m)
"""
import sys, os, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_heks_desde_f2k import cargar, KGF

COMBOS = {"SERVICIO": {"Dead": 1.0, "DNE": 1.0, "Live": 1.0},
          "DISENO": {"Dead": 1.2, "DNE": 1.2, "Live": 1.6}}   # "DISEÑO" del f2k (1.2D + 1.2DNE + 1.6L)


def geometria(t):
    P = {r["UniqueName"]: (float(r["X"]), float(r["Y"])) for r in t["POINT OBJECT CONNECTIVITY"]}
    secc = {r["UniqueName"]: r["Section Property"] for r in t["AREA ASSIGNMENTS - SECTION PROPERTIES"]}
    rect = lambda r: (min(P[r["UniquePt%d" % i]][0] for i in range(1, 5)), max(P[r["UniquePt%d" % i]][0] for i in range(1, 5)),
                      min(P[r["UniquePt%d" % i]][1] for i in range(1, 5)), max(P[r["UniquePt%d" % i]][1] for i in range(1, 5)))
    losas = [(r["Unique Name"], secc[r["Unique Name"]], rect(r)) for r in t["FLOOR OBJECT CONNECTIVITY"]]
    huecos = [rect(r) for r in t["NULL AREA OBJECT CONNECTIVITY"]]
    vigas = [(P[r["UniquePtI"]], P[r["UniquePtJ"]], r["Unique Name"]) for r in t["BEAM OBJECT CONNECTIVITY"]]
    return P, losas, huecos, vigas


def lineas(vals, tam, tol=0.0025):
    # Las coordenadas del f2k traen ruido de SAFE (2.899996 / 2.900002 / 2.9000119): se FUNDEN las que
    # estan a menos de la tolerancia de fusion de SAFE (PREFERENCES - TOLERANCE, MergeTol 0.0025 m).
    # Sin esto salian lineas de malla a 6 micras -> cascaras-astilla y nudos que SAP2000 funde al importar
    # (736 errores de import, 18-sep-2026).
    v0 = sorted(vals); v = []
    for x in v0:
        if v and x - v[-1][-1] < tol: v[-1].append(x)
        else: v.append([x])
    v = [round(sum(g) / len(g), 4) for g in v]
    out = [v[0]]
    for a, b in zip(v, v[1:]):
        n = max(1, int(__import__("math").ceil((b - a) / tam - 1e-9)))
        out += [a + (b - a) * k / n for k in range(1, n + 1)]
    return out


def armar(t, tam=0.6, combo=None, vista=None):
    P, losas, huecos, vigas = geometria(t)
    slab = {r["Name"]: r for r in t["SLAB PROPERTY DEFINITIONS"]}
    fc = {r["Material"]: r for r in t["MATERIAL PROPERTIES - BASIC MECHANICAL PROPERTIES"]}["f'c=210 kg/cm2"]
    E = float(fc["E1"]) * KGF; rho = float(fc["UnitWeight"]) / 1000.0
    aspr = {r["Name"]: float(r["Stiffnes U3"]) for r in t["SPRING PROPERTY DEFINITIONS - AREA SPRINGS"]}
    muelle = {r["UniqueName"]: r["Spring Property"] for r in t["AREA ASSIGNMENTS - AREA SPRINGS"]}
    gx = sorted(float(r["Ordinate"]) for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("X"))
    gy = sorted(float(r["Ordinate"]) for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("Y"))
    xs = [v for (_, _, (x0, x1, _, _)) in losas for v in (x0, x1)] + [v for h in huecos for v in h[:2]] + gx
    ys = [v for (_, _, (_, _, y0, y1)) in losas for v in (y0, y1)] + [v for h in huecos for v in h[2:]] + gy
    X = lineas(xs, tam); Y = lineas(ys, tam)
    X = [x for x in X if min(l[2][0] for l in losas) - 1e-6 <= x <= max(l[2][1] for l in losas) + 1e-6]
    Y = [y for y in Y if min(l[2][2] for l in losas) - 1e-6 <= y <= max(l[2][3] for l in losas) + 1e-6]
    dentro = lambda x, y, r: r[0] - 1e-9 <= x <= r[1] + 1e-9 and r[2] - 1e-9 <= y <= r[3] + 1e-9
    celdas = []
    for i in range(len(X) - 1):
        for j in range(len(Y) - 1):
            cx, cy = (X[i] + X[i + 1]) / 2, (Y[j] + Y[j + 1]) / 2
            if any(dentro(cx, cy, h) for h in huecos): continue
            obj = [l for l in losas if dentro(cx, cy, l[2])]
            if not obj: continue
            ped = [l for l in obj if slab[l[1]]["Property Type"] == "Stiff"]
            o = ped[0] if ped else obj[0]
            # muelle: el del pano de losa que hay debajo (el pedestal no lo trae, SAFE usa el de la losa)
            spr = next((muelle[l[0]] for l in obj if l[0] in muelle), None)
            celdas.append((i, j, o, spr))
    nid = {}
    def nudo(i, j):
        if (i, j) not in nid: nid[(i, j)] = len(nid) + 1
        return nid[(i, j)]
    L = []
    cab = ["# Radier MOD_002 CORREGIDO (Hekatan, malla CONFORME %.2f m, sin nudos colgados) - generado por gen_heks_conforme.py" % tam,
           "# Geometria, secciones, muelle y cargas leidas del f2k de SAFE 22.6. Unidades kN, m.",
           "# Correccion: UNA carga por columna (15, en los cruces de ejes) + peso propio (selfweight 1).",
           "# Ks = 0.4 kgf/cm3 = %.6g kN/m3, solo compresion en SAFE (aqui lineal: no hay levantamiento, comprobado)." % (aspr["Ks=0.4"] * KGF)]
    if combo:
        cab.append("# CARGAS YA COMBINADAS: %s = %s (todo en el patron Dead, peso propio x%g)" % (
            combo, " + ".join("%g %s" % (f, p) for p, f in COMBOS[combo].items()), COMBOS[combo]["Dead"]))
    L += cab
    shells = []
    for k, (i, j, o, spr) in enumerate(celdas, 1):
        sp = slab[o[1]]
        pts = [nudo(i, j), nudo(i + 1, j), nudo(i + 1, j + 1), nudo(i, j + 1)]
        shells.append((k, pts, o, sp, spr))
    for (i, j), n in sorted(nid.items(), key=lambda a: a[1]):
        L.append("node %d %.6f %.6f 0" % (n, X[i], Y[j]))
    L.append("# shell ID n1 n2 n3 n4 t E q rho   (# objeto SAFE / seccion)")
    for k, pts, o, sp, spr in shells:
        L.append("shell %d %d %d %d %d %g %.6f 0 %.6g   # obj %s %s" % (k, *pts, float(sp["Slab Thickness"]), E, rho * float(sp["Weight Modifier"]), o[0], o[1]))
        L.append("shelltype %d thick" % k)
        mods = [float(sp[m + " Modifier"]) for m in ("f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23")]
        if any(abs(v - 1) > 1e-12 for v in mods): L.append("shellmod %d %s" % (k, " ".join("%g" % v for v in mods)))
        if spr: L.append("areaspring %d %.10g nodal compresion" % (k, aspr[spr] * KGF))
    # vigas: por las lineas de la malla, partidas en cada nudo
    fs = {r["Name"]: r for r in t["FRAME SECTION PROPERTY DEFINITIONS - SUMMARY"]}["VC 60X60"]
    wD = {r["UniqueName"]: float(r["Force A"]) for r in t["FRAME LOADS ASSIGNMENTS - DISTRIBUTED"] if r.get("Load Pattern") == "Dead"}
    coord = {n: (X[i], Y[j]) for (i, j), n in nid.items()}
    L.append("# frame ID nI nJ E A I22 I33 J nu rho ; as ; frameload (VC 60X60, 1440 kgf/m Dead + su peso propio)")
    fid = 0
    for (a, b, obj) in vigas:
        horiz = abs(a[1] - b[1]) < 1e-6
        en = [(n, c) for n, c in coord.items() if (abs(c[1] - a[1]) < 1e-6 if horiz else abs(c[0] - a[0]) < 1e-6)]
        lo, hi = (min(a[0], b[0]), max(a[0], b[0])) if horiz else (min(a[1], b[1]), max(a[1], b[1]))
        en = sorted([e for e in en if lo - 1e-6 <= (e[1][0] if horiz else e[1][1]) <= hi + 1e-6], key=lambda e: e[1][0] if horiz else e[1][1])
        for (n1, _), (n2, _) in zip(en, en[1:]):
            fid += 1
            # rho 0 y el peso propio de la viga como carga repartida (A*gamma = 917.7 kgf/m): asi analyze()
            # lo lleva en los esfuerzos de la barra (el peso propio nodal no entra en su recuperacion)
            L.append("frame %d %d %d %.6f %.10g %.10g %.10g %.10g 0.2 0   # viga %s" % (fid, n1, n2, E, float(fs["Area"]), float(fs["I22"]), float(fs["I33"]), float(fs["J"]), obj))
            L.append("as %d %.10g %.10g" % (fid, float(fs["As2"]), float(fs["As3"])))
            fD = COMBOS[combo]["Dead"] if combo else 1.0
            wpp = float(fs["Area"]) * float(fc["UnitWeight"])     # kgf/m
            L.append("frameload %d 0 0 %.10g Dead   # 1440 + %.1f (peso propio viga) kgf/m" % (fid, -(wD[obj] + wpp) * KGF * fD, wpp))
    L.append("torsion safe      # SAFE analiza las vigas con 0.1*J (medido en su f2k)")
    pos = {v: k for k, v in coord.items()}
    near = lambda x, y: min(coord, key=lambda n: (coord[n][0] - x) ** 2 + (coord[n][1] - y) ** 2)
    for r in t["JOINT ASSIGNMENTS - RESTRAINTS"]:
        x, y = P[r["UniqueName"]]; n = near(x, y)
        assert abs(coord[n][0] - x) + abs(coord[n][1] - y) < 1e-4
        # SIN comentario al final: la app publicada (y el lector anterior al 18-sep-2026) lo leia como parte
        # del patron de bits y dejaba el apoyo LIBRE
        L.append("# apoyo del punto SAFE %s" % r["UniqueName"])
        L.append("support %d %s" % (n, " ".join("1" if r[c] == "Yes" else "0" for c in ("UX", "UY", "UZ", "RX", "RY", "RZ"))))
    # cargas: las de los cruces de ejes
    acum = collections.OrderedDict()
    for r in t["JOINT LOADS ASSIGNMENTS - FORCE"]:
        x, y = P[r["UniqueName"]]
        if min(abs(x - v) for v in gx) > 0.01 or min(abs(y - v) for v in gy) > 0.01: continue
        # 691 esta en (3.6500058, 0.91997975): 5 mm fuera del cruce (3.65, 0.925) -> va al nudo del cruce
        n = near(x, y); assert abs(coord[n][0] - x) + abs(coord[n][1] - y) < 0.01, (x, y)
        pat = r["Load Pattern"]; f = 1.0
        if combo: f = COMBOS[combo].get(pat, 0.0); pat = "Dead"
        a = acum.setdefault((n, pat), [0.0] * 6)
        for q, c in enumerate(("FX", "FY", "FZ", "MX", "MY", "MZ")): a[q] += f * float(r[c]) * KGF
    L.append("# load nudo FX FY FZ MX MY MZ patron (kN, kN*m) - una por columna")
    for (n, pat), v in acum.items():
        L.append("load %d %s %s" % (n, " ".join("%.10g" % c for c in v), pat))
    L.append("selfweight %g      # peso propio de la losa 2549.3 kgf/m3 (pedestal peso 0; vigas como frameload)" % (COMBOS[combo]["Dead"] if combo else 1))
    if not combo:
        fcd = {r["Material"]: float(r["Fc"]) for r in t["MATERIAL PROPERTIES - CONCRETE DATA"]}["f'c=210 kg/cm2"]
        L.append("fc %.6g      # f'c del f2k (%.0f kgf/m2): solo para el material de los ficheros de SAP2000/SAFE" % (fcd * KGF, fcd))
        for nm, fac in COMBOS.items():
            L.append("combo %s %s" % (nm, " ".join("%s %g" % (p, f) for p, f in fac.items())))
    if vista:
        L.append("vista pressure %s      # la app abre mostrando la presion de suelo de esta combinacion" % vista)
    L.append("solve")
    return "\n".join(L) + "\n", dict(nudos=len(nid), celdas=len(celdas), vigas=fid, X=len(X), Y=len(Y))


if __name__ == "__main__":
    kv = dict(a.split("=", 1) for a in sys.argv[2:] if "=" in a)
    t = cargar(sys.argv[1])
    combo = kv.get("combo")
    txt, info = armar(t, float(kv.get("tam", 0.6)), combo, kv.get("vista"))
    aqui = os.path.dirname(os.path.abspath(__file__))
    out = kv.get("salida") or os.path.join(aqui, "radier_mod002_corregido_conforme%s.heks" % ("_%s_app" % combo if combo else ""))
    open(out, "w", encoding="utf-8").write(txt)
    print(out, info)
