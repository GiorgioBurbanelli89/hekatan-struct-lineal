# -*- coding: utf-8 -*-
"""Paz 6.a ed., Ej. 8.1 (p.196-199) — solución EXACTA por superposición modal (pulso triangular, cada modo
integrado en forma cerrada). Datos: Fig. 7.4 (W10x45 I=248.6, W10x21 I=106.3; p.198-199), W1=52 500, W2=25 500 lb."""
import numpy as np
from scipy.linalg import eigh
m1, m2 = 52500/386.088, 25500/386.088
k1 = 12*30e6*248.6*2/180**3; k2 = 12*30e6*106.3*2/120**3
K = np.array([[k1+k2, -k2], [-k2, k2]]); M = np.diag([m1, m2])
w2, P = eigh(K, M); w = np.sqrt(w2)
F0 = np.array([10000, 20000.]); td = 0.1
t = np.linspace(0, 1, 100001)
def q(wn, P0, t):
    ust = P0/wn**2
    u = ust*(1-np.cos(wn*t)+np.sin(wn*t)/(wn*td)-t/td)
    ud = ust*(1-np.cos(wn*td)+np.sin(wn*td)/(wn*td)-1); vd = ust*(wn*np.sin(wn*td)+(np.cos(wn*td)-1)/td)
    return np.where(t <= td, u, ud*np.cos(wn*(t-td))+vd/wn*np.sin(wn*(t-td)))
u = sum(np.outer(P[:, j], q(w[j], P[:, j] @ F0, t)) for j in range(2))
if __name__ == "__main__":
    print("omega", w, "u1max %.5f u2max %.5f" % (abs(u[0]).max(), abs(u[1]).max()))
    for tt in (0.05, 0.1, 0.2, 0.5, 1.0): i = int(round(tt*1e5)); print(tt, "%.5f %.5f" % (u[0, i], u[1, i]))
