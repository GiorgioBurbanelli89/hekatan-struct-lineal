# Click derecho → Sección transversal · 25-sep-2026

Pedido de Jorge (01:35): *«La SECCION TRANSVERSAL TIENE QUE IR EN CLICK DERECHO»*
— que el cuadro 📐 acotado salga al hacer botón derecho sobre una barra, como en ETABS.

## ✅ Funcionó
- **`hover.ts` expone el picking fino**: `window.__hekatanFindHovered` (el `findHovered`
  de 2D que ya usaba el hover) y `window.__hekatanDesignarExacto(idx)` (reemplaza el
  conjunto con UNA barra — `designar()` a secas hace toggle y la sacaba).
- **Marca `__hekatanRClickOnElement`** en `pointerdown` button 2 (hover.ts): `drawing.ts`
  la leía y nadie la escribía (hook muerto desde su origen). Con ella, el click derecho
  sobre un elemento NO dispara el «cancel» (Escape sintético) y la selección sobrevive.
  Solo con tool `select/none`: con comando CAD activo el cancel sigue mandando.
- **`main.ts` contextmenu**: si `findHovered` devuelve `frame` → designa esa barra +
  `mostrarSeccionConAviso()` directo, sin menú. Sobre `node`/`shell` → menú con header
  real (JOINT/SHELL, antes adivinaba «¿el modelo tiene áreas?»). Sobre vacío → menú igual.
- **`cuadroSeccion.ts`**: nuevo export `mostrarSeccionConAviso()` (mismo toast de error
  que ya tenía el botón 📐; ahora compartido, sin duplicar).
- Menú `frame` gana «Ver ▸ Sección transversal» (por si se abre el menú en un modelo
  solo-barras con vacío).
- **Tests**: `cli/ctl_click_derecho_seccion.mjs` 9/9 ✓ (barra→ventana+SVG+selección
  exacta, vacío→menú, Esc) · `cli/ctl_menu_y_ventana.mjs` 8/8 ✓.
- **Desplegado**: fuente `ffbabaf23` → gh-pages `e5e2b8e46..293958b3d`; verificado
  9/9 contra el SITIO PÚBLICO (`node cli/ctl_click_derecho_seccion.mjs publico`).

## ❌ No funcionó (y por qué)
- **Busqueda de `sectionShapes` en `#viewer.__ctx.mesh`** → ese `__ctx` público no tiene
  `mesh/derivedNodes` (solo cámara/controls/render). Los elementos viven en
  `window.__hekatanStates.elements/nodes.val`.
- **Punto «vacío» elegido sin mirar overlays**: caía sobre un div de Tweakpane y sobre
  `#hk-ribbon` → el `contextmenu` les llegaba a ellos, nunca al visor → menú nunca abría.
  Ahora el test exige `elementFromPoint === canvas`.
- **`ctl_menu_y_ventana.mjs` roto ANTES de mis cambios** (verificado con stash+rebuild:
  mismos 4 fallos): el ribbon creció (46 botones → 2 filas, 394 px) y tape el centro de
  la pantalla donde autofit centra el modelo. Parche: el test oculta `#hk-ribbon` (mide
  el menú, no el ribbon). **⚠️ UX real: en 1280×800 el ribbon TAPA el centro del lienzo**
  — asunto del ribbon (otra sesión), no de este cambio.
- `rg` no existe en esta shell → usar el Grep tool.

## ⏳ Falta
- Bug de Jorge: «las cargas no tiene repartido en todas las correas» (pendiente de
  diagnosticar en `s2kParser.ts` / `FRAME LOADS - DISTRIBUTED`).
- Desplegar (commit fuente + gh-pages) y avisar.
- Ganchos aún no usados: `runExampleStandalone.ts` (menú propio, sin sección) — solo
  workspace por ahora.
