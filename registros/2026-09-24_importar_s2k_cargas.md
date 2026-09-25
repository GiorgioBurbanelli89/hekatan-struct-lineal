# 2026-09-24 — Importar S2K no traía las cargas (Cancha Parque.s2k)

Archivo: `Downloads/Cancha Parque.s2k` (SAP2000 v25.3.1, 582 nudos, 1279 barras, 0 áreas).
Cargas: `FRAME LOADS - DISTRIBUTED` con `Dir=Gravity` RelDist 0–1 (CARGA VIVA, VIENTO, SOBRECARGA
PERMANENTE) + peso propio (`SelfWtMult=1` en PESO PROPIO).

## Bitácora
- ❌ Abrir el s2k en SAP2000 por OAPI (`csi_cli.start_engine`): SAP19 se cae al arrancar
  (`Conversions.ToInteger(String)`, IPC cerrado). Dos intentos. Abierto a mano con SAP2000.exe.
- ✅ Causa: el botón **SAP2000 › 📥 Importar S2K** (`workspace/main.ts`) guardaba SOLO nudos y
  polilíneas y abría `new-blank`: tiraba cargas, apoyos y secciones que `parseS2k` ya leía.
  (El de E2K se arregló el 11-sep; el de S2K se quedó con el camino viejo.)
- ✅ `parseS2k` (working tree, cambios de la otra sesión de hoy) SÍ lee las cargas:
  ΣFz = −1352.591 kN = 865.935 (barras, Python a mano) + 486.656 (peso propio, Python a mano). Exacto.
- ✅ Arreglo: Importar S2K manda el modelo ENTERO a `csi-importer` por sessionStorage (igual que E2K);
  tipos COLUMN/BEAM/BRACE deducidos por geometría.
- ✅ `csiImporter.conectarIntersecciones`: en barras PARTIDAS no copia `frameLoads`/`frameFixedEnd`
  a cada trozo (duplicaba el empotramiento). En Cancha Parque se parten 14 barras, ninguna con carga
  aplicada (solo peso propio).
- ✅ Verificado en la app (dev 4600, `cli/_ctl_importar_s2k_cargas.mjs`): t=csi-importer, 582 nudos, 1293 elem,
  14 apoyos, 582 nudos cargados, ΣFz = −1352.591 kN (= a mano), frameFixedEnd 1265 (= 1279 − 14), 0 errores. PNG: flechas.
- ⏳ El arreglo del PARSER (Gravity, peso propio) es de la otra sesión y sigue SIN commit: sin él no hay cargas.
- ⏳ Deploy público (gh-pages) sin actualizar.

## Pasar Cancha Parque.s2k (v25.3.1) a SAP2000 v24 (25-sep-2026)
- ❌ SAP 24.1.0 importa el texto de v25 y ABORTA: aviso oculto «Error getting table name for table key
  Active Degrees of Freedom in modDB > SubMakeDBTable!» + «Error 91 ... Import aborted». Oculto = modelo vacío, sin log.
  Una instancia arrancada por la API quedó rota (el aviso se repetía en bucle): sospecha de la instancia, no del archivo.
- ✅ Diferencia hallada: v25 escribe `CardinalPt="10 (centroid)"` (1279 barras); v24 lo lee como entero
  (el .NET decía Conversions.ToInteger(String)). Conversor: `csi-cli/sap2000-cli/s2k_v25_a_v24.py`
  (Version→24.1.0, CardinalPt→número). Salida: `Downloads/Cancha Parque v24.s2k`.
- ⏳ SIN VERIFICAR en SAP 24: la prueba limpia (control boveda.$2k + convertido) la mató Claude Code por RAM baja.
  Otra sesión (hekatan-calc-1-0-0-da) se enganchó a mi SAP por GetActiveObject a las 00:08: coordinar antes.
