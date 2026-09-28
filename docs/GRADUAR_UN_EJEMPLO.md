# Graduar un ejemplo: de página propia a ejemplo del workspace

Regla de Jorge (28-sep-2026): **todo vive en el workspace, nada en otro lado.**

Un ejemplo «embebido» es una página aparte (`examples/src/<id>/main.ts`, con su panel, sus
estados y su visor) que el workspace enseña metida en un marco. **Graduarlo** es convertirlo en
un `ExampleDef` (`params` + `build`) que corre dentro del workspace como los demás.

Modelos ya graduados, para copiar la forma:

| ejemplo | fichero | qué enseña |
|---|---|---|
| sólidos H8 | `examples/src/muro-contencion-solido/muroContencionSolido.ts` | `resolverSolidoEnWorkspace`, `computedLabels`, `defaultSolidResult` |
| sólidos H8 con corte | `examples/src/bulbo-presiones-suelo/bulboPresionesSuelo.ts` | malla pura en una función aparte, rango fijo del colormap, corte del visor |
| barras y cáscaras sencillo | `examples/src/col-placa/colPlaca.ts` | `makeSimpleExample` |
| cáscaras con norma | `examples/src/placa-base/placaBase.ts` | `computedLabels` con comprobaciones AISC / ACI |

La interfaz está en `examples/src/workspace/exampleRegistry.ts` (`ExampleDef`, `ParamDef`,
`BuildStates`).

## Las reglas

1. **El MODELO no cambia.** El código que genera nudos, elementos, apoyos, cargas y propiedades
   se MUEVE tal cual: mismo orden de nudos, mismos valores por defecto, misma llamada al solver.
   Si se «mejora» por el camino, ya no se puede saber si el ejemplo graduado da lo mismo que el
   de antes. Las mejoras van después, en otro commit.
2. **La malla, en una función pura** (`export function malla…(p)`), sin estados ni DOM: la usan
   el ejemplo y su test.
3. **El módulo tiene que poder importarse en Node.** Nada de `import … from "hekatan-ui"`, ni
   `document`, ni `window` al cargar el fichero. Lo que haga falta del navegador va dentro de
   `build`, protegido con `typeof window !== "undefined"`. `three` sí se puede importar (para
   `states.objects3D`).
4. **El panel de resultados pasa a `computedLabels`**: cada número que la página enseñaba
   (flecha analítica, error %, cociente demanda/capacidad, tensión máxima) sale en el folder
   «📊 Calculados», con su unidad. Un número que solo salía por `console.log` también se sube:
   en la consola no lo ve nadie.
5. **Los valores de referencia se conservan con su fuente.** Si la página comparaba contra
   OpenSees, SAP2000, ETABS o una fórmula, el número de referencia y de dónde sale se quedan
   escritos en el código y en la etiqueta. No se inventa ninguno nuevo.
6. **Parámetros**: los mismos, con los mismos valores por defecto y rangos, agrupados en
   folders (`Geometría`, `Malla`, `Material`, `Cargas`…). Un deslizador 0/1 pasa a casilla
   (`boolean: true`). Un deslizador que elegía el campo a pintar desaparece: eso lo hace el
   desplegable de resultados del visor.
7. **Campo por defecto**: `defaultShellResult`, `defaultFrameResult` o `defaultSolidResult`,
   el que abría la página (mirar su `settingsObj`).
8. **Id, nombre y categoría**: los del registro actual (`ejemplosConPanelPropio.ts`). La
   categoría la manda el TIPO DE ELEMENTO: barras → `1️⃣ Frames`, cáscaras → `2️⃣ Shells`,
   hexaedros → `3️⃣ Sólidos`, mezcla → `4️⃣ Mixtos`.
9. **No hay página propia.** El ejemplo NO lleva `main.ts` ni `index.html`: se abre con
   `/workspace/?t=<id>`. Se registra en `examples/src/workspace/exampleRegistry.ts` y, si su
   carpeta tenía dirección propia, se añade a `PAGINAS_DE_ANTES` en `examples/vite.config.ts`
   para que el enlace viejo redirija.
10. **Español**, léxico de ingeniería, sin la palabra del proyecto de origen.

## Cómo se comprueba

```bash
# 1. el test del ejemplo, en Node (no necesita build)
node tests/run.mjs graduado-<id>

# 2. nudo a nudo contra la página de ANTES, en el navegador (necesita build)
npm run build:deploy
node cli/comparar_graduado.mjs <id>

# 3. sólidos: que cada campo pinte lo suyo
node cli/ctl_solidos.mjs <id>
```

El test (`tests/casos/graduado_<id>.mjs`) construye el ejemplo con sus valores por defecto y
comprueba, como mínimo:

- que hay nudos y elementos, y cuántos de cada tipo;
- que la deformada no tiene NaN;
- **equilibrio**: suma de reacciones + suma de cargas = 0, componente a componente;
- los números que la página comparaba (fórmula o programa), con el límite que la página daba
  por bueno.

`comparar_graduado` abre la página vieja de un build de antes
(`../hekatan-struct-todo/website/src/examples`) y el workspace del build de ahora, y compara
nudos y desplazamientos leyendo la escena de three.js. Tiene que dar 0 nudos sin pareja.
