# -*- coding: utf-8 -*-
"""Serquen («El SAP2000 aplicado al suelo», C. Eng. William Rodriguez Serquen) en OpenSees, el MISMO modelo
que cli/serquen_libro_heks.py: 40x40x20 stdBrick (H8 clasico, SIN modos incompatibles), base fija, caras
laterales articuladas, vigas FSEC1 (elasticTimoshenkoBeam con As de SAP2000) cada 0.5 m en el cuadrado de 10 m,
unidas al suelo con equalDOF 1 2 3. tonf, m.     python serquen_libro_opensees.py RECTANGULAR|PUNTUAL|LINEAL
"""
import sys, time, json
import openseespy.opensees as ops
P = sys.argv[1]
import os
nx, ny, nz, L, H = int(os.environ.get("NX", 40)), int(os.environ.get("NX", 40)), int(os.environ.get("NX", 40)) // 2, 20.0, 10.0
d = L / nx
nid = lambda i, j, k: k * (ny + 1) * (nx + 1) + j * (nx + 1) + i + 1
X = lambda i: -L / 2 + d * i
Es, nus, A, I33, I22, J, As2, As3 = 20389019.158038314, 0.3, 0.0042645076, 6.572417470223499e-05, 3.301257173010083e-06, 9.651176780539531e-08, 0.00193548, 0.0020430066666666663
Gs = Es / (2 * (1 + nus))
t0 = time.time()
ops.wipe(); ops.model("basic", "-ndm", 3, "-ndf", 3)
for k in range(nz + 1):
    for j in range(ny + 1):
        for i in range(nx + 1):
            ops.node(nid(i, j, k), X(i), X(j), H / nz * k)
            if k == 0 or i in (0, nx) or j in (0, ny): ops.fix(nid(i, j, k), 1, 1, 1)
ops.nDMaterial("ElasticIsotropic", 1, 2000.0, 0.42)
e = 0
for k in range(nz):
    for j in range(ny):
        for i in range(nx):
            e += 1
            ops.element("stdBrick", e, nid(i, j, k), nid(i + 1, j, k), nid(i + 1, j + 1, k), nid(i, j + 1, k),
                        nid(i, j, k + 1), nid(i + 1, j, k + 1), nid(i + 1, j + 1, k + 1), nid(i, j + 1, k + 1), 1)
# vigas: nudos aparte con 6 gdl, atados en traslacion al nudo del suelo
ops.model("basic", "-ndm", 3, "-ndf", 6)
OFF = 100000
lado = list(range(nx // 4, 3 * nx // 4 + 1)); a, b = lado[0], lado[-1]
borde = set()
for t in lado: borde |= {(t, a), (t, b), (a, t), (b, t)}
for (i, j) in borde:
    ops.node(OFF + nid(i, j, nz), X(i), X(j), H); ops.equalDOF(nid(i, j, nz), OFF + nid(i, j, nz), 1, 2, 3)
tramos = []
for t in range(len(lado) - 1):
    tramos += [((lado[t], a), (lado[t + 1], a)), ((b, lado[t]), (b, lado[t + 1])),
               ((lado[t + 1], b), (lado[t], b)), ((a, lado[t + 1]), (a, lado[t]))]
ops.geomTransf("Linear", 1, 0.0, 0.0, 1.0)   # eje local z = +Z global -> el plano de I_z es el vertical
f0 = e
for n, ((i1, j1), (i2, j2)) in enumerate(tramos):
    # elasticTimoshenkoBeam: E G A Jx Iy Iz Avy Avz ; Iz = flexion en el plano xy local (y local horizontal)
    # con vecxz = +Z: z local = vertical, y local = horizontal -> Iz = flexion horizontal = I22, Iy = vertical = I33
    ops.element("ElasticTimoshenkoBeam", f0 + n + 1, OFF + nid(i1, j1, nz), OFF + nid(i2, j2, nz),
                Es, Gs, A, J, I33, I22, As3, As2, 1)
ops.timeSeries("Linear", 1); ops.pattern("Plain", 1, 1)
if P == "RECTANGULAR":
    for j in range(ny):
        for i in range(nx):
            if abs(X(i) + d / 2) < 2.5 and abs(X(j) + d / 2) < 1.5:
                for (ii, jj) in ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)): ops.load(nid(ii, jj, nz), 0, 0, -10 * d * d / 4)
elif P == "PUNTUAL":
    ops.load(nid(nx // 2, ny // 2, nz), 0, 0, -100.0)
else:
    for n, ((i1, j1), (i2, j2)) in enumerate(tramos):
        ops.eleLoad("-ele", f0 + n + 1, "-type", "-beamUniform", 0.0, -1.0, 0.0)   # w en z local (= -Z global)
ops.constraints("Transformation"); ops.numberer("RCM"); ops.system(os.environ.get("SIS", "UmfPack"))
ops.test("NormDispIncr", 1e-12, 5); ops.algorithm("Linear"); ops.integrator("LoadControl", 1.0); ops.analysis("Static")
ok = ops.analyze(1)
idx = {(round(X(i), 3), round(X(j), 3), round(H / nz * k, 3)): nid(i, j, k) for k in range(nz + 1) for j in range(ny + 1) for i in range(nx + 1)}
out = {q: 1000 * ops.nodeDisp(idx[q], 3) for q in [(0.0, 0.0, 10.0), (5.0, 0.0, 10.0), (0.0, 0.0, 5.0)]}
ops.reactions(); R = sum(ops.nodeReaction(n, 3) for n in ops.getNodeTags() if n < OFF and any(ops.nodeDOFs(n)) and n in idx.values())
print(P, "ok" if ok == 0 else "FALLO", "%.1f s" % (time.time() - t0), " ".join("Uz%s %.4f mm" % (str(q), v) for q, v in out.items()), "sumR %.3f" % R)
json.dump({str(k): v for k, v in out.items()}, open(r"C:\hk_serquen\ops_%s.json" % P, "w"))

