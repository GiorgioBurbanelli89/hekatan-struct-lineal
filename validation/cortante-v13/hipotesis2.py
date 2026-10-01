exec(open("hipotesis.py").read().split("recetas = {")[0])
def bg(xl, yl, Mj, xi, et, jxi=None, jet=None):
    dN = np.array([[-(1-et), (1-et), (1+et), -(1+et)], [-(1-xi), -(1+xi), (1+xi), (1-xi)]])/4
    Ji = np.linalg.inv(jac(xl, yl, xi if jxi is None else jxi, et if jet is None else jet)); Mj = np.array(Mj)
    dxi = dN[0] @ Mj; det = dN[1] @ Mj
    dX = Ji[0,0]*dxi + Ji[0,1]*det; dY = Ji[1,0]*dxi + Ji[1,1]*det
    return np.array([dX[0] + dY[2], dY[1] + dX[2]])
recetas = {
  "D esquina, J esquina": lambda xl, yl, u, Mj: [bg(xl, yl, Mj, r, s) for r, s in esq],
  "D2 en Gauss, extrapolado": lambda xl, yl, u, Mj: ext([bg(xl, yl, Mj, r*g, s*g) for r, s in esq]),
  "D3 esquina, J del centro": lambda xl, yl, u, Mj: [bg(xl, yl, Mj, r, s, 0, 0) for r, s in esq],
  "D4 Gauss con J centro, extrapolado": lambda xl, yl, u, Mj: ext([bg(xl, yl, Mj, r*g, s*g, 0, 0) for r, s in esq]),
}
for nm, f in recetas.items():
    err = 0; vref = 0; peor = None
    for a, e in enumerate(D["els"]):
        xl = N[e,0]; yl = N[e,1]; u = u12(e, mp)
        Mj = ext([Mfield(xl, yl, u, r*g, s*g) for r, s in esq])
        V = f(xl, yl, u, Mj)
        for k, n in enumerate(e):
            fr = ref[(a, n)]
            d = max(abs(-V[k][0]-fr["V13"]), abs(-V[k][1]-fr["V23"]))
            if d > err: err, peor = d, (a, n, -V[k], fr["V13"], fr["V23"])
            vref = max(vref, abs(fr["V13"]), abs(fr["V23"]))
    print("%-36s error %.3e de %.3f   peor %s" % (nm, err, vref, peor[:2]))
