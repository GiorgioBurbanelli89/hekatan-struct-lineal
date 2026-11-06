#!/usr/bin/env python
"""SAP IV (1973, Bathe/Wilson/Peterson) como ORACULO extra de Hekatan Struct.

Genera la entrada de SAP IV (tarjetas de campos fijos), ejecuta sap64.exe, lee la salida
y compara con Hekatan (cli/sap4_hekatan.mjs -> node) y con ETABS (tests/datos/*_ref.json).

NO incluye ni copia binarios ni fuente de SAP IV: se pasa la ruta con --sap4 (carpeta donde
estan sap64.exe y los ejemplos). Carpeta de trabajo (entradas/salidas): --trab.

Unidades internas de SAP IV aqui: N y mm (las tarjetas son de 10 columnas y asi caben ~7-8 cifras).
Entrada en el .heks: kN, m  ->  se convierte al escribir y al leer.

Uso:
  python cli/sap4_correr.py --sap4 C:/ETABS/sap4/sap3264/SAP --trab C:/ETABS/sap4/trab caso <caso>
  casos: viga | portico | galpon | cercha
"""
from __future__ import annotations
import argparse, json, math, os, re, subprocess, sys
from pathlib import Path

import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "hekatan-struct-py" / "src"))

# ---------------------------------------------------------------- formato de tarjetas
def f10(v: float) -> str:
    """Real en 10 columnas con el maximo de cifras significativas (Fortran lo lee con F10.x)."""
    v = float(v)
    if v == 0.0:
        return "       0.0"
    best = None
    for dec in range(9, -1, -1):
        s = f"{v:.{dec}f}"
        if len(s) <= 10:
            best = s
            break
    if best is not None and (abs(v) >= 1e-3 or dec >= 6):
        # si se perdieron cifras relevantes (valor chico), probar exponencial
        if abs(float(best) - v) <= abs(v) * 1e-7:
            return best.rjust(10)
    for sig in range(7, 0, -1):
        s = f"{v:.{sig}E}"
        m, e = s.split("E")
        s2 = f"{m}E{int(e)}"
        if len(s2) <= 10:
            return s2.rjust(10)
    raise ValueError(v)


def i5(v: int) -> str:
    return f"{int(v):5d}"


