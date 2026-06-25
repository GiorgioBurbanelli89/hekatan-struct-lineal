# Guía práctica — API CSI ETABS desde Python (comtypes)

Esta guía documenta los **patrones que funcionan** y los **bugs / gotchas
de ETABS 19.1** (y previas), descubiertos al extraer resultados del modelo
`Mesa torsión`. Aplica a ETABS 19.1.0 — versiones más nuevas (22+) pueden
tener algunos métodos arreglados.

---

## 1. Conexión a ETABS

### Patrón recomendado: **AttachToInstance** (el user abre ETABS manualmente)

```python
import comtypes.client
obj = comtypes.client.GetActiveObject("CSI.ETABS.API.ETABSObject")
SapModel = obj.SapModel
```

### ❌ NO usar `ApplicationStart()`

```python
# NO RECOMENDADO — pierde licencia SentinelLM (Error #18)
helper = comtypes.client.CreateObject("CSI.ETABS.API.ETABSObject")
helper.ApplicationStart()  # Lanza ETABS pero sin licencia activa
```

### Detectar si ETABS ya está abierto

```bash
tasklist | grep -i etabs
# Buscar ETABS.exe → si aparece, hay instancia activa
```

---

## 2. Apertura de modelos

```python
SM.File.OpenFile(r"C:\path\to\modelo.e2k")   # texto e2k (recomendado para scripting)
SM.File.OpenFile(r"C:\path\to\modelo.EDB")   # binario EDB
```

`OpenFile` retorna `0` si OK.

### 🔑 REGLA DE ORO para scripting API: **abrir .e2k, no .EDB**

```
✅ FUENTE DE VERDAD = .e2k (texto plano, versionable, indestructible)
❌ NUNCA modificar el .EDB del usuario — se corrompe con runs API repetidos
```

El binario EDB es muy frágil: cualquier `RunAnalysis()` desde la API
escribe estado interno (mesh post-auto-mesh, K_J, Y00..Y05, .LOG, .OUT)
que la GUI puede no poder leer la próxima vez ("Error in performing miOpen").

**Patrón seguro y reproducible**:

```python
E2K = "modelo.e2k"                              # source of truth, NO se toca
WORKCOPY = "_workcopy_modelo.EDB"               # archivo generado, descartable

SM.File.OpenFile(E2K)         # parsea el e2k → carga modelo en memoria
SM.File.Save(WORKCOPY)        # serializa a EDB workcopy
SM.SetModelIsLocked(False)
SM.Analyze.RunAnalysis()      # afecta WORKCOPY, e2k intacto

# … extracción de resultados …

# Si algo sale mal: borrar WORKCOPY + aux files (.K_*, .Y*, .LOG, .OUT, .$et,
# .msh, .ico, .ebk) y rehacer desde el e2k. Una línea:
#   ls _workcopy_modelo.* | xargs rm
```

### Save (CSI exige save antes de analyze)

```python
SM.File.Save(r"C:\path\to\_workcopy_modelo.EDB")
```

---

## 3. Inventario del modelo

```python
n_points = SM.PointObj.Count()    # OK
n_frames = SM.FrameObj.Count()    # OK
n_areas  = SM.AreaObj.Count()     # OK

# Post-analyze: contar Line/Point/Area Elements (analytical, post-auto-mesh)
n_line_elm = SM.LineElm.Count()   # OK — Line elements internos generados
n_pt_elm   = SM.PointElm.Count()
n_area_elm = SM.AreaElm.Count()
```

### ⚠️ Gotcha: `GetNameList` crashea en ETABS 19.1 con comtypes

```python
# ❌ CRASH ACCESS VIOLATION:
SM.FrameObj.GetNameList()
SM.Story.GetStories()

# ✅ Workaround: hardcode names del e2k, o iterar por Index si se conoce el rango
frames = ["C1", "C2", "C3", "C4", "B1", "B2", "B3", "B4"]
```

---

## 4. Análisis

### Setup + run completo

```python
# 1. Unlock (CSI bloquea el modelo después de cada analyze)
SM.SetModelIsLocked(False)

# 2. Save (obligatorio antes de RunAnalysis)
SM.File.Save(save_path)

# 3. Marcar qué cases correr
SM.Analyze.SetRunCaseFlag("", False, True)        # Clear all
SM.Analyze.SetRunCaseFlag("Modal", True)          # Activar Modal
SM.Analyze.SetRunCaseFlag("Dead", True)
SM.Analyze.SetRunCaseFlag("Live", True)
SM.Analyze.SetRunCaseFlag("SCP", True)

# 4. Run
SM.Analyze.RunAnalysis()  # Bloquea hasta terminar
```

