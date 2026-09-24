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
pero no la implementación. Este trabajo compara, por caja negra, el elemento de cáscara de cuatro
nudos de SAP2000/ETABS (membrana con giro normal, placa delgada y placa gruesa) con formulaciones
publicadas, reconstruyendo su matriz de rigidez por flexibilidad sobre ~140 geometrías. La placa
delgada coincide con el DKQ de Batoz y Tahar; la membrana queda a 1.42 % (media de 10 geometrías)
con el elemento de Ibrahimbegović–Taylor–Wilson y la proyección del giro de FEAP; para la placa
gruesa se usan formulaciones publicadas (MITC4 con modos incompatibles de Wilson, DKMQ), que en un
edificio dual cambian el primer período menos de 1 %. Implementadas en un motor abierto (Hekatan
Struct) se validan con las pruebas clásicas (rango, patch test, convergencia) y contra SAP2000 y
ETABS con la misma malla en ocho tipologías de edificio, un edificio con muros de corte y el
análisis modal, con las semánticas de modelado de cada programa expresadas como opciones con nombre.

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
  Fuente: `validation/02-placas/dse-de-wilson/README.md`.

## 3 · La membrana
- Allman + burbuja, Gauss 3×3, proyección del giro (B-barra, FEAP), penalización γ = 0.4 μ en el
  centro (medida por flexibilidad; el paper usa 1.0 y la formulación es insensible a γ).
- Tabla 3.1: K de membrana vs ETABS en 10 geometrías (1.42 % media). Tabla 3.2: patch test (1.5 /
  0.6 exactos), cantilever corto, Cook, hemisferio (Tabla IV del paper vs SAP vs Hekatan).
- Figura: las geometrías; curva de convergencia del hemisferio.
  Fuente: CLAUDE.md §membrana, `tests/casos/itw_seis_casos.mjs`, `banco-elemento/probar.py`.

## 4 · La placa delgada (DKQ)
- Batoz–Tahar con jacobiano real (el bounding box falla 37–44 % en distorsionadas).
- Tabla 4.1: K vs ETABS (1e-9 %) en las 5 geometrías; placa 8×8 en 5 espesores 0.000 %.

## 5 · La placa gruesa
- 5.1 Formulación: MITC4 (Bathe–Dvorkin 1985) con modos incompatibles de Wilson; alternativas
  DKMQ (Katili 1993) y DSE (Wilson, cap. 8).
- 5.2 Verificación independiente: rango, patch test MacNeal–Harder, convergencia a
  Reissner–Mindlin (apoyo duro, t/L 0.1 y 0.01).
- 5.3 Contra CSI (caja negra, misma malla): placa 8×8 en 5 espesores; edificio dual 2×2×4 con malla
  de 1 m, T1 según la placa gruesa (0.4871 DKQ / 0.4874 DKMQ).

## 6 · Esfuerzos en los joints como los reporta CSI
- Recuperación: DKQ en Gauss 2×2 extrapolado; membrana ITW sin burbuja en la recuperación (con
  ella 5.7 %); gruesa (MITC4) en Gauss 2×2 extrapolado; valor nodal = media de los joints vecinos
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
  en joints: la burbuja de la membrana).
- Por qué solo formulaciones publicadas: reproducibilidad; la diferencia con CSI en períodos de
  edificio es < 1 %.
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
| F3 | convergencia Reissner–Mindlin, 2 espesores | `shell_thick_convergencia.mjs` |
| F5 | colormap M11 losa plana: ETABS vs Hekatan | `cli/shot_plantillas_colormap.mjs` + captura ETABS |
| F6 | edificio A/B con muros (ya existe `VS_muros_hekatan.png`) | `cli/shot_vs_muros.mjs` |
| F7 | hemisferio: curva paper / SAP / Hekatan | `itw_seis_casos` |
| T1–T8 | las tablas de arriba | ficheros citados |