# ---------------------------------------------------------------- modelo
class Modelo:
    """Modelo SAP IV: nudos, barras 3D (tipo 2), cascaras (tipo 6), cargas nodales (1 caso)."""

    def __init__(self, titulo="MODELO"):
        self.titulo = titulo
        self.nodos: dict[int, tuple[float, float, float]] = {}      # mm
        self.apoyo: dict[int, tuple] = {}                             # 6 banderas (1 = fijo)
        self.cargas: dict[int, list[float]] = {}                      # N, N.mm
        self.mats: list[tuple] = []                                   # (E, nu, rho, wght)
        self.secs: list[tuple] = []                                   # (A, As2, As3, J, I22, I33)
        self.barras: list[dict] = []                                  # id ni nj nk mat sec ci cj
        self.cascaras: list[dict] = []                                # id n1..n4 mat t
        self.mats_c: list[tuple] = []                                 # (c11,c12,c13,c22,c23,c33)
        self._sigmat: dict = {}
        self._sigsec: dict = {}
        self._sigmatc: dict = {}
        self._nk = 0

    # -- nudos
    def nudo(self, p, fijo=None) -> int:
        n = len(self.nodos) + 1
        self.nodos[n] = tuple(float(x) for x in p)
        if fijo:
            self.apoyo[n] = tuple(fijo)
        return n

    def mat(self, E, nu, rho=0.0, w=0.0) -> int:
        k = (round(E, 6), round(nu, 8), rho, w)
        if k not in self._sigmat:
            self.mats.append((E, nu, rho, w)); self._sigmat[k] = len(self.mats)
        return self._sigmat[k]

    def sec(self, A, As2, As3, J, I22, I33) -> int:
        k = tuple(float(f10(x)) for x in (A, As2, As3, J, I22, I33))
        if k not in self._sigsec:
            self.secs.append(k); self._sigsec[k] = len(self.secs)
        return self._sigsec[k]

    def matc(self, c) -> int:
        k = tuple(round(x, 6) for x in c)
        if k not in self._sigmatc:
            self.mats_c.append(k); self._sigmatc[k] = len(self.mats_c)
        return self._sigmatc[k]

    def barra(self, ni, nj, e2, mat, sec, ci=0, cj=0, tag=None) -> int:
        """e2 = vector (global) del eje local 2 -> nudo K = I + e2*L/2 (nudo fijo auxiliar)."""
        pi, pj = np.array(self.nodos[ni]), np.array(self.nodos[nj])
        L = float(np.linalg.norm(pj - pi))
        e2 = np.asarray(e2, float); e2 = e2 / np.linalg.norm(e2)
        k = self.nudo(pi + e2 * max(L, 1.0), fijo=(1,) * 6)
        b = dict(id=len(self.barras) + 1, ni=ni, nj=nj, nk=k, mat=mat, sec=sec, ci=ci, cj=cj, tag=tag)
        self.barras.append(b)
        return b["id"]

    def cascara(self, ns, matc, t, tag=None):
        self.cascaras.append(dict(id=len(self.cascaras) + 1, n=list(ns), mat=matc, t=t, tag=tag))

    def carga(self, n, f):
        a = self.cargas.setdefault(n, [0.0] * 6)
        for i in range(6):
            a[i] += f[i]

    # -- escritura
    def texto(self) -> str:
        L = []
        L.append(f"** {self.titulo}"[:72].ljust(72))
        grupos = (1 if self.barras else 0) + (1 if self.cascaras else 0)
        L.append("".join(i5(v) for v in (len(self.nodos), grupos, 1, 0, 0, 0, 0, 0, 0)))
        for n in sorted(self.nodos):
            ap = self.apoyo.get(n, (0,) * 6)
            x, y, z = self.nodos[n]
            L.append(f" {n:4d} {ap[0]:4d}" + "".join(i5(a) for a in ap[1:]) + f10(x) + f10(y) + f10(z) + i5(0) + f10(0.0))
        if self.barras:
            L.append("".join(i5(v) for v in (2, len(self.barras), len(self.secs), 0, len(self.mats))))
            for i, (E, nu, rho, w) in enumerate(self.mats, 1):
                L.append(i5(i) + f10(E) + f10(nu) + f10(rho) + f10(w))
            for i, s in enumerate(self.secs, 1):
                L.append(i5(i) + "".join(f10(v) for v in s))
            for _ in range(3):
                L.append("".join(f10(0.0) for _ in range(4)))
            for b in self.barras:
                L.append("".join(i5(v) for v in (b["id"], b["ni"], b["nj"], b["nk"], b["mat"], b["sec"], 0, 0, 0, 0)) + f"{b['ci']:6d}{b['cj']:6d}" + i5(0))
        if self.cascaras:
            L.append("".join(i5(v) for v in (6, len(self.cascaras), len(self.mats_c))))
            for i, c in enumerate(self.mats_c, 1):
                L.append(f"{i:10d}" + "".join(f10(0.0) for _ in range(6)))
                L.append("".join(f10(v) for v in c))
            for _ in range(5):
                L.append("".join(f10(0.0) for _ in range(4)))
            for c in self.cascaras:
                n = c["n"] + [0]
                L.append("".join(i5(v) for v in (c["id"], n[0], n[1], n[2], n[3], 0, c["mat"], 1)) + f10(c["t"]) + f10(0.0) + f10(0.0) + f10(0.0))
        for n in sorted(self.cargas):
            f = self.cargas[n]
            if any(abs(v) > 0 for v in f):
                L.append(i5(n) + i5(1) + "".join(f10(v) for v in f))
        L.append("")                      # tarjeta en blanco: fin de cargas
        L.append("")                      # LAST: NUMNP = 0 -> fin del problema
        return "\n".join(L) + "\n"


