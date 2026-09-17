# K local de PLACA (y lo que Jorge preguntó por el camino) — 17-sep-2026

Jorge: «nos falta la matriz de rigidez local de placas y barras, qué sugieres» ·
«yo quiero hacerlo al presionar una barra».

## ✅ Funcionó

- **La K de barra ya estaba**: tocar una barra saca el botón `📐 Ver K local · barra N`
  y la ventana con la 12×12 (`diagram2d.ts` + `klocalMatlab.ts`). Lo que faltaba era la
  de PLACA.
- **`kPanoQ4`** (`hekatan-fem/src/utils/shellElementK.ts`): las DOS matrices del paño Q4,
  12×12 cada una, porque una cáscara plana son dos elementos superpuestos que no se acoplan:
  - flexión `[w, θ1, θ2]×4` — Shell-Thick de CSI (22 gdl condensados) o DKQ si es Thin;
  - membrana `[u1, u2, θ3]×4` — ITW tipo 12, con la burbuja condensada.
- **No se escribió una fórmula nueva**: se sacó la K de los mirrors que YA estaban validados
  contra el C++ (`csiThickJoints.ts`, `itwJoints.ts`), partiendo cada uno en «ensamblar» +
  «recuperar». La única pieza nueva es la DKQ, que es `Σ BᵀDbB|J|` en Gauss 2×2 con la `dkqB`
  que ya existía.
- **Verificado contra el C++**: `node cli/_k_placa_vs_cpp.mjs` — 6 casos × 2 bloques,
  **peor 2.6e-11 %** del término mayor. El oráculo es `kelem_native` compilado de los MISMOS
  .cpp que el WASM.
- **En vivo**: `node cli/_k_pano_en_vivo.mjs` — sale el botón al designar, dos tablas 12×12,
  simétricas y con **exactamente 3 modos de energía nula**. PNG en `cli/shots/k_pano/`.

## ❌ No funcionó (y por qué)

- **Primer intento: el trapecio se iba 5.6 %.** Se le pasaban `xl, yl` = coordenadas GLOBALES.
  La K depende de la BASE en que se escriba: el C++ arma el elemento con eje 1 = `v01 + v32`,
  mientras que `analyze()` REPORTA M11/M22 en los «Area Local Axes» de CSI (eje 1 = +X global
  si el paño es horizontal). En un cuadrado coinciden; en un trapecio no. Es la misma matriz
  en otra base, y comparada entrada a entrada parece otra. Arreglado con `ejesLocalesQ4`.
- **`node tests/run.mjs fuerzas-cascara` fallaba** (F11 por nudo vs ETABS). NO era esto: el
  árbol de trabajo tenía, de OTRA sesión, el drilling por defecto cambiado de **12 → 9** en
  `analyze.ts` y en `itwJoints.ts`. Repuesto el 12 (el validado, el que documenta CLAUDE.md)
  → 6/6 en verde. ⚠️ Avisado a Jorge: si esa otra sesión quería el 9, que lo ponga por
  `elementInputs.drillingTypes`, no cambiando el defecto.

## ⏳ Falta

- Botón visible de borrar barras/áreas sobre lo DESIGNADO (hoy: herramienta 🗑 / tecla E, o
  Supr con algo designado — existe, pero no hay botón que actúe sobre la selección).
- Plantillas: **no hay cimentación** y **no hay parrilla 3D**; revisar una a una el
  arriostramiento.
- Deploy público de esto.
