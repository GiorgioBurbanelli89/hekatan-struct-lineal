# Prompt de continuación — sesión 2026-05-01

Sesión enfocada en: validación layered shell vs SAP2000, fix unidades
tonf/kN, Winkler springs scaling, S2K format, comparación SAFE.

## ✅ Completado y commiteado

| Commit | Descripción |
|---|---|
| `38f76363` | feat(layered-shell): nuevo ejemplo workspace usando layeredQ4Solve (CLT/ABBD) |
| `3df584eb` | fix(layered-shell): preset Asimétrico → Bimetálico (coupling B≠0 real) |
| `54ef36fb` | feat(workspace+layered-shell): hiddenIf params + per-preset visibility |
| `559ea089` | benchmark(layered): conclusión Hekatan OK, SAP es inconsistente entre tipos |
| `c18772cc` | feat(layered): selector stressMode plane-stress/plane-strain (matchea SAP Type=6 al 5%) |
| `c8061e3c` | feat(winkler springs): displayScale escala SPRING_WIDTH y ANCHOR_SIZE en zapata-viga-amarre y zapata-aislada-validacion |
| `47efa481` | fix(zapata-validacion): pressure colormap en kN/m² (no tonf/m²) |
| `7109efb2` | fix(units): default tonf y mm (preferencia para cimentaciones) |
| `74fd9bae` | benchmark(safe): script Python OAPI para abrir F2K + extract zapata (parcial) |
| `e7644f84` | fix(zapata-validacion): coherencia kN/m² interno → tonf/m² display |
| `fc4bd7ba` | fix(zapata-validacion): labels reactivos a forceUnit (tonf/kN/kip) |

## 🌐 Deploy LIVE

