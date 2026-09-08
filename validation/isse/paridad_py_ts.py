# -*- coding: utf-8 -*-
"""Paridad Python <-> TS/WASM en las directivas nuevas: `areaspring` (consistente y nodal) y `edge etabs`.

Escribe los .heks, los resuelve con el motor de Python y deja el JSON para que
`validation/isse/paridad_py_ts.mjs` los resuelva con el WASM y compare.
    python validation/isse/paridad_py_ts.py            # lado Python  -> _paridad_py.json
    node   validation/isse/paridad_py_ts.mjs           # lado TS/WASM -> compara y saca la tabla
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "hekatan-struct-py", "src")))
from hekatan_struct.heks import leer_heks, resolver_heks   # noqa: E402

B, N, T, E, NU, KS, P = 4.0, 4, 0.20, 25e6, 0.2, 20000.0, 1000.0


def placa(modo: str) -> str:
    """Placa BxB sobre Winkler, carga puntual en el centro. modo: consistente | nodal | sin."""
    h = B / N
    L, nid = [], {}
    for i in range(N + 1):
        for j in range(N + 1):
            nid[(i, j)] = len(nid) + 1
            L.append("node %d %.10g %.10g 0" % (nid[(i, j)], i * h, j * h))
    ns = 0
    for i in range(N):
        for j in range(N):
            ns += 1
            L.append("shell %d %d %d %d %d %.10g %.10g %.10g" % (
                ns, nid[(i, j)], nid[(i + 1, j)], nid[(i + 1, j + 1)], nid[(i, j + 1)], T, E, NU))
            if modo == "consistente":
                L.append("areaspring %d %.10g" % (ns, KS))
            elif modo == "nodal":
                L.append("springarea %d %.10g nodal" % (ns, KS))     # el alias, a proposito
    for i in range(N + 1):
        for j in range(N + 1):
            L.append("support %d 1 1 0 0 0 1" % nid[(i, j)])
    L.append("load %d 0 0 %.10g" % (nid[(N // 2, N // 2)], -P))
    L.append("solve")
    return "\n".join(L) + "\n"


def colgado() -> str:
    """Malla NO conforme: el paño A es un solo elemento y el nudo 7 cuelga de su arista."""
    return (
        "node 1 0 0 0\nnode 2 2 0 0\nnode 3 2 2 0\nnode 4 0 2 0\n"
        "node 5 3 0 0\nnode 6 3 0.7 0\nnode 7 2 0.7 0\nnode 8 3 2 0\n"
        "shell 1 1 2 3 4 0.20 25e6 0.2\nshell 2 2 5 6 7 0.20 25e6 0.2\nshell 3 7 6 8 3 0.20 25e6 0.2\n"
        "support 1 fixed\nsupport 4 fixed\nload 6 0 0 -10\nedge etabs\nsolve\n")


def main() -> None:
    casos = {"consistente": placa("consistente"), "nodal": placa("nodal"), "colgado": colgado()}
    out = {}
    for nom, txt in casos.items():
        ruta = os.path.join(HERE, "_paridad_%s.heks" % nom)
        open(ruta, "w", encoding="utf-8").write(txt)
        m = leer_heks(ruta)
        if m.errores:
            print("  %-12s errores: %s" % (nom, m.errores[:3]))
        res = resolver_heks(m)
        u = {}
        for k, nd in enumerate(m.nodes):
            d = res.deformations[k]
            u["%.3f,%.3f,%.3f" % tuple(nd)] = [float(v) for v in d[:6]]
        out[nom] = {"u": u, "errores": list(m.errores)}
        wmin = min(v[2] for v in u.values())
        print("  %-12s %d nudos, w min %.6e" % (nom, len(u), wmin))
    json.dump(out, open(os.path.join(HERE, "_paridad_py.json"), "w"), indent=1)
    print("-> _paridad_py.json")


if __name__ == "__main__":
    main()
