# 🚀 Quickstart OAPI — Extraer resultados ETABS/SAP2000/SAFE

Cheat sheet rápido para usar PowerShell + OAPI desde cualquier computadora.

---

## ⚙ Pre-requisitos (una sola vez por PC)

| Item | Cómo verificar | Si falta |
|---|---|---|
| ETABS / SAP2000 / SAFE instalado | `Get-Process` (busca instancia abierta) | Instalar producto CSI |
| PowerShell 5.1+ | `$PSVersionTable.PSVersion` | Win10/11 viene incluido |
| Repo hekatan-struct-lineal clonado | `Test-Path "C:\Hekatan\hekatan-struct-lineal"` | Ver sección "Setup" abajo |

---

## ⚡ Comandos rápidos (copiar/pegar)

### **ETABS — extraer .EDB o .e2k**

```powershell
cd "C:\Hekatan\hekatan-struct-lineal\Etabs Powershell"
.\extraer_etabs.bat
```

**Qué pasa**:
1. Se abre una ventana negra que dice: `Arrastra tu archivo .EDB (analizado) o .e2k (texto)`
2. **Arrastrás el archivo** desde el explorador a la ventana
3. **Enter**
4. Esperás 20–60 segundos (ETABS tarda en arrancar)
5. **JSON listo** al lado del archivo original

**Output esperado**:
```
[INFO] Conectando a ETABS via OAPI...
[INFO] Model: 312 points, 555 frames, 72 areas
[INFO] 38376 reactions extraidas
[INFO] 12 modos extraidos
[INFO] 960 drifts extraidos
[OK] JSON guardado: V01_results.json (~40 MB para edificio mediano)
```

---

### **SAP2000 — extraer .sdb o .s2k**

```powershell
cd "C:\Hekatan\hekatan-struct-lineal\Sap2000 Powershell"
.\extraer_sap2000.bat
```

**Diferencia clave vs ETABS**: SAP2000 arranca con `ApplicationStart(units, visible, file)` con 3 args. Sino: error.

**Output esperado**:
```
[INFO] Conectando a SAP2000 via OAPI...
[INFO] Model: 99 points, 36 frames, 80 areas, 1 cases, 80 combos
[INFO] 891 reactions extraidas
[INFO] 12 modos extraidos
[OK] JSON: portico.json
```

---

### **SAFE — extraer .FDB o .f2k**

```powershell
cd "C:\Hekatan\hekatan-struct-lineal\Safe Powershell"
.\extraer_safe.bat
```

**Especialidad SAFE**: extrae **soil pressure** Winkler nativo + M11/M22 momentos placa (cimentaciones).

**Output esperado**:
```
[INFO] Conectando a SAFE via OAPI...
[INFO] Soil pressure: 100 zonas Winkler
[INFO] M11_max = 145 kN.m/m
[OK] JSON: zapata_results.json
```

---

## 🎯 Workflow integrado completo

```
┌─────────────────────────────────────────────────────────────┐
│  PASO 1: Tener modelo CSI                                   │
│  - .EDB / .e2k para ETABS                                   │
│  - .sdb / .s2k para SAP2000                                 │
│  - .FDB / .f2k para SAFE                                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 2: Drag-and-drop sobre extraer_<programa>.bat        │
│  → genera <modelo>_results.json al lado                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  PASO 3: Comparar contra hekatan-fem (opcional)             │
│  cd Benchmark_Placa                                          │
│  npx tsx benchmark_placa_hekatan.mjs                        │
│  → muestra diff numérico vs SAP/ETABS/SAFE                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠 Comandos avanzados

### Procesar MUCHOS archivos en lote (ETABS)

```powershell
cd "C:\Hekatan\hekatan-struct-lineal\Etabs Powershell"

# Proceso recursivo de todos los .EDB de una carpeta
.\batch_extraer.ps1 -Folder "C:\proyectos\edificios"
# Genera 1 JSON por cada .EDB encontrado
```

### Comando directo (sin .bat) para automatización

```powershell
# ETABS
powershell -ExecutionPolicy Bypass `
  -File "C:\Hekatan\hekatan-struct-lineal\Etabs Powershell\etabs_extract.ps1" `
  -ModelPath "C:\modelos\edificio.EDB" `
  -OutPath "C:\modelos\edificio.json"

# SAP2000
powershell -ExecutionPolicy Bypass `
  -File "C:\Hekatan\hekatan-struct-lineal\Sap2000 Powershell\sap2000_extract.ps1" `
  -ModelPath "C:\modelos\portico.sdb" `
  -OutPath "C:\modelos\portico.json"

# SAFE
powershell -ExecutionPolicy Bypass `
  -File "C:\Hekatan\hekatan-struct-lineal\Safe Powershell\safe_extract.ps1" `
  -ModelPath "C:\modelos\zapata.FDB" `
  -OutPath "C:\modelos\zapata.json"
```

### Auto-correr análisis si el modelo NO está analizado

```powershell
# Agregar -RunAnalysis al comando
.\etabs_extract.ps1 -ModelPath "edificio.e2k" -OutPath "out.json" -RunAnalysis
# El .e2k es solo texto sin resultados → fuerza F5 antes de extraer
```

---

## 🐛 Troubleshooting frecuente

