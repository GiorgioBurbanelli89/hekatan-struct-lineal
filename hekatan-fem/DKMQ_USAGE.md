# DKMQ Katili — Formulación shell Q4 enriquecida para match SAP/PyNite

> Implementada en `src/cpp/utils/shellQ4_DKMQ.cpp` (WASM C++) y `src/utils/shellQ4_DKMQ.ts` (TS puro).
> Activable por elemento via `elementInputs.plateFormulations[idx] = 2`.

## Cuándo usar DKMQ

Si tu modelo combina **shells + frames** (vigas o columnas) y querés que Hekatan
reporte resultados similares a SAP2000/PyNite (~5% diff), activá DKMQ en los shells.

| Formulación | `plateFormulations[idx]` | w_max plate-with-beams |
|---|---|---|
| Mindlin Hughes-Brezzi (default) | `0` o no set | −1.98 mm (−37% vs SAP) |
| Kirchhoff MZC Shell-Thin | `1` | (para placas muy delgadas) |
| **DKMQ Katili** | **`2`** | **−2.96 mm (−5.5% vs SAP)** ✅ |

## Cómo activar DKMQ en un ejemplo

```typescript
import { deform, analyze, type Node } from "hekatan-fem";

// 1) Declarar el Map
const plateFormulations = new Map<number, number>();

// 2) En el loop de shells, setear 2
for (let i = 0; i < nShells; i++) {
  thicknesses.set(i, t);
  elasticities.set(i, E);
  poissons.set(i, nu);
  plateFormulations.set(i, 2);   // DKMQ Katili
}

// 3) Pasar plateFormulations al elementInputs
states.elementInputs.val = {
  thicknesses, elasticities, poissonsRatios: poissons,
  // ... otros campos
  plateFormulations,
};
```

## Match cross-solver validado (benchmark plate-with-beams 6×4×0.1m + vigas 0.30×0.50)

| Solver | w_max [mm] |
|---|---|
| SAP Plate-Thin (referencia comercial) | −3.13 |
| **Hekatan WASM DKMQ Katili** | **−2.958** (−5.5% vs SAP) ✅ |
| PyNite DKMQ (referencia open-source) | −2.92 (+1.3% vs Hekatan) 🎯 |
| OpenSees ShellMITC4 | −2.56 |
| Awatif MITC3 (mesh fino) | −2.55 |

Hekatan DKMQ está alineado con SAP **mucho mejor** que con la formulación default
(Hughes-Brezzi Q4) que daba w = −1.98 mm.

## Ejemplos que ya usan DKMQ

- `examples/src/plate-with-beams/plateWithBeams.ts`
- `examples/src/slab-beams-columns/slabBeamsColumns.ts`

## Para activar en TUS ejemplos existentes

Buscá el bloque donde haces `thicknesses.set(i, t)` y agregá:
```typescript
plateFormulations.set(i, 2);
```
Y agregá `plateFormulations` al `states.elementInputs.val`.

Si NO tenés `plateFormulations` declarado, primero declaralo:
```typescript
const plateFormulations = new Map<number, number>();
```

## Implementación

- **TS puro**: `src/utils/shellQ4_DKMQ.ts` (~290 líneas)
- **C++ Eigen**: `src/cpp/utils/shellQ4_DKMQ.cpp` (~260 líneas)
- **WASM**: compilado dentro de `src/cpp/built/deform.wasm` (rebuild con `npm run build`)
- **Dispatcher**: `src/cpp/utils/getLocalStiffnessMatrix.cpp` línea ~137

## Referencias

- Katili, I. (1993). "A new discrete Kirchhoff-Mindlin element based on Mindlin-Reissner plate theory and assumed shear strain fields - part I: An extended DKT element for thick-plate bending analysis"
- Katili, Batoz, Maknun, Hamdouni (2015). "The development of DKMQ plate bending element for thick to thin shell analysis based on the Naghdi/Reissner/Mindlin shell theory"
- PyNite source: `Pynite/Quad3D.py` (referencia del porteo)
