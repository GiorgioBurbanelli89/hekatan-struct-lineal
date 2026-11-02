# Patch test 2-001 de SAP2000 contra el motor de PYTHON.
import os
import sys, numpy as np
sys.path.insert(0, os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\hekatan-struct-py\src")
from hekatan_struct.elements.shell_q4_motor import _k_flexion

X = [0, 0, 0.04, 0.08, 0.18, 0.16, 0.24, 0.24]
Y = [0, 0.12, 0.02, 0.08, 0.03, 0.08, 0, 0.12]
CONN = [(1,0,2,3),(0,6,4,2),(6,7,5,4),(7,1,3,5),(2,4,5,3)]
E, nu, t = 1e6, 0.25, 0.001

K = np.zeros((24,24))     # 8 nudos x 3 gdl (w, thx, thy)
for e,c in enumerate(CONN):
    cx = sum(X[i] for i in c)/4; cy = sum(Y[i] for i in c)/4
    x = np.array([X[i]-cx for i in c]); y = np.array([Y[i]-cy for i in c])
    # el motor Python trabaja en el marco local; aqui el elemento es plano y
    # los ejes locales coinciden con los globales salvo traslacion
    Ke = _k_flexion(x, y, E, nu, t)
    for a in range(4):
        for b in range(4):
            K[c[a]*3:c[a]*3+3, c[b]*3:c[b]*3+3] += Ke[a*3:a*3+3, b*3:b*3+3]

# campo teorico: w, thx=+dw/dy, thy=-dw/dx  (convencion del motor)
ut = np.zeros(24)
for n in range(8):
    xx, yy = X[n], Y[n]
    ut[n*3+0] = 1e-3*(xx*xx+xx*yy+yy*yy)/2
    # ⚠️ el motor Python usa PENDIENTES: [w, βx, βy] con βx=∂w/∂x, βy=∂w/∂y
    ut[n*3+1] = 1e-3*(xx+yy/2)
    ut[n*3+2] = 1e-3*(xx/2+yy)

fijo = np.zeros(24, bool)
for n in (0,1,6,7): fijo[n*3:n*3+3] = True
libre = ~fijo
uf = np.linalg.solve(K[np.ix_(libre,libre)], -K[np.ix_(libre,fijo)] @ ut[fijo])
u = ut.copy(); u[libre] = uf
err = np.abs(u-ut); ref = np.maximum(np.abs(ut), 1e-6)
print("peor error relativo interior = %.4e %%" % (100*np.max(err[libre]/ref[libre])))
r = K @ ut
print("||K u_teorico||_libres / (||K|| ||u||) = %.3e"
      % (np.linalg.norm(r[libre])/(np.linalg.norm(K)*np.linalg.norm(ut))))
