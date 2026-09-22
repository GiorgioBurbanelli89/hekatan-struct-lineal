# Auditoría del Tweakpane del workspace — 18-sep-2026

**Rama:** `sin-binario` · **NO se tocó código** (solo auditoría) · sin commit, sin deploy.
**Cómo se midió:** bundle local (`npx vite --port 5199` sobre `examples/`) + Chrome del
sistema por puppeteer (`headless: "new"`). Se pulsó **botón por botón** (110 en el panel
derecho) y se comparó una firma del estado antes/después (DOM, nº de paneles, localStorage,
`__hekatanCadState`, blobs de descarga, consola, alertas).

⚠️ **Otra sesión está editando `examples/src/workspace/main.ts` en vivo.** Los números de
línea son de la copia de las **19:50 del 18-sep-2026** (`md5 55de0ed8bd39b1db27977c2c95c6c32e`).
Entre mi primera lectura (19:30) y la última (19:50) las líneas ya se habían corrido +20.
No hubo conflicto porque no escribí nada en `examples/src/`.

Capturas: `registros/img/2026-09-18_tweakpane/`
 · `01_menu_*` (arranque) · `02_edificio_*` (panel plegado) · `03_edificio_todo_*` (todo desplegado).

---

## ✅ Funcionó
- Levantar el bundle local y dumpear el árbol REAL del panel (no el código) por DOM.
- Pulsar los 110 botones del panel derecho con detección de efecto.
- Instrumentar `URL.createObjectURL`, `a.click`, `input[file].click`, `window.open` y `alert`
  para cazar descargas y avisos (sin eso, un botón que baja un fichero parecía muerto).
- Capturar los diálogos flotantes (`__hekatanOpenMaterialsList`, `OpenMaterialEditor`,
  `OpenDisplayUnits`), que es donde están los nombres de CSI en inglés.

## ❌ No funcionó / datos del encargo que NO se reproducen
- **`slider_setMode` en `getModalPanel.ts:368` ya no existe.** El fichero se reescribió
  (está modificado sin commitear); hoy el clic de fila llama a `alElegirModo(i)` y el propio
  comentario de la línea 250 explica que antes llamaba a un `slider_setMode` inexistente.
- **Los `timings` clavados de `femToolsRegistry.ts:158` ya están arreglados**: hoy dice
  `timings: undefined` con el comentario «un tiempo inventado es peor que ningún tiempo».
- **La carpeta «⚡ Modal + Animación» NO está duplicada.** Las dos líneas (6378/6379) son las
  dos ramas de UN ternario. Medido en `test-m-dual`: tras cargar, correr modal, cambiar pisos
  (rebuild) y volver a correr → **siempre 1 carpeta**, 0 títulos vacíos.
- **El título «🔢» NO sale vacío**: es `"🔢 " + label` y en el único ejemplo con parámetros
  modales sale «🔢 N° de modos (subir si masa <90%)».
- Las descargas no se pueden contar con `Browser.setDownloadBehavior` en headless: hay que
  enganchar `createObjectURL`/`a.click` (por eso «PNG de la vista» parecía muerto y no lo está).

## ⏳ Falta
- Aplicar la reorganización (este documento es la propuesta; no se tocó nada).
- Medir el panel del CAD puro (`?t=new-blank`) y el de `cad-editor`, que tienen su propio
  `viewController.ts`; aquí se auditó el workspace con `?t=edificio-aporticado` (el más cargado).

---

## 1. Inventario

Cuentas reales en `main.ts`: **36 `addFolder` · 71 `addBinding` · 60 `addButton`** (confirmado).
Pero el panel que ve Jorge es la suma de **cinco** ficheros:

