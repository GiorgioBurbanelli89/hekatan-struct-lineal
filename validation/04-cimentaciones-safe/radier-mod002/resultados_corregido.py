"""Resultados del radier CORREGIDO (malla conforme) para el informe: presion, asientos, distorsion angular,
punzonamiento ACI 318-14, momentos de losa -> As, vigas, equilibrio. Lee res/conf_{SERVICIO,DISENO}.json
(salida de resolver_heks_json.mjs = cliModeler + WASM, el motor de la app). Unidades de salida: t, m, kg/cm2.

Todo lo que no calcula el motor (punzonamiento, As) va aqui con la formula ACI escrita al lado.
"""
import json, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_heks_desde_f2k import cargar, KGF
AQUI = os.path.dirname(os.path.abspath(__file__))
G = 9.80665
T = 1 / G                         # kN -> t
KS = 400000 * KGF                 # kN/m3

def cargar_res(c):
    return json.load(open(os.path.join(AQUI, "res", "conf_%s.json" % c)))

def k_nodal(D):
    """k_i = ks * int N_i dA de los registros de muelle de area (-3), como el motor."""
    import numpy as np
    k = {}
    g = 1 / math.sqrt(3)
    for s in D["springs"]:
        if s["node"] >= 0 or s["dof"] != -3: continue
        el = D["elements"][-s["node"] - 1]
        P = np.array([D["nodes"][n][:2] for n in el])
        for xi in (-g, g):
            for eta in (-g, g):
                N = 0.25 * np.array([(1 - xi) * (1 - eta), (1 + xi) * (1 - eta), (1 + xi) * (1 + eta), (1 - xi) * (1 + eta)])
                dxi = 0.25 * np.array([-(1 - eta), (1 - eta), (1 + eta), -(1 + eta)])
                de = 0.25 * np.array([-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)])
                dJ = abs(np.linalg.det(np.array([dxi @ P, de @ P])))
                for i, n in enumerate(el): k[n] = k.get(n, 0) + s["k"] * N[i] * dJ
    return k

def columnas(t):
    """las 15 columnas: cargas del f2k en cruces de ejes (posicion, dimensiones, cargas por patron)."""
    P = {r["UniqueName"]: (float(r["X"]), float(r["Y"])) for r in t["POINT OBJECT CONNECTIVITY"]}
    gx = sorted(float(r["Ordinate"]) for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("X"))
    gy = sorted(float(r["Ordinate"]) for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("Y"))
    gid = {r["Ordinate"]: r["ID"] for r in t["GRID DEFINITIONS - GRID LINES"]}
    cols = {}
    for r in t["JOINT LOADS ASSIGNMENTS - FORCE"]:
        x, y = P[r["UniqueName"]]
        ix = min(range(len(gx)), key=lambda i: abs(gx[i] - x)); iy = min(range(len(gy)), key=lambda i: abs(gy[i] - y))
        if abs(gx[ix] - x) > 0.01 or abs(gy[iy] - y) > 0.01: continue
        nm = "%s-%s" % ([r2["ID"] for r2 in t["GRID DEFINITIONS - GRID LINES"] if r2["Grid Line Type"].startswith("X")][ix],
                        [r2["ID"] for r2 in t["GRID DEFINITIONS - GRID LINES"] if r2["Grid Line Type"].startswith("Y")][iy])
        c = cols.setdefault(nm, dict(x=gx[ix], y=gy[iy], pt=r["UniqueName"], bx=float(r["X Dimension"]), by=float(r["Y Dimension"]), F={}))
        c["F"][r["Load Pattern"]] = -float(r["FZ"]) / 1000.0     # t (kgf/1000), + hacia abajo
    return cols

