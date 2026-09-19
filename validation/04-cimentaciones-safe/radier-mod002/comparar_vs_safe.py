"""Compara un resultado nudo a nudo contra SAFE (tablas del MOD_002.f2k), casos Dead y SERVICIO.

  python comparar_vs_safe.py python            -> resuelve el .heks con el motor de Python (hekatan_struct)
  python comparar_vs_safe.py json res.json     -> lee {caso: {nudoID: [ux,uy,uz,rx,ry,rz]}} (WASM, SAP2000...)

Presion de suelo = ks * Uz en los nudos con muelle (la tabla SOIL PRESSURES de SAFE es eso mismo:
comprobado 1016/1016 filas). Reaccion total = sum(k_i * Uz_i). Sale radier_<motor>_vs_safe.json.
"""
import sys, os, json, re, collections
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from gen_heks_desde_f2k import cargar, nid

KS = 400000.0               # kgf/m3 (Ks=0.4)
KGF = 0.00980665


def safe_resultados(t):
    out = {}
    for caso in ("Dead", "SERVICIO"):
        U = {nid(r["Unique Name"]): [float(r[k]) for k in ("Ux", "Uy", "Uz", "Rx", "Ry", "Rz")]
             for r in t["JOINT DISPLACEMENTS (INCLUDING INTERNAL MESH JOINTS)"] if r["Output Case"] == caso}
        R = {nid(r["Unique Name"]): float(r["FZ"]) for r in t["JOINT REACTIONS"] if r["Output Case"] == caso}
        out[caso] = (U, R)
    return out


def resolver_python(ruta_heks, caso):
    sys.path.insert(0, os.path.join(AQUI, "..", "..", "..", "hekatan-struct-py", "src"))
    from hekatan_struct.heks import leer_heks, resolver_heks
    txt = open(ruta_heks, encoding="utf-8").read()
    if caso == "Dead":   # el lector de Python suma todos los patrones: se dejan solo los de Dead
        txt = "\n".join(l for l in txt.splitlines() if not re.match(r"^load .* (Live|DNE)\b", l))
    tmp = os.path.join(AQUI, "_tmp_%s.heks" % caso)
    open(tmp, "w", encoding="utf-8").write(txt)
    m = leer_heks(tmp)
    if m.errores: print("  avisos:", m.errores)
    res = resolver_heks(m)
    os.remove(tmp)
    ids = m.node_id
    d = res.deformations if hasattr(res, "deformations") else res["deformations"]
    return {ids[i]: list(map(float, v)) for i, v in d.items()}


def comparar(U_h, safe, k_nudo, etiqueta):
    filas = {}
    for caso, (U_s, R_s) in safe.items():
        uh = U_h[caso]
        comunes = [n for n in U_s if n in uh]
        umax = max(abs(U_s[n][2]) for n in comunes)
        err = {n: (uh[n][2] - U_s[n][2]) for n in comunes}
        peor = max(comunes, key=lambda n: abs(err[n]))
        # presion y reaccion en los nudos con muelle
        p_s = {n: KS * U_s[n][2] for n in k_nudo}
        p_h = {n: KS * uh[n][2] for n in k_nudo}
        ns = min(p_s, key=p_s.get); nh = min(p_h, key=p_h.get)
        Rh = sum(-k_nudo[n] * uh[n][2] for n in k_nudo)
        Rs = sum(R_s.values())
        pe = max(k_nudo, key=lambda n: abs(p_h[n] - p_s[n]))
        filas[caso] = dict(
            nudos=len(comunes),
            uz_min_safe=min(U_s[n][2] for n in comunes), uz_min_hek=min(uh[n][2] for n in comunes),
            uz_peor_nudo=peor, uz_peor_dif_m=err[peor], uz_peor_pct_del_max=100 * abs(err[peor]) / umax,
            reaccion_safe_kgf=Rs, reaccion_hek_kgf=Rh, reaccion_pct=100 * (Rh - Rs) / Rs,
            pmax_safe_tm2=-p_s[ns] / 1000, pmax_safe_nudo=ns,
            pmax_hek_tm2=-p_h[nh] / 1000, pmax_hek_nudo=nh, pmax_pct=100 * (p_h[nh] - p_s[ns]) / p_s[ns],
            pprom_safe_tm2=-sum(p_s.values()) / len(p_s) / 1000, pprom_hek_tm2=-sum(p_h.values()) / len(p_h) / 1000,
            p_peor_nudo=pe, p_peor_dif_tm2=(p_h[pe] - p_s[pe]) / -1000,
        )
    print(json.dumps({etiqueta: filas}, indent=1))
    json.dump(filas, open(os.path.join(AQUI, "radier_%s_vs_safe.json" % etiqueta), "w"), indent=1)
    return filas


def k_nudos_safe(safe):
    U, R = safe["Dead"]
    return {n: R[n] / -U[n][2] for n in R}


if __name__ == "__main__":
    t = cargar(os.path.join(AQUI, "MOD_002.f2k"))
    safe = safe_resultados(t)
    k = k_nudos_safe(safe)
    if sys.argv[1] == "python":
        heks = sys.argv[2] if len(sys.argv) > 2 else os.path.join(AQUI, "radier_mod002.heks")
        U_h = {c: resolver_python(heks, c) for c in ("Dead", "SERVICIO")}
        comparar(U_h, safe, k, "python")
    else:
        d = json.load(open(sys.argv[2]))
        U_h = {c: {int(n): v for n, v in d[c].items()} for c in ("Dead", "SERVICIO")}
        comparar(U_h, safe, k, sys.argv[3] if len(sys.argv) > 3 else "json")
