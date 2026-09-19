"""Radier MOD_002 en SAP2000 24 (juez) con la MISMA malla que SAFE/Hekatan, y en el WASM de Hekatan.

  1. node tests/lib/dump_heks.mjs sap/radier_<caso>.heks sap/dump_<caso>.json   (cliModeler + WASM)
  2. muelles de AREA del dump -> muelles NODALES k_i = ks * int N_i dA (lo que SAFE mete: 366/366 a 7e-15)
  3. csi_desde_dump.py sap ... --edge  (AreaObj.SetEdgeConstraint = el @LC de SAFE)
  4. sap/resultados_{wasm,sap}.json = {caso: {nudoID: [ux..rz]}}  -> comparar_vs_safe.py json ...

  python sap_radier.py preparar      (pasos 1-2, sin SAP)
  python sap_radier.py sap           (paso 3; SAP2000 tarda ~95 s en arrancar, NO es cuelgue)
  python sap_radier.py leer          (paso 4)
"""
import json, os, re, subprocess, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.abspath(os.path.join(AQUI, "..", "..", ".."))
SAP = os.path.join(AQUI, "sap")
CASOS = ("Dead", "SERVICIO")
DRIVER = os.path.join(RAIZ, "validation", "modelos", "deck-edge", "csi_desde_dump.py")


def ids_de(heks):
    # cliModeler ORDENA los nudos por ID (cliModeler.ts ~1193): indice interno = posicion en la lista ordenada
    return sorted(int(l.split()[1]) for l in open(heks, encoding="utf-8") if l.startswith("node "))


def muelles_nodales(D):
    """lista {node,dof,k} con nudo negativo (area) -> dict {i: [0,0,k,0,0,0]} por int N_i dA (Gauss 2x2)."""
    k = {}
    g = 1 / np.sqrt(3)
    for s in D["nodeInputs"]["springs"]:
        if s["node"] >= 0:
            k.setdefault(s["node"], [0.0] * 6)[s["dof"]] += s["k"]; continue
        if s["dof"] not in (-1, -3): continue          # -2/-4 = nudo colgado, no es muelle
        el = D["elements"][-s["node"] - 1]
        P = np.array([D["nodes"][n][:2] for n in el])
        for xi in (-g, g):
            for eta in (-g, g):
                N = 0.25 * np.array([(1 - xi) * (1 - eta), (1 + xi) * (1 - eta), (1 + xi) * (1 + eta), (1 - xi) * (1 + eta)])
                dxi = 0.25 * np.array([-(1 - eta), (1 - eta), (1 + eta), -(1 + eta)])
                de = 0.25 * np.array([-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)])
                dJ = abs(np.linalg.det(np.array([dxi @ P, de @ P])))
                for i, n in enumerate(el):
                    k.setdefault(n, [0.0] * 6)[2] += s["k"] * N[i] * dJ
    return {str(n): v for n, v in k.items()}


def preparar():
    os.makedirs(SAP, exist_ok=True)
    wasm = {}
    for c in CASOS:
        h = os.path.join(SAP, "radier_%s.heks" % c)
        subprocess.run([sys.executable, os.path.join(AQUI, "gen_heks_desde_f2k.py"), os.path.join(AQUI, "MOD_002.f2k"),
                        "caso=" + c, "salida=" + h], check=True, stdout=subprocess.DEVNULL)
        d = os.path.join(SAP, "dump_%s.json" % c)
        subprocess.run(["node", os.path.join(RAIZ, "tests", "lib", "dump_heks.mjs"), h, d], check=True, cwd=RAIZ)
        D = json.load(open(d))
        kn = muelles_nodales(D)
        D["nodeInputs"]["springs"] = kn
        json.dump(D, open(d, "w"))
        ids = ids_de(h)
        wasm[c] = {str(ids[int(i)]): u for i, u in D["deformations"].items()}
        print(c, "nudos", len(D["nodes"]), "muelles nodales", len(kn), "sum k", sum(v[2] for v in kn.values()))
    json.dump(wasm, open(os.path.join(SAP, "resultados_wasm.json"), "w"))


def sap():
    d0 = os.path.join(SAP, "dump_Dead.json")
    args = [sys.executable, DRIVER, "sap", d0, os.path.join(SAP, "sap_out.json")]
    args += ["CD=%s" % d0, "SERV=%s" % os.path.join(SAP, "dump_SERVICIO.json"), "--edge", "--watchdog", "2"]
    subprocess.run(args, check=True)


def leer():
    o = json.load(open(os.path.join(SAP, "sap_out.json")))
    ids = ids_de(os.path.join(SAP, "radier_Dead.heks"))
    res = {}
    for c, nm in (("Dead", "CD"), ("SERVICIO", "SERV")):
        res[c] = {str(ids[n["i"]]): n["u"] for n in o["casos"][nm]["nudos"]}
        print(c, "SAP sumRz", o["casos"][nm].get("sumRz"), "peor vs WASM %", o["casos"][nm].get("peor"))
    print("notas", o.get("notas"), "joints analisis", o.get("joints_analisis"), "areas", o.get("areas_analisis"))
    json.dump(res, open(os.path.join(SAP, "resultados_sap.json"), "w"))


if __name__ == "__main__":
    {"preparar": preparar, "sap": sap, "leer": leer}[sys.argv[1]]()
