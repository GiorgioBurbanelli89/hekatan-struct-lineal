# -*- coding: utf-8 -*-
r"""TAMIZ 3 · descomponer el RESTO en los cuatro vectores que ya tienen nombre.

El resto  R = K_medida - K_DSE  tiene rango 4 (medido) en cuadrado, rectangulo,
paralelogramo y trapecio. Y los cuatro modos ya tienen nombre:

    phi      giros que se ABREN desde el centro     tx = x-xc, ty = y-yc, w = 0
    w_hg     reloj de arena del desplazamiento w    w = h,  h = (1,-1,1,-1)
    tx_hg    reloj de arena de theta_x
    ty_hg    reloj de arena de theta_y

Proyectar sobre UNO solo (cociente de Rayleigh) no vale en trapecios: ahi dejan
de ser autovectores y se mezclan — es lo que hacia parecer que la ley se
desplomaba. Lo correcto es preguntar por el SUBESPACIO:

    ¿cuanto de R vive en span{phi, w_hg, tx_hg, ty_hg}?      -> residuo
    y dentro, ¿que matriz 4x4 es?                            -> C = U^T R U

Si el residuo es pequenno, el resto queda descrito por unos pocos numeros con
nombre, en cualquier geometria. Los relojes de arena hay que ORTOGONALIZARLOS
contra {1, x, y}: si no, llevan parte lineal y contaminan (el mismo error que
daba MAC 0.5 con phi sin centrar).
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
H = np.array([1.0, -1.0, 1.0, -1.0])


def base_vectores(pts):
    """[phi, w_hg, tx_hg, ty_hg] en GDL (w, tx, ty) por nudo, 12 componentes."""
    P = np.asarray(pts, float)
    xc, yc = P.mean(axis=0)
    x = P[:, 0]-xc; y = P[:, 1]-yc
    # reloj de arena ORTOGONALIZADO contra {1, x, y} (Flanagan-Belytschko)
    A = np.column_stack([np.ones(4), x, y])
    h = H - A@np.linalg.lstsq(A, H, rcond=None)[0]
    if np.linalg.norm(h) > 1e-12:
        h = h/np.linalg.norm(h)
    V = np.zeros((12, 4))
    for i in range(4):
        V[3*i+1, 0] = x[i]; V[3*i+2, 0] = y[i]        # phi
        V[3*i+0, 1] = h[i]                            # w_hg
        V[3*i+1, 2] = h[i]                            # tx_hg
        V[3*i+2, 3] = h[i]                            # ty_hg
    return V/np.linalg.norm(V, axis=0)


def analiza(K, pts, E, nu, t, etq):
    D = E*t**3/(12*(1-nu*nu))
    R = (K - K_DSE(pts, E, nu, t)); R = (R+R.T)/2
    V = base_vectores(pts)
    U, _ = np.linalg.qr(V)                    # base ortonormal del subespacio
    P = U@U.T
    res = np.linalg.norm(R - P@R@P)/np.linalg.norm(R)*100
    C = U.T@R@U                               # el resto DENTRO del subespacio
    # y los coeficientes en la base con NOMBRE (no ortogonal): R ~ V S V^T
    G = np.linalg.pinv(V)                     # 4x12
    S = G@R@G.T
    return D, res, np.diag(S)/D, C, R


print("=" * 100)
print("  ¿Cuanto del RESTO vive en span{phi, w_hg, tx_hg, ty_hg}?")
print("=" * 100)

# ── control: el cuadrado con nu=0 ───────────────────────────────────────
d = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
v = d["entera"]
K = np.array(v["K"], float); K = (K+K.T)/2
D, res, S, C, R = analiza(K, v["pts"], v["E"], v["nu"], v["t"], "cuadrado")
print("\n  CUADRADO (nu=0, t=0.2)   fuera del subespacio: %.4f %%" % res)
print("     coeficientes / D :  phi=%9.4f  w_hg=%9.4f  tx_hg=%7.4f  ty_hg=%7.4f"
      % tuple(S))
print("     autovalores de R/D  : %s"
      % " ".join("%8.3f" % z for z in np.sort(np.linalg.eigvalsh(R))[::-1][:5]/D))

# ── los 27 trapecios ────────────────────────────────────────────────────
tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
print("\n" + "=" * 100)
print("  TRAPECIOS")
print("=" * 100)
print("  %-12s %5s %6s %8s   %10s %10s %8s %8s"
      % ("caso", "d", "t", "fuera%", "phi/D", "w_hg/D", "tx_hg/D", "ty_hg/D"))
tabla = {}
for k in sorted(tr):
    v = tr[k]
    K = np.array(v["K"], float); K = (K+K.T)/2
    D, res, S, C, R = analiza(K, v["pts"], v["E"], v["nu"], v["t"], k)
    tabla.setdefault(v["t"], {})[v["d"]] = S
    print("  %-12s %5.2f %6.2f %7.3f%%   %10.3f %10.3f %8.4f %8.4f"
          % (k, v["d"], v["t"], res, S[0], S[1], S[2], S[3]))

print("\n  phi/D  ya separado del modo de w  (antes, por Rayleigh, se mezclaban)")
ts = sorted(tabla); ds = sorted(tabla[ts[0]])
print("  %-6s %s" % ("d\\t", " ".join("%10.2f" % z for z in ts)))
for dd in ds:
    print("  %-6.2f %s" % (dd, " ".join("%10.3f" % tabla[z][dd][0] for z in ts)))
