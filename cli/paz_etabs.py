# -*- coding: utf-8 -*-
"""Paz & Leigh 6.3 Space Frame en ETABS — el arbitro del modal de Hekatan.

Hace falta porque la "referencia nativa" del CLAUDE.md (9.6780 Hz) solo la
reproduce un .exe compilado el 17-may de codigo que NUNCA se subio: el arbol de
ese mismo commit, recompilado, da 8.8412. O sea que no hay forma de saber por
git cual de los dos numeros es el bueno, y hay que preguntarselo a un tercero.

    python cli/paz_etabs.py

Unidades kip-in-F (enum 3). El modelo es EXACTAMENTE el de
examples/src/beams/pazEjemplo63.ts y cli/paz_check.mjs: mismas coordenadas, mismas
secciones pasadas por SetGeneral (no por catalogo, para que se compare el
SOLVER y no la seccion) y misma densidad.
"""
import os
import sys

import comtypes.client
import comtypes.gen.ETABSv1 as E

# ── el mismo modelo, en las mismas unidades ────────────────────────────────
E_MOD = 29500.0          # ksi
NU = 0.3
H, BX, BY = 180.0, 114.0, 240.0                  # in
RHO = 490.0 / 1000.0 / 12.0 ** 3 / 386.4         # kip*s2/in4  (masa/volumen)
PESO = RHO * 386.4                               # kip/in3     (peso/volumen)

# W24x146 columnas / W14x84 vigas.  I33 = eje fuerte, I22 = debil.
COL = dict(A=43.0, I33=5630.0, I22=391.0, J=34.8, d=24.7, b=12.9)
GIR = dict(A=24.7, I33=928.0, I22=225.0, J=5.90, d=14.2, b=12.0)

NODOS = [(0, 0, 0), (0, 0, H), (0, BY, 0), (0, BY, H),
         (BX, 0, 0), (BX, 0, H), (BX, BY, 0), (BX, BY, H)]
BARRAS = [(0, 1, "COL"), (2, 3, "COL"), (4, 5, "COL"), (6, 7, "COL"),
          (1, 5, "GIR"), (3, 7, "GIR"), (1, 3, "GIR"), (5, 7, "GIR")]
APOYOS = [0, 2, 4, 6]
NMODOS = 6

REF_NATIVA = [9.6780, 16.9874, 26.6149, 29.9497, 33.9929, 44.9332]
HEKATAN_HOY = [8.8358, 14.5551, 24.2228, 25.1038, 159.6530, 159.8523]

h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart()
try:
    o.Hide()
except Exception:
    pass
sm = o.SapModel
sm.InitializeNewModel(3)          # 3 = kip_in_F
sm.File.NewBlank()

# Los pisos van ANTES de dibujar: ETABS reparte la masa por piso y lo que quede
# por encima del unico Story1 de NewBlank se queda sin masa (y luego dice
# "THE STRUCTURE HAS NO (UNRESTRAINED) MASS" sin mas explicacion).
sm.Story.SetStories_2(0.0, 1, ("Tope",), (H,), (True,), ("",),
                      (False,), (0.0,), (255,))

sm.PropMaterial.SetMaterial("ACERO", 1)
sm.PropMaterial.SetMPIsotropic("ACERO", E_MOD, NU, 6.5e-6)
# Peso y masa son propiedades SEPARADAS: con solo la opcion 1 la masa queda en
# 0, el caso Modal corre igual y ModalPeriod() devuelve codigo 1 sin decir por
# que. Opcion 1 = peso/volumen, opcion 2 = masa/volumen.
sm.PropMaterial.SetWeightAndMass("ACERO", 1, PESO)
sm.PropMaterial.SetWeightAndMass("ACERO", 2, RHO)

for nombre, s in (("COL", COL), ("GIR", GIR)):
    sm.PropFrame.SetGeneral(
        nombre, "ACERO", s["d"], s["b"], s["A"],
        s["A"] * 5 / 6, s["A"] * 5 / 6, s["J"], s["I22"], s["I33"],
        2 * s["I33"] / s["d"], 2 * s["I22"] / s["b"],
        2 * s["I33"] / s["d"], 2 * s["I22"] / s["b"],
        (s["I33"] / s["A"]) ** 0.5, (s["I22"] / s["A"]) ** 0.5)

for i, j, sec in BARRAS:
    p, q = NODOS[i], NODOS[j]
    sm.FrameObj.AddByCoord(p[0], p[1], p[2], q[0], q[1], q[2], "", sec)

# Empotrar las 4 bases, emparejando por coordenada
_, puntos, _ = sm.PointObj.GetNameList()
fijos = 0
for nm in puntos:
    x, y, z, _ = sm.PointObj.GetCoordCartesian(nm, 0., 0., 0.)
    if abs(z) < 1e-6:
        sm.PointObj.SetRestraint(nm, [True] * 6)
        fijos += 1
print("bases empotradas: %d (esperadas 4)" % fijos)

# Masa 3D COMPLETA, para comparar con Hekatan: sin lumpeo por piso y con la
# vertical incluida. La API SourceMass no existe en la OAPI de ETABS 22, asi
# que se hace por los ELEMENTOS y sin agrupar.
try:
    sm.PropMaterial.SetMassSource(1)
except Exception:
    pass

sm.LoadCases.ModalEigen.SetCase("Modal")
sm.LoadCases.ModalEigen.SetNumberModes("Modal", NMODOS, 1)

edb = os.path.abspath(os.path.join(os.path.dirname(__file__), "paz_6_3.EDB"))
if os.path.exists(edb):
    os.remove(edb)
sm.File.Save(edb)
sm.Analyze.RunAnalysis()

r = sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
sm.Results.Setup.SetCaseSelectedForOutput("Modal")
res = sm.Results.ModalPeriod(0, [], [], [], [], [], [])
n = res[0]
if not n:
    print("ETABS no devolvio modos — leer %s.LOG" % edb[:-4])
    o.ApplicationExit(False)
    sys.exit(1)
per = list(res[4][:n])
frec = list(res[5][:n])

print("\nmodo   ETABS      ref .exe    dif %     Hekatan hoy    dif %")
for k in range(min(n, NMODOS)):
    f = frec[k]
    a = REF_NATIVA[k]
    b = HEKATAN_HOY[k]
    print("%3d %9.4f %11.4f %8.2f %% %13.4f %8.2f %%"
          % (k + 1, f, a, 100 * (a - f) / f, b, 100 * (b - f) / f))
print("\nperiodos ETABS:", " ".join("%.4f" % p for p in per[:NMODOS]))
o.ApplicationExit(False)
