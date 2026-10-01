# Cortante V13/V23 de CSI (Shell-Thin): qué receta reproduce los joints de SAP2000 con SUS desplazamientos.
import json, sys, math
import numpy as np
D = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "sonda_thin.json"))
N = np.array(D["nodes"]); E, nu, t = D["E"], D["nu"], D["t"]
D0 = E * t**3 / (12 * (1 - nu**2)); Db = np.array([[D0, D0*nu, 0], [D0*nu, D0, 0], [0, 0, D0*(1-nu)/2]])

def serendip8(xi, et):
    dNxi = np.zeros(8); dNet = np.zeros(8); xn = [-1, 1, 1, -1]; yn = [-1, -1, 1, 1]
    for i in range(4):
        xx, yy = xn[i]*xi, yn[i]*et
        dNxi[i] = 0.25*xn[i]*(1+yy)*(2*xx+yy); dNet[i] = 0.25*yn[i]*(1+xx)*(xx+2*yy)
    dNxi[4] = -xi*(1-et); dNet[4] = -0.5*(1-xi*xi)
    dNxi[5] = 0.5*(1-et*et); dNet[5] = -et*(1+xi)
    dNxi[6] = -xi*(1+et); dNet[6] = 0.5*(1-xi*xi)
    dNxi[7] = -0.5*(1-et*et); dNet[7] = -et*(1-xi)
    return dNxi, dNet

def jac(xl, yl, xi, et):
    dNx4 = np.array([-(1-et), (1-et), (1+et), -(1+et)])/4; dNy4 = np.array([-(1-xi), -(1+xi), (1+xi), (1-xi)])/4
    J = np.array([[dNx4@xl, dNx4@yl], [dNy4@xl, dNy4@yl]]); return J

def dkqB(xl, yl, xi, et):
    ak=[];bk=[];ck=[];dk=[];ek=[]
    for k in range(4):
        i, j = k, (k+1) % 4; xij = xl[i]-xl[j]; yij = yl[i]-yl[j]; l2 = xij*xij+yij*yij
        ak.append(-xij/l2); bk.append(0.75*xij*yij/l2); ck.append((0.25*xij*xij-0.5*yij*yij)/l2); dk.append(-yij/l2); ek.append((0.25*yij*yij-0.5*xij*xij)/l2)
    dNxi, dNet = serendip8(xi, et)
    Ji = np.linalg.inv(jac(xl, yl, xi, et))
    Hx_x=np.zeros(12);Hx_e=np.zeros(12);Hy_x=np.zeros(12);Hy_e=np.zeros(12)
    for i in range(4):
        kp=(i+3)%4; kn=i; mp=4+kp; mn=4+kn
        c0x=1.5*(ak[kn]*dNxi[mn]-ak[kp]*dNxi[mp]); c0e=1.5*(ak[kn]*dNet[mn]-ak[kp]*dNet[mp])
        c1x=bk[kn]*dNxi[mn]+bk[kp]*dNxi[mp]; c1e=bk[kn]*dNet[mn]+bk[kp]*dNet[mp]
        c2x=dNxi[i]-ck[kn]*dNxi[mn]-ck[kp]*dNxi[mp]; c2e=dNet[i]-ck[kn]*dNet[mn]-ck[kp]*dNet[mp]
        Hx_x[3*i:3*i+3]=[c0x,c1x,c2x]; Hx_e[3*i:3*i+3]=[c0e,c1e,c2e]
        d0x=1.5*(dk[kn]*dNxi[mn]-dk[kp]*dNxi[mp]); d0e=1.5*(dk[kn]*dNet[mn]-dk[kp]*dNet[mp])
        d1x=-dNxi[i]+ek[kn]*dNxi[mn]+ek[kp]*dNxi[mp]; d1e=-dNet[i]+ek[kn]*dNet[mn]+ek[kp]*dNet[mp]
        Hy_x[3*i:3*i+3]=[d0x,d1x,-c1x]; Hy_e[3*i:3*i+3]=[d0e,d1e,-c1e]
    HxX=Ji[0,0]*Hx_x+Ji[0,1]*Hx_e; HxY=Ji[1,0]*Hx_x+Ji[1,1]*Hx_e
    HyX=Ji[0,0]*Hy_x+Ji[0,1]*Hy_e; HyY=Ji[1,0]*Hy_x+Ji[1,1]*Hy_e
    return np.array([HxX, HyY, HxY+HyX])

U = {int(k): v for k, v in D["U"].items()}
def u12(e, mapa):
    out = []
    for n in e:
        w, rx, ry = U[n][2], U[n][3], U[n][4]
        out += mapa(w, rx, ry)
    return np.array(out)

def Mfield(xl, yl, u, xi, et): return -(Db @ (dkqB(xl, yl, xi, et) @ u))   # signo de CSI

