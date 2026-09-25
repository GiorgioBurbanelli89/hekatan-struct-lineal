# 2026-09-25 — Tooltip del cursor: sección + material en hover (s2k/e2k)

Pedido: al pasar el cursor por un frame o shell, en modo "none" (sin deformación
ni cálculo), el tooltip debe mostrar el nombre de la sección de definición y el
material que usa, en líneas verticales.

## Qué se encontró
- `hover.ts` ya muestra "📋 nombre / Shape / Dim / Mat" PERO solo si existe
  `elementInputs.sectionInfo` (`Map<idx, {name,shape,D,B,TF,TW,material,...}>`).
- Ningún parser (.s2k/.e2k) llenaba `sectionInfo`: solo los builders de ejemplo
  (cantilever, beamFixedFixed, pazFrame). Por eso el importado no mostraba nada.
- El tooltip corre siempre que haya hover: el modo "none" solo apaga los
  visuals 3D, no el tooltip. No había que gatear nada.

## Qué se hizo
1. `s2kParser` — `(ei).sectionInfo` con name/shape/D/B/TF/TW/material por barra
   (frame / shell / sólido). Cotas solo si `> 0` (secciones SD/General sin
   dimensión no pintan "D=0").
2. `e2kParser` — `sectionInfo` para frames (con `fillMaterial` de CFT) y para
   las áreas (name/modeling/t/material de shellProps).
3. `hover.ts` — líneas `Sección: <nombre>` y `Material: <mat>` (antes 📋/Mat);
   guarda NaN/0 en cotas; detecta hormigón también por material ("Conc_1",
   "4000Psi") para pintar en cm y no en mm.
4. El flujo entero ya conserva campos extra de `elementInputs`
   (csiImporter/workspace no los filtran), así que `sectionInfo` viaja
   parse → main.ts → sessionStorage → csiImporter → viewer sin tocar nada más.

## Verificación
- ✅ S2K real (Cancha Parque v24): 1293/1293 barras con `sectionInfo`
  (ej. `CC-1 30x50 cm`, material `4000Psi`).
- ✅ E2K real (boveda_masa3d): 13/13 barras (ej. `C_G1`, `Conc_1`) y
  110/110 áreas (ej. `Losa`, ShellThick, t=200).
- ✅ Tests: s2k 12/12, e2k-patron 8/8, e2k-shell 6/6, unidades-e2k 24/24.
- ✅ `npm run build -w examples` compila.
- ⚠️ e2k-geometria / e2k-areas-roundtrip siguen fallando por
  `import.meta.env.DEV` (Vite-only) — ajeno a esto.
- ✅ Deploy a gh-pages hecho (base /hekatan-struct-lineal/, commit `60d0812b1`).

## Notas
- Secciones "General"/"SD Section" sin D ni B: el hover muestra nombre,
  shape y material (sin cotas). No queda feo ni miente.
- Los nombres de los materiales del s2k (ej. "4000Psi") son los que SAP
  escribe en MATSAT/descr: se muestran tal cual vienen.

## Diagnóstico de las capturas de Jorge (01:13-01:33) ✅
- ❌ **No funcionaba en su prueba**: entró con la versión VIEJA cacheada
  (?t=new-blank = import viejo que solo pasaba nudos y líneas → perdía
  cargas/apoyos/secciones/hover). Solución: Ctrl+Shift+R y reimportar.
- ✅ Verificado con `Cancha Parque v24.s2k` (real): 14 apoyos, 582 nudos
  cargados (ΣFz = −1352.59 kN), 1293 `sectionInfo`, modelo JSON = 0.63 MB
  (cabe en sessionStorage). Parser OK.
- ✅ El hover nuevo SÍ está en el bundle publicado: `Secci\xF3n` (esbuild
  escapa `é` como `\xF3`; grep por "Sección:" no lo veía).
- ❌ **La membrana no existe en el archivo**: 0 `CONNECTIVITY - AREA`,
  0 `NumJoints` en Cancha Parque v24.s2k y en Cancha Parque.s2k. SOLO
  existe la definición `Section=Cubierta Type=Membrane` (AREA SECTION
  PROPERTIES, línea 130) — nunca asignada a un objeto. No es bug de
  Hekatan: no hay objetos de área que mostrar. Re-exportar desde SAP2000.