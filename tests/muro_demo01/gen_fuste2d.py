# -*- coding: utf-8 -*-
"""FUSTE del muro Demo01 de GEO5 como BARRA 2D (el modelo «Beam» del Dimensioning de GEO5):
voladizo empotrado en la zapata, nudos sobre el EJE DE CENTROIDES del fuste inclinado.

Jorge, 22-sep-2026: «el muro en 2D en SAP2000, 3D en SAP2000 y como membrana (sección transversal),
3 modelos en Hekatan Struct con la geometría hecha, y comparamos con GEO5».

Datos LEÍDOS de la interfaz de GEO5 (Demo01_v24.guz, fotogramas en hekatan-geotechnic/tests/shots/geo5_manual):
  Geometry: h = 5.00 (fuste), k = 0.20 (coronación), pendiente 12.5:1 en la cara VISTA → canto 0.60 en la base;
            trasdós vertical.
  Perfil:   capas de 2.30 m y 1.70 m y luego el resto, contadas desde la coronación (terreno a ese nivel).
  Suelos:   1) γ 19.0 φ 29°   2) γ 17.5 φ 31.5°   3) γ 19.5 φ 27°  (cohesionless)
  Dimensioning, tabla de fuerzas del fuste: peso 45.98 kN en x = 0.38 (→ γc = 45.98 / 2.0 m² = 22.99);
            «Pressure at rest» 118.80 kN (horizontal) en z = 1.65; «Force No. 1» 30 kN en z = 5.20.
  Resultado GEO5 en la base del fuste: M_Ed = 348.11 kNm, V_Ed = 148.80 kN.
El empuje en reposo es Jáky, K0 = 1 − sinφ, por capa, horizontal (Fz = 0 en la tabla de GEO5).

Cargas NODALES por la regla de la palanca: cada tramo reparte su resultante a sus dos nudos de modo que la
resultante y su punto de paso son EXACTOS → M y V en la base son exactos, y SAP2000 recibe las mismas cargas.

    python tests/muro_demo01/gen_fuste2d.py [nElem_por_metro]  →  tests/muro_demo01/fuste2d.heks
"""
import math, os, sys, json
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

AQUI = os.path.dirname(os.path.abspath(__file__))
H, TTOP, TBASE = 5.0, 0.20, 0.60
GAMMA_C = 45.98 / 2.0                          # 22.99 kN/m³, sacado del peso del fuste de GEO5
E, NU = 3.0e7, 0.2                             # hormigón (solo afecta a los desplazamientos, no a M ni V)
CAPAS = [(2.30, 19.0, 29.0), (1.70, 17.5, 31.5), (None, 19.5, 27.0)]   # (espesor, γ, φ) desde la coronación
F_TOP, Z_F = 30.0, 5.20                        # «Force No. 1»: 30 kN hacia la cara vista, 0.20 m sobre la coronación
nm = int(sys.argv[1]) if len(sys.argv) > 1 else 10

t = lambda z: TBASE + (TTOP - TBASE) * z / H           # canto a la altura z sobre la zapata
xc = lambda z: TBASE / 2 - t(z) / 2                    # eje de centroides (x = 0 en la base; trasdós en x = 0.30)

def suelo(d):                                          # d = profundidad bajo la coronación
    acc = 0.0
    for e, g, f in CAPAS:
        if e is None or d < acc + e - 1e-12: return acc, g, f
        acc += e
def sigma_v(d):
    s, acc = 0.0, 0.0
    for e, g, f in CAPAS:
        tramo = d - acc if e is None else min(e, max(0.0, d - acc))
        s += g * tramo
        if e is None or d <= acc + e: break
        acc += e
    return s
def ph(d, lado):                                       # presión horizontal en reposo; lado = capa de arriba/abajo
    _, g, f = suelo(d - 1e-9 if lado == "arriba" else d + 1e-9)
    return (1 - math.sin(math.radians(f))) * sigma_v(d)

# cortes: bordes de capa (z = H − 2.3, H − 4.0) y malla uniforme en cada tramo
bordes = [0.0, H - 4.0, H - 2.3, H]
zs = []
for a, b in zip(bordes[:-1], bordes[1:]):
    n = max(1, round((b - a) * nm))
    zs += [a + (b - a) * k / n for k in range(n)]
