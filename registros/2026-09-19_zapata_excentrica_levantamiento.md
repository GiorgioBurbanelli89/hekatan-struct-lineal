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