| Error / Síntoma | Causa | Solución |
|---|---|---|
| `New-Object : Cannot create object of type 'ETABSv1.Helper'` | ETABS no registró COM | Como admin: `"C:\Program Files\Computers and Structures\ETABS 19\ETABS.exe" /regserver` |
| `0 reactions extraidas` | Modelo no analizado | Agregar `-RunAnalysis` al comando |
| `Excepción al llamar a "ApplicationStart"` con SAP | Firma 3 args necesaria | El script ya usa `ApplicationStart(6, $false, "")` — verificá versión SAP ≥17 |
| Script congelado en "Conectando..." | Dialog modal SAP/ETABS escondido | Cerrar todas instancias CSI: `Get-Process | Where Name -match "ETABS|SAP|SAFE" | Stop-Process -Force` |
| `.\extraer_etabs.bat` no ejecuta | ExecutionPolicy bloqueada | Usar comando directo con `-ExecutionPolicy Bypass` |
| JSON pesa >100 MB | Modelo muy grande | Edita el script y baja `$sample = [Math]::Min($Num, 1000)` a `100` (línea ~290) |
| `OpenFile retorno 1` con .e2k/.s2k/.f2k | Archivo texto mal formado | Abrir manualmente en CSI primero para ver mensaje de error |

---

## ⏱ Tiempos típicos

| Modelo | Análisis F5 | Extracción JSON | Total |
|---|---|---|---|
| Pórtico 2D simple | <1 s | ~5 s | ~30 s (incluye startup) |
| Edificio 5 pisos (~100 frames) | 5–10 s | ~15 s | ~45 s |
| Edificio 10 pisos completo | 30–60 s | ~30 s | ~2 min |
| V01 RIOCHICO (288 nodos, 21 cases, 80 combos) | ~3 s | ~25 s | ~50 s |

**Tip**: si vas a hacer múltiples extracciones, **dejá ETABS/SAP/SAFE abierto**. Los scripts usan **warm reuse** (`GetObject`) y se conectan a la instancia activa, ahorrando 20-30s de startup cada vez.

---

## 💾 Setup en NUEVA computadora (clone desde GitHub)

### 1. Pre-requisitos

```powershell
# Windows 10/11 con:
# - Git for Windows: https://git-scm.com/download/win
# - Node.js 20+ LTS: https://nodejs.org/
# - ETABS / SAP2000 / SAFE instalado
```

### 2. Clonar el repo

```powershell
mkdir C:\Hekatan
cd C:\Hekatan
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal
git checkout main
```

### 3. (Opcional) Instalar dependencias Node.js para benchmark

```powershell
# Solo si vas a correr benchmarks Hekatan vs SAP/ETABS/SAFE
cd C:\Hekatan\hekatan-struct-lineal
npm install
cd hekatan-fem && npm install && cd ..
cd examples && npm install && cd ..
```

### 4. Ya está listo

```powershell
# Las herramientas PowerShell funcionan SIN instalar nada Node.js:
cd "C:\Hekatan\hekatan-struct-lineal\Etabs Powershell"
.\extraer_etabs.bat
```

---

## 🔄 Sincronizar entre computadoras (workflow git)

### Antes de empezar a trabajar (en CUALQUIER PC):

```powershell
cd C:\Hekatan\hekatan-struct-lineal
git pull origin main
```

### Después de hacer cambios:

```powershell
git add .
git commit -m "qué hiciste"
git push hekatan-struct-lineal main
```

### Si tu otra PC ya hizo commits divergentes:

```powershell
git fetch
git pull --rebase  # o resolver merge manual si hay conflictos
git push
```

---

## 📋 Cheat sheet de una página (imprime y pegá al lado del PC)

```
╔════════════════════════════════════════════════════════════════╗
║  COMANDOS RÁPIDOS — Extraer resultados CSI a JSON              ║
╠════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ETABS (.EDB / .e2k):                                          ║
║    cd "C:\Hekatan\hekatan-struct-lineal\Etabs Powershell"              ║
║    .\extraer_etabs.bat       → arrastra .EDB                    ║
║                                                                  ║
║  SAP2000 (.sdb / .s2k):                                        ║
║    cd "C:\Hekatan\hekatan-struct-lineal\Sap2000 Powershell"            ║
║    .\extraer_sap2000.bat     → arrastra .sdb                    ║
║                                                                  ║
║  SAFE (.FDB / .f2k):                                           ║
║    cd "C:\Hekatan\hekatan-struct-lineal\Safe Powershell"               ║
║    .\extraer_safe.bat        → arrastra .FDB                    ║
║                                                                  ║
║  ──────────────────────────────────────────────────────────     ║
║  Sync GitHub:    git pull / git push                            ║
║  Cleanup CSI:    Get-Process |                                  ║
║                  Where Name -match "ETABS|SAP|SAFE" |           ║
║                  Stop-Process -Force                            ║
║  ──────────────────────────────────────────────────────────     ║
║                                                                  ║
║  Repos:                                                          ║
║    https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal        ║
║      branch: main                     ║
║    https://github.com/GiorgioBurbanelli89/Calcpad-Symbolic      ║
║      branch: main                                               ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 📖 Más información

- **Detalle ETABS**: `Etabs Powershell/README.md`
- **Detalle SAP2000**: `Sap2000 Powershell/README.md`
- **Detalle SAFE**: `Safe Powershell/README.md`
- **Guía integrada**: `BENCHMARK_GUIDE.md`
- **Estado del benchmark**: `Benchmark_Placa/REPORTE_FINAL.md`
- **Acciones pendientes**: `PROMPT_CONTINUACION.md`
