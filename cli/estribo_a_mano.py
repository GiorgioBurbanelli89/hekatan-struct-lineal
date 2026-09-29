"""
Estribo de puente (ejemplo `estribo-puente`): el cálculo A MANO, para comparar con Hekatan Struct.

No lee el modelo: solo los parámetros del ejemplo (sus valores por defecto). Tres capas:
  1. Cargas: empuje de Rankine, peso propio, tierra sobre el talón, tablero. Contra ΣF de Struct.
  2. Estabilidad con zapata RÍGIDA: resultante, excentricidad, presiones, vuelco, deslizamiento.
  3. Contra Struct (zapata flexible sobre muelles): la resultante del suelo y su posición.

Ejes del modelo: x a lo largo del estribo (0..B), y hacia el relleno (puntera en y < 0), z hacia arriba.
  python cli/estribo_a_mano.py   → imprime y escribe cli/shots/estribo/a_mano.json
"""
import json, math, os

P = dict(B=10, H=6, La=4, t=0.6, tAleta=0.4, tz=1.0, puntera=1.5, Rv=3000, Fh=300,
         gamma=19, phi=32, q=12, ks=40000, nx=10, nz=8)
RHO, G0 = 2.4, 9.80665           # t/m³ del hormigón del ejemplo y la g del solver
gc = RHO * G0                    # kN/m³
B, H, La, t, ta, tz, pun = P["B"], P["H"], P["La"], P["t"], P["tAleta"], P["tz"], P["puntera"]
g, phi, q = P["gamma"], math.radians(P["phi"]), P["q"]

Ka = math.tan(math.pi / 4 - phi / 2) ** 2
# ── 1. cargas ───────────────────────────────────────────────────────────
E_tri = 0.5 * Ka * g * H**2 * B          # empuje del suelo, triangular, a H/3
E_q = Ka * q * H * B                     # empuje de la sobrecarga, rectangular, a H/2
Hx = 0.0                                  # las aletas empujan hacia fuera, iguales y opuestas: se anulan
Htot = E_tri + E_q + P["Fh"]

# pesos con las SUPERFICIES MEDIAS (como el modelo de cáscaras: cada paño con su espesor)
W_pant = B * H * t * gc                  # en y = 0
W_ale = 2 * La * H * ta * gc             # en y = La/2
L_zap = pun + La
W_zap = B * L_zap * tz * gc              # en y = (La − pun)/2
y_zap = (La - pun) / 2
# tierra sobre el talón, como la carga el modelo: nudos con y > 0, área tributaria
dy_tal = La / max(2, round(La / B * P["nx"]))
franja_perdida = dy_tal / 2              # el medio paño pegado a la pantalla no recibe tierra
W_tierra_mod = (g * H + q) * B * (La - franja_perdida)
y_tierra_mod = (franja_perdida + La) / 2
# la tierra que hay de verdad: desde la cara de la pantalla (t/2) hasta el final de las aletas,
# entre las caras interiores de las aletas
W_tierra_real = (g * H + q) * (B - ta) * (La - t / 2)
y_tierra_real = (t / 2 + La) / 2

V_mod = P["Rv"] + W_pant + W_ale + W_zap + W_tierra_mod
V_real = P["Rv"] + W_pant + W_ale + W_zap + W_tierra_real

# ── 2. estabilidad, zapata rígida ───────────────────────────────────────
# momento de vuelco (hacia la puntera, −y) de las horizontales, respecto a la base (z = 0,
# el plano medio de la zapata, donde el modelo pone los apoyos)
M_h = E_tri * H / 3 + E_q * H / 2 + P["Fh"] * H

def estabilidad(W_tierra, y_tierra):
    V = P["Rv"] + W_pant + W_ale + W_zap + W_tierra
    Mv = P["Rv"] * 0 + W_pant * 0 + W_ale * La / 2 + W_zap * y_zap + W_tierra * y_tierra  # respecto a y = 0
    yN = (Mv - M_h) / V                       # donde cae la resultante del suelo
    yc = y_zap                                # centro de la zapata
    e = yc - yN                               # excentricidad hacia la puntera
    A = B * L_zap
    qmed = V / A
    qmax, qmin = qmed * (1 + 6 * e / L_zap), qmed * (1 - 6 * e / L_zap)
    # vuelco respecto al borde de la puntera (y = −pun)
    M_est = Mv + V * 0 - 0 + (P["Rv"] + W_pant + W_ale + W_zap + W_tierra) * pun
    FS_vuelco = M_est / M_h
    delta = 2 / 3 * phi                       # hipótesis: rozamiento base-suelo δ = ⅔·φ
    FS_desl = V * math.tan(delta) / Htot
    return dict(V=V, Mv=Mv, yN=yN, e=e, L6=L_zap / 6, qmed=qmed, qmax=qmax, qmin=qmin,
                FS_vuelco=FS_vuelco, FS_desl=FS_desl, delta_grados=math.degrees(delta))

mod = estabilidad(W_tierra_mod, y_tierra_mod)
real = estabilidad(W_tierra_real, y_tierra_real)

# ── 3. contra Struct ────────────────────────────────────────────────────
ruta = "cli/shots/estribo/estribo-puente_struct.json"
st = json.load(open(ruta)) if os.path.exists(ruta) else None

out = dict(Ka=Ka, E_tri=E_tri, E_q=E_q, Fh=P["Fh"], Htot=Htot, M_h=M_h,
           W_pant=W_pant, W_ale=W_ale, W_zap=W_zap, W_tierra_mod=W_tierra_mod, W_tierra_real=W_tierra_real,
           franja_perdida=franja_perdida, V_mod=V_mod, V_real=V_real, modelo=mod, real=real, struct=st)
os.makedirs("cli/shots/estribo", exist_ok=True)
json.dump(out, open("cli/shots/estribo/a_mano.json", "w"), indent=1)

f = lambda v: f"{v:12.3f}"
print(f"Ka = {Ka:.5f}")
print("CARGAS                          a mano        Struct")
if st:
    print(f"  horizontal (−y)           {f(Htot)}  {f(-st['sF'][1])}   dif {abs(Htot + st['sF'][1]) / Htot * 100:.4f} %")
    print(f"  vertical (como el modelo) {f(V_mod)}  {f(-st['sF'][2])}   dif {abs(V_mod + st['sF'][2]) / V_mod * 100:.4f} %")
    print(f"  resultante del suelo, y   {f(mod['yN'])}  {f(st['yN'])}   dif {abs(mod['yN'] - st['yN']) * 1000:.1f} mm")
print(f"  vertical real (tierra hasta la cara de la pantalla) {V_real:.3f}  → el modelo pone {V_real - V_mod:.1f} kN menos")
for nom, r in (("como el modelo", mod), ("con la tierra real", real)):
    print(f"ESTABILIDAD ({nom}): e = {r['e']:.3f} m (L/6 = {r['L6']:.3f}) · q = {r['qmin']:.1f} … {r['qmax']:.1f} kPa · "
          f"FS vuelco {r['FS_vuelco']:.2f} · FS deslizamiento {r['FS_desl']:.2f} (δ = {r['delta_grados']:.1f}°)")
if st:
    print(f"Struct (zapata flexible, muelles): q = {st['qmin']:.1f} … {st['qmax']:.1f} kPa")
