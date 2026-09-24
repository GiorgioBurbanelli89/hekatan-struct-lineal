# -*- coding: utf-8 -*-
"""Cuarto juez, SOLO numpy (sin OpenSees, sin Hekatan): placa delgada de Kirchhoff discreta sobre LA
MALLA QUE HIZO ETABS. Cuadrilateros = DKQ (Batoz & Ben Tahar 1982), triangulos = DKT (Batoz, Bathe
& Ho 1980, forma explicita de Batoz 1982). Solo flexion: GDL [w, thx, thy] por nudo,
thx = +dw/dy, thy = -dw/dx (mano derecha); betax = thy, betay = -thx.

    python numpy_sobre_malla_etabs.py            # autoprueba de los elementos + los 7 casos
    python numpy_sobre_malla_etabs.py losa_T     # uno

Sale ../isse/automesh/etabs_poligono/<caso>_numpy_thin.json (desplazamientos, mismo formato que ETABS).
"""
import json, os, sys
import numpy as np
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.normpath(os.path.join(AQUI, "..", "isse", "automesh", "etabs_poligono"))
TODOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"]
E, NU, T, Q = 25e6, 0.2, 0.20, -10.0

def Dflex(E, nu, t):
    return E * t**3 / (12 * (1 - nu**2)) * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1 - nu) / 2]])

# ── DKT ───────────────────────────────────────────────────────────────────────
def dkt_B(xy, xi, eta):
    x, y = xy[:, 0], xy[:, 1]
    x12, x23, x31 = x[0]-x[1], x[1]-x[2], x[2]-x[0]
    y12, y23, y31 = y[0]-y[1], y[1]-y[2], y[2]-y[0]
    P, t, q, r = {}, {}, {}, {}
    for k, (xij, yij) in {4: (x23, y23), 5: (x31, y31), 6: (x12, y12)}.items():
        l2 = xij**2 + yij**2
        P[k] = -6*xij/l2; t[k] = -6*yij/l2; q[k] = 3*xij*yij/l2; r[k] = 3*yij**2/l2
    a, b = 1-2*xi, 1-2*eta
    Hx_x = [P[6]*a+(P[5]-P[6])*eta, q[6]*a-(q[5]+q[6])*eta, -4+6*(xi+eta)+r[6]*a-eta*(r[5]+r[6]),
            -P[6]*a+eta*(P[4]+P[6]), q[6]*a-eta*(q[6]-q[4]), -2+6*xi+r[6]*a+eta*(r[4]-r[6]),
            -eta*(P[5]+P[4]), eta*(q[4]-q[5]), -eta*(r[5]-r[4])]
    Hy_x = [t[6]*a+eta*(t[5]-t[6]), 1+r[6]*a-eta*(r[5]+r[6]), -q[6]*a+eta*(q[5]+q[6]),
            -t[6]*a+eta*(t[4]+t[6]), -1+r[6]*a+eta*(r[4]-r[6]), -q[6]*a-eta*(q[4]-q[6]),
            -eta*(t[4]+t[5]), eta*(r[4]-r[5]), -eta*(q[4]-q[5])]
    Hx_e = [-P[5]*b-xi*(P[6]-P[5]), q[5]*b-xi*(q[5]+q[6]), -4+6*(xi+eta)+r[5]*b-xi*(r[5]+r[6]),
            xi*(P[4]+P[6]), xi*(q[4]-q[6]), -xi*(r[6]-r[4]),
            P[5]*b-xi*(P[4]+P[5]), q[5]*b+xi*(q[4]-q[5]), -2+6*eta+r[5]*b+xi*(r[4]-r[5])]
    Hy_e = [-t[5]*b-xi*(t[6]-t[5]), 1+r[5]*b-xi*(r[5]+r[6]), -q[5]*b+xi*(q[5]+q[6]),
            xi*(t[4]+t[6]), xi*(r[4]-r[6]), -xi*(q[4]-q[6]),
            t[5]*b-xi*(t[4]+t[5]), -1+r[5]*b+xi*(r[4]-r[5]), -q[5]*b-xi*(q[4]-q[5])]
    Hx_x, Hy_x, Hx_e, Hy_e = map(np.array, (Hx_x, Hy_x, Hx_e, Hy_e))
    A2 = x31*y12 - x12*y31
    return np.vstack([y31*Hx_x + y12*Hx_e, -x31*Hy_x - x12*Hy_e,
                      -x31*Hx_x - x12*Hx_e + y31*Hy_x + y12*Hy_e]) / A2, A2 / 2

