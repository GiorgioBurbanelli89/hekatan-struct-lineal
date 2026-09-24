# -*- coding: utf-8 -*-
"""Quinto juez: FEniCS (dolfinx 0.10, en la maquina virtual WSL Ubuntu). FEniCS NO trae DKQ/DKT, asi
que no resuelve la malla de ETABS: resuelve la PLACA CONTINUA de Kirchhoff con Lagrange P2 y
C0 interior penalty (Engel et al. 2002; Brenner & Sung 2005) en mallas cada vez mas finas, con la
MISMA geometria (contorno + huecos), los MISMOS nudos apoyados (w = 0) y la MISMA carga.
Dice hacia donde CONVERGE la flecha: el error de discretizacion de la malla de 1.25 m.

    wsl -d Ubuntu -- python3 fenics_kirchhoff_cip.py            # los 7 casos, h = 0.5 / 0.25 / 0.125
    wsl -d Ubuntu -- python3 fenics_kirchhoff_cip.py losa_T

Energia (bordes libres = sin terminos de contorno), M(w) = D[(1-nu) grad grad w + nu lap w I]:
  a(w,v) = ∫ M(w):∇∇v − ∫_Fi {M_nn(w)}[∂n v] − ∫_Fi [∂n w]{M_nn(v)} + ∫_Fi (α D/h)[∂n w][∂n v]
Sale ../isse/automesh/etabs_poligono/<caso>_fenics.json (w en los nudos de ETABS y flecha maxima por h).
"""
import json, os, sys
import numpy as np
import gmsh, ufl
from mpi4py import MPI
from dolfinx import fem, geometry
from dolfinx.io import gmsh as gmshio
from dolfinx.fem.petsc import LinearProblem

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.normpath(os.path.join(AQUI, "..", "isse", "automesh", "etabs_poligono"))
TODOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"]
E, NU, T, Q, ALFA = 25e6, 0.2, 0.20, -10.0, 8.0
D = E * T**3 / (12 * (1 - NU**2))

def sobre(p, a, b, tol=1e-7):
    ab, ap = np.subtract(b, a), np.subtract(p, a); L2 = ab @ ab; s = (ap @ ab) / L2
    return 1e-9 < s < 1 - 1e-9 and np.linalg.norm(ap - s * ab) < tol, s

def lazo_con_apoyos(poli, apoyos):
    """Mete en el poligono los apoyos que caen SOBRE sus lados, para que sean vertices de la malla."""
    out = []
    for i, a in enumerate(poli):
        b = poli[(i + 1) % len(poli)]; out.append(tuple(a))
        dentro = sorted((s, tuple(p)) for p in apoyos for ok, s in [sobre(p, a, b)] if ok)
        out += [p for _, p in dentro]
    return out

def malla(contorno, huecos, apoyos, h):
    gmsh.initialize(); gmsh.option.setNumber("General.Terminal", 0); gmsh.model.add("losa")
    def lazo(poli):
        ps = [gmsh.model.geo.addPoint(x, y, 0, h) for x, y in poli]
        ls = [gmsh.model.geo.addLine(ps[i], ps[(i + 1) % len(ps)]) for i in range(len(ps))]
        return gmsh.model.geo.addCurveLoop(ls)
    bucles = [lazo(lazo_con_apoyos(contorno, apoyos))] + [lazo(lazo_con_apoyos(hk, apoyos)) for hk in huecos]
    s = gmsh.model.geo.addPlaneSurface(bucles); gmsh.model.geo.synchronize()
    gmsh.model.addPhysicalGroup(2, [s], 1)
    gmsh.model.mesh.generate(2)
    r = gmshio.model_to_mesh(gmsh.model, MPI.COMM_SELF, 0, gdim=2)
    gmsh.finalize()
    return r.mesh if hasattr(r, "mesh") else r[0]

def resolver(caso, h):
    J = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))
    E_ = J["etabs"]; N = np.array(E_["nudos"])[:, :2]
    apoyos = [N[i] for i, r in enumerate(E_["restricciones"]) if r and r[2]]
    msh = malla(J["contorno"], J.get("huecos") or [], apoyos, h)
    V = fem.functionspace(msh, ("Lagrange", 2))
    w, v = ufl.TrialFunction(V), ufl.TestFunction(V)
    I = ufl.Identity(2); n = ufl.FacetNormal(msh)
    hK = ufl.CellDiameter(msh); h_av = (hK("+") + hK("-")) / 2
    kap = lambda u: ufl.grad(ufl.grad(u))
    M = lambda u: D * ((1 - NU) * kap(u) + NU * ufl.tr(kap(u)) * I)
    Mnn = lambda u: ufl.dot(ufl.dot(M(u), n), n)
    salto = lambda u: ufl.jump(ufl.grad(u), n)
    a = (ufl.inner(M(w), kap(v)) * ufl.dx
         - ufl.avg(Mnn(w)) * salto(v) * ufl.dS - salto(w) * ufl.avg(Mnn(v)) * ufl.dS
         + ALFA * D / h_av * salto(w) * salto(v) * ufl.dS)
    L = fem.Constant(msh, Q) * v * ufl.dx
    P = np.array(apoyos)
    dofs = fem.locate_dofs_geometrical(V, lambda x: np.any(
        np.hypot(x[0][:, None] - P[None, :, 0], x[1][:, None] - P[None, :, 1]) < 1e-8, axis=1))
    bc = fem.dirichletbc(fem.Constant(msh, 0.0), dofs, V)
    kw = dict(bcs=[bc], petsc_options={"ksp_type": "preonly", "pc_type": "lu"})
    try: prob = LinearProblem(a, L, petsc_options_prefix="placa_", **kw)
    except TypeError: prob = LinearProblem(a, L, **kw)
    wh = prob.solve(); wh = wh[0] if isinstance(wh, tuple) else wh
    # w en los nudos de ETABS
    X3 = np.c_[N, np.zeros(len(N))]
    tree = geometry.bb_tree(msh, 2)
    cand = geometry.compute_collisions_points(tree, X3)
    celdas = geometry.compute_colliding_cells(msh, cand, X3)
    wN = np.array([wh.eval(X3[i], celdas.links(i)[:1])[0] for i in range(len(X3))])
    return wN, float(np.abs(wh.x.array).max()), len(dofs), msh.topology.index_map(2).size_local

if __name__ == "__main__":
    casos = [a for a in sys.argv[1:] if not a.startswith("--")] or TODOS
    for caso in casos:
        J = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))["etabs"]
        wE = np.array([d[2] if d else np.nan for d in J["desplaz"]]); wEmax = np.nanmax(np.abs(wE))
        filas = []
        for h in (0.5, 0.25, 0.125):
            wN, wmax, nap, ncel = resolver(caso, h)
            peor = float(np.nanmax(np.abs(wN - wE)) / wEmax * 100)
            filas.append({"h": h, "celdas": ncel, "w_max": wmax, "w_nudos_etabs": wN.tolist(), "peor_vs_etabs_pct": peor})
            print("%-22s h=%.3f  %6d tri P2 · %2d apoyos · w max %.6e (ETABS %.6e, %+.3f %%) · nudos ETABS peor %.3f %% del max"
                  % (caso, h, ncel, nap, wmax, wEmax, (wmax / wEmax - 1) * 100, peor), flush=True)
        json.dump({"prog": "fenics dolfinx CIP P2", "caso": caso, "filas": filas},
                  open(os.path.join(DATOS, caso + "_fenics.json"), "w"), indent=1)