**https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/**

Ya tiene todos los fixes. Probá:
- `?t=zapata-aislada-validacion` — labels en tonf/m², σ_max=10.6, σ/q_adm=1.06 ⚠
- `?t=layered-shell` — selector preset Iso/CLT3/CLT5/Sandwich/Bimetálico + selector
  Plane-stress/Plane-strain
- `?t=cli-modeler` — textarea editable, live update, ejemplos inline/bloque

## 🎯 Hallazgos clave

### 1. Layered shell vs SAP — FORMULACIÓN
SAP Shell-Layered (Type=6) usa **plane-strain** (3D-like Q matrix), NO plane-stress
(teoría placa clásica Mindlin). Diferencia ~22% en rigidez para ν=0.3.

| Caso | Hekatan plane-stress | Hekatan plane-strain (SAP-like) | SAP Type=6 | Diff |
|---|---|---|---|---|
| iso w | 0.153 | 0.124 | 0.118 | +5.3% |
| bimetal w | 0.222 | 0.180 | 0.172 | +4.7% |
| ratio bimetal/iso | 1.45× | 1.45× | 1.46× | 0.7% |
| M_max | 7.85 | 8.55 | 7.72 | varía |

Los **ratios coinciden al 0.7%** → coupling membrane-bending B≠0 IDÉNTICO al de
SAP. El offset constante 5% vendría del **Hughes strain-projection** que SAP usa
para Q4 layered (in-plane displacements quadratic), distinto del Q4 Q4 standard
de Hekatan. Implementarlo es trabajo adicional (~3h).

### 2. Bug pressure tonf/kN/m²
`zapata-aislada-validacion` almacenaba pressure en tonf/m² internamente con label
`[kN/m²]`. Fix: almacenar en kN/m² SI base, el colormap legend convierte al unit
elegido. Ahora σ_max=10.6 tonf/m² (correcto, antes mostraba 104).

### 3. SAP2000 SetShellLayer_1 OAPI bug
Vía PowerShell COM, `SetShellLayer_1` se ignora silenciosamente. Vía Python
comtypes, usar `SetShellLayer` (sin `_1`, 9 args, no 12). El `.s2k` text dump
confirma cuál se aplicó.

### 4. SAFE F2K OAPI bug
Hekatan exporta F2K que SAFE acepta con `OpenFile()` ret=0, pero al hacer
`Save(.FDB)` SAFE descarta la mayoría de tablas (solo conserva LOAD CASE
DEFINITIONS). RunAnalysis ret=1 sin resultados. Workaround: abrir el .f2k
en SAFE GUI manualmente, save .FDB, después usar OAPI para correr.

## 📋 Lo que FALTA (próxima sesión)

### Prioridad ALTA

1. **SAFE F2K format debugging** — investigar por qué SAFE descarta tablas al
   hacer Save. Comparar con un F2K generado por SAFE GUI manualmente.
   - Workaround: abrir GUI manualmente, usar el .FDB que produce SAFE
   - Idea: agregar `TABLE: "ANALYSIS OPTIONS"` o tablas de inicialización que
     faltan en nuestro export.

2. **Cerrar el último 5% Hekatan vs SAP layered** — implementar Hughes
   strain-projection ("in-plane displacements quadratic") en `layeredQ4.ts`.
   Reference: Bathe & Dvorkin 1985 (MITC4), Hughes 2000.

3. **Tweakpane "Guía de pasos"** — folder con instrucciones numeradas por
   ejemplo (zapata, layered, etc.). UI simple con `addBlade({view:'separator'})`
   o markdown rendered.

4. **Viga de amarre con k lineal Winkler distribuido** — actualmente la viga es
   frame con supports puntuales. Modelo correcto: k continuo en línea + soportes
   en extremos que simulen "corte" de viga continua (k linealmente).
   Discretizar con `springsList` por nodo a lo largo de la viga.

5. **Selector de lados con viga de amarre en zapata** — checkbox 4 lados (N/S/E/W)
   en zapata-aislada para elegir cuántas vigas de amarre y de qué lado.

### Prioridad MEDIA

6. **S2K exporter completo con layered shells** — el commit `808948e0` agregó
   types `S2kLayeredSection` y `S2kLayer` pero el bloque MATERIAL PROPERTIES
   y AREA LOADS - UNIFORM están incompletos. Terminar para que Hekatan exporte
   .s2k que SAP2000 importe directo.

7. **S2K importer** — leer .s2k con SHELL LAYERED PROPERTIES y construir el
   modelo en Hekatan.

8. **Botón "📤 Exportar S2K" en TODOS los ejemplos** — actualmente solo
   tablero-puente lo tiene. Generalizar al workspace.

9. **Selector AreaSpring vs JointSpring al exportar cimentación** — para que
   SAFE muestre `pressure` (necesita AreaSpring) o reacciones nodales
   (JointSpring). Actualmente Hekatan exporta AreaSpring.

10. **Match Hekatan Iso preset vs SAP Plate-Thick** — actualmente diff +3%.
    Investigar si es shear correction o algo más (ya identificado plane-strain
    cierra layered, pero iso usa plane-stress por default).

### Prioridad BAJA

11. **Pendientes de continuación anterior** (PROMPT_CONTINUACION.md):
    - bug membrana-csi frame-shell coupling (3.3× rigidez)
    - layeredQ4 a C++/WASM (solo si performance importa)
    - Modal en plateQ4Solve

## 🛠 Setup en otra computadora

```powershell
# Clonar
mkdir "C:\Hekatan"
cd "C:\Hekatan"
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal
git checkout main

# Deps
npm install
cd hekatan-fem && npm install && cd ..
cd examples && npm install && cd ..

# Dev server (localhost:4600)
npm run dev:examples
```

## 📂 Archivos clave de esta sesión

```
hekatan-struct-lineal/
├── PROMPT_CONTINUACION_v2.md                       ← este archivo
├── examples/src/
│   ├── layered-shell/                              ← NUEVO ejemplo workspace
│   │   ├── layeredShell.ts (presets + stressMode selector)
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
│   └── index.ts                                    ← export StressMode
│
└── Benchmark_Placa/
    ├── REPORTE_LAYERED_VS_SAP.md                   ← conclusion validacion
    ├── benchmark_layered_iso_compare.mjs           ← Hekatan iso vs SAP
    ├── benchmark_bimetal_compare.mjs               ← Hekatan vs SAP layered
    ├── benchmark_bimetal_python.py                 ← SAP layered Python OAPI
    ├── benchmark_layered_sanity.py                 ← SAP 2 layers idénticas (sanity)
    ├── safe_extract_zapata.py                      ← SAFE OAPI (PARCIAL — bug F2K)
    ├── test_3d_q.mjs                               ← tester plane-stress vs plane-strain
    └── Zapata_Hekatan.f2k                          ← F2K exportado para SAFE
```

## 🎯 Cómo arrancar la próxima sesión

> Sigo el trabajo de validación FEM Hekatan-struct vs SAP2000/SAFE.
> Estado en `PROMPT_CONTINUACION_v2.md`. Último commit: `fc4bd7ba`.
> Deploy live: https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/
>
> Próximas acciones por prioridad:
> 1. Debug F2K SAFE para que RunAnalysis funcione (solo conserva LOAD CASE)
> 2. Hughes strain-projection en layeredQ4 (cerrar último 5% vs SAP)
> 3. Tweakpane "Guía de pasos" por ejemplo
> 4. Viga de amarre con k Winkler distribuido en línea
> 5. S2K exporter layered completo
>
> Empezamos por la acción #1 (SAFE F2K).
