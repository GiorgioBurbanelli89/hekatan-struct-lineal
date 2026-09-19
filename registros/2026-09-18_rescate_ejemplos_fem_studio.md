# Rescate de los ejemplos de FEM Studio: de `shared/` a su carpeta

Rama `sin-binario`. **Sin commit, sin deploy.** Motor FEM sin tocar.
Sigue a `registros/2026-09-18_ids_registro_y_barrido.md`.

Jorge: «rescatar mis ejemplos, correcto» · «y sacarlos de ahí, que eso es un bug».

---

## ✅ El bug de fondo

`examples/src/shared/moreExamples.ts` (786 líneas) guardaba **21 `ExampleDef`
completos** —`params` + `build` + `runModal`— del FEM Studio viejo. El fichero
**no lo importaba NADIE**. `shared/` es para código compartido, no para esconder
ejemplos: por eso quedaron muertos y `?t=arco` salía en blanco.

Y el bug tiene una segunda cara que se vio al reponer `plate-thick-validacion`:
ese fichero seguía importando **`awatif-fem`**, el nombre de paquete de antes del
rebrand (commit `ed5ae58c7`). Nunca dio la cara porque, al no estar en el
registro, **nadie lo compilaba**. Código fuera del registro es código que nadie
prueba.

---

## ✅ Lo que se hizo

- **21 carpetas nuevas** `examples/src/<id>/` con `<nombre>.ts` (el `ExampleDef`),
  `main.ts` (`runExampleStandalone`) e `index.html`, igual que el resto del repo.
- **21 entradas en `examples/vite.config.ts`** → cada uno tiene su página
  standalone `/<carpeta>/`.
- **`shared/moreExamples.ts` BORRADO.** Lo único que de verdad era compartido se
  queda en `shared/simpleExampleTemplates.ts`: `makeSimpleExample` (ya estaba) y
  `clonarParamsCon` (antes `cloneEdificioParams`, lo usan las 3 variantes de
  `edificio-aporticado`), con nombre honesto y genérico.
- **Stubs `legacy("diagrid")` y `legacy("pergola")` fuera**: tenían el MISMO id
  que los paramétricos y dos entradas con el mismo id dejan `?t=diagrid` en
  blanco (ya pasó el 6-sep-2026). Las páginas de awatif siguen en `/diagrid/` y
  `/pergola/`; los paramétricos van en `diagrid-parametrico/` y
  `pergola-parametrica/`.
- **`plate-thick-validacion` repuesto** (lo borró de refilón el commit
  `6c1d26131`), con su import arreglado y su entrada de vite, que tampoco tenía.

Registro: **144 → 162 ejemplos**.

---

## ✅ Los 20 registrados, medidos uno a uno

`node cli/check_ejemplos_rescatados.mjs --standalone` (nuevo). Mide de verdad:
carga por `?t=<id>` **y** por su página standalone, sin un solo `pageerror`;
resuelve (un desplazamiento por nudo, ningún NaN); **equilibrio ΣR + ΣF = 0**; y
la animación modal por `check_animacion_modal.mjs`.

| id | nudos | barras/cásc. | ΣRz | carga Z | error equil. | standalone | cos(dib, φ) | categoría asignada |
|---|---|---|---|---|---|---|---|---|
| `arco` | 21 | 20/0 | 200.0000 | −200.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 3 GDL Pórtico plano |
| `eiffel` | 36 | 96/0 | 100.0000 | −100.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 6 GDL Espacial |
| `puente` | 18 | 33/0 | 450.0000 | −450.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 3 GDL Pórtico plano |
| `burj` | 84 | 174/0 | −0.0000 | 0.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 6 GDL Espacial |
| `twisted` | 84 | 160/0 | 0.0000 | 0.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 6 GDL Espacial |
| `diagrid` | 88 | 248/0 | 0.0000 | 0.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 6 GDL Espacial |
| `opera` | 39 | 36/0 | 90.0000 | −90.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 6 GDL Espacial |
| `pergola` | 8 | 9/0 | 5.0000 | −5.0000 | 0.0000 % | ok | 1.000000 | 1️⃣ Frames · 🎯 6 GDL Espacial |
| `edif-acero-diag` | 1368 | 471/1200 | 189.0000 | −189.0000 | 0.0000 % | ok | 1.000000 | 4️⃣ Mixtos · 🏢 Edificios |
| `edif-muros` | 1332 | 411/1200 | 189.0000 | −189.0000 | 0.0000 % | ok | 1.000000 | 4️⃣ Mixtos · 🏢 Edificios |
| `edif-mixto` | 1368 | 447/1200 | 189.0000 | −189.0000 | 0.0000 % | ok | 1.000000 | 4️⃣ Mixtos · 🏢 Edificios |
| `losa-rect` | 99 | 0/80 | 120.0000 | −120.0000 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🧱 Placas |
| `losa-plana` | 117 | 0/96 | 468.0000 | −468.0000 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🧱 Placas |
| `placa-xy` | 77 | 0/60 | 51.3333 | −51.3333 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🧱 Placas |
| `placa-orificios` | 121 | 0/99 | 3.0250 | −3.0250 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🧱 Placas |
| `viga-alta` | 153 | 0/128 | 400.0000 | −400.0000 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🕸 Membranas |
| `viga-q4` | 147 | 0/120 | −10.0000 | 10.0000 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🕸 Membranas |
| `muro-q4` | 91 | 0/72 | −0.0000 | 0.0000 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🕸 Membranas |
| `muro-contencion` | 117 | 0/96 | 0.0000 | 0.0000 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🕸 Membranas |
| `talud` | 65 | 0/48 | 2708.3333 | −2708.3333 | 0.0000 % | ok | 1.000000 | 2️⃣ Shells · 🕸 Membranas |

