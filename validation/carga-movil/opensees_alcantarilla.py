"""OpenSeesPy (testigo): la misma alcantarilla, un análisis estático por posición del camión.
2D (ndm 2, ndf 3), X horizontal, Y del script = Z de Hekatan. ElasticTimoshenkoBeam con As = 5/6·A
(lo que usan Hekatan y SAP2000 en un rectángulo). Muelles = zeroLength verticales.
uso: python opensees_alcantarilla.py [ejemplo|plantilla]   -> opensees_<cual>.json
Salida por posición: U[n] = [ux, uz, ry] y F[e] = localForce [Ni, Vi, Mi, Nj, Vj, Mj] (ejes de OpenSees).
"""
import json, sys, time
import openseespy.opensees as ops

cual = sys.argv[1] if len(sys.argv) > 1 else "ejemplo"
M = json.load(open(f"modelo_{cual}.json"))
E = M["E"]; G = E / (2 * (1 + M["nu"]))

def modelo():
    ops.wipe(); ops.model("basic", "-ndm", 2, "-ndf", 3)
    for i, (x, z) in enumerate(M["nudos"]):
        ops.node(i + 1, x, z)
    ops.geomTransf("Linear", 1)
    for e, b in enumerate(M["barras"]):
        ops.element("ElasticTimoshenkoBeam", e + 1, b["i"] + 1, b["j"] + 1, E, G, b["A"], b["I"], b["A"] * 5 / 6, 1)
    for k, s in enumerate(M["muelles"]):
        x, z = M["nudos"][s["nudo"]]
        ops.node(100000 + k, x, z); ops.fix(100000 + k, 1, 1, 1)
        ops.uniaxialMaterial("Elastic", 1000 + k, s["k"])
        ops.element("zeroLength", 100000 + k, 100000 + k, s["nudo"] + 1, "-mat", 1000 + k, "-dir", 2)
    for n in M["apoyoUx"]:
        ops.fix(n + 1, 1, 0, 0)

t0 = time.time()
res = {}
for c in M["casos"] + M.get("casosIL", []):
    modelo()
    ops.timeSeries("Linear", 1); ops.pattern("Plain", 1, 1)
    for nd, P in c["cargas"]:
        ops.load(nd + 1, 0.0, -P, 0.0)
    ops.system("BandGeneral"); ops.numberer("RCM"); ops.constraints("Plain")
    ops.integrator("LoadControl", 1.0); ops.algorithm("Linear"); ops.analysis("Static"); ops.analyze(1)
    res[c["nombre"]] = {
        "U": [ops.nodeDisp(i + 1) for i in range(len(M["nudos"]))],
        "F": [ops.eleResponse(e + 1, "localForce") for e in range(len(M["barras"]))],
    }
json.dump(res, open(f"opensees_{cual}.json", "w"))
print(f"OpenSeesPy {cual}: {len(res)} posiciones en {time.time() - t0:.1f} s")
