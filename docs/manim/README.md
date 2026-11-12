# Explicar Hekatan Struct con Manim

Cuando el usuario pida *«explícame … con Manim»* (o «en Manim») sobre un elemento, formulación o estructura de Hekatan Struct:

1. Lee `docs/ALGORITMOS_SHELL.md` (qué es y dónde está) y esta carpeta.
2. Copia `escena_elemento_q4.py` y cambia `TITULO`, `PASOS` (nombre + ecuación en texto Unicode) y el dibujo.
3. Entrega **el archivo `.py` completo** en un bloque de código + el comando de render.
4. Explica corto, en español simple, el porqué de cada paso (estilo y = m·x + b).

**Importante:** Claude móvil/web **no renderiza Manim** (no ejecuta Manim ni genera el vídeo). Entrega el
código; el usuario lo corre en su PC:

```
pip install manim            # una vez (NO hace falta LaTeX)
manim -pql escena_elemento_q4.py ElementoQ4    # prueba rápida 480p
manim -pqh escena_elemento_q4.py ElementoQ4    # 1080p
```

Si el usuario quiere verlo **ya** en el móvil sin renderizar: genera un artifact HTML/SVG animado con los mismos pasos.

## Reglas de las escenas
- Un paso por bloque: nombre en naranja + ecuación con `Text` y símbolos Unicode (κ ∂ ∫ φ …), **nunca `MathTex`/LaTeX**.
- Bloques alineados a la izquierda (`move_to(..., aligned_edge=LEFT)`), nada de `to_edge` por bloque.
- Para resaltar: pulso de escala (`.animate.scale(1.09)`), no `Indicate` si hay `ImageMobject` (tiñe de amarillo).
- Ecuaciones como texto Unicode (sin LaTeX; para subíndice/transpuesta escribir «Bt» o «B transpuesta» si el símbolo no sale), nombres de formulación como en `docs/ALGORITMOS_SHELL.md` (DKE, MITC4, DSE, ITW 1990).
- Losas siempre Shell-Thin (DKE).
- Probada con Manim Community v0.20.1.
