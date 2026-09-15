# -*- coding: utf-8 -*-
r"""EL MIN4 (Tessler-Hughes), traducido del FUENTE de MYSTRAN.

Fuente: `MYSTRAN-estudio/MYSTRANSolver-main/Source/EMG/` (Fortran, licencia MIT)

    EMG7/MIN4SH.f90   las funciones de forma «constrained» (NXSH, NYSH)
    EMG6/BBMIN4.f90   la B de flexion
    EMG6/BSMIN4.f90   la B de cortante
    EMG4/QPLT2.f90    el ensamblaje

Es la escuela **NASTRAN**, independiente de Berkeley/CSI, y su elemento tiene
las mismas piezas que el DSE — lo que lo hace un tercer punto de vista sobre el
mismo problema:

  * las MISMAS cuadraticas de lado:
        N5 = (1-r^2)(1-s)/2   N6 = (1-s^2)(1+r)/2
        N7 = (1-r^2)(1+s)/2   N8 = (1-s^2)(1-r)/2
  * el MISMO 1/8 con las diferencias de coordenadas del lado:
        NXSH(1) = (-Y41*N8 + Y12*N5)/8      con Xij = Xi - Xj
    que es la ec. (3.12) de Ibrahimbegovic.

DONDE SE SEPARA de todos los demas, y es su truco anti-bloqueo: un FACTOR
ESCALAR que relaja el cortante, sacado de la propia matriz (CALC_PHI_SQ.f90):

    PSI_HAT = BENSUM / SHRSUM               BENSUM = SUM diag(KB)
    PHI_SQ  = C*PSI_HAT / (1 + C*PSI_HAT)   SHRSUM = SUM diag(KS) en los giros
    KE      = KB + PHI_SQ * KS              C = CBMIN4 = 3.6  (Tessler-Hughes)

`PHI_SQ` vale entre 0 y 1: con placa gruesa el cortante manda y se relaja; con
placa fina tiende a 1. Mismo papel que el `phi_k` del DKMQ, pero medido de la
matriz en vez de calculado de la geometria.

⚠️ NOTA sobre `QPLT2.f90` lineas 337-365: ahi la B de cortante se PROMEDIA
(`BS = SUM(detJ*BS_pt)/SUM(detJ)`), pero **ese es el camino alternativo**
(`IORQ2T == 0`). El normal integra punto a punto. Probado el promediado: deja
**5 modos nulos** (dos mecanismos) y bloquea — no es lo que usa el elemento.
"""
import numpy as np

G2 = 1/np.sqrt(3.0)
GAUSS2 = [(-G2, -G2, 1.0), (G2, -G2, 1.0), (G2, G2, 1.0), (-G2, G2, 1.0)]
_A = np.sqrt(7.0/9.0); _B = np.sqrt(7.0/15.0)
ITW8 = [(-_A, -_A, 9/49.), (_A, -_A, 9/49.), (_A, _A, 9/49.), (-_A, _A, 9/49.),
        (0., -_B, 40/49.), (_B, 0., 40/49.), (0., _B, 40/49.), (-_B, 0., 40/49.)]


def N4(r, s):
    return np.array([(1-r)*(1-s), (1+r)*(1-s), (1+r)*(1+s), (1-r)*(1+s)])/4.0


def dN4(r, s):
    return (np.array([-(1-s), (1-s), (1+s), -(1+s)])/4.0,
            np.array([-(1-r), -(1+r), (1+r), (1-r)])/4.0)


def min4sh(r, s, XSD, YSD):
    """MIN4SH.f90: NXSH, NYSH y sus derivadas naturales. XSD[k]=Xi-Xj del lado k."""
    X12, X23, X34, X41 = XSD
    Y12, Y23, Y34, Y41 = YSD
    xm, xp = 1-r, 1+r
    ym, yp = 1-s, 1+s
    x2m, y2m = 1-r*r, 1-s*s
    N5, N6, N7, N8 = x2m*ym/2, y2m*xp/2, x2m*yp/2, y2m*xm/2
    N5X, N6X, N7X, N8X = -r*ym,  y2m/2, -r*yp, -y2m/2
    N5Y, N6Y, N7Y, N8Y = -x2m/2, -s*xp,  x2m/2, -s*xm
    NX = np.array([(-Y41*N8 + Y12*N5), (-Y12*N5 + Y23*N6),
                   (-Y23*N6 + Y34*N7), (-Y34*N7 + Y41*N8)])/8.0
    NY = np.array([(-X41*N8 + X12*N5), (-X12*N5 + X23*N6),
                   (-X23*N6 + X34*N7), (-X34*N7 + X41*N8)])/8.0
    dNXr = np.array([(-Y41*N8X + Y12*N5X), (-Y12*N5X + Y23*N6X),
                     (-Y23*N6X + Y34*N7X), (-Y34*N7X + Y41*N8X)])/8.0
    dNXs = np.array([(-Y41*N8Y + Y12*N5Y), (-Y12*N5Y + Y23*N6Y),
                     (-Y23*N6Y + Y34*N7Y), (-Y34*N7Y + Y41*N8Y)])/8.0
    dNYr = np.array([(-X41*N8X + X12*N5X), (-X12*N5X + X23*N6X),
                     (-X23*N6X + X34*N7X), (-X34*N7X + X41*N8X)])/8.0
    dNYs = np.array([(-X41*N8Y + X12*N5Y), (-X12*N5Y + X23*N6Y),
                     (-X23*N6Y + X34*N7Y), (-X34*N7Y + X41*N8Y)])/8.0
    return NX, NY, (dNXr, dNXs), (dNYr, dNYs)


