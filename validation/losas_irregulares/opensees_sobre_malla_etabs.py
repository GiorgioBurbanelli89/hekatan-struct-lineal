# -*- coding: utf-8 -*-
"""OpenSees resuelve LA MALLA QUE HIZO ETABS con placa delgada: ShellDKGQ en los cuadrilateros y
ShellDKGT en los triangulos (flexion DKQ / DKT; Lu Xinzheng et al.). Tercer juez, de codigo abierto.

    python opensees_sobre_malla_etabs.py            # los 7 casos
    python opensees_sobre_malla_etabs.py losa_T     # uno

Entra:  ../isse/automesh/etabs_poligono/<caso>_etabs_malla_thin.json
Sale:   ../isse/automesh/etabs_poligono/<caso>_opensees_thin.json  y  <caso>_opensees.py (el modelo
        escrito como script de OpenSeesPy, para abrirlo y correrlo solo).
La carga de area va como fuerzas nodales CONSISTENTES: Q4 con ∫N_i q dA (Gauss 2x2), triangulo q·A/3.
"""
import json, os, sys
import numpy as np
import openseespy.opensees as ops
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.normpath(os.path.join(AQUI, "..", "isse", "automesh", "etabs_poligono"))
TODOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"]
casos = [a for a in sys.argv[1:] if not a.startswith("--")] or TODOS
E, NU, T, Q = 25e6, 0.2, 0.20, -10.0

def fuerzas(P):
    """Vector consistente de la presion Q sobre un Q4 (Gauss 2x2) o un triangulo (A/3)."""
    if len(P) == 3:
        A = 0.5 * np.linalg.norm(np.cross(P[1] - P[0], P[2] - P[0])); return [Q * A / 3] * 3
    g = 1 / np.sqrt(3); f = np.zeros(4)
    for xi, et in [(-g, -g), (g, -g), (g, g), (-g, g)]:
        N = 0.25 * np.array([(1 - xi) * (1 - et), (1 + xi) * (1 - et), (1 + xi) * (1 + et), (1 - xi) * (1 + et)])
        dx = 0.25 * np.array([-(1 - et), 1 - et, 1 + et, -(1 + et)]); de = 0.25 * np.array([-(1 - xi), -(1 + xi), 1 + xi, 1 - xi])
        f += N * Q * np.linalg.norm(np.cross(dx @ P, de @ P))
    return list(f)

for caso in casos:
    J = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))["etabs"]
    X = np.array(J["nudos"], float)
    L = ["import openseespy.opensees as ops", "ops.wipe()", "ops.model('basic', '-ndm', 3, '-ndf', 6)",
         f"ops.section('ElasticMembranePlateSection', 1, {E}, {NU}, {T}, 0.0)"]
    for i, (x, y, z) in enumerate(X): L.append(f"ops.node({i + 1}, {x}, {y}, {z})")
    carga = np.zeros(len(X)); k = 0
    for e in J["elementos"]:
        if len(e) not in (3, 4): continue
        k += 1
        tipo = "ShellDKGQ" if len(e) == 4 else "ShellDKGT"
        L.append(f"ops.element('{tipo}', {k}, {', '.join(str(i + 1) for i in e)}, 1)")
        for i, f in zip(e, fuerzas(X[e])): carga[i] += f
    for i, rr in enumerate(J["restricciones"]):
        if rr and any(rr): L.append(f"ops.fix({i + 1}, {', '.join('1' if v else '0' for v in rr)})")
    L += ["ops.timeSeries('Linear', 1)", "ops.pattern('Plain', 1, 1)"]
    for i, f in enumerate(carga):
        if f: L.append(f"ops.load({i + 1}, 0, 0, {float(f)!r}, 0, 0, 0)")
    L += ["ops.system('UmfPack')", "ops.numberer('RCM')", "ops.constraints('Plain')",
          "ops.integrator('LoadControl', 1.0)", "ops.algorithm('Linear')", "ops.analysis('Static')", "ops.analyze(1)"]
    # el MISMO modelo en Tcl, para OpenSees.exe o el WPF OpenSees-Calcpad (OpenSeesCalcpad.exe <caso>.tcl)
    tcl = [f"# {caso}: malla de ETABS (Shell-Thin), q = {Q} kN/m2, E = {E}, nu = {NU}, t = {T}. kN, m",
           "wipe", "model basic -ndm 3 -ndf 6", f"section ElasticMembranePlateSection 1 {E} {NU} {T} 0.0"]
    for ln in L[4:]:
        if ln.startswith(("ops.node(", "ops.element(", "ops.fix(", "ops.load(")):
            cmd, args = ln[4:].split("(", 1)
            tcl.append(cmd + " " + " ".join(a.strip().strip("'") for a in args.rstrip(")").split(",")))
    tcl[4:4] = []
    i_ts = next(i for i, x in enumerate(tcl) if x.startswith("load ")) if any(x.startswith("load ") for x in tcl) else len(tcl)
    tcl[i_ts:i_ts] = ["timeSeries Linear 1", "pattern Plain 1 1 {"]
    tcl += ["}", "system UmfPack", "numberer RCM", "constraints Plain", "integrator LoadControl 1.0",
            "algorithm Linear", "analysis Static", "analyze 1"]
    open(os.path.join(DATOS, caso + "_opensees.tcl"), "w", encoding="utf-8").write("\n".join(tcl) + "\n")
    guion = os.path.join(DATOS, caso + "_opensees.py")
    open(guion, "w", encoding="utf-8").write("# Modelo de OpenSeesPy generado por opensees_sobre_malla_etabs.py\n" + "\n".join(L) + "\n")
    exec("\n".join(L))
    desplaz = [list(ops.nodeDisp(i + 1)) for i in range(len(X))]
    ops.reactions(); sumRz = sum(ops.nodeReaction(i + 1)[2] for i, rr in enumerate(J["restricciones"]) if rr and any(rr))
    json.dump({"prog": "opensees", "caso": caso, "desplaz": desplaz, "sumRz": sumRz, "n_cascaras": k},
              open(os.path.join(DATOS, caso + "_opensees_thin.json"), "w"), indent=1)
    wE = max(abs(d[2]) for d in J["desplaz"] if d); wO = max(abs(d[2]) for d in desplaz)
    print("%-22s %d nudos, %d cascaras · sumRz %.3f · w max OpenSees %.6e ETABS %.6e (%.4f %%)"
          % (caso, len(X), k, sumRz, wO, wE, (wO / wE - 1) * 100), flush=True)
