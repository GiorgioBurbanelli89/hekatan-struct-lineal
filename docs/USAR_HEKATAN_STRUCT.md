# Cómo usar Hekatan Struct cuando se pide «usa Hekatan Struct para hacer tal estructura»

Instrucciones para un asistente (Claude móvil / web / Code) con este repo conectado.

## Orden de lectura
1. `docs/ALGORITMOS_SHELL.md` — qué formulación es cada una y dónde está.
2. `CLAUDE.md` — convenciones (ejes locales CSI, brazos rígidos, comportamiento ETABS/SAP2000/SAFE).
3. Un `.heks` de ejemplo parecido en `tests/datos/` (p. ej. `cimentacion_9zapatas.heks`, `mixto_solido_muro_columna.heks`, `cubierta_lroof.heks`) y copiar su estructura.

## Reglas fijas de formulación
- **Losas: siempre Shell-Thin (DKE, Batoz & Tahar)** → `shelltype <id> thin`.
- Shell-Thick (MITC4 + modos de Wilson) solo si se pide expresamente; compararlo contra Thin.
- Membrana de muros/cáscaras: ITW 1990 (`drillingTypes = 8`, defecto), no cambiar sin motivo.
- Barras: Timoshenko con `as`; ejes locales convención CSI. Trampa: en `frame` el 6º token es **I22** y el 7º **I33**.
- Unidades del ejemplo: kN, m.
- Comportamiento por defecto según programa de comparación: `comportamiento etabs|sap2000|safe`.

## Directivas `.heks` confirmadas en los ejemplos
`node`, `frame`, `shell`, `shelltype`, `areaload`, `load`, `support`, `selfweight`, `hex`, `incompatible`,
`etabsjoint`, `solve`; más `endoffset`, `rigidzone`, `automesh`, `deck etabs`, `diaph`, `spring`, `ang`, `as`,
`isec`, `tubo`, `cft`, `canal`, `dosl` (ver `CLAUDE.md`). **No inventar directivas**: si falta una, buscarla en
`hekatan-struct-py/src/hekatan_struct/heks.py` o en `examples/src/cli-modeler/cliModeler.ts`.

## Flujo cuando el usuario pide una estructura
1. Aclarar solo lo imprescindible (luces, alturas, cargas, materiales).
2. Escribir el `.heks` copiando un ejemplo cercano, losas con `shelltype … thin`.
3. Resolver con `hekatan-struct-py` (`leer_heks` → `resolver_heks`) o el CLI (`cli/`), y reportar desplazamientos/reacciones.
4. Verificar equilibrio (ΣR = ΣF) antes de dar resultados.
5. Citar la formulación usada (DKE, ITW 1990, …) y su archivo.

## Texto para pegar en «Instrucciones del Proyecto» (claude.ai)
```
Este proyecto contiene el repo hekatan-struct-lineal (Hekatan Struct, FEM de edificios/shells).
Cuando diga «usa Hekatan Struct» (o «con sus formulaciones») para una estructura:
lee docs/USAR_HEKATAN_STRUCT.md y docs/ALGORITMOS_SHELL.md y sigue esas reglas.
Losas SIEMPRE Shell-Thin (DKE). No inventes directivas .heks; copia ejemplos de tests/datos/.
Responde corto, en español simple, explicando el porqué.
```