### Verificar status post-analyze

```python
status = SM.Analyze.GetCaseStatus()
n = status[0]
cases = list(status[1])
states = list(status[2])

# Códigos de state en ETABS 19.1:
state_text = {
    1: "Not run",
    2: "Could not start",
    3: "Not finished (failed)",
    4: "Finished",
}
for c, s in zip(cases, states):
    print(f"{c}: {state_text.get(s, '?')}")
```

---

## 5. Resultados — Setup

**Siempre** ejecutar antes de leer resultados:

```python
SM.Results.Setup.DeselectAllCasesAndCombosForOutput()
SM.Results.Setup.SetCaseSelectedForOutput("Modal")  # case name
# o para combos:
SM.Results.Setup.SetComboSelectedForOutput("UDCon1")
```

---

## 6. Modal — Periodos y MPF

### Periodos

```python
SM.Results.Setup.SetCaseSelectedForOutput("Modal")
ret = SM.Results.ModalPeriod(0, [], [], [], [], [], [], [])
# Signature: (NumberResults, LoadCase, StepType, StepNum, Period, Frequency, CircFreq, EigenValue)
n = ret[0]
periods = list(ret[4])  # [s]
freqs   = list(ret[5])  # [Hz]
```

### Mass Participation Factors

```python
ret = SM.Results.ModalParticipatingMassRatios(
    0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
)
# ret[5]  = UX [-]   (fracción 0-1)
# ret[6]  = UY
# ret[7]  = UZ
# ret[8]  = SumUX (acumulado)
# ret[9]  = SumUY
# ret[10] = SumUZ
# ret[11] = RX
# ret[12] = RY
# ret[13] = RZ
# ret[14] = SumRX
# ret[15] = SumRY
```

---

## 7. Frame Forces (N, V, M, T) — el gotcha grande

### ❌ Lo que NO funciona en ETABS 19.1

```python
# Los Frame OBJECTS (nombres C1, B1, etc. del e2k) NO devuelven resultados
SM.Results.FrameForce("C1", 0)  # retorna NumberResults=0
```

### ✅ Lo que SÍ funciona

Tras `RunAnalysis()`, ETABS hace auto-mesh y los frames originales se
convierten en **LineElements numerados '1', '2', ..., '24'**:

```python
n_line_elm = SM.LineElm.Count()
for i in range(n_line_elm):
    el_name = str(i + 1)
    ret = SM.Results.FrameForce(el_name, 0)
    # Signature: (NumberResults, Obj, ObjSta, Elm, ElmSta, LoadCase, StepType, StepNum,
    #             P, V2, V3, T, M2, M3)
    n = ret[0]
    if n == 0:
        continue
    sta_arr = list(ret[2])   # Object station (m desde el extremo I)
    P_arr   = list(ret[8])   # Axial (tonf, tracción +)
    V2_arr  = list(ret[9])   # Cortante eje local 2 (tonf)
    V3_arr  = list(ret[10])  # Cortante eje local 3 (tonf)
    T_arr   = list(ret[11])  # Torsor M1 (tonf·m)
    M2_arr  = list(ret[12])  # Flexión eje 2 (tonf·m) — eje débil rect
    M3_arr  = list(ret[13])  # Flexión eje 3 (tonf·m) — eje fuerte rect
```

### Mapear LineElement → Frame Object original

```python
line_to_obj = {}
for i in range(n_line_elm):
    name = str(i + 1)
    r = SM.LineElm.GetObj(name)  # devuelve (Obj_name, Index, ret_code)
    line_to_obj[name] = r[0]
```

### Convención CSI ejes locales

| Componente | Significado físico | Para columna vertical | Para viga horizontal |
|---|---|---|---|
| P  | Axial (tracción +)         | Carga vertical | Carga axial |
| V2 | Cortante local 2           | Cortante horiz X (o Y según orient) | Cortante vertical |
| V3 | Cortante local 3           | Cortante perp 2 | Cortante perp |
| T  | M1 = torsor longitudinal   | Torsión col | Torsión viga |
| M2 | Flexión sobre eje local 2 | Flexión plano X-Z (eje débil rect) | Eje débil viga |
| M3 | Flexión sobre eje local 3 | Flexión plano X-Y (eje fuerte rect) | Eje fuerte viga (típico flexión vertical) |