def main():
    t = cargar(os.path.join(AQUI, "MOD_002.f2k"))
    out = {}
    cols = columnas(t)
    for caso in ("SERVICIO", "DISENO"):
        D = cargar_res(caso)
        nodes = D["nodes"]; U = {int(k): v for k, v in D["deformations"].items()}
        k = k_nodal(D)
        p = {n: -KS * U[n][2] * T for n in k}               # t/m2, + = compresion
        R = sum(k[n] * -U[n][2] for n in k) * T             # t
        F = sum(v[2] for v in D["loads"].values()) * T      # t (nodal: columnas + peso losa + vigas)
        imax = max(p, key=p.get); imin = min(p, key=p.get)
        uz = {n: U[n][2] for n in U}
        # ESTADO: asiento en cada columna y diferencial entre columnas VECINAS (misma fila o columna de ejes)
        near = lambda x, y: min(range(len(nodes)), key=lambda i: (nodes[i][0] - x) ** 2 + (nodes[i][1] - y) ** 2)
        for nm, c in cols.items(): c["nodo"] = near(c["x"], c["y"])
        pares = []
        names = sorted(cols)
        xs = sorted({c["x"] for c in cols.values()}); ys = sorted({c["y"] for c in cols.values()})
        for a in names:
            for b in names:
                if a >= b: continue
                ca, cb = cols[a], cols[b]
                vec = (abs(ca["y"] - cb["y"]) < 1e-6 and not any(ca["x"] < c["x"] < cb["x"] or cb["x"] < c["x"] < ca["x"] for c in cols.values() if abs(c["y"] - ca["y"]) < 1e-6)) or \
                      (abs(ca["x"] - cb["x"]) < 1e-6 and not any(ca["y"] < c["y"] < cb["y"] or cb["y"] < c["y"] < ca["y"] for c in cols.values() if abs(c["x"] - ca["x"]) < 1e-6))
                if not vec: continue
                Lab = math.hypot(ca["x"] - cb["x"], ca["y"] - cb["y"])
                d = abs(uz[ca["nodo"]] - uz[cb["nodo"]])
                pares.append(dict(a=a, b=b, L=Lab, delta_mm=d * 1000, beta=d / Lab))
        pares.sort(key=lambda q: -q["beta"])
        out[caso] = dict(
            carga_nodal_t=-F, reaccion_t=R, equilibrio_pct=100 * (R + F) / -F,
            pmax_tm2=p[imax], pmax_kgcm2=p[imax] / 10, pmax_xy=nodes[imax][:2],
            pmin_tm2=p[imin], pmin_kgcm2=p[imin] / 10, pmin_xy=nodes[imin][:2],
            traccion=any(v < 0 for v in p.values()), n_muelles=len(k),
            pmedia_tm2=sum(p.values()) / len(p), R_sobre_A=R / (sum(k.values()) / KS),
            uz_max_mm=-min(uz.values()) * 1000, uz_max_xy=nodes[min(uz, key=uz.get)][:2],
            uz_min_mm=-max(uz.values()) * 1000,
            asiento_col_mm={nm: -uz[c["nodo"]] * 1000 for nm, c in cols.items()},
            distorsion=pares[:6],
        )
    # punzonamiento con las cargas de DISENO (Vu = carga de columna mayorada - presion dentro del perimetro)
    out["punzonamiento"] = punzonamiento(cols, cargar_res("DISENO"), t)
    out["momentos"] = momentos(cargar_res("DISENO"))
    out["vigas"] = vigas(cargar_res("DISENO"))
    out["columnas"] = {nm: dict(x=c["x"], y=c["y"], bx=c["bx"], by=c["by"], F=c["F"]) for nm, c in cols.items()}
    json.dump(out, open(os.path.join(AQUI, "res", "resultados_corregido.json"), "w"), indent=1)
    return out

