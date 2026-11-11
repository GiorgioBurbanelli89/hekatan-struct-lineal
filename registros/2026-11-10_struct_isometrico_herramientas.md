# Struct en ISOMÉTRICO: qué herramientas hay, qué falla, qué faltaba (10-nov-2026)

Jorge: «Estás dibujando en planta y elevación; yo quiero ISOMÉTRICO, para ver qué herramientas tengo y qué falta».
Todo probado en LOCAL (Vite :4600, `new-blank`) con el MCP `hekatan-struct` arrancado de verdad por stdio
(`node mcp/llamar.mjs guion.json carpeta`, guiones g1…g12 en el scratchpad), cámara en isométrica, PNG revisados.

## Cómo se elige un punto 3D en isométrico (la clave)
El ratón cae en el **plano de trabajo** (horizontal a la cota Z). Un clic a (3, 5, 1.5) con el plano en z = 0
cae en (1, 7, 0): no es un fallo, es el rayo. Salidas, todas probadas:
1. **Osnap** a un nudo / punto medio / intersección que ya exista → vale a CUALQUIER cota (clic cerca de (0,0,3) → (0,0,3)).
2. **Ejes** rojo/verde/azul desde el último punto (enganchan solos) y **flechas** → X · ← Y · ↑ Z (candado).
3. **Plano de trabajo** a la cota: orden `PT` + `z=3` (o `y=8`, `x=5` para planos verticales) — NUEVO, sin mover la cámara.
4. **Coordenadas tecleadas** `x,y,z` / `@dx,dy,dz` / `@d<ang` en la línea de órdenes (exactas).

## Tabla (isométrico)  ✅ funciona · ⚠ a medias · ❌ falla · ➕ faltaba (agregado hoy)

| herramienta | resultado | nota |
|---|---|---|
| Nodo | ✅ | |
| Línea / Viga | ✅ | 3D por ejes enganchados, osnap o PT |
| Polilínea | ✅ | sube en Z por el eje azul |
| Rectángulo horizontal | ✅ | |
| Rectángulo vertical (ratón) | ⚠ | con el plano en z=0 queda aplastado; con `PT y=8` ✅; tecleado ✅ |
| Círculo (centro + radio tecleado) | ✅ | |
| Arco 3 ptos / Arco 2P+h | ✅ | |
| Parábola / Cúbica | ✅ / ⚠ | la cúbica una vez no creó nada tras la parábola (primer clic perdido al cambiar de herramienta); sola ✅ |
| Línea auxiliar / Punto auxiliar | ✅ | |
| Medir | ✅ | no crea geometría (bien) |
| Columna clásica (COL: altura + base) | ✅ | ahora REUSA nudos existentes (➕ arreglo) |
| Columna cinta Revit | ✅➕ | punto libre sin rejilla; en «3D» ya no salta a planta (➕) |
| Viga / Muro cinta Revit en 3D | ✅➕ | a la cota de `PT` (➕) |
| Losa 4 clics (osnap a cabezas) | ✅ | en el FEM sin barras duplicadas; en el dibujo rotula el borde «curva 18 m» (cosmético ⚠) |
| Muro (MU: altura + 2 ptos) | ❌→✅➕ | creaba 4 nudos NUEVOS: el muro quedaba suelto de las columnas (12 nudos, 8 distintos). Arreglado |
| Mover / Copiar (ult + puntos) | ✅ | |
| Desfase (O 1 + línea + lado) | ✅ | |
| Recortar / Alargar | ✅ | |
| Replicar pisos (`all rep 0,0,3 1`) | ✅ | |
| Simetría (`all mi x=0`) | ✅ | |
| Borrar | ✅ | |
| Osnap punto final / medio / intersección | ✅ | también fuera del plano de trabajo |
| Osnap perpendicular | ⚠ | no comprobado: el snap de rejilla (0.5 m) ganó |
| Flechas (candado de eje) con el foco en la línea de órdenes | ❌→✅➕ | la caja de órdenes se comía las flechas (historial). Arreglado |
| Plano de trabajo a cota Z en iso | ➕ | orden `PT` (z= / y= / x=) y hook `__hekatanPlanoTrabajo` |
| Plano vertical por 2 puntos | ⚠ | existe `plane3` (3 puntos, inclinado); para alzados: `PT y=…`/`x=…` |
| Apoyo / Carga con el ratón en 3D | ✅ | la barra dice «Seleccionados 0» después de aplicar (cosmético ⚠) |
| Analizar sin apoyos / sin cargas | ❌→✅➕ | no avisaba nada. Ahora `AN` / menú ▶ Análisis avisan: «faltan APOYOS…», «no hay CARGAS…», «mecanismo o partes sueltas» |

## MCP (prioridad 1 de Jorge) — ✅ agregado y probado
- `abrir` con `vista` (iso por defecto, encuadrada) · `vista` iso/planta/frontal/lateral · `encuadrar` (con `caja`) · `orbitar` · `zoom` · `plano_trabajo`.
- `clic_mundo` en iso: encuadra si cae fuera o tapado, **devuelve el punto creado y el desvío** (avisa «el clic cayó en OTRO punto»), `por_comando` teclea la coordenada exacta.
- `dibujar` (herramienta + puntos 3D en m, `modo` raton/comando): nodo, linea, viga, polilinea, rectangulo, circulo, arco3, arco2h, parabola, cubica, columna, muro, losa, losa_rect, aux, punto_aux, medir, apoyo, carga → lo creado + puntos que no quedaron.
- `comando` devolvía texto de los paneles (leía por posición en pantalla) ❌ → ahora lee el historial de la ventana de órdenes ✅.
- `modelo todo=true` (coordenadas, polilíneas, apoyos, cargas). Probador: `mcp/llamar.mjs`.
- ⚠ el MCP de la sesión en curso no se recarga solo: hay que reiniciar Claude Code para ver las herramientas nuevas.

## Ejemplos sin romper
edificio-aporticado, guerra-ej1-zapata-cuadrada y new-blank abren en iso, PNG bien, sin errores (solo el aviso
conocido de localhost:11434 del panel de IA). `AN` en el edificio → «✓ Analizado».

## ⏳ Falta
- Osnap perpendicular comprobado en 3D; rótulo «curva» en el borde de la losa; «Seleccionados 0» tras Apoyo.
- Rectángulo vertical con el ratón sin `PT` (podría tomar el plano de los dos puntos + eje Z, como el muro).
- Primer clic perdido al encadenar herramientas de curva (parábola → cúbica).

## Publicado ✅
- main `f9d2ffc96` (push a hekatan-struct). gh-pages `61e1da687` sobre `616cca13e` (último deploy conocido), con
  `cli/preparar_deploy_ghpages.py` (m/, SEO, sitemap conservados; wasm igual). El cambio SIN commitear de otra
  sesión en `examples/src/new-blank/newBlank.ts` se apartó con `git stash push -- <archivo>` y se devolvió con
  `git stash apply <sha>` + drop (no entra en el build publicado).
- `assets/workspace-ClviMnZv.js` público = local (cmp idéntico). MCP contra la URL pública: columnas, `AN` (avisa),
  `PT z=3`, viga y muro cosido (4 nudos, 24 GDL), **sin errores de consola**, PNG revisado.
- Lámina: `hekatan-school/frames_z10_struct_iso/f000.png`.
