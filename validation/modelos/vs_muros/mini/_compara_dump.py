import json, sys
H = json.load(open(sys.argv[1])); C = json.load(open(sys.argv[2]))
nodes = H["nodes"]; U = H["deformations"]
def u(i):
    v = U.get(str(i)) if isinstance(U, dict) else U[i]
    return v[:3] if v else None
umax = max(abs(x) for i in range(len(nodes)) for x in (u(i) or [0]))
cs = {q["i"]: q["u"] for q in C.get("nudos", [])}
peor = (0, None); dentro = n = 0; sinpar = 0
for i, (x, y, z) in enumerate(nodes):
    uu = u(i)
    if not uu: continue
    c = cs.get(i)
    if c is None: sinpar += 1; continue
    for k in range(3):
        d = abs(uu[k] - c[k]) / umax * 100; n += 1
        if d <= 0.01: dentro += 1
        if d > peor[0]: peor = (d, (i, round(x,2), round(y,2), round(z,2), "xyz"[k], uu[k], c[k]))
print("  peor %.4f %% del maximo  %s  · %d/%d dentro del 0.01 %%  · sin pareja %d · u_max %.4e · sumRz CSI %s" % (peor[0], peor[1], dentro, n, sinpar, umax, C.get("sumRz")))
