# Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracción) — 19-sep-2026

Sesión **ca**, agente zapata. Worktree `hekatan-struct-zapata`, rama `zapata-levantamiento`
(sale de `integracion-deploy1` 18ab20024).

Pregunta de un usuario: «hay situaciones en que las zapatas incurren en rango no lineal, como
cuando las columnas son demasiado excéntricas». Jorge: revisarlo, agregarlo, comparar con SAP2000,
SAFE y ETABS.

## Bitácora

- ✅ Worktree nuevo + `node_modules` propio (junctions a terceros; los 5 paquetes internos apuntan
  al worktree, no al principal). `zapata-winkler-sap2000` 9/9 en el worktree.
- ✅ Fuentes del algoritmo (texto, no memoria):
  - CSI Analysis Reference (`referencias/Pdf/CSI/CSiRefer.txt`), «Gap Property» p. 286:
    f = k·(d + open) si d + open < 0, si no 0; «compression-only».
    Iteración: cap. XXIII «Nonlinear Solution Control» p. 436-439 (paso de carga, constant-stiffness
    y luego Newton-Raphson, tolerancia relativa de fuerza).
  - SAFE Key Features (SAFE 20/Manuals), §5.4.3 «Nonlinear Analysis for Uplift» p. 51-52:
    muelles de suelo «compression only» + caso no lineal → «nonlinear gap elements are
    automatically activated in the soil support springs».
  - SAP2000 OAPI `AreaObj.SetSpring`: `SimpleSpringType` 2 = «Spring resists compression only».
  - Guerra (2013) «Cimentaciones sismo resistentes utilizando SAFE», p. 16 (casos 1-3 de
    excentricidad) y p. 63-64 (caso «Nonlinear (Allow Uplift)» en SAFE).
- ✅ Hekatan ya LEÍA `areaspring … compresion` y lo exportaba a s2k/f2k, pero el solver lo
  ignoraba (lineal): el suelo tiraba.
- ✅ Solver: `examples/src/shared/muellesSoloCompresion.ts` (conjunto activo con la ley Gap; al
  terminar se cumple la ley nudo a nudo, sin tolerancia). `cliModeler`: `areaspring … compresion`
  se reparte a los nudos por ∫N_i dA (como CSI) y el solve itera; `spring n uz k compresion` también.
  Presión 0 donde se levanta. Sin tocar deform.cpp ni el WASM (no hizo falta recompilar).
- ❌→✅ Primer export: el s2k salía con los muelles DOS veces (área + nudo) y SIN cargas: los
  `areaload` con patrón no llegaban a `cargasPorPatron` (bug previo, también con Dead). Arreglado en
  cliModeler; s2k con 6 patrones de −60 tonf cada uno y solo el muelle de área «Compression Only».
- ✅ Ejemplo `zapata-excentrica` (carpeta, index.html, main.ts, registro, vite, `.heks`).
- ✅ Hekatan n=60 vs zapata rígida (fórmula): e/L=1/4 q_max 40.06 vs 40.00, contacto 1.502 vs 1.500 m;
  e/L=1/3 60.07 vs 60.00, 1.002 vs 1.000 m. Converge en 3-6 iteraciones.
- ⚠️ Disco lleno (0 B) a media sesión: ENOSPC en tests. Borré bash-edit-diff y hkTest-* viejos
  (> 30 min): 1.4 GB libres. Lo demás del disco no es de esta sesión.
- ⚠️ `ciclo-csi` falla 46/52 (losas_maciza_thin 68 %) YA en integracion-deploy1 sin mis cambios.
- Bibliografía pedida (Das, 4 casos Highter & Anders): NO hay PDF de Das. Los dos PDF de Telegram son
  el MISMO libro escaneado (Crespo Villalaz, «Problemas resueltos de mecánica de suelos y de
  cimentaciones»), OCR con tesseract: solo trae el factor de reducción de capacidad por e/B (p. 104,
  `zapata_levantamiento_png/crespo_p104_excentricidad_reduccion.png`) y P/N ± My·x/Σx² ± Mx·y/Σy² en
  pilotes (p. 135). Ninguno trae los 4 casos de Das ni el triángulo de contacto.

## Braja M. Das (PDF que bajó Jorge, solo las páginas de zapatas excéntricas)
- 9.ª ed. inglés (2019) §6.10 p. 235-236: $q_{max,min}=\frac{Q}{BL}\left(1\pm\frac{6e}{B}\right)$ (6.51-6.52);
  para $e>B/6$: $q_{max}=\frac{4Q}{3L(B-2e)}$ (6.53, Tomlinson 1978). §6.11 p. 237: Meyerhof $B'=B-2e$.
  §6.12 p. 242-246: casos I-IV (Highter & Anders 1985), $A'=\tfrac12B_1L_1$, $B_1=B(1.5-3e_B/B)$…
  Ejemplos 6.10 (p. 247-248, caso II, Q_u ≈ 606 kN) y 6.11 (p. 248-249, caso IV, 1670 kN).