CBMIN = 3.6          # CBMIN4 de PARAMS.f90 = THREEP6, el factor de Tessler-Hughes


def K_MIN4(pts, E, nu, t, kappa=5.0/6.0, rule=GAUSS2):
    """K 12x12 en GDL [w, theta_x, theta_y] por nudo.  KE = KB + PHI_SQ*KS."""
    x = np.array([p[0] for p in pts], float)
    y = np.array([p[1] for p in pts], float)
    # XSD(k) = Xi - Xj  del lado k (1-2, 2-3, 3-4, 4-1)
    XSD = np.array([x[0]-x[1], x[1]-x[2], x[2]-x[3], x[3]-x[0]])
    YSD = np.array([y[0]-y[1], y[1]-y[2], y[2]-y[3], y[3]-y[0]])
    D0 = E*t**3/(12*(1-nu*nu))
    Db = np.array([[D0, nu*D0, 0], [nu*D0, D0, 0], [0, 0, D0*(1-nu)/2]])
    Ds = np.eye(2)*(kappa*E*t/(2*(1+nu)))

    # ── flexion: BBMIN4.f90 (theta bilineal) ───────────────────────────
    K = np.zeros((12, 12))
    for (r, s, w) in rule:
        dr, ds = dN4(r, s)
        J = np.array([[dr@x, dr@y], [ds@x, ds@y]])
        dJ = abs(np.linalg.det(J)); Ji = np.linalg.inv(J)
        gx = Ji[0, 0]*dr + Ji[0, 1]*ds
        gy = Ji[1, 0]*dr + Ji[1, 1]*ds
        BB = np.zeros((3, 12))
        for i in range(4):
            tx, ty = 3*i+1, 3*i+2
            BB[1, tx] = -gy[i]; BB[2, tx] = -gx[i]
            BB[0, ty] = gx[i];  BB[2, ty] = gy[i]
        K += BB.T@Db@BB*dJ*w

    # ── cortante: BSMIN4.f90, integrado PUNTO A PUNTO (QPLT2, IORQ2T>0)
    KS = np.zeros((12, 12))
    for (r, s, w) in rule:
        N = N4(r, s); dr, ds = dN4(r, s)
        J = np.array([[dr@x, dr@y], [ds@x, ds@y]])
        dJ = abs(np.linalg.det(J)); Ji = np.linalg.inv(J)
        gx = Ji[0, 0]*dr + Ji[0, 1]*ds
        gy = Ji[1, 0]*dr + Ji[1, 1]*ds
        NX, NY, (dNXr, dNXs), (dNYr, dNYs) = min4sh(r, s, XSD, YSD)
        nxx = Ji[0, 0]*dNXr + Ji[0, 1]*dNXs
        nxy = Ji[1, 0]*dNXr + Ji[1, 1]*dNXs
        nyx = Ji[0, 0]*dNYr + Ji[0, 1]*dNYs
        nyy = Ji[1, 0]*dNYr + Ji[1, 1]*dNYs
        BS = np.zeros((2, 12))
        for i in range(4):
            w_, tx, ty = 3*i, 3*i+1, 3*i+2
            BS[0, w_] = gx[i];         BS[1, w_] = gy[i]
            BS[0, tx] = -nxx[i];       BS[1, tx] = -nxy[i] - N[i]
            BS[0, ty] = nyx[i] + N[i]; BS[1, ty] = nyy[i]
        KS += BS.T@Ds@BS*dJ*w

    # ── el factor de cortante de Tessler-Hughes (CALC_PHI_SQ.f90) ──────
    #   BENSUM  = suma de la diagonal de KB
    #   SHRSUM  = suma de la diagonal de KS SOLO en los GDL de rotacion
    #   PSI_HAT = BENSUM / SHRSUM
    #   PHI_SQ  = CBMIN*PSI_HAT / (1 + CBMIN*PSI_HAT)     con CBMIN4 = 3.6
    rot = [1, 2, 4, 5, 7, 8, 10, 11]
    bensum = sum(K[i, i] for i in rot)
    shrsum = sum(KS[i, i] for i in rot)
    psi = bensum/shrsum if abs(shrsum) > 0 else 0.0
    phisq = CBMIN*psi/(1.0 + CBMIN*psi)
    K = K + phisq*KS
    return (K+K.T)/2


if __name__ == "__main__":
    np.set_printoptions(precision=4, suppress=True, linewidth=200)
    pts = [(0, 0), (1, 0), (1, 1), (0, 1)]
    E, nu = 2.2e7, 0.2
    print("  MIN4 de MYSTRAN — control: 3 modos nulos y limite delgado")
    for t in (0.2, 0.02, 0.002):
        K = K_MIN4(pts, E, nu, t); D = E*t**3/(12*(1-nu*nu))
        w = np.sort(np.linalg.eigvalsh(K))
        n = int((np.abs(w) < 1e-8*abs(w[-1])).sum())
        print("   t=%-6s nulos=%d  %s" % (t, n, " ".join("%9.4f" % z for z in w[3:]/D)))