esq = [(-1,-1),(1,-1),(1,1),(-1,1)]; g = 1/math.sqrt(3)
def ext(vals):   # de los 4 Gauss a las esquinas (bilineal)
    out = []
    for r, s in esq:
        R, S_ = r*math.sqrt(3), s*math.sqrt(3)
        out.append(sum(((1+a*R)*(1+b*S_)/4)*vals[k] for k, (a, b) in enumerate(esq)))
    return out

def grad(xl, yl, u, xi, et, h=1e-5):
    dMx = (Mfield(xl, yl, u, xi+h, et) - Mfield(xl, yl, u, xi-h, et))/(2*h)
    dMe = (Mfield(xl, yl, u, xi, et+h) - Mfield(xl, yl, u, xi, et-h))/(2*h)
    Ji = np.linalg.inv(jac(xl, yl, xi, et))
    dX = Ji[0,0]*dMx + Ji[0,1]*dMe; dY = Ji[1,0]*dMx + Ji[1,1]*dMe
    return np.array([dX[0] + dY[2], dY[1] + dX[2]])   # Vx = dMx/dx + dMxy/dy ; Vy = dMy/dy + dMxy/dx

ref = {}
for f in D["shell"]: ref[(f["area"], f["pt"])] = f
mapas = {"rx,ry": lambda w, rx, ry: [w, rx, ry], "ry,-rx": lambda w, rx, ry: [w, ry, -rx], "-ry,rx": lambda w, rx, ry: [w, -ry, rx], "-rx,-ry": lambda w, rx, ry: [w, -rx, -ry]}
for nm, mp in mapas.items():
    errM = 0; mref = 0
    for a, e in enumerate(D["els"]):
        xl = N[e, 0]; yl = N[e, 1]; u = u12(e, mp)
        Mg = [Mfield(xl, yl, u, r*g, s*g) for r, s in esq]; Mj = ext(Mg)
        for k, n in enumerate(e):
            f = ref[(a, n)]
            for c, key in enumerate(("M11", "M22", "M12")): errM = max(errM, abs(Mj[k][c] - f[key])); mref = max(mref, abs(f[key]))
    print("mapa", nm, "error M (Gauss extrapolado) %.3e de %.3f" % (errM, mref))

# ── cortante: recetas candidatas, con el mapa bueno (rx, ry) ──
mp = mapas["rx,ry"]
def bilin_grad(xl, yl, Mj, xi, et):
    # campo BILINEAL por las 4 esquinas (Mj), derivado en (xi, et)
    dN = np.array([[-(1-et), (1-et), (1+et), -(1+et)], [-(1-xi), -(1+xi), (1+xi), (1-xi)]])/4
    Ji = np.linalg.inv(jac(xl, yl, xi, et)); Mj = np.array(Mj)
    dxi = dN[0] @ Mj; det = dN[1] @ Mj
    dX = Ji[0,0]*dxi + Ji[0,1]*det; dY = Ji[1,0]*dxi + Ji[1,1]*det
    return np.array([dX[0] + dY[2], dY[1] + dX[2]])
recetas = {
  "A derivada en la esquina": lambda xl, yl, u, Mj: [grad(xl, yl, u, r, s) for r, s in esq],
  "B derivada en Gauss, extrapolada": lambda xl, yl, u, Mj: ext([grad(xl, yl, u, r*g, s*g) for r, s in esq]),
  "C constante (centro)": lambda xl, yl, u, Mj: [grad(xl, yl, u, 0, 0)]*4,
  "D bilineal de los joints, en la esquina": lambda xl, yl, u, Mj: [bilin_grad(xl, yl, Mj, r, s) for r, s in esq],
  "E bilineal de los joints, en el centro": lambda xl, yl, u, Mj: [bilin_grad(xl, yl, Mj, 0, 0)]*4,
  "F media de Gauss": lambda xl, yl, u, Mj: [sum(grad(xl, yl, u, r*g, s*g) for r, s in esq)/4]*4,
}
for nm, f in recetas.items():
    for sg in (1, -1):
        err = 0; vref = 0
        for a, e in enumerate(D["els"]):
            xl = N[e,0]; yl = N[e,1]; u = u12(e, mp)
            Mj = ext([Mfield(xl, yl, u, r*g, s*g) for r, s in esq])
            V = f(xl, yl, u, Mj)
            for k, n in enumerate(e):
                fr = ref[(a, n)]
                err = max(err, abs(sg*V[k][0]-fr["V13"]), abs(sg*V[k][1]-fr["V23"])); vref = max(vref, abs(fr["V13"]), abs(fr["V23"]))
        print("%-42s signo %+d: error %.3e de %.3f" % (nm, sg, err, vref))
fr = [x for x in D["shell"] if x["area"] == 7]; print("SAP área 7:", [(x["pt"], round(x["V13"], 4), round(x["V23"], 4)) for x in fr])