def dkt_K(xy, D):
    K = np.zeros((9, 9))
    for xi, eta in [(0.5, 0), (0.5, 0.5), (0, 0.5)]:
        B, A = dkt_B(xy, xi, eta); K += B.T @ D @ B * abs(A) / 3
    return K

# ── DKQ ───────────────────────────────────────────────────────────────────────
def dkq_B(xy, xi, eta):
    x, y = xy[:, 0], xy[:, 1]
    # funciones de 8 nudos (serendipita) y sus derivadas en (xi, eta)
    xr = [-1, 1, 1, -1]; er = [-1, -1, 1, 1]
    dN_dxi, dN_de = np.zeros(8), np.zeros(8)
    for i in range(4):
        dN_dxi[i] = 0.25*xr[i]*(1+er[i]*eta)*(2*xr[i]*xi+er[i]*eta)
        dN_de[i] = 0.25*er[i]*(1+xr[i]*xi)*(xr[i]*xi+2*er[i]*eta)
    dN_dxi[4], dN_de[4] = -xi*(1-eta), -0.5*(1-xi*xi)        # 5 en el lado 1-2 (eta = -1)
    dN_dxi[5], dN_de[5] = 0.5*(1-eta*eta), -eta*(1+xi)       # 6 en el lado 2-3 (xi = +1)
    dN_dxi[6], dN_de[6] = -xi*(1+eta), 0.5*(1-xi*xi)         # 7 en el lado 3-4 (eta = +1)
    dN_dxi[7], dN_de[7] = -0.5*(1-eta*eta), -eta*(1-xi)      # 8 en el lado 4-1 (xi = -1)
    # jacobiano con el bilineal
    dB_dxi = 0.25*np.array([xr[i]*(1+er[i]*eta) for i in range(4)])
    dB_de = 0.25*np.array([er[i]*(1+xr[i]*xi) for i in range(4)])
    J = np.array([[dB_dxi @ x, dB_dxi @ y], [dB_de @ x, dB_de @ y]])
    Ji = np.linalg.inv(J)
    dNx = Ji[0, 0]*dN_dxi + Ji[0, 1]*dN_de
    dNy = Ji[1, 0]*dN_dxi + Ji[1, 1]*dN_de
    # coeficientes de lado k = 5..8 (lado i-j): xij = xi - xj
    a, b, c, d, e = (np.zeros(8) for _ in range(5))
    for k, (i, j) in zip(range(4, 8), [(0, 1), (1, 2), (2, 3), (3, 0)]):
        xij, yij = x[i]-x[j], y[i]-y[j]; l2 = xij*xij + yij*yij
        a[k] = -xij/l2; b[k] = 0.75*xij*yij/l2; c[k] = (0.25*xij*xij - 0.5*yij*yij)/l2
        d[k] = -yij/l2; e[k] = (0.25*yij*yij - 0.5*xij*xij)/l2
    def H(dN):
        Hx, Hy = np.zeros(12), np.zeros(12)
        for i in range(4):
            k, m = 4 + i, 4 + (i + 3) % 4          # lado que sale del nudo i y lado que llega
            Hx[3*i] = 1.5*(a[k]*dN[k] - a[m]*dN[m])
            Hx[3*i+1] = b[k]*dN[k] + b[m]*dN[m]
            Hx[3*i+2] = dN[i] - c[k]*dN[k] - c[m]*dN[m]
            Hy[3*i] = 1.5*(d[k]*dN[k] - d[m]*dN[m])
            Hy[3*i+1] = -dN[i] + e[k]*dN[k] + e[m]*dN[m]
            Hy[3*i+2] = -b[k]*dN[k] - b[m]*dN[m]
        return Hx, Hy
    Hx_x, Hy_x = H(dNx); Hx_y, Hy_y = H(dNy)
    return np.vstack([Hx_x, Hy_y, Hx_y + Hy_x]), np.linalg.det(J)

def dkq_K(xy, D):
    K = np.zeros((12, 12)); g = 1/np.sqrt(3)
    for xi, eta in [(-g, -g), (g, -g), (g, g), (-g, g)]:
        B, dJ = dkq_B(xy, xi, eta); K += B.T @ D @ B * dJ
    return K