---

## 8. Base Reactions

```python
SM.Results.Setup.SetCaseSelectedForOutput("Dead")
ret = SM.Results.BaseReact()
# Signature: (NumberResults, LoadCase, StepType, StepNum,
#             Fx, Fy, Fz, Mx, My, Mz, gx, gy, gz, ParaX)
n   = ret[0]
Fx  = ret[4][0]   # Reacción global X (tonf)
Fy  = ret[5][0]
Fz  = ret[6][0]   # Para Dead = selfweight
Mx  = ret[7][0]
My  = ret[8][0]
Mz  = ret[9][0]
```

### Joint Reactions (por nodo de apoyo)

```python
SM.Results.Setup.SetCaseSelectedForOutput("Dead")
for joint_name in ["1", "2", "3", "4"]:
    ret = SM.Results.JointReact(joint_name, 0)
    # Signature: (NumberResults, Obj, Elm, LoadCase, StepType, StepNum,
    #             F1, F2, F3, M1, M2, M3)
    if ret[0] > 0:
        Fz = ret[8][0]  # ¡Cuidado! ret[8] es F3 (vertical) — index varia
```

---

## 9. Displacements

### Por nodo (post-static-analysis)

```python
SM.Results.Setup.SetCaseSelectedForOutput("Dead")
ret = SM.Results.JointDispl("1", 0)
# Signature: (NumberResults, Obj, Elm, LoadCase, StepType, StepNum,
#             U1, U2, U3, R1, R2, R3)
Ux = ret[6][0]
Uy = ret[7][0]
Uz = ret[8][0]
```

### Modal mode shapes

```python
# OpenSees: ops.nodeEigenvector(node, mode_index, dof)
# ETABS: NO hay API directa para mode shapes nodales en ETABS 19.1
# Workaround: leer JointDispl con StepType="Mode" → solo si el case modal está
# configurado para almacenar mode shapes (default Yes)
```

---

## 10. Auto-mesh — verificar discretización

```python
# Total internal elements después de RunAnalysis
n_pt_elm   = SM.PointElm.Count()
n_line_elm = SM.LineElm.Count()
n_area_elm = SM.AreaElm.Count()

# Por ejemplo, para mesa-torsion (losa 6×6 con FLOORMESHMAXSIZE 1.25):
# → 25 AreaElm = 5×5 grid de 1.2m cada uno
# → 40 PointElm = 4 base + 36 floor (grid 6×6)
# → 24 LineElm = 4 cols + 4×5 vigas perimetrales
```

### Rigid end offsets automáticos

ETABS aplica rigid zones automáticos en intersecciones col-viga **basado en
las dimensiones de las secciones** (no en los `RIGIDOFFSET` del e2k, que
están a 0 por default). Para un nodo donde una col 40×40 se cruza con una
viga 30×50:
- El col upper segment dentro del beam depth (0.5m) queda RÍGIDO → la longitud
  flexible del col es `H - h_beam = 4 - 0.5 = 3.5 m`
- El beam end dentro del col width (0.4m) queda RÍGIDO → longitud flexible
  del beam es `L - 2 × b_col/2 = 6 - 0.4 = 5.6 m`

Esto explica por qué las stations de FrameForce empiezan en sta=0.2 para
las vigas (no 0.0) y terminan en 3.5 para las cols (no 4.0).

---

## 11. Stiffness modifiers (sección agrietada para sismo)

ETABS aplica modificadores de rigidez **solo si están explícitamente
seteados** en el e2k (`PROPERTYMODIFIER ... I 0.7`). Por default = 1.0
(sección bruta).

Para el modelo Mesa torsión: **no hay modificadores activos** → cols
trabajan con Ig completo. Esto es típico para mesas didácticas pero NO
para diseño sísmico real (ACI 318 §6.6.3.1 recomienda 0.7×Ig cols,
0.35×Ig vigas, 0.25×Ig slabs).

---

## 12. Mass source

