# Artículo 1 — borrador de estructura (8-sep-2026)

**Título (propuesta):** Identificación y verificación independiente del elemento de cáscara de
SAP2000/ETABS en un motor abierto de elementos finitos

**Título alternativo:** Un elemento de cáscara reproducible: la formulación de CSI reconstruida
por rigidez, verificada con patch test y convergencia, y validada nudo a nudo contra SAP2000 y ETABS

**Autores:** Jorge … (Hekatan) · … · agradecimiento a Ganchovski (Calcpad) y a Awatif donde toque.

**Palabras clave:** elemento de cáscara, drilling, Reissner–Mindlin, DKQ, identificación de
formulación, verificación, SAP2000, ETABS, software abierto.

---

## Resumen (200–250 palabras)

Los programas comerciales de análisis estructural documentan las referencias de sus elementos
pero no la implementación. Este trabajo identifica la formulación completa del elemento de cáscara
de cuatro nudos de SAP2000/ETABS (membrana con giro normal, placa delgada y placa gruesa)
reconstruyendo su matriz de rigidez por flexibilidad sobre ~140 geometrías y comparándola con
formulaciones publicadas. La membrana resulta ser el elemento de Ibrahimbegović–Taylor–Wilson con
proyección del giro y estabilización de reloj de arena; la placa delgada, el DKQ de Batoz y Tahar;
la placa gruesa, el elemento de cortante discreto de Wilson con dos ingredientes no publicados: un
cortante de lado simetrizado y una penalización de la divergencia del giro. Los dos se identifican
y se verifican con las pruebas clásicas independientes del programa: rango, patch test de curvatura
constante (error 1e-11), convergencia a la solución exacta de Reissner–Mindlin sin bloqueo e
insensibilidad al factor de penalización. Implementados en un motor abierto (Hekatan Struct),
reproducen SAP2000 y ETABS con la misma malla a 1e-12 % en rigidez, 0.0000 % en desplazamientos
y 0.0000 % en esfuerzos joint a joint (flexión y membrana, 3 600–3 760 joints por modelo) en ocho
tipologías de edificio, un edificio con muros de corte y el análisis modal, con las semánticas de
modelado de cada programa expresadas como opciones con nombre.

## 1 · Introducción
- El problema: verificar contra un programa comercial sin saber qué resuelve. Manual de CSI: cita
  fuentes (Taylor–Simo 1985; Ibrahimbegović–Wilson 1991; Mindlin/Reissner) pero no la implementación.
- Estado del arte breve: Allman 1984; ITW 1990/1991; Batoz–Tahar 1982; Bathe–Dvorkin 1985;
  Ibrahimbegović 1993; Wilson (libro, cap. 8); MacNeal–Harder 1985; Flanagan–Belytschko 1981.
- Aporte: (i) método de identificación por reconstrucción de rigidez; (ii) formulación completa,
  con lo publicado citado y lo no publicado señalado; (iii) verificación independiente; (iv)
  validación de sistema a 0.0000 % en dos programas con semánticas distintas.
- Regla metodológica: primero SAP2000 (mide el solver), después ETABS (sus defectos se nombran).

## 2 · Método de identificación
- Reconstrucción de K por flexibilidad (cargas unitarias por OAPI, 12/24 gdl), geometrías:
  cuadrado, rectángulo, 27 trapecios, cuadriláteros irregulares, barridos t/ν/L, modificadores.
- Emparejamiento de modos por valor y por vector (MAC), no por orden.
- Bisección de hipótesis: cada ingrediente se cambia solo y se mide el residuo.
- Tabla 2.1: residuos por hipótesis (MITC4 101 %, DSE ~96 %, PQ2/PQ3, ITW 1991, … , final 1e-12 %).
  Fuente: `validation/02-placas/dse-de-wilson/README.md`, `registros/2026-09-02_binario_drilling_shellthick.md`.

## 3 · La membrana
- Allman + burbuja, Gauss 2×2, proyección del giro (B-barra, FEAP), penalización γ = 0.4 μ en el
  centro, reloj de arena del θz con 2e-4 (medido).
- Tabla 3.1: K de membrana vs ETABS en 9 geometrías (1e-13 %). Tabla 3.2: patch test (1.5 / 0.6
  exactos), cantilever corto, Cook, hemisferio (Tabla IV del paper vs SAP vs Hekatan: −1.1 % a 8×8).
- Figura: las 9 geometrías; curva de convergencia del hemisferio.
  Fuente: CLAUDE.md §membrana, `tests/casos/itw_seis_casos.mjs`, `galpon-bodega-electoral/memb12.json`.

## 4 · La placa delgada (DKQ)
- Batoz–Tahar con jacobiano real (el bounding box falla 37–44 % en distorsionadas).
- Tabla 4.1: K vs ETABS (1e-9 %) en las 5 geometrías; placa 8×8 en 5 espesores 0.000 %.

## 5 · La placa gruesa
- 5.1 Formulación: giros con 9 funciones (4 + 4 de lado + burbuja, 2 componentes), w bilineal;
  curvaturas; 4 cortantes de lado (Wilson 8.7) con 2/3 del modo jerárquico; campo covariante con
  parte lineal simetrizada m = (b+d)/2; penalización 1000·(D11+D22+D33)·∫(div θ)²; 8 puntos (ITW
  1991); B-barra en las 10 columnas internas; condensación saltando pivotes nulos.