def autoprueba():
    D = Dflex(1.0, 0.3, 1.0); a, b, c = 0.3, -0.7, 0.5
    for nom, xy, Kf, Bf, pts in [
        ("DKT", np.array([[0.1, 0.2], [2.3, 0.4], [0.7, 1.9]]), dkt_K, dkt_B, [(0.2, 0.1), (1/3, 1/3)]),
        ("DKQ", np.array([[0.0, 0.0], [2.2, 0.3], [2.6, 1.9], [0.4, 1.4]]), dkq_K, dkq_B, [(-0.3, 0.2), (0.5, -0.6)])]:
        ev = np.linalg.eigvalsh(Kf(xy, D))
        U = np.concatenate([[a*X*X+b*X*Y+c*Y*Y, b*X+2*c*Y, -(2*a*X+b*Y)] for X, Y in xy])
        err = max(np.abs(Bf(xy, *p)[0] @ U - np.array([-2*a, -2*c, -2*b])).max() for p in pts)
        print(f"{nom}: modos nulos {int(np.sum(np.abs(ev) < 1e-9*ev.max()))} (3) · patch test curvatura constante, error {err:.1e}")
        assert int(np.sum(np.abs(ev) < 1e-9*ev.max())) == 3 and err < 1e-10

def cargas(P):
    if len(P) == 3:
        A = 0.5*abs((P[1, 0]-P[0, 0])*(P[2, 1]-P[0, 1]) - (P[2, 0]-P[0, 0])*(P[1, 1]-P[0, 1])); return [Q*A/3]*3
    g = 1/np.sqrt(3); f = np.zeros(4)
    for xi, et in [(-g, -g), (g, -g), (g, g), (-g, g)]:
        N = 0.25*np.array([(1-xi)*(1-et), (1+xi)*(1-et), (1+xi)*(1+et), (1-xi)*(1+et)])
        dx = 0.25*np.array([-(1-et), 1-et, 1+et, -(1+et)]); de = 0.25*np.array([-(1-xi), -(1+xi), 1+xi, 1-xi])
        f += N*Q*abs((dx @ P[:, 0])*(de @ P[:, 1]) - (dx @ P[:, 1])*(de @ P[:, 0]))
    return f

def resolver(caso):
    J = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))["etabs"]
    X = np.array(J["nudos"], float)[:, :2]; n = len(X); D = Dflex(E, NU, T)
    K = np.zeros((3*n, 3*n)); F = np.zeros(3*n)
    for el in J["elementos"]:
        if len(el) not in (3, 4): continue
        xy = X[el]; Ke = dkt_K(xy, D) if len(el) == 3 else dkq_K(xy, D)
        g = [3*i + c for i in el for c in range(3)]; K[np.ix_(g, g)] += Ke
        for i, f in zip(el, cargas(xy)): F[3*i] += f
    fijo = set()
    for i, r in enumerate(J["restricciones"]):
        if r:
            for c, dof in ((2, 0), (3, 1), (4, 2)):     # uz->w, rx->thx, ry->thy
                if r[c]: fijo.add(3*i + dof)
    libre = [i for i in range(3*n) if i not in fijo]
    u = np.zeros(3*n); u[libre] = np.linalg.solve(K[np.ix_(libre, libre)], F[libre])
    R = K @ u - F; sumRz = sum(R[i] for i in fijo if i % 3 == 0)   # reaccion hacia +z
    desplaz = [[0.0, 0.0, u[3*i], u[3*i+1], u[3*i+2], 0.0] for i in range(n)]
    json.dump({"prog": "numpy", "caso": caso, "desplaz": desplaz, "sumRz": sumRz},
              open(os.path.join(DATOS, caso + "_numpy_thin.json"), "w"), indent=1)
    wmax = max(abs(d[2]) for d in J["desplaz"] if d)
    peor = max(abs(u[3*i] - d[2]) / wmax * 100 for i, d in enumerate(J["desplaz"]) if d)
    print("%-22s %3d nudos · sumRz %.3f · w max numpy %.6e ETABS %.6e · peor nudo %.2e %% del max"
          % (caso, n, sumRz, np.abs(u[0::3]).max(), wmax, peor), flush=True)

if __name__ == "__main__":
    autoprueba()
    for caso in [a for a in sys.argv[1:] if not a.startswith("--")] or TODOS: resolver(caso)
