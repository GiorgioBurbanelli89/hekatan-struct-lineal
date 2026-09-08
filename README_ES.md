# Hekatan Struct Lineal -- Analisis Estructural Open Source

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-GitHub%20Pages-green)](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/)

Plataforma web de ingenieria estructural con solver FEM en C++/Eigen compilado a WebAssembly. Funciona completamente en el navegador -- sin instalacion, sin servidor. Construido con Three.js para visualizacion 3D y VanJS para manejo reactivo de estado.

Basado en [awatif v2.0.0](https://github.com/madil4/awatif/tree/v2.0.0) de Mohamed Adil.

## Caracteristicas

- **Modelado estructural 3D** -- porticos, shells y edificios completos con visor interactivo Three.js
- **Analisis estatico** -- elastico lineal con vigas Timoshenko (ejes locales de CSI, `ang`, `as`, releases, brazos rigidos) y cascaras Q4
- **Analisis modal** -- solver de eigenvalores (Eigen C++ SparseLU) para frecuencias naturales y modos
- **Elementos Shell Q4** -- los de CSI: membrana ITW + burbuja con drilling (1e-13 % contra la celda 12x12 de ETABS), Shell-Thin = DKQ de Batoz-Tahar (0.000000 %), Shell-Thick extraido de `CsiGo2.dll` (1e-12 % en ~140 celdas medidas)
- **Deck / pisos membrana** -- `deck etabs [oneway]`: el pano se parte en los nudos de sus bordes y su peso/carga de area va a las vigas de borde por area tributaria, como ETABS (0.0000 %); sin la directiva se comporta como SAP2000 (1e-13 %)
- **Generadores parametricos** -- edificios, pergolas, cerchas, muros de contencion, taludes y 20+ modelos
- **Tutoriales interactivos FEM** -- 12 tutoriales paso a paso desde elementos barra hasta analisis modal
- **UI bilingue** -- soporte completo espanol/ingles en toda la interfaz
- **Importar/Exportar** -- ETABS (E2K), SAP2000 (S2K), SAFE (F2K), IFC (Revit/ArchiCAD), OpenSees (Python/Tcl)
- **Import auto-load** -- al importar E2K/S2K en cualquier ejemplo se navega a `?t=new-blank` con el modelo cargado como geometria CAD editable
- **Benchmarks W##** -- naming unificado (W1=barra axial, W2=viga, W3=armadura, W4=portico 2D, W5=torre 3D, W6=placa) que matchea entre hekatan-struct-lineal, ETABS, SAP2000, SAFE, Octave, MATLAB y Calcpad-Lab
- **Panel de calculo** -- calculadora tipo MATLAB con math.js, renderizado KaTeX y matematica simbolica (nerdamer)
- **Analisis no lineal** -- pushover Newton-Raphson y pushover ciclico
- **Brazos rigidos y releases** -- condensacion estatica para conexiones realistas
- **Validado** -- contra ETABS 22, SAP2000 24 y SAFE 20 con el MISMO modelo y la MISMA malla nudo a nudo: galpon de 609 nudos con deck 0.001 %, mezanines 1e-13 % (SAP) / 0.0000 % (ETABS), cimentaciones 0.01-0.29 %; suite `npm test` 499/499 y `pytest` 208

## ETABS · SAP2000 · SAFE · Hekatan Struct Lineal, frente a frente

Diferencia de cada árbitro con **Hekatan Struct Lineal**, mismo modelo, misma malla nudo a
nudo, mismas cargas (% del desplazamiento máximo salvo que se diga otra cosa). Hekatan es el
software; ETABS, SAP2000 y SAFE solo se usan para comprobarlo.

| qué se compara | interruptor de Hekatan | **SAP2000 24** | **ETABS 22** | **SAFE 20** |
|---|---|:---:|:---:|:---:|
| Solo barras — galpón, 609 nudos, `ang` + releases | — | **0.001 %** | **0.000 %** | — |
| Barras — modal, Paz & Leigh 6.3, 6 modos | — | — | **0.00 %** | — |
| Barras + deck — galpón, 609 nudos, paños de 4 nudos | — | **0.001 %** | 4.5 % ¹ → **0.001 %** con `--noedge` | — |
| Barras + deck — galpón, paños partidos en los nudos de borde | `deck etabs` | **3e-4 %** | **2e-5 %** | — |
| Mezanines 1×1 → 3×2 × 3 pisos — SCM, Viva, Ex | `deck etabs` | **1e-13 %** | **1e-9 %** | — |
| Mezanines — Dead (cada programa pesa su propio modelo) | `deck etabs` | **0.0000 %** | **0.0000 %** | — |
| Carga de área sobre membrana — transferencia propia de cada programa | `deck etabs` | **9e-13 %** ² | **2.5e-5 %** | — |
| Deck en un sentido (`ONEWAYLOADDIST`, `ANG 90`) | `deck etabs oneway` | n/a ³ | **0.0010 %** | — |
| Shell-Thin (DKQ) — 9 modos de la celda | `shelltype thin` | — | **0.000000 %** | — |
| Shell-Thin — placa 8×8, 5 espesores | `shelltype thin` | — | **0.000 %** | — |
| Shell-Thick (formulación de CSI) — K de ~140 celdas medidas | `shelltype thick` | **1e-12 %** | **1e-12 %** | — |
| Edificio con muros de corte, 6 pisos, losa, muros en X / en X e Y (3333 / 3981 nudos) — misma malla por OAPI y por fichero | `comparar` 0 (SAP2000) / 1 (unión viga-muro de ETABS) · `diafragmaNudos` | **0.0000 %** todos los nudos; 6 períodos idénticos a 4 decimales | **0.0000 %** todos los nudos; 6 períodos ≤ 0.6 % con su masa lateral | — |
| Exportador `.e2k`: el `DIAPH "D1"` sigue el mapa de diafragmas de Hekatan (antes iba en cada tramo de columna de 0.5 m y en toda la losa: 1.3–15.9 % más rígido en ETABS) | — | — | **0.0000 %** · 8 plantillas re-corridas: estático 0.000 %, modos 1–3 0.00 % | — |
| Muelle de área (Winkler, ISSE) contra muelles nodales por área tributaria | `spring` | **0.0000 %** | **0.0000 %** | consistente (−1.9 %) |
| Muelle de línea (viga de cimentación) contra muelles nodales por longitud tributaria | `spring` | **0.0000 %** | **0.0000 %** | — |
| Muelles de giro en la base (ISSE de zapata, kθ), `.heks` `spring n rx/ry/rz k`, misma malla por OAPI | `spring` | **4e-13 %** | **2.5e-13 %** | — |
| Fuerzas de cáscara joint a joint (`AreaForceShell` M11/M22/M12 en los 4 joints de cada cáscara, sin promediar) — Shell-Thin = DKQ en Gauss 2×2 extrapolado; 4 plantillas con losa, 3600–3760 joints cada una | `shelltype thin` | **0.0000 %** ⁶ | **0.0000 %** (centroide, joint y nudo) | — |
| Fuerzas de MEMBRANA joint a joint (F11/F22/F12; ITW tipo 12: Allman proyectada en Gauss 2×2 sin la burbuja, extrapolada) — dual con muros, 3760 joints | `drillingTypes 12` | **0.0000 %** (`etabsjoint 0`) | **0.0000 %** | — |
| Brazos rígidos AUTOMÁTICOS de ETABS (RZ = 0: no rigidizan; la viga no pesa ni masa el tramo dentro de la columna, ½ lado por extremo) — 8 plantillas con los brazos de ETABS **sin anular** | `offsets` 1 (ETABS, defecto) / 0 (SAP2000) | — | masa **0.000 %** · estático **0.000 %** · modos 1–3 **0.00 %** · fuerzas **0.000 %** | — |
| Sensibilidad al factor de la penalización (el 1000 del kernel, lo no publicado junto con la simetrización del cortante) | — | 10 → 100 000: w se mueve 0.07 %, M 0.16 %; de 1000 en adelante **< 0.001 %**: parámetro de estabilización, no calibración (`shell_thick_sensibilidad.mjs`). Se mantiene, con nombre y opcional, con MITC4/DKQ publicados como alternativa | | |
| Validez del Shell-Thick SIN CSI: rango (3 modos rígidos en 5 geometrías), patch test de curvatura constante (MacNeal–Harder, cuadriláteros distorsionados), convergencia a Reissner–Mindlin exacto (apoyo duro, 32×32) | — | patch test **6.9e-11 %** (gruesa) / **6.6e-13 %** (DKQ) · w 0.12 % / M 0.29 % (t/L 0.1) · w 0.065 % / M 0.24 % (t/L 0.01), sin bloqueo — `validation/02-placas/SHELL_THICK_FUENTES_Y_VALIDEZ.md` | | |
| Edge constraint con `OBJMESHTYPE "NONE"` (modelo de análisis leído por `PointElm`/`AreaElm`) | `deck etabs` | = Hekatan con el nudo suelto **0.000 %** | ETABS **malla el paño por el nudo igual** (14 nudos / 8 áreas de 3 objetos, una triangular): «NONE» no evita el cookie-cut; la «Hermite» de la mañana era el campo suave de esa malla | — |
| Muelle de ÁREA de SAFE = nodal, no consistente (placa 4×4, t = 0.20, ks = 20000, P = 1000 al centro, 8×8) | `areaspring … nodal` / `areaspring` | — | — | nodal **≤ 1.1 %**; consistente 23 % en esquinas → el «−1.9 % = matriz consistente» del 20-ago no se sostiene |
| Plantilla dual, empuje lateral (forma del 2.º modo), e2k arreglado | `etabsjoint 1` | — | **0.00 %** en las 4 plantas | — |
| Edge constraint (nudo colgado en la arista de un paño) | `deck etabs` | n/a | por defecto ETABS **malla por el nudo** (ON = OFF); la restricción interpolada solo con `OBJMESHTYPE "NONE"` | — |
| Shell-Thick — mezanine losa maciza, 1284 nudos | `shelltype thick` | **< 1e-6 %** | **< 1e-6 %** | — |
| 6 tipos de losa (deck, membrana, thin, thick, nervada, waffle) | — | — | **< 3e-7 %** | — |
| Membrana / drilling — celda 12×12, 9 geometrías | `drillingTypes 12` | — | **1e-13 %** | — |
| Drilling — 2 muros + viga de acople, 92 nudos | — | **2.5e-12 %** | — | — |
| Unión viga-muro — plantilla dual con muros, modos 1–3 | `etabsjoint 1` | — | **0.00–0.01 %** | — |
| Diafragma rígido — 8 plantillas, masa · modos 1–3 | `diaph` | **0.0000 %** (mezanine) | **0.000 %** · **0.00–0.01 %** | — |
| Masa ensamblada — galpón, `AssembledJointMass` | — | — | **0.000 %** | — |
| Zapata sobre Winkler — Shell-Thin, muelles nodales | `spring` | **1e-9 %** | — | **1e-9 %** |
| Zapata sobre Winkler — muelle de **área** de SAFE | `spring` | — | — | 1.92 % ⁴ |
| 5 benchmarks de cimentación (w_max) | — | — | — | **0.01–0.29 %** |
| Zapata corrida, shell + barras | — | — | — | **0.01 %** |
| Ida y vuelta por fichero (Hekatan → fichero → programa → Hekatan) | — | `.s2k` **0.000 %** | `.e2k` **0.000 %** | — |
| Cimentación real leída del fichero — 9 zapatas, pedestales, vigas de amarre, 225 muelles nodales | `spring` | `.s2k` **1.2e-8 %** | `.e2k` **1.4e-8 %** | `.f2k` **1.5e-3 %** ⁵ |

¹ ETABS con sus defectos conecta el paño de piso a todo nudo que cae en sus bordes (edge
constraint) y lo corta en las vigas que lo cruzan; SAP2000 solo conecta los 4 nudos. Sin el
interruptor Hekatan se comporta como SAP2000; con `deck etabs`, como ETABS (ver la sección del deck).
² SAP2000 pone el peso y la carga de área de una membrana en sus 4 esquinas, como Hekatan sin interruptor.
³ SAP2000 no tiene reparto en un sentido.
⁶ Con el `.s2k` que lleva el diafragma (los del 3-sep no lo llevaban y SAP daba 0.5–0.9 %). SAP2000 y ETABS listan los mismos joints a 0.0000 % en las losas; en la dual difieren 6.9 % por la unión viga-muro (`etabsjoint 1` = ETABS, `etabsjoint 0` = SAP2000). Hekatan reporta el signo de CSI (M11 > 0 = tracción abajo) desde el 8-sep-2026.
⁴ El Winkler por defecto de SAFE es un muelle de *área*; el de Hekatan (y SAP2000) es nodal. El
1.92 % es la diferencia entre los dos modelos, no un error; con muelles nodales SAFE cierra a 1e-9 %.
⁵ SAFE imprime los desplazamientos con 6 decimales en m (0.0005 mm sobre 32 mm): ese es el 1.5e-3 %, no el solver. Cuatro leyes de SAFE medidas por el camino (`f2kExporter.ts`): una tabla `COLUMN OBJECT CONNECTIVITY` le hace tirar todas las losas y vigas; las tablas quieren el *nombre* del campo (`"Stiffness UZ"`), con la clave se queda callado en 200 kN/m; una sección de hormigón sin material de armadura se rechaza entera; y SAFE analiza las vigas con **0.1·J**, así que el fichero lleva 10·J.

Regla de la casa: **primero se compara con SAP2000** (solo conecta lo que se malla: mide el solver) y **despues con ETABS**, anadiendo a Hekatan lo que ETABS hace como un interruptor con nombre que se puede apagar (`deck etabs`, `etabsjoint`, `meshcross`). Nunca se tuerce el motor hacia ETABS en silencio.

## Inicio Rapido

Visitar el despliegue en vivo: [giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/)

Para ejecutar localmente:

```bash
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal && npm install
cd examples && npm install
npm run dev    # abre localhost:4600
```

## Capturas de Pantalla

<!-- TODO: Agregar capturas del visor 3D, panel de calculo y generadores parametricos -->

## Arquitectura

```
hekatan-fem/     Solver FEM C++/Eigen compilado a WASM (334 KB)
                - deform.cpp (estatico), modal.cpp (eigenvalores)
                - Shell Q4, vigas Timoshenko, brazos rigidos
                - Eigen 3.4.0 SparseLU + GeneralizedEigenSolver

examples/       UI Three.js + modelos estructurales parametricos
                - getCad3d.ts (FEM Studio con 25+ generadores)
                - calc-editor/ (calculadora tipo MATLAB)
                - tutorials/ (12 tutoriales interactivos FEM)

hekatan-ui/      Visor (Three.js), parametros (Tweakpane), toolbar (VanJS)
```

## Stack Tecnologico

| Tecnologia | Proposito |
|-----------|---------|
| C++ / Eigen 3.4 | Solver FEM (SparseLU, eigenvalores) |
| Emscripten | Compilador C++ a WebAssembly |
| Three.js | Renderizado 3D (WebGL) |
| VanJS | Manejo de estado reactivo (1.5 KB) |
| math.js + KaTeX | Calculadora y renderizado de ecuaciones |
| web-ifc | Parser de geometria IFC (WASM) |
| Vite | Herramienta de build y servidor de desarrollo |

## Creditos

- [awatif v2.0.0](https://github.com/madil4/awatif/tree/v2.0.0) de Mohamed Adil -- framework original
- [Eigen 3.4](https://eigen.tuxfamily.org/) -- libreria de algebra lineal C++
- [web-ifc](https://github.com/ThatOpen/engine_web-ifc) -- parser IFC de That Open Company

## Autor

**Jorge Burbano** -- Ingeniero Estructural, Ecuador

## Licencia

Licencia MIT. Ver [LICENSE](LICENSE) para detalles.