# ---------------------------------------------------------------- ejecucion y lectura
def correr(sap4: Path, trab: Path, nombre: str, texto: str, timeout=900) -> dict:
    trab.mkdir(parents=True, exist_ok=True)
    inp, out = trab / f"{nombre}.inp", trab / f"{nombre}.out"
    inp.write_text(texto)
    if out.exists():
        out.unlink()
    exe = sap4 / "sap64.exe"
    r = subprocess.run([str(exe)], input=f"{inp.name}\n{out.name}\n", text=True, cwd=trab, timeout=timeout,
                       capture_output=True, env={**os.environ})
    # sap64.exe necesita estar junto (los ficheros de trabajo NT2.. se crean en cwd): copia perezosa
    return dict(rc=r.returncode, out=out, stdout=r.stdout[-2000:])


def correr_exe(sap4: Path, trab: Path, nombre: str, texto: str, timeout=900) -> dict:
    """Ejecuta una copia local de sap64.exe en la carpeta de trabajo (scratch NT* ahi)."""
    trab.mkdir(parents=True, exist_ok=True)
    exe = trab / "sap64.exe"
    if not exe.exists():
        exe.write_bytes((sap4 / "sap64.exe").read_bytes())
    inp, out = trab / f"{nombre}.inp", trab / f"{nombre}.out"
    inp.write_text(texto)
    if out.exists():
        out.unlink()
    r = subprocess.run([str(exe)], input=f"{inp.name}\n{out.name}\n", text=True, cwd=trab, timeout=timeout,
                       capture_output=True)
    return dict(rc=r.returncode, out=out, stdout=r.stdout[-1500:], stderr=r.stderr[-1500:])


def leer_salida(path: Path) -> dict:
    """Desplazamientos (N-mm), fuerzas de barra (R1..M3 en I y J) y errores de la salida de SAP IV."""
    txt = path.read_text(errors="replace").split("\n")
    U, F = {}, {}
    modo = None
    err = [l.strip() for l in txt if re.search(r"ERROR|ZERO|SINGULAR|NEGATIVE|TERMINATED", l, re.I)]
    i = 0
    while i < len(txt):
        l = txt[i]
        if re.search(r"N O D E\s+D I S P L A C E M E N T S", l):
            modo = "U"
        elif re.search(r"B E A M|BEAM FORCES AND MOMENTS", l):
            modo = "F"
        elif re.search(r"S T R E S S|SHELL ELEMENT STRESSES|F O R C E S", l) and "BEAM" not in l:
            modo = None if modo == "F" and "BEAM" not in l and False else modo
        if modo == "U":
            t = l.split()
            if len(t) == 8 and t[0].isdigit() and t[1].isdigit():
                try:
                    U[int(t[0])] = [float(x.replace("D", "E")) for x in t[2:]]
                except ValueError:
                    pass
        elif modo == "F":
            t = l.split()
            if len(t) >= 8 and t[0].isdigit() and t[1].isdigit() and i + 1 < len(txt):
                t2 = txt[i + 1].split()
                try:
                    a = [float(x) for x in t[2:8]]
                    b = [float(x) for x in t2[:6]]
                    if len(t) == 8 and len(t2) == 6:
                        F[int(t[0])] = a + b
                        i += 1
                except ValueError:
                    pass
        i += 1
    return dict(U=U, F=F, errores=err)


# ---------------------------------------------------------------- casos minimos
def caso_viga(sap4, trab, L=3000.0, P=10000.0, E=200000.0, b=100.0, h=200.0, nu=0.3, n=6):
    """Voladizo con carga en la punta: Uz = P L^3/(3EI) + P L/(G As). Barra horizontal en X, eje local 2 = +Z."""
    A = b * h; I22 = b ** 3 * h / 12; I33 = b * h ** 3 / 12   # I33 (plano 1-2), I22 (plano 1-3)
    J = 0.229 * h * b ** 3
    md = Modelo("VOLADIZO")
    ids = [md.nudo((L * k / n, 0, 0), fijo=(1,) * 6 if k == 0 else None) for k in range(n + 1)]
    m = md.mat(E, nu); s = md.sec(A, 5 / 6 * A, 5 / 6 * A, J, I22, I33)
    for k in range(n):
        md.barra(ids[k], ids[k + 1], (0, 0, 1), m, s)
    md.carga(ids[-1], [0, 0, -P, 0, 0, 0])              # carga -Z = eje local 2 -> plano 1-2 (I33)
    G = E / (2 * (1 + nu))
    ana = -(P * L ** 3 / (3 * E * I33) + P * L / (G * 5 / 6 * A))   # carga en el eje local 2 -> plano 1-2 -> I33, As2
    r = correr_exe(sap4, trab, "viga", md.texto())
    s_ = leer_salida(r["out"])
    uz = s_["U"][ids[-1]][2]
    return dict(caso="viga voladizo (carga en eje local 2 = Z: usa I33)", SAP4=uz, analitico=ana, err_rel=abs(uz - ana) / abs(ana), errores=s_["errores"][:3])



