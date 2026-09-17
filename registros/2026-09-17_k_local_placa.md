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

---

# Plantilla de CIMENTACIÓN — 17-sep-2026

Jorge: «en plantillas también falta cimentaciones» · «no hay plantilla de cimentación todavía».

## ✅ Funcionó

- `examples/src/plantillas/cimentacion.ts`, tipo **8** de la plantilla. Dos tipologías sobre
  la misma rejilla de ejes: **zapatas aisladas + vigas de amarre** (con pedestal y carga de
  columna) y **losa de cimentación** con vuelo.
- El suelo son **muelles de Winkler, no apoyos**, con el patrón de `zapata-aislada` (validado
  contra SAFE): `kv = ks·A_trib`, `kh = ks/2·A`, y tres muelles de giro minúsculos en un nudo
  para quitar el último sólido rígido.
- **El equilibrio cierra**: ΣR del terreno = ΣP aplicada = 3600.0 kN en las tres variantes.
  Ése es el test que vale; si los muelles no recogen la carga, lo demás sobra.
- La opción aparece sola en «📐 Nuevo modelo · Plantillas»: ese menú se construye leyendo
  `params.tipo.options`, no con una lista aparte.
- `node cli/_plantilla_cimentacion.mjs` — 10/10.

## La pregunta de Jorge: ¿Thin o Thick en una zapata?

Medido en el `.f2k` que **escribió SAFE** (`validation/04-cimentaciones-safe/zapata-aislada`):
su propiedad de zapata de fábrica es

```
Name=Footing1   "Modeling Type"=Shell-Thin   "Property Type"=Footing
```

O sea: **SAFE pone Shell-Thin en una zapata**, igual que en `Slab1`, `Wall1` y `Stiff1`. Por eso
el defecto de la plantilla es Thin — Hekatan copia a CSI — y Thick queda como opción (`zapForm`).

Lo que cuesta, con la MISMA malla (9 zapatas, 144 paños): asiento máx **Thin −5.162 mm ·
Thick −5.201 mm = 0.75 %**. En el ASIENTO casi da igual, porque manda el muelle del suelo, no la
placa. Donde va a doler es en el CORTANTE (punzonamiento), que es justo lo que Kirchhoff no tiene.
⏳ Falta medirlo: comparar V13/V23 entre las dos y contra SAFE.

## ❌ No funcionó (y por qué)

- **La rama no entró en el bundle**: el parche de `build()` se hizo con `\n` y el fichero tiene
  `\r\n`, así que el `replace` no encontró nada y **no dijo nada**. El desplegable sí mostraba la
  opción (ese parche era de una línea) y el modelo salía siendo un pórtico 3D. Lo cazó el test al
  ver `0 paños · 0 muelles`.
- **La malla se duplicaba sola**: el deslizador entrega `ms = 0.49999999999999994` y
  `ceil(1.0/0.4999…) = 3` donde toca 2 — dos corridas con el mismo `ms` salían con 324 y 144
  paños. Con eso, comparar Thin contra Thick medía la malla, no la formulación. Arreglado con
  una tolerancia de 1e-9.

---

# El terreno no tira: muelle de solo compresión — 17-sep-2026

## ✅ Funcionó

- **Es lo que hace SAFE**, medido en su propio `.f2k`
  (`validation/04-cimentaciones-safe/zapata-aislada/zapata.f2k`):
  `Name=ASpr1 "Subgrade Modulus"=105 "Nonlinear Option"="Compression Only"`.
  Ojo al matiz: los `SPR1..3` de `cimentacion_9zapatas.f2k` salen `"None (Linear)"`,
  pero ésos los escribe NUESTRO exportador, no SAFE.
- El solver es lineal, así que se resuelve por **conjunto activo**: se resuelve, se
  quita el muelle a los nudos que se levantan, se vuelve a resolver, y un nudo
  apartado puede volver si vuelve a comprimir. **Converge en 2 iteraciones** en las
  dos tipologías excéntricas.
- Al converger se comprueban las **dos condiciones de complementariedad**, que es lo
  que hace defendible el resultado: donde hay muelle el nudo comprime, y donde el
  nudo se levanta no hay muelle. **0 y 0** en lindero y esquinera.
- Efecto medido: lindero **−11.215 → −11.460 mm**, esquinera **−17.776 → −20.079 mm**.
  Asienta más, que es lo correcto: antes había muelles *sujetando* la zapata.
- Las siete tipologías siguen cerrando ΣR = ΣP.

## ❌ No funcionó (y por qué)

- **El equilibrio parecía no cerrar** (770.8 contra 800 kN): el test sumaba `−k·w` de
  TODOS los muelles verticales, incluidos los ya retirados, cuyo `w > 0` restaba.
  Eran muelles que la solución había quitado. Corregido: solo se suma donde comprime.
- Y por el camino, un fallo real que salió de ahí: el modelo guardaba en
  `nodeInputs.springs` la lista ENTERA aunque hubiera resuelto con un subconjunto.
  Cualquiera que la leyera después (el modal, un export, una comprobación) contaría
  muelles inexistentes. Ahora guarda los activos.

## ⏳ Falta

- El punzonamiento de SAFE: está en `SAFE.exe` nativo (`ConcreteSlabDesignPunchingShear`,
  `DBTABLETYPE_DESIGN_PUNCHAPI_DETAILED`), no en los .NET. Necesita abrir SAFE por OAPI
  (~4.6 GB) para sacar `b0`, `d`, `γv`, `Jc` y arbitrar la fórmula.
- El exportador `.f2k` escribe muelles de NUDO lineales; SAFE usa muelle de ÁREA
  «Compression Only». No es lo mismo y hay que igualarlo.
