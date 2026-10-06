"""Prototipo de Kg de TRIÁNGULOS (y Q4 con modificadores) sobre la K REAL de Struct (kglob_native.exe = la del WASM).
Decide contra SAP2000 (sap_pandeo_cascara.json) cómo trata SAP su triángulo en el pandeo:
  kgtri = "lin"  : N lineales del triángulo (1 punto, gradiente constante)
          "deg"  : Q4 degenerado (nudo 3 = nudo 2), N bilineales, Gauss 2×2
  sig   = "cst"  : tensión de la membrana CST (u, v)       (en un triángulo la de cualquier membrana que pase el patch test
          "sap"  : estático de SAP2000 (aísla la Kg)          es la misma si el campo es uniforme)
    python proto_tri.py <modelo> [kgtri] [est: struct|sap]"""
import json, os, subprocess, sys, tempfile
import numpy as np
from scipy.linalg import eigh
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from modelos import MODELOS, E, NU
EXE = os.environ.get("KGLOB", os.path.join(tempfile.gettempdir(), "kglob_native.exe"))


def k_struct(M, pf=None):
    pf = pf if pf is not None else (0 if M.get("tipo", 1) == 2 else 1)
    mods = M.get("mods")
    with tempfile.TemporaryDirectory() as d:
        txt, kb = os.path.join(d, "m.txt"), os.path.join(d, "K.bin")
        with open(txt, "w") as f:
            f.write("%d\n" % len(M["nodos"]))
            for p in M["nodos"]: f.write("%.17g %.17g %.17g\n" % tuple(p))
            f.write("%d\n" % len(M["panos"]))
            for c in M["panos"]:
                f.write("%d %s %.17g %.17g %.17g %d " % (len(c), " ".join(map(str, c)), M["t"], E, NU, pf))
                f.write(("8 " + " ".join("%.17g" % x for x in mods[:8])) if mods else "0"); f.write("\n")
        subprocess.run([EXE, txt, kb], check=True)
        n = 6 * len(M["nodos"]); return np.fromfile(kb).reshape(n, n)


def ejes(P):
    lx = P[1] - P[0]; lx /= np.linalg.norm(lx)
    lz = np.cross(P[1] - P[0], P[2] - P[0]); lz /= np.linalg.norm(lz); ly = np.cross(lz, lx)
    return np.array([lx, ly, lz])


def Dmem(mods):
    C = E / (1 - NU ** 2) * np.array([[1, NU, 0], [NU, 1, 0], [0, 0, (1 - NU) / 2]])
    if mods:
        f11, f22, f12 = mods[:3]; C[0, 0] *= f11; C[1, 1] *= f22; C[2, 2] *= f12; c = (f11 * f22) ** .5; C[0, 1] *= c; C[1, 0] *= c
    return C


def kg_tri(M, u, modo="lin", dmods=True):
    n = len(M["nodos"]); G = np.zeros((6 * n, 6 * n)); t = M["t"]
    C = Dmem(M.get("mods") if dmods else None)
    for c in M["panos"]:
        if len(c) != 3: raise SystemExit("solo triángulos")
        P = np.array([M["nodos"][k] for k in c], float); R = ejes(P)
        xy = (P - P[0]) @ R[:2].T
        ul = np.array([R @ u[6 * k:6 * k + 3] for k in c])
        x, y = xy[:, 0], xy[:, 1]
        A2 = (x[1] - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (y[1] - y[0])
        b = np.array([y[1] - y[2], y[2] - y[0], y[0] - y[1]]) / A2
        cc = np.array([x[2] - x[1], x[0] - x[2], x[1] - x[0]]) / A2
        eps = np.array([b @ ul[:, 0], cc @ ul[:, 1], cc @ ul[:, 0] + b @ ul[:, 1]])
        if modo.startswith("allman"):   # media de la Allman SIN proyectar (columnas θ en el centro)
            from proto_mem_tri import allman_tri
            th = np.array([(R @ u[6 * k + 3:6 * k + 6])[2] for k in c])
            Bc, _, _ = allman_tri(xy, (1 / 3, 1 / 3, 1 / 3), -1.0 if modo == "allman-" else 1.0)
            eps = eps + Bc[:, [2, 5, 8]] @ th
        sx, sy, sxy = t * C @ eps
        S = np.array([[sx, sxy], [sxy, sy]])
        if modo != "deg":
            dxy = np.array([b, cc]); g3 = A2 / 2 * dxy.T @ S @ dxy
        else:   # Q4 degenerado: nudos [0 1 2 2]
            X4, Y4 = np.r_[x, x[2]], np.r_[y, y[2]]; g4 = np.zeros((4, 4)); g = 1 / 3 ** .5
            for r in (-g, g):
                for s in (-g, g):
                    dN = 0.25 * np.array([[-(1 - s), (1 - s), (1 + s), -(1 + s)], [-(1 - r), -(1 + r), (1 + r), (1 - r)]])
                    J = dN @ np.c_[X4, Y4]; dxy = np.linalg.solve(J, dN); g4 += abs(np.linalg.det(J)) * dxy.T @ S @ dxy
            g3 = g4[:3, :3].copy(); g3[2, :] += g4[3, :3]; g3[:, 2] += g4[:3, 3]; g3[2, 2] += g4[3, 3]
        for i in range(3):
            for j in range(3):
                for k in range(3): G[6 * c[i] + k, 6 * c[j] + k] += g3[i, j]
    return G


def libres(M, K):
    n = len(M["nodos"]); fijo = np.zeros(6 * n, bool)
    for q, s in M["apoyos"].items():
        for k in range(6):
            if s[k]: fijo[6 * int(q) + k] = True
    d = np.abs(np.diag(K)); return np.where(~fijo & (d > 1e-12 * d.max()))[0]


def estatico(M, K, lib):
    F = np.zeros(K.shape[0])
    for q, c in M["cargas"].items(): F[6 * int(q):6 * int(q) + 6] += c
    u = np.zeros_like(F); u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib]); return u


def pandeo(K, G, lib, nm=12):
    mu, V = eigh(-G[np.ix_(lib, lib)], K[np.ix_(lib, lib)]); o = np.argsort(-np.abs(mu))[:nm]
    return np.array([1 / mu[k] for k in o]), V[:, o]


if __name__ == "__main__":
    nombre = sys.argv[1]; modo = (sys.argv[2:] + ["lin"])[0]; est = (sys.argv[3:] + ["struct"])[0]
    M = next(m for m in MODELOS if m["nombre"] == nombre)
    sap = json.load(open(os.path.join(AQUI, "sap_pandeo_cascara.json"))).get(nombre)
    K = k_struct(M); lib = libres(M, K)
    if est == "sap":
        u = np.zeros(K.shape[0])
        for q, v in sap["estatico"].items(): u[6 * int(q):6 * int(q) + 6] = v
    else:
        u = estatico(M, K, lib)
        if sap:
            us = np.zeros_like(u)
            for q, v in sap["estatico"].items(): us[6 * int(q):6 * int(q) + 6] = v
            print("estático Struct vs SAP: máx |du|/máx|u| = %.3e" % (np.abs(u - us).max() / np.abs(us).max()))
    lam, _ = pandeo(K, kg_tri(M, u, modo), lib)
    fs = sap["factores"] if sap else []
    for k, l in enumerate(lam[:10]):
        ref = min(fs, key=lambda f: abs(l / f - 1)) if fs else np.nan
        print("  %2d  Struct %14.6f   SAP %14.6f   dif %+.6f %%" % (k + 1, l, ref, 100 * (l / ref - 1)))