# ---------------------------------------------------------------- .heks -> SAP IV
RIG = dict(A=1e10, I=2e13)          # eslabon rigido (N-mm): ~1e5 veces la barra mas rigida


def _eslabon(md: Modelo, na: int, nb: int, mat: int, sec: int):
    pa, pb = np.array(md.nodos[na]), np.array(md.nodos[nb])
    d = pb - pa
    ref = np.array([0.0, 0.0, 1.0]) if np.hypot(d[0], d[1]) > 1e-6 * max(1.0, abs(d[2])) else np.array([1.0, 0.0, 0.0])
    md.barra(na, nb, ref, mat, sec, tag="rigido")


def _partir_cascara(m, conn):
    """Q4 con nudos de barra COLGADOS en dos aristas opuestas (mismas posiciones) -> tiras que pasan por ellos.
    Es la forma de que SAP IV (sin edge constraint) vea la membrana unida a todos los nudos de la arista."""
    P = np.array(m.nodes)
    def en_arista(a, b):
        pa, pb = P[a], P[b]; d = pb - pa; L2 = float(d @ d)
        t = ((P - pa) @ d) / L2
        perp = np.linalg.norm(P - (pa + np.outer(t, d)), axis=1)
        return sorted((t[i], i) for i in range(len(P)) if perp[i] < 2e-3 and 1e-4 < t[i] < 1 - 1e-4)
    n0, n1, n2, n3 = conn
    e1, e2 = en_arista(n0, n1), en_arista(n3, n2)
    if e1 and len(e1) == len(e2) and all(abs(a[0] - b[0]) < 2e-3 for a, b in zip(e1, e2)):
        A = [n0] + [i for _, i in e1] + [n1]
        B = [n3] + [i for _, i in e2] + [n2]
        return [[A[i], A[i + 1], B[i + 1], B[i]] for i in range(len(A) - 1)]
    return [list(conn)]