# ── Punzonamiento ACI 318-14 §22.6 (unidades kgf, cm) ──────────────────────────────────────
#   d = h - 7.5 cm;  b0 = perimetro a d/2 de la cara (recortado si la columna esta en borde/esquina)
#   vc = min( 1.06 sqrt(f'c) ;  0.53 (1 + 2/beta) sqrt(f'c) ;  0.27 (alpha_s d / b0 + 2) sqrt(f'c) )   [kg/cm2]
#        (ACI 22.6.5.2 en SI: 0.33 / 0.17(1+2/b) / 0.083(as d/b0+2) sqrt(f'c MPa); x sqrt(10.197)/... = 1.06/0.53/0.27 en kgf/cm2)
#   alpha_s = 40 interior, 30 borde, 20 esquina.  phi = 0.75.
#   Vu = Pu (columna, DISENO) - q_u * area dentro del perimetro critico (reaccion del suelo que no punzona).
#   vu = Vu / (b0 d)   (sin el momento desbalanceado: la transferencia por momento gamma_v Mu no se incluye;
#        las columnas llevan MX, MY pequenos -se reportan-, ver nota del informe).
FC = 210.0
from gen_heks_conforme import geometria as _geo
HUECOS = _geo(cargar(os.path.join(AQUI, "MOD_002.f2k")))[2]
def punzonamiento(cols, D, t):
    x0 = min(n[0] for n in D["nodes"]); x1 = max(n[0] for n in D["nodes"])
    y0 = min(n[1] for n in D["nodes"]); y1 = max(n[1] for n in D["nodes"])
    nodes = D["nodes"]; U = {int(k): v for k, v in D["deformations"].items()}
    k = k_nodal(D)
    # espesor de losa bajo cada columna: el de las cascaras de losa (no pedestal) que tocan el perimetro
    esp = {}
    for e, el in enumerate(D["elements"]):
        if len(el) != 4: continue
        tt = D["thicknesses"].get(str(e));
        if str(e) in D["shellModifiers"]: continue    # pedestal
        for n in el: esp.setdefault(n, set()).add(tt)
    filas = []
    for nm, c in sorted(cols.items()):
        Pu = sum(f * {"Dead": 1.2, "DNE": 1.2, "Live": 1.6}[p] for p, f in c["F"].items())   # t
        n0 = min(range(len(nodes)), key=lambda i: (nodes[i][0] - c["x"]) ** 2 + (nodes[i][1] - c["y"]) ** 2)
        bx, by = c["bx"] * 100, c["by"] * 100                              # cm
        # h: el menor espesor de losa (no pedestal) con nudos dentro del perimetro critico (tanteo con d de 0.40)
        dd = 0.325
        hs = [min(esp[n]) for n in esp if abs(nodes[n][0] - c["x"]) <= c["bx"] / 2 + dd / 2 + 1e-6 and abs(nodes[n][1] - c["y"]) <= c["by"] / 2 + dd / 2 + 1e-6]
        h = min(hs) * 100; d = h - 7.5                                     # cm
        # perimetro critico a d/2, recortado por los bordes libres de la losa
        lx0 = max(c["x"] * 100 - bx / 2 - d / 2, x0 * 100); lx1 = min(c["x"] * 100 + bx / 2 + d / 2, x1 * 100)
        ly0 = max(c["y"] * 100 - by / 2 - d / 2, y0 * 100); ly1 = min(c["y"] * 100 + by / 2 + d / 2, y1 * 100)
        lados = {"x0": lx0 > x0 * 100 + 1e-6, "x1": lx1 < x1 * 100 - 1e-6, "y0": ly0 > y0 * 100 + 1e-6, "y1": ly1 < y1 * 100 - 1e-6}
        # ACI 318-14 22.6.4.3: huecos a menos de 4h de la columna -> se descuenta la parte de b0 que queda
        # dentro de las rectas que salen del centroide de la columna tangentes al hueco (su "sombra" angular)
        cx, cy = c["x"] * 100, c["y"] * 100
        sombras = []
        for (hx0, hx1, hy0, hy1) in HUECOS:
            dx = max(hx0 * 100 - (cx + bx / 2), (cx - bx / 2) - hx1 * 100, 0); dy = max(hy0 * 100 - (cy + by / 2), (cy - by / 2) - hy1 * 100, 0)
            if math.hypot(dx, dy) >= 4 * h: continue
            angs = [math.atan2(yy * 100 - cy, xx * 100 - cx) for xx in (hx0, hx1) for yy in (hy0, hy1)]
            a0 = angs[0]; rel = [((a - a0 + math.pi) % (2 * math.pi)) - math.pi for a in angs]
            sombras.append((a0 + min(rel), a0 + max(rel)))
        def en_sombra(px, py):
            a = math.atan2(py - cy, px - cx)
            return any(((a - s0) % (2 * math.pi)) <= (s1 - s0) + 1e-12 for s0, s1 in sombras)
        b0_bruto, b0 = 0.0, 0.0
        segs = []
        if lados["x0"]: segs.append(((lx0, ly0), (lx0, ly1)))
        if lados["x1"]: segs.append(((lx1, ly0), (lx1, ly1)))
        if lados["y0"]: segs.append(((lx0, ly0), (lx1, ly0)))
        if lados["y1"]: segs.append(((lx0, ly1), (lx1, ly1)))
        for (ax, ay), (bxp, byp) in segs:
            Lseg = math.hypot(bxp - ax, byp - ay); nseg = 400
            for q in range(nseg):
                s_ = (q + 0.5) / nseg; px, py = ax + s_ * (bxp - ax), ay + s_ * (byp - ay)
                b0_bruto += Lseg / nseg
                if not en_sombra(px, py): b0 += Lseg / nseg
        libres = 4 - sum(lados.values())
        tipo = "interior" if libres == 0 else ("borde" if libres == 1 else "esquina")
        a_s = {"interior": 40, "borde": 30, "esquina": 20}[tipo]
        beta = max(bx, by) / min(bx, by)
        s = math.sqrt(FC)
        vc1 = 1.06 * s; vc2 = 0.53 * (1 + 2 / beta) * s; vc3 = 0.27 * (a_s * d / b0 + 2) * s
        vc = min(vc1, vc2, vc3)
        # presion mayorada dentro del perimetro critico (muelles de los nudos dentro)
        dentro = [n for n in k if lx0 / 100 - 1e-6 <= nodes[n][0] <= lx1 / 100 + 1e-6 and ly0 / 100 - 1e-6 <= nodes[n][1] <= ly1 / 100 + 1e-6]
        Rin = sum(k[n] * -U[n][2] for n in dentro) * T                   # t
        Vu = (Pu - Rin) * 1000                                            # kgf
        vu = Vu / (b0 * d)
        filas.append(dict(col=nm, tipo=tipo, bx=bx, by=by, h=h, d=d, b0=b0, b0_sin_huecos=b0_bruto, n_huecos_4h=len(sombras), Pu_t=Pu, Rsuelo_t=Rin, Vu_t=Vu / 1000,
                          vu=vu, vc1=vc1, vc2=vc2, vc3=vc3, phivc=0.75 * vc, ratio=vu / (0.75 * vc)))
    return filas

