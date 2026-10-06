"""Modelo común para Multi-step Static y Moving Load (SAP2000 = juez). Unidades kN, m, s.
Viga continua de 2 vanos de 20 m a lo largo de X (z = 0), barras de 1 m (41 nudos, 40 barras).
Apoyos: x=0 [1,1,1,1,0,0]; x=20 y x=40 [0,1,1,0,0,0]. Sección rectangular 0.5 (ancho) x 1.2 (canto)."""
E, NU = 2.5e7, 0.2
B, H = 0.5, 1.2
LV, NV = 20.0, 2          # luz y número de vanos
DX = 1.0                  # largo de barra
N = int(round(LV * NV / DX))
NODES = [[k * DX, 0.0, 0.0] for k in range(N + 1)]
FRAMES = [[k, k + 1] for k in range(N)]
APOYOS = {0: [1, 1, 1, 1, 0, 0]}
for v in range(1, NV + 1): APOYOS[int(round(v * LV / DX))] = [0, 1, 1, 0, 0, 0]
# carga de un solo paso (se aplica en TODOS los pasos del multipaso): nudo en x=10, 50 kN hacia abajo
SC = {10: [0, 0, -50.0, 0, 0, 0]}
# vehículo del multipaso: 3 ejes 35/145/145 kN a 4.3 m (fijos)
CAMION = dict(nombre="CAM3", ejes=[35.0, 145.0, 145.0], sep=[4.3, 4.3])
# vehicle live: arranca con el eje delantero en la estación 0, t0 = 0, hacia adelante, 1 m/s, dt 0.7 s, 70 s
MULTI = dict(dur=70.0, dt=0.7, estacion=0.0, t0=0.0, v=1.0, sf_vl=1.2, sf_sc=1.0)
# Moving Load (líneas de influencia): camión 3 ejes + carril 9.3 kN/m (delantera, entre ejes y trasera)
HL93F = dict(nombre="HL93F", ejes=[35.0, 145.0, 145.0], sep=[4.3, 4.3], unif=[9.3, 9.3, 9.3, 9.3])
HL93V = dict(nombre="HL93V", ejes=[35.0, 145.0, 145.0], sep=[4.3, 4.3], unif=[9.3, 9.3, 9.3, 9.3], var=(1, 9.0))
CAM0 = dict(nombre="CAM0", ejes=[35.0, 145.0, 145.0], sep=[4.3, 4.3], unif=[0, 0, 0, 0])
UNI = dict(nombre="UNI", ejes=[0.0], sep=[], unif=[1.0, 1.0])
# Hyperstatic: cargas equivalentes de un tendón parabólico (P = 2000 kN) en cada vano, autoequilibradas:
#   vano 1 flecha 0.4 → w = 8Pe/L² = 16 kN/m hacia arriba y 160 kN hacia abajo en cada extremo del vano;
#   vano 2 flecha 0.3 → 12 kN/m y 120 kN; axial ±P en los extremos de la viga.
PT = dict(P=2000.0, e=[0.4, 0.3])
