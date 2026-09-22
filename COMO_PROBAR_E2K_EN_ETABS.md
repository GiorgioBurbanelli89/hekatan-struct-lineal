# Cómo probar el e2k de Hekatan Struct en ETABS

## ⚠️ El error de "no puede / directorio" — la causa #1
ETABS **falla al abrir un e2k si la ruta tiene ESPACIOS, TILDES o está en OneDrive**.
Tu carpeta `Hekatan Calc 1.0.0` y `Documentos` tienen espacios/sincronización → ETABS no
puede crear la carpeta del modelo y dice que no encuentra el directorio.

### ✅ Fix (hazlo SIEMPRE)
Copia el `.e2k` a una **ruta corta, en disco local, sin espacios ni tildes**:
```
C:\ETABS\modelo.e2k      ✔ (recomendado)
C:\Temp\modelo.e2k       ✔
```
NO uses:
```
C:\Users\...\Documentos\Hekatan Calc 1.0.0\...\modelo.e2k   �’ (espacios + OneDrive)
C:\Users\...\Downloads\modelo (1).e2k                       ✗ (paréntesis/espacios)
```
> Crea la carpeta una vez: en el Explorador, ve a `C:\`, clic derecho → Nueva carpeta → `ETABS`.

---

## Opción A — por la INTERFAZ de ETABS (lo más simple)
1. En **Hekatan Struct** (la web) abre el modelo (ej. `test-m-dual`) y pulsa **Exportar e2k**
   → se descarga `modelo.e2k`.
2. **MUEVE** el archivo a `C:\ETABS\modelo.e2k` (ruta corta, ver arriba).
3. Abre **ETABS**.
4. Menú **File → Import → ETABS .e2k Text File…**
5. Selecciona `C:\ETABS\modelo.e2k`.
6. ETABS arma el modelo. **File → Save As… → `C:\ETABS\modelo.edb`** (guárdalo en la misma carpeta corta).
7. Corre el análisis: **Analyze → Run Analysis**.

---

## Opción B — por CÓDIGO (Python API, lo que usamos para validar)
Requiere ETABS instalado + `comtypes` (`pip install comtypes`).
```python
import comtypes.client as cc, comtypes
# adjuntarse a un ETABS ya ABIERTO (instantáneo):
h = cc.CreateObject('ETABSv1.Helper').QueryInterface(comtypes.gen.ETABSv1.cHelper)
obj = h.GetObject("CSI.ETABS.API.ETABSObject")
sm = obj.SapModel

# --- IMPORTAR un e2k (RUTA ABSOLUTA y corta) ---
sm.File.OpenFile(r"C:\ETABS\modelo.e2k")     # OpenFile EXIGE ruta absoluta

# --- correr ---
sm.Analyze.RunAnalysis()

# --- EXPORTAR de vuelta a e2k ---
sm.File.Save(r"C:\ETABS\modelo.edb")          # 1) guardar .edb PRIMERO (obligatorio)
sm.File.ExportFile(r"C:\ETABS\modelo.e2k", 1) # 2) exportar texto (1 = e2k)
```
Reglas (descubiertas por ingeniería inversa):
- `OpenFile(...)` necesita **ruta absoluta**; relativa o con caracteres raros → "no encuentra directorio".
- `ExportFile(...)` **exige** `Save(edb)` ANTES.
- `GetObject("CSI.ETABS.API.ETABSObject")` se adjunta al ETABS abierto al instante (no relanza).

---

## Verificar que el modelo entró bien
Tras importar, revisa que estén:
- **POINTS** (nudos) y **LINES** (columnas/vigas), **AREAS** (losa/muro).
- **Restricciones** en la base (empotramientos).
- **Secciones** (columnas, vigas) y **materiales** (E, ν, ρ).
- **Diafragma**: por defecto las losas entran como "None" (el shell aporta su rigidez real).

### Limitaciones conocidas del e2k (no es bug de Hekatan)
- **Losa nervada/waffle**: el e2k de ETABS las guarda como "Slab" con solo el espesor de la
  loseta, salvo que el slab se cree en ETABS con `SlabType = 3` (Ribbed) / `4` (Waffle).
- **Deck**: sí se preserva completo (DECKSLABDEPTH, DECKRIBDEPTH, …).

---

## Resumen en 3 pasos
1. Exporta el e2k desde Hekatan.
2. **Cópialo a `C:\ETABS\`** (ruta corta, sin espacios/tildes).  ← esto arregla el error de directorio.
3. ETABS → File → Import → ETABS .e2k Text File → selecciónalo → Save As .edb → Run.