def desde_heks(heks: Path, patron: str, bend_s: float = 20.0, rig_s: float = 1.0, partir: bool = False):
    """Modelo SAP IV a partir del .heks que escribe e2kAHeks (misma lectura que Hekatan: leer_heks).
    kN, m -> N, mm. Barras = tipo 2; cascaras (membrana) = tipo 6 con espesor/bend_s y CM*bend_s (misma rigidez de membrana,
    flexion /bend_s^2). Insercion y brazos rigidos (rz>0) = eslabones rigidos; el release va en la barra flexible."""
    from hekatan_struct.heks import leer_heks
    from hekatan_struct.elements.frame import frame_local_axes_csi
    m = leer_heks(str(heks))
    ei, ni = m.element_inputs, m.node_inputs
    md = Modelo(Path(heks).stem)
    # e2klinea sin TRANSFORMSTIFF "Yes": el punto de insercion es solo geometrico (el motor TS y ETABS no tocan la K);
    # leer_heks de Python lo trata como "Yes" -> se anula aqui (medido: porticos/cercha sin esto salen 3-90 % lejos)
    sin_transf = set()
    for ln in Path(heks).read_text(errors="replace").splitlines():
        if ln.startswith("e2klinea") and not re.search(r'TRANSFORMSTIFF\s+"?Yes', ln, re.I):
            sin_transf.add(int(ln.split()[1]))
    # numerar por (x, y, z): banda menor
    orden = sorted(range(len(m.nodes)), key=lambda i: (round(m.nodes[i][0], 3), round(m.nodes[i][1], 3), round(m.nodes[i][2], 3)))
    sn = {}
    sup = getattr(ni, "supports", {}) or {}
    for i in orden:
        p = [c * 1000.0 for c in m.nodes[i]]
        fl = sup.get(i)
        sn[i] = md.nudo(p, fijo=tuple(1 if f else 0 for f in fl) if fl else None)
    rig_mat = md.mat(200000.0, 0.3)
    rig_sec = md.sec(RIG["A"] * rig_s, RIG["A"] * rig_s, RIG["A"] * rig_s, RIG["I"] * rig_s, RIG["I"] * rig_s, RIG["I"] * rig_s)
    for k, conn in enumerate(m.elements):
        if len(conn) == 2:
            a, b = conn
            pi, pj = np.array(m.nodes[a]), np.array(m.nodes[b])
            ang = ei.local_angles.get(k, 0.0)
            e1, e2, e3, L = frame_local_axes_csi(pi, pj, ang)
            E, G = ei.elasticities[k], ei.shear_moduli.get(k) or ei.elasticities[k] / (2 * (1 + ei.poissons_ratios.get(k, 0.3)))
            A, I22, I33, J = ei.areas[k], ei.moments_of_inertia_y[k], ei.moments_of_inertia_z[k], ei.torsional_constants[k]
            As2, As3 = ei.shear_areas_z.get(k, 0.0), ei.shear_areas_y.get(k, 0.0)
            if As2 <= 0 and As3 <= 0:
                As2 = As3 = 5.0 / 6.0 * A
            eo = ei.end_offsets.get(k)
            li = lj = 0.0
            if eo and (eo[0] > 0 or eo[1] > 0) and eo[2] > 0:
                li, lj = eo[2] * eo[0], eo[2] * eo[1]
            Lf = L - li - lj
            ax = Lf / L                      # axil y torsion con la L completa (ley CSI): A y J * Lf/L
            d2d3 = ei.insertion_offsets.get(k)
            if d2d3 is None or not ei.insertion_transform.get(k, True) or m.frame_id[k] in sin_transf:
                d2d3 = (0.0, 0.0)
            off = e2 * d2d3[0] + e3 * d2d3[1]
            nu = E / (2 * G) - 1
            mat = md.mat(E * 1e-3, nu)
            sec = md.sec(A * 1e6 * ax, As2 * 1e6, As3 * 1e6, J * 1e12 * ax, I22 * 1e12, I33 * 1e12)
            rel = ei.moment_releases.get(k)
            ci = sum(10 ** (5 - d) for d in range(6) if rel and rel[d])
            cj = sum(10 ** (5 - d) for d in range(6) if rel and rel[6 + d])
            na, nb = sn[a], sn[b]
            # nudos de la barra flexible: nudo -> (insercion) -> (brazo) -> flexible
            def extremo(n, p, lr, sgn):
                cur = n
                if np.linalg.norm(off) > 1e-9:
                    q = md.nudo((p + off) * 1000.0)
                    _eslabon(md, cur, q, rig_mat, rig_sec); cur = q
                if lr > 0:
                    q = md.nudo((p + off + sgn * lr * e1) * 1000.0)
                    _eslabon(md, cur, q, rig_mat, rig_sec); cur = q
                return cur
            fa = extremo(na, pi, li, +1.0)
            fb = extremo(nb, pj, lj, -1.0)
            md.barra(fa, fb, e2, mat, sec, ci, cj, tag=(k, a, b))
        elif len(conn) == 4:
            t = ei.thicknesses[k] * 1000.0
            E, nu = ei.elasticities[k] * 1e-3, ei.poissons_ratios.get(k, 0.3)
            f = ei.shell_modifiers.get(k, [1.0] * 8)
            c0 = E / (1 - nu ** 2)
            c = (c0 * f[0], c0 * nu * math.sqrt(f[0] * f[1]), 0.0, c0 * f[1], 0.0, c0 * f[2] * (1 - nu) / 2)
            c = tuple(x * bend_s for x in c)
            for q in (_partir_cascara(m, conn) if partir else [list(conn)]):
                md.cascara([sn[i] for i in q], md.matc(c), t / bend_s, tag=k)
    # cargas del patron (kN, kN.m -> N, N.mm)
    idx = {nid: i for i, nid in enumerate(m.node_id)}
    for ln in Path(heks).read_text(errors="replace").splitlines():
        t = ln.split()
        if len(t) >= 9 and t[0] == "load" and t[8] == patron:
            md.carga(sn[idx[int(t[1])]], [float(x) * (1000.0 if j < 3 else 1e6) for j, x in enumerate(t[2:8])])
    return md, m, sn