- 5.2 Tabla 5.1: cada pieza con su fuente (publicada / identificada). Fuente:
  `validation/02-placas/SHELL_THICK_FUENTES_Y_VALIDEZ.md` §1.
- 5.3 Verificación independiente: rango (3 modos nulos en 5 geometrías; 4 sin la penalización);
  patch test MacNeal–Harder (6.9e-11 %); convergencia a Reissner–Mindlin apoyo duro (t/L 0.1 y
  0.01; tabla 4/8/16/32); sensibilidad al factor (10 → 1e5; tabla).
- 5.4 Lo que da CSI (medida, no fundamento): K 1e-12 % en 140 celdas; placa 4×4 vs SAP2000 esfuerzos
  0.026 % joint a joint; losa gruesa de edificio 0.075 %.
- Figuras: esquema de gdl (22 → 12); modo φ; curvas de convergencia; barrido del factor.

## 6 · Esfuerzos en los joints como los reporta CSI
- Recuperación: DKQ en Gauss 2×2 extrapolado; membrana ITW sin burbuja en la recuperación (con
  ella 5.7 %); gruesa con los 10 internos recuperados; valor nodal = media de los joints vecinos
  (sin barras); signo de CSI.
- Tabla 6.1: 4 plantillas × {M11 M22 M12, F11 F22 F12} × {ETABS, SAP2000}: 0.0000 % (centroide,
  joint, nudo). Fuente: `validation/modelos/plantillas/COMPARACION.md` capa 5; `cli/_joints_vs_csi.mjs`.
- Figura: colormap M11 ETABS vs Hekatan en la losa plana (pico sobre columna 57.8 vs 4.2 antes).

## 7 · Validación de sistema
- 7.1 Ocho plantillas (pórtico 2D/3D, pórtico con losa, rejilla, losa plana, losa con vigas de
  borde, dual con muros, arriostrado), misma malla por fichero: masa 0.000 %, estático 0.000 %,
  modos 1–3 0.00 %, fuerzas de barra 0.000 %, cáscaras 0.0000 %. Fuente: COMPARACION.md.
- 7.2 Edificio con muros A/B (3333/3981 nudos): SAP2000 con `comparar=0` 1e-11 %; ETABS con
  `comparar=1` 0.0000 %; seis períodos a cuatro decimales (SAP, masa completa) y ≤ 0.6 % (ETABS,
  masa lateral). Fuente: `validation/modelos/vs_muros/COMPARACION_VS_MUROS.md`.
- 7.3 Semánticas con nombre: unión viga–muro, diafragma en ejes vs total, brazos rígidos, deck
  (edge constraint + cookie-cut), masa lateral y por stories. Tabla 7.2: qué hace cada programa
  y qué interruptor lo reproduce.
- 7.4 Modal: Paz–Leigh 6.3, seis modos al cuarto decimal.

## 8 · Discusión
- Qué es identificable por rigidez y qué no (la estructura interna sólo se fija con los esfuerzos
  en joints: la burbuja de la membrana, los internos de la gruesa).
- Los dos ingredientes no publicados: por qué son defendibles (estabilización de un modo de
  energía nula; insensibilidad) y por qué no se atribuyen a nadie.
- Límites: cáscara curva en malla gruesa; triángulos colapsados; lo que sigue sin medir.

## 9 · Conclusiones

## Referencias (las que ya están en `registros/papers_shell_csi/`, `ibrahimbegovic_1993/`, `libros/wilson_cap8_DSE/`)
Allman 1984; Batoz & Tahar 1982; Bathe & Dvorkin 1985; Flanagan & Belytschko 1981; Hughes 1987;
Ibrahimbegović, Taylor & Wilson 1990; Ibrahimbegović & Wilson 1991 (CANM 7 y IJNME 31);
Ibrahimbegović 1993; MacNeal & Harder 1985; Taylor & Simo 1985; Wilson (Three-Dimensional Static and
Dynamic Analysis of Structures); CSI Analysis Reference Manual; Paz & Leigh.

## Figuras y tablas a regenerar en calidad de imprenta (PNG 300 dpi o SVG)
| # | qué | de dónde |
|---|---|---|
| F1 | las 5 geometrías de celda y los 27 trapecios | `galpon-bodega-electoral/memb12.json`, dse-de-wilson |
| F2 | gdl del Shell-Thick (22 → 12) y el modo φ | dibujar (LISP/Manim) |
| F3 | convergencia Reissner–Mindlin, 2 espesores | `shell_thick_convergencia.mjs` |
| F4 | barrido del factor de penalización | `shell_thick_sensibilidad.mjs` |
| F5 | colormap M11 losa plana: ETABS vs Hekatan | `cli/shot_plantillas_colormap.mjs` + captura ETABS |
| F6 | edificio A/B con muros (ya existe `VS_muros_hekatan.png`) | `cli/shot_vs_muros.mjs` |
| F7 | hemisferio: curva paper / SAP / Hekatan | `itw_seis_casos` |
| T1–T8 | las tablas de arriba | ficheros citados |