**20/20 ✅** · equilibrio 0.0000 % en los veinte · 0 NaN · 0 `pageerror` ·
`cos(dibujo, φ) = 1.000000` en los veinte con modal.

Y `plate-thick-validacion` repuesto (sin modal, `hasModal: false`): carga,
resuelve y compila su página standalone.

---

## ❌ NO APTOS — apartados, con el motivo medido

| id | motivo |
|---|---|
| `col-placa` | **MECANISMO.** 0 desplazamientos de 51 nudos, ΣRz = 0 contra 100 kN aplicados y «Matrix decomposition failed» en consola. Su `gen` crea un nudo `centerIdx` NUEVO en (0,0,0) para el pie de la columna en vez de usar el nudo de la malla que ya está ahí: **la columna no toca la placa** y la K es singular. Es el mismo fallo de las vigas secundarias de `edif-acero`. La carpeta `examples/src/col-placa/` queda con el código y el diagnóstico escrito en `exampleRegistry.ts`; se arregla buscando el nudo de la malla en (0,0,0), pero eso es tocar el modelo y hay que medirlo contra algo. |

Uno de veintiuno. El resto entra.

---

## ❌ Lo que no funcionó por el camino (y lo que enseñó)

- **La categoría de `arco`**, ya contado: decía «4️⃣ Mixtos» siendo 20 barras.
  Al repartir los 21 se revisaron todas: **4** llevaban la raíz muerta
  `🗽 Icónicos`, **10** `🧱 Losas y cáscaras`, y los `edif-*` no traían ninguna.
  Se asignaron por el TIPO DE ELEMENTO, que es lo que el test cuenta.
- **`col-placa` decía «2️⃣ Shells»** y `categorias-arbol` lo cazó: 1 barra + 36
  cáscaras es Mixtos. Corregido antes de descubrir que además es un mecanismo.
- ❌ **Mi propia medida de equilibrio estaba mal.** Midiendo solo en Z, `twisted`
  salía «no equilibra al 100 %»: sus cargas son de VIENTO, horizontales, así que
  ΣFz = 0 y ΣRz = 0 salvo el ruido de coma flotante — y dividir ruido entre ruido
  da cualquier cosa. **El modelo estaba perfecto; el mal medidor era el mío.**
  Ahora se miden las TRES componentes con la resultante aplicada mayor de
  referencia. Estuvo a punto de costarle el registro a un ejemplo sano.
- ❌ **Y la sonda del standalone también.** Preguntaba por `window.__hekatanStates`,
  que lo pone `workspace/main.ts` — el runner standalone es otro. Las 21 páginas
  salían «sin nudos» estando bien. Ahora se juzga por los objetos dibujados en la
  escena de Three.js.
- ❌ **`node tests/run.mjs animacion` justo después de `npm test` tumbaba el
  proceso**: el puerto 4793 seguía tomado y el `EADDRINUSE` es un evento `error`
  del Server, que no cazaba el `try` del caso. Un arnés no puede caerse por eso:
  ahora `abrirVisor` prueba el puerto siguiente (hasta 20).

---

## ⚠️ Los 4 Q4 y la lista de apoyos permitidos

`npm test` bajó a 633/643 con `apoyos-ficticios`: `viga-alta`,
`muro-contencion`, `muro-q4` y `viga-q4` atan **todos** sus nudos.

**No es una atadura de más, y no se subió ningún límite.** El propio test
documenta tres casos legítimos y el primero es éste. Comprobado en su `gen`, no
supuesto: los cuatro generan todos sus nudos con **`y = 0`** (malla en el plano
X-Z) y atan exactamente `[false, true, false, true, true, true]` — uy y los tres
giros, dejando **libres ux y uz**, que son los GDL del plano. Es la misma
atadura que ya llevan los `itw-*`. Se añaden a `PERMITIDOS` con ese motivo
escrito; la lista falla también si uno deja de hacer falta.

---

## ✅ Marcadores

- `npm test` → **634/643 en 407 s**. Igual que la base, **+0 fallos nuevos**, con
  21 ejemplos más en el registro. Ningún límite subido.
- `node tests/run.mjs categorias` → **3/3**, los 162 del registro, 115 construidos
  y contados.
- `node tests/run.mjs animacion` → **21/21**.
- `node tests/run.mjs apoyos-ficticios` → **4/4**, 13 permitidos cada uno con motivo.
- `node cli/check_ejemplos_rescatados.mjs --standalone` → **20/20 ✅**.
- `npm run build -w examples` → **✓ built**, las 21 páginas nuevas compilan.
- `cli/shots/deploy/_ids.txt` regenerado desde el registro: **144 → 162**.

## Máquina

RAM libre **4243 MB** de 16092 · Disco C **5.6 GB** libres (se limpiaron 80
carpetas `hkTest-*` del temporal; ⚠️ bajó de 13.6 GB con los builds de hoy, hay
que vigilarlo).
