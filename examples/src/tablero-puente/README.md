# Tablero de Puente — Test Solar (Hekatan ↔ SAP2000)

Validación cruzada del problema de **vinculación viga frame ↔ losa shell** que reportó el usuario: esfuerzos de viga muy distintos entre Hekatan-Struct (su programa propio con MITC4+) y SAP2000.

## Modelo

- Tablero recto de **15 m × 6 m**, espesor losa 0.20 m (concreto f'c=24 MPa)
- **3 vigas longitudinales doble-T metálicas** (acero A36, perfil ~W21x44):
  - bf = 0.20 m, tf = 0.015 m, hw = 0.55 m, tw = 0.010 m
- Apoyos: **pin-roller** en cada extremo de viga (tablero simplemente apoyado)
- Carga: q = 15 kN/m² distribuida en losa (≈ HL-93 lane × ancho efectivo)

## 3 modos de vinculación viga–losa

| Modo | Descripción | Sección viga frame | Offset |
|---|---|---|---|
| **0 — Naive** | Doble-T completa con eje al plano medio del shell | `bf × tf` (ambos patines) + alma | Ninguno |
| **1 — Solar** | Solo alma + patín inferior (ala superior viene del shell) | `bf × tf` (1 patín) + alma | Ninguno |
| **2 — Eccentric** | Doble-T completa + Insertion Point Bottom Center | `bf × tf` (ambos patines) + alma | Auto al centroide |

**Recomendación de Gustavo Solar**: Modo 1 (con nodos compartidos) o Modo 2 (con offset). Modo 0 sobre-rigidiza por contar el ala superior dos veces.

## Resultados Hekatan (defaults)

| Modo | A (m²) | Iz (m⁴) | M (kN·m) | V (kN) | δ (mm) | M / (qL²/8) |
|---|---|---|---|---|---|---|
| Naive | 0.01150 | 6.18e-4 | **179.2** | 263.3 | 25.58 | 0.212 |
| Solar | 0.00850 | 2.94e-4 | **167.6** | 273.3 | 31.56 | 0.199 |
| Eccentric | 0.01150 | 2.37e-3 | **336.4** | 233.7 | 15.32 | 0.399 |

Diferencia clave Naive ↔ Eccentric: **M_eccentric / M_naive ≈ 1.88** (la viga toma casi el doble de momento cuando se la deja en su posición real).

## Cómo correr el script **SAP2000** (vía Bridge — usa el server existente del usuario)

Tu SAP2000 corre **elevado** (Administrator), lo que rompe COM directo desde Claude Code (Medium integrity). Por eso ya tenés un **bridge server elevado** construido en:

```
C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0\python api sap 2000 claude\
```

El script `sap2000_test_solar_bridge.py` usa tu `SAP2000Bridge` client + `iniciar_bridge.bat`.

### Pasos

1. **Abrir SAP2000 v24** manualmente.
2. **Click derecho** en `iniciar_bridge.bat` (en la carpeta de arriba) → **"Ejecutar como administrador"**. La consola del bridge mostrará "Servidor listo".
3. **Correr el script** (sin elevar):
```bash
cd "C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\examples\src\tablero-puente"
python sap2000_test_solar_bridge.py
```

El script envía comandos JSON al bridge server elevado, que ejecuta:
- `PropMaterial.SetMaterial` + `SetMPIsotropic` (CONC24, ACERO_A36)
- `PropFrame.SetISection` (sección viga según modo)
- `PropArea.SetSlab` (losa concreto)
- `PointObj.AddCartesian` (252 nodos)
- `AreaObj.AddByPoint` (240 shells losa)
- `FrameObj.AddByPoint` (60 frames vigas)
- `FrameObj.SetInsertionPoint` cardinal=8 Bottom Center (solo modo 2)
- `PointObj.SetRestraint` pin-roller en extremos
- `AreaObj.SetLoadUniform` q=15 kN/m² en losa
- `Analyze.RunAnalysis()`
- `Results.FrameForce` + `Results.JointDispl` (M3, V2, U3 viga central)

Output guardado en `~/Documents/tablero_puente_modeX.sdb`.

### Output esperado

```
======================================================================
  MODO 0: Naive (full T, sin offset)
======================================================================
  M_max  =    179.2 kN.m   ← idem Hekatan
  V_max  =    263.3 kN
  delta  =     25.58 mm

======================================================================
  MODO 1: Solar (alma+patin inf)
======================================================================
  M_max  =    167.6 kN.m
  V_max  =    273.3 kN
  delta  =     31.56 mm

======================================================================
  MODO 2: Eccentric (Insertion Point Bottom)
======================================================================
  M_max  =    336.4 kN.m   ← match con SAP cuando usas Insertion Point
  V_max  =    233.7 kN
  delta  =     15.32 mm
```

Si los resultados de SAP coinciden con Hekatan en ±5%, **el solver Hekatan (MITC4+ shell + frame con offset) está funcionando bien**, y la diferencia que ves vs tu programa propio se debe únicamente al **modo de vinculación** (con o sin offset).

## Diagnóstico de tu problema

Si en tu programa propio:
- **Defines la viga doble-T completa con nodos compartidos al plano medio** → estás en **Modo 0** (Naive). Te dará M más bajo que SAP con Insertion Point.
- Para que coincida con SAP2000 con Insertion Point, tenés 2 opciones:
  1. Implementar **rigid links / joint offset** entre el plano medio del shell y el centroide de la viga (= Modo 2). En SAP esto es un click: "Frame > Insertion Point > Bottom Center".
  2. Si no podés hacer offset, **descontar el ala efectiva** de la sección viga (= Modo 1 Solar). La viga frame solo aporta alma + patín inferior; la losa shell ya aporta el patín superior vía membrane action.

## Referencia

- AASHTO LRFD §4.6.2.6.4 — "T-section with offset"
- ETABS Manual: "Frame > Insertion Point" (cardinal points 1-11)
- Bathe & Dvorkin (1985) — MITC4+ shell formulation
- Solar, Gustavo — recomendación de modelado puentes / pisos compuestos en SAP2000