- 7.ª ed. español §3.9 p. 158 (ecs. 3.36-3.38, SIN citar a Tomlinson) y §3.11 p. 165-167.
- ⚠️ No coinciden en los límites: ES Caso II «e_L/L < 0.5 y 0 < e_B/B < 1/6» y Caso III «e_L/L < 1/6 y
  0 < e_B/B < 0.5»; EN pone «1/6 < e_L/L < 0.5» y «1/6 < e_B/B < 0.5». Y con e_B = 0 (una dirección)
  ninguna edición la mete en I-IV: es §6.11 (Meyerhof).
- ⚠️ El A' de Das es de CAPACIDAD DE CARGA (presión última uniforme con centroide en la carga), no el
  área de contacto elástica. Con e/L = 1/4: Meyerhof L' = 1.0 m; contacto elástico 3(L/2 − e) = 1.5 m.
- Casos II/III tienen fórmula cerrada por la condición de centroide que dibuja el ábaco:
  $m=\frac{L/2-e_L}{1/2+6(e_B/B)^2}$, $L_1+L_2=2m$, $L_1-L_2=12m\,e_B/B$. Ej. 6.10: L1/L = 0.857, L2/L = 0.214
  (libro, del ábaco: 0.85 y 0.21) → A' = 1.2054 m² contra 1.193 del libro (+1.0 %).
  Caso IV por Newton: ej. 6.11 da B2/B 0.076, L2/L 0.363 (libro 0.1 y 0.32), A' 1.588 vs 1.5615 (+1.7 %).

## ✅ El ejemplo de Struct = Das ej. 6.10 (datos exactos del libro + lo que Das no da)
B = L = 1.5 m, e_B = 0.15, e_L = 0.30 (e_L/L = 0.2 > 1/6 → se levanta), Q = Q_u del libro = 606 kN.
Elegido (Das no lo da): t = 0.40 m, columna 0.30, f'c 240, ks = 2000 tonf/m³. Malla 30×30 (961 nudos).

| programa (caso no lineal) | q_max tonf/m² | asiento mm | contacto m² | vs SAP2000 | nudo a nudo |
|---|---:|---:|---:|---:|---:|
| **SAP2000 24** (juez, tol 1e-6) | 81.914 | 40.957 | 1.888 | — | — |
| Hekatan | 81.915 | 40.957 | 1.888 | +0.0002 % | 0.0004 % |
| SAFE 20 «Nonlinear» (tol 1e-6) | 81.915 | 40.957 | 1.888 | +0.0002 % | 0.0004 % |
| ETABS 22 (tol 1e-6) | 81.915 | 40.958 | 1.888 | +0.0010 % | 0.0010 % |
| SAP2000 tol de fábrica 1e-4 | 81.908 | 40.954 | 1.888 | −0.0074 % | 0.013 % |
| zapata RÍGIDA (plano, sin tracción) | 82.211 | 41.105 | 1.884 | +0.36 % | — |
| lineal (el suelo tira) | 76.670 | 38.335 | 2.25 | −6.4 % | — |
| Das A' (cap. de carga, no contacto) | — | — | 1.193 | — | — |

- Mismos 798 nudos en contacto en los 4 programas. Con la tolerancia de fábrica (1e-4) CSI deja 0.02 %
  de desequilibrio (ΣFz 606.02) y eso es todo lo que separa.
- Por qué difiere de Das: Das supone zapata RÍGIDA y reparto lineal; el FEM tiene zapata flexible sobre
  muelles → 0.36 % menos de q_max. Y A' no es comparable con el contacto: es otra teoría (capacidad última).
- PNG: `zapata_levantamiento_png/das610_presion_4_programas.png` (línea negra = borde del contacto).

## ✅ Barrido secundario e/L = 0…1/3 + biaxial (2×2×0.5, P = 60 tonf, malla 60×60) vs SAP2000
| caso | fórmula rígida q_max | Hekatan | SAP2000 (tol 1e-4) | Δ | contacto H / SAP / fórmula (m) |
|---|---:|---:|---:|---:|---|
| e/L = 0 | 15.000 | 15.180 | 15.180 | 0.000 % | 2.000 / 2.000 / 2.000 |
| 1/12 | 22.500 | 22.464 | 22.464 | 0.000 % | 2.000 / 2.000 / 2.000 |
| 1/6 | 30.000 | 30.000 | 30.000 | 0.000 % | 2.000 / 2.000 / 2.000 |
| 1/4 | 40.000 | 40.055 | 40.052 | +0.008 % | 1.502 / 1.502 / 1.500 |
| 1/3 | 60.000 | 60.072 | 60.038 | +0.057 % | 1.002 / 1.003 / 1.000 |
| biaxial 1/4 y 1/6 (Das caso I) | 66.667 | 66.503 | 66.480 | +0.034 % | 1.501 / 1.501 / 1.500 |
- Lineal (sin levantamiento) SAP = Hekatan 0.0000 % en los 6. Las diferencias NL son la tolerancia 1e-4
  de SAP (ΣFz 60.012 en e/L = 1/3). SAP convierte el muelle de área en 14 400 gaps (4 por área).
- ⏳ SAFE y ETABS del barrido (el ejemplo Das sí tiene los cuatro).