def nodo_clave(p):
    return tuple(int(round(v * 1000)) for v in p)


def comparar_u(md, m, sn, S, H):
    """U en m: SAP IV vs Hekatan (json de sap4_hekatan.mjs). Devuelve rms rel % por eje y maximos."""
    hk = {nodo_clave(p): i for i, p in enumerate(H["nodes"])}
    res = {}
    for ax, nom in enumerate("xyz"):
        sq = sr = mx = 0.0
        for i, p in enumerate(m.nodes):
            h = H["U"].get(str(hk.get(nodo_clave(p), -1)))
            u = S["U"].get(sn[i])
            if h is None or u is None:
                continue
            a, b = u[ax] / 1000.0, h[ax]
            sq += (a - b) ** 2; sr += b * b; mx = max(mx, abs(b))
        res[nom] = dict(rms_pct=100 * math.sqrt(sq / sr) if sr > 0 else None, ref_max_mm=mx * 1000, dif_rms_mm=1000 * math.sqrt(sq / max(1, len(m.nodes))))
    return res


def hek(e2k: Path, trab: Path, patron: str, opc="{}"):
    d = trab / "hek"
    r = subprocess.run(["node", str(RAIZ / "cli" / "sap4_hekatan.mjs"), str(e2k), str(d), patron, opc], capture_output=True, text=True, cwd=RAIZ)
    if r.returncode:
        raise RuntimeError(r.stderr[-800:])
    return d / "modelo.heks", json.loads((d / f"hek_{patron}.json").read_text())


def _rms(a, b):
    sq = sum((x - y) ** 2 for x, y in zip(a, b)); sr = sum(y * y for y in b)
    return 100 * math.sqrt(sq / sr) if sr > 0 else None


def vs_etabs(md, m, sn, S, H, ref, pat):
    """rms rel % de U: SAP IV y Hekatan contra ETABS (ref JointDispl[pat], nudos por coordenada)."""
    hk = {nodo_clave(p): i for i, p in enumerate(H["nodes"])}
    sk = {nodo_clave(p): sn[i] for i, p in enumerate(m.nodes)}
    out = {}
    for ax, nom in enumerate("xyz"):
        e, h, s = [], [], []
        for nm, d in (ref["JointDispl"][pat] if "JointDispl" in ref else ref[pat]).items():
            k = nodo_clave(ref["pts"][nm])
            if k in hk and k in sk and sk[k] in S["U"]:
                e.append(d[ax]); h.append(H["U"][str(hk[k])][ax]); s.append(S["U"][sk[k]][ax] / 1000.0)
        mx = max((abs(x) for x in e), default=0.0)
        out[nom] = dict(max_ETABS_mm=round(mx * 1000, 4), Hek_pct=_rms(h, e), SAP4_pct=_rms(s, e), SAP4_vs_Hek_pct=_rms(s, h))
    return out


def axiles_ref(md, m, S, H, ref, pat, filtro):
    """Axil (kN, traccion +) de las barras de ref['barras'] que cumplen filtro(b): ETABS Pj, Hekatan normals[1], SAP IV R1 en J."""
    nodes = H["nodes"]
    hb = {}
    for b in H["barras"]:
        i, j = b["n"]
        hb[(nodo_clave(nodes[i]), nodo_clave(nodes[j]))] = b
    sb = {}
    for bb in md.barras:
        if bb["tag"] and bb["tag"] != "rigido":
            k, a, b = bb["tag"]
            sb[(nodo_clave(m.nodes[a]), nodo_clave(m.nodes[b]))] = S["F"].get(bb["id"])
    filas = []
    for nm, b in ref["barras"].items():
        if not b.get(pat) or not filtro(b):
            continue
        k1, k2 = nodo_clave(b["p1"]), nodo_clave(b["p2"])
        h = hb.get((k1, k2)) or hb.get((k2, k1))
        s = sb.get((k1, k2)) or sb.get((k2, k1))
        if not h or not h["P"] or not s:
            continue
        filas.append(dict(p1=b["p1"], p2=b["p2"], ETABS=b[pat]["P"][1], Hek=h["P"][1], SAP4=s[6] / 1000.0))
    return filas


