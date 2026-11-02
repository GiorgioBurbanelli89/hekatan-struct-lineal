# Validación SAFE — Libro Guerra MDI

Scripts Python que se conectan a **SAFE 20** vía API (`SAFEv1.dll`), abren un modelo
`.fdb` armado en SAFE siguiendo los ejercicios del libro

> Ing. Marcelo Guerra Avendaño MDI — *Cimentaciones Sismo Resistentes utilizando SAFE*, 1ª ed. 2013

corren el análisis, leen las tablas de resultados (Soil Pressures, Joint Displacements,
Slab Element Forces) y dumpean un `results/ejN_xxx.json` que después consume el
ejemplo equivalente en `hekatan-struct/examples/src/guerra-ejN-xxx/` (categoría
**📚 Libros · SAFE - Marcelo Guerra**) para mostrar el panel **"Hekatan vs SAFE"**.

## Estructura
```
guerra-libro/
├── _common.py                       # connect_safe(), get_table(), dump_results_json()
├── ej1_zapata_cuadrada.py           # Ejercicio 1 — Zapata aislada cuadrada (pag. 17-42)
├── results/
│   └── ej1_zapata_cuadrada.json     # output, no chequeable a git si pesa
└── README.md
```

## Requisitos
- **SAFE 20** instalado (`C:\Program Files\Computers and Structures\SAFE 20\SAFEv1.dll`)
- Python 3.10+ con `pythonnet`:
  ```
  pip install pythonnet
  ```
- Memoria: SAFE 20 consume ~1-2 GB. Cerrar otras apps pesadas antes.

## Uso (Ej.1, cualquier ejercicio sigue el mismo patrón)
1. Abrir SAFE 20.
2. Armar el modelo del Ej.1 a mano siguiendo el libro (pag. 29-38: dimensions, material, ks, cargas, combinaciones CARGA VERTICAL / CARGA ULTIMA). Guardar como `C:\CSi_SAFE_API_Example\guerra_ej1.fdb`.
3. Cerrar SAFE 20.
4. Correr:
   ```powershell
   cd "C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Api CSI Computers\safe-api\Python\guerra-libro"
   python ej1_zapata_cuadrada.py
   ```
5. Output: `results/ej1_zapata_cuadrada.json`.
6. Copiar ese JSON a `examples/src/guerra-ej1-zapata-cuadrada/safe-reference.json`
   (o setear un symlink en el future) y rebuildear hekatan-struct.

## Modo "BUILD_FROM_API"
En cada script hay un flag `BUILD_FROM_API`. Si es `True`, el script intenta construir
el modelo desde cero via la API SAFE en vez de abrir un `.fdb` pre-armado. Esa ruta
es **experimental** — los nombres exactos de `PropArea.SetSlab`, `AreaObj.AddByCoord`,
etc., pueden variar entre versiones; el código tiene marcadores `TODO` para completar.

## Catálogo planeado (estado de implementación)
| Ej | Tipo                         | Script Python                      | Ejemplo hekatan-struct                |
|----|------------------------------|------------------------------------|---------------------------------------|
| 1  | Zapata aislada cuadrada      | `ej1_zapata_cuadrada.py` ✅        | `guerra-ej1-zapata-cuadrada` ✅       |
| 2  | Zapata rect. + sismo         | _pendiente_                        | _pendiente_                           |
| 3  | Zapata rect. excent. grande  | _pendiente_                        | _pendiente_                           |
| 4  | Zapata combinada rectangular | _pendiente_                        | _pendiente_                           |
| 5  | Zapata combinada trapezoidal | _pendiente_                        | _pendiente_                           |
| 7  | Viga de cimentación          | _pendiente_                        | `viga-cim-guerra-ej7` ✅ (legacy)     |
| 7b | Viga T invertida             | _pendiente_                        | `viga-cim-guerra-ej7-tinv` ✅ (legacy)|
| 8  | Losa de cimentación          | _pendiente_                        | _pendiente_                           |
