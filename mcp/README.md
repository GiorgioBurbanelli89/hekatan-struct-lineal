# MCP de Hekatan Struct (CAD web)

Conecta Claude con el CAD publicado: **ver** (captura), **elegir herramientas** (botones del panel y del ribbon) y **dibujar** (clics reales).

## Herramientas
Maneja la interfaz **gráfica real** (clics de ratón en un Chrome de verdad), como un usuario.

| herramienta | qué hace |
|---|---|
| `abrir` | abre el CAD (`ejemplo` = plantilla `?t=`, p. ej. `new-blank`); `vista` = iso (defecto, encuadrada) / planta / frontal / lateral / ninguna |
| `vista` | iso · planta · frontal · lateral (= teclas 1-4 de la cinta) + zoom extensión |
| `encuadrar` | zoom extensión; con `caja` [x0,y0,z0,x1,y1,z1] deja además esa caja a la vista (antes de dibujar en iso) |
| `orbitar` / `zoom` | azimut y elevación absolutos (grados) / acercar-alejar |
| `plano_trabajo` | xy a cota z, xz por y, yz por x, SIN mover la cámara (= orden `PT` `z=3`) |
| `dibujar` | herramienta + puntos 3D en metros: nodo, linea, viga, polilinea, rectangulo, circulo, arco3, arco2h, parabola, cubica, columna (base + altura), muro (2 ptos + altura), losa, losa_rect, aux, punto_aux, medir, apoyo, carga; `modo` raton o comando; devuelve lo creado y los puntos que NO quedaron donde se pidió |
| `comando` | órdenes por la línea de comandos (`l`, `0,0,3`, `pt`, `z=3`, `an`…); devuelve el historial de la ventana de órdenes |
| `captura` | PNG de la pantalla (para ver qué hay y qué falta) |
| `botones` | lista botones, carpetas y la barra de arriba (Modificar, Rejilla, Eje, Nivel, Columna, Viga, Losa, Muro) |
| `boton` / `carpeta` | aprieta un botón o abre una carpeta por su texto (solo entre los visibles; hace scroll antes) |
| `panel` | abre/cierra el panel izquierdo o derecho (con el panel cerrado sus botones no se ven) |
| `campos` / `campo` | lista / cambia los campos del panel por su etiqueta («Vanos X (m)» = «5,5») |
| `clic_mundo` | clic en un punto (x, y, z) en metros, en cualquier vista; encuadra si cae fuera; `por_comando` lo teclea (exacto). Devuelve el punto CREADO y el desvío: si no coincide, el clic cayó en el plano de trabajo |
| `clic` / `dibujar_linea` | clics en el lienzo (fracciones 0–1) |
| `tecla` | Escape, Enter, `Control+z`… |
| `estado` | nº de nudos/frames y mensajes de la barra de estado |
| `modelo` | nudos, polilíneas, áreas dibujadas |
| `errores`, `cerrar` | utilidades |

**Ver lo que hace:** `HEKATAN_VISIBLE=1` abre la ventana (con un punto rojo que sigue al ratón y movimiento lento).

## Instalar
```bash
cd mcp && npm install
claude mcp add hekatan-struct -- node /RUTA/A/hekatan-struct/mcp/server.mjs
```
Variables: `HEKATAN_URL` (def. el deploy público), `HEKATAN_VISIBLE=1` (ver la ventana).

## Seguridad
Solo abre `HEKATAN_URL`; no ejecuta JavaScript arbitrario ni toca archivos del disco.

## Probar
`node probar.mjs <carpeta_para_PNG>` (actúa como cliente MCP y recorre todas las herramientas).
`node llamar.mjs guion.json carpeta` (cliente MCP con un guion `[{tool, args, nombre}]`; `COMPACTO=1` resume y guarda cada respuesta). Sirve para probar herramientas nuevas sin reiniciar la sesión de Claude.

## Dibujar en ISOMÉTRICO (cómo se elige un punto fuera del plano)
El ratón cae en el **plano de trabajo**. Para un punto 3D: (1) **osnap** a un nudo/medio/intersección que ya exista (funciona a cualquier cota); (2) **ejes** rojo/verde/azul y **flechas** → X · ← Y · ↑ Z (candado) desde el último punto; (3) `plano_trabajo` / orden `PT` a la cota que toque; (4) coordenadas tecleadas (`por_comando`, `@dx,dy,dz`). `clic_mundo` avisa si el punto creado no es el pedido.