```python
# ETABS mass source default: "MsSrc1"
# INCLUDEELEMENTS=Yes    → selfweight de cada elemento
# INCLUDEADDEDMASS=Yes   → masas puntuales/distribuidas extra
# INCLUDELOADS=No        → patterns NO contribuyen a masa (típico Modal)
# INCLUDELATERALMASS=Yes → masa para modos UX UY RZ
# INCLUDEVERTICALMASS=No → masa para modos UZ RX RY EXCLUIDA
# LUMPATSTORIES=Yes      → toda la masa lumped en master node de cada story
```

Para **matchear ETABS desde un FEM externo** (Hekatan/OpenSees):
- Usar `nDMaterial ElasticIsotropic` con la densidad `rho = γ/g`
- O usar masas nodales lumped en el master node del diafragma rígido
- **DESACTIVAR** masa en DOFs UZ, RX, RY (los modos vertical no participan)

---

## 13. Patrón completo end-to-end

Ver `python-verificado/15_mesa_torsion.py` y
`python-verificado/16_mesa_torsion_frame_forces.py` para el flujo completo:

```
1. attach via GetActiveObject
2. SM.File.OpenFile(e2k)
3. SM.File.Save(workcopy.edb)
4. SM.SetModelIsLocked(False)
5. SM.Analyze.SetRunCaseFlag("", False, True) + activar cases
6. SM.Analyze.RunAnalysis()
7. SM.Analyze.GetCaseStatus() → verificar code=4 (Finished)
8. Setup.SetCaseSelectedForOutput(case)
9. Modal: Results.ModalPeriod() + ModalParticipatingMassRatios()
10. Static: Results.BaseReact() + Results.JointReact() + Results.JointDispl()
11. Frames: Results.FrameForce(LineElm_id_numeric)
12. JSON dump
```

---

## 13b. Shell forces (M11, M22, M12, V13, V23)

### ❌ Lo que NO funciona

```python
# ItemTypeElm=0 (Object) → retorna 0 results aunque el Object existe
SM.Results.AreaForceShell("F1", 0)  # n=0
```

### ✅ Lo que SÍ funciona — iterar AreaElm individualmente

```python
# Tras RunAnalysis(), AreaObj "F1" se auto-mesha en N AreaElm numerados "1".."N"
n_area_elm = SM.AreaElm.Count()
for i in range(n_area_elm):
    elm_name = str(i + 1)
    ret = SM.Results.AreaForceShell(elm_name, 1)  # ItemTypeElm=1 = Element
```

### Estructura del tuple devuelto

**ETABS 22** (24 campos):
```
[0]  NumberResults
[1]  Obj[]              # AreaObj original
[2]  Elm[]              # AreaElm name
[3]  PointElm[]         # corner point of element (4 per Q4)
[4]  LoadCase[]
[5]  StepType[]
[6]  StepNum[]
[7]  F11[]   [8]  F22[]   [9]  F12[]      # membrane forces (tonf/m)
[10] FMax[]  [11] FMin[]  [12] FAngle[]   [13] FVM[]   # principal + von Mises
[14] M11[]   [15] M22[]   [16] M12[]      # BENDING moments (tonf·m/m) ← KEY
[17] MMax[]  [18] MMin[]  [19] MAngle[]
[20] V13[]   [21] V23[]                    # transverse SHEAR (tonf/m) ← KEY
[22] VMax[]  [23] VAngle[]
```

**SAP2000** (21 campos, sin FVM): todos los M shift -1.

### Convención sign Shell

| Componente | Significado físico |
|---|---|
| M11 > 0 | Fibra inferior en tracción en cara perpendicular al eje 1 local |
| M22 > 0 | Fibra inferior en tracción en cara perpendicular al eje 2 local |
| M12    | Torsión de placa (twisting moment) |
| F11/F22 | Membrane stress × thickness (in-plane) |
| V13/V23 | Out-of-plane shear (Mindlin-Reissner Q4) |

### ⚠️ Gotcha de naming: AreaObj se RENOMBRA tras Save

```python
# En el e2k del usuario: AREA "F1" → AreaObj name = "F1"
# Tras File.Save() vía API → ETABS renombra a "2" (siguiente numérico libre)
# Y los AreaElm auto-mesheados son "2-1", "2-2"..."2-25"

# Bug comtypes: AreaObj.GetNameFromIndex CRASHEA, pero AreaObj.GetNameList SÍ FUNCIONA
ret = SM.AreaObj.GetNameList(0, [])  # ret[1] = ('2',)
ret = SM.AreaElm.GetNameList(0, [])  # ret[1] = ('2-1','2-2',...'2-25')
```

