# Membrana Q4 de Hekatan vs ETABS (3-nov-2026)

Datos ETABS: `tests/datos/membrana_q4_etabs.json` · test: `tests/casos/membrana_q4_etabs.mjs` · scripts: `C:\ETABS\membrana_q4\memb12_tipos.py`, `memb12_incl.py`, `tests/_membrana_flex.mjs`.

## Formulación de Hekatan (hoy)
- `hekatan-fem/src/cpp/utils/shellQ4.cpp:1759` defecto `drillingType = 13` (ITW 1990 con Gauss 2x2 + proyección + reloj de arena khg = 2e-4, γ = 0.4·G·t). Lectura de tipos: líneas 1735-1830. Membrana = flexión 0 (`bendingModifiers`/`shellmod ... 0 0 0`).
- `getMembraneITW` (modos de Allman/ITW). Los modos incompatibles de Wilson 1971 + Taylor 1976 son del tipo viejo (`getMembraneK`, ~línea 100).
- Unión viga-muro `etabsWallJoint` (`utils/etabsWallJoint.h:51`): sólo cáscaras VERTICALES (`|nz| > 1e-6` se salta). No toca la cubierta.

## Método
Un solo área en ETABS 22, sin barras; fuera del plano sujeto, 3 sólidos rígidos del plano sujetos, 9 grados libres (u, v, giro normal x 4 nudos); carga unidad por grado -> flexibilidad 9x9 (= desplazamientos y giros nodo a nodo). Mismo modelo en Hekatan (`deform`).

## ✅ Funcionó
- Membrane en ETABS NO se malla ni en 1:6 (1 elemento, 4 nudos). Shell-Thick 1x6 SÍ: 5 elementos.
- Membrane 1x1 == Shell-Thick 1x1 en el plano (misma flexibilidad).
- Hekatan tipo 13 (defecto) vs ETABS, error máx / sqrt(Fii·Fjj): 17 geometrías <= 6e-7 %: cuadrado (nu 0..0.45), 1:2, 1:4, **1:6**, paralelogramo, trapecio, **membrana inclinada en 3D** (3 cm/m, doble pendiente, 30°). Mismo elemento, a todos los dígitos.
- Para Membrane hay que poner flexión 0 en Hekatan (con flexión el Rz global de un paño inclinado difiere 1.1 %).
- Tipos de drilling (1x1 / 1x6, error de la flexibilidad): 0 y 1 irrealmente flexibles (Rz); 2 (HB) -75 % Rz; 3 y 5 59-118 %; 8 uv 0.7-2.3 %, Rz 98 %; 9 uv 3-4 %, Rz 14-93 %; 14 (ITW publicado) uv 0.01-0.06 %, Rz 14-90 %; 4 y 11 singulares; **13: 0.000 % en todo**.
- Con `etabsjoint 0` el galpón 1 NO cambia (Ux 69.19 %, Uy 49.83 %, Uz 3.05 % igual): confirma que el joint no actúa en la cubierta.

## ❌ No funcionó
- Hipótesis "el Q4 de membrana de Hekatan difiere del de CSI": falsa. No hay nada que cambiar en el motor.
- Una variante de `etabsjoint 0` que parecía bajar Ux/Uy a 16/7 % era un .heks viejo (modelo completo, otro troceo): confundido; descartado.

## Conclusión para el galpón
El error Ux/Uy NO viene del elemento (rigidez de membrana, drilling, relación 6:1, inclinación). Sub-dividir a 1.25 m mejoraba por compensación, no por corregir el elemento. Buscar en el ensamblaje con barras: acople barra-membrana (giro normal del nudo con barras que llegan), brazos/insertion point en el borde, o el modelo (cargas/liberaciones) en la línea x = 30 m.

## ⏳ Falta
- ETABS: membrana + 4 barras de borde articuladas/empotradas, 1x6 inclinada; leer reacciones y comparar nudo a nudo (¿ETABS ata el drilling al giro de las barras?).
- Reacciones (no se pidieron a ETABS; los desplazamientos con carga unidad ya fijan la K).
- Nota: durante el experimento 2 el ETABS abierto cambió de modelo (otro agente lo usaba); InitializeNewModel pisó su modelo. No se cerró ETABS.
