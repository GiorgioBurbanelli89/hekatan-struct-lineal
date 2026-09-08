# Artículo 2 (o apéndices del 1) — borrador de estructura (8-sep-2026)

**Título (propuesta):** Lo que los programas comerciales hacen por defecto: semánticas de modelado de
SAP2000, ETABS y SAFE medidas y reproducidas en un motor abierto

**Idea central:** dos programas del mismo fabricante no dan lo mismo con el mismo modelo, y no es
el elemento: es cómo cada uno interpreta muelles, diafragmas, uniones, paños y ficheros. Cada
semántica se aísla en un modelo mínimo, se mide por OAPI y se reproduce como una opción con nombre.
Dos creencias extendidas resultan falsas al medirlas.

## 1 · Introducción
- «Mismo modelo, misma malla» no basta: catálogo de las diferencias medidas (0.55 % unión viga–muro;
  4.5 % deck; 75 % Dead en un mezanine; 16 % modos altos por diafragma en el e2k…).
- Método: modelo mínimo + OAPI + bisección; SAP2000 primero.

## 2 · Interacción suelo–estructura (ISSE)
- 2.1 Muelle de área: SAP2000 y ETABS = nodal por área tributaria (0.0000 %). SAFE = nodal también
  (placa flexible ≤ 1.1 %); la matriz consistente ks·∫NᵀN se separa 23 % en las esquinas → el mito
  «SAFE mete el consistente» queda medido y refutado. El consistente se ofrece como opción
  (`areaspring`), con carga uniforme w = q/ks exacto en las dos formas.
- 2.2 Muelle de línea: nodal por longitud tributaria en los dos (0.0000 %); en ETABS va en U2.
- 2.3 Muelles de giro en la base: 4e-13 % / 2.5e-13 %.
- 2.4 Zapatas: 9 zapatas reales por `.f2k` (SAFE 1.5e-3 %), Guerra 1–8, SAFE consistente/nodal.
  Fuente: `validation/isse/`, `validation/04-cimentaciones-safe/`, README.

## 3 · Edge constraint y mallas no conformes
- Lo que ETABS hace de verdad: malla el paño por el nudo colgado, con automallado y también con
  `OBJMESHTYPE "NONE"` (14 nudos / 8 áreas de 3 objetos, un triángulo); ON = OFF.
- SAP2000 no conecta el nudo: misma malla no conforme = Hekatan con el nudo suelto (0.000 %).
- La restricción interpolada (Hermite en w, lineal en giros) como alternativa publicada
  (`edge etabs`), y por qué no coincide con ETABS.
- Deck: cookie-cut + peso a las vigas de borde (`deck etabs`, `oneway`): galpón 2e-5 %, mezanines
  1e-9 %; SAP2000 con sus herramientas (`--sapdeck`) hace lo mismo.
  Fuente: `validation/isse/edge_none*`, `validation/modelos/deck-edge/`.

## 4 · Uniones, diafragmas y masa
- Unión viga–muro de ETABS (`etabsjoint`), diafragma en ejes vs total, brazos rígidos automáticos y
  su efecto en la masa (+2.88 % en períodos), `LUMPATSTORIES`, masa solo lateral.
  Fuente: COMPARACION_VS_MUROS, CLAUDE.md, `masa_lump_etabs`.

## 5 · Ficheros de intercambio
- `.e2k`, `.s2k`, `.f2k` desde un mismo modelo; ida y vuelta 0.000 %.
- El diafragma del `.e2k` (D1 en tramos de columna y en áreas: 1.3–15.9 % más rígido) y el del
  `.s2k` (sin él, 0.5 % y 14 % en muros): dos errores de exportación cazados por bisección.
- Las cuatro leyes de SAFE al importar `.f2k` (COLUMN borra, campos por nombre, armadura, 0.1·J).
- Columnas piso a piso y estaciones repetidas en ETABS.
  Fuente: `validation/modelos/plantillas/`, README §ficheros.

## 6 · Secciones compuestas: CFT
- Section Designer (SAP2000 recalcula A, I, As, J) vs Filled Steel Tube (ETABS): As de Timoshenko
  sobre la sección transformada, J de Saint-Venant del compuesto; 0.006 % / 0.003 %; el círculo
  poligonizado de CSI (0.3–0.6 % en área).
  Fuente: CLAUDE.md §CFT, `tests/run.mjs cft`.

## 7 · Sólidos H8 con cáscaras y barras
- H8 con modos incompatibles, mezclado con Q4 y barras: SAP2000 1e-12 % estático, 2e-10 % modal;
  giros de nudos sólo-sólido eliminados; mecanismo si un muro apoya sólo en sólidos.
  Fuente: `tests/run.mjs solidos-mixtos`.

## 8 · Discusión: qué significa «validar contra un programa»
- Dos programas convergidos que no coinciden resuelven modelos distintos: se igualan hipótesis una
  a una, no se refina.
- Cada opción con nombre es una hipótesis explícita; el defecto de Hekatan es el de SAP2000 salvo
  donde Jorge decidió lo contrario (`etabsjoint`, `meshcross`), y se dice.

## 9 · Conclusiones

## Figuras
| # | qué | de dónde |
|---|---|---|
| F1 | placa flexible: SAFE vs nodal vs consistente (9 puntos) | `muelle_area_flexible.mjs` |
| F2 | modelo de análisis de ETABS con NONE (14 nudos, 8 áreas) | `edge_none_pointelm.json` (dibujar) |
| F3 | mezanine deck: reparto a vigas de borde | `validation/modelos/deck-edge/` |
| F4 | diafragma del e2k antes/después | `vs_muros/mini/` |
| F5 | CFT: SD vs Filled Tube | galpón-bodega-electoral |
| F6 | H8 + muro + columna | `tests/datos/mixto_solido_muro_columna.heks` |
