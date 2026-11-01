# -*- coding: utf-8 -*-
"""Modelo multi-elemento de placas (DKT, DKQ, triangulo grueso de CSI). kN y m; GDL por nudo [w, thx, thy].

Usa los K y los momentos YA validados de `placas.py` (signo CSI: M11 = -Mxx). Carga de area uniforme q (kN/m2, +w):
reparto consistente de w por nudo (A/3 en triangulo, A/4 en cuadrilatero) y sin momentos nodales, que es lo que
da la interpolacion lineal/bilineal de w de estos elementos.

    from hekatan_struct.placa_modelo import Placa
    p = Placa.rectangular(4, 4, 8, 8, "dkq", E=2.1e8, nu=0.3, t=0.1)
    p.apoyar_borde("simple"); p.carga_area(-10)       # q hacia -w
    r = p.solve(); r["w"], r["R"], p.momentos_nodales()
"""
from __future__ import annotations

import numpy as np

from . import placas as _pl


class Placa:
    def __init__(self, nodos, elementos, tipo: str, E: float, nu: float, t: float):
        """nodos: (n x 2); elementos: lista de 3 o 4 indices antihorarios; tipo: dkt | dkq | thick.
        dkq exige cuadrilateros; dkt y thick, triangulos."""
        self.nodos = np.asarray(nodos, float).reshape(-1, 2)
        self.elementos = [list(map(int, e)) for e in elementos]
        if tipo not in _pl.TIPOS: raise ValueError("tipo: dkt, dkq o thick")
        n_esp = 4 if tipo == "dkq" else 3
        for e in self.elementos:
            if len(e) != n_esp: raise ValueError("el tipo %s lleva elementos de %d nudos" % (tipo, n_esp))
        self.tipo, self.E, self.nu, self.t = tipo, float(E), float(nu), float(t)
        self.n = len(self.nodos)
        self.fijos: dict = {}                 # gdl global -> 0
        self.F = np.zeros(3 * self.n)
        self.u = None; self.R = None

    # ---------------------------------------------- mallador rectangular
    @staticmethod
    def malla_rectangular(a: float, b: float, nx: int, ny: int, triangulos: bool = False):
        """Rejilla (nx x ny) de [0,a]x[0,b]. Quads antihorarios, o cada quad en 2 triangulos (diagonal alterna)."""
        xs, ys = np.linspace(0, a, nx + 1), np.linspace(0, b, ny + 1)
        nodos = [(x, y) for y in ys for x in xs]
        idx = lambda i, j: j * (nx + 1) + i
        el = []
        for j in range(ny):
            for i in range(nx):
                n1, n2, n3, n4 = idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)
                if not triangulos: el.append([n1, n2, n3, n4])
                elif (i + j) % 2 == 0: el += [[n1, n2, n3], [n1, n3, n4]]
                else: el += [[n1, n2, n4], [n2, n3, n4]]
        return np.array(nodos), el

    @classmethod
    def rectangular(cls, a, b, nx, ny, tipo, E, nu, t):
        nod, el = cls.malla_rectangular(a, b, nx, ny, triangulos=(tipo != "dkq"))
        return cls(nod, el, tipo, E, nu, t)

    # ---------------------------------------------- apoyos y cargas
    def apoyar(self, nodo: int, tipo: str = "simple"):
        """«simple»: w = 0.  «empotrado»: w = thx = thy = 0."""
        g = [3 * nodo] + ([3 * nodo + 1, 3 * nodo + 2] if tipo == "empotrado" else [])
        for k in g: self.fijos[k] = 0.0

    def apoyar_borde(self, tipo: str = "simple", tol: float = 1e-9):
        """Apoya todos los nudos del borde del rectangulo de la malla."""
        x0, y0 = self.nodos.min(0); x1, y1 = self.nodos.max(0)
        for i, (x, y) in enumerate(self.nodos):
            if min(abs(x - x0), abs(x - x1), abs(y - y0), abs(y - y1)) < tol: self.apoyar(i, tipo)

    def carga_nodal(self, nodo: int, Fz: float = 0.0, Mx: float = 0.0, My: float = 0.0):
        """Fuerza en +w (kN) y momentos segun thx, thy (kN m)."""
        self.F[3 * nodo:3 * nodo + 3] += [Fz, Mx, My]

    def area(self, e) -> float:
        P = self.nodos[e]; x, y = P[:, 0], P[:, 1]
        return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))

    def carga_area(self, q: float):
        """Carga uniforme q (kN/m2, positiva hacia +w), consistente: A/nnudos por nudo."""
        for e in self.elementos:
            f = q * self.area(e) / len(e)
            for nd in e: self.F[3 * nd] += f

    # ---------------------------------------------- ensamblaje y solucion
    def _dofs(self, e):
        return np.array([3 * nd + k for nd in e for k in range(3)])

    def K(self) -> np.ndarray:
        K = np.zeros((3 * self.n, 3 * self.n))
        for e in self.elementos:
            d = self._dofs(e)
            K[np.ix_(d, d)] += _pl.rigidez(self.tipo, self.nodos[e], self.E, self.nu, self.t)
        return K

    def solve(self) -> dict:
        if not self.fijos: raise ValueError("faltan apoyos")
        K = self.K(); N = 3 * self.n
        lib = np.array([i for i in range(N) if i not in self.fijos])
        u = np.zeros(N)
        u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], self.F[lib])
        R = K @ u - self.F
        R[lib] = 0.0                           # reaccion solo en gdl apoyados
        self.u, self.R = u, R
        return {"u": u, "w": u[0::3], "tx": u[1::3], "ty": u[2::3], "R": R.reshape(-1, 3),
                "sumRz": float(R[0::3].sum()), "carga_total": float(self.F[0::3].sum())}

    # ---------------------------------------------- momentos
    def momentos_elemento(self, k: int) -> dict:
        e = self.elementos[k]
        return _pl.momentos(self.tipo, self.nodos[e], self.E, self.nu, self.t, self.u[self._dofs(e)])

    def momentos_nodales(self) -> np.ndarray:
        """M11, M22, M12 (signo CSI) por nudo: media de los elementos que lo comparten (n x 3)."""
        S = np.zeros((self.n, 3)); c = np.zeros(self.n)
        for k, e in enumerate(self.elementos):
            M = self.momentos_elemento(k)["M"]
            for j, nd in enumerate(e): S[nd] += M[j]; c[nd] += 1
        return S / c[:, None]

    def nodo_cercano(self, x: float, y: float) -> int:
        return int(np.argmin(np.hypot(self.nodos[:, 0] - x, self.nodos[:, 1] - y)))

    # ---------------------------------------------- PNG
    def png(self, ruta: str, que: str = "w"):
        """que: «w» (deformada con color) o «M11», «M22», «M12» (mapa nodal promediado)."""
        import matplotlib; matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        import matplotlib.tri as mtri
        tris = []
        for e in self.elementos: tris += [e] if len(e) == 3 else [[e[0], e[1], e[2]], [e[0], e[2], e[3]]]
        tri = mtri.Triangulation(self.nodos[:, 0], self.nodos[:, 1], triangles=tris)
        z = self.u[0::3] if que == "w" else self.momentos_nodales()[:, ("M11", "M22", "M12").index(que)]
        fig, ax = plt.subplots(figsize=(7, 5.6), dpi=140)
        cs = ax.tricontourf(tri, z, levels=24, cmap="jet"); cb = fig.colorbar(cs, ax=ax)
        cb.set_label("w (m)" if que == "w" else "%s (kN·m/m)" % que)
        for e in self.elementos:
            c = self.nodos[e + e[:1]]; ax.plot(c[:, 0], c[:, 1], "k-", lw=0.4)
        ax.set_aspect("equal"); ax.set_xlabel("x (m)"); ax.set_ylabel("y (m)")
        ax.set_title("%s · %s · %d elementos" % (que, self.tipo.upper(), len(self.elementos)), fontsize=9)
        fig.tight_layout(); fig.savefig(ruta); plt.close(fig); return ruta