def modelo_e2k(sap4: Path, trab: Path, e2k: Path, pat: str, bend_s=20.0, partir=False):
    heks, H = hek(e2k, trab / e2k.stem, pat)
    md, m, sn = desde_heks(heks, pat, bend_s, partir=partir)
    r = correr_exe(sap4, trab / "run", "m" + pat[:6] + ("p" if partir else ""), md.texto())
    S = leer_salida(r["out"])
    return md, m, sn, S, H, r


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sap4", required=True)
    ap.add_argument("--trab", required=True)
    ap.add_argument("caso")
    ap.add_argument("args", nargs="*")
    a = ap.parse_args()
    sap4, trab = Path(a.sap4), Path(a.trab)
    if a.caso == "viga":
        print(json.dumps(caso_viga(sap4, trab), indent=1, default=str))
    elif a.caso == "todo":                      # todo [salida.json]
        D = RAIZ / "tests" / "datos"
        res = {}
        casos = [("e2k_portico1vano_plana", p_, False) for p_ in ("Dead", "Live", "LATX")]
        casos += [("e2k_galpon_simple_plana", p_, False) for p_ in ("Dead", "Live", "LATX", "LATY")]
        casos += [("e2k_galpon_simple_card8", p_, False) for p_ in ("Dead", "Live")]
        casos += [("e2k_cercha", p_, pt) for p_ in ("Dead", "Live") for pt in (False, True)]
        for nom, pat, partir in casos:
            ref = json.loads((D / f"{nom}_ref.json").read_text())
            md, m, sn, S, H, r = modelo_e2k(sap4, trab, D / f"{nom}.e2k", pat, partir=partir)
            fila = dict(rc=r["rc"], nudos=len(md.nodos), barras=len(md.barras), cascaras=len(md.cascaras), errores=S["errores"][:2],
                        membrana_con_tiras=partir, U_vs_ETABS=vs_etabs(md, m, sn, S, H, ref, pat))
            if nom == "e2k_cercha":
                f = axiles_ref(md, m, S, H, ref, pat, lambda b: "Tubo 50" in b["sec"] and abs(b["p1"][1] - 29) < 1e-3 and abs(b["p2"][1] - 29) < 1e-3
                               and 78 < b["p1"][0] and b["p2"][0] < 85.001 and abs(b["p1"][2] - b["p2"][2]) < 0.2)
                fila["cordones_y29"] = [dict(x0=min(r_["p1"][0], r_["p2"][0]), z=round(r_["p1"][2], 2), ETABS=r_["ETABS"], Hek=r_["Hek"], SAP4=r_["SAP4"])
                                        for r_ in sorted(f, key=lambda r_: (r_["p1"][2] < 11.5, min(r_["p1"][0], r_["p2"][0])))]
            res[f"{nom}:{pat}" + (":tiras" if partir else "")] = fila
            print(nom, pat, "tiras" if partir else "-", {k: (v["max_ETABS_mm"], round(v["Hek_pct"], 2), round(v["SAP4_pct"], 2), round(v["SAP4_vs_Hek_pct"], 2)) for k, v in fila["U_vs_ETABS"].items()}, flush=True)
        out = Path(a.args[0]) if a.args else RAIZ / "tests" / "datos" / "sap4_resultados.json"
        out.write_text(json.dumps(res, indent=1, default=str))
        print("escrito", out)
    elif a.caso == "e2k":                       # e2k <ruta.e2k> <Patron> [bend_s]
        e2k, pat = Path(a.args[0]), a.args[1]
        bs = float(a.args[2]) if len(a.args) > 2 else 20.0
        heks, H = hek(e2k, trab, pat)
        md, m, sn = desde_heks(heks, pat, bs)
        nom = "g" + pat[:6]
        r = correr_exe(sap4, trab / "run", nom, md.texto())
        S = leer_salida(r["out"])
        print("rc", r["rc"], "nudos", len(md.nodos), "barras", len(md.barras), "cascaras", len(md.cascaras), "desp", len(S["U"]), "err", S["errores"][:3])
        print(json.dumps(comparar_u(md, m, sn, S, H), indent=1))
