# MCP de Hekatan Struct (CAD web)

Conecta Claude con el CAD publicado: **ver** (captura), **elegir herramientas** (botones del panel y del ribbon) y **dibujar** (clics reales).

## Herramientas
Maneja la interfaz **gráfica real** (clics de ratón en un Chrome de verdad), como un usuario.

| herramienta | qué hace |
|---|---|
| `abrir` | abre el CAD (`ejemplo` = plantilla `?t=`, p. ej. `new-blank`) |
| `captura` | PNG de la pantalla (para ver qué hay y qué falta) |
| `botones` | lista botones, carpetas y la barra de arriba (Modificar, Rejilla, Eje, Nivel, Columna, Viga, Losa, Muro) |
| `boton` / `carpeta` | aprieta un botón o abre una carpeta por su texto (solo entre los visibles; hace scroll antes) |
| `panel` | abre/cierra el panel izquierdo o derecho (con el panel cerrado sus botones no se ven) |
| `campos` / `campo` | lista / cambia los campos del panel por su etiqueta («Vanos X (m)» = «5,5») |
| `clic_mundo` | clic en un punto (x, y, z) en metros, proyectado con la cámara |
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
