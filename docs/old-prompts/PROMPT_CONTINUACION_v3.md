# Prompt de continuación v3 — sesión 2026-05-01 (extendida)

Continuación de validación FEM Hekatan-struct vs SAP2000/SAFE/ETABS,
fix unidades tonf/kN, layered shell ABBD, Winkler springs.

## 🌐 Deploy LIVE

**https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/**

Branch repo: `main`
Último commit: `bb024bbf` (a la fecha 2026-05-01)
Branch deploy: `gh-pages` (commit `9351e439`)

## ✅ Cambios completados (16 commits desde el inicio)

| Commit | Descripción |
|---|---|
| `38f76363` | feat: nuevo ejemplo workspace `layered-shell` (CLT/ABBD) con presets Iso/CLT3/CLT5/Sandwich/Bimetálico |
| `3df584eb` | fix: preset Asimétrico → Bimetálico (coupling B≠0 real con E1/E2) |
| `54ef36fb` | feat: hiddenIf — solo muestra params del preset activo |
| `808948e0` | feat: s2kExporter extendido con types `S2kLayeredSection` y `S2kLayer` |
| `ab39ad35` | benchmark: validar Iso vs SAP Plate-Thick (Hekatan +3%) |
| `8a48ca5a` | docs: documentar bug SAP2000 SetShellLayer_1 OAPI (PowerShell) |
| `d6310b48` | benchmark: Python OAPI SAP2000 SÍ funciona — comparación bimetal |
| `559ea089` | benchmark: conclusión Hekatan OK, ratios coinciden 0.7% |
| `c18772cc` | feat: selector `stressMode` plane-stress/plane-strain (cierra de 30%→5% diff) |
| `c8061e3c` | feat(winkler): displayScale escala springs en zapata-viga-amarre y zapata-aislada-validacion |
| `47efa481` | fix(zapata-val): pressure colormap en kN/m² (no tonf/m²) |
| `7109efb2` | **fix(units): default tonf y mm** (preferencia cimentaciones) |
| `74fd9bae` | benchmark(safe): script Python OAPI para abrir F2K (parcial — ver bugs) |
| `e7644f84` | fix(zapata-val): coherencia kN/m² interno → tonf/m² display |
| `fc4bd7ba` | fix(zapata-val): **labels reactivos a forceUnit** (tonf/kN/kip) |
| `bd1267e2` | docs: prompt continuación v2 |
| `fbf948ea` | wip(safe): SetRunCaseFlag + Save FDB |
| `75a8dcbc` | fix(zapata): slider ks en tonf/m³ con rango Bowles |
| `bb024bbf` | fix(zapata): ks default = 2000 tonf/m³ (mínimo realista) |

## 🎯 Hallazgos técnicos clave

### 1. Layered shell vs SAP — formulación constitutiva
SAP2000 Shell-Layered (Type=6) usa **plane-strain** (σ_zz≠0, ε_zz=0), NO plane-stress
clásico de Mindlin. Para ν=0.3 → ~22% más rigidez.

| Caso | Hekatan plane-stress | Hekatan plane-strain | SAP Type=6 |
|---|---|---|---|
| iso w_max | 0.153 mm | 0.124 mm | 0.118 mm |
| bimetal w_max | 0.222 mm | 0.180 mm | 0.172 mm |
| **ratio bimetal/iso** | **1.45×** | **1.45×** | **1.46×** |
| M_max | 7.85 | 8.55 | 7.72 |

**Los ratios coinciden al 0.7%** → coupling B≠0 idéntico al de SAP. Offset constante
+5% en plane-strain mode probablemente del Hughes strain-projection (Q9 quadratic
in-plane displacements) que SAP usa, distinto del Q4 standard de Hekatan.

### 2. Bug SAP `SetShellLayer_1` (PowerShell vs Python)
- PowerShell COM: `SetShellLayer_1` se ignora silenciosamente, ret=1 pero la
  sección queda como Shell-Thick base. Detectado vía `.s2k` text dump.
- Python comtypes: usar `SetShellLayer` (sin `_1`, **9 args**, no 12). Funciona.

### 3. Bug SAFE F2K Import vía OAPI
- `OpenFile()` ret=0 ✓ (importa)
- Save `.FDB` → SAFE descarta la mayoría de tablas (solo conserva LOAD CASE)
- `RunAnalysis` ret=1, sin resultados
- **Workaround**: abrir `.f2k` manualmente en SAFE GUI, save `.FDB`, después usar OAPI

### 4. Bug pressure tonf/m² vs kN/m² en zapata-aislada-validacion
La función `computePressure` dividía por `TONF_TO_KN` (9.81) almacenando en tonf/m²
internamente, pero el colormap legend asumía kN/m². Fix: storage en kN/m² SI base,
display convierte al unit elegido.

### 5. Labels reactivos a forceUnit
Antes los labels Tweakpane decían "kN/m³", "kN·m" hardcoded incluso con
forceUnit=tonf. Fix: `get label() { return ... }` en `inlineComputed` + key
templates en `computedLabels` con `[\`ks (${u}/m³)\`]`.

### 6. Slider ks en tonf/m³
Antes default 1030 kN/m³ (fijo). Ahora 2000 tonf/m³ (mínimo realista Bowles)
con rango 2000-200000 step 100. Internamente se convierte ks_tonf × 9.81 → kN/m³.

## 📋 Lo que FALTA (próxima sesión)

### Prioridad ALTA

1. **SAFE F2K format debugging** — investigar por qué SAFE descarta tablas al
   `Save(.FDB)`. Comparar nuestro F2K con uno generado por SAFE GUI manualmente.
   Posible solución: agregar tabla `ANALYSIS OPTIONS` o secuencia de import diferente.

2. **Cerrar último 5% Hekatan vs SAP layered** — implementar Hughes strain-projection
   (Q9 quadratic in-plane displacements) en `layeredQ4.ts`. Reference: Hughes (2000),
   Bathe & Dvorkin (1985). Estimado 2-3h.

3. **Tweakpane "Guía de pasos"** — folder con instrucciones paso a paso para
   cada ejemplo (zapata, layered, etc.). UI con `addBlade({view:'separator'})`
   o html injectado.

4. **Viga de amarre con k Winkler distribuido** — actualmente la viga es frame
   con supports puntuales. Modelo correcto: `k` continuo lineal en línea +
   soportes en extremos que simulen "corte" de viga continua. Discretizar con
   `springsList` por nodo a lo largo de la viga.

5. **Selector lados con viga de amarre** — checkbox 1/2/3/4 lados (N/S/E/W) en
   zapata-aislada para elegir cuántas vigas de amarre y de qué lado.

6. **Match Hekatan Iso preset vs SAP Plate-Thick** — actualmente diff +3%.
   Investigar shear correction.

### Prioridad MEDIA

7. **S2K exporter completo con layered shells** — el commit `808948e0` agregó
   types `S2kLayeredSection` y `S2kLayer` pero falta:
   - Bloque MATERIAL PROPERTIES con materiales por capa
   - Tabla AREA LOADS - UNIFORM
   - Layered en s2kParser para round-trip

8. **Botón "📤 Exportar S2K" en TODOS los ejemplos** — actualmente solo
   tablero-puente. Generalizar al workspace.

9. **Selector AreaSpring vs JointSpring al exportar cimentación** — para que
   SAFE muestre `pressure` (necesita AreaSpring) o `reaction` puntual
   (JointSpring).

10. **Aplicar reactive labels a otros ejemplos** — el patrón
    `get label() { return \`ks (${forceUnit.val}/m³)\` }` solo está en
    zapata-aislada-validacion. Generalizar a:
    - zapata-aislada (la simple sin "validacion")
    - zapata-viga-amarre
    - viga-medio-elastico
    - edificio-aporticado (cimentación)
    - todos los demás con sliders en kN/...

### Prioridad BAJA

11. **GoatCounter 400 error** — el script de analytics da 400 en consola.
    Configurar correctamente en goatcounter.com/signup o quitar del index.html.

12. **Optimizar cache CDN gh-pages** — agregar `--no-history` al deploy o cache
    busting headers para que cambios sean visibles inmediatamente.

13. **Pendientes anteriores** (de PROMPT_CONTINUACION.md):
    - Bug membrana-csi frame-shell coupling (3.3× rigidez extra)
    - Migrar layeredQ4 a C++/WASM (solo si performance importa)
    - Modal en plateQ4Solve

## 🛠 Setup en otra computadora

```powershell
# 1. Clonar
mkdir "C:\Hekatan"
cd "C:\Hekatan"
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal
git checkout main
git pull

# 2. Deps
npm install
cd hekatan-fem && npm install && cd ..
cd examples && npm install && cd ..

# 3. Dev server (localhost:4600)
npm run dev:examples

# 4. Build producción + deploy
MSYS_NO_PATHCONV=1 DEPLOY_BASE=/hekatan-struct-lineal/ npm run build -w examples

# 5. Deploy gh-pages
GIT_AUTHOR_NAME="..." GIT_AUTHOR_EMAIL="..." \
  npx gh-pages --dist website/src/examples \
    --repo https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git \
    --branch gh-pages --dotfiles \
    --message "deploy: ..."
```

## ⚠ Gotchas que aparecieron en esta sesión

1. **localStorage persiste forceUnit** — al cambiar default tonf, usuarios
   anteriores siguen viendo kN. Fix: `localStorage.clear()` en F12 o cambio
   manual en folder Unidades.

2. **CDN GitHub Pages tarda 1-2 min** en propagar deploys nuevos. Usar Ctrl+F5
   y esperar.

3. **gh-pages deploy puede fallar por archivos >100MB** — borrar
   `cimentacion_real.f2k` y `riochico_test.f2k` del directorio
   `website/src/examples/` antes del deploy. Ya está como hábito en el
   workflow pero hay que recordarlo.

4. **EBUSY en build Windows** — si node se queda colgado, `taskkill /F /IM
   node.exe` antes de rebuild. Si persiste, borrar directorio `assets/` antes.

5. **Bundle hashes inconsistentes** — si el `index.html` referencia hashes que
   no existen en `assets/`, la build se cortó a medias. Hacer build limpio
   borrando `assets/` primero.

6. **Inline computed labels NO son reactivos por sí solos** — el workspace lee
   `ic.label` UNA vez al registrar. Para hacer reactivo: `get label() { ... }`
   getter + `buildParamsPane()` se llama al cambiar forceUnit (ya está OK
   porque línea 2046 de workspace/main.ts).

7. **Tweakpane sliders min/max no se reescalan dinámicamente** — para cambiar
   rango al cambiar unidad, necesitamos reconstruir el binding. Por eso ks
   se mantiene en una unidad fija (tonf/m³) en lugar de reescalarse.

## 📂 Archivos clave de la sesión

```
hekatan-struct-lineal/
├── PROMPT_CONTINUACION_v3.md                       ← este archivo (NUEVO)
├── PROMPT_CONTINUACION_v2.md                       ← versión anterior (sesión)
├── PROMPT_CONTINUACION.md                          ← versión inicial (multi-PC)
├── BENCHMARK_GUIDE.md                              ← guía CSI 3 productos
│
├── examples/src/
│   ├── layered-shell/                              ← NUEVO ejemplo workspace
│   │   ├── layeredShell.ts                         (presets + stressMode + hiddenIf)
│   │   ├── main.ts, index.html
│   ├── workspace/
│   │   ├── units.ts                                ← default tonf/mm
│   │   ├── main.ts                                 ← applyHiddenBindings impl
│   │   └── exampleRegistry.ts                      ← registra layered-shell
│   ├── zapata-aislada-validacion/
│   │   └── zapataAisladaValidacion.ts              ← labels reactivos forceUnit
│   ├── zapata-viga-amarre/
│   │   └── zapataVigaAmarre.ts                     ← Winkler springs displayScale
│   └── shared/s2kExporter.ts                       ← types layered (incompleto)
│
├── hekatan-fem/src/
│   ├── layeredShell.ts                             ← StressMode plane-stress/strain
│   ├── layeredQ4.ts                                ← input.stressMode opcional
│   ├── deformCpp.ts                                ← wrapper WASM (alias deform)
│   ├── cpp/built/deform.{wasm,mjs,d.ts}            ← solver C++ compilado
│   └── index.ts                                    ← export StressMode
│
└── Benchmark_Placa/
    ├── REPORTE_LAYERED_VS_SAP.md                   ← validación final
    ├── REPORTE_LAYERED_SHELL.md                    ← reporte preliminar
    ├── benchmark_layered_iso_compare.mjs           ← Hekatan iso vs SAP
    ├── benchmark_bimetal_compare.mjs               ← Hekatan vs SAP layered
    ├── benchmark_bimetal_python.py                 ← SAP layered Python OAPI ✓
    ├── benchmark_layered_sanity.py                 ← SAP 2 layers idénticas
    ├── safe_extract_zapata.py                      ← SAFE OAPI (PARCIAL — bug F2K)
    ├── test_3d_q.mjs                               ← tester plane-stress vs plane-strain
    └── Zapata_Hekatan.f2k                          ← F2K para SAFE
```

## 🚀 Cómo arrancar la próxima sesión

> Continuo Hekatan-struct, branch `main`,
> último commit `bb024bbf`. Estado completo en `PROMPT_CONTINUACION_v3.md`.
> Deploy live: https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/
>
> Pendientes priorizados:
> 1. Debug SAFE F2K (RunAnalysis ret=1, descarta tablas al Save)
> 2. Hughes strain-projection en layeredQ4 (cerrar último 5% vs SAP)
> 3. Tweakpane "Guía de pasos" por ejemplo
> 4. Viga de amarre k Winkler distribuido + selector de lados
> 5. Match Hekatan Iso vs SAP Plate-Thick (3% residual)
> 6. S2K exporter layered completo (materiales por capa + área loads)
> 7. Replicar reactive labels a otros ejemplos zapata
>
> Empezamos por el item #1 (debug SAFE F2K) — comparar nuestro F2K con uno
> generado manualmente por SAFE GUI.
