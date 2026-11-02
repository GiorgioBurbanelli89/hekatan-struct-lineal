# Validación SAFE 20 — Libro Guerra MDI

Scripts Python que se conectan a **SAFE 20** vía API (`SAFEv1.dll` + `pythonnet`),
arman el modelo del ejercicio desde cero, corren análisis, leen tablas y dumpean
un JSON que después consume el ejemplo equivalente en `hekatan-struct/examples/src/`.

> Ing. Marcelo Guerra Avendaño MDI — *Cimentaciones Sismo Resistentes utilizando SAFE*, 1ª ed. 2013

## Estructura

```
safe-api/
├── ej1_zapata_cuadrada.py        ★ standalone self-contained (recomendado)
├── results/
│   └── ej1_zapata_cuadrada.json
├── Python/
│   ├── Ejemplo Guia.py            (referencia CSI: NewSteelDeck template)
│   └── guerra-libro/              versión modular (depende de _common.py)
│       ├── _common.py             helpers connect_safe / get_table / dump_results_json
│       ├── ej1_zapata_cuadrada.py
│       ├── results/
│       └── README.md
└── README.md                      (este archivo)
```

## Requisitos

- **SAFE 20** instalado (`C:\Program Files\Computers and Structures\SAFE 20\SAFEv1.dll`)
- Python 3.10+ con `pythonnet`:
  ```
  pip install pythonnet
  ```
- RAM: SAFE 20 consume ~1-2 GB durante el análisis.

## Uso

```powershell
cd "C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Api CSI Computers\safe-api"
python ej1_zapata_cuadrada.py
```

Sale: `results/ej1_zapata_cuadrada.json` con los valores SAFE; copiarlos al bloque
`safe_api_live` de `examples/src/guerra-ej1-zapata-cuadrada/safe-reference.json`.

## Ej.1 — Zapata Aislada Cuadrada (Guerra pag. 17-42)

**Inputs:** B=L=3.45 m, h=0.45 m, columna 0.45×0.45 m, f'c=280 kg/cm², ks=2920 t/m³,
Dead (P=91 t, M=12 t·m), Live (P=30 t, M=5 t·m), combo servicio = 1.0D + 1.0L.

### Resultados confirmados

| Caso | σ_max (t/m²) | σ_min (t/m²) | Uz centro (mm) |
|---|---|---|---|
| **SAFE-API con self-weight** (default) | **12.94** | **8.20** | -4.39 |
| SAFE-API sin self-weight (`SelfWtMult=0`) | 11.86 | 7.12 | -4.00 |
| **Δ por peso propio = h·γ_c = 0.45×2.4** | **+1.08** | +1.08 | +0.39 |
| Libro p.36 (SAFE manual) | 13.163 | — | — |
| Libro p.19 (formula P/A ± Mc/I + W_self) | 13.94 | 8.28 | — |

**Observación clave (validada experimentalmente):** la diferencia inicial de ~1 t/m²
entre Hekatan-struct y SAFE era el peso propio de la zapata, que SAFE incluye por
default (`SelfWtMult=1` en el load pattern `Dead`) y Hekatan-struct no consideraba.
Ver `guerraEj1.ts`: ahora distribuye un load nodal = `h·γ_c·A_trib` en cada nodo para
matchear SAFE default.

### Detalle técnico del script

Construcción del modelo via API:

1. `File.NewBlank()` + `SetPresentUnits_2(tonf, m, C)`.
2. `PropMaterial.SetMaterial("Conc280", Concrete)` + `SetMPIsotropic(E,ν,α)` +
   `SetWeightAndMass(weight=γ_c)` + `SetOConcrete(f'c)`.
3. `PropArea.SetSlab("MAT45", Mat, ShellThin, h=0.45)`.
4. `AreaObj.AddByCoord(4 puntos del rectangulo, "FOOT", "MAT45")`.
5. `PropAreaSpring.SetAreaSpringProp("SOIL_KS", U1=0, U2=0, U3=ks)` + asignación.
6. `PointObj.AddCartesian(B/2, B/2, 0, "COL_CTR")` para el punto de la columna.
7. `LoadPatterns.Add("Dead", Dead, SelfWtMult)` + **`SetSelfWTMultiplier()` para forzarlo** (Add
   no sobreescribe el Dead default que SAFE crea automaticamente).
8. `PointObj.SetLoadForce` con [Fx, Fy, Fz, Mx, My, Mz].
9. `RespCombo.Add` + `SetCaseList` para CARGA VERTICAL (1D+1L) y CARGA ULTIMA (1.4D+1.7L).
10. `File.Save` + `Analyze.RunAnalysis()`.
11. `DatabaseTables.GetTableForDisplayArray("Soil Pressures")` + `"Joint Displacements"`.

### Convención de signos SAFE

SAFE devuelve presión de suelo NEGATIVA en compresión. El script aplica `abs()`
para reportar magnitudes (convención ingenieril positiva).

## Catálogo planeado (estado de implementación)

| Ej | Tema | Pag. | Estado |
|---|---|---|---|
| 1 | Zapata aislada cuadrada | 17-42 | ✅ self-weight verificado, panel comparativo |
| 2 | Zapata aislada rectangular | 43-58 | ⏳ pendiente |
| 3 | Zapata combinada | 59-72 | ⏳ pendiente |
| 4 | Zapata conectada (viga de amarre) | 73-90 | ⏳ pendiente |
| 5 | Zapata medianera | 91-104 | ⏳ pendiente |
| 7 | Viga de cimentación | 117-138 | ✅ desplegado (módulo separado) |
| 8 | Losa de cimentación (raft) | 139-184 | ⏳ pendiente |
