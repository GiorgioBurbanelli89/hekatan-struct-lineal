# MCP de Hekatan Struct (CAD web)

Conecta Claude con el CAD publicado: **ver** (captura), **elegir herramientas** (botones del panel y del ribbon) y **dibujar** (clics reales).

## Herramientas
| herramienta | qué hace |
|---|---|
| `abrir` | abre el CAD (`ejemplo` = plantilla `?t=`, p. ej. `new-blank`) |
| `captura` | PNG de la pantalla (para ver qué hay y qué falta) |
| `botones` | lista los botones/carpetas visibles |
| `boton` / `carpeta` | aprieta un botón o abre una carpeta por su texto |
| `tecla` | Escape, Enter, `Control+z`… |
| `clic` / `dibujar_linea` | clics en el lienzo (fracciones 0–1) |
| `modelo` | nudos, polilíneas, áreas dibujadas |
| `errores` | errores de consola |
| `cerrar` | cierra el navegador |

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