# ── Momentos de losa (DISENO, por joint, convencion CSI) -> As por metro, f'c 210, fy 4200 ──
#   Mu en t.m/m; d = h - 7.5 cm; As = Mu / (phi fy (d - a/2)), a = As fy / (0.85 f'c b), phi = 0.9, b = 100 cm
#   As,min = 0.0018 b h (ACI 7.6.1.1 / 24.4.3.2, retraccion y temperatura)
def as_req(Mu_tm, h_cm):
    d = h_cm - 7.5; Mu = abs(Mu_tm) * 1e5                                 # kgf.cm (por 100 cm)
    As = Mu / (0.9 * 4200 * 0.9 * d)
    for _ in range(50):
        a = As * 4200 / (0.85 * FC * 100); As = Mu / (0.9 * 4200 * (d - a / 2))
    return As, 0.0018 * 100 * h_cm

def momentos(D):
    res = {}
    # 1) por CENTROIDE de elemento (valor de diseno; los joints en las esquinas de los huecos son picos de
    #    esquina entrante que dependen de la malla) y 2) el pico por joint, para referencia
    for comp, key in (("M11", "M11c"), ("M22", "M22c")):
        best = {"+": (0, None, None), "-": (0, None, None)}
        for e, v in D[key].items():
            if e in D["shellModifiers"]: continue
            el = D["elements"][int(e)]; tt = D["thicknesses"][e]; vt = v * T
            xy = [sum(D["nodes"][n][q] for n in el) / 4 for q in (0, 1)]
            if vt > best["+"][0]: best["+"] = (vt, xy, tt)
            if vt < best["-"][0]: best["-"] = (vt, xy, tt)
        res[comp + "_centroide"] = {}
        for sg, (v, xy, tt) in best.items():
            As, Amin = as_req(v, tt * 100)
            res[comp + "_centroide"][sg] = dict(Mu_tm_m=v, xy=xy, h_cm=tt * 100, As_cm2_m=As, Asmin_cm2_m=Amin, cara="inferior" if sg == "+" else "superior")
    for comp, key in (("M11", "M11j"), ("M22", "M22j")):
        best = {"+": (0, None, None), "-": (0, None, None)}
        for e, vals in D[key].items():
            if e in D["shellModifiers"]: continue                         # pedestal (rigido): se excluye
            el = D["elements"][int(e)]; tt = D["thicknesses"][e]
            for j, v in enumerate(vals):
                vt = v * T                                               # t.m/m
                if vt > best["+"][0]: best["+"] = (vt, D["nodes"][el[j]][:2], tt)
                if vt < best["-"][0]: best["-"] = (vt, D["nodes"][el[j]][:2], tt)
        res[comp] = {}
        for sg, (v, xy, tt) in best.items():
            As, Amin = as_req(v, tt * 100)
            res[comp][sg] = dict(Mu_tm_m=v, xy=xy, h_cm=tt * 100, As_cm2_m=As, Asmin_cm2_m=Amin,
                                 cara="inferior" if sg == "+" else "superior")
    return res

