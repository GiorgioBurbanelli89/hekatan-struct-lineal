# -*- coding: utf-8 -*-
"""CORTANTE BASAL y DERIVAS del dual 2x2x4 del articulo en SAP2000 24, con la MISMA
malla nudo a nudo que Hekatan (545 nudos) y las MISMAS fuerzas laterales.

Cuatro casos, un solo arranque de SAP2000:
  DEAD  peso propio          -> FZ de la base = W sismico (contraste del W=356.28 tonf)
  LX    FLE de la NEC en X   -> FX de la base + desplazamientos -> DERIVAS
  MODAL 12 modos             -> base del espectral
  SPECX/SPECY espectro NEC   -> FX/FY de la base = cortante basal DINAMICO (CQC)

El espectro NEC-15 se monta como funcion de USUARIO (Func.FuncRS.SetUser) con la
tabla Sa(T) que vuelca Hekatan; el caso espectral lleva SF = g/R (la funcion esta
en g y es ELASTICA, la reduccion por R va en el factor de escala) y ζ = 5 %, CQC.

    python sap_dual_sismo.py dual_2x2x4_sismo.json sap_dual_sismo.json

Unidades del modelo: kN-m (E y peso x 9.80665). Las fuerzas de Hekatan vienen en
tonf y se pasan a kN con el mismo g; los resultados se devuelven a tonf.
Shell-Thick, que es la formulacion contra la que se cerraron los periodos.
"""
import json, os, sys, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")

DUMP, OUT = sys.argv[1], sys.argv[2]
D = json.load(open(DUMP, encoding="utf-8"))
G = 9.80665
SAP_EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObject(SAP_EXE)
o.ApplicationStart(); log("SAP2000 arrancado")
sm = o.SapModel; sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)

# ── materiales y secciones (identico a sap_dual_modal.py) ────────────────────
E, nu = D["E"] * G, D["nu"]
sm.PropMaterial.SetMaterial("CONC", 2); sm.PropMaterial.SetMPIsotropic("CONC", E, nu, 1e-5)
sm.PropMaterial.SetWeightAndMass("CONC", 1, D["rho"] * G)

bc, bb, hb = D["bCol"], D["bBeam"], D["hBeam"]
Ac = bc * bc; Ic = bc ** 4 / 12; Jc = 0.141 * bc ** 4
Av = bb * hb; I33v = bb * hb ** 3 / 12; I22v = hb * bb ** 3 / 12; Jv = I33v + I22v
sm.PropFrame.SetGeneral("COL", "CONC", bc, bc, Ac, 5/6*Ac, 5/6*Ac, Jc, Ic, Ic, 1, 1, 1, 1, 1, 1)
sm.PropFrame.SetGeneral("VIGA", "CONC", hb, bb, Av, 5/6*Av, 5/6*Av, Jv, I22v, I33v, 1, 1, 1, 1, 1, 1)
# 2 = ShellThick (la formulacion con la que se cerraron los periodos)
sm.PropArea.SetShell_1("LOSA", 2, True, "CONC", 0.0, D["tSlab"], D["tSlab"])
sm.PropArea.SetShell_1("MURO", 2, True, "CONC", 0.0, D["tWall"], D["tWall"])

nom = []
for i, (x, y, z) in enumerate(D["nodes"]):
    sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "N%d" % i); nom.append("N%d" % i)
for k, (el, kind) in enumerate(zip(D["elements"], D["kinds"])):
    if kind in ("col", "beam"):
        sm.FrameObj.AddByPoint(nom[el[0]], nom[el[1]], "", "COL" if kind == "col" else "VIGA", "F%d" % k)
    else:
        sm.AreaObj.AddByPoint(4, [nom[j] for j in el], "", "LOSA" if kind == "slab" else "MURO", "A%d" % k)
for i in D["supports"]: sm.PointObj.SetRestraint(nom[int(i)], [True] * 6)
log("modelo: %d nudos, %d elementos, %d apoyos" % (len(nom), len(D["elements"]), len(D["supports"])))

# ── LX: la MISMA fuerza lateral equivalente que aplica Hekatan ───────────────
# `cargasLX` = [idxNudo, Fx tonf] tal como Hekatan reparte V=Cs*W por piso
# (NEC ec. 6.3.6, peso igual por piso, k=1) y luego entre los nudos del nivel.
pats = list(sm.LoadPatterns.GetNameList()[1])
log("patrones de partida: %s" % pats)
if "DEAD" not in pats: sm.LoadPatterns.Add("DEAD", 1, 1, True)   # 1 = Dead, peso propio x1
sm.LoadPatterns.Add("LX", 8, 0, True)   # 8 = Other, sin peso propio
acum = {}
for idx, f in D["cargasLX"]: acum[int(idx)] = acum.get(int(idx), 0.0) + float(f)
for idx, f in acum.items():
    sm.PointObj.SetLoadForce(nom[idx], "LX", [f * G, 0, 0, 0, 0, 0], True, "Global", 0)
log("LX: %d nudos cargados, SigmaFx = %.4f tonf" % (len(acum), sum(acum.values())))

# ── MODAL 12 modos ───────────────────────────────────────────────────────────
sm.LoadCases.ModalEigen.SetCase("MODAL")
sm.LoadCases.ModalEigen.SetNumberModes("MODAL", 12, 1)

# ── ESPECTRO NEC-15 como funcion de usuario + casos espectrales CQC ──────────
esp = D["espectro"]                      # [[T, Sa(g)], ...] ELASTICO
per = [float(t) for t, _ in esp]; val = [float(s) for _, s in esp]
r = sm.Func.FuncRS.SetUser("NEC15", len(per), per, val, 0.05)
log("FuncRS NEC15 (%d puntos, T=%.2f..%.2f, Sa max %.4f g) -> ret %s"
    % (len(per), per[0], per[-1], max(val), r))
SF = G / D["nec"]["R"]                    # funcion en g, elastica: SF = g/R
for caso, U in (("SPECX", "U1"), ("SPECY", "U2")):
    sm.LoadCases.ResponseSpectrum.SetCase(caso)
    sm.LoadCases.ResponseSpectrum.SetModalCase(caso, "MODAL")
    sm.LoadCases.ResponseSpectrum.SetLoads(caso, 1, [U], ["NEC15"], [SF], ["Global"], [0.0])
    sm.LoadCases.ResponseSpectrum.SetModalComb(caso, 1, 0, 0, 0)   # 1 = CQC
    sm.LoadCases.ResponseSpectrum.SetDampConstant(caso, 0.05)
log("casos espectrales SPECX/SPECY, SF = g/R = %.5f, CQC zeta 5%%" % SF)

sdb = os.path.join(os.path.dirname(os.path.abspath(OUT)), "sap_dual_sismo.sdb")
sm.File.Save(sdb)
sm.Analyze.SetRunCaseFlag("", True, True)
log("casos: %s" % list(sm.LoadCases.GetNameList()[1]))
log("run -> %s" % sm.Analyze.RunAnalysis())

# ── resultados ───────────────────────────────────────────────────────────────
# Los parametros de salida del OAPI NO se pasan como marcadores: comtypes los
# devuelve. Pasarlos (BaseReact(0, [], [], ...)) revienta con
# "TypeError: must be real number, not list" — asi murio la primera corrida.
# La lectura vive ademas en sap_leer_sismo.py, que se engancha a una instancia
# YA abierta y repite esto sin volver a arrancar SAP2000.
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "sap_leer_sismo.py"),
          encoding="utf-8").read().split("# ── lectura ──", 1)[1])

json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1)
o.ApplicationExit(False)
log("fin -> " + OUT)
