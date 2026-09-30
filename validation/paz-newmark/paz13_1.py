# -*- coding: utf-8 -*-
"""Paz 6.a ed., Ej. 13.1 (p.342-346): SpaceFrameElement + SpaceFrameConsMass, 4 barras, libres los 6 GDL del nudo 1.
La T de SpaceFrameConsMass del libro deja SIN rellenar el bloque [1:3] (traslaciones del nudo i): aquí va completa
(`--bug-libro` la reproduce). Carga F = 5000 lb en uz del nudo 1 durante 0.1 s; ξ = 0."""
import sys, numpy as np
from scipy.linalg import eigh
E, G = 30e6, 12e6
P1 = dict(A=50, Iz=200, Iy=200, J=40, m=0.2, I0=205); P2 = dict(A=28, Iz=64, Iy=64, J=12.8, m=0.1, I0=68)
nodes = np.array([[0, 0, 0], [0, 0, -200], [0, 200, 0], [-200, 0, 0], [0, -200, 0]], float)
conn = [(0, 1, 2, P1), (0, 2, 1, P2), (0, 3, 1, P1), (0, 4, 1, P2)]
BUG = "--bug-libro" in sys.argv
def TT(c, full=True):
    n1, n2, n3 = nodes[c[0]], nodes[c[1]], nodes[c[2]]; L = np.linalg.norm(n2 - n1); ex = (n2 - n1) / L
    ey = np.cross(n3 - n1, n2 - n1); ey /= np.linalg.norm(ey); ez = np.cross(ex, ey); H = np.array([ex, ey, ez])
    T = np.zeros((12, 12))
    for b in range(4):
        if b == 0 and not full: continue
        T[3*b:3*b+3, 3*b:3*b+3] = H
    return T, L
def kloc(p, L):
    EA, EIz, EIy, GJ = E*p["A"], E*p["Iz"], E*p["Iy"], G*p["J"]; k = np.zeros((12, 12))
    k[0,0]=k[6,6]=EA/L; k[0,6]=k[6,0]=-EA/L; k[3,3]=k[9,9]=GJ/L; k[3,9]=k[9,3]=-GJ/L
    for (a,b,c,d,EI,s) in ((1,5,7,11,EIz,1),(2,4,8,10,EIy,-1)):
        kk = EI/L**3*np.array([[12,6*L*s,-12,6*L*s],[6*L*s,4*L*L,-6*L*s,2*L*L],[-12,-6*L*s,12,-6*L*s],[6*L*s,2*L*L,-6*L*s,4*L*L]])
        idx=[a,b,c,d]; k[np.ix_(idx,idx)] += kk
    return k
def mloc(p, L):
    r = p["I0"]/p["A"]; m = np.zeros((12, 12))
    m[0,0]=m[6,6]=140; m[0,6]=m[6,0]=70; m[3,3]=m[9,9]=140*r; m[3,9]=m[9,3]=70*r
    for (a,b,c,d,s) in ((1,5,7,11,1),(2,4,8,10,-1)):
        mm = np.array([[156,22*L*s,54,-13*L*s],[22*L*s,4*L*L,13*L*s,-3*L*L],[54,13*L*s,156,-22*L*s],[-13*L*s,-3*L*L,-22*L*s,4*L*L]])
        idx=[a,b,c,d]; m[np.ix_(idx,idx)] += mm
    return p["m"]*L/420*m
K = np.zeros((30, 30)); M = np.zeros((30, 30))
for c in conn:
    T, L = TT(c); Tm, _ = TT(c, full=not BUG); p = c[3]
    g = list(range(6*c[0], 6*c[0]+6)) + list(range(6*c[1], 6*c[1]+6))
    K[np.ix_(g, g)] += T.T @ kloc(p, L) @ T; M[np.ix_(g, g)] += Tm.T @ mloc(p, L) @ Tm
Kf, Mf = K[:6, :6], M[:6, :6]
if __name__ == "__main__":
    w2 = eigh(Kf, Mf, eigvals_only=True) if not BUG else np.sort(np.linalg.eigvals(np.linalg.pinv(Mf) @ Kf).real)
    print("f (Hz):", np.round(np.sqrt(np.abs(w2))/2/np.pi, 4))
    F = np.zeros(6); F[2] = 5000
    for dt in (1e-5,):
        n = int(0.5/dt); u = np.zeros(6); v = np.zeros(6); a = np.linalg.solve(Mf, F); Ks = Kf+4/dt**2*Mf; Ki = np.linalg.inv(Ks); us=[0.0]; um=np.zeros(6)
        for s in range(1, n+1):
            f = F if s*dt <= 0.1 else 0*F
            u1 = Ki@(f+Mf@(4/dt**2*u+4/dt*v+a)); a1 = 4/dt**2*(u1-u)-4/dt*v-a; v = v+dt/2*(a+a1); u = u1; a = a1; us.append(u[2]); um = np.maximum(um, abs(u))
        print("dt", dt, "max |u| nudo 1 [ux uy uz rx ry rz]:", ["%.4e" % x for x in um], " u_st uz:", "%.4e" % np.linalg.solve(Kf, F)[2])