zs.append(H)

L = ["# FUSTE del muro Demo01 (GEO5) como barra 2D en el plano XZ — generado por gen_fuste2d.py",
     "# nudos sobre el eje de centroides; x = 0 en la base; cargas nodales por la regla de la palanca (exactas en la base)"]
for i, z in enumerate(zs):
    L.append(f"node {i+1} {xc(z):.10f} 0 {z:.10f}")
L.append("support 1 fixed")
Fx = [0.0] * len(zs); Fz = [0.0] * len(zs); My = [0.0] * len(zs)
Rp = Mp = W = MW = 0.0
for k in range(len(zs) - 1):
    z1, z2 = zs[k], zs[k + 1]; Le = z2 - z1
    t1, t2 = t(z1), t(z2); ta = (t1 + t2) / 2
    A, I = ta * 1.0, ta ** 3 / 12
    L.append(f"frame {k+1} {k+1} {k+2} {E:g} {A:.10f} {I:.12g} {I:.12g} {ta**3/3:.12g} {NU} 0")
    # empuje en reposo sobre el tramo (dentro de UNA capa): trapecio pb (abajo) → pt (arriba)
    pb, pt = ph(H - z1, "arriba"), ph(H - z2, "abajo")
    R = (pb + pt) / 2 * Le
    if R > 0:
        zR = z1 + Le * (pb + 2 * pt) / (3 * (pb + pt))
        Fx[k] -= R * (z2 - zR) / Le; Fx[k + 1] -= R * (zR - z1) / Le
        Rp += R; Mp += R * zR
    # peso del tramo trapecial, repartido en x con la palanca (x del centroide EXACTO del tramo)
    w = GAMMA_C * ta * Le
    xw = TBASE / 2 - (Le * (t1 * t1 + t1 * t2 + t2 * t2) / 6) / (ta * Le)
    x1, x2 = xc(z1), xc(z2)
    Fz[k] -= w * (x2 - xw) / (x2 - x1); Fz[k + 1] -= w * (xw - x1) / (x2 - x1)
    W += w; MW += w * xw
Fx[-1] -= F_TOP; My[-1] += (Z_F - H) * (-F_TOP)        # la fuerza pasa 0.20 m por encima del nudo de coronación
for i in range(len(zs)):
    if Fx[i] or Fz[i] or My[i]:
        L.append(f"load {i+1} {Fx[i]:.10f} 0 {Fz[i]:.10f} 0 {My[i]:.10f} 0")
L.append("solve")
open(os.path.join(AQUI, "fuste2d.heks"), "w", encoding="utf-8").write("\n".join(L) + "\n")

# ---- estática exacta en la base (x = 0, z = 0): lo que GEO5 llama M_Ed y V_Ed ----
V = Rp + F_TOP
M = Mp + F_TOP * Z_F - MW                             # el peso cae DETRÁS (x > 0) del centroide de la base → resta
info = {"empuje_reposo": Rp, "z_empuje": Mp / Rp, "peso": W,
        "x_peso_desde_cara_vista": MW / W + TBASE / 2,      # la cara vista de la base está en x = −0.30
        "V_base": V, "M_base": M, "nudos": len(zs), "barras": len(zs) - 1,
        # cargas nodales por nivel z (las MISMAS para la membrana y el 3D): Fx, Fz, My
        "niveles": [{"z": z, "x_eje": xc(z), "Fx": Fx[i], "Fz": Fz[i], "My": My[i]} for i, z in enumerate(zs)]}
json.dump(info, open(os.path.join(AQUI, "fuste2d_estatica.json"), "w"), indent=1)
print(f"empuje en reposo {Rp:.3f} kN en z = {Mp/Rp:.4f} m   (GEO5: 118.80 en 1.65)")
print(f"peso del fuste   {W:.3f} kN, detrás del centroide de la base {MW/W:.4f} m, a {MW/W + TBASE/2:.4f} de la cara vista   (GEO5: 45.98 en x = 0.38 → 0.08)")
print(f"base: V = {V:.3f} kN   M = {M:.3f} kNm   (GEO5: V_Ed = 148.80, M_Ed = 348.11)")
print(f"{len(zs)} nudos, {len(zs)-1} barras → fuste2d.heks")
