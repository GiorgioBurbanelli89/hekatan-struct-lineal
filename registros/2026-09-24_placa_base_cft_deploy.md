# 2026-09-24 — placa-base-cft en el sitio público

✅ Pedestal/relleno (láminas Q4 de 1 mm, solo dibujo) sin resultado de cáscara → gris neutro (antes magenta = 0).
✅ Pico vM 8.33e5 kN/m² es del ACERO (cabeza del tubo, cargas puntuales) → rango por defecto «solo losas» (placa 0–2.37e5).
✅ Cámara: encuadre del modelo entero centrado (setViewOffset) entre Settings y la barra; Settings plegado < 1300 px.
✅ Panel de comprobaciones (48vh) y Parameters apilados; iframe del workspace entre #hk-cad-tit y #hk3-cmdline.
✅ Igual en placa-base-hueca. main 252909051, gh-pages 4f2a4425a. Verificado público 1860×1100 y 1366×768.
❌ `git worktree remove --force` con node_modules de JUNCTIONS: siguió las junctions y vació node_modules del repo
   original (442 paquetes). Restaurado con `npm ci --prefer-offline`. Regla: borrar las junctions ANTES (Delete() por
   reparse point) y nunca `rmdir /s` / `worktree remove --force` con junctions dentro.
⏳ Etiquetas «-12.5» de las cargas se amontonan en la cabeza de la columna (cosmético).