### 🔴 RIGID DIAPHRAGM bloquea shell results de la losa

Si el AreaObj está asignado a un `DIAPHRAGM "X" TYPE RIGID`, **ETABS NO
calcula M11/M22/M12 de bending** para esa losa. Razón: el diafragma rígido
reemplaza la rigidez de membrana del shell — internamente la losa pasa a ser
una restricción cinemática (UX, UY, Rz amarrados al master node), no un
elemento con stiffness propio.

```python
# Detectar el caso:
ret = SM.Results.AreaForceShell("2", 0)
# Si retorna n=0 a pesar de que el análisis está finished y los frames sí
# devuelven resultados → probablemente diafragma rígido absorbe la losa.

# Solución estructural (cambiar el modelo):
# - En GUI: Define → Diaphragm → cambiar TYPE RIGID → SEMIRIGID
# - O remover la asignación de diafragma del Story
# - Re-correr análisis
# Con SEMIRIGID, la losa contribuye con su shell stiffness y ETABS reporta
# M11/M22/M12. Pero esto puede cambiar la dinámica modal (más modos verticales).
```

**Para "Mesa de Torsión" didáctica**: el `RIGID` es deliberado — fuerza
compatibilidad de UX/UY/Rz al master, mostrando claramente la torsión global
del sistema cols+vigas. Aceptar que la losa NO tiene shell results es parte
del modelo. La torsión que querés ver aparece en `T` de las VIGAS perimetrales
(no en `M12` de la losa).

---

## 14. Gotchas de GUI tras correr API

### ⚠️ "Error in performing miOpen" después de `RunAnalysis()` por API

Después de que un script Python corre `SM.Analyze.RunAnalysis()`, si seguís
con ETABS GUI abierto y intentás ver el modelo, puede aparecer:

```
Warning: Error in performing miOpen
Status bar: "Reading Mesh information"
```

**Causas**:
- ETABS GUI re-lee el mesh tras un analyze externo y el formato post-auto-mesh
  no siempre coincide con lo que la GUI espera mostrar
- Versión de EDB del usuario es ligeramente distinta a la GUI activa
  (ej. EDB creado en 22.5.0 abierto en 22.6.0)

**Es no-fatal**: los resultados ya extraídos via API son válidos. El JSON
producido sigue siendo correcto.

**Workarounds**:
1. Click `Aceptar` — el modelo queda en memoria pero la display puede quedar
   en blanco. Para volver a ver:
   - `File → Close model` (NO save)
   - `File → Open` → reabrir el EDB
   - F5 (Run Analysis) desde la GUI esta vez
2. Para evitarlo en futuras corridas API: hacer `SM.File.Save()` con un nombre
   distinto (workcopy.EDB) antes del análisis, así el archivo original queda
   intacto y reabrible desde la GUI.

### 🔴 Si el popup persiste cada vez que abrís el EDB original

Significa que el archivo del usuario quedó **corrompido** tras un
RunAnalysis previo que guardó estado interno mal-meshado. La GUI lo
detecta al cargar y se atasca en "Reading Mesh information".

**Fix definitivo**:
1. Restaurar el EDB original desde fuente limpia (la copia que el usuario
   te pasó, ej. Downloads).
2. Modificar el script para que SIEMPRE haga `Save` con un nombre distinto
   (`_workcopy_*.EDB`) **inmediatamente después** de `OpenFile`, antes de
   `RunAnalysis`. Así todas las modificaciones del script van al workcopy
   y el original queda intacto.

```python
# Patrón seguro:
SM.File.OpenFile(EDB_original)
SM.File.Save(EDB_workcopy)  # ← inmediato, antes de tocar nada
SM.SetModelIsLocked(False)
SM.Analyze.RunAnalysis()    # afecta workcopy, no original
```

---

## 15. Recursos

- `CSI API ETABS v1.chm` (en `etabs-api/`)
- CSI Analysis Reference Manual (en `Pdf/CSI/`)
- Edward Wilson — `Analisis Estatico y Dinamico de Estructuras` (teoría detrás)
- Validacion contraste FEM externo: `validacion/Python/iterate_mesa_torsion.py`