def vigas(D):
    """M3 (vertical) y V2 maximos de las VC 60x60 a partir de las fuerzas de extremo del motor."""
    Mmax = Vmax = 0; Mw = Vw = None
    for e, v in D["Mz"].items():
        el = D["elements"][int(e)]
        if len(el) != 2: continue
        for q in v:
            if abs(q) * T > abs(Mmax): Mmax = q * T; Mw = D["nodes"][el[0]][:2]
        for q in D["Vy"].get(e, []):
            if abs(q) * T > abs(Vmax): Vmax = q * T; Vw = D["nodes"][el[0]][:2]
    return dict(M3_max_tm=Mmax, M3_xy=Mw, V2_max_t=Vmax, V2_xy=Vw)

if __name__ == "__main__":
    o = main()
    for c in ("SERVICIO", "DISENO"):
        r = o[c]
        print(c, "q max %.2f t/m2 en %s | q min %.2f en %s | traccion %s | Uz max %.2f mm | R %.2f t, cargas %.2f t (%.1e %%)" % (
            r["pmax_tm2"], r["pmax_xy"], r["pmin_tm2"], r["pmin_xy"], r["traccion"], r["uz_max_mm"], r["reaccion_t"], r["carga_nodal_t"], r["equilibrio_pct"]))
        print("   distorsion max", r["distorsion"][:3])
    for f in o["punzonamiento"]: print("  punz %-4s %-8s b0 %.0f d %.1f Pu %.1f Vu %.1f vu %.2f phivc %.2f ratio %.2f" % (f["col"], f["tipo"], f["b0"], f["d"], f["Pu_t"], f["Vu_t"], f["vu"], f["phivc"], f["ratio"]))
    print(json.dumps(o["momentos"], indent=0)); print(o["vigas"])
