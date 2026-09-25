# 2026-09-24 · Conos azules en nudos libres de los muros acoplados

Ejemplo: `itw-muro-acople` (ITW · Muros acoplados). Carga 100/8 = 12.5 lateral y 200/8 = 25 vertical por nudo de tope.

## ✅ Funcionó
- Causa: restricción REAL `[false,true,false,true,false,true]` (uy, rx, rz) en TODOS los nudos
  (`examples/src/itw/itwTests.ts`, build de `muroAcopleITW` e `muroFrameITW`). El visor
  (`hekatan-ui/src/viewer/objects/supports.ts`) dibuja cualquier restricción parcial como cono azul.
- Medido (motor WASM, sha1 deform.wasm 5cd0101e…): reacciones de esa atadura ≤ 1e-11;
  respuesta idéntica sin ella: deriva cabeza 0.2370 mm, δ punta muro+frame 6.7606 mm.
  ΣRx = −100, ΣRz = 200 solo con la base. Sobraba.
- Arreglo 1: los dos ejemplos solo con base empotrada.
- Arreglo 2: el visor no dibuja un patrón parcial que cubre más de la mitad de los nudos
  (= «Available DOFs» de ETABS/SAP, restricción de plano, no apoyo). Rodillos de losa-plana siguen.
- Test `apoyos_ficticios`: quitados los dos de PERMITIDOS.
- PNG: `2026-09-24_apoyos_muros/antes_publico_itw-muro-acople.png` → `despues_*.png`.

## ❌ No funcionó
- `node tests/run.mjs <filtro>` revienta en main: `validation/isse/paridad_py_ts.mjs` lee
  `_paridad_py.json`, que no está en git (se importa aunque no case el filtro).

## ⏳ Falta
- Publicar (gh-pages) cuando Jorge lo decida.
