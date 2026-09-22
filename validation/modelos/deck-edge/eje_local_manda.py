# -*- coding: utf-8 -*-
"""Demuestra, MIDIENDO, que el eje local del área decide a qué vigas baja la carga.

    python eje_local_manda.py            (SAP2000, deja el programa abierto)

En una sola sesión de SAP2000:
  1. monta el mezanine (mez_undeck: 5 viguetas por el lado corto, un paño de 4
     nudos que las cruza, 2 kN/m² = 60 kN),
  2. le pone la carga como **Uniform to Frame en UN sentido** (`SetLoadUniformToFrame`
     con DistType 1) — que es la asignación que reparte a las barras,
  3. y la corre DOS VECES: con el eje local 1 a 0° y a 90°.

Lo que se mide en cada caso es `w = (V2ᵢ − V2ⱼ)/L` barra a barra: el cortante de
una barra sin carga de vano es constante, así que `w ≠ 0` es la prueba de que la
carga le llegó.

El vano de la losa va a lo largo del **eje local 1**, así que la carga cae en las
barras paralelas al **eje local 2**. Girar el eje 90° cambia de familia de vigas.
"""
import json, sys, time
import comtypes.client
import comtypes.gen.SAP2000v1 as S

D = json.load(open("mez_undeck.json"))
Q = -2.0

h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject")
o.ApplicationStart()
sm = o.SapModel
sm.InitializeNewModel(6)          # 6 = kN, m, C
sm.File.NewBlank()

t0 = time.time()
# --- materiales y secciones (General, con las propiedades del .heks)
ei = D["elementInputs"]
def g(mapa, k, d=0.0):
    if not isinstance(mapa, dict): return d
    v = mapa.get(str(k), mapa.get(k, d))
    return d if v is None else v

sm.PropMaterial.SetMaterial("MAT", 1)
sm.PropMaterial.SetMPIsotropic("MAT", 2.5e7, 0.2, 1e-5)
secs = {}
def sec(k):
    E = g(ei["elasticities"], k, 2.5e7); A = g(ei["areas"], k, 0.1)
    Iy = g(ei["momentsOfInertiaY"], k, 1e-4); Iz = g(ei["momentsOfInertiaZ"], k, 1e-4)
    J = g(ei["torsionalConstants"], k, 1e-5); rho = g(ei["densities"], k, 0.0)
    key = (round(E, 3), round(A, 8), round(Iy, 10), round(Iz, 10))
    if key in secs: return secs[key]
    nm = "S%d" % len(secs)
    mnm = "M%d" % len(secs)
    sm.PropMaterial.SetMaterial(mnm, 1)
    sm.PropMaterial.SetMPIsotropic(mnm, E, 0.2, 1e-5)
    sm.PropMaterial.SetWeightAndMass(mnm, 2, rho)
    sm.PropFrame.SetGeneral(nm, mnm, 0.3, 0.3, A, A * 5 / 6., A * 5 / 6., J, Iy, Iz, 1, 1, 1, 1, 1, 1)
    secs[key] = nm
    return nm

nombres = {}
for i, (x, y, z) in enumerate(D["nodes"]):
    r = sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "N%d" % i)
    nombres[i] = r[0] if isinstance(r, tuple) else "N%d" % i
for i, s in (D["nodeInputs"].get("supports") or {}).items():
    sm.PointObj.SetRestraint(nombres[int(i)], [True] * 6)

VIG, BX, BY = [], [], []
for k, el in enumerate(D["elements"]):
    if len(el) == 2:
        nm = "F%d" % k
        sm.FrameObj.AddByPoint(nombres[el[0]], nombres[el[1]], "", sec(k), nm)
        a, b = D["nodes"][el[0]], D["nodes"][el[1]]
        if abs(a[2] - b[2]) > 1e-6: continue                 # columna
        if abs(a[0] - b[0]) < 1e-6: (VIG if 1e-6 < a[0] < 5.999 else BY).append(nm)
        else: BX.append(nm)
    else:
        nmA = "A23"
        sm.PropArea.SetShell_1("SH", 5, True, "MAT", 0.0, 0.065, 0.065)   # 5 = MEMBRANE en SAP2000
        sm.AreaObj.AddByPoint(len(el), [nombres[j] for j in el], "", "SH", nmA)
print("modelo montado en %.0f s: %d viguetas, %d vigas x, %d vigas y" % (time.time() - t0, len(VIG), len(BX), len(BY)), flush=True)

res = {}
for ang, pat in ((0.0, "ONE0"), (90.0, "ONE90")):
    sm.SetModelIsLocked(False)
    sm.LoadPatterns.Add(pat, 3, 0.0, True)
    sm.AreaObj.SetAutoMesh("A23", 4, 2, 2, 0.0, 0.0, False, False, False, 0.0, 0.0,
                           False, False, False, False, "ALL", False, 0.0, 0)
    sm.AreaObj.SetLocalAxes("A23", float(ang))
    r = sm.AreaObj.SetLoadUniformToFrame("A23", pat, Q, 6, 1, True, "Global", 0)
    print("  ang %5.1f -> SetLoadUniformToFrame = %s" % (ang, r), flush=True)

sm.Analyze.RunAnalysis()
print("analisis corrido en %.0f s" % (time.time() - t0), flush=True)

def w_de(nm):
    r = sm.Results.FrameForce(nm, 0)
    if not r[0]: return 0.0
    sta, V2 = list(r[2]), list(r[9])
    L = max(sta) if sta else 0.0
    return (V2[0] - V2[-1]) / L if L > 1e-9 else 0.0

for pat in ("ONE0", "ONE90"):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput(pat)
    fila = {"viguetas (lado corto)": [round(w_de(n), 4) for n in VIG],
            "vigas de borde en x": [round(w_de(n), 4) for n in BX],
            "vigas de borde en y": [round(w_de(n), 4) for n in BY]}
    res[pat] = fila
    print("\n%s  (eje local 1 a %s)" % (pat, "0 grados = X global" if pat == "ONE0" else "90 grados = Y global"))
    for k, v in fila.items():
        print("   %-24s w = %s" % (k, v))

json.dump(res, open("eje_local_manda.json", "w"), indent=1)
print("\nPROGRAMA ABIERTO — no se cierra")