| Fichero | Qué mete | Tamaño |
|---|---|---|
| `examples/src/workspace/main.ts` | selector, Vista, CLI, cimentación, ETABS/SAP, Unidades, params, Calculados, Modal | 36 F / 71 B / 60 Btn |
| `hekatan-ui/src/cad/getCadPanel.ts` | «✏ Herramientas CAD» entera (15 carpetas) | ~60 botones |
| `hekatan-ui/src/femTools/attachFemTools.ts` | «🛠 Herramientas FEM» (7 botones) | 7 |
| `examples/src/workspace/loadPatternsPanel.ts` | Load Patterns / Cases / Combinations | 3 carpetas |
| `hekatan-ui/src/viewer/settings/getSettings.ts` | **panel IZQUIERDO** (#settings): Grid, Ver, Analysis Inputs, Analyze, Cortes | 6 carpetas |
| `examples/src/shared/panelEspectral.ts` | «🌀 Espectral dinámico (NEC)» (6 controles + 1 botón) | contextual |
| `examples/src/shared/getCad3d.ts` | paneles propios de ejemplos legacy (no del workspace) | — |

`hekatan-ui/src/modalPanel/getModalPanel.ts` **no usa Tweakpane**: es una tabla DOM flotante.

### 1.1 Panel DERECHO — tabla

Frecuencia: **S** = cada sesión · **V** = de vez en cuando · **M** = una vez al mes o menos.

| Elemento | archivo:línea | Qué hace | ¿Funciona? | Frec. | Destino propuesto |
|---|---|---|---|---|---|
| Categoría (select) | main.ts:3795 | filtra la lista de ejemplos | sí | S | 📐 Modelo ▸ Ejemplo |
| Ejemplo (select) | main.ts:3832 | carga el ejemplo | sí | S | 📐 Modelo ▸ Ejemplo |
| 📂 Cambiar de ejemplo (carpeta) | main.ts:3792 | contenedor de los dos de arriba | sí | S | 📐 Modelo |
| ℹ Ejemplo con panel propio ▸ ↻ Recargar | main.ts:3870 | recarga el ejemplo legacy | sí | M | Menú ▸ Ejemplos |
| ℹ … ▸ **(trae sus propios controles)** | main.ts:3875 | **nada: `.on("click", () => {})`** | **MUERTO** | — | borrar (es un cartel, no un botón) |
| 🛠 Herramientas FEM (carpeta) | attachFemTools.ts:77 | 7 paneles flotantes | sí | M | Menú ▸ Estudio |
| 🔍 Inspect | attachFemTools.ts:83 | K local del 1er frame + KaTeX | sí | M | Menú ▸ Estudio |
| 📈 Modal+ ASCE 7-22 | attachFemTools.ts:89 | corre modal y abre tabla | sí | V | ▶ Cálculo ▸ Modal |
| 📜 Solver Log **+ tiempos** | attachFemTools.ts:94 | estadísticas del modelo | sí, **pero ya no hay tiempos** | M | Menú ▸ Estudio, renombrar |
| 🧮 Calculadora FEM | attachFemTools.ts:99 | panel tipo MATLAB | sí | M | Menú ▸ Estudio |
| 💻 CLI cad.* | attachFemTools.ts:104 | terminal flotante | sí | M | Menú ▸ Estudio |
| 📄 Report Explained | attachFemTools.ts:109 | PDF imprimible | sí | M | Menú ▸ Estudio |
| ▶ Calcular (forzar re-build) | attachFemTools.ts:114 | recalcula | sí | S | ▶ Cálculo (arriba del todo) |
| Vista (carpeta) | main.ts:3899 | cámara + imagen | sí | S | 👁 Vista |
| 🏗 Isométrica / ⬇ Planta / → Elev X / ↑ Elev Y | main.ts:3900-3903 | mueve la cámara | sí (los 4) | S | 👁 Vista |
| 📷 Imagen y GIF ▸ 📷 PNG de la vista | main.ts:3911 | baja `hekatan_struct.png` | **sí** (blob 158 KB medido) | V | 👁 Vista ▸ Imagen |
| … frames / ms-frame (2 sliders) | main.ts:3918-3919 | ajustes del GIF | sí | V | 👁 Vista ▸ Imagen |
| … 🎞 GIF orbitando | main.ts:3920 | genera el GIF | sí | V | 👁 Vista ▸ Imagen |
| 🔀 Vista doble ▸ Activar / Panel derecho | main.ts:4063-4064 | split | sí | V | 👁 Vista |
| 🔀 … ▸ 🔄 Re-encuadrar derecha | main.ts:4068 | reencuadra la mitad derecha | **no hace nada con el split apagado** | V | fusionar con «Activar» |
| 🎬 Demo simulador CAD | main.ts:4077 | animación de demostración | sí | M | Menú ▸ Estudio |
| 📍 Ejes (frames individuales) ▸ Eje A/B/C/1/2/3 | main.ts:4104/4116 | aísla el pórtico de ese eje | sí (6/6) | V | 👁 Vista ▸ Ejes |
| 📍 … ▸ **(modelo vacío — dibujá nodos)** | main.ts:4096 | **nada: `() => {}`** | **MUERTO** | — | borrar (cartel) |
| 📍 … ▸ 👁 Mostrar ejes en escena | main.ts:4135 | dibuja los ejes | sí | V | 👁 Vista ▸ Ejes |
| ✏ Herramientas CAD (15 carpetas) | getCadPanel.ts:64 | dibujo, snap, ejes, selección, IA | ver 1.2 | S (dibujando) | 📐 Modelo ▸ Dibujar |
| 💻 CLI Comandos (carpeta + textarea) | main.ts:4240 | escribir el modelo en texto | sí | V | 📐 Modelo ▸ Texto (.heks) |
| ▶ Ejecutar ahora | main.ts:4340 | aplica el script | sí | V | igual |
| Comparar con (SAP2000/ETABS) | main.ts:4353 | mete/quita las directivas de semántica | sí | V | ▶ Cálculo ▸ Semánticas **(está DUPLICADO, ver 2.6)** |
| 🗑 Limpiar comandos | main.ts:4363 | vacía el textarea | sí | V | igual |
| 📂 Abrir .heks | main.ts:4386 | abre el selector de fichero | sí (`input[file].click`) | V | Menú ▸ Archivo |
| 💾 Guardar como… .heks | main.ts:4426 | pide nombre y baja | sí | V | Menú ▸ Archivo |
| 🔗 Compartir enlace | main.ts:4443 | URL con el modelo | sí | V | Menú ▸ Archivo |
| **💾 Guardar .heks** | main.ts:4539 | baja `modelo.heks` sin preguntar | **duplicado y peligroso** (ver 2.2) | V | borrar |
| 📂 Importar .tcl (OpenSees) | main.ts:4568 | abre selector | sí | M | Menú ▸ Archivo |
| **💾 Exportar .tcl (OpenSees)** | main.ts:4569 | baja `modelo.tcl` | **baja 93 bytes con el edificio cargado** | M | Menú ▸ Archivo, arreglar |
| 📋 Pórtico 2D (inline) | main.ts:4585 | pega un ejemplo en el CLI | sí | M | Menú ▸ Archivo ▸ Plantillas CLI |
| 📋 Cantilever (inline) | main.ts:4606 | idem | sí | M | idem |
| **📋 Pórtico 2D (bloques)** | main.ts:4616 | pega un ejemplo en el CLI | **ROTO**: «L8: comando desconocido "elements"» | M | arreglar o borrar |
| 📥 Importar archivo (carpeta) | main.ts:4654 | IFC / F2K / limpiar | sí | M | Menú ▸ Archivo |
| SAFE ▸ 📤 Exportar F2K / 📥 Importar F2K | main.ts:4728/4796 | cimentación a SAFE | sí | M | Menú ▸ Archivo ▸ CSI |
| 🪨 Cimentación FEM (toggle) ▸ Ver TODAS las zapatas | main.ts:4870 | aísla la cimentación | sí | V | 📐 Modelo ▸ Cimentación |
| 🪨 Cimentación (diseño + SAFE F2K) | main.ts:4905 | carpeta | sí | V | 📐 Modelo ▸ Cimentación |
| … Cardinal Point col. | main.ts:4917 | punto de inserción de la columna | sí | M | 📐 Modelo ▸ Cimentación |
| … 👁 Calcular y ver cimentación | main.ts:4947 | diseña zapatas | sí, **pero exige correr antes el análisis** (avisa) | V | ▶ Cálculo ▸ Cimentación |
| … 🏢 Volver a vista superestructura | main.ts:5236 | sale de la vista aislada | sí (avisa si no hay) | V | fusionar en un solo interruptor |
| … 🧮 Análisis FEM solo cimentación | main.ts:5266 | corre la cimentación sola | sí | V | ▶ Cálculo ▸ Cimentación |
| … 📤/📥 F2K cimentación COMPLETA | main.ts:5558/5664 | exporta/importa | sí | M | Menú ▸ Archivo ▸ CSI |
| 🔗 Origen ▸ ← Volver a … | main.ts:5696 | vuelve al modelo que te trajo | sí | M | barra de arriba (ya hay «← Volver») |
| 📋 Load Patterns (+ subcarpeta por patrón) | loadPatternsPanel.ts:114 | patrones de carga | sí | V | 📐 Modelo ▸ Cargas |
| 📊 Load Cases | loadPatternsPanel.ts:182 | casos | sí | V | 📐 Modelo ▸ Cargas |
| Σ Load Combinations | loadPatternsPanel.ts:265 | combinaciones | sí | V | 📐 Modelo ▸ Cargas |
| ⚡ Generar NEC-SE-CG | loadPatternsPanel.ts:308 | combos de norma | sí | V | 📐 Modelo ▸ Cargas |
| ETABS ▸ Peso propio / Cargas aplicadas a | main.ts:5763/5776 | opciones del e2k | sí | M | Menú ▸ Archivo ▸ CSI |
| ETABS ▸ 📤 Exportar E2K / 📥 Importar E2K | main.ts:5780/5821 | e2k | sí | V | Menú ▸ Archivo ▸ CSI |
| SAP ▸ CFT en SAP / 📤 S2K / 📥 S2K | main.ts:5749/5880/5898 | s2k | sí | V | Menú ▸ Archivo ▸ CSI |
| Unidades ▸ Fuerza / Desplazamiento | main.ts:5942/5968 | unidades de lectura | sí | S | 📏 Unidades |
| Unidades ▸ 🔲 Auto-mesh shells | main.ts:5979 | mallado tipo ETABS | sí | V | ▶ Cálculo ▸ Malla **(no es una unidad)** |
| 🌐 Sistema (preset) | main.ts:5988 | MKS / SI / Imperial | sí | S | 📏 Unidades (a la vista) |
| 📐 Display Units (granular) (4 selects) | main.ts:6015 | unidad por magnitud | sí | M | Menú ▸ Preferencias |
| 📏 Rangos (min/max de cada slider) | main.ts:6289 | cambia los topes | sí | M | Menú ▸ Preferencias |
| 📖 Guía de pasos | main.ts:6323 | los pasos del ejemplo | sí | V | 📐 Modelo (arriba, plegable) |
| Params del ejemplo (Geometría, Secciones, Cargas, Apoyo, Avanzado, Mesh, Losas, Muros, Cimentación, Vigas Secundarias, Secciones por piso, Luces por vano, Alturas por piso) | main.ts:6088 (bucle) | los parámetros | sí, **con duplicados** (ver 2.6) | S | 📐 Modelo |
| 📊 Calculados | main.ts:6348 | resultados de diseño en texto | sí | S | 📊 Resultados |
| ⚡ Modal + Animación | main.ts:6378 | correr modal, tabla, espectro | sí | V | ▶ Cálculo ▸ Modal |
| 🌀 Espectral dinámico (NEC) | panelEspectral.ts:34 | 6 parámetros + correr | sí (donde aplica) | V | ▶ Cálculo ▸ Espectral |

### 1.2 «✏ Herramientas CAD» (getCadPanel.ts) — 15 carpetas

Todas las herramientas de dibujo (Nodo, Línea, Polilínea, Rectángulo, Círculo, Arco,
Parábola, Cúbica, líneas/puntos auxiliares, Medir, las 10 de Áreas, las 4 de 3D, las 3 de
Modificar) **funcionan**: cambian el tool activo, que es todo lo que pueden hacer sin un clic
en el lienzo. Se comprobaron una a una. Frecuencia **S** dibujando, **M** si trabajas con
ejemplos paramétricos.

Lo que NO respondió (y por qué):

| Botón | línea | Medido | Diagnóstico |
|---|---|---|---|
| ▦▦ Llenar TODAS las celdas cerradas | 150 | sin cambio | necesita celdas cerradas; además el aviso va a `__hekatanCadUpdateStatus`, **que no existe en el workspace** → trabaja en silencio |
| ⬛ Enderezar plano a XY | 174 | sin cambio | ya estaba en XY (no avisa) |
| 📐 Mostrar/ocultar planos de ref. | 388 | sin cambio en DOM ni en `cadState` | el estado vive en una variable local (`refPlanesVisible`): el botón no dice si está encendido |
| Piso a Z=0 / 6 / 9 m | 540 | 3 de 5 sin cambio | mueve la rejilla al Z ya activo |
| ➕ Agregar nivel / 🏢 Niveles típicos | 677/683 | sin cambio visible | los niveles se pintan en la escena 3D, no en el DOM |
| 🗑 Limpiar selección | 926 | sin cambio | no había nada seleccionado |
| **📋 Copiar comandos a CLI** | 519 | copia `__hekatanCliScript`, **que no existe** | **copia una cadena VACÍA y aun así alerta «Comandos copiados»** |
| 💬 AI Assistant (Provider, Modelo, API Key) | 993 | pinta | fuera de sitio dentro de las herramientas de dibujo; frecuencia M |

### 1.3 Panel IZQUIERDO (#settings, `getSettings.ts`)

| Carpeta | Controles | Frec. | Destino |
|---|---|---|---|
| Display scale (suelto arriba) | 1 slider | V | 👁 Vista |
| 📐 Grid (+ ⚙ Ajuste fino) | 4 + 5 | V | 👁 Vista ▸ Rejilla |
| 👁 Ver | 19 casillas | S | 👁 Vista ▸ Mostrar (hay 6 que se pisan, ver 2.6) |
| 📌 Analysis Inputs | 4 casillas | S | 👁 Vista ▸ Mostrar |
| 🔬 Analyze | Resultado (Case/Combo), Case, resultados de nudo/barra/cáscara/sólido, deformada, escalas, paleta, rango | S | 📊 Resultados |
| 🔬 ▸ 📋 Tablas | 5 botones (Base Reactions, Modal Periods & Mass, Story Forces, Story Drifts, Centers of Mass & Rigidity) | V | 📊 Resultados ▸ Tablas |
| 🔬 ▸ ⚡ Modal + Animación | 3 | V | ▶ Cálculo ▸ Modal |
| ✂️ Cortes X/Y/Z | 9 | V | 👁 Vista ▸ Cortes |

---

## 2. LO QUE NO SIRVE (con la evidencia)

### 2.1 Muertos de verdad (handler vacío)
1. **`(trae sus propios controles)`** — `main.ts:3875`, `.on("click", () => {})`.
2. **`(modelo vacío — dibujá nodos)`** — `main.ts:4096`, `.on("click", () => {})`.
Los dos son **carteles disfrazados de botón**. Van como texto, no como botón.

### 2.2 Mienten o hacen menos de lo que dicen
3. **`📋 Copiar comandos a CLI`** (getCadPanel.ts:519): lee `window.__hekatanCliScript`, que
   **no está definido** en el workspace (medido: la lista de globals no lo trae). Copia `""`
   y aun así alerta «Comandos copiados al portapapeles».
4. **`💾 Guardar .heks`** (main.ts:4539): duplica a «Guardar como… .heks». Su salvavidas es
   `window.__hekatanModeloAHeks`, que **tampoco existe** → si dibujaste con el ratón y el
   cuadro CLI está vacío, baja un fichero **vacío**. Es el bug del Tutorial 9 otra vez.
5. **`💾 Exportar .tcl (OpenSees)`**: con el edificio de 3 pisos cargado baja **93 bytes**
   (medido: `createObjectURL size=93`). Exporta el textarea, no el modelo.
6. **`📋 Pórtico 2D (bloques)`**: el texto que pega **no lo entiende el parser** —
   `[CLI Modeler] Errores: L8: comando desconocido "elements" · L9: "0" · L10: "1"`.
7. **`📜 Solver Log + tiempos`**: los tiempos ya no se enseñan (bien hecho: estaban
   inventados), pero **el título sigue prometiéndolos**.
8. **`📐 Mostrar/ocultar planos de ref.`**: es un interruptor sin luz — su estado vive en una
   variable local y el botón no cambia de texto, así que no sabes si están puestos.

### 2.3 Títulos y etiquetas vacías
9. `main.ts:1907` — `fDesign.addBinding(ph, "msg", { readonly: true, label: "" })` → en el
   editor de materiales sale una fila **sin nombre** con «(sin propiedades de diseño)».
10. `main.ts:2309` — `addBinding(catLabel, "name", { label: "" })` en Display Units.
11. `drawing.ts:4752` — otra `label: ""`.
(El «🔢 sin texto» del encargo **no se reproduce**: sale «🔢 N° de modos (subir si masa <90 %)».)

### 2.4 Código muerto con nombre de CSI
12. `main.ts:1868`: `const fWM = fGen.addBlade ? fGen : editorPane.addFolder({ title:
    "Material Weight and Mass" })` — `addBlade` **siempre** existe, así que esa carpeta
    **nunca se crea** y `fWM` no se usa para nada. Sobra la línea y sobra el nombre.

### 2.5 Todo el editor de materiales y Display Units está en inglés de CSI
Medido abriendo los diálogos: `General Data · Name · Type · Symmetry · Display Color ·
Weight and Mass · Weight (kN/m³) · Mass (kg/m³) · Mechanical Property Data · Design Property
Data · Standards Reference · Region · Standard · Grade · ℹ Properties (read-only) ·
➕ Add New Material… · 📋 Add Copy of Material… · ✏ Modify/Show Material… · 🗑 Delete
Material · ✓ OK (cerrar) · ✕ Cancel · 🌐 Presets (1 click) · ↻ Reset Defaults`.
Y en el panel: `Load Patterns · Load Cases · Load Combinations · Name · Type · Self Weight
Mult. · Auto Lateral · Initial Cond. · Patterns · Max Modes · Formula · + Add New Pattern /
Case / Combo · 🗑 Delete pattern / case / combo · Display Units (granular) · Mesh · Nodes ·
Elements · Edges · Nodes indexes · Elements indexes · Orientations · Sections · Supports ·
Loads · Analysis Inputs · Analyze · Node/Frame/Shell/Solid results · Deformed shape ·
Scale XY/Z · Display scale · Base Reactions · Modal Periods & Mass · Story Forces · Story
Drifts · Centers of Mass & Rigidity`.

### 2.6 DUPLICADOS — esto es lo que más estorba
| Lo mismo, dos veces | Dónde |
|---|---|
| Div. vigas / Div. columnas | «Mesh» **y** «Avanzado» |
| Activar losas · Espesor · Subdivisiones | «Losas de Piso» **y** «Avanzado» (Losa, t losa, Discretización losa) |
| Muros: activar · espesor · subdiv | «Muros de Corte» **y** «Avanzado» (Muros de corte (cáscara), t muro) |
| Vigas secundarias: activar · cantidad · dirección | «Vigas Secundarias» **y** «Avanzado» |
| «Comparar con» (SAP2000 / ETABS) | «💻 CLI Comandos» **y** «Apoyo» |
| Ver la cimentación | botón «🪨 Ver TODAS las zapatas FEM», botón «🏢 Volver a superestructura» **y** el select «🔘 Vista (toggle)» de la carpeta «Cimentación» = **tres mandos para una cosa** |
| Cimentación | **tres carpetas**: «🪨 Cimentación FEM (toggle)», «🪨 Cimentación (diseño + SAFE F2K)» y «Cimentación» (params) |
| Luces / alturas | «Geometría» (Luz X/Y uniforme, h piso uniforme) **y** «Luces por vano» / «Alturas por piso» |
| Secciones | «Secciones (global)» **y** «Secciones por piso» |
| Qué se ve del modelo | «👁 Ver»: Elements · Frames (todos) · Columnas · Vigas · Zapatas · Losas se pisan entre sí |
| Entrada al modal | «🛠 Herramientas FEM ▸ 📈 Modal+» (panel derecho) **y** «🔬 Analyze ▸ ⚡ Modal + Animación» (panel izquierdo) |

### 2.7 Valores de adorno
- **«Alturas por piso» con 3 pisos muestra «Piso 7» y «Piso 8»** además de «h Piso 1..3», y
  todos a `0.0`. Etiquetas de pisos que no existen (captura `03_edificio_todo_panel_derecho.png`).
- «Secciones por piso» (12 sliders) y «Luces por vano» (4 sliders) salen **todos a 0.00**:
  el convenio es «0 = usa el valor uniforme», pero eso no lo dice ningún sitio.
- «📊 Calculados» mete separadores falsos como fila (`── Reacciones máx (→ zapatas) ──`)
  porque Tweakpane no tiene título de sección.

---

## 3. Frecuencia (resumen)

- **Cada sesión (S):** elegir ejemplo · parámetros del modelo (Geometría, Secciones, Cargas,
  Apoyo) · ▶ Calcular · Vista (iso/planta/elevaciones) · 👁 Ver · Analysis Inputs ·
  resultados (nudo/barra/cáscara, deformada, escalas) · 📊 Calculados · unidades preset ·
  dibujar (si estás en el lienzo) · guardar .heks.
- **De vez en cuando (V):** modal + animación · espectral · tablas · cortes · patrones/casos/
  combos · exportar/importar E2K, S2K, F2K · cimentación · split · PNG/GIF · ejes y niveles ·
  rejilla · precisión/OSNAP · auto-mesh.
- **Una vez al mes o menos (M):** Display Units granular · editor de materiales · 📏 Rangos ·
  .tcl de OpenSees · IFC · AI Assistant · demo CAD · plantillas inline del CLI · Inspect ·
  Solver Log · Calculadora FEM · Report Explained · Cardinal Point.

---

## 4. PANEL NUEVO — cinco temas y un Menú

Hoy el panel derecho es **una lista de 25 carpetas al mismo nivel** mezclando modelo, vista,
cálculo, resultados, ficheros y preferencias. La idea: **5 carpetas de primer nivel** y todo
lo de frecuencia M detrás del botón «🏠 Menú» que ya está arriba y casi vacío.

```
PANEL DERECHO (trabajo)
├─ 📐 MODELO            ← lo que define la estructura
│   ├─ Ejemplo / plantilla  (Categoría + Ejemplo + 📖 Guía)
│   ├─ ✏ Dibujar           (las 4 primeras de CAD: Dibujar, Áreas, En 3D, Modificar)
│   ├─ Geometría           (vanos, luces, alturas — UNA sola, con «por vano» dentro)
│   ├─ Secciones y materiales  (global + por piso dentro)
│   ├─ Apoyos y uniones    (Apoyo, brazos rígidos, diafragma, releases)
│   ├─ Cargas              (patrones · casos · combinaciones · NEC)
│   ├─ Cimentación         (UNA sola: diseño + vista + FEM)
│   └─ Texto (.heks)       (el CLI de comandos)
├─ 👁 VISTA              ← lo que se ve, nunca cambia el modelo
│   ├─ Cámara             (iso, planta, elevaciones, split, ejes)
│   ├─ Mostrar            (nodos, barras, cáscaras, secciones, apoyos, cargas, cotas…)
│   ├─ Rejilla y planos   (Grid + ajuste fino + planos de trabajo/referencia)
│   ├─ Cortes X/Y/Z
│   └─ Imagen             (PNG · GIF)
├─ ▶ CÁLCULO
│   ├─ ▶ Calcular  (botón grande, arriba)
│   ├─ Malla       (auto-mesh, divisiones de viga/columna, discretización)
│   ├─ Semánticas  (SAP2000 / ETABS — UNA sola vez)
│   ├─ Modal       (correr, nº de modos, método, animar, tabla)
│   └─ Espectral   (NEC)
├─ 📊 RESULTADOS
│   ├─ Qué se dibuja (nudo · barra · cáscara · sólido · deformada · escalas)
│   ├─ Color        (paleta · rango · leyenda)
│   ├─ Tablas       (las 5 de ETABS)
│   └─ Calculados   (el de diseño)
└─ 📏 UNIDADES
    └─ Preset (MKS · SI · Imperial) a la vista; lo granular, en Menú ▸ Preferencias

🏠 MENÚ  (lo raro, una vez al mes)
├─ 📂 Archivo      Abrir/Guardar/Guardar como/Compartir · E2K · S2K · F2K · TCL · IFC · Limpiar
├─ 🔬 Estudio      Inspect · Solver Log · Calculadora FEM · CLI cad.* · Report · Demo CAD
├─ ⚙ Preferencias  Display Units granular · Materiales · 📏 Rangos · Precisión/OSNAP · AI
└─ 🧪 Ejemplos     el catálogo por categorías
```

Regla que resuelve el «está todo mezclado»: **una carpeta de primer nivel = una pregunta**.
Modelo = *qué* calculo · Vista = *cómo lo miro* · Cálculo = *qué le pido* · Resultados = *qué
me devolvió* · Unidades = *en qué números*. Lo que no contesta ninguna de las cinco, al Menú.

Y los dos paneles (izquierdo y derecho) hoy parten el mismo tema en dos sitios: «Vista» está
a la derecha y «👁 Ver» a la izquierda; el modal está en los dos. La propuesta junta cada
tema en un solo sitio; si se quieren mantener dos columnas, lo natural es
**izquierda = Vista + Resultados** (lo que mira) y **derecha = Modelo + Cálculo + Unidades**
(lo que decide).

---

## 5. Renombrados propuestos (todo en español, sin CSI)

| Ahora | Propuesto |
|---|---|
| General Data | Datos generales |
| Material Weight and Mass *(código muerto)* | *(borrar)* |
| Weight and Mass | Peso y masa |
| Mechanical Property Data | Propiedades mecánicas |
| Design Property Data | Propiedades de diseño |
| Standards Reference | Norma de referencia |
| ℹ Properties (read-only) | ℹ Propiedades (solo lectura) |
| Name / Type / Symmetry / Display Color | Nombre / Tipo / Simetría / Color |
| Region / Standard / Grade | País / Norma / Grado |
| ➕ Add New Material… | ➕ Material nuevo… |
| 📋 Add Copy of Material… | 📋 Copiar material… |
| ✏ Modify/Show Material… | ✏ Ver / editar material… |
| 🗑 Delete Material | 🗑 Borrar material |
| ✓ OK / ✕ Cancel / ↻ Reset Defaults | ✓ Aceptar / ✕ Cancelar / ↻ Volver a lo de fábrica |
| Display Units | Unidades de lectura |
| Display scale | Tamaño de los símbolos |
| Load Patterns / Load Cases / Load Combinations | Patrones de carga / Casos de carga / Combinaciones |
| Self Weight Mult. | Factor de peso propio |
| Auto Lateral | Carga lateral automática |
| Initial Cond. | Condición inicial |
| Patterns / Formula / Max Modes | Patrones / Fórmula / Modos máx. |
| + Add New Pattern / Case / Combo | + Patrón nuevo / Caso nuevo / Combinación nueva |
| 🗑 Delete pattern / case / combo | 🗑 Borrar patrón / caso / combinación |
| Mesh | Malla |
| Nodes / Elements / Edges (delim.) | Nudos / Elementos / Aristas |
| Nodes indexes / Elements indexes | Nº de nudo / Nº de elemento |
| Orientations / Sections | Ejes locales / Secciones |
| Analysis Inputs | Datos de entrada |
| Supports / Loads | Apoyos / Cargas |
| Analyze | Resultados |
| Node / Frame / Shell / Solid results | Resultados de nudo / barra / cáscara / sólido |
| Deformed shape / Scale XY / Scale Z | Deformada / Escala XY / Escala Z |
| Base Reactions | Reacciones en la base |
| Modal Periods & Mass | Periodos y masa modal |
| Story Forces / Story Drifts | Fuerzas por piso / Derivas |
| Centers of Mass & Rigidity | Centros de masa y rigidez |
| 📜 Solver Log + tiempos | 📜 Registro del solver |
| Cardinal Point col. | Punto de inserción de la columna |
| 🌐 Presets (1 click) | 🌐 Sistemas de unidades |

---

## 6. Ficheros generados por esta auditoría (temporales, fuera del repo)
`…/scratchpad/`: `tree_edificio.json` (árbol completo del panel), `buttons_edificio.json`
(los 110 botones con su ruta), `clicks_edificio*.json` (resultado de pulsarlos),
`recheck.json` (los dudosos, con blobs y alertas), `dlg_*.json` (diálogos), `dup.mjs`
(prueba de no-duplicación del modal).
Al repo solo entran las capturas de `registros/img/2026-09-18_tweakpane/` y este `.md`.

---

# APLICACIÓN — FASE A (parcial), 20:00-20:10 del 18-sep-2026

## ✅ Aplicado y VERIFICADO pulsando (en `hekatan-ui/`, fichero que la otra sesión no toca)

`hekatan-ui/src/cad/getCadPanel.ts`
1. **Helper `avisarCad()`**: escribe en la barra `#hk-cad-status` y, si no existe, alerta.
   Regla de Jorge: *ningún control puede decir que hizo algo sin comprobar que lo hizo.*
2. **`📋 Copiar comandos a CLI`** — antes copiaba `""` y avisaba «Comandos copiados».
   Ahora: comprueba que haya texto, cuenta las líneas, pega también en el cuadro CLI si está
   montado, y solo dice «copiado» si `navigator.clipboard.writeText` no falló.
   Medido pulsando: sin dibujo → «📋 No hay comandos que copiar — dibujá algo primero»;
   con script → «📋 3 comando(s) copiados al portapapeles y pegados en el cuadro CLI».
3. **`▦▦ Llenar TODAS las celdas cerradas`** — avisaba por un global inexistente (mudo).
   Ahora: «▦▦ No se creó ninguna: no hay celdas cerradas por 4 barras en el dibujo» / «▦▦ N área(s) creada(s)».
4. **`📐 Planos de referencia`** — interruptor sin luz. Ahora el título lleva el estado.
   Medido: OFF → clic → ON → clic → OFF.

`hekatan-ui/src/femTools/attachFemTools.ts`
5. **`📜 Solver Log + tiempos` → `📜 Registro del solver`**: los tiempos se quitaron (estaban
   inventados) y el título seguía prometiéndolos.

Captura: `scratchpad/faseA1.png`. `tsc --noEmit` no añade ningún error nuevo (los que salen ya estaban).

## ⛔ PARADO: colisión con la otra sesión en `examples/src/workspace/main.ts`

Lo que falta de la FASE A (💾 Guardar .heks vacío · 💾 Exportar .tcl de 93 bytes ·
📋 Pórtico 2D (bloques) roto · los dos carteles-botón · `label: ""` · «Material Weight and
Mass» muerto · «Piso 7/8» · los 0.00) vive TODO en `main.ts`. Y la FASE B (ejemplo ya
ejecutado) y la FASE C (5 carpetas) son `loadExample` y `buildParamsPane`.

**La otra sesión escribió `main.ts` a las 20:03:30** (md5 `55de0ed8…` → `2712accb…`) y su diff
toca justo `loadExample`, `buildParamsPane`, `mountCaseResultsInSettings`, `rebuild` y la zona
del animador modal. Editar ahí a la vez es perder trabajo, así que **paro y aviso** (regla de
coordinación). Hallazgo útil para cuando se abra la ventana:

- `__hekatanModeloAHeks` **sí existe, pero solo en `new-blank`** (`newBlank.ts:574`). Por eso
  con una plantilla cargada «Guardar .heks», «Compartir enlace» y «Exportar .tcl» se quedan
  con el textarea vacío. El arreglo bueno es **un generador genérico del .heks desde los
  `states`** (nudos, elementos, inputs) en `main.ts`, y que los tres botones lo usen: arregla
  los tres de una vez en lugar de parchear cada uno.

---

# Opción (c) — renombrados al español fuera de `main.ts` (20:10-20:40)

## ✅ Aplicado y verificado en la app

**`hekatan-ui/src/viewer/settings/getSettings.ts`** (panel izquierdo, 21 cambios):
Display scale→**Tamaño de los símbolos** · Nodes→**Nudos** · Elements→**Elementos** ·
Edges (delim.)→**Aristas (delim.)** · Nodes indexes→**Nº de nudo** · Elements indexes→**Nº de
elemento** · Orientations→**Ejes locales** · Sections→**Secciones** · Supports→**Apoyos** ·
Loads→**Cargas** · Node/Frame/Shell/Solid results→**Resultados de nudo/barra/cáscara/sólido** ·
Deformed shape→**Deformada** · Scale XY/Z→**Escala XY/Z** · Solids→**Sólidos** ·
📐 Grid→**📐 Rejilla** · 📌 Analysis Inputs→**📌 Datos de entrada** · 🔬 Analyze→**🔬 Resultados**.

**`examples/src/workspace/loadPatternsPanel.ts`** (17 cambios): 📋 Load Patterns→**Patrones de
carga** · 📊 Load Cases→**Casos de carga** · Σ Load Combinations→**Σ Combinaciones** ·
Name→**Nombre** · Type→**Tipo** · Self Weight Mult.→**Factor de peso propio** · Auto
Lateral→**Carga lateral automática** · Initial Cond.→**Condición inicial** ·
Patterns→**Patrones** · Max Modes→**Modos máx.** · Formula→**Fórmula** · 🗑 Delete
pattern/case/combo→**Borrar patrón/caso/combinación** · + Add New …→**+ Patrón/Caso/Combinación
nuevo(a)**.

**`hekatan-ui/src/viewer/drawing/drawing.ts`**: `label: ""` → **«Qué hacer»** (fila sin nombre).

**`hekatan-ui/src/cad/getCadPanel.ts`**: la clave `select` estaba **dos veces** en
`toolInstructions` (el compilador avisaba en cada arranque y la primera frase era código
muerto). Queda una. Medido pulsando: Seleccionar→`tool=select`, Nodo→`node`, Línea→`line`,
cada uno con su texto de ayuda.

### Lo que impide que esto rompa los tutoriales
Los guiones de `cli/tutoriales/*` piden los mandos **por su nombre en inglés**
(`a.elegir("Frame results", …)`, `a.casilla("Deformed shape")`). Se añadió una tabla
`SINONIMOS_PANEL` en **`cli/tutorial_struct.mjs`** (viejo→nuevo) que traduce antes de buscar,
enganchada en los dos únicos sitios que miran la pantalla (`rect()` y `elegir()`); y
`cli/shot_deformadas.mjs` + `cli/gif_itw_convergencia.mjs` aceptan ahora
`/Deformed shape|Deformada/`. Comprobado en la app con la MISMA tabla: **0 nombres viejos
quedan en pantalla** y **0 nombres nuevos se pierden** (los 24 se encuentran por `includes`).

### Comprobaciones
- `npx esbuild` de los 5 ficheros tocados: **compila, 0 avisos** (antes: 1 aviso por el `select`).
- `node tests/run.mjs categorias` → **OK 3/3** (49 s).
- `node tests/run.mjs animacion` → **FALLA 3/3, y NO es de esto**: el caso pide
  `window.__hekatanModalResultados()`, un gancho que **no existe en el código fuente de hoy**
  (`grep` en todo `*.ts`: 0 resultados) y corre contra el bundle de `website/src/examples`
  construido a las **19:41 por la otra sesión** desde un `main.ts` a medio editar. Ninguno de
  mis cambios toca el modal. No se reconstruyó el bundle a propósito: `npm run build -w examples`
  pisa `website/src/examples`, que la otra sesión está usando.
- Capturas: `scratchpad/panel_izq_es.png`, `nombres_es.png`, `verif_cad_final.png`.

---

# PREPARADO para la ventana en exclusiva sobre `main.ts`

## 1. Generador genérico del `.heks` (arregla TRES botones de una vez)

**Dónde:** fichero NUEVO `examples/src/workspace/modeloAHeks.ts` — así `main.ts` solo necesita
**cuatro líneas** y el conflicto con la otra sesión es mínimo.

```ts
export function modeloAHeks(states, opts?: { directivas?: string[] }): string
```

- **Lee** `states.nodes.val` → `node i x y z`; `states.elements.val` por longitud
  (2 → `frame`, 3/4 → `shell`, 8 → `hex`); `elementInputs` (E, A, I22, I33, J, G, As2/As3,
  `ang`, espesor, `shelltype`, `shellmod`, `shellang`); `nodeInputs` (`support`, `load`,
  `spring`, `diaph`, `mass`); y las directivas activas de la interfaz
  (`etabsjoint`, `deck etabs`, `meshcross`, `automesh`, `torsion safe`).
- ⚠️ Respeta las dos trampas ya documentadas en CLAUDE.md: en `frame` el **6º token es I22 y
  el 7º I33**, y en `as ID As2 As3` **As2 va con I33**; en `shell id n1..n4 t E [q] [rho]` el
  espesor va primero y el 8º token es **carga de superficie**, no ν.
- **En `main.ts`, 4 líneas**: `import { modeloAHeks }` + una asignación
  `(window as any).__hekatanModeloAHeks = () => modeloAHeks(states);` tras crear los states.
  Los tres consumidores (`guardarHeks`, `crearEnlaceModelo`, `💾 Guardar .heks`) ya lo llaman.
- **Y que no mienta**: si el texto sale vacío, **no se descarga nada** y se avisa
  («no hay modelo que guardar»), en vez del fichero de 0 KB del Tutorial 9.
- **Cómo se comprueba (no «parece que sí»)**: ida y vuelta. Se genera el `.heks` de un ejemplo
  cargado, se vuelve a resolver con `tests/lib/heks.mjs` (que va por `cliModeler`, el lector de
  verdad) y se comparan los desplazamientos nudo a nudo con el modelo original: si no
  reconstruye el mismo modelo, no está guardado. Caso nuevo `tests/casos/heks_ida_y_vuelta.mjs`.
- Con eso, «💾 Guardar .heks» (que además duplica a «Guardar como…») puede **desaparecer**, y
  «Exportar .tcl» pasa a emitir el modelo de verdad en vez de los 93 bytes del textarea.

## 2. FASE B — ejemplo ≠ plantilla, y el ejemplo se abre YA ANIMANDO

**Distinguirlos en el dato, no a ojo**: campo nuevo en `ExampleDef`
(`exampleRegistry.ts`): `tipo?: "ejemplo" | "plantilla"`. Por defecto, plantilla si trae
muchos parámetros; ejemplo si no. En el selector, **dos grupos** («🧪 Ejemplos — se abren
resueltos» / «📐 Plantillas — se ajustan y se calculan») y la etiqueta en el nombre.

**Dónde:** fichero NUEVO `examples/src/workspace/autoEjecutar.ts` con
`autoEjecutar(ex, states, { correrModal, animar })`, y **una sola línea** al final de
`loadExample` en `main.ts`. Lo que hace:

1. `tipo === "plantilla"` → no hace nada (sigue siendo una herramienta).
2. `tipo === "ejemplo"` → resuelve al cargar y deja el resultado a la vista
   (deformada + el `defaultShellResult` del ejemplo).
3. Si `hasModal` → corre el modal y **deja la animación en marcha** (lo que pidió Jorge para
   el enlace `?t=<id>`), llamando al `__hekatanRunModalAnimate` que ya existe.
4. **Coste, con los números ya medidos** (CLAUDE.md: la animación reescribe `mesh.nodes` a
   50-80 ms por fotograma con 6600 nudos → 10-15 fps):
   - `nudos ≤ 1500` → animar normal;
   - `1500 < nudos ≤ 4000` → animar a paso reducido;
   - `nudos > 4000` → **correr el modal pero NO animar**, y decirlo en el panel
     («modelo grande: modos calculados, animación apagada — ▶ para verla»).
   Todo arranca en `setTimeout(…, 0)`/idle para no bloquear el primer dibujo, y se apaga solo
   con el `__liveDrag` que ya pausa el animador al arrastrar un slider.
5. Escape: `&auto=0` en la URL abre el ejemplo sin ejecutar (para depurar).

⚠️ Lo de arriba toca `loadExample` y el animador: **es justo donde está trabajando la otra
sesión**, y `animateMode.ts` / `animarCaso` / `mostrarModo` / escala del modo son suyos. La
única línea que necesito en su zona es la llamada a `autoEjecutar(...)` al final de
`loadExample`; lo demás vive en los dos ficheros nuevos.

---

# FASE A (lo que faltaba, en `main.ts`) — 23:00-23:40 · ventana en exclusiva

## `examples/src/workspace/modeloAHeks.ts` (nuevo) — el agujero de fondo
`__hekatanModeloAHeks` **solo lo definía `new-blank`** (`newBlank.ts:574`). Con una plantilla
cargada no existía, y «Guardar .heks», «Guardar como…», «Compartir enlace» y «Exportar .tcl»
se quedaban con el cuadro CLI **vacío**. Por eso no se pudo dar el `.heks` del modelo dual.

Ahora el `.heks` se escribe desde los `states` (nudos, elementos, `elementInputs`,
`nodeInputs`), o sea desde lo que el solver tiene de verdad, y vale para cualquier modelo.
Respeta las trampas del formato: `frame` con **I22 en el 6.º token e I33 en el 7.º**,
`as id As2 As3` con **As2 ↔ I33** (`shearAreasZ`), y `shell id n1..n4 t E [q] [rho]` con el
espesor antes que E.

**Comprobado por IDA Y VUELTA**, no a ojo (`tests/casos/heks_ida_y_vuelta.mjs`):
`.heks → cliModeler → states → modeloAHeks → .heks' → cliModeler → states'` y se comparan los
desplazamientos nudo a nudo. **6/6 al 0.000 %** en tres modelos distintos:

| modelo | qué prueba | peor nudo |
|---|---|---|
| `galpon_lc.heks` (609 nudos, 1371 elem.) | barras con `ang`/`as`, deck, cáscaras | **0.000 %** |
| `cimentacion_9zapatas.heks` (234 nudos, 225 muelles) | Winkler + `shelltype thick` | **0.000 %** |
| `mixto_solido_muro_columna.heks` | sólidos H8 + muro + barras | **0.000 %** |

El test cazó **dos errores míos** que a ojo no se ven, y por eso está escrito así:
1. los muelles viven en `nodeInputs.springs` (no en un Map) y un nudo **negativo** es
   −(elemento+1): muelle de área o nudo colgado del `edge etabs`. Sin eso, la cimentación se
   iba **3×10¹⁴ %** (sin muelles, flota).
2. **`selfweight` NO se puede reescribir**: el lector reparte el peso propio a los nudos en
   cuanto lo lee, así que ya viaja dentro de `load`. Guardándolo otra vez el modelo pesaba el
   doble → **44 %** de error. Ahora va como comentario, no como directiva.

## Los botones que mentían (todos medidos pulsando, en `?t=edificio-aporticado`)

| Botón | Antes | Ahora (medido) |
|---|---|---|
| 💾 Guardar .heks | fichero de **0 KB** | blob de **5 984 bytes** con el modelo (36 nudos, 63 barras) |
| 💾 Exportar .tcl | **93 bytes** | **7 091 bytes** |
| 📋 Pórtico 2D (bloques) | `comando desconocido "elements"` | **0 errores**; el modelo queda con 4 nudos y 3 barras |
| «Guardar como…» / «Guardar» con lienzo vacío | bajaba fichero vacío | **no descarga nada** y avisa |
| (trae sus propios controles) | botón con clic vacío | fila de texto |
| (modelo vacío — dibujá nodos) | botón con clic vacío | fila de texto |
| `label: ""` ×2 | filas sin nombre | «Sin datos» y «Grupo» |
| «Material Weight and Mass» | carpeta que **nunca se creaba** (`addBlade` siempre existe) | borrada; la buena se llama **«Peso y masa»** |
| «Piso 7» y «Piso 8» con 3 plantas | dos alturas de pisos inexistentes (`hP_7`/`hP_8` fijos) | borrados; los pisos los crea `dynamicParams` 1..nPisos |
| Sliders a 0.00 sin explicar | «h Piso 1 (m)», «b col P1 (m)», «svX #1 (m)» | «… **· 0 = usa la uniforme / la global**» (19 etiquetas) |

Por qué «Pórtico 2D (bloques)» estaba roto: el lector **solo abre un bloque si la cabecera va
sola en su línea** (`cmd === "elements" && tokens.length === 1`), y el ejemplo escribía
`elements    # pares 0-based…`. El comentario al lado la convertía en dos tokens.
(Queda apuntado: hacer el lector tolerante a comentarios en la cabecera sería el arreglo de
raíz — vive en `cliModeler.ts`, fuera de esta ventana.)

---

# RETOMADO tras el reinicio (19-sep, 00:20) — cierre de 2 y 3

## Dónde lo encontré
`modeloAHeks.ts` y `autoEjecutar.ts` escritos; `main.ts` con FASE A aplicada y FASE B ya
enganchada; `edificioAporticado.ts` con mis cambios de FASE A. Compilaba. Lo que faltaba:
probar con el modelo DUAL, y eso destapó un hueco.

## 2 · `.heks` del modelo dual (test-m-dual, ms=1.0, 545 nudos) — medido
- Desde la app, «💾 Guardar .heks» baja **78 917 bytes** (antes 0 KB). Copia en
  `registros/test-m-dual_ms1.heks`.
- **Ida y vuelta: masa 0 % de diferencia, desplazamientos 4.4 % en el peor nudo.** No se da
  por bueno. Causa encontrada, medida y no supuesta:
  1. El dual usa `plateFormulations = 2` en sus 460 cáscaras. `data-model.ts` dice
     «2 = MEMBRANA», pero el SOLVER (`shellQ4.cpp:1787`) con 2 usa la **placa DSE completa de
     Wilson (cap. 8)**, que sí flexa. Documentación y solver no dicen lo mismo.
  2. El lector `.heks` solo sabe `shelltype thin|thick`: **el 2 no se puede declarar**.
  3. **Prueba**: devolviéndole el 2 a esas 460 cáscaras en el modelo releído, coincide al
     **0.00018 %**. El drilling (tipo 2 declarado) aparte pesa un 0.004 %.
  Por el camino se descartaron, midiendo, dos hipótesis mías: «es membrana» (escribirla como
  `shellmod 1 0` o con los 8 modificadores rompía el modelo: los nudos de losa se quedaban sin
  rigidez y su carga se perdía — 100 %) y «es el drilling» (0.004 %).
- **Qué hace hoy el fichero**: lo escribe como `thick` y lo **AVISA en la cabecera**
  («⚠️ 460 cáscara(s) usan la placa DSE… el modelo releído DIFIERE. Falta en el lector:
  `shelltype id dse`»), y al pulsar «Guardar» se le dice también al usuario.
- **Lo que lo cierra** (NO aplicado: `cliModeler.ts` es de otra sesión): una línea en el
  `case "shelltype"` → `else if (q === "dse" || q === "2") v = 2;` y que `modeloAHeks` escriba
  `shelltype id dse`. Con eso, medido: 0.00018 %.
- Test `heks-ida-y-vuelta`: **8/8**. Regla del caso del dual: *o coincide, o la cabecera lo
  dice*. Cazó que mi primer intento de insertar el aviso no había entrado (un reemplazo que no
  encontró el texto y calló).
- El gancho de `new-blank` se quedaba pegado al pasar a otro modelo: ahora se repone en cada
  `loadExample`. `new-blank` mantiene el suyo (escribe ρ en kN/m³ → t/m³; conviven dos
  convenios de densidad en el código: `cliModeler`/`edificioAporticado`/`test-m` en t/m³ y
  `newBlank` en kN/m³).

## 3 · Ejemplo ≠ plantilla — medido pulsando
| | `?t=arco` (ejemplo) | `?t=arco&auto=0` | `?t=edificio-aporticado` (plantilla) |
|---|---|---|---|
| resuelto al abrir | sí | sí | sí (el estático en vivo de siempre) |
| modal corrido y «🎞 Animar» marcado | **sí** (Case = Modal, modo 1, T = 4.02 s) | no | **no** |
| paso de animación | normal (21 nudos) | — | — |

- Selector: **▶ = ejemplo** (se abre ejecutándose) · **📐 = plantilla**. Era 🧪, pero la
  categoría «🧪 Utilidades» ya lo usa y en la lista se confundían.
- Clasificación sobre el registro real: **51 ejemplos / 110 plantillas** de 161 (`tipo` en el
  `ExampleDef` manda; si no, `dynamicParams` o ≥ 6 mandos = plantilla).
- Freno por tamaño (≤1500 animar · ≤4000 paso reducido · más: modos sí, animación no, y se
  dice) — test `auto-ejecutar` 12/12.
- Capturas: `img/2026-09-18_tweakpane/04_ejemplo_arco_abre_animando.png`,
  `05_plantilla_edificio_no_se_ejecuta.png`.

## Avisos
- ⚠️ En headless con WebGL por software, tras un «Context Lost / Restored» el visor puede
  quedar NEGRO hasta el primer movimiento del ratón (el modelo está: 0 NaN, cámara bien; se
  pinta al repintar). No es de estos cambios; queda apuntado.
- ⚠️ `taskkill /IM chrome.exe` mata TODOS los Chrome (18 procesos esta vez, no solo los míos).
  Los scripts cierran su navegador en `finally`; no volver a usar el taskkill global.
- Queda para una decisión de Jorge: la plantilla sigue resolviendo el ESTÁTICO en vivo (los
  sliders dan respuesta inmediata, como siempre); lo que ya no hace sola es lanzar modal ni
  animación.

---

# 19-sep, 05:55 UTC — ganchos del test de animación, y PARADA por disco

## Suite completa (antes de estos cambios): 617/640
23 filas rojas, **ninguna en mis ficheros**: `animacion` (gancho perdido, ver abajo), automallado
(transfinito, pavimentador, vs ETABS), muelles de área (`paridad-py-areaspring-edge`,
`muelle-area-y-nudo-colgado`), `placa-momentos-navier`, `col-placa` (salud/modal),
`listas-de-ids` — motor, lector y registro, que otra sesión tiene sin commitear — y
`zapata-winkler-sap2000`, que **no es un fallo: se quedó sin disco** («There is not enough
space on the disk» al escribir su bundle en `hkTest-*`).

## Repuesto en `main.ts` (se había perdido al pisarse el fichero)
- `window.__hekatanModalResultados()` → φ, frecuencias y participación (lo que pide el test).
- `window.__hekatanModalAnimator` → con *getter*, porque el animador se reasigna en
  `buildParamsPane` y al arrancar: una referencia fija apuntaría a uno ya desechado.
- `hasModal` en `window.__hekatanExamples` (lo da por hecho `cli/check_animacion_modal.mjs`).
- Compila (esbuild en memoria, 0 errores, sin escribir en disco).

## `tests/lib/visor_modal.mjs`: ya no prueba código de ayer
`bundleDesactualizado()` compara la fecha del bundle con la del fuente más nuevo de
`examples/src`, `hekatan-ui/src` y `hekatan-fem/src`. Si hay uno posterior, el caso se
**niega** y lo dice. Medido: «bundle desactualizado: src/workspace/main.ts (05:55) es más
nuevo que el bundle (05:04) — corré: npm run build:deploy», en 0.3 s (antes gastaba ~10 min
probando la versión vieja y daba un veredicto sobre otro programa). Escape explícito para
depurar: `HK_BUNDLE_VIEJO_OK=1`.

## ⛔ PARADO: disco por debajo de 3 GB
Durante la suite el disco llegó a **303 MB**; ahora está en **2.4 GB** y bajando (hace unos
minutos, 3.3). No es de esta sesión: mi scratch ocupaba 183 MB y lo dejé en 61. Por la regla,
**no se lanzó `npm run build -w examples`**, y sin bundle nuevo no se puede hacer el punto 4
(`animacion` 21/21 con el gancho, y que FALLE quitando la guarda de `animarCaso`).
En cuanto haya disco: `npm run build:deploy` → `node tests/run.mjs animacion` (21/21) → quitar
la guarda de `animarCaso` → volver a correr (tiene que fallar) → reponer la guarda.
